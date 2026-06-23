import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch243MinnesotaPtiAuthoritativeRepairV1 } from './run-batch243-minnesota-pti-authoritative-repair-v1.mjs';

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

const result = generateBatch243MinnesotaPtiAuthoritativeRepairV1();
const summary = readJson('data/generated/minnesota_california_grade_summary_v2.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const gapRows = readJsonl('data/generated/minnesota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/minnesota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/minnesota_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/minnesota_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch243_minnesota_pti_authoritative_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/minnesota-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch243-minnesota-pti-authoritative-repair-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 2);
assert.deepEqual(summary.major_gap_families, []);
assert.ok(!summary.final_blockers.some((row) => row.family === 'parent_training_information_center'));

const queue = queueRows.find((row) => row.state === 'minnesota');
assert.equal(queue.completeness_pct, 83);
assert.equal(queue.weak_critical_families, 2);

const ptiGap = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiGap.family_status, 'verified_state_grade');
assert.match(ptiGap.status_reason, /Minnesota PTI/);
assert.match(ptiGap.status_reason, /PACER Center/);

assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'));

const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiVerified.family_status, 'verified_state_grade');
assert.equal(ptiVerified.sample_count, 1);
assert.equal(ptiVerified.samples[0].source_url, 'https://www.parentcenterhub.org/findurcenter/minnesota/');
assert.match(ptiVerified.samples[0].evidence_snippet, /Minnesota PTI/);
assert.match(ptiVerified.samples[0].evidence_snippet, /PACER Center/);

assert.ok(!nextRows.some((row) => row.family === 'parent_training_information_center'));
assert.equal(batchSummary.parent_training_information_center, 'verified_state_grade');
assert.equal(batchSummary.remaining_critical_blockers.length, 2);
assert.ok(report.includes('parent_training_information_center now clears from the authoritative Parent Center Hub Minnesota leaf'));
assert.ok(batchReport.includes('authoritative Parent Center Hub Minnesota leaf'));

console.log('test-batch243-minnesota-pti-authoritative-repair-v1: ok');
