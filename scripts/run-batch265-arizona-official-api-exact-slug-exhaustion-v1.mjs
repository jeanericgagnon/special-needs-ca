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
  failures: path.join(generatedDir, 'arizona_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arizona_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'arizona_next_action_queue_v2.jsonl'),
  priorityQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  report: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch265_arizona_official_api_exact_slug_exhaustion_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch265-arizona-official-api-exact-slug-exhaustion-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments';
const EDUCATION_FAILURE_CODE = 'three_reviewed_public_district_domains_exhaust_sitemaps_wp_api_and_exact_slug_replays_without_role_leafs';
const EDUCATION_NEXT_ACTION = 'hold_three_reviewed_public_domains_until_role_bearing_special_education_or_student_services_leaves_exist';
const EDUCATION_STATUS_REASON = 'Arizona education is now blocked only on 3/15 counties whose public district domains are live but fully exhausted even after one more official API and exact-slug pass. Coconino County Accommodation School District returned HTTP 200 on the district root and official WordPress JSON search, but the wp-json search for `special education` only replayed false-positive Governing Board and staff records while the official page/post sitemaps still exposed zero role-bearing paths. Mohave Accelerated Schools stayed live on the district-owned root, but exact Finalsite-style role candidates such as `/fs/pages/504`, `/fs/pages/special-education`, `/fs/pages/student-services`, and `/fs/pages/special-services` all returned 404. Yavapai Accommodation School District proved its `/page/` namespace is live because `/page/contact-us/` returned HTTP 200, but `/page/special-education/`, `/page/student-services/`, and `/page/504/` all returned 404. The remaining Arizona education blocker is therefore source-final on three reviewed public domains that still lack role-bearing local leaves.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 one more bounded Arizona district-owned official API and exact-slug pass for the final three unresolved education counties. https://www.ccasdaz.org/ stayed live, and https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10 returned HTTP 200, but the official WordPress search only replayed false-positive Governing Board and staff records rather than a role-bearing special-education or student-services leaf; the official page-sitemap.xml and post-sitemap.xml still exposed zero matching role paths. https://www.mohavelearning.org/ stayed live, but exact Finalsite-style role candidates at /fs/pages/504, /fs/pages/special-education, /fs/pages/student-services, and /fs/pages/special-services all returned 404. https://www.yavapaicountyhighschool.com/ stayed live and its /page/contact-us/ route returned HTTP 200, proving the public page namespace is real, but /page/special-education/, /page/student-services/, and /page/504/ all returned 404. The remaining Arizona education blocker is now source-final on three reviewed public domains that still lack role-bearing local leaves even after sitemap, API, and exact-slug replay.';

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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Arizona California-Grade Audit Report v2',
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
    '- Arizona remains BLOCKED and not index-safe.',
    '- Education is now source-final on exactly three reviewed public district domains even after one more official WordPress API, sitemap, and exact-slug replay.',
    '- County/local disability resources remain blocked separately because the DES host family is still challenge-blocked and the accessible AHCCCS fallback only proves seven named ALTCS office cards plus a partial county map, not a county-to-office contract.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  const current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const replacement = current
    .replace('- Arizona: `three_public_district_domains_sitemap_exhausted_and_altcs_office_cards_still_lack_county_assignments`', '- Arizona: `three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments`')
    .replace('## Current Focus State: Idaho', '## Current Focus State: Arizona')
    .replace(
      '`district_or_county_education_routing` remains the top Idaho blocker in the state queue. The official SDE district directory still exposes no county contract, but district-owned special-education leaves are reviewable county by county. Emmett Independent School District now adds Gem County to the reviewed set, bringing Idaho to twelve reviewed district-owned county leaves while the remaining counties still need exact local expansion.',
      '`district_or_county_education_routing` remains the top Arizona blocker in the state queue. The final three public district domains are now fully exhausted: Coconino\'s live WordPress root plus wp-json search only replay false-positive board and staff pages, Mohave\'s live Finalsite root returns 404 on exact role slugs, and Yavapai\'s live `/page/` namespace returns 404 on role slugs even though `/page/contact-us/` is public.'
    )
    .replace(
      '- Any additional Idaho district-owned special-education or special-services leaf reached from the official SDE district directory for uncovered counties.\n- Or, a truthful statewide county-to-district contract on an official Idaho SDE surface.\n- Or, an official DHW county-to-office contract for the still-blocked 27 counties.\n- The live SDE district root and DHW office root are still not enough without county-grade routing fields.',
      '- Any public role-bearing special-education or student-services leaf on ccasdaz.org, mohavelearning.org, or yavapaicountyhighschool.com.\n- Or, a new official Arizona state or county export that maps those three counties to reviewed district routing.\n- Or, an official AHCCCS or DES county-to-office assignment artifact for county-local routing.\n- The live district roots, the live AHCCCS ALTCS page, and the partial county map are still not enough without county-grade routing fields.'
    )
    .replace(
      '- [Idaho SDE School Districts page](https://www.sde.idaho.gov/school-districts/)\n- [Idaho SDE School Districts JSON](https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049)\n- [Emmett Independent School District root](https://www.emmettschools.org/)\n- [Emmett district Special Education page](https://www.emmettschools.org/departments/special-education)\n- [Emmett Special Education - Early Childhood Preschool](https://www.emmettschools.org/our-district/programs/special-education-early-childhood-preschool)\n- [Idaho DHW office root](https://healthandwelfare.idaho.gov/offices)\n- [Idaho DHW Caldwell Office](https://healthandwelfare.idaho.gov/dhw/caldwell-office)',
      '- [Coconino County Accommodation School District root](https://www.ccasdaz.org/)\n- [Coconino wp-json search for special education](https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10)\n- [Coconino page sitemap](https://www.ccasdaz.org/page-sitemap.xml)\n- [Mohave Accelerated Schools root](https://www.mohavelearning.org/)\n- [Mohave exact 504 candidate](https://www.mohavelearning.org/fs/pages/504)\n- [Yavapai Accommodation School District root](https://www.yavapaicountyhighschool.com/)\n- [Yavapai contact page](https://www.yavapaicountyhighschool.com/page/contact-us/)\n- [Yavapai exact special-education candidate](https://www.yavapaicountyhighschool.com/page/special-education/)\n- [AHCCCS ALTCS Offices](https://www.azahcccs.gov/members/ALTCSlocations.html)\n- [AHCCCS Contacts](https://www.azahcccs.gov/shared/AHCCCScontacts.html)'
    )
    .replace(
      '- Any official Idaho district-owned special-education or special-services leaves for uncovered counties reached from the SDE directory.\n- Any official Idaho SDE county-to-district contract or district export with explicit county routing.\n- Any official Idaho DHW county-to-office crosswalk for the still-blocked 27 counties.',
      '- Any public role-bearing special-education or student-services leaf on the remaining three Arizona district domains.\n- Any official Arizona district export or report-card successor artifact that maps Coconino, Mohave, and Yavapai to reviewed local education routing.\n- Any official AHCCCS or DES county-to-office assignment artifact for Arizona county-local disability resources.'
    )
    .replace(
      '## Next State Order After Idaho\n\n1. Arizona\n2. Massachusetts\n3. Oregon\n4. Oklahoma\n5. Utah\n6. New Hampshire\n7. New Mexico\n8. New York\n9. North Carolina\n10. North Dakota',
      '## Next State Order After Arizona\n\n1. Massachusetts\n2. Oregon\n3. Oklahoma\n4. Utah\n5. New Hampshire\n6. New Mexico\n7. New York\n8. North Carolina\n9. North Dakota\n10. Rhode Island'
    );
  fs.writeFileSync(INPUTS.handoff, replacement);
}

