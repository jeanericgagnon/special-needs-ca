import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch299NebraskaPublishedConfigFinalityV1 } from './run-batch299-nebraska-published-config-finality-v1.mjs';

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

const result = generateBatch299NebraskaPublishedConfigFinalityV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch299_nebraska_published_config_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch299-nebraska-published-config-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_public_office_service_root_without_assignment_contract');
assert.match(gap.status_reason, /published ExperienceBuilder config/i);
assert.match(gap.status_reason, /related-items endpoints/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].failure_code, 'official_published_config_and_related_items_still_only_materialize_locator_outputs_without_county_assignment_contract');
assert.match(failureRows[0].evidence, /resources\/config\/config\.json/);
assert.match(failureRows[0].evidence, /widget_382_output_closest_000433549029275504/);
assert.match(failureRows[0].evidence, /relatedItems/);
assert.match(failureRows[0].evidence, /"total":0/);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.blocker_code, 'official_published_config_and_related_items_still_only_materialize_locator_outputs_without_county_assignment_contract');
assert.match(verified.query_basis, /published ExperienceBuilder config/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska published config dependencies'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska Web Experience related items empty'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska Web Map related items empty'));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].failure_code, 'official_published_config_and_related_items_still_only_materialize_locator_outputs_without_county_assignment_contract');

const nebraskaQueue = queueRows.find((row) => row.state === 'nebraska');
assert.equal(nebraskaQueue.primary_gap_reason, 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields');

const nebraskaAudit = allStateAudit.states.find((row) => row.stateId === 'nebraska');
assert.equal(nebraskaAudit.packetBatch, 'batch299_nebraska_published_config_finality_v1');
assert.equal(nebraskaAudit.packetPrimaryGapReason, 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields');
assert.equal(nebraskaAudit.familyStatuses.county_local_disability_resources, 'blocked_public_office_service_root_without_assignment_contract');

assert.ok(stateReport.includes('published ExperienceBuilder config'));
assert.ok(stateReport.includes('empty related-items endpoints'));
assert.ok(allStateReport.includes('Nebraska county-local routing is now explicitly frozen at the published-config layer'));
assert.ok(handoff.includes('## Current Focus State: Nebraska'));
assert.ok(handoff.includes('resources/config/config.json'));
assert.ok(handoff.includes('relatedItems?relationshipType=WMA2Code&direction=forward&f=json'));
assert.ok(handoff.includes('## Next State Order After Nebraska'));
assert.ok(lessons.includes('### Published App Config Plus Empty Related Items Can Prove The Last Hidden-Source Theory Is Dead'));
assert.equal(batchSummary.blocker_family, 'county_local_disability_resources');
assert.equal(batchSummary.published_config_dependency_count, 3);
assert.equal(batchSummary.related_items_total_web_experience, 0);
assert.equal(batchSummary.related_items_total_web_map, 0);
assert.ok(batchReport.includes('No hidden public sibling item remains on the current published office-locator stack.'));

console.log('test-batch299-nebraska-published-config-finality-v1: ok');
