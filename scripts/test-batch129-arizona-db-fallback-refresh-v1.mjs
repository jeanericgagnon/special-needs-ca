import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch129ArizonaDbFallbackRefreshV1 } from './run-batch129-arizona-db-fallback-refresh-v1.mjs';

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

const result = generateBatch129ArizonaDbFallbackRefreshV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const educationPacket = readJson('data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json');
const batchSummary = readJson('data/generated/batch129_arizona_db_fallback_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'challenged_official_roots_and_db_inventory_still_placeholder_only');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduGap.status_reason, /15\/15 Arizona school_district rows point at the same challenged https:\/\/www\.azed\.gov\/specialeducation root/i);
assert.match(eduGap.status_reason, /school-district-web-sites/i);
assert.match(countyGap.status_reason, /14\/15 Arizona county_offices rows point at the DOI-derived FAA placeholder/i);
assert.match(countyGap.status_reason, /dhhs\.arizona\.gov\/locations/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduFailure.evidence, /15\/15 Arizona school_district rows point at the same statewide AZED root/i);
assert.match(eduFailure.evidence, /cf-mitigated: challenge/i);
assert.match(countyFailure.evidence, /Greenlee still points at the generic legacy root/i);
assert.match(countyFailure.evidence, /Page\/Document not found/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(eduVerified.query_basis, /current DB fallback inventory/i);
assert.match(countyVerified.query_basis, /current DB fallback inventory/i);

assert.match(nextRows.find((row) => row.family === 'district_or_county_education_routing').evidence, /no district-owned Arizona special-education or student-services leaf has yet been attached/i);
assert.match(nextRows.find((row) => row.family === 'county_local_disability_resources').evidence, /stale county-root inventory/i);

assert.equal(educationPacket.current_problem_metrics.statewideFallbackRows, 15);
assert.equal(countyPacket.current_problem_metrics.doiPlaceholderRows, 14);
assert.equal(countyPacket.current_problem_metrics.genericLegacyLocatorRows, 1);

assert.equal(batchSummary.education_statewide_fallback_rows, 15);
assert.equal(batchSummary.county_doi_placeholder_rows, 14);
assert.equal(batchSummary.county_legacy_locator_rows, 1);
assert.ok(report.includes('15/15 current Arizona district rows are the same challenged statewide ADE fallback URL'));
assert.ok(lessons.includes('### One Shared Statewide Fallback URL Across Every County Row Is A Packet Placeholder Signal'));

console.log('test-batch129-arizona-db-fallback-refresh-v1: ok');
