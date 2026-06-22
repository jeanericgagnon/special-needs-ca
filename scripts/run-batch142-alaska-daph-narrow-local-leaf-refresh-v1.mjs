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
  summary: path.join(generatedDir, 'batch142_alaska_daph_narrow_local_leaf_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch142-alaska-daph-narrow-local-leaf-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
};

const COUNTY_FAILURE_CODE = 'dfcs_site_map_exposes_only_pioneer_home_local_leaves_while_public_assistance_office_routing_stays_blocked';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live official Alaska DFCS site-map, publications, search, and Alaska Pioneer Homes location leaves after the earlier reorg-host check. The DFCS site map and Publications page now prove the reorg host can publish exact local leaves, because they expose /daph/Pages/map.aspx and six named Alaska Pioneer Home location leaves. But those leaves are narrow Pioneer Home facility pages only, not Public Assistance, Medicaid, Senior and Disabilities, or county office-routing resources. The official DFCS search lane for public assistance still returns only the generic search shell without reviewed local-office results, the DFCS Services page still relays Adult Public Assistance and Medicaid users back to challenged health.alaska.gov leaves, and the exact health host office-locations leaf still returns HTTP 403 with the Cloudflare challenge shell. So Alaska now has proof that DFCS can host local pages, but no current official county-grade Public Assistance or disability office directory was recovered.';
const COUNTY_STATUS_REASON = 'Official DFCS local leaves do exist on the reorg host, but only for the narrow Alaska Pioneer Homes program. DFCS still exposes no reviewed Public Assistance, Medicaid, Senior and Disabilities, or county office-routing leaf, its site search does not return a usable local-office result contract, and the exact health host office-locations lane remains challenged.';
const COUNTY_NEXT_ACTION = 'hold_blocked_until_alaska_publishes_a_reviewable_public_assistance_or_disability_office_directory_on_dfcs_or_the_health_host_challenge_clears';
const LESSON_HEADING = '### Narrow Program Local Leaves Do Not Repair A Broader County-Office Family';
const LESSON_BODY = '*   **Lesson:** If an official site map proves the reorg host can publish exact local leaves, verify whether those leaves belong to the blocked program family before treating the host as repaired. Alaska DFCS exposed real Pioneer Home location pages, but that did not repair Public Assistance or disability office routing because the local leaves were for a different, narrower program.';

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
    '- This bounded pass proves the DFCS reorg host can publish exact local leaves, but the only reviewed local family it exposes is Alaska Pioneer Homes.',
    '- That narrows the blocker: Alaska is not missing local leaves in general, but it still lacks a reviewed Public Assistance, Medicaid, Senior and Disabilities, or county office-routing contract on DFCS, while the matching health host remains challenged.',
    '- Alaska remains BLOCKED and not index-safe until the state publishes a reviewable Public Assistance or disability office directory on DFCS or the challenged health host begins serving the current official office-locations content again.',
  ].join('\n') + '\n';
}

