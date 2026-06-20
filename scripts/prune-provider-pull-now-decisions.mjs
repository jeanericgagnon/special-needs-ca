import fs from 'fs';
import path from 'path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const generatedDate = new Date().toISOString().slice(0, 10);
const defaultInputPath = path.join(dataDir, 'provider-pull-now-decisions.json');
const decisionTemplatePath = path.join(docsDir, `provider-pull-now-decision-template-${generatedDate}.json`);

function parseArgs(argv) {
  const args = {
    apply: false,
    input: defaultInputPath,
  };

  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--input=')) args.input = path.resolve(arg.slice('--input='.length).trim());
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

function normalizeUrl(rawUrl) {
  if (!hasText(rawUrl)) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) parsed.port = '';
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(args.input)) {
  console.log(JSON.stringify({
    mode: args.apply ? 'apply' : 'dry-run',
    inputPath: path.relative(repoRoot, args.input),
    keptRows: 0,
    prunedRows: 0,
    prunedByReason: {},
    prunedRowsSample: [],
  }, null, 2));
  process.exit(0);
}

if (!fs.existsSync(decisionTemplatePath)) {
  throw new Error(`Missing provider pull-now decision template: ${decisionTemplatePath}. Run npm run audit:provider-pull-now-decision-template first.`);
}

const raw = readJson(args.input);
const rows = Array.isArray(raw) ? raw : Array.isArray(raw.rows) ? raw.rows : [];
const decisionTemplate = readJson(decisionTemplatePath);
const templateKeys = new Set((decisionTemplate.rows || []).map((row) =>
  `${String(row.stateId || '').trim().toLowerCase()}__${normalizeUrl(row.sourceUrl)}`
));

const keptRows = [];
const prunedRows = [];

for (const row of rows) {
  const stateId = String(row?.stateId || '').trim().toLowerCase();
  const sourceUrl = normalizeUrl(row?.sourceUrl);
  const reason = !stateId || !sourceUrl
    ? 'missing_identity_fields'
    : !templateKeys.has(`${stateId}__${sourceUrl}`)
      ? 'row_not_in_live_pull_now_template'
      : '';

  if (reason) {
    prunedRows.push({
      stateId,
      sourceUrl,
      decisionMode: String(row?.decisionMode || ''),
      reviewedBy: String(row?.reviewedBy || ''),
      reason,
    });
    continue;
  }

  keptRows.push(row);
}

if (args.apply && !Array.isArray(raw)) {
  writeJson(args.input, {
    ...raw,
    rows: keptRows,
  });
} else if (args.apply) {
  writeJson(args.input, keptRows);
}

const prunedByReason = prunedRows.reduce((acc, row) => {
  acc[row.reason] = (acc[row.reason] || 0) + 1;
  return acc;
}, {});

console.log(JSON.stringify({
  mode: args.apply ? 'apply' : 'dry-run',
  inputPath: path.relative(repoRoot, args.input),
  keptRows: keptRows.length,
  prunedRows: prunedRows.length,
  prunedByReason,
  prunedRowsSample: prunedRows.slice(0, 10),
}, null, 2));
