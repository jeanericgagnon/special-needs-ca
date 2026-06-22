import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch109AlaskaLocalDirectoryProofRefreshV1 } from './run-batch109-alaska-local-directory-proof-refresh-v1.mjs';

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

const result = generateBatch109AlaskaLocalDirectoryProofRefreshV1();
const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch109_alaska_local_directory_proof_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.primary_gap_reason, 'official_local_directory_domainwide_cloudflare_challenge_and_legacy_locator_404');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /robots\.txt/i);
assert.match(countyGap.status_reason, /sitemap\.xml/i);
assert.match(countyGap.status_reason, /HTTP 404/i);
assert.match(countyGap.status_reason, /browser-assisted/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_local_directory_domainwide_cloudflare_challenge_and_legacy_locator_404');
assert.match(countyFailure.evidence, /cf-mitigated: challenge/i);
assert.match(countyFailure.evidence, /legacy official locator https:\/\/dhss\.alaska\.gov\/locations returned HTTP 404/i);
assert.match(countyFailure.evidence, /browser-assisted check/i);
assert.match(countyFailure.next_action, /current_official_host_stops_returning_verification_shells/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.blocker_code, 'official_local_directory_domainwide_cloudflare_challenge_and_legacy_locator_404');
assert.equal(countyVerified.sample_count, 5);
assert.equal(countyVerified.samples.length, 5);
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://health.alaska.gov/sitemap.xml'));
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://dhss.alaska.gov/locations'));
assert.ok(countyVerified.samples.some((sample) => sample.source_type === 'official_browser_assisted_challenge'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'official_local_directory_domainwide_cloudflare_challenge_and_legacy_locator_404');
assert.match(countyNext.evidence, /Performing security verification/i);
assert.match(countyNext.evidence, /No alternate official county-grade office leaf or document was recovered/i);

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.refined_families, ['county_local_disability_resources']);
assert.equal(batchSummary.host_level_block_confirmed, true);
assert.ok(report.includes('host-level on the current official Alaska DPA/SDS web stack'));
assert.ok(report.includes('current official host stops returning the Cloudflare verification shell'));
assert.ok(lessons.includes('Browser-Assisted Rechecks Should End A Challenge Lane'));

console.log('test-batch109-alaska-local-directory-proof-refresh-v1: ok');
