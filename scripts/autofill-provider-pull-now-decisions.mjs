import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const defaultDecisionPath = path.join(dataDir, 'provider-pull-now-decisions.json');
const sourcePackPlanPath = path.join(docsDir, `provider-source-pack-plan-${generatedDate}.json`);
const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');

function parseArgs(argv) {
  const args = {
    apply: false,
    input: defaultDecisionPath,
    state: null,
  };

  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--input=')) args.input = path.resolve(arg.slice('--input='.length).trim());
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

function domainFromUrl(rawUrl) {
  try {
    return new URL(String(rawUrl).trim()).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function toMarkdown(report) {
  const lines = [
    '# Provider Pull-Now Autofill Run',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Mode: ${report.mode}`,
    '',
    '## Summary',
    '',
    `- state filter: ${report.stateFilter || 'all'}`,
    `- input rows: ${report.summary.inputRows}`,
    `- autofilled rows: ${report.summary.autofilledRows}`,
    `- skipped rows: ${report.summary.skippedRows}`,
    '',
    '## Skipped By Reason',
    '',
    ...Object.entries(report.summary.skippedByReason).sort((a, b) => b[1] - a[1]).map(([reason, count]) => `- ${reason}: ${count}`),
    '',
    '## Autofilled Decisions',
    '',
  ];

  for (const item of report.decisions.filter((row) => row.status === 'autofilled')) {
    lines.push(`- ${item.stateId} | ${item.sourceUrl} -> ${item.reviewedSourceUrl}`);
  }

  return `${lines.join('\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(args.input)) {
  throw new Error(`Missing provider pull-now decisions: ${args.input}`);
}
if (!fs.existsSync(sourcePackPlanPath)) {
  throw new Error(`Missing provider source pack plan: ${sourcePackPlanPath}`);
}

const decisionsPayload = readJson(args.input);
const rows = Array.isArray(decisionsPayload?.rows) ? decisionsPayload.rows : [];
const selectedRows = rows.filter((row) => !args.state || String(row.stateId || '').trim().toLowerCase() === args.state);
const sourcePackPlan = readJson(sourcePackPlanPath);
const statePlanById = new Map((sourcePackPlan.states || []).map((state) => [state.stateId, state]));

const summary = {
  inputRows: selectedRows.length,
  autofilledRows: 0,
  skippedRows: 0,
  skippedByReason: {},
};
const decisions = [];

function noteSkip(reason, row) {
  summary.skippedRows += 1;
  summary.skippedByReason[reason] = (summary.skippedByReason[reason] || 0) + 1;
  decisions.push({
    stateId: row.stateId,
    sourceUrl: row.sourceUrl,
    status: 'skipped',
    reason,
  });
}

for (const row of selectedRows) {
  if (hasText(row?.decisionMode) || hasText(row?.reviewedBy)) {
    noteSkip('already_filled', row);
    continue;
  }
  if (row.actionClass === 'bounded_retry_then_replace') {
    noteSkip('retry_rows_not_autofilled', row);
    continue;
  }

  const statePlan = statePlanById.get(String(row.stateId || '').trim().toLowerCase());
  const concreteTargets = Array.isArray(statePlan?.concreteProviderTargets) ? statePlan.concreteProviderTargets : [];
  const sourceUrl = normalizeUrl(row.sourceUrl);
  const sourceDomain = domainFromUrl(sourceUrl);
  const candidates = concreteTargets.filter((target) => domainFromUrl(target.source_url) === sourceDomain);

  if (candidates.length !== 1) {
    noteSkip(candidates.length === 0 ? 'no_same_domain_candidate' : 'ambiguous_same_domain_candidates', row);
    continue;
  }

  const candidate = candidates[0];
  const candidateUrl = normalizeUrl(candidate.source_url);
  if (!candidateUrl || candidateUrl === sourceUrl) {
    noteSkip('candidate_url_not_meaningfully_different', row);
    continue;
  }

  row.decisionMode = 'replace_with_reviewed_first_party_target';
  row.reviewedSourceName = String(candidate.source_name || '').trim();
  row.reviewedSourceUrl = candidateUrl;
  row.reviewNotes = 'Autofilled from a unique same-domain concrete provider target in the current provider source pack plan.';
  row.reviewedBy = 'autofill:provider-pull-now-same-domain';
  summary.autofilledRows += 1;
  decisions.push({
    stateId: row.stateId,
    sourceUrl: row.sourceUrl,
    status: 'autofilled',
    reviewedSourceUrl: row.reviewedSourceUrl,
  });
}

if (args.apply) {
  writeJson(args.input, decisionsPayload);
}

const report = {
  generatedAt: new Date().toISOString(),
  mode: args.apply ? 'apply' : 'dry-run',
  stateFilter: args.state,
  inputPath: path.relative(repoRoot, args.input),
  summary,
  decisions,
};

const reportJsonPath = path.join(docsDir, `provider-pull-now-autofill-run-${runTimestamp}.json`);
const reportMdPath = path.join(docsDir, `provider-pull-now-autofill-run-${runTimestamp}.md`);
writeJson(reportJsonPath, report);
fs.writeFileSync(reportMdPath, toMarkdown(report));

console.log(JSON.stringify({
  generatedAt: report.generatedAt,
  mode: report.mode,
  summary: report.summary,
  report: {
    json: reportJsonPath,
    md: reportMdPath,
  },
}, null, 2));
