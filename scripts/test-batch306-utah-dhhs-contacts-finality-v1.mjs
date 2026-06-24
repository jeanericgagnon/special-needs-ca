import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch306UtahDhhsContactsFinalityV1 } from './run-batch306-utah-dhhs-contacts-finality-v1.mjs';

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

const result = generateBatch306UtahDhhsContactsFinalityV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch306_utah_dhhs_contacts_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_usbe_district_lea_directory_clears_education_but_utah_dhhs_contacts_county_map_text_and_live_dws_office_stack_still_fail_to_expose_county_service_area_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyGap);
assert.equal(countyGap.family_status, 'blocked_utah_contacts_map_text_plus_dws_city_zip_contract_without_county_assignment');
assert.match(countyGap.status_reason, /clicking on a county in the map below/i);
assert.match(countyGap.status_reason, /visit specific division or program pages for local office information/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyFailure);
assert.equal(countyFailure.failure_code, 'utah_dhhs_contacts_county_map_text_and_live_dws_office_stack_still_fail_to_expose_county_service_area_contract');
assert.match(countyFailure.evidence, /dhhs\.utah\.gov\/contacts/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyVerified);
assert.equal(countyVerified.blocker_code, countyFailure.failure_code);
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://dhhs.utah.gov/contacts/'));
assert.ok(countyVerified.samples.some((sample) => /county in the map below/i.test(sample.evidence_snippet)));
assert.ok(countyVerified.samples.some((sample) => /local office information/i.test(sample.evidence_snippet)));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(countyNext);
assert.equal(countyNext.next_action, 'hold_blocked_until_public_utah_successor_directory_api_or_reviewable_leaf_explicitly_maps_counties_to_local_disability_resource_offices');

const utahQueue = queueRows.find((row) => row.state === 'utah');
assert.ok(utahQueue);
assert.equal(utahQueue.primary_gap_reason, summary.primary_gap_reason);

assert.equal(batchSummary.failure_code, countyFailure.failure_code);
assert.equal(batchSummary.official_contacts_page, 'https://dhhs.utah.gov/contacts/');
assert.ok(batchSummary.contacts_page_signals.includes('county-click service map mentioned'));

assert.match(report, /county-click service map/i);
assert.match(report, /division or program pages for local office information/i);
assert.match(handoff, /## Current Focus State: Utah/);
assert.match(handoff, /Top Remaining Source-Scouting Targets/);
assert.match(allStateReport, /Utah county-local routing is now explicitly sharpened past the statewide shells/i);

console.log('test-batch306-utah-dhhs-contacts-finality-v1: ok');
