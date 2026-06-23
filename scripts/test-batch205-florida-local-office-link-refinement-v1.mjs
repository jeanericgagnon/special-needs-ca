import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch205FloridaLocalOfficeLinkRefinementV1 } from './run-batch205-florida-local-office-link-refinement-v1.mjs';

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

const result = generateBatch205FloridaLocalOfficeLinkRefinementV1();
const batchSummary = readJson('data/generated/batch205_florida_local_office_link_refinement_summary_v1.json');
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch205-florida-local-office-link-refinement-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.local_office_prose_without_leaf, true);
assert.equal(batchSummary.extracted_public_leaf_count, 0);
assert.equal(summary.primary_gap_reason, 'public_assistance_pages_name_local_office_but_expose_no_public_county_office_leaf_and_myaccess_results_stay_authenticated');

const queueRow = queueRows.find((row) => row.state === 'florida');
assert.equal(queueRow.primary_gap_reason, 'public_assistance_pages_name_local_office_but_expose_no_public_county_office_leaf_and_myaccess_results_stay_authenticated');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_local_office_prose_without_county_leaf_and_authenticated_myaccess_lane');
assert.match(countyGap.status_reason, /turn in information at a local office/i);
assert.match(countyGap.status_reason, /not to any public county office directory or local ESS office leaf/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'public_assistance_pages_name_local_office_but_expose_no_public_county_office_leaf_and_myaccess_results_stay_authenticated');
assert.match(countyFailure.evidence, /turn in information at a local office/i);
assert.match(countyFailure.evidence, /no public county office directory or local ESS office leaf/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_public_local_office_prose_without_county_leaf_and_authenticated_myaccess_lane');
const applyingSample = countyVerified.samples.find((row) => row.source_url === 'https://www.myflfamilies.com/services/public-assistance/applying-for-assistance');
const publicAssistanceSample = countyVerified.samples.find((row) => row.source_url === 'https://www.myflfamilies.com/services/public-assistance');
assert.ok(applyingSample);
assert.ok(publicAssistanceSample);
assert.equal(applyingSample.verification_status, 'reviewed');
assert.match(applyingSample.evidence_snippet, /local office or community partner/i);
assert.match(applyingSample.evidence_snippet, /not to a public county office directory/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_county_local_until_first_party_public_county_office_leaf_or_anonymous_myaccess_results_exist');
assert.equal(countyNext.failure_code, 'public_assistance_pages_name_local_office_but_expose_no_public_county_office_leaf_and_myaccess_results_stay_authenticated');

assert.ok(report.includes('“local office” appears only as unlinked prose'));
assert.ok(batchReport.includes('references a local office only in prose'));
assert.ok(lessons.includes('### Local-Office Prose Does Not Count Without A Linked Public Leaf'));

console.log('test-batch205-florida-local-office-link-refinement-v1: ok');
