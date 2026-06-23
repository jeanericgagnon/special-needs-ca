import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch261OhioCountySearchSurfaceRefinementV1 } from './run-batch261-ohio-county-search-surface-refinement-v1.mjs';

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

const result = generateBatch261OhioCountySearchSurfaceRefinementV1();
const summary = readJson('data/generated/ohio_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/ohio_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/ohio_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/ohio_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/ohio_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch261_ohio_county_search_surface_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/ohio-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only');
assert.equal(summary.final_blockers[0].failure_code, 'retired_official_county_family_and_public_search_surfaces_still_dead');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_retired_official_county_family_and_dead_public_search_surfaces');
assert.match(gap.status_reason, /public search\/sitemap surfaces/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'retired_official_county_family_and_public_search_surfaces_still_dead');
assert.match(failure.evidence, /ohio\.gov\/search\?query=job%20and%20family%20services/i);
assert.match(failure.evidence, /medicaid\.ohio\.gov\/sitemap\.xml/i);
assert.match(failure.evidence, /no live official county-office directory, locator, search index, or sitemap contract is verified/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_retired_official_county_family_and_dead_public_search_surfaces');
assert.equal(verified.blocker_code, 'retired_official_county_family_and_public_search_surfaces_still_dead');
assert.match(verified.query_basis, /search, and sitemap successor-path checks/i);

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.failure_code, 'retired_official_county_family_and_public_search_surfaces_still_dead');
assert.equal(next.next_action, 'hold_blocked_until_new_live_official_ohio_county_directory_locator_or_search_index_is_verified');

assert.equal(batchSummary.additional_public_surface_404s, 6);
assert.ok(report.includes('public search and sitemap surfaces also return 404'));
assert.ok(handoff.includes('## Current Focus State: Ohio'));
assert.ok(handoff.includes('retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only'));

console.log('test-batch261-ohio-county-search-surface-refinement-v1: ok');
