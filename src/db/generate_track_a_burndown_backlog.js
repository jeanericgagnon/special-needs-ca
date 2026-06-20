import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `track-a-burndown-backlog-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `track-a-burndown-backlog-${generatedDate}.md`);

const blockerCommandMap = {
  provider_directory: {
    entryCommand: 'npm run run:next-provider-depth-step',
    auditCommand: 'npm run audit:source-acquisition-completion-plan',
  },
  knowledge_content_depth: {
    entryCommand: 'npm run run:next-knowledge-content-step',
    auditCommand: 'npm run audit:knowledge-content-status-queue',
  },
  advocate_directory_depth: {
    entryCommand: 'npm run run:next-advocate-depth-step',
    auditCommand: 'npm run audit:advocate-depth-queue',
  },
  normalization_depth: {
    entryCommand: 'npm run run:next-normalization-step',
    auditCommand: 'npm run audit:normalization-gap-queue',
  },
  directory_foundation_signals: {
    entryCommand: 'npm run run:next-directory-foundation-step',
    auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
  },
};

const FIXED_BLOCKER_ORDER = [
  'provider_directory',
  'knowledge_content_depth',
  'advocate_directory_depth',
  'directory_foundation_signals',
  'normalization_depth',
];

const helperScriptMap = {
  provider_directory: 'scripts/run-next-provider-depth-step.mjs',
  knowledge_content_depth: 'scripts/run-next-knowledge-content-step.mjs',
  advocate_directory_depth: 'scripts/run-next-advocate-depth-step.mjs',
  normalization_depth: 'scripts/run-next-normalization-step.mjs',
  directory_foundation_signals: 'scripts/run-next-directory-foundation-step.mjs',
};

const providerPullNowStatePacketsPrefix = 'provider-pull-now-state-packets-';
const knowledgeRepairQueuePrefix = 'knowledge-content-repair-queue-';
const authoredMissingSourceTargetsPrefix = 'authored-missing-source-targets-';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function actionableKnowledgeQueueCount(queue) {
  const byFinalStatus = queue?.summary?.byFinalStatus || {};
  return Number(byFinalStatus.pending_exact_target || 0)
    + Number(byFinalStatus.accepted_not_promoted || 0)
    + Number(byFinalStatus.fetch_blocked || 0)
    + Number(byFinalStatus.validation_rejected || 0)
    + Number(byFinalStatus.reviewed_replacement_ready || 0);
}

function authoredKnowledgeTargetCount(payload) {
  const summaryCount = Number(payload?.summary?.knowledgeContentTargetCount || 0);
  if (summaryCount > 0) return summaryCount;
  return Array.isArray(payload?.targets)
    ? payload.targets.filter((target) => String(target?.gapFamily || '').trim() === 'knowledge_content').length
    : 0;
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated artifact for prefix: ${prefix}`);
  }
  return path.join(docsDir, matches.at(-1));
}

function probeHelper(blockerId) {
  const scriptRelativePath = helperScriptMap[blockerId];
  if (!scriptRelativePath) {
    return { helperMode: 'unprobed', helperActionable: null, helperNextAction: null };
  }

  const scriptPath = path.join(repoRoot, scriptRelativePath);
  if (!fs.existsSync(scriptPath)) {
    return { helperMode: 'helper_missing', helperActionable: null, helperNextAction: null };
  }

  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    return {
      helperMode: 'helper_error',
      helperActionable: null,
      helperNextAction: `Helper probe failed for ${blockerId}.`,
    };
  }

  try {
    const payload = JSON.parse(result.stdout.trim());
    const helperMode = String(payload?.mode || 'unprobed');
    const commands = Array.isArray(payload?.commands) ? payload.commands.filter(Boolean) : [];
    return {
      helperMode,
      helperActionable: !helperMode.endsWith('_idle') && commands.length > 0,
      helperNextAction: String(payload?.nextAction || payload?.selectedTarget?.nextAction || payload?.selectedRow?.nextAction || ''),
      helperSelectedTarget: payload?.selectedTarget || payload?.selectedRow || null,
    };
  } catch {
    return {
      helperMode: 'helper_parse_error',
      helperActionable: null,
      helperNextAction: `Helper output was not valid JSON for ${blockerId}.`,
    };
  }
}

