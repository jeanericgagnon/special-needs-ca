import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch208MaineSauExportRecoveryV1 } from './run-batch208-maine-sau-export-recovery-v1.mjs';

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

const result = generateBatch208MaineSauExportRecoveryV1();
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch208_maine_sau_export_recovery_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'public_maine_sau_export_contract_now_works_but_not_yet_materialized_county_grade_and_dhhs_office_html_has_no_county_contract');
assert.equal(queueRows.find((row) => row.state === 'maine').primary_gap_reason, 'public_maine_sau_export_contract_now_works_but_not_yet_materialized_county_grade_and_dhhs_office_html_has_no_county_contract');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_live_public_sau_export_contract_not_materialized_county_grade');
assert.match(gap.status_reason, /action:SAUExport/i);
assert.match(gap.status_reason, /504 Coordinator/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'public_sau_export_contract_works_but_not_yet_materialized_into_county_grade_local_routing');
assert.match(failure.evidence, /__RequestVerificationToken/i);
assert.match(failure.evidence, /action:SAUExport/i);
assert.match(failure.evidence, /application\/ms-excel/i);
assert.match(failure.evidence, /Bangor Public Schools/i);
assert.match(failure.evidence, /dchadbourne@bangorschools\.net/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_live_public_sau_export_contract_not_materialized_county_grade');
assert.equal(verified.sample_count, 5);
assert.ok(verified.samples.some((sample) => /SAUSearchResults\.xls/.test(sample.evidence_snippet)));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'use_live_orgids_workbook_and_working_sau_export_to_materialize_reviewed_local_district_contacts_county_by_county');

assert.equal(batchSummary.public_sau_export_contract_verified, true);
assert.equal(batchSummary.sample_orgid, 42);
assert.ok(report.includes('the official export contract now works and returns role-bearing local contact rows'));
assert.ok(lessons.includes('### MVC Search Forms May Need The Named Submit Action, Not Just The Hidden Inventory'));

console.log('test-batch208-maine-sau-export-recovery-v1: ok');
