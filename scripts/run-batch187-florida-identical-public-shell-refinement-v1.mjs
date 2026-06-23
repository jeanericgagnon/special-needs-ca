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
  batchSummary: path.join(generatedDir, 'batch187_florida_identical_public_shell_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch187-florida-identical-public-shell-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'public_myaccess_cpcps_and_help_routes_are_identical_shells_and_partner_services_stay_accountmanagement_401';
const FAILURE_CODE = 'public_myaccess_cpcps_and_help_routes_are_identical_shells_and_partner_services_stay_accountmanagement_401';

const COUNTY_STATUS_REASON = 'Official Florida DCF county-local routing remains blocked because the live public contacts.csv now proves 67/67 county-to-circuit coverage, but a role-field audit across all 109 public rows still shows zero true matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center. The only apparent `ESS` hits are false positives from `Arlington Expressway`, not Economic Self Sufficiency labels. The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes are not separate county-result surfaces: bounded fetches returned the same 5165-byte MyACCESS shell on both URLs with no county, office, storefront, or customer-service-center rows. The first-party appconfig still exposes partner services only under `/accountmanagement`, and bounded anonymous POST probes to `getZipCountyDetails` and `communityPartnerSearch` still return HTTP 401, so the county-result contract remains authenticated-only.';

const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://www.myflfamilies.com/services/public-assistance, https://www.myflfamilies.com/services/public-assistance/applying-for-assistance, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch, and https://myaccess.myflfamilies.com/Help/HCINT. The Family Resource Center HTML and providers.csv still preserve reviewed storefront coverage for only 34/67 counties. The public Florida DCF contact-us page still loads a live first-party contacts.csv with explicit county coverage for all 67 counties, but a bounded role-field audit across all 109 public rows returned zero true matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center. The only apparent `ESS` matches were false positives inside the street address `5920 Arlington Expressway`, not Office of Economic Self Sufficiency service labels. The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes returned the same 5165-byte generic MyACCESS shell with the same `<title>MyACCESS</title>`, the same appconfig bootstrap, and no county, office, or storefront result rows. The first-party appconfig still exposes partnerApproverServices only under `/accountmanagement`, and bounded anonymous POST probes to the exact official `getZipCountyDetails` plus `communityPartnerSearch` endpoints still return HTTP 401 with `{\"message\":\"Unauthorized\"}`. Florida therefore remains blocked because the county-complete public contract is the wrong service role, the public MyACCESS surfaces collapse to one generic shell, and the public-assistance county-result lane remains authenticated-only.';

const LESSON_HEADING = '### Identical Public SPA Shells Should Collapse To One Final Blocker';
const LESSON_BODY = '*   **Lesson:** If two first-party public portal URLs return the same shell HTML and the same config only points partner services to an authenticated root, collapse them into one final blocker instead of reopening both routes. Florida `Public/CPCPS` and `Help/HCINT` were the same MyACCESS shell, and appconfig still routed partner search only through `/accountmanagement`.';
const ROLE_AUDIT_LESSON_HEADING = '### Role Audits Must Reject Address-Substring False Positives';
const ROLE_AUDIT_LESSON_BODY = "*   **Lesson:** When scanning public contact inventories for service-role labels, require field-aware or phrase-aware matches instead of bare substrings. Florida's only `ESS` hits in `contacts.csv` came from `Arlington Expressway`, not from Economic Self Sufficiency routing, so substring counts alone would have overstated county-local progress.";

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
  const additions = [];
  if (!current.includes(LESSON_HEADING)) additions.push(`${LESSON_HEADING}\n${LESSON_BODY}`);
  if (!current.includes(ROLE_AUDIT_LESSON_HEADING)) additions.push(`${ROLE_AUDIT_LESSON_HEADING}\n${ROLE_AUDIT_LESSON_BODY}`);
  if (!additions.length) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${additions.join('\n\n')}\n`);
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
    '- The public county-complete DCF contacts.csv is still the wrong service role for county-local disability routing.',
    '- The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes are now proven to be the same generic shell, not two separate fallback contracts.',
    '- The first-party appconfig still points partner services only to `/accountmanagement`, and the county-result endpoints remain authenticated-only under bounded anonymous probes.',
    '- Florida should only reopen county-local once a first-party public-assistance county contract appears publicly or the existing MyACCESS county-result lane becomes anonymously reviewable.',
  ].join('\n') + '\n';
}

export function generateBatch187FloridaIdenticalPublicShellRefinementV1() {
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
      ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const sampleByUrl = new Map((Array.isArray(row.samples) ? row.samples : []).map((sample) => [sample.source_url, sample]));
    sampleByUrl.set('https://myaccess.myflfamilies.com/Public/CPCPS', {
      sample_name: 'MyACCESS Public CPCPS',
      source_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      final_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      verification_status: 'blocked',
      source_type: 'official_public_shell_without_public_results',
      source_table: 'reviewed_live_probe',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The public CPCPS route returned the same 5165-byte MyACCESS shell as Help/HCINT with the same <title>MyACCESS</title>, appconfig bootstrap, and no county, office, or storefront result rows.',
    });
    sampleByUrl.set('https://myaccess.myflfamilies.com/config/appconfig.js', {
      sample_name: 'MyACCESS appconfig',
      source_url: 'https://myaccess.myflfamilies.com/config/appconfig.js',
      final_url: 'https://myaccess.myflfamilies.com/config/appconfig.js',
      verification_status: 'reviewed',
      source_type: 'official_client_config',
      source_table: 'reviewed_live_probe',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The first-party appconfig exposes partnerApproverServices only under /accountmanagement and does not advertise a separate anonymous county-result service root.',
    });
    sampleByUrl.set('https://myaccess.myflfamilies.com/Help/HCINT', {
      sample_name: 'MyACCESS Help HCINT',
      source_url: 'https://myaccess.myflfamilies.com/Help/HCINT',
      final_url: 'https://myaccess.myflfamilies.com/Help/HCINT',
      verification_status: 'blocked',
      source_type: 'official_help_shell_without_public_results',
      source_table: 'reviewed_live_probe',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The first-party Help/HCINT route returned the same 5165-byte MyACCESS shell as Public/CPCPS with the same <title>MyACCESS</title>, appconfig bootstrap, and no county, office, or storefront result rows.',
    });

    const samples = Array.from(sampleByUrl.values());
    return {
      ...row,
      blocker_code: FAILURE_CODE,
      blocker_evidence: COUNTY_EVIDENCE,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_187_florida_identical_public_shell_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    public_cpcps_checked: true,
    public_help_checked: true,
    identical_public_shells: true,
    partner_services_root: '/accountmanagement',
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 187 Florida Identical Public Shell Refinement Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: county_local_disability_resources',
    `- failure_code: ${FAILURE_CODE}`,
    '',
    '## Evidence',
    '',
    `- ${COUNTY_EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Florida remains blocked and not index-safe.',
    '- The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes are the same generic shell, not distinct county-routing candidates.',
    '- The first-party config still routes partner services only through `/accountmanagement`, and the exact county-result endpoints remain HTTP 401 under bounded anonymous probes.',
    '- The county-local family should stay blocked until a public county-result contract exists outside the authenticated partner-service lane.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch187FloridaIdenticalPublicShellRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
