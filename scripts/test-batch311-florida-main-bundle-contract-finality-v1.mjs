import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch311FloridaMainBundleContractFinalityV1 } from './run-batch311-florida-main-bundle-contract-finality-v1.mjs';

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

const result = generateBatch311FloridaMainBundleContractFinalityV1();
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
const batchSummary = readJson('data/generated/batch311_florida_main_bundle_contract_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch311-florida-main-bundle-contract-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_shell_and_main_bundle_still_expose_no_anonymous_county_contract');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_partial_storefront_lane_and_recovered_myaccess_bundle_without_anonymous_county_results');
assert.match(gap.status_reason, /main bundle/i);
assert.match(gap.status_reason, /county-result endpoint names or even `county`, `office`, or `zip` tokens/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'official_family_resource_center_still_partial_and_recovered_myaccess_public_bundle_exposes_no_anonymous_county_results');
assert.match(failure.evidence, /static\/js\/main\.d43b0959\.js/);
assert.match(failure.evidence, /no public county-result endpoint names/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(verified.query_basis, /shell-plus-main-bundle contract check/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS main bundle exposes no county-result contract'));
assert.match(
  verified.samples.find((sample) => sample.sample_name === 'Florida MyACCESS main bundle exposes no county-result contract').evidence_snippet,
  /county-result endpoint names and no `county`, `office`, or `zip` tokens/i,
);

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_a_public_myaccess_county_result_contract_exists');

const floridaAudit = allStateAudit.states.find((row) => row.stateId === 'florida');
assert.equal(floridaAudit.packetBatch, 'batch311_florida_main_bundle_contract_finality_v1');
assert.equal(floridaAudit.packetPrimaryGapReason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_shell_and_main_bundle_still_expose_no_anonymous_county_contract');
assert.equal(floridaAudit.familyStatuses.county_local_disability_resources, 'blocked_partial_storefront_lane_and_recovered_myaccess_bundle_without_anonymous_county_results');

const floridaQueue = allStateQueue.find((row) => row.state === 'florida');
assert.equal(floridaQueue.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_shell_and_main_bundle_still_expose_no_anonymous_county_contract');

assert.ok(stateReport.includes('live main bundle still do not expose an anonymous county-result contract'));
assert.ok(allStateReport.includes('live main bundle still exposes no public county-result endpoint names'));
assert.ok(handoff.includes('## Current Focus State: Florida'));
assert.ok(handoff.includes('MyACCESS main bundle](https://myaccess.myflfamilies.com/static/js/main.d43b0959.js)'));
assert.ok(handoff.includes('live main bundle still exposes no public county-result endpoint names'));

assert.equal(batchSummary.public_main_bundle_status, 200);
assert.equal(batchSummary.main_bundle_endpoint_terms_found, false);
assert.ok(batchReport.includes('bounded string sweep across the live main bundle still finds no public county-result endpoint names'));

console.log('test-batch311-florida-main-bundle-contract-finality-v1: ok');
