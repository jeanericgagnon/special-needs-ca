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
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch351_arizona_education_surface_recheck_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch351-arizona-education-surface-recheck-report-v1.md'),
};

const BATCH_NAME = 'batch351_arizona_education_surface_recheck_v1';
const PRIMARY_GAP_REASON =
  'ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_live_public_education_surface_recheck_confirms_three_public_domains_still_lack_role_leaves';
const EDUCATION_STATUS =
  'blocked_three_reviewed_public_district_domains_live_surface_recheck_still_without_role_leafs';
const EDUCATION_FAILURE_CODE =
  'three_reviewed_public_district_domains_live_surface_recheck_exhausts_search_sitemap_and_exact_role_surfaces_without_role_leafs';
const NEXT_ACTION =
  'hold_three_reviewed_public_domains_until_role_bearing_special_education_student_services_or_504_leaves_exist';
const EDUCATION_REASON =
  'Reviewed 2026-06-25 one more bounded live Arizona district-owned public-surface pass for the final three unresolved education counties. Coconino County Accommodation School District stayed live at https://www.ccasdaz.org/, but its official `page-sitemap.xml` and `post-sitemap.xml` still exposed no role-bearing special-education, student-services, 504, or Child Find URLs, and fresh WordPress JSON searches for `special education`, `504`, `child find`, and `student services` only replayed false-positive Governing Board, About, Employment, school, or staff pages. Mohave Accelerated Schools stayed live at https://www.mohavelearning.org/, but the homepage preserved no role terms, exact leaf candidates such as `/page/504/`, `/page/special-education/`, and `/page/student-services/` returned 404, and the public `search-results/~board/news/post/special-education` surface returned HTTP 200 with no role-bearing content while the sitemap lane stayed unavailable (`/sitemap.xml` 404 and `/fs/pages/sitemap` 406). Yavapai Accommodation School District stayed live at https://www.yavapaicountyhighschool.com/, but its official sitemap only exposed generic pages, handbook/document leaves, and student outing forms; the `documents/` page preserved no role-bearing content; and `/page/504/`, `/page/special-education/`, and `/page/student-services/` all returned 404 even though `/page/contact-us/` remained public. The remaining Arizona education blocker is therefore source-final on three reviewed public domains that still lack role-bearing local leaves after live search, sitemap, documents, and exact-role rechecks.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-25 a bounded live Arizona district-owned public-surface recheck for the final three unresolved education counties. https://www.ccasdaz.org/ returned HTTP 200, `https://www.ccasdaz.org/page-sitemap.xml` and `https://www.ccasdaz.org/post-sitemap.xml` returned HTTP 200 with no role-bearing special-education, student-services, 504, or Child Find URLs, and WordPress JSON searches for `special education`, `504`, `child find`, and `student services` only replayed Governing Board, About, Employment, school, or staff false positives. https://www.mohavelearning.org/ returned HTTP 200 with no role-bearing terms on the homepage, `https://www.mohavelearning.org/page/504/`, `/page/special-education/`, and `/page/student-services/` all returned 404, `https://www.mohavelearning.org/search-results/~board/news/post/special-education` returned HTTP 200 but contained no role-bearing content, `https://www.mohavelearning.org/sitemap.xml` returned 404, and `https://www.mohavelearning.org/fs/pages/sitemap` returned 406. https://www.yavapaicountyhighschool.com/ returned HTTP 200, `https://www.yavapaicountyhighschool.com/sitemap.xml` returned HTTP 200 but only exposed generic pages and handbook/document leaves, `https://www.yavapaicountyhighschool.com/documents/` returned HTTP 200 with no role-bearing content, and `/page/504/`, `/page/special-education/`, and `/page/student-services/` all returned 404 while `/page/contact-us/` remained public. Arizona education therefore remains blocked because the reviewed public domains still expose no local role-bearing special-education, student-services, or 504 leaf.';

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
    '## Repair decision',
    '',
    '- Arizona remains BLOCKED and not index-safe.',
    '- Education remains source-final on the remaining three reviewed public district domains after one more live search, sitemap, documents, and exact-role recheck.',
    '- County-local remains blocked because the exact official AHCCCS PDF bundle is reviewable but still only proves non-contract support letters rather than county-to-office routing.',
    '- Arizona should only reopen education when one of the three district-owned domains publishes a real role-bearing local leaf, and should only reopen county-local when a real official county-admin contract, office directory, service-area table, or county-to-office crosswalk exists.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const newLine = '- Arizona remains blocked after a fresh live education-surface recheck: the final three district-owned public domains still expose no role-bearing local special-education, student-services, or 504 leaves, and county-local still bottoms out in AHCCCS support-letter PDFs rather than a county-routing contract.';
  const lines = text.split('\n').filter((line) => !line.startsWith('- Arizona remains blocked'));
  const notesIndex = lines.findIndex((line) => line.trim() === '## Notes');
  if (notesIndex === -1) return `${lines.join('\n').trimEnd()}\n${newLine}\n`;
  const nextLines = [...lines];
  nextLines.splice(notesIndex + 2, 0, newLine);
  return `${nextLines.join('\n').trimEnd()}\n`;
}

