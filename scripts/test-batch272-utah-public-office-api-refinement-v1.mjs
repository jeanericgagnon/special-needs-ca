import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch272UtahPublicOfficeApiRefinementV1 } from './run-batch272-utah-public-office-api-refinement-v1.mjs';

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

const result = generateBatch272UtahPublicOfficeApiRefinementV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch272_utah_public_office_api_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_usbe_district_lea_directory_clears_education_and_public_dws_office_api_still_lacks_county_service_area_contract');
assert.equal(summary.critical_gap_families.length, 1);
assert.equal(summary.critical_gap_families[0], 'county_local_disability_resources');
assert.equal(summary.familyStatuses.county_local_disability_resources, 'blocked_public_office_api_without_county_service_area_contract');

const localGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(localGap.status_reason, /officesearch-api\.jobs\.utah\.gov/i);
assert.match(localGap.status_reason, /45 unique offices/i);
assert.match(localGap.status_reason, /county fields, counties served, or another reusable county-to-office contract/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.equal(failureRows[0].failure_code, 'public_dws_office_api_exposes_office_inventory_but_no_county_or_service_area_contract');
assert.match(failureRows[0].evidence, /99 rows covering 45 unique offices/i);
assert.match(failureRows[0].evidence, /office-services/i);

const localVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(localVerified.blocker_code, 'public_dws_office_api_exposes_office_inventory_but_no_county_or_service_area_contract');
assert.equal(localVerified.sample_count, 5);
assert.ok(localVerified.samples.some((sample) => sample.source_url === 'https://officesearch-api.jobs.utah.gov/api/v1/offices'));
assert.ok(localVerified.samples.some((sample) => sample.source_url === 'https://officesearch-api.jobs.utah.gov/api/v1/services'));
assert.ok(localVerified.samples.some((sample) => sample.source_url === 'https://jobs.utah.gov/office-search/main-NUCK4XJI.js'));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.equal(nextRows[0].failure_code, 'public_dws_office_api_exposes_office_inventory_but_no_county_or_service_area_contract');

assert.equal(batchSummary.remaining_blocker_family, 'county_local_disability_resources');
assert.equal(batchSummary.office_api_root, 'https://officesearch-api.jobs.utah.gov/api/v1/offices');
assert.match(report, /public official API/i);
assert.ok(handoff.includes('## Current Focus State: Utah'));
assert.ok(handoff.includes('official_usbe_district_lea_directory_clears_education_and_public_dws_office_api_still_lacks_county_service_area_contract'));
assert.ok(handoff.includes('https://officesearch-api.jobs.utah.gov/api/v1/offices'));
assert.ok(lessons.includes('### A Public Office API Still Does Not Clear County-Grade Routing Without County Or Service-Area Fields'));

console.log('test-batch272-utah-public-office-api-refinement-v1: ok');
