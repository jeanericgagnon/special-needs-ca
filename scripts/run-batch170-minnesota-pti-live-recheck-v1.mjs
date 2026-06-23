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
  failure: path.join(generatedDir, 'minnesota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'minnesota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'minnesota_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch170_minnesota_pti_live_recheck_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch170-minnesota-pti-live-recheck-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
};

const PTI_FAILURE = 'current_pacer_pages_and_retired_pti_paths_do_not_preserve_explicit_pti_designation';
const PTI_REASON = 'Minnesota PTI remains blocked after a current first-party recheck: the live PACER homepage and About page are public and current, and the old `/parent/` route now resolves into a general advice-and-guidance hub, but none of those saved first-party surfaces preserves explicit Parent Training and Information Center designation text. The older PTI-style path family under `/parent/php/PIC/` now 404s, so PACER still remains support-only evidence until a live first-party PTI designation page is preserved.';
const PTI_EVIDENCE = 'Reviewed 2026-06-23 bounded current PACER first-party probes on https://www.pacer.org/, https://www.pacer.org/about/, https://www.pacer.org/parent/, https://www.pacer.org/advice-guidance/topic-iep-and-504/, https://www.pacer.org/parent/php/PIC/, and https://www.pacer.org/parent/php/PIC/fedfund.asp. The live PACER homepage and About page remain public and current, and the old `/parent/` route now resolves into the general advice-and-guidance page at https://www.pacer.org/advice-guidance/topic-iep-and-504/. However, the rechecked current pages still do not preserve explicit Parent Training and Information Center designation text, while the older `/parent/php/PIC/` and `/parent/php/PIC/fedfund.asp` PTI path family now returns HTTP 404. Minnesota therefore still lacks a saved live first-party PTI designation artifact even though statewide support evidence remains strong.';
const PTI_NEXT = 'hold_blocked_until_live_first_party_pti_designation_page_is_preserved';

const LESSON_HEADING = '### Retired PTI Microsites Should Be Rechecked Against Current First-Party Hubs Before They Stay Verified';
const LESSON_BODY = '*   **Lesson:** If an older PTI-specific path family disappears, recheck the organization’s current homepage and About hub before keeping PTI verified. Minnesota PACER still had strong statewide support pages, but the old `/parent/php/PIC/` PTI paths were 404 and the current public pages no longer preserved explicit PTI designation text.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
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
    '- Minnesota remains `BLOCKED` and `index_safe=false`.',
    '- Education is still blocked because the old MDE directory family now resolves only to moved-shell and dead-guess patterns, with no reviewed live county-mapped replacement contract on disk.',
    '- County-local is still blocked because the DHS county-and-tribal-office family now shows a mixed stale-legacy plus Radware-replatform pattern instead of a fetchable county-grade office directory in bounded low-token mode.',
    '- PACER support evidence is still real, but the current first-party pages plus the retired PTI-specific path family still do not preserve explicit PTI designation text.',
  ].join('\n') + '\n';
}

export function generateBatch170MinnesotaPtiLiveRecheckV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'parent_training_information_center'
      ? { ...row, family_status: 'blocked_current_first_party_support_without_explicit_pti_designation', status_reason: PTI_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'parent_training_information_center'
      ? { ...row, failure_code: PTI_FAILURE, evidence: PTI_EVIDENCE, next_action: PTI_NEXT }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'parent_training_information_center'
      ? {
          ...row,
          family_status: 'blocked_current_first_party_support_without_explicit_pti_designation',
          query_basis: 'Reviewed 2026-06-23 current PACER homepage, About page, redirected parent hub, and retired PTI path family.',
          blocker_code: PTI_FAILURE,
          blocker_evidence: PTI_EVIDENCE,
          sample_count: 2,
          samples: [
            {
              sample_name: 'PACER homepage',
              source_url: 'https://www.pacer.org/',
              final_url: 'https://www.pacer.org/',
              verification_status: 'blocked',
              source_type: 'first_party_support_homepage_without_pti_designation',
              source_table: 'bounded_live_minnesota_check',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live PACER homepage remains public and current, but the rechecked page does not preserve explicit Parent Training and Information Center designation text.',
            },
            {
              sample_name: 'Retired PACER PTI path family',
              source_url: 'https://www.pacer.org/parent/php/PIC/fedfund.asp',
              final_url: 'https://www.pacer.org/parent/php/PIC/fedfund.asp',
              verification_status: 'blocked',
              source_type: 'retired_first_party_pti_path_http_404',
              source_table: 'bounded_live_minnesota_check',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The older PACER PTI-specific path now returns HTTP 404, so the prior PTI microsite path family no longer preserves live first-party designation evidence.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'parent_training_information_center'
      ? { ...row, failure_code: PTI_FAILURE, next_action: PTI_NEXT, evidence: PTI_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'parent_training_information_center'
        ? { ...row, failure_code: PTI_FAILURE, evidence: PTI_EVIDENCE, next_action: PTI_NEXT }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const report = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  const batchSummary = {
    state: 'minnesota',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    pti_blocker_refreshed: true,
    lesson_added: lessonAdded,
    pti_failure_code: PTI_FAILURE,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 170 Minnesota PTI Live Recheck Report v1',
      '',
      'This pass does not broaden Minnesota discovery. It rechecks the current PACER first-party site against the older retired PTI path family so the PTI blocker is based on live current evidence instead of only older saved artifacts.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- refreshed_family: parent_training_information_center`,
      `- failure_code: ${PTI_FAILURE}`,
      '',
      '## Evidence',
      '',
      `- ${PTI_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch170MinnesotaPtiLiveRecheckV1();
  console.log(JSON.stringify(summary, null, 2));
}
