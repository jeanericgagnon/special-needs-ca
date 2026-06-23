import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch233AlaskaAltHostFinalizationV1 } from './run-batch233-alaska-alt-host-finalization-v1.mjs';

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

const result = generateBatch233AlaskaAltHostFinalizationV1();
const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch233_alaska_alt_host_finalization_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch233-alaska-alt-host-finalization-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'browser_only_dpa_directory_lacks_borough_mapping_and_all_official_successor_hosts_fail_closed');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_dpa_directory_incomplete_and_all_official_successor_hosts_fail_closed');
assert.match(gap.status_reason, /alternate official-host probes all fail closed/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'browser_only_dpa_directory_lacks_borough_mapping_and_all_official_successor_hosts_fail_closed');
assert.match(failure.evidence, /my\.alaska\.gov\/robots\.txt/i);
assert.match(failure.evidence, /alaska\.gov\/search/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_dpa_directory_incomplete_and_all_official_successor_hosts_fail_closed');
assert.equal(verified.sample_count, 19);
assert.ok(verified.samples.some((sample) => /my\.alaska\.gov anti-bot gate/i.test(sample.sample_name)));
assert.ok(verified.samples.some((sample) => /alaska\.gov search 404/i.test(sample.sample_name)));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_the_health_host_and_successor_gates_clear');

assert.equal(batchSummary.health_host_challenged, true);
assert.equal(batchSummary.alt_successor_hosts_failed_closed, true);
assert.match(report, /Alternate official successors also fail closed/);
assert.ok(batchReport.includes('my.alaska.gov'));
assert.ok(lessons.includes('### Alternate Official Hosts Can Confirm A Final Blocker'));

console.log('test-batch233-alaska-alt-host-finalization-v1: ok');
