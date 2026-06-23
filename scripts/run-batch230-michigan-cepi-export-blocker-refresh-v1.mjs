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
  batchSummary: path.join(generatedDir, 'batch230_michigan_cepi_export_blocker_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch230-michigan-cepi-export-blocker-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'michigan-california-grade-audit-report-v2.md'),
};

const FAMILY_STATUS = 'blocked_mde_layers_without_local_routing_fields_and_cepi_export_postback_500s';
const FAILURE_CODE = 'official_mde_layers_lack_local_routing_contract_and_cepi_public_dataset_export_500s';
const STATUS_REASON = 'Reviewed 2026-06-23 the official Michigan MDE ISD Plans leaf, the linked ArcGIS app config and public layers, plus the official CEPI Educational Entity Master Public Data Sets page. The MDE-linked ISD and district layers still expose only boundary and identifier fields, and the school-campus layer adds address fields only. CEPI does expose an official Public Data Sets page with ISD District and LEA District export options, but the exact dataset download postback currently returns a server-side "Validation of viewstate MAC failed" error instead of a stable public export. Michigan therefore still lacks a reproducible county-grade education-routing contract.';
const EVIDENCE = 'Reviewed 2026-06-23 the official Michigan MDE Special Education ISD Plans leaf at https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans, the linked ArcGIS app config at https://michigan.maps.arcgis.com/sharing/rest/content/items/438dc453faf749d786e0c6e8be731cfd/data?f=json, and the exact public layers the app queries. The app still only reaches ISD boundaries, district boundaries, and school-campus addresses, with no district website, district special-education contact, ISD routing contact, or county-to-ISD routing fields. A bounded official follow-up on the CEPI Educational Entity Master page at https://cepi.state.mi.us/EEM/PublicDatasets.aspx confirmed that the live page exposes CSV/Excel/XML export options and entity types including ISD District and LEA District, but an exact scripted download postback for those public entity types currently fails with HTTP 500 and the server message "Validation of viewstate MAC failed." So Michigan still has no stable official export or directory contract that preserves local education-routing fields at county grade.';
const NEXT_ACTION = 'hold_blocked_until_official_isd_or_district_contact_directory_or_stable_cepi_export_exists';

const LESSON_HEADING = '### Public ASP.NET Dataset Forms Can Be Real But Still Export-Blocked';
const LESSON_BODY = '*   **Lesson:** If an official public dataset page exposes the right entity types but the exact ASP.NET download postback fails with a server-side viewstate error, treat it as an export blocker, not a scrape-ready feed. Michigan CEPI’s public ISD/LEA dataset page was live, but the exact dataset postback still returned a viewstate MAC failure.';

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
    '- The exact public MDE-linked ArcGIS stack is still fully accounted for and still lacks district websites, district special-education contacts, ISD routing contacts, or county-to-ISD routing fields.',
    '- The exact official CEPI Educational Entity Master datasets page is live and exposes ISD District and LEA District export options, but the bounded public dataset postback currently fails with a server-side viewstate MAC error, so Michigan still lacks a stable official export contract for county-grade education routing.',
  ].join('\n') + '\n';
}

