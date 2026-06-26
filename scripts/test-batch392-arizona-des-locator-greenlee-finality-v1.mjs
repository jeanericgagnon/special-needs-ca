import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const summary = readJson(path.join(repoRoot, 'data', 'generated', 'arizona_california_grade_summary_v2.json'));
const gapRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'arizona_gap_matrix_v2.jsonl'));
const failureRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'arizona_failure_ledger_v2.jsonl'));
const verifiedRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'arizona_verified_sources_v1.jsonl'));
const nextRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'arizona_next_action_queue_v2.jsonl'));
const audit = readJson(path.join(repoRoot, 'data', 'generated', 'all_state_california_grade_audit_v3.json'));
const queueRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'all_state_priority_queue_v3.jsonl'));
const batchSummary = readJson(path.join(repoRoot, 'data', 'generated', 'batch392_arizona_des_locator_greenlee_finality_summary_v1.json'));
const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'arizona-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch392_arizona_des_locator_greenlee_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_des_locator_returns_14_explicit_counties_and_greenlee_zip_served_localities_but_no_reviewed_greenlee_county_contract');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_des_locator_explicit_for_14_counties_with_greenlee_locality_zip_coverage_but_no_county_level_contract');
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'county_local_disability_resources');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyGap);
assert.equal(countyGap.family_status, 'blocked_des_locator_explicit_for_14_counties_with_greenlee_locality_zip_coverage_but_no_county_level_contract');
assert.match(countyGap.status_reason, /explicit top-level `county` field covering 14 Arizona counties/i);
assert.match(countyGap.status_reason, /Greenlee locality ZIPs `85533`, `85534`, and `85540`/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.equal(failureRows[0].failure_code, 'official_des_locator_now_proves_14_counties_and_greenlee_locality_zips_but_still_no_explicit_greenlee_county_assignment');
assert.match(failureRows[0].evidence, /public Visualforce service lookup exposes a `Developmental Disability Services` lane/i);
assert.match(failureRows[0].evidence, /Greenlee County preserves useful links for the Town of Clifton, Town of Duncan, and Town of Morenci/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyVerified);
assert.equal(countyVerified.sample_count, 8);
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DES DDS office-data county set'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DDS Tucson office Greenlee ZIP coverage'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Greenlee County useful-links page'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Town of Clifton first-party ZIP'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Town of Duncan first-party ZIP'));
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Town of Morenci first-party ZIP'));
assert.match(countyVerified.blocker_evidence, /14 Arizona counties/i);
assert.match(countyVerified.blocker_evidence, /Greenlee locality ZIPs `85533`, `85534`, and `85540`/i);

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.equal(nextRows[0].next_action, 'hold_blocked_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_reviewable_county_to_office_contract');

const auditRow = audit.states.find((row) => row.stateId === 'arizona');
assert.equal(auditRow.packetBatch, 'batch392_arizona_des_locator_greenlee_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'official_des_locator_returns_14_explicit_counties_and_greenlee_zip_served_localities_but_no_reviewed_greenlee_county_contract');
assert.equal(auditRow.familyStatuses.county_local_disability_resources, 'blocked_des_locator_explicit_for_14_counties_with_greenlee_locality_zip_coverage_but_no_county_level_contract');

const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(queueRow.primary_gap_reason, 'official_des_locator_returns_14_explicit_counties_and_greenlee_zip_served_localities_but_no_reviewed_greenlee_county_contract');

assert.equal(batchSummary.explicit_counties_from_des_locator, 14);
assert.equal(batchSummary.missing_explicit_county, 'Greenlee');
assert.deepEqual(batchSummary.greenlee_zip_served_values, ['85533', '85534', '85540']);

assert.match(report, /proves explicit county-local routing for 14 counties and preserves disability-specific Greenlee locality ZIP coverage/i);
assert.match(handoff, /- Arizona: `official_des_locator_returns_14_explicit_counties_and_greenlee_zip_served_localities_but_no_reviewed_greenlee_county_contract`/);
assert.match(lessons, /Public Visualforce Locator APIs Can Become Reviewable Official Evidence/);

console.log('test-batch392-arizona-des-locator-greenlee-finality-v1: ok');
