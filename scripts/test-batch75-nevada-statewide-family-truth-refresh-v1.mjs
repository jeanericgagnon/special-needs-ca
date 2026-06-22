import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch75NevadaStatewideFamilyTruthRefreshV1 } from './run-batch75-nevada-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch75NevadaStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 2);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(batchSummary.resolved_families, [
  'protection_and_advocacy',
  'parent_training_information_center',
  'legal_aid',
]);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'nevada_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const panda = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
const legal = verifiedRows.find((row) => row.family === 'legal_aid');

assert.equal(panda.family_status, 'verified_state_grade');
assert.match(panda.samples[0].evidence_snippet, /federally mandated protection and advocacy system/i);
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].evidence_snippet, /Statewide: 1-800-216-5188/);
assert.equal(legal.family_status, 'verified_state_grade');
assert.match(legal.samples[0].evidence_snippet, /legal/i);

console.log(JSON.stringify({
  ok: true,
  state: 'nevada',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
