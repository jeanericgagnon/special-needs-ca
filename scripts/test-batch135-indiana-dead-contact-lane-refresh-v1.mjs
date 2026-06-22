import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch135IndianaDeadContactLaneRefreshV1 } from './run-batch135-indiana-dead-contact-lane-refresh-v1.mjs';

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

const result = generateBatch135IndianaDeadContactLaneRefreshV1();
const summary = readJson('data/generated/indiana_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/indiana_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/indiana_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/indiana_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/indiana_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch135_indiana_dead_contact_lane_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/indiana-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.primary_gap_reason, 'official_special_education_contact_lane_removed_and_no_official_search_replacement');
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].failure_code, 'official_special_education_contact_lane_removed_and_no_official_search_replacement');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_official_contact_lane_removed');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /commented-out HTML/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /HTTP 410 Gone/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /site-search lane.*404/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].failure_code, 'official_special_education_contact_lane_removed_and_no_official_search_replacement');
assert.match(failureRows[0].evidence, /edit\/export\/csv\/preview/i);

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].next_action, 'hold_blocked_until_indiana_doe_publishes_a_live_special_education_contact_or_district_grade_routing_source');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'blocked_official_contact_lane_removed');
assert.equal(eduVerified.samples.length, 3);
assert.match(eduVerified.samples[0].evidence_snippet, /commented-out HTML/i);
assert.match(eduVerified.samples[1].evidence_snippet, /410 Gone/i);
assert.match(eduVerified.samples[2].evidence_snippet, /generic school and corporation directory/i);

assert.equal(batchSummary.official_search_status, 404);
assert.deepEqual(batchSummary.google_sheet_modes_checked, ['edit', 'export_xlsx', 'export_csv', 'preview']);
assert.match(report, /retired across the live page, all Google Sheets modes, and the bounded official site-search lane|retired across the live Indiana DOE page, all Google Sheets access modes, and the bounded official site-search lane/i);
assert.ok(lessons.includes('### Commented-Out Official Links Plus 410 Exports Mean The Contact Lane Is Truly Retired'));

console.log('test-batch135-indiana-dead-contact-lane-refresh-v1: ok');
