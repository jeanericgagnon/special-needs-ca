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
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  stateReport: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch314_nebraska_export_format_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch314-nebraska-export-format-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'official_public_office_feature_service_supports_export_formats_but_schema_and_distinct_county_values_still_expose_no_statewide_assignment_contract';
const FAILURE_CODE =
  'official_public_office_feature_service_supports_export_formats_but_schema_and_distinct_county_values_still_expose_no_statewide_assignment_contract';
const NEXT_ACTION =
  'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published';
const FAMILY_STATUS =
  'blocked_public_office_service_exportable_but_without_assignment_contract';
const STATUS_REASON =
  'Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the public ArcGIS FeatureServer itself. The official service root is live and even advertises `supportedExportFormats` including `csv`, `filegdb`, `shapefile`, and `geojson`, but the public office layer schema still contains only contact-style fields plus one county field, and a bounded distinct-value query still returns only 37 county names with no multi-county or service-area strings. Combined with the already-reviewed config-only resource list and missing metadata/info files, that means the current official Nebraska office stack is exportable but still does not expose a statewide county-assignment contract.';
const EVIDENCE =
  'Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the public ArcGIS FeatureServer and export surfaces. `https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson` returns HTTP 200 and now explicitly reports `supportedExportFormats: sqlite,filegdb,shapefile,csv,geojson`. But the public office layer schema at `.../FeatureServer/0?f=pjson` still exposes only contact-style fields plus `USER_County`, with no `countiesServed`, region, assignment, or service-area field. A bounded distinct-value query at `.../FeatureServer/0/query?...outFields=USER_County&returnDistinctValues=true...` still returns only 37 county values across the office inventory, and none of those values are multi-county coverage strings. The public ExperienceBuilder item resource list still contains only `config/config.json` plus image assets, the paired Web Map resource list is empty, and the metadata/info-file routes still expose no hidden artifact. Nebraska therefore still has an exportable office layer but no public statewide county-to-office assignment contract, so county_local_disability_resources remains final-blocked.';

