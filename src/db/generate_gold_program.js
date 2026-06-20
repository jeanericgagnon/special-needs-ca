import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const generatedDir = path.join(repoRoot, 'docs/generated');
const auditJsonPath = path.join(generatedDir, 'current-truth-audit-2026-06-16.json');
const truthRegistryJsonPath = path.join(generatedDir, 'truth-registry-2026-06-16.json');
const outJsonPath = path.join(generatedDir, 'gold-program-2026-06-16.json');
const outMdPath = path.join(generatedDir, 'gold-program-2026-06-16.md');

const GENERATED_AT = '2026-06-16';

const blockerStrategies = [
  {
    id: 'missing-waitlists',
    label: 'Missing Core Waitlists',
    categories: ['waitlists'],
    test: (state) => state.waitlists?.missing?.length > 0,
    workType: 'config-and-db',
    automationLeverage: 100,
    manualReview: 'none',
    action: 'Fill state-config-defined waitlists in batch before any local enrichment.',
  },
  {
    id: 'dd-null-trust',
    label: 'DD Routing Null Trust Metadata',
    categories: ['trustMetadata'],
    test: (state) => state.records?.ddRouting?.null_status > 0,
    workType: 'trust-normalization',
    automationLeverage: 95,
    manualReview: 'none',
    action: 'Backfill null DD verification_status and data_origin fields with source-backed normalization.',
  },
  {
    id: 'office-coverage',
    label: 'Incomplete Office Coverage',
    categories: ['localOffices'],
    test: (state) => (state.coverage?.localOffices || 0) < 100,
    workType: 'crawler-promotion',
    automationLeverage: 92,
    manualReview: 'low',
    action: 'Batch-promote Medicaid/HHS office layers by state office structure and county coverage gaps.',
  },
  {
    id: 'education-coverage',
    label: 'Incomplete Education Coverage',
    categories: ['education'],
    test: (state) => (state.coverage?.education || 0) < 100,
    workType: 'crawler-promotion',
    automationLeverage: 88,
    manualReview: 'low',
    action: 'Fill missing district or regional education coverage through state education directory extraction.',
  },
  {
    id: 'dd-source-listed',
    label: 'DD Routing Still Source-Listed',
    categories: ['ddRouting'],
    test: (state) => (state.records?.ddRouting?.source_listed || 0) > 0,
    workType: 'trust-promotion',
    automationLeverage: 85,
    manualReview: 'low',
    action: 'Promote DD routing trust from source_listed toward verified using official agency sources.',
  },
  {
    id: 'dd-manual-review',
    label: 'DD Routing Still Manual Review',
    categories: ['ddRouting'],
    test: (state) => (state.records?.ddRouting?.manual_review_required || 0) > 0 || (state.records?.ddRouting?.unverified || 0) > 0,
    workType: 'trust-normalization',
    automationLeverage: 84,
    manualReview: 'medium',
    action: 'Replace or normalize DD routing rows that still require manual review before a state can be gold.',
  },
  {
    id: 'office-source-listed',
    label: 'Office Layer Still Source-Listed',
    categories: ['localOffices'],
    test: (state) => (state.records?.localOffices?.source_listed || 0) > 0,
    workType: 'trust-promotion',
    automationLeverage: 82,
    manualReview: 'low',
    action: 'Raise office trust depth only after coverage is complete and public-safe.',
  },
  {
    id: 'office-manual-review',
    label: 'Office Layer Still Manual Review',
    categories: ['localOffices'],
    test: (state) => (state.records?.localOffices?.manual_review_required || 0) > 0 || (state.records?.localOffices?.unverified || 0) > 0,
    workType: 'trust-normalization',
    automationLeverage: 80,
    manualReview: 'medium',
    action: 'Hide, replace, or confirm office rows that still require manual review before gold promotion.',
  },
  {
    id: 'education-source-listed',
    label: 'Education Layer Still Source-Listed',
    categories: ['education'],
    test: (state) => (state.records?.education?.source_listed || 0) > 0,
    workType: 'trust-promotion',
    automationLeverage: 78,
    manualReview: 'medium',
    action: 'Upgrade education rows from source_listed to verified with district-level contact validation.',
  },
  {
    id: 'education-manual-review',
    label: 'Education Layer Still Manual Review',
    categories: ['education'],
    test: (state) => (state.records?.education?.manual_review_required || 0) > 0 || (state.records?.education?.unverified || 0) > 0,
    workType: 'contact-validation',
    automationLeverage: 74,
    manualReview: 'medium',
    action: 'Fill or validate district and regional education contacts that still require manual review.',
  },
  {
    id: 'nonprofit-source-listed',
    label: 'Nonprofit Layer Still Source-Listed',
    categories: ['nonprofits'],
    test: (state) => (state.records?.nonprofits?.source_listed || 0) > 0,
    workType: 'legitimacy-review',
    automationLeverage: 60,
    manualReview: 'medium',
    action: 'Keep only useful local nonprofits and generate legitimacy review queues for ambiguous orgs.',
  },
  {
    id: 'nonprofit-manual-review',
    label: 'Nonprofit Layer Still Manual Review',
    categories: ['nonprofits'],
    test: (state) => (state.records?.nonprofits?.manual_review_required || 0) > 0 || (state.records?.nonprofits?.unverified || 0) > 0,
    workType: 'legitimacy-review',
    automationLeverage: 58,
    manualReview: 'high',
    action: 'Hide or review nonprofit rows that still lack enough trust to support gold output.',
  },
  {
    id: 'advocate-source-listed',
    label: 'Advocate Layer Still Source-Listed',
    categories: ['advocates'],
    test: (state) => (state.records?.advocates?.source_listed || 0) > 0,
    workType: 'trust-normalization',
    automationLeverage: 72,
    manualReview: 'medium',
    action: 'Demote synthetic advocate/provider rows and promote only source-backed public advocates with direct contact signal.',
  },
  {
    id: 'advocate-manual-review',
    label: 'Advocate Layer Still Manual Review',
    categories: ['advocates'],
    test: (state) => (state.records?.advocates?.manual_review_required || 0) > 0 || (state.records?.advocates?.unverified || 0) > 0,
    workType: 'credential-validation',
    automationLeverage: 68,
    manualReview: 'medium',
    action: 'Keep advocate/provider rows hidden until a real source, direct contact, and credential signal support public use.',
  },
  {
    id: 'county-diagnosis-priority-gap',
    label: 'Priority County-Diagnosis Rollout Gap',
    categories: ['countyDiagnosis'],
    test: (state) => (state.registryCountyDiagnosisMissingPriorityCounties || 0) > 0,
    workType: 'seo-promotion',
    automationLeverage: 76,
    manualReview: 'low',
    action: 'Promote the remaining state-config priority county-diagnosis pages that already satisfy the truth-first bar.',
  },
  {
    id: 'advocate-truth-gap',
    label: 'Advocate Truth Coverage Gap',
    categories: ['advocates', 'publicTruth'],
    test: (state) => (state.registryAdvocateCoverageLossCounties || 0) > 0,
    workType: 'source-replacement',
    automationLeverage: 70,
    manualReview: 'medium',
    action: 'Replace quarantined advocate coverage with real source-backed local advocates before public gold promotion.',
  },
];

