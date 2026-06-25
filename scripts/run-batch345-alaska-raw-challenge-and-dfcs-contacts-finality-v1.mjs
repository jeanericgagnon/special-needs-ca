import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch342AlaskaLiveDpaOfficesFinalityV1 } from './run-batch342-alaska-live-dpa-offices-finality-v1.mjs';

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
  batchSummary: path.join(generatedDir, 'batch345_alaska_raw_challenge_and_dfcs_contacts_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch345-alaska-raw-challenge-and-dfcs-contacts-finality-report-v1.md'),
};

const BATCH_NAME = 'batch345_alaska_raw_challenge_and_dfcs_contacts_finality_v1';
const HOLD_BATCH = 'hold_for_new_official_borough_assignment_contract';
const HOLD_REPAIR_LANE = 'blocked_until_new_official_public_county_contract';
const PRIMARY_GAP_REASON =
  'raw_health_host_challenge_persists_while_browser_reviewed_dpa_offices_page_still_lacks_borough_or_census_area_assignment_and_dfcs_contacts_add_no_local_contract';
const FAILURE_CODE =
  'raw_health_host_still_returns_challenge_shells_and_dfcs_contacts_add_no_borough_or_census_area_contract';
const FAMILY_STATUS =
  'blocked_raw_health_host_challenge_plus_browser_reviewed_region_only_offices_page_and_dfcs_contacts_without_county_equivalent_contract';
const NEXT_ACTION =
  'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_export_or_api';
const UPDATED_AT = '2026-06-25';
const PRIORITY_ORDER = [
  'Utah',
  'Kansas',
  'Nebraska',
  'Nevada',
  'Florida',
  'Alaska',
  'South Carolina',
  'North Carolina',
  'New York',
  'Oklahoma',
  'Oregon',
  'Ohio',
  'Minnesota',
  'Maine',
  'Idaho',
  'Arizona',
  'Massachusetts',
  'New Mexico',
  'South Dakota',
  'Rhode Island',
  'Virginia',
  'West Virginia',
  'North Dakota',
  'Wisconsin',
  'Washington',
  'Tennessee',
  'Vermont',
  'Wyoming',
  'New Hampshire',
];

const RAW_PROBE = {
  generatedAt: new Date().toISOString(),
  fetchedDate: UPDATED_AT,
  dpaLanding: {
    url: 'https://health.alaska.gov/en/division-of-public-assistance/',
    status: 403,
    finalUrl: 'https://health.alaska.gov/en/division-of-public-assistance/',
    title: 'Just a moment...',
  },
  dpaOffices: {
    url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
    status: 403,
    finalUrl: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
    title: 'Just a moment...',
  },
  dpaDashboard: {
    url: 'https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf',
    status: 403,
    finalUrl: 'https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf',
    title: 'Just a moment...',
  },
  medicaidSnapshot: {
    url: 'https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf',
    status: 403,
    finalUrl: 'https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf',
    title: 'Just a moment...',
  },
  dfcsServices: {
    url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
    status: 200,
    finalUrl: 'https://dfcs.alaska.gov/Pages/Services.aspx',
    title: 'Services',
  },
  dfcsSiteMap: {
    url: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
    status: 200,
    finalUrl: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
    title: 'Site Map',
  },
  dfcsContacts: {
    url: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
    status: 200,
    finalUrl: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
    title: 'Department Contacts',
  },
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
  return `The live Alaska county-local blocker tightened again after one more bounded official recheck on ${UPDATED_AT}. In the raw low-token lane, the current Department of Health DPA landing page, the exact DPA offices page, and the two previously reviewed DPA PDFs now all return HTTP 403 Cloudflare challenge shells with the browser title "Just a moment...". That means the same health-host family is still not reproducibly fetchable in the low-token lane even though the reviewed browser lane had already shown a real DPA offices page. The reviewed browser evidence still matters because it proves the official offices page exists, but that page still only groups offices by broad regions and still does not assign Alaska boroughs or census areas to those offices. The DFCS successor host remains public but still adds no county-equivalent contract: \`Services.aspx\` is still a statewide phone relay for Adult Public Assistance and Apply for Medicaid, the Site Map still only surfaces wrong-role OCS and Pioneer Homes branches, and the Commissioner Department Contacts page still exposes no DPA/public-assistance office directory, no borough mapping, and no census-area assignment text. Alaska therefore remains blocked because there is still no public official borough- or census-area-to-office assignment contract, and the health-host family is still challenge-blocked in the raw low-token lane.`;
}

