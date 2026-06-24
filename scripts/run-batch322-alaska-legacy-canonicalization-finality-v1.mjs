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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch322_alaska_legacy_canonicalization_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch322-alaska-legacy-canonicalization-finality-report-v1.md'),
};

const BATCH_NAME = 'batch322_alaska_legacy_canonicalization_finality_v1';
const PRIMARY_GAP_REASON =
  'live_dfcs_services_publications_search_and_site_map_still_expose_no_dpa_or_borough_mapping_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host';
const FAILURE_CODE =
  'dfcs_services_publications_search_and_site_map_still_expose_no_local_dpa_contract_and_only_surface_wrong_role_ocs_offices_while_legacy_dhss_dpa_paths_now_canonicalize_into_same_challenged_health_host';
const FAMILY_STATUS =
  'blocked_phone_only_dfcs_relay_plus_dfcs_site_map_with_wrong_role_ocs_office_leaf_plus_search_without_public_results_plus_legacy_dpa_canonicalization_into_health_host_challenge';
const NEXT_ACTION =
  'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host';
const LESSON_HEADING = '### Legacy Subtrees That Canonicalize Into The Same Challenge Shell Do Not Create A Second Lane';
const LESSON_BODY = '*   **Lesson:** If legacy agency program paths now canonicalize into the same challenged successor host, collapse them into one blocker instead of treating the legacy subtree as a separate reviewable lane. Alaska `dhss.alaska.gov/dpa/...` now lands on `health.alaska.gov/dpa` and still returns the same Cloudflare shell, so the legacy host no longer preserves an independent office-routing contract.';

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

async function fetchTarget(url, options = {}) {
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'user-agent': USER_AGENT,
      ...(options.headers || {}),
    },
    body: options.body,
    redirect: 'follow',
  });
  const text = await response.text();
  return {
    url,
    status: response.status,
    finalUrl: response.url,
    contentType: response.headers.get('content-type') || '',
    text,
  };
}

function lowerIncludes(text, needle) {
  return text.toLowerCase().includes(needle.toLowerCase());
}

function addLesson(text) {
  if (text.includes(LESSON_HEADING)) return text;
  return `${text.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`;
}

function buildStatusReason(probe) {
  return `The live Alaska DFCS successor host is still not enough to clear county-local routing after one more bounded official recheck on ${probe.fetchedDate}. \`https://dfcs.alaska.gov/Pages/Services.aspx\` remains reviewable but still only exposes statewide phone routing for Adult Public Assistance and Apply for Medicaid. \`https://dfcs.alaska.gov/Pages/Publications.aspx\` still exposes no DPA office, borough, census-area, or public-assistance office-routing material. \`https://dfcs.alaska.gov/Pages/Site-Map.aspx\` is now also clearly live, but the only office-looking leaf it surfaces is the wrong-service \`/ocs/Pages/offices/default.aspx\` page titled \`OCS Regional Offices\`, not a DPA or public-assistance office contract. \`https://dfcs.alaska.gov/Search/default.aspx\` remains publicly readable, but its results endpoint still returns SharePoint File Not Found and a bounded keyword POST still self-posts to the same generic shell without public office rows. The current \`health.alaska.gov\` DPA family still returns the Cloudflare \`Just a moment...\` shell. The legacy \`dhss.alaska.gov/dpa\` lane is now sharper too: exact DPA root, office, contacts, and publications paths all canonicalize into the same challenged \`https://health.alaska.gov/dpa\` host rather than preserving an independent reviewable legacy subtree. Alaska therefore still lacks any public borough- or census-area office-routing contract on current DFCS, current health, or legacy DHSS official surfaces.`;
}

