import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch193NevadaCountyOfficePacketV1 } from './run-batch193-nevada-county-office-packet-v1.mjs';

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

const result = generateBatch193NevadaCountyOfficePacketV1();
const summary = readJson('data/generated/nevada_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nevada_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nevada_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/nevada_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nevada_verified_sources_v1.jsonl');
const packet = readJson('data/generated/nevada_county_local_disability_resources_welfare_office_packet_v1.json');
const batchSummary = readJson('data/generated/batch193_nevada_county_office_packet_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nevada-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_welfare_office_pages_without_county_contract');
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].failure_code, 'official_welfare_district_office_pages_live_but_no_county_coverage_contract');
assert.match(summary.final_blockers[0].evidence, /zero county terms/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_welfare_office_pages_without_county_contract');
assert.match(countyGap.status_reason, /stale parent office root/i);
assert.match(countyGap.status_reason, /no county filter or county assignment/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_welfare_district_office_pages_live_but_no_county_coverage_contract');
assert.match(countyFailure.evidence, /zero county-served labels/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_live_welfare_office_pages_without_county_contract');
assert.equal(countyVerified.sample_count, 4);
assert.match(countyVerified.samples[0].source_url, /dwss\.nv\.gov\/Contact\/Welfare_District_Offices/i);
assert.match(countyVerified.samples[0].evidence_snippet, /retired from Nevada county-local proof/i);
assert.match(countyVerified.samples[1].evidence_snippet, /zero county terms/i);
assert.match(countyVerified.samples[2].evidence_snippet, /no county labels or county-served fields/i);
assert.match(countyVerified.samples[3].evidence_snippet, /no county labels or county-served fields/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_official_county_to_welfare_office_contract_is_reviewed');

assert.equal(packet.current_metrics.countyTotal, 17);
assert.equal(packet.current_metrics.liveChildLeavesReviewed, 2);
assert.equal(packet.current_metrics.staleParentRootRetired, true);
assert.equal(packet.current_metrics.zeroCountyTokensOnReviewedPages, 3);
assert.equal(packet.zero_county_term_probes.length, 3);
assert.ok(packet.representative_sources.some((row) => row.status === 'stale_parent_root'));

assert.equal(batchSummary.stale_parent_root_retired, true);
assert.equal(batchSummary.zero_county_term_pages, 3);

assert.ok(report.includes('County-local packet saved at `data/generated/nevada_county_local_disability_resources_welfare_office_packet_v1.json`'));
assert.ok(report.includes('The stale parent office root is now retired from future Nevada county-local retries.'));
assert.ok(lessons.includes('### Stale Parent Locators Should Not Override Live Child Leaves'));

console.log('test-batch193-nevada-county-office-packet-v1: ok');
