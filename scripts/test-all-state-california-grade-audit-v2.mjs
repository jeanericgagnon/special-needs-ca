import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';
import { fileURLToPath } from 'url';
import { generateAllStateCaliforniaGradeAuditV2 } from './run-all-state-california-grade-audit-v2.mjs';

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

generateAllStateCaliforniaGradeAuditV2();

const txV10 = readJson('data/generated/tx_verification_summary_v10.json');
const audit = readJson('data/generated/all_state_california_grade_audit_v2.json');
const gaps = readJsonl('data/generated/all_state_gap_matrix_v2.jsonl');
const failures = readJsonl('data/generated/all_state_failure_ledger_v2.jsonl');
const nextActions = readJsonl('data/generated/all_state_next_action_queue_v2.jsonl');
const priorityQueue = readJsonl('data/generated/all_state_priority_queue_v2.jsonl');
const report = fs.readFileSync(path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v2.md'), 'utf8');
const priorityPlan = fs.readFileSync(path.join(docsGeneratedDir, 'all-state-priority-plan-v2.md'), 'utf8');

assert.equal(txV10.v10.pass_counties, 254, 'Texas v10 must be complete before v2 audit is generated');
assert.equal(txV10.v10.partial_counties, 0, 'Texas v10 must have no partial counties before v2 audit is generated');
assert.equal(txV10.v10.blocked_counties, 0, 'Texas v10 must have no blocked counties before v2 audit is generated');

assert.equal(audit.stateCount, 50, 'All 50 states must be included in the v2 audit');
assert.equal(audit.states.length, 50, 'v2 state audit rows must cover all 50 states');

const texas = audit.states.find((state) => state.stateId === 'texas');
assert.ok(texas, 'Texas must be present in v2');
assert.equal(texas.classification, 'COMPLETE', 'Texas must be COMPLETE in v2 once v10 reaches 254/0/0');
assert.equal(texas.indexSafe, true, 'Texas must be index-safe in v2 once v10 reaches 254/0/0');
assert.equal(texas.missingCriticalFamilies, 0, 'Texas must have zero missing critical families in v2');
assert.equal(texas.familyStatuses.district_or_county_education_routing, 'verified_county_grade', 'Texas district routing must be verified_county_grade in v2');
assert.equal(texas.familyStatuses.county_local_disability_resources, 'verified_county_grade', 'Texas county-local resources must be verified_county_grade in v2');

assert.ok(!failures.some((row) => row.state === 'texas'), 'Texas should have no failure ledger rows in v2');
assert.ok(gaps.some((row) => row.state === 'texas' && row.family === 'district_or_county_education_routing' && row.family_status === 'verified_county_grade'), 'Texas district routing must be verified in the v2 gap matrix');
assert.ok(gaps.some((row) => row.state === 'texas' && row.family === 'county_local_disability_resources' && row.family_status === 'verified_county_grade'), 'Texas county-local resources must be verified in the v2 gap matrix');

const texasNext = nextActions.find((row) => row.state === 'texas');
assert.ok(texasNext, 'Texas next-action row must exist in v2');
assert.equal(texasNext.classification, 'COMPLETE', 'Texas next-action row must mark Texas complete in v2');

const texasPriority = priorityQueue.find((row) => row.state === 'texas');
assert.ok(texasPriority, 'Texas priority row must exist in v2');
assert.equal(texasPriority.classification, 'COMPLETE', 'Texas priority row must mark Texas complete in v2');
assert.equal(texasPriority.index_safe, true, 'Texas priority row must be index-safe in v2');

assert.ok(report.includes('Texas classification in v2: COMPLETE'), 'v2 report must state Texas is complete');
assert.ok(report.includes('Texas index-safe in v2: true'), 'v2 report must state Texas is index-safe');
assert.ok(priorityPlan.includes('Texas moved out of the fast-finish queue'), 'v2 priority plan must note Texas left the queue');

console.log(JSON.stringify({
  ok: true,
  texasClassification: texas.classification,
  texasIndexSafe: texas.indexSafe,
  indexSafeCount: audit.indexSafeCount,
  failureRows: failures.length,
}, null, 2));
