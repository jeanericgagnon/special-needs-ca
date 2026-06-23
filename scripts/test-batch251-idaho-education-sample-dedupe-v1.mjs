import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch251IdahoEducationSampleDedupeV1 } from './run-batch251-idaho-education-sample-dedupe-v1.mjs';

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

const result = generateBatch251IdahoEducationSampleDedupeV1();
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const packet = readJson('data/generated/idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const batchSummary = readJson('data/generated/batch251_idaho_education_sample_dedupe_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch251-idaho-education-sample-dedupe-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.sample_count, education.samples.length);
const blaineMatches = education.samples.filter((sample) => sample.source_url === 'https://www.blaineschools.org/fs/pages/2147');
assert.equal(blaineMatches.length, 1);
assert.equal(batchSummary.reviewedExactLeafCount, packet.current_problem_metrics.reviewedExactLeafCount);
assert.equal(batchSummary.reviewedExactLeafCount, 11);
assert.equal(batchSummary.verifiedEducationSampleCount, education.samples.length);
assert.match(report, /district_or_county_education_routing: blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade; samples=13/);
assert.match(batchReport, /Removed duplicate Blaine County education samples/);

console.log('test-batch251-idaho-education-sample-dedupe-v1: ok');
