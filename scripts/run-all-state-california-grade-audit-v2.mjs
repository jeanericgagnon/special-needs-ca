import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  auditV1: path.join(generatedDir, 'all_state_california_grade_audit_v1.json'),
  gapV1: path.join(generatedDir, 'all_state_gap_matrix_v1.jsonl'),
  failureV1: path.join(generatedDir, 'all_state_failure_ledger_v1.jsonl'),
  nextV1: path.join(generatedDir, 'all_state_next_action_queue_v1.jsonl'),
  priorityV1: path.join(generatedDir, 'all_state_priority_queue_v1.jsonl'),
  reportV1: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v1.md'),
  txV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
};

const OUTPUTS = {
  auditV2: path.join(generatedDir, 'all_state_california_grade_audit_v2.json'),
  gapV2: path.join(generatedDir, 'all_state_gap_matrix_v2.jsonl'),
  failureV2: path.join(generatedDir, 'all_state_failure_ledger_v2.jsonl'),
  nextV2: path.join(generatedDir, 'all_state_next_action_queue_v2.jsonl'),
  priorityV2: path.join(generatedDir, 'all_state_priority_queue_v2.jsonl'),
  reportV2: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v2.md'),
  planV2: path.join(docsGeneratedDir, 'all-state-priority-plan-v2.md'),
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function countBy(rows, keyFn) {
  const counts = {};
  for (const row of rows) {
    const key = keyFn(row) || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function buildV2Artifacts() {
  const txV10 = readJson(INPUTS.txV10);
  if (txV10.v10.partial_counties !== 0 || txV10.v10.blocked_counties !== 0 || !txV10.index_safe) {
    throw new Error('Texas v10 is not complete; do not generate all-state v2.');
  }

  const auditV1 = readJson(INPUTS.auditV1);
  const gapsV1 = readJsonl(INPUTS.gapV1);
  const failuresV1 = readJsonl(INPUTS.failureV1);
  const nextV1 = readJsonl(INPUTS.nextV1);
  const priorityV1 = readJsonl(INPUTS.priorityV1);

  const texasState = auditV1.states.find((row) => row.stateId === 'texas');
  if (!texasState) throw new Error('Texas row missing from v1 audit');

  const statesV2 = auditV1.states.map((state) => {
    if (state.stateId !== 'texas') return state;
    return {
      ...state,
      classification: 'COMPLETE',
      indexSafe: true,
      incorrectlyIndexSafe: false,
      strongCriticalFamilies: state.totalCriticalFamilies,
      weakCriticalFamilies: 0,
      missingCriticalFamilies: 0,
      completenessPct: 100,
      familyStatuses: {
        ...state.familyStatuses,
        district_or_county_education_routing: 'verified_county_grade',
        county_local_disability_resources: 'verified_county_grade',
      },
    };
  });

  const classifications = countBy(statesV2, (row) => row.classification);
  const incorrectlyIndexSafeStates = statesV2.filter((row) => row.incorrectlyIndexSafe).map((row) => row.stateId);
  const indexSafeCount = statesV2.filter((row) => row.indexSafe).length;

  const gapsV2 = gapsV1.map((row) => {
    if (row.state !== 'texas') return row;
    if (row.family === 'district_or_county_education_routing' || row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        status_reason: 'Texas v10 completed all 254 counties with direct district-grade education and county-local routing evidence.',
      };
    }
    return row;
  });

  const failuresV2 = failuresV1.filter((row) => row.state !== 'texas');
  const nextV2 = nextV1.map((row) => row.state !== 'texas'
    ? row
    : {
        ...row,
        classification: 'COMPLETE',
        next_lane: 'maintain_truth_audit_only',
        primary_gap_reason: 'none',
        missing_critical_families: 0,
        strong_critical_families: texasState.totalCriticalFamilies,
      });
  const priorityV2 = priorityV1.map((row) => row.state !== 'texas'
    ? row
    : {
        ...row,
        classification: 'COMPLETE',
        index_safe: true,
        completeness_pct: 100,
        risk_score: 0,
        fast_completion_score: 0,
        priority_score: 0,
        missing_critical_families: 0,
        weak_critical_families: 0,
        primary_gap_reason: 'none',
        recommended_batch: 'complete_maintain',
      });

  const auditV2 = {
    ...auditV1,
    generatedAt: new Date().toISOString(),
    states: statesV2,
    classifications,
    incorrectlyIndexSafeStates,
    indexSafeCount,
    lessonsUpdate: 'Added Texas v10 parent-resource routing rule and confirmed Texas is California-grade complete and index-safe.',
  };

  const reportV2 = [
    '# All-State California-Grade Audit Report v2',
    '',
    'This v2 audit is a narrow regeneration from the v1 framework after Texas v10 completed its final three county repairs.',
    '',
    '## Texas update',
    '',
    `- Texas v10 PASS/PARTIAL/BLOCKED: ${txV10.v10.pass_counties}/${txV10.v10.partial_counties}/${txV10.v10.blocked_counties}`,
    '- Texas classification in v2: COMPLETE',
    '- Texas index-safe in v2: true',
    '',
    '## All-state counts',
    '',
    ...Object.entries(classifications).map(([label, count]) => `- ${label}: ${count}`),
    '',
    `- index-safe states: ${indexSafeCount}`,
    `- incorrectly index-safe states remaining: ${incorrectlyIndexSafeStates.join(', ') || 'none'}`,
    '',
    '## Notes',
    '',
    '- This v2 pass only updates Texas and preserves the rest of the v1 all-state framework unchanged.',
    '- No other state was promoted in this pass.',
  ].join('\n');

  const planV2 = [
    '# All-State Priority Plan v2',
    '',
    'Texas moved out of the fast-finish queue after v10 completed 254/0/0.',
    '',
    '## Remaining priority posture',
    '',
    '- Keep using county-count and critical-family gaps as the repo-available search-value proxy.',
    '- Focus future repair on non-complete states only.',
  ].join('\n');

  return { auditV2, gapsV2, failuresV2, nextV2, priorityV2, reportV2, planV2 };
}

export function generateAllStateCaliforniaGradeAuditV2() {
  const result = buildV2Artifacts();
  writeJson(OUTPUTS.auditV2, result.auditV2);
  writeJsonl(OUTPUTS.gapV2, result.gapsV2);
  writeJsonl(OUTPUTS.failureV2, result.failuresV2);
  writeJsonl(OUTPUTS.nextV2, result.nextV2);
  writeJsonl(OUTPUTS.priorityV2, result.priorityV2);
  fs.writeFileSync(OUTPUTS.reportV2, `${result.reportV2}\n`);
  fs.writeFileSync(OUTPUTS.planV2, `${result.planV2}\n`);
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateAllStateCaliforniaGradeAuditV2();
  console.log(JSON.stringify({
    ok: true,
    texas: result.auditV2.states.find((row) => row.stateId === 'texas'),
    classifications: result.auditV2.classifications,
    indexSafeCount: result.auditV2.indexSafeCount,
  }, null, 2));
}
