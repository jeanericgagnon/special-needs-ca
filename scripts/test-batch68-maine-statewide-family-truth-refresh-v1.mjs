import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch68MaineStatewideFamilyTruthRefreshV1 } from './run-batch68-maine-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch68MaineStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch68_maine_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch68-maine-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Maine refresh must terminal-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Maine packet summary must move out of unstarted and become blocked.');
assert.equal(summary.index_safe, false, 'Maine must remain not index-safe.');
assert.equal(summary.completeness_pct, 75, 'Maine completeness must reflect two repaired statewide families.');
assert.equal(summary.strong_critical_families, 9, 'Maine should retain nine strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 2, 'Maine should retain two weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 1, 'Maine should retain one missing critical family after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'missing');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'legacy_state_grade');

assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Maine P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'), 'Maine PTI must drop out of the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'legal_aid').failure_code, 'missing_required_source_family');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'legal_aid',
    'county_local_disability_resources',
  ],
  'Maine next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Maine P&A must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').samples[0].final_url, 'https://drme.org/');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Maine PTI must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').samples[0].final_url, 'https://www.mpf.org/');

assert.ok(report.includes('Maine no longer belongs in UNSTARTED'), 'Maine report must explain the state moved out of UNSTARTED.');
assert.ok(report.includes('federally mandated protection and advocacy system for Maine'), 'Maine report must explain the P&A repair precisely.');
assert.ok(report.includes('Parent Training & Info (PTI)'), 'Maine report must explain the PTI repair precisely.');
assert.ok(report.includes('terminal BLOCKED, not COMPLETE'), 'Maine report must explain the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['protection_and_advocacy', 'parent_training_information_center']);
assert.ok(batchReport.includes('updated_families: protection_and_advocacy, parent_training_information_center'));

console.log('test-batch68-maine-statewide-family-truth-refresh-v1: ok');
