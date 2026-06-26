import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'maine_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'maine_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'maine_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maine_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'maine_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  report: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateCertification: path.join(generatedDir, 'state-certification', 'maine.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch406_maine_terminal_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch406-maine-terminal-refresh-report-v1.md'),
};

const BATCH = 'batch406_maine_terminal_refresh_v1';
const REVIEWED_DATE = '2026-06-26';
const REVIEWED_AT = '2026-06-26T00:00:00.000Z';
const PRIMARY_GAP_REASON =
  'bounded_2026_06_26_live_recheck_confirms_maine_dhhs_ofi_nav_stack_reports_and_search_surfaces_are_public_but_still_expose_no_county_to_office_or_service_area_contract';
const COUNTY_STATUS =
  'blocked_live_dhhs_ofi_nav_stack_reports_and_search_surfaces_public_but_still_not_county_grade';
const FAILURE_CODE =
  'official_maine_dhhs_ofi_surfaces_still_expose_offices_and_counts_without_county_assignment_contract';
const NEXT_ACTION =
  'hold_blocked_until_official_maine_dhhs_ofi_or_maine_search_surface_exposes_county_to_office_or_service_area_routing';
const COUNTY_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live Maine DHHS/OFI county-local pass. The exact public office and report surfaces are still live and reviewable: \`https://www.maine.gov/dhhs/about/contact/offices\`, \`/ofi/about-us/contact\`, \`/ofi/programs-services\`, \`/ofi/about-us/data-reports\`, \`/offices-divisions\`, \`/about/contact/administrative-offices\`, and \`/about/sitemap\` all still return HTTP 200. The current official report artifacts are also still live: the Geographic Distribution PDF, Geographic Overflow PDF, counts-by-county workbook, and counts-by-county-and-town workbook all still return HTTP 200. The official Maine search queries for county/district office routing are also still public and still return HTTP 200. But the public Maine surfaces still do not close county-grade routing: they preserve office names, addresses, labels, counts, or search shells rather than any county-to-office or service-area assignment contract. Maine therefore still lacks a reviewable public county-to-office routing contract on the live DHHS/OFI stack.`;

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
    '- Maine remains blocked after a 2026-06-26 bounded live recheck: DHHS district-office, OFI contact/programs/reports, offices/divisions, administrative offices, sitemap, official search queries, and the current county-count PDFs/XLSX surfaces all remain public, but they still expose office labels, addresses, or counts without any county-to-office or service-area routing contract.';
  if (/- Maine remains blocked after[^\n]*/.test(report)) {
    return report.replace(/- Maine remains blocked after[^\n]*/, line);
  }
  return `${report.trimEnd()}\n${line}\n`;
}

function updateHandoff(text) {
  return text
    .replace(/Current Focus State: [^\n]+/, 'Current Focus State: Maine')
    .replace(
      /- Maine: `[^`]+`/,
      '- Maine: `bounded_2026_06_26_live_recheck_confirms_maine_dhhs_ofi_nav_stack_reports_and_search_surfaces_are_public_but_still_expose_no_county_to_office_or_service_area_contract`',
    );
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Maine California-Grade Audit Report v2',
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
    '- Maine remains BLOCKED and not index-safe.',
    '- County-local routing is still blocked because the current public DHHS/OFI stack is live but still does not publish a county-to-office or service-area contract.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 406 Maine Terminal Refresh v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tied Maine’s blocked terminal state to a fresh 2026-06-26 live recheck of the current DHHS/OFI office, report, and search surfaces',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch406MaineTerminalRefreshV1() {
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
      state: 'maine',
      state_code: 'ME',
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
      state: 'maine',
      state_code: 'ME',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: FAILURE_CODE,
      next_action: NEXT_ACTION,
      evidence: COUNTY_REASON,
    },
  ];

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'maine'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
          completeness_pct: 91,
          weak_critical_families: 1,
          recommended_batch: 'hold_for_new_official_county_crosswalk_contract',
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

  const auditRow = allStateAudit.states.find((row) => row.stateId === 'maine');
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
    offices_live: true,
    ofi_contact_live: true,
    ofi_reports_live: true,
    geo_pdf_live: true,
    overflow_pdf_live: true,
    county_xlsx_live: true,
    county_town_xlsx_live: true,
    maine_search_live: true,
    completeness_pct: 91,
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch406MaineTerminalRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
