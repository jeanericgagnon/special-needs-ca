import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch372WisconsinOfficialRoutingRepairV1 } from './run-batch372-wisconsin-official-routing-repair-v1.mjs';

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

const result = generateBatch372WisconsinOfficialRoutingRepairV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.deepEqual(result.repaired_families, [
  'county_local_disability_resources',
  'parent_training_information_center',
  'legal_aid',
]);
assert.equal(result.remaining_blocker_family, 'district_or_county_education_routing');

const summary = readJson('data/generated/wisconsin_california_grade_summary_v2.json');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing']);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(
  summary.primary_gap_reason,
  'official_dpi_directory_and_cesa_network_are_public_but_no_reviewed_statewide_county_to_region_or_special_education_crosswalk_is_preserved_on_disk'
);
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'district_or_county_education_routing');
assert.equal(
  summary.final_blockers[0].failure_code,
  'official_school_directory_and_cesa_network_exist_but_no_reviewed_statewide_county_or_special_education_crosswalk_is_preserved'
);

const gapRows = readJsonl('data/generated/wisconsin_gap_matrix_v2.jsonl');
const education = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'blocked_official_directory_and_cesa_network_without_reviewable_county_or_special_education_crosswalk');
assert.match(education.status_reason, /School Directory Public Portal/i);
assert.match(education.status_reason, /single reviewed statewide county-to-CESA contract/i);

const pti = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.status_reason, /Wisconsin Parent Training and Information Center/i);
assert.match(pti.status_reason, /OSEP-funded/i);

const legalAid = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'verified_state_grade');
assert.match(legalAid.status_reason, /Apply for FREE legal help/i);
assert.match(legalAid.status_reason, /Largest Statewide Civil Legal/i);

const county = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'verified_state_grade');
assert.match(county.status_reason, /ADRC of Adams County/i);
assert.match(county.status_reason, /Service area Adams County/i);

const failureRows = readJsonl('data/generated/wisconsin_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'district_or_county_education_routing');
assert.equal(
  failureRows[0].failure_code,
  'official_school_directory_and_cesa_network_exist_but_no_reviewed_statewide_county_or_special_education_crosswalk_is_preserved'
);
assert.match(failureRows[0].evidence, /current proof stops at portal and network structure/i);

const verifiedRows = readJsonl('data/generated/wisconsin_verified_sources_v1.jsonl');
const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'blocked_official_directory_and_cesa_network_without_reviewable_county_or_special_education_crosswalk');
assert.equal(educationVerified.sample_count, 4);
assert.match(educationVerified.samples[1].source_url, /dpi\.wi\.gov\/schooldirectory/);

const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiVerified.family_status, 'verified_state_grade');
assert.match(ptiVerified.samples[0].source_url, /wifacets\.org\/projects\/statewide/);
assert.match(ptiVerified.samples[2].evidence_snippet, /Parent Training and Information Center \(PTI\)/i);

const legalAidVerified = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAidVerified.family_status, 'verified_state_grade');
assert.match(legalAidVerified.samples[0].evidence_snippet, /Apply for FREE legal help/i);
assert.match(legalAidVerified.samples[1].evidence_snippet, /Largest Statewide Civil Legal/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_state_grade');
assert.match(countyVerified.samples[1].evidence_snippet, /Service area Adams County/i);
assert.match(countyVerified.samples[2].evidence_snippet, /Service area Clark County/i);

const nextRows = readJsonl('data/generated/wisconsin_next_action_queue_v2.jsonl');
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'district_or_county_education_routing');
assert.equal(
  nextRows[0].next_action,
  'hold_blocked_until_wisconsin_publishes_reviewable_county_to_cesa_or_district_special_education_crosswalk'
);

const batchSummary = readJson('data/generated/batch372_wisconsin_official_routing_repair_summary_v1.json');
assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.remaining_blocker_family, 'district_or_county_education_routing');
assert.deepEqual(batchSummary.repaired_families, [
  'county_local_disability_resources',
  'parent_training_information_center',
  'legal_aid',
]);

const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/wisconsin-california-grade-audit-report-v2.md'), 'utf8');
assert.match(stateReport, /Wisconsin remains `BLOCKED` and `index_safe=false`\./);
assert.match(stateReport, /`county_local_disability_resources` now clears/i);
assert.match(stateReport, /PTI designation language/i);
assert.match(stateReport, /only remaining blocker/i);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch372-wisconsin-official-routing-repair-report-v1.md'), 'utf8');
assert.match(batchReport, /cleared Wisconsin county-local disability resources, PTI, and legal aid/i);
assert.match(batchReport, /single reviewed statewide county-to-CESA contract, exported district list with county and CESA fields, or district-owned special-education crosswalk/i);

console.log('test-batch372-wisconsin-official-routing-repair-v1: ok');
