import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);

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

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

const args = parseArgs(process.argv.slice(2));
if (!args.state) {
  throw new Error('Missing required --state=<state-id>.');
}

const workfilePath = path.join(dataDir, 'provider-pull-now-state-workfiles', `provider-pull-now-state-workfile-${args.state}.json`);
if (!fs.existsSync(workfilePath)) {
  throw new Error(`Missing provider state workfile: ${workfilePath}`);
}

const jsonOutPath = path.join(docsDir, `provider-pull-now-state-workfile-status-${args.state}-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-pull-now-state-workfile-status-${args.state}-${generatedDate}.md`);
const workfile = readJson(workfilePath);
const rows = Array.isArray(workfile?.rows) ? workfile.rows : [];
const filledRows = rows.filter((row) => hasText(row.decisionMode) && hasText(row.reviewedBy));
const unresolvedRows = rows.filter((row) => !hasText(row.decisionMode) || !hasText(row.reviewedBy));

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  stateId: args.state,
  sourceWorkfilePath: path.relative(repoRoot, workfilePath),
  summary: {
    totalRows: rows.length,
    filledRows: filledRows.length,
    unresolvedRows: unresolvedRows.length,
    completionPercent: rows.length ? Number(((filledRows.length / rows.length) * 100).toFixed(1)) : 0,
    bySuggestedDecisionMode: countBy(unresolvedRows, 'suggestedDecisionMode'),
    byActionClass: countBy(unresolvedRows, 'actionClass'),
  },
  nextWork: unresolvedRows.slice(0, 10).map((row) => ({
    actionClass: row.actionClass || '',
    suggestedDecisionMode: row.suggestedDecisionMode || '',
    sourceUrl: row.sourceUrl || '',
    repeatCount: row.repeatCount ?? 0,
  })),
};

const mdLines = [
  '# Provider Pull-Now State Workfile Status',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  `State: ${payload.stateId}`,
  `Source workfile: ${payload.sourceWorkfilePath}`,
  '',
  '## Summary',
  '',
  `- total rows: ${payload.summary.totalRows}`,
  `- filled rows: ${payload.summary.filledRows}`,
  `- unresolved rows: ${payload.summary.unresolvedRows}`,
  `- completion percent: ${payload.summary.completionPercent}`,
  '',
  '## Unresolved By Suggested Decision',
  '',
  ...Object.entries(payload.summary.bySuggestedDecisionMode).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## Unresolved By Action Class',
  '',
  ...Object.entries(payload.summary.byActionClass).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## Next Work',
  '',
  ...payload.nextWork.map((row) => `- ${row.actionClass} | ${row.suggestedDecisionMode} | repeats=${row.repeatCount} | ${row.sourceUrl}`),
];

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  unresolvedRows: payload.summary.unresolvedRows,
  completionPercent: payload.summary.completionPercent,
}, null, 2));
