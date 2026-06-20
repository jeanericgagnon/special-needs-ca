import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { familyDirName } from './source-acquisition-stage-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const stateDir = path.join(repoRoot, 'data', 'source-acquisition-state');
const runsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath, fallback = null) {
  return fs.existsSync(filePath) ? readJson(filePath) : fallback;
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
    return url.toString().toLowerCase();
  } catch {
    return value
      .replace(/\/index\.html?$/i, '')
      .replace(/\/+$/, '')
      .toLowerCase();
  }
}

function normalizeUrlFingerprint(rawUrl) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const pathFingerprint = url.pathname
      .toLowerCase()
      .replace(/\/+/g, '/')
      .replace(/\/$/, '')
      .split('/')
      .filter(Boolean)
      .map((segment) => segment.replace(/[^a-z0-9]/g, ''))
      .filter(Boolean)
      .join('/');
    return `${host}|${pathFingerprint}`;
  } catch {
    return String(rawUrl || '').trim().toLowerCase();
  }
}

function providerSelectionKey(stateId, rawUrl) {
  return `${String(stateId || '').trim()}|${normalizeUrlFingerprint(rawUrl)}`;
}

function shellEscape(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function parseLastJson(stdout) {
  const trimmed = String(stdout || '').trim();
  if (!trimmed) return null;
  const jsonStart = trimmed.lastIndexOf('\n{');
  if (jsonStart >= 0) return JSON.parse(trimmed.slice(jsonStart + 1));
  return trimmed.startsWith('{') ? JSON.parse(trimmed) : null;
}

function runNodeScript(scriptRelativePath, args = []) {
  const scriptPath = path.resolve(__dirname, '..', scriptRelativePath);
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Command failed.\nSCRIPT: ${scriptRelativePath}\nARGS: ${args.join(' ')}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return parseLastJson(result.stdout);
}

function loadAcceptedProviderUrls() {
  const urls = new Set();
  if (!fs.existsSync(runsDir)) return urls;
  for (const runId of fs.readdirSync(runsDir).sort()) {
    const acceptedPath = path.join(runsDir, runId, 'validated', 'providers_care', 'accepted.ndjson');
    if (!fs.existsSync(acceptedPath)) continue;
    const lines = fs.readFileSync(acceptedPath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      const row = JSON.parse(line);
      const normalized = normalizeUrl(row?.sourceUrl);
      if (normalized) urls.add(normalized);
    }
  }
  return urls;
}

function loadRejectedProviderUrls() {
  const urls = new Set();
  if (!fs.existsSync(runsDir)) return urls;
  for (const runId of fs.readdirSync(runsDir).sort()) {
    const rejectedPath = path.join(runsDir, runId, 'validated', 'providers_care', 'rejected.ndjson');
    if (!fs.existsSync(rejectedPath)) continue;
    const lines = fs.readFileSync(rejectedPath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      const row = JSON.parse(line);
      const normalized = normalizeUrl(row?.sourceUrl);
      if (normalized) urls.add(normalized);
    }
  }
  return urls;
}

function loadFollowupProviderUrls() {
  const urls = new Set();
  if (!fs.existsSync(runsDir)) return urls;
  for (const runId of fs.readdirSync(runsDir).sort()) {
    const followupDir = path.join(runsDir, runId, 'followups');
    if (!fs.existsSync(followupDir)) continue;
    for (const fileName of ['source-repair.json', 'blocked-failures.json', 'retryable-failures.json']) {
      const filePath = path.join(followupDir, fileName);
      if (!fs.existsSync(filePath)) continue;
      const rows = readJson(filePath);
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (String(row?.gapFamily || '') !== 'providers_care') continue;
        const normalized = normalizeUrl(row?.sourceUrl);
        if (normalized) urls.add(normalized);
      }
    }
  }
  return urls;
}

function loadResolvedProviderUrls() {
  const ledgerPath = path.join(stateDir, 'provider-pull-now-resolution-ledger.json');
  if (!fs.existsSync(ledgerPath)) return new Set();
  const ledger = readJson(ledgerPath);
  const rows = Array.isArray(ledger?.rows) ? ledger.rows : [];
  return new Set(rows.map((row) => normalizeUrl(row?.sourceUrl)).filter(Boolean));
}

