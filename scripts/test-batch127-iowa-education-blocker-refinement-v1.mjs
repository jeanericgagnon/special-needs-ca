import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch127IowaEducationBlockerRefinementV1 } from './run-batch127-iowa-education-blocker-refinement-v1.mjs';

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

const result = generateBatch127IowaEducationBlockerRefinementV1();
const summary = readJson('data/generated/iowa_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/iowa_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/iowa_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/iowa_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/iowa_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch127_iowa_education_blocker_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/iowa-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch127-iowa-education-blocker-refinement-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.primary_gap_reason, 'official_iowa_district_maps_and_aea_structures_expose_no_district_owned_special_education_leaves');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_structural_statewide_maps_only');

assert.equal(failures.length, 1);
assert.equal(failures[0].family, 'district_or_county_education_routing');
assert.equal(failures[0].failure_code, 'official_iowa_district_maps_and_aea_structures_expose_no_district_owned_special_education_leaves');

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('district_or_county_education_routing').blocker_code, 'official_iowa_district_maps_and_aea_structures_expose_no_district_owned_special_education_leaves');
assert.equal(verifiedByFamily.get('district_or_county_education_routing').sample_count, 4);
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].next_action, 'hold_blocked_until_reviewed_district_owned_special_education_leaves_are_authored');

const iowaQueue = queueRows.find((row) => row.state === 'iowa');
assert.equal(iowaQueue.primary_gap_reason, 'official_iowa_district_maps_and_aea_structures_expose_no_district_owned_special_education_leaves');

assert.equal(batchSummary.refined_family, 'district_or_county_education_routing');
assert.ok(report.includes('district-maps page only exposes statewide map and geodata artifacts'));
assert.ok(batchReport.includes('refined_family: district_or_county_education_routing'));

console.log('test-batch127-iowa-education-blocker-refinement-v1: ok');
