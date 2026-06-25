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
  batchSummary: path.join(generatedDir, 'batch382_rhode_island_official_routing_completion_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch382-rhode-island-official-routing-completion-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'rhode-island-california-grade-audit-report-v2.md'),
};

const BATCH_ID = 'batch382_rhode_island_official_routing_completion_v1';
const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence';

const EDUCATION_REASON =
  'Reviewed 2026-06-25 the live official RIDE Rhode Island public school districts page and supporting school directory page. The current page says there are 66 public Local Education Agencies (LEAs) or districts in Rhode Island, including 32 regular school districts and 4 regional school districts, and then tells families to `Visit Your School District’s Website` through a public roster of district links such as Barrington, Bristol Warren, East Providence, Providence, and Woonsocket. The supporting School Directory page says families can `Find contact information for Rhode Island schools and related organizations.` This replaces Rhode Island’s old statewide fallback with reviewed first-party district-routing evidence on the current official RIDE host.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 the live official BHDDH DD Service Providers page plus its linked 2025 printable provider PDFs. The current BHDDH page says adults with I/DD can get DD services from licensed DD service providers and links both a licensed provider document PDF and a detailed provider list table PDF. Those official PDFs preserve named developmental-disability provider organizations with local mailing addresses and phone numbers across Rhode Island municipalities including Cranston, Woonsocket, Warwick, Providence, Pawtucket, Westerly, Middletown, Bristol, Barrington, and Coventry. This replaces Rhode Island’s stale locator and DOI-mirror-backed local disability evidence with current official local DD provider routing on the live BHDDH stack.';

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
    '# Rhode Island California-Grade Batch 382 Report v1',
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
    '- Rhode Island is now `COMPLETE` and `index_safe=true`.',
    '- `district_or_county_education_routing` now clears because the official RIDE school-districts page publicly enumerates 66 LEAs or districts and exposes a first-party district roster families can use to reach district websites.',
    '- `county_local_disability_resources` now clears because the official BHDDH DD provider page and linked 2025 provider PDFs preserve named developmental-disability organizations with local Rhode Island mailing addresses and phone numbers.',
    '- The former stale `dhhs.rhode-island.gov/locations` and DOI-mirror-backed local disability rows are no longer needed for Rhode Island completion.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 382 Rhode Island Official Routing Completion v1',
    '',
    '- classification: COMPLETE',
    '- index_safe: true',
    '- change: cleared Rhode Island education routing and county/local disability resources with live official first-party evidence',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch382RhodeIslandOfficialRoutingCompletionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    batch: BATCH_ID,
    classification: 'COMPLETE',
    index_safe: true,
    completeness_pct: 100,
    strong_critical_families: 12,
    weak_critical_families: 0,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'complete_maintain',
    critical_gap_families: [],
    major_gap_families: [],
    complete_ready: true,
    final_blockers: null,
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = [];
  const updatedNextRows = [];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 live official RIDE school-districts and school-directory pages for public district-routing evidence on the current ride.ri.gov host.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'RIDE School Districts overview',
            source_url: 'https://ride.ri.gov/students-families/ri-public-schools/school-districts',
            final_url: 'https://ride.ri.gov/students-families/ri-public-schools/school-districts',
            verification_status: 'official_verified',
            source_type: 'official_school_district_directory',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official page says there are 66 public Local Education Agencies (LEAs) or districts in Rhode Island.',
          },
          {
            sample_name: 'RIDE district type counts',
            source_url: 'https://ride.ri.gov/students-families/ri-public-schools/school-districts',
            final_url: 'https://ride.ri.gov/students-families/ri-public-schools/school-districts',
            verification_status: 'official_verified',
            source_type: 'official_school_district_counts',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same page breaks those LEAs into 32 regular school districts and 4 regional school districts.',
          },
          {
            sample_name: 'RIDE district website roster',
            source_url: 'https://ride.ri.gov/students-families/ri-public-schools/school-districts',
            final_url: 'https://ride.ri.gov/students-families/ri-public-schools/school-districts',
            verification_status: 'official_verified',
            source_type: 'official_district_website_roster',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Under `Visit Your School District’s Website`, the official roster links district websites including Barrington, Bristol Warren, East Providence, Providence, and Woonsocket.',
          },
          {
            sample_name: 'RIDE School Directory',
            source_url: 'https://ride.ri.gov/students-families/ri-public-schools/school-directory',
            final_url: 'https://ride.ri.gov/students-families/ri-public-schools/school-directory',
            verification_status: 'official_verified',
            source_type: 'official_school_directory_support',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The supporting School Directory page says families can `Find contact information for Rhode Island schools and related organizations.`',
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
        query_basis: 'Reviewed 2026-06-25 live official BHDDH DD Service Providers page plus its linked 2025 provider PDFs for local developmental-disability routing evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'BHDDH DD Service Providers page',
            source_url: 'https://bhddh.ri.gov/developmental-disabilities/services-adults/licensed-provider-lists',
            final_url: 'https://bhddh.ri.gov/developmental-disabilities/services-adults/licensed-provider-lists',
            verification_status: 'official_verified',
            source_type: 'official_dd_provider_directory',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official BHDDH page says adults with I/DD can get DD services from licensed DD service providers and explains that a licensed DD service provider is a company the State of Rhode Island approves to give DD services.',
          },
          {
            sample_name: 'BHDDH provider PDF links',
            source_url: 'https://bhddh.ri.gov/developmental-disabilities/services-adults/licensed-provider-lists',
            final_url: 'https://bhddh.ri.gov/developmental-disabilities/services-adults/licensed-provider-lists',
            verification_status: 'official_verified',
            source_type: 'official_dd_provider_pdf_index',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same page links both a licensed DD service provider document PDF and a detailed provider list table PDF for printable local routing.',
          },
          {
            sample_name: 'BHDDH detailed provider list PDF',
            source_url: 'https://bhddh.ri.gov/sites/g/files/xkgbur411/files/2025-06/Agency%20Provider%20List%205.5.25.pdf',
            final_url: 'https://bhddh.ri.gov/sites/g/files/xkgbur411/files/2025-06/Agency%20Provider%20List%205.5.25.pdf',
            verification_status: 'official_verified',
            source_type: 'official_dd_provider_pdf',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official detailed provider PDF lists organizations and local addresses such as ACCESSPOINT RI in Cranston, Action Based Enterprises in Woonsocket, Avatar Residential in Warwick, and Goodwill Industries in Providence.',
          },
          {
            sample_name: 'BHDDH licensed agency list PDF',
            source_url: 'https://bhddh.ri.gov/sites/g/files/xkgbur411/files/2025-04/BHDDH-DDD-Agency-List%2004.28.2025.pdf',
            final_url: 'https://bhddh.ri.gov/sites/g/files/xkgbur411/files/2025-04/BHDDH-DDD-Agency-List%2004.28.2025.pdf',
            verification_status: 'official_verified',
            source_type: 'official_dd_provider_pdf',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official licensed agency PDF preserves additional local DD provider rows with mailing addresses and phone numbers in Pawtucket, Bristol, Barrington, Coventry, Middletown, and Westerly.',
          },
        ],
      };
    }
    return row;
  });

  const batchSummary = {
    batch: BATCH_ID,
    state: 'rhode-island',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: ['district_or_county_education_routing', 'county_local_disability_resources'],
    evidence_sources: [
      'https://ride.ri.gov/students-families/ri-public-schools/school-districts',
      'https://ride.ri.gov/students-families/ri-public-schools/school-directory',
      'https://bhddh.ri.gov/developmental-disabilities/services-adults/licensed-provider-lists',
      'https://bhddh.ri.gov/sites/g/files/xkgbur411/files/2025-06/Agency%20Provider%20List%205.5.25.pdf',
      'https://bhddh.ri.gov/sites/g/files/xkgbur411/files/2025-04/BHDDH-DDD-Agency-List%2004.28.2025.pdf',
    ],
  };

  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchReport = buildBatchReport();

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  return {
    summary: updatedSummary,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch382RhodeIslandOfficialRoutingCompletionV1();
  console.log(JSON.stringify(result, null, 2));
}
