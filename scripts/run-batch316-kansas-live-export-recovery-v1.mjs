import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch316_kansas_live_export_recovery_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch316-kansas-live-export-recovery-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'live_ksde_directory_root_and_public_export_contract_recovered_but_reviewed_local_district_leaves_still_cover_only_16_counties';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const NEXT_ACTION =
  'resume_only_from_live_public_export_backed_district_inventory_and_saved_district_owned_domains_to_expand_reviewed_local_education_leaves';
const FAMILY_STATUS =
  'blocked_live_ksde_export_contract_recovered_but_reviewed_local_district_leaves_still_incomplete';
const STATUS_REASON =
  'Kansas still has reviewed local education-routing proof for only 16 counties, so the state remains blocked on incomplete county-grade local education evidence. But the official KSDE statewide lane is no longer dead: `https://uapps.ksde.gov/Directory_Rpts/default.aspx` is now live again with `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION`, `https://www.ksde.gov/data-and-reporting/directories` is live again, and the current Kansas Educational Directory PDF is once again a real public PDF. One bounded public replay of the Directory Reports app also again returns a real `Directory.xls` workbook, proving the official export-backed district inventory lane is back. Kansas therefore remains blocked, but the correct next lane has shifted from dead-root freeze to live export-backed district leaf authoring.';
const EVIDENCE =
  'Reviewed 2026-06-24 one more bounded official Kansas district-routing pass against the exact KSDE roots. `https://uapps.ksde.gov/Directory_Rpts/default.aspx` now returns a live HTML page with hidden ASP.NET fields `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION` again present. `https://www.ksde.gov/data-and-reporting/directories` now returns a live KSDE directories page, and `https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12` now returns a real PDF (`content-type: application/pdf`, about 7.4 MB) instead of a rejected shell. A bounded public POST replay on the live Directory Reports root using the current hidden fields, `ctl00$MainContent$ddDistricts=D0435`, `ctl00$MainContent$RadioGroup1=RadioUSD1`, `ctl00$MainContent$rblFormat=Excel`, and `ctl00$MainContent$btnPrintSection1=Run Report` now again returns a real Excel workbook (`content-type: application/vnd.ms-excel`) whose extracted strings preserve `SCHOOL DISTRICT SUPERINTENDENTS AND BOARD PRESIDENTS`, `County Name`, `Superintendent Address`, `Phone`, and district values including Abilene / Dickinson plus district email domains on the official public export lane. Kansas still has reviewed local proof for only 16 counties from preserved district-owned or district-linked leaves, so county-grade education routing remains incomplete. The state therefore stays BLOCKED, but the blocker is now incomplete local leaf coverage, not a dead KSDE root.';

