import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'michigan_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'michigan_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'michigan_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'michigan_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'michigan_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'michigan_district_or_county_education_routing_arcgis_contract_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch221_michigan_app_query_contract_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch221-michigan-app-query-contract-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'michigan-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'official_mde_app_queries_public_school_and_boundary_layers_but_still_no_district_routing_contract';
const STATUS_REASON = 'Reviewed 2026-06-23 the official Michigan MDE ISD Plans leaf, the linked ArcGIS app config, and the exact public layers the app actually queries. The public app does not hide a separate contact export: it queries the ISD boundary layer, the school-district boundary layer, and a school-campus layer. The ISD and district layers still expose only boundary and identifier fields, while the school layer adds campus street/city/ZIP fields only. None of the official queried layers publish district websites, district special-education contacts, ISD contact directories, or county-to-ISD routing fields, so the official stack still lacks a county-grade education-routing contract.';
const EVIDENCE = 'Reviewed 2026-06-23 the official Michigan MDE Special Education page, ISD Plans leaf, the linked ArcGIS app config at https://michigan.maps.arcgis.com/sharing/rest/content/items/438dc453faf749d786e0c6e8be731cfd/data?f=json, and the exact public layers referenced by that app. The app queries https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/1 for ISDs, https://gisagocss.state.mi.us/arcgis/rest/services/OpenData/michigan_geographic_framework/MapServer/10 for school-district boundaries, and https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/0 for school campuses. Layer 1 still exposes only boundary/identifier fields like NAME, LABEL, TYPE, ISD, and ISDCode. Layer 10 still exposes only boundary/identifier fields like FIPSCODE, NAME, LABEL, DCODE, and ISD. Layer 0 adds school-campus address fields such as STREET, CITY, STATE, ZIP, LATITUDE, LONGITUDE, and COUNTY, but no district website, district special-education contact, ISD routing contact, or local education-routing URL. So even the exact public layers the official app queries still do not provide the district-or-county routing contract Michigan needs.';
const NEXT_ACTION = 'hold_blocked_until_official_isd_or_district_contact_directory_or_export_exists';

const LESSON_HEADING = '### School-Campus Address Layers Still Do Not Satisfy District Routing';
const LESSON_BODY = '*   **Lesson:** If an official education map app mixes district boundaries with school-campus address layers, do not let the campus addresses count as district routing proof. Michigan’s public school layer added STREET, CITY, ZIP, and COUNTY, but still no district website, special-education contact, or ISD routing contract.';

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
    '# Michigan California-Grade Audit Report v2',
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
    '- Michigan remains BLOCKED and index_safe=false.',
    '- The only remaining blocker is district_or_county_education_routing.',
    '- The exact public layers used by the official MDE-linked app are now fully accounted for: ISD boundaries, district boundaries, and school-campus addresses.',
    '- None of those queried layers preserve district special-education contacts, district websites, or ISD routing directories, so Michigan still lacks a county-grade local education-routing contract.',
  ].join('\n') + '\n';
}

