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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  packet: path.join(generatedDir, 'nebraska_county_local_disability_resources_service_area_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch257_nebraska_office_schema_final_blocker_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch257-nebraska-office-schema-final-blocker-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields';
const FAILURE_CODE = 'official_public_office_service_root_has_no_tables_no_relationships_and_only_37_distinct_counties';
const NEXT_ACTION = 'hold_blocked_until_official_service_area_table_or_county_assignment_artifact_exists';
const STATUS_REASON = 'Reviewed 2026-06-23 the live official Nebraska office ExperienceBuilder stack to the schema level. The public app config still resolves only to the same office and county layers, the FeatureServer root reports `tables: []`, both public layers have empty relationship arrays, and the office schema contains only address/contact fields such as USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, USER_Scanning, and USER_Phone. There are still only 42 office rows and 37 distinct USER_County values for 93 counties, with no service-area, assigned-counties, region, or coverage fields. Nebraska therefore still lacks any public county-to-office assignment contract.';
const EVIDENCE = 'Reviewed 2026-06-23 the official Nebraska Public Office Location ExperienceBuilder config, FeatureServer root, office layer schema, and bounded office-row sample directly. The public app data at https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json is open and still exposes only three data sources: the shared web map plus two derived feature layers. The service root at https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson reports exactly two layers, `tables: []`, and no extra public assignment table. Layer 0 still exposes only office contact fields like USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, USER_Scanning, and USER_Phone; it has no service-area or coverage fields, no multi-county USER_County values, and only 37 distinct counties across 42 office rows. Layer 1 remains only county geometry and identifier fields. So the official Nebraska county-local office stack is now final-blocked on missing public county-assignment data, not on an unresolved ArcGIS-discovery question.';

const LESSON_HEADING = '### A Public FeatureServer With Tables Empty And Contact-Only Schema Is A Final Local-Office Blocker';
const LESSON_BODY = '*   **Lesson:** If the public ArcGIS service root reports `tables: []` and the office layer schema contains only contact fields plus one county field, stop hunting for a hidden county-assignment join. Nebraska’s DHHS office stack was fully inspectable and still had no service-area fields, no related tables, and only 37 distinct counties across 42 office rows.';

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
    '- district_or_county_education_routing is still verified_county_grade through the live official NDE county-selectable directory host.',
    '- county_local_disability_resources is now final-blocked more tightly: the public FeatureServer root exposes no tables, both layers have empty relationships, and the office schema has no service-area or coverage fields to bridge the missing counties.',
  ].join('\n') + '\n';
}

export function generateBatch257NebraskaOfficeSchemaFinalBlockerV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const packet = readJson(INPUTS.packet);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_public_office_service_root_without_assignment_contract', status_reason: STATUS_REASON }
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
          family_status: 'blocked_public_office_service_root_without_assignment_contract',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed 2026-06-23 the official Nebraska ExperienceBuilder app data, FeatureServer root, office layer schema, distinct county coverage query, and bounded office-row samples.',
          sample_count: 4,
          samples: [
            {
              sample_name: 'Nebraska office app config',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_experiencebuilder_config',
              source_table: 'batch257_nebraska_office_schema_final_blocker',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public app config is open and still exposes only the shared web map plus two derived feature layers.',
            },
            {
              sample_name: 'Nebraska FeatureServer root',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_feature_service_root_without_tables',
              source_table: 'batch257_nebraska_office_schema_final_blocker',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public FeatureServer root reports exactly two layers and `tables: []`, so there is no public related table to recover.',
            },
            {
              sample_name: 'Nebraska office feature layer schema',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_office_feature_layer_contact_only_schema',
              source_table: 'batch257_nebraska_office_schema_final_blocker',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The office layer schema contains only contact and office fields like USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, USER_Scanning, and USER_Phone, with no service-area or coverage fields.',
            },
            {
              sample_name: 'Nebraska office feature layer distinct county coverage',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              verification_status: 'blocked',
              source_type: 'official_office_feature_layer_distinct_counties',
              source_table: 'batch257_nebraska_office_schema_final_blocker',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded distinct-value query still returns only 37 distinct USER_County values across 42 office rows, and none of those values are multi-county coverage strings.',
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
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'nebraska'
      ? { ...row, status: updatedSummary.classification, classification: updatedSummary.classification, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...(packet.current_problem_metrics || {}),
      serviceRootTablesPresent: false,
      officeLayerRelationshipsPresent: false,
      countyLayerRelationshipsPresent: false,
      officeLayerHasServiceAreaFields: false,
      officeLayerHasMultiCountyValues: false,
      publicOfficeCount: 42,
      publicCountyCount: 93,
      distinctOfficeCounties: 37,
    },
    packet_complete_when: 'Nebraska can reopen county-local only when an official service-area table, county-assignment artifact, or office schema with county-coverage fields exists on the public stack.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch257_nebraska_office_schema_final_blocker_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'nebraska',
    classification: 'BLOCKED',
    index_safe: false,
    service_root_tables_present: false,
    office_schema_has_service_area_fields: false,
    office_layer_has_multi_county_values: false,
    distinct_office_counties: 37,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.summary, batchSummary);

  const batchReport = [
    '# Batch 257 Nebraska Office Schema Final Blocker Report v1',
    '',
    '- state: Nebraska',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: county_local_disability_resources',
    `- failure_code: ${FAILURE_CODE}`,
    '',
    '## Outcome',
    '',
    '- Confirmed the public FeatureServer root exposes no tables.',
    '- Confirmed the office schema is contact-only and contains no service-area or county-coverage fields.',
    '- Confirmed USER_County values are single-county office rows only, not implicit service-area strings.',
    '- Nebraska remains final-blocked on missing public county-assignment data.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch257NebraskaOfficeSchemaFinalBlockerV1();
  console.log(JSON.stringify(result, null, 2));
}
