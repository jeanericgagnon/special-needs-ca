import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch97ColoradoBlockerRefinementV1 } from './run-batch97-colorado-blocker-refinement-v1.mjs';

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

const result = generateBatch97ColoradoBlockerRefinementV1();
const summary = readJson('data/generated/colorado_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/colorado_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/colorado_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/colorado_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch97_colorado_blocker_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/colorado-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.deepEqual(summary.final_blockers.map((row) => row.family), ['district_or_county_education_routing', 'county_local_disability_resources']);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_statewide_cde_fallback_rows_only');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /All 64/);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /https:\/\/www\.cde\.state\.co\.us\/cdesped/);
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'blocked_doi_mirror_county_rows_only');
assert.match(byFamily.get('county_local_disability_resources').status_reason, /At least 67/);
assert.match(byFamily.get('county_local_disability_resources').status_reason, /doi\.org\/10\.7910\/DVN\/AVRHMI/);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'all_counties_still_use_statewide_cde_special_education_root');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'county_office_rows_still_backed_by_doi_mirror');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'blocked_statewide_cde_fallback_rows_only');
assert.match(eduVerified.blocker_evidence, /county fallback/);
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_doi_mirror_county_rows_only');
assert.match(countyVerified.blocker_evidence, /mirror data/);

assert.equal(batchSummary.classification, 'BLOCKED');
assert.ok(report.includes('one statewide CDE root across all 64 counties'));
assert.ok(report.includes('DOI mirror rows'));

console.log('test-batch97-colorado-blocker-refinement-v1: ok');
