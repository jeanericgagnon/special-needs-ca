import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch275FloridaStorefrontCountyContractFinalityV1 } from './run-batch275-florida-storefront-county-contract-finality-v1.mjs';

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

const result = generateBatch275FloridaStorefrontCountyContractFinalityV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch275_florida_storefront_county_contract_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_official_storefront_root_and_csv_only_cover_partial_county_set_and_authenticated_myaccess_results');
assert.match(gap.status_reason, /33 unique `filterByCountyFromMap/i);
assert.match(gap.status_reason, /34 distinct county values across 39 rows/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_official_storefront_root_and_csv_only_cover_partial_county_set_and_authenticated_myaccess_results');
assert.equal(verified.sample_count, 8);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida Family Resource Center root HTML'));
assert.ok(verified.samples.some((sample) => /Monore/.test(sample.evidence_snippet)));

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'official_family_resource_center_html_and_csv_both_materialize_only_partial_county_contract_while_myaccess_results_stay_authenticated');
assert.match(failure.evidence, /33 unique `filterByCountyFromMap/i);
assert.match(failure.evidence, /34 distinct county values across 39 rows/i);
assert.match(failure.evidence, /HTTP 401/i);

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_anonymous_myaccess_results_exist');

const queue = queueRows.find((row) => row.state === 'florida');
assert.equal(queue.status, 'BLOCKED');
assert.equal(queue.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated');

assert.equal(batchSummary.family_resource_center_county_rows, 39);
assert.equal(batchSummary.family_resource_center_distinct_counties, 34);
assert.equal(batchSummary.storefront_root_unique_county_pins, 33);
assert.equal(batchSummary.storefront_root_pin_calls, 38);
assert.equal(batchSummary.storefront_root_has_monore_typo, true);
assert.ok(report.includes('derives its county dropdown and county pins from the same partial `providers.csv`'));
assert.ok(handoff.includes('## Current Focus State: Florida'));
assert.ok(handoff.includes('Family Resource Center root'));
assert.ok(lessons.includes('### A First-Party Storefront Root That Derives Its County UI From A Partial CSV Is Still A Partial County Contract'));

console.log('test-batch275-florida-storefront-county-contract-finality-v1: ok');
