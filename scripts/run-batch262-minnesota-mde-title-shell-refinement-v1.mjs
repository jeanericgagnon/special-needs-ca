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
  report: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch262_minnesota_mde_title_shell_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch262-minnesota-mde-title-shell-refinement-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged';
const DISTRICT_FAILURE_CODE = 'official_mdeorg_root_is_live_but_child_routes_and_analytics_are_title_only_radware_shells';
const DISTRICT_FAMILY_STATUS = 'blocked_mdeorg_root_live_but_actionable_child_routes_are_title_only_radware_shells';
const DISTRICT_STATUS_REASON = 'The Minnesota education blocker is now narrower and more exact: the MDE-ORG description page and root are live in bounded official fetches, but the actionable child routes and analytics lane still resolve to title-bearing Radware shells without county, district, or contact content. That means the public entrypoint exists, but no reproducible county-grade directory or export contract is actually reviewable in the low-token lane.';
const DISTRICT_NEXT_ACTION = 'hold_blocked_until_reviewed_first_party_mdeorg_child_route_capture_or_stable_export_contract_exists';
const DISTRICT_EVIDENCE = 'Reviewed 2026-06-23 bounded official Minnesota MDE education surfaces after the earlier flapping-root blocker. The official description page at https://education.mn.gov/MDE/about/SchOrg/ is live and still describes MDE-ORG as a searchable database that can generate files from search parameters. In the same bounded pass, the MDE-ORG root at https://pub.education.mn.gov/MdeOrgView/ also loaded live with title `MDE Organization Reference Glossary` and exposed first-party links for districts, counties, contacts, and analytics. But the actionable child routes did not produce a usable county-grade contract: https://pub.education.mn.gov/MdeOrgView/districts/index => HTTP 200 title `Schools and Districts` with Radware shell text and no real district inventory; https://pub.education.mn.gov/MdeOrgView/reference/county => HTTP 200 title `Minnesota Counties` with Radware shell text and no county list; https://pub.education.mn.gov/MdeOrgView/search/searchContacts => HTTP 200 title `Search Organization Contacts` with Radware shell text and no contact directory; https://pub.education.mn.gov/MdeOrgView/contact/contactTypeList => HTTP 200 title `Contacts` with Radware shell text and no contact-type content; https://pub.education.mn.gov/MDEAnalytics/Data.jsp => HTTP 200 title `Data Reports and Analytics` but still only a title-bearing challenge shell rather than a stable export contract. Minnesota therefore still lacks a reproducible county-grade district routing contract, but the blocker is now precisely title-bearing Radware shells on the actionable first-party routes rather than a fully dead root.';

