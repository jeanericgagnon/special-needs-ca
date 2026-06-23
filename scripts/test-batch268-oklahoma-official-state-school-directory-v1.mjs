import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch268OklahomaOfficialStateSchoolDirectoryV1 } from './run-batch268-oklahoma-official-state-school-directory-v1.mjs';

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

const result = generateBatch268OklahomaOfficialStateSchoolDirectoryV1();
const summary = readJson('data/generated/oklahoma_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/oklahoma_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/oklahoma_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/oklahoma_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/oklahoma_next_action_queue_v2.jsonl');
const priorityRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch268_oklahoma_official_state_school_directory_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/oklahoma-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_osde_state_school_directory_clears_education_but_dead_dhhs_locator_host_and_planning_rows_still_block_county_local');
assert.deepEqual(summary.critical_gap_families, ['county_local_disability_resources']);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'verified_current_official_state_school_directory');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'verified_current_official_state_school_directory');
assert.match(educationGap.status_reason, /downloaded or browsed by district or school site/i);
assert.match(educationGap.status_reason, /physical addresses/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.equal(failureRows[0].failure_code, 'dead_dhhs_locator_host_plus_doi_planning_rows');

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'verified_current_official_state_school_directory');
assert.equal(verified.sample_count, 4);
assert.equal(verified.blocker_code, null);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://oklahoma.gov/education/resources/state-school-directory.html'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://oklahoma.gov/content/dam/ok/en/osde/documents/resources/state-directory/FY26OnlineDirectoryDistrictList.xlsx'));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.equal(nextRows[0].failure_code, 'dead_dhhs_locator_host_plus_doi_planning_rows');

const queueRow = priorityRows.find((row) => (row.state_name || row.state) === 'Oklahoma');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.primary_gap_reason, 'official_osde_state_school_directory_clears_education_but_dead_dhhs_locator_host_and_planning_rows_still_block_county_local');

assert.equal(batchSummary.education_family_status, 'verified_current_official_state_school_directory');
assert.equal(batchSummary.remaining_blocker_family, 'county_local_disability_resources');
assert.match(report, /State School and District Directory page now clears education/i);
assert.ok(handoff.includes('## Current Focus State: Oklahoma'));
assert.ok(handoff.includes('official_osde_state_school_directory_clears_education_but_dead_dhhs_locator_host_and_planning_rows_still_block_county_local'));
assert.ok(lessons.includes('### A Live Official State School Directory Page With District Download Links Can Clear County-Grade Education Routing'));

console.log('test-batch268-oklahoma-official-state-school-directory-v1: ok');
