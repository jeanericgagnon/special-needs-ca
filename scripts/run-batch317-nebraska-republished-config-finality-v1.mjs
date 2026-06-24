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
  summary: path.join(generatedDir, 'batch317_nebraska_republished_config_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch317-nebraska-republished-config-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'freshly_republished_public_office_experience_still_only_wraps_42_offices_37_distinct_counties_and_no_statewide_assignment_contract';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const NEXT_ACTION =
  'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published';
const FAMILY_STATUS =
  'blocked_republished_public_office_experience_still_without_assignment_contract';
const STATUS_REASON =
  'Reviewed 2026-06-24 one more bounded official Nebraska county-local pass and found the public office experience has been freshly republished, but not materially improved for county-grade routing. The ExperienceBuilder item data and `config/config.json` now carry fresh publication timestamps, yet they still bind only the same public office layer, county boundary layer, closest-office widget output, and geocoding utilities. The public FeatureServer still has 42 office rows versus 93 county rows, layer 0 still has no relationships and only contact-style fields plus `USER_County`, layer 1 still has no relationships and only county-boundary fields, and the distinct-county query still returns only 37 county values with no multi-county service-area strings. Nebraska therefore still lacks a public statewide county-to-office assignment contract.';
const EVIDENCE =
  'Reviewed 2026-06-24 one more bounded official Nebraska county-local pass on the live ArcGIS publication surfaces. `https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json` now shows a fresh published config timestamp (`1772143020147`), and the item resource list at `.../resources?f=json` now shows `config/config.json` recreated at `1772143020199`. But that freshly published experience still only wraps the same office lookup page, public office layer, county boundary layer, closest-office widget output, and geocoding utilities. The public FeatureServer root still reports `supportedExportFormats: sqlite,filegdb,shapefile,csv,geojson`; layer 0 still returns `relationships: []`; layer 1 still returns `relationships: []`; the office count query still returns `42`; the county boundary count query still returns `93`; and the distinct county query on `USER_County` still returns only 37 county values. The item info endpoint still returns `Info file for item not found`, and the resource list still contains only `config/config.json` plus image assets. Nebraska therefore still has a freshly republished public office experience but no public statewide county-to-office assignment contract.';

const LESSON_HEADING = '### Freshly Republished ArcGIS Experiences Can Still Preserve The Same Final Blocker';
const LESSON_BODY =
  '*   **Lesson:** A fresh publication timestamp on an official ArcGIS ExperienceBuilder item does not by itself reopen a blocked local-office lane. Nebraska republished `config/config.json`, but the refreshed experience still wrapped the same 42-office / 93-county mismatch, the same empty layer relationships, and the same 37-county distinct office coverage, so the county-assignment blocker remained final.';

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
    '- The public ArcGIS office experience has been freshly republished, but it still republishes the same office and county layers without any county-assignment bridge.',
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
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. The official public office ArcGIS experience has been freshly republished, but it still does not expose a statewide county-assignment contract. The ExperienceBuilder item data and `config/config.json` now carry fresh publication timestamps, yet the republished app still wraps only the same public office layer, county boundary layer, closest-office widget output, and geocoding utilities. The public FeatureServer still has 42 office rows against 93 county rows, both layers still have empty relationships, and the distinct office-county query still returns only 37 county values. Nebraska therefore remains BLOCKED and not index-safe because the fresh publication still does not bridge all 93 counties to local offices.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Nebraska DHHS county-to-office assignment table, export, or service-area artifact that maps all 93 counties to public assistance offices.',
    '- Any public ArcGIS layer, related table, resource file, popup expression, or API field on the existing office stack that explicitly enumerates served counties, assigned counties, regions, or coverage areas for each office.',
    '- Any exact first-party DHHS county office page or county directory leaf that publishes county coverage instead of only contact-card inventory.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Nebraska DHHS Public Assistance Offices](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)',
    '- [ExperienceBuilder item data](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json)',
    '- [ExperienceBuilder resource list](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json)',
    '- [ExperienceBuilder iteminfo endpoint](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/info/iteminfo?f=json)',
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
    '- Any new public ArcGIS resource or export field that explicitly carries county assignment or service-area data rather than only office contact fields.',
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
  const oldNote = '- Nebraska remains blocked because the public ArcGIS office service is exportable, but its schema and distinct county values still do not expose a statewide county-assignment contract.';
  const newNote = '- Nebraska remains blocked because even a freshly republished public ArcGIS office experience still only rewraps the same 42-office / 93-county stack with empty relationships and 37 distinct office counties, not a statewide county-assignment contract.';
  if (current.includes(oldNote)) current = current.replace(oldNote, newNote);
  if (!current.includes(newNote)) current = `${current.trimEnd()}\n${newNote}\n`;
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 317 Nebraska Republished Config Finality Report v1',
    '',
    '- state: Nebraska',
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the official public office FeatureServer still exposes 42 office rows against 93 county rows.',
    '- Confirmed both public layers still expose empty relationships.',
    '- Confirmed the distinct office-county query still returns only 37 county values.',
    '- Confirmed the public ExperienceBuilder item and `config/config.json` now carry fresh publication timestamps.',
    '- Confirmed the refreshed experience still contains only `config/config.json` plus image assets and no county-assignment artifact.',
    '',
    '## Why Nebraska remains blocked',
    '',
    '- The fresh publication did not add any service-area field, related table, assignment bridge, or county-coverage artifact.',
    '- The public stack still stops at office contact inventory, county boundaries, and a closest-office/geocoding wrapper.',
    '- Nebraska therefore still has no public statewide county-to-office assignment contract.',
    '',
    '## Next action',
    '',
    `- ${batchSummary.next_action}`,
    '',
  ].join('\n') + '\n';
}

export function generateBatch317NebraskaRepublishedConfigFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch317_nebraska_republished_config_finality_v1',
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
          blocker_evidence: 'The public Nebraska office experience has been freshly republished, but it still exposes only the same 42-office / 93-county stack with empty relationships and 37 distinct office counties.',
          query_basis: 'Reviewed the refreshed public ExperienceBuilder item data, current config resource timestamp, current FeatureServer layer schemas, office and county counts, and the distinct office-county query.',
          samples: [
            {
              sample_name: 'Nebraska refreshed ExperienceBuilder item data',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_republished_experiencebuilder_config',
              source_table: 'batch317_nebraska_republished_config_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The item data now carries a fresh config timestamp (`1772143020147`), but the republished experience still wraps only the same office lookup page, office layer, county boundary layer, closest-office widget output, and geocoding utilities.'
            },
            {
              sample_name: 'Nebraska refreshed config resource timestamp',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json',
              verification_status: 'blocked',
              source_type: 'official_resource_list_without_assignment_artifact',
              source_table: 'batch317_nebraska_republished_config_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The resource list shows `config/config.json` recreated at `1772143020199`, but still contains only that config file plus image assets.'
            },
            {
              sample_name: 'Nebraska office layer row count remains partial',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&returnCountOnly=true&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&returnCountOnly=true&f=json',
              verification_status: 'blocked',
              source_type: 'official_office_count_without_statewide_assignment',
              source_table: 'batch317_nebraska_republished_config_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The public office layer still returns only 42 office rows.'
            },
            {
              sample_name: 'Nebraska county boundary count remains 93',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1/query?where=1%3D1&returnCountOnly=true&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1/query?where=1%3D1&returnCountOnly=true&f=json',
              verification_status: 'blocked',
              source_type: 'official_county_boundary_count',
              source_table: 'batch317_nebraska_republished_config_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The county boundary layer still returns 93 counties, proving the public stack still lacks a 93-county assignment bridge.'
            },
            {
              sample_name: 'Nebraska distinct office counties remain partial',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              verification_status: 'blocked',
              source_type: 'official_distinct_county_query_without_statewide_assignment',
              source_table: 'batch317_nebraska_republished_config_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The distinct office-county query still returns only 37 county values, not a statewide assignment contract.'
            },
          ],
          sample_count: 5,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: 'The public Nebraska office experience has been freshly republished, but it still exposes only the same 42 offices, 93 county boundaries, empty relationships, and 37 distinct office counties.' }
      : row
  ));

  const updatedAllStateQueue = allStateQueue.map((row) => (
    row.state === 'nebraska'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'nebraska'
        ? {
            ...row,
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: FAMILY_STATUS,
            },
            packetBatch: 'batch317_nebraska_republished_config_finality_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  updateHandoff();
  updateAllStateReport();
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    state: 'nebraska',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    item_data_timestamp: 1772143020147,
    config_resource_created: 1772143020199,
    office_count: 42,
    county_count: 93,
    distinct_office_counties: 37,
    office_layer_relationships_empty: true,
    county_layer_relationships_empty: true,
    next_action: NEXT_ACTION,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch317NebraskaRepublishedConfigFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
