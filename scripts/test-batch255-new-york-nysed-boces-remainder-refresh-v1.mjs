import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch255NewYorkNysedBocesRemainderRefreshV1 } from './run-batch255-new-york-nysed-boces-remainder-refresh-v1.mjs';

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

const result = generateBatch255NewYorkNysedBocesRemainderRefreshV1();
const summary = readJson('data/generated/new-york_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-york_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-york_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-york_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-york_next_action_queue_v2.jsonl');
const educationPacket = readJson('data/generated/new-york_district_or_county_education_routing_boces_packet_v1.json');
const batchSummary = readJson('data/generated/batch255_new_york_nysed_boces_remainder_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-york-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_nysed_boces_pages_cover_non_nyc_counties_but_no_reviewed_nyc_borough_route_and_no_public_ldss_replacement');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'blocked_official_boces_pages_cover_non_nyc_counties_but_nyc_borough_route_missing');
assert.match(eduGap.status_reason, /57 non-NYC counties/i);
assert.match(eduGap.status_reason, /Bronx, Kings, Queens, Richmond/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'official_nysed_boces_pages_cover_57_non_nyc_counties_but_no_reviewed_nyc_borough_route');
assert.equal(eduFailure.next_action, 'hold_blocked_until_reviewed_official_nyc_borough_special_education_route_exists');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'blocked_official_boces_pages_cover_non_nyc_counties_but_nyc_borough_route_missing');
assert.equal(eduVerified.sample_count, 5);
assert.equal(eduVerified.samples[0].source_url, 'https://www.p12.nysed.gov/ds/jmt.html');
assert.equal(eduVerified.samples[1].source_url, 'https://www.p12.nysed.gov/ds/superintendents.html');
assert.equal(eduVerified.samples[4].source_type, 'official_nyc_special_education_remainder');

const eduNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduNext.failure_code, 'official_nysed_boces_pages_cover_57_non_nyc_counties_but_no_reviewed_nyc_borough_route');
assert.match(eduNext.evidence, /57 non-NYC counties/);
assert.match(eduNext.evidence, /Bronx, Kings, New York\/Manhattan, Queens, and Richmond/);

assert.equal(educationPacket.current_metrics.nonNycCountiesCoveredByOfficialBocesPages, 57);
assert.equal(educationPacket.current_metrics.nycBoroughRemainderCount, 5);
assert.deepEqual(educationPacket.remaining_nyc_boroughs, ['Bronx', 'Kings', 'New York', 'Queens', 'Richmond']);

assert.equal(batchSummary.nonNycCountiesCoveredByOfficialBocesPages, 57);
assert.equal(batchSummary.nycBoroughRemainderCount, 5);

assert.ok(report.includes('The official NYSED Joint Management Teams and District Superintendents pages now prove county-bearing BOCES routing for the non-NYC portion of the state.'));
assert.ok(report.includes('The remaining education blocker is now the lack of a reviewed official NYC borough special-education route'));
assert.ok(lessons.includes('### County-Cluster BOCES Pages Can Collapse A Statewide Education Blocker To An NYC Remainder'));

console.log('test-batch255-new-york-nysed-boces-remainder-refresh-v1: ok');
