import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'vermont_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'vermont_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'vermont_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'vermont_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'vermont_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch370_vermont_official_routing_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch370-vermont-official-routing-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'vermont-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'official_ahs_district_jurisdiction_codes_are_public_but_no_reviewable_public_ahs_office_crosswalk_or_service_area_contract_exists';
const COUNTY_FAILURE_CODE =
  'official_ahs_district_jurisdiction_codes_exist_but_public_office_crosswalk_is_unavailable_or_403';
const COUNTY_FAMILY_STATUS =
  'blocked_official_ahs_district_codes_without_public_office_crosswalk';
const COUNTY_NEXT_ACTION =
  'hold_blocked_until_vermont_publishes_public_ahs_district_code_to_office_or_county_service_area_contract';

const EDUCATION_REASON =
  'Reviewed 2026-06-25 the official Vermont Education Dashboard Organization Information dataset on `data.vermont.gov`. The public dataset describes itself as `Organization information from 2004-2025`, its schema exposes `SchoolCity`, `SchoolOrganizationName`, `SchoolAddress`, `SchoolYear`, `SupervisoryUnionOrganizationName`, and `SupervisoryUnionOrganizationIdentifier`, and current 2025 rows publicly map local schools in New Haven, Bristol, Monkton, Ferrisburgh, and Vergennes to named supervisory unions and districts. This replaces Vermont\'s old statewide education fallback with current official district-routing evidence on a Vermont government open-data host.';

const PA_REASON =
  'Reviewed 2026-06-25 the live first-party Disability Rights Vermont homepage. The page states `Advocating for the legal rights of Vermonters with disabilities`, says `Disability Rights Vermont (DRVT) is part of the national Protection and Advocacy (P&A) system`, and explains that DRVT provides information, referrals, advocacy services, and legal representation when appropriate to individuals with disabilities across Vermont. This now supplies direct first-party protection-and-advocacy designation evidence for Vermont.';

