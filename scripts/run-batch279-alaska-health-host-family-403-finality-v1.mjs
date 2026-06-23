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
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch279_alaska_health_host_family_403_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch279-alaska-health-host-family-403-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged';
const FAILURE_CODE = 'live_dfcs_services_page_is_phone_only_and_entire_health_host_family_stays_403_challenged';
const FAMILY_STATUS = 'blocked_live_dfcs_phone_relay_plus_exhausted_dfcs_host_and_challenged_health_directory';
const NEXT_ACTION = 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_replaces_the_phone_only_dfcs_relay_with_a_reviewable_office_locator';

const STATUS_REASON =
  'The live Alaska DFCS Services page is still only a statewide phone relay, and one more bounded health-host family pass shows the office-routing lane remains completely challenge-blocked on the current official health host. Not just the exact office and service leaves, but also `robots.txt`, `sitemap.xml`, `wp-json`, `wp-sitemap.xml`, and the parent `en/resources` and `en/services` roots all return the same HTTP 403 Cloudflare `Just a moment...` shell. That means the county-equivalent office directory family is not merely blocked on one leaf; the entire current health-host discovery surface is unavailable in the low-token lane.';

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

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
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
    '- The health host is now source-final more tightly: not only the office leaves, but also robots, sitemap, wp-json, wp-sitemap, and parent resources/services roots all return the same 403 Cloudflare shell.',
    '- Alaska therefore still lacks any reviewable borough- or census-area-to-office contract on a public official surface.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const focusBlock = [
    '## Current Focus State: Alaska',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Alaska critical blocker. The live DFCS successor host is exhausted and preserves only statewide phone routing, while the current official health-host family is challenge-blocked end to end: exact office leaves, parent service/resource roots, and even low-cost discovery surfaces like `robots.txt`, `sitemap.xml`, `wp-json`, and `wp-sitemap.xml` all return the same 403 Cloudflare shell.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Alaska surface that maps boroughs or census areas to DPA or Medicaid office locations on a publicly reviewable host.',
    '- Any reviewable successor office locator or directory that lives on `dfcs.alaska.gov` or another current official Alaska host instead of only on the challenge-blocked `health.alaska.gov` family.',
    '- Any official document, export, or table that explicitly enumerates Alaska borough or census-area coverage for public assistance office routing.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Alaska DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)',
    '- [Alaska DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)',
    '- [Alaska DFCS Publications](https://dfcs.alaska.gov/Pages/Publications.aspx)',
    '- [Alaska DFCS robots.txt](https://dfcs.alaska.gov/robots.txt)',
    '- [Alaska DFCS sitemap.xml](https://dfcs.alaska.gov/sitemap.xml)',
    '- [Alaska DFCS search for public assistance](https://dfcs.alaska.gov/search/pages/results.aspx?k=public%20assistance)',
    '- [Alaska DFCS search for office](https://dfcs.alaska.gov/search/pages/results.aspx?k=office)',
    '- [Alaska health robots.txt](https://health.alaska.gov/robots.txt)',
    '- [Alaska health sitemap.xml](https://health.alaska.gov/sitemap.xml)',
    '- [Alaska health wp-json](https://health.alaska.gov/wp-json/)',
    '- [Alaska health wp-sitemap.xml](https://health.alaska.gov/wp-sitemap.xml)',
    '- [Alaska health resources root](https://health.alaska.gov/en/resources/)',
    '- [Alaska health services root](https://health.alaska.gov/en/services/)',
    '- [Alaska Adult Public Assistance leaf](https://health.alaska.gov/en/services/adult-public-assistance-apa/)',
    '- [Alaska Apply for Medicaid leaf](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)',
    '- [Alaska DPA offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)',
    '- [Alaska legacy office locations](https://health.alaska.gov/dpa/Pages/office-locations.aspx)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any current Alaska host outside `health.alaska.gov` that now publishes a borough- or census-area DPA office directory.',
    '- Any official Alaska PDF, spreadsheet, or office-contact table that names specific borough or census-area coverage for public assistance offices.',
    '- Any future public relaxation on the health host that makes the DPA office directory or Medicaid application leaves scraper-reviewable without the Cloudflare shell.',
    '',
  ].join('\n');
  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n){1,12}/,
    [
      '## Next State Order After Alaska',
      '',
      '1. South Carolina',
      '2. North Carolina',
      '3. New York',
      '4. Oklahoma',
      '5. Oregon',
      '6. Ohio',
      '7. Minnesota',
      '8. Maine',
      '9. Idaho',
      '10. Arizona',
    ].join('\n')
  );
  fs.writeFileSync(INPUTS.handoff, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 279 Alaska Health Host Family 403 Finality Report v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.blocker_family}`,
    '',
    '## What was confirmed',
    '',
    '- The exact health-host office and service leaves still return the same 403 Cloudflare shell.',
    '- `robots.txt`, `sitemap.xml`, `wp-json`, and `wp-sitemap.xml` on the same host also return that same shell.',
    '- The parent `en/resources` and `en/services` roots are likewise challenged, so there is no low-cost public discovery surface left on the current health host family.',
    '',
    '## Repair decision',
    '',
    '- Alaska remains blocked on missing reviewable borough/census-area office routing.',
    '- The current health-host family is now source-final in the low-token lane, not just leaf-final.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch279AlaskaHealthHostFamily403FinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const evidence =
    'Reviewed 2026-06-23 one more bounded official Alaska county-local pass on the current health host family. The exact office and service leaves still return HTTP 403 with the Cloudflare `Just a moment...` shell, but now the surrounding discovery surfaces prove the same thing: https://health.alaska.gov/robots.txt, https://health.alaska.gov/sitemap.xml, https://health.alaska.gov/wp-json/, https://health.alaska.gov/wp-sitemap.xml, https://health.alaska.gov/en/resources/, and https://health.alaska.gov/en/services/ all return that same 403 shell. Together with the already-exhausted `dfcs.alaska.gov` successor host, that means the current official office-routing lane is blocked across the entire health-host family, not just on one directory leaf. Alaska therefore still lacks any reviewable borough- or census-area-to-office contract on a public official surface.';

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        failure_code: FAILURE_CODE,
        evidence,
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
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const samples = [
      ...(row.samples || []).filter((sample) => ![
        'Alaska health robots 403 shell',
        'Alaska health sitemap 403 shell',
        'Alaska health wp-json 403 shell',
        'Alaska health resources root 403 shell',
      ].includes(sample.sample_name)),
      {
        sample_name: 'Alaska health robots 403 shell',
        source_url: 'https://health.alaska.gov/robots.txt',
        final_url: 'https://health.alaska.gov/robots.txt',
        verification_status: 'blocked',
        source_type: 'official_health_host_family_403_shell',
        source_table: 'batch279_alaska_health_host_family_403_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'Even robots.txt on the current health host returns the Cloudflare `Just a moment...` shell instead of a public crawl contract.',
      },
      {
        sample_name: 'Alaska health sitemap 403 shell',
        source_url: 'https://health.alaska.gov/sitemap.xml',
        final_url: 'https://health.alaska.gov/sitemap.xml',
        verification_status: 'blocked',
        source_type: 'official_health_host_family_403_shell',
        source_table: 'batch279_alaska_health_host_family_403_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The health-host sitemap route returns the same Cloudflare shell, so there is no public sitemap-backed discovery path on this host family.',
      },
      {
        sample_name: 'Alaska health wp-json 403 shell',
        source_url: 'https://health.alaska.gov/wp-json/',
        final_url: 'https://health.alaska.gov/wp-json/',
        verification_status: 'blocked',
        source_type: 'official_health_host_family_403_shell',
        source_table: 'batch279_alaska_health_host_family_403_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The health-host wp-json route is also challenge-blocked, so there is no public CMS or API discovery surface in the low-token lane.',
      },
      {
        sample_name: 'Alaska health resources root 403 shell',
        source_url: 'https://health.alaska.gov/en/resources/',
        final_url: 'https://health.alaska.gov/en/resources/',
        verification_status: 'blocked',
        source_type: 'official_health_host_family_403_shell',
        source_table: 'batch279_alaska_health_host_family_403_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The parent resources root itself returns the same 403 Cloudflare shell, so the entire office-directory family remains unavailable on the health host.',
      },
    ];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      query_basis: 'Reviewed 2026-06-23 the live DFCS relay pages plus one more bounded pass across the current health-host family discovery surfaces.',
      blocker_code: FAILURE_CODE,
      blocker_evidence: evidence,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();

  const batchSummary = {
    state: 'alaska',
    classification: 'BLOCKED',
    blocker_family: 'county_local_disability_resources',
    health_host_family_403: true,
    challenged_urls: [
      'https://health.alaska.gov/robots.txt',
      'https://health.alaska.gov/sitemap.xml',
      'https://health.alaska.gov/wp-json/',
      'https://health.alaska.gov/wp-sitemap.xml',
      'https://health.alaska.gov/en/resources/',
      'https://health.alaska.gov/en/services/',
    ],
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch279AlaskaHealthHostFamily403FinalityV1();
  console.log('Generated batch279 Alaska health host family 403 finality artifacts.');
}
