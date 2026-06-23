import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch234ArizonaUnresolvedDistrictSplitRefinementV1 } from './run-batch234-arizona-unresolved-district-split-refinement-v1.mjs';

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

generateBatch234ArizonaUnresolvedDistrictSplitRefinementV1();

const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const packet = readJson('data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const queue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch234_arizona_unresolved_district_split_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch234-arizona-unresolved-district-split-refinement-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'education_gap_split_between_no_public_website_counties_and_reviewed_no_leaf_domains_plus_des_county_office_blocker');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_split_between_no_public_website_and_reviewed_public_domain_without_leaf');
assert.match(educationGap.status_reason, /4\/15 county-keyed district roots still expose no public district website/i);
assert.match(educationGap.status_reason, /3 unresolved counties do have live district domains/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'unresolved_counties_now_split_between_no_public_website_roots_and_reviewed_public_domains_without_role_leafs');
assert.match(educationFailure.evidence, /no district website at all for cochise-az, gila-az, navajo-az, and pima-az/i);
assert.match(educationFailure.evidence, /ccasdaz\.org/i);
assert.match(educationFailure.evidence, /mohavelearning\.org/i);
assert.match(educationFailure.evidence, /yavapaicountyhighschool\.com/i);

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'route_no_website_counties_to_county_or_superintendent_official_lanes_and_stop_reprobing_reviewed_public_domains_without_role_leafs_until_new_local_pages_exist');

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'blocked_split_between_no_public_website_and_reviewed_public_domain_without_leaf');
assert.ok(educationVerified.samples.some((sample) => sample.source_type === 'reviewed_public_domain_without_role_leaf' && sample.county_id === 'coconino-az'));
assert.ok(educationVerified.samples.some((sample) => sample.source_type === 'reviewed_public_domain_without_role_leaf' && sample.county_id === 'mohave-az'));
assert.ok(educationVerified.samples.some((sample) => sample.source_type === 'reviewed_public_domain_without_role_leaf' && sample.county_id === 'yavapai-az'));

assert.deepEqual(packet.unresolved_no_public_website_counties, ['cochise-az', 'gila-az', 'navajo-az', 'pima-az']);
assert.deepEqual(packet.unresolved_reviewed_public_domain_without_leaf_counties, ['coconino-az', 'mohave-az', 'yavapai-az']);

const azQueue = queue.find((row) => row.state === 'arizona');
assert.equal(azQueue.primary_gap_reason, 'education_gap_split_between_no_public_website_counties_and_reviewed_no_leaf_domains_plus_des_county_office_blocker');

assert.deepEqual(batchSummary.no_public_website_counties, ['cochise-az', 'gila-az', 'navajo-az', 'pima-az']);
assert.deepEqual(batchSummary.reviewed_public_domain_without_leaf_counties, ['coconino-az', 'mohave-az', 'yavapai-az']);

assert.match(report, /4 no-website counties plus 3 live district domains that have already failed a bounded local-leaf pass/i);
assert.match(batchReport, /reviewed public domains without role leaf: 3/i);

console.log('test-batch234-arizona-unresolved-district-split-refinement-v1: ok');
