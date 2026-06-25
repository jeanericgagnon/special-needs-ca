import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch329UtahWpslCategoryFinalityV1 } from './run-batch329-utah-wpsl-category-finality-v1.mjs';

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

const result = generateBatch329UtahWpslCategoryFinalityV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch329_utah_wpsl_category_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch329-utah-wpsl-category-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_utah_dhhs_contacts_and_first_party_wpsl_location_api_only_prove_general_contacts_plus_non_disability_program_location_categories_while_dws_lookup_remains_zip_city_without_any_county_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyGap);
assert.equal(countyGap.family_status, 'blocked_live_dhhs_contacts_and_wpsl_categories_still_do_not_materialize_county_local_disability_routing');
assert.match(countyGap.status_reason, /Double Up Food Bucks locations/i);
assert.match(countyGap.status_reason, /Zip Code or City/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyFailure);
assert.equal(countyFailure.failure_code, summary.primary_gap_reason);
assert.match(countyFailure.evidence, /Home Visiting Locations/i);
assert.match(countyFailure.evidence, /Double Up Food Bucks locations/i);
assert.match(countyFailure.evidence, /Zip Code or City/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyVerified);
assert.equal(countyVerified.blocker_code, countyFailure.failure_code);
assert.match(countyVerified.blocker_evidence, /Double Up Food Bucks/i);
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'DHHS WPSL category list stays unrelated to county disability routing'));
assert.equal(countyVerified.sample_count, 10);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyNext);
assert.equal(countyNext.next_action, 'hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_all_counties_to_local_disability_resource_offices');
assert.match(countyNext.evidence, /Home Visiting/i);

const utahQueue = queueRows.find((row) => row.state === 'utah');
assert.ok(utahQueue);
assert.equal(utahQueue.primary_gap_reason, summary.primary_gap_reason);

const utahAudit = allStateAudit.states.find((row) => row.stateId === 'utah');
assert.ok(utahAudit);
assert.equal(utahAudit.packetBatch, 'batch329_utah_wpsl_category_finality_v1');
assert.equal(utahAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.equal(batchSummary.dhhs_contacts_status, 200);
assert.equal(batchSummary.wp_json_status, 200);
assert.equal(batchSummary.wpsl_stores_status, 200);
assert.equal(batchSummary.wpsl_category_status, 200);
assert.equal(batchSummary.wpsl_store_rows, 67);
assert.equal(batchSummary.wpsl_category_count, 2);
assert.deepEqual(batchSummary.wpsl_categories, ['Double Up Food Bucks locations', 'Home Visiting Locations']);
assert.equal(batchSummary.office_search_footer_placeholder, 'Zip Code or City');
assert.deepEqual(batchSummary.services_api_labels, ['All Offices', 'USOR Services', 'Employment Centers']);

assert.match(report, /Double Up Food Bucks locations/i);
assert.match(report, /Home Visiting Locations/i);
assert.match(handoff, /## Current Focus State: Utah/);
assert.match(handoff, /WPSL stores collection/i);
assert.match(lessons, /### First-Party Location APIs Still Fail Closed When Their Categories Are The Wrong Program/);
assert.match(allStateReport, /Double Up Food Bucks locations/i);
assert.match(batchReport, /Home Visiting Locations/i);

const completeCount = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 26);
assert.equal(blockedCount, 24);

console.log('test-batch329-utah-wpsl-category-finality-v1: ok');
