import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch238KansasSedgwickSearchFreezeV1 } from './run-batch238-kansas-sedgwick-search-freeze-v1.mjs';

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

generateBatch238KansasSedgwickSearchFreezeV1();

const batchSummary = readJson('data/generated/batch238_kansas_sedgwick_search_freeze_summary_v1.json');
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch238-kansas-sedgwick-search-freeze-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'reviewed_kansas_district_owned_leaves_exist_but_full_county_grade_coverage_is_incomplete');

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.next_action, 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory_and_do_not_reprobe_sedgwick_without_new_role_exact_leaf');
assert.match(failure.evidence, /site-map returned HTTP 200/i);
assert.match(failure.evidence, /internal search pages/i);
assert.match(failure.evidence, /special-programs-and-schools/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(verified.samples.some((row) => row.source_url === 'https://www.usd259.org/site-map'));
assert.ok(verified.samples.some((row) => row.source_url === 'https://www.usd259.org/search-results?q=special%20education'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory_and_do_not_reprobe_sedgwick_without_new_role_exact_leaf');

const queue = queueRows.find((row) => row.state === 'kansas');
assert.equal(queue.primary_gap_reason, 'reviewed_kansas_district_owned_leaves_exist_but_full_county_grade_coverage_is_incomplete');

assert.equal(batchSummary.sedgwick_root, 'https://www.usd259.org/');
assert.match(report, /Sedgwick is now fully frozen in the low-token lane/i);
assert.match(batchReport, /reviewed district-owned host without any role-exact special-education or student-services leaf/i);

console.log('test-batch238-kansas-sedgwick-search-freeze-v1: ok');
