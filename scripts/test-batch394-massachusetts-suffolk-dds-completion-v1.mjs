import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch394MassachusettsSuffolkDdsCompletionV1 } from './run-batch394-massachusetts-suffolk-dds-completion-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

const result = generateBatch394MassachusettsSuffolkDdsCompletionV1();
const summary = readJson('data/generated/massachusetts_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/massachusetts_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/massachusetts_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/massachusetts_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/massachusetts_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/massachusetts-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch394_massachusetts_suffolk_dds_completion_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch394-massachusetts-suffolk-dds-completion-report-v1.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.batch, 'batch394_massachusetts_suffolk_dds_completion_v1');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified');
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.final_blockers, []);
assert.equal(summary.familyStatuses.county_local_disability_resources, 'verified_county_grade');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_county_grade');
assert.match(countyGap.status_reason, /DDS Greater Boston Area Office/i);
assert.match(countyGap.status_reason, /Boston and Charlestown/i);
assert.match(countyGap.status_reason, /Charles River West/i);
assert.match(countyGap.status_reason, /Chelsea, Revere, .* Winthrop/i);
assert.equal(failureRows.length, 0);
assert.equal(nextRows.length, 0);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_county_grade');
assert.equal(countyVerified.evidence_strength, 'strong');
assert.equal(countyVerified.blocker_code, null);
assert.equal(countyVerified.blocker_evidence, null);
assert.equal(countyVerified.sample_count, 5);
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DDS Greater Boston Area Office'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DDS Charles River West Area Office'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DDS Metro Region'));
assert.match(countyVerified.samples.find((sample) => sample.sample_name === 'DDS Greater Boston Area Office').evidence_snippet, /Boston, Brighton, Brookline, Charlestown/i);
assert.match(countyVerified.samples.find((sample) => sample.sample_name === 'DDS Charles River West Area Office').evidence_snippet, /Chelsea, Revere, Somerville, Waltham, Watertown, Winthrop/i);

assert.match(report, /Massachusetts is now COMPLETE and index_safe=true/i);
assert.match(report, /current official DDS area-office leaves explicitly cover all Suffolk County municipalities/i);
assert.match(handoff, /## Current Complete States[\s\S]*Massachusetts/);
assert.doesNotMatch(handoff, /- Massachusetts:/);
assert.match(lessons, /### Bounded Slug Probes Can Recover Current First-Party Office Leaves Hidden From A Partial Index/);

assert.equal(batchSummary.suffolk_county_cleared, true);
assert.equal(batchSummary.greater_boston_leaf_covers_charlestown, true);
assert.equal(batchSummary.charles_river_west_leaf_covers_winthrop, true);
assert.match(batchReport, /cleared the final Suffolk County blocker/i);

console.log('test-batch394-massachusetts-suffolk-dds-completion-v1: ok');
