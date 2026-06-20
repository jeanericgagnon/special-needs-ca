import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const runsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `launch-scraper-artifact-contract-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-artifact-contract-${generatedDate}.md`);

function latestRunDir() {
  const entries = fs.existsSync(runsDir)
    ? fs.readdirSync(runsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
    : [];
  if (!entries.length) {
    throw new Error('No source-acquisition runs found.');
  }
  return path.join(runsDir, entries.at(-1));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listFilesRecursive(root, base = root) {
  if (!fs.existsSync(root)) return [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursive(fullPath, base));
      continue;
    }
    files.push(path.relative(base, fullPath));
  }
  return files.sort();
}

const sampleRunDir = latestRunDir();
const sampleRunId = path.basename(sampleRunDir);
const manifestPath = path.join(sampleRunDir, 'manifest.json');
const summaryPath = path.join(sampleRunDir, 'summary.json');
const followupSummaryPath = path.join(sampleRunDir, 'followups', 'followup-summary.json');
const parsedIndexPath = path.join(sampleRunDir, 'parsed', 'index-summary.json');
const validatedIndexPath = path.join(sampleRunDir, 'validated', 'index-summary.json');
const stagedIndexPath = path.join(sampleRunDir, 'staged', 'index-summary.json');

const manifest = fs.existsSync(manifestPath) ? readJson(manifestPath) : {};
const summary = fs.existsSync(summaryPath) ? readJson(summaryPath) : {};
const followupSummary = fs.existsSync(followupSummaryPath) ? readJson(followupSummaryPath) : {};
const parsedIndex = fs.existsSync(parsedIndexPath) ? readJson(parsedIndexPath) : {};
const validatedIndex = fs.existsSync(validatedIndexPath) ? readJson(validatedIndexPath) : {};
const stagedIndex = fs.existsSync(stagedIndexPath) ? readJson(stagedIndexPath) : {};

const contract = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sampleRunId,
  sampleRunDir: path.relative(repoRoot, sampleRunDir),
  purpose: 'Machine-readable contract for source-acquisition run artifacts, required files, manifest/summary fields, and resume-safe downstream behavior.',
  runDirectoryLayout: {
    requiredTopLevel: [
      'manifest.json',
      'summary.json',
      'results.csv',
      'report.md',
      'pages/',
    ],
    optionalDownstreamRoots: [
      'followups/',
      'parsed/',
      'validated/',
      'staged/',
    ],
    sampleFiles: listFilesRecursive(sampleRunDir),
  },
  fetchStage: {
    requiredFiles: [
      'manifest.json',
      'summary.json',
      'results.csv',
      'report.md',
      'pages/',
    ],
    manifestRequiredFields: [
      'generatedAt',
      'runId',
      'mode',
      'filters',
      'runtime',
      'selectionGuards',
      'selectedCount',
      'rows',
      'results',
    ],
    manifestRowFields: [
      'stateId',
      'targetTable',
      'gapFamily',
      'sourceQueue',
      'sourceUrl',
      'finalUrl',
      'status',
      'ok',
      'contentType',
      'savedPath',
      'attempt',
      'error',
      'errorCode',
      'errorDetail',
    ],
    summaryRequiredFields: [
      'generatedAt',
      'runId',
      'mode',
      'selectedCount',
      'succeeded',
      'failed',
      'concurrency',
      'rateLimitMs',
      'summaryPath',
      'manifestPath',
      'resultsCsvPath',
      'reportPath',
      'pagesDir',
    ],
    sampleManifestFields: Object.keys(manifest),
    sampleSummaryFields: Object.keys(summary),
  },
  followupStage: {
    requiredFiles: [
      'followups/parse-ready.json',
      'followups/parse-ready.csv',
      'followups/parse-ready-high-signal.json',
      'followups/parse-ready-high-signal.csv',
      'followups/parse-ready-suspect.json',
      'followups/parse-ready-suspect.csv',
      'followups/retryable-failures.json',
      'followups/retryable-failures.csv',
      'followups/blocked-failures.json',
      'followups/blocked-failures.csv',
      'followups/source-repair.json',
      'followups/source-repair.csv',
      'followups/followup-summary.json',
      'followups/followup-summary.md',
    ],
    summaryRequiredFields: [
      'runId',
      'selectedCount',
      'resultCount',
      'parseReadyCount',
      'parseReadyHighSignalCount',
      'parseReadySuspectCount',
      'retryableCount',
      'blockedCount',
      'sourceRepairCount',
      'artifacts',
    ],
    sampleSummaryFields: Object.keys(followupSummary),
  },
  parsedStage: {
    requiredPerFamilyFiles: [
      'records.ndjson',
      'summary.json',
      'summary.md',
      'schema-errors.json',
      'samples.json',
    ],
    requiredIndexFile: 'parsed/index-summary.json',
    indexRequiredFields: [
      'runId',
      'bucket',
      'family',
      'familyCount',
      'families',
    ],
    familySummaryRequiredFields: [
      'runId',
      'family',
      'bucket',
      'inputPath',
      'selectedCount',
      'parsedCount',
      'schemaErrorCount',
      'parseStatuses',
      'topHostnames',
      'samplesPath',
      'recordsPath',
    ],
    sampleIndexFields: Object.keys(parsedIndex),
  },
  validatedStage: {
    requiredPerFamilyFiles: [
      'accepted.ndjson',
      'rejected.ndjson',
      'rejection-reasons.json',
      'summary.json',
      'summary.md',
    ],
    requiredIndexFile: 'validated/index-summary.json',
    indexRequiredFields: [
      'runId',
      'family',
      'familyCount',
      'families',
    ],
    familySummaryRequiredFields: [
      'runId',
      'family',
      'parsedCount',
      'acceptedCount',
      'rejectedCount',
      'acceptanceRate',
      'rejectionReasons',
    ],
    sampleIndexFields: Object.keys(validatedIndex),
  },
  stagedStage: {
    requiredPerFamilyFiles: [
      'promotion-candidates.ndjson',
      'unsupported-candidates.ndjson',
      'promotion-summary.json',
      'promotion-summary.md',
    ],
    requiredIndexFiles: [
      'staged/index-summary.json',
      'staged/index-summary.md',
    ],
    indexRequiredFields: [
      'runId',
      'mode',
      'familyFilter',
      'familyCount',
      'dbPath',
      'dbStats',
      'families',
    ],
    familySummaryRequiredFields: [
      'runId',
      'family',
      'mode',
      'acceptedInputCount',
      'supportedCount',
      'unsupportedCount',
      'supportedByTable',
      'unsupportedReasons',
    ],
    sampleIndexFields: Object.keys(stagedIndex),
  },
  resumeSafetyContract: {
    guarantees: [
      'Every stage writes its artifacts inside a single runId directory.',
      'Downstream stages discover the latest runId by disk or accept an explicit --run-id.',
      'Parse waits for followup-selected inputs to exist before proceeding.',
      'Validate waits for parsed root or family records to exist before proceeding.',
      'Stage waits for validated root or accepted records to exist before proceeding.',
      'Dry-run staging still writes summary artifacts even when accepted input is empty.',
    ],
    operatorRules: [
      'Never overwrite another run directory; a new fetch wave must create a new runId.',
      'A run is safe to stop after fetch because manifest/results/pages remain on disk.',
      'A run is safe to stop after followups because parse-ready and failure buckets remain on disk.',
      'A downstream rerun should use --run-id when operator intent is to continue a specific run.',
      'Family-specific reruns are safe because parsed, validated, and staged outputs are namespaced by family.',
    ],
    knownLimitations: [
      'There is no single fetch resume command that appends into an existing runId; resume means continue downstream from saved artifacts or start a new fetch run.',
      'Program waitlists require conservative program_id inference during staging apply, so unmatched rows stay unstaged instead of being guessed.',
    ],
  },
};