function buildEvidence(probe) {
  return `Reviewed ${probe.fetchedDate} bounded official Alaska rechecks across the live DFCS successor host, the DFCS Publications / Site Map / Search surfaces, the current \`health.alaska.gov\` family, and the legacy \`dhss.alaska.gov\` DPA subtree. \`https://dfcs.alaska.gov/Pages/Services.aspx\` remains live and publicly reviewable, but still provides only statewide phone routing for Adult Public Assistance and Apply for Medicaid rather than borough or census-area mapping. \`https://dfcs.alaska.gov/Pages/Publications.aspx\` is also live, but still exposes no \`public assistance\`, \`medicaid\`, \`borough\`, \`census\`, or office-routing material. \`https://dfcs.alaska.gov/Pages/Site-Map.aspx\` is now also clearly live, but the only office-looking leaf it surfaces is the wrong-service \`/ocs/Pages/offices/default.aspx\` page titled \`OCS Regional Offices\`, not a DPA or public-assistance office contract. \`https://dfcs.alaska.gov/Search/default.aspx\` remains publicly readable, but the expected public results endpoint \`https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance\` still returns SharePoint File Not Found and a direct POST back to \`/Search/default.aspx\` with \`InputKeywords=public assistance\` still returns HTTP 200 on the same generic Search shell with no reviewable DPA office rows. The current \`health.alaska.gov\` family still fails closed end to end: exact office and service leaves such as \`/en/resources/division-of-public-assistance-dpa-offices/\`, \`/en/services/adult-public-assistance-apa/\`, and \`/en/services/division-of-public-assistance-services/apply-for-medicaid/\` return HTTP 403 Cloudflare \`Just a moment...\` shells, and the same 403 applies to \`robots.txt\`. The legacy \`dhss.alaska.gov\` host is no longer even a distinct subtree lane for DPA routing: \`https://dhss.alaska.gov/dpa/Pages/default.aspx\`, \`/office-locations.aspx\`, \`/contacts.aspx\`, and \`/Publications.aspx\` now all canonically land on \`https://health.alaska.gov/dpa\` and still return the same Cloudflare challenge shell, while only the legacy root and \`robots.txt\` remain separately public. Alaska therefore still lacks any reviewable borough- or census-area-to-office contract on a public official surface.`;
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
    '- The live DFCS Site Map now clearly exposes only the wrong-service `OCS Regional Offices` leaf rather than a DPA/public-assistance office-routing leaf.',
    '- The public DFCS search page still does not open a usable public results lane.',
    '- The current health host still returns Cloudflare `Just a moment...` 403 shells for the DPA office-routing family.',
    '- The legacy DHSS DPA paths now canonicalize into the same challenged `health.alaska.gov/dpa` host instead of preserving an independent reviewable subtree.',
    '- Alaska therefore still lacks any reviewable borough- or census-area office-routing contract on a public official surface.',
  ].join('\n') + '\n';
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
    '`county_local_disability_resources` is the only remaining Alaska critical blocker. The live DFCS successor host still only gives statewide phone routing, the DFCS Publications surface still exposes no DPA or public-assistance office material, the DFCS Site Map only adds the wrong-service `OCS Regional Offices` leaf, the public DFCS search surface still has no usable public results contract, the current `health.alaska.gov` DPA family is challenge-blocked end to end, and the legacy `dhss.alaska.gov/dpa/...` paths now canonicalize into that same challenged `health.alaska.gov/dpa` host instead of preserving a separate reviewable legacy subtree.',
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
    '- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)',
    '- [Alaska Adult Public Assistance leaf](https://health.alaska.gov/en/services/adult-public-assistance-apa/)',
    '- [Alaska Apply for Medicaid leaf](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)',
    '- [Alaska health robots.txt](https://health.alaska.gov/robots.txt)',
    '- [Legacy DHSS root](https://dhss.alaska.gov/)',
    '- [Legacy DHSS robots.txt](https://dhss.alaska.gov/robots.txt)',
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
    '1. New York',
    '2. Oklahoma',
    '3. Oregon',
    '4. Ohio',
    '5. Minnesota',
    '6. Maine',
    '7. Idaho',
    '8. Arizona',
    '9. Massachusetts',
    '10. New Mexico',
    '',
  ].join('\n');
}

