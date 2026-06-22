import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch89WashingtonStatewideFamilyTruthRefreshV1 } from './run-batch89-washington-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch89WashingtonStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.strong_critical_families, 8);
assert.equal(summary.weak_critical_families, 3);
assert.equal(summary.missing_critical_families, 1);
assert.deepEqual(batchSummary.resolved_families, ['parent_training_information_center']);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'washington_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].evidence_snippet, /PTI program helps family caregivers/i);

const panda = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(panda.family_status, 'missing');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'washington-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /terminal BLOCKED, not COMPLETE/);
assert.match(report, /Parent Training and Information Program \(PTI\)/i);
assert.match(report, /reviewed first-party P&A plus legal-aid artifacts are still missing on disk/i);

console.log(JSON.stringify({
  ok: true,
  state: 'washington',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
