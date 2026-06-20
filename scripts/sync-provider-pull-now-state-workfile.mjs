import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const decisionFilePath = path.join(dataDir, 'provider-pull-now-decisions.json');
const stateDecisionPacketsDir = path.join(docsDir, 'provider-pull-now-state-decision-packets');
const stateWorkfilesDir = path.join(dataDir, 'provider-pull-now-state-workfiles');

function parseArgs(argv) {
  const args = { state: '' };
  for (const arg of argv) {
    if (arg.startsWith('--state=')) args.state = arg.slice('--state='.length).trim().toLowerCase();
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
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

function pickLatestDecisionPacket(stateId) {
  const names = fs.existsSync(stateDecisionPacketsDir)
    ? fs.readdirSync(stateDecisionPacketsDir).filter((name) => name.startsWith(`provider-pull-now-state-decision-packet-${stateId}-`) && name.endsWith('.json')).sort()
    : [];
  if (!names.length) {
    throw new Error(`Missing provider state decision packet for ${stateId}. Run npm run audit:provider-pull-now-state-decision-packet -- --state=${stateId} first.`);
  }
  return path.join(stateDecisionPacketsDir, names.at(-1));
}

const args = parseArgs(process.argv.slice(2));
if (!args.state) {
  throw new Error('Missing required --state=<state-id>.');
}
if (!fs.existsSync(decisionFilePath)) {
  throw new Error(`Missing provider pull-now decisions: ${decisionFilePath}`);
}

const stateDecisionPacketPath = pickLatestDecisionPacket(args.state);
const stateDecisionPacket = readJson(stateDecisionPacketPath);
const decisionsPayload = readJson(decisionFilePath);
const decisionRows = Array.isArray(decisionsPayload?.rows) ? decisionsPayload.rows : [];
const stateDecisionRowsByKey = new Map(
  decisionRows
    .filter((row) => String(row?.stateId || '').trim().toLowerCase() === args.state)
    .map((row) => [`${args.state}__${normalizeUrl(row.sourceUrl)}`, row]),
);

const rows = (stateDecisionPacket.rows || []).map((row) => {
  const key = `${args.state}__${normalizeUrl(row.sourceUrl)}`;
  const current = stateDecisionRowsByKey.get(key) || row.currentDecision || {};
  return {
    stateId: args.state,
    actionClass: row.actionClass || '',
    sourceUrl: row.sourceUrl || '',
    hostname: row.hostname || '',
    followupReason: row.followupReason || '',
    repeatCount: row.repeatCount ?? 0,
    suggestedDecisionMode: row.suggestedDecisionMode || '',
    suggestedReason: row.suggestedReason || '',
    decisionMode: current.decisionMode || '',
    reviewedSourceName: current.reviewedSourceName || '',
    reviewedSourceUrl: current.reviewedSourceUrl || '',
    retryNotes: current.retryNotes || '',
    reviewNotes: current.reviewNotes || '',
    reviewedBy: current.reviewedBy || '',
  };
});

const unresolvedRows = rows.filter((row) => !(row.decisionMode && row.reviewedBy));
const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  stateId: args.state,
  sourceDecisionFilePath: path.relative(repoRoot, decisionFilePath),
  sourceDecisionPacketPath: path.relative(repoRoot, stateDecisionPacketPath),
  summary: {
    totalRows: rows.length,
    unresolvedRows: unresolvedRows.length,
  },
  rows,
};

const workfilePath = path.join(stateWorkfilesDir, `provider-pull-now-state-workfile-${args.state}.json`);
writeJson(workfilePath, payload);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  stateId: args.state,
  workfile: workfilePath,
  summary: payload.summary,
}, null, 2));
