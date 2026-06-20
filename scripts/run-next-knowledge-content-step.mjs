import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const outputRoot = path.join(repoRoot, 'data', 'source-acquisition-runs');
const queuePath = path.join(docsDir, `knowledge-content-status-queue-${generatedDate}.json`);
const authoredTargetsPath = path.join(docsDir, `authored-missing-source-targets-${generatedDate}.json`);
const completionPlanPath = path.join(docsDir, `source-acquisition-completion-plan-${generatedDate}.json`);
const missingFamiliesPath = path.join(docsDir, `missing-source-families-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return readJson(filePath);
}

function buildReadyKnowledgeUrlSet() {
  if (!fs.existsSync(completionPlanPath)) return null;
  try {
    const payload = readJson(completionPlanPath);
    const rows = Array.isArray(payload.combinedReadyRows) ? payload.combinedReadyRows : [];
    const readyUrls = rows
      .filter((row) => String(row.gapFamily || '') === 'knowledge_content')
      .map((row) => normalizeUrl(row.sourceUrl || row.finalUrl || row.canonicalUrl))
      .filter(Boolean);
    return new Set(readyUrls);
  } catch {
    return null;
  }
}

function shellEscape(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function normalizeUrl(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return '';
  try {
    const url = new URL(value);
    url.hash = '';
    if (url.pathname !== '/') {
      url.pathname = url.pathname
        .replace(/\/index\.html?$/i, '')
        .replace(/\/+$/, '');
    }
    return url.toString();
  } catch {
    return value
      .replace(/\/index\.html?$/i, '')
      .replace(/\/+$/, '');
  }
}

function findLatestAcceptedRunId(sourceUrl) {
  if (!fs.existsSync(outputRoot)) return '';
  const normalizedSourceUrl = normalizeUrl(sourceUrl);
  const runIds = fs.readdirSync(outputRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  for (const runId of runIds) {
    const acceptedPath = path.join(outputRoot, runId, 'validated', 'knowledge_content', 'accepted.ndjson');
    if (!fs.existsSync(acceptedPath)) continue;
    const lines = fs.readFileSync(acceptedPath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      const row = JSON.parse(line);
      const candidateUrl = normalizeUrl(row.sourceUrl || row.finalUrl || row.canonicalUrl);
      if (candidateUrl === normalizedSourceUrl) return runId;
    }
  }

  return '';
}

function hasOpenKnowledgeMissingFamily() {
  const payload = readJsonIfExists(missingFamiliesPath, { families: [] });
  const families = Array.isArray(payload?.families) ? payload.families : [];
  return families.some((family) => {
    const id = String(family?.id || '').trim();
    const label = String(family?.label || '').toLowerCase();
    const reason = String(family?.reason || '').toLowerCase();
    return id === 'knowledge_content_sources'
      || label.includes('knowledge')
      || reason.includes('knowledge');
  });
}

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing knowledge content status queue: ${queuePath}. Run npm run audit:knowledge-content-status-queue first.`);
}

const queue = readJson(queuePath);
const rows = Array.isArray(queue.rows) ? queue.rows : [];
const readyKnowledgeUrls = buildReadyKnowledgeUrlSet();

const statusPriority = {
  pending_exact_target: 1,
  reviewed_replacement_ready: 1,
  accepted_not_promoted: 2,
  validation_rejected: 3,
  fetch_blocked: 4,
};

const rawActionableRows = rows
  .filter((row) => {
    const status = String(row.finalStatus || '');
    const followupReason = String(row.lastFollowupReason || '');
    return ['pending_exact_target', 'reviewed_replacement_ready', 'accepted_not_promoted', 'validation_rejected', 'fetch_blocked'].includes(status)
      || (status === 'deferred_unresolved' && followupReason === 'sandbox_network_disabled');
  });

let actionableRows = rawActionableRows
  .filter((row) => {
    const status = String(row.finalStatus || '');
    if (!readyKnowledgeUrls) return true;
    if (
      !['pending_exact_target', 'reviewed_replacement_ready'].includes(status)
      && !(status === 'deferred_unresolved' && String(row.lastFollowupReason || '') === 'sandbox_network_disabled')
    ) return true;
    return readyKnowledgeUrls.has(normalizeUrl(row.sourceUrl));
  })
  .sort((a, b) =>
    (statusPriority[a.finalStatus] || 99) - (statusPriority[b.finalStatus] || 99)
    || String(a.sourceName || '').localeCompare(String(b.sourceName || ''))
  );

if (!actionableRows.length) {
  const pendingRows = rawActionableRows
    .filter((row) => {
      const status = String(row.finalStatus || '');
      return ['pending_exact_target', 'reviewed_replacement_ready'].includes(status)
        || (status === 'deferred_unresolved' && String(row.lastFollowupReason || '') === 'sandbox_network_disabled');
    })
    .filter((row) => {
      if (!readyKnowledgeUrls) return true;
      return readyKnowledgeUrls.has(normalizeUrl(row.sourceUrl));
    })
    .sort((a, b) => String(a.sourceName || '').localeCompare(String(b.sourceName || '')));
  if (pendingRows.length) {
    actionableRows = pendingRows;
  }
}

const nextRow = actionableRows[0] || null;
const hiddenActionableRows = rawActionableRows.filter((row) => {
  if (!readyKnowledgeUrls) return false;
  return !readyKnowledgeUrls.has(normalizeUrl(row.sourceUrl));
});

