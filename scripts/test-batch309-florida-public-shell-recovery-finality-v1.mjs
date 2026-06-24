import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch309FloridaPublicShellRecoveryFinalityV1 } from './run-batch309-florida-public-shell-recovery-finality-v1.mjs';

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

const result = generateBatch309FloridaPublicShellRecoveryFinalityV1();
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
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch309_florida_public_shell_recovery_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch309-florida-public-shell-recovery-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_shell_recovers_but_county_results_remain_authenticated_or_shell_only');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_partial_storefront_lane_and_current_myaccess_public_shell_without_anonymous_county_results');
assert.match(gap.status_reason, /officeMapping: \/dataexchangeproxy/);
assert.doesNotMatch(gap.status_reason, /CloudFront/);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'official_family_resource_center_still_partial_and_current_myaccess_public_shell_recovers_but_office_mapping_stays_shell_or_authenticated');
assert.match(failure.evidence, /asset-manifest\.json/);
assert.match(failure.evidence, /HTTP 200 again/);
assert.match(failure.evidence, /401 `\{\"message\":\"Unauthorized\"\}`/);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(verified.query_basis, /public-shell recovery check/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS root recovered public shell'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS appconfig officeMapping contract'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS anonymous county-result endpoints still unauthorized'));
assert.equal(verified.samples.filter((sample) => String(sample.source_url || '').includes('myaccess.myflfamilies.com')).length, 6);
assert.equal(verified.samples.filter((sample) => /CloudFront/i.test(sample.evidence_snippet || '')).length, 0);

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_anonymous_myaccess_office_mapping_results_become_public');
assert.match(next.evidence, /officeMapping/);

const floridaAudit = allStateAudit.states.find((row) => row.stateId === 'florida');
assert.equal(floridaAudit.packetBatch, 'batch309_florida_public_shell_recovery_finality_v1');
assert.equal(floridaAudit.packetPrimaryGapReason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_shell_recovers_but_county_results_remain_authenticated_or_shell_only');
assert.equal(floridaAudit.familyStatuses.county_local_disability_resources, 'blocked_partial_storefront_lane_and_current_myaccess_public_shell_without_anonymous_county_results');

const floridaQueue = allStateQueue.find((row) => row.state === 'florida');
assert.equal(floridaQueue.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_shell_recovers_but_county_results_remain_authenticated_or_shell_only');

assert.ok(stateReport.includes('The MyACCESS public shell has recovered to HTTP 200'));
assert.ok(allStateReport.includes('recovered MyACCESS public shell still routes officeMapping only into shell or authenticated-only county-result paths'));
assert.ok(handoff.includes('## Current Focus State: Florida'));
assert.ok(handoff.includes('MyACCESS root](https://myaccess.myflfamilies.com/)'));
assert.ok(handoff.includes('accountmanagement/getZipCountyDetails'));
assert.ok(handoff.includes('## Next State Order After Florida'));
assert.ok(lessons.includes('### A Recovered Public Shell Still Does Not Reopen A County-Result Lane'));

assert.equal(batchSummary.myaccess_root_status, 200);
assert.equal(batchSummary.public_cpcps_status, 200);
assert.equal(batchSummary.public_appconfig_status, 200);
assert.equal(batchSummary.public_asset_manifest_status, 200);
assert.equal(batchSummary.public_dataexchangeproxy_status, 200);
assert.equal(batchSummary.accountmanagement_county_details_status, 401);
assert.equal(batchSummary.accountmanagement_partner_search_status, 401);
assert.ok(batchReport.includes('The current official MyACCESS public lane is readable again, but it still does not expose anonymous county results.'));

console.log('test-batch309-florida-public-shell-recovery-finality-v1: ok');
