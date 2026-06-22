import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'florida_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'florida_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch144_florida_dead_help_link_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch144-florida-dead-help-link-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const COUNTY_FAILURE_CODE = 'myaccess_embedded_local_office_help_link_is_dead_and_public_bundle_still_lacks_statewide_contract';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/dataexchangeproxy, https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js, https://myaccess.myflfamilies.com/static/js/main.d43b0959.js, and the first-party DCF help URL embedded in the public MyACCESS bundle: https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/ess-storefronts-and-lobbies. The Family Resource Center CSV still preserves reviewed storefront coverage for only 34/67 Florida counties. The public CPCPS entry and plain GET to /dataexchangeproxy both return the same 5165-byte MyACCESS shell instead of county results. Appconfig still exposes officeMapping=/dataexchangeproxy, but the fetched flPartnerLocation bundle only exposes blank location-entry schema fields plus ZIP/county handlers, and the public main bundle still embeds only two county-admin rows for Broward and Dade plus obvious sample rows such as `BigOrganization10` and repeated `Second Harvest` locations. The newly surfaced first-party DCF help link is not a hidden fallback contract either: it now returns the DCF 404 Page Not Found shell. Florida therefore still lacks reviewed first-party county-grade local-routing evidence for the remaining 33 counties.';
const COUNTY_STATUS_REASON = 'Official Florida DCF county-local routing remains blocked because neither the public MyACCESS shell nor the portal’s own embedded local-office help link yields a reviewable statewide county contract. The Family Resource Center CSV still stops at 34 counties, the MyACCESS bundle still exposes only Broward/Dade stubs plus sample data, and the DCF `ess-storefronts-and-lobbies` help path is now a dead 404 shell.';
const COUNTY_NEXT_ACTION = 'hold_county_local_until_first_party_county_dataset_or_documented_anonymous_search_contract_covers_remaining_33_counties';
const LESSON_HEADING = '### Embedded Help Links Inside A Public Portal Must Be Fetched Before They Count As Fallbacks';
const LESSON_BODY = '*   **Lesson:** If a public portal embeds a “find a local office” help URL in its own error text, fetch that exact first-party URL before treating it as a fallback lane. Florida MyACCESS exposed `ess-storefronts-and-lobbies` in the bundle, but the page itself was a DCF 404 shell, so it did not repair county routing.';

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
    '# Florida California-Grade Audit Report v2',
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
    '- Florida remains BLOCKED and not index-safe.',
    '- The reviewed official Family Resource Center CSV still clears only 34 counties.',
    '- The remaining MyACCESS lane is still not a reviewed county-results contract: the public shell and proxy expose only app chrome, the flPartnerLocation bundle is a location-entry form, the main bundle adds only Broward/Dade stubs plus sample rows, and the portal’s own embedded local-office help link now resolves to a DCF 404 page.',
    '- Florida should only reopen county-local once a first-party county dataset or documented anonymous search contract is public for the remaining 33 counties.',
  ].join('\n') + '\n';
}

export function generateBatch144FloridaDeadHelpLinkRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_public_shell_proxy_and_dead_help_link_without_county_rows',
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
          family_status: 'blocked_public_shell_proxy_and_dead_help_link_without_county_rows',
          query_basis: 'Reviewed official DCF Family Resource Center CSV plus the live MyACCESS public shell, appconfig proxy hints, plain proxy GET, the flPartnerLocation form-schema bundle, the public main bundle, and the newly surfaced first-party DCF storefront help URL for a real county-results contract.',
          blocker_code: COUNTY_FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          sample_count: 37,
          samples: [
            ...row.samples,
            {
              sample_name: 'DCF Storefronts And Lobbies Help Link',
              source_url: 'https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/ess-storefronts-and-lobbies',
              final_url: 'https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/ess-storefronts-and-lobbies',
              verification_status: 'blocked',
              source_type: 'official_dead_help_link',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T21:36:00.000Z',
              evidence_snippet: 'The first-party DCF storefronts-and-lobbies URL embedded in the public MyACCESS bundle now returns the DCF 404 Page Not Found shell instead of storefront coverage.',
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
        severity: 'critical',
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_EVIDENCE,
        next_action: COUNTY_NEXT_ACTION,
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
    batch: 'batch_144_florida_dead_help_link_refresh_v1',
    generated_at: '2026-06-22T21:37:00.000Z',
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_families: ['county_local_disability_resources'],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    dead_help_link_confirmed: true,
    lesson_added: lessonAdded,
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Florida Dead Help Link Refresh Report v1',
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
  generateBatch144FloridaDeadHelpLinkRefreshV1();
}
