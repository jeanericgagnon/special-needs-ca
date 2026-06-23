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
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch211_florida_ess_faq_customer_service_center_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch211-florida-ess-faq-customer-service-center-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'ess_faq_names_customer_service_center_but_exposes_no_public_county_leaf_and_myaccess_results_stay_authenticated';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const NEXT_ACTION = 'hold_county_local_until_first_party_public_county_office_leaf_or_anonymous_myaccess_results_exist';

const COUNTY_STATUS_REASON = 'Official Florida DCF county-local routing remains blocked because the live public contacts.csv still proves 67/67 county-to-circuit coverage but zero true ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center rows. The public DCF sitemap now also confirms additional ESS guidance leaves, including the Economic Self Sufficiency FAQ and Community Partner Network pages, but those exact official leaves still stop at statewide prose and partner-routing. The ESS FAQ says families can get help at a local service center or community partner location, can hand-deliver paperwork to a customer service center, and can call the Customer Call Center, but it exposes no county list, no county office table, and no linked public county office or ESS office leaf. The Community Partner Network page still only points families to `Find your nearest Partner` on MyACCESS. The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes remain the same generic shell, and anonymous county-result probes to `/accountmanagement/getZipCountyDetails` plus `/accountmanagement/communityPartnerSearch` still return HTTP 401, so the only county-grade public-assistance result lane remains authenticated-only.';

const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://www.myflfamilies.com/services/public-assistance, https://www.myflfamilies.com/services/public-assistance/applying-for-assistance, https://www.myflfamilies.com/services/public-assistance/economic-self-sufficiency-frequently-asked-questions/, https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/community/, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch, and https://myaccess.myflfamilies.com/Help/HCINT, plus an exact href extraction from the public-assistance leaves surfaced on the live sitemap. The Family Resource Center HTML and providers.csv still preserve reviewed storefront coverage for only 34/67 counties. The public Florida DCF contact-us page still loads a live first-party contacts.csv with explicit county coverage for all 67 counties, but a bounded role-field audit across all 109 public rows returned zero true matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center. The only apparent `ESS` matches were false positives inside the street address `5920 Arlington Expressway`, not Office of Economic Self Sufficiency service labels. The official ESS FAQ now sharpens the blocker: it explicitly says families can get help at a local service center or community partner location, can hand-deliver paperwork to a customer service center, and can call the Customer Call Center, yet that exact leaf still provides no county list, no county office table, and no linked public county office or ESS office leaf. The official Community Partner Network leaf still only points families to `Find your nearest Partner` on MyACCESS rather than a public county office directory. The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes returned the same generic MyACCESS shell with no county, office, or storefront result rows. The first-party appconfig still exposes partnerApproverServices only under `/accountmanagement`, and bounded anonymous POST probes to the exact official `getZipCountyDetails` plus `communityPartnerSearch` endpoints still return HTTP 401 with `{\"message\":\"Unauthorized\"}`. Florida therefore remains blocked because even its stronger ESS guidance leaves still name local service centers only in prose, while the only county-result lane remains authenticated-only.';

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
    '- The live DCF sitemap now confirms stronger ESS guidance leaves, but the exact FAQ still names local service centers and customer service centers only in prose and never exposes a county office table or leaf.',
    '- The Community Partner Network leaf still routes families only to MyACCESS partner search, and the public MyACCESS county-result lanes remain shell-only or authenticated-only.',
    '- Florida should only reopen county-local once a first-party public county office leaf or anonymous county-result contract exists.',
  ].join('\n') + '\n';
}

export function generateBatch211FloridaEssFaqCustomerServiceCenterRefinementV1() {
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
        ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: NEXT_ACTION }
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
      ? { ...row, status_reason: COUNTY_STATUS_REASON, family_status: 'blocked_ess_faq_local_service_center_prose_without_county_leaf' }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const sampleByUrl = new Map((Array.isArray(row.samples) ? row.samples : []).map((sample) => [sample.source_url, sample]));
    sampleByUrl.set('https://www.myflfamilies.com/services/public-assistance/economic-self-sufficiency-frequently-asked-questions/', {
      sample_name: 'Florida ESS FAQ',
      source_url: 'https://www.myflfamilies.com/services/public-assistance/economic-self-sufficiency-frequently-asked-questions/',
      final_url: 'https://www.myflfamilies.com/services/public-assistance/economic-self-sufficiency-frequently-asked-questions/',
      verification_status: 'reviewed',
      source_type: 'official_ess_faq_without_county_office_leaf',
      source_table: 'reviewed_live_probe',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The FAQ says families can get help at a local service center or community partner location, can hand-deliver paperwork to a customer service center, and can call the Customer Call Center, but it never provides a county list, county office table, or linked public ESS office leaf.',
    });
    sampleByUrl.set('https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/community/', {
      sample_name: 'Florida Community Partner Network',
      source_url: 'https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/community/',
      final_url: 'https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/community/',
      verification_status: 'reviewed',
      source_type: 'official_partner_network_without_county_office_leaf',
      source_table: 'reviewed_live_probe',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The Community Partner Network page explains partner participation and links only to `Find your nearest Partner` on MyACCESS, not to a public county office or ESS office directory.',
    });
    const samples = Array.from(sampleByUrl.values());
    return {
      ...row,
      family_status: 'blocked_ess_faq_local_service_center_prose_without_county_leaf',
      blocker_code: FAILURE_CODE,
      blocker_evidence: COUNTY_EVIDENCE,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    batch: 'batch_211_florida_ess_faq_customer_service_center_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    essFaqMentionsLocalServiceCenter: true,
    essFaqMentionsCustomerServiceCenter: true,
    publicCountyOfficeLeafExposed: false,
    communityLeafOnlyRoutesToPartnerSearch: true,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 211 Florida ESS FAQ Customer Service Center Refinement Report v1',
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
    '- The live sitemap surfaced stronger official ESS guidance leaves, but the FAQ still names local service centers and customer service centers only in prose.',
    '- No public county office table, county office directory, or linked ESS office leaf appears on those exact public leaves.',
    '- The Community Partner Network still only routes to MyACCESS partner search, and the county-result endpoints remain authenticated-only.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch211FloridaEssFaqCustomerServiceCenterRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
