import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch221MichiganAppQueryContractRefreshV1 } from './run-batch221-michigan-app-query-contract-refresh-v1.mjs';

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

const result = generateBatch221MichiganAppQueryContractRefreshV1();
const summary = readJson('data/generated/michigan_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/michigan_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/michigan_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/michigan_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/michigan_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/michigan_district_or_county_education_routing_arcgis_contract_packet_v1.json');
const batchSummary = readJson('data/generated/batch221_michigan_app_query_contract_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/michigan-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_mde_app_query_layers_without_local_routing_contract');
assert.match(gap.status_reason, /school-campus layer/i);
assert.match(gap.status_reason, /district special-education contacts/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'official_mde_app_queries_public_school_and_boundary_layers_but_still_no_district_routing_contract');
assert.match(failure.evidence, /MapServer\/0 for school campuses/i);
assert.match(failure.evidence, /STREET, CITY, STATE, ZIP/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_mde_app_query_layers_without_local_routing_contract');
assert.equal(verified.sample_count, 5);
assert.ok(verified.samples.some((sample) => /school-campus layer/i.test(sample.sample_name)));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'hold_blocked_until_official_isd_or_district_contact_directory_or_export_exists');

assert.equal(packet.current_problem_metrics.searchSourcesPublic, true);
assert.equal(packet.current_problem_metrics.schoolLayerHasCampusAddresses, true);
assert.equal(packet.current_problem_metrics.districtBoundaryLayerHasContacts, false);
assert.equal(packet.layer_contracts.length, 3);
assert.ok(packet.layer_contracts.some((layer) => layer.layer === 'School_Campus'));

assert.equal(batchSummary.search_sources_public, true);
assert.equal(batchSummary.school_layer_has_campus_addresses, true);
assert.equal(batchSummary.district_routing_contract_present, false);
assert.ok(report.includes('school-campus addresses'));
assert.ok(lessons.includes('### School-Campus Address Layers Still Do Not Satisfy District Routing'));
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

console.log('test-batch221-michigan-app-query-contract-refresh-v1: ok');
