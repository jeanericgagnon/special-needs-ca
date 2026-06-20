import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const autopilotRoot = path.join(repoRoot, 'data', 'source-acquisition-autopilot-runs');
const scrapeTargetUniversePath = path.join(docsDir, `scrape-target-universe-${generatedDate}.json`);
const scrapeTargetUniverseQueuePath = path.join(docsDir, `scrape-target-universe-queue-${generatedDate}.json`);

function parseArgs(argv) {
  const args = {
    mode: 'dry-run',
    status: 'ready_js_heavy',
    lane: 'ready_target_scrape',
    gap: '',
    queue: '',
    state: '',
    limit: 10,
    maxBatches: 1,
    stageMode: 'dry-run',
    retryCount: 2,
    rateLimitMs: 1200,
    concurrency: 4,
    requestTimeoutMs: 15000,
    bodyTimeoutMs: 15000,
    stopOnNoProgress: true,
    inventory: 'completion-plan',
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'mode' && value) args.mode = value;
    if (flag === 'status' && value) args.status = value;
    if (flag === 'lane' && value) args.lane = value;
    if (flag === 'gap' && value) args.gap = value;
    if (flag === 'queue' && value) args.queue = value;
    if (flag === 'state' && value) args.state = value.toLowerCase();
    if (flag === 'limit' && Number.isFinite(Number(value))) args.limit = Math.max(1, Number(value));
    if (flag === 'max-batches' && Number.isFinite(Number(value))) args.maxBatches = Math.max(1, Number(value));
    if (flag === 'stage-mode' && value) args.stageMode = value;
    if (flag === 'retry-count' && Number.isFinite(Number(value))) args.retryCount = Number(value);
    if (flag === 'rate-limit-ms' && Number.isFinite(Number(value))) args.rateLimitMs = Number(value);
    if (flag === 'concurrency' && Number.isFinite(Number(value))) args.concurrency = Math.max(1, Number(value));
    if (flag === 'request-timeout-ms' && Number.isFinite(Number(value))) args.requestTimeoutMs = Number(value);
    if (flag === 'body-timeout-ms' && Number.isFinite(Number(value))) args.bodyTimeoutMs = Number(value);
    if (flag === 'stop-on-no-progress') args.stopOnNoProgress = value !== 'false';
    if (flag === 'inventory' && value) args.inventory = value;
  }

  if (!['dry-run', 'live'].includes(args.mode)) {
    throw new Error(`Unsupported mode "${args.mode}". Use dry-run or live.`);
  }
  if (!['dry-run', 'apply'].includes(args.stageMode)) {
    throw new Error(`Unsupported stage mode "${args.stageMode}". Use dry-run or apply.`);
  }
  if (!['completion-plan', 'scrape-target-universe'].includes(args.inventory)) {
    throw new Error(`Unsupported inventory "${args.inventory}". Use completion-plan or scrape-target-universe.`);
  }

  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function runNode(scriptRelativePath, scriptArgs = []) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, scriptRelativePath), ...scriptArgs], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });

  if (result.status !== 0) {
    throw new Error([
      `Command failed: node ${scriptRelativePath} ${scriptArgs.join(' ')}`,
      result.stdout ? `STDOUT:\n${result.stdout}` : '',
      result.stderr ? `STDERR:\n${result.stderr}` : '',
    ].filter(Boolean).join('\n'));
  }

  const trimmed = result.stdout.trim();
  if (!trimmed) return null;
  const jsonStart = trimmed.indexOf('{');
  if (jsonStart === -1) return null;
  return JSON.parse(trimmed.slice(jsonStart));
}

function refreshPlan(inventory) {
  if (inventory === 'scrape-target-universe') {
    runNode('src/db/generate_scrape_target_universe.js');
    runNode('src/db/generate_scrape_target_universe_queue.js');
    return {
      path: scrapeTargetUniverseQueuePath,
      plan: readJson(scrapeTargetUniverseQueuePath),
      sourcePath: scrapeTargetUniversePath,
    };
  }

  runNode('src/db/generate_source_acquisition_completion_plan.js');
  const planPath = path.join(docsDir, `source-acquisition-completion-plan-${generatedDate}.json`);
  return {
    path: planPath,
    plan: readJson(planPath),
    sourcePath: planPath,
  };
}

