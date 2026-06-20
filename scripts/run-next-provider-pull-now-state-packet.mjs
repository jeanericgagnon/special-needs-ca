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

function hasDecisionValue(value) {
  return String(value || '').trim().length > 0;
}

function unresolvedDecisionRowsByState(rows) {
  const counts = new Map();
  for (const row of rows) {
    if (!row || !row.stateId) continue;
    const complete = hasDecisionValue(row.decisionMode) && hasDecisionValue(row.reviewedBy);
    if (complete) continue;
    counts.set(row.stateId, (counts.get(row.stateId) || 0) + 1);
  }
  return counts;
}

function runRefresh() {
  const result = spawnSync('/bin/zsh', ['-lc', refreshCommand], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`Control-plane audit refresh failed.\nCOMMAND: ${refreshCommand}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
}

if (!fs.existsSync(controlPlanePath)) {
  throw new Error(`Missing control-plane audit: ${controlPlanePath}. Run ${refreshCommand} first.`);
}

let controlPlane = readJson(controlPlanePath);
let providerLane = controlPlane?.lanes?.providerPullNow;
if (!providerLane) {
  throw new Error('Current low-token control plane does not expose a providerPullNow lane.');
}

const syncRequired = providerLane.activeDecisionRows === 0 && providerLane.decisionTemplateRows > 0;
if (syncRequired) {
  const syncResult = spawnSync('/bin/zsh', ['-lc', 'npm run fix:provider-pull-now-decision-file'], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });
  if (syncResult.status !== 0) {
    throw new Error(`Provider pull-now decision sync failed.\nSTDOUT:\n${syncResult.stdout}\nSTDERR:\n${syncResult.stderr}`);
  }
  runRefresh();
  controlPlane = readJson(controlPlanePath);
  providerLane = controlPlane?.lanes?.providerPullNow;
}

const statePacketsPath = providerLane?.statePacketsPath
  ? path.join(repoRoot, providerLane.statePacketsPath)
  : '';
if (!statePacketsPath || !fs.existsSync(statePacketsPath)) {
  throw new Error(`Missing provider state packets index: ${statePacketsPath || 'unset'}. Run npm run audit:provider-pull-now-state-packets first.`);
}

const statePackets = readJson(statePacketsPath);
const packets = Array.isArray(statePackets?.packets) ? statePackets.packets : [];
if (!packets.length) {
  console.log(JSON.stringify({
    mode: 'no_state_packets',
    refreshCommand,
    statePacketsPath: providerLane.statePacketsPath || '',
  }, null, 2));
  process.exit(0);
}

const activeDecisionFilePath = providerLane?.activeDecisionFilePath
  ? path.join(repoRoot, providerLane.activeDecisionFilePath)
  : '';
const activeDecisionRows = activeDecisionFilePath && fs.existsSync(activeDecisionFilePath)
  ? readJson(activeDecisionFilePath)?.rows || []
  : [];
const unresolvedByState = unresolvedDecisionRowsByState(activeDecisionRows);

const nextPacket = packets.find((packet) => (unresolvedByState.get(packet.stateId) || 0) > 0) || packets[0];
const packetPayload = nextPacket?.jsonPath
  ? readJson(path.join(repoRoot, nextPacket.jsonPath))
  : null;
const decisionPacketCommand = nextPacket?.stateId
  ? `npm run audit:provider-pull-now-state-decision-packet -- --state=${nextPacket.stateId}`
  : '';
const stateWorkfileCommand = nextPacket?.stateId
  ? `npm run fix:provider-pull-now-state-workfile -- --state=${nextPacket.stateId}`
  : '';
const stateWorkfileStatusCommand = nextPacket?.stateId
  ? `npm run audit:provider-pull-now-state-workfile-status -- --state=${nextPacket.stateId}`
  : '';
const stateWorkfileValidationCommand = nextPacket?.stateId
  ? `npm run audit:provider-pull-now-state-workfile-validation -- --state=${nextPacket.stateId}`
  : '';
const stateReviewLoopCommand = nextPacket?.stateId
  ? `npm run audit:provider-pull-now-state-review-loop -- --state=${nextPacket.stateId}`
  : '';
let decisionPacket = null;
if (decisionPacketCommand) {
  const decisionPacketResult = spawnSync('/bin/zsh', ['-lc', decisionPacketCommand], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });
  if (decisionPacketResult.status !== 0) {
    throw new Error(`Provider state decision packet generation failed.\nCOMMAND: ${decisionPacketCommand}\nSTDOUT:\n${decisionPacketResult.stdout}\nSTDERR:\n${decisionPacketResult.stderr}`);
  }
  decisionPacket = parseLastJson(decisionPacketResult.stdout);
}
let stateWorkfile = null;
if (stateWorkfileCommand) {
  const stateWorkfileResult = spawnSync('/bin/zsh', ['-lc', stateWorkfileCommand], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });
  if (stateWorkfileResult.status !== 0) {
    throw new Error(`Provider state workfile sync failed.\nCOMMAND: ${stateWorkfileCommand}\nSTDOUT:\n${stateWorkfileResult.stdout}\nSTDERR:\n${stateWorkfileResult.stderr}`);
  }
  stateWorkfile = parseLastJson(stateWorkfileResult.stdout);
}
let stateWorkfileStatus = null;
if (stateWorkfileStatusCommand) {
  const stateWorkfileStatusResult = spawnSync('/bin/zsh', ['-lc', stateWorkfileStatusCommand], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });
  if (stateWorkfileStatusResult.status !== 0) {
    throw new Error(`Provider state workfile status generation failed.\nCOMMAND: ${stateWorkfileStatusCommand}\nSTDOUT:\n${stateWorkfileStatusResult.stdout}\nSTDERR:\n${stateWorkfileStatusResult.stderr}`);
  }
  stateWorkfileStatus = parseLastJson(stateWorkfileStatusResult.stdout);
}
let stateWorkfileValidation = null;
if (stateWorkfileValidationCommand) {
  const stateWorkfileValidationResult = spawnSync('/bin/zsh', ['-lc', stateWorkfileValidationCommand], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });
  if (stateWorkfileValidationResult.status !== 0) {
    throw new Error(`Provider state workfile validation generation failed.\nCOMMAND: ${stateWorkfileValidationCommand}\nSTDOUT:\n${stateWorkfileValidationResult.stdout}\nSTDERR:\n${stateWorkfileValidationResult.stderr}`);
  }
  stateWorkfileValidation = parseLastJson(stateWorkfileValidationResult.stdout);
}
let stateReviewLoop = null;
if (stateReviewLoopCommand) {
  const stateReviewLoopResult = spawnSync('/bin/zsh', ['-lc', stateReviewLoopCommand], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });
  if (stateReviewLoopResult.status !== 0) {
    throw new Error(`Provider state review loop generation failed.\nCOMMAND: ${stateReviewLoopCommand}\nSTDOUT:\n${stateReviewLoopResult.stdout}\nSTDERR:\n${stateReviewLoopResult.stderr}`);
  }
  stateReviewLoop = parseLastJson(stateReviewLoopResult.stdout);
}

console.log(JSON.stringify({
  mode: syncRequired ? 'sync_and_review_state_packet' : 'review_state_packet',
  refreshCommand,
  decisionPacketCommand,
  stateWorkfileCommand,
  stateWorkfileStatusCommand,
  stateWorkfileValidationCommand,
  stateReviewLoopCommand,
  nextState: nextPacket?.stateId || '',
  statePacketPath: nextPacket?.jsonPath || '',
  statePacketMarkdownPath: nextPacket?.markdownPath || '',
  statePacketUnresolvedRows: nextPacket?.unresolvedRows ?? 0,
  stateDecisionPacketPath: decisionPacket?.json || '',
  stateDecisionPacketMarkdownPath: decisionPacket?.markdown || '',
  stateWorkfilePath: stateWorkfile?.workfile || '',
  stateWorkfileStatusPath: stateWorkfileStatus?.json || '',
  stateWorkfileValidationPath: stateWorkfileValidation?.json || '',
  stateReviewLoopPath: stateReviewLoop?.json || '',
  activeDecisionFilePath: providerLane?.activeDecisionFilePath || '',
  unresolvedDecisionRowsForState: unresolvedByState.get(nextPacket?.stateId || '') || 0,
  firstActionClass: packetPayload?.rows?.[0]?.actionClass || '',
  topConcreteTargets: packetPayload?.topConcreteTargets?.slice(0, 3) || [],
}, null, 2));
