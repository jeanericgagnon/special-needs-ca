import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch142AlaskaDaphNarrowLocalLeafRefreshV1 } from './run-batch142-alaska-daph-narrow-local-leaf-refresh-v1.mjs';

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

const result = generateBatch142AlaskaDaphNarrowLocalLeafRefreshV1();
const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch142_alaska_daph_narrow_local_leaf_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'dfcs_site_map_exposes_only_pioneer_home_local_leaves_while_public_assistance_office_routing_stays_blocked');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_assistance_local_directory_missing_despite_other_dfcs_local_leaves');
assert.match(countyGap.status_reason, /only for the narrow Alaska Pioneer Homes program/i);
assert.match(countyGap.status_reason, /site search does not return a usable local-office result contract/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'dfcs_site_map_exposes_only_pioneer_home_local_leaves_while_public_assistance_office_routing_stays_blocked');
assert.match(countyFailure.evidence, /site-map, publications, search, and Alaska Pioneer Homes location leaves/i);
assert.match(countyFailure.evidence, /six named Alaska Pioneer Home location leaves/i);
assert.match(countyFailure.evidence, /not Public Assistance, Medicaid, Senior and Disabilities, or county office-routing resources/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.blocker_code, 'dfcs_site_map_exposes_only_pioneer_home_local_leaves_while_public_assistance_office_routing_stays_blocked');
assert.equal(countyVerified.sample_count, 9);
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://dfcs.alaska.gov/Pages/Site-Map.aspx'));
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://dfcs.alaska.gov/daph/Pages/map.aspx'));
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_narrow_program_local_leaves'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'dfcs_site_map_exposes_only_pioneer_home_local_leaves_while_public_assistance_office_routing_stays_blocked');
assert.match(countyNext.next_action, /publishes_a_reviewable_public_assistance_or_disability_office_directory_on_dfcs/i);

assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.dfcs_site_map_exposes_local_leaves, true);
assert.equal(batchSummary.public_assistance_directory_recovered, false);
assert.ok(report.includes('the only reviewed local family it exposes is Alaska Pioneer Homes'));
assert.ok(lessons.includes('Narrow Program Local Leaves Do Not Repair A Broader County-Office Family'));

console.log('test-batch142-alaska-daph-narrow-local-leaf-refresh-v1: ok');
