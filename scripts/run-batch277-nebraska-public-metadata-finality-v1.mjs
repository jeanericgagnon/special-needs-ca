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
  report: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch277_nebraska_public_metadata_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch277-nebraska-public-metadata-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields';
const FAILURE_CODE = 'official_public_office_service_root_has_no_tables_no_relationships_and_webmap_popup_only_materializes_contact_fields';
const NEXT_ACTION = 'hold_blocked_until_official_service_area_table_or_county_assignment_artifact_exists';
const STATUS_REASON =
  'Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the DHHS content host and the public GIS metadata stack. The exact first-party leaf at `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is live, but `https://dhhs.ne.gov/sitemap.xml` collapses to SharePoint `PageNotFoundError.aspx`, so the public DHHS host exposes no sitemap-backed successor office directory. The public Web Experience item (`76a6ec0ec7c449448c95d00f59002457`) is openly titled `Nebraska Public Office Location` and describes only a lookup tool with filtering for computer, scanner, and telephone usages. The paired Web Map item (`4bdbf8e8703743b0b2ff290f98737825`) and both FeatureServer and MapServer roots still expose only the office point layer plus county boundary layer, `tables: []`, and no service-area or county-assignment contract. Nebraska therefore still lacks any public county-to-office assignment artifact.';

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
    '- county_local_disability_resources is still final-blocked: the DHHS office leaf is live, but the DHHS sitemap has no successor directory path and the public GIS metadata still describes only an office lookup with office/county layers and no county-assignment contract.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const focusBlock = [
    '## Current Focus State: Nebraska',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. The exact DHHS Public Assistance Offices leaf is live, but the public office lane still has no county-to-office assignment artifact. One more bounded official pass confirmed the DHHS sitemap is dead, the public Web Experience item only describes a generic office lookup with computer/scanner/telephone filters, and the paired Web Map plus FeatureServer/MapServer roots still expose only office points, county boundaries, and `tables: []`.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Nebraska DHHS county-to-office assignment table, export, or public document that explicitly maps all 93 counties to office coverage.',
    '- Any successor public locator artifact on the DHHS host or GIS host that adds service-area, region, assigned-counties, or other coverage fields beyond office contact cards.',
    '- Any reviewed official PDF, spreadsheet, or page on the DHHS stack that enumerates county coverage for the public assistance office lane.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Nebraska Public Assistance Offices](https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx)',
    '- [Nebraska DHHS sitemap](https://dhhs.ne.gov/sitemap.xml)',
    '- [Nebraska Public Office Location web experience item](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457?f=json)',
    '- [Nebraska Public Office Location web experience data](https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json)',
    '- [Nebraska Public Assistance Office Location web map item](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825?f=json)',
    '- [Nebraska FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)',
    '- [Nebraska MapServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/MapServer?f=pjson)',
    '- [Nebraska office layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson)',
    '- [Nebraska distinct county query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any reviewed Nebraska DHHS public document or export outside the current locator that names county coverage for the public assistance office lane.',
    '- Any successor GIS layer or table on the official Nebraska host that introduces assigned counties, service areas, or regions.',
    '- Any future DHHS sitemap-backed office directory leaf that stops handing off to the generic locator and instead preserves county coverage directly.',
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

function buildBatchReport(batchSummary) {
  return [
    '# Batch 277 Nebraska Public Metadata Finality Report v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.blocker_family}`,
    '',
    '## What was confirmed',
    '',
    '- The exact DHHS Public Assistance Offices leaf is still live.',
    '- `https://dhhs.ne.gov/sitemap.xml` returns SharePoint `PageNotFoundError.aspx`, so the DHHS host exposes no sitemap-backed successor office directory.',
    '- The public Web Experience item openly describes only a lookup tool with computer, scanner, and telephone filtering.',
    '- The paired public Web Map item and both FeatureServer and MapServer roots still expose only office points, county boundaries, and `tables: []`.',
    '',
    '## Repair decision',
    '',
    '- Nebraska remains final-blocked on missing public county-assignment data.',
    '- No new public sibling artifact was found that could convert the office locator into county-grade local routing.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch277NebraskaPublicMetadataFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const evidence =
    'Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the DHHS content host and the public GIS metadata stack. The exact leaf at https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx is live, but https://dhhs.ne.gov/sitemap.xml collapses to SharePoint `PageNotFoundError.aspx`, so the DHHS host exposes no sitemap-backed successor office directory. The public Web Experience item metadata at https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457?f=json is openly titled `Nebraska Public Office Location` and describes only a lookup tool with filtering for computer, scanner, and telephone usages. The paired Web Map item at https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825?f=json and both the FeatureServer and MapServer roots still expose only the office point layer plus county boundary layer and `tables: []`, with no service-area or county-assignment artifact. Nebraska therefore remains final-blocked on missing public county-to-office assignment data.';

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_public_office_service_root_without_assignment_contract', status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const samples = [
      ...(row.samples || []).filter((sample) => ![
        'Nebraska DHHS sitemap non-match',
        'Nebraska web experience item metadata',
        'Nebraska MapServer root parity',
      ].includes(sample.sample_name)),
      {
        sample_name: 'Nebraska DHHS sitemap non-match',
        source_url: 'https://dhhs.ne.gov/sitemap.xml',
        final_url: 'https://dhhs.ne.gov/Pages/PageNotFoundError.aspx?requestUrl=https://dhhs.ne.gov/sitemap.xml',
        verification_status: 'blocked',
        source_type: 'official_sitemap_non_match',
        source_table: 'batch277_nebraska_public_metadata_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The DHHS sitemap route collapses to SharePoint PageNotFoundError.aspx, so the host exposes no sitemap-backed successor office directory.',
      },
      {
        sample_name: 'Nebraska web experience item metadata',
        source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457?f=json',
        final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457?f=json',
        verification_status: 'blocked',
        source_type: 'official_web_experience_item_metadata',
        source_table: 'batch277_nebraska_public_metadata_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public item metadata is titled `Nebraska Public Office Location` and describes only a lookup tool with filtering for computer, scanner, and telephone usages.',
      },
      {
        sample_name: 'Nebraska MapServer root parity',
        source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/MapServer?f=pjson',
        final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/MapServer?f=pjson',
        verification_status: 'blocked',
        source_type: 'official_map_service_root_without_assignment_contract',
        source_table: 'batch277_nebraska_public_metadata_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public MapServer root mirrors the same two layers and `tables: []`, adding no county-assignment artifact beyond the existing office and county layers.',
      },
    ];
    return {
      ...row,
      family_status: 'blocked_public_office_service_root_without_assignment_contract',
      blocker_code: FAILURE_CODE,
      blocker_evidence: evidence,
      query_basis: 'Reviewed 2026-06-23 the official Nebraska DHHS office leaf, DHHS sitemap route, public GIS item metadata, Web Experience config, Web Map item, and both service roots.',
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence }
      : row
  ));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
        : row
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: 'blocked_public_office_service_root_without_assignment_contract',
    },
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();

  const batchSummary = {
    state: 'nebraska',
    classification: 'BLOCKED',
    blocker_family: 'county_local_disability_resources',
    dhhs_sitemap_alive: false,
    web_experience_describes_lookup_only: true,
    mapserver_tables_present: false,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch277NebraskaPublicMetadataFinalityV1();
  console.log('Generated batch277 Nebraska public metadata finality artifacts.');
}
