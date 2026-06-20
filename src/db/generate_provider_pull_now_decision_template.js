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
const jsonOutPath = path.join(docsDir, `provider-pull-now-decision-template-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated artifact for prefix: ${prefix}`);
  }
  return path.join(docsDir, matches.at(-1));
}

const runbookPath = latestGeneratedJson('provider-pull-now-runbook-');
const repairQueuePath = latestGeneratedJson('provider-followup-repair-queue-');

const runbook = readJson(runbookPath);
const repairQueue = readJson(repairQueuePath);

const pullNowRows = (repairQueue.rows || []).filter((row) => row.readinessLane === 'pull-now');

const payload = {
  generatedAt: generatedDate,
  sourceRunbook: path.relative(repoRoot, runbookPath),
  sourceQueue: path.relative(repoRoot, repairQueuePath),
  instructions: {
    allowedDecisionModes: [
      'replace_with_reviewed_first_party_target',
      'bounded_retry_once',
      'needs_manual_research',
      'skip_unresolved',
    ],
    requiredTopLevelFields: [
      'stateId',
      'actionClass',
      'sourceUrl',
      'decisionMode',
      'reviewedBy',
    ],
    replaceFields: [
      'reviewedSourceName',
      'reviewedSourceUrl',
    ],
    retryFields: [
      'retryNotes',
    ],
    optionalFields: [
      'reviewNotes',
      'reviewedSourceName',
      'reviewedSourceUrl',
      'retryNotes',
    ],
    rules: [
      'Resolve only pull-now provider rows already present in the source queue.',
      'Do not broaden beyond the listed provider repair rows.',
      'Use replace_with_reviewed_first_party_target when you have a truthful first-party clinic, hospital, or program page to replace the blocked target.',
      'Use bounded_retry_once only for rows already classified as bounded_retry_then_replace.',
      'Use needs_manual_research when a safe replacement could not be confirmed within the bounded pass.',
      'Keep reviewedBy populated for every decision row.',
    ],
  },
  rows: pullNowRows.map((row) => ({
    stateId: row.stateId,
    actionClass: row.actionClass,
    bucket: row.bucket,
    followupReason: row.followupReason,
    sourceUrl: row.sourceUrl,
    hostname: row.hostname,
    repeatCount: row.repeatCount,
    recommendedAction: row.recommendedAction,
    decisionMode: '',
    reviewedSourceName: '',
    reviewedSourceUrl: '',
    retryNotes: '',
    reviewNotes: '',
    reviewedBy: '',
  })),
  summary: {
    pullNowRowCount: pullNowRows.length,
    firstActionClass: runbook.summary?.firstActionClass || null,
  },
};

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  template: jsonOutPath,
  rows: payload.rows.length,
  firstActionClass: payload.summary.firstActionClass,
}, null, 2));
