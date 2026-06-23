import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch168IdahoOfficialDistrictRootPacketV1 } from './run-batch168-idaho-official-district-root-packet-v1.mjs';

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

const result = generateBatch168IdahoOfficialDistrictRootPacketV1();
const batchSummary = readJson('data/generated/batch168_idaho_official_district_root_packet_summary_v1.json');
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'official_district_root_packet_and_office_leaf_packet_exist_but_county_grade_mapping_and_role_fields_still_missing');
assert.equal(batchSummary.official_directory_link_count, 116);
assert.equal(batchSummary.county_bearing_name_count, 30);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'blocked_official_district_root_packet_without_county_or_special_education_fields');
assert.match(eduGap.status_reason, /116 exact outbound district website links/i);
assert.match(eduGap.status_reason, /30 county-bearing district names/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'official_district_directory_json_exposes_116_roots_and_30_county_bearing_names_but_not_special_education_leaves');
assert.match(eduFailure.evidence, /116 exact outbound district website links/i);
assert.match(eduFailure.evidence, /30 district names are already county-bearing or county-paired/i);
assert.equal(eduFailure.next_action, 'author_reviewed_special_education_leaves_from_116_official_district_directory_links_or_keep_county_routing_blocked');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'blocked_official_district_root_packet_without_county_or_special_education_fields');
assert.match(eduVerified.query_basis, /deterministic root-authoring packet/i);

const eduNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduNext.next_action, 'author_reviewed_special_education_leaves_from_116_official_district_directory_links_or_keep_county_routing_blocked');

assert.ok(report.includes('deterministic packet of district-owned roots'));
assert.ok(report.includes('official district roots'));
assert.ok(lessons.includes('### Official Directory JSON Can Be A Root-Authoring Packet Even When It Is Not A Routing Contract'));

console.log('test-batch168-idaho-official-district-root-packet-v1: ok');
