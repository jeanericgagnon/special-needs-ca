import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateBatch330NebraskaSiblingLeafFinalityV1 } from './run-batch330-nebraska-sibling-leaf-finality-v1.mjs';

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

const result = generateBatch330NebraskaSiblingLeafFinalityV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gap = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const failure = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const verified = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl').find((row) => row.family === 'county_local_disability_resources');
const next = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const queue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl').find((row) => row.state === 'nebraska');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch330_nebraska_sibling_leaf_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch330-nebraska-sibling-leaf-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'public_nebraska_office_config_still_only_references_one_web_map_and_a_closest_feature_output_while_the_feature_service_stops_at_42_offices_for_93_counties');
assert.equal(summary.batch, 'batch330_nebraska_sibling_leaf_finality_v1');

assert.equal(gap.family_status, 'blocked_public_config_confirms_no_county_assignment_datasource');
assert.match(gap.status_reason, /same-host DHHS sibling leaves/i);
assert.match(gap.status_reason, /42 offices, 93 county boundaries, empty relationships, and only 37 distinct office counties/i);

assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /economic-assistance\.aspx/i);
assert.match(failure.evidence, /Contact-DHHS\.aspx/i);
assert.match(failure.evidence, /DD-Contact-Us\.aspx/i);
assert.match(failure.evidence, /Local Health Departments/);

assert.equal(verified.family_status, gap.family_status);
assert.equal(verified.blocker_code, summary.primary_gap_reason);
assert.equal(verified.sample_count, 9);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://dhhs.ne.gov/Pages/economic-assistance.aspx'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://dhhs.ne.gov/Pages/Contact-DHHS.aspx'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://dhhs.ne.gov/Pages/DD-Contact-Us.aspx'));

assert.equal(next.next_action, 'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published');
assert.match(next.evidence, /same-host DHHS sibling leaves only loop back/i);

assert.equal(queue.primary_gap_reason, summary.primary_gap_reason);

const nebraskaAudit = audit.states.find((row) => row.stateId === 'nebraska');
assert.ok(nebraskaAudit);
assert.equal(nebraskaAudit.packetBatch, 'batch330_nebraska_sibling_leaf_finality_v1');
assert.equal(nebraskaAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.match(handoff, /## Current Focus State: Nebraska/);
assert.match(handoff, /economic-assistance\.aspx/);
assert.match(handoff, /Contact-DHHS\.aspx/);
assert.match(handoff, /loop back to `Public-Assistance-Offices\.aspx`/);
assert.match(allStateReport, /same-host DHHS sibling leaves only loop `Local DHHS Offices` back to the current wrapper/i);

assert.equal(batchSummary.same_host_sibling_loops_confirmed, 3);
assert.match(batchReport, /same-host DHHS sibling leaves/);

const completeCount = audit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = audit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 26);
assert.equal(blockedCount, 24);

console.log('test-batch330-nebraska-sibling-leaf-finality-v1: ok');
