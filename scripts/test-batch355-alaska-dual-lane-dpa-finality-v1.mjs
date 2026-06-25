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
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const batchSummary = readJson('data/generated/batch355_alaska_dual_lane_dpa_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch355-alaska-dual-lane-dpa-finality-report-v1.md'), 'utf8');
const evidenceArtifact = readJson('data/generated/alaska_county_local_routing_evidence_v1.json');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch355_alaska_dual_lane_dpa_finality_v1');
assert.equal(summary.primary_gap_reason, 'reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_live_dpa_offices_page_region_only_with_raw_403_regression_and_dfcs_without_county_equivalent_contract');
assert.match(gap.status_reason, /browser lane/i);
assert.match(gap.status_reason, /still only groups offices by broad regions/i);
assert.match(gap.status_reason, /still return HTTP 403 Cloudflare shells/i);

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

assert.match(stateReport, /The official Department of Health DPA offices page is publicly readable in the reviewed browser lane\./);
assert.match(stateReport, /raw low-token lane still gets Cloudflare `Just a moment\.\.\.` 403 shells/i);
assert.match(stateReport, /live public search page still expose no borough- or census-area DPA office contract/i);
assert.equal(evidenceArtifact.state, 'alaska');
assert.match(evidenceArtifact.county_local.reviewed_sources[0].evidence_excerpt, /does not assign boroughs or census areas/i);
assert.match(evidenceArtifact.county_local.reviewed_sources[1].evidence_excerpt, /HTTP 403/i);
assert.match(evidenceArtifact.county_local.reviewed_sources[2].evidence_excerpt, /888-804-6330/i);
assert.match(evidenceArtifact.county_local.reviewed_sources[3].evidence_excerpt, /public search page is live/i);
assert.match(evidenceArtifact.county_local.blocker_summary, /borough- or census-area-to-office assignment contract/i);

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
