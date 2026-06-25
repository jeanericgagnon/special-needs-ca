import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'rhode-island_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'rhode-island_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'rhode-island_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'rhode-island_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'rhode-island_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch364_rhode-island_official_local_routing_finality_summary_v1.json'),
  evidence: path.join(generatedDir, 'rhode-island_local_routing_evidence_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch364-rhode-island-official-local-routing-finality-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'rhode-island-california-grade-audit-report-v2.md'),
};

const BATCH_NAME = 'batch364_rhode-island_official_local_routing_finality_v1';
const PRIMARY_GAP_REASON =
  'public_ride_local_special_education_routing_is_partial_and_public_bhddh_dhs_county_service_area_contracts_are_still_missing';

const EDUCATION_FAILURE_CODE =
  'public_ride_local_special_education_routing_is_partial_and_nowell_lacks_direct_public_routing_contact';
const EDUCATION_FAMILY_STATUS =
  'blocked_partial_public_ride_local_routing_with_unresolved_nowell_special_education_gap';
const EDUCATION_NEXT_ACTION =
  'hold_blocked_until_every_public_lea_has_direct_special_education_routing_or_rhode_island_publishes_a_reviewable_local_crosswalk';
const EDUCATION_REASON =
  'Reviewed 2026-06-25 and 2026-06-26 bounded first-party Rhode Island education surfaces. The public RIDE Data Center does expose direct local special-education routing on at least some LEA detail leaves: for example, Barrington lists Kristen Matthes with Title `Director of Special Education` and Role `Special Education Director`. The public RI School Districts page states there are 66 public Local Education Agencies (LEAs) or districts in Rhode Island, so California-grade local routing still requires explicit LEA-by-LEA coverage. International Charter does not expose a special-education role on its public RIDE LEA detail page, but its district-owned Special Education page routes families to Katie Nerstheimer, Student Services Director, at 401-721-0824 ext. 216. Sheila Skip Nowell Leadership Academy remains unresolved in the reviewed public evidence: its public RIDE LEA detail page preserves superintendent, guidance, health, and operations roles, while the district-owned faculty directory only identifies Abigail McClain as `Special Education Teacher` without a direct routing email or phone for special-education intake. Rhode Island therefore still cannot prove complete public LEA-level special-education routing coverage.';

const COUNTY_FAILURE_CODE =
  'public_dhs_office_stack_exposes_office_leaves_but_zero_county_or_service_area_contract';
const COUNTY_FAMILY_STATUS =
  'blocked_public_dhs_office_stack_without_county_or_service_area_contract';
const COUNTY_NEXT_ACTION =
  'hold_blocked_until_public_dhs_surface_exposes_county_to_office_or_service_area_routing';
const COUNTY_REASON =
  'Reviewed 2026-06-25 and 2026-06-26 bounded first-party Rhode Island human-services surfaces. The official BHDDH DD Service Provider page says there are many DD service providers adults with I/DD can choose from and that the table lists provider contact information and the services they offer. The linked licensed-provider and detailed-provider list PDFs likewise expose provider names, addresses, phone numbers, and offered services rather than served county, municipality, region, or service-area contract fields. The DHS Offices page describes the public locations as regional offices serving Rhode Islanders throughout our State, and the public Office Locator Tool lists municipalities and Providence ZIP buckets families can choose before clicking Apply. But the reviewed public DHS lane still does not preserve a citable county-to-office assignment table or municipality-to-disability-routing contract, and the public BHDDH provider lane still does not expose county-served or service-area fields. Rhode Island therefore still lacks a truthful public county-to-office, county-to-provider, or county-to-service-area contract on the official BHDDH/DHS host families.';

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
    '# Rhode Island California-Grade Audit Report v2',
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
    '- Rhode Island remains BLOCKED and not index-safe.',
    '- `district_or_county_education_routing` is blocked on a narrower first-party truth: public RIDE and district-owned pages preserve direct local special-education routing for some reviewed LEAs, but reviewed public evidence still leaves Sheila Skip Nowell Leadership Academy without a direct special-education routing contact and does not yet prove complete LEA-level coverage.',
    '- `county_local_disability_resources` is blocked because official BHDDH/DHS public lanes preserve provider inventories, office inventories, and a city-town picker, but they still do not preserve a county-to-office, county-to-provider, or service-area routing contract.',
    '- Rhode Island therefore still cannot be marked COMPLETE until both local families have fully reviewable public coverage.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 364 Rhode Island Official Local Routing Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: replaced Rhode Island’s generic local-routing blocker with narrower first-party RIDE, BHDDH, and DHS evidence',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

