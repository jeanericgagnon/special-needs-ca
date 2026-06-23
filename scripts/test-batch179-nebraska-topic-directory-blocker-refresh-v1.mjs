import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch179NebraskaTopicDirectoryBlockerRefreshV1 } from './run-batch179-nebraska-topic-directory-blocker-refresh-v1.mjs';

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

generateBatch179NebraskaTopicDirectoryBlockerRefreshV1();

const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch179_nebraska_topic_directory_blocker_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const educationBlocker = summary.final_blockers.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationBlocker);
assert.match(educationBlocker.evidence, /SPED Contact List-Directory by Topic/i);
assert.match(educationBlocker.evidence, /ESU 9/i);
assert.match(educationBlocker.evidence, /county-to-ESU assignments/i);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationGap);
assert.match(educationGap.status_reason, /SPED Contact List-Directory by Topic/i);
assert.match(educationGap.status_reason, /ESU 9/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationFailure);
assert.match(educationFailure.evidence, /SPED Contact List-Directory by Topic/i);
assert.match(educationFailure.evidence, /statewide by staff function/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationVerified);
assert.match(educationVerified.query_basis, /topic-directory PDF/i);
assert.match(educationVerified.blocker_evidence, /county-to-ESU assignments/i);

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationNext);
assert.match(educationNext.evidence, /SPED Contact List-Directory by Topic/i);

assert.equal(batchSummary.state, 'nebraska');
assert.equal(batchSummary.education_blocker_sharpened, true);
assert.equal(batchSummary.blocker_basis, 'live_sped_topic_directory_plus_single_esu_leaf_audit');

assert.match(report, /topic directory PDF/i);
assert.match(report, /county-to-ESU/i);
assert.match(lessons, /Topic-Based SPED Staff Directories Still Need A Local Service-Area Contract/);

console.log('test-batch179-nebraska-topic-directory-blocker-refresh-v1: ok');
