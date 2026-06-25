import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch354IdahoOneidaChildFindRecoveryV1 } from './run-batch354-idaho-oneida-child-find-recovery-v1.mjs';

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

const result = generateBatch354IdahoOneidaChildFindRecoveryV1();
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
const batchSummary = readJson('data/generated/batch354_idaho_oneida_child_find_recovery_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch354-idaho-oneida-child-find-recovery-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch354_idaho_oneida_child_find_recovery_v1');
assert.equal(summary.primary_gap_reason, 'remaining_idaho_district_roots_now_reduce_to_live_homepage_and_sitemap_surfaces_without_role_bearing_leaves_after_jefferson_and_oneida_recovery');
assert.equal(summary.completeness_pct, 85);
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_remaining_live_district_roots_without_role_bearing_leaves_after_jefferson_and_oneida_recovery');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_remaining_live_district_roots_without_role_bearing_leaves_after_jefferson_and_oneida_recovery');
assert.match(educationGap.status_reason, /Oneida now also clears from a district-owned Child Find PDF/i);
assert.match(educationGap.status_reason, /Jill Daniels - Special Education Director/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'remaining_live_idaho_district_roots_expose_zero_role_bearing_special_education_or_student_services_links_after_jefferson_and_oneida_recovery');
assert.match(educationFailure.evidence, /5il\.co\/26a73/i);
assert.match(educationFailure.evidence, /Jill Daniels - Special Education Director/i);
assert.match(educationFailure.evidence, /Camas and Clark both stayed live/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.sample_count, 22);
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Oneida Child Find PDF' && row.verification_status === 'verified'));
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Oneida district root' && row.verification_status === 'verified'));
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Jefferson special education page' && row.verification_status === 'verified'));

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'continue_exact_district_leaf_expansion_only_when_camas_clark_fremont_or_shoshone_publish_role_bearing_special_education_or_special_services_links');

const queueRow = queueRows.find((row) => row.state === 'idaho');
assert.equal(queueRow.primary_gap_reason, 'remaining_idaho_district_roots_now_reduce_to_live_homepage_and_sitemap_surfaces_without_role_bearing_leaves_after_jefferson_and_oneida_recovery');
assert.equal(queueRow.completeness_pct, 85);

const auditRow = allStateAudit.states.find((row) => row.stateId === 'idaho');
assert.equal(auditRow.packetBatch, 'batch354_idaho_oneida_child_find_recovery_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'remaining_idaho_district_roots_now_reduce_to_live_homepage_and_sitemap_surfaces_without_role_bearing_leaves_after_jefferson_and_oneida_recovery');
assert.equal(auditRow.completenessPct, 85);
assert.equal(auditRow.familyStatuses.district_or_county_education_routing, 'blocked_remaining_live_district_roots_without_role_bearing_leaves_after_jefferson_and_oneida_recovery');

assert.match(stateReport, /Oneida now clears from a district-owned Child Find PDF with direct Special Education Director contact evidence/i);
assert.match(allStateReport, /Oneida now clears from a district-owned Child Find PDF with Special Education Director contact evidence/i);
assert.match(handoff, /Current Focus State: Idaho/);
assert.match(handoff, /Oneida Child Find PDF/);
assert.match(handoff, /Camas, Clark, Fremont, and Shoshone/);
assert.match(lessons, /District-Owned Child Find PDFs Can Clear Local Education Routing When They Carry Real Contacts/);

assert.equal(batchSummary.recovered_role_bearing_district_hosts, 2);
assert.equal(batchSummary.remaining_live_homepage_roots_without_role_bearing_links, 4);
assert.equal(batchSummary.recovered_pdf_backed_district_hosts, 1);
assert.equal(batchSummary.reviewed_exact_leaf_count_after_recovery, 16);
assert.equal(batchSummary.result, 'oneida_child_find_pdf_recovered_remaining_live_district_root_packet_still_incomplete');
assert.match(batchReport, /recovered Oneida district-owned education routing from the official Child Find PDF/i);

console.log('test-batch354-idaho-oneida-child-find-recovery-v1: ok');
