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
  failure: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  countyPacket: path.join(generatedDir, 'florida_county_local_disability_resources_leaf_authoring_packet_v1.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch158_florida_public_contacts_role_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch158-florida-public-contacts-role-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const COUNTY_FAILURE_CODE = 'public_dcf_contacts_csv_is_county_complete_but_wrong_service_role_and_myaccess_results_remain_authenticated';
const COUNTY_STATUS_REASON = 'Official Florida DCF county-local routing remains blocked because the live public contacts.csv now proves 67/67 county-to-circuit coverage, but that CSV is a general DCF contact directory made up of circuit header rows plus licensing, child-and-family, APS, refugee, and similar service contacts rather than ACCESS, Medicaid, SNAP, TANF, or intake office routing. The separate MyACCESS county-result contract still exists only behind authenticated `/accountmanagement` endpoints.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, and https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch. The Family Resource Center HTML and providers.csv still preserve reviewed storefront coverage for only 34/67 counties. The public Florida DCF contact-us page, however, now loads a live first-party contacts.csv that preserves 109 rows and explicit county coverage for all 67 Florida counties through 20 circuit header rows plus named service contacts. That public CSV is real, but its row roles are general DCF contacts such as Child and Family Well-Being, Substance Abuse Licensing, Refugee Services, Adult Protective Services, and Client Relations; it does not expose ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, or county office intake routing. The public config and main bundle still name partnerApproverServices=/accountmanagement and service paths `/getZipCountyDetails` plus `/communityPartnerSearch`, but bounded anonymous POST probes to those exact official endpoints return HTTP 401 with `{\"message\":\"Unauthorized\"}`. Florida therefore remains blocked not because no county-complete public contract exists, but because the county-complete public contract is the wrong service role and the public-assistance county-result lane remains authenticated-only.';
const COUNTY_NEXT_ACTION = 'hold_county_local_until_first_party_public_assistance_county_contract_or_anonymous_myaccess_results_exist';
const LESSON_HEADING = '### County-Complete Public Contact CSVs Still Fail If The Service Role Does Not Match The Family';
const LESSON_BODY = '*   **Lesson:** Do not clear a county-local family just because a first-party CSV covers every county. Florida DCF now publishes a public 67-county `contact-us/contacts.csv`, but it only carries circuit headers plus licensing, child-and-family, APS, refugee, and client-relations contacts, so it cannot replace a missing ACCESS or Medicaid county-office contract.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
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
    '- The first-party county-local story is now sharper: Florida DCF does publish a public county-complete contacts.csv, but it is a general DCF service-contact directory rather than a public-assistance office contract.',
    '- The Family Resource Center storefront lane still clears only 34 counties, and the MyACCESS county-result endpoints remain authenticated-only under `/accountmanagement`.',
    '- Florida should only reopen county-local once a first-party public-assistance county contract appears publicly or the existing MyACCESS county-result lane becomes anonymously reviewable.',
  ].join('\n') + '\n';
}

export function generateBatch158FloridaPublicContactsRoleRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const countyPacket = readJson(INPUTS.countyPacket);

  const updatedCountyPacket = {
    ...countyPacket,
    repair_lane: 'evidence_only_until_public_assistance_county_contract_exists',
    purpose: 'Deterministic evidence packet for Florida county-local routing while county-complete public DCF contacts exist only as a wrong-role general service directory and the MyACCESS county-result lane stays authenticated-only.',
    current_problem_metrics: {
      ...countyPacket.current_problem_metrics,
      publicCountyCoverageRows: 34,
      missingCountyCount: 33,
      contactsCsvRows: 109,
      publicCountyCompleteCircuitRows: 20,
      publicCountyCompleteCoverage: 67,
      publicAssistanceCountyRows: 0,
      authenticatedCountyEndpoints: 2,
    },
    representative_sources: [
      'https://familyresourcecenter.myflfamilies.com/',
      'https://familyresourcecenter.myflfamilies.com/providers.csv',
      'https://www.myflfamilies.com/contact-us',
      'https://www.myflfamilies.com/contact-us/contacts.csv',
      'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
      'https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch',
    ],
    root_domains_to_review: [
      'reviewable anonymous public Florida DCF or MyACCESS public-assistance county contracts only',
      'do not treat county-complete general DCF contact rows or source_listed staging partner rows as ACCESS or Medicaid office evidence',
    ],
    packet_complete_when: 'Florida can reopen only when a first-party public-assistance county dataset or another public office contract truthfully covers the remaining 33 storefront-gap counties, or when MyACCESS county-result endpoints become anonymously reviewable.',
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_county_complete_public_contacts_wrong_role_and_authenticated_public_assistance_lane',
          status_reason: COUNTY_STATUS_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_county_complete_public_contacts_wrong_role_and_authenticated_public_assistance_lane',
          query_basis: 'Reviewed the public Family Resource Center storefront contract, the public Florida DCF contact-us page and contacts.csv, and bounded anonymous probes to the MyACCESS county-result endpoints.',
          blocker_code: COUNTY_FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          sample_count: 41,
          samples: [
            {
              sample_name: 'Florida DCF Contact Us',
              source_url: 'https://www.myflfamilies.com/contact-us',
              final_url: 'https://www.myflfamilies.com/contact-us',
              verification_status: 'reviewed',
              source_type: 'official_public_contact_page',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live Contact Us page exposes a public county-or-circuit finder and client-side code that fetches `/contact-us/contacts.csv`.',
            },
            {
              sample_name: 'Florida DCF Contacts CSV',
              source_url: 'https://www.myflfamilies.com/contact-us/contacts.csv',
              final_url: 'https://www.myflfamilies.com/contact-us/contacts.csv',
              verification_status: 'reviewed',
              source_type: 'official_county_complete_general_contacts_csv',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public contacts.csv preserves 109 rows and explicit county coverage for all 67 Florida counties, but the visible roles are circuit headers plus general DCF services like licensing, child-and-family well-being, APS, refugee services, and client relations rather than ACCESS or Medicaid office routing.',
            },
            {
              sample_name: 'Florida Family Resource Center Providers CSV',
              source_url: 'https://familyresourcecenter.myflfamilies.com/providers.csv',
              final_url: 'https://familyresourcecenter.myflfamilies.com/providers.csv',
              verification_status: 'reviewed',
              source_type: 'official_partial_public_storefront_csv',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public storefront CSV still names only 34 unique Florida counties with county-specific storefront rows, leaving 33 counties outside the public storefront contract.',
            },
            {
              sample_name: 'MyACCESS getZipCountyDetails',
              source_url: 'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
              final_url: 'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
              verification_status: 'blocked',
              source_type: 'official_authenticated_api_contract',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded anonymous POST to the exact official getZipCountyDetails endpoint returned HTTP 401 with {\"message\":\"Unauthorized\"}, so the county lookup contract is not public.',
            },
            {
              sample_name: 'MyACCESS communityPartnerSearch',
              source_url: 'https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch',
              final_url: 'https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch',
              verification_status: 'blocked',
              source_type: 'official_authenticated_api_contract',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'Bounded anonymous POST probes with ZIP and county sample payloads returned HTTP 401 with {\"message\":\"Unauthorized\"}, so the community-partner search lane is authenticated-only.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_FAILURE_CODE, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: COUNTY_FAILURE_CODE,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_EVIDENCE,
        next_action: COUNTY_NEXT_ACTION,
      },
    ],
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJson(INPUTS.countyPacket, updatedCountyPacket);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);

  const lessonAdded = updateLessonsFile(INPUTS.lessons);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_158_florida_public_contacts_role_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    county_complete_public_contacts_csv: true,
    public_contacts_county_coverage: 67,
    public_contacts_service_role_match: false,
    public_storefront_county_coverage: 34,
    anonymous_myaccess_status: 401,
    lesson_added: lessonAdded,
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Florida Public Contacts Role Refinement Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      '- refined_family: county_local_disability_resources',
      `- failure_code: ${COUNTY_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${COUNTY_EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- Florida does publish a county-complete first-party contacts.csv, but it is a general DCF contact directory rather than an ACCESS or Medicaid office contract.',
      '- The public storefront CSV still stops at 34 counties, and the remaining MyACCESS county-result endpoints stay authenticated-only.',
      '- Florida remains blocked until a role-matching public-assistance county contract exists or the authenticated county-result lane becomes public.',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (process.argv[1] === __filename || (process.argv[1] && path.resolve(process.argv[1]) === __filename)) {
  generateBatch158FloridaPublicContactsRoleRefinementV1();
  console.log('batch158_florida_public_contacts_role_refinement_v1: ok');
}
