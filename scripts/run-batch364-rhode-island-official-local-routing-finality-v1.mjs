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
  batchReport: path.join(docsGeneratedDir, 'batch364-rhode-island-official-local-routing-finality-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'rhode-island-california-grade-audit-report-v2.md'),
};

const BATCH_NAME = 'batch364_rhode-island_official_local_routing_finality_v1';
const PRIMARY_GAP_REASON =
  'public_ride_directory_and_public_dhs_office_stack_expose_local_entities_but_zero_public_county_or_special_education_service_area_contracts';

const EDUCATION_FAILURE_CODE =
  'public_ride_directory_exposes_district_inventory_but_zero_public_county_or_special_education_routing_contract';
const EDUCATION_FAMILY_STATUS =
  'blocked_public_ride_directory_without_public_county_or_special_education_routing_contract';
const EDUCATION_NEXT_ACTION =
  'hold_blocked_until_public_ride_or_district_owned_special_education_surface_exposes_county_or_district_routing';
const EDUCATION_REASON =
  'Reviewed 2026-06-25 and 2026-06-26 bounded first-party Rhode Island education surfaces. The live RIDE Special Education page remains statewide guidance and strategic-plan content only and links families into statewide navigation instead of exposing district-owned special-education leaves. The public School Directory page explicitly says families can use the Search tool, Frequently Requested Lists, and Directory Reports for contact information, then routes into the public Data Center directory. On the public Data Center host, the Schools Directory explicitly says it provides only LEA, school, location, and contact information, while additional directory information is available only to authenticated users in the RIDE portal. The public table and search lanes expose LEA, school, school type, and school subtype, including special-education categories, but no county field, no municipality-to-special-education assignment contract, and no public district special-education routing contract. The separate RI School Districts page lists 66 LEAs, including 32 regular school districts and 4 regional school districts, and routes families to district websites, but it also exposes no county column and no special-education contact routing. Rhode Island therefore still lacks a public county-grade or district-owned special-education routing contract.';

const COUNTY_FAILURE_CODE =
  'public_dhs_office_stack_exposes_office_leaves_but_zero_county_or_service_area_contract';
const COUNTY_FAMILY_STATUS =
  'blocked_public_dhs_office_stack_without_county_or_service_area_contract';
const COUNTY_NEXT_ACTION =
  'hold_blocked_until_public_dhs_surface_exposes_county_to_office_or_service_area_routing';
