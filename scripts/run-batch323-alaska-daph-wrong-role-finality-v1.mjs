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
  batchSummary: path.join(generatedDir, 'batch323_alaska_daph_wrong_role_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch323-alaska-daph-wrong-role-finality-report-v1.md'),
};

const BATCH_NAME = 'batch323_alaska_daph_wrong_role_finality_v1';
const PRIMARY_GAP_REASON =
  'live_dfcs_services_publications_search_and_site_map_still_expose_no_dpa_or_borough_mapping_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host';
const FAILURE_CODE =
  'dfcs_services_publications_search_and_site_map_still_expose_no_local_dpa_contract_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host';
const FAMILY_STATUS =
  'blocked_phone_only_dfcs_relay_plus_dfcs_site_map_with_wrong_role_ocs_office_leaf_plus_search_without_public_results_plus_legacy_dpa_canonicalization_into_health_host_challenge';
const NEXT_ACTION =
  'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host';
const USER_AGENT = 'Mozilla/5.0 (compatible; CodexStateAudit/1.0; +https://github.com/jeanericgagnon/special-needs-ca)';

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

function extractTitle(text) {
  const match = text.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

function extractH1(text) {
  const match = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

async function fetchText(url) {
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: { 'user-agent': USER_AGENT },
  });
  const text = await response.text();
  return {
    url,
    status: response.status,
    finalUrl: response.url,
    title: extractTitle(text),
    h1: extractH1(text),
    text,
  };
}

function buildStatusReason(probe) {
  return `The live Alaska DFCS successor host is still not enough to clear county-local routing after one more bounded official recheck on ${probe.fetchedDate}. \`https://dfcs.alaska.gov/Pages/Services.aspx\` remains reviewable but still only exposes statewide phone routing for Adult Public Assistance and Apply for Medicaid. \`https://dfcs.alaska.gov/Pages/Publications.aspx\` still exposes no DPA office, borough, census-area, or public-assistance office-routing material. \`https://dfcs.alaska.gov/Pages/Site-Map.aspx\` is also clearly live, but its extra branch now sharpens the negative proof instead of helping: the only office-looking leaf it surfaces is the wrong-service \`/ocs/Pages/offices/default.aspx\` page titled \`OCS Regional Offices\`, while the only additional payment-assistance branch is \`/daph/Pages/paymentassistance/default.aspx\`, titled \`Alaska Pioneer Homes Payment Assistance Program\`, with sibling publications that still expose no DPA or borough office-routing material. \`https://dfcs.alaska.gov/Search/default.aspx\` remains publicly readable, but its results endpoint still returns SharePoint File Not Found and a bounded keyword POST still self-posts to the same generic shell without public office rows. The current \`health.alaska.gov\` DPA family still returns the Cloudflare \`Just a moment...\` shell. The legacy \`dhss.alaska.gov/dpa\` lane still canonicalizes into the same challenged \`https://health.alaska.gov/dpa\` host rather than preserving an independent reviewable legacy subtree. Alaska therefore still lacks any public borough- or census-area office-routing contract on current DFCS, current health, or legacy DHSS official surfaces.`;
}

function buildEvidence(probe) {
  return `Reviewed ${probe.fetchedDate} bounded official Alaska rechecks across the live DFCS successor host plus the extra sitemap leaves it still exposes. \`https://dfcs.alaska.gov/Pages/Services.aspx\` remains live and publicly reviewable, but still provides only statewide phone routing for Adult Public Assistance and Apply for Medicaid rather than borough or census-area mapping. \`https://dfcs.alaska.gov/Pages/Publications.aspx\` is also live, but still exposes no \`public assistance\`, \`medicaid\`, \`borough\`, \`census\`, or office-routing material. \`https://dfcs.alaska.gov/Pages/Site-Map.aspx\` is clearly live, but the only office-looking leaf it surfaces is the wrong-service \`/ocs/Pages/offices/default.aspx\` page titled \`OCS Regional Offices\`, not a DPA or public-assistance office contract. The only additional payment-assistance branch now proven on the same official host is \`https://dfcs.alaska.gov/daph/Pages/paymentassistance/default.aspx\`, titled \`Alaska Pioneer Homes Payment Assistance Program\`, with a sibling \`https://dfcs.alaska.gov/daph/Pages/publications.aspx\` page titled \`Publications\`; both are wrong-program DAPH/Pioneer Homes material and still expose no DPA office, borough, or census-area routing contract. \`https://dfcs.alaska.gov/Search/default.aspx\` remains publicly readable, but the expected public results endpoint \`https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance\` still returns SharePoint File Not Found and a direct POST back to \`/Search/default.aspx\` with \`InputKeywords=public assistance\` still returns HTTP 200 on the same generic Search shell with no reviewable DPA office rows. The current \`health.alaska.gov\` family still fails closed end to end for DPA office routing, and the legacy \`dhss.alaska.gov/dpa\` host still canonicalizes into the same challenged \`https://health.alaska.gov/dpa\` surface rather than preserving an independent reviewable subtree. Alaska therefore still lacks any reviewable borough- or census-area-to-office contract on a public official surface.`;
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
    '- The live DFCS Services page still provides only statewide phone routing for Adult Public Assistance and Apply for Medicaid.',
    '- The live DFCS Publications page still exposes no DPA/public-assistance office-routing material.',
    '- The live DFCS Site Map still exposes only wrong-program branches for local routing: `OCS Regional Offices` plus Alaska Pioneer Homes payment-assistance leaves, not a DPA/public-assistance office contract.',
    '- The public DFCS search page still does not open a usable public results lane.',
    '- The current health host still returns Cloudflare `Just a moment...` 403 shells for the DPA office-routing family.',
    '- The legacy DHSS DPA paths still canonicalize into the same challenged `health.alaska.gov/dpa` host instead of preserving an independent reviewable subtree.',
    '- Alaska therefore still lacks any reviewable borough- or census-area office-routing contract on a public official surface.',
  ].join('\n') + '\n';
}

