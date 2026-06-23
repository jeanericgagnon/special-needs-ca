import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateBatch83SouthCarolinaStatewideFamilyTruthRefreshV1 } from './run-batch83-south-carolina-statewide-family-truth-refresh-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const { summary, batchSummary } = generateBatch83SouthCarolinaStatewideFamilyTruthRefreshV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 92);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.weak_critical_families, 1);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(batchSummary.resolved_families, ['protection_and_advocacy', 'parent_training_information_center', 'legal_aid', 'county_local_disability_resources']);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'south-carolina_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const panda = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(panda.family_status, 'verified_state_grade');

const legal = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legal.family_status, 'verified_state_grade');
assert.match(legal.samples[0].evidence_snippet, /statewide law firm/i);

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].evidence_snippet, /South Carolina PTI \(Serving the entire state\)/i);

const countyLocal = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyLocal.family_status, 'verified_state_grade');
assert.equal(countyLocal.sample_count, 46);
assert.match(countyLocal.samples[1].evidence_snippet, /Abbeville County DSS/i);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'south-carolina-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /classification: BLOCKED/);
assert.match(report, /terminal BLOCKED, not COMPLETE/);
assert.match(report, /South Carolina Legal Services is preserved as statewide legal aid/i);
assert.ok(!report.includes('Family Connection artifact still does not explicitly preserve PTI-grade designation text'));
assert.ok(!report.includes('DOI mirror-backed office evidence'));

console.log(JSON.stringify({
  ok: true,
  state: 'south-carolina',
  classification: summary.classification,
  blockers: summary.final_blockers.length,
}, null, 2));
