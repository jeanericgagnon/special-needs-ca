import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch119ConnecticutDistrictCompletionV1 } from './run-batch119-connecticut-district-completion-v1.mjs';

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

const result = generateBatch119ConnecticutDistrictCompletionV1();
const summary = readJson('data/generated/connecticut_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/connecticut_gap_matrix_v2.jsonl');
const verifiedRows = readJsonl('data/generated/connecticut_verified_sources_v1.jsonl');
const failureRows = readJsonl('data/generated/connecticut_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/connecticut_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch119_connecticut_district_completion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/connecticut-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.primary_gap_reason, 'none');
assert.deepEqual(summary.final_blockers, []);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'verified_county_grade');
assert.match(eduGap.status_reason, /one district-owned education-routing leaf in each Connecticut county/i);
assert.match(eduGap.status_reason, /Windham Public Schools Pupil Services/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'verified_county_grade');
assert.equal(eduVerified.sample_count, 8);
assert.equal(eduVerified.samples.length, 8);
assert.ok(eduVerified.samples.some((row) => row.source_url === 'https://www.fairfieldschools.org/departments/special-education'));
assert.ok(eduVerified.samples.some((row) => row.source_url === 'https://www.hartfordschools.org/page/special-education/'));
assert.ok(eduVerified.samples.some((row) => row.source_url === 'https://www.torrington.org/departments/departments/student-services/special-education'));
assert.ok(eduVerified.samples.some((row) => row.source_url === 'https://www.middletownschools.org/page/special-education-and-pupil-services/'));
assert.ok(eduVerified.samples.some((row) => row.source_url === 'https://www.nhps.net/page/office-of-special-education-student-services/'));
assert.ok(eduVerified.samples.some((row) => row.source_url === 'https://www.norwichpublicschools.org/departments/student-services-special-education'));
assert.ok(eduVerified.samples.some((row) => row.source_url === 'https://www.vernonpublicschools.org/page/office-of-pupil-services/'));
assert.ok(eduVerified.samples.some((row) => row.source_url === 'https://www.windhamps.org/page/pupil-services/'));

assert.equal(failureRows.length, 0);
assert.equal(nextRows.length, 0);
assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);
assert.ok(report.includes('Connecticut now has county-grade district routing'));
assert.ok(lessons.includes('District-Controlled Sitemap Leaves Can Retire An Authenticated State Directory Blocker'));

console.log('test-batch119-connecticut-district-completion-v1: ok');
