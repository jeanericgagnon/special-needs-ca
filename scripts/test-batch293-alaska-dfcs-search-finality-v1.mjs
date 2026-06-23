import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch293AlaskaDfcsSearchFinalityV1 } from './run-batch293-alaska-dfcs-search-finality-v1.mjs';

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

const result = generateBatch293AlaskaDfcsSearchFinalityV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.dfcs_search_public_but_generic, true);

const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
assert.equal(summary.primary_gap_reason, 'live_dfcs_services_page_and_public_dfcs_search_still_expose_no_borough_routing_while_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked');
assert.equal(summary.final_blockers[0].failure_code, 'live_dfcs_services_page_is_phone_only_and_public_dfcs_search_is_generic_while_current_health_host_and_legacy_dhss_dpa_subtree_both_fail_closed');
assert.match(summary.final_blockers[0].evidence, /Search\/default\.aspx/);
assert.match(summary.final_blockers[0].evidence, /no public `k` or `terms` query field/i);

const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_phone_only_dfcs_relay_plus_generic_dfcs_search_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');
assert.match(countyGap.status_reason, /DFCS host itself still adds no public borough- or census-area office contract/i);

const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'live_dfcs_services_page_is_phone_only_and_public_dfcs_search_is_generic_while_current_health_host_and_legacy_dhss_dpa_subtree_both_fail_closed');
assert.match(countyFailure.evidence, /query=public\+assistance/);
assert.match(countyFailure.evidence, /same generic SharePoint search shell/i);

const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_phone_only_dfcs_relay_plus_generic_dfcs_search_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DFCS Search shell'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DFCS Search query replay'));
assert.match(countyVerified.blocker_evidence, /DFCS public search surface/i);

const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host');

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /public DFCS search shell is readable, but bounded query replays still expose no reviewable DPA office results/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const alaskaAuditRow = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.equal(alaskaAuditRow.packetPrimaryGapReason, 'live_dfcs_services_page_and_public_dfcs_search_still_expose_no_borough_routing_while_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked');
assert.equal(alaskaAuditRow.familyStatuses.county_local_disability_resources, 'blocked_phone_only_dfcs_relay_plus_generic_dfcs_search_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');

const allStateQueue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const alaskaQueueRow = allStateQueue.find((row) => row.state === 'alaska');
assert.equal(alaskaQueueRow.primary_gap_reason, 'live_dfcs_services_page_and_public_dfcs_search_still_expose_no_borough_routing_while_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked');

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /## Current Focus State: Alaska/);
assert.match(handoff, /public DFCS search surface is readable but exposes no DPA office results contract/i);
assert.match(handoff, /## Next State Order After Alaska[\s\S]*1\. New York/);

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /public DFCS search shell with no result contract/i);

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.match(lessons, /A Public SharePoint Search Shell Is Not A Directory Contract/);

console.log('test-batch293-alaska-dfcs-search-finality-v1: ok');
