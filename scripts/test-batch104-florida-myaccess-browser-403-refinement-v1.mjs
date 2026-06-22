import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch104FloridaMyaccessBrowser403RefinementV1 } from './run-batch104-florida-myaccess-browser-403-refinement-v1.mjs';

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

const result = generateBatch104FloridaMyaccessBrowser403RefinementV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch104_florida_myaccess_browser_403_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.primary_gap_reason, 'official_myaccess_locator_cloudfront_403_blocks_browser_lane');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_browser_lane_cloudfront_403');
assert.match(countyGap.status_reason, /CloudFront 403/i);

assert.equal(failures.length, 1);
assert.equal(failures[0].failure_code, 'official_myaccess_locator_cloudfront_403_blocks_browser_lane');
assert.match(failures[0].evidence, /CloudFront 403/i);
assert.match(failures[0].evidence, /Request blocked/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_browser_lane_cloudfront_403');
assert.equal(countyVerified.blocker_code, 'official_myaccess_locator_cloudfront_403_blocks_browser_lane');
assert.match(countyVerified.query_basis, /bounded Playwright browser probe/i);

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].next_action, 'hold_county_local_until_first_party_locator_is_reachable_or_documented_api_contract_is_available');

assert.equal(batchSummary.evidence_checks.browserStatus, 403);
assert.equal(batchSummary.evidence_checks.browserTitle, 'ERROR: The request could not be satisfied');
assert.equal(batchSummary.evidence_checks.browserBodyContains, 'Request blocked');

assert.ok(report.includes('CloudFront 403'));
assert.ok(report.includes('Request blocked'));
assert.ok(lessons.includes('Browser Lanes Must Be Rechecked When Static JS Shell Evidence Looks Promising'));

console.log('test-batch104-florida-myaccess-browser-403-refinement-v1: ok');
