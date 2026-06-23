import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch260AlaskaServicesPhoneRelayRefreshV1 } from './run-batch260-alaska-services-phone-relay-refresh-v1.mjs';

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

const result = generateBatch260AlaskaServicesPhoneRelayRefreshV1();
const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch260_alaska_services_phone_relay_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_live_dfcs_services_page_is_phone_only_and_health_host_directory_remains_challenged');
assert.match(gap.status_reason, /statewide phone routing/i);
assert.match(gap.status_reason, /888-804-6330/i);
assert.match(gap.status_reason, /does not provide borough or census-area office mapping/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged');
assert.match(failure.evidence, /Adult Public Assistance/i);
assert.match(failure.evidence, /Apply for Medicaid/i);
assert.match(failure.evidence, /888-804-6330/i);
assert.match(failure.evidence, /Cloudflare `Just a moment/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(verified.family_status, 'blocked_live_dfcs_services_page_is_phone_only_and_health_host_directory_remains_challenged');
assert.equal(verified.sample_count, 7);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://dfcs.alaska.gov/Pages/Services.aspx'));
assert.ok(verified.samples.some((sample) => /888-804-6330/i.test(sample.evidence_snippet)));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://health.alaska.gov/en/services/adult-public-assistance-apa/'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_replaces_the_phone_only_dfcs_relay_with_a_reviewable_office_locator');

assert.equal(batchSummary.dfcs_services_page_live, true);
assert.equal(batchSummary.statewide_phone_relay_verified, true);
assert.equal(batchSummary.local_mapping_still_missing, true);
assert.ok(report.includes('statewide phone routing for Adult Public Assistance and Apply for Medicaid'));
assert.ok(lessons.includes('### A Live Successor Hub With Statewide Program Phones Still Fails County-Equivalent Routing'));

console.log('test-batch260-alaska-services-phone-relay-refresh-v1: ok');
