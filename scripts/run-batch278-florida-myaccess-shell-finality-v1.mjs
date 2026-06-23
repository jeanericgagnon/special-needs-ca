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
  failures: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch278_florida_myaccess_shell_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch278-florida-myaccess-shell-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_results_stay_authenticated';
const FAILURE_CODE = 'official_family_resource_center_html_and_csv_both_materialize_only_partial_county_contract_while_myaccess_results_stay_authenticated';
const FAMILY_STATUS = 'blocked_official_storefront_root_and_csv_only_cover_partial_county_set_and_authenticated_myaccess_results';
const NEXT_ACTION = 'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_anonymous_myaccess_results_exist';

const STATUS_REASON = 'Official Florida DCF county-local routing remains blocked after one more bounded first-party MyACCESS/config pass. The live public `food-cash-and-medical` leaf still resolves only to the partial Family Resource Center storefront lane, and the first-party storefront still derives its county UI from the same 34-county `providers.csv`. On the MyACCESS side, the public `config/appconfig.js` still wires the county-result search services under `/accountmanagement`, while `/swagger` and `/swagger/index.html` only replay the same generic SPA shell rather than exposing a public API surface. The anonymous county-result endpoints therefore still have no public, county-complete successor contract.';

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
    '- The exact official `food-cash-and-medical` leaf still lands on the partial Family Resource Center storefront lane.',
    '- The MyACCESS public config still routes county-result services through `/accountmanagement`, and the public `/swagger` paths only replay the same generic SPA shell rather than exposing an anonymous API surface.',
    '- Florida should reopen only when a county-complete first-party local-office contract or anonymous county-result lane becomes public.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const focusBlock = [
    '## Current Focus State: Florida',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Florida critical blocker. The live DCF local-offices leaf, the Family Resource Center storefront, the public contacts CSV, and the anonymous MyACCESS result endpoints are all readable enough to prove what is missing: Florida still has no county-complete public local-office contract. One more bounded pass also confirmed the MyACCESS public config still wires the search services through `/accountmanagement`, and the public `/swagger` paths only replay the same SPA shell.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A first-party Florida DCF or MyACCESS county-complete local-offices directory or export that maps all 67 counties to public assistance / ESS office routing.',
    '- An anonymous official MyACCESS county-result contract that returns real office or community-partner results without authentication.',
    '- A first-party Family Resource Center or DCF local-office lane that expands beyond the current 34-county storefront contract and publishes the full county set.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Florida DCF sitemap](https://www.myflfamilies.com/sitemap.xml)',
    '- [Florida DCF contact-us page](https://www.myflfamilies.com/contact-us)',
    '- [Florida DCF contacts.csv](https://www.myflfamilies.com/contact-us/contacts.csv)',
    '- [Florida DCF food-cash-and-medical page](https://www.myflfamilies.com/food-cash-and-medical)',
    '- [Florida Family Resource Center root](https://familyresourcecenter.myflfamilies.com/)',
    '- [Florida Family Resource Center providers.csv](https://familyresourcecenter.myflfamilies.com/providers.csv)',
    '- [MyACCESS Public CPCPS](https://myaccess.myflfamilies.com/Public/CPCPS)',
    '- [MyACCESS Help HCINT](https://myaccess.myflfamilies.com/Help/HCINT)',
    '- [MyACCESS appconfig](https://myaccess.myflfamilies.com/config/appconfig.js)',
    '- [MyACCESS config.json shell](https://myaccess.myflfamilies.com/config/config.json)',
    '- [MyACCESS swagger shell](https://myaccess.myflfamilies.com/swagger)',
    '- [MyACCESS swagger index shell](https://myaccess.myflfamilies.com/swagger/index.html)',
    '- [MyACCESS getZipCountyDetails](https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails)',
    '- [MyACCESS communityPartnerSearch](https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official DCF or MyACCESS export or API path that materially extends the public county-local contract beyond the 34 counties in `providers.csv`.',
    '- Any exact first-party DCF county office page or local-office directory leaf that is linked from current public-assistance pages but not yet exposed in the current sitemap.',
    '- Any anonymous result lane on the official MyACCESS host that returns real county storefront or office rows without an authenticated `/accountmanagement` session.',
    '',
  ].join('\n');
  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n){1,12}/,
    [
      '## Next State Order After Florida',
      '',
      '1. Alaska',
      '2. South Carolina',
      '3. North Carolina',
      '4. New York',
      '5. Oklahoma',
      '6. Oregon',
      '7. Ohio',
      '8. Minnesota',
      '9. Maine',
      '10. Idaho',
    ].join('\n')
  );
  fs.writeFileSync(INPUTS.handoff, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 278 Florida MyACCESS Shell Finality Report v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.blocker_family}`,
    '',
    '## What was confirmed',
    '',
    '- `config/appconfig.js` still routes the county-result search services through `/accountmanagement`.',
    '- `config/config.json`, `/swagger`, and `/swagger/index.html` only replay the same generic MyACCESS SPA shell rather than exposing a public API contract.',
    '- The Family Resource Center root and `providers.csv` remain the only readable county-local storefront lane, and that lane is still partial.',
    '',
    '## Repair decision',
    '',
    '- Florida remains blocked on missing county-complete local-office proof.',
    '- No anonymous MyACCESS public API surface was found in this bounded pass.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch278FloridaMyaccessShellFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const evidence =
    'Reviewed 2026-06-23 one more bounded official Florida county-local pass on the first-party storefront and MyACCESS config shell. The Family Resource Center root at https://familyresourcecenter.myflfamilies.com/ remains live and `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county contract. On the MyACCESS side, https://myaccess.myflfamilies.com/config/appconfig.js still wires the search services through `/accountmanagement`, including the county-result lanes already probed anonymously. Meanwhile https://myaccess.myflfamilies.com/config/config.json, https://myaccess.myflfamilies.com/swagger, and https://myaccess.myflfamilies.com/swagger/index.html all return only the same generic SPA shell rather than a public API description or alternate anonymous result surface. Florida therefore remains blocked because the readable storefront lane is partial and the MyACCESS county-result lane still has no public anonymous contract.';

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
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
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const samples = [
      ...(row.samples || []).filter((sample) => ![
        'Florida MyACCESS appconfig shell contract',
        'Florida MyACCESS swagger shell',
        'Florida MyACCESS config shell',
      ].includes(sample.sample_name)),
      {
        sample_name: 'Florida MyACCESS appconfig shell contract',
        source_url: 'https://myaccess.myflfamilies.com/config/appconfig.js',
        final_url: 'https://myaccess.myflfamilies.com/config/appconfig.js',
        verification_status: 'blocked',
        source_type: 'official_public_config_js',
        source_table: 'batch278_florida_myaccess_shell_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public appconfig still wires communicationPreferenceService and partnerApproverServices to `/accountmanagement` and does not expose a separate anonymous county-result API host.',
      },
      {
        sample_name: 'Florida MyACCESS config shell',
        source_url: 'https://myaccess.myflfamilies.com/config/config.json',
        final_url: 'https://myaccess.myflfamilies.com/config/config.json',
        verification_status: 'blocked',
        source_type: 'official_shell_replay',
        source_table: 'batch278_florida_myaccess_shell_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public config.json path replays the generic MyACCESS SPA shell instead of a machine-readable public config artifact.',
      },
      {
        sample_name: 'Florida MyACCESS swagger shell',
        source_url: 'https://myaccess.myflfamilies.com/swagger/index.html',
        final_url: 'https://myaccess.myflfamilies.com/swagger/index.html',
        verification_status: 'blocked',
        source_type: 'official_shell_replay',
        source_table: 'batch278_florida_myaccess_shell_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public swagger paths replay the same generic MyACCESS SPA shell rather than exposing a live Swagger/OpenAPI surface.',
      },
    ];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: evidence,
      query_basis: 'Reviewed 2026-06-23 the official DCF public-assistance leaves, Family Resource Center root and CSV, and one more bounded MyACCESS config/shell pass.',
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
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();

  const batchSummary = {
    state: 'florida',
    classification: 'BLOCKED',
    blocker_family: 'county_local_disability_resources',
    providers_distinct_counties: 34,
    myaccess_shell_only_paths: [
      'https://myaccess.myflfamilies.com/config/config.json',
      'https://myaccess.myflfamilies.com/swagger',
      'https://myaccess.myflfamilies.com/swagger/index.html',
    ],
    myaccess_accountmanagement_services_still_configured: true,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch278FloridaMyaccessShellFinalityV1();
  console.log('Generated batch278 Florida MyACCESS shell finality artifacts.');
}
