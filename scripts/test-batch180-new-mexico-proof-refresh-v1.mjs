import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch180NewMexicoProofRefreshV1 } from './run-batch180-new-mexico-proof-refresh-v1.mjs';

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

generateBatch180NewMexicoProofRefreshV1();

const summary = readJson('data/generated/new-mexico_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-mexico_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-mexico_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/new-mexico_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-mexico_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch180_new_mexico_proof_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-mexico-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(
  summary.primary_gap_reason,
  'district_and_county_local_leaf_proof_still_missing_after_statewide_and_fit_regional_repairs'
);
assert.deepEqual(summary.critical_gap_families.sort(), ['county_local_disability_resources', 'district_or_county_education_routing'].sort());

const earlyGap = gapRows.find((row) => row.family === 'early_intervention_part_c');
assert.equal(earlyGap.family_status, 'verified_county_grade');
assert.match(earlyGap.status_reason, /Regional Office Map/i);
assert.match(earlyGap.status_reason, /33 counties/i);

const ptiGap = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiGap.family_status, 'verified_state_grade');
assert.match(ptiGap.status_reason, /Parents Reaching Out About page/i);

const legalGap = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(legalGap.family_status, 'verified_state_grade');
assert.match(legalGap.status_reason, /serves all counties/i);

const countyLocalGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyLocalGap.family_status, 'blocked_live_hca_field_office_archive_partial_county_contract');
assert.match(countyLocalGap.status_reason, /Field Offices archive/i);

const vrGap = gapRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrGap.family_status, 'blocked_official_dvr_root_unauthorized_without_reviewed_alternate');
assert.match(vrGap.status_reason, /HTTP 401/i);

assert.ok(!failureRows.find((row) => row.family === 'early_intervention_part_c'));
assert.ok(!failureRows.find((row) => row.family === 'parent_training_information_center'));
assert.ok(!failureRows.find((row) => row.family === 'legal_aid'));

const countyLocalFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyLocalFailure);
assert.equal(countyLocalFailure.failure_code, 'live_hca_field_office_archive_exists_but_county_complete_contract_not_yet_preserved');
assert.match(countyLocalFailure.evidence, /Bernalillo County NW/i);

const vrFailure = failureRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.ok(vrFailure);
assert.equal(vrFailure.failure_code, 'official_dvr_root_returns_401_without_reviewed_public_alternate');
assert.match(vrFailure.evidence, /401 Unauthorized/i);

const earlyVerified = verifiedRows.find((row) => row.family === 'early_intervention_part_c');
assert.equal(earlyVerified.family_status, 'verified_county_grade');
assert.equal(earlyVerified.sample_count, 2);
assert.match(earlyVerified.query_basis, /Regional Office Map/i);
assert.equal(earlyVerified.blocker_code, null);
assert.match(earlyVerified.samples[1].evidence_snippet, /33 counties/i);

const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiVerified.family_status, 'verified_state_grade');
assert.match(ptiVerified.samples[0].evidence_snippet, /Parent Training and Information Center/i);

const legalVerified = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalVerified.family_status, 'verified_state_grade');
assert.match(legalVerified.samples[0].evidence_snippet, /serving all counties in New Mexico/i);

const countyLocalVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyLocalVerified.family_status, 'blocked_live_hca_field_office_archive_partial_county_contract');
assert.equal(countyLocalVerified.sample_count, 2);
assert.match(countyLocalVerified.blocker_evidence, /Field Offices archive/i);

const vrVerified = verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vrVerified.family_status, 'blocked_official_dvr_root_unauthorized_without_reviewed_alternate');
assert.equal(vrVerified.sample_count, 1);
assert.match(vrVerified.samples[0].evidence_snippet, /401 Unauthorized/i);

assert.equal(nextRows.length, 3);
assert.equal(nextRows[0].family, 'district_or_county_education_routing');
assert.equal(nextRows[1].family, 'county_local_disability_resources');
assert.equal(nextRows[2].family, 'vocational_rehabilitation_pre_ets');

assert.deepEqual(batchSummary.repaired_families.sort(), ['early_intervention_part_c', 'legal_aid', 'parent_training_information_center'].sort());
assert.deepEqual(batchSummary.sharpened_families.sort(), ['county_local_disability_resources', 'vocational_rehabilitation_pre_ets'].sort());

assert.match(report, /Parents Reaching Out About page/i);
assert.match(report, /New Mexico Legal Aid locations page/i);
assert.match(report, /Regional Office Map/i);
assert.match(lessons, /About Pages Can Preserve Official PTI Designation Even When The Homepage Does Not/);
assert.match(lessons, /County-Complete Regional Office Maps Linked From A Part C Program Page Can Clear Local FIT Routing/);

console.log('test-batch180-new-mexico-proof-refresh-v1: ok');