function buildHandoff(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));

  return [
    '# Gemini Source Scout Handoff',
    '',
    `Updated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: Arizona',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` is still the highest-priority Arizona blocker. Reviewed 2026-06-25 one more bounded live pass on the final three district-owned public domains. Coconino County Accommodation School District stayed live, but its public page/post sitemaps and WordPress JSON searches still only replayed false-positive board, employment, and staff records. Mohave Accelerated Schools stayed live, but the homepage preserved no role terms, the exact role pages still 404, the public search-results surface stayed empty, and the sitemap lanes remained unavailable. Yavapai Accommodation School District stayed live, but its sitemap only exposed generic pages plus handbook/document leaves, the `documents/` page preserved no role-bearing content, and the exact `504`, `special-education`, and `student-services` pages still 404. County-local remains separately blocked because the official AHCCCS UniversityFamilyCare PDF bundle is reviewable but only proves non-contract support letters. Arizona therefore stays blocked and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any district-owned `special education`, `special services`, `student services`, `504`, or `Child Find` leaf on ccasdaz.org, mohavelearning.org, or yavapaicountyhighschool.com.',
    '- Any official Arizona state or county export that maps the remaining counties to reviewed district routing without relying on generic statewide fallbacks.',
    '- Any official AHCCCS, DES, or county-admin county-to-office assignment artifact for county-local disability resources.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Coconino County Accommodation School District root](https://www.ccasdaz.org/)',
    '- [Coconino page sitemap](https://www.ccasdaz.org/page-sitemap.xml)',
    '- [Coconino post sitemap](https://www.ccasdaz.org/post-sitemap.xml)',
    '- [Coconino wp-json special education search](https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10)',
    '- [Coconino wp-json 504 search](https://www.ccasdaz.org/wp-json/wp/v2/search?search=504&per_page=20)',
    '- [Mohave Accelerated Schools root](https://www.mohavelearning.org/)',
    '- [Mohave public special-education search results](https://www.mohavelearning.org/search-results/~board/news/post/special-education)',
    '- [Mohave exact 504 page](https://www.mohavelearning.org/page/504/)',
    '- [Yavapai Accommodation School District root](https://www.yavapaicountyhighschool.com/)',
    '- [Yavapai sitemap](https://www.yavapaicountyhighschool.com/sitemap.xml)',
    '- [Yavapai documents page](https://www.yavapaicountyhighschool.com/documents/)',
    '- [Yavapai contact page](https://www.yavapaicountyhighschool.com/page/contact-us/)',
    '- [AHCCCS University Family Care oversight page](https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html)',
    '- [Pima Community Access Program PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/Pima.pdf)',
    '- [Pima County Administrator PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf)',
    '- [County Administrator Office PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any newly published role-bearing local education leaf on the final three Arizona district-owned domains.',
    '- Any official Arizona export or public table that maps those counties to local district special-education routing.',
    '- Any official AHCCCS, DES, or county-admin county-to-office routing artifact.',
    '',
    '## Next State Order After Arizona',
    '',
    '1. Massachusetts',
    '2. New Mexico',
    '3. South Dakota',
    '4. Rhode Island',
    '5. Virginia',
    '6. West Virginia',
    '7. North Dakota',
    '8. Wisconsin',
    '9. Washington',
    '10. Tennessee',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 351 Arizona Education Surface Recheck v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tightened the remaining education blocker with one more bounded live public-surface pass across the last three district-owned domains',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch351ArizonaEducationSurfaceRecheckV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_new_official_county_contract_or_role_leaf',
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        failure_code: EDUCATION_FAILURE_CODE,
        evidence: EDUCATION_EVIDENCE,
        next_action: NEXT_ACTION,
      },
      {
        family: 'county_local_disability_resources',
        ...(summary.final_blockers || []).find((row) => row.family === 'county_local_disability_resources'),
      },
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      district_or_county_education_routing: EDUCATION_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: EDUCATION_STATUS, status_reason: EDUCATION_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
        ...row,
        family_status: EDUCATION_STATUS,
        sample_count: 10,
        query_basis: 'Reviewed 2026-06-25 the final three Arizona district-owned public domains with one more live search, sitemap, documents, and exact-role recheck pass.',
        blocker_code: EDUCATION_FAILURE_CODE,
        blocker_evidence: EDUCATION_EVIDENCE,
        samples: [
          {
            sample_name: 'Coconino County Accommodation School District root',
            source_url: 'https://www.ccasdaz.org/',
            final_url: 'https://www.ccasdaz.org/',
            verification_status: 'blocked',
            source_type: 'reviewed_public_district_root_without_role_leaf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live district root remained public but still exposed no special-education, student-services, 504, or Child Find role leaf in the rendered homepage HTML.',
          },
          {
            sample_name: 'Coconino public sitemaps without role leaf',
            source_url: 'https://www.ccasdaz.org/page-sitemap.xml',
            final_url: 'https://www.ccasdaz.org/page-sitemap.xml',
            verification_status: 'blocked',
            source_type: 'reviewed_public_district_sitemap_without_role_leaf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official page and post sitemaps stayed live but still exposed zero special-education, student-services, 504, or Child Find URLs.',
          },
          {
            sample_name: 'Coconino wp-json role searches stayed false-positive',
            source_url: 'https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10',
            final_url: 'https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10',
            verification_status: 'blocked',
            source_type: 'official_wp_json_search_without_role_leaf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Fresh WordPress JSON searches for special education, 504, Child Find, and student services only replayed Governing Board, About, Employment, school, or staff records.',
          },
          {
            sample_name: 'Mohave Accelerated Schools root',
            source_url: 'https://www.mohavelearning.org/',
            final_url: 'https://www.mohavelearning.org/',
            verification_status: 'blocked',
            source_type: 'reviewed_public_district_root_without_role_leaf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live homepage stayed public but preserved no special-education, student-services, 504, or Child Find role terms.',
          },
          {
            sample_name: 'Mohave exact role pages still 404',
            source_url: 'https://www.mohavelearning.org/page/504/',
            final_url: 'https://www.mohavelearning.org/page/504/',
            verification_status: 'blocked',
            source_type: 'official_exact_role_slug_404',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Exact role pages such as `/page/504/`, `/page/special-education/`, and `/page/student-services/` still returned 404 on the public district host.',
          },
          {
            sample_name: 'Mohave public search-results surface stayed empty',
            source_url: 'https://www.mohavelearning.org/search-results/~board/news/post/special-education',
            final_url: 'https://www.mohavelearning.org/search-results/~board/news/post/special-education',
            verification_status: 'blocked',
            source_type: 'official_public_search_surface_without_role_content',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public search-results page returned HTTP 200 but contained no role-bearing special-education or student-services content.',
          },
          {
            sample_name: 'Mohave sitemap lanes unavailable',
            source_url: 'https://www.mohavelearning.org/fs/pages/sitemap',
            final_url: 'https://www.mohavelearning.org/fs/pages/sitemap',
            verification_status: 'blocked',
            source_type: 'official_sitemap_lane_unavailable',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public sitemap lanes stayed unavailable because `/sitemap.xml` returned 404 and `/fs/pages/sitemap` returned 406.',
          },
          {
            sample_name: 'Yavapai Accommodation School District root',
            source_url: 'https://www.yavapaicountyhighschool.com/',
            final_url: 'https://www.yavapaicountyhighschool.com/',
            verification_status: 'blocked',
            source_type: 'reviewed_public_district_root_without_role_leaf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live district root remained public but still exposed no role-bearing special-education, student-services, or 504 leaf.',
          },
          {
            sample_name: 'Yavapai sitemap only exposed generic and handbook leaves',
            source_url: 'https://www.yavapaicountyhighschool.com/sitemap.xml',
            final_url: 'https://www.yavapaicountyhighschool.com/sitemap.xml',
            verification_status: 'blocked',
            source_type: 'official_sitemap_without_role_leaf',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official sitemap stayed live but only exposed generic pages plus handbook/document and outing-form leaves rather than special-education or student-services routing.',
          },
          {
            sample_name: 'Yavapai documents plus exact role pages still empty',
            source_url: 'https://www.yavapaicountyhighschool.com/documents/',
            final_url: 'https://www.yavapaicountyhighschool.com/documents/',
            verification_status: 'blocked',
            source_type: 'official_documents_surface_without_role_content',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public documents page preserved no role-bearing content, and `/page/504/`, `/page/special-education/`, and `/page/student-services/` all still returned 404 while `/page/contact-us/` remained live.',
          },
        ],
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: NEXT_ACTION, evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedStateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'arizona'
      ? {
        ...row,
        primary_gap_reason: PRIMARY_GAP_REASON,
        recommended_batch: 'hold_for_new_official_county_contract_or_role_leaf',
        repair_lane: 'blocked_until_real_county_contract_or_role_leaf',
      }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    classifications: updatedQueueRows.reduce((acc, row) => {
      acc[row.classification] = (acc[row.classification] || 0) + 1;
      return acc;
    }, {}),
    indexSafeCount: updatedQueueRows.filter((row) => row.index_safe).length,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'arizona'
        ? {
          ...row,
          classification: 'BLOCKED',
          indexSafe: false,
          completenessPct: 83,
          weakCriticalFamilies: 2,
          familyStatuses: {
            ...row.familyStatuses,
            district_or_county_education_routing: EDUCATION_STATUS,
          },
          packetBatch: BATCH_NAME,
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          packetRecommendedBatch: 'hold_for_new_official_county_contract_or_role_leaf',
        }
        : row
    )),
  };

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'arizona',
    classification: 'BLOCKED',
    index_safe: false,
    ccasd_role_hits_found: 0,
    mohave_role_hits_found: 0,
    yavapai_role_hits_found: 0,
    ccasd_wp_json_false_positive_searches: 4,
    mohave_exact_role_404s: 3,
    mohave_search_results_empty: true,
    mohave_sitemap_xml_status: 404,
    mohave_fs_sitemap_status: 406,
    yavapai_exact_role_404s: 3,
    yavapai_documents_role_hits_found: 0,
    result: 'three_live_public_district_domains_still_lack_role_bearing_local_education_leaves',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedStateReport);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit));
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return {
    classification: updatedSummary.classification,
    primary_gap_reason: updatedSummary.primary_gap_reason,
    batch: BATCH_NAME,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch351ArizonaEducationSurfaceRecheckV1();
  console.log(JSON.stringify(result, null, 2));
}
