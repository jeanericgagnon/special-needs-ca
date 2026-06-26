import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch76NewHampshireStatewideFamilyTruthRefreshV1 } from './run-batch76-new-hampshire-statewide-family-truth-refresh-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

const { summary, batchSummary } = generateBatch76NewHampshireStatewideFamilyTruthRefreshV1();
const failureRows = readJsonl('data/generated/new-hampshire_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-hampshire_verified_sources_v1.jsonl');
const gapRows = readJsonl('data/generated/new-hampshire_gap_matrix_v2.jsonl');
const nextRows = readJsonl('data/generated/new-hampshire_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch76-new-hampshire-statewide-family-truth-refresh-report-v1.md'), 'utf8');
const savedBatchSummary = readJson('data/generated/batch76_new_hampshire_statewide_family_truth_refresh_summary_v1.json');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 33);
assert.equal(summary.strong_critical_families, 4);
assert.equal(summary.weak_critical_families, 8);
assert.equal(summary.missing_critical_families, 0);

assert.deepEqual(batchSummary.preserved_statewide_support_families, [
  'parent_training_information_center',
  'protection_and_advocacy',
  'legal_aid',
  'able_program',
  'ssi_ssa_federal_reference',
]);
assert.equal(batchSummary.result, 'new_hampshire_remains_truthfully_blocked_because_dhhs_doe_and_vr_host_families_are_not_publicly_reviewable');
assert.deepEqual(savedBatchSummary, batchSummary);

const pti = verifiedRows.find((row) => row.family === 'parent_training_information_center');
assert.equal(pti.family_status, 'verified_state_grade');
assert.match(pti.samples[0].evidence_snippet, /Department of Education/i);
assert.match(pti.samples[0].evidence_snippet, /special-education/i);

const pa = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
assert.equal(pa.family_status, 'verified_state_grade');
assert.match(pa.samples[0].evidence_snippet, /Protection and Advocacy agency/i);

const legal = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(legal.family_status, 'verified_state_grade');
assert.match(legal.samples[0].evidence_snippet, /free civil legal aid/i);

const blockedDhhs = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(blockedDhhs.family_status, 'blocked_official_dhhs_hosts_and_diagnostic_surfaces_forbidden');
assert.match(blockedDhhs.blocker_evidence, /Access Denied/i);

const blockedEducation = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(blockedEducation.family_status, 'blocked_official_education_hosts_and_nh_gov_successors_forbidden');
assert.match(blockedEducation.blocker_evidence, /Access Denied/i);

const blockedVr = verifiedRows.find((row) => row.family === 'vocational_rehabilitation_pre_ets');
assert.equal(blockedVr.family_status, 'blocked_vr_hosts_unresolvable_or_forbidden_with_no_nh_gov_successor');
assert.match(blockedVr.blocker_evidence, /Access Denied/i);

assert.equal(failureRows.length, 8);
assert.ok(failureRows.every((row) => /Access Denied|does not resolve/i.test(row.evidence)));
assert.equal(gapRows.filter((row) => row.family_status === 'verified_state_grade').length, 5);
assert.equal(nextRows.length, 8);

assert.match(report, /New Hampshire remains BLOCKED and not index-safe/i);
assert.match(report, /reviewed official host families are still DNS-dead or return the same short `Access Denied` shell/i);
assert.match(report, /Preserved statewide verified families/i);
assert.match(report, /Confirmed host-family blockers/i);

console.log('test-batch76-new-hampshire-statewide-family-truth-refresh-v1: ok');
