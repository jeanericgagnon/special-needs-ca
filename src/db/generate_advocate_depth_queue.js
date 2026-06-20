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
const jsonOutPath = path.join(docsDir, `advocate-depth-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `advocate-depth-queue-${generatedDate}.md`);
const csvOutPath = path.join(docsDir, `advocate-depth-queue-${generatedDate}.csv`);

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

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function toCsv(rows, headers) {
  const escape = (value) => {
    const stringValue = String(value ?? '');
    if (/[",\n]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
    return stringValue;
  };
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ].join('\n');
}

const blockerRegistryPath = latestGeneratedJson('track-a-blocker-registry-');
const advocateRepairQueuePath = latestGeneratedJson('advocate-source-repair-queue-');
const californiaRecoveryPath = latestGeneratedJson('california-advocate-recovery-queue-');

const blockerRegistry = readJson(blockerRegistryPath);
const advocateRepairQueue = readJson(advocateRepairQueuePath);
const californiaRecovery = readJson(californiaRecoveryPath);
const advocateBlocker = (blockerRegistry.blockers || []).find((blocker) => blocker.id === 'advocate_directory_depth') || null;

const rows = [];

for (const county of californiaRecovery.counties || []) {
  rows.push({
    lane: 'california_truth_recovery',
    subjectType: 'county',
    subjectId: county.countyId || county.county_id || county.id || '',
    stateId: 'california',
    priority: Number(county.priorityTier === 'priority' ? 2 : 1),
    rowCount: Number(county.blockedRows || county.rowCount || 0),
    reason: 'county_loses_all_public_safe_advocates',
    sourceUrl: '',
    nextAction: 'Recover at least one truth-safe advocate source for this county before broad advocate expansion.',
    entryCommand: 'npm run audit:california-advocate-recovery-decision-template',
    auditCommand: 'npm run audit:california-advocate-recovery',
    commands: [
      'npm run audit:california-advocate-recovery-decision-template',
      'npm run audit:california-advocate-recovery',
    ],
  });
}

for (const row of advocateRepairQueue.rows || []) {
  rows.push({
    lane: 'repeated_source_repair',
    subjectType: 'source_url',
    subjectId: row.hostname || row.sourceUrl,
    stateId: (row.stateIds || []).join('|') || '',
    priority: Number(row.repeatCount || 1),
    rowCount: Number((row.stateIds || []).length || 1),
    reason: row.followupReason,
    sourceUrl: row.sourceUrl,
    nextAction: row.followupReason === 'dns_lookup_failed'
      ? 'Replace this stale advocate domain with a current first-party source instead of retrying.'
      : 'Route this repeated advocate failure to source repair and do not keep spending lightweight fetch volume.',
    entryCommand: 'npm run run:next-advocate-source-repair-step',
    auditCommand: 'npm run audit:advocate-source-repair-queue',
    commands: [
      'npm run audit:advocate-source-repair-queue',
      'npm run run:next-advocate-source-repair-step',
    ],
  });
}

rows.sort((a, b) =>
  a.lane.localeCompare(b.lane)
  || Number(b.priority || 0) - Number(a.priority || 0)
  || String(a.subjectId).localeCompare(String(b.subjectId))
);

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    blockerRegistryPath: path.relative(repoRoot, blockerRegistryPath),
    advocateRepairQueuePath: path.relative(repoRoot, advocateRepairQueuePath),
    californiaRecoveryPath: path.relative(repoRoot, californiaRecoveryPath),
  },
  purpose: 'Deterministic advocate depth queue combining California truth-recovery counties and repeated advocate source-repair blockers.',
  summary: {
    totalRows: rows.length,
    byLane: countBy(rows, 'lane'),
    byReason: countBy(rows, 'reason'),
    blockerStatus: advocateBlocker?.status || 'unknown',
    californiaCountiesBlocked: Number(californiaRecovery.summary?.countiesBlocked || 0),
    advocateRepeatedSourceRows: Number(advocateRepairQueue.summary?.totalRows || 0),
  },
  rows,
};

const headers = [
  'lane',
  'subjectType',
  'subjectId',
  'stateId',
  'priority',
  'rowCount',
  'reason',
  'sourceUrl',
  'nextAction',
  'entryCommand',
  'auditCommand',
];

const mdLines = [
  '# Advocate Depth Queue',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Summary',
  '',
  `- total rows: ${payload.summary.totalRows}`,
  `- blocker status: ${payload.summary.blockerStatus}`,
  `- california counties blocked: ${payload.summary.californiaCountiesBlocked}`,
  `- repeated advocate source rows: ${payload.summary.advocateRepeatedSourceRows}`,
  '',
  '## By Lane',
  '',
  ...Object.entries(payload.summary.byLane).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## Top Rows',
  '',
];

for (const row of rows.slice(0, 25)) {
  mdLines.push(`- ${row.lane} | ${row.subjectId} | priority=${row.priority} | ${row.reason}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);
fs.writeFileSync(csvOutPath, `${toCsv(rows, headers)}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  csv: csvOutPath,
  totalRows: payload.summary.totalRows,
  byLane: payload.summary.byLane,
}, null, 2));