function replaceAlaskaAllStateNote(text) {
  const priorNotes = [
    '- Alaska county-local routing is still blocked: DFCS Services remains phone-only, DFCS Publications still exposes no DPA/public-assistance office material, DFCS search result URLs still fall into SharePoint PageNotFound shells, the search POST still self-posts without office rows, `my.alaska.gov` still 403s, `alaska.gov/search` still 404s, the health host still returns Cloudflare `Just a moment...` 403 shells, and the partially live legacy DHSS root still cannot reopen the DPA subtree.',
  ];
  let next = text;
  for (const note of priorNotes) {
    next = next.replace(`${note}\n`, '');
  }
  const replacement = '- Alaska county-local routing is still blocked: DFCS Services remains phone-only, DFCS Publications still exposes no DPA/public-assistance office material, the DFCS Site Map only adds the wrong-service `OCS Regional Offices` leaf, DFCS search still has no usable public results lane, the current health host still returns Cloudflare `Just a moment...` 403 shells, and the legacy `dhss.alaska.gov/dpa/...` paths now canonicalize into that same challenged `health.alaska.gov/dpa` host.';
  if (!next.includes(replacement)) {
    next = `${next.trimEnd()}\n${replacement}\n`;
  }
  return next;
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 322 Alaska Legacy Canonicalization Finality v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.blocker_family}`,
    '',
    '## What changed',
    '',
    '- The DFCS Site Map is now explicitly confirmed live, but the only office-looking leaf it adds is the wrong-service `OCS Regional Offices` page.',
    '- The legacy `dhss.alaska.gov/dpa/...` paths no longer behave like a separate partially live subtree for county-local review.',
    '- Those exact legacy DPA paths now canonically land on `https://health.alaska.gov/dpa` and still return the same Cloudflare challenge shell.',
    '',
    '## Repair decision',
    '',
    '- Alaska remains blocked on missing reviewable borough/census-area office routing.',
    '- This pass sharpens the blocker by collapsing the legacy DPA subtree into the same challenged current health-host family rather than treating it as a separate reviewable lane.',
  ].join('\n') + '\n';
}

