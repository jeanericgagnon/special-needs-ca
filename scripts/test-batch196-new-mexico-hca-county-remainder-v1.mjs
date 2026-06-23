import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch196NewMexicoHcaCountyRemainderV1 } from './run-batch196-new-mexico-hca-county-remainder-v1.mjs';

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

const result = generateBatch196NewMexicoHcaCountyRemainderV1();
const summary = readJson('data/generated/new-mexico_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-mexico_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-mexico_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-mexico_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-mexico_next_action_queue_v2.jsonl');
const countyPacket = readJson('data/generated/new-mexico_county_local_disability_resources_hca_archive_packet_v1.json');
const batchSummary = readJson('data/generated/batch196_new_mexico_hca_county_remainder_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-mexico-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'district_leafs_missing_and_county_local_now_reduced_to_four_county_office_routing_remainder');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_hca_archive_29_of_33_counties_with_four_county_remainder');
assert.match(countyGap.status_reason, /29 of 33 New Mexico counties/i);
assert.match(countyGap.status_reason, /Catron, Harding, Mora, and Union/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_hca_archive_still_missing_four_county_office_routing_remainder');
assert.equal(countyFailure.next_action, 'review_official_hca_or_successor_office_roots_for_catron_harding_mora_union_only');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_hca_archive_29_of_33_counties_with_four_county_remainder');
assert.equal(countyVerified.sample_count, 4);
assert.match(countyVerified.samples[0].evidence_snippet, /Roosevelt County, Hidalgo County, and Bernalillo County/i);
assert.match(countyVerified.samples[3].source_url, /union-and-harding-county/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'official_hca_archive_still_missing_four_county_office_routing_remainder');
assert.match(countyNext.evidence, /29 of 33 counties/i);

assert.equal(countyPacket.current_metrics.reviewedArchivePages, 8);
assert.equal(countyPacket.current_metrics.coveredCountiesFromArchive, 29);
assert.equal(countyPacket.current_metrics.missingCountyRemainder, 4);
assert.deepEqual(countyPacket.missing_counties, ['Catron', 'Harding', 'Mora', 'Union']);

assert.equal(batchSummary.reviewedArchivePages, 8);
assert.equal(batchSummary.coveredCountiesFromArchive, 29);
assert.deepEqual(batchSummary.missingCounties, ['Catron', 'Harding', 'Mora', 'Union']);

assert.ok(report.includes('The exact remaining county-local blocker is now only Catron, Harding, Mora, and Union.'));
assert.ok(report.includes('29 of 33 counties'));
assert.ok(lessons.includes('### Official Archive Pagination Can Collapse A "Partial County" Blocker Into A Small Remainder'));

console.log('test-batch196-new-mexico-hca-county-remainder-v1: ok');
