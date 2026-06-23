import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  gap: path.join(generatedDir, 'florida_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  countyPacket: path.join(generatedDir, 'florida_county_local_disability_resources_leaf_authoring_packet_v1.json'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
  staging: path.join(repoRoot, 'data', 'state-upgrades', 'florida', 'staging_dcf_access_offices.json'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch157_florida_packet_alignment_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch157-florida-packet-alignment-report-v1.md'),
};

const STATUS_REASON = 'Official Florida DCF county-local routing remains blocked because the public Family Resource Center HTML and the reviewed storefront CSV stop at 34 counties, while the remaining county-results contract behind MyACCESS is authenticated-only. The county packet should stay evidence-only rather than treating generic MyACCESS partner or kiosk rows as local authoring seeds.';
const FAILURE_EVIDENCE = 'Reviewed 2026-06-23 current Florida county-local blocker artifacts plus the on-disk county packet and the older staging inventory. The live public Family Resource Center page and the providers.csv feed still preserve reviewed storefront coverage for only 34/67 counties, while bounded anonymous POST probes to the exact official MyACCESS county-result endpoints `/accountmanagement/getZipCountyDetails` and `/communityPartnerSearch` return HTTP 401 Unauthorized. The older staging file contains 61 source_listed rows, but those rows are still only 25 community partners, 13 storefronts, 11 kiosks, 8 DCF service centers, 2 regional hubs, 1 online portal, and 1 central call center all rooted in the same generic MyACCESS lane rather than a new anonymous county contract. Florida therefore should stay blocked until a first-party anonymous county dataset or another public office contract covers the remaining 33 counties.';

const LESSON_HEADING = '### Once A County Packet Depends On Authenticated Results, Stop Treating Source-Listed Partner Rows As Authoring Seeds';
const LESSON_BODY = '*   **Lesson:** If the remaining county coverage lives behind an authenticated official result contract, strip generic source-listed partner, kiosk, and storefront rows out of the active authoring lane. Florida’s 61-row MyACCESS staging file looked richer than the public contract, but it only recycled authenticated or generic partner material and would have caused churn if we kept treating it like scrape-ready county evidence.';

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

export function generateBatch157FloridaPacketAlignmentV1() {
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const countyPacket = readJson(INPUTS.countyPacket);
  const stagingRows = readJson(INPUTS.staging);

  const typeCounts = stagingRows.reduce((acc, row) => {
    const key = row.office_type || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const updatedCountyPacket = {
    ...countyPacket,
    repair_lane: 'evidence_only_until_anonymous_public_county_contract_exists',
    purpose: 'Deterministic evidence packet for Florida county-local routing while public Family Resource Center coverage remains partial and the remaining MyACCESS county-result contract is authenticated-only.',
    current_problem_metrics: {
      publicCountyCoverageRows: 34,
      missingCountyCount: 33,
      authenticatedCountyEndpoints: 2,
      stagingSourceListedRows: stagingRows.length,
      stagingCommunityPartnerRows: typeCounts.access_community_partner || 0,
      stagingStorefrontRows: typeCounts.access_storefront || 0,
      stagingKioskRows: typeCounts.access_kiosk || 0,
      stagingServiceCenterRows: typeCounts.dcf_service_center || 0,
      stagingRegionalHubRows: typeCounts.regional_service_hub || 0,
      stagingOnlinePortalRows: typeCounts.online_portal || 0,
      stagingCentralCallCenterRows: typeCounts.central_call_center || 0,
    },
    representative_sources: [
      'https://familyresourcecenter.myflfamilies.com/',
      'https://familyresourcecenter.myflfamilies.com/providers.csv',
      'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
      'https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch',
    ],
    root_domains_to_review: [
      'reviewable anonymous public Florida DCF or MyACCESS county contracts only',
      'do not reuse source_listed partner, kiosk, storefront, or hub rows from staging_dcf_access_offices.json as county authoring seeds',
    ],
    packet_complete_when: 'Florida can reopen only when a first-party anonymous county dataset or another public office contract truthfully covers the remaining 33 counties.',
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, evidence: FAILURE_EVIDENCE }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          query_basis: 'Reviewed Florida county-local blocker artifacts, the current public Family Resource Center surfaces, and the older staging inventory; aligned the packet to anonymous-public-contract evidence only.',
          blocker_evidence: FAILURE_EVIDENCE,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          next_action: 'hold_county_local_until_first_party_anonymous_county_dataset_or_public_office_contract_covers_remaining_33_counties',
          evidence: FAILURE_EVIDENCE,
        }
      : row
  ));

  writeJson(INPUTS.countyPacket, updatedCountyPacket);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const report = fs.readFileSync(INPUTS.stateReport, 'utf8')
    .replace(
      'The reviewed official Family Resource Center HTML and CSV both still stop at 34 counties, and the broader 61-row staging artifact cannot cure the gap because it is still only source-listed MyACCESS partner/kiosk/storefront material rather than a newly reviewed anonymous county contract.',
      'The reviewed official Family Resource Center HTML and CSV both still stop at 34 counties, and the broader 61-row staging artifact cannot cure the gap because it is still only source-listed MyACCESS partner, kiosk, storefront, hub, and portal material rather than a newly reviewed anonymous county contract.'
    )
    .replace(
      'Florida should only reopen county-local once the state publishes an anonymous county dataset or another public office contract for the remaining 33 counties.',
      'Florida should only reopen county-local once the state publishes an anonymous county dataset or another public office contract for the remaining 33 counties, not by recycling the source-listed staging rows as local authoring seeds.'
    );
  fs.writeFileSync(INPUTS.stateReport, report);

  const batchSummary = {
    state: 'florida',
    classification: 'BLOCKED',
    index_safe: false,
    county_packet_aligned: true,
    public_county_rows: 34,
    missing_counties: 33,
    staging_source_listed_rows: stagingRows.length,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${report}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch157FloridaPacketAlignmentV1();
  console.log(JSON.stringify(result, null, 2));
}
