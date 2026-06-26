import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch367NewHampshireRobotsSitemapFinalityV1 } from './run-batch367-new-hampshire-robots-sitemap-finality-v1.mjs';

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

const result = generateBatch367NewHampshireRobotsSitemapFinalityV1();
const summary = readJson('data/generated/new-hampshire_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-hampshire_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-hampshire_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-hampshire_verified_sources_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-hampshire-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch367_new_hampshire_robots_sitemap_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch367-new-hampshire-robots-sitemap-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch367_new_hampshire_robots_sitemap_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_nh_dhhs_education_and_vr_host_families_still_block_content_while_saved_dhhs_replacement_hosts_remain_dns_dead_and_public_robots_do_not_restore_a_reviewable_lane');
assert.equal(summary.recommended_batch, 'hold_for_public_official_nh_host_recovery_or_export');
assert.equal(summary.familyStatuses.medicaid_state_health_coverage, 'blocked_saved_dhhs_successor_unresolvable_and_public_dhhs_root_still_access_denied_with_no_reviewable_content_lane');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_official_dhhs_hosts_still_access_denied_with_no_county_reviewable_content_lane');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_official_education_hosts_and_diagnostic_surfaces_forbidden');

const medicaidGap = gapRows.find((row) => row.family === 'medicaid_state_health_coverage');
assert.match(medicaidGap.status_reason, /robots\.txt/i);
assert.match(medicaidGap.status_reason, /sitemap\.xml/i);
assert.match(medicaidGap.status_reason, /public generic crawler directives with HTTP 200/i);
assert.match(medicaidGap.status_reason, /www\.nh\.gov\/dhhs\/robots\.txt` returns HTTP 404/i);
assert.match(medicaidGap.status_reason, /www\.dhhs\.nh\.gov\/sitemap\.xml` still returns the same short `Access Denied` shell with HTTP 403/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /robots\.txt/i);

const medicaidFailure = failureRows.find((row) => row.family === 'medicaid_state_health_coverage');
assert.match(medicaidFailure.evidence, /https:\/\/www\.dhhs\.nh\.gov\/robots\.txt/);
assert.match(medicaidFailure.evidence, /https:\/\/www\.nh\.gov\/robots\.txt/);
assert.match(medicaidFailure.evidence, /https:\/\/www\.nh\.gov\/dhhs\/robots\.txt/);

const vrFailure = failureRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrFailure.severity, 'critical');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_official_dhhs_hosts_still_access_denied_with_no_county_reviewable_content_lane');
assert.match(countyVerified.blocker_evidence, /robots\.txt/);

const waiverVerified = verifiedRows.find((row) => row.family === 'medicaid_waiver_hcbs_disability_services');
assert.equal(waiverVerified.samples[0].verification_status, 'blocked');
assert.equal(waiverVerified.samples[0].source_type, 'saved_replacement_leaf_unresolvable');
assert.match(waiverVerified.samples[0].evidence_snippet, /DNS-dead/i);

const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddVerified.samples[0].verification_status, 'blocked');
assert.equal(ddVerified.samples[0].source_type, 'saved_replacement_leaf_unresolvable');

const eiVerified = verifiedRows.find((row) => row.family === 'early_intervention_part_c');
assert.equal(eiVerified.samples[0].verification_status, 'blocked');
assert.equal(eiVerified.samples[0].source_type, 'saved_replacement_leaf_unresolvable');

const queueRow = queueRows.find((row) => row.state === 'new-hampshire');
assert.equal(queueRow.primary_gap_reason, 'official_nh_dhhs_education_and_vr_host_families_still_block_content_while_saved_dhhs_replacement_hosts_remain_dns_dead_and_public_robots_do_not_restore_a_reviewable_lane');
assert.equal(queueRow.recommended_batch, 'hold_for_public_official_nh_host_recovery_or_export');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-hampshire');
assert.equal(auditRow.packetBatch, 'batch367_new_hampshire_robots_sitemap_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'official_nh_dhhs_education_and_vr_host_families_still_block_content_while_saved_dhhs_replacement_hosts_remain_dns_dead_and_public_robots_do_not_restore_a_reviewable_lane');

assert.match(stateReport, /www\.dhhs\.nh\.gov\/robots\.txt` and `www\.nh\.gov\/robots\.txt` are generic public robots files/i);
assert.match(stateReport, /www\.nh\.gov\/dhhs\/robots\.txt` is 404/i);
assert.match(stateReport, /VR remains a critical blocker/i);
assert.match(allStateReport, /only diagnostic change is generic public robots files/i);
assert.match(handoff, /robots\.txt/);
assert.match(handoff, /sitemap\.xml/);
assert.match(lessons, /Public Robots Files Do Not Reopen A Blocked Official Host Family/);

assert.equal(batchSummary.dhhs_replacement_dns_dead, true);
assert.equal(batchSummary.dhhs_direct_403_shell, true);
assert.equal(batchSummary.dhhs_robots_public_generic, true);
assert.equal(batchSummary.dhhs_sitemap_403_shell, true);
assert.equal(batchSummary.nh_gov_robots_public_generic, true);
assert.equal(batchSummary.nh_gov_dhhs_robots_404, true);
assert.equal(batchSummary.result, 'official_new_hampshire_host_families_and_diagnostics_still_do_not_expose_public_reviewable_routing_surfaces');
assert.match(batchReport, /generic public robots files/i);

console.log('test-batch367-new-hampshire-robots-sitemap-finality-v1: ok');
