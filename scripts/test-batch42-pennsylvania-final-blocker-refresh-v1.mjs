import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch42PennsylvaniaFinalBlockerRefreshV1 } from './run-batch42-pennsylvania-final-blocker-refresh-v1.mjs';

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

const summary = generateBatch42PennsylvaniaFinalBlockerRefreshV1();
const stateSummary = readJson('data/generated/pennsylvania_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/pennsylvania_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/pennsylvania_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/pennsylvania_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/pennsylvania_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/pennsylvania-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED', 'Pennsylvania refresh must final-block the state.');
assert.equal(stateSummary.classification, 'BLOCKED', 'Pennsylvania packet summary must be blocked.');
assert.equal(stateSummary.index_safe, false, 'Pennsylvania must remain not index-safe.');
assert.equal(stateSummary.completeness_pct, 83, 'Pennsylvania completeness should stay 83 because the evidence picture is unchanged, only the closure state is corrected.');
assert.equal(stateSummary.strong_critical_families, 10, 'Pennsylvania should retain ten strong critical families.');
assert.equal(stateSummary.weak_critical_families, 1, 'Pennsylvania should retain one weak critical family.');
assert.equal(stateSummary.missing_critical_families, 1, 'Pennsylvania should retain one missing critical family.');

const edu = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const legal = gapRows.find((row) => row.family === 'legal_aid');

assert.equal(edu.family_status, 'blocked_exact_leaf_repair_exhausted', 'Pennsylvania education must move to explicit exhausted-leaf blocker status.');
assert.equal(legal.family_status, 'missing_verified_source', 'Pennsylvania legal aid must remain explicit missing reviewed source.');

assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'iu19_root_unresolved_after_bounded_exact_leaf_repair', 'Pennsylvania education failure code must collapse to the shared IU19 root blocker.');
assert.equal(failureRows.find((row) => row.family === 'legal_aid').failure_code, 'authored_lsc_target_not_yet_replaced_with_reviewed_pennsylvania_source', 'Pennsylvania legal aid must explain the authored-but-unverified blocker.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  ['district_or_county_education_routing', 'legal_aid'],
  'Pennsylvania next actions must collapse to the two real final blockers.',
);

assert.equal(verifiedRows.find((row) => row.family === 'district_or_county_education_routing').family_status, 'blocked_exact_leaf_repair_exhausted', 'Pennsylvania verified sources must reflect the final-blocked education state.');
assert.equal(verifiedRows.find((row) => row.family === 'legal_aid').family_status, 'missing_verified_source', 'Pennsylvania verified sources must reflect the missing reviewed legal-aid source.');
assert.ok(report.includes('Pennsylvania final blocker decision'), 'Pennsylvania report must include the final blocker decision section.');
assert.ok(report.includes('Northeastern Educational Intermediate Unit 19'), 'Pennsylvania report must name the shared IU 19 blocker explicitly.');
assert.ok(report.includes('authored planning target'), 'Pennsylvania report must explain that legal aid is still only at planning-target level.');

console.log('test-batch42-pennsylvania-final-blocker-refresh-v1: ok');
