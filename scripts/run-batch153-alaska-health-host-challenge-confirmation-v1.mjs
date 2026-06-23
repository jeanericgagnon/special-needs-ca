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
  summary: path.join(generatedDir, 'batch153_alaska_health_host_challenge_confirmation_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch153-alaska-health-host-challenge-confirmation-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
};

const COUNTY_FAILURE_CODE = 'browser_reviewed_dpa_directory_lacks_borough_mapping_and_all_health_host_discovery_surfaces_are_challenge_blocked';
const COUNTY_STATUS_REASON = 'The reviewed official DPA offices page is real, but it still stops at five regional headings and ten office-city leaves with no borough or census-area mapping. Bounded raw fetches now confirm the same health.alaska.gov challenge shell on the page itself plus sitemap and search surfaces, so Alaska still lacks a scraper-safe county-equivalent routing contract.';
const COUNTY_NEXT_ACTION = 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_the_health_host_challenge_clears';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 bounded official Alaska rechecks against the live health host plus narrow official-site probes for borough and census-area routing. The reviewed rendered DPA offices page at https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/ is still a real official directory, but its public contract remains limited to five broad regional headings (Alaska Peninsula, Northern Alaska, Southcentral Alaska, Southeast Alaska, Southwest Alaska) and ten office-city leaves (Homer, Kenai, Fairbanks, Nome, Anchorage, Wasilla, Juneau, Ketchikan, Sitka, Bethel, Kodiak) plus the statewide Virtual Contact Center, with no borough names, no census-area names, and no county-equivalent coverage table. A fresh bounded live probe confirmed the same Cloudflare challenge shell on the exact DPA offices page, on https://health.alaska.gov/sitemap.xml, and on health-host search URLs for Bethel Census Area, Aleutians East Borough, and Nome Census Area public-assistance queries. So Alaska now has both browser-reviewed proof that the current official page is incomplete for county-equivalent routing and raw-fetch proof that the host blocks the exact discovery surfaces needed for a low-token borough-to-office repair.';
const LESSON_HEADING = '### When The Same Official Host Challenge-Blocks The Page, Sitemap, And Search, Stop Low-Token County Retries';
const LESSON_BODY = '*   **Lesson:** If a browser-reviewed official directory still lacks county-equivalent mapping and the same host returns the identical challenge shell on the page itself, sitemap, and official search URLs, treat that family as source-final for low-token work. Alaska health.alaska.gov exposed a real DPA offices page in reviewed rendering, but the raw page, sitemap, and borough-targeted search probes all returned the same Cloudflare shell, so more bounded scraper retries would not produce borough coverage proof.';

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

function updateLessonsFile(filePath) {
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
    '- This bounded pass confirms the blocker is final for low-token repair on the current official host: the reviewed DPA offices page is incomplete for borough or census-area routing, and the same host challenge-blocks the page itself, sitemap discovery, and official-site search probes.',
    '- That means Alaska is not missing one more scrape attempt. It is missing a different official contract: either borough or census-area mapping on the current DPA directory, or a separate official county-equivalent locator that actually names coverage.',
    '- Alaska remains BLOCKED and not index-safe until the state publishes borough or census-area to DPA office mapping on a reviewable official surface or the health-host challenge clears and exposes a stronger county-equivalent contract.',
  ].join('\n') + '\n';
}

export function generateBatch153AlaskaHealthHostChallengeConfirmationV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_dpa_directory_incomplete_and_health_host_challenge_locked',
          status_reason: COUNTY_STATUS_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_dpa_directory_incomplete_and_health_host_challenge_locked',
          query_basis: 'Reviewed the current Alaska DPA offices page in browser-style evidence, then ran a bounded live probe against the exact page, the health-host sitemap, and three borough or census-area public-assistance search URLs to test whether any scraper-safe county-equivalent discovery surface exists on the same official host.',
          blocker_code: COUNTY_FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          sample_count: 14,
          samples: [
            {
              sample_name: 'Alaska DPA Offices',
              source_url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
              final_url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
              verification_status: 'blocked',
              source_type: 'official_office_directory_without_county_equivalent_mapping',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live DPA Offices page preserves five broad regional headings plus named office cities in Homer, Kenai, Fairbanks, Nome, Anchorage, Wasilla, Juneau, Ketchikan, Sitka, Bethel, and Kodiak, but it does not explicitly map Alaska boroughs or census areas to those offices.',
            },
            {
              sample_name: 'Alaska Health Host Sitemap',
              source_url: 'https://health.alaska.gov/sitemap.xml',
              final_url: 'https://health.alaska.gov/sitemap.xml',
              verification_status: 'blocked',
              source_type: 'official_sitemap_challenge_shell',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A fresh bounded probe of the official health host sitemap returned HTTP 403 and the Cloudflare "Just a moment..." shell instead of a reviewable URL inventory.',
            },
            {
              sample_name: 'Alaska Health Search Bethel Census Area Public Assistance',
              source_url: 'https://health.alaska.gov/en/search/?q=Bethel%20Census%20Area%20public%20assistance',
              final_url: 'https://health.alaska.gov/en/search/?q=Bethel%20Census%20Area%20public%20assistance',
              verification_status: 'blocked',
              source_type: 'official_search_challenge_shell',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The borough-targeted official-site search probe returned HTTP 403 and the same Cloudflare challenge shell instead of a county-equivalent office result.',
            },
            {
              sample_name: 'Alaska Health Search Aleutians East Borough Public Assistance',
              source_url: 'https://health.alaska.gov/en/search/?q=Aleutians%20East%20Borough%20public%20assistance',
              final_url: 'https://health.alaska.gov/en/search/?q=Aleutians%20East%20Borough%20public%20assistance',
              verification_status: 'blocked',
              source_type: 'official_search_challenge_shell',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The borough-targeted official-site search probe returned HTTP 403 and the same Cloudflare challenge shell instead of a county-equivalent office result.',
            },
            {
              sample_name: 'Alaska Health Search Nome Census Area Public Assistance',
              source_url: 'https://health.alaska.gov/en/search/?q=Nome%20Census%20Area%20public%20assistance',
              final_url: 'https://health.alaska.gov/en/search/?q=Nome%20Census%20Area%20public%20assistance',
              verification_status: 'blocked',
              source_type: 'official_search_challenge_shell',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The borough-targeted official-site search probe returned HTTP 403 and the same Cloudflare challenge shell instead of a county-equivalent office result.',
            },
            ...row.samples.filter((sample) => ![
              'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
            ].includes(sample.source_url)),
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_FAILURE_CODE, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: COUNTY_FAILURE_CODE,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_EVIDENCE,
      },
    ],
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);

  const lessonsUpdated = updateLessonsFile(INPUTS.lessons);
  const report = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  const batchSummary = {
    state: 'alaska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    county_local_disability_resources_status: 'blocked_dpa_directory_incomplete_and_health_host_challenge_locked',
    dpa_directory_browser_reviewed: true,
    borough_or_census_area_mapping_present: false,
    exact_page_challenge_confirmed: true,
    sitemap_challenge_confirmed: true,
    borough_search_challenge_confirmed: true,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, `${report}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch153AlaskaHealthHostChallengeConfirmationV1();
  console.log(JSON.stringify(result, null, 2));
}
