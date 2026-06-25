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
  failures: path.join(generatedDir, 'alaska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'alaska_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'alaska_next_action_queue_v2.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  stateReport: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch355_alaska_dual_lane_dpa_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch355-alaska-dual-lane-dpa-finality-report-v1.md'),
};

const BATCH_NAME = 'batch355_alaska_dual_lane_dpa_finality_v1';
const HOLD_BATCH = 'hold_for_new_official_borough_assignment_contract';
const HOLD_REPAIR_LANE = 'blocked_until_new_official_public_county_contract';
const PRIMARY_GAP_REASON =
  'reviewed_live_dpa_offices_page_still_only_groups_regions_while_raw_health_host_403_persists_and_dfcs_adds_no_borough_or_census_area_contract';
const FAILURE_CODE =
  'reviewed_live_dpa_offices_page_proves_regional_offices_but_no_borough_assignment_and_raw_health_fetches_still_403';
const FAMILY_STATUS =
  'blocked_live_dpa_offices_page_region_only_with_raw_403_regression_and_dfcs_without_county_equivalent_contract';
const NEXT_ACTION =
  'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_export_or_api';
const UPDATED_AT = '2026-06-25';
const ASSIGNED_STATE_ORDER = [
  'Massachusetts',
  'Alaska',
  'Maine',
  'Idaho',
  'New Mexico',
  'Arizona',
  'New Hampshire',
];

const PROBE = {
  fetchedDate: UPDATED_AT,
  generatedAt: new Date().toISOString(),
  reviewedDpaOffices: {
    url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
    finalUrl: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
    reviewStatus: 200,
    title: 'Division of Public Assistance (DPA) Offices | State of Alaska | Department of Health',
    h1: 'Division of Public Assistance (DPA) Offices',
  },
  rawDpaLanding: {
    url: 'https://health.alaska.gov/en/division-of-public-assistance/',
    status: 403,
    title: 'Just a moment...',
  },
  rawDpaOffices: {
    url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
    status: 403,
    title: 'Just a moment...',
  },
  rawDpaDashboardPdf: {
    url: 'https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf',
    status: 403,
    title: 'Just a moment...',
  },
  rawMedicaidSnapshotPdf: {
    url: 'https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf',
    status: 403,
    title: 'Just a moment...',
  },
  dfcsRoot: {
    url: 'https://dfcs.alaska.gov/Pages/default.aspx',
    status: 200,
  },
  dfcsServices: {
    url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
    status: 200,
  },
  dfcsSiteMap: {
    url: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
    status: 200,
  },
  dfcsContacts: {
    url: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
    status: 200,
  },
  dfcsSearchGuesses: [
    'https://dfcs.alaska.gov/Pages/search-results.aspx?k=public%20assistance',
    'https://dfcs.alaska.gov/Pages/search-results.aspx?k=office',
    'https://dfcs.alaska.gov/Pages/search-results.aspx?k=medicaid',
    'https://dfcs.alaska.gov/Pages/search-results.aspx?k=adult%20public%20assistance',
  ],
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function replaceSample(samples, sampleName, replacement) {
  const index = samples.findIndex((sample) => sample.sample_name === sampleName);
  if (index >= 0) {
    samples[index] = replacement;
  } else {
    samples.push(replacement);
  }
}

function buildStatusReason() {
  return `The live Alaska county-local blocker is now dual-lane final rather than challenge-only. In the reviewed browser lane on ${UPDATED_AT}, the official Department of Health DPA offices page at \`${PROBE.reviewedDpaOffices.url}\` is publicly readable and truthfully preserves regional offices, hours, addresses, fax numbers, virtual contact-center routing, and secure upload options on the current official host. But the page still only groups offices by broad regions like Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, and Southwest Alaska. It still does not assign boroughs or census areas to those offices, and it still exposes no county-equivalent assignment contract anywhere on the page. In the raw low-token lane, the same health-host family still fails closed: the exact DPA landing page, DPA offices page, and the two related PDFs still return HTTP 403 Cloudflare shells with the title "Just a moment...". The DFCS successor host remains negative too: the root page still routes only into Commissioner and OCS branches, Services still only relays statewide phone routing, Site Map still only adds wrong-role branches such as OCS offices and Pioneer Homes payment assistance, Department Contacts still exposes only Commissioner and OCS sections, and bounded search-result guesses still 404. Alaska therefore still lacks any public official borough- or census-area-to-office assignment contract.`;
}

function buildEvidence() {
  return `Reviewed ${UPDATED_AT} exact official Alaska county-local surfaces again across both the browser-readable and raw low-token lanes. In the browser-reviewed lane, \`${PROBE.reviewedDpaOffices.url}\` is now publicly readable on the current official Department of Health host and preserves regional offices, office hours, street addresses, fax numbers, virtual contact-center routing, and secure document upload options. But that page still only groups offices by broad regions and still does not map Alaska boroughs or census areas to those offices. In the raw low-token lane, the health-host family still fails closed: \`${PROBE.rawDpaLanding.url}\`, \`${PROBE.rawDpaOffices.url}\`, \`${PROBE.rawDpaDashboardPdf.url}\`, and \`${PROBE.rawMedicaidSnapshotPdf.url}\` still return HTTP 403 with the Cloudflare title "Just a moment...". The DFCS successor host remains negative on official public review: \`${PROBE.dfcsRoot.url}\` still only routes into Commissioner and OCS branches rather than any DPA/public-assistance office directory; \`${PROBE.dfcsServices.url}\` still only links Adult Public Assistance and Apply for Medicaid back to the health host plus statewide phone routing; \`${PROBE.dfcsSiteMap.url}\` still only exposes wrong-role branches such as OCS offices, OCS grievance, and Pioneer Homes payment assistance; and \`${PROBE.dfcsContacts.url}\` still exposes only Commissioner and OCS sections rather than any borough-assignment text. Bounded search-result guesses at \`${PROBE.dfcsSearchGuesses[0]}\`, \`${PROBE.dfcsSearchGuesses[1]}\`, \`${PROBE.dfcsSearchGuesses[2]}\`, and \`${PROBE.dfcsSearchGuesses[3]}\` all returned 404. Alaska therefore still lacks any public official borough- or census-area-to-office assignment surface that can satisfy county-equivalent local routing.`;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
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
    '## Repair decision',
    '',
    '- Alaska remains BLOCKED and not index-safe.',
    '- The official Department of Health DPA offices page is publicly readable in the reviewed browser lane.',
    '- That live page proves regional offices, hours, addresses, fax numbers, and virtual routing, but it still does not assign boroughs or census areas to those offices.',
    '- The raw low-token lane still gets Cloudflare `Just a moment...` 403 shells across the same health-host family, so there is no reusable raw export lane from that host yet.',
    '- The DFCS root, Services, Site Map, Department Contacts, and bounded search-result guesses still expose no borough- or census-area DPA office contract.',
    '- Alaska therefore still lacks any public official county-equivalent office-assignment contract.',
  ].join('\n') + '\n';
}

