import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch269UtahOfficialDistrictDirectoryV1 } from './run-batch269-utah-official-district-directory-v1.mjs';

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

const result = generateBatch269UtahOfficialDistrictDirectoryV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const priorityRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch269_utah_official_district_directory_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.weak_critical_families, 1);
assert.deepEqual(summary.critical_gap_families, ['county_local_disability_resources']);
assert.equal(summary.primary_gap_reason, 'official_usbe_district_lea_directory_clears_education_but_dws_locations_500_and_dhhs_locations_404_leave_no_live_county_local_contract');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'verified_current_official_district_lea_directory');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'verified_current_official_district_lea_directory');
assert.match(educationGap.status_reason, /District or Local Education Agency \(LEA\)/i);
assert.match(educationGap.status_reason, /export(?: to|-to-)csv/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.equal(failureRows[0].failure_code, 'dws_locations_500_and_dhhs_locations_404_leave_no_live_county_local_contract');

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'verified_current_official_district_lea_directory');
assert.equal(verified.evidence_strength, 'strong');
assert.equal(verified.sample_count, 3);
assert.equal(verified.blocker_code, null);
assert.ok(verified.samples.every((sample) => sample.source_url === 'https://schools.utah.gov/schoolsdirectory'));
assert.ok(verified.samples.some((sample) => /District or LEA.*filter/i.test(sample.evidence_snippet)));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.equal(nextRows[0].failure_code, 'dws_locations_500_and_dhhs_locations_404_leave_no_live_county_local_contract');

const queueRow = priorityRows.find((row) => (row.state_name || row.state) === 'Utah');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.weak_critical_families, 1);
assert.equal(queueRow.primary_gap_reason, 'official_usbe_district_lea_directory_clears_education_but_dws_locations_500_and_dhhs_locations_404_leave_no_live_county_local_contract');

assert.equal(batchSummary.education_family_status, 'verified_current_official_district_lea_directory');
assert.equal(batchSummary.remaining_blocker_family, 'county_local_disability_resources');
assert.match(report, /Utah Schools Directory is an official district\/LEA directory/i);
assert.ok(handoff.includes('## Current Focus State: Utah'));
assert.ok(handoff.includes('official_usbe_district_lea_directory_clears_education_but_dws_locations_500_and_dhhs_locations_404_leave_no_live_county_local_contract'));
assert.ok(lessons.includes('### A Live Official District-LEA Directory With CSV Export Can Clear District-Grade Education Routing'));

console.log('test-batch269-utah-official-district-directory-v1: ok');
