import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch162MississippiFirstPartyRepairV1 } from './run-batch162-mississippi-first-party-repair-v1.mjs';

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

const result = generateBatch162MississippiFirstPartyRepairV1();
const summary = readJson('data/generated/mississippi_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/mississippi_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/mississippi_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/mississippi_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/mississippi_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch162_mississippi_first-party_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/mississippi-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 92);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing']);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(summary.primary_gap_reason, 'mdek12_local_directory_paths_return_403');
assert.deepEqual(summary.final_blockers.map((row) => row.family), ['district_or_county_education_routing']);

const paGap = gapRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(paGap.family_status, 'verified_state_grade');
assert.match(paGap.status_reason, /Protection & Advocacy agency/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_county_grade');
assert.match(countyGap.status_reason, /82 unique Mississippi county names/i);

assert.equal(failureRows.some((row) => row.family === 'protection_and_advocacy'), false);
assert.equal(failureRows.some((row) => row.family === 'county_local_disability_resources'), false);
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'district_or_county_education_routing');

const paVerified = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(paVerified.family_status, 'verified_state_grade');
assert.equal(paVerified.blocker_code, null);
assert.ok(paVerified.samples.some((row) => row.source_url === 'http://www.drms.ms/about'));
assert.ok(paVerified.samples.some((row) => /Protection & Advocacy agency/i.test(row.evidence_snippet)));

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_county_grade');
assert.equal(countyVerified.blocker_code, null);
assert.ok(countyVerified.samples.some((row) => /82 unique county names/i.test(row.evidence_snippet)));
assert.ok(countyVerified.samples.some((row) => /Adams County Office/i.test(row.evidence_snippet)));
assert.ok(countyVerified.samples.some((row) => /Yazoo County Office/i.test(row.evidence_snippet)));

assert.deepEqual(batchSummary.repaired_families, ['protection_and_advocacy', 'county_local_disability_resources']);
assert.equal(batchSummary.removed_summary_only_blocker, 'legal_aid');
assert.deepEqual(batchSummary.remaining_final_blockers, ['district_or_county_education_routing']);
assert.ok(report.includes('Protection and advocacy is now repaired'));
assert.ok(report.includes('County/local disability resources now pass at county grade'));
assert.ok(lessons.includes('If HTTPS Fails On A First-Party Rights Site, Try The Same Host Over Plain HTTP Before Giving Up'));
assert.ok(lessons.includes('Contact Pages Can Hide Full County-Office Tables In Plain HTML'));

console.log('test-batch162-mississippi-first-party-repair-v1: ok');
