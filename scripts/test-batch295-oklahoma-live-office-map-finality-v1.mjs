import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch295OklahomaLiveOfficeMapFinalityV1 } from './run-batch295-oklahoma-live-office-map-finality-v1.mjs';

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

const result = generateBatch295OklahomaLiveOfficeMapFinalityV1();
const summary = readJson('data/generated/oklahoma_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/oklahoma_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/oklahoma_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/oklahoma_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/oklahoma_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/oklahoma-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch295_oklahoma_live_office_map_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch295-oklahoma-live-office-map-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.liveSuccessorOfficeMapVerified, true);
assert.equal(result.officeMapPlacemarkCount, 60);
assert.equal(result.officeMapCountyCoverageCount, 46);
assert.equal(result.remainingCountyGapCount, 31);

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_okdhs_office_map_only_materializes_46_counties_and_no_disability_local_export_closes_the_77_county_contract');
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'county_local_disability_resources');
assert.equal(summary.final_blockers[0].failure_code, 'live_okdhs_map_only_covers_46_counties_and_remaining_surfaces_are_not_county_grade_disability_routing');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_office_map_incomplete_county_contract');
assert.match(countyGap.status_reason, /46 county-keyed locations/i);
assert.match(countyGap.status_reason, /remaining 31 counties/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'live_okdhs_map_only_covers_46_counties_and_remaining_surfaces_are_not_county_grade_disability_routing');
assert.match(countyFailure.evidence, /contact-us\.html/);
assert.match(countyFailure.evidence, /google my maps dataset/i);
assert.match(countyFailure.evidence, /46 county-keyed locations/i);
assert.match(countyFailure.evidence, /child-support-specific/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_live_office_map_incomplete_county_contract');
assert.equal(countyVerified.evidence_strength, 'medium');
assert.equal(countyVerified.sample_count, 4);
assert.equal(countyVerified.samples.some((row) => row.sample_name === 'Oklahoma Human Services public office-map KML'), true);
assert.equal(countyVerified.samples.some((row) => row.sample_name === 'Oklahoma DDS Apply for Services page'), true);
assert.equal(countyVerified.samples.some((row) => row.sample_name === 'Oklahoma child-support office tree is service-specific'), true);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_live_oklahoma_human_services_county_export_or_county_owned_local_office_leaves_cover_the_remaining_31_counties');

const queueRow = queueRows.find((row) => row.state === 'oklahoma');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.primary_gap_reason, 'live_okdhs_office_map_only_materializes_46_counties_and_no_disability_local_export_closes_the_77_county_contract');

const auditOklahoma = allStateAudit.states.find((row) => row.stateId === 'oklahoma');
assert.equal(auditOklahoma.classification, 'BLOCKED');
assert.equal(auditOklahoma.packetPrimaryGapReason, 'live_okdhs_office_map_only_materializes_46_counties_and_no_disability_local_export_closes_the_77_county_contract');
assert.equal(auditOklahoma.familyStatuses.county_local_disability_resources, 'blocked_live_office_map_incomplete_county_contract');

assert.match(stateReport, /public KML only materializes 46 county-keyed locations/i);
assert.match(stateReport, /child-support county-office tree is official and county-keyed, but it is service-specific/i);
assert.match(allStateReport, /Oklahoma remains blocked, but the blocker is now narrowed to a live official Oklahoma Human Services office-map lane/i);

assert.match(handoff, /Current Focus State: Oklahoma/);
assert.match(handoff, /Public Oklahoma Human Services office-map KML/);
assert.match(handoff, /46 county-keyed locations/);
assert.match(handoff, /1\. Oregon/);

assert.match(lessons, /Public Office-Map KML Feeds Still Need A Full County-Coverage Audit/);

assert.equal(batchSummary.liveSuccessorOfficeMapVerified, true);
assert.equal(batchSummary.officeMapCountyCoverageCount, 46);
assert.equal(batchSummary.remainingCountyGapCount, 31);
assert.match(batchReport, /replaced the stale dead-host-only Oklahoma blocker with the live official office-map reality/i);

console.log('test-batch295-oklahoma-live-office-map-finality-v1: ok');
