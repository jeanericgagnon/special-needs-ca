import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourceAcquisitionRunsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');
const frontendDbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `max-info-program-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `max-info-program-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated input for prefix "${prefix}" in ${docsDir}`);
  }
  return path.join(docsDir, matches.at(-1));
}

function latestGeneratedJsonIfPresent(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  return matches.length ? path.join(docsDir, matches.at(-1)) : null;
}

function safeRead(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function safeReadJson(filePath) {
  return fs.existsSync(filePath) ? readJson(filePath) : null;
}

function hasAll(source, snippets) {
  return snippets.every((snippet) => source.includes(snippet));
}

const TRACK_A_FAMILY_ORDER = [
  {
    id: 'official_state_domains_repair',
    label: 'Repair generated fake official domains',
    readyGapFamily: 'dd_routing',
    authoringCommand: 'npm run audit:official-domain-followup-queue',
  },
  {
    id: 'forms_exact_urls',
    label: 'Exact forms libraries for most states',
    readyGapFamily: 'forms_guides',
    authoringCommand: 'npm run audit:forms-source-pack',
  },
  {
    id: 'provider_exact_targets',
    label: 'More named first-party provider targets',
    readyGapFamily: 'providers_care',
    authoringCommand: 'npm run audit:provider-source-pack',
  },
  {
    id: 'advocate_first_party_sources',
    label: 'First-party advocate and legal-support sources',
    readyGapFamily: 'advocates_legal',
    authoringCommand: 'npm run audit:authored-missing-source-targets',
  },
  {
    id: 'knowledge_content_sources',
    label: 'Knowledge article source families',
    readyGapFamily: 'knowledge_content',
    authoringCommand: 'npm run audit:authored-missing-source-targets',
  },
];

const TRACK_A_BURN_DOWN_ORDER = [
  {
    id: 'providers_care',
    label: 'Local providers, clinics, therapists, and care',
    gapFamily: 'providers_care',
  },
  {
    id: 'forms_guides',
    label: 'Forms, guides, and exact official libraries',
    gapFamily: 'forms_guides',
  },
  {
    id: 'advocates_legal',
    label: 'Advocates and legal/IEP support',
    gapFamily: 'advocates_legal',
  },
  {
    id: 'knowledge_content',
    label: 'Help content and explanatory knowledge',
    gapFamily: 'knowledge_content',
  },
  {
    id: 'housing',
    label: 'Housing help',
    gapFamily: 'housing',
  },
  {
    id: 'goods_supplies',
    label: 'Goods and supplies',
    gapFamily: 'goods_supplies',
  },
  {
    id: 'jobs_vocational',
    label: 'Jobs and vocational support',
    gapFamily: 'jobs_vocational',
  },
  {
    id: 'care_independent_living',
    label: 'Care and independent living',
    gapFamily: 'care_independent_living',
  },
  {
    id: 'legal_aid',
    label: 'Legal aid',
    gapFamily: 'legal_aid',
  },
];

const FAMILY_EXHAUSTION_RULES = {
  advocates_legal: {
    consecutiveLiveSourceRepairOnlyRuns: 3,
    maxSelectedCount: 5,
  },
};

const TRACK_A_NON_RUNTIME_BLOCKERS = new Set([
  'program_depth',
  'routing_depth',
  'provider_directory',
  'nonprofit_directory_depth',
  'advocate_directory_depth',
  'directory_foundation_signals',
  'normalization_depth',
  'knowledge_taxonomy',
  'knowledge_content_depth',
]);

const BLOCKER_HELPER_COMMANDS = {
  provider_directory: {
    gapFamily: 'providers_care',
    entryCommand: 'npm run run:next-provider-depth-step',
    auditCommand: 'npm run audit:source-acquisition-completion-plan',
  },
  knowledge_content_depth: {
    gapFamily: 'knowledge_content',
    entryCommand: 'npm run run:next-knowledge-content-step',
    auditCommand: 'npm run audit:knowledge-content-status-queue',
  },
  advocate_directory_depth: {
    gapFamily: 'advocates_legal',
    entryCommand: 'npm run run:next-advocate-depth-step',
    auditCommand: 'npm run audit:advocate-depth-queue',
  },
  directory_foundation_signals: {
    gapFamily: 'providers_care',
    entryCommand: 'npm run run:next-directory-foundation-step',
    auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
  },
  normalization_depth: {
    gapFamily: 'providers_care',
    entryCommand: 'npm run run:next-normalization-step',
    auditCommand: 'npm run audit:normalization-gap-queue',
  },
};

const fullGapPath = latestGeneratedJson('full-information-gap-audit-');
const completionPlanPath = latestGeneratedJson('source-acquisition-completion-plan-');
const missingFamiliesPath = latestGeneratedJson('missing-source-families-');
const authoredTargetsPath = latestGeneratedJson('authored-missing-source-targets-');
const exhaustiveGapPath = latestGeneratedJson('exhaustive-gap-master-');
const informationInventoryPath = latestGeneratedJson('information-inventory-');
const masterLedgerPath = latestGeneratedJson('master-source-target-ledger-');
const trackABlockerRegistryPath = latestGeneratedJsonIfPresent('track-a-blocker-registry-');
const trackABurndownBacklogPath = latestGeneratedJsonIfPresent('track-a-burndown-backlog-');

const fullGap = readJson(fullGapPath);
const completionPlan = readJson(completionPlanPath);
const missingFamilies = readJson(missingFamiliesPath);
const authoredTargets = readJson(authoredTargetsPath);
const exhaustiveGap = readJson(exhaustiveGapPath);
const informationInventory = readJson(informationInventoryPath);
const masterLedger = readJson(masterLedgerPath);
const trackABlockerRegistry = trackABlockerRegistryPath ? readJson(trackABlockerRegistryPath) : { blockers: [] };
const trackABurndownBacklog = trackABurndownBacklogPath ? readJson(trackABurndownBacklogPath) : { backlog: [] };
const actionableTrackABlockerCount = Number(trackABlockerRegistry?.summary?.actionableCount || 0);

const frontendDbSource = safeRead(path.join(repoRoot, 'frontend', 'src', 'lib', 'db.ts'));
const serverSource = safeRead(path.join(repoRoot, 'src', 'server.js'));
const dashboardActionsSource = safeRead(path.join(repoRoot, 'frontend', 'src', 'app', 'dashboard', 'child-actions.ts'));

const criticalTrackABlockers = (exhaustiveGap.nationalGapMatrix || [])
  .filter((item) => ['critical_gap', 'partial', 'meaningful_but_not_exhaustive'].includes(item.status))
  .filter((item) => TRACK_A_NON_RUNTIME_BLOCKERS.has(item.id))
  .map((item) => ({
    id: item.id,
    label: item.label,
    status: item.status,
    gap: item.exhaustiveGap,
  }));

const runtimeSurfaces = [
  {
    id: 'family_case_core',
    label: 'Family cases, child profiles, and case tracking',
    tables: ['family_cases', 'child_profiles', 'case_program_statuses'],
    implementationReady: hasAll(frontendDbSource, [
      'CREATE TABLE IF NOT EXISTS family_cases',
      'CREATE TABLE IF NOT EXISTS child_profiles',
      'CREATE TABLE IF NOT EXISTS case_program_statuses',
      'SELECT * FROM child_profiles WHERE case_id = ?',
      'INSERT INTO case_program_statuses',
    ]),
    operatorReady: hasAll(serverSource, [
      'INSERT INTO family_cases',
      'INSERT INTO child_profiles',
    ]),
  },
  {
    id: 'documents_reminders',
    label: 'Documents and reminders',
    tables: ['document_checklist_items', 'reminders'],
    implementationReady: hasAll(frontendDbSource, [
      'CREATE TABLE IF NOT EXISTS document_checklist_items',
      'CREATE TABLE IF NOT EXISTS reminders',
      'INSERT INTO document_checklist_items',
      'INSERT INTO reminders',
    ]),
    operatorReady: hasAll(dashboardActionsSource, [
      'title and due date are required for reminders',
    ]),
  },
  {
    id: 'collaboration_portal',
    label: 'Collaboration threads and shared portal',
    tables: ['consultation_threads', 'consultation_messages', 'shared_portal_tokens'],
    implementationReady: hasAll(frontendDbSource, [
      'CREATE TABLE IF NOT EXISTS consultation_threads',
      'CREATE TABLE IF NOT EXISTS consultation_messages',
      'CREATE TABLE IF NOT EXISTS shared_portal_tokens',
      'INSERT INTO consultation_threads',
      'INSERT INTO consultation_messages',
      'INSERT INTO shared_portal_tokens',
    ]),
    operatorReady: hasAll(frontendDbSource, [
      'SELECT * FROM consultation_messages WHERE thread_id = ?',
      'SELECT * FROM shared_portal_tokens WHERE child_id = ?',
    ]),
  },
  {
    id: 'feedback_loops',
    label: 'Coverage gaps and verification queue',
    tables: ['coverage_gaps', 'verification_queue_items'],
    implementationReady: hasAll(serverSource, [
      'SELECT * FROM verification_queue_items',
      'SELECT COUNT(*) as cnt FROM coverage_gaps',
    ]),
    operatorReady: hasAll(serverSource, [
      'UPDATE verification_queue_items SET verification_level = 1',
    ]),
  },
  {
    id: 'user_submissions',
    label: 'User-submitted resources',
    tables: ['user_submitted_resources'],
    implementationReady: hasAll(frontendDbSource, [
      'CREATE TABLE IF NOT EXISTS user_submitted_resources',
    ]),
    operatorReady: hasAll(serverSource, [
      'user_submitted_resources',
    ]),
  },
];

const inventoryTables = new Map();
for (const layer of informationInventory.layers || []) {
  for (const table of layer.tables || []) {
    inventoryTables.set(table.name, table.rowCount || 0);
  }
}

const runtimeLayerSummary = runtimeSurfaces.map((surface) => {
  const totalRows = surface.tables.reduce((sum, tableName) => sum + Number(inventoryTables.get(tableName) || 0), 0);
  const status = surface.implementationReady && surface.operatorReady
    ? 'operational'
    : surface.implementationReady
      ? 'partial'
      : 'missing';
  return {
    ...surface,
    totalRows,
    status,
    seededExemplarPresent: totalRows > 0,
  };
});

const blockerRegistryById = new Map((trackABlockerRegistry.blockers || []).map((blocker) => [blocker.id, blocker]));

const missingFamilyById = new Map((missingFamilies.families || []).map((family) => [
  family.id || family.label,
  family,
]));

function buildCycleCommands({ currentFamilyFocus, currentBlockerFocus }) {
  if (currentBlockerFocus?.blockerId) {
    const helper = BLOCKER_HELPER_COMMANDS[currentBlockerFocus.blockerId] || {};
    return [
      'npm run run:next-track-a-step',
      helper.entryCommand,
      helper.auditCommand,
      'npm run audit:track-a-burndown-backlog',
      'npm run audit:max-info-program',
    ].filter(Boolean);
  }

  if (!currentFamilyFocus) {
    return [
      'npm run run:next-track-a-step',
      'npm run audit:track-a-burndown-backlog',
      'npm run audit:max-info-program',
    ];
  }

  const familyFilter = currentFamilyFocus?.readyGapFamily || 'providers_care';
  return [
    'npm run audit:authored-missing-source-targets',
    'npm run audit:source-acquisition-completion-plan',
    `npm run run:source-acquisition-wave -- --mode=live --lane=ready_target_scrape --gap=${familyFilter} --limit=25`,
    'npm run run:source-acquisition-followups -- --run-id=<run-id>',
    `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=${familyFilter}`,
    `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=${familyFilter}`,
    `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=${familyFilter} --mode=dry-run`,
    'npm run audit:full-information-gap',
    'npm run audit:max-info-program',
  ];
}

function latestFamilyWaveEvidence(gapFamily) {
  if (!fs.existsSync(sourceAcquisitionRunsDir)) return null;

  const runDirs = fs.readdirSync(sourceAcquisitionRunsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  for (const runId of runDirs) {
    const manifestPath = path.join(sourceAcquisitionRunsDir, runId, 'manifest.json');
    const manifest = safeReadJson(manifestPath);
    if (!manifest) continue;
    if (manifest.filters?.gap !== gapFamily) continue;
    if (manifest.filters?.lane !== 'ready_target_scrape') continue;
    if (manifest.filters?.status !== 'ready_lightweight') continue;
    return {
      runId,
      manifestPath,
      mode: manifest.mode || 'unknown',
      selectedCount: Number(manifest.selectedCount || 0),
      filters: manifest.filters || {},
    };
  }

  return null;
}

function listFamilyLiveRunEvidence(gapFamily) {
  if (!fs.existsSync(sourceAcquisitionRunsDir)) return [];

  const runDirs = fs.readdirSync(sourceAcquisitionRunsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  const runs = [];
  for (const runId of runDirs) {
    const manifestPath = path.join(sourceAcquisitionRunsDir, runId, 'manifest.json');
    const summaryPath = path.join(sourceAcquisitionRunsDir, runId, 'followups', 'followup-summary.json');
    const manifest = safeReadJson(manifestPath);
    if (!manifest) continue;
    if (manifest.mode !== 'live') continue;
    if (manifest.filters?.gap !== gapFamily) continue;
    if (manifest.filters?.lane !== 'ready_target_scrape') continue;
    if (manifest.filters?.status !== 'ready_lightweight') continue;
    const summary = safeReadJson(summaryPath);
    runs.push({
      runId,
      manifestPath,
      summaryPath,
      selectedCount: Number(manifest.selectedCount || 0),
      parseReadyCount: Number(summary?.parseReadyCount || 0),
      sourceRepairCount: Number(summary?.sourceRepairCount || 0),
      blockedCount: Number(summary?.blockedCount || 0),
      retryableCount: Number(summary?.retryableCount || 0),
    });
  }
  return runs;
}

function familyExhaustionEvidence(gapFamily) {
  const rule = FAMILY_EXHAUSTION_RULES[gapFamily];
  if (!rule) return null;

  const liveRuns = listFamilyLiveRunEvidence(gapFamily);
  if (!liveRuns.length) return null;

  const streakTarget = Number(rule.consecutiveLiveSourceRepairOnlyRuns || 0);
  if (!(streakTarget > 0) || liveRuns.length < streakTarget) return null;

  const eligibleRuns = typeof rule.maxSelectedCount === 'number'
    ? liveRuns.filter((run) => run.selectedCount > 0 && run.selectedCount <= rule.maxSelectedCount)
    : liveRuns;
  if (eligibleRuns.length < streakTarget) return null;

  const streak = eligibleRuns.slice(0, streakTarget);
  const exhausted = streak.every((run) =>
    run.selectedCount > 0
    && run.parseReadyCount === 0
    && run.sourceRepairCount === run.selectedCount
    && run.blockedCount === 0
    && run.retryableCount === 0
  );

  if (!exhausted) return null;

  return {
    reason: 'consecutive_live_source_repair_only_runs',
    threshold: streakTarget,
    runs: streak,
  };
}

const familyClosureOrder = TRACK_A_FAMILY_ORDER.map((family) => {
  const blocker = missingFamilyById.get(family.id);
  const readyCount = Number(completionPlan.summary?.combinedByGapFamily?.[family.readyGapFamily] || 0);
  return {
    ...family,
    status: blocker ? 'open' : 'cleared',
    readyCount,
    blockerReason: blocker?.reason || '',
    cycleCommands: buildCycleCommands(family.readyGapFamily),
  };
}).filter((family) => family.status === 'open');

const currentAuthoringFamilyFocus = familyClosureOrder.find((family) => family.status === 'open') || null;
const hasActiveTrackABacklog = Array.isArray(trackABurndownBacklog.backlog) && trackABurndownBacklog.backlog.length > 0;
const currentBlockerFocus = hasActiveTrackABacklog
  ? trackABurndownBacklog.backlog[0]
  : null;
const currentBurnDownFamilyFocus = currentBlockerFocus
  ? TRACK_A_BURN_DOWN_ORDER
    .map((family) => ({
      ...family,
      readyGapFamily: family.gapFamily,
      readyCount: Number(completionPlan.summary?.combinedByGapFamily?.[family.gapFamily] || 0),
      latestWaveEvidence: latestFamilyWaveEvidence(family.gapFamily),
      exhaustionEvidence: familyExhaustionEvidence(family.gapFamily),
      cycleCommands: buildCycleCommands(family.gapFamily),
    }))
    .find((family) => family.id === currentBlockerFocus.blockerId || family.gapFamily === BLOCKER_HELPER_COMMANDS[currentBlockerFocus.blockerId]?.gapFamily) || null
  : null;
const currentFamilyFocus = currentAuthoringFamilyFocus;
const sourceRepairRows = (masterLedger.ledger || []).filter((row) => row.ledgerStatus === 'source_repair');
const providerSourceRepairRows = sourceRepairRows.filter((row) => row.gapFamily === 'providers_care');

const trackA = {
  status: criticalTrackABlockers.length === 0 && (missingFamilies.families || []).length === 0
    ? 'complete'
    : actionableTrackABlockerCount === 0 && (missingFamilies.families || []).length === 0
      ? 'explicitly_blocked'
      : 'blocked',
  readyRows: completionPlan.summary?.combinedReadyUniqueRows || 0,
  authoredTargets: authoredTargets.summary?.totalAuthoredTargets || 0,
  missingFamilyCount: completionPlan.summary?.missingSourceFamilyCount || (missingFamilies.families || []).length,
  actionableBlockerCount: actionableTrackABlockerCount,
  sourceRepairCount: sourceRepairRows.length,
  providerSourceRepairCount: providerSourceRepairRows.length,
  focusMode: currentAuthoringFamilyFocus ? 'authoring' : currentBlockerFocus ? 'backlog' : 'none',
  currentFamilyFocus,
  currentBlockerFocus,
  exhaustedBurnDownFamilies: TRACK_A_BURN_DOWN_ORDER
    .map((family) => ({
      id: family.id,
      label: family.label,
      gapFamily: family.gapFamily,
      readyCount: Number(completionPlan.summary?.combinedByGapFamily?.[family.gapFamily] || 0),
      latestWaveEvidence: latestFamilyWaveEvidence(family.gapFamily),
      exhaustionEvidence: familyExhaustionEvidence(family.gapFamily),
    }))
    .filter((family) =>
      family.readyCount > 0 && (
        family.latestWaveEvidence?.selectedCount === 0
        || family.exhaustionEvidence
      )
    ),
  familyClosureOrder,
  topLevelCommand: 'npm run run:next-track-a-step',
  commandCadence: buildCycleCommands({ currentFamilyFocus, currentBlockerFocus }),
  canonicalArtifacts: [
    'docs/generated/max-info-program-*.json|md',
    'docs/generated/track-a-blocker-registry-*.json|md',
    'docs/generated/track-a-burndown-backlog-*.json|md',
    'docs/generated/source-acquisition-completion-plan-*.json|md',
    'docs/generated/missing-source-families-*.json|md',
    'docs/generated/full-information-gap-audit-*.json|md',
    'docs/generated/authored-missing-source-targets-*.json|md|csv',
    'data/source_packs/*',
    'data/source-acquisition-runs/<run-id>/*',
  ],
  blockers: [
    ...((missingFamilies.families || []).map((family) => ({
      id: family.id || family.label,
      label: family.label,
      status: family.severity || 'missing_family',
      gap: family.reason,
    }))),
    ...criticalTrackABlockers.map((blocker) => ({
      ...blocker,
      gap: blockerRegistryById.get(blocker.id)?.summary || blocker.gap,
      artifactPath: trackABlockerRegistryPath ? `docs/generated/${path.basename(trackABlockerRegistryPath)}` : null,
    })),
  ],
};

const trackB = {
  status: runtimeLayerSummary.every((surface) => surface.status === 'operational') ? 'operational' : 'needs_implementation',
  operationalCount: runtimeLayerSummary.filter((surface) => surface.status === 'operational').length,
  partialCount: runtimeLayerSummary.filter((surface) => surface.status === 'partial').length,
  missingCount: runtimeLayerSummary.filter((surface) => surface.status === 'missing').length,
  surfaces: runtimeLayerSummary,
};

const payload = {
  generatedAt: generatedDate,
  repoRoot,
  dbPath: frontendDbPath,
  scopeMode: 'data_only',
  inputs: {
    fullGapPath,
    completionPlanPath,
    missingFamiliesPath,
    authoredTargetsPath,
    exhaustiveGapPath,
    informationInventoryPath,
    masterLedgerPath,
    trackABlockerRegistryPath,
    trackABurndownBacklogPath,
  },
  optimizationTarget: 'lowest_token_usage_first',
  tracks: {
    informationExhaustiveness: trackA,
    runtimeOperationalReadiness: trackB,
  },
  nextCommands: [
    trackA.topLevelCommand,
    ...(currentBlockerFocus?.commands || []),
  ].filter(Boolean),
  nextActions: [
    trackA.missingFamilyCount > 0
      ? 'Finish the remaining authored source families before broadening any scrape wave.'
      : 'No authored source-family blockers remain; shift the loop to ready-target scrape and validation burn-down.',
    trackA.sourceRepairCount > 0
      ? `Clear source-repair blockers from the master ledger before spending more fetch volume on those families (${trackA.providerSourceRepairCount} provider rows currently need repair).`
      : 'No source-repair blockers are currently recorded in the master ledger.',
    currentBlockerFocus
      ? `Current backlog focus is ${currentBlockerFocus.blockerId}; work ${currentBlockerFocus.queueArtifact} next.`
      : 'No backlog focus is currently selected.',
    trackABlockerRegistryPath
      ? `Use ${path.relative(repoRoot, trackABlockerRegistryPath)} as the resumable blocker registry for the remaining non-runtime Track A gap classes.`
      : 'Generate the Track A blocker registry so the remaining non-runtime gap classes are consolidated from disk.',
    'Burn down priority lightweight families in the existing completion plan before nonprofit overflow.',
    'Ignore UI, UX, and runtime-product work in this program; this control plane is data-only.',
    'Regenerate this artifact after each data-family unlock or data burn-down pass.',
  ],
};

const mdLines = [
  '# Max-Info Program',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This artifact is the low-token control plane for the repo-wide 100% max-info program.',
  '',
  '## Summary',
  '',
  '- Scope mode: data_only',
  `- Track A status: ${trackA.status}`,
  `- Track A ready rows: ${trackA.readyRows}`,
  `- Track A authored targets: ${trackA.authoredTargets}`,
  `- Track A missing families: ${trackA.missingFamilyCount}`,
  `- Track A actionable blockers: ${trackA.actionableBlockerCount}`,
  `- Track A source-repair rows: ${trackA.sourceRepairCount}`,
  `- Track A provider source-repair rows: ${trackA.providerSourceRepairCount}`,
  `- Track A focus mode: ${trackA.focusMode}`,
  `- Track A current family focus: ${trackA.currentFamilyFocus?.label || 'none'}`,
  `- Track A current blocker focus: ${trackA.currentBlockerFocus?.blockerId || 'none'}`,
  `- Top-level command: ${trackA.topLevelCommand}`,
  `- Track B status: ${trackB.status} (out of scope for this program)`,
  `- Track B operational surfaces: ${trackB.operationalCount}`,
  `- Track B partial surfaces: ${trackB.partialCount}`,
  `- Track B missing surfaces: ${trackB.missingCount}`,
  '',
  '## Track A Blockers',
  '',
];

for (const blocker of trackA.blockers) {
  mdLines.push(`- ${blocker.label}: ${blocker.gap}`);
}

mdLines.push('', '## Track A Family Closure Order', '');
for (const family of familyClosureOrder) {
  mdLines.push(`- ${family.label}: status=${family.status}; readyCount=${family.readyCount}${family.blockerReason ? `; reason=${family.blockerReason}` : ''}`);
}

mdLines.push('', '## Exhausted Burn-Down Families', '');
if (!trackA.exhaustedBurnDownFamilies.length) {
  mdLines.push('- none');
} else {
  for (const family of trackA.exhaustedBurnDownFamilies) {
    const latestRun = family.latestWaveEvidence
      ? `latestRun=${family.latestWaveEvidence.runId}; selectedCount=${family.latestWaveEvidence.selectedCount}; manifest=${family.latestWaveEvidence.manifestPath}`
      : 'latestRun=none';
    const exhaustion = family.exhaustionEvidence
      ? `; exhaustionReason=${family.exhaustionEvidence.reason}; threshold=${family.exhaustionEvidence.threshold}`
      : '';
    mdLines.push(`- ${family.label}: ${latestRun}${exhaustion}`);
  }
}

mdLines.push('', '## Track A Command Cadence', '');
for (const command of trackA.commandCadence) {
  mdLines.push(`- ${command}`);
}

mdLines.push('', '## Next Commands', '');
for (const command of payload.nextCommands) {
  mdLines.push(`- ${command}`);
}

mdLines.push('', '## Track B Runtime Surfaces', '');
for (const surface of runtimeLayerSummary) {
  mdLines.push(`- ${surface.label}: status=${surface.status}; rows=${surface.totalRows}; seededExemplarPresent=${surface.seededExemplarPresent ? 'yes' : 'no'}`);
}

mdLines.push('', '## Next Actions', '');
for (const action of payload.nextActions) {
  mdLines.push(`- ${action}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  report: mdOutPath,
  json: jsonOutPath,
  trackAStatus: trackA.status,
  trackBStatus: trackB.status,
  trackABlockers: trackA.blockers.length,
}, null, 2));
