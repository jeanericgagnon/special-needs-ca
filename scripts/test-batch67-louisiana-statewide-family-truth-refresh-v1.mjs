import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch67LouisianaStatewideFamilyTruthRefreshV1 } from './run-batch67-louisiana-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch67LouisianaStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/louisiana_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/louisiana_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/louisiana_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/louisiana_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/louisiana_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch67_louisiana_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/louisiana-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch67-louisiana-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Louisiana refresh must terminal-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Louisiana packet summary must move out of unstarted and become blocked.');
assert.equal(summary.index_safe, false, 'Louisiana must remain not index-safe.');
assert.equal(summary.completeness_pct, 75, 'Louisiana completeness must reflect two repaired statewide families.');
assert.equal(summary.strong_critical_families, 9, 'Louisiana should retain nine strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 2, 'Louisiana should retain two weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 1, 'Louisiana should retain one missing critical family after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'missing');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'legacy_state_grade');

assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Louisiana P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'), 'Louisiana PTI must drop out of the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'legal_aid').failure_code, 'missing_required_source_family');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'legal_aid',
    'county_local_disability_resources',
  ],
  'Louisiana next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Louisiana P&A must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').samples[0].final_url, 'https://disabilityrightsla.org/');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Louisiana PTI must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').samples[0].final_url, 'https://fhfofgno.org/laptic');

assert.ok(report.includes('Louisiana no longer belongs in UNSTARTED'), 'Louisiana report must explain the state moved out of UNSTARTED.');
assert.ok(report.includes('serves as the Louisiana Parent Training and Information Center'), 'Louisiana report must explain the PTI repair precisely.');
assert.ok(report.includes('terminal BLOCKED, not COMPLETE'), 'Louisiana report must explain the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['protection_and_advocacy', 'parent_training_information_center']);
assert.ok(batchReport.includes('updated_families: protection_and_advocacy, parent_training_information_center'));

console.log('test-batch67-louisiana-statewide-family-truth-refresh-v1: ok');
