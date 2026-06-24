import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch297UtahBundleContractRefinementV1 } from './run-batch297-utah-bundle-contract-refinement-v1.mjs';

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

const result = generateBatch297UtahBundleContractRefinementV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch297_utah_bundle_contract_refinement_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch297-utah-bundle-contract-refinement-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_usbe_district_lea_directory_clears_education_but_live_dws_bundle_only_supports_city_or_zip_search_and_public_office_api_still_lacks_county_service_area_contract');

const localGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(localGap.family_status, 'blocked_live_dws_bundle_city_zip_only_without_county_service_area_contract');
assert.match(localGap.status_reason, /`city` or `zipCode`/);
assert.match(localGap.status_reason, /nearest-office geocoding/);
assert.match(localGap.status_reason, /api\/v1\/office-services/);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].failure_code, 'live_dws_bundle_only_supports_city_or_zip_search_and_public_office_api_still_lacks_county_service_area_contract');
assert.match(failureRows[0].evidence, /main-NUCK4XJI\.js/);
assert.match(failureRows[0].evidence, /city` and then `zipCode`|city\/ZIP oriented/);
assert.match(failureRows[0].evidence, /26 of Utah's 29 counties/);

const localVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(localVerified.sample_count, 12);
assert.match(localVerified.query_basis, /first-party JS bundle contract/i);
assert.match(localVerified.blocker_evidence, /city\/ZIP oriented/);
assert.ok(localVerified.samples.some((sample) => sample.sample_name === 'Bundle config pins the public API host'));
assert.ok(localVerified.samples.some((sample) => sample.sample_name === 'Bundle search logic is city-or-ZIP only'));
assert.ok(localVerified.samples.some((sample) => sample.sample_name === 'Bundle still points to broken office-services route'));

assert.equal(nextRows.length, 1);
assert.match(nextRows[0].evidence, /city\/ZIP lookup/);
assert.match(nextRows[0].next_action, /hold_blocked_until_public_utah_dws_successor_exposes_county_or_service_area_assignments/);

const utahQueue = queueRows.find((row) => row.state === 'utah');
assert.equal(utahQueue.primary_gap_reason, 'official_usbe_district_lea_directory_clears_education_but_live_dws_bundle_only_supports_city_or_zip_search_and_public_office_api_still_lacks_county_service_area_contract');

const utahAudit = allStateAudit.states.find((row) => row.stateId === 'utah');
assert.equal(utahAudit.packetBatch, 'batch297_utah_bundle_contract_refinement_v1');
assert.equal(utahAudit.packetPrimaryGapReason, 'official_usbe_district_lea_directory_clears_education_but_live_dws_bundle_only_supports_city_or_zip_search_and_public_office_api_still_lacks_county_service_area_contract');
assert.equal(utahAudit.familyStatuses.county_local_disability_resources, 'blocked_live_dws_bundle_city_zip_only_without_county_service_area_contract');
assert.match(allStateAudit.lessonsUpdate, /city-or-ZIP office-search bundles/);

assert.ok(report.includes('The live office-search bundle explicitly sets `apiUrl` to `https://officesearch-api.jobs.utah.gov`'));
assert.ok(report.includes('only filters by `city` and then `zipCode`'));
assert.ok(handoff.includes('## Current Focus State: Utah'));
assert.ok(handoff.includes('Live DWS bundle entrypoint'));
assert.ok(handoff.includes('city` and then `zipCode`') || handoff.includes('city` and then `zipCode`, then falls back') || handoff.includes('city` and `zipCode`'));
assert.ok(allStateReport.includes('Utah county-local routing is now explicitly sharpened to the live DWS bundle contract itself'));
assert.ok(lessons.includes('### City-Or-ZIP Office Search Contracts Still Fail County-Grade Routing'));
assert.equal(batchSummary.bundle_api_url, 'https://officesearch-api.jobs.utah.gov');
assert.deepEqual(batchSummary.bundle_exact_routes, ['/api/v1/offices', '/api/v1/services', '/api/v1/office-services']);
assert.deepEqual(batchSummary.bundle_search_contract, ['city', 'zipCode', 'nearest-office geocoding fallback']);
assert.ok(batchReport.includes('city/ZIP-oriented, not county-oriented'));

console.log('test-batch297-utah-bundle-contract-refinement-v1: ok');
