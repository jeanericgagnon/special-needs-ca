import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const validationScriptPath = path.resolve(__dirname, '..', 'src', 'db', 'generate_provider_pull_now_state_workfile_validation.js');
const dataDir = path.join(repoRoot, 'data');
const decisionFilePath = path.join(dataDir, 'provider-pull-now-decisions.json');
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

const args = parseArgs(process.argv.slice(2));
if (!args.state) {
  throw new Error('Missing required --state=<state-id>.');
}
if (!fs.existsSync(decisionFilePath)) {
  throw new Error(`Missing provider pull-now decisions: ${decisionFilePath}`);
}

const workfilePath = path.join(stateWorkfilesDir, `provider-pull-now-state-workfile-${args.state}.json`);
if (!fs.existsSync(workfilePath)) {
  throw new Error(`Missing provider state workfile: ${workfilePath}. Run npm run fix:provider-pull-now-state-workfile -- --state=${args.state} first.`);
}

if (args.apply) {
  const validationResult = spawnSync(process.execPath, [validationScriptPath, `--state=${args.state}`], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });
  if (validationResult.status !== 0) {
    throw new Error(`Provider state workfile validation failed.\nSTDOUT:\n${validationResult.stdout}\nSTDERR:\n${validationResult.stderr}`);
  }
  const trimmed = validationResult.stdout.trim();
  const jsonStart = trimmed.lastIndexOf('\n{');
  const validationPayload = JSON.parse(jsonStart >= 0 ? trimmed.slice(jsonStart + 1) : trimmed);
  if (!validationPayload?.summary?.mergeReady) {
    throw new Error(`Provider state workfile is not merge-ready for state=${args.state}. Review ${validationPayload?.json || 'validation artifact'} first.`);
  }
}

const decisionsPayload = readJson(decisionFilePath);
const decisionRows = Array.isArray(decisionsPayload?.rows) ? decisionsPayload.rows : [];
const workfile = readJson(workfilePath);
const workRows = Array.isArray(workfile?.rows) ? workfile.rows : [];
const workRowsByKey = new Map(workRows.map((row) => [`${args.state}__${normalizeUrl(row.sourceUrl)}`, row]));

let updatedRows = 0;
for (const row of decisionRows) {
  const stateId = String(row?.stateId || '').trim().toLowerCase();
  if (stateId !== args.state) continue;
  const key = `${stateId}__${normalizeUrl(row.sourceUrl)}`;
  const workRow = workRowsByKey.get(key);
  if (!workRow) continue;
  row.decisionMode = workRow.decisionMode || '';
  row.reviewedSourceName = workRow.reviewedSourceName || '';
  row.reviewedSourceUrl = workRow.reviewedSourceUrl || '';
  row.retryNotes = workRow.retryNotes || '';
  row.reviewNotes = workRow.reviewNotes || '';
  row.reviewedBy = workRow.reviewedBy || '';
  updatedRows += 1;
}

if (args.apply) {
  writeJson(decisionFilePath, decisionsPayload);
}

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  stateId: args.state,
  mode: args.apply ? 'apply' : 'dry-run',
  workfile: workfilePath,
  updatedRows,
  decisionFilePath,
}, null, 2));
