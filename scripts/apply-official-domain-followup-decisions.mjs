import fs from 'fs';
import path from 'path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const defaultInputPath = process.env.INPUT_PATH || path.join(repoRoot, 'data', 'official-domain-followup-decisions.json');
const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
const today = new Date().toISOString().slice(0, 10);

function parseArgs(argv) {
  const args = {
    apply: false,
    input: defaultInputPath,
    state: null,
  };

  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--input=')) args.input = arg.slice('--input='.length).trim();
    else if (arg.startsWith('--state=')) args.state = arg.slice('--state='.length).trim().toLowerCase();
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function toMarkdown(report) {
  const lines = [
    '# Official Domain Follow-Up Decision Run',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Mode: ${report.mode}`,
    '',
    '## Summary',
    '',
    `- state filter: ${report.stateFilter || 'all'}`,
    `- input path: ${report.inputPath}`,
    `- decision rows: ${report.summary.inputRows}`,
    `- applied states: ${report.summary.appliedStates}`,
    `- files changed: ${report.summary.filesChanged}`,
    '',
    '## Skipped By Reason',
    '',
    ...Object.entries(report.summary.skippedByReason).sort((a, b) => b[1] - a[1]).map(([reason, count]) => `- ${reason}: ${count}`),
    '',
    '## Decisions',
    '',
  ];

  for (const item of report.decisions) {
    lines.push(`- ${item.stateId} | ${item.sourceName} | ${item.status} | target=${item.targetUrl || ''}`);
  }

  return `${lines.join('\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(args.input)) {
  console.log(JSON.stringify({
    message: 'No official-domain follow-up decision file found; nothing to apply.',
    expectedPath: args.input,
    appliedStates: 0,
  }, null, 2));
  process.exit(0);
}

const raw = readJson(args.input);
const rows = Array.isArray(raw) ? raw : raw.rows;
if (!Array.isArray(rows)) {
  throw new Error(`Expected rows array in ${args.input}`);
}

const selectedRows = rows.filter((row) => !args.state || row.stateId === args.state);
const changedFiles = new Set();
const summary = {
  inputRows: selectedRows.length,
  appliedStates: 0,
  filesChanged: 0,
  skippedByReason: {},
};
const decisions = [];

function note(reason) {
  summary.skippedByReason[reason] = (summary.skippedByReason[reason] || 0) + 1;
}

for (const row of selectedRows) {
  const stateId = hasText(row?.stateId) ? String(row.stateId).trim().toLowerCase() : '';
  const targetTable = hasText(row?.targetTable) ? String(row.targetTable).trim() : '';
  const sourceName = hasText(row?.sourceName) ? String(row.sourceName).trim() : '';
  const fakeSourceUrl = normalizeUrl(row?.fakeSourceUrl);
  const decisionMode = hasText(row?.decisionMode) ? String(row.decisionMode).trim() : '';
  const reviewedBy = hasText(row?.reviewedBy) ? String(row.reviewedBy).trim() : '';

  if (!stateId || !targetTable || !sourceName || !fakeSourceUrl) {
    note('missing_identity_fields');
    continue;
  }
  if (!reviewedBy) {
    note('missing_reviewed_by');
    decisions.push({ stateId, sourceName, status: 'skipped_missing_reviewed_by', targetUrl: '' });
    continue;
  }
  if (!['choose_exact_candidate', 'verify_first_party_root_hint', 'skip_followup'].includes(decisionMode)) {
    note('invalid_decision_mode');
    decisions.push({ stateId, sourceName, status: 'skipped_invalid_decision_mode', targetUrl: '' });
    continue;
  }
  if (decisionMode === 'skip_followup') {
    note('skipped_followup');
    decisions.push({ stateId, sourceName, status: 'skipped_followup', targetUrl: '' });
    continue;
  }

  const candidates = Array.isArray(row?.replacementCandidates) ? row.replacementCandidates : [];
  let targetUrl = '';
  let targetName = '';

  if (decisionMode === 'choose_exact_candidate') {
    const chosenUrl = normalizeUrl(row?.chosenCandidateUrl);
    const chosenCandidate = candidates.find((candidate) => normalizeUrl(candidate.url) === chosenUrl && candidate.confidence === 'medium');
    if (!chosenCandidate) {
      note('invalid_or_missing_exact_candidate_choice');
      decisions.push({ stateId, sourceName, status: 'skipped_invalid_or_missing_exact_candidate_choice', targetUrl: chosenUrl });
      continue;
    }
    targetUrl = chosenUrl;
    targetName = chosenCandidate.name || sourceName;
  }

  if (decisionMode === 'verify_first_party_root_hint') {
    const verifiedUrl = normalizeUrl(row?.verifiedReplacementUrl);
    const verifiedName = hasText(row?.verifiedReplacementName) ? String(row.verifiedReplacementName).trim() : '';
    const rootHintCandidate = candidates.find((candidate) => normalizeUrl(candidate.url) === verifiedUrl);
    if (!rootHintCandidate || !verifiedName) {
      note('invalid_or_missing_root_hint_verification');
      decisions.push({ stateId, sourceName, status: 'skipped_invalid_or_missing_root_hint_verification', targetUrl: verifiedUrl });
      continue;
    }
    targetUrl = verifiedUrl;
    targetName = verifiedName;
  }

  const filePath = path.join(sourceTargetsDir, `${stateId}.json`);
  if (!fs.existsSync(filePath)) {
    note('missing_source_targets_file');
    decisions.push({ stateId, sourceName, status: 'skipped_missing_source_targets_file', targetUrl });
    continue;
  }

  const payload = readJson(filePath);
  const items = Array.isArray(payload) ? payload : payload.targets || [];
  const match = items.find((item) =>
    (item.target_table || '') === targetTable &&
    (item.source_name || '') === sourceName &&
    normalizeUrl(item.source_url || '') === fakeSourceUrl
  );

  if (!match) {
    note('missing_source_row');
    decisions.push({ stateId, sourceName, status: 'skipped_missing_source_row', targetUrl });
    continue;
  }

  const repairNote = `Official follow-up decision applied ${today} from ${fakeSourceUrl} to ${targetUrl}.`;
  const after = {
    source_url: targetUrl,
    source_name: targetName,
    domain: domainFromUrl(targetUrl),
    notes: String(match.notes || '').includes('Official follow-up decision applied')
      ? String(match.notes || '')
      : `${String(match.notes || '')}${match.notes ? ' ' : ''}${repairNote}`,
  };

  if (args.apply) {
    match.source_url = after.source_url;
    match.source_name = after.source_name;
    match.domain = after.domain;
    match.notes = after.notes;
    fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
    changedFiles.add(filePath);
  }

  summary.appliedStates += 1;
  decisions.push({
    stateId,
    sourceName,
    status: args.apply ? 'applied' : 'dry_run_ready',
    targetUrl,
  });
}

summary.filesChanged = changedFiles.size;

const report = {
  generatedAt: new Date().toISOString(),
  mode: args.apply ? 'apply' : 'dry-run',
  stateFilter: args.state,
  inputPath: args.input,
  summary,
  decisions,
};

const jsonOutPath = path.join(docsDir, `official-domain-followup-run-${runTimestamp}.json`);
const mdOutPath = path.join(docsDir, `official-domain-followup-run-${runTimestamp}.md`);
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(mdOutPath, toMarkdown(report));

console.log(JSON.stringify({
  generatedAt: report.generatedAt,
  mode: report.mode,
  stateFilter: report.stateFilter,
  summary: report.summary,
  report: {
    json: jsonOutPath,
    md: mdOutPath,
  },
}, null, 2));
