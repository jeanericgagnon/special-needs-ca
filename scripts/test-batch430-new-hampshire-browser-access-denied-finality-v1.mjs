import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch430NewHampshireBrowserAccessDeniedFinalityV1 } from './run-batch430-new-hampshire-browser-access-denied-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

const result = generateBatch430NewHampshireBrowserAccessDeniedFinalityV1();
const summary = readJson('data/generated/new-hampshire_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-hampshire_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-hampshire_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-hampshire_verified_sources_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateCertification = readJson('data/generated/state-certification/new-hampshire.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-hampshire-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch430_new_hampshire_browser_access_denied_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch430-new-hampshire-browser-access-denied-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch430_new_hampshire_browser_access_denied_finality_v1');
assert.equal(summary.primary_gap_reason, 'bounded_2026_06_30_browser_and_raw_host_recheck_confirms_nh_dhhs_doe_and_nhes_roots_all_return_public_access_denied_shells_with_no_browser_recovery_lane');
assert.equal(summary.familyStatuses.medicaid_state_health_coverage, 'blocked_live_dhhs_hosts_still_access_denied_in_browser_and_raw_with_no_reviewable_public_content_lane');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_live_education_hosts_still_access_denied_in_browser_and_raw_with_no_reviewable_public_routing_lane');
assert.equal(summary.familyStatuses.vocational_rehabilitation_pre_ets, 'blocked_live_nhes_hosts_still_access_denied_in_browser_and_raw_with_no_reviewable_public_vr_lane');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_live_dhhs_hosts_still_access_denied_in_browser_and_raw_with_no_county_reviewable_content_lane');

const medicaidGap = gapRows.find((row) => row.family === 'medicaid_state_health_coverage');
assert.match(medicaidGap.status_reason, /browser context/i);
assert.match(medicaidGap.status_reason, /https:\/\/www\.dhhs\.nh\.gov\//i);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationGap.status_reason, /my\.doe\.nh\.gov\/ehb/i);
assert.match(educationGap.status_reason, /browser review/i);

const vrGap = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.match(vrGap.status_reason, /browser context/i);
assert.match(vrGap.status_reason, /https:\/\/www\.nhes\.nh\.gov\//i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyFailure.evidence, /browser context/i);
assert.match(countyFailure.evidence, /Access Denied/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyVerified.blocker_evidence, /browser context/i);

const queueRow = queueRows.find((row) => row.state === 'new-hampshire');
assert.equal(queueRow.primary_gap_reason, 'bounded_2026_06_30_browser_and_raw_host_recheck_confirms_nh_dhhs_doe_and_nhes_roots_all_return_public_access_denied_shells_with_no_browser_recovery_lane');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.index_safe, false);

const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-hampshire');
assert.equal(auditRow.packetBatch, 'batch430_new_hampshire_browser_access_denied_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'bounded_2026_06_30_browser_and_raw_host_recheck_confirms_nh_dhhs_doe_and_nhes_roots_all_return_public_access_denied_shells_with_no_browser_recovery_lane');
assert.equal(auditRow.indexSafe, false);

assert.equal(stateCertification.summary.batch, 'batch430_new_hampshire_browser_access_denied_finality_v1');
assert.match(stateReport, /browser-and-raw parity/i);
assert.match(allStateReport, /browser context/i);
assert.match(handoff, /browser context/i);
assert.match(lessons, /Browser-Context 403 Parity Confirms A Host-Family Blocker/);

assert.equal(batchSummary.raw_and_browser_parity, true);
assert.equal(batchSummary.browser_access_denied_count, 10);
assert.equal(batchSummary.counts_unchanged.complete, 44);
assert.equal(batchSummary.counts_unchanged.blocked, 6);
assert.match(batchReport, /browser-and-raw parity blockers/i);

console.log('test-batch430-new-hampshire-browser-access-denied-finality-v1: ok');
