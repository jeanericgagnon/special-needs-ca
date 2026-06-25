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
  packet: path.join(generatedDir, 'arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyInventory: path.join(generatedDir, 'arizona_report_cards_county_keyed_district_inventory_v1.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch366_arizona_alt_district_leaf_recovery_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch366-arizona-alt-district-leaf-recovery-report-v1.md'),
};

const BATCH_NAME = 'batch366_arizona_alt_district_leaf_recovery_v1';
const PRIMARY_GAP_REASON =
  'ahcccs_county_local_contract_still_missing_and_arizona_education_now_resolves_coconino_via_caviat_504_but_mohave_alt_leaf_still_needs_official_county_attachment_and_yavapai_still_lacks_role_leaf';
const EDUCATION_STATUS =
  'blocked_coconino_caviat_504_resolved_mohave_alt_leaf_candidate_and_yavapai_public_domain_without_role_leaf';
const EDUCATION_FAILURE_CODE =
  'coconino_caviat_504_verified_mohave_alt_leaf_found_but_unattached_and_yavapai_still_lacks_role_leaf';
const NEXT_ACTION =
  'verify_mohave_alt_leaf_with_official_county_attachment_and_hold_yavapai_until_role_bearing_leaf_exists';
const RECOMMENDED_BATCH =
  'hold_for_mohave_official_county_attachment_yavapai_role_leaf_or_county_local_contract';
const EDUCATION_REASON =
  'Reviewed 2026-06-25 one more bounded official Arizona alternative-district pass from the live AZ School Report Cards inventory. Coconino County is no longer limited to the accommodation-district root: the official detail API for Coconino Association for Vocation Industry and Technology (`educationOrganizationId 79381`) preserved `https://www.caviat.org/`, phone `928-645-2737`, and `19 Poplar Street, Page, AZ 86040`, and the official Census geocoder still resolved that address to Coconino County. The same official CAVIAT host now exposes a live `/page/504/` leaf whose rendered text preserves CAVIAT annual public nondiscrimination language plus district office contact details, which is enough to attach a local 504 route for Coconino. Mohave County also no longer bottoms out only in `mohavelearning.org`: the official detail API for Mohave Valley Elementary District (`educationOrganizationId 4379`) preserved `https://www.mvesd16.org/`, and that district-owned host now exposes a live `SPECIAL SERVICES` page plus a public `documents/special-education/3674` surface. But the same bounded official Census geocoder lane still fails to resolve the Mohave Valley address to a county in this pass, so that Mohave alternative remains a reviewed local-leaf candidate rather than a county-attached verified replacement. Yavapai Accommodation School District remains the only fully source-final local domain in the family: its public sitemap still exposes only generic pages and handbook/document leaves, and no role-bearing `504`, `special-education`, or `student-services` leaf is public. Arizona education therefore improves, but remains blocked on one still-empty reviewed public domain plus one Mohave alternative leaf that still needs official county attachment.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-25 a bounded official Arizona alternative-district lane from the live AZ School Report Cards app and exact district-owned same-domain leaves. `https://azreportcards.azed.gov/api/Entity/GetEntity?id=79381&fiscalYear=2025` preserved Coconino Association for Vocation Industry and Technology with `https://www.caviat.org/`, phone `928-645-2737`, and `19 Poplar Street, Page, AZ 86040`; the official Census geocoder still resolved that address to Coconino County; `https://www.caviat.org/wp-sitemap.xml` stayed live; and `https://www.caviat.org/page/504/` returned HTTP 200 with rendered annual public nondiscrimination language plus district office contact details, which is enough to attach a local 504 route for Coconino County. `https://azreportcards.azed.gov/api/Entity/GetEntity?id=4379&fiscalYear=2025` preserved Mohave Valley Elementary District with `https://www.mvesd16.org/`, phone `928-768-2507`, and `8450 S OLIVE AVE, MOHAVE VALLEY, AZ 86440-9214`; that district-owned host now exposes a live `https://www.mvesd16.org/page/special-services/` leaf plus a public `https://www.mvesd16.org/documents/special-education/3674` surface, but the bounded official Census geocoder still returned no match for the Mohave Valley address, so the alternative Mohave leaf remains candidate-only in this pass. `https://www.yavapaicountyhighschool.com/sitemap.xml` still exposed only generic pages plus handbook/document leaves, with no role-bearing `504`, `special-education`, or `student-services` URL. Arizona education therefore no longer fails equally across the old three-domain set, but it still cannot clear county grade while Mohave lacks official county attachment for the alternative leaf and Yavapai still lacks a role-bearing local leaf entirely.';
