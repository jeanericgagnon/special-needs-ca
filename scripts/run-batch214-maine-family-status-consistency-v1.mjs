import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'maine_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'maine_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'maine_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maine_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'maine_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch214_maine_family_status_consistency_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch214-maine-family-status-consistency-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Maine California-Grade Audit Report v2',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Failure ledger',
    '',
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Completion decision',
    '',
    '- Maine remains BLOCKED and not index-safe.',
    '- Education is stronger than before: the official export contract now works and returns role-bearing local contact rows on the first-party DOE host.',
    '- Maine still does not clear because that OrgId/workbook/export lane is not yet materialized into reviewed county-grade district routing coverage across all counties.',
    '- County-local remains blocked because the official DHHS office page still publishes zero county, town, or service-area mapping fields in public HTML.',
  ].join('\n') + '\n';
}

export function generateBatch214MaineFamilyStatusConsistencyV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedSummary = {
    ...summary,
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: 'blocked_live_public_sau_export_contract_not_materialized_county_grade',
      county_local_disability_resources: 'blocked_district_office_locations_without_county_town_or_service_area_fields',
    },
  };

  writeJson(INPUTS.summary, updatedSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, gapRows, failureRows, verifiedRows, nextRows));

  const batchSummary = {
    batch: 'batch_214_maine_family_status_consistency_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'maine',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    aligned_families: ['district_or_county_education_routing', 'county_local_disability_resources'],
  };
  writeJson(OUTPUTS.summary, batchSummary);

  const batchReport = [
    '# Batch 214 Maine Family Status Consistency Report v1',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    '- refined_scope: summary familyStatuses alignment',
    '',
    '## Consistency repair',
    '',
    '- Updated Maine summary familyStatuses so they match the current gap matrix and report blocker wording for education and county-local.',
    '- No new sources were fetched and no blocker standards were changed.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch214MaineFamilyStatusConsistencyV1();
  console.log(JSON.stringify(result, null, 2));
}
