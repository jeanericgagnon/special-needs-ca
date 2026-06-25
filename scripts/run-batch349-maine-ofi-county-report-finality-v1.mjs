import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch348MaineCountyCrosswalkFinalityV1 } from './run-batch348-maine-county-crosswalk-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'maine_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'maine_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'maine_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maine_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'maine_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  idahoSummary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch349_maine_ofi_county_report_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch349-maine-ofi-county-report-finality-report-v1.md'),
};

const BATCH_NAME = 'batch349_maine_ofi_county_report_finality_v1';
const PRIMARY_GAP_REASON =
  'official_dhhs_office_stack_and_new_ofi_county_reports_still_expose_no_office_assignment_or_service_area_crosswalk';
const COUNTY_STATUS = 'blocked_public_dhhs_office_stack_and_county_reports_without_office_assignment_contract';
const FAILURE_CODE = 'official_dhhs_office_stack_and_county_reports_expose_county_counts_but_zero_office_assignment_fields';
const NEXT_ACTION =
  'hold_blocked_until_official_maine_dhhs_or_ofi_surface_exposes_county_to_office_or_service_area_routing';
const COUNTY_REASON =
  'Reviewed 2026-06-25 one more bounded official Maine DHHS/OFI county-local pass. The public DHHS office stack still behaves exactly as before: the district office page preserves office towns, addresses, phones, emails, map shortlinks, and OFI program links, but no county-served or service-area fields; the same-host contact root, administrative offices page, offices/divisions hub, and DHHS sitemap also stay public while exposing no county crosswalk. The newly surfaced official OFI Data & Reports page adds real county-structured artifacts on the same host, including downloadable `Summary Counts By County.xlsx` and `Summary Counts By County And Town.xlsx` files. But those workbooks only preserve TANF/Food Supplement count columns by county and town; they expose zero office names, zero district-office identifiers, zero service-area labels, and zero county-to-office routing fields. Maine therefore still lacks any truthful county-to-office or county-to-service-area routing contract on the official public host family.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-25 bounded official Maine DHHS/OFI surfaces on `https://www.maine.gov/dhhs/about/contact/offices`, `https://www.maine.gov/dhhs/about/contact/`, `https://www.maine.gov/dhhs/about/contact/administrative-offices`, `https://www.maine.gov/dhhs/offices-divisions`, `https://www.maine.gov/dhhs/about/sitemap`, and `https://www.maine.gov/dhhs/ofi/about-us/data-reports`. The live district office page still preserves district office names, exact office towns and addresses, phones, emails, cross-office program notes, OFI program links, and `Show Map` shortlinks for Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan. But the office page still exposes zero county names, zero county-served labels, and zero service-area fields in public HTML. The same-host follow-up pages remain public yet equally negative: the contact root, administrative offices page, offices/divisions page, and DHHS sitemap expose no county crosswalk and no alternate office-routing export. The OFI Data & Reports page does publish official county and county-and-town workbooks on the same host, including `May 2026 Summary Counts By County.xlsx` and `May 2026 Summary Counts By County And Town.xlsx`, but those sheets only contain TANF/Food Supplement summary count columns by county and town. They expose zero office names, zero district-office identifiers, and zero county-to-office routing fields. Maine therefore still has official county-coded program reports without any truthful county-to-office routing contract.';
const LESSON_HEADING = '### County-Coded Program Reports Still Do Not Prove Local Office Routing';
const LESSON_BODY =
  '*   **Lesson:** If an official state host publishes county or county-and-town spreadsheets, inspect the actual sheet schema before treating them as routing evidence. Maine OFI exposed downloadable county-coded workbooks on the DHHS host, but the sheets only carried TANF/Food Supplement summary counts and no office, district, or service-area fields, so they strengthened the blocker instead of clearing county-local routing.';

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
    '# Maine California-Grade Audit Report v2',
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
    '- Maine remains BLOCKED and not index-safe.',
    '- Education remains cleared by the live official Superintendent-by-SAU and Superintendent-by-Town selectors.',
    '- County-local remains blocked because the public DHHS office stack still exposes office-grade contact proof without county routing, and the newly surfaced official OFI county workbooks still contain only program counts rather than office-assignment fields.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const lines = text.split('\n').filter((line) => !line.startsWith('- Maine remains blocked'));
  const next = '- Maine remains blocked on a stronger same-host finality check: the DHHS office stack still has no county/service-area crosswalk, and the newly surfaced OFI county and county-town workbooks are only TANF/Food Supplement count reports with no office-assignment fields.';
  return `${lines.join('\n').trimEnd()}\n${next}\n`;
}

