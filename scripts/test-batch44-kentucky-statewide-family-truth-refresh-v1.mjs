import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch44KentuckyStatewideFamilyTruthRefreshV1 } from './run-batch44-kentucky-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch44KentuckyStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/kentucky_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kentucky_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kentucky_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/kentucky_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kentucky_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch44_kentucky_statewide_family_truth_refresh_summary_v1.json');
const probes = readJson('data/generated/batch44_kentucky_official_probe_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kentucky-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Kentucky refresh must final-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Kentucky packet summary must be blocked.');
assert.equal(summary.index_safe, false, 'Kentucky must remain not index-safe.');
assert.equal(summary.completeness_pct, 50, 'Kentucky completeness must reflect the repaired official statewide families while remaining blocked.');
assert.equal(summary.strong_critical_families, 6, 'Kentucky should carry six strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 4, 'Kentucky should retain four weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 2, 'Kentucky should retain two missing critical families after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('medicaid_state_health_coverage').family_status, 'verified_state_grade');
assert.equal(byFamily.get('medicaid_waiver_hcbs_disability_services').family_status, 'verified_state_grade');
assert.equal(byFamily.get('developmental_disability_idd_authority').family_status, 'blocked_js_shell_dd_authority_target_unverified');
assert.equal(byFamily.get('early_intervention_part_c').family_status, 'verified_state_grade');
assert.equal(byFamily.get('special_education_idea_part_b').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_exact_leaf_repair_not_started');
assert.equal(byFamily.get('vocational_rehabilitation_pre_ets').family_status, 'missing_reviewed_vr_or_pre_ets_source');
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'blocked_reviewed_parent_support_source_not_explicit_pti');
assert.equal(byFamily.get('legal_aid').family_status, 'missing_reviewed_statewide_legal_aid_source');
assert.equal(byFamily.get('able_program').family_status, 'verified_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'blocked_generic_or_third_party_local_directory_only');

assert.equal(failureRows.find((row) => row.family === 'developmental_disability_idd_authority').failure_code, 'reviewed_exact_target_only_returns_js_loading_shell');
assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'generic_or_statewide_evidence_used_where_local_required');
assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Kentucky P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'medicaid_state_health_coverage'), 'Kentucky Medicaid must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'medicaid_waiver_hcbs_disability_services'), 'Kentucky waivers must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'early_intervention_part_c'), 'Kentucky early intervention must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'special_education_idea_part_b'), 'Kentucky statewide special education must drop out of the failure ledger.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'developmental_disability_idd_authority',
    'district_or_county_education_routing',
    'vocational_rehabilitation_pre_ets',
    'parent_training_information_center',
    'legal_aid',
    'county_local_disability_resources',
  ],
  'Kentucky next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Kentucky P&A must carry one reviewed KYPA sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').samples[0].source_url, 'https://kypa.net/', 'Kentucky P&A must use the reviewed KYPA final URL.');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Kentucky PTI blocker should preserve the reviewed KY-SPIN sample.');
assert.equal(verifiedByFamily.get('medicaid_state_health_coverage').sample_count, 2, 'Kentucky Medicaid state coverage must carry the reviewed CHFS / DMS sample chain.');
assert.equal(verifiedByFamily.get('medicaid_waiver_hcbs_disability_services').sample_count, 1, 'Kentucky waiver family must carry the reviewed HCBS waiver leaf.');
assert.equal(verifiedByFamily.get('developmental_disability_idd_authority').sample_count, 0, 'Kentucky DD authority must clear the misleading JS-shell sample.');
assert.equal(verifiedByFamily.get('early_intervention_part_c').sample_count, 1, 'Kentucky early intervention must carry the reviewed KEIS leaf.');
assert.equal(verifiedByFamily.get('special_education_idea_part_b').sample_count, 1, 'Kentucky statewide special education must carry the reviewed KDE leaf.');
assert.equal(probes.medicaid.status, 200, 'Kentucky Medicaid probe must preserve the live CHFS / DMS leaf truth.');
assert.equal(probes.specialEducation.status, 200, 'Kentucky KDE probe must preserve the live special-education leaf truth.');
assert.equal(probes.earlyIntervention.status, 200, 'Kentucky Part C probe must preserve the live KEIS leaf truth.');

assert.ok(report.includes('designated protection and advocacy system in Kentucky'), 'Kentucky report must explain the KYPA upgrade.');
assert.ok(report.includes('reviewed live CHFS / DMS leaves now provide role-pure statewide Medicaid authority'), 'Kentucky report must explain the Medicaid upgrade.');
assert.ok(report.includes('reviewed live HCBS Waiver Programs evidence now proves statewide waiver entry'), 'Kentucky report must explain the waiver upgrade.');
assert.ok(report.includes('reviewed exact DBHDID replacement still returns only a loading shell'), 'Kentucky report must explain the remaining DBHDID JS-shell blocker.');
assert.ok(report.includes('reviewed live KDE Exceptional Children and Early Learning leaf now provides a current state special-education authority source'), 'Kentucky report must explain the KDE upgrade.');

assert.equal(batchSummary.classification, 'BLOCKED', 'Kentucky batch summary must report blocked.');
assert.equal(batchSummary.evidence_checks.medicaidProbe.status, 200, 'Kentucky batch summary must preserve the Medicaid live probe.');
assert.equal(batchSummary.evidence_checks.specialEducationProbe.status, 200, 'Kentucky batch summary must preserve the KDE live probe.');

console.log('test-batch44-kentucky-statewide-family-truth-refresh-v1: ok');
