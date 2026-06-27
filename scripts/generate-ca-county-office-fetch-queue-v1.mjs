import fs from 'node:fs';
import path from 'node:path';

function readNdjson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

function writeNdjson(filePath, rows) {
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function summarize(rows, key) {
  return rows.reduce((acc, row) => {
    const bucket = String(row[key] || 'unknown');
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
}

const repoRoot = process.cwd();
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsDir = path.join(repoRoot, 'docs', 'generated');

const reviewedTargets = readNdjson(path.join(generatedDir, 'ca_county_office_reviewed_targets_v1.jsonl'));
const unresolvedTargets = readNdjson(path.join(generatedDir, 'ca_county_office_unresolved_leaf_gaps_v1.jsonl'));

const fetchNowRows = [];
const reviewFirstRows = [];

for (const row of reviewedTargets) {
  const queueRow = {
    jobId: `ca_fetch_${row.countyId}_${fetchNowRows.length + reviewFirstRows.length + 1}`,
    state: row.state,
    countyId: row.countyId,
    targetFamily: row.targetFamily,
    targetTable: row.targetTable,
    desiredProgramId: row.desiredProgramId,
    currentRecordId: row.currentRecordId,
    candidateUrl: row.candidateUrl,
    likelyAgency: row.likelyAgency,
    linkText: row.linkText,
    reviewedStatus: row.reviewedStatus,
    fetchMode: 'http_fetch',
    batchClass: 'html',
    timeoutMs: 20000,
    maxBytes: 3145728,
    retryCount: 1,
    acceptanceRule: row.acceptanceRule,
    source: row.source,
  };

  if (row.reviewedStatus === 'high_confidence_leaf_candidate') {
    fetchNowRows.push({
      ...queueRow,
      executionLane: 'fetch_now',
      rationale: 'high-confidence exact county office leaf candidate',
    });
  } else {
    reviewFirstRows.push({
      ...queueRow,
      executionLane: 'review_first',
      rationale: 'medium-confidence leaf candidate should be reviewed before fetch',
    });
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  fetchNowCount: fetchNowRows.length,
  reviewFirstCount: reviewFirstRows.length,
  unresolvedCount: unresolvedTargets.length,
  fetchNowByCounty: summarize(fetchNowRows, 'countyId'),
  reviewFirstByCounty: summarize(reviewFirstRows, 'countyId'),
  unresolvedCounties: unresolvedTargets.map((row) => row.countyId),
};

const fetchNowPath = path.join(generatedDir, 'ca_county_office_fetch_now_queue_v1.jsonl');
const reviewFirstPath = path.join(generatedDir, 'ca_county_office_review_first_queue_v1.jsonl');
const summaryPath = path.join(generatedDir, 'ca_county_office_fetch_queue_summary_v1.json');
const mdPath = path.join(docsDir, 'ca-county-office-fetch-queue-v1.md');

writeNdjson(fetchNowPath, fetchNowRows);
writeNdjson(reviewFirstPath, reviewFirstRows);
writeJson(summaryPath, summary);
fs.writeFileSync(
  mdPath,
  [
    '# California County Office Fetch Queue v1',
    '',
    `- Fetch-now rows: \`${summary.fetchNowCount}\``,
    `- Review-first rows: \`${summary.reviewFirstCount}\``,
    `- Unresolved counties: \`${summary.unresolvedCounties.join(', ') || 'none'}\``,
    '',
    '## Fetch Now By County',
    ...Object.entries(summary.fetchNowByCounty).map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## Review First By County',
    ...Object.entries(summary.reviewFirstByCounty).map(([label, count]) => `- ${label}: ${count}`),
    '',
  ].join('\n') + '\n',
);

console.log(JSON.stringify({ fetchNowPath, reviewFirstPath, summaryPath, mdPath, summary }, null, 2));