const PTI_REASON =
  'Reviewed 2026-06-25 the live first-party Vermont Family Network workshops page and its metadata. The page description states that Vermont Family Network is the `federally designated Parent Training and Information Center`, the Family-to-Family Health Information Center, and a statewide family support organization. This replaces Vermont\'s old inventory-only PTI hint with current first-party designation evidence.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 one more bounded official Vermont county-local pass. The official DCF Vermont Child Care Provider Data dataset on `data.vermont.gov` publicly preserves both `County` and `AHS District` fields, and its field description says `AHS District` is `The three-letter abbreviation for which Agency of Human Services district office jurisdiction the provider\'s town is in.` Sample rows publicly show town-and-county jurisdiction pairs such as Williston / Chittenden / BDO, East Montpelier / Washington / MDO, North Hero / Grand Isle / ADO, and Bethel / Windsor / HDO. But the live AHS root `https://humanservices.vermont.gov/` and the DCF offices page `https://dcf.vermont.gov/contacts/partners/offices` both returned HTTP 403 CloudFront error pages in this pass, and no reviewed public official dataset or page decodes those AHS district abbreviations into office names, addresses, contacts, or county-served assignments. Vermont therefore still lacks a reviewable public county-to-office assignment contract.';

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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Vermont California-Grade Audit Report v2',
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
    ...(failureRows.length ? failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`) : ['- none']),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...(nextRows.length ? nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`) : ['- none']),
    '',
    '## Repair decision',
    '',
    '- Vermont remains BLOCKED and not index-safe.',
    '- `district_or_county_education_routing` now clears because the official Vermont Education Dashboard dataset publicly maps local schools and school cities to named supervisory unions and districts on `data.vermont.gov`.',
    '- `protection_and_advocacy` now clears because Disability Rights Vermont explicitly identifies itself as part of the national Protection and Advocacy system on the live first-party homepage.',
    '- `parent_training_information_center` now clears because Vermont Family Network\'s live first-party page explicitly preserves its federally designated PTI status.',
    '- `county_local_disability_resources` is the only remaining critical blocker. Official Vermont data proves AHS district jurisdiction codes exist, but the reviewed public AHS and DCF office-directory surfaces returned raw HTTP 403 pages and no reviewed public source decodes the district abbreviations into office names, contacts, or county-served assignments.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 370 Vermont Official Routing Repair v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared Vermont education routing, protection and advocacy, and PTI; narrowed county/local disability resources to a single public-crosswalk blocker',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    `- ${PA_REASON}`,
    `- ${PTI_REASON}`,
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch370VermontOfficialRoutingRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: PA_REASON,
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: PTI_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: COUNTY_FAMILY_STATUS,
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'vermont',
      state_code: 'VT',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: COUNTY_FAILURE_CODE,
      evidence: COUNTY_REASON,
      next_action: COUNTY_NEXT_ACTION,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 the live official Vermont Education Dashboard Organization Information dataset and current 2025 rows on data.vermont.gov.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Vermont Education Dashboard Organization Information dataset',
            source_url: 'https://data.vermont.gov/Education/Vermont-Education-Dashboard-Organization-Informati/9uwi-evpg',
            final_url: 'https://data.vermont.gov/Education/Vermont-Education-Dashboard-Organization-Informati/9uwi-evpg',
            verification_status: 'official_verified',
            source_type: 'official_open_data_dataset',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public dataset is named Vermont Education Dashboard: Organization Information and describes itself as organization information from 2004-2025.',
          },
          {
            sample_name: 'Vermont education routing schema fields',
            source_url: 'https://api.us.socrata.com/api/catalog/v1?ids=9uwi-evpg',
            final_url: 'https://api.us.socrata.com/api/catalog/v1?ids=9uwi-evpg',
            verification_status: 'official_verified',
            source_type: 'official_open_data_schema',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed schema exposes SchoolCity, SchoolOrganizationName, SchoolAddress, SchoolYear, SupervisoryUnionOrganizationName, and SupervisoryUnionOrganizationIdentifier.',
          },
          {
            sample_name: 'Vermont 2025 supervisory-union sample rows',
            source_url: 'https://data.vermont.gov/resource/9uwi-evpg.csv?$limit=8',
            final_url: 'https://data.vermont.gov/resource/9uwi-evpg.csv?$limit=8',
            verification_status: 'official_verified',
            source_type: 'official_open_data_rows',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Current 2025 rows map Beeman Elementary School in New Haven, Bristol Elementary School in Bristol, and Monkton Central School in Monkton to MT ABRAHAM UNIFIED SCHOOL DISTRICT.',
          },
          {
            sample_name: 'Vermont Addison Northwest sample rows',
            source_url: 'https://data.vermont.gov/resource/9uwi-evpg.csv?$limit=8',
            final_url: 'https://data.vermont.gov/resource/9uwi-evpg.csv?$limit=8',
            verification_status: 'official_verified',
            source_type: 'official_open_data_rows',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same reviewed rows map Ferrisburgh Central School and Vergennes schools to the named ADDISON NORTHWEST SD district.',
          },
        ],
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 the live first-party Disability Rights Vermont homepage on disabilityrightsvt.org.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Vermont homepage rights statement',
            source_url: 'https://disabilityrightsvt.org/',
            final_url: 'https://disabilityrightsvt.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_homepage',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live homepage headline says Advocating for the legal rights of Vermonters with disabilities.',
          },
          {
            sample_name: 'Disability Rights Vermont P&A designation',
            source_url: 'https://disabilityrightsvt.org/',
            final_url: 'https://disabilityrightsvt.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_designation_statement',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same first-party page states that Disability Rights Vermont is part of the national Protection and Advocacy system.',
          },
          {
            sample_name: 'Disability Rights Vermont statewide scope',
            source_url: 'https://disabilityrightsvt.org/',
            final_url: 'https://disabilityrightsvt.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_scope_statement',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed homepage says DRVT provides information, referrals, and advocacy services to individuals with disabilities across Vermont.',
          },
        ],
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-25 the live first-party Vermont Family Network workshops page and page metadata.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Vermont Family Network PTI designation metadata',
            source_url: 'https://www.vermontfamilynetwork.org/what-we-do/family-support/workshops-consultation/',
            final_url: 'https://www.vermontfamilynetwork.org/what-we-do/family-support/workshops-consultation/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_meta_description',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed page description states that Vermont Family Network is the federally designated Parent Training and Information Center and the Family-to-Family Health Information Center.',
          },
          {
            sample_name: 'Vermont Family Network statewide support scope',
            source_url: 'https://www.vermontfamilynetwork.org/what-we-do/family-support/workshops-consultation/',
            final_url: 'https://www.vermontfamilynetwork.org/what-we-do/family-support/workshops-consultation/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_scope_statement',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same reviewed description calls Vermont Family Network a statewide family support organization for Vermont families of children with special health needs.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: COUNTY_FAMILY_STATUS,
        evidence_strength: 'strong_but_blocked',
        sample_count: 5,
        query_basis: 'Reviewed 2026-06-25 the official Vermont DCF child-care provider open-data dataset plus the live AHS and DCF office-directory surfaces to determine whether a public AHS district-to-office crosswalk exists.',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_REASON,
        samples: [
          {
            sample_name: 'Vermont Child Care Provider Data dataset',
            source_url: 'https://data.vermont.gov/Education/Vermont-Child-Care-Provider-Data/ctdw-tmfz',
            final_url: 'https://data.vermont.gov/Education/Vermont-Child-Care-Provider-Data/ctdw-tmfz',
            verification_status: 'official_verified',
            source_type: 'official_open_data_dataset',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official DCF dataset publicly preserves County and AHS District fields for Vermont provider towns.',
          },
          {
            sample_name: 'AHS District jurisdiction field definition',
            source_url: 'https://api.us.socrata.com/api/catalog/v1?domains=data.vermont.gov&search_context=data.vermont.gov&q=AHS%20District',
            final_url: 'https://api.us.socrata.com/api/catalog/v1?domains=data.vermont.gov&search_context=data.vermont.gov&q=AHS%20District',
            verification_status: 'official_verified',
            source_type: 'official_open_data_field_definition',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed field description says AHS District is the three-letter abbreviation for which Agency of Human Services district office jurisdiction the provider town is in.',
          },
          {
            sample_name: 'Vermont county and AHS district sample rows',
            source_url: 'https://data.vermont.gov/resource/ctdw-tmfz.csv?$select=provider_town,county,ahs_district&$limit=10',
            final_url: 'https://data.vermont.gov/resource/ctdw-tmfz.csv?$select=provider_town,county,ahs_district&$limit=10',
            verification_status: 'official_verified',
            source_type: 'official_open_data_rows',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Reviewed rows show Williston / Chittenden / BDO, East Montpelier / Washington / MDO, North Hero / Grand Isle / ADO, and Bethel / Windsor / HDO.',
          },
          {
            sample_name: 'Agency of Human Services root returns 403',
            source_url: 'https://humanservices.vermont.gov/',
            final_url: 'https://humanservices.vermont.gov/',
            verification_status: 'official_verified',
            source_type: 'official_host_status_check',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live AHS root returned HTTP 403 with a CloudFront error page during the reviewed office-directory pass.',
          },
          {
            sample_name: 'DCF offices page returns 403',
            source_url: 'https://dcf.vermont.gov/contacts/partners/offices',
            final_url: 'https://dcf.vermont.gov/contacts/partners/offices',
            verification_status: 'official_verified',
            source_type: 'official_host_status_check',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed DCF offices page also returned HTTP 403, leaving no public official office-name or county-served crosswalk on the current host family.',
          },
        ],
      };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    batch: 'batch370_vermont_official_routing_repair_v1',
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_new_official_ahs_office_crosswalk',
    critical_gap_families: ['county_local_disability_resources'],
    major_gap_families: [],
    verified_source_families_with_samples: updatedVerifiedRows
      .filter((row) => Number(row.sample_count || 0) > 0)
      .map((row) => row.family),
    complete_ready: false,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT_ACTION,
      },
    ],
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: 'verified_state_grade',
      protection_and_advocacy: 'verified_state_grade',
      parent_training_information_center: 'verified_state_grade',
      county_local_disability_resources: COUNTY_FAMILY_STATUS,
    },
  };

  const updatedNextRows = [
    {
      state: 'vermont',
      state_code: 'VT',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: COUNTY_FAILURE_CODE,
      next_action: COUNTY_NEXT_ACTION,
      evidence: COUNTY_REASON,
    },
  ];

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.batchSummary, {
    state: 'Vermont',
    state_code: 'VT',
    classification: 'BLOCKED',
    index_safe: false,
    repaired_families: [
      'district_or_county_education_routing',
      'protection_and_advocacy',
      'parent_training_information_center',
    ],
    remaining_blocker_family: 'county_local_disability_resources',
    remaining_blocker_code: COUNTY_FAILURE_CODE,
  });
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  return {
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    repaired_families: ['district_or_county_education_routing', 'protection_and_advocacy', 'parent_training_information_center'],
    remaining_blocker_family: 'county_local_disability_resources',
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch370VermontOfficialRoutingRepairV1();
  console.log(JSON.stringify(result, null, 2));
}
