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
  summary: path.join(generatedDir, 'batch336_nebraska_geocoder_output_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch336-nebraska-geocoder-output-finality-report-v1.md'),
};

const BATCH = 'batch336_nebraska_geocoder_output_finality_v1';
const PRIMARY_GAP_REASON =
  'public_nebraska_office_config_still_only_references_one_web_map_a_closest_feature_output_and_a_geocoder_county_result_but_no_official_county_assignment_datasource';
const NEXT_ACTION =
  'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published';
const FAMILY_STATUS =
  'blocked_public_config_only_exposes_closest_office_and_geocoder_county_outputs_without_assignment_contract';
const LESSON_HEADING = '### Geocoder County Fields Do Not Equal Office Service Areas';
const LESSON_BODY =
  '*   **Lesson:** If a public ArcGIS app exposes a geocoder output with a `County` field, treat that as user-location metadata unless the same app also publishes an explicit office-assignment datasource. Nebraska’s DHHS office app exposes a geocoder result layer and a closest-office output, but still no county-to-office service-area contract, so the county-local family remains blocked.';
const STATUS_REASON =
  'Reviewed 2026-06-24 one more bounded official Nebraska county-local pass and confirmed the public app config still exposes no office service-area datasource. The ExperienceBuilder item data now proves the only configured datasources are the web map itself, the `closest feature` office output, and a separate geocoder-result output that includes a `County` field. That `County` field belongs only to the geocoded user-location result, not to an official office-assignment contract. The same-host DHHS sibling leaves still only loop `Local DHHS Offices` back to `Public-Assistance-Offices.aspx`, and the public FeatureServer still stops at 42 offices, 93 county boundaries, empty relationships, and only 37 distinct office counties. Nebraska therefore still lacks a public statewide county-to-office assignment contract.';
const EVIDENCE =
  'Reviewed 2026-06-24 one more bounded official Nebraska county-local pass across the live DHHS and ArcGIS publication stack, then inspected the live ExperienceBuilder item-data datasources directly. `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is still only the SharePoint wrapper for the locator, not a county directory leaf. The public resource list for item `76a6ec0ec7c449448c95d00f59002457` still exposes only config and image assets, with no CSV, table, or service-area attachment. The live ExperienceBuilder item data now proves the only configured datasources are `dataSource_3` (the public web map item `4bdbf8e8703743b0b2ff290f98737825`), `widget_382_output_closest_000433549029275504` (the closest-office feature-layer output), and `widget_383_output_config_0` (a geocoder result layer labeled `Nebraska from ArcGIS World Geocoding Service`). That geocoder output includes a `County` field, but it is only user-location metadata from the geocode result, not an official office service-area datasource. No additional table datasource, county-assignment datasource, or service-area output appears anywhere in the live item data. The underlying public web map still carries only the office and county boundary layers with zero tables, and the public FeatureServer still reports 42 office rows against 93 county rows with empty relationships and only 37 distinct office counties. One fresh bounded same-host pass also confirmed that `https://dhhs.ne.gov/Pages/economic-assistance.aspx`, `https://dhhs.ne.gov/Pages/Contact-DHHS.aspx`, and `https://dhhs.ne.gov/Pages/DD-Contact-Us.aspx` do not open a county-local office contract: each page only preserves a `Local DHHS Offices` link back to `Public-Assistance-Offices.aspx`, while the only alternate locality leaf exposed in the same nav is `Local Health Departments`, which is the wrong role for this family. Nebraska therefore still has no hidden table, output layer, related record, or published same-host county assignment bridge anywhere on the current official stack.';

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

