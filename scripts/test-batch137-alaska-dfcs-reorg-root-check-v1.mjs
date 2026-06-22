import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch137AlaskaDfcsReorgRootCheckV1 } from './run-batch137-alaska-dfcs-reorg-root-check-v1.mjs';

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

const result = generateBatch137AlaskaDfcsReorgRootCheckV1();
const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch137_alaska_dfcs_reorg_root_check_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'dfcs_reorg_root_relays_back_to_challenged_health_host_and_no_public_assistance_contacts_exist');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /DFCS reorg root/i);
assert.match(countyGap.status_reason, /relays Adult Public Assistance and Medicaid users back to challenged health\.alaska\.gov leaves/i);
assert.match(countyGap.status_reason, /Department Contacts page has no Public Assistance or disability office-routing section/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'dfcs_reorg_root_relays_back_to_challenged_health_host_and_no_public_assistance_contacts_exist');
assert.match(countyFailure.evidence, /dfcs\.alaska\.gov\/Pages\/Services\.aspx/i);
assert.match(countyFailure.evidence, /Department Contacts page contains no Public Assistance, Medicaid, Senior and Disabilities, or office-location routing terms/i);
assert.match(countyFailure.evidence, /legacy official locator https:\/\/dhss\.alaska\.gov\/locations remains HTTP 404/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.blocker_code, 'dfcs_reorg_root_relays_back_to_challenged_health_host_and_no_public_assistance_contacts_exist');
assert.equal(countyVerified.sample_count, 7);
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://dfcs.alaska.gov/Pages/Services.aspx'));
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx'));
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_reorg_services_relay'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'dfcs_reorg_root_relays_back_to_challenged_health_host_and_no_public_assistance_contacts_exist');
assert.match(countyNext.next_action, /publishes_a_reviewable_public_assistance_or_disability_office_directory_on_dfcs/i);

assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.dfcs_reorg_root_live, true);
assert.equal(batchSummary.dfcs_reorg_root_repaired_county_directory, false);
assert.ok(report.includes('live DFCS reorg host is real but does not provide a Public Assistance or disability office directory'));
assert.ok(lessons.includes('Live Reorg Roots That Only Relay Back To A Blocked Host Do Not Repair Local Office Routing'));

console.log('test-batch137-alaska-dfcs-reorg-root-check-v1: ok');
