import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch85TennesseeStatewideFamilyTruthRefreshV1 } from './run-batch85-tennessee-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch85TennesseeStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.strong_critical_families, 8);
assert.equal(summary.weak_critical_families, 4);
assert.equal(summary.missing_critical_families, 1);
assert.deepEqual(batchSummary.resolved_families, ['protection_and_advocacy', 'parent_training_information_center']);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'tennessee_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const panda = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(panda.family_status, 'verified_state_grade');

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].evidence_snippet, /only Parent Training and Information Center/i);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'tennessee-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /terminal BLOCKED, not COMPLETE/);
assert.match(report, /only Parent Training and Information Center/i);

console.log(JSON.stringify({
  ok: true,
  state: 'tennessee',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
