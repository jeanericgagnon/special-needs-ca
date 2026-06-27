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
  'bounded_2026_06_26_live_des_salesforce_remoting_confirms_explicit_county_fields_for_la_paz_mohave_and_yuma_and_greenlee_zip_served_localities_but_still_no_greenlee_county_assignment';
const COUNTY_STATUS =
  'blocked_live_des_remoting_proves_greenlee_zip_served_localities_but_still_lacks_explicit_greenlee_county_assignment';
const FAILURE_CODE =
  'official_des_live_remoting_proves_greenlee_zip_served_localities_but_still_lacks_explicit_greenlee_county_assignment';
const NEXT_ACTION =
  'hold_blocked_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_new_reviewable_county_to_office_contract';
const COUNTY_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live Arizona county-local pass using a real browser plus the public DES Salesforce remoting API instead of relying only on prior helper replay assumptions. The public wrapper roots \`https://des.az.gov/office-locator\` and \`https://des.az.gov/find-your-local-office\` are now back behind a Cloudflare \`Just a moment...\` shell in a browser-rendered pass, so they no longer provide reviewable public county proof directly. The direct public first-party locator at \`https://azdes-community.my.salesforce-sites.com/EOL/\` remains reviewable, and its embedded frame still exposes the official service controls \`svcpickerDDS\`, \`svcpickerMA\`, \`svcpickerVR\`, plus the live remoting/controller path \`EOLEmbedController.getEOLOfficeData\` with the current service lookup map through \`LoadSvcDropDown\`, \`xrefSvcCodeJSON\`, and \`geoSearchRadius\`. Re-running that live remoting lane at bounded county coordinates with a 250-mile search radius narrows the blocker materially: \`La Paz\`, \`Mohave\`, and \`Yuma\` now each appear as literal office \`county\` values on returned DES rows, so those counties are no longer the unresolved gap. Greenlee still does not appear as an explicit office \`county\` value on reviewed DES results for DDS, Medical Assistance, Cash Assistance, Nutrition Assistance, or Vocational Rehabilitation. The strongest remaining Greenlee proof is locality-level rather than county-literal: the Tucson DDS row preserves \`zipCodesServed\` values \`85533\`, \`85534\`, and \`85540\`, and first-party Greenlee locality surfaces still preserve \`Clifton, Arizona 85533\`, \`Duncan, Arizona 85534\`, and \`Morenci, AZ 85540\`. That is useful service-area evidence, but the reviewed DES payload still resolves Greenlee-area results only to offices whose explicit county fields are other counties such as \`Graham\`, and no returned row contains literal \`Greenlee\`, \`Clifton\`, \`Duncan\`, or \`Morenci\` inside \`county\`, \`serviceDirections\`, or \`specialInstructions\`. The accessible AHCCCS fallback lane remains live but still non-closing for Greenlee: \`https://www.azahcccs.gov/Members/ALTCSlocations.html\` preserves named office cards such as Kingman and Yuma, and \`https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf\` remains only a county enrollment report rather than a county-to-office assignment contract. Arizona therefore still lacks reviewed public official office-routing proof for Greenlee County even though La Paz, Mohave, and Yuma are now explicitly covered in the live DES remoting data and Greenlee now has explicit locality ZIP service-area evidence.`;

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
      '- Arizona remains blocked after a 2026-06-26 bounded live recheck: the DES wrapper roots are back behind a Cloudflare `Just a moment...` shell, but the direct public Salesforce locator and its live remoting API still prove explicit county fields for La Paz, Mohave, and Yuma. Greenlee County alone still lacks reviewed public official office-routing proof.';
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
      '- Arizona: `bounded_2026_06_26_live_des_salesforce_remoting_confirms_explicit_county_fields_for_la_paz_mohave_and_yuma_and_greenlee_zip_served_localities_but_still_no_greenlee_county_assignment`',
    )
    .replace(
      /### Blocker Reason\s+[\s\S]*?(?=\n## |\s*$)/,
      `### Blocker Reason

\`county_local_disability_resources\` is still the sole Arizona blocker, but it is now narrower. The live official DES Salesforce remoting lane proves literal office county fields for La Paz, Mohave, and Yuma, and it also preserves Greenlee locality ZIP service-area values \`85533\`, \`85534\`, and \`85540\` on the Tucson DDS row. Greenlee County alone still lacks reviewed public official county-literal routing proof, and the AHCCCS fallback still stops at office cards plus county enrollment reporting rather than a Greenlee county-to-office contract.`,
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
    '- County-local routing is still the only blocker, but it is narrower than the prior packet claimed.',
    '- The live public DES Salesforce remoting lane now proves literal office county fields for La Paz, Mohave, and Yuma.',
    '- Greenlee County alone still lacks a reviewed public official county-literal assignment even though the DES data now preserves Greenlee locality ZIP service-area values.',
    '- The AHCCCS fallback lane remains live but still non-closing for Greenlee because it preserves office inventory and county enrollment counts rather than a Greenlee county-to-office contract.',
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
          recommended_batch: 'hold_county_local_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_new_reviewable_county_to_office_contract',
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
    des_wrapper_roots_browser_readable: false,
    des_wrapper_shell_only: true,
    des_salesforce_live: true,
    des_explicit_county_total: 14,
    missing_explicit_counties: ['Greenlee'],
    des_remoting_confirms_counties: ['La Paz', 'Mohave', 'Yuma'],
    greenlee_zip_served_values: ['85533', '85534', '85540'],
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
