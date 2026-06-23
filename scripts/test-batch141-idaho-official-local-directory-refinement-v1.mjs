import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch141IdahoOfficialLocalDirectoryRefinementV1 } from './run-batch141-idaho-official-local-directory-refinement-v1.mjs';

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

const result = generateBatch141IdahoOfficialLocalDirectoryRefinementV1();
const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch141_idaho_official_local_directory_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_directories_now_expose_exact_targets_but_nampa_negative_proof_and_missing_county_mapping_keep_idaho_blocked');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(eduGap.family_status, 'blocked_official_district_directory_without_county_or_special_education_fields');
assert.equal(countyGap.family_status, 'blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial');
assert.match(eduGap.status_reason, /116 exact outbound district website links/i);
assert.match(countyGap.status_reason, /27 exact office leaves/i);
assert.match(countyGap.status_reason, /Nampa only on page 2 for Southwest Idaho Treatment Center/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(eduFailure.failure_code, 'official_school_district_directory_exposes_district_links_but_not_county_or_special_education_fields');
assert.equal(countyFailure.failure_code, 'official_dhw_office_directory_exposes_exact_office_leaves_but_nampa_resolves_only_to_switc_and_county_mapping_stays_publicly_missing');
assert.match(eduFailure.evidence, /116 exact outbound district website links/i);
assert.match(countyFailure.evidence, /27 exact office entries/i);
assert.match(countyFailure.evidence, /Southwest Idaho Treatment Center \(SWITC\)/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(eduVerified.sample_count, 3);
assert.equal(countyVerified.sample_count, 4);
assert.match(eduVerified.samples[0].source_url, /\/school-districts\/$/);
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Nampa mention resolves only to SWITC'));
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_city_match_wrong_role'));
assert.match(eduVerified.query_basis, /official Idaho SDE district directory/i);
assert.match(countyVerified.query_basis, /one bounded Nampa negative-proof follow-up/i);

assert.equal(batchSummary.official_district_links, 116);
assert.equal(batchSummary.exact_office_leaves, 27);
assert.equal(batchSummary.school_placeholder_rows, 44);
assert.equal(batchSummary.county_dead_locator_rows, 27);
assert.equal(batchSummary.county_doi_mirror_rows, 18);

assert.ok(report.includes('official state district directory exposes exact district links'));
assert.ok(report.includes('resolves only to Southwest Idaho Treatment Center'));
assert.ok(lessons.includes('### Official Local Directories Can Prove Leaf Existence Without Proving County Mapping'));
assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'author_reviewed_district_targets_from_official_school_districts_directory_or_keep_county_routing_blocked');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'replace_18_doi_mirror_rows_with_exact_office_leaves_and_keep_27_legacy_counties_blocked_until_a_public_county_to_office_contract_exists');

console.log('test-batch141-idaho-official-local-directory-refinement-v1: ok');
