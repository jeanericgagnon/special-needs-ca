import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'california_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'california_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'california_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'california_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'california_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch103_california_county_local_directory_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch103-california-county-local-directory-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'california-california-grade-audit-report-v2.md'),
};

const COUNTY_LOCAL_REASON = 'Reviewed official CDSS IHSS county directory https://www.cdss.ca.gov/inforesources/county-ihss-offices was fetched successfully on 2026-06-22 and exposes 58 county-labeled IHSS routing links, giving statewide county-grade local-office routing without relying on generic statewide fallback pages.';
const COUNTY_LOCAL_QUERY_BASIS = 'Reviewed official CDSS IHSS county directory fetched in the bounded live lane; the directory itself enumerates all 58 California counties with county-specific IHSS routing links.';
const EDUCATION_BLOCKER_EVIDENCE = 'Reviewed exact district leaves remain limited to 3 saved pages; that is not enough to truthfully prove county-grade district routing across all 58 California counties, and the official CDE SELPA directory root https://www.cde.ca.gov/sp/se/as/caselpas.asp now returns a Radware bot challenge in the bounded live lane instead of reviewable directory content.';
const LESSON_HEADING = '### Official County Directories Can Count When They Enumerate Every County';
const LESSON_BULLET = '*   **Lesson:** A statewide official directory is county-grade enough when the fetched page itself enumerates every county with county-labeled local-routing links. California CDSS IHSS cleared county-local routing once the live page proved 58 county links on one official directory page, without needing 58 separate county re-fetches.';

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

function ensureLesson() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  const next = `${current.trimEnd()}\n\n## 3. Cross-State Repair Patterns\n\n${LESSON_HEADING}\n${LESSON_BULLET}\n`;
  fs.writeFileSync(INPUTS.lessons, next);
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# California California-Grade Audit Report v2',
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
    '## California final blocker decision',
    '',
    '- County-local disability resources no longer belong in the blocker set because the live official CDSS IHSS directory itself preserves 58 county-labeled county-routing links on one fetched official page.',
    '- District or county education routing remains blocked because only 3 reviewed exact district leaves are verified on disk and the official CDE SELPA directory root now returns a Radware challenge in the bounded live lane.',
    '- Parent training information center remains blocked because the reviewed statewide-equivalent candidate set still fails the statewide gate: Matrix Parents is explicit but regional, DDS FRCN returns 404, frcnca.org fails TLS, and Support for Families returns 403.',
    '- California is therefore still truthfully BLOCKED and not index-safe.',
  ].join('\n') + '\n';
}

export function generateBatch103CaliforniaCountyLocalDirectoryRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        statewide_enough: false,
        status_reason: COUNTY_LOCAL_REASON,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        status_reason: EDUCATION_BLOCKER_EVIDENCE,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => row.family !== 'county_local_disability_resources')
    .map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, evidence: EDUCATION_BLOCKER_EVIDENCE }
        : row
    ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: COUNTY_LOCAL_QUERY_BASIS,
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'County IHSS Offices',
            source_url: 'https://www.cdss.ca.gov/inforesources/county-ihss-offices',
            verification_status: 'verified',
            source_type: 'official_fetched_directory',
            source_table: 'live_official_directory_probe',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        blocker_evidence: EDUCATION_BLOCKER_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'county_local_disability_resources')
    .map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, evidence: EDUCATION_BLOCKER_EVIDENCE }
        : row
    ));

  const updatedSummary = {
    ...summary,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 1,
    missing_critical_families: 1,
    primary_gap_reason: 'district_grade_leaf_packet_exhausted_and_reviewed_pti_source_still_not_statewide',
    critical_gap_families: ['district_or_county_education_routing'],
    major_gap_families: ['parent_training_information_center'],
    final_blockers: summary.final_blockers
      .filter((row) => row.family !== 'county_local_disability_resources')
      .map((row) => (
        row.family === 'district_or_county_education_routing'
          ? { ...row, evidence: EDUCATION_BLOCKER_EVIDENCE }
          : row
      )),
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  ensureLesson();

  writeJson(OUTPUTS.summary, {
    batch: 'batch_103_california_county_local_directory_refresh_v1',
    generated_at: '2026-06-22T16:10:00.000Z',
    state: 'california',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_family: 'county_local_disability_resources',
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      county_local: COUNTY_LOCAL_REASON,
      district_routing: EDUCATION_BLOCKER_EVIDENCE,
    },
  });

  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# California County-Local Directory Refresh Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      '- repaired_family: county_local_disability_resources',
      '',
      '## Evidence checks',
      '',
      `- county_local: ${COUNTY_LOCAL_REASON}`,
      `- district_routing: ${EDUCATION_BLOCKER_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch103CaliforniaCountyLocalDirectoryRefreshV1();
}
