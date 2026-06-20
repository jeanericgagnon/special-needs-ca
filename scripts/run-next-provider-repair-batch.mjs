import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const controlPlanePath = path.join(repoRoot, 'docs', 'generated', `low-token-control-plane-${generatedDate}.json`);
const generatedDir = path.join(repoRoot, 'docs', 'generated');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(generatedDir)
    ? fs.readdirSync(generatedDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  return matches.length ? path.join(generatedDir, matches.at(-1)) : '';
}

function parseLastJson(stdout) {
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  const jsonStart = trimmed.lastIndexOf('\n{');
  if (jsonStart >= 0) return JSON.parse(trimmed.slice(jsonStart + 1));
  return trimmed.startsWith('{') ? JSON.parse(trimmed) : null;
}

if (!fs.existsSync(controlPlanePath)) {
  throw new Error(`Missing control-plane audit: ${controlPlanePath}. Run npm run audit:low-token-control-plane first.`);
}

const controlPlane = readJson(controlPlanePath);
const providerLane = controlPlane?.lanes?.providerRepairBacklog;
if (!providerLane) {
  throw new Error('Current low-token control plane does not expose a providerRepairBacklog lane.');
}

const executionBacklogPath = latestGeneratedJson('provider-repair-execution-backlog-');
const executionBacklog = executionBacklogPath ? readJson(executionBacklogPath) : null;
const queuePath = latestGeneratedJson('provider-followup-repair-queue-');
const queue = queuePath ? readJson(queuePath) : null;
const firstRow = executionBacklog?.firstTwentyRows?.[0] || queue?.rows?.[0] || null;
const hasQueuedRepairWork = Boolean(firstRow);

if (!hasQueuedRepairWork) {
  console.log(JSON.stringify({
    command: '',
    mode: 'review_provider_repair_batch',
    providerRepairBacklog: {
      status: providerLane?.status || 'idle_or_cleared',
      blocker: providerLane?.action?.blocker || 'none',
      nextAction: providerLane?.action?.nextAction || 'Provider repair backlog is clear; no exact provider repair work is queued.',
      nextState: '',
      readinessLane: '',
    },
    packet: null,
  }, null, 2));
  process.exit(0);
}

const nextState = firstRow?.stateId || providerLane?.action?.nextState || '';
const readinessLane = firstRow?.readinessLane || providerLane?.action?.readinessLane || providerLane?.firstExecutionLane || 'pull-now';
const command = `npm run audit:provider-repair-batch-packet -- --lane=${readinessLane}${nextState ? ` --state=${nextState}` : ''} --limit=5`;

const result = spawnSync('/bin/zsh', ['-lc', command], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`Provider repair batch packet generation failed.\nCOMMAND: ${command}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

console.log(JSON.stringify({
  command,
  mode: 'review_provider_repair_batch',
  providerRepairBacklog: {
    status: providerLane?.status === 'idle_or_cleared' ? 'needs_followup' : providerLane.status,
    blocker: providerLane.action?.blocker || '',
    nextAction: providerLane.action?.nextAction || '',
    nextState,
    readinessLane,
  },
  packet: parseLastJson(result.stdout),
}, null, 2));
