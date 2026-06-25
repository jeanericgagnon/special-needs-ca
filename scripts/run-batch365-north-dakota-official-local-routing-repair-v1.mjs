import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'north-dakota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'north-dakota_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'north-dakota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'north-dakota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'north-dakota_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch365_north-dakota_official_local_routing_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch365-north-dakota-official-local-routing-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'north-dakota-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'public_dpi_surfaces_expose_statewide_special_education_and_district_inventory_but_zero_public_county_or_district_special_education_routing_contract';

const EDUCATION_FAILURE_CODE =
  'public_dpi_special_education_and_district_inventory_expose_no_public_county_or_district_special_education_routing_contract';
const EDUCATION_FAMILY_STATUS =
  'blocked_public_dpi_without_public_county_or_district_special_education_routing_contract';
const EDUCATION_NEXT_ACTION =
  'hold_blocked_until_public_dpi_or_district_owned_special_education_surface_exposes_county_or_district_routing';
const EDUCATION_REASON =
  'Reviewed 2026-06-25 bounded first-party North Dakota education surfaces. The live NDDPI Special Education page remains a statewide IDEA guidance hub with dispute-resolution manuals, forms, and transition resources, but it does not publish a county-to-district crosswalk, district-owned special-education contacts, or a district special-education routing directory for families. The live NDDPI List of Districts with NCES Categories page is a public district inventory for teacher-loan-forgiveness eligibility and links a district NCES PDF, but the published page still exposes no county field and no special-education routing contract. North Dakota therefore still lacks a public county-grade or district-owned special-education routing contract on the official DPI host family.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 bounded first-party North Dakota HHS Human Service Zone surfaces. The official Human Service Zones page explicitly states that human service zones have local offices in each county, publishes a county-coded statewide map, and then provides Human Service Zone Information by County with county-by-county links. The same official page tells families to select a county to view local office locations, hours, contact information, and the host county responsible for administrative functions. A reviewed Buffalo Bridges Human Service Zone detail page then preserves explicit county membership and office routing: it says `Serving Barnes and Stutsman counties` and lists separate Barnes County and Stutsman County office addresses, phone numbers, hours, and the host-county label. This replaces the old DOI mirror fallback with current first-party county-to-zone routing evidence on the official HHS host family.';

