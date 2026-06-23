import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch159IdahoDistrictDirectoryNuanceV1 } from './run-batch159-idaho-district-directory-nuance-v1.mjs';

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

const result = generateBatch159IdahoDistrictDirectoryNuanceV1();
const batchSummary = readJson('data/generated/batch159_idaho_district_directory_nuance_summary_v1.json');
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const educationPacket = readJson('data/generated/idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.district_directory_links_verified, 116);
assert.equal(batchSummary.county_bearing_names_visible, true);
assert.equal(batchSummary.explicit_county_contract_visible, false);
assert.equal(batchSummary.district_special_education_fields_visible, false);

assert.equal(summary.primary_gap_reason, 'official_directories_expose_real_public_contracts_but_county_grade_mapping_and_role_fields_still_missing');

assert.equal(educationPacket.current_problem_metrics.officialDistrictLinks, 116);
assert.equal(educationPacket.current_problem_metrics.countyBearingDistrictNamesVisible, true);
assert.equal(educationPacket.current_problem_metrics.explicitCountyFieldVisible, false);
assert.equal(educationPacket.current_problem_metrics.districtSpecialEducationFieldsVisible, false);
assert.equal(educationPacket.representative_sources[1], 'https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'blocked_official_district_directory_with_links_but_without_county_contract_or_special_education_fields');
assert.match(eduGap.status_reason, /public WordPress page JSON preserve 116 exact outbound district website links/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'official_district_directory_and_page_json_expose_links_and_some_county_bearing_names_but_no_county_contract_or_special_education_fields');
assert.match(eduFailure.evidence, /Blaine County District #61/i);
assert.match(eduFailure.evidence, /no explicit county field, no county filter or county-to-district mapping contract, and no district special-education contact fields/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'blocked_official_district_directory_with_links_but_without_county_contract_or_special_education_fields');
assert.equal(eduVerified.sample_count, 3);
assert.deepEqual(eduVerified.samples.map((sample) => sample.sample_name), [
  'Idaho School Districts page',
  'Idaho School Districts page JSON',
  'Idaho education DB fallback inventory',
]);

const eduNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduNext.next_action, 'author_reviewed_district_targets_from_official_school_districts_directory_links_or_keep_county_routing_blocked');

assert.ok(report.includes('real public district-link contract'));
assert.ok(report.includes('lack an explicit county mapping contract and district special-education fields'));
assert.ok(lessons.includes('### County-Bearing District Names Do Not Equal County Routing'));

console.log('test-batch159-idaho-district-directory-nuance-v1: ok');
