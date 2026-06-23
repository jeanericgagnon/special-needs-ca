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
  summary: path.join(generatedDir, 'batch256_kansas_leavenworth_leaf_final_blocker_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch256-kansas-leavenworth-leaf-final-blocker-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'reviewed_kansas_district_owned_leaves_now_cover_8_counties_but_export_backed_county_grade_coverage_is_still_incomplete';
const NEXT_ACTION = 'continue_export_backed_district_and_affiliated_coop_leaf_authoring_county_by_county_and_keep_exact_non_matches_frozen';
const PRIMARY_GAP_REASON = 'reviewed_kansas_district_owned_leaves_now_cover_8_counties_but_export_backed_county_grade_coverage_is_still_incomplete';

const LESSON_HEADING = '### District Site Maps Can Surface Cooperative Leads Without Clearing County-Grade Routing';
const LESSON_BODY = '*   **Lesson:** If an official district site map labels a link as `Special Education Services` but sends users to a separate cooperative or interlocal host, treat that destination as a high-value local lead rather than an automatic county clear. Kansas Salina USD 305 linked `Special Education Services` into CKCIE, but the bounded pass still needed a role-pure local routing contract before promoting the county.';

const NEW_LEAF = {
  county_id: 'leavenworth-ks',
  county_name: 'leavenworth',
  district_name: 'Leavenworth USD 453',
  district_website: 'https://www.usd453.org/',
  source_url: 'https://www.usd453.org/district-departments/special-education',
  final_url: 'https://www.usd453.org/district-departments/special-education',
  verification_status: 'verified',
  source_type: 'district_owned_special_education_leaf',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_title: 'Special Education - Leavenworth Unified School District',
  evidence_h1: 'Special Education',
  evidence_snippet: 'The official Leavenworth USD 453 homepage exposes a district-owned Special Education leaf, and the fetched usd453.org page preserves role-exact special-education routing on the district host.',
};

const SALINE_COOP_LEAD = {
  sample_name: 'saline district-linked cooperative lead',
  source_url: 'https://www.usd305.com/site-map',
  final_url: 'https://www.305ckcie.com/departments/early-childhood-special-education',
  verification_status: 'reviewed',
  source_type: 'district_site_map_to_local_special_education_coop',
  source_table: 'reviewed_live_probe',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_snippet: 'The official Salina USD 305 site map and Administrative & Student Support page label a link as `Special Education Services` and send it to CKCIE. The linked CKCIE host says it provides special education services to more than 3,100 students across 12 school districts, but this bounded pass did not yet recover a role-pure school-age county contract from the cooperative stack.',
};

const RILEY_NON_MATCH = {
  sample_name: 'riley district exact-leaf non-match',
  source_url: 'https://www.usd383.org/sitemap.xml',
  final_url: 'https://www.usd383.org/search-results?q=special%20education',
  verification_status: 'reviewed',
  source_type: 'district_owned_sitemap_and_search_without_role_exact_leaf',
  source_table: 'reviewed_live_probe',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_snippet: 'The official Manhattan-Ogden USD 383 host stayed live, but `/sitemap.xml` preserved no role-exact special-education or student-services leaf and bounded `/search-results?q=special education` and `student services` checks both returned 404.',
};

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
  return `Reviewed 2026-06-23 one bounded official Kansas district-routing pass using only export-backed district hosts and current public district pages. District-owned special-education leaves now cover ${leaves.length}/105 counties: ${counties.join(', ')}. A new Leavenworth review showed https://www.usd453.org/ exposes an exact district-owned Special Education href and https://www.usd453.org/district-departments/special-education returned HTTP 200 with title \`Special Education - Leavenworth Unified School District\` and H1 \`Special Education\`. Saline produced a stronger official local lead but not a final clear: https://www.usd305.com/site-map and https://www.usd305.com/departments/administrative-student-support both label a link as \`Special Education Services\` and send it to https://www.305ckcie.com/departments/early-childhood-special-education, while the CKCIE home page says it provides special education services to more than 3,100 students across 12 school districts. That is a real local cooperative lead, but this bounded pass still did not recover a role-pure school-age county contract from the cooperative stack. Riley became a deterministic non-match: https://www.usd383.org/sitemap.xml stayed public but exposed no role-exact special-education or student-services leaf, and bounded search-result URLs on the same host returned 404. Kansas therefore remains blocked because county-grade education proof is still incomplete across the 105-county packet even after Leavenworth clears.`;
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
    '- Education is the only remaining critical blocker.',
    '- Leavenworth now clears from an exact district-owned Special Education leaf on usd453.org, raising the reviewed county total to eight.',
    '- Saline now has a stronger official district-linked cooperative lead through CKCIE, but this bounded pass did not recover a role-pure school-age county contract, so it stays blocked.',
    '- Riley is now an exact official non-match rather than an open authoring question: the district sitemap stayed public, but no role-exact leaf survived and bounded search URLs 404ed.',
    '- Kansas still does not clear until more export-backed district or cooperative local leaves are reviewed county by county across the remaining unresolved counties.',
  ].join('\n') + '\n';
}

