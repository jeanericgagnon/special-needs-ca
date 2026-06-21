import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch48IowaStatewideFamilyTruthRefreshV1 } from './run-batch48-iowa-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch48IowaStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/iowa_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/iowa_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/iowa_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/iowa_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/iowa_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch48_iowa_statewide_family_truth_refresh_summary_v1.json');
const probes = readJson('data/generated/batch48_iowa_official_probe_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/iowa-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Iowa refresh must final-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Iowa packet summary must be blocked.');
assert.equal(summary.index_safe, false, 'Iowa must remain not index-safe.');
assert.equal(summary.completeness_pct, 83, 'Iowa completeness must reflect ten strong critical families after truth refresh.');
assert.equal(summary.strong_critical_families, 10, 'Iowa should retain ten strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 2, 'Iowa should retain two weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 0, 'Iowa should eliminate stale missing statewide support families except the reviewed PTI blocker.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('medicaid_state_health_coverage').family_status, 'verified_state_grade');
assert.equal(byFamily.get('medicaid_waiver_hcbs_disability_services').family_status, 'verified_state_grade');
assert.equal(byFamily.get('developmental_disability_idd_authority').family_status, 'verified_state_grade');
assert.equal(byFamily.get('early_intervention_part_c').family_status, 'verified_state_grade');
assert.equal(byFamily.get('special_education_idea_part_b').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_exact_district_or_county_leafs_unverified');
assert.equal(byFamily.get('vocational_rehabilitation_pre_ets').family_status, 'verified_state_grade');
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'blocked_reviewed_first_party_support_without_explicit_pti_designation');
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'verified_state_grade');

assert.equal(failureRows.length, 2, 'Iowa should collapse to two real current blockers.');
assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'generic_or_statewide_evidence_used_where_local_required');
assert.equal(failureRows.find((row) => row.family === 'parent_training_information_center').failure_code, 'reviewed_first_party_support_source_lacks_explicit_pti_designation');
assert.ok(!failureRows.some((row) => row.family === 'county_local_disability_resources'), 'Iowa county-local routing must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Iowa P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'), 'Iowa legal aid must drop out of the failure ledger.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'parent_training_information_center',
  ],
  'Iowa next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('county_local_disability_resources').sample_count, 1, 'Iowa county-local family should carry the official HHS office-locations leaf.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Iowa P&A must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Iowa PTI blocker must preserve the reviewed ASK first-party sample.');
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1, 'Iowa legal aid must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('vocational_rehabilitation_pre_ets').sample_count, 1, 'Iowa VR must carry one reviewed live sample.');

assert.equal(probes.hhsRoot.status, 200, 'Iowa HHS root probe must preserve the live official root.');
assert.equal(probes.officeLocations.status, 200, 'Iowa office-locations probe must preserve the structured county coverage leaf.');
assert.equal(probes.vocationalRehab.status, 200, 'Iowa VR probe must preserve the live official VR route.');
assert.equal(probes.protectionAndAdvocacy.status, 200, 'Iowa P&A probe must preserve the live first-party root.');
assert.equal(probes.pti.status, 200, 'Iowa PTI probe must preserve the reviewed ASK first-party page.');
assert.equal(probes.legalAid.status, 200, 'Iowa legal-aid probe must preserve the live first-party root.');

assert.ok(report.includes('county office entries like Adair County HHS'), 'Iowa report must explain the county-local upgrade.');
assert.ok(report.includes('ASK Resource Center is preserved as real first-party family-support evidence'), 'Iowa report must explain the PTI blocker truthfully.');
assert.ok(report.includes('workforce.iowa.gov/vr'), 'Iowa report must explain the VR upgrade.');
assert.ok(report.includes('district-owned or county-grade special-education routing leaf'), 'Iowa report must explain the district-routing blocker.');

assert.equal(batchSummary.classification, 'BLOCKED', 'Iowa batch summary must report blocked.');
assert.equal(batchSummary.evidence_checks.officeLocations.status, 200, 'Iowa batch summary must preserve the county-local upgrade evidence.');
assert.equal(batchSummary.evidence_checks.pti.status, 200, 'Iowa batch summary must preserve the reviewed ASK PTI blocker evidence.');

console.log('test-batch48-iowa-statewide-family-truth-refresh-v1: ok');
