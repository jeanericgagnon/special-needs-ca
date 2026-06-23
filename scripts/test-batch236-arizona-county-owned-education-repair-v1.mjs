import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch236ArizonaCountyOwnedEducationRepairV1 } from './run-batch236-arizona-county-owned-education-repair-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), 'utf8'));
}

function readJsonl(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

generateBatch236ArizonaCountyOwnedEducationRepairV1();

const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const packet = readJson('data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const queue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch236_arizona_county_owned_education_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch236-arizona-county-owned-education-repair-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'education_gap_now_limited_to_reviewed_no_leaf_public_domains_plus_des_county_office_blocker');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_reviewed_public_domains_without_leaf_after_county_owned_no_website_repairs');
assert.match(educationGap.status_reason, /3\/15 counties/i);
assert.match(educationGap.status_reason, /cochise-az, gila-az, navajo-az, pima-az/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'county_owned_superintendent_leaves_resolve_no_website_counties_but_three_reviewed_public_domains_still_lack_role_leafs');
assert.match(educationFailure.evidence, /Cochise County now has an official School Districts page/i);
assert.match(educationFailure.evidence, /Gila County Regional School District #49/i);
assert.match(educationFailure.evidence, /Navajo County Accommodation District #99/i);
assert.match(educationFailure.evidence, /Pima Accommodation District/i);

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'hold_reviewed_public_domains_without_role_leafs_until_new_local_pages_exist_and_do_not_reopen_county_superintendent_lane_for_the_resolved_no_website_counties');

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'blocked_reviewed_public_domains_without_leaf_after_county_owned_no_website_repairs');
assert.ok(educationVerified.samples.some((sample) => sample.source_type === 'county_owned_education_routing_leaf' && sample.county_id === 'cochise-az'));
assert.ok(educationVerified.samples.some((sample) => sample.source_type === 'county_owned_education_routing_leaf' && sample.county_id === 'gila-az'));
assert.ok(educationVerified.samples.some((sample) => sample.source_type === 'county_owned_education_routing_leaf' && sample.county_id === 'navajo-az'));
assert.ok(educationVerified.samples.some((sample) => sample.source_type === 'county_owned_education_routing_leaf' && sample.county_id === 'pima-az'));

assert.deepEqual(packet.unresolved_no_public_website_counties, []);
assert.deepEqual(packet.unresolved_reviewed_public_domain_without_leaf_counties, ['coconino-az', 'mohave-az', 'yavapai-az']);
assert.ok(Array.isArray(packet.reviewed_county_owned_leaf_samples));
assert.equal(packet.reviewed_county_owned_leaf_samples.length, 4);

const azQueue = queue.find((row) => row.state === 'arizona');
assert.equal(azQueue.primary_gap_reason, 'education_gap_now_limited_to_reviewed_no_leaf_public_domains_plus_des_county_office_blocker');

assert.deepEqual(batchSummary.resolved_county_owned_leaf_counties, ['cochise-az', 'gila-az', 'navajo-az', 'pima-az']);
assert.deepEqual(batchSummary.remaining_reviewed_public_domain_without_leaf_counties, ['coconino-az', 'mohave-az', 'yavapai-az']);

assert.match(report, /four no-website counties now have reviewed county-owned routing leaves/i);
assert.match(batchReport, /resolved all four no-website Arizona education counties/i);

console.log('test-batch236-arizona-county-owned-education-repair-v1: ok');
