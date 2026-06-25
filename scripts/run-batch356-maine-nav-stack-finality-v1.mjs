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
  idahoSummary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch356_maine_nav_stack_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch356-maine-nav-stack-finality-report-v1.md'),
};

const BATCH_NAME = 'batch356_maine_nav_stack_finality_v1';
const PRIMARY_GAP_REASON =
  'official_dhhs_nav_stack_still_exposes_office_addresses_and_labels_but_no_county_or_service_area_contract';
const COUNTY_STATUS =
  'blocked_public_dhhs_nav_stack_without_county_to_office_or_service_area_assignment_contract';
const FAILURE_CODE =
  'official_dhhs_nav_stack_confirms_office_and_admin_surfaces_but_zero_county_assignment_fields';
const NEXT_ACTION =
  'hold_blocked_until_official_maine_dhhs_or_ofi_surface_exposes_county_to_office_or_service_area_routing';
const COUNTY_REASON =
  'Reviewed 2026-06-25 one more bounded official Maine DHHS navigation-stack pass across District Office Locations, OFI Contact, OFI Programs & Services, Offices/Divisions, Administrative Office Locations, the DHHS sitemap, and representative `Show Map` shortlinks. The current public stack still preserves office names, office towns, street addresses, phones, emails, program labels, office/division descriptions, and map shortlinks, but it still exposes zero county-served fields, zero service-area labels, and zero county-to-office assignment metadata. The district office page remains the strongest office-address source; the OFI contact/help lane only loops back to district offices plus statewide eligibility routing; Offices/Divisions and Administrative Office Locations add more office labels and addresses but no county routing; the sitemap only confirms the same public office leaves; and the sampled `Show Map` shortlinks still resolve only to raw Google Maps address geocodes. Maine therefore still has official office-grade address proof without any truthful county-to-office or county-to-service-area routing contract on the public host family.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-25 bounded official Maine DHHS/OFI navigation-stack surfaces on `https://www.maine.gov/dhhs/about/contact/offices`, `https://www.maine.gov/dhhs/ofi/about-us/contact`, `https://www.maine.gov/dhhs/ofi/programs-services`, `https://www.maine.gov/dhhs/offices-divisions`, `https://www.maine.gov/dhhs/about/contact/administrative-offices`, `https://www.maine.gov/dhhs/about/sitemap`, and two representative `Show Map` shortlinks from the district office table. The live district office page still preserves district office names, office towns and addresses, phones, emails, map shortlinks, and OFI program links, but zero county names, zero county-served labels, and zero service-area fields in public HTML. The OFI contact page still only points back to `District Office locations` and statewide eligibility/help routing. The OFI programs-and-services page stays live but exposes no county or office-assignment metadata. The Offices/Divisions page and Administrative Office Locations page add office and division descriptions plus administrative addresses such as Family Independence in Augusta and Health Insurance Marketplace in Portland, but still no county-served or service-area routing fields. The DHHS sitemap only reconfirms the same office leaves. The representative `Show Map` shortlinks resolved only to Google Maps address geocodes for `35 Anthony Ave, Augusta, ME 04330` and `19 Maine Ave, Bangor, ME 04401`, adding no county names, no district-office identifiers, and no county-to-office routing fields. Maine therefore still has official office addresses and office labels without any public county-assignment contract.';

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
    '- County-local remains blocked because the full public DHHS navigation stack still proves office locations and office labels, not county-to-office or service-area routing.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const lines = text.split('\n').filter((line) => !line.startsWith('- Maine remains blocked'));
  const next = '- Maine remains blocked after a fuller DHHS navigation-stack finality check: District Office Locations, OFI Contact, OFI Programs & Services, Offices/Divisions, Administrative Office Locations, sitemap, and sampled `Show Map` links still expose office addresses and labels but no county-to-office or service-area contract.';
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
    '`county_local_disability_resources` is still the only remaining Maine critical blocker. One more bounded official pass widened from the OFI contact/help lane to the broader DHHS public navigation stack. District Office Locations still preserves office towns, addresses, phones, emails, map shortlinks, and OFI program notes, but no county-served or service-area fields. OFI Contact only loops back to district offices plus statewide eligibility/help routing. OFI Programs & Services stays generic. Offices/Divisions and Administrative Office Locations add office and division labels plus addresses like Family Independence in Augusta and Health Insurance Marketplace in Portland, but still no county routing. The DHHS sitemap only reconfirms the same office leaves. And sampled `Show Map` shortlinks still only resolve to raw Google Maps address geocodes such as `35 Anthony Ave, Augusta, ME 04330` and `19 Maine Ave, Bangor, ME 04401`. Maine remains BLOCKED because the official host family still proves office addresses and office labels, not county assignment.',
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
    '- [Maine OFI Contact page](https://www.maine.gov/dhhs/ofi/about-us/contact)',
    '- [Maine OFI Programs & Services](https://www.maine.gov/dhhs/ofi/programs-services)',
    '- [Maine DHHS Offices/Divisions](https://www.maine.gov/dhhs/offices-divisions)',
    '- [Maine DHHS Administrative Office Locations](https://www.maine.gov/dhhs/about/contact/administrative-offices)',
    '- [Maine DHHS Sitemap](https://www.maine.gov/dhhs/about/sitemap)',
    '- [Sample Show Map: Augusta office](https://goo.gl/maps/D71ZqAnXQcp)',
    '- [Sample Show Map: Bangor office](https://goo.gl/maps/LRVMzcdK23Mxx7g29)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official DHHS/OFI workbook or export that contains office names plus county or service-area fields, not just program counts or address maps.',
    '- Any official office-assignment artifact behind the district office page, administrative office page, or reports lane that binds district offices to counties.',
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
    '# Batch 356 Maine Nav Stack Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: widened the Maine county-local blocker from the OFI contact/help lane to the full live DHHS navigation stack, which still exposes office labels and addresses but no county routing',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch356MaineNavStackFinalityV1() {
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
          sample_count: 11,
          blocker_code: FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          query_basis: 'Reviewed the official Maine DHHS district-office stack, OFI contact/help pages, administrative office pages, sitemap, and representative Show Map shortlinks.',
          samples: [
            {
              sample_name: 'Maine DHHS District Office Locations',
              source_url: 'https://www.maine.gov/dhhs/about/contact/offices',
              final_url: 'https://www.maine.gov/dhhs/about/contact/offices',
              verification_status: 'reviewed',
              source_type: 'official_public_district_office_directory_without_county_fields',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The page lists district office names, towns, addresses, phones, emails, and OFI links, but it does not expose county-served or service-area fields.',
            },
            {
              sample_name: 'Maine OFI Contact page',
              source_url: 'https://www.maine.gov/dhhs/ofi/about-us/contact',
              final_url: 'https://www.maine.gov/dhhs/ofi/about-us/contact',
              verification_status: 'reviewed',
              source_type: 'official_contact_page_without_county_crosswalk',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The page only points back to District Office locations and statewide eligibility/help routing, with no county crosswalk or office-assignment table.',
            },
            {
              sample_name: 'Maine OFI Programs & Services page',
              source_url: 'https://www.maine.gov/dhhs/ofi/programs-services',
              final_url: 'https://www.maine.gov/dhhs/ofi/programs-services',
              verification_status: 'reviewed',
              source_type: 'official_program_index_without_local_routing_metadata',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The page stays generic and program-focused; it exposes no county names, no office-assignment metadata, and no service-area labels.',
            },
            {
              sample_name: 'Maine DHHS Offices/Divisions page',
              source_url: 'https://www.maine.gov/dhhs/offices-divisions',
              final_url: 'https://www.maine.gov/dhhs/offices-divisions',
              verification_status: 'reviewed',
              source_type: 'official_office_index_without_county_assignment',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The page describes DHHS offices and divisions such as Aging and Disability Services and Family Independence, but adds no county-served or service-area routing fields.',
            },
            {
              sample_name: 'Maine DHHS Administrative Office Locations',
              source_url: 'https://www.maine.gov/dhhs/about/contact/administrative-offices',
              final_url: 'https://www.maine.gov/dhhs/about/contact/administrative-offices',
              verification_status: 'reviewed',
              source_type: 'official_administrative_office_directory_without_county_assignment',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The page adds administrative office addresses like Family Independence in Augusta and the Health Insurance Marketplace in Portland, but still no county-served or service-area fields.',
            },
            {
              sample_name: 'Maine DHHS Sitemap',
              source_url: 'https://www.maine.gov/dhhs/about/sitemap',
              final_url: 'https://www.maine.gov/dhhs/about/sitemap',
              verification_status: 'reviewed',
              source_type: 'official_sitemap_reconfirming_same_office_leaves',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The DHHS sitemap reconfirms District Office Locations and Administrative Office Locations, but adds no county crosswalk or service-area leaf.',
            },
            {
              sample_name: 'Augusta Show Map shortlink',
              source_url: 'https://goo.gl/maps/D71ZqAnXQcp',
              final_url: 'https://maps.google.com/',
              verification_status: 'reviewed',
              source_type: 'google_maps_address_geocode_only',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The shortlink resolves only to the Augusta street address geocode for 35 Anthony Ave, adding no county or office-assignment metadata.',
            },
            {
              sample_name: 'Bangor Show Map shortlink',
              source_url: 'https://goo.gl/maps/LRVMzcdK23Mxx7g29',
              final_url: 'https://maps.google.com/',
              verification_status: 'reviewed',
              source_type: 'google_maps_address_geocode_only',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The shortlink resolves only to the Bangor street address geocode for 19 Maine Ave, adding no county or office-assignment metadata.',
            },
            {
              sample_name: 'Maine OFI county workbook (counts only)',
              source_url: 'https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County.xlsx',
              final_url: 'https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County.xlsx',
              verification_status: 'reviewed',
              source_type: 'official_county_counts_without_office_binding',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The county workbook reports program counts by county, but it does not bind counties to DHHS/OFI office names or service areas.',
            },
            {
              sample_name: 'Maine OFI county and town workbook (counts only)',
              source_url: 'https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County%20And%20Town.xlsx',
              final_url: 'https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County%20And%20Town.xlsx',
              verification_status: 'reviewed',
              source_type: 'official_county_town_counts_without_office_binding',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The county-and-town workbook adds locality counts, but it still does not expose office names, office identifiers, or county-to-office routing fields.',
            },
            {
              sample_name: 'Maine DHHS contact navigation stack',
              source_url: 'https://www.maine.gov/dhhs/about/contact/offices',
              final_url: 'https://www.maine.gov/dhhs/about/contact/offices',
              verification_status: 'reviewed',
              source_type: 'official_nav_stack_without_county_assignment_contract',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'Across the DHHS contact stack, the public host preserves office addresses and labels, but nowhere assigns counties or service areas to those offices.',
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

  const updatedAudit = {
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

  const batchSummary = {
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    dhhs_district_office_page_live: true,
    ofi_contact_page_live: true,
    ofi_programs_services_page_live: true,
    offices_divisions_page_live: true,
    administrative_offices_page_live: true,
    dhhs_sitemap_page_live: true,
    sampled_show_map_shortlinks_live: 2,
    sampled_show_map_shortlinks_are_address_geocodes_only: true,
    sampled_show_map_shortlinks_have_county_metadata: false,
    county_crosswalk_found: false,
    result: 'official_nav_stack_office_addresses_and_labels_without_county_routing_contract',
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
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch356MaineNavStackFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
