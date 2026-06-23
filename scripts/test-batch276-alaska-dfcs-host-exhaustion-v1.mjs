import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch276AlaskaDfcsHostExhaustionV1 } from './run-batch276-alaska-dfcs-host-exhaustion-v1.mjs';

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

const result = generateBatch276AlaskaDfcsHostExhaustionV1();
const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch276_alaska_dfcs_host_exhaustion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_live_dfcs_phone_relay_plus_exhausted_dfcs_host_and_challenged_health_directory');
assert.match(gap.status_reason, /`robots\.txt` is public/i);
assert.match(gap.status_reason, /`sitemap\.xml` is 404/i);
assert.match(gap.status_reason, /office\/contact aliases/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'live_dfcs_services_page_is_phone_only_and_dfcs_host_has_no_public_search_sitemap_or_office_alias_while_health_host_directory_stays_challenged');
assert.match(failure.evidence, /dfcs\.alaska\.gov\/robots\.txt/);
assert.match(failure.evidence, /dfcs\.alaska\.gov\/sitemap\.xml returns 404/);
assert.match(failure.evidence, /search\/pages\/results\.aspx\?k=public%20assistance/);
assert.match(failure.evidence, /Publications page does not materialize any office list/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_live_dfcs_phone_relay_plus_exhausted_dfcs_host_and_challenged_health_directory');
assert.equal(verified.sample_count, 10);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DFCS robots.txt'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DFCS sitemap.xml'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DFCS Publications'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_replaces_the_phone_only_dfcs_relay_with_a_reviewable_office_locator');

const queue = queueRows.find((row) => row.state === 'alaska');
assert.equal(queue.status, 'BLOCKED');
assert.equal(queue.primary_gap_reason, 'live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged');

assert.equal(batchSummary.dfcs_services_page_live, true);
assert.equal(batchSummary.dfcs_robots_live, true);
assert.equal(batchSummary.dfcs_sitemap_404, true);
assert.equal(batchSummary.dfcs_search_404, true);
assert.equal(batchSummary.dfcs_office_aliases_404, true);
assert.equal(batchSummary.dfcs_publications_has_no_local_mapping_contract, true);
assert.equal(batchSummary.health_host_still_challenged, true);
assert.ok(report.includes('no sitemap, no public search, no office aliases'));
assert.ok(handoff.includes('## Current Focus State: Alaska'));
assert.ok(handoff.includes('Alaska DFCS robots.txt'));
assert.ok(lessons.includes('### A Live Successor Host With Public Robots But No Sitemap, Search, Or Office Aliases Can Be Source-Final'));

console.log('test-batch276-alaska-dfcs-host-exhaustion-v1: ok');