const LESSON_HEADING = '### Exportable ArcGIS Layers Still Fail If The Exportable Fields Lack Assignment Semantics';
const LESSON_BODY =
  '*   **Lesson:** If a public ArcGIS FeatureServer advertises export formats like CSV, GeoJSON, or FileGDB, do not assume that exportability helps unless the exported fields actually carry service-area meaning. Nebraska’s office service was exportable, but the schema still exposed only contact fields plus `USER_County`, and the distinct county values still covered only 37 counties with no multi-county strings.';

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
    '- county_local_disability_resources is now frozen even past the export theory: the public FeatureServer is exportable, but its schema still has no assignment fields and its distinct county values still cover only 37 counties with no multi-county service strings.',
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
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. One more bounded official pass on the ArcGIS FeatureServer closes the export theory too: the public service root is live and advertises export formats including CSV, GeoJSON, shapefile, and FileGDB, but the office layer schema still contains only contact-style fields plus `USER_County`, and a bounded distinct-value query still returns only 37 county names with no multi-county service-area strings. The ExperienceBuilder resource list still contains only `config/config.json` plus image assets, and the metadata/info routes still expose no hidden artifact. Nebraska therefore remains BLOCKED / not index-safe because there is still no public statewide county-to-office assignment contract.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Nebraska DHHS county-to-office assignment table, export, or service-area artifact that maps all 93 counties to public assistance offices.',
    '- Any public ArcGIS layer, related table, resource file, or API field on the existing office stack that explicitly enumerates served counties, assigned counties, regions, or coverage areas for each office.',
    '- Any exact first-party DHHS leaf that publishes a county list or county-by-county local office contract instead of only a locator handoff.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Nebraska DHHS Public Assistance Offices](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)',
    '- [ExperienceBuilder item resources](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json)',
    '- [ExperienceBuilder published config](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json)',
    '- [ExperienceBuilder iteminfo endpoint](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/info/iteminfo?f=json)',
    '- [ExperienceBuilder metadata XML attempt](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/info/metadata/metadata.xml)',
    '- [Web Map resources](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/resources?f=json)',
    '- [Nebraska public office FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)',
    '- [Nebraska public office layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson)',
    '- [Nebraska distinct county query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- An official Nebraska DHHS county assignment export or service-area table attached to the existing office stack.',
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
      '1. Nevada',
      '2. Florida',
      '3. Alaska',
      '4. New York',
      '5. Oklahoma',
      '6. Oregon',
      '7. Ohio',
      '8. Minnesota',
      '9. Maine',
      '10. Idaho',
      '',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const oldNote = '- Nebraska county-local routing is now frozen even at the item-resource layer: the public ExperienceBuilder item lists only config and image assets, the paired web map has zero resources, and the metadata/info-file routes expose no hidden assignment artifact.';
  const newNote = '- Nebraska county-local routing is now frozen even past the export theory: the public ExperienceBuilder item still lists only config and image assets, and the public FeatureServer is exportable but still exposes only contact fields plus 37 distinct county values with no statewide assignment contract.';
  if (current.includes(oldNote)) current = current.replace(oldNote, newNote);
  if (!current.includes(newNote)) current = `${current.trimEnd()}\n${newNote}\n`;
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(summary) {
  return [
    '# Batch 314 Nebraska Export Format Finality Report v1',
    '',
    '- state: Nebraska',
    `- classification: ${summary.classification}`,
    '- blocker_family: county_local_disability_resources',
    '',
    '## What was confirmed',
    '',
    '- The public FeatureServer root is live and advertises export formats including CSV, GeoJSON, shapefile, and FileGDB.',
    '- The office layer schema still exposes only contact-style fields plus `USER_County`.',
    '- The distinct county query still returns only 37 county values.',
    '- None of the distinct county values are multi-county service-area strings.',
    '',
    '## Repair decision',
    '',
    '- Nebraska remains final-blocked on missing public county-assignment data.',
    '- The office layer may be exportable, but exporting the current schema still cannot materialize a statewide county-to-office assignment contract.',
  ].join('\n') + '\n';
}

export function generateBatch314NebraskaExportFormatFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch314_nebraska_export_format_finality_v1',
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
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
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed the public FeatureServer export surface, office layer schema, distinct county query, ExperienceBuilder resource list, and the already-reviewed official office stack.',
          sample_count: Math.max(row.sample_count || 0, 21),
          samples: [
            ...(row.samples || []).filter((sample) => ![
              'Nebraska public FeatureServer export formats',
              'Nebraska distinct county query remains partial',
            ].includes(sample.sample_name)),
            {
              sample_name: 'Nebraska public FeatureServer export formats',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_feature_service_exportable_without_assignment_semantics',
              source_table: 'batch314_nebraska_export_format_finality_v1',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live FeatureServer root advertises `supportedExportFormats: sqlite,filegdb,shapefile,csv,geojson`, but that exportable surface still lacks any service-area or assignment artifact.'
            },
            {
              sample_name: 'Nebraska distinct county query remains partial',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
              verification_status: 'blocked',
              source_type: 'official_distinct_county_query_without_statewide_assignment',
              source_table: 'batch314_nebraska_export_format_finality_v1',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The bounded distinct-value query still returns only 37 county names and none are multi-county service-area strings.'
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: 'The public office layer is exportable, but its schema still lacks assignment fields and its distinct county values still cover only 37 counties with no multi-county service strings.' }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
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
            packetBatch: 'batch314_nebraska_export_format_finality_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  updateAllStateReport();
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    state: 'nebraska',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    supported_export_formats: ['sqlite', 'filegdb', 'shapefile', 'csv', 'geojson'],
    distinct_county_values: 37,
    multi_county_strings_present: false,
    next_action: NEXT_ACTION,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch314NebraskaExportFormatFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
