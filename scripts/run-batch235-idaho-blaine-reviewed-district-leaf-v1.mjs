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
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch235_idaho_blaine_reviewed_district_leaf_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch235-idaho-blaine-reviewed-district-leaf-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const BLAINE_LEAF = {
  county_id: 'blaine-id',
  district_name: 'Blaine County District #61',
  exact_leaf_url: 'https://www.blaineschools.org/teaching-and-learning/teaching-learning/educational-programs/special-education',
  evidence_terms: ['special education', 'procedural safeguards'],
  title: 'Special Education',
};

const EDUCATION_FAILURE_CODE = 'reviewed_district_special_services_leaves_exist_but_county_grade_mapping_is_still_incomplete';
const EDUCATION_STATUS_REASON =
  'The Idaho education blocker is now an exact reviewed-leaf expansion lane, not just a root packet. Official district-owned local leaves are already reviewable on the public web for nine counties: Cassia County School District Special Services, Payette Joint District Special Services, Pocatello-Chubbuck School District 25 Special Services, Boundary County School District 101 Special Services, Butte County Joint District Special Education, Bonneville Joint District #93 Special Education Programs, Jerome SD #261 Special Services, Minidoka School District Special Services, and Blaine County District #61 Special Education. Those pages preserve district-owned special-education or special-services context, and Boundary, Butte, Bonneville, Minidoka, and Blaine were verified from sitemap, packet-backed exact-path, or district-page-linked exact leaves. Idaho still is not county-grade because the statewide SDE directory exposes no county-to-district contract and the current packet still carries reviewed local leaves for only a subset of the 44 counties.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-23 bounded live exact district leaf checks taken directly from the existing Idaho packet signals and official district sitemap-backed roots. https://www.cassiaschools.org/page/special-services/ returned HTTP 200 with title `Special Services | Cassia County School District` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. https://www.payetteschools.org/our-district/departments/special-education returned HTTP 200 with title `Special Services - Payette Joint District` and preserved special-education and special-services text on the district-owned page. https://www.sd25.us/departments/special-services returned HTTP 200 with title `Special Services - Pocatello-Chubbuck School District 25` and preserved special-education, special-services, 504, and procedural-safeguards text on the district-owned page. The official Boundary County District #101 sitemap at https://www.bcsd101.com/sitemap.xml exposed an exact local leaf https://www.bcsd101.com/page/special-services/, which returned HTTP 200 with title `Special Services | Boundary County School District 101`. The official Butte County District #111 sitemap at https://www.butteschooldistrict.org/sitemap.xml exposed an exact local leaf https://www.butteschooldistrict.org/departments/special_education, which returned HTTP 200 with title `Special Education - buttecountyschools` and preserved a Special Education page heading on the district-owned host. The official Bonneville Joint District #93 sitemap at https://www.d93schools.org/sitemap.xml exposed an exact local leaf https://www.d93schools.org/special-education-programs-home, which returned HTTP 200 with title `Special Education Programs` and preserved Special Education Programs text on the district-owned host. A bounded Jerome SD #261 anchor-text probe surfaced https://www.jeromeschools.org/specialserviceshome, which returned HTTP 200 with title `Special Services | Jerome SD #261` and preserved special-education plus special-services context on the district-owned page. The official Minidoka School District sitemap at https://www.minidokaschools.org/sitemap.xml exposed an exact local leaf https://www.minidokaschools.org/page/special-services/, which returned HTTP 200 with title `Special Services | We are Minidoka` and preserved special-services plus Section 504 context on the district-owned host. A bounded Blaine County District #61 follow-up on https://www.blaineschools.org/teaching-and-learning/teaching-learning/educational-programs found direct district-owned links to hidden CMS leaves for `Special Education` and `504 Plans`; the exact `Special Education` leaf at https://www.blaineschools.org/fs/pages/2147 resolved live to https://www.blaineschools.org/teaching-and-learning/teaching-learning/educational-programs/special-education with title `Special Education` and preserved procedural-safeguards text plus Director of Special Programs contact routing on the district-owned host. Those reviewed exact leaves prove Idaho education has moved beyond root authoring for a small but growing county subset. But the statewide SDE directory still exposes no county-to-district contract, and the packet still does not carry reviewed local leaves across all counties, so Idaho remains blocked until that exact-leaf coverage expands county by county.';
const EDUCATION_NEXT_ACTION =
  'expand_reviewed_exact_district_special_education_leaves_county_by_county_from_the_official_idaho_root_packet';

const LESSON_HEADING =
  '### District CMS `fs/pages` Links Can Hide Exact Special-Education Leaves';
