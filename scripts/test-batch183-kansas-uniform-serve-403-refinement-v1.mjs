import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch183KansasUniformServe403RefinementV1 } from './run-batch183-kansas-uniform-serve-403-refinement-v1.mjs';

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

const result = generateBatch183KansasUniformServe403RefinementV1();
const batchSummary = readJson('data/generated/batch183_kansas_uniform_serve_403_refinement_summary_v1.json');
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.kdads_root_status, 403);
assert.equal(batchSummary.kancare_leaf_status, 403);
assert.equal(summary.primary_gap_reason, 'kansas_dd_stack_is_uniformly_transport_blocked_and_live_ksde_directory_roots_still_lack_local_contract');

const ddGap = gapRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.match(ddGap.status_reason, /uniform host-stack denial pattern/i);
assert.match(ddGap.status_reason, /same tiny official `Access Denied` shell/i);

const ddFailure = failureRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddFailure.failure_code, 'uniform_tiny_serve_403_shell_on_kdads_and_kancare_dd_stack');
assert.match(ddFailure.evidence, /\$\(SERVE_403\)/);
assert.match(ddFailure.evidence, /roughly 412-476 bytes/i);

const ddVerified = verifiedRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddVerified.family_status, 'blocked_uniform_tiny_serve_403_shell_on_dd_stack');
assert.equal(ddVerified.sample_count, 3);
assert.ok(ddVerified.samples.find((row) => row.source_url === 'https://www.kdads.ks.gov/robots.txt') === undefined);
assert.ok(ddVerified.samples.find((row) => row.source_url === 'https://www.kdads.ks.gov/services/developmental-disabilities'));

const ddNext = nextRows.find((row) => row.family === 'developmental_disability_idd_authority');
assert.equal(ddNext.next_action, 'keep_kansas_dd_blocked_until_browser_review_or_alternate_official_dd_leaf_exists_outside_uniform_serve_403_hosts');

assert.ok(report.includes('uniformly transport-blocked rather than merely under-discovered'));
assert.ok(lessons.includes('### Tiny Access-Denied Shells Across Root, Leaf, And Robots Mean Host-Stack Blocking'));

console.log('test-batch183-kansas-uniform-serve-403-refinement-v1: ok');
