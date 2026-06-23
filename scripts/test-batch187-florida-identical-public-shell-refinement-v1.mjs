import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch187FloridaIdenticalPublicShellRefinementV1 } from './run-batch187-florida-identical-public-shell-refinement-v1.mjs';

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

const result = generateBatch187FloridaIdenticalPublicShellRefinementV1();
const batchSummary = readJson('data/generated/batch187_florida_identical_public_shell_refinement_summary_v1.json');
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch187-florida-identical-public-shell-refinement-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.identical_public_shells, true);
assert.equal(summary.primary_gap_reason, 'public_myaccess_cpcps_and_help_routes_are_identical_shells_and_partner_services_stay_accountmanagement_401');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /Public\/CPCPS.*Help\/HCINT.*same 5165-byte MyACCESS shell/i);
assert.match(countyGap.status_reason, /Arlington Expressway/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'public_myaccess_cpcps_and_help_routes_are_identical_shells_and_partner_services_stay_accountmanagement_401');
assert.match(countyFailure.evidence, /same 5165-byte generic MyACCESS shell/i);
assert.match(countyFailure.evidence, /partnerApproverServices only under `?\/accountmanagement`?/i);
assert.match(countyFailure.evidence, /5920 Arlington Expressway/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
const cpcpsSample = countyVerified.samples.find((row) => row.source_url === 'https://myaccess.myflfamilies.com/Public/CPCPS');
const configSample = countyVerified.samples.find((row) => row.source_url === 'https://myaccess.myflfamilies.com/config/appconfig.js');
const helpSample = countyVerified.samples.find((row) => row.source_url === 'https://myaccess.myflfamilies.com/Help/HCINT');
assert.ok(cpcpsSample);
assert.ok(configSample);
assert.ok(helpSample);
assert.equal(cpcpsSample.verification_status, 'blocked');
assert.equal(helpSample.verification_status, 'blocked');
assert.equal(configSample.verification_status, 'reviewed');
assert.match(cpcpsSample.evidence_snippet, /same 5165-byte MyACCESS shell/i);
assert.match(helpSample.evidence_snippet, /same 5165-byte MyACCESS shell/i);
assert.match(configSample.evidence_snippet, /partnerApproverServices only under \/accountmanagement/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'public_myaccess_cpcps_and_help_routes_are_identical_shells_and_partner_services_stay_accountmanagement_401');
assert.match(countyNext.evidence, /same 5165-byte generic MyACCESS shell/i);

assert.ok(report.includes('The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes are now proven to be the same generic shell'));
assert.ok(batchReport.includes('The public MyACCESS `Public/CPCPS` and `Help/HCINT` routes are the same generic shell'));
assert.ok(lessons.includes('### Identical Public SPA Shells Should Collapse To One Final Blocker'));
assert.ok(lessons.includes('### Role Audits Must Reject Address-Substring False Positives'));

console.log('test-batch187-florida-identical-public-shell-refinement-v1: ok');
