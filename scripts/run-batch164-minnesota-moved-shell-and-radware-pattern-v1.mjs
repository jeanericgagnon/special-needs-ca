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
  summary: path.join(generatedDir, 'batch164_minnesota_moved_shell_and_radware_pattern_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch164-minnesota-moved-shell-and-radware-pattern-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
};

const EDUCATION_FAILURE = 'official_school_directory_family_only_returns_moved_shell_or_dead_guesses';
const EDUCATION_REASON =
  'The Minnesota education blocker is now sharper: both reviewed legacy MDE school-directory roots under `/MDE/SchSup/` and `/MDE/SchSup/SchDir/` only 302 into the generic `SchSupHasMoved.html` shell, guessed replacement directory roots return 404, and one analytics-style path times out without yielding a county-mapped district contract. The current packet still falls back to statewide MDE special-education evidence instead of district- or county-grade routing leaves.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-23 bounded Minnesota MDE replacement probes. The legacy roots https://education.mn.gov/MDE/SchSup/SchDir/ and https://education.mn.gov/MDE/SchSup/ both 302 into the generic https://education.mn.gov/SchSupHasMoved.html shell instead of a live district directory. Additional bounded replacement guesses such as https://education.mn.gov/MDE/about/MDEpages/Directories/ and https://education.mn.gov/MDE/about/adv/dirs/ return HTTP 404, while https://education.mn.gov/MDE/SchSup/Analytics/ timed out in bounded fetches and still did not yield a reviewed county-mapped district contract. Minnesota therefore still lacks a live official district-directory replacement or county-to-district routing table, and the current packet still falls back to statewide special-education evidence rather than local routing leaves.';
const EDUCATION_NEXT = 'hold_blocked_until_live_official_mde_directory_replacement_or_county_mapped_contract_is_reviewed';

const COUNTY_FAILURE = 'minnesota_dhs_local_office_family_is_stale_jsp_plus_radware_replatform';
const COUNTY_REASON =
  'The Minnesota county-local blocker is now sharper: the old `.jsp` county-and-tribal-offices path is simply stale 404, but the slash-style replacement and multiple adjacent DHS county/tribal provider routes all 302 into the same Radware validation host. That means the official family exists as a replatformed lane, but every bounded low-token entrypoint still resolves to either dead legacy markup or bot-challenged replacement pages instead of county-grade office content.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-23 bounded Minnesota DHS path variants for county and tribal office routing. The legacy https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices.jsp path now returns HTTP 404. But the slash replacement https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/ and adjacent variants such as county-and-tribal-agencies.jsp, tribal-nations.jsp, partners-and-providers/county-tribal-nation-links/, partners-and-providers/county-tribal-nation-directory/, and partners-and-providers/continuing-care/county-tribal-contacts/ all 302 into the same validate.perfdrive.com / Radware bot-manager challenge. Minnesota therefore still lacks a reviewed county-grade local office contract in bounded low-token mode, but the blocker is now correctly classified as a mixed stale-legacy plus bot-challenged replatform pattern rather than one bad URL.';
const COUNTY_NEXT = 'browser_assisted_or_cached_capture_only_for_replatformed_mn_dhs_county_tribal_family';

const LESSON_HEADING = '### Mixed 404-Legacy And Bot-Challenged Replatforms Should Become One Family-Level Blocker Pattern';
const LESSON_BODY = '*   **Lesson:** If a legacy official `.jsp` path dies with 404 but multiple same-family replacement routes all redirect into the same bot-manager host, treat it as one replatformed blocker family. Minnesota DHS county/tribal routing was faster to classify once the stale legacy path and the challenged replacement paths were grouped instead of retried separately.';

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
    '- Minnesota remains `BLOCKED` and `index_safe=false`.',
    '- Education is still blocked because the old MDE directory family now resolves only to moved-shell and dead-guess patterns, with no reviewed live county-mapped replacement contract on disk.',
    '- County-local is still blocked because the DHS county-and-tribal-office family now shows a mixed stale-legacy plus Radware-replatform pattern instead of a fetchable county-grade office directory in bounded low-token mode.',
    '- PACER still remains support-only evidence for PTI because the saved reviewed artifact does not preserve explicit PTI designation text.',
  ].join('\n') + '\n';
}

export function generateBatch164MinnesotaMovedShellAndRadwarePatternV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'blocked_official_mde_directory_family_moved_without_live_replacement', status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'blocked_mn_dhs_replatform_family_stale_or_radware_challenged', status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_official_mde_directory_family_moved_without_live_replacement',
        query_basis: 'Reviewed 2026-06-23 bounded MDE moved-shell roots plus a small set of guessed replacement directory roots.',
        blocker_code: EDUCATION_FAILURE,
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_mn_dhs_replatform_family_stale_or_radware_challenged',
        query_basis: 'Reviewed 2026-06-23 bounded DHS county/tribal office family variants across legacy and replacement paths.',
        blocker_code: COUNTY_FAILURE,
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE, next_action: EDUCATION_NEXT, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE, next_action: COUNTY_NEXT, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'official_mde_directory_family_now_only_resolves_to_moved_shell_or_dead_guesses_and_mn_dhs_local_office_family_is_stale_or_radware_challenged',
    final_blockers: summary.final_blockers.map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return { ...row, failure_code: EDUCATION_FAILURE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, failure_code: COUNTY_FAILURE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT };
      }
      return row;
    }),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  const batchSummary = {
    state: 'minnesota',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    education_blocker_sharpened: true,
    county_blocker_sharpened: true,
    lesson_added: lessonAdded,
    education_failure_code: EDUCATION_FAILURE,
    county_failure_code: COUNTY_FAILURE,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, `${report}\n`);

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch164MinnesotaMovedShellAndRadwarePatternV1();
  console.log(JSON.stringify(summary, null, 2));
}
