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
const PRIMARY_GAP_REASON = 'all_critical_families_verified';
const EDUCATION_FAMILY_STATUS = 'verified_state_grade';
const EDUCATION_REASON =
  'Reviewed 2026-06-26 bounded first-party Rhode Island education surfaces and upgraded the remaining local-routing lane from blocked to verified. The preserved district-specific pages and public LEA detail pages now supply explicit local-routing coverage across all 5 Rhode Island counties. The public RIDE Data Center LEA detail host preserves named local special-education routing contacts on live public LEA pages, including East Providence (`Director of Pupil Personnel Services`, `Assistant Director of Special Education`), Warwick (`Interim Director of Special Education`, multiple `Assistant Director of Special Education` contacts), Rhode Island School for the Deaf (`Special Education Administrator`), and the RI Department of Corrections Education Unit (`Principal/Special Education Director`). The remaining nontraditional public LEAs that did not expose enough role detail on the LEA host now clear through exact first-party leaves on their own hosts: Highlander publishes a live `Special Education` page covering referral, IEP, 504, and procedural safeguards; International Charter publishes a live `Special Education` page with a named `Student Services Director`, special-education team, and 504 contact; and the public Nowell Student & Family Handbook names a `Special Education Administrator` with direct contact information. The residual NCES Code 0 rows without true public-LEA routing contracts are Catholic/private, preschool, higher-education, or out-of-state placement inventory placeholders rather than required Rhode Island public local-routing entities, so they do not block California-grade local education routing.';

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
    '## Completion decision',
    '',
    '- Rhode Island is now COMPLETE and index-safe.',
    '- `district_or_county_education_routing` clears through a reviewed mix of public RIDE LEA detail pages and exact district-owned / first-party special-education leaves.',
    '- Blank NCES Code 0 inventory rows that only represent Catholic/private, preschool, higher-education, or out-of-state placement placeholders do not count as Rhode Island public LEA routing entities and do not block completion.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 364 Rhode Island Official Local Routing Finality v1',
    '',
    '- classification: COMPLETE',
    '- index_safe: true',
    '- change: clear the remaining Rhode Island public local education-routing blocker with reviewed public RIDE LEA detail evidence plus exact district-owned / first-party special-education leaves',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch364RhodeIslandOfficialLocalRoutingFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

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

  const updatedFailureRows = [];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: EDUCATION_FAMILY_STATUS,
        evidence_strength: 'strong',
        sample_count: 7,
        query_basis: 'Reviewed 2026-06-26 district-specific pages and first-party Rhode Island RIDE LEA detail pages covering all 5 Rhode Island counties, plus exact district-owned and first-party charter / collaborative special-education leaves for the residual local-routing entities.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'East Providence LEA detail',
            source_url: 'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=57',
            verification_status: 'official_verified',
            source_type: 'official_local_education_detail',
            source_table: 'school_districts',
            evidence_snippet: 'Public LEA detail preserves `Director of Pupil Personnel Services` and `Assistant Director of Special Education` on the live East Providence district detail page.',
          },
          {
            sample_name: 'Warwick LEA detail',
            source_url: 'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=88',
            verification_status: 'official_verified',
            source_type: 'official_local_education_detail',
            source_table: 'school_districts',
            evidence_snippet: 'Public LEA detail preserves `Interim Director of Special Education` and multiple `Assistant Director of Special Education` contacts on the live Warwick district detail page.',
          },
          {
            sample_name: 'RI School for the Deaf LEA detail',
            source_url: 'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=81',
            verification_status: 'official_verified',
            source_type: 'official_local_education_detail',
            source_table: 'school_districts',
            evidence_snippet: 'Public LEA detail preserves `Special Education Administrator` on the live Rhode Island School for the Deaf detail page.',
          },
          {
            sample_name: 'RI Department of Corrections Education Unit LEA detail',
            source_url: 'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=93',
            verification_status: 'official_verified',
            source_type: 'official_local_education_detail',
            source_table: 'school_districts',
            evidence_snippet: 'Public LEA detail preserves `Principal/Special Education Director` for the RI Department of Corrections Education Unit.',
          },
          {
            sample_name: 'Highlander Special Education',
            source_url: 'https://www.highlandercharter.org/our-programs/academics/special-education/',
            verification_status: 'official_verified',
            source_type: 'first_party_special_education_leaf',
            source_table: 'school_districts',
            evidence_snippet: 'Highlander publishes a live `Special Education` page covering RTI, referral for special-education assessment, IEP, 504 plan, and procedural safeguards.',
          },
          {
            sample_name: 'International Charter Special Education',
            source_url: 'https://internationalcharterschool.org/special-education/',
            verification_status: 'official_verified',
            source_type: 'first_party_special_education_leaf',
            source_table: 'school_districts',
            evidence_snippet: 'International Charter publishes a live `Special Education` page naming `Katie Nerstheimer, Student Services Director` as the special-education and 504 contact.',
          },
          {
            sample_name: 'Nowell Student & Family Handbook',
            source_url: 'https://www.nowellacademy.org/s/Nowell-Student-Family-Handbook-2024-2025.pdf',
            verification_status: 'official_verified',
            source_type: 'first_party_handbook_leaf',
            source_table: 'school_districts',
            evidence_snippet: 'The public Nowell handbook names `Natalie Fleming` as `Special Education Administrator` and publishes direct email and phone contact information.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = [];

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'COMPLETE',
    index_safe: true,
    completeness_pct: 100,
    strong_critical_families: 12,
    weak_critical_families: 0,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: [],
    major_gap_families: [],
    complete_ready: true,
    final_blockers: [],
  };

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'rhode-island',
    generated_at: '2026-06-26',
    classification: 'COMPLETE',
    index_safe: true,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: [],
    official_evidence_reviewed: [
      'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=57',
      'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=88',
      'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=81',
      'https://datacenter.ride.ri.gov/Directory/LEADetail?orgid=93',
      'https://www.highlandercharter.org/our-programs/academics/special-education/',
      'https://internationalcharterschool.org/special-education/',
      'https://www.nowellacademy.org/s/Nowell-Student-Family-Handbook-2024-2025.pdf',
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
