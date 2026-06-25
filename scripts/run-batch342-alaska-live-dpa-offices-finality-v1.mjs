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
  stateLessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch342_alaska_live_dpa_offices_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch342-alaska-live-dpa-offices-finality-report-v1.md'),
};

const BATCH_NAME = 'batch342_alaska_live_dpa_offices_finality_v1';
const PRIMARY_GAP_REASON =
  'reviewed_live_dpa_offices_page_now_public_but_only_groups_regional_offices_without_borough_or_census_area_assignment_while_dfcs_surfaces_add_no_local_mapping_contract';
const FAILURE_CODE =
  'reviewed_live_dpa_offices_page_lists_regional_offices_and_locations_but_still_no_borough_or_census_area_assignment_contract';
const FAMILY_STATUS =
  'blocked_reviewed_live_dpa_offices_page_lists_regional_offices_but_no_borough_or_census_area_assignments_and_dfcs_surfaces_add_no_local_mapping_contract';
const NEXT_ACTION =
  'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_or_export';

const REVIEWED_PROBE = {
  fetchedDate: '2026-06-25',
  generatedAt: new Date().toISOString(),
  dpaLanding: {
    url: 'https://health.alaska.gov/dpa',
    finalUrl: 'https://health.alaska.gov/en/division-of-public-assistance/',
    reviewStatus: 200,
    title: 'Division of Public Assistance | State of Alaska | Department of Health',
    h1: 'Division of Public Assistance (DPA)',
  },
  dpaOffices: {
    url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
    finalUrl: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
    reviewStatus: 200,
    title: 'Division of Public Assistance (DPA) Offices | State of Alaska | Department of Health',
    h1: 'Division of Public Assistance (DPA) Offices',
  },
  dfcsServices: {
    url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
    finalUrl: 'https://dfcs.alaska.gov/Pages/Services.aspx',
    reviewStatus: 200,
  },
  dfcsPublications: {
    url: 'https://dfcs.alaska.gov/Pages/Publications.aspx',
    finalUrl: 'https://dfcs.alaska.gov/Pages/Publications.aspx',
    reviewStatus: 200,
  },
  dfcsSiteMap: {
    url: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
    finalUrl: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
    reviewStatus: 200,
  },
  dpaDashboard: {
    url: 'https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf',
    finalUrl: 'https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf',
    reviewStatus: 200,
  },
  medicaidSnapshot: {
    url: 'https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf',
    finalUrl: 'https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf',
    reviewStatus: 200,
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

function buildStatusReason(probe) {
  return `The live Alaska county-local blocker changed after one more bounded official recheck on ${probe.fetchedDate}. In the reviewed browser lane, the current Department of Health DPA landing page at \`https://health.alaska.gov/dpa\` is now publicly reviewable, and the exact DPA offices page at \`https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/\` is also browser-readable. That offices page truthfully proves regional offices, office hours, addresses, fax numbers, virtual contact-center routing, and secure upload options on the official health host. But it still only groups offices by broad regions like Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, and Southwest Alaska. It still does not assign boroughs or census areas to those offices, and the reviewed page still exposes no borough, census-area, or county-equivalent contract anywhere on the page. The official DPA dashboard PDF and Medicaid snapshot PDF stay region-only too: they publish aggregate regions such as Anchorage/Mat-Su, Gulf Coast, Interior, Northern, Southeast, Southwest, Anchorage, and Mat-Su, but still do not map boroughs or census areas to office assignments. The DFCS successor surfaces remain negative: \`Services.aspx\` still exposes only statewide phone routing, \`Publications.aspx\` still exposes no DPA office material, the Site Map still only adds wrong-role OCS and Pioneer Homes branches, and the public search surface still has no usable results lane. Alaska therefore remains blocked because the official DPA offices page is now reviewable but still lacks borough- or census-area office assignment proof.`;
}

function buildEvidence(probe) {
  return `Reviewed ${probe.fetchedDate} official Alaska surfaces across the Department of Health DPA host plus the DFCS successor host. In the reviewed browser lane, \`https://health.alaska.gov/dpa\` now renders a live official DPA landing page and links directly to \`https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/\`, which is now publicly reviewable instead of being only a stale challenge assumption. The exact DPA offices page preserves explicit regional-office groupings, named offices, office hours, full street addresses, fax numbers, a virtual contact center, and secure document upload routing on the official health host. But the page still only groups offices by broad regions and still does not map Alaska boroughs or census areas to those offices. The reviewed page still exposes no reviewable borough or census-area assignment contract. The same host's public data reports stay region-only: \`https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf\` reports recipients by broad regions such as Anchorage/Mat-Su, Gulf Coast, Interior, Northern, Southeast, and Southwest, while \`https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf\` reports Medicaid enrollees by regions such as Northern, Southwest, Interior, Mat-Su, Anchorage, Gulf Coast, and Southeast. Neither PDF assigns boroughs or census areas to DPA offices. The DFCS successor surfaces remain negative at the same time: \`https://dfcs.alaska.gov/Pages/Services.aspx\` still provides only statewide phone routing for Adult Public Assistance and Apply for Medicaid, \`https://dfcs.alaska.gov/Pages/Publications.aspx\` still exposes no DPA office-routing material, \`https://dfcs.alaska.gov/Pages/Site-Map.aspx\` still only surfaces wrong-role OCS offices plus Pioneer Homes payment-assistance branches, and \`https://dfcs.alaska.gov/Search/default.aspx\` still has no usable public results contract. Alaska therefore still lacks any reviewable borough- or census-area-to-office assignment on a public official surface even though the DPA offices page itself is now browser-readable.`;
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
    '- The current Department of Health DPA landing page is now publicly readable in the reviewed browser lane.',
    '- The exact DPA offices page is also browser-readable and preserves regional offices, office hours, addresses, fax numbers, virtual contact-center routing, and secure upload options.',
    '- That same official DPA offices page still does not map boroughs or census areas to those offices, so it still does not create a county-equivalent routing contract.',
    '- The DFCS Services page still provides only statewide phone routing for Adult Public Assistance and Apply for Medicaid.',
    '- The DFCS Publications page still exposes no DPA/public-assistance office-routing material.',
    '- The DFCS Site Map still exposes only wrong-program branches for local routing: `OCS Regional Offices` plus Alaska Pioneer Homes payment-assistance leaves, not a borough/census-area DPA office contract.',
    '- Alaska therefore still lacks any reviewable borough- or census-area office-routing contract on a public official surface.',
  ].join('\n') + '\n';
}

function replaceAllStateAlaskaNote(text) {
  const priorPatterns = [
    '- Alaska county-local routing is still blocked: DFCS Services remains phone-only, DFCS Publications still exposes no DPA/public-assistance office material, the DFCS Site Map only adds wrong-program branches (`OCS Regional Offices` and Alaska Pioneer Homes payment-assistance leaves), DFCS search still has no usable public results lane, the current health host still returns Cloudflare `Just a moment...` 403 shells, and the legacy `dhss.alaska.gov/dpa/...` paths still canonicalize into that same challenged `health.alaska.gov/dpa` host.',
    '- Alaska county-local routing is still blocked: DFCS Services remains phone-only, DFCS Publications still exposes no DPA/public-assistance office material, the DFCS Site Map only adds the wrong-service `OCS Regional Offices` leaf, DFCS search still has no usable public results lane, the current health host still returns Cloudflare `Just a moment...` 403 shells, and the legacy `dhss.alaska.gov/dpa/...` paths now canonicalize into that same challenged `health.alaska.gov/dpa` host.',
    '- Alaska county-local routing is still blocked, but the blocker sharpened: the official DPA landing page and exact DPA offices page are now live on `health.alaska.gov`, yet the offices page still groups only regional offices and addresses without any borough- or census-area assignment contract, while DFCS successor pages still add no county-equivalent mapping.',
    '- Alaska county-local routing is still blocked, and the live contract regressed again: the health.alaska.gov DPA family now returns raw 403s and browser `Just a moment...` challenge shells, while the still-readable DFCS successor pages still add no borough- or census-area assignment contract.',
  ];
  let output = text;
  for (const line of priorPatterns) {
    output = output.replace(`${line}\n`, '');
  }
  const next = '- Alaska county-local routing is still blocked, but the blocker sharpened: the official DPA landing page and exact DPA offices page are now browser-readable on `health.alaska.gov`, yet the offices page still groups only regional offices and addresses without any borough- or census-area assignment contract, while DFCS successor pages still add no county-equivalent mapping.';
  if (!output.includes(next)) {
    output = `${output.trimEnd()}\n${next}\n`;
  }
  return output;
}

function buildHandoff(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));

  return [
    '# Gemini Source Scout Handoff',
    '',
    'Updated: 2026-06-25',
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
    '`county_local_disability_resources` is the only remaining Alaska critical blocker. The official Department of Health DPA host is no longer only a stale challenge assumption: in the reviewed browser lane, `https://health.alaska.gov/dpa` now renders a live DPA landing page, and the exact DPA offices page at `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/` is also publicly reviewable. That page now truthfully proves regional offices, office hours, addresses, fax numbers, virtual contact-center routing, and secure upload options on the official host. But it still only groups offices by broad regions and still does not map Alaska boroughs or census areas to those offices. The public DPA dashboard and Medicaid snapshot PDFs are also live, but they only publish region aggregates like Anchorage/Mat-Su, Gulf Coast, Interior, Northern, Southeast, Southwest, Anchorage, and Mat-Su rather than office-assignment geography. The DFCS successor surfaces still add no county-equivalent contract: `Services.aspx` remains phone-only, `Publications.aspx` still exposes no office-routing material, the Site Map still only surfaces wrong-role OCS and Pioneer Homes branches, and public DFCS search still materializes no usable results. Alaska remains BLOCKED because the live DPA offices page still lacks borough- or census-area assignment proof.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Alaska page, table, PDF, export, or API that explicitly maps boroughs or census areas to DPA office locations.',
    '- Any public detail surface on the current Department of Health DPA host that adds service-area or region-to-borough assignment beyond the regional office groupings now visible.',
    '- Any official borough/census-area office-routing contract on DFCS, Health, or a canonical Alaska successor host that is publicly reviewable without inference.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Alaska DPA landing page](https://health.alaska.gov/dpa)',
    '- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)',
    '- [Alaska DPA Dashboard PDF](https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf)',
    '- [Alaska Medicaid enrollment snapshot PDF](https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf)',
    '- [Alaska DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)',
    '- [Alaska DFCS Publications](https://dfcs.alaska.gov/Pages/Publications.aspx)',
    '- [Alaska DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)',
    '- [Alaska DFCS Search](https://dfcs.alaska.gov/Search/default.aspx)',
    '- [Alaska DFCS Search results endpoint](https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance)',
    '- [Alaska Pioneer Homes Payment Assistance Program](https://dfcs.alaska.gov/daph/Pages/paymentassistance/default.aspx)',
    '- [Alaska DAPH publications](https://dfcs.alaska.gov/daph/Pages/publications.aspx)',
    '- [Alaska OCS Regional Offices](https://dfcs.alaska.gov/ocs/Pages/offices/default.aspx)',
    '- [Legacy DHSS DPA root](https://dhss.alaska.gov/dpa/Pages/default.aspx)',
    '- [Legacy DHSS office locations](https://dhss.alaska.gov/dpa/Pages/office-locations.aspx)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any current Alaska public page or download that ties named boroughs or census areas to the now-live DPA office locations page.',
    '- Any embedded data source, downloadable attachment, or companion offices table on the live DPA offices page that exposes service areas.',
    '- Any future public Alaska office-routing export on the DPA or DFCS host that materializes county-equivalent assignments instead of only region labels.',
    '',
    '## Next State Order After Alaska',
    '',
    '1. Oklahoma',
    '2. Minnesota',
    '3. Maine',
    '4. Idaho',
    '5. Arizona',
    '6. Massachusetts',
    '7. New Mexico',
    '8. South Dakota',
    '9. Rhode Island',
    '10. Virginia',
    '',
  ].join('\n');
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 342 Alaska Live DPA Offices Finality v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.blocker_family}`,
    '',
    '## What changed',
    '',
    '- The official Department of Health DPA landing page is now publicly readable in the reviewed browser lane.',
    '- The exact DPA offices page is now browser-readable and preserves regional offices, addresses, hours, virtual contact routing, and secure upload options.',
    '- Alaska remains blocked because the offices page still does not assign boroughs or census areas to those offices.',
    '',
    '## Repair decision',
    '',
    '- Alaska remains blocked on missing borough/census-area office assignment.',
    '- This pass retires the stale “host fully challenged” assumption and replaces it with the stricter truth that the offices page is reviewable but still not county-equivalent complete.',
  ].join('\n') + '\n';
}

function updateLessons(text) {
  const lesson = '### A Recovered Official Office Page Still Needs County-Equivalent Assignment\n*   **Lesson:** If an official state office directory becomes browser-readable again but only lists office locations by broad region, do not clear county-local routing until the page or a companion artifact explicitly maps county-equivalent geographies to those offices. Alaska DPA offices recovered on `health.alaska.gov`, but the live page still grouped offices only by region and never assigned boroughs or census areas.';
  if (text.includes(lesson)) return text;
  return `${text.trimEnd()}\n\n${lesson}\n`;
}

export async function generateBatch342AlaskaLiveDpaOfficesFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const stateLessons = fs.readFileSync(INPUTS.stateLessons, 'utf8');

  const evidence = buildEvidence(REVIEWED_PROBE);
  const statusReason = buildStatusReason(REVIEWED_PROBE);

  summary.batch = BATCH_NAME;
  summary.primary_gap_reason = PRIMARY_GAP_REASON;
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
    row.query_basis = `Reviewed ${REVIEWED_PROBE.fetchedDate} the live official Alaska DPA landing page, the now-public DPA offices directory, and the public DPA dashboard / Medicaid snapshot PDFs in the browser-readable lane, then rechecked DFCS Services / Publications / Site Map as negative sibling surfaces.`;
    row.blocker_code = FAILURE_CODE;
    row.blocker_evidence = evidence;
    row.status_reason = statusReason;
    replaceSample(row.samples, 'Alaska DPA offices directory', {
      sample_name: 'Alaska DPA offices directory',
      source_url: REVIEWED_PROBE.dpaOffices.url,
      final_url: REVIEWED_PROBE.dpaOffices.finalUrl,
      verification_status: 'reviewed',
      source_type: 'reviewed_browser_readable_official_offices_directory_without_county_equivalent_assignments',
      source_table: BATCH_NAME,
      fetched_at: REVIEWED_PROBE.generatedAt,
      evidence_snippet: 'The live DPA offices page now preserves regional offices, office hours, addresses, fax numbers, and virtual contact routing on the official health host, but it still does not assign boroughs or census areas to those offices.',
    });
    replaceSample(row.samples, 'Adult Public Assistance leaf target', {
      sample_name: 'Adult Public Assistance leaf target',
      source_url: REVIEWED_PROBE.dpaLanding.url,
      final_url: REVIEWED_PROBE.dpaLanding.finalUrl,
      verification_status: 'reviewed',
      source_type: 'reviewed_browser_readable_official_dpa_landing_page_without_local_assignment_contract',
      source_table: BATCH_NAME,
      fetched_at: REVIEWED_PROBE.generatedAt,
      evidence_snippet: 'The live DPA landing page is now publicly readable and explicitly links the DPA offices directory, Alaska Connect, and program routes, but it still does not provide borough- or census-area office assignment proof.',
    });
    replaceSample(row.samples, 'Alaska DFCS Services', {
      sample_name: 'Alaska DFCS Services',
      source_url: REVIEWED_PROBE.dfcsServices.url,
      final_url: REVIEWED_PROBE.dfcsServices.finalUrl,
      verification_status: 'reviewed',
      source_type: 'official_services_hub_with_statewide_phone_relay',
      source_table: BATCH_NAME,
      fetched_at: REVIEWED_PROBE.generatedAt,
      evidence_snippet: 'The live DFCS Services page still lists Adult Public Assistance and Apply for Medicaid with statewide phone routing only, not borough or census-area office assignments.',
    });
    replaceSample(row.samples, 'Alaska DFCS Publications no DPA office material', {
      sample_name: 'Alaska DFCS Publications no DPA office material',
      source_url: REVIEWED_PROBE.dfcsPublications.url,
      final_url: REVIEWED_PROBE.dfcsPublications.finalUrl,
      verification_status: 'reviewed',
      source_type: 'official_publications_without_public_assistance_office_contract',
      source_table: BATCH_NAME,
      fetched_at: REVIEWED_PROBE.generatedAt,
      evidence_snippet: 'The live DFCS Publications page remains public but still materializes no DPA office list, borough terms, census-area terms, or office-routing document links.',
    });
    replaceSample(row.samples, 'Alaska DFCS Site Map', {
      sample_name: 'Alaska DFCS Site Map',
      source_url: REVIEWED_PROBE.dfcsSiteMap.url,
      final_url: REVIEWED_PROBE.dfcsSiteMap.finalUrl,
      verification_status: 'reviewed',
      source_type: 'official_site_map_without_dpa_office_assignments',
      source_table: BATCH_NAME,
      fetched_at: REVIEWED_PROBE.generatedAt,
      evidence_snippet: 'The live DFCS Site Map remains reviewable, but it still adds only wrong-role branches like OCS offices and Pioneer Homes payment assistance rather than borough/census-area DPA office routing.',
    });
    replaceSample(row.samples, 'Alaska DPA Dashboard PDF', {
      sample_name: 'Alaska DPA Dashboard PDF',
      source_url: REVIEWED_PROBE.dpaDashboard.url,
      final_url: REVIEWED_PROBE.dpaDashboard.finalUrl,
      verification_status: 'reviewed',
      source_type: 'official_region_only_dashboard_without_county_equivalent_assignments',
      source_table: BATCH_NAME,
      fetched_at: REVIEWED_PROBE.generatedAt,
      evidence_snippet: 'The official DPA dashboard PDF is public, but it reports only broad regions such as Anchorage/Mat-Su, Gulf Coast, Interior, Northern, Southeast, and Southwest rather than borough- or census-area office assignments.',
    });
    replaceSample(row.samples, 'Alaska Medicaid enrollment snapshot PDF', {
      sample_name: 'Alaska Medicaid enrollment snapshot PDF',
      source_url: REVIEWED_PROBE.medicaidSnapshot.url,
      final_url: REVIEWED_PROBE.medicaidSnapshot.finalUrl,
      verification_status: 'reviewed',
      source_type: 'official_region_only_medicaid_dashboard_without_county_equivalent_assignments',
      source_table: BATCH_NAME,
      fetched_at: REVIEWED_PROBE.generatedAt,
      evidence_snippet: 'The official Medicaid snapshot PDF is public, but it reports regional Medicaid counts like Northern, Southwest, Interior, Mat-Su, Anchorage, Gulf Coast, and Southeast rather than borough- or census-area office assignments.',
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
  alaskaAudit.familyStatuses.county_local_disability_resources = FAMILY_STATUS;

  const alaskaQueue = allStateQueue.find((row) => row.state === 'alaska');
  alaskaQueue.primary_gap_reason = PRIMARY_GAP_REASON;

  const batchSummary = {
    batch: BATCH_NAME,
    generated_at: REVIEWED_PROBE.generatedAt,
    state: 'alaska',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    dpa_landing_review_status: REVIEWED_PROBE.dpaLanding.reviewStatus,
    dpa_landing_title: REVIEWED_PROBE.dpaLanding.title,
    dpa_offices_review_status: REVIEWED_PROBE.dpaOffices.reviewStatus,
    dpa_offices_title: REVIEWED_PROBE.dpaOffices.title,
    dpa_offices_h1: REVIEWED_PROBE.dpaOffices.h1,
    dfcs_services_review_status: REVIEWED_PROBE.dfcsServices.reviewStatus,
    dfcs_publications_review_status: REVIEWED_PROBE.dfcsPublications.reviewStatus,
    dfcs_site_map_review_status: REVIEWED_PROBE.dfcsSiteMap.reviewStatus,
    dpa_dashboard_review_status: REVIEWED_PROBE.dpaDashboard.reviewStatus,
    medicaid_snapshot_review_status: REVIEWED_PROBE.medicaidSnapshot.reviewStatus,
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
  fs.writeFileSync(INPUTS.stateLessons, updateLessons(stateLessons));
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await generateBatch342AlaskaLiveDpaOfficesFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
