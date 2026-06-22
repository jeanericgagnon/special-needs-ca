import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch96CaliforniaBlockerRefinementV1 } from './run-batch96-california-blocker-refinement-v1.mjs';

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

const result = generateBatch96CaliforniaBlockerRefinementV1();
const summary = readJson('data/generated/california_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/california_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/california_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/california_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/california_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch96_california_blocker_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/california-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(result.index_safe, false);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 75);

const ptiGap = gapRows.find((row) => row.family === 'parent_training_information_center');
assert.match(ptiGap.status_reason, /Matrix Parents/);
assert.match(ptiGap.status_reason, /returns 404/);
assert.match(ptiGap.status_reason, /TLS protocol negotiation/);
assert.match(ptiGap.status_reason, /returns 403/);

const ptiFailure = failureRows.find((row) => row.family === 'parent_training_information_center');
assert.match(ptiFailure.evidence, /dds\.ca\.gov\/rc\/frcn/);
assert.match(ptiFailure.evidence, /supportforfamilies\.org returns 403/);

const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.match(ptiVerified.query_basis, /bounded statewide-equivalent parent-center candidate set/);
assert.match(ptiVerified.blocker_evidence, /frcnca\.org fails TLS/);

const ptiNext = nextRows.find((row) => row.family === 'parent_training_information_center');
assert.match(ptiNext.evidence, /No live fetched statewide California PTI or equivalent parent-center source/);

assert.equal(batchSummary.refined_family, 'parent_training_information_center');
assert.ok(report.includes('frcnca.org fails TLS'));
assert.ok(report.includes('Support for Families returns 403'));

console.log('test-batch96-california-blocker-refinement-v1: ok');
