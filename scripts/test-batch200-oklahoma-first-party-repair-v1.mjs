import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch200OklahomaFirstPartyRepairV1 } from './run-batch200-oklahoma-first-party-repair-v1.mjs';

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

const result = generateBatch200OklahomaFirstPartyRepairV1();
const summary = readJson('data/generated/oklahoma_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/oklahoma_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/oklahoma_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/oklahoma_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/oklahoma_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/oklahoma-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification_after, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 83);
assert.equal(summary.strong_critical_families, 10);
assert.equal(summary.weak_critical_families, 2);
assert.equal(summary.missing_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'generic_state_education_page_collapse_and_dead_dhhs_locator_host');
assert.deepEqual(summary.critical_gap_families, ['district_or_county_education_routing', 'county_local_disability_resources']);
assert.deepEqual(summary.major_gap_families, []);

const pnaGap = gapRows.find((row) => row.family === 'protection_and_advocacy');
const legalGap = gapRows.find((row) => row.family === 'legal_aid');
const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(pnaGap.family_status, 'verified_state_grade');
assert.equal(legalGap.family_status, 'verified_state_grade');
assert.match(eduGap.status_reason, /generic state education page/i);
assert.match(countyGap.status_reason, /DHHS locations host fails DNS/i);

assert.equal(failureRows.length, 2);
const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(eduFailure.failure_code, 'education_leaf_guesses_collapse_to_generic_state_page');
assert.match(eduFailure.evidence, /oklahoma\.gov\/education\.html\?page=543/i);
assert.equal(countyFailure.failure_code, 'dead_dhhs_locator_host_plus_doi_planning_rows');
assert.match(countyFailure.evidence, /dhhs\.oklahoma\.gov\/locations/i);
assert.match(countyFailure.evidence, /fails DNS resolution/i);

const pnaVerified = verifiedRows.find((row) => row.family === 'protection_and_advocacy');
const legalVerified = verifiedRows.find((row) => row.family === 'legal_aid');
assert.equal(pnaVerified.family_status, 'verified_state_grade');
assert.equal(legalVerified.family_status, 'verified_state_grade');
assert.equal(pnaVerified.samples[0].final_url, 'https://drok.org/');
assert.equal(legalVerified.samples[0].final_url, 'https://legalaidok.org/');

assert.equal(nextRows.length, 2);
assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'hold_blocked_until_new_exact_district_or_county_education_leaves_are_authored');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'hold_blocked_until_new_live_county_grade_directory_or_county_owned_leaves_are_verified');

const queueRow = queueRows.find((row) => row.state === 'oklahoma');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.index_safe, false);
assert.equal(queueRow.primary_gap_reason, 'generic_state_education_page_collapse_and_dead_dhhs_locator_host');
assert.equal(queueRow.missing_critical_families, 0);
assert.equal(queueRow.weak_critical_families, 2);

assert.ok(report.includes('Oklahoma no longer lacks statewide first-party support proof for protection_and_advocacy or legal_aid.'));
assert.ok(report.includes('Oklahoma therefore remains BLOCKED, not COMPLETE.'));
assert.ok(lessons.includes('### First-Party Rebrand Redirects Can Still Clear Statewide Support Families'));

console.log('test-batch200-oklahoma-first-party-repair-v1: ok');
