import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch281UtahCountyCoverageFinalityV1 } from './run-batch281-utah-county-coverage-finality-v1.mjs';

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

const result = generateBatch281UtahCountyCoverageFinalityV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch281_utah_county_coverage_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch281-utah-county-coverage-finality-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(
  summary.primary_gap_reason,
  'official_usbe_district_lea_directory_clears_education_but_public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract'
);
assert.deepEqual(summary.critical_gap_families, ['county_local_disability_resources']);

const localGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(localGap.status_reason, /26 of Utah's 29 counties/i);
assert.match(localGap.status_reason, /Daggett, Morgan, and Rich/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.match(failureRows[0].evidence, /26 of Utah's 29 counties/i);
assert.match(failureRows[0].evidence, /Daggett, Morgan, and Rich/i);

const localVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(localVerified.sample_count, 6);
assert.match(localVerified.query_basis, /reverse-geocode county-coverage audit/i);
assert.match(localVerified.blocker_evidence, /26 of Utah's 29 counties/i);
assert.equal(localVerified.samples.at(-1).source_url, 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates');

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.match(nextRows[0].evidence, /26 of Utah's 29 counties/i);
assert.match(nextRows[0].next_action, /daggett_morgan_rich/i);

assert.equal(batchSummary.remaining_blocker_family, 'county_local_disability_resources');
assert.equal(batchSummary.physical_office_county_coverage, 26);
assert.equal(batchSummary.state_county_total, 29);
assert.deepEqual(batchSummary.missing_physical_office_counties, ['Daggett County', 'Morgan County', 'Rich County']);

assert.ok(report.includes('Daggett, Morgan, and Rich'));
assert.ok(report.includes("26 of Utah's 29 counties"));
assert.ok(batchReport.includes('Daggett County, Morgan County, Rich County'));
assert.ok(handoff.includes('## Current Focus State: Utah'));
assert.ok(handoff.includes('Daggett, Morgan, and Rich'));
assert.ok(handoff.includes('## Next State Order After Utah'));
assert.ok(lessons.includes('### Reverse-Geocoded Office Points Can Sharpen A County-Local Blocker Without Faking Service Areas'));

console.log('test-batch281-utah-county-coverage-finality-v1: ok');
