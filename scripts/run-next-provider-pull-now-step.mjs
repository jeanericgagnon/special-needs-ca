import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const controlPlanePath = path.join(repoRoot, 'docs', 'generated', `low-token-control-plane-${generatedDate}.json`);
const refreshCommand = 'npm run audit:low-token-control-plane';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseLastJson(stdout) {
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  const jsonStart = trimmed.lastIndexOf('\n{');
  if (jsonStart >= 0) return JSON.parse(trimmed.slice(jsonStart + 1));
  return trimmed.startsWith('{') ? JSON.parse(trimmed) : null;
}

function deriveLaneStatus(controlPlane) {
  return {
    officialFollowup: controlPlane?.lanes?.officialFollowup?.status || '',
    providerPullNow: controlPlane?.lanes?.providerPullNow?.status || '',
    formsFallback: controlPlane?.lanes?.formsFallback?.status || '',
  };
}

function hasReviewedDecisionRows(payload) {
  const rows = Array.isArray(payload?.rows) ? payload.rows : [];
  return rows.some((row) =>
    String(row?.decisionMode || '').trim().length > 0 &&
    String(row?.reviewedBy || '').trim().length > 0
  );
}

if (!fs.existsSync(controlPlanePath)) {
  throw new Error(`Missing control-plane audit: ${controlPlanePath}. Run npm run audit:low-token-control-plane first.`);
}

const controlPlane = readJson(controlPlanePath);
const providerLane = controlPlane?.lanes?.providerPullNow;
if (!providerLane) {
  throw new Error('Current low-token control plane does not expose a providerPullNow lane.');
}

const recommendedCommands = Array.isArray(providerLane?.action?.recommendedCommands)
  ? providerLane.action.recommendedCommands
  : [];
const syncCommand = recommendedCommands.find((command) => command === 'npm run fix:provider-pull-now-decision-file') || '';
const pruneCommand = recommendedCommands.find((command) => command === 'npm run fix:provider-pull-now-prune-stale') || '';
const applyCommand = recommendedCommands.find((command) => command === 'node scripts/apply-provider-pull-now-decisions.mjs --apply') || '';
const decisionFilePath = providerLane.activeDecisionFilePath
  ? path.join(repoRoot, providerLane.activeDecisionFilePath)
  : path.join(repoRoot, 'data', 'provider-pull-now-decisions.json');
const decisionTemplatePath = providerLane.decisionTemplatePath
  ? path.join(repoRoot, providerLane.decisionTemplatePath)
  : '';

let command = '';
let mode = '';

if (providerLane.activeDecisionRows === 0 && providerLane.decisionTemplateRows > 0) {
  command = syncCommand;
  mode = 'sync';
} else if ((providerLane.staleDecisionRows || 0) > 0 && pruneCommand) {
  command = pruneCommand;
  mode = 'prune_stale';
} else if (providerLane.activeDecisionRows > 0 && fs.existsSync(decisionFilePath) && hasReviewedDecisionRows(readJson(decisionFilePath))) {
  command = applyCommand;
  mode = 'apply';
}

if (!command) {
  console.log(JSON.stringify({
    mode: providerLane.action?.blocker && providerLane.action.blocker !== 'none'
      ? 'awaiting_reviewed_decisions'
      : 'provider_pull_now_idle',
    refreshCommand,
    providerLane: {
      status: providerLane.status,
      blocker: providerLane.action?.blocker || '',
      nextAction: providerLane.action?.nextAction || '',
      decisionTemplatePath: providerLane.decisionTemplatePath || '',
      activeDecisionFilePath: providerLane.activeDecisionFilePath || '',
    },
  }, null, 2));
  process.exit(0);
}

const result = spawnSync('/bin/zsh', ['-lc', command], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`Next provider pull-now step failed.\nCOMMAND: ${command}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const refreshResult = spawnSync('/bin/zsh', ['-lc', refreshCommand], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (refreshResult.status !== 0) {
  throw new Error(`Control-plane audit refresh failed after next provider pull-now step.\nCOMMAND: ${refreshCommand}\nSTDOUT:\n${refreshResult.stdout}\nSTDERR:\n${refreshResult.stderr}`);
}

const payload = parseLastJson(result.stdout);
const refreshedControlPlane = readJson(controlPlanePath);

console.log(JSON.stringify({
  command,
  mode,
  refreshCommand,
  result: payload,
  refreshedControlPlane: {
    path: controlPlanePath,
    laneStatus: deriveLaneStatus(refreshedControlPlane),
    providerPullNow: {
      status: refreshedControlPlane?.lanes?.providerPullNow?.status || '',
      action: refreshedControlPlane?.lanes?.providerPullNow?.action || {},
      decisionTemplatePath: refreshedControlPlane?.lanes?.providerPullNow?.decisionTemplatePath || decisionTemplatePath,
      activeDecisionFilePath: refreshedControlPlane?.lanes?.providerPullNow?.activeDecisionFilePath || '',
      activeDecisionRows: refreshedControlPlane?.lanes?.providerPullNow?.activeDecisionRows ?? 0,
    },
  },
}, null, 2));
