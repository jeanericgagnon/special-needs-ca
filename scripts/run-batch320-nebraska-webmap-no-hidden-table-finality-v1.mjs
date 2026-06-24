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
  failures: path.join(generatedDir, 'nebraska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nebraska_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'nebraska_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch320_nebraska_webmap_no_hidden_table_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch320-nebraska-webmap-no-hidden-table-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'recovered_public_office_stack_still_has_no_hidden_table_assignment_bridge_and_only_42_offices_for_93_counties';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const NEXT_ACTION =
  'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published';
const FAMILY_STATUS =
  'blocked_republished_public_office_stack_without_hidden_assignment_bridge';
const STATUS_REASON =
  'Reviewed 2026-06-24 one more bounded official Nebraska county-local pass and confirmed the refreshed public ArcGIS stack still has no hidden county-assignment bridge. The ExperienceBuilder app is fresh, but its web map still carries only two operational layers and zero tables; the only widget output is a closest-feature office layer that mirrors the same office contact schema; the public FeatureServer still has 42 office rows versus 93 county rows; both layers still expose empty relationships; and the distinct office-county query still returns only 37 county values. Nebraska therefore still lacks a public statewide county-to-office assignment contract.';
const EVIDENCE =
  'Reviewed 2026-06-24 one more bounded official Nebraska county-local pass across the live DHHS and ArcGIS publication stack. `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is still only the SharePoint wrapper for the locator, not a county directory leaf. The refreshed ExperienceBuilder item data at `https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json` still exposes only one web map data source (`4bdbf8e8703743b0b2ff290f98737825`), one closest-feature office output, and one geocoder output. The underlying public web map data at `https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json` still carries exactly two operational layers (`FeatureServer/0` offices and `FeatureServer/1` counties) and zero tables. The closest-feature output schema in the app still mirrors the office layer fields (`USER_Address_1`, `USER_City`, `USER_County`, phones, hours) rather than any county-assignment table. The public FeatureServer still reports 42 office rows against 93 county rows, both layers still expose `relationships: []`, and the distinct office-county query still returns only 37 county values. Nebraska therefore still has no hidden table, related record, or published county-assignment bridge anywhere on the current public stack.';

const LESSON_HEADING = '### Closest-Feature Widget Outputs Do Not Create A County Contract';
const LESSON_BODY =
  '*   **Lesson:** If a public ArcGIS ExperienceBuilder app only adds a geocoder output and a closest-feature output whose schema simply mirrors the office layer, that is not a hidden county-assignment bridge. Nebraska’s refreshed app still resolved only to the same office contact fields and a two-layer web map with zero tables, so the county-local blocker stayed final.';

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

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
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
    '- district_or_county_education_routing remains verified_county_grade through the official county-selectable NDE directory host.',
    '- county_local_disability_resources remains the only critical blocker.',
    '- The refreshed ArcGIS app still exposes only a two-layer web map, no tables, and a closest-feature office output that mirrors the same contact-card schema.',
    '- The official public stack still stops at 42 office rows, 93 county rows, empty relationships, and only 37 distinct office counties.',
    '- Nebraska therefore still lacks a public statewide county-to-office assignment contract.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  current = current
    .split('\n')
    .map((line) => (line.startsWith('- Nebraska: `') ? `- Nebraska: \`${PRIMARY_GAP_REASON}\`` : line))
    .join('\n');

  const focusBlock = [
    '## Current Focus State: Nebraska',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. The refreshed official public ArcGIS stack still does not expose a statewide county-assignment contract. The ExperienceBuilder app is live again, but its item data still points to only one web map, one closest-feature office output, and one geocoder output. The underlying public web map still has exactly two operational layers and zero tables, the closest-feature output still mirrors the same office contact fields, the public FeatureServer still has 42 office rows against 93 county rows, both layers still have empty relationships, and the distinct office-county query still returns only 37 county values. Nebraska therefore remains BLOCKED and not index-safe because there is still no public statewide county-to-office assignment bridge anywhere on the current official stack.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Nebraska DHHS county-to-office assignment table, export, or service-area artifact that maps all 93 counties to public assistance offices.',
    '- Any public ArcGIS table, related layer, popup expression, output schema, or resource file on the current office stack that explicitly enumerates served counties, assigned counties, or coverage areas for each office.',
    '- Any exact first-party DHHS county office page or county directory leaf that publishes county coverage instead of only contact-card inventory.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Nebraska DHHS Public Assistance Offices](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)',
    '- [ExperienceBuilder item data](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json)',
    '- [ExperienceBuilder resource list](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json)',
    '- [Nebraska public office FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)',
    '- [Nebraska public office layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson)',
    '- [Nebraska county boundary layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson)',
    '- [Nebraska public web map item data](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json)',
    '- [Nebraska office count query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&returnCountOnly=true&f=json)',
    '- [Nebraska county count query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1/query?where=1%3D1&returnCountOnly=true&f=json)',
    '- [Nebraska distinct county query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official Nebraska DHHS county assignment export or service-area table attached to the existing office stack.',
    '- Any new public ArcGIS resource, web map table, or output field that explicitly carries county assignment data rather than only office contact fields.',
    '- An exact first-party county office page or county directory leaf on `dhhs.ne.gov` that publishes county coverage instead of only contact cards.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[\s\S]*$/,
    [
      '## Next State Order After Nebraska',
      '',
      '1. Florida',
      '2. Alaska',
      '3. New York',
      '4. Oklahoma',
      '5. Oregon',
      '6. Ohio',
      '7. Minnesota',
      '8. Maine',
      '9. Idaho',
      '10. Arizona',
      '',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const oldNote = '- Nebraska remains blocked because even a freshly republished public ArcGIS office experience still only rewraps the same 42-office / 93-county stack with empty relationships and 37 distinct office counties, not a statewide county-assignment contract.';
  const newNote = '- Nebraska remains blocked because the refreshed official ArcGIS stack still has only a two-layer web map, zero tables, and a closest-feature office output that mirrors the same 42-office / 93-county mismatch rather than exposing any county-assignment bridge.';
  if (current.includes(oldNote)) current = current.replace(oldNote, newNote);
  if (!current.includes(newNote)) current = `${current.trimEnd()}\n${newNote}\n`;
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 320 Nebraska Web Map No Hidden Table Finality Report v1',
    '',
    '- state: Nebraska',
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the public DHHS offices page is still only a wrapper for the locator, not a county directory leaf.',
    '- Confirmed the refreshed ExperienceBuilder app still exposes only one web map data source, one closest-feature office output, and one geocoder output.',
    '- Confirmed the underlying public web map still contains exactly two operational layers and zero tables.',
    '- Confirmed the closest-feature output schema simply mirrors the office contact fields rather than exposing any county-assignment table.',
    '- Confirmed the public FeatureServer still stops at 42 office rows, 93 county rows, empty relationships, and only 37 distinct office counties.',
    '',
    '## Why Nebraska remains blocked',
    '',
    '- There is still no public table, related layer, popup bridge, or output schema that maps all 93 counties to offices.',
    '- The refreshed public stack still stops at contact-card inventory plus closest-office behavior, not a statewide county contract.',
    '- Nebraska therefore still has no public statewide county-to-office assignment bridge.',
    '',
    '## Next action',
    '',
    `- ${batchSummary.next_action}`,
    '',
  ].join('\n') + '\n';
}

export function generateBatch320NebraskaWebMapNoHiddenTableFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch320_nebraska_webmap_no_hidden_table_finality_v1',
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'county_local_disability_resources'
        ? { ...blocker, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : blocker
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: FAMILY_STATUS,
    },
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

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          blocker_code: FAILURE_CODE,
          blocker_evidence: 'The refreshed public Nebraska office stack still has only a two-layer web map, zero tables, and the same 42-office / 93-county mismatch with no hidden assignment bridge.',
          query_basis: 'Reviewed the live DHHS page wrapper, refreshed ExperienceBuilder config, web map item data, closest-feature output schema, FeatureServer layer schemas, and office/county count queries.',
          sample_count: 7,
          samples: [
            {
              sample_name: 'Nebraska DHHS Public Assistance Offices wrapper',
              source_url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
              final_url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
              verification_status: 'blocked',
              source_type: 'official_locator_wrapper_without_county_directory',
              source_table: 'batch320_nebraska_webmap_no_hidden_table_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The official DHHS page is still just the SharePoint wrapper for the locator and does not itself enumerate county-to-office assignments.',
            },
            {
              sample_name: 'Nebraska refreshed ExperienceBuilder item data',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_republished_experiencebuilder_config',
              source_table: 'batch320_nebraska_webmap_no_hidden_table_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The refreshed app still exposes only one web map data source, one closest-feature office output, and one geocoder output.',
            },
            {
              sample_name: 'Nebraska public web map has no tables',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_web_map_without_hidden_assignment_table',
              source_table: 'batch320_nebraska_webmap_no_hidden_table_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The underlying public web map still contains exactly two operational layers (`FeatureServer/0` offices and `FeatureServer/1` counties) and zero tables.',
            },
            {
              sample_name: 'Nebraska closest-feature output mirrors office schema',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_widget_output_without_assignment_fields',
              source_table: 'batch320_nebraska_webmap_no_hidden_table_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The closest-feature output schema simply mirrors office fields like `USER_Address_1`, `USER_City`, `USER_County`, phones, and hours rather than exposing any county-assignment table.',
            },
            {
              sample_name: 'Nebraska office layer row count remains partial',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&returnCountOnly=true&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&returnCountOnly=true&f=json',
              verification_status: 'blocked',
              source_type: 'official_office_count_without_statewide_assignment',
              source_table: 'batch320_nebraska_webmap_no_hidden_table_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The public office layer still returns only 42 office rows.',
            },
            {
              sample_name: 'Nebraska county boundary count remains 93',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1/query?where=1%3D1&returnCountOnly=true&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1/query?where=1%3D1&returnCountOnly=true&f=json',
              verification_status: 'blocked',
              source_type: 'official_county_boundary_count',
              source_table: 'batch320_nebraska_webmap_no_hidden_table_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The county boundary layer still returns 93 counties, proving the public stack still lacks a 93-county assignment bridge.',
            },
            {
              sample_name: 'Nebraska distinct office counties remain partial',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              verification_status: 'blocked',
              source_type: 'official_distinct_county_query_without_statewide_assignment',
              source_table: 'batch320_nebraska_webmap_no_hidden_table_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The distinct office-county query still returns only 37 county values, not a statewide assignment contract.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: 'The refreshed public Nebraska office stack still has only a two-layer web map, zero tables, a closest-feature output that mirrors the same office schema, 42 offices, 93 county boundaries, empty relationships, and only 37 distinct office counties.', next_action: NEXT_ACTION }
      : row
  ));

  const updatedQueueRows = allStateQueue.map((row) => (
    row.state === 'nebraska'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    generatedAt: '2026-06-24T00:00:00.000Z',
    lessonsUpdate: 'Added a new blocker lesson: closest-feature widget outputs still do not create a county contract.',
    states: (allStateAudit.states || []).map((row) => (
      row.stateId === 'nebraska'
        ? {
            ...row,
            packetBatch: 'batch320_nebraska_webmap_no_hidden_table_finality_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            familyStatuses: {
              ...(row.familyStatuses || {}),
              county_local_disability_resources: FAMILY_STATUS,
            },
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.allStateQueue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  updateAllStateReport();
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    batch: 'batch320_nebraska_webmap_no_hidden_table_finality_v1',
    generated_at: '2026-06-24T00:00:00.000Z',
    state: 'nebraska',
    classification: updatedSummary.classification,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    next_action: NEXT_ACTION,
    office_count: 42,
    county_count: 93,
    distinct_office_counties: 37,
    webmap_operational_layers: 2,
    webmap_tables: 0,
    closest_feature_output_mirrors_office_schema: true,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch320NebraskaWebMapNoHiddenTableFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
