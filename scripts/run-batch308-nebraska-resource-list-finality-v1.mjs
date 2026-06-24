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
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch308_nebraska_resource_list_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch308-nebraska-resource-list-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'official_published_resource_list_contains_only_config_and_static_assets_while_no_metadata_or_hidden_assignment_artifact_exists';
const FAILURE_CODE =
  'official_published_resource_list_contains_only_config_and_static_assets_while_no_metadata_or_hidden_assignment_artifact_exists';
const NEXT_ACTION =
  'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published';
const FAMILY_STATUS =
  'blocked_public_office_service_root_without_assignment_contract_or_hidden_resource_artifact';
const STATUS_REASON =
  'Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the public ArcGIS item resource surfaces. The ExperienceBuilder item resource list is live, but it contains only `config/config.json` plus static image assets; the paired Web Map item resource list is empty; and both metadata XML routes 404 while the ExperienceBuilder `info/iteminfo` endpoint returns `Info file for item not found`. Combined with the already-reviewed public config, empty related-items endpoints, and contact-only FeatureServer schema, that means the current official Nebraska office stack still exposes no hidden county-assignment artifact.';
const EVIDENCE =
  'Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the public ArcGIS item resource and metadata surfaces. `https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json` returned HTTP 200 and listed exactly 9 resources, but they are only the published `config/config.json` plus static image assets under `images/`; there is no CSV, table, county assignment file, service-area export, or hidden operational dataset in that public resource list. The paired Web Map resource list at `https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/resources?f=json` returns `{\"total\":0,\"resources\":[]}`. Both metadata XML routes return HTTP 404, and the ExperienceBuilder info-file endpoint at `.../info/iteminfo?f=json` returns `{\"error\":{\"message\":\"Info file for item not found\"}}`. Combined with the already-reviewed published config, empty related-items endpoints, and contact-only FeatureServer schema, Nebraska therefore still exposes no hidden public county-assignment artifact and remains final-blocked on county-local disability resources.';

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
    '- county_local_disability_resources is now frozen past the hidden-resource theory too: the public resource list contains only config and image assets, the paired web map has no resources, and no metadata/info file exposes a county-assignment artifact.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const focusBlock = [
    '## Current Focus State: Nebraska',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. One more bounded official pass on the ArcGIS item resources closes the last hidden-artifact theory: the public ExperienceBuilder resource list contains only `config/config.json` plus image assets, the paired Web Map resource list is empty, both metadata XML routes 404, and the ExperienceBuilder `info/iteminfo` endpoint says `Info file for item not found`. Nebraska therefore still exposes no public county-to-office assignment artifact and remains BLOCKED / not index-safe.',
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
    '- [ExperienceBuilder related items](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/relatedItems?relationshipType=WMA2Code&direction=forward&f=json)',
    '- [Web Map resources](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/resources?f=json)',
    '- [Web Map metadata XML attempt](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/info/metadata/metadata.xml)',
    '- [Web Map related items](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/relatedItems?direction=forward&f=json)',
    '- [Nebraska public office FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)',
    '- [Nebraska public office layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- An official Nebraska DHHS county assignment export or service-area table attached to the existing office stack.',
    '- Any new public ArcGIS resource file that is not just config or images and that explicitly carries county assignment or service-area data.',
    '- An exact first-party county office page or county directory leaf on `dhhs.ne.gov` that publishes county coverage instead of only contact cards.',
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
  const note = '- Nebraska county-local routing is now frozen even at the item-resource layer: the public ExperienceBuilder item lists only config and image assets, the paired web map has zero resources, and the metadata/info-file routes expose no hidden assignment artifact.';
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  if (!current.includes(note)) {
    current = `${current.trimEnd()}\n${note}\n`;
    fs.writeFileSync(INPUTS.allStateReport, current);
  }
}

