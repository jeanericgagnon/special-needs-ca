import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  leaves: path.join(generatedDir, 'kansas_reviewed_district_owned_special_education_leaves_v1.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch239_kansas_wyandotte_district_leaf_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch239-kansas-wyandotte-district-leaf-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'reviewed_district_owned_special_education_leaves_exist_but_kansas_county_grade_coverage_is_still_incomplete';
const NEXT_ACTION = 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory_and_keep_non_matching_district_pages_frozen';
const PRIMARY_GAP_REASON = 'reviewed_kansas_district_owned_leaves_now_cover_7_counties_but_full_county_grade_coverage_is_incomplete';
const LESSON_HEADING = '### District Homepages Can Expose Exact Leaves Even When XML Sitemaps 404';
const LESSON_BODY = '*   **Lesson:** If a district-owned homepage itself exposes a role-exact href like `/special-education`, verify that exact leaf directly before spending more time on XML discovery. Kansas City Kansas Public Schools cleared Wyandotte from the homepage nav even though `/sitemap.xml` returned a district-branded 404 shell.';

const NEW_LEAF = {
  county_id: 'wyandotte-ks',
  county_name: 'wyandotte',
  district_name: 'Kansas City Kansas Public Schools USD 500',
  district_website: 'https://www.kckschools.org/',
  source_url: 'https://www.kckschools.org/special-education',
  final_url: 'https://www.kckschools.org/special-education',
  verification_status: 'verified',
  source_type: 'district_owned_special_education_leaf',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_title: 'Special Education - Kansas City Kansas Unified Schl Dist 500',
  evidence_h1: 'Special Education',
  evidence_snippet: 'The official Kansas City Kansas Public Schools homepage exposes a district-owned `/special-education` leaf, and the fetched kckschools.org page preserves role-exact Special Education content plus IDEA and Section 504 eligibility language on the district host.',
};

const NON_MATCH_SAMPLE_NAME = 'sedgwick district non-match special programs page';

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

function buildEvidence(leaves) {
  const counties = leaves.map((row) => row.county_id).sort();
  return `Reviewed 2026-06-23 bounded Kansas district-owned exact leaf checks after the public KSDE export contract was proven. District-owned special-education leaves remain reviewed for ${counties.length}/105 counties: ${counties.join(', ')}. A new bounded Wyandotte check showed the live district-owned Kansas City Kansas Public Schools root https://www.kckschools.org/ exposes an exact \`/special-education\` href on the homepage. Fetching https://www.kckschools.org/special-education returned HTTP 200 with title \`Special Education - Kansas City Kansas Unified Schl Dist 500\`, H1 \`Special Education\`, and body text preserving IDEA and Section 504 eligibility language on the district host. Sedgwick remains frozen as a non-match because https://www.usd259.org/schools23/special-programs-and-schools is still only a generic district-owned special-programs page rather than role-exact special-education routing. Kansas therefore now has one more reviewed district-owned local leaf, but county-grade education coverage is still incomplete across the 105-county packet.`;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kansas California-Grade Audit Report v2',
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
    '- Kansas remains BLOCKED and not index-safe.',
    '- Education is sharper again because reviewed district-owned leaves now exist for seven counties instead of six.',
    '- Wyandotte now clears from the district-owned Kansas City Kansas Public Schools `/special-education` leaf.',
    '- Sedgwick remains frozen as a non-match, and Kansas still does not clear until reviewed district-owned special-education or student-services leaves expand county by county across the remaining unresolved counties.',
  ].join('\n') + '\n';
}

export function generateBatch239KansasWyandotteDistrictLeafV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const existingLeaves = readJsonl(INPUTS.leaves);
  const queueRows = readJsonl(INPUTS.queue);

  const mergedLeaves = [...existingLeaves];
  if (!mergedLeaves.some((row) => row.county_id === NEW_LEAF.county_id && row.source_url === NEW_LEAF.source_url)) {
    mergedLeaves.push(NEW_LEAF);
  }
  mergedLeaves.sort((a, b) => a.county_id.localeCompare(b.county_id));

  const evidence = buildEvidence(mergedLeaves);
  const statusReason = `Kansas is past a root-only blocker: reviewed district-owned special-education leaves now exist for ${mergedLeaves.length}/105 counties, but the education family remains blocked because county-grade local leaf coverage is still incomplete across the 105-county packet. Export-backed district domains are useful authoring hints, but they still fail closed unless a role-exact local leaf is preserved on the district-owned host.`;

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...packet.current_problem_metrics,
      authoredExactLeafCount: mergedLeaves.length,
      reviewedDistrictOwnedLeafCount: mergedLeaves.length,
    },
    reviewed_local_leaf_counties: mergedLeaves.map((row) => row.county_id).sort(),
    unresolved_local_leaf_counties: packet.affected_counties.filter((countyId) => !mergedLeaves.some((row) => row.county_id === countyId)),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade', status_reason: statusReason }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    const preserved = (row.samples || []).filter((sample) => sample.sample_name !== `${NEW_LEAF.county_id.replace('-ks', '')} district-owned leaf`);
    const samples = [
      ...mergedLeaves.map((leaf) => ({
        sample_name: `${leaf.county_id.replace('-ks', '')} district-owned leaf`,
        source_url: leaf.source_url,
        final_url: leaf.final_url,
        verification_status: leaf.verification_status,
        source_type: leaf.source_type,
        source_table: 'reviewed_live_probe',
        fetched_at: leaf.fetched_at,
        evidence_snippet: leaf.evidence_snippet,
      })),
      ...preserved.filter((sample) => sample.sample_name === NON_MATCH_SAMPLE_NAME),
      ...preserved.filter((sample) => sample.sample_name !== NON_MATCH_SAMPLE_NAME),
    ];
    return {
      ...row,
      family_status: 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade',
      query_basis: 'Reviewed live district-owned Kansas special-education leaves reached from high-confidence district roots after the public KSDE export contract established a district inventory lane.',
      blocker_code: FAILURE_CODE,
      blocker_evidence: evidence,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'kansas'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.leaves, mergedLeaves);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_239_kansas_wyandotte_district_leaf_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_leaf_counties: mergedLeaves.map((row) => row.county_id).sort(),
    reviewed_leaf_count: mergedLeaves.length,
    newly_verified_county: NEW_LEAF.county_id,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.summary, batchSummary);

  const batchReport = [
    '# Batch 239 Kansas Wyandotte District Leaf v1',
    '',
    `- reviewed leaf counties: ${mergedLeaves.length}`,
    `- newly verified county: ${NEW_LEAF.county_id}`,
    '',
    '## Repair decision',
    '',
    '- Kansas remains blocked, but it now has reviewed district-owned leaves for seven counties instead of six.',
    '- Wyandotte now clears from the district-owned Kansas City Kansas Public Schools `/special-education` leaf.',
    '- Sedgwick remains a truth-gate non-match because its district-owned special-programs page is still not a role-exact special-education or student-services leaf.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch239KansasWyandotteDistrictLeafV1();
  console.log(JSON.stringify(result, null, 2));
}
