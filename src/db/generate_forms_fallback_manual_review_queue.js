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
const sourceAcquisitionRunsDir = path.join(dataDir, 'source-acquisition-runs');
const sourceAcquisitionStateDir = path.join(dataDir, 'source-acquisition-state');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `forms-fallback-manual-review-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `forms-fallback-manual-review-queue-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return readJson(filePath);
}

function listRunFiles(fileName) {
  if (!fs.existsSync(sourceAcquisitionRunsDir)) return [];
  return fs.readdirSync(sourceAcquisitionRunsDir)
    .map((dirName) => path.join(sourceAcquisitionRunsDir, dirName, fileName))
    .filter((filePath) => fs.existsSync(filePath))
    .sort()
    .reverse();
}

function summarizeCounts(rows, key) {
  return rows.reduce((acc, row) => {
    const bucket = row?.[key] || 'unknown';
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
}

function buildManualReviewQueue({ completedLedgerRows, latestFallbackRows, allFallbackRows, queueRowsSource }) {
  const queueRowByKey = new Map(
    (queueRowsSource || []).map((row) => {
      const key = `${row.stateId || ''}|${row.candidateType || ''}|${row.sourceUrl || ''}`;
      return [key, row];
    }),
  );
  const latestResultByKey = new Map();
  for (const row of [...(latestFallbackRows || []), ...(allFallbackRows || [])]) {
    if (!row?.rowKey || latestResultByKey.has(row.rowKey)) continue;
    latestResultByKey.set(row.rowKey, row);
  }

  const rows = (completedLedgerRows || [])
    .filter((row) => row.status === 'complete' && row.outcome === 'needs_manual_review')
    .map((row) => {
      const queueRow = queueRowByKey.get(row.rowKey) || {};
      const latestRow = latestResultByKey.get(row.rowKey) || {};
      return {
        rowKey: row.rowKey,
        stateId: row.stateId,
        candidateType: row.candidateType,
        sourceUrl: row.sourceUrl,
        blockedFormsSourceUrl: queueRow.blockedFormsSourceUrl || '',
        blockedFormsSourceName: queueRow.blockedFormsSourceName || '',
        sourceName: queueRow.sourceName || '',
        domain: queueRow.domain || '',
        priority: queueRow.priority ?? null,
        recordCount: queueRow.recordCount ?? null,
        failureReason: latestRow.failureReason || row.failureReason || 'needs_manual_review',
        urlsTried: latestRow.urlsTried ?? null,
        urlBudget: latestRow.urlBudget ?? null,
        completedAt: row.completedAt,
        runId: row.runId,
      };
    })
    .sort((a, b) => {
      if (a.stateId !== b.stateId) return a.stateId.localeCompare(b.stateId);
      return a.sourceUrl.localeCompare(b.sourceUrl);
    });

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalRows: rows.length,
      byState: summarizeCounts(rows, 'stateId'),
      byCandidateType: summarizeCounts(rows, 'candidateType'),
      byFailureReason: summarizeCounts(rows, 'failureReason'),
    },
    rows,
  };
}

const queuePayload = safeReadJson(path.join(docsDir, `forms-fallback-scrape-queue-${generatedDate}.json`));
const completionLedgerPayload = safeReadJson(path.join(sourceAcquisitionStateDir, 'forms-fallback-completion-ledger.json'));
const resolutionLedgerPayload = safeReadJson(path.join(sourceAcquisitionStateDir, 'forms-fallback-manual-review-ledger.json'));
const allFallbackResults = listRunFiles('forms-fallback-results.json')
  .map((filePath) => safeReadJson(filePath))
  .filter(Boolean);
const latestFallbackResults = allFallbackResults[0] || { rows: [] };

const resolvedRowKeys = new Set(
  (resolutionLedgerPayload?.rows || [])
    .filter((row) => typeof row?.status === 'string' && /^(resolved_|deferred_|skipped_)/.test(row.status))
    .map((row) => row.rowKey)
    .filter(Boolean),
);

const payload = buildManualReviewQueue({
  completedLedgerRows: (completionLedgerPayload?.rows || [])
    .filter((row) => row.status === 'complete' && !resolvedRowKeys.has(row.rowKey)),
  latestFallbackRows: latestFallbackResults.rows || [],
  allFallbackRows: allFallbackResults.flatMap((item) => item.rows || []),
  queueRowsSource: queuePayload?.rows || [],
});

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);

const mdLines = [
  '# Forms Fallback Manual Review Queue',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  `- total rows: ${payload.summary.totalRows}`,
  '',
  '## By State',
  '',
  ...Object.entries(payload.summary.byState).sort((a, b) => a[0].localeCompare(b[0])).map(([stateId, count]) => `- ${stateId}: ${count}`),
  '',
  '## By Failure Reason',
  '',
  ...Object.entries(payload.summary.byFailureReason).sort((a, b) => b[1] - a[1]).map(([reason, count]) => `- ${reason}: ${count}`),
  '',
  '## Sample Rows',
  '',
  '| state | type | source | failure | urlsTried | runId |',
  '| --- | --- | --- | --- | --- | --- |',
  ...payload.rows.slice(0, 20).map((row) => `| ${row.stateId} | ${row.candidateType} | ${row.sourceUrl} | ${row.failureReason} | ${row.urlsTried ?? ''} | ${row.runId} |`),
];
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  summary: payload.summary,
  artifacts: {
    json: jsonOutPath,
    md: mdOutPath,
  },
}, null, 2));
