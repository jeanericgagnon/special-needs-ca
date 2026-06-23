import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch203_idaho_reviewed_district_leaves_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch203-idaho-reviewed-district-leaves-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const EDUCATION_FAILURE_CODE = 'reviewed_district_special_services_leaves_exist_but_county_grade_mapping_is_still_incomplete';
const EDUCATION_NEXT_ACTION = 'expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet';
const EDUCATION_STATUS_REASON = 'The Idaho education blocker is now an exact reviewed-leaf expansion lane, not just a root packet. Official district-owned local leaves are already reviewable on the public web for some counties, including Cassia County School District Special Services, Payette Joint District Special Services, and Pocatello-Chubbuck School District 25 Special Services. Those pages preserve district-owned special-education or special-services context, but Idaho still is not county-grade because the statewide SDE directory exposes no county-to-district contract and the current packet still covers only a few reviewed local leaves rather than all 44 counties.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 bounded live exact district leaf checks taken directly from the existing Idaho packet signals. https://www.cassiaschools.org/page/special-services/ returned HTTP 200 with title `Special Services | Cassia County School District` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. https://www.payetteschools.org/our-district/departments/special-education returned HTTP 200 with title `Special Services - Payette Joint District` and preserved special-education and special-services text on the district-owned page. https://www.sd25.us/departments/special-services returned HTTP 200 with title `Special Services - Pocatello-Chubbuck School District 25` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. Those reviewed exact leaves prove Idaho education has moved beyond root authoring for at least a small set of counties. But the statewide SDE directory still exposes no county-to-district contract, and the packet still does not carry reviewed local leaves across all counties, so Idaho remains blocked until that exact-leaf coverage expands county by county.';
const PRIMARY_GAP_REASON = 'reviewed_idaho_district_leaves_exist_but_county_grade_education_and_dhw_mapping_remain_incomplete';

const LESSON_HEADING = '### Promote Exact District Leaves Once A Packet Signal Resolves Cleanly';
const LESSON_BODY = '*   **Lesson:** When a packet already points to likely district-owned special-education or special-services leaves, verify those exact URLs before doing any more root work. Idaho moved from generic local signals to reviewed exact district leaves immediately once Cassia, Payette, and SD25 candidate paths were fetched directly.';

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

function appendLessonIfMissing() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Idaho California-Grade Audit Report v2',
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
    '## Repair decision',
    '',
    '- Idaho remains BLOCKED and not index-safe.',
    '- Education is now an exact reviewed-leaf expansion lane: some district-owned special-education or special-services pages are already verified on official local district hosts.',
    '- Idaho still does not clear because those reviewed leaves do not yet cover all counties and the statewide SDE directory still lacks a county-grade routing contract.',
    '- County-local remains blocked separately on incomplete DHW county-to-office mapping.',
  ].join('\n') + '\n';
}

export function generateBatch203IdahoReviewedDistrictLeavesV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const packet = readJson(INPUTS.packet);
  const queueRows = readJsonl(INPUTS.queue);

  const reviewedLeaves = [
    {
      county_id: 'cassia-id',
      district_name: 'Cassia County School District',
      exact_leaf_url: 'https://www.cassiaschools.org/page/special-services/',
      evidence_terms: ['special education', 'special services', '504', 'procedural safeguards'],
      title: 'Special Services | Cassia County School District',
    },
    {
      county_id: 'payette-id',
      district_name: 'Payette Joint District',
      exact_leaf_url: 'https://www.payetteschools.org/our-district/departments/special-education',
      evidence_terms: ['special education', 'special services'],
      title: 'Special Services - Payette Joint District',
    },
    {
      county_id: 'bannock-id',
      district_name: 'Pocatello-Chubbuck School District 25',
      exact_leaf_url: 'https://www.sd25.us/departments/special-services',
      evidence_terms: ['special education', 'special services', '504', 'procedural safeguards'],
      title: 'Special Services - Pocatello-Chubbuck School District 25',
    },
  ];

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade',
          status_reason: EDUCATION_STATUS_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: EDUCATION_FAILURE_CODE,
          evidence: EDUCATION_EVIDENCE,
          next_action: EDUCATION_NEXT_ACTION,
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade',
          evidence_strength: 'medium',
          sample_count: 6,
          query_basis: 'Reviewed live official Idaho district-owned special-education or special-services leaves reached directly from the existing packet signals and district roots.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          samples: [
            {
              sample_name: 'Idaho School Districts page',
              source_url: 'https://www.sde.idaho.gov/school-districts/',
              final_url: 'https://www.sde.idaho.gov/school-districts/',
              verification_status: 'verified',
              source_type: 'official_statewide_district_directory',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official Idaho School Districts page preserves exact district-owned local roots but still does not expose a county contract.',
            },
            ...reviewedLeaves.map((leaf) => ({
              sample_name: `${leaf.district_name} reviewed district leaf`,
              source_url: leaf.exact_leaf_url,
              final_url: leaf.exact_leaf_url,
              verification_status: 'verified',
              source_type: 'district_owned_exact_education_leaf',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: `${leaf.title} preserves ${leaf.evidence_terms.join(', ')} on the district-owned page.`,
            })),
            {
              sample_name: 'Idaho education DB fallback inventory',
              source_url: 'https://www.sde.idaho.gov/school-districts/',
              final_url: 'https://www.sde.idaho.gov/school-districts/',
              verification_status: 'blocked',
              source_type: 'db_reconciliation',
              source_table: 'live_db_reconciliation',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live DB still points all 44 county education rows at statewide SDE fallbacks rather than reviewed exact local leaves.',
            },
            {
              sample_name: 'Idaho district coverage remainder',
              source_url: 'https://www.sde.idaho.gov/school-districts/',
              final_url: 'https://www.sde.idaho.gov/school-districts/',
              verification_status: 'blocked',
              source_type: 'coverage_gap',
              source_table: 'packet_reconciliation',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'Only a small reviewed exact-leaf subset is materialized so far, so Idaho still lacks county-grade reviewed district leaves across the full 44-county state packet.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: EDUCATION_FAILURE_CODE,
          next_action: EDUCATION_NEXT_ACTION,
          evidence: EDUCATION_EVIDENCE,
        }
      : row
  ));

  const updatedPacket = {
    ...packet,
    repair_lane: 'reviewed_exact_leaf_expansion_from_district_owned_roots',
    current_problem_metrics: {
      ...packet.current_problem_metrics,
      authoredExactLeafCount: 3,
      reviewedExactLeafCount: 3,
    },
    reviewed_exact_leaves: reviewedLeaves,
    packet_complete_when: 'At least one reviewed district-owned education-routing leaf is attached for every Idaho county without relying on statewide SDE fallbacks or county-name inference alone. The current packet now has reviewed exact leaves for Cassia, Payette, and Bannock as seed examples.',
  };

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? {
            ...row,
            failure_code: EDUCATION_FAILURE_CODE,
            evidence: EDUCATION_EVIDENCE,
            next_action: EDUCATION_NEXT_ACTION,
          }
        : row
    )),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'idaho'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.queue, updatedQueueRows);

  const lessonsUpdated = appendLessonIfMissing();
  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);
  fs.writeFileSync(OUTPUTS.report, `${stateReport}\n`);

  const batchSummary = {
    state: 'idaho',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_exact_district_leaves: reviewedLeaves.length,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch203IdahoReviewedDistrictLeavesV1();
  console.log(JSON.stringify(result, null, 2));
}
