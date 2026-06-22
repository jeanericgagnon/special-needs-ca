import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch58AlaskaStatewideFamilyTruthRefreshV1 } from './run-batch58-alaska-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch58AlaskaStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch58_alaska_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch58-alaska-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Alaska refresh must final-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Alaska packet summary must move out of unstarted and become blocked.');
assert.equal(summary.index_safe, false, 'Alaska must remain not index-safe.');
assert.equal(summary.completeness_pct, 67, 'Alaska completeness must reflect one repaired statewide family and two clarified statewide blockers.');
assert.equal(summary.strong_critical_families, 8, 'Alaska should retain eight strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 3, 'Alaska should retain three weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 1, 'Alaska should retain one missing critical family after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'blocked_reviewed_statewide_legal_advocacy_source_not_explicit_pa');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'blocked_reviewed_first_party_support_without_explicit_pti_designation');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'legacy_state_grade');

assert.ok(!failureRows.some((row) => row.family === 'legal_aid'), 'Alaska legal aid must drop out of the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'protection_and_advocacy').failure_code, 'reviewed_statewide_legal_advocacy_source_not_explicit_pa');
assert.equal(failureRows.find((row) => row.family === 'parent_training_information_center').failure_code, 'reviewed_first_party_support_source_lacks_explicit_pti_designation');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'protection_and_advocacy',
    'parent_training_information_center',
    'county_local_disability_resources',
  ],
  'Alaska next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1, 'Alaska legal aid must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('legal_aid').samples[0].final_url, 'https://www.dlcak.org/');
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Alaska P&A blocker must preserve the DLCAK sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Alaska PTI blocker must preserve the Stone Soup sample.');

assert.ok(report.includes('Alaska no longer belongs in UNSTARTED'), 'Alaska report must explain the state moved out of UNSTARTED.');
assert.ok(report.includes('Reviewed first-party DLCAK evidence on disk now truthfully upgrades statewide legal aid'), 'Alaska report must explain the legal-aid repair.');
assert.ok(report.includes('saved artifact does not preserve explicit Protection and Advocacy designation text'), 'Alaska report must explain the P&A blocker precisely.');
assert.ok(report.includes('saved artifact still lacks explicit PTI'), 'Alaska report must explain the PTI blocker precisely.');
assert.ok(report.includes('terminal BLOCKED, not COMPLETE'), 'Alaska report must explain the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['legal_aid', 'protection_and_advocacy', 'parent_training_information_center']);
assert.ok(batchReport.includes('updated_families: legal_aid, protection_and_advocacy, parent_training_information_center'));

console.log('test-batch58-alaska-statewide-family-truth-refresh-v1: ok');
