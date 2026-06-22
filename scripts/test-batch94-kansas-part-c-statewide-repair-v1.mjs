import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch94KansasPartCStatewideRepairV1 } from './run-batch94-kansas-part-c-statewide-repair-v1.mjs';

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

const result = generateBatch94KansasPartCStatewideRepairV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch94_kansas_part_c_statewide_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch94-kansas-part-c-statewide-repair-report-v1.md'), 'utf8');
const partCSource = readJson('data/generated/kansas_part_c_reviewed_source_v1.json');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 58, 'Kansas completeness must rise after Part C repair.');
assert.equal(summary.strong_critical_families, 7, 'Kansas should retain seven strong critical families after Part C repair.');
assert.equal(summary.weak_critical_families, 5, 'Kansas should retain five weak critical families after Part C repair.');
assert.equal(summary.missing_critical_families, 0, 'Kansas should no longer retain a missing critical family after Part C repair.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('early_intervention_part_c').family_status, 'verified_state_grade');
assert.equal(byFamily.get('medicaid_state_health_coverage').family_status, 'blocked_live_medicaid_source_access_denied');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_exact_district_or_county_leafs_unverified');

assert.ok(!failureRows.some((row) => row.family === 'early_intervention_part_c'), 'Kansas Part C must drop out of the failure ledger.');
assert.equal(failureRows.length, 5, 'Kansas should collapse to five real current blockers.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'medicaid_state_health_coverage',
    'medicaid_waiver_hcbs_disability_services',
    'developmental_disability_idd_authority',
    'district_or_county_education_routing',
    'county_local_disability_resources',
  ],
  'Kansas next actions must collapse to the remaining current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('early_intervention_part_c').family_status, 'verified_state_grade');
assert.equal(verifiedByFamily.get('early_intervention_part_c').sample_count, 1);
assert.equal(verifiedByFamily.get('early_intervention_part_c').samples[0].final_url, 'https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education');
assert.match(verifiedByFamily.get('early_intervention_part_c').samples[0].evidence_snippet, /under Part C of the Individuals with Disabilities Education Act/i);

assert.equal(partCSource.final_url, 'https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education');
assert.match(partCSource.evidence_snippet, /Kansas Early Childhood Developmental Services/i);
assert.match(partCSource.evidence_snippet, /www\.itsofks\.org/i);

assert.ok(report.includes('Kansas early intervention is no longer missing'), 'Kansas report must explain the Part C repair precisely.');
assert.ok(report.includes('KDHE administers early intervention services under Part C'), 'Kansas report must preserve the exact Part C evidence.');
assert.ok(report.includes('remains BLOCKED and not index-safe'), 'Kansas report must preserve the final blocker decision.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.updated_families, ['early_intervention_part_c']);
assert.ok(batchReport.includes('updated_families: early_intervention_part_c'));

console.log('test-batch94-kansas-part-c-statewide-repair-v1: ok');