const LESSON_BODY =
  '*   **Lesson:** If a district-owned program page lists `Special Education` or `504 Plans` but the URL structure looks opaque, follow the linked CMS `fs/pages/<id>` route before leaving the county as signal-only. Idaho’s Blaine district promoted once the hidden `fs/pages/2147` route resolved to a real district-owned `Special Education` leaf with procedural-safeguards text.';

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
    '# Idaho California-Grade Audit Report v2',
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
    '## Repair decision',
    '',
    '- Idaho remains BLOCKED and not index-safe.',
    '- Education is stronger than before: Blaine is no longer signal-only and now has a reviewed exact district-owned Special Education leaf.',
    '- County-local remains blocked separately on incomplete DHW county-to-office mapping.',
  ].join('\n') + '\n';
}

export function generateBatch235IdahoBlaineReviewedDistrictLeafV1() {
  const summary = readJson(FILES.summary);
  const gapRows = readJsonl(FILES.gap);
  const failureRows = readJsonl(FILES.failures);
  const verifiedRows = readJsonl(FILES.verified);
  const nextRows = readJsonl(FILES.next);
  const packet = readJson(FILES.packet);
  const queueRows = readJsonl(FILES.queue);

  packet.current_problem_metrics.authoredExactLeafCount = 9;
  packet.current_problem_metrics.reviewedExactLeafCount = 9;
  if (!(packet.reviewed_exact_leaves || []).some((row) => row.county_id === 'blaine-id')) {
    packet.reviewed_exact_leaves = [...(packet.reviewed_exact_leaves || []), BLAINE_LEAF];
  }
  packet.packet_complete_when =
    'At least one reviewed district-owned education-routing leaf is attached for every Idaho county without relying on statewide SDE fallbacks or county-name inference alone. The current packet now has reviewed exact leaves for Cassia, Payette, Bannock, Boundary, Butte, Bonneville, Jerome, Minidoka, and Blaine as seed examples.';

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

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    const baseSamples = (row.samples || []).filter((sample) => sample.sample_name !== 'Blaine County support-services signal only');
    const remainder = baseSamples.filter((sample) => sample.sample_name !== 'Idaho district coverage remainder');
    const gapSample = baseSamples.find((sample) => sample.sample_name === 'Idaho district coverage remainder');
    return {
      ...row,
      family_status: 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade',
      evidence_strength: 'medium',
      sample_count: 11,
      query_basis: 'Reviewed live official Idaho district-owned special-education or special-services leaves reached directly from the existing packet signals plus official district sitemap exact leaves and one hidden CMS leaf discovered from a district-owned program page.',
      blocker_code: EDUCATION_FAILURE_CODE,
      blocker_evidence: EDUCATION_EVIDENCE,
      samples: [
        ...remainder,
        {
          sample_name: 'Blaine County District #61 reviewed district leaf',
          source_url: 'https://www.blaineschools.org/fs/pages/2147',
          final_url: 'https://www.blaineschools.org/teaching-and-learning/teaching-learning/educational-programs/special-education',
          verification_status: 'verified',
          source_type: 'district_owned_exact_education_leaf',
          source_table: 'reviewed_live_probe',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'Special Education preserves procedural safeguards text plus Director of Special Programs contact routing on the district-owned Blaine host.',
        },
        gapSample || {
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
          primary_gap_reason: summary.primary_gap_reason,
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
    batch: 'batch_235_idaho_blaine_reviewed_district_leaf_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'idaho',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewed_exact_leaf_count: 9,
    promoted_county: 'blaine-id',
    lesson_added: lessonAdded,
  });

  fs.writeFileSync(OUTPUTS.stateReport, renderStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 235 Idaho Blaine Reviewed District Leaf v1',
      '',
      '- classification: BLOCKED',
      '- index_safe: false',
      '- refined_family: district_or_county_education_routing',
      `- failure_code: ${EDUCATION_FAILURE_CODE}`,
      '- promoted_county: blaine-id',
      '',
      '## Evidence',
      '',
      `- ${EDUCATION_EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- Idaho remains blocked and not index-safe.',
      '- Blaine is no longer signal-only: the district-owned Educational Programs page linked to a hidden CMS Special Education leaf that preserves procedural safeguards and special-program routing context.',
      '- The statewide county-grade blocker still remains because the reviewed exact-leaf subset is far short of all 44 counties, and county-local remains blocked separately.',
    ].join('\n') + '\n',
  );

  return { promotedCounty: 'blaine-id', reviewedExactLeafCount: 9 };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch235IdahoBlaineReviewedDistrictLeafV1();
}
