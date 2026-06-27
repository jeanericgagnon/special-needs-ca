import fs from 'node:fs';
import path from 'node:path';
import { readJsonl } from './ca-source-pack-lightweight-lib.mjs';

const repoRoot = process.cwd();
const generatedDataDir = path.join(repoRoot, 'data', 'generated');
const generatedDocsDir = path.join(repoRoot, 'docs', 'generated');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function summarize(rows, key) {
  return rows.reduce((acc, row) => {
    const bucket = String(row[key] || 'unknown');
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function runCaliforniaNextSourceAlignmentAudit() {
  const registryPath = path.join(generatedDataDir, 'california-next-source-registry-v1.json');
  const queueSummaryPath = path.join(generatedDataDir, 'california-next-source-seed-queue-v1.json');
  const queueJsonlPath = path.join(generatedDataDir, 'california-next-source-seed-queue-v1.jsonl');
  const runPlanPath = path.join(generatedDataDir, 'california-next-source-seed-run-plan-v1.json');
  const mappedPackPath = path.join(generatedDataDir, 'california-next-source-seed-pack-v1.jsonl');

  for (const filePath of [registryPath, queueSummaryPath, queueJsonlPath, runPlanPath, mappedPackPath]) {
    assert(fs.existsSync(filePath), `Missing required California next-source artifact: ${path.relative(repoRoot, filePath)}`);
  }

  const registry = readJson(registryPath);
  const queueSummary = readJson(queueSummaryPath);
  const runPlan = readJson(runPlanPath);
  const queueRows = readJsonl(queueJsonlPath);
  const mappedRows = readJsonl(mappedPackPath);

  const registryFamilies = Array.isArray(registry.sourceFamilies) ? registry.sourceFamilies : [];
  const seedEntries = Array.isArray(registry.seedEntries) ? registry.seedEntries : [];
  const seedReadyEntries = seedEntries.filter((entry) => entry.validationStatus === 'seed_ready');

  const byFamily = summarize(queueRows, 'family');
  const mappedByFamily = summarize(mappedRows, 'family');
  const registryByFamily = registry.summary?.byFamily || {};

  const failures = [];
  const addFailure = (code, message) => failures.push({ code, message });

  if ((registry.summary?.totalFamilies || 0) !== registryFamilies.length) {
    addFailure('registry_family_count_mismatch', 'Registry summary family count does not match family definitions.');
  }
  if ((registry.summary?.seedReadyCount || 0) !== seedReadyEntries.length) {
    addFailure('seed_ready_count_mismatch', 'Registry summary seed-ready count does not match seed entries.');
  }
  if (queueSummary.totalRegistrySeeds !== seedEntries.length) {
    addFailure('queue_total_registry_seed_mismatch', 'Queue summary totalRegistrySeeds does not match registry seed entries.');
  }
  if (queueSummary.queueRows !== queueRows.length) {
    addFailure('queue_summary_row_count_mismatch', 'Queue summary queueRows does not match queue JSONL row count.');
  }
  if (runPlan.queueRows !== queueRows.length || runPlan.mappedRows !== mappedRows.length) {
    addFailure('run_plan_count_mismatch', 'Run plan counts do not match queue or mapped pack row counts.');
  }
  if (queueRows.length !== seedReadyEntries.length) {
    addFailure('queue_vs_seed_ready_mismatch', 'Queue row count does not match seed-ready registry rows.');
  }
  if (mappedRows.length !== queueRows.length) {
    addFailure('mapped_vs_queue_mismatch', 'Mapped pack row count does not match queue row count.');
  }

  for (const family of Object.keys(registryByFamily)) {
    if ((queueSummary.byFamily?.[family] || 0) !== registryByFamily[family]) {
      addFailure('queue_family_count_mismatch', `Queue summary byFamily mismatch for ${family}.`);
    }
    if ((runPlan.byFamily?.[family] || 0) !== registryByFamily[family]) {
      addFailure('run_plan_family_count_mismatch', `Run plan byFamily mismatch for ${family}.`);
    }
    if ((byFamily[family] || 0) !== registryByFamily[family]) {
      addFailure('queue_jsonl_family_count_mismatch', `Queue JSONL byFamily mismatch for ${family}.`);
    }
    if ((mappedByFamily[family] || 0) !== registryByFamily[family]) {
      addFailure('mapped_pack_family_count_mismatch', `Mapped pack byFamily mismatch for ${family}.`);
    }
  }

  const queueRowsWithUnknownFamily = queueRows.filter((row) => !registryByFamily[row.family]);
  if (queueRowsWithUnknownFamily.length > 0) {
    addFailure('queue_unknown_family', `Queue contains families absent from registry: ${[...new Set(queueRowsWithUnknownFamily.map((row) => row.family))].join(', ')}`);
  }

  const mappedRowsWithIssues = mappedRows.filter((row) => (
    row.state !== 'CA'
    || row.status !== 'verified_target'
    || row.display_status_on_ingest !== 'needs_review'
    || row.review_scope !== 'registry_seed_fetch'
    || !row.provenance_url
    || !row.seed_job_id
    || !row.normalized_domain
  ));
  if (mappedRowsWithIssues.length > 0) {
    addFailure('mapped_row_contract_violation', `Mapped pack contains ${mappedRowsWithIssues.length} row(s) that violate the seed-runner contract.`);
  }

  const duplicateQueueJobIds = queueRows
    .map((row) => row.jobId)
    .filter((jobId, index, all) => all.indexOf(jobId) !== index);
  if (duplicateQueueJobIds.length > 0) {
    addFailure('duplicate_queue_job_id', `Duplicate queue job IDs found: ${[...new Set(duplicateQueueJobIds)].join(', ')}`);
  }

  const duplicateMappedSeedJobIds = mappedRows
    .map((row) => row.seed_job_id)
    .filter((jobId, index, all) => all.indexOf(jobId) !== index);
  if (duplicateMappedSeedJobIds.length > 0) {
    addFailure('duplicate_mapped_seed_job_id', `Duplicate mapped seed job IDs found: ${[...new Set(duplicateMappedSeedJobIds)].join(', ')}`);
  }

  const result = {
    generatedAt: new Date().toISOString(),
    state: 'california',
    status: failures.length === 0 ? 'pass' : 'fail',
    artifactPaths: {
      registry: path.relative(repoRoot, registryPath),
      queueSummary: path.relative(repoRoot, queueSummaryPath),
      queueJsonl: path.relative(repoRoot, queueJsonlPath),
      runPlan: path.relative(repoRoot, runPlanPath),
      mappedPack: path.relative(repoRoot, mappedPackPath),
    },
    counts: {
      families: registryFamilies.length,
      totalSeedEntries: seedEntries.length,
      seedReadyEntries: seedReadyEntries.length,
      queueRows: queueRows.length,
      mappedRows: mappedRows.length,
    },
    byFamily: registryByFamily,
    invariants: {
      registrySummaryMatchesDefinitions: (registry.summary?.totalFamilies || 0) === registryFamilies.length,
      seedReadyCountMatchesEntries: (registry.summary?.seedReadyCount || 0) === seedReadyEntries.length,
      queueRowsMatchSeedReadyCount: queueRows.length === seedReadyEntries.length,
      mappedRowsMatchQueueRows: mappedRows.length === queueRows.length,
      queueSummaryMatchesQueueJsonl: queueSummary.queueRows === queueRows.length,
      runPlanMatchesQueueAndMappedPack: runPlan.queueRows === queueRows.length && runPlan.mappedRows === mappedRows.length,
      allQueueFamiliesPresentInRegistry: queueRowsWithUnknownFamily.length === 0,
      allMappedRowsStayNeedsReviewOnIngest: mappedRows.every((row) => row.display_status_on_ingest === 'needs_review'),
      allMappedRowsCarryExpectedStateAndStatus: mappedRows.every((row) => row.state === 'CA' && row.status === 'verified_target'),
      noDuplicateQueueJobIds: duplicateQueueJobIds.length === 0,
      noDuplicateMappedSeedJobIds: duplicateMappedSeedJobIds.length === 0,
    },
    failures,
  };

  const outputJson = path.join(generatedDataDir, 'california-next-source-alignment-audit-v1.json');
  const outputMd = path.join(generatedDocsDir, 'california-next-source-alignment-audit-v1.md');
  fs.mkdirSync(generatedDataDir, { recursive: true });
  fs.mkdirSync(generatedDocsDir, { recursive: true });
  writeJson(outputJson, result);

  const invariantLines = Object.entries(result.invariants).map(([key, passed]) => `- ${key}: ${passed ? 'pass' : 'fail'}`);
  const failureLines = failures.length
    ? failures.flatMap((failure) => [`- ${failure.code}: ${failure.message}`])
    : ['- none'];

  fs.writeFileSync(outputMd, [
    '# California Next-Source Alignment Audit v1',
    '',
    `Generated: ${result.generatedAt}`,
    '',
    `- Status: \`${result.status}\``,
    `- Families: \`${result.counts.families}\``,
    `- Seed entries: \`${result.counts.totalSeedEntries}\``,
    `- Seed-ready entries: \`${result.counts.seedReadyEntries}\``,
    `- Queue rows: \`${result.counts.queueRows}\``,
    `- Mapped rows: \`${result.counts.mappedRows}\``,
    '',
    '## By Family',
    ...Object.entries(result.byFamily).map(([family, count]) => `- ${family}: ${count}`),
    '',
    '## Invariants',
    ...invariantLines,
    '',
    '## Failures',
    ...failureLines,
    '',
    '## Artifact Paths',
    ...Object.entries(result.artifactPaths).map(([key, value]) => `- ${key}: \`${value}\``),
  ].join('\n') + '\n');

  return result;
}

async function main() {
  const result = runCaliforniaNextSourceAlignmentAudit();
  console.log(JSON.stringify(result, null, 2));
  if (result.status !== 'pass') {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