const blockerRegistryPath = latestGeneratedJson('track-a-blocker-registry-');
const providerQueuePath = latestGeneratedJson('provider-followup-repair-queue-');
const providerAuthoringBacklogPath = latestGeneratedJson('provider-authoring-backlog-');
const providerPullNowStatePacketsPath = latestGeneratedJson(providerPullNowStatePacketsPrefix);
const knowledgeQueuePath = latestGeneratedJson('knowledge-content-status-queue-');
const knowledgeRepairQueuePath = latestGeneratedJson(knowledgeRepairQueuePrefix);
const authoredMissingSourceTargetsPath = latestGeneratedJson(authoredMissingSourceTargetsPrefix);
const advocateQueuePath = latestGeneratedJson('advocate-depth-queue-');
const normalizationQueuePath = latestGeneratedJson('normalization-gap-queue-');
const foundationQueuePath = latestGeneratedJson('directory-foundation-enrichment-queue-');

const blockerRegistry = readJson(blockerRegistryPath);
const providerQueue = readJson(providerQueuePath);
const providerAuthoringBacklog = readJson(providerAuthoringBacklogPath);
const providerPullNowStatePackets = readJson(providerPullNowStatePacketsPath);
const knowledgeQueue = readJson(knowledgeQueuePath);
const knowledgeRepairQueue = readJson(knowledgeRepairQueuePath);
const authoredMissingSourceTargets = readJson(authoredMissingSourceTargetsPath);
const advocateQueue = readJson(advocateQueuePath);
const normalizationQueue = readJson(normalizationQueuePath);
const foundationQueue = readJson(foundationQueuePath);

const blockerById = new Map((blockerRegistry.blockers || []).map((blocker) => [blocker.id, blocker]));

const candidateBacklog = [
  {
    blockerId: 'provider_directory',
    queueArtifact: path.relative(repoRoot, providerQueuePath),
    queueCount: Number(providerQueue.summary?.totalRows || 0),
    critical: true,
    reason: 'Largest critical local-help gap and already split into exact provider repair actions.',
    nextAction: blockerById.get('provider_directory')?.nextOperatorAction || '',
  },
  {
    blockerId: 'knowledge_content_depth',
    queueArtifact: path.relative(repoRoot, knowledgeQueuePath),
    queueCount: actionableKnowledgeQueueCount(knowledgeQueue),
    critical: true,
    reason: 'Critical content gap with a small exact-target queue that can be exhausted cheaply.',
    nextAction: blockerById.get('knowledge_content_depth')?.nextOperatorAction || '',
  },
  {
    blockerId: 'advocate_directory_depth',
    queueArtifact: path.relative(repoRoot, advocateQueuePath),
    queueCount: Number(advocateQueue.summary?.totalRows || 0),
    critical: false,
    reason: 'Truth-safe advocate depth remains weak and California has a discrete county-recovery lane.',
    nextAction: blockerById.get('advocate_directory_depth')?.nextOperatorAction || '',
  },
  {
    blockerId: 'normalization_depth',
    queueArtifact: path.relative(repoRoot, normalizationQueuePath),
    queueCount: Number(normalizationQueue.summary?.totalRows || 0),
    critical: false,
    reason: 'Normalization has a small provider service-location backlog and should stay evidence-bound.',
    nextAction: blockerById.get('normalization_depth')?.nextOperatorAction || '',
  },
  {
    blockerId: 'directory_foundation_signals',
    queueArtifact: path.relative(repoRoot, foundationQueuePath),
    queueCount: Number(foundationQueue.summary?.totalRows || 0),
    critical: false,
    reason: 'Metadata enrichment is broad but lower priority than critical provider and knowledge closure.',
    nextAction: blockerById.get('directory_foundation_signals')?.nextOperatorAction || '',
  },
];

