import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'alaska_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'alaska_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'alaska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'alaska_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'alaska_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  report: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateCertification: path.join(generatedDir, 'state-certification', 'alaska.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch404_alaska_terminal_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch404-alaska-terminal-refresh-report-v1.md'),
};

const BATCH = 'batch404_alaska_terminal_refresh_v1';
const REVIEWED_DATE = '2026-06-26';
const REVIEWED_AT = '2026-06-26T00:00:00.000Z';
const PRIMARY_GAP_REASON =
  'bounded_2026_06_26_live_recheck_confirms_dpa_offices_page_is_browser_readable_but_region_only_while_raw_health_fetches_still_403_and_dfcs_successor_surfaces_expose_no_borough_or_census_area_contract';
const COUNTY_STATUS =
  'blocked_reviewable_dpa_offices_regions_without_borough_assignment_and_raw_health_fetches_403';
const COUNTY_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live Alaska county-local pass. In the reviewed browser lane, the exact official DPA offices page at \`https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/\` is publicly readable again and truthfully proves named regional offices, office hours, full street addresses, fax numbers, a virtual contact center, and secure upload routing on the current health host. The live page now proves only five regional groupings: \`Alaska Peninsula\`, \`Northern Alaska\`, \`Southcentral Alaska\`, \`Southeast Alaska\`, and \`Southwest Alaska\`. Under those headings it names only city- or office-level locations such as Homer, Kenai, Fairbanks, Nome, Anchorage, Matanuska-Susitna Valley, Juneau, Ketchikan, Sitka, Bethel, and Kodiak. The same reviewed page still contains no literal \`borough\` or \`census area\` terms and does not assign any Alaska boroughs or census areas to those offices. In the raw low-token lane, the wider health-host family still fails closed: \`https://health.alaska.gov/en/division-of-public-assistance/\`, \`https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf\`, and \`https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf\` still return HTTP 403 with the Cloudflare \`Just a moment...\` shell. The DFCS successor family is still publicly reachable but still does not restore county-equivalent routing: \`https://dfcs.alaska.gov/Pages/default.aspx\`, \`/Pages/Services.aspx\`, \`/pages/search.aspx\`, and \`/Commissioner/Pages/Contacts/default.aspx\` still return HTTP 200 SharePoint pages, but \`https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance\` still returns HTTP 404 and the reviewed successor surfaces still expose no borough or census-area assignment contract for DPA or Medicaid office routing. The freshly rechecked DFCS Site Map branch also still fails closed as a repair lane: \`https://dfcs.alaska.gov/Pages/Site-Map.aspx\` is live, but the extra surfaced DAPH leaves \`/daph/Pages/services.aspx\` and \`/daph/Pages/paymentassistance/default.aspx\` resolve to Alaska Pioneer Homes services and payment-assistance content rather than public-assistance office routing, while the only office-looking DFCS child lane remains the wrong-role OCS Regional Offices page. Alaska therefore still lacks any reviewable public borough- or census-area-to-office contract.`;

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
    '- Alaska remains blocked after a 2026-06-26 bounded live recheck: the exact DPA offices page is browser-readable again and truthfully proves regional offices, but it still gives no borough- or census-area assignment contract; the wider health-host raw lane still returns 403 `Just a moment...` shells on related DPA leaves and PDFs, while DFCS successor root/services/search/contacts still expose no county-equivalent routing contract, the DFCS search results endpoint still 404s, and the extra DAPH branch still resolves only to Alaska Pioneer Homes payment-assistance content rather than public-assistance office routing.';
  if (/- Alaska remains blocked after[^\n]*/.test(report)) {
    return report.replace(/- Alaska remains blocked after[^\n]*/, line);
  }
  return `${report.trimEnd()}\n${line}\n`;
}

function updateHandoff(text) {
  return text
    .replace(/Current Focus State: [^\n]+/, 'Current Focus State: Alaska')
    .replace(
      /- Alaska: `[^`]+`/,
      '- Alaska: `bounded_2026_06_26_live_recheck_confirms_dpa_offices_page_is_browser_readable_but_region_only_while_raw_health_fetches_still_403_and_dfcs_successor_surfaces_expose_no_borough_or_census_area_contract`',
    )
    .replace(
      /### Blocker Reason\s+[\s\S]*?(?=\n## |\s*$)/,
      `### Blocker Reason

\`county_local_disability_resources\` is still the sole Alaska blocker. The exact official DPA offices page is browser-readable again and truthfully proves only regional office groupings, while the wider health-host raw lane still returns public Cloudflare 403 shells on related DPA leaves and PDFs. DFCS successor content still exposes only statewide or wrong-role content, and the extra DAPH branch surfaced from the live DFCS Site Map still resolves to Alaska Pioneer Homes services and payment-assistance pages rather than any borough- or census-area public-assistance office contract.`,
    );
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Alaska California-Grade Audit Report v2',
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
    '- Alaska remains BLOCKED and not index-safe.',
    '- County-local routing is still blocked because the exact DPA offices page only proves broad regional office groupings without any borough or census-area assignment, the wider health-host raw lane still fails closed on related DPA leaves and PDFs, the DFCS successor still does not publish a borough or census-area contract, and the extra DAPH branch is still wrong-role Alaska Pioneer Homes content rather than a hidden DPA office lane.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 404 Alaska Terminal Refresh v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tied Alaska’s blocked terminal state to a fresh 2026-06-26 recheck showing the exact DPA offices page is browser-readable but still region-only, while the wider health-host raw lane and the extra DFCS DAPH branch remain blocked or wrong-role',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch404AlaskaTerminalRefreshV1() {
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
    final_blockers: (summary.final_blockers || []).map((row) =>
      row.family === 'county_local_disability_resources' ? { ...row, evidence: COUNTY_REASON } : row,
    ),
  };

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON }
      : row,
  );

  const updatedFailureRows = failureRows.map((row) =>
    row.family === 'county_local_disability_resources' ? { ...row, evidence: COUNTY_REASON } : row,
  );

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_STATUS, blocker_evidence: COUNTY_REASON }
      : row,
  );

  const updatedNextRows = nextRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: 'reviewed_live_dpa_offices_page_proves_regional_offices_but_no_borough_assignment_and_raw_health_fetches_still_403',
          evidence: COUNTY_REASON,
        }
      : row,
  );

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'alaska'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'hold_for_new_official_borough_assignment_contract',
          repair_lane: 'blocked_until_new_official_public_county_contract',
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

  const auditRow = allStateAudit.states.find((row) => row.stateId === 'alaska');
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
    nextActions: updatedNextRows,
  };
  writeJson(INPUTS.stateCertification, updatedStateCertification);

  writeJson(OUTPUTS.summary, {
    batch: BATCH,
    generated_at: new Date().toISOString(),
    classification: 'BLOCKED',
    dpa_offices_browser_reviewable: true,
    dpa_offices_region_only: true,
    dpa_region_heading_count: 5,
    dpa_page_has_borough_term: false,
    dpa_page_has_census_area_term: false,
    dpa_root_403: true,
    dpa_dashboard_pdf_403: true,
    medicaid_snapshot_pdf_403: true,
    dfcs_root_200: true,
    dfcs_services_200: true,
    dfcs_site_map_200: true,
    dfcs_search_200: true,
    dfcs_search_results_404: true,
    daph_services_wrong_role: true,
    daph_payment_assistance_wrong_role: true,
    ocs_regional_offices_only_remaining_office_like_lane: true,
    completeness_pct: 91,
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch404AlaskaTerminalRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
