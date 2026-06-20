import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const generatedDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const outJsonPath = path.join(generatedDir, `provider-buildout-priority-plan-${generatedDate}.json`);
const outMdPath = path.join(generatedDir, `provider-buildout-priority-plan-${generatedDate}.md`);
const wavePlanPath = path.join(repoRoot, 'docs', 'state-upgrade-wave-plan.md');
const readinessReportPath = path.join(repoRoot, 'docs', 'national-rollout-readiness-after-texas-florida.md');
const MIN_PUBLIC_SAFE_PROVIDER_DEPTH = 3;

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

function parseBoldStateNames(value) {
  return [...new Set([...value.matchAll(/\*\*([^*]+)\*\*/g)]
    .map((match) => match[1].trim())
    .map((name) => name.replace(/\s+\([A-Z]{2,3}\)$/, '').trim()))];
}

function parseWavePlanStateNames(content) {
  const waves = new Map();
  const regex = /###\s+Wave\s+([A-D]):[\s\S]*?\*\s+\*\*States:\*\*\s+([\s\S]*?)(?:\n>|\n\*   \*\*Rationale|\n### |\n## |\Z)/g;

  for (const match of content.matchAll(regex)) {
    const waveId = `Wave ${match[1]}`;
    waves.set(waveId, parseBoldStateNames(match[2]));
  }

  return waves;
}

function parseReadinessPriorityNames(content) {
  const rows = [];
  const regex = /\|\s+\*\*(\d+)\*\*\s+\|\s+\*\*([^|*]+)\*\*\s+\|/g;

  for (const match of content.matchAll(regex)) {
    rows.push({
      order: Number(match[1]),
      stateName: match[2].trim(),
    });
  }

  return rows.sort((a, b) => a.order - b.order);
}

function buildStateLookup(states) {
  return new Map(states.map((state) => [state.stateName, state]));
}

function toStateEntry(state, confidenceState, registryState, extra = {}) {
  return {
    stateId: state.stateId,
    stateName: state.stateName,
    countyCount: state.countyCount,
    score: state.score,
    overallConfidence: confidenceState?.overallConfidence ?? null,
    totalProviderRows: state.totalProviderRows,
    publicSafeProviders: state.publicSafeProviders,
    providerTruthScore: confidenceState?.providerTruthScore ?? 0,
    publicSafeNonprofits: state.publicSafeNonprofits,
    advocatePublicSafeCount: state.advocatePublicSafeCount,
    advocateCoverageLossCounties: state.advocateCoverageLossCounties,
    truthRegistryStatus: registryState?.status || 'unknown',
    blockers: state.blockers,
    ...extra,
  };
}

function renderStateList(entries) {
  return entries.map((entry) =>
    `- ${entry.stateName}: counties ${entry.countyCount}, nonprofits ${entry.publicSafeNonprofits}, provider rows ${entry.publicSafeProviders}/${entry.totalProviderRows}, provider truth ${entry.providerTruthScore}%, registry ${entry.truthRegistryStatus}, blockers ${entry.blockers.join(', ') || 'none'}`
  );
}

function renderWaveSection(waveId, entries) {
  const lines = [];
  lines.push(`### ${waveId}`);
  lines.push('');

  if (entries.length === 0) {
    lines.push('- no zero-row states remain in this wave');
    lines.push('');
    return lines;
  }

  lines.push(`- States in this lane: ${entries.length}`);
  lines.push(`- States: ${entries.map((entry) => entry.stateName).join(', ')}`);
  lines.push('');
  return lines;
}

const completenessPath = findLatestGeneratedJson('information-completeness-audit-');
const confidencePath = findLatestGeneratedJson('information-confidence-audit-');
const truthRegistryPath = findLatestGeneratedJson('truth-registry-');

const completeness = readJson(completenessPath);
const confidence = readJson(confidencePath);
const truthRegistry = readJson(truthRegistryPath);

