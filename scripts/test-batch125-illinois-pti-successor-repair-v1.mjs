import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch125IllinoisPtiSuccessorRepairV1 } from './run-batch125-illinois-pti-successor-repair-v1.mjs';

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

const result = generateBatch125IllinoisPtiSuccessorRepairV1();
const summary = readJson('data/generated/illinois_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/illinois_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/illinois_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/illinois_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/illinois_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch125_illinois_pti_successor_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/illinois-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch125-illinois-pti-successor-repair-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.missing_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'bounded_roe_leaf_packet_exhausted_before_county_grade_coverage');
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing']);
assert.deepEqual(summary.major_gap_families, []);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_exact_leaf_repair_exhausted');

assert.equal(failures.length, 1);
assert.equal(failures[0].family, 'district_or_county_education_routing');
assert.equal(failures[0].failure_code, 'bounded_roe_leaf_packet_exhausted_before_county_grade_coverage');

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 2);
assert.ok(verifiedByFamily.get('parent_training_information_center').samples[0].evidence_snippet.includes('October 1, 2025'));
assert.ok(verifiedByFamily.get('parent_training_information_center').samples[1].evidence_snippet.includes('only federally funded Parent Training and Information Center'));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'district_or_county_education_routing');

const illinoisQueue = queueRows.find((row) => row.state === 'illinois');
assert.equal(illinoisQueue.classification, 'BLOCKED');
assert.equal(illinoisQueue.index_safe, false);
assert.equal(illinoisQueue.completeness_pct, 91);
assert.equal(illinoisQueue.primary_gap_reason, 'bounded_roe_leaf_packet_exhausted_before_county_grade_coverage');

assert.deepEqual(batchSummary.repaired_families, ['parent_training_information_center']);
assert.deepEqual(batchSummary.remaining_blockers, ['district_or_county_education_routing']);

assert.ok(report.includes('Family Matters PTIC now states on its own first-party site'));
assert.ok(report.includes('District or county education routing remains the only blocker'));
assert.ok(batchReport.includes('remaining_blockers: district_or_county_education_routing'));
assert.ok(lessons.includes('### PTI Successor Pattern: Use The Outgoing Center To Prove The Role Change, Then Verify The Incoming Center On Its Own First-Party Site'));

console.log('test-batch125-illinois-pti-successor-repair-v1: ok');
