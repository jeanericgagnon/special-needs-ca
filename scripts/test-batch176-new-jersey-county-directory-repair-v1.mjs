import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch176NewJerseyCountyDirectoryRepairV1 } from './run-batch176-new-jersey-county-directory-repair-v1.mjs';

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

const result = generateBatch176NewJerseyCountyDirectoryRepairV1();
const summary = readJson('data/generated/new-jersey_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-jersey_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-jersey_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/new-jersey_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-jersey_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch176_new_jersey_county_directory_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-jersey-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.primary_gap_reason, 'none');
assert.deepEqual(summary.critical_gap_families, []);
assert.equal(summary.final_blockers.length, 0);

assert.equal(gapRows.find((row) => row.family === 'district_or_county_education_routing').family_status, 'verified_state_grade');
assert.equal(gapRows.find((row) => row.family === 'legal_aid').family_status, 'verified_state_grade');
assert.equal(gapRows.find((row) => row.family === 'county_local_disability_resources').family_status, 'verified_state_grade');
assert.equal(gapRows.find((row) => row.family === 'protection_and_advocacy').family_status, 'verified_state_grade');

assert.equal(failureRows.length, 0);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.sample_count, 4);
assert.match(eduVerified.samples[1].source_url, /nj\.gov\/education\/about\/counties/);
assert.match(eduVerified.samples[1].evidence_snippet, /all 21 New Jersey counties/i);

const legalVerified = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalVerified.sample_count, 2);
assert.match(legalVerified.samples[1].source_url, /lsnj\.org\/get-legal-help\/free-lsnjlaw-hotline/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 4);
assert.match(countyVerified.samples[1].source_url, /nj\.gov\/humanservices\/dfd\/counties/);
assert.match(countyVerified.samples[1].evidence_snippet, /all 21 New Jersey counties/i);

const pandaVerified = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(pandaVerified.sample_count, 1);
assert.match(pandaVerified.samples[0].source_url, /disabilityrightsnj\.org/);
assert.match(pandaVerified.samples[0].evidence_snippet, /designated Protection and Advocacy system under federal law/i);

assert.equal(nextRows.length, 0);

assert.equal(batchSummary.county_directory_count, 21);
assert.deepEqual(batchSummary.repaired_families, ['district_or_county_education_routing', 'legal_aid', 'county_local_disability_resources', 'protection_and_advocacy']);

assert.ok(report.includes('County Offices of Education page and the official DHS County Social Service Agencies page preserve all 21 counties'));
assert.ok(report.includes('The final statewide protection-and-advocacy blocker is cleared'));
assert.ok(lessons.includes('### One Official State Directory Page Can Clear Every County'));
assert.ok(lessons.includes('### Browser-Readable First-Party Pages Override Raw Challenge Assumptions'));

console.log('test-batch176-new-jersey-county-directory-repair-v1: ok');
