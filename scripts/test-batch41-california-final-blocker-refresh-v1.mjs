import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch41CaliforniaFinalBlockerRefreshV1 } from './run-batch41-california-final-blocker-refresh-v1.mjs';

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

const summary = generateBatch41CaliforniaFinalBlockerRefreshV1();
const stateSummary = readJson('data/generated/california_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/california_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/california_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/california_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/california_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/california-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED', 'California refresh must final-block the state.');
assert.equal(stateSummary.classification, 'BLOCKED', 'California packet summary must be blocked.');
assert.equal(stateSummary.index_safe, false, 'California must remain not index-safe.');
assert.equal(stateSummary.completeness_pct, 75, 'California completeness should rise once reviewed statewide families are reconciled.');
assert.equal(stateSummary.strong_critical_families, 9, 'California should have nine strong critical families after the truthful upgrades.');
assert.equal(stateSummary.weak_critical_families, 2, 'California should retain only the two county-grade weak blockers.');
assert.equal(stateSummary.missing_critical_families, 1, 'California should retain only the missing statewide PTI blocker.');

const early = gapRows.find((row) => row.family === 'early_intervention_part_c');
const edu = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const vr = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
const pa = gapRows.find((row) => row.family === 'protection_and_advocacy');
const pti = gapRows.find((row) => row.family === 'parent_training_information_center');
const legal = gapRows.find((row) => row.family === 'legal_aid');
const county = gapRows.find((row) => row.family === 'county_local_disability_resources');

assert.equal(early.family_status, 'verified_state_grade', 'California Early Start must upgrade to verified state grade.');
assert.equal(edu.family_status, 'blocked_exact_leaf_repair_exhausted', 'California education must move to explicit exhausted-leaf blocker status.');
assert.equal(vr.family_status, 'verified_state_grade', 'California VR must upgrade to verified state grade.');
assert.equal(pa.family_status, 'verified_state_grade', 'California P&A must upgrade to verified state grade.');
assert.equal(pti.family_status, 'missing_verified_statewide_source', 'California PTI must remain an explicit missing statewide reviewed source.');
assert.equal(legal.family_status, 'verified_state_grade', 'California legal aid must upgrade to verified state grade.');
assert.equal(county.family_status, 'blocked_exact_leaf_repair_exhausted', 'California county-local must move to explicit exhausted-leaf blocker status.');

assert.ok(!failureRows.some((row) => row.family === 'early_intervention_part_c'), 'California Early Start must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'vocational_rehabilitation_pre_ets'), 'California VR must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'California P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'), 'California legal aid must drop out of the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'bounded_exact_leaf_packet_exhausted_before_statewide_district_grade_coverage', 'California education failure code must explain packet exhaustion.');
assert.equal(failureRows.find((row) => row.family === 'parent_training_information_center').failure_code, 'designated_statewide_pti_target_not_reviewed_or_verified', 'California PTI must explain the missing reviewed statewide target.');
assert.equal(failureRows.find((row) => row.family === 'county_local_disability_resources').failure_code, 'reviewed_county_examples_do_not_prove_statewide_county_grade_office_coverage', 'California county-local must explain why sample county leaves are not statewide proof.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'county_local_disability_resources',
    'parent_training_information_center',
  ],
  'California next actions must collapse to the three real remaining blockers.',
);

assert.equal(verifiedRows.find((row) => row.family === 'early_intervention_part_c').family_status, 'verified_state_grade', 'California verified sources must upgrade Early Start.');
assert.equal(verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets').family_status, 'verified_state_grade', 'California verified sources must upgrade VR.');
assert.equal(verifiedRows.find((row) => row.family === 'protection_and_advocacy').family_status, 'verified_state_grade', 'California verified sources must upgrade P&A.');
assert.equal(verifiedRows.find((row) => row.family === 'legal_aid').family_status, 'verified_state_grade', 'California verified sources must upgrade legal aid.');
assert.equal(verifiedRows.find((row) => row.family === 'parent_training_information_center').sample_count, 0, 'California PTI must not preserve misleading sample rows.');

assert.ok(report.includes('California final blocker decision'), 'California report must include the final blocker decision section.');
assert.ok(report.includes('67 county headings'), 'California report must explain the structured county-coverage basis for Early Start.');
assert.ok(report.includes('Matrix Parent Network and Resource Center'), 'California report must explain the missing reviewed PTI source against the designated statewide target.');

console.log('test-batch41-california-final-blocker-refresh-v1: ok');
