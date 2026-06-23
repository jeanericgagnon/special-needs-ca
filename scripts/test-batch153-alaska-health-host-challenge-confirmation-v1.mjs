import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch153AlaskaHealthHostChallengeConfirmationV1 } from './run-batch153-alaska-health-host-challenge-confirmation-v1.mjs';

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

const result = generateBatch153AlaskaHealthHostChallengeConfirmationV1();
const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch153_alaska_health_host_challenge_confirmation_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'browser_reviewed_dpa_directory_lacks_borough_mapping_and_all_health_host_discovery_surfaces_are_challenge_blocked');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_dpa_directory_incomplete_and_health_host_challenge_locked');
assert.match(countyGap.status_reason, /five regional headings and ten office-city leaves/i);
assert.match(countyGap.status_reason, /sitemap and search surfaces/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'browser_reviewed_dpa_directory_lacks_borough_mapping_and_all_health_host_discovery_surfaces_are_challenge_blocked');
assert.match(countyFailure.evidence, /health\.alaska\.gov\/sitemap\.xml/i);
assert.match(countyFailure.evidence, /Bethel Census Area/i);
assert.match(countyFailure.evidence, /Cloudflare challenge shell/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.blocker_code, 'browser_reviewed_dpa_directory_lacks_borough_mapping_and_all_health_host_discovery_surfaces_are_challenge_blocked');
assert.equal(countyVerified.sample_count, 14);
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://health.alaska.gov/sitemap.xml'));
assert.ok(countyVerified.samples.some((sample) => sample.source_url.includes('Bethel%20Census%20Area')));
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_search_challenge_shell'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'browser_reviewed_dpa_directory_lacks_borough_mapping_and_all_health_host_discovery_surfaces_are_challenge_blocked');
assert.match(countyNext.next_action, /borough_or_census_area_to_dpa_office_mapping/i);

assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.exact_page_challenge_confirmed, true);
assert.equal(batchSummary.sitemap_challenge_confirmed, true);
assert.equal(batchSummary.borough_search_challenge_confirmed, true);
assert.ok(report.includes('the same host challenge-blocks the page itself, sitemap discovery, and official-site search probes'));
assert.ok(lessons.includes('When The Same Official Host Challenge-Blocks The Page, Sitemap, And Search, Stop Low-Token County Retries'));

console.log('test-batch153-alaska-health-host-challenge-confirmation-v1: ok');