function loadAlreadyStagedProviderKeys() {
  if (!fs.existsSync(dbPath)) return new Set();
  const db = new Database(dbPath, { readonly: true });
  try {
    const rows = db.prepare(`
      SELECT DISTINCT state_id, source_url
      FROM staging_scraped_resource_providers
      WHERE source_type = 'lightweight_source_acquisition'
        AND source_url IS NOT NULL
        AND TRIM(source_url) <> ''
    `).all();
    return new Set(rows.map((row) => providerSelectionKey(row.state_id, row.source_url)));
  } finally {
    db.close();
  }
}

function loadProviderStagedRunSummary(runId) {
  const summaryPath = path.join(runsDir, runId, 'staged', familyDirName('providers_care'), 'promotion-summary.json');
  if (!fs.existsSync(summaryPath)) return null;
  return {
    runId,
    summaryPath,
    summary: readJson(summaryPath),
  };
}

function latestProviderStagedRunSummary() {
  if (!fs.existsSync(runsDir)) return null;
  const runIds = fs.readdirSync(runsDir).sort();
  for (let index = runIds.length - 1; index >= 0; index -= 1) {
    const result = loadProviderStagedRunSummary(runIds[index]);
    if (result) return result;
  }
  return null;
}

function countProviderScopedStagingRows(runId) {
  const candidatesPath = path.join(runsDir, runId, 'staged', familyDirName('providers_care'), 'promotion-candidates.ndjson');
  if (!fs.existsSync(candidatesPath) || !fs.existsSync(dbPath)) {
    return {
      matchedRows: 0,
      statusCounts: {},
    };
  }

  const candidateRows = fs.readFileSync(candidatesPath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .map((entry) => entry?.candidate?.row || null)
    .filter(Boolean);

  if (!candidateRows.length) {
    return {
      matchedRows: 0,
      statusCounts: {},
    };
  }

  const db = new Database(dbPath, { readonly: true });
  try {
    const select = db.prepare(`
      SELECT review_status
      FROM staging_scraped_resource_providers
      WHERE state_id = ?
        AND source_url = ?
        AND extracted_name = ?
        AND source_type = 'lightweight_source_acquisition'
    `);
    const statusCounts = {};
    let matchedRows = 0;
    let unresolvedRows = 0;
    const isTerminalStatus = (status) =>
      status === 'rejected_duplicate'
      || status === 'auto_accepted'
      || status.startsWith('blocked_');
    for (const row of candidateRows) {
      const hits = select.all(row.state_id || '', row.source_url || '', row.extracted_name || '');
      for (const hit of hits) {
        matchedRows += 1;
        const status = String(hit.review_status || 'null');
        statusCounts[status] = (statusCounts[status] || 0) + 1;
        if (!isTerminalStatus(status)) unresolvedRows += 1;
      }
    }
    return { matchedRows, unresolvedRows, statusCounts };
  } finally {
    db.close();
  }
}

function loadRepeatedProviderBlockerUrls() {
  const registryPath = path.join(docsDir, `provider-followup-blocker-registry-${generatedDate}.json`);
  if (!fs.existsSync(registryPath)) return new Set();
  const payload = readJson(registryPath);
  const rows = Array.isArray(payload?.rows) ? payload.rows : [];
  return new Set(rows.map((row) => normalizeUrl(row?.sourceUrl)).filter(Boolean));
}

function loadAuthoredProviderUrls() {
  if (!fs.existsSync(docsDir)) return new Set();
  const files = fs.readdirSync(docsDir)
    .filter((name) => name.startsWith('provider-repair-authoring-brief-') && name.endsWith('.json'))
    .sort();
  const urls = new Set();
  for (const fileName of files) {
    const payload = readJson(path.join(docsDir, fileName));
    const rows = Array.isArray(payload?.rows) ? payload.rows : [];
    for (const row of rows) {
      const normalized = normalizeUrl(row?.sourceUrl);
      if (normalized) urls.add(normalized);
    }
  }
  return urls;
}

const completionPlanPath = path.join(docsDir, `source-acquisition-completion-plan-${generatedDate}.json`);
const sourcePackPath = path.join(docsDir, `provider-source-pack-plan-${generatedDate}.json`);
const lowTokenControlPlanePath = path.join(docsDir, `low-token-control-plane-${generatedDate}.json`);
const providerAuthoringPacketsIndexPath = path.join(docsDir, `provider-authoring-state-packets-${generatedDate}.json`);
const providerRepairQueuePath = path.join(docsDir, `provider-followup-repair-queue-${generatedDate}.json`);
const providerAuthoringBacklogPath = path.join(docsDir, `provider-authoring-backlog-${generatedDate}.json`);

if (!fs.existsSync(completionPlanPath)) {
  throw new Error(`Missing source acquisition completion plan: ${completionPlanPath}. Run npm run audit:source-acquisition-completion-plan first.`);
}
if (!fs.existsSync(sourcePackPath)) {
  throw new Error(`Missing provider source pack plan: ${sourcePackPath}. Run npm run audit:provider-source-pack first.`);
}

const completionPlan = readJson(completionPlanPath);
const sourcePack = readJson(sourcePackPath);
const lowTokenControlPlane = readJsonIfExists(lowTokenControlPlanePath, null);
const providerRepairQueue = readJsonIfExists(providerRepairQueuePath, null);
const providerAuthoringBacklog = readJsonIfExists(providerAuthoringBacklogPath, null);
const resolvedUrls = loadResolvedProviderUrls();
const authoredUrls = loadAuthoredProviderUrls();
const repeatedBlockerUrls = loadRepeatedProviderBlockerUrls();
const acceptedUrls = loadAcceptedProviderUrls();
const rejectedUrls = loadRejectedProviderUrls();
const followupUrls = loadFollowupProviderUrls();
const stagedProviderKeys = loadAlreadyStagedProviderKeys();

const statePriority = new Map(
  (sourcePack.states || []).map((state, index) => [String(state.stateId || '').trim().toLowerCase(), index + 1]),
);

const crawlPriority = {
  static_fetch: 1,
  playwright: 2,
  pdf_fetch: 3,
};

const rawRows = Array.isArray(completionPlan.combinedReadyRows)
  ? completionPlan.combinedReadyRows
  : Array.isArray(completionPlan.rows)
    ? completionPlan.rows
    : [];

const actionableRows = rawRows
  .filter((row) => row.gapFamily === 'providers_care')
  .filter((row) => row.executionLane === 'ready_target_scrape')
  .filter((row) => ['ready_lightweight', 'ready_js_heavy', 'ready_pdf'].includes(String(row.ledgerStatus || row.status || '')))
  .filter((row) => {
    const normalized = normalizeUrl(row.sourceUrl);
    return normalized
      && !resolvedUrls.has(normalized)
      && !authoredUrls.has(normalized)
      && !repeatedBlockerUrls.has(normalized)
      && !acceptedUrls.has(normalized)
      && !rejectedUrls.has(normalized)
      && !followupUrls.has(normalized)
      && !stagedProviderKeys.has(providerSelectionKey(row.stateId, row.sourceUrl));
  })
  .sort((a, b) =>
    (statePriority.get(String(a.stateId || '').trim().toLowerCase()) || 999) - (statePriority.get(String(b.stateId || '').trim().toLowerCase()) || 999)
    || (crawlPriority[String(a.crawlMethod || '')] || 99) - (crawlPriority[String(b.crawlMethod || '')] || 99)
    || String(a.stateId || '').localeCompare(String(b.stateId || ''))
    || String(a.sourceUrl || '').localeCompare(String(b.sourceUrl || ''))
  );

const nextRow = actionableRows[0] || null;

const providerRepairRows = Array.isArray(providerRepairQueue?.rows) ? providerRepairQueue.rows : [];
const nextRepairRow = providerRepairRows[0] || null;

if (nextRepairRow) {
  console.log(JSON.stringify({
    mode: 'provider_repair_next_step',
    completionPlanPath,
    sourcePackPath,
    providerRepairQueuePath,
    nextAction: 'Provider repair backlog is active; resolve the next blocked first-party provider target before more provider scraping or authoring.',
    selectedTarget: {
      scope: 'provider_repair_backlog',
      stateId: nextRepairRow.stateId || '',
      sourceUrl: nextRepairRow.sourceUrl || '',
      readinessLane: nextRepairRow.readinessLane || '',
      actionClass: nextRepairRow.actionClass || '',
      followupReason: nextRepairRow.followupReason || '',
      repeatCount: Number(nextRepairRow.repeatCount || 0),
      nextAction: nextRepairRow.recommendedAction || '',
    },
    commands: [
      'npm run run:next-provider-repair-batch',
      'npm run audit:provider-followup-repair-queue',
      'npm run audit:provider-repair-execution-backlog',
    ],
  }, null, 2));
  process.exit(0);
}

if (!nextRow) {
  const latestStagedProviderRun = latestProviderStagedRunSummary();
  const latestStagedScoped = latestStagedProviderRun
    ? countProviderScopedStagingRows(latestStagedProviderRun.runId)
    : { matchedRows: 0, unresolvedRows: 0, statusCounts: {} };
  if (latestStagedProviderRun && latestStagedScoped.unresolvedRows > 0) {
    const supportedCount = Number(latestStagedProviderRun.summary?.supportedCount || 0);
    const acceptedInputCount = Number(latestStagedProviderRun.summary?.acceptedInputCount || 0);
    console.log(JSON.stringify({
      mode: 'provider_depth_downstream_followup',
      completionPlanPath,
      sourcePackPath,
      nextAction: 'Provider ready queue is exhausted, but the latest staged provider run still has active unresolved staging rows.',
      selectedTarget: {
        scope: 'provider_downstream_followup',
        runId: latestStagedProviderRun.runId,
        supportedCount,
        acceptedInputCount,
        matchedStagingRows: latestStagedScoped.matchedRows,
        unresolvedStagingRows: latestStagedScoped.unresolvedRows,
        reviewStatusCounts: latestStagedScoped.statusCounts,
        nextAction: 'Continue the staged provider downstream lane with promote, support followup, and county geocode before declaring the provider family blocked.',
      },
      commands: [
        `npm run run:source-acquisition-promote -- --run-id=${latestStagedProviderRun.runId} --family=providers_care --mode=dry-run`,
        `npm run run:source-acquisition-provider-support-followup -- --run-id=${latestStagedProviderRun.runId} --mode=dry-run --limit=5`,
        `npm run run:source-acquisition-provider-county-geocode -- --run-id=${latestStagedProviderRun.runId} --mode=live --limit=25`,
      ],
    }, null, 2));
    process.exit(0);
  }
  const providerPullNowLane = lowTokenControlPlane?.lanes?.providerPullNow || null;
  const providerPullNowCommands = Array.isArray(providerPullNowLane?.action?.recommendedCommands)
    ? providerPullNowLane.action.recommendedCommands.filter(Boolean)
    : [];
  const providerPullNowStatePacketsPath = providerPullNowLane?.statePacketsPath
    ? path.join(repoRoot, providerPullNowLane.statePacketsPath)
    : '';
  const providerPullNowStatePackets = providerPullNowStatePacketsPath && fs.existsSync(providerPullNowStatePacketsPath)
    ? readJson(providerPullNowStatePacketsPath)
    : null;
  const providerPullNowPackets = Array.isArray(providerPullNowStatePackets?.packets)
    ? providerPullNowStatePackets.packets
    : [];
  const nextProviderPullNowPacket = [...providerPullNowPackets].sort((a, b) =>
    Number(b.unresolvedRows || 0) - Number(a.unresolvedRows || 0)
    || String(a.stateId || '').localeCompare(String(b.stateId || ''))
  )[0] || null;
  if (providerPullNowLane && providerPullNowLane.action?.blocker && providerPullNowLane.action.blocker !== 'none' && providerPullNowCommands.length > 0) {
    console.log(JSON.stringify({
      mode: 'provider_pull_now_followup_next_step',
      completionPlanPath,
      sourcePackPath,
      lowTokenControlPlanePath,
      nextAction: providerPullNowLane.action.nextAction || 'Work the provider pull-now followup lane before more provider authoring.',
      selectedTarget: {
        scope: 'provider_pull_now_followup',
        blocker: providerPullNowLane.action.blocker,
        nextState: providerPullNowLane.action.nextState || '',
        staleDecisionRows: providerPullNowLane.staleDecisionRows || 0,
        activeDecisionRows: providerPullNowLane.activeDecisionRows || 0,
        nextAction: providerPullNowLane.action.nextAction || '',
      },
      commands: providerPullNowCommands,
    }, null, 2));
    process.exit(0);
  }

  if (providerPullNowLane && nextProviderPullNowPacket && Number(nextProviderPullNowPacket.unresolvedRows || 0) > 0) {
    console.log(JSON.stringify({
      mode: 'provider_pull_now_state_packet_next_step',
      completionPlanPath,
      sourcePackPath,
      lowTokenControlPlanePath,
      nextAction: `Provider pull-now state packets remain unresolved; work ${nextProviderPullNowPacket.stateId} before falling back to new authoring.`,
      selectedTarget: {
        scope: 'provider_pull_now_state_packets',
        statePacketsPath: providerPullNowLane.statePacketsPath || '',
        statePacketCount: Number(providerPullNowLane.statePacketsSummary?.statePacketCount || providerPullNowPackets.length || 0),
        totalUnresolvedRows: Number(providerPullNowLane.statePacketsSummary?.totalUnresolvedRows || 0),
        nextState: nextProviderPullNowPacket.stateId || '',
        nextStateUnresolvedRows: Number(nextProviderPullNowPacket.unresolvedRows || 0),
        nextStatePacketJsonPath: nextProviderPullNowPacket.jsonPath || '',
        nextStatePacketMarkdownPath: nextProviderPullNowPacket.markdownPath || '',
        nextAction: `Run the provider pull-now state packet helper for ${nextProviderPullNowPacket.stateId} and persist decisions before new provider authoring.`,
      },
      commands: [
        'npm run run:next-provider-pull-now-state-packet',
        'npm run audit:provider-pull-now-state-packets',
        'npm run audit:source-acquisition-completion-plan',
      ],
    }, null, 2));
    process.exit(0);
  }

  const sourcePackStates = Array.isArray(sourcePack.states) ? sourcePack.states : [];
  const pullNowStates = sourcePackStates.filter((state) => String(state.readinessLane || state.readiness || '').includes('pull-now'));
  const providerAuthoringBacklogRows = Array.isArray(providerAuthoringBacklog?.rows) ? providerAuthoringBacklog.rows : [];
  const providerAuthoringPacketsIndex = readJsonIfExists(providerAuthoringPacketsIndexPath, { packets: [], summary: {} });
  const nextPacket = Array.isArray(providerAuthoringPacketsIndex?.packets)
    ? [...providerAuthoringPacketsIndex.packets].sort((a, b) =>
        Number(a.executionPriority || 99) - Number(b.executionPriority || 99)
        || String(a.stateId || '').localeCompare(String(b.stateId || ''))
      )[0] || null
    : null;
  if (providerAuthoringBacklog && providerAuthoringBacklogRows.length === 0) {
    console.log(JSON.stringify({
      mode: 'provider_depth_idle',
      completionPlanPath,
      sourcePackPath,
      nextAction: 'Provider ready-target and authoring backlogs are both exhausted.',
      selectedTarget: null,
      commands: [],
    }, null, 2));
    process.exit(0);
  }
  if (!nextPacket) {
    console.log(JSON.stringify({
      mode: 'provider_depth_idle',
      completionPlanPath,
      sourcePackPath,
      nextAction: 'Provider ready-target and authoring backlogs are both exhausted.',
      selectedTarget: null,
      commands: [],
    }, null, 2));
    process.exit(0);
  }
  const packetHelper = runNodeScript('scripts/run-next-provider-authoring-packet.mjs');
  if (packetHelper?.mode === 'provider_authoring_apply_ready_workfiles') {
    console.log(JSON.stringify({
      mode: 'provider_depth_apply_ready_workfiles',
      completionPlanPath,
      sourcePackPath,
      nextAction: 'Provider authoring workfiles are complete; batch-apply them before expecting new provider queue movement.',
      selectedTarget: {
        scope: 'provider_authoring_apply_ready_workfiles',
        readyStateCount: Number(packetHelper.readyStateCount || 0),
        readyStates: Array.isArray(packetHelper.readyStates) ? packetHelper.readyStates.slice(0, 25) : [],
        nextAction: 'Apply all ready provider authoring workfiles, then refresh provider source-pack and source-acquisition completion artifacts.',
      },
      commands: Array.isArray(packetHelper.commands) ? packetHelper.commands : [],
    }, null, 2));
    process.exit(0);
  }
  if (packetHelper?.mode === 'provider_authoring_packet_idle') {
    console.log(JSON.stringify({
      mode: 'provider_depth_blocked_no_ready_queue',
      completionPlanPath,
      sourcePackPath,
      nextAction: 'Provider family is below threshold but has no fetchable ready queue and no pending authoring packets.',
      selectedTarget: {
        scope: 'provider_blocked_no_ready_queue',
        statesIncluded: sourcePackStates.length,
        pullNowStates: pullNowStates.length,
        backlogRows: providerAuthoringBacklogRows.length,
        nextAction: 'Treat providers as blocked on queue generation or downstream promotion until new exact targets are promoted into a runnable ready queue.',
      },
      commands: [
        'npm run audit:provider-source-pack',
        'npm run audit:provider-authoring-backlog',
        'npm run audit:source-acquisition-completion-plan',
      ],
    }, null, 2));
    process.exit(0);
  }
  console.log(JSON.stringify({
    mode: 'provider_depth_authoring_next_step',
    completionPlanPath,
    sourcePackPath,
    nextAction: 'Ready provider targets are exhausted; refresh provider source-pack authoring so the provider blocker stays actionable.',
    selectedTarget: {
      scope: 'provider_authoring_backlog',
      statesIncluded: sourcePackStates.length,
      pullNowStates: pullNowStates.length,
      nextPacketStateId: nextPacket?.stateId || '',
      nextPacketJsonPath: nextPacket?.jsonPath || '',
      nextPacketMarkdownPath: nextPacket?.markdownPath || '',
      nextAction: 'Use the provider authoring backlog to choose the next missing-depth state, then regenerate provider source-pack and buildout-priority artifacts.',
    },
    commands: [
      'npm run audit:provider-authoring-backlog',
      'npm run run:next-provider-authoring-packet',
      'npm run audit:source-acquisition-completion-plan',
    ],
  }, null, 2));
  process.exit(0);
}

const sourceUrlPattern = shellEscape(nextRow.sourceUrl);
const commands = [
  `npm run run:source-acquisition-wave -- --mode=live --status=${nextRow.ledgerStatus || nextRow.status} --lane=ready_target_scrape --gap=providers_care --limit=1 --source-url-pattern=${sourceUrlPattern}`,
  'npm run run:source-acquisition-followups -- --run-id=<run-id>',
  'npm run run:source-acquisition-parse -- --run-id=<run-id> --family=providers_care',
  'npm run run:source-acquisition-validate -- --run-id=<run-id> --family=providers_care',
  'npm run run:source-acquisition-stage -- --run-id=<run-id> --family=providers_care --mode=dry-run',
];

console.log(JSON.stringify({
  mode: 'provider_depth_next_step',
  completionPlanPath,
  sourcePackPath,
  selectedTarget: {
    stateId: nextRow.stateId,
    sourceUrl: nextRow.sourceUrl,
    crawlMethod: nextRow.crawlMethod,
    status: nextRow.ledgerStatus || nextRow.status,
    queue: nextRow.queue || null,
    nextAction: 'Run one bounded providers_care target from the ready queue and continue through parse, validate, and stage.',
  },
  commands,
}, null, 2));
