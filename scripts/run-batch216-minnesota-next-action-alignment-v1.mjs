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
  failures: path.join(generatedDir, 'minnesota_failure_ledger_v2.jsonl'),
  gap: path.join(generatedDir, 'minnesota_gap_matrix_v2.jsonl'),
  verified: path.join(generatedDir, 'minnesota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'minnesota_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch216_minnesota_next_action_alignment_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch216-minnesota-next-action-alignment-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
};

const EDUCATION_NEXT_ACTION = 'browser_assisted_or_cached_capture_only_for_live_mdeorg_directory_contract';

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
    '- Education is still blocked, but the blocker is now more precise: the official MDE-ORG directory root is live, while the actual query/export contract remains embedded or challenge-protected instead of preserved as a county-grade artifact.',
    '- County-local is still blocked because the DHS county-and-tribal-office family still resolves to stale legacy URLs or Radware challenge surfaces in bounded low-token mode.',
    '- PACER support evidence is still real, but the current first-party pages plus the retired PTI-specific path family still do not preserve explicit PTI designation text.',
  ].join('\n') + '\n';
}

export function generateBatch216MinnesotaNextActionAlignmentV1() {
  const summary = readJson(INPUTS.summary);
  const failureRows = readJsonl(INPUTS.failures);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedSummary = {
    ...summary,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, next_action: EDUCATION_NEXT_ACTION }
        : row
    )),
  };

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, next_action: EDUCATION_NEXT_ACTION }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, gapRows, updatedFailureRows, verifiedRows, nextRows));

  const batchSummary = {
    batch: 'batch_216_minnesota_next_action_alignment_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'minnesota',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    aligned_next_action: EDUCATION_NEXT_ACTION,
  };
  writeJson(OUTPUTS.summary, batchSummary);

  const batchReport = [
    '# Batch 216 Minnesota Next Action Alignment Report v1',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    '- refined_scope: education next_action alignment',
    '',
    '## Consistency repair',
    '',
    '- Aligned the Minnesota education next_action in the summary and failure ledger with the already-current next-action queue and state report wording.',
    '- No new source evidence was fetched and no blocker standard changed.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch216MinnesotaNextActionAlignmentV1();
  console.log(JSON.stringify(result, null, 2));
}
