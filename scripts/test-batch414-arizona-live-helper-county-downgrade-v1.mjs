import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch414ArizonaLiveHelperCountyDowngradeV1 } from './run-batch414-arizona-live-helper-county-downgrade-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), 'utf8'));
}

function readJsonl(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch414ArizonaLiveHelperCountyDowngradeV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch414_arizona_live_helper_county_downgrade_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.completeness_pct, 92);
assert.equal(
  summary.primary_gap_reason,
  'bounded_2026_06_26_live_des_in_page_helper_confirms_only_11_explicit_counties_and_no_literal_greenlee_la_paz_mohave_or_yuma_assignment',
);
assert.equal(
  summary.familyStatuses.county_local_disability_resources,
  'blocked_live_des_helper_only_proves_11_explicit_counties_with_no_greenlee_la_paz_mohave_or_yuma_assignment',
);

const countyGap = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
assert.equal(
  countyGap.family_status,
  'blocked_live_des_helper_only_proves_11_explicit_counties_with_no_greenlee_la_paz_mohave_or_yuma_assignment',
);
assert.match(countyGap.status_reason, /explicit office `county` values appear for only 11 counties overall/i);
assert.match(countyGap.status_reason, /no reviewed live helper result for any service code contains a literal `Greenlee`, `La Paz`, `Mohave`, or `Yuma` county assignment/i);
assert.match(countyGap.status_reason, /DDS and Child Care helper results include `85533`, `85534`, and `85540`/i);

const failure = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
assert.equal(
  failure.failure_code,
  'official_des_live_helper_exposes_only_11_explicit_counties_and_no_greenlee_la_paz_mohave_or_yuma_county_assignment',
);
assert.match(failure.evidence, /explicit office `county` values appear for only 11 counties overall/i);
assert.match(failure.evidence, /Greenlee, La Paz, Mohave, and Yuma counties/i);

const verified = readJsonl('data/generated/arizona_verified_sources_v1.jsonl').find((row) => row.family === 'county_local_disability_resources');
assert.equal(
  verified.family_status,
  'blocked_live_des_helper_only_proves_11_explicit_counties_with_no_greenlee_la_paz_mohave_or_yuma_assignment',
);
assert.equal(verified.sample_count, 8);
assert.match(verified.query_basis, /used the app’s own geoSearchRadius helper across all public service codes/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'DES all-service county coverage set'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'DES DDS live helper ZIP coverage'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'DES Child Care live helper ZIP coverage'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'AHCCCS ALTCS Offices page'));

const batchSummary = readJson('data/generated/batch414_arizona_live_helper_county_downgrade_summary_v1.json');
assert.equal(batchSummary.explicit_counties_from_live_helper, 11);
assert.deepEqual(batchSummary.missing_explicit_counties, ['Greenlee', 'La Paz', 'Mohave', 'Yuma']);
assert.deepEqual(batchSummary.zip_only_services_for_greenlee_localities, ['CC', 'DDS']);
assert.deepEqual(batchSummary.counts_unchanged, { complete: 44, blocked: 6, indexSafe: 44 });

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /current live DES helper proves explicit office county fields for only 11 counties/i);
assert.match(report, /No reviewed live DES helper result explicitly labels Greenlee, La Paz, Mohave, or Yuma County/i);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'arizona');
assert.equal(auditRow.packetBatch, 'batch414_arizona_live_helper_county_downgrade_v1');
assert.equal(
  auditRow.packetPrimaryGapReason,
  'bounded_2026_06_26_live_des_in_page_helper_confirms_only_11_explicit_counties_and_no_literal_greenlee_la_paz_mohave_or_yuma_assignment',
);

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /current live DES in-page helper exposes explicit county fields for only 11 counties/i);
assert.match(allStateReport, /Greenlee, La Paz, Mohave, or Yuma/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(
  handoff,
  /- Arizona: `bounded_2026_06_26_live_des_in_page_helper_confirms_only_11_explicit_counties_and_no_literal_greenlee_la_paz_mohave_or_yuma_assignment`/,
);

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.match(lessons, /Prefer Live In-Page Helper Results Over Stale Replay Assumptions/);

console.log('test-batch414-arizona-live-helper-county-downgrade-v1: ok');
