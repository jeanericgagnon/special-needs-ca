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
  summary: path.join(generatedDir, 'batch260_alaska_services_phone_relay_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch260-alaska-services-phone-relay-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged';
const FAILURE_CODE = PRIMARY_GAP_REASON;
const FAMILY_STATUS = 'blocked_live_dfcs_services_page_is_phone_only_and_health_host_directory_remains_challenged';
const NEXT_ACTION = 'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_mapping_on_a_reviewable_official_surface_or_replaces_the_phone_only_dfcs_relay_with_a_reviewable_office_locator';

const STATUS_REASON = 'The live Alaska DFCS Services page is reviewable and now preserves statewide phone routing for Adult Public Assistance and Apply for Medicaid through 888-804-6330, but it still does not provide borough or census-area office mapping. Its exact service links send users to health.alaska.gov leaves that remain Cloudflare-challenged in the low-token lane, and the DFCS contacts surface still exposes no borough or census-area office contract. Alaska therefore still lacks a scraper-safe county-equivalent routing contract.';

const EVIDENCE = 'Reviewed 2026-06-23 bounded official Alaska rechecks against the live DFCS successor hub plus the challenged health host. The current DFCS Services page at https://dfcs.alaska.gov/Pages/Services.aspx is live and publicly reviewable. It now preserves explicit statewide phone-only routing for `Adult Public Assistance` and `Apply for Medicaid`, both with the same statewide number `888-804-6330`, and its exact links point to https://health.alaska.gov/en/services/adult-public-assistance-apa/ and https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/. But those health-host leaves still return HTTP 403 with the Cloudflare `Just a moment...` shell in the low-token lane, just like the reviewed DPA offices directory at https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/ and the legacy office-locations page at https://health.alaska.gov/dpa/Pages/office-locations.aspx. The DFCS Department Contacts page is also live, but it still exposes no borough names, no census-area names, and no Public Assistance or disability office-location mapping contract. So Alaska now has better proof that the successor hub exists and offers statewide program phone routing, but it still lacks a reviewable borough- or census-area-to-office contract and remains blocked.';

const LESSON_HEADING = '### A Live Successor Hub With Statewide Program Phones Still Fails County-Equivalent Routing';
const LESSON_BODY = '*   **Lesson:** If a successor services hub is live and preserves statewide phone routing for named programs but still lacks borough or census-area mapping, do not treat it as county-grade closure. Alaska DFCS now proves real Adult Public Assistance and Medicaid phone relay, but because the linked office directory host remains challenged and no local coverage contract appears on the DFCS pages, the county-local family stays blocked.';

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
    '- Alaska remains BLOCKED and not index-safe.',
    '- The live DFCS Services page is real and preserves statewide phone routing for Adult Public Assistance and Apply for Medicaid, which is stronger than a dead relay story.',
    '- But that same page still does not map boroughs or census areas to local offices, and its exact office-facing health-host links remain challenge-blocked.',
    '- The DFCS contacts page still does not preserve a county-equivalent office contract.',
  ].join('\n') + '\n';
}

export function generateBatch260AlaskaServicesPhoneRelayRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

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

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          query_basis: 'Reviewed 2026-06-23 live Alaska DFCS Services and Department Contacts pages plus exact linked health-host leaves and DPA office directory endpoints.',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          sample_count: 7,
          samples: [
            {
              sample_name: 'Alaska DFCS Services',
              source_url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
              final_url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
              verification_status: 'reviewed',
              source_type: 'official_services_hub_with_statewide_phone_relay',
              source_table: 'batch260_alaska_services_phone_relay_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live DFCS Services page lists Adult Public Assistance and Apply for Medicaid with the same statewide phone number 888-804-6330, but no borough or census-area mapping.',
            },
            {
              sample_name: 'Adult Public Assistance leaf target',
              source_url: 'https://health.alaska.gov/en/services/adult-public-assistance-apa/',
              final_url: 'https://health.alaska.gov/en/services/adult-public-assistance-apa/',
              verification_status: 'blocked',
              source_type: 'official_health_host_challenge',
              source_table: 'batch260_alaska_services_phone_relay_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The exact Adult Public Assistance health-host leaf linked from DFCS still returns the Cloudflare `Just a moment...` shell under bounded low-token fetch.',
            },
            {
              sample_name: 'Apply for Medicaid leaf target',
              source_url: 'https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/',
              final_url: 'https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/',
              verification_status: 'blocked',
              source_type: 'official_health_host_challenge',
              source_table: 'batch260_alaska_services_phone_relay_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The exact Apply for Medicaid health-host leaf linked from DFCS still returns the Cloudflare `Just a moment...` shell under bounded low-token fetch.',
            },
            {
              sample_name: 'Alaska DFCS Department Contacts',
              source_url: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
              final_url: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
              verification_status: 'reviewed',
              source_type: 'official_contacts_without_local_mapping',
              source_table: 'batch260_alaska_services_phone_relay_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live DFCS Department Contacts page exposes agency anchors and statewide contacts but no borough names, census-area names, or Public Assistance office-location contract.',
            },
            {
              sample_name: 'Alaska DPA offices directory',
              source_url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
              final_url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
              verification_status: 'blocked',
              source_type: 'official_health_host_challenge',
              source_table: 'batch260_alaska_services_phone_relay_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The reviewed DPA offices directory remains raw-fetch blocked by the Cloudflare `Just a moment...` shell, so the office list is still not scraper-safe in the low-token lane.',
            },
            {
              sample_name: 'Legacy office locations page',
              source_url: 'https://health.alaska.gov/dpa/Pages/office-locations.aspx',
              final_url: 'https://health.alaska.gov/dpa/Pages/office-locations.aspx',
              verification_status: 'blocked',
              source_type: 'official_health_host_challenge',
              source_table: 'batch260_alaska_services_phone_relay_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The legacy office-locations page also still returns the Cloudflare challenge shell in the low-token lane.',
            },
            {
              sample_name: 'Health host sitemap',
              source_url: 'https://health.alaska.gov/sitemap.xml',
              final_url: 'https://health.alaska.gov/sitemap.xml',
              verification_status: 'blocked',
              source_type: 'official_host_level_challenge',
              source_table: 'batch260_alaska_services_phone_relay_refresh',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The host-level sitemap.xml still returns the Cloudflare challenge shell, confirming the official health host remains scraper-blocked beyond a single leaf.',
            },
          ],
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

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  writeJson(OUTPUTS.summary, {
    batch: 'batch260_alaska_services_phone_relay_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'alaska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    dfcs_services_page_live: true,
    statewide_phone_relay_verified: true,
    local_mapping_still_missing: true,
    lesson_added: lessonAdded,
  });

  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 260 Alaska Services Phone Relay Refresh Report v1',
      '',
      '- classification: BLOCKED',
      '- index_safe: false',
      '- refined_family: county_local_disability_resources',
      `- failure_code: ${FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- Alaska remains blocked and not index-safe.',
      '- The live DFCS Services page proves the successor hub is real and exposes statewide APA/Medicaid phone routing.',
      '- But the page still lacks borough or census-area office mapping, and the office-facing health host remains challenge-blocked.',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch260AlaskaServicesPhoneRelayRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
