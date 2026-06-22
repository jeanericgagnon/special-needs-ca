import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractIowaPtiEvidence, generateBatch93IowaPtiStatewideRepairV1 } from './run-batch93-iowa-pti-statewide-repair-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const ptiFixture = `
  <html><body>
    <title>ASK PTIC</title>
    <div>ASK Resource Center has been Iowa’s Parent and Training Information Center (PTIC or PTI) since 1998.</div>
    <div>Iowa has only one PTI, and we operate statewide.</div>
    <div>The PTI is a federally funded project of the U.S. Department of Education.</div>
  </body></html>
`;

const evidence = extractIowaPtiEvidence(ptiFixture);
assert.match(evidence.evidenceSnippet, /Iowa has only one PTI/i);

const summary = await generateBatch93IowaPtiStatewideRepairV1(async () => ({
  status: 200,
  finalUrl: 'https://www.askresource.org/about/what-ASK-does-do/parent-training-and-information-center-ptic',
  html: ptiFixture,
}));

const stateSummary = readJson('data/generated/iowa_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/iowa_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/iowa_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/iowa_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/iowa_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/iowa-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(stateSummary.classification, 'BLOCKED');
assert.equal(stateSummary.index_safe, false);
assert.equal(stateSummary.completeness_pct, 91);
assert.equal(stateSummary.strong_critical_families, 11);
assert.equal(stateSummary.weak_critical_families, 1);
assert.equal(stateSummary.missing_critical_families, 0);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');

assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'));
assert.deepEqual(nextRows.map((row) => row.family), ['district_or_county_education_routing']);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1);
assert.equal(
  verifiedByFamily.get('parent_training_information_center').samples[0].source_url,
  'https://www.askresource.org/about/what-ASK-does-do/parent-training-and-information-center-ptic',
);

assert.ok(report.includes('ASK Resource Center has been Iowa’s PTIC since 1998'));
assert.ok(report.includes('district_or_county_education_routing still lacks'));

console.log('test-batch93-iowa-pti-statewide-repair-v1: ok');
