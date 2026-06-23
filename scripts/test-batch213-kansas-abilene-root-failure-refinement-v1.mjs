import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch213KansasAbileneRootFailureRefinementV1 } from './run-batch213-kansas-abilene-root-failure-refinement-v1.mjs';

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

const result = generateBatch213KansasAbileneRootFailureRefinementV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch213_kansas_abilene_root_failure_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch213-kansas-abilene-root-failure-refinement-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'reviewed_kansas_district_owned_leaves_exist_but_full_county_grade_coverage_is_incomplete');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade');
assert.match(gap.status_reason, /Export-backed district domains are useful authoring hints, but they still fail closed/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'reviewed_district_owned_special_education_leaves_exist_but_kansas_county_grade_coverage_is_still_incomplete');
assert.match(failure.evidence, /abileneschools\.org/);
assert.match(failure.evidence, /Page Not Found/);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.sample_count, 6);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'abilene export-backed district root unresolved'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.abileneschools.org/'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory');
assert.match(next.evidence, /abileneschools\.org/);

assert.equal(batchSummary.refined_root, 'https://www.abileneschools.org/');
assert.ok(report.includes('at least one export-backed district root has now been proven to fail closed without a role-exact leaf'));
assert.ok(batchReport.includes('Abilene USD 435 now proves'));
assert.ok(lessons.includes('### Export-Backed District Domains Still Need A Role-Exact Leaf'));

console.log('test-batch213-kansas-abilene-root-failure-refinement-v1: ok');
