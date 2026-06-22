import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch118ArizonaCountyRootLiveProbeV1 } from './run-batch118-arizona-county-root-live-probe-v1.mjs';

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

const result = generateBatch118ArizonaCountyRootLiveProbeV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const countyPacket = readJson('data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json');
const batchSummary = readJson('data/generated/batch118_arizona_county_root_live_probe_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'challenged_official_roots_zero_exact_education_leaves_and_nonresolving_county_root_inventory');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /14\/15 do not resolve/i);
assert.match(countyGap.status_reason, /Maricopa root returned HTTP 403/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'county_office_packet_empty_and_county_root_inventory_nonresolving');
assert.equal(countyFailure.next_action, 'replace_nonresolving_county_root_seeds_before_authoring_arizona_county_local_leaves');
assert.match(countyFailure.evidence, /failed DNS resolution/i);
assert.match(countyFailure.evidence, /Maricopa returned HTTP 403/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.blocker_code, 'county_office_packet_empty_and_county_root_inventory_nonresolving');
assert.match(countyVerified.query_basis, /stored Arizona county-root inventory/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'replace_nonresolving_county_root_seeds_before_authoring_arizona_county_local_leaves');

assert.equal(countyPacket.current_problem_metrics.nonresolvingCountyRootCount, 14);
assert.equal(countyPacket.current_problem_metrics.blockedCountyRootCount, 1);
assert.ok(countyPacket.root_domains_to_review.some((row) => String(row).includes('14 of 15 current Arizona county roots do not resolve')));

assert.equal(batchSummary.nonresolvingCountyRootCount, 14);
assert.equal(batchSummary.blockedCountyRootCount, 1);
assert.ok(report.includes('current county-root inventory itself is mostly dead'));
assert.ok(lessons.includes('County Root Inventory Must Pass Live DNS Before It Seeds A Leaf Packet'));

console.log('test-batch118-arizona-county-root-live-probe-v1: ok');
