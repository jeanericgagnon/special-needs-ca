import fs from 'node:fs';
import path from 'node:path';
import {
  extractRegionalCenterRoleCandidates,
  readNdjson,
  repoRelativePath,
  writeCsv,
  writeJson,
  writeNdjson,
} from './ca-v1-data-quality-lib.mjs';

const repoRoot = process.cwd();

function parseArgs(argv) {
  const args = {
    runId: 'ca-v3',
    prefix: 'ca_v3',
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

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listDirNames(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

function canonicalFamily(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function rowKey(parts) {
  return parts.map((part) => String(part || '').trim()).join('|');
}

function chooseNextLane(row) {
  const code = String(row.error_code || row.reason || '').toLowerCase();
  const url = String(row.source_url || row.url || '').toLowerCase();
  const status = String(row.fetch_status || '').toLowerCase();
  if (code.includes('blocked') || code.includes('challenge') || code.includes('403')) return 'browser_assisted';
  if (code.includes('author') || status === 'author_first') return 'author_first';
  if (url.includes('/login') || url.includes('/secure') || url.includes('efile')) return 'permanently_blocked';
  return 'repair';
}

function requiredProvenance(entry) {
  return [
    ['authority', entry.authority],
    ['agency', entry.agency],
    ['provenanceUrl', entry.provenanceUrl],
    ['sourceRole', entry.sourceRole],
    ['sourceUrl', entry.sourceUrl],
    ['finalUrl', entry.finalUrl],
    ['artifactPath', entry.artifactPath],
    ['sha256', entry.sha256],
    ['fetchedAt', entry.fetchedAt],
    ['supportingText', entry.supportingText],
    ['supportingPageLocation', entry.supportingPageLocation],
  ];
}

function missingProvenanceFields(entry) {
  return requiredProvenance(entry).filter(([, value]) => !String(value || '').trim()).map(([field]) => field);
}

function summarizeFamilies(familyRows) {
  return familyRows.reduce((accumulator, row) => {
    accumulator[row.family] = (accumulator[row.family] || 0) + 1;
    return accumulator;
  }, {});
}

function relativizeValue(value) {
  if (Array.isArray(value)) return value.map((item) => relativizeValue(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, relativizeValue(inner)]));
  }
  if (typeof value === 'string' && value.startsWith(repoRoot)) {
    return repoRelativePath(value);
  }
  return value;
}

const args = parseArgs(process.argv.slice(2));
const runDir = path.join(repoRoot, 'data', 'source-acquisition-runs', args.runId);
const generatedDir = path.join(repoRoot, 'data', 'generated');
const parsedRoot = path.join(runDir, 'parsed');
const validatedRoot = path.join(runDir, 'validated');
const stagedRoot = path.join(runDir, 'staged');
const rawResultsPath = path.join(generatedDir, 'ca_scrape_results_v1.jsonl');
const rawFailuresPath = path.join(generatedDir, 'ca_fetch_failures_v1.jsonl');
const rawBlockedPath = path.join(generatedDir, 'ca_blocked_targets_v1.jsonl');
const rawRepairPath = path.join(generatedDir, 'ca_repair_targets_v1.jsonl');
const rawAuthorFirstPath = path.join(generatedDir, 'ca_author_first_targets_v1.jsonl');
const browserAssistPath = path.join(runDir, 'followups', 'author-browser-assisted.json');

const outputPaths = {
  validationResults: path.join(generatedDir, `${args.prefix}_validation_results.jsonl`),
  stageReady: path.join(generatedDir, `${args.prefix}_stage_ready.jsonl`),
  rejected: path.join(generatedDir, `${args.prefix}_rejected.jsonl`),
  blockedFollowups: path.join(generatedDir, `${args.prefix}_blocked_followups.jsonl`),
  fieldCompleteness: path.join(generatedDir, `${args.prefix}_field_completeness.csv`),
  auditJson: path.join(generatedDir, `${args.prefix}_post_stage_audit.json`),
  auditMd: path.join(generatedDir, `${args.prefix}_post_stage_audit.md`),
  regionalCenterReviewed: path.join(generatedDir, `${args.prefix}_regional_center_reviewed_candidates.jsonl`),
};

const parsedRecords = [];
for (const familyDir of listDirNames(parsedRoot)) {
  const family = canonicalFamily(familyDir);
  for (const row of readNdjson(path.join(parsedRoot, familyDir, 'records.ndjson'))) {
    parsedRecords.push({
      ...row,
      gapFamily: family,
      artifactPath: row.artifactPath || (row.savedPath ? repoRelativePath(row.savedPath) : ''),
      provenanceUrl: row.provenanceUrl || row.finalUrl || row.sourceUrl || '',
      sourceRole: row.sourceRole || '',
      authority: row.authority || '',
      agency: row.agency || '',
      fetchedAt: row.fetchedAt || '',
      sha256: row.sha256 || '',
    });
  }
}

const parsedMap = new Map(parsedRecords.map((row) => [row.recordId, row]));

const acceptedMap = new Map();
const rejectedValidationMap = new Map();
for (const familyDir of listDirNames(validatedRoot)) {
  const family = canonicalFamily(familyDir);
  for (const row of readNdjson(path.join(validatedRoot, familyDir, 'accepted.ndjson'))) {
    acceptedMap.set(row.recordId, { ...row, gapFamily: family });
  }
  for (const row of readNdjson(path.join(validatedRoot, familyDir, 'rejected.ndjson'))) {
    rejectedValidationMap.set(row.recordId, { ...row, gapFamily: family });
  }
}

const stagedMap = new Map();
const unsupportedMap = new Map();
for (const familyDir of listDirNames(stagedRoot)) {
  const family = canonicalFamily(familyDir);
  for (const row of readNdjson(path.join(stagedRoot, familyDir, 'promotion-candidates.ndjson'))) {
    stagedMap.set(row.recordId, { ...row, family });
  }
  for (const row of readNdjson(path.join(stagedRoot, familyDir, 'unsupported-candidates.ndjson'))) {
    unsupportedMap.set(row.recordId, { ...row, family });
  }
}

const validationResults = [];
const stageReadyRows = [];
const rejectedRows = [];
const fieldCompletenessRows = [];

for (const parsed of parsedRecords) {
  const accepted = acceptedMap.get(parsed.recordId);
  const rejected = rejectedValidationMap.get(parsed.recordId);
  const stageSupported = stagedMap.get(parsed.recordId);
  const stageUnsupported = unsupportedMap.get(parsed.recordId);
  const validationStatus = accepted ? 'accepted' : rejected ? 'rejected' : 'missing_validation_result';
  const supportingText = String(parsed.textSample || parsed.familyExtraction?.serviceSummary || parsed.metaDescription || '').slice(0, 500);
  const supportingPageLocation = parsed.h1s?.[0] || parsed.pageTitle || parsed.familyExtraction?.recordType || '';
  const normalized = {
    runId: args.runId,
    recordId: parsed.recordId,
    family: canonicalFamily(parsed.gapFamily),
    authority: parsed.authority || '',
    agency: parsed.agency || '',
    provenanceUrl: parsed.provenanceUrl || parsed.finalUrl || parsed.sourceUrl || '',
    sourceRole: parsed.sourceRole || '',
    sourceUrl: parsed.sourceUrl || '',
    finalUrl: parsed.finalUrl || parsed.sourceUrl || '',
    artifactPath: parsed.artifactPath || '',
    sha256: parsed.sha256 || '',
    fetchedAt: parsed.fetchedAt || '',
    supportingText,
    supportingPageLocation,
    validationStatus,
    validationReasons: rejected?.validationReasons || rejected?.validation_reasons || rejected?.reasons || [],
    parsedAt: parsed.parsedAt,
    parsedTitle: parsed.pageTitle || '',
    targetTable: stageSupported?.candidate?.targetTable || stageUnsupported?.candidate?.targetTable || '',
    stagingStatus: stageSupported ? 'staged' : stageUnsupported ? 'unsupported' : accepted ? 'missing_stage_decision' : 'not_accepted',
  };
  validationResults.push(normalized);

  const missingFields = missingProvenanceFields(normalized);
  if (stageSupported) {
    if (missingFields.length) {
      rejectedRows.push({
        ...normalized,
        rejectionStage: 'staging',
        rejectionReasons: missingFields.map((field) => `missing_provenance_${field}`),
      });
    } else {
      stageReadyRows.push({
        ...normalized,
        targetTable: stageSupported.candidate?.targetTable || '',
        stagingTable: stageSupported.candidate?.stagingTable || '',
        stagedRow: stageSupported.candidate?.row || {},
      });
    }
  }

  if (rejected) {
    rejectedRows.push({
      ...normalized,
      rejectionStage: 'validation',
      rejectionReasons: normalized.validationReasons,
    });
  }
  if (stageUnsupported) {
    rejectedRows.push({
      ...normalized,
      rejectionStage: 'staging',
      rejectionReasons: ['unsupported_staging_mapping'],
    });
  }

  for (const [field, value] of requiredProvenance(normalized)) {
    fieldCompletenessRows.push({
      family: normalized.family,
      recordId: normalized.recordId,
      field,
      hasValue: String(value || '').trim() ? 1 : 0,
      stageReady: stageSupported && !missingFields.length ? 1 : 0,
    });
  }
}

const blockedFollowupsMap = new Map();
const browserAssistRows = fs.existsSync(browserAssistPath) ? readNdjson(browserAssistPath) : [];
for (const row of readNdjson(rawBlockedPath)) {
  const normalized = {
    runId: args.runId,
    family: canonicalFamily(
      row.discovered_target?.gap_family
      || row.gap_family
      || (row.batch_class === 'directory_root' ? 'medicaid_hhs_offices' : 'general_gap_fill')
    ),
    entityId: row.entity_id,
    sourceRole: row.source_role,
    sourceUrl: row.url,
    finalUrl: row.final_url || row.url,
    artifactPath: row.saved_path ? repoRelativePath(row.saved_path) : '',
    sha256: row.sha256 || '',
    fetchedAt: row.fetched_at || '',
    reason: row.error_code || row.fetch_status,
    nextLane: chooseNextLane(row),
  };
  blockedFollowupsMap.set(rowKey([normalized.entityId, normalized.sourceRole, normalized.sourceUrl]), normalized);
}
for (const row of readNdjson(rawFailuresPath)) {
  const normalized = {
    runId: args.runId,
    family: 'general_gap_fill',
    entityId: row.entity_id,
    sourceRole: row.source_role,
    sourceUrl: row.url,
    finalUrl: row.final_url || row.url,
    artifactPath: row.saved_path ? repoRelativePath(row.saved_path) : '',
    sha256: row.sha256 || '',
    fetchedAt: row.fetched_at || '',
    reason: row.error_code || row.fetch_status,
    nextLane: chooseNextLane(row),
  };
  blockedFollowupsMap.set(rowKey([normalized.entityId, normalized.sourceRole, normalized.sourceUrl]), normalized);
}
for (const row of browserAssistRows) {
  const normalized = {
    runId: args.runId,
    family: canonicalFamily(row.gap_family || ''),
    entityId: row.entity_id,
    sourceRole: row.source_role,
    sourceUrl: row.source_url,
    finalUrl: row.final_url || row.source_url,
    artifactPath: row.saved_path ? repoRelativePath(row.saved_path) : '',
    sha256: '',
    fetchedAt: '',
    reason: row.reason || 'browser_assisted_required',
    nextLane: 'browser_assisted',
  };
  blockedFollowupsMap.set(rowKey([normalized.entityId, normalized.sourceRole, normalized.sourceUrl]), normalized);
}
for (const row of readNdjson(rawRepairPath)) {
  const normalized = {
    runId: args.runId,
    family: canonicalFamily(row.gap_family || ''),
    entityId: row.entity_id,
    sourceRole: row.source_role,
    sourceUrl: row.url || row.source_url,
    finalUrl: row.final_url || row.url || row.source_url,
    artifactPath: '',
    sha256: '',
    fetchedAt: '',
    reason: row.reason || 'repair_ledger',
    nextLane: 'repair',
  };
  blockedFollowupsMap.set(rowKey([normalized.entityId, normalized.sourceRole, normalized.sourceUrl]), normalized);
}
for (const row of readNdjson(rawAuthorFirstPath)) {
  const normalized = {
    runId: args.runId,
    family: canonicalFamily(row.gap_family || ''),
    entityId: row.entity_id,
    sourceRole: row.source_role,
    sourceUrl: row.url || row.source_url,
    finalUrl: row.final_url || row.url || row.source_url,
    artifactPath: '',
    sha256: '',
    fetchedAt: '',
    reason: row.reason || 'author_first_ledger',
    nextLane: 'author_first',
  };
  blockedFollowupsMap.set(rowKey([normalized.entityId, normalized.sourceRole, normalized.sourceUrl]), normalized);
}
const blockedFollowups = Array.from(blockedFollowupsMap.values());

const scrapeResults = readNdjson(rawResultsPath);
const regionalCenterReviewed = [];
for (const row of scrapeResults.filter((item) => /regional_center_root_from_dds_directory/i.test(String(item.source_role || '')) && item.saved_path && fs.existsSync(item.saved_path))) {
  const html = fs.readFileSync(row.saved_path, 'utf8');
  const candidates = extractRegionalCenterRoleCandidates({
    state: row.state,
    entity_id: row.entity_id,
    authority: row.authority,
    agency: row.agency,
    url: row.url,
  }, html);
  for (const candidate of candidates) {
    regionalCenterReviewed.push({
      runId: args.runId,
      family: 'dd_routing',
      regionalCenterEntityId: row.entity_id,
      reviewStatus: 'human_review_required',
      ...candidate,
    });
  }
}

const familyUniverse = Array.from(new Set([
  ...parsedRecords.map((row) => canonicalFamily(row.gapFamily)),
  ...Array.from(acceptedMap.values()).map((row) => canonicalFamily(row.gapFamily)),
  ...Array.from(rejectedValidationMap.values()).map((row) => canonicalFamily(row.gapFamily)),
  ...Array.from(stagedMap.values()).map((row) => canonicalFamily(row.family)),
  ...Array.from(unsupportedMap.values()).map((row) => canonicalFamily(row.family)),
])).sort();

const familySummary = familyUniverse.map((family) => {
  const parsedCount = parsedRecords.filter((row) => canonicalFamily(row.gapFamily) === family).length;
  const acceptedCount = Array.from(acceptedMap.values()).filter((row) => canonicalFamily(row.gapFamily) === family).length;
  const rejectedCount = Array.from(rejectedValidationMap.values()).filter((row) => canonicalFamily(row.gapFamily) === family).length;
  const stagedCount = Array.from(stagedMap.values()).filter((row) => canonicalFamily(row.family) === family).length;
  const unsupportedCount = Array.from(unsupportedMap.values()).filter((row) => canonicalFamily(row.family) === family).length;
  const promotedCount = 0;
  return {
    family,
    parsed: parsedCount,
    accepted: acceptedCount,
    rejected: rejectedCount,
    staged: stagedCount,
    unsupported: unsupportedCount,
    promoted: promotedCount,
    reconciled: acceptedCount === stagedCount + unsupportedCount,
  };
});

const rawSummary = readJson(path.join(generatedDir, 'ca_source_completion_summary_v1.json'), {});
const completenessIssues = fieldCompletenessRows.filter((row) => row.hasValue === 0);
const unresolvedVisible = blockedFollowups.length + rejectedRows.length;
const audit = {
  runId: args.runId,
  californiaComplete: false,
  meaningfulEvidenceFetched: scrapeResults.length,
  documentsParsed: parsedRecords.filter((row) => /pdf/i.test(String(row.contentType || ''))).length,
  validationPassed: Array.from(acceptedMap.keys()).length,
  validationRejected: Array.from(rejectedValidationMap.keys()).length,
  stageReadyCount: stageReadyRows.length,
  unsupportedStageCount: Array.from(unsupportedMap.keys()).length,
  blockedFollowupCount: blockedFollowups.length,
  regionalCenterReviewedCount: regionalCenterReviewed.length,
  provenanceMissingCount: completenessIssues.length,
  familySummary,
  rawCompletionSummary: relativizeValue(rawSummary),
  allAcceptedReconciled: familySummary.every((row) => row.reconciled),
  unresolvedRecordsVisible: unresolvedVisible > 0,
};

writeNdjson(outputPaths.validationResults, validationResults);
writeNdjson(outputPaths.stageReady, stageReadyRows);
writeNdjson(outputPaths.rejected, rejectedRows);
writeNdjson(outputPaths.blockedFollowups, blockedFollowups);
writeNdjson(outputPaths.regionalCenterReviewed, regionalCenterReviewed);
writeCsv(outputPaths.fieldCompleteness, fieldCompletenessRows, ['family', 'recordId', 'field', 'hasValue', 'stageReady']);
writeJson(outputPaths.auditJson, audit);
fs.writeFileSync(outputPaths.auditMd, [
  `# California Post-Stage Audit (${args.runId})`,
  '',
  `- Meaningful evidence fetched: \`${audit.meaningfulEvidenceFetched}\``,
  `- Documents parsed: \`${audit.documentsParsed}\``,
  `- Validation passed: \`${audit.validationPassed}\``,
  `- Validation rejected: \`${audit.validationRejected}\``,
  `- Stage-ready records: \`${audit.stageReadyCount}\``,
  `- Unsupported stage records: \`${audit.unsupportedStageCount}\``,
  `- Blocked followups: \`${audit.blockedFollowupCount}\``,
  `- Regional Center reviewed candidates: \`${audit.regionalCenterReviewedCount}\``,
  `- Accepted counts reconciled: \`${audit.allAcceptedReconciled}\``,
  `- California complete: \`${audit.californiaComplete}\``,
  '',
  '## Family Summary',
  '',
  '| family | parsed | accepted | rejected | staged | unsupported | promoted | reconciled |',
  '|---|---:|---:|---:|---:|---:|---:|---|',
  ...familySummary.map((row) => `| ${row.family} | ${row.parsed} | ${row.accepted} | ${row.rejected} | ${row.staged} | ${row.unsupported} | ${row.promoted} | ${row.reconciled} |`),
  '',
].join('\n'));

console.log(JSON.stringify({
  ok: true,
  runId: args.runId,
  validationResults: validationResults.length,
  stageReady: stageReadyRows.length,
  rejected: rejectedRows.length,
  blockedFollowups: blockedFollowups.length,
  regionalCenterReviewed: regionalCenterReviewed.length,
  familySummary: summarizeFamilies(validationResults),
}, null, 2));