function loadAudit() {
  return JSON.parse(fs.readFileSync(auditJsonPath, 'utf8'));
}

function loadTruthRegistry() {
  return JSON.parse(fs.readFileSync(truthRegistryJsonPath, 'utf8'));
}

function summarizeState(state) {
  const registryState = truthRegistryById.get(state.id);
  const registryBlockerIds = (registryState?.blockers || []).map((blocker) => blocker.id);
  const summaryState = {
    ...state,
    registryCountyDiagnosisMissingPriorityCounties: registryState?.countyDiagnosis?.missingPriorityCounties || 0,
    registryAdvocateCoverageLossCounties: registryState?.advocateTruth?.countiesLosingCoverage || 0,
  };
  const blockerIds = blockerStrategies
    .filter((strategy) => strategy.test(summaryState))
    .map((strategy) => strategy.id);
  return {
    id: state.id,
    name: state.name,
    publicSafe: registryState?.publicSafe ?? state.verdict.publicSafe,
    indexSafe: registryState?.indexSafe ?? state.verdict.indexSafe,
    goldEligible: registryState?.strictGoldEligible ?? state.verdict.goldEligible,
    legacyGoldEligible: registryState?.legacyGoldEligible ?? state.verdict.goldEligible,
    registryStatus: registryState?.status || 'unknown',
    registryBlockerIds,
    registryCountyDiagnosisMissingPriorityCounties: summaryState.registryCountyDiagnosisMissingPriorityCounties,
    registryAdvocateCoverageLossCounties: summaryState.registryAdvocateCoverageLossCounties,
    waitlists: state.waitlists,
    records: state.records,
    coverage: state.coverage,
    blockerIds,
    blockerCount: blockerIds.length,
    readiness: state.scores.compositeReadiness,
  };
}

