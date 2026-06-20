import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  ensureDir,
  getLatestRunId,
  outputRoot,
  parseArgs,
  parseFamilyRecord,
  pickFollowupRows,
  readJson,
  writeJson,
  writeNdjson,
  countBy,
} from './source-acquisition-lightweight-lib.mjs';

const args = parseArgs(process.argv.slice(2));
const runId = args.runId || getLatestRunId();
const MAX_PARSE_BYTES = Number(process.env.SOURCE_ACQUISITION_PARSE_MAX_BYTES || 300000);
const PYTHON_CANDIDATES = [
  process.env.CODEX_BUNDLED_PYTHON,
  process.env.CA_SOURCE_PACK_PYTHON,
  path.join(process.env.HOME || '', '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'python', 'bin', 'python3'),
  'python3',
].filter(Boolean);
let cachedPypdfPython = null;

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inferSavedPathParserClass(row) {
  const explicit = String(row.parserClass || row.parser_class || '').trim().toLowerCase();
  if (explicit) return explicit;
  const savedPath = String(row.savedPath || '').toLowerCase();
  if (savedPath.endsWith('.pdf')) return 'pdf';
  if (savedPath.endsWith('.docx') || savedPath.endsWith('.doc')) return 'docx';
  if (savedPath.endsWith('.xlsx') || savedPath.endsWith('.xls')) return 'xlsx';
  return 'html';
}

function getPythonWithPypdf() {
  if (cachedPypdfPython !== null) return cachedPypdfPython;
  const probe = 'import pypdf';
  for (const candidate of PYTHON_CANDIDATES) {
    const result = spawnSync(candidate, ['-c', probe], { encoding: 'utf8' });
    if (result.status === 0) {
      cachedPypdfPython = candidate;
      return candidate;
    }
  }
  cachedPypdfPython = '';
  return cachedPypdfPython;
}

function extractPdfText(savedPath) {
  const python = getPythonWithPypdf();
  if (!python) {
    return {
      parserMode: 'pdf-metadata-only',
      html: `<html><head><title>${escapeHtml(path.basename(savedPath))}</title></head><body><h1>${escapeHtml(path.basename(savedPath))}</h1></body></html>`,
    };
  }
  const program = [
    'import sys',
    'from pypdf import PdfReader',
    'reader = PdfReader(sys.argv[1])',
    'parts = []',
    'limit = min(len(reader.pages), 5)',
    'for i in range(limit):',
    '    page = reader.pages[i]',
    '    parts.append(page.extract_text() or "")',
    'print("\\n".join(parts))',
  ].join('\n');
  const result = spawnSync(python, ['-c', program, savedPath], { encoding: 'utf8', maxBuffer: 2_000_000 });
  if (result.status !== 0) {
    return {
      parserMode: 'pdf-metadata-only',
      html: `<html><head><title>${escapeHtml(path.basename(savedPath))}</title></head><body><h1>${escapeHtml(path.basename(savedPath))}</h1></body></html>`,
      extractionError: (result.stderr || result.stdout || '').trim(),
    };
  }
  const text = (result.stdout || '').trim();
  return {
    parserMode: text ? 'pdf-pypdf' : 'pdf-metadata-only',
    html: `<html><head><title>${escapeHtml(path.basename(savedPath))}</title></head><body><h1>${escapeHtml(path.basename(savedPath))}</h1><pre>${escapeHtml(text.slice(0, MAX_PARSE_BYTES))}</pre></body></html>`,
  };
}

function loadRowHtml(row) {
  const parserClass = inferSavedPathParserClass(row);
  const savedPath = row.savedPath;
  if (parserClass === 'pdf') {
    return extractPdfText(savedPath);
  }
  const buffer = fs.readFileSync(savedPath);
  const wasTruncated = Number.isFinite(MAX_PARSE_BYTES)
    && MAX_PARSE_BYTES > 0
    && buffer.length > MAX_PARSE_BYTES;
  return {
    parserMode: parserClass === 'html' ? 'html-basic' : `${parserClass}-metadata-only`,
    html: (wasTruncated ? buffer.subarray(0, MAX_PARSE_BYTES) : buffer).toString('utf8'),
    sourceHtmlBytes: buffer.length,
    parseTruncated: wasTruncated,
  };
}

if (!runId) {
  throw new Error('No source acquisition run found.');
}

const { inputPath, rows } = pickFollowupRows({
  runId,
  bucket: args.bucket,
  family: args.family,
  limit: args.limit,
});

const runDir = path.join(outputRoot, runId);
const parsedRoot = path.join(runDir, 'parsed');
ensureDir(parsedRoot);

const families = new Set(rows.map((row) => row.gapFamily));
const summaries = [];

for (const family of families) {
  const familyRows = rows.filter((row) => row.gapFamily === family);
  const familyDir = path.join(parsedRoot, family);
  ensureDir(familyDir);

  const parsedRecords = [];
  const schemaErrors = [];

  for (const row of familyRows) {
    try {
      const loaded = loadRowHtml(row);
      parsedRecords.push({
        ...parseFamilyRecord(row, loaded.html),
        sourceHtmlBytes: loaded.sourceHtmlBytes || fs.statSync(row.savedPath).size,
        parseTruncated: Boolean(loaded.parseTruncated),
        sourceParserMode: loaded.parserMode,
        sourceExtractionError: loaded.extractionError || '',
      });
    } catch (error) {
      schemaErrors.push({
        stateId: row.stateId,
        gapFamily: row.gapFamily,
        sourceUrl: row.sourceUrl,
        savedPath: row.savedPath,
        error: String(error.message || error),
      });
    }
  }

  const summary = {
    runId,
    family,
    bucket: args.bucket,
    inputPath,
    selectedCount: familyRows.length,
    parsedCount: parsedRecords.length,
    schemaErrorCount: schemaErrors.length,
    parseStatuses: countBy(parsedRecords, (row) => row.parseStatus),
    topHostnames: countBy(parsedRecords, (row) => {
      try {
        return new URL(row.finalUrl).hostname;
      } catch {
        return 'unknown';
      }
    }).slice(0, 15),
    samplesPath: path.join(familyDir, 'samples.json'),
    recordsPath: path.join(familyDir, 'records.ndjson'),
  };

  writeNdjson(path.join(familyDir, 'records.ndjson'), parsedRecords);
  writeJson(path.join(familyDir, 'schema-errors.json'), schemaErrors);
  writeJson(path.join(familyDir, 'samples.json'), parsedRecords.slice(0, 10));
  writeJson(path.join(familyDir, 'summary.json'), summary);
  fs.writeFileSync(
    path.join(familyDir, 'summary.md'),
    [
      `# Parsed Summary: ${family}`,
      '',
      `- Run ID: \`${runId}\``,
      `- Bucket: \`${args.bucket}\``,
      `- Selected: \`${summary.selectedCount}\``,
      `- Parsed: \`${summary.parsedCount}\``,
      `- Schema Errors: \`${summary.schemaErrorCount}\``,
      '',
      '## Parse Statuses',
      '',
      ...summary.parseStatuses.map((item) => `- ${item.label}: ${item.count}`),
      '',
      '## Top Hostnames',
      '',
      ...summary.topHostnames.map((item) => `- ${item.label}: ${item.count}`),
      '',
      `- Records: \`${summary.recordsPath}\``,
      `- Samples: \`${summary.samplesPath}\``,
      '',
    ].join('\n'),
  );

  summaries.push(summary);
}

const indexSummary = {
  runId,
  bucket: args.bucket,
  family: args.family,
  familyCount: summaries.length,
  families: summaries.map((summary) => ({
    family: summary.family,
    selectedCount: summary.selectedCount,
    parsedCount: summary.parsedCount,
    schemaErrorCount: summary.schemaErrorCount,
  })),
};

writeJson(path.join(parsedRoot, 'index-summary.json'), indexSummary);
console.log(JSON.stringify(indexSummary, null, 2));
