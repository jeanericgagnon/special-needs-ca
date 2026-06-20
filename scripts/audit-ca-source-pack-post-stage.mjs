import fs from 'node:fs';
import path from 'node:path';
import {
  getLatestRunId,
  outputRoot,
  writeJson,
} from './source-acquisition-lightweight-lib.mjs';

function parseArgs(argv) {
  const args = { runId: '', outputDir: path.join(process.cwd(), 'data', 'generated') };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'run-id' && value) args.runId = value;
    if (flag === 'output-dir' && value) args.outputDir = path.resolve(value);
  }
  return args;
}

function readNdjsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (filePath.endsWith('.json') && trimmed.startsWith('[')) {
    return JSON.parse(trimmed);
  }
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function listFamilyDirs(rootPath) {
  if (!fs.existsSync(rootPath)) return [];
  return fs.readdirSync(rootPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

const FAMILY_FIELDS = {
  forms_guides: ['programName', 'officialDownloadUrl', 'sourceUrl', 'finalUrl', 'savedPath'],
  programs_benefits: ['programName', 'sourceUrl', 'finalUrl', 'savedPath'],
  waivers: ['programName', 'sourceUrl', 'finalUrl', 'savedPath'],
  medicaid_hhs_offices: ['officeName', 'contactPhone', 'contactAddress', 'sourceUrl', 'finalUrl'],
  dd_routing: ['officeName', 'contactPhone', 'sourceUrl', 'finalUrl'],
  general_gap_fill: ['programName', 'sourceUrl', 'finalUrl', 'savedPath'],
};

function getFieldValue(record, field) {
  if (field in record) return record[field];
  if (record.familyExtraction && field in record.familyExtraction) return record.familyExtraction[field];
  return '';
}

function percent(numerator, denominator) {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

const args = parseArgs(process.argv.slice(2));
const runId = args.runId || getLatestRunId();
if (!runId) throw new Error('No source acquisition run found.');

const runDir = path.join(outputRoot, runId);
const validatedRoot = path.join(runDir, 'validated');
const stagedRoot = path.join(runDir, 'staged');
const followupsRoot = path.join(runDir, 'followups');

const families = Array.from(new Set([
  ...listFamilyDirs(validatedRoot),
  ...listFamilyDirs(stagedRoot),
])).sort();

const familyRows = families.map((family) => {
  const accepted = readNdjsonIfExists(path.join(validatedRoot, family, 'accepted.ndjson'));
  const rejected = readNdjsonIfExists(path.join(validatedRoot, family, 'rejected.ndjson'));
  const staged = readNdjsonIfExists(path.join(stagedRoot, family, 'promotion-candidates.ndjson'));
  const unsupported = readNdjsonIfExists(path.join(stagedRoot, family, 'unsupported-candidates.ndjson'));
  const requiredFields = FAMILY_FIELDS[family] || ['sourceUrl', 'finalUrl', 'savedPath'];
  const fieldCompleteness = requiredFields.map((field) => {
    const present = accepted.filter((record) => Boolean(String(getFieldValue(record, field) || '').trim())).length;
    return {
      field,
      present,
      missing: accepted.length - present,
      completenessPercent: percent(present, accepted.length),
    };
  });
  const provenanceFields = ['sourceUrl', 'finalUrl', 'savedPath', 'authority', 'agency', 'provenanceUrl'];
  const provenance = provenanceFields.map((field) => {
    const present = accepted.filter((record) => Boolean(String(getFieldValue(record, field) || '').trim())).length;
    return {
      field,
      present,
      missing: accepted.length - present,
      completenessPercent: percent(present, accepted.length),
    };
  });
  return {
    family,
    acceptedCount: accepted.length,
    rejectedCount: rejected.length,
    stagedCount: staged.length,
    unsupportedCount: unsupported.length,
    fieldCompleteness,
    provenance,
  };
});

const parseReadyRows = readNdjsonIfExists(path.join(followupsRoot, 'parse-ready-high-signal.json'));
const browserAssistedRows = readNdjsonIfExists(path.join(followupsRoot, 'author-browser-assisted.json'));

const summary = {
  runId,
  generatedAt: new Date().toISOString(),
  parseReadyCount: parseReadyRows.length,
  browserAssistedCount: browserAssistedRows.length,
  familyCount: familyRows.length,
  families: familyRows,
};

const summaryPath = path.join(args.outputDir, 'ca_post_stage_completeness_audit_v1.json');
const markdownPath = path.join(args.outputDir, 'ca_post_stage_completeness_audit_v1.md');
writeJson(summaryPath, summary);
fs.writeFileSync(markdownPath, [
  '# California Post-Stage Completeness Audit',
  '',
  `- Run ID: \`${runId}\``,
  `- Parse-ready rows: \`${summary.parseReadyCount}\``,
  `- Browser-assisted rows: \`${summary.browserAssistedCount}\``,
  '',
  '## Families',
  '',
  ...familyRows.flatMap((family) => [
    `### ${family.family}`,
    '',
    `- Accepted: \`${family.acceptedCount}\``,
    `- Rejected: \`${family.rejectedCount}\``,
    `- Staged: \`${family.stagedCount}\``,
    `- Unsupported: \`${family.unsupportedCount}\``,
    '- Field completeness:',
    ...family.fieldCompleteness.map((row) => `  - ${row.field}: ${row.present}/${family.acceptedCount} (${row.completenessPercent}%)`),
    '- Provenance:',
    ...family.provenance.map((row) => `  - ${row.field}: ${row.present}/${family.acceptedCount} (${row.completenessPercent}%)`),
    '',
  ]),
].join('\n'));

console.log(JSON.stringify({
  runId,
  summaryPath,
  markdownPath,
  familyCount: familyRows.length,
  parseReadyCount: summary.parseReadyCount,
  browserAssistedCount: summary.browserAssistedCount,
}, null, 2));
