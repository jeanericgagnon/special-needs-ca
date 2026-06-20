import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const outputRoot = path.join(repoRoot, 'data', 'source-acquisition-runs');
const generatedDate = new Date().toISOString().slice(0, 10);

const universePath = path.join(docsDir, `scrape-target-universe-${generatedDate}.json`);
const jsonOutPath = path.join(docsDir, `scrape-target-universe-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `scrape-target-universe-queue-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function normalizeUrl(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return '';
  try {
    const parsed = new URL(value);
    parsed.hash = '';
    if (parsed.pathname !== '/') {
      parsed.pathname = parsed.pathname
        .replace(/\/index\.html?$/i, '')
        .replace(/\/+$/, '');
    }
    return parsed.toString();
  } catch {
    return value
      .replace(/\/index\.html?$/i, '')
      .replace(/\/+$/, '');
  }
}

function rowKey(row) {
  return [
    String(row.stateId || row.state_id || '').trim().toLowerCase(),
    String(row.family || row.gapFamily || '').trim(),
    String(row.targetTable || row.target_table || '').trim(),
    normalizeUrl(row.url || row.sourceUrl || row.source_url || ''),
  ].join('|');
}

function loadResolvedRunKeys() {
  const resolvedKeys = new Set();
  const summary = {
    accepted: 0,
    rejected: 0,
    sourceRepair: 0,
    terminalBlocked: 0,
  };
  const terminalBlockedReasons = new Set([
    'access_blocked_403',
    'needs_review_unknown',
  ]);
  const blockedCounts = new Map();

  if (!fs.existsSync(outputRoot)) {
    return { resolvedKeys, summary };
  }

  const runDirs = fs.readdirSync(outputRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const runId of runDirs) {
    const runDir = path.join(outputRoot, runId);

    const validatedDir = path.join(runDir, 'validated');
    if (fs.existsSync(validatedDir)) {
      const familyDirs = fs.readdirSync(validatedDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
      for (const family of familyDirs) {
        for (const [fileName, counter] of [['accepted.ndjson', 'accepted'], ['rejected.ndjson', 'rejected']]) {
          const filePath = path.join(validatedDir, family, fileName);
          if (!fs.existsSync(filePath)) continue;
          const lines = fs.readFileSync(filePath, 'utf8')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
          for (const line of lines) {
            const row = JSON.parse(line);
            resolvedKeys.add(rowKey(row));
            summary[counter] += 1;
          }
        }
      }
    }

    const sourceRepairPath = path.join(runDir, 'followups', 'source-repair.json');
    if (fs.existsSync(sourceRepairPath)) {
      const rows = readJson(sourceRepairPath);
      if (Array.isArray(rows)) {
        for (const row of rows) {
          resolvedKeys.add(rowKey(row));
          summary.sourceRepair += 1;
        }
      }
    }

    const blockedPath = path.join(runDir, 'followups', 'blocked-failures.json');
    if (fs.existsSync(blockedPath)) {
      const rows = readJson(blockedPath);
      if (Array.isArray(rows)) {
        for (const row of rows) {
          const reason = String(row.followupReason || '').trim();
          const key = rowKey(row);
          if (!key) continue;
          const groupedKey = `${reason}|${key}`;
          blockedCounts.set(groupedKey, (blockedCounts.get(groupedKey) || 0) + 1);
        }
      }
    }
  }

  for (const [groupedKey, count] of blockedCounts.entries()) {
    const separator = groupedKey.indexOf('|');
    const reason = groupedKey.slice(0, separator);
    const key = groupedKey.slice(separator + 1);
    if (terminalBlockedReasons.has(reason) || count >= 2) {
      resolvedKeys.add(key);
      summary.terminalBlocked += 1;
    }
  }

  return { resolvedKeys, summary };
}

if (!fs.existsSync(universePath)) {
  throw new Error(`Missing scrape target universe: ${universePath}. Run npm run audit:scrape-target-universe first.`);
}

const universe = readJson(universePath);
const resolved = loadResolvedRunKeys();
const allReadyRows = (universe.rows || [])
  .filter((row) => row.candidateClass === 'ready_target_scrape')
  .map((row) => ({
    stateId: row.stateId || '',
    targetTable: row.targetTable || '',
    gapFamily: row.family || '',
    sourceQueue: row.sourceQueue || 'scrape_target_universe',
    sourceName: row.sourceName || row.domain || '',
    sourceUrl: row.url,
    ledgerStatus: row.scrapeLane || 'ready_lightweight',
    executionLane: 'ready_target_scrape',
    familyPriority: Number(row.priority || 0),
    executionPriority: Number(row.priority || 0),
    crawlMethod: row.crawlMethod || '',
    sourceArtifact: Array.isArray(row.sourceArtifacts) ? row.sourceArtifacts.join(', ') : String(row.sourceArtifacts || ''),
    whyNeeded: row.whyIncluded || '',
    currentEvidence: row.currentEvidence || '',
  }));

const combinedReadyRows = allReadyRows
  .filter((row) => !resolved.resolvedKeys.has(rowKey({
    stateId: row.stateId,
    gapFamily: row.gapFamily,
    targetTable: row.targetTable,
    sourceUrl: row.sourceUrl,
  })))
  .sort((a, b) =>
    String(a.ledgerStatus).localeCompare(String(b.ledgerStatus))
    || String(a.gapFamily).localeCompare(String(b.gapFamily))
    || String(a.stateId).localeCompare(String(b.stateId))
    || String(a.sourceUrl).localeCompare(String(b.sourceUrl))
  );

const payload = {
  generatedAt: generatedDate,
  source: path.relative(repoRoot, universePath),
  summary: {
    universeReadyUniqueRows: allReadyRows.length,
    combinedReadyUniqueRows: combinedReadyRows.length,
    excludedResolvedRows: allReadyRows.length - combinedReadyRows.length,
    resolvedFromRuns: resolved.summary,
    combinedByGapFamily: countBy(combinedReadyRows, 'gapFamily'),
    combinedByStatus: countBy(combinedReadyRows, 'ledgerStatus'),
    combinedByQueue: countBy(combinedReadyRows, 'sourceQueue'),
    combinedByExecutionLane: countBy(combinedReadyRows, 'executionLane'),
  },
  queueWaves: [],
  combinedReadyRows,
};

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);

const mdLines = [
  '# Scrape Target Universe Queue',
  '',
  `Generated: ${generatedDate}`,
  '',
  `- source: \`${payload.source}\``,
  `- universe ready rows: ${payload.summary.universeReadyUniqueRows}`,
  `- runnable rows: ${payload.summary.combinedReadyUniqueRows}`,
  `- excluded resolved rows: ${payload.summary.excludedResolvedRows}`,
  '',
  '## Resolved Exclusions',
  '',
  `- accepted rows seen in prior runs: ${payload.summary.resolvedFromRuns.accepted}`,
  `- rejected rows seen in prior runs: ${payload.summary.resolvedFromRuns.rejected}`,
  `- source-repair rows seen in prior runs: ${payload.summary.resolvedFromRuns.sourceRepair}`,
  `- terminal/repeat blocked rows seen in prior runs: ${payload.summary.resolvedFromRuns.terminalBlocked}`,
  '',
  '## By Status',
  '',
  ...Object.entries(payload.summary.combinedByStatus).map(([status, count]) => `- ${status}: ${count}`),
  '',
  '## By Family',
  '',
  ...Object.entries(payload.summary.combinedByGapFamily).map(([family, count]) => `- ${family}: ${count}`),
  '',
];

fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  summary: payload.summary,
  json: jsonOutPath,
  md: mdOutPath,
}, null, 2));
