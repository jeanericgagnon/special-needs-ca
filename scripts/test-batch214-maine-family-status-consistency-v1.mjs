import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch214MaineFamilyStatusConsistencyV1 } from './run-batch214-maine-family-status-consistency-v1.mjs';

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

const result = generateBatch214MaineFamilyStatusConsistencyV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const batchSummary = readJson('data/generated/batch214_maine_family_status_consistency_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch214-maine-family-status-consistency-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_live_public_sau_export_contract_not_materialized_county_grade');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_district_office_locations_without_county_town_or_service_area_fields');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(summary.familyStatuses.district_or_county_education_routing, educationGap.family_status);
assert.equal(summary.familyStatuses.county_local_disability_resources, countyGap.family_status);

assert.deepEqual(batchSummary.aligned_families, ['district_or_county_education_routing', 'county_local_disability_resources']);
assert.ok(report.includes('blocked_live_public_sau_export_contract_not_materialized_county_grade'));
assert.ok(batchReport.includes('Updated Maine summary familyStatuses so they match the current gap matrix'));

console.log('test-batch214-maine-family-status-consistency-v1: ok');
