import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch328UtahZipCityContractFinalityV1 } from './run-batch328-utah-zip-city-contract-finality-v1.mjs';

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

const result = generateBatch328UtahZipCityContractFinalityV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch328_utah_zip_city_contract_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch328-utah-zip-city-contract-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_utah_dhhs_contacts_page_recovers_but_explicitly_defers_local_office_info_and_current_dws_office_search_still_limits_public_lookup_to_zip_or_city_without_any_county_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyGap);
assert.equal(countyGap.family_status, 'blocked_live_dhhs_contacts_defers_local_offices_and_dws_zip_city_lookup_still_lacks_county_contract');
assert.match(countyGap.status_reason, /Zip Code or City/i);
assert.match(countyGap.status_reason, /Utah 211/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyFailure);
assert.equal(countyFailure.failure_code, summary.primary_gap_reason);
assert.match(countyFailure.evidence, /Zip Code or City/i);
assert.match(countyFailure.evidence, /search\/<zip-or-city>/i);
assert.match(countyFailure.evidence, /`All Offices`, `USOR Services`, and `Employment Centers`/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyVerified);
assert.equal(countyVerified.blocker_code, countyFailure.failure_code);
assert.match(countyVerified.blocker_evidence, /zip-or-city lookup/i);
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Live DWS office-search shell limits lookup to zip or city'));
assert.equal(countyVerified.sample_count, 7);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyNext);
assert.equal(countyNext.next_action, 'hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices');
assert.match(countyNext.evidence, /zip-or-city lookup/i);

const utahQueue = queueRows.find((row) => row.state === 'utah');
assert.ok(utahQueue);
assert.equal(utahQueue.primary_gap_reason, summary.primary_gap_reason);

const utahAudit = allStateAudit.states.find((row) => row.stateId === 'utah');
assert.ok(utahAudit);
assert.equal(utahAudit.packetBatch, 'batch328_utah_zip_city_contract_finality_v1');
assert.equal(utahAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.equal(batchSummary.dhhs_contacts_status, 200);
assert.equal(batchSummary.office_search_shell_status, 200);
assert.equal(batchSummary.office_search_footer_placeholder, 'Zip Code or City');
assert.equal(batchSummary.office_search_button_route, 'search/<zip-or-city>|map');
assert.equal(batchSummary.services_api_status, 200);
assert.deepEqual(batchSummary.services_api_labels, ['All Offices', 'USOR Services', 'Employment Centers']);
assert.equal(batchSummary.county_endpoint_status, 404);
assert.equal(batchSummary.office_rows, 99);
assert.equal(batchSummary.unique_offices, 45);

assert.match(report, /Zip Code or City/i);
assert.match(report, /Utah 211/i);
assert.match(handoff, /## Current Focus State: Utah/);
assert.match(handoff, /Live DWS zip-coded detail route/);
assert.match(lessons, /### Zip Or City Office Search UI Still Does Not Prove County Routing/);
assert.match(allStateReport, /Zip Code or City/i);
assert.match(batchReport, /Zip Code or City/i);

const completeCount = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 26);
assert.equal(blockedCount, 24);

console.log('test-batch328-utah-zip-city-contract-finality-v1: ok');
