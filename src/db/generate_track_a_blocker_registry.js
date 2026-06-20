import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const runsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `track-a-blocker-registry-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `track-a-blocker-registry-${generatedDate}.md`);

const blockerCommandMap = {
  provider_directory: {
    entryCommand: 'npm run run:next-provider-depth-step',
    auditCommand: 'npm run audit:source-acquisition-completion-plan',
  },
  advocate_directory_depth: {
    entryCommand: 'npm run run:next-advocate-depth-step',
    auditCommand: 'npm run audit:advocate-depth-queue',
  },
  directory_foundation_signals: {
    entryCommand: 'npm run run:next-directory-foundation-step',
    auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
  },
  normalization_depth: {
    entryCommand: 'npm run run:next-normalization-step',
    auditCommand: 'npm run audit:normalization-gap-queue',
  },
  knowledge_content_depth: {
    entryCommand: 'npm run run:next-knowledge-content-step',
    auditCommand: 'npm run audit:knowledge-content-status-queue',
  },
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function safeReadJson(filePath) {
  return fs.existsSync(filePath) ? readJson(filePath) : null;
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

function topEntries(object, limit = 5) {
  return Object.entries(object || {})
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function inventoryRowCount(inventory, tableName) {
  for (const layer of inventory.layers || []) {
    for (const table of layer.tables || []) {
      if (table.name === tableName) return Number(table.rowCount || 0);
    }
  }
  return 0;
}

function findNationalGap(exhaustiveGap, id) {
  return (exhaustiveGap.nationalGapMatrix || []).find((item) => item.id === id) || null;
}

function countAcceptedFamilyRows(gapFamily) {
  if (!fs.existsSync(runsDir)) return { distinctSourceUrls: 0, acceptedRows: 0 };
  const sourceUrls = new Set();
  let acceptedRows = 0;
  for (const runId of fs.readdirSync(runsDir).sort()) {
    const acceptedPath = path.join(runsDir, runId, 'validated', gapFamily, 'accepted.ndjson');
    if (!fs.existsSync(acceptedPath)) continue;
    const lines = fs.readFileSync(acceptedPath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      const row = JSON.parse(line);
      const sourceUrl = String(row.sourceUrl || '').trim();
      if (sourceUrl) sourceUrls.add(sourceUrl);
      acceptedRows += 1;
    }
  }
  return {
    distinctSourceUrls: sourceUrls.size,
    acceptedRows,
  };
}

function countRepeatedFamilyFollowups(gapFamily, minRepeats = 2) {
  if (!fs.existsSync(runsDir)) return { repeatedRows: 0, repeatedSourceUrls: 0 };
  const grouped = new Map();
  for (const runId of fs.readdirSync(runsDir).sort()) {
    const followupDir = path.join(runsDir, runId, 'followups');
    if (!fs.existsSync(followupDir)) continue;
    for (const fileName of ['blocked-failures.json', 'source-repair.json', 'retryable-failures.json']) {
      const filePath = path.join(followupDir, fileName);
      const rows = safeReadJson(filePath);
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (row.gapFamily !== gapFamily) continue;
        const sourceUrl = String(row.sourceUrl || '').trim();
        const followupReason = String(row.followupReason || '').trim();
        if (!sourceUrl || !followupReason) continue;
        const key = `${followupReason}|${sourceUrl}`;
        const entry = grouped.get(key) || { runIds: new Set(), sourceUrl };
        entry.runIds.add(runId);
        grouped.set(key, entry);
      }
    }
  }
  const repeated = [...grouped.values()].filter((entry) => entry.runIds.size >= minRepeats);
  return {
    repeatedRows: repeated.length,
    repeatedSourceUrls: new Set(repeated.map((entry) => entry.sourceUrl)).size,
  };
}

function summarizeKnowledgePromotion() {
  if (!fs.existsSync(runsDir)) {
    return { inspectedCount: 0, promotedCount: 0, duplicateCount: 0, manualReviewCount: 0 };
  }

  const summary = { inspectedCount: 0, promotedCount: 0, duplicateCount: 0, manualReviewCount: 0 };
  for (const runId of fs.readdirSync(runsDir).sort()) {
    const summaryPath = path.join(runsDir, runId, 'promoted', 'staging_scraped_knowledge_content-summary.json');
    const payload = safeReadJson(summaryPath);
    if (!payload) continue;
    summary.inspectedCount += Number(payload.inspectedCount || 0);
    summary.promotedCount += Number(payload.promotedCount || 0);
    summary.duplicateCount += Number(payload.duplicateCount || 0);
    summary.manualReviewCount += Number(payload.manualReviewCount || 0);
  }
  return summary;
}

function actionableKnowledgeQueueCount(queue) {
  const byFinalStatus = queue?.summary?.byFinalStatus || {};
  return Number(byFinalStatus.pending_exact_target || 0)
    + Number(byFinalStatus.accepted_not_promoted || 0)
    + Number(byFinalStatus.fetch_blocked || 0)
    + Number(byFinalStatus.validation_rejected || 0)
    + Number(byFinalStatus.reviewed_replacement_ready || 0);
}

const exhaustiveGapPath = latestGeneratedJson('exhaustive-gap-master-');
const informationInventoryPath = latestGeneratedJson('information-inventory-');
const providerRegistryPath = latestGeneratedJsonIfPresent('provider-followup-blocker-registry-');
const providerRepairQueuePath = latestGeneratedJsonIfPresent('provider-followup-repair-queue-');
const providerAuthoringBacklogPath = latestGeneratedJsonIfPresent('provider-authoring-backlog-');
const advocateRegistryPath = latestGeneratedJsonIfPresent('advocate-followup-blocker-registry-');
const competitiveRegistryPath = latestGeneratedJsonIfPresent('competitive-help-followup-blocker-registry-');
const knowledgeStatusQueuePath = latestGeneratedJsonIfPresent('knowledge-content-status-queue-');
const authoredMissingSourceTargetsPath = latestGeneratedJsonIfPresent('authored-missing-source-targets-');
const missingSourceFamiliesPath = latestGeneratedJsonIfPresent('missing-source-families-');
const directoryFoundationQueuePath = latestGeneratedJsonIfPresent('directory-foundation-enrichment-queue-');
const normalizationGapQueuePath = latestGeneratedJsonIfPresent('normalization-gap-queue-');
const advocateDepthQueuePath = latestGeneratedJsonIfPresent('advocate-depth-queue-');

const exhaustiveGap = readJson(exhaustiveGapPath);
const informationInventory = readJson(informationInventoryPath);
const providerRegistry = providerRegistryPath ? readJson(providerRegistryPath) : null;
const providerRepairQueue = providerRepairQueuePath ? readJson(providerRepairQueuePath) : null;
const providerAuthoringBacklog = providerAuthoringBacklogPath ? readJson(providerAuthoringBacklogPath) : null;
const advocateRegistry = advocateRegistryPath ? readJson(advocateRegistryPath) : null;
const competitiveRegistry = competitiveRegistryPath ? readJson(competitiveRegistryPath) : null;
const knowledgeStatusQueue = knowledgeStatusQueuePath ? readJson(knowledgeStatusQueuePath) : null;
const authoredMissingSourceTargets = authoredMissingSourceTargetsPath ? readJson(authoredMissingSourceTargetsPath) : null;
const missingSourceFamilies = missingSourceFamiliesPath ? readJson(missingSourceFamiliesPath) : null;
const directoryFoundationQueue = directoryFoundationQueuePath ? readJson(directoryFoundationQueuePath) : null;
const normalizationGapQueue = normalizationGapQueuePath ? readJson(normalizationGapQueuePath) : null;
const advocateDepthQueue = advocateDepthQueuePath ? readJson(advocateDepthQueuePath) : null;

const providerGap = findNationalGap(exhaustiveGap, 'provider_directory');
const advocateGap = findNationalGap(exhaustiveGap, 'advocate_directory_depth');
const foundationGap = findNationalGap(exhaustiveGap, 'directory_foundation_signals');
const normalizationGap = findNationalGap(exhaustiveGap, 'normalization_depth');
const knowledgeGap = findNationalGap(exhaustiveGap, 'knowledge_content_depth');

const knowledgeAccepted = countAcceptedFamilyRows('knowledge_content');
const knowledgeRepeatedFollowups = countRepeatedFamilyFollowups('knowledge_content');
const knowledgePromotion = summarizeKnowledgePromotion();

const knowledgeArticleCount = inventoryRowCount(informationInventory, 'knowledge_articles');
const stagingKnowledgeCount = inventoryRowCount(informationInventory, 'staging_scraped_knowledge_content');
const providerActionable = Number(providerRepairQueue?.summary?.totalRows || 0) > 0
  || Number(providerAuthoringBacklog?.summary?.totalRows || 0) > 0;
const advocateActionable = Number(advocateDepthQueue?.summary?.totalRows || 0) > 0;
const foundationActionable = Number(directoryFoundationQueue?.summary?.totalRows || 0) > 0;
const normalizationActionable = Number(normalizationGapQueue?.summary?.totalRows || 0) > 0;
const knowledgeMissingFamilyOpen = Array.isArray(missingSourceFamilies?.families)
  && missingSourceFamilies.families.some((family) => {
    const id = String(family?.id || '').trim();
    const label = String(family?.label || '').toLowerCase();
    return id === 'knowledge_content_sources' || label.includes('knowledge');
  });
const knowledgeActionable = actionableKnowledgeQueueCount(knowledgeStatusQueue) > 0 || knowledgeMissingFamilyOpen;
const authoredKnowledgeTargetCount = Number(authoredMissingSourceTargets?.summary?.knowledgeContentTargetCount || 0)
  || Number(authoredMissingSourceTargets?.summary?.byGapFamily?.knowledge_content || 0);

const blockers = [
  {
    id: 'provider_directory',
    label: providerGap?.label || 'Local providers, clinics, therapists, and care',
    status: providerGap?.status || 'critical_gap',
    currentState: providerGap?.currentState || 'thin',
    summary: providerGap?.exhaustiveGap || 'Provider depth is still the largest local help gap.',
    evidence: providerGap?.evidence || '',
    metrics: {
      liveProviders: inventoryRowCount(informationInventory, 'resource_providers'),
      stagedProviders: inventoryRowCount(informationInventory, 'staging_scraped_resource_providers'),
      repeatedFollowupRows: Number(providerRegistry?.summary?.totalRepeatedRows || 0),
      repeatedFollowupDomains: Number(providerRegistry?.summary?.distinctDomains || 0),
      repairQueueRows: Number(providerRepairQueue?.summary?.totalRows || 0),
      repairQueueDistinctUrls: Number(providerRepairQueue?.summary?.distinctSourceUrls || 0),
      authoringBacklogRows: Number(providerAuthoringBacklog?.summary?.totalRows || 0),
      authoringFirstState: String(providerAuthoringBacklog?.summary?.firstState || ''),
      topRepeatedReasons: topEntries(providerRegistry?.summary?.byReason, 5),
    },
    actionableFromDisk: providerActionable,
    sourceArtifacts: [
      path.relative(repoRoot, exhaustiveGapPath),
      providerRegistryPath ? path.relative(repoRoot, providerRegistryPath) : null,
      providerRepairQueuePath ? path.relative(repoRoot, providerRepairQueuePath) : null,
      providerAuthoringBacklogPath ? path.relative(repoRoot, providerAuthoringBacklogPath) : null,
      path.relative(repoRoot, informationInventoryPath),
    ].filter(Boolean),
    nextOperatorAction: Number(providerRepairQueue?.summary?.totalRows || 0) > 0
      ? 'Run the provider depth helper and audit the source acquisition completion plan before spending more provider fetch volume.'
      : Number(providerAuthoringBacklog?.summary?.totalRows || 0) > 0
        ? `Ready provider targets are exhausted; work the provider authoring backlog starting with ${String(providerAuthoringBacklog?.summary?.firstState || 'the first missing-depth state')} before spending more provider fetch volume.`
        : 'No live provider repair or authoring queue remains; keep this blocker class explicitly blocked by saved coverage evidence until a future audit yields new exact targets.',
    successCondition: 'Provider depth is no longer the thinnest major national information layer and every remaining provider gap is explicitly queued, staged, rejected, blocked, or deferred.',
  },
  {
    id: 'advocate_directory_depth',
    label: advocateGap?.label || 'Advocates and legal/IEP support',
    status: advocateGap?.status || 'meaningful_but_not_exhaustive',
    currentState: advocateGap?.currentState || 'moderate',
    summary: advocateGap?.exhaustiveGap || 'Advocate truth-safe depth is still incomplete.',
    evidence: advocateGap?.evidence || '',
    metrics: {
      liveAdvocates: inventoryRowCount(informationInventory, 'iep_advocates'),
      stagedAdvocates: inventoryRowCount(informationInventory, 'staging_scraped_iep_advocates'),
      actionableFollowupRows: Number(advocateRegistry?.summary?.totalActionableRows || 0),
      distinctBlockedDomains: Number(advocateRegistry?.summary?.distinctDomains || 0),
      advocateDepthQueueRows: Number(advocateDepthQueue?.summary?.totalRows || 0),
      californiaTruthRecoveryCounties: Number(advocateDepthQueue?.summary?.californiaCountiesBlocked || 0),
      topActionableReasons: topEntries(advocateRegistry?.summary?.byReason, 5),
    },
    actionableFromDisk: advocateActionable,
    sourceArtifacts: [
      path.relative(repoRoot, exhaustiveGapPath),
      advocateRegistryPath ? path.relative(repoRoot, advocateRegistryPath) : null,
      advocateDepthQueuePath ? path.relative(repoRoot, advocateDepthQueuePath) : null,
      path.relative(repoRoot, informationInventoryPath),
    ].filter(Boolean),
    nextOperatorAction: advocateActionable
      ? 'Run the advocate depth helper and audit the saved advocate queue before spending more fetch volume.'
      : 'No live advocate depth queue remains; keep this blocker class explicitly blocked by saved coverage evidence until a future audit yields new exact targets.',
    successCondition: 'Truth-safe advocate and legal-support depth is no longer a top blocker and every remaining advocate gap is explicitly queued, staged, rejected, blocked, or deferred.',
  },
  {
    id: 'directory_foundation_signals',
    label: foundationGap?.label || 'Findhelp-like metadata: availability, accessibility, intake, capacity',
    status: foundationGap?.status || 'partial',
    currentState: foundationGap?.currentState || 'modeled',
    summary: foundationGap?.exhaustiveGap || 'Directory metadata is modeled but still sparse in live rows.',
    evidence: foundationGap?.evidence || '',
    metrics: {
      liveProviders: inventoryRowCount(informationInventory, 'resource_providers'),
      liveNonprofits: inventoryRowCount(informationInventory, 'nonprofit_organizations'),
      liveAdvocates: inventoryRowCount(informationInventory, 'iep_advocates'),
      enrichmentQueueRows: Number(directoryFoundationQueue?.summary?.totalRows || 0),
      providerSourcePullStates: Number(directoryFoundationQueue?.summary?.providerSourcePullStates || 0),
      nonprofitCandidateRows: Number(directoryFoundationQueue?.summary?.nonprofitCandidateRows || 0),
      providerCandidateRows: Number(directoryFoundationQueue?.summary?.providerCandidateRows || 0),
    },
    actionableFromDisk: foundationActionable,
    sourceArtifacts: [
      path.relative(repoRoot, exhaustiveGapPath),
      path.relative(repoRoot, informationInventoryPath),
      directoryFoundationQueuePath ? path.relative(repoRoot, directoryFoundationQueuePath) : null,
      competitiveRegistryPath ? path.relative(repoRoot, competitiveRegistryPath) : null,
    ].filter(Boolean),
    nextOperatorAction: foundationActionable
      ? 'Run the directory foundation helper and audit the saved enrichment queue before promoting explicit metadata signals.'
      : 'No live directory-foundation enrichment queue remains; keep this blocker class explicitly blocked by saved low-signal coverage evidence.',
    successCondition: 'Meaningful live accessibility, intake, modality, and availability signals exist where explicitly source-backed across providers, nonprofits, and advocates.',
  },
  {
    id: 'normalization_depth',
    label: normalizationGap?.label || 'Canonical org -> program -> location normalization',
    status: normalizationGap?.status || 'partial',
    currentState: normalizationGap?.currentState || 'present',
    summary: normalizationGap?.exhaustiveGap || 'Normalization exists, but service-location depth is still thin.',
    evidence: normalizationGap?.evidence || '',
    metrics: {
      organizations: inventoryRowCount(informationInventory, 'organizations'),
      orgProgramLinks: inventoryRowCount(informationInventory, 'organization_program_links'),
      serviceLocations: inventoryRowCount(informationInventory, 'service_locations'),
      officeLocations: inventoryRowCount(informationInventory, 'office_locations'),
      virtualServiceAreas: inventoryRowCount(informationInventory, 'virtual_service_areas'),
      normalizationQueueRows: Number(normalizationGapQueue?.summary?.totalRows || 0),
      providerServiceLocationGapRows: Number(normalizationGapQueue?.summary?.byLane?.provider_service_location_gap || 0),
    },
    actionableFromDisk: normalizationActionable,
    sourceArtifacts: [
      path.relative(repoRoot, exhaustiveGapPath),
      path.relative(repoRoot, informationInventoryPath),
      normalizationGapQueuePath ? path.relative(repoRoot, normalizationGapQueuePath) : null,
    ],
    nextOperatorAction: normalizationActionable
      ? 'Run the normalization helper and audit the saved gap queue before deepening locations.'
      : 'No live normalization gap queue remains; keep this blocker class explicitly blocked by saved thin-location evidence until a future audit yields exact rows.',
    successCondition: 'Location-rich discovery no longer depends on weak org-level assumptions and all remaining normalization gaps are explicit and evidence-bound.',
  },
  {
    id: 'knowledge_content_depth',
    label: knowledgeGap?.label || 'Help content and explanatory knowledge',
    status: knowledgeGap?.status || 'critical_gap',
    currentState: knowledgeGap?.currentState || 'thin',
    summary: knowledgeGap?.exhaustiveGap || 'Knowledge coverage is still too small for the full family journey.',
    evidence: knowledgeGap?.evidence || '',
    metrics: {
      liveKnowledgeArticles: knowledgeArticleCount,
      stagedKnowledgeArticles: stagingKnowledgeCount,
      acceptedKnowledgeRows: knowledgeAccepted.acceptedRows,
      acceptedKnowledgeUrls: knowledgeAccepted.distinctSourceUrls,
      repeatedFollowupRows: knowledgeRepeatedFollowups.repeatedRows,
      repeatedFollowupUrls: knowledgeRepeatedFollowups.repeatedSourceUrls,
      promotionInspected: knowledgePromotion.inspectedCount,
      promotionDuplicates: knowledgePromotion.duplicateCount,
      promotionPromoted: knowledgePromotion.promotedCount,
      promotionManualReview: knowledgePromotion.manualReviewCount,
      exactTargetQueueRows: actionableKnowledgeQueueCount(knowledgeStatusQueue),
      exactTargetDuplicateRows: Number(knowledgeStatusQueue?.summary?.byFinalStatus?.duplicate_of_existing_live_article || 0),
      exactTargetPendingRows: Number(knowledgeStatusQueue?.summary?.byFinalStatus?.pending_exact_target || 0),
      authoredKnowledgeTargets: authoredKnowledgeTargetCount,
      knowledgeMissingFamilyOpen: knowledgeMissingFamilyOpen ? 1 : 0,
    },
    actionableFromDisk: knowledgeActionable,
    sourceArtifacts: [
      path.relative(repoRoot, exhaustiveGapPath),
      path.relative(repoRoot, informationInventoryPath),
      authoredMissingSourceTargetsPath ? path.relative(repoRoot, authoredMissingSourceTargetsPath) : null,
      knowledgeStatusQueuePath ? path.relative(repoRoot, knowledgeStatusQueuePath) : null,
    ],
    nextOperatorAction: actionableKnowledgeQueueCount(knowledgeStatusQueue) > 0
      ? 'Run the knowledge helper and audit the saved knowledge queue before spending more knowledge fetch cycles.'
      : knowledgeMissingFamilyOpen
        ? 'Knowledge exact-target queue is saturated; expand authored knowledge targets, then regenerate completion-plan and knowledge-queue artifacts before spending more knowledge fetch cycles.'
        : 'No live knowledge queue or missing knowledge source family remains; keep this blocker class explicitly blocked by saved thin-coverage evidence until a future audit yields new exact topics.',
    successCondition: 'No unknown journey-content gaps remain; every exact knowledge target is promoted, duplicate, deferred, blocked, staged, or rejected with saved evidence.',
  },
];

for (const blocker of blockers) {
  const commandConfig = blockerCommandMap[blocker.id] || {};
  blocker.entryCommand = commandConfig.entryCommand || null;
  blocker.auditCommand = commandConfig.auditCommand || null;
  blocker.commands = [blocker.entryCommand, blocker.auditCommand].filter(Boolean);
}

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  scopeMode: 'data_only',
  summary: {
    blockerCount: blockers.length,
    criticalCount: blockers.filter((blocker) => blocker.status === 'critical_gap').length,
    actionableCount: blockers.filter((blocker) => blocker.actionableFromDisk).length,
    explicitOnly: true,
  },
  inputs: {
    exhaustiveGapPath: path.relative(repoRoot, exhaustiveGapPath),
    informationInventoryPath: path.relative(repoRoot, informationInventoryPath),
    providerRegistryPath: providerRegistryPath ? path.relative(repoRoot, providerRegistryPath) : null,
    advocateRegistryPath: advocateRegistryPath ? path.relative(repoRoot, advocateRegistryPath) : null,
    competitiveRegistryPath: competitiveRegistryPath ? path.relative(repoRoot, competitiveRegistryPath) : null,
  },
  blockers,
};

const mdLines = [
  '# Track A Blocker Registry',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  'This artifact consolidates the remaining non-runtime Track A blockers into one resumable registry backed by generated audits and saved run artifacts.',
  '',
  '## Summary',
  '',
  `- blocker count: ${payload.summary.blockerCount}`,
  `- critical blockers: ${payload.summary.criticalCount}`,
  `- explicit only: ${payload.summary.explicitOnly ? 'yes' : 'no'}`,
  '',
  '## Blockers',
  '',
];

for (const blocker of blockers) {
  mdLines.push(`### ${blocker.label}`);
  mdLines.push('');
  mdLines.push(`- id: ${blocker.id}`);
  mdLines.push(`- status: ${blocker.status}`);
  mdLines.push(`- current state: ${blocker.currentState}`);
  mdLines.push(`- summary: ${blocker.summary}`);
  mdLines.push(`- evidence: ${blocker.evidence}`);
  mdLines.push(`- next operator action: ${blocker.nextOperatorAction}`);
  if (blocker.entryCommand) {
    mdLines.push(`- entry command: ${blocker.entryCommand}`);
  }
  if (blocker.auditCommand) {
    mdLines.push(`- queue audit: ${blocker.auditCommand}`);
  }
  if (blocker.sourceArtifacts.length) {
    mdLines.push(`- artifacts: ${blocker.sourceArtifacts.join(', ')}`);
  }
  const metricEntries = Object.entries(blocker.metrics || {});
  if (metricEntries.length) {
    mdLines.push('- metrics:');
    for (const [key, value] of metricEntries) {
      mdLines.push(`  - ${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`);
    }
  }
  mdLines.push('');
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  blockerCount: payload.summary.blockerCount,
  criticalCount: payload.summary.criticalCount,
}, null, 2));
