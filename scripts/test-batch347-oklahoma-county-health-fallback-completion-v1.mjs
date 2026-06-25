import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const summary = readJson('data/generated/oklahoma_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/oklahoma_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/oklahoma_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/oklahoma_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/oklahoma_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/oklahoma-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch347_oklahoma_county_health_fallback_completion_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch347-oklahoma-county-health-fallback-completion-report-v1.md'), 'utf8');

assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.batch, 'batch347_oklahoma_county_health_fallback_completion_v1');
assert.equal(summary.primary_gap_reason, 'none');
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.deepEqual(summary.final_blockers, []);
assert.equal(summary.familyStatuses.county_local_disability_resources, 'verified_county_grade');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_county_grade');
assert.match(countyGap.status_reason, /county health department fallback pairs/i);
assert.match(countyGap.status_reason, /all 31 previously unresolved Oklahoma counties/i);
assert.match(countyGap.status_reason, /SoonerStart/i);

assert.equal(failureRows.length, 0);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'verified_county_grade');
assert.equal(countyVerified.sample_count, 5);
assert.equal(countyVerified.blocker_code, null);
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'All 31 previously unresolved counties covered by county-health fallback'));
assert.ok(countyVerified.samples.some((row) => row.sample_name === 'Okfuskee county health worker referral evidence'));

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'maintenance');
assert.equal(nextRows[0].failure_code, 'none');

const queueRow = queueRows.find((row) => row.state === 'oklahoma');
assert.equal(queueRow.classification, 'COMPLETE');
assert.equal(queueRow.index_safe, true);
assert.equal(queueRow.status, 'COMPLETE');
assert.equal(queueRow.primary_gap_reason, 'none');

assert.equal(allStateAudit.classifications.COMPLETE, 33);
assert.equal(allStateAudit.classifications.BLOCKED, 17);
assert.equal(allStateAudit.indexSafeCount, 33);
const auditRow = allStateAudit.states.find((row) => row.stateId === 'oklahoma');
assert.equal(auditRow.classification, 'COMPLETE');
assert.equal(auditRow.indexSafe, true);
assert.equal(auditRow.completenessPct, 100);
assert.equal(auditRow.familyStatuses.county_local_disability_resources, 'verified_county_grade');
assert.equal(auditRow.packetBatch, 'batch347_oklahoma_county_health_fallback_completion_v1');

assert.match(stateReport, /Oklahoma is now `COMPLETE` and `index_safe=true`/);
assert.match(stateReport, /county-health fallback explicitly closes these 31 previously unresolved counties/i);
assert.match(stateReport, /county-local now clears/i);
assert.match(allStateReport, /Oklahoma is now COMPLETE\/index-safe/i);
assert.match(handoff, /Current Focus State: Maine/);
assert.match(handoff, /Maine DHHS county or service-area crosswalk/i);
assert.match(lessons, /County Health Department Root Plus Services Leaves Can Be A Truth-Safe County Fallback/);

assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);
assert.equal(batchSummary.county_health_validation_count, 31);
assert.equal(batchSummary.verified_county_health_validation_count, 31);
assert.equal(batchSummary.validations.length, 31);
assert.ok(batchSummary.validations.every((row) => row.verification_status === 'verified'));
assert.ok(batchSummary.validations.every((row) => row.root_status === 200));
assert.ok(batchSummary.validations.every((row) => row.service_status === 200));
assert.ok(batchSummary.validations.every((row) => row.phone_evidence));
assert.ok(batchSummary.validations.every((row) => row.address_evidence));
assert.ok(batchSummary.validations.every((row) => row.service_evidence));
assert.match(batchReport, /replaced the old partial-OKDHS-widget blocker/i);

console.log('test-batch347-oklahoma-county-health-fallback-completion-v1: ok');
