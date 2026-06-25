import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch370VermontOfficialRoutingRepairV1 } from './run-batch370-vermont-official-routing-repair-v1.mjs';

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

const result = generateBatch370VermontOfficialRoutingRepairV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.deepEqual(result.repaired_families, [
  'district_or_county_education_routing',
  'protection_and_advocacy',
  'parent_training_information_center',
]);
assert.equal(result.remaining_blocker_family, 'county_local_disability_resources');

const summary = readJson('data/generated/vermont_california_grade_summary_v2.json');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(summary.critical_gap_families, ['county_local_disability_resources']);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(
  summary.primary_gap_reason,
  'official_ahs_district_jurisdiction_codes_are_public_but_no_reviewable_public_ahs_office_crosswalk_or_service_area_contract_exists'
);
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'county_local_disability_resources');
assert.equal(
  summary.final_blockers[0].failure_code,
  'official_ahs_district_jurisdiction_codes_exist_but_public_office_crosswalk_is_unavailable_or_403'
);
assert.ok(summary.verified_source_families_with_samples.includes('protection_and_advocacy'));
assert.ok(summary.verified_source_families_with_samples.includes('parent_training_information_center'));

const gapRows = readJsonl('data/generated/vermont_gap_matrix_v2.jsonl');
const education = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.match(education.status_reason, /Vermont Education Dashboard Organization Information dataset/i);
assert.match(education.status_reason, /New Haven, Bristol, Monkton, Ferrisburgh, and Vergennes/i);

const pa = gapRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(pa.family_status, 'verified_state_grade');
assert.match(pa.status_reason, /Protection and Advocacy \(P&A\) system/i);

const pti = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.status_reason, /federally designated Parent Training and Information Center/i);

const county = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'blocked_official_ahs_district_codes_without_public_office_crosswalk');
assert.match(county.status_reason, /Williston \/ Chittenden \/ BDO/i);
assert.match(county.status_reason, /humanservices\.vermont\.gov\/.*403/i);

const failureRows = readJsonl('data/generated/vermont_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.equal(
  failureRows[0].failure_code,
  'official_ahs_district_jurisdiction_codes_exist_but_public_office_crosswalk_is_unavailable_or_403'
);
assert.match(failureRows[0].evidence, /East Montpelier \/ Washington \/ MDO/i);

const verifiedRows = readJsonl('data/generated/vermont_verified_sources_v1.jsonl');
const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'verified_state_grade');
assert.equal(educationVerified.sample_count, 4);
assert.match(educationVerified.samples[1].source_url, /api\.us\.socrata\.com\/api\/catalog\/v1\?ids=9uwi-evpg/);

const paVerified = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(paVerified.family_status, 'verified_state_grade');
assert.match(paVerified.samples[1].evidence_snippet, /national Protection and Advocacy system/i);

const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiVerified.family_status, 'verified_state_grade');
assert.match(ptiVerified.samples[0].evidence_snippet, /federally designated Parent Training and Information Center/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_official_ahs_district_codes_without_public_office_crosswalk');
assert.equal(
  countyVerified.blocker_code,
  'official_ahs_district_jurisdiction_codes_exist_but_public_office_crosswalk_is_unavailable_or_403'
);
assert.ok(countyVerified.samples.some((sample) => /Williston \/ Chittenden \/ BDO/i.test(sample.evidence_snippet)));
assert.ok(countyVerified.samples.some((sample) => /returned HTTP 403/i.test(sample.evidence_snippet)));

const nextRows = readJsonl('data/generated/vermont_next_action_queue_v2.jsonl');
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.equal(
  nextRows[0].next_action,
  'hold_blocked_until_vermont_publishes_public_ahs_district_code_to_office_or_county_service_area_contract'
);

const batchSummary = readJson('data/generated/batch370_vermont_official_routing_repair_summary_v1.json');
assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.remaining_blocker_family, 'county_local_disability_resources');
assert.deepEqual(batchSummary.repaired_families, [
  'district_or_county_education_routing',
  'protection_and_advocacy',
  'parent_training_information_center',
]);

const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/vermont-california-grade-audit-report-v2.md'), 'utf8');
assert.match(stateReport, /Vermont remains BLOCKED and not index-safe\./);
assert.match(stateReport, /official Vermont Education Dashboard dataset publicly maps local schools/i);
assert.match(stateReport, /Disability Rights Vermont explicitly identifies itself as part of the national Protection and Advocacy system/i);
assert.match(stateReport, /Vermont Family Network's live first-party page explicitly preserves its federally designated PTI status/i);
assert.match(stateReport, /only remaining critical blocker/i);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch370-vermont-official-routing-repair-report-v1.md'), 'utf8');
assert.match(batchReport, /cleared Vermont education routing, protection and advocacy, and PTI/i);
assert.match(batchReport, /AHS District.*district office jurisdiction/i);

console.log('test-batch370-vermont-official-routing-repair-v1: ok');
