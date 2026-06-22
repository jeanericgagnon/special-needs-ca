import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch106AlaskaPtiRepairV1 } from './run-batch106-alaska-pti-repair-v1.mjs';

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

const result = generateBatch106AlaskaPtiRepairV1();
const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch106_alaska_pti_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.weak_critical_families, 1);
assert.deepEqual(summary.final_blockers.map((row) => row.family), ['county_local_disability_resources']);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.match(byFamily.get('parent_training_information_center').status_reason, /Parent Center Hub Alaska leaf explicitly labels Stone Soup Group as Alaska PTI/i);
assert.match(byFamily.get('county_local_disability_resources').status_reason, /legacy dhss\.alaska\.gov alias roots/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.match(failureRows[0].evidence, /legacy dhss\.alaska\.gov aliases/i);

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.equal(pti.evidence_strength, 'strong');
assert.equal(pti.sample_count, 1);
assert.equal(pti.samples[0].source_url, 'https://www.parentcenterhub.org/findurcenter/alaska/');
assert.match(pti.samples[0].evidence_snippet, /Alaska PTI\. Stone Soup Group\./);

const queueRow = queueRows.find((row) => row.state === 'alaska');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.index_safe, false);
assert.equal(queueRow.completeness_pct, 91);
assert.equal(queueRow.weak_critical_families, 1);
assert.equal(queueRow.primary_gap_reason, 'official_local_directory_challenge_blocks_reviewed_county_grade_evidence');

assert.equal(batchSummary.repaired_family, 'parent_training_information_center');
assert.deepEqual(batchSummary.remaining_blockers, ['county_local_disability_resources']);
assert.ok(report.includes('Parent Center Hub Alaska leaf'));
assert.ok(report.includes('County-local disability resources remain blocked'));
assert.ok(lessons.includes('Parent Center Hub State Leafs Can Close PTI Gaps When First-Party Pages Omit The Label'));

console.log('test-batch106-alaska-pti-repair-v1: ok');