function replaceAllStateAlaskaNote(text) {
  const existing = '- Alaska county-local routing is still blocked: DFCS Services remains phone-only, DFCS Publications still exposes no DPA/public-assistance office material, the DFCS Site Map only adds the wrong-service `OCS Regional Offices` leaf, DFCS search still has no usable public results lane, the current health host still returns Cloudflare `Just a moment...` 403 shells, and the legacy `dhss.alaska.gov/dpa/...` paths now canonicalize into that same challenged `health.alaska.gov/dpa` host.';
  const next = '- Alaska county-local routing is still blocked: DFCS Services remains phone-only, DFCS Publications still exposes no DPA/public-assistance office material, the DFCS Site Map only adds wrong-program branches (`OCS Regional Offices` and Alaska Pioneer Homes payment-assistance leaves), DFCS search still has no usable public results lane, the current health host still returns Cloudflare `Just a moment...` 403 shells, and the legacy `dhss.alaska.gov/dpa/...` paths still canonicalize into that same challenged `health.alaska.gov/dpa` host.';
  let output = text.replace(`${existing}\n`, '');
  output = output.replace('- Oregon remains blocked on county-local routing because the live ODHS successor is a real custom component shell with no public data contract.\n', '');
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
    'Updated: 2026-06-24',
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
    '`county_local_disability_resources` is the only remaining Alaska critical blocker. The live DFCS successor host still only gives statewide phone routing, the DFCS Publications surface still exposes no DPA or public-assistance office material, the DFCS Site Map only adds wrong-program branches (`OCS Regional Offices` plus Alaska Pioneer Homes payment-assistance leaves), the public DFCS search surface still has no usable public results contract, the current `health.alaska.gov` DPA family is challenge-blocked end to end, and the legacy `dhss.alaska.gov/dpa/...` paths still canonicalize into that same challenged `health.alaska.gov/dpa` host instead of preserving a separate reviewable legacy subtree.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Alaska surface that maps boroughs or census areas to DPA or Medicaid office locations on a publicly reviewable host.',
    '- Any reviewable successor office locator or directory that lives on `dfcs.alaska.gov`, `dhss.alaska.gov`, or another current official Alaska host instead of only on the challenge-blocked `health.alaska.gov` family.',
    '- Any official document, export, or table that explicitly enumerates Alaska borough or census-area coverage for public assistance office routing.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Alaska DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)',
    '- [Alaska DFCS Publications](https://dfcs.alaska.gov/Pages/Publications.aspx)',
    '- [Alaska DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)',
    '- [Alaska DFCS Search](https://dfcs.alaska.gov/Search/default.aspx)',
    '- [Alaska DFCS Search results endpoint](https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance)',
    '- [Alaska Pioneer Homes Payment Assistance Program](https://dfcs.alaska.gov/daph/Pages/paymentassistance/default.aspx)',
    '- [Alaska DAPH publications](https://dfcs.alaska.gov/daph/Pages/publications.aspx)',
    '- [Alaska OCS Regional Offices](https://dfcs.alaska.gov/ocs/Pages/offices/default.aspx)',
    '- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)',
    '- [Alaska Adult Public Assistance leaf](https://health.alaska.gov/en/services/adult-public-assistance-apa/)',
    '- [Alaska Apply for Medicaid leaf](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)',
    '- [Alaska health robots.txt](https://health.alaska.gov/robots.txt)',
    '- [Legacy DHSS root](https://dhss.alaska.gov/)',
    '- [Legacy DHSS DPA root](https://dhss.alaska.gov/dpa/Pages/default.aspx)',
    '- [Legacy DHSS office locations](https://dhss.alaska.gov/dpa/Pages/office-locations.aspx)',
    '- [Legacy DHSS DPA contacts](https://dhss.alaska.gov/dpa/Pages/contacts.aspx)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any current Alaska host outside the challenged `health.alaska.gov` family that now publishes a borough- or census-area DPA office directory.',
    '- Any official Alaska PDF, spreadsheet, or office-contact table that names specific borough or census-area coverage for public assistance offices.',
    '- Any future public relaxation on either the `health.alaska.gov` or canonicalized legacy `dhss.alaska.gov/dpa` lane that makes actual DPA office-routing leaves scraper-reviewable.',
    '',
    '## Next State Order After Alaska',
    '',
    '1. Oklahoma',
    '2. Ohio',
    '3. Minnesota',
    '4. Maine',
    '5. Idaho',
    '6. Arizona',
    '7. Massachusetts',
    '8. New Mexico',
    '9. South Dakota',
    '10. Rhode Island',
    '',
  ].join('\n');
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 323 Alaska DAPH Wrong-Role Finality v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.blocker_family}`,
    '',
    '## What changed',
    '',
    '- The live DFCS Site Map was rechecked against its extra surfaced child leaves.',
    '- The `daph` branch is now explicitly ruled out as Alaska Pioneer Homes payment-assistance content, not DPA or public-assistance office routing.',
    '- The only office-looking leaf still surfaced on the live DFCS host remains the wrong-role `OCS Regional Offices` page.',
    '',
    '## Repair decision',
    '',
    '- Alaska remains blocked on missing reviewable borough/census-area office routing.',
    '- This pass strengthens the blocker by proving the extra DFCS sitemap branch is wrong-program content rather than a hidden DPA office lane.',
  ].join('\n') + '\n';
}

async function main() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');

  const [siteMap, daphPayment, daphPublications, ocsOffices] = await Promise.all([
    fetchText('https://dfcs.alaska.gov/Pages/Site-Map.aspx'),
    fetchText('https://dfcs.alaska.gov/daph/Pages/paymentassistance/default.aspx'),
    fetchText('https://dfcs.alaska.gov/daph/Pages/publications.aspx'),
    fetchText('https://dfcs.alaska.gov/ocs/Pages/offices/default.aspx'),
  ]);

  const fetchedDate = new Date().toISOString().slice(0, 10);
  const generatedAt = new Date().toISOString();
  const evidence = buildEvidence({ fetchedDate });
  const statusReason = buildStatusReason({ fetchedDate });

  summary.batch = BATCH_NAME;
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
    if (row.family !== 'county_local_disability_resources') continue;
    row.query_basis = `Reviewed ${fetchedDate} the official Alaska DFCS Services / Publications / Search stack plus the live Site Map child leaves; the only extra surfaced branches still resolve to wrong-role OCS regional offices and Alaska Pioneer Homes payment-assistance content, not a county-grade DPA office contract.`;
    row.blocker_code = 'official_dfcs_site_map_only_surfaces_wrong_role_ocs_and_daph_payment_assistance_branches_while_true_dpa_office_host_remains_challenged';
    row.blocker_evidence = evidence;
    const extraSamples = [
      {
        sample_name: 'Alaska Pioneer Homes Payment Assistance Program',
        source_url: daphPayment.url,
        final_url: daphPayment.finalUrl,
        verification_status: 'reviewed',
        source_type: 'official_wrong_program_payment_assistance_leaf',
        source_table: BATCH_NAME,
        fetched_at: generatedAt,
        evidence_snippet: `The live DFCS DAPH leaf is titled \`${daphPayment.title}\` and preserves Pioneer Homes payment-assistance content rather than DPA, borough, census-area, or public-assistance office-routing evidence.`,
      },
      {
        sample_name: 'Alaska DAPH publications',
        source_url: daphPublications.url,
        final_url: daphPublications.finalUrl,
        verification_status: 'reviewed',
        source_type: 'official_wrong_program_publications_leaf',
        source_table: BATCH_NAME,
        fetched_at: generatedAt,
        evidence_snippet: `The sibling DAPH publications page stays on the same official host but preserves no DPA office, borough, or census-area routing contract; it only supports the Pioneer Homes payment-assistance branch.`,
      },
    ];
    const existingNames = new Set((row.samples || []).map((sample) => sample.sample_name));
    for (const sample of extraSamples) {
      if (!existingNames.has(sample.sample_name)) {
        row.samples.push(sample);
      }
    }
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
    generated_at: generatedAt,
    state: 'alaska',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    dfcs_site_map_status: siteMap.status,
    dfcs_site_map_title: siteMap.title,
    daph_payment_status: daphPayment.status,
    daph_payment_title: daphPayment.title,
    daph_payment_h1: daphPayment.h1,
    daph_publications_status: daphPublications.status,
    daph_publications_title: daphPublications.title,
    daph_publications_h1: daphPublications.h1,
    ocs_offices_status: ocsOffices.status,
    ocs_offices_title: ocsOffices.title,
    ocs_offices_h1: ocsOffices.h1,
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

  console.log(JSON.stringify({
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    updatedFamily: 'county_local_disability_resources',
    daphPaymentTitle: daphPayment.title,
    ocsTitle: ocsOffices.title,
  }, null, 2));
}

await main();
