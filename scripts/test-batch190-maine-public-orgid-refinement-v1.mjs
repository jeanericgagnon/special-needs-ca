import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch190MainePublicOrgIdRefinementV1 } from './run-batch190-maine-public-orgid-refinement-v1.mjs';

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

const result = generateBatch190MainePublicOrgIdRefinementV1();
const batchSummary = readJson('data/generated/batch190_maine_public_orgid_refinement_summary_v1.json');
const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch190-maine-public-orgid-refinement-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(batchSummary.public_orgids_detected, true);
assert.equal(summary.primary_gap_reason, 'public_maine_orgid_inventory_and_municipality_workbook_are_live_but_contact_result_step_still_500_and_dhhs_office_mapping_is_absent');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(eduGap.status_reason, /Acadia Academy \(1761\), Acton Public Schools \(2\), Auburn Public Schools \(14\), Augusta Public Schools \(28\), and Bangor Public Schools \(42\)/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'public_orgid_inventory_and_workbook_are_live_but_contact_result_step_still_500');
assert.match(eduFailure.evidence, /1761 Acadia Academy, 2 Acton Public Schools, 14 Auburn Public Schools, 28 Augusta Public Schools, and 42 Bangor Public Schools/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.sample_count, 4);
assert.ok(eduVerified.samples.some((sample) => sample.sample_name === 'Maine NEO Primary Contacts By Organization selector'));

const eduNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduNext.next_action, 'use_live_orgids_and_municipality_workbook_for_reviewed_browser_capture_or_export_recovery');

assert.ok(report.includes('public OrgId and municipality inventory is now clearly solved on official first-party surfaces'));
assert.ok(batchReport.includes('OrgId discovery is already solved on the first-party selector HTML itself'));
assert.ok(lessons.includes('### Public OrgId Dropdowns Eliminate Selector Discovery'));

console.log('test-batch190-maine-public-orgid-refinement-v1: ok');
