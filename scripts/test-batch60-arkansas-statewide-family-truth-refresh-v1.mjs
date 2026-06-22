import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch60ArkansasStatewideFamilyTruthRefreshV1 } from './run-batch60-arkansas-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch60ArkansasStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/arkansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arkansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arkansas_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/arkansas_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arkansas_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch60_arkansas_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arkansas-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch60-arkansas-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Arkansas refresh must final-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Arkansas packet summary must move out of unstarted and become blocked.');
assert.equal(summary.index_safe, false, 'Arkansas must remain not index-safe.');
assert.equal(summary.completeness_pct, 83, 'Arkansas completeness must reflect three repaired statewide families.');
assert.equal(summary.strong_critical_families, 10, 'Arkansas should retain ten strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 2, 'Arkansas should retain two weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 0, 'Arkansas should have no missing critical families after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'legacy_state_grade');

assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Arkansas P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'), 'Arkansas PTI must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'), 'Arkansas legal aid must drop out of the failure ledger.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'county_local_disability_resources',
  ],
  'Arkansas next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Arkansas P&A must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').samples[0].final_url, 'https://disabilityrightsar.org/');
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1, 'Arkansas legal aid must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('legal_aid').samples[0].final_url, 'https://disabilityrightsar.org/');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Arkansas PTI must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').samples[0].final_url, 'https://thecenterforexceptionalfamilies.org/');

assert.ok(report.includes('Arkansas no longer belongs in UNSTARTED'), 'Arkansas report must explain the state moved out of UNSTARTED.');
assert.ok(report.includes('designated by the Governor of Arkansas'), 'Arkansas report must explain the P&A repair precisely.');
assert.ok(report.includes('free legal representation'), 'Arkansas report must explain the legal-aid repair precisely.');
assert.ok(report.includes('older adcpti.org candidate has clearly drifted into unrelated non-Arkansas investment content'), 'Arkansas report must explain the stale PTI drift precisely.');
assert.ok(report.includes('terminal BLOCKED, not COMPLETE'), 'Arkansas report must explain the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['protection_and_advocacy', 'parent_training_information_center', 'legal_aid']);
assert.ok(batchReport.includes('updated_families: protection_and_advocacy, parent_training_information_center, legal_aid'));

console.log('test-batch60-arkansas-statewide-family-truth-refresh-v1: ok');
