import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch57AlabamaStatewideFamilyTruthRefreshV1 } from './run-batch57-alabama-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch57AlabamaStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/alabama_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alabama_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alabama_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/alabama_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alabama_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch57_alabama_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alabama-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch57-alabama-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Alabama refresh must final-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Alabama packet summary must now be blocked instead of unstarted.');
assert.equal(summary.index_safe, false, 'Alabama must remain not index-safe.');
assert.equal(summary.completeness_pct, 75, 'Alabama completeness must reflect two repaired statewide support families.');
assert.equal(summary.strong_critical_families, 9, 'Alabama should retain nine strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 2, 'Alabama should retain two weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 1, 'Alabama should retain one missing critical family after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'missing');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'legacy_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'legacy_state_grade');

assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Alabama P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'), 'Alabama PTI must drop out of the failure ledger.');
assert.equal(failureRows.length, 3, 'Alabama should retain only the real current blockers.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'legal_aid',
    'county_local_disability_resources',
  ],
  'Alabama next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Alabama P&A must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').samples[0].final_url, 'https://sites.ua.edu/adap/');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Alabama PTI must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').samples[0].final_url, 'https://alabamaparentcenter.com/web/');

assert.ok(report.includes('Alabama no longer belongs in UNSTARTED'), 'Alabama report must explain the state moved out of UNSTARTED.');
assert.ok(report.includes('Reviewed first-party statewide support evidence on disk now truthfully upgrades Protection and Advocacy'), 'Alabama report must explain the ADAP repair.');
assert.ok(report.includes('Parent Training & Information Center'), 'Alabama report must explain the PTI repair.');
assert.ok(report.includes('terminal BLOCKED, not COMPLETE'), 'Alabama report must explain the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['protection_and_advocacy', 'parent_training_information_center']);
assert.ok(batchReport.includes('updated_families: protection_and_advocacy, parent_training_information_center'));

console.log('test-batch57-alabama-statewide-family-truth-refresh-v1: ok');
