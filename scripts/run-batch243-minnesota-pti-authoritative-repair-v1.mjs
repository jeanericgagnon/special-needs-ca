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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch243_minnesota_pti_authoritative_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch243-minnesota-pti-authoritative-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
};

const PTI_STATUS_REASON = 'Reviewed 2026-06-23 the authoritative Parent Center Hub Minnesota state leaf at https://www.parentcenterhub.org/findurcenter/minnesota/. The live page explicitly preserves `Minnesota PTI`, names PACER Center, Inc., and preserves direct Minnesota contact details on an authoritative national PTI directory. That authoritative state-specific PTI designation is enough to verify the parent_training_information_center family even though PACER’s own current first-party pages no longer repeat the explicit PTI label and the older `/parent/php/PIC/` path family now returns HTTP 404.';

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
    '- Minnesota remains BLOCKED and index_safe=false.',
    '- parent_training_information_center now clears from the authoritative Parent Center Hub Minnesota leaf.',
    '- district_or_county_education_routing remains blocked because the MDE-ORG root and child routes still flap into Radware and no stable county-grade export contract is reproducible.',
    '- county_local_disability_resources remains blocked on the replatformed DHS county-and-tribal captcha family.',
  ].join('\n') + '\n';
}

export function generateBatch243MinnesotaPtiAuthoritativeRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedSummary = {
    ...summary,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    major_gap_families: [],
    final_blockers: (summary.final_blockers || []).filter((row) => row.family !== 'parent_training_information_center'),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'minnesota'
      ? { ...row, completeness_pct: 83, weak_critical_families: 2, priority_score: 86 }
      : row
  ));

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'parent_training_information_center'
      ? { ...row, family_status: 'verified_state_grade', status_reason: PTI_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'parent_training_information_center');

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'parent_training_information_center'
      ? {
          ...row,
          family_status: 'verified_state_grade',
          evidence_strength: 'strong',
          sample_count: 1,
          query_basis: 'Reviewed 2026-06-23 the authoritative Parent Center Hub Minnesota state leaf after PACER first-party pages no longer preserved explicit PTI designation text.',
          blocker_code: null,
          blocker_evidence: null,
          samples: [
            {
              sample_name: 'Parent Center Hub Minnesota PTI listing',
              source_url: 'https://www.parentcenterhub.org/findurcenter/minnesota/',
              final_url: 'https://www.parentcenterhub.org/findurcenter/minnesota/',
              verification_status: 'verified',
              source_type: 'authoritative_state_pti_directory',
              source_table: 'reviewed_authoritative_artifact',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'Minnesota PTI. PACER Center, Inc. 8161 Normandale Boulevard Bloomington, MN 55437-1044 (952) 838-9000 | (888) 248-0822 (National) http://www.pacer.org',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.filter((row) => row.family !== 'parent_training_information_center');

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    batch: 'batch_243_minnesota_pti_authoritative_repair_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'minnesota',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    parent_training_information_center: 'verified_state_grade',
    remaining_critical_blockers: [
      'district_or_county_education_routing',
      'county_local_disability_resources',
    ],
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const report = [
    '# Batch 243 Minnesota PTI Authoritative Repair Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- repaired_family: parent_training_information_center',
    '',
    '## Evidence',
    '',
    `- ${PTI_STATUS_REASON}`,
    '',
    '## Repair decision',
    '',
    '- Minnesota remains blocked because the two critical Radware families are unchanged.',
    '- The PTI family now clears from the authoritative Parent Center Hub Minnesota leaf, which explicitly labels `Minnesota PTI` and names PACER Center with direct contact details.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch243MinnesotaPtiAuthoritativeRepairV1();
  console.log(JSON.stringify(result, null, 2));
}
