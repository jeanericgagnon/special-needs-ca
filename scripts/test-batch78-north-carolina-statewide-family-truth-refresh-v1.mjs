import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch78NorthCarolinaStatewideFamilyTruthRefreshV1 } from './run-batch78-north-carolina-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch78NorthCarolinaStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.strong_critical_families, 7);
assert.equal(summary.weak_critical_families, 3);
assert.equal(summary.missing_critical_families, 2);
assert.deepEqual(batchSummary.resolved_families, []);
assert.deepEqual(batchSummary.evidence_refreshed_families, [
  'vocational_rehabilitation_pre_ets',
  'parent_training_information_center',
]);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'north-carolina_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'inventory_only');
assert.match(pti.samples[0].evidence_snippet, /Parent Training and Information Center \(PTI\) navigation/i);
assert.match(pti.samples[0].evidence_snippet, /does not preserve an explicit statewide/i);

const vr = verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(vr.family_status, 'verified_state_grade');
assert.match(vr.samples[0].evidence_snippet, /more than 70 local EIPD offices/i);
assert.match(vr.samples[0].source_url, /ncdhhs\.gov\/divisions\/eipd/i);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'north-carolina-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /terminal BLOCKED, not COMPLETE/);
assert.match(report, /does not preserve a fetched statewide PTI designation leaf/i);

console.log(JSON.stringify({
  ok: true,
  state: 'north-carolina',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
