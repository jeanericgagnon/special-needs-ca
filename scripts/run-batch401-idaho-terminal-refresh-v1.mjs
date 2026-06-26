import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateCertification: path.join(generatedDir, 'state-certification', 'idaho.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch401_idaho_terminal_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch401-idaho-terminal-refresh-report-v1.md'),
};

const BATCH = 'batch401_idaho_terminal_refresh_v1';
const REVIEWED_DATE = '2026-06-26';
const REVIEWED_AT = '2026-06-26T00:00:00.000Z';
const PRIMARY_GAP_REASON =
  'bounded_2026_06_26_live_recheck_still_confirms_camas_and_clark_wrong_role_surfaces_only_and_idaho_dhw_office_inventory_without_county_contract';
const DISTRICT_STATUS =
  'blocked_residual_camas_and_clark_hosts_still_publish_only_wrong_role_or_too_thin_local_education_surfaces';
const DISTRICT_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live Idaho district pass on the exact residual Camas and Clark hosts. Camas root, \`Contact Information\`, \`All Resources\`, \`Federal Programs\`, and \`Advanced Opportunities\` all still return HTTP 200 on the district host, while \`https://www.camascountyschools.org/sitemap.xml\` still returns HTTP 404. The live Camas leaves still remain the wrong role: \`Federal Programs\` preserves Title I and Title IX program material, and \`Advanced Opportunities\` preserves accelerated-course guidance. None of the reviewed Camas leaves exposes district-owned special-education, special-services, student-services, 504, Child Find, or procedural-safeguards routing with local contact evidence. Clark root, \`Parent Resources\`, \`Contact Us\`, \`Title IX\`, and \`Parent Notification of General Education Instruction\` still return HTTP 200 on the district host, while \`https://www.clarkcountyschools161.org/sitemap.xml\` still returns HTTP 404. The current Clark leaves still bottom out in wrong-role or too-thin routing only: contact information, Title IX, general-education notice, and previously reviewed district-hosted Child Find flyer attachments without district-specific special-education routing evidence. Idaho therefore remains blocked because the last residual district-owned public surfaces are still live but still do not publish role-bearing local special-education routing.`;
const COUNTY_LOCAL_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live Idaho DHW office-contract pass on the exact official office stack. \`https://healthandwelfare.idaho.gov/offices\`, \`https://healthandwelfare.idaho.gov/dhw/caldwell-office\`, \`/offices?page=0\`, \`/offices?page=1\`, \`/offices?page=2\`, and \`https://healthandwelfare.idaho.gov/sitemap.xml\` all still return HTTP 200 on the current official DHW host. The DHW stack is real and reviewable, but it still preserves office inventory only rather than county assignment. The reviewed pages still expose office names and exact office leaves, while the public sitemap still enumerates office URLs only. No reviewed live DHW page or sitemap surface publishes \`county served\`, \`counties served\`, \`serves\`, \`service area\`, or any county-to-office table or export. Idaho county-local routing therefore still remains an explicit split between the existing safe exact-office replacements and the legacy counties that still lack a public county contract.`;

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
    '- Idaho remains blocked after a 2026-06-26 bounded live recheck: Camas still only exposes Contact Information, All Resources, Federal Programs, and Advanced Opportunities while its sitemap stays 404; Clark still only exposes Parent Resources, Contact Us, Title IX, and general-education notice while its sitemap stays 404; and the live Idaho DHW office stack plus sitemap still confirm office inventory without any public county-to-office contract.';
  return report.replace(
    /- Idaho remains blocked after a final live sitemap pass:[^\n]*/,
    line,
  );
}

function updateHandoff(text) {
  return text.replace(
    /- Idaho: `[^`]+`/,
    '- Idaho: `bounded_2026_06_26_live_recheck_still_confirms_camas_and_clark_wrong_role_surfaces_only_and_idaho_dhw_office_inventory_without_county_contract`',
  );
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Idaho California-Grade Audit Report v2',
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
    '- Idaho remains BLOCKED and not index-safe.',
    '- District-grade routing is still blocked because the last residual Camas and Clark district-owned surfaces are live but still wrong-role or too thin.',
    '- County-local remains blocked because the live Idaho DHW stack is office inventory only and still publishes no county-to-office contract.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 401 Idaho Terminal Refresh v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tied Idaho’s blocked terminal state to a fresh 2026-06-26 live recheck of the exact residual district and DHW office surfaces',
    '',
    '## Evidence',
    '',
    `- ${DISTRICT_REASON}`,
    `- ${COUNTY_LOCAL_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch401IdahoTerminalRefreshV1() {
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
    completeness_pct: 87,
    strong_critical_families: 10,
    weak_critical_families: 2,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: DISTRICT_STATUS,
    },
    final_blockers: (summary.final_blockers || []).map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return { ...row, evidence: DISTRICT_REASON };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, evidence: COUNTY_LOCAL_REASON };
      }
      return row;
    }),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: DISTRICT_STATUS, status_reason: DISTRICT_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, status_reason: COUNTY_LOCAL_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: DISTRICT_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: COUNTY_LOCAL_REASON };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, blocker_evidence: DISTRICT_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, blocker_evidence: COUNTY_LOCAL_REASON };
    }
    return row;
  });

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeText(INPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, nextRows));

  const auditRow = allStateAudit.states.find((row) => row.stateId === 'idaho');
  if (auditRow) {
    auditRow.packetBatch = BATCH;
    auditRow.packetPrimaryGapReason = PRIMARY_GAP_REASON;
    auditRow.packetRecommendedBatch = 'hold_for_new_role_bearing_district_leaf_or_county_contract';
    auditRow.completenessPct = 87;
    auditRow.familyStatuses = {
      ...auditRow.familyStatuses,
      district_or_county_education_routing: DISTRICT_STATUS,
      county_local_disability_resources: 'blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract',
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
    camas_live_surfaces_rechecked: true,
    clark_live_surfaces_rechecked: true,
    idaho_dhw_live_stack_rechecked: true,
    completeness_pct: 87,
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch401IdahoTerminalRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
