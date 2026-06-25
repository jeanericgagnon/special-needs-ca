import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'minnesota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'minnesota_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'minnesota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'minnesota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'minnesota_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch333_minnesota_live_route_and_dhs_404_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch333-minnesota-live-route-and-dhs-404-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'browser_reviewed_mdeorg_and_mn_dhs_successor_routes_now_clear_minnesota_to_complete';

const DISTRICT_STATUS = 'verified_browser_reviewed_official_mdeorg_county_directory_and_special_education_contacts';
const DISTRICT_REASON = 'Minnesota education now clears from browser-reviewed official MDE-ORG pages on the public MDE host. The public `Schools and Districts` route exposes district listings plus a `Special Education Directors` contact list and extract link. The public `Counties` route lists all 87 Minnesota counties and explicitly says users can click a county name to view all organizations located within that county. County member pages then enumerate district members, and district detail leaves preserve superintendent name, email, phone, website, physical address, and county on the same official host. That combination is enough to verify county-grade district routing without relying on the unstable raw-fetch-only root or export lane.';

const COUNTY_STATUS = 'verified_browser_reviewed_official_mn_dhs_county_tribal_state_directory';
const COUNTY_REASON = 'Minnesota county-local routing now clears from the exact first-party DHS successor route. The saved disability-services replacement URLs still return official DHS 404 pages, but the named successor `Minnesota Health Care Program county, Tribal and state directory` is browser-readable on the official DHS host and publicly exposes county, Tribal, and state office entries with office name, mailing address, phone, and fax. The reviewed page shows early alphabet county entries like `Aitkin County` and `Anoka County`, a Tribal entry such as `White Earth Financial Services`, and late alphabet county coverage through `Yellow Medicine County`, which is enough to establish a county-grade public office contract on the official host.';

const LESSON_HEADING = '### Browser-Readable Child Routes Can Clear A Flapping Raw-Fetch Directory';
const LESSON_BODY = '*   **Lesson:** If raw fetches on an official directory family flap into bot protection but exact browser-reviewed child routes stay publicly readable, prefer the stable reviewed child pages over the unstable raw root. Minnesota MDE-ORG still flapped under raw fetch, yet the exact `Schools and Districts`, `Counties`, county-member, district-detail, and `Special Education Director` pages were publicly readable on the official host and were strong enough to clear county-grade education routing.';
const LESSON_HEADING_2 = '### Official 404 Shells Can Still Expose The Real Successor Lane';
const LESSON_BODY_2 = '*   **Lesson:** If an official 404 shell links a named successor route, verify that exact successor before freezing the blocker. Minnesota DHS disability-services replacements still 404, but the same shell exposed `county-tribal-state-offices.jsp`, which turned the blocker from “no successor found” into the more exact truth that the successor exists but is bot-gated.';
const LESSON_HEADING_3 = '### Browser-Reviewed Successor Directories Can Retire A Raw-Fetch Blocker';
const LESSON_BODY_3 = '*   **Lesson:** If bounded raw fetches still return challenge-like shells but the exact first-party successor route is publicly readable in the browser with county-grade rows, promote from the reviewed successor evidence instead of holding the state blocked on the raw shell. Minnesota DHS cleared only after the exact county/Tribal/state directory was reviewed directly and shown to publish real county and Tribal office entries across the alphabet.';

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

function appendLessons() {
  let text = fs.readFileSync(INPUTS.lessons, 'utf8');
  let changed = false;
  if (!text.includes(LESSON_HEADING)) {
    text = `${text.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`;
    changed = true;
  }
  if (!text.includes(LESSON_HEADING_2)) {
    text = `${text.trimEnd()}\n\n${LESSON_HEADING_2}\n${LESSON_BODY_2}\n`;
    changed = true;
  }
  if (!text.includes(LESSON_HEADING_3)) {
    text = `${text.trimEnd()}\n\n${LESSON_HEADING_3}\n${LESSON_BODY_3}\n`;
    changed = true;
  }
  if (changed) fs.writeFileSync(INPUTS.lessons, text);
  return changed;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Minnesota California-Grade Audit Report v2',
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
    ...(failureRows.length ? failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`) : ['- none']),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...(nextRows.length ? nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`) : ['- none']),
    '',
    '## Completion decision',
    '',
    '- Minnesota is now COMPLETE and index_safe=true.',
    '- district_or_county_education_routing is verified from browser-reviewed official MDE-ORG county and district pages, county member pages, district detail leaves, and the public Special Education Director contact list.',
    '- county_local_disability_resources is verified from the browser-reviewed official DHS county/Tribal/state successor directory, which publishes county and Tribal office entries with contact details on the public host.',
    '- parent_training_information_center remains verified and is not a current blocker.',
  ].join('\n') + '\n';
}

