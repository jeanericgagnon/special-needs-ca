import fs from 'node:fs';
import path from 'node:path';
import {
  executeSourcePackRun,
  writeJson,
  writeJsonl,
} from './ca-source-pack-lightweight-lib.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const defaultQueuePath = path.join(repoRoot, 'data', 'generated', 'ca_county_office_fetch_now_queue_v1.jsonl');
const defaultOutputDir = path.join(repoRoot, 'data', 'generated', 'ca_county_office_fetch_now_v1');
const defaultRunsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');

function parseInteger(value, fallbackValue) {
  if (value === undefined || value === '') return fallbackValue;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Invalid numeric flag value: ${value}`);
  }
  return parsed;
}

function parseArgs(argv) {
  const parsed = {
    runId: 'ca-county-office-fetch-now-v1',
    queuePath: defaultQueuePath,
    outputDir: defaultOutputDir,
    runsDir: defaultRunsDir,
    delayMs: 400,
    retryDelayMs: 1000,
    requestTimeoutMs: 20000,
    bodyTimeoutMs: 20000,
    maxResponseBytes: 3 * 1024 * 1024,
    limit: 0,
    offset: 0,
    resume: false,
    maxConcurrency: 2,
    simulateCrashAfter: 0,
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
    else if (key === 'delay-ms') parsed.delayMs = parseInteger(value, parsed.delayMs);
    else if (key === 'retry-delay-ms') parsed.retryDelayMs = parseInteger(value, parsed.retryDelayMs);
    else if (key === 'request-timeout-ms') parsed.requestTimeoutMs = parseInteger(value, parsed.requestTimeoutMs);
    else if (key === 'body-timeout-ms') parsed.bodyTimeoutMs = parseInteger(value, parsed.bodyTimeoutMs);
    else if (key === 'max-response-bytes') parsed.maxResponseBytes = parseInteger(value, parsed.maxResponseBytes);
    else if (key === 'limit') parsed.limit = parseInteger(value, parsed.limit);
    else if (key === 'offset') parsed.offset = parseInteger(value, parsed.offset);
    else if (key === 'max-concurrency') parsed.maxConcurrency = Math.max(1, parseInteger(value, parsed.maxConcurrency));
    else if (key === 'resume') parsed.resume = value === '' ? true : value !== 'false';
    else if (key === 'simulate-crash-after') parsed.simulateCrashAfter = parseInteger(value, 0);
  }

  return parsed;
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

export function mapQueueRowToSourcePackRow(queueRow) {
  const sourceRole = queueRow.targetFamily === 'medicaid_hhs_offices'
    ? 'county_ihss_leaf_candidate'
    : (queueRow.source || queueRow.targetFamily);
  return {
    state: queueRow.state,
    entity_id: queueRow.currentRecordId || queueRow.jobId,
    source_role: sourceRole,
    url: queueRow.candidateUrl,
    authority: 'official_county',
    agency: queueRow.likelyAgency,
    status: queueRow.reviewedStatus,
    batch_class: queueRow.batchClass || 'html',
    provenance_url: queueRow.candidateUrl,
    county_id: queueRow.countyId,
    target_family: queueRow.targetFamily,
    desired_program_id: queueRow.desiredProgramId || '',
    queue_job_id: queueRow.jobId,
    acceptance_rule: queueRow.acceptanceRule || '',
    execution_lane: queueRow.executionLane || '',
  };
}

export async function runCaCountyOfficeFetchNow(rawArgs = parseArgs(process.argv.slice(2)), fetchImpl = global.fetch) {
  const args = rawArgs;
  if (!fs.existsSync(args.queuePath)) {
    throw new Error(`Missing fetch-now queue: ${args.queuePath}`);
  }

  const queueRows = readJsonl(args.queuePath);
  const inputRows = queueRows.map(mapQueueRowToSourcePackRow);
  const repairLedger = [];

  const runDir = path.join(args.runsDir, args.runId);
  fs.mkdirSync(runDir, { recursive: true });
  fs.mkdirSync(args.outputDir, { recursive: true });

  const { summary } = await executeSourcePackRun({
    runId: args.runId,
    inputRows,
    repairLedger,
    sourceDir: path.dirname(args.queuePath),
    outputDir: args.outputDir,
    runDir,
    args,
    fetchImpl,
  });

  const queueMirrorPath = path.join(args.outputDir, 'ca_county_office_fetch_input_v1.jsonl');
  writeJsonl(queueMirrorPath, queueRows);

  const laneSummaryPath = path.join(args.outputDir, 'ca_county_office_fetch_lane_summary_v1.json');
  const laneSummary = {
    generatedAt: new Date().toISOString(),
    runId: args.runId,
    queuePath: args.queuePath,
    queueCount: queueRows.length,
    fetchNowCount: queueRows.length,
    outputs: summary.outputs,
    counts: summary.counts,
    inputMirrorPath: queueMirrorPath,
    runDir,
  };
  writeJson(laneSummaryPath, laneSummary);

  const payload = {
    ok: true,
    runId: args.runId,
    queueCount: queueRows.length,
    completedInputRows: summary.inputs.completedInputRows,
    resultCount: summary.outputs.resultCount,
    failureCount: summary.outputs.failureCount,
    blockedCount: summary.outputs.blockedCount,
    discoveredCount: summary.outputs.discoveredCount,
    parseAdapterCount: summary.outputs.parseAdapterCount,
    laneSummaryPath,
    runDir,
  };
  return payload;
}

async function main() {
  const payload = await runCaCountyOfficeFetchNow(parseArgs(process.argv.slice(2)));
  console.log(JSON.stringify(payload, null, 2));
}

if (import.meta.url === new URL(process.argv[1], 'file:').toString()) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
