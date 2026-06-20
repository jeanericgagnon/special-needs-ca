import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import {
  buildProviderManualReviewDecision,
  loadProviderGeocodeEvidenceMap,
} from '../../scripts/provider-manual-review-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const dbPath = process.env.ABLEFULL_DB_PATH
  ? path.resolve(process.env.ABLEFULL_DB_PATH)
  : path.join(repoRoot, 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourceAcquisitionRunsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-manual-review-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-manual-review-queue-${generatedDate}.md`);

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function toMarkdown(payload) {
  const lines = [
    '# Provider Manual Review Queue',
    '',
    `Generated: ${payload.generatedAt}`,
    '',
    '## Summary',
    '',
    `- total rows: ${payload.summary.totalRows}`,
    `- distinct states: ${payload.summary.distinctStates}`,
    `- rows with evidence artifacts: ${payload.summary.rowsWithEvidenceArtifacts}`,
    '',
    '## By Blocker',
    '',
    ...Object.entries(payload.summary.byBlockerKey).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## By Review Status',
    '',
    ...Object.entries(payload.summary.byReviewStatus).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## By Evidence Reason',
    '',
    ...Object.entries(payload.summary.byEvidenceReason).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## Rows',
    '',
  ];

  for (const row of payload.rows) {
    lines.push(`- ${row.rowId} | ${row.stateId} | ${row.blockerKey} | ${row.reviewStatus} | ${row.evidenceReason || 'none'} | ${row.sourceUrl}`);
  }

  return `${lines.join('\n')}\n`;
}

const db = new Database(dbPath, { readonly: true });
const rows = db.prepare(`
  SELECT
    id,
    state_id,
    county_id,
    source_url,
    extracted_name,
    extracted_address,
    extracted_phone,
    extracted_email,
    review_status,
    evidence_level,
    confidence_score
  FROM staging_scraped_resource_providers
  WHERE source_type = 'lightweight_source_acquisition'
    AND review_status = 'needs_manual_review'
  ORDER BY state_id, id
`).all();
db.close();

const evidenceByRowId = loadProviderGeocodeEvidenceMap(sourceAcquisitionRunsDir, repoRoot);
const queueRows = rows.map((row) => buildProviderManualReviewDecision(row, evidenceByRowId));
const distinctStates = new Set(queueRows.map((row) => row.stateId).filter(Boolean)).size;
const rowsWithEvidenceArtifacts = queueRows.filter((row) => row.evidenceArtifactPath).length;

const payload = {
  generatedAt: generatedDate,
  dbPath: path.relative(repoRoot, dbPath),
  sourceAcquisitionRunsDir: path.relative(repoRoot, sourceAcquisitionRunsDir),
  summary: {
    totalRows: queueRows.length,
    distinctStates,
    rowsWithEvidenceArtifacts,
    byBlockerKey: countBy(queueRows, 'blockerKey'),
    byReviewStatus: countBy(queueRows, 'reviewStatus'),
    byEvidenceReason: countBy(queueRows.map((row) => ({
      ...row,
      evidenceReason: row.evidenceReason || 'none',
    })), 'evidenceReason'),
    byStateId: countBy(queueRows, 'stateId'),
  },
  rows: queueRows,
};

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, toMarkdown(payload));

console.log(JSON.stringify({
  generatedAt: generatedDate,
  json: jsonOutPath,
  markdown: mdOutPath,
  totalRows: payload.summary.totalRows,
  byBlockerKey: payload.summary.byBlockerKey,
}, null, 2));
