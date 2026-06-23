import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch160KansasDdHostAccessPatternV1 } from './run-batch160-kansas-dd-host-access-pattern-v1.mjs';

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

const result = generateBatch160KansasDdHostAccessPatternV1();
const batchSummary = readJson('data/generated/batch160_kansas_dd_host_access_pattern_summary_v1.json');
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const packet = readJson('data/generated/kansas_developmental_disability_idd_authority_repair_packet_v1.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.kdads_access_denied, true);
assert.equal(batchSummary.kancare_access_denied, true);
assert.equal(batchSummary.kdads_robots_readable, true);
assert.equal(summary.primary_gap_reason, 'kansas_dd_hosts_are_transport_blocked_and_education_still_lacks_county_or_district_contract');

assert.equal(packet.current_problem_metrics.kdadsExactBlockedLeaves, 5);
assert.equal(packet.current_problem_metrics.kdadsSitemapBlocked, true);
assert.equal(packet.current_problem_metrics.kancareSupportingBlockedLeaves, 4);
assert.equal(packet.current_problem_metrics.kdadsRobotsReadable, true);
assert.deepEqual(packet.root_domains_to_review, [
  'browser-assisted reviewed KDADS DD leaves if access permits',
  'alternate-official Kansas DD leaves outside the hostwide access-denied stack',
  'KanCare HCBS crossover pages only as supporting context, not completion proof',
]);

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddGap.family_status, 'blocked_hostwide_access_denied_dd_stack');
assert.match(ddGap.status_reason, /exact KDADS DD candidate leaves, KDADS search, and KDADS sitemap all return hostwide access-denied shells/i);

const ddFailure = failureRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddFailure.failure_code, 'exact_kdads_and_kancare_dd_leaves_are_hostwide_access_denied_while_robots_stays_open');
assert.match(ddFailure.evidence, /https:\/\/www\.kdads\.ks\.gov\/robots\.txt still responded publicly/i);

const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddVerified.family_status, 'blocked_hostwide_access_denied_dd_stack');
assert.equal(ddVerified.sample_count, 3);
assert.deepEqual(ddVerified.samples.map((sample) => sample.sample_name), [
  'KDADS DD candidate leaf',
  'KDADS robots.txt',
  'KanCare HCBS crossover leaf',
]);

const ddNext = nextRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddNext.next_action, 'browser_assisted_or_reviewed_alt_official_dd_leaf_after_hostwide_access_denied_confirmation');

assert.ok(report.includes('The DD blocker is now transport-specific'));
assert.ok(report.includes('open robots.txt on the same host does not change that blocker'));
assert.ok(lessons.includes('### Open robots.txt Does Not Mean The Official Host Is Scrapeable'));

console.log('test-batch160-kansas-dd-host-access-pattern-v1: ok');
