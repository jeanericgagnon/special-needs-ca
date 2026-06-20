import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const sourcePacksDir = path.join(repoRoot, 'data', 'source_packs');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const formsPackPath = path.join(sourcePacksDir, 'forms_source_pack.json');
const jsonOutPath = path.join(docsDir, `forms-fallback-scrape-queue-${generatedDate}.json`);
const csvOutPath = path.join(docsDir, `forms-fallback-scrape-queue-${generatedDate}.csv`);
const mdOutPath = path.join(docsDir, `forms-fallback-scrape-queue-${generatedDate}.md`);

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

const pack = readJson(formsPackPath);
const fallbackPackRows = (pack.rows || []).filter((stateRow) => stateRow.replacementClass === 'state_specific_form_fallback_only');
const federalOnlyRows = (pack.rows || []).filter((stateRow) => stateRow.replacementClass === 'federal_only_form_fallback');
const rows = [];

for (const stateRow of fallbackPackRows) {
  for (const candidate of (stateRow.topCandidates || [])) {
    if (candidate.candidateType === 'exact_forms_library') continue;
    if ((candidate.domain || '').endsWith('ssa.gov')) continue;
    rows.push({
      stateId: stateRow.stateId,
      blockedFormsSourceUrl: stateRow.blockedFormsTarget.sourceUrl,
      blockedFormsSourceName: stateRow.blockedFormsTarget.sourceName,
      sourceName: candidate.sourceName,
      sourceUrl: candidate.sourceUrl,
      domain: candidate.domain,
      candidateType: candidate.candidateType,
      priority: candidate.priority,
      recordCount: candidate.recordCount,
      verificationStatus: candidate.verificationStatus,
      sourceQueue: 'forms_fallback_official',
      targetTable: 'forms',
      gapFamily: 'forms_guides',
      crawlMethod: 'pdf_extract',
      lanePurpose: 'Scrape truthful state-specific official form-adjacent pages without promoting them as exact forms libraries.',
    });
  }
}

rows.sort((a, b) =>
  a.stateId.localeCompare(b.stateId) ||
  Number(b.priority) - Number(a.priority) ||
  Number(b.recordCount) - Number(a.recordCount) ||
  a.sourceUrl.localeCompare(b.sourceUrl)
);

const summary = {
  fallbackPackStates: fallbackPackRows.length,
  blockedFallbackStates: new Set(rows.map((row) => row.stateId)).size,
  excludedFederalOnlyStates: federalOnlyRows.map((row) => row.stateId).sort(),
  totalQueueRows: rows.length,
  byCandidateType: countBy(rows, 'candidateType'),
  byDomain: countBy(rows, 'domain'),
};

const headers = [
  'stateId',
  'blockedFormsSourceName',
  'blockedFormsSourceUrl',
  'sourceName',
  'sourceUrl',
  'domain',
  'candidateType',
  'priority',
  'recordCount',
  'verificationStatus',
  'sourceQueue',
  'targetTable',
  'gapFamily',
  'crawlMethod',
  'lanePurpose',
];

const mdLines = [
  '# Forms Fallback Scrape Queue',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This queue is for truthful fallback scraping only. These rows are state-specific official pages related to applications, eligibility, intake, or form-adjacent guidance, but they are not promoted as exact forms libraries.',
  '',
  '## Summary',
  '',
  `- fallback pack states with state-specific candidates: ${summary.fallbackPackStates}`,
  `- blocked fallback states: ${summary.blockedFallbackStates}`,
  `- excluded federal-only states: ${summary.excludedFederalOnlyStates.length}`,
  `- total queue rows: ${summary.totalQueueRows}`,
  '',
  '## By Candidate Type',
  '',
];

for (const [candidateType, count] of Object.entries(summary.byCandidateType).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${candidateType}: ${count}`);
}

if (summary.excludedFederalOnlyStates.length) {
  mdLines.push('', '## Excluded Federal-Only States', '');
  for (const stateId of summary.excludedFederalOnlyStates) {
    mdLines.push(`- ${stateId}: only federal fallback evidence was available, so no state-specific scrape row was queued.`);
  }
}

mdLines.push('', '## Sample Rows', '');
for (const row of rows.slice(0, 25)) {
  mdLines.push(`- ${row.stateId}: ${row.candidateType} | ${row.sourceUrl}`);
}

mdLines.push('', '## Files', '');
mdLines.push(`- JSON queue: ${path.relative(repoRoot, jsonOutPath)}`);
mdLines.push(`- CSV queue: ${path.relative(repoRoot, csvOutPath)}`);
mdLines.push(`- Markdown report: ${path.relative(repoRoot, mdOutPath)}`);

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify({ generatedAt: generatedDate, summary, rows }, null, 2)}\n`);
fs.writeFileSync(csvOutPath, `${toCsv(rows, headers)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  summary,
  queue: {
    json: jsonOutPath,
    csv: csvOutPath,
    md: mdOutPath,
  },
}, null, 2));
