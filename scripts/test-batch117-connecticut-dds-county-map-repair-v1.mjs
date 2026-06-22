import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch117ConnecticutDdsCountyMapRepairV1 } from './run-batch117-connecticut-dds-county-map-repair-v1.mjs';

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

const result = generateBatch117ConnecticutDdsCountyMapRepairV1();
const summary = readJson('data/generated/connecticut_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/connecticut_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/connecticut_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/connecticut_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/connecticut_next_action_queue_v2.jsonl');
const countyMap = readJsonl('data/generated/connecticut_dds_region_county_map_v1.jsonl');
const batchSummary = readJson('data/generated/batch117_connecticut_dds_county_map_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/connecticut-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'public_edsight_shell_does_not_yield_anonymous_district_records');
assert.equal(summary.completeness_pct, 91);
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing']);
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'district_or_county_education_routing');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'verified_state_grade');
assert.match(byFamily.get('county_local_disability_resources').status_reason, /live official first-party pages/i);
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_public_edsight_shell_plus_sas_logon_query');

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'district_or_county_education_routing');
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'district_or_county_education_routing');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_state_grade');
assert.equal(countyVerified.sample_count, 9);
assert.equal(countyVerified.samples.length, 9);
assert.ok(countyVerified.samples.some((sample) => sample.final_url.includes('north-region-general-contact-information')));
assert.ok(countyVerified.samples.some((sample) => sample.final_url.includes('south-region-general-contact-information')));
assert.ok(countyVerified.samples.some((sample) => sample.final_url.includes('west-region-general-contact-information')));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'West Region -> new-haven-ct'));

assert.equal(countyMap.length, 9);
assert.equal(new Set(countyMap.map((row) => row.county_id)).size, 8);
assert.equal(countyMap.filter((row) => row.county_id === 'new-haven-ct').length, 2);

assert.equal(batchSummary.repaired_family, 'county_local_disability_resources');
assert.equal(batchSummary.county_region_rows, 9);
assert.equal(batchSummary.unique_counties_covered, 8);
assert.ok(report.includes('County/local disability resources are no longer blocked'));
assert.ok(report.includes('New Haven county remains dual-routed'));
assert.ok(lessons.includes('### Live Regional Contact Pages Can Retire A PDF-Only Blocker'));

console.log('test-batch117-connecticut-dds-county-map-repair-v1: ok');
