import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const OUTPUTS = {
  summary: path.join(generatedDir, 'georgia_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'georgia_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'georgia_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'georgia_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'georgia_next_action_queue_v2.jsonl'),
  batchSummary: path.join(generatedDir, 'batch101_georgia_dd_blocker_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'georgia-california-grade-audit-report-v2.md'),
  batchReport: path.join(docsGeneratedDir, 'batch101-georgia-dd-blocker-truth-refresh-report-v1.md'),
};

const DD_BLOCKER_CODE = 'official_region_pages_access_denied_and_county_lookup_not_county_mapped';
const DD_STATUS = 'blocked_official_access_denied_region_pages';
const DD_REASON =
  'Live static and browser-assisted checks now agree that all six official DBHDD region field-office pages return access-denied shells instead of counties-served and intake content. The official county lookup page remains live, but its current rendered content only exposes repeated region links and no county names, so a deterministic 159-county county-to-region map still cannot be verified from the current official evidence.';
const DD_NEXT_ACTION =
  'hold_blocked_until_reviewed_county_to_region_source_replaces_access_denied_region_pages';

const DD_SAMPLES = [
  {
    sample_name: 'Regional Field Office by County',
    source_url: 'https://dbhdd.georgia.gov/regional-field-office-county',
    final_url: 'https://dbhdd.georgia.gov/regional-field-office-county',
    verification_status: 'verified',
    source_type: 'official_county_lookup_without_county_names',
    source_table: 'batch101_georgia_dd_blocker_truth_refresh',
    fetched_at: '2026-06-22T15:44:00.000Z',
    evidence_snippet: 'Regional Field Office by County. Enter your county to determine your regional field office. Current rendered content exposes repeated region links but no county names.',
  },
  ...[1, 2, 3, 4, 5, 6].map((region) => ({
    sample_name: `Region ${region} Field Office`,
    source_url: `https://dbhdd.georgia.gov/region-${region}-field-office`,
    final_url: `https://dbhdd.georgia.gov/region-${region}-field-office`,
    verification_status: 'blocked',
    source_type: 'official_access_denied_region_page',
    source_table: 'batch101_georgia_dd_blocker_truth_refresh',
    fetched_at: '2026-06-22T15:44:00.000Z',
    evidence_snippet: `Breadcrumb preserved Region ${region} Field Office, but the live page body says Access denied / You are not authorized to access this page.`,
  })),
];

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

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Georgia California-Grade Audit Report v2',
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
    '## Georgia final blocker decision',
    '',
    '- Developmental disability routing remains blocked, and the older “browser-visible region pages are active” claim is no longer accurate.',
    '- Live static and browser-assisted checks now agree that all six reviewed official DBHDD region field-office pages resolve to access-denied shells. Those pages preserve region identity in breadcrumbs, but they do not preserve counties served or intake content strongly enough to clear the family.',
    '- The official county lookup page still loads, but the current rendered content exposes repeated region links rather than county names, so the 159-county county-to-region map is still unverified.',
    '- District or county education routing remains blocked because only 5 reviewed district-owned exact leaves across the bounded Georgia packet evidence have been verified; that is not enough to truthfully prove county-grade routing across 159 Georgia counties without reopening broad district discovery.',
    '- Georgia remains blocked and not index-safe until a reviewed county-to-region source replaces the access-denied region pages and education gains new exact district-owned county leaves.',
  ].join('\n') + '\n';
}

export function generateBatch101GeorgiaDdBlockerTruthRefreshV1() {
  const summary = readJson(OUTPUTS.summary);
  const gapRows = readJsonl(OUTPUTS.gap);
  const failureRows = readJsonl(OUTPUTS.failures);
  const verifiedRows = readJsonl(OUTPUTS.verified);
  const nextRows = readJsonl(OUTPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, family_status: DD_STATUS, status_reason: DD_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, failure_code: DD_BLOCKER_CODE, evidence: DD_REASON, next_action: DD_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
          ...row,
          family_status: DD_STATUS,
          evidence_strength: 'medium',
          sample_count: DD_SAMPLES.length,
          query_basis: 'Reviewed official county lookup page plus bounded static and browser-assisted checks of all six DBHDD region field-office pages.',
          blocker_code: DD_BLOCKER_CODE,
          blocker_evidence: DD_REASON,
          samples: DD_SAMPLES,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, failure_code: DD_BLOCKER_CODE, next_action: DD_NEXT_ACTION, evidence: DD_REASON }
      : row
  ));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    missing_critical_families: 0,
    primary_gap_reason: DD_BLOCKER_CODE,
    critical_gap_families: updatedFailureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: [],
    verified_source_families_with_samples: updatedVerifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: updatedFailureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };

  writeJson(OUTPUTS.summary, updatedSummary);
  writeJsonl(OUTPUTS.gap, updatedGapRows);
  writeJsonl(OUTPUTS.failures, updatedFailureRows);
  writeJsonl(OUTPUTS.verified, updatedVerifiedRows);
  writeJsonl(OUTPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    state: 'georgia',
    classification: 'BLOCKED',
    index_safe: false,
    refined_family: 'developmental_disability_idd_authority',
    blocker_code: DD_BLOCKER_CODE,
    next_action: DD_NEXT_ACTION,
    access_denied_region_pages: 6,
    county_lookup_page_live: true,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 101 Georgia DD Blocker Truth Refresh Report v1',
      '',
      'This pass does not reopen Georgia DD discovery. It corrects the blocker to match current live evidence: the county lookup page still loads, but all six region pages are access-denied in both static and browser-assisted checks.',
      '',
      `- classification: ${batchSummary.classification}`,
      `- index_safe: ${batchSummary.index_safe ? 'true' : 'false'}`,
      `- blocker_code: ${batchSummary.blocker_code}`,
      `- next_action: ${batchSummary.next_action}`,
      `- access_denied_region_pages: ${batchSummary.access_denied_region_pages}`,
      `- county_lookup_page_live: ${batchSummary.county_lookup_page_live}`,
      '',
    ].join('\n'),
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch101GeorgiaDdBlockerTruthRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
