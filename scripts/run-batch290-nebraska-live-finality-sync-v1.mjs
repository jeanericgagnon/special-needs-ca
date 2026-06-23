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
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  packet: path.join(generatedDir, 'nebraska_county_local_disability_resources_service_area_packet_v1.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch290_nebraska_live_finality_sync_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch290-nebraska-live-finality-sync-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields';
const FAILURE_CODE = 'official_public_office_service_root_has_no_tables_no_relationships_and_datasource_registry_only_materializes_locator_outputs';
const NEXT_ACTION = 'hold_blocked_until_official_service_area_table_or_county_assignment_artifact_exists';

const STATUS_REASON =
  'Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the live DHHS leaf, the public ExperienceBuilder datasource registry, and the public FeatureServer layers. The exact first-party leaf at `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` is live, but `https://dhhs.ne.gov/sitemap.xml` returns HTTP 404 and exposes no sitemap-backed successor office directory. The public datasource registry for ExperienceBuilder item `76a6ec0ec7c449448c95d00f59002457` still materializes only the shared web map (`dataSource_3`), a `Public Assitance Office (Closest Feature)` widget output, and a Nebraska point layer from the ArcGIS World Geocoding Service. The FeatureServer still has only two public layers, `tables: []`, zero relationships on both layers, 42 office points, and only 37 distinct `USER_County` values. Nebraska therefore still lacks any public county-to-office assignment contract.';

const EVIDENCE =
  'Reviewed 2026-06-23 one more bounded official Nebraska county-local pass on the live DHHS leaf and the exact public GIS stack. `https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx` returned HTTP 200, while `https://dhhs.ne.gov/sitemap.xml` still returned HTTP 404, so the DHHS host still exposes no sitemap-backed successor office directory. The public ExperienceBuilder item metadata at `https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457?f=json` remains titled `Nebraska Public Office Location`, and its datasource registry at `.../data?f=json` still materializes only three public datasources: the shared web map (`dataSource_3`), a `Public Assitance Office (Closest Feature)` widget output, and a Nebraska point layer from the ArcGIS World Geocoding Service. The public FeatureServer root still exposes only two layers, `tables: []`, and 42 office points. Layer 0 (`Public Assitance Office`) still has zero relationships and only contact-style fields such as `USER_Address_1`, `USER_City`, `USER_County`, `USER_Tel`, `USER_Toll_Free_Line`, `USER_Hours`, `USER_Computer`, `USER_Scanning`, and `USER_Phone`. Layer 1 (`County Boundary`) still has zero relationships and only county-boundary fields like `NAME`, `COUNTYFP`, and `GEOID`. A live distinct-county query on layer 0 still returns only 37 distinct `USER_County` values, not a statewide county assignment contract. Nebraska therefore remains final-blocked on missing public county-to-office assignment data.';

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
    '- county_local_disability_resources is still final-blocked: the live DHHS office leaf, the public ExperienceBuilder datasource registry, and the public FeatureServer layers still expose only 42 office points, county boundaries, and locator outputs rather than any county-to-office assignment artifact.',
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
  const nextStateIds = [
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
  ].filter((stateId) => blockedSet.has(stateId));
  const nextStates = nextStateIds.map((stateId) => {
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
    '`county_local_disability_resources` is the only remaining Nebraska critical blocker. The live DHHS office page, the public ExperienceBuilder datasource registry, and the public FeatureServer layers are all readable enough to prove what is missing: there is still no public county-to-office assignment contract, so Nebraska stays BLOCKED and not index-safe. The public office layer still exposes only 42 office points across 37 distinct `USER_County` values.',
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
    '- [Nebraska public office Web Map metadata](https://gis.ne.gov/portal/sharing/rest/content/items/4bdbf8e8703743b0b2ff290f98737825?f=json)',
    '- [Nebraska public office FeatureServer root](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer?f=pjson)',
    '- [Nebraska public office layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson)',
    '- [Nebraska county boundary layer schema](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson)',
    '- [Nebraska office-layer distinct county query](https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json)',
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
    '',
  ].join('\n');
}

function buildBatchReport(summary) {
  return [
    '# Batch 290 Nebraska Live Finality Sync Report v1',
    '',
    '- state: Nebraska',
    `- classification: ${summary.classification}`,
    '- blocker_family: county_local_disability_resources',
    '',
    '## What was confirmed',
    '',
    '- The exact DHHS Public Assistance Offices leaf is still live.',
    '- `https://dhhs.ne.gov/sitemap.xml` still returns HTTP 404 and exposes no sitemap-backed successor directory.',
    '- The public ExperienceBuilder datasource registry still exposes only the shared web map, a closest-office widget output, and an ArcGIS geocoding output.',
    '- The public FeatureServer still exposes only two layers, zero relationships, and `tables: []`.',
    '- The office layer still exposes only 37 distinct `USER_County` values, not a county-complete assignment contract.',
    '',
    '## Repair decision',
    '',
    '- Nebraska remains final-blocked on missing public county-assignment data.',
    '- No official public county-to-office bridge appeared on the current DHHS or GIS surfaces, so the blocker stays exact and index-safe remains false.',
  ].join('\n') + '\n';
}

export function generateBatch290NebraskaLiveFinalitySyncV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const packet = readJson(INPUTS.packet);

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...packet.current_problem_metrics,
      officeLayerRows: 42,
      officeLayerDistinctCounties: 37,
      publicOfficeCount: 42,
      publicCountyCount: 93,
      distinctOfficeCounties: 37,
      serviceRootTablesPresent: false,
      officeLayerHasServiceAreaFields: false,
      officeLayerHasMultiCountyValues: false,
      officeLayerRelationshipsPresent: false,
      countyLayerRelationshipsPresent: false,
    },
    purpose: 'Deterministic packet for Nebraska county-local routing after the live DHHS leaf, ExperienceBuilder datasource registry, and public FeatureServer layers all still prove there is no public county assignment contract.',
  };

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
    const filteredSamples = (row.samples || []).filter((sample) => ![
      'Nebraska ExperienceBuilder datasource registry',
      'Nebraska office layer schema',
      'Nebraska county boundary layer schema',
      'Nebraska distinct office counties query',
    ].includes(sample.sample_name));
    const samples = [
      ...filteredSamples,
      {
        sample_name: 'Nebraska ExperienceBuilder datasource registry',
        source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
        final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/76a6ec0ec7c449448c95d00f59002457/data?f=json',
        verification_status: 'blocked',
        source_type: 'official_experiencebuilder_datasource_registry',
        source_table: 'batch290_nebraska_live_finality_sync',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public datasource registry still materializes only the shared web map, a closest-office widget output, and a Nebraska geocoding point layer.',
      },
      {
        sample_name: 'Nebraska office layer schema',
        source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson',
        final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0?f=pjson',
        verification_status: 'blocked',
        source_type: 'official_office_layer_schema_without_assignment_fields',
        source_table: 'batch290_nebraska_live_finality_sync',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'Layer 0 still has zero relationships and only contact-style fields such as USER_Address_1, USER_City, USER_County, USER_Tel, USER_Toll_Free_Line, USER_Hours, USER_Computer, USER_Scanning, and USER_Phone.',
      },
      {
        sample_name: 'Nebraska county boundary layer schema',
        source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson',
        final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/1?f=pjson',
        verification_status: 'blocked',
        source_type: 'official_county_boundary_layer_without_assignment_bridge',
        source_table: 'batch290_nebraska_live_finality_sync',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'Layer 1 still has zero relationships and only county-boundary fields such as NAME, COUNTYFP, and GEOID.',
      },
      {
        sample_name: 'Nebraska distinct office counties query',
        source_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
        final_url: 'https://gis.ne.gov/agency3/rest/services/Nebraska_DHHS_Public_Assistance_Office_Location/FeatureServer/0/query?where=1%3D1&outFields=USER_County&returnDistinctValues=true&returnGeometry=false&f=json',
        verification_status: 'blocked',
        source_type: 'official_distinct_county_query_without_statewide_assignment',
        source_table: 'batch290_nebraska_live_finality_sync',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The live distinct-county query still returns only 37 office counties, not a 93-county assignment contract.',
      },
    ];
    return {
      ...row,
      family_status: 'blocked_public_office_service_root_without_assignment_contract',
      query_basis: 'Reviewed 2026-06-23 the live official Nebraska DHHS office leaf, the ExperienceBuilder datasource registry, the public FeatureServer layers, and the distinct county query.',
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
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
            completenessPct: 92,
            strongCriticalFamilies: 11,
            weakCriticalFamilies: 1,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'batch_2_repair_blocked',
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: 'blocked_public_office_service_root_without_assignment_contract',
            },
          }
        : row
    )),
  };

  const updatedAllStateQueue = allStateQueue.map((row) => (
    row.state === 'nebraska'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'batch_2_repair_blocked',
          status: 'BLOCKED',
        }
      : row
  ));

  writeJson(INPUTS.packet, updatedPacket);
  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit));

  let allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const staleKansasLine = '- Kansas remains blocked, but reviewed local education-routing proof now covers 14 of 105 counties after Newton USD 373 and Emporia USD 253 added two more district-host local leaves.';
  if (!allStateReport.includes('- Nebraska remains blocked because the official county-local office stack still exposes no public county-to-office assignment contract beyond locator outputs.')) {
    allStateReport = allStateReport.replace(
      staleKansasLine,
      `${staleKansasLine}\n- Nebraska remains blocked because the official county-local office stack still exposes no public county-to-office assignment contract beyond locator outputs.`
    );
  }
  fs.writeFileSync(INPUTS.allStateReport, allStateReport);

  const batchSummary = {
    batch: 'batch290_nebraska_live_finality_sync_v1',
    state: 'nebraska',
    classification: 'BLOCKED',
    index_safe: false,
    office_layer_rows: 42,
    distinct_office_counties: 37,
    datasource_registry_only_has_locator_outputs: true,
    primary_gap_reason: PRIMARY_GAP_REASON,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch290NebraskaLiveFinalitySyncV1();
  console.log(JSON.stringify(summary, null, 2));
}
