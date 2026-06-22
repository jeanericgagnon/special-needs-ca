import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch91WisconsinStatewideFamilyTruthRefreshV1 } from './run-batch91-wisconsin-statewide-family-truth-refresh-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch91WisconsinStatewideFamilyTruthRefreshV1();
assert.equal(result.summary.classification, 'BLOCKED');
assert.equal(result.summary.index_safe, false);

const summary = readJson(path.join(repoRoot, 'data', 'generated', 'wisconsin_california_grade_summary_v2.json'));
assert.equal(summary.classification, 'BLOCKED');
assert.deepEqual(
  summary.final_blockers.map((row) => row.family),
  [
    'district_or_county_education_routing',
    'county_local_disability_resources',
    'parent_training_information_center',
    'legal_aid',
  ],
);

const gapRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'wisconsin_gap_matrix_v2.jsonl'));
assert.equal(
  gapRows.find((row) => row.family === 'protection_and_advocacy').family_status,
  'verified_state_grade',
);
assert.equal(
  gapRows.find((row) => row.family === 'parent_training_information_center').family_status,
  'blocked_reviewed_first_party_support_without_explicit_pti_designation',
);

const verifiedRows = readJsonl(path.join(repoRoot, 'data', 'generated', 'wisconsin_verified_sources_v1.jsonl'));
const pandaRow = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
const ptiRow = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pandaRow.family_status, 'verified_state_grade');
assert.match(pandaRow.samples[0].evidence_snippet, /Protection and Advocacy/);
assert.equal(ptiRow.family_status, 'blocked_reviewed_first_party_support_without_explicit_pti_designation');
assert.match(ptiRow.blocker_evidence, /not explicit PTI designation/);

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'wisconsin-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Wisconsin is therefore terminal BLOCKED, not COMPLETE\./);
assert.match(report, /WI FACETS/);
