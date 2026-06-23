import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch226NewYorkPtiStatewideRepairV1 } from './run-batch226-new-york-pti-statewide-repair-v1.mjs';

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

const result = generateBatch226NewYorkPtiStatewideRepairV1();
const summary = readJson('data/generated/new-york_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-york_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-york_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-york_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-york_next_action_queue_v2.jsonl');
const ptiPacket = readJson('data/generated/new-york_parent_training_information_center_scope_packet_v1.json');
const batchSummary = readJson('data/generated/batch226_new_york_pti_statewide_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-york-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 2);
assert.deepEqual(summary.major_gap_families, []);
assert.ok(!summary.final_blockers.some((row) => row.family === 'parent_training_information_center'));

const ptiGap = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiGap.family_status, 'verified_state_grade');
assert.match(ptiGap.status_reason, /5 PTIs serving New York State/i);

assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'));

const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiVerified.family_status, 'verified_state_grade');
assert.equal(ptiVerified.sample_count, 2);
assert.match(ptiVerified.samples[0].source_url, /parentcenterhub\.org\/findurcenter\/new-york/);
assert.match(ptiVerified.samples[0].evidence_snippet, /5 PTIs serving New York State/i);
assert.match(ptiVerified.samples[1].source_url, /starbridgeinc\.org/);

assert.ok(!nextRows.some((row) => row.family === 'parent_training_information_center'));

assert.equal(ptiPacket.current_metrics.reviewedStatewideSources, 1);
assert.equal(ptiPacket.current_metrics.listedPtiCount, 5);
assert.equal(ptiPacket.current_metrics.statewideCoverageProven, true);
assert.equal(ptiPacket.supporting_first_party_host, 'https://starbridgeinc.org/');

assert.equal(batchSummary.ptiFamilyRepaired, true);
assert.equal(batchSummary.listedPtiCount, 5);
assert.equal(batchSummary.supportingFirstPartyHostLive, true);

assert.ok(report.includes('PTI is no longer a blocker.'));
assert.ok(report.includes('There are 5 PTIs serving New York State'));
assert.ok(lessons.includes('### Parent Center Hub Can Prove Distributed Statewide PTI Coverage Even When No Single Center Covers The Entire State'));

console.log('test-batch226-new-york-pti-statewide-repair-v1: ok');
