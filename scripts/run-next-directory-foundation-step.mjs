import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const queuePath = path.join(docsDir, `directory-foundation-enrichment-queue-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing directory foundation enrichment queue: ${queuePath}. Run npm run audit:directory-foundation-enrichment-queue first.`);
}

const queue = readJson(queuePath);
const rows = Array.isArray(queue.rows) ? queue.rows : [];

const lanePriority = {
  provider_candidate_review: 1,
  provider_gap_cluster: 2,
  provider_source_pull: 3,
  nonprofit_candidate_review: 4,
  advocate_gap_summary: 5,
};

const nextRow = [...rows].sort((a, b) =>
  (lanePriority[a.lane] || 99) - (lanePriority[b.lane] || 99)
  || Number(b.priority || 0) - Number(a.priority || 0)
  || String(a.subjectId || '').localeCompare(String(b.subjectId || ''))
)[0] || null;

if (!nextRow) {
  console.log(JSON.stringify({
    mode: 'directory_foundation_idle',
    queuePath,
    blockerStatus: queue.summary?.blockerStatus || 'unknown',
    nextAction: 'Directory foundation enrichment queue is empty.',
    selectedRow: null,
    commands: [],
  }, null, 2));
  process.exit(0);
}

const fallbackCommandsByLane = {
  provider_candidate_review: [
    'npm run fix:provider-accessibility-review-queue',
    'npm run audit:provider-accessibility-review-decision-template',
    'npm run fix:provider-accessibility-apply-review-decisions',
    'npm run fix:provider-accessibility-promote-reviewed',
    'npm run audit:directory-foundation-enrichment-queue',
  ],
  provider_gap_cluster: [
    'npm run audit:provider-accessibility-enrichment-plan',
    'npm run audit:provider-accessibility-source-pull-prep',
    'npm run audit:directory-foundation-enrichment-queue',
  ],
  provider_source_pull: [
    'npm run audit:provider-accessibility-enrichment-plan',
    'npm run audit:provider-accessibility-source-pull-prep',
    'npm run audit:directory-foundation-enrichment-queue',
  ],
  nonprofit_candidate_review: [
    'npm run audit:directory-accessibility-candidates',
    'npm run run:nonprofit-accessibility-lightweight-batch -- --mode=dry-run --limit=1',
    'npm run audit:directory-foundation-enrichment-queue',
  ],
  advocate_gap_summary: [
    'npm run audit:directory-accessibility',
    'npm run audit:directory-foundation-enrichment-queue',
  ],
};

const commands = Array.isArray(nextRow.commands) && nextRow.commands.length
  ? nextRow.commands
  : fallbackCommandsByLane[nextRow.lane] || [];

console.log(JSON.stringify({
  mode: 'directory_foundation_next_step',
  queuePath,
  blockerStatus: queue.summary?.blockerStatus || 'unknown',
  selectedRow: {
    lane: nextRow.lane,
    targetTable: nextRow.targetTable,
    subjectId: nextRow.subjectId,
    stateId: nextRow.stateId || null,
    sourceUrl: nextRow.sourceUrl || null,
    nextAction: nextRow.nextAction,
    entryCommand: nextRow.entryCommand || null,
    auditCommand: nextRow.auditCommand || null,
  },
  commands,
}, null, 2));
