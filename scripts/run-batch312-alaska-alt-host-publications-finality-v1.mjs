import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch310AlaskaSearchShellRefreshV1 } from './run-batch310-alaska-search-shell-refresh-v1.mjs';

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
  report: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch312_alaska_alt_host_publications_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch312-alaska-alt-host-publications-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'live_dfcs_services_and_publications_surfaces_still_expose_no_dpa_or_borough_mapping_while_dfcs_search_self_posts_without_results_and_alt_health_legacy_hosts_fail_closed';
const FAILURE_CODE =
  'dfcs_services_and_publications_still_expose_no_local_dpa_contract_while_dfcs_search_alt_hosts_and_health_legacy_dpa_lanes_fail_closed';
const FAMILY_STATUS =
  'blocked_phone_only_dfcs_relay_plus_publications_without_dpa_terms_plus_dfcs_search_shell_without_public_results_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403';
const NEXT_ACTION =
  'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host';
const BATCH_NAME = 'batch312_alaska_alt_host_publications_finality_v1';

const STATUS_REASON =
  'The live Alaska DFCS Services page is still only a statewide phone relay, and one more bounded pass now shows the other currently public official surfaces add no borough-grade routing either. `https://dfcs.alaska.gov/Pages/Publications.aspx` remains live, but a bounded content extraction still finds no `public assistance`, `medicaid`, `adult public assistance`, `locations`, `borough`, or `census` terms and no DPA or office-routing document links. `https://dfcs.alaska.gov/Search/default.aspx` remains publicly readable and still exposes a real `InputKeywords` field, but the expected public results endpoints such as `/Search/Pages/results.aspx?k=public%20assistance`, `/Search/Pages/results.aspx?k=medicaid`, and `/Search/Pages/results.aspx?k=office%20locations` still return SharePoint 404 shells that redirect into `PageNotFoundError.aspx`. A direct POST back to `/Search/default.aspx` with `InputKeywords=public assistance` still self-posts to the same generic `Search` shell and still exposes no DPA office, office-locations, borough, or census-area results. The current `health.alaska.gov` family still returns the same Cloudflare `Just a moment...` 403 shell on exact office leaves and discovery roots such as `robots.txt`. Alternate official siblings do not reopen the lane either: `https://my.alaska.gov/robots.txt` now returns HTTP 403 and `https://alaska.gov/search?query=Division+of+Public+Assistance+offices` returns the state 404 shell. The legacy `dhss.alaska.gov` host is still only partially public: the root canonically lands on `/Pages/default.aspx`, `robots.txt` is live, but `sitemap.xml` is a SharePoint 404 shell and the exact DPA subtree still returns Cloudflare `Just a moment...` 403 shells. That means Alaska still lacks any public borough- or census-area office-routing contract on current DFCS, alternate official siblings, current health, or legacy DHSS official hosts.';

