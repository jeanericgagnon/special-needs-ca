import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();

function parseArgs(argv) {
  const args = { state: '', resync: false };
  for (const arg of argv) {
    if (arg === '--resync') args.resync = true;
    if (arg.startsWith('--state=')) args.state = arg.slice('--state='.length).trim().toLowerCase();
  }
  return args;
}

function parseLastJson(stdout) {
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  const jsonStart = trimmed.lastIndexOf('\n{');
  if (jsonStart >= 0) return JSON.parse(trimmed.slice(jsonStart + 1));
  return trimmed.startsWith('{') ? JSON.parse(trimmed) : null;
}

function runCommand(command) {
  const result = spawnSync('/bin/zsh', ['-lc', command], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Command failed.\nCOMMAND: ${command}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return parseLastJson(result.stdout);
}

const args = parseArgs(process.argv.slice(2));
if (!args.state) {
  throw new Error('Missing required --state=<state-id>.');
}

const workfilePath = path.join(repoRoot, 'data', 'provider-pull-now-state-workfiles', `provider-pull-now-state-workfile-${args.state}.json`);
const shouldSync = args.resync || !fs.existsSync(workfilePath);
const workfileSync = shouldSync
  ? runCommand(`npm run fix:provider-pull-now-state-workfile -- --state=${args.state}`)
  : { workfile: workfilePath };
const workfileStatus = runCommand(`npm run audit:provider-pull-now-state-workfile-status -- --state=${args.state}`);
const workfileValidation = runCommand(`npm run audit:provider-pull-now-state-workfile-validation -- --state=${args.state}`);
const reviewLoop = runCommand(`npm run audit:provider-pull-now-state-review-loop -- --state=${args.state}`);

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  stateId: args.state,
  workfilePath: workfileSync?.workfile || '',
  workfileStatusPath: workfileStatus?.json || '',
  workfileValidationPath: workfileValidation?.json || '',
  reviewLoopPath: reviewLoop?.json || '',
  syncedWorkfile: shouldSync,
  summary: {
    unresolvedRows: workfileStatus?.unresolvedRows ?? null,
    completionPercent: workfileStatus?.completionPercent ?? null,
    validationIssueRows: workfileValidation?.summary?.issueRows ?? null,
    mergeReady: workfileValidation?.summary?.mergeReady ?? null,
  },
}, null, 2));
