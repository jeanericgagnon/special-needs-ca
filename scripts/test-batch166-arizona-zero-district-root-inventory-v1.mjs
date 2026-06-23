import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch166ArizonaZeroDistrictRootInventoryV1 } from './run-batch166-arizona-zero-district-root-inventory-v1.mjs';

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

const result = generateBatch166ArizonaZeroDistrictRootInventoryV1();
const batchSummary = readJson('data/generated/batch166_arizona_zero_district_root_inventory_summary_v1.json');
const educationPacket = readJson('data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'zero_district_root_inventory_and_ahcccs_sitemap_exposes_no_county_office_contract');
assert.equal(batchSummary.live_fallback_rows, 15);
assert.equal(batchSummary.staging_fallback_rows, 13);
assert.equal(batchSummary.live_distinct_root_count, 1);
assert.equal(batchSummary.staging_distinct_root_count, 1);
assert.equal(batchSummary.live_district_owned_root_count, 0);
assert.equal(batchSummary.staging_district_owned_root_count, 0);

assert.equal(educationPacket.repair_lane, 'county_keyed_district_root_authoring_then_leaf_authoring');
assert.equal(educationPacket.current_problem_metrics.liveDistrictOwnedRootCount, 0);
assert.equal(educationPacket.current_problem_metrics.stagingDistrictOwnedRootCount, 0);
assert.deepEqual(educationPacket.root_domains_to_review, [
  'county-keyed Arizona district-owned domains only',
  'do not reopen AZED host discovery until the challenge clears on root, likely replacement leaves, robots.txt, and sitemap.xml',
]);

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'blocked_zero_local_root_inventory_before_leaf_authoring');
assert.match(eduGap.status_reason, /county-keyed district-root authoring first/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'no_district_owned_arizona_root_inventory_exists_in_live_or_staging_packet');
assert.match(eduFailure.evidence, /Neither inventory preserves a single district-owned Arizona root domain/i);
assert.equal(eduFailure.next_action, 'author_county_keyed_district_owned_root_inventory_then_exact_special_education_leaves');

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.family_status, 'blocked_zero_local_root_inventory_before_leaf_authoring');
assert.match(eduVerified.query_basis, /live and staging district inventory/i);

const eduNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduNext.next_action, 'author_county_keyed_district_owned_root_inventory_then_exact_special_education_leaves');

assert.ok(report.includes('neither live nor staging inventory preserves any district-owned Arizona roots'));
assert.ok(report.includes('county-keyed district-root authoring first'));
assert.ok(lessons.includes('### Leaf Authoring Packets Need Real Local Roots Before They Count As Runnable'));

console.log('test-batch166-arizona-zero-district-root-inventory-v1: ok');
