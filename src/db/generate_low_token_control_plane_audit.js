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
const dataDir = path.join(repoRoot, 'data');
const sourcePacksDir = path.join(dataDir, 'source_packs');
const sourceAcquisitionRunsDir = path.join(dataDir, 'source-acquisition-runs');
const sourceAcquisitionStateDir = path.join(dataDir, 'source-acquisition-state');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `low-token-control-plane-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `low-token-control-plane-${generatedDate}.md`);
const formsFallbackManualReviewQueueJsonPath = path.join(docsDir, `forms-fallback-manual-review-queue-${generatedDate}.json`);
const formsFallbackManualReviewDecisionTemplateJsonPath = path.join(docsDir, `forms-fallback-manual-review-decision-template-${generatedDate}.json`);
const formsFallbackStateLedgerJsonPath = path.join(docsDir, `forms-fallback-state-ledger-${generatedDate}.json`);
const formsFallbackManualReviewLedgerPath = path.join(sourceAcquisitionStateDir, 'forms-fallback-manual-review-ledger.json');
const providerFollowupBlockerRegistryJsonPath = path.join(docsDir, `provider-followup-blocker-registry-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, path: path.relative(repoRoot, filePath), payload: null };
  }

  return {
    exists: true,
    path: path.relative(repoRoot, filePath),
    payload: readJson(filePath),
  };
}

function latestGeneratedFile(prefix, ext) {
  if (!fs.existsSync(docsDir)) return null;
  const matches = fs.readdirSync(docsDir)
    .filter((name) => name.startsWith(prefix) && name.endsWith(ext))
    .sort()
    .reverse();

  if (!matches.length) return null;
  return path.join(docsDir, matches[0]);
}

function latestRunFile(fileName) {
  if (!fs.existsSync(sourceAcquisitionRunsDir)) return null;
  const matches = fs.readdirSync(sourceAcquisitionRunsDir)
    .map((dirName) => path.join(sourceAcquisitionRunsDir, dirName, fileName))
    .filter((filePath) => fs.existsSync(filePath))
    .sort()
    .reverse();
  return matches[0] || null;
}

function listRunFiles(fileName) {
  if (!fs.existsSync(sourceAcquisitionRunsDir)) return [];
  return fs.readdirSync(sourceAcquisitionRunsDir)
    .map((dirName) => path.join(sourceAcquisitionRunsDir, dirName, fileName))
    .filter((filePath) => fs.existsSync(filePath))
    .sort()
    .reverse();
}

