import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch123HawaiiOfficialReplacementRepairV1 } from './run-batch123-hawaii-official-replacement-repair-v1.mjs';

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

const result = generateBatch123HawaiiOfficialReplacementRepairV1();
const summary = readJson('data/generated/hawaii_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/hawaii_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/hawaii_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/hawaii_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/hawaii_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch123_hawaii_official_replacement_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/hawaii-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch123-hawaii-official-replacement-repair-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.missing_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'official_processing_centers_pdf_covers_four_counties_but_kalawao_unresolved');
assert.deepEqual(summary.critical_gap_families, ['county_local_disability_resources']);
assert.deepEqual(summary.major_gap_families, []);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('early_intervention_part_c').family_status, 'verified_state_grade');
assert.equal(byFamily.get('special_education_idea_part_b').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'blocked_official_pdf_covers_four_counties_kalawao_unresolved');

assert.equal(failures.length, 1);
assert.equal(failures[0].family, 'county_local_disability_resources');
assert.equal(failures[0].failure_code, 'official_processing_centers_pdf_covers_four_counties_but_kalawao_unresolved');

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('early_intervention_part_c').sample_count, 2);
assert.equal(verifiedByFamily.get('special_education_idea_part_b').sample_count, 3);
assert.equal(verifiedByFamily.get('district_or_county_education_routing').sample_count, 2);
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 2);
assert.equal(verifiedByFamily.get('county_local_disability_resources').blocker_code, 'official_processing_centers_pdf_covers_four_counties_but_kalawao_unresolved');
assert.ok(verifiedByFamily.get('legal_aid').samples[0].evidence_snippet.includes('staff attorneys can provide legal representation'));
assert.ok(verifiedByFamily.get('district_or_county_education_routing').samples[0].source_url.includes('/complex-area-directory/'));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.equal(nextRows[0].failure_code, 'official_processing_centers_pdf_covers_four_counties_but_kalawao_unresolved');

const hawaiiQueue = queueRows.find((row) => row.state === 'hawaii');
assert.equal(hawaiiQueue.classification, 'BLOCKED');
assert.equal(hawaiiQueue.index_safe, false);
assert.equal(hawaiiQueue.completeness_pct, 91);
assert.equal(hawaiiQueue.primary_gap_reason, 'official_processing_centers_pdf_covers_four_counties_but_kalawao_unresolved');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(
  batchSummary.repaired_families,
  [
    'early_intervention_part_c',
    'special_education_idea_part_b',
    'district_or_county_education_routing',
    'legal_aid',
  ],
);
assert.equal(batchSummary.localOfficeCoverage.unresolvedCounty, 'kalawao-hi');

assert.ok(report.includes('live official EIS site now preserves statewide Part C authority and referral routing'));
assert.ok(report.includes('What is Special Education, Child Find, Special Education Data and Reports, and the Complex Area Directory'));
assert.ok(report.includes('Kalawao County still lacks explicit reviewed county-grade office proof'));
assert.ok(batchReport.includes('remaining_blockers: county_local_disability_resources'));
assert.ok(lessons.includes('### Official Site Search And Current WordPress Leaves Can Replace Dead Legacy Paths Without Broad Rediscovery'));

console.log('test-batch123-hawaii-official-replacement-repair-v1: ok');
