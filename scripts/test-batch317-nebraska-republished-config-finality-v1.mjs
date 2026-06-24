import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch317NebraskaRepublishedConfigFinalityV1 } from './run-batch317-nebraska-republished-config-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, filePath), 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(path.join(repoRoot, filePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch317NebraskaRepublishedConfigFinalityV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch317_nebraska_republished_config_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch317-nebraska-republished-config-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'freshly_republished_public_office_experience_still_only_wraps_42_offices_37_distinct_counties_and_no_statewide_assignment_contract');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_republished_public_office_experience_still_without_assignment_contract');
assert.match(gap.status_reason, /fresh publication timestamps/i);
assert.match(gap.status_reason, /42 office rows versus 93 county rows/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(failure);
assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /1772143020147/);
assert.match(failure.evidence, /1772143020199/);
assert.match(failure.evidence, /office count query still returns `42`/i);
assert.match(failure.evidence, /county boundary count query still returns `93`/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified);
assert.equal(verified.blocker_code, failure.failure_code);
assert.match(verified.blocker_evidence, /42-office \/ 93-county stack/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska refreshed ExperienceBuilder item data'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska office layer row count remains partial'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska county boundary count remains 93'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska distinct office counties remain partial'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(next);
assert.equal(next.next_action, 'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published');
assert.match(next.evidence, /42 offices, 93 county boundaries, empty relationships, and 37 distinct office counties/i);

const nebraskaQueue = queueRows.find((row) => row.state === 'nebraska');
assert.ok(nebraskaQueue);
assert.equal(nebraskaQueue.primary_gap_reason, summary.primary_gap_reason);

const nebraskaAudit = allStateAudit.states.find((row) => row.stateId === 'nebraska');
assert.ok(nebraskaAudit);
assert.equal(nebraskaAudit.packetBatch, 'batch317_nebraska_republished_config_finality_v1');
assert.equal(nebraskaAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.equal(batchSummary.item_data_timestamp, 1772143020147);
assert.equal(batchSummary.config_resource_created, 1772143020199);
assert.equal(batchSummary.office_count, 42);
assert.equal(batchSummary.county_count, 93);
assert.equal(batchSummary.distinct_office_counties, 37);
assert.equal(batchSummary.office_layer_relationships_empty, true);
assert.equal(batchSummary.county_layer_relationships_empty, true);

assert.match(stateReport, /freshly republished public office experience/i);
assert.match(handoff, /## Current Focus State: Nebraska/);
assert.match(handoff, /freshly republished/i);
assert.match(lessons, /### Freshly Republished ArcGIS Experiences Can Still Preserve The Same Final Blocker/);
assert.match(allStateReport, /freshly republished public ArcGIS office experience/i);
assert.match(batchReport, /42 office rows against 93 county rows/i);

const completeCount = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 24);
assert.equal(blockedCount, 26);

console.log('test-batch317-nebraska-republished-config-finality-v1: ok');
