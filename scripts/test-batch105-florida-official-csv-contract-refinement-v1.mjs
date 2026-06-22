import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch105FloridaOfficialCsvContractRefinementV1 } from './run-batch105-florida-official-csv-contract-refinement-v1.mjs';

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

const result = generateBatch105FloridaOfficialCsvContractRefinementV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch105_florida_official_csv_contract_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.primary_gap_reason, 'official_family_resource_center_csv_only_covers_34_counties');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_official_csv_contract_partial');
assert.match(countyGap.status_reason, /homepage fetches providers\.csv/i);
assert.match(countyGap.status_reason, /34\/67 Florida counties/i);

assert.equal(failures.length, 1);
assert.equal(failures[0].failure_code, 'official_family_resource_center_csv_only_covers_34_counties');
assert.match(failures[0].evidence, /homepage JavaScript explicitly fetches providers\.csv/i);
assert.match(failures[0].evidence, /39 rows covering 34 unique Florida counties/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_official_csv_contract_partial');
assert.equal(countyVerified.blocker_code, 'official_family_resource_center_csv_only_covers_34_counties');
assert.match(countyVerified.query_basis, /homepage JavaScript plus the published providers\.csv/i);

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].next_action, 'hold_county_local_until_first_party_family_resource_center_dataset_expands_or_new_official_county_locator_is_published');

assert.equal(batchSummary.evidence_checks.homepageUsesCsvFetch, true);
assert.equal(batchSummary.evidence_checks.csvRowCount, 39);
assert.equal(batchSummary.evidence_checks.csvUniqueCountyCount, 34);
assert.equal(batchSummary.evidence_checks.remainingCountyGap, 33);

assert.ok(report.includes('public first-party Family Resource Center homepage openly uses providers.csv'));
assert.ok(report.includes('official CSV still covers only 34 of Florida’s 67 counties'));

console.log('test-batch105-florida-official-csv-contract-refinement-v1: ok');
