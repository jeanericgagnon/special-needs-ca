import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch46KansasStatewideFamilyTruthRefreshV1 } from './run-batch46-kansas-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch46KansasStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch46_kansas_statewide_family_truth_refresh_summary_v1.json');
const probes = readJson('data/generated/batch46_kansas_official_probe_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Kansas refresh must final-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Kansas packet summary must be blocked.');
assert.equal(summary.index_safe, false, 'Kansas must remain not index-safe.');
assert.equal(summary.completeness_pct, 50, 'Kansas completeness must reflect six strong critical families after truth refresh.');
assert.equal(summary.strong_critical_families, 6, 'Kansas should retain six strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 5, 'Kansas should retain five weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 1, 'Kansas should retain one missing critical family after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('medicaid_state_health_coverage').family_status, 'blocked_live_medicaid_source_access_denied');
assert.equal(byFamily.get('medicaid_waiver_hcbs_disability_services').family_status, 'blocked_live_waiver_source_access_denied');
assert.equal(byFamily.get('developmental_disability_idd_authority').family_status, 'blocked_live_dd_authority_source_access_denied');
assert.equal(byFamily.get('early_intervention_part_c').family_status, 'missing_reviewed_role_aligned_part_c_source');
assert.equal(byFamily.get('special_education_idea_part_b').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_exact_district_or_county_leafs_unverified');
assert.equal(byFamily.get('vocational_rehabilitation_pre_ets').family_status, 'verified_state_grade');
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');
assert.equal(byFamily.get('able_program').family_status, 'verified_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'blocked_live_county_locator_source_dead_or_access_denied');

assert.equal(failureRows.length, 6, 'Kansas should collapse to six real current blockers.');
assert.equal(failureRows.find((row) => row.family === 'medicaid_state_health_coverage').failure_code, 'reviewed_exact_medicaid_root_access_blocked');
assert.equal(failureRows.find((row) => row.family === 'medicaid_waiver_hcbs_disability_services').failure_code, 'reviewed_exact_waiver_leaf_access_blocked');
assert.equal(failureRows.find((row) => row.family === 'developmental_disability_idd_authority').failure_code, 'legacy_dd_root_dead_and_reviewed_replacement_access_blocked');
assert.equal(failureRows.find((row) => row.family === 'early_intervention_part_c').failure_code, 'legacy_early_intervention_source_dead_and_no_reviewed_replacement');
assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'generic_or_statewide_evidence_used_where_local_required');
assert.equal(failureRows.find((row) => row.family === 'county_local_disability_resources').failure_code, 'legacy_county_locator_dead_and_reviewed_replacement_access_blocked');
assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Kansas P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'), 'Kansas PTI must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'), 'Kansas legal aid must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'vocational_rehabilitation_pre_ets'), 'Kansas VR must drop out of the failure ledger.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'medicaid_state_health_coverage',
    'medicaid_waiver_hcbs_disability_services',
    'developmental_disability_idd_authority',
    'early_intervention_part_c',
    'district_or_county_education_routing',
    'county_local_disability_resources',
  ],
  'Kansas next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('medicaid_state_health_coverage').sample_count, 0, 'Kansas Medicaid must clear the mixed-family packet samples.');
assert.equal(verifiedByFamily.get('medicaid_waiver_hcbs_disability_services').sample_count, 0, 'Kansas waiver family must clear the blocked sample chain.');
assert.equal(verifiedByFamily.get('developmental_disability_idd_authority').sample_count, 0, 'Kansas DD authority must clear the dead/blocked packet sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Kansas P&A must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Kansas PTI must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1, 'Kansas legal aid must carry one reviewed live sample.');
assert.equal(verifiedByFamily.get('vocational_rehabilitation_pre_ets').sample_count, 1, 'Kansas VR must carry one reviewed live sample.');

assert.equal(probes.kancare.status, 403, 'Kansas Medicaid probe must preserve the access-block truth.');
assert.equal(probes.kdadsRoot.status, 403, 'Kansas KDADS root probe must preserve the access-block truth.');
assert.equal(probes.legacyDdRoot.status, 0, 'Kansas legacy DD root probe must preserve the dead-root truth.');
assert.equal(probes.ksdeSpecialEducation.status, 200, 'Kansas special-education probe must preserve the live exact leaf.');
assert.equal(probes.dcfRehab.status, 200, 'Kansas VR probe must preserve the live DCF rehabilitation root.');
assert.equal(probes.kansasLegalServices.status, 200, 'Kansas legal-aid probe must preserve the live KLS root.');

assert.ok(report.includes('federally designated PTI'), 'Kansas report must explain the PTI upgrade.');
assert.ok(report.includes('challenge-blocked 403 pages'), 'Kansas report must explain the blocked official Medicaid/KDADS stack.');
assert.ok(report.includes('Kansas Legal Services'), 'Kansas report must explain the legal-aid upgrade.');
assert.ok(report.includes('District-or-county education routing remains blocked') || report.includes('district-or-county education routing remains blocked'), 'Kansas report must explain the district-routing blocker.');

assert.ok(lessons.includes('### Explicit First-Party Designation Text Can Resolve Statewide Support Families'), 'Kansas refresh must record the new statewide-support designation lesson.');

assert.equal(batchSummary.classification, 'BLOCKED', 'Kansas batch summary must report blocked.');
assert.equal(batchSummary.evidence_checks.kancare.status, 403, 'Kansas batch summary must preserve the KanCare blocked evidence.');

console.log('test-batch46-kansas-statewide-family-truth-refresh-v1: ok');
