import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch237IdahoDhwSplitRefinementV1 } from './run-batch237-idaho-dhw-split-refinement-v1.mjs';

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

generateBatch237IdahoDhwSplitRefinementV1();

const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/idaho_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const packet = readJson('data/generated/idaho_county_local_disability_resources_leaf_authoring_packet_v1.json');
const queue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch237_idaho_dhw_split_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch237-idaho-dhw-split-refinement-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'reviewed_idaho_district_leaves_exist_and_dhw_split_is_explicit_but_county_grade_remains_incomplete');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract');
assert.match(countyGap.status_reason, /17 clean county-to-exact-office leaf matches/i);
assert.match(countyGap.status_reason, /27 counties remain blocked/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_dhw_office_stack_supports_17_clean_leaf_matches_but_27_legacy_counties_still_lack_public_contract');
assert.match(countyFailure.evidence, /Find a Service Location/i);
assert.match(countyFailure.evidence, /Caldwell Office/i);
assert.match(countyFailure.evidence, /27 counties remain blocked/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'retain_17_clean_exact_office_replacements_keep_canyon_split_explicit_and_leave_27_legacy_counties_blocked_until_idaho_publishes_county_contract');

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract');
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://healthandwelfare.idaho.gov/offices'));
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://healthandwelfare.idaho.gov/dhw/caldwell-office'));
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'reviewed_packet_with_17_clean_exact_replacements'));

assert.equal(packet.current_problem_metrics.reviewedBlockedLegacyCountyCount, 27);
assert.equal(packet.current_problem_metrics.reviewedCleanReplacementCount, 17);

const idQueue = queue.find((row) => row.state === 'idaho');
assert.equal(idQueue.primary_gap_reason, 'reviewed_idaho_district_leaves_exist_and_dhw_split_is_explicit_but_county_grade_remains_incomplete');

assert.equal(batchSummary.clean_exact_replacement_counties.length, 17);
assert.equal(batchSummary.unresolved_legacy_counties.length, 27);
assert.equal(batchSummary.canyon_split_open, true);

assert.match(report, /17 clean exact office replacements and the Canyon split are now explicitly separated from 27 counties/i);
assert.match(batchReport, /clean exact replacement counties: 17/i);

console.log('test-batch237-idaho-dhw-split-refinement-v1: ok');
