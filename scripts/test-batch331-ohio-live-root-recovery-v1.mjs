import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch331OhioLiveRootRecoveryV1 } from './run-batch331-ohio-live-root-recovery-v1.mjs';

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

const result = generateBatch331OhioLiveRootRecoveryV1();
const summary = readJson('data/generated/ohio_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/ohio_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/ohio_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/ohio_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/ohio_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/ohio-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch331_ohio_live_root_recovery_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch331-ohio-live-root-recovery-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.countyRootsLive, true);
assert.equal(result.discoverySurfacesLive, true);
assert.equal(result.advertisedCdjfsLeafCount, 98);
assert.equal(result.advertisedCdjfsCountySlugCount, 88);
assert.equal(result.renderedDirectory404, true);
assert.equal(result.renderedSearch404, true);
assert.equal(result.renderedDirectoryRoot404, true);
assert.equal(result.sampledCountyLeaf404, true);

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch331_ohio_live_root_recovery_v1');
assert.equal(summary.primary_gap_reason, 'live_ohio_jfs_medicaid_and_ohio_gov_roots_plus_robots_and_sitemaps_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404_while_education_inventory_remains_root_only');
assert.equal(summary.final_blockers[0].failure_code, 'live_root_robots_and_sitemap_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_root_and_sitemap_family_with_dead_directory_and_sample_cdjfs_leafs');
assert.match(countyGap.status_reason, /roots plus robots and sitemaps are publicly live again/i);
assert.match(countyGap.status_reason, /sampled `cdjfs-\*` county leaves still render public 404 pages/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'live_root_robots_and_sitemap_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404');
assert.match(countyFailure.evidence, /jfs\.ohio\.gov\/sitemap\.xml/);
assert.match(countyFailure.evidence, /98 `cdjfs-\*` local-agency-directory URLs spanning 88 distinct county slugs/i);
assert.match(countyFailure.evidence, /job-family-services-directory` page renders a public `404 Error Page`/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 8);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'JFS root live again'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Ohio.gov county directory page renders 404'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Sample county leaf Adams renders 404'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'live_root_robots_and_sitemap_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404');
assert.equal(countyNext.next_action, 'hold_blocked_until_live_rendered_ohio_county_directory_or_new_public_county_jfs_successor_leaf_is_verified');

const queueRow = queueRows.find((row) => row.state === 'ohio');
assert.equal(queueRow.primary_gap_reason, 'live_ohio_jfs_medicaid_and_ohio_gov_roots_plus_robots_and_sitemaps_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404_while_education_inventory_remains_root_only');

const auditOhio = allStateAudit.states.find((row) => row.stateId === 'ohio');
assert.equal(auditOhio.packetBatch, 'batch331_ohio_live_root_recovery_v1');
assert.equal(auditOhio.packetPrimaryGapReason, 'live_ohio_jfs_medicaid_and_ohio_gov_roots_plus_robots_and_sitemaps_recover_but_current_directory_search_and_sample_cdjfs_leafs_render_404_while_education_inventory_remains_root_only');
assert.equal(auditOhio.familyStatuses.county_local_disability_resources, 'blocked_live_root_and_sitemap_family_with_dead_directory_and_sample_cdjfs_leafs');

assert.match(stateReport, /official roots, robots, and sitemaps are live again/i);
assert.match(stateReport, /`job-family-services-directory` page, Ohio search results page, JFS `about\/local-agencies-directory` root, and sampled `cdjfs-\*` county leaves all render public 404 pages/i);
assert.match(allStateReport, /roots plus their robots and sitemaps are live again/i);
assert.match(handoff, /## Current Focus State: Ohio/);
assert.match(handoff, /98 `cdjfs-\*` entries across 88 county slugs/i);
assert.match(lessons, /Live Roots And Sitemaps Do Not Clear A Directory Lane When The Rendered Leaves Still 404/);

assert.equal(batchSummary.countyRootsLive, true);
assert.equal(batchSummary.advertisedCdjfsCountySlugCount, 88);
assert.match(batchReport, /corrected the stale Ohio county-local blocker from dead official roots to a live-but-stale directory family/i);

console.log('test-batch331-ohio-live-root-recovery-v1: ok');
