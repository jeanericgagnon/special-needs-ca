import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const providerSourcePackPath = path.join(docsDir, `provider-source-pack-plan-${generatedDate}.json`);
const jsonOutPath = path.join(docsDir, `provider-secondary-discovery-queue-${generatedDate}.json`);
const csvOutPath = path.join(docsDir, `provider-secondary-discovery-queue-${generatedDate}.csv`);
const mdOutPath = path.join(docsDir, `provider-secondary-discovery-queue-${generatedDate}.md`);

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

const providerPlan = readJson(providerSourcePackPath);
const states = providerPlan.states || [];

const rows = states
  .flatMap((state) =>
    (state.directoryProviderTargets || []).map((target) => ({
      stateId: state.stateId,
      stateName: state.stateName,
      readinessLane: state.readinessLane,
      sourceTargetsPath: state.sourceTargetsPath,
      sourceName: target.source_name,
      sourceUrl: target.source_url,
      domain: target.domain,
      crawlMethod: target.crawl_method,
      organizationType: target.organization_type,
      followupType: 'directory_secondary_discovery_only',
      priority: 2,
      recommendedAction: 'Use this directory-style provider target only to discover named first-party provider sites or facilities; do not promote providers directly from it without stronger first-party evidence.',
      expectedExtractionFields: target.expected_extraction_fields || '',
      notes: target.notes || '',
    }))
  )
  .sort((a, b) =>
    a.stateId.localeCompare(b.stateId) ||
    a.sourceName.localeCompare(b.sourceName)
  );

const summary = {
  totalRows: rows.length,
  statesWithSecondaryDiscoveryTargets: new Set(rows.map((row) => row.stateId)).size,
  byState: countBy(rows, 'stateId'),
  byDomain: countBy(rows, 'domain'),
  byReadinessLane: countBy(rows, 'readinessLane'),
};

const headers = [
  'stateId',
  'stateName',
  'readinessLane',
  'sourceTargetsPath',
  'sourceName',
  'sourceUrl',
  'domain',
  'crawlMethod',
  'organizationType',
  'followupType',
  'priority',
  'recommendedAction',
  'expectedExtractionFields',
  'notes',
];

const payload = {
  queueId: 'provider_secondary_discovery_queue',
  generatedAt: generatedDate,
  sourceArtifact: path.relative(repoRoot, providerSourcePackPath),
  purpose: 'Deterministic queue of directory-style provider targets that may be useful for secondary discovery but are not safe primary provider pull targets.',
  summary,
  rows,
};

const mdLines = [
  '# Provider Secondary Discovery Queue',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This queue isolates directory-style provider targets from the main provider source-pack so primary first-party pulls are not confused with secondary discovery work.',
  '',
  '## Summary',
  '',
  `- total rows: ${summary.totalRows}`,
  `- states with secondary discovery targets: ${summary.statesWithSecondaryDiscoveryTargets}`,
  '',
  '## By State',
  '',
];

for (const [stateId, count] of Object.entries(summary.byState).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${stateId}: ${count}`);
}

mdLines.push('', '## Sample Rows', '');
for (const row of rows.slice(0, 25)) {
  mdLines.push(`- ${row.stateId} | ${row.sourceName} | ${row.sourceUrl}`);
}

mdLines.push('', '## Files', '');
mdLines.push(`- JSON queue: ${path.relative(repoRoot, jsonOutPath)}`);
mdLines.push(`- CSV queue: ${path.relative(repoRoot, csvOutPath)}`);
mdLines.push(`- Source artifact: ${path.relative(repoRoot, providerSourcePackPath)}`);

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(csvOutPath, `${toCsv(rows, headers)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  queue: {
    json: jsonOutPath,
    csv: csvOutPath,
    md: mdOutPath,
  },
  summary,
}, null, 2));
