import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch160MichiganCountyLeafCompletionV1 } from './run-batch160-michigan-county-leaf-completion-v1.mjs';

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

const result = generateBatch160MichiganCountyLeafCompletionV1();
const summary = readJson('data/generated/michigan_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/michigan_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/michigan_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/michigan_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/michigan_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch160_michigan_county_leaf_completion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/michigan-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 92);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing']);
assert.equal(summary.primary_gap_reason, 'official_mde_arcgis_school_map_exposes_geometry_without_local_routing_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_county_grade');
assert.match(countyGap.status_reason, /exact missing county leaves for Alger, Alpena, Ingham, Lenawee, and St\. Joseph/i);
assert.match(countyGap.status_reason, /83-county official MDHHS county-office lane/i);

assert.equal(failureRows.some((row) => row.family === 'county_local_disability_resources'), false);
assert.equal(nextRows.some((row) => row.family === 'county_local_disability_resources'), false);
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'district_or_county_education_routing');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_county_grade');
assert.equal(countyVerified.blocker_code, null);
assert.equal(countyVerified.sample_count, 6);
assert.equal(countyVerified.samples.length, 6);
for (const url of [
  'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/up-and-northern-michigan/alger-county-mdhhs',
  'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/up-and-northern-michigan/alpena-county-mdhhs',
  'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/urban-counties/ingham-mdhhs',
  'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/east-michigan/lenawee-county-1',
  'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/west-michigan/st--joseph-county-1',
]) {
  assert.ok(countyVerified.samples.some((row) => row.source_url === url), `Missing verified county leaf sample: ${url}`);
}

assert.deepEqual(batchSummary.newly_verified_counties, ['alger', 'alpena', 'ingham', 'lenawee', 'st-joseph']);
assert.deepEqual(batchSummary.remaining_final_blockers, ['district_or_county_education_routing']);
assert.ok(report.includes('County-local disability resources now pass at county grade'));
assert.ok(report.includes('District or county education routing remains blocked'));
assert.ok(lessons.includes('Footer-Heavy Official Region Pages Can Still Complete County-Leaf Coverage'));

console.log('test-batch160-michigan-county-leaf-completion-v1: ok');
