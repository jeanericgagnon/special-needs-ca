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
  summary: path.join(generatedDir, 'batch234_arizona_unresolved_district_split_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch234-arizona-unresolved-district-split-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const VERIFIED_COUNTIES = [
  'apache-az',
  'graham-az',
  'greenlee-az',
  'la-paz-az',
  'maricopa-az',
  'pinal-az',
  'santa-cruz-az',
  'yuma-az',
];

const NO_PUBLIC_WEBSITE_COUNTIES = [
  'cochise-az',
  'gila-az',
  'navajo-az',
  'pima-az',
];

const REVIEWED_DOMAIN_NO_LEAF_COUNTIES = [
  'coconino-az',
  'mohave-az',
  'yavapai-az',
];

const EDUCATION_FAILURE_CODE =
  'unresolved_counties_now_split_between_no_public_website_roots_and_reviewed_public_domains_without_role_leafs';
const EDUCATION_STATUS_REASON =
  'Arizona education remains blocked, but the remaining counties are now split cleanly into two bounded failure modes: 4/15 county-keyed district roots still expose no public district website in the official report-cards API (cochise-az, gila-az, navajo-az, pima-az), while the other 3 unresolved counties do have live district domains and now fail a bounded homepage plus sitemap/site-map pass without any role-verifiable special-education or student-services leaf (coconino-az, mohave-az, yavapai-az).';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-23 bounded Arizona education follow-up on the remaining unresolved counties only. The official report-cards API still shows no district website at all for cochise-az, gila-az, navajo-az, and pima-az, so those counties have no district-owned leaf lane to probe in the current official data. The other unresolved counties do expose live district domains, but a bounded homepage plus sitemap/site-map pass still failed closed: https://www.ccasdaz.org/ returned a live homepage plus sitemap_index.xml yet surfaced only school-resources student/parent anchors and no role-verifiable special-education or student-services leaf; https://www.mohavelearning.org/ returned a live homepage and /site-map, but only generic parents/students pages and no role-verifiable education-routing leaf; https://www.yavapaicountyhighschool.com/ returned a live homepage and sitemap.xml, but the sitemap surfaced only business/finance, parent handbook, and general student documents with no special-education or student-services leaf. Arizona education therefore remains blocked on 4 no-website counties plus 3 reviewed public domains without a role-verifiable local leaf, rather than on generic unresolved district roots.';
const EDUCATION_NEXT_ACTION =
  'route_no_website_counties_to_county_or_superintendent_official_lanes_and_stop_reprobing_reviewed_public_domains_without_role_leafs_until_new_local_pages_exist';

const STATE_PRIMARY_GAP =
  'education_gap_split_between_no_public_website_counties_and_reviewed_no_leaf_domains_plus_des_county_office_blocker';

const LESSON_HEADING =
  '### A Live District Domain Can Still Be Terminally Blocked For Local Routing';
const LESSON_BODY =
  '*   **Lesson:** If a district-owned domain has a live homepage plus sitemap or site-map, do one bounded pass and then stop if it only exposes generic parent/student/business pages with no role-verifiable special-education or student-services leaf. Arizona closed Coconino, Mohave, and Yavapai as `reviewed_public_domain_without_role_leaf` instead of reprobing the same CMS sites again.';

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
    '- Education is now materially sharper: the unresolved counties are no longer one generic bucket, but 4 no-website counties plus 3 live district domains that have already failed a bounded local-leaf pass.',
    '- County/local disability resources remain blocked separately because the DES office lane is still challenge-blocked and the accessible AHCCCS lane still lacks a county-to-office contract.',
  ].join('\n') + '\n';
}

