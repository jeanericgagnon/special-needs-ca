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
const queuePath = path.join(docsDir, `california-advocate-recovery-queue-${generatedDate}.json`);
const jsonOutPath = path.join(docsDir, `california-advocate-recovery-decision-template-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing California advocate recovery queue: ${queuePath}. Run npm run audit:california-advocate-recovery first.`);
}

const queue = readJson(queuePath);
const payload = {
  generatedAt: generatedDate,
  sourceQueue: path.relative(repoRoot, queuePath),
  entryCommand: 'npm run audit:california-advocate-recovery-decision-template',
  applyCommand: 'npm run fix:california-advocate-recovery-decisions -- --apply',
  auditCommand: 'npm run audit:california-advocate-recovery',
  commands: [
    'npm run audit:california-advocate-recovery-decision-template',
    'npm run fix:california-advocate-recovery-decisions -- --apply',
    'npm run audit:california-advocate-recovery',
  ],
  instructions: {
    allowedDecisionModes: [
      'attach_reviewed_county_source',
      'defer_county_until_real_source',
      'skip_unresolved',
    ],
    requiredTopLevelFields: [
      'countyId',
      'decisionMode',
      'reviewedBy',
    ],
    attachFields: [
      'reviewedSourceName',
      'reviewedSourceUrl',
    ],
    optionalFields: [
      'reviewedSourceName',
      'reviewedSourceUrl',
      'reviewNotes',
    ],
  },
  rows: (queue.counties || []).map((county) => ({
    countyId: county.countyId,
    countyName: county.countyName,
    priorityTier: county.priorityTier,
    totalRows: county.totalRows,
    syntheticPatternRows: county.syntheticPatternRows,
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
