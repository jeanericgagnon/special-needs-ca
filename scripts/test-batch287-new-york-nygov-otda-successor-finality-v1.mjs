import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch287NewYorkNygovOtdaSuccessorFinalityV1 } from './run-batch287-new-york-nygov-otda-successor-finality-v1.mjs';

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

const result = generateBatch287NewYorkNygovOtdaSuccessorFinalityV1();
const summary = readJson('data/generated/new-york_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-york_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-york_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-york_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-york_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/new-york_county_local_disability_resources_health_host_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-york-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch287_new_york_nygov_otda_successor_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch287-new-york-nygov-otda-successor-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_health_hostwide_403');
assert.match(countyGap.status_reason, /ny\.gov/i);
assert.match(countyGap.status_reason, /heap\/contacts/i);
assert.match(countyGap.status_reason, /applications\/4826\.pdf/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'nygov_links_exact_otda_successor_leaves_but_successor_host_still_resets');
assert.match(countyFailure.evidence, /public `ny\.gov` service stack/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 9);
assert.equal(countyVerified.blocker_code, 'nygov_links_exact_otda_successor_leaves_but_successor_host_still_resets');
assert.ok(countyVerified.samples.some((row) => row.source_url === 'https://www.ny.gov/services/social-programs'));
assert.ok(countyVerified.samples.some((row) => row.source_url === 'https://www.ny.gov/services/apply-cooling-assistance'));
assert.ok(countyVerified.samples.some((row) => row.source_url === 'https://otda.ny.gov/programs/heap/contacts/'));
assert.ok(countyVerified.samples.some((row) => row.source_url === 'https://otda.ny.gov/programs/applications/4826.pdf'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_public_otda_successor_leaf_or_county_owned_locator_is_verified');
assert.match(countyNext.evidence, /exact OTDA successor leaves/i);

assert.equal(packet.current_metrics.reviewedStatePortalSuccessorPages, 2);
assert.equal(packet.current_metrics.boundedOtdaReplacementHostFailures, 9);
assert.equal(packet.replacement_host_probe.outcome, 'nygov_points_to_exact_successor_leaves_but_successor_family_still_resets');
assert.ok(packet.replacement_host_probe.nygov_successor_refs.includes('https://www.ny.gov/services/apply-cooling-assistance'));

const queueRow = queueRows.find((row) => row.state === 'new-york');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.index_safe, false);
assert.match(queueRow.primary_gap_reason, /nygov_linked_otda_successor_leaves_still_reset/);

const auditNy = allStateAudit.states.find((row) => row.stateId === 'new-york');
assert.equal(auditNy.classification, 'BLOCKED');
assert.equal(auditNy.packetBatch, 'batch_287_new_york_nygov_otda_successor_finality_v1');
assert.match(auditNy.packetPrimaryGapReason, /nygov_linked_otda_successor_leaves_still_reset/);

assert.ok(stateReport.includes('ny.gov'));
assert.ok(stateReport.includes('HEAP Local District Contact'));
assert.ok(stateReport.includes('exact OTDA successor leaves publicly linked by `ny.gov` still reset'));
assert.ok(allStateReport.includes('New York remains blocked, but the county-local blocker is now tighter'));

assert.ok(handoff.includes('## Current Focus State: Oklahoma'));
assert.ok(handoff.includes('dead `https://dhhs.oklahoma.gov/locations` host'));
assert.ok(handoff.includes('## Next State Order After New York'));
assert.ok(!handoff.includes('## Current Focus State: New York'));

assert.ok(lessons.includes('### A Public State Portal Linking An Exact Successor Leaf Does Not Clear The Blocker If The Successor Host Still Fails'));

assert.equal(batchSummary.reviewedStatePortalSuccessorPages, 2);
assert.equal(batchSummary.otdaExactSuccessorLeafFailures, 4);
assert.equal(batchSummary.totalBoundedOtdaHostFailures, 9);
assert.ok(batchReport.includes('live `ny.gov` service stack points to exact OTDA successor leaves'));

console.log('test-batch287-new-york-nygov-otda-successor-finality-v1: ok');
