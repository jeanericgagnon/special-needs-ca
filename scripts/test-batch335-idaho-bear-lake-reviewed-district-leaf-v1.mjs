import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch335IdahoBearLakeReviewedDistrictLeafV1 } from './run-batch335-idaho-bear-lake-reviewed-district-leaf-v1.mjs';

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

const result = generateBatch335IdahoBearLakeReviewedDistrictLeafV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch335_idaho_bear_lake_reviewed_district_leaf_summary_v1.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'reviewed_idaho_district_leaves_hold_at_13_counties_after_live_bear_lake_special_education_leaf_and_remaining_county_bearing_district_roots_now_fail_into_404_or_blank_shell_negative_checks');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade');
assert.match(educationGap.status_reason, /Bear Lake School District root exposed an embedded district-owned `Special Education` page object/i);
assert.match(educationGap.status_reason, /thirteen reviewed county-grade district-owned education leaves/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'reviewed_district_special_services_leaves_hold_at_13_counties_after_live_bear_lake_leaf_and_remaining_county_bearing_roots_now_fail_into_404_or_blank_shell_checks');
assert.match(educationFailure.evidence, /https:\/\/www\.blsd\.net\/en-US\/special-education-e92c299d/i);
assert.match(educationFailure.evidence, /Special Education Director Holly Tanner/i);
assert.match(educationFailure.evidence, /thirteen reviewed county-grade district-owned education leaves/i);
assert.match(educationFailure.evidence, /News and Announcements - Clark Co School District 161/i);
assert.match(educationFailure.evidence, /blank titleless Incapsula-style shells/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade');
assert.equal(verified.sample_count, 16);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.blsd.net/en-US/special-education-e92c299d' && sample.verification_status === 'verified'));
assert.ok(verified.samples.some((sample) => /Bear Lake School District reviewed district leaf/i.test(sample.sample_name)));
assert.ok(verified.samples.some((sample) => /unresolved district remainder negative checks/i.test(sample.sample_name) && sample.verification_status === 'blocked'));

assert.equal(packet.current_problem_metrics.reviewedExactLeafCount, 13);
assert.ok(packet.reviewed_exact_leaves.some((leaf) => leaf.county_id === 'bear-lake-id' && leaf.exact_leaf_url === 'https://www.blsd.net/en-US/special-education-e92c299d'));
assert.ok(packet.reviewed_exact_leaves.some((leaf) => leaf.county_id === 'gem-id'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'continue_exact_district_leaf_expansion_only_when_uncovered_idaho_district_hosts_expose_role_bearing_special_education_or_special_services_leaves');

const queueRow = queueRows.find((row) => row.state === 'idaho');
assert.equal(queueRow.primary_gap_reason, 'reviewed_idaho_district_leaves_hold_at_13_counties_after_live_bear_lake_special_education_leaf_and_remaining_county_bearing_district_roots_now_fail_into_404_or_blank_shell_negative_checks');

const allStateRow = allStateAudit.states.find((row) => row.stateId === 'idaho');
assert.equal(allStateRow.packetBatch, 'batch335_idaho_bear_lake_reviewed_district_leaf_v1');
assert.equal(allStateRow.packetPrimaryGapReason, 'reviewed_idaho_district_leaves_hold_at_13_counties_after_live_bear_lake_special_education_leaf_and_remaining_county_bearing_district_roots_now_fail_into_404_or_blank_shell_negative_checks');

assert.equal(batchSummary.reviewed_exact_leaf_count, 13);
assert.equal(batchSummary.new_reviewed_county, 'bear-lake-id');
assert.equal(batchSummary.exhausted_county_bearing_roots.length, 6);
assert.equal(batchSummary.negative_check_refresh_date, '2026-06-25T00:00:00.000Z');

assert.match(stateReport, /Bear Lake now has a reviewed district-owned Special Education leaf/i);
assert.match(allStateReport, /Idaho remains blocked, but the education lane is now better bounded/i);
assert.ok(handoff.includes('## Current Focus State: Idaho'));
assert.ok(handoff.includes('reviewed_idaho_district_leaves_hold_at_13_counties_after_live_bear_lake_special_education_leaf_and_remaining_county_bearing_district_roots_now_fail_into_404_or_blank_shell_negative_checks'));
assert.ok(handoff.includes('https://www.blsd.net/en-US/special-education-e92c299d'));
assert.ok(handoff.includes('https://www.jeffersonsd251.org/'));
assert.ok(handoff.includes('blank Incapsula-style shells'));
assert.ok(lessons.includes('### Embedded District Menu Data Can Expose A Safe Exact Leaf'));

console.log('test-batch335-idaho-bear-lake-reviewed-district-leaf-v1: ok');
