import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch120FloridaPublicContractFinalBlockerV1 } from './run-batch120-florida-public-contract-final-blocker-v1.mjs';

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

const result = generateBatch120FloridaPublicContractFinalBlockerV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch120_florida_public_contract_final_blocker_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_myaccess_public_shell_and_proxy_do_not_expose_county_rows');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_shell_and_proxy_without_county_rows');
assert.match(countyGap.status_reason, /34\/67 counties/i);
assert.match(countyGap.status_reason, /public county-row contract/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_public_shell_and_proxy_without_county_rows');
assert.equal(countyVerified.sample_count, 34);
assert.match(countyVerified.query_basis, /plain proxy GET/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].failure_code, 'official_myaccess_public_shell_and_proxy_do_not_expose_county_rows');
assert.match(failureRows[0].evidence, /same 5165-byte MyACCESS shell/i);
assert.match(failureRows[0].evidence, /admin\/location-form module/i);

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].next_action, 'hold_county_local_until_first_party_county_dataset_or_search_contract_is_publicly_documented');

assert.equal(batchSummary.evidence_checks.cpcpsStatus, 200);
assert.equal(batchSummary.evidence_checks.proxyStatus, 200);
assert.equal(batchSummary.evidence_checks.proxyShellBytes, 5165);
assert.match(batchSummary.evidence_checks.bundleFinding, /admin\/location-form module/i);

assert.ok(report.includes('public MyACCESS shell and proxy still do not expose county rows'));
assert.ok(lessons.includes('Public Shell And Admin Bundle Evidence Must Be Separated Before Reopening A Blocked Portal Lane'));

console.log('test-batch120-florida-public-contract-final-blocker-v1: ok');
