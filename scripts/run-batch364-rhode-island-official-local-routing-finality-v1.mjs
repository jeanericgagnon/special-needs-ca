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
  'public_ride_directory_exposes_district_inventory_but_zero_public_county_or_special_education_routing_contract';

const EDUCATION_FAILURE_CODE =
  'public_ride_directory_exposes_district_inventory_but_zero_public_county_or_special_education_routing_contract';
const EDUCATION_FAMILY_STATUS =
  'blocked_public_ride_directory_without_public_county_or_special_education_routing_contract';
const EDUCATION_NEXT_ACTION =
  'hold_blocked_until_public_ride_or_district_owned_special_education_surface_exposes_county_or_district_routing';
const EDUCATION_REASON =
  'Reviewed 2026-06-25 bounded first-party Rhode Island education surfaces plus one more live check of the legacy public Master Directory lane. The live RIDE Special Education page remains statewide guidance only and links families to the public school directory stack instead of exposing district-owned special-education leaves. The public School Directory page explicitly says families can use the Search tool, Frequently Requested Lists, and Directory Reports for contact information, then routes into the public Data Center directory. On the public Data Center host, the Schools Directory explicitly says it provides only LEA, school, location, and contact information, while additional directory information is available only to authenticated users in the RIDE portal. The public table and search lanes expose LEA, school, school type, and school subtype, including special-education categories, but no county field and no public district special-education routing contract. The separate RI School Districts page lists 66 LEAs and district websites, but it also exposes no county column and no special-education contact routing. The legacy public Master Directory link exposed from the School Directory page is not a usable replacement proof lane because the reviewed public URL now returns HTTP 503. Rhode Island therefore still lacks a public county-grade or district-owned special-education routing contract.';

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
    '- `county_local_disability_resources` now stays cleared because the public DHS Office Locator exposes city/town-to-home-office assignments on the official host.',
    '- `district_or_county_education_routing` remains the sole critical blocker because public RIDE directory surfaces still inventory districts and special-education school types without exposing a county field, a public district special-education routing contract, or a usable public replacement lane.',
    '- Rhode Island therefore still cannot be marked COMPLETE until an official public local education-routing contract exists.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 364 Rhode Island Official Local Routing Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: preserve Rhode Island as blocked only on the remaining public RIDE education-routing gap and keep county-local routing cleared',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
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
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: EDUCATION_FAMILY_STATUS,
        evidence_strength: 'weak',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 first-party Rhode Island RIDE directory and district-list surfaces plus the legacy public Master Directory link for local education routing evidence.',
        blocker_code: EDUCATION_FAILURE_CODE,
        blocker_evidence: EDUCATION_REASON,
        samples: [
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
            evidence_snippet: 'There are 66 public Local Education Agencies (LEAs) or districts in Rhode Island. These include 32 regular school districts and 4 regional school districts.',
          },
          {
            sample_name: 'Legacy Master Directory link',
            source_url: 'https://www2.ride.ri.gov/Applications/MasterDirectory/Organization_Default.aspx',
            verification_status: 'blocked',
            source_type: 'legacy_public_directory',
            source_table: 'school_districts',
            evidence_snippet: 'The legacy public Master Directory lane linked from the School Directory page now returns HTTP 503 and cannot serve as public district-routing proof.',
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
        evidence: 'Public RIDE directory surfaces expose only LEA, school, location, contact, type, and subtype fields, additional directory detail is authenticated-only, and the legacy Master Directory link is now HTTP 503.',
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
      'https://www2.ride.ri.gov/Applications/MasterDirectory/Organization_Default.aspx',
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
