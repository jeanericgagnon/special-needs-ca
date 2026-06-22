import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch103CaliforniaCountyLocalDirectoryRefreshV1 } from './run-batch103-california-county-local-directory-refresh-v1.mjs';

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

const result = generateBatch103CaliforniaCountyLocalDirectoryRefreshV1();
const summary = readJson('data/generated/california_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/california_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/california_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/california_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/california_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch103_california_county_local_directory_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/california-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.missing_critical_families, 1);
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing']);
assert.equal(summary.final_blockers.length, 2);
assert.ok(!summary.final_blockers.some((row) => row.family === 'county_local_disability_resources'));

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_state_grade');
assert.match(countyGap.status_reason, /58 county-labeled IHSS routing links/i);

const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(districtGap.status_reason, /Radware bot challenge/i);

assert.ok(!failureRows.some((row) => row.family === 'county_local_disability_resources'));
const districtFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(districtFailure.evidence, /Radware bot challenge/i);

assert.ok(!nextRows.some((row) => row.family === 'county_local_disability_resources'));

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_state_grade');
assert.equal(countyVerified.sample_count, 1);
assert.equal(countyVerified.samples[0].source_url, 'https://www.cdss.ca.gov/inforesources/county-ihss-offices');
assert.equal(countyVerified.samples[0].source_type, 'official_fetched_directory');
assert.equal(countyVerified.blocker_code, null);

assert.equal(batchSummary.repaired_family, 'county_local_disability_resources');
assert.ok(report.includes('58 county-labeled county-routing links'));
assert.ok(lessons.includes('Official County Directories Can Count When They Enumerate Every County'));

console.log('test-batch103-california-county-local-directory-refresh-v1: ok');
