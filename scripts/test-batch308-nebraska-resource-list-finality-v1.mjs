import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch308NebraskaResourceListFinalityV1 } from './run-batch308-nebraska-resource-list-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, filePath), 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(path.join(repoRoot, filePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch308NebraskaResourceListFinalityV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch308_nebraska_resource_list_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_published_resource_list_contains_only_config_and_static_assets_while_no_metadata_or_hidden_assignment_artifact_exists');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_public_office_service_root_without_assignment_contract_or_hidden_resource_artifact');
assert.match(gap.status_reason, /config\/config\.json/);
assert.match(gap.status_reason, /Info file for item not found/);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(failure);
assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /resources\?f=json/);
assert.match(failure.evidence, /image assets/);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified);
assert.equal(verified.blocker_code, summary.primary_gap_reason);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska ExperienceBuilder resource list'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska Web Map empty resource list'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(next);
assert.equal(next.next_action, 'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published');

const queue = queueRows.find((row) => row.state === 'nebraska');
assert.ok(queue);
assert.equal(queue.primary_gap_reason, summary.primary_gap_reason);

assert.equal(batchSummary.experiencebuilder_resource_total, 9);
assert.equal(batchSummary.webmap_resource_total, 0);
assert.equal(batchSummary.experiencebuilder_iteminfo_status, 'missing');
assert.equal(batchSummary.experiencebuilder_metadata_status, '404');

assert.match(report, /resource list contains only config and image assets/i);
assert.match(handoff, /Current Focus State: Nebraska/);
assert.match(handoff, /resource list contains only `config\/config\.json` plus image assets/i);
assert.match(allStateReport, /Nebraska county-local routing is now frozen even at the item-resource layer/i);

console.log('test-batch308-nebraska-resource-list-finality-v1: ok');
