import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch245NewYorkOtdaReplacementRefreshV1 } from './run-batch245-new-york-otda-replacement-refresh-v1.mjs';

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

const result = generateBatch245NewYorkOtdaReplacementRefreshV1();
const summary = readJson('data/generated/new-york_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-york_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-york_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-york_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-york_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/new-york_county_local_disability_resources_health_host_packet_v1.json');
const batchSummary = readJson('data/generated/batch245_new_york_otda_replacement_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-york-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_health_hostwide_403');
assert.match(countyGap.status_reason, /otda\.ny\.gov\/workingfamilies\/dss\.asp/i);
assert.match(countyGap.status_reason, /connection resets/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyFailure.evidence, /obvious OTDA replacement host family/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.sample_count, 7);
assert.equal(countyVerified.samples[5].source_url, 'https://otda.ny.gov/workingfamilies/dss.asp');
assert.equal(countyVerified.samples[6].source_url, 'https://www.otda.ny.gov/');
assert.ok(countyVerified.samples.slice(5).every((row) => row.source_type === 'official_host_reset'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_public_health_ny_ldss_replacement_or_county_owned_locator_is_verified');
assert.match(countyNext.evidence, /OTDA replacement host family/i);

assert.equal(packet.current_metrics.boundedOtdaReplacementHostFailures, 7);
assert.equal(packet.replacement_host_probe.outcome, 'connection_reset_across_bounded_replacement_urls');
assert.equal(packet.replacement_host_probe.host_family[0], 'otda.ny.gov');

assert.equal(batchSummary.healthNyBlockedSurfaceCount, 5);
assert.equal(batchSummary.otdaReplacementHostFailureCount, 7);
assert.ok(report.includes('both the original `health.ny.gov` Medicaid host family and the bounded OTDA replacement-host family failed in live review'));
assert.ok(lessons.includes('### Treat Apex And WWW Connection Resets As A Failed Official Replacement-Host Family'));

console.log('test-batch245-new-york-otda-replacement-refresh-v1: ok');
