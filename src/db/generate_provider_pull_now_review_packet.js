import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-pull-now-review-packet-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-pull-now-review-packet-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

const queuePath = path.join(docsDir, `provider-pull-now-manual-fill-queue-${generatedDate}.json`);
const progressPath = path.join(docsDir, `provider-pull-now-decision-progress-${generatedDate}.json`);

const queue = readJson(queuePath);
const progress = readJson(progressPath);
const rows = Array.isArray(queue.rows) ? queue.rows : [];

const statePackets = Object.entries(rows.reduce((acc, row) => {
  const key = row.stateId || 'unknown';
  if (!acc[key]) acc[key] = [];
  acc[key].push(row);
  return acc;
}, {}))
  .map(([stateId, stateRows]) => ({
    stateId,
    unresolvedRows: stateRows.length,
    byActionClass: countBy(stateRows, 'actionClass'),
    byDecisionHint: countBy(stateRows, 'decisionHint'),
    rows: stateRows.slice().sort((a, b) =>
      b.repeatCount - a.repeatCount
      || a.actionClass.localeCompare(b.actionClass)
      || a.sourceUrl.localeCompare(b.sourceUrl)
    ),
    topConcreteTargets: stateRows[0]?.topConcreteTargets || [],
  }))
  .sort((a, b) => b.unresolvedRows - a.unresolvedRows || a.stateId.localeCompare(b.stateId));

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    manualFillQueuePath: path.relative(repoRoot, queuePath),
    decisionProgressPath: path.relative(repoRoot, progressPath),
  },
  summary: {
    unresolvedRows: progress.summary?.unresolvedRows ?? rows.length,
    filledRows: progress.summary?.filledRows ?? 0,
    completionPercent: progress.summary?.completionPercent ?? 0,
    statePacketCount: statePackets.length,
    firstState: statePackets[0]?.stateId || null,
  },
  statePackets,
};

const mdLines = [
  '# Provider Pull-Now Review Packet',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  '## Summary',
  '',
  `- unresolved rows: ${payload.summary.unresolvedRows}`,
  `- filled rows: ${payload.summary.filledRows}`,
  `- completion percent: ${payload.summary.completionPercent}`,
  `- state packet count: ${payload.summary.statePacketCount}`,
  `- first state: ${payload.summary.firstState || 'none'}`,
  '',
  '## State Order',
  '',
];

for (const packet of statePackets) {
  mdLines.push(`- ${packet.stateId}: rows=${packet.unresolvedRows}; hints=${Object.keys(packet.byDecisionHint).join(', ')}`);
}

mdLines.push('', '## First Rows', '');
for (const packet of statePackets.slice(0, 3)) {
  for (const row of packet.rows.slice(0, 3)) {
    mdLines.push(`- ${packet.stateId} | ${row.actionClass} | hint=${row.decisionHint} | repeats=${row.repeatCount} | ${row.sourceUrl}`);
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  statePacketCount: payload.summary.statePacketCount,
  unresolvedRows: payload.summary.unresolvedRows,
}, null, 2));
