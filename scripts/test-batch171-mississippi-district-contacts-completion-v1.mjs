import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch171MississippiDistrictContactsCompletionV1 } from './run-batch171-mississippi-district-contacts-completion-v1.mjs';

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

const result = generateBatch171MississippiDistrictContactsCompletionV1();
const summary = readJson('data/generated/mississippi_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/mississippi_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/mississippi_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/mississippi_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/mississippi_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch171_mississippi_district_contacts_completion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/mississippi-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(result.index_safe, true);
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.primary_gap_reason, 'none');
assert.deepEqual(summary.critical_gap_families, []);
assert.equal(summary.final_blockers.length, 0);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'verified_county_grade');
assert.match(eduGap.status_reason, /District Special Education Contacts leaf/i);
assert.match(eduGap.status_reason, /82 district rows for 82 counties/i);

assert.equal(failureRows.length, 0);
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'maintenance');
assert.equal(nextRows[0].failure_code, 'complete_maintain_truth_only');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'verified_county_grade');
assert.equal(eduVerified.evidence_strength, 'strong');
assert.equal(eduVerified.blocker_code, null);
assert.equal(eduVerified.sample_count, 4);
assert.match(eduVerified.samples[0].source_url, /mdek12\.org\/directory\/$/);
assert.match(eduVerified.samples[1].final_url, /mdek12\.org\/specialeducation\/$/);
assert.match(eduVerified.samples[2].evidence_snippet, /district names, supervisors, addresses, phone\/fax numbers/i);
assert.match(eduVerified.samples[3].evidence_snippet, /Alcorn County/i);

assert.equal(batchSummary.cleared_family, 'district_or_county_education_routing');
assert.equal(batchSummary.covered_counties, 82);
assert.equal(batchSummary.district_rows, 82);

assert.ok(report.includes('Mississippi now reaches California-grade and is index-safe.'));
assert.ok(report.includes('District Special Education Contacts leaf'));
assert.ok(lessons.includes('### Retest Host-Wide 403 Conclusions With A Real Browser User-Agent Before Freezing A State Blocker'));

console.log('test-batch171-mississippi-district-contacts-completion-v1: ok');
