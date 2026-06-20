import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const queuePath = path.join(docsDir, `forms-fallback-manual-review-queue-${generatedDate}.json`);
const jsonOutPath = path.join(docsDir, `forms-fallback-manual-review-decision-template-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const queue = readJson(queuePath);

const payload = {
  generatedAt: generatedDate,
  sourceQueue: path.relative(repoRoot, queuePath),
  instructions: {
    allowedDecisionModes: [
      'validate_existing_candidate',
      'replace_with_reviewed_candidate',
      'needs_manual_research',
      'skip_unresolved',
    ],
    requiredTopLevelFields: [
      'rowKey',
      'stateId',
      'sourceUrl',
      'decisionMode',
      'reviewedBy',
    ],
    validateExistingCandidateFields: [],
    replaceWithReviewedCandidateFields: [
      'reviewedSourceUrl',
      'reviewedSourceName',
    ],
    optionalFields: [
      'reviewNotes',
      'reviewedSourceName',
      'reviewedSourceUrl',
    ],
    rules: [
      'Resolve only rows already present in the manual review queue.',
      'Do not broaden beyond the selected queued record.',
      'Use validate_existing_candidate only when the original candidate URL was manually confirmed as the truthful official fallback source.',
      'Use replace_with_reviewed_candidate only when a better official state-specific fallback source was found and reviewed.',
      'Use needs_manual_research when the row still lacks a safe resolution inside the bounded review pass.',
      'Keep reviewedBy populated for every non-empty decision row.',
    ],
  },
  rows: (queue.rows || []).map((row) => ({
    rowKey: row.rowKey,
    stateId: row.stateId,
    candidateType: row.candidateType,
    sourceName: row.sourceName,
    sourceUrl: row.sourceUrl,
    blockedFormsSourceName: row.blockedFormsSourceName,
    blockedFormsSourceUrl: row.blockedFormsSourceUrl,
    failureReason: row.failureReason,
    urlsTried: row.urlsTried ?? null,
    urlBudget: row.urlBudget ?? null,
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
