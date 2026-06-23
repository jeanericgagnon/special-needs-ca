import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch244NewMexicoPedTimeoutRefreshV1 } from './run-batch244-new-mexico-ped-timeout-refresh-v1.mjs';

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

const result = generateBatch244NewMexicoPedTimeoutRefreshV1();
const summary = readJson('data/generated/new-mexico_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-mexico_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-mexico_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-mexico_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-mexico_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/new-mexico_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const batchSummary = readJson('data/generated/batch244_new_mexico_ped_timeout_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-mexico-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'blocked_exact_district_or_county_leafs_unverified');
assert.match(eduGap.status_reason, /timed out after 25 seconds/i);
assert.match(eduGap.status_reason, /zero district-owned, county-grade, or regional education leaves on disk/i);
assert.match(eduGap.status_reason, /wrong-role `https:\/\/www\.nmhealth\.org\/about\/ddsd` cross-role leak/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(eduFailure.evidence, /generic PED root and the statewide Special Education Bureau page/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(eduVerified.query_basis, /bounded live PED root and bureau probes/i);
assert.match(eduVerified.blocker_evidence, /timed out after 25 seconds/i);

const eduNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduNext.next_action, 'author_county_or_district_exact_targets');
assert.match(eduNext.evidence, /authoring exact local education leaves/i);

assert.equal(packet.current_metrics.pedRootTimedOut25s, true);
assert.equal(packet.current_metrics.pedBureauTimedOut25s, true);
assert.equal(packet.current_metrics.districtOwnedLeavesOnDisk, 0);
assert.equal(packet.bounded_live_probe_result.outcome, 'timed_out_25s_both_exact_urls');

assert.equal(batchSummary.ped_root_timed_out_25s, true);
assert.equal(batchSummary.ped_bureau_timed_out_25s, true);
assert.equal(batchSummary.district_owned_leaves_on_disk, 0);

assert.ok(report.includes('exact live PED root plus bureau probes now confirm this is not just a stale single-timeout assumption'));
assert.ok(lessons.includes('### If Both The State Root And Bureau Leaf Timeout, Freeze Root Retries And Author Local Leaves'));

console.log('test-batch244-new-mexico-ped-timeout-refresh-v1: ok');
