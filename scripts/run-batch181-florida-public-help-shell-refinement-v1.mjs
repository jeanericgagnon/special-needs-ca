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
  batchSummary: path.join(generatedDir, 'batch181_florida_public_help_shell_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch181-florida-public-help-shell-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const COUNTY_STATUS_REASON = 'Official Florida DCF county-local routing remains blocked because the live public contacts.csv now proves 67/67 county-to-circuit coverage, but a role-field audit across all 109 public rows still shows zero matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, or cash assistance. The separate MyACCESS county-result contract still exists only behind authenticated `/accountmanagement` endpoints, and the public `Help/HCINT` lane exposed from the assistance page is only a JavaScript shell rather than a public county-office contract.';

const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://www.myflfamilies.com/services/public-assistance, https://www.myflfamilies.com/services/public-assistance/applying-for-assistance, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch, and the first-party MyACCESS help route https://myaccess.myflfamilies.com/Help/HCINT. The Family Resource Center HTML and providers.csv still preserve reviewed storefront coverage for only 34/67 counties. The public Florida DCF contact-us page now loads a live first-party contacts.csv with explicit county coverage for all 67 counties, but the role-field audit returned zero matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, and cash assistance. The public service labels that do appear are general DCF roles such as Adult Protective Services, Child and Family Well-Being, Client Relations, Refugee Services, Human Trafficking, and licensing contacts. The public assistance pages do expose first-party links to Family Resource Centers, Community Partner Search, and MyACCESS help, but the `Help/HCINT` lane itself returns only the generic MyACCESS JavaScript shell with \"You need to enable JavaScript to run this app\" and no county, office, storefront, or customer-service-center rows. The public config and main bundle still name partnerApproverServices=/accountmanagement and service paths `/getZipCountyDetails` plus `/communityPartnerSearch`, but bounded anonymous POST probes to those exact official endpoints return HTTP 401 with `{\"message\":\"Unauthorized\"}`. Florida therefore remains blocked because the county-complete public contract is the wrong service role, the first-party help lane is shell-only, and the public-assistance county-result lane remains authenticated-only.';

const LESSON_HEADING = '### First-Party Help Routes Under A Portal Host Still Need Real County Rows';
const LESSON_BODY = '*   **Lesson:** If a public benefits page links a first-party help route under the same portal host, fetch it once before assuming it is a usable fallback. Florida’s `myaccess.myflfamilies.com/Help/HCINT` was linked from the public assistance page, but it returned only the generic JavaScript shell and no county or office rows, so it did not reopen county-local routing.';

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
    '- The public county-complete DCF contacts.csv is still the wrong service role for county-local disability routing.',
    '- The newly surfaced first-party MyACCESS help lane (`Help/HCINT`) is only a JavaScript shell and does not expose county or office rows.',
    '- The Family Resource Center storefront lane still covers only 34/67 counties, and the MyACCESS county-result endpoints remain authenticated-only under `/accountmanagement`.',
    '- Florida should only reopen county-local once a first-party public-assistance county contract appears publicly or the existing MyACCESS county-result lane becomes anonymously reviewable.',
  ].join('\n') + '\n';
}

export function generateBatch181FloridaPublicHelpShellRefinementV1() {
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

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const samples = Array.isArray(row.samples) ? row.samples.slice() : [];
    const hasHelpSample = samples.some((sample) => sample.source_url === 'https://myaccess.myflfamilies.com/Help/HCINT');
    if (!hasHelpSample) {
      samples.push({
        sample_name: 'MyACCESS Help HCINT',
        source_url: 'https://myaccess.myflfamilies.com/Help/HCINT',
        final_url: 'https://myaccess.myflfamilies.com/Help/HCINT',
        verification_status: 'blocked',
        source_type: 'official_help_shell_without_public_results',
        source_table: 'reviewed_live_probe',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The first-party Help/HCINT route linked from the public assistance page returns only the generic MyACCESS shell with "You need to enable JavaScript to run this app" and no county, office, or storefront result rows.',
      });
    }
    return {
      ...row,
      sample_count: samples.length,
      blocker_evidence: COUNTY_EVIDENCE,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'public_dcf_contacts_csv_is_county_complete_but_wrong_role_help_lane_is_js_shell_and_myaccess_results_remain_authenticated',
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? {
            ...row,
            failure_code: 'public_dcf_contacts_csv_is_county_complete_but_wrong_role_help_lane_is_js_shell_and_myaccess_results_remain_authenticated',
            evidence: COUNTY_EVIDENCE,
          }
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
    batch: 'batch_181_florida_public_help_shell_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    public_help_lane_checked: true,
    public_help_route: 'https://myaccess.myflfamilies.com/Help/HCINT',
    public_help_shell_only: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 181 Florida Public Help Shell Refinement Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: county_local_disability_resources',
    '- failure_code: public_dcf_contacts_csv_is_county_complete_but_wrong_role_help_lane_is_js_shell_and_myaccess_results_remain_authenticated',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Florida remains blocked and not index-safe.',
    '- The public Florida DCF assistance pages do expose one additional first-party help route on the MyACCESS host.',
    '- That help route is not a hidden county-office fallback: it returns only the generic JavaScript shell and no county, office, storefront, or customer-service-center rows.',
    '- The county-local family should stay blocked until a first-party public-assistance county contract becomes anonymously reviewable.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch181FloridaPublicHelpShellRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
