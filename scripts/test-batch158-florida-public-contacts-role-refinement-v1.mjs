import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch158FloridaPublicContactsRoleRefinementV1 } from './run-batch158-florida-public-contacts-role-refinement-v1.mjs';

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

const result = generateBatch158FloridaPublicContactsRoleRefinementV1();
const batchSummary = readJson('data/generated/batch158_florida_public_contacts_role_refinement_summary_v1.json');
const countyPacket = readJson('data/generated/florida_county_local_disability_resources_leaf_authoring_packet_v1.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.county_complete_public_contacts_csv, true);
assert.equal(batchSummary.public_contacts_county_coverage, 67);
assert.equal(batchSummary.public_contacts_service_role_match, false);
assert.equal(batchSummary.public_storefront_county_coverage, 34);
assert.equal(batchSummary.anonymous_myaccess_status, 401);

assert.equal(countyPacket.repair_lane, 'evidence_only_until_public_assistance_county_contract_exists');
assert.equal(countyPacket.current_problem_metrics.contactsCsvRows, 109);
assert.equal(countyPacket.current_problem_metrics.publicCountyCompleteCircuitRows, 20);
assert.equal(countyPacket.current_problem_metrics.publicCountyCompleteCoverage, 67);
assert.equal(countyPacket.current_problem_metrics.publicAssistanceCountyRows, 0);
assert.deepEqual(countyPacket.root_domains_to_review, [
  'reviewable anonymous public Florida DCF or MyACCESS public-assistance county contracts only',
  'do not treat county-complete general DCF contact rows or source_listed staging partner rows as ACCESS or Medicaid office evidence',
]);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(
  countyGap.family_status,
  'blocked_county_complete_public_contacts_wrong_role_and_authenticated_public_assistance_lane',
);
assert.match(countyGap.status_reason, /67\/67 county-to-circuit coverage/i);
assert.match(countyGap.status_reason, /rather than ACCESS, Medicaid, SNAP, TANF, or intake office routing/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(
  countyFailure.failure_code,
  'public_dcf_contacts_csv_is_county_complete_but_wrong_service_role_and_myaccess_results_remain_authenticated',
);
assert.match(countyFailure.evidence, /contacts\.csv that preserves 109 rows and explicit county coverage for all 67 Florida counties/i);
assert.match(countyFailure.evidence, /wrong service role/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(
  countyVerified.family_status,
  'blocked_county_complete_public_contacts_wrong_role_and_authenticated_public_assistance_lane',
);
assert.match(countyVerified.query_basis, /contact-us page and contacts\.csv/i);
assert.equal(countyVerified.samples[0].source_url, 'https://www.myflfamilies.com/contact-us');
assert.equal(countyVerified.samples[1].source_url, 'https://www.myflfamilies.com/contact-us/contacts.csv');

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(
  countyNext.next_action,
  'hold_county_local_until_first_party_public_assistance_county_contract_or_anonymous_myaccess_results_exist',
);

assert.ok(report.includes('county-complete contacts.csv'));
assert.ok(report.includes('general DCF service-contact directory rather than a public-assistance office contract'));
assert.ok(lessons.includes('### County-Complete Public Contact CSVs Still Fail If The Service Role Does Not Match The Family'));

console.log('test-batch158-florida-public-contacts-role-refinement-v1: ok');
