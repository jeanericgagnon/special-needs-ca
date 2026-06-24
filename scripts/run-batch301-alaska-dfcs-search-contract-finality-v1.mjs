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
  report: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch301_alaska_dfcs_search_contract_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch301-alaska-dfcs-search-contract-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'live_dfcs_services_page_remains_phone_only_while_dfcs_search_exposes_input_field_but_no_public_results_endpoint_and_current_health_and_legacy_dhss_dpa_hosts_stay_gate_blocked';
const FAILURE_CODE =
  'live_dfcs_services_page_is_phone_only_and_dfcs_search_has_no_public_results_contract_while_current_health_host_and_legacy_dhss_dpa_subtree_both_fail_closed';
const FAMILY_STATUS =
  'blocked_phone_only_dfcs_relay_plus_dfcs_search_without_public_results_contract_plus_current_health_host_403_and_legacy_dhss_dpa_subtree_403';
const NEXT_ACTION =
  'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_reopens_a_reviewable_dpa_directory_host';

const STATUS_REASON =
  'The live Alaska DFCS Services page is still only a statewide phone relay, and one more bounded pass now proves the DFCS search surface still does not open a usable public results lane. `https://dfcs.alaska.gov/Search/default.aspx` exposes a real `InputKeywords` field, but the expected SharePoint-style results endpoints such as `/Search/Pages/results.aspx?k=public%20assistance`, `/Search/Pages/results.aspx?k=medicaid`, and `/Search/Pages/results.aspx?k=office%20locations` all return HTTP 404, while a direct POST back to `/Search/default.aspx` with `InputKeywords=public assistance` still self-posts to the same generic shell and surfaces no DPA office, office-locations, borough, or census-area results. The current `health.alaska.gov` family still returns the same Cloudflare 403 shell on exact office leaves, service/resource roots, `robots.txt`, `sitemap.xml`, `wp-json`, and `wp-sitemap.xml`. The legacy `dhss.alaska.gov` root and `robots.txt` remain publicly readable, but the exact DPA subtree is also not reviewable: `/dpa/Pages/default.aspx`, `/dpa/Pages/office-locations.aspx`, `/dpa/Pages/contacts.aspx`, and `/dpa/Pages/Publications.aspx` all return HTTP 403, while `sitemap.xml` and SharePoint search routes return 404. That means Alaska still lacks any public borough- or census-area office-routing contract on current DFCS, current health, or legacy DHSS official hosts.';

const EVIDENCE =
  'Reviewed 2026-06-23 bounded official Alaska rechecks across the live DFCS successor host, the DFCS public search surface, the current `health.alaska.gov` family, and the legacy `dhss.alaska.gov` DPA subtree. `https://dfcs.alaska.gov/Pages/Services.aspx` remains live and publicly reviewable, but still provides only statewide phone routing for `Adult Public Assistance` and `Apply for Medicaid` through `888-804-6330` with no borough or census-area mapping. `https://dfcs.alaska.gov/Search/default.aspx` is also publicly readable and exposes a real `InputKeywords` field, but the expected public results endpoints such as `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance`, `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=medicaid`, and `https://dfcs.alaska.gov/Search/Pages/results.aspx?k=office%20locations` all return HTTP 404. A direct POST back to `https://dfcs.alaska.gov/Search/default.aspx` with `InputKeywords=public assistance` also returns HTTP 200 on the same generic search shell and still exposes no reviewable DPA office, office-locations, borough, or census-area result rows. The current `health.alaska.gov` family still fails closed end to end: exact office and service leaves such as `/en/resources/division-of-public-assistance-dpa-offices/`, `/en/services/adult-public-assistance-apa/`, and `/en/services/division-of-public-assistance-services/apply-for-medicaid/` return HTTP 403, and the same 403 applies to `robots.txt`, `sitemap.xml`, `wp-json`, `wp-sitemap.xml`, and the parent `/en/resources/` and `/en/services/` roots. The legacy `dhss.alaska.gov` host is only partially public: the root and `robots.txt` return 200, but `sitemap.xml` and SharePoint search routes return 404, and the exact DPA subtree is still not reviewable because `/dpa/Pages/default.aspx`, `/dpa/Pages/office-locations.aspx`, `/dpa/Pages/contacts.aspx`, `/dpa/Pages/Publications.aspx`, and `/dsds/Pages/default.aspx` all return HTTP 403. Alaska therefore still lacks any reviewable borough- or census-area-to-office contract on a public official surface, and the blocker is now sharper because even the exposed DFCS search form still has no usable public results contract.';

