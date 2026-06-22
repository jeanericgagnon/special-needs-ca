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
assert.equal(summary.primary_gap_reason, 'official_local_directories_exist_but_live_rows_still_lack_county_mapped_replacements');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(eduGap.family_status, 'blocked_official_district_directory_without_county_mapping');
assert.equal(countyGap.family_status, 'blocked_official_office_leaves_without_county_mapping');
assert.match(eduGap.status_reason, /106 district website links/i);
assert.match(countyGap.status_reason, /23 exact DHW office leaves/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(eduFailure.failure_code, 'official_sde_district_directory_exists_but_no_county_mapped_special_education_contract');
assert.equal(countyFailure.failure_code, 'official_dhw_office_leaves_exist_but_live_rows_still_lack_county_to_office_mapping');
assert.match(eduFailure.evidence, /106 district website links/i);
assert.match(countyFailure.evidence, /23 exact office leaves/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(eduVerified.sample_count, 4);
assert.equal(countyVerified.sample_count, 4);
assert.match(eduVerified.samples[0].source_url, /\/school-districts\/$/);
assert.match(countyVerified.samples[0].source_url, /sitemap\.xml$/);
assert.match(eduVerified.query_basis, /official Idaho SDE district directory/i);
assert.match(countyVerified.query_basis, /sitemap-exposed office leaves/i);

assert.equal(batchSummary.official_district_links, 106);
assert.equal(batchSummary.exact_office_leaves, 23);
assert.equal(batchSummary.school_placeholder_rows, 44);
assert.equal(batchSummary.county_dead_locator_rows, 27);
assert.equal(batchSummary.county_generic_medicaid_rows, 18);

assert.ok(report.includes('official district directory is not county-mapped'));
assert.ok(report.includes('office leaves are not mapped back to counties'));
assert.ok(lessons.includes('### Official Local Directories Can Prove Leaf Existence Without Proving County Mapping'));
assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'author_county_mapped_district_routing_from_official_directory_or_hold_blocked');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'author_exact_county_to_office_mappings_from_official_office_leaves_or_hold_blocked');

console.log('test-batch141-idaho-official-local-directory-refinement-v1: ok');
