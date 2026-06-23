import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch189KansasDdBrowserRepairV1 } from './run-batch189-kansas-dd-browser-repair-v1.mjs';

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

const result = generateBatch189KansasDdBrowserRepairV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch189_kansas_dd_browser_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(batchSummary.dd_promoted_to_verified_state_grade, true);
assert.deepEqual(batchSummary.remaining_critical_gap_families, ['district_or_county_education_routing']);

assert.equal(summary.completeness_pct, 92);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing']);
assert.equal(summary.primary_gap_reason, 'kansas_now_has_reviewed_first_party_dd_authority_but_public_district_inventory_is_still_not_converted_into_local_special_education_leaves');

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddGap.family_status, 'verified_state_grade');
assert.match(ddGap.status_reason, /reviewed first-party KDADS leaves/i);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_live_ksde_directory_roots_without_local_contract');
assert.match(educationGap.status_reason, /concrete first-party district inventory lane/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'district_or_county_education_routing');

const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddVerified.family_status, 'verified_state_grade');
assert.equal(ddVerified.evidence_strength, 'strong');
assert.equal(ddVerified.sample_count, 4);
assert.ok(ddVerified.samples.find((row) => /intellectual-developmentally-disabled-information/.test(row.source_url)));
assert.ok(ddVerified.samples.find((row) => /community-support-waiver/.test(row.source_url)));
assert.ok(ddVerified.samples.find((row) => /hcbs-leadership-staff/.test(row.source_url)));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'district_or_county_education_routing');
assert.equal(nextRows[0].priority_rank, 1);

assert.match(report, /Developmental-disability authority now clears from reviewed first-party KDADS pages/i);
assert.match(report, /Education is now the only remaining critical blocker/i);

console.log('test-batch189-kansas-dd-browser-repair-v1: ok');
