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

const PRIMARY_GAP_REASON = 'live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s';

const DISTRICT_STATUS = 'blocked_live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked';
const DISTRICT_FAILURE_CODE = 'official_mdeorg_root_and_district_page_are_live_but_county_contact_and_analytics_contracts_remain_radware_blocked';
const DISTRICT_REASON = 'Minnesota education remains blocked, but the blocker is now narrower and more truthful. A bounded 2026-06-24 live recheck showed the MDE-ORG description page, glossary root, and `Schools and Districts` route all loading publicly on official Minnesota hosts. But the county route, contact search route, contact-type route, and analytics export route still collapse into Radware captcha pages, so there is still no reproducible county-grade district routing or export contract.';
const DISTRICT_EVIDENCE = 'Reviewed 2026-06-24 bounded official Minnesota MDE education surfaces. The description page at https://education.mn.gov/MDE/about/SchOrg/ returned HTTP 200 with title `Schools and Organizations (MDE-ORG)`. The glossary root at https://pub.education.mn.gov/MdeOrgView/ returned HTTP 200 with title `MDE Organization Reference Glossary`, and the district route at https://pub.education.mn.gov/MdeOrgView/districts/index returned HTTP 200 with title `Schools and Districts`. But the county route at https://pub.education.mn.gov/MdeOrgView/reference/county, the contact-search route at https://pub.education.mn.gov/MdeOrgView/search/searchContacts, the contact-type route at https://pub.education.mn.gov/MdeOrgView/contact/contactTypeList, and the analytics route at https://pub.education.mn.gov/MDEAnalytics/Data.jsp all redirected into `validate.perfdrive.com` with title `Radware Captcha Page`. Minnesota therefore still lacks a reviewable county-grade district routing contract in low-token mode, but the current truth is live root plus live district navigation chrome with county/contact/analytics still bot-gated.';
const DISTRICT_NEXT_ACTION = 'hold_blocked_until_reviewed_first_party_mdeorg_county_or_contact_export_contract_exists';

const COUNTY_STATUS = 'blocked_mn_dhs_saved_county_tribal_replacements_are_official_404s';
const COUNTY_FAILURE_CODE = 'official_mn_dhs_saved_county_tribal_replacements_now_resolve_to_404_without_public_county_contract';
const COUNTY_REASON = 'Minnesota county-local routing remains blocked, but the live blocker changed. The saved DHS county-and-tribal replacement URLs no longer present a reviewable public directory or even a live captcha gate in bounded fetches. On 2026-06-24 both saved replacement URLs returned official DHS 404 pages, so there is still no county-grade local office contract on the reviewed first-party replacements.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-24 bounded official Minnesota DHS county-and-tribal replacements. https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/ returned HTTP 404 with title `404 / Minnesota Department of Human Services`, and https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/ returned the same official DHS 404 page. Minnesota therefore still lacks a reviewable county-grade county/tribal office contract on the saved first-party replacements, and the blocker is now official 404 replacements rather than a live captcha family.';
const COUNTY_NEXT_ACTION = 'hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_successor_exists';

const LESSON_HEADING = '### Live Navigation Chrome Still Fails If County And Contact Contracts Stay Bot-Gated';
const LESSON_BODY = '*   **Lesson:** If an official directory root and one child navigation page render publicly, keep the family blocked unless the county, contact, or export surfaces also stay public. Minnesota MDE-ORG showed live `MDE Organization Reference Glossary` and `Schools and Districts` pages, but the county, contact, and analytics routes still fell into Radware, so the family stayed below California-grade.';
const LESSON_HEADING_2 = '### Replatformed Official Replacements Should Be Downgraded To 404 Truth When The Gate Disappears';
const LESSON_BODY_2 = '*   **Lesson:** If a previously challenged replacement URL later settles into an official 404, update the blocker to the narrower 404 truth instead of carrying forward the older captcha narrative. Minnesota DHS county-and-tribal replacements moved from assumed Radware gating to plain official DHS 404 pages on recheck.';

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
    '- district_or_county_education_routing remains blocked because the official MDE-ORG root and district page are live, but the county, contact, and analytics routes are still Radware-blocked and do not yield a reproducible county-grade contract.',
    '- county_local_disability_resources remains blocked because the reviewed DHS county-and-tribal replacement URLs now resolve to official DHS 404 pages and still do not expose a public local-office contract.',
    '- parent_training_information_center remains verified and is not a current blocker.',
  ].join('\n') + '\n';
}

