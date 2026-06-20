import fs from 'node:fs';
import path from 'node:path';
import {
  classifyOutcome,
  fetchRecord,
  processSourcePackRecords,
  readJsonl,
  summarizeRows,
  writeJson,
  writeJsonl,
} from './ca-source-pack-lightweight-lib.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const defaultSourceDir = path.join(repoRoot, 'data', 'source_packs', 'california');
const defaultOutputDir = path.join(repoRoot, 'data', 'generated');

function parseArgs(argv) {
  const parsed = {
    sourceDir: defaultSourceDir,
    outputDir: defaultOutputDir,
    delayMs: 400,
    retryDelayMs: 1000,
    requestTimeoutMs: 20000,
    bodyTimeoutMs: 20000,
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, value = ''] = arg.slice(2).split('=');
    if (key === 'source-dir') parsed.sourceDir = path.resolve(value);
    if (key === 'output-dir') parsed.outputDir = path.resolve(value);
    if (key === 'delay-ms') parsed.delayMs = Number(value);
    if (key === 'retry-delay-ms') parsed.retryDelayMs = Number(value);
    if (key === 'request-timeout-ms') parsed.requestTimeoutMs = Number(value);
    if (key === 'body-timeout-ms') parsed.bodyTimeoutMs = Number(value);
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

function buildOutputRow(record, result) {
  return {
    state: record.state,
    entity_id: record.entity_id,
    source_role: record.source_role,
    authority: record.authority,
    agency: record.agency,
    original_status: record.status,
    batch_class: record.batch_class,
    provenance_url: record.provenance_url || '',
    url: record.url,
    final_url: result.finalUrl,
    http_status: result.httpStatus,
    content_type: result.contentType,
    fetched_at: new Date().toISOString(),
    fetch_status: classifyOutcome(record, result),
    evidence_title: result.evidenceTitle,
    evidence_h1: result.evidenceH1,
    evidence_h2s: result.evidenceH2s,
    text_sample: result.textSample,
    parser_used: result.parserUsed,
    error_code: result.errorCode || '',
    error_message: result.errorMessage || '',
    canonical_url: result.canonicalUrl || '',
    outbound_official_links: result.outboundOfficialLinks || [],
    discovered_leaf: result.discoveredLeaf,
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

  const { results, failures, blocked, uniqueFetchCount } = await processSourcePackRecords(
    inputRows,
    args,
    buildOutputRow,
    fetchRecord,
  );

  const summary = {
    generated_at: new Date().toISOString(),
    sourceDir: args.sourceDir,
    outputDir: args.outputDir,
    inputs: {
      officialPackPath,
      directoryPackPath,
      repairLedgerPath,
      coverageMatrixPath,
      manifestPath,
      totalInputRows: inputRows.length,
      officialRows: manifest.files?.['ca_official_source_pack_v2.jsonl']?.records ?? 0,
      directoryRows: manifest.files?.['ca_directory_targets_v1.jsonl']?.records ?? 0,
      repairLedgerRows: repairLedger.length,
      coverageMatrixRows: coverageMatrix.rowCount,
    },
    manifest,
    repairLedgerCounts: repairLedger.reduce((accumulator, row) => {
      accumulator[row.ledger] = (accumulator[row.ledger] || 0) + 1;
      return accumulator;
    }, {}),
    outputs: {
      resultsPath: path.join(args.outputDir, 'ca_scrape_results_v1.jsonl'),
      failuresPath: path.join(args.outputDir, 'ca_fetch_failures_v1.jsonl'),
      blockedPath: path.join(args.outputDir, 'ca_blocked_targets_v1.jsonl'),
      summaryPath: path.join(args.outputDir, 'ca_source_completion_summary_v1.json'),
      resultCount: results.length,
      failureCount: failures.length,
      blockedCount: blocked.length,
      categoryTotal: results.length + failures.length + blocked.length,
      uniqueFetchCount,
    },
    counts: {
      ...summarizeRows([...results, ...failures, ...blocked]),
    },
  };

  if (summary.outputs.categoryTotal !== inputRows.length) {
    throw new Error(`Category mismatch: expected ${inputRows.length} outputs, found ${summary.outputs.categoryTotal}.`);
  }

  writeJsonl(summary.outputs.resultsPath, results);
  writeJsonl(summary.outputs.failuresPath, failures);
  writeJsonl(summary.outputs.blockedPath, blocked);
  writeJson(summary.outputs.summaryPath, summary);

  console.log(JSON.stringify({
    ok: true,
    totalInputRows: inputRows.length,
    resultCount: results.length,
    failureCount: failures.length,
    blockedCount: blocked.length,
    summaryPath: summary.outputs.summaryPath,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
