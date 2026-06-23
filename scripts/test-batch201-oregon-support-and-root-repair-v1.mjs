import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch201OregonSupportAndRootRepairV1 } from './run-batch201-oregon-support-and-root-repair-v1.mjs';

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

const result = generateBatch201OregonSupportAndRootRepairV1();
const summary = readJson('data/generated/oregon_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/oregon_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/oregon_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/oregon_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/oregon_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/oregon-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification_after, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 2);
assert.equal(summary.missing_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'live_state_special_education_root_without_district_contract_and_live_office_finder_root_without_county_extract');
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing', 'county_local_disability_resources']);
assert.deepEqual(summary.major_gap_families, []);

const ptiGap = gapRows.find((row) => row.family === 'parent_training_information_center');
const legalGap = gapRows.find((row) => row.family === 'legal_aid');
const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(ptiGap.family_status, 'verified_state_grade');
assert.equal(legalGap.family_status, 'verified_state_grade');
assert.match(eduGap.status_reason, /all 36 school_district rows/i);
assert.match(countyGap.status_reason, /live ODHS office-finder root exists/i);

assert.equal(failureRows.length, 2);
const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(eduFailure.failure_code, 'live_state_special_education_root_without_district_contract');
assert.match(eduFailure.evidence, /all 36 Oregon school_district rows sharing the same root source URL/i);
assert.equal(countyFailure.failure_code, 'live_office_finder_root_without_county_extract');
assert.match(countyFailure.evidence, /office-finder\.aspx/i);
assert.match(countyFailure.evidence, /61 DOI-backed planning rows and only 3 dead/i);

const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
const legalVerified = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(ptiVerified.family_status, 'verified_state_grade');
assert.equal(legalVerified.family_status, 'verified_state_grade');
assert.equal(ptiVerified.samples[0].source_url, 'https://www.parentcenterhub.org/findurcenter/oregon/');
assert.equal(legalVerified.samples[0].final_url, 'https://oregonlawcenter.org/');

assert.equal(nextRows.length, 2);
assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'hold_blocked_until_district_owned_or_county_grade_education_leaves_are_authored');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'hold_blocked_until_county_grade_office_contract_is_extracted_from_live_office_finder_or_county_owned_leaves');

const queueRow = queueRows.find((row) => row.state === 'oregon');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.index_safe, false);
assert.equal(queueRow.primary_gap_reason, 'live_state_special_education_root_without_district_contract_and_live_office_finder_root_without_county_extract');
assert.equal(queueRow.missing_critical_families, 0);
assert.equal(queueRow.weak_critical_families, 2);

assert.ok(report.includes('Oregon no longer lacks statewide PTI or statewide legal-aid evidence on disk.'));
assert.ok(report.includes('Oregon therefore remains BLOCKED, not COMPLETE.'));
assert.ok(lessons.includes('### A Live Successor Office-Finder Root Still Fails Closed Without A County Contract'));

console.log('test-batch201-oregon-support-and-root-repair-v1: ok');
