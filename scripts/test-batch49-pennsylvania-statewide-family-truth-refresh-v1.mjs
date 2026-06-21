import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch49PennsylvaniaStatewideFamilyTruthRefreshV1 } from './run-batch49-pennsylvania-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch49PennsylvaniaStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/pennsylvania_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/pennsylvania_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/pennsylvania_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/pennsylvania_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/pennsylvania_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch49_pennsylvania_statewide_family_truth_refresh_summary_v1.json');
const probes = readJson('data/generated/batch49_pennsylvania_official_probe_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/pennsylvania-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE', 'Pennsylvania refresh must complete the state.');
assert.equal(summary.classification, 'COMPLETE', 'Pennsylvania packet summary must be complete.');
assert.equal(summary.index_safe, true, 'Pennsylvania must become index-safe.');
assert.equal(summary.completeness_pct, 100, 'Pennsylvania completeness must rise to 100 after the final two family repairs.');
assert.equal(summary.strong_critical_families, 12, 'Pennsylvania should carry twelve strong critical families.');
assert.equal(summary.weak_critical_families, 0, 'Pennsylvania should have no weak critical families.');
assert.equal(summary.missing_critical_families, 0, 'Pennsylvania should have no missing critical families.');
assert.equal(summary.recommended_batch, 'complete_maintain', 'Pennsylvania should move to maintenance-only batch posture.');
assert.equal(summary.complete_ready, true, 'Pennsylvania should be ready for complete maintenance.');
assert.equal(summary.final_blockers, null, 'Pennsylvania should have no final blockers after the repair.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');
assert.ok(
  byFamily.get('district_or_county_education_routing').status_reason.includes('Scranton City School District'),
  'Pennsylvania education routing must cite the new district-owned Lackawanna evidence.',
);
assert.ok(
  byFamily.get('legal_aid').status_reason.includes('Pennsylvania Health Law Project'),
  'Pennsylvania legal aid must cite the reviewed first-party statewide legal-aid route.',
);

assert.equal(failureRows.length, 0, 'Pennsylvania must clear the failure ledger.');
assert.equal(nextRows.length, 1, 'Pennsylvania should collapse to one maintenance next action.');
assert.equal(nextRows[0].family, 'maintenance', 'Pennsylvania next action queue should be maintenance-only.');
assert.equal(nextRows[0].failure_code, 'complete_maintain_truth_only', 'Pennsylvania maintenance row should preserve the complete-maintain code.');

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('district_or_county_education_routing').family_status, 'verified_state_grade');
assert.equal(verifiedByFamily.get('district_or_county_education_routing').sample_count, 23, 'Pennsylvania education routing should carry the three new district-owned samples plus the prior reviewed IU chain.');
assert.equal(verifiedByFamily.get('legal_aid').family_status, 'verified_state_grade');
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 2, 'Pennsylvania legal aid must carry two reviewed first-party PHLP samples.');
assert.equal(verifiedByFamily.get('legal_aid').blocker_code, null, 'Pennsylvania legal aid must clear the blocker code.');

assert.equal(probes.lackawannaDistrict.status, 200, 'Pennsylvania Lackawanna district probe must stay live.');
assert.equal(probes.susquehannaDistrict.status, 200, 'Pennsylvania Susquehanna district probe must stay live.');
assert.equal(probes.wayneDistrict.status, 200, 'Pennsylvania Wayne district probe must stay live.');
assert.equal(probes.legalAidHome.status, 200, 'Pennsylvania legal-aid home probe must stay live.');
assert.equal(probes.legalAidHelp.status, 200, 'Pennsylvania legal-aid intake probe must stay live.');

assert.ok(report.includes('Pennsylvania is therefore California-grade COMPLETE and index-safe'), 'Pennsylvania report must declare the truthful complete state.');
assert.ok(report.includes('https://www.scrsd.org/departments/special-education'), 'Pennsylvania report must include the Scranton district-owned leaf.');
assert.ok(report.includes('https://www.scschools.org/special-ed/child-find'), 'Pennsylvania report must include the Susquehanna district-owned leaf.');
assert.ok(report.includes('https://www.wallenpaupack.org/departments/special-education'), 'Pennsylvania report must include the Wayne district-owned leaf.');
assert.ok(report.includes('https://www.phlp.org/en/get-legal-help'), 'Pennsylvania report must include the reviewed PHLP legal-aid page.');

assert.equal(batchSummary.classification, 'COMPLETE', 'Pennsylvania batch summary must report COMPLETE.');
assert.deepEqual(
  batchSummary.upgraded_families,
  ['district_or_county_education_routing', 'legal_aid'],
  'Pennsylvania batch summary must report the two repaired families.',
);

console.log('test-batch49-pennsylvania-statewide-family-truth-refresh-v1: ok');
