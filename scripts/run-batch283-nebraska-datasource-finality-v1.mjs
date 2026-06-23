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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch283_nebraska_datasource_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch283-nebraska-datasource-finality-report-v1.md'),
};

const PRIORITY_ORDER = [
  'utah',
  'kansas',
  'nebraska',
  'nevada',
  'florida',
  'alaska',
  'south-carolina',
  'north-carolina',
  'new-york',
  'oklahoma',
  'oregon',
  'ohio',
  'minnesota',
  'maine',
  'idaho',
  'arizona',
  'massachusetts',
  'new-mexico',
  'south-dakota',
  'rhode-island',
  'virginia',
  'west-virginia',
  'north-dakota',
  'wisconsin',
  'washington',
  'tennessee',
  'vermont',
  'wyoming',
  'new-hampshire',
];

const PRIMARY_GAP_REASON = 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields';
const FAILURE_CODE = 'official_public_office_service_root_has_no_tables_no_relationships_and_webmap_datasources_only_materialize_locator_outputs';
const NEXT_ACTION = 'hold_blocked_until_official_service_area_table_or_county_assignment_artifact_exists';
const STATUS_REASON =
  'Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the DHHS content host plus the public GIS ExperienceBuilder datasource registry. The exact first-party leaf at `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is live, but `https://dhhs.ne.gov/sitemap.xml` still returns 404 and exposes no sitemap-backed successor office directory. The public Web Experience item (`76a6ec0ec7c449448c95d00f59002457`) remains openly titled `Nebraska Public Office Location` and describes only a lookup tool with computer, scanner, and telephone filtering. Its public datasource registry materializes only the shared web map (`dataSource_3`) plus two widget outputs: a closest-feature layer and an ArcGIS World Geocoding Service point layer. The paired Web Map item (`4bdbf8e8703743b0b2ff290f98737825`) and both FeatureServer and MapServer roots still expose only the office point layer plus county boundary layer and `tables: []`, with no service-area, assigned-counties, or county-assignment artifact. Nebraska therefore still lacks any public county-to-office assignment contract.';
const EVIDENCE =
  'Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the live DHHS leaf and the public GIS metadata stack. `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is live, but `https://dhhs.ne.gov/sitemap.xml` returns HTTP 404, so the DHHS host still exposes no sitemap-backed successor office directory. The public Web Experience item metadata at `https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457?f=json` is still titled `Nebraska Public Office Location` and describes only a lookup tool with filtering for computer, scanner, and telephone usages. Its public ExperienceBuilder datasource registry at `.../data?f=json` now confirms there is no hidden public assignment source: the app materializes only the shared web map (`dataSource_3`), a `Public Assitance Office (Closest Feature)` widget output, and an `ArcGIS World Geocoding Service` point layer. The paired Web Map item at `https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825?f=json` plus the FeatureServer and MapServer roots still expose only the office point layer plus county boundary layer and `tables: []`, and the office layer schema still contains only contact fields like `USER_Address_1`, `USER_City`, `USER_County`, `USER_Tel`, `USER_Toll_Free_Line`, `USER_Hours`, `USER_Computer`, `USER_Scanning`, and `USER_Phone`. Nebraska therefore remains final-blocked on missing public county-to-office assignment data.';

