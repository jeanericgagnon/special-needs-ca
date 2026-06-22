import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch84SouthDakotaStatewideFamilyTruthRefreshV1 } from './run-batch84-south-dakota-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch84SouthDakotaStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.strong_critical_families, 8);
assert.equal(summary.weak_critical_families, 3);
assert.equal(summary.missing_critical_families, 1);
assert.deepEqual(batchSummary.resolved_families, ['protection_and_advocacy']);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-dakota_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const panda = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(panda.family_status, 'verified_state_grade');

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'inventory_only');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'south-dakota-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /terminal BLOCKED, not COMPLETE/);
assert.match(report, /Disability Rights South Dakota is preserved as statewide protection-and-advocacy support/i);

console.log(JSON.stringify({
  ok: true,
  state: 'south-dakota',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
