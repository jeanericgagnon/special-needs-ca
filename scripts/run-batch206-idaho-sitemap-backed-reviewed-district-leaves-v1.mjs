import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch206_idaho_sitemap_backed_reviewed_district_leaves_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch206-idaho-sitemap-backed-reviewed-district-leaves-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const EDUCATION_FAILURE_CODE = 'reviewed_district_special_services_leaves_exist_but_county_grade_mapping_is_still_incomplete';
const EDUCATION_NEXT_ACTION = 'expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet';
const EDUCATION_STATUS_REASON = 'The Idaho education blocker is now an exact reviewed-leaf expansion lane, not just a root packet. Official district-owned local leaves are already reviewable on the public web for five counties: Cassia County School District Special Services, Payette Joint District Special Services, Pocatello-Chubbuck School District 25 Special Services, Boundary County School District 101 Special Services, and Butte County Joint District Special Education. Those pages preserve district-owned special-education or special-services context, and Boundary plus Butte were verified directly from official district sitemap exact leaves. Idaho still is not county-grade because the statewide SDE directory exposes no county-to-district contract and the current packet still carries reviewed local leaves for only a small subset of the 44 counties.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 bounded live exact district leaf checks taken directly from the existing Idaho packet signals and official district sitemap-backed roots. https://www.cassiaschools.org/page/special-services/ returned HTTP 200 with title `Special Services | Cassia County School District` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. https://www.payetteschools.org/our-district/departments/special-education returned HTTP 200 with title `Special Services - Payette Joint District` and preserved special-education and special-services text on the district-owned page. https://www.sd25.us/departments/special-services returned HTTP 200 with title `Special Services - Pocatello-Chubbuck School District 25` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. The official Boundary County District #101 sitemap at https://www.bcsd101.com/sitemap.xml exposed an exact local leaf https://www.bcsd101.com/page/special-services/, which returned HTTP 200 with title `Special Services | Boundary County School District 101`. The official Butte County District #111 sitemap at https://www.butteschooldistrict.org/sitemap.xml exposed an exact local leaf https://www.butteschooldistrict.org/departments/special_education, which returned HTTP 200 with title `Special Education - buttecountyschools` and preserved a Special Education page heading on the district-owned host. A bounded Blaine County District #61 probe also found a district-owned support-services page, but it stayed signal-only because the exact special-education role text was weaker than the other verified leaves. Those reviewed exact leaves prove Idaho education has moved beyond root authoring for a small but growing county subset. But the statewide SDE directory still exposes no county-to-district contract, and the packet still does not carry reviewed local leaves across all counties, so Idaho remains blocked until that exact-leaf coverage expands county by county.';

const LESSON_HEADING = '### District Sitemaps Can Yield Safe Exact Leaves Faster Than Homepage Chasing';
const LESSON_BODY = "*   **Lesson:** If an official district sitemap already exposes a role-exact leaf like `/page/special-services/` or `/departments/special_education`, verify that exact URL before spending time on homepage navigation. Idaho's Boundary and Butte district sitemaps produced clean district-owned education leaves immediately.";

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
    '# Idaho California-Grade Audit Report v2',
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
    '- Idaho remains BLOCKED and not index-safe.',
    '- Education is still an exact reviewed-leaf expansion lane, but it is stronger than before: five counties now have reviewed district-owned special-education or special-services leaves.',
    '- Boundary and Butte were promoted from official district sitemap exact leaves; Blaine remains signal-only until a role-exact local leaf is verified.',
    '- County-local remains blocked separately on incomplete DHW county-to-office mapping.',
  ].join('\n') + '\n';
}

