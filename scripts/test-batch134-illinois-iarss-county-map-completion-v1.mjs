import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch134IllinoisIarssCountyMapCompletionV1 } from './run-batch134-illinois-iarss-county-map-completion-v1.mjs';

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

const result = generateBatch134IllinoisIarssCountyMapCompletionV1();
const summary = readJson('data/generated/illinois_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/illinois_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/illinois_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/illinois_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/illinois_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch134_illinois_iarss_county_map_completion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/illinois-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(result.index_safe, true);
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.equal(summary.missing_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'none');
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.final_blockers, []);
assert.equal(summary.complete_ready, true);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'verified_county_grade');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /ISBE ROE page publicly directs families to the IARSS interactive map/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /101 unique Illinois county IDs/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /Cook County remains covered/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /ROE 13/i);

assert.equal(failureRows.length, 0);
assert.equal(nextRows.length, 0);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'verified_county_grade');
assert.equal(eduVerified.sample_count, 4);
assert.equal(eduVerified.samples[0].source_url, 'https://www.isbe.net/roe');
assert.equal(eduVerified.samples[1].source_url, 'https://iarss.org/regional-office-licensure-service/');
assert.equal(eduVerified.samples[2].source_url, 'https://iarss.org/single-location/roe-13/?directory_type=general');
assert.equal(eduVerified.samples[3].source_url, 'https://www.northcook.org');
assert.match(eduVerified.samples[1].evidence_snippet, /101 unique Illinois county IDs|Kane County ROE/i);
assert.match(eduVerified.samples[2].evidence_snippet, /618-244-8040/);

assert.equal(batchSummary.iarss_region_rows, 35);
assert.equal(batchSummary.iarss_unique_county_ids, 101);
assert.equal(batchSummary.cook_county_isc_rows, 3);
assert.equal(batchSummary.replacement_directory_leaf, 'https://iarss.org/single-location/roe-13/?directory_type=general');

assert.ok(report.includes('Illinois is now COMPLETE and index-safe'));
assert.ok(lessons.includes('### Official State-Board Pages Can Adopt Linked County Maps When The County IDs Are Embedded Publicly'));

console.log('test-batch134-illinois-iarss-county-map-completion-v1: ok');
