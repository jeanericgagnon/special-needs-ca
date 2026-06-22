import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch101GeorgiaDdBlockerTruthRefreshV1 } from './run-batch101-georgia-dd-blocker-truth-refresh-v1.mjs';

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

const result = generateBatch101GeorgiaDdBlockerTruthRefreshV1();
const summary = readJson('data/generated/georgia_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/georgia_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/georgia_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/georgia_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/georgia_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch101_georgia_dd_blocker_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/georgia-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.primary_gap_reason, 'official_region_pages_access_denied_and_county_lookup_not_county_mapped');

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddGap.family_status, 'blocked_official_access_denied_region_pages');
assert.ok(ddGap.status_reason.includes('all six official DBHDD region field-office pages return access-denied shells'));

const ddFailure = failures.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddFailure.failure_code, 'official_region_pages_access_denied_and_county_lookup_not_county_mapped');
assert.equal(ddFailure.next_action, 'hold_blocked_until_reviewed_county_to_region_source_replaces_access_denied_region_pages');

const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddVerified.family_status, 'blocked_official_access_denied_region_pages');
assert.equal(ddVerified.sample_count, 7);
assert.equal(ddVerified.samples[0].source_url, 'https://dbhdd.georgia.gov/regional-field-office-county');
assert.equal(ddVerified.samples[1].verification_status, 'blocked');
assert.ok(ddVerified.samples[1].evidence_snippet.includes('Access denied'));

const ddNext = nextRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddNext.failure_code, 'official_region_pages_access_denied_and_county_lookup_not_county_mapped');

assert.equal(batchSummary.blocker_code, 'official_region_pages_access_denied_and_county_lookup_not_county_mapped');
assert.equal(batchSummary.access_denied_region_pages, 6);
assert.equal(batchSummary.county_lookup_page_live, true);

assert.ok(report.includes('all six reviewed official DBHDD region field-office pages resolve to access-denied shells'));
assert.ok(report.includes('repeated region links rather than county names'));

console.log('test-batch101-georgia-dd-blocker-truth-refresh-v1: ok');
