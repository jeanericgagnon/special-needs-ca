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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch233_alaska_alt_host_finalization_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch233-alaska-alt-host-finalization-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'browser_only_dpa_directory_lacks_borough_mapping_and_all_official_successor_hosts_fail_closed';
const GAP_STATUS = 'blocked_dpa_directory_incomplete_and_all_official_successor_hosts_fail_closed';
const PRIMARY_GAP = 'browser_only_dpa_directory_lacks_borough_mapping_and_all_official_successor_hosts_fail_closed';
const EVIDENCE = 'Reviewed 2026-06-23 bounded official Alaska rechecks against the live health host plus narrow alternate official-host probes for borough and census-area routing. The reviewed rendered DPA offices page at https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/ is a real official directory, but its public contract remains limited to five broad regional headings (Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, Southwest Alaska) and ten office-city leaves (Homer, Kenai, Fairbanks, Nome, Anchorage, Wasilla, Juneau, Ketchikan, Sitka, Bethel, Kodiak) plus the statewide Virtual Contact Center, with no borough names, no census-area names, and no county-equivalent coverage table. A fresh exact-page raw fetch of that same URL returns HTTP 403 with the Cloudflare `Just a moment...` shell, and the same bounded probe confirmed identical challenge behavior on health-host robots.txt and health-host search URLs for `public assistance office` and `Bethel Census Area`. Bounded alternate official-host checks also failed closed: `my.alaska.gov/robots.txt` returns an anti-bot JS gate, `alaska.gov/search?...Division+of+Public+Assistance+offices` returns the state 404 page, and the legacy `dhss.alaska.gov` host exposes only generic robots.txt with no public office successor contract. So Alaska now has browser-reviewed proof that the DPA directory exists, plus raw-fetch proof that the exact page, its discovery surfaces, and alternate official successors all fail closed in the low-token lane.';
const NEXT_ACTION = 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_the_health_host_and_successor_gates_clear';

const LESSON_HEADING = '### Alternate Official Hosts Can Confirm A Final Blocker';
const LESSON_BODY = '*   **Lesson:** If the main official host is blocked, spend one bounded pass on sibling official hosts before declaring the family final. Alaska stayed blocked after `health.alaska.gov` challenge checks, but `my.alaska.gov` only exposed an anti-bot gate and `alaska.gov/search` returned 404, which made the low-token blocker materially stronger.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
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
    '- This bounded pass confirms the blocker is final for low-token repair on the current official host family: the DPA offices page is only recoverable in browser-reviewed rendering, remains incomplete for borough or census-area routing, and the same host challenge-blocks the exact page URL plus supporting discovery surfaces.',
    '- Alternate official successors also fail closed: `my.alaska.gov` exposes only an anti-bot JS gate, `alaska.gov/search` does not expose a search contract for this family, and the legacy `dhss.alaska.gov` host preserves no public office successor lane.',
    '- Alaska remains BLOCKED and not index-safe until the state publishes borough or census-area to DPA office mapping on a reviewable official surface or the health-host and successor gates clear.',
  ].join('\n') + '\n';
}

export function generateBatch233AlaskaAltHostFinalizationV1() {
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
      ? {
          ...row,
          family_status: GAP_STATUS,
          status_reason: 'The official Alaska DPA offices page is only recoverable in browser-reviewed rendering and still stops at five regional headings and ten office-city leaves with no borough or census-area mapping. In the low-token fetch lane, the exact page URL, robots/sitemap/search discovery surfaces on `health.alaska.gov`, and bounded alternate official-host probes all fail closed through Cloudflare, anti-bot JS gating, or no search contract, so Alaska still lacks a scraper-safe county-equivalent routing contract.'
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: GAP_STATUS,
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed the current Alaska DPA offices page in browser-style evidence, then ran bounded raw probes against the page itself, health-host discovery URLs, and alternate official hosts.',
          sample_count: 19,
          samples: [
            ...(row.samples || []),
            {
              sample_name: 'health.alaska.gov robots.txt challenge',
              source_url: 'https://health.alaska.gov/robots.txt',
              final_url: 'https://health.alaska.gov/robots.txt',
              verification_status: 'blocked',
              source_type: 'official_host_discovery_challenge',
              source_table: 'batch233_alaska_alt_host_finalization',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded raw fetch of health.alaska.gov/robots.txt returns HTTP 403 and the Cloudflare `Just a moment...` shell.',
            },
            {
              sample_name: 'health.alaska.gov public assistance search challenge',
              source_url: 'https://health.alaska.gov/search/?q=public+assistance+office',
              final_url: 'https://health.alaska.gov/search/?q=public+assistance+office',
              verification_status: 'blocked',
              source_type: 'official_host_search_challenge',
              source_table: 'batch233_alaska_alt_host_finalization',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The official-site search route returns HTTP 403 and the same Cloudflare shell instead of a searchable public-assistance result contract.',
            },
            {
              sample_name: 'my.alaska.gov anti-bot gate',
              source_url: 'https://my.alaska.gov/robots.txt',
              final_url: 'https://my.alaska.gov/robots.txt',
              verification_status: 'blocked',
              source_type: 'official_successor_host_js_gate',
              source_table: 'batch233_alaska_alt_host_finalization',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The sibling official host returns an anti-bot JS gate with `Please enable JS and disable any ad blocker`, not a public office directory contract.',
            },
            {
              sample_name: 'alaska.gov search 404',
              source_url: 'https://alaska.gov/search?query=Division+of+Public+Assistance+offices',
              final_url: 'https://alaska.gov/search?query=Division+of+Public+Assistance+offices',
              verification_status: 'blocked',
              source_type: 'official_root_search_without_contract',
              source_table: 'batch233_alaska_alt_host_finalization',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The state root search URL returns the official Alaska 404 page and does not expose a successor office-locator contract.',
            }
          ]
        }
      : row
  ));

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

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch233_alaska_alt_host_finalization_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'alaska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    health_host_challenged: true,
    alt_successor_hosts_failed_closed: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 233 Alaska Alt-Host Finalization Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- family updated: county_local_disability_resources',
    '',
    '## What changed',
    '',
    '- Kept the existing DPA offices blocker grounded in the reviewed official directory and raw Cloudflare failures.',
    '- Added one bounded alternate-official-host pass: `my.alaska.gov`, `alaska.gov/search`, and legacy `dhss.alaska.gov` surfaces.',
    '- Confirmed that those alternate hosts also fail closed for this family rather than exposing a borough or census-area office contract.',
    '',
    '## Result',
    '',
    '- Alaska remains BLOCKED and index_safe=false.',
    '- The county-local blocker is now stronger and more final for low-token work: current host challenge-locked, directory incomplete, and alternate official successors non-runnable.',
  ].join('\n') + '\n';

  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch233AlaskaAltHostFinalizationV1();
}
