import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch115NewYorkHealthHost403RefinementV1 } from './run-batch115-new-york-health-host-403-refinement-v1.mjs';

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

const result = generateBatch115NewYorkHealthHost403RefinementV1();
const summary = readJson('data/generated/new-york_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-york_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-york_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-york_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-york_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch115_new-york_health_host_403_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-york-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_health_hostwide_403');
assert.match(countyGap.status_reason, /robots\.txt/i);
assert.match(countyGap.status_reason, /sitemap\.xml/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement');
assert.match(countyFailure.evidence, /ldss\.htm/i);
assert.match(countyFailure.evidence, /robots\.txt/i);
assert.match(countyFailure.evidence, /sitemap\.xml/i);
assert.match(countyFailure.evidence, /All five bounded health\.ny\.gov Medicaid\/host surfaces returned HTTP 403/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_health_hostwide_403');
assert.equal(countyVerified.blocker_code, 'bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement');
assert.match(countyVerified.query_basis, /robots, sitemap, and nearby Medicaid root/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_public_health_ny_ldss_replacement_or_county_owned_locator_is_verified');

assert.equal(batchSummary.evidence_checks.ldss, '403');
assert.equal(batchSummary.evidence_checks.robots, '403');
assert.equal(batchSummary.evidence_checks.sitemap, '403');
assert.equal(batchSummary.evidence_checks.publicSameHostReplacementVerified, false);

assert.ok(report.includes('health.ny.gov Medicaid lane is failing at the host level'));
assert.ok(lessons.includes('Host-Wide 403 Across Root, Robots, And Sitemap Is Not A Single-Page Failure'));

console.log('test-batch115-new-york-health-host-403-refinement-v1: ok');