function matchesFilters(row, args) {
  if (args.status && row.ledgerStatus !== args.status) return false;
  if (args.lane && row.executionLane !== args.lane) return false;
  if (args.gap && row.gapFamily !== args.gap) return false;
  if (args.queue && row.sourceQueue !== args.queue) return false;
  if (args.state && row.stateId !== args.state) return false;
  return true;
}

function matchingRows(plan, args) {
  return (plan.combinedReadyRows || []).filter((row) => matchesFilters(row, args));
}

function sumFamilies(summary, key) {
  return (summary?.families || []).reduce((sum, row) => sum + Number(row[key] || 0), 0);
}

function stageSupportedCount(summary) {
  return (summary?.families || []).reduce((sum, family) => sum + Number(family.supportedCount || 0), 0);
}

function compactBatchLine(batch) {
  return [
    `batch=${batch.batch}`,
    `run_id=${batch.runId}`,
    `attempted=${batch.attempted}`,
    `succeeded=${batch.succeeded}`,
    `blocked=${batch.blocked}`,
    `source_repair=${batch.sourceRepair}`,
    `parsed=${batch.parsed}`,
    `accepted=${batch.accepted}`,
    `rejected=${batch.rejected}`,
    `staged=${batch.staged}`,
    `queue_remaining=${batch.queueRemaining}`,
  ].join(' ');
}

function renderMarkdown(summary) {
  return [
    '# Source Acquisition Autopilot Summary',
    '',
    `- Run ID: \`${summary.autopilotRunId}\``,
    `- Mode: \`${summary.args.mode}\``,
    `- Status: \`${summary.args.status}\``,
    `- Lane: \`${summary.args.lane}\``,
    `- Gap: \`${summary.args.gap || 'all'}\``,
    `- Stop Reason: \`${summary.stopReason}\``,
    `- Initial Queue: \`${summary.initialQueueRemaining}\``,
    `- Final Queue: \`${summary.finalQueueRemaining}\``,
    `- Batches: \`${summary.batches.length}\``,
    '',
    '## Totals',
    '',
    `- Attempted: \`${summary.totals.attempted}\``,
    `- Succeeded: \`${summary.totals.succeeded}\``,
    `- Blocked: \`${summary.totals.blocked}\``,
    `- Source Repair: \`${summary.totals.sourceRepair}\``,
    `- Parsed: \`${summary.totals.parsed}\``,
    `- Accepted: \`${summary.totals.accepted}\``,
    `- Rejected: \`${summary.totals.rejected}\``,
    `- Staged: \`${summary.totals.staged}\``,
    '',
    '## Batches',
    '',
    '| batch | run id | attempted | succeeded | blocked | source repair | parsed | accepted | rejected | staged | queue remaining |',
    '|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...summary.batches.map((batch) =>
      `| ${batch.batch} | ${batch.runId} | ${batch.attempted} | ${batch.succeeded} | ${batch.blocked} | ${batch.sourceRepair} | ${batch.parsed} | ${batch.accepted} | ${batch.rejected} | ${batch.staged} | ${batch.queueRemaining} |`
    ),
    '',
  ].join('\n');
}

