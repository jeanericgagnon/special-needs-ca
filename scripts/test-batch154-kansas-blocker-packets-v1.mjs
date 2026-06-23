import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch154KansasBlockerPacketsV1 } from './run-batch154-kansas-blocker-packets-v1.mjs';

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

const result = generateBatch154KansasBlockerPacketsV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch154_kansas_blocker_packets_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const ddPacket = readJson('data/generated/kansas_developmental_disability_idd_authority_repair_packet_v1.json');
const educationPacket = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

assert.equal(ddPacket.family, 'developmental_disability_idd_authority');
assert.equal(ddPacket.current_problem_metrics.staleLegacyDbRows, 1);
assert.equal(ddPacket.current_problem_metrics.deadLegacyRoots, 1);
assert.equal(ddPacket.current_problem_metrics.reviewedBlockedReplacementRoots, 1);
assert.equal(ddPacket.stale_db_rows[0].source_url, 'https://dhhs.kansas.gov/dd');

assert.equal(educationPacket.family, 'district_or_county_education_routing');
assert.equal(educationPacket.current_problem_metrics.placeholderSourceRows, 105);
assert.equal(educationPacket.current_problem_metrics.placeholderWebsiteRows, 105);
assert.equal(educationPacket.current_problem_metrics.countyRowCount, 105);
assert.equal(educationPacket.current_problem_metrics.officialMapPdfCount, 1);
assert.equal(educationPacket.current_problem_metrics.officialStatewideAuthoringRoots, 5);

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(ddGap.status_reason, /only live state-agency DD row in the DB still points at the dead dhhs\.kansas\.gov\/dd root/i);
assert.match(educationGap.status_reason, /all 105 current school_district rows still point at statewide KSDE placeholders/i);

const ddFailure = failureRows.find((row) => row.family === 'developmental_disability_idd_authority');
const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(ddFailure.evidence, /The only Kansas DD authority row still points at the dead legacy root https:\/\/dhhs\.kansas\.gov\/dd/i);
assert.match(educationFailure.evidence, /105 Kansas county rows still point at the statewide KSDE root/i);

assert.equal(nextRows.find((row) => row.family === 'developmental_disability_idd_authority').next_action, 'use_kansas_dd_repair_packet_to_try_reviewed_alt_official_dd_leaves_before_any_new_statewide_probe');
assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'use_kansas_district_leaf_packet_to_replace_105_ksde_placeholder_rows_with_reviewed_district_owned_special_education_leaves');

assert.match(verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority').query_basis, /generated a DD repair packet/i);
assert.match(verifiedRows.find((row) => row.family === 'district_or_county_education_routing').query_basis, /generated a district-owned leaf authoring packet/i);

assert.deepEqual(batchSummary.authored_packets, [
  'data/generated/kansas_developmental_disability_idd_authority_repair_packet_v1.json',
  'data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json',
]);
assert.ok(report.includes('explicit DD repair packet'));
assert.ok(report.includes('deterministic district-owned leaf packet'));
assert.ok(lessons.includes('### When A Live Statewide Map Root Exists But All Local Rows Still Point To One Placeholder, Packetize The Placeholder First'));

console.log('test-batch154-kansas-blocker-packets-v1: ok');