async function collectProbe() {
  const services = await fetchTarget('https://dfcs.alaska.gov/Pages/Services.aspx');
  const publications = await fetchTarget('https://dfcs.alaska.gov/Pages/Publications.aspx');
  const siteMap = await fetchTarget('https://dfcs.alaska.gov/Pages/Site-Map.aspx');
  const search = await fetchTarget('https://dfcs.alaska.gov/Search/default.aspx');
  const searchResults = await fetchTarget('https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance');
  const searchPost = await fetchTarget(
    'https://dfcs.alaska.gov/Search/default.aspx',
    {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: 'InputKeywords=public%20assistance',
    },
  );
  const healthDpaOffices = await fetchTarget('https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/');
  const healthApa = await fetchTarget('https://health.alaska.gov/en/services/adult-public-assistance-apa/');
  const healthApplyMedicaid = await fetchTarget('https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/');
  const healthRobots = await fetchTarget('https://health.alaska.gov/robots.txt');
  const legacyRoot = await fetchTarget('https://dhss.alaska.gov/');
  const legacyRobots = await fetchTarget('https://dhss.alaska.gov/robots.txt');
  const legacySitemap = await fetchTarget('https://dhss.alaska.gov/sitemap.xml');
  const legacyDpaRoot = await fetchTarget('https://dhss.alaska.gov/dpa/Pages/default.aspx');
  const legacyDpaOffices = await fetchTarget('https://dhss.alaska.gov/dpa/Pages/office-locations.aspx');
  const legacyDpaContacts = await fetchTarget('https://dhss.alaska.gov/dpa/Pages/contacts.aspx');
  const legacyDpaPublications = await fetchTarget('https://dhss.alaska.gov/dpa/Pages/Publications.aspx');

  const siteMapHrefs = [...siteMap.text.matchAll(/href="([^"]+)"/gi)].map((match) => match[1]);
  const siteMapInteresting = [...new Set(siteMapHrefs.filter((href) => (
    /public-assistance|medicaid|office|location|dpa|adult-public-assistance/i.test(href)
  )))];

  return {
    fetchedAt: new Date().toISOString(),
    servicesStatus: services.status,
    publicationsStatus: publications.status,
    siteMapStatus: siteMap.status,
    siteMapInterestingCount: siteMapInteresting.length,
    siteMapInterestingLeafs: siteMapInteresting,
    searchStatus: search.status,
    searchHasInputKeywords: lowerIncludes(search.text, 'Search') && lowerIncludes(search.text, 'InputKeywords'),
    searchResultsStatus: searchResults.status,
    searchResultsHasFileNotFound: lowerIncludes(searchResults.text, 'File Not Found'),
    searchPostStatus: searchPost.status,
    searchPostStillShell: lowerIncludes(searchPost.text, '<title> Search </title>'),
    healthDpaOfficesStatus: healthDpaOffices.status,
    healthApaStatus: healthApa.status,
    healthApplyMedicaidStatus: healthApplyMedicaid.status,
    healthRobotsStatus: healthRobots.status,
    healthChallenge: lowerIncludes(healthDpaOffices.text, 'Just a moment'),
    legacyRootStatus: legacyRoot.status,
    legacyRootFinalUrl: legacyRoot.finalUrl,
    legacyRobotsStatus: legacyRobots.status,
    legacySitemapStatus: legacySitemap.status,
    legacyDpaRootStatus: legacyDpaRoot.status,
    legacyDpaRootFinalUrl: legacyDpaRoot.finalUrl,
    legacyDpaOfficesStatus: legacyDpaOffices.status,
    legacyDpaOfficesFinalUrl: legacyDpaOffices.finalUrl,
    legacyDpaContactsStatus: legacyDpaContacts.status,
    legacyDpaContactsFinalUrl: legacyDpaContacts.finalUrl,
    legacyDpaPublicationsStatus: legacyDpaPublications.status,
    legacyDpaPublicationsFinalUrl: legacyDpaPublications.finalUrl,
  };
}

