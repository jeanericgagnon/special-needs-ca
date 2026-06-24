import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'oregon_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'oregon_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'oregon_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'oregon_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'oregon_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'oregon-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch296_oregon_office_finder_shell_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch296-oregon-office-finder-shell-finality-report-v1.md'),
};

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

const PRIMARY_GAP_REASON =
  'live_odhs_office_finder_is_only_a_sharepoint_leaflet_shell_with_no_public_county_extract_or_query_contract';
const COUNTY_FAMILY_STATUS = 'blocked_live_office_finder_shell_without_public_county_contract';
const FAILURE_CODE =
  'live_office_finder_shell_has_no_public_office_rows_county_list_or_search_contract';
const NEXT_ACTION =
  'hold_blocked_until_live_odhs_office_finder_exposes_public_office_rows_or_county_owned_odhs_leaves_cover_all_36_counties';
const COUNTY_REASON =
  'Reviewed 2026-06-23 one bounded official Oregon county-local replacement lane on the live ODHS office-finder stack. The old `https://dhhs.oregon.gov/locations` host still fails DNS, and the current successor root `https://www.oregon.gov/odhs/pages/office-finder.aspx` is confirmed live on the official Oregon host. But the live surface still fails closed for county-grade routing: the page returns an ASP.NET SharePoint shell titled `Find an Office`, loads Leaflet and marker-cluster libraries, and preserves only generic help text such as `Look up ODHS offices near you and get contact information and directions. Choose the kind of service you need and find an office close to you.` Bounded query-string probes like `?county=Baker` and `?city=Salem` return the same generic page, the static HTML preserves no county list, office rows, or public result payload, `robots.txt` only confirms statewide SharePoint exclusions, the obvious sitemap and search surfaces return 404, and no public endpoint or export contract is exposed in the reviewed page source. A bounded DB check still shows Oregon county-office rows split between 61 DOI-backed planning rows and only 3 dead `dhhs.oregon.gov/locations` rows. Oregon therefore remains blocked because the live successor lane is real but still only a public app shell with no county-grade office extract.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
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
    '# Oregon California-Grade Audit Report v2',
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
    '## County-local refinement',
    '',
    '- The old `dhhs.oregon.gov/locations` host is dead, but Oregon now has one live official successor lane on `https://www.oregon.gov/odhs/pages/office-finder.aspx`.',
    '- That page is a real official ODHS office-finder surface, but bounded raw review only preserves a SharePoint/Leaflet app shell plus generic help text.',
    '- Query-string probes like `?county=Baker` and `?city=Salem` return the same generic page instead of county-specific office rows.',
    '- The obvious sitemap and search surfaces reviewed in this lane returned 404, and the page source exposed no public office JSON, export, or county list contract.',
    '- Current county-office rows on disk are still almost entirely DOI planning rows, so the live shell does not replace the stale office family yet.',
    '',
    '## Completion decision',
    '',
    '- Oregon remains `BLOCKED` and `index_safe=false`.',
    '- Education remains cleared by the official county-searchable ODE Combined Directory PDF.',
    '- County-local no longer fails because the successor root is merely generic HTML; it now fails because the live official successor is only a public office-finder shell with no exposed county-grade office extract or query contract.',
    '- Oregon therefore still cannot be marked `COMPLETE` or index-safe.',
  ].join('\n') + '\n';
}

function buildAllStateReport(audit) {
  const completeStates = audit.states.filter((row) => row.classification === 'COMPLETE').map((row) => row.stateName);
  const blockedStates = audit.states.filter((row) => row.classification === 'BLOCKED').map((row) => row.stateName);
  return [
    '# All-State California-Grade Audit Report v3',
    '',
    'This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.',
    '',
    '## Packet coverage',
    '',
    `- packet_coverage_count: ${audit.packetCoverageCount}`,
    `- packet_missing_states: ${audit.packetMissingStates.length ? audit.packetMissingStates.join(', ') : 'none'}`,
    '',
    '## Classification counts',
    '',
    `- COMPLETE: ${audit.classifications.COMPLETE}`,
    `- BLOCKED: ${audit.classifications.BLOCKED}`,
    '',
    `- index-safe states: ${audit.indexSafeCount}`,
    `- complete states: ${completeStates.join(', ')}`,
    `- blocked states: ${blockedStates.join(', ')}`,
    '',
    '## Notes',
    '',
    '- Texas remains COMPLETE/index-safe from v10.',
    '- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.',
    '- Oklahoma remains blocked on a live official office-map lane that still misses county-complete coverage.',
    '- Oregon remains blocked, but the blocker is now narrowed to a live official ODHS office-finder app shell that exposes no public county extract, search contract, or office result payload.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
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
  const oregonIndex = PRIORITY_ORDER.indexOf('oregon');
  const nextStates = PRIORITY_ORDER
    .slice(oregonIndex + 1)
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
    '## Current Focus State: Oregon',
    '',
    '### Blocker Reason',
    '',
    'Oregon has one remaining California-grade blocker: `county_local_disability_resources`. Education is already cleared by the current official ODE county-searchable school directory. The county-local lane is no longer blocked by a missing successor root; it is now blocked because the live ODHS office-finder still only exposes a public app shell with no county-grade office extract.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A live official Oregon ODHS office export, result payload, or county-owned ODHS local-office leaves that materialize office rows for all 36 counties.',
    '- A public county list, office result payload, or service-area contract from the live office-finder itself, not just generic map/search controls.',
    '- Any public official Oregon local-office surface that replaces the current DOI-backed planning rows with real county-to-office routing.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Dead Oregon legacy locations host](https://dhhs.oregon.gov/locations)',
    '- [Live ODHS Office Finder successor root](https://www.oregon.gov/odhs/pages/office-finder.aspx)',
    '- [Office Finder county query probe](https://www.oregon.gov/odhs/pages/office-finder.aspx?county=Baker)',
    '- [Office Finder city query probe](https://www.oregon.gov/odhs/pages/office-finder.aspx?city=Salem)',
    '- [Official Oregon robots.txt](https://www.oregon.gov/robots.txt)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any public ODHS office-finder result endpoint, export lane, or office payload that the current page shell calls client-side.',
    '- Any official Oregon county-owned or ODHS-maintained local-office leaves that preserve county identity and direct office contact routing.',
    '- Any live public successor lane on `oregon.gov/odhs` that exposes county-served offices without depending on the old DOI planning dataset.',
    '',
    '## Next State Order After Oregon',
    '',
    ...nextStates.map((stateName, index) => `${index + 1}. ${stateName}`),
  ].join('\n') + '\n';
}

