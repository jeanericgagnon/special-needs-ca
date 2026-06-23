import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch227NorthCarolinaStatewideSupportRepairV1 } from './run-batch227-north-carolina-statewide-support-repair-v1.mjs';

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

const result = generateBatch227NorthCarolinaStatewideSupportRepairV1();
const summary = readJson('data/generated/north-carolina_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/north-carolina_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/north-carolina_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/north-carolina_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/north-carolina_next_action_queue_v2.jsonl');
const sourceFamilyPacket = readJson('data/generated/north-carolina_statewide_support_source_family_packet_v1.json');
const batchSummary = readJson('data/generated/batch227_north_carolina_statewide_support_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/north-carolina-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 2);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(summary.major_gap_families, []);
assert.ok(!summary.final_blockers.some((row) => row.family === 'protection_and_advocacy'));
assert.ok(!summary.final_blockers.some((row) => row.family === 'parent_training_information_center'));
assert.ok(!summary.final_blockers.some((row) => row.family === 'legal_aid'));

const pnaGap = gapRows.find((row) => row.family === 'protection_and_advocacy');
const ptiGap = gapRows.find((row) => row.family === 'parent_training_information_center');
const legalGap = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(pnaGap.family_status, 'verified_state_grade');
assert.equal(ptiGap.family_status, 'verified_state_grade');
assert.equal(legalGap.family_status, 'verified_state_grade');
assert.match(pnaGap.status_reason, /federally designated protection and advocacy agency/i);
assert.match(ptiGap.status_reason, /North Carolina PTI \(Serving all North Carolina\)/i);
assert.match(legalGap.status_reason, /free legal help to low-income North Carolinians/i);

assert.ok(!failureRows.some((row) => row.family === 'protection_and_advocacy'));
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'));
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'));

const pnaVerified = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
const legalVerified = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(pnaVerified.family_status, 'verified_state_grade');
assert.equal(ptiVerified.family_status, 'verified_state_grade');
assert.equal(legalVerified.family_status, 'verified_state_grade');
assert.equal(pnaVerified.sample_count, 2);
assert.equal(ptiVerified.sample_count, 2);
assert.equal(legalVerified.sample_count, 2);
assert.match(pnaVerified.samples[1].source_url, /disabilityrightsnc\.org/);
assert.match(ptiVerified.samples[0].source_url, /parentcenterhub\.org\/findurcenter\/north-carolina/);
assert.match(legalVerified.samples[1].source_url, /legalaidnc\.org\/get-help/);

assert.ok(!nextRows.some((row) => row.family === 'protection_and_advocacy'));
assert.ok(!nextRows.some((row) => row.family === 'parent_training_information_center'));
assert.ok(!nextRows.some((row) => row.family === 'legal_aid'));

assert.deepEqual(sourceFamilyPacket.missing_families, []);
assert.equal(sourceFamilyPacket.weak_family, null);
assert.equal(sourceFamilyPacket.resolved_families.parent_training_information_center, 'https://www.parentcenterhub.org/findurcenter/north-carolina/');

assert.equal(batchSummary.protectionAndAdvocacyRepaired, true);
assert.equal(batchSummary.ptiRepaired, true);
assert.equal(batchSummary.legalAidRepaired, true);

assert.ok(report.includes('Statewide support families are no longer blockers.'));
assert.ok(report.includes('North Carolina PTI (Serving all North Carolina)'));
assert.ok(lessons.includes('### Authoritative PTI Leaves Can Upgrade A First-Party Homepage That Lacks Explicit Designation Text'));

console.log('test-batch227-north-carolina-statewide-support-repair-v1: ok');
