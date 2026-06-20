import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  extractRegionalCenterRoleCandidates,
  hasFieldLevelProvenance,
  isFalseHttp200Challenge,
  readNdjson,
  repoRelativePath,
  repoRoot,
  validateCountyIhssCandidate,
  writeCsv,
  writeJson,
  writeNdjson,
  classifyRepairLane,
} from './ca-v1-data-quality-lib.mjs';
import {
  parseFamilyRecord,
  validateFamilyRecord,
} from './source-acquisition-lightweight-lib.mjs';
import {
  buildPromotionCandidate,
} from './source-acquisition-stage-lib.mjs';

const RUN_ID = 'ca-v1';
const runDir = path.join(repoRoot, 'data', 'source-acquisition-runs', RUN_ID);
const generatedDir = path.join(repoRoot, 'data', 'generated');
const completedRowsPath = path.join(runDir, 'checkpoints', 'ca-completed-rows.ndjson');
const parseReadyOutputPath = path.join(runDir, 'followups', 'parse-ready-remediated-v2.json');
const browserAssistedOutputPath = path.join(runDir, 'followups', 'author-browser-assisted-v2.json');
const discoveredAcceptedPath = path.join(generatedDir, 'ca_discovered_targets_accepted_v2.jsonl');
const discoveredRejectedPath = path.join(generatedDir, 'ca_discovered_targets_rejected_v2.jsonl');
const discoveredManualPath = path.join(generatedDir, 'ca_discovered_targets_manual_review_v2.jsonl');
const validationFailuresPath = path.join(generatedDir, 'ca_validation_failures_v2.jsonl');
const stageReadyPath = path.join(generatedDir, 'ca_stage_ready_v2.jsonl');
const auditJsonPath = path.join(generatedDir, 'ca_data_quality_audit_v2.json');
const auditMarkdownPath = path.join(generatedDir, 'ca_data_quality_audit_v2.md');
const completenessCsvPath = path.join(generatedDir, 'ca_field_completeness_v2.csv');
const repairQueuePath = path.join(generatedDir, 'ca_repair_followup_queue_v2.jsonl');
const validatedRoot = path.join(runDir, 'validated');
const stagedRoot = path.join(runDir, 'staged');

