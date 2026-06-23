import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch217ArizonaLaPazLeafAndCountyPacketAlignmentV1 } from './run-batch217-arizona-la-paz-leaf-and-county-packet-alignment-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), 'utf8'));
}

function readJsonl(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const batchSummary = generateBatch217ArizonaLaPazLeafAndCountyPacketAlignmentV1();

assert.equal(batchSummary.verified_district_leaf_count, 8);
assert.deepEqual(batchSummary.repaired_counties, ['la-paz-az']);
assert.equal(batchSummary.county_packet_exact_leaf_count, 0);

const leaves = readJsonl('data/generated/arizona_district_owned_special_education_leaves_v1.jsonl');
const laPaz = leaves.find((row) => row.county_id === 'la-paz-az');
assert.ok(laPaz, 'La Paz verified leaf should be present');
assert.equal(laPaz.source_url, 'https://www.parkerusd.org/page/ess-department');
assert.match(laPaz.evidence_title, /Exceptional Students Services/i);

const packet = readJson('data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json');
assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 8);
assert.equal(packet.current_problem_metrics.unresolvedDistrictOwnedLeafCount, 7);

const failures = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const educationFailure = failures.find((row) => row.family === 'district_or_county_education_routing');
assert.ok(educationFailure.evidence.includes('8/15 county-keyed district roots'));
assert.ok(educationFailure.evidence.includes('la-paz-az'));
assert.ok(!educationFailure.evidence.includes('Remaining unresolved counties are cochise-az, coconino-az, gila-az, la-paz-az'));

const countyFailure = failures.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_local_office_roots_challenge_and_existing_packet_still_zero_exact_leaves');
assert.ok(countyFailure.evidence.includes('existing authoring packet'));
assert.ok(countyFailure.evidence.includes('authoredExactLeafCount=0'));
assert.ok(!countyFailure.evidence.includes('no authored Arizona county-office leaf packet'));

const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.sample_count, 10);
assert.ok(educationVerified.samples.some((sample) => sample.county_id === 'la-paz-az'));

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
assert.ok(report.includes('8/15 county-keyed district roots'));
assert.ok(report.includes('existing authoring packet'));

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.ok(lessons.includes('### Homepage Anchor Text Can Beat Slug-Only Leaf Discovery'));

console.log('test-batch217-arizona-la-paz-leaf-and-county-packet-alignment-v1: ok');
