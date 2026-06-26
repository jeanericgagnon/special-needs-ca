import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-hampshire_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-hampshire_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-hampshire_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-hampshire_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-hampshire_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'new-hampshire-california-grade-audit-report-v2.md'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateCertification: path.join(generatedDir, 'state-certification', 'new-hampshire.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch402_new_hampshire_terminal_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch402-new-hampshire-terminal-refresh-report-v1.md'),
};

const BATCH = 'batch402_new_hampshire_terminal_refresh_v1';
const REVIEWED_DATE = '2026-06-26';
const REVIEWED_AT = '2026-06-26T00:00:00.000Z';
const PRIMARY_GAP_REASON =
  'bounded_2026_06_26_live_recheck_confirms_nh_dhhs_doe_and_nhes_host_families_still_return_access_denied_while_robots_txt_remains_public_only';
const DHHS_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live New Hampshire DHHS host-family pass. \`https://www.dhhs.nh.gov/\`, \`https://dhhs.nh.gov/\`, and \`https://www.nh.gov/dhhs/\` all still return the same public HTTP 403 \`Access Denied\` shell rather than any reviewable public DHHS content. The public robots lanes remain readable only: \`https://www.nh.gov/robots.txt\` and \`https://www.dhhs.nh.gov/robots.txt\` still return HTTP 200 text files, but they do not restore any local-routing, Medicaid, DD, EI, or county-local contract. New Hampshire therefore still lacks a reviewable public DHHS lane for the blocked health, DD, EI, waiver, and county-local families.`;
const EDUCATION_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live New Hampshire education host-family pass. \`https://education.nh.gov/\`, \`https://www.education.nh.gov/\`, \`https://www.nh.gov/education/\`, and \`https://my.doe.nh.gov/ehb/\` all still return the same public HTTP 403 \`Access Denied\` shell rather than any reviewable statewide or local education-routing content. \`https://education.nh.gov/robots.txt\` still returns HTTP 200 text only and does not reopen a district-grade routing contract. New Hampshire therefore still lacks a reviewable public DOE lane for statewide special education authority or district/county education routing.`;
const VR_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live New Hampshire employment-security / VR host-family pass. \`https://nhes.nh.gov/\`, \`https://www.nhes.nh.gov/\`, and \`https://www.nh.gov/nhes/\` all still return the same public HTTP 403 \`Access Denied\` shell rather than any reviewable VR or Pre-ETS content. \`https://nhes.nh.gov/robots.txt\` still returns HTTP 200 text only and does not restore a public vocational-rehabilitation or Pre-ETS contract. New Hampshire therefore still lacks a reviewable public VR successor lane.`;

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

function reasonForFamily(family) {
  if (
    [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'county_local_disability_resources',
    ].includes(family)
  ) {
    return DHHS_REASON;
  }
  if (['special_education_idea_part_b', 'district_or_county_education_routing'].includes(family)) {
    return EDUCATION_REASON;
  }
  if (family === 'vocational_rehabilitation_pre_ets') {
    return VR_REASON;
  }
  return null;
}

function familyStatusForFamily(family) {
  if (
    [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'county_local_disability_resources',
    ].includes(family)
  ) {
    return 'blocked_live_dhhs_roots_still_403_while_robots_txt_only_confirms_host_existence';
  }
  if (['special_education_idea_part_b', 'district_or_county_education_routing'].includes(family)) {
    return 'blocked_live_education_roots_still_403_while_robots_txt_only_confirms_host_existence';
  }
  if (family === 'vocational_rehabilitation_pre_ets') {
    return 'blocked_live_nhes_roots_still_403_while_robots_txt_only_confirms_host_existence';
  }
  return null;
}

function updateAllStateReport(report) {
  const line =
    '- New Hampshire remains blocked after a 2026-06-26 bounded live host-family recheck: DHHS, DOE, and NHES roots plus their obvious `nh.gov` path successors still return the same public HTTP 403 `Access Denied` shells, while only `robots.txt` remains publicly readable and still does not restore any routing contract.';
  return report.replace(
    /- New Hampshire remains blocked after[^\n]*/,
    line,
  );
}

function updateHandoff(text) {
  return text.replace(
    /- New Hampshire: `[^`]+`/,
    '- New Hampshire: `bounded_2026_06_26_live_recheck_confirms_nh_dhhs_doe_and_nhes_host_families_still_return_access_denied_while_robots_txt_remains_public_only`',
  );
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Hampshire California-Grade Audit Report v2',
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
    '- New Hampshire remains BLOCKED and not index-safe.',
    '- The public official host families are still real enough to expose robots.txt, but the actual agency and successor roots still fail closed behind the same `Access Denied` shell.',
    '- No reviewable public DHHS, DOE, or NHES routing contract exists today for the blocked families.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 402 New Hampshire Terminal Refresh v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tied New Hampshire’s blocked terminal state to a fresh 2026-06-26 live host-family recheck',
    '',
    '## Evidence',
    '',
    `- ${DHHS_REASON}`,
    `- ${EDUCATION_REASON}`,
    `- ${VR_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch402NewHampshireTerminalRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');
  const stateCertification = readJson(INPUTS.stateCertification);

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 33,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => {
      const reason = reasonForFamily(row.family);
      return reason ? { ...row, evidence: reason } : row;
    }),
  };

  const updatedGapRows = gapRows.map((row) => {
    const reason = reasonForFamily(row.family);
    const familyStatus = familyStatusForFamily(row.family);
    return reason && familyStatus ? { ...row, family_status: familyStatus, status_reason: reason } : row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    const reason = reasonForFamily(row.family);
    return reason ? { ...row, evidence: reason } : row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    const reason = reasonForFamily(row.family);
    return reason ? { ...row, blocker_evidence: reason } : row;
  });

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeText(INPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, nextRows));

  const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-hampshire');
  if (auditRow) {
    auditRow.packetBatch = BATCH;
    auditRow.packetPrimaryGapReason = PRIMARY_GAP_REASON;
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
    dhhs_roots_403: true,
    education_roots_403: true,
    nhes_roots_403: true,
    robots_only_public: true,
    completeness_pct: 33,
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch402NewHampshireTerminalRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
