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

const PRIMARY_GAP_REASON = 'browser_reviewed_mdeorg_county_and_district_routes_now_clear_education_but_mn_dhs_successor_county_tribal_state_directory_is_still_bot_gated';

const DISTRICT_STATUS = 'verified_browser_reviewed_official_mdeorg_county_directory_and_special_education_contacts';
const DISTRICT_REASON = 'Minnesota education now clears from browser-reviewed official MDE-ORG pages on the public MDE host. The public `Schools and Districts` route exposes district listings plus a `Special Education Directors` contact list and extract link. The public `Counties` route lists all 87 Minnesota counties and explicitly says users can click a county name to view all organizations located within that county. County member pages then enumerate district members, and district detail leaves preserve superintendent name, email, phone, website, physical address, and county on the same official host. That combination is enough to verify county-grade district routing without relying on the unstable raw-fetch-only root or export lane.';

const COUNTY_STATUS = 'blocked_mn_dhs_successor_county_tribal_state_directory_is_bot_gated';
const COUNTY_FAILURE_CODE = 'official_mn_dhs_404_shell_points_to_successor_county_tribal_state_directory_but_that_route_is_radware_blocked';
const COUNTY_REASON = 'Minnesota county-local routing remains blocked, but the exact first-party picture is now sharper. The saved disability-services replacement URLs still return official DHS 404 pages, and the same official DHS shell exposes a likely successor route named `Minnesota Health Care Program county, Tribal and state directory`. But that exact successor route is also bot-gated behind a Radware challenge in bounded fetches, so there is still no reviewable county-grade local office contract on public first-party DHS surfaces.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-25 bounded official Minnesota DHS county-and-tribal surfaces. The saved disability-services replacement URLs still return official DHS 404 pages, including https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/. The official DHS shell also exposes an exact successor contact route at https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp labeled `Minnesota Health Care Program county, Tribal and state directory`, but a fresh exact recheck showed that successor returning HTTP 302 into `validate.perfdrive.com` / `Radware Bot Manager Captcha`. Minnesota therefore still lacks a reviewable county-grade county/tribal office contract on public first-party DHS surfaces.';
const COUNTY_NEXT_ACTION = 'hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_state_directory_stays_public';

const LESSON_HEADING = '### Browser-Readable Child Routes Can Clear A Flapping Raw-Fetch Directory';
const LESSON_BODY = '*   **Lesson:** If raw fetches on an official directory family flap into bot protection but exact browser-reviewed child routes stay publicly readable, prefer the stable reviewed child pages over the unstable raw root. Minnesota MDE-ORG still flapped under raw fetch, yet the exact `Schools and Districts`, `Counties`, county-member, district-detail, and `Special Education Director` pages were publicly readable on the official host and were strong enough to clear county-grade education routing.';
const LESSON_HEADING_2 = '### Official 404 Shells Can Still Expose The Real Successor Lane';
const LESSON_BODY_2 = '*   **Lesson:** If an official 404 shell links a named successor route, verify that exact successor before freezing the blocker. Minnesota DHS disability-services replacements still 404, but the same shell exposed `county-tribal-state-offices.jsp`, which turned the blocker from “no successor found” into the more exact truth that the successor exists but is bot-gated.';

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
    '- Minnesota remains BLOCKED and index_safe=false.',
    '- district_or_county_education_routing is now verified from browser-reviewed official MDE-ORG county and district pages, county member pages, district detail leaves, and the public Special Education Director contact list.',
    '- county_local_disability_resources remains blocked because the reviewed DHS disability-services replacements still 404 and the exact named successor county/tribal/state directory route is also bot-gated.',
    '- parent_training_information_center remains verified and is not a current blocker.',
  ].join('\n') + '\n';
}

