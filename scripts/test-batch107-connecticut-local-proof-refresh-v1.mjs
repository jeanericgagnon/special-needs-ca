import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch107ConnecticutLocalProofRefreshV1 } from './run-batch107-connecticut-local-proof-refresh-v1.mjs';

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

const result = generateBatch107ConnecticutLocalProofRefreshV1();
const summary = readJson('data/generated/connecticut_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/connecticut_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/connecticut_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/connecticut_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/connecticut_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch107_connecticut_local_proof_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/connecticut-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.primary_gap_reason, 'authenticated_public_edsight_directory_and_dds_pdf_archive_local_routing_are_the_last_connecticut_local_proof_blockers');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_public_edsight_shell_plus_sas_logon_query');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /OrgSearchReport/);
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /SAS Logon/);
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'blocked_live_dds_replacement_needs_pdf_or_archive_extraction');
assert.match(byFamily.get('county_local_disability_resources').status_reason, /Regional_Contact_List\.pdf/);
assert.match(byFamily.get('county_local_disability_resources').status_reason, /townfinder1/);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'public_edsight_shell_does_not_yield_anonymous_district_records');
assert.equal(eduFailure.next_action, 'author_district_owned_exact_targets_or_browser_auth_edsight_query');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'dds_regions_replacement_is_pdf_plus_archive_not_county_extracted');
assert.equal(countyFailure.next_action, 'extract_dds_regions_pdf_or_archive_townfinder');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'blocked_public_edsight_shell_plus_sas_logon_query');
assert.equal(eduVerified.samples[0].source_url, 'https://public-edsight.ct.gov/overview/find-schools/find-school-district');
assert.match(eduVerified.samples[1].evidence_snippet, /SAS Logon/);
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_live_dds_replacement_needs_pdf_or_archive_extraction');
assert.equal(countyVerified.samples[0].source_url, 'https://portal.ct.gov/dds/about/dds-regions');
assert.equal(countyVerified.samples[1].source_url, 'https://portal.ct.gov/-/media/DDS/Commissioner/Regional_Contact_List.pdf');

const eduNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduNext.failure_code, 'public_edsight_shell_does_not_yield_anonymous_district_records');
assert.equal(eduNext.next_action, 'author_district_owned_exact_targets_or_browser_auth_edsight_query');
const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'dds_regions_replacement_is_pdf_plus_archive_not_county_extracted');
assert.equal(countyNext.next_action, 'extract_dds_regions_pdf_or_archive_townfinder');

assert.equal(batchSummary.classification, 'BLOCKED');
assert.ok(report.includes('SAS-logon-gated district query'));
assert.ok(report.includes('PDF/archive local-office extraction lane'));

console.log('test-batch107-connecticut-local-proof-refresh-v1: ok');
