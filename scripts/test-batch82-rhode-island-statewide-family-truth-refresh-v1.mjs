import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch82RhodeIslandStatewideFamilyTruthRefreshV1 } from './run-batch82-rhode-island-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch82RhodeIslandStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 2);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(batchSummary.resolved_families, ['protection_and_advocacy', 'parent_training_information_center', 'legal_aid']);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const panda = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(panda.family_status, 'verified_state_grade');
assert.match(panda.samples[0].evidence_snippet, /federally mandated Protection and Advocacy \(P&A\) System/i);

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].evidence_snippet, /Rhode Island PTI Rhode Island Parent Info Network \(RIPIN\)/i);

const legal = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legal.family_status, 'verified_state_grade');
assert.match(legal.samples[0].evidence_snippet, /Legal help and representation for low-income individuals in Rhode Island/i);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'rhode-island-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /terminal BLOCKED, not COMPLETE/);
assert.match(report, /federally mandated Protection and Advocacy \(P&A\) System/i);
assert.ok(!report.includes('statewide legal aid is still missing on disk'));

console.log(JSON.stringify({
  ok: true,
  state: 'rhode-island',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
