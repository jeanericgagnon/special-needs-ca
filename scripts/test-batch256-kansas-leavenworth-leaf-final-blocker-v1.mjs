import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch256KansasLeavenworthLeafFinalBlockerV1 } from './run-batch256-kansas-leavenworth-leaf-final-blocker-v1.mjs';

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

const result = generateBatch256KansasLeavenworthLeafFinalBlockerV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const leaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const batchSummary = readJson('data/generated/batch256_kansas_leavenworth_leaf_final_blocker_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'reviewed_kansas_district_owned_leaves_now_cover_8_counties_but_export_backed_county_grade_coverage_is_still_incomplete');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade');
assert.match(gap.status_reason, /8\/105 counties/i);
assert.match(gap.status_reason, /cooperative signals/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'reviewed_kansas_district_owned_leaves_now_cover_8_counties_but_export_backed_county_grade_coverage_is_still_incomplete');
assert.match(failure.evidence, /usd453\.org\/district-departments\/special-education/i);
assert.match(failure.evidence, /305ckcie\.com\/departments\/early-childhood-special-education/i);
assert.match(failure.evidence, /usd383\.org\/sitemap\.xml/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade');
assert.ok(verified.samples.some((sample) => sample.sample_name === 'leavenworth district-owned leaf'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'saline district-linked cooperative lead'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'riley district exact-leaf non-match'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'continue_export_backed_district_and_affiliated_coop_leaf_authoring_county_by_county_and_keep_exact_non_matches_frozen');

const queue = queueRows.find((row) => row.state === 'kansas');
assert.equal(queue.status, 'BLOCKED');
assert.equal(queue.primary_gap_reason, 'reviewed_kansas_district_owned_leaves_now_cover_8_counties_but_export_backed_county_grade_coverage_is_still_incomplete');

assert.equal(packet.current_problem_metrics.reviewedDistrictOwnedLeafCount, 8);
assert.ok(packet.reviewed_local_leaf_counties.includes('leavenworth-ks'));

assert.equal(leaves.length, 8);
assert.ok(leaves.some((row) => row.county_id === 'leavenworth-ks' && row.source_url === 'https://www.usd453.org/district-departments/special-education'));

assert.equal(batchSummary.newly_verified_county, 'leavenworth-ks');
assert.equal(batchSummary.saline_coop_lead_preserved, true);
assert.equal(batchSummary.riley_non_match_frozen, true);
assert.ok(report.includes('Leavenworth now clears from an exact district-owned Special Education leaf on usd453.org, raising the reviewed county total to eight.'));
assert.ok(report.includes('Saline now has a stronger official district-linked cooperative lead through CKCIE'));
assert.ok(lessons.includes('### District Site Maps Can Surface Cooperative Leads Without Clearing County-Grade Routing'));

console.log('test-batch256-kansas-leavenworth-leaf-final-blocker-v1: ok');
