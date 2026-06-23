import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch74MontanaStatewideFamilyTruthRefreshV1 } from './run-batch74-montana-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch74MontanaStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/montana_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/montana_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/montana_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/montana_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/montana_verified_sources_v1.jsonl');
const priorityRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch74_montana_statewide_family_truth_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/montana-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch74-montana-statewide-family-truth-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE', 'Montana should now complete.');
assert.equal(summary.classification, 'COMPLETE', 'Montana packet summary must now be complete.');
assert.equal(summary.index_safe, true, 'Montana must now be index-safe.');
assert.equal(summary.completeness_pct, 100, 'Montana completeness must reach 100.');
assert.equal(summary.strong_critical_families, 12, 'Montana should now have all critical families strong.');
assert.equal(summary.weak_critical_families, 0, 'Montana should have no weak critical families.');
assert.equal(summary.missing_critical_families, 0, 'Montana should have no missing critical families.');
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.equal(summary.complete_ready, true, 'Montana should now be complete-ready.');
assert.equal(summary.final_blockers, null, 'Montana should no longer report final blockers.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'verified_county_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'verified_county_grade');
assert.match(byFamily.get('protection_and_advocacy').status_reason, /explicit statewide P&A designation text/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /56 Montana counties/i);
assert.match(byFamily.get('county_local_disability_resources').status_reason, /all 56 counties/i);

assert.equal(failureRows.length, 0, 'Montana failure ledger should be empty after completion.');
assert.equal(nextRows.length, 0, 'Montana next-action queue should be empty after completion.');

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 2, 'Montana P&A must preserve two reviewed first-party samples.');
assert.equal(verifiedByFamily.get('district_or_county_education_routing').sample_count, 3, 'Montana education routing must preserve three reviewed official directory samples.');
assert.equal(verifiedByFamily.get('county_local_disability_resources').sample_count, 2, 'Montana county-local routing must preserve two reviewed official office samples.');
assert.match(verifiedByFamily.get('protection_and_advocacy').samples[0].evidence_snippet, /federally-mandated civil rights protection and advocacy system for Montana/i);
assert.match(verifiedByFamily.get('protection_and_advocacy').samples[1].evidence_snippet, /designated statewide Protection and Advocacy system for Montana/i);
assert.match(verifiedByFamily.get('district_or_county_education_routing').samples[1].evidence_snippet, /enumerates all 56 Montana counties/i);
assert.match(verifiedByFamily.get('county_local_disability_resources').samples[0].evidence_snippet, /lists all 56 Montana counties/i);

assert.ok(report.includes('Montana is now `COMPLETE` and `index_safe=true`.'), 'Montana report must state completion explicitly.');
assert.ok(report.includes('federally mandated protection and advocacy system for Montana'), 'Montana report must preserve the P&A designation evidence.');
assert.ok(report.includes('public county search page that visibly enumerates all 56 counties'), 'Montana report must preserve the county-keyed OPI evidence.');
assert.ok(report.includes('old `https://dphhs.mt.gov/locations` placeholder is now a hard 404'), 'Montana report must preserve the stale-root replacement lesson.');
assert.ok(batchReport.includes('Montana is now `COMPLETE` and `index_safe=true`.'), 'Batch report should match the state report.');

assert.deepEqual(batchSummary.repaired_families, [
  'district_or_county_education_routing',
  'protection_and_advocacy',
  'county_local_disability_resources',
]);
assert.deepEqual(batchSummary.remaining_blockers, []);
assert.equal(batchSummary.index_safe, true);
assert.equal(batchSummary.evidence_checks.staleLocations404.status, 404, 'Montana summary must preserve the stale DPHHS locations 404 evidence.');

const priorityRow = priorityRows.find((row) => row.state === 'montana');
assert.equal(priorityRow.classification, 'COMPLETE');
assert.equal(priorityRow.index_safe, true);
assert.equal(priorityRow.completeness_pct, 100);
assert.equal(priorityRow.weak_critical_families, 0);
assert.equal(priorityRow.missing_critical_families, 0);
assert.equal(priorityRow.primary_gap_reason, 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence');
assert.equal(priorityRow.recommended_batch, 'complete_maintain');
assert.equal(priorityRow.repair_lane, 'maintain_truth_only');

console.log('test-batch74-montana-statewide-family-truth-refresh-v1: ok');
