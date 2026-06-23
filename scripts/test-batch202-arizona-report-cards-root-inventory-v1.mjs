import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch202ArizonaReportCardsRootInventoryV1 } from './run-batch202-arizona-report-cards-root-inventory-v1.mjs';

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

const result = generateBatch202ArizonaReportCardsRootInventoryV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const packet = readJson('data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const batchSummary = readJson('data/generated/batch202_arizona_report_cards_root_inventory_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'des_host_challenge_plus_unmaterialized_report_cards_district_root_inventory');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_report_cards_district_roots_live_but_not_county_keyed');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /reviewable district-detail roots/i);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /county-keyed/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'official_report_cards_district_detail_roots_live_but_not_yet_county_keyed_or_leaf_verified');
assert.match(educationFailure.evidence, /GetEntity\?id=/i);
assert.match(educationFailure.evidence, /St Johns Unified District/i);
assert.match(educationFailure.evidence, /Window Rock Unified District/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'blocked_report_cards_district_roots_live_but_not_county_keyed');
assert.equal(educationVerified.sample_count, 5);
assert.equal(educationVerified.blocker_code, 'official_report_cards_district_detail_roots_live_but_not_yet_county_keyed_or_leaf_verified');
assert.ok(educationVerified.samples.some((sample) => /districts\/Detail\/4153/.test(sample.source_url)));
assert.ok(educationVerified.samples.some((sample) => /sjusd\.net/.test(sample.evidence_snippet)));
assert.ok(educationVerified.samples.some((sample) => /wrschool\.net/.test(sample.evidence_snippet)));

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'materialize_reviewed_district_root_inventory_from_report_cards_api_then_map_counties_before_special_education_leaf_authoring');

assert.equal(packet.repair_lane, 'report_cards_root_materialization_then_county_keyed_mapping_then_leaf_authoring');
assert.equal(packet.current_problem_metrics.reviewedOfficialDistrictInventoryRoots, 3);
assert.equal(packet.current_problem_metrics.liveDistrictOwnedRootCount, 3);
assert.equal(packet.current_problem_metrics.countyKeyedDistrictRootCount, 0);
assert.equal(packet.reviewed_root_samples.length, 3);
assert.match(packet.representative_sources[0], /GetEntityList/);
assert.match(packet.representative_sources[2], /GetEntity\?id=4153&fiscalYear=2025/);

const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(queueRow.primary_gap_reason, 'des_host_challenge_plus_unmaterialized_report_cards_district_root_inventory');

assert.equal(batchSummary.reviewed_official_district_inventory_roots, 3);
assert.equal(batchSummary.county_keyed_district_roots, 0);
assert.ok(report.includes('official report-cards app now proves live district-detail roots'));
assert.ok(lessons.includes('State-Hosted District Detail Apps Can Count As Local-Root Inventory Even When The Main DOE Host Is Challenged'));

console.log('test-batch202-arizona-report-cards-root-inventory-v1: ok');
