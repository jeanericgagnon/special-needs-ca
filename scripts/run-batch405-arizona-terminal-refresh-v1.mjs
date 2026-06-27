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
  'bounded_2026_06_26_live_des_in_page_helper_confirms_only_11_explicit_counties_and_no_literal_greenlee_la_paz_mohave_or_yuma_assignment';
const COUNTY_STATUS =
  'blocked_live_des_helper_only_proves_11_explicit_counties_with_no_greenlee_la_paz_mohave_or_yuma_assignment';
const FAILURE_CODE =
  'official_des_live_helper_exposes_only_11_explicit_counties_and_no_greenlee_la_paz_mohave_or_yuma_county_assignment';
const NEXT_ACTION =
  'hold_blocked_until_des_or_ahcccs_publish_explicit_county_assignment_for_greenlee_la_paz_mohave_and_yuma_or_new_reviewable_county_to_office_contract';
const COUNTY_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live Arizona county-local pass using the public DES locator's own in-page helper functions instead of relying only on older replay assumptions. The public wrapper roots \`https://des.az.gov/office-locator\` and \`https://des.az.gov/find-your-local-office\` are browser-readable again, but they still act only as wrapper pages that route users into the public Salesforce-hosted locator app at \`https://azdes-community.my.salesforce-sites.com/EOL/\`. The live locator frame still exposes the official service controls \`svcpickerDDS\`, \`svcpickerMA\`, \`svcpickerVR\`, and the current service lookup map through \`LoadSvcDropDown\`, \`xrefSvcCodeJSON\`, and \`geoSearchRadius\`. Re-running the app's own helper at Greenlee-area coordinates (33.0509, -109.3059) with a 250-mile search radius now produces a stricter official result than the older packet claimed. Across every public service code on the live app, explicit office \`county\` values appear for only 11 counties overall: Apache, Cochise, Coconino, Gila, Graham, Maricopa, Navajo, Pima, Pinal, Santa Cruz, and Yavapai. No reviewed live helper result for any service code contains a literal \`Greenlee\`, \`La Paz\`, \`Mohave\`, or \`Yuma\` county assignment. Some services still preserve locality ZIP coverage without county assignment: the live DDS and Child Care helper results include \`85533\`, \`85534\`, and \`85540\`, but still only on office rows whose explicit county fields remain other counties such as Graham or Pima. The accessible AHCCCS fallback lane remains live but still non-closing: \`https://www.azahcccs.gov/Members/ALTCSlocations.html\` names office cards such as Kingman and Yuma, \`https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf\` is text-extractable as county enrollment counts, and the reviewed AHCCCS admin PDFs are still only 2014 Pima support letters. None of those reviewed AHCCCS artifacts publishes a county-to-office assignment contract. Arizona therefore still lacks reviewed public official office-routing proof for at least Greenlee, La Paz, Mohave, and Yuma counties, so the county-local blocker is broader than the prior single-Greenlee packet implied.`;

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
    '- Arizona remains blocked after a 2026-06-26 bounded live recheck: the DES wrapper roots are browser-readable again but still route into the same Salesforce locator shell, the public locator app exposes explicit office county fields for only 11 counties, and no reviewed public DES or AHCCCS artifact explicitly assigns Greenlee, La Paz, Mohave, or Yuma County to an office.';
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
      '- Arizona: `bounded_2026_06_26_live_des_in_page_helper_confirms_only_11_explicit_counties_and_no_literal_greenlee_la_paz_mohave_or_yuma_assignment`',
    )
    .replace(
      /### Blocker Reason\s+[\s\S]*?(?=\n## |\s*$)/,
      `### Blocker Reason

\`county_local_disability_resources\` is still the sole Arizona blocker. The live official DES helper now proves explicit office county fields for only 11 counties total, and no reviewed DES or AHCCCS artifact explicitly assigns Greenlee, La Paz, Mohave, or Yuma County to an office. The Salesforce locator still preserves some ZIP-locality coverage, but not a county-to-office contract.`,
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
    '- County-local routing is weaker than the prior packet claimed: the current live DES helper proves explicit office county fields for only 11 counties, not a near-complete statewide county contract.',
    '- No reviewed live DES helper result explicitly labels Greenlee, La Paz, Mohave, or Yuma County in a county field.',
    '- The AHCCCS fallback lane remains live but still non-closing because it preserves office inventory, county enrollment counts, and support letters rather than a county-to-office contract.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 405 Arizona Terminal Refresh v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tied Arizona’s blocked terminal state to a fresh 2026-06-26 live recheck of the DES wrapper, live Salesforce helper outputs, and AHCCCS fallbacks',
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
    des_wrapper_403: false,
    des_wrapper_roots_browser_readable: true,
    des_wrapper_shell_only: true,
    des_salesforce_live: true,
    des_explicit_county_total: 11,
    missing_explicit_counties: ['Greenlee', 'La Paz', 'Mohave', 'Yuma'],
    altcs_locations_live: true,
    altcs_county_map_live_pdf: true,
    ahcccs_admin_pdfs_support_letters_only: true,
    completeness_pct: 92,
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch405ArizonaTerminalRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
