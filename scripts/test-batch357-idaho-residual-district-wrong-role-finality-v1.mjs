import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch357IdahoResidualDistrictWrongRoleFinalityV1 } from './run-batch357-idaho-residual-district-wrong-role-finality-v1.mjs';

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

const result = generateBatch357IdahoResidualDistrictWrongRoleFinalityV1();
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
const batchSummary = readJson('data/generated/batch357_idaho_residual_district_wrong_role_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch357-idaho-residual-district-wrong-role-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch357_idaho_residual_district_wrong_role_finality_v1');
assert.equal(summary.primary_gap_reason, 'remaining_idaho_district_roots_now_reduce_to_wrong_role_contact_or_title_ix_leaves_without_special_education_or_student_services_routing');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_remaining_live_district_roots_only_materialize_wrong_role_contact_or_title_ix_leaves_after_jefferson_and_oneida_recovery');

const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtGap.family_status, 'blocked_remaining_live_district_roots_only_materialize_wrong_role_contact_or_title_ix_leaves_after_jefferson_and_oneida_recovery');
assert.match(districtGap.status_reason, /Clark now clearly materializes exact district-owned `Contact Us` and `Title IX` leaves/i);
assert.match(districtGap.status_reason, /Fremont now clearly materializes exact district-owned `Contact Us` and `Title IX-Sexual Harassment` leaves/i);
assert.match(districtGap.status_reason, /wrong role for special-education routing/i);

const districtFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtFailure.failure_code, 'remaining_live_idaho_district_roots_materialize_contact_or_title_ix_leaves_but_zero_role_bearing_special_education_or_student_services_routing');
assert.match(districtFailure.evidence, /about-us\/contact-us-ccsd/i);
assert.match(districtFailure.evidence, /administration\/title-ix/i);
assert.match(districtFailure.evidence, /page\/contact-us/i);
assert.match(districtFailure.evidence, /o\/sd215\/page\/title-ix/i);
assert.match(districtFailure.evidence, /wrong role for local special-education routing/i);

const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Camas Contact Information leaf'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Clark Contact Us leaf'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Clark Title IX leaf'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Fremont Contact Us leaf'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Fremont Title IX leaf'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Shoshone district-office and federal-program menu'));

const districtNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtNext.next_action, 'continue_exact_district_leaf_expansion_only_when_camas_clark_fremont_or_shoshone_publish_role_bearing_special_education_special_services_student_services_504_or_procedural_safeguards_leaves');

const queueRow = queueRows.find((row) => row.state === 'idaho');
assert.equal(queueRow.primary_gap_reason, 'remaining_idaho_district_roots_now_reduce_to_wrong_role_contact_or_title_ix_leaves_without_special_education_or_student_services_routing');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'idaho');
assert.equal(auditRow.packetBatch, 'batch357_idaho_residual_district_wrong_role_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'remaining_idaho_district_roots_now_reduce_to_wrong_role_contact_or_title_ix_leaves_without_special_education_or_student_services_routing');
assert.equal(auditRow.familyStatuses.district_or_county_education_routing, 'blocked_remaining_live_district_roots_only_materialize_wrong_role_contact_or_title_ix_leaves_after_jefferson_and_oneida_recovery');

assert.match(stateReport, /residual live districts are now narrowed to exact wrong-role leaves rather than generic unknown roots/i);
assert.match(allStateReport, /exact district-owned `Contact Us` or `Title IX` leaves, but still no special-education/i);
assert.match(handoff, /Current Focus State: Idaho/);
assert.match(handoff, /Camas only exposes a district-owned `Contact Information` leaf/i);
assert.match(handoff, /Clark exposes exact district-owned `Contact Us` and `Title IX` leaves/i);
assert.match(handoff, /Fremont exposes exact district-owned `Contact Us` and `Title IX-Sexual Harassment` leaves/i);
assert.match(handoff, /Shoshone exposes district-office contacts plus federal-program leaves/i);
assert.match(handoff, /1\. Arizona/);

assert.equal(batchSummary.camas_contact_leaf_live, true);
assert.equal(batchSummary.clark_contact_leaf_live, true);
assert.equal(batchSummary.clark_title_ix_leaf_live, true);
assert.equal(batchSummary.fremont_contact_leaf_live, true);
assert.equal(batchSummary.fremont_title_ix_leaf_live, true);
assert.equal(batchSummary.residual_districts_with_exact_wrong_role_leaves, 4);
assert.equal(batchSummary.residual_districts_with_special_ed_routing_leaves, 0);
assert.equal(batchSummary.result, 'residual_live_districts_materialize_wrong_role_contact_or_title_ix_leaves_without_special_ed_routing');
assert.match(batchReport, /tightened the residual Idaho education blocker/i);

console.log('test-batch357-idaho-residual-district-wrong-role-finality-v1: ok');
