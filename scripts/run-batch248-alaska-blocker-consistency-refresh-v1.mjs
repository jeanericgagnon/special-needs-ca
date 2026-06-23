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
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch248_alaska_blocker_consistency_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch248-alaska-blocker-consistency-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'browser_only_dpa_directory_lacks_borough_mapping_and_dfcs_successor_hub_only_relays_into_challenged_health_host_leaves';
const FAMILY_STATUS = 'blocked_dpa_directory_incomplete_and_dfcs_successor_hub_only_relays_into_challenged_health_host_leaves';
const PRIMARY_GAP = FAILURE_CODE;
const NEXT_ACTION = 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_replaces_the_dfcs_to_health_host_relay_with_a_reviewable_office_locator';
const EVIDENCE = 'Reviewed 2026-06-23 bounded official Alaska rechecks against the live health host plus the live DFCS successor hub and narrow alternate official-host probes for borough and census-area routing. The reviewed rendered DPA offices page at https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/ is a real official directory, but its public contract remains limited to five broad regional headings (Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, Southwest Alaska) and ten office-city leaves (Homer, Kenai, Fairbanks, Nome, Anchorage, Wasilla, Juneau, Ketchikan, Sitka, Bethel, Kodiak) plus the statewide Virtual Contact Center, with no borough names, no census-area names, and no county-equivalent coverage table. Fresh exact-page raw fetches of that DPA offices URL, the health-host public-assistance search URL, and exact service leaves now linked from the live DFCS Services hub, including Adult Public Assistance and Apply for Medicaid, all return HTTP 403 with the Cloudflare `Just a moment...` shell. The DFCS site itself is reachable, but its Search, Site Map, Publications, and Services pages still expose no borough or census-area office mapping; the Services page only relays users into challenge-blocked health-host leaves. Bounded alternate official-host checks also failed closed: `my.alaska.gov/robots.txt` returns an anti-bot JS gate, `alaska.gov/search?...Division+of+Public+Assistance+offices` returns the state 404 page, and the legacy `dhss.alaska.gov` host exposes only generic robots.txt with no public office successor contract. So Alaska now has browser-reviewed proof that the directory exists, live successor-hub proof that the state only relays to challenged leaves, and raw-fetch proof that no scraper-safe county-equivalent routing contract is presently exposed.';
const STATUS_REASON = 'The official Alaska DPA offices page is only recoverable in browser-reviewed rendering and still stops at five regional headings and ten office-city leaves with no borough or census-area mapping. In the low-token fetch lane, the exact page URL, health-host public-assistance search URL, and the exact Adult Public Assistance / Apply for Medicaid leaves linked from the live DFCS Services hub all fail closed through Cloudflare, while the DFCS site itself exposes no borough or census-area office contract. Alaska therefore still lacks a scraper-safe county-equivalent routing contract.';

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
    '- The only remaining Alaska blocker is county/local disability resources.',
    '- This bounded pass keeps the blocker final for low-token repair on the current official host family: the DPA offices page is only recoverable in browser-reviewed rendering, remains incomplete for borough or census-area routing, and the same host challenge-blocks the exact page URL plus supporting discovery surfaces.',
    '- The live DFCS successor hub does not repair that gap because its own HTML preserves no borough or census-area routing and its service leaves only relay families into challenge-blocked health-host pages.',
    '- Alternate official successors also fail closed: `my.alaska.gov` exposes only an anti-bot JS gate, `alaska.gov/search` does not expose a search contract for this family, and the legacy `dhss.alaska.gov` host preserves no public office successor lane.',
    '- Alaska remains BLOCKED and not index-safe until the state publishes borough or census-area to DPA office mapping on a reviewable official surface or the DFCS-to-health-host relay is replaced by a reviewable office locator.',
  ].join('\n') + '\n';
}

export function generateBatch248AlaskaBlockerConsistencyRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
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
    const samples = row.samples || [];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      query_basis: 'Reviewed the current Alaska DPA offices page in browser-style evidence, then ran bounded raw probes against the page itself, the health-host public-assistance search URL, the exact health-host leaves linked from the live DFCS Services hub, and alternate official hosts.',
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    batch: 'batch248_alaska_blocker_consistency_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'alaska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    blocker_family: 'county_local_disability_resources',
    blocker_code: FAILURE_CODE,
    verified_sample_count: updatedVerifiedRows.find((row) => row.family === 'county_local_disability_resources')?.sample_count ?? 0,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 248 Alaska Blocker Consistency Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- family updated: county_local_disability_resources',
    '',
    '## What changed',
    '',
    '- Reconciled Alaska county-local artifacts to one terminal blocker code tied to the browser-reviewed DPA directory plus the DFCS successor-hub relay failure.',
    '- Removed the older mixed `all_official_successor_hosts_fail_closed` wording from the live state artifacts so the summary, gap matrix, failure ledger, verified sources, and next-action queue all point at the same final blocker.',
    '- Recomputed the verified-source sample count from the stored sample array so the state report no longer overstates evidence volume.',
    '',
    '## Result',
    '',
    '- Alaska remains BLOCKED and index_safe=false.',
    '- The blocker is sharper, not looser: reviewed DPA directory exists, but it lacks borough or census-area mapping; DFCS only relays to challenged health-host leaves; no scraper-safe county-equivalent office contract is publicly exposed.',
  ].join('\n') + '\n';

  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch248AlaskaBlockerConsistencyRefreshV1();
}
