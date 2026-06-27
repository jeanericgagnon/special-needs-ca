import fs from 'node:fs';
import path from 'node:path';
import { isPublicCountyOfficeEligible } from '../frontend/src/lib/publicTruth.ts';

const repoRoot = process.cwd();
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dbPath = path.join(repoRoot, 'frontend', 'src', 'lib', 'db.ts');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return readJson(filePath);
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function summarize(rows, key) {
  return rows.reduce((acc, row) => {
    const bucket = String(row[key] ?? 'unknown');
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
}

function hasGuard(source, pattern) {
  return pattern.test(source);
}

function toBulletMap(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
}

const registry = readJson(path.join(generatedDir, 'california-next-source-registry-v1.json'));
const queueSummary = readJson(path.join(generatedDir, 'california-next-source-seed-queue-v1.json'));
const alignment = readJson(path.join(generatedDir, 'california-next-source-alignment-audit-v1.json'));
const publishSummary = readJson(path.join(generatedDir, 'ca_publish_decisions_v1.json'));
const publishRows = readJsonl(path.join(generatedDir, 'ca_publish_decisions_v1.jsonl'));
const upsertSummaries = [
  'ca_live_upsert_v1.json',
  'ca_live_upsert_county_office_fetch_now_v5.json',
  'ca_live_upsert_county_office_review_first_v1.json',
]
  .map((name) => readJsonIfExists(path.join(generatedDir, name)))
  .filter(Boolean);
const priorityQueueRows = readJsonl(path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'));
const dbSource = fs.readFileSync(dbPath, 'utf8');

const guardChecks = {
  countyOfficesBulkPublishedOnly: hasGuard(
    dbSource,
    /SELECT \* FROM county_offices[\s\S]*COALESCE\(display_status, 'published'\) = 'published'/,
  ),
  schoolDistrictsBulkPublishedOnly: hasGuard(
    dbSource,
    /FROM school_districts sd[\s\S]*COALESCE\(sd\.display_status, 'published'\) = 'published'/,
  ),
  schoolDistrictByIdPublishedOnly: hasGuard(
    dbSource,
    /SELECT \* FROM school_districts[\s\S]*WHERE id = \?[\s\S]*COALESCE\(display_status, 'published'\) = 'published'/,
  ),
  schoolDistrictLitigationListPublishedOnly: hasGuard(
    dbSource,
    /SELECT \* FROM school_districts[\s\S]*COALESCE\(display_status, 'published'\) = 'published'[\s\S]*ORDER BY name ASC/,
  ),
  schoolDistrictBySlugPublishedOnly: hasGuard(
    dbSource,
    /SELECT \* FROM school_districts[\s\S]*COALESCE\(display_status, 'published'\) = 'published'[\s\S]*return districts\.find/,
  ),
  selpasByCountyPublishedOnly: hasGuard(
    dbSource,
    /SELECT s\.\* FROM selpas s[\s\S]*COALESCE\(s\.display_status, 'published'\) = 'published'/,
  ),
  waitlistsPublishedOnly: hasGuard(
    dbSource,
    /SELECT \* FROM program_waitlists[\s\S]*COALESCE\(display_status, 'published'\) = 'published'/,
  ),
  localProvidersPublishedOnly: hasGuard(
    dbSource,
    /SELECT \* FROM resource_providers[\s\S]*county_id = \?[\s\S]*COALESCE\(display_status, 'published'\) = 'published'/,
  ),
  programsBulkPublishedOnly: hasGuard(
    dbSource,
    /SELECT \* FROM programs[\s\S]*COALESCE\(display_status, 'published'\) = 'published'[\s\S]*ORDER BY id ASC/,
  ),
  programBySlugPublishedOnly: hasGuard(
    dbSource,
    /SELECT \* FROM programs[\s\S]*LOWER\(id\) = \? OR LOWER\(name\) = \?[\s\S]*COALESCE\(display_status, 'published'\) = 'published'/,
  ),
};

const publishedCountyOfficeRows = publishRows.filter(
  (row) => row.destinationTable === 'county_offices' && row.displayStatusDecision === 'published',
);
const unsafePublishedCountyOfficeRows = publishedCountyOfficeRows.filter((row) =>
  !isPublicCountyOfficeEligible({
    office_name: row.fieldEntries?.find((entry) => entry.field === 'office_name')?.value || row.pageTitle || row.agency || '',
    program_id: row.recordId?.includes('ihss') ? 'ihss-for-children' : null,
    source_url: row.finalUrl || row.sourceUrl || '',
    website: row.finalUrl || row.sourceUrl || '',
    verification_status: row.semanticStatus === 'stage_ready' ? 'official_verified' : row.verification_status,
    data_origin: 'scraped',
    phone: row.fieldEntries?.find((entry) => entry.field === 'phone')?.value || '',
    display_status: row.displayStatusDecision,
  }),
);

const aggregatedUpsertedByTable = upsertSummaries.reduce((acc, summary) => {
  for (const [tableName, count] of Object.entries(summary.upsertedByTable || {})) {
    acc[tableName] = (acc[tableName] || 0) + Number(count || 0);
  }
  return acc;
}, {});

const status = {
  generatedAt: new Date().toISOString(),
  registryFamilies: registry.summary?.totalFamilies ?? registry.sourceFamilies?.length ?? 0,
  registrySeedEntries: registry.summary?.totalSeedEntries ?? registry.seedEntries?.length ?? 0,
  queueRows: typeof queueSummary.queueRows === 'number' ? queueSummary.queueRows : (queueSummary.queueRows?.length ?? 0),
  queueByFamily: queueSummary.byFamily ?? summarize(queueSummary.queueRows || [], 'family'),
  alignmentStatus: alignment.status || 'unknown',
  alignmentFailures: alignment.failures || [],
  publishPrefix: publishSummary.prefix,
  stageReadyRows: publishSummary.totalStageReadyRows,
  publishedCount: publishSummary.publishedCount,
  needsReviewCount: publishSummary.needsReviewCount,
  publishByFamily: publishSummary.byFamily || summarize(publishRows, 'family'),
  publishByDecision: publishSummary.byDecision || summarize(publishRows, 'displayStatusDecision'),
  publishedCountyOfficeRows: publishedCountyOfficeRows.length,
  unsafePublishedCountyOfficeRows: unsafePublishedCountyOfficeRows.length,
  unsafePublishedCountyOfficeAgencies: unsafePublishedCountyOfficeRows.map((row) => row.agency),
  upsertRuns: upsertSummaries.map((summary) => ({
    runId: summary.runId,
    mode: summary.mode,
    actionableCount: Number(summary.actionableCount || 0),
    skippedCount: Number(summary.skippedCount || 0),
    upsertedByTable: summary.upsertedByTable || {},
  })),
  upsertRunId: upsertSummaries.map((summary) => summary.runId).join(', '),
  upsertMode: upsertSummaries.every((summary) => summary.mode === upsertSummaries[0]?.mode)
    ? (upsertSummaries[0]?.mode || 'unknown')
    : 'mixed',
  actionableCount: upsertSummaries.reduce((sum, summary) => sum + Number(summary.actionableCount || 0), 0),
  skippedCount: upsertSummaries.reduce((sum, summary) => sum + Number(summary.skippedCount || 0), 0),
  upsertedByTable: aggregatedUpsertedByTable,
  publicQueryGuards: guardChecks,
  nationwideCounts: {
    completeStates: priorityQueueRows.filter((row) => row.classification === 'COMPLETE').length,
    blockedStates: priorityQueueRows.filter((row) => row.classification === 'BLOCKED').length,
    indexSafeStates: priorityQueueRows.filter((row) => row.index_safe === true).length,
  },
};

const jsonPath = path.join(generatedDir, 'california-scraping-foundation-status-v1.json');
const mdPath = path.join(docsDir, 'california-scraping-foundation-status-v1.md');

fs.writeFileSync(jsonPath, `${JSON.stringify(status, null, 2)}\n`);
fs.writeFileSync(
  mdPath,
  [
    '# California Scraping Foundation Status v1',
    '',
    `Generated: ${status.generatedAt}`,
    '',
    '## Registry And Queue',
    `- Registry families: \`${status.registryFamilies}\``,
    `- Registry seed entries: \`${status.registrySeedEntries}\``,
    `- Queue rows: \`${status.queueRows}\``,
    `- Alignment status: \`${status.alignmentStatus}\``,
    status.alignmentFailures.length ? `- Alignment failures: \`${status.alignmentFailures.join(', ')}\`` : '- Alignment failures: none',
    '',
    '### Queue By Family',
    toBulletMap(status.queueByFamily),
    '',
    '## Publish Decisions',
    `- Prefix: \`${status.publishPrefix}\``,
    `- Stage-ready rows: \`${status.stageReadyRows}\``,
    `- Published rows: \`${status.publishedCount}\``,
    `- Needs review rows: \`${status.needsReviewCount}\``,
    '',
    '### Publish Decisions By Family',
    toBulletMap(status.publishByFamily),
    '',
    '### Publish Decisions By Status',
    toBulletMap(status.publishByDecision),
    '',
    '### County Office Trust Check',
    `- Published county office rows: \`${status.publishedCountyOfficeRows}\``,
    `- Unsafe published county office rows: \`${status.unsafePublishedCountyOfficeRows}\``,
    status.unsafePublishedCountyOfficeAgencies.length
      ? `- Unsafe published county office agencies: \`${status.unsafePublishedCountyOfficeAgencies.join(', ')}\``
      : '- Unsafe published county office agencies: none',
    '',
    '## Live Upsert',
    `- Run id(s): \`${status.upsertRunId}\``,
    `- Mode: \`${status.upsertMode}\``,
    `- Actionable rows: \`${status.actionableCount}\``,
    `- Skipped rows: \`${status.skippedCount}\``,
    '',
    '### Upsert Runs',
    ...status.upsertRuns.map((run) =>
      `- ${run.runId}: actionable=\`${run.actionableCount}\`, skipped=\`${run.skippedCount}\`, mode=\`${run.mode}\``,
    ),
    '',
    '### Upserted By Table',
    toBulletMap(status.upsertedByTable),
    '',
    '## Published-Only Query Guards',
    ...Object.entries(status.publicQueryGuards).map(([key, value]) => `- ${key}: \`${value ? 'pass' : 'fail'}\``),
    '',
    '## Nationwide Gate Snapshot',
    `- COMPLETE: \`${status.nationwideCounts.completeStates}\``,
    `- BLOCKED: \`${status.nationwideCounts.blockedStates}\``,
    `- index-safe: \`${status.nationwideCounts.indexSafeStates}\``,
    '',
  ].join('\n') + '\n',
);

console.log(JSON.stringify({ jsonPath, mdPath, status }, null, 2));
