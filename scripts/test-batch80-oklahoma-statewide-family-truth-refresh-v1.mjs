import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch80OklahomaStatewideFamilyTruthRefreshV1 } from './run-batch80-oklahoma-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch80OklahomaStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.strong_critical_families, 8);
assert.equal(summary.weak_critical_families, 2);
assert.equal(summary.missing_critical_families, 2);
assert.deepEqual(batchSummary.resolved_families, ['parent_training_information_center']);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'oklahoma_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].evidence_snippet, /Statewide Parent Training and Information/i);
assert.match(pti.samples[0].evidence_snippet, /Oklahoma special education support/i);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'oklahoma-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /terminal BLOCKED, not COMPLETE/);
assert.match(report, /reviewed first-party statewide PTI evidence on disk/i);

console.log(JSON.stringify({
  ok: true,
  state: 'oklahoma',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
