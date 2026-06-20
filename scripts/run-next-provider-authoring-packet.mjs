import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const packetsIndexPath = path.join(docsDir, `provider-authoring-state-packets-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

function normalizeDomain(rawDomain, rawUrl) {
  const explicit = String(rawDomain || '').trim().replace(/^www\./, '').toLowerCase();
  if (explicit) return explicit;
  try {
    return new URL(String(rawUrl || '').trim()).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function normalizeUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function workfileIsComplete(stateId) {
  const workfilePath = path.join(repoRoot, 'data', 'provider-authoring-state-workfiles', `provider-authoring-state-workfile-${stateId}.json`);
  if (!fs.existsSync(workfilePath)) return false;
  const workfile = readJson(workfilePath);
  const rows = Array.isArray(workfile?.candidateProviderTargets) ? workfile.candidateProviderTargets : [];
  if (!rows.length) return false;
  return rows.every((row) =>
    hasText(row.sourceName)
    && hasText(row.sourceUrl)
    && hasText(normalizeDomain(row.domain, row.sourceUrl))
    && hasText(row.reviewedBy)
  );
}

function workfileNeedsApply(stateId) {
  const workfilePath = path.join(repoRoot, 'data', 'provider-authoring-state-workfiles', `provider-authoring-state-workfile-${stateId}.json`);
  if (!fs.existsSync(workfilePath)) return false;
  const workfile = readJson(workfilePath);
  const rows = Array.isArray(workfile?.candidateProviderTargets) ? workfile.candidateProviderTargets : [];
  if (!rows.length) return false;

  const sourceTargetsPath = path.join(repoRoot, 'data', 'source_targets', `${stateId}.json`);
  if (!fs.existsSync(sourceTargetsPath)) return true;
  const sourceTargets = readJson(sourceTargetsPath);
  const existingUrls = new Set(
    (Array.isArray(sourceTargets) ? sourceTargets : [])
      .map((row) => normalizeUrl(row?.source_url))
      .filter(Boolean),
  );

  return rows.some((row) => {
    const ready = hasText(row.sourceName)
      && hasText(row.sourceUrl)
      && hasText(normalizeDomain(row.domain, row.sourceUrl))
      && hasText(row.reviewedBy);
    if (!ready) return false;
    return !existingUrls.has(normalizeUrl(row.sourceUrl));
  });
}

function completedWorkfileStates(packets) {
  return packets
    .map((packet) => String(packet.stateId || '').trim().toLowerCase())
    .filter(Boolean)
    .filter((stateId) => workfileIsComplete(stateId))
    .filter((stateId) => workfileNeedsApply(stateId));
}

function packetStillNeedsAuthoring(packet) {
  return Number(packet?.neededConcreteTargets || 0) > 0
    || Number(packet?.neededLiveProviderRows || 0) > 0
    || String(packet?.authoringGapClass || '').trim() === 'needs_refresh_or_deeper_targets';
}

function parseLastJson(stdout) {
  const trimmed = stdout.trim();
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

function hasRefreshPrereqs() {
  return fs.existsSync(path.join(docsDir, `provider-buildout-priority-plan-${generatedDate}.json`))
    && fs.existsSync(path.join(docsDir, `provider-source-pack-plan-${generatedDate}.json`));
}

if (hasRefreshPrereqs()) {
  runNodeScript('src/db/generate_provider_authoring_backlog.js');
  runNodeScript('src/db/generate_provider_authoring_state_packets.js');
}

const index = readJson(packetsIndexPath);
const packets = Array.isArray(index.packets) ? index.packets : [];
const completeStates = completedWorkfileStates(packets);
const nextPacket = [...packets]
  .filter((packet) => packetStillNeedsAuthoring(packet))
  .filter((packet) => {
    const stateId = String(packet.stateId || '').trim().toLowerCase();
    if (workfileIsComplete(stateId)) {
      if (workfileNeedsApply(stateId)) return false;
      return Number(packet?.neededLiveProviderRows || 0) > 0;
    }
    return true;
  })
  .sort((a, b) =>
  Number(a.executionPriority || 99) - Number(b.executionPriority || 99)
  || String(a.stateId || '').localeCompare(String(b.stateId || ''))
)[0] || null;

if (!nextPacket) {
  if (completeStates.length > 0) {
    console.log(JSON.stringify({
      mode: 'provider_authoring_apply_ready_workfiles',
      packetsIndexPath,
      selectedPacket: null,
      readyStateCount: completeStates.length,
      readyStates: completeStates.slice(0, 25),
      commands: [
        'node scripts/run-provider-authoring-apply-ready-workfiles.mjs',
        'npm run audit:provider-source-pack',
        'npm run audit:source-acquisition-completion-plan',
      ],
    }, null, 2));
    process.exit(0);
  }
  console.log(JSON.stringify({
    mode: 'provider_authoring_packet_idle',
    packetsIndexPath,
    selectedPacket: null,
    commands: [],
  }, null, 2));
  process.exit(0);
}

const packetPath = path.join(repoRoot, nextPacket.jsonPath);
const packet = fs.existsSync(packetPath) ? readJson(packetPath) : null;
const workfileCommand = `npm run fix:provider-authoring-state-workfile -- --state=${nextPacket.stateId}`;
const workfileStatusCommand = `npm run audit:provider-authoring-state-workfile-status -- --state=${nextPacket.stateId}`;
const workfile = runNodeScript('scripts/sync-provider-authoring-state-workfile.mjs', [`--state=${nextPacket.stateId}`]);
const workfileStatus = runNodeScript('src/db/generate_provider_authoring_state_workfile_status.js', [`--state=${nextPacket.stateId}`]);

console.log(JSON.stringify({
  mode: 'provider_authoring_packet_next_step',
  packetsIndexPath,
  selectedPacket: {
    stateId: nextPacket.stateId,
    stateName: nextPacket.stateName,
    executionPriority: nextPacket.executionPriority,
    neededConcreteTargets: nextPacket.neededConcreteTargets,
    neededLiveProviderRows: Number(nextPacket.neededLiveProviderRows || 0),
    authoringGapClass: nextPacket.authoringGapClass || '',
    jsonPath: nextPacket.jsonPath,
    markdownPath: nextPacket.markdownPath,
    nextAction: packet?.nextAction || '',
  },
  stateWorkfilePath: workfile?.workfile || '',
  stateWorkfileStatusPath: workfileStatus?.json || '',
  commands: [
    'npm run audit:provider-authoring-state-packets',
    'npm run audit:provider-authoring-backlog',
    'npm run audit:provider-source-pack',
    workfileCommand,
    workfileStatusCommand,
  ],
}, null, 2));