const PRIORITY_ORDER = [
  'utah',
  'kansas',
  'nebraska',
  'nevada',
  'florida',
  'alaska',
  'south-carolina',
  'north-carolina',
  'new-york',
  'oklahoma',
  'oregon',
  'ohio',
  'minnesota',
  'maine',
  'idaho',
  'arizona',
  'massachusetts',
  'new-mexico',
  'south-dakota',
  'rhode-island',
  'virginia',
  'west-virginia',
  'north-dakota',
  'wisconsin',
  'washington',
  'tennessee',
  'vermont',
  'wyoming',
  'new-hampshire',
];

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
    '- The public DFCS search shell exposes a real keyword input, but its public results endpoints 404 and a direct keyword POST still self-posts to the same generic shell with no DPA office results.',
    '- The current health host remains fully challenge-blocked for the DPA office-routing family.',
    '- The legacy DHSS root is only partially live: root and robots are public, but the exact DPA subtree is still 403-blocked and sitemap/search still fail closed.',
    '- Alaska therefore still lacks any reviewable borough- or census-area office-routing contract on a public official surface.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit) {
  const blockedSet = new Set(
    allStateAudit.states.filter((row) => row.classification === 'BLOCKED').map((row) => row.stateId)
  );
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));
  const alaskaIndex = PRIORITY_ORDER.indexOf('alaska');
  const nextStates = PRIORITY_ORDER
    .slice(alaskaIndex + 1)
    .filter((stateId) => blockedSet.has(stateId))
    .slice(0, 10)
    .map((stateId) => {
      const row = allStateAudit.states.find((state) => state.stateId === stateId);
      return row ? row.stateName : stateId;
    });

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
    '`county_local_disability_resources` is the only remaining Alaska critical blocker. The live DFCS successor host still only gives statewide phone routing, the public DFCS search surface exposes a real keyword field but still no usable public results contract, the current `health.alaska.gov` DPA family is challenge-blocked end to end, and the legacy `dhss.alaska.gov` DPA subtree is also not reviewable even though the root is partially live.',
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
    '- [Alaska DFCS Search](https://dfcs.alaska.gov/Search/default.aspx)',
    '- [Alaska DFCS Search results endpoint](https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance)',
    '- [Alaska DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)',
    '- [Alaska DFCS Publications](https://dfcs.alaska.gov/Pages/Publications.aspx)',
    '- [Alaska DFCS robots.txt](https://dfcs.alaska.gov/robots.txt)',
    '- [Alaska DFCS sitemap.xml](https://dfcs.alaska.gov/sitemap.xml)',
    '- [Alaska Adult Public Assistance leaf](https://health.alaska.gov/en/services/adult-public-assistance-apa/)',
    '- [Alaska Apply for Medicaid leaf](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)',
    '- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)',
    '- [Alaska health robots.txt](https://health.alaska.gov/robots.txt)',
    '- [Legacy DHSS root](https://dhss.alaska.gov/)',
    '- [Legacy DHSS robots.txt](https://dhss.alaska.gov/robots.txt)',
    '- [Legacy DHSS DPA root](https://dhss.alaska.gov/dpa/Pages/default.aspx)',
    '- [Legacy DHSS office locations](https://dhss.alaska.gov/dpa/Pages/office-locations.aspx)',
    '- [Legacy DHSS DPA contacts](https://dhss.alaska.gov/dpa/Pages/contacts.aspx)',
    '- [Legacy DHSS DPA publications](https://dhss.alaska.gov/dpa/Pages/Publications.aspx)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any current Alaska host outside the challenged `health.alaska.gov` family that now publishes a borough- or census-area DPA office directory.',
    '- Any official Alaska PDF, spreadsheet, or office-contact table that names specific borough or census-area coverage for public assistance offices.',
    '- Any future public relaxation on either the `health.alaska.gov` or legacy `dhss.alaska.gov` DPA subtree that makes office-routing leaves scraper-reviewable.',
    '',
    '## Next State Order After Alaska',
    '',
    ...nextStates.map((stateName, index) => `${index + 1}. ${stateName}`),
  ].join('\n') + '\n';
}