const PYTHON = path.join(process.env.HOME || '', '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'python', 'bin', 'python3');

function loadBodyText(row) {
  if (!row.saved_path || !fs.existsSync(row.saved_path)) return '';
  if (row.parser_class !== 'html') return '';
  return fs.readFileSync(row.saved_path, 'utf8');
}

function extractPdfMetadata(savedPath) {
  const program = [
    'import json, re, sys',
    'from pypdf import PdfReader',
    'reader = PdfReader(sys.argv[1])',
    'texts = []',
    'for page in reader.pages[:8]:',
    '    texts.append(page.extract_text() or "")',
    'text = "\\n".join(texts)',
    'lines = [line.strip() for line in text.splitlines() if line.strip()]',
    'headings = []',
    'for line in lines:',
    '    if len(headings) >= 8: break',
    '    if len(line) <= 120:',
    '        headings.append(line)',
    'title = lines[0] if lines else ""',
    "form_number_match = re.search(r'\\b([A-Z]{2,5}\\s?-?\\d{2,5}[A-Z]?)\\b', text)",
    "revision_match = re.search(r'(?i)(revised?|rev\\.?|revision date)\\s*[:\\-]?\\s*([A-Za-z]+\\s+\\d{4}|\\d{1,2}/\\d{1,2}/\\d{2,4}|[A-Za-z]+\\s+\\d{1,2},\\s*\\d{4})', text)",
    "deadline_match = re.search(r'(?i)(within\\s+\\d+\\s+days|deadline[:\\s].{0,60}|must be submitted.{0,60})', text)",
    "submit_url_match = re.search(r'https?://\\S+', text)",
    "address_match = re.search(r'\\d{1,6}[^\\n,]{0,80},\\s*[A-Za-z .\\'-]+,\\s*[A-Z]{2}\\s+\\d{5}(?:-\\d{4})?', text)",
    "agency_match = re.search(r'(?i)(department of [A-Za-z ]+|state of california[^\\n]{0,80}|developmental services|health care services|department of social services)', text)",
    'payload = {',
    '  "pageCount": len(reader.pages),',
    '  "title": title,',
    '  "formNumber": form_number_match.group(1) if form_number_match else "",',
    '  "revisionDate": revision_match.group(2) if revision_match else "",',
    '  "issuingAgency": agency_match.group(1) if agency_match else "",',
    '  "majorHeadings": headings[:8],',
    '  "firstMeaningfulText": "\\n".join(lines[:8]),',
    '  "detectedDeadline": deadline_match.group(1) if deadline_match else "",',
    '  "detectedSubmissionTarget": (submit_url_match.group(0) if submit_url_match else "") or (address_match.group(0) if address_match else ""),',
    '}',
    'print(json.dumps(payload))',
  ].join('\n');
  const result = spawnSync(PYTHON, ['-c', program, savedPath], { encoding: 'utf8', maxBuffer: 4_000_000 });
  if (result.status !== 0) {
    return {
      pageCount: 0,
      title: path.basename(savedPath),
      formNumber: '',
      revisionDate: '',
      issuingAgency: '',
      majorHeadings: [],
      firstMeaningfulText: '',
      detectedDeadline: '',
      detectedSubmissionTarget: '',
      parseError: (result.stderr || result.stdout || '').trim(),
    };
  }
  return JSON.parse(result.stdout.trim());
}

function countBy(rows, getKey) {
  const counts = new Map();
  for (const row of rows) {
    const key = getKey(row);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

const completedRows = readNdjson(completedRowsPath);
const completedBySavedPath = new Map(
  completedRows
    .filter((row) => row.saved_path)
    .map((row) => [row.saved_path, row]),
);
const htmlHashes = countBy(
  completedRows.filter((row) => row.parser_class === 'html' && row.sha256),
  (row) => row.sha256,
);

const meaningfulRows = [];
const challengeRows = [];
const repairFollowups = [];
const browserAssistedRows = [];
const pdfParsedRows = [];

for (const row of completedRows) {
  const artifactPath = row.saved_path ? repoRelativePath(row.saved_path) : '';
  const bodyText = loadBodyText(row);
  const repeatedHashCount = htmlHashes.get(row.sha256) || 0;
  const falseChallenge = isFalseHttp200Challenge(row, bodyText, repeatedHashCount);
  if (falseChallenge) {
    const blockedRow = {
      ...row,
      fetch_status: 'blocked',
      error_code: 'blocked_challenge',
      error_message: 'semantic_http_200_challenge',
      artifact_path: artifactPath,
      run_id: RUN_ID,
    };
    challengeRows.push(blockedRow);
    repairFollowups.push({
      run_id: RUN_ID,
      entity_id: row.entity_id,
      source_role: row.source_role,
      source_url: row.url,
      final_url: row.final_url,
      reason: 'blocked_challenge',
      next_lane: classifyRepairLane(row, 'blocked_challenge'),
      artifact_path: artifactPath,
      sha256: row.sha256,
      byte_count: row.byte_count,
    });
    browserAssistedRows.push({
      run_id: RUN_ID,
      entity_id: row.entity_id,
      source_role: row.source_role,
      source_url: row.url,
      final_url: row.final_url,
      artifact_path: artifactPath,
      reason: 'false_http_200_challenge',
      next_lane: 'author_browser_assisted',
      sha256: row.sha256,
      byte_count: row.byte_count,
    });
    continue;
  }
  if (row.fetch_status === 'failed' || row.fetch_status === 'blocked') {
    repairFollowups.push({
      run_id: RUN_ID,
      entity_id: row.entity_id,
      source_role: row.source_role,
      source_url: row.url,
      final_url: row.final_url,
      reason: row.error_code || row.fetch_status,
      next_lane: classifyRepairLane(row, row.error_code || row.fetch_status),
      artifact_path: artifactPath,
      sha256: row.sha256,
      byte_count: row.byte_count,
    });
    continue;
  }
  if (row.fetch_status === 'fetched_unparsed' && row.parser_class === 'pdf' && row.saved_path && fs.existsSync(row.saved_path)) {
    pdfParsedRows.push({
      ...row,
      run_id: RUN_ID,
      artifact_path: artifactPath,
      pdfMetadata: extractPdfMetadata(row.saved_path),
    });
  }
  meaningfulRows.push({
    ...row,
    run_id: RUN_ID,
    artifact_path: artifactPath,
  });
}

const discoveredBase = readNdjson(path.join(generatedDir, 'ca_discovered_target_queue_v1.jsonl'));
const discoveredAccepted = [];
const discoveredRejected = [];
const discoveredManual = [];

for (const candidate of discoveredBase) {
  const candidateWithRun = { ...candidate, run_id: RUN_ID };
  if (candidate.entity_id.startsWith('county-ihss-')) {
    const verdict = validateCountyIhssCandidate(candidate);
    if (verdict.decision === 'accepted') discoveredAccepted.push({ ...candidateWithRun, decision_reason: verdict.reason });
    else if (verdict.decision === 'rejected') discoveredRejected.push({ ...candidateWithRun, decision_reason: verdict.reason });
    else discoveredManual.push({ ...candidateWithRun, decision_reason: verdict.reason });
  } else if (candidate.entity_id.includes('regional-center')) {
    discoveredManual.push({ ...candidateWithRun, decision_reason: 'regional_center_requires_role_specific_review' });
  } else {
    discoveredManual.push({ ...candidateWithRun, decision_reason: 'generic_discovery_requires_human_review' });
  }
}

const regionalRootRows = completedRows.filter((row) => (
  row.fetch_status === 'fetched'
  && row.parser_class === 'html'
  && /regional_center_root_from_dds_directory/i.test(`${row.source_role || ''}`)
));
for (const row of regionalRootRows) {
  const html = loadBodyText(row);
  for (const candidate of extractRegionalCenterRoleCandidates(row, html)) {
    discoveredManual.push({ ...candidate, run_id: RUN_ID, decision_reason: 'regional_center_role_candidate_manual_review' });
  }
}

const remediatedParseReadyRows = [];
for (const row of meaningfulRows) {
  const absoluteSavedPath = row.saved_path;
  const gapFamily = (() => {
    const joined = `${row.entity_id} ${row.source_role}`.toLowerCase();
    if (row.batch_class === 'directory_root') {
      if (joined.includes('regional_center') || joined.includes('regional-center')) return 'dd_routing';
      if (joined.includes('selpa') || joined.includes('school') || joined.includes('district')) return 'education_routing';
      return 'medicaid_hhs_offices';
    }
    if (joined.includes('form') || joined.includes('_pdf') || joined.includes('catalog')) return 'forms_guides';
    if (joined.includes('waiver') || joined.includes('hcbs') || joined.includes('hcba') || joined.includes('wpcs')) return 'waivers';
    if (joined.includes('appeal') || joined.includes('complaint') || joined.includes('hearing')) return 'programs_benefits';
    if (joined.includes('special-education') || joined.includes('iep') || joined.includes('selpa') || joined.includes('school')) return 'education_routing';
    if (joined.includes('regional-center') || joined.includes('early-start') || joined.includes('dds') || joined.includes('developmental')) return 'dd_routing';
    if (joined.includes('legal') || joined.includes('court') || joined.includes('bar')) return 'advocates_legal';
    return 'general_gap_fill';
  })();
  const isDhcsFalseLane = /department of health care services|dhcs/i.test(`${row.agency} ${row.entity_id} ${row.source_role}`)
    && row.parser_class === 'html'
    && !new Set(['fair_hearing_and_aid_paid_pending', 'fee_for_service_complaint', 'fee_for_service_appeal']).has(row.source_role);
  if (isDhcsFalseLane) {
    browserAssistedRows.push({
      run_id: RUN_ID,
      entity_id: row.entity_id,
      source_role: row.source_role,
      source_url: row.url,
      final_url: row.final_url,
      artifact_path: row.artifact_path,
      reason: 'dhcs_false_parse_ready_row',
      next_lane: 'author_browser_assisted',
      sha256: row.sha256,
      byte_count: row.byte_count,
    });
    continue;
  }
  remediatedParseReadyRows.push({
    runId: RUN_ID,
    stateId: 'california',
    stateCode: row.state,
    gapFamily,
    sourceFamily: 'california_source_pack',
    sourceRole: row.source_role,
    sourceUrl: row.url,
    finalUrl: row.final_url,
    provenanceUrl: row.provenance_url || '',
    authority: row.authority,
    agency: row.agency,
    sourceName: `${row.agency} ${row.source_role}`.trim(),
    savedPath: absoluteSavedPath,
    artifactPath: row.artifact_path,
    batchClass: row.batch_class,
    parserClass: row.parser_class,
    contentType: row.content_type,
    entityId: row.entity_id,
    originalStatus: row.original_status,
    fetchedAt: row.fetched_at,
    sha256: row.sha256,
    byteCount: row.byte_count,
  });
}

writeJson(parseReadyOutputPath, remediatedParseReadyRows);
writeNdjson(browserAssistedOutputPath, browserAssistedRows);
writeNdjson(discoveredAcceptedPath, discoveredAccepted);
writeNdjson(discoveredRejectedPath, discoveredRejected);
writeNdjson(discoveredManualPath, discoveredManual);
writeNdjson(repairQueuePath, repairFollowups);

const parsedRecords = [];
let validationFailures = [];
let stageReady = [];

for (const row of remediatedParseReadyRows) {
  let html = '';
  if (row.parserClass === 'pdf') {
    const pdfRecord = pdfParsedRows.find((record) => record.entity_id === row.entityId && record.source_role === row.sourceRole && record.final_url === row.finalUrl);
    if (pdfRecord) {
      const meta = pdfRecord.pdfMetadata;
      html = `<html><head><title>${meta.title}</title></head><body><h1>${meta.title}</h1><p>${meta.firstMeaningfulText}</p></body></html>`;
    }
  } else {
    html = fs.readFileSync(row.savedPath, 'utf8');
  }
  const parsed = parseFamilyRecord(row, html);
  parsedRecords.push(parsed);
  const validation = validateFamilyRecord(parsed);
  if (!validation.isAccepted) {
    validationFailures.push({
      run_id: RUN_ID,
      record_id: parsed.recordId,
      gap_family: parsed.gapFamily,
      source_url: parsed.sourceUrl,
      artifact_path: row.artifactPath,
      reasons: validation.reasons,
      fetched_at: row.fetchedAt,
      content_hash: row.sha256,
    });
    continue;
  }
  const candidate = buildPromotionCandidate(parsed);
  const supportingText = parsed.familyExtraction?.serviceSummary
    || parsed.familyExtraction?.summaryText
    || parsed.textSample
    || parsed.pageTitle
    || '';
  const stageRecord = {
    run_id: RUN_ID,
    gap_family: parsed.gapFamily,
    source_url: parsed.sourceUrl,
    final_url: parsed.finalUrl,
    artifact_path: row.artifactPath,
    source_role: row.sourceRole,
    supporting_text: supportingText.slice(0, 500),
    fetched_at: row.fetchedAt,
    content_hash: row.sha256,
    byte_count: row.byteCount,
    target_table: candidate.targetTable,
    target_id: candidate.record?.id || '',
    record_type: parsed.familyExtraction?.recordType || '',
    title: parsed.familyExtraction?.programName || parsed.familyExtraction?.officeName || parsed.familyExtraction?.organizationName || parsed.pageTitle || '',
    field_values: candidate.record || {},
  };
  if (candidate.isSupported && hasFieldLevelProvenance(stageRecord)) {
    stageReady.push(stageRecord);
  } else {
    validationFailures.push({
      run_id: RUN_ID,
      record_id: parsed.recordId,
      gap_family: parsed.gapFamily,
      source_url: parsed.sourceUrl,
      artifact_path: row.artifactPath,
      reasons: candidate.isSupported ? ['missing_field_level_provenance'] : ['no_staging_mapping_for_family'],
      fetched_at: row.fetchedAt,
      content_hash: row.sha256,
    });
  }
}

writeNdjson(validationFailuresPath, validationFailures);
writeNdjson(stageReadyPath, stageReady);

const completenessRows = [];
for (const record of stageReady) {
  const requiredFields = ['source_url', 'artifact_path', 'source_role', 'supporting_text', 'fetched_at', 'content_hash'];
  for (const field of requiredFields) {
    completenessRows.push({
      family: record.gap_family,
      title: record.title,
      field,
      present: record[field] ? 1 : 0,
    });
  }
}
const groupedCompleteness = new Map();
for (const row of completenessRows) {
  const key = `${row.family}|${row.title}|${row.field}`;
  if (!groupedCompleteness.has(key)) {
    groupedCompleteness.set(key, { family: row.family, title: row.title, field: row.field, present_count: 0, total_count: 0 });
  }
  const current = groupedCompleteness.get(key);
  current.present_count += row.present;
  current.total_count += 1;
}
const completenessCsvRows = Array.from(groupedCompleteness.values()).map((row) => ({
  family: row.family,
  title: row.title,
  field: row.field,
  present_count: row.present_count,
  total_count: row.total_count,
  completeness_percent: Number(((row.present_count / row.total_count) * 100).toFixed(1)),
}));
writeCsv(completenessCsvPath, completenessCsvRows, ['family', 'title', 'field', 'present_count', 'total_count', 'completeness_percent']);
let finalFieldCompletenessRowCount = completenessCsvRows.length;

function readAcceptedMap() {
  const map = new Map();
  if (!fs.existsSync(validatedRoot)) return map;
  for (const family of fs.readdirSync(validatedRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)) {
    const acceptedPath = path.join(validatedRoot, family, 'accepted.ndjson');
    const rejectedPath = path.join(validatedRoot, family, 'rejected.ndjson');
    for (const record of readNdjson(acceptedPath)) {
      map.set(record.recordId, record);
    }
    for (const record of readNdjson(rejectedPath)) {
      validationFailures.push({
        run_id: RUN_ID,
        record_id: record.recordId,
        gap_family: record.gapFamily,
        source_url: record.sourceUrl,
        artifact_path: record.savedPath ? repoRelativePath(record.savedPath) : '',
        reasons: record.validationReasons || [],
        fetched_at: '',
        content_hash: '',
      });
    }
  }
  return map;
}

const acceptedMap = readAcceptedMap();
if (fs.existsSync(stagedRoot) && fs.existsSync(path.join(stagedRoot, 'index-summary.json'))) {
  stageReady = [];
  const familyDirs = fs.readdirSync(stagedRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  for (const familyDir of familyDirs) {
    const promotionPath = path.join(stagedRoot, familyDir, 'promotion-candidates.ndjson');
    const unsupportedPath = path.join(stagedRoot, familyDir, 'unsupported-candidates.ndjson');
    for (const unsupported of readNdjson(unsupportedPath)) {
      validationFailures.push({
        run_id: RUN_ID,
        record_id: unsupported.recordId,
        gap_family: unsupported.family,
        source_url: unsupported.sourceUrl,
        artifact_path: '',
        reasons: [unsupported.candidate?.reason || 'unsupported_for_staging'],
        fetched_at: '',
        content_hash: '',
      });
    }
    for (const staged of readNdjson(promotionPath)) {
      const parsed = acceptedMap.get(staged.recordId);
      if (!parsed) continue;
      const supportingText = parsed.familyExtraction?.serviceSummary
        || parsed.familyExtraction?.summaryText
        || parsed.textSample
        || parsed.pageTitle
        || '';
      const row = {
        run_id: RUN_ID,
        gap_family: staged.family,
        source_url: staged.sourceUrl,
        final_url: parsed.finalUrl,
        artifact_path: parsed.savedPath ? repoRelativePath(parsed.savedPath) : '',
        source_role: parsed.sourceName,
        supporting_text: supportingText.slice(0, 500),
        fetched_at: parsed.parsedAt,
        content_hash: completedBySavedPath.get(parsed.savedPath)?.sha256 || '',
        byte_count: parsed.sourceHtmlBytes || 0,
        target_table: staged.candidate?.targetTable || '',
        staging_table: staged.candidate?.stagingTable || '',
        title: staged.candidate?.row?.extracted_name || staged.candidate?.row?.program || parsed.familyExtraction?.programName || parsed.pageTitle || '',
        field_values: staged.candidate?.row || {},
      };
      if (hasFieldLevelProvenance(row)) {
        stageReady.push(row);
      } else {
        validationFailures.push({
          run_id: RUN_ID,
          record_id: staged.recordId,
          gap_family: staged.family,
          source_url: staged.sourceUrl,
          artifact_path: row.artifact_path,
          reasons: ['missing_field_level_provenance'],
          fetched_at: row.fetched_at,
          content_hash: row.content_hash,
        });
      }
    }
  }

  writeNdjson(validationFailuresPath, validationFailures);
  writeNdjson(stageReadyPath, stageReady);

  const recomputed = [];
  for (const record of stageReady) {
    const requiredFields = ['source_url', 'artifact_path', 'source_role', 'supporting_text', 'fetched_at', 'content_hash'];
    for (const field of requiredFields) {
      recomputed.push({
        family: record.gap_family,
        title: record.title,
        field,
        present: record[field] ? 1 : 0,
      });
    }
  }
  const grouped = new Map();
  for (const row of recomputed) {
    const key = `${row.family}|${row.title}|${row.field}`;
    if (!grouped.has(key)) grouped.set(key, { family: row.family, title: row.title, field: row.field, present_count: 0, total_count: 0 });
    const current = grouped.get(key);
    current.present_count += row.present;
    current.total_count += 1;
  }
  const finalCompletenessRows = Array.from(grouped.values()).map((row) => ({
    family: row.family,
    title: row.title,
    field: row.field,
    present_count: row.present_count,
    total_count: row.total_count,
    completeness_percent: Number(((row.present_count / row.total_count) * 100).toFixed(1)),
  }));
  writeCsv(completenessCsvPath, finalCompletenessRows, ['family', 'title', 'field', 'present_count', 'total_count', 'completeness_percent']);
  finalFieldCompletenessRowCount = finalCompletenessRows.length;
}

const auditPayload = {
  run_id: RUN_ID,
  total_source_targets: completedRows.length,
  meaningful_fetched_evidence: meaningfulRows.length,
  challenge_pages: challengeRows.length,
  parsed_documents: pdfParsedRows.length,
  accepted_discoveries: discoveredAccepted.length,
  rejected_discoveries: discoveredRejected.length,
  manual_review_discoveries: discoveredManual.length,
  validated_records: stageReady.length + validationFailures.length,
  stage_ready_records: stageReady.length,
  blocked_records: completedRows.filter((row) => row.fetch_status === 'blocked').length + challengeRows.length,
  unresolved_repair_records: repairFollowups.length,
  parse_ready_remediated: remediatedParseReadyRows.length,
  browser_assisted_rows: browserAssistedRows.length,
  output_paths: {
    parse_ready_remediated: repoRelativePath(parseReadyOutputPath),
    browser_assisted: repoRelativePath(browserAssistedOutputPath),
    discovered_accepted: repoRelativePath(discoveredAcceptedPath),
    discovered_rejected: repoRelativePath(discoveredRejectedPath),
    discovered_manual_review: repoRelativePath(discoveredManualPath),
    validation_failures: repoRelativePath(validationFailuresPath),
    stage_ready: repoRelativePath(stageReadyPath),
    completeness_csv: repoRelativePath(completenessCsvPath),
    repair_followups: repoRelativePath(repairQueuePath),
  },
  field_completeness_rows: finalFieldCompletenessRowCount,
  notable_followups: repairFollowups.slice(0, 25),
};

writeJson(auditJsonPath, auditPayload);
fs.writeFileSync(auditMarkdownPath, [
  '# California Data Quality Audit v2',
  '',
  `- Run ID: \`${RUN_ID}\``,
  `- Total source targets: \`${auditPayload.total_source_targets}\``,
  `- Meaningful fetched evidence: \`${auditPayload.meaningful_fetched_evidence}\``,
  `- Challenge pages: \`${auditPayload.challenge_pages}\``,
  `- Parsed documents: \`${auditPayload.parsed_documents}\``,
  `- Accepted discoveries: \`${auditPayload.accepted_discoveries}\``,
  `- Rejected discoveries: \`${auditPayload.rejected_discoveries}\``,
  `- Manual-review discoveries: \`${auditPayload.manual_review_discoveries}\``,
  `- Stage-ready records: \`${auditPayload.stage_ready_records}\``,
  `- Unresolved repair records: \`${auditPayload.unresolved_repair_records}\``,
  '',
  '## Output Paths',
  '',
  ...Object.entries(auditPayload.output_paths).map(([key, value]) => `- ${key}: \`${value}\``),
  '',
].join('\n'));

console.log(JSON.stringify(auditPayload, null, 2));
