import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch265IdahoCountyBearingSitemapExhaustionV1 } from './run-batch265-idaho-county-bearing-sitemap-exhaustion-v1.mjs';

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

generateBatch265IdahoCountyBearingSitemapExhaustionV1();

const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch265_idaho_county_bearing_sitemap_exhaustion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch265-idaho-county-bearing-sitemap-exhaustion-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'reviewed_idaho_district_leaves_hold_at_12_counties_and_remaining_county_bearing_district_roots_now_have_public_sitemap_exhaustion_evidence');
assert.equal(summary.final_blockers[0].failure_code, 'reviewed_district_special_services_leaves_hold_at_12_counties_and_remaining_county_bearing_sitemaps_expose_no_role_slug');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(gap.status_reason, /Bear Lake, Camas, Clark, Fremont, Jefferson, Oneida, or Shoshone/i);
assert.match(gap.status_reason, /Jefferson returned HTTP 406 on sitemap\.xml/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'reviewed_district_special_services_leaves_hold_at_12_counties_and_remaining_county_bearing_sitemaps_expose_no_role_slug');
assert.match(failure.evidence, /Bear Lake County District #33/i);
assert.match(failure.evidence, /Fremont returned only a non-role `student-enrollment` sitemap hit/i);
assert.match(failure.evidence, /Shoshone exposed a WordPress sitemap with zero/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.sample_count, 14);
assert.match(verified.blocker_evidence, /still-uncovered county-bearing district hosts/i);

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'continue_exact_district_leaf_expansion_only_when_uncovered_idaho_district_hosts_expose_role_bearing_special_education_or_special_services_leaves');

assert.equal(batchSummary.reviewed_exact_leaf_count, 12);
assert.equal(batchSummary.exhausted_county_bearing_roots.length, 7);
assert.ok(batchSummary.exhausted_county_bearing_roots.includes('oneida-id'));
assert.match(report, /bounded county-bearing sitemap pass produced no new exact role leaf/i);
assert.match(batchReport, /bounded root\/sitemap lane is now exhausted/i);

console.log('test-batch265-idaho-county-bearing-sitemap-exhaustion-v1: ok');
