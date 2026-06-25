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
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch364_maine_search_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch364-maine-search-finality-report-v1.md'),
  evidence: path.join(generatedDir, 'maine_county_local_routing_evidence_v1.json'),
};

const BATCH_NAME = 'batch364_maine_search_finality_v1';
const PRIMARY_GAP_REASON =
  'official_dhhs_nav_stack_and_official_maine_search_still_expose_office_addresses_and_labels_but_no_county_or_service_area_contract';
const COUNTY_STATUS =
  'blocked_public_dhhs_nav_stack_and_state_search_without_county_to_office_or_service_area_assignment_contract';
const FAILURE_CODE =
  'official_dhhs_nav_stack_and_maine_search_confirm_office_and_admin_surfaces_but_zero_county_assignment_fields';
const NEXT_ACTION =
  'hold_blocked_until_official_maine_dhhs_ofi_or_maine_search_surface_exposes_county_to_office_or_service_area_routing';
const COUNTY_REASON =
  'Reviewed 2026-06-25 one more bounded official Maine county-local pass across the live DHHS navigation stack, the official Maine search host using its real `search=` query parameter, and the current OFI county workbooks. District Office Locations, OFI Contact, OFI Programs & Services, Offices/Divisions, Administrative Office Locations, the DHHS sitemap, sampled `Show Map` shortlinks, and the county/counties-and-town workbooks still preserve office names, office towns, street addresses, phones, emails, program labels, office/division descriptions, map shortlinks, or county/town program counts, but they still expose zero county-served fields, zero service-area labels, and zero county-to-office assignment metadata. The official search pages still return only the generic Google CSE shell titled `Maine.gov: Search IFW`, with no server-rendered county-routing or district-office assignment result. Maine therefore still has official office-grade address proof and county count workbooks without any truthful county-to-office or county-to-service-area routing contract on the public host family.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-25 bounded official Maine DHHS/OFI navigation-stack surfaces on `https://www.maine.gov/dhhs/about/contact/offices`, `https://www.maine.gov/dhhs/ofi/about-us/contact`, `https://www.maine.gov/dhhs/ofi/programs-services`, `https://www.maine.gov/dhhs/offices-divisions`, `https://www.maine.gov/dhhs/about/contact/administrative-offices`, `https://www.maine.gov/dhhs/about/sitemap`, two representative `Show Map` shortlinks from the district office table, official Maine search queries such as `https://www.maine.gov/search/?search=Aroostook%20district%20office%20dhhs` and `https://www.maine.gov/search/?search=county%20district%20office%20ofi`, and the current OFI workbooks `May 2026 Summary Counts By County.xlsx` and `May 2026 Summary Counts By County And Town.xlsx`. The live district office page still preserves district office names, office towns and addresses, phones, emails, map shortlinks, and OFI program links, but zero county names, zero county-served labels, and zero service-area fields in public HTML. The OFI contact page still only points back to `District Office locations` and statewide eligibility/help routing. The OFI programs-and-services page stays live but exposes no county or office-assignment metadata. The Offices/Divisions page and Administrative Office Locations page add office and division descriptions plus administrative addresses such as Family Independence in Augusta and Health Insurance Marketplace in Portland, but still no county-served or service-area routing fields. The DHHS sitemap only reconfirms the same office leaves. The representative `Show Map` shortlinks resolved only to Google Maps address geocodes for `35 Anthony Ave, Augusta, ME 04330` and `19 Maine Ave, Bangor, ME 04401`, adding no county names, no district-office identifiers, and no county-to-office routing fields. The official Maine search host using its real `search=` parameter still returns only the generic Google CSE shell titled `Maine.gov: Search IFW`, with the `<div class=\"gcse-search\" data-queryParameterName=\"search\" ...>` container but no server-rendered county-routing or district-office assignment results. The current county workbook headers still begin with `COUNTY` plus count columns, and the county-and-town workbook headers still begin with `COUNTY`, `TOWN`, and count columns; neither workbook binds counties or towns to district office names or service areas. Maine therefore still has official office addresses and county counts without any public county-assignment contract.';

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
    '- County-local remains blocked because the full public DHHS navigation stack plus the official Maine search host still prove office locations and office labels, not county-to-office or service-area routing.',
  ].join('\n') + '\n';
}

