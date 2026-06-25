import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const allStateQueue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchSummary = readJson('data/generated/batch321_florida_auth_only_endpoint_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch321-florida-auth-only-endpoint-finality-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_partial_storefront_lane_and_recovered_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only');
assert.match(gap.status_reason, /re-exposes the exact county-result endpoint names/i);
assert.match(gap.status_reason, /HTTP 401 \/ HTTP 401 `Unauthorized`/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'official_family_resource_center_still_partial_and_recovered_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only');
assert.match(failure.evidence, /getZipCountyDetails/);
assert.match(failure.evidence, /communityPartnerSearch/);
assert.match(failure.evidence, /HTTP 401 and HTTP 401/);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(verified.query_basis, /Reviewed 2026-06-(24|25)/);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS main bundle re-exposes authenticated county-result endpoints'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_a_public_myaccess_county_result_contract_exists');

const floridaAudit = allStateAudit.states.find((row) => row.stateId === 'florida');
assert.equal(floridaAudit.packetBatch, 'batch321_florida_auth_only_endpoint_finality_v1');
assert.equal(floridaAudit.packetPrimaryGapReason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only');
assert.equal(floridaAudit.familyStatuses.county_local_disability_resources, 'blocked_partial_storefront_lane_and_recovered_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only');

const floridaQueue = allStateQueue.find((row) => row.state === 'florida');
assert.equal(floridaQueue.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only');

assert.ok(stateReport.includes('live main bundle now re-exposes `getZipCountyDetails` and `communityPartnerSearch`'));
assert.ok(allStateReport.includes('live main bundle now re-exposes `getZipCountyDetails` plus `communityPartnerSearch` only as authenticated-only endpoint names'));
assert.ok(handoff.includes('## Current Focus State: Florida'));
assert.ok(handoff.includes('no anonymous county-complete public local-office contract'));
assert.ok(handoff.includes('MyACCESS communityPartnerSearch'));

assert.equal(batchSummary.public_main_bundle_status, 200);
assert.equal(batchSummary.main_bundle_endpoint_terms_found, true);
assert.deepEqual(batchSummary.main_bundle_endpoint_names, ['getZipCountyDetails', 'communityPartnerSearch']);
assert.equal(batchSummary.accountmanagement_county_details_status, 401);
assert.equal(batchSummary.accountmanagement_partner_search_status, 401);
assert.ok(batchReport.includes('bundle now re-exposes the exact county-result endpoint names'));

console.log('test-batch321-florida-auth-only-endpoint-finality-v1: ok');
