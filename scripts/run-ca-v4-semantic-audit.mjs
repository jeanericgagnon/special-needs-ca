import fs from 'node:fs';
import path from 'node:path';
import {
  readNdjson,
  repoRelativePath,
  writeJson,
  writeNdjson,
} from './ca-v1-data-quality-lib.mjs';
import { evaluateCaliforniaSemanticRecord } from './ca-v4-semantic-lib.mjs';

const repoRoot = process.cwd();

function parseArgs(argv) {
  const args = {
    runId: 'ca-v3',
    prefix: 'ca_v4',
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'run-id' && value) args.runId = value;
    if (flag === 'prefix' && value) args.prefix = value;
  }
  return args;
}

function canonicalFamily(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function listFamilyDirs(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function normalized(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildValidationRow(parsed, assessment, runId) {
  return {
    runId,
    recordId: parsed.recordId,
    family: canonicalFamily(parsed.gapFamily),
    stateId: parsed.stateId || '',
    authority: parsed.authority || '',
    agency: parsed.agency || '',
    provenanceUrl: parsed.provenanceUrl || parsed.finalUrl || parsed.sourceUrl || '',
    sourceRole: parsed.sourceRole || '',
    sourceUrl: parsed.sourceUrl || '',
    finalUrl: parsed.finalUrl || parsed.sourceUrl || '',
    artifactPath: parsed.artifactPath || (parsed.savedPath ? repoRelativePath(parsed.savedPath) : ''),
    sha256: parsed.sha256 || '',
    fetchedAt: parsed.fetchedAt || '',
    pageTitle: parsed.pageTitle || '',
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
  };
}

function buildStageRow(parsed, validation, assessment) {
  return {
    ...validation,
    stageDecision: 'stage_ready',
    fieldEvidenceCoverage: assessment.fieldEvidenceCoverage,
    fieldEntries: assessment.fieldEntries,
  };
}

function buildEnrichmentRow(parsed, validation, assessment) {
  return {
    ...validation,
    stageDecision: 'enrichment_required',
    fieldEntries: assessment.fieldEntries,
  };
}

function buildRejectedRow(parsed, validation, assessment) {
  return {
    ...validation,
    stageDecision: validation.semanticStatus,
    fieldEntries: assessment.fieldEntries,
  };
}

function buildFieldEvidenceRows(parsed, assessment) {
  return assessment.fieldEntries.map((entry) => ({
    recordId: parsed.recordId,
    family: canonicalFamily(parsed.gapFamily),
    stateId: parsed.stateId || '',
    entityType: assessment.entityType,
    destinationTable: assessment.destinationTable || '',
    semanticStatus: assessment.semanticStatus,
    confidenceScore: assessment.confidenceScore,
    field: entry.field,
    value: entry.value,
    covered: entry.covered ? 1 : 0,
    evidenceText: entry.evidenceText,
    pageLocation: entry.pageLocation,
    evidenceSource: entry.source,
    sourceRole: parsed.sourceRole || '',
    sourceUrl: parsed.sourceUrl || '',
    finalUrl: parsed.finalUrl || parsed.sourceUrl || '',
    artifactPath: parsed.artifactPath || (parsed.savedPath ? repoRelativePath(parsed.savedPath) : ''),
  }));
}

function summarizeByKey(rows, key) {
  return rows.reduce((accumulator, row) => {
    const bucket = row[key] || 'unknown';
    accumulator[bucket] = (accumulator[bucket] || 0) + 1;
    return accumulator;
  }, {});
}

function computePercent(numerator, denominator) {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

function buildFamilyAudit(family, rows) {
  const stageReady = rows.filter((row) => row.semanticStatus === 'stage_ready').length;
  const enrichmentRequired = rows.filter((row) => row.semanticStatus === 'enrichment_required').length;
  const unsupported = rows.filter((row) => row.semanticStatus === 'unsupported').length;
  const rejected = rows.filter((row) => row.semanticStatus === 'rejected').length;
  const avgRequiredCompleteness = rows.length
    ? Number((rows.reduce((sum, row) => sum + Number(row.requiredFieldCompleteness || 0), 0) / rows.length).toFixed(2))
    : 0;
  const avgFieldEvidenceCoverage = rows.length
    ? Number((rows.reduce((sum, row) => sum + Number(row.fieldEvidenceCoverage || 0), 0) / rows.length).toFixed(2))
    : 0;
  const unsupportedDefaultedFieldCount = rows.reduce((sum, row) => sum + Number(row.unsupportedDefaultedFieldCount || 0), 0);
  return {
    family,
    total: rows.length,
    stageReadyCount: stageReady,
    enrichmentRequiredCount: enrichmentRequired,
    unsupportedCount: unsupported,
    rejectedCount: rejected,
    promotedCount: 0,
    averageRequiredFieldCompleteness: avgRequiredCompleteness,
    averageFieldEvidenceCoverage: avgFieldEvidenceCoverage,
    unsupportedDefaultedFieldCount,
    entityTypes: summarizeByKey(rows, 'entityType'),
    destinationTables: summarizeByKey(rows, 'destinationTable'),
    classificationReasons: summarizeByKey(rows, 'classificationReason'),
  };
}

function buildMarkdownAudit(audit) {
  const familyLines = audit.familyAudits.map((family) => (
    `| ${family.family} | ${family.total} | ${family.stageReadyCount} | ${family.enrichmentRequiredCount} | ${family.unsupportedCount} | ${family.rejectedCount} | ${family.promotedCount} | ${family.averageRequiredFieldCompleteness} | ${family.averageFieldEvidenceCoverage} | ${family.unsupportedDefaultedFieldCount} |`
  ));

  return [
    '# California CA-v4 Post-Stage Audit',
    '',
    `- Parsed records: \`${audit.parsedRecordCount}\``,
    `- Validation results: \`${audit.validationResultCount}\``,
    `- Stage-ready: \`${audit.stageReadyCount}\``,
    `- Enrichment required: \`${audit.enrichmentRequiredCount}\``,
    `- Unsupported: \`${audit.unsupportedCount}\``,
    `- Rejected: \`${audit.rejectedCount}\``,
    `- Promoted: \`${audit.promotedCount}\``,
    `- Correct entity type count: \`${audit.correctEntityTypeCount}\``,
    `- Required-field completeness average: \`${audit.requiredFieldCompletenessAverage}\``,
    `- Field-evidence coverage average: \`${audit.fieldEvidenceCoverageAverage}\``,
    '',
    '## Family Audit',
    '',
    '| Family | Total | Stage-ready | Enrichment required | Unsupported | Rejected | Promoted | Avg required completeness | Avg field evidence | Unsupported/defaulted fields |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...familyLines,
    '',
    '## Completion Rule',
    '',
    audit.californiaComplete
      ? 'California is complete under the CA-v4 semantic audit.'
      : 'California is not complete under the CA-v4 semantic audit because unresolved enrichment, unsupported, or rejected records remain visible.',
    '',
  ].join('\n');
}

const args = parseArgs(process.argv.slice(2));
const runDir = path.join(repoRoot, 'data', 'source-acquisition-runs', args.runId);
const parsedRoot = path.join(runDir, 'parsed');
const generatedDir = path.join(repoRoot, 'data', 'generated');

const outputPaths = {
  validation: path.join(generatedDir, `${args.prefix}_validation_results.jsonl`),
  stageReady: path.join(generatedDir, `${args.prefix}_stage_ready.jsonl`),
  enrichmentRequired: path.join(generatedDir, `${args.prefix}_enrichment_required.jsonl`),
  rejected: path.join(generatedDir, `${args.prefix}_rejected.jsonl`),
  fieldEvidence: path.join(generatedDir, `${args.prefix}_field_evidence.jsonl`),
  auditJson: path.join(generatedDir, `${args.prefix}_post_stage_audit.json`),
  auditMd: path.join(generatedDir, `${args.prefix}_post_stage_audit.md`),
};

const parsedRecords = [];
for (const familyDir of listFamilyDirs(parsedRoot)) {
  const recordsPath = path.join(parsedRoot, familyDir, 'records.ndjson');
  if (!fs.existsSync(recordsPath)) continue;
  for (const row of readNdjson(recordsPath)) {
    parsedRecords.push({
      ...row,
      gapFamily: canonicalFamily(row.gapFamily || familyDir),
    });
  }
}

const validationResults = [];
const stageReadyRows = [];
const enrichmentRequiredRows = [];
const rejectedRows = [];
const fieldEvidenceRows = [];

for (const parsed of parsedRecords) {
  const assessment = evaluateCaliforniaSemanticRecord(parsed);
  const validation = buildValidationRow(parsed, assessment, args.runId);
  validationResults.push(validation);
  fieldEvidenceRows.push(...buildFieldEvidenceRows(parsed, assessment));

  if (assessment.semanticStatus === 'stage_ready') {
    stageReadyRows.push(buildStageRow(parsed, validation, assessment));
  } else if (assessment.semanticStatus === 'enrichment_required') {
    enrichmentRequiredRows.push(buildEnrichmentRow(parsed, validation, assessment));
  } else {
    rejectedRows.push(buildRejectedRow(parsed, validation, assessment));
  }
}

const familyAudits = Object.entries(
  validationResults.reduce((accumulator, row) => {
    if (!accumulator[row.family]) accumulator[row.family] = [];
    accumulator[row.family].push(row);
    return accumulator;
  }, {})
).map(([family, rows]) => buildFamilyAudit(family, rows));

const requiredCompletenessAverage = validationResults.length
  ? Number((validationResults.reduce((sum, row) => sum + Number(row.requiredFieldCompleteness || 0), 0) / validationResults.length).toFixed(2))
  : 0;
const fieldEvidenceCoverageAverage = validationResults.length
  ? Number((validationResults.reduce((sum, row) => sum + Number(row.fieldEvidenceCoverage || 0), 0) / validationResults.length).toFixed(2))
  : 0;

const audit = {
  runId: args.runId,
  parsedRecordCount: parsedRecords.length,
  validationResultCount: validationResults.length,
  stageReadyCount: stageReadyRows.length,
  enrichmentRequiredCount: enrichmentRequiredRows.length,
  unsupportedCount: rejectedRows.filter((row) => row.semanticStatus === 'unsupported').length,
  rejectedCount: rejectedRows.filter((row) => row.semanticStatus === 'rejected').length,
  promotedCount: 0,
  correctEntityTypeCount: validationResults.filter((row) => row.destinationTable || row.semanticStatus !== 'stage_ready').length,
  requiredFieldCompletenessAverage: requiredCompletenessAverage,
  fieldEvidenceCoverageAverage,
  familyAudits,
  semanticStatusCounts: summarizeByKey(validationResults, 'semanticStatus'),
  destinationTableCounts: summarizeByKey(validationResults, 'destinationTable'),
  entityTypeCounts: summarizeByKey(validationResults, 'entityType'),
  currentPercentStageReady: computePercent(stageReadyRows.length, validationResults.length),
  californiaComplete: false,
  completionReason: 'Meaningful parsed records still require enrichment or remain unsupported/rejected; no promotion performed in ca-v4.',
  artifacts: Object.fromEntries(Object.entries(outputPaths).map(([key, filePath]) => [key, repoRelativePath(filePath)])),
};

writeNdjson(outputPaths.validation, validationResults);
writeNdjson(outputPaths.stageReady, stageReadyRows);
writeNdjson(outputPaths.enrichmentRequired, enrichmentRequiredRows);
writeNdjson(outputPaths.rejected, rejectedRows);
writeNdjson(outputPaths.fieldEvidence, fieldEvidenceRows);
writeJson(outputPaths.auditJson, audit);
fs.writeFileSync(outputPaths.auditMd, `${buildMarkdownAudit(audit)}\n`);

console.log(JSON.stringify({
  runId: args.runId,
  parsed: audit.parsedRecordCount,
  stageReady: audit.stageReadyCount,
  enrichmentRequired: audit.enrichmentRequiredCount,
  unsupported: audit.unsupportedCount,
  rejected: audit.rejectedCount,
  promoted: audit.promotedCount,
  audit: repoRelativePath(outputPaths.auditJson),
}, null, 2));
