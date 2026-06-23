import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const lessonsPath = path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md');

const FILES = {
  summary: path.join(generatedDir, 'arizona_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'arizona_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'arizona_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arizona_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'arizona_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch236_arizona_county_owned_education_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch236-arizona-county-owned-education-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const RESOLVED_COUNTY_OWNED_LEAVES = [
  {
    county_id: 'cochise-az',
    sample_name: 'cochise county-owned district directory leaf',
    source_url: 'https://www.cochise.az.gov/649/School-Districts',
    final_url: 'https://www.cochise.az.gov/649/School-Districts',
    verification_status: 'verified',
    source_type: 'county_owned_education_routing_leaf',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_snippet:
      'The official Cochise County School Districts page is county-owned local routing evidence: it lists public-school district leaves including Cochise Elementary School District and links the 2025-2026 Cochise County Directory of Schools with contact information.',
  },
  {
    county_id: 'gila-az',
    sample_name: 'gila county-owned accommodation district leaf',
    source_url: 'https://www.gilacountyaz.gov/government/school_superintendent/accommodation_school_district/index.php',
    final_url: 'https://www.gilacountyaz.gov/government/school_superintendent/accommodation_school_district/index.php',
    verification_status: 'verified',
    source_type: 'county_owned_education_routing_leaf',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_snippet:
      'The official Gila County School Superintendent host exposes an exact county-owned leaf titled Gila County Regional School District #49, matching the report-cards district and providing local routing on the county superintendent domain.',
  },
  {
    county_id: 'navajo-az',
    sample_name: 'navajo county-owned accommodation district leaf',
    source_url: 'https://www.navajocountyaz.gov/395/Accommodation-District',
    final_url: 'https://www.navajocountyaz.gov/395/Accommodation-District',
    verification_status: 'verified',
    source_type: 'county_owned_education_routing_leaf',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_snippet:
      'The official Navajo County Accommodation District page is a county-owned local leaf under the Superintendent of Schools and preserves direct accommodation-district routing plus a linked Navajo County Accommodation District #99 business-directory entry.',
  },
  {
    county_id: 'pima-az',
    sample_name: 'pima county-owned accommodation district leaf',
    source_url: 'https://www.schools.pima.gov/pima-accommodation',
    final_url: 'https://www.schools.pima.gov/pima-accommodation',
    verification_status: 'verified',
    source_type: 'county_owned_education_routing_leaf',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_snippet:
      'The official Pima County Schools Superintendent host exposes an exact Pima Accommodation leaf stating that the Pima Accommodation District provides educational services through the Court Alternative Program of Education (CAPE) schools for Pima County detention settings.',
  },
];

const REMAINING_BLOCKED_PUBLIC_DOMAIN_COUNTIES = ['coconino-az', 'mohave-az', 'yavapai-az'];

const EDUCATION_FAILURE_CODE =
  'county_owned_superintendent_leaves_resolve_no_website_counties_but_three_reviewed_public_domains_still_lack_role_leafs';
const EDUCATION_FAMILY_STATUS =
  'blocked_reviewed_public_domains_without_leaf_after_county_owned_no_website_repairs';
const EDUCATION_STATUS_REASON =
  'Arizona education is now blocked only on 3/15 counties whose live district domains still fail a bounded homepage plus sitemap/site-map pass without any role-verifiable special-education or student-services leaf (coconino-az, mohave-az, yavapai-az). The 4 counties whose report-cards district roots exposed no public district website (cochise-az, gila-az, navajo-az, pima-az) are now covered by reviewed county-owned superintendent or accommodation-district routing leaves.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-23 bounded Arizona county-owned education follow-up on the four report-cards rows that had no public district website. That pass found strong county-owned local routing leaves for all four counties: Cochise County now has an official School Districts page that lists Cochise Elementary School District and links the county directory of schools with contact information; Gila County now has an exact superintendent-host leaf titled Gila County Regional School District #49; Navajo County now has an official Accommodation District leaf plus linked district-directory entry for Navajo County Accommodation District #99; and Pima County Schools now has an exact Pima Accommodation page describing the Pima Accommodation District and CAPE educational services. Arizona education therefore no longer blocks on no-website counties and is now limited to the three already-reviewed public district domains that still lack any role-verifiable special-education or student-services leaf: https://www.ccasdaz.org/, https://www.mohavelearning.org/, and https://www.yavapaicountyhighschool.com/.';
const EDUCATION_NEXT_ACTION =
  'hold_reviewed_public_domains_without_role_leafs_until_new_local_pages_exist_and_do_not_reopen_county_superintendent_lane_for_the_resolved_no_website_counties';

const STATE_PRIMARY_GAP =
  'education_gap_now_limited_to_reviewed_no_leaf_public_domains_plus_des_county_office_blocker';

const LESSON_HEADING =
  '### Null District Websites Can Still Resolve Through County Superintendent Hosts';
const LESSON_BODY =
  '*   **Lesson:** If the Arizona report-cards API preserves a county-keyed district row but `district_website` is null, do one bounded county-superintendent pass before declaring the county blocked. Cochise, Gila, Navajo, and Pima all resolved through county-owned district or accommodation pages even though the official state inventory showed no public district site.';

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

function upsertLesson() {
  const current = fs.readFileSync(lessonsPath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(lessonsPath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function renderStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Arizona California-Grade Audit Report v2',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe}`,
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
    ...verifiedRows.map((row) => {
      const first = row.samples?.[0]?.source_url || 'n/a';
      return `- ${row.family}: ${row.family_status}; samples=${row.sample_count}; first=${first}`;
    }),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Completion decision',
    '',
    '- Arizona remains BLOCKED and not index-safe.',
    '- Education is sharper again: the four no-website counties now have reviewed county-owned routing leaves, so the remaining education blocker is limited to three already-reviewed public district domains that still expose no role-verifiable local leaf.',
    '- County/local disability resources remain blocked separately because the DES office lane is still challenge-blocked and the accessible AHCCCS lane still lacks a county-to-office contract.',
  ].join('\n') + '\n';
}

export function generateBatch236ArizonaCountyOwnedEducationRepairV1() {
  const summary = readJson(FILES.summary);
  const gapRows = readJsonl(FILES.gap);
  const failureRows = readJsonl(FILES.failures);
  const verifiedRows = readJsonl(FILES.verified);
  const nextRows = readJsonl(FILES.next);
  const packet = readJson(FILES.packet);
  const queueRows = readJsonl(FILES.queue);

  const priorSamples =
    verifiedRows.find((row) => row.family === 'district_or_county_education_routing')?.samples || [];
  const retainedSamples = priorSamples.filter((sample) => ![
    'coconino reviewed public domain without leaf',
    'mohave reviewed public domain without leaf',
    'yavapai reviewed public domain without leaf',
  ].includes(sample.sample_name));

  packet.current_problem_metrics.authoredExactLeafCount = 12;
  packet.current_problem_metrics.unresolvedDistrictOwnedLeafCount = 3;
  packet.current_problem_metrics.unresolvedNoPublicWebsiteCount = 0;
  packet.current_problem_metrics.unresolvedReviewedPublicDomainWithoutLeafCount =
    REMAINING_BLOCKED_PUBLIC_DOMAIN_COUNTIES.length;
  packet.current_problem_metrics.reviewedCountyOwnedLeafCount = RESOLVED_COUNTY_OWNED_LEAVES.length;
  packet.verified_local_leaf_counties = [
    'apache-az',
    'cochise-az',
    'gila-az',
    'graham-az',
    'greenlee-az',
    'la-paz-az',
    'maricopa-az',
    'navajo-az',
    'pima-az',
    'pinal-az',
    'santa-cruz-az',
    'yuma-az',
  ];
  packet.unresolved_local_leaf_counties = [...REMAINING_BLOCKED_PUBLIC_DOMAIN_COUNTIES];
  packet.unresolved_no_public_website_counties = [];
  packet.unresolved_reviewed_public_domain_without_leaf_counties = [...REMAINING_BLOCKED_PUBLIC_DOMAIN_COUNTIES];
  packet.reviewed_county_owned_leaf_samples = RESOLVED_COUNTY_OWNED_LEAVES;
  packet.packet_complete_when =
    'At least one reviewed district-owned or county-owned education-routing leaf is attached per Arizona county, or the only remaining counties are explicitly blocked on already-reviewed public domains that lack role-verifiable local leaves.';

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: EDUCATION_FAMILY_STATUS,
          status_reason: EDUCATION_STATUS_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: EDUCATION_FAILURE_CODE,
          evidence: EDUCATION_EVIDENCE,
          next_action: EDUCATION_NEXT_ACTION,
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    const blockedSamples = [
      {
        sample_name: 'coconino reviewed public domain without leaf',
        county_id: 'coconino-az',
        source_url: 'https://www.ccasdaz.org/',
        final_url: 'https://www.ccasdaz.org/',
        verification_status: 'blocked',
        source_type: 'reviewed_public_domain_without_role_leaf',
        source_table: 'reviewed_live_probe',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The live district homepage and sitemap_index.xml exposed only school-resources student/parent anchors and no role-verifiable special-education or student-services leaf.',
      },
      {
        sample_name: 'mohave reviewed public domain without leaf',
        county_id: 'mohave-az',
        source_url: 'https://www.mohavelearning.org/',
        final_url: 'https://www.mohavelearning.org/',
        verification_status: 'blocked',
        source_type: 'reviewed_public_domain_without_role_leaf',
        source_table: 'reviewed_live_probe',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The live homepage and /site-map exposed only generic parents/students pages and no role-verifiable education-routing leaf.',
      },
      {
        sample_name: 'yavapai reviewed public domain without leaf',
        county_id: 'yavapai-az',
        source_url: 'https://www.yavapaicountyhighschool.com/',
        final_url: 'https://www.yavapaicountyhighschool.com/',
        verification_status: 'blocked',
        source_type: 'reviewed_public_domain_without_role_leaf',
        source_table: 'reviewed_live_probe',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The live homepage and sitemap.xml surfaced only business/finance, parent handbook, and general student documents with no special-education or student-services leaf.',
      },
    ];
    const samples = [
      ...retainedSamples,
      ...RESOLVED_COUNTY_OWNED_LEAVES,
      ...blockedSamples,
    ];
    return {
      ...row,
      family_status: EDUCATION_FAMILY_STATUS,
      query_basis:
        'Official Arizona report-cards county-keyed district roots first, then one bounded county-superintendent or county-schools pass for null-website counties, with no further reprobe on already-reviewed public district domains that still lack role-verifiable leaves.',
      blocker_code: EDUCATION_FAILURE_CODE,
      blocker_evidence: EDUCATION_EVIDENCE,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          failure_code: EDUCATION_FAILURE_CODE,
          next_action: EDUCATION_NEXT_ACTION,
          evidence: EDUCATION_EVIDENCE,
        }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: STATE_PRIMARY_GAP,
    final_blockers: summary.final_blockers.map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? {
            ...blocker,
            failure_code: EDUCATION_FAILURE_CODE,
            evidence: EDUCATION_EVIDENCE,
          }
        : blocker
    )),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'arizona'
      ? {
          ...row,
          primary_gap_reason: STATE_PRIMARY_GAP,
        }
      : row
  ));

  writeJson(FILES.summary, updatedSummary);
  writeJsonl(FILES.gap, updatedGapRows);
  writeJsonl(FILES.failures, updatedFailureRows);
  writeJsonl(FILES.verified, updatedVerifiedRows);
  writeJsonl(FILES.next, updatedNextRows);
  writeJson(FILES.packet, packet);
  writeJsonl(FILES.queue, updatedQueueRows);

  const stateReport = renderStateReport(
    updatedSummary,
    updatedGapRows,
    updatedFailureRows,
    updatedVerifiedRows,
    updatedNextRows,
  );
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const lessonAdded = upsertLesson();

  const batchSummary = {
    state: 'arizona',
    batch: 'batch236_arizona_county_owned_education_repair_v1',
    classification: 'BLOCKED',
    index_safe: false,
    resolved_county_owned_leaf_counties: RESOLVED_COUNTY_OWNED_LEAVES.map((row) => row.county_id),
    remaining_reviewed_public_domain_without_leaf_counties: REMAINING_BLOCKED_PUBLIC_DOMAIN_COUNTIES,
    county_local_resources_still_blocked: true,
    primary_gap_reason: STATE_PRIMARY_GAP,
    lesson_added: lessonAdded,
  };
  writeJson(OUTPUTS.summary, batchSummary);

  const batchReport = [
    '# Arizona County-Owned Education Repair Report v1',
    '',
    '- state: Arizona',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: county-owned superintendent and accommodation pages resolved all four no-website Arizona education counties',
    '',
    '## Resolved counties',
    '',
    ...RESOLVED_COUNTY_OWNED_LEAVES.map((row) => `- ${row.county_id}: ${row.source_url}`),
    '',
    '## Remaining blocked education counties',
    '',
    ...REMAINING_BLOCKED_PUBLIC_DOMAIN_COUNTIES.map((countyId) => `- ${countyId}`),
    '',
    '## Remaining state blocker',
    '',
    '- county_local_disability_resources remains blocked on DES challenge shells plus no county-to-office contract on reviewable AHCCCS pages.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch236ArizonaCountyOwnedEducationRepairV1();
  console.log(JSON.stringify(summary, null, 2));
}