function buildEvidence() {
  return `Reviewed ${UPDATED_AT} exact official Alaska surfaces in both the raw low-token lane and the previously recovered browser-reviewed lane. The raw lane still fails closed on the health host: \`https://health.alaska.gov/en/division-of-public-assistance/\`, \`https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/\`, \`https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf\`, and \`https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf\` all returned HTTP 403 with the Cloudflare title "Just a moment...". The prior browser-reviewed DPA offices page remains the strongest positive evidence on the same host, but it still only groups offices by broad regions and still does not map Alaska boroughs or census areas to those offices. The DFCS successor surfaces remain negative at the same time: \`https://dfcs.alaska.gov/Pages/Services.aspx\` still only provides statewide phone routing for Adult Public Assistance and Apply for Medicaid, \`https://dfcs.alaska.gov/Pages/Site-Map.aspx\` still only surfaces wrong-role OCS and Pioneer Homes branches, and \`https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx\` still exposes only general department-contact sections rather than any DPA/public-assistance office directory or borough/census-area assignment contract. Alaska therefore still lacks any public official borough- or census-area-to-office assignment surface that can satisfy county-equivalent local routing.`;
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
    '- The raw low-token lane still gets Cloudflare `Just a moment...` 403 shells on the health-host DPA landing page, exact DPA offices page, and both health-host PDFs.',
    '- The earlier reviewed browser lane still proves a real official DPA offices page exists, but that page is still only a regional office grouping and still does not assign boroughs or census areas.',
    '- The DFCS Services page still provides only statewide phone routing for Adult Public Assistance and Apply for Medicaid.',
    '- The DFCS Site Map still exposes only wrong-role local branches (`OCS Regional Offices` plus Alaska Pioneer Homes payment-assistance leaves), not a DPA county-equivalent contract.',
    '- The DFCS Department Contacts page still exposes no DPA/public-assistance office directory and no borough or census-area assignment text.',
    '- Alaska therefore still lacks any public official borough- or census-area office-routing contract on a reviewable surface.',
  ].join('\n') + '\n';
}

