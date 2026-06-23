import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch294NewYorkNycCseBoroughClearV1 } from './run-batch294-new-york-nyc-cse-borough-clear-v1.mjs';

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

const result = generateBatch294NewYorkNycCseBoroughClearV1();
const summary = readJson('data/generated/new-york_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-york_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-york_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-york_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-york_next_action_queue_v2.jsonl');
const educationPacket = readJson('data/generated/new-york_district_or_county_education_routing_boces_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-york-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch294_new_york_nyc_cse_borough_clear_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch294-new-york-nyc-cse-borough-clear-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.education_now_verified, true);

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'nygov_linked_exact_otda_successor_leaves_still_reset_while_health_ny_ldss_family_remains_unusable');
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'county_local_disability_resources');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'verified_state_grade');
assert.match(eduGap.status_reason, /NYC DOE CSE page now closes the five-borough remainder directly/i);
assert.match(eduGap.status_reason, /Bronx/);
assert.match(eduGap.status_reason, /Staten Island/);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_health_hostwide_403');

assert.equal(failureRows.some((row) => row.family === 'district_or_county_education_routing'), false);
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'nygov_links_exact_otda_successor_leaves_but_successor_host_still_resets');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'verified_state_grade');
assert.equal(eduVerified.evidence_strength, 'high');
assert.equal(eduVerified.sample_count, 7);
assert.equal(eduVerified.samples.some((row) => row.sample_name === 'NYC DOE Bronx CSE routing'), true);
assert.equal(eduVerified.samples.some((row) => row.sample_name === 'NYC DOE Queens CSE routing'), true);
assert.equal(eduVerified.samples.some((row) => row.sample_name === 'NYC DOE Brooklyn CSE routing'), true);
assert.equal(eduVerified.samples.some((row) => row.sample_name === 'NYC DOE Manhattan CSE routing'), true);
assert.equal(eduVerified.samples.some((row) => row.sample_name === 'NYC DOE Staten Island CSE routing'), true);

assert.equal(nextRows.some((row) => row.family === 'district_or_county_education_routing'), false);
const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_public_otda_successor_leaf_or_county_owned_locator_is_verified');

assert.equal(educationPacket.current_metrics.nycBoroughRemainderCount, 0);
assert.equal(educationPacket.current_metrics.reviewedOfficialNycBoroughContacts, 5);
assert.deepEqual(educationPacket.covered_nyc_borough_routes.richmond, ['CSE11 district 31']);

const queueRow = queueRows.find((row) => row.state === 'new-york');
assert.equal(queueRow.weak_critical_families, 1);
assert.equal(queueRow.primary_gap_reason, 'nygov_linked_exact_otda_successor_leaves_still_reset_while_health_ny_ldss_family_remains_unusable');

const auditNy = allStateAudit.states.find((row) => row.stateId === 'new-york');
assert.equal(auditNy.weakCriticalFamilies, 1);
assert.equal(auditNy.strongCriticalFamilies, 11);
assert.equal(auditNy.completenessPct, 91);
assert.equal(auditNy.familyStatuses.district_or_county_education_routing, 'verified_state_grade');
assert.equal(auditNy.familyStatuses.county_local_disability_resources, 'blocked_health_hostwide_403');
assert.equal(auditNy.packetPrimaryGapReason, 'nygov_linked_exact_otda_successor_leaves_still_reset_while_health_ny_ldss_family_remains_unusable');

assert.match(stateReport, /Education is no longer a New York blocker\./);
assert.match(stateReport, /official NYC DOE Committees on Special Education page now closes the five-borough remainder/i);
assert.match(allStateReport, /New York remains blocked, but it is now blocked only on county-local routing/i);

assert.match(handoff, /## Current Focus State: Oklahoma/);
assert.match(handoff, /## Next State Order After New York/);
assert.match(handoff, /1\. Oklahoma/);

assert.match(lessons, /Official CSE Office Tables Can Clear NYC Borough Routing/);

assert.equal(batchSummary.education_now_verified, true);
assert.equal(batchSummary.nycBoroughRoutesRecovered, 5);
assert.equal(batchSummary.remaining_blocker_family_count, 1);
assert.match(batchReport, /cleared the New York education blocker/i);

console.log('test-batch294-new-york-nyc-cse-borough-clear-v1: ok');