function buildAllStateReport(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedStates = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  return [
    '# All-State California-Grade Audit Report v3',
    '',
    'This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.',
    '',
    '## Packet coverage',
    '',
    '- packet_coverage_count: 50',
    '- packet_missing_states: none',
    '',
    '## Classification counts',
    '',
    `- COMPLETE: ${allStateAudit.classifications.COMPLETE}`,
    `- BLOCKED: ${allStateAudit.classifications.BLOCKED}`,
    '',
    `- index-safe states: ${allStateAudit.indexSafeCount}`,
    `- complete states: ${completeStates.join(', ')}`,
    `- blocked states: ${blockedStates.join(', ')}`,
    '',
    '## Notes',
    '',
    '- Texas remains COMPLETE/index-safe from v10.',
    '- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
    '- Alaska county-local routing is now explicitly sharpened to a phone-only DFCS relay plus an exposed DFCS search form whose public results endpoint still 404s and whose keyword POST still produces no office rows, alongside a fully challenged current health host and a partially live but gated legacy DHSS DPA subtree.',
  ].join('\n') + '\n';
}

function buildBatchReport(summary) {
  return [
    '# Batch 301 Alaska DFCS Search Contract Finality Report v1',
    '',
    '- state: Alaska',
    `- classification: ${summary.classification}`,
    '- blocker_family: county_local_disability_resources',
    '',
    '## What was confirmed',
    '',
    '- The live DFCS Services page still only provides statewide phone routing.',
    '- The public DFCS search page exposes a real `InputKeywords` field, but the expected public results endpoints still 404.',
    '- A direct keyword POST back to the DFCS search page still self-posts to the same generic shell and exposes no reviewable DPA office results.',
    '- The current `health.alaska.gov` DPA family still returns the same 403 shell across exact leaves and discovery roots.',
    '- The legacy `dhss.alaska.gov` root and robots.txt are public, but the exact DPA and DSDS subtree pages are still 403 and sitemap/search still fail closed.',
    '',
    '## Repair decision',
    '',
    '- Alaska remains blocked on missing reviewable borough/census-area office routing.',
    '- No DFCS, current-health, or legacy-DHSS official host exposes a reviewable county-equivalent office contract in the low-token lane.',
  ].join('\n') + '\n';
}

export function generateBatch301AlaskaDfcsSearchContractFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);

  const updatedSummary = {
    ...summary,
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
      'Legacy DHSS root',
      'Legacy DHSS DPA root 403',
      'Legacy DHSS office locations 403',
      'Legacy DHSS DPA contacts 403',
      'DFCS Search shell',
      'DFCS Search query replay',
      'DFCS Search POST self-post',
      'DFCS Search results endpoint 404',
    ].includes(sample.sample_name));
    const samples = [
      ...keep,
      {
        sample_name: 'DFCS Search shell',
        source_url: 'https://dfcs.alaska.gov/Search/default.aspx',
        final_url: 'https://dfcs.alaska.gov/Search/default.aspx',
        verification_status: 'blocked',
        source_type: 'official_search_shell_without_public_results_contract',
        source_table: 'batch301_alaska_dfcs_search_contract_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public DFCS search page is readable and exposes a real `InputKeywords` field, but still does not expose reviewable DPA office results.',
      },
      {
        sample_name: 'DFCS Search results endpoint 404',
        source_url: 'https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance',
        final_url: 'https://dfcs.alaska.gov/Search/Pages/results.aspx?k=public%20assistance',
        verification_status: 'blocked',
        source_type: 'official_search_results_endpoint_not_published',
        source_table: 'batch301_alaska_dfcs_search_contract_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'Expected SharePoint-style results endpoints like `/Search/Pages/results.aspx?k=public%20assistance`, `/Search/Pages/results.aspx?k=medicaid`, and `/Search/Pages/results.aspx?k=office%20locations` all return HTTP 404.',
      },
      {
        sample_name: 'DFCS Search POST self-post',
        source_url: 'https://dfcs.alaska.gov/Search/default.aspx',
        final_url: 'https://dfcs.alaska.gov/Search/default.aspx',
        verification_status: 'blocked',
        source_type: 'official_search_post_without_results',
        source_table: 'batch301_alaska_dfcs_search_contract_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'A direct POST back to `/Search/default.aspx` with `InputKeywords=public assistance` still returns the same generic shell and no DPA office rows.',
      },
      {
        sample_name: 'Legacy DHSS root',
        source_url: 'https://dhss.alaska.gov/',
        final_url: 'https://dhss.alaska.gov/',
        verification_status: 'reviewed',
        source_type: 'official_legacy_root_without_successor_contract',
        source_table: 'batch301_alaska_dfcs_search_contract_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The legacy DHSS root is still publicly readable, but that alone does not expose a borough/census-area office-routing contract.',
      },
      {
        sample_name: 'Legacy DHSS DPA root 403',
        source_url: 'https://dhss.alaska.gov/dpa/Pages/default.aspx',
        final_url: 'https://dhss.alaska.gov/dpa/Pages/default.aspx',
        verification_status: 'blocked',
        source_type: 'official_legacy_dpa_subtree_gated',
        source_table: 'batch301_alaska_dfcs_search_contract_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The legacy DPA root returns HTTP 403 even though the legacy site root is still live.',
      },
      {
        sample_name: 'Legacy DHSS office locations 403',
        source_url: 'https://dhss.alaska.gov/dpa/Pages/office-locations.aspx',
        final_url: 'https://dhss.alaska.gov/dpa/Pages/office-locations.aspx',
        verification_status: 'blocked',
        source_type: 'official_legacy_dpa_subtree_gated',
        source_table: 'batch301_alaska_dfcs_search_contract_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The legacy office-locations leaf returns HTTP 403 and therefore does not reopen a reviewable office-routing contract.',
      },
      {
        sample_name: 'Legacy DHSS DPA contacts 403',
        source_url: 'https://dhss.alaska.gov/dpa/Pages/contacts.aspx',
        final_url: 'https://dhss.alaska.gov/dpa/Pages/contacts.aspx',
        verification_status: 'blocked',
        source_type: 'official_legacy_dpa_subtree_gated',
        source_table: 'batch301_alaska_dfcs_search_contract_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The legacy DPA contacts leaf also returns HTTP 403, so the subtree is not a usable public successor lane.',
      },
    ];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      query_basis: 'Reviewed 2026-06-23 the live DFCS Services host, the DFCS search form and results endpoints, the direct search POST flow, the current health host family, and the legacy DHSS root plus exact DPA subtree paths.',
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
            familyStatuses: {
              ...(row.familyStatuses || {}),
              county_local_disability_resources: FAMILY_STATUS,
            },
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
          }
        : row
    )),
  };

  const updatedAllStateQueue = allStateQueue.map((row) => (
    row.state === 'alaska'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(updatedAllStateAudit));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit));

  const batchSummary = {
    batch: 'batch301_alaska_dfcs_search_contract_finality_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'alaska',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    dfcs_search_input_field_exposed: true,
    dfcs_results_endpoint_404: true,
    dfcs_search_post_self_posts_without_results: true,
    lessons_updated: false,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(updatedSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch301AlaskaDfcsSearchContractFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
