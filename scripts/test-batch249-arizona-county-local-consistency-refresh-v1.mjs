import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch249ArizonaCountyLocalConsistencyRefreshV1 } from './run-batch249-arizona-county-local-consistency-refresh-v1.mjs';

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

const result = generateBatch249ArizonaCountyLocalConsistencyRefreshV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const countyPacket = readJson('data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json');
const batchSummary = readJson('data/generated/batch249_arizona_county_local_consistency_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch249-arizona-county-local-consistency-refresh-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');

const summaryBlocker = summary.final_blockers.find((row) => row.family === 'county_local_disability_resources');
assert.equal(summaryBlocker.failure_code, 'des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract');
assert.match(summaryBlocker.evidence, /partially parseable/i);

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract');
assert.match(gap.status_reason, /partly parseable/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract');
assert.match(failure.evidence, /seven named ALTCS office cards/i);
assert.match(failure.evidence, /partially parseable/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract');
assert.equal(verified.sample_count, verified.samples.length);
assert.match(verified.query_basis, /partially parseable ALTCS county map PDF/i);

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.failure_code, 'des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract');
assert.equal(next.next_action, 'hold_blocked_until_des_clears_or_ahcccs_publishes_county_to_office_assignments_in_reviewable_html_or_parseable_admin_artifacts');

assert.equal(countyPacket.current_problem_metrics.altcsRawHtmlVisibleOfficeCount, 7);
assert.equal(countyPacket.current_problem_metrics.partialCountyMapArtifacts, 1);

assert.equal(batchSummary.altcsRawHtmlVisibleOfficeCount, 7);
assert.match(report, /seven named ALTCS office cards plus a partially parseable county map/i);
assert.match(batchReport, /seven named ALTCS office cards, not a single visible Yuma card/i);

console.log('test-batch249-arizona-county-local-consistency-refresh-v1: ok');
