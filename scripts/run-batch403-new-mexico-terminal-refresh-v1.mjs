import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-mexico_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-mexico_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-mexico_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-mexico_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-mexico_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  report: path.join(docsGeneratedDir, 'new-mexico-california-grade-audit-report-v2.md'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateCertification: path.join(generatedDir, 'state-certification', 'new-mexico.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch403_new_mexico_terminal_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch403-new-mexico-terminal-refresh-report-v1.md'),
};

const BATCH = 'batch403_new_mexico_terminal_refresh_v1';
const REVIEWED_DATE = '2026-06-26';
const REVIEWED_AT = '2026-06-26T00:00:00.000Z';
const PRIMARY_GAP_REASON =
  'bounded_2026_06_26_live_recheck_confirms_public_ped_sharepoint_stack_still_lacks_county_or_rec_service_area_contract_and_official_vr_lanes_still_fail_closed';
const DISTRICT_STATUS =
  'blocked_live_ped_sharepoint_stack_public_and_reviewable_but_still_missing_county_crosswalk_or_rec_service_area_contract';
const DISTRICT_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live New Mexico PED pass on the exact public WebED stack. \`Home.aspx\`, the live \`2017 NM Schools\` list, and \`RECHome.aspx\` still return HTTP 200 on the PED-managed SharePoint host, and the same six public workbook exports still return HTTP 200: \`NM Schools.xlsx\`, \`Superintendents.xlsx\`, \`REC Directors.xlsx\`, \`Elementary School Principals.xlsx\`, \`Middle School Principals.xlsx\`, and \`High School Principals.xlsx\`. The official PED directory lane is therefore real and reviewable, not missing. But it still does not close county-grade local routing. The public SharePoint list and workbook stack still stop at district, location, address, city, zip, school, REC, and contact-style fields, and the reviewed public REC grouping page still does not publish county labels or REC service-area text. New Mexico therefore still lacks any reviewable public county-to-district or county-to-REC contract on the official PED stack.`;
const VR_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live New Mexico VR pass on the exact official DVR and DWS successor lanes. \`https://www.dvr.nm.gov/\` and \`https://www.dvr.nm.gov/services\` still return HTTP 401 rather than reviewable public VR or Pre-ETS content. The likely official successor family still fails closed too: \`https://www.dws.state.nm.us/\`, \`/en-us/Job-Seekers/Vocational-Rehabilitation\`, and \`/en-us/Individuals-with-Disabilities\` still return the same public \`Request Rejected\` shell instead of reviewable vocational-rehabilitation content. New Mexico therefore still lacks any reviewable public official VR or Pre-ETS lane.`;

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
  if (family === 'district_or_county_education_routing') return DISTRICT_REASON;
  if (family === 'vocational_rehabilitation_pre_ets') return VR_REASON;
  return null;
}

function statusForFamily(family) {
  if (family === 'district_or_county_education_routing') return DISTRICT_STATUS;
  if (family === 'vocational_rehabilitation_pre_ets') return 'blocked_live_dvr_401_and_dws_request_rejected_with_no_public_successor';
  return null;
}

function updateAllStateReport(report) {
  const line =
    '- New Mexico remains blocked after a 2026-06-26 bounded live recheck: the PED-managed WebED SharePoint home, school list, REC page, and all six public workbook exports are still live and reviewable but still expose no county or REC service-area contract, while DVR still returns HTTP 401 and the DWS successor lanes still return `Request Rejected`.';
  if (/- New Mexico remains blocked after[^\n]*/.test(report)) {
    return report.replace(/- New Mexico remains blocked after[^\n]*/, line);
  }
  return `${report.trimEnd()}\n${line}\n`;
}

function updateHandoff(text) {
  return text
    .replace(/Current Focus State: [^\n]+/, 'Current Focus State: New Mexico')
    .replace(
      /- New Mexico: `[^`]+`/,
      '- New Mexico: `bounded_2026_06_26_live_recheck_confirms_public_ped_sharepoint_stack_still_lacks_county_or_rec_service_area_contract_and_official_vr_lanes_still_fail_closed`',
    );
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Mexico California-Grade Audit Report v2',
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
    '- New Mexico remains BLOCKED and not index-safe.',
    '- Education is still blocked because the public PED directory stack is real but still not county-grade.',
    '- VR is still blocked because the official DVR and likely DWS successor lanes are still non-reviewable.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 403 New Mexico Terminal Refresh v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tied New Mexico’s blocked terminal state to a fresh 2026-06-26 live recheck of the public PED SharePoint and VR successor lanes',
    '',
    '## Evidence',
    '',
    `- ${DISTRICT_REASON}`,
    `- ${VR_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch403NewMexicoTerminalRefreshV1() {
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
    completeness_pct: 83,
    primary_gap_reason: PRIMARY_GAP_REASON,
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: DISTRICT_STATUS,
      vocational_rehabilitation_pre_ets: 'blocked_live_dvr_401_and_dws_request_rejected_with_no_public_successor',
    },
    final_blockers: (summary.final_blockers || []).map((row) => {
      const reason = reasonForFamily(row.family);
      return reason ? { ...row, evidence: reason } : row;
    }),
  };

  const updatedGapRows = gapRows.map((row) => {
    const reason = reasonForFamily(row.family);
    const familyStatus = statusForFamily(row.family);
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

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'new-mexico'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'hold_for_official_county_crosswalk_or_rec_service_area_contract',
        }
      : row,
  );

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeText(INPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, nextRows));

  const auditRow = allStateAudit.states.find((row) => row.stateId === 'new-mexico');
  if (auditRow) {
    auditRow.packetBatch = BATCH;
    auditRow.packetPrimaryGapReason = PRIMARY_GAP_REASON;
    auditRow.familyStatuses = {
      ...auditRow.familyStatuses,
      district_or_county_education_routing: DISTRICT_STATUS,
      vocational_rehabilitation_pre_ets: 'blocked_live_dvr_401_and_dws_request_rejected_with_no_public_successor',
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
    webed_home_live: true,
    webed_list_live: true,
    rec_home_live: true,
    public_workbooks_live: 6,
    dvr_root_401: true,
    dws_request_rejected: true,
    completeness_pct: 83,
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch403NewMexicoTerminalRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
