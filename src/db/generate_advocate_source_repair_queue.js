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
const blockerPath = path.join(docsDir, `advocate-followup-blocker-registry-${generatedDate}.json`);
const jsonOutPath = path.join(docsDir, `advocate-source-repair-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `advocate-source-repair-queue-${generatedDate}.md`);
const ledgerPath = path.join(stateDir, 'advocate-source-repair-ledger.json');

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
  if (row.followupReason === 'dns_lookup_failed') {
    return {
      repairClass: 'stale_domain_replace',
      recommendedDecisionMode: 'replace_with_reviewed_first_party_target',
    };
  }
  if (row.followupReason === 'network_timeout') {
    return {
      repairClass: 'bounded_retry_or_replace',
      recommendedDecisionMode: 'bounded_retry_once',
    };
  }
  return {
    repairClass: 'defer_or_replace',
    recommendedDecisionMode: 'defer_blocked_source',
  };
}

if (!fs.existsSync(blockerPath)) {
  throw new Error(`Missing advocate blocker registry: ${blockerPath}. Run npm run audit:advocate-followup-blocker-registry first.`);
}

const blockerRegistry = readJson(blockerPath);
const ledger = readJsonIfExists(ledgerPath, { rows: [] });
const resolvedKeys = new Set((ledger.rows || []).map((row) => String(row.repairKey || '').trim()).filter(Boolean));

const rows = (blockerRegistry.rows || [])
  .filter((row) => !resolvedKeys.has(`${row.bucket}|${row.followupReason}|${row.sourceUrl}`))
  .map((row) => ({
    repairKey: `${row.bucket}|${row.followupReason}|${row.sourceUrl}`,
    sourceUrl: row.sourceUrl,
    hostname: row.hostname,
    bucket: row.bucket,
    followupReason: row.followupReason,
    repeatCount: Number(row.repeatCount || 0),
    stateIds: row.stateIds || [],
    targetTable: row.targetTable || 'iep_advocates',
    ...classifyRepair(row),
    entryCommand: 'npm run audit:advocate-source-repair-decision-template',
    auditCommand: 'npm run audit:advocate-source-repair-queue',
    commands: [
      'npm run audit:advocate-source-repair-decision-template',
      'npm run fix:advocate-source-repair-decisions',
      'npm run audit:advocate-source-repair-queue',
    ],
  }))
  .sort((a, b) =>
    Number(b.repeatCount || 0) - Number(a.repeatCount || 0)
    || String(a.followupReason || '').localeCompare(String(b.followupReason || ''))
    || String(a.sourceUrl || '').localeCompare(String(b.sourceUrl || ''))
  );

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceRegistry: path.relative(repoRoot, blockerPath),
  sourceLedger: fs.existsSync(ledgerPath) ? path.relative(repoRoot, ledgerPath) : null,
  purpose: 'Deterministic repair queue for repeated advocate source failures.',
  summary: {
    totalRows: rows.length,
    resolvedRowsExcluded: resolvedKeys.size,
    byRepairClass: countBy(rows, 'repairClass'),
    byFollowupReason: countBy(rows, 'followupReason'),
  },
  rows,
};

const mdLines = [
  '# Advocate Source Repair Queue',
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
  ...rows.slice(0, 100).map((row) => `- ${row.followupReason} | ${row.hostname} | repeats=${row.repeatCount} | recommended=${row.recommendedDecisionMode}`),
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
