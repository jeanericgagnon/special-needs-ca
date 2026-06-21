import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch50FloridaCountyGradeTruthRefreshV1 } from './run-batch50-florida-county-grade-truth-refresh-v1.mjs';

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

const result = generateBatch50FloridaCountyGradeTruthRefreshV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch50_florida_county_grade_truth_refresh_summary_v1.json');
const probes = readJson('data/generated/batch50_florida_official_probe_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Florida should remain blocked because county-local coverage is still incomplete.');
assert.equal(summary.classification, 'BLOCKED', 'Florida packet summary must remain blocked.');
assert.equal(summary.index_safe, false, 'Florida must remain not index-safe.');
assert.equal(summary.completeness_pct, 91, 'Florida completeness must rise to 91 after the education routing repair.');
assert.equal(summary.strong_critical_families, 11, 'Florida should carry eleven strong critical families after the FDLRS county routing repair.');
assert.equal(summary.weak_critical_families, 1, 'Florida should collapse to one weak critical family.');
assert.equal(summary.missing_critical_families, 0, 'Florida should have no missing critical families.');
assert.equal(summary.primary_gap_reason, 'official_family_resource_center_locator_partial_county_coverage', 'Florida primary gap should now reflect the partial official county locator.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'verified_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'blocked_partial_official_county_locator');
assert.ok(
  byFamily.get('district_or_county_education_routing').status_reason.includes('67/67 Florida counties'),
  'Florida education routing must cite 67/67 county coverage on the official FDLRS page.',
);
assert.ok(
  byFamily.get('county_local_disability_resources').status_reason.includes('34/67 Florida counties'),
  'Florida county-local routing must cite the exact partial official coverage count.',
);

assert.equal(failureRows.length, 1, 'Florida should collapse to one real remaining blocker.');
assert.equal(failureRows[0].family, 'county_local_disability_resources', 'Florida’s only remaining blocker should be county-local routing.');
assert.equal(failureRows[0].failure_code, 'official_family_resource_center_locator_partial_county_coverage');

assert.equal(nextRows.length, 1, 'Florida should collapse to one next action.');
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.equal(nextRows[0].failure_code, 'official_family_resource_center_locator_partial_county_coverage');

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('district_or_county_education_routing').family_status, 'verified_state_grade');
assert.equal(verifiedByFamily.get('district_or_county_education_routing').sample_count, 67, 'Florida education routing should preserve 67 county-mapped official samples.');
assert.equal(verifiedByFamily.get('district_or_county_education_routing').blocker_code, null, 'Florida education routing must clear its blocker code.');
assert.equal(verifiedByFamily.get('county_local_disability_resources').family_status, 'blocked_partial_official_county_locator');
assert.equal(verifiedByFamily.get('county_local_disability_resources').sample_count, 34, 'Florida county-local routing should preserve the 34 county official storefront coverage count.');
assert.equal(verifiedByFamily.get('county_local_disability_resources').blocker_code, 'official_family_resource_center_locator_partial_county_coverage');

assert.equal(probes.districtRouting.status, 200, 'FDLRS routing probe must remain live.');
assert.equal(probes.districtRouting.countyCoverageCount, 67, 'FDLRS routing probe must preserve 67-county coverage.');
assert.equal(probes.countyLocal.landingStatus, 200, 'Florida county-local landing page must remain live.');
assert.equal(probes.countyLocal.locatorStatus, 200, 'Florida Family Resource Center page must remain live.');
assert.equal(probes.countyLocal.csvStatus, 200, 'Florida Family Resource Center CSV must remain live.');
assert.equal(probes.countyLocal.countyCoverageCount, 34, 'Florida Family Resource Center CSV must preserve the 34-county coverage count.');
assert.equal(probes.countyLocal.uncoveredCountyCount, 33, 'Florida Family Resource Center CSV must preserve the remaining gap count.');

assert.ok(report.toLowerCase().includes('district or county education routing is now verified'), 'Florida report must explain the FDLRS education upgrade.');
assert.ok(report.includes('34/67 counties'), 'Florida report must preserve the exact remaining county-local coverage gap.');
assert.ok(report.includes('Family Resource Center'), 'Florida report must name the new official county-local evidence root.');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.upgraded_families, ['district_or_county_education_routing']);
assert.deepEqual(batchSummary.remaining_blockers, ['county_local_disability_resources']);

console.log('test-batch50-florida-county-grade-truth-refresh-v1: ok');
