import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch391NewHampshireSpecialEdDowngradeV1 } from './run-batch391-new-hampshire-special-ed-downgrade-v1.mjs';

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

const result = generateBatch391NewHampshireSpecialEdDowngradeV1();
const summary = readJson('data/generated/new-hampshire_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-hampshire_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-hampshire_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-hampshire_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/new-hampshire_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch391_new_hampshire_special_ed_downgrade_summary_v1.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-hampshire-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.deepEqual(result.downgraded_families, ['special_education_idea_part_b']);
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.strong_critical_families, 4);
assert.equal(summary.weak_critical_families, 8);
assert.equal(summary.completeness_pct, 33);
assert.ok(summary.critical_gap_families.includes('special_education_idea_part_b'));
assert.equal(summary.familyStatuses.special_education_idea_part_b, 'blocked_official_education_hosts_and_diagnostic_surfaces_forbidden');
assert.ok(summary.critical_gap_families.includes('district_or_county_education_routing'));

const specialEdGap = gapRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(specialEdGap.family_status, 'blocked_official_education_hosts_and_diagnostic_surfaces_forbidden');
assert.match(specialEdGap.status_reason, /No reviewed statewide Part B authority leaf/i);

const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(districtGap.family_status, 'blocked_official_education_hosts_and_diagnostic_surfaces_forbidden');
assert.match(districtGap.status_reason, /district/i);
assert.match(districtGap.status_reason, /Access Denied/i);

const specialEdFailure = failureRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(specialEdFailure.failure_code, 'official_nh_statewide_special_education_host_family_and_direct_successors_still_return_access_denied_shell');
assert.equal(specialEdFailure.severity, 'critical');

const specialEdVerified = verifiedRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(specialEdVerified.family_status, 'blocked_official_education_hosts_and_diagnostic_surfaces_forbidden');
assert.equal(specialEdVerified.evidence_strength, 'weak');
assert.equal(specialEdVerified.sample_count, 4);
assert.ok(specialEdVerified.samples.every((sample) => sample.verification_status === 'blocked'));

const specialEdNext = nextRows.find((row) => row.family === 'special_education_idea_part_b');
assert.equal(specialEdNext.priority_rank, 5);
assert.equal(specialEdNext.next_action, 'hold_blocked_until_public_nh_special_education_host_or_statewide_leaf_is_reviewable');

const queueRow = queueRows.find((row) => row.state === 'new-hampshire');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.completeness_pct, 33);
assert.equal(queueRow.weak_critical_families, 8);

const auditRow = audit.states.find((row) => row.stateId === 'new-hampshire');
assert.equal(auditRow.strongCriticalFamilies, 4);
assert.equal(auditRow.weakCriticalFamilies, 8);
assert.equal(auditRow.completenessPct, 33);
assert.equal(auditRow.familyStatuses.special_education_idea_part_b, 'blocked_official_education_hosts_and_diagnostic_surfaces_forbidden');
assert.deepEqual(audit.classifications, { COMPLETE: 40, BLOCKED: 10 });
assert.equal(audit.indexSafeCount, 40);
assert.deepEqual(audit.incorrectlyIndexSafeStates, []);

assert.equal(batchSummary.classification, 'BLOCKED');
assert.equal(batchSummary.completeness_pct, 33);
assert.ok(stateReport.includes('statewide special-education family can no longer stay green'));
assert.ok(allStateReport.includes('statewide special education can no longer stay verified'));
assert.ok(handoff.includes('Current Focus State: New Hampshire'));
assert.ok(handoff.includes('statewide Part B can no longer stay verified'));
assert.ok(lessons.includes('### A Statewide Family Cannot Stay Verified After Its Only Official Proof Lane Turns Into The Blocker'));

console.log('test-batch391-new-hampshire-special-ed-downgrade-v1: ok');
