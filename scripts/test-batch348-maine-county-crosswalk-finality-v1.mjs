import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch348MaineCountyCrosswalkFinalityV1 } from './run-batch348-maine-county-crosswalk-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch348MaineCountyCrosswalkFinalityV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch348_maine_county_crosswalk_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch348-maine-county-crosswalk-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch348_maine_county_crosswalk_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_dhhs_office_page_and_same_host_contact_sitemap_surfaces_still_expose_no_county_or_service_area_crosswalk');
assert.equal(summary.recommended_batch, 'hold_for_new_official_county_crosswalk_contract');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_district_office_locations_and_same_host_followups_without_county_crosswalk');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_district_office_locations_and_same_host_followups_without_county_crosswalk');
assert.match(countyGap.status_reason, /same-host follow-up surfaces stay negative/i);
assert.match(countyGap.status_reason, /DHHS sitemap/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_dhhs_office_page_and_same_host_followups_expose_zero_county_or_service_area_fields');
assert.match(countyFailure.evidence, /contact root, administrative offices page, offices\/divisions page, and DHHS sitemap/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 5);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'DHHS contact root'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'DHHS sitemap'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_official_maine_dhhs_county_or_service_area_crosswalk_is_publicly_reviewable');

const queueRow = queueRows.find((row) => row.state === 'maine');
assert.equal(queueRow.primary_gap_reason, 'official_dhhs_office_page_and_same_host_contact_sitemap_surfaces_still_expose_no_county_or_service_area_crosswalk');
assert.equal(queueRow.repair_lane, 'blocked_until_new_official_public_county_contract');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'maine');
assert.equal(auditRow.packetBatch, 'batch348_maine_county_crosswalk_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'official_dhhs_office_page_and_same_host_contact_sitemap_surfaces_still_expose_no_county_or_service_area_crosswalk');
assert.equal(auditRow.familyStatuses.county_local_disability_resources, 'blocked_district_office_locations_and_same_host_followups_without_county_crosswalk');

assert.match(stateReport, /same-host contact, sitemap, offices\/divisions, and administrative-office follow-ups/i);
assert.match(allStateReport, /Maine remains blocked on a stronger county-local finality check/i);
assert.match(handoff, /Current Focus State: Maine/);
assert.match(handoff, /Maine DHHS Contact root/);
assert.match(handoff, /Maine DHHS Sitemap/);
assert.match(lessons, /Same-Host Contact, Sitemap, And Office Hubs Can Be Enough To Freeze A County-Crosswalk Blocker/);

assert.equal(batchSummary.county_mentions_found, 0);
assert.equal(batchSummary.service_area_fields_found, 0);
assert.equal(batchSummary.result, 'source_final_without_public_county_crosswalk');
assert.match(batchReport, /same-host finality check/i);

console.log('test-batch348-maine-county-crosswalk-finality-v1: ok');
