import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch288UtahCountyPayloadFinalityV1 } from './run-batch288-utah-county-payload-finality-v1.mjs';

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

const result = generateBatch288UtahCountyPayloadFinalityV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch288_utah_county_payload_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch288-utah-county-payload-finality-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_usbe_district_lea_directory_clears_education_but_public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract');

const localGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(localGap.family_status, 'blocked_public_office_api_without_county_service_area_contract');
assert.match(localGap.status_reason, /Daggett/);
assert.match(localGap.status_reason, /Morgan/);
assert.match(localGap.status_reason, /Richfield/);

assert.equal(failureRows.length, 1);
assert.match(failureRows[0].evidence, /Daggett/);
assert.match(failureRows[0].evidence, /Morgan/);
assert.match(failureRows[0].evidence, /Richfield/);
assert.match(failureRows[0].evidence, /Emery County/);

const localVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(localVerified.sample_count, 7);
assert.match(localVerified.query_basis, /payload-text audit/i);
assert.match(localVerified.blocker_evidence, /Daggett/);
assert.match(localVerified.blocker_evidence, /Morgan/);
assert.match(localVerified.blocker_evidence, /Richfield/);
assert.ok(localVerified.samples.some((sample) => sample.sample_name === 'Missing county token audit'));
assert.ok(localVerified.samples.some((sample) => sample.sample_name === 'Rich token audit'));

assert.equal(nextRows.length, 1);
assert.match(nextRows[0].evidence, /no `Daggett` or `Morgan` token/i);
assert.match(nextRows[0].evidence, /Richfield/);

assert.equal(batchSummary.remaining_blocker_family, 'county_local_disability_resources');
assert.equal(batchSummary.physical_office_county_coverage, 26);
assert.deepEqual(batchSummary.missing_physical_office_counties, ['Daggett County', 'Morgan County', 'Rich County']);
assert.deepEqual(batchSummary.exact_missing_payload_tokens, ['Daggett', 'Morgan']);
assert.deepEqual(batchSummary.ambiguous_payload_tokens, ['Richfield']);
assert.deepEqual(batchSummary.literal_county_name_rows, ['Emery County (Castle Dale)', 'South County (Taylorsville)']);

assert.ok(report.includes('Daggett, Morgan, and Rich'));
assert.ok(report.includes('`Daggett` and `Morgan` never appear anywhere'));
assert.ok(report.includes('`Rich` appears only as `Richfield`'));
assert.ok(batchReport.includes('only literal `county` office-name tokens'));
assert.ok(handoff.includes('## Current Focus State: Utah'));
assert.ok(handoff.includes('`Daggett` and `Morgan` never appear anywhere in the public JSON'));
assert.ok(handoff.includes('## Next State Order After Utah'));
assert.ok(lessons.includes('### County-Looking Office Names Still Do Not Create A Statewide County Contract'));

console.log('test-batch288-utah-county-payload-finality-v1: ok');