function runRegressionSuite() {
  const scriptPath = process.env.ABLEFULL_REGRESSION_SCRIPT
    ? path.resolve(process.env.ABLEFULL_REGRESSION_SCRIPT)
    : path.join(repoRoot, 'scripts', 'test-low-token-workflow-regressions.mjs');
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });

  return {
    ok: result.status === 0,
    exitCode: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function countRows(payload) {
  if (!payload) return 0;
  if (Array.isArray(payload)) return payload.length;
  if (Array.isArray(payload.rows)) return payload.rows.length;
  if (Array.isArray(payload.briefs)) return payload.briefs.length;
  return 0;
}

function laneStatus({ pendingCount, idleWhenZero = true }) {
  if (pendingCount > 0) return 'needs_followup';
  return idleWhenZero ? 'idle_or_cleared' : 'ok';
}

function runFormsFallbackManualReviewQueueAudit() {
  const scriptPath = process.env.ABLEFULL_FORMS_FALLBACK_MANUAL_REVIEW_SCRIPT
    ? path.resolve(process.env.ABLEFULL_FORMS_FALLBACK_MANUAL_REVIEW_SCRIPT)
    : path.join(__dirname, 'generate_forms_fallback_manual_review_queue.js');
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });

  return {
    ok: result.status === 0,
    exitCode: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function runFormsFallbackStateLedgerAudit() {
  const scriptPath = process.env.ABLEFULL_FORMS_FALLBACK_STATE_LEDGER_SCRIPT
    ? path.resolve(process.env.ABLEFULL_FORMS_FALLBACK_STATE_LEDGER_SCRIPT)
    : path.join(__dirname, 'generate_forms_fallback_state_ledger.js');
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });

  return {
    ok: result.status === 0,
    exitCode: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function buildOfficialFollowupAction(queuePayload, decisionRows) {
  const firstRow = queuePayload?.rows?.[0];
  if (!firstRow) {
    return {
      blocker: 'no_live_official_followup_rows',
      nextAction: 'No official-domain follow-up review is pending.',
      recommendedCommands: [],
    };
  }

  return {
    blocker: firstRow.followupType || 'official_followup_pending',
    nextAction: firstRow.recommendedAction || 'Review the remaining official-domain follow-up row and fill the decision file before applying.',
    focusState: firstRow.stateId || '',
    activeDecisionRows: decisionRows,
    recommendedCommands: [
      `npm run audit:official-domain-followup-decision-template`,
      `npm run fix:official-domain-followup-decisions -- --input=data/official-domain-followup-decisions.json --state=${firstRow.stateId}`,
    ],
  };
}

function buildProviderPullNowAction(pendingRows, decisionRows, templateRows, staleDecisionRows, runbookPayload) {
  const nextState = runbookPayload?.stateSlices?.[0]?.stateId || '';
  const firstActionClass = runbookPayload?.summary?.firstActionClass || '';

  if (staleDecisionRows > 0) {
    return {
      blocker: 'provider_pull_now_stale_decisions',
      nextAction: 'Prune stale provider pull-now decision rows that no longer match the live template before spending more provider effort.',
      nextState,
      firstActionClass,
      recommendedCommands: [
        'npm run fix:provider-pull-now-prune-stale',
        'npm run audit:provider-pull-now-decision-progress',
        'npm run audit:low-token-control-plane',
      ],
    };
  }

  if (pendingRows > 0) {
    return {
      blocker: 'provider_pull_now_repairs_pending',
      nextAction: decisionRows === 0 && templateRows > 0
        ? 'Sync the active pull-now decision file from the current template, then resolve reviewed provider replacements before the next provider fetch wave.'
        : 'Resolve the reviewed provider pull-now decisions and apply them before spending more provider fetch volume.',
      nextState,
      firstActionClass,
      recommendedCommands: [
        'npm run audit:provider-pull-now-runbook',
        'npm run audit:provider-pull-now-decision-template',
        ...(decisionRows === 0 && templateRows > 0 ? ['npm run fix:provider-pull-now-decision-file'] : []),
        ...(decisionRows > 0 ? ['npm run fix:provider-pull-now-autofill'] : []),
        'npm run run:next-provider-pull-now-state-packet',
        ...(nextState ? [`npm run run:provider-pull-now-state-review-loop -- --state=${nextState}`] : []),
        ...(nextState ? [`npm run audit:provider-pull-now-state-workfile-status -- --state=${nextState}`] : []),
        ...(nextState ? [`npm run fix:provider-pull-now-state-workfile -- --state=${nextState}`] : []),
        ...(nextState ? [`npm run audit:provider-pull-now-state-workfile-validation -- --state=${nextState}`] : []),
        ...(nextState ? [`npm run fix:provider-pull-now-state-workfile-decisions -- --state=${nextState} --apply`] : []),
        'node scripts/apply-provider-pull-now-decisions.mjs --apply',
      ],
    };
  }

  return {
    blocker: 'none',
    nextAction: decisionRows > 0
      ? 'Clear stale provider pull-now decision rows or finish applying them.'
      : 'Provider pull-now lane is clear; no action needed.',
    firstActionClass,
    recommendedCommands: decisionRows > 0
      ? [
          'npm run run:next-provider-pull-now-state-packet',
          ...(nextState ? [`npm run run:provider-pull-now-state-review-loop -- --state=${nextState}`] : []),
          ...(nextState ? [`npm run audit:provider-pull-now-state-workfile-status -- --state=${nextState}`] : []),
          ...(nextState ? [`npm run fix:provider-pull-now-state-workfile -- --state=${nextState}`] : []),
          ...(nextState ? [`npm run audit:provider-pull-now-state-workfile-validation -- --state=${nextState}`] : []),
          ...(nextState ? [`npm run fix:provider-pull-now-state-workfile-decisions -- --state=${nextState} --apply`] : []),
          'node scripts/apply-provider-pull-now-decisions.mjs --apply',
        ]
      : [],
  };
}

function buildProviderRepairBacklogAction(queuePayload, executionBacklogPayload) {
  const firstRow = executionBacklogPayload?.firstTwentyRows?.[0]
    || queuePayload?.rows?.[0]
    || null;

  if (!firstRow) {
    return {
      blocker: 'none',
      nextAction: 'Provider repair backlog is clear; no exact provider repair work is queued.',
      recommendedCommands: [],
    };
  }

  return {
    blocker: 'provider_followup_repair_backlog_pending',
    nextAction: 'Work the provider followup repair backlog before spending more provider fetch volume.',
    nextState: firstRow.stateId || '',
    firstActionClass: firstRow.actionClass || '',
    readinessLane: firstRow.readinessLane || '',
    recommendedCommands: [
      'npm run run:next-provider-repair-batch',
      'npm run audit:provider-followup-repair-queue',
      'npm run audit:provider-repair-execution-backlog',
      'npm run audit:provider-source-pack',
    ],
  };
}

function buildFormsFallbackAction(queueRows, federalOnlyStates, repairSummary) {
  const rows = Array.isArray(repairSummary.queueRowsSource) ? repairSummary.queueRowsSource : [];
  const uniqueStates = [...new Set(rows.map((row) => row.stateId).filter(Boolean))].sort();
  const firstBatchStates = uniqueStates.slice(0, 5);
  const exercisedStates = [...new Set((repairSummary.completedLedgerRows || []).map((row) => row.stateId).filter(Boolean))].sort();
  const previewedStates = [...new Set((repairSummary.previewLedgerRows || []).map((row) => row.stateId).filter(Boolean))].sort();
  const pendingPreviewStates = previewedStates.filter((stateId) => !exercisedStates.includes(stateId));
  const nextBatchStates = uniqueStates.filter((stateId) => !exercisedStates.includes(stateId)).slice(0, 5);
  const nextState = pendingPreviewStates[0] || nextBatchStates[0] || '';
  const nextMode = pendingPreviewStates.length > 0 ? 'live' : 'dry-run';
  const exactNextCommand = nextState
    ? `npm run run:forms-fallback-source-acquisition -- --mode=${nextMode} --state=${nextState} --limit=5`
    : '';
  const manualReviewQueueRows = repairSummary.manualReviewQueueRows ?? 0;
  const manualReviewDecisionRows = repairSummary.manualReviewDecisionRows ?? 0;
  const manualReviewResolvedRows = repairSummary.manualReviewResolvedRows ?? 0;
  const pendingManualReviewRows = Math.max(0, manualReviewQueueRows - manualReviewResolvedRows);

  if (!nextState && pendingManualReviewRows > 0) {
    return {
      blocker: 'forms_fallback_manual_review_resolution_pending',
      nextAction: 'The bounded scrape lane is exhausted. Resolve queued forms-fallback manual-review rows through the decision template and apply workflow instead of re-scraping.',
      federalOnlyStates,
      manualReviewQueueRows,
      manualReviewDecisionRows,
      manualReviewResolvedRows,
      pendingManualReviewRows,
      recommendedCommands: [
        'npm run audit:forms-fallback-manual-review-decision-template',
        'npm run fix:forms-fallback-manual-review-decisions -- --input=data/forms-fallback-manual-review-decisions.json --state=<state>',
      ],
    };
  }

  if (queueRows > 0 && nextState) {
    return {
      blocker: 'state_specific_forms_fallback_scrape_pending',
      nextAction: pendingPreviewStates.length > 0
        ? 'Promote the oldest previewed state through the bounded live pass before previewing additional states.'
        : 'Run the bounded forms fallback worker one state at a time, with at most five queued rows and no cross-state expansion.',
      federalOnlyStates,
      exactRepairRows: repairSummary.eligibleRepairRows ?? 0,
      firstBatchStates,
      exercisedStates,
      previewedStates,
      pendingPreviewStates,
      nextBatchStates,
      nextState,
      nextMode,
      exactNextCommand,
      recommendedCommands: [
        'npm run audit:forms-fallback-queue',
        ...(exactNextCommand ? [exactNextCommand] : []),
      ],
    };
  }

  return {
    blocker: federalOnlyStates.length ? 'federal_only_forms_states_remaining' : 'none',
    nextAction: federalOnlyStates.length
      ? 'No state-specific forms fallback rows remain; only federal-only fallback states still need better first-party discovery.'
      : pendingManualReviewRows === 0 && manualReviewQueueRows > 0
        ? 'Forms fallback manual-review queue is fully resolved; no further action is needed in this lane.'
        : 'Forms fallback lane is idle; no queued rows remain.',
    federalOnlyStates,
    exactRepairRows: repairSummary.eligibleRepairRows ?? 0,
    manualReviewQueueRows,
    manualReviewDecisionRows,
    manualReviewResolvedRows,
    pendingManualReviewRows,
    firstBatchStates,
    exercisedStates,
    nextBatchStates,
    recommendedCommands: federalOnlyStates.length
      ? ['npm run audit:forms-source-pack']
      : [],
  };
}

const officialQueue = safeReadJson(path.join(docsDir, `official-domain-followup-queue-${generatedDate}.json`));
const officialDecisionFile = safeReadJson(path.join(dataDir, 'official-domain-followup-decisions.json'));
const providerQueue = safeReadJson(path.join(docsDir, `provider-followup-repair-queue-${generatedDate}.json`));
const providerExecutionBacklog = safeReadJson(path.join(docsDir, `provider-repair-execution-backlog-${generatedDate}.json`));
const providerRunbook = safeReadJson(path.join(docsDir, `provider-pull-now-runbook-${generatedDate}.json`));
const providerDecisionTemplate = safeReadJson(path.join(docsDir, `provider-pull-now-decision-template-${generatedDate}.json`));
const providerManualFillQueue = safeReadJson(path.join(docsDir, `provider-pull-now-manual-fill-queue-${generatedDate}.json`));
const providerDecisionProgress = safeReadJson(path.join(docsDir, `provider-pull-now-decision-progress-${generatedDate}.json`));
const providerReviewPacket = safeReadJson(path.join(docsDir, `provider-pull-now-review-packet-${generatedDate}.json`));
const providerStatePackets = safeReadJson(path.join(docsDir, `provider-pull-now-state-packets-${generatedDate}.json`));
const providerStateDecisionPacket = safeReadJson(path.join(docsDir, 'provider-pull-now-state-decision-packets', `provider-pull-now-state-decision-packet-${providerStatePackets.payload?.summary?.firstState || ''}-${generatedDate}.json`));
const providerFirstStateWorkfile = safeReadJson(path.join(dataDir, 'provider-pull-now-state-workfiles', `provider-pull-now-state-workfile-${providerStatePackets.payload?.summary?.firstState || ''}.json`));
const providerFirstStateWorkfileStatus = safeReadJson(path.join(docsDir, `provider-pull-now-state-workfile-status-${providerStatePackets.payload?.summary?.firstState || ''}-${generatedDate}.json`));
const providerFirstStateReviewLoop = safeReadJson(path.join(docsDir, `provider-pull-now-state-review-loop-${providerStatePackets.payload?.summary?.firstState || ''}-${generatedDate}.json`));
const providerDecisionFile = safeReadJson(path.join(dataDir, 'provider-pull-now-decisions.json'));
const providerResolutionLedger = safeReadJson(path.join(sourceAcquisitionStateDir, 'provider-pull-now-resolution-ledger.json'));
const formsFallbackQueue = safeReadJson(path.join(docsDir, `forms-fallback-scrape-queue-${generatedDate}.json`));
const formsSourcePack = safeReadJson(path.join(sourcePacksDir, 'forms_source_pack.json'));
const latestFormsRepairRunPath = latestGeneratedFile('forms-library-repair-run-', '.json');
const latestFormsRepairRun = latestFormsRepairRunPath
  ? safeReadJson(latestFormsRepairRunPath)
  : { exists: false, path: '', payload: null };
const latestFormsFallbackSummaryPath = latestRunFile('forms-fallback-summary.json');
const latestFormsFallbackSummary = latestFormsFallbackSummaryPath
  ? safeReadJson(latestFormsFallbackSummaryPath)
  : { exists: false, path: '', payload: null };
const latestFormsFallbackResultsPath = latestRunFile('forms-fallback-results.json');
const latestFormsFallbackResults = latestFormsFallbackResultsPath
  ? safeReadJson(latestFormsFallbackResultsPath)
  : { exists: false, path: '', payload: null };
const allFormsFallbackResults = listRunFiles('forms-fallback-results.json')
  .map((filePath) => safeReadJson(filePath))
  .filter((item) => item.exists && item.payload);
const formsFallbackCompletionLedger = safeReadJson(path.join(sourceAcquisitionStateDir, 'forms-fallback-completion-ledger.json'));
const regression = runRegressionSuite();

const officialPendingCount = officialQueue.payload?.summary?.totalRows ?? countRows(officialQueue.payload);
const officialDecisionRows = countRows(officialDecisionFile.payload);
const providerPendingCount = providerQueue.payload?.summary?.totalRows ?? countRows(providerQueue.payload);
const providerTemplateRows = countRows(providerDecisionTemplate.payload);
const providerDecisionRows = countRows(providerDecisionFile.payload);
const providerPullNowQueueRows = providerRunbook.payload?.summary?.pullNowRowCount ?? 0;
const providerPendingDecisionRows = providerDecisionProgress.payload?.summary?.unresolvedRows ?? 0;
const providerStaleDecisionRows = providerDecisionProgress.payload?.summary?.staleRows ?? 0;
const formsQueueRows = formsFallbackQueue.payload?.summary?.totalQueueRows ?? countRows(formsFallbackQueue.payload);
const formsFederalOnlyStates = formsFallbackQueue.payload?.summary?.excludedFederalOnlyStates || [];
const formsFallbackManualReviewAudit = runFormsFallbackManualReviewQueueAudit();
const formsFallbackManualReviewQueue = safeReadJson(formsFallbackManualReviewQueueJsonPath);
const formsFallbackManualReviewDecisionTemplate = safeReadJson(formsFallbackManualReviewDecisionTemplateJsonPath);
const formsFallbackManualReviewDecisionFile = safeReadJson(path.join(dataDir, 'forms-fallback-manual-review-decisions.json'));
const formsFallbackManualReviewLedger = safeReadJson(formsFallbackManualReviewLedgerPath);
const formsFallbackStateLedgerAudit = runFormsFallbackStateLedgerAudit();
const formsFallbackStateLedger = safeReadJson(formsFallbackStateLedgerJsonPath);
const providerFollowupBlockerRegistry = safeReadJson(providerFollowupBlockerRegistryJsonPath);
const formsRepairSummary = {
  ...(latestFormsRepairRun.payload?.summary || {}),
  queueRowsSource: formsFallbackQueue.payload?.rows || [],
  latestFallbackRows: latestFormsFallbackResults.payload?.rows || [],
  allFallbackRows: allFormsFallbackResults.flatMap((item) => item.payload?.rows || []),
  completedLedgerRows: (formsFallbackCompletionLedger.payload?.rows || []).filter((row) => row.status === 'complete'),
  previewLedgerRows: (formsFallbackCompletionLedger.payload?.rows || []).filter((row) => row.status === 'previewed'),
  manualReviewQueueRows: formsFallbackManualReviewQueue.payload?.summary?.totalRows ?? 0,
  manualReviewDecisionRows: countRows(formsFallbackManualReviewDecisionFile.payload),
  manualReviewResolvedRows: countRows(formsFallbackManualReviewLedger.payload),
};
formsRepairSummary.eligibleRepairRows = formsSourcePack.payload?.summary?.exactFormsLibraryStates
  ?? formsRepairSummary.eligibleRepairRows
  ?? 0;
formsRepairSummary.nonRepairableRows = formsSourcePack.payload?.summary
  ? ((formsSourcePack.payload.summary.blockedFormsStates ?? 0) - (formsSourcePack.payload.summary.exactFormsLibraryStates ?? 0))
  : formsRepairSummary.nonRepairableRows;
formsRepairSummary.nonRepairableByReason = formsSourcePack.payload?.summary?.byReplacementClass
  || formsRepairSummary.nonRepairableByReason
  || {};
const formsManualReviewQueueRowKeys = new Set(
  (formsFallbackManualReviewQueue.payload?.rows || [])
    .map((row) => row?.rowKey)
    .filter(Boolean),
);
const formsResolvedCurrentManualReviewRows = (formsFallbackManualReviewLedger.payload?.rows || [])
  .filter((row) => formsManualReviewQueueRowKeys.has(row?.rowKey))
  .filter((row) => typeof row?.status === 'string' && /^(resolved_|deferred_|skipped_)/.test(row.status))
  .length;
formsRepairSummary.manualReviewResolvedRows = formsResolvedCurrentManualReviewRows;
const formsPendingManualReviewRows = Math.max(0, (formsRepairSummary.manualReviewQueueRows ?? 0) - formsResolvedCurrentManualReviewRows);
const formsActionPreview = buildFormsFallbackAction(formsQueueRows, formsFederalOnlyStates, formsRepairSummary);

const formsFallbackStatus = formsActionPreview.blocker === 'forms_fallback_manual_review_resolution_pending'
  ? 'needs_manual_review_resolution'
  : formsActionPreview.blocker === 'state_specific_forms_fallback_scrape_pending'
    ? 'ready_for_low_token_scrape'
    : 'idle_or_cleared';

const payload = {
  auditId: 'low_token_control_plane',
  generatedAt: new Date().toISOString(),
  generatedDate,
  regression,
  lanes: {
    officialFollowup: {
      status: laneStatus({ pendingCount: officialPendingCount }),
      queuePath: officialQueue.path,
      pendingQueueRows: officialPendingCount,
      pendingStates: Object.keys(officialQueue.payload?.summary?.byState || {}),
      activeDecisionFilePath: officialDecisionFile.path,
      activeDecisionRows: officialDecisionRows,
      action: buildOfficialFollowupAction(officialQueue.payload, officialDecisionRows),
    },
    providerPullNow: {
      status: laneStatus({ pendingCount: providerPullNowQueueRows + providerPendingDecisionRows + providerStaleDecisionRows }),
      queuePath: providerQueue.path,
      pendingQueueRows: providerPendingCount,
      pendingDecisionRows: providerPendingDecisionRows,
      executionBacklogPath: providerExecutionBacklog.path,
      executionBacklogRows: providerExecutionBacklog.payload?.summary?.totalRows ?? countRows(providerExecutionBacklog.payload),
      runbookPath: providerRunbook.path,
      runbookSummary: providerRunbook.payload?.summary || { pullNowRowCount: 0, pullNowStateCount: 0, firstActionClass: '' },
      decisionTemplatePath: providerDecisionTemplate.path,
      decisionTemplateRows: providerTemplateRows,
      manualFillQueuePath: providerManualFillQueue.path,
      manualFillQueueRows: providerManualFillQueue.payload?.summary?.unresolvedRows ?? countRows(providerManualFillQueue.payload),
      manualFillQueueSummary: providerManualFillQueue.payload?.summary || { unresolvedRows: 0, byActionClass: {}, byDecisionHint: {}, byState: {} },
      decisionProgressPath: providerDecisionProgress.path,
      decisionProgressSummary: providerDecisionProgress.payload?.summary || { totalRows: 0, filledRows: 0, unresolvedRows: 0, staleRows: 0, completionPercent: 0 },
      reviewPacketPath: providerReviewPacket.path,
      reviewPacketSummary: providerReviewPacket.payload?.summary || { statePacketCount: 0, firstState: '' },
      statePacketsPath: providerStatePackets.path,
      statePacketsSummary: providerStatePackets.payload?.summary || { statePacketCount: 0, totalUnresolvedRows: 0, firstState: '' },
      firstStatePacketPath: providerStatePackets.payload?.packets?.[0]?.jsonPath || '',
      firstStateDecisionPacketPath: providerStateDecisionPacket.path,
      firstStateWorkfilePath: providerFirstStateWorkfile.path,
      firstStateWorkfileStatusPath: providerFirstStateWorkfileStatus.path,
      firstStateReviewLoopPath: providerFirstStateReviewLoop.path,
      activeDecisionFilePath: providerDecisionFile.path,
      activeDecisionRows: providerDecisionRows,
      staleDecisionRows: providerStaleDecisionRows,
      resolutionLedgerPath: providerResolutionLedger.path,
      resolutionLedgerRows: countRows(providerResolutionLedger.payload),
      action: buildProviderPullNowAction(providerPullNowQueueRows, providerDecisionRows, providerTemplateRows, providerStaleDecisionRows, providerRunbook.payload),
    },
    providerRepairBacklog: {
      status: laneStatus({ pendingCount: providerPendingCount }),
      queuePath: providerQueue.path,
      pendingQueueRows: providerPendingCount,
      executionBacklogPath: providerExecutionBacklog.path,
      executionBacklogRows: providerExecutionBacklog.payload?.summary?.totalRows ?? countRows(providerExecutionBacklog.payload),
      firstExecutionLane: providerExecutionBacklog.payload?.summary?.firstExecutionLane || '',
      action: buildProviderRepairBacklogAction(providerQueue.payload, providerExecutionBacklog.payload),
    },
    formsFallback: {
      status: formsFallbackStatus,
      queuePath: formsFallbackQueue.path,
      queueRows: formsQueueRows,
      excludedFederalOnlyStates: formsFederalOnlyStates,
      latestRepairRunPath: latestFormsRepairRun.path,
      latestFallbackRunPath: latestFormsFallbackSummary.path,
      completionLedgerPath: formsFallbackCompletionLedger.path,
      manualReviewQueuePath: path.relative(repoRoot, formsFallbackManualReviewQueueJsonPath),
      manualReviewQueueSummary: formsFallbackManualReviewQueue.payload?.summary || { totalRows: 0, byState: {}, byFailureReason: {} },
      manualReviewDecisionTemplatePath: path.relative(repoRoot, formsFallbackManualReviewDecisionTemplateJsonPath),
      manualReviewDecisionTemplateRows: countRows(formsFallbackManualReviewDecisionTemplate.payload),
      activeManualReviewDecisionFilePath: path.relative(repoRoot, path.join(dataDir, 'forms-fallback-manual-review-decisions.json')),
      activeManualReviewDecisionRows: countRows(formsFallbackManualReviewDecisionFile.payload),
      manualReviewResolutionLedgerPath: path.relative(repoRoot, formsFallbackManualReviewLedgerPath),
      manualReviewResolutionLedgerRows: countRows(formsFallbackManualReviewLedger.payload),
      manualReviewAudit: formsFallbackManualReviewAudit,
      stateLedgerPath: path.relative(repoRoot, formsFallbackStateLedgerJsonPath),
      stateLedgerSummary: formsFallbackStateLedger.payload?.summary || { totalStates: 0, byStatus: {}, nextState: '' },
      stateLedgerAudit: formsFallbackStateLedgerAudit,
      latestFallbackRunSummary: latestFormsFallbackSummary.payload
        ? {
            runId: latestFormsFallbackSummary.payload.runId || '',
            mode: latestFormsFallbackSummary.payload.mode || '',
            selectedCount: latestFormsFallbackSummary.payload.selectedCount ?? 0,
            warningCount: latestFormsFallbackSummary.payload.warningCount ?? 0,
            filters: latestFormsFallbackResults.payload?.filters || null,
            warnings: latestFormsFallbackResults.payload?.warnings || [],
          }
        : null,
      exactRepairRows: formsRepairSummary.eligibleRepairRows ?? null,
      nonRepairableRows: formsRepairSummary.nonRepairableRows ?? null,
      nonRepairableByReason: formsRepairSummary.nonRepairableByReason || {},
      action: formsActionPreview,
    },
    providerFollowupBlockers: {
      status: (providerFollowupBlockerRegistry.payload?.summary?.totalRepeatedRows || 0) > 0 ? 'explicit_repeated_blockers_recorded' : 'none_recorded',
      registryPath: path.relative(repoRoot, providerFollowupBlockerRegistryJsonPath),
      repeatedRows: providerFollowupBlockerRegistry.payload?.summary?.totalRepeatedRows || 0,
      byBucket: providerFollowupBlockerRegistry.payload?.summary?.byBucket || {},
      byReason: providerFollowupBlockerRegistry.payload?.summary?.byReason || {},
      latestRunIds: providerFollowupBlockerRegistry.payload?.summary?.latestRunIds || [],
    },
  },
};

const mdLines = [
  '# Low-Token Control Plane Audit',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  '## Regression Guard',
  '',
  `- status: ${payload.regression.ok ? 'pass' : 'fail'}`,
  `- exit code: ${payload.regression.exitCode}`,
  `- stdout: ${payload.regression.stdout || '(empty)'}`,
];

if (payload.regression.stderr) {
  mdLines.push(`- stderr: ${payload.regression.stderr}`);
}

mdLines.push('', '## Official Follow-Up Lane', '');
mdLines.push(`- status: ${payload.lanes.officialFollowup.status}`);
mdLines.push(`- pending queue rows: ${payload.lanes.officialFollowup.pendingQueueRows}`);
mdLines.push(`- pending states: ${payload.lanes.officialFollowup.pendingStates.join(', ') || 'none'}`);
mdLines.push(`- active decision rows: ${payload.lanes.officialFollowup.activeDecisionRows}`);
mdLines.push(`- blocker: ${payload.lanes.officialFollowup.action.blocker}`);
mdLines.push(`- next action: ${payload.lanes.officialFollowup.action.nextAction}`);
for (const command of payload.lanes.officialFollowup.action.recommendedCommands || []) {
  mdLines.push(`- command: ${command}`);
}
mdLines.push(`- queue artifact: ${payload.lanes.officialFollowup.queuePath}`);
mdLines.push(`- decision file: ${payload.lanes.officialFollowup.activeDecisionFilePath}`);

mdLines.push('', '## Provider Pull-Now Lane', '');
mdLines.push(`- status: ${payload.lanes.providerPullNow.status}`);
mdLines.push(`- pending queue rows: ${payload.lanes.providerPullNow.pendingQueueRows}`);
mdLines.push(`- pending decision rows: ${payload.lanes.providerPullNow.pendingDecisionRows}`);
mdLines.push(`- execution backlog rows: ${payload.lanes.providerPullNow.executionBacklogRows}`);
mdLines.push(`- runbook pull-now rows: ${payload.lanes.providerPullNow.runbookSummary.pullNowRowCount || 0}`);
mdLines.push(`- runbook pull-now states: ${payload.lanes.providerPullNow.runbookSummary.pullNowStateCount || 0}`);
mdLines.push(`- decision template rows: ${payload.lanes.providerPullNow.decisionTemplateRows}`);
mdLines.push(`- manual-fill queue rows: ${payload.lanes.providerPullNow.manualFillQueueRows}`);
mdLines.push(`- decision progress completion: ${payload.lanes.providerPullNow.decisionProgressSummary.completionPercent}`);
mdLines.push(`- review packet states: ${payload.lanes.providerPullNow.reviewPacketSummary.statePacketCount || 0}`);
mdLines.push(`- state packets: ${payload.lanes.providerPullNow.statePacketsSummary.statePacketCount || 0}`);
mdLines.push(`- active decision rows: ${payload.lanes.providerPullNow.activeDecisionRows}`);
mdLines.push(`- resolution ledger rows: ${payload.lanes.providerPullNow.resolutionLedgerRows}`);
mdLines.push(`- next state: ${payload.lanes.providerPullNow.action.nextState || 'none'}`);
mdLines.push(`- first action class: ${payload.lanes.providerPullNow.action.firstActionClass || 'none'}`);
mdLines.push(`- blocker: ${payload.lanes.providerPullNow.action.blocker}`);
mdLines.push(`- next action: ${payload.lanes.providerPullNow.action.nextAction}`);
for (const command of payload.lanes.providerPullNow.action.recommendedCommands || []) {
  mdLines.push(`- command: ${command}`);
}
mdLines.push(`- queue artifact: ${payload.lanes.providerPullNow.queuePath}`);
mdLines.push(`- execution backlog: ${payload.lanes.providerPullNow.executionBacklogPath}`);
mdLines.push(`- runbook: ${payload.lanes.providerPullNow.runbookPath}`);
mdLines.push(`- decision template: ${payload.lanes.providerPullNow.decisionTemplatePath}`);
mdLines.push(`- manual-fill queue: ${payload.lanes.providerPullNow.manualFillQueuePath}`);
mdLines.push(`- decision progress: ${payload.lanes.providerPullNow.decisionProgressPath}`);
mdLines.push(`- review packet: ${payload.lanes.providerPullNow.reviewPacketPath}`);
mdLines.push(`- state packets index: ${payload.lanes.providerPullNow.statePacketsPath}`);
mdLines.push(`- first state packet: ${payload.lanes.providerPullNow.firstStatePacketPath || 'none'}`);
mdLines.push(`- first state decision packet: ${payload.lanes.providerPullNow.firstStateDecisionPacketPath || 'none'}`);
mdLines.push(`- first state workfile: ${payload.lanes.providerPullNow.firstStateWorkfilePath || 'none'}`);
mdLines.push(`- first state workfile status: ${payload.lanes.providerPullNow.firstStateWorkfileStatusPath || 'none'}`);
mdLines.push(`- first state review loop: ${payload.lanes.providerPullNow.firstStateReviewLoopPath || 'none'}`);
mdLines.push(`- active decision file: ${payload.lanes.providerPullNow.activeDecisionFilePath}`);
mdLines.push(`- resolution ledger: ${payload.lanes.providerPullNow.resolutionLedgerPath}`);

mdLines.push('', '## Provider Repair Backlog Lane', '');
mdLines.push(`- status: ${payload.lanes.providerRepairBacklog.status}`);
mdLines.push(`- pending queue rows: ${payload.lanes.providerRepairBacklog.pendingQueueRows}`);
mdLines.push(`- execution backlog rows: ${payload.lanes.providerRepairBacklog.executionBacklogRows}`);
mdLines.push(`- first execution lane: ${payload.lanes.providerRepairBacklog.firstExecutionLane || 'none'}`);
mdLines.push(`- next state: ${payload.lanes.providerRepairBacklog.action.nextState || 'none'}`);
mdLines.push(`- first action class: ${payload.lanes.providerRepairBacklog.action.firstActionClass || 'none'}`);
mdLines.push(`- readiness lane: ${payload.lanes.providerRepairBacklog.action.readinessLane || 'none'}`);
mdLines.push(`- blocker: ${payload.lanes.providerRepairBacklog.action.blocker}`);
mdLines.push(`- next action: ${payload.lanes.providerRepairBacklog.action.nextAction}`);
for (const command of payload.lanes.providerRepairBacklog.action.recommendedCommands || []) {
  mdLines.push(`- command: ${command}`);
}
mdLines.push(`- queue artifact: ${payload.lanes.providerRepairBacklog.queuePath}`);
mdLines.push(`- execution backlog: ${payload.lanes.providerRepairBacklog.executionBacklogPath}`);

mdLines.push('', '## Forms Fallback Lane', '');
mdLines.push(`- status: ${payload.lanes.formsFallback.status}`);
mdLines.push(`- queue rows: ${payload.lanes.formsFallback.queueRows}`);
mdLines.push(`- excluded federal-only states: ${payload.lanes.formsFallback.excludedFederalOnlyStates.join(', ') || 'none'}`);
mdLines.push(`- exact repair rows: ${payload.lanes.formsFallback.exactRepairRows ?? 'unknown'}`);
mdLines.push(`- non-repairable rows: ${payload.lanes.formsFallback.nonRepairableRows ?? 'unknown'}`);
mdLines.push(`- latest fallback run: ${payload.lanes.formsFallback.latestFallbackRunSummary?.runId || 'none'}`);
mdLines.push(`- latest fallback selected rows: ${payload.lanes.formsFallback.latestFallbackRunSummary?.selectedCount ?? 'unknown'}`);
mdLines.push(`- latest fallback warnings: ${payload.lanes.formsFallback.latestFallbackRunSummary?.warningCount ?? 'unknown'}`);
mdLines.push(`- manual review queue rows: ${payload.lanes.formsFallback.manualReviewQueueSummary?.totalRows ?? 0}`);
mdLines.push(`- manual review decision template rows: ${payload.lanes.formsFallback.manualReviewDecisionTemplateRows ?? 0}`);
mdLines.push(`- active manual review decision rows: ${payload.lanes.formsFallback.activeManualReviewDecisionRows ?? 0}`);
mdLines.push(`- manual review resolution ledger rows: ${payload.lanes.formsFallback.manualReviewResolutionLedgerRows ?? 0}`);
mdLines.push(`- state ledger total states: ${payload.lanes.formsFallback.stateLedgerSummary?.totalStates ?? 0}`);
mdLines.push(`- blocker: ${payload.lanes.formsFallback.action.blocker}`);
mdLines.push(`- next action: ${payload.lanes.formsFallback.action.nextAction}`);
mdLines.push(`- first batch states: ${payload.lanes.formsFallback.action.firstBatchStates?.join(', ') || 'none'}`);
mdLines.push(`- exercised batch states: ${payload.lanes.formsFallback.action.exercisedStates?.join(', ') || 'none'}`);
mdLines.push(`- previewed-only states: ${payload.lanes.formsFallback.action.previewedStates?.join(', ') || 'none'}`);
mdLines.push(`- pending preview states: ${payload.lanes.formsFallback.action.pendingPreviewStates?.join(', ') || 'none'}`);
mdLines.push(`- next batch states: ${payload.lanes.formsFallback.action.nextBatchStates?.join(', ') || 'none'}`);
mdLines.push(`- next state: ${payload.lanes.formsFallback.action.nextState || 'none'}`);
mdLines.push(`- next mode: ${payload.lanes.formsFallback.action.nextMode || 'none'}`);
mdLines.push(`- exact next command: ${payload.lanes.formsFallback.action.exactNextCommand || 'none'}`);
for (const command of payload.lanes.formsFallback.action.recommendedCommands || []) {
  mdLines.push(`- command: ${command}`);
}
for (const [reason, count] of Object.entries(payload.lanes.formsFallback.nonRepairableByReason).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${reason}: ${count}`);
}
for (const [reason, count] of Object.entries(payload.lanes.formsFallback.manualReviewQueueSummary?.byFailureReason || {}).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- manual review ${reason}: ${count}`);
}
for (const [status, count] of Object.entries(payload.lanes.formsFallback.stateLedgerSummary?.byStatus || {}).sort((a, b) => a[0].localeCompare(b[0]))) {
  mdLines.push(`- state ledger ${status}: ${count}`);
}
mdLines.push(`- fallback queue artifact: ${payload.lanes.formsFallback.queuePath}`);
mdLines.push(`- completion ledger: ${payload.lanes.formsFallback.completionLedgerPath || 'missing'}`);
mdLines.push(`- manual review queue: ${payload.lanes.formsFallback.manualReviewQueuePath || 'missing'}`);
mdLines.push(`- manual review decision template: ${payload.lanes.formsFallback.manualReviewDecisionTemplatePath || 'missing'}`);
mdLines.push(`- active manual review decision file: ${payload.lanes.formsFallback.activeManualReviewDecisionFilePath || 'missing'}`);
mdLines.push(`- manual review resolution ledger: ${payload.lanes.formsFallback.manualReviewResolutionLedgerPath || 'missing'}`);
mdLines.push(`- state ledger: ${payload.lanes.formsFallback.stateLedgerPath || 'missing'}`);
mdLines.push(`- latest repair run: ${payload.lanes.formsFallback.latestRepairRunPath || 'missing'}`);
mdLines.push(`- latest fallback run artifact: ${payload.lanes.formsFallback.latestFallbackRunPath || 'missing'}`);

