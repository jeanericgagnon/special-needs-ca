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
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch344_nebraska_portal_search_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch344-nebraska-portal-search-finality-report-v1.md'),
};

const BATCH = 'batch344_nebraska_portal_search_finality_v1';
const PRIMARY_GAP_REASON =
  'official_nebraska_portal_search_still_returns_only_the_same_web_map_feature_service_and_map_service_without_any_county_assignment_item_or_directory_leaf';
const NEXT_ACTION =
  'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published';
const FAMILY_STATUS =
  'blocked_official_portal_search_confirms_only_locator_trilogy_without_assignment_contract';
const STATUS_REASON =
  'Reviewed 2026-06-24 one more bounded official Nebraska county-local pass and confirmed the official public GIS portal search still returns only the same locator trilogy for `Public Assistance Offices`: one web map item, one feature service, and one map service, all with the same Nebraska DHHS office-location title and no county-assignment table, directory leaf, or alternate public item. The DHHS SharePoint wrapper still does not enumerate counties, the public ExperienceBuilder resources still expose only config/image assets, the public web map still has zero tables, and the FeatureServer still stops at 42 offices against 93 counties. Nebraska therefore still lacks a public statewide county-to-office assignment contract.';
const EVIDENCE =
  'Reviewed 2026-06-24 one more bounded official Nebraska county-local pass across the live DHHS and ArcGIS publication stack, then queried the official public GIS portal search directly. `https://gis.ne.gov/portal/sharing/rest/search?q=title%3A%22Public%20Assistance%20Offices%22&f=json` still returns only three public items with the same office-location title and the same owner family: the web map item `4bdbf8e8703743b0b2ff290f98737825`, the feature service item `cf70cb74fcc94634afc89f0a22a7d06f`, and the map service item `90a19933cfc444be836f51d15e2e23ec`. No table item, CSV, alternate directory layer, county-assignment app item, or other public office-routing artifact appears in that official search result set. The exact `Public Assistance Office Location Lookup` search also returns only the same web map item. Meanwhile `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is still only the SharePoint wrapper for the locator, the public ExperienceBuilder resources still expose only config and image assets, the underlying public web map still has only office and county boundary layers with zero tables, and the public FeatureServer still stops at 42 office rows against 93 counties. Nebraska therefore still has no public county-assignment item anywhere on the current official stack.';

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
    '- The official GIS portal search still returns only the same office-locator trilogy: one web map, one feature service, and one map service.',
    '- No public county-assignment table, directory leaf, or alternate office-routing item appears anywhere in that official result set.',
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
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. The official public GIS portal search now sharpens the negative proof further: the public search for `Public Assistance Offices` still returns only the same office-locator trilogy, namely one web map item, one feature service, and one map service, all with the same Nebraska DHHS office-location title and no county-assignment table, county directory leaf, or alternate routing artifact. The DHHS SharePoint wrapper still does not enumerate counties, the public ExperienceBuilder resources still expose only config and image assets, the underlying public web map still has zero tables, and the public FeatureServer still stops at 42 offices against 93 counties. Nebraska therefore remains BLOCKED and not index-safe because there is still no public statewide county-to-office assignment bridge anywhere on the current official stack.',
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
    '- [Official GIS portal search: Public Assistance Offices](https://gis.ne.gov/portal/sharing/rest/search?q=title%3A%22Public%20Assistance%20Offices%22&f=json)',
    '- [Official GIS portal search: Public Assistance Office Location Lookup](https://gis.ne.gov/portal/sharing/rest/search?q=Public%20Assistance%20Office%20Location%20Lookup&f=json)',
    '- [ExperienceBuilder item data](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json)',
    '- [ExperienceBuilder resource list](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json)',
    '- [ExperienceBuilder config resource](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources/config/config.json?f=json)',
    '- [Nebraska public web map item data](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json)',
    '- [Nebraska public office FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)',
    '- [Nebraska public office MapServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/MapServer?f=pjson)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official Nebraska DHHS county assignment export or service-area table attached to the existing office stack.',
    '- Any new public ArcGIS resource, web map table, config datasource, or output field that explicitly carries county assignment data rather than only office contact fields.',
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
      '3. Oklahoma',
      '4. Ohio',
      '5. Minnesota',
      '6. Maine',
      '7. Idaho',
      '8. Arizona',
      '9. Massachusetts',
      '10. New Mexico',
      '',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  const note =
    '- Nebraska remains blocked because the official public GIS portal search itself still returns only the same office-locator trilogy, one web map plus one feature service plus one map service, with no county-assignment table or county directory leaf anywhere on the current DHHS stack.';
  const current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  fs.writeFileSync(INPUTS.allStateReport, replaceLineByPrefix(current, '- Nebraska remains blocked because', note));
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 344 Nebraska Portal Search Finality Report v1',
    '',
    '- state: Nebraska',
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the official public GIS portal search for `Public Assistance Offices` still returns only three public items: one web map, one feature service, and one map service.',
    '- Confirmed the exact `Public Assistance Office Location Lookup` search also returns only the same office-location item family.',
    '- Confirmed no public county-assignment table, alternate directory app, county-routing leaf, or export artifact appears in that official search result set.',
    '',
    '## Why Nebraska remains blocked',
    '',
    '- There is still no public county-assignment item anywhere on the official Nebraska office stack.',
    '- The public DHHS wrapper and ArcGIS items still resolve only to locator infrastructure, office contact cards, and map services, not a statewide county-to-office contract.',
    '',
    '## Next action',
    '',
    `- ${batchSummary.next_action}`,
    '',
  ].join('\n') + '\n';
}

