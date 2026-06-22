import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch96CaliforniaBlockerRefinementV1 } from './run-batch96-california-blocker-refinement-v1.mjs';

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

const result = generateBatch96CaliforniaBlockerRefinementV1();
const summary = readJson('data/generated/california_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/california_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/california_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/california_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/california_verified_sources_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch96_california_blocker_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/california-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.missing_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'district_grade_leaf_packet_exhausted_after_statewide_equivalent_parent_center_repair');
assert.deepEqual(summary.major_gap_families, []);
assert.deepEqual(summary.final_blockers.map((row) => row.family), ['district_or_county_education_routing']);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationGap.status_reason, /9 reviewed exact leaves/i);
assert.match(educationGap.status_reason, /Amador/i);
assert.match(educationGap.status_reason, /Berkeley/i);
assert.match(educationGap.status_reason, /Fremont .* SSL handshake/i);
assert.match(educationGap.status_reason, /AlpineCOE, ButteCOE, CalaverasCOE, and ColusaCOE/i);

const ptiGap = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiGap.family_status, 'verified_state_grade');
assert.match(ptiGap.status_reason, /statewide California equivalent parent-center coverage/i);
assert.match(ptiGap.status_reason, /Family Resource Center Network of California/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationFailure.evidence, /9 reviewed exact leaves/i);
assert.match(educationFailure.evidence, /Amador/i);
assert.match(educationFailure.evidence, /Berkeley/i);

assert.equal(failureRows.some((row) => row.family === 'parent_training_information_center'), false);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationVerified.query_basis, /Amador and Berkeley domains/i);
assert.equal(educationVerified.sample_count, 9);
assert.ok(educationVerified.samples.some((sample) => /amadorcoe\.org\/selpa/.test(sample.source_url)));
assert.ok(educationVerified.samples.some((sample) => /berkeleyschools\.net\/departments\/special-education/.test(sample.source_url)));

const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiVerified.family_status, 'verified_state_grade');
assert.equal(ptiVerified.sample_count, 2);
assert.equal(ptiVerified.blocker_code, null);
assert.equal(ptiVerified.blocker_evidence, null);
assert.match(ptiVerified.query_basis, /live official DDS Family Resource Centers pages/i);
assert.ok(ptiVerified.samples.some((sample) => sample.source_url === 'https://www.dds.ca.gov/services/early-start/family-resource-center/'));
assert.ok(ptiVerified.samples.some((sample) => sample.source_url === 'https://www.dds.ca.gov/services/early-start/family-resource-center/regional-center-early-start-intake-and-family-resource-centers/'));

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationNext.evidence, /9 reviewed exact leaves/i);

assert.equal(nextRows.some((row) => row.family === 'parent_training_information_center'), false);

assert.deepEqual(batchSummary.refined_families, ['district_or_county_education_routing', 'parent_training_information_center']);
assert.match(batchSummary.evidence_checks.education, /9 reviewed exact leaves/i);
assert.match(batchSummary.evidence_checks.pti, /live statewide FRC page/);
assert.equal(batchSummary.completeness_pct, 91);
assert.deepEqual(batchSummary.remaining_blockers, ['district_or_county_education_routing']);
const queueRow = queueRows.find((row) => row.state === 'california');
assert.equal(queueRow.completeness_pct, 91);
assert.equal(queueRow.weak_critical_families, 1);
assert.equal(queueRow.primary_gap_reason, 'district_grade_leaf_packet_exhausted_after_statewide_equivalent_parent_center_repair');
assert.ok(report.includes('Parent training information center is now verified from the live official DDS Family Resource Centers pages'));
assert.ok(report.includes('County-local disability resources remain verified'));
assert.ok(report.includes('9 reviewed exact leaves'));
assert.ok(lessons.includes('On California DDS, The Replacement FRC Paths Matter More Than The Dead Legacy Root'));

console.log('test-batch96-california-blocker-refinement-v1: ok');