export function generateBatch234ArizonaUnresolvedDistrictSplitRefinementV1() {
  const summary = readJson(FILES.summary);
  const gapRows = readJsonl(FILES.gap);
  const failureRows = readJsonl(FILES.failures);
  const verifiedRows = readJsonl(FILES.verified);
  const nextRows = readJsonl(FILES.next);
  const packet = readJson(FILES.packet);
  const queueRows = readJsonl(FILES.queue);

  packet.current_problem_metrics.unresolvedDistrictOwnedLeafCount = 7;
  packet.current_problem_metrics.unresolvedNoPublicWebsiteCount = NO_PUBLIC_WEBSITE_COUNTIES.length;
  packet.current_problem_metrics.unresolvedReviewedPublicDomainWithoutLeafCount = REVIEWED_DOMAIN_NO_LEAF_COUNTIES.length;
  packet.verified_local_leaf_counties = VERIFIED_COUNTIES;
  packet.unresolved_local_leaf_counties = [...NO_PUBLIC_WEBSITE_COUNTIES, ...REVIEWED_DOMAIN_NO_LEAF_COUNTIES];
  packet.unresolved_no_public_website_counties = NO_PUBLIC_WEBSITE_COUNTIES;
  packet.unresolved_reviewed_public_domain_without_leaf_counties = REVIEWED_DOMAIN_NO_LEAF_COUNTIES;
  packet.packet_complete_when =
    'At least one reviewed district-owned or county-owned education-routing leaf is attached per Arizona county, or the remaining counties are explicitly blocked on no-public-website official roots rather than unresolved district probing.';

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_split_between_no_public_website_and_reviewed_public_domain_without_leaf',
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
    return {
      ...row,
      family_status: 'blocked_split_between_no_public_website_and_reviewed_public_domain_without_leaf',
      query_basis: 'Bounded district-owned same-domain verification from county-keyed Arizona report-cards roots, followed by one follow-up homepage plus sitemap/site-map pass on only the remaining public district domains.',
      blocker_code: EDUCATION_FAILURE_CODE,
      blocker_evidence: EDUCATION_EVIDENCE,
      sample_count: 10,
      samples: [
        ...(row.samples || []).filter((sample) => (
          ![
            'coconino reviewed public domain without leaf',
            'mohave reviewed public domain without leaf',
            'yavapai reviewed public domain without leaf',
          ].includes(sample.sample_name)
        )),
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
          evidence_snippet: 'The live homepage and /site-map exposed only generic parents/students pages and no role-verifiable special-education or student-services leaf.',
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
      ],
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
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'district_or_county_education_routing'
        ? {
            ...row,
            failure_code: EDUCATION_FAILURE_CODE,
            evidence: EDUCATION_EVIDENCE,
          }
        : row
    )),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'arizona'
      ? {
          ...row,
          primary_gap_reason: STATE_PRIMARY_GAP,
          weak_critical_families: 2,
        }
      : row
  ));

  writeJson(FILES.packet, packet);
  writeJsonl(FILES.gap, updatedGapRows);
  writeJsonl(FILES.failures, updatedFailureRows);
  writeJsonl(FILES.verified, updatedVerifiedRows);
  writeJsonl(FILES.next, updatedNextRows);
  writeJson(FILES.summary, updatedSummary);
  writeJsonl(FILES.queue, updatedQueueRows);
  const lessonAdded = upsertLesson();

  writeJson(OUTPUTS.summary, {
    batch: 'batch_234_arizona_unresolved_district_split_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    verified_leaf_counties: VERIFIED_COUNTIES,
    no_public_website_counties: NO_PUBLIC_WEBSITE_COUNTIES,
    reviewed_public_domain_without_leaf_counties: REVIEWED_DOMAIN_NO_LEAF_COUNTIES,
    lesson_added: lessonAdded,
  });

  fs.writeFileSync(OUTPUTS.stateReport, renderStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 234 Arizona Unresolved District Split Refinement v1',
      '',
      `- verified district-owned leaf counties: ${VERIFIED_COUNTIES.length}`,
      `- no-public-website counties: ${NO_PUBLIC_WEBSITE_COUNTIES.length} (${NO_PUBLIC_WEBSITE_COUNTIES.join(', ')})`,
      `- reviewed public domains without role leaf: ${REVIEWED_DOMAIN_NO_LEAF_COUNTIES.length} (${REVIEWED_DOMAIN_NO_LEAF_COUNTIES.join(', ')})`,
      '',
      '## Decision',
      '',
      '- This pass did not reopen broad Arizona discovery.',
      '- It only split the remaining education blocker into exact terminal sub-buckets using the official report-cards API plus one bounded same-domain follow-up on the 3 remaining public district domains.',
      '- Arizona remains blocked because county-local disability resources are still unresolved and education still lacks local routing proof for 7 counties.',
    ].join('\n') + '\n',
  );

  return {
    verifiedLeafCounties: VERIFIED_COUNTIES,
    noPublicWebsiteCounties: NO_PUBLIC_WEBSITE_COUNTIES,
    reviewedPublicDomainsWithoutLeaf: REVIEWED_DOMAIN_NO_LEAF_COUNTIES,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch234ArizonaUnresolvedDistrictSplitRefinementV1();
}
