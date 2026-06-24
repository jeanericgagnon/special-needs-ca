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
  summary: path.join(generatedDir, 'batch327_nebraska_config_resource_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch327-nebraska-config-resource-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'public_nebraska_office_config_still_only_references_one_web_map_and_a_closest_feature_output_while_the_feature_service_stops_at_42_offices_for_93_counties';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const NEXT_ACTION =
  'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published';
const FAMILY_STATUS =
  'blocked_public_config_confirms_no_county_assignment_datasource';
const STATUS_REASON =
  'Reviewed 2026-06-24 one more bounded official Nebraska county-local pass and confirmed the public app configuration itself still exposes no county-assignment data source. The public ExperienceBuilder `config/config.json` still references only one web map item and one `closest feature` output layer, while the web map still has two operational layers and zero tables. The public FeatureServer still stops at 42 offices, 93 county boundaries, empty relationships, and only 37 distinct office counties. Nebraska therefore still lacks a public statewide county-to-office assignment contract.';
const EVIDENCE =
  'Reviewed 2026-06-24 one more bounded official Nebraska county-local pass across the live DHHS and ArcGIS publication stack, including the public ExperienceBuilder resource config. `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is still only the SharePoint wrapper for the locator, not a county directory leaf. The public resource list for item `76a6ec0ec7c449448c95d00f59002457` exposes `config/config.json`, and that config still references only one web map item (`4bdbf8e8703743b0b2ff290f98737825`) plus one `closest feature` output layer (`widget_382_output_closest_000433549029275504`) and the geocoder search widget. No additional table datasource, county-assignment datasource, or service-area output appears anywhere in the public config. The underlying public web map data still carries exactly two operational layers (`FeatureServer/0` offices and `FeatureServer/1` counties) and zero tables. The public FeatureServer still reports 42 office rows against 93 county rows, both layers still expose `relationships: []`, and the distinct office-county query still returns only 37 county values. Nebraska therefore still has no hidden table, output layer, related record, or published county-assignment bridge anywhere on the current public stack.';

const LESSON_HEADING = '### Public ExperienceBuilder Configs Can Prove The Missing Datasource';
const LESSON_BODY =
  '*   **Lesson:** If an official ExperienceBuilder app republishes but still feels ambiguous, read the public `resources/config/config.json` directly. Nebraska’s public config made the blocker more explicit: it referenced only one web map, one `closest feature` output layer, and the geocoder widget, which proved there was still no hidden county-assignment datasource behind the county-local office stack.';

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

function replaceLineByPrefix(text, prefix, replacement) {
  const lines = text.split('\n');
  let replaced = false;
  const next = lines.map((line) => {
    if (!replaced && line.startsWith(prefix)) {
      replaced = true;
      return replacement;
    }
    return line;
  });
  return replaced ? next.join('\n') : `${text.trimEnd()}\n${replacement}\n`;
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
    '- The public ExperienceBuilder resource config now makes the blocker more explicit: the live app still references only one web map plus a closest-feature output and geocoder search, not a county-assignment datasource.',
    '- The official public stack still stops at 42 office rows, 93 county rows, empty relationships, zero tables, and only 37 distinct office counties.',
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
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. The public office stack is live, but the public ExperienceBuilder config now makes the failure mode even clearer: `resources/config/config.json` still references only one web map item, one `closest feature` output layer, and the geocoder search widget. There is still no county-assignment datasource, no service-area table, and no coverage output in the current public app. The underlying public web map still has only two operational layers and zero tables, while the public FeatureServer still stops at 42 office rows, 93 county rows, empty relationships, and only 37 distinct office counties. Nebraska therefore remains BLOCKED and not index-safe because there is still no public statewide county-to-office assignment bridge anywhere on the official stack.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Nebraska DHHS county-to-office assignment table, export, or service-area artifact that maps all 93 counties to public assistance offices.',
    '- Any public ArcGIS table, related layer, popup expression, output schema, or config datasource on the current office stack that explicitly enumerates served counties, assigned counties, or coverage areas for each office.',
    '- Any exact first-party DHHS county office page or county directory leaf that publishes county coverage instead of only contact-card inventory.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Nebraska DHHS Public Assistance Offices](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)',
    '- [ExperienceBuilder item data](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json)',
    '- [ExperienceBuilder resource list](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json)',
    '- [ExperienceBuilder config resource](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json?f=json)',
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
    '- Any new public ArcGIS resource, web map table, config datasource, or output field that explicitly carries county assignment data rather than only office contact fields.',
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
  const note = '- Nebraska remains blocked because the public ExperienceBuilder config itself still references only one web map plus a closest-feature output and geocoder search, while the underlying FeatureServer still exposes no county-assignment bridge beyond the same 42-office / 93-county mismatch.';
  current = replaceLineByPrefix(current, '- Nebraska remains blocked because', note);
  if (!current.includes(note)) {
    current = `${current.trimEnd()}\n${note}\n`;
  }
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 327 Nebraska Config Resource Finality Report v1',
    '',
    '- state: Nebraska',
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the public ExperienceBuilder resource list exposes `config/config.json` on the current official app item.',
    '- Confirmed that public config still references only one web map item, one `closest feature` output layer, and the geocoder search widget.',
    '- Confirmed no additional county-assignment datasource, service-area table, or coverage output appears in the public config.',
    '- Confirmed the underlying public stack still stops at two operational layers, zero tables, 42 office rows, 93 county rows, empty relationships, and 37 distinct office counties.',
    '',
    '## Why Nebraska remains blocked',
    '',
    '- There is still no public county-assignment datasource anywhere on the official stack.',
    '- The public app still resolves only to office contact cards plus closest-office behavior, not a statewide county-to-office contract.',
    '- Nebraska therefore still has no public statewide county-to-office assignment bridge.',
    '',
    '## Next action',
    '',
    `- ${batchSummary.next_action}`,
    '',
  ].join('\n') + '\n';
}

