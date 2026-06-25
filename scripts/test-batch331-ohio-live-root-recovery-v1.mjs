import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch331OhioLiveRootRecoveryV1 } from './run-batch331-ohio-live-root-recovery-v1.mjs';

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

const result = generateBatch331OhioLiveRootRecoveryV1();
const summary = readJson('data/generated/ohio_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/ohio_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/ohio_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/ohio_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/ohio_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/ohio-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch331_ohio_live_root_recovery_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch331-ohio-live-root-recovery-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.countyRootsLive, true);
assert.equal(result.discoverySurfacesLive, true);
assert.equal(result.advertisedCdjfsLeafCount, 98);
assert.equal(result.advertisedCdjfsCountySlugCount, 88);
assert.equal(result.verifiedCountyLeafCount, 88);
assert.equal(result.countyLeafsWithLocalAddressPhoneFaxHours, true);
assert.equal(result.countyLocalFamilyCleared, true);
assert.equal(result.renderedDirectoryFamilyLive, true);

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch331_ohio_live_root_recovery_v1');
assert.equal(summary.primary_gap_reason, 'live_ohio_county_jfs_directory_now_verifies_88_counties_while_education_inventory_remains_root_only');
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].failure_code, 'education_inventory_still_mostly_root_only_after_bounded_leaf_review');
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing']);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_live_official_county_jfs_directory');
assert.match(countyGap.status_reason, /98 `cdjfs-\*` leaves across 88 county slugs/i);
assert.match(countyGap.status_reason, /county pages preserve county-specific titles plus local address, phone, fax, and hours data/i);

assert.ok(!failureRows.some((row) => row.family === 'county_local_disability_resources'));

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 8);
assert.equal(countyVerified.evidence_strength, 'strong');
assert.equal(countyVerified.blocker_code, null);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Belmont County JFS directory leaf'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Hamilton County JFS directory leaf'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === '88-county live verification sweep'));

assert.ok(!nextRows.some((row) => row.family === 'county_local_disability_resources'));

const queueRow = queueRows.find((row) => row.state === 'ohio');
assert.equal(queueRow.primary_gap_reason, 'live_ohio_county_jfs_directory_now_verifies_88_counties_while_education_inventory_remains_root_only');

const auditOhio = allStateAudit.states.find((row) => row.stateId === 'ohio');
assert.equal(auditOhio.packetBatch, 'batch331_ohio_live_root_recovery_v1');
assert.equal(auditOhio.packetPrimaryGapReason, 'live_ohio_county_jfs_directory_now_verifies_88_counties_while_education_inventory_remains_root_only');
assert.equal(auditOhio.familyStatuses.county_local_disability_resources, 'verified_live_official_county_jfs_directory');

assert.match(stateReport, /County-local disability resources now clear from the live official Ohio JFS county-directory family/i);
assert.match(stateReport, /all 88 county pages preserve county-specific titles plus local address, phone, fax, and hours data/i);
assert.match(allStateReport, /Ohio remains blocked only on education routing/i);
assert.match(handoff, /## Current Focus State: Ohio/);
assert.match(handoff, /county-local JFS family now clears from live official evidence/i);
assert.match(handoff, /education is now the only remaining blocker/i);
assert.match(lessons, /Live Roots And Sitemaps Do Not Clear A Directory Lane When The Rendered Leaves Still 404/);
assert.match(lessons, /Structured County Leaves Can Hide Behind A Statewide Shell/);

assert.equal(batchSummary.countyRootsLive, true);
assert.equal(batchSummary.advertisedCdjfsCountySlugCount, 88);
assert.equal(batchSummary.verifiedCountyLeafCount, 88);
assert.equal(batchSummary.countyLocalFamilyCleared, true);
assert.match(batchReport, /verified live official county-directory coverage/i);

console.log('test-batch331-ohio-live-root-recovery-v1: ok');