const LEGAL_AID_REASON =
  'Reviewed 2026-06-25 the live first-party Legal Services of North Dakota site. The homepage identifies Legal Services of North Dakota as a non-profit organization providing legal assistance to low income and elderly North Dakotans, and it further states that LSND is a Legal Services Corporation grantee that provides free legal assistance to low-income or elderly individuals. This is current first-party statewide legal-aid scope evidence on the organization\'s own domain.';

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
    '# North Dakota Blocker Packets v3',
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
    '- North Dakota remains `BLOCKED` and `index_safe=false`.',
    '- `county_local_disability_resources` is now cleared with official HHS Human Service Zone county routing and zone detail pages on the live state host.',
    '- `legal_aid` is now cleared with current first-party Legal Services of North Dakota statewide legal-aid scope evidence.',
    '- `district_or_county_education_routing` is the sole remaining critical blocker because the live DPI public surfaces still expose only statewide special-education guidance and district inventory rather than county-grade or district-owned special-education routing contracts.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 365 North Dakota Official Local Routing Repair v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared North Dakota county-local disability resources and legal aid with live first-party evidence and narrowed the remaining education blocker to the official DPI public surfaces',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
    `- ${LEGAL_AID_REASON}`,
    `- ${EDUCATION_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch365NorthDakotaOfficialLocalRoutingRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedSummary = {
    ...summary,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: ['district_or_county_education_routing'],
    major_gap_families: [],
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: EDUCATION_FAILURE_CODE,
        evidence: EDUCATION_REASON,
        next_action: EDUCATION_NEXT_ACTION,
      },
    ],
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: EDUCATION_FAMILY_STATUS,
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed official North Dakota HHS Human Service Zone county routing and zone detail pages now provide first-party county-to-local-office evidence',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Legal Services of North Dakota evidence now preserves statewide legal-aid scope on the live organization domain',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => row.family === 'district_or_county_education_routing')
    .map((row) => ({
      ...row,
      failure_code: EDUCATION_FAILURE_CODE,
      evidence: EDUCATION_REASON,
      next_action: EDUCATION_NEXT_ACTION,
    }));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: EDUCATION_FAMILY_STATUS,
        evidence_strength: 'weak',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 first-party North Dakota DPI special-education and district-inventory surfaces for public local education routing evidence.',
        blocker_code: EDUCATION_FAILURE_CODE,
        blocker_evidence: EDUCATION_REASON,
        samples: [
          {
            sample_name: 'NDDPI Special Education',
            source_url: 'https://www.nd.gov/dpi/education-programs/special-education',
            final_url: 'https://www.nd.gov/dpi/education-programs/special-education',
            verification_status: 'official_verified',
            source_type: 'official_special_education_hub',
            source_table: 'school_districts',
            evidence_snippet: 'NDDPI provides oversight of the special education programs within North Dakota and designs and implements IDEA policies and procedures.',
          },
          {
            sample_name: 'List of Districts with NCES Categories',
            source_url: 'https://www.nd.gov/dpi/list-districts-nces-categories',
            final_url: 'https://www.nd.gov/dpi/list-districts-nces-categories',
            verification_status: 'official_verified',
            source_type: 'official_district_inventory',
            source_table: 'school_districts',
            evidence_snippet: 'The public page is a district inventory for district-approved positions and NCES categories, but it exposes no county field or special-education routing contract.',
          },
          {
            sample_name: 'North Dakota School Districts and NCES Critical Need and Shortage Areas PDF link',
            source_url: 'https://www.nd.gov/dpi/sites/www/files/documents/SAO/TSLFP/NCES%20List%20for%20Website.pdf',
            final_url: 'https://www.nd.gov/dpi/sites/www/files/documents/SAO/TSLFP/NCES%20List%20for%20Website.pdf',
            verification_status: 'official_verified',
            source_type: 'official_pdf_inventory_link',
            source_table: 'school_districts',
            evidence_snippet: 'The public DPI page links a district NCES PDF, reinforcing district inventory publication without adding county-grade special-education routing proof.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 first-party North Dakota HHS Human Service Zones county-routing root and a live zone detail page.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'North Dakota Human Service Zones',
            source_url: 'https://www.hhs.nd.gov/service-locations/human-service/zones',
            final_url: 'https://www.hhs.nd.gov/service-locations/human-service/zones',
            verification_status: 'official_verified',
            source_type: 'official_county_routing_root',
            source_table: 'county_offices',
            evidence_snippet: 'Human service zones have local offices in each county.',
          },
          {
            sample_name: 'Human Service Zone Information by County',
            source_url: 'https://www.hhs.nd.gov/service-locations/human-service/zones',
            final_url: 'https://www.hhs.nd.gov/service-locations/human-service/zones',
            verification_status: 'official_verified',
            source_type: 'official_county_to_zone_contract',
            source_table: 'county_offices',
            evidence_snippet: 'Select the county below to view human service zone information for your area. Each county page lists office locations, hours, contact information and identifies the host county responsible for administrative functions.',
          },
          {
            sample_name: 'Barnes County to Buffalo Bridges mapping',
            source_url: 'https://www.hhs.nd.gov/service-locations/human-service/zones',
            final_url: 'https://www.hhs.nd.gov/service-locations/human-service/zones',
            verification_status: 'official_verified',
            source_type: 'official_county_linked_zone_mapping',
            source_table: 'county_offices',
            evidence_snippet: 'The county-by-county list links Barnes to Buffalo Bridges Human Service Zone and publishes the statewide county-to-zone mapping directly on the official page.',
          },
          {
            sample_name: 'Buffalo Bridges Human Service Zone',
            source_url: 'https://www.hhs.nd.gov/service-locations/human-service/zones/buffalo-bridges',
            final_url: 'https://www.hhs.nd.gov/service-locations/human-service/zones/buffalo-bridges',
            verification_status: 'official_verified',
            source_type: 'official_zone_detail_page',
            source_table: 'county_offices',
            evidence_snippet: 'Serving Barnes and Stutsman counties. The page then lists separate Barnes County and Stutsman County office addresses, phone numbers, hours, and the host-county label.',
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-25 first-party Legal Services of North Dakota homepage evidence for statewide legal-aid scope.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Legal Services of North Dakota',
            source_url: 'https://lsnd.org/',
            final_url: 'https://lsnd.org/',
            verification_status: 'official_verified',
            source_type: 'first_party_statewide_legal_aid',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Legal Services of North Dakota is a non-profit organization, providing legal assistance in a variety of matters to low income and elderly North Dakotans.',
          },
          {
            sample_name: 'LSND LSC grantee statement',
            source_url: 'https://lsnd.org/',
            final_url: 'https://lsnd.org/',
            verification_status: 'official_verified',
            source_type: 'first_party_statewide_legal_aid_scope',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Legal Services of North Dakota is a grantee of the Legal Services Corporation and provides free legal assistance to low-income or elderly individuals.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = [
    {
      state: 'north-dakota',
      state_code: 'ND',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: EDUCATION_FAILURE_CODE,
      next_action: EDUCATION_NEXT_ACTION,
      evidence: 'Official DPI public surfaces still stop at statewide special-education guidance and district inventory without county-grade or district-owned special-education routing proof.',
    },
  ];

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);

  writeJson(OUTPUTS.batchSummary, {
    state: 'north-dakota',
    batch: 'batch365_north-dakota_official_local_routing_repair_v1',
    classification: 'BLOCKED',
    index_safe: false,
    cleared_families: ['county_local_disability_resources', 'legal_aid'],
    remaining_blockers: ['district_or_county_education_routing'],
    evidence: {
      county_local_disability_resources: COUNTY_REASON,
      legal_aid: LEGAL_AID_REASON,
      district_or_county_education_routing: EDUCATION_REASON,
    },
  });
  fs.mkdirSync(path.dirname(OUTPUTS.batchReport), { recursive: true });
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
}

generateBatch365NorthDakotaOfficialLocalRoutingRepairV1();
