import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch37GeorgiaFinalBlockerRefreshV1 } from './run-batch37-georgia-final-blocker-refresh-v1.mjs';

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

const summary = generateBatch37GeorgiaFinalBlockerRefreshV1();
const stateSummary = readJson('data/generated/georgia_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/georgia_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/georgia_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/georgia_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/georgia_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/georgia-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED', 'Georgia refresh must keep the state blocked.');
assert.equal(stateSummary.classification, 'BLOCKED', 'Georgia packet summary must remain blocked.');
assert.equal(stateSummary.index_safe, false, 'Georgia must remain not index-safe.');
assert.equal(stateSummary.completeness_pct, 75, 'Georgia completeness must rise after statewide family truth refresh.');

const pa = gapRows.find((row) => row.family === 'protection_and_advocacy');
const pti = gapRows.find((row) => row.family === 'parent_training_information_center');
const dd = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
const edu = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const legal = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(pa.family_status, 'verified_state_grade', 'Georgia P&A must upgrade to verified state grade.');
assert.equal(pti.family_status, 'verified_state_grade', 'Georgia PTI must upgrade to verified state grade.');
assert.equal(dd.family_status, 'blocked_official_county_table_blank', 'Georgia DD must move to explicit blocked county-table status.');
assert.equal(edu.family_status, 'blocked_exact_leaf_repair_exhausted', 'Georgia education must move to explicit exhausted-leaf blocker status.');
assert.equal(legal.family_status, 'missing_verified_source', 'Georgia legal aid must remain explicit missing verified source.');

assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Georgia P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'), 'Georgia PTI must drop out of the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'bounded_official_district_leaf_packet_exhausted_before_county_grade_coverage', 'Georgia education failure code must explain packet exhaustion.');
assert.equal(failureRows.find((row) => row.family === 'legal_aid').failure_code, 'authored_legal_aid_directory_not_yet_verified', 'Georgia legal aid must explain the authored-but-unverified blocker.');

assert.deepEqual(nextRows.map((row) => row.family), ['developmental_disability_idd_authority', 'district_or_county_education_routing', 'legal_aid'], 'Georgia next actions must collapse to the three real remaining blockers.');
assert.equal(verifiedRows.find((row) => row.family === 'protection_and_advocacy').family_status, 'verified_state_grade', 'Georgia verified sources must upgrade P&A.');
assert.equal(verifiedRows.find((row) => row.family === 'parent_training_information_center').family_status, 'verified_state_grade', 'Georgia verified sources must upgrade PTI.');
assert.ok(report.includes('Georgia final blocker decision'), 'Georgia report must include the final blocker decision section.');

console.log('test-batch37-georgia-final-blocker-refresh-v1: ok');
