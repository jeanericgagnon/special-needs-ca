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
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-placeholder-state-ledger-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-placeholder-state-ledger-${generatedDate}.md`);

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

const queuePayload = safeReadJson(path.join(docsDir, `provider-placeholder-replacement-queue-${generatedDate}.json`));
const decisionPayload = safeReadJson(path.join(dataDir, 'provider-placeholder-replacement-decisions.json'));

const queueRows = queuePayload?.rows || [];
const decisionRows = decisionPayload?.rows || [];
const states = [...new Set(queueRows.map((row) => row.stateId).filter(Boolean))].sort();

const rows = states.map((stateId) => {
  const stateQueueRows = queueRows.filter((row) => row.stateId === stateId);
  const stateDecision = decisionRows.find((row) => row.stateId === stateId) || null;
  const replacements = Array.isArray(stateDecision?.replacements) ? stateDecision.replacements : [];
  const reviewedBy = String(stateDecision?.reviewedBy || '').trim();

  let status = 'authoring_pending';
  if (!stateDecision) {
    status = 'missing_decision_row';
  } else if (reviewedBy && replacements.length >= 2 && replacements.length <= 5) {
    status = 'ready_to_apply';
  } else if (replacements.length > 0 || reviewedBy) {
    status = 'draft_in_progress';
  }

  return {
    stateId,
    status,
    queueRows: stateQueueRows.length,
    placeholderDomains: [...new Set(stateQueueRows.map((row) => row.domain).filter(Boolean))].sort(),
    placeholderUrls: [...new Set(stateQueueRows.map((row) => row.placeholderSourceUrl).filter(Boolean))].sort(),
    decisionRowPresent: Boolean(stateDecision),
    reviewedByPresent: Boolean(reviewedBy),
    replacementCount: replacements.length,
  };
});

const summary = {
  totalStates: rows.length,
  byStatus: summarizeCounts(rows, 'status'),
  nextState: rows.find((row) => row.status === 'draft_in_progress')?.stateId
    || rows.find((row) => row.status === 'authoring_pending')?.stateId
    || rows.find((row) => row.status === 'missing_decision_row')?.stateId
    || rows.find((row) => row.status === 'ready_to_apply')?.stateId
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
  '# Provider Placeholder State Ledger',
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
  '| state | status | queueRows | decisionRow | reviewedBy | replacements |',
  '| --- | --- | --- | --- | --- | --- |',
  ...rows.map((row) => `| ${row.stateId} | ${row.status} | ${row.queueRows} | ${row.decisionRowPresent ? 'yes' : 'no'} | ${row.reviewedByPresent ? 'yes' : 'no'} | ${row.replacementCount} |`),
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
