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
  failure: path.join(generatedDir, 'massachusetts_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'massachusetts_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'massachusetts_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  report: path.join(docsGeneratedDir, 'massachusetts-california-grade-audit-report-v2.md'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  educationPacket: path.join(generatedDir, 'massachusetts_district_or_county_education_routing_postback_packet_v1.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch351_massachusetts_dese_row_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch351-massachusetts-dese-row-truth-refresh-report-v1.md'),
};

const BATCH_NAME = 'batch351_massachusetts_dese_row_truth_refresh_v1';
const PRIMARY_GAP_REASON =
  'exact_dese_hidden_postback_replay_materializes_district_rows_but_zero_county_contract_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export';
const EDUCATION_STATUS = 'blocked_exact_dese_replay_renders_rows_but_zero_county_contract';
const EDUCATION_FAILURE_CODE =
  'exact_dese_hidden_postback_replay_renders_real_district_rows_but_zero_county_fields_or_export';
const EDUCATION_NEXT =
  'hold_massachusetts_education_until_official_county_to_district_contract_or_reviewed_county_keyed_capture_exists';
const EDUCATION_REASON =
  'Massachusetts education is still blocked, but the current low-token truth is narrower than the existing packet says. The official `search_link.aspx` bridge still auto-posts into `search.aspx`, and a fresh exact replay of that hidden payload still materializes real DESE district rows with superintendent contacts and grades-served fields. But those rendered rows still preserve zero county column, zero county filter, zero county-keyed export lane, and no reusable county routing contract. The separate live `get_closest_orgs.aspx` School Finder remains address/city/town based only and still exposes no county label or export lane. Massachusetts therefore still lacks county-grade education routing evidence even though the hidden replay itself is live and productive.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-25 one exact replay of the live official Massachusetts DESE bridge at https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238. The bridge still returns a real hidden-field auto-post shell, and replaying its current `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, `__EVENTVALIDATION`, `orgType`, `runOrgSearch`, and `leftNavId` payload into https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238 returned HTTP 200 with rendered district rows. The returned HTML now proves the replay is not empty: it contains hundreds of `superintendent` and `grades served` occurrences and real district result content. But the same rendered result page still preserves zero county column, zero county filter, and no county-keyed export contract; the only `county` occurrences are inside district names like county agricultural districts, not as routing fields. A live recheck of https://profiles.doe.mass.edu/search/get_closest_orgs.aspx also still shows a School Finder that is address/city/town based with no county selector or export lane. Massachusetts education therefore remains blocked because the official DESE surfaces still do not expose county-grade routing fields, not because the hidden replay is empty.';
const LESSON_HEADING = '### A Generic-Titled ASP.NET Result Surface Can Still Contain Real Rows';
const LESSON_BODY =
  '*   **Lesson:** If an ASP.NET bridge resolves to a generic search title, verify the rendered body before declaring the replay empty. Massachusetts DESE `search.aspx` still looked like a generic `Profiles Search` shell, but the exact hidden-field replay now rendered real district rows with superintendent and grades-served data; the real blocker was still the absence of county fields or export, not an empty result surface.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
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
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
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
    '- Education is narrower than the prior packet claimed: the hidden DESE replay still renders real district rows, but those rows still do not expose any county-grade routing contract.',
    '- County-local remains source-final for low-token raw work because the live DDS locations and interactive-map pages remain raw-403 and still expose no county contract.',
    '- Future Massachusetts work should only reopen on an official county contract or on reviewed browser/cached locality capture that can be truthfully bridged to county rows.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const newLine = '- Massachusetts remains blocked on a corrected DESE truth model: the hidden postback replay still renders real district rows, but the rendered result page and live School Finder still expose no county-grade contract, while DDS county-local remains raw-403 with no county export.';
  const lines = text.split('\n').filter((line) => !line.startsWith('- Massachusetts remains blocked on '));
  const notesIndex = lines.findIndex((line) => line.trim() === '## Notes');
  if (notesIndex === -1) return `${lines.join('\n').trimEnd()}\n${newLine}\n`;
  const nextLines = [...lines];
  nextLines.splice(notesIndex + 2, 0, newLine);
  return `${nextLines.join('\n').trimEnd()}\n`;
}

