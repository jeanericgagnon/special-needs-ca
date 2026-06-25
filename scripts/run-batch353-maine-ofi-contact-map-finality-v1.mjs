import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  summary: path.join(generatedDir, 'batch353_maine_ofi_contact_map_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch353-maine-ofi-contact-map-finality-report-v1.md'),
};

const BATCH_NAME = 'batch353_maine_ofi_contact_map_finality_v1';
const PRIMARY_GAP_REASON =
  'official_dhhs_office_stack_ofi_contact_page_and_show_map_shortlinks_still_expose_no_county_or_service_area_contract';
const COUNTY_STATUS = 'blocked_public_dhhs_office_stack_ofi_contact_and_map_shortlinks_without_office_assignment_contract';
const FAILURE_CODE = 'official_dhhs_office_stack_ofi_contact_and_map_shortlinks_expose_office_addresses_but_zero_county_assignment_fields';
const NEXT_ACTION =
  'hold_blocked_until_official_maine_dhhs_or_ofi_surface_exposes_county_to_office_or_service_area_routing';
const COUNTY_REASON =
  'Reviewed 2026-06-25 one more bounded official Maine DHHS/OFI county-local pass on same-host contact surfaces and two representative `Show Map` shortlinks. The DHHS district office page still preserves office towns, addresses, phones, emails, map shortlinks, and OFI program links, but no county-served or service-area fields. The OFI contact page at `/dhhs/ofi/about-us/contact` stays live, yet it only repeats the same `District Office locations` link plus statewide eligibility/help routing and exposes no county crosswalk, no office-assignment table, and no service-area text. The OFI programs-and-services page stays equally generic. The `Show Map` shortlinks from the district office page resolve only to raw Google Maps address geocodes such as `35 Anthony Ave, Augusta, ME 04330` and `19 Maine Ave, Bangor, ME 04401`; they add address confirmation, but no county names, no district-office identifiers, and no county-to-office routing metadata. Maine therefore still has office-grade address proof without any truthful county-to-office or county-to-service-area routing contract on the official public host family.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-25 bounded official Maine DHHS/OFI surfaces on `https://www.maine.gov/dhhs/about/contact/offices`, `https://www.maine.gov/dhhs/ofi/about-us/contact`, `https://www.maine.gov/dhhs/ofi/programs-services`, and two representative `Show Map` shortlinks from the district office table. The live district office page still preserves district office names, office towns and addresses, phones, emails, map shortlinks, and OFI program links, but zero county names, zero county-served labels, and zero service-area fields in public HTML. The OFI contact page still only points back to `District Office locations` and statewide eligibility/help routing. The OFI programs-and-services page stays live but exposes no county or office-assignment metadata. The representative `Show Map` shortlinks resolved only to Google Maps address geocodes for `35 Anthony Ave, Augusta, ME 04330` and `19 Maine Ave, Bangor, ME 04401`, adding no county names, no district-office identifiers, and no county-to-office routing fields. Maine therefore still has official office addresses without any public county-assignment contract.';
