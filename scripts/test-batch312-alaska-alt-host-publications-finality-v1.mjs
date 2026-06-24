import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch312AlaskaAltHostPublicationsFinalityV1 } from './run-batch312-alaska-alt-host-publications-finality-v1.mjs';

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

const result = generateBatch312AlaskaAltHostPublicationsFinalityV1();
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
const batchSummary = readJson('data/generated/batch312_alaska_alt_host_publications_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch312-alaska-alt-host-publications-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_dfcs_services_and_publications_surfaces_still_expose_no_dpa_or_borough_mapping_while_dfcs_search_self_posts_without_results_and_alt_health_legacy_hosts_fail_closed');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_phone_only_dfcs_relay_plus_publications_without_dpa_terms_plus_dfcs_search_shell_without_public_results_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');
assert.match(gap.status_reason, /Publications\.aspx/);
assert.match(gap.status_reason, /my\.alaska\.gov\/robots\.txt/);
assert.match(gap.status_reason, /alaska\.gov\/search/);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'dfcs_services_and_publications_still_expose_no_local_dpa_contract_while_dfcs_search_alt_hosts_and_health_legacy_dpa_lanes_fail_closed');
assert.match(failure.evidence, /Pages\/Publications\.aspx/);
assert.match(failure.evidence, /my\.alaska\.gov\/robots\.txt/);
assert.match(failure.evidence, /alaska\.gov\/search\?query=Division\+of\+Public\+Assistance\+offices/);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DFCS Publications no DPA office material'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'my.alaska.gov robots 403'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'alaska.gov state search 404'));
assert.match(
  verified.samples.find((sample) => sample.sample_name === 'Alaska DFCS Publications no DPA office material').evidence_snippet,
  /no `public assistance`, `medicaid`.*no DPA or office-routing document links/i,
);

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host');

const alaskaAudit = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.equal(alaskaAudit.packetBatch, 'batch312_alaska_alt_host_publications_finality_v1');
assert.equal(alaskaAudit.packetPrimaryGapReason, 'live_dfcs_services_and_publications_surfaces_still_expose_no_dpa_or_borough_mapping_while_dfcs_search_self_posts_without_results_and_alt_health_legacy_hosts_fail_closed');
assert.equal(alaskaAudit.familyStatuses.county_local_disability_resources, 'blocked_phone_only_dfcs_relay_plus_publications_without_dpa_terms_plus_dfcs_search_shell_without_public_results_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');

const alaskaQueue = allStateQueue.find((row) => row.state === 'alaska');
assert.equal(alaskaQueue.primary_gap_reason, 'live_dfcs_services_and_publications_surfaces_still_expose_no_dpa_or_borough_mapping_while_dfcs_search_self_posts_without_results_and_alt_health_legacy_hosts_fail_closed');

assert.ok(stateReport.includes('DFCS Publications page still exposes no DPA/public-assistance office-routing material'));
assert.ok(allStateReport.includes('DFCS Publications still exposes no DPA/public-assistance office material'));
assert.ok(handoff.includes('## Current Focus State: Alaska'));
assert.ok(handoff.includes('my.alaska.gov robots.txt'));
assert.ok(handoff.includes('alaska.gov search'));

assert.equal(batchSummary.dfcs_publications_status, 200);
assert.equal(batchSummary.dfcs_publications_dpa_terms_found, false);
assert.equal(batchSummary.my_alaska_robots_status, 403);
assert.equal(batchSummary.alaska_gov_search_status, 404);
assert.ok(batchReport.includes('The live DFCS Publications page still exposes no `public assistance`, `medicaid`, `adult public assistance`, `locations`, `borough`, or `census` terms'));

console.log('test-batch312-alaska-alt-host-publications-finality-v1: ok');
