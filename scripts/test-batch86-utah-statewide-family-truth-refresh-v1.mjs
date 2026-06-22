import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch86UtahStatewideFamilyTruthRefreshV1 } from './run-batch86-utah-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch86UtahStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 2);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(batchSummary.resolved_families, ['protection_and_advocacy', 'parent_training_information_center', 'legal_aid']);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'utah_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const panda = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(panda.family_status, 'verified_state_grade');
assert.match(panda.samples[0].evidence_snippet, /Protection and Advocacy \(P&A\) agency/i);

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].evidence_snippet, /Parent Training and Information/i);

const legalAid = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'verified_state_grade');
assert.match(legalAid.samples[0].evidence_snippet, /legal rights/i);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'utah-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /terminal BLOCKED, not COMPLETE/);
assert.match(report, /Utah Parent Center/);
assert.match(report, /Disability Law Center/);

console.log(JSON.stringify({
  ok: true,
  state: 'utah',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
