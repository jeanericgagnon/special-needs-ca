import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractLawHelpNyEvidence, generateBatch53NewYorkLegalAidStatewideRepairV1 } from './run-batch53-new-york-legal-aid-statewide-repair-v1.mjs';

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

const lawHelpFixture = `
  <html><body>
    <title>Free Legal Help in New York State | LawHelpNY</title>
    <a>Find a Lawyer</a>
    <div>Legal Directory</div>
    <div>Search for free legal services in New York.</div>
    <div>Setting your location helps us find resources in your county.</div>
  </body></html>
`;

const evidence = extractLawHelpNyEvidence(lawHelpFixture);
assert.ok(evidence.titleSnippet.includes('LawHelpNY'));
assert.ok(evidence.routingSnippet.includes('resources in your county'));

const summary = await generateBatch53NewYorkLegalAidStatewideRepairV1(async () => ({
  status: 200,
  finalUrl: 'https://www.lawhelpny.org/',
  html: lawHelpFixture,
}));

const stateSummary = readJson('data/generated/new-york_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-york_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-york_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/new-york_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-york_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-york-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(stateSummary.classification, 'BLOCKED');
assert.equal(stateSummary.index_safe, false);
assert.equal(stateSummary.completeness_pct, 75, 'New York completeness should rise after legal-aid repair.');

const legal = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(legal.family_status, 'verified_state_grade');
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'));
assert.deepEqual(nextRows.map((row) => row.family), ['county_local_disability_resources', 'district_or_county_education_routing', 'parent_training_information_center']);

const pti = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'blocked_reviewed_regional_source_not_statewide', 'New York PTI must remain blocked because IncludeNYC was not reviewed as a statewide PTI route in this pass.');

const legalVerified = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalVerified.family_status, 'verified_state_grade');
assert.equal(legalVerified.sample_count, 1);
assert.equal(legalVerified.samples[0].source_url, 'https://www.lawhelpny.org/');
assert.ok(report.includes('Legal aid is now verified at the statewide support layer'));

console.log('test-batch53-new-york-legal-aid-statewide-repair-v1: ok');
