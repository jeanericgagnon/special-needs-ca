import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `track-a-operator-handoff-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `track-a-operator-handoff-${generatedDate}.md`);

const blockerCommandMap = {
  provider_directory: {
    family: 'providers_care',
    helperCommand: 'npm run run:next-provider-depth-step',
    auditCommand: 'npm run audit:source-acquisition-completion-plan',
  },
  knowledge_content_depth: {
    family: 'knowledge_content',
    helperCommand: 'npm run run:next-knowledge-content-step',
    auditCommand: 'npm run audit:knowledge-content-status-queue',
  },
  advocate_directory_depth: {
    family: 'advocates_legal',
    helperCommand: 'npm run run:next-advocate-depth-step',
    auditCommand: 'npm run audit:advocate-depth-queue',
  },
  directory_foundation_signals: {
    family: 'providers_care',
    helperCommand: 'npm run run:next-directory-foundation-step',
    auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
  },
  normalization_depth: {
    family: 'providers_care',
    helperCommand: 'npm run run:next-normalization-step',
    auditCommand: 'npm run audit:normalization-gap-queue',
  },
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

function authoredKnowledgeTargetCount(payload) {
  const summaryCount = Number(payload?.summary?.knowledgeContentTargetCount || 0);
  if (summaryCount > 0) return summaryCount;
  return Array.isArray(payload?.targets)
    ? payload.targets.filter((target) => String(target?.gapFamily || '').trim() === 'knowledge_content').length
    : 0;
}

const backlogPath = latestGeneratedJson('track-a-burndown-backlog-');
const coveragePath = latestGeneratedJson('track-a-blocker-coverage-audit-');
const blockerRegistryPath = latestGeneratedJson('track-a-blocker-registry-');
const maxInfoPath = latestGeneratedJson('max-info-program-');
const backlog = readJson(backlogPath);
const coverage = readJson(coveragePath);
const blockerRegistry = readJson(blockerRegistryPath);
const maxInfo = readJson(maxInfoPath);
const providerAuthoringStatePacketsPath = latestGeneratedJson('provider-authoring-state-packets-');
const providerAuthoringStatePackets = readJson(providerAuthoringStatePacketsPath);
const authoredMissingSourceTargetsPath = latestGeneratedJson('authored-missing-source-targets-');
const authoredMissingSourceTargets = readJson(authoredMissingSourceTargetsPath);

const blockerById = new Map((blockerRegistry.blockers || []).map((blocker) => [blocker.id, blocker]));

const handoffRows = (backlog.backlog || []).map((item) => {
  const blocker = blockerById.get(item.blockerId);
  const commandConfig = blockerCommandMap[item.blockerId] || {};
  const helperCommands = [
    commandConfig.helperCommand,
    commandConfig.auditCommand,
  ].filter(Boolean);
  const supportingArtifacts = [];
  if (item.blockerId === 'provider_directory') {
    if (String(item.helperMode || '') === 'provider_pull_now_state_packet_next_step') {
      const packetJsonPath = String(item.helperSelectedTarget?.nextStatePacketJsonPath || '').trim();
      const packetMarkdownPath = String(item.helperSelectedTarget?.nextStatePacketMarkdownPath || '').trim();
      if (packetJsonPath) supportingArtifacts.push(packetJsonPath);
      if (packetMarkdownPath) supportingArtifacts.push(packetMarkdownPath);
    } else {
      supportingArtifacts.push(path.relative(repoRoot, providerAuthoringStatePacketsPath));
      const firstPacket = Array.isArray(providerAuthoringStatePackets.packets) ? providerAuthoringStatePackets.packets[0] : null;
      if (firstPacket?.jsonPath) supportingArtifacts.push(firstPacket.jsonPath);
      if (firstPacket?.markdownPath) supportingArtifacts.push(firstPacket.markdownPath);
      const firstStateId = String(firstPacket?.stateId || '').trim().toLowerCase();
      const providerAuthoringWorkfilePath = firstStateId
        ? path.join(repoRoot, 'data', 'provider-authoring-state-workfiles', `provider-authoring-state-workfile-${firstStateId}.json`)
        : '';
      const providerAuthoringWorkfileStatusPath = firstStateId
        ? path.join(docsDir, `provider-authoring-state-workfile-status-${firstStateId}-${generatedDate}.json`)
        : '';
      if (providerAuthoringWorkfilePath && fs.existsSync(providerAuthoringWorkfilePath)) {
        supportingArtifacts.push(path.relative(repoRoot, providerAuthoringWorkfilePath));
      }
      if (providerAuthoringWorkfileStatusPath && fs.existsSync(providerAuthoringWorkfileStatusPath)) {
        supportingArtifacts.push(path.relative(repoRoot, providerAuthoringWorkfileStatusPath));
      }
    }
  } else if (item.blockerId === 'knowledge_content_depth') {
    supportingArtifacts.push(path.relative(repoRoot, authoredMissingSourceTargetsPath));
    if (String(item.queueArtifact || '').includes('knowledge-content-repair-queue-')
      || String(item.queueArtifact || '').includes('knowledge-content-status-queue-')) {
      supportingArtifacts.push(item.queueArtifact);
    }
    if (String(item.queueArtifact || '').includes('authored-missing-source-targets-')) {
      supportingArtifacts.push(`knowledge-target-count:${authoredKnowledgeTargetCount(authoredMissingSourceTargets)}`);
    }
    const knowledgeSelectedUrl = String(item.helperSelectedTarget?.sourceUrl || '').trim();
    if (knowledgeSelectedUrl) {
      const matchingTarget = (authoredMissingSourceTargets.targets || []).find((target) => String(target.sourceUrl || '').trim() === knowledgeSelectedUrl);
      if (matchingTarget?.id) {
        supportingArtifacts.push(`knowledge-target:${matchingTarget.id}`);
      }
    }
  }
  return {
    executionPriority: item.executionPriority,
    blockerId: item.blockerId,
    family: commandConfig.family || null,
    status: blocker?.status || 'unknown',
    queueArtifact: item.queueArtifact,
    executionArtifact: item.queueArtifact,
    supportingArtifacts,
    queueCount: item.queueCount,
    nextAction: item.nextAction,
    successCondition: item.successCondition || blocker?.successCondition || '',
    entryCommand: item.entryCommand || commandConfig.helperCommand || null,
    auditCommand: item.auditCommand || commandConfig.auditCommand || null,
    commands: item.commands || helperCommands,
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    backlogPath: path.relative(repoRoot, backlogPath),
    coveragePath: path.relative(repoRoot, coveragePath),
    blockerRegistryPath: path.relative(repoRoot, blockerRegistryPath),
    maxInfoPath: path.relative(repoRoot, maxInfoPath),
  },
  summary: {
    missingSourceFamilyCount: coverage.summary?.missingSourceFamilyCount || 0,
    unknownBlockerCount: coverage.summary?.unknownBlockerCount || 0,
    blockerCount: handoffRows.length,
    firstPriorityBlocker: handoffRows[0]?.blockerId || null,
  },
  topLevelCommand: 'npm run run:next-track-a-step',
  commandCadence: maxInfo.tracks?.informationExhaustiveness?.commandCadence || [],
  handoffRows,
};

const mdLines = [
  '# Track A Operator Handoff',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  'This artifact is the single handoff surface for continuing Track A from disk.',
  '',
  '## Summary',
  '',
  `- missing source families: ${payload.summary.missingSourceFamilyCount}`,
  `- unknown blockers: ${payload.summary.unknownBlockerCount}`,
  `- blocker count: ${payload.summary.blockerCount}`,
  `- first priority blocker: ${payload.summary.firstPriorityBlocker}`,
  '',
  '## Handoff',
  '',
];

for (const row of handoffRows) {
  mdLines.push(`- P${row.executionPriority} ${row.blockerId}: queue=${row.queueArtifact} (${row.queueCount})`);
  mdLines.push(`  Entry command: ${row.entryCommand || 'n/a'}`);
  mdLines.push(`  Queue audit: ${row.auditCommand || 'n/a'}`);
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
