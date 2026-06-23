import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch270UtahOfficeSearchShellRefinementV1 } from './run-batch270-utah-office-search-shell-refinement-v1.mjs';

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

const result = generateBatch270UtahOfficeSearchShellRefinementV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const priorityRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch270_utah_office_search_shell_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_usbe_district_lea_directory_clears_education_and_live_dws_office_search_shell_still_lacks_public_county_office_contract');
assert.equal(summary.critical_gap_families.length, 1);
assert.equal(summary.critical_gap_families[0], 'county_local_disability_resources');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_live_office_search_shell_without_public_county_contract');

const localGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(localGap.status_reason, /office-search/i);
assert.match(localGap.status_reason, /no county list, office rows, addresses, or county-to-office contract/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.equal(failureRows[0].failure_code, 'live_dws_office_search_shell_and_dhhs_contacts_still_lack_public_county_office_contract');

const localVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(localVerified.blocker_code, 'live_dws_office_search_shell_and_dhhs_contacts_still_lack_public_county_office_contract');
assert.equal(localVerified.sample_count, 4);
assert.ok(localVerified.samples.some((sample) => sample.source_url === 'https://jobs.utah.gov/department/contact/index.html'));
assert.ok(localVerified.samples.some((sample) => sample.final_url === 'https://jobs.utah.gov/office-search/'));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.equal(nextRows[0].failure_code, 'live_dws_office_search_shell_and_dhhs_contacts_still_lack_public_county_office_contract');

const queueRow = priorityRows.find((row) => (row.state_name || row.state) === 'Utah');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.primary_gap_reason, 'official_usbe_district_lea_directory_clears_education_and_live_dws_office_search_shell_still_lacks_public_county_office_contract');

assert.equal(batchSummary.remaining_blocker_family, 'county_local_disability_resources');
assert.equal(batchSummary.office_search_root, 'https://jobs.utah.gov/office-search/');
assert.match(report, /live official DWS Office Map route/i);
assert.ok(handoff.includes('official_usbe_district_lea_directory_clears_education_and_live_dws_office_search_shell_still_lacks_public_county_office_contract'));
assert.ok(lessons.includes('### A Live Official Office-Search App Shell Still Does Not Clear County-Grade Routing Without Public Office Rows'));

console.log('test-batch270-utah-office-search-shell-refinement-v1: ok');
