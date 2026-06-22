import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch143IowaDistrictDirectoryCompletionV1 } from './run-batch143-iowa-district-directory-completion-v1.mjs';

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

const result = generateBatch143IowaDistrictDirectoryCompletionV1();
const summary = readJson('data/generated/iowa_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/iowa_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/iowa_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/iowa_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/iowa_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch143_iowa_district_directory_completion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/iowa-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(result.index_safe, true);
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.primary_gap_reason, 'none');
assert.deepEqual(summary.critical_gap_families, []);
assert.equal(summary.final_blockers.length, 0);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'verified_county_grade');
assert.match(eduGap.status_reason, /325 district rows/i);
assert.match(eduGap.status_reason, /all 99 Iowa counties/i);
assert.match(eduGap.status_reason, /County Name, AEA Name, District Name, Administrator Name, Phone, Email, and Website/i);

assert.equal(failures.length, 0);
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'maintenance');
assert.equal(nextRows[0].failure_code, 'complete_maintain_truth_only');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'verified_county_grade');
assert.equal(eduVerified.evidence_strength, 'strong');
assert.equal(eduVerified.blocker_code, null);
assert.equal(eduVerified.sample_count, 3);
assert.match(eduVerified.samples[0].source_url, /media\/11655\/download\?inline$/);
assert.match(eduVerified.samples[1].source_url, /media\/12423\/download\?inline$/);
assert.match(eduVerified.samples[0].evidence_snippet, /325 district rows/i);
assert.match(eduVerified.samples[2].evidence_snippet, /publishes current downloadable district directory files/i);

assert.equal(batchSummary.cleared_family, 'district_or_county_education_routing');
assert.equal(batchSummary.district_rows, 325);
assert.equal(batchSummary.covered_counties, 99);
assert.equal(batchSummary.aeas_named, 9);
assert.equal(batchSummary.blank_website_rows, 0);
assert.equal(batchSummary.blank_email_rows, 0);
assert.equal(batchSummary.blank_phone_rows, 0);

assert.ok(report.includes('Iowa now reaches California-grade and is index-safe.'));
assert.ok(report.includes('county-mapped routing source'));
assert.ok(lessons.includes('### Official District Directory Spreadsheets With County And AEA Columns Can Clear County-Grade Education Routing'));

console.log('test-batch143-iowa-district-directory-completion-v1: ok');
