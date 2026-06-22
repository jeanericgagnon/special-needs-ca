import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch151MarylandStatewideSourceRepairV1 } from './run-batch151-maryland-statewide-source-repair-v1.mjs';

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

const result = generateBatch151MarylandStatewideSourceRepairV1();
const summary = readJson('data/generated/maryland_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maryland_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maryland_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/maryland_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maryland_verified_sources_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch151_maryland_statewide_source_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maryland-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch151-maryland-statewide-source-repair-report-v1.md'), 'utf8');
const ptiSource = readJson('data/generated/maryland_pti_reviewed_source_v1.json');
const paSource = readJson('data/generated/maryland_pa_reviewed_source_v1.json');
const legalSource = readJson('data/generated/maryland_legal_aid_reviewed_source_v1.json');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 2);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(summary.critical_gap_families, [
  'district_or_county_education_routing',
  'county_local_disability_resources',
]);
assert.deepEqual(summary.major_gap_families, []);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');

assert.equal(failureRows.length, 2);
assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'));
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'));
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'));

assert.deepEqual(nextRows.map((row) => row.family), [
  'district_or_county_education_routing',
  'county_local_disability_resources',
]);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1);
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1);
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1);
assert.match(verifiedByFamily.get('parent_training_information_center').samples[0].evidence_snippet, /Parent Training and Information Center/i);
assert.match(verifiedByFamily.get('protection_and_advocacy').samples[0].evidence_snippet, /designated Protection & Advocacy agency/i);
assert.match(verifiedByFamily.get('legal_aid').samples[0].evidence_snippet, /free civil legal services/i);

assert.equal(ptiSource.final_url, 'https://www.ppmd.org/about-us/');
assert.equal(paSource.final_url, 'https://disabilityrightsmd.org/about/');
assert.equal(legalSource.final_url, 'https://www.mdlab.org/');

const marylandQueue = queueRows.find((row) => row.state === 'maryland');
assert.equal(marylandQueue.completeness_pct, 83);
assert.equal(marylandQueue.weak_critical_families, 2);
assert.equal(marylandQueue.missing_critical_families, 0);

const marylandAudit = audit.states.find((row) => row.stateId === 'maryland');
assert.equal(marylandAudit.completenessPct, 83);
assert.equal(marylandAudit.strongCriticalFamilies, 10);
assert.equal(marylandAudit.weakCriticalFamilies, 2);
assert.equal(marylandAudit.missingCriticalFamilies, 0);
assert.equal(marylandAudit.familyStatuses.protection_and_advocacy, 'verified_state_grade');
assert.equal(marylandAudit.familyStatuses.parent_training_information_center, 'verified_state_grade');
assert.equal(marylandAudit.familyStatuses.legal_aid, 'verified_state_grade');

assert.deepEqual(batchSummary.upgraded_families, [
  'protection_and_advocacy',
  'parent_training_information_center',
  'legal_aid',
]);
assert.deepEqual(batchSummary.remaining_blockers, [
  'district_or_county_education_routing',
  'county_local_disability_resources',
]);

assert.ok(report.includes('now clears PTI'));
assert.ok(report.includes('now clears protection and advocacy'));
assert.ok(report.includes('now clears legal aid'));
assert.ok(batchReport.includes('upgraded_families: protection_and_advocacy, parent_training_information_center, legal_aid'));

console.log('test-batch151-maryland-statewide-source-repair-v1: ok');