mdLines.push('', '## Provider Followup Blockers', '');
mdLines.push(`- status: ${payload.lanes.providerFollowupBlockers.status}`);
mdLines.push(`- repeated blocker rows: ${payload.lanes.providerFollowupBlockers.repeatedRows}`);
mdLines.push(`- latest runs: ${payload.lanes.providerFollowupBlockers.latestRunIds.join(', ') || 'none'}`);
for (const [bucket, count] of Object.entries(payload.lanes.providerFollowupBlockers.byBucket).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- bucket ${bucket}: ${count}`);
}
for (const [reason, count] of Object.entries(payload.lanes.providerFollowupBlockers.byReason).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- reason ${reason}: ${count}`);
}
mdLines.push(`- registry artifact: ${payload.lanes.providerFollowupBlockers.registryPath}`);

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  audit: {
    json: jsonOutPath,
    md: mdOutPath,
  },
  regression: {
    ok: regression.ok,
    exitCode: regression.exitCode,
  },
  laneStatus: {
    officialFollowup: payload.lanes.officialFollowup.status,
    providerPullNow: payload.lanes.providerPullNow.status,
    providerRepairBacklog: payload.lanes.providerRepairBacklog.status,
    formsFallback: payload.lanes.formsFallback.status,
  },
}, null, 2));
