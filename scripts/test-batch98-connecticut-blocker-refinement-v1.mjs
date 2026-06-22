import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch98ConnecticutBlockerRefinementV1 } from './run-batch98-connecticut-blocker-refinement-v1.mjs';

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

const result = generateBatch98ConnecticutBlockerRefinementV1();
const summary = readJson('data/generated/connecticut_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/connecticut_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/connecticut_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/connecticut_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/connecticut_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch98_connecticut_blocker_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/connecticut-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.deepEqual(summary.final_blockers.map((row) => row.family), ['district_or_county_education_routing', 'parent_training_information_center', 'county_local_disability_resources']);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_statewide_ct_sde_fallback_rows_only');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /Six county-linked rows/);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /Fairfield and Hartford/);
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'blocked_doi_and_generic_locations_rows_only');
assert.match(byFamily.get('county_local_disability_resources').status_reason, /Eleven county-office rows/);
assert.match(byFamily.get('county_local_disability_resources').status_reason, /Tolland row/);
assert.match(byFamily.get('parent_training_information_center').status_reason, /homepage exposed only two same-domain links/);
assert.match(byFamily.get('parent_training_information_center').status_reason, /returned 404/);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'all_counties_still_use_statewide_ct_sde_roots');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'county_office_rows_still_backed_by_doi_or_generic_locations_root');

const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.match(ptiVerified.query_basis, /bounded same-domain follow-ups/);
assert.match(ptiVerified.blocker_evidence, /only two same-domain links/);
assert.match(ptiVerified.blocker_evidence, /preserved explicit PTI/);

const eduNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduNext.failure_code, 'all_counties_still_use_statewide_ct_sde_roots');
const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'county_office_rows_still_backed_by_doi_or_generic_locations_root');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.ok(report.includes('one generic locations root row'));
assert.ok(report.includes('only two same-domain links'));

console.log('test-batch98-connecticut-blocker-refinement-v1: ok');
