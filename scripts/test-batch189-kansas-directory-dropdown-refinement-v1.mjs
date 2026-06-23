import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch189KansasDirectoryDropdownRefinementV1 } from './run-batch189-kansas-directory-dropdown-refinement-v1.mjs';

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

const result = generateBatch189KansasDirectoryDropdownRefinementV1();
const batchSummary = readJson('data/generated/batch189_kansas_directory_dropdown_refinement_summary_v1.json');
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch189-kansas-directory-dropdown-refinement-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.public_directory_dropdown_detected, true);
assert.equal(summary.primary_gap_reason, 'kansas_dd_stack_is_uniformly_transport_blocked_and_public_directory_inventory_is_now_clear_but_local_leaves_are_still_missing');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(eduGap.status_reason, /Directory Reports app exposes an `\*\*\*ALL DISTRICTS\*\*\*` selector/i);
assert.match(eduGap.status_reason, /annual Kansas Educational Directory PDFs/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'public_directory_reports_dropdown_and_annual_directory_pdfs_exist_but_no_reviewed_local_special_education_leaves');
assert.match(eduFailure.evidence, /D0435 :: ABILENE USD 435/i);
assert.match(eduFailure.evidence, /D0385 :: ANDOVER USD 385/i);
assert.match(eduFailure.evidence, /D0409 :: ATCHISON PUBLIC SCHOOLS USD 409/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.sample_count, 4);
assert.ok(eduVerified.samples.some((sample) => sample.sample_name === 'Kansas public district dropdown inventory'));
assert.ok(eduVerified.samples.some((sample) => sample.sample_name === 'KSDE Directories page'));

const eduNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduNext.next_action, 'use_public_directory_dropdown_and_annual_directory_pdfs_to_author_reviewed_district_owned_special_education_leaves');

assert.ok(report.includes('the public Directory Reports app and annual Kansas Educational Directory PDFs now prove a concrete first-party district inventory lane'));
assert.ok(batchReport.includes('public education lane is now sharper'));
assert.ok(lessons.includes('### Public District Dropdowns Count As Inventory, Not As Routing Proof'));

console.log('test-batch189-kansas-directory-dropdown-refinement-v1: ok');
