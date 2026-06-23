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
  batchSummary: path.join(generatedDir, 'batch226_florida_sitemap_no_county_office_leaf_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch226-florida-sitemap-no-county-office-leaf-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'public_assistance_sitemap_has_no_county_office_leaf_and_myaccess_results_stay_authenticated';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const NEXT_ACTION = 'hold_county_local_until_first_party_public_assistance_tree_exposes_county_leaf_or_anonymous_myaccess_results_exist';

const COUNTY_STATUS_REASON = 'Official Florida DCF county-local routing remains blocked because the live public contacts.csv still proves 67/67 county-to-circuit coverage but zero true ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center rows. A bounded recheck of the live official sitemap now closes the discovery loop further: the public-assistance tree itself enumerates the exact public leaves for applying, FAQ, fraud, SNAP, cash assistance, refugee services, manuals, and forms, but it still exposes no county office directory, no service-center leaf, and no county ESS office page. The ESS FAQ still says families can get help at a local service center or community partner location and can hand-deliver paperwork to a customer service center, but it exposes no county list, no county office table, and no linked public ESS office leaf. The Community Partner Network page still only points families to `Find your nearest Partner` on MyACCESS. The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes remain the same generic shell, and anonymous county-result probes to `/accountmanagement/getZipCountyDetails` plus `/accountmanagement/communityPartnerSearch` still return HTTP 401, so the only county-grade public-assistance result lane remains authenticated-only.';

const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://www.myflfamilies.com/services/public-assistance, https://www.myflfamilies.com/services/public-assistance/applying-for-assistance, https://www.myflfamilies.com/services/public-assistance/economic-self-sufficiency-frequently-asked-questions/, https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/community/, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch, https://myaccess.myflfamilies.com/Help/HCINT, and the live official sitemap at https://www.myflfamilies.com/sitemap.xml. The Family Resource Center HTML and providers.csv still preserve reviewed storefront coverage for only 34/67 counties. The public Florida DCF contact-us page still loads a live first-party contacts.csv with explicit county coverage for all 67 counties, but a bounded role-field audit across all 109 public rows returned zero true matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center. The only apparent `ESS` matches were false positives inside the street address `5920 Arlington Expressway`, not Office of Economic Self Sufficiency service labels. The live sitemap now proves the official public-assistance tree itself still exposes only statewide leaves such as applying-for-assistance, FAQ, fraud, SNAP, cash assistance, refugee services, manuals, and forms, with no county office directory, no service-center leaf, and no county ESS office page. The official ESS FAQ still says families can get help at a local service center or community partner location, can hand-deliver paperwork to a customer service center, and can call the Customer Call Center, yet that exact leaf still provides no county list, no county office table, and no linked public ESS office leaf. The official Community Partner Network leaf still only points families to `Find your nearest Partner` on MyACCESS rather than a public county office directory. The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes returned the same generic MyACCESS shell with no county, office, or storefront result rows. The first-party appconfig still exposes partnerApproverServices only under `/accountmanagement`, and bounded anonymous POST probes to the exact official `getZipCountyDetails` plus `communityPartnerSearch` endpoints still return HTTP 401 with `{\"message\":\"Unauthorized\"}`. Florida therefore remains blocked because the public-assistance tree itself has no county office leaf, while the only county-result lane remains authenticated-only.';

const LESSON_HEADING = '### A Live Official Sitemap With No Office Leaf Is A Final County-Local Stop Signal';
const LESSON_BODY = "*   **Lesson:** If the official sitemap fully enumerates a benefits subtree and none of the exact leaves are office, directory, or county-routing pages, stop low-token discovery there. Florida's public-assistance sitemap listed the whole public tree, and it still contained no county ESS office leaf, so only a future tree change or anonymous locator contract can reopen the county-local family.";

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
    '- The live official sitemap now closes the discovery loop: the public-assistance tree exposes statewide guidance leaves but no county office directory, no service-center leaf, and no county ESS office page.',
    '- The public MyACCESS county-result lanes remain shell-only or authenticated-only under bounded anonymous probes.',
    '- Florida should only reopen county-local once a first-party public county office leaf appears in the public-assistance tree or an anonymous MyACCESS county-result contract exists.',
  ].join('\n') + '\n';
}

export function generateBatch226FloridaSitemapNoCountyOfficeLeafRefinementV1() {
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
      ? { ...row, status_reason: COUNTY_STATUS_REASON, family_status: 'blocked_public_assistance_sitemap_without_county_office_leaf' }
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
    sampleByUrl.set('https://www.myflfamilies.com/sitemap.xml', {
      sample_name: 'Florida DCF Sitemap',
      source_url: 'https://www.myflfamilies.com/sitemap.xml',
      final_url: 'https://www.myflfamilies.com/sitemap.xml',
      verification_status: 'reviewed',
      source_type: 'official_sitemap_without_county_office_leaf',
      source_table: 'reviewed_live_probe',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The live sitemap lists the public-assistance subtree leaves for applying, FAQ, fraud, SNAP, cash assistance, refugee services, manuals, and forms, but no county office directory, service-center leaf, or county ESS office page.',
    });
    const samples = Array.from(sampleByUrl.values());
    return {
      ...row,
      family_status: 'blocked_public_assistance_sitemap_without_county_office_leaf',
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

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_226_florida_sitemap_no_county_office_leaf_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    sitemapEnumeratesPublicAssistanceTree: true,
    publicCountyOfficeLeafExposed: false,
    anonymousCountyResultLaneExposed: false,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 226 Florida Sitemap No County Office Leaf Refinement Report v1',
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
    '- The live official sitemap now proves the public-assistance tree itself has no county office directory, no service-center leaf, and no county ESS office page.',
    '- The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes remain shell-only, and the exact county-result endpoints remain HTTP 401 under bounded anonymous probes.',
    '- The county-local family should only reopen if a first-party public county office leaf appears or an anonymous county-result contract becomes public.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch226FloridaSitemapNoCountyOfficeLeafRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
