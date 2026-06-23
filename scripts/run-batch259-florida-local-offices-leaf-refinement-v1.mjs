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
  batchSummary: path.join(generatedDir, 'batch259_florida_local_offices_leaf_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch259-florida-local-offices-leaf-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const FAMILY_STATUS = 'blocked_official_local_offices_leaf_points_to_partial_storefront_lane_and_authenticated_only_results';
const NEXT_ACTION = 'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_anonymous_myaccess_results_exist';

const STATUS_REASON = 'Official Florida DCF county-local routing remains blocked even after one more bounded official pass. The live public `food-cash-and-medical` leaf now explicitly advertises `Local Offices` and links to the Family Resource Center host, but that first-party lane still preserves reviewed storefront coverage for only 34 of 67 counties rather than a complete county-local contract. The public DCF contacts.csv still proves 67/67 county-to-circuit coverage but zero true ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center rows. The live sitemap still exposes `contact-us/circuit-*` children that return HTTP 404, and the anonymous MyACCESS county-result endpoints still return HTTP 401.';

const EVIDENCE = 'Reviewed 2026-06-23 bounded live official checks on https://www.myflfamilies.com/sitemap.xml, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://www.myflfamilies.com/services/public-assistance, https://www.myflfamilies.com/services/public-assistance/applying-for-assistance, https://www.myflfamilies.com/services/public-assistance/economic-self-sufficiency-frequently-asked-questions/, https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/community/, https://www.myflfamilies.com/food-cash-and-medical, https://familyresourcecenter.myflfamilies.com/, https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/Help/HCINT, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, and https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch. The exact official `food-cash-and-medical` leaf now explicitly includes a `Find Local Offices` link, but that link lands on the Family Resource Center host, whose reviewed providers.csv still yields only 34 county storefront rows rather than a 67-county local-office contract. The public contacts.csv still loads with all 67 counties mapped to circuits, but a bounded role-field audit across all 109 rows still returns zero true matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, cash assistance, or customer service center, and the apparent `ESS` hits remain false positives from `5920 Arlington Expressway`. The live sitemap still advertises `contact-us/circuit-*` children, and sampled circuit leaves such as `/contact-us/circuit-3` and `/contact-us/circuit-11` still return live HTTP 404 responses. The anonymous MyACCESS `Public/CPCPS` and `Help/HCINT` routes still return the same generic MyACCESS shell, and bounded anonymous POST probes to the exact official `getZipCountyDetails` plus `communityPartnerSearch` endpoints still return HTTP 401 with `{\"message\":\"Unauthorized\"}`. Florida therefore remains blocked because the exact official local-offices leaf still resolves only to a partial storefront lane, the public circuit leaves are dead, and the county-result search lane remains authenticated-only.';

const LESSON_HEADING = '### An Exact Local-Offices Leaf Still Fails If It Only Resolves To A Partial Storefront Lane';
const LESSON_BODY = '*   **Lesson:** Treat an official `Find Local Offices` leaf as a lead, not a clearance. Florida now exposes an exact `food-cash-and-medical` page with a `Find Local Offices` link, but because that link still lands on a 34-county Family Resource Center storefront lane instead of a complete 67-county county-local contract, the state remains blocked.';

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
    '- The exact official `food-cash-and-medical` leaf now advertises `Local Offices`, but it still resolves only to the partial Family Resource Center storefront lane.',
    '- The public DCF contacts.csv remains the wrong service role for county-local disability routing, and the public circuit leaves remain dead.',
    '- The anonymous MyACCESS county-result endpoints remain authenticated-only under bounded probes.',
    '- Florida should reopen county-local only if a first-party county-complete local-offices directory or anonymous county-result contract becomes public.',
  ].join('\n') + '\n';
}

export function generateBatch259FloridaLocalOfficesLeafRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      query_basis: 'Reviewed 2026-06-23 the official DCF public-assistance leaves, food-cash-and-medical local-offices leaf, contacts.csv, Family Resource Center storefront lane, sitemap circuit leaves, and anonymous MyACCESS endpoints.',
      sample_count: 7,
      samples: [
        {
          sample_name: 'Florida Food Cash and Medical',
          source_url: 'https://www.myflfamilies.com/food-cash-and-medical',
          final_url: 'https://www.myflfamilies.com/food-cash-and-medical',
          verification_status: 'reviewed',
          source_type: 'official_local_offices_leaf_to_partial_storefront_lane',
          source_table: 'batch259_florida_local_offices_leaf_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The page explicitly advertises `Local Offices` and links `Find Local Offices` to familyresourcecenter.myflfamilies.com rather than to a county-complete DCF office directory.',
        },
        {
          sample_name: 'Florida Family Resource Center providers.csv',
          source_url: 'https://familyresourcecenter.myflfamilies.com/providers.csv',
          final_url: 'https://familyresourcecenter.myflfamilies.com/providers.csv',
          verification_status: 'blocked',
          source_type: 'official_partial_storefront_lane',
          source_table: 'batch259_florida_local_offices_leaf_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The reviewed providers.csv still yields only 34 county storefront rows rather than a full 67-county local-office contract.',
        },
        {
          sample_name: 'Florida DCF contacts.csv',
          source_url: 'https://www.myflfamilies.com/contact-us/contacts.csv',
          final_url: 'https://www.myflfamilies.com/contact-us/contacts.csv',
          verification_status: 'blocked',
          source_type: 'official_circuit_mapping_wrong_service_role',
          source_table: 'batch259_florida_local_offices_leaf_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The contacts.csv still maps all 67 counties to circuits, but role-field review still shows zero true ACCESS, SNAP, TANF, Medicaid, ESS, or customer service center rows.',
        },
        {
          sample_name: 'Florida DCF sitemap circuit leaves',
          source_url: 'https://www.myflfamilies.com/sitemap.xml',
          final_url: 'https://www.myflfamilies.com/sitemap.xml',
          verification_status: 'blocked',
          source_type: 'official_sitemap_with_dead_circuit_children',
          source_table: 'batch259_florida_local_offices_leaf_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The sitemap still advertises `contact-us/circuit-*` children, but sampled circuit leaves like `/contact-us/circuit-3` and `/contact-us/circuit-11` return live 404 pages.',
        },
        {
          sample_name: 'Florida Applying for Assistance',
          source_url: 'https://www.myflfamilies.com/services/public-assistance/applying-for-assistance',
          final_url: 'https://www.myflfamilies.com/services/public-assistance/applying-for-assistance',
          verification_status: 'reviewed',
          source_type: 'official_local_office_prose_without_public_leaf',
          source_table: 'batch259_florida_local_offices_leaf_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The page says families can turn in information at a local office or community partner, but the linked county-result lane still stops at Family Resource Center or authenticated-only MyACCESS routes.',
        },
        {
          sample_name: 'MyACCESS Public CPCPS',
          source_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
          final_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
          verification_status: 'blocked',
          source_type: 'official_generic_myaccess_shell',
          source_table: 'batch259_florida_local_offices_leaf_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The public CPCPS route still returns the same generic MyACCESS shell with no county, office, or storefront result rows.',
        },
        {
          sample_name: 'MyACCESS anonymous county-result endpoints',
          source_url: 'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
          final_url: 'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
          verification_status: 'blocked',
          source_type: 'official_authenticated_only_endpoint',
          source_table: 'batch259_florida_local_offices_leaf_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'Bounded anonymous POST probes to `getZipCountyDetails` and `communityPartnerSearch` still return HTTP 401 `{\"message\":\"Unauthorized\"}`.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch259_florida_local_offices_leaf_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    exact_local_offices_leaf_reviewed: true,
    family_resource_center_county_rows: 34,
    dead_circuit_leaf_samples: 2,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 259 Florida Local Offices Leaf Refinement Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: county_local_disability_resources',
    `- failure_code: ${FAILURE_CODE}`,
    '',
    '## Evidence',
    '',
    `- ${EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Florida remains blocked and not index-safe.',
    '- The exact official `food-cash-and-medical` leaf now exposes a `Find Local Offices` link, but it still lands only on the partial Family Resource Center storefront lane.',
    '- The public DCF circuit leaves remain dead and the anonymous MyACCESS county-result endpoints remain authenticated-only.',
    '- Florida should only reopen when a county-complete first-party local-office contract or anonymous county-result lane becomes public.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch259FloridaLocalOfficesLeafRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
