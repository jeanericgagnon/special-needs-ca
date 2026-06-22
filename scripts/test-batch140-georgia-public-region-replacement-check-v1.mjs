import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch140GeorgiaPublicRegionReplacementCheckV1 } from './run-batch140-georgia-public-region-replacement-check-v1.mjs';

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

const result = generateBatch140GeorgiaPublicRegionReplacementCheckV1();
const summary = readJson('data/generated/georgia_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/georgia_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/georgia_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/georgia_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/georgia_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch140_georgia_public_region_replacement_check_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/georgia-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.primary_gap_reason, 'official_county_page_omits_county_labels_while_public_region_replacements_lack_county_service_area_contract');

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
const ddFailure = failureRows.find((row) => row.family === 'developmental_disability_idd_authority');
const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
const ddNext = nextRows.find((row) => row.family === 'developmental_disability_idd_authority');

assert.equal(ddGap.family_status, 'blocked_county_page_without_county_labels');
assert.match(ddGap.status_reason, /public official replacement leaves/i);
assert.match(ddGap.status_reason, /159 blank first-column rows/i);
assert.ok(ddFailure);
assert.match(ddFailure.evidence, /\/contacts\/region-\*-field-office/i);
assert.match(ddFailure.evidence, /\/locations\/region-\*-field-office/i);
assert.match(ddFailure.evidence, /do not expose counties served/i);
assert.ok(ddNext);
assert.equal(ddNext.next_action, 'hold_blocked_until_public_county_to_region_mapping_or_counties_served_contract_is_republished');

assert.equal(ddVerified.family_status, 'blocked_county_page_without_county_labels');
assert.equal(ddVerified.sample_count, 13);
assert.match(ddVerified.query_basis, /official sitemap-discovered \/contacts and \/locations region replacements/i);
assert.equal(ddVerified.samples[0].verification_status, 'blocked');
assert.equal(ddVerified.samples[1].verification_status, 'verified');
assert.equal(ddVerified.samples[7].verification_status, 'verified');
assert.match(ddVerified.samples[1].source_url, /contacts\/region-1-field-office$/);
assert.match(ddVerified.samples[7].source_url, /locations\/region-1-field-office$/);

assert.equal(batchSummary.county_lookup_blank_rows, 159);
assert.equal(batchSummary.public_region_contact_leaves, 6);
assert.equal(batchSummary.public_region_location_leaves, 6);
assert.equal(batchSummary.county_mapping_contract_found, false);
assert.ok(report.includes('public official region contact and location leaves'));
assert.ok(lessons.includes('### Official Sitemap Siblings Can Repair Dead Legacy Slugs Without Repairing County Coverage'));

console.log('test-batch140-georgia-public-region-replacement-check-v1: ok');
