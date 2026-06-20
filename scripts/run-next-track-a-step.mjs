import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const backlogPath = path.join(docsDir, `track-a-burndown-backlog-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!fs.existsSync(backlogPath)) {
  throw new Error(`Missing Track A burndown backlog: ${backlogPath}. Run npm run audit:track-a-burndown-backlog first.`);
}

const backlog = readJson(backlogPath);
const rows = Array.isArray(backlog.backlog) ? backlog.backlog : [];
const nextRow = [...rows].sort((a, b) =>
  Number(a.executionPriority || 99) - Number(b.executionPriority || 99)
  || Number(Boolean(b.helperActionable)) - Number(Boolean(a.helperActionable))
  || Number(b.queueCount || 0) - Number(a.queueCount || 0)
  || String(a.blockerId || '').localeCompare(String(b.blockerId || ''))
)[0] || null;

if (!nextRow) {
  console.log(JSON.stringify({
    mode: 'track_a_idle',
    backlogPath,
    selectedBlocker: null,
    commands: [],
  }, null, 2));
  process.exit(0);
}

const fallbackCommandByBlocker = {
  knowledge_content_depth: 'npm run run:next-knowledge-content-step',
  advocate_directory_depth: 'npm run run:next-advocate-depth-step',
  directory_foundation_signals: 'npm run run:next-directory-foundation-step',
  normalization_depth: 'npm run run:next-normalization-step',
  provider_directory: 'npm run run:next-provider-depth-step',
};

const commands = Array.isArray(nextRow.commands) && nextRow.commands.length
  ? [...nextRow.commands, 'npm run audit:track-a-burndown-backlog']
  : [
      nextRow.entryCommand || fallbackCommandByBlocker[nextRow.blockerId] || '',
      nextRow.auditCommand || 'npm run audit:track-a-burndown-backlog',
      'npm run audit:track-a-burndown-backlog',
    ].filter((command, index, all) => Boolean(command) && all.indexOf(command) === index);

console.log(JSON.stringify({
  mode: 'track_a_next_step',
  backlogPath,
  selectedBlocker: {
    blockerId: nextRow.blockerId,
    queueArtifact: nextRow.queueArtifact,
    queueCount: nextRow.queueCount,
    critical: nextRow.critical,
    nextAction: nextRow.nextAction,
    successCondition: nextRow.successCondition || null,
    executionPriority: nextRow.executionPriority,
    entryCommand: nextRow.entryCommand || null,
    auditCommand: nextRow.auditCommand || null,
    helperMode: nextRow.helperMode || null,
    helperActionable: nextRow.helperActionable ?? null,
  },
  commands,
}, null, 2));
