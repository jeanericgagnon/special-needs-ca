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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch227_kansas_add_reviewed_district_owned_leaves_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch227-kansas-add-reviewed-district-owned-leaves-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'reviewed_district_owned_special_education_leaves_exist_but_kansas_county_grade_coverage_is_still_incomplete';
const NEXT_ACTION = 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory';
const PRIMARY_GAP_REASON = 'reviewed_kansas_district_owned_leaves_exist_but_full_county_grade_coverage_is_incomplete';

const NEW_LEAVES = [
  {
    county_id: 'johnson-ks',
    county_name: 'johnson',
    district_name: 'Olathe Public Schools USD 233',
    district_website: 'https://www.olatheschools.org/',
    source_url: 'https://www.olatheschools.org/academics/special-education',
    final_url: 'https://www.olatheschools.org/academics/special-education',
    verification_status: 'verified',
    source_type: 'district_owned_special_education_leaf',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_title: 'Special Education',
    evidence_h1: 'Special Education',
    evidence_snippet: 'The official Olathe Public Schools host preserves a role-exact Special Education leaf on the district-owned olatheschools.org domain.',
  },
  {
    county_id: 'douglas-ks',
    county_name: 'douglas',
    district_name: 'Lawrence Public Schools USD 497',
    district_website: 'https://www.usd497.org/',
    source_url: 'https://www.usd497.org/about-us/departments/student-support-services/special-education-services',
    final_url: 'https://www.usd497.org/about-us/departments/student-support-services/special-education-services',
    verification_status: 'verified',
    source_type: 'district_owned_special_education_leaf',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_title: 'Special Education Services - Lawrence Public Schools',
    evidence_h1: 'Special Education Services',
    evidence_snippet: 'The official Lawrence Public Schools host preserves a district-owned Special Education Services leaf under Student Support Services on usd497.org.',
  },
  {
    county_id: 'finney-ks',
    county_name: 'finney',
    district_name: 'Garden City Public Schools USD 457',
    district_website: 'https://www.gckschools.com/',
    source_url: 'https://www.gckschools.com/page/special-education/',
    final_url: 'https://www.gckschools.com/page/special-education/',
    verification_status: 'verified',
    source_type: 'district_owned_special_education_leaf',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_title: 'Special Education | Garden City Public Schools',
    evidence_h1: null,
    evidence_snippet: 'The live Garden City Public Schools sitemap exposes an exact district-owned Special Education leaf, and the fetched gckschools.com page preserves role-exact special-education content on the district host.',
  },
];

const SEDGWICK_NON_MATCH = {
  sample_name: 'sedgwick district non-match special programs page',
  source_url: 'https://www.usd259.org/schools23/special-programs-and-schools',
  final_url: 'https://www.usd259.org/schools23/special-programs-and-schools',
  verification_status: 'reviewed',
  source_type: 'district_owned_generic_special_programs_page',
  source_table: 'reviewed_live_probe',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_snippet: 'Wichita Public Schools preserves a live district-owned `Special Schools and Programs` page on usd259.org, but the exact page does not surface role-exact special-education or student-services routing and therefore does not satisfy county-grade education proof.',
};

const LESSON_HEADING = '### District Nav Or Sitemaps Can Produce Exact Leaves Even When The XML Endpoint Fails';
const LESSON_BODY = "*   **Lesson:** If a district host returns a 404 on `/sitemap.xml`, still inspect the rendered nav for role-exact hrefs before giving up. Kansas surfaced Olathe and Lawrence special-education leaves from district nav links, while Garden City's live XML sitemap exposed `/page/special-education/` directly.";

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
    '- Education is sharper than before because reviewed district-owned leaves now exist for six counties rather than only three.',
    '- Sedgwick still proves the gate is holding: a live district-owned `Special Schools and Programs` page does not count without role-exact special-education or student-services routing.',
    '- Kansas still does not clear until reviewed district-owned special-education or student-services leaves expand county by county across the remaining unresolved counties.',
  ].join('\n') + '\n';
}

function buildEvidence(leaves) {
  const counties = leaves.map((row) => row.county_id).sort();
  return `Reviewed 2026-06-23 bounded Kansas district-owned exact leaf checks after the public KSDE export contract was proven. District-owned special-education leaves are now reviewed for ${counties.length}/105 counties: ${counties.join(', ')}. https://www.usd385.org/departments/special-education returned HTTP 200 with title \`Special Education - Andover Public Schools\` and H1 \`Special Education\`. https://www.usd409.net/page/special-education-services/ returned HTTP 200 with title \`Special Education Services | Atchison Public Schools\` on the district-owned host. https://www.topekapublicschools.net/departments/special_education returned HTTP 200 with title \`Special Education - Topeka Public Schools\` on the district-owned host. https://www.olatheschools.org/academics/special-education returned HTTP 200 with title and H1 \`Special Education\` on the district-owned host. https://www.usd497.org/about-us/departments/student-support-services/special-education-services returned HTTP 200 with title \`Special Education Services - Lawrence Public Schools\` and H1 \`Special Education Services\`. https://www.gckschools.com/page/special-education/ returned HTTP 200 with title \`Special Education | Garden City Public Schools\`, and the live district sitemap exposed that exact leaf. A bounded Sedgwick follow-up also showed https://www.usd259.org/schools23/special-programs-and-schools is live on the district-owned host but remains a generic \`Special Schools and Programs\` page rather than a role-exact special-education or student-services leaf. Kansas therefore has real reviewed district-owned leaves for a larger county subset, but education remains blocked until local-leaf coverage expands county by county across the 105-county packet.`;
}

export function generateBatch227KansasAddReviewedDistrictOwnedLeavesV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const existingLeaves = readJsonl(INPUTS.leaves);

  const mergedLeaves = [...existingLeaves];
  for (const leaf of NEW_LEAVES) {
    if (!mergedLeaves.some((row) => row.county_id === leaf.county_id && row.source_url === leaf.source_url)) {
      mergedLeaves.push(leaf);
    }
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
    const preserved = (row.samples || []).filter((sample) => ![
      'atchison district-owned leaf',
      'butler district-owned leaf',
      'shawnee district-owned leaf',
      'johnson district-owned leaf',
      'douglas district-owned leaf',
      'finney district-owned leaf',
      'sedgwick district non-match special programs page',
    ].includes(sample.sample_name));
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
      SEDGWICK_NON_MATCH,
      ...preserved,
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

  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.leaves, mergedLeaves);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_227_kansas_add_reviewed_district_owned_leaves_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_leaf_counties: mergedLeaves.map((row) => row.county_id).sort(),
    reviewed_leaf_count: mergedLeaves.length,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.summary, batchSummary);

  const batchReport = [
    '# Batch 227 Kansas Add Reviewed District-Owned Leaves v1',
    '',
    `- reviewed leaf counties: ${mergedLeaves.length}`,
    `- counties: ${mergedLeaves.map((row) => row.county_id).sort().join(', ')}`,
    '',
    '## Repair decision',
    '',
    '- Kansas remains blocked, but it now has reviewed district-owned leaves for six counties instead of three.',
    '- Johnson, Douglas, and Finney now clear from district-owned special-education leaves on Olathe, Lawrence, and Garden City hosts.',
    '- Sedgwick still demonstrates the truth gate: a generic `Special Schools and Programs` page is not a role-exact special-education or student-services leaf.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch227KansasAddReviewedDistrictOwnedLeavesV1();
  console.log(JSON.stringify(result, null, 2));
}
