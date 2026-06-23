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
  failures: path.join(generatedDir, 'nevada_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nevada_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'nevada_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'nevada_county_local_disability_resources_welfare_office_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch258_nevada_county_remainder_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch258-nevada-county-remainder-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nevada-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'official_county_local_pages_expand_proof_to_13_of_17_counties_but_four_counties_remain_unresolved';
const PRIMARY_GAP_REASON = 'official_county_local_pages_now_cover_13_of_17_counties_but_four_counties_lack_reviewed_local_route';
const NEXT_ACTION = 'hold_blocked_until_official_county_local_pages_or_dss_county_contract_cover_esmeralda_humboldt_lander_and_storey';
const STATUS = 'blocked_reviewed_county_local_proof_expanded_to_13_of_17_counties_but_four_counties_unresolved';

const STATUS_REASON = 'Reviewed 2026-06-23 one more bounded official pass for Nevada county-local proof. The official Nevada DSS Contact, Welfare District Offices-North, Welfare District Offices-South, and Program Offices pages still do not expose a complete 17-county county-to-office contract. However, reviewed official county-local pages now add exact county-grade proof for Clark County and Washoe County through Clark County Social Service / Senior Services and the Washoe County Human Services Agency. Combined with the already reviewed DSS Program Offices county-named local partners, Nevada now has reviewed official county-local proof for 13 of 17 county-equivalents, but Esmeralda, Humboldt, Lander, and Storey still lack a reviewed official county-local route or a complete DSS county contract.';
const EVIDENCE = 'Reviewed 2026-06-23 bounded official Nevada county-local evidence again. The DSS contact hub plus Welfare District Offices-North and Welfare District Offices-South remain exact office leaves with addresses and phones but still expose no county-served labels or machine-readable county assignment. The sibling Program Offices page still preserves county-named local partners for Carson City, Churchill, Douglas, Elko, Eureka, Lincoln, Lyon, Mineral, Nye, Pershing, and White Pine. A bounded official county pass then added two more exact county-local proofs: Clark County Social Service pages under https://www.clarkcountynv.gov/residents/assistance_programs/ explicitly route Clark County low-income seniors and individuals with disabilities through county social-service programs and county contact information, and the Washoe County Human Services Agency page at https://www.washoecounty.gov/hsa/index.php preserves a first-party county human-services route. That raises reviewed official county-local coverage to 13 of 17 county-equivalents. But Esmeralda, Humboldt, Lander, and Storey still do not have a reviewed exact county-local social-service or disability-routing page in this bounded pass, and Nevada still lacks a full official DSS county-to-office contract. Nevada therefore remains BLOCKED and not index-safe.';

const LESSON_HEADING = '### Exact County Social-Service Pages Can Shrink A Statewide Office Blocker Without Clearing It';
const LESSON_BODY = '*   **Lesson:** When a statewide office host fails to expose a complete county-to-office contract, a bounded pass across official county sites can still narrow the blocker honestly. Nevada DSS stayed incomplete, but exact county-owned Clark County Social Service pages and the Washoe County Human Services Agency page raised reviewed local coverage from 11 to 13 counties while still leaving the four-county remainder explicit.';

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

function uniqueRepresentativeSources(sources) {
  const seen = new Set();
  return sources.filter((source) => {
    const key = `${source.label}|${source.url}|${source.status}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Nevada California-Grade County Office Packet v3',
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
    '## Packetized blocker',
    '',
    '- County-local packet saved at `data/generated/nevada_county_local_disability_resources_welfare_office_packet_v1.json`.',
    '- Official Nevada DSS welfare-office pages remain real office leaves without county-served labels or a public county filter.',
    '- Reviewed official county-local pages now add Clark County and Washoe County, raising reviewed county-local proof to 13 of 17 county-equivalents.',
    '- Nevada still lacks reviewed county-local proof for Esmeralda, Humboldt, Lander, and Storey, so the state remains BLOCKED and not index-safe.',
  ].join('\n') + '\n';
}

export function generateBatch258NevadaCountyRemainderRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const packet = readJson(INPUTS.packet);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: STATUS, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: STATUS,
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed 2026-06-23 the official Nevada DSS Contact hub, Welfare District Offices North/South leaves, the sibling Program Offices page, Clark County Social Service pages, and the Washoe County Human Services Agency page.',
          sample_count: 7,
          samples: [
            {
              sample_name: 'Nevada DSS Contact hub',
              source_url: 'https://www.dss.nv.gov/contact/',
              final_url: 'https://www.dss.nv.gov/contact/',
              verification_status: 'blocked',
              source_type: 'official_contact_hub_without_county_contract',
              source_table: 'batch258_nevada_county_remainder_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live contact hub links the North and South welfare office leaves but exposes no county filter or county-served assignment.',
            },
            {
              sample_name: 'Nevada Welfare District Offices-North',
              source_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-north/',
              final_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-north/',
              verification_status: 'blocked',
              source_type: 'official_office_leaf_without_county_contract',
              source_table: 'batch258_nevada_county_remainder_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The North page lists exact offices such as Carson City, Elko/Winnemucca, Ely, Fallon, Hawthorne, Reno, Sparks, and Yerington with addresses and phones, but no county-served labels.',
            },
            {
              sample_name: 'Nevada Welfare District Offices-South',
              source_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-south/',
              final_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-south/',
              verification_status: 'blocked',
              source_type: 'official_office_leaf_without_county_contract',
              source_table: 'batch258_nevada_county_remainder_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The South page lists exact offices such as Belrose, Cambridge, Henderson, Pahrump, and other district offices with addresses and phones, but no county-served labels.',
            },
            {
              sample_name: 'Nevada Program Offices page',
              source_url: 'https://www.dss.nv.gov/contact/program-offices/',
              final_url: 'https://www.dss.nv.gov/contact/program-offices/',
              verification_status: 'blocked',
              source_type: 'official_sibling_page_with_partial_county_coverage',
              source_table: 'batch258_nevada_county_remainder_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The Program Offices page preserves county-named entries such as Churchill County Social Services, Douglas County Social Services, Elko County Human & Social Services, Eureka County Social Services, Lyon County Human Services, Nye County Health & Human Services, and White Pine County Social Services.',
            },
            {
              sample_name: 'Clark County Social Service Senior Services',
              source_url: 'https://www.clarkcountynv.gov/residents/assistance_programs/senior-services',
              final_url: 'https://www.clarkcountynv.gov/residents/assistance_programs/senior-services',
              verification_status: 'verified',
              source_type: 'official_county_social_service_page',
              source_table: 'batch258_nevada_county_remainder_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The Senior Services program by Clark County Social Service (CCSS) is dedicated to supporting low-income seniors and individuals with disabilities, with county contact information at 1600 Pinto Lane Las Vegas.',
            },
            {
              sample_name: 'Washoe County Human Services Agency',
              source_url: 'https://www.washoecounty.gov/hsa/index.php',
              final_url: 'https://www.washoecounty.gov/hsa/index.php',
              verification_status: 'verified',
              source_type: 'official_county_human_services_agency',
              source_table: 'batch258_nevada_county_remainder_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The Washoe County Human Services Agency page is a county-owned human-services route with direct county agency navigation for adult services and children services.',
            },
            {
              sample_name: 'Nevada county coverage remainder',
              source_url: 'https://www.dss.nv.gov/contact/program-offices/',
              final_url: 'https://www.dss.nv.gov/contact/program-offices/',
              verification_status: 'blocked',
              source_type: 'incomplete_county_coverage',
              source_table: 'batch258_nevada_county_remainder_refinement',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'After adding Clark County and Washoe County from official county-owned pages, Esmeralda, Humboldt, Lander, and Storey still remain without a reviewed exact county-local route in this bounded pass.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  const representativeSources = uniqueRepresentativeSources([
    {
      label: 'Stale parent office root',
      url: 'https://dwss.nv.gov/Contact/Welfare_District_Offices/',
      status: 'stale_parent_root',
      evidence: 'The older parent office route no longer acts as a usable county-office contract and should not be used as Nevada county-local proof.',
    },
    {
      label: 'Nevada DSS Contact hub',
      url: 'https://www.dss.nv.gov/contact/',
      status: 'live_contact_hub_without_county_contract',
      evidence: 'The live contact hub preserves exact North and South welfare office leaves, but its public HTML exposes no county-served assignment.',
    },
    {
      label: 'Welfare District Offices-North',
      url: 'https://www.dss.nv.gov/contact/welfare-district-offices-north/',
      status: 'live_office_leaf_without_county_contract',
      evidence: 'The North page lists exact offices such as Carson City, Elko / Winnemucca, Ely, Fallon, Hawthorne, Reno, Sparks, and Yerington with addresses and phones, but no county labels or county-served fields.',
    },
    {
      label: 'Welfare District Offices-South',
      url: 'https://www.dss.nv.gov/contact/welfare-district-offices-south/',
      status: 'live_office_leaf_without_county_contract',
      evidence: 'The South page lists exact offices such as Belrose, Cambridge, Henderson, Pahrump, and other district offices with addresses and phones, but no county labels or county-served fields.',
    },
    {
      label: 'Nevada DSS Program Offices',
      url: 'https://www.dss.nv.gov/contact/program-offices/',
      status: 'official_sibling_page_with_partial_county_coverage',
      evidence: 'The sibling Program Offices page preserves county-named local partners for 11 Nevada county-equivalents, but it still does not replace a full 17-county office contract.',
    },
    {
      label: 'Clark County Social Service Senior Services',
      url: 'https://www.clarkcountynv.gov/residents/assistance_programs/senior-services',
      status: 'official_county_social_service_page',
      evidence: 'Clark County Social Service preserves county-owned routes for low-income seniors and individuals with disabilities, including county contact information and county eligibility language.',
    },
    {
      label: 'Washoe County Human Services Agency',
      url: 'https://www.washoecounty.gov/hsa/index.php',
      status: 'official_county_human_services_agency',
      evidence: 'Washoe County preserves a county-owned Human Services Agency route with first-party navigation for adult services and children services.',
    },
  ]);

  const updatedPacket = {
    ...packet,
    failure_code: FAILURE_CODE,
    packet_complete_when: 'Nevada can reopen only when reviewed official county-local routes or a first-party DSS county-to-office contract cover all 17 county-equivalents.',
    current_metrics: {
      ...(packet.current_metrics || {}),
      siblingProgramOfficesReviewed: true,
      partialCountyNamedCoverageCount: 13,
      missingCountyContractCount: 4,
      countyLocalPagesReviewed: 2,
      unresolvedCountyRemainder: ['Esmeralda', 'Humboldt', 'Lander', 'Storey'],
    },
    representative_sources: representativeSources,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch258_nevada_county_remainder_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'nevada',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_county_local_coverage_count: 13,
    unresolved_county_remainder: ['Esmeralda', 'Humboldt', 'Lander', 'Storey'],
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 258 Nevada County Remainder Refinement Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: county_local_disability_resources',
    `- failure_code: ${FAILURE_CODE}`,
    '',
    '## Evidence',
    '',
    `- ${EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Kept Nevada BLOCKED.',
    '- Preserved the official DSS welfare-office blocker because no full county-served contract exists on the state host.',
    '- Added exact official county-local proof for Clark County and Washoe County.',
    '- Narrowed the unresolved Nevada remainder to Esmeralda, Humboldt, Lander, and Storey.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch258NevadaCountyRemainderRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
