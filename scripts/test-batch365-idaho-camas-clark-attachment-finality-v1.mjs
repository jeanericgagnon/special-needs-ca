import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch365IdahoCamasClarkAttachmentFinalityV1 } from './run-batch365-idaho-camas-clark-attachment-finality-v1.mjs';

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

const result = generateBatch365IdahoCamasClarkAttachmentFinalityV1();
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
const batchSummary = readJson('data/generated/batch365_idaho_camas_clark_attachment_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch365-idaho-camas-clark-attachment-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch365_idaho_camas_clark_attachment_finality_v1');
assert.equal(summary.completeness_pct, 87);
assert.equal(summary.primary_gap_reason, 'remaining_idaho_camas_and_clark_surfaces_now_reduce_to_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_without_special_education_or_student_services_routing');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_remaining_camas_and_clark_surfaces_only_materialize_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_after_shoshone_recovery');

const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtGap.family_status, 'blocked_remaining_camas_and_clark_surfaces_only_materialize_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_after_shoshone_recovery');
assert.match(districtGap.status_reason, /linked Google Doc that resolves to a board-of-trustees roster/i);
assert.match(districtGap.status_reason, /parent-notification page links district-hosted PDFs/i);
assert.match(districtGap.status_reason, /Parent Resources page also links district-hosted `Idaho Child Find` PDFs/i);
assert.match(districtGap.status_reason, /image-only flyer artifacts/i);

const districtFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtFailure.failure_code, 'remaining_camas_and_clark_surfaces_materialize_contact_board_roster_title_ix_or_general_education_notice_leaves_but_zero_role_bearing_special_education_or_student_services_routing');
assert.match(districtFailure.evidence, /board-of-trustees roster/i);
assert.match(districtFailure.evidence, /district-hosted PDF attachments linked from those Clark pages/i);
assert.match(districtFailure.evidence, /district-hosted `Idaho Child Find` flyers/i);
assert.match(districtFailure.evidence, /image-only PDF artifacts titled `Child Find Flyer 2025-2026 English`/i);

const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Camas linked Google Doc board roster'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Clark district-hosted parent-notification PDF attachments'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Clark Parent Resources leaf'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Clark district-hosted Child Find flyers'));
assert.ok(districtVerified.samples.some((row) => row.sample_name === 'Idaho School Districts page' && row.verification_status === 'verified'));

const districtNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtNext.next_action, 'continue_exact_district_leaf_expansion_only_when_camas_or_clark_publish_role_bearing_special_education_special_services_student_services_504_child_find_or_procedural_safeguards_leaves_with_local_contact');

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyFailure.evidence, /Reviewed 2026-06-25 one more bounded live Idaho DHW confirmation/i);
assert.match(countyFailure.evidence, /still exposes no truthful county-to-office contract/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyVerified.blocker_evidence, /Reviewed 2026-06-25 one more bounded live Idaho DHW confirmation/i);
assert.equal(countyVerified.samples.find((row) => row.sample_name === 'Idaho DHW office root').fetched_at, '2026-06-25T00:00:00.000Z');
assert.equal(countyVerified.samples.find((row) => row.sample_name === 'Idaho DHW Caldwell Office').fetched_at, '2026-06-25T00:00:00.000Z');

const queueRow = queueRows.find((row) => row.state === 'idaho');
assert.equal(queueRow.primary_gap_reason, 'remaining_idaho_camas_and_clark_surfaces_now_reduce_to_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_without_special_education_or_student_services_routing');
assert.equal(queueRow.completeness_pct, 87);

const auditRow = allStateAudit.states.find((row) => row.stateId === 'idaho');
assert.equal(auditRow.packetBatch, 'batch365_idaho_camas_clark_attachment_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'remaining_idaho_camas_and_clark_surfaces_now_reduce_to_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_without_special_education_or_student_services_routing');
assert.equal(auditRow.completenessPct, 87);
assert.equal(auditRow.familyStatuses.district_or_county_education_routing, 'blocked_remaining_camas_and_clark_surfaces_only_materialize_wrong_role_contact_board_roster_title_ix_or_general_education_notice_leaves_after_shoshone_recovery');

assert.match(stateReport, /Camas and Clark wrong-role contact, board-roster, Title IX, general-education-notice, and image-only Child Find flyer lanes/i);
assert.match(allStateReport, /image-only Child Find flyers without local special-education routing proof/i);
assert.match(handoff, /Current Focus State: Idaho/);
assert.match(handoff, /one linked document on that page exports as a board-of-trustees roster/i);
assert.match(handoff, /Parent Resources page links official `Idaho Child Find` PDFs that still do not preserve extractable local Clark routing or contact evidence/i);
assert.match(handoff, /1\. New Mexico/);
assert.match(handoff, /2\. Arizona/);
assert.match(handoff, /3\. New Hampshire/);
assert.match(lessons, /District-Linked Attachments Still Fail If They Resolve To Board Rosters Or General-Education Notices/);
assert.match(lessons, /District-Hosted Child Find Flyers Still Need Local Routing Evidence/);

assert.equal(batchSummary.camas_contact_leaf_live, true);
assert.equal(batchSummary.camas_google_doc_live, true);
assert.equal(batchSummary.camas_google_doc_is_board_roster, true);
assert.equal(batchSummary.clark_parent_notification_pdf_live, true);
assert.equal(batchSummary.clark_parent_notification_pdf_is_general_education_notice_lane, true);
assert.equal(batchSummary.clark_parent_resources_leaf_live, true);
assert.equal(batchSummary.clark_child_find_flyers_live, true);
assert.equal(batchSummary.clark_child_find_flyers_image_only_or_no_local_contact, true);
assert.equal(batchSummary.remaining_wrong_role_districts, 2);
assert.equal(batchSummary.result, 'camas_and_clark_attachments_and_child_find_flyers_reviewed_but_still_insufficient_for_local_special_education_routing');
assert.match(batchReport, /attachments and Child Find flyers are still insufficient local-routing artifacts/i);

console.log('test-batch365-idaho-camas-clark-attachment-finality-v1: ok');
