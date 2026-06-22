import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'illinois_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'illinois_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'illinois_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'illinois_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'illinois_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch125_illinois_pti_successor_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch125-illinois-pti-successor-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'illinois-california-grade-audit-report-v2.md'),
};

const FRCD = 'https://frcd.org/';
const FMPTIC = 'https://fmptic.org/';
const BLOCKER_CODE = 'bounded_roe_leaf_packet_exhausted_before_county_grade_coverage';
const PTI_REASON = 'Reviewed current first-party successor pages now preserve statewide Illinois PTI designation. FRCD states it no longer holds the Illinois PTIC role as of October 1, 2025, and Family Matters PTIC states it is the only federally funded Parent Training and Information Center in Illinois and now covers the entire state.';
const LESSON_HEADING = '### PTI Successor Pattern: Use The Outgoing Center To Prove The Role Change, Then Verify The Incoming Center On Its Own First-Party Site';
const LESSON_BODY = '*   **Lesson:** When a statewide PTI blocker turns into a successor question, do not rely on the old sample alone. For Illinois, FRCD explicitly documented that it stopped holding the PTIC role on October 1, 2025, and Family Matters’ own site separately proved it became the only federally funded statewide Illinois PTI. That pair of first-party pages closed the role-transition gap without broader nonprofit rediscovery.';

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
    '# Illinois California-Grade Audit Report v2',
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
    '## Illinois final blocker decision',
    '',
    '- Parent training information center is now repaired: FRCD explicitly states it no longer holds the Illinois PTIC role as of October 1, 2025, and Family Matters PTIC now states on its own first-party site that it is the only federally funded Parent Training and Information Center in Illinois and covers the entire state.',
    '- District or county education routing remains the only blocker because the reviewed exact ROE-owned leaves still cover only a small bounded subset and do not truthfully prove district-grade routing across all 102 Illinois counties.',
    '- Illinois therefore remains BLOCKED and not index-safe until district-grade education leaves expand beyond the current bounded ROE set.',
  ].join('\n') + '\n';
}

export function generateBatch125IllinoisPtiSuccessorRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return { ...row, family_status: 'verified_state_grade', status_reason: PTI_REASON };
    }
    return row;
  });

  const updatedFailureRows = readJsonl(INPUTS.failures)
    .filter((row) => row.family !== 'parent_training_information_center');

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        query_basis: 'Reviewed outgoing and incoming first-party Illinois PTI pages now preserve the statewide role transition and current statewide designation.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 2,
        samples: [
          {
            sample_name: 'Family Resource Center on Disabilities',
            source_url: FRCD,
            final_url: FRCD,
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_artifact',
            source_table: 'batch125_illinois_pti_successor_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'After many years of serving as Illinois’ Parent Training and Information Center (PTIC), FRCD will no longer hold this role as of October 1, 2025. At that time, Family Matters PTIC will become the official Parent Training and Information Center for Illinois.',
          },
          {
            sample_name: 'Family Matters PTIC',
            source_url: FMPTIC,
            final_url: FMPTIC,
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_artifact',
            source_table: 'batch125_illinois_pti_successor_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'As of October 1, 2025, Family Matters Parent Training and Information Center (FMPTIC) has expanded our services to cover the entire state of Illinois. We are the only federally funded Parent Training and Information Center (PTIC) in Illinois.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = readJsonl(INPUTS.nextActions)
    .filter((row) => row.family !== 'parent_training_information_center')
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: BLOCKER_CODE,
    critical_gap_families: ['district_or_county_education_routing'],
    major_gap_families: [],
    verified_source_families_with_samples: updatedVerifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: updatedFailureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'illinois'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 91,
          weak_critical_families: 1,
          missing_critical_families: 0,
          primary_gap_reason: BLOCKER_CODE,
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    state: 'illinois',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_families: ['parent_training_information_center'],
    remaining_blockers: ['district_or_county_education_routing'],
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 125 Illinois PTI Successor Repair Report v1',
      '',
      'This pass repairs the Illinois PTI family using first-party successor-role evidence and leaves only the district-grade education blocker.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      `- repaired_families: ${batchSummary.repaired_families.join(', ')}`,
      `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch125IllinoisPtiSuccessorRepairV1();
  console.log(JSON.stringify(summary, null, 2));
}