function buildBatchReport(summary) {
  return [
    '# Batch 296 Oregon Office Finder Shell Finality Report v1',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    '- change: replaced the generic Oregon office-finder blocker with the live app-shell reality',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
    '',
    '## Repair decision',
    '',
    '- Kept Oregon BLOCKED.',
    '- Retired the weaker “generic live office-finder root” framing for county-local routing.',
    '- Preserved the live ODHS office-finder as real successor evidence, but held the state because the reviewed public page source still exposes no office rows, county list, result payload, or public search contract.',
    '- Left the handoff on Oregon because the state is still only one family short of COMPLETE/index-safe.',
  ].join('\n') + '\n';
}

export function generateBatch296OregonOfficeFinderShellFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 1,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: ['county_local_disability_resources'],
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: FAILURE_CODE,
        evidence: COUNTY_REASON,
        next_action: NEXT_ACTION,
      },
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      county_local_disability_resources: COUNTY_FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: COUNTY_FAMILY_STATUS,
          status_reason:
            'the live ODHS office-finder is a real official successor lane, but its reviewed public page source still exposes no office rows, county list, or public result contract and the county-office rows on disk remain DOI-backed or dead-host placeholders',
        }
      : row
  );

  const updatedFailureRows = failureRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          evidence: COUNTY_REASON,
          next_action: NEXT_ACTION,
        }
      : row
  );

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: COUNTY_FAMILY_STATUS,
          evidence_strength: 'medium',
          sample_count: 4,
          query_basis:
            'Reviewed the live Oregon ODHS office-finder root, bounded county/city query probes, statewide robots/search surfaces, and the existing county-office source split on disk.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: COUNTY_REASON,
          samples: [
            {
              sample_name: 'Live ODHS Office Finder successor root',
              source_url: 'https://www.oregon.gov/odhs/pages/office-finder.aspx',
              final_url: 'https://www.oregon.gov/odhs/pages/office-finder.aspx',
              verification_status: 'reviewed',
              source_type: 'official_successor_directory_root',
              source_table: 'batch296_oregon_office_finder_shell_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet:
                'Find an Office. Look up ODHS offices near you and get contact information and directions. Choose the kind of service you need and find an office close to you.',
            },
            {
              sample_name: 'Bounded county query returns same generic shell',
              source_url: 'https://www.oregon.gov/odhs/pages/office-finder.aspx?county=Baker',
              final_url: 'https://www.oregon.gov/odhs/pages/office-finder.aspx?county=Baker',
              verification_status: 'reviewed',
              source_type: 'official_query_probe',
              source_table: 'batch296_oregon_office_finder_shell_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet:
                'The county query probe returns the same generic Find an Office shell rather than county-specific office rows.',
            },
            {
              sample_name: 'Bounded city query returns same generic shell',
              source_url: 'https://www.oregon.gov/odhs/pages/office-finder.aspx?city=Salem',
              final_url: 'https://www.oregon.gov/odhs/pages/office-finder.aspx?city=Salem',
              verification_status: 'reviewed',
              source_type: 'official_query_probe',
              source_table: 'batch296_oregon_office_finder_shell_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet:
                'The city query probe returns the same generic Find an Office shell rather than a public office result payload.',
            },
            {
              sample_name: 'Official statewide robots and search surfaces do not expose a county lane',
              source_url: 'https://www.oregon.gov/robots.txt',
              final_url: 'https://www.oregon.gov/robots.txt',
              verification_status: 'reviewed',
              source_type: 'official_supporting_surface',
              source_table: 'batch296_oregon_office_finder_shell_finality',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet:
                'The statewide robots file only confirms SharePoint exclusions, while the obvious search result URLs reviewed in this lane return 404 and add no county-office contract.',
            },
          ],
        }
      : row
  );

  const updatedNextRows = nextRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
          evidence: COUNTY_REASON,
        }
      : row
  );

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'oregon'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 83,
          missing_critical_families: 0,
          weak_critical_families: 1,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'batch_3_procedure_hardening',
          status: 'BLOCKED',
          repair_lane: 'repair_from_state_packet',
        }
      : row
  );

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) =>
      row.stateId === 'oregon'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            strongCriticalFamilies: 10,
            weakCriticalFamilies: 1,
            missingCriticalFamilies: 0,
            completenessPct: 83,
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: COUNTY_FAMILY_STATUS,
            },
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'batch_3_procedure_hardening',
          }
        : row
    ),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(updatedAllStateAudit));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit));

  const batchSummary = {
    state: 'oregon',
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    liveSuccessorOfficeFinderVerified: true,
    countyQueryProbeChangedSurface: false,
    cityQueryProbeChangedSurface: false,
    publicCountyListInHtml: false,
    publicSearchSurfaceFound: false,
    publicSitemapSurfaceFound: false,
    remaining_blocker_family_count: 1,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(updatedSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch296OregonOfficeFinderShellFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
