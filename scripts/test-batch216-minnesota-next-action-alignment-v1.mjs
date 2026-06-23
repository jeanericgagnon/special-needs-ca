import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch216MinnesotaNextActionAlignmentV1 } from './run-batch216-minnesota-next-action-alignment-v1.mjs';

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

const result = generateBatch216MinnesotaNextActionAlignmentV1();
const summary = readJson('data/generated/minnesota_california_grade_summary_v2.json');
const failures = readJsonl('data/generated/minnesota_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/minnesota_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch216_minnesota_next_action_alignment_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/minnesota-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch216-minnesota-next-action-alignment-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
const summaryBlocker = summary.final_blockers.find((row) => row.family === 'district_or_county_education_routing');
const failure = failures.find((row) => row.family === 'district_or_county_education_routing');
const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');

assert.equal(summaryBlocker.next_action, 'browser_assisted_or_cached_capture_only_for_live_mdeorg_directory_contract');
assert.equal(failure.next_action, 'browser_assisted_or_cached_capture_only_for_live_mdeorg_directory_contract');
assert.equal(next.next_action, 'browser_assisted_or_cached_capture_only_for_live_mdeorg_directory_contract');
assert.equal(batchSummary.aligned_next_action, next.next_action);
assert.ok(report.includes('browser_assisted_or_cached_capture_only_for_live_mdeorg_directory_contract'));
assert.ok(batchReport.includes('Aligned the Minnesota education next_action'));

console.log('test-batch216-minnesota-next-action-alignment-v1: ok');
