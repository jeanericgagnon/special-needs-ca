import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch36FloridaFinalBlockerRefreshV1 } from './run-batch36-florida-final-blocker-refresh-v1.mjs';

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

const summary = generateBatch36FloridaFinalBlockerRefreshV1();
const floridaSummary = readJson('data/generated/florida_california_grade_summary_v2.json');
const floridaGap = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const floridaFailures = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const floridaNext = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const floridaReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED', 'Batch 36 summary must mark Florida blocked.');
assert.equal(floridaSummary.classification, 'BLOCKED', 'Florida packet summary must now be blocked.');
assert.equal(floridaSummary.index_safe, false, 'Florida must remain not index-safe.');
assert.equal(floridaSummary.primary_gap_reason, 'bounded_official_leaf_packets_exhausted_without_county_grade_closure', 'Florida summary must expose the bounded-packet blocker reason.');

const educationGap = floridaGap.find((row) => row.family === 'district_or_county_education_routing');
const localGap = floridaGap.find((row) => row.family === 'county_local_disability_resources');
assert.equal(educationGap.family_status, 'blocked_exact_leaf_repair_exhausted', 'Education family must move to explicit blocked packet exhaustion.');
assert.equal(localGap.family_status, 'blocked_missing_official_locator', 'County-local family must move to explicit missing-locator blocked status.');

const educationFailure = floridaFailures.find((row) => row.family === 'district_or_county_education_routing');
const localFailure = floridaFailures.find((row) => row.family === 'county_local_disability_resources');
assert.equal(educationFailure.failure_code, 'bounded_official_district_leaf_packet_exhausted_before_county_grade_coverage', 'Education failure code must explain packet exhaustion.');
assert.equal(localFailure.failure_code, 'official_local_service_center_locator_missing_after_same_domain_repair', 'County-local blocker must preserve the official missing-locator code.');

assert.equal(floridaNext.length, 2, 'Florida next-action queue must collapse to the two final critical blockers.');
assert.equal(floridaNext[0].family, 'district_or_county_education_routing', 'Education blocker must remain top priority.');
assert.ok(floridaReport.includes('truthfully final-blocked'), 'Florida report must explain the final-blocked decision.');
assert.ok(floridaReport.includes('reviewed district-owned leaves'), 'Florida report must preserve exact-leaf blocker evidence.');

console.log('test-batch36-florida-final-blocker-refresh-v1: ok');