const stateByName = buildStateLookup(completeness.states || []);
const confidenceByStateId = new Map((confidence.states || []).map((state) => [state.stateId, state]));
const registryByStateId = new Map((truthRegistry.states || []).map((state) => [state.id, state]));

const wavePlanContent = fs.existsSync(wavePlanPath) ? fs.readFileSync(wavePlanPath, 'utf8') : '';
const readinessReportContent = fs.existsSync(readinessReportPath) ? fs.readFileSync(readinessReportPath, 'utf8') : '';
const wavePlanStates = parseWavePlanStateNames(wavePlanContent);
const readinessPriority = parseReadinessPriorityNames(readinessReportContent);

const remediationLane = [];
const validationLane = [];
const sustainLane = [];
const zeroRowStates = [];

for (const state of completeness.states || []) {
  const confidenceState = confidenceByStateId.get(state.stateId);
  const registryState = registryByStateId.get(state.stateId);
  const entry = toStateEntry(state, confidenceState, registryState);

  if (state.advocateCoverageLossCounties > 0) {
    remediationLane.push(entry);
    continue;
  }

  if (state.totalProviderRows > 0 && state.publicSafeProviders < MIN_PUBLIC_SAFE_PROVIDER_DEPTH) {
    validationLane.push(entry);
    continue;
  }

  if (state.publicSafeProviders >= MIN_PUBLIC_SAFE_PROVIDER_DEPTH) {
    sustainLane.push(entry);
    continue;
  }

  zeroRowStates.push(entry);
}

const zeroRowByWave = [];
const assignedStateIds = new Set();

for (const [waveId, names] of wavePlanStates.entries()) {
  const entries = names
    .map((name) => stateByName.get(name))
    .filter(Boolean)
    .filter((state) => state.publicSafeProviders < MIN_PUBLIC_SAFE_PROVIDER_DEPTH && state.advocateCoverageLossCounties === 0)
    .map((state) => {
      assignedStateIds.add(state.stateId);
      return toStateEntry(state, confidenceByStateId.get(state.stateId), registryByStateId.get(state.stateId), {
        waveId,
      });
    });

  zeroRowByWave.push({
    waveId,
    entries,
  });
}

const zeroRowUnassigned = zeroRowStates
  .filter((state) => !assignedStateIds.has(state.stateId))
  .sort((a, b) => a.stateName.localeCompare(b.stateName));

const missingProviderStates = [...remediationLane, ...validationLane, ...zeroRowStates];
const missingProviderSorted = [...missingProviderStates]
  .sort((a, b) =>
    b.publicSafeNonprofits - a.publicSafeNonprofits ||
    b.countyCount - a.countyCount ||
    a.stateName.localeCompare(b.stateName)
  );

const denseZeroRowCandidates = zeroRowStates
  .filter((state) => state.publicSafeNonprofits >= 700)
  .sort((a, b) => b.publicSafeNonprofits - a.publicSafeNonprofits || a.stateName.localeCompare(b.stateName));

const compactBatchCandidates = zeroRowStates
  .filter((state) => state.countyCount <= 10)
  .sort((a, b) => a.countyCount - b.countyCount || b.publicSafeNonprofits - a.publicSafeNonprofits || a.stateName.localeCompare(b.stateName));

const largeCountyMissingStates = zeroRowStates
  .filter((state) => state.countyCount >= 50)
  .sort((a, b) => b.countyCount - a.countyCount || b.publicSafeNonprofits - a.publicSafeNonprofits || a.stateName.localeCompare(b.stateName));

const readinessZeroRowCandidates = readinessPriority
  .map((item) => stateByName.get(item.stateName))
  .filter(Boolean)
  .filter((state) => state.publicSafeProviders < MIN_PUBLIC_SAFE_PROVIDER_DEPTH)
  .map((state) => toStateEntry(state, confidenceByStateId.get(state.stateId), registryByStateId.get(state.stateId)));

