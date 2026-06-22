import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch112FloridaLocalContractBlockerRefreshV1 } from './run-batch112-florida-local-contract-blocker-refresh-v1.mjs';

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

const result = generateBatch112FloridaLocalContractBlockerRefreshV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch112_florida_local_contract_blocker_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_frc_csv_partial_and_myaccess_remaining_counties_browser_only');
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'county_local_disability_resources');
assert.equal(summary.final_blockers[0].failure_code, 'official_frc_csv_partial_and_myaccess_remaining_counties_browser_only');
assert.match(summary.final_blockers[0].evidence, /providers\.csv still covers only 39 rows across 34 unique Florida counties/i);
assert.match(summary.final_blockers[0].evidence, /officeMapping=\/dataexchangeproxy/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_browser_only_remaining_county_locator_contract');
assert.match(countyGap.status_reason, /34\/67 counties/i);
assert.match(countyGap.status_reason, /JavaScript shell/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].failure_code, 'official_frc_csv_partial_and_myaccess_remaining_counties_browser_only');
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].next_action, 'hold_county_local_until_browser_assisted_or_documented_myaccess_office_contract_yields_remaining_33_counties');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_browser_only_remaining_county_locator_contract');
assert.equal(countyVerified.blocker_code, 'official_frc_csv_partial_and_myaccess_remaining_counties_browser_only');
assert.match(countyVerified.query_basis, /MyACCESS shell\/appconfig contract/i);

assert.equal(batchSummary.evidence_checks.csvUniqueCountyCount, 34);
assert.equal(batchSummary.evidence_checks.remainingCountyGap, 33);
assert.equal(batchSummary.evidence_checks.officeMapping, '/dataexchangeproxy');
assert.match(batchSummary.evidence_checks.bundleSignal, /county dropdown UI/i);

assert.ok(report.includes('remaining county search still sits behind the MyACCESS JavaScript shell'));
assert.ok(lessons.includes('Official App Config Hints Are Not County-Grade Evidence By Themselves'));

console.log('test-batch112-florida-local-contract-blocker-refresh-v1: ok');
