import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  evidence: path.join(generatedDir, 'west_virginia_independent_reaudit_evidence_v1.json'),
  summary: path.join(generatedDir, 'west-virginia_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'west-virginia_gap_matrix_v2.jsonl'),
  verified: path.join(generatedDir, 'west-virginia_verified_sources_v1.jsonl'),
  failure: path.join(generatedDir, 'west-virginia_failure_ledger_v2.jsonl'),
  next: path.join(generatedDir, 'west-virginia_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch375_west_virginia_independent_reaudit_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch375-west-virginia-independent-reaudit-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'west-virginia-california-grade-audit-report-v2.md'),
};

const PTI_FAMILY = 'parent_training_information_center';
const PTI_FAILURE = 'legacy_wvpti_domain_redirects_unrelated_and_no_current_first_party_pti_designation_preserved';
const PTI_NEXT = 'hold_blocked_until_current_first_party_west_virginia_pti_designation_page_is_preserved';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').trim();
  if (!text) return [];
  return text.split('\n').map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.length ? `${rows.map((row) => JSON.stringify(row)).join('\n')}\n` : '');
}

function buildReport(summary, gapRows, verifiedRows, failureRows, nextRows, evidenceRows) {
  const browserReviewed = evidenceRows.filter((row) => row.review_mode === 'browser_reviewed');
  return [
    '# West Virginia California-Grade Independent Re-Audit Report v1',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- strong_critical_families: ${summary.strong_critical_families}`,
    `- weak_critical_families: ${summary.weak_critical_families}`,
    `- missing_critical_families: ${summary.missing_critical_families}`,
    `- reviewed_at: ${evidenceRows[0]?.reviewed_at ?? '2026-06-25'}`,
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Failure ledger',
    '',
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Completion decision',
    '',
    '- West Virginia no longer qualifies as `COMPLETE` or `index_safe=true` after an independent re-audit of the current live sources.',
    '- The state packet now uses current official BMS, BBH, Birth to Three, WVDE, WV School Directory, WVDRS, DoHS, Legal Aid WV, and WVABLE evidence instead of the inherited fake `dhhs.west-virginia.gov` placeholders and generic hub rows.',
    '- District routing and county-local routing both remain cleared because the public county school directory and county-filtered DoHS office pages still preserve explicit county-to-local routing on live official hosts.',
    '- The single remaining critical blocker is `parent_training_information_center`: the old `wvpti.org` first-party domain now returns HTTP 301 to an unrelated body-shop site, and this bounded official-source pass did not preserve any current first-party West Virginia PTI designation page.',
    '- West Virginia therefore must be frozen back to `BLOCKED` until a live first-party PTI successor or designation artifact is preserved.',
    '',
    '## Browser-reviewed exceptions',
    '',
    ...browserReviewed.map((row) => `- ${row.family}: ${row.samples[0].source_url} :: ${row.samples[0].evidence_snippet}`),
  ].join('\n') + '\n';
}

export function generateBatch375WestVirginiaIndependentReauditV1() {
  const evidence = readJson(INPUTS.evidence);
  const evidenceRows = evidence.families.map((row) => ({ ...row, reviewed_at: evidence.reviewed_at }));
  const evidenceMap = new Map(evidenceRows.map((row) => [row.family, row]));
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedGapRows = gapRows.map((row) => {
    const evidenceRow = evidenceMap.get(row.family);
    if (!evidenceRow) return row;
    if (row.family === PTI_FAMILY) {
      return {
        ...row,
        family_status: 'blocked_first_party_pti_domain_redirects_unrelated',
        status_reason: evidenceRow.status_reason,
      };
    }
    return {
      ...row,
      family_status: 'verified_state_grade',
      status_reason: evidenceRow.status_reason,
    };
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    const evidenceRow = evidenceMap.get(row.family);
    if (!evidenceRow) return row;
    const blocked = row.family === PTI_FAMILY;
    return {
      ...row,
      family_status: blocked ? 'blocked_first_party_pti_domain_redirects_unrelated' : 'verified_state_grade',
      evidence_strength: blocked ? 'weak' : 'strong',
      sample_count: evidenceRow.samples.length,
      query_basis: evidenceRow.query_basis,
      blocker_code: blocked ? PTI_FAILURE : null,
      blocker_evidence: blocked ? evidenceRow.status_reason : null,
      samples: evidenceRow.samples,
    };
  });

  const updatedFailureRows = [
    {
      state: 'west-virginia',
      state_code: 'WV',
      family: PTI_FAMILY,
      severity: 'critical',
      failure_code: PTI_FAILURE,
      evidence: evidenceMap.get(PTI_FAMILY).status_reason,
      next_action: PTI_NEXT,
    },
  ];

  const updatedNextRows = [
    {
      state: 'west-virginia',
      state_code: 'WV',
      state_name: 'West Virginia',
      family: PTI_FAMILY,
      severity: 'critical',
      failure_code: PTI_FAILURE,
      next_action: PTI_NEXT,
      evidence: evidenceMap.get(PTI_FAMILY).status_reason,
    },
  ];

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: true,
    completeness_pct: 92,
    strong_critical_families: 11,
    weak_critical_families: 0,
    missing_critical_families: 1,
    primary_gap_reason: 'legacy_pti_domain_redirects_unrelated_and_no_current_first_party_successor_preserved',
    critical_gap_families: [PTI_FAMILY],
    major_gap_families: [],
    verified_source_families_with_samples: evidenceRows.map((row) => row.family),
    complete_ready: false,
    final_blockers: [
      {
        family: PTI_FAMILY,
        failure_code: PTI_FAILURE,
        evidence: evidenceMap.get(PTI_FAMILY).status_reason,
        next_action: PTI_NEXT,
      },
    ],
  };

  const batchSummary = {
    batch: 'batch375_west_virginia_independent_reaudit_v1',
    state: 'west-virginia',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    independently_reaudited_families: evidenceRows.map((row) => row.family),
    repaired_families: evidenceRows.filter((row) => row.family !== PTI_FAMILY).map((row) => row.family),
    blocker_family: PTI_FAMILY,
    blocker_code: PTI_FAILURE,
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedVerifiedRows, updatedFailureRows, updatedNextRows, evidenceRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return { summary: updatedSummary, batchSummary };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch375WestVirginiaIndependentReauditV1();
  console.log(JSON.stringify(result, null, 2));
}
