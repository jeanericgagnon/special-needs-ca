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
assert.equal(batchSummary.strongCountyCount, 58);
assert.equal(batchSummary.partialCountyCount, 30);
assert.equal(batchSummary.unresolvedCountyCount, 0);
assert.equal(countyCoverage.length, 88);
assert.equal(
  countyCoverage.filter((row) => row.county_status === 'strong').length,
  58,
  'Ohio strong county coverage count must stay stable.',
);
assert.equal(
  countyCoverage.filter((row) => row.county_status === 'partial').length,
  30,
  'Ohio partial county coverage count must stay stable.',
);
assert.equal(
  countyCoverage.filter((row) => row.county_status === 'unresolved').length,
  0,
  'Ohio unresolved county coverage count must stay stable.',
);

assert.equal(ohioSummary.batch, 'batch332_ohio_education_live_leaf_probe_v1');
assert.equal(ohioSummary.classification, 'COMPLETE');
assert.equal(ohioSummary.index_safe, true);
assert.equal(ohioSummary.completeness_pct, 100);
assert.equal(ohioSummary.primary_gap_reason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.deepEqual(ohioSummary.final_blockers, []);

const ohioFailure = ohioFailures.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(ohioFailure, undefined);

const ohioAudit = allStateAudit.states.find((row) => row.stateId === 'ohio');
assert.ok(ohioAudit);
assert.equal(ohioAudit.classification, 'COMPLETE');
assert.equal(ohioAudit.indexSafe, true);
assert.equal(ohioAudit.strongCriticalFamilies, 12);
assert.equal(ohioAudit.weakCriticalFamilies, 0);
assert.equal(ohioAudit.packetBatch, 'batch332_ohio_education_live_leaf_probe_v1');
assert.equal(ohioAudit.packetPrimaryGapReason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');

const ohioQueue = queueRows.find((row) => row.state === 'ohio');
assert.ok(ohioQueue);
assert.equal(ohioQueue.classification, 'COMPLETE');
assert.equal(ohioQueue.completeness_pct, 100);
assert.equal(ohioQueue.primary_gap_reason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');

assert.doesNotMatch(handoff, /## Current Focus State: Ohio/);
assert.match(handoff, /## Current Focus State: Minnesota/);
assert.match(handoff, /Ohio/);
assert.match(handoff, /Current Complete States/);

console.log('batch332 ohio education live leaf probe artifacts verified');
