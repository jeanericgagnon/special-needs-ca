import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch310AlaskaSearchShellRefreshV1 } from './run-batch310-alaska-search-shell-refresh-v1.mjs';

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

const result = generateBatch310AlaskaSearchShellRefreshV1();
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
const batchSummary = readJson('data/generated/batch310_alaska_search_shell_refresh_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch310-alaska-search-shell-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_dfcs_services_page_remains_phone_only_while_dfcs_search_still_self_posts_without_results_and_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_phone_only_dfcs_relay_plus_dfcs_search_shell_without_public_results_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');
assert.match(gap.status_reason, /PageNotFoundError\.aspx/);
assert.match(gap.status_reason, /Cloudflare `Just a moment\.\.\.` 403 shell/);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'live_dfcs_services_page_is_phone_only_and_dfcs_search_still_self_posts_without_public_results_while_current_health_and_legacy_dhss_dpa_subtrees_fail_closed');
assert.match(failure.evidence, /https:\/\/dhss\.alaska\.gov\/Pages\/default\.aspx/);
assert.match(failure.evidence, /PageNotFoundError\.aspx/);
assert.match(failure.evidence, /Cloudflare `Just a moment\.\.\.` shell/);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified.samples.some((sample) => sample.sample_name === 'DFCS Search results endpoint SharePoint 404 shell'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Legacy DHSS root canonical landing'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Legacy DHSS DPA root Cloudflare 403 shell'));
assert.equal(verified.samples.filter((sample) => sample.sample_name === 'DFCS Search shell').length, 1);

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host');
assert.match(next.evidence, /PageNotFoundError\.aspx/);

const alaskaAudit = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.equal(alaskaAudit.packetBatch, 'batch310_alaska_search_shell_refresh_v1');
assert.equal(alaskaAudit.packetPrimaryGapReason, 'live_dfcs_services_page_remains_phone_only_while_dfcs_search_still_self_posts_without_results_and_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked');
assert.equal(alaskaAudit.familyStatuses.county_local_disability_resources, 'blocked_phone_only_dfcs_relay_plus_dfcs_search_shell_without_public_results_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403');

const alaskaQueue = allStateQueue.find((row) => row.state === 'alaska');
assert.equal(alaskaQueue.primary_gap_reason, 'live_dfcs_services_page_remains_phone_only_while_dfcs_search_still_self_posts_without_results_and_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked');

assert.ok(stateReport.includes('SharePoint PageNotFound shells'));
assert.ok(allStateReport.includes('DFCS search result URLs still fall into SharePoint PageNotFound shells'));
assert.ok(handoff.includes('## Current Focus State: Alaska'));
assert.ok(handoff.includes('Legacy DHSS sitemap.xml'));
assert.ok(handoff.includes('## Next State Order After Alaska'));

assert.equal(batchSummary.dfcs_search_status, 200);
assert.equal(batchSummary.dfcs_search_results_status, 404);
assert.equal(batchSummary.dfcs_search_post_status, 200);
assert.equal(batchSummary.legacy_root_status, 200);
assert.equal(batchSummary.legacy_robots_status, 200);
assert.equal(batchSummary.legacy_sitemap_status, 404);
assert.equal(batchSummary.health_robots_status, 403);
assert.ok(batchReport.includes('The public DFCS search page still exposes a real `InputKeywords` field'));

console.log('test-batch310-alaska-search-shell-refresh-v1: ok');
