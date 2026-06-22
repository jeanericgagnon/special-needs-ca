import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch133IdahoPlaceholderTruthRefreshV1 } from './run-batch133-idaho-placeholder-truth-refresh-v1.mjs';

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

const result = generateBatch133IdahoPlaceholderTruthRefreshV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch133_idaho_placeholder_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_db_rows_still_reuse_statewide_placeholders_for_both_local_families');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduGap.status_reason, /all 44 Idaho school_district rows reuse statewide SDE URLs/i);
assert.match(countyGap.status_reason, /27 rows still use the dead legacy dhhs\.idaho\.gov\/locations storefront root/i);
assert.match(countyGap.status_reason, /18 rows still point to the generic Medicaid page/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduFailure.evidence, /44\/44 statewide placeholders/i);
assert.match(countyFailure.evidence, /27 county rows use the dead legacy locator/i);
assert.match(countyFailure.evidence, /18 rows still point to the generic Medicaid page/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduVerified.query_basis, /live DB placeholder counts/i);
assert.match(countyVerified.query_basis, /live DB placeholder counts/i);

assert.equal(batchSummary.district_placeholder_rows, 44);
assert.equal(batchSummary.county_dead_locator_rows, 27);
assert.equal(batchSummary.county_generic_medicaid_rows, 18);

assert.ok(report.includes('all 44 current school_district rows are statewide placeholders'));
assert.ok(lessons.includes('### Named Office Labels Still Count As Placeholders When The URL Is Generic'));
assert.match(nextRows.find((row) => row.family === 'county_local_disability_resources').evidence, /27 county rows use the dead legacy locator/i);

console.log('test-batch133-idaho-placeholder-truth-refresh-v1: ok');
