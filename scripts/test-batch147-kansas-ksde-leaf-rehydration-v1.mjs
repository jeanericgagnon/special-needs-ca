import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch147KansasKsdeLeafRehydrationV1 } from './run-batch147-kansas-ksde-leaf-rehydration-v1.mjs';

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

const result = generateBatch147KansasKsdeLeafRehydrationV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch147_kansas_ksde_leaf_rehydration_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch147-kansas-ksde-leaf-rehydration-report-v1.md'), 'utf8');
const partCSource = readJson('data/generated/kansas_part_c_reviewed_source_v1.json');
const specialEdSource = readJson('data/generated/kansas_special_education_reviewed_source_v1.json');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 58);
assert.equal(summary.strong_critical_families, 7);
assert.equal(summary.weak_critical_families, 5);
assert.equal(summary.primary_gap_reason, 'kancare_kdads_access_blocked_and_no_county_or_district_education_contract_preserved');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('early_intervention_part_c').family_status, 'verified_state_grade');
assert.equal(byFamily.get('special_education_idea_part_b').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_exact_district_or_county_leafs_unverified');

assert.equal(failures.length, 5);
assert.ok(!failures.some((row) => row.family === 'early_intervention_part_c'));
assert.ok(!failures.some((row) => row.family === 'special_education_idea_part_b'));
assert.equal(
  failures.find((row) => row.family === 'district_or_county_education_routing').failure_code,
  'official_statewide_education_leaves_live_but_no_county_or_district_contract_preserved',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('early_intervention_part_c').sample_count, 1);
assert.equal(verifiedByFamily.get('special_education_idea_part_b').sample_count, 1);
assert.equal(verifiedByFamily.get('district_or_county_education_routing').sample_count, 0);
assert.match(verifiedByFamily.get('special_education_idea_part_b').samples[0].evidence_snippet, /Dispute Resolution/i);
assert.match(verifiedByFamily.get('early_intervention_part_c').samples[0].evidence_snippet, /Part C of the Individuals with Disabilities Education Act/i);

assert.equal(partCSource.final_url, 'https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education');
assert.equal(specialEdSource.final_url, 'https://www.ksde.gov/policy-and-funding/special-education');
assert.match(specialEdSource.evidence_snippet, /Procedural Safeguards/i);

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'medicaid_state_health_coverage',
    'medicaid_waiver_hcbs_disability_services',
    'developmental_disability_idd_authority',
    'district_or_county_education_routing',
    'county_local_disability_resources',
  ],
);

const kansasQueue = queueRows.find((row) => row.state === 'kansas');
assert.equal(kansasQueue.completeness_pct, 58);
assert.equal(kansasQueue.primary_gap_reason, 'kancare_kdads_access_blocked_and_no_county_or_district_education_contract_preserved');

const kansasAudit = audit.states.find((row) => row.stateId === 'kansas');
assert.equal(kansasAudit.completenessPct, 58);
assert.equal(kansasAudit.strongCriticalFamilies, 7);
assert.equal(kansasAudit.weakCriticalFamilies, 5);
assert.equal(kansasAudit.familyStatuses.early_intervention_part_c, 'verified_state_grade');
assert.equal(kansasAudit.familyStatuses.special_education_idea_part_b, 'verified_state_grade');
assert.equal(kansasAudit.familyStatuses.district_or_county_education_routing, 'blocked_exact_district_or_county_leafs_unverified');

assert.equal(batchSummary.completeness_pct, 58);
assert.deepEqual(batchSummary.rehydrated_families, ['early_intervention_part_c', 'special_education_idea_part_b']);
assert.equal(batchSummary.sharpened_blocker, 'district_or_county_education_routing');

assert.ok(report.includes('early intervention and statewide special education are no longer blocked'));
assert.ok(report.includes('county-grade education routing still lacks'));
assert.ok(batchReport.includes('rehydrated_families: early_intervention_part_c, special_education_idea_part_b'));

console.log('test-batch147-kansas-ksde-leaf-rehydration-v1: ok');