export function generateBatch344NebraskaPortalSearchFinalityV1() {
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

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          blocker_code: PRIMARY_GAP_REASON,
          blocker_evidence: 'The official public GIS portal search still returns only the same office-location web map, feature service, and map service, with no county-assignment item or county directory leaf anywhere on the current Nebraska stack.',
          sample_count: 8,
          samples: [
            {
              sample_name: 'Official portal search returns web map only in lookup search',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/search?q=Public%20Assistance%20Office%20Location%20Lookup&f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/search?q=Public%20Assistance%20Office%20Location%20Lookup&f=json',
              verification_status: 'blocked',
              source_type: 'official_portal_search_without_assignment_item',
              source_table: 'batch344_nebraska_portal_search_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The official portal search for `Public Assistance Office Location Lookup` returns only the same Nebraska DHHS office-location web map item.',
            },
            {
              sample_name: 'Official portal search returns only locator trilogy',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/search?q=title%3A%22Public%20Assistance%20Offices%22&f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/search?q=title%3A%22Public%20Assistance%20Offices%22&f=json',
              verification_status: 'blocked',
              source_type: 'official_portal_search_without_assignment_item',
              source_table: 'batch344_nebraska_portal_search_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The official portal search still returns only three public items with the same Nebraska DHHS office-location title: one web map, one feature service, and one map service.',
            },
            {
              sample_name: 'Nebraska DHHS Public Assistance Offices wrapper',
              source_url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
              final_url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
              verification_status: 'blocked',
              source_type: 'official_locator_wrapper_without_county_directory',
              source_table: 'batch344_nebraska_portal_search_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The official DHHS page is still just the SharePoint wrapper for the locator and does not itself enumerate county-to-office assignments.',
            },
            {
              sample_name: 'ExperienceBuilder resource list still config-only',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/resources?f=json',
              verification_status: 'blocked',
              source_type: 'official_public_resources_without_assignment_asset',
              source_table: 'batch344_nebraska_portal_search_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The public resource list still exposes only config and image assets, with no county-assignment table, CSV, or service-area attachment.',
            },
            {
              sample_name: 'Nebraska public web map has no tables',
              source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json',
              final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_web_map_without_hidden_assignment_table',
              source_table: 'batch344_nebraska_portal_search_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The underlying public web map still contains office and county boundary layers only, with zero tables.',
            },
            {
              sample_name: 'Nebraska public office FeatureServer root',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_feature_service_without_assignment_contract',
              source_table: 'batch344_nebraska_portal_search_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The public FeatureServer still exposes only the office and county layers, not a county-assignment table or related service-area layer.',
            },
            {
              sample_name: 'Nebraska office count remains partial',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&returnCountOnly=true&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&returnCountOnly=true&f=json',
              verification_status: 'blocked',
              source_type: 'official_office_count_without_statewide_assignment',
              source_table: 'batch344_nebraska_portal_search_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The public office layer still returns only 42 office rows, not a statewide county-assignment contract.',
            },
            {
              sample_name: 'Nebraska county count remains 93',
              source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1/query?where=1%3D1&returnCountOnly=true&f=json',
              final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1/query?where=1%3D1&returnCountOnly=true&f=json',
              verification_status: 'blocked',
              source_type: 'official_county_boundary_count',
              source_table: 'batch344_nebraska_portal_search_finality_v1',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The county boundary layer still returns 93 counties, proving the public stack still lacks a 93-county assignment bridge.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: PRIMARY_GAP_REASON, next_action: NEXT_ACTION, evidence: 'The official public GIS portal search still returns only the same office-location web map, feature service, and map service, with no county-assignment item or county directory leaf anywhere on the current Nebraska stack.' }
      : row
  ));

  const updatedQueueRows = allStateQueue.map((row) => (
    row.state === 'nebraska'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: (allStateAudit.states || []).map((row) => (
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

  const batchSummary = {
    state: 'nebraska',
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'county_local_disability_resources',
    failure_code: PRIMARY_GAP_REASON,
    official_portal_result_count: 3,
    official_portal_result_types: ['Web Map', 'Feature Service', 'Map Service'],
    exact_lookup_search_result_count: 1,
    next_action: NEXT_ACTION,
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
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch344NebraskaPortalSearchFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
