import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch196NewYorkBlockerPacketsV1 } from './run-batch196-new-york-blocker-packets-v1.mjs';

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

const result = generateBatch196NewYorkBlockerPacketsV1();
const summary = readJson('data/generated/new-york_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-york_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-york_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-york_verified_sources_v1.jsonl');
const countyPacket = readJson('data/generated/new-york_county_local_disability_resources_health_host_packet_v1.json');
const educationPacket = readJson('data/generated/new-york_district_or_county_education_routing_boces_packet_v1.json');
const ptiPacket = readJson('data/generated/new-york_parent_training_information_center_scope_packet_v1.json');
const batchSummary = readJson('data/generated/batch196_new_york_blocker_packets_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-york-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const ptiGap = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(countyGap.family_status, 'blocked_health_hostwide_403');
assert.match(countyGap.status_reason, /all returned HTTP 403/i);
assert.equal(eduGap.family_status, 'blocked_exact_leaf_repair_exhausted');
assert.match(eduGap.status_reason, /three BOCES-owned pages/i);
assert.equal(ptiGap.family_status, 'blocked_reviewed_regional_source_not_statewide');
assert.match(ptiGap.status_reason, /Western New York/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 5);
assert.ok(countyVerified.samples.every((row) => row.verification_status === 'blocked'));
assert.match(countyVerified.samples[0].source_url, /ldss\.htm/);
assert.match(countyVerified.samples[4].source_url, /medicaid\/redesign/);

assert.equal(countyPacket.current_metrics.blockedHealthNySurfaces, 5);
assert.equal(educationPacket.current_metrics.exactLeafCount, 3);
assert.equal(ptiPacket.current_metrics.reviewedStatewideSources, 0);

assert.equal(batchSummary.healthNyBlockedSurfaceCount, 5);
assert.equal(batchSummary.exactBocesLeafCount, 3);
assert.equal(batchSummary.reviewedStatewidePtiSources, 0);

assert.match(failureRows.find((row) => row.family === 'county_local_disability_resources').evidence, /old county rows.*cannot remain as sample proof/i);
assert.match(failureRows.find((row) => row.family === 'parent_training_information_center').evidence, /statewide PTI scope proof/i);
assert.ok(report.includes('`county_local_disability_resources` now preserves the blocked `health.ny.gov` host family itself'));
assert.ok(report.includes('three-leaf BOCES ceiling'));
assert.ok(report.includes('regional-scope PTI blocker'));
assert.ok(lessons.includes('### Regional Parent-Center Scope Cannot Satisfy A Statewide PTI Gate'));

console.log('test-batch196-new-york-blocker-packets-v1: ok');
