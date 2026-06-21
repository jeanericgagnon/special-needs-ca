import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch47NebraskaStatewideFamilyTruthRefreshV1 } from './run-batch47-nebraska-statewide-family-truth-refresh-v1.mjs';

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

const result = generateBatch47NebraskaStatewideFamilyTruthRefreshV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch47_nebraska_statewide_family_truth_refresh_summary_v1.json');
const probes = readJson('data/generated/batch47_nebraska_official_probe_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED', 'Nebraska refresh must final-block the state.');
assert.equal(summary.classification, 'BLOCKED', 'Nebraska packet summary must be blocked.');
assert.equal(summary.index_safe, false, 'Nebraska must remain not index-safe.');
assert.equal(summary.completeness_pct, 83, 'Nebraska completeness must reflect ten strong critical families after truth refresh.');
assert.equal(summary.strong_critical_families, 10, 'Nebraska should retain ten strong critical families after the truth refresh.');
assert.equal(summary.weak_critical_families, 2, 'Nebraska should retain two weak critical families after the truth refresh.');
assert.equal(summary.missing_critical_families, 0, 'Nebraska should eliminate stale missing statewide support families.');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('medicaid_state_health_coverage').family_status, 'verified_state_grade');
assert.equal(byFamily.get('medicaid_waiver_hcbs_disability_services').family_status, 'verified_state_grade');
assert.equal(byFamily.get('developmental_disability_idd_authority').family_status, 'verified_state_grade');
assert.equal(byFamily.get('early_intervention_part_c').family_status, 'verified_state_grade');
assert.equal(byFamily.get('special_education_idea_part_b').family_status, 'verified_state_grade');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_exact_district_or_county_leafs_unverified');
assert.equal(byFamily.get('vocational_rehabilitation_pre_ets').family_status, 'verified_state_grade');
assert.equal(byFamily.get('protection_and_advocacy').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'blocked_official_interactive_locator_not_reviewed_county_grade');

assert.equal(failureRows.length, 2, 'Nebraska should collapse to the two real current blockers.');
assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'generic_or_statewide_evidence_used_where_local_required');
assert.equal(failureRows.find((row) => row.family === 'county_local_disability_resources').failure_code, 'official_interactive_locator_not_reviewed_county_grade');
assert.ok(!failureRows.some((row) => row.family === 'vocational_rehabilitation_pre_ets'), 'Nebraska VR must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'), 'Nebraska P&A must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'), 'Nebraska PTI must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'), 'Nebraska legal aid must drop out of the failure ledger.');
assert.ok(!failureRows.some((row) => row.family === 'early_intervention_part_c'), 'Nebraska EDN must drop out of the failure ledger.');

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'county_local_disability_resources',
  ],
  'Nebraska next actions must collapse to the real current blockers.',
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('medicaid_state_health_coverage').sample_count, 2, 'Nebraska Medicaid should carry the reviewed DHHS Medicaid sample chain.');
assert.equal(verifiedByFamily.get('early_intervention_part_c').sample_count, 1, 'Nebraska EDN should carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('vocational_rehabilitation_pre_ets').sample_count, 1, 'Nebraska VR must carry one reviewed live sample.');
assert.equal(verifiedByFamily.get('protection_and_advocacy').sample_count, 1, 'Nebraska P&A must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1, 'Nebraska PTI must carry one reviewed first-party sample.');
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1, 'Nebraska legal aid must carry one reviewed live sample.');
assert.equal(verifiedByFamily.get('county_local_disability_resources').sample_count, 2, 'Nebraska county-local blocker should preserve the reviewed official office chain.');

assert.equal(probes.dhhsRoot.status, 200, 'Nebraska DHHS root probe must preserve the live official root.');
assert.equal(probes.medicaidEligibility.status, 200, 'Nebraska Medicaid probe must preserve the live eligibility leaf.');
assert.equal(probes.ddRoot.status, 200, 'Nebraska DD probe must preserve the live DD leaf.');
assert.equal(probes.ddEligibility.status, 200, 'Nebraska DD eligibility probe must preserve the live waiver-eligibility leaf.');
assert.equal(probes.edn.status, 200, 'Nebraska EDN probe must preserve the live official Part C root.');
assert.equal(probes.vr.status, 200, 'Nebraska VR probe must preserve the live official VR root.');
assert.equal(probes.protectionAndAdvocacy.status, 200, 'Nebraska P&A probe must preserve the live first-party root.');
assert.equal(probes.pti.status, 200, 'Nebraska PTI probe must preserve the live first-party About leaf.');
assert.equal(probes.legalAid.status, 200, 'Nebraska legal-aid probe must preserve the live first-party root.');
assert.equal(probes.officeLookup.status, 200, 'Nebraska office lookup probe must preserve the live interactive locator blocker.');

assert.ok(report.includes('PTI Nebraska has served as Nebraska’s Parent Training and Information Center since 2001'), 'Nebraska report must explain the PTI upgrade.');
assert.ok(report.includes('interactive shell'), 'Nebraska report must explain the county-local interactive-locator blocker.');
assert.ok(report.includes('no district-owned or county-grade education-routing leaf'), 'Nebraska report must explain the district-routing blocker.');
assert.ok(report.includes('vr.nebraska.gov'), 'Nebraska report must explain the VR upgrade.');
assert.ok(report.includes('edn.ne.gov'), 'Nebraska report must explain the EDN upgrade.');

assert.ok(lessons.includes('### Official Interactive Locators Do Not Count As County-Grade Proof Until Their County Data Is Reviewed'), 'Nebraska refresh must record the interactive-locator lesson.');

assert.equal(batchSummary.classification, 'BLOCKED', 'Nebraska batch summary must report blocked.');
assert.equal(batchSummary.evidence_checks.vr.status, 200, 'Nebraska batch summary must preserve the live VR evidence.');
assert.equal(batchSummary.evidence_checks.officeLookup.status, 200, 'Nebraska batch summary must preserve the interactive county-local blocker evidence.');

console.log('test-batch47-nebraska-statewide-family-truth-refresh-v1: ok');
