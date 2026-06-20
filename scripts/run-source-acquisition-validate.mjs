import fs from 'node:fs';
import path from 'node:path';
import {
  countBy,
  ensureDir,
  getLatestRunId,
  outputRoot,
  parseArgs,
  validateFamilyRecord,
  writeJson,
  writeNdjson,
} from './source-acquisition-lightweight-lib.mjs';

const WAIT_TIMEOUT_MS = 5000;
const WAIT_POLL_MS = 50;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function listFamilyDirs(parsedRoot, familyArg) {
  if (!fs.existsSync(parsedRoot)) return [];
  return fs.readdirSync(parsedRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((family) => familyArg === 'all' || family === familyArg);
}

async function waitForParsedRoot(parsedRoot) {
  const deadline = Date.now() + WAIT_TIMEOUT_MS;
  while (!fs.existsSync(parsedRoot) && Date.now() < deadline) {
    await sleep(WAIT_POLL_MS);
  }
  return fs.existsSync(parsedRoot);
}

async function waitForFamilyDirs(parsedRoot, familyArg) {
  const deadline = Date.now() + WAIT_TIMEOUT_MS;
  let familyDirs = listFamilyDirs(parsedRoot, familyArg);
  while (!familyDirs.length && familyArg !== 'all' && Date.now() < deadline) {
    await sleep(WAIT_POLL_MS);
    familyDirs = listFamilyDirs(parsedRoot, familyArg);
  }
  return familyDirs;
}

async function waitForFile(filePath) {
  const deadline = Date.now() + WAIT_TIMEOUT_MS;
  while (!fs.existsSync(filePath) && Date.now() < deadline) {
    await sleep(WAIT_POLL_MS);
  }
  return fs.existsSync(filePath);
}

const args = parseArgs(process.argv.slice(2));
const runId = args.runId || getLatestRunId();

if (!runId) {
  throw new Error('No source acquisition run found.');
}

const runDir = path.join(outputRoot, runId);
const parsedRoot = path.join(runDir, 'parsed');
const validatedRoot = path.join(runDir, 'validated');
ensureDir(validatedRoot);

if (!(await waitForParsedRoot(parsedRoot))) {
  throw new Error(`Missing parsed directory: ${parsedRoot}`);
}

const familyDirs = await waitForFamilyDirs(parsedRoot, args.family);

const summaries = [];

for (const family of familyDirs) {
  const familyDir = path.join(parsedRoot, family);
  const recordsPath = path.join(familyDir, 'records.ndjson');
  if (!fs.existsSync(recordsPath) && !(await waitForFile(recordsPath))) continue;

  const records = fs.readFileSync(recordsPath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  const accepted = [];
  const rejected = [];

  for (const record of records) {
    const result = validateFamilyRecord(record);
    const decorated = {
      ...record,
      validationStatus: result.isAccepted ? 'accepted' : 'rejected',
      validationReasons: result.reasons,
    };
    if (result.isAccepted) accepted.push(decorated);
    else rejected.push(decorated);
  }

  const familyOutDir = path.join(validatedRoot, family);
  ensureDir(familyOutDir);
  const rejectionReasons = countBy(rejected.flatMap((row) => row.validationReasons).map((reason) => ({ reason })), (row) => row.reason);
  const summary = {
    runId,
    family,
    parsedCount: records.length,
    acceptedCount: accepted.length,
    rejectedCount: rejected.length,
    acceptanceRate: records.length ? Number(((accepted.length / records.length) * 100).toFixed(1)) : 0,
    rejectionReasons,
  };

  writeNdjson(path.join(familyOutDir, 'accepted.ndjson'), accepted);
  writeNdjson(path.join(familyOutDir, 'rejected.ndjson'), rejected);
  writeJson(path.join(familyOutDir, 'rejection-reasons.json'), rejectionReasons);
  writeJson(path.join(familyOutDir, 'summary.json'), summary);
  fs.writeFileSync(
    path.join(familyOutDir, 'summary.md'),
    [
      `# Validation Summary: ${family}`,
      '',
      `- Run ID: \`${runId}\``,
      `- Parsed: \`${summary.parsedCount}\``,
      `- Accepted: \`${summary.acceptedCount}\``,
      `- Rejected: \`${summary.rejectedCount}\``,
      `- Acceptance Rate: \`${summary.acceptanceRate}%\``,
      '',
      '## Rejection Reasons',
      '',
      ...(summary.rejectionReasons.length
        ? summary.rejectionReasons.map((item) => `- ${item.label}: ${item.count}`)
        : ['_None_']),
      '',
    ].join('\n'),
  );

  summaries.push(summary);
}

const indexSummary = {
  runId,
  family: args.family,
  familyCount: summaries.length,
  families: summaries,
};

writeJson(path.join(validatedRoot, 'index-summary.json'), indexSummary);
console.log(JSON.stringify(indexSummary, null, 2));