function appendLessonIfMissing() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
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
    '- The live item data now proves the only non-web-map datasources are a closest-office output and a geocoder-result output with a `County` field.',
    '- That geocoder `County` field is only user-location metadata and still does not create an official office-assignment contract.',
    '- The exact same-host DHHS sibling leaves still only loop `Local DHHS Offices` back to the same Public Assistance Offices wrapper, not a county directory leaf.',
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
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. The public office stack is live, but the live ExperienceBuilder item data now proves the only configured datasources are the web map itself, a `closest feature` office output, and a separate geocoder-result output labeled `Nebraska from ArcGIS World Geocoding Service`. That geocoder output includes a `County` field, but it belongs only to user-location metadata from the geocode result, not to an official office service-area assignment. The public resource list still exposes only config and image assets, the underlying public web map still has only the office and county boundary layers with zero tables, and the public FeatureServer still stops at 42 office rows, 93 county rows, empty relationships, and only 37 distinct office counties. The same-host DHHS sibling leaves also still preserve `Local DHHS Offices` only as a loop back to `Public-Assistance-Offices.aspx`, not a county directory leaf. Nebraska therefore remains BLOCKED and not index-safe because there is still no public statewide county-to-office assignment bridge anywhere on the official stack.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Nebraska DHHS county-to-office assignment table, export, or service-area artifact that maps all 93 counties to public assistance offices.',
    '- Any public ArcGIS table, related layer, popup expression, output schema, or config datasource on the current office stack that explicitly enumerates served counties, assigned counties, or coverage areas for each office.',
    '- Any exact first-party DHHS county office page or county directory leaf that publishes county coverage instead of only contact-card inventory or a loop back to the current wrapper page.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Nebraska DHHS Public Assistance Offices](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)',
    '- [Nebraska DHHS Economic Assistance](https://dhhs.ne.gov/Pages/economic-assistance.aspx)',
    '- [Nebraska DHHS Contact DHHS](https://dhhs.ne.gov/Pages/Contact-DHHS.aspx)',
    '- [Nebraska DD Contact Us](https://dhhs.ne.gov/Pages/DD-Contact-Us.aspx)',
    '- [ExperienceBuilder resource list](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json)',
    '- [ExperienceBuilder item data](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json)',
    '- [ExperienceBuilder config resource](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json?f=json)',
    '- [Nebraska public web map item data](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json)',
    '- [Nebraska public office FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)',
    '- [Nebraska public office layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson)',
    '- [Nebraska county boundary layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson)',
    '- [Nebraska office count query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&returnCountOnly=true&f=json)',
    '- [Nebraska county count query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1/query?where=1%3D1&returnCountOnly=true&f=json)',
    '- [Nebraska distinct county query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official Nebraska DHHS county assignment export or service-area table attached to the existing office stack.',
    '- Any new public ArcGIS resource, web map table, config datasource, or output field that explicitly carries office service-area data rather than only geocoded user-location county metadata.',
    '- An exact first-party county office page or county directory leaf on `dhhs.ne.gov` that publishes county coverage instead of only wrapper-page loops or wrong-role local health department links.',
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
  const note =
    '- Nebraska remains blocked because the live ExperienceBuilder item data now proves the only extra outputs are a closest-office layer and a geocoder-result layer with a `County` field, but there is still no official county-assignment datasource or county directory leaf on the current DHHS stack.';
  const current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  fs.writeFileSync(INPUTS.allStateReport, replaceLineByPrefix(current, '- Nebraska remains blocked because', note));
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 336 Nebraska Geocoder Output Finality Report v1',
    '',
    '- state: Nebraska',
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the public resource list still exposes only config and image assets, with no table, CSV, or service-area attachment.',
    '- Confirmed the live item data exposes exactly three datasources: the public web map, the closest-office output layer, and a separate geocoder-result output layer.',
    '- Confirmed the geocoder-result output layer includes a `County` field, but it is still only user-location metadata from the geocoding result, not an office-assignment datasource.',
    '- Confirmed the exact same-host DHHS sibling leaves still only loop `Local DHHS Offices` back to `Public-Assistance-Offices.aspx`.',
    '',
    '## Why Nebraska remains blocked',
    '',
    '- There is still no public county-assignment datasource anywhere on the official stack.',
    '- The public app still resolves only to office contact cards, closest-office behavior, and geocoded user-location metadata, not a statewide county-to-office contract.',
    '- The same-host DHHS sibling leaves do not expose a county directory either.',
    '',
    '## Next action',
    '',
    `- ${batchSummary.next_action}`,
    '',
  ].join('\n') + '\n';
}

export function generateBatch336NebraskaGeocoderOutputFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'county_local_disability_resources'
        ? { ...blocker, failure_code: PRIMARY_GAP_REASON, evidence: EVIDENCE, next_action: NEXT_ACTION }
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
      ? { ...row, failure_code: PRIMARY_GAP_REASON, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const samples = (row.samples || []).filter((sample) => sample.sample_name !== 'Nebraska geocoder output includes county metadata only');
    samples.splice(2, 0, {
      sample_name: 'Nebraska geocoder output includes county metadata only',
      source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
      final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
      verification_status: 'blocked',
      source_type: 'official_item_data_geocoder_output_without_service_area_contract',
      source_table: BATCH,
      fetched_at: '2026-06-24T00:00:00.000Z',
      evidence_snippet: 'The live item data exposes `widget_383_output_config_0` labeled `Nebraska from ArcGIS World Geocoding Service`, and that output includes a `County` field that belongs only to the geocoded user-location result, not to an office-assignment datasource.',
    });
    return {
      ...row,
      family_status: FAMILY_STATUS,
      status_reason: STATUS_REASON,
      blocker_code: PRIMARY_GAP_REASON,
      blocker_evidence: 'The live item data now proves the only non-web-map datasources are a closest-office output and a geocoder-result output with a `County` field, but there is still no office service-area datasource or county directory leaf anywhere on the public Nebraska DHHS stack.',
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: PRIMARY_GAP_REASON,
          next_action: NEXT_ACTION,
          evidence: 'The live item data now proves the only extra outputs are a closest-office layer and a geocoder-result layer with a `County` field, while the same-host DHHS sibling leaves still only loop back to the current wrapper.'
        }
      : row
  ));

  const updatedQueueRows = allStateQueue.map((row) => (
    row.state === 'nebraska'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'nebraska'
        ? {
            ...row,
            packetBatch: BATCH,
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
  writeJson(INPUTS.allStateAudit, updatedAudit);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  updateAllStateReport();
  appendLessonIfMissing();

  const batchSummary = {
    state: 'nebraska',
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    resource_count: 9,
    configured_data_sources: ['dataSource_3', 'widget_382_output_closest_000433549029275504', 'widget_383_output_config_0'],
    geocoder_output_has_county_field: true,
    same_host_sibling_loops_confirmed: 3,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: PRIMARY_GAP_REASON,
    next_action: NEXT_ACTION,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch336NebraskaGeocoderOutputFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