export async function generateBatch322AlaskaLegacyCanonicalizationFinalityV1() {
  const probe = await collectProbe();

  if (probe.siteMapStatus !== 200) throw new Error(`Expected live Alaska DFCS Site Map, received ${probe.siteMapStatus}`);
  if (probe.siteMapInterestingCount !== 1 || !probe.siteMapInterestingLeafs.includes('/ocs/Pages/offices/default.aspx')) {
    throw new Error(`Expected only the wrong-service OCS office leaf on Alaska DFCS Site Map, found ${JSON.stringify(probe.siteMapInterestingLeafs)}`);
  }
  if (probe.searchResultsStatus !== 404 || !probe.searchResultsHasFileNotFound) {
    throw new Error('Expected Alaska DFCS search results endpoint to remain SharePoint File Not Found.');
  }
  if (probe.legacyDpaRootFinalUrl !== 'https://health.alaska.gov/dpa'
    || probe.legacyDpaOfficesFinalUrl !== 'https://health.alaska.gov/dpa'
    || probe.legacyDpaContactsFinalUrl !== 'https://health.alaska.gov/dpa'
    || probe.legacyDpaPublicationsFinalUrl !== 'https://health.alaska.gov/dpa') {
    throw new Error('Expected legacy Alaska DPA paths to canonicalize into https://health.alaska.gov/dpa.');
  }

  const statusReason = buildStatusReason({
    fetchedDate: probe.fetchedAt.slice(0, 10),
  });
  const evidence = buildEvidence({
    fetchedDate: probe.fetchedAt.slice(0, 10),
  });

  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const lessons = fs.readFileSync(INPUTS.lessons, 'utf8');

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
        : row
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: statusReason }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const retained = (row.samples || []).filter((sample) => ![
      'Alaska DFCS Site Map',
      'Legacy DHSS DPA root canonicalized to health host',
    ].includes(sample.sample_name));
    const samples = [
      ...retained,
      {
        sample_name: 'Alaska DFCS Site Map',
        source_url: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
        final_url: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
        verification_status: 'reviewed',
        source_type: 'official_site_map_without_dpa_office_leaves',
        source_table: BATCH_NAME,
        fetched_at: probe.fetchedAt,
        evidence_snippet: 'The live DFCS Site Map is reviewable again, but the only office-looking leaf it exposes is `/ocs/Pages/offices/default.aspx` titled `OCS Regional Offices`, not a DPA or public-assistance office-routing leaf.',
      },
      {
        sample_name: 'Legacy DHSS DPA root canonicalized to health host',
        source_url: 'https://dhss.alaska.gov/dpa/Pages/default.aspx',
        final_url: probe.legacyDpaRootFinalUrl,
        verification_status: 'blocked',
        source_type: 'legacy_dpa_canonicalized_to_challenged_successor_host',
        source_table: BATCH_NAME,
        fetched_at: probe.fetchedAt,
        evidence_snippet: 'The legacy DHSS DPA root no longer preserves a separate reviewable subtree; it canonically lands on `https://health.alaska.gov/dpa` and still returns the same Cloudflare challenge shell.',
      },
    ];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: evidence,
      query_basis: `Reviewed ${probe.fetchedAt.slice(0, 10)} the live DFCS Services / Publications / Site Map / Search surfaces, the current health host, and the canonicalized legacy DHSS DPA paths.`,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'alaska'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: FAMILY_STATUS,
            },
          }
        : row
    )),
  };

  const updatedAllStateQueue = allStateQueue.map((row) => (
    row.state === 'alaska'
      ? { ...row, classification: 'BLOCKED', status: 'BLOCKED', primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit));
  fs.writeFileSync(INPUTS.allStateReport, replaceAlaskaAllStateNote(fs.readFileSync(INPUTS.allStateReport, 'utf8')));
  fs.writeFileSync(INPUTS.lessons, addLesson(lessons));

  const batchSummary = {
    batch: BATCH_NAME,
    generated_at: probe.fetchedAt,
    state: 'alaska',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    dfcs_services_status: probe.servicesStatus,
    dfcs_publications_status: probe.publicationsStatus,
    dfcs_site_map_status: probe.siteMapStatus,
    dfcs_site_map_interesting_leaf_count: probe.siteMapInterestingCount,
    dfcs_site_map_interesting_leafs: probe.siteMapInterestingLeafs,
    dfcs_search_status: probe.searchStatus,
    dfcs_search_results_status: probe.searchResultsStatus,
    dfcs_search_post_status: probe.searchPostStatus,
    health_dpa_offices_status: probe.healthDpaOfficesStatus,
    health_robots_status: probe.healthRobotsStatus,
    legacy_root_status: probe.legacyRootStatus,
    legacy_robots_status: probe.legacyRobotsStatus,
    legacy_sitemap_status: probe.legacySitemapStatus,
    legacy_dpa_root_status: probe.legacyDpaRootStatus,
    legacy_dpa_root_final_url: probe.legacyDpaRootFinalUrl,
    legacy_dpa_offices_final_url: probe.legacyDpaOfficesFinalUrl,
    legacy_dpa_contacts_final_url: probe.legacyDpaContactsFinalUrl,
    legacy_dpa_publications_final_url: probe.legacyDpaPublicationsFinalUrl,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await generateBatch322AlaskaLegacyCanonicalizationFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
