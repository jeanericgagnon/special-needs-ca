import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractIllinoisLegalAidEvidence, generateBatch54IllinoisLegalAidStatewideRepairV1 } from './run-batch54-illinois-legal-aid-statewide-repair-v1.mjs';

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

const illinoisLegalAidFixture = `
  <html><body>
    <title>Illinois Legal Aid Online</title>
    <a>Get Legal Help</a>
    <div>Get Legal Help About Us Resources</div>
    <div>living with a disability</div>
    <div>Form Library</div>
  </body></html>
`;

const evidence = extractIllinoisLegalAidEvidence(illinoisLegalAidFixture);
assert.ok(evidence.titleSnippet.includes('Illinois Legal Aid Online'));
assert.ok(evidence.routingSnippet.includes('Get Legal Help'));

const summary = await generateBatch54IllinoisLegalAidStatewideRepairV1(async () => ({
  status: 200,
  finalUrl: 'https://www.illinoislegalaid.org/',
  html: illinoisLegalAidFixture,
}));

const stateSummary = readJson('data/generated/illinois_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/illinois_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/illinois_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/illinois_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/illinois_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/illinois-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(stateSummary.classification, 'BLOCKED');
assert.equal(stateSummary.index_safe, false);
assert.equal(stateSummary.completeness_pct, 83, 'Illinois completeness should rise after legal-aid repair.');

const legal = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(legal.family_status, 'verified_state_grade');
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'));
assert.deepEqual(nextRows.map((row) => row.family), ['district_or_county_education_routing', 'parent_training_information_center']);

const pti = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'regional_only_reviewed_source');
assert.ok(
  pti.status_reason.includes('Family Matters PTIC became the official PTIC for Illinois as of October 1, 2025')
  || pti.status_reason.includes('reviewed Family Matters PTIC sample remains downstate-only'),
);

const legalVerified = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalVerified.family_status, 'verified_state_grade');
assert.equal(legalVerified.sample_count, 1);
assert.equal(legalVerified.samples[0].source_url, 'https://www.illinoislegalaid.org/');
assert.ok(report.includes('Legal aid is now verified at the statewide support layer'));

console.log('test-batch54-illinois-legal-aid-statewide-repair-v1: ok');