function updateAllStateReport() {
  let text = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const oldBullet = '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.';
  const newBullet = '- Minnesota remains blocked, but the blocker is now narrower and more accurate: the MDE-ORG root and `Schools and Districts` route are live while county/contact/analytics routes remain Radware-blocked, and the saved DHS county/tribal replacements now resolve to official DHS 404 pages rather than a live captcha family.';
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
    '- Minnesota: `live_mdeorg_root_and_district_page_but_county_contact_and_analytics_routes_are_radware_blocked_plus_mn_dhs_saved_county_tribal_replacements_are_official_404s`'
  );

  const focusSection = `## Current Focus State: Minnesota

### Blocker Reason

Minnesota still has two critical blockers, and the highest-priority one remains \`district_or_county_education_routing\`. The live official picture is now narrower and more accurate: the MDE-ORG description page, glossary root, and \`Schools and Districts\` route all render publicly on official Minnesota hosts, but the county route, contact-search route, contact-type route, and analytics route still fall into Radware captcha. The separate county-local blocker also shifted: the saved DHS county-and-tribal replacement URLs now return official DHS 404 pages instead of a live captcha family.

### Exact Evidence Needed

- A public first-party Minnesota MDE county, contact, or export route that yields reproducible organization data instead of the current Radware challenge.
- Or, a reviewed public Minnesota MDE download/export lane that preserves county-grade organization routing without browser validation.
- Separately, a live official Minnesota DHS successor for county-and-tribal office routing; the two saved replacements now 404 and no longer provide a usable local-office contract.

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

### Top Remaining Source-Scouting Targets

- Any official Minnesota MDE county, contact, or analytics export surface that stays public and yields real organization data.
- Any first-party Minnesota education export or downloadable organization file linked from the live MDE-ORG family.
- Any official Minnesota DHS successor page for county-and-tribal office routing that replaces the two reviewed 404 paths.

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
        query_basis: 'Reviewed 2026-06-24 the live MDE-ORG description page, glossary root, district route, county route, contact routes, and analytics route.',
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
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The official description page is live with title `Schools and Organizations (MDE-ORG)` and still describes MDE-ORG as a searchable database.',
          },
          {
            sample_name: 'Minnesota MDE-ORG glossary root',
            source_url: 'https://pub.education.mn.gov/MdeOrgView/',
            final_url: 'https://pub.education.mn.gov/MdeOrgView/',
            verification_status: 'verified',
            source_type: 'official_directory_root',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The glossary root is live with title `MDE Organization Reference Glossary` and visible first-party navigation including `Schools and Districts`.',
          },
          {
            sample_name: 'Minnesota schools and districts route',
            source_url: 'https://pub.education.mn.gov/MdeOrgView/districts/index',
            final_url: 'https://pub.education.mn.gov/MdeOrgView/districts/index',
            verification_status: 'verified',
            source_type: 'official_directory_navigation_page',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The route is publicly reachable with title `Schools and Districts`, but this still does not establish a county-grade contract because the county and contact lanes remain blocked.',
          },
          {
            sample_name: 'Minnesota counties and contacts routes',
            source_url: 'https://pub.education.mn.gov/MdeOrgView/reference/county',
            final_url: 'https://validate.perfdrive.com/?.../MdeOrgView/reference/county',
            verification_status: 'blocked',
            source_type: 'official_directory_child_route_radware',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The county route and contact child routes redirect into `validate.perfdrive.com` with title `Radware Captcha Page` instead of yielding county-grade organization data.',
          },
          {
            sample_name: 'Minnesota analytics route',
            source_url: 'https://pub.education.mn.gov/MDEAnalytics/Data.jsp',
            final_url: 'https://validate.perfdrive.com/?.../MDEAnalytics/Data.jsp',
            verification_status: 'blocked',
            source_type: 'official_analytics_route_radware',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The analytics route still redirects into `validate.perfdrive.com` with title `Radware Captcha Page`, so there is no stable public export contract.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: COUNTY_STATUS,
        query_basis: 'Reviewed 2026-06-24 the saved DHS county-and-tribal replacement URLs directly on official Minnesota DHS hosts.',
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
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The saved replacement now returns HTTP 404 with title `404 / Minnesota Department of Human Services` rather than a public local-office directory.',
          },
          {
            sample_name: 'County tribal nation directory replacement',
            source_url: 'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/',
            final_url: 'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/',
            verification_status: 'blocked',
            source_type: 'official_replacement_404',
            source_table: 'batch333_minnesota_live_route_and_dhs_404_refresh',
            fetched_at: '2026-06-24T00:00:00.000Z',
            evidence_snippet: 'The adjacent saved replacement also returns the official DHS 404 page and still does not expose county or tribal office routing.',
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
    generatedAt: '2026-06-24T23:30:00.000Z',
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
    generated_at: '2026-06-24T23:30:00.000Z',
    state: 'minnesota',
    classification: 'BLOCKED',
    index_safe: false,
    live_mde_description_page: true,
    live_mde_root: true,
    live_mde_district_route: true,
    blocked_mde_county_contact_analytics_routes: 4,
    dhs_saved_replacement_404_count: 2,
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
