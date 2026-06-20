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
const queuePath = path.join(docsDir, `knowledge-content-repair-queue-${generatedDate}.json`);
const jsonOutPath = path.join(docsDir, `knowledge-content-repair-decision-template-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing knowledge content repair queue: ${queuePath}. Run npm run audit:knowledge-content-repair-queue first.`);
}

const queue = readJson(queuePath);
const payload = {
  generatedAt: generatedDate,
  sourceQueue: path.relative(repoRoot, queuePath),
  entryCommand: 'npm run audit:knowledge-content-repair-decision-template',
  applyCommand: 'npm run fix:knowledge-content-repair-decisions -- --apply',
  auditCommand: 'npm run audit:knowledge-content-repair-queue',
  commands: [
    'npm run audit:knowledge-content-repair-decision-template',
    'npm run fix:knowledge-content-repair-decisions -- --apply',
    'npm run audit:knowledge-content-repair-queue',
  ],
  instructions: {
    allowedDecisionModes: [
      'replace_with_reviewed_exact_target',
      'defer_blocked_source',
      'skip_unresolved',
    ],
    requiredTopLevelFields: [
      'id',
      'sourceUrl',
      'decisionMode',
      'reviewedBy',
    ],
    replaceFields: [
      'reviewedSourceName',
      'reviewedSourceUrl',
    ],
    optionalFields: [
      'reviewNotes',
      'reviewedSourceName',
      'reviewedSourceUrl',
    ],
    rules: [
      'Resolve only rows already present in the knowledge-content repair queue.',
      'Do not broaden beyond the listed blocked knowledge targets.',
      'Use replace_with_reviewed_exact_target only when a truthful reviewed exact replacement source exists.',
      'Use defer_blocked_source when the official source is blocked and no safe reviewed replacement has been confirmed.',
      'Keep reviewedBy populated for every non-empty decision row.',
    ],
  },
  rows: (queue.rows || []).map((row) => ({
    id: row.id,
    sourceName: row.sourceName,
    sourceUrl: row.sourceUrl,
    domain: row.domain,
    lastFollowupReason: row.lastFollowupReason,
    followupRunCount: row.followupRunCount,
    repairClass: row.repairClass,
    recommendedDecisionMode: row.recommendedDecisionMode,
    decisionMode: '',
    reviewedSourceName: '',
    reviewedSourceUrl: '',
    reviewNotes: '',
    reviewedBy: '',
  })),
};

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  template: jsonOutPath,
  rows: payload.rows.length,
}, null, 2));
