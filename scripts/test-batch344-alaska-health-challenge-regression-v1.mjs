import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch344AlaskaHealthChallengeRegressionV1 } from './run-batch344-alaska-health-challenge-regression-v1.mjs';

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

generateBatch344AlaskaHealthChallengeRegressionV1();

const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const allStateQueue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch344_alaska_health_challenge_regression_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch344-alaska-health-challenge-regression-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch344_alaska_health_challenge_regression_v1');
assert.equal(summary.primary_gap_reason, 'health_alaska_dpa_service_family_now_returns_cloudflare_challenge_shells_while_dfcs_successor_surfaces_still_add_no_borough_or_census_area_assignment_contract');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_health_alaska_dpa_challenge_shells_and_dfcs_successor_surfaces_still_no_borough_or_census_area_assignment_contract');
assert.match(gap.status_reason, /raw fetches .* now return HTTP 403/i);
assert.match(gap.status_reason, /Just a moment/i);
assert.match(gap.status_reason, /DFCS successor surfaces remain negative/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(failure);
assert.equal(failure.failure_code, 'health_alaska_dpa_service_family_cloudflare_challenge_and_dfcs_successor_surfaces_still_no_county_equivalent_mapping_contract');
assert.match(failure.evidence, /health\.alaska\.gov\/dpa.*return HTTP 403/i);
assert.match(failure.evidence, /Performing security verification/i);
assert.match(failure.evidence, /Pages\/Services\.aspx/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified);
assert.equal(verified.blocker_code, failure.failure_code);
assert.match(verified.query_basis, /health host now returns raw 403s plus browser `Just a moment\.\.\.` challenge shells/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DPA offices directory challenge shell' && sample.verification_status === 'blocked'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Adult Public Assistance successor page challenge shell' && sample.verification_status === 'blocked'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DPA dashboard PDF challenge regression' && sample.verification_status === 'blocked'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(next);
assert.equal(next.next_action, 'hold_blocked_until_alaska_publishes_reviewable_public_borough_or_census_area_to_dpa_office_assignment_or_the_health_dpa_family_reopens_without_challenge_shells');

const alaskaAudit = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.ok(alaskaAudit);
assert.equal(alaskaAudit.packetBatch, 'batch344_alaska_health_challenge_regression_v1');
assert.equal(alaskaAudit.packetPrimaryGapReason, summary.primary_gap_reason);
assert.equal(alaskaAudit.familyStatuses.county_local_disability_resources, gap.family_status);

const alaskaQueue = allStateQueue.find((row) => row.state === 'alaska');
assert.ok(alaskaQueue);
assert.equal(alaskaQueue.primary_gap_reason, summary.primary_gap_reason);

assert.match(stateReport, /health\.alaska\.gov DPA family is no longer reliably browser-readable/i);
assert.match(stateReport, /raw HTTP 403/i);
assert.match(allStateReport, /Alaska county-local routing is still blocked, and the live contract regressed again/i);
assert.match(handoff, /## Current Focus State: Alaska/);
assert.match(handoff, /Cloudflare `Just a moment\.\.\.` shells/i);
assert.match(handoff, /Adult Public Assistance page/i);
assert.match(lessons, /### Challenge Regression Beats Stale Browser-Readable Assumptions/);

assert.equal(batchSummary.dpa_landing_raw_status, 403);
assert.equal(batchSummary.dpa_offices_raw_status, 403);
assert.equal(batchSummary.adult_public_assistance_raw_status, 403);
assert.equal(batchSummary.apply_for_medicaid_raw_status, 403);
assert.equal(batchSummary.dpa_dashboard_raw_status, 403);
assert.equal(batchSummary.medicaid_snapshot_raw_status, 403);
assert.equal(batchSummary.dfcs_services_raw_status, 200);
assert.equal(batchSummary.dpa_offices_browser_title, 'Just a moment...');
assert.equal(batchSummary.adult_public_assistance_browser_title, 'Just a moment...');
assert.match(batchReport, /no longer holds the older browser-readable contract/i);

console.log('test-batch344-alaska-health-challenge-regression-v1: ok');
