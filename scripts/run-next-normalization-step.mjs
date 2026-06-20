import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const queuePath = path.join(docsDir, `normalization-gap-queue-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing normalization gap queue: ${queuePath}. Run npm run audit:normalization-gap-queue first.`);
}

const queue = readJson(queuePath);
const rows = Array.isArray(queue.rows) ? queue.rows : [];

const lanePriority = {
  provider_service_location_gap: 1,
  org_type_semantics_review: 2,
};

const nextRow = [...rows].sort((a, b) =>
  (lanePriority[a.lane] || 99) - (lanePriority[b.lane] || 99)
  || Number(b.missingRows || 0) - Number(a.missingRows || 0)
  || String(a.subjectId || '').localeCompare(String(b.subjectId || ''))
)[0] || null;

if (!nextRow) {
  console.log(JSON.stringify({
    mode: 'normalization_idle',
    queuePath,
    blockerStatus: queue.summary?.blockerStatus || 'unknown',
    selectedRow: null,
    commands: [],
  }, null, 2));
  process.exit(0);
}

const fallbackCommands = (() => {
  if (nextRow.lane === 'provider_service_location_gap') {
    return [
      'npm run fix:normalize-provider-locations',
      'npm run audit:normalization-gap-queue',
    ];
  }
  if (nextRow.lane === 'org_type_semantics_review') {
    if (nextRow.organizationType === 'public_agency') {
      return [
        'npm run fix:normalize-public-offices',
        'npm run audit:normalization-gap-queue',
      ];
    }
    if (nextRow.organizationType === 'nonprofit') {
      return [
        'npm run fix:normalize-nonprofit-areas',
        'npm run audit:normalization-gap-queue',
      ];
    }
    if (nextRow.organizationType === 'advocacy_org') {
      return [
        'npm run fix:normalize-advocate-areas',
        'npm run audit:normalization-gap-queue',
      ];
    }
  }
  return [];
})();

const commands = Array.isArray(nextRow.commands) && nextRow.commands.length
  ? nextRow.commands
  : fallbackCommands;

console.log(JSON.stringify({
  mode: 'normalization_next_step',
  queuePath,
  blockerStatus: queue.summary?.blockerStatus || 'unknown',
  selectedRow: {
    lane: nextRow.lane,
    subjectType: nextRow.subjectType,
    subjectId: nextRow.subjectId,
    organizationType: nextRow.organizationType,
    currentRows: nextRow.currentRows,
    normalizedRows: nextRow.normalizedRows,
    missingRows: nextRow.missingRows,
    nextAction: nextRow.nextAction,
    entryCommand: nextRow.entryCommand || null,
    auditCommand: nextRow.auditCommand || null,
  },
  commands,
}, null, 2));
