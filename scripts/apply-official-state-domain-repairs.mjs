import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const packPath = path.join(repoRoot, 'data', 'source_packs', 'official_state_domain_repairs.json');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');

function parseArgs(argv) {
  const args = {
    apply: false,
    state: null,
  };

  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--state=')) args.state = arg.slice('--state='.length).trim().toLowerCase();
  }

  return args;
}

function normalizeUrl(rawUrl) {
  if (!rawUrl || !String(rawUrl).trim()) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) {
      parsed.port = '';
    }
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function domainFromUrl(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

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

function buildEligibleRepairs(pack, stateFilter) {
  return pack.rows
    .filter((row) => !stateFilter || row.stateId === stateFilter)
    .map((row) => {
      const mediumCandidates = (row.replacementCandidates || []).filter((candidate) => candidate.confidence === 'medium');
      return {
        ...row,
        mediumCandidates,
      };
    })
    .filter((row) => row.mediumCandidates.length === 1)
    .filter((row) => row.exactCandidateCount === 1);
}

function toMarkdown(report) {
  const lines = [
    '# Official State Domain Repair Run',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Mode: ${report.mode}`,
    '',
    '## Summary',
    '',
    `- state filter: ${report.stateFilter || 'all'}`,
    `- eligible repair rows: ${report.summary.eligibleRepairRows}`,
    `- applied changes: ${report.summary.appliedChanges}`,
    `- files changed: ${report.summary.filesChanged}`,
    `- skipped ambiguous rows: ${report.summary.skippedAmbiguousRows}`,
    `- skipped missing source rows: ${report.summary.skippedMissingRows}`,
    '',
    '## Skipped Ambiguous Rows By Mode',
    '',
    ...Object.entries(report.summary.skippedAmbiguousByMode).sort((a, b) => b[1] - a[1]).map(([mode, count]) => `- ${mode}: ${count}`),
    '',
    '## Proposed Repairs',
    '',
  ];

  for (const item of report.repairs) {
    lines.push(`- ${item.stateId} | ${item.targetTable} | ${item.before.sourceUrl} -> ${item.after.sourceUrl} | ${item.status}`);
  }

  return `${lines.join('\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));
const pack = readJson(packPath);
const allRows = Array.isArray(pack.rows) ? pack.rows : [];
const ambiguousRows = allRows
  .filter((row) => !args.state || row.stateId === args.state)
  .filter((row) => ((row.replacementCandidates || []).filter((candidate) => candidate.confidence === 'medium')).length !== 1);
const eligibleRows = buildEligibleRepairs(pack, args.state);
const changedFiles = new Set();
const repairs = [];
let skippedMissingRows = 0;

for (const repair of eligibleRows) {
  const filePath = path.join(sourceTargetsDir, `${repair.stateId}.json`);
  if (!fs.existsSync(filePath)) {
    skippedMissingRows += 1;
    repairs.push({
      stateId: repair.stateId,
      targetTable: repair.targetTable,
      sourceName: repair.sourceName,
      before: { sourceUrl: repair.fakeSourceUrl, sourceName: repair.sourceName },
      after: { sourceUrl: '', sourceName: '' },
      candidate: repair.mediumCandidates[0],
      status: 'missing_source_file',
    });
    continue;
  }

  const payload = readJson(filePath);
  const items = Array.isArray(payload) ? payload : payload.targets || [];
  const match = items.find((item) =>
    (item.target_table || '') === repair.targetTable &&
    (item.source_name || '') === repair.sourceName &&
    normalizeUrl(item.source_url || '') === repair.fakeSourceUrl,
  );

  if (!match) {
    skippedMissingRows += 1;
    repairs.push({
      stateId: repair.stateId,
      targetTable: repair.targetTable,
      sourceName: repair.sourceName,
      before: { sourceUrl: repair.fakeSourceUrl, sourceName: repair.sourceName },
      after: { sourceUrl: '', sourceName: '' },
      candidate: repair.mediumCandidates[0],
      status: 'missing_source_row',
    });
    continue;
  }

  const candidate = repair.mediumCandidates[0];
  const before = {
    sourceUrl: match.source_url || '',
    sourceName: match.source_name || '',
    domain: match.domain || '',
    notes: match.notes || '',
  };

  const repairNote = `Official domain repair candidate applied ${new Date().toISOString().slice(0, 10)} from ${repair.fakeSourceUrl} to ${candidate.url}.`;

  const after = {
    sourceUrl: candidate.url,
    sourceName: candidate.name || match.source_name || '',
    domain: domainFromUrl(candidate.url),
    notes: before.notes.includes('Official domain repair candidate applied')
      ? before.notes
      : `${before.notes}${before.notes ? ' ' : ''}${repairNote}`,
  };

  if (args.apply) {
    match.source_url = after.sourceUrl;
    match.source_name = after.sourceName;
    match.domain = after.domain;
    match.notes = after.notes;
    fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
    changedFiles.add(filePath);
  }

  repairs.push({
    stateId: repair.stateId,
    targetTable: repair.targetTable,
    sourceName: repair.sourceName,
    before,
    after,
    candidate,
    status: args.apply ? 'applied' : 'dry_run_ready',
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  mode: args.apply ? 'apply' : 'dry-run',
  stateFilter: args.state,
  summary: {
    eligibleRepairRows: eligibleRows.length,
    appliedChanges: repairs.filter((item) => item.status === 'applied').length,
    filesChanged: changedFiles.size,
    skippedAmbiguousRows: ambiguousRows.length,
    skippedAmbiguousByMode: countBy(ambiguousRows, 'replacementMode'),
    skippedMissingRows,
  },
  repairs,
  ambiguousRows: ambiguousRows.map((row) => ({
    stateId: row.stateId,
    targetTable: row.targetTable,
    sourceName: row.sourceName,
    fakeSourceUrl: row.fakeSourceUrl,
    replacementMode: row.replacementMode,
    mediumCandidateCount: (row.replacementCandidates || []).filter((candidate) => candidate.confidence === 'medium').length,
  })),
};

const jsonOutPath = path.join(docsDir, `official-state-domain-repair-run-${runTimestamp}.json`);
const mdOutPath = path.join(docsDir, `official-state-domain-repair-run-${runTimestamp}.md`);
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(mdOutPath, toMarkdown(report));

console.log(JSON.stringify({
  generatedAt: report.generatedAt,
  mode: report.mode,
  stateFilter: report.stateFilter,
  summary: report.summary,
  report: {
    json: jsonOutPath,
    md: mdOutPath,
  },
}, null, 2));