function buildEvidenceArtifact() {
  return {
    state: 'rhode-island',
    generated_at: '2026-06-26',
    education: {
      expected_public_lea_count: 66,
      reviewed_entities: [
        {
          entity: 'Barrington',
          source_url: 'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=43',
          authority: 'Rhode Island Department of Elementary and Secondary Education',
          review_date: '2026-06-26',
          finding: 'direct_local_special_education_contact_present',
          evidence_excerpt: 'Kristen Matthes Title: Director of Special Education Role(s): Special Education Director',
        },
        {
          entity: 'International Charter',
          source_url: 'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=62',
          authority: 'Rhode Island Department of Elementary and Secondary Education',
          review_date: '2026-06-26',
          finding: 'ride_leaf_lacks_special_education_role',
          evidence_excerpt: 'The public LEA detail lists superintendent, business, technology, liaison, and nurse contacts, but no Special Education Director role.',
        },
        {
          entity: 'International Charter',
          source_url: 'https://internationalcharterschool.org/special-education/',
          authority: 'International Charter School',
          review_date: '2026-06-26',
          finding: 'district_owned_special_education_routing_present',
          evidence_excerpt: 'Contact Katie Nerstheimer, Student Services Director, at 401-721-0824, ext. 216 for more information.',
        },
        {
          entity: 'Sheila Skip Nowell Leadership Academy',
          source_url: 'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=2856',
          authority: 'Rhode Island Department of Elementary and Secondary Education',
          review_date: '2026-06-26',
          finding: 'ride_leaf_lacks_special_education_routing',
          evidence_excerpt: 'The public LEA detail preserves superintendent, guidance, data, and health roles, but no special-education routing role.',
        },
        {
          entity: 'Sheila Skip Nowell Leadership Academy',
          source_url: 'https://www.nowellacademy.org/faculty-staff-',
          authority: 'Nowell Leadership Academy',
          review_date: '2026-06-26',
          finding: 'district_owned_staff_page_names_special_education_teacher_but_not_routing_contact',
          evidence_excerpt: 'Abigail McClain ## Special Education Teacher',
        },
      ],
      blocker_summary: 'Public Rhode Island education routing is partially reviewable but still not complete: at least one reviewed public LEA, Sheila Skip Nowell Leadership Academy, lacks a direct public special-education routing contact, and no exhaustive public LEA-by-LEA routing artifact is preserved here.',
    },
    county_local: {
      reviewed_sources: [
        {
          source_url: 'https://dhs.ri.gov/office-locator-tool',
          authority: 'Rhode Island Department of Human Services',
          review_date: '2026-06-26',
          finding: 'municipality_picker_present_without_cited_assignment_contract',
          evidence_excerpt: 'City/Town (Select value below and click Apply) ... Select any filter and click on Apply to see results',
        },
        {
          source_url: 'https://dhs.ri.gov/about-us/dhs-offices',
          authority: 'Rhode Island Department of Human Services',
          review_date: '2026-06-26',
          finding: 'regional_office_inventory_present',
          evidence_excerpt: 'See below for more information about the DHS Call Center and the DHS regional offices serving Rhode Islanders throughout our State.',
        },
        {
          source_url: 'https://bhddh.ri.gov/developmental-disabilities/services-adults/licensed-provider-lists',
          authority: 'Rhode Island Dept. of Behavioral Healthcare, Developmental Disabilities, and Hospitals',
          review_date: '2026-06-26',
          finding: 'provider_pdf_downloads_present_without_service_area_fields',
          evidence_excerpt: 'For a printable list of providers, review the licensed DD service provider document (PDF) or detailed provider list table (PDF).',
        },
        {
          source_url: 'https://bhddh.ri.gov/dd-service-provider-list',
          authority: 'Rhode Island Dept. of Behavioral Healthcare, Developmental Disabilities, and Hospitals',
          review_date: '2026-06-26',
          finding: 'provider_directory_lists_services_not_county_assignments',
          evidence_excerpt: 'The table lists provider contact information and the services they offer.',
        },
      ],
      blocker_summary: 'Reviewed official BHDDH and DHS public lanes still do not preserve a county-to-office, county-to-provider, municipality-to-office, or service-area routing contract suitable for California-grade local disability routing.',
    },
  };
}