export function generateBatch256KansasLeavenworthLeafFinalBlockerV1() {
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
  const statusReason = `Kansas is past a root-only blocker: reviewed district-owned special-education leaves now exist for ${mergedLeaves.length}/105 counties, but county-grade local education routing is still incomplete across the packet. Export-backed district hosts remain the right lane, and some districts now expose stronger affiliated cooperative signals, but Kansas still fails closed unless a role-exact district or local routing contract is preserved on the official host stack.`;

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
      ? { ...row, family_status: 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade', status_reason: statusReason }
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
      `${NEW_LEAF.county_id.replace('-ks', '')} district-owned leaf`,
      SALINE_COOP_LEAD.sample_name,
      RILEY_NON_MATCH.sample_name,
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
      SALINE_COOP_LEAD,
      RILEY_NON_MATCH,
      ...preserved.filter((sample) => !mergedLeaves.some((leaf) => sample.sample_name === `${leaf.county_id.replace('-ks', '')} district-owned leaf`)),
    ];
    return {
      ...row,
      family_status: 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade',
      query_basis: 'Reviewed one bounded Kansas district-routing pass against export-backed official district hosts, district site maps, and current same-domain special-education leaves.',
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
      ? { ...row, status: updatedSummary.classification, classification: updatedSummary.classification, primary_gap_reason: PRIMARY_GAP_REASON }
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

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_256_kansas_leavenworth_leaf_final_blocker_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: 'BLOCKED',
    index_safe: false,
    reviewed_leaf_counties: mergedLeaves.map((row) => row.county_id),
    reviewed_leaf_count: mergedLeaves.length,
    newly_verified_county: 'leavenworth-ks',
    saline_coop_lead_preserved: true,
    riley_non_match_frozen: true,
    lessons_updated: lessonAdded,
  };
  writeJson(OUTPUTS.summary, batchSummary);

  const report = [
    '# Batch 256 Kansas Leavenworth Leaf Final Blocker Report v1',
    '',
    '- state: Kansas',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: district_or_county_education_routing',
    `- failure_code: ${FAILURE_CODE}`,
    '',
    '## Outcome',
    '',
    '- Leavenworth now clears from an exact district-owned Special Education leaf on usd453.org.',
    '- Saline now has a stronger official district-linked cooperative lead through CKCIE, but that cooperative route still did not provide a role-pure school-age county contract in this bounded pass.',
    '- Riley is now a deterministic official non-match: public sitemap stayed live, but exact search URLs 404ed and no role-exact leaf was preserved.',
    '- Kansas remains blocked because only 8/105 counties currently have reviewed district-owned special-education leaves.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.report, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch256KansasLeavenworthLeafFinalBlockerV1();
  console.log(JSON.stringify(summary, null, 2));
}
