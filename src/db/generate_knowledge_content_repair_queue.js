import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const stateDir = path.join(repoRoot, 'data', 'source-acquisition-state');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const queuePath = path.join(docsDir, `knowledge-content-status-queue-${generatedDate}.json`);
const jsonOutPath = path.join(docsDir, `knowledge-content-repair-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `knowledge-content-repair-queue-${generatedDate}.md`);
const ledgerPath = path.join(stateDir, 'knowledge-content-repair-ledger.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return readJson(filePath);
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function classifyRepair(row) {
  if (row.lastFollowupReason === 'access_blocked_403') {
    return {
      repairClass: 'official_source_access_blocked',
      recommendedDecisionMode: 'defer_blocked_source',
      allowedDecisionModes: ['defer_blocked_source', 'replace_with_reviewed_exact_target', 'skip_unresolved'],
      nextAction: 'Do not keep retrying 403-blocked official pages. Either defer them as blocked official sources or replace them with reviewed exact targets.',
    };
  }

  if (row.lastFollowupReason === 'dns_lookup_failed') {
    return {
      repairClass: 'official_source_unreachable',
      recommendedDecisionMode: 'replace_with_reviewed_exact_target',
      allowedDecisionModes: ['replace_with_reviewed_exact_target', 'defer_blocked_source', 'skip_unresolved'],
      nextAction: 'Replace the unreachable exact target with a reviewed exact target, or defer if no truthful replacement exists.',
    };
  }

  if (row.lastFollowupReason === 'stale_or_invalid_404') {
    return {
      repairClass: 'official_source_stale_or_removed',
      recommendedDecisionMode: 'defer_blocked_source',
      allowedDecisionModes: ['defer_blocked_source', 'replace_with_reviewed_exact_target', 'skip_unresolved'],
      nextAction: 'Do not keep retrying stale or removed exact pages. Defer the dead source or replace it with a reviewed exact target.',
    };
  }

  return {
    repairClass: 'blocked_source_unknown',
    recommendedDecisionMode: 'skip_unresolved',
    allowedDecisionModes: ['replace_with_reviewed_exact_target', 'defer_blocked_source', 'skip_unresolved'],
    nextAction: 'Persist a bounded decision for this blocked target instead of retrying blindly.',
  };
}

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing knowledge content status queue: ${queuePath}. Run npm run audit:knowledge-content-status-queue first.`);
}

const queue = readJson(queuePath);
const ledger = readJsonIfExists(ledgerPath, { rows: [] });
const ledgerById = new Map((ledger.rows || []).map((row) => [String(row.id || '').trim(), row]));
const rows = (queue.rows || [])
  .filter((row) => row.finalStatus === 'fetch_blocked')
  .filter((row) => {
    const ledgerRow = ledgerById.get(String(row.id || '').trim());
    if (!ledgerRow) return true;
    const ledgerStatus = String(ledgerRow.status || '').trim();
    const replacementStillPending =
      ledgerStatus === 'reviewed_replacement_ready'
      && String(ledgerRow.reviewedSourceUrl || '').trim()
      && String(ledgerRow.reviewedSourceUrl || '').trim() === String(row.sourceUrl || '').trim();
    if (replacementStillPending) return false;
    if (ledgerStatus === 'deferred_blocked_source') return false;
    return true;
  })
  .map((row) => ({
    id: row.id,
    sourceName: row.sourceName,
    sourceUrl: row.sourceUrl,
    domain: row.domain,
    whyNeeded: row.whyNeeded,
    lastFollowupReason: row.lastFollowupReason || 'unknown',
    latestFollowupRunId: row.latestFollowupRunId || '',
    followupRunCount: Number(row.followupRunCount || 0),
    ...classifyRepair(row),
    entryCommand: 'npm run audit:knowledge-content-repair-decision-template',
    auditCommand: 'npm run audit:knowledge-content-repair-queue',
    commands: [
      'npm run audit:knowledge-content-repair-decision-template',
      'npm run fix:knowledge-content-repair-decisions',
      'npm run audit:knowledge-content-repair-queue',
    ],
  }))
  .sort((a, b) =>
    Number(b.followupRunCount || 0) - Number(a.followupRunCount || 0)
    || String(a.sourceName || '').localeCompare(String(b.sourceName || ''))
  );

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceQueue: path.relative(repoRoot, queuePath),
  sourceLedger: fs.existsSync(ledgerPath) ? path.relative(repoRoot, ledgerPath) : null,
  purpose: 'Deterministic repair queue for blocked knowledge-content exact targets.',
  summary: {
    totalRows: rows.length,
    resolvedRowsExcluded: (queue.rows || []).filter((row) => {
      if (row.finalStatus !== 'fetch_blocked') return false;
      const ledgerRow = ledgerById.get(String(row.id || '').trim());
      if (!ledgerRow) return false;
      const ledgerStatus = String(ledgerRow.status || '').trim();
      const replacementStillPending =
        ledgerStatus === 'reviewed_replacement_ready'
        && String(ledgerRow.reviewedSourceUrl || '').trim()
        && String(ledgerRow.reviewedSourceUrl || '').trim() === String(row.sourceUrl || '').trim();
      if (replacementStillPending) return true;
      if (ledgerStatus === 'deferred_blocked_source') return true;
      return false;
    }).length,
    byRepairClass: countBy(rows, 'repairClass'),
    byFollowupReason: countBy(rows, 'lastFollowupReason'),
  },
  rows,
};

const mdLines = [
  '# Knowledge Content Repair Queue',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Summary',
  '',
  `- total rows: ${payload.summary.totalRows}`,
  ...Object.entries(payload.summary.byRepairClass).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## Rows',
  '',
  ...rows.map((row) => `- ${row.sourceName} | ${row.lastFollowupReason} | repeats=${row.followupRunCount} | recommended=${row.recommendedDecisionMode}`),
];

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  totalRows: payload.summary.totalRows,
  byRepairClass: payload.summary.byRepairClass,
}, null, 2));
