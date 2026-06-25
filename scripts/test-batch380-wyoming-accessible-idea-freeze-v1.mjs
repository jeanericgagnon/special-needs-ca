import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch380WyomingAccessibleIdeaFreezeV1 } from './run-batch380-wyoming-accessible-idea-freeze-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch380WyomingAccessibleIdeaFreezeV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.deepEqual(result.cleared_families, ['special_education_idea_part_b']);

const summary = readJson('data/generated/wyoming_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch380_wyoming_accessible_idea_freeze_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 2);
assert.deepEqual(summary.critical_gap_families, [
  'district_or_county_education_routing',
  'county_local_disability_resources',
]);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(
  summary.primary_gap_reason,
  'wde_idea_evidence_is_now_public_but_no_reviewable_county_to_district_special_education_crosswalk_or_disability_specific_county_resource_contract'
);

const gapRows = readJsonl('data/generated/wyoming_gap_matrix_v2.jsonl');
const idea = gapRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(idea.family_status, 'verified_state_grade');
assert.match(idea.status_reason, /Annual State Application` PDF/i);
assert.match(idea.status_reason, /Office of Special Education Programs/i);

const district = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(district.family_status, /blocked_official_wde_public_but_without_reviewable_county_to_district_special_education_crosswalk/);
assert.match(district.status_reason, /School District Enrollment & Staffing Data/i);
assert.match(district.status_reason, /generic district roots/i);

const county = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(county.family_status, /blocked_official_wdh_county_surfaces_are_aging_only_without_disability_specific_contract/);
assert.match(county.status_reason, /Services by County/i);
assert.match(county.status_reason, /older adults/i);

const failureRows = readJsonl('data/generated/wyoming_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 2);
assert.equal(failureRows[0].family, 'district_or_county_education_routing');
assert.equal(failureRows[1].family, 'county_local_disability_resources');

const verifiedRows = readJsonl('data/generated/wyoming_verified_sources_v1.jsonl');
const ideaVerified = verifiedRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(ideaVerified.family_status, 'verified_state_grade');
assert.equal(ideaVerified.evidence_strength, 'strong');
assert.equal(ideaVerified.sample_count, 3);
assert.match(ideaVerified.samples[0].source_url, /edu\.wyoming\.gov\/parents\/special-education\/$/);
assert.match(ideaVerified.samples[1].source_url, /edu\.wyoming\.gov\/parents\/special-education\/idea\/$/);
assert.match(ideaVerified.samples[2].source_url, /IDEA-PartB-Application\.pdf$/);

const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(districtVerified.blocker_code, /no_reviewable_county_to_district_or_special_education_crosswalk/);
assert.equal(districtVerified.sample_count, 5);
assert.match(districtVerified.samples[1].source_url, /school-district-enrollment-and-staffing-data/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyVerified.blocker_code, /aging_only_without_disability_specific_county_contract/);
assert.equal(countyVerified.sample_count, 3);
assert.match(countyVerified.samples[0].source_url, /service-area-maps/);
assert.match(countyVerified.samples[1].source_url, /public_resources/);

const nextRows = readJsonl('data/generated/wyoming_next_action_queue_v2.jsonl');
assert.equal(nextRows.length, 2);
assert.equal(nextRows[0].family, 'district_or_county_education_routing');
assert.equal(nextRows[1].family, 'county_local_disability_resources');

const batchSummary = readJson('data/generated/batch380_wyoming_accessible_idea_freeze_summary_v1.json');
assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.index_safe, false);
assert.deepEqual(batchSummary.cleared_families, ['special_education_idea_part_b']);

const stateReport = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'wyoming-california-grade-audit-report-v2.md'), 'utf8');
assert.match(stateReport, /`special_education_idea_part_b` now clears/i);
assert.match(stateReport, /county-to-district crosswalk/i);
assert.match(stateReport, /aging and community-living resources/i);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'batch380-wyoming-accessible-idea-freeze-report-v1.md'), 'utf8');
assert.match(batchReport, /classification: BLOCKED/i);
assert.match(batchReport, /cleared Wyoming IDEA Part B/i);
assert.match(batchReport, /older adults/i);

console.log('test-batch380-wyoming-accessible-idea-freeze-v1: ok');
