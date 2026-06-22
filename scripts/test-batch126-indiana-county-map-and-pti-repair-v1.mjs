import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch126IndianaCountyMapAndPtiRepairV1 } from './run-batch126-indiana-county-map-and-pti-repair-v1.mjs';

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

const result = generateBatch126IndianaCountyMapAndPtiRepairV1();
const summary = readJson('data/generated/indiana_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/indiana_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/indiana_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/indiana_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/indiana_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch126_indiana_county_map_and_pti_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/indiana-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch126-indiana-county-map-and-pti-repair-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.missing_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'official_special_education_contact_list_link_410_and_school_directory_not_role_specific');
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing']);
assert.deepEqual(summary.major_gap_families, []);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'verified_county_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_official_contact_list_gone_generic_directory_insufficient');

assert.equal(failures.length, 1);
assert.equal(failures[0].family, 'district_or_county_education_routing');
assert.equal(failures[0].failure_code, 'official_special_education_contact_list_link_410_and_school_directory_not_role_specific');

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 3);
assert.ok(verifiedByFamily.get('parent_training_information_center').samples[0].evidence_snippet.includes('Indiana PTI IN*SOURCE'));
assert.equal(verifiedByFamily.get('county_local_disability_resources').sample_count, 3);
assert.ok(verifiedByFamily.get('county_local_disability_resources').samples[1].evidence_snippet.includes('1145 Bollman St.'));
assert.ok(verifiedByFamily.get('county_local_disability_resources').samples[2].evidence_snippet.includes('Marion County DFR Office'));
assert.equal(verifiedByFamily.get('district_or_county_education_routing').blocker_code, 'official_special_education_contact_list_link_410_and_school_directory_not_role_specific');

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'district_or_county_education_routing');

const indianaQueue = queueRows.find((row) => row.state === 'indiana');
assert.equal(indianaQueue.classification, 'BLOCKED');
assert.equal(indianaQueue.index_safe, false);
assert.equal(indianaQueue.completeness_pct, 91);
assert.equal(indianaQueue.primary_gap_reason, 'official_special_education_contact_list_link_410_and_school_directory_not_role_specific');

assert.deepEqual(batchSummary.repaired_families, ['parent_training_information_center', 'county_local_disability_resources']);
assert.deepEqual(batchSummary.remaining_blockers, ['district_or_county_education_routing']);

assert.ok(report.includes('Parent Center Hub’s Indiana state leaf explicitly identifies IN*SOURCE as the Indiana PTI'));
assert.ok(report.includes('county-by-county office details directly in the fetched HTML for all 92 counties'));
assert.ok(report.includes('Special Education Director and Local Administrator Contact List now resolves to a dead Google Sheets target'));
assert.ok(batchReport.includes('remaining_blockers: district_or_county_education_routing'));
assert.ok(lessons.includes('### Embedded County-Map Content Can Still Count Even When The Child County Hrefs 404'));

console.log('test-batch126-indiana-county-map-and-pti-repair-v1: ok');
