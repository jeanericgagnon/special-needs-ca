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
  batchSummary: path.join(generatedDir, 'batch304_oregon_office_finder_component_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch304-oregon-office-finder-component-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'live_odhs_office_finder_is_only_a_custom_component_shell_with_no_public_county_extract_query_contract_or_api_surface';
const COUNTY_FAMILY_STATUS = 'blocked_live_office_finder_shell_without_public_county_contract';
const FAILURE_CODE =
  'live_office_finder_custom_component_stays_html_shell_under_query_and_api_like_probes';
const NEXT_ACTION =
  'hold_blocked_until_live_odhs_office_finder_exposes_public_office_rows_or_county_owned_odhs_leaves_cover_all_36_counties';
const COUNTY_REASON =
  'Reviewed 2026-06-23 one more bounded official Oregon county-local replacement lane on the live ODHS office-finder stack. The old `https://dhhs.oregon.gov/locations` host still fails DNS, and the current successor root `https://www.oregon.gov/odhs/pages/office-finder.aspx` is confirmed live on the official Oregon host. The reviewed page source now tightens the blocker beyond generic SharePoint status: it preserves a custom `<odhs-office-finder />` component inside the page body, loads Leaflet and marker-cluster libraries, and still exposes only generic help text such as `Look up ODHS offices near you and get contact information and directions. Choose the kind of service you need and find an office close to you.` Bounded query-string probes like `?county=Baker`, `?city=Salem`, and `?service=SNAP` still return the same component shell with no public office rows. One more bounded contract pass confirms even naïve public-contract probes like `/_api/`, `?output=1`, `?format=json`, and `?map=1` all return the same HTML shell instead of exposing a data surface. The obvious sitemap and search surfaces still fail to produce a public county extract, and the county-office rows on disk remain DOI-backed planning rows or dead-host placeholders. Oregon therefore remains blocked because the live successor lane is a real official custom app shell, but it still exposes no public county-grade office extract, query contract, or API surface.';

const PRIORITY_ORDER = [
  'utah','kansas','nebraska','nevada','florida','alaska','south-carolina','north-carolina','new-york','oklahoma','oregon','ohio','minnesota','maine','idaho','arizona','massachusetts','new-mexico','south-dakota','rhode-island','virginia','west-virginia','north-dakota','wisconsin','washington','tennessee','vermont','wyoming','new-hampshire',
];

function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => JSON.parse(l));
}
function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((r) => JSON.stringify(r)).join('\n')}${rows.length ? '\n' : ''}`);
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
    '- That page is not just generic SharePoint markup; the source clearly preserves a custom `<odhs-office-finder />` component plus Leaflet libraries.',
    '- But bounded county, city, and service query-string probes still return the same component shell rather than materializing public office rows.',
    '- One more bounded pass also shows naïve public-contract probes like `/_api/`, `?output=1`, `?format=json`, and `?map=1` all return the same HTML shell instead of a data surface.',
    '- Current county-office rows on disk are still DOI planning rows or dead-host placeholders, so the live component does not replace the stale office family yet.',
    '',
    '## Completion decision',
    '',
    '- Oregon remains `BLOCKED` and `index_safe=false`.',
    '- Education remains cleared by the official county-searchable ODE Combined Directory PDF.',
    '- County-local now fails on a tighter basis: the live official successor is a real custom component shell, but it still exposes no county-grade office extract, query contract, or API surface.',
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
    '- Oklahoma remains blocked because the same OKDHS host can publish county trees for Child Support, but the general disability/local-office lane still stops at 46 counties.',
    '- Oregon remains blocked on county-local routing, and the blocker is now tighter: the live ODHS successor is a real custom office-finder component shell, but bounded query and API-like probes still return only HTML.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit) {
  const blockedSet = new Set(allStateAudit.states.filter((row) => row.classification === 'BLOCKED').map((row) => row.stateId));
  const completeStates = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').map((row) => row.stateName).sort((a,b)=>a.localeCompare(b));
  const blockedRows = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').sort((a,b)=>a.stateName.localeCompare(b.stateName));
  const idx = PRIORITY_ORDER.indexOf('oregon');
  const nextStates = PRIORITY_ORDER.slice(idx + 1).filter((s) => blockedSet.has(s)).slice(0,10).map((s) => {
    const row = allStateAudit.states.find((st) => st.stateId === s);
    return row ? row.stateName : s;
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
    'Oregon has one remaining California-grade blocker: `county_local_disability_resources`. Education is already cleared by the official county-searchable ODE Combined Directory PDF. The county-local lane is no longer blocked by an unknown successor host; it is now blocked because the live ODHS successor is only a custom office-finder component shell with no public county extract, query contract, or API surface.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A live official Oregon county-grade ODHS office export, county list, or public office-result payload behind the current office-finder component.',
    '- County-owned or ODHS-maintained local office leaves covering all 36 counties with direct routing evidence.',
    '- Any public API, JSON, GeoJSON, KML, or export contract from the live office-finder stack that materializes office rows by county.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Dead legacy ODHS locator host](https://dhhs.oregon.gov/locations)',
    '- [Live ODHS office finder](https://www.oregon.gov/odhs/pages/office-finder.aspx)',
    '- [County query probe](https://www.oregon.gov/odhs/pages/office-finder.aspx?county=Baker)',
    '- [City query probe](https://www.oregon.gov/odhs/pages/office-finder.aspx?city=Salem)',
    '- [Service query probe](https://www.oregon.gov/odhs/pages/office-finder.aspx?service=SNAP)',
    '- [API-like probe](https://www.oregon.gov/odhs/pages/office-finder.aspx/_api/)',
    '- [JSON-like probe](https://www.oregon.gov/odhs/pages/office-finder.aspx?format=json)',
    '- [ODE School Directory page](https://www.oregon.gov/ode/about-us/Pages/School-Directory.aspx)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any live public data contract behind the custom `<odhs-office-finder />` component.',
    '- Any county-owned or ODHS-maintained office leaves that bypass the current component shell and directly list county office contact data.',
    '- Any Oregon-hosted export or service endpoint that the office-finder uses client-side but does not expose in the current raw page source.',
    '',
    '## Next State Order After Oregon',
    '',
    ...nextStates.map((stateName, index) => `${index + 1}. ${stateName}`),
  ].join('\n') + '\n';
}

function buildBatchReport(summary) {
  return [
    '# Batch 304 Oregon Office Finder Component Finality Report v1',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    '- change: sharpened the Oregon blocker from generic office-finder shell language to a real custom-component shell that still exposes no public data contract',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch304OregonOfficeFinderComponentFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
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
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: COUNTY_FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, family_status: COUNTY_FAMILY_STATUS, status_reason: 'the live ODHS office-finder is a real official custom component shell, but bounded county/city/service probes and API-like probes still expose no public office rows, county list, query contract, or API surface' }
    : row);

  const updatedFailureRows = failureRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_REASON, next_action: NEXT_ACTION }
    : row);

  const updatedVerifiedRows = verifiedRows.map((row) => row.family === 'county_local_disability_resources'
    ? {
        ...row,
        family_status: COUNTY_FAMILY_STATUS,
        blocker_code: FAILURE_CODE,
        blocker_evidence: COUNTY_REASON,
        evidence_strength: 'medium',
        sample_count: 6,
        samples: [
          { sample_name: 'Live ODHS Office Finder successor root', source_url: 'https://www.oregon.gov/odhs/pages/office-finder.aspx', verification_status: 'reviewed', source_type: 'official_custom_component_shell', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The live page source preserves a custom `<odhs-office-finder />` component plus Leaflet libraries.' },
          { sample_name: 'Bounded county query returns same shell', source_url: 'https://www.oregon.gov/odhs/pages/office-finder.aspx?county=Baker', verification_status: 'blocked', source_type: 'query_probe_same_html_shell', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The county query probe still returns the same `Find an Office` HTML shell with no office rows.' },
          { sample_name: 'Bounded city query returns same shell', source_url: 'https://www.oregon.gov/odhs/pages/office-finder.aspx?city=Salem', verification_status: 'blocked', source_type: 'query_probe_same_html_shell', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The city query probe still returns the same `Find an Office` HTML shell with no office rows.' },
          { sample_name: 'Bounded service query returns same shell', source_url: 'https://www.oregon.gov/odhs/pages/office-finder.aspx?service=SNAP', verification_status: 'blocked', source_type: 'query_probe_same_html_shell', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The service query probe still returns the same `Find an Office` HTML shell with no office rows.' },
          { sample_name: 'API-like probe returns same shell', source_url: 'https://www.oregon.gov/odhs/pages/office-finder.aspx/_api/', verification_status: 'blocked', source_type: 'api_like_probe_same_html_shell', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The `_api` probe returns HTTP 200 on the same HTML shell instead of exposing a public data surface.' },
          { sample_name: 'JSON-like probe returns same shell', source_url: 'https://www.oregon.gov/odhs/pages/office-finder.aspx?format=json', verification_status: 'blocked', source_type: 'api_like_probe_same_html_shell', source_table: 'reviewed_live_probe', fetched_at: '2026-06-23T00:00:00.000Z', evidence_snippet: 'The `?format=json` probe also returns the same HTML shell instead of a public office payload.' },
        ],
      }
    : row);

  const updatedNextRows = nextRows.map((row) => row.family === 'county_local_disability_resources'
    ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: COUNTY_REASON }
    : row);

  const updatedQueueRows = queueRows.map((row) => row.state === 'oregon'
    ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
    : row);

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => row.stateId === 'oregon'
      ? {
          ...row,
          packetBatch: 'batch_304_oregon_office_finder_component_finality_v1',
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          familyStatuses: {
            ...(row.familyStatuses || {}),
            county_local_disability_resources: COUNTY_FAMILY_STATUS,
          },
        }
      : row),
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
    batch: 'batch_304_oregon_office_finder_component_finality_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'oregon',
    classification: 'BLOCKED',
    index_safe: false,
    liveSuccessorOfficeFinderVerified: true,
    customComponentShellVerified: true,
    countyQueryProbeChangedSurface: false,
    cityQueryProbeChangedSurface: false,
    serviceQueryProbeChangedSurface: false,
    apiLikeProbeChangedSurface: false,
    jsonLikeProbeChangedSurface: false,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(updatedSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch304OregonOfficeFinderComponentFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
