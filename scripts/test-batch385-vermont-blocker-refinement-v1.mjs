import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch385VermontBlockerRefinementV1 } from './run-batch385-vermont-blocker-refinement-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch385VermontBlockerRefinementV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'vermont_california_grade_summary_v2.json'), 'utf8')
);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 91);
assert.equal(summary.primary_gap_reason, 'official_ahs_district_jurisdiction_codes_are_public_but_no_cataloged_or_public_office_crosswalk_exists');
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].family, 'county_local_disability_resources');
assert.match(summary.final_blockers[0].evidence, /catalog search/i);
assert.match(summary.final_blockers[0].evidence, /HTTP 403 CloudFront/i);

const gapRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'vermont_gap_matrix_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /catalog search/i);
assert.match(countyGap.status_reason, /2026-06-15/i);

const failureRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'vermont_failure_ledger_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].failure_code, 'official_ahs_district_jurisdiction_codes_exist_but_no_cataloged_or_public_office_crosswalk_exists');
assert.match(failureRows[0].evidence, /HTTP 403 CloudFront/i);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'vermont_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.sample_count, 6);
assert.match(county.query_basis, /catalog searches/i);
assert.match(county.samples[0].evidence_snippet, /2026-06-15/i);
assert.match(county.samples[2].evidence_snippet, /only three child-care datasets/i);
assert.match(county.samples[4].evidence_snippet, /HTTP 403 CloudFront/i);
assert.match(county.samples[5].evidence_snippet, /HTTP 403 CloudFront/i);

const nextRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'vermont_next_action_queue_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
assert.equal(nextRows.length, 1);
assert.match(nextRows[0].evidence, /catalog still shows no public office crosswalk/i);

const batchSummary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'batch385_vermont_blocker_refinement_summary_v1.json'), 'utf8')
);
assert.equal(batchSummary.classification_before, 'BLOCKED');
assert.equal(batchSummary.classification_after, 'BLOCKED');
assert.deepEqual(batchSummary.refined_blockers, ['county_local_disability_resources']);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'vermont-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Vermont remains BLOCKED and not index-safe\./);
assert.match(report, /official data catalog still exposes no public crosswalk/i);
assert.match(report, /HTTP 403 CloudFront responses again on 2026-06-25/i);

console.log('Vermont blocker refinement test passed.');
