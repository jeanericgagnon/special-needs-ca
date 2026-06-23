import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch231MinnesotaMdeanalyticsInstabilityRefreshV1 } from './run-batch231-minnesota-mdeanalytics-instability-refresh-v1.mjs';

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

const result = generateBatch231MinnesotaMdeanalyticsInstabilityRefreshV1();
const summary = readJson('data/generated/minnesota_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/minnesota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/minnesota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/minnesota_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/minnesota_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/minnesota_district_or_county_education_routing_directory_contract_packet_v1.json');
const batchSummary = readJson('data/generated/batch231_minnesota_mdeanalytics_instability_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/minnesota-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch231-minnesota-mdeanalytics-instability-refresh-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'official_mdeorg_root_has_unstable_analytics_and_radware_protected_directory_routes_plus_mn_dhs_local_office_family_is_radware_challenged');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_live_mdeorg_root_with_unstable_mdeanalytics_and_radware_protected_directory_routes');
assert.match(gap.status_reason, /Data\.jsp/i);
assert.match(gap.status_reason, /second exact probe/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'official_mdeorg_root_is_live_but_mdeanalytics_data_route_is_unstable_and_directory_routes_are_radware_protected');
assert.match(failure.evidence, /Data Reports and Analytics/i);
assert.match(failure.evidence, /validate\.perfdrive\.com/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_live_mdeorg_root_with_unstable_mdeanalytics_and_radware_protected_directory_routes');
assert.equal(verified.sample_count, 5);
assert.ok(verified.samples.some((sample) => /MDEAnalytics Data route instability/i.test(sample.sample_name)));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'hold_blocked_until_reviewed_first_party_mdeorg_route_capture_or_stable_export_contract_exists');

assert.equal(packet.current_problem_metrics.mdeAnalyticsDataRouteFlaps, true);
assert.deepEqual(packet.analytics_contract.observed_states, ['live_data_reports_and_analytics_shell', 'radware_captcha']);
assert.equal(packet.analytics_contract.stable_county_or_district_export, false);

assert.equal(batchSummary.analytics_route_flaps, true);
assert.ok(report.includes('Data Reports and Analytics'));
assert.ok(batchReport.includes('flipped to `Radware Captcha Page`'));
assert.ok(lessons.includes('### Flapping Official Child Routes Still Count As Blocked'));

console.log('test-batch231-minnesota-mdeanalytics-instability-refresh-v1: ok');
