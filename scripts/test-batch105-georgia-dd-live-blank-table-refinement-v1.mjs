import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch105GeorgiaDdLiveBlankTableRefinementV1 } from './run-batch105-georgia-dd-live-blank-table-refinement-v1.mjs';

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

const result = generateBatch105GeorgiaDdLiveBlankTableRefinementV1();
const summary = readJson('data/generated/georgia_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/georgia_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/georgia_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/georgia_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/georgia_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch105_georgia_dd_live_blank_table_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/georgia-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.match(ddGap.status_reason, /blank county cells/i);
assert.match(ddGap.status_reason, /404/i);

const ddFailure = failures.find((row) => row.family === 'developmental_disability_idd_authority');
assert.match(ddFailure.evidence, /returns HTTP 200 but renders blank county cells/i);
assert.match(ddFailure.evidence, /regional-offices.*404/i);

const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.match(ddVerified.blocker_evidence, /blank county cells/i);
assert.match(ddVerified.query_basis, /2026-06-22 recheck/i);

const ddNext = nextRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.match(ddNext.evidence, /blank county cells/i);

assert.equal(batchSummary.evidence_checks.countyLookupStatus, 200);
assert.equal(batchSummary.evidence_checks.countyNamesPresent, false);
assert.equal(batchSummary.evidence_checks.alternateRegionalOfficesStatus, 404);

assert.ok(report.includes('blank county cells'));
assert.ok(report.includes('404'));
assert.ok(lessons.includes('Live Official County Tables Can Still Fail Closed When The Key Cells Are Blank'));

console.log('test-batch105-georgia-dd-live-blank-table-refinement-v1: ok');