const LESSON_HEADING = '### Address Map Shortlinks Still Do Not Prove County Service Areas';
const LESSON_BODY =
  '*   **Lesson:** If an official office directory only exposes `Show Map` shortlinks, resolve a bounded sample before assuming they add routing coverage. Maine DHHS `Show Map` links only expanded to raw Google Maps address geocodes for office street addresses; they added no county-served labels, service-area fields, or office-assignment metadata, so they strengthened the blocker instead of clearing county-local routing.';

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
    '- County-local remains blocked because the public DHHS office stack, OFI contact page, OFI programs-and-services page, and sampled `Show Map` shortlinks still expose office-grade address proof without county routing or service-area fields.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const lines = text.split('\n').filter((line) => !line.startsWith('- Maine remains blocked'));
  const next = '- Maine remains blocked after a sharper office-address finality check: the DHHS office stack, OFI contact page, and sampled `Show Map` links still only expose office addresses and generic eligibility routing, not any county-to-office or service-area contract.';
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
    '`county_local_disability_resources` is still the only remaining Maine critical blocker. One more bounded official pass confirmed that even the same-host OFI contact/help lane and the district-office `Show Map` links do not add county routing. The public DHHS district office page still preserves office towns, addresses, phones, emails, map shortlinks, and OFI program notes, but no county-served or service-area fields. The OFI contact page only loops back to the same `District Office locations` page plus statewide eligibility/help routing. The OFI programs-and-services page stays generic. And sampled `Show Map` shortlinks only resolve to raw Google Maps address geocodes such as `35 Anthony Ave, Augusta, ME 04330` and `19 Maine Ave, Bangor, ME 04401`; they add no county names, no office identifiers, and no county-to-office mapping metadata. Maine remains BLOCKED because the official host family still proves office addresses, not county assignment.',
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
    '- [Maine OFI Contact page](https://www.maine.gov/dhhs/ofi/about-us/contact)',
    '- [Maine OFI Programs & Services](https://www.maine.gov/dhhs/ofi/programs-services)',
    '- [Maine OFI Data & Reports](https://www.maine.gov/dhhs/ofi/about-us/data-reports)',
    '- [May 2026 Summary Counts By County.xlsx](https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County.xlsx)',
    '- [May 2026 Summary Counts By County And Town.xlsx](https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County%20And%20Town.xlsx)',
    '- [Sample Show Map: Augusta office](https://goo.gl/maps/D71ZqAnXQcp)',
    '- [Sample Show Map: Bangor office](https://goo.gl/maps/LRVMzcdK23Mxx7g29)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official DHHS/OFI workbook or export that contains office names plus county or service-area fields, not just program counts or address maps.',
    '- Any official office-assignment artifact behind the district office page, OFI contact/help lane, or reports lane that binds Bangor, Biddeford, Calais, Caribou, Ellsworth, Machias, Portland, or Skowhegan to counties.',
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
    '# Batch 353 Maine OFI Contact And Map Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: strengthened the Maine county-local blocker by proving the OFI contact/help lane and sampled `Show Map` shortlinks still add only office addresses, not county routing',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch353MaineOfiContactMapFinalityV1() {
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
          sample_count: 9,
          blocker_code: FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          query_basis: 'Reviewed the official Maine DHHS office stack, OFI contact/help lane, OFI programs-and-services page, and two representative Show Map shortlinks.',
          samples: [
            {
              sample_name: 'Maine DHHS District Office Locations',
              source_url: 'https://www.maine.gov/dhhs/about/contact/offices',
              final_url: 'https://www.maine.gov/dhhs/about/contact/offices',
              verification_status: 'blocked',
              source_type: 'official_office_directory_without_county_fields',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The public table preserves office names, towns, addresses, phones, emails, OFI eligibility links, and Show Map shortlinks, but no county-served or service-area fields.',
            },
            {
              sample_name: 'Maine OFI Contact page',
              source_url: 'https://www.maine.gov/dhhs/ofi/about-us/contact',
              final_url: 'https://www.maine.gov/dhhs/ofi/about-us/contact',
              verification_status: 'blocked',
              source_type: 'official_contact_page_without_county_crosswalk',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The OFI contact page only repeats the District Office locations link plus statewide eligibility and My Maine Connection help routing, with no county crosswalk or service-area table.',
            },
            {
              sample_name: 'Maine OFI Programs & Services page',
              source_url: 'https://www.maine.gov/dhhs/ofi/programs-services',
              final_url: 'https://www.maine.gov/dhhs/ofi/programs-services',
              verification_status: 'blocked',
              source_type: 'official_programs_page_without_office_assignment',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The OFI programs-and-services page stayed live but exposed no county, district-office, service-area, or office-assignment metadata.',
            },
            {
              sample_name: 'Augusta Show Map shortlink',
              source_url: 'https://goo.gl/maps/D71ZqAnXQcp',
              final_url: 'https://www.google.com/maps/place/35+Anthony+Ave,+Augusta,+ME+04330/@44.3470056,-69.7999814,17z/data=!3m1!4b1!4m5!3m4!1s0x4cb203ce85a34707:0x66a6fd6e3b7d6897!8m2!3d44.3470056!4d-69.7977928?shorturl=1',
              verification_status: 'blocked',
              source_type: 'address_geocode_without_county_metadata',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The Show Map shortlink resolves only to a Google Maps address geocode for 35 Anthony Ave, Augusta, ME 04330 and adds no county-served or office-assignment metadata.',
            },
            {
              sample_name: 'Bangor Show Map shortlink',
              source_url: 'https://goo.gl/maps/LRVMzcdK23Mxx7g29',
              final_url: 'https://www.google.com/maps/place/19+Maine+Ave,+Bangor,+ME+04401/@44.7984866,-68.8098102,17z/data=!3m1!4b1!4m5!3m4!1s0x4cae4b192c42e06d:0x34170a29848f7c6c!8m2!3d44.7984828!4d-68.8076215?shorturl=1',
              verification_status: 'blocked',
              source_type: 'address_geocode_without_county_metadata',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The Show Map shortlink resolves only to a Google Maps address geocode for 19 Maine Ave, Bangor, ME 04401 and adds no county-served or office-assignment metadata.',
            },
            ...(row.samples || []).filter((sample) => ![
              'Maine DHHS District Office Locations',
              'Maine OFI Contact page',
              'Maine OFI Programs & Services page',
              'Augusta Show Map shortlink',
              'Bangor Show Map shortlink',
            ].includes(sample.sample_name)).slice(0, 4),
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

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    classifications: updatedQueueRows.reduce((acc, row) => {
      acc[row.classification] = (acc[row.classification] || 0) + 1;
      return acc;
    }, {}),
    indexSafeCount: updatedQueueRows.filter((row) => row.index_safe).length,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'maine'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            completenessPct: 91,
            weakCriticalFamilies: 1,
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: COUNTY_STATUS,
            },
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'hold_for_new_official_county_crosswalk_contract',
          }
        : row
    )),
  };

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'maine',
    classification: 'BLOCKED',
    index_safe: false,
    ofi_contact_page_live: true,
    ofi_programs_services_page_live: true,
    sampled_show_map_shortlinks_live: 2,
    sampled_show_map_shortlinks_are_address_geocodes_only: true,
    sampled_show_map_shortlinks_have_county_metadata: false,
    county_crosswalk_found: false,
    result: 'office_addresses_and_map_geocodes_without_county_routing_contract',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit, idahoSummary));
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
  const result = generateBatch353MaineOfiContactMapFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