function buildHandoff(allStateAudit, idahoSummary) {
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
    '## Current Focus State: Maine',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Maine critical blocker. One more bounded official pass confirmed that the public DHHS office stack is still office-grade only: the district office page lists office towns, addresses, phones, emails, map shortlinks, and OFI program notes, but no county-served or service-area fields; the same-host contact root, administrative offices page, offices/divisions hub, and DHHS sitemap still add no county crosswalk. The new official lead on the same host family was the OFI Data & Reports page, which now exposes downloadable county and county-and-town workbooks. But sampled `May 2026 Summary Counts By County.xlsx` and `May 2026 Summary Counts By County And Town.xlsx` sheets only contain TANF/Food Supplement summary count columns by county and town. They do not expose office names, district identifiers, service-area labels, or county-to-office routing fields. Maine remains BLOCKED because the official host family now proves county-coded program counts, but still not county-to-office routing.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Maine DHHS or OFI county/service-area crosswalk that ties counties to the named district office towns on the public DHHS office page.',
    '- Any official Maine DHHS or OFI office export, table, PDF, workbook, ArcGIS layer, or API that exposes office names together with county-served or service-area fields.',
    '- Any official county-grade routing contract on a successor Maine DHHS surface that is public and reviewable without inference.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Maine DHHS District Office Locations](https://www.maine.gov/dhhs/about/contact/offices)',
    '- [Maine DHHS Contact root](https://www.maine.gov/dhhs/about/contact/)',
    '- [Maine DHHS Administrative Office Locations](https://www.maine.gov/dhhs/about/contact/administrative-offices)',
    '- [Maine DHHS Offices/Divisions](https://www.maine.gov/dhhs/offices-divisions)',
    '- [Maine DHHS Sitemap](https://www.maine.gov/dhhs/about/sitemap)',
    '- [Maine OFI Data & Reports](https://www.maine.gov/dhhs/ofi/about-us/data-reports)',
    '- [May 2026 Summary Counts By County.xlsx](https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County.xlsx)',
    '- [May 2026 Summary Counts By County And Town.xlsx](https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County%20And%20Town.xlsx)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official DHHS/OFI workbook or export that contains office names plus county or service-area fields, not just program counts.',
    '- Any official office-assignment artifact behind the district office page or OFI reports lane that binds Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, or Skowhegan to counties.',
    '',
    '## Next State Order After Maine',
    '',
    `1. ${idahoSummary.state_name}`,
    '2. Arizona',
    '3. Massachusetts',
    '4. New Mexico',
    '5. South Dakota',
    '6. Rhode Island',
    '7. Virginia',
    '8. West Virginia',
    '9. North Dakota',
    '10. Wisconsin',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 349 Maine OFI County Report Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: strengthened the Maine county-local blocker by adding the official OFI Data & Reports lane and sampled county / county-and-town workbooks',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch349MaineOfiCountyReportFinalityV1() {
  generateBatch348MaineCountyCrosswalkFinalityV1();

  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const idahoSummary = readJson(INPUTS.idahoSummary);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_new_official_county_crosswalk_contract',
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: FAILURE_CODE,
        evidence: COUNTY_EVIDENCE,
        next_action: NEXT_ACTION,
      },
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      county_local_disability_resources: COUNTY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
        ...row,
        family_status: COUNTY_STATUS,
        sample_count: 7,
        blocker_code: FAILURE_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
        query_basis: 'Reviewed the live official Maine DHHS office page plus bounded same-host contact, sitemap, offices/divisions, administrative-office, and OFI Data & Reports follow-ups for county or office-assignment fields.',
        samples: [
          {
            sample_name: 'DHHS District Office Locations',
            source_url: 'https://www.maine.gov/dhhs/about/contact/offices',
            final_url: 'https://www.maine.gov/dhhs/about/contact/offices',
            verification_status: 'blocked',
            source_type: 'official_district_office_list_without_county_crosswalk',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The office page lists Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, and Skowhegan with addresses, phones, emails, OFI notes, and map links, but still exposes zero county names or service-area fields.',
          },
          {
            sample_name: 'DHHS contact root',
            source_url: 'https://www.maine.gov/dhhs/about/contact/',
            final_url: 'https://www.maine.gov/dhhs/about/contact/',
            verification_status: 'blocked',
            source_type: 'official_contact_hub_without_county_crosswalk',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The DHHS contact root stays public but only points back to district office locations and administrative offices without any county-served or service-area contract.',
          },
          {
            sample_name: 'DHHS administrative offices page',
            source_url: 'https://www.maine.gov/dhhs/about/contact/administrative-offices',
            final_url: 'https://www.maine.gov/dhhs/about/contact/administrative-offices',
            verification_status: 'blocked',
            source_type: 'official_admin_offices_without_county_crosswalk',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The administrative offices page remains public but exposes no county names, county-served fields, or district-to-county routing contract.',
          },
          {
            sample_name: 'DHHS Offices/Divisions page',
            source_url: 'https://www.maine.gov/dhhs/offices-divisions',
            final_url: 'https://www.maine.gov/dhhs/offices-divisions',
            verification_status: 'blocked',
            source_type: 'official_divisions_hub_without_county_crosswalk',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Offices/Divisions hub still routes back to district office locations and OFI without exposing county-served or service-area fields.',
          },
          {
            sample_name: 'DHHS sitemap',
            source_url: 'https://www.maine.gov/dhhs/about/sitemap',
            final_url: 'https://www.maine.gov/dhhs/about/sitemap',
            verification_status: 'blocked',
            source_type: 'official_sitemap_without_county_crosswalk',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The DHHS sitemap surfaces OFI and office leaves, but no county-grade office export or county-to-office routing contract.',
          },
          {
            sample_name: 'OFI Data & Reports page',
            source_url: 'https://www.maine.gov/dhhs/ofi/about-us/data-reports',
            final_url: 'https://www.maine.gov/dhhs/ofi/about-us/data-reports',
            verification_status: 'blocked',
            source_type: 'official_reports_index_with_county_files_but_no_office_assignment_schema',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The OFI Data & Reports page is public and links county and county-and-town workbooks, but the reports lane itself still does not expose office names, service areas, or county-to-office routing fields.',
          },
          {
            sample_name: 'May 2026 Summary Counts By County And Town workbook',
            source_url: 'https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County%20And%20Town.xlsx',
            final_url: 'https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County%20And%20Town.xlsx',
            verification_status: 'blocked',
            source_type: 'official_county_town_workbook_without_office_assignment_fields',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The sampled workbook is a real DHHS-hosted XLSX with COUNTY and TOWN columns plus TANF/Food Supplement summary count fields, but no office name, district office identifier, service area, or routing column.',
          },
        ],
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'maine'
      ? {
        ...row,
        primary_gap_reason: PRIMARY_GAP_REASON,
        recommended_batch: 'hold_for_new_official_county_crosswalk_contract',
        repair_lane: 'blocked_until_new_official_public_county_contract',
      }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'maine'
        ? {
          ...row,
          packetBatch: BATCH_NAME,
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          packetRecommendedBatch: 'hold_for_new_official_county_crosswalk_contract',
          familyStatuses: {
            ...row.familyStatuses,
            county_local_disability_resources: COUNTY_STATUS,
          },
        }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAllStateAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit, idahoSummary));
  appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'maine',
    classification: 'BLOCKED',
    index_safe: false,
    district_office_page_live: true,
    same_host_followups_live: true,
    ofi_data_reports_page_live: true,
    sampled_county_workbook_live: true,
    sampled_county_town_workbook_live: true,
    sampled_county_workbook_has_county_column: true,
    sampled_county_town_workbook_has_town_column: true,
    sampled_workbooks_have_office_name_field: false,
    sampled_workbooks_have_service_area_field: false,
    sampled_workbooks_have_office_assignment_field: false,
    result: 'county_coded_reports_without_office_routing_contract',
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch349MaineOfiCountyReportFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
