import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'massachusetts_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'massachusetts_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'massachusetts_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'massachusetts_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'massachusetts_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  educationPacket: path.join(generatedDir, 'massachusetts_district_or_county_education_routing_postback_packet_v1.json'),
  report: path.join(docsGeneratedDir, 'massachusetts-california-grade-audit-report-v2.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch241_massachusetts_dese_replay_truth_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch241-massachusetts-dese-replay-truth-refresh-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_dds_locations_lane_still_lacks_county_export';
const EDUCATION_FAILURE_CODE = 'exact_dese_hidden_postback_replay_returns_search_shell_without_local_rows';
const EDUCATION_REASON = 'Massachusetts education is now source-final for the low-token lane with stricter current-state truth. The public `search_link.aspx` surface is still only a hidden-field bridge, but a fresh bounded replay of that exact bridge with its current hidden-field payload no longer materializes district rows at all in this lane. The replay returns the generic `Profiles Search` shell with zero superintendent fields, zero address or telephone fields, and zero county occurrences. Massachusetts therefore still lacks county-grade education routing evidence, and the low-token lane cannot currently even rely on replayed district rows without a reviewed browser/cached capture or a new official county-keyed contract.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 one fresh bounded exact replay of the official Massachusetts DESE hidden bridge at https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238. The bridge still returns HTTP 200 and exposes only three hidden fields (`__VIEWSTATE`, `__VIEWSTATEGENERATOR`, `__EVENTVALIDATION`). Replaying that exact hidden payload into https://profiles.doe.mass.edu/search/search.aspx now returns HTTP 200 only as the generic `Profiles Search` shell, not as rendered district rows. The bounded replay preserved zero `superintendent`, zero `address`, zero `telephone`, zero `grades served`, and zero county occurrences in the returned HTML. Massachusetts therefore cannot currently claim a reusable low-token DESE result surface from the hidden postback replay.';
const EDUCATION_NEXT = 'hold_massachusetts_education_until_official_county_to_district_contract_or_reviewed_browser_capture_exists';

const LESSON_HEADING = '### Hidden-Field Bridges Need Fresh Replay Proof Before They Count As Results';
const LESSON_BODY = '*   **Lesson:** If an official bridge URL only supplies hidden fields, rerun that exact hidden payload before assuming the downstream result surface still materializes data. Massachusetts DESE `search_link.aspx` still existed, but the fresh bounded replay now only returned the generic `Profiles Search` shell instead of local district rows.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Massachusetts California-Grade Audit Report v2',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Failure ledger',
    '',
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Completion decision',
    '',
    '- Massachusetts remains BLOCKED and index_safe=false.',
    '- Education is stricter than before: the DESE hidden bridge still exists, but the fresh exact replay now only returns the generic search shell in the low-token lane.',
    '- County-local is still source-final for low-token raw work because the live DDS locations and interactive-map pages remain raw-403 and still expose no county contract.',
    '- Future Massachusetts work should only reopen on an official county contract or on reviewed browser/cached locality capture that can be truthfully bridged to county rows.',
  ].join('\n') + '\n';
}

export function generateBatch241MassachusettsDeseReplayTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const queueRows = readJsonl(INPUTS.queue);
  const educationPacket = readJson(INPUTS.educationPacket);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT }
        : row
    )),
    familyStatuses: {
      ...summary.familyStatuses,
      district_or_county_education_routing: 'blocked_exact_dese_hidden_replay_without_materialized_local_rows',
    },
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'massachusetts'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_exact_dese_hidden_replay_without_materialized_local_rows', status_reason: EDUCATION_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_exact_dese_hidden_replay_without_materialized_local_rows',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          query_basis: 'Reviewed the official DESE hidden bridge plus one fresh exact hidden-field replay that now only returns the generic Profiles Search shell.',
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: EDUCATION_NEXT, evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedEducationPacket = {
    ...educationPacket,
    current_problem_metrics: {
      ...educationPacket.current_problem_metrics,
      realPostbackResultSurface: false,
      countyMappingFieldsPresent: false,
    },
    root_domains_to_review: [
      'official DESE hidden bridge and final rendered search surfaces only',
      'do not assume the hidden bridge still materializes district rows unless a fresh exact replay proves it',
      'do not infer county mapping from district names like Bristol County Agricultural without an official county-keyed contract',
    ],
    packet_complete_when: 'Massachusetts can reopen education only when an official DESE surface preserves a county-to-district contract or a reviewed browser/cached capture preserves local district rows that can be truthfully bridged to county rows.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  fs.writeFileSync(INPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_241_massachusetts_dese_replay_truth_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'massachusetts',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    hidden_bridge_still_exists: true,
    hidden_bridge_replay_materializes_local_rows: false,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 241 Massachusetts DESE Replay Truth Refresh Report v1',
    '',
    '- Confirmed the official DESE hidden bridge still exists, but the fresh exact hidden-field replay now returns only the generic `Profiles Search` shell.',
    '- Confirmed zero superintendent, address, telephone, grades served, and county occurrences in the replayed HTML.',
    '- Massachusetts remains blocked and not index-safe.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch241MassachusettsDeseReplayTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
