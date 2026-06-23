import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch273UtahApiSurfaceFinalityV1 } from './run-batch273-utah-api-surface-finality-v1.mjs';

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

const result = generateBatch273UtahApiSurfaceFinalityV1();
const summary = readJson('data/generated/utah_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/utah_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/utah_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/utah_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/utah_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch273_utah_api_surface_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/utah-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch273-utah-api-surface-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_usbe_district_lea_directory_clears_education_and_public_dws_office_api_still_lacks_county_service_area_contract');
assert.equal(summary.critical_gap_families.length, 1);
assert.equal(summary.critical_gap_families[0], 'county_local_disability_resources');

const localGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(localGap.status_reason, /OpenAPI\/Swagger/i);
assert.match(localGap.status_reason, /sitemap-exposed successor endpoint/i);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'county_local_disability_resources');
assert.match(failureRows[0].evidence, /openapi\.json/i);
assert.match(failureRows[0].evidence, /swagger-ui\/index\.html/i);
assert.match(failureRows[0].evidence, /v3\/api-docs/i);
assert.match(failureRows[0].evidence, /jobs\.utah\.gov\/sitemap\.xml/i);

const localVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(localVerified.query_basis, /OpenAPI\/Swagger\/sitemap successors/i);
assert.match(localVerified.blocker_evidence, /no public OpenAPI\/Swagger docs/i);

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'county_local_disability_resources');
assert.match(nextRows[0].evidence, /no public OpenAPI\/Swagger or sitemap successor/i);

assert.equal(batchSummary.remaining_blocker_family, 'county_local_disability_resources');
assert.ok(batchSummary.confirmed_missing_or_error_urls.includes('https://officesearch-api.jobs.utah.gov/openapi.json'));
assert.ok(batchSummary.confirmed_missing_or_error_urls.includes('https://jobs.utah.gov/sitemap.xml'));

assert.ok(report.includes('openapi.json'));
assert.ok(report.includes('swagger-ui/index.html'));
assert.ok(report.includes('jobs.utah.gov/sitemap.xml'));
assert.ok(batchReport.includes('Batch 273 Utah API Surface Finality Report v1'));
assert.ok(handoff.includes('## Current Focus State: Utah'));
assert.ok(handoff.includes('https://officesearch-api.jobs.utah.gov/openapi.json'));
assert.ok(handoff.includes('## Next State Order After Utah'));

console.log('test-batch273-utah-api-surface-finality-v1: ok');
