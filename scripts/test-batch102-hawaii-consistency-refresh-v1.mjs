import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch102HawaiiConsistencyRefreshV1 } from './run-batch102-hawaii-consistency-refresh-v1.mjs';

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

const result = generateBatch102HawaiiConsistencyRefreshV1();
const summary = readJson('data/generated/hawaii_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/hawaii_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/hawaii_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/hawaii_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/hawaii_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch102_hawaii_consistency_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/hawaii-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 58);
assert.equal(summary.primary_gap_reason, 'fake_domains_and_access_denied_leaves_broke_prior_hawaii_packet_truth');

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddGap.family_status, 'verified_state_grade');
assert.ok(ddGap.status_reason.includes('Hawaii DOH Developmental Disabilities Division'));

const earlyGap = gapRows.find((row) => row.family === 'early_intervention_part_c');
assert.equal(earlyGap.family_status, 'missing');
assert.ok(earlyGap.status_reason.includes('does not resolve'));

const eiFailure = failures.find((row) => row.family === 'early_intervention_part_c');
assert.equal(eiFailure.failure_code, 'fake_domain_sample_requires_real_part_c_replacement');

const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddVerified.samples[0].source_url, 'https://health.hawaii.gov/ddd/');
const eiVerified = verifiedRows.find((row) => row.family === 'early_intervention_part_c');
assert.equal(eiVerified.family_status, 'missing');
assert.equal(eiVerified.sample_count, 0);

const localVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(localVerified.blocker_code, 'dead_locations_root_and_doi_directory_fallback');

assert.equal(batchSummary.realDddUrl, 'https://health.hawaii.gov/ddd/');
assert.deepEqual(batchSummary.downgradedFamilies, ['early_intervention_part_c']);
assert.ok(report.includes('dhhs.hawaii.gov/earlystart'));
assert.ok(report.includes('returns HTTP 403'));
assert.ok(report.includes('DOI-derived'));

assert.ok(nextRows.some((row) => row.family === 'early_intervention_part_c'));

console.log('test-batch102-hawaii-consistency-refresh-v1: ok');
