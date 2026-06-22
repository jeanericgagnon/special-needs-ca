import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch99DelawareBlockerRefinementV1 } from './run-batch99-delaware-blocker-refinement-v1.mjs';

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

const result = generateBatch99DelawareBlockerRefinementV1();
const summary = readJson('data/generated/delaware_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/delaware_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/delaware_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/delaware_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/delaware_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch99_delaware_blocker_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/delaware-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.deepEqual(summary.major_gap_families, []);
assert.deepEqual(summary.final_blockers.map((row) => row.family), ['district_or_county_education_routing']);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('special_education_idea_part_b').family_status, 'verified_state_grade');
assert.match(byFamily.get('special_education_idea_part_b').status_reason, /exact statewide special-education authority leaf/);
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_statewide_de_doe_root_rows_only');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /WordPress sitemap/);
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'verified_state_grade');
assert.match(byFamily.get('county_local_disability_resources').status_reason, /State Service Centers page/);

assert.equal(failureRows.some((row) => row.family === 'special_education_idea_part_b'), false);
assert.equal(failureRows.some((row) => row.family === 'county_local_disability_resources'), false);
const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'all_counties_still_use_statewide_de_doe_root');

const specialEdVerified = verifiedRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(specialEdVerified.family_status, 'verified_state_grade');
assert.equal(specialEdVerified.sample_count, 1);
assert.match(specialEdVerified.samples[0].source_url, /families\/k12\/special-education/);
assert.match(specialEdVerified.samples[0].final_url, /legacy\/home\/instruction-and-assessment\/exceptional-children\/special-education/);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_state_grade');
assert.equal(countyVerified.sample_count, 1);
assert.equal(countyVerified.samples[0].source_url, 'https://dhss.delaware.gov/dss/division-of-social-services/state-service-centers/');
assert.match(countyVerified.samples[0].evidence_snippet, /New Castle, Kent County, and Sussex County/);

assert.equal(nextRows.some((row) => row.family === 'special_education_idea_part_b'), false);
assert.equal(nextRows.some((row) => row.family === 'county_local_disability_resources'), false);
assert.equal(batchSummary.completeness_pct, 91);
assert.deepEqual(batchSummary.repaired_families, ['special_education_idea_part_b', 'county_local_disability_resources']);
assert.ok(report.includes('State Service Centers page preserves county-grouped service-center listings'));
assert.ok(report.includes('only the education local-proof family remains blocked'));

console.log('test-batch99-delaware-blocker-refinement-v1: ok');