export function generateBatch327NebraskaConfigResourceFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch327_nebraska_config_resource_finality_v1',
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
          blocker_evidence:
            'The public ExperienceBuilder config itself still references only one web map plus a closest-feature output and the geocoder search widget, so there is still no hidden county-assignment datasource behind the current Nebraska office stack.',
          samples: [
            {
              sample_name: 'Nebraska DHHS Public Assistance Offices wrapper',
              source_url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
              final_url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
              verification_status: 'blocked',
              source_type: 'official_locator_wrapper_without_county_directory',
              source_table: 'batch327_nebraska_config_resource_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The official DHHS page is still just the SharePoint wrapper for the locator and does not itself enumerate county-to-office assignments.',
            },
            {
              sample_name: 'Nebraska ExperienceBuilder resource config',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json?f=json',
              verification_status: 'blocked',
              source_type: 'official_public_config_without_assignment_datasource',
              source_table: 'batch327_nebraska_config_resource_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The public config still references only one web map item, one `closest feature` output layer, and the geocoder search widget, with no county-assignment datasource or service-area output.',
            },
            {
              sample_name: 'Nebraska public web map has no tables',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_web_map_without_hidden_assignment_table',
              source_table: 'batch327_nebraska_config_resource_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The underlying public web map still contains exactly two operational layers (`FeatureServer/0` offices and `FeatureServer/1` counties) and zero tables.',
            },
            {
              sample_name: 'Nebraska office layer row count remains partial',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&returnCountOnly=true&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&returnCountOnly=true&f=json',
              verification_status: 'blocked',
              source_type: 'official_office_count_without_statewide_assignment',
              source_table: 'batch327_nebraska_config_resource_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The public office layer still returns only 42 office rows.',
            },
            {
              sample_name: 'Nebraska county boundary count remains 93',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1/query?where=1%3D1&returnCountOnly=true&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1/query?where=1%3D1&returnCountOnly=true&f=json',
              verification_status: 'blocked',
              source_type: 'official_county_boundary_count',
              source_table: 'batch327_nebraska_config_resource_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The county boundary layer still returns 93 counties, proving the public stack still lacks a 93-county assignment bridge.',
            },
            {
              sample_name: 'Nebraska distinct office counties remain partial',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              verification_status: 'blocked',
              source_type: 'official_distinct_county_query_without_statewide_assignment',
              source_table: 'batch327_nebraska_config_resource_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The distinct office-county query still returns only 37 county values, not a statewide assignment contract.',
            },
          ],
          sample_count: 6,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: 'The public config still references only one web map plus a closest-feature output and no county-assignment datasource, while the FeatureServer remains partial at 42 offices / 93 counties / 37 distinct office counties.' }
      : row
  ));

  const updatedAllStateQueue = allStateQueue.map((row) => (
    row.state === 'nebraska'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 92,
          weak_critical_families: 1,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'batch_2_repair_blocked',
          status: 'BLOCKED',
        }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: (allStateAudit.states || []).map((state) => (
      state.stateId === 'nebraska'
        ? {
            ...state,
            classification: 'BLOCKED',
            indexSafe: false,
            completenessPct: 92,
            weakCriticalFamilies: 1,
            packetBatch: 'batch327_nebraska_config_resource_finality_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            familyStatuses: {
              ...(state.familyStatuses || {}),
              county_local_disability_resources: FAMILY_STATUS,
            },
          }
        : state
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  updateAllStateReport();
  appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    state: 'nebraska',
    classification: 'BLOCKED',
    failure_code: FAILURE_CODE,
    remaining_blocker_family: 'county_local_disability_resources',
    webmap_operational_layers: 2,
    webmap_tables: 0,
    config_references_single_webmap: true,
    config_references_closest_feature_only: true,
    office_count: 42,
    county_count: 93,
    distinct_office_counties: 37,
    next_action: NEXT_ACTION,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));

  return {
    classification: updatedSummary.classification,
    primary_gap_reason: updatedSummary.primary_gap_reason,
    next_action: NEXT_ACTION,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch327NebraskaConfigResourceFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
