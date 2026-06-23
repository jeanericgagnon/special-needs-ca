import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch181FloridaPublicHelpShellRefinementV1 } from './run-batch181-florida-public-help-shell-refinement-v1.mjs';

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

const result = generateBatch181FloridaPublicHelpShellRefinementV1();
const batchSummary = readJson('data/generated/batch181_florida_public_help_shell_refinement_summary_v1.json');
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.public_help_shell_only, true);
assert.equal(summary.primary_gap_reason, 'public_dcf_contacts_csv_is_county_complete_but_wrong_role_help_lane_is_js_shell_and_myaccess_results_remain_authenticated');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /Help\/HCINT[` ]+lane exposed from the assistance page is only a JavaScript shell/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyFailure.evidence, /myaccess\.myflfamilies\.com\/Help\/HCINT/);
assert.match(countyFailure.evidence, /generic MyACCESS JavaScript shell/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
const helpSample = countyVerified.samples.find((row) => row.source_url === 'https://myaccess.myflfamilies.com/Help/HCINT');
assert.ok(helpSample);
assert.equal(helpSample.verification_status, 'blocked');
assert.match(helpSample.evidence_snippet, /You need to enable JavaScript to run this app/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyNext.evidence, /Help\/HCINT/);

assert.ok(report.includes('The newly surfaced first-party MyACCESS help lane (`Help/HCINT`) is only a JavaScript shell'));
assert.ok(lessons.includes('### First-Party Help Routes Under A Portal Host Still Need Real County Rows'));

console.log('test-batch181-florida-public-help-shell-refinement-v1: ok');
