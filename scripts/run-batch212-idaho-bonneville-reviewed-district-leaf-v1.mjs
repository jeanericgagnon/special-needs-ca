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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch212_idaho_bonneville_reviewed_district_leaf_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch212-idaho-bonneville-reviewed-district-leaf-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const EDUCATION_FAILURE_CODE = 'reviewed_district_special_services_leaves_exist_but_county_grade_mapping_is_still_incomplete';
const EDUCATION_NEXT_ACTION = 'expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet';
const EDUCATION_STATUS_REASON = 'The Idaho education blocker is now an exact reviewed-leaf expansion lane, not just a root packet. Official district-owned local leaves are already reviewable on the public web for eight counties: Cassia County School District Special Services, Payette Joint District Special Services, Pocatello-Chubbuck School District 25 Special Services, Boundary County School District 101 Special Services, Butte County Joint District Special Education, Bonneville Joint District #93 Special Education Programs, Jerome SD #261 Special Services, and Minidoka School District Special Services. Those pages preserve district-owned special-education or special-services context, and Boundary, Butte, Bonneville, and Minidoka were verified from exact district-owned leaves surfaced by sitemap or packet-backed exact-path signals. Idaho still is not county-grade because the statewide SDE directory exposes no county-to-district contract and the current packet still carries reviewed local leaves for only a small subset of the 44 counties.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 bounded live exact district leaf checks taken directly from the existing Idaho packet signals and official district sitemap-backed roots. https://www.cassiaschools.org/page/special-services/ returned HTTP 200 with title `Special Services | Cassia County School District` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. https://www.payetteschools.org/our-district/departments/special-education returned HTTP 200 with title `Special Services - Payette Joint District` and preserved special-education and special-services text on the district-owned page. https://www.sd25.us/departments/special-services returned HTTP 200 with title `Special Services - Pocatello-Chubbuck School District 25` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. The official Boundary County District #101 sitemap at https://www.bcsd101.com/sitemap.xml exposed an exact local leaf https://www.bcsd101.com/page/special-services/, which returned HTTP 200 with title `Special Services | Boundary County School District 101`. The official Butte County District #111 sitemap at https://www.butteschooldistrict.org/sitemap.xml exposed an exact local leaf https://www.butteschooldistrict.org/departments/special_education, which returned HTTP 200 with title `Special Education - buttecountyschools` and preserved a Special Education page heading on the district-owned host. The official Bonneville Joint District #93 sitemap at https://www.d93schools.org/sitemap.xml exposed an exact local leaf https://www.d93schools.org/special-education-programs-home, which returned HTTP 200 with title `Special Education Programs` and preserved Special Education Programs text on the district-owned host. A bounded Jerome SD #261 anchor-text probe surfaced https://www.jeromeschools.org/specialserviceshome, which returned HTTP 200 with title `Special Services | Jerome SD #261` and preserved special-education plus special-services context on the district-owned page. The official Minidoka School District sitemap at https://www.minidokaschools.org/sitemap.xml exposed an exact local leaf https://www.minidokaschools.org/page/special-services/, which returned HTTP 200 with title `Special Services | We are Minidoka` and preserved special-services plus Section 504 context on the district-owned host. A bounded Blaine County District #61 probe also found a district-owned support-services page, but it stayed signal-only because the exact special-education role text was weaker than the other verified leaves. Those reviewed exact leaves prove Idaho education has moved beyond root authoring for a small but growing county subset. But the statewide SDE directory still exposes no county-to-district contract, and the packet still does not carry reviewed local leaves across all counties, so Idaho remains blocked until that exact-leaf coverage expands county by county.';

const LESSON_HEADING = '### CMS Slugs Ending In `-home` Can Still Be Exact District Leaves';
const LESSON_BODY = "*   **Lesson:** If an official district sitemap surfaces a role-exact slug that ends in `-home`, verify the title and body before rejecting it as generic navigation. Idaho's Bonneville Joint District #93 used `/special-education-programs-home`, but the fetched page title and body still preserved exact Special Education Programs evidence on the district-owned host.";

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
    '- Education is still an exact reviewed-leaf expansion lane, but it is stronger than before: eight counties now have reviewed district-owned special-education or special-services leaves.',
    '- Boundary, Butte, Bonneville, and Minidoka were promoted from exact district-owned leaves surfaced by sitemap or packet-backed exact-path signals; Jerome was recovered from a role-exact district anchor, while Blaine remains signal-only until a cleaner local leaf is verified.',
    '- County-local remains blocked separately on incomplete DHW county-to-office mapping.',
  ].join('\n') + '\n';
}

export function generateBatch212IdahoBonnevilleReviewedDistrictLeafV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const packet = readJson(INPUTS.packet);
  const queueRows = readJsonl(INPUTS.queue);

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
    {
      county_id: 'bonneville-id',
      district_name: 'Bonneville Joint District #93',
      exact_leaf_url: 'https://www.d93schools.org/special-education-programs-home',
      evidence_terms: ['special education', 'exceptional'],
      title: 'Special Education Programs',
    },
    {
      county_id: 'jerome-id',
      district_name: 'Jerome SD #261',
      exact_leaf_url: 'https://www.jeromeschools.org/specialserviceshome',
      evidence_terms: ['special education', 'special services'],
      title: 'Special Services | Jerome SD #261',
    },
    {
      county_id: 'minidoka-id',
      district_name: 'Minidoka School District',
      exact_leaf_url: 'https://www.minidokaschools.org/page/special-services/',
      evidence_terms: ['special services', '504'],
      title: 'Special Services | We are Minidoka',
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
          sample_count: 11,
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
      authoredExactLeafCount: 8,
      reviewedExactLeafCount: 8,
    },
    packet_complete_when: 'At least one reviewed district-owned education-routing leaf is attached for every Idaho county without relying on statewide SDE fallbacks or county-name inference alone. The current packet now has reviewed exact leaves for Cassia, Payette, Bannock, Boundary, Butte, Bonneville, Jerome, and Minidoka as seed examples.',
    reviewed_exact_leaves: reviewedLeaves,
  };

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'reviewed_idaho_district_leaves_exist_but_county_grade_education_and_dhw_mapping_remain_incomplete',
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

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'idaho'
      ? {
          ...row,
          primary_gap_reason: 'reviewed_idaho_district_leaves_exist_but_county_grade_education_and_dhw_mapping_remain_incomplete',
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.queue, updatedQueueRows);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const report = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  const batchSummary = {
    batch: 'batch_212_idaho_bonneville_reviewed_district_leaf_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'idaho',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_exact_district_leaves: 8,
    promoted_from_sitemap_exact_leaves: 4,
    signal_only_district_roots: 1,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 212 Idaho Bonneville Reviewed District Leaf Report v1',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
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
    '- Jerome SD #261 and Minidoka School District now join Cassia, Payette, Bannock, Boundary, Butte, and Bonneville as reviewed district-owned education-routing leaves.',
    '- Boundary, Butte, Bonneville, and Minidoka were promoted from sitemap or exact-path leaf signals, while Jerome came from a role-exact district anchor.',
    '- Blaine remains signal-only because the bounded pass found a support-services page but not a cleaner role-exact special-education leaf.',
    '- Idaho should keep expanding exact district-owned leaves from official roots and sitemaps, county by county, without reopening statewide SDE discovery.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch212IdahoBonnevilleReviewedDistrictLeafV1();
  console.log(JSON.stringify(result, null, 2));
}
