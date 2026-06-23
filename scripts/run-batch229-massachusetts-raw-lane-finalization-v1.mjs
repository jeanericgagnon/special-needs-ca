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
  report: path.join(docsGeneratedDir, 'massachusetts-california-grade-audit-report-v2.md'),
  countyPacket: path.join(generatedDir, 'massachusetts_county_local_disability_resources_town_routing_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch229_massachusetts_raw_lane_finalization_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch229-massachusetts-raw-lane-finalization-report-v1.md'),
};

const EDUCATION_FAILURE_CODE = 'official_dese_postback_results_have_zero_county_fields_in_rendered_html';
const EDUCATION_REASON = 'Massachusetts education is now source-final for the low-token lane. The reviewed `search_link.aspx` surface is only a hidden-field auto-post bridge, and the real rendered `search.aspx` result page does produce district rows with superintendent contacts, addresses, phones, and grades served, but the exact bounded check still exposes zero county occurrences, no county column, no county filter, and no county-keyed export contract in the rendered HTML. All 14 county rows therefore still depend on one statewide DESE fallback, so the family remains blocked until an official county-to-district routing contract exists.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 one new live official DESE bridge audit plus one final bounded exact-result check on https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238. The public `search_link.aspx` surface is only a hidden-field passForm that auto-posts into `search.aspx`, and replaying that exact hidden-field POST does render real district rows with superintendent contacts, addresses, phones, and grades served. But the final exact rendered result page still preserves zero county occurrences, no county column, no county filter, and no county export contract. County words only appear inside district names such as Bristol County Agricultural, not as a routing key. Massachusetts therefore still lacks county-grade education routing evidence even though the official DESE postback bridge is real.';
const EDUCATION_NEXT = 'hold_massachusetts_education_until_official_county_to_district_contract_exists';

const COUNTY_FAILURE_CODE = 'live_dds_browser_lane_exists_but_exact_raw_pages_403_and_no_county_crosswalk_exists';
const COUNTY_REASON = 'Massachusetts county-local routing is now source-final for the low-token raw lane. Prior reviewed browser checks proved the DDS org page, locations index, and interactive regional map are live and town-or-city oriented, but the final bounded exact raw checks against `https://www.mass.gov/orgs/department-of-developmental-services/locations` and `https://www.mass.gov/info-details/interactive-dds-regional-map` returned HTTP 403 in the low-token fetch lane. Combined with the reviewed evidence that those same browser-readable surfaces still expose no county names, no county-served labels, and no machine-readable county crosswalk, the family remains blocked until an official county contract or reviewed browser/cached town-to-office capture appears.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 bounded browser checks on the live Massachusetts DDS first-party lane and one final bounded exact raw check on https://www.mass.gov/orgs/department-of-developmental-services/locations plus https://www.mass.gov/info-details/interactive-dds-regional-map. The org page, locations index, and interactive map had already been proven browser-readable, and the reviewed evidence already showed named area offices plus a town-or-city lookup purpose but no county export or machine-readable county bridge. The final exact raw fetch recheck now tightens the low-token lane boundary further: both the live locations index and the interactive map returned HTTP 403 in the raw fetch lane, so low-token scraping still cannot recover a reusable county crosswalk directly from those pages. Massachusetts therefore still lacks county-grade local routing proof in the low-token lane and should stay blocked unless a county-grade export, county field, or reviewed browser/cached locality capture appears.';
const COUNTY_NEXT = 'hold_massachusetts_dds_until_county_crosswalk_or_reviewed_browser_capture_exists';

const LESSON_HEADING = '### Browser-Readable State Pages Can Still Be Raw-Fetch Final';
const LESSON_BODY = '*   **Lesson:** If reviewed browser evidence proves a state page is live but a final exact raw fetch to the same page returns 403 and the rendered content still lacks county-grade fields, stop low-token retries there. Massachusetts DDS locations and regional-map pages were browser-readable enough to refine the blocker, but raw fetch still 403ed and no county crosswalk existed.';

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
    '- Education is source-final for low-token work because the official DESE postback does render district rows, but the exact result page still has zero county fields in rendered HTML.',
    '- County-local is source-final for low-token raw work because the live DDS locations and interactive-map pages are browser-readable but exact raw fetches still 403, and the reviewed content still lacks a county crosswalk.',
    '- Future Massachusetts work should only reopen on an official county contract or on reviewed browser/cached locality capture that can be truthfully bridged to county rows.',
  ].join('\n') + '\n';
}

export function generateBatch229MassachusettsRawLaneFinalizationV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const countyPacket = readJson(INPUTS.countyPacket);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'blocked_official_dese_postback_results_without_county_mapping', status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'blocked_live_dds_browser_lane_without_raw_county_contract', status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_official_dese_postback_results_without_county_mapping',
        blocker_code: EDUCATION_FAILURE_CODE,
        blocker_evidence: EDUCATION_EVIDENCE,
        query_basis: 'Reviewed the official DESE hidden postback bridge plus one final exact rendered result page check for county-bearing fields.',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_dds_browser_lane_without_raw_county_contract',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
        query_basis: 'Reviewed browser-readable DDS surfaces plus one final exact raw fetch check on the live locations index and interactive map.',
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: EDUCATION_NEXT, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, next_action: COUNTY_NEXT, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  countyPacket.repair_lane = 'browser_or_cached_town_to_office_capture_only';
  countyPacket.root_domains_to_review = [
    'reviewed browser or cached DDS locality capture only; exact raw pages are source-final for low-token mode until county fields or an export contract appear',
    'do not reopen generic county-office discovery unless a county-grade export or machine-readable local contract appears on the live DDS lane',
  ];
  countyPacket.packet_complete_when = 'Massachusetts can reopen county-local once an official county crosswalk, county field, county export, or a reviewed browser/cached locality capture that can be truthfully bridged to county rows is preserved.';

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'official_dese_hidden_postback_bridge_renders_real_district_rows_but_no_county_contract_and_live_dds_locations_lane_still_lacks_county_export',
    final_blockers: (summary.final_blockers || []).map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT };
      }
      return row;
    }),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.countyPacket, countyPacket);
  fs.writeFileSync(INPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_229_massachusetts_raw_lane_finalization_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'massachusetts',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    dese_rendered_result_has_zero_county_occurrences: true,
    dds_locations_raw_fetch_403: true,
    dds_interactive_map_raw_fetch_403: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 229 Massachusetts Raw Lane Finalization Report v1',
    '',
    '- Confirmed the exact DESE rendered result surface still has zero county occurrences and no county column/filter/export contract.',
    '- Confirmed the live DDS locations index and interactive regional map remain browser-readable in prior review but both exact raw fetches return HTTP 403 in the low-token lane.',
    '- Massachusetts remains blocked and not index-safe.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch229MassachusettsRawLaneFinalizationV1();
  console.log(JSON.stringify(result, null, 2));
}
