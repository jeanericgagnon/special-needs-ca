import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch69MarylandStatewideFamilyTruthRefreshV1 } from './run-batch69-maryland-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch69MarylandStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/maryland_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maryland_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maryland_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/maryland_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maryland_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch69_maryland_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maryland-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch69-maryland-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Maryland refresh must terminal-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Maryland packet summary must move out of unstarted and become blocked.');
assert.equal(summary.index_safe, false, 'Maryland must remain not index-safe.');
assert.equal(summary.completeness_pct, 58, 'Maryland completeness should remain unchanged by blocker clarification.');
assert.equal(summary.strong_critical_families, 7, 'Maryland should retain seven strong critical families.');
assert.equal(summary.weak_critical_families, 3, 'Maryland should retain three weak critical families.');
assert.equal(summary.missing_critical_families, 2, 'Maryland should retain two missing critical families.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('parent_training_information_center').family_status, 'blocked_reviewed_first_party_support_without_explicit_pti_designation');
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'missing');
assert.equal(byFamily.get('legal_aid').family_status, 'missing');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'legacy_state_grade');

assert.equal(failureRows.find((row) => row.family === 'parent_training_information_center').failure_code, 'reviewed_first_party_support_source_lacks_explicit_pti_designation');
assert.equal(failureRows.find((row) => row.family === 'protection_and_advocacy').failure_code, 'missing_required_source_family');
assert.equal(failureRows.find((row) => row.family === 'legal_aid').failure_code, 'missing_required_source_family');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'protection_and_advocacy',
    'parent_training_information_center',
    'legal_aid',
    'county_local_disability_resources',
  ],
  'Maryland next actions must stay focused on the real current blockers.',
);
assert.equal(
  nextRows.find((row) => row.family === 'parent_training_information_center').next_action,
  'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Maryland PTI blocker must preserve one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').samples[0].final_url, 'https://www.ppmd.org/');
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 0);
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 0);

assert.ok(report.includes('Maryland no longer belongs in UNSTARTED'), 'Maryland report must explain the state moved out of UNSTARTED.');
assert.ok(report.includes('does not preserve explicit PTI / Parent Training and Information Center designation text'), 'Maryland report must explain the PTI blocker precisely.');
assert.ok(report.includes('terminal BLOCKED, not COMPLETE'), 'Maryland report must explain the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['parent_training_information_center']);
assert.ok(batchReport.includes('updated_families: parent_training_information_center'));

console.log('test-batch69-maryland-statewide-family-truth-refresh-v1: ok');
