import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch45MissouriStatewideFamilyTruthRefreshV1 } from './run-batch45-missouri-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch45MissouriStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/missouri_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/missouri_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/missouri_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/missouri_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/missouri_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch45_missouri_statewide_family_truth_refresh_summary_v1.json');
const probes = readJson('data/generated/batch45_missouri_official_probe_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/missouri-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Missouri refresh must final-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Missouri packet summary must be blocked.');
assert.equal(summary.index_safe, false, 'Missouri must remain not index-safe.');
assert.equal(summary.completeness_pct, 75, 'Missouri completeness must reflect the repaired First Steps and VR / Pre-ETS statewide families after truth refresh.');
assert.equal(summary.strong_critical_families, 9, 'Missouri should retain nine strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 2, 'Missouri should retain two weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 1, 'Missouri should retain one missing critical family after the truth refresh.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('medicaid_state_health_coverage').family_status, 'verified_state_grade');
assert.equal(byFamily.get('medicaid_waiver_hcbs_disability_services').family_status, 'verified_state_grade');
assert.equal(byFamily.get('developmental_disability_idd_authority').family_status, 'verified_state_grade');
assert.equal(byFamily.get('early_intervention_part_c').family_status, 'verified_state_grade');
assert.equal(byFamily.get('special_education_idea_part_b').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_exact_district_or_county_leafs_unverified');
assert.equal(byFamily.get('vocational_rehabilitation_pre_ets').family_status, 'verified_state_grade');
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'blocked_exact_statewide_pti_source_access_blocked');
assert.equal(byFamily.get('legal_aid').family_status, 'missing_reviewed_statewide_legal_aid_source');
assert.equal(byFamily.get('able_program').family_status, 'verified_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'verified_state_grade');

assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'generic_or_statewide_evidence_used_where_local_required');
assert.equal(failureRows.find((row) => row.family === 'parent_training_information_center').failure_code, 'reviewed_exact_statewide_pti_target_access_blocked');
assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Missouri P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'county_local_disability_resources'), 'Missouri county-local family must drop out of the failure ledger after the reviewed regional-office repair.');
assert.ok(!failureRows.some((row) => row.family === 'early_intervention_part_c'), 'Missouri First Steps must drop out of the failure ledger after the DESE repair.');
assert.ok(!failureRows.some((row) => row.family === 'vocational_rehabilitation_pre_ets'), 'Missouri VR / Pre-ETS must drop out of the failure ledger after the DESE repair.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'parent_training_information_center',
    'legal_aid',
  ],
  'Missouri next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('medicaid_state_health_coverage').sample_count, 2, 'Missouri Medicaid must preserve the repaired DSS leaves.');
assert.equal(verifiedByFamily.get('developmental_disability_idd_authority').sample_count, 2, 'Missouri DD authority must preserve the repaired DMH leaves.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Missouri P&A must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').samples[0].source_url, 'https://www.moadvocacy.org/', 'Missouri P&A must use the reviewed moadvocacy final URL.');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Missouri PTI blocker should preserve the blocked exact target sample.');
assert.equal(verifiedByFamily.get('early_intervention_part_c').sample_count, 1, 'Missouri early intervention must carry the reviewed First Steps leaf.');
assert.equal(verifiedByFamily.get('vocational_rehabilitation_pre_ets').sample_count, 2, 'Missouri VR / Pre-ETS must carry the reviewed VR and Youth Services leaves.');

assert.equal(probes.medicaidHealthcare.status, 200, 'Missouri Medicaid healthcare probe must preserve the live exact leaf.');
assert.equal(probes.ddWaiverEnrollment.status, 200, 'Missouri DD waiver enrollment probe must preserve the live exact leaf.');
assert.equal(probes.specialEducation.status, 200, 'Missouri DESE special-education probe must preserve the live exact leaf.');
assert.equal(probes.desePartCGuess.status, 200, 'Missouri First Steps probe must preserve the live exact leaf.');
assert.equal(probes.vrMain.status, 200, 'Missouri VR probe must preserve the live exact leaf.');
assert.equal(probes.vrYouthServices.status, 200, 'Missouri Youth Services probe must preserve the live exact leaf.');
assert.equal(probes.ptiBlocked.status, 403, 'Missouri PTI probe must preserve the blocked first-party target.');
assert.equal(probes.legacyDdRoot.status, 0, 'Missouri legacy DD root probe must preserve the dead-root truth.');

assert.ok(report.includes('exact live DSS Healthcare and Medicaid Annual Renewals leaves'), 'Missouri report must explain the Medicaid repair.');
assert.ok(report.includes('dead dhhs.missouri.gov packet roots'), 'Missouri report must explain the dead legacy DD roots.');
assert.ok(report.includes('exact Office of Special Education leaf'), 'Missouri report must explain the special-education repair.');
assert.ok(report.includes('reviewed live First Steps leaf now proves Part C'), 'Missouri report must explain the First Steps repair.');
assert.ok(report.includes('reviewed DESE Vocational Rehabilitation and Youth Services leaves now provide statewide VR routing'), 'Missouri report must explain the VR / Pre-ETS repair.');
assert.ok(report.includes('redirected to missouriparentsact.org and returned HTTP 403'), 'Missouri report must explain the PTI block.');
assert.ok(report.includes('no reviewed district-owned or county-grade special-education leaves'), 'Missouri report must explain the district-routing blocker.');

assert.equal(batchSummary.classification, 'BLOCKED', 'Missouri batch summary must report blocked.');
assert.equal(batchSummary.evidence_checks.ptiBlocked.status, 403, 'Missouri batch summary must preserve the PTI blocked evidence.');

console.log('test-batch45-missouri-statewide-family-truth-refresh-v1: ok');
