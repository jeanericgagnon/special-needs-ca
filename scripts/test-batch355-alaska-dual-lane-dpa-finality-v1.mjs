import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch355AlaskaDualLaneDpaFinalityV1 } from './run-batch355-alaska-dual-lane-dpa-finality-v1.mjs';

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

await generateBatch355AlaskaDualLaneDpaFinalityV1();

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
const batchSummary = readJson('data/generated/batch355_alaska_dual_lane_dpa_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch355-alaska-dual-lane-dpa-finality-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch355_alaska_dual_lane_dpa_finality_v1');
assert.equal(summary.primary_gap_reason, 'reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract');
assert.match(summary.final_blockers[0].evidence, /Reviewed 2026-06-25 exact official Alaska county-local surfaces/i);

assert.equal(gapRows.length, 0);
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'county_local_disability_resources');
assert.match(summary.final_blockers[0].evidence, /browser-reviewed lane/i);
assert.match(summary.final_blockers[0].evidence, /groups offices only by broad regions/i);
assert.match(summary.final_blockers[0].evidence, /still return HTTP 403 with the Cloudflare title "Just a moment\.\.\."/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(failure);
assert.equal(failure.failure_code, 'reviewed_live_dpa_offices_page_proves_regional_offices_but_no_borough_assignment_and_raw_health_fetches_still_403');
assert.match(failure.evidence, /browser-reviewed lane/i);
assert.match(failure.evidence, /still return HTTP 403 with the Cloudflare title "Just a moment\.\.\."/i);
assert.match(failure.evidence, /live public search lane at `https:\/\/dfcs\.alaska\.gov\/pages\/search\.aspx` is real/i);
assert.match(failure.evidence, /still materialize no role-bearing DPA/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified);
assert.equal(verified.blocker_code, failure.failure_code);
assert.match(verified.query_basis, /browser-readable lane/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DPA offices directory' && sample.verification_status === 'reviewed'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DPA raw low-token health-host family' && sample.verification_status === 'blocked'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DFCS public search page' && sample.verification_status === 'reviewed'));

const officesSample = verified.samples.find((sample) => sample.sample_name === 'Alaska DPA offices directory');
assert.match(officesSample.evidence_snippet, /regional offices, office hours, addresses, fax numbers/i);
assert.match(officesSample.evidence_snippet, /does not assign boroughs or census areas/i);

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(next);
assert.equal(next.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_export_or_api');

const alaskaAudit = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.ok(alaskaAudit);
assert.equal(alaskaAudit.packetBatch, 'batch355_alaska_dual_lane_dpa_finality_v1');
assert.equal(alaskaAudit.packetPrimaryGapReason, summary.primary_gap_reason);

const alaskaQueue = allStateQueue.find((row) => row.state === 'alaska');
assert.ok(alaskaQueue);
assert.equal(alaskaQueue.primary_gap_reason, summary.primary_gap_reason);
assert.equal(alaskaQueue.recommended_batch, 'hold_for_new_official_borough_assignment_contract');
assert.equal(alaskaQueue.repair_lane, 'blocked_until_new_official_public_county_contract');

assert.match(stateReport, /The official Department of Health DPA offices page is publicly readable in the reviewed browser lane\./);
assert.match(stateReport, /raw low-token lane still gets Cloudflare `Just a moment\.\.\.` 403 shells/i);
assert.match(stateReport, /live public search page still expose no borough- or census-area DPA office contract/i);
assert.match(allStateReport, /browser-readable again and proves regional offices plus contacts/i);
assert.match(handoff, /## Current Focus State: Alaska/);
assert.match(handoff, /dual-lane rather than challenge-only/i);
assert.match(handoff, /DPA offices page on `health\.alaska\.gov` is publicly readable/i);
assert.match(handoff, /DFCS public search: public assistance/);
assert.match(handoff, /## Next State Order After Alaska/);
assert.match(handoff, /1\. Maine/);
assert.match(handoff, /2\. Idaho/);

assert.equal(batchSummary.reviewed_dpa_offices_status, 200);
assert.equal(batchSummary.raw_dpa_landing_status, 403);
assert.equal(batchSummary.raw_dpa_offices_status, 403);
assert.equal(batchSummary.raw_dpa_dashboard_pdf_status, 403);
assert.equal(batchSummary.raw_medicaid_snapshot_pdf_status, 403);
assert.equal(batchSummary.dfcs_public_search_status, 200);
assert.equal(batchSummary.dfcs_public_search_queries_without_results, 5);
assert.equal(batchSummary.borough_assignment_contract_found, false);
assert.match(batchReport, /live reviewed page plus the still-blocked raw lane/i);

console.log('test-batch355-alaska-dual-lane-dpa-finality-v1: ok');