function buildFamilySummaries(states) {
  return blockerStrategies.map((strategy) => {
    const impactedStates = states.filter((state) => strategy.test(state));
    return {
      id: strategy.id,
      label: strategy.label,
      categories: strategy.categories,
      workType: strategy.workType,
      automationLeverage: strategy.automationLeverage,
      manualReview: strategy.manualReview,
      action: strategy.action,
      stateCount: impactedStates.length,
      states: impactedStates.map((state) => state.id),
    };
  }).sort((a, b) => {
    if (b.automationLeverage !== a.automationLeverage) return b.automationLeverage - a.automationLeverage;
    return b.stateCount - a.stateCount;
  });
}

function buildWaves(states, families) {
  const activeStates = states.filter((state) => !state.goldEligible);
  const readyForDepth = activeStates
    .filter((state) => state.publicSafe && state.indexSafe)
    .sort((a, b) => b.readiness - a.readiness);

  return [
    {
      id: 'wave-0',
      label: 'Global Preconditions',
      focus: 'Run the shared, highest-leverage fixes that unblock many states at once.',
      stateIds: [],
      familyIds: families.filter((family) => ['missing-waitlists', 'dd-null-trust'].includes(family.id)).map((family) => family.id),
    },
    {
      id: 'wave-1',
      label: 'Coverage Completion Wave',
      focus: 'Finish office and education county coverage before deeper trust promotions.',
      stateIds: activeStates
        .filter((state) => state.blockerIds.includes('office-coverage') || state.blockerIds.includes('education-coverage'))
        .map((state) => state.id),
      familyIds: ['office-coverage', 'education-coverage'],
    },
    {
      id: 'wave-2',
      label: 'High-Readiness Depth Wave',
      focus: 'Push the most advanced public-safe states to gold with the fewest extra tokens.',
      stateIds: readyForDepth.slice(0, 12).map((state) => state.id),
      familyIds: ['dd-source-listed', 'dd-manual-review', 'office-source-listed', 'office-manual-review', 'education-source-listed', 'education-manual-review', 'nonprofit-source-listed', 'nonprofit-manual-review', 'advocate-source-listed', 'advocate-manual-review', 'county-diagnosis-priority-gap', 'advocate-truth-gap'],
    },
    {
      id: 'wave-3',
      label: 'Remaining Depth Wave',
      focus: 'Apply the same trust-depth and nonprofit legitimacy playbook to the rest once coverage is done.',
      stateIds: readyForDepth.slice(12).map((state) => state.id),
      familyIds: ['dd-source-listed', 'dd-manual-review', 'office-source-listed', 'office-manual-review', 'education-source-listed', 'education-manual-review', 'nonprofit-source-listed', 'nonprofit-manual-review', 'advocate-source-listed', 'advocate-manual-review', 'county-diagnosis-priority-gap', 'advocate-truth-gap'],
    },
  ];
}