function updateAllStateReport() {
  let text = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const staleBullets = [
    '- Minnesota remains blocked, and the stricter live truth is now: the MDE description page is public, the MDE-ORG root flaps between a live glossary page and Radware, the district/county/contact/analytics routes stay bot-gated, and the DHS disability-services 404 shell points to a named county/tribal/state successor route that is also bot-gated.',
  ];
  for (const bullet of staleBullets) {
    text = text.replace(`${bullet}\n`, '');
  }
  const newBullet = '- Minnesota is still blocked overall, but education now clears from browser-reviewed official MDE-ORG county and district pages; the only remaining critical blocker is the DHS county/tribal/state directory successor, which still redirects into Radware.';
  if (!text.includes(newBullet)) text = `${text.trimEnd()}\n${newBullet}\n`;
  fs.writeFileSync(INPUTS.allStateReport, text);
}

function updateHandoff() {
  let text = fs.readFileSync(INPUTS.handoff, 'utf8');
  text = text.replace(
    '- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`',
    '- Minnesota: `mde_description_page_is_live_but_mdeorg_root_district_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated`'
  );
  text = text.replace(
    '- Minnesota: `live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s`',
    '- Minnesota: `mde_description_page_is_live_but_mdeorg_root_district_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated`'
  );
  text = text.replace(
    '- Minnesota: `mde_description_page_is_live_but_mdeorg_root_district_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated`',
    '- Minnesota: `browser_reviewed_mdeorg_county_and_district_routes_now_clear_education_but_mn_dhs_successor_county_tribal_state_directory_is_still_bot_gated`'
  );
  text = text.replace(
    '- Minnesota: `mde_description_page_is_live_mdeorg_root_flaps_between_live_glossary_and_radware_child_routes_stay_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated`',
    '- Minnesota: `browser_reviewed_mdeorg_county_and_district_routes_now_clear_education_but_mn_dhs_successor_county_tribal_state_directory_is_still_bot_gated`'
  );

  const focusSection = `## Current Focus State: Minnesota

### Blocker Reason

Minnesota no longer has an education blocker. Browser-reviewed official MDE-ORG pages on the public MDE host now provide a county-grade education-routing contract: the public \`Schools and Districts\` route exposes district listings plus a \`Special Education Directors\` contact list and extract link, the public \`Counties\` route lists all 87 Minnesota counties and explicitly says users can click a county name to view all organizations located within that county, county member pages enumerate district members, and district detail leaves preserve superintendent name, email, phone, website, physical address, and county. The only remaining critical blocker is \`county_local_disability_resources\`: the saved DHS disability-services replacements still 404, and the official shell now points to a named successor county/tribal/state directory route that is itself bot-gated.

### Exact Evidence Needed

- A live official Minnesota DHS county/tribal/state directory route that stays public instead of redirecting into bot protection.
- Or, any other first-party Minnesota DHS county-grade county/tribal office directory that is publicly reviewable without inference.

### Useful Official URLs Already Tried

- [Minnesota MDE description page](https://education.mn.gov/MDE/about/SchOrg/)
- [Minnesota MDE-ORG root](https://pub.education.mn.gov/MdeOrgView/)
- [Minnesota schools and districts route](https://pub.education.mn.gov/MdeOrgView/districts/index)
- [Minnesota counties route](https://pub.education.mn.gov/MdeOrgView/reference/county)
- [Minnesota county member page example](https://pub.education.mn.gov/MdeOrgView/groupTag/members/County?headStateOrganizationId=910001000000)
- [Minnesota district detail example](https://pub.education.mn.gov/MdeOrgView/organization/show/262)
- [Minnesota special education directors list](https://pub.education.mn.gov/MdeOrgView/contact/contactsByContactType?contactRoleTypeCode=SPEC_ED_DIR_Contact)
- [Minnesota DHS county and tribal offices replacement](https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/)
- [Minnesota DHS county tribal nation directory replacement](https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/)
- [Minnesota DHS county tribal state directory successor](https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp)

### Top Remaining Source-Scouting Targets

- Any official Minnesota DHS successor page for county-and-tribal office routing that stays public instead of redirecting into Radware.
- Any first-party DHS county/tribal/state office export, directory, or HTML contact contract that replaces the current bot-gated successor route.

## Next State Order After Minnesota

1. Maine
2. Idaho
3. Arizona
4. Massachusetts
5. New Mexico
6. South Dakota
7. Rhode Island
8. Virginia
9. West Virginia
10. North Dakota`;

  text = text.replace(/## Current Focus State:[\s\S]*$/m, focusSection);
  fs.writeFileSync(INPUTS.handoff, `${text.trimEnd()}\n`);
}

function buildBatchReport() {
  return [
    '# Batch 333 Minnesota Live Route And DHS 404 Refresh Report v1',
    '',
    '- state: minnesota',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_families: district_or_county_education_routing, county_local_disability_resources',
    '',
    '## What changed',
    '',
    '- Cleared `district_or_county_education_routing` from browser-reviewed public MDE-ORG routes: the schools-and-districts page, counties page, county member pages, district detail leaves, and the special-education-director contact list are all publicly readable on the official host.',
    '- Narrowed Minnesota to one remaining critical blocker: the DHS county/tribal/state directory successor is still bot-gated and the saved disability-services replacements still 404.',
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
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: ['county_local_disability_resources'],
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_EVIDENCE,
        next_action: COUNTY_NEXT_ACTION,
      },
    ],
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

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION };
    }
    return row;
  }).filter((row) => row.family !== 'district_or_county_education_routing');

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: DISTRICT_STATUS,
        query_basis: 'Reviewed browser-readable official MDE-ORG county and district routes, county member pages, district detail leaves, and the Special Education Director contact list on 2026-06-25.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 6,
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
        query_basis: 'Reviewed 2026-06-25 the saved DHS disability-services replacements plus the exact named successor county/tribal/state directory route.',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
        sample_count: 3,
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
            sample_name: 'County tribal state directory successor',
            source_url: 'https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp',
            final_url: 'http://validate.perfdrive.com/.../county-tribal-state-offices.jsp',
            verification_status: 'blocked',
            source_type: 'official_successor_route_radware',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The exact DHS successor labeled `Minnesota Health Care Program county, Tribal and state directory` redirects into `validate.perfdrive.com` / `Radware Bot Manager Captcha` instead of yielding a public office directory.',
          },
          {
            sample_name: 'Legacy county-and-tribal-offices path family',
            source_url: 'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices.jsp',
            final_url: 'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices.jsp',
            verification_status: 'blocked',
            source_type: 'official_stale_legacy_path',
            source_table: 'batch178_minnesota_mdeorg_directory_root_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The old `.jsp` county-and-tribal-offices path remains stale and no longer preserves a reviewed local-office contract.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE };
    }
    return row;
  }).filter((row) => row.family !== 'district_or_county_education_routing');

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'minnesota'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    generatedAt: '2026-06-25T06:30:00.000Z',
    states: allStateAudit.states.map((row) => {
      if (row.stateId !== 'minnesota') return row;
      return {
        ...row,
        familyStatuses: {
          ...row.familyStatuses,
          district_or_county_education_routing: DISTRICT_STATUS,
          county_local_disability_resources: COUNTY_STATUS,
        },
        packetBatch: 'batch333_minnesota_live_route_and_dhs_404_refresh_v1',
        packetPrimaryGapReason: PRIMARY_GAP_REASON,
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
    classification: 'BLOCKED',
    index_safe: false,
    browser_reviewed_mde_district_route: true,
    browser_reviewed_mde_county_route: true,
    browser_reviewed_mde_county_member_page: true,
    browser_reviewed_mde_district_detail_page: true,
    browser_reviewed_special_education_contacts: true,
    raw_mde_root_still_flapping: true,
    dhs_saved_replacement_404_count: 1,
    dhs_successor_route_bot_gated: true,
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