const mdLines = [
  '# Launch Scraper Artifact Contract',
  '',
  `Generated: ${contract.generatedAt}`,
  '',
  contract.purpose,
  '',
  '## Sample Run',
  '',
  `- runId: \`${contract.sampleRunId}\``,
  `- runDir: \`${contract.sampleRunDir}\``,
  '',
  '## Run Directory Layout',
  '',
  '- required top-level:',
  ...contract.runDirectoryLayout.requiredTopLevel.map((item) => `  - ${item}`),
  '- optional downstream roots:',
  ...contract.runDirectoryLayout.optionalDownstreamRoots.map((item) => `  - ${item}`),
  '',
  '## Fetch Stage',
  '',
  `- manifest required fields: ${contract.fetchStage.manifestRequiredFields.join(', ')}`,
  `- manifest row fields: ${contract.fetchStage.manifestRowFields.join(', ')}`,
  `- summary required fields: ${contract.fetchStage.summaryRequiredFields.join(', ')}`,
  '',
  '## Followup Stage',
  '',
  `- required files: ${contract.followupStage.requiredFiles.join(', ')}`,
  `- summary required fields: ${contract.followupStage.summaryRequiredFields.join(', ')}`,
  '',
  '## Parsed Stage',
  '',
  `- required per-family files: ${contract.parsedStage.requiredPerFamilyFiles.join(', ')}`,
  `- required index file: ${contract.parsedStage.requiredIndexFile}`,
  '',
  '## Validated Stage',
  '',
  `- required per-family files: ${contract.validatedStage.requiredPerFamilyFiles.join(', ')}`,
  `- required index file: ${contract.validatedStage.requiredIndexFile}`,
  '',
  '## Staged Stage',
  '',
  `- required per-family files: ${contract.stagedStage.requiredPerFamilyFiles.join(', ')}`,
  `- required index files: ${contract.stagedStage.requiredIndexFiles.join(', ')}`,
  '',
  '## Resume Safety Contract',
  '',
  '- guarantees:',
  ...contract.resumeSafetyContract.guarantees.map((item) => `  - ${item}`),
  '- operator rules:',
  ...contract.resumeSafetyContract.operatorRules.map((item) => `  - ${item}`),
  '- known limitations:',
  ...contract.resumeSafetyContract.knownLimitations.map((item) => `  - ${item}`),
  '',
];

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(contract, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: contract.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  sampleRunId,
}, null, 2));
