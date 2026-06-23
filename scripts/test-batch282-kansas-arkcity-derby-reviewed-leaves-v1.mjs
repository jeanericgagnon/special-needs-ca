import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch282KansasArkcityDerbyReviewedLeavesV1 } from './run-batch282-kansas-arkcity-derby-reviewed-leaves-v1.mjs';

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

const result = generateBatch282KansasArkcityDerbyReviewedLeavesV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const leaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch282_kansas_arkcity_derby_reviewed_leaves_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch282-kansas-arkcity-derby-reviewed-leaves-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_12_counties_but_export_backed_county_grade_coverage_is_still_incomplete');

assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 12);
assert.equal(packet.current_problem_metrics.reviewedDistrictOwnedLeafCount, 12);
assert.ok(packet.reviewed_local_leaf_counties.includes('cowley-ks'));
assert.ok(packet.reviewed_local_leaf_counties.includes('sedgwick-ks'));
assert.ok(packet.unresolved_local_leaf_counties.includes('dickinson-ks'));
assert.ok(!packet.unresolved_local_leaf_counties.includes('cowley-ks'));
assert.ok(!packet.unresolved_local_leaf_counties.includes('sedgwick-ks'));

const cowleyLeaf = leaves.find((row) => row.county_id === 'cowley-ks');
const sedgwickLeaf = leaves.find((row) => row.county_id === 'sedgwick-ks');
assert.equal(cowleyLeaf.source_url, 'https://www.usd470.com/academics/special-education');
assert.equal(cowleyLeaf.evidence_h1, 'Special Education');
assert.equal(sedgwickLeaf.source_url, 'https://www.derbyschools.com/academics/special-education');
assert.equal(sedgwickLeaf.evidence_h1, 'Special Education');

const gapRow = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gapRow.family_status, 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade');
assert.match(gapRow.status_reason, /12\/105 counties/i);
assert.match(gapRow.status_reason, /Abilene USD 435/i);

assert.equal(failureRows.length, 1);
assert.match(failureRows[0].evidence, /Cowley clears because https:\/\/www\.usd470\.com\/academics\/special-education/i);
assert.match(failureRows[0].evidence, /Sedgwick also now clears from a reviewed district-owned leaf/i);
assert.match(failureRows[0].evidence, /Dickinson remains a correct exact non-match freeze/i);

const verifiedRow = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(verifiedRow.blocker_code, /12_counties/i);
assert.ok(verifiedRow.samples.some((sample) => sample.sample_name === 'cowley local education-routing leaf'));
assert.ok(verifiedRow.samples.some((sample) => sample.sample_name === 'sedgwick local education-routing leaf'));
assert.ok(verifiedRow.samples.some((sample) => sample.sample_name === 'dickinson district non-match homepage-and-sitemap'));
assert.ok(!verifiedRow.samples.some((sample) => sample.sample_name === 'sedgwick district non-match special programs page'));

assert.equal(nextRows.length, 1);
assert.match(nextRows[0].evidence, /12\/105 counties/i);

const kansasQueue = queueRows.find((row) => row.state === 'kansas');
assert.equal(kansasQueue.primary_gap_reason, summary.primary_gap_reason);
assert.equal(kansasQueue.classification, 'BLOCKED');
assert.equal(kansasQueue.index_safe, false);

assert.equal(batchSummary.reviewed_leaf_count, 12);
assert.deepEqual(batchSummary.promoted_counties, ['cowley-ks', 'sedgwick-ks']);
assert.equal(batchSummary.retained_exact_non_match, 'dickinson-ks');

assert.ok(report.includes('Cowley now clears from the district-owned Arkansas City USD 470 Special Education leaf.'));
assert.ok(report.includes('Sedgwick now clears from the district-owned Derby Public Schools Special Education leaf'));
assert.ok(handoff.includes('12/105 counties'));
assert.ok(handoff.includes('https://www.usd470.com/academics/special-education'));
assert.ok(handoff.includes('https://www.derbyschools.com/academics/special-education'));
assert.ok(batchReport.includes('Cowley now clears'));

console.log('test-batch282-kansas-arkcity-derby-reviewed-leaves-v1: ok');
