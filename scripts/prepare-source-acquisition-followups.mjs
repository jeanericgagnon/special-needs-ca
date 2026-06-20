import fs from 'node:fs';
import path from 'node:path';
import { classifyFailure, classifyParseReady } from './source-acquisition-followups-lib.mjs';

const repoRoot = process.cwd();
const outputRoot = path.join(repoRoot, 'data', 'source-acquisition-runs');

function parseArgs(argv) {
  const args = {
    runId: '',
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'run-id' && value) args.runId = value;
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function csvValue(value) {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function writeCsv(filePath, rows, columns) {
  const lines = [columns.join(',')];
  for (const row of rows) {
    lines.push(columns.map((column) => csvValue(row[column])).join(','));
  }
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`);
}

function getLatestRunId() {
  const entries = fs.readdirSync(outputRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();
  return entries[0] || '';
}

function summarize(rows, field) {
  const counts = {};
  for (const row of rows) {
    const key = row[field] || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
}

function withUrlMeta(row) {
  let hostname = '';
  try {
    hostname = new URL(row.finalUrl || row.sourceUrl).hostname;
  } catch {
    hostname = '';
  }
  return {
    ...row,
    hostname,
  };
}

const args = parseArgs(process.argv.slice(2));
const runId = args.runId || getLatestRunId();

if (!runId) {
  throw new Error('No source acquisition run found.');
}

const runDir = path.join(outputRoot, runId);
const manifestPath = path.join(runDir, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  throw new Error(`Missing manifest: ${manifestPath}`);
}

const manifest = readJson(manifestPath);
const followupDir = path.join(runDir, 'followups');
ensureDir(followupDir);

const parseReady = [];
const parseReadyHighSignal = [];
const parseReadySuspect = [];
const retryable = [];
const blocked = [];
const sourceRepair = [];

for (const result of manifest.results || []) {
  const enriched = withUrlMeta(result);
  if (result.ok && Number(result.status) >= 200 && Number(result.status) < 300 && result.savedPath) {
    const parseClassification = classifyParseReady(enriched);
    const parseRow = {
      ...enriched,
      followupBucket: parseClassification.bucket,
      followupReason: parseClassification.reason,
    };
    parseReady.push(parseRow);
    if (parseClassification.bucket === 'parse_ready_high_signal') {
      parseReadyHighSignal.push(parseRow);
    } else {
      parseReadySuspect.push(parseRow);
    }
    continue;
  }

  const classification = classifyFailure(result);
  const row = {
    ...enriched,
    followupBucket: classification.bucket,
    followupReason: classification.reason,
  };

  if (classification.bucket === 'retryable') retryable.push(row);
  if (classification.bucket === 'blocked') blocked.push(row);
  if (classification.bucket === 'source_repair') sourceRepair.push(row);
}

const columns = [
  'stateId',
  'targetTable',
  'gapFamily',
  'sourceQueue',
  'hostname',
  'sourceUrl',
  'finalUrl',
  'status',
  'ok',
  'contentType',
  'savedPath',
  'attempt',
  'followupBucket',
  'followupReason',
  'error',
];

const artifacts = {
  parseReadyJson: path.join(followupDir, 'parse-ready.json'),
  parseReadyCsv: path.join(followupDir, 'parse-ready.csv'),
  parseReadyHighSignalJson: path.join(followupDir, 'parse-ready-high-signal.json'),
  parseReadyHighSignalCsv: path.join(followupDir, 'parse-ready-high-signal.csv'),
  parseReadySuspectJson: path.join(followupDir, 'parse-ready-suspect.json'),
  parseReadySuspectCsv: path.join(followupDir, 'parse-ready-suspect.csv'),
  retryableJson: path.join(followupDir, 'retryable-failures.json'),
  retryableCsv: path.join(followupDir, 'retryable-failures.csv'),
  blockedJson: path.join(followupDir, 'blocked-failures.json'),
  blockedCsv: path.join(followupDir, 'blocked-failures.csv'),
  sourceRepairJson: path.join(followupDir, 'source-repair.json'),
  sourceRepairCsv: path.join(followupDir, 'source-repair.csv'),
  summaryJson: path.join(followupDir, 'followup-summary.json'),
  summaryMd: path.join(followupDir, 'followup-summary.md'),
};

fs.writeFileSync(artifacts.parseReadyJson, `${JSON.stringify(parseReady, null, 2)}\n`);
fs.writeFileSync(artifacts.parseReadyHighSignalJson, `${JSON.stringify(parseReadyHighSignal, null, 2)}\n`);
fs.writeFileSync(artifacts.parseReadySuspectJson, `${JSON.stringify(parseReadySuspect, null, 2)}\n`);
fs.writeFileSync(artifacts.retryableJson, `${JSON.stringify(retryable, null, 2)}\n`);
fs.writeFileSync(artifacts.blockedJson, `${JSON.stringify(blocked, null, 2)}\n`);
fs.writeFileSync(artifacts.sourceRepairJson, `${JSON.stringify(sourceRepair, null, 2)}\n`);

writeCsv(artifacts.parseReadyCsv, parseReady, columns);
writeCsv(artifacts.parseReadyHighSignalCsv, parseReadyHighSignal, columns);
writeCsv(artifacts.parseReadySuspectCsv, parseReadySuspect, columns);
writeCsv(artifacts.retryableCsv, retryable, columns);
writeCsv(artifacts.blockedCsv, blocked, columns);
writeCsv(artifacts.sourceRepairCsv, sourceRepair, columns);

const summary = {
  runId,
  selectedCount: manifest.selectedCount,
  resultCount: (manifest.results || []).length,
  parseReadyCount: parseReady.length,
  parseReadyHighSignalCount: parseReadyHighSignal.length,
  parseReadySuspectCount: parseReadySuspect.length,
  retryableCount: retryable.length,
  blockedCount: blocked.length,
  sourceRepairCount: sourceRepair.length,
  topParseReadyHighSignalDomains: summarize(parseReadyHighSignal, 'hostname').slice(0, 20),
  topParseReadySuspectDomains: summarize(parseReadySuspect, 'hostname').slice(0, 20),
  topParseReadyDomains: summarize(parseReady, 'hostname').slice(0, 20),
  topRetryableDomains: summarize(retryable, 'hostname').slice(0, 20),
  topBlockedDomains: summarize(blocked, 'hostname').slice(0, 20),
  topSourceRepairDomains: summarize(sourceRepair, 'hostname').slice(0, 20),
  topRetryReasons: summarize(retryable, 'followupReason').slice(0, 20),
  topBlockedReasons: summarize(blocked, 'followupReason').slice(0, 20),
  topSourceRepairReasons: summarize(sourceRepair, 'followupReason').slice(0, 20),
  artifacts,
};

fs.writeFileSync(artifacts.summaryJson, `${JSON.stringify(summary, null, 2)}\n`);

const md = [
  '# Source Acquisition Followup Summary',
  '',
  `- Run ID: \`${summary.runId}\``,
  `- Selected: \`${summary.selectedCount}\``,
  `- Results: \`${summary.resultCount}\``,
  `- Parse Ready: \`${summary.parseReadyCount}\``,
  `- Parse Ready High Signal: \`${summary.parseReadyHighSignalCount}\``,
  `- Parse Ready Suspect: \`${summary.parseReadySuspectCount}\``,
  `- Retryable Failures: \`${summary.retryableCount}\``,
  `- Blocked Failures: \`${summary.blockedCount}\``,
  `- Source Repair Needed: \`${summary.sourceRepairCount}\``,
  '',
  '## Retry Reasons',
  ...summary.topRetryReasons.map((item) => `- ${item.label}: ${item.count}`),
  '',
  '## Blocked Reasons',
  ...summary.topBlockedReasons.map((item) => `- ${item.label}: ${item.count}`),
  '',
  '## Source Repair Reasons',
  ...summary.topSourceRepairReasons.map((item) => `- ${item.label}: ${item.count}`),
  '',
  '## Parse-Ready Suspect Reasons',
  ...summarize(parseReadySuspect, 'followupReason').map((item) => `- ${item.label}: ${item.count}`),
  '',
  '## Top Parse-Ready High-Signal Domains',
  ...summary.topParseReadyHighSignalDomains.map((item) => `- ${item.label}: ${item.count}`),
  '',
  '## Top Parse-Ready Suspect Domains',
  ...summary.topParseReadySuspectDomains.map((item) => `- ${item.label}: ${item.count}`),
  '',
  '## Top Parse-Ready Domains',
  ...summary.topParseReadyDomains.map((item) => `- ${item.label}: ${item.count}`),
  '',
  '## Artifact Paths',
  `- Parse Ready JSON: \`${artifacts.parseReadyJson}\``,
  `- Parse Ready CSV: \`${artifacts.parseReadyCsv}\``,
  `- Parse Ready High Signal JSON: \`${artifacts.parseReadyHighSignalJson}\``,
  `- Parse Ready High Signal CSV: \`${artifacts.parseReadyHighSignalCsv}\``,
  `- Parse Ready Suspect JSON: \`${artifacts.parseReadySuspectJson}\``,
  `- Parse Ready Suspect CSV: \`${artifacts.parseReadySuspectCsv}\``,
  `- Retryable JSON: \`${artifacts.retryableJson}\``,
  `- Retryable CSV: \`${artifacts.retryableCsv}\``,
  `- Blocked JSON: \`${artifacts.blockedJson}\``,
  `- Blocked CSV: \`${artifacts.blockedCsv}\``,
  `- Source Repair JSON: \`${artifacts.sourceRepairJson}\``,
  `- Source Repair CSV: \`${artifacts.sourceRepairCsv}\``,
  `- Summary JSON: \`${artifacts.summaryJson}\``,
];

fs.writeFileSync(artifacts.summaryMd, `${md.join('\n')}\n`);

console.log(JSON.stringify(summary, null, 2));
