import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch311NewYorkMybenefitsBeginRefreshV1 } from './run-batch311-new-york-mybenefits-begin-refresh-v1.mjs';

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

const result = generateBatch311NewYorkMybenefitsBeginRefreshV1();
const summary = readJson('data/generated/new-york_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-york_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-york_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-york_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-york_next_action_queue_v2.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const allStateQueue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-york-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch311_new_york_mybenefits_begin_refresh_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch311-new-york-mybenefits-begin-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'nygov_links_exact_otda_successor_leaves_that_still_reset_while_mybenefits_begin_page_recovers_without_county_local_contract_and_health_ny_ldss_family_remains_unusable');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_health_hostwide_403_plus_otda_successor_resets_plus_mybenefits_begin_without_county_local_contract');
assert.match(gap.status_reason, /mybenefits\.ny\.gov\/mybenefits\/begin/);
assert.match(gap.status_reason, /still only an online portal surface/);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'nygov_links_exact_otda_successor_leaves_that_still_reset_while_mybenefits_begin_only_exposes_online_portal_and_health_ny_ldss_family_stays_blocked');
assert.match(failure.evidence, /myBenefits/);
assert.match(failure.evidence, /workingfamilies\/dss\.asp/);
assert.match(failure.evidence, /mybenefits\.ny\.gov\/mybenefits\/begin/);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_health_hostwide_403_plus_otda_successor_resets_plus_mybenefits_begin_without_county_local_contract');
assert.ok(verified.samples.some((sample) => sample.sample_name === 'MyBenefits begin page'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.ny.gov/services/apply-cooling-assistance'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://otda.ny.gov/programs/heap/contacts/'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_public_otda_successor_leaf_or_county_owned_locator_is_verified');
assert.match(next.evidence, /myBenefits/);

const nyAudit = allStateAudit.states.find((row) => row.stateId === 'new-york');
assert.equal(nyAudit.packetBatch, 'batch311_new_york_mybenefits_begin_refresh_v1');
assert.equal(nyAudit.packetPrimaryGapReason, 'nygov_links_exact_otda_successor_leaves_that_still_reset_while_mybenefits_begin_page_recovers_without_county_local_contract_and_health_ny_ldss_family_remains_unusable');
assert.equal(nyAudit.familyStatuses.county_local_disability_resources, 'blocked_health_hostwide_403_plus_otda_successor_resets_plus_mybenefits_begin_without_county_local_contract');

const nyQueue = allStateQueue.find((row) => row.state === 'new-york');
assert.equal(nyQueue.primary_gap_reason, 'nygov_links_exact_otda_successor_leaves_that_still_reset_while_mybenefits_begin_page_recovers_without_county_local_contract_and_health_ny_ldss_family_remains_unusable');

assert.ok(stateReport.includes('`mybenefits.ny.gov` has recovered to a public `begin` page'));
assert.ok(allStateReport.includes('mybenefits.ny.gov` recovered to a public begin page'));
assert.ok(handoff.includes('## Current Focus State: New York'));
assert.ok(handoff.includes('myBenefits root'));
assert.ok(handoff.includes('## Next State Order After New York'));
assert.ok(lessons.includes('### A Recovered Benefits Portal Begin Page Is Not County-Local Proof By Itself'));

assert.equal(batchSummary.health_ldss_status, 403);
assert.equal(batchSummary.otda_heap_contacts_status, 'connection_reset');
assert.equal(batchSummary.otda_root_status, 'connection_reset');
assert.equal(batchSummary.mybenefits_root_status, 200);
assert.equal(batchSummary.mybenefits_final_url, 'https://mybenefits.ny.gov/mybenefits/begin');
assert.ok(batchReport.includes('`mybenefits.ny.gov` no longer resets and now lands publicly on `/mybenefits/begin`'));

console.log('test-batch311-new-york-mybenefits-begin-refresh-v1: ok');
