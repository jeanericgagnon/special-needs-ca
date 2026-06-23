import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch278FloridaMyaccessShellFinalityV1 } from './run-batch278-florida-myaccess-shell-finality-v1.mjs';

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

const result = generateBatch278FloridaMyaccessShellFinalityV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch278_florida_myaccess_shell_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch278-florida-myaccess-shell-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(gap.status_reason, /config\/appconfig\.js/i);
assert.match(gap.status_reason, /\/swagger/i);
assert.match(gap.status_reason, /same generic SPA shell/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(verified.query_basis, /MyACCESS config\/shell pass/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS appconfig shell contract'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS swagger shell'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS config shell'));

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(failure.evidence, /config\/appconfig\.js/i);
assert.match(failure.evidence, /config\/config\.json/i);
assert.match(failure.evidence, /swagger\/index\.html/i);

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(next.evidence, /public anonymous contract/i);

assert.equal(batchSummary.providers_distinct_counties, 34);
assert.equal(batchSummary.myaccess_accountmanagement_services_still_configured, true);
assert.ok(batchSummary.myaccess_shell_only_paths.includes('https://myaccess.myflfamilies.com/swagger/index.html'));

assert.ok(report.includes('public config still routes county-result services through `/accountmanagement`'));
assert.ok(handoff.includes('## Current Focus State: Florida'));
assert.ok(handoff.includes('https://myaccess.myflfamilies.com/swagger/index.html'));
assert.ok(batchReport.includes('Batch 278 Florida MyACCESS Shell Finality Report v1'));

console.log('test-batch278-florida-myaccess-shell-finality-v1: ok');
