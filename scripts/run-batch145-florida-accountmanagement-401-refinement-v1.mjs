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
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch145_florida_accountmanagement_401_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch145-florida-accountmanagement-401-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const COUNTY_FAILURE_CODE = 'myaccess_accountmanagement_endpoints_exist_but_require_authentication_for_county_results';
const COUNTY_STATUS_REASON = 'Official Florida DCF county-local routing remains blocked because the public MyACCESS shell still clears only 34/67 counties through the Family Resource Center CSV, and the newly proven same-domain accountmanagement endpoints are not anonymous public contracts. The public bundle names `/accountmanagement/getZipCountyDetails` and `/accountmanagement/communityPartnerSearch`, but bounded POST probes return `401 Unauthorized`, so the remaining county-office results are authenticated-only rather than publicly reviewable.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, and https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch. The Family Resource Center CSV still preserves reviewed storefront coverage for only 34/67 Florida counties. The public config and main bundle explicitly name partnerApproverServices=/accountmanagement and service paths `/getZipCountyDetails` plus `/communityPartnerSearch`, proving the MyACCESS lane does have a same-domain county-search contract. But bounded anonymous POST probes to those exact official endpoints returned HTTP 401 with `{\"message\":\"Unauthorized\"}` for ZIP and county sample payloads. The older public shell, plain GET proxy lane, Broward/Dade stub, sample rows, and dead `ess-storefronts-and-lobbies` help link still fail as public county-grade evidence. Florida therefore remains blocked not because no official contract exists, but because the remaining county-results contract is authenticated-only and not publicly reviewable for the other 33 counties.';
const COUNTY_NEXT_ACTION = 'hold_county_local_until_first_party_anonymous_county_dataset_or_public_office_contract_covers_remaining_33_counties';
const LESSON_HEADING = '### Same-Domain API Paths Still Fail Closed If The Official Contract Requires Auth';
const LESSON_BODY = '*   **Lesson:** If a public bundle names a same-domain county-search endpoint, probe that exact endpoint once before promising a hidden public contract. Florida’s MyACCESS bundle exposed `/accountmanagement/getZipCountyDetails` and `/communityPartnerSearch`, but both returned `401 Unauthorized`, so the lane stayed blocked as authenticated-only rather than undocumented.';

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
    '- The reviewed official Family Resource Center CSV still clears only 34 counties.',
    '- The remaining MyACCESS lane is sharper than a generic JS-shell blocker: the public bundle points at same-domain county-search endpoints, but bounded anonymous POST probes to `/accountmanagement/getZipCountyDetails` and `/communityPartnerSearch` return `401 Unauthorized`.',
    '- Florida should only reopen county-local once the state publishes an anonymous county dataset or another public office contract for the remaining 33 counties.',
  ].join('\n') + '\n';
}

export function generateBatch145FloridaAccountmanagement401RefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_public_csv_partial_authenticated_county_contract',
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
          family_status: 'blocked_public_csv_partial_authenticated_county_contract',
          query_basis: 'Reviewed official DCF Family Resource Center CSV, the public MyACCESS shell, the public config, and bounded anonymous POST probes to the same-domain accountmanagement endpoints named in the live bundle.',
          blocker_code: COUNTY_FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          samples: [
            ...(row.samples || []).filter((sample) => sample.source_url !== 'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails' && sample.source_url !== 'https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch'),
            {
              sample_name: 'MyACCESS getZipCountyDetails',
              source_url: 'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
              final_url: 'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
              verification_status: 'blocked',
              source_type: 'official_authenticated_api_contract',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T22:20:00.000Z',
              evidence_snippet: 'A bounded anonymous POST to the exact official getZipCountyDetails endpoint returned HTTP 401 with {\"message\":\"Unauthorized\"}, so the county lookup contract is not public.',
            },
            {
              sample_name: 'MyACCESS communityPartnerSearch',
              source_url: 'https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch',
              final_url: 'https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch',
              verification_status: 'blocked',
              source_type: 'official_authenticated_api_contract',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T22:20:00.000Z',
              evidence_snippet: 'Bounded anonymous POST probes with ZIP and county sample payloads returned HTTP 401 with {\"message\":\"Unauthorized\"}, so the community-partner search lane is authenticated-only.',
            },
          ],
          sample_count: 39,
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

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  const lessonAdded = updateLessonsFile(INPUTS.lessons);

  writeJson(OUTPUTS.summary, {
    batch: 'batch_145_florida_accountmanagement_401_refinement_v1',
    generated_at: '2026-06-22T22:22:00.000Z',
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_families: ['county_local_disability_resources'],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    authenticatedAccountmanagementEndpoints: [
      '/accountmanagement/getZipCountyDetails',
      '/accountmanagement/communityPartnerSearch',
    ],
    anonymousProbeStatus: 401,
    lesson_added: lessonAdded,
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Florida Accountmanagement 401 Refinement Report v1',
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
      '- The same-domain accountmanagement endpoints are real official contracts, but they are not public anonymous county-result lanes.',
      '- Florida remains blocked until a public county dataset or other anonymous official office contract exists for the remaining counties.',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (process.argv[1] === __filename || (process.argv[1] && path.resolve(process.argv[1]) === __filename)) {
  generateBatch145FloridaAccountmanagement401RefinementV1();
  console.log('batch145_florida_accountmanagement_401_refinement_v1: ok');
}
