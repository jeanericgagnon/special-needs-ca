import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch73MississippiStatewideFamilyTruthRefreshV1 } from './run-batch73-mississippi-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch73MississippiStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/mississippi_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/mississippi_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/mississippi_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/mississippi_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/mississippi_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch73_mississippi_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/mississippi-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch73-mississippi-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Mississippi refresh must terminal-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Mississippi packet summary must move out of unstarted and become blocked.');
assert.equal(summary.index_safe, false, 'Mississippi must remain not index-safe.');
assert.equal(summary.completeness_pct, 58, 'Mississippi completeness must rise after PTI repair.');
assert.equal(summary.strong_critical_families, 7, 'Mississippi should retain seven strong critical families after repair.');
assert.equal(summary.weak_critical_families, 3, 'Mississippi should retain three weak critical families after repair.');
assert.equal(summary.missing_critical_families, 2, 'Mississippi should retain two missing critical families after repair.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('vocational_rehabilitation_pre_ets').family_status, 'inventory_only');
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'missing');
assert.equal(byFamily.get('legal_aid').family_status, 'missing');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'legacy_state_grade');

assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'), 'Mississippi PTI must drop out of the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets').failure_code, 'legacy_or_inventory_only_evidence');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'vocational_rehabilitation_pre_ets',
    'protection_and_advocacy',
    'legal_aid',
    'county_local_disability_resources',
  ],
  'Mississippi next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Mississippi PTI must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').samples[0].final_url, 'https://mspti.org/default.asp');

assert.ok(report.includes('Mississippi no longer belongs in UNSTARTED'), 'Mississippi report must explain the state moved out of UNSTARTED.');
assert.ok(report.includes('Welcome to the Mississippi Parent Training and Information Center'), 'Mississippi report must explain the PTI repair precisely.');
assert.ok(report.includes('not enough to prove direct statewide VR / Pre-ETS routing'), 'Mississippi report must preserve the VR blocker precisely.');
assert.ok(report.includes('terminal BLOCKED, not COMPLETE'), 'Mississippi report must explain the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['parent_training_information_center']);
assert.ok(batchReport.includes('updated_families: parent_training_information_center'));

console.log('test-batch73-mississippi-statewide-family-truth-refresh-v1: ok');
