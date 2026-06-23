import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch182IdahoOfficeLeafMaterializationV1 } from './run-batch182-idaho-office-leaf-materialization-v1.mjs';

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

const result = generateBatch182IdahoOfficeLeafMaterializationV1();
const batchSummary = readJson('data/generated/batch182_idaho_office_leaf_materialization_summary_v1.json');
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/idaho_county_local_disability_resources_leaf_authoring_packet_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.exact_office_leaf_urls_materialized, 23);
assert.equal(batchSummary.clean_county_leaf_matches, 17);
assert.equal(batchSummary.canyon_split_open, true);
assert.equal(summary.primary_gap_reason, 'official_district_root_packet_and_materialized_exact_office_leaf_packet_exist_but_county_grade_mapping_and_role_fields_still_missing');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /17 county-clean exact leaf replacements/i);
assert.match(countyGap.status_reason, /27 county rows continue to use the dead legacy locator/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'materialized_exact_office_leaf_packet_shows_17_clean_matches_plus_canyon_split_but_no_public_county_contract');
assert.match(countyFailure.evidence, /23 exact DHW office leaves/i);
assert.match(countyFailure.evidence, /17 county-clean exact office leaf matches/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_materialized_exact_office_leaf_packet_without_public_county_contract');
assert.equal(countyVerified.sample_count, 3);
assert.ok(countyVerified.samples.find((row) => row.source_url === 'https://healthandwelfare.idaho.gov/dhw/caldwell-office'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'use_materialized_exact_office_leaf_packet_for_17_clean_counties_keep_canyon_split_and_27_legacy_counties_blocked');

assert.equal(packet.current_problem_metrics.exactLeafUrlsMaterialized, 23);
assert.equal(packet.current_problem_metrics.cleanCountyLeafMatches, 17);
assert.equal(packet.current_problem_metrics.canyonSplitOpen, true);
assert.equal(packet.exact_leaf_replacements.length, 17);
assert.ok(packet.exact_leaf_replacements.find((row) => row.county_id === 'canyon-id' && /caldwell-office$/.test(row.exact_leaf_url)));
assert.ok(packet.unresolved_legacy_counties.includes('adams-id'));
assert.ok(packet.unresolved_legacy_counties.includes('washington-id'));

assert.match(report, /17 counties have clean exact office-leaf replacements ready/i);
assert.ok(lessons.includes('### Match Building Qualifiers Before Treating Same-City Office Leaves As Equivalent'));

console.log('test-batch182-idaho-office-leaf-materialization-v1: ok');
