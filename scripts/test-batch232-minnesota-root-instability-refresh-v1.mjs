import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch232MinnesotaRootInstabilityRefreshV1 } from './run-batch232-minnesota-root-instability-refresh-v1.mjs';

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

const result = generateBatch232MinnesotaRootInstabilityRefreshV1();
const summary = readJson('data/generated/minnesota_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/minnesota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/minnesota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/minnesota_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/minnesota_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch232_minnesota_root_instability_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/minnesota-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'mdeorg_root_and_analytics_routes_flap_to_radware_plus_mn_dhs_local_office_family_is_radware_challenged');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_mdeorg_root_and_analytics_routes_flap_to_radware_without_stable_county_contract');
assert.match(gap.status_reason, /stable public entrypoint/i);
assert.match(gap.status_reason, /Radware Captcha Page/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'official_mdeorg_root_itself_now_flaps_to_radware_and_no_stable_export_contract_exists');
assert.match(failure.evidence, /fresh exact fetch of https:\/\/pub\.education\.mn\.gov\/MdeOrgView\//i);
assert.match(failure.evidence, /validate\.perfdrive\.com/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_mdeorg_root_and_analytics_routes_flap_to_radware_without_stable_county_contract');
assert.ok(verified.samples.some((sample) => /root instability/i.test(sample.sample_name)));
assert.ok(verified.samples.some((sample) => /Radware Captcha Page/i.test(sample.evidence_snippet)));

const queueRow = queueRows.find((row) => row.state === 'minnesota');
assert.equal(queueRow.primary_gap_reason, 'mdeorg_root_and_analytics_routes_flap_to_radware_plus_mn_dhs_local_office_family_is_radware_challenged');

assert.equal(batchSummary.exact_root_fetch_title, 'Radware Captcha Page');
assert.equal(batchSummary.analytics_final_host, 'validate.perfdrive.com');
assert.match(report, /root itself flapping into Radware/i);
assert.ok(lessons.includes('If a first-party directory root once looked public but later exact probes flip the root itself into Radware'));

console.log('test-batch232-minnesota-root-instability-refresh-v1: ok');
