import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch38OhioFinalBlockerRefreshV1 } from './run-batch38-ohio-final-blocker-refresh-v1.mjs';

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

const summary = generateBatch38OhioFinalBlockerRefreshV1();
const stateSummary = readJson('data/generated/ohio_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/ohio_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/ohio_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/ohio_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/ohio_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/ohio-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED', 'Ohio refresh must keep the state blocked.');
assert.equal(stateSummary.classification, 'BLOCKED', 'Ohio packet summary must remain blocked.');
assert.equal(stateSummary.index_safe, false, 'Ohio must remain not index-safe.');
assert.equal(stateSummary.completeness_pct, 50, 'Ohio completeness should remain 50 until statewide support families are truly verified.');

const county = gapRows.find((row) => row.family === 'county_local_disability_resources');
const edu = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const vr = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
const pa = gapRows.find((row) => row.family === 'protection_and_advocacy');
const pti = gapRows.find((row) => row.family === 'parent_training_information_center');
const legal = gapRows.find((row) => row.family === 'legal_aid');

assert.equal(county.family_status, 'blocked_missing_live_official_county_directory', 'Ohio county-local must move to explicit missing-live-directory blocker status.');
assert.equal(edu.family_status, 'blocked_exact_leaf_repair_exhausted', 'Ohio education must move to explicit exhausted-leaf blocker status.');
assert.equal(vr.family_status, 'planning_target_only', 'Ohio VR must remain planning-only without reviewed verified evidence.');
assert.equal(pa.family_status, 'missing_verified_source', 'Ohio P&A must remain explicit missing verified source.');
assert.equal(pti.family_status, 'planning_target_only', 'Ohio PTI must remain planning-only without reviewed verified evidence.');
assert.equal(legal.family_status, 'missing_verified_source', 'Ohio legal aid must remain explicit missing verified source.');

assert.equal(failureRows.find((row) => row.family === 'county_local_disability_resources').failure_code, 'official_county_directory_failed_and_only_non_official_dataset_remains', 'Ohio county-local failure code must explain the DOI fallback problem.');
assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'bounded_esc_leaf_packet_exhausted_before_county_grade_coverage', 'Ohio education failure code must explain packet exhaustion.');
assert.equal(failureRows.find((row) => row.family === 'protection_and_advocacy').failure_code, 'reviewed_disability_rights_ohio_source_missing', 'Ohio P&A must explain the reviewed-source gap.');
assert.equal(failureRows.find((row) => row.family === 'legal_aid').failure_code, 'authored_lsc_target_not_yet_replaced_with_reviewed_ohio_source', 'Ohio legal aid must explain the authored-but-unverified blocker.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'county_local_disability_resources',
    'district_or_county_education_routing',
    'vocational_rehabilitation_pre_ets',
    'protection_and_advocacy',
    'parent_training_information_center',
    'legal_aid',
  ],
  'Ohio next actions must collapse to the six real remaining blockers.',
);

assert.equal(verifiedRows.find((row) => row.family === 'county_local_disability_resources').family_status, 'blocked_missing_live_official_county_directory', 'Ohio verified sources must expose county-local as a blocker.');
assert.equal(verifiedRows.find((row) => row.family === 'district_or_county_education_routing').family_status, 'blocked_exact_leaf_repair_exhausted', 'Ohio verified sources must expose education as a blocker.');
assert.ok(report.includes('Ohio final blocker decision'), 'Ohio report must include the final blocker decision section.');
assert.ok(report.includes('DOI-hosted dataset mirror'), 'Ohio report must explain why the DOI fallback cannot count as county-grade proof.');

console.log('test-batch38-ohio-final-blocker-refresh-v1: ok');
