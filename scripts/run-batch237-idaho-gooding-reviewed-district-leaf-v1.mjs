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
  failure: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch237_idaho_gooding_reviewed_district_leaf_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch237-idaho-gooding-reviewed-district-leaf-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'reviewed_idaho_district_leaves_now_cover_11_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete';
const FAILURE_CODE = 'reviewed_district_special_services_leaves_now_cover_11_counties_but_county_grade_mapping_is_still_incomplete';
const STATUS_REASON = 'The Idaho education blocker remains an exact reviewed-leaf expansion lane, but it is stronger than before: official district-owned local leaves are now reviewable for eleven counties. Gooding Joint District #231 now joins Cassia, Payette, Bannock, Boundary, Butte, Bonneville, Jerome, Minidoka, Blaine, Teton, and the earlier reviewed set through a direct district-owned `Special Education` page. Idaho still is not county-grade because the statewide SDE directory exposes no county-to-district contract and the packet still carries reviewed local leaves for only a subset of the 44 counties.';
const EVIDENCE = 'Reviewed 2026-06-23 one more bounded live Idaho district-owned leaf directly from the official SDE district root lane. The official Idaho School Districts page JSON links Gooding Joint District #231 at https://gsd231.org/. That live district root returned HTTP 200 and exposed an exact `Special Education` anchor to https://gsd231.org/special-education/. The exact page returned HTTP 200 with title `Special Education — Gooding School District` and preserved `Special Education` plus `Special Services` role evidence on the district-owned host. Idaho education therefore now has eleven reviewed county-level district-owned leaves, but the statewide SDE directory still exposes no county-to-district contract and the remaining counties still need exact leaf expansion.';
const NEXT_ACTION = 'expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet';
const LESSON = '*   **Lesson:** If the official district root itself exposes a repeated exact `Special Education` nav link on the district-owned host, one verified first-party href is enough; ignore repeated menu duplicates and verify the exact leaf once. Idaho Gooding Joint District #231 repeated the same `Special Education` link multiple times on the root, but the single exact leaf still cleared the county safely.';

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

function updateLessonFile(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON)) {
    return;
  }
  const lines = current.split('\n');
  lines.splice(34, 0, LESSON);
  fs.writeFileSync(filePath, `${lines.join('\n').replace(/\n*$/, '\n')}`);
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
    '- Education is still a county-by-county exact-leaf expansion lane, but it now has eleven reviewed district-owned leaves, including a newly verified Gooding Joint District #231 Special Education page.',
    '- County-local remains the same explicit split: 17 clean office replacements plus the Canyon split are preserved, and 27 counties stay blocked until Idaho publishes a public county-to-office contract.',
  ].join('\n') + '\n';
}

export function generateBatch237IdahoGoodingReviewedDistrictLeafV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') {
      return row;
    }
    const existingSamples = row.samples || [];
    const goodingSample = {
      sample_name: 'Gooding Joint District #231 Special Education',
      source_url: 'https://gsd231.org/special-education/',
      final_url: 'https://gsd231.org/special-education/',
      verification_status: 'verified',
      source_type: 'district_owned_special_education_leaf',
      source_table: 'batch237_idaho_gooding_reviewed_district_leaf',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The district-owned page title `Special Education — Gooding School District` preserves exact `Special Education` plus `Special Services` role evidence on the Gooding host.',
    };
    const samplesWithoutGooding = existingSamples.filter((sample) => sample.source_url !== goodingSample.source_url);
    return {
      ...row,
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      sample_count: 13,
      query_basis: 'Reviewed live official Idaho district-owned special-education or special-services leaves reached directly from the existing packet signals plus exact district-root anchors and official district sitemap leaves.',
      samples: [...samplesWithoutGooding, goodingSample],
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  const reviewedExactLeaves = packet.reviewed_exact_leaves || [];
  const goodingLeaf = {
    county_id: 'gooding-id',
    district_name: 'Gooding Joint District #231',
    exact_leaf_url: 'https://gsd231.org/special-education/',
    evidence_terms: ['special education', 'special services'],
    title: 'Special Education — Gooding School District',
  };
  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...(packet.current_problem_metrics || {}),
      authoredExactLeafCount: 11,
      reviewedExactLeafCount: 11,
    },
    packet_complete_when: 'At least one reviewed district-owned education-routing leaf is attached for every Idaho county without relying on statewide SDE fallbacks or county-name inference alone. The current packet now has reviewed exact leaves for Cassia, Payette, Bannock, Boundary, Butte, Bonneville, Jerome, Minidoka, Blaine, Teton, and Gooding as seed examples.',
    reviewed_exact_leaves: [
      ...reviewedExactLeaves.filter((leaf) => leaf.county_id !== 'gooding-id'),
      goodingLeaf,
    ],
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'idaho'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  updateLessonFile(INPUTS.lessons);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    batch: 'batch237_idaho_gooding_reviewed_district_leaf_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'idaho',
    classification: 'BLOCKED',
    index_safe: false,
    refined_family: 'district_or_county_education_routing',
    reviewed_exact_leaf_count: 11,
    newly_verified_county: 'gooding-id',
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 237 Idaho Gooding Reviewed District Leaf Report v1',
    '',
    '- state: idaho',
    '- classification: BLOCKED',
    '- index_safe: false',
    '',
    '## What changed',
    '',
    '- Verified one more district-owned Idaho special-education leaf from the existing official SDE root lane: Gooding Joint District #231.',
    '- Raised the Idaho reviewed exact district-leaf count from 10 to 11 without reopening statewide SDE discovery or weakening county-grade standards.',
    '- Aligned the Idaho education failure code across summary, failure ledger, verified sources, next actions, and queue artifacts.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch237IdahoGoodingReviewedDistrictLeafV1();
  console.log(JSON.stringify(result, null, 2));
}
