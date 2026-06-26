import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'south-dakota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'south-dakota_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'south-dakota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'south-dakota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'south-dakota_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  report: path.join(docsGeneratedDir, 'south-dakota-california-grade-audit-report-v2.md'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateCertification: path.join(generatedDir, 'state-certification', 'south-dakota.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch407_south-dakota_terminal_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch407-south-dakota-terminal-refresh-report-v1.md'),
};

const BATCH = 'batch407_south-dakota_terminal_refresh_v1';
const REVIEWED_DATE = '2026-06-26';
const REVIEWED_AT = '2026-06-26T00:00:00.000Z';
const PRIMARY_GAP_REASON =
  'bounded_2026_06_26_live_recheck_confirms_current_dhs_localoffices_path_now_returns_200_but_still_only_a_page_not_found_shell_without_county_or_local_office_contract';
const COUNTY_STATUS =
  'blocked_localoffices_path_now_200_but_still_page_not_found_shell_and_other_current_dhs_surfaces_statewide_only';
const FAILURE_CODE =
  'current_dhs_localoffices_path_now_returns_200_shell_but_still_no_public_county_or_local_office_contract';
const NEXT_ACTION =
  'hold_blocked_until_current_dhs_host_exposes_public_county_to_office_or_local_service_contract';
const COUNTY_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live South Dakota DHS county-local pass. The current host family is live, but it still does not expose a county-grade routing contract. \`https://dhs.sd.gov/en/localoffices\` now returns HTTP 200 instead of the earlier failing route, but the rendered page still carries a page-not-found shell rather than a public local-office directory or county-to-office table. \`https://dhs.sd.gov/en/contact-us\`, \`https://dhs.sd.gov/en/contactus\`, \`https://dhs.sd.gov/en/staff-directory\`, and the DHS root all also return HTTP 200 on the current host family. But the current public surfaces still stop at statewide contact or staff-directory routing rather than any county-keyed local-office contract. The staff directory still includes statewide rows such as Disability Determination Services and Division of Rehabilitation Services, while the localoffices and legacy contactus paths still do not expose county or local-office assignment fields. South Dakota therefore still lacks any reviewable public county-to-office or local service-area contract on the current DHS host.`;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function updateAllStateReport(report) {
  const line =
    '- South Dakota remains blocked after a 2026-06-26 bounded live recheck: the current `/en/localoffices` path now returns HTTP 200 but still renders a page-not-found shell, while `/en/contact-us`, `/en/contactus`, `/en/staff-directory`, and the current DHS root still expose only statewide or staff-directory routing without any county-to-office or local service-area contract.';
  if (/- South Dakota remains blocked after[^\n]*/.test(report)) {
    return report.replace(/- South Dakota remains blocked after[^\n]*/, line);
  }
  return `${report.trimEnd()}\n${line}\n`;
}

function updateHandoff(text) {
  return text
    .replace(/Current Focus State: [^\n]+/, 'Current Focus State: South Dakota')
    .replace(
      /- South Dakota: `[^`]+`/,
      '- South Dakota: `bounded_2026_06_26_live_recheck_confirms_current_dhs_localoffices_path_now_returns_200_but_still_only_a_page_not_found_shell_without_county_or_local_office_contract`',
    );
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# South Dakota California-Grade Audit Report v2',
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
    '- South Dakota remains BLOCKED and not index-safe.',
    '- County-local routing is still blocked because the current localoffices path is still not a real local-office contract and the remaining DHS surfaces are still statewide-only or staff-directory-only.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 407 South Dakota Terminal Refresh v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tied South Dakota’s blocked terminal state to a fresh 2026-06-26 live recheck showing `/en/localoffices` now returns 200 but still renders a page-not-found shell',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch407SouthDakotaTerminalRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');
  const stateCertification = readJson(INPUTS.stateCertification);

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    primary_gap_reason: PRIMARY_GAP_REASON,
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: COUNTY_STATUS,
    },
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: FAILURE_CODE,
        evidence: COUNTY_REASON,
        next_action: NEXT_ACTION,
      },
    ],
  };

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON }
      : row,
  );

  const updatedFailureRows = [
    {
      state: 'south-dakota',
      state_code: 'SD',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: FAILURE_CODE,
      evidence: COUNTY_REASON,
      next_action: NEXT_ACTION,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_STATUS, blocker_code: FAILURE_CODE, blocker_evidence: COUNTY_REASON }
      : row,
  );

  const updatedNextRows = [
    {
      state: 'south-dakota',
      state_code: 'SD',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: FAILURE_CODE,
      next_action: NEXT_ACTION,
      evidence: COUNTY_REASON,
    },
  ];

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'south-dakota'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
          completeness_pct: 91,
          weak_critical_families: 1,
          recommended_batch: 'batch_3_procedure_hardening',
        }
      : row,
  );

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeText(INPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const auditRow = allStateAudit.states.find((row) => row.stateId === 'south-dakota');
  if (auditRow) {
    auditRow.packetBatch = BATCH;
    auditRow.packetPrimaryGapReason = PRIMARY_GAP_REASON;
    auditRow.familyStatuses = {
      ...auditRow.familyStatuses,
      county_local_disability_resources: COUNTY_STATUS,
    };
  }
  writeJson(INPUTS.audit, allStateAudit);
  writeText(INPUTS.allStateReport, updateAllStateReport(allStateReport));
  writeText(INPUTS.handoff, updateHandoff(handoff));

  const updatedStateCertification = {
    ...stateCertification,
    checkedAt: REVIEWED_AT,
    summary: updatedSummary,
    gapRows: updatedGapRows,
    failures: updatedFailureRows,
  };
  writeJson(INPUTS.stateCertification, updatedStateCertification);

  writeJson(OUTPUTS.summary, {
    batch: BATCH,
    generated_at: new Date().toISOString(),
    classification: 'BLOCKED',
    localoffices_200_shell: true,
    contact_us_200: true,
    contactus_old_200: true,
    staff_directory_200: true,
    dhs_root_200: true,
    completeness_pct: 91,
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch407SouthDakotaTerminalRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
