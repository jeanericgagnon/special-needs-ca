import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'arizona_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'arizona_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'arizona_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arizona_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'arizona_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  inventory: path.join(generatedDir, 'arizona_report_cards_county_keyed_district_inventory_v1.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch390_arizona_education_clears_county_local_sole_blocker_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch390-arizona-education-clears-county-local-sole-blocker-report-v1.md'),
};

const BATCH = 'batch390_arizona_education_clears_county_local_sole_blocker_v1';
const PRIMARY_GAP_REASON =
  'des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract';
const RECOMMENDED_BATCH =
  'hold_county_local_until_des_clears_or_ahcccs_publishes_county_to_office_assignments_in_reviewable_html_or_parseable_admin_artifacts';
const EDUCATION_STATUS = 'verified_county_grade';
const EDUCATION_REASON =
  'Reviewed 2026-06-25 one more bounded official Arizona alternative-district lane from the live AZ School Report Cards inventory plus exact district-owned leaves. Coconino County remains cleared through the official CAVIAT detail route and live `https://www.caviat.org/page/504/` leaf. Mohave County now also clears: the official Arizona report-cards detail API for Mohave Valley Elementary District (`educationOrganizationId 4379`) preserved exact coordinates (`latitude 34.9104059`, `longitude -114.6000147`), and the official Census reverse geocoder at `https://geocoding.geo.census.gov/geocoder/geographies/coordinates` returns `Mohave County` from those coordinates. The same district-owned host preserves a live `https://www.mvesd16.org/page/special-services/` leaf plus a public `https://www.mvesd16.org/documents/special-education/3674` surface. Yavapai County also clears through a better official LEA than the prior dead-end accommodation root: the public Arizona report-cards entity list exposes Prescott Unified District (`educationOrganizationId 4466`) in Prescott, its detail API preserves exact coordinates (`latitude 34.5423444`, `longitude -112.4651411`), and the official Census reverse geocoder returns `Yavapai County` from those coordinates. The same district-owned host preserves a live `https://www.prescottschools.com/district-info/departments/ess` page titled `Exceptional Student Services` with rendered `Special Education`, `Procedural Safeguards`, and `Child Find` language, plus a public `Parents Rights Handbook` page on the same host. Arizona district_or_county_education_routing therefore now clears at county grade through reviewed official local leaves across all remaining counties.';
const COUNTY_LOCAL_REASON =
  'Reviewed 2026-06-25 the live Arizona county-local fallback pages more tightly. The DES root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap lanes are still Cloudflare 403 shells. The accessible AHCCCS fallback lane is still public and preserves seven named ALTCS office cards in raw HTML for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma. The exact official county-map artifact at `https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf` is still live as a PDF and remains partly parseable for county names, but it still does not publish a county-to-office table or county assignment contract. The AHCCCS contacts page remains a statewide contact leaf, while the older `Members/AlreadyCovered/MemberResources/ALTCS.html` path now returns an AHCCCS `Page/Document not found` shell rather than a usable county-local fallback. Arizona therefore still lacks county-grade official office routing.';
const COUNTY_LOCAL_EVIDENCE =
  'Reviewed 2026-06-25 bounded Arizona county-local fallback pages after the earlier DES challenge findings and the official AHCCCS PDF lane. The DES host family remains challenge-blocked on the known office-locator and benefits roots. The accessible AHCCCS fallback lane is still live and stronger than the challenged DES lane: `https://www.azahcccs.gov/members/ALTCSlocations.html` returned HTTP 200 and its raw HTML preserved seven named ALTCS office cards for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma. The exact official ALTCS county-map artifact at `https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf` also returned HTTP 200 as a live PDF and remains partially parseable for Arizona county names, but it still does not attach those counties to office addresses, phones, or any repeatable county-to-office assignment contract. `https://www.azahcccs.gov/shared/AHCCCScontacts.html` remains a statewide contact leaf, while the older `https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html` path now returns an AHCCCS `Page/Document not found` shell instead of a usable program leaf. Arizona therefore still lacks a reviewable official county-to-office routing contract.';

