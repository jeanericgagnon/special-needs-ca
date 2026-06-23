import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch254NewMexicoArchiveTailRefreshV1 } from './run-batch254-new-mexico-archive-tail-refresh-v1.mjs';

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

const result = generateBatch254NewMexicoArchiveTailRefreshV1();
const summary = readJson('data/generated/new-mexico_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-mexico_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-mexico_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-mexico_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-mexico_next_action_queue_v2.jsonl');
const countyPacket = readJson('data/generated/new-mexico_county_local_disability_resources_hca_archive_packet_v1.json');
const batchSummary = readJson('data/generated/batch254_new_mexico_archive_tail_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-mexico-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'district_leafs_missing_and_county_local_four_county_remainder_persists_after_empty_archive_tail');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_hca_archive_29_of_33_counties_with_four_county_remainder_and_empty_tail');
assert.match(countyGap.status_reason, /pages 1 through 12/i);
assert.match(countyGap.status_reason, /pages 9 through 12 all returned HTTP 200/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_hca_archive_still_missing_four_county_office_routing_remainder_and_tail_pages_are_empty');
assert.equal(countyFailure.next_action, 'review_official_hca_or_successor_office_roots_for_catron_harding_mora_union_only');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_hca_archive_29_of_33_counties_with_four_county_remainder_and_empty_tail');
assert.equal(countyVerified.sample_count, 5);
assert.equal(countyVerified.samples[3].source_type, 'official_empty_archive_tail_page');
assert.match(countyVerified.samples[3].evidence_snippet, /generic `Field Offices` archive shell/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'official_hca_archive_still_missing_four_county_office_routing_remainder_and_tail_pages_are_empty');
assert.match(countyNext.evidence, /pages 9 through 12 are now proven empty archive-tail shells/i);

assert.equal(countyPacket.current_metrics.reviewedArchivePages, 12);
assert.deepEqual(countyPacket.current_metrics.emptyArchiveTailPages, [9, 10, 11, 12]);
assert.deepEqual(countyPacket.missing_counties, ['Catron', 'Harding', 'Mora', 'Union']);

assert.equal(batchSummary.reviewedArchivePages, 12);
assert.deepEqual(batchSummary.emptyArchiveTailPages, [9, 10, 11, 12]);
assert.deepEqual(batchSummary.missingCounties, ['Catron', 'Harding', 'Mora', 'Union']);

assert.ok(report.includes('Fresh exact probes now show pages 9 through 12 are live but empty archive-tail shells'));
assert.ok(lessons.includes('### HTTP 200 Archive Tail Pages Can Still Be Empty'));

console.log('test-batch254-new-mexico-archive-tail-refresh-v1: ok');
