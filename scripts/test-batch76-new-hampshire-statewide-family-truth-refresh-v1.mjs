import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch76NewHampshireStatewideFamilyTruthRefreshV1 } from './run-batch76-new-hampshire-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch76NewHampshireStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.strong_critical_families, 7);
assert.equal(summary.weak_critical_families, 3);
assert.equal(summary.missing_critical_families, 2);
assert.deepEqual(batchSummary.resolved_families, ['parent_training_information_center']);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'new-hampshire_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].evidence_snippet, /Department of Education/i);
assert.match(pti.samples[0].evidence_snippet, /special-education/i);

console.log(JSON.stringify({
  ok: true,
  state: 'new-hampshire',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
