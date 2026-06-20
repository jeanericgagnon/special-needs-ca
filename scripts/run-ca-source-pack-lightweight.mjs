import fs from 'node:fs';
import path from 'node:path';
import {
  executeSourcePackRun,
  readJsonl,
} from './ca-source-pack-lightweight-lib.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const defaultSourceDir = path.join(repoRoot, 'data', 'source_packs', 'california');
const defaultOutputDir = path.join(repoRoot, 'data', 'generated');
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
    runId: 'ca-source-pack-v1',
    sourceDir: defaultSourceDir,
    outputDir: defaultOutputDir,
    runsDir: defaultRunsDir,
    delayMs: 400,
    retryDelayMs: 1000,
    requestTimeoutMs: 20000,
    bodyTimeoutMs: 20000,
    maxResponseBytes: 15 * 1024 * 1024,
    limit: 0,
    offset: 0,
    resume: false,
    maxConcurrency: 4,
    simulateCrashAfter: 0,
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const withoutPrefix = arg.slice(2);
    const [key, rawValue] = withoutPrefix.includes('=') ? withoutPrefix.split(/=(.*)/s, 2) : [withoutPrefix, undefined];
    const value = rawValue ?? '';

    if (key === 'run-id') parsed.runId = value;
    else if (key === 'source-dir') parsed.sourceDir = path.resolve(value);
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

function requiredFile(sourceDir, name) {
  const filePath = path.join(sourceDir, name);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${name} in ${sourceDir}. Place the California source pack files under data/source_packs/california/.`);
  }
  return filePath;
}

function readCoverageCsv(filePath) {
  const rows = fs.readFileSync(filePath, 'utf8').trim().split('\n');
  return {
    header: rows[0] || '',
    rowCount: Math.max(rows.length - 1, 0),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifestPath = requiredFile(args.sourceDir, 'ca_source_pack_manifest_v2.json');
  const officialPackPath = requiredFile(args.sourceDir, 'ca_official_source_pack_v2.jsonl');
  const directoryPackPath = requiredFile(args.sourceDir, 'ca_directory_targets_v1.jsonl');
  const repairLedgerPath = requiredFile(args.sourceDir, 'ca_source_repair_ledger_v2.jsonl');
  const coverageMatrixPath = requiredFile(args.sourceDir, 'ca_source_coverage_matrix_v1.csv');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const repairLedger = readJsonl(repairLedgerPath);
  const coverageMatrix = readCoverageCsv(coverageMatrixPath);
  const inputRows = [
    ...readJsonl(officialPackPath),
    ...readJsonl(directoryPackPath),
  ];

  const runDir = path.join(args.runsDir, args.runId);
  fs.mkdirSync(runDir, { recursive: true });

  const { summary } = await executeSourcePackRun({
    runId: args.runId,
    inputRows,
    repairLedger,
    sourceDir: args.sourceDir,
    outputDir: args.outputDir,
    runDir,
    args,
  });

  const enrichedSummary = {
    ...summary,
    inputs: {
      ...summary.inputs,
      officialPackPath,
      directoryPackPath,
      repairLedgerPath,
      coverageMatrixPath,
      manifestPath,
      officialRows: manifest.files?.['ca_official_source_pack_v2.jsonl']?.records ?? 0,
      directoryRows: manifest.files?.['ca_directory_targets_v1.jsonl']?.records ?? 0,
      repairLedgerRows: repairLedger.length,
      coverageMatrixRows: coverageMatrix.rowCount,
    },
    manifest,
    runOptions: {
      runId: args.runId,
      limit: args.limit,
      offset: args.offset,
      resume: args.resume,
      maxConcurrency: args.maxConcurrency,
      maxResponseBytes: args.maxResponseBytes,
    },
  };

  fs.writeFileSync(summary.outputs.summaryPath, `${JSON.stringify(enrichedSummary, null, 2)}\n`);

  console.log(JSON.stringify({
    ok: true,
    runId: args.runId,
    totalInputRows: inputRows.length,
    completedInputRows: enrichedSummary.inputs.completedInputRows,
    remainingInputRows: enrichedSummary.inputs.remainingInputRows,
    resultCount: enrichedSummary.outputs.resultCount,
    failureCount: enrichedSummary.outputs.failureCount,
    blockedCount: enrichedSummary.outputs.blockedCount,
    repairCount: enrichedSummary.outputs.repairCount,
    authorFirstCount: enrichedSummary.outputs.authorFirstCount,
    discoveredCount: enrichedSummary.outputs.discoveredCount,
    browserAssistedCount: enrichedSummary.outputs.browserAssistedCount,
    parseAdapterCount: enrichedSummary.outputs.parseAdapterCount,
    summaryPath: enrichedSummary.outputs.summaryPath,
    runDir,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
