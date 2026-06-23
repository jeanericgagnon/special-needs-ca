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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  packet: path.join(generatedDir, 'michigan_district_or_county_education_routing_arcgis_contract_packet_v1.json'),
  batchSummary: path.join(generatedDir, 'batch191_michigan_arcgis_field_contract_audit_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch191-michigan-arcgis-field-contract-audit-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'michigan-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'official_mde_arcgis_layers_expose_boundaries_and_codes_without_local_contact_contract';
const STATUS_REASON = 'Reviewed 2026-06-23 the official Michigan MDE ISD Plans leaf plus the exact public ArcGIS app item-data and Schools_Districts service layers. The ISD Plans page links only to statewide policy resources and the generic Michigan Schools and Districts ArcGIS app. The app config resolves to public ISD and district boundary services, but the ISD layer exposes only fields like NAME, LABEL, TYPE, ISD, and ISDCode, while the district layers expose NAME, LABEL, DCODE, ISD, FIPSCODE, and boundary metadata only. No phone, website, email, special-education contact, or local routing URL fields are present, so the official stack still lacks a district-or-county routing contract.';
const EVIDENCE = 'Reviewed 2026-06-23 the official Michigan MDE Special Education page, sitemap, ISD Plans leaf, and the exact public ArcGIS contract linked from that leaf. The live ISD Plans page at https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans links only to statewide policy resources at https://training.catamaran.partners/isd-policy-resources/ and the generic Michigan Schools and Districts map at https://michigan.maps.arcgis.com/apps/webappviewer/index.html?id=438dc453faf749d786e0c6e8be731cfd. The public ArcGIS app item data resolves to the Schools_Districts service on gisagocss.state.mi.us, including ISD layer 1 and district layers 2-5. Layer 1 fields are limited to boundary and identifier values such as NAME, LABEL, TYPE, ISD, and ISDCode. District layers 2-5 are likewise limited to NAME, LABEL, DCODE, ISD, FIPSCODE, FIPSNUM, VER, LAYOUT, and PENINSULA. Those public services preserve boundaries and codes, but no phone, website, email, district-owned special-education leaf, or county-to-ISD routing contact fields. A bounded DB check still shows 83 official_verified Michigan school_district fallback rows all reusing the statewide MDE special-education root, so Michigan cannot pass county-grade education routing.';
const NEXT_ACTION = 'use_michigan_arcgis_contract_packet_and_hold_blocked_until_official_isd_or_district_contact_export_exists';

const LESSON_HEADING = '### Boundary Layers Need Routing Fields Before They Count As Local Education Contracts';
const LESSON_BODY = '*   **Lesson:** If a public ArcGIS school map only exposes boundary geometry and identifiers like county codes, district codes, or ISD codes, do not treat it as local education routing proof. Michigan’s MDE-linked layers were useful for proving the exact blocker, but without contact URLs or routing fields they still could not clear district_or_county_education_routing.';

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
    '- The official MDE-linked ArcGIS stack now proves something narrower than before: it preserves public district and ISD boundary identifiers, but still no local contact, district-owned special-education leaf, or county-to-ISD routing contract.',
  ].join('\n') + '\n';
}

