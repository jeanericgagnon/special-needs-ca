import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch226FloridaSitemapNoCountyOfficeLeafRefinementV1 } from './run-batch226-florida-sitemap-no-county-office-leaf-refinement-v1.mjs';

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

const result = generateBatch226FloridaSitemapNoCountyOfficeLeafRefinementV1();
const batchSummary = readJson('data/generated/batch226_florida_sitemap_no_county_office_leaf_refinement_summary_v1.json');
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch226-florida-sitemap-no-county-office-leaf-refinement-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.sitemapEnumeratesPublicAssistanceTree, true);
assert.equal(batchSummary.publicCountyOfficeLeafExposed, false);
assert.equal(batchSummary.anonymousCountyResultLaneExposed, false);
assert.equal(summary.primary_gap_reason, 'public_assistance_sitemap_has_no_county_office_leaf_and_myaccess_results_stay_authenticated');

const queueRow = queueRows.find((row) => row.state === 'florida');
assert.equal(queueRow.primary_gap_reason, 'public_assistance_sitemap_has_no_county_office_leaf_and_myaccess_results_stay_authenticated');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_assistance_sitemap_without_county_office_leaf');
assert.match(countyGap.status_reason, /live official sitemap/i);
assert.match(countyGap.status_reason, /no county office directory/i);
assert.match(countyGap.status_reason, /no county ESS office page/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'public_assistance_sitemap_has_no_county_office_leaf_and_myaccess_results_stay_authenticated');
assert.match(countyFailure.evidence, /live official sitemap/i);
assert.match(countyFailure.evidence, /no county office directory/i);
assert.match(countyFailure.evidence, /HTTP 401/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_public_assistance_sitemap_without_county_office_leaf');
const sitemapSample = countyVerified.samples.find((row) => row.source_url === 'https://www.myflfamilies.com/sitemap.xml');
assert.ok(sitemapSample);
assert.match(sitemapSample.evidence_snippet, /public-assistance subtree/i);
assert.match(sitemapSample.evidence_snippet, /no county office directory/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'public_assistance_sitemap_has_no_county_office_leaf_and_myaccess_results_stay_authenticated');
assert.equal(countyNext.next_action, 'hold_county_local_until_first_party_public_assistance_tree_exposes_county_leaf_or_anonymous_myaccess_results_exist');

assert.ok(report.includes('live official sitemap now closes the discovery loop'));
assert.ok(batchReport.includes('live official sitemap now proves the public-assistance tree itself has no county office directory'));
assert.ok(lessons.includes('### A Live Official Sitemap With No Office Leaf Is A Final County-Local Stop Signal'));

console.log('test-batch226-florida-sitemap-no-county-office-leaf-refinement-v1: ok');
