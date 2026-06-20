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
const queuePath = path.join(docsDir, `advocate-source-repair-queue-${generatedDate}.json`);
const jsonOutPath = path.join(docsDir, `advocate-source-repair-decision-template-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing advocate source repair queue: ${queuePath}. Run npm run audit:advocate-source-repair-queue first.`);
}

const queue = readJson(queuePath);
const payload = {
  generatedAt: generatedDate,
  sourceQueue: path.relative(repoRoot, queuePath),
  entryCommand: 'npm run audit:advocate-source-repair-decision-template',
  applyCommand: 'npm run fix:advocate-source-repair-decisions -- --apply',
  auditCommand: 'npm run audit:advocate-source-repair-queue',
  commands: [
    'npm run audit:advocate-source-repair-decision-template',
    'npm run fix:advocate-source-repair-decisions -- --apply',
    'npm run audit:advocate-source-repair-queue',
  ],
  instructions: {
    allowedDecisionModes: [
      'replace_with_reviewed_first_party_target',
      'bounded_retry_once',
      'defer_blocked_source',
      'skip_unresolved',
    ],
    requiredTopLevelFields: [
      'repairKey',
      'sourceUrl',
      'decisionMode',
      'reviewedBy',
    ],
    replaceFields: ['reviewedSourceName', 'reviewedSourceUrl'],
    optionalFields: ['reviewNotes', 'reviewedSourceName', 'reviewedSourceUrl'],
  },
  rows: (queue.rows || []).map((row) => ({
    repairKey: row.repairKey,
    sourceUrl: row.sourceUrl,
    hostname: row.hostname,
    followupReason: row.followupReason,
    repeatCount: row.repeatCount,
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
