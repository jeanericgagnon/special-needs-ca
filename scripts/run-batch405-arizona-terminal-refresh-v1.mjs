import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'arizona_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'arizona_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'arizona_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arizona_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'arizona_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  report: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateCertification: path.join(generatedDir, 'state-certification', 'arizona.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch405_arizona_terminal_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch405-arizona-terminal-refresh-report-v1.md'),
};

const BATCH = 'batch405_arizona_terminal_refresh_v1';
const REVIEWED_DATE = '2026-06-26';
const REVIEWED_AT = '2026-06-26T00:00:00.000Z';
const PRIMARY_GAP_REASON =
  'bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_still_live_and_no_public_greenlee_county_assignment_on_des_or_ahcccs';
const COUNTY_STATUS =
  'blocked_des_salesforce_locator_still_exposes_only_greenlee_locality_zip_coverage_without_explicit_greenlee_county_assignment';
const FAILURE_CODE =
  'official_des_locator_still_lacks_explicit_greenlee_assignment_while_live_salesforce_and_ahcccs_fallbacks_remain_non_closing';
const NEXT_ACTION =
  'hold_blocked_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_reviewable_county_to_office_contract';
const COUNTY_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live Arizona county-local pass across the exact official DES, Salesforce, AHCCCS, and Greenlee-locality lanes. The official DES wrapper roots \`https://des.az.gov/office-locator\` and \`https://des.az.gov/find-your-local-office\` still return HTTP 403 \`Just a moment...\` shells. The linked public Salesforce-hosted DES office-locator app at \`https://azdes-community.my.salesforce-sites.com/EOL/\` still returns HTTP 200 and remains the only reviewable official DES county-local lane. The AHCCCS fallback family also remains unchanged: \`https://www.azahcccs.gov/Members/ALTCSlocations.html\` is still live, while the older \`ALTCS_CountyMap.pdf\` and \`AHCCCScontacts.html\` URLs still return HTTP 200 HTML stale shells instead of usable office-routing documents. The official Greenlee County health page plus first-party Clifton, Duncan, and Morenci town surfaces remain live, but they still do not name any DES or AHCCCS office assignment for Greenlee County. Arizona therefore still lacks one reviewed public official artifact that explicitly binds Greenlee County itself to a DES or AHCCCS office.`;

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
    '- Arizona remains blocked after a 2026-06-26 bounded live recheck: DES wrapper roots still return HTTP 403 `Just a moment...` shells, the public Salesforce locator app remains live, AHCCCS ALTCS locations remains live while the old county-map and contacts URLs stay stale, and no reviewed public DES or AHCCCS artifact explicitly assigns Greenlee County to an office.';
  if (/- Arizona remains blocked after[^\n]*/.test(report)) {
    return report.replace(/- Arizona remains blocked after[^\n]*/, line);
  }
  return `${report.trimEnd()}\n${line}\n`;
}

function updateHandoff(text) {
  return text
    .replace(/Current Focus State: [^\n]+/, 'Current Focus State: Arizona')
    .replace(
      /- Arizona: `[^`]+`/,
      '- Arizona: `bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_still_live_and_no_public_greenlee_county_assignment_on_des_or_ahcccs`',
    );
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Arizona California-Grade Audit Report v2',
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
    '- Arizona remains BLOCKED and not index-safe.',
    '- County-local routing is still blocked on one exact unresolved contract: a reviewed public DES or AHCCCS artifact that explicitly assigns Greenlee County to an office.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 405 Arizona Terminal Refresh v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tied Arizona’s blocked terminal state to a fresh 2026-06-26 live recheck of the DES wrapper, Salesforce app, AHCCCS fallbacks, and Greenlee-locality surfaces',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch405ArizonaTerminalRefreshV1() {
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
    completeness_pct: 92,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_county_local_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_full_county_contract',
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: COUNTY_STATUS,
    },
    final_blockers: [
      {
        family: 'county_local_disability_resources',
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
      state: 'arizona',
      state_code: 'AZ',
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
      state: 'arizona',
      state_code: 'AZ',
      family: 'county_local_disability_resources',
      severity: 'critical',
      priority_rank: 1,
      failure_code: FAILURE_CODE,
      next_action: NEXT_ACTION,
    },
  ];

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'arizona'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
          completeness_pct: 92,
          weak_critical_families: 1,
          recommended_batch: 'hold_county_local_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_full_county_contract',
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

  const auditRow = allStateAudit.states.find((row) => row.stateId === 'arizona');
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
    des_wrapper_403: true,
    des_salesforce_live: true,
    altcs_locations_live: true,
    altcs_county_map_stale_html: true,
    ahcccs_contacts_stale_html: true,
    greenlee_health_live: true,
    morenci_directory_live: true,
    completeness_pct: 92,
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch405ArizonaTerminalRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
