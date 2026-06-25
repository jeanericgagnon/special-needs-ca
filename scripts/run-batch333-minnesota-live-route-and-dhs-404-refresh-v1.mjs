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

const PRIMARY_GAP_REASON = 'mde_description_page_is_live_but_mdeorg_root_district_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_successor_county_tribal_state_directory_is_bot_gated';

const DISTRICT_STATUS = 'blocked_mde_description_page_live_but_mdeorg_root_and_child_routes_are_radware_blocked';
const DISTRICT_FAILURE_CODE = 'official_mde_description_page_is_live_but_mdeorg_root_district_county_contact_and_analytics_routes_are_all_radware_blocked';
const DISTRICT_REASON = 'Minnesota education remains blocked, and the live public contract is now narrower than the prior packet implied. A bounded 2026-06-25 recheck showed the MDE description page still loading publicly on the official host, but the MDE-ORG glossary root itself and every actionable child route checked in low-token mode now redirect into Radware captcha pages. That includes the root, district, county, contact-search, contact-type, and analytics routes, so there is still no reproducible county-grade district routing or export contract.';
const DISTRICT_EVIDENCE = 'Reviewed 2026-06-25 bounded official Minnesota MDE education surfaces. The description page at https://education.mn.gov/MDE/about/SchOrg/ returned HTTP 200 with title `Schools and Organizations (MDE-ORG)`. But a fresh exact recheck showed the MDE-ORG glossary root at https://pub.education.mn.gov/MdeOrgView/, the district route at https://pub.education.mn.gov/MdeOrgView/districts/index, the county route at https://pub.education.mn.gov/MdeOrgView/reference/county, the contact-search route at https://pub.education.mn.gov/MdeOrgView/search/searchContacts, the contact-type route at https://pub.education.mn.gov/MdeOrgView/contact/contactTypeList, and the analytics route at https://pub.education.mn.gov/MDEAnalytics/Data.jsp all returning HTTP 302 redirects into `validate.perfdrive.com` with title `Radware Captcha Page`. Minnesota therefore still lacks a reviewable county-grade district routing contract in low-token mode, and the current truth is stricter than the prior packet: only the description page is stably public while the root plus all actionable MDE-ORG child routes are bot-gated.';
const DISTRICT_NEXT_ACTION = 'hold_blocked_until_reviewed_first_party_mdeorg_root_or_export_contract_stays_public';

const COUNTY_STATUS = 'blocked_mn_dhs_successor_county_tribal_state_directory_is_bot_gated';
const COUNTY_FAILURE_CODE = 'official_mn_dhs_404_shell_points_to_successor_county_tribal_state_directory_but_that_route_is_radware_blocked';
const COUNTY_REASON = 'Minnesota county-local routing remains blocked, but the exact first-party picture is now sharper. The saved disability-services replacement URLs still return official DHS 404 pages, and the same official DHS shell exposes a likely successor route named `Minnesota Health Care Program county, Tribal and state directory`. But that exact successor route is also bot-gated behind a Radware challenge in bounded fetches, so there is still no reviewable county-grade local office contract on public first-party DHS surfaces.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-25 bounded official Minnesota DHS county-and-tribal surfaces. The saved disability-services replacement URLs still return official DHS 404 pages, including https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/. The official DHS shell also exposes an exact successor contact route at https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp labeled `Minnesota Health Care Program county, Tribal and state directory`, but a fresh exact recheck showed that successor returning HTTP 302 into `validate.perfdrive.com` / `Radware Bot Manager Captcha`. Minnesota therefore still lacks a reviewable county-grade county/tribal office contract on public first-party DHS surfaces.';
const COUNTY_NEXT_ACTION = 'hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_state_directory_stays_public';

const LESSON_HEADING = '### Live Description Pages Do Not Rescue A Bot-Gated Directory Family';
const LESSON_BODY = '*   **Lesson:** If an official description page stays public but the directory root and all actionable child routes redirect into bot protection, keep the family blocked at the stricter root-plus-child level. Minnesota MDE still served the `Schools and Organizations (MDE-ORG)` explainer page, but the MDE-ORG root, district, county, contact, and analytics routes all redirected into Radware on the same bounded pass.';
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
    '- district_or_county_education_routing remains blocked because only the official MDE description page is stably public in bounded fetches; the MDE-ORG root plus district, county, contact, and analytics routes all redirect into Radware and do not yield a reproducible county-grade contract.',
    '- county_local_disability_resources remains blocked because the reviewed DHS disability-services replacements still 404 and the exact named successor county/tribal/state directory route is also bot-gated.',
    '- parent_training_information_center remains verified and is not a current blocker.',
  ].join('\n') + '\n';
}

