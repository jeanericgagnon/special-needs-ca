import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch365NewHampshireHostFamilyFinalityV1 } from './run-batch365-new-hampshire-host-family-finality-v1.mjs';

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

const result = generateBatch365NewHampshireHostFamilyFinalityV1();
const summary = readJson('data/generated/new-hampshire_california_grade_summary_v2.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-hampshire-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchSummary = readJson('data/generated/batch365_new_hampshire_host_family_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch365-new-hampshire-host-family-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch365_new_hampshire_host_family_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead');
assert.equal(summary.recommended_batch, 'hold_for_public_official_nh_host_recovery_or_export');
assert.equal(summary.familyStatuses.medicaid_state_health_coverage, 'blocked_saved_dhhs_successor_unresolvable_and_nh_gov_successors_forbidden');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_official_education_hosts_and_nh_gov_successors_forbidden');
assert.equal(summary.familyStatuses.vocational_rehabilitation_pre_ets, 'blocked_vr_hosts_unresolvable_or_forbidden_with_no_nh_gov_successor');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_official_dhhs_hosts_and_nh_gov_successors_forbidden');

const queueRow = queueRows.find((row) => row.state === 'new-hampshire');
assert.equal(queueRow.primary_gap_reason, 'official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead');
assert.equal(queueRow.recommended_batch, 'hold_for_public_official_nh_host_recovery_or_export');
assert.equal(queueRow.repair_lane, 'blocked_until_live_public_official_host_family_or_export_recovers');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-hampshire');
assert.equal(auditRow.classification, 'BLOCKED');
assert.equal(auditRow.indexSafe, false);
assert.equal(auditRow.packetBatch, 'batch365_new_hampshire_host_family_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'official_nh_dhhs_education_and_vr_host_families_still_return_access_denied_shell_and_saved_dhhs_replacement_hosts_remain_dns_dead');
assert.equal(auditRow.packetRecommendedBatch, 'hold_for_public_official_nh_host_recovery_or_export');

assert.match(stateReport, /The saved `dhhs\.new-hampshire\.gov` successor family is still DNS-dead/i);
assert.match(stateReport, /The direct DHHS, education, and NHES subdomain families plus the obvious `nh\.gov` path successors still return the same short `Access Denied` shell with HTTP 403 immediately/i);
assert.match(allStateReport, /New Hampshire remains blocked after a direct host-family recheck/i);

assert.match(handoff, /Current Focus State: New Hampshire/);
assert.match(handoff, /highest-priority New Hampshire blocker/i);
assert.match(handoff, /https:\/\/www\.dhhs\.nh\.gov\//i);
assert.match(handoff, /https:\/\/www\.nh\.gov\/education\//i);
assert.match(handoff, /Next State Order After New Hampshire/);
assert.match(handoff, /None remaining in assigned sequence/);
assert.doesNotMatch(handoff, /Current Focus State: Arizona/);

assert.equal(batchSummary.dhhs_replacement_dns_dead, true);
assert.equal(batchSummary.dhhs_direct_403_shell, true);
assert.equal(batchSummary.education_direct_403_shell, true);
assert.equal(batchSummary.vr_direct_403_shell, true);
assert.equal(batchSummary.nh_gov_successor_403_shell, true);
assert.equal(batchSummary.result, 'official_new_hampshire_host_families_still_do_not_expose_public_reviewable_routing_surfaces');
assert.match(batchReport, /host-family finality refresh/i);

console.log('test-batch365-new-hampshire-host-family-finality-v1: ok');
