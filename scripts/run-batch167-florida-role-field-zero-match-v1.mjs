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
  batchSummary: path.join(generatedDir, 'batch167_florida_role_field_zero_match_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch167-florida-role-field-zero-match-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const COUNTY_STATUS_REASON = 'Official Florida DCF county-local routing remains blocked because the live public contacts.csv now proves 67/67 county-to-circuit coverage, but a role-field audit across all 109 public rows still shows zero matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, or cash assistance. The separate MyACCESS county-result contract still exists only behind authenticated `/accountmanagement` endpoints.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, and https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch, plus a role-field audit over all 109 public contacts.csv rows using the `type`, `name`, `title`, `services`, and `website_link` fields only. The Family Resource Center HTML and providers.csv still preserve reviewed storefront coverage for only 34/67 counties. The public Florida DCF contact-us page now loads a live first-party contacts.csv with explicit county coverage for all 67 counties, but the role-field audit returned zero matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, and cash assistance. The public service labels that do appear are general DCF roles such as Adult Protective Services, Child and Family Well-Being, Client Relations, Refugee Services, Human Trafficking, and licensing contacts. The public config and main bundle still name partnerApproverServices=/accountmanagement and service paths `/getZipCountyDetails` plus `/communityPartnerSearch`, but bounded anonymous POST probes to those exact official endpoints return HTTP 401 with `{\"message\":\"Unauthorized\"}`. Florida therefore remains blocked because the county-complete public contract is the wrong service role and the public-assistance county-result lane remains authenticated-only.';

const LESSON_HEADING = '### County-Complete Official CSVs Still Fail If Role Fields Never Name The Required Program';
const LESSON_BODY = '*   **Lesson:** When a public official CSV is county-complete, audit only the role-bearing fields before treating it as a routing win. Florida’s `contacts.csv` covered all 67 counties, but the `type`, `name`, `title`, `services`, and `website_link` fields had zero matches for ACCESS, Medicaid, SNAP, TANF, or economic-self-sufficiency terms, so it stayed blocked as the wrong service contract.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
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
    '- The public county-complete DCF contacts.csv is now disproven more exactly as a county-local repair lane: its role fields never name ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, or cash assistance across all 109 public rows.',
    '- The Family Resource Center storefront lane still covers only 34/67 counties, and the MyACCESS county-result endpoints remain authenticated-only under `/accountmanagement`.',
    '- Florida should only reopen county-local once a first-party public-assistance county contract appears publicly or the existing MyACCESS county-result lane becomes anonymously reviewable.',
  ].join('\n') + '\n';
}

export function generateBatch167FloridaRoleFieldZeroMatchV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, status_reason: COUNTY_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          query_basis: 'Reviewed the public Family Resource Center storefront contract, the public Florida DCF contact-us page and contacts.csv, a role-field keyword audit across the county-complete public CSV, and bounded anonymous probes to the MyACCESS county-result endpoints.',
          blocker_evidence: COUNTY_EVIDENCE,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, evidence: COUNTY_EVIDENCE }
        : row
    )),
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const batchSummary = {
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    public_contacts_csv_row_count: 109,
    county_complete_contact_rows: true,
    role_field_zero_match_terms: [
      'access',
      'medicaid',
      'snap',
      'tanf',
      'economic self-sufficiency',
      'food assistance',
      'cash assistance',
    ],
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${stateReport}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch167FloridaRoleFieldZeroMatchV1();
  console.log(JSON.stringify(result, null, 2));
}