const LESSON_HEADING = '### Recheck Rejected State Export Roots Before Freezing Them As Final';
const LESSON_BODY =
  '*   **Lesson:** A previously rejected official export root can recover, so recheck exact public state directory and PDF URLs before treating a dead-root blocker as final. Kansas KSDE moved from shared `Request Rejected` shells back to a live Directory Reports page with ASP.NET hidden fields, a live Directories page, and a real public educational-directory PDF, which reopened the official export-backed district authoring lane even though county-grade local leaves were still incomplete.';

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

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kansas California-Grade Audit Report v2',
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
    '## Repair decision',
    '',
    '- Kansas remains BLOCKED and not index-safe.',
    '- Education is still the only remaining critical blocker.',
    '- The live official KSDE export lane has recovered: the Directory Reports root, Directories page, and current educational-directory PDF are public again, and one bounded public report replay again returns a real Excel workbook.',
    '- Kansas still clears only 16 counties with reviewed district-owned or district-linked local education leaves, so county-grade local coverage remains incomplete.',
    '- The correct next lane is now live export-backed district leaf authoring, not a dead-root retry freeze.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');

  current = current
    .split('\n')
    .map((line) => (line.startsWith('- Kansas: `') ? `- Kansas: \`${PRIMARY_GAP_REASON}\`` : line))
    .join('\n');

  const focusBlock = [
    '## Current Focus State: Kansas',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` is the only remaining Kansas critical blocker. Kansas still has reviewed local education-routing proof for only 16 counties from preserved district-owned or district-linked local leaves, so county-grade local education coverage remains incomplete. But the official KSDE statewide lane has recovered: `https://uapps.ksde.gov/Directory_Rpts/default.aspx` is live again with `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION`, `https://www.ksde.gov/data-and-reporting/directories` is live again, and the current Kansas Educational Directory PDF is once again a real public PDF. One bounded public replay of the Directory Reports app again returns a real `Directory.xls` workbook. Kansas remains BLOCKED and not index-safe because the local district-leaf conversion work is still incomplete across the remaining counties, not because the state roots are dead.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Additional district-owned Kansas `special education`, `student services`, `special services`, `parent rights`, or district-linked cooperative leaves on unresolved export-backed district domains.',
    '- Exact same-domain district leaf evidence for unresolved counties that is role-bearing enough to replace the statewide KSDE placeholders.',
    '- If a district host is live but lacks any role-exact leaf, exact non-match proof so the county can stay frozen without repeated retries.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [KSDE Directory Reports root](https://uapps.ksde.gov/Directory_Rpts/default.aspx)',
    '- [KSDE Directories root](https://www.ksde.gov/data-and-reporting/directories)',
    '- [Kansas Educational Directory PDF](https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12)',
    '- [Atchison Public Schools Special Education Services](https://www.usd409.net/page/special-education-services/)',
    '- [Hays USD 489 Special Education folder](https://www.usd489.com/documents/about-usd-489/special-education/81796)',
    '- [Abilene Public Schools root](https://www.abileneschools.org/)',
    '- [Abilene Public Schools sitemap](https://www.abileneschools.org/sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Saved export-backed district domains for unresolved counties, checked only through exact same-domain role-bearing leaf paths.',
    '- District-linked cooperative leaves on district-owned hosts where the district nav explicitly labels the route as Special Education or similar.',
    '- Additional district-owned document-folder or CMS routes like the Hays USD 489 recovery, but only on already-preserved district domains.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[\s\S]*$/,
    [
      '## Next State Order After Kansas',
      '',
      '1. Nebraska',
      '2. Florida',
      '3. Alaska',
      '4. New York',
      '5. Oklahoma',
      '6. Oregon',
      '7. Ohio',
      '8. Minnesota',
      '9. Maine',
      '10. Idaho',
      '',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const oldNote = '- Kansas now has a tighter state-root stop signal: the official KSDE Directory Reports root, Directories root, and current educational-directory PDF URL all return the same `Request Rejected` shell in the bounded raw lane, and the raw Directory Reports root exposes no hidden ASP.NET submit fields, so future repairs should continue only from saved district leads plus exact district-owned leaves.';
  const newNote = '- Kansas now has a recovered state export lane: the official KSDE Directory Reports root, Directories page, and current educational-directory PDF are public again, and the Directory Reports app again returns a real public Excel workbook, so future repairs should continue from the live export-backed district inventory plus exact district-owned leaves.';
  if (current.includes(oldNote)) current = current.replace(oldNote, newNote);
  if (!current.includes(newNote)) current = `${current.trimEnd()}\n${newNote}\n`;
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 316 Kansas Live Export Recovery Report v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the current KSDE Directory Reports root is live again and exposes `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION`.',
    '- Confirmed the current KSDE Directories page is live again.',
    '- Confirmed the current Kansas Educational Directory URL is a real public PDF again.',
    '- Confirmed one bounded public Directory Reports POST replay again returns a real Excel workbook.',
    '- Confirmed Kansas still has reviewed local education-routing proof for only 16 counties.',
    '',
    '## Why Kansas remains blocked',
    '',
    '- County-grade local education proof is still incomplete across the remaining unresolved counties.',
    '- The blocker is now incomplete local district-leaf coverage, not a dead KSDE root.',
    '- The right next move is to resume exact district-leaf authoring from the live export-backed district inventory and preserved district domains.',
    '',
    '## Next action',
    '',
    `- ${batchSummary.next_action}`,
    '',
  ].join('\n') + '\n';
}