function writeSummary(runDir, summary) {
  fs.writeFileSync(path.join(runDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
  fs.writeFileSync(path.join(runDir, 'summary.md'), renderMarkdown(summary));
}

const args = parseArgs(process.argv.slice(2));
const autopilotRunId = new Date().toISOString().replace(/[:.]/g, '-');
const runDir = path.join(autopilotRoot, autopilotRunId);
ensureDir(runDir);

const initial = refreshPlan(args.inventory);
let remaining = matchingRows(initial.plan, args).length;
const summary = {
  autopilotRunId,
  generatedAt: generatedDate,
  args,
  completionPlanPath: initial.path,
  inventory: args.inventory,
  inventorySourcePath: initial.sourcePath,
  initialQueueRemaining: remaining,
  finalQueueRemaining: remaining,
  stopReason: '',
  batches: [],
  totals: {
    attempted: 0,
    succeeded: 0,
    blocked: 0,
    sourceRepair: 0,
    parsed: 0,
    accepted: 0,
    rejected: 0,
    staged: 0,
  },
};

for (let batch = 1; batch <= args.maxBatches; batch += 1) {
  if (remaining <= 0) {
    summary.stopReason = 'queue_empty';
    break;
  }

  const batchLimit = Math.min(args.limit, remaining);
  const waveArgs = [
    `--mode=${args.mode}`,
    `--status=${args.status}`,
    `--lane=${args.lane}`,
    `--limit=${batchLimit}`,
    `--retry-count=${args.retryCount}`,
    `--rate-limit-ms=${args.rateLimitMs}`,
    `--concurrency=${args.concurrency}`,
    `--request-timeout-ms=${args.requestTimeoutMs}`,
    `--body-timeout-ms=${args.bodyTimeoutMs}`,
  ];
  if (args.gap) waveArgs.push(`--gap=${args.gap}`);
  if (args.queue) waveArgs.push(`--queue=${args.queue}`);
  if (args.state) waveArgs.push(`--state=${args.state}`);
  if (initial.path) waveArgs.push(`--plan-path=${initial.path}`);

  const wave = runNode('scripts/run-source-acquisition-wave.mjs', waveArgs);
  const followups = runNode('scripts/prepare-source-acquisition-followups.mjs', [`--run-id=${wave.runId}`]);
  const parsed = runNode('scripts/run-source-acquisition-parse.mjs', [`--run-id=${wave.runId}`, '--family=all']);
  const validated = runNode('scripts/run-source-acquisition-validate.mjs', [`--run-id=${wave.runId}`, '--family=all']);
  const staged = runNode('scripts/run-source-acquisition-stage.mjs', [`--run-id=${wave.runId}`, '--family=all', `--mode=${args.stageMode}`]);
  const refreshed = refreshPlan(args.inventory);
  const nextRemaining = matchingRows(refreshed.plan, args).length;

  const batchSummary = {
    batch,
    runId: wave.runId,
    attempted: Number(wave.selectedCount || 0),
    succeeded: Number(wave.succeeded || 0),
    blocked: Number(followups?.blockedCount || 0),
    sourceRepair: Number(followups?.sourceRepairCount || 0),
    parsed: sumFamilies(parsed, 'parsedCount'),
    accepted: sumFamilies(validated, 'acceptedCount'),
    rejected: sumFamilies(validated, 'rejectedCount'),
    staged: stageSupportedCount(staged),
    queueBefore: remaining,
    queueRemaining: nextRemaining,
  };

  summary.batches.push(batchSummary);
  for (const key of Object.keys(summary.totals)) {
    summary.totals[key] += Number(batchSummary[key] || 0);
  }
  summary.finalQueueRemaining = nextRemaining;
  writeSummary(runDir, summary);
  console.log(compactBatchLine(batchSummary));

  const madeQueueProgress = nextRemaining < remaining;
  remaining = nextRemaining;

  if (args.mode !== 'live') {
    summary.stopReason = 'dry_run_complete';
    break;
  }
  if (batchSummary.attempted === 0) {
    summary.stopReason = 'no_rows_selected';
    break;
  }
  if (args.stopOnNoProgress && !madeQueueProgress) {
    summary.stopReason = 'no_queue_progress';
    break;
  }
  if (batch === args.maxBatches) {
    summary.stopReason = 'max_batches_reached';
  }
}

if (!summary.stopReason) summary.stopReason = remaining <= 0 ? 'queue_empty' : 'max_batches_reached';
writeSummary(runDir, summary);

console.log(JSON.stringify({
  autopilotRunId,
  stopReason: summary.stopReason,
  initialQueueRemaining: summary.initialQueueRemaining,
  finalQueueRemaining: summary.finalQueueRemaining,
  batches: summary.batches.length,
  totals: summary.totals,
  summaryPath: path.join(runDir, 'summary.json'),
  reportPath: path.join(runDir, 'summary.md'),
}, null, 2));