export function generateBatch221MichiganAppQueryContractRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_mde_app_query_layers_without_local_routing_contract', status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_mde_app_query_layers_without_local_routing_contract',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed 2026-06-23 the official MDE ISD Plans leaf, the linked ArcGIS app config, and the exact public ISD, district, and school layers the app actually queries.',
          sample_count: 5,
          samples: [
            {
              sample_name: 'Michigan MDE ISD Plans',
              source_url: 'https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans',
              final_url: 'https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans',
              verification_status: 'blocked',
              source_type: 'official_guidance_leaf_without_local_directory',
              source_table: 'batch221_michigan_app_query_contract_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live ISD Plans page links the public ArcGIS map but no ISD-by-ISD contact directory or district-owned special-education leaves.',
            },
            {
              sample_name: 'Michigan ArcGIS app config',
              source_url: 'https://michigan.maps.arcgis.com/sharing/rest/content/items/438dc453faf749d786e0c6e8be731cfd/data?f=json',
              final_url: 'https://michigan.maps.arcgis.com/sharing/rest/content/items/438dc453faf749d786e0c6e8be731cfd/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_arcgis_app_config',
              source_table: 'batch221_michigan_app_query_contract_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official app config queries only the ISD boundary layer, school-district boundary layer, and school-campus layer.',
            },
            {
              sample_name: 'Michigan ISD boundary layer',
              source_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/1?f=pjson',
              final_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/1?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_arcgis_isd_boundary_layer',
              source_table: 'batch221_michigan_app_query_contract_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The ISD layer exposes NAME, LABEL, TYPE, ISD, and ISDCode only, with no district or special-education contact fields.',
            },
            {
              sample_name: 'Michigan district boundary layer',
              source_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/OpenData/michigan_geographic_framework/MapServer/10?f=pjson',
              final_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/OpenData/michigan_geographic_framework/MapServer/10?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_arcgis_district_boundary_layer',
              source_table: 'batch221_michigan_app_query_contract_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The district layer exposes FIPSCODE, NAME, LABEL, DCODE, and ISD but no local routing contacts or district website fields.',
            },
            {
              sample_name: 'Michigan school-campus layer',
              source_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/0?f=pjson',
              final_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/0?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_arcgis_school_address_layer',
              source_table: 'batch221_michigan_app_query_contract_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The school layer adds STREET, CITY, STATE, ZIP, LATITUDE, LONGITUDE, and COUNTY for campuses, but no district website, special-education contact, or ISD routing directory.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...(packet.current_problem_metrics || {}),
      searchSourcesPublic: true,
      schoolLayerHasCampusAddresses: true,
      districtBoundaryLayerHasContacts: false,
    },
    representative_sources: Array.from(new Set([
      ...(packet.representative_sources || []),
      'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/0?f=pjson',
      'https://gisagocss.state.mi.us/arcgis/rest/services/OpenData/michigan_geographic_framework/MapServer/10?f=pjson',
    ])),
    layer_contracts: [
      {
        layer: 'ISD',
        url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/1?f=pjson',
        fields: ['NAME', 'LABEL', 'TYPE', 'ISD', 'ISDCode'],
        missing_required_fields: ['phone', 'website', 'email', 'special_education_contact', 'routing_url'],
      },
      {
        layer: 'School_District',
        url: 'https://gisagocss.state.mi.us/arcgis/rest/services/OpenData/michigan_geographic_framework/MapServer/10?f=pjson',
        fields: ['FIPSCODE', 'NAME', 'LABEL', 'DCODE', 'ISD'],
        missing_required_fields: ['district_website', 'special_education_contact', 'phone', 'routing_url'],
      },
      {
        layer: 'School_Campus',
        url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/0?f=pjson',
        fields: ['COMMONNM', 'OFFICIALNM', 'STREET', 'CITY', 'STATE', 'ZIP', 'COUNTY'],
        missing_required_fields: ['district_website', 'district_special_education_contact', 'isd_routing_contact', 'routing_url'],
      },
    ],
    packet_complete_when: 'Michigan can reopen education only when an official MDE or district/ISD-owned surface preserves district or ISD routing contacts, special-education contacts, or a county-to-ISD/district export contract instead of boundary metadata or school-campus addresses alone.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch221_michigan_app_query_contract_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'michigan',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    search_sources_public: true,
    school_layer_has_campus_addresses: true,
    district_routing_contract_present: false,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 221 Michigan App Query Contract Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: district_or_county_education_routing',
    `- failure_code: ${FAILURE_CODE}`,
    '',
    '## Evidence',
    '',
    `- ${EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Kept Michigan BLOCKED.',
    '- Confirmed the exact public layers queried by the official MDE-linked app.',
    '- Added the school-campus layer to the blocker packet so later passes do not mistake campus addresses for district routing evidence.',
    '- Reconfirmed that no public district or ISD routing contract exists in the exact official app stack.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch221MichiganAppQueryContractRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