const LESSON_HEADING = '### ExperienceBuilder Datasource Registries Can Prove There Is No Hidden Public County Contract';
const LESSON_BODY =
  '*   **Lesson:** If a public ExperienceBuilder app\'s datasource registry materializes only the shared web map plus widget-output layers, treat that as affirmative evidence that there is no hidden public assignment table on the app surface. Nebraska\'s office locator exposed only the web map, a closest-office output, and an ArcGIS geocoder layer, which confirmed the blocker was a true missing county contract rather than an undiscovered public datasource.';

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
    '- district_or_county_education_routing remains verified_county_grade through the official county-selectable NDE directory host.',
    '- county_local_disability_resources is still final-blocked: the DHHS office leaf is live, but the public ExperienceBuilder datasource registry proves the office app still materializes only a web map plus locator outputs and no county-assignment contract.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit) {
  const blockedSet = new Set(
    allStateAudit.states
      .filter((row) => row.classification === 'BLOCKED')
      .map((row) => row.stateId)
  );
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));
  const nextStates = PRIORITY_ORDER
    .filter((stateId) => stateId !== 'nebraska' && blockedSet.has(stateId))
    .slice(0, 10)
    .map((stateId) => {
      const row = allStateAudit.states.find((state) => state.stateId === stateId);
      return row ? row.stateName : stateId;
    });

  return [
    '# Gemini Source Scout Handoff',
    '',
    'Updated: 2026-06-23',
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: Nebraska',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. The live DHHS office page, the public FeatureServer, and the public ExperienceBuilder datasource registry are all readable enough to prove what is missing: there is still no public county-to-office assignment contract, so Nebraska stays BLOCKED and not index-safe.',
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
    '- [Nebraska public office FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)',
    '- [Nebraska public office layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson)',
    '- [Nebraska county boundary layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson)',
    '- [Nebraska office-layer distinct county query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json)',
    '- [Nebraska public office Web Map metadata](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825?f=json)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- An official Nebraska DHHS county assignment export or service-area table attached to the existing office stack.',
    '- An exact first-party county office page or county directory leaf on `dhhs.ne.gov` that publishes county coverage instead of only contact cards.',
    '- Any public Nebraska GIS item related to the office stack that adds county-served fields or related-table joins beyond the current two public layers and widget outputs.',
    '',
    '## Next State Order After Nebraska',
    '',
    ...nextStates.map((stateName, index) => `${index + 1}. ${stateName}`),
  ].join('\n') + '\n';
}

function buildBatchReport(summary, lessonsUpdated) {
  return [
    '# Batch 283 Nebraska Datasource Finality Report v1',
    '',
    '- state: Nebraska',
    `- classification: ${summary.classification}`,
    '- blocker_family: county_local_disability_resources',
    `- lessons_updated: ${lessonsUpdated ? 'true' : 'false'}`,
    '',
    '## What was confirmed',
    '',
    '- The exact DHHS Public Assistance Offices leaf is still live.',
    '- `https://dhhs.ne.gov/sitemap.xml` still fails and exposes no sitemap-backed successor directory.',
    '- The public ExperienceBuilder datasource registry materializes only the shared web map plus a closest-office output and ArcGIS World Geocoding Service output.',
    '- The paired Web Map item and both service roots still expose only the office point layer plus county boundary layer and `tables: []`.',
    '',
    '## Repair decision',
    '',
    '- Nebraska remains final-blocked on missing public county-assignment data.',
    '- No hidden public datasource remains on the current ExperienceBuilder surface to reopen county-local routing.',
  ].join('\n') + '\n';
}

export function generateBatch283NebraskaDatasourceFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: 'blocked_public_office_service_root_without_assignment_contract',
    },
  };

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

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const keptSamples = (row.samples || []).filter((sample) => sample.sample_name !== 'Nebraska ExperienceBuilder datasource registry');
    const samples = [
      ...keptSamples,
      {
        sample_name: 'Nebraska ExperienceBuilder datasource registry',
        source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
        final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
        verification_status: 'blocked',
        source_type: 'official_experiencebuilder_datasource_registry_without_assignment_contract',
        source_table: 'batch283_nebraska_datasource_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public ExperienceBuilder datasource registry materializes only the shared web map, a closest-office widget output, and an ArcGIS World Geocoding Service point layer; it exposes no public service-area or county-assignment datasource.',
      },
    ];
    return {
      ...row,
      family_status: 'blocked_public_office_service_root_without_assignment_contract',
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      query_basis: 'Reviewed 2026-06-23 the official Nebraska DHHS office leaf, DHHS sitemap route, public GIS item metadata, ExperienceBuilder datasource registry, Web Map item, and both service roots.',
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(allStateAudit));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch283_nebraska_datasource_finality_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'nebraska',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    datasource_registry_only_has_locator_outputs: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(updatedSummary, lessonsUpdated));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch283NebraskaDatasourceFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