remediationLane.sort((a, b) => b.advocateCoverageLossCounties - a.advocateCoverageLossCounties || a.stateName.localeCompare(b.stateName));
validationLane.sort((a, b) => a.providerTruthScore - b.providerTruthScore || a.stateName.localeCompare(b.stateName));
sustainLane.sort((a, b) => b.publicSafeProviders - a.publicSafeProviders || a.stateName.localeCompare(b.stateName));

const report = {
  generatedAt: generatedDate,
  sources: {
    informationCompleteness: path.relative(repoRoot, completenessPath),
    informationConfidence: path.relative(repoRoot, confidencePath),
    truthRegistry: path.relative(repoRoot, truthRegistryPath),
    wavePlan: path.relative(repoRoot, wavePlanPath),
    readinessReport: path.relative(repoRoot, readinessReportPath),
  },
  summary: {
    publicSafeProviderReadyStates: sustainLane.length,
    missingProviderStates: missingProviderStates.length,
    remediationStates: remediationLane.length,
    validationStates: validationLane.length,
    zeroRowStates: zeroRowStates.length,
    providerDepthThreshold: MIN_PUBLIC_SAFE_PROVIDER_DEPTH,
  },
  lanes: {
    remediation: remediationLane,
    validation: validationLane,
    sustain: sustainLane,
    zeroRowByWave,
    zeroRowUnassigned,
    readinessZeroRowCandidates,
    denseZeroRowCandidates,
    compactBatchCandidates,
    largeCountyMissingStates,
    missingProviderSorted,
  },
};

const mdLines = [
  '# Provider Buildout Priority Plan',
  '',
  `Generated: ${generatedDate}`,
  '',
  '## Why This Exists',
  '',
  '- The stricter information audits now measure whether each state has any public-safe provider layer, not just programs, forms, offices, and education.',
  '- Current results show that provider coverage is the biggest remaining national local-directory gap.',
  '',
  '## Summary',
  '',
  `- States already provider-ready at depth threshold ${MIN_PUBLIC_SAFE_PROVIDER_DEPTH}: ${report.summary.publicSafeProviderReadyStates}`,
  `- States still missing provider depth: ${report.summary.missingProviderStates}`,
  `- States needing remediation before expansion: ${report.summary.remediationStates}`,
  `- States with provider rows present but still below depth threshold: ${report.summary.validationStates}`,
  `- States with zero provider rows: ${report.summary.zeroRowStates}`,
  '',
  '## What This Plan Is Solving',
  '',
  '- The current completeness audit can still mark a state as present with only one public-safe provider row.',
  `- This plan uses a stricter provider-depth threshold of ${MIN_PUBLIC_SAFE_PROVIDER_DEPTH} public-safe provider rows before a state is treated as sustainably provider-ready.`,
  '- This plan therefore separates the cheap audit-clearing bar from the richer long-term provider depth target.',
  '',
  '## Execution Order',
  '',
  '1. Fix truth failures in states that already have broader local-directory blockers.',
  '2. Promote existing provider rows that are still stuck below the public-safe bar.',
  '3. Expand into zero-row states using the existing state-upgrade wave plan, while treating the readiness report Wave 1 states and dense nonprofit states as early-provider candidates.',
  '4. After a state clears the minimum provider-presence bar, deepen metro and specialty coverage instead of treating the state as finished.',
  '',
  '## Lane 1: Remediation First',
  '',
];

if (remediationLane.length === 0) {
  mdLines.push('- none');
} else {
  mdLines.push(...renderStateList(remediationLane));
}

mdLines.push(
  '',
  '## Lane 2: Validate Existing Provider Rows',
  '',
);

if (validationLane.length === 0) {
  mdLines.push('- none');
} else {
  mdLines.push(...renderStateList(validationLane));
}

mdLines.push(
  '',
  '## Lane 3: Sustain States That Already Pass',
  '',
);