export function generateBatch316KansasLiveExportRecoveryV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch316_kansas_live_export_recovery_v1',
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? { ...blocker, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : blocker
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          query_basis: 'Reviewed the recovered live KSDE state roots plus one exact public export replay, then preserved the blocker against the existing reviewed district-leaf inventory.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: 'The live KSDE state roots and public export contract are back, but reviewed local district-owned or district-linked leaves still cover only 16 counties.',
          sample_count: 20,
          samples: [
            {
              sample_name: 'KSDE Directory Reports root recovered',
              source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              verification_status: 'reviewed',
              source_type: 'official_public_directory_app',
              source_table: 'bounded_live_kansas_recheck',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The live official Directory Reports page now again exposes `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, and `__EVENTVALIDATION` on the public root.'
            },
            {
              sample_name: 'KSDE Directories page recovered',
              source_url: 'https://www.ksde.gov/data-and-reporting/directories',
              final_url: 'https://www.ksde.gov/data-and-reporting/directories',
              verification_status: 'reviewed',
              source_type: 'official_statewide_directory_root',
              source_table: 'bounded_live_kansas_recheck',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The official KSDE Directories page is live again on ksde.gov.'
            },
            {
              sample_name: 'Kansas Educational Directory PDF recovered',
              source_url: 'https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12',
              final_url: 'https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12',
              verification_status: 'reviewed',
              source_type: 'official_public_pdf',
              source_table: 'bounded_live_kansas_recheck',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'The current Kansas Educational Directory URL again returns a real PDF with `content-type: application/pdf` and a 2025-2026 filename.'
            },
            {
              sample_name: 'Abilene USD 435 public export workbook recovered',
              source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
              verification_status: 'reviewed',
              source_type: 'official_public_export_contract',
              source_table: 'bounded_live_kansas_recheck',
              fetched_at: '2026-06-24T00:00:00.000Z',
              evidence_snippet: 'A bounded public Run Report POST again returns a real `Directory.xls` workbook whose strings preserve `SCHOOL DISTRICT SUPERINTENDENTS AND BOARD PRESIDENTS`, `County Name`, `Phone`, and Abilene / Dickinson values.'
            },
            ...(row.samples || []).filter((sample) => sample.sample_name?.includes('district-owned leaf') || sample.sample_name?.includes('district-owned') || sample.sample_name?.includes('district-linked') || sample.sample_name?.includes('district-owned Special') || sample.sample_name?.includes('district-owned leaf')).slice(0, 16),
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: 'The live KSDE Directory Reports root, Directories page, and public educational-directory PDF are back, but reviewed local district-owned or district-linked leaves still cover only 16 counties.' }
      : row
  ));

  const updatedAllStateQueue = allStateQueue.map((row) => (
    row.state === 'kansas'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'kansas'
        ? {
            ...row,
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: FAMILY_STATUS,
            },
            packetBatch: 'batch316_kansas_live_export_recovery_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  updateHandoff();
  updateAllStateReport();
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    state: 'kansas',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'district_or_county_education_routing',
    failure_code: FAILURE_CODE,
    ksde_directory_reports_status: 200,
    ksde_directories_status: 200,
    ksde_pdf_status: 200,
    has_viewstate: true,
    has_viewstategenerator: true,
    has_eventvalidation: true,
    export_content_type: 'application/vnd.ms-excel',
    export_file_type: 'CDFV2 Microsoft Excel',
    export_title: 'SCHOOL DISTRICT SUPERINTENDENTS AND BOARD PRESIDENTS',
    reviewed_local_leaf_counties: 16,
    sample_export_district: 'D0435 Abilene USD 435',
    next_action: NEXT_ACTION,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch316KansasLiveExportRecoveryV1();
  console.log(JSON.stringify(result, null, 2));
}
