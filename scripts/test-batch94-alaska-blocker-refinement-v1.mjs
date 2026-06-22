import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch94AlaskaBlockerRefinementV1 } from './run-batch94-alaska-blocker-refinement-v1.mjs';

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

const result = generateBatch94AlaskaBlockerRefinementV1();
const summary = readJson('data/generated/alaska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/alaska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/alaska_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/alaska_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/alaska_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch94_alaska_blocker_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/alaska-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.match(byFamily.get('parent_training_information_center').status_reason, /sitemap/i);
assert.match(byFamily.get('parent_training_information_center').status_reason, /404/i);
assert.match(byFamily.get('county_local_disability_resources').status_reason, /robots\.txt/i);
assert.match(byFamily.get('county_local_disability_resources').status_reason, /sitemap/i);

assert.match(failureRows.find((row) => row.family === 'parent_training_information_center').evidence, /no role-pure PTI leaf/i);
assert.match(failureRows.find((row) => row.family === 'county_local_disability_resources').evidence, /robots\.txt and sitemap endpoints/i);

assert.match(verifiedRows.find((row) => row.family === 'parent_training_information_center').blocker_evidence, /guessed PTI-style roots .* return 404/i);
assert.match(verifiedRows.find((row) => row.family === 'county_local_disability_resources').blocker_evidence, /Cloudflare security-verification or 403 shells/i);

assert.match(nextRows.find((row) => row.family === 'parent_training_information_center').evidence, /Stone Soup Group sitemap/i);
assert.match(nextRows.find((row) => row.family === 'county_local_disability_resources').evidence, /health\.alaska\.gov robots\.txt and sitemap endpoints/i);

assert.equal(batchSummary.classification, 'BLOCKED');
assert.deepEqual(batchSummary.refined_families, ['parent_training_information_center', 'county_local_disability_resources']);
assert.ok(report.includes('Stone Soup sitemap'));
assert.ok(report.includes('robots.txt and sitemap endpoints'));

console.log('test-batch94-alaska-blocker-refinement-v1: ok');
