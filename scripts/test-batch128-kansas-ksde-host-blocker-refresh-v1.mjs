import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch128KansasKsdeHostBlockerRefreshV1 } from './run-batch128-kansas-ksde-host-blocker-refresh-v1.mjs';

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

const result = generateBatch128KansasKsdeHostBlockerRefreshV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch128_kansas_ksde_host_blocker_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch128-kansas-ksde-host-blocker-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 42);
assert.equal(summary.strong_critical_families, 5);
assert.equal(summary.weak_critical_families, 7);
assert.equal(summary.primary_gap_reason, 'ksde_request_rejected_shell_plus_kancare_kdads_access_blocked');
assert.deepEqual(
  summary.critical_gap_families,
  [
    'medicaid_state_health_coverage',
    'medicaid_waiver_hcbs_disability_services',
    'developmental_disability_idd_authority',
    'early_intervention_part_c',
    'special_education_idea_part_b',
    'district_or_county_education_routing',
    'county_local_disability_resources',
  ],
);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('early_intervention_part_c').family_status, 'blocked_ksde_ecse_root_request_rejected');
assert.equal(byFamily.get('special_education_idea_part_b').family_status, 'blocked_ksde_special_education_root_request_rejected');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_ksde_host_request_rejected_and_no_local_leafs');

assert.equal(failures.length, 7);
assert.equal(failures.find((row) => row.family === 'special_education_idea_part_b').failure_code, 'ksde_request_rejected_shell_on_exact_special_education_and_ecse_roots');
assert.equal(failures.find((row) => row.family === 'early_intervention_part_c').failure_code, 'ksde_request_rejected_shell_on_exact_special_education_and_ecse_roots');

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('early_intervention_part_c').sample_count, 0);
assert.equal(verifiedByFamily.get('special_education_idea_part_b').sample_count, 0);
assert.equal(verifiedByFamily.get('district_or_county_education_routing').sample_count, 0);
assert.equal(verifiedByFamily.get('district_or_county_education_routing').blocker_code, 'ksde_request_rejected_shell_on_exact_special_education_and_ecse_roots');

assert.equal(nextRows.length, 7);
assert.ok(nextRows.some((row) => row.family === 'special_education_idea_part_b'));
assert.ok(nextRows.some((row) => row.family === 'early_intervention_part_c'));

const kansasQueue = queueRows.find((row) => row.state === 'kansas');
assert.equal(kansasQueue.completeness_pct, 42);
assert.equal(kansasQueue.primary_gap_reason, 'ksde_request_rejected_shell_plus_kancare_kdads_access_blocked');

assert.deepEqual(batchSummary.downgraded_families, ['early_intervention_part_c', 'special_education_idea_part_b']);
assert.equal(batchSummary.refined_family, 'district_or_county_education_routing');

assert.ok(report.includes('245-byte Request Rejected shell'));
assert.ok(report.includes('downgrading KSDE-backed special-education and Part C families'));
assert.ok(batchReport.includes('downgraded_families: early_intervention_part_c, special_education_idea_part_b'));

console.log('test-batch128-kansas-ksde-host-blocker-refresh-v1: ok');
