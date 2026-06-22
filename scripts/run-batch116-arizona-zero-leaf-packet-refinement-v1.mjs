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
  educationPacket: path.join(generatedDir, 'arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'arizona_county_local_disability_resources_leaf_authoring_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch116_arizona_zero_leaf_packet_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch116-arizona-zero-leaf-packet-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP = 'challenged_official_roots_and_zero_exact_leaf_targets_in_authoring_packets';
const EDUCATION_BLOCKER_CODE = 'education_packet_scaffold_only_zero_exact_district_leaves';
const COUNTY_BLOCKER_CODE = 'county_office_packet_scaffold_only_zero_exact_office_leaves';
const EDUCATION_NEXT = 'author_exact_district_owned_special_education_leaves_before_reopening_arizona_education';
const COUNTY_NEXT = 'author_exact_county_or_regional_des_office_leaves_before_reopening_arizona_county_local';

const EDUCATION_STATUS_REASON = 'The challenged AZED root is no longer the only blocker: the Arizona education leaf packet exists, but it still contains 0 exact district-owned leaves for the 15 affected counties. Until exact district-owned special-education or student-services targets are authored, the family remains blocked on generic statewide fallback rows rather than on a runnable local repair queue.';
const COUNTY_STATUS_REASON = 'The challenged Arizona DES root is no longer the only blocker: the Arizona county-local office packet exists, but it still contains 0 exact county-specific or regional office leaves for the 15 affected counties. Until exact county or regional office targets are authored, the family remains blocked on DOI and generic locator fallback rows rather than on a runnable local repair queue.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 Arizona district-or-county education routing packet plus current blocker artifacts. The official AZED special-education lane remains challenge-blocked, and the authored packet at data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0 across 15 affected counties. No district-owned Arizona special-education or student-services leaf has yet been attached to the repair queue, so the state packet still depends on generic https://www.azed.gov/specialeducation fallback rows.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 Arizona county-local office packet plus current blocker artifacts. The official Arizona DES lane remains challenge-blocked, and the authored packet at data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json still reports authoredExactLeafCount=0 across 15 affected counties. No exact county-specific or regional DES/FAA office leaf has yet been attached to the repair queue, so the state packet still depends on 14 DOI placeholder rows plus 1 generic legacy locator row.';

const LESSON_HEADING = '### Packet Scaffolds Do Not Count As Runnable Exact-Leaf Queues';
const LESSON_BODY = '*   **Lesson:** A state packet is not meaningfully “authored” just because a leaf-authoring JSON exists. If `authoredExactLeafCount=0`, keep the family blocked and route the next action to exact-target authoring, not to scraping or browser retries. Arizona’s challenged education and county-office families both needed this distinction.';

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
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
    '- The official state education and DES roots are still challenge-blocked, but the sharper immediate blocker is now packet emptiness: both authored leaf packets still contain zero exact local targets.',
    '- No district-owned education leaf or county-specific office leaf was attached to the Arizona repair queue in this bounded pass, so the state still depends on generic statewide or DOI fallback rows.',
    '- Arizona should only reopen these two families once exact district-owned or county-specific first-party targets are authored into the packets themselves.',
  ].join('\n') + '\n';
}

export function generateBatch116ArizonaZeroLeafPacketRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const educationPacket = readJson(INPUTS.educationPacket);
  const countyPacket = readJson(INPUTS.countyPacket);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'blocked_zero_exact_leaf_packet', status_reason: EDUCATION_STATUS_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'blocked_zero_exact_leaf_packet', status_reason: COUNTY_STATUS_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_BLOCKER_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_BLOCKER_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_zero_exact_leaf_packet',
        query_basis: 'Reviewed Arizona education blocker artifacts plus the district leaf-authoring packet metrics.',
        blocker_code: EDUCATION_BLOCKER_CODE,
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_zero_exact_leaf_packet',
        query_basis: 'Reviewed Arizona county-local blocker artifacts plus the county office leaf-authoring packet metrics.',
        blocker_code: COUNTY_BLOCKER_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_BLOCKER_CODE, next_action: EDUCATION_NEXT, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_BLOCKER_CODE, next_action: COUNTY_NEXT, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    complete_ready: false,
    primary_gap_reason: PRIMARY_GAP,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        failure_code: EDUCATION_BLOCKER_CODE,
        evidence: EDUCATION_EVIDENCE,
      },
      {
        family: 'county_local_disability_resources',
        failure_code: COUNTY_BLOCKER_CODE,
        evidence: COUNTY_EVIDENCE,
      },
    ],
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    primary_gap_reason: updatedSummary.primary_gap_reason,
    packet_metrics: {
      educationAuthoredExactLeafCount: educationPacket.current_problem_metrics?.authoredExactLeafCount ?? null,
      countyAuthoredExactLeafCount: countyPacket.current_problem_metrics?.authoredExactLeafCount ?? null,
      educationAffectedCounties: educationPacket.affected_counties?.length ?? null,
      countyAffectedCounties: countyPacket.affected_counties?.length ?? null,
    },
    refined_families: [
      'district_or_county_education_routing',
      'county_local_disability_resources',
    ],
    lesson_added: lessonAdded,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 116 Arizona Zero-Leaf Packet Refinement Report v1',
      '',
      'This pass does not broaden Arizona discovery. It tightens the final blockers by distinguishing packet scaffolds from real exact-leaf repair queues.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- primary_gap_reason: ${updatedSummary.primary_gap_reason}`,
      `- education_authored_exact_leaf_count: ${batchSummary.packet_metrics.educationAuthoredExactLeafCount}`,
      `- county_authored_exact_leaf_count: ${batchSummary.packet_metrics.countyAuthoredExactLeafCount}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch116ArizonaZeroLeafPacketRefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
