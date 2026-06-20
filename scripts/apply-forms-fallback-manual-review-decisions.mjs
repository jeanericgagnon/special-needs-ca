import fs from 'fs';
import path from 'path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const sourcePacksDir = path.join(dataDir, 'source_packs');
const stateDir = path.join(dataDir, 'source-acquisition-state');
const generatedDate = new Date().toISOString().slice(0, 10);
const defaultInputPath = process.env.INPUT_PATH || path.join(repoRoot, 'data', 'forms-fallback-manual-review-decisions.json');
const queuePath = path.join(docsDir, `forms-fallback-manual-review-queue-${generatedDate}.json`);
const resolutionLedgerPath = path.join(stateDir, 'forms-fallback-manual-review-ledger.json');
const resolutionPackPath = path.join(sourcePacksDir, 'forms_fallback_manual_resolutions.json');
const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');

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

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return readJson(filePath);
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
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function toMarkdown(report) {
  const lines = [
    '# Forms Fallback Manual Review Decision Run',
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
    `- resolved rows: ${report.summary.resolvedRows}`,
    `- deferred rows: ${report.summary.deferredRows}`,
    `- files changed: ${report.summary.filesChanged}`,
    '',
    '## Skipped By Reason',
    '',
    ...Object.entries(report.summary.skippedByReason).sort((a, b) => b[1] - a[1]).map(([reason, count]) => `- ${reason}: ${count}`),
    '',
    '## Decision Modes',
    '',
    ...Object.entries(report.summary.byDecisionMode).sort((a, b) => b[1] - a[1]).map(([mode, count]) => `- ${mode}: ${count}`),
    '',
    '## Decisions',
    '',
  ];

  for (const item of report.decisions) {
    lines.push(`- ${item.stateId} | ${item.rowKey} | ${item.status} | resolved=${item.resolvedSourceUrl || ''}`);
  }

  return `${lines.join('\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(args.input)) {
  console.log(JSON.stringify({
    message: 'No forms-fallback manual-review decision file found; nothing to apply.',
    expectedPath: args.input,
    resolvedRows: 0,
  }, null, 2));
  process.exit(0);
}

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing forms-fallback manual review queue: ${queuePath}. Run npm run audit:forms-fallback-manual-review-queue first.`);
}

const queue = readJson(queuePath);
const queueByKey = new Map((queue.rows || []).map((row) => [row.rowKey, row]));
const raw = readJson(args.input);
const rows = Array.isArray(raw) ? raw : raw.rows;
if (!Array.isArray(rows)) {
  throw new Error(`Expected rows array in ${args.input}`);
}

const selectedRows = rows.filter((row) => !args.state || row.stateId === args.state);
const resolutionLedger = readJsonIfExists(resolutionLedgerPath, {
  generatedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  rows: [],
});
const resolutionPack = readJsonIfExists(resolutionPackPath, {
  packId: 'forms_fallback_manual_resolutions',
  generatedAt: generatedDate,
  rows: [],
});

const changedFiles = new Set();
const decisions = [];
const summary = {
  inputRows: selectedRows.length,
  resolvedRows: 0,
  deferredRows: 0,
  filesChanged: 0,
  skippedByReason: {},
  byDecisionMode: {},
};

function note(reason) {
  summary.skippedByReason[reason] = (summary.skippedByReason[reason] || 0) + 1;
}

function noteMode(mode) {
  summary.byDecisionMode[mode] = (summary.byDecisionMode[mode] || 0) + 1;
}

