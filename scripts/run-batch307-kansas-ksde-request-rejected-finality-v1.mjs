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
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch307_kansas_ksde_request_rejected_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch307-kansas-ksde-request-rejected-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'official_ksde_directory_export_roots_now_return_request_rejected_shells_while_reviewed_district_owned_leaves_cover_16_counties_but_county_grade_is_still_incomplete';
const FAILURE_CODE =
  'official_ksde_directory_export_roots_now_return_request_rejected_shells_while_reviewed_district_owned_leaves_cover_16_counties_but_county_grade_is_still_incomplete';
const NEXT_ACTION =
  'continue_only_from_saved_export_backed_district_leads_and_reviewed_district_owned_domains_not_from_live_ksde_root_retries';
const FAMILY_STATUS =
  'blocked_reviewed_district_owned_and_coop_leads_but_live_ksde_export_roots_now_request_rejected';
const STATUS_REASON =
  'Kansas still has reviewed local education-routing proof for 16 counties, but the current bounded raw lane now confirms the official KSDE export roots themselves are not reusable scrape entrypoints. `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and the current Kansas educational directory PDF URL each returned HTTP 200 only as the same `Request Rejected` shell in the live bounded pass, not as district inventory or export content. Kansas therefore remains blocked on incomplete county-grade local education proof, and future repairs should continue only from already-preserved export-backed district leads plus exact district-owned leaves rather than spending more low-token passes on the rejected state roots.';
const EVIDENCE =
  'Reviewed 2026-06-23 one more bounded official Kansas district-routing pass focused on the exact official state directory/export roots before any new county leaf guesses. The current live raw lane now returns the same `Request Rejected` shell for all three official state roots that previously anchored Kansas district authoring: `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and `https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12`. Each returned HTTP 200 with `<title>Request Rejected</title>` and the same `The requested URL was rejected. Please consult with your administrator.` body, so none of them currently materialize district inventory in the bounded raw lane. Kansas still has reviewed local proof for 16 counties from previously preserved export-backed district hosts and district-owned leaves, but the remaining county-grade gap is still unresolved across the rest of the state. The right next lane is therefore exact district-leaf authoring from saved export-backed district leads, not more retries on the current KSDE roots.';

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
    '- Kansas still has reviewed local education-routing proof for 16 counties from saved export-backed district leads and district-owned or district-linked local leaves.',
    '- But the current bounded raw lane now shows the official KSDE directory/export roots themselves returning the same `Request Rejected` shell instead of reusable district inventory or workbook content.',
    '- That means the correct next lane is exact district-leaf repair from already-preserved district leads, not more retries against the current rejected state roots.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');

  const focusBlock = [
    '## Current Focus State: Kansas',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` is the only remaining Kansas critical blocker. Kansas still has reviewed local education-routing proof for 16 counties from previously preserved export-backed district hosts plus district-owned or district-linked local leaves, but one more bounded official raw pass now confirms the current KSDE directory/export roots are not reusable scrape entrypoints. `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and the current Kansas educational directory PDF URL each returned HTTP 200 only as the same `Request Rejected` shell with `The requested URL was rejected. Please consult with your administrator.` That means future Kansas work should continue only from saved export-backed district leads and exact district-owned domains, not from more low-token retries on the rejected state roots. Kansas remains BLOCKED and not index-safe because county-grade local education proof is still incomplete across the remaining counties.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Additional district-owned Kansas `special education`, `student services`, `special services`, `parent rights`, or district-linked cooperative leaves on unresolved export-backed district hosts.',
    '- Exact same-domain district leaf evidence for unresolved counties that is role-bearing enough to replace the statewide KSDE placeholders.',
    '- If a district host is live but lacks any role-exact leaf, exact non-match proof so the county can stay frozen without repeated retries.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [KSDE Directory Reports root](https://uapps.ksde.gov/Directory_Rpts/default.aspx)',
    '- [KSDE Directories root](https://www.ksde.gov/data-and-reporting/directories)',
    '- [Kansas Educational Directory PDF](https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12)',
    '- [Hays USD 489 root](https://www.usd489.com/)',
    '- [Hays USD 489 sitemap](https://www.usd489.com/sitemap.xml)',
    '- [Hays USD 489 Special Education document folder](https://www.usd489.com/documents/about-usd-489/special-education/81796)',
    '- [Abilene Public Schools root](https://www.abileneschools.org/)',
    '- [Abilene Public Schools sitemap](https://www.abileneschools.org/sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Saved export-backed district websites for unresolved counties, checked only through exact same-domain role-bearing leaf paths.',
    '- District-linked cooperative leaves on district-owned hosts where the district nav explicitly labels the route as Special Education or similar.',
    '- Additional district-owned document-folder or CMS routes like the Hays USD 489 recovery, but only on already-preserved district domains.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n){1,12}/,
    [
      '## Next State Order After Kansas',
      '',
      '1. Nebraska',
      '2. Florida',
      '3. Alaska',
      '4. South Carolina',
      '5. North Carolina',
      '6. New York',
      '7. Oklahoma',
      '8. Oregon',
      '9. Ohio',
      '10. Minnesota',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, current);
}

