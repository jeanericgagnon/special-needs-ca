import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch284FloridaDataexchangeproxyFinalityV1 } from './run-batch284-florida-dataexchangeproxy-finality-v1.mjs';

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

const result = generateBatch284FloridaDataexchangeproxyFinalityV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(result.public_dataexchangeproxy_replays_shell, true);

const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
assert.equal(summary.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_public_shell_only_exposes_dataexchangeproxy_shell');
assert.equal(summary.final_blockers[0].failure_code, 'official_family_resource_center_still_partial_and_myaccess_office_mapping_now_resolves_only_to_public_shell_contract');
assert.ok(summary.final_blockers[0].evidence.includes("officeMapping: '/dataexchangeproxy'"));

const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_partial_storefront_lane_and_public_dataexchangeproxy_shell_without_county_results');
assert.match(countyGap.status_reason, /CreateCBOAccountService/);
assert.match(countyGap.status_reason, /dataexchangeproxy/);

const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_family_resource_center_still_partial_and_myaccess_office_mapping_now_resolves_only_to_public_shell_contract');
assert.match(countyFailure.evidence, /Public\/CPCPS.*dataexchangeproxy/s);
assert.match(countyFailure.evidence, /34 distinct county values across 39 rows/);

const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_partial_storefront_lane_and_public_dataexchangeproxy_shell_without_county_results');
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS dataexchangeproxy shell'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS partner-location bundle static check'));
assert.match(countyVerified.blocker_evidence, /older `getZipCountyDetails` and `communityPartnerSearch` names are no longer exposed/i);

const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_anonymous_dataexchangeproxy_results_exist');
assert.match(countyNext.evidence, /dataexchangeproxy/);

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /officeMapping` at `\/dataexchangeproxy`/i);
assert.match(report, /bare dataexchangeproxy routes all replay the same shell/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /## Current Focus State: Florida/);
assert.match(handoff, /MyACCESS dataexchangeproxy shell/);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const floridaAuditRow = allStateAudit.states.find((row) => row.stateId === 'florida');
assert.equal(floridaAuditRow.packetPrimaryGapReason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_public_shell_only_exposes_dataexchangeproxy_shell');
assert.equal(floridaAuditRow.familyStatuses.county_local_disability_resources, 'blocked_partial_storefront_lane_and_public_dataexchangeproxy_shell_without_county_results');

const allStateQueue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const floridaQueueRow = allStateQueue.find((row) => row.state === 'florida');
assert.equal(floridaQueueRow.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_public_shell_only_exposes_dataexchangeproxy_shell');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /Florida county-local routing is now explicitly sharpened to the partial Family Resource Center contract plus the public MyACCESS dataexchangeproxy shell lane/i);

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.match(lessons, /When Public App Config Rewires To A Shell Endpoint, Treat The Shell As The Real Contract/);

console.log('test-batch284-florida-dataexchangeproxy-finality-v1: ok');
