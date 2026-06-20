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
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-pull-now-decision-progress-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-pull-now-decision-progress-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath, fallback) {
  return fs.existsSync(filePath) ? readJson(filePath) : fallback;
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
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

const decisionFilePath = path.join(dataDir, 'provider-pull-now-decisions.json');
const decisionTemplatePath = path.join(docsDir, `provider-pull-now-decision-template-${generatedDate}.json`);
const manualFillQueuePath = path.join(docsDir, `provider-pull-now-manual-fill-queue-${generatedDate}.json`);

const decisionFile = readJsonIfExists(decisionFilePath, { rows: [] });
const decisionTemplate = readJsonIfExists(decisionTemplatePath, { rows: [] });
const manualFillQueue = readJsonIfExists(manualFillQueuePath, { summary: { unresolvedRows: 0 } });

const rows = Array.isArray(decisionFile.rows) ? decisionFile.rows : [];
const templateKeys = new Set((decisionTemplate.rows || []).map((row) =>
  `${String(row.stateId || '').trim().toLowerCase()}__${normalizeUrl(row.sourceUrl)}`
));
const staleRows = rows.filter((row) => {
  const stateId = String(row?.stateId || '').trim().toLowerCase();
  const sourceUrl = normalizeUrl(row?.sourceUrl);
  return !stateId || !sourceUrl || !templateKeys.has(`${stateId}__${sourceUrl}`);
});
const filledRows = rows.filter((row) => hasText(row.decisionMode) && hasText(row.reviewedBy));
const unresolvedRows = rows.filter((row) => !hasText(row.decisionMode));

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    decisionFilePath: path.relative(repoRoot, decisionFilePath),
    decisionTemplatePath: path.relative(repoRoot, decisionTemplatePath),
    manualFillQueuePath: path.relative(repoRoot, manualFillQueuePath),
  },
  summary: {
    totalRows: rows.length,
    filledRows: filledRows.length,
    unresolvedRows: unresolvedRows.length,
    staleRows: staleRows.length,
    completionPercent: rows.length ? Number(((filledRows.length / rows.length) * 100).toFixed(1)) : 0,
    byActionClass: countBy(unresolvedRows, 'actionClass'),
    byState: countBy(unresolvedRows, 'stateId'),
    byDecisionMode: countBy(filledRows, 'decisionMode'),
    templateRows: Array.isArray(decisionTemplate.rows) ? decisionTemplate.rows.length : 0,
    manualFillQueueRows: manualFillQueue.summary?.unresolvedRows ?? 0,
  },
  nextWork: unresolvedRows.slice(0, 10).map((row) => ({
    stateId: row.stateId,
    actionClass: row.actionClass,
    sourceUrl: row.sourceUrl,
    repeatCount: row.repeatCount,
  })),
};

const mdLines = [
  '# Provider Pull-Now Decision Progress',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  '## Summary',
  '',
  `- total rows: ${payload.summary.totalRows}`,
  `- filled rows: ${payload.summary.filledRows}`,
  `- unresolved rows: ${payload.summary.unresolvedRows}`,
  `- stale rows: ${payload.summary.staleRows}`,
  `- completion percent: ${payload.summary.completionPercent}`,
  `- template rows: ${payload.summary.templateRows}`,
  `- manual-fill queue rows: ${payload.summary.manualFillQueueRows}`,
  '',
  '## Unresolved By Action Class',
  '',
  ...Object.entries(payload.summary.byActionClass).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## Unresolved By State',
  '',
  ...Object.entries(payload.summary.byState).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## Next Work',
  '',
  ...payload.nextWork.map((row) => `- ${row.stateId} | ${row.actionClass} | repeats=${row.repeatCount} | ${row.sourceUrl}`),
];

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  unresolvedRows: payload.summary.unresolvedRows,
  completionPercent: payload.summary.completionPercent,
}, null, 2));
