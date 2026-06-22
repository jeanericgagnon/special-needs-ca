import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch56GeorgiaDdBrowserAssistedRefreshV1 } from './run-batch56-georgia-dd-browser-assisted-refresh-v1.mjs';

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

const summary = generateBatch56GeorgiaDdBrowserAssistedRefreshV1();
const stateSummary = readJson('data/generated/georgia_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/georgia_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/georgia_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/georgia_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/georgia_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/georgia-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(stateSummary.classification, 'BLOCKED');
assert.equal(stateSummary.index_safe, false);
assert.equal(stateSummary.completeness_pct, 83);
assert.equal(stateSummary.primary_gap_reason, 'browser_visible_official_region_pages_not_rehydrated_from_static_403_shells');

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddGap.family_status, 'blocked_browser_assisted_region_rehydration_required');
assert.ok(ddGap.status_reason.includes('Region 2, 3, and 6'));

const ddFailure = failureRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddFailure.failure_code, 'browser_visible_official_region_pages_not_rehydrated_from_static_403_shells');
assert.equal(ddFailure.next_action, 'rerun_dbhdd_region_pages_through_browser_assisted_county_extraction_for_all_six_regions');

const ddNext = nextRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddNext.failure_code, 'browser_visible_official_region_pages_not_rehydrated_from_static_403_shells');

const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddVerified.family_status, 'blocked_browser_assisted_region_rehydration_required');
assert.equal(ddVerified.sample_count, 4);
assert.equal(ddVerified.samples[1].source_url, 'https://dbhdd.georgia.gov/region-2-field-office');
assert.equal(ddVerified.samples[2].source_url, 'https://dbhdd.georgia.gov/region-3-field-office');
assert.equal(ddVerified.samples[3].source_url, 'https://dbhdd.georgia.gov/region-6-field-office');

assert.ok(report.includes('Region 2, 3, and 6'));
assert.ok(report.includes('browser-assisted six-region rehydration'));
assert.ok(lessons.includes('### Browser-Visible Official Pages Can Falsely Look Like Static 403s'));

console.log('test-batch56-georgia-dd-browser-assisted-refresh-v1: ok');