for (const row of selectedRows) {
  const rowKey = hasText(row?.rowKey) ? String(row.rowKey).trim() : '';
  const stateId = hasText(row?.stateId) ? String(row.stateId).trim().toLowerCase() : '';
  const sourceUrl = normalizeUrl(row?.sourceUrl);
  const decisionMode = hasText(row?.decisionMode) ? String(row.decisionMode).trim() : '';
  const reviewedBy = hasText(row?.reviewedBy) ? String(row.reviewedBy).trim() : '';
  const reviewedSourceUrl = normalizeUrl(row?.reviewedSourceUrl);
  const reviewedSourceName = hasText(row?.reviewedSourceName) ? String(row.reviewedSourceName).trim() : '';
  const reviewNotes = hasText(row?.reviewNotes) ? String(row.reviewNotes).trim() : '';
  const queueRow = queueByKey.get(rowKey);

  if (!rowKey || !stateId || !sourceUrl) {
    note('missing_identity_fields');
    continue;
  }
  if (!queueRow) {
    note('row_not_in_live_manual_review_queue');
    decisions.push({ stateId, rowKey, status: 'skipped_row_not_in_live_manual_review_queue', resolvedSourceUrl: '' });
    continue;
  }
  if (!reviewedBy) {
    note('missing_reviewed_by');
    decisions.push({ stateId, rowKey, status: 'skipped_missing_reviewed_by', resolvedSourceUrl: '' });
    continue;
  }
  if (!['validate_existing_candidate', 'replace_with_reviewed_candidate', 'needs_manual_research', 'skip_unresolved'].includes(decisionMode)) {
    note('invalid_decision_mode');
    decisions.push({ stateId, rowKey, status: 'skipped_invalid_decision_mode', resolvedSourceUrl: '' });
    continue;
  }

  noteMode(decisionMode);

  let resolvedSourceUrl = '';
  let resolvedSourceName = '';
  let ledgerStatus = '';
  let resolutionStatus = '';

  if (decisionMode === 'validate_existing_candidate') {
    resolvedSourceUrl = sourceUrl;
    resolvedSourceName = hasText(row?.sourceName) ? String(row.sourceName).trim() : (queueRow.sourceName || '');
    ledgerStatus = 'resolved_validated_existing_candidate';
    resolutionStatus = args.apply ? 'applied' : 'dry_run_ready';
    summary.resolvedRows += 1;
  } else if (decisionMode === 'replace_with_reviewed_candidate') {
    if (!reviewedSourceUrl || !reviewedSourceName) {
      note('missing_reviewed_replacement_fields');
      decisions.push({ stateId, rowKey, status: 'skipped_missing_reviewed_replacement_fields', resolvedSourceUrl: reviewedSourceUrl });
      continue;
    }
    resolvedSourceUrl = reviewedSourceUrl;
    resolvedSourceName = reviewedSourceName;
    ledgerStatus = 'resolved_replaced_with_reviewed_candidate';
    resolutionStatus = args.apply ? 'applied' : 'dry_run_ready';
    summary.resolvedRows += 1;
  } else if (decisionMode === 'needs_manual_research') {
    ledgerStatus = 'deferred_manual_research';
    resolutionStatus = args.apply ? 'applied_deferred' : 'dry_run_deferred';
    summary.deferredRows += 1;
  } else {
    ledgerStatus = 'skipped_unresolved';
    resolutionStatus = args.apply ? 'applied_skipped' : 'dry_run_skipped';
    summary.deferredRows += 1;
  }

  const ledgerEntry = {
    rowKey,
    stateId,
    sourceUrl,
    candidateType: queueRow.candidateType || row.candidateType || '',
    blockedFormsSourceUrl: queueRow.blockedFormsSourceUrl || '',
    blockedFormsSourceName: queueRow.blockedFormsSourceName || '',
    decisionMode,
    status: ledgerStatus,
    resolvedSourceName,
    resolvedSourceUrl,
    resolvedDomain: domainFromUrl(resolvedSourceUrl),
    reviewNotes,
    reviewedBy,
    reviewedAt: new Date().toISOString(),
  };

  const packRow = {
    rowKey,
    stateId,
    candidateType: queueRow.candidateType || row.candidateType || '',
    sourceName: resolvedSourceName || queueRow.sourceName || row.sourceName || '',
    sourceUrl: resolvedSourceUrl,
    domain: domainFromUrl(resolvedSourceUrl),
    blockedFormsSourceName: queueRow.blockedFormsSourceName || '',
    blockedFormsSourceUrl: queueRow.blockedFormsSourceUrl || '',
    resolutionMode: decisionMode,
    reviewNotes,
    reviewedBy,
    reviewedAt: ledgerEntry.reviewedAt,
  };

  if (args.apply) {
    const ledgerIndex = resolutionLedger.rows.findIndex((item) => item.rowKey === rowKey);
    if (ledgerIndex >= 0) resolutionLedger.rows[ledgerIndex] = ledgerEntry;
    else resolutionLedger.rows.push(ledgerEntry);
    resolutionLedger.updatedAt = new Date().toISOString();

    const packIndex = resolutionPack.rows.findIndex((item) => item.rowKey === rowKey);
    if (decisionMode === 'validate_existing_candidate' || decisionMode === 'replace_with_reviewed_candidate') {
      if (packIndex >= 0) resolutionPack.rows[packIndex] = packRow;
      else resolutionPack.rows.push(packRow);
    } else if (packIndex >= 0) {
      resolutionPack.rows.splice(packIndex, 1);
    }
  }

  decisions.push({
    stateId,
    rowKey,
    status: resolutionStatus,
    resolvedSourceUrl,
  });
}

if (args.apply) {
  resolutionPack.generatedAt = generatedDate;
  writeJson(resolutionLedgerPath, resolutionLedger);
  writeJson(resolutionPackPath, resolutionPack);
  changedFiles.add(resolutionLedgerPath);
  changedFiles.add(resolutionPackPath);
}

summary.filesChanged = changedFiles.size;

const report = {
  generatedAt: new Date().toISOString(),
  mode: args.apply ? 'apply' : 'dry-run',
  stateFilter: args.state,
  inputPath: args.input,
  summary,
  decisions,
  resolutionArtifacts: {
    queuePath,
    resolutionLedgerPath: path.relative(repoRoot, resolutionLedgerPath),
    resolutionPackPath: path.relative(repoRoot, resolutionPackPath),
  },
};

const jsonOutPath = path.join(docsDir, `forms-fallback-manual-review-run-${runTimestamp}.json`);
const mdOutPath = path.join(docsDir, `forms-fallback-manual-review-run-${runTimestamp}.md`);
writeJson(jsonOutPath, report);
fs.writeFileSync(mdOutPath, toMarkdown(report));

console.log(JSON.stringify({
  generatedAt: report.generatedAt,
  mode: report.mode,
  stateFilter: report.stateFilter,
  summary: report.summary,
  artifacts: {
    json: jsonOutPath,
    md: mdOutPath,
    resolutionLedger: resolutionLedgerPath,
    resolutionPack: resolutionPackPath,
  },
}, null, 2));