function buildEvidenceArtifact() {
  return {
    state: 'maine',
    generated_at: new Date().toISOString(),
    county_local: {
      reviewed_sources: [
        {
          source_url: 'https://www.maine.gov/dhhs/about/contact/offices',
          authority: 'Maine Department of Health and Human Services',
          review_date: '2026-06-25',
          finding: 'district_office_directory_lists_office_contacts_but_no_county_or_service_area_fields',
          evidence_excerpt: 'The official district office page lists office names, towns, street addresses, phones, emails, and OFI links, but no county-served or service-area fields.',
        },
        {
          source_url: 'https://www.maine.gov/dhhs/ofi/about-us/contact',
          authority: 'Maine Office for Family Independence',
          review_date: '2026-06-25',
          finding: 'ofi_contact_page_routes_to_district_offices_and_statewide_help_only',
          evidence_excerpt: 'The OFI contact page points back to District Office locations and the statewide eligibility phone 1 (855) 797-4357, with no county crosswalk.',
        },
        {
          source_url: 'https://www.maine.gov/search/?search=Aroostook%20district%20office%20dhhs',
          authority: 'Maine.gov',
          review_date: '2026-06-25',
          finding: 'official_search_host_still_returns_generic_google_cse_shell',
          evidence_excerpt: 'The public Maine search host still returns the generic shell titled "Maine.gov: Search IFW" with a `gcse-search` container and no server-rendered county-routing or district-office assignment result.',
        },
        {
          source_url: 'https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County.xlsx',
          authority: 'Maine Department of Health and Human Services',
          review_date: '2026-06-25',
          finding: 'county_workbook_reports_counts_only_without_office_binding',
          evidence_excerpt: 'The official county workbook headers begin with `COUNTY` and count columns only; it does not bind counties to district office names or service areas.',
        },
        {
          source_url: 'https://www.maine.gov/dhhs/sites/maine.gov.dhhs/files/inline-files/May%202026%20Summary%20Counts%20By%20County%20And%20Town.xlsx',
          authority: 'Maine Department of Health and Human Services',
          review_date: '2026-06-25',
          finding: 'county_and_town_workbook_reports_counts_only_without_office_binding',
          evidence_excerpt: 'The official county-and-town workbook headers begin with `COUNTY`, `TOWN`, and count columns only; it still does not expose office names, office identifiers, or service-area routing fields.',
        },
      ],
      blocker_summary: 'Reviewed official Maine DHHS, OFI, search-host, and workbook lanes still preserve office contacts and county/town counts without any public county-to-office or service-area assignment contract.',
    },
  };
}

function buildBatchReport() {
  return [
    '# Batch 364 Maine Search Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: strengthened the Maine county-local blocker by confirming the real official Maine search parameter still yields only a generic CSE shell and the current OFI workbooks remain counts-only',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch364MaineSearchFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

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
          sample_count: 13,
          blocker_code: FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          query_basis: 'Reviewed the official Maine DHHS district-office stack, OFI contact/help pages, administrative office pages, sitemap, representative Show Map shortlinks, and official Maine search query pages.',
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
              sample_name: 'Official Maine Search: Aroostook district office dhhs',
              source_url: 'https://www.maine.gov/search/?search=Aroostook%20district%20office%20dhhs',
              final_url: 'https://www.maine.gov/search/?search=Aroostook%20district%20office%20dhhs',
              verification_status: 'reviewed',
              source_type: 'official_state_search_shell_without_role_results',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The public Maine search page stayed live but returned only the generic Google CSE shell titled `Maine.gov: Search IFW`, with no server-rendered county-routing or district-office assignment result.',
            },
            {
              sample_name: 'Official Maine Search: county district office ofi',
              source_url: 'https://www.maine.gov/search/?search=county%20district%20office%20ofi',
              final_url: 'https://www.maine.gov/search/?search=county%20district%20office%20ofi',
              verification_status: 'reviewed',
              source_type: 'official_state_search_shell_without_role_results',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The official search host preserved no county terms, no office-assignment table, and no recoverable Maine DHHS county-routing leaf in server-rendered HTML for the sampled county-office query.',
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
              source_type: 'official_nav_stack_and_search_without_county_assignment_contract',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'Across the DHHS contact stack and official search host, the public state surfaces preserve office addresses and labels, but nowhere assign counties or service areas to those offices.',
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
    official_maine_search_live: true,
    official_maine_search_county_queries_with_role_results: 0,
    official_maine_search_title: 'Maine.gov: Search IFW',
    sampled_show_map_shortlinks_live: 2,
    sampled_show_map_shortlinks_are_address_geocodes_only: true,
    sampled_show_map_shortlinks_have_county_metadata: false,
    county_workbook_live: true,
    county_workbook_header_starts_with_county_only: true,
    county_and_town_workbook_live: true,
    county_and_town_workbook_header_starts_with_county_and_town_only: true,
    county_crosswalk_found: false,
    result: 'official_nav_stack_and_state_search_office_addresses_and_labels_without_county_routing_contract',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());
  writeJson(OUTPUTS.evidence, buildEvidenceArtifact());

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch364MaineSearchFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
