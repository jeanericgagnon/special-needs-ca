import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const fullGapPath = path.join(docsDir, `full-information-gap-audit-${generatedDate}.json`);
const completenessPath = path.join(docsDir, `information-completeness-audit-${generatedDate}.json`);
const confidencePath = path.join(docsDir, `information-confidence-audit-${generatedDate}.json`);
const providerPlanPath = path.join(docsDir, `provider-buildout-priority-plan-${generatedDate}.json`);
const goldPlanPath = path.join(docsDir, `gold-program-${generatedDate}.json`);

const jsonOutPath = path.join(docsDir, `minimum-token-execution-plan-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `minimum-token-execution-plan-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const fullGap = readJson(fullGapPath);
const completeness = readJson(completenessPath);
const confidence = readJson(confidencePath);
const providerPlan = readJson(providerPlanPath);
const goldPlan = readJson(goldPlanPath);

function findLayer(id) {
  return fullGap.layers.find((layer) => layer.id === id);
}

const waveA = providerPlan.lanes.zeroRowByWave.find((wave) => wave.waveId === 'Wave A')?.entries || [];
const waveB = providerPlan.lanes.zeroRowByWave.find((wave) => wave.waveId === 'Wave B')?.entries || [];
const remediation = providerPlan.lanes.remediation || [];
const sustain = providerPlan.lanes.sustain || [];

const workstreams = [
  {
    id: 'provider-wave-a',
    label: 'Provider Wave A expansion',
    whyNow: 'This is the single biggest visible information gap and the best leverage path because three states are otherwise already green in the stricter info audits.',
    tokenEfficiency: 'high',
    automationFit: 'high',
    states: waveA.map((entry) => entry.stateName),
    blockersCleared: ['no_public_safe_provider_layer_detected'],
    evidence: [
      `${completeness.summary.statesMissingPublicSafeProviderLayer} states still lack any public-safe provider layer.`,
      `${waveA.length} Wave A states already sit at 88.9 info completeness and 91.7 confidence with provider as the only blocker family.`,
      `${fullGap.metrics.resourceProviders} checked-in provider rows exist across only ${fullGap.stateCoverage.resourceProviders}/${fullGap.metrics.states} states.`,
    ],
    cheapestWhy: 'It reuses the existing state-upgrade pipeline and source-target structure without reopening the much larger program, office, or nonprofit layers.',
    concreteSteps: [
      'Seed a minimal truthful provider set in Ohio, Georgia, and North Carolina from existing official institutional targets already present in the repo.',
      'Promote only hospital or university developmental clinic rows that already meet source-url, contact-signal, and trust requirements.',
      'Re-run provider truth, info completeness, and info confidence audits after each state.',
    ],
  },
  {
    id: 'california-advocate-remediation',
    label: 'California advocate truth remediation',
    whyNow: 'California is the only strict-gold blocker and still masks the true local-directory story if left unresolved.',
    tokenEfficiency: 'high',
    automationFit: 'medium',
    states: remediation.map((entry) => entry.stateName),
    blockersCleared: ['advocate_truth_gap', 'no_public_safe_advocate_layer_detected'],
    evidence: [
      `${goldPlan.summary?.blockedStates || goldPlan.globalStatus?.blockedStates || 1} state remains blocked from strict gold.`,
      `${completeness.summary.advocateTruthSnapshot.countiesLosingAllAdvocateCoverageAfterTruthGating} California counties lose all advocate coverage after truth gating.`,
      `${completeness.summary.advocateTruthSnapshot.totalSyntheticPatternRows} synthetic-pattern advocate rows were quarantined.`,
    ],
    cheapestWhy: 'It focuses on the only strict-gold blocker instead of broad national enrichment.',
    concreteSteps: [
      'Replace quarantined California advocate coverage with real source-backed advocates before adding any synthetic-looking fallback.',
      'Keep provider expansion separate so California does not appear healthier than it is while advocate truth remains broken.',
    ],
  },
  {
    id: 'provider-wave-b',
    label: 'Provider Wave B expansion',
    whyNow: 'Once Wave A proves the seed pattern, the next five states give the fastest additional national lift.',
    tokenEfficiency: 'high',
    automationFit: 'high',
    states: waveB.map((entry) => entry.stateName),
    blockersCleared: ['no_public_safe_provider_layer_detected'],
    evidence: [
      `${waveB.length} states are already grouped as the next zero-row provider wave in the checked-in provider plan.`,
      `${providerPlan.summary.zeroRowStates} states still have zero provider rows.`,
    ],
    cheapestWhy: 'It extends the same proven provider ingestion pattern rather than inventing a second enrichment strategy.',
    concreteSteps: [
      'Reuse the Wave A promotion pattern for Michigan, New Jersey, Virginia, Washington, and Massachusetts.',
      'Prefer one to three official institutional clinics per state before broader provider expansion.',
    ],
  },
  {
    id: 'reference-table-seeding',
    label: 'Reference table seeding for age bands and insurance types',
    whyNow: 'These are modeled but empty, and filling them is low-risk, cheap, and closes obvious schema-to-data gaps.',
    tokenEfficiency: 'high',
    automationFit: 'high',
    states: [],
    blockersCleared: ['empty_reference_tables'],
    evidence: [
      `${fullGap.metrics.ageBands} age bands in checked-in DB.`,
      `${fullGap.metrics.insuranceTypes} insurance types in checked-in DB.`,
    ],
    cheapestWhy: 'This is tiny controlled data with no public-truth ambiguity.',
    concreteSteps: [
      'Seed canonical age bands and insurance types from the schema comments and existing product vocabulary.',
      'Add an audit check so these reference tables cannot regress back to empty.',
    ],
  },
  {
    id: 'knowledge-depth-expansion',
    label: 'Knowledge article depth expansion',
    whyNow: 'Knowledge content is one of the clearest “we do not yet have all info” gaps after providers.',
    tokenEfficiency: 'medium',
    automationFit: 'medium',
    states: [],
    blockersCleared: ['thin_knowledge_content'],
    evidence: [
      `${fullGap.metrics.knowledgeArticles} knowledge articles exist today.`,
      `${findLayer('knowledge_content')?.status || 'partial'} status in the strict full-information audit.`,
    ],
    cheapestWhy: 'Content can be expanded around existing diagnosis, waiver, school, and transition journeys without changing the core data model.',
    concreteSteps: [
      'Add article plans by journey cluster: diagnosis basics, school rights, waiver entry, respite, transition, appeals.',
      'Only publish article pages that are backed by existing structured program and source data.',
    ],
  },
  {
    id: 'normalization-backfill',
    label: 'Normalization backfill',
    whyNow: 'This matters for long-term architecture, but it is not the cheapest near-term move for public information depth.',
    tokenEfficiency: 'low',
    automationFit: 'medium',
    states: [],
    blockersCleared: ['modeled_only_normalization'],
    evidence: [
      `${fullGap.metrics.organizations} organizations`,
      `${fullGap.metrics.organizationProgramLinks} organization-program links`,
      `${fullGap.metrics.serviceLocations} service locations`,
      `${fullGap.metrics.officeLocations} office locations`,
      `${fullGap.metrics.virtualServiceAreas} virtual service areas`,
    ],
    cheapestWhy: 'This is deliberately deferred because it has architectural value but limited immediate public-surface payoff compared with provider depth.',
    concreteSteps: [
      'Backfill normalization tables only from rows that already have trustworthy organization, program, and location identity.',
      'Do not force a migration of the public renderer before the normalized tables hold real data.',
    ],
  },
];

const executionOrder = workstreams.map((stream, index) => ({
  rank: index + 1,
  id: stream.id,
  label: stream.label,
  tokenEfficiency: stream.tokenEfficiency,
  automationFit: stream.automationFit,
}));

const payload = {
  generatedAt: generatedDate,
  sources: {
    fullInformationGap: path.relative(repoRoot, fullGapPath),
    informationCompleteness: path.relative(repoRoot, completenessPath),
    informationConfidence: path.relative(repoRoot, confidencePath),
    providerBuildout: path.relative(repoRoot, providerPlanPath),
    goldProgram: path.relative(repoRoot, goldPlanPath),
  },
  summary: {
    objective: 'Reach all-info expectations with minimum token spend while staying truthful.',
    biggestGap: 'public-safe provider coverage',
    providerMissingStates: completeness.summary.statesMissingPublicSafeProviderLayer,
    strictGoldBlockedStates: goldPlan.summary?.blockedStates || 1,
    substantialLayers: fullGap.summary.substantial,
    partialLayers: fullGap.summary.partial,
    modeledOnlyLayers: fullGap.summary.modeledOnly,
    demoOnlyLayers: fullGap.summary.demoOnly,
  },
  principles: [
    'Use one repeatable promotion pattern per blocker family before touching the next family.',
    'Prefer work that unlocks multiple states with one extraction or promotion rule.',
    'Do not spend tokens deepening layers that are already broad while provider coverage is still near-empty nationally.',
    'Fill small controlled reference tables immediately when they are schema-modeled but empty.',
    'Defer architecture-heavy backfills until they improve truthful public output, not just internal elegance.',
  ],
  executionOrder,
  workstreams,
  stopDoing: [
    'Do not treat truth-safe or structurally complete as proof that all information depth already exists.',
    'Do not spend human review on low-value ambiguous listings before the provider layer exists in the target state.',
    'Do not backfill normalization tables with guessed org or location joins.',
  ],
};

const mdLines = [
  '# Minimum-Token Execution Plan',
  '',
  `Generated: ${generatedDate}`,
  '',
  '## Goal',
  '',
  '- Reach the full information expectation as cheaply as possible in tokens without relaxing the truth-first bar.',
  '',
  '## Why This Order',
  '',
  `- Biggest current public information gap: ${payload.summary.biggestGap}.`,
  `- States still missing a public-safe provider layer: ${payload.summary.providerMissingStates}.`,
  `- Strict-gold blocked states: ${payload.summary.strictGoldBlockedStates}.`,
  `- Current strict full-information audit: ${payload.summary.substantialLayers} substantial, ${payload.summary.partialLayers} partial, ${payload.summary.modeledOnlyLayers} modeled-only, ${payload.summary.demoOnlyLayers} demo-only layers.`,
  '',
  '## Principles',
  '',
  ...payload.principles.map((line) => `- ${line}`),
  '',
  '## Execution Order',
  '',
];

for (const item of executionOrder) {
  mdLines.push(`- ${item.rank}. ${item.label} (${item.tokenEfficiency} token efficiency, ${item.automationFit} automation fit)`);
}

for (const stream of workstreams) {
  mdLines.push('', `## ${stream.label}`, '');
  mdLines.push(`- Why now: ${stream.whyNow}`);
  mdLines.push(`- Token efficiency: ${stream.tokenEfficiency}`);
  mdLines.push(`- Automation fit: ${stream.automationFit}`);
  if (stream.states.length > 0) {
    mdLines.push(`- States: ${stream.states.join(', ')}`);
  }
  if (stream.blockersCleared.length > 0) {
    mdLines.push(`- Blockers cleared: ${stream.blockersCleared.join(', ')}`);
  }
  for (const evidence of stream.evidence) {
    mdLines.push(`- Evidence: ${evidence}`);
  }
  mdLines.push(`- Cheapest why: ${stream.cheapestWhy}`);
  mdLines.push('- Concrete steps:');
  for (const step of stream.concreteSteps) {
    mdLines.push(`  - ${step}`);
  }
}

mdLines.push('', '## Stop Doing', '', ...payload.stopDoing.map((line) => `- ${line}`));

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