function replaceAllStateAlaskaNote(text) {
  const lines = text.split('\n').filter((line) => !line.startsWith('- Alaska county-local routing is still blocked'));
  lines.push('- Alaska county-local routing is still blocked: the raw low-token lane still gets Cloudflare `Just a moment...` 403 shells across the health-host DPA family, the earlier browser-reviewed DPA offices page still only groups regional offices without borough or census-area assignments, and DFCS Services, Site Map, and Department Contacts still add no county-equivalent public-assistance contract.');
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
  const nextBlockedStateNames = PRIORITY_ORDER
    .slice(PRIORITY_ORDER.indexOf('Alaska') + 1)
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
    '`county_local_disability_resources` is the only remaining Alaska critical blocker. One more bounded live check confirmed the health-host DPA family is still not reproducibly fetchable in the raw low-token lane: the exact DPA landing page, DPA offices page, DPA dashboard PDF, and Medicaid snapshot PDF all returned HTTP 403 Cloudflare challenge shells with the title "Just a moment...". The prior browser-reviewed lane still proves the official DPA offices page exists, but that page still only groups offices by broad regions and still does not map Alaska boroughs or census areas to those offices. The DFCS successor host remains public but still adds no county-equivalent contract: `Services.aspx` is still only statewide phone routing, the Site Map still surfaces only wrong-role OCS and Pioneer Homes branches, and the Commissioner Department Contacts page still exposes no DPA/public-assistance office directory or borough-assignment text. Alaska remains BLOCKED because there is still no public official borough- or census-area office assignment surface.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Alaska page, table, export, PDF, or API that explicitly maps boroughs or census areas to DPA office locations.',
    '- Any public detail surface on the Department of Health host that adds service-area or office-assignment geography beyond the regional office groupings now visible in reviewed rendering.',
    '- Any official DFCS or successor host page that publishes a DPA/public-assistance office directory with borough or census-area routing.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Alaska DPA landing page](https://health.alaska.gov/dpa)',
    '- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)',
    '- [Alaska DPA Dashboard PDF](https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf)',
    '- [Alaska Medicaid enrollment snapshot PDF](https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf)',
    '- [Alaska DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)',
    '- [Alaska DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)',
    '- [Alaska DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)',
    '',
    '## Next State Order After Alaska',
    '',
    ...nextBlockedStateNames.map((stateName, index) => `${index + 1}. ${stateName}`),
    '',
  ].join('\n');
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 345 Alaska Raw Challenge And DFCS Contacts Finality Report v1',
    '',
    '- State: Alaska',
    '- Classification: BLOCKED',
    '- Index safe: false',
    '- Focus family: county_local_disability_resources',
    '',
    '## What changed',
    '',
    '- Confirmed the raw low-token lane still receives HTTP 403 Cloudflare challenge shells on the Department of Health DPA landing page, DPA offices page, and the two health-host PDFs.',
    '- Confirmed the earlier browser-reviewed DPA offices page still does not expose borough or census-area assignments even though it proves the official page exists.',
    '- Added the public DFCS Department Contacts surface to the negative-evidence stack; it still does not expose a DPA/public-assistance office directory or county-equivalent assignment contract.',
    '',
    '## Result',
    '',
    '- Alaska remains BLOCKED.',
    '- No county-equivalent borough assignment contract is publicly reviewable on the official Alaska hosts checked in this pass.',
    '',
    '## Key probe statuses',
    '',
    `- health DPA landing raw status: ${batchSummary.dpa_landing_raw_status} (${batchSummary.dpa_landing_raw_title})`,
    `- health DPA offices raw status: ${batchSummary.dpa_offices_raw_status} (${batchSummary.dpa_offices_raw_title})`,
    `- DFCS Services status: ${batchSummary.dfcs_services_status}`,
    `- DFCS Site Map status: ${batchSummary.dfcs_site_map_status}`,
    `- DFCS Department Contacts status: ${batchSummary.dfcs_contacts_status}`,
    '',
  ].join('\n') + '\n';
}

