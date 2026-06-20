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
  if (jsonStart >= 0) {
    return JSON.parse(trimmed.slice(jsonStart + 1));
  }
  return trimmed.startsWith('{') ? JSON.parse(trimmed) : null;
}

if (!fs.existsSync(controlPlanePath)) {
  throw new Error(`Missing control-plane audit: ${controlPlanePath}. Run npm run audit:low-token-control-plane first.`);
}

const controlPlane = readJson(controlPlanePath);
const command = controlPlane?.lanes?.formsFallback?.action?.exactNextCommand || '';

if (!command) {
  throw new Error('No exact next forms fallback command is available in the current control-plane audit.');
}

if (!command.startsWith('npm run run:forms-fallback-source-acquisition -- ')) {
  throw new Error(`Refusing to run unexpected command from control-plane audit: ${command}`);
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
  throw new Error(`Next forms fallback step failed.\nCOMMAND: ${command}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
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
  throw new Error(`Control-plane audit refresh failed after next forms fallback step.\nCOMMAND: ${refreshCommand}\nSTDOUT:\n${refreshResult.stdout}\nSTDERR:\n${refreshResult.stderr}`);
}

const payload = parseLastJson(result.stdout);
const refreshedControlPlane = readJson(controlPlanePath);
const refreshedLaneStatus = refreshedControlPlane?.laneStatus || {
  officialFollowup: refreshedControlPlane?.lanes?.officialFollowup?.status || '',
  providerPlaceholder: refreshedControlPlane?.lanes?.providerPlaceholder?.status || '',
  formsFallback: refreshedControlPlane?.lanes?.formsFallback?.status || '',
};

console.log(JSON.stringify({
  command,
  refreshCommand,
  result: payload,
  refreshedControlPlane: {
    path: controlPlanePath,
    laneStatus: refreshedLaneStatus,
    formsFallback: {
      status: refreshedControlPlane?.lanes?.formsFallback?.status || '',
      action: refreshedControlPlane?.lanes?.formsFallback?.action || {},
      latestFallbackRunSummary: refreshedControlPlane?.lanes?.formsFallback?.latestFallbackRunSummary || null,
      manualReviewQueueSummary: refreshedControlPlane?.lanes?.formsFallback?.manualReviewQueueSummary || null,
      stateLedgerSummary: refreshedControlPlane?.lanes?.formsFallback?.stateLedgerSummary || null,
    },
  },
}, null, 2));
