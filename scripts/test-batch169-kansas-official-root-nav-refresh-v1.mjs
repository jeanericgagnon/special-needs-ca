import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch169KansasOfficialRootNavRefreshV1 } from './run-batch169-kansas-official-root-nav-refresh-v1.mjs';

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

const summary = generateBatch169KansasOfficialRootNavRefreshV1();
const stateSummary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const ddPacket = readJson('data/generated/kansas_developmental_disability_idd_authority_repair_packet_v1.json');
const educationPacket = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const batchSummary = readJson('data/generated/batch169_kansas_official_root_nav_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.state, 'kansas');
assert.equal(stateSummary.classification, 'BLOCKED');
assert.equal(stateSummary.index_safe, false);
assert.equal(stateSummary.primary_gap_reason, 'kansas_dd_stack_is_uniformly_403_blocked_and_live_ksde_directory_roots_still_lack_local_contract');

const ddBlocker = stateSummary.final_blockers.find((row) => row.family === 'developmental_disability_idd_authority');
const eduBlocker = stateSummary.final_blockers.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(ddBlocker.failure_code, 'kdads_and_kancare_roots_and_dd_surfaces_now_return_uniform_http_403');
assert.equal(eduBlocker.failure_code, 'live_ksde_directory_roots_preserved_but_no_county_or_district_special_education_contract_on_disk');

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(ddGap.family_status, 'blocked_uniform_http_403_dd_stack');
assert.equal(eduGap.family_status, 'blocked_live_ksde_directory_roots_without_local_contract');

const ddFailure = failureRows.find((row) => row.family === 'developmental_disability_idd_authority');
const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(ddFailure.evidence, /HTTP 403 Forbidden/);
assert.match(eduFailure.evidence, /uapps\.ksde\.gov\/Directory_Rpts\/default\.aspx/);

const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(ddVerified.sample_count, 3);
assert.equal(eduVerified.sample_count, 3);
assert.equal(ddVerified.samples[0].source_url, 'https://www.kdads.ks.gov/');
assert.equal(eduVerified.samples[2].source_url, 'https://uapps.ksde.gov/Directory_Rpts/default.aspx');

const ddNext = nextRows.find((row) => row.family === 'developmental_disability_idd_authority');
const eduNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(ddNext.next_action, 'browser_assisted_or_alternate_official_dd_leaf_after_uniform_403_confirmation');
assert.equal(eduNext.next_action, 'author_reviewed_district_owned_special_education_leaves_from_uapps_directory_reports_or_keep_kansas_blocked');

assert.equal(ddPacket.current_problem_metrics.kdadsRobotsReadable, false);
assert.equal(ddPacket.current_problem_metrics.kdadsRootBlocked, true);
assert.ok(educationPacket.representative_sources.includes('https://www.ksde.gov/data-and-reporting/directories'));
assert.ok(educationPacket.representative_sources.includes('https://uapps.ksde.gov/Directory_Rpts/default.aspx'));

assert.equal(batchSummary.kdads_uniform_403, true);
assert.equal(batchSummary.index_safe, false);
assert.match(report, /School District Maps/);
assert.match(report, /Directory Reports/);
assert.match(lessons, /Live Section Roots Can Replace Dead Deep Links Without Clearing The Local Contract/);

console.log('test-batch169-kansas-official-root-nav-refresh-v1: ok');