export function generateBatch265ArizonaOfficialApiExactSlugExhaustionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const priorityRows = readJsonl(INPUTS.priorityQueue);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? { ...blocker, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
        : blocker
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_three_reviewed_public_domains_official_api_and_exact_slug_exhausted_without_role_leafs', status_reason: EDUCATION_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_three_reviewed_public_domains_official_api_and_exact_slug_exhausted_without_role_leafs',
          sample_count: 8,
          query_basis: 'Reviewed 2026-06-23 the final three Arizona district-owned public domains plus one more official API, sitemap, and exact-slug replay pass.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          samples: [
            ...(row.samples || []),
            {
              sample_name: 'Coconino wp-json special-education search false positives',
              source_url: 'https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10',
              final_url: 'https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10',
              verification_status: 'blocked',
              source_type: 'official_wp_json_search_without_role_leaf',
              source_table: 'batch265_arizona_official_api_exact_slug_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official WordPress search returned Governing Board and staff records rather than a special-education or student-services routing page.'
            },
            {
              sample_name: 'Mohave exact role-slug replay',
              source_url: 'https://www.mohavelearning.org/fs/pages/504',
              final_url: 'https://www.mohavelearning.org/fs/pages/504',
              verification_status: 'blocked',
              source_type: 'official_exact_slug_404',
              source_table: 'batch265_arizona_official_api_exact_slug_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live Finalsite district root stayed public, but exact role slugs like `/fs/pages/504` and companion special-education paths returned 404.'
            },
            {
              sample_name: 'Yavapai live page namespace without role leaf',
              source_url: 'https://www.yavapaicountyhighschool.com/page/contact-us/',
              final_url: 'https://www.yavapaicountyhighschool.com/page/contact-us/',
              verification_status: 'blocked',
              source_type: 'official_page_namespace_live_but_role_slug_404',
              source_table: 'batch265_arizona_official_api_exact_slug_exhaustion',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The district-owned `/page/contact-us/` route returned 200, proving the public page namespace is live, but `/page/special-education/`, `/page/student-services/`, and `/page/504/` all returned 404.'
            }
          ]
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: EDUCATION_NEXT_ACTION, evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedPriorityRows = priorityRows.map((row) => (
    (row.state_name || row.state) === 'Arizona'
      ? { ...row, classification: 'BLOCKED', index_safe: false, primary_gap_reason: PRIMARY_GAP_REASON, status: 'BLOCKED' }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.priorityQueue, updatedPriorityRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();

  writeJson(OUTPUTS.batchSummary, {
    batch: 'batch265_arizona_official_api_exact_slug_exhaustion_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'arizona',
    classification: 'BLOCKED',
    index_safe: false,
    reviewed_public_domain_count: 3,
    education_blocker_code: EDUCATION_FAILURE_CODE,
    new_official_surfaces: [
      'https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10',
      'https://www.mohavelearning.org/fs/pages/504',
      'https://www.yavapaicountyhighschool.com/page/contact-us/'
    ]
  });

  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 265 Arizona Official API / Exact Slug Exhaustion Report v1',
      '',
      '- classification: BLOCKED',
      '- index_safe: false',
      '- refined_family: district_or_county_education_routing',
      `- failure_code: ${EDUCATION_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${EDUCATION_EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- Arizona remains blocked and not index-safe.',
      '- One more bounded official API and exact-slug pass made the education blocker stronger, not weaker.',
      '- Coconino now has a reviewed live WordPress API false-positive lane, Mohave has reviewed live Finalsite 404 role slugs, and Yavapai has a live page namespace with role-slug 404s.',
    ].join('\n') + '\n'
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch265ArizonaOfficialApiExactSlugExhaustionV1();
  console.log(JSON.stringify(result, null, 2));
}
