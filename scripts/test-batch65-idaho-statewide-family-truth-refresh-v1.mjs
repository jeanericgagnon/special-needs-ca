import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch65IdahoStatewideFamilyTruthRefreshV1 } from './run-batch65-idaho-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch65IdahoStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch65_idaho_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch65-idaho-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Idaho refresh must terminal-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Idaho packet summary must move out of unstarted and become blocked.');
assert.equal(summary.index_safe, false, 'Idaho must remain not index-safe.');
assert.equal(summary.completeness_pct, 75, 'Idaho completeness must reflect two repaired statewide families and one clarified statewide blocker.');
assert.equal(summary.strong_critical_families, 9, 'Idaho should retain nine strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 3, 'Idaho should retain three weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 0, 'Idaho should have no missing critical families after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'blocked_reviewed_first_party_support_without_explicit_pti_designation');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'legacy_state_grade');

assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Idaho P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'), 'Idaho legal aid must drop out of the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'parent_training_information_center').failure_code, 'reviewed_first_party_support_source_lacks_explicit_pti_designation');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'parent_training_information_center',
    'county_local_disability_resources',
  ],
  'Idaho next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Idaho P&A must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').samples[0].final_url, 'https://www.disabilityrightsidaho.org/');
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1, 'Idaho legal aid must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('legal_aid').samples[0].final_url, 'https://www.disabilityrightsidaho.org/');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Idaho PTI blocker must preserve the Idaho Parents Unlimited sample.');

assert.ok(report.includes('Idaho no longer belongs in UNSTARTED'), 'Idaho report must explain the state moved out of UNSTARTED.');
assert.ok(report.includes('Protection and Advocacy agency for Idaho'), 'Idaho report must explain the P&A repair precisely.');
assert.ok(report.includes('free legal services plus attorney and representation language'), 'Idaho report must explain the legal-aid repair precisely.');
assert.ok(report.includes('does not preserve explicit PTI / Parent Training and Information designation text'), 'Idaho report must explain the PTI blocker precisely.');
assert.ok(report.includes('terminal BLOCKED, not COMPLETE'), 'Idaho report must explain the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['protection_and_advocacy', 'legal_aid', 'parent_training_information_center']);
assert.ok(batchReport.includes('updated_families: protection_and_advocacy, legal_aid, parent_training_information_center'));

console.log('test-batch65-idaho-statewide-family-truth-refresh-v1: ok');
