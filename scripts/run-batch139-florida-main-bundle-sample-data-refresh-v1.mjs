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
  batchSummary: path.join(generatedDir, 'batch139_florida_main_bundle_sample_data_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch139-florida-main-bundle-sample-data-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const BLOCKER_CODE = 'public_myaccess_bundle_contains_sample_rows_and_two_county_admin_stub_not_statewide_contract';
const NEXT_ACTION = 'hold_county_local_until_first_party_county_dataset_or_documented_anonymous_search_contract_covers_remaining_33_counties';
const STATUS_REASON = 'Official Florida DCF county-local routing remains split between a reviewed Family Resource Center CSV that covers 34/67 counties and a MyACCESS public lane that still does not expose a statewide county-results contract. The public app shell, plain proxy GET, and config only show a candidate officeMapping path, while the public JS bundles resolve to admin/form scaffolding plus embedded sample data: the flPartnerLocation bundle defines blank location-entry fields and county selectors, and the main bundle exposes only a tiny Broward/Dade admin map plus obvious sample rows such as `BigOrganization10` and repeated `Second Harvest` locations rather than a real 67-county storefront dataset.';
const EVIDENCE = 'Reviewed 2026-06-22 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/dataexchangeproxy, https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js, and https://myaccess.myflfamilies.com/static/js/main.d43b0959.js. The Family Resource Center CSV still preserves reviewed storefront coverage for only 34/67 Florida counties. The public CPCPS entry and plain GET to /dataexchangeproxy both return the same 5165-byte MyACCESS shell instead of county results. Appconfig still exposes officeMapping=/dataexchangeproxy, but the fetched flPartnerLocation bundle only exposes blank location-entry schema fields (`id`, `locationName`, `phoneNumber`, `faxNumber`, `streetAddress`, `county`) plus ZIP/county handlers. The public main bundle does not expose a statewide county-office dataset either: it embeds only two county-admin rows for Broward and Dade plus obvious internal/sample rows such as `BigOrganization10`, `Second Harvest`, and fake contact values. Florida therefore still lacks reviewed first-party county-grade local-routing evidence for the remaining 33 counties.';
const LESSON_HEADING = '### Public Bundles With Tiny County Stubs And Sample Rows Do Not Count As County Contracts';
const LESSON_BODY = '*   **Lesson:** If a public app bundle exposes only a tiny county stub plus obvious sample or internal rows, do not treat it as a hidden county-results contract. Florida stayed blocked because the public bundle carried only Broward/Dade admin stubs alongside `BigOrganization10` and repeated `Second Harvest` sample data, not a real statewide office dataset.';

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
    '- The remaining MyACCESS lane is not a reviewed county-results contract: the public shell and proxy still expose only app chrome, the flPartnerLocation bundle is a location-entry form, and the main bundle adds only a tiny Broward/Dade admin stub plus obvious sample/internal rows.',
    '- Florida should only reopen county-local once a first-party county dataset or documented anonymous search contract is public for the remaining 33 counties.',
  ].join('\n') + '\n';
}

export function generateBatch139FloridaMainBundleSampleDataRefreshV1() {
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
        query_basis: 'Reviewed official DCF Family Resource Center CSV plus live MyACCESS public shell, appconfig proxy hints, plain proxy GET, the flPartnerLocation form-schema bundle, and the public main bundle for real county-result rows versus sample/internal data.',
        blocker_code: BLOCKER_CODE,
        blocker_evidence: EVIDENCE,
        sample_count: 36,
        samples: [
          ...(row.samples || []).slice(0, 3),
          {
            sample_name: 'MyACCESS Public CPCPS Shell',
            source_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
            final_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
            verification_status: 'blocked',
            source_type: 'official_public_shell',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The public CPCPS entry still returns only the MyACCESS shell rather than county office rows.',
          },
          {
            sample_name: 'MyACCESS Office Mapping Config',
            source_url: 'https://myaccess.myflfamilies.com/config/appconfig.js',
            final_url: 'https://myaccess.myflfamilies.com/config/appconfig.js',
            verification_status: 'blocked',
            source_type: 'official_config_hint',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Appconfig still exposes officeMapping=/dataexchangeproxy and CreateCBOAccountService=/dataexchangeproxy, but no public county-result contract is documented.',
          },
          {
            sample_name: 'MyACCESS Partner Location Bundle',
            source_url: 'https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js',
            final_url: 'https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js',
            verification_status: 'blocked',
            source_type: 'official_form_schema_bundle',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The public partner-location bundle defines blank location-entry fields and county/ZIP handlers, not a statewide county-office results dataset.',
          },
          {
            sample_name: 'MyACCESS Main Bundle Broward/Dade Stub',
            source_url: 'https://myaccess.myflfamilies.com/static/js/main.d43b0959.js',
            final_url: 'https://myaccess.myflfamilies.com/static/js/main.d43b0959.js',
            verification_status: 'blocked',
            source_type: 'official_sample_bundle_data',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The public main bundle contains only two county-admin rows for Broward and Dade rather than a statewide county-office contract.',
          },
          {
            sample_name: 'MyACCESS Main Bundle Sample Organization Rows',
            source_url: 'https://myaccess.myflfamilies.com/static/js/main.d43b0959.js',
            final_url: 'https://myaccess.myflfamilies.com/static/js/main.d43b0959.js',
            verification_status: 'blocked',
            source_type: 'official_sample_bundle_data',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The same public main bundle also embeds obvious sample/internal rows such as BigOrganization10, repeated Second Harvest locations, and fake contact values, so it cannot be treated as verified public county office evidence.',
          },
        ],
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
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: BLOCKER_CODE,
        evidence: EVIDENCE,
        next_action: NEXT_ACTION,
      },
    ],
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
    blocker_code: BLOCKER_CODE,
    counties_cleared_via_csv: 34,
    counties_still_missing_public_contract: 33,
    bundle_sample_county_rows: 2,
    bundle_sample_counties: ['Broward', 'Dade'],
    sample_row_markers: ['BigOrganization10', 'Second Harvest'],
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 139 Florida Main Bundle Sample-Data Refresh Report v1',
      '',
      'This pass does not broaden Florida discovery. It tightens the MyACCESS blocker by showing that the public main bundle carries only a tiny county stub plus obvious sample/internal rows rather than a statewide county-office contract.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- counties_cleared_via_csv: ${batchSummary.counties_cleared_via_csv}`,
      `- counties_still_missing_public_contract: ${batchSummary.counties_still_missing_public_contract}`,
      `- bundle_sample_county_rows: ${batchSummary.bundle_sample_county_rows}`,
      `- bundle_sample_counties: ${batchSummary.bundle_sample_counties.join(', ')}`,
      `- sample_row_markers: ${batchSummary.sample_row_markers.join(', ')}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch139FloridaMainBundleSampleDataRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