const LESSON_HEADING =
  '### Alternate LEAs On Official District Inventories Can Replace Dead-End County Roots';
const LESSON_BODY =
  '*   **Lesson:** If a state report-cards API exposes more than one LEA in a blocked county, do not stop at the first county-named accommodation district. Arizona only moved again once the same official inventory surfaced CAVIAT in Coconino and Mohave Valley Elementary in Mohave, revealing better same-domain local leaf candidates than the earlier dead-end roots.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
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
    '- Education is narrower than the prior three-domain dead-end. Coconino now clears through the official CAVIAT root plus its live 504 leaf, Mohave has a stronger alternate district-owned special-services leaf that still needs official county attachment in this lane, and Yavapai remains the only still-empty reviewed public district domain.',
    '- County-local remains blocked because the exact official AHCCCS PDF bundle is reviewable but still only proves non-contract support letters rather than county-to-office routing.',
    '- Arizona should only reopen county-local when a real official county-admin contract, office directory, service-area table, or county-to-office crosswalk exists. Education should only reopen further if Mohave gains official county attachment for the alternative leaf or Yavapai publishes a real role-bearing local leaf.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const newLine = '- Arizona remains blocked, but the education blocker is narrower: Coconino now clears through the official CAVIAT root plus a live 504 leaf, Mohave has a reviewed alternate special-services leaf that still lacks official county attachment in this lane, Yavapai still lacks a role-bearing local leaf, and county-local still bottoms out in AHCCCS support-letter PDFs rather than a county-routing contract.';
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
    '`district_or_county_education_routing` is still the highest-priority Arizona blocker, but it is no longer a flat three-domain dead end. The official AZ School Report Cards detail API now yields a better Coconino LEA: Coconino Association for Vocation Industry and Technology (`educationOrganizationId 79381`) preserves `https://www.caviat.org/`, and that official district-owned host exposes a live `/page/504/` leaf with annual public nondiscrimination language plus district office contact details, which is enough to attach a local 504 route for Coconino County. Mohave also now has a better alternative official district root: Mohave Valley Elementary District (`educationOrganizationId 4379`) preserves `https://www.mvesd16.org/`, and that host exposes a live `SPECIAL SERVICES` page plus a `documents/special-education/3674` surface. But the bounded official Census geocoder still does not resolve the Mohave Valley address in this lane, so Mohave remains candidate-only rather than county-attached. Yavapai Accommodation School District is still the only fully source-final public domain with no role-bearing local leaf. County-local remains separately blocked because the official AHCCCS support-letter PDFs still do not publish a county-to-office contract. Arizona therefore stays blocked and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official county attachment for the Mohave Valley Elementary alternative root, such as a successful official geocoder match, a county-keyed district export, or another state/county official artifact that ties that district to Mohave County in the review lane.',
    '- Any district-owned `special education`, `special services`, `student services`, `504`, or `Child Find` leaf on yavapaicountyhighschool.com.',
    '- Any official Arizona state or county export that maps Yavapai to local district special-education routing without relying on generic statewide fallbacks.',
    '- Any official AHCCCS, DES, or county-admin county-to-office assignment artifact for county-local disability resources.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Coconino Association for Vocation Industry and Technology report-cards detail](https://azreportcards.azed.gov/districts/Detail/79381)',
    '- [CAVIAT root](https://www.caviat.org/)',
    '- [CAVIAT 504 leaf](https://www.caviat.org/page/504/)',
    '- [CAVIAT parents/students page](https://www.caviat.org/information-for-parents-and-students/)',
    '- [Mohave Valley Elementary District report-cards detail](https://azreportcards.azed.gov/districts/Detail/4379)',
    '- [Mohave Valley School District root](https://www.mvesd16.org/)',
    '- [Mohave Valley special-services leaf](https://www.mvesd16.org/page/special-services/)',
    '- [Mohave Valley special-education document surface](https://www.mvesd16.org/documents/special-education/3674)',
    '- [Yavapai Accommodation School District root](https://www.yavapaicountyhighschool.com/)',
    '- [Yavapai sitemap](https://www.yavapaicountyhighschool.com/sitemap.xml)',
    '- [Yavapai documents page](https://www.yavapaicountyhighschool.com/documents/)',
    '- [AHCCCS University Family Care oversight page](https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html)',
    '- [County Administrator Office PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official artifact that county-attaches Mohave Valley Elementary District to Mohave County in the same bounded review lane.',
    '- Any newly published role-bearing local education leaf on yavapaicountyhighschool.com.',
    '- Any official Arizona county-local office assignment artifact.',
    '',
    '## Next State Order After Arizona',
    '',
    '1. New Hampshire',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 366 Arizona Alt District Leaf Recovery v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: replaced the old flat three-domain Arizona education dead end with one resolved alternative root, one candidate alternative root, and one still-empty reviewed public domain',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch366ArizonaAltDistrictLeafRecoveryV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const packet = readJson(INPUTS.packet);
  const countyInventory = readJsonl(INPUTS.countyInventory);

  const countyLocalBlocker = (summary.final_blockers || []).find((row) => row.family === 'county_local_disability_resources');

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: RECOMMENDED_BATCH,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        failure_code: EDUCATION_FAILURE_CODE,
        evidence: EDUCATION_EVIDENCE,
        next_action: NEXT_ACTION,
      },
      countyLocalBlocker,
    ].filter(Boolean),
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
          sample_count: 8,
          query_basis: 'Reviewed 2026-06-25 the Arizona report-cards alternative LEA roots plus exact same-domain local leaves for the remaining blocked counties.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          samples: [
            {
              sample_name: 'Coconino CAVIAT report-cards detail root',
              source_url: 'https://azreportcards.azed.gov/districts/Detail/79381',
              final_url: 'https://azreportcards.azed.gov/districts/Detail/79381',
              verification_status: 'verified',
              source_type: 'official_state_district_detail_root',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The official Arizona report-cards detail route for Coconino Association for Vocation Industry and Technology preserves district website https://www.caviat.org/, phone 928-645-2737, and a Page, Arizona address that the official Census geocoder still resolves to Coconino County.',
            },
            {
              sample_name: 'Coconino CAVIAT 504 leaf',
              source_url: 'https://www.caviat.org/page/504/',
              final_url: 'https://www.caviat.org/page/504/',
              verification_status: 'verified',
              source_type: 'official_district_504_leaf',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The live CAVIAT 504 page preserves annual public nondiscrimination language plus district office contact details on the official district-owned host.',
            },
            {
              sample_name: 'Mohave Valley Elementary report-cards detail root',
              source_url: 'https://azreportcards.azed.gov/districts/Detail/4379',
              final_url: 'https://azreportcards.azed.gov/districts/Detail/4379',
              verification_status: 'candidate',
              source_type: 'official_state_district_detail_root_with_unresolved_county_attachment',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The official Arizona report-cards detail route for Mohave Valley Elementary District preserves district website https://www.mvesd16.org/, phone 928-768-2507, and 8450 S Olive Ave, Mohave Valley, AZ 86440, but the bounded official Census geocoder still returns no county match in this lane.',
            },
            {
              sample_name: 'Mohave Valley special-services leaf',
              source_url: 'https://www.mvesd16.org/page/special-services/',
              final_url: 'https://www.mvesd16.org/page/special-services/',
              verification_status: 'candidate',
              source_type: 'official_district_special_services_leaf_pending_county_attachment',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The alternate Mohave district-owned host now exposes a live SPECIAL SERVICES leaf rather than only generic pages.',
            },
            {
              sample_name: 'Mohave Valley special-education document surface',
              source_url: 'https://www.mvesd16.org/documents/special-education/3674',
              final_url: 'https://www.mvesd16.org/documents/special-education/3674',
              verification_status: 'candidate',
              source_type: 'official_district_special_education_document_surface_pending_county_attachment',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The alternate Mohave district-owned host also exposes a public special-education document surface under documents/special-education/3674.',
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
              sample_name: 'Yavapai sitemap still without role leaf',
              source_url: 'https://www.yavapaicountyhighschool.com/sitemap.xml',
              final_url: 'https://www.yavapaicountyhighschool.com/sitemap.xml',
              verification_status: 'blocked',
              source_type: 'official_sitemap_without_role_leaf',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The official sitemap still only exposed generic pages plus handbook/document leaves, with no role-bearing 504, special-education, or student-services URL.',
            },
            {
              sample_name: 'Yavapai exact role leaves still absent',
              source_url: 'https://www.yavapaicountyhighschool.com/documents/',
              final_url: 'https://www.yavapaicountyhighschool.com/documents/',
              verification_status: 'blocked',
              source_type: 'official_documents_surface_without_role_content',
              source_table: BATCH_NAME,
              fetched_at: '2026-06-25T00:00:00.000Z',
              evidence_snippet: 'The public documents page still preserves no role-bearing content, and the exact 504, special-education, and student-services leaves are still not public on the Yavapai host.',
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

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'arizona'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: RECOMMENDED_BATCH,
          repair_lane: 'repair_from_state_packet',
        }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'arizona'
        ? {
            ...row,
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: RECOMMENDED_BATCH,
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: EDUCATION_STATUS,
            },
          }
        : row
    )),
  };

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...packet.current_problem_metrics,
      authoredExactLeafCount: 13,
      unresolvedDistrictOwnedLeafCount: 2,
      unresolvedReviewedPublicDomainWithoutLeafCount: 1,
      reviewedPublicDomainSitemapExhaustedCount: 1,
      resolvedAlternativeDistrictLeafCount: 1,
      alternativeDistrictLeafCandidateCount: 1,
    },
    reviewed_root_samples: packet.reviewed_root_samples.map((row) => (
      row.county_id === 'coconino-az'
        ? {
            ...row,
            educationOrganizationId: 79381,
            district_name: 'Coconino Association for Vocation Industry and Technology',
            detail_url: 'https://azreportcards.azed.gov/districts/Detail/79381',
            api_url: 'https://azreportcards.azed.gov/api/Entity/GetEntity?id=79381&fiscalYear=2025',
            district_website: 'https://www.caviat.org/',
            telephone: '928-645-2737',
            address: '19 Poplar Street, Page, AZ86040',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official Arizona report-cards detail API now preserves CAVIAT as a better Coconino district root, with district website https://www.caviat.org/, phone 928-645-2737, and a Page address that geocodes to Coconino County.',
          }
        : row
    )),
    root_domains_to_review: [
      'official report-cards district detail roots first',
      'district-owned Arizona K-12 domains extracted from report-cards detail fields next',
      'for blocked counties, review alternate LEAs from the same official county inventory before accepting a dead-end accommodation root',
      'do not reopen challenged AZED host discovery until root, robots.txt, and sitemap.xml clear',
    ],
  };

  const updatedCountyInventory = countyInventory.map((row) => (
    row.county_id === 'coconino-az'
      ? {
          ...row,
          educationOrganizationId: 79381,
          district_name: 'Coconino Association for Vocation Industry and Technology',
          detail_url: 'https://azreportcards.azed.gov/districts/Detail/79381',
          api_url: 'https://azreportcards.azed.gov/api/Entity/GetEntity?id=79381&fiscalYear=2025',
          district_website: 'https://www.caviat.org/',
          telephone: '928-645-2737',
          address: '19 Poplar Street, Page, AZ86040',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'Coconino Association for Vocation Industry and Technology is exposed on the official report-cards host through a district detail route, and its official detail API preserves district website https://www.caviat.org/, phone 928-645-2737, and address 19 Poplar Street, Page, AZ86040.',
        }
      : row
  ));

  appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    coconino_caviat_504_verified: true,
    coconino_caviat_county_match: true,
    mohave_alt_special_services_live: true,
    mohave_alt_special_education_document_live: true,
    mohave_alt_geocoder_matched: false,
    yavapai_role_hits_found: 0,
    unresolved_education_counties: 2,
    result: 'coconino_caviat_504_verified_mohave_alt_leaf_candidate_only_yavapai_domain_still_empty',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit));
  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.countyInventory, updatedCountyInventory);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch366ArizonaAltDistrictLeafRecoveryV1();
  console.log(JSON.stringify(result, null, 2));
}