const EVIDENCE =
  'Reviewed 2026-06-23 bounded official Alaska rechecks across the live DFCS successor host, the DFCS Publications and public search surfaces, alternate official siblings, the current `health.alaska.gov` family, and the legacy `dhss.alaska.gov` DPA subtree. `https://dfcs.alaska.gov/Pages/Services.aspx` remains live and publicly reviewable, but still provides only statewide phone routing for `Adult Public Assistance` and `Apply for Medicaid` through `888-804-6330` with no borough or census-area mapping. `https://dfcs.alaska.gov/Pages/Publications.aspx` is also live, but a bounded content extraction still finds no `public assistance`, `medicaid`, `adult public assistance`, `locations`, `borough`, or `census` terms and no DPA or office-routing document links. `https://dfcs.alaska.gov/Search/default.aspx` remains publicly readable and exposes a real `InputKeywords` field, but the expected public results endpoints such as `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance`, `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=medicaid`, and `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=office%20locations` still return SharePoint 404 shells that redirect into `PageNotFoundError.aspx`. A direct POST back to `https://dfcs.alaska.gov/Search/default.aspx` with `InputKeywords=public assistance` still returns HTTP 200 on the same generic `Search` shell and still exposes no reviewable DPA office, office-locations, borough, or census-area result rows. The current `health.alaska.gov` family still fails closed end to end: exact office and service leaves such as `/en/resources/division-of-public-assistance-dpa-offices/`, `/en/services/adult-public-assistance-apa/`, and `/en/services/division-of-public-assistance-services/apply-for-medicaid/` return HTTP 403 Cloudflare `Just a moment...` shells, and the same 403 applies to `robots.txt`. Alternate official siblings do not reopen the lane either: `https://my.alaska.gov/robots.txt` returns HTTP 403 and `https://alaska.gov/search?query=Division+of+Public+Assistance+offices` returns HTTP 404. The legacy `dhss.alaska.gov` host is only partially public: the root canonically lands on `https://dhss.alaska.gov/Pages/default.aspx` and `robots.txt` returns 200, but `sitemap.xml` is a SharePoint 404 shell and the exact DPA subtree is still not reviewable because `/dpa/Pages/default.aspx`, `/dpa/Pages/office-locations.aspx`, and `/dpa/Pages/contacts.aspx` all return HTTP 403 Cloudflare `Just a moment...` shells. Alaska therefore still lacks any reviewable borough- or census-area-to-office contract on a public official surface.';

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
    '- The public DFCS search page still exposes a real keyword input, but the results endpoints still 404 into SharePoint PageNotFound shells and a direct keyword POST still self-posts to the same generic search shell with no DPA office results.',
    '- Alternate official siblings still fail closed: `my.alaska.gov/robots.txt` returns 403 and `alaska.gov/search` returns 404.',
    '- The current health host still returns Cloudflare `Just a moment...` 403 shells for the DPA office-routing family, and the legacy DHSS DPA subtree remains blocked.',
    '- Alaska therefore still lacks any reviewable borough- or census-area office-routing contract on a public official surface.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit) {
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));

  return [
    '# Gemini Source Scout Handoff',
    '',
    'Updated: 2026-06-23',
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
    '`county_local_disability_resources` is the only remaining Alaska critical blocker. The live DFCS successor host still only gives statewide phone routing, the live DFCS Publications page still exposes no DPA or office-routing material, the public DFCS search lane still dies at the search shell itself, alternate official siblings still fail closed, the current `health.alaska.gov` DPA family still returns Cloudflare `Just a moment...` 403 shells, and the legacy `dhss.alaska.gov` DPA subtree remains blocked even though the legacy root is still partially public.',
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
    '- [Alaska DFCS Search](https://dfcs.alaska.gov/Search/default.aspx)',
    '- [Alaska DFCS Search results endpoint](https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance)',
    '- [Alaska DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)',
    '- [Alaska DFCS robots.txt](https://dfcs.alaska.gov/robots.txt)',
    '- [Alaska DFCS sitemap.xml](https://dfcs.alaska.gov/sitemap.xml)',
    '- [my.alaska.gov robots.txt](https://my.alaska.gov/robots.txt)',
    '- [alaska.gov search](https://alaska.gov/search?query=Division+of+Public+Assistance+offices)',
    '- [Alaska Adult Public Assistance leaf](https://health.alaska.gov/en/services/adult-public-assistance-apa/)',
    '- [Alaska Apply for Medicaid leaf](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)',
    '- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)',
    '- [Alaska health robots.txt](https://health.alaska.gov/robots.txt)',
    '- [Legacy DHSS root](https://dhss.alaska.gov/)',
    '- [Legacy DHSS robots.txt](https://dhss.alaska.gov/robots.txt)',
    '- [Legacy DHSS sitemap.xml](https://dhss.alaska.gov/sitemap.xml)',
    '- [Legacy DHSS DPA root](https://dhss.alaska.gov/dpa/Pages/default.aspx)',
    '- [Legacy DHSS office locations](https://dhss.alaska.gov/dpa/Pages/office-locations.aspx)',
    '- [Legacy DHSS DPA contacts](https://dhss.alaska.gov/dpa/Pages/contacts.aspx)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any current Alaska host outside the challenged `health.alaska.gov` family that now publishes a borough- or census-area DPA office directory.',
    '- Any official Alaska PDF, spreadsheet, or office-contact table that names specific borough or census-area coverage for public assistance offices.',
    '- Any future public relaxation on either the `health.alaska.gov` or legacy `dhss.alaska.gov` DPA subtree that makes office-routing leaves scraper-reviewable.',
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

function replaceAllStateNote(text) {
  const oldNotes = [
    '- Alaska county-local routing is still blocked, and the current official contract is now tighter on the exact shells: DFCS search result URLs still fall into SharePoint PageNotFound shells, the search POST still self-posts without office rows, the health host still returns Cloudflare `Just a moment...` 403 shells, and the partially live legacy DHSS root still cannot reopen the DPA subtree.',
  ];
  let next = text;
  for (const note of oldNotes) next = next.replace(`${note}\n`, '');
  const replacement = '- Alaska county-local routing is still blocked: DFCS Services remains phone-only, DFCS Publications still exposes no DPA/public-assistance office material, DFCS search result URLs still fall into SharePoint PageNotFound shells, the search POST still self-posts without office rows, `my.alaska.gov` still 403s, `alaska.gov/search` still 404s, the health host still returns Cloudflare `Just a moment...` 403 shells, and the partially live legacy DHSS root still cannot reopen the DPA subtree.';
  if (!next.includes(replacement)) next = `${next.trimEnd()}\n${replacement}\n`;
  return next;
}

function buildBatchReport(summary) {
  return [
    '# Batch 312 Alaska Alt-Host Publications Finality v1',
    '',
    '- state: Alaska',
    `- classification: ${summary.classification}`,
    '- blocker_family: county_local_disability_resources',
    '',
    '## What was confirmed',
    '',
    '- The live DFCS Services page still only provides statewide phone routing.',
    '- The live DFCS Publications page still exposes no `public assistance`, `medicaid`, `adult public assistance`, `locations`, `borough`, or `census` terms and no DPA/office-routing document links.',
    '- The public DFCS search page still exposes a real `InputKeywords` field, but the expected results endpoints still return SharePoint 404 shells that redirect into `PageNotFoundError.aspx`.',
    '- A direct keyword POST back to the DFCS search page still self-posts to the same generic `Search` shell and exposes no reviewable DPA office results.',
    '- `my.alaska.gov/robots.txt` returns HTTP 403 and `alaska.gov/search?query=Division+of+Public+Assistance+offices` returns HTTP 404.',
    '- The current `health.alaska.gov` DPA family still returns Cloudflare `Just a moment...` 403 shells.',
    '- The legacy `dhss.alaska.gov` root still canonically lands on `/Pages/default.aspx`, but the exact DPA subtree still returns Cloudflare `Just a moment...` 403 shells and `sitemap.xml` still fails closed.',
    '',
    '## Repair decision',
    '',
    '- Alaska remains blocked on missing reviewable borough/census-area office routing.',
    '- No DFCS, alternate-official, current-health, or legacy-DHSS official host exposes a reviewable county-equivalent office contract in the low-token lane.',
  ].join('\n') + '\n';
}

export function generateBatch312AlaskaAltHostPublicationsFinalityV1() {
  generateBatch310AlaskaSearchShellRefreshV1();

  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        failure_code: FAILURE_CODE,
        evidence: EVIDENCE,
        next_action: NEXT_ACTION,
      },
    ],
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const keep = (row.samples || []).filter((sample) => ![
      'Alaska DFCS Publications no DPA office material',
      'my.alaska.gov robots 403',
      'alaska.gov state search 404',
    ].includes(sample.sample_name));
    const samples = [
      ...keep,
      {
        sample_name: 'Alaska DFCS Publications no DPA office material',
        source_url: 'https://dfcs.alaska.gov/Pages/Publications.aspx',
        final_url: 'https://dfcs.alaska.gov/Pages/Publications.aspx',
        verification_status: 'reviewed',
        source_type: 'official_publications_without_public_assistance_office_contract',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The live Publications page remains public, but a bounded content extraction finds no `public assistance`, `medicaid`, `adult public assistance`, `locations`, `borough`, or `census` terms and no DPA or office-routing document links.',
      },
      {
        sample_name: 'my.alaska.gov robots 403',
        source_url: 'https://my.alaska.gov/robots.txt',
        final_url: 'https://my.alaska.gov/robots.txt',
        verification_status: 'blocked',
        source_type: 'official_alternate_host_forbidden',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The alternate official sibling host returns HTTP 403 on robots.txt and therefore does not expose a public crawl or office-routing contract.',
      },
      {
        sample_name: 'alaska.gov state search 404',
        source_url: 'https://alaska.gov/search?query=Division+of+Public+Assistance+offices',
        final_url: 'https://alaska.gov/search?query=Division+of+Public+Assistance+offices',
        verification_status: 'blocked',
        source_type: 'official_state_search_missing',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The official state search URL returns HTTP 404 and therefore does not reopen a public DPA office-routing search surface.',
      },
    ];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      query_basis: 'Reviewed 2026-06-23 the live DFCS Services page, DFCS Publications page, DFCS search shell and results lane, alternate official siblings, the current health host family, and the legacy DHSS DPA subtree.',
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
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
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit));
  fs.writeFileSync(INPUTS.allStateReport, replaceAllStateNote(fs.readFileSync(INPUTS.allStateReport, 'utf8')));

  const batchSummary = {
    batch: BATCH_NAME,
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'alaska',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    dfcs_services_status: 200,
    dfcs_publications_status: 200,
    dfcs_publications_dpa_terms_found: false,
    dfcs_search_status: 200,
    dfcs_search_results_status: 404,
    dfcs_search_post_status: 200,
    my_alaska_robots_status: 403,
    alaska_gov_search_status: 404,
    health_robots_status: 403,
    legacy_root_status: 200,
    legacy_robots_status: 200,
    legacy_sitemap_status: 404,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch312AlaskaAltHostPublicationsFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