const LESSON_HEADING = '### A Live Official Root Can Still Fail If Every Actionable Child Route Is Only A Title-Bearing Challenge Shell';
const LESSON_BODY = '*   **Lesson:** If an official root page and its description page both load, do not assume the family is reusable until the child routes actually expose the needed county, district, or contact content. Minnesota MDE-ORG now loads at the root, but the district, county, contact, and analytics routes still return title-bearing Radware shells with no real routing data, so the education family stays blocked.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
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
    '- district_or_county_education_routing remains blocked because the MDE-ORG description page and root are live, but the district, county, contact, and analytics routes still only expose title-bearing Radware shells instead of a reproducible county-grade directory or export contract.',
    '- county_local_disability_resources remains blocked on the separate DHS county-and-tribal captcha family.',
    '- parent_training_information_center is verified at statewide grade and is not a remaining blocker.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  const current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const replacement = current
    .replace('- Minnesota: `mdeorg_root_and_analytics_routes_flap_to_radware_plus_mn_dhs_local_office_family_is_radware_challenged`', '- Minnesota: `mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged`')
    .replace('## Current Focus State: Ohio', '## Current Focus State: Minnesota')
    .replace(
      '`county_local_disability_resources` remains the top Ohio blocker in the state queue. The legacy JFS county-office family is still retired, the obvious Medicaid and Ohio.gov successor guesses still return 404, and a final bounded public-discovery pass found the same result on the obvious Ohio.gov, Medicaid, and JFS search/sitemap surfaces. Ohio still has no live public county-office directory, locator, search index, or sitemap contract to reopen this family.',
      '`district_or_county_education_routing` remains the top Minnesota blocker in the state queue. The official MDE-ORG description page and root are live, but the district, county, contact, and analytics routes still only return title-bearing Radware shells with no real county-grade directory or export content. Minnesota therefore still lacks a reproducible official district-routing contract in the low-token lane.'
    )
    .replace(
      '- Any first-party Ohio county office directory, locator, sitemap contract, or search index that is live on an official Ohio/JFS/Medicaid host.\n- Or, a reviewed public successor page that maps county departments of job and family services without relying on the retired JFS family.\n- Or, exact district or ESC-owned education leaves that materially expand county-grade education routing beyond the current root-only inventory.\n- Generic statewide program pages, DOI-hosted planning datasets, and root-only ESC homepages are still not enough.',
      '- Any first-party Minnesota MDE child route or export contract that exposes real district, county, or contact content without collapsing into a Radware shell.\n- Or, a stable official MDE analytics/export lane that preserves reproducible county-grade organization data.\n- Or, an official DHS county-and-tribal office contract that is reviewable without the current Radware challenge.\n- Live roots and good page titles are still not enough if the actionable child routes contain no real routing data.'
    )
    .replace(
      '- [Legacy Ohio JFS child locator guess](https://jfs.ohio.gov/home/local-agencies-directory)\n- [Legacy Ohio JFS child locator guess with slash](https://jfs.ohio.gov/home/local-agencies-directory/)\n- [Ohio Medicaid county agencies guess](https://medicaid.ohio.gov/families-and-individuals/county-agencies)\n- [Ohio Medicaid resources county agencies guess](https://medicaid.ohio.gov/resources/county-agencies)\n- [Ohio.gov resident resource guess](https://ohio.gov/residents/resources/job-family-services-directory)\n- [Ohio.gov search guess for job and family services](https://ohio.gov/search?query=job%20and%20family%20services)\n- [Ohio.gov search guess for county agencies](https://ohio.gov/search?query=county%20agencies)\n- [Ohio Medicaid sitemap guess](https://medicaid.ohio.gov/sitemap.xml)\n- [JFS search guess](https://jfs.ohio.gov/search?query=county%20agencies)',
      '- [Minnesota MDE description page](https://education.mn.gov/MDE/about/SchOrg/)\n- [Minnesota MDE-ORG root](https://pub.education.mn.gov/MdeOrgView/)\n- [Minnesota districts route](https://pub.education.mn.gov/MdeOrgView/districts/index)\n- [Minnesota counties route](https://pub.education.mn.gov/MdeOrgView/reference/county)\n- [Minnesota contacts search route](https://pub.education.mn.gov/MdeOrgView/search/searchContacts)\n- [Minnesota contact types route](https://pub.education.mn.gov/MdeOrgView/contact/contactTypeList)\n- [Minnesota analytics route](https://pub.education.mn.gov/MDEAnalytics/Data.jsp)\n- [Minnesota DHS county and tribal offices replacement](https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/)\n- [Minnesota DHS county tribal nation directory replacement](https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/)'
    )
    .replace(
      '- Any live official Ohio county-office directory, locator, public sitemap, or public search result surface on Ohio/JFS/Medicaid hosts.\n- Any official successor domain for county departments of job and family services that is publicly reviewable and county-bearing.\n- Any exact Ohio district or ESC-owned leaf pages that materially expand county-grade education routing beyond the current 8-county leaf coverage.',
      '- Any official MDE child route or export endpoint that returns real district, county, or contact records instead of a title-bearing Radware shell.\n- Any stable first-party downloadable district/county organization file linked from MDE-ORG or MDE analytics.\n- Any official DHS county-and-tribal office contract that is reviewable without browser validation.'
    )
    .replace(
      '## Next State Order After Ohio\n\n1. Minnesota\n2. Maine\n3. Idaho\n4. Arizona\n5. Massachusetts\n6. Oregon\n7. Oklahoma\n8. Utah\n9. New Hampshire\n10. New Mexico',
      '## Next State Order After Minnesota\n\n1. Maine\n2. Idaho\n3. Arizona\n4. Massachusetts\n5. Oregon\n6. Oklahoma\n7. Utah\n8. New Hampshire\n9. New Mexico\n10. New York'
    );

  fs.writeFileSync(INPUTS.handoff, replacement);
}

export function generateBatch262MinnesotaMdeTitleShellRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? {
            ...blocker,
            failure_code: DISTRICT_FAILURE_CODE,
            evidence: DISTRICT_EVIDENCE,
            next_action: DISTRICT_NEXT_ACTION,
          }
        : blocker
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: DISTRICT_FAMILY_STATUS, status_reason: DISTRICT_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: DISTRICT_FAILURE_CODE, evidence: DISTRICT_EVIDENCE, next_action: DISTRICT_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: DISTRICT_FAMILY_STATUS,
          query_basis: 'Reviewed 2026-06-23 the live MDE-ORG description page and root plus exact district, county, contact, and analytics child routes.',
          blocker_code: DISTRICT_FAILURE_CODE,
          blocker_evidence: DISTRICT_EVIDENCE,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: DISTRICT_FAILURE_CODE, next_action: DISTRICT_NEXT_ACTION, evidence: DISTRICT_EVIDENCE }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  updateHandoff();

  writeJson(OUTPUTS.summary, {
    batch: 'batch262_minnesota_mde_title_shell_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'minnesota',
    classification: 'BLOCKED',
    index_safe: false,
    live_mde_description_page: true,
    live_mde_root: true,
    actionable_mde_child_routes_still_title_only_shells: true,
    lesson_added: lessonAdded,
  });

  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 262 Minnesota MDE Title Shell Refinement Report v1',
      '',
      '- classification: BLOCKED',
      '- index_safe: false',
      '- refined_family: district_or_county_education_routing',
      `- failure_code: ${DISTRICT_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${DISTRICT_EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- Minnesota remains blocked and not index-safe.',
      '- The MDE-ORG description page and root are live.',
      '- But the district, county, contact, and analytics routes still only expose title-bearing Radware shells rather than real routing or export content.',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch262MinnesotaMdeTitleShellRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
