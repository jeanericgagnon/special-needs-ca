import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch170MinnesotaPtiLiveRecheckV1 } from './run-batch170-minnesota-pti-live-recheck-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), 'utf8'));
}

function readJsonl(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch170MinnesotaPtiLiveRecheckV1();
const summary = readJson('data/generated/minnesota_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/minnesota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/minnesota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/minnesota_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/minnesota_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch170_minnesota_pti_live_recheck_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/minnesota-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.state, 'minnesota');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const ptiGap = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiGap.family_status, 'blocked_current_first_party_support_without_explicit_pti_designation');

const ptiFailure = failureRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiFailure.failure_code, 'current_pacer_pages_and_retired_pti_paths_do_not_preserve_explicit_pti_designation');
assert.match(ptiFailure.evidence, /pacer\.org\/parent\/php\/PIC\/fedfund\.asp/);
assert.match(ptiFailure.evidence, /advice-and-guidance/i);

const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiVerified.sample_count, 2);
assert.equal(ptiVerified.samples[0].source_url, 'https://www.pacer.org/');
assert.equal(ptiVerified.samples[1].source_url, 'https://www.pacer.org/parent/php/PIC/fedfund.asp');

const ptiNext = nextRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(ptiNext.next_action, 'hold_blocked_until_live_first_party_pti_designation_page_is_preserved');

assert.equal(batchSummary.pti_blocker_refreshed, true);
assert.match(report, /retired PTI-specific path family/i);
assert.match(lessons, /Retired PTI Microsites Should Be Rechecked Against Current First-Party Hubs Before They Stay Verified/);

console.log('test-batch170-minnesota-pti-live-recheck-v1: ok');