export function generateBatch142AlaskaDaphNarrowLocalLeafRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_public_assistance_local_directory_missing_despite_other_dfcs_local_leaves',
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
          family_status: 'blocked_public_assistance_local_directory_missing_despite_other_dfcs_local_leaves',
          query_basis: 'Reviewed live official Alaska DFCS site map, Publications page, search page, and Alaska Pioneer Homes locations page to test whether the reorg host exposed any exact Public Assistance or disability office-routing leaves before falling back to the already-blocked health host office-locations leaf.',
          blocker_code: COUNTY_FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          sample_count: 9,
          samples: [
            {
              sample_name: 'Alaska DFCS Site Map',
              source_url: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
              final_url: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
              verification_status: 'blocked',
              source_type: 'official_site_map_without_public_assistance_directory',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T21:22:11.000Z',
              evidence_snippet: 'The live DFCS site map exposes exact Alaska Pioneer Homes location leaves and narrow division pages, but no Public Assistance, Medicaid office-locations, or county office-routing leaf.',
            },
            {
              sample_name: 'Alaska DFCS Publications',
              source_url: 'https://dfcs.alaska.gov/Pages/Publications.aspx',
              final_url: 'https://dfcs.alaska.gov/Pages/Publications.aspx',
              verification_status: 'blocked',
              source_type: 'official_publications_without_local_office_directory',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T21:22:11.000Z',
              evidence_snippet: 'The Publications page links grant books and planning PDFs, plus the health host mental health plan, but no Public Assistance, Medicaid, or disability office directory artifact.',
            },
            {
              sample_name: 'Alaska DFCS Search Public Assistance',
              source_url: 'https://dfcs.alaska.gov/pages/search.aspx?k=public%20assistance',
              final_url: 'https://dfcs.alaska.gov/pages/search.aspx?k=public%20assistance',
              verification_status: 'blocked',
              source_type: 'official_search_shell_without_reviewed_results',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T21:22:29.000Z',
              evidence_snippet: 'The official DFCS search lane for public assistance returned only the generic DFCS site search shell and did not expose a reviewed local-office result contract in fetched HTML.',
            },
            {
              sample_name: 'Alaska Pioneer Home Locations',
              source_url: 'https://dfcs.alaska.gov/daph/Pages/map.aspx',
              final_url: 'https://dfcs.alaska.gov/daph/Pages/map.aspx',
              verification_status: 'blocked',
              source_type: 'official_narrow_program_local_leaves',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T21:22:31.000Z',
              evidence_snippet: 'The Alaska Pioneer Home Locations page is live and links six named facility leaves in Anchorage, Fairbanks, Juneau, Ketchikan, Palmer, and Sitka, proving DFCS can host local pages, but these are Pioneer Home facilities rather than Public Assistance or disability office-routing pages.',
            },
            {
              sample_name: 'Alaska DFCS Services',
              source_url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
              final_url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
              verification_status: 'blocked',
              source_type: 'official_reorg_services_relay',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T00:00:00.000Z',
              evidence_snippet: 'The live DFCS Services page links Adult Public Assistance and Apply for Medicaid, but both routes send families back to health.alaska.gov leaves rather than a reviewable local office directory.',
            },
            {
              sample_name: 'Alaska DFCS Department Contacts',
              source_url: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
              final_url: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
              verification_status: 'blocked',
              source_type: 'official_contacts_without_program_routing',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T00:00:00.000Z',
              evidence_snippet: 'The live DFCS Department Contacts page contains no Public Assistance, Medicaid, Senior and Disabilities, or office-location routing terms that could satisfy county-grade local office evidence.',
            },
            {
              sample_name: 'Alaska DPA Office Locations',
              source_url: 'https://health.alaska.gov/dpa/Pages/office-locations.aspx',
              final_url: 'https://health.alaska.gov/dpa/Pages/office-locations.aspx',
              verification_status: 'blocked',
              source_type: 'official_browser_challenge',
              source_table: 'reviewed_first_party_artifact',
              fetched_at: '2026-06-22T17:34:32.000Z',
              evidence_snippet: 'The exact health-host office-locations leaf returned HTTP 403 with cf-mitigated: challenge and only the Cloudflare "Just a moment..." shell instead of office-by-area content.',
            },
            {
              sample_name: 'Alaska SDS Contact Us',
              source_url: 'https://health.alaska.gov/en/senior-and-disabilities-services/contact-us/',
              final_url: 'https://health.alaska.gov/en/senior-and-disabilities-services/contact-us/',
              verification_status: 'blocked',
              source_type: 'official_browser_challenge',
              source_table: 'reviewed_first_party_artifact',
              fetched_at: '2026-06-22T21:22:30.000Z',
              evidence_snippet: 'The newer SDS contact leaf still returns HTTP 403 with cf-mitigated: challenge, so the current health host remains blocked for the matching disability office-routing lane.',
            },
            {
              sample_name: 'Legacy Alaska DHSS Locations',
              source_url: 'https://dhss.alaska.gov/locations',
              final_url: 'https://dhss.alaska.gov/locations',
              verification_status: 'blocked',
              source_type: 'official_legacy_404',
              source_table: 'reviewed_first_party_artifact',
              fetched_at: '2026-06-22T17:35:07.000Z',
              evidence_snippet: 'The legacy official locator path returned HTTP 404, so it cannot be used as a county-grade replacement for the challenged current host.',
            },
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

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  const lessonAdded = updateLessonsFile(INPUTS.lessons);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_142_alaska_daph_narrow_local_leaf_refresh_v1',
    generated_at: '2026-06-22T21:23:00.000Z',
    state: 'alaska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_families: ['county_local_disability_resources'],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    dfcs_site_map_exposes_local_leaves: true,
    public_assistance_directory_recovered: false,
    lesson_added: lessonAdded,
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Alaska DAPH Narrow Local Leaf Refresh Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      '- refined_family: county_local_disability_resources',
      `- failure_code: ${COUNTY_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${COUNTY_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch142AlaskaDaphNarrowLocalLeafRefreshV1();
}