export function generateBatch191MichiganArcgisFieldContractAuditV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_mde_arcgis_layers_without_local_contact_contract', status_reason: STATUS_REASON }
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
          family_status: 'blocked_mde_arcgis_layers_without_local_contact_contract',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed 2026-06-23 the official MDE ISD Plans leaf, the linked ArcGIS app item data, the public Schools_Districts service layers, and the bounded DB sample of statewide fallback rows.',
          samples: [
            {
              sample_name: 'Michigan MDE ISD Plans',
              source_url: 'https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans',
              final_url: 'https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans',
              verification_status: 'blocked',
              source_type: 'official_guidance_leaf_without_local_directory',
              source_table: 'batch191_michigan_arcgis_field_contract_audit',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live ISD Plans page links statewide policy resources and the generic Michigan Schools and Districts map, but no ISD-by-ISD contacts or district-owned special-education routing leaves.',
            },
            {
              sample_name: 'Michigan Schools and Districts ArcGIS app data',
              source_url: 'https://michigan.maps.arcgis.com/sharing/rest/content/items/438dc453faf749d786e0c6e8be731cfd/data?f=json',
              final_url: 'https://michigan.maps.arcgis.com/sharing/rest/content/items/438dc453faf749d786e0c6e8be731cfd/data?f=json',
              verification_status: 'blocked',
              source_type: 'official_arcgis_app_config_without_contact_contract',
              source_table: 'batch191_michigan_arcgis_field_contract_audit',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public app config resolves to the Schools_Districts service and shows the exact ISD and district layers used by the MDE-linked map.',
            },
            {
              sample_name: 'Michigan ISD ArcGIS layer',
              source_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/1?f=json',
              final_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/1?f=json',
              verification_status: 'blocked',
              source_type: 'official_arcgis_isd_boundary_layer',
              source_table: 'batch191_michigan_arcgis_field_contract_audit',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public ISD layer exposes only NAME, LABEL, TYPE, ISD, and ISDCode boundary fields with no phone, website, email, or routing URL.',
            },
            {
              sample_name: 'Michigan district ArcGIS layers',
              source_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/2?f=json',
              final_url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/2?f=json',
              verification_status: 'blocked',
              source_type: 'official_arcgis_district_boundary_layers',
              source_table: 'batch191_michigan_arcgis_field_contract_audit',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The district layers expose NAME, LABEL, DCODE, ISD, FIPSCODE, and other boundary metadata only, with no local special-education contact or district website fields.',
            },
          ],
          sample_count: 4,
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

  const packet = {
    state: 'michigan',
    state_code: 'MI',
    family: 'district_or_county_education_routing',
    repair_lane: 'field_contract_audit_only',
    purpose: 'Deterministic packet for Michigan education routing while the live official MDE-linked ArcGIS stack exposes boundaries and identifiers but not local routing contacts.',
    current_problem_metrics: {
      countyRowCount: 83,
      statewideFallbackRows: 83,
      isdLayerHasContacts: false,
      districtLayersHaveContacts: false,
      officialArcgisServicePublic: true,
    },
    representative_sources: [
      'https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans',
      'https://training.catamaran.partners/isd-policy-resources/',
      'https://michigan.maps.arcgis.com/apps/webappviewer/index.html?id=438dc453faf749d786e0c6e8be731cfd',
      'https://michigan.maps.arcgis.com/sharing/rest/content/items/438dc453faf749d786e0c6e8be731cfd/data?f=json',
      'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/1?f=json',
      'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/2?f=json',
      'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/3?f=json',
      'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/4?f=json',
      'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/5?f=json',
    ],
    layer_contracts: [
      {
        layer: 'ISD',
        url: 'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/1?f=json',
        fields: ['NAME', 'LABEL', 'TYPE', 'ISD', 'ISDCode'],
        missing_required_fields: ['phone', 'website', 'email', 'special_education_contact', 'routing_url'],
      },
      {
        layer: 'School_District_*',
        urls: [
          'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/2?f=json',
          'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/3?f=json',
          'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/4?f=json',
          'https://gisagocss.state.mi.us/arcgis/rest/services/CSS/Schools_Districts/MapServer/5?f=json',
        ],
        fields: ['NAME', 'LABEL', 'DCODE', 'ISD', 'FIPSCODE', 'FIPSNUM', 'VER', 'LAYOUT', 'PENINSULA'],
        missing_required_fields: ['district_website', 'special_education_contact', 'phone', 'routing_url'],
      },
    ],
    affected_counties: 'all_83_counties',
    packet_complete_when: 'Michigan can reopen education only when an official MDE or district/ISD-owned surface preserves local routing contacts or a county-to-ISD/district export contract instead of boundary and code fields alone.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.packet, packet);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_191_michigan_arcgis_field_contract_audit_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'michigan',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_family: 'district_or_county_education_routing',
    official_arcgis_service_public: true,
    isd_layer_has_contacts: false,
    district_layers_have_contacts: false,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 191 Michigan ArcGIS Field Contract Audit Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: district_or_county_education_routing',
    `- failure_code: ${FAILURE_CODE}`,
    '',
    '## What was confirmed',
    '',
    '- The live official MDE ISD Plans leaf is real.',
    '- That leaf links a statewide policy-resources page and one generic Michigan Schools and Districts ArcGIS app.',
    '- The public ArcGIS app item-data resolves to exact ISD and district boundary services on `gisagocss.state.mi.us`.',
    '- The ISD layer exposes only identifier fields such as `NAME`, `LABEL`, `TYPE`, `ISD`, and `ISDCode`.',
    '- The district layers expose only identifier and boundary fields such as `NAME`, `LABEL`, `DCODE`, `ISD`, and `FIPSCODE`.',
    '',
    '## Why Michigan stays blocked',
    '',
    `- ${STATUS_REASON}`,
    '',
    '## Completion decision',
    '',
    '- Michigan remains BLOCKED and index_safe=false.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch191MichiganArcgisFieldContractAuditV1();
  console.log(JSON.stringify(result, null, 2));
}