function buildBatchReport(summary) {
  return [
    '# Batch 308 Nebraska Resource List Finality Report v1',
    '',
    '- state: Nebraska',
    `- classification: ${summary.classification}`,
    '- blocker_family: county_local_disability_resources',
    '',
    '## What was confirmed',
    '',
    '- The public ExperienceBuilder item resource list is live.',
    '- That resource list contains only the published config and static image assets.',
    '- The paired Web Map resource list is empty.',
    '- The metadata XML endpoints 404 and the ExperienceBuilder iteminfo endpoint says the info file is missing.',
    '',
    '## Repair decision',
    '',
    '- Nebraska remains final-blocked on missing public county-assignment data.',
    '- No hidden public resource, metadata, or info file exists on the current official stack to recover a county-to-office contract.',
  ].join('\n') + '\n';
}

export function generateBatch308NebraskaResourceListFinalityV1() {
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

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed the public ExperienceBuilder resource list, iteminfo/metadata routes, the paired Web Map resource list, and the already-reviewed official office stack.',
          sample_count: Math.max(row.sample_count || 0, 20),
          samples: [
            ...(row.samples || []).filter((sample) => ![
              'Nebraska ExperienceBuilder resource list',
              'Nebraska ExperienceBuilder missing iteminfo file',
              'Nebraska ExperienceBuilder metadata xml 404',
              'Nebraska Web Map empty resource list',
              'Nebraska Web Map metadata xml 404',
            ].includes(sample.sample_name)),
            {
              sample_name: 'Nebraska ExperienceBuilder resource list',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json',
              verification_status: 'blocked',
              source_type: 'official_resource_list_without_assignment_artifact',
              source_table: 'batch308_nebraska_resource_list_finality_v1',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live resource list contains exactly 9 resources, but they are only `config/config.json` plus static image assets under `images/`.'
            },
            {
              sample_name: 'Nebraska ExperienceBuilder missing iteminfo file',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/info/iteminfo?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/info/iteminfo?f=json',
              verification_status: 'blocked',
              source_type: 'official_iteminfo_missing',
              source_table: 'batch308_nebraska_resource_list_finality_v1',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The endpoint returns `Info file for item not found`.'
            },
            {
              sample_name: 'Nebraska ExperienceBuilder metadata xml 404',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/info/metadata/metadata.xml',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/info/metadata/metadata.xml',
              verification_status: 'blocked',
              source_type: 'official_metadata_missing',
              source_table: 'batch308_nebraska_resource_list_finality_v1',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The metadata XML route returns HTTP 404.'
            },
            {
              sample_name: 'Nebraska Web Map empty resource list',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/resources?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/resources?f=json',
              verification_status: 'blocked',
              source_type: 'official_resource_list_empty',
              source_table: 'batch308_nebraska_resource_list_finality_v1',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The paired Web Map resource list returns `{\"total\":0,\"resources\":[]}`.'
            },
            {
              sample_name: 'Nebraska Web Map metadata xml 404',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/info/metadata/metadata.xml',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/info/metadata/metadata.xml',
              verification_status: 'blocked',
              source_type: 'official_metadata_missing',
              source_table: 'batch308_nebraska_resource_list_finality_v1',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The paired Web Map metadata XML route also returns HTTP 404.'
            }
          ]
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: 'The public ExperienceBuilder resource list contains only config and image assets, the paired Web Map resource list is empty, and the metadata/info routes add no hidden assignment artifact.' }
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
            packetBatch: 'batch308_nebraska_resource_list_finality_v1',
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
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  updateHandoff();
  updateAllStateReport();

  const summaryOut = {
    state: 'nebraska',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    experiencebuilder_resource_total: 9,
    experiencebuilder_resource_classes: ['config', 'image_assets_only'],
    webmap_resource_total: 0,
    experiencebuilder_iteminfo_status: 'missing',
    experiencebuilder_metadata_status: '404',
    webmap_metadata_status: '404',
    next_action: NEXT_ACTION,
  };

  writeJson(OUTPUTS.summary, summaryOut);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(summaryOut));
  return summaryOut;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch308NebraskaResourceListFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
