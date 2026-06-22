import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch108DelawareDistrictCompletionV1 } from './run-batch108-delaware-district-completion-v1.mjs';

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

const result = generateBatch108DelawareDistrictCompletionV1();
const summary = readJson('data/generated/delaware_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/delaware_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/delaware_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/delaware_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/delaware_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch108_delaware_district_completion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/delaware-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(result.index_safe, true);
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.final_blockers, []);
assert.equal(summary.complete_ready, true);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'verified_county_grade');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /Capital School District/);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /Brandywine School District/);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /Indian River School District/);
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'verified_county_grade');

assert.equal(failureRows.length, 0);
assert.equal(nextRows.length, 0);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'verified_county_grade');
assert.equal(eduVerified.sample_count, 3);
assert.equal(eduVerified.samples[0].source_url, 'https://www.capital.k12.de.us/programs_and_services/special_education');
assert.equal(eduVerified.samples[1].source_url, 'https://www.brandywineschools.org/learning/supporting-our-unique-learners/special-education');
assert.equal(eduVerified.samples[2].source_url, 'https://www.irsd.net/departments/special-services');
assert.match(eduVerified.samples[2].evidence_snippet, /staff contact emails and phone numbers/);

assert.equal(batchSummary.classification, 'COMPLETE');
assert.ok(report.includes('Delaware is therefore COMPLETE and index-safe'));

console.log('test-batch108-delaware-district-completion-v1: ok');
