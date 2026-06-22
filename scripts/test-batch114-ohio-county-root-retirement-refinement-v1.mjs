import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch114OhioCountyRootRetirementRefinementV1 } from './run-batch114-ohio-county-root-retirement-refinement-v1.mjs';

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

const result = generateBatch114OhioCountyRootRetirementRefinementV1();
const summary = readJson('data/generated/ohio_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/ohio_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/ohio_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/ohio_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/ohio_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch114_ohio_county_root_retirement_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/ohio-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_jfs_root_domain_retired_and_replacement_domains_unresolved');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_retired_official_county_domain_family');
assert.match(countyGap.status_reason, /root, sitemap, robots/i);
assert.match(countyGap.status_reason, /do not resolve/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_jfs_root_domain_retired_and_replacement_domains_unresolved');
assert.match(countyFailure.evidence, /jfs\.ohio\.gov/i);
assert.match(countyFailure.evidence, /HTTP 404/i);
assert.match(countyFailure.evidence, /odjfs/i);
assert.match(countyFailure.evidence, /jobandfamilyservices/i);
assert.match(countyFailure.evidence, /failed DNS resolution/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_retired_official_county_domain_family');
assert.equal(countyVerified.blocker_code, 'official_jfs_root_domain_retired_and_replacement_domains_unresolved');
assert.match(countyVerified.query_basis, /root\/sitemap\/robots/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_new_live_official_ohio_county_directory_or_locator_is_verified');

assert.equal(batchSummary.evidence_checks.jfsRoot, '404');
assert.equal(batchSummary.evidence_checks.odjfs, 'dns_failure');
assert.equal(batchSummary.evidence_checks.jobandfamilyservices, 'dns_failure');
assert.equal(batchSummary.evidence_checks.doiFallbackOnly, true);

assert.ok(report.includes('now looks retired at the domain level'));
assert.ok(lessons.includes('Domain-Wide 404 Plus NXDOMAIN Replacement Is Stronger Than A Dead Leaf'));

console.log('test-batch114-ohio-county-root-retirement-refinement-v1: ok');
