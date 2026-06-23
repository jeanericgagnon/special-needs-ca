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

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'first_party_drnj_domains_not_publicly_reviewable');
assert.deepEqual(summary.critical_gap_families, ['protection_and_advocacy']);
assert.equal(summary.final_blockers.length, 1);

assert.equal(gapRows.find((row) => row.family === 'district_or_county_education_routing').family_status, 'verified_state_grade');
assert.equal(gapRows.find((row) => row.family === 'legal_aid').family_status, 'verified_state_grade');
assert.equal(gapRows.find((row) => row.family === 'county_local_disability_resources').family_status, 'verified_state_grade');
assert.equal(gapRows.find((row) => row.family === 'protection_and_advocacy').family_status, 'blocked_first_party_drnj_domains_not_publicly_reviewable');

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'protection_and_advocacy');
assert.equal(failureRows[0].failure_code, 'official_drnj_first_party_domains_unknown_or_challenge_blocked');

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
assert.equal(pandaVerified.sample_count, 3);
assert.match(pandaVerified.samples[0].evidence_snippet, /Unknown Domain/i);
assert.match(pandaVerified.samples[2].evidence_snippet, /Cloudflare Just a moment challenge shell/i);

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'protection_and_advocacy');
assert.equal(nextRows[0].next_action, 'hold_blocked_until_public_drnj_first_party_page_is_reviewable');

assert.equal(batchSummary.county_directory_count, 21);
assert.deepEqual(batchSummary.repaired_families, ['district_or_county_education_routing', 'legal_aid', 'county_local_disability_resources']);

assert.ok(report.includes('County Offices of Education page and the official DHS County Social Service Agencies page both preserve all 21 counties'));
assert.match(report, /Cloudflare `Just a moment\.\.\.` challenge/i);
assert.ok(lessons.includes('### One Official State Directory Page Can Clear Every County'));

console.log('test-batch176-new-jersey-county-directory-repair-v1: ok');
