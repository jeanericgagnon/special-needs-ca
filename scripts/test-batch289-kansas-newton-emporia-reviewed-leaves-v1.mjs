import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch289KansasNewtonEmporiaReviewedLeavesV1 } from './run-batch289-kansas-newton-emporia-reviewed-leaves-v1.mjs';

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

const result = generateBatch289KansasNewtonEmporiaReviewedLeavesV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const leaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch289_kansas_newton_emporia_reviewed_leaves_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStatesReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch289-kansas-newton-emporia-reviewed-leaves-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_14_counties_but_export_backed_county_grade_coverage_is_still_incomplete');

assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 14);
assert.equal(packet.current_problem_metrics.reviewedDistrictOwnedLeafCount, 14);
assert.ok(packet.reviewed_local_leaf_counties.includes('harvey-ks'));
assert.ok(packet.reviewed_local_leaf_counties.includes('lyon-ks'));
assert.ok(!packet.unresolved_local_leaf_counties.includes('harvey-ks'));
assert.ok(!packet.unresolved_local_leaf_counties.includes('lyon-ks'));

const harveyLeaf = leaves.find((row) => row.county_id === 'harvey-ks');
const lyonLeaf = leaves.find((row) => row.county_id === 'lyon-ks');
assert.equal(harveyLeaf.source_url, 'https://www.usd373.org/about/departments/special-education');
assert.equal(harveyLeaf.evidence_title, 'Special Education - Newton Unified School District 373');
assert.equal(lyonLeaf.source_url, 'https://www.usd253.org/services/fhsec');
assert.equal(lyonLeaf.evidence_h1, 'Flint Hills Special Education Cooperative');

const gapRow = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gapRow.family_status, 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade');
assert.match(gapRow.status_reason, /14\/105 counties/i);

assert.equal(failureRows.length, 1);
assert.match(failureRows[0].evidence, /Harvey now clears because https:\/\/www\.usd373\.org\/about\/departments\/special-education/i);
assert.match(failureRows[0].evidence, /Lyon now clears because https:\/\/www\.usd253\.org\/services\/fhsec/i);
assert.match(failureRows[0].evidence, /Dickinson remains a correct exact non-match freeze/i);

const verifiedRow = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(verifiedRow.blocker_code, /14_counties/i);
assert.ok(verifiedRow.samples.some((sample) => sample.sample_name === 'harvey local education-routing leaf'));
assert.ok(verifiedRow.samples.some((sample) => sample.sample_name === 'lyon local education-routing leaf'));

assert.equal(nextRows.length, 1);
assert.match(nextRows[0].evidence, /14\/105 counties/i);

const kansasQueue = queueRows.find((row) => row.state === 'kansas');
assert.equal(kansasQueue.primary_gap_reason, summary.primary_gap_reason);
assert.equal(kansasQueue.classification, 'BLOCKED');
assert.equal(kansasQueue.index_safe, false);

const kansasAudit = audit.states.find((row) => row.stateId === 'kansas');
assert.equal(kansasAudit.packetPrimaryGapReason, summary.primary_gap_reason);
assert.equal(kansasAudit.classification, 'BLOCKED');
assert.equal(kansasAudit.indexSafe, false);

assert.equal(batchSummary.reviewed_leaf_count, 14);
assert.deepEqual(batchSummary.promoted_counties, ['harvey-ks', 'lyon-ks']);

assert.ok(report.includes('Harvey now clears from the district-owned Newton USD 373 Special Education leaf'));
assert.ok(report.includes('Lyon now clears from the district-linked Flint Hills Special Education Cooperative leaf'));
assert.ok(handoff.includes('## Current Focus State: Kansas'));
assert.ok(handoff.includes('14/105 counties'));
assert.ok(handoff.includes('https://www.usd373.org/about/departments/special-education'));
assert.ok(handoff.includes('https://www.usd253.org/services/fhsec'));
assert.ok(allStatesReport.includes('Kansas remains blocked, but reviewed local education-routing proof now covers 14 of 105 counties'));
assert.ok(batchReport.includes('Harvey now clears'));

console.log('test-batch289-kansas-newton-emporia-reviewed-leaves-v1: ok');
