import fs from 'fs';
import path from 'path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const stateDir = path.join(repoRoot, 'data', 'source-acquisition-state');
const ledgerPath = path.join(stateDir, 'provider-authoring-ledger.json');

function parseArgs(argv) {
  const args = {
    state: '',
    note: '',
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'state') args.state = value.toLowerCase();
    if (flag === 'note') args.note = value;
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

const args = parseArgs(process.argv.slice(2));
if (!args.state) {
  throw new Error('Missing required --state=<stateId>');
}

const payload = fs.existsSync(ledgerPath)
  ? readJson(ledgerPath)
  : { generatedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), rows: [] };

const row = {
  stateId: args.state,
  status: 'complete',
  note: args.note,
  updatedAt: new Date().toISOString(),
};

const existingIndex = (payload.rows || []).findIndex((item) => String(item?.stateId || '').trim().toLowerCase() === args.state);
if (existingIndex >= 0) payload.rows[existingIndex] = row;
else payload.rows.push(row);
payload.updatedAt = new Date().toISOString();

writeJson(ledgerPath, payload);

console.log(JSON.stringify({
  ledgerPath: path.relative(repoRoot, ledgerPath),
  stateId: args.state,
  status: 'complete',
  rowCount: payload.rows.length,
}, null, 2));