function renderMarkdown(report) {
  const lines = [];
  lines.push('# Gold Program Queue');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Minimum-Token Strategy');
  lines.push('');
  lines.push('- Fix blocker families in descending automation leverage, not state by state.');
  lines.push('- Promote coverage before trust depth, and trust depth before nonprofit legitimacy work.');
  lines.push('- Reserve manual review for ambiguous nonprofits, advocates, and education contacts only after public-safe coverage exists.');
  lines.push('');
  lines.push('## Global Status');
  lines.push('');
  lines.push(`- Gold states now: ${report.summary.goldStates}`);
  lines.push(`- Public-safe states now: ${report.summary.publicSafeStates}`);
  lines.push(`- Index-safe states now: ${report.summary.indexSafeStates}`);
  lines.push(`- States still blocked from gold: ${report.summary.blockedStates}`);
  lines.push(`- Legacy-gold / strict-gold mismatches: ${report.summary.registryMismatchStates}`);
  lines.push('');
  lines.push('## Blocker Families');
  lines.push('');
  lines.push('| Family | States | Automation Leverage | Manual Review | Recommended Action |');
  lines.push('| --- | ---: | ---: | --- | --- |');
  report.families.forEach((family) => {
    lines.push(`| ${family.label} | ${family.stateCount} | ${family.automationLeverage} | ${family.manualReview} | ${family.action} |`);
  });
  lines.push('');
  lines.push('## Waves');
  lines.push('');
  report.waves.forEach((wave) => {
    lines.push(`### ${wave.label}`);
    lines.push('');
    lines.push(`- Focus: ${wave.focus}`);
    lines.push(`- Blocker families: ${wave.familyIds.join(', ') || 'none'}`);
    lines.push(`- States: ${wave.stateIds.join(', ') || 'global only'}`);
    lines.push('');
  });
  lines.push('## Top Cheapest Near-Gold States');
  lines.push('');
  lines.push('| State | Readiness | Registry Status | Blocker Count | Blockers |');
  lines.push('| --- | ---: | --- | ---: | --- |');
  report.priorityStates.forEach((state) => {
    lines.push(`| ${state.name} | ${state.readiness}% | ${state.registryStatus} | ${state.blockerCount} | ${state.blockerIds.join(', ') || 'none'} |`);
  });
  lines.push('');
  return `${lines.join('\n')}\n`;
}

const audit = loadAudit();
const truthRegistry = loadTruthRegistry();
const truthRegistryById = new Map((truthRegistry.states || []).map((state) => [state.id, state]));
const states = audit.states.map(summarizeState);
const families = buildFamilySummaries(states);
const waves = buildWaves(states, families);
const priorityStates = states
  .filter((state) => state.publicSafe && state.indexSafe && !state.goldEligible)
  .sort((a, b) => {
    if (a.blockerCount !== b.blockerCount) return a.blockerCount - b.blockerCount;
    return b.readiness - a.readiness;
  })
  .slice(0, 15);

const report = {
  generatedAt: GENERATED_AT,
  summary: {
    goldStates: states.filter((state) => state.goldEligible).length,
    publicSafeStates: states.filter((state) => state.publicSafe).length,
    indexSafeStates: states.filter((state) => state.indexSafe).length,
    blockedStates: states.filter((state) => !state.goldEligible).length,
    registryMismatchStates: states.filter((state) => state.legacyGoldEligible !== state.goldEligible).length,
  },
  families,
  waves,
  priorityStates,
};

fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(outJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(outMdPath, renderMarkdown(report), 'utf8');

console.log(`Wrote ${path.relative(repoRoot, outJsonPath)}`);
console.log(`Wrote ${path.relative(repoRoot, outMdPath)}`);
