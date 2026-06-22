import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch148KentuckyStatewideSourceRepairV1 } from './run-batch148-kentucky-statewide-source-repair-v1.mjs';

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

const result = generateBatch148KentuckyStatewideSourceRepairV1();
const summary = readJson('data/generated/kentucky_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kentucky_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kentucky_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/kentucky_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kentucky_verified_sources_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch148_kentucky_statewide_source_repair_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kentucky-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch148-kentucky-statewide-source-repair-report-v1.md'), 'utf8');
const vrSource = readJson('data/generated/kentucky_vr_reviewed_source_v1.json');
const ptiSource = readJson('data/generated/kentucky_pti_reviewed_source_v1.json');
const legalSource = readJson('data/generated/kentucky_legal_aid_reviewed_source_v1.json');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 75);
assert.equal(summary.strong_critical_families, 9);
assert.equal(summary.weak_critical_families, 3);
assert.equal(summary.missing_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'dbhdid_js_shell_and_county_grade_local_leafs_remain_unverified');
assert.deepEqual(
  summary.critical_gap_families,
  [
    'developmental_disability_idd_authority',
    'district_or_county_education_routing',
    'county_local_disability_resources',
  ],
);
assert.deepEqual(summary.major_gap_families, []);

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('vocational_rehabilitation_pre_ets').family_status, 'verified_state_grade');
assert.equal(byFamily.get('parent_training_information_center').family_status, 'verified_state_grade');
assert.equal(byFamily.get('legal_aid').family_status, 'verified_state_grade');

assert.equal(failureRows.length, 3);
assert.ok(!failureRows.some((row) => row.family === 'vocational_rehabilitation_pre_ets'));
assert.ok(!failureRows.some((row) => row.family === 'parent_training_information_center'));
assert.ok(!failureRows.some((row) => row.family === 'legal_aid'));

assert.deepEqual(
  nextRows.map((row) => row.family),
  [
    'developmental_disability_idd_authority',
    'district_or_county_education_routing',
    'county_local_disability_resources',
  ],
);

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('vocational_rehabilitation_pre_ets').sample_count, 1);
assert.equal(verifiedByFamily.get('parent_training_information_center').sample_count, 1);
assert.equal(verifiedByFamily.get('legal_aid').sample_count, 1);
assert.match(verifiedByFamily.get('vocational_rehabilitation_pre_ets').samples[0].evidence_snippet, /Kentucky Office of Vocational Rehabilitation/i);
assert.match(verifiedByFamily.get('parent_training_information_center').samples[0].evidence_snippet, /Parent Training and Information \(PTI\) grant/i);
assert.match(verifiedByFamily.get('legal_aid').samples[0].evidence_snippet, /free legal help for Kentuckians/i);

assert.equal(vrSource.final_url, 'https://kcc.ky.gov/Vocational-Rehabilitation/Pages/Kentucky-Office-of-Vocational-Rehabilitation.aspx');
assert.equal(ptiSource.final_url, 'https://www.kyspin.com/about/');
assert.equal(legalSource.final_url, 'https://www.kyjustice.org/');

const kentuckyQueue = queueRows.find((row) => row.state === 'kentucky');
assert.equal(kentuckyQueue.completeness_pct, 75);
assert.equal(kentuckyQueue.primary_gap_reason, 'dbhdid_js_shell_and_county_grade_local_leafs_remain_unverified');

const kentuckyAudit = audit.states.find((row) => row.stateId === 'kentucky');
assert.equal(kentuckyAudit.completenessPct, 75);
assert.equal(kentuckyAudit.strongCriticalFamilies, 9);
assert.equal(kentuckyAudit.weakCriticalFamilies, 3);
assert.equal(kentuckyAudit.familyStatuses.vocational_rehabilitation_pre_ets, 'verified_state_grade');
assert.equal(kentuckyAudit.familyStatuses.parent_training_information_center, 'verified_state_grade');
assert.equal(kentuckyAudit.familyStatuses.legal_aid, 'verified_state_grade');

assert.deepEqual(batchSummary.upgraded_families, [
  'vocational_rehabilitation_pre_ets',
  'parent_training_information_center',
  'legal_aid',
]);
assert.deepEqual(batchSummary.remaining_blockers, [
  'developmental_disability_idd_authority',
  'district_or_county_education_routing',
  'county_local_disability_resources',
]);

assert.ok(report.includes('Kentucky vocational rehabilitation upgrades'));
assert.ok(report.includes('Kentucky PTI upgrades'));
assert.ok(report.includes('Kentucky legal aid upgrades'));
assert.ok(batchReport.includes('upgraded_families: vocational_rehabilitation_pre_ets, parent_training_information_center, legal_aid'));

console.log('test-batch148-kentucky-statewide-source-repair-v1: ok');
