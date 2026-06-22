import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch113GeorgiaDdUnpublishedLinkRefinementV1 } from './run-batch113-georgia-dd-unpublished-link-refinement-v1.mjs';

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

const result = generateBatch113GeorgiaDdUnpublishedLinkRefinementV1();
const summary = readJson('data/generated/georgia_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/georgia_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/georgia_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/georgia_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/georgia_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch113_georgia_dd_unpublished_link_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/georgia-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_county_page_points_to_unpublished_region_leaves');

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddGap.family_status, 'blocked_unpublished_official_region_links');
assert.match(ddGap.status_reason, /data-status-unpublished=1/i);
assert.match(ddGap.status_reason, /Not visible to public/i);

const ddFailure = failureRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddFailure.failure_code, 'official_county_page_points_to_unpublished_region_leaves');
assert.match(ddFailure.evidence, /data-status-unpublished=\"1\"/i);
assert.match(ddFailure.evidence, /aria-label=\"Not visible to public\"/i);

const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddVerified.family_status, 'blocked_unpublished_official_region_links');
assert.equal(ddVerified.blocker_code, 'official_county_page_points_to_unpublished_region_leaves');
assert.match(ddVerified.query_basis, /unpublished region links/i);

const ddNext = nextRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddNext.next_action, 'hold_blocked_until_public_county_to_region_source_replaces_unpublished_region_links');

assert.equal(batchSummary.evidence_checks.countyCellsVisible, false);
assert.equal(batchSummary.evidence_checks.repeatedRegionLinksPresent, true);
assert.equal(batchSummary.evidence_checks.publicCountyToRegionMapAvailable, false);

assert.ok(report.includes('points only to unpublished region leaves'));
assert.ok(lessons.includes('Unpublished Markup On Official Links Is A Public-Evidence Failure'));

console.log('test-batch113-georgia-dd-unpublished-link-refinement-v1: ok');
