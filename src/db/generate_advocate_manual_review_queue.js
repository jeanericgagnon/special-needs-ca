import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { buildAdvocateManualReviewDecision } from '../../scripts/advocate-manual-review-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const dbPath = process.env.ABLEFULL_DB_PATH
  ? path.resolve(process.env.ABLEFULL_DB_PATH)
  : path.join(repoRoot, 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const runsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `advocate-manual-review-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `advocate-manual-review-queue-${generatedDate}.md`);

function parseArgs(argv) {
  const args = { runId: '' };
  for (const arg of argv) {
    if (arg.startsWith('--run-id=')) args.runId = arg.slice('--run-id='.length).trim();
  }
  return args;
}

function readNdjson(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function toMarkdown(payload) {
  const lines = [
    '# Advocate Manual Review Queue',
    '',
    `Generated: ${payload.generatedAt}`,
    '',
    `Run: ${payload.runId}`,
    '',
    '## Summary',
    '',
    `- total rows: ${payload.summary.totalRows}`,
    `- distinct states: ${payload.summary.distinctStates}`,
    '',
    '## By Blocker',
    '',
    ...Object.entries(payload.summary.byBlockerKey).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## By Review Status',
    '',
    ...Object.entries(payload.summary.byReviewStatus).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## Rows',
    '',
  ];

  for (const row of payload.rows) {
    lines.push(`- ${row.rowId} | ${row.stateId} | ${row.blockerKey} | ${row.reviewStatus} | ${row.sourceUrl}`);
  }

  return `${lines.join('\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));
if (!args.runId) throw new Error('Missing --run-id for advocate manual review queue generation.');

const candidatesPath = path.join(runsDir, args.runId, 'staged', 'advocates-legal', 'promotion-candidates.ndjson');
if (!fs.existsSync(candidatesPath)) {
  throw new Error(`Missing advocate promotion candidates: ${candidatesPath}`);
}

const candidateRows = readNdjson(candidatesPath)
  .map((entry) => entry?.candidate?.row)
  .filter(Boolean);

const db = new Database(dbPath, { readonly: true });
const selectRow = db.prepare(`
  SELECT
    id,
    source_url,
    state_id,
    county_id,
    confidence_score,
    extracted_name,
    extracted_phone,
    extracted_email,
    extracted_website,
    review_status
  FROM staging_scraped_iep_advocates
  WHERE source_type = 'lightweight_source_acquisition'
    AND source_url = ?
    AND state_id = ?
    AND extracted_name = ?
  ORDER BY id DESC
  LIMIT 1
`);

const liveRows = [];
for (const row of candidateRows) {
  const liveRow = selectRow.get(row.source_url, row.state_id, row.extracted_name);
  if (!liveRow) continue;
  if (!['pending_review', 'needs_manual_review'].includes(String(liveRow.review_status || '').trim())) continue;
  liveRows.push(liveRow);
}
db.close();

const queueRows = liveRows.map((row) => buildAdvocateManualReviewDecision(row));
const distinctStates = new Set(queueRows.map((row) => row.stateId).filter(Boolean)).size;
const payload = {
  generatedAt: generatedDate,
  runId: args.runId,
  dbPath: path.relative(repoRoot, dbPath),
  sourceCandidatesPath: path.relative(repoRoot, candidatesPath),
  summary: {
    totalRows: queueRows.length,
    distinctStates,
    byBlockerKey: countBy(queueRows, 'blockerKey'),
    byReviewStatus: countBy(queueRows, 'reviewStatus'),
    byStateId: countBy(queueRows, 'stateId'),
  },
  rows: queueRows,
};

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, toMarkdown(payload));

console.log(JSON.stringify({
  generatedAt: generatedDate,
  runId: args.runId,
  json: jsonOutPath,
  markdown: mdOutPath,
  totalRows: payload.summary.totalRows,
  byBlockerKey: payload.summary.byBlockerKey,
}, null, 2));
