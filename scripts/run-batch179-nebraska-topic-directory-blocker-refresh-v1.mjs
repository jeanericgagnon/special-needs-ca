import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'nebraska_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'nebraska_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'nebraska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nebraska_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'nebraska_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch179_nebraska_topic_directory_blocker_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch179-nebraska-topic-directory-blocker-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
};

const STATUS_REASON =
  'Reviewed 2026-06-23 bounded browser-style probes on the live official NDE host. The Special Education page and Contact Us / SPED Staff Directory page are publicly reachable again and now preserve one additional exact official leaf: `SPED Contact List-Directory by Topic` on the NDE domain. But that directory is still statewide by staff topic rather than county-to-ESU or county-to-district routing, and the only clearly local-looking outbound program page remains the single ESU 9 Deaf or Hard of Hearing page. No reviewed district-owned, ESU-wide, or county-mapped education-routing surface is preserved on disk yet.';

const BLOCKER_EVIDENCE =
  'Reviewed 2026-06-23 bounded browser-style probes on the live official NDE Special Education and SPED staff-directory pages. The host is publicly reachable and now exposes one more exact official leaf at https://www.education.ne.gov/wp-content/uploads/2025/11/SPED-Calling-Tree-January-2026.pdf titled `SPED Contact List-Directory by Topic`, plus the previously reviewed ESU 9 Deaf or Hard of Hearing program page. However, the topic directory is statewide by staff function and does not publish county-to-ESU assignments, district-owned special-education routing, or an ESU service-area contract. The ESU 9 page is still only one regional program page, not a statewide local-routing contract. Nebraska therefore remains blocked because the live NDE SPED lane still lacks reviewed county-mapped education routing despite the now-live official leaves.';

const LESSON_HEADING =
  '### Topic-Based SPED Staff Directories Still Need A Local Service-Area Contract';
const LESSON_BODY =
  '*   **Lesson:** If a live special-education staff page exposes a topic-based directory PDF, do not confuse that with county-grade routing. Nebraska’s official `SPED Contact List-Directory by Topic` proved the host was live and deeper than a homepage, but it still lacked county-to-ESU assignments or district-owned local routing evidence.';

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
    '# Nebraska California-Grade Truth Refresh v2',
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
    '- Nebraska remains `BLOCKED` and `index_safe=false`.',
    '- Education remains blocked because the live NDE SPED host now preserves deeper official leaves, including a topic directory PDF, but still no reviewed county-to-ESU or district-owned routing contract.',
    '- County/local disability resources remain blocked because the open official DHHS office app config still proves the public office layer only names 37 counties and the county boundary layer has no office assignment fields for the remaining 56 counties.',
  ].join('\n') + '\n';
}

export function generateBatch179NebraskaTopicDirectoryBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, status_reason: STATUS_REASON }
      : row
  );

  const updatedFailureRows = failureRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, evidence: BLOCKER_EVIDENCE }
      : row
  );

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          query_basis: 'Reviewed 2026-06-23 the live NDE Special Education page, SPED staff-directory page, topic-directory PDF, and the single ESU 9 local program leaf.',
          blocker_evidence: BLOCKER_EVIDENCE,
        }
      : row
  );

  const updatedNextRows = nextRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, evidence: BLOCKER_EVIDENCE }
      : row
  );

  const updatedSummary = {
    ...summary,
    final_blockers: (summary.final_blockers || []).map((row) =>
      row.family === 'district_or_county_education_routing'
        ? { ...row, evidence: BLOCKER_EVIDENCE }
        : row
    ),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const report = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  const batchSummary = {
    state: 'nebraska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    education_blocker_sharpened: true,
    lessons_updated: lessonsUpdated,
    blocker_basis: 'live_sped_topic_directory_plus_single_esu_leaf_audit',
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${report}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch179NebraskaTopicDirectoryBlockerRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
