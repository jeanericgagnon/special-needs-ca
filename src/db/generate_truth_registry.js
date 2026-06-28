import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const generatedDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const outJsonPath = path.join(generatedDir, `truth-registry-${generatedDate}.json`);
const outMdPath = path.join(generatedDir, `truth-registry-${generatedDate}.md`);

function findLatestGeneratedJson(prefix) {
  const entries = fs.readdirSync(generatedDir)
    .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
    .sort();

  if (entries.length === 0) {
    throw new Error(`Missing generated artifact for prefix: ${prefix}`);
  }

  return path.join(generatedDir, entries[entries.length - 1]);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function toPercent(value) {
  return typeof value === 'number' ? Math.round(value * 10) / 10 : 0;
}

function buildStateRegistryRow(state, rolloutByStateId, advocateCleanupByStateId, launchAuditByStateId, priorityQueueByStateId) {
  const rollout = rolloutByStateId.get(state.id) || null;
  const advocateCleanup = advocateCleanupByStateId.get(state.id) || null;
  const launchAudit = launchAuditByStateId.get(state.id) || null;
  const priorityQueue = priorityQueueByStateId.get(state.id) || null;

  const launchClassification = launchAudit?.classification || priorityQueue?.classification || 'UNKNOWN';
  const launchIndexSafe = typeof launchAudit?.indexSafe === 'boolean'
    ? launchAudit.indexSafe
    : Boolean(priorityQueue?.index_safe);
  const launchComplete = launchClassification === 'COMPLETE' && launchIndexSafe;

  const basePublicSafe = launchComplete || Boolean(state.verdict?.publicSafe);
  const baseIndexSafe = launchIndexSafe;
  const baseGoldEligible = Boolean(state.verdict?.goldEligible);

  const countyDiagnosisMissing = rollout?.missingPriorityCount || 0;
  const countyDiagnosisReadyNow = rollout?.promotionReadyPriorityCount || 0;
  const advocateCoverageLossCount = advocateCleanup?.countiesLosingAllAdvocateCoverage || 0;
  const quarantinedAdvocates = advocateCleanup?.quarantinedAdvocates || 0;
  const syntheticAdvocates = advocateCleanup?.syntheticPatternAdvocates || 0;

  const blockers = [];

  for (const blocker of state.verdict?.blockers || []) {
    blockers.push({
      id: blocker.id || 'current-truth-blocker',
      message: blocker.message || String(blocker),
      source: 'current-truth',
    });
  }

  if (countyDiagnosisMissing > 0) {
    blockers.push({
      id: 'county-diagnosis-priority-gap',
      message: `${countyDiagnosisMissing} priority county-diagnosis pages still missing from the high-fidelity rollout.`,
      source: 'county-diagnosis-rollout',
    });
  }

  if (advocateCoverageLossCount > 0) {
    blockers.push({
      id: 'advocate-truth-gap',
      message: `${advocateCoverageLossCount} counties lose all advocate coverage after truth gating.`,
      source: 'advocate-truth-cleanup',
    });
  }

  const strictGoldEligible =
    baseGoldEligible &&
    countyDiagnosisMissing === 0 &&
    advocateCoverageLossCount === 0;

  const status = strictGoldEligible
    ? 'gold'
    : launchComplete
      ? 'public_safe_but_blocked'
      : 'blocked';

  return {
    id: state.id,
    name: state.name,
    code: state.code,
    launchClassification,
    status,
    publicSafe: basePublicSafe,
    indexSafe: baseIndexSafe,
    legacyGoldEligible: baseGoldEligible,
    strictGoldEligible,
    readiness: toPercent(state.scores?.compositeReadiness),
    countyDiagnosis: {
      priorityCoveragePct: toPercent(state.countyDiagnosis?.priorityCoveragePct),
      missingPriorityCounties: countyDiagnosisMissing,
      promotionReadyPriorityCounties: countyDiagnosisReadyNow,
    },
    advocateTruth: {
      countiesLosingCoverage: advocateCoverageLossCount,
      quarantinedAdvocates,
      syntheticAdvocates,
      publicSafeAdvocates: advocateCleanup?.publicSafeAdvocates || 0,
    },
    coverage: {
      ddRouting: toPercent(state.coverage?.ddRouting),
      localOffices: toPercent(state.coverage?.localOffices),
      education: toPercent(state.coverage?.education),
      nonprofits: toPercent(state.coverage?.nonprofits),
      advocates: toPercent(state.coverage?.advocates),
      waitlists: toPercent(state.coverage?.waitlists),
    },
    blockers,
  };
}

function renderMarkdown(report) {
  const lines = [];
  lines.push('# Truth Registry');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Strict gold states: ${report.summary.strictGoldStates}`);
  lines.push(`- Public-safe but still blocked states: ${report.summary.publicSafeButBlockedStates}`);
  lines.push(`- Blocked states: ${report.summary.blockedStates}`);
  lines.push(`- Legacy current-truth gold states: ${report.summary.legacyGoldStates}`);
  lines.push(`- Registry mismatch count: ${report.summary.registryMismatchStates}`);
  lines.push('');
  lines.push('## Why The Registry Exists');
  lines.push('');
  lines.push('- It reconciles the broad current-truth verdict with stricter rollout and advocate-truth blockers.');
  lines.push('- A state is strict gold here only if it is public-safe, index-safe, has no priority county-diagnosis rollout gap, and has no advocate truth-collapse after gating.');
  lines.push('');
  lines.push('## State Ledger');
  lines.push('');
  lines.push('| State | Status | Public Safe | Index Safe | Strict Gold | Legacy Gold | Readiness | County-Diagnosis Missing | Advocate Coverage Loss | Top Blocker |');
  lines.push('| --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- |');
  report.states.forEach((state) => {
    lines.push(`| ${state.name} | ${state.status} | ${state.publicSafe ? 'yes' : 'no'} | ${state.indexSafe ? 'yes' : 'no'} | ${state.strictGoldEligible ? 'yes' : 'no'} | ${state.legacyGoldEligible ? 'yes' : 'no'} | ${state.readiness}% | ${state.countyDiagnosis.missingPriorityCounties} | ${state.advocateTruth.countiesLosingCoverage} | ${state.blockers[0]?.message || 'none'} |`);
  });
  lines.push('');
  lines.push('## Registry Mismatches');
  lines.push('');
  const mismatches = report.states.filter((state) => state.legacyGoldEligible !== state.strictGoldEligible);
  if (mismatches.length === 0) {
    lines.push('- None');
  } else {
    mismatches.forEach((state) => {
      lines.push(`- ${state.name}: legacy gold = ${state.legacyGoldEligible ? 'yes' : 'no'}, strict gold = ${state.strictGoldEligible ? 'yes' : 'no'}; blockers -> ${state.blockers.map((blocker) => blocker.id).join(', ') || 'none'}`);
    });
  }
  lines.push('');
  lines.push('## Top Public-Safe Blocked States');
  lines.push('');
  report.topBlockedStates.forEach((state) => {
    lines.push(`- ${state.name}: ${state.readiness}% readiness, ${state.countyDiagnosis.missingPriorityCounties} priority county-diagnosis gaps, ${state.advocateTruth.countiesLosingCoverage} advocate coverage-loss counties.`);
  });
  lines.push('');
  return `${lines.join('\n')}\n`;
}

const currentTruthPath = findLatestGeneratedJson('current-truth-audit-');
const countyDiagnosisRolloutPath = findLatestGeneratedJson('county-diagnosis-rollout-');
const advocateTruthCleanupPath = findLatestGeneratedJson('advocate-truth-cleanup-audit-');
const launchAuditPath = path.join(repoRoot, 'data', 'generated', 'all_state_california_grade_audit_v3.json');
const priorityQueuePath = path.join(repoRoot, 'data', 'generated', 'all_state_priority_queue_v3.jsonl');

const currentTruth = readJson(currentTruthPath);
const countyDiagnosisRollout = readJson(countyDiagnosisRolloutPath);
const advocateTruthCleanup = readJson(advocateTruthCleanupPath);
const launchAudit = readJson(launchAuditPath);
const priorityQueue = readJsonl(priorityQueuePath);

const rolloutByStateId = new Map((countyDiagnosisRollout.states || []).map((state) => [state.id, state]));
const advocateCleanupByStateId = new Map((advocateTruthCleanup.states || []).map((state) => [state.stateId, state]));
const launchAuditByStateId = new Map((launchAudit.states || []).map((state) => [state.stateId, state]));
const priorityQueueByStateId = new Map((priorityQueue || []).map((state) => [state.state, state]));

const states = (currentTruth.states || [])
  .map((state) => buildStateRegistryRow(
    state,
    rolloutByStateId,
    advocateCleanupByStateId,
    launchAuditByStateId,
    priorityQueueByStateId,
  ))
  .sort((a, b) => {
    if (a.strictGoldEligible !== b.strictGoldEligible) return Number(b.strictGoldEligible) - Number(a.strictGoldEligible);
    if (a.indexSafe !== b.indexSafe) return Number(b.indexSafe) - Number(a.indexSafe);
    return b.readiness - a.readiness;
  });

const report = {
  generatedAt: generatedDate,
  sources: {
    currentTruth: path.relative(repoRoot, currentTruthPath),
    countyDiagnosisRollout: path.relative(repoRoot, countyDiagnosisRolloutPath),
    advocateTruthCleanup: path.relative(repoRoot, advocateTruthCleanupPath),
    launchAudit: path.relative(repoRoot, launchAuditPath),
    priorityQueue: path.relative(repoRoot, priorityQueuePath),
  },
  summary: {
    strictGoldStates: states.filter((state) => state.strictGoldEligible).length,
    publicSafeButBlockedStates: states.filter((state) => state.status === 'public_safe_but_blocked').length,
    blockedStates: states.filter((state) => state.status === 'blocked').length,
    legacyGoldStates: states.filter((state) => state.legacyGoldEligible).length,
    registryMismatchStates: states.filter((state) => state.legacyGoldEligible !== state.strictGoldEligible).length,
  },
  topBlockedStates: states
    .filter((state) => state.status === 'public_safe_but_blocked')
    .slice(0, 15),
  states,
};

fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(outJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(outMdPath, renderMarkdown(report), 'utf8');

console.log(`Wrote ${path.relative(repoRoot, outJsonPath)}`);
console.log(`Wrote ${path.relative(repoRoot, outMdPath)}`);
