import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch88VirginiaStatewideFamilyTruthRefreshV1 } from './run-batch88-virginia-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch88VirginiaStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.strong_critical_families, 9);
assert.equal(summary.weak_critical_families, 3);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(batchSummary.resolved_families, ['protection_and_advocacy', 'legal_aid']);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'virginia_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const panda = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(panda.family_status, 'verified_state_grade');
assert.match(panda.samples[0].evidence_snippet, /Protection and Advocacy organization/i);

const legalAid = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legalAid.family_status, 'verified_state_grade');
assert.match(legalAid.samples[0].evidence_snippet, /legal services and direct representation/i);

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'inventory_only');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'virginia-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /terminal BLOCKED, not COMPLETE/);
assert.match(report, /disAbility Law Center of Virginia now truthfully satisfies both the statewide protection-and-advocacy family and the statewide legal-aid family/i);
assert.match(report, /still lacks an explicit PTI designation preserved on the fetched page itself/i);

console.log(JSON.stringify({
  ok: true,
  state: 'virginia',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
