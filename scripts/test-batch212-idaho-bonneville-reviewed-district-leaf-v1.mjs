import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch212IdahoBonnevilleReviewedDistrictLeafV1 } from './run-batch212-idaho-bonneville-reviewed-district-leaf-v1.mjs';

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

const result = generateBatch212IdahoBonnevilleReviewedDistrictLeafV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch212_idaho_bonneville_reviewed_district_leaf_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch212-idaho-bonneville-reviewed-district-leaf-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(summary.primary_gap_reason, 'reviewed_idaho_district_leaves_exist_but_county_grade_education_and_dhw_mapping_remain_incomplete');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /Jerome SD #261 Special Services/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /Minidoka School District Special Services/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'reviewed_district_special_services_leaves_exist_but_county_grade_mapping_is_still_incomplete');
assert.match(failure.evidence, /d93schools\.org\/sitemap\.xml/i);
assert.match(failure.evidence, /d93schools\.org\/special-education-programs-home/i);
assert.match(failure.evidence, /jeromeschools\.org\/specialserviceshome/i);
assert.match(failure.evidence, /minidokaschools\.org\/page\/special-services/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade');
assert.equal(verified.sample_count, 11);
assert.ok(verified.samples.some((sample) => /d93schools\.org\/special-education-programs-home/.test(sample.source_url)));
assert.ok(verified.samples.some((sample) => /jeromeschools\.org\/specialserviceshome/.test(sample.source_url)));
assert.ok(verified.samples.some((sample) => /minidokaschools\.org\/page\/special-services/.test(sample.source_url)));
assert.ok(verified.samples.some((sample) => /blaineschools\.org\/our-district\/staff-directory\/district-support-services/.test(sample.source_url) && sample.verification_status === 'reviewed'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet');

assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 8);
assert.equal(packet.current_problem_metrics.reviewedExactLeafCount, 8);
assert.equal(packet.reviewed_exact_leaves.length, 8);
assert.ok(packet.reviewed_exact_leaves.some((leaf) => leaf.county_id === 'bonneville-id'));
assert.ok(packet.reviewed_exact_leaves.some((leaf) => leaf.county_id === 'jerome-id'));
assert.ok(packet.reviewed_exact_leaves.some((leaf) => leaf.county_id === 'minidoka-id'));

const idahoQueue = queueRows.find((row) => row.state === 'idaho');
assert.equal(idahoQueue.primary_gap_reason, 'reviewed_idaho_district_leaves_exist_but_county_grade_education_and_dhw_mapping_remain_incomplete');

assert.equal(batchSummary.reviewed_exact_district_leaves, 8);
assert.equal(batchSummary.promoted_from_sitemap_exact_leaves, 4);
assert.equal(batchSummary.signal_only_district_roots, 1);
assert.ok(report.includes('eight counties now have reviewed district-owned special-education or special-services leaves'));
assert.ok(batchReport.includes('Jerome SD #261 and Minidoka School District now join Cassia, Payette, Bannock, Boundary, Butte, and Bonneville'));
assert.ok(lessons.includes('### CMS Slugs Ending In `-home` Can Still Be Exact District Leaves'));

console.log('test-batch212-idaho-bonneville-reviewed-district-leaf-v1: ok');
