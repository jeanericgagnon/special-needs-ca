import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch90WestVirginiaStatewideFamilyTruthRefreshV1 } from './run-batch90-west-virginia-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch90WestVirginiaStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.strong_critical_families, 9);
assert.equal(summary.weak_critical_families, 2);
assert.equal(summary.missing_critical_families, 1);
assert.deepEqual(batchSummary.resolved_families, ['protection_and_advocacy', 'parent_training_information_center']);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'west-virginia_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const panda = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(panda.family_status, 'verified_state_grade');
assert.match(panda.samples[0].evidence_snippet, /protects and advocates for the human and legal rights/i);

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].evidence_snippet, /West Virginia.?s Parent Training Center/i);

const legalAid = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'missing');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'west-virginia-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /reviewed first-party statewide protection-and-advocacy and PTI evidence/i);
assert.match(report, /statewide legal-aid evidence is still missing on disk/i);
assert.match(report, /terminal BLOCKED, not COMPLETE/i);

console.log(JSON.stringify({
  ok: true,
  state: 'west-virginia',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
