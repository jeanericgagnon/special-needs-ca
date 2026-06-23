import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch285AlaskaLegacyDhssSubtreeFinalityV1 } from './run-batch285-alaska-legacy-dhss-subtree-finality-v1.mjs';

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

const result = generateBatch285AlaskaLegacyDhssSubtreeFinalityV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.legacy_dhss_root_live_but_subtree_gated, true);

const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
assert.equal(summary.primary_gap_reason, 'live_dfcs_services_page_only_provides_statewide_phone_relay_while_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked');
assert.equal(summary.final_blockers[0].failure_code, 'live_dfcs_services_page_is_phone_only_while_current_health_host_and_legacy_dhss_dpa_subtree_both_fail_closed');
assert.match(summary.final_blockers[0].evidence, /legacy `dhss\.alaska\.gov` host is only partially public/i);

const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_phone_only_dfcs_relay_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');
assert.match(countyGap.status_reason, /legacy `dhss\.alaska\.gov` root and `robots\.txt` remain publicly readable/i);

const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'live_dfcs_services_page_is_phone_only_while_current_health_host_and_legacy_dhss_dpa_subtree_both_fail_closed');
assert.match(countyFailure.evidence, /\/dpa\/Pages\/office-locations\.aspx/);
assert.match(countyFailure.evidence, /\/dsds\/Pages\/default\.aspx/);

const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_phone_only_dfcs_relay_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Legacy DHSS root'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Legacy DHSS office locations 403'));
assert.match(countyVerified.blocker_evidence, /legacy `dhss\.alaska\.gov` host is only partially public/i);

const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host');

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /legacy DHSS root is only partially live: root and robots are public, but the exact DPA subtree is still 403-blocked/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const alaskaAuditRow = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.equal(alaskaAuditRow.packetPrimaryGapReason, 'live_dfcs_services_page_only_provides_statewide_phone_relay_while_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked');
assert.equal(alaskaAuditRow.familyStatuses.county_local_disability_resources, 'blocked_phone_only_dfcs_relay_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');

const allStateQueue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const alaskaQueueRow = allStateQueue.find((row) => row.state === 'alaska');
assert.equal(alaskaQueueRow.primary_gap_reason, 'live_dfcs_services_page_only_provides_statewide_phone_relay_while_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked');

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /## Current Focus State: Alaska/);
assert.match(handoff, /legacy `dhss\.alaska\.gov` DPA subtree is also not reviewable/i);
assert.match(handoff, /## Next State Order After Alaska[\s\S]*1\. North Carolina/);
assert.doesNotMatch(handoff, /## Next State Order After Alaska[\s\S]*1\. Utah/);

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.match(lessons, /A Partially Live Legacy Root Does Not Reopen A Gated Subtree/);

console.log('test-batch285-alaska-legacy-dhss-subtree-finality-v1: ok');
