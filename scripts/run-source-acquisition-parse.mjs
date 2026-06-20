import fs from 'node:fs';
import path from 'node:path';
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
      const htmlBuffer = fs.readFileSync(row.savedPath);
      const wasTruncated = Number.isFinite(MAX_PARSE_BYTES)
        && MAX_PARSE_BYTES > 0
        && htmlBuffer.length > MAX_PARSE_BYTES;
      const html = (wasTruncated ? htmlBuffer.subarray(0, MAX_PARSE_BYTES) : htmlBuffer).toString('utf8');
      parsedRecords.push({
        ...parseFamilyRecord(row, html),
        sourceHtmlBytes: htmlBuffer.length,
        parseTruncated: wasTruncated,
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
