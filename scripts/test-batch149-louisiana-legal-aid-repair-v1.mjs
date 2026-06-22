import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch149LouisianaLegalAidRepairV1 } from './run-batch149-louisiana-legal-aid-repair-v1.mjs';

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

const result = generateBatch149LouisianaLegalAidRepairV1();
const summary = readJson('data/generated/louisiana_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/louisiana_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/louisiana_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/louisiana_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/louisiana_verified_sources_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch149_louisiana_legal_aid_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/louisiana-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch149-louisiana-legal-aid-repair-report-v1.md'), 'utf8');
const legalSource = readJson('data/generated/louisiana_legal_aid_reviewed_source_v1.json');

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

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'county_local_disability_resources',
  ],
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1);
assert.match(verifiedByFamily.get('legal_aid').samples[0].evidence_snippet, /Find a Lawyer by parish/i);

assert.equal(legalSource.final_url, 'https://louisianalawhelp.org/find-legal-help');
assert.match(legalSource.evidence_snippet, /free legal help routing/i);

const louisianaQueue = queueRows.find((row) => row.state === 'louisiana');
assert.equal(louisianaQueue.completeness_pct, 83);
assert.equal(louisianaQueue.weak_critical_families, 2);
assert.equal(louisianaQueue.missing_critical_families, 0);

const louisianaAudit = audit.states.find((row) => row.stateId === 'louisiana');
assert.equal(louisianaAudit.completenessPct, 83);
assert.equal(louisianaAudit.strongCriticalFamilies, 10);
assert.equal(louisianaAudit.weakCriticalFamilies, 2);
assert.equal(louisianaAudit.missingCriticalFamilies, 0);
assert.equal(louisianaAudit.familyStatuses.legal_aid, 'verified_state_grade');

assert.deepEqual(batchSummary.upgraded_families, ['legal_aid']);
assert.deepEqual(batchSummary.remaining_blockers, [
  'district_or_county_education_routing',
  'county_local_disability_resources',
]);

assert.ok(report.includes('Louisiana legal aid upgrades'));
assert.ok(report.includes('only remaining blockers are the two parish-grade local-routing families'));
assert.ok(batchReport.includes('upgraded_families: legal_aid'));

console.log('test-batch149-louisiana-legal-aid-repair-v1: ok');
