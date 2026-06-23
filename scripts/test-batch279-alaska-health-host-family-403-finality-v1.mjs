import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch279AlaskaHealthHostFamily403FinalityV1 } from './run-batch279-alaska-health-host-family-403-finality-v1.mjs';

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

const result = generateBatch279AlaskaHealthHostFamily403FinalityV1();
const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch279_alaska_health_host_family_403_finality_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch279-alaska-health-host-family-403-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(gap.status_reason, /robots\.txt/i);
assert.match(gap.status_reason, /wp-json/i);
assert.match(gap.status_reason, /entire current health-host discovery surface/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(failure.failure_code, 'live_dfcs_services_page_is_phone_only_and_entire_health_host_family_stays_403_challenged');
assert.match(failure.evidence, /health\.alaska\.gov\/robots\.txt/i);
assert.match(failure.evidence, /health\.alaska\.gov\/wp-json\//i);
assert.match(failure.evidence, /health\.alaska\.gov\/en\/resources\//i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(verified.query_basis, /health-host family discovery surfaces/i);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska health robots 403 shell'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska health wp-json 403 shell'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Alaska health resources root 403 shell'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(next.evidence, /entire health-host family/i);

assert.equal(batchSummary.health_host_family_403, true);
assert.ok(batchSummary.challenged_urls.includes('https://health.alaska.gov/robots.txt'));
assert.ok(batchSummary.challenged_urls.includes('https://health.alaska.gov/wp-sitemap.xml'));

assert.ok(report.includes('robots, sitemap, wp-json, wp-sitemap'));
assert.ok(handoff.includes('## Current Focus State: Alaska'));
assert.ok(handoff.includes('https://health.alaska.gov/wp-json/'));
assert.ok(batchReport.includes('Batch 279 Alaska Health Host Family 403 Finality Report v1'));

console.log('test-batch279-alaska-health-host-family-403-finality-v1: ok');
