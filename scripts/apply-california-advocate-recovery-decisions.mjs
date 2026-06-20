import fs from 'fs';
import path from 'path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const stateDir = path.join(dataDir, 'source-acquisition-state');
const sourcePacksDir = path.join(dataDir, 'source_packs');
const generatedDate = new Date().toISOString().slice(0, 10);
const defaultInputPath = process.env.INPUT_PATH || path.join(docsDir, `california-advocate-recovery-decision-template-${generatedDate}.json`);
const queuePath = path.join(docsDir, `california-advocate-recovery-queue-${generatedDate}.json`);
const ledgerPath = path.join(stateDir, 'california-advocate-recovery-ledger.json');
const resolutionPackPath = path.join(sourcePacksDir, 'california_advocate_recovery_resolutions.json');
const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');

function parseArgs(argv) {
  const args = { apply: false, input: defaultInputPath };
  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--input=')) args.input = arg.slice('--input='.length).trim();
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return readJson(filePath);
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

function normalizeUrl(rawUrl) {
  if (!hasText(rawUrl)) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function toMarkdown(report) {
  const lines = [
    '# California Advocate Recovery Decision Run',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Mode: ${report.mode}`,
    '',
    '## Summary',
    '',
    `- input path: ${report.inputPath}`,
    `- decision rows: ${report.summary.inputRows}`,
    `- resolved counties: ${report.summary.resolvedCounties}`,
    `- deferred counties: ${report.summary.deferredCounties}`,
    `- files changed: ${report.summary.filesChanged}`,
    '',
    '## Skipped By Reason',
    '',
    ...Object.entries(report.summary.skippedByReason).sort((a, b) => b[1] - a[1]).map(([reason, count]) => `- ${reason}: ${count}`),
    '',
    '## Decisions',
    '',
    ...report.decisions.map((item) => `- ${item.countyId} | ${item.status} | ${item.reviewedSourceUrl || ''}`),
    '',
  ];
  return `${lines.join('\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));
if (!fs.existsSync(args.input)) {
  console.log(JSON.stringify({
    message: 'No California advocate recovery decision file found; nothing to apply.',
    expectedPath: args.input,
    resolvedCounties: 0,
  }, null, 2));
  process.exit(0);
}

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing California advocate recovery queue: ${queuePath}. Run npm run audit:california-advocate-recovery first.`);
}

const queue = readJson(queuePath);
const queueByCountyId = new Map((queue.counties || []).map((county) => [String(county.countyId || '').trim(), county]));
const raw = readJson(args.input);
const rows = Array.isArray(raw) ? raw : raw.rows;
if (!Array.isArray(rows)) throw new Error(`Expected rows array in ${args.input}`);

const ledger = readJsonIfExists(ledgerPath, { generatedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), rows: [] });
const resolutionPack = readJsonIfExists(resolutionPackPath, { packId: 'california_advocate_recovery_resolutions', generatedAt: generatedDate, rows: [] });
const changedFiles = new Set();
const decisions = [];
const summary = {
  inputRows: rows.length,
  resolvedCounties: 0,
  deferredCounties: 0,
  filesChanged: 0,
  skippedByReason: {},
};

function note(reason) {
  summary.skippedByReason[reason] = (summary.skippedByReason[reason] || 0) + 1;
}

for (const row of rows) {
  const countyId = hasText(row?.countyId) ? String(row.countyId).trim() : '';
  const decisionMode = hasText(row?.decisionMode) ? String(row.decisionMode).trim() : '';
  const reviewedBy = hasText(row?.reviewedBy) ? String(row.reviewedBy).trim() : '';
  const reviewedSourceUrl = normalizeUrl(row?.reviewedSourceUrl);
  const reviewedSourceName = hasText(row?.reviewedSourceName) ? String(row.reviewedSourceName).trim() : '';
  const reviewNotes = hasText(row?.reviewNotes) ? String(row.reviewNotes).trim() : '';
  const queueCounty = queueByCountyId.get(countyId);

  if (!countyId) {
    note('missing_county_id');
    continue;
  }
  if (!queueCounty) {
    note('county_not_in_live_recovery_queue');
    decisions.push({ countyId, status: 'skipped_county_not_in_live_recovery_queue', reviewedSourceUrl: '' });
    continue;
  }
  if (!reviewedBy) {
    note('missing_reviewed_by');
    decisions.push({ countyId, status: 'skipped_missing_reviewed_by', reviewedSourceUrl: '' });
    continue;
  }
  if (!['attach_reviewed_county_source', 'defer_county_until_real_source', 'skip_unresolved'].includes(decisionMode)) {
    note('invalid_decision_mode');
    decisions.push({ countyId, status: 'skipped_invalid_decision_mode', reviewedSourceUrl: '' });
    continue;
  }

  let status = '';
  if (decisionMode === 'attach_reviewed_county_source') {
    if (!reviewedSourceUrl || !reviewedSourceName) {
      note('missing_reviewed_source_fields');
      decisions.push({ countyId, status: 'skipped_missing_reviewed_source_fields', reviewedSourceUrl });
      continue;
    }
    status = 'reviewed_county_source_ready';
    summary.resolvedCounties += 1;
  } else if (decisionMode === 'defer_county_until_real_source') {
    status = 'deferred_county_until_real_source';
    summary.deferredCounties += 1;
  } else {
    status = 'skipped_unresolved';
    summary.deferredCounties += 1;
  }

  const ledgerEntry = {
    countyId,
    countyName: queueCounty.countyName,
    decisionMode,
    status,
    reviewedSourceName,
    reviewedSourceUrl,
    reviewNotes,
    reviewedBy,
    updatedAt: new Date().toISOString(),
  };
  const ledgerIndex = (ledger.rows || []).findIndex((item) => item.countyId === countyId);
  if (ledgerIndex >= 0) ledger.rows[ledgerIndex] = ledgerEntry;
  else ledger.rows.push(ledgerEntry);

  const packEntry = {
    countyId,
    countyName: queueCounty.countyName,
    decisionMode,
    status,
    reviewedSourceName,
    reviewedSourceUrl,
    reviewNotes,
    reviewedBy,
  };
  const packIndex = (resolutionPack.rows || []).findIndex((item) => item.countyId === countyId);
  if (packIndex >= 0) resolutionPack.rows[packIndex] = packEntry;
  else resolutionPack.rows.push(packEntry);

  decisions.push({
    countyId,
    status: args.apply ? `applied_${status}` : `dry_run_${status}`,
    reviewedSourceUrl,
  });
}

ledger.updatedAt = new Date().toISOString();
resolutionPack.generatedAt = generatedDate;

if (args.apply) {
  writeJson(ledgerPath, ledger);
  writeJson(resolutionPackPath, resolutionPack);
  changedFiles.add(ledgerPath);
  changedFiles.add(resolutionPackPath);
}

summary.filesChanged = changedFiles.size;
const report = {
  generatedAt: new Date().toISOString(),
  mode: args.apply ? 'apply' : 'dry-run',
  inputPath: args.input,
  summary,
  decisions,
  outputs: {
    ledgerPath,
    resolutionPackPath,
  },
};

const reportJsonPath = path.join(docsDir, `california-advocate-recovery-run-${runTimestamp}.json`);
const reportMdPath = path.join(docsDir, `california-advocate-recovery-run-${runTimestamp}.md`);
writeJson(reportJsonPath, report);
fs.writeFileSync(reportMdPath, toMarkdown(report));

console.log(JSON.stringify({
  generatedAt: report.generatedAt,
  mode: report.mode,
  report: {
    json: reportJsonPath,
    md: reportMdPath,
  },
  summary,
}, null, 2));
