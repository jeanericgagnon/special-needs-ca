import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch358IdahoFremontChildFindRecoveryV1 } from './run-batch358-idaho-fremont-child-find-recovery-v1.mjs';

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

const result = generateBatch358IdahoFremontChildFindRecoveryV1();
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
const batchSummary = readJson('data/generated/batch358_idaho_fremont_child_find_recovery_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch358-idaho-fremont-child-find-recovery-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch358_idaho_fremont_child_find_recovery_v1');
assert.equal(summary.completeness_pct, 86);
assert.equal(summary.primary_gap_reason, 'remaining_idaho_district_roots_now_reduce_to_camas_clark_and_shoshone_wrong_role_leaves_without_special_education_or_student_services_routing');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_remaining_live_district_roots_only_materialize_wrong_role_contact_title_ix_or_federal_program_leaves_after_fremont_recovery');

const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtGap.family_status, 'blocked_remaining_live_district_roots_only_materialize_wrong_role_contact_title_ix_or_federal_program_leaves_after_fremont_recovery');
assert.match(districtGap.status_reason, /Fremont now exposes public district-owned Child Find Preschool Screenings/i);
assert.match(districtGap.status_reason, /Camas still only materializes a district-owned `Contact Information` leaf/i);
assert.match(districtGap.status_reason, /Shoshone remains live with district-office contacts, principal contacts, and federal-program menu leaves/i);

const districtFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtFailure.failure_code, 'remaining_live_idaho_district_roots_materialize_contact_title_ix_or_federal_program_leaves_but_zero_role_bearing_special_education_or_student_services_routing');
assert.match(districtFailure.evidence, /api\/v4\/o\/12771\/cms\/events/i);
assert.match(districtFailure.evidence, /Child Find Preschool Screenings/i);
assert.match(districtFailure.evidence, /Camas only exposes a district-owned `Contact Information` leaf/i);
assert.match(districtFailure.evidence, /Shoshone exposes district-office contacts plus federal-program leaves/i);

const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Camas Contact Information leaf'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Clark Contact Us leaf'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Clark Title IX leaf'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Fremont Child Find screenings API'));
assert.ok(!districtVerified.samples.some((row) => row.sample_name === 'Fremont Contact Us leaf'));
assert.ok(!districtVerified.samples.some((row) => row.sample_name === 'Fremont Title IX leaf'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Shoshone district-office and federal-program menu'));

const districtNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtNext.next_action, 'continue_exact_district_leaf_expansion_only_when_camas_clark_or_shoshone_publish_role_bearing_special_education_special_services_student_services_504_or_procedural_safeguards_leaves');

const queueRow = queueRows.find((row) => row.state === 'idaho');
assert.equal(queueRow.primary_gap_reason, 'remaining_idaho_district_roots_now_reduce_to_camas_clark_and_shoshone_wrong_role_leaves_without_special_education_or_student_services_routing');
assert.equal(queueRow.completeness_pct, 86);

const auditRow = allStateAudit.states.find((row) => row.stateId === 'idaho');
assert.equal(auditRow.packetBatch, 'batch358_idaho_fremont_child_find_recovery_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'remaining_idaho_district_roots_now_reduce_to_camas_clark_and_shoshone_wrong_role_leaves_without_special_education_or_student_services_routing');
assert.equal(auditRow.completenessPct, 86);
assert.equal(auditRow.familyStatuses.district_or_county_education_routing, 'blocked_remaining_live_district_roots_only_materialize_wrong_role_contact_title_ix_or_federal_program_leaves_after_fremont_recovery');

assert.match(stateReport, /Fremont now exposes public district-owned Child Find Preschool Screenings/i);
assert.match(allStateReport, /Fremont now clears from public district-owned Child Find screening events/i);
assert.match(handoff, /Current Focus State: Idaho/);
assert.match(handoff, /Camas only exposes a district-owned `Contact Information` leaf/i);
assert.match(handoff, /Clark exposes exact district-owned `Contact Us` and `Title IX` leaves/i);
assert.match(handoff, /Fremont now also clears from the public official Apptegy events API/i);
assert.match(handoff, /Shoshone exposes district-office contacts plus federal-program leaves/i);
assert.match(handoff, /1\. New Mexico/);
assert.match(handoff, /2\. Arizona/);
assert.match(handoff, /3\. New Hampshire/);

assert.equal(batchSummary.camas_contact_leaf_live, true);
assert.equal(batchSummary.clark_contact_leaf_live, true);
assert.equal(batchSummary.clark_title_ix_leaf_live, true);
assert.equal(batchSummary.fremont_child_find_events_api_live, true);
assert.equal(batchSummary.residual_districts_with_exact_wrong_role_leaves, 3);
assert.equal(batchSummary.residual_districts_with_special_ed_routing_leaves, 1);
assert.equal(batchSummary.result, 'fremont_recovered_via_official_child_find_events_api_but_camas_clark_and_shoshone_still_materialize_wrong_role_leaves');
assert.match(batchReport, /recovered Fremont local education routing from the official district events API/i);

console.log('test-batch358-idaho-fremont-child-find-recovery-v1: ok');
