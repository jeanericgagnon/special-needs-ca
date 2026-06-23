import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch227KansasAddReviewedDistrictOwnedLeavesV1 } from './run-batch227-kansas-add-reviewed-district-owned-leaves-v1.mjs';

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

const result = generateBatch227KansasAddReviewedDistrictOwnedLeavesV1();
const batchSummary = readJson('data/generated/batch227_kansas_add_reviewed_district_owned_leaves_summary_v1.json');
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const leaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch227-kansas-add-reviewed-district-owned-leaves-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.reviewed_leaf_count, 6);
assert.equal(summary.primary_gap_reason, 'reviewed_kansas_district_owned_leaves_exist_but_full_county_grade_coverage_is_incomplete');

assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 6);
assert.equal(packet.current_problem_metrics.reviewedDistrictOwnedLeafCount, 6);
assert.ok(packet.reviewed_local_leaf_counties.includes('johnson-ks'));
assert.ok(packet.reviewed_local_leaf_counties.includes('douglas-ks'));
assert.ok(packet.reviewed_local_leaf_counties.includes('finney-ks'));

const countyGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(countyGap.family_status, 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade');
assert.match(countyGap.status_reason, /6\/105 counties/i);

const countyFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(countyFailure.failure_code, 'reviewed_district_owned_special_education_leaves_exist_but_kansas_county_grade_coverage_is_still_incomplete');
assert.match(countyFailure.evidence, /johnson-ks, shawnee-ks/i);
assert.match(countyFailure.evidence, /olatheschools\.org\/academics\/special-education/i);
assert.match(countyFailure.evidence, /usd497\.org\/about-us\/departments\/student-support-services\/special-education-services/i);
assert.match(countyFailure.evidence, /gckschools\.com\/page\/special-education/i);
assert.match(countyFailure.evidence, /Special Schools and Programs/i);

const reviewedLeafUrls = new Set(leaves.map((row) => row.source_url));
assert.ok(reviewedLeafUrls.has('https://www.olatheschools.org/academics/special-education'));
assert.ok(reviewedLeafUrls.has('https://www.usd497.org/about-us/departments/student-support-services/special-education-services'));
assert.ok(reviewedLeafUrls.has('https://www.gckschools.com/page/special-education/'));

const countyVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(countyVerified.family_status, 'blocked_reviewed_district_owned_leaves_exist_but_not_statewide_county_grade');
assert.equal(countyVerified.sample_count, countyVerified.samples.length);
assert.ok(countyVerified.samples.find((row) => row.source_url === 'https://www.olatheschools.org/academics/special-education'));
assert.ok(countyVerified.samples.find((row) => row.source_url === 'https://www.usd497.org/about-us/departments/student-support-services/special-education-services'));
assert.ok(countyVerified.samples.find((row) => row.source_url === 'https://www.gckschools.com/page/special-education/'));
const sedgwickSample = countyVerified.samples.find((row) => row.source_url === 'https://www.usd259.org/schools23/special-programs-and-schools');
assert.ok(sedgwickSample);
assert.match(sedgwickSample.evidence_snippet, /does not satisfy county-grade education proof/i);

const countyNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(countyNext.next_action, 'expand_reviewed_kansas_district_owned_special_education_leaves_from_public_export_backed_inventory');

assert.ok(report.includes('reviewed district-owned leaves now exist for six counties'));
assert.ok(batchReport.includes('Johnson, Douglas, and Finney now clear'));
assert.ok(lessons.includes('### District Nav Or Sitemaps Can Produce Exact Leaves Even When The XML Endpoint Fails'));

console.log('test-batch227-kansas-add-reviewed-district-owned-leaves-v1: ok');
