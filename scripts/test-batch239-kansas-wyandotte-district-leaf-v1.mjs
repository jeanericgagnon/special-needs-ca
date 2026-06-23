import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch239KansasWyandotteDistrictLeafV1 } from './run-batch239-kansas-wyandotte-district-leaf-v1.mjs';

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

const result = generateBatch239KansasWyandotteDistrictLeafV1();
const batchSummary = readJson('data/generated/batch239_kansas_wyandotte_district_leaf_summary_v1.json');
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const leaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch239-kansas-wyandotte-district-leaf-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.reviewed_leaf_count, 7);
assert.equal(batchSummary.newly_verified_county, 'wyandotte-ks');
assert.equal(summary.primary_gap_reason, 'reviewed_kansas_district_owned_leaves_now_cover_7_counties_but_full_county_grade_coverage_is_incomplete');
assert.equal(queueRows.find((row) => row.state === 'kansas').primary_gap_reason, 'reviewed_kansas_district_owned_leaves_now_cover_7_counties_but_full_county_grade_coverage_is_incomplete');

assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 7);
assert.equal(packet.current_problem_metrics.reviewedDistrictOwnedLeafCount, 7);
assert.ok(packet.reviewed_local_leaf_counties.includes('wyandotte-ks'));

const countyGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(countyGap.family_status, 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade');
assert.match(countyGap.status_reason, /7\/105 counties/i);

const countyFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(countyFailure.failure_code, 'reviewed_district_owned_special_education_leaves_exist_but_kansas_county_grade_coverage_is_still_incomplete');
assert.match(countyFailure.evidence, /wyandotte-ks/i);
assert.match(countyFailure.evidence, /kckschools\.org\/special-education/i);
assert.match(countyFailure.evidence, /IDEA and Section 504/i);

const reviewedLeafUrls = new Set(leaves.map((row) => row.source_url));
assert.ok(reviewedLeafUrls.has('https://www.kckschools.org/special-education'));

const countyVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(countyVerified.family_status, 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade');
assert.equal(countyVerified.sample_count, countyVerified.samples.length);
const wyandotteSample = countyVerified.samples.find((row) => row.source_url === 'https://www.kckschools.org/special-education');
assert.ok(wyandotteSample);
assert.match(wyandotteSample.evidence_snippet, /IDEA and Section 504/i);
const sedgwickSample = countyVerified.samples.find((row) => row.sample_name === 'sedgwick district non-match special programs page');
assert.ok(sedgwickSample);

const countyNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(countyNext.next_action, 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory_and_keep_non_matching_district_pages_frozen');

assert.ok(report.includes('reviewed district-owned leaves now exist for seven counties'));
assert.ok(report.includes('Wyandotte now clears'));
assert.ok(batchReport.includes('newly verified county: wyandotte-ks'));
assert.ok(lessons.includes('### District Homepages Can Expose Exact Leaves Even When XML Sitemaps 404'));

console.log('test-batch239-kansas-wyandotte-district-leaf-v1: ok');
