import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const sourceAcquisitionStateDir = path.join(dataDir, 'source-acquisition-state');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `forms-fallback-state-ledger-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `forms-fallback-state-ledger-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return readJson(filePath);
}

function summarizeCounts(rows, key) {
  return rows.reduce((acc, row) => {
    const bucket = row?.[key] || 'unknown';
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
}

const queuePayload = safeReadJson(path.join(docsDir, `forms-fallback-scrape-queue-${generatedDate}.json`));
const completionLedgerPayload = safeReadJson(path.join(sourceAcquisitionStateDir, 'forms-fallback-completion-ledger.json'));
const manualReviewPayload = safeReadJson(path.join(docsDir, `forms-fallback-manual-review-queue-${generatedDate}.json`));

const queueRows = queuePayload?.rows || [];
const completionRows = completionLedgerPayload?.rows || [];
const manualReviewRows = manualReviewPayload?.rows || [];

const states = [...new Set(queueRows.map((row) => row.stateId).filter(Boolean))].sort();
const rows = states.map((stateId) => {
  const stateQueueRows = queueRows.filter((row) => row.stateId === stateId);
  const rowKeys = new Set(
    stateQueueRows.map((row) => `${row.stateId || ''}|${row.candidateType || ''}|${row.sourceUrl || ''}`),
  );
  const stateCompletionRows = completionRows.filter((row) => row.stateId === stateId && rowKeys.has(row.rowKey));
  const previewedRows = stateCompletionRows.filter((row) => row.status === 'previewed');
  const completedRows = stateCompletionRows.filter((row) => row.status === 'complete');
  const stateManualReviewRows = manualReviewRows.filter((row) => row.stateId === stateId);

  let status = 'unstarted';
  let nextMode = 'dry-run';
  if (previewedRows.length > 0 && completedRows.length === 0) {
    status = 'preview_pending_live';
    nextMode = 'live';
  } else if (completedRows.length === stateQueueRows.length && stateManualReviewRows.length > 0) {
    status = 'completed_manual_review';
    nextMode = 'none';
  } else if (completedRows.length === stateQueueRows.length) {
    status = 'completed';
    nextMode = 'none';
  } else if (completedRows.length > 0 || previewedRows.length > 0) {
    status = 'mixed_progress';
    nextMode = previewedRows.length > 0 ? 'live' : 'dry-run';
  }

  return {
    stateId,
    status,
    nextMode,
    queueRows: stateQueueRows.length,
    previewedRows: previewedRows.length,
    completedRows: completedRows.length,
    manualReviewRows: stateManualReviewRows.length,
    candidateTypes: [...new Set(stateQueueRows.map((row) => row.candidateType).filter(Boolean))].sort(),
  };
});

const summary = {
  totalStates: rows.length,
  byStatus: summarizeCounts(rows, 'status'),
  nextState: rows.find((row) => row.status === 'preview_pending_live')?.stateId
    || rows.find((row) => row.status === 'unstarted')?.stateId
    || '',
};

const payload = {
  generatedAt: new Date().toISOString(),
  summary,
  rows,
};

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);

const mdLines = [
  '# Forms Fallback State Ledger',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  `- total states: ${summary.totalStates}`,
  `- next state: ${summary.nextState || 'none'}`,
  '',
  '## By Status',
  '',
  ...Object.entries(summary.byStatus).sort((a, b) => a[0].localeCompare(b[0])).map(([status, count]) => `- ${status}: ${count}`),
  '',
  '## State Rows',
  '',
  '| state | status | nextMode | queue | previewed | completed | manualReview |',
  '| --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map((row) => `| ${row.stateId} | ${row.status} | ${row.nextMode} | ${row.queueRows} | ${row.previewedRows} | ${row.completedRows} | ${row.manualReviewRows} |`),
];
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  summary,
  artifacts: {
    json: jsonOutPath,
    md: mdOutPath,
  },
}, null, 2));
