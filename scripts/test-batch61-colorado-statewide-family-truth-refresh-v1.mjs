import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch61ColoradoStatewideFamilyTruthRefreshV1 } from './run-batch61-colorado-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch61ColoradoStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/colorado_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/colorado_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/colorado_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/colorado_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/colorado_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch61_colorado_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/colorado-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch61-colorado-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Colorado refresh must final-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Colorado packet summary must move out of unstarted and become blocked.');
assert.equal(summary.index_safe, false, 'Colorado must remain not index-safe.');
assert.equal(summary.completeness_pct, 75, 'Colorado completeness must reflect two repaired statewide families.');
assert.equal(summary.strong_critical_families, 9, 'Colorado should retain nine strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 2, 'Colorado should retain two weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 1, 'Colorado should retain one missing critical family after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'missing');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'legacy_state_grade');

assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Colorado P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'), 'Colorado PTI must drop out of the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'legal_aid').failure_code, 'reviewed_statewide_support_source_not_explicit_legal_aid_route');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'legal_aid',
    'county_local_disability_resources',
  ],
  'Colorado next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Colorado P&A must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').samples[0].final_url, 'https://disabilityjustice.co/');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Colorado PTI must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').samples[0].final_url, 'https://www.peakparent.org/');

assert.ok(report.includes('Colorado no longer belongs in UNSTARTED'), 'Colorado report must explain the state moved out of UNSTARTED.');
assert.ok(report.includes('forms Colorado’s Protection and Advocacy system'), 'Colorado report must explain the P&A repair precisely.');
assert.ok(report.includes('Parent Center identity'), 'Colorado report must explain the PTI repair precisely.');
assert.ok(report.includes('legal aid remains blocked'), 'Colorado report must explain the remaining legal-aid blocker precisely.');
assert.ok(report.includes('terminal BLOCKED, not COMPLETE'), 'Colorado report must explain the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['protection_and_advocacy', 'parent_training_information_center']);
assert.ok(batchReport.includes('updated_families: protection_and_advocacy, parent_training_information_center'));

console.log('test-batch61-colorado-statewide-family-truth-refresh-v1: ok');
