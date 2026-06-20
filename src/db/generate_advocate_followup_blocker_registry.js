import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const sourceAcquisitionRunsDir = path.join(dataDir, 'source-acquisition-runs');
const stateDir = path.join(dataDir, 'source-acquisition-state');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `advocate-followup-blocker-registry-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `advocate-followup-blocker-registry-${generatedDate}.md`);
const stateOutPath = path.join(stateDir, 'advocate-followup-blocker-registry.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function latestRunIds(runIds) {
  return [...runIds].sort().reverse();
}

const grouped = new Map();

if (fs.existsSync(sourceAcquisitionRunsDir)) {
  for (const runId of fs.readdirSync(sourceAcquisitionRunsDir).sort()) {
    const followupDir = path.join(sourceAcquisitionRunsDir, runId, 'followups');
    if (!fs.existsSync(followupDir)) continue;

    for (const [fileName, bucket] of [
      ['blocked-failures.json', 'blocked'],
      ['source-repair.json', 'source_repair'],
      ['retryable-failures.json', 'retryable'],
    ]) {
      const filePath = path.join(followupDir, fileName);
      if (!fs.existsSync(filePath)) continue;
      const rows = readJson(filePath);
      if (!Array.isArray(rows)) continue;

      for (const row of rows) {
        if (row.gapFamily !== 'advocates_legal') continue;
        const sourceUrl = String(row.sourceUrl || '').trim();
        const followupReason = String(row.followupReason || '').trim();
        const hostname = String(row.hostname || '').trim();
        if (!sourceUrl || !followupReason) continue;
        const key = `${bucket}|${followupReason}|${sourceUrl}`;
        if (!grouped.has(key)) {
          grouped.set(key, {
            gapFamily: 'advocates_legal',
            targetTable: row.targetTable || 'iep_advocates',
            sourceUrl,
            hostname,
            bucket,
            followupReason,
            runIds: [],
            stateIds: [],
            savedPaths: [],
            sampleStatusCodes: [],
            sampleErrors: [],
          });
        }
        const entry = grouped.get(key);
        entry.runIds.push(runId);
        if (row.stateId) entry.stateIds.push(row.stateId);
        if (row.savedPath) entry.savedPaths.push(path.relative(repoRoot, String(row.savedPath)));
        if (row.status) entry.sampleStatusCodes.push(row.status);
        if (row.error || row.errorCode) entry.sampleErrors.push([row.error, row.errorCode].filter(Boolean).join(':'));
      }
    }
  }
}

const allRows = [...grouped.values()]
  .map((entry) => ({
    ...entry,
    runIds: latestRunIds(new Set(entry.runIds)),
    stateIds: [...new Set(entry.stateIds)].sort(),
    savedPaths: [...new Set(entry.savedPaths)].sort(),
    sampleStatusCodes: [...new Set(entry.sampleStatusCodes)],
    sampleErrors: [...new Set(entry.sampleErrors)],
  }))
  .map((entry) => ({
    ...entry,
    repeatCount: entry.runIds.length,
  }))
  .sort((a, b) =>
    b.repeatCount - a.repeatCount ||
    a.bucket.localeCompare(b.bucket) ||
    a.followupReason.localeCompare(b.followupReason) ||
    a.sourceUrl.localeCompare(b.sourceUrl)
  );

const rows = allRows.filter((entry) =>
  entry.repeatCount >= 2 || (entry.bucket === 'source_repair' && entry.followupReason === 'dns_lookup_failed')
);

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  summary: {
    totalRows: allRows.length,
    totalActionableRows: rows.length,
    byBucketAll: countBy(allRows, 'bucket'),
    byBucket: countBy(rows, 'bucket'),
    byReasonAll: countBy(allRows, 'followupReason'),
    byReason: countBy(rows, 'followupReason'),
    distinctDomains: [...new Set(allRows.map((row) => row.hostname).filter(Boolean))].length,
    latestRunIds: latestRunIds(new Set(allRows.flatMap((row) => row.runIds))).slice(0, 10),
  },
  allRows,
  rows,
};

const mdLines = [
  '# Advocate Followup Blocker Registry',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  'This registry captures saved advocate/legal followup failures that should be routed to source repair instead of re-fetched in the lightweight lane.',
  '',
  '## Summary',
  '',
  `- total advocate blocker rows: ${payload.summary.totalRows}`,
  `- actionable blocker rows: ${payload.summary.totalActionableRows}`,
  `- distinct domains: ${payload.summary.distinctDomains}`,
  `- latest runs: ${payload.summary.latestRunIds.join(', ') || 'none'}`,
  '',
  '## By Bucket (All Rows)',
  '',
  ...Object.entries(payload.summary.byBucketAll).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## By Bucket',
  '',
  ...Object.entries(payload.summary.byBucket).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## By Reason (All Rows)',
  '',
  ...Object.entries(payload.summary.byReasonAll).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## By Reason',
  '',
  ...Object.entries(payload.summary.byReason).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## Rows',
  '',
];

for (const row of rows) {
  mdLines.push(`- ${row.bucket} | ${row.followupReason} | ${row.hostname} | repeats=${row.repeatCount} | ${row.sourceUrl}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.mkdirSync(stateDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);
fs.writeFileSync(stateOutPath, `${JSON.stringify(payload, null, 2)}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  state: stateOutPath,
  totalActionableRows: payload.summary.totalActionableRows,
  byBucket: payload.summary.byBucket,
}, null, 2));
