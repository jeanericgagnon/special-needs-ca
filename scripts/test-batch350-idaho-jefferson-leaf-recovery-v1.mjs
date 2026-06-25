import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch350IdahoJeffersonLeafRecoveryV1 } from './run-batch350-idaho-jefferson-leaf-recovery-v1.mjs';

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

const result = generateBatch350IdahoJeffersonLeafRecoveryV1();
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
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch350_idaho_jefferson_leaf_recovery_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch350-idaho-jefferson-leaf-recovery-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch350_idaho_jefferson_leaf_recovery_v1');
assert.equal(summary.primary_gap_reason, 'remaining_idaho_district_roots_now_reduce_to_live_homepage_sitemap_surfaces_without_role_bearing_leaves_after_jefferson_special_services_recovery');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_remaining_live_district_roots_without_role_bearing_leaves_after_jefferson_leaf_recovery');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_remaining_live_district_roots_without_role_bearing_leaves_after_jefferson_leaf_recovery');
assert.match(educationGap.status_reason, /Jefferson is no longer just a blank-shell blocker/i);
assert.match(educationGap.status_reason, /page now provides a district-owned special-education leaf with IDEA scope text/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'remaining_live_idaho_district_roots_expose_zero_role_bearing_special_education_or_student_services_links_after_jefferson_recovery');
assert.match(educationFailure.evidence, /jeffersonsd251\.org\/special-education\//i);
assert.match(educationFailure.evidence, /Camas and Clark both stayed live/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.sample_count, 20);
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Jefferson special education page' && row.verification_status === 'verified'));
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Jefferson public district sitemap' && row.verification_status === 'verified'));
assert.ok(!educationVerified.samples.some((row) => row.sample_name === 'Jefferson School District 251 blank challenge shell'));

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'continue_exact_district_leaf_expansion_only_when_camas_clark_fremont_oneida_or_shoshone_publish_role_bearing_special_education_or_special_services_links');

const queueRow = queueRows.find((row) => row.state === 'idaho');
assert.equal(queueRow.primary_gap_reason, 'remaining_idaho_district_roots_now_reduce_to_live_homepage_sitemap_surfaces_without_role_bearing_leaves_after_jefferson_special_services_recovery');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'idaho');
assert.equal(auditRow.packetBatch, 'batch350_idaho_jefferson_leaf_recovery_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'remaining_idaho_district_roots_now_reduce_to_live_homepage_sitemap_surfaces_without_role_bearing_leaves_after_jefferson_special_services_recovery');
assert.equal(auditRow.familyStatuses.district_or_county_education_routing, 'blocked_remaining_live_district_roots_without_role_bearing_leaves_after_jefferson_leaf_recovery');

assert.match(stateReport, /Jefferson now clears from district-owned special-services pages recovered via the public WordPress sitemap/i);
assert.match(allStateReport, /Jefferson now clears from public sitemap-recovered `special-services` \/ `special-education` leaves/i);
assert.match(handoff, /Current Focus State: Idaho/);
assert.match(handoff, /Jefferson special education/);
assert.match(handoff, /Oneida Child Find link/);
assert.match(lessons, /Public WP Sitemaps Can Reopen A District Host That Looked Blank In Raw HTML/);

assert.equal(batchSummary.recovered_role_bearing_district_hosts, 1);
assert.equal(batchSummary.live_homepage_roots_without_role_bearing_links, 5);
assert.equal(batchSummary.challenge_shell_roots, 0);
assert.equal(batchSummary.reviewed_exact_leaf_count_after_recovery, 14);
assert.equal(batchSummary.result, 'jefferson_recovered_remaining_live_district_root_packet_still_incomplete');
assert.match(batchReport, /recovered Jefferson district-owned education leaves/i);

console.log('test-batch350-idaho-jefferson-leaf-recovery-v1: ok');
