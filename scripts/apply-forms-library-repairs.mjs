import fs from 'fs';
import path from 'path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const packPath = path.join(repoRoot, 'data', 'source_packs', 'forms_source_pack.json');
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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeUrl(rawUrl) {
  if (!rawUrl || !String(rawUrl).trim()) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
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

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function eligibleRows(pack, stateFilter) {
  return (pack.rows || [])
    .filter((row) => !stateFilter || row.stateId === stateFilter)
    .map((row) => ({
      ...row,
      exactCandidates: (row.topCandidates || []).filter((candidate) => candidate.candidateType === 'exact_forms_library'),
    }))
    .filter((row) => row.replacementClass === 'exact_forms_library_available')
    .filter((row) => row.exactCandidates.length === 1);
}

function classifyNonRepairableRow(row) {
  if (row.replacementClass === 'federal_only_form_fallback') return 'federal_only_fallback';
  if (row.replacementClass === 'state_specific_form_fallback_only') return 'state_specific_fallback_only';
  if (row.replacementClass === 'no_state_specific_form_candidate') return 'no_state_specific_candidate';

  const exactCount = (row.topCandidates || []).filter((candidate) => candidate.candidateType === 'exact_forms_library').length;
  if (row.replacementClass === 'exact_forms_library_available' && exactCount !== 1) {
    return exactCount === 0 ? 'missing_exact_forms_candidate' : 'multiple_exact_forms_candidates';
  }

  return 'other_non_repairable';
}

function toMarkdown(report) {
  const lines = [
    '# Forms Library Repair Run',
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
    `- non-repairable rows: ${report.summary.nonRepairableRows}`,
    `- skipped missing source rows: ${report.summary.skippedMissingRows}`,
    '',
    '## Non-Repairable By Reason',
    '',
    ...Object.entries(report.summary.nonRepairableByReason).sort((a, b) => b[1] - a[1]).map(([reason, count]) => `- ${reason}: ${count}`),
    '',
    '## Proposed Repairs',
    '',
  ];

  for (const item of report.repairs) {
    lines.push(`- ${item.stateId} | ${item.before.sourceUrl} -> ${item.after.sourceUrl} | ${item.status}`);
  }

  return `${lines.join('\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));
const pack = readJson(packPath);
const allRows = Array.isArray(pack.rows) ? pack.rows : [];
const eligible = eligibleRows(pack, args.state);
const nonRepairableRows = allRows
  .filter((row) => !args.state || row.stateId === args.state)
  .filter((row) => row.replacementClass !== 'exact_forms_library_available' || (row.topCandidates || []).filter((c) => c.candidateType === 'exact_forms_library').length !== 1);

const changedFiles = new Set();
const repairs = [];
let skippedMissingRows = 0;

for (const repair of eligible) {
  const filePath = path.join(sourceTargetsDir, `${repair.stateId}.json`);
  if (!fs.existsSync(filePath)) {
    skippedMissingRows += 1;
    repairs.push({
      stateId: repair.stateId,
      before: { sourceUrl: repair.blockedFormsTarget.sourceUrl, sourceName: repair.blockedFormsTarget.sourceName },
      after: { sourceUrl: '', sourceName: '' },
      status: 'missing_source_file',
    });
    continue;
  }

  const payload = readJson(filePath);
  const items = Array.isArray(payload) ? payload : payload.targets || [];
  const match = items.find((item) =>
    (item.target_table || '') === 'forms' &&
    (item.source_name || '') === repair.blockedFormsTarget.sourceName &&
    normalizeUrl(item.source_url || '') === repair.blockedFormsTarget.sourceUrl,
  );

  if (!match) {
    skippedMissingRows += 1;
    repairs.push({
      stateId: repair.stateId,
      before: { sourceUrl: repair.blockedFormsTarget.sourceUrl, sourceName: repair.blockedFormsTarget.sourceName },
      after: { sourceUrl: '', sourceName: '' },
      status: 'missing_source_row',
    });
    continue;
  }

  const candidate = repair.exactCandidates[0];
  const before = {
    sourceUrl: match.source_url || '',
    sourceName: match.source_name || '',
    domain: match.domain || '',
    notes: match.notes || '',
  };

  const repairNote = `Forms library repair applied ${new Date().toISOString().slice(0, 10)} from ${repair.blockedFormsTarget.sourceUrl} to ${candidate.sourceUrl}.`;
  const after = {
    sourceUrl: candidate.sourceUrl,
    sourceName: candidate.sourceName || match.source_name || '',
    domain: domainFromUrl(candidate.sourceUrl),
    notes: before.notes.includes('Forms library repair applied')
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
    eligibleRepairRows: eligible.length,
    appliedChanges: repairs.filter((item) => item.status === 'applied').length,
    filesChanged: changedFiles.size,
    nonRepairableRows: nonRepairableRows.length,
    nonRepairableByReason: countBy(
      nonRepairableRows.map((row) => ({
        reason: classifyNonRepairableRow(row),
      })),
      'reason',
    ),
    skippedMissingRows,
  },
  repairs,
  nonRepairableRows: nonRepairableRows.map((row) => ({
    stateId: row.stateId,
    replacementClass: row.replacementClass,
    nonRepairableReason: classifyNonRepairableRow(row),
    blockedSourceUrl: row.blockedFormsTarget?.sourceUrl || '',
  })),
};

const jsonOutPath = path.join(docsDir, `forms-library-repair-run-${runTimestamp}.json`);
const mdOutPath = path.join(docsDir, `forms-library-repair-run-${runTimestamp}.md`);
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
