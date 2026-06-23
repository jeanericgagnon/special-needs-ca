import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch267OregonCountySearchableSchoolDirectoryV1 } from './run-batch267-oregon-county-searchable-school-directory-v1.mjs';

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

const result = generateBatch267OregonCountySearchableSchoolDirectoryV1();
const summary = readJson('data/generated/oregon_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/oregon_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/oregon_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/oregon_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/oregon_next_action_queue_v2.jsonl');
const priorityRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch267_oregon_county_searchable_school_directory_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/oregon-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_ode_county_searchable_school_directory_clears_education_but_live_office_finder_root_still_has_no_county_extract');
assert.deepEqual(summary.critical_gap_families, ['county_local_disability_resources']);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'verified_county_grade_official_directory_pdf');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'verified_county_grade_official_directory_pdf');
assert.match(educationGap.status_reason, /search by county/i);
assert.match(educationGap.status_reason, /listed alphabetically by county/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_office_finder_root_without_county_extract');

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.equal(failureRows[0].failure_code, 'live_office_finder_root_without_county_extract');

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'verified_county_grade_official_directory_pdf');
assert.equal(verified.sample_count, 4);
assert.equal(verified.blocker_code, null);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.oregon.gov/ode/about-us/Pages/School-Directory.aspx'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf'));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.equal(nextRows[0].failure_code, 'live_office_finder_root_without_county_extract');

const queueRow = priorityRows.find((row) => (row.state_name || row.state) === 'Oregon');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.primary_gap_reason, 'official_ode_county_searchable_school_directory_clears_education_but_live_office_finder_root_still_has_no_county_extract');

assert.equal(batchSummary.education_family_status, 'verified_county_grade_official_directory_pdf');
assert.equal(batchSummary.remaining_blocker_family, 'county_local_disability_resources');
assert.match(report, /School Directory PDF now clears county-grade education routing/i);
assert.ok(handoff.includes('## Current Focus State: Oregon'));
assert.ok(handoff.includes('official_ode_county_searchable_school_directory_clears_education_but_live_office_finder_root_still_has_no_county_extract'));
assert.ok(lessons.includes('### An Official School Directory PDF That Explicitly Organizes Districts By County Can Clear County-Grade Education Routing'));

console.log('test-batch267-oregon-county-searchable-school-directory-v1: ok');
