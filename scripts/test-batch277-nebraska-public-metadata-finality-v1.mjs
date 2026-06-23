import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch277NebraskaPublicMetadataFinalityV1 } from './run-batch277-nebraska-public-metadata-finality-v1.mjs';

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

const result = generateBatch277NebraskaPublicMetadataFinalityV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch277_nebraska_public_metadata_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch277-nebraska-public-metadata-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(gap.status_reason, /dhhs\.ne\.gov\/sitemap\.xml/i);
assert.match(gap.status_reason, /lookup tool with filtering for computer, scanner, and telephone usages/i);
assert.match(gap.status_reason, /FeatureServer and MapServer roots/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(failure.evidence, /PageNotFoundError\.aspx/i);
assert.match(failure.evidence, /Nebraska Public Office Location/i);
assert.match(failure.evidence, /MapServer/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(verified.query_basis, /DHHS sitemap route/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska DHHS sitemap non-match'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska web experience item metadata'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska MapServer root parity'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(next.evidence, /dhhs\.ne\.gov\/sitemap\.xml/i);
assert.match(next.evidence, /no sitemap-backed successor office directory/i);

assert.equal(batchSummary.dhhs_sitemap_alive, false);
assert.equal(batchSummary.web_experience_describes_lookup_only, true);
assert.equal(batchSummary.mapserver_tables_present, false);

assert.ok(report.includes('DHHS sitemap'));
assert.ok(report.includes('lookup tool with filtering for computer, scanner, and telephone usages'));
assert.ok(handoff.includes('## Current Focus State: Nebraska'));
assert.ok(handoff.includes('https://dhhs.ne.gov/sitemap.xml'));
assert.ok(batchReport.includes('Batch 277 Nebraska Public Metadata Finality Report v1'));

console.log('test-batch277-nebraska-public-metadata-finality-v1: ok');
