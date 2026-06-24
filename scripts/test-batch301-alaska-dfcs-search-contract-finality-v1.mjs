import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch301AlaskaDfcsSearchContractFinalityV1 } from './run-batch301-alaska-dfcs-search-contract-finality-v1.mjs';

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

const result = generateBatch301AlaskaDfcsSearchContractFinalityV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.dfcs_search_input_field_exposed, true);
assert.equal(result.dfcs_results_endpoint_404, true);
assert.equal(result.dfcs_search_post_self_posts_without_results, true);

const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
assert.equal(summary.primary_gap_reason, 'live_dfcs_services_page_remains_phone_only_while_dfcs_search_exposes_input_field_but_no_public_results_endpoint_and_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked');
assert.equal(summary.final_blockers[0].failure_code, 'live_dfcs_services_page_is_phone_only_and_dfcs_search_has_no_public_results_contract_while_current_health_host_and_legacy_dhss_dpa_subtree_both_fail_closed');
assert.match(summary.final_blockers[0].evidence, /Search\/Pages\/results\.aspx\?k=public%20assistance/);
assert.match(summary.final_blockers[0].evidence, /InputKeywords=public assistance/);

const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_phone_only_dfcs_relay_plus_dfcs_search_without_public_results_contract_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');
assert.match(countyGap.status_reason, /results endpoints.*HTTP 404/i);
assert.match(countyGap.status_reason, /direct POST back to `\/Search\/default\.aspx` with `InputKeywords=public assistance`/i);

const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'live_dfcs_services_page_is_phone_only_and_dfcs_search_has_no_public_results_contract_while_current_health_host_and_legacy_dhss_dpa_subtree_both_fail_closed');
assert.match(countyFailure.evidence, /results\.aspx\?k=medicaid/);
assert.match(countyFailure.evidence, /same generic search shell/i);

const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_phone_only_dfcs_relay_plus_dfcs_search_without_public_results_contract_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DFCS Search results endpoint 404'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DFCS Search POST self-post'));
assert.match(countyVerified.blocker_evidence, /exposed DFCS search form still has no usable public results contract/i);

const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host');

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /public DFCS search shell exposes a real keyword input, but its public results endpoints 404/i);
assert.match(report, /direct keyword POST still self-posts to the same generic shell/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const alaskaAuditRow = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.equal(alaskaAuditRow.packetPrimaryGapReason, 'live_dfcs_services_page_remains_phone_only_while_dfcs_search_exposes_input_field_but_no_public_results_endpoint_and_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked');
assert.equal(alaskaAuditRow.familyStatuses.county_local_disability_resources, 'blocked_phone_only_dfcs_relay_plus_dfcs_search_without_public_results_contract_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');

const allStateQueue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const alaskaQueueRow = allStateQueue.find((row) => row.state === 'alaska');
assert.equal(alaskaQueueRow.primary_gap_reason, 'live_dfcs_services_page_remains_phone_only_while_dfcs_search_exposes_input_field_but_no_public_results_endpoint_and_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked');

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /DFCS search surface exposes a real keyword field but still no usable public results contract/i);
assert.match(handoff, /Alaska DFCS Search results endpoint/);

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /public results endpoint still 404s/i);

const batchSummary = readJson('data/generated/batch301_alaska_dfcs_search_contract_finality_summary_v1.json');
assert.equal(batchSummary.lessons_updated, false);

console.log('test-batch301-alaska-dfcs-search-contract-finality-v1: ok');
