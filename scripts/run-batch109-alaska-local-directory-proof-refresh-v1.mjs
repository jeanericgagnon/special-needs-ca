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
  summary: path.join(generatedDir, 'batch109_alaska_local_directory_proof_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch109-alaska-local-directory-proof-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
};

const COUNTY_FAILURE_CODE = 'official_local_directory_domainwide_cloudflare_challenge_and_legacy_locator_404';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 live official Alaska DPA and SDS office-directory candidates on health.alaska.gov, including office-locations, default, contact, newer /en/ paths, and the host-level robots.txt plus sitemap.xml surfaces. Every live health.alaska.gov candidate returned HTTP 403 with cf-mitigated: challenge and the Cloudflare "Just a moment..." shell, while the legacy official locator https://dhss.alaska.gov/locations returned HTTP 404 and the legacy dhss.alaska.gov DPA/DSDS aliases only 302 back into the same challenged host. A bounded browser-assisted check on the exact office-locations leaf still returned HTTP 403 plus the same Cloudflare "Performing security verification" shell, so the current official host is blocked in both static and browser-assisted lanes. No alternate official county-grade office leaf or document was recovered in this bounded pass.';
const COUNTY_STATUS_REASON = 'Official Alaska DPA/SDS office-location, default, contact, newer /en/ paths, robots.txt, and sitemap.xml all return the same Cloudflare challenge shell, the legacy dhss.alaska.gov/locations locator is HTTP 404, and a bounded browser-assisted check on the exact office-locations leaf still returns only the verification shell, so county-grade local-office evidence is blocked at the host level across both static and browser-assisted lanes.';
const COUNTY_NEXT_ACTION = 'hold_blocked_until_official_local_office_directory_is_republished_or_current_official_host_stops_returning_verification_shells';
const LESSON_HEADING = '### Browser-Assisted Rechecks Should End A Challenge Lane When The Exact Official Leaf Still Returns The Verification Shell';
const LESSON_BODY = '*   **Lesson:** If the exact official leaf already fails static fetches and a bounded browser-assisted check still lands on the same `Just a moment...` or `Performing security verification` shell, treat the blocker as current-host-wide and stop reopening sibling URLs. Only a republished official host or a truly different official artifact should reopen the lane.';

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
    '- This bounded pass confirmed the blocker is host-level on the current official Alaska DPA/SDS web stack, not one bad office leaf.',
    '- No alternate official county-grade office leaf or downloadable office directory was recovered during this pass.',
    '- Alaska remains BLOCKED and not index-safe until the official local-office directory is republished on a different reviewable official host or the current official host stops returning the Cloudflare verification shell in both static and browser-assisted lanes.',
  ].join('\n') + '\n';
}

export function generateBatch109AlaskaLocalDirectoryProofRefreshV1() {
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
          query_basis: 'Reviewed live official Alaska DPA/SDS office-location, default, contact, newer /en/ paths, host-level robots.txt, sitemap.xml, and legacy dhss locator aliases; all live host paths resolved to the same Cloudflare challenge shell and the old locator is now a 404.',
          blocker_code: COUNTY_FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          sample_count: 5,
          samples: [
            {
              sample_name: 'Alaska DPA Office Locations',
              source_url: 'https://health.alaska.gov/dpa/Pages/office-locations.aspx',
              final_url: 'https://health.alaska.gov/dpa/Pages/office-locations.aspx',
              verification_status: 'blocked',
              source_type: 'official_browser_challenge',
              source_table: 'reviewed_first_party_artifact',
              fetched_at: '2026-06-22T17:34:32.000Z',
              evidence_snippet: 'The official DPA office-locations leaf returned HTTP 403 with cf-mitigated: challenge and only the Cloudflare "Just a moment..." shell instead of office-by-area content.',
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
              evidence_snippet: 'Even the host-level sitemap.xml returned HTTP 403 with cf-mitigated: challenge, confirming the official host is blocked beyond individual office leaves.',
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
            {
              sample_name: 'Alaska DPA Office Locations Browser Check',
              source_url: 'https://health.alaska.gov/dpa/Pages/office-locations.aspx',
              final_url: 'https://health.alaska.gov/dpa/Pages/office-locations.aspx',
              verification_status: 'blocked',
              source_type: 'official_browser_assisted_challenge',
              source_table: 'reviewed_first_party_artifact',
              fetched_at: '2026-06-22T20:24:00.000Z',
              evidence_snippet: 'A bounded browser-assisted check on the exact office-locations leaf still returned HTTP 403 and the Cloudflare "Performing security verification" shell instead of office-by-area content.',
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
    batch: 'batch_109_alaska_local_directory_proof_refresh_v1',
    generated_at: '2026-06-22T17:40:00.000Z',
    state: 'alaska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_families: ['county_local_disability_resources'],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    host_level_block_confirmed: true,
    lesson_added: lessonAdded,
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Alaska Local Directory Proof Refresh Report v1',
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
  generateBatch109AlaskaLocalDirectoryProofRefreshV1();
}
