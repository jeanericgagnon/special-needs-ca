import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const dataDir = path.join(repoRoot, 'data');
const stateWorkfilesDir = path.join(dataDir, 'provider-pull-now-state-workfiles');

function parseArgs(argv) {
  const args = { state: '', apply: false };
  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--state=')) args.state = arg.slice('--state='.length).trim().toLowerCase();
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

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

const args = parseArgs(process.argv.slice(2));
if (!args.state) throw new Error('Missing required --state=<state-id>.');

const workfilePath = path.join(stateWorkfilesDir, `provider-pull-now-state-workfile-${args.state}.json`);
if (!fs.existsSync(workfilePath)) {
  throw new Error(`Missing provider state workfile: ${workfilePath}`);
}

const payload = readJson(workfilePath);
const rows = Array.isArray(payload?.rows) ? payload.rows : [];
const summary = {
  inputRows: rows.length,
  autofilledRows: 0,
  skippedRows: 0,
  skippedByReason: {},
};

function noteSkip(reason) {
  summary.skippedRows += 1;
  summary.skippedByReason[reason] = (summary.skippedByReason[reason] || 0) + 1;
}

for (const row of rows) {
  if (hasText(row?.decisionMode) || hasText(row?.reviewedBy)) {
    noteSkip('already_filled');
    continue;
  }
  const suggestedDecisionMode = String(row?.suggestedDecisionMode || '').trim();
  if (!['needs_manual_research', 'bounded_retry_once'].includes(suggestedDecisionMode)) {
    noteSkip('unsupported_suggested_decision');
    continue;
  }
  row.decisionMode = suggestedDecisionMode;
  row.reviewNotes = hasText(row?.reviewNotes)
    ? row.reviewNotes
    : String(row?.suggestedReason || '').trim();
  if (suggestedDecisionMode === 'bounded_retry_once' && !hasText(row?.retryNotes)) {
    row.retryNotes = String(row?.suggestedReason || '').trim();
  }
  row.reviewedBy = 'autofill:provider-pull-now-state-workfile';
  summary.autofilledRows += 1;
}

if (args.apply) {
  writeJson(workfilePath, payload);
}

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  stateId: args.state,
  mode: args.apply ? 'apply' : 'dry-run',
  workfilePath,
  summary,
}, null, 2));
