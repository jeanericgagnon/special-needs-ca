import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { blockerNote } from './provider-manual-review-lib.mjs';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const dbPath = process.env.ABLEFULL_DB_PATH
  ? path.resolve(process.env.ABLEFULL_DB_PATH)
  : path.join(repoRoot, 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const stateDir = path.join(dataDir, 'source-acquisition-state');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const defaultQueuePath = path.join(docsDir, `provider-manual-review-queue-${generatedDate}.json`);
const defaultInputPath = path.join(dataDir, 'provider-manual-review-decisions.json');
const ledgerPath = path.join(stateDir, 'provider-manual-review-ledger.json');
const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');

function parseArgs(argv) {
  const args = {
    apply: false,
    input: defaultInputPath,
    explicitInput: false,
    state: null,
  };

  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--input=')) {
      args.input = path.resolve(arg.slice('--input='.length).trim());
      args.explicitInput = true;
    }
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

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function toMarkdown(report) {
  const lines = [
    '# Provider Manual Review Decision Run',
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
    `- applied rows: ${report.summary.appliedRows}`,
    `- files changed: ${report.summary.filesChanged}`,
    '',
    '## Applied By Blocker',
    '',
    ...Object.entries(report.summary.appliedByBlocker).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## Skipped By Reason',
    '',
    ...Object.entries(report.summary.skippedByReason).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## Decisions',
    '',
  ];

  for (const item of report.decisions) {
    lines.push(`- ${item.rowId} | ${item.stateId} | ${item.status} | ${item.reviewStatus} | ${item.blockerKey}`);
  }

  return `${lines.join('\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(defaultQueuePath)) {
  throw new Error(`Missing provider manual review queue: ${defaultQueuePath}. Run npm run audit:provider-manual-review-queue first.`);
}

const queuePayload = readJson(defaultQueuePath);
const queueRows = Array.isArray(queuePayload.rows) ? queuePayload.rows : [];
const queueByRowId = new Map(queueRows.map((row) => [Number(row.rowId), row]));

let rowsSourcePath = args.input;
let selectedRows;
if (args.explicitInput && fs.existsSync(args.input)) {
  const raw = readJson(args.input);
  const rows = Array.isArray(raw) ? raw : raw.rows;
  if (!Array.isArray(rows)) throw new Error(`Expected rows array in ${args.input}`);
  selectedRows = rows;
} else {
  rowsSourcePath = defaultQueuePath;
  selectedRows = queueRows;
}

selectedRows = selectedRows.filter((row) => !args.state || String(row.stateId || '').trim().toLowerCase() === args.state);

const db = new Database(dbPath);
const selectRow = db.prepare(`
  SELECT id, state_id, review_status, extraction_notes
  FROM staging_scraped_resource_providers
  WHERE id = ?
`);
const updateRow = db.prepare(`
  UPDATE staging_scraped_resource_providers
  SET review_status = ?,
      extraction_notes = ?,
      evidence_level = COALESCE(NULLIF(evidence_level, ''), 'deterministic_manual_review_blocker')
  WHERE id = ?
`);

const resolutionLedger = fs.existsSync(ledgerPath)
  ? readJson(ledgerPath)
  : { generatedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), rows: [] };
const ledgerRows = Array.isArray(resolutionLedger.rows) ? resolutionLedger.rows : [];
const changedFiles = new Set();
const decisions = [];
const summary = {
  inputRows: selectedRows.length,
  appliedRows: 0,
  filesChanged: 0,
  appliedByBlocker: {},
  skippedByReason: {},
};

function noteSkip(reason) {
  summary.skippedByReason[reason] = (summary.skippedByReason[reason] || 0) + 1;
}

function appendNote(existing, note) {
  const current = String(existing || '').trim();
  if (!current) return note;
  if (current.includes(note)) return current;
  return `${current}\n${note}`;
}

const dateStamp = new Date().toISOString().slice(0, 10);

for (const row of selectedRows) {
  const rowId = Number(row?.rowId);
  const queueRow = queueByRowId.get(rowId);
  if (!Number.isInteger(rowId)) {
    noteSkip('missing_row_id');
    continue;
  }
  if (!queueRow) {
    noteSkip('row_not_in_live_manual_review_queue');
    decisions.push({ rowId, stateId: row?.stateId || '', status: 'skipped_row_not_in_live_manual_review_queue', reviewStatus: row?.reviewStatus || '', blockerKey: row?.blockerKey || '' });
    continue;
  }

  const liveRow = selectRow.get(rowId);
  if (!liveRow) {
    noteSkip('row_missing_from_db');
    decisions.push({ rowId, stateId: queueRow.stateId, status: 'skipped_row_missing_from_db', reviewStatus: queueRow.reviewStatus, blockerKey: queueRow.blockerKey });
    continue;
  }
  if (liveRow.review_status !== 'needs_manual_review') {
    noteSkip('row_not_pending_manual_review');
    decisions.push({ rowId, stateId: queueRow.stateId, status: 'skipped_row_not_pending_manual_review', reviewStatus: queueRow.reviewStatus, blockerKey: queueRow.blockerKey });
    continue;
  }

  const normalizedRow = {
    ...queueRow,
    rowId,
    stateId: queueRow.stateId,
    decisionMode: 'apply_blocker',
    reviewedBy: row.reviewedBy || 'codex',
    reviewedAt: new Date().toISOString(),
  };

  if (args.apply) {
    const nextNotes = appendNote(liveRow.extraction_notes, blockerNote(normalizedRow, dateStamp));
    updateRow.run(queueRow.reviewStatus, nextNotes, rowId);
    const ledgerEntry = {
      ...normalizedRow,
      status: 'applied',
    };
    const existingIndex = ledgerRows.findIndex((item) => Number(item.rowId) === rowId);
    if (existingIndex >= 0) ledgerRows[existingIndex] = ledgerEntry;
    else ledgerRows.push(ledgerEntry);
    summary.appliedRows += 1;
    summary.appliedByBlocker[queueRow.blockerKey] = (summary.appliedByBlocker[queueRow.blockerKey] || 0) + 1;
  }

  decisions.push({
    rowId,
    stateId: queueRow.stateId,
    status: args.apply ? 'applied' : 'dry_run_ready',
    reviewStatus: queueRow.reviewStatus,
    blockerKey: queueRow.blockerKey,
  });
}

if (args.apply) {
  resolutionLedger.updatedAt = new Date().toISOString();
  resolutionLedger.rows = ledgerRows;
  writeJson(ledgerPath, resolutionLedger);
  writeJson(defaultInputPath, {
    generatedAt: generatedDate,
    sourceQueuePath: path.relative(repoRoot, defaultQueuePath),
    rows: selectedRows.map((row) => ({
      ...queueByRowId.get(Number(row.rowId)),
      decisionMode: 'apply_blocker',
      reviewedBy: row.reviewedBy || 'codex',
    })).filter(Boolean),
  });
  changedFiles.add(ledgerPath);
  changedFiles.add(defaultInputPath);
}

summary.filesChanged = changedFiles.size;
summary.appliedByReviewStatus = countBy(decisions.filter((row) => row.status === 'applied'), 'reviewStatus');

const report = {
  generatedAt: new Date().toISOString(),
  mode: args.apply ? 'apply' : 'dry-run',
  stateFilter: args.state,
  inputPath: path.relative(repoRoot, rowsSourcePath),
  dbPath: path.relative(repoRoot, dbPath),
  summary,
  decisions,
};

const reportJsonPath = path.join(docsDir, `provider-manual-review-decision-run-${runTimestamp}.json`);
const reportMdPath = path.join(docsDir, `provider-manual-review-decision-run-${runTimestamp}.md`);
writeJson(reportJsonPath, report);
fs.writeFileSync(reportMdPath, toMarkdown(report));

db.close();

console.log(JSON.stringify({
  generatedAt: report.generatedAt,
  mode: report.mode,
  reportJsonPath,
  reportMdPath,
  appliedRows: summary.appliedRows,
  appliedByBlocker: summary.appliedByBlocker,
  skippedByReason: summary.skippedByReason,
}, null, 2));
