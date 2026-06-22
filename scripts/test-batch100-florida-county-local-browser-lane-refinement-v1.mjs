import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch100FloridaCountyLocalBrowserLaneRefinementV1 } from './run-batch100-florida-county-local-browser-lane-refinement-v1.mjs';

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

const result = generateBatch100FloridaCountyLocalBrowserLaneRefinementV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch100_florida_county_local_browser_lane_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91, 'Florida completeness should stay unchanged during blocker refinement.');
assert.equal(summary.primary_gap_reason, 'official_myaccess_county_locator_requires_browser_assisted_or_api_contract_repair');
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'county_local_disability_resources');
assert.equal(summary.final_blockers[0].failure_code, 'official_myaccess_county_locator_requires_browser_assisted_or_api_contract_repair');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_browser_assisted_official_locator');
assert.ok(countyGap.status_reason.includes('34/67 counties'));
assert.ok(countyGap.status_reason.includes('MyACCESS'));

assert.equal(failures.length, 1);
assert.equal(failures[0].failure_code, 'official_myaccess_county_locator_requires_browser_assisted_or_api_contract_repair');
assert.ok(failures[0].evidence.includes('34 of Florida’s 67 counties'));
assert.ok(failures[0].evidence.includes('officeMapping=/dataexchangeproxy'));

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_browser_assisted_official_locator');
assert.equal(countyVerified.sample_count, 34);
assert.equal(countyVerified.blocker_code, 'official_myaccess_county_locator_requires_browser_assisted_or_api_contract_repair');
assert.ok(countyVerified.query_basis.includes('MyACCESS shell'));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.equal(nextRows[0].next_action, 'move_county_local_disability_resources_to_browser_assisted_myaccess_office_mapping_repair');

assert.equal(batchSummary.blocker_code, 'official_myaccess_county_locator_requires_browser_assisted_or_api_contract_repair');
assert.equal(batchSummary.evidence_checks.appConfigOfficeMapping, '/dataexchangeproxy');
assert.equal(batchSummary.evidence_checks.cpcpsStatus, 200);
assert.equal(batchSummary.evidence_checks.officeMappingStatus, 200);

assert.ok(report.includes('browser-assisted or documented API-contract extraction'));
assert.ok(report.includes('officeMapping=/dataexchangeproxy'));
assert.ok(report.includes('34/67 counties'));

console.log('test-batch100-florida-county-local-browser-lane-refinement-v1: ok');
