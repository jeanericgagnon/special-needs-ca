import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateBatch336NebraskaGeocoderOutputFinalityV1 } from './run-batch336-nebraska-geocoder-output-finality-v1.mjs';

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

const result = generateBatch336NebraskaGeocoderOutputFinalityV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gap = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const failure = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const verified = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl').find((row) => row.family === 'county_local_disability_resources');
const next = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const queue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl').find((row) => row.state === 'nebraska');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch336_nebraska_geocoder_output_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch336-nebraska-geocoder-output-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'public_nebraska_office_config_still_only_references_one_web_map_a_closest_feature_output_and_a_geocoder_county_result_but_no_official_county_assignment_datasource');
assert.equal(summary.batch, 'batch336_nebraska_geocoder_output_finality_v1');

assert.equal(gap.family_status, 'blocked_public_config_only_exposes_closest_office_and_geocoder_county_outputs_without_assignment_contract');
assert.match(gap.status_reason, /geocoder-result output/i);
assert.match(gap.status_reason, /County`? field/i);

assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /widget_383_output_config_0/);
assert.match(failure.evidence, /Nebraska from ArcGIS World Geocoding Service/);
assert.match(failure.evidence, /County`? field/);

assert.equal(verified.family_status, gap.family_status);
assert.equal(verified.blocker_code, summary.primary_gap_reason);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska geocoder output includes county metadata only'));
assert.equal(verified.sample_count, 10);

assert.equal(next.next_action, 'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published');
assert.match(next.evidence, /closest-office layer and a geocoder-result layer/i);

assert.equal(queue.primary_gap_reason, summary.primary_gap_reason);

const nebraskaAudit = audit.states.find((row) => row.stateId === 'nebraska');
assert.ok(nebraskaAudit);
assert.equal(nebraskaAudit.packetBatch, 'batch336_nebraska_geocoder_output_finality_v1');
assert.equal(nebraskaAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.match(handoff, /## Current Focus State: Nebraska/);
assert.match(handoff, /geocoder-result output/i);
assert.match(handoff, /Nebraska from ArcGIS World Geocoding Service/);
assert.match(allStateReport, /closest-office layer and a geocoder-result layer/i);
assert.match(lessons, /### Geocoder County Fields Do Not Equal Office Service Areas/);

assert.equal(batchSummary.resource_count, 9);
assert.equal(batchSummary.geocoder_output_has_county_field, true);
assert.equal(batchSummary.same_host_sibling_loops_confirmed, 3);
assert.match(batchReport, /geocoder-result output layer/i);

const completeCount = audit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = audit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 26);
assert.equal(blockedCount, 24);

console.log('test-batch336-nebraska-geocoder-output-finality-v1: ok');
