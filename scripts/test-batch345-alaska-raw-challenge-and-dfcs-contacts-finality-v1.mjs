import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch345AlaskaRawChallengeAndDfcsContactsFinalityV1 } from './run-batch345-alaska-raw-challenge-and-dfcs-contacts-finality-v1.mjs';

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

await generateBatch345AlaskaRawChallengeAndDfcsContactsFinalityV1();

const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const allStateQueue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchSummary = readJson('data/generated/batch345_alaska_raw_challenge_and_dfcs_contacts_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch345-alaska-raw-challenge-and-dfcs-contacts-finality-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch345_alaska_raw_challenge_and_dfcs_contacts_finality_v1');
assert.equal(summary.primary_gap_reason, 'raw_health_host_challenge_persists_while_browser_reviewed_dpa_offices_page_still_lacks_borough_or_census_area_assignment_and_dfcs_contacts_add_no_local_contract');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_raw_health_host_challenge_plus_browser_reviewed_region_only_offices_page_and_dfcs_contacts_without_county_equivalent_contract');
assert.match(gap.status_reason, /raw low-token lane.*HTTP 403 Cloudflare challenge shells/i);
assert.match(gap.status_reason, /DFCS successor host remains public but still adds no county-equivalent contract/i);
assert.match(gap.status_reason, /Commissioner Department Contacts page still exposes no DPA\/public-assistance office directory/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(failure);
assert.equal(failure.failure_code, 'raw_health_host_still_returns_challenge_shells_and_dfcs_contacts_add_no_borough_or_census_area_contract');
assert.match(failure.evidence, /returned HTTP 403 with the Cloudflare title "Just a moment\.\.\."/i);
assert.match(failure.evidence, /Contacts\/default\.aspx` still exposes only general department-contact sections/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified);
assert.equal(verified.blocker_code, failure.failure_code);
assert.match(verified.query_basis, /raw low-token lane/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DPA offices raw challenge shell' && sample.verification_status === 'blocked'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska DFCS Department Contacts page' && sample.verification_status === 'reviewed'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(next);
assert.equal(next.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_export_or_api');

const alaskaAudit = allStateAudit.states.find((row) => row.stateId === 'alaska');
assert.ok(alaskaAudit);
assert.equal(alaskaAudit.packetBatch, 'batch345_alaska_raw_challenge_and_dfcs_contacts_finality_v1');
assert.equal(alaskaAudit.packetPrimaryGapReason, summary.primary_gap_reason);

const alaskaQueue = allStateQueue.find((row) => row.state === 'alaska');
assert.ok(alaskaQueue);
assert.equal(alaskaQueue.primary_gap_reason, summary.primary_gap_reason);

assert.match(stateReport, /raw low-token lane still gets Cloudflare `Just a moment\.\.\.` 403 shells/i);
assert.match(stateReport, /DFCS Department Contacts page still exposes no DPA\/public-assistance office directory/i);
assert.match(allStateReport, /the raw low-token lane still gets Cloudflare `Just a moment\.\.\.` 403 shells across the health-host DPA family/i);
assert.match(handoff, /## Current Focus State: Alaska/);
assert.match(handoff, /Commissioner Department Contacts page still exposes no DPA\/public-assistance office directory/i);
assert.match(handoff, /## Next State Order After Alaska/);
assert.match(handoff, /1\. Maine/);
assert.match(handoff, /2\. Idaho/);
assert.match(handoff, /3\. Arizona/);

assert.equal(batchSummary.dpa_landing_raw_status, 403);
assert.equal(batchSummary.dpa_offices_raw_status, 403);
assert.equal(batchSummary.dfcs_contacts_status, 200);
assert.equal(batchSummary.browser_review_evidence_retained, true);
assert.match(batchReport, /DFCS Department Contacts surface/i);

console.log('test-batch345-alaska-raw-challenge-and-dfcs-contacts-finality-v1: ok');
