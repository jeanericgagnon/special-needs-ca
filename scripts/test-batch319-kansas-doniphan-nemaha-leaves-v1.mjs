import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateBatch319KansasDoniphanNemahaLeavesV1 } from './run-batch319-kansas-doniphan-nemaha-leaves-v1.mjs';

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

generateBatch319KansasDoniphanNemahaLeavesV1();

const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const failure = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl').find((row) => row.family === 'district_or_county_education_routing');
const verified = readJsonl('data/generated/kansas_verified_sources_v1.jsonl').find((row) => row.family === 'district_or_county_education_routing');
const leaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStatesReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch319_kansas_doniphan_nemaha_leaves_summary_v1.json');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_18_counties');

assert.equal(packet.current_problem_metrics.reviewedDistrictOwnedLeafCount, 18);
assert.ok(packet.reviewed_local_leaf_counties.includes('doniphan-ks'));
assert.ok(packet.reviewed_local_leaf_counties.includes('nemaha-ks'));

assert.ok(leaves.some((row) => row.county_id === 'doniphan-ks' && row.source_url === 'https://www.usd111.org/o/dwes/page/special-education/'));
assert.ok(leaves.some((row) => row.county_id === 'nemaha-ks' && row.source_url === 'https://www.usd115.org/o/mnesc/page/early-childhood/'));

assert.match(failure.failure_code, /18_counties/);
assert.match(failure.evidence, /Doniphan now clears/);
assert.match(failure.evidence, /Nemaha now clears/);

assert.equal(verified.sample_count, 22);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.usd111.org/o/dwes/page/special-education/'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.usd115.org/o/mnesc/page/early-childhood/'));

const kansasAudit = audit.states.find((state) => state.stateId === 'kansas');
assert.equal(kansasAudit.packetBatch, 'batch319_kansas_doniphan_nemaha_leaves_v1');
assert.equal(kansasAudit.packetPrimaryGapReason, 'live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_18_counties');

assert.match(handoff, /still_cover_only_18_counties/);
assert.match(handoff, /Doniphan West USD 111 Special Education/);
assert.match(handoff, /Marshall-Nemaha Special Education Co-op Early Childhood/);
assert.match(allStatesReport, /eighteen reviewed local county-grade education leaves/i);

assert.deepEqual(batchSummary.newly_verified_counties, ['doniphan-ks', 'nemaha-ks']);
assert.equal(batchSummary.reviewed_leaf_count, 18);

console.log('test-batch319-kansas-doniphan-nemaha-leaves-v1: ok');
