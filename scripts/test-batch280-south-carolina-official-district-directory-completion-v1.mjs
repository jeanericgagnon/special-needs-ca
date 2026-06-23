import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch280SouthCarolinaOfficialDistrictDirectoryCompletionV1 } from './run-batch280-south-carolina-official-district-directory-completion-v1.mjs';

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

const result = generateBatch280SouthCarolinaOfficialDistrictDirectoryCompletionV1();
const summary = readJson('data/generated/south-carolina_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/south-carolina_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/south-carolina_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/south-carolina_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/south-carolina_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch280_south-carolina_official_district_directory_completion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/south-carolina-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch280-south-carolina-official-district-directory-completion-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.primary_gap_reason, 'none');
assert.deepEqual(summary.final_blockers, []);

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'verified_county_grade');
assert.match(gap.status_reason, /getDistricts/i);
assert.match(gap.status_reason, /46 South Carolina counties/i);

assert.equal(failureRows.length, 0);
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'maintenance');
assert.match(nextRows[0].evidence, /72 live district rows/i);
assert.match(nextRows[0].evidence, /46 South Carolina counties/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'verified_county_grade');
assert.equal(verified.blocker_code, null);
assert.equal(verified.sample_count, 5);
assert.ok(verified.samples.some((sample) => sample.source_url.includes('school-directory')));
assert.ok(verified.samples.some((sample) => sample.source_url.includes('method=getDistricts')));
assert.ok(verified.samples.some((sample) => sample.source_url.includes('FeatureServer/20')));
assert.match(verified.samples.find((sample) => sample.sample_name === 'Multi-district county coverage sample').evidence_snippet, /Anderson School District 1/);

assert.equal(batchSummary.district_rows, 72);
assert.equal(batchSummary.matched_counties, 46);
assert.equal(batchSummary.multi_district_counties, 11);
assert.equal(batchSummary.blank_phone_rows, 0);
assert.equal(batchSummary.blank_website_rows, 0);

assert.ok(report.includes('South Carolina now reaches California-grade and is index-safe.'));
assert.ok(report.includes('all 46 counties now match one or more official district rows'));
assert.ok(batchReport.includes('Batch 280 South Carolina Official District Directory Completion Report v1'));
assert.ok(lessons.includes('### Official School-Directory Backends And District Layers Can Clear County-Grade Education Routing'));

assert.ok(handoff.includes('South Carolina, Texas'));
assert.ok(!handoff.includes('- South Carolina: `official_school_directory_root_is_live_but_not_yet_converted_into_district_owned_special_education_leaves`'));
assert.ok(handoff.includes('## Current Focus State: North Carolina'));
assert.ok(handoff.includes('https://www.cmsk12.org/Page/213'));
assert.ok(handoff.includes('## Next State Order After South Carolina'));

console.log('test-batch280-south-carolina-official-district-directory-completion-v1: ok');