function updateAllStateReport() {
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const note = '- Kansas now has a tighter state-root stop signal: the official KSDE Directory Reports root, Directories root, and current educational-directory PDF URL all return the same `Request Rejected` shell in the bounded raw lane, so future repairs should continue only from saved export-backed district leads plus exact district-owned leaves.';
  if (!current.includes(note)) {
    current = `${current.trimEnd()}\n${note}\n`;
  }
  fs.writeFileSync(INPUTS.allStateReport, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 307 Kansas KSDE Request Rejected Finality Report v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.remaining_blocker_family}`,
    `- blocker_code: ${batchSummary.failure_code}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the current KSDE Directory Reports root returns HTTP 200 only as a `Request Rejected` shell.',
    '- Confirmed the current KSDE Directories root returns the same `Request Rejected` shell.',
    '- Confirmed the current Kansas educational-directory PDF URL also returns the same `Request Rejected` shell in the bounded raw lane.',
    '- Confirmed Kansas still has 16 counties with reviewed local education-routing proof from previously preserved district leads.',
    '',
    '## Why Kansas remains blocked',
    '',
    '- County-grade local education proof is still incomplete across the remaining unresolved counties.',
    '- The current official KSDE state roots are no longer reusable raw scrape entrypoints for the low-token lane.',
    '- The right next move is district-leaf authoring from saved district leads, not more state-root retries.',
    '',
    '## Next action',
    '',
    `- ${batchSummary.next_action}`,
    '',
  ].join('\n') + '\n';
}

export function generateBatch307KansasKsdeRequestRejectedFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
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
          blocker_code: FAILURE_CODE,
          blocker_evidence: 'The current KSDE Directory Reports root, Directories root, and educational-directory PDF URL all return the same `Request Rejected` shell in the bounded raw lane, so remaining county-grade work must continue from saved district leads rather than fresh state-root pulls.',
          query_basis: 'Reviewed the current official KSDE state roots in the bounded raw lane, then preserved the district-grade blocker against the existing reviewed district-leaf inventory.',
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: 'The live KSDE directory/export roots now return a shared `Request Rejected` shell, so the remaining work must stay on saved export-backed district leads plus exact district-owned leaves.' }
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
            packetBatch: 'batch307_kansas_ksde_request_rejected_finality_v1',
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

  const batchSummary = {
    state: 'kansas',
    classification: 'BLOCKED',
    index_safe: false,
    remaining_blocker_family: 'district_or_county_education_routing',
    failure_code: FAILURE_CODE,
    rejected_state_roots: [
      'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
      'https://www.ksde.gov/data-and-reporting/directories',
      'https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12',
    ],
    rejected_shell_title: 'Request Rejected',
    reviewed_local_counties: 16,
    next_action: NEXT_ACTION,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch307KansasKsdeRequestRejectedFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
