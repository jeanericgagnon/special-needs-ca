import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateBatch344NebraskaPortalSearchFinalityV1 } from './run-batch344-nebraska-portal-search-finality-v1.mjs';

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

const result = generateBatch344NebraskaPortalSearchFinalityV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gap = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const failure = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const verified = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl').find((row) => row.family === 'county_local_disability_resources');
const next = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const queue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl').find((row) => row.state === 'nebraska');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch344_nebraska_portal_search_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch344-nebraska-portal-search-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch344_nebraska_portal_search_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_nebraska_portal_search_still_returns_only_the_same_web_map_feature_service_and_map_service_without_any_county_assignment_item_or_directory_leaf');

assert.equal(gap.family_status, 'blocked_official_portal_search_confirms_only_locator_trilogy_without_assignment_contract');
assert.match(gap.status_reason, /web map item, one feature service, and one map service/i);

assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /4bdbf8e8703743b0b2ff290f98737825/);
assert.match(failure.evidence, /cf70cb74fcc94634afc89f0a22a7d06f/);
assert.match(failure.evidence, /90a19933cfc444be836f51d15e2e23ec/);

assert.equal(verified.family_status, gap.family_status);
assert.equal(verified.blocker_code, summary.primary_gap_reason);
assert.equal(verified.sample_count, 8);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Official portal search returns only locator trilogy'));

assert.equal(next.next_action, 'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published');
assert.match(next.evidence, /same office-location web map, feature service, and map service/i);

assert.equal(queue.primary_gap_reason, summary.primary_gap_reason);

const nebraskaAudit = audit.states.find((row) => row.stateId === 'nebraska');
assert.ok(nebraskaAudit);
assert.equal(nebraskaAudit.packetBatch, 'batch344_nebraska_portal_search_finality_v1');
assert.equal(nebraskaAudit.packetPrimaryGapReason, summary.primary_gap_reason);
assert.equal(nebraskaAudit.familyStatuses.county_local_disability_resources, 'blocked_official_portal_search_confirms_only_locator_trilogy_without_assignment_contract');

assert.equal(batchSummary.official_portal_result_count, 3);
assert.deepEqual(batchSummary.official_portal_result_types, ['Web Map', 'Feature Service', 'Map Service']);
assert.equal(batchSummary.exact_lookup_search_result_count, 1);

assert.match(handoff, /## Current Focus State: Nebraska/);
assert.match(handoff, /same office-locator trilogy/i);
assert.match(handoff, /Official GIS portal search: Public Assistance Offices/i);
assert.match(allStateReport, /official public GIS portal search itself still returns only the same office-locator trilogy/i);
assert.match(batchReport, /returns only three public items: one web map, one feature service, and one map service/i);

const completeCount = audit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = audit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 27);
assert.equal(blockedCount, 23);

console.log('test-batch344-nebraska-portal-search-finality-v1: ok');
