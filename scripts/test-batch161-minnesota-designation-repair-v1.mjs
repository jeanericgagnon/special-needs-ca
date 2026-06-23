import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch161MinnesotaDesignationRepairV1 } from './run-batch161-minnesota-designation-repair-v1.mjs';

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

const result = generateBatch161MinnesotaDesignationRepairV1();
const summary = readJson('data/generated/minnesota_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/minnesota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/minnesota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/minnesota_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/minnesota_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch161_minnesota_designation_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/minnesota-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 75);
assert.equal(summary.strong_critical_families, 9);
assert.equal(summary.weak_critical_families, 3);
assert.deepEqual(summary.major_gap_families, ['parent_training_information_center']);
assert.equal(summary.final_blockers.some((row) => row.family === 'protection_and_advocacy'), false);
assert.equal(summary.final_blockers.some((row) => row.family === 'legal_aid'), false);

const paGap = gapRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(paGap.family_status, 'verified_state_grade');
assert.match(paGap.status_reason, /federally designated Protection and Advocacy agency/i);

assert.equal(failureRows.some((row) => row.family === 'protection_and_advocacy'), false);
assert.equal(nextRows.some((row) => row.family === 'protection_and_advocacy'), false);

const paVerified = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(paVerified.family_status, 'verified_state_grade');
assert.equal(paVerified.blocker_code, null);
assert.equal(paVerified.sample_count, 2);
assert.ok(paVerified.samples.some((row) => row.source_url === 'https://mylegalaid.org/disability-law-center/'));
assert.ok(paVerified.samples.some((row) => /federally designated Protection and Advocacy agency/i.test(row.evidence_snippet)));

assert.deepEqual(batchSummary.remaining_blockers, [
  'official_school_directory_moved_shell_without_live_replacement',
  'reviewed_first_party_support_source_lacks_explicit_pti_designation',
  'minnesota_dhs_county_and_tribal_office_pages_redirect_to_radware_bot_manager',
]);
assert.ok(report.includes('Protection and advocacy is now repaired'));
assert.ok(report.includes('Legal aid remains verified'));
assert.ok(lessons.includes('Dedicated Disability Law Center Pages Can Carry The P&A Proof That Homepages Omit'));

console.log('test-batch161-minnesota-designation-repair-v1: ok');
