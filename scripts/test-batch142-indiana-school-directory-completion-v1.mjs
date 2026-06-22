import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch142IndianaSchoolDirectoryCompletionV1 } from './run-batch142-indiana-school-directory-completion-v1.mjs';

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

const result = generateBatch142IndianaSchoolDirectoryCompletionV1();
const summary = readJson('data/generated/indiana_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/indiana_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/indiana_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/indiana_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/indiana_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch142_indiana_school_directory_completion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/indiana-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(result.index_safe, true);
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.primary_gap_reason, 'none');
assert.equal(summary.final_blockers.length, 0);
assert.deepEqual(summary.critical_gap_families, []);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'verified_county_grade');
assert.match(eduGap.status_reason, /460 corporation rows/i);
assert.match(eduGap.status_reason, /all 92 Indiana counties/i);

assert.equal(failureRows.length, 0);
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'maintenance');
assert.equal(nextRows[0].failure_code, 'complete_maintain_truth_only');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'verified_county_grade');
assert.equal(eduVerified.evidence_strength, 'strong');
assert.equal(eduVerified.blocker_code, null);
assert.equal(eduVerified.sample_count, 3);
assert.match(eduVerified.samples[0].source_url, /2025-2026-school-directory-2026-03-23\.xlsx$/);
assert.match(eduVerified.samples[0].evidence_snippet, /460 corporation rows/i);
assert.match(eduVerified.samples[1].evidence_snippet, /Adams County/i);
assert.match(eduVerified.samples[2].evidence_snippet, /Allen County/i);

assert.equal(batchSummary.cleared_family, 'district_or_county_education_routing');
assert.equal(batchSummary.corp_sheet_rows, 460);
assert.equal(batchSummary.covered_counties, 92);
assert.equal(batchSummary.blank_homepages, 60);
assert.equal(batchSummary.blank_superintendent_email, 2);

assert.ok(report.includes('Indiana now reaches California-grade and is index-safe.'));
assert.ok(report.includes('county-mapped district-routing source'));
assert.ok(lessons.includes('### Official County-Mapped School Directory Spreadsheets Can Clear District Routing Without Special-Ed-Specific Contacts'));

console.log('test-batch142-indiana-school-directory-completion-v1: ok');
