import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch43NewMexicoStatewideFamilyTruthRefreshV1 } from './run-batch43-new-mexico-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch43NewMexicoStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/new-mexico_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-mexico_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-mexico_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/new-mexico_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-mexico_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-mexico-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'New Mexico refresh must final-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'New Mexico packet summary must be blocked.');
assert.equal(summary.index_safe, false, 'New Mexico must remain not index-safe.');
assert.equal(summary.completeness_pct, 41, 'New Mexico completeness must reflect only the five strong critical families.');
assert.equal(summary.strong_critical_families, 5, 'New Mexico should retain five strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 4, 'New Mexico should retain four weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 3, 'New Mexico should retain three missing critical families after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('medicaid_state_health_coverage').family_status, 'blocked_live_medicaid_replacement_not_yet_reviewed');
assert.equal(byFamily.get('medicaid_waiver_hcbs_disability_services').family_status, 'verified_state_grade');
assert.equal(byFamily.get('developmental_disability_idd_authority').family_status, 'verified_state_grade');
assert.equal(byFamily.get('early_intervention_part_c').family_status, 'missing_reviewed_role_aligned_part_c_source');
assert.equal(byFamily.get('special_education_idea_part_b').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_exact_district_or_county_leafs_unverified');
assert.equal(byFamily.get('vocational_rehabilitation_pre_ets').family_status, 'missing_reviewed_vr_or_pre_ets_source');
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'blocked_reviewed_parent_support_source_lacks_explicit_pti_designation');
assert.equal(byFamily.get('legal_aid').family_status, 'missing_reviewed_statewide_legal_aid_source');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'blocked_generic_or_third_party_local_directory_only');

assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'New Mexico P&A must drop out of the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'medicaid_state_health_coverage').failure_code, 'legacy_medicaid_samples_dead_or_wrong_family');
assert.equal(failureRows.find((row) => row.family === 'early_intervention_part_c').failure_code, 'legacy_early_intervention_source_dead_and_no_reviewed_replacement');
assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'generic_or_statewide_evidence_used_where_local_required');
assert.equal(failureRows.find((row) => row.family === 'parent_training_information_center').failure_code, 'reviewed_statewide_parent_support_source_not_explicit_pti');
assert.equal(failureRows.find((row) => row.family === 'legal_aid').failure_code, 'missing_required_source_family');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'medicaid_state_health_coverage',
    'early_intervention_part_c',
    'district_or_county_education_routing',
    'vocational_rehabilitation_pre_ets',
    'parent_training_information_center',
    'legal_aid',
    'county_local_disability_resources',
  ],
  'New Mexico next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'New Mexico P&A must carry one reviewed DRNM sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').samples[0].source_url, 'https://drnm.org/', 'New Mexico P&A must use the reviewed DRNM final URL.');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'New Mexico PTI blocker should preserve the reviewed statewide parent-support sample.');
assert.equal(verifiedByFamily.get('medicaid_state_health_coverage').sample_count, 0, 'New Mexico Medicaid state coverage must not preserve dead or mixed-family samples.');
assert.equal(verifiedByFamily.get('early_intervention_part_c').sample_count, 0, 'New Mexico Early Intervention must not preserve the dead dhhs sample.');
assert.equal(verifiedByFamily.get('district_or_county_education_routing').sample_count, 0, 'New Mexico district routing must clear misleading generic PED-root sample rows.');
assert.equal(verifiedByFamily.get('special_education_idea_part_b').samples[0].source_url, 'https://webnew.ped.state.nm.us/bureaus/special-education/', 'New Mexico statewide special-education sample must use the PED bureau page URL.');

assert.ok(report.includes('DRNM is the federally mandated protection and advocacy system for New Mexico'), 'New Mexico report must explain the DRNM statewide P&A upgrade.');
assert.ok(report.includes('Family-to-Family healthcare information center scope'), 'New Mexico report must explain why Parents Reaching Out does not yet satisfy PTI.');
assert.ok(report.includes('the legacy MAD URL now returns http_404'), 'New Mexico report must explain why the old Medicaid chain was downgraded.');
assert.ok(report.includes('the bounded official PED Special Education Bureau checks timed out'), 'New Mexico report must explain the district-routing blocker.');

console.log('test-batch43-new-mexico-statewide-family-truth-refresh-v1: ok');
