import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const queuePath = path.join(docsDir, `advocate-source-repair-queue-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing advocate source repair queue: ${queuePath}. Run npm run audit:advocate-source-repair-queue first.`);
}

const queue = readJson(queuePath);
const rows = Array.isArray(queue.rows) ? queue.rows : [];
const nextRow = [...rows].sort((a, b) =>
  Number(b.repeatCount || 0) - Number(a.repeatCount || 0)
  || String(a.followupReason || '').localeCompare(String(b.followupReason || ''))
  || String(a.sourceUrl || '').localeCompare(String(b.sourceUrl || ''))
)[0] || null;

if (!nextRow) {
  console.log(JSON.stringify({
    mode: 'advocate_source_repair_idle',
    queuePath,
    selectedRow: null,
    commands: [],
  }, null, 2));
  process.exit(0);
}

console.log(JSON.stringify({
  mode: 'advocate_source_repair_next_step',
  queuePath,
  selectedRow: {
    repairKey: nextRow.repairKey,
    sourceUrl: nextRow.sourceUrl,
    hostname: nextRow.hostname,
    followupReason: nextRow.followupReason,
    repeatCount: nextRow.repeatCount,
    recommendedDecisionMode: nextRow.recommendedDecisionMode,
    entryCommand: nextRow.entryCommand || null,
    auditCommand: nextRow.auditCommand || null,
  },
  commands: Array.isArray(nextRow.commands) && nextRow.commands.length
    ? nextRow.commands
    : [
        'npm run audit:advocate-source-repair-decision-template',
        'npm run fix:advocate-source-repair-decisions',
        'npm run audit:advocate-source-repair-queue',
      ],
}, null, 2));
