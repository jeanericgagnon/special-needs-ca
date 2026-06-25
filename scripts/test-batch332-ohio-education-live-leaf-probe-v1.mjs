import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);

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

const batchSummary = readJson('data/generated/batch332_ohio_education_live_leaf_probe_summary_v1.json');
const countyCoverage = readJsonl('data/generated/batch332_ohio_education_county_coverage_v1.jsonl');
const ohioSummary = readJson('data/generated/ohio_california_grade_summary_v2.json');
const ohioFailures = readJsonl('data/generated/ohio_failure_ledger_v2.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');

assert.equal(batchSummary.state, 'ohio');
assert.equal(batchSummary.strongCountyCount, 54);
assert.equal(batchSummary.partialCountyCount, 24);
assert.equal(batchSummary.unresolvedCountyCount, 10);
assert.equal(countyCoverage.length, 88);
assert.equal(
  countyCoverage.filter((row) => row.county_status === 'strong').length,
  54,
  'Ohio strong county coverage count must stay stable.',
);
assert.equal(
  countyCoverage.filter((row) => row.county_status === 'partial').length,
  24,
  'Ohio partial county coverage count must stay stable.',
);
assert.equal(
  countyCoverage.filter((row) => row.county_status === 'unresolved').length,
  10,
  'Ohio unresolved county coverage count must stay stable.',
);

assert.equal(ohioSummary.batch, 'batch332_ohio_education_live_leaf_probe_v1');
assert.equal(ohioSummary.classification, 'BLOCKED');
assert.equal(ohioSummary.index_safe, false);
assert.equal(ohioSummary.completeness_pct, 91);
assert.equal(ohioSummary.primary_gap_reason, 'bounded_live_ohio_education_leaf_probe_recovers_54_strong_and_24_partial_counties_but_10_counties_still_unresolved');
assert.equal(ohioSummary.final_blockers[0].failure_code, 'bounded_live_education_leaf_probe_partial_county_coverage');
assert.equal(ohioSummary.final_blockers[0].next_action, 'author_or_verify_exact_local_education_leaves_for_remaining_10_counties_or_keep_ohio_blocked');

const ohioFailure = ohioFailures.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(ohioFailure);
assert.equal(ohioFailure.failure_code, 'bounded_live_education_leaf_probe_partial_county_coverage');
assert.match(ohioFailure.evidence, /54 counties/);
assert.match(ohioFailure.evidence, /24 more counties/);
assert.match(ohioFailure.evidence, /10 counties/);

const ohioAudit = allStateAudit.states.find((row) => row.stateId === 'ohio');
assert.ok(ohioAudit);
assert.equal(ohioAudit.classification, 'BLOCKED');
assert.equal(ohioAudit.indexSafe, false);
assert.equal(ohioAudit.strongCriticalFamilies, 11);
assert.equal(ohioAudit.weakCriticalFamilies, 1);
assert.equal(ohioAudit.packetBatch, 'batch332_ohio_education_live_leaf_probe_v1');
assert.equal(ohioAudit.packetPrimaryGapReason, 'bounded_live_ohio_education_leaf_probe_recovers_54_strong_and_24_partial_counties_but_10_counties_still_unresolved');

const ohioQueue = queueRows.find((row) => row.state === 'ohio');
assert.ok(ohioQueue);
assert.equal(ohioQueue.classification, 'BLOCKED');
assert.equal(ohioQueue.completeness_pct, 91);
assert.equal(ohioQueue.primary_gap_reason, 'bounded_live_ohio_education_leaf_probe_recovers_54_strong_and_24_partial_counties_but_10_counties_still_unresolved');

assert.match(handoff, /## Current Focus State: Ohio/);
assert.match(handoff, /54 counties/);
assert.match(handoff, /24 more counties/);
assert.match(handoff, /10 counties/);

console.log('batch332 ohio education live leaf probe artifacts verified');