if (!nextRow) {
  const duplicateCount = Number(queue.summary?.byFinalStatus?.duplicate_of_existing_live_article || 0);
  const promotedCount = Number(queue.summary?.byFinalStatus?.promoted_live || 0);
  const deferredCount = Number(queue.summary?.byFinalStatus?.deferred_blocked_source || 0);
  const deferredUnresolvedCount = Number(queue.summary?.byFinalStatus?.deferred_unresolved || 0);
  const needsAuthoringRefresh =
    hasOpenKnowledgeMissingFamily()
    || hiddenActionableRows.length > 0
    || (String(queue.summary?.blockerStatus || '') === 'critical_gap' && deferredUnresolvedCount > 0);
  if (!needsAuthoringRefresh) {
    console.log(JSON.stringify({
      mode: 'knowledge_content_idle',
      queuePath,
      blockerStatus: queue.summary?.blockerStatus || 'unknown',
      nextAction: 'All exact knowledge targets are already promoted, duplicate, or explicitly deferred from disk; no bounded knowledge step is currently actionable.',
      selectedTarget: null,
      commands: [],
      summary: {
        duplicateCount,
        promotedCount,
        deferredCount,
        deferredUnresolvedCount,
      },
    }, null, 2));
    process.exit(0);
  }
  console.log(JSON.stringify({
    mode: 'knowledge_content_authoring_next_step',
    queuePath,
    blockerStatus: queue.summary?.blockerStatus || 'unknown',
    nextAction: 'Knowledge exact-target queue is saturated with duplicates, promoted rows, or deferred sources; expand the authored knowledge source pack before more fetch work.',
    selectedTarget: {
      scope: 'knowledge_source_pack_authoring',
      duplicateCount,
      promotedCount,
      deferredCount,
      deferredUnresolvedCount,
      authoredTargetsPath: fs.existsSync(authoredTargetsPath) ? authoredTargetsPath : '',
      completionPlanPath: fs.existsSync(completionPlanPath) ? completionPlanPath : '',
      nextAction: 'Regenerate authored knowledge targets and the source acquisition completion plan, then add new exact high-trust topics before spending more knowledge fetch volume.',
    },
    commands: [
      'npm run audit:authored-missing-source-targets',
      'npm run audit:source-acquisition-completion-plan',
      'npm run audit:knowledge-content-status-queue',
    ],
  }, null, 2));
  process.exit(0);
}

const sourceUrlPattern = shellEscape(nextRow.sourceUrl);
const latestAcceptedRunId = nextRow.finalStatus === 'accepted_not_promoted'
  ? (nextRow.latestAcceptedRunId || findLatestAcceptedRunId(nextRow.sourceUrl))
  : '';
const isSandboxRetryDeferredRow =
  nextRow.finalStatus === 'deferred_unresolved'
  && String(nextRow.lastFollowupReason || '') === 'sandbox_network_disabled';

const commands = !isSandboxRetryDeferredRow && Array.isArray(nextRow.nextCommands) && nextRow.nextCommands.length
  ? nextRow.nextCommands.map((command) => command.replace('<accepted-run-id>', latestAcceptedRunId || '<accepted-run-id>'))
  : (nextRow.finalStatus === 'accepted_not_promoted'
      ? [
          `npm run run:source-acquisition-stage -- --run-id=${latestAcceptedRunId || '<accepted-run-id>'} --family=knowledge_content --mode=dry-run`,
        ]
      : (
          isSandboxRetryDeferredRow
        )
          ? [
              `npm run run:source-acquisition-wave -- --mode=live --lane=ready_target_scrape --gap=knowledge_content --limit=1 --source-url-pattern=${sourceUrlPattern}`,
              'npm run run:source-acquisition-followups -- --run-id=<run-id>',
              'npm run run:source-acquisition-parse -- --run-id=<run-id> --family=knowledge_content',
              'npm run run:source-acquisition-validate -- --run-id=<run-id> --family=knowledge_content',
              'npm run run:source-acquisition-stage -- --run-id=<run-id> --family=knowledge_content --mode=dry-run',
            ]
      : [
          `npm run run:source-acquisition-wave -- --mode=live --lane=ready_target_scrape --gap=knowledge_content --limit=1 --source-url-pattern=${sourceUrlPattern}`,
          'npm run run:source-acquisition-followups -- --run-id=<run-id>',
          'npm run run:source-acquisition-parse -- --run-id=<run-id> --family=knowledge_content',
          'npm run run:source-acquisition-validate -- --run-id=<run-id> --family=knowledge_content',
          'npm run run:source-acquisition-stage -- --run-id=<run-id> --family=knowledge_content --mode=dry-run',
        ]);

console.log(JSON.stringify({
  mode: 'knowledge_content_next_step',
  queuePath,
  blockerStatus: queue.summary?.blockerStatus || 'unknown',
  selectedTarget: {
    sourceName: nextRow.sourceName,
    sourceUrl: nextRow.sourceUrl,
    finalStatus: nextRow.finalStatus,
    nextAction: nextRow.nextAction,
    latestAcceptedRunId: latestAcceptedRunId || null,
    entryCommand: nextRow.entryCommand || null,
    auditCommand: nextRow.auditCommand || null,
  },
  commands,
}, null, 2));
