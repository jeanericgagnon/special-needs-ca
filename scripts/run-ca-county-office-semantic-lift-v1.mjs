import fs from 'node:fs';
import path from 'node:path';
import { evaluateCaliforniaSemanticRecord } from './ca-v4-semantic-lib.mjs';

function parseArgs(argv) {
  const args = {
    runIds: [],
    family: 'medicaid_hhs_offices',
    outputPrefix: 'ca_county_office_refresh_v1',
    runsDir: path.join(process.cwd(), 'data', 'source-acquisition-runs'),
    outputDir: path.join(process.cwd(), 'data', 'generated'),
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'run-ids' && value) args.runIds = value.split(',').map((item) => item.trim()).filter(Boolean);
    if (flag === 'family' && value) args.family = value;
    if (flag === 'output-prefix' && value) args.outputPrefix = value;
    if (flag === 'runs-dir' && value) args.runsDir = path.resolve(value);
    if (flag === 'output-dir' && value) args.outputDir = path.resolve(value);
  }
  return args;
}

function readNdjson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeNdjson(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function summarizeByKey(rows, key) {
  return rows.reduce((acc, row) => {
    const bucket = String(row[key] || 'unknown');
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
}

function buildOutputRow(record, assessment, runId) {
  return {
    runId,
    recordId: record.recordId,
    family: record.gapFamily,
    stateId: record.stateId,
    countyId: record.countyId || '',
    authority: record.authority,
    agency: record.agency,
    provenanceUrl: record.provenanceUrl,
    sourceRole: record.sourceRole,
    sourceUrl: record.sourceUrl,
    finalUrl: record.finalUrl,
    artifactPath: record.artifactPath,
    sha256: record.sha256,
    fetchedAt: record.fetchedAt,
    pageTitle: record.pageTitle,
    entityType: assessment.entityType,
    destinationTable: assessment.destinationTable || '',
    semanticStatus: assessment.semanticStatus,
    classificationReason: assessment.classificationReason,
    confidenceScore: assessment.confidenceScore,
    reasons: assessment.reasons,
    requiredFieldCount: assessment.requiredFieldCount,
    requiredFieldCoveredCount: assessment.requiredFieldCoveredCount,
    requiredFieldCompleteness: assessment.requiredFieldCompleteness,
    unsupportedDefaultedFieldCount: assessment.unsupportedDefaultedFieldCount,
    fieldEvidenceCoverage: assessment.fieldEvidenceCoverage,
    stageDecision: assessment.semanticStatus === 'stage_ready' ? 'stage_ready' : assessment.semanticStatus,
    fieldEntries: assessment.fieldEntries,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.runIds.length) {
    throw new Error('Missing --run-ids=<run-a,run-b>');
  }

  const parsedRecords = [];
  for (const runId of args.runIds) {
    const acceptedPath = path.join(args.runsDir, runId, 'validated', args.family, 'accepted.ndjson');
    const rows = readNdjson(acceptedPath);
    for (const row of rows) parsedRecords.push({ runId, row });
  }

  const outputRows = parsedRecords.map(({ runId, row }) => buildOutputRow(row, evaluateCaliforniaSemanticRecord(row), runId));
  const stageReady = outputRows.filter((row) => row.semanticStatus === 'stage_ready');
  const enrichmentRequired = outputRows.filter((row) => row.semanticStatus === 'enrichment_required');
  const rejected = outputRows.filter((row) => row.semanticStatus === 'rejected' || row.semanticStatus === 'unsupported');

  const base = path.join(args.outputDir, args.outputPrefix);
  writeNdjson(`${base}_validation_results.jsonl`, outputRows);
  writeNdjson(`${base}_stage_ready.jsonl`, stageReady);
  writeNdjson(`${base}_enrichment_required.jsonl`, enrichmentRequired);
  writeNdjson(`${base}_rejected.jsonl`, rejected);

  const summary = {
    generatedAt: new Date().toISOString(),
    runIds: args.runIds,
    family: args.family,
    totalRows: outputRows.length,
    stageReadyCount: stageReady.length,
    enrichmentRequiredCount: enrichmentRequired.length,
    rejectedCount: rejected.length,
    classificationReasons: summarizeByKey(outputRows, 'classificationReason'),
    semanticStatusCounts: summarizeByKey(outputRows, 'semanticStatus'),
  };
  writeJson(`${base}_summary.json`, summary);

  console.log(JSON.stringify(summary, null, 2));
}

main();
