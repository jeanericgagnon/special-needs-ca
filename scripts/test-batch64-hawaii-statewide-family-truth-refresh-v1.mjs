import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch64HawaiiStatewideFamilyTruthRefreshV1 } from './run-batch64-hawaii-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch64HawaiiStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/hawaii_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/hawaii_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/hawaii_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/hawaii_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/hawaii_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch64_hawaii_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/hawaii-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch64-hawaii-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Hawaii refresh must terminal-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Hawaii packet summary must move out of unstarted and become blocked.');
assert.equal(summary.index_safe, false, 'Hawaii must remain not index-safe.');
assert.equal(summary.completeness_pct, 67, 'Hawaii completeness must reflect two repaired statewide families and one clarified statewide blocker.');
assert.equal(summary.strong_critical_families, 8, 'Hawaii should retain eight strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 3, 'Hawaii should retain three weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 1, 'Hawaii should retain one missing critical family after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'blocked_reviewed_statewide_support_source_not_explicit_legal_aid_route');
assert.equal(byFamily.get('special_education_idea_part_b').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'legacy_state_grade');

assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Hawaii P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'), 'Hawaii PTI must drop out of the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'legal_aid').failure_code, 'reviewed_statewide_support_source_not_explicit_legal_aid_route');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'special_education_idea_part_b',
    'district_or_county_education_routing',
    'legal_aid',
    'county_local_disability_resources',
  ],
  'Hawaii next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Hawaii P&A must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').samples[0].final_url, 'https://hawaiidisabilityrights.org/');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Hawaii PTI must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').samples[0].final_url, 'https://www.ldahawaii.org/');
assert.equal(verifiedByFamily.get('legal_aid').family_status, 'blocked_reviewed_statewide_support_source_not_explicit_legal_aid_route');
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1, 'Hawaii legal-aid blocker must preserve one reviewed first-party sample.');

assert.ok(report.includes('Hawaii no longer belongs in UNSTARTED'), 'Hawaii report must explain the state moved out of UNSTARTED.');
assert.ok(report.includes('created to provide protection and advocacy'), 'Hawaii report must explain the P&A repair precisely.');
assert.ok(report.includes('Parent Training & Information Center designation text'), 'Hawaii report must explain the PTI repair precisely.');
assert.ok(report.includes('does not preserve an explicit statewide legal-aid or legal-representation route'), 'Hawaii report must explain the legal-aid blocker precisely.');
assert.ok(report.includes('terminal BLOCKED, not COMPLETE'), 'Hawaii report must explain the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['protection_and_advocacy', 'parent_training_information_center', 'legal_aid']);
assert.ok(batchReport.includes('updated_families: protection_and_advocacy, parent_training_information_center, legal_aid'));

console.log('test-batch64-hawaii-statewide-family-truth-refresh-v1: ok');
