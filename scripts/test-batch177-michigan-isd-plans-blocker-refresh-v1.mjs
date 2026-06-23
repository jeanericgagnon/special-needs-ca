import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch177MichiganIsdPlansBlockerRefreshV1 } from './run-batch177-michigan-isd-plans-blocker-refresh-v1.mjs';

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

generateBatch177MichiganIsdPlansBlockerRefreshV1();

const summary = readJson('data/generated/michigan_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/michigan_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/michigan_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/michigan_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/michigan_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch177_michigan_isd_plans_blocker_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/michigan-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(
  summary.primary_gap_reason,
  'official_mde_isd_plans_page_is_guidance_only_and_arcgis_layers_still_lack_local_routing_contract'
);
assert.equal(summary.final_blockers.length, 1);
assert.equal(
  summary.final_blockers[0].failure_code,
  'official_mde_isd_plans_guidance_only_and_arcgis_layers_lack_local_routing_contract'
);
assert.match(summary.final_blockers[0].evidence, /ISD Plans/i);
assert.match(summary.final_blockers[0].evidence, /guidance PDF/i);
assert.match(summary.final_blockers[0].evidence, /generic School District Maps app/i);
assert.match(summary.final_blockers[0].evidence, /83 `official_verified` Michigan school_district rows/i);

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationGap);
assert.match(educationGap.status_reason, /ISD Plans/i);
assert.match(educationGap.status_reason, /guidance/i);
assert.match(educationGap.status_reason, /83 generic county fallback rows/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationFailure);
assert.match(educationFailure.evidence, /ISD Plans/i);
assert.match(educationFailure.evidence, /ArcGIS/i);
assert.match(educationFailure.evidence, /County fallback/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationVerified);
assert.match(educationVerified.query_basis, /ISD Plans leaf/i);
assert.match(educationVerified.query_basis, /bounded DB sample/i);
assert.match(educationVerified.blocker_evidence, /guidance PDF/i);
assert.equal(educationVerified.sample_count, 5);
assert.equal(educationVerified.samples.at(-1).source_type, 'generic_statewide_county_fallback_row');

const nextAction = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(nextAction);
assert.match(nextAction.evidence, /ISD Plans/i);
assert.equal(nextAction.next_action, 'hold_blocked_until_official_district_or_isd_routing_contract_exists');

assert.equal(batchSummary.state, 'michigan');
assert.equal(batchSummary.education_blocker_sharpened, true);
assert.equal(batchSummary.blocker_basis, 'official_isd_plans_leaf_plus_arcgis_contract_audit');

assert.match(report, /ISD Plans/i);
assert.match(report, /guidance PDF/i);
assert.match(report, /generic ArcGIS district\/ISD map/i);
assert.match(report, /83 Michigan school-district rows are cloned `County fallback` records/i);
assert.match(lessons, /Guidance-Only ISD Planning Pages Do Not Satisfy Local Education Routing/);
assert.match(lessons, /Cloned Statewide Education Fallback Rows Do Not Count As Local Routing Coverage/);

console.log('test-batch177-michigan-isd-plans-blocker-refresh-v1: ok');
