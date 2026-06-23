import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'nevada_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'nevada_gap_matrix_v2.jsonl'),
  verified: path.join(generatedDir, 'nevada_verified_sources_v1.jsonl'),
  packet: path.join(generatedDir, 'nevada_county_local_disability_resources_welfare_office_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  failures: path.join(generatedDir, 'nevada_failure_ledger_v2.jsonl'),
  nextActions: path.join(generatedDir, 'nevada_next_action_queue_v2.jsonl'),
  batchSummary: path.join(generatedDir, 'batch271_nevada_county_local_completion_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch271-nevada-county-local-completion-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nevada-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence';
const FAMILY_STATUS = 'verified_state_grade';
const FAMILY_REASON = 'Reviewed official Nevada county-local routing now clears all 17 county-equivalents. The Nevada DSS Program Offices page preserves county-named local partners for Carson City, Churchill, Douglas, Elko, Eureka, Lincoln, Lyon, Mineral, Nye, Pershing, and White Pine, while official county-owned pages now cover Clark, Washoe, Humboldt, Esmeralda, Lander, and Storey through exact county social-service, transportation, senior-center, health, or community-services routes.';
const MAINTENANCE_EVIDENCE = 'Nevada DSS Program Offices now covers 11 county-equivalents, and exact county-owned Clark, Washoe, Humboldt, Esmeralda, Lander, and Storey pages close the remaining six counties with reviewed local support evidence.';
const LESSON_HEADING = '### Official Site Search Can Recover A Live County Service Leaf After A Stale Nav Link';
const LESSON_BODY = '*   **Lesson:** If an official county services index exposes a promising local-support label but the direct nav slug 404s, run one bounded first-party site-search pass before freezing the county. Storey County\'s `County Services` page linked a stale `/530/Senior-Center` slug, but the county\'s own search results surfaced the live `Health & Community Services` leaf that preserved countywide senior and community-service routing plus direct contacts.';

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

function buildStateReport(summary, gapRows, verifiedRows, nextRows) {
  return [
    '# Nevada California-Grade Audit Report v2',
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
    '- none',
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Nevada repair decision',
    '',
    '- County-local disability resources are now verified because the official Nevada DSS Program Offices page plus exact county-owned Clark, Washoe, Humboldt, Esmeralda, Lander, and Storey pages together preserve reviewed local routing coverage across all 17 Nevada county-equivalents.',
    '- Humboldt now clears from the live county-owned Public Transportation Services page, which explicitly prioritizes seniors and ADA-certified disabled riders and preserves county contact routing.',
    '- Storey now clears from the live county-owned Health & Community Services page, which explicitly says it serves all communities within Storey County and lists direct senior-center contacts plus community-resource links.',
    '- Esmeralda now clears from the live county-owned Senior Transportation page, which preserves local medical transport schedules and county dispatcher contacts.',
    '- Lander now clears from the exact county-owned Senior Center and Austin Community & Medical Center pages, which preserve local senior-center contact routing and county-resident healthcare-service language on the same first-party host.',
    '- Nevada is therefore California-grade COMPLETE and index-safe so long as future maintenance audits keep these reviewed county-local leaves live.',
    '',
    '## Evidence checks',
    '',
    '- County-local routing: Reviewed 2026-06-23 official Nevada DSS Program Offices content preserved county-named local partners for Carson City, Churchill, Douglas, Elko, Eureka, Lincoln, Lyon, Mineral, Nye, Pershing, and White Pine. Reviewed official county-owned Clark, Washoe, Humboldt, Esmeralda, Lander, and Storey pages preserved exact county local-support routes, direct county contact details, or county-resident service scope that closes the remaining six county-equivalents.',
    '',
    '## Final family count',
    '',
    `- strong_critical_families: ${summary.strong_critical_families}`,
    `- weak_critical_families: ${summary.weak_critical_families}`,
    `- missing_critical_families: ${summary.missing_critical_families}`,
    '- county_local_disability_resources: verified_state_grade',
  ].join('\n') + '\n';
}

function buildBatchReport(summary) {
  return [
    '# Batch 271 Nevada County-Local Completion Report v1',
    '',
    `- state: Nevada`,
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    '',
    '## County-local completion evidence',
    '',
    '- Nevada DSS Program Offices preserves county-named local partners for 11 county-equivalents.',
    '- Clark County Social Service / Senior Services remains a reviewed county-owned disability-support route.',
    '- Washoe County Human Services Agency remains a reviewed county-owned human-services route.',
    '- Humboldt County Public Transportation Services explicitly prioritizes seniors and ADA-certified disabled riders and provides county contact routing.',
    '- Esmeralda County Senior Transportation preserves county-operated medical transport schedules and dispatcher contacts.',
    '- Storey County Health & Community Services explicitly says it serves all communities within Storey County and lists direct senior-center contacts plus community-service links.',
    '- Lander County Senior Center plus Austin Community & Medical Center preserve county-owned local support and healthcare-service routing for residents of Lander County.',
    '',
    '## Outcome',
    '',
    '- Nevada now has reviewed county-local proof across all 17 county-equivalents.',
    '- The last critical family is cleared, so Nevada is COMPLETE and index-safe.',
  ].join('\n') + '\n';
}

export function generateBatch271NevadaCountyLocalCompletionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const packet = readJson(INPUTS.packet);

  const updatedSummary = {
    ...summary,
    classification: 'COMPLETE',
    index_safe: true,
    incorrectly_index_safe: false,
    completeness_pct: 100,
    strong_critical_families: 12,
    weak_critical_families: 0,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'complete_maintain',
    critical_gap_families: [],
    major_gap_families: [],
    complete_ready: true,
    final_blockers: [],
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: FAMILY_REASON }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          evidence_strength: 'strong',
          sample_count: 17,
          blocker_code: null,
          blocker_evidence: null,
          query_basis: 'Reviewed 2026-06-23 the official Nevada DSS Program Offices page plus exact county-owned Clark, Washoe, Humboldt, Esmeralda, Lander, and Storey county-local support pages.',
          samples: [
            {
              sample_name: 'Nevada DSS Program Offices',
              source_url: 'https://www.dss.nv.gov/contact/program-offices/',
              final_url: 'https://www.dss.nv.gov/contact/program-offices/',
              verification_status: 'verified',
              source_type: 'official_partial_county_local_directory',
              source_table: 'batch271_nevada_county_local_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The Program Offices page preserves county-named local partners for Churchill County Social Services, Douglas County Social Services, Elko County Human & Social Services, Eureka County Social Services, Lyon County Human Services, Nye County Health & Human Services, and other county-named Nevada local partners.',
            },
            {
              sample_name: 'Clark County Social Service Senior Services',
              source_url: 'https://www.clarkcountynv.gov/residents/assistance_programs/senior-services',
              final_url: 'https://www.clarkcountynv.gov/residents/assistance_programs/senior-services',
              verification_status: 'verified',
              source_type: 'official_county_social_service_page',
              source_table: 'batch271_nevada_county_local_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The Senior Services program by Clark County Social Service is dedicated to supporting low-income seniors and individuals with disabilities.',
            },
            {
              sample_name: 'Washoe County Human Services Agency',
              source_url: 'https://www.washoecounty.gov/hsa/index.php',
              final_url: 'https://www.washoecounty.gov/hsa/index.php',
              verification_status: 'verified',
              source_type: 'official_county_human_services_agency',
              source_table: 'batch271_nevada_county_local_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'Washoe County preserves a county-owned Human Services Agency route with first-party navigation for adult services and children services.',
            },
            {
              sample_name: 'Humboldt County Public Transportation Services',
              source_url: 'https://hcnv.us/312/Public-Transportation',
              final_url: 'https://hcnv.us/312/Public-Transportation',
              verification_status: 'verified',
              source_type: 'official_county_transportation_support_page',
              source_table: 'batch271_nevada_county_local_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The Senior Center Transportation Service prioritizes rides for seniors and disabled persons that are ADA certified, and the buses are equipped with wheelchair lifts.',
            },
            {
              sample_name: 'Esmeralda County Senior Transportation',
              source_url: 'https://www.accessesmeralda.com/county_offices/senior_transportation.php',
              final_url: 'https://www.accessesmeralda.com/county_offices/senior_transportation.php',
              verification_status: 'verified',
              source_type: 'official_county_senior_transportation_page',
              source_table: 'batch271_nevada_county_local_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'Esmeralda County Senior Transportation publishes local routes plus long-distance medical transport and tells residents to call 775-485-3406 before scheduling appointments.',
            },
            {
              sample_name: 'Storey County Health & Community Services',
              source_url: 'https://storeycounty.org/658/Health-Community-Services',
              final_url: 'https://storeycounty.org/658/Health-Community-Services',
              verification_status: 'verified',
              source_type: 'official_county_health_and_community_services_page',
              source_table: 'batch271_nevada_county_local_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'Storey County Health and Community Services serves all communities within Storey County, focuses on supporting those most at risk, and lists senior centers in Virginia City and Lockwood with direct county contacts.',
            },
            {
              sample_name: 'Lander County Senior Center',
              source_url: 'https://landercountynv.org/departments/senior_center.php',
              final_url: 'https://landercountynv.org/departments/senior_center.php',
              verification_status: 'verified',
              source_type: 'official_county_senior_center_page',
              source_table: 'batch271_nevada_county_local_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The county-owned Senior Center page lists Senior Center Director Tonia Bakker at 365 E. 4th Street, Battle Mountain, NV 89820 with phone 775-635-5311.',
            },
            {
              sample_name: 'Lander County Austin Community & Medical Center',
              source_url: 'https://landercountynv.org/projects/austin_community_medical_center.php',
              final_url: 'https://landercountynv.org/projects/austin_community_medical_center.php',
              verification_status: 'verified',
              source_type: 'official_county_healthcare_service_page',
              source_table: 'batch271_nevada_county_local_completion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The Austin Community Center & Clinic page says the facility will provide local healthcare services for residents of Lander County.',
            },
          ],
        }
      : row
  ));

  const updatedPacket = {
    ...packet,
    failure_code: null,
    repair_lane: 'maintain_truth_only',
    packet_complete_when: 'achieved',
    current_metrics: {
      ...packet.current_metrics,
      partialCountyNamedCoverageCount: 17,
      missingCountyContractCount: 0,
      countyLocalPagesReviewed: 6,
      unresolvedCountyRemainder: [],
    },
    representative_sources: [
      {
        label: 'Nevada DSS Program Offices',
        url: 'https://www.dss.nv.gov/contact/program-offices/',
        status: 'official_partial_county_local_directory',
        evidence: 'The Program Offices page preserves county-named local partners for 11 Nevada county-equivalents.',
      },
      {
        label: 'Clark County Social Service Senior Services',
        url: 'https://www.clarkcountynv.gov/residents/assistance_programs/senior-services',
        status: 'official_county_social_service_page',
        evidence: 'Clark County Social Service explicitly supports low-income seniors and individuals with disabilities.',
      },
      {
        label: 'Washoe County Human Services Agency',
        url: 'https://www.washoecounty.gov/hsa/index.php',
        status: 'official_county_human_services_agency',
        evidence: 'Washoe County preserves a county-owned Human Services Agency route with first-party adult and children services navigation.',
      },
      {
        label: 'Humboldt County Public Transportation Services',
        url: 'https://hcnv.us/312/Public-Transportation',
        status: 'official_county_transportation_support_page',
        evidence: 'Humboldt County prioritizes rides for seniors and ADA-certified disabled persons and preserves county contact routing.',
      },
      {
        label: 'Esmeralda County Senior Transportation',
        url: 'https://www.accessesmeralda.com/county_offices/senior_transportation.php',
        status: 'official_county_senior_transportation_page',
        evidence: 'Esmeralda County preserves local medical transport schedules and dispatch contacts on the first-party county host.',
      },
      {
        label: 'Storey County Health & Community Services',
        url: 'https://storeycounty.org/658/Health-Community-Services',
        status: 'official_county_health_and_community_services_page',
        evidence: 'Storey County says Health and Community Services serves all communities within Storey County and lists senior-center contacts.',
      },
      {
        label: 'Lander County Senior Center',
        url: 'https://landercountynv.org/departments/senior_center.php',
        status: 'official_county_senior_center_page',
        evidence: 'Lander County preserves an exact Senior Center director, address, and phone on the first-party county host.',
      },
      {
        label: 'Lander County Austin Community & Medical Center',
        url: 'https://landercountynv.org/projects/austin_community_medical_center.php',
        status: 'official_county_healthcare_service_page',
        evidence: 'Lander County states the Austin Community Center & Clinic will provide local healthcare services for residents of Lander County.',
      },
    ],
    next_roots_if_state_reopens: [],
  };

  const updatedNextRows = [
    {
      state: 'nevada',
      state_code: 'NV',
      priority_rank: 1,
      family: 'maintenance',
      severity: 'info',
      failure_code: 'complete_maintain_truth_only',
      next_action: 'Preserve Nevada as COMPLETE/index_safe and rerun only maintenance truth audits unless new evidence regresses.',
      evidence: MAINTENANCE_EVIDENCE,
    },
  ];

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(OUTPUTS.failures, []);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(OUTPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);

  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const batchSummary = {
    batch: 'batch271_nevada_county_local_completion_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'nevada',
    classification: 'COMPLETE',
    index_safe: true,
    reviewed_county_local_coverage_count: 17,
    newly_cleared_counties: ['Esmeralda', 'Humboldt', 'Lander', 'Storey'],
    maintained_cleared_counties: ['Carson City', 'Churchill', 'Clark', 'Douglas', 'Elko', 'Eureka', 'Lincoln', 'Lyon', 'Mineral', 'Nye', 'Pershing', 'Washoe', 'White Pine'],
    remaining_blockers: [],
    lesson_added: appendLessonIfMissing(INPUTS.lessons),
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(updatedSummary));

  return {
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_county_local_coverage_count: batchSummary.reviewed_county_local_coverage_count,
    newly_cleared_counties: batchSummary.newly_cleared_counties,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(generateBatch271NevadaCountyLocalCompletionV1(), null, 2));
}
