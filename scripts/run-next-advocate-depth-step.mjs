import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const queuePath = path.join(docsDir, `advocate-depth-queue-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing advocate depth queue: ${queuePath}. Run npm run audit:advocate-depth-queue first.`);
}

const queue = readJson(queuePath);
const rows = Array.isArray(queue.rows) ? queue.rows : [];

const lanePriority = {
  california_truth_recovery: 1,
  repeated_source_repair: 2,
};

const nextRow = [...rows].sort((a, b) =>
  (lanePriority[a.lane] || 99) - (lanePriority[b.lane] || 99)
  || Number(b.priority || 0) - Number(a.priority || 0)
  || String(a.subjectId || '').localeCompare(String(b.subjectId || ''))
)[0] || null;

if (!nextRow) {
  console.log(JSON.stringify({
    mode: 'advocate_depth_idle',
    queuePath,
    blockerStatus: queue.summary?.blockerStatus || 'unknown',
    nextAction: 'Advocate depth queue is empty.',
    selectedRow: null,
    commands: [],
  }, null, 2));
  process.exit(0);
}

const fallbackCommandsByLane = {
  california_truth_recovery: [
    'npm run audit:california-advocate-recovery-decision-template',
    'npm run audit:california-advocate-recovery',
  ],
  repeated_source_repair: [
    'npm run audit:advocate-source-repair-queue',
    'npm run run:next-advocate-source-repair-step',
  ],
};

const commands = Array.isArray(nextRow.commands) && nextRow.commands.length
  ? nextRow.commands
  : fallbackCommandsByLane[nextRow.lane] || [];

console.log(JSON.stringify({
  mode: 'advocate_depth_next_step',
  queuePath,
  blockerStatus: queue.summary?.blockerStatus || 'unknown',
  selectedRow: {
    lane: nextRow.lane,
    subjectType: nextRow.subjectType,
    subjectId: nextRow.subjectId,
    stateId: nextRow.stateId,
    reason: nextRow.reason,
    sourceUrl: nextRow.sourceUrl || null,
    nextAction: nextRow.nextAction,
    entryCommand: nextRow.entryCommand || null,
    auditCommand: nextRow.auditCommand || null,
  },
  commands,
}, null, 2));
