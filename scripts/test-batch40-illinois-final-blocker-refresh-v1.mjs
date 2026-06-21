import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch40IllinoisFinalBlockerRefreshV1 } from './run-batch40-illinois-final-blocker-refresh-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const summary = generateBatch40IllinoisFinalBlockerRefreshV1();
const stateSummary = readJson('data/generated/illinois_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/illinois_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/illinois_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/illinois_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/illinois_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/illinois-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED', 'Illinois refresh must keep the state blocked.');
assert.equal(stateSummary.classification, 'BLOCKED', 'Illinois packet summary must remain blocked.');
assert.equal(stateSummary.index_safe, false, 'Illinois must remain not index-safe.');
assert.equal(stateSummary.completeness_pct, 75, 'Illinois completeness should rise once P&A and VR are truthfully upgraded.');

const edu = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const vr = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
const pa = gapRows.find((row) => row.family === 'protection_and_advocacy');
const pti = gapRows.find((row) => row.family === 'parent_training_information_center');
const legal = gapRows.find((row) => row.family === 'legal_aid');
const county = gapRows.find((row) => row.family === 'county_local_disability_resources');

assert.equal(edu.family_status, 'blocked_exact_leaf_repair_exhausted', 'Illinois education must move to explicit exhausted-leaf blocker status.');
assert.equal(vr.family_status, 'verified_state_grade', 'Illinois VR must upgrade to verified state grade.');
assert.equal(pa.family_status, 'verified_state_grade', 'Illinois P&A must upgrade to verified state grade.');
assert.equal(pti.family_status, 'regional_only_reviewed_source', 'Illinois PTI must fail closed as regional-only evidence.');
assert.equal(legal.family_status, 'missing_verified_source', 'Illinois legal aid must remain explicit missing verified source.');
assert.equal(county.family_status, 'verified_state_grade', 'Illinois county-local must stay verified state grade.');

assert.ok(!failureRows.some((row) => row.family === 'vocational_rehabilitation_pre_ets'), 'Illinois VR must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Illinois P&A must drop out of the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'bounded_roe_leaf_packet_exhausted_before_county_grade_coverage', 'Illinois education failure code must explain packet exhaustion.');
assert.equal(failureRows.find((row) => row.family === 'parent_training_information_center').failure_code, 'reviewed_pti_sample_is_regional_not_statewide_designated_source', 'Illinois PTI must explain why the reviewed sample still fails the statewide gate.');
assert.equal(failureRows.find((row) => row.family === 'legal_aid').failure_code, 'authored_lsc_target_not_yet_replaced_with_reviewed_illinois_source', 'Illinois legal aid must explain the authored-but-unverified blocker.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'parent_training_information_center',
    'legal_aid',
  ],
  'Illinois next actions must collapse to the three real remaining blockers.',
);

assert.equal(verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets').family_status, 'verified_state_grade', 'Illinois verified sources must upgrade VR.');
assert.equal(verifiedRows.find((row) => row.family === 'protection_and_advocacy').family_status, 'verified_state_grade', 'Illinois verified sources must upgrade P&A.');
assert.ok(report.includes('Illinois final blocker decision'), 'Illinois report must include the final blocker decision section.');
assert.ok(report.includes('serving downstate Illinois'), 'Illinois report must explain why the current PTI sample does not satisfy the statewide PTI gate.');

console.log('test-batch40-illinois-final-blocker-refresh-v1: ok');