export function generateBatch230MichiganCepiExportBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: STATUS_REASON }
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
          family_status: FAMILY_STATUS,
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed 2026-06-23 the official MDE ISD Plans leaf, the linked ArcGIS app config and public layers, plus the official CEPI Public Data Sets page and its exact dataset postback behavior.',
          sample_count: 7,
          samples: [
            {
              sample_name: 'Michigan MDE ISD Plans',
              source_url: 'https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans',
              final_url: 'https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans',
              verification_status: 'blocked',
              source_type: 'official_guidance_leaf_without_local_directory',
              source_table: 'batch230_michigan_cepi_export_blocker_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live ISD Plans page links the public ArcGIS map but no ISD-by-ISD contact directory or district-owned special-education leaves.',
            },
            {
              sample_name: 'Michigan ArcGIS app config',
              source_url: 'https://michigan.maps.arcgis.com/sharing/rest/content/items/438dc453faf749d786e0c6e8be731cfd/data?f=json',
              final_url: 'https://michigan.maps.arcgis.com/sharing/rest/content/items/438dc453faf749d786e0c6e8be731cfd/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_arcgis_app_config',
              source_table: 'batch230_michigan_cepi_export_blocker_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official app config queries only the ISD boundary layer, school-district boundary layer, and school-campus layer.',
            },
            {
              sample_name: 'Michigan ISD boundary layer',
              source_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/1?f=pjson',
              final_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/1?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_arcgis_isd_boundary_layer',
              source_table: 'batch230_michigan_cepi_export_blocker_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The ISD layer exposes NAME, LABEL, TYPE, ISD, and ISDCode only, with no district or special-education contact fields.',
            },
            {
              sample_name: 'Michigan district boundary layer',
              source_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/OpenData/michigan_geographic_framework/MapServer/10?f=pjson',
              final_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/OpenData/michigan_geographic_framework/MapServer/10?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_arcgis_district_boundary_layer',
              source_table: 'batch230_michigan_cepi_export_blocker_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The district layer exposes FIPSCODE, NAME, LABEL, DCODE, and ISD but no local routing contacts or district website fields.',
            },
            {
              sample_name: 'Michigan school-campus layer',
              source_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/0?f=pjson',
              final_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/0?f=pjson',
              verification_status: 'blocked',
              source_type: 'official_arcgis_school_address_layer',
              source_table: 'batch230_michigan_cepi_export_blocker_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The school layer adds STREET, CITY, STATE, ZIP, LATITUDE, LONGITUDE, and COUNTY for campuses, but no district website, special-education contact, or ISD routing directory.',
            },
            {
              sample_name: 'Michigan CEPI Public Data Sets',
              source_url: 'https://cepi.state.mi.us/EEM/PublicDatasets.aspx',
              final_url: 'https://cepi.state.mi.us/EEM/PublicDatasets.aspx',
              verification_status: 'blocked',
              source_type: 'official_public_dataset_root',
              source_table: 'batch230_michigan_cepi_export_blocker_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live CEPI page exposes CSV/Excel/XML export options and entity types including ISD District and LEA District.',
            },
            {
              sample_name: 'Michigan CEPI dataset postback',
              source_url: 'https://cepi.state.mi.us/EEM/PublicDatasets.aspx',
              final_url: 'https://cepi.state.mi.us/EEM/PublicDatasets.aspx',
              verification_status: 'blocked',
              source_type: 'official_public_dataset_postback_error',
              source_table: 'batch230_michigan_cepi_export_blocker_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded exact postback for ISD District and LEA District currently returns HTTP 500 with the server message \"Validation of viewstate MAC failed.\"',
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
    primary_gap_reason: 'official_mde_layers_lack_local_routing_fields_and_cepi_public_dataset_export_500s',
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
      cepiPublicDatasetsPageLive: true,
      cepiExactDatasetPostbackStable: false,
    },
    representative_sources: Array.from(new Set([
      ...(packet.representative_sources || []),
      'https://cepi.state.mi.us/EEM/PublicDatasets.aspx',
      'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/0?f=pjson',
      'https://gisagocss.state.mi.us/arcgis/rest/services/OpenData/michigan_geographic_framework/MapServer/10?f=pjson',
    ])),
    public_dataset_contract: {
      page: 'https://cepi.state.mi.us/EEM/PublicDatasets.aspx',
      page_live: true,
      entity_types_reviewed: ['ISD District', 'LEA District'],
      export_formats_exposed: ['CSV', 'Excel', 'XML'],
      exact_postback_status: 'http_500_viewstate_mac_failed',
      stable_public_export: false,
    },
    packet_complete_when: 'Michigan can reopen education only when an official MDE or CEPI surface preserves district or ISD routing contacts, district websites, or a stable county-to-ISD/district export contract instead of boundary metadata, school-campus addresses, or a broken dataset postback alone.',
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
    batch: 'batch230_michigan_cepi_export_blocker_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'michigan',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    search_sources_public: true,
    school_layer_has_campus_addresses: true,
    district_routing_contract_present: false,
    cepi_public_datasets_page_live: true,
    cepi_exact_dataset_postback_stable: false,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 230 Michigan CEPI Export Blocker Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- family updated: district_or_county_education_routing',
    '',
    '## What changed',
    '',
    '- Confirmed the exact public MDE-linked ArcGIS stack still stops at ISD boundaries, district boundaries, and school-campus addresses.',
    '- Confirmed an additional exact official source lane exists at CEPI Public Data Sets.',
    '- Confirmed the exact bounded public dataset postback for ISD District and LEA District currently fails with HTTP 500 and the server message `Validation of viewstate MAC failed`.',
    '- Sharpened Michigan’s blocker so future work does not keep treating CEPI as an assumed runnable export.',
    '',
    '## Result',
    '',
    '- Michigan remains BLOCKED and index_safe=false.',
    '- The final blocker is now explicit: no local routing fields in the MDE-linked layers, plus no stable CEPI public dataset export contract yet.',
  ].join('\n') + '\n';

  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch230MichiganCepiExportBlockerRefreshV1();
}
