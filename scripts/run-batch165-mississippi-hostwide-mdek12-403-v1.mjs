import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'mississippi_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'mississippi_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'mississippi_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'mississippi_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'mississippi_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch165_mississippi_hostwide_mdek12_403_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch165-mississippi-hostwide-mdek12-403-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'mississippi-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'mdek12_public_host_returns_uniform_azure_app_gateway_403';
const STATUS_REASON =
  'The Mississippi education blocker is now sharper: this is not one stale directory URL. The MDEK12 root and every bounded local directory guess tested under the same host return the same short Azure Application Gateway 403 shell in low-token mode, so Mississippi still lacks any reviewed district-directory or district-owned routing contract on the public official host.';
const EVIDENCE =
  'Reviewed 2026-06-23 bounded Mississippi MDEK12 path probes. The public root https://www.mdek12.org/ itself returns the same short HTTP 403 shell as all bounded local-routing guesses, including /OTS/Directory, /School-Directory, /directory, /SchoolDirectory, /districts, /OSE, /Offices/OSE, /MBE/School-and-District-Directory, and /MBE/District-Directory. Every reviewed response preserves the same Microsoft-Azure-Application-Gateway/v2 403 shell rather than district rows, school-search content, or district-owned leaves. Mississippi therefore remains blocked on district_or_county_education_routing because the official MDEK12 public host is host-wide blocked in the current low-token lane, not because one specific directory child path is stale.';
const NEXT_ACTION =
  'browser_or_alternate_client_probe_only_if_mdek12_hostwide_403_can_be_bypassed_without_lowering_standards';

const LESSON_HEADING = '### Uniform Short 403 Shells Across Root And Child Paths Mean Host-Wide Block, Not Child-Path Churn';
const LESSON_BODY = '*   **Lesson:** If the official root and every bounded child-path guess return the same short branded 403 shell, stop treating it as a directory-discovery problem. Mississippi MDEK12 was faster to classify once the root and directory guesses all matched the same Azure Application Gateway 403 response.';

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
    '# Mississippi California-Grade Audit Report v2',
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
    '- Protection and advocacy, PTI, legal aid, VR, and county-local routing remain verified from the existing reviewed first-party evidence chain.',
    '- Mississippi remains `BLOCKED` and `index_safe=false` because district or county education routing still has no county- or district-grade official contract on disk, and the official MDEK12 public host now shows a uniform host-wide 403 pattern in the bounded low-token lane.',
  ].join('\n') + '\n';
}

export function generateBatch165MississippiHostwideMdek12403V1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_mdek12_public_host_uniform_403', status_reason: STATUS_REASON }
      : row
  );

  const updatedFailureRows = failureRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  );

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_mdek12_public_host_uniform_403',
          query_basis: 'Reviewed 2026-06-23 the MDEK12 root plus a bounded set of likely district-directory and OSE child paths.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
        }
      : row
  );

  const updatedNextRows = nextRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  );

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'mdek12_public_root_and_bounded_directory_guesses_return_uniform_azure_app_gateway_403',
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: FAILURE_CODE,
        evidence: EVIDENCE,
        next_action: NEXT_ACTION,
      },
    ],
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
    state: 'mississippi',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    education_blocker_sharpened: true,
    lesson_added: lessonAdded,
    failure_code: FAILURE_CODE,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, `${report}\n`);

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch165MississippiHostwideMdek12403V1();
  console.log(JSON.stringify(summary, null, 2));
}
