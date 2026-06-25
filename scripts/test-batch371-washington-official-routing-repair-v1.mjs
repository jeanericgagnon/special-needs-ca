import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch371WashingtonOfficialRoutingRepairV1 } from './run-batch371-washington-official-routing-repair-v1.mjs';

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

const result = generateBatch371WashingtonOfficialRoutingRepairV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.deepEqual(result.repaired_families, [
  'district_or_county_education_routing',
  'protection_and_advocacy',
  'legal_aid',
]);
assert.equal(result.remaining_blocker_family, 'county_local_disability_resources');

const summary = readJson('data/generated/washington_california_grade_summary_v2.json');
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
  'official_dshs_local_offices_are_public_but_reviewed_pages_do_not_preserve_a_county_to_office_or_service_area_contract'
);
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'county_local_disability_resources');
assert.equal(
  summary.final_blockers[0].failure_code,
  'official_local_office_locator_exists_but_no_public_county_to_office_or_service_area_contract'
);
assert.ok(summary.verified_source_families_with_samples.includes('protection_and_advocacy'));
assert.ok(summary.verified_source_families_with_samples.includes('legal_aid'));

const gapRows = readJsonl('data/generated/washington_gap_matrix_v2.jsonl');
const education = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.match(education.status_reason, /This page lists websites and addresses for school districts/i);
assert.match(education.status_reason, /Aberdeen -> 113, Adna -> 113, Almira -> 101/i);

const pa = gapRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(pa.family_status, 'verified_state_grade');
assert.match(pa.status_reason, /Washington's Protection and Advocacy System/i);

const legalAid = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'verified_state_grade');
assert.match(legalAid.status_reason, /Maintained by Northwest Justice Project/i);

const county = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'blocked_official_local_office_locator_without_county_contract');
assert.match(county.status_reason, /zip code, city, or county/i);
assert.match(county.status_reason, /Whitman County DDA Field Office/i);
assert.match(county.status_reason, /forbid inferring local routing from nearest-office or geodistance behavior/i);

const failureRows = readJsonl('data/generated/washington_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.equal(
  failureRows[0].failure_code,
  'official_local_office_locator_exists_but_no_public_county_to_office_or_service_area_contract'
);
assert.match(failureRows[0].evidence, /Tri County DDA Field Office/i);

const verifiedRows = readJsonl('data/generated/washington_verified_sources_v1.jsonl');
const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'verified_state_grade');
assert.equal(educationVerified.sample_count, 4);
assert.match(educationVerified.samples[2].source_url, /educational-service-districts-esd/);

const paVerified = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(paVerified.family_status, 'verified_state_grade');
assert.match(paVerified.samples[0].evidence_snippet, /Protection and Advocacy System/i);

const legalAidVerified = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAidVerified.family_status, 'verified_state_grade');
assert.match(legalAidVerified.samples[1].evidence_snippet, /public library of free legal information in Washington State/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_official_local_office_locator_without_county_contract');
assert.equal(
  countyVerified.blocker_code,
  'official_local_office_locator_exists_but_no_public_county_to_office_or_service_area_contract'
);
assert.ok(countyVerified.samples.some((sample) => /Okanogan County Community Services Office/i.test(sample.evidence_snippet)));
assert.ok(countyVerified.samples.some((sample) => /52 local Community Services Offices/i.test(sample.evidence_snippet)));

const nextRows = readJsonl('data/generated/washington_next_action_queue_v2.jsonl');
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.equal(
  nextRows[0].next_action,
  'hold_blocked_until_washington_publishes_reviewable_county_to_office_or_service_area_contract'
);

const batchSummary = readJson('data/generated/batch371_washington_official_routing_repair_summary_v1.json');
assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.remaining_blocker_family, 'county_local_disability_resources');
assert.deepEqual(batchSummary.repaired_families, [
  'district_or_county_education_routing',
  'protection_and_advocacy',
  'legal_aid',
]);

const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/washington-california-grade-audit-report-v2.md'), 'utf8');
assert.match(stateReport, /Washington remains `BLOCKED` and `index_safe=false`\./);
assert.match(stateReport, /OSPI publishes a live district directory with district-to-ESD assignments/i);
assert.match(stateReport, /Disability Rights Washington explicitly identifies itself/i);
assert.match(stateReport, /Washington Law Help preserves a live first-party Northwest Justice Project legal-help route/i);
assert.match(stateReport, /only remaining blocker/i);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch371-washington-official-routing-repair-report-v1.md'), 'utf8');
assert.match(batchReport, /cleared Washington education routing, protection and advocacy, and legal aid/i);
assert.match(batchReport, /office locator remains a search or locator surface rather than a reviewable county routing crosswalk/i);

console.log('test-batch371-washington-official-routing-repair-v1: ok');
