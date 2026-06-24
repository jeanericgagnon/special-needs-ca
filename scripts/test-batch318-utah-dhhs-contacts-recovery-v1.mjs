import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch318UtahDhhsContactsRecoveryV1 } from './run-batch318-utah-dhhs-contacts-recovery-v1.mjs';

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

const result = generateBatch318UtahDhhsContactsRecoveryV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch318_utah_dhhs_contacts_recovery_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch318-utah-dhhs-contacts-recovery-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_utah_dhhs_contacts_page_recovers_but_explicitly_defers_local_office_info_while_surviving_dws_public_api_still_lacks_any_county_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyGap);
assert.equal(countyGap.family_status, 'blocked_live_dhhs_contacts_defers_local_offices_and_dws_inventory_still_lacks_county_contract');
assert.match(countyGap.status_reason, /Please visit specific division or program pages for local office information/i);
assert.match(countyGap.status_reason, /Utah 211/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyFailure);
assert.equal(countyFailure.failure_code, summary.primary_gap_reason);
assert.match(countyFailure.evidence, /Contacts - Utah Department of Health and Human Services/i);
assert.match(countyFailure.evidence, /Please visit specific division or program pages for local office information/i);
assert.match(countyFailure.evidence, /`All Offices`, `USOR Services`, and `Employment Centers`/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyVerified);
assert.equal(countyVerified.blocker_code, countyFailure.failure_code);
assert.match(countyVerified.blocker_evidence, /recovered DHHS contacts page explicitly defers local office information/i);
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DHHS contacts page recovered as central hub'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DHHS contacts page defers local office information'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DHHS contacts page routes community search to Utah 211'));
assert.equal(countyVerified.sample_count, 6);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyNext);
assert.equal(countyNext.next_action, 'hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices');
assert.match(countyNext.evidence, /recovered DHHS contacts page explicitly defers local office information/i);

const utahQueue = queueRows.find((row) => row.state === 'utah');
assert.ok(utahQueue);
assert.equal(utahQueue.primary_gap_reason, summary.primary_gap_reason);

const utahAudit = allStateAudit.states.find((row) => row.stateId === 'utah');
assert.ok(utahAudit);
assert.equal(utahAudit.packetBatch, 'batch318_utah_dhhs_contacts_recovery_v1');
assert.equal(utahAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.equal(batchSummary.dhhs_contacts_status, 200);
assert.equal(batchSummary.dhhs_local_office_deferral_present, true);
assert.equal(batchSummary.dhhs_utah_211_referral_present, true);
assert.equal(batchSummary.services_api_status, 200);
assert.deepEqual(batchSummary.services_api_labels, ['All Offices', 'USOR Services', 'Employment Centers']);
assert.equal(batchSummary.county_endpoint_status, 404);
assert.equal(batchSummary.office_rows, 99);
assert.equal(batchSummary.unique_offices, 45);

assert.match(report, /official Utah DHHS contacts page is live again/i);
assert.match(report, /Utah 211/i);
assert.match(report, /three service labels: `All`, `USOR`, and `EC`/i);
assert.match(handoff, /## Current Focus State: Utah/);
assert.match(handoff, /Utah DHHS Contacts/);
assert.match(handoff, /Utah DHHS WordPress API root/);
assert.match(lessons, /### Recovered Official Contact Hubs Still Fail If They Explicitly Defer Local Office Proof/);
assert.match(allStateReport, /recovered DHHS contacts hub plus the surviving DWS office API/i);
assert.match(batchReport, /publicly reviewable again at HTTP 200/i);

const completeCount = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 24);
assert.equal(blockedCount, 26);

console.log('test-batch318-utah-dhhs-contacts-recovery-v1: ok');
