import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractOhioLegalAidEvidence, generateBatch52OhioLegalAidStatewideRepairV1 } from './run-batch52-ohio-legal-aid-statewide-repair-v1.mjs';

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

const ohioLegalHelpFixture = `
  <html><body>
    <title>Need legal information, forms or a lawyer? | Ohio Legal Help</title>
    <p>Ohio Legal Help offers free legal information, basic legal how-to's, court forms and connections to organizations that offer legal advice and representation.</p>
    <a>Find a Lawyer</a>
  </body></html>
`;

const evidence = extractOhioLegalAidEvidence(ohioLegalHelpFixture);
assert.ok(evidence.titleSnippet.includes('Ohio Legal Help'));
assert.ok(evidence.routingSnippet.includes('connections to organizations that offer legal advice and representation'));

const summary = await generateBatch52OhioLegalAidStatewideRepairV1(async () => ({
  status: 200,
  finalUrl: 'https://www.ohiolegalhelp.org/',
  html: ohioLegalHelpFixture,
}));

const stateSummary = readJson('data/generated/ohio_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/ohio_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/ohio_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/ohio_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/ohio_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/ohio-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(stateSummary.classification, 'BLOCKED');
assert.equal(stateSummary.index_safe, false);
assert.equal(stateSummary.completeness_pct, 83, 'Ohio completeness should rise after legal-aid repair.');

const legal = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(legal.family_status, 'verified_state_grade');
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'));
assert.deepEqual(nextRows.map((row) => row.family), ['county_local_disability_resources', 'district_or_county_education_routing']);

const legalVerified = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalVerified.family_status, 'verified_state_grade');
assert.equal(legalVerified.sample_count, 1);
assert.equal(legalVerified.samples[0].source_url, 'https://www.ohiolegalhelp.org/');
assert.ok(report.includes('Legal aid is now verified at the statewide support layer'));

console.log('test-batch52-ohio-legal-aid-statewide-repair-v1: ok');
