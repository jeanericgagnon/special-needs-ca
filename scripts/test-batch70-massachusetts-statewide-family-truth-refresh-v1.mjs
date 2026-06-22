import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch70MassachusettsStatewideFamilyTruthRefreshV1 } from './run-batch70-massachusetts-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch70MassachusettsStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/massachusetts_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/massachusetts_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/massachusetts_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/massachusetts_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/massachusetts_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch70_massachusetts_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/massachusetts-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch70-massachusetts-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Massachusetts refresh must terminal-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Massachusetts packet summary must move out of unstarted and become blocked.');
assert.equal(summary.index_safe, false, 'Massachusetts must remain not index-safe.');
assert.equal(summary.completeness_pct, 67, 'Massachusetts completeness must rise after PTI repair.');
assert.equal(summary.strong_critical_families, 8, 'Massachusetts should retain eight strong critical families after PTI repair.');
assert.equal(summary.weak_critical_families, 2, 'Massachusetts should retain two weak critical families after PTI repair.');
assert.equal(summary.missing_critical_families, 2, 'Massachusetts should retain two missing critical families after PTI repair.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'missing');
assert.equal(byFamily.get('legal_aid').family_status, 'missing');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'legacy_state_grade');

assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'), 'Massachusetts PTI must drop out of the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'protection_and_advocacy').failure_code, 'missing_required_source_family');
assert.equal(failureRows.find((row) => row.family === 'legal_aid').failure_code, 'missing_required_source_family');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'protection_and_advocacy',
    'legal_aid',
    'county_local_disability_resources',
  ],
  'Massachusetts next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Massachusetts PTI must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').samples[0].final_url, 'https://fcsn.org/');
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 0);
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 0);

assert.ok(report.includes('Massachusetts no longer belongs in UNSTARTED'), 'Massachusetts report must explain the state moved out of UNSTARTED.');
assert.ok(report.includes('Parent Training & Information Center route'), 'Massachusetts report must explain the PTI repair precisely.');
assert.ok(report.includes('terminal BLOCKED, not COMPLETE'), 'Massachusetts report must explain the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['parent_training_information_center']);
assert.ok(batchReport.includes('updated_families: parent_training_information_center'));

console.log('test-batch70-massachusetts-statewide-family-truth-refresh-v1: ok');