function replaceAllStateAlaskaNote(text) {
  const lines = text.split('\n').filter((line) => !line.startsWith('- Alaska county-local routing is still blocked'));
  lines.push('- Alaska county-local routing is still blocked: the official DPA offices page is browser-readable again and proves regional offices plus contacts, but it still has no borough/census-area assignment contract, while the raw low-token lane still gets health-host Cloudflare 403 shells and DFCS root/services/site-map/contacts/search still add no county-equivalent mapping.');
  return `${lines.join('\n').replace(/\n+$/, '')}\n`;
}

function buildHandoff(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));
  const nextBlockedStateNames = ASSIGNED_STATE_ORDER
    .slice(ASSIGNED_STATE_ORDER.indexOf('Alaska') + 1)
    .filter((stateName) => blockedRows.some((row) => row.stateName === stateName))
    .slice(0, 10);

  return [
    '# Gemini Source Scout Handoff',
    '',
    `Updated: ${UPDATED_AT}`,
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: Alaska',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is still the only remaining Alaska blocker, but the truth is now dual-lane rather than challenge-only. The current official DPA offices page on `health.alaska.gov` is publicly readable in the reviewed browser lane and it clearly proves regional offices, office hours, addresses, fax numbers, virtual contact-center routing, and secure upload options. But it still only groups offices by broad regions and still does not map boroughs or census areas to those offices. In the raw low-token lane, the same health-host family still returns Cloudflare `Just a moment...` 403 shells, so it still offers no reusable raw export or fetch lane. The DFCS successor host remains negative: root, Services, Site Map, Department Contacts, and bounded search-result guesses still expose no DPA/public-assistance office directory or county-equivalent assignment contract. Alaska remains BLOCKED because there is still no public official borough- or census-area office-assignment surface.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Alaska page, table, export, PDF, API, or directory that explicitly maps boroughs or census areas to DPA office locations.',
    '- Any public detail surface on the current Department of Health DPA host that adds service-area or region-to-borough assignment beyond the regional office groupings now visible.',
    '- Any official DFCS or Department of Health directory leaf that directly names borough/census-area coverage for public-assistance offices.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    `- [Alaska DPA offices page](${PROBE.reviewedDpaOffices.url})`,
    `- [Alaska DPA landing page](${PROBE.rawDpaLanding.url})`,
    `- [Alaska DPA dashboard PDF](${PROBE.rawDpaDashboardPdf.url})`,
    `- [Alaska Medicaid enrollment snapshot PDF](${PROBE.rawMedicaidSnapshotPdf.url})`,
    `- [DFCS root](${PROBE.dfcsRoot.url})`,
    `- [DFCS Services](${PROBE.dfcsServices.url})`,
    `- [DFCS Site Map](${PROBE.dfcsSiteMap.url})`,
    `- [DFCS Department Contacts](${PROBE.dfcsContacts.url})`,
    ...PROBE.dfcsSearchGuesses.map((url) => `- [DFCS search guess](${url})`),
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any public official borough- or census-area-to-office assignment table on Alaska Department of Health or DFCS.',
    '- Any public official DPA office directory export, API, or PDF that lists explicit borough/census-area coverage.',
    '',
    '## Next State Order After Alaska',
    '',
    ...nextBlockedStateNames.map((stateName, index) => `${index + 1}. ${stateName}`),
    '',
  ].join('\n');
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 355 Alaska Dual-Lane DPA Finality v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.blocker_family}`,
    '',
    '## What changed',
    '',
    '- Preserved the stronger current truth that the official Alaska DPA offices page is browser-readable on the live health host.',
    '- Preserved the separate raw low-token truth that the same health-host family still returns Cloudflare `Just a moment...` 403 shells.',
    '- Tightened Alaska around the real blocker: there is still no borough/census-area-to-office assignment contract.',
    '',
    '## Repair decision',
    '',
    '- Alaska remains blocked on missing county-equivalent office assignment.',
    '- The blocker is now phrased around the live reviewed page plus the still-blocked raw lane, instead of treating the state as if nothing public were reviewable.',
  ].join('\n') + '\n';
}

export async function generateBatch355AlaskaDualLaneDpaFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');

  const evidence = buildEvidence();
  const statusReason = buildStatusReason();

  summary.batch = BATCH_NAME;
  summary.primary_gap_reason = PRIMARY_GAP_REASON;
  summary.recommended_batch = HOLD_BATCH;
  summary.final_blockers = [{
    family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    evidence,
    next_action: NEXT_ACTION,
  }];
  summary.familyStatuses.county_local_disability_resources = FAMILY_STATUS;

  for (const row of gapRows) {
    if (row.family === 'county_local_disability_resources') {
      row.family_status = FAMILY_STATUS;
      row.status_reason = statusReason;
      row.failure_code = FAILURE_CODE;
      row.next_action = NEXT_ACTION;
    }
  }

  for (const row of failureRows) {
    if (row.family === 'county_local_disability_resources') {
      row.failure_code = FAILURE_CODE;
      row.evidence = evidence;
      row.next_action = NEXT_ACTION;
    }
  }

  for (const row of verifiedRows) {
    if (row.family !== 'county_local_disability_resources') continue;
    row.family_status = FAMILY_STATUS;
    row.query_basis = `Reviewed ${UPDATED_AT} the live official Alaska DPA offices page in the browser-readable lane, confirmed the raw low-token health-host family still returns Cloudflare 403 shells, and rechecked DFCS root/services/site-map/contacts/search as negative official sibling surfaces.`;
    row.blocker_code = FAILURE_CODE;
    row.blocker_evidence = evidence;
    row.status_reason = statusReason;
    replaceSample(row.samples, 'Alaska DPA offices directory', {
      sample_name: 'Alaska DPA offices directory',
      source_url: PROBE.reviewedDpaOffices.url,
      final_url: PROBE.reviewedDpaOffices.finalUrl,
      verification_status: 'reviewed',
      source_type: 'reviewed_browser_readable_official_offices_directory_without_county_equivalent_assignments',
      source_table: BATCH_NAME,
      fetched_at: PROBE.generatedAt,
      evidence_snippet: 'The live DPA offices page preserves regional offices, office hours, addresses, fax numbers, and virtual contact routing on the official health host, but it still does not assign boroughs or census areas to those offices.',
    });
    replaceSample(row.samples, 'Alaska DPA raw low-token health-host family', {
      sample_name: 'Alaska DPA raw low-token health-host family',
      source_url: PROBE.rawDpaOffices.url,
      final_url: PROBE.rawDpaOffices.url,
      verification_status: 'blocked',
      source_type: 'raw_low_token_cloudflare_403_shell',
      source_table: BATCH_NAME,
      fetched_at: PROBE.generatedAt,
      evidence_snippet: 'The raw low-token lane still gets HTTP 403 Cloudflare "Just a moment..." shells across the DPA landing page, offices page, and related PDFs, so there is still no reusable raw export lane on the health host.',
    });
    replaceSample(row.samples, 'Alaska DFCS root page', {
      sample_name: 'Alaska DFCS root page',
      source_url: PROBE.dfcsRoot.url,
      final_url: PROBE.dfcsRoot.url,
      verification_status: 'reviewed',
      source_type: 'official_root_without_public_assistance_office_contract',
      source_table: BATCH_NAME,
      fetched_at: PROBE.generatedAt,
      evidence_snippet: 'The DFCS root still routes into Commissioner and OCS branches rather than any DPA/public-assistance office directory or borough-assignment table.',
    });
    replaceSample(row.samples, 'Alaska DFCS Services', {
      sample_name: 'Alaska DFCS Services',
      source_url: PROBE.dfcsServices.url,
      final_url: PROBE.dfcsServices.url,
      verification_status: 'reviewed',
      source_type: 'official_services_hub_with_statewide_phone_relay',
      source_table: BATCH_NAME,
      fetched_at: PROBE.generatedAt,
      evidence_snippet: 'The DFCS Services page still only relays Adult Public Assistance and Apply for Medicaid back to statewide phone routing rather than borough or census-area office assignments.',
    });
    replaceSample(row.samples, 'Alaska DFCS Site Map', {
      sample_name: 'Alaska DFCS Site Map',
      source_url: PROBE.dfcsSiteMap.url,
      final_url: PROBE.dfcsSiteMap.url,
      verification_status: 'reviewed',
      source_type: 'official_site_map_without_dpa_office_assignments',
      source_table: BATCH_NAME,
      fetched_at: PROBE.generatedAt,
      evidence_snippet: 'The DFCS Site Map still adds only wrong-role branches like OCS offices, OCS grievance, and Pioneer Homes payment assistance, not borough/census-area DPA office routing.',
    });
    replaceSample(row.samples, 'Alaska DFCS bounded search-result guesses', {
      sample_name: 'Alaska DFCS bounded search-result guesses',
      source_url: PROBE.dfcsSearchGuesses[0],
      final_url: PROBE.dfcsSearchGuesses[0],
      verification_status: 'blocked',
      source_type: 'official_search_guesses_all_404',
      source_table: BATCH_NAME,
      fetched_at: PROBE.generatedAt,
      evidence_snippet: 'Bounded DFCS search-result guesses for public assistance, office, medicaid, and adult public assistance all returned 404, so no public search recovery lane exists on that host.',
    });
    row.sample_count = row.samples.length;
  }

  for (const row of nextRows) {
    if (row.family === 'county_local_disability_resources') {
      row.failure_code = FAILURE_CODE;
      row.next_action = NEXT_ACTION;
      row.evidence = evidence;
    }
  }

  const alaskaAudit = allStateAudit.states.find((row) => row.stateId === 'alaska');
  alaskaAudit.packetBatch = BATCH_NAME;
  alaskaAudit.packetPrimaryGapReason = PRIMARY_GAP_REASON;
  alaskaAudit.packetRecommendedBatch = HOLD_BATCH;
  alaskaAudit.familyStatuses.county_local_disability_resources = FAMILY_STATUS;

  const alaskaQueue = allStateQueue.find((row) => row.state === 'alaska');
  alaskaQueue.primary_gap_reason = PRIMARY_GAP_REASON;
  alaskaQueue.recommended_batch = HOLD_BATCH;
  alaskaQueue.repair_lane = HOLD_REPAIR_LANE;

  const batchSummary = {
    batch: BATCH_NAME,
    generated_at: PROBE.generatedAt,
    state: 'alaska',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    reviewed_dpa_offices_status: PROBE.reviewedDpaOffices.reviewStatus,
    reviewed_dpa_offices_title: PROBE.reviewedDpaOffices.title,
    reviewed_dpa_offices_h1: PROBE.reviewedDpaOffices.h1,
    raw_dpa_landing_status: PROBE.rawDpaLanding.status,
    raw_dpa_offices_status: PROBE.rawDpaOffices.status,
    raw_dpa_dashboard_pdf_status: PROBE.rawDpaDashboardPdf.status,
    raw_medicaid_snapshot_pdf_status: PROBE.rawMedicaidSnapshotPdf.status,
    dfcs_root_status: PROBE.dfcsRoot.status,
    dfcs_services_status: PROBE.dfcsServices.status,
    dfcs_site_map_status: PROBE.dfcsSiteMap.status,
    dfcs_contacts_status: PROBE.dfcsContacts.status,
    dfcs_search_guess_404s: PROBE.dfcsSearchGuesses.length,
    borough_assignment_contract_found: false,
  };

  writeJson(INPUTS.summary, summary);
  writeJsonl(INPUTS.gap, gapRows);
  writeJsonl(INPUTS.failures, failureRows);
  writeJsonl(INPUTS.verified, verifiedRows);
  writeJsonl(INPUTS.nextActions, nextRows);
  writeJson(INPUTS.allStateAudit, allStateAudit);
  writeJsonl(INPUTS.allStateQueue, allStateQueue);
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows));
  fs.writeFileSync(INPUTS.allStateReport, replaceAllStateAlaskaNote(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(allStateAudit));
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await generateBatch355AlaskaDualLaneDpaFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