if (sustainLane.length === 0) {
  mdLines.push('- none');
} else {
  mdLines.push(...renderStateList(sustainLane));
}

mdLines.push(
  '',
  '## Missing-Provider States Ranked By Existing Local Ecosystem',
  '',
  '- Sorting logic: highest public-safe nonprofit counts first, then larger county footprint.',
  '- This is useful when we want the cheapest realistic path to provider coverage using states that already have strong local nonprofit/source scaffolding.',
  '',
);

if (missingProviderSorted.length === 0) {
  mdLines.push('- none');
} else {
  mdLines.push(...renderStateList(missingProviderSorted.slice(0, 15)));
}

mdLines.push(
  '',
  '## Dense Nonprofit States With Zero Provider Rows',
  '',
  '- These are strong candidates for the first provider buildout passes because the local ecosystem is already rich enough to guide safe sourcing.',
  '',
);

if (denseZeroRowCandidates.length === 0) {
  mdLines.push('- none');
} else {
  mdLines.push(...renderStateList(denseZeroRowCandidates));
}

mdLines.push(
  '',
  '## Compact Batch Candidates',
  '',
  '- These states have zero provider rows but relatively small county footprints, which makes them good cheap passes once the source pattern is established.',
  '',
);

if (compactBatchCandidates.length === 0) {
  mdLines.push('- none');
} else {
  mdLines.push(...renderStateList(compactBatchCandidates));
}

mdLines.push(
  '',
  '## Large-County Missing States',
  '',
  '- These need deliberate planning because even a minimum provider layer is more likely to sprawl quickly.',
  '',
);

if (largeCountyMissingStates.length === 0) {
  mdLines.push('- none');
} else {
  mdLines.push(...renderStateList(largeCountyMissingStates));
}

mdLines.push(
  '',
  '## Lane 4: Zero-Row Expansion By Existing Wave Plan',
  '',
);

for (const wave of zeroRowByWave) {
  mdLines.push(...renderWaveSection(wave.waveId, wave.entries));
}

mdLines.push(
  '## Early Zero-Row Candidates From Readiness Report',
  '',
);

if (readinessZeroRowCandidates.length === 0) {
  mdLines.push('- none');
} else {
  mdLines.push(...readinessZeroRowCandidates.map((entry) => `- ${entry.stateName}`));
}

mdLines.push(
  '',
  '## Zero-Row States Not Assigned By Wave Plan',
  '',
);

if (zeroRowUnassigned.length === 0) {
  mdLines.push('- none');
} else {
  mdLines.push(`- ${zeroRowUnassigned.map((entry) => entry.stateName).join(', ')}`);
}

mdLines.push(
  '',
  '## Concrete Next Moves',
  '',
  '1. California: do not let new provider seeding hide the real blocker. Keep advocate-truth remediation explicit while defining the first trustworthy provider source set.',
  '2. Zero-row dense states: start with the highest-nonprofit missing states because they already have strong local resource ecosystems and likely easier provider discovery paths.',
  '3. Compact batch states: after the source pattern is proven, use the lowest-county zero-row states for cheap repetition and audit clearing.',
  '4. Large-county missing states: handle separately so we do not confuse a thin seed with genuine statewide provider depth.',
  '5. Use the existing seven provider-ready states as extraction templates for what a public-safe provider row must contain before promotion.',
  '',
  '## Source Artifacts',
  '',
  `- ${report.sources.informationCompleteness}`,
  `- ${report.sources.informationConfidence}`,
  `- ${report.sources.truthRegistry}`,
  `- ${report.sources.wavePlan}`,
  `- ${report.sources.readinessReport}`,
  '',
);

fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(outJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(outMdPath, `${mdLines.join('\n')}\n`, 'utf8');

console.log(`Wrote ${path.relative(repoRoot, outJsonPath)}`);
console.log(`Wrote ${path.relative(repoRoot, outMdPath)}`);
