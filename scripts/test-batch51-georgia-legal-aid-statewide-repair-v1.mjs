import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractGeorgiaLegalAidEvidence, generateBatch51GeorgiaLegalAidStatewideRepairV1 } from './run-batch51-georgia-legal-aid-statewide-repair-v1.mjs';

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

const glspFixture = `
  <html><body>
    <h1>Need Help</h1>
    <p>Our attorneys and paralegals provide free civil legal help to Georgians in 154 counties outside of Metro-Atlanta. We do not represent persons living in Clayton, Cobb, DeKalb, Fulton or Gwinnett counties.</p>
  </body></html>
`;

const atlantaFixture = `
  <html><body>
    <h1>OUR MISSION</h1>
    <p>Atlanta Legal Aid Society’s mission is to provide free civil legal assistance to help people in need access justice to protect their rights and secure their safety and stability.</p>
    <p>Fulton County / Downtown Headquarters</p>
    <p>Clayton County</p>
    <p>Cobb County</p>
    <p>DeKalb County</p>
    <p>Gwinnett County</p>
  </body></html>
`;

const evidence = extractGeorgiaLegalAidEvidence(glspFixture, atlantaFixture);
assert.ok(evidence.glspSnippet.includes('154 counties outside of Metro-Atlanta'));
assert.ok(evidence.atlantaSnippet.includes('Gwinnett County'));

const summary = await generateBatch51GeorgiaLegalAidStatewideRepairV1(async (url) => {
  if (url.includes('glsp.org')) {
    return { status: 200, finalUrl: url, html: glspFixture };
  }
  if (url.includes('atlantalegalaid.org')) {
    return { status: 200, finalUrl: url, html: atlantaFixture };
  }
  throw new Error(`Unexpected URL ${url}`);
});

const stateSummary = readJson('data/generated/georgia_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/georgia_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/georgia_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/georgia_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/georgia_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/georgia-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(stateSummary.classification, 'BLOCKED');
assert.equal(stateSummary.index_safe, false);
assert.equal(stateSummary.completeness_pct, 83, 'Georgia completeness should rise after legal-aid repair.');

const legal = gapRows.find((row) => row.family === 'legal_aid');
assert.equal(legal.family_status, 'verified_state_grade', 'Georgia legal aid should now be verified from first-party statewide routing evidence.');
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'), 'Georgia legal aid must drop out of the failure ledger.');
assert.deepEqual(nextRows.map((row) => row.family), ['developmental_disability_idd_authority', 'district_or_county_education_routing'], 'Georgia next actions must collapse to the two real remaining county-grade blockers.');

const legalVerified = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalVerified.family_status, 'verified_state_grade');
assert.equal(legalVerified.sample_count, 2);
assert.equal(legalVerified.samples[0].source_url, 'https://www.glsp.org/need-help/');
assert.equal(legalVerified.samples[1].source_url, 'https://atlantalegalaid.org/home/');
assert.ok(report.includes('Legal aid is now verified at the statewide support layer'));

console.log('test-batch51-georgia-legal-aid-statewide-repair-v1: ok');
