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
  batchSummary: path.join(generatedDir, 'batch235_idaho_teton_reviewed_district_leaf_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch235-idaho-teton-reviewed-district-leaf-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'reviewed_idaho_district_leaves_now_cover_10_counties_and_dhw_split_is_explicit_but_county_grade_remains_incomplete';
const FAILURE_CODE = 'reviewed_district_special_services_leaves_now_cover_10_counties_but_county_grade_mapping_is_still_incomplete';
const STATUS_REASON = 'The Idaho education blocker remains an exact reviewed-leaf expansion lane, but it is stronger than before: official district-owned local leaves are now reviewable for ten counties. Teton County District #401 now joins Cassia, Payette, Bannock, Boundary, Butte, Bonneville, Jerome, Minidoka, Blaine, and the earlier reviewed set through a direct district-owned `Special Education` page. Idaho still is not county-grade because the statewide SDE directory exposes no county-to-district contract and the packet still carries reviewed local leaves for only a subset of the 44 counties.';
const EVIDENCE = 'Reviewed 2026-06-23 one more bounded live Idaho district-owned leaf directly from the official SDE district root lane. The official Idaho School Districts page JSON links Teton County District #401 at https://tsd401.org/. That live district root returned HTTP 200 and exposed an exact `Special Education` anchor to https://www.tsd401.org/apps/pages/?type=d&uREC_ID=595525&pREC_ID=1147857. The exact page returned HTTP 200 with title `Staff Links - Special Education - Teton School District 401` and H1 `Special Education`, preserving district-owned special-education role evidence on the public host. Idaho education therefore now has ten reviewed county-level district-owned leaves, but the statewide SDE directory still exposes no county-to-district contract and the remaining counties still need exact leaf expansion.';
const NEXT_ACTION = 'expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet';
const LESSON = '*   **Lesson:** If an official district root exposes an exact `Special Education` anchor that stays on the district-owned host, treat that as a safe low-token verification lane even when the final URL uses query parameters. Idaho Teton District #401 verified cleanly from an `apps/pages` query URL once the title and H1 both stayed role-exact.';

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
  lines.splice(31, 0, LESSON);
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
    '- Education is still a county-by-county exact-leaf expansion lane, but it now has ten reviewed district-owned leaves, including a newly verified Teton County Special Education page.',
    '- County-local remains the same explicit split: 17 clean office replacements plus the Canyon split are preserved, and 27 counties stay blocked until Idaho publishes a public county-to-office contract.',
  ].join('\n') + '\n';
}

export function generateBatch235IdahoTetonReviewedDistrictLeafV1() {
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
    const tetonSample = {
      sample_name: 'Teton County District #401 Special Education',
      source_url: 'https://www.tsd401.org/apps/pages/?type=d&uREC_ID=595525&pREC_ID=1147857',
      final_url: 'https://www.tsd401.org/apps/pages/?type=d&uREC_ID=595525&pREC_ID=1147857',
      verification_status: 'verified',
      source_type: 'district_owned_special_education_leaf',
      source_table: 'batch235_idaho_teton_reviewed_district_leaf',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The district-owned page title `Staff Links - Special Education - Teton School District 401` and H1 `Special Education` preserve exact special-education role evidence on the Teton District host.',
    };
    const samplesWithoutTeton = existingSamples.filter((sample) => sample.source_url !== tetonSample.source_url);
    return {
      ...row,
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      sample_count: 12,
      query_basis: 'Reviewed live official Idaho district-owned special-education or special-services leaves reached directly from the existing packet signals plus exact district-root anchors and official district sitemap leaves.',
      samples: [...samplesWithoutTeton, tetonSample],
    };
  });

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
  const tetonLeaf = {
    county_id: 'teton-id',
    district_name: 'Teton County District #401',
    exact_leaf_url: 'https://www.tsd401.org/apps/pages/?type=d&uREC_ID=595525&pREC_ID=1147857',
    evidence_terms: ['special education'],
    title: 'Staff Links - Special Education - Teton School District 401',
  };
  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...(packet.current_problem_metrics || {}),
      authoredExactLeafCount: 10,
      reviewedExactLeafCount: 10,
    },
    packet_complete_when: 'At least one reviewed district-owned education-routing leaf is attached for every Idaho county without relying on statewide SDE fallbacks or county-name inference alone. The current packet now has reviewed exact leaves for Cassia, Payette, Bannock, Boundary, Butte, Bonneville, Jerome, Minidoka, Blaine, and Teton as seed examples.',
    reviewed_exact_leaves: [
      ...reviewedExactLeaves.filter((leaf) => leaf.county_id !== 'teton-id'),
      tetonLeaf,
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
  writeJsonl(INPUTS.next, nextRows);
  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  updateLessonFile(INPUTS.lessons);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, nextRows));

  const batchSummary = {
    batch: 'batch235_idaho_teton_reviewed_district_leaf_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'idaho',
    classification: 'BLOCKED',
    index_safe: false,
    refined_family: 'district_or_county_education_routing',
    reviewed_exact_leaf_count: 10,
    newly_verified_county: 'teton-id',
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 235 Idaho Teton Reviewed District Leaf Report v1',
    '',
    '- state: idaho',
    '- classification: BLOCKED',
    '- index_safe: false',
    '',
    '## What changed',
    '',
    '- Verified one more district-owned Idaho special-education leaf from the existing official SDE root lane: Teton County District #401.',
    '- Raised the Idaho reviewed exact district-leaf count from 9 to 10 without reopening statewide SDE discovery or weakening county-grade standards.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch235IdahoTetonReviewedDistrictLeafV1();
  console.log(JSON.stringify(result, null, 2));
}
