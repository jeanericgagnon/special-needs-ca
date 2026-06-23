import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch146IdahoNampaOfficeProofRefinementV1 } from './run-batch146-idaho-nampa-office-proof-refinement-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), 'utf8'));
}

function readJsonl(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

generateBatch146IdahoNampaOfficeProofRefinementV1();

const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch146_idaho_nampa_office_proof_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_directories_now_expose_exact_targets_but_nampa_negative_proof_and_missing_county_mapping_keep_idaho_blocked');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_exact_office_leafs_exist_but_nampa_is_treatment_center_and_county_mapping_partial');
assert.match(countyGap.status_reason, /Nampa only on page 2 for Southwest Idaho Treatment Center/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_dhw_office_directory_exposes_exact_office_leaves_but_nampa_resolves_only_to_switc_and_county_mapping_stays_publicly_missing');
assert.match(countyFailure.evidence, /Southwest Idaho Treatment Center \(SWITC\)/i);
assert.match(countyFailure.evidence, /1660 11th Ave N, Nampa, ID 83687/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Nampa mention resolves only to SWITC'));
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_city_match_wrong_role'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'replace_18_doi_mirror_rows_with_exact_office_leaves_and_keep_27_legacy_counties_blocked_until_a_public_county_to_office_contract_exists');

assert.equal(batchSummary.nampaNegativeProof, 'SWITC_only');
assert.match(report, /Nampa only as Southwest Idaho Treatment Center/i);

console.log('test-batch146-idaho-nampa-office-proof-refinement-v1: ok');
