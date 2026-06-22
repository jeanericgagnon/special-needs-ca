import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'florida_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'florida_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch139_florida_sample_bundle_blocker_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch139-florida-sample-bundle-blocker-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const BLOCKER_CODE = 'official_myaccess_bundle_exposes_sample_rows_and_two_county_admin_stub_not_public_statewide_contract';
const NEXT_ACTION = 'hold_county_local_until_first_party_county_dataset_or_documented_anonymous_search_contract_exists_beyond_sample_bundle_rows';
const STATUS_REASON = 'Official Florida DCF county-local routing remains split between a reviewed Family Resource Center CSV that covers 34/67 counties and a MyACCESS bundle lane that still does not expose a trustworthy public statewide county-results contract. The public app config still points officeMapping at /dataexchangeproxy, but the reviewed public main bundle only embeds a tiny Broward/Dade admin stub plus obvious sample/internal rows such as BigOrganization10 and repeated Second Harvest/Tallahassee examples rather than a county-grade office dataset for the remaining 33 counties.';
const EVIDENCE = 'Reviewed 2026-06-22 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/dataexchangeproxy, the live official bundle https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js, and the public main bundle https://myaccess.myflfamilies.com/static/js/main.d43b0959.js. The Family Resource Center CSV still preserves reviewed storefront coverage for only 34/67 Florida counties. The public CPCPS entry and plain GET to /dataexchangeproxy still return the same 5165-byte MyACCESS shell, and appconfig still exposes officeMapping=/dataexchangeproxy. The partner-location bundle remains an admin/location form schema with blank fields like id/locationName/phoneNumber/streetAddress. The public main bundle does embed tiny data objects, but they are not a trustworthy statewide county-office contract: it only includes a two-county Broward/Dade admin stub plus obvious sample/internal rows such as orgFullName=\"BigOrganization10\", repeated locationName=\"Second Harvest\", fake Tallahassee/Baker sample addresses, and nonauthoritative contact values. Florida therefore still lacks reviewed first-party county-grade local-routing evidence for the remaining 33 counties.';
const LESSON_HEADING = '### Public Bundles With Tiny County Stubs And Sample Rows Still Fail The County-Grade Gate';
const LESSON_BODY = '*   **Lesson:** If a public JS bundle exposes only a tiny county subset plus obvious sample or internal rows, do not treat it as a hidden statewide contract. Florida stayed blocked because the bundle showed just Broward/Dade admin stubs alongside sample rows like `BigOrganization10` and repeated `Second Harvest`, which is not county-grade proof for the rest of the state.';

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

function updateLessonsFile(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Florida California-Grade Audit Report v2',
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
    '## Repair decision',
    '',
    '- Florida remains BLOCKED and not index-safe.',
    '- The reviewed official Family Resource Center CSV still clears only 34 counties.',
    '- The remaining MyACCESS lane is now a stronger negative finding: beyond the public shell and proxy, the public main bundle only exposes a two-county Broward/Dade admin stub plus obvious sample/internal rows, not a trustworthy statewide county-office result contract.',
    '- Florida should only reopen county-local once a first-party county dataset or documented anonymous search contract exists beyond those sample bundle rows.',
  ].join('\n') + '\n';
}

export function generateBatch139FloridaSampleBundleBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: BLOCKER_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
        ...row,
        query_basis: 'Reviewed official DCF Family Resource Center CSV plus live MyACCESS public shell, proxy hint, partner-location schema bundle, and public main bundle sample rows.',
        blocker_code: BLOCKER_CODE,
        blocker_evidence: EVIDENCE,
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: BLOCKER_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: BLOCKER_CODE,
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: BLOCKER_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const lessonAdded = updateLessonsFile(INPUTS.lessons);
  const batchSummary = {
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    blocker_family: 'county_local_disability_resources',
    counties_cleared_via_csv: 34,
    counties_still_missing_public_contract: 33,
    shell_bytes: 5165,
    bundle_signal: 'two_county_admin_stub_plus_sample_internal_rows',
    main_bundle_county_names: ['Broward', 'Dade'],
    sample_rows_seen: ['BigOrganization10', 'Second Harvest', 'Tallahassee', 'Baker'],
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 139 Florida Sample-Bundle Blocker Refresh Report v1',
      '',
      'This pass does not broaden Florida discovery. It tightens the MyACCESS blocker by showing that the public main bundle exposes only a tiny two-county admin stub plus obvious sample/internal rows, not a trustworthy statewide county-office contract.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- counties_cleared_via_csv: ${batchSummary.counties_cleared_via_csv}`,
      `- counties_still_missing_public_contract: ${batchSummary.counties_still_missing_public_contract}`,
      `- bundle_signal: ${batchSummary.bundle_signal}`,
      `- main_bundle_county_names: ${batchSummary.main_bundle_county_names.join(', ')}`,
      `- sample_rows_seen: ${batchSummary.sample_rows_seen.join(', ')}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch139FloridaSampleBundleBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
