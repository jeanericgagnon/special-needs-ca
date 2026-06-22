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
  summary: path.join(generatedDir, 'batch137_alaska_dfcs_reorg_root_check_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch137-alaska-dfcs-reorg-root-check-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
};

const COUNTY_FAILURE_CODE = 'dfcs_reorg_root_relays_back_to_challenged_health_host_and_no_public_assistance_contacts_exist';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live official Alaska reorg-host checks on https://dfcs.alaska.gov/Pages/default.aspx, https://dfcs.alaska.gov/Pages/Services.aspx, and https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx, plus the already-blocked exact health host leaf https://health.alaska.gov/dpa/Pages/office-locations.aspx. The reorg DFCS root is live and the Services page exposes Adult Public Assistance and Apply for Medicaid links, but both point families back to health.alaska.gov leaves instead of a reviewable local office directory. The DFCS Department Contacts page contains no Public Assistance, Medicaid, Senior and Disabilities, or office-location routing terms, while the exact health host office-locations leaf still returns HTTP 403 with the Cloudflare \"Just a moment...\" shell. The legacy official locator https://dhss.alaska.gov/locations remains HTTP 404, so no current official county-grade local-office replacement was recovered.';
const COUNTY_STATUS_REASON = 'The live Alaska DFCS reorg root does not repair county-grade office routing: its Services page only relays Adult Public Assistance and Medicaid users back to challenged health.alaska.gov leaves, its Department Contacts page has no Public Assistance or disability office-routing section, the exact health host office-locations leaf still returns the Cloudflare verification shell, and the legacy locator is HTTP 404.';
const COUNTY_NEXT_ACTION = 'hold_blocked_until_alaska_publishes_a_reviewable_public_assistance_or_disability_office_directory_on_dfcs_or_the_health_host_challenge_clears';
const LESSON_HEADING = '### Live Reorg Roots That Only Relay Back To A Blocked Host Do Not Repair Local Office Routing';
const LESSON_BODY = '*   **Lesson:** If a new official reorg host loads but its service links only send families back to the same challenged or broken host, and its contacts page lacks the program-specific office-routing terms, treat it as a non-repairing relay surface. Do not count the reorg root as a local-office replacement.';

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
    '- This bounded pass confirms the live DFCS reorg host is real but does not provide a Public Assistance or disability office directory that repairs county-grade routing.',
    '- The DFCS Services page only relays Adult Public Assistance and Medicaid users back to the same challenged health host, and the DFCS contacts page carries no program-specific office-routing section.',
    '- Alaska remains BLOCKED and not index-safe until the state publishes a reviewable office directory on DFCS or the challenged health host begins serving the current official office-locations content again.',
  ].join('\n') + '\n';
}

export function generateBatch137AlaskaDfcsReorgRootCheckV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, status_reason: COUNTY_STATUS_REASON }
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
          query_basis: 'Reviewed live official Alaska DFCS reorg root, Services page, and Department Contacts page, then checked whether they exposed a usable Public Assistance or disability office directory before falling back to the already-blocked health host office-locations leaf.',
          blocker_code: COUNTY_FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          sample_count: 7,
          samples: [
            {
              sample_name: 'Alaska DFCS Root',
              source_url: 'https://dfcs.alaska.gov/Pages/default.aspx',
              final_url: 'https://dfcs.alaska.gov/Pages/default.aspx',
              verification_status: 'blocked',
              source_type: 'official_reorg_root_nonlocal',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T00:00:00.000Z',
              evidence_snippet: 'The live DFCS reorg root loaded successfully but did not itself expose a Public Assistance or disability office directory.',
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
              fetched_at: '2026-06-22T17:35:09.000Z',
              evidence_snippet: 'The newer SDS contact leaf also returned only the Cloudflare challenge shell, so the block is not limited to the legacy /Pages/ path pattern.',
            },
            {
              sample_name: 'Alaska Health Sitemap',
              source_url: 'https://health.alaska.gov/sitemap.xml',
              final_url: 'https://health.alaska.gov/sitemap.xml',
              verification_status: 'blocked',
              source_type: 'official_host_level_challenge',
              source_table: 'reviewed_first_party_artifact',
              fetched_at: '2026-06-22T17:34:33.000Z',
              evidence_snippet: 'Even the host-level sitemap.xml returned HTTP 403 with cf-mitigated: challenge, confirming the official health host is blocked beyond individual office leaves.',
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
    batch: 'batch_137_alaska_dfcs_reorg_root_check_v1',
    generated_at: '2026-06-22T00:00:00.000Z',
    state: 'alaska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_families: ['county_local_disability_resources'],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    dfcs_reorg_root_live: true,
    dfcs_reorg_root_repaired_county_directory: false,
    lesson_added: lessonAdded,
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Alaska DFCS Reorg Root Check Report v1',
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
  generateBatch137AlaskaDfcsReorgRootCheckV1();
}
