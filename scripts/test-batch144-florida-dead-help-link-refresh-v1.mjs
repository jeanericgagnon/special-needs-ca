import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch144FloridaDeadHelpLinkRefreshV1 } from './run-batch144-florida-dead-help-link-refresh-v1.mjs';

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

const result = generateBatch144FloridaDeadHelpLinkRefreshV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch144_florida_dead_help_link_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'myaccess_embedded_local_office_help_link_is_dead_and_public_bundle_still_lacks_statewide_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_shell_proxy_and_dead_help_link_without_county_rows');
assert.match(countyGap.status_reason, /ess-storefronts-and-lobbies/i);
assert.match(countyGap.status_reason, /dead 404 shell/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'myaccess_embedded_local_office_help_link_is_dead_and_public_bundle_still_lacks_statewide_contract');
assert.match(countyFailure.evidence, /embedded in the public MyACCESS bundle/i);
assert.match(countyFailure.evidence, /ess-storefronts-and-lobbies/i);
assert.match(countyFailure.evidence, /DCF 404 Page Not Found shell/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.blocker_code, 'myaccess_embedded_local_office_help_link_is_dead_and_public_bundle_still_lacks_statewide_contract');
assert.equal(countyVerified.sample_count, 37);
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/ess-storefronts-and-lobbies'));
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_dead_help_link'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'myaccess_embedded_local_office_help_link_is_dead_and_public_bundle_still_lacks_statewide_contract');
assert.match(countyNext.next_action, /first_party_county_dataset_or_documented_anonymous_search_contract/i);

assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.dead_help_link_confirmed, true);
assert.ok(report.includes('embedded local-office help link now resolves to a DCF 404 page'));
assert.ok(lessons.includes('Embedded Help Links Inside A Public Portal Must Be Fetched Before They Count As Fallbacks'));

console.log('test-batch144-florida-dead-help-link-refresh-v1: ok');