function buildHandoff(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));

  return [
    '# Gemini Source Scout Handoff',
    '',
    `Updated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: Massachusetts',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` remains the highest-priority Massachusetts blocker, but the exact DESE truth is now corrected. The official `search_link.aspx` bridge still auto-posts into `search.aspx`, and a fresh exact replay of that hidden payload still renders real district rows with superintendent and grades-served data. But the rendered result surface still has zero county column, zero county filter, and no county-keyed export contract. The separate live `get_closest_orgs.aspx` School Finder is still address/city/town based only. County-local remains separately blocked because the DDS locations and interactive-map pages are still raw-403 in the low-token lane and still lack a county export or county crosswalk.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official DESE county-to-district contract, county selector, county column, or county-keyed export.',
    '- Any official DDS county crosswalk, county-served export, or machine-readable county-to-office contract.',
    '- Or, a reviewed browser/cached locality capture from DESE or DDS that can be truthfully bridged to counties.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [DESE district-directory bridge](https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238)',
    '- [DESE Profiles Search results](https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238)',
    '- [DESE School Finder](https://profiles.doe.mass.edu/search/get_closest_orgs.aspx)',
    '- [DDS org page](https://www.mass.gov/orgs/department-of-developmental-services)',
    '- [DDS locations index](https://www.mass.gov/orgs/department-of-developmental-services/locations)',
    '- [DDS interactive regional map](https://www.mass.gov/info-details/interactive-dds-regional-map)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official Massachusetts county-keyed DESE export or selector.',
    '- Any official DDS county crosswalk or locality export that can be bridged to county rows without inference.',
    '- Any reviewed browser/cached locality capture from DESE or DDS that preserves county-safe routing evidence.',
    '',
    '## Next State Order After Massachusetts',
    '',
    '1. New Mexico',
    '2. South Dakota',
    '3. Rhode Island',
    '4. Virginia',
    '5. West Virginia',
    '6. North Dakota',
    '7. Wisconsin',
    '8. Washington',
    '9. Tennessee',
    '10. Vermont',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 351 Massachusetts DESE Row Truth Refresh v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: corrected the Massachusetts education blocker from “hidden replay no longer materializes local rows” to “hidden replay still renders rows, but zero county contract remains”',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch351MassachusettsDeseRowTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const educationPacket = readJson(INPUTS.educationPacket);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_county_keyed_contract_or_reviewed_capture',
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT }
        : row
    )),
    familyStatuses: {
      ...summary.familyStatuses,
      district_or_county_education_routing: EDUCATION_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: EDUCATION_STATUS, status_reason: EDUCATION_REASON }
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
        family_status: EDUCATION_STATUS,
        sample_count: 4,
        query_basis: 'Reviewed the official DESE hidden bridge, one fresh exact hidden-field replay, and the live official School Finder page.',
        blocker_code: EDUCATION_FAILURE_CODE,
        blocker_evidence: EDUCATION_EVIDENCE,
        samples: [
          ...(row.samples || []).filter((sample) => sample.sample_name !== 'DESE School Finder'),
          {
            sample_name: 'DESE School Finder',
            source_url: 'https://profiles.doe.mass.edu/search/get_closest_orgs.aspx',
            final_url: 'https://profiles.doe.mass.edu/search/get_closest_orgs.aspx',
            verification_status: 'blocked',
            source_type: 'official_city_town_school_finder_without_county_contract',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live official School Finder is still address, city, or town based and exposes no county selector or county export lane.',
          },
        ],
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: EDUCATION_NEXT, evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'massachusetts'
      ? {
        ...row,
        primary_gap_reason: PRIMARY_GAP_REASON,
        recommended_batch: 'hold_for_county_keyed_contract_or_reviewed_capture',
        repair_lane: 'blocked_until_county_keyed_contract_or_reviewed_capture',
      }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    classifications: updatedQueueRows.reduce((acc, row) => {
      acc[row.classification] = (acc[row.classification] || 0) + 1;
      return acc;
    }, {}),
    indexSafeCount: updatedQueueRows.filter((row) => row.index_safe).length,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'massachusetts'
        ? {
          ...row,
          classification: 'BLOCKED',
          indexSafe: false,
          completenessPct: 83,
          weakCriticalFamilies: 2,
          familyStatuses: {
            ...row.familyStatuses,
            district_or_county_education_routing: EDUCATION_STATUS,
          },
          packetBatch: BATCH_NAME,
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          packetRecommendedBatch: 'hold_for_county_keyed_contract_or_reviewed_capture',
        }
        : row
    )),
  };

  const updatedEducationPacket = {
    ...educationPacket,
    current_problem_metrics: {
      ...(educationPacket.current_problem_metrics || {}),
      realPostbackResultSurface: true,
      countyMappingFieldsPresent: false,
    },
    root_domains_to_review: [
      'official DESE hidden bridge and final rendered result surfaces only',
      'the hidden replay still renders real district rows, but do not treat those rows as county-grade without an official county field, selector, or export',
      'do not infer county mapping from district names like Bristol County Agricultural without a county-keyed contract',
    ],
    packet_complete_when: 'Massachusetts can reopen education only when an official DESE surface preserves a county-to-district contract or a reviewed browser/cached capture preserves county-keyed local district rows.',
  };

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'massachusetts',
    classification: 'BLOCKED',
    index_safe: false,
    hidden_bridge_exists: true,
    hidden_replay_renders_real_rows: true,
    rendered_result_has_county_fields: false,
    live_school_finder_has_county_fields: false,
    result: 'real_dese_rows_without_county_contract',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit));
  appendLessonIfMissing(INPUTS.lessons);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return {
    classification: updatedSummary.classification,
    primary_gap_reason: updatedSummary.primary_gap_reason,
    batch: BATCH_NAME,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch351MassachusettsDeseRowTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
