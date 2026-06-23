import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'minnesota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'minnesota_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'minnesota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'minnesota_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'minnesota_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch161_minnesota_designation_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch161-minnesota-designation-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
};

const PA_REASON = 'Reviewed 2026-06-22 the dedicated first-party Minnesota Disability Law Center page. It explicitly says MDLC of Mid-Minnesota Legal Aid is the federally designated Protection and Advocacy agency for people with disabilities in Minnesota, which is enough to verify the protection_and_advocacy family at statewide grade.';
const PTI_BLOCKER = 'reviewed_first_party_support_source_lacks_explicit_pti_designation';
const EDUCATION_BLOCKER = 'official_school_directory_moved_shell_without_live_replacement';
const COUNTY_BLOCKER = 'minnesota_dhs_county_and_tribal_office_pages_redirect_to_radware_bot_manager';

const PA_SAMPLES = [
  {
    sample_name: 'Minnesota Disability Law Center',
    source_url: 'https://mylegalaid.org/disability-law-center/',
    final_url: 'https://mylegalaid.org/disability-law-center/',
    verification_status: 'official_verified',
    source_type: 'first_party_p_and_a_designation_page',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The Minnesota Disability Law Center page states that MDLC of Mid-Minnesota Legal Aid is the federally designated Protection and Advocacy agency for people with disabilities in the state of Minnesota.',
  },
  {
    sample_name: 'Mid-Minnesota Legal Aid homepage',
    source_url: 'https://mylegalaid.org/',
    final_url: 'https://mylegalaid.org/',
    verification_status: 'official_verified',
    source_type: 'first_party_statewide_legal_aid_and_disability_access',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The homepage preserves a live statewide Mid-Minnesota Legal Aid intake route plus direct Minnesota Disability Law Center contact routing.',
  },
];

const LESSON_HEADING = '### Dedicated Disability Law Center Pages Can Carry The P&A Proof That Homepages Omit';
const LESSON_BODY = '*   **Lesson:** If a legal-aid homepage only shows disability intake branding, click into the dedicated disability law center page before leaving protection-and-advocacy blocked. Minnesota only cleared P&A once the first-party MDLC page explicitly said it is the federally designated Protection and Advocacy agency for people with disabilities in the state.';

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
    '# Minnesota California-Grade Audit Report v2',
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
    '- Protection and advocacy is now repaired through the dedicated first-party Minnesota Disability Law Center page, which explicitly preserves the federally designated Protection and Advocacy agency designation.',
    '- Legal aid remains verified through Mid-Minnesota Legal Aid and is no longer carried as a pseudo-blocker in the summary packet.',
    '- Minnesota remains `BLOCKED` and `index_safe=false` because county- or district-grade education routing, explicit PTI designation, and county-local DHS office routing are still unresolved.',
  ].join('\n') + '\n';
}

export function generateBatch161MinnesotaDesignationRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'protection_and_advocacy'
      ? { ...row, family_status: 'verified_state_grade', status_reason: PA_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'protection_and_advocacy');

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'protection_and_advocacy'
      ? {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: PA_SAMPLES.length,
        query_basis: 'Reviewed 2026-06-22 the dedicated first-party Minnesota Disability Law Center page and the Mid-Minnesota Legal Aid homepage.',
        blocker_code: null,
        blocker_evidence: null,
        samples: PA_SAMPLES,
      }
      : row
  ));

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'protection_and_advocacy')
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 75,
    strong_critical_families: 9,
    weak_critical_families: 3,
    major_gap_families: ['parent_training_information_center'],
    verified_source_families_with_samples: Array.from(new Set([
      ...summary.verified_source_families_with_samples,
      'protection_and_advocacy',
      'legal_aid',
    ])),
    final_blockers: summary.final_blockers.filter((row) => !['protection_and_advocacy', 'legal_aid'].includes(row.family)),
    complete_ready: false,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'minnesota',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_family: 'protection_and_advocacy',
    removed_summary_only_blocker: 'legal_aid',
    remaining_blockers: [EDUCATION_BLOCKER, PTI_BLOCKER, COUNTY_BLOCKER],
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 161 Minnesota Designation Repair Report v1',
      '',
      'This pass does not broaden Minnesota discovery. It repairs the protection-and-advocacy designation from an explicit first-party page and removes the stale legal-aid pseudo-blocker from the summary packet.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      '- repaired_family: protection_and_advocacy',
      '- removed_summary_only_blocker: legal_aid',
      `- remaining_blockers: ${[EDUCATION_BLOCKER, PTI_BLOCKER, COUNTY_BLOCKER].join(', ')}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch161MinnesotaDesignationRepairV1();
  console.log(JSON.stringify(summary, null, 2));
}
