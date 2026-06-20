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
const allowedDecisionModes = new Set([
  'replace_with_reviewed_first_party_target',
  'bounded_retry_once',
  'needs_manual_research',
  'skip_unresolved',
]);

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

const args = parseArgs(process.argv.slice(2));
if (!args.state) throw new Error('Missing required --state=<state-id>.');

const workfilePath = path.join(dataDir, 'provider-pull-now-state-workfiles', `provider-pull-now-state-workfile-${args.state}.json`);
if (!fs.existsSync(workfilePath)) throw new Error(`Missing provider state workfile: ${workfilePath}`);

const workfile = readJson(workfilePath);
const rows = Array.isArray(workfile?.rows) ? workfile.rows : [];
const issues = [];

for (const row of rows) {
  const rowIssues = [];
  const decisionMode = String(row?.decisionMode || '').trim();
  const reviewedBy = String(row?.reviewedBy || '').trim();
  const sourceUrl = String(row?.sourceUrl || '').trim();
  const actionClass = String(row?.actionClass || '').trim();

  if (!decisionMode && !reviewedBy) continue;
  if (!allowedDecisionModes.has(decisionMode)) rowIssues.push('invalid_decision_mode');
  if (!reviewedBy) rowIssues.push('missing_reviewed_by');
  if (decisionMode === 'replace_with_reviewed_first_party_target') {
    if (!hasText(row?.reviewedSourceName)) rowIssues.push('missing_reviewed_source_name');
    if (!hasText(row?.reviewedSourceUrl)) rowIssues.push('missing_reviewed_source_url');
  }
  if (decisionMode === 'bounded_retry_once' && actionClass !== 'bounded_retry_then_replace') {
    rowIssues.push('retry_mode_not_allowed_for_action_class');
  }

  if (rowIssues.length) {
    issues.push({
      stateId: args.state,
      sourceUrl,
      actionClass,
      decisionMode,
      rowIssues,
    });
  }
}

const filledRows = rows.filter((row) => hasText(row?.decisionMode) && hasText(row?.reviewedBy));
const unresolvedRows = rows.filter((row) => !hasText(row?.decisionMode) || !hasText(row?.reviewedBy));
const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  stateId: args.state,
  sourceWorkfilePath: path.relative(repoRoot, workfilePath),
  summary: {
    totalRows: rows.length,
    filledRows: filledRows.length,
    unresolvedRows: unresolvedRows.length,
    issueRows: issues.length,
    mergeReady: issues.length === 0 && unresolvedRows.length === 0,
  },
  issues,
};

const jsonOutPath = path.join(docsDir, `provider-pull-now-state-workfile-validation-${args.state}-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-pull-now-state-workfile-validation-${args.state}-${generatedDate}.md`);
const mdLines = [
  '# Provider Pull-Now State Workfile Validation',
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
  `- issue rows: ${payload.summary.issueRows}`,
  `- merge ready: ${payload.summary.mergeReady}`,
  '',
  '## Issues',
  '',
  ...(issues.length ? issues.map((issue) => `- ${issue.actionClass} | ${issue.decisionMode || 'blank'} | ${issue.sourceUrl} | ${issue.rowIssues.join(', ')}`) : ['- none']),
];

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  summary: payload.summary,
}, null, 2));