const COUNTY_REASON =
  'Reviewed 2026-06-25 and 2026-06-26 bounded first-party Rhode Island human-services surfaces. The official BHDDH DD Service Provider page says there are many DD service providers adults with I/DD can choose from and that the table lists provider contact information and the services they offer. The linked printable provider lists likewise expose provider names, addresses, and offered services rather than served county, municipality, region, or service-area contract fields. The DHS host publicly exposes a DHS Offices page plus office leaves for Middletown, Providence, Pawtucket, South County, Warwick, and Woonsocket. The DHS Offices page describes these as regional offices serving Rhode Islanders throughout our State and lists addresses, directions, drop-box notes, and office hours. The individual location pages preserve titles, street addresses, office hours, and map links. But none of the reviewed official BHDDH or DHS surfaces expose county-served labels, county fields, service-area fields, a county-to-office routing contract, or a county-to-provider service contract. Even the `South County` label is still only an office name on the public leaf, not an explicit county-assignment table. Rhode Island therefore still lacks a truthful public county-to-office, county-to-provider, or county-to-service-area contract on the official BHDDH/DHS host families.';

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
    '- `district_or_county_education_routing` is now blocked on a narrower first-party truth: public RIDE directory surfaces inventory districts and special-education school types, but the public lanes still expose no county field and no public district special-education routing contract.',
    '- `county_local_disability_resources` is now blocked on a narrower first-party truth: official BHDDH/DHS host families expose provider and office inventories, but the public lanes still expose no county-served or service-area contract.',
    '- Rhode Island therefore still cannot be marked COMPLETE until official public local-routing contracts exist for both education and county-local disability resources.',
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
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 and 2026-06-26 first-party Rhode Island RIDE special-education, directory, and district-list surfaces for public local education routing evidence.',
        blocker_code: EDUCATION_FAILURE_CODE,
        blocker_evidence: EDUCATION_REASON,
        samples: [
          {
            sample_name: 'RIDE Special Education page',
            source_url: 'https://ride.ri.gov/students-families/special-education',
            verification_status: 'official_verified',
            source_type: 'official_program_page',
            source_table: 'school_districts',
            evidence_snippet: 'The public page remains statewide special-education guidance and strategic-plan content rather than a district-level local routing directory.',
          },
          {
            sample_name: 'RI School Directory',
            source_url: 'https://ride.ri.gov/students-families/ri-public-schools/school-directory',
            verification_status: 'official_verified',
            source_type: 'official_directory_root',
            source_table: 'school_districts',
            evidence_snippet: 'Use the Search tool or the Frequently Requested Lists to create a table with contact information. Use the Directory Reports to download information as a PDF file or Excel spreadsheet.',
          },
          {
            sample_name: 'RIDE Data Center Schools Directory',
            source_url: 'https://datacenter.ride.ri.gov/Directory',
            verification_status: 'official_verified',
            source_type: 'official_directory_application',
            source_table: 'school_districts',
            evidence_snippet: 'The RIDE Schools Directory provides LEA, school, location and contact information for RIDE schools. Additional directory information is available to authenticated users.',
          },
          {
            sample_name: 'RI School Districts',
            source_url: 'https://ride.ri.gov/students-families/ri-public-schools/school-districts',
            verification_status: 'official_verified',
            source_type: 'official_district_inventory',
            source_table: 'school_districts',
            evidence_snippet: 'There are 66 public Local Education Agencies (LEAs) or districts in Rhode Island. These include 32 regular school districts and 4 regional school districts, and the page routes families to district websites rather than district special-education contacts.',
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
            sample_name: 'RI DHS Offices',
            source_url: 'https://dhs.ri.gov/about-us/dhs-offices',
            verification_status: 'official_verified',
            source_type: 'official_office_inventory',
            source_table: 'county_offices',
            evidence_snippet: 'See below for more information about the DHS Call Center and the DHS regional offices serving Rhode Islanders throughout our State.',
          },
          {
            sample_name: 'BHDDH Licensed Provider Lists page',
            source_url: 'https://bhddh.ri.gov/developmental-disabilities/services-adults/licensed-provider-lists',
            verification_status: 'official_verified',
            source_type: 'official_provider_download_page',
            source_table: 'county_offices',
            evidence_snippet: 'The printable provider lists expose provider names, addresses, and offered services rather than county-served or service-area fields.',
          },
          {
            sample_name: 'DHS South County Office',
            source_url: 'https://dhs.ri.gov/locations/dhs-south-county-office',
            verification_status: 'official_verified',
            source_type: 'official_office_leaf',
            source_table: 'county_offices',
            evidence_snippet: 'The public office leaf preserves the office title, address, office hours, and directions, but no county-served or service-area field.',
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
        evidence: 'Public RIDE special-education, directory, and district-list surfaces expose only statewide guidance plus LEA, school, location, contact, type, and subtype fields, while additional directory detail is authenticated-only and no public county or district special-education routing contract is exposed.',
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
      'https://ride.ri.gov/students-families/ri-public-schools/school-directory',
      'https://ride.ri.gov/students-families/ri-public-schools/school-districts',
      'https://datacenter.ride.ri.gov/Directory',
      'https://dhs.ri.gov/about-us/dhs-offices',
      'https://dhs.ri.gov/sitemap.xml',
      'https://dhs.ri.gov/locations/dhs-middletown-office',
      'https://dhs.ri.gov/locations/dhs-providence-office-125-holden-street',
      'https://dhs.ri.gov/locations/dhs-pawtucket-office',
      'https://dhs.ri.gov/locations/dhs-south-county-office',
      'https://dhs.ri.gov/locations/dhs-warwick-office',
      'https://dhs.ri.gov/locations/dhs-woonsocket-office',
    ],
  };

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
