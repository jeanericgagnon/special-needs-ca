import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  extractIndianaLegalAidEvidence,
  evaluateIndianaPtiEvidence,
  generateBatch88IndianaLegalAidAndPtiRefreshV1,
} from './run-batch88-indiana-legal-aid-and-pti-refresh-v1.mjs';

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

const legalFixture = `
  <html><body>
    <title>Home - Indiana Legal Services</title>
    <h1>Help for Hoosiers</h1>
    <div>Indiana Legal Services is a nonprofit law firm that provides free civil legal assistance to eligible low-income residents throughout the state of Indiana.</div>
  </body></html>
`;

const ptiFixtureHome = `
  <html><body>
    <title>IN*SOURCE | Every Learner. Every Family. Every Educator.</title>
    <div>Providing Indiana families and service providers the information and training necessary to assure effective educational programs and appropriate services for children and young adults with disabilities.</div>
  </body></html>
`;

const ptiFixtureGetHelp = `
  <html><body>
    <title>Get Help | IN*SOURCE</title>
    <div>Our expertise lies in helping you understand how Indiana's state special education law, Article 7, applies in your child's unique circumstances.</div>
  </body></html>
`;

const ptiFixtureContact = `
  <html><body>
    <title>Contact Us | IN*SOURCE</title>
    <div>Indiana Resource Center for Families with Special Needs</div>
  </body></html>
`;

const legalEvidence = extractIndianaLegalAidEvidence(legalFixture);
assert.ok(legalEvidence.titleSnippet.includes('Indiana Legal Services'));
assert.match(legalEvidence.routingSnippet, /throughout the state of Indiana/i);

const ptiEvaluation = evaluateIndianaPtiEvidence([
  { html: ptiFixtureHome },
  { html: ptiFixtureGetHelp },
  { html: ptiFixtureContact },
  { html: ptiFixtureContact },
]);
assert.equal(ptiEvaluation.explicitDesignationPreserved, false);
assert.match(ptiEvaluation.blockerEvidence, /still preserves statewide Indiana parent-support and training scope/i);

const pagesByUrl = new Map([
  ['https://www.indianalegalservices.org/', legalFixture],
  ['https://insource.org/', ptiFixtureHome],
  ['https://insource.org/about/', ptiFixtureContact],
  ['https://insource.org/get-help/', ptiFixtureGetHelp],
  ['https://insource.org/contact-us/', ptiFixtureContact],
]);

const summary = await generateBatch88IndianaLegalAidAndPtiRefreshV1(async (url) => ({
  status: 200,
  finalUrl: url,
  html: pagesByUrl.get(url),
}));

const stateSummary = readJson('data/generated/indiana_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/indiana_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/indiana_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/indiana_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/indiana_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/indiana-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(stateSummary.classification, 'BLOCKED');
assert.equal(stateSummary.index_safe, false);
assert.equal(stateSummary.completeness_pct, 75, 'Indiana completeness should rise after legal-aid repair.');
assert.equal(stateSummary.strong_critical_families, 9);
assert.equal(stateSummary.weak_critical_families, 3);
assert.equal(stateSummary.missing_critical_families, 0);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'blocked_reviewed_first_party_support_without_explicit_pti_designation');

assert.ok(!failureRows.some((row) => row.family === 'legal_aid'));
assert.equal(
  failureRows.find((row) => row.family === 'parent_training_information_center').failure_code,
  'bounded_live_first_party_review_still_lacks_explicit_pti_designation',
);

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'parent_training_information_center',
    'county_local_disability_resources',
  ],
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1);
assert.equal(verifiedByFamily.get('legal_aid').samples[0].source_url, 'https://www.indianalegalservices.org/');
assert.equal(
  verifiedByFamily.get('parent_training_information_center').blocker_code,
  'bounded_live_first_party_review_still_lacks_explicit_pti_designation',
);

assert.ok(report.includes('Indiana Legal Services is explicit enough for legal aid'));
assert.ok(report.includes('INSOURCE remains blocked for PTI'));
assert.ok(report.includes('still terminal BLOCKED, not COMPLETE'));

console.log('test-batch88-indiana-legal-aid-and-pti-refresh-v1: ok');
