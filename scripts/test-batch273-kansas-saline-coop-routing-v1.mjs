import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch273KansasSalineCoopRoutingV1 } from './run-batch273-kansas-saline-coop-routing-v1.mjs';

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

const result = generateBatch273KansasSalineCoopRoutingV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const leaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch273_kansas_saline_coop_routing_summary_v1.json');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_10_counties_but_export_backed_county_grade_coverage_is_still_incomplete');

const gapRow = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gapRow.family_status, 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade');
assert.match(gapRow.status_reason, /10\/105 counties/i);
assert.match(gapRow.status_reason, /district-linked cooperative/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].failure_code, 'reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_10_counties_but_export_backed_county_grade_coverage_is_still_incomplete');
assert.match(failureRows[0].evidence, /usd305\.com/i);
assert.match(failureRows[0].evidence, /provides special education services to more than 3,100 exceptional students across 12 school districts/i);

assert.ok(leaves.some((row) => row.county_id === 'saline-ks' && row.source_url === 'https://www.305ckcie.com/'));
assert.ok(packet.reviewed_local_leaf_counties.includes('saline-ks'));
assert.equal(packet.reviewed_local_leaf_counties.length, 10);

const verifiedRow = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verifiedRow.blocker_code, 'reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_10_counties_but_export_backed_county_grade_coverage_is_still_incomplete');
assert.ok(verifiedRow.samples.some((sample) => sample.source_url === 'https://www.305ckcie.com/'));
assert.ok(verifiedRow.samples.some((sample) => sample.source_url === 'https://www.305ckcie.com/parents'));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].failure_code, 'reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_10_counties_but_export_backed_county_grade_coverage_is_still_incomplete');

assert.match(report, /Saline now clears from a district-linked cooperative route/i);
assert.ok(handoff.includes('## Current Focus State: Kansas'));
assert.ok(handoff.includes('reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_10_counties_but_export_backed_county_grade_coverage_is_still_incomplete'));
assert.ok(handoff.includes('https://www.305ckcie.com/parents'));
assert.ok(lessons.includes('### A District-Linked Special-Education Cooperative Can Clear A County When The District Labels The Route And The Cooperative States The Service Scope'));

assert.equal(batchSummary.newly_verified_county, 'saline-ks');
assert.equal(batchSummary.reviewed_leaf_count, 10);

console.log('test-batch273-kansas-saline-coop-routing-v1: ok');