const LESSON_HEADING =
  '### Reverse-Geocode Official Coordinates When The One-Line Address Lane Fails';
const LESSON_BODY =
  '*   **Lesson:** If an official state detail API gives exact latitude and longitude but the one-line address geocoder misses, use the official Census `geographies/coordinates` endpoint before leaving the county attachment unresolved. Arizona\'s Mohave Valley and Prescott Unified rows only cleared once the official reverse geocoder returned Mohave County and Yavapai County from the state-provided coordinates.';

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

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text);
}

function main() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);
  const inventoryRows = readJsonl(INPUTS.inventory);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');
  const lessons = fs.readFileSync(INPUTS.lessons, 'utf8');

  const countyLocalBlocker = summary.final_blockers.find((row) => row.family === 'county_local_disability_resources');

  summary.batch = BATCH;
  summary.classification = 'BLOCKED';
  summary.index_safe = false;
  summary.strong_critical_families = 11;
  summary.weak_critical_families = 1;
  summary.completeness_pct = 92;
  summary.primary_gap_reason = PRIMARY_GAP_REASON;
  summary.recommended_batch = RECOMMENDED_BATCH;
  summary.critical_gap_families = ['county_local_disability_resources'];
  summary.major_gap_families = [];
  summary.final_blockers = countyLocalBlocker ? [countyLocalBlocker] : [];
  summary.familyStatuses.district_or_county_education_routing = EDUCATION_STATUS;
  summary.familyStatuses.county_local_disability_resources = 'blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract';

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: EDUCATION_STATUS, status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, status_reason: COUNTY_LOCAL_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'district_or_county_education_routing');

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      family_status: EDUCATION_STATUS,
      evidence_strength: 'strong',
      sample_count: 7,
      query_basis: 'Reviewed 2026-06-25 the Arizona report-cards alternative LEA roots plus district-owned leaves and official reverse-geocoder county attachment for Mohave and Yavapai. Together these preserved a district-specific pages county-to-district mapping contract across the remaining Arizona education counties.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Coconino CAVIAT report-cards detail root',
          source_url: 'https://azreportcards.azed.gov/districts/Detail/79381',
          final_url: 'https://azreportcards.azed.gov/districts/Detail/79381',
          verification_status: 'verified',
          source_type: 'official_state_district_detail_root',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The official Arizona report-cards detail route for Coconino Association for Vocation Industry and Technology preserves the local CAVIAT host, phone 928-645-2737, and a Page, Arizona address that the official Census geocoder resolves to Coconino County.',
        },
        {
          sample_name: 'Coconino CAVIAT 504 leaf',
          source_url: 'https://www.caviat.org/page/504/',
          final_url: 'https://www.caviat.org/page/504/',
          verification_status: 'verified',
          source_type: 'official_district_504_leaf',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The live CAVIAT 504 page preserves annual public nondiscrimination language plus district office contact details on the official district-owned host.',
        },
        {
          sample_name: 'Mohave Valley detail root with reverse-geocoded county',
          source_url: 'https://azreportcards.azed.gov/districts/Detail/4379',
          final_url: 'https://azreportcards.azed.gov/districts/Detail/4379',
          verification_status: 'verified',
          source_type: 'official_state_district_detail_root',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The official Arizona report-cards detail API for Mohave Valley Elementary District preserves exact coordinates, and the official Census reverse geocoder returns `Mohave County` from `34.9104059,-114.6000147`.',
        },
        {
          sample_name: 'Mohave Valley special-services leaf',
          source_url: 'https://www.mvesd16.org/page/special-services/',
          final_url: 'https://www.mvesd16.org/page/special-services/',
          verification_status: 'verified',
          source_type: 'official_district_special_services_leaf',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The district-owned Mohave Valley host preserves a live SPECIAL SERVICES leaf for the same official LEA that reverse-geocodes to Mohave County.',
        },
        {
          sample_name: 'Yavapai Prescott Unified detail root with reverse-geocoded county',
          source_url: 'https://azreportcards.azed.gov/districts/Detail/4466',
          final_url: 'https://azreportcards.azed.gov/districts/Detail/4466',
          verification_status: 'verified',
          source_type: 'official_state_district_detail_root',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The official Arizona report-cards detail API for Prescott Unified District preserves exact coordinates, and the official Census reverse geocoder returns `Yavapai County` from `34.5423444,-112.4651411`.',
        },
        {
          sample_name: 'Prescott Unified Exceptional Student Services leaf',
          source_url: 'https://www.prescottschools.com/district-info/departments/ess',
          final_url: 'https://www.prescottschools.com/district-info/departments/ess',
          verification_status: 'verified',
          source_type: 'official_district_special_education_leaf',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The Prescott Unified district-owned ESS page is titled `Exceptional Student Services` and renders `Special Education`, `Procedural Safeguards`, and `Child Find` language.',
        },
        {
          sample_name: 'Prescott Unified Parents Rights Handbook',
          source_url: 'https://www.prescottschools.com/family-community/parents-rights-handbook',
          final_url: 'https://www.prescottschools.com/family-community/parents-rights-handbook',
          verification_status: 'verified',
          source_type: 'official_district_parent_rights_leaf',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The same district-owned Prescott Unified host preserves a live `Parents Rights Handbook` page with `Exceptional Student Services` and `Special Education` language.',
        },
      ],
    };
  }).map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      query_basis: 'Reviewed 2026-06-25 the live AHCCCS ALTCS offices HTML page, the exact live ALTCS county-map PDF path, the statewide AHCCCS contacts leaf, the stale ALTCS member-resource path, and the still-challenged DES office roots to test whether any county-to-office contract is publicly reviewable.',
      blocker_code: 'des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract',
      blocker_evidence: COUNTY_LOCAL_EVIDENCE,
      sample_count: 5,
      samples: [
        {
          sample_name: 'AHCCCS ALTCS Offices page',
          source_url: 'https://www.azahcccs.gov/members/ALTCSlocations.html',
          final_url: 'https://www.azahcccs.gov/members/ALTCSlocations.html',
          verification_status: 'reviewed',
          source_type: 'official_html_office_inventory_without_county_contract',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The live official ALTCS Offices page preserves seven named office cards for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma, but the raw HTML still does not publish counties served by each office.',
        },
        {
          sample_name: 'AHCCCS ALTCS County Map PDF',
          source_url: 'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf',
          final_url: 'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf',
          verification_status: 'reviewed',
          source_type: 'official_pdf_county_map_without_office_assignments',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The exact live ALTCS county-map PDF is still partially parseable for county names, but it still does not attach those counties to office addresses, phones, or a repeatable county-to-office contract.',
        },
        {
          sample_name: 'AHCCCS Contacts page',
          source_url: 'https://www.azahcccs.gov/shared/AHCCCScontacts.html',
          final_url: 'https://www.azahcccs.gov/shared/AHCCCScontacts.html',
          verification_status: 'reviewed',
          source_type: 'official_statewide_contact_leaf',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The AHCCCS Contacts page remains a statewide contact leaf and does not assign counties to ALTCS office locations.',
        },
        {
          sample_name: 'Stale ALTCS member-resource path',
          source_url: 'https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html',
          final_url: 'https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html',
          verification_status: 'blocked',
          source_type: 'official_page_document_not_found_shell',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The older AHCCCS ALTCS member-resource path now returns a `Page/Document not found` shell and cannot serve as a live county-local fallback.',
        },
        {
          sample_name: 'DES office locator remains challenged',
          source_url: 'https://des.az.gov/office-locator',
          final_url: 'https://des.az.gov/office-locator',
          verification_status: 'blocked',
          source_type: 'challenge_blocked_office_locator',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The DES office-locator lane still returns a Cloudflare challenge shell, so the official DES county-office path remains non-reviewable.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'district_or_county_education_routing')
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedInventoryRows = inventoryRows.map((row) => {
    if (row.county_id === 'mohave-az') {
      return {
        ...row,
        educationOrganizationId: 4379,
        district_name: 'Mohave Valley Elementary District',
        detail_url: 'https://azreportcards.azed.gov/districts/Detail/4379',
        api_url: 'https://azreportcards.azed.gov/api/Entity/GetEntity?id=4379&fiscalYear=2025',
        district_website: 'https://www.mvesd16.org/',
        telephone: '928-768-2507',
        address: '8450 S OLIVE AVE, MOHAVE VALLEY, AZ86440-9214',
        geocoded_county_id: 'mohave-az',
        geocode_source: 'official_census_reverse_geocoder_coordinates',
        fetched_at: '2026-06-25T00:00:00.000Z',
        evidence_snippet: 'Mohave Valley Elementary District is exposed on the official report-cards host through a district detail route, and the exact coordinates from that detail API reverse-geocode to Mohave County on the official Census geocoder.',
      };
    }
    if (row.county_id === 'yavapai-az') {
      return {
        ...row,
        educationOrganizationId: 4466,
        district_name: 'Prescott Unified District',
        detail_url: 'https://azreportcards.azed.gov/districts/Detail/4466',
        api_url: 'https://azreportcards.azed.gov/api/Entity/GetEntity?id=4466&fiscalYear=2025',
        district_website: 'https://www.prescottschools.com/',
        telephone: '928-445-5400',
        address: '300 E GURLEY ST, PRESCOTT, AZ86301-3823',
        geocoded_county_id: 'yavapai-az',
        geocode_source: 'official_census_reverse_geocoder_coordinates',
        fetched_at: '2026-06-25T00:00:00.000Z',
        evidence_snippet: 'Prescott Unified District is exposed on the official report-cards host through a district detail route, and the exact coordinates from that detail API reverse-geocode to Yavapai County on the official Census geocoder.',
      };
    }
    return row;
  });

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'arizona'
      ? {
          ...row,
          completeness_pct: 92,
          weak_critical_families: 1,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: RECOMMENDED_BATCH,
        }
      : row
  ));

  const auditRow = audit.states.find((row) => row.stateId === 'arizona');
  auditRow.strongCriticalFamilies = 11;
  auditRow.weakCriticalFamilies = 1;
  auditRow.completenessPct = 92;
  auditRow.familyStatuses.district_or_county_education_routing = EDUCATION_STATUS;
  auditRow.packetBatch = BATCH;
  auditRow.packetPrimaryGapReason = PRIMARY_GAP_REASON;
  auditRow.packetRecommendedBatch = RECOMMENDED_BATCH;

  const updatedReport = [
    '# Arizona California-Grade Audit Report v2',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- completeness_pct: 92',
    '- county_count: 15',
    `- primary_gap_reason: ${PRIMARY_GAP_REASON}`,
    '',
    '## Family status',
    '',
    ...updatedGapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Failure ledger',
    '',
    ...updatedFailureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...updatedVerifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...updatedNextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Repair decision',
    '',
    '- Arizona remains BLOCKED and not index-safe.',
    '- Education now clears at county grade: Coconino remains covered through CAVIAT, Mohave clears through Mohave Valley Elementary plus official reverse-geocoded county attachment, and Yavapai clears through Prescott Unified plus a district-owned Exceptional Student Services leaf and Parents Rights Handbook.',
    '- County-local remains the sole blocker because the public DES lane is still challenged and the accessible AHCCCS ALTCS artifacts still stop short of a county-to-office assignment contract.',
    '- Arizona should only reopen next on county-local unless a stronger official office-routing contract appears.',
    '',
  ].join('\n');

  const updatedAllStateReport = allStateReport.replace(
    /- Arizona remains blocked[^\n]*/,
    '- Arizona remains blocked only on county-local disability routing: education now clears through official local leaves in Coconino, Mohave, and Yavapai, but the DES lane is still challenged and the AHCCCS ALTCS HTML/PDF artifacts still do not publish a county-to-office contract.',
  );

  const updatedHandoff = handoff
    .replace(
      /- Arizona: `[^\n]+`/,
      `- Arizona: \`${PRIMARY_GAP_REASON}\``,
    )
    .replace(
      /## Current Focus State:[\s\S]*$/,
      `## Current Focus State: Arizona

### Blocker Reason

\`county_local_disability_resources\` is now the only remaining Arizona blocker. Education no longer controls the state packet: Coconino still clears through the official CAVIAT root plus its live 504 leaf; Mohave now clears because the official Arizona report-cards detail API for Mohave Valley Elementary District preserves exact coordinates that reverse-geocode to Mohave County on the official Census geocoder, and the same district-owned host exposes a live SPECIAL SERVICES leaf; Yavapai now clears because the official Arizona report-cards entity list exposes Prescott Unified District, its detail API preserves exact coordinates that reverse-geocode to Yavapai County, and the same district-owned host preserves a live \`Exceptional Student Services\` page plus a \`Parents Rights Handbook\`. Arizona therefore remains BLOCKED only because the county-local office-routing family still lacks a reviewable official county-to-office assignment contract.

### Exact Evidence Needed

- Any official DES county office directory, county assignment table, or office-locator surface that becomes reviewable without the current challenge shell.
- Any official AHCCCS ALTCS county-to-office contract in HTML, PDF, or another static admin artifact that explicitly maps counties to offices.
- Any official Arizona county-admin or state-admin crosswalk that assigns counties to disability-routing offices.

### Useful Official URLs Already Tried

- [AHCCCS ALTCS locations HTML](https://www.azahcccs.gov/members/ALTCSlocations.html)
- [AHCCCS ALTCS county map PDF lane](https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html)
- [AHCCCS contacts page](https://www.azahcccs.gov/shared/AHCCCScontacts.html)
- [DES office locator](https://des.az.gov/office-locator)
- [DES root](https://des.az.gov/)
- [University Family Care oversight page](https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html)
- [County Administrator Office PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf)

### Top Remaining Source-Scouting Targets

- Any newly reviewable DES county office assignment surface.
- Any official AHCCCS ALTCS county-to-office assignment artifact.
- Any official Arizona county-admin office-routing contract that survives static review.

## Next State Order After Arizona

1. New Hampshire
`,
    );

  let updatedLessons = lessons;
  if (!updatedLessons.includes(LESSON_HEADING)) {
    updatedLessons = `${updatedLessons.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`;
  }

  writeJson(INPUTS.summary, summary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeText(INPUTS.report, `${updatedReport}\n`);
  writeJsonl(INPUTS.inventory, updatedInventoryRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, audit);
  writeText(INPUTS.allStateReport, updatedAllStateReport.endsWith('\n') ? updatedAllStateReport : `${updatedAllStateReport}\n`);
  writeText(INPUTS.handoff, updatedHandoff.endsWith('\n') ? updatedHandoff : `${updatedHandoff}\n`);
  writeText(INPUTS.lessons, updatedLessons);

  writeJson(OUTPUTS.summary, {
    batch: BATCH,
    state: 'arizona',
    classification: 'BLOCKED',
    index_safe: false,
    education_status: EDUCATION_STATUS,
    county_local_status: 'blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract',
    mohave_reverse_geocode_county: 'Mohave County',
    yavapai_reverse_geocode_county: 'Yavapai County',
    sole_blocker: 'county_local_disability_resources',
    completeness_pct: 92,
    counts_unchanged: {
      complete: 40,
      blocked: 10,
      indexSafe: 40,
    },
  });

  writeText(OUTPUTS.report, [
    '# Batch 390 Arizona Education Clears, County-Local Sole Blocker v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: Arizona education now clears at county grade; county-local disability routing is the sole remaining blocker',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    '',
    '## Remaining blocker',
    '',
    `- ${COUNTY_LOCAL_EVIDENCE}`,
    '',
  ].join('\n'));
}

main();
