import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch150MaineLegalAidRepairV1 } from './run-batch150-maine-legal-aid-repair-v1.mjs';

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

const result = generateBatch150MaineLegalAidRepairV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch150_maine_legal_aid_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch150-maine-legal-aid-repair-report-v1.md'), 'utf8');
const legalSource = readJson('data/generated/maine_legal_aid_reviewed_source_v1.json');

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
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');

assert.equal(failureRows.length, 2);
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'));

assert.deepEqual(nextRows.map((row) => row.family), [
  'district_or_county_education_routing',
  'county_local_disability_resources',
]);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1);
assert.match(verifiedByFamily.get('legal_aid').samples[0].evidence_snippet, /free civil legal aid in Maine/i);

assert.equal(legalSource.final_url, 'https://www.ptla.org/');
assert.match(legalSource.evidence_snippet, /free civil legal aid in Maine/i);

const maineQueue = queueRows.find((row) => row.state === 'maine');
assert.equal(maineQueue.completeness_pct, 83);
assert.equal(maineQueue.weak_critical_families, 2);
assert.equal(maineQueue.missing_critical_families, 0);

const maineAudit = audit.states.find((row) => row.stateId === 'maine');
assert.equal(maineAudit.completenessPct, 83);
assert.equal(maineAudit.strongCriticalFamilies, 10);
assert.equal(maineAudit.weakCriticalFamilies, 2);
assert.equal(maineAudit.missingCriticalFamilies, 0);
assert.equal(maineAudit.familyStatuses.legal_aid, 'verified_state_grade');

assert.deepEqual(batchSummary.upgraded_families, ['legal_aid']);
assert.deepEqual(batchSummary.remaining_blockers, [
  'district_or_county_education_routing',
  'county_local_disability_resources',
]);

assert.ok(report.includes('Maine legal aid upgrades'));
assert.ok(report.includes('only remaining blockers are the two county-grade local-routing families'));
assert.ok(batchReport.includes('upgraded_families: legal_aid'));

console.log('test-batch150-maine-legal-aid-repair-v1: ok');