export function generateBatch364RhodeIslandOfficialLocalRoutingFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

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
        family_status: COUNTY_FAMILY_STATUS,
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: EDUCATION_FAILURE_CODE,
        evidence: EDUCATION_REASON,
        next_action: EDUCATION_NEXT_ACTION,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT_ACTION,
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: EDUCATION_FAMILY_STATUS,
        evidence_strength: 'weak',
        sample_count: 5,
        query_basis: 'Reviewed 2026-06-25 and 2026-06-26 first-party Rhode Island RIDE LEA detail leaves plus district-owned special-education pages for public local education routing evidence.',
        blocker_code: EDUCATION_FAILURE_CODE,
        blocker_evidence: EDUCATION_REASON,
        samples: [
          {
            sample_name: 'RIDE Barrington LEA detail',
            source_url: 'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=43',
            verification_status: 'official_verified',
            source_type: 'official_lea_detail',
            source_table: 'school_districts',
            evidence_snippet: 'Kristen Matthes Title: Director of Special Education Role(s): Special Education Director.',
          },
          {
            sample_name: 'RI School Districts',
            source_url: 'https://ride.ri.gov/students-families/ri-public-schools/school-districts',
            verification_status: 'official_verified',
            source_type: 'official_district_inventory',
            source_table: 'school_districts',
            evidence_snippet: 'There are 66 public Local Education Agencies (LEAs) or districts in Rhode Island. These include 32 regular school districts and 4 regional school districts.',
          },
          {
            sample_name: 'RIDE International Charter LEA detail',
            source_url: 'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=62',
            verification_status: 'official_verified',
            source_type: 'official_lea_detail',
            source_table: 'school_districts',
            evidence_snippet: 'The public LEA detail lists superintendent, business, technology, liaison, and nurse contacts, but no Special Education Director role.',
          },
          {
            sample_name: 'International Charter Special Education page',
            source_url: 'https://internationalcharterschool.org/special-education/',
            verification_status: 'official_verified',
            source_type: 'district_owned_special_education_page',
            source_table: 'school_districts',
            evidence_snippet: 'Contact Katie Nerstheimer, Student Services Director, at 401-721-0824, ext. 216 for more information.',
          },
          {
            sample_name: 'Nowell faculty directory',
            source_url: 'https://www.nowellacademy.org/faculty-staff-',
            verification_status: 'official_verified',
            source_type: 'district_owned_staff_directory',
            source_table: 'school_districts',
            evidence_snippet: 'Abigail McClain ## Special Education Teacher, but the reviewed staff page preserves no direct special-education intake email or phone.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: COUNTY_FAMILY_STATUS,
        evidence_strength: 'weak',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 and 2026-06-26 first-party Rhode Island BHDDH provider and DHS office surfaces for public county-local routing evidence.',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_REASON,
        samples: [
          {
            sample_name: 'BHDDH DD Service Provider page',
            source_url: 'https://bhddh.ri.gov/dd-service-provider-list',
            verification_status: 'official_verified',
            source_type: 'official_provider_directory',
            source_table: 'county_offices',
            evidence_snippet: 'There are many DD service providers adults with I/DD can choose from, and the table lists provider contact information and the services they offer.',
          },
          {
            sample_name: 'RI DHS Office Locator Tool',
            source_url: 'https://dhs.ri.gov/office-locator-tool',
            verification_status: 'official_verified',
            source_type: 'official_locator_tool',
            source_table: 'county_offices',
            evidence_snippet: 'City/Town (Select value below and click Apply) ... Select any filter and click on Apply to see results.',
          },
          {
            sample_name: 'BHDDH Licensed Provider Lists page',
            source_url: 'https://bhddh.ri.gov/developmental-disabilities/services-adults/licensed-provider-lists',
            verification_status: 'official_verified',
            source_type: 'official_provider_download_page',
            source_table: 'county_offices',
            evidence_snippet: 'For a printable list of providers, review the licensed DD service provider document (PDF) or detailed provider list table (PDF).',
          },
          {
            sample_name: 'RI DHS Offices',
            source_url: 'https://dhs.ri.gov/about-us/dhs-offices',
            verification_status: 'official_verified',
            source_type: 'official_office_inventory',
            source_table: 'county_offices',
            evidence_snippet: 'The DHS regional offices serving Rhode Islanders throughout our State.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: EDUCATION_FAILURE_CODE,
        next_action: EDUCATION_NEXT_ACTION,
        evidence: 'Public RIDE local routing is only partially reviewable: some LEA detail leaves expose direct special-education contacts and International Charter has a district-owned special-education route, but Sheila Skip Nowell Leadership Academy still lacks a reviewed direct public special-education routing contact and complete LEA coverage remains unproven.',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: COUNTY_FAILURE_CODE,
        next_action: COUNTY_NEXT_ACTION,
        evidence: 'Official BHDDH provider and DHS office surfaces inventory provider contacts, services, addresses, and office hours for Middletown, Providence, Pawtucket, South County, Warwick, and Woonsocket, but no public county-served, municipality-served, or service-area fields are exposed.',
      };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: EDUCATION_FAILURE_CODE,
        evidence: EDUCATION_REASON,
        next_action: EDUCATION_NEXT_ACTION,
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT_ACTION,
      },
    ],
  };

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'rhode-island',
    generated_at: '2026-06-25',
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: updatedSummary.final_blockers,
    official_evidence_reviewed: [
      'https://ride.ri.gov/students-families/special-education',
      'https://ride.ri.gov/students-families/ri-public-schools/school-districts',
      'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=43',
      'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=62',
      'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=2856',
      'https://internationalcharterschool.org/special-education/',
      'https://www.nowellacademy.org/faculty-staff-',
      'https://dhs.ri.gov/about-us/dhs-offices',
      'https://dhs.ri.gov/office-locator-tool',
      'https://bhddh.ri.gov/developmental-disabilities/services-adults/licensed-provider-lists',
      'https://bhddh.ri.gov/dd-service-provider-list',
    ],
  };

  writeJson(OUTPUTS.evidence, buildEvidenceArtifact());
  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  return {
    updatedSummary,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch364RhodeIslandOfficialLocalRoutingFinalityV1();
  console.log('Generated Rhode Island official local routing finality artifacts.');
}