export function generateBatch206IdahoSitemapBackedReviewedDistrictLeavesV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const packet = readJson(INPUTS.packet);

  const reviewedLeaves = [
    {
      county_id: 'cassia-id',
      district_name: 'Cassia County School District',
      exact_leaf_url: 'https://www.cassiaschools.org/page/special-services/',
      evidence_terms: ['special education', 'special services', '504', 'procedural safeguards'],
      title: 'Special Services | Cassia County School District',
    },
    {
      county_id: 'payette-id',
      district_name: 'Payette Joint District',
      exact_leaf_url: 'https://www.payetteschools.org/our-district/departments/special-education',
      evidence_terms: ['special education', 'special services'],
      title: 'Special Services - Payette Joint District',
    },
    {
      county_id: 'bannock-id',
      district_name: 'Pocatello-Chubbuck School District 25',
      exact_leaf_url: 'https://www.sd25.us/departments/special-services',
      evidence_terms: ['special education', 'special services', '504', 'procedural safeguards'],
      title: 'Special Services - Pocatello-Chubbuck School District 25',
    },
    {
      county_id: 'boundary-id',
      district_name: 'Boundary County School District 101',
      exact_leaf_url: 'https://www.bcsd101.com/page/special-services/',
      evidence_terms: ['special services'],
      title: 'Special Services | Boundary County School District 101',
    },
    {
      county_id: 'butte-id',
      district_name: 'Butte County Joint District',
      exact_leaf_url: 'https://www.butteschooldistrict.org/departments/special_education',
      evidence_terms: ['special education'],
      title: 'Special Education - buttecountyschools',
    },
  ];

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade',
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

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade',
          evidence_strength: 'medium',
          sample_count: 8,
          query_basis: 'Reviewed live official Idaho district-owned special-education or special-services leaves reached directly from the existing packet signals plus official district sitemap exact leaves.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          samples: [
            {
              sample_name: 'Idaho School Districts page',
              source_url: 'https://www.sde.idaho.gov/school-districts/',
              final_url: 'https://www.sde.idaho.gov/school-districts/',
              verification_status: 'verified',
              source_type: 'official_statewide_district_directory',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official Idaho School Districts page preserves exact district-owned local roots but still does not expose a county contract.',
            },
            ...reviewedLeaves.map((leaf) => ({
              sample_name: `${leaf.district_name} reviewed district leaf`,
              source_url: leaf.exact_leaf_url,
              final_url: leaf.exact_leaf_url,
              verification_status: 'verified',
              source_type: 'district_owned_exact_education_leaf',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: `${leaf.title} preserves ${leaf.evidence_terms.join(', ')} on the district-owned page.`,
            })),
            {
              sample_name: 'Blaine County support-services signal only',
              source_url: 'https://www.blaineschools.org/our-district/staff-directory/district-support-services',
              final_url: 'https://www.blaineschools.org/our-district/staff-directory/district-support-services',
              verification_status: 'reviewed',
              source_type: 'district_owned_signal_only',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'Blaine County District #61 exposes a district-owned support-services page, but it stayed signal-only because the bounded pass did not yet verify a role-exact special-education leaf.',
            },
            {
              sample_name: 'Idaho district coverage remainder',
              source_url: 'https://www.sde.idaho.gov/school-districts/',
              final_url: 'https://www.sde.idaho.gov/school-districts/',
              verification_status: 'blocked',
              source_type: 'coverage_gap',
              source_table: 'packet_reconciliation',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'Only a small reviewed exact-leaf subset is materialized so far, so Idaho still lacks county-grade reviewed district leaves across the full 44-county state packet.',
            },
          ],
        }
      : row
  ));

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

  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...packet.current_problem_metrics,
      authoredExactLeafCount: 5,
      reviewedExactLeafCount: 5,
    },
    packet_complete_when: 'At least one reviewed district-owned education-routing leaf is attached for every Idaho county without relying on statewide SDE fallbacks or county-name inference alone. The current packet now has reviewed exact leaves for Cassia, Payette, Bannock, Boundary, and Butte as seed examples.',
    reviewed_exact_leaves: reviewedLeaves,
  };

  const updatedSummary = {
    ...summary,
    primary_gap_reason: summary.primary_gap_reason,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? {
            ...row,
            failure_code: EDUCATION_FAILURE_CODE,
            evidence: EDUCATION_EVIDENCE,
            next_action: EDUCATION_NEXT_ACTION,
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_206_idaho_sitemap_backed_reviewed_district_leaves_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'idaho',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_exact_district_leaves: 5,
    promoted_from_sitemap_exact_leaves: 2,
    signal_only_district_roots: 1,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 206 Idaho Sitemap-Backed Reviewed District Leaves Report v1',
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
    '- Idaho remains blocked and not index-safe.',
    '- Boundary and Butte now join Cassia, Payette, and Bannock as reviewed district-owned education-routing leaves.',
    '- Blaine remains signal-only because the bounded pass found a support-services page but not a cleaner role-exact special-education leaf.',
    '- Idaho should keep expanding exact district-owned leaves from official roots and sitemaps, county by county, without reopening statewide SDE discovery.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch206IdahoSitemapBackedReviewedDistrictLeavesV1();
  console.log(JSON.stringify(result, null, 2));
}