export async function generateBatch345AlaskaRawChallengeAndDfcsContactsFinalityV1() {
  await generateBatch342AlaskaLiveDpaOfficesFinalityV1();

  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');

  const statusReason = buildStatusReason();
  const evidence = buildEvidence();

  summary.batch = BATCH_NAME;
  summary.primary_gap_reason = PRIMARY_GAP_REASON;
  summary.recommended_batch = HOLD_BATCH;
  summary.final_blockers = [{
    family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    evidence,
    next_action: NEXT_ACTION,
  }];

  for (const row of gapRows) {
    if (row.family === 'county_local_disability_resources') {
      row.family_status = FAMILY_STATUS;
      row.status_reason = statusReason;
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
    if (row.family !== 'county_local_disability_resources') {
      continue;
    }
    row.blocker_code = FAILURE_CODE;
    row.blocker_evidence = evidence;
    row.query_basis = 'Reviewed 2026-06-25 exact official Alaska health-host DPA URLs in the raw low-token lane, the previously recovered browser-reviewed DPA offices page, and the DFCS successor Services, Site Map, and Department Contacts surfaces.';
    replaceSample(row.samples, 'Alaska DPA offices raw challenge shell', {
      sample_name: 'Alaska DPA offices raw challenge shell',
      source_url: RAW_PROBE.dpaOffices.url,
      final_url: RAW_PROBE.dpaOffices.finalUrl,
      verification_status: 'blocked',
      source_type: 'official_health_host_challenge_shell',
      source_table: BATCH_NAME,
      fetched_at: RAW_PROBE.generatedAt,
      evidence_snippet: 'The raw low-token lane now returns HTTP 403 with the Cloudflare title "Just a moment..." on the exact DPA offices page.',
    });
    replaceSample(row.samples, 'Alaska DPA offices directory', {
      sample_name: 'Alaska DPA offices directory',
      source_url: RAW_PROBE.dpaOffices.url,
      final_url: RAW_PROBE.dpaOffices.finalUrl,
      verification_status: 'reviewed',
      source_type: 'browser_reviewed_official_region_only_directory_without_county_equivalent_assignments',
      source_table: BATCH_NAME,
      fetched_at: RAW_PROBE.generatedAt,
      evidence_snippet: 'The browser-reviewed DPA offices page proves regional offices, office hours, addresses, fax numbers, and virtual routing, but it still does not assign boroughs or census areas to those offices.',
    });
    replaceSample(row.samples, 'Alaska DFCS Services page', {
      sample_name: 'Alaska DFCS Services page',
      source_url: RAW_PROBE.dfcsServices.url,
      final_url: RAW_PROBE.dfcsServices.finalUrl,
      verification_status: 'reviewed',
      source_type: 'official_statewide_phone_only_relay_without_county_equivalent_assignments',
      source_table: BATCH_NAME,
      fetched_at: RAW_PROBE.generatedAt,
      evidence_snippet: 'The DFCS Services page still provides statewide phone routing for Adult Public Assistance and Apply for Medicaid, but no borough or census-area office assignment.',
    });
    replaceSample(row.samples, 'Alaska DFCS Department Contacts page', {
      sample_name: 'Alaska DFCS Department Contacts page',
      source_url: RAW_PROBE.dfcsContacts.url,
      final_url: RAW_PROBE.dfcsContacts.finalUrl,
      verification_status: 'reviewed',
      source_type: 'official_department_contacts_page_without_dpa_local_directory_contract',
      source_table: BATCH_NAME,
      fetched_at: RAW_PROBE.generatedAt,
      evidence_snippet: 'The public DFCS Department Contacts page exposes only general commissioner and department-contact sections and still provides no DPA/public-assistance office directory, borough map, or census-area assignment text.',
    });
    replaceSample(row.samples, 'Alaska DPA Dashboard PDF', {
      sample_name: 'Alaska DPA Dashboard PDF',
      source_url: RAW_PROBE.dpaDashboard.url,
      final_url: RAW_PROBE.dpaDashboard.finalUrl,
      verification_status: 'blocked',
      source_type: 'official_health_host_pdf_challenge_shell',
      source_table: BATCH_NAME,
      fetched_at: RAW_PROBE.generatedAt,
      evidence_snippet: 'The raw low-token lane now returns HTTP 403 with the Cloudflare title "Just a moment..." on the DPA dashboard PDF URL; the last reviewed browser evidence still only showed region aggregates, not borough assignments.',
    });
    replaceSample(row.samples, 'Alaska Medicaid enrollment snapshot PDF', {
      sample_name: 'Alaska Medicaid enrollment snapshot PDF',
      source_url: RAW_PROBE.medicaidSnapshot.url,
      final_url: RAW_PROBE.medicaidSnapshot.finalUrl,
      verification_status: 'blocked',
      source_type: 'official_health_host_pdf_challenge_shell',
      source_table: BATCH_NAME,
      fetched_at: RAW_PROBE.generatedAt,
      evidence_snippet: 'The raw low-token lane now returns HTTP 403 with the Cloudflare title "Just a moment..." on the Medicaid snapshot PDF URL; the last reviewed browser evidence still only showed region aggregates, not borough assignments.',
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
    generated_at: RAW_PROBE.generatedAt,
    state: 'alaska',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    dpa_landing_raw_status: RAW_PROBE.dpaLanding.status,
    dpa_landing_raw_title: RAW_PROBE.dpaLanding.title,
    dpa_offices_raw_status: RAW_PROBE.dpaOffices.status,
    dpa_offices_raw_title: RAW_PROBE.dpaOffices.title,
    dpa_dashboard_raw_status: RAW_PROBE.dpaDashboard.status,
    medicaid_snapshot_raw_status: RAW_PROBE.medicaidSnapshot.status,
    dfcs_services_status: RAW_PROBE.dfcsServices.status,
    dfcs_site_map_status: RAW_PROBE.dfcsSiteMap.status,
    dfcs_contacts_status: RAW_PROBE.dfcsContacts.status,
    browser_review_evidence_retained: true,
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
  const result = await generateBatch345AlaskaRawChallengeAndDfcsContactsFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