const backlog = candidateBacklog
  .filter((item) => {
    const blocker = blockerById.get(item.blockerId);
    return item.queueCount > 0 || Boolean(blocker && blocker.status && blocker.status !== 'resolved');
  })
  .map((item, index) => {
    const helperProbe = probeHelper(item.blockerId);
    const entryCommand = blockerById.get(item.blockerId)?.entryCommand || blockerCommandMap[item.blockerId]?.entryCommand || null;
    const auditCommand = blockerById.get(item.blockerId)?.auditCommand || blockerCommandMap[item.blockerId]?.auditCommand || null;
    const providerUsesAuthoringBacklog = item.blockerId === 'provider_directory'
      && String(helperProbe.helperMode || '') === 'provider_depth_authoring_next_step';
    const knowledgeUsesAuthoringBacklog = item.blockerId === 'knowledge_content_depth'
      && String(helperProbe.helperMode || '') === 'knowledge_content_authoring_next_step';
    const knowledgeUsesRepairQueue = item.blockerId === 'knowledge_content_depth'
      && String(helperProbe.helperSelectedTarget?.finalStatus || '') === 'fetch_blocked';
    const resolvedEntryCommand = knowledgeUsesRepairQueue
      ? String(helperProbe.helperSelectedTarget?.entryCommand || entryCommand || '')
      : entryCommand;
    const resolvedAuditCommand = knowledgeUsesAuthoringBacklog
      ? 'npm run audit:authored-missing-source-targets'
      : knowledgeUsesRepairQueue
      ? String(helperProbe.helperSelectedTarget?.auditCommand || auditCommand || '')
      : auditCommand;
    return {
      ...item,
      queueArtifact: item.blockerId === 'provider_directory'
        && String(helperProbe.helperMode || '') === 'provider_pull_now_state_packet_next_step'
        ? path.relative(repoRoot, providerPullNowStatePacketsPath)
        : knowledgeUsesRepairQueue
          ? path.relative(repoRoot, knowledgeRepairQueuePath)
        : knowledgeUsesAuthoringBacklog
          ? path.relative(repoRoot, authoredMissingSourceTargetsPath)
        : providerUsesAuthoringBacklog
          ? path.relative(repoRoot, providerAuthoringBacklogPath)
          : item.queueArtifact,
      queueCount: item.blockerId === 'provider_directory'
        && String(helperProbe.helperMode || '') === 'provider_pull_now_state_packet_next_step'
        ? Number(providerPullNowStatePackets.summary?.totalUnresolvedRows || 0)
        : knowledgeUsesRepairQueue
          ? Number(knowledgeRepairQueue.summary?.totalRows || 0)
        : knowledgeUsesAuthoringBacklog
          ? authoredKnowledgeTargetCount(authoredMissingSourceTargets)
        : providerUsesAuthoringBacklog
          ? Number(providerAuthoringBacklog.summary?.totalRows || 0)
          : item.queueCount,
      status: blockerById.get(item.blockerId)?.status || null,
      entryCommand: resolvedEntryCommand,
      auditCommand: resolvedAuditCommand,
      commands: [resolvedEntryCommand, resolvedAuditCommand].filter(Boolean),
      helperMode: helperProbe.helperMode,
      helperActionable: helperProbe.helperActionable,
      helperNextAction: helperProbe.helperNextAction,
      helperSelectedTarget: helperProbe.helperSelectedTarget || null,
      nextAction: helperProbe.helperNextAction || item.nextAction,
      successCondition: blockerById.get(item.blockerId)?.successCondition || '',
      priorityRank: index + 1,
    };
  })
  .filter((item) => Number(item.queueCount || 0) > 0 || Boolean(item.helperActionable))
  .sort((a, b) =>
    FIXED_BLOCKER_ORDER.indexOf(a.blockerId) - FIXED_BLOCKER_ORDER.indexOf(b.blockerId)
    || Number(Boolean(b.critical)) - Number(Boolean(a.critical))
    || Number(a.priorityRank || 99) - Number(b.priorityRank || 99)
  )
  .map((item, index) => ({
    ...item,
    executionPriority: index + 1,
  }));

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    blockerRegistryPath: path.relative(repoRoot, blockerRegistryPath),
    providerQueuePath: path.relative(repoRoot, providerQueuePath),
    providerAuthoringBacklogPath: path.relative(repoRoot, providerAuthoringBacklogPath),
    knowledgeQueuePath: path.relative(repoRoot, knowledgeQueuePath),
    advocateQueuePath: path.relative(repoRoot, advocateQueuePath),
    normalizationQueuePath: path.relative(repoRoot, normalizationQueuePath),
    foundationQueuePath: path.relative(repoRoot, foundationQueuePath),
  },
  summary: {
    blockerCount: backlog.length,
    criticalCount: backlog.filter((item) => item.critical).length,
    firstPriorityBlocker: backlog[0]?.blockerId || null,
  },
  backlog,
};

const mdLines = [
  '# Track A Burndown Backlog',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  'This artifact ranks the saved Track A blocker queues in the order they should be worked next.',
  '',
  '## Backlog',
  '',
];

for (const item of backlog) {
  mdLines.push(`- P${item.executionPriority} ${item.blockerId}: queue=${item.queueCount} | helper=${item.helperMode} | artifact=${item.queueArtifact}`);
  mdLines.push(`  Entry command: ${item.entryCommand || 'n/a'}`);
  mdLines.push(`  Queue audit: ${item.auditCommand || 'n/a'}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  summary: payload.summary,
}, null, 2));
