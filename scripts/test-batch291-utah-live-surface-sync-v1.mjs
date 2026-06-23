import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch291UtahLiveSurfaceSyncV1 } from './run-batch291-utah-live-surface-sync-v1.mjs';

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

const result = generateBatch291UtahLiveSurfaceSyncV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch291_utah_live_surface_sync_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch291-utah-live-surface-sync-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_usbe_district_lea_directory_clears_education_but_public_dws_office_api_only_materializes_26_of_29_physical_office_counties_and_still_lacks_county_service_area_contract');

const localGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(localGap.family_status, 'blocked_public_office_api_without_county_service_area_contract');
assert.match(localGap.status_reason, /office-services/);
assert.match(localGap.status_reason, /404/);
assert.match(localGap.status_reason, /500/);

assert.equal(failureRows.length, 1);
assert.match(failureRows[0].evidence, /office-services/);
assert.match(failureRows[0].evidence, /404 Not Found/);
assert.match(failureRows[0].evidence, /500 Internal Server Error/);
assert.match(failureRows[0].evidence, /Daggett/);
assert.match(failureRows[0].evidence, /Morgan/);

const localVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(localVerified.sample_count, 10);
assert.match(localVerified.query_basis, /docs\/service routes/i);
assert.match(localVerified.blocker_evidence, /older public roots now return `500`\/`404`/);
assert.ok(localVerified.samples.some((sample) => sample.sample_name === 'Guessed office-services route now 404s'));
assert.ok(localVerified.samples.some((sample) => sample.sample_name === 'API docs probes now 404'));
assert.ok(localVerified.samples.some((sample) => sample.sample_name === 'Older DWS roots now 500'));

assert.equal(nextRows.length, 1);
assert.match(nextRows[0].evidence, /office-services/);
assert.match(nextRows[0].evidence, /older DWS roots now 500\/404/);

assert.equal(batchSummary.remaining_blocker_family, 'county_local_disability_resources');
assert.equal(batchSummary.office_payload_rows, 99);
assert.equal(batchSummary.unique_offices, 45);
assert.equal(batchSummary.physical_office_county_coverage, 26);
assert.deepEqual(batchSummary.missing_physical_office_counties, ['Daggett County', 'Morgan County', 'Rich County']);
assert.deepEqual(batchSummary.docs_probe_statuses, {
  office_services: 404,
  openapi_json: 404,
  swagger_ui_index: 404,
  v3_api_docs: 404,
});
assert.deepEqual(batchSummary.legacy_root_statuses, {
  jobs_sitemap_xml: 500,
  jobs_serviceslocations_html: 500,
  dhhs_locations: 404,
});

assert.ok(report.includes('The guessed `office-services` route and all probed docs surfaces now fail explicitly with `404`'));
assert.ok(report.includes('`jobs.utah.gov/sitemap.xml` and `jobs.utah.gov/customereducation/serviceslocations.html` now return `500`'));
assert.ok(handoff.includes('## Current Focus State: Utah'));
assert.ok(handoff.includes('`office-services` route now returns JSON `404 Not Found`'));
assert.ok(handoff.includes('`jobs.utah.gov/sitemap.xml` and `jobs.utah.gov/customereducation/serviceslocations.html` return `500`'));
assert.ok(handoff.includes('## Next State Order After Utah'));
assert.ok(allStateReport.includes('Utah county-local routing is now explicitly sharpened to the live DWS office API plus its exact failure surfaces'));
assert.ok(batchReport.includes('docs surfaces (`openapi.json`, `swagger-ui/index.html`, and `v3/api-docs`) now return `404 Service Not Found`'));

console.log('test-batch291-utah-live-surface-sync-v1: ok');