function updateAllStateReport() {
  let text = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const oldBullet = '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.';
  const newBullet = '- Minnesota remains blocked, and the stricter live truth is now: only the MDE description page is public while the MDE-ORG root plus district/county/contact/analytics routes all redirect into Radware, and the DHS disability-services 404 shell points to a named county/tribal/state successor route that is also bot-gated.';
  if (text.includes(oldBullet) && !text.includes(newBullet)) {
    text = text.replace(oldBullet, `${oldBullet}\n- ${newBullet.slice(2)}`);
  } else if (!text.includes(newBullet)) {
    text = `${text.trimEnd()}\n- ${newBullet.slice(2)}\n`;
  }
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

  const focusSection = `## Current Focus State: Minnesota

### Blocker Reason

Minnesota still has two critical blockers, and the highest-priority one remains \`district_or_county_education_routing\`. The stricter live official picture is now: the MDE description page is still public, but the MDE-ORG glossary root itself and every actionable child route checked in low-token mode now redirect into Radware captcha. That includes the district, county, contact-search, contact-type, and analytics routes. The separate county-local blocker is also sharper: the saved DHS disability-services replacements still 404, and the official shell now points to a named successor county/tribal/state directory route that is itself bot-gated.

### Exact Evidence Needed

- A public first-party Minnesota MDE root, district, county, contact, or export route that yields reproducible organization data instead of the current Radware challenge.
- Or, a reviewed public Minnesota MDE download/export lane that preserves county-grade organization routing without browser validation.
- Separately, a live official Minnesota DHS county/tribal/state directory route that stays public instead of redirecting into bot protection.

### Useful Official URLs Already Tried

- [Minnesota MDE description page](https://education.mn.gov/MDE/about/SchOrg/)
- [Minnesota MDE-ORG root](https://pub.education.mn.gov/MdeOrgView/)
- [Minnesota schools and districts route](https://pub.education.mn.gov/MdeOrgView/districts/index)
- [Minnesota counties route](https://pub.education.mn.gov/MdeOrgView/reference/county)
- [Minnesota contact search route](https://pub.education.mn.gov/MdeOrgView/search/searchContacts)
- [Minnesota contact types route](https://pub.education.mn.gov/MdeOrgView/contact/contactTypeList)
- [Minnesota analytics route](https://pub.education.mn.gov/MDEAnalytics/Data.jsp)
- [Minnesota DHS county and tribal offices replacement](https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/)
- [Minnesota DHS county tribal nation directory replacement](https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/)
- [Minnesota DHS county tribal state directory successor](https://mn.gov/dhs/people-we-serve/adults/health-care/health-care-programs/contact-us/county-tribal-state-offices.jsp)

### Top Remaining Source-Scouting Targets

- Any official Minnesota MDE root, district, county, contact, or analytics export surface that stays public and yields real organization data.
- Any first-party Minnesota education export or downloadable organization file linked from the live MDE-ORG family.
- Any official Minnesota DHS successor page for county-and-tribal office routing that stays public instead of redirecting into Radware.

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
    '- Rechecked the official MDE-ORG family live and confirmed the root and `Schools and Districts` route are public.',
    '- Confirmed the county, contact, and analytics routes still collapse into `validate.perfdrive.com` / `Radware Captcha Page`.',
    '- Rechecked the saved DHS county-and-tribal replacements and confirmed both now resolve to official DHS 404 pages instead of a live captcha family.',
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
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => {
      if (blocker.family === 'district_or_county_education_routing') {
        return {
          ...blocker,
          failure_code: DISTRICT_FAILURE_CODE,
          evidence: DISTRICT_EVIDENCE,
          next_action: DISTRICT_NEXT_ACTION,
        };
      }
      if (blocker.family === 'county_local_disability_resources') {
        return {
          ...blocker,
          failure_code: COUNTY_FAILURE_CODE,
          evidence: COUNTY_EVIDENCE,
          next_action: COUNTY_NEXT_ACTION,
        };
      }
      return blocker;
    }),
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
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: DISTRICT_FAILURE_CODE, evidence: DISTRICT_EVIDENCE, next_action: DISTRICT_NEXT_ACTION };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: DISTRICT_STATUS,
        query_basis: 'Reviewed 2026-06-25 the official MDE description page plus exact MDE-ORG root, district, county, contact, and analytics routes.',
        blocker_code: DISTRICT_FAILURE_CODE,
        blocker_evidence: DISTRICT_EVIDENCE,
        sample_count: 5,
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
            sample_name: 'Minnesota MDE-ORG glossary root',
            source_url: 'https://pub.education.mn.gov/MdeOrgView/',
            final_url: 'https://validate.perfdrive.com/?.../MdeOrgView/',
            verification_status: 'blocked',
            source_type: 'official_directory_root_radware',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The glossary root now redirects into `validate.perfdrive.com` with title `Radware Captcha Page` instead of exposing a stable public entrypoint.',
          },
          {
            sample_name: 'Minnesota schools and districts route',
            source_url: 'https://pub.education.mn.gov/MdeOrgView/districts/index',
            final_url: 'https://validate.perfdrive.com/?.../MdeOrgView/districts/index',
            verification_status: 'blocked',
            source_type: 'official_directory_navigation_route_radware',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The district route now also redirects into `validate.perfdrive.com` with title `Radware Captcha Page`, so even the district navigation lane is no longer public in low-token mode.',
          },
          {
            sample_name: 'Minnesota counties and contacts routes',
            source_url: 'https://pub.education.mn.gov/MdeOrgView/reference/county',
            final_url: 'https://validate.perfdrive.com/?.../MdeOrgView/reference/county',
            verification_status: 'blocked',
            source_type: 'official_directory_child_route_radware',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The county route and contact child routes redirect into `validate.perfdrive.com` with title `Radware Captcha Page` instead of yielding county-grade organization data.',
          },
          {
            sample_name: 'Minnesota analytics route',
            source_url: 'https://pub.education.mn.gov/MDEAnalytics/Data.jsp',
            final_url: 'https://validate.perfdrive.com/?.../MDEAnalytics/Data.jsp',
            verification_status: 'blocked',
            source_type: 'official_analytics_route_radware',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The analytics route still redirects into `validate.perfdrive.com` with title `Radware Captcha Page`, so there is no stable public export contract.',
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
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: DISTRICT_FAILURE_CODE, next_action: DISTRICT_NEXT_ACTION, evidence: DISTRICT_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

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
    live_mde_description_page: true,
    live_mde_root: false,
    live_mde_district_route: false,
    blocked_mde_root_and_child_routes: 6,
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
