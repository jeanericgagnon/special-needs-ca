import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch252KansasEducationSampleDedupeV1 } from './run-batch252-kansas-education-sample-dedupe-v1.mjs';

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

const result = generateBatch252KansasEducationSampleDedupeV1();
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const reviewedLeaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const batchSummary = readJson('data/generated/batch252_kansas_education_sample_dedupe_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch252-kansas-education-sample-dedupe-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.sample_count, education.samples.length);
for (const url of [
  'https://www.usd409.net/page/special-education-services/',
  'https://www.usd385.org/departments/special-education',
  'https://www.usd497.org/about-us/departments/student-support-services/special-education-services',
  'https://www.gckschools.com/page/special-education/',
  'https://www.olatheschools.org/academics/special-education',
  'https://www.topekapublicschools.net/departments/special_education',
]) {
  assert.equal(education.samples.filter((sample) => sample.source_url === url).length, 1);
}
assert.equal(batchSummary.reviewedDistrictOwnedLeafCount, packet.current_problem_metrics.reviewedDistrictOwnedLeafCount);
assert.equal(batchSummary.reviewedDistrictOwnedLeafCount, 7);
assert.equal(batchSummary.dedupedLeafSampleCount, reviewedLeaves.length);
assert.equal(batchSummary.verifiedEducationSampleCount, education.samples.length);
assert.match(report, /district_or_county_education_routing: blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade; samples=13/);
assert.match(batchReport, /Removed repeated Atchison, Butler, Douglas, Finney, Johnson, and Shawnee/);

console.log('test-batch252-kansas-education-sample-dedupe-v1: ok');
