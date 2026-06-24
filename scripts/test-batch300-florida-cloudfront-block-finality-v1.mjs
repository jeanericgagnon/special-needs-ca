import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch300FloridaCloudfrontBlockFinalityV1 } from './run-batch300-florida-cloudfront-block-finality-v1.mjs';

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

const result = generateBatch300FloridaCloudfrontBlockFinalityV1();
const summary = readJson('data/generated/florida_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/florida_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/florida_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/florida_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/florida_next_action_queue_v2.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const allStateQueue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/florida-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch300_florida_cloudfront_block_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch300-florida-cloudfront-block-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_lane_is_cloudfront_blocked');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(gap.family_status, 'blocked_partial_storefront_lane_and_current_myaccess_public_lane_cloudfront_blocked');
assert.match(gap.status_reason, /CloudFront `403 Request blocked`/);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'official_family_resource_center_still_partial_and_current_myaccess_public_shell_assets_now_return_cloudfront_403');
assert.match(failure.evidence, /asset-manifest\.json/);
assert.match(failure.evidence, /CloudFront `Request blocked`/);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(verified.query_basis, /public-lane regression check/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS Public CPCPS CloudFront block'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS appconfig CloudFront block'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS partner-location bundle CloudFront block'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Florida MyACCESS asset manifest CloudFront block'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_current_myaccess_public_lane_recovers_anonymous_results');
assert.match(next.evidence, /CloudFront 403/i);

const floridaAudit = allStateAudit.states.find((row) => row.stateId === 'florida');
assert.equal(floridaAudit.packetBatch, 'batch300_florida_cloudfront_block_finality_v1');
assert.equal(floridaAudit.packetPrimaryGapReason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_lane_is_cloudfront_blocked');
assert.equal(floridaAudit.familyStatuses.county_local_disability_resources, 'blocked_partial_storefront_lane_and_current_myaccess_public_lane_cloudfront_blocked');

const floridaQueue = allStateQueue.find((row) => row.state === 'florida');
assert.equal(floridaQueue.primary_gap_reason, 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_lane_is_cloudfront_blocked');

assert.ok(stateReport.includes('CloudFront 403 `Request blocked` responses'));
assert.ok(allStateReport.includes('Florida county-local routing is now explicitly sharpened to a partial Family Resource Center storefront plus a currently CloudFront-blocked MyACCESS public lane'));
assert.ok(handoff.includes('CloudFront `403 Request blocked`'));
assert.ok(handoff.includes('https://myaccess.myflfamilies.com/asset-manifest.json'));
assert.ok(lessons.includes('### A Public Shell Lane Can Regress Into An Edge-Blocked Lane And Must Be Reclassified'));
assert.equal(batchSummary.public_cpcps_status, 403);
assert.equal(batchSummary.public_appconfig_status, 403);
assert.equal(batchSummary.public_partner_bundle_status, 403);
assert.equal(batchSummary.public_asset_manifest_status, 403);
assert.ok(batchReport.includes('The current official MyACCESS public lane is edge-blocked'));

console.log('test-batch300-florida-cloudfront-block-finality-v1: ok');
