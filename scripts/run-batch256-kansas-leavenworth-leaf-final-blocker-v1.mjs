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

const FAILURE_CODE = 'reviewed_kansas_district_owned_leaves_now_cover_9_counties_but_export_backed_county_grade_coverage_is_still_incomplete';
const NEXT_ACTION = 'continue_export_backed_district_and_affiliated_coop_leaf_authoring_county_by_county_and_keep_exact_non_matches_frozen';
const PRIMARY_GAP_REASON = 'reviewed_kansas_district_owned_leaves_now_cover_9_counties_but_export_backed_county_grade_coverage_is_still_incomplete';

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

const RILEY_LEAF = {
  county_id: 'riley-ks',
  county_name: 'riley',
  district_name: 'Manhattan-Ogden USD 383',
  district_website: 'https://www.usd383.org/',
  source_url: 'https://www.usd383.org/32689_3',
  final_url: 'https://www.usd383.org/32689_3',
  verification_status: 'verified',
  source_type: 'district_owned_special_education_leaf',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_title: 'Manhattan-Ogden Unified School District 383 - About Special Education',
  evidence_h1: 'About Special Education',
  evidence_snippet: 'The official Manhattan-Ogden USD 383 About Special Education leaf says the district is committed to providing a continuum of special education services for eligible students ages 3-21 and names the local Special Education department contact at 785-587-2000.',
};

const RILEY_SUPPORTING_REVIEW = {
  sample_name: 'riley district early-learning special-education support leaf',
  source_url: 'https://www.usd383.org/34871_3',
  final_url: 'https://www.usd383.org/34871_3',
  verification_status: 'reviewed',
  source_type: 'district_owned_developmental_concerns_special_education_leaf',
  source_table: 'reviewed_live_probe',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_snippet: 'The official Manhattan-Ogden USD 383 Developmental Concerns & Special Education leaf preserves early-learning and IEP intake context on the same district-owned host and reinforces the district special-education routing lane.',
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

function buildEvidence(leaves) {
  const counties = leaves.map((row) => row.county_id).sort();
  return `Reviewed 2026-06-23 one bounded official Kansas district-routing pass using only export-backed district hosts and current public district pages. District-owned special-education leaves now cover ${leaves.length}/105 counties: ${counties.join(', ')}. Leavenworth remains a clean exact district-owned clear: https://www.usd453.org/district-departments/special-education returned HTTP 200 with title \`Special Education - Leavenworth Unified School District\` and H1 \`Special Education\`. Riley also now clears from exact district-owned leaves on the live USD 383 host: https://www.usd383.org/32689_3 returned HTTP 200 with title \`Manhattan-Ogden Unified School District 383 - About Special Education\` and preserved district text saying USD 383 provides a continuum of special education services for eligible students ages 3-21, while https://www.usd383.org/34871_3 preserved district-owned developmental concerns and IEP intake context on the same host. Saline produced a stronger official local lead but not a final clear: https://www.usd305.com/site-map and https://www.usd305.com/departments/administrative-student-support both label a link as \`Special Education Services\` and send it to https://www.305ckcie.com/departments/early-childhood-special-education, while the CKCIE home page says it provides special education services to more than 3,100 students across 12 school districts. That is a real local cooperative lead, but this bounded pass still did not recover a role-pure school-age county contract from the cooperative stack. Kansas therefore remains blocked because county-grade education proof is still incomplete across the 105-county packet even after Riley and Leavenworth clear.`;
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
    '- Leavenworth remains a reviewed exact district-owned Special Education clear on usd453.org.',
    '- Riley now clears from exact district-owned USD 383 special-education leaves, raising the reviewed county total to nine.',
    '- Saline now has a stronger official district-linked cooperative lead through CKCIE, but this bounded pass did not recover a role-pure school-age county contract, so it stays blocked.',
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
  if (!mergedLeaves.some((row) => row.county_id === RILEY_LEAF.county_id && row.source_url === RILEY_LEAF.source_url)) {
    mergedLeaves.push(RILEY_LEAF);
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
        `${RILEY_LEAF.county_id.replace('-ks', '')} district-owned leaf`,
        SALINE_COOP_LEAD.sample_name,
        RILEY_SUPPORTING_REVIEW.sample_name,
        'riley district exact-leaf non-match',
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
      RILEY_SUPPORTING_REVIEW,
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

  const batchSummary = {
    batch: 'batch_256_kansas_leavenworth_leaf_final_blocker_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: 'BLOCKED',
    index_safe: false,
    reviewed_leaf_counties: mergedLeaves.map((row) => row.county_id),
    reviewed_leaf_count: mergedLeaves.length,
    newly_verified_county: 'leavenworth-ks',
    newly_verified_supporting_county: 'riley-ks',
    saline_coop_lead_preserved: true,
    riley_verified_leaf_added: true,
    lessons_updated: false,
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
    '- Leavenworth remains cleared from an exact district-owned Special Education leaf on usd453.org.',
    '- Riley now clears from exact district-owned USD 383 special-education leaves with substantive district special-education text on the public host.',
    '- Saline now has a stronger official district-linked cooperative lead through CKCIE, but that cooperative route still did not provide a role-pure school-age county contract in this bounded pass.',
    '- Kansas remains blocked because only 9/105 counties currently have reviewed district-owned special-education leaves.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.report, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch256KansasLeavenworthLeafFinalBlockerV1();
  console.log(JSON.stringify(summary, null, 2));
}
