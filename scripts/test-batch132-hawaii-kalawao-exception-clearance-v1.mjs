import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch132HawaiiKalawaoExceptionClearanceV1 } from './run-batch132-hawaii-kalawao-exception-clearance-v1.mjs';

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

const result = generateBatch132HawaiiKalawaoExceptionClearanceV1();
const summary = readJson('data/generated/hawaii_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/hawaii_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/hawaii_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/hawaii_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/hawaii_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch132_hawaii_kalawao_exception_clearance_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/hawaii-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified_with_kalawao_official_exception_path');
assert.deepEqual(summary.final_blockers, []);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_state_grade');
assert.match(countyGap.status_reason, /HRS 326 places Kalawao County under the jurisdiction and control of DOH/i);
assert.match(countyGap.status_reason, /Maui County provides assistance to Kalaupapa under a mutual aid agreement with DOH/i);

assert.equal(failures.length, 0);
assert.equal(nextRows.length, 0);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_state_grade');
assert.equal(countyVerified.blocker_code, null);
assert.equal(countyVerified.sample_count, 3);
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://health.hawaii.gov/kalaupapaupdates/'));
assert.ok(countyVerified.samples.some((sample) => /jurisdiction and control of DOH/i.test(sample.evidence_snippet)));

assert.equal(batchSummary.local_pdf_counties, 4);
assert.deepEqual(batchSummary.official_exception_counties, ['kalawao-hi']);
assert.equal(batchSummary.exception_source_url, 'https://health.hawaii.gov/kalaupapaupdates/');

assert.ok(report.includes('Hawaii is now COMPLETE and index-safe.'));
assert.ok(lessons.includes('### Official State-Administered County Exceptions Can Replace Impossible Local Storefront Proof'));

console.log('test-batch132-hawaii-kalawao-exception-clearance-v1: ok');
