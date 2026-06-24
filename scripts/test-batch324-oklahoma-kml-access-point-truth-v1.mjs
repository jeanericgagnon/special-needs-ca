import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch324OklahomaKmlAccessPointTruthV1 } from './run-batch324-oklahoma-kml-access-point-truth-v1.mjs';

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

const result = generateBatch324OklahomaKmlAccessPointTruthV1();
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
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch324_oklahoma_kml_access_point_truth_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch324-oklahoma-kml-access-point-truth-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.liveSuccessorOfficeMapVerified, true);
assert.equal(result.officeMapPlacemarkCount, 60);
assert.equal(result.explicitCountyFieldCount, 43);
assert.equal(result.benefitCapableCountyCoverageCount, 45);
assert.equal(result.excludedServiceLimitedAccessPointCount, 3);
assert.equal(result.remainingCountyGapCount, 32);
assert.equal(result.childSupportCountyTreeVerified, true);
assert.equal(result.ddsStatewideOnlyVerified, true);

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_county_tree_cannot_close_the_remaining_32');
assert.equal(summary.batch, 'batch324_oklahoma_kml_access_point_truth_v1');
assert.equal(summary.final_blockers[0].failure_code, 'live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_tree_do_not_close_remaining_32');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_okdhs_kml_partial_county_contract_with_service_limited_access_points');
assert.match(countyGap.status_reason, /only yields 45 benefit-capable county-local contracts/);
assert.match(countyGap.status_reason, /Grady .* Pittsburg .* Washington/);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_tree_do_not_close_remaining_32');
assert.match(countyFailure.evidence, /45 counties now qualify/);
assert.match(countyFailure.evidence, /remaining 32 counties/);
assert.match(countyFailure.evidence, /Grady, Pittsburg, and Washington/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 6);
assert.equal(countyVerified.blocker_code, 'live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_tree_do_not_close_remaining_32');
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Benefit-capable access point example'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Service-limited access point exclusion'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_live_oklahoma_human_services_county_export_or_county_owned_local_office_leaves_cover_the_remaining_32_counties');

const queueRow = queueRows.find((row) => row.state === 'oklahoma');
assert.equal(queueRow.primary_gap_reason, 'live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_county_tree_cannot_close_the_remaining_32');

const auditOklahoma = allStateAudit.states.find((row) => row.stateId === 'oklahoma');
assert.equal(auditOklahoma.packetBatch, 'batch324_oklahoma_kml_access_point_truth_v1');
assert.equal(auditOklahoma.packetPrimaryGapReason, 'live_okdhs_kml_only_yields_45_benefit_capable_counties_while_tanf_only_access_points_and_child_support_only_county_tree_cannot_close_the_remaining_32');
assert.equal(auditOklahoma.familyStatuses.county_local_disability_resources, 'blocked_okdhs_kml_partial_county_contract_with_service_limited_access_points');

assert.match(stateReport, /TANF-limited access points for Grady, Pittsburg, and Washington do not satisfy/);
assert.match(stateReport, /32-county remainder/);
assert.match(allStateReport, /live OKDHS KML only yields 45 benefit-capable counties/);
assert.match(handoff, /only yields 45 benefit-capable counties/);
assert.match(handoff, /32-county remainder/);
assert.match(handoff, /Adair, Alfalfa, Beaver/);
assert.match(lessons, /### Service-Limited Access Points Do Not Close A County-Local Routing Gap/);

assert.equal(batchSummary.remainingCountyGapCount, 32);
assert.equal(batchSummary.benefitCapableCountyCoverageCount, 45);
assert.deepEqual(batchSummary.remainingCountyGap.slice(0, 3), ['Adair', 'Alfalfa', 'Beaver']);
assert.match(batchReport, /role-aware 45-county contract and a 32-county explicit remainder/);

console.log('test-batch324-oklahoma-kml-access-point-truth-v1: ok');
