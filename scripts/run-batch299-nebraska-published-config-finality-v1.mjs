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
  summary: path.join(generatedDir, 'batch299_nebraska_published_config_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch299-nebraska-published-config-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields';
const FAILURE_CODE = 'official_published_config_and_related_items_still_only_materialize_locator_outputs_without_county_assignment_contract';
const NEXT_ACTION = 'hold_blocked_until_official_service_area_table_or_county_assignment_artifact_exists';
const FAMILY_STATUS = 'blocked_public_office_service_root_without_assignment_contract';
const BATCH_NAME = 'batch299_nebraska_published_config_finality_v1';

const STATUS_REASON =
  'Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the live DHHS office leaf plus the published ArcGIS app contract. The exact first-party leaf at `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is live, but the official GIS portal still exposes no public county-assignment dependency behind it. The published ExperienceBuilder config at `.../resources/config/config.json` still binds only one web map data source (`dataSource_3`), one closest-office widget output, and one ArcGIS World Geocoding Service output. The public related-items endpoints for both the Web Experience item (`76a6ec0ec7c449448c95d00f59002457`) and the paired Web Map item (`4bdbf8e8703743b0b2ff290f98737825`) both return `total: 0`. The FeatureServer still has only two public layers, `tables: []`, zero relationships, and only 37 distinct `USER_County` values across 42 office rows. Nebraska therefore still lacks any public county-to-office assignment contract.';

const EVIDENCE =
  'Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the live DHHS leaf and the exact published ArcGIS stack. `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` returned HTTP 200, while the live office locator ExperienceBuilder config at `https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json` still materializes only three public data dependencies: the shared web map (`dataSource_3`), `widget_382_output_closest_000433549029275504` labeled `Public Assitance Office (Closest Feature)`, and `widget_383_output_config_0` labeled `Nebraska from ArcGIS World Geocoding Service`. The same published config lists only geocoding and routing utilities (`StreetMapPremiumNebraska2024`, ArcGIS World Geocoding Service, and Route World) rather than any county-assignment or service-area source. The public related-items endpoints for both the Web Experience item (`https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/relatedItems?relationshipType=WMA2Code&direction=forward&f=json`) and the paired Web Map item (`https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/relatedItems?direction=forward&f=json`) both return `{\"total\":0}`, so there is no hidden public sibling item to recover. The public FeatureServer root still exposes only two layers, `tables: []`, and the office layer still exposes only contact-style fields like `USER_Address_1`, `USER_City`, `USER_County`, `USER_Tel`, `USER_Toll_Free_Line`, `USER_Hours`, `USER_Computer`, `USER_Scanning`, and `USER_Phone`, with only 37 distinct `USER_County` values across 42 office rows. Nebraska therefore remains final-blocked on missing public county-to-office assignment data.';

const LESSON_HEADING = '### Published App Config Plus Empty Related Items Can Prove The Last Hidden-Source Theory Is Dead';
const LESSON_BODY =
  '*   **Lesson:** If a published ArcGIS app config resolves only to a shared web map, widget outputs, and geocoding/routing utilities, and both related-items endpoints are empty, treat that as final proof that there is no hidden public sibling item left to recover. Nebraska\'s office locator still had no county-assignment source even after the published config and related-items surfaces were checked directly.';

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

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
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
    '- county_local_disability_resources is still final-blocked: the live DHHS office leaf, the published ExperienceBuilder config, the empty related-items endpoints, and the public FeatureServer layers still expose only locator outputs rather than any county-to-office assignment artifact.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const focusBlock = [
    '## Current Focus State: Nebraska',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. The live DHHS office page, the public FeatureServer, the published ExperienceBuilder config, and both ArcGIS related-items endpoints are all readable enough to prove what is missing: there is still no public county-to-office assignment contract, so Nebraska stays BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Nebraska DHHS county-to-office assignment table, export, or service-area artifact that maps all 93 counties to public assistance offices.',
    '- Any public ArcGIS layer, related table, or API field on the existing Nebraska office stack that explicitly enumerates served counties, assigned counties, regions, or coverage areas for each office.',
    '- Any exact first-party DHHS leaf that publishes a county list or county-by-county local office contract instead of only a locator handoff.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Nebraska DHHS Public Assistance Offices](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)',
    '- [Nebraska DHHS sitemap](https://dhhs.ne.gov/sitemap.xml)',
    '- [Nebraska public office locator ExperienceBuilder item metadata](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457?f=json)',
    '- [Nebraska public office locator ExperienceBuilder data JSON](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json)',
    '- [Nebraska public office locator published config](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json)',
    '- [Nebraska public office locator related items](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/relatedItems?relationshipType=WMA2Code&direction=forward&f=json)',
    '- [Nebraska public office Web Map metadata](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825?f=json)',
    '- [Nebraska public office Web Map related items](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/relatedItems?direction=forward&f=json)',
    '- [Nebraska public office FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)',
    '- [Nebraska public office layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson)',
    '- [Nebraska county boundary layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson)',
    '- [Nebraska office-layer distinct county query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- An official Nebraska DHHS county assignment export or service-area table attached to the existing office stack.',
    '- An exact first-party county office page or county directory leaf on `dhhs.ne.gov` that publishes county coverage instead of only contact cards.',
    '- Any public Nebraska GIS item related to the office stack that adds county-served fields or related-table joins beyond the current two public layers, widget outputs, and geocoders.',
    '',
  ].join('\n');
  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n){1,12}/,
    [
      '## Next State Order After Nebraska',
      '',
      '1. Nevada',
      '2. Florida',
      '3. Alaska',
      '4. South Carolina',
      '5. North Carolina',
      '6. New York',
      '7. Oklahoma',
      '8. Oregon',
      '9. Ohio',
      '10. Minnesota',
    ].join('\n')
  );
  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  const note = '- Nebraska county-local routing is now explicitly frozen at the published-config layer: the live ExperienceBuilder config resolves only to one web map, one closest-office widget output, one geocoder output, and both related-items endpoints are empty, so there is no hidden public county-assignment source left on the current official stack.';
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  if (!current.includes(note)) {
    current = `${current.trimEnd()}\n${note}\n`;
    fs.writeFileSync(INPUTS.allStateReport, current);
  }
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 299 Nebraska Published Config Finality v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.blocker_family}`,
    '',
    '## What was confirmed',
    '',
    '- The exact DHHS Public Assistance Offices leaf is still live.',
    '- The published ExperienceBuilder config still binds only one web map, one closest-office widget output, and one geocoder output.',
    '- The published config utilities are routing and geocoding only, not county-assignment or service-area sources.',
    '- The public related-items endpoints for both the Web Experience item and the paired Web Map item both return `total: 0`.',
    '- The public FeatureServer still exposes only two layers, zero relationships, and `tables: []`.',
    '',
    '## Repair decision',
    '',
    '- Nebraska remains final-blocked on missing public county-assignment data.',
    '- No hidden public sibling item remains on the current published office-locator stack.',
  ].join('\n') + '\n';
}

export function generateBatch299NebraskaPublishedConfigFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
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

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const retained = (row.samples || []).filter((sample) => ![
      'Nebraska published config dependencies',
      'Nebraska Web Experience related items empty',
      'Nebraska Web Map related items empty',
    ].includes(sample.sample_name));
    const samples = [
      ...retained,
      {
        sample_name: 'Nebraska published config dependencies',
        source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json',
        final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json',
        verification_status: 'blocked',
        source_type: 'official_published_experiencebuilder_config_without_assignment_source',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The published config still binds only the shared web map `dataSource_3`, a `Public Assitance Office (Closest Feature)` widget output, and a `Nebraska from ArcGIS World Geocoding Service` output, plus geocoding/routing utilities only.',
      },
      {
        sample_name: 'Nebraska Web Experience related items empty',
        source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/relatedItems?relationshipType=WMA2Code&direction=forward&f=json',
        final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/relatedItems?relationshipType=WMA2Code&direction=forward&f=json',
        verification_status: 'blocked',
        source_type: 'official_related_items_empty',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public related-items endpoint for the Web Experience item returns `{"total":0}`, so no public sibling item remains to recover.',
      },
      {
        sample_name: 'Nebraska Web Map related items empty',
        source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/relatedItems?direction=forward&f=json',
        final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/relatedItems?direction=forward&f=json',
        verification_status: 'blocked',
        source_type: 'official_related_items_empty',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public related-items endpoint for the paired Web Map item also returns `{"total":0}`, confirming there is no hidden public dependent layer or table on the current stack.',
      },
    ];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      query_basis: 'Reviewed 2026-06-23 the official Nebraska DHHS office leaf, the published ExperienceBuilder config, both ArcGIS related-items endpoints, and the public FeatureServer contract.',
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'nebraska'
      ? { ...row, classification: 'BLOCKED', status: 'BLOCKED', primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'nebraska'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: FAMILY_STATUS,
            },
            packetBatch: BATCH_NAME,
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
  updateAllStateReport();
  updateHandoff();
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    batch: BATCH_NAME,
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'nebraska',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    published_config_dependency_count: 3,
    related_items_total_web_experience: 0,
    related_items_total_web_map: 0,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch299NebraskaPublishedConfigFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
