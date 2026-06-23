import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'nebraska_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'nebraska_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'nebraska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nebraska_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'nebraska_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'nebraska_county_local_disability_resources_service_area_packet_v1.json'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch233_nebraska_office_county_coverage_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch233-nebraska-office-county-coverage-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'official_public_office_app_has_only_two_public_layers_and_37_distinct_office_counties';
const STATUS_REASON = 'Reviewed 2026-06-23 the live official Nebraska office ExperienceBuilder stack more tightly. The public app config is open, but it still resolves only to two public layers: the office feature layer and the county-boundary layer. The office layer exposes office contact fields such as address, phone, hours, and USER_County, but it has no relationships or related tables, and a bounded distinct-value query still returns only 37 distinct USER_County values across 42 public office rows while Nebraska has 93 counties. The county layer exposes only county geometry and identifiers and also has no relationships. Nebraska therefore still lacks a service-area or county-to-office contract for the remaining counties.';
const EVIDENCE = 'Reviewed 2026-06-23 the official Nebraska Public Office Location ExperienceBuilder config and backing feature service directly. The public app data at https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json is open, but the backing service still exposes only two public layers: https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0 for offices and /1 for counties. Layer 0 exposes office fields like USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, and USER_Scanning, but `relationships` is an empty array. A bounded distinct-value query on USER_County still returns only 37 distinct office counties across 42 public office rows. Layer 1 exposes only county boundary identifiers like NAME, COUNTYFP, GEOID, and NAMELSAD, and its `relationships` array is also empty. So the public Nebraska office stack has no hidden service-area relationship table and does not even carry explicit office-county rows for all 93 counties.';
const NEXT_ACTION = 'hold_blocked_until_official_service_area_or_county_assignment_contract_exists';

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
    '# Nebraska California-Grade Truth Refresh v2',
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
    '## Completion decision',
    '',
    '- Nebraska remains BLOCKED and index_safe=false.',
    '- district_or_county_education_routing is still verified_county_grade through the live official NDE county-selectable directory host.',
    '- county_local_disability_resources remains blocked because the public office app still exposes only 37 distinct office counties across 42 office rows, with no service-area relationships to bridge the remaining counties.',
  ].join('\n') + '\n';
}

export function generateBatch233NebraskaOfficeCountyCoverageRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_public_office_layers_without_service_area_relationships', status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed 2026-06-23 the official Nebraska ExperienceBuilder app data, office feature layer, county layer, bounded public count checks, and a distinct USER_County coverage query.',
          samples: [
            {
              sample_name: 'Nebraska office app config',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_experiencebuilder_config',
              source_table: 'batch233_nebraska_office_county_coverage_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public app config is open and points to the office feature layer plus the county boundary layer, but no extra service-area table is exposed.',
            },
            {
              sample_name: 'Nebraska office feature layer distinct county coverage',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              verification_status: 'blocked',
              source_type: 'official_office_feature_layer_distinct_counties',
              source_table: 'batch233_nebraska_office_county_coverage_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded distinct-value query on USER_County still returns only 37 distinct office counties across 42 public office rows.',
            },
            {
              sample_name: 'Nebraska county boundary layer',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_county_boundary_layer_without_relationships',
              source_table: 'batch233_nebraska_office_county_coverage_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The county layer still exposes only county geometry identifiers and no related tables or county-to-office assignment fields.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...(packet.current_problem_metrics || {}),
      publicOfficeCount: 42,
      distinctOfficeCounties: 37,
      publicCountyCount: 93,
    },
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    batch: 'batch233_nebraska_office_county_coverage_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'nebraska',
    classification: 'BLOCKED',
    index_safe: false,
    refined_family: 'county_local_disability_resources',
    public_office_rows: 42,
    distinct_office_counties: 37,
    public_county_rows: 93,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 233 Nebraska Office County Coverage Refresh Report v1',
    '',
    '- state: nebraska',
    '- refined_family: county_local_disability_resources',
    '- classification: BLOCKED',
    '- index_safe: false',
    '',
    '## What changed',
    '',
    '- Preserved the stronger office-layer coverage fact: the live official layer still exposes only 37 distinct `USER_County` values across 42 public office rows.',
    '- Kept the county-local blocker because the county boundary layer still has no relationships or assignment fields to bridge the remaining counties.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch233NebraskaOfficeCountyCoverageRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
