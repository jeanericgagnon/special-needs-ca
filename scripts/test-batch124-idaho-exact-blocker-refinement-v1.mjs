import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch124IdahoExactBlockerRefinementV1 } from './run-batch124-idaho-exact-blocker-refinement-v1.mjs';

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

const result = generateBatch124IdahoExactBlockerRefinementV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch124_idaho_exact_blocker_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch124-idaho-exact-blocker-refinement-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 2);
assert.equal(summary.missing_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'official_sde_special_education_stack_has_no_district_directory_or_local_leaves');
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing', 'county_local_disability_resources']);
assert.deepEqual(summary.major_gap_families, []);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_no_district_owned_or_county_mapped_leaves');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'blocked_named_office_leaves_only_partial_county_coverage');

assert.equal(failures.length, 2);
assert.equal(failures[0].family, 'district_or_county_education_routing');
assert.equal(failures[0].failure_code, 'official_sde_special_education_stack_has_no_district_directory_or_local_leaves');
assert.equal(failures[1].family, 'county_local_disability_resources');
assert.equal(failures[1].failure_code, 'official_dhw_offices_directory_repairs_named_offices_but_27_counties_still_use_storefront_placeholders');

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 2);
assert.ok(verifiedByFamily.get('parent_training_information_center').samples[0].evidence_snippet.includes('Parent Training and Information Center'));
assert.equal(verifiedByFamily.get('district_or_county_education_routing').blocker_code, 'official_sde_special_education_stack_has_no_district_directory_or_local_leaves');
assert.equal(verifiedByFamily.get('county_local_disability_resources').blocker_code, 'official_dhw_offices_directory_repairs_named_offices_but_27_counties_still_use_storefront_placeholders');

assert.equal(nextRows.length, 2);
assert.deepEqual(nextRows.map((row) => row.family), ['district_or_county_education_routing', 'county_local_disability_resources']);

const idahoQueue = queueRows.find((row) => row.state === 'idaho');
assert.equal(idahoQueue.classification, 'BLOCKED');
assert.equal(idahoQueue.index_safe, false);
assert.equal(idahoQueue.completeness_pct, 83);
assert.equal(idahoQueue.primary_gap_reason, 'official_sde_special_education_stack_has_no_district_directory_or_local_leaves');

assert.deepEqual(batchSummary.repaired_families, ['parent_training_information_center']);
assert.deepEqual(batchSummary.sharpened_blockers, ['district_or_county_education_routing', 'county_local_disability_resources']);
assert.equal(batchSummary.officeCoverage.namedOfficeRows, 18);
assert.equal(batchSummary.officeCoverage.storefrontPlaceholderRows, 27);

assert.ok(report.includes('Idaho Parent Training and Information Center'));
assert.ok(report.includes('the Idaho Schools page exposes no district entries'));
assert.ok(report.includes('27 storefront placeholders'));
assert.ok(batchReport.includes('repaired_families: parent_training_information_center'));
assert.ok(lessons.includes('### Idaho-Type Pattern: Official Sitemaps Can Expose Exact Office Leaves Even When The Visible Directory Only Looks Like One Generic Locator'));

console.log('test-batch124-idaho-exact-blocker-refinement-v1: ok');
