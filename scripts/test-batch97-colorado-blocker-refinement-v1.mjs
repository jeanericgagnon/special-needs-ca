import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch97ColoradoBlockerRefinementV1 } from './run-batch97-colorado-blocker-refinement-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch97ColoradoBlockerRefinementV1();
const summary = readJson('data/generated/colorado_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/colorado_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/colorado_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/colorado_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/colorado_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch97_colorado_blocker_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/colorado-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'COMPLETE');
assert.equal(result.index_safe, true);
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.deepEqual(summary.final_blockers, []);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'verified_state_grade');
assert.match(byFamily.get('district_or_county_education_routing').status_reason, /District Contacts leaf/);
assert.equal(byFamily.get('county_local_disability_resources').family_status, 'verified_state_grade');
assert.match(byFamily.get('county_local_disability_resources').status_reason, /64 county-labeled human-services links/);

assert.equal(failureRows.length, 0, 'Colorado should have no remaining failure-ledger rows after both blocker families clear.');
assert.equal(nextRows.length, 0, 'Colorado should have no remaining next-action rows after both blocker families clear.');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'verified_state_grade');
assert.equal(eduVerified.sample_count, 1);
assert.equal(eduVerified.samples[0].source_url, 'https://ed.cde.state.co.us/cdesped/office-of-special-education/sped-gifted-dir');
assert.match(eduVerified.samples[0].evidence_snippet, /Special Education Director entries/);
assert.equal(eduVerified.blocker_code, null);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_state_grade');
assert.equal(countyVerified.sample_count, 1);
assert.equal(countyVerified.samples[0].source_url, 'https://cdhs.colorado.gov/contact-your-county');
assert.match(countyVerified.samples[0].evidence_snippet, /64 county-labeled human-services links/);
assert.equal(countyVerified.blocker_code, null);

assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);
assert.equal(batchSummary.evidence_checks.education.status, 200);
assert.equal(batchSummary.evidence_checks.countyLocal.status, 200);

assert.ok(report.includes('Colorado now reaches California-grade and becomes index-safe'));
assert.ok(report.includes('official CDHS county directory itself preserves county-local routing statewide with 64 county-labeled human-services links'));
assert.ok(report.includes('official CDE District Contacts leaf preserves district-specific Special Education Director'));
assert.ok(report.includes('## Failure ledger\n\n- none'));
assert.ok(report.includes('## Next actions\n\n- none'));

console.log('test-batch97-colorado-blocker-refinement-v1: ok');
