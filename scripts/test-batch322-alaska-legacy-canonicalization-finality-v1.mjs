import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
const batchSummary = readJson('data/generated/batch322_alaska_legacy_canonicalization_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch322-alaska-legacy-canonicalization-finality-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_dfcs_services_publications_search_and_site_map_still_expose_no_dpa_or_borough_mapping_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_phone_only_dfcs_relay_plus_dfcs_site_map_with_wrong_role_ocs_office_leaf_plus_search_without_public_results_plus_legacy_dpa_canonicalization_into_health_host_challenge');
assert.match(gap.status_reason, /Site-Map|Site Map/i);
assert.match(gap.status_reason, /OCS Regional Offices/i);
assert.match(gap.status_reason, /canonicalize into the same challenged `https:\/\/health\.alaska\.gov\/dpa` host/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'dfcs_services_publications_search_and_site_map_still_expose_no_local_dpa_contract_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host');
assert.match(failure.evidence, /Site-Map|Site Map/);
assert.match(failure.evidence, /OCS Regional Offices/);
assert.match(failure.evidence, /canonically land on `https:\/\/health\.alaska\.gov\/dpa`/);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(verified.query_basis, /Site-Map|Site Map/);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DFCS Site Map'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Legacy DHSS DPA root canonicalized to health host'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host');

const alaskaAudit = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.equal(alaskaAudit.packetBatch, 'batch322_alaska_legacy_canonicalization_finality_v1');
assert.equal(alaskaAudit.packetPrimaryGapReason, 'live_dfcs_services_publications_search_and_site_map_still_expose_no_dpa_or_borough_mapping_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host');
assert.equal(alaskaAudit.familyStatuses.county_local_disability_resources, 'blocked_phone_only_dfcs_relay_plus_dfcs_site_map_with_wrong_role_ocs_office_leaf_plus_search_without_public_results_plus_legacy_dpa_canonicalization_into_health_host_challenge');

const alaskaQueue = allStateQueue.find((row) => row.state === 'alaska');
assert.equal(alaskaQueue.primary_gap_reason, 'live_dfcs_services_publications_search_and_site_map_still_expose_no_dpa_or_borough_mapping_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host');

assert.ok(stateReport.includes('legacy DHSS DPA paths now canonicalize into the same challenged `health.alaska.gov/dpa` host'));
assert.ok(stateReport.includes('wrong-service `OCS Regional Offices` leaf'));
assert.ok(allStateReport.includes('legacy `dhss.alaska.gov/dpa/...` paths now canonicalize into that same challenged `health.alaska.gov/dpa` host'));
assert.ok(allStateReport.includes('wrong-service `OCS Regional Offices` leaf'));
assert.ok(handoff.includes('## Current Focus State: Alaska'));
assert.ok(handoff.includes('Legacy DHSS DPA root'));
assert.ok(handoff.includes('Legacy DHSS office locations'));
assert.ok(handoff.includes('wrong-service `OCS Regional Offices` leaf'));
assert.ok(lessons.includes('### Legacy Subtrees That Canonicalize Into The Same Challenge Shell Do Not Create A Second Lane'));

assert.equal(batchSummary.dfcs_site_map_status, 200);
assert.equal(batchSummary.dfcs_site_map_interesting_leaf_count, 1);
assert.deepEqual(batchSummary.dfcs_site_map_interesting_leafs, ['/ocs/Pages/offices/default.aspx']);
assert.equal(batchSummary.legacy_dpa_root_final_url, 'https://health.alaska.gov/dpa');
assert.equal(batchSummary.legacy_dpa_offices_final_url, 'https://health.alaska.gov/dpa');
assert.equal(batchSummary.legacy_dpa_contacts_final_url, 'https://health.alaska.gov/dpa');
assert.equal(batchSummary.legacy_dpa_publications_final_url, 'https://health.alaska.gov/dpa');
assert.ok(batchReport.includes('canonically land on `https://health.alaska.gov/dpa`'));

console.log('test-batch322-alaska-legacy-canonicalization-finality-v1: ok');
