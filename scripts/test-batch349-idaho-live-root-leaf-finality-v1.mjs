import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch349IdahoLiveRootLeafFinalityV1 } from './run-batch349-idaho-live-root-leaf-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch349IdahoLiveRootLeafFinalityV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchSummary = readJson('data/generated/batch349_idaho_live_root_leaf_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch349-idaho-live-root-leaf-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch349_idaho_live_root_leaf_finality_v1');
assert.equal(summary.primary_gap_reason, 'remaining_idaho_district_roots_now_split_between_live_homepage_sitemap_surfaces_without_role_bearing_leaves_and_one_blank_shell_challenge_after_bounded_exact_leaf_review');
assert.equal(summary.recommended_batch, 'hold_for_new_role_bearing_district_leaf_or_county_contract');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_remaining_live_district_roots_without_role_bearing_leaves_after_bounded_homepage_sitemap_review');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_remaining_live_district_roots_without_role_bearing_leaves_after_bounded_homepage_sitemap_review');
assert.match(educationGap.status_reason, /Camas, Clark, Fremont, Oneida, and Shoshone all stayed publicly reachable/i);
assert.match(educationGap.status_reason, /Jefferson still returned the same blank Incapsula-style shell/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'remaining_live_idaho_district_roots_expose_zero_role_bearing_special_education_or_student_services_links_and_jefferson_stays_blank_shell');
assert.match(educationFailure.evidence, /Special-Ed-Records-Distruction-1\.pdf/i);
assert.match(educationFailure.evidence, /blank Incapsula-style shell/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.sample_count, 19);
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Camas County Schools live root without role-bearing education links'));
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Jefferson School District 251 blank challenge shell'));

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'continue_exact_district_leaf_expansion_only_when_remaining_idaho_district_hosts_publish_role_bearing_special_education_or_special_services_links');

const queueRow = queueRows.find((row) => row.state === 'idaho');
assert.equal(queueRow.primary_gap_reason, 'remaining_idaho_district_roots_now_split_between_live_homepage_sitemap_surfaces_without_role_bearing_leaves_and_one_blank_shell_challenge_after_bounded_exact_leaf_review');
assert.equal(queueRow.repair_lane, 'blocked_until_new_district_leaf_or_public_county_contract');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'idaho');
assert.equal(auditRow.packetBatch, 'batch349_idaho_live_root_leaf_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'remaining_idaho_district_roots_now_split_between_live_homepage_sitemap_surfaces_without_role_bearing_leaves_and_one_blank_shell_challenge_after_bounded_exact_leaf_review');
assert.equal(auditRow.familyStatuses.district_or_county_education_routing, 'blocked_remaining_live_district_roots_without_role_bearing_leaves_after_bounded_homepage_sitemap_review');

assert.match(stateReport, /Education is now blocked on a sharper live-root finality check/i);
assert.match(allStateReport, /Idaho remains blocked on a stronger district-root finality check/i);
assert.match(handoff, /Current Focus State: Idaho/);
assert.match(handoff, /Camas County Schools root/);
assert.match(handoff, /Jefferson School District 251 root/);
assert.match(handoff, /Next State Order After Idaho/);

assert.equal(batchSummary.reviewed_live_roots, 6);
assert.equal(batchSummary.live_homepage_roots_without_role_bearing_links, 5);
assert.equal(batchSummary.challenge_shell_roots, 1);
assert.equal(batchSummary.result, 'source_final_for_current_exact_district_root_packet');
assert.match(batchReport, /live-root finality check/i);

console.log('test-batch349-idaho-live-root-leaf-finality-v1: ok');
