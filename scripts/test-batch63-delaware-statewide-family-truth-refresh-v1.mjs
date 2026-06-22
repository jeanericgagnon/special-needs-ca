import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch63DelawareStatewideFamilyTruthRefreshV1 } from './run-batch63-delaware-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch63DelawareStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/delaware_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/delaware_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/delaware_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/delaware_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/delaware_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch63_delaware_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/delaware-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch63-delaware-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Delaware refresh must final-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Delaware packet summary must move out of unstarted and become blocked.');
assert.equal(summary.index_safe, false, 'Delaware must remain not index-safe.');
assert.equal(summary.completeness_pct, 75, 'Delaware completeness must reflect three repaired statewide support families.');
assert.equal(summary.strong_critical_families, 9, 'Delaware should retain nine strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 3, 'Delaware should retain three weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 0, 'Delaware should have no missing critical families after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');
assert.equal(byFamily.get('special_education_idea_part_b').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'legacy_state_grade');

assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Delaware P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'), 'Delaware PTI must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'), 'Delaware legal aid must drop out of the failure ledger.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'special_education_idea_part_b',
    'district_or_county_education_routing',
    'county_local_disability_resources',
  ],
  'Delaware next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Delaware P&A must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').samples[0].final_url, 'https://www.declasi.org/');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Delaware PTI must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').samples[0].final_url, 'https://picofdel.org/');
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1, 'Delaware legal aid must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('legal_aid').samples[0].final_url, 'https://www.declasi.org/');

assert.ok(report.includes('Delaware no longer belongs in UNSTARTED'), 'Delaware report must explain the state moved out of UNSTARTED.');
assert.ok(report.includes('Delaware’s designated Protection & Advocacy system'), 'Delaware report must explain the P&A repair precisely.');
assert.ok(report.includes('Parent Training and Information Center (PTI) Project designation'), 'Delaware report must explain the PTI repair precisely.');
assert.ok(report.includes('free legal-services language plus direct disability-rights and Get Help routing'), 'Delaware report must explain the legal-aid repair precisely.');
assert.ok(report.includes('terminal BLOCKED, not COMPLETE'), 'Delaware report must explain the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['protection_and_advocacy', 'parent_training_information_center', 'legal_aid']);
assert.ok(batchReport.includes('updated_families: protection_and_advocacy, parent_training_information_center, legal_aid'));

console.log('test-batch63-delaware-statewide-family-truth-refresh-v1: ok');