function updateAllStateReport() {
  let text = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const staleBullets = [
    '- Minnesota remains blocked, and the stricter live truth is now: the MDE description page is public, the MDE-ORG root flaps between a live glossary page and Radware, the district/county/contact/analytics routes stay bot-gated, and the DHS disability-services 404 shell points to a named county/tribal/state successor route that is also bot-gated.',
    '- Minnesota is still blocked overall, but education now clears from browser-reviewed official MDE-ORG county and district pages; the only remaining critical blocker is the DHS county/tribal/state directory successor, which still redirects into Radware.',
  ];
  for (const bullet of staleBullets) {
    text = text.replace(`${bullet}\n`, '');
  }
  const newBullet = '- Minnesota is now COMPLETE and index-safe: browser-reviewed official MDE-ORG county and district routes clear education, and the exact official DHS county/Tribal/state successor directory now clears county-local office routing on the public host.';
  if (!text.includes(newBullet)) text = `${text.trimEnd()}\n${newBullet}\n`;
  fs.writeFileSync(INPUTS.allStateReport, text);
}

function updateHandoff() {
  let text = fs.readFileSync(INPUTS.handoff, 'utf8');
  text = text.replace(/- Minnesota: `[^`]+`\n/g, '');
  text = text.replace(
    'Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oregon, Pennsylvania, South Carolina, Texas, Utah',
    'Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New York, North Carolina, Ohio, Oregon, Pennsylvania, South Carolina, Texas, Utah'
  );

  const focusSection = `## Current Focus State: Maine

### Blocker Reason

Maine no longer has an education blocker. The live official Superintendent-by-SAU and Superintendent-by-Town selectors on the Maine DOE NEO host both materialize real Bangor local superintendent rows with address, phone, fax, and email on bounded replay. The only remaining critical blocker is \`county_local_disability_resources\`: the official DHHS district office page still lists office towns and contact details but still exposes no county or service-area crosswalk.

### Exact Evidence Needed

- An official DHHS county or service-area crosswalk for office towns like Bangor, Calais, Machias, Portland, or Skowhegan.
- Or, any other official Maine DHHS county-grade office-routing page or export that explicitly assigns counties or service areas to those offices.

### Useful Official URLs Already Tried

- [Maine NEO Primary Contacts By Organization](https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU)
- [Maine NEO Superintendent by SAU](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/SAU)
- [Maine NEO Town selector](https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town)
- [Maine SAU workbook](https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx)
- [Maine special education landing page](https://www.maine.gov/doe/learning/specialed)
- [Maine DHHS district offices](https://www.maine.gov/dhhs/about/contact/offices)

### Top Remaining Source-Scouting Targets

- Any official DHHS county/service-area crosswalk for the named district-office towns.
- Any official DHHS district-office PDF, spreadsheet, ArcGIS layer, or service-area page that names counties served by Bangor, Calais, Caribou, Ellsworth, Machias, Portland, or Skowhegan.

## Next State Order After Maine

1. Idaho
2. Arizona
3. Massachusetts
4. New Mexico
5. South Dakota
6. Rhode Island
7. Virginia
8. West Virginia
9. North Dakota
10. Wisconsin`;

  text = text.replace(/## Current Focus State:[\s\S]*$/m, focusSection);
  fs.writeFileSync(INPUTS.handoff, `${text.trimEnd()}\n`);
}

function buildBatchReport() {
  return [
    '# Batch 333 Minnesota Live Route And DHS 404 Refresh Report v1',
    '',
    '- state: minnesota',
    '- classification: COMPLETE',
    '- index_safe: true',
    '- refined_families: district_or_county_education_routing, county_local_disability_resources',
    '',
    '## What changed',
    '',
    '- Cleared `district_or_county_education_routing` from browser-reviewed public MDE-ORG routes: the schools-and-districts page, counties page, county member pages, district detail leaves, and the special-education-director contact list are all publicly readable on the official host.',
    '- Cleared `county_local_disability_resources` from the browser-reviewed official DHS successor route: the exact county/Tribal/state directory is publicly readable and publishes county and Tribal office rows with contact details on the official host.',
  ].join('\n') + '\n';
}

export function generateBatch333MinnesotaLiveRouteAndDhs404RefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch333_minnesota_live_route_and_dhs_404_refresh_v1',
    classification: 'COMPLETE',
    index_safe: true,
    completeness_pct: 100,
    strong_critical_families: 12,
    weak_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: [],
    final_blockers: [],
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: DISTRICT_STATUS, status_reason: DISTRICT_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => (
    row.family !== 'district_or_county_education_routing'
    && row.family !== 'county_local_disability_resources'
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: DISTRICT_STATUS,
        query_basis: 'Reviewed browser-readable official MDE-ORG county and district routes, county member pages, district detail leaves, and the Special Education Director contact list on 2026-06-25.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 7,
        samples: [
          {
            sample_name: 'Minnesota MDE-ORG description page',
            source_url: 'https://education.mn.gov/MDE/about/SchOrg/',
            final_url: 'https://education.mn.gov/MDE/about/SchOrg/',
            verification_status: 'verified',
            source_type: 'official_directory_description_page',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official description page is live with title `Schools and Organizations (MDE-ORG)` and still describes MDE-ORG as a searchable database.',
          },
          {
            sample_name: 'Minnesota Schools and Districts route',
            source_url: 'https://pub.education.mn.gov/MdeOrgView/districts/index',
            final_url: 'https://pub.education.mn.gov/MdeOrgView/districts/index',
            verification_status: 'reviewed',
            source_type: 'official_directory_navigation_route',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public `Schools and Districts` page is browser-readable on the official host and exposes district listings, a `List of Districts and Schools`, a `Superintendents/Directors for School Districts and Charter Schools` list, and a `Special Education Directors` contact list with an extract link.',
          },
          {
            sample_name: 'Minnesota Counties route',
            source_url: 'https://pub.education.mn.gov/MdeOrgView/reference/county',
            final_url: 'https://pub.education.mn.gov/MdeOrgView/reference/county',
            verification_status: 'reviewed',
            source_type: 'official_county_directory',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public `Minnesota Counties` page explicitly says users can click on a county name to view all organizations located within that county and lists all 87 counties on the official host.',
          },
          {
            sample_name: 'Minnesota county member page example',
            source_url: 'https://pub.education.mn.gov/MdeOrgView/groupTag/members/County?headStateOrganizationId=910001000000',
            final_url: 'https://pub.education.mn.gov/MdeOrgView/groupTag/members/County?headStateOrganizationId=910001000000',
            verification_status: 'reviewed',
            source_type: 'official_county_membership_page',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'A county member page like `Aitkin County` publicly enumerates organizations within that county, including district members such as `Aitkin Public School District`, `Hill City Public School District`, and `McGregor Public School District`.',
          },
          {
            sample_name: 'Minnesota district detail example',
            source_url: 'https://pub.education.mn.gov/MdeOrgView/organization/show/262',
            final_url: 'https://pub.education.mn.gov/MdeOrgView/organization/show/262',
            verification_status: 'reviewed',
            source_type: 'official_district_detail_leaf',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'A district detail page like `Aitkin Public School District 0001-01` preserves superintendent name, email, phone, website, physical address, and explicit county membership on the official host.',
          },
          {
            sample_name: 'Minnesota Special Education Directors list',
            source_url: 'https://pub.education.mn.gov/MdeOrgView/contact/contactsByContactType?contactRoleTypeCode=SPEC_ED_DIR_Contact',
            final_url: 'https://pub.education.mn.gov/MdeOrgView/contact/contactsByContactType?contactRoleTypeCode=SPEC_ED_DIR_Contact',
            verification_status: 'reviewed',
            source_type: 'official_special_education_contact_list',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public `Special Education Director` contact list preserves organization name, email, and phone for district special-education contacts on the official host, including `Aitkin Public School District`.',
          },
          {
            sample_name: 'Minnesota MDE-ORG raw root remains unstable',
            source_url: 'https://pub.education.mn.gov/MdeOrgView/',
            final_url: 'https://validate.perfdrive.com/?.../MdeOrgView/',
            verification_status: 'blocked',
            source_type: 'official_directory_root_flapping_radware',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The raw MDE-ORG root still flaps into `validate.perfdrive.com` under bounded fetch, but the browser-reviewed child routes above remain publicly readable and are strong enough for county-grade routing.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: COUNTY_STATUS,
        query_basis: 'Reviewed 2026-06-25 the saved DHS disability-services replacements plus the exact named successor Minnesota DHS county/Tribal/state directory route in the browser.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 5,
        samples: [
          {
            sample_name: 'County and tribal offices replacement',
            source_url: 'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/',
            final_url: 'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/',
            verification_status: 'blocked',
            source_type: 'official_replacement_404',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The saved replacement now returns HTTP 404 with title `404 / Minnesota Department of Human Services` rather than a public local-office directory.',
          },
          {
            sample_name: 'County tribal state directory successor heading',
            source_url: 'https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp',
            final_url: 'https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp',
            verification_status: 'reviewed',
            source_type: 'official_successor_directory_route',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The exact DHS successor page is browser-readable on the official host with heading `Minnesota Health Care Program county, Tribal and state directory` and the section `County, Tribal and state health care offices`.',
          },
          {
            sample_name: 'County entries Aitkin and Anoka',
            source_url: 'https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp',
            final_url: 'https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp',
            verification_status: 'reviewed',
            source_type: 'official_county_entries',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed page publishes concrete county rows including `Aitkin County` and `Anoka County`, each with mailing address, phone, and fax on the official DHS host.',
          },
          {
            sample_name: 'Tribal entry White Earth Financial Services',
            source_url: 'https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp',
            final_url: 'https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp',
            verification_status: 'reviewed',
            source_type: 'official_tribal_entry',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same official directory includes a Tribal row for `White Earth Financial Services`, confirming the page is a real county/Tribal/state office directory rather than a generic landing page.',
          },
          {
            sample_name: 'Late alphabet county coverage',
            source_url: 'https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp',
            final_url: 'https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp',
            verification_status: 'reviewed',
            source_type: 'official_county_tail_entries',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed directory continues through late alphabet rows including `Washington County`, `Watonwan County`, `Wilkin County`, `Winona County`, `Wright County`, and `Yellow Medicine County`.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.filter((row) => (
    row.family !== 'district_or_county_education_routing'
    && row.family !== 'county_local_disability_resources'
  ));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'minnesota'
      ? {
        ...row,
        classification: 'COMPLETE',
        index_safe: true,
        completeness_pct: 100,
        missing_critical_families: 0,
        weak_critical_families: 0,
        primary_gap_reason: PRIMARY_GAP_REASON,
        recommended_batch: 'maintain_truth_only',
        status: 'COMPLETE',
        repair_lane: 'truth_maintenance_only',
      }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    generatedAt: '2026-06-25T06:30:00.000Z',
    classifications: {
      ...allStateAudit.classifications,
      COMPLETE: 32,
      BLOCKED: 18,
    },
    indexSafeCount: 32,
    states: allStateAudit.states.map((row) => {
      if (row.stateId !== 'minnesota') return row;
      return {
        ...row,
        classification: 'COMPLETE',
        indexSafe: true,
        strongCriticalFamilies: 12,
        weakCriticalFamilies: 0,
        completenessPct: 100,
        familyStatuses: {
          ...row.familyStatuses,
          district_or_county_education_routing: DISTRICT_STATUS,
          county_local_disability_resources: COUNTY_STATUS,
        },
        packetBatch: 'batch333_minnesota_live_route_and_dhs_404_refresh_v1',
        packetPrimaryGapReason: PRIMARY_GAP_REASON,
        packetRecommendedBatch: 'maintain_truth_only',
      };
    }),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateAllStateReport();
  updateHandoff();
  const lessonsChanged = appendLessons();

  const batchSummary = {
    batch: 'batch333_minnesota_live_route_and_dhs_404_refresh_v1',
    generated_at: '2026-06-25T06:30:00.000Z',
    state: 'minnesota',
    classification: 'COMPLETE',
    index_safe: true,
    browser_reviewed_mde_district_route: true,
    browser_reviewed_mde_county_route: true,
    browser_reviewed_mde_county_member_page: true,
    browser_reviewed_mde_district_detail_page: true,
    browser_reviewed_special_education_contacts: true,
    raw_mde_root_still_flapping: true,
    dhs_saved_replacement_404_count: 1,
    browser_reviewed_dhs_successor_directory: true,
    lessons_changed: lessonsChanged,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch333MinnesotaLiveRouteAndDhs404RefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
