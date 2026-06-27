import fs from 'node:fs';
import path from 'node:path';
import { executeSourcePackRun, readJsonl, writeJson, writeJsonl } from './ca-source-pack-lightweight-lib.mjs';

const repoRoot = process.cwd();

function parseInteger(value, fallbackValue) {
  if (value === undefined || value === '') return fallbackValue;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Invalid numeric flag value: ${value}`);
  }
  return parsed;
}

export function parseArgs(argv) {
  const outputDir = path.join(repoRoot, 'data', 'generated');
  const runsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');
  const parsed = {
    runId: 'ca-next-source-seed-v1',
    queuePath: path.join(outputDir, 'california-next-source-seed-queue-v1.jsonl'),
    outputDir,
    runsDir,
    mode: 'plan-only',
    delayMs: 400,
    retryDelayMs: 1000,
    requestTimeoutMs: 20000,
    bodyTimeoutMs: 20000,
    maxResponseBytes: 15 * 1024 * 1024,
    limit: 0,
    offset: 0,
    resume: false,
    maxConcurrency: 4,
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const withoutPrefix = arg.slice(2);
    const [key, rawValue] = withoutPrefix.includes('=') ? withoutPrefix.split(/=(.*)/s, 2) : [withoutPrefix, undefined];
    const value = rawValue ?? '';

    if (key === 'run-id') parsed.runId = value;
    else if (key === 'queue-path') parsed.queuePath = path.resolve(value);
    else if (key === 'output-dir') parsed.outputDir = path.resolve(value);
    else if (key === 'runs-dir') parsed.runsDir = path.resolve(value);
    else if (key === 'mode') parsed.mode = value || parsed.mode;
    else if (key === 'delay-ms') parsed.delayMs = parseInteger(value, parsed.delayMs);
    else if (key === 'retry-delay-ms') parsed.retryDelayMs = parseInteger(value, parsed.retryDelayMs);
    else if (key === 'request-timeout-ms') parsed.requestTimeoutMs = parseInteger(value, parsed.requestTimeoutMs);
    else if (key === 'body-timeout-ms') parsed.bodyTimeoutMs = parseInteger(value, parsed.bodyTimeoutMs);
    else if (key === 'max-response-bytes') parsed.maxResponseBytes = parseInteger(value, parsed.maxResponseBytes);
    else if (key === 'limit') parsed.limit = parseInteger(value, parsed.limit);
    else if (key === 'offset') parsed.offset = parseInteger(value, parsed.offset);
    else if (key === 'max-concurrency') parsed.maxConcurrency = Math.max(1, parseInteger(value, parsed.maxConcurrency));
    else if (key === 'resume') parsed.resume = value === '' ? true : value !== 'false';
  }

  return parsed;
}

export function mapSeedQueueRowToSourcePackRow(row) {
  return {
    state: 'CA',
    entity_id: row.family,
    source_role: row.sourceRole,
    url: row.url,
    authority: row.authority,
    agency: row.owner,
    status: 'verified_target',
    batch_class: row.batchClass,
    provenance_url: row.url,
    fetched_at: '',
    review_scope: row.queueLane,
    source_type: row.sourceType,
    target_kind: row.targetKind,
    expected_coverage: row.expectedCoverage,
    display_status_on_ingest: row.displayStatusOnIngest,
    normalized_domain: row.normalizedDomain,
    notes: row.notes,
    seed_job_id: row.jobId,
    family: row.family,
    label: row.label,
  };
}

function summarize(rows, key) {
  return rows.reduce((acc, row) => {
    const bucket = String(row[key] || 'unknown');
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
}

export function buildSeedRunPlan(queueRows, args) {
  const inputRows = queueRows.map(mapSeedQueueRowToSourcePackRow);
  const mappedPackPath = path.join(args.outputDir, 'california-next-source-seed-pack-v1.jsonl');
  const planSummaryPath = path.join(args.outputDir, 'california-next-source-seed-run-plan-v1.json');
  writeJsonl(mappedPackPath, inputRows);

  const planSummary = {
    generatedAt: new Date().toISOString(),
    runId: args.runId,
    mode: args.mode,
    queuePath: path.relative(repoRoot, args.queuePath),
    mappedPackPath: path.relative(repoRoot, mappedPackPath),
    queueRows: queueRows.length,
    mappedRows: inputRows.length,
    byFamily: summarize(queueRows, 'family'),
    byBatchClass: summarize(queueRows, 'batchClass'),
  };
  writeJson(planSummaryPath, planSummary);

  return {
    inputRows,
    mappedPackPath,
    planSummaryPath,
    planSummary,
  };
}

export async function runCaliforniaNextSourceSeedQueue(args, fetchImpl = global.fetch) {
  if (!fs.existsSync(args.queuePath)) {
    throw new Error(`Missing California seed queue at ${args.queuePath}. Run node scripts/generate-california-next-source-seed-queue-v1.mjs first.`);
  }

  const queueRows = readJsonl(args.queuePath);
  const { inputRows, mappedPackPath, planSummaryPath, planSummary } = buildSeedRunPlan(queueRows, args);

  if (args.mode === 'plan-only') {
    return {
      ok: true,
      mode: 'plan-only',
      queueRows: queueRows.length,
      mappedRows: inputRows.length,
      mappedPackPath: path.relative(repoRoot, mappedPackPath),
      planSummaryPath: path.relative(repoRoot, planSummaryPath),
    };
  }

  const runDir = path.join(args.runsDir, args.runId);
  fs.mkdirSync(runDir, { recursive: true });

  const { summary, selectedCount, completedCount } = await executeSourcePackRun({
    runId: args.runId,
    inputRows,
    repairLedger: [],
    sourceDir: path.dirname(args.queuePath),
    outputDir: args.outputDir,
    runDir,
    args,
    fetchImpl,
  });

  return {
    ok: true,
    mode: args.mode,
    runId: args.runId,
    queueRows: queueRows.length,
    mappedRows: inputRows.length,
    selectedCount,
    completedCount,
    resultCount: summary.outputs.resultCount,
    failureCount: summary.outputs.failureCount,
    blockedCount: summary.outputs.blockedCount,
    discoveredCount: summary.outputs.discoveredCount,
    summaryPath: summary.outputs.summaryPath,
    planSummary,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await runCaliforniaNextSourceSeedQueue(args);
  console.log(JSON.stringify(result, null, 2));
}

const entryScriptPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
const modulePath = path.resolve(new URL(import.meta.url).pathname);
if (entryScriptPath === modulePath) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
  });
}
