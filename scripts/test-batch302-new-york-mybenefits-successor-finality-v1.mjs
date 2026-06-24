import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch302NewYorkMybenefitsSuccessorFinalityV1 } from './run-batch302-new-york-mybenefits-successor-finality-v1.mjs';

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

const result = generateBatch302NewYorkMybenefitsSuccessorFinalityV1();
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
const batchSummary = readJson('data/generated/batch302_new_york_mybenefits_successor_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch302-new-york-mybenefits-successor-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'nygov_linked_exact_otda_and_mybenefits_successor_leaves_still_reset_while_health_ny_ldss_family_remains_unusable');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_health_hostwide_403');
assert.match(countyGap.status_reason, /mybenefits\.ny\.gov/);
assert.match(countyGap.status_reason, /apply in person at their local district office/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'nygov_links_exact_otda_and_mybenefits_successor_leaves_but_successor_family_still_resets');
assert.match(countyFailure.evidence, /mybenefits\.ny\.gov/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 10);
assert.equal(countyVerified.blocker_code, 'nygov_links_exact_otda_and_mybenefits_successor_leaves_but_successor_family_still_resets');
assert.ok(countyVerified.samples.some((row) => row.source_url === 'https://mybenefits.ny.gov/'));
assert.ok(countyVerified.samples.some((row) => row.source_url === 'https://www.ny.gov/services/apply-cooling-assistance'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_public_otda_successor_leaf_or_county_owned_locator_is_verified');
assert.match(countyNext.evidence, /OTDA and MyBenefits successor surfaces/);

assert.equal(packet.current_metrics.boundedMyBenefitsFailures, 1);
assert.equal(packet.replacement_host_probe.outcome, 'nygov_points_to_exact_otda_and_mybenefits_successor_surfaces_but_every_public_successor_surface_still_resets');
assert.ok(packet.replacement_host_probe.exact_urls.includes('https://mybenefits.ny.gov/'));

const queueRow = queueRows.find((row) => row.state === 'new-york');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.index_safe, false);
assert.equal(queueRow.primary_gap_reason, 'nygov_linked_exact_otda_and_mybenefits_successor_leaves_still_reset_while_health_ny_ldss_family_remains_unusable');

const auditNy = allStateAudit.states.find((row) => row.stateId === 'new-york');
assert.equal(auditNy.classification, 'BLOCKED');
assert.equal(auditNy.packetBatch, 'batch_302_new_york_mybenefits_successor_finality_v1');
assert.equal(auditNy.packetPrimaryGapReason, 'nygov_linked_exact_otda_and_mybenefits_successor_leaves_still_reset_while_health_ny_ldss_family_remains_unusable');

assert.ok(stateReport.includes('mybenefits.ny.gov'));
assert.ok(stateReport.includes('education is no longer a New York blocker'));
assert.ok(allStateReport.includes('OTDA successor leaves and `mybenefits.ny.gov`'));

assert.ok(handoff.includes('## Current Focus State: Oklahoma'));
assert.ok(handoff.includes('dead `https://dhhs.oklahoma.gov/locations` host'));

assert.equal(batchSummary.reviewedStatePortalSuccessorPages, 2);
assert.equal(batchSummary.myBenefitsSuccessorFailures, 1);
assert.equal(batchSummary.totalBoundedSuccessorFamilyFailures, 10);
assert.ok(batchReport.includes('`mybenefits.ny.gov` also resets'));

console.log('test-batch302-new-york-mybenefits-successor-finality-v1: ok');
