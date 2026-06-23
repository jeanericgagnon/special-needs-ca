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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch223_nebraska_office_relationship_audit_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch223-nebraska-office-relationship-audit-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'official_public_office_app_has_only_two_public_layers_and_no_service_area_relationships';
const STATUS_REASON = 'Reviewed 2026-06-23 the live official Nebraska office ExperienceBuilder stack more tightly. The public app config is open, but it still resolves only to two public layers: the office feature layer and the county-boundary layer. The office layer exposes office contact fields such as address, phone, hours, and USER_County, but it has no relationships or related tables. The county layer exposes only county geometry and identifiers and also has no relationships. The public counts remain 42 office rows and 93 county rows, so Nebraska still lacks a service-area or county-to-office contract for the missing counties.';
const EVIDENCE = 'Reviewed 2026-06-23 the official Nebraska Public Office Location ExperienceBuilder config and backing feature service directly. The public app data at https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json is open, but the backing service still exposes only two public layers: https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0 for offices and /1 for counties. Layer 0 exposes office fields like USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, and USER_Scanning, but `relationships` is an empty array. Layer 1 exposes only county boundary identifiers like NAME, COUNTYFP, GEOID, and NAMELSAD, and its `relationships` array is also empty. A bounded count check still returns 42 office rows and 93 county rows. So the public Nebraska office stack has no hidden service-area relationship table to bridge all counties back to offices.';
const NEXT_ACTION = 'hold_blocked_until_official_service_area_or_county_assignment_contract_exists';

const LESSON_HEADING = '### No Relationships Means No Hidden Service-Area Bridge';
const LESSON_BODY = '*   **Lesson:** If an official ArcGIS office app looks promising, inspect the public layer `relationships` before assuming a hidden county-assignment table exists. Nebraska’s office layer and county layer were both public, but both had empty relationship arrays, so there was no latent service-area bridge to recover in low-token mode.';

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
    '- district_or_county_education_routing still lacks a county-to-ESU or county-to-district contract on the live NDE host.',
    '- county_local_disability_resources is now sharper: the public office app exposes only the office layer and county boundary layer, and neither layer has relationships or related tables that could supply a hidden service-area contract.',
  ].join('\n') + '\n';
}

export function generateBatch223NebraskaOfficeRelationshipAuditV1() {
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
          family_status: 'blocked_public_office_layers_without_service_area_relationships',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed 2026-06-23 the official Nebraska ExperienceBuilder app data, office feature layer, county layer, and bounded public count checks.',
          sample_count: 3,
          samples: [
            {
              sample_name: 'Nebraska office app config',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_experiencebuilder_config',
              source_table: 'batch223_nebraska_office_relationship_audit',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public app config is open and points to the office feature layer plus the county boundary layer, but no extra service-area table is exposed.',
            },
            {
              sample_name: 'Nebraska office feature layer',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_office_feature_layer_without_relationships',
              source_table: 'batch223_nebraska_office_relationship_audit',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The office layer exposes address, city, county, phone, toll-free line, hours, and scanning fields, but `relationships` is empty and the public count is only 42 offices.',
            },
            {
              sample_name: 'Nebraska county boundary layer',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_county_boundary_layer_without_relationships',
              source_table: 'batch223_nebraska_office_relationship_audit',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The county layer exposes NAME, COUNTYFP, GEOID, and NAMELSAD only, with no related tables or county-to-office assignment fields, even though it contains all 93 counties.',
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
      officeLayerRelationshipsPresent: false,
      countyLayerRelationshipsPresent: false,
      publicOfficeCount: 42,
      publicCountyCount: 93,
    },
    packet_complete_when: 'Nebraska can reopen county-local only when an official service-area or county-to-office assignment contract exists, not just a public office layer and county boundary layer with empty relationship arrays.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch223_nebraska_office_relationship_audit_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'nebraska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    office_layer_relationships_present: false,
    county_layer_relationships_present: false,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 223 Nebraska Office Relationship Audit Report v1',
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
    '- Kept Nebraska BLOCKED.',
    '- Confirmed the public office app is not hiding a service-area relationship table.',
    '- Recorded that both public layers have empty relationship arrays, so later passes can stop rechecking for a latent county-assignment join.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch223NebraskaOfficeRelationshipAuditV1();
  console.log(JSON.stringify(result, null, 2));
}
