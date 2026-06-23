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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  gap: path.join(generatedDir, 'florida_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch205_florida_local_office_link_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch205-florida-local-office-link-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'public_assistance_pages_name_local_office_but_expose_no_public_county_office_leaf_and_myaccess_results_stay_authenticated';
const FAILURE_CODE = PRIMARY_GAP_REASON;

const COUNTY_STATUS_REASON = 'Official Florida DCF county-local routing remains blocked because the live public contacts.csv still proves 67/67 county-to-circuit coverage but zero true ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center rows. The public-assistance and applying-for-assistance pages now sharpen the failure further: although the official copy tells families they can turn in information at a local office, the extracted first-party href set from those exact pages still only points to the MyACCESS portal, Community Partner Search, ESS forms/manuals, Interview Tips, and partner guides, not to any public county office directory or local ESS office leaf. The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes remain the same generic shell, and anonymous county-result probes to `/accountmanagement/getZipCountyDetails` plus `/accountmanagement/communityPartnerSearch` still return HTTP 401, so the only county-grade public-assistance result lane remains authenticated-only.';

const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://www.myflfamilies.com/services/public-assistance, https://www.myflfamilies.com/services/public-assistance/applying-for-assistance, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch, and https://myaccess.myflfamilies.com/Help/HCINT, plus an exact href extraction from the two public-assistance pages. The Family Resource Center HTML and providers.csv still preserve reviewed storefront coverage for only 34/67 counties. The public Florida DCF contact-us page still loads a live first-party contacts.csv with explicit county coverage for all 67 counties, but a bounded role-field audit across all 109 public rows returned zero true matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center. The only apparent `ESS` matches were false positives inside the street address `5920 Arlington Expressway`, not Office of Economic Self Sufficiency service labels. The public-assistance page openly names the Office of Economic Self Sufficiency and the applying-for-assistance page says families may turn in information at a local office, but the extracted official href set from those pages still only points to MyACCESS, Community Partner Search, ESS forms/manuals, Interview Tips, partner guides, and videos, with no public county office directory or local ESS office leaf. The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes returned the same 5165-byte generic MyACCESS shell with the same `<title>MyACCESS</title>`, the same appconfig bootstrap, and no county, office, or storefront result rows. The first-party appconfig still exposes partnerApproverServices only under `/accountmanagement`, and bounded anonymous POST probes to the exact official `getZipCountyDetails` plus `communityPartnerSearch` endpoints still return HTTP 401 with `{\"message\":\"Unauthorized\"}`. Florida therefore remains blocked because the county-complete public contract is the wrong service role, the public local-office prose has no linked county-leaf contract, and the public-assistance county-result lane remains authenticated-only.';

const LESSON_HEADING = '### Local-Office Prose Does Not Count Without A Linked Public Leaf';
const LESSON_BODY = "*   **Lesson:** If an official benefits page says families can visit a \"local office\" but its exact first-party href set only leads to portal shells, partner search, forms, or guides, keep the county-local family blocked. Florida's applying-for-assistance page mentioned local offices, but no linked county office directory or ESS office leaf existed on the public page set.";

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
    '- The public-assistance page set now sharpens the blocker further: “local office” appears only as unlinked prose, while the extracted official hrefs still stop at MyACCESS, Community Partner Search, forms/manuals, Interview Tips, partner guides, and videos.',
    '- The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes remain the same generic shell, and the county-result endpoints remain authenticated-only under bounded anonymous probes.',
    '- Florida should only reopen county-local once a first-party public county office leaf or anonymous county-result contract exists.',
  ].join('\n') + '\n';
}

export function generateBatch205FloridaLocalOfficeLinkRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const queueRows = readJsonl(INPUTS.queue);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE }
        : row
    )),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'florida'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, status_reason: COUNTY_STATUS_REASON, family_status: 'blocked_public_local_office_prose_without_county_leaf_and_authenticated_myaccess_lane' }
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
    sampleByUrl.set('https://www.myflfamilies.com/services/public-assistance/applying-for-assistance', {
      sample_name: 'Florida Applying for Assistance',
      source_url: 'https://www.myflfamilies.com/services/public-assistance/applying-for-assistance',
      final_url: 'https://www.myflfamilies.com/services/public-assistance/applying-for-assistance',
      verification_status: 'reviewed',
      source_type: 'official_public_assistance_page_without_local_office_leaf',
      source_table: 'reviewed_live_probe',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The page says families can turn in information at a local office or community partner, but its extracted first-party links only lead to MyACCESS, Community Partner Search, ESS forms, and Interview Tips, not to a public county office directory or ESS office leaf.',
    });
    sampleByUrl.set('https://www.myflfamilies.com/services/public-assistance', {
      sample_name: 'Florida Public Assistance',
      source_url: 'https://www.myflfamilies.com/services/public-assistance',
      final_url: 'https://www.myflfamilies.com/services/public-assistance',
      verification_status: 'reviewed',
      source_type: 'official_public_assistance_page_without_county_leaf',
      source_table: 'reviewed_live_probe',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The public-assistance landing page names Economic Self Sufficiency and links to Community Partner Search, ESS manuals/forms, and MyACCESS, but not to a public county office directory or local ESS office leaf.',
    });
    const samples = Array.from(sampleByUrl.values());
    return {
      ...row,
      family_status: 'blocked_public_local_office_prose_without_county_leaf_and_authenticated_myaccess_lane',
      blocker_code: FAILURE_CODE,
      blocker_evidence: COUNTY_EVIDENCE,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          evidence: COUNTY_EVIDENCE,
          next_action: 'hold_county_local_until_first_party_public_county_office_leaf_or_anonymous_myaccess_results_exist',
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_205_florida_local_office_link_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    local_office_prose_without_leaf: true,
    extracted_public_leaf_count: 0,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 205 Florida Local Office Link Refinement Report v1',
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
    '- The official public-assistance page set references a local office only in prose; its extracted first-party href set still exposes no public county office leaf.',
    '- The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes remain the same generic shell, and the exact county-result endpoints remain HTTP 401 under bounded anonymous probes.',
    '- The county-local family should only reopen if a first-party public county office directory or anonymous county-result lane appears.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch205FloridaLocalOfficeLinkRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
