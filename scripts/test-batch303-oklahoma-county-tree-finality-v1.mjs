import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch303OklahomaCountyTreeFinalityV1 } from './run-batch303-oklahoma-county-tree-finality-v1.mjs';

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

const result = generateBatch303OklahomaCountyTreeFinalityV1();
const summary = readJson('data/generated/oklahoma_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/oklahoma_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/oklahoma_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/oklahoma_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/oklahoma_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/oklahoma-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchSummary = readJson('data/generated/batch303_oklahoma_county_tree_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch303-oklahoma-county-tree-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.liveSuccessorOfficeMapVerified, true);
assert.equal(result.officeMapCountyCoverageCount, 46);
assert.equal(result.remainingCountyGapCount, 31);
assert.equal(result.childSupportCountyTreeVerified, true);
assert.equal(result.ddsStatewideOnlyVerified, true);

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_okdhs_general_office_map_only_materializes_46_counties_while_same_host_child_support_tree_proves_county_contracts_exist_but_not_for_disability_local_routing');
assert.equal(summary.final_blockers[0].failure_code, 'live_okdhs_general_office_map_stops_at_46_counties_while_only_child_support_publishes_full_county_tree');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_office_map_incomplete_county_contract');
assert.match(countyGap.status_reason, /same host only exposes a full county tree for child-support-specific offices/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'live_okdhs_general_office_map_stops_at_46_counties_while_only_child_support_publishes_full_county_tree');
assert.match(countyFailure.evidence, /By County/);
assert.match(countyFailure.evidence, /Child Support District Offices/);
assert.match(countyFailure.evidence, /DDS apply page.*statewide intake route/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 5);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Oklahoma child-support county tree'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Oklahoma DDS Apply for Services page'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_live_oklahoma_human_services_county_export_or_county_owned_local_office_leaves_cover_the_remaining_31_counties');

const queueRow = queueRows.find((row) => row.state === 'oklahoma');
assert.equal(queueRow.primary_gap_reason, 'live_okdhs_general_office_map_only_materializes_46_counties_while_same_host_child_support_tree_proves_county_contracts_exist_but_not_for_disability_local_routing');

const auditOklahoma = allStateAudit.states.find((row) => row.stateId === 'oklahoma');
assert.equal(auditOklahoma.packetBatch, 'batch_303_oklahoma_county_tree_finality_v1');
assert.equal(auditOklahoma.packetPrimaryGapReason, 'live_okdhs_general_office_map_only_materializes_46_counties_while_same_host_child_support_tree_proves_county_contracts_exist_but_not_for_disability_local_routing');

assert.match(stateReport, /same `oklahoma\.gov\/okdhs` host proves that county trees are technically publishable/i);
assert.match(stateReport, /only full county tree on the same host is child-support-specific/i);
assert.match(allStateReport, /same live OKDHS host proves it can publish county trees for Child Support/i);

assert.match(handoff, /Current Focus State: Oklahoma/);
assert.match(handoff, /child-support-services\/officelocations\.html/);
assert.match(handoff, /same host clearly can publish county trees for service-specific programs/i);
assert.match(handoff, /1\. Oregon/);

assert.equal(batchSummary.childSupportCountyTreeVerified, true);
assert.equal(batchSummary.ddsStatewideOnlyVerified, true);
assert.match(batchReport, /same-host contrast between county-capable child-support pages and still-incomplete general office routing/i);

console.log('test-batch303-oklahoma-county-tree-finality-v1: ok');
