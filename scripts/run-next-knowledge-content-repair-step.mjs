import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const queuePath = path.join(docsDir, `knowledge-content-repair-queue-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing knowledge content repair queue: ${queuePath}. Run npm run audit:knowledge-content-repair-queue first.`);
}

const queue = readJson(queuePath);
const rows = Array.isArray(queue.rows) ? queue.rows : [];
const nextRow = [...rows].sort((a, b) =>
  Number(b.followupRunCount || 0) - Number(a.followupRunCount || 0)
  || String(a.sourceName || '').localeCompare(String(b.sourceName || ''))
)[0] || null;

if (!nextRow) {
  console.log(JSON.stringify({
    mode: 'knowledge_content_repair_idle',
    queuePath,
    selectedRow: null,
    commands: [],
  }, null, 2));
  process.exit(0);
}

console.log(JSON.stringify({
  mode: 'knowledge_content_repair_next_step',
  queuePath,
  selectedRow: {
    id: nextRow.id,
    sourceName: nextRow.sourceName,
    sourceUrl: nextRow.sourceUrl,
    repairClass: nextRow.repairClass,
    lastFollowupReason: nextRow.lastFollowupReason,
    followupRunCount: nextRow.followupRunCount,
    recommendedDecisionMode: nextRow.recommendedDecisionMode,
    entryCommand: nextRow.entryCommand || null,
    auditCommand: nextRow.auditCommand || null,
  },
  commands: Array.isArray(nextRow.commands) && nextRow.commands.length
    ? nextRow.commands
    : [
        'npm run audit:knowledge-content-repair-decision-template',
        'npm run fix:knowledge-content-repair-decisions',
        'npm run audit:knowledge-content-repair-queue',
      ],
}, null, 2));
