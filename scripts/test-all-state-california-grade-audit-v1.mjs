import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';
import { fileURLToPath } from 'url';
import { generateAllStateCaliforniaGradeAudit } from './run-all-state-california-grade-audit-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

generateAllStateCaliforniaGradeAudit();

const audit = readJson('data/generated/all_state_california_grade_audit_v1.json');
const schema = readJson('data/generated/all_state_california_grade_schema_v1.json');
const gatePolicy = readJson('data/generated/all_state_launch_gate_policy_v1.json');
const gaps = readJsonl('data/generated/all_state_gap_matrix_v1.jsonl');
const failures = readJsonl('data/generated/all_state_failure_ledger_v1.jsonl');
const nextActions = readJsonl('data/generated/all_state_next_action_queue_v1.jsonl');
const priorityQueue = readJsonl('data/generated/all_state_priority_queue_v1.jsonl');
const requiredFamilies = readJsonl('data/generated/all_state_required_source_families_v1.jsonl');
const report = fs.readFileSync(path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v1.md'), 'utf8');
const procedure = fs.readFileSync(path.join(docsGeneratedDir, 'all-state-california-grade-procedure-v1.md'), 'utf8');
const priorityPlan = fs.readFileSync(path.join(docsGeneratedDir, 'all-state-priority-plan-v1.md'), 'utf8');
const laneTemplates = fs.readFileSync(path.join(docsGeneratedDir, 'state-repair-lane-templates-v1.md'), 'utf8');

assert.equal(audit.stateCount, 50, 'All 50 states must be included in the audit');
assert.equal(audit.states.length, 50, 'State audit rows must cover all 50 states');
assert.equal(new Set(audit.states.map((state) => state.stateId)).size, 50, 'State IDs must be unique');
assert.ok(schema.requiredFamilies.length >= 13, 'Schema must define the required source families');
assert.equal(requiredFamilies.length, schema.requiredFamilies.length, 'JSONL family artifact must match schema family count');
assert.ok(gatePolicy.passRequires.includes('official source URL'), 'Launch gate policy must preserve evidence requirements');

for (const family of schema.requiredFamilies) {
  assert.ok(family.family_id || family.familyId, 'Every family row must have a stable family id');
}

const texas = audit.states.find((state) => state.stateId === 'texas');
assert.ok(texas, 'Texas must be present');
assert.equal(texas.classification, 'PARTIAL', 'Texas should remain partial under v9 truth');
assert.equal(texas.indexSafe, false, 'Texas must not be index-safe while v9 has partial counties');

const newMexico = audit.states.find((state) => state.stateId === 'new-mexico');
assert.ok(newMexico, 'New Mexico must be present');
assert.ok(['UNSTARTED', 'BLOCKED'].includes(newMexico.classification), 'New Mexico must not silently pass');
assert.equal(newMexico.indexSafe, false, 'New Mexico must not be index-safe with critical gaps');

const illinois = audit.states.find((state) => state.stateId === 'illinois');
assert.ok(illinois, 'Illinois must be present');
assert.equal(illinois.indexSafe, false, 'Illinois must stay non-index-safe while critical gaps remain');

for (const state of audit.states) {
  if (state.missingCriticalFamilies > 0 || state.classification !== 'COMPLETE') {
    assert.equal(state.indexSafe, false, `State ${state.stateId} cannot be index-safe with critical gaps or incomplete classification`);
  }
}

const criticalFamilies = new Set(schema.requiredFamilies.filter((family) => family.critical).map((family) => family.family_id ?? family.familyId));
for (const state of audit.states) {
  if (state.classification !== 'COMPLETE') {
    const stateFailures = failures.filter((row) => row.state === state.stateId);
    assert.ok(stateFailures.length > 0, `Failure ledger rows must exist for incomplete state ${state.stateId}`);
    assert.ok(stateFailures.some((row) => row.family === 'launch_gate' || criticalFamilies.has(row.family)), `Incomplete state ${state.stateId} must have a critical-family or launch-gate failure row`);
  }
}

assert.equal(priorityQueue.length, 50, 'Priority queue must be generated for every state');
assert.equal(nextActions.length, 50, 'Each state must have a next action row');
assert.ok(priorityQueue.every((row) => row.priority_score >= 0), 'Priority scores must be numeric and non-negative');
assert.ok(priorityQueue.some((row) => row.recommended_batch === 'batch_1_fast_finish'), 'There must be fast-finish states');
assert.ok(priorityQueue.some((row) => row.recommended_batch === 'batch_3_procedure_hardening'), 'There must be hardening states');

assert.ok(report.includes('No new reusable lesson was learned'), 'Audit report must explicitly state when no new reusable lesson was learned');
assert.ok(report.includes('legacy reports or allowlists'), 'Audit report must mention incorrectly exposed legacy states');
assert.ok(procedure.includes('Texas v6-v9'), 'Procedure must carry forward Texas lessons');
assert.ok(priorityPlan.includes('county-count'), 'Priority plan must explain the repo-available search-value proxy');
assert.ok(laneTemplates.includes('Spot-Audit Pass'), 'Lane template doc must include the spot-audit lane');

for (const stateSlug of ['texas', 'illinois', 'new-mexico']) {
  assert.ok(fs.existsSync(path.join(generatedDir, `${stateSlug}_california_grade_summary_v1.json`)), `Pilot summary must exist for ${stateSlug}`);
  assert.ok(fs.existsSync(path.join(generatedDir, `${stateSlug}_gap_matrix_v1.jsonl`)), `Pilot gap matrix must exist for ${stateSlug}`);
  assert.ok(fs.existsSync(path.join(generatedDir, `${stateSlug}_failure_ledger_v1.jsonl`)), `Pilot failure ledger must exist for ${stateSlug}`);
  assert.ok(fs.existsSync(path.join(generatedDir, `${stateSlug}_next_action_queue_v1.jsonl`)), `Pilot next-action queue must exist for ${stateSlug}`);
  assert.ok(fs.existsSync(path.join(docsGeneratedDir, `${stateSlug}-california-grade-audit-report-v1.md`)), `Pilot markdown report must exist for ${stateSlug}`);
}

const gapStates = new Set(gaps.map((row) => row.state));
assert.equal(gapStates.size, 50, 'Gap matrix must include every state');
assert.ok(gaps.some((row) => row.family === 'district_or_county_education_routing' && row.family_status !== 'verified_county_grade'), 'County/district routing must stay gated where direct evidence is missing');
assert.ok(failures.some((row) => row.failure_code === 'generic_or_statewide_evidence_used_where_local_required'), 'Weak generic/statewide evidence must be rejected where local evidence is required');

console.log(JSON.stringify({
  ok: true,
  stateCount: audit.stateCount,
  classifications: audit.classifications,
  failureRows: failures.length,
  priorityRows: priorityQueue.length,
}, null, 2));
