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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  packet: path.join(generatedDir, 'kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  leaves: path.join(generatedDir, 'kansas_reviewed_district_owned_special_education_leaves_v1.jsonl'),
  summary: path.join(generatedDir, 'batch210_kansas_reviewed_district_owned_leaves_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch210-kansas-reviewed-district-owned-leaves-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const LESSON_HEADING = '### If The Public All-District Export Errors, Fall Back To District-Scoped Exports';
const LESSON_BODY = '*   **Lesson:** If a public directory app exposes an `***ALL DISTRICTS***` option but that broad export returns a generic problem shell, retry the same official submit contract with one exact district selector. Kansas `Directory_Rpts` still returned the full `Directory.xls` workbook from district-scoped submits even when the broad all-district attempt failed.';

const VERIFIED_FAILURE_CODE = 'reviewed_district_owned_special_education_leaves_exist_but_kansas_county_grade_coverage_is_still_incomplete';
const VERIFIED_STATUS_REASON = 'Kansas is past a root-only blocker: reviewed district-owned special-education leaves now exist for a small county subset, but the education family remains blocked because county-grade local leaf coverage is still incomplete across the 105-county packet.';

const REVIEWED_LEAVES = [
  {
    county_id: 'atchison-ks',
    county_name: 'atchison',
    district_name: 'Atchison Public Schools USD 409',
    district_website: 'https://www.usd409.net/',
    source_url: 'https://www.usd409.net/page/special-education-services/',
    final_url: 'https://www.usd409.net/page/special-education-services/',
    verification_status: 'verified',
    source_type: 'district_owned_special_education_leaf',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_title: 'Special Education Services | Atchison Public Schools',
    evidence_h1: null,
    evidence_snippet: 'Special Education Services | Atchison Public Schools preserves a district-owned special-education services leaf on the official usd409.net host.',
  },
  {
    county_id: 'butler-ks',
    county_name: 'butler',
    district_name: 'Andover Public Schools USD 385',
    district_website: 'https://www.usd385.org/',
    source_url: 'https://www.usd385.org/departments/special-education',
    final_url: 'https://www.usd385.org/departments/special-education',
    verification_status: 'verified',
    source_type: 'district_owned_special_education_leaf',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_title: 'Special Education - Andover Public Schools',
    evidence_h1: 'Special Education',
    evidence_snippet: 'The official usd385.org district-owned Special Education leaf preserves role-exact special-education content on the live Andover Public Schools host.',
  },
  {
    county_id: 'shawnee-ks',
    county_name: 'shawnee',
    district_name: 'Topeka Public Schools USD 501',
    district_website: 'https://www.topekapublicschools.net/',
    source_url: 'https://www.topekapublicschools.net/departments/special_education',
    final_url: 'https://www.topekapublicschools.net/departments/special_education',
    verification_status: 'verified',
    source_type: 'district_owned_special_education_leaf',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_title: 'Special Education - Topeka Public Schools',
    evidence_h1: 'Topeka Public Schools',
    evidence_snippet: 'The official Topeka Public Schools host preserves a district-owned Special Education department leaf on the live public site.',
  },
];

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

function buildEvidence() {
  const counties = REVIEWED_LEAVES.map((row) => row.county_id).sort();
  return `Reviewed 2026-06-23 bounded Kansas district-owned exact leaf checks after the public KSDE export contract was proven. District-owned special-education leaves are now reviewed for ${counties.length}/105 counties: ${counties.join(', ')}. https://www.usd385.org/departments/special-education returned HTTP 200 with title \`Special Education - Andover Public Schools\` and H1 \`Special Education\`. https://www.usd409.net/page/special-education-services/ returned HTTP 200 with title \`Special Education Services | Atchison Public Schools\` on the district-owned host. https://www.topekapublicschools.net/departments/special_education returned HTTP 200 with title \`Special Education - Topeka Public Schools\` on the district-owned host. A bounded probe also showed the public KSDE app's \`***ALL DISTRICTS***\` export attempt returns the generic \`There was a problem\` shell, while district-scoped submits still return the workbook contract. Kansas therefore has real reviewed district-owned leaves for a small county subset, but education remains blocked until that local-leaf coverage expands county by county across the 105-county packet.`;
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
    '- Education is sharper than before because reviewed district-owned leaves now exist for a real county subset rather than only a public export contract.',
    '- Kansas still does not clear until reviewed district-owned special-education or student-services leaves expand county by county across the remaining unresolved counties.',
  ].join('\n') + '\n';
}

export function generateBatch210KansasReviewedDistrictOwnedLeavesV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const packet = readJson(INPUTS.packet);
  const evidence = buildEvidence();

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...packet.current_problem_metrics,
      authoredExactLeafCount: REVIEWED_LEAVES.length,
      reviewedDistrictOwnedLeafCount: REVIEWED_LEAVES.length,
    },
    reviewed_local_leaf_counties: REVIEWED_LEAVES.map((row) => row.county_id).sort(),
    unresolved_local_leaf_counties: packet.affected_counties.filter((countyId) => !REVIEWED_LEAVES.some((row) => row.county_id === countyId)),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade', status_reason: VERIFIED_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: VERIFIED_FAILURE_CODE, evidence, next_action: 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory' }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade',
          query_basis: 'Reviewed live district-owned Kansas special-education leaves reached from high-confidence district roots after the public KSDE export contract established a district inventory lane.',
          blocker_code: VERIFIED_FAILURE_CODE,
          blocker_evidence: evidence,
          sample_count: REVIEWED_LEAVES.length + 2,
          samples: [
            ...REVIEWED_LEAVES.map((leaf) => ({
              sample_name: `${leaf.county_name} district-owned leaf`,
              source_url: leaf.source_url,
              final_url: leaf.final_url,
              verification_status: leaf.verification_status,
              source_type: leaf.source_type,
              source_table: 'reviewed_live_probe',
              fetched_at: leaf.fetched_at,
              evidence_snippet: leaf.evidence_snippet,
            })),
            {
              sample_name: 'Kansas Educational Directory Reports home page',
              source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              verification_status: 'reviewed',
              source_type: 'official_public_directory_app',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public KSDE Directory Reports app still preserves the exact district-scoped export contract that feeds Kansas district-owned leaf repair.',
            },
            {
              sample_name: 'Kansas all-district export problem shell',
              source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              verification_status: 'blocked',
              source_type: 'official_all_district_export_problem_shell',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded `***ALL DISTRICTS***` export attempt returned the generic `There was a problem` shell, so Kansas repair should keep using district-scoped submits rather than the broad export mode.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, next_action: 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory', evidence }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'reviewed_kansas_district_owned_leaves_exist_but_full_county_grade_coverage_is_incomplete',
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: VERIFIED_FAILURE_CODE, evidence, next_action: 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory' }
        : row
    )),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'kansas'
      ? { ...row, primary_gap_reason: updatedSummary.primary_gap_reason }
      : row
  ));

  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(OUTPUTS.leaves, REVIEWED_LEAVES);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_210_kansas_reviewed_district_owned_leaves_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_leaf_counties: REVIEWED_LEAVES.map((row) => row.county_id).sort(),
    reviewed_leaf_count: REVIEWED_LEAVES.length,
    lessons_updated: lessonsUpdated,
  });

  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 210 Kansas Reviewed District-Owned Leaves v1',
      '',
      `- reviewed leaf counties: ${REVIEWED_LEAVES.length}`,
      `- counties: ${REVIEWED_LEAVES.map((row) => row.county_id).sort().join(', ')}`,
      '',
      '## Repair decision',
      '',
      '- Kansas remains blocked, but it now has reviewed district-owned leaves for a real county subset instead of only a public export contract.',
      '- The broad `***ALL DISTRICTS***` export mode returned the generic problem shell in a bounded probe, so future work should stay on district-scoped exports plus district-owned leaf verification.',
    ].join('\n') + '\n',
  );

  return {
    classification: updatedSummary.classification,
    reviewedLeafCount: REVIEWED_LEAVES.length,
    primaryGapReason: updatedSummary.primary_gap_reason,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch210KansasReviewedDistrictOwnedLeavesV1();
}
