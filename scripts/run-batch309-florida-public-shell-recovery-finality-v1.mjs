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
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch309_florida_public_shell_recovery_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch309-florida-public-shell-recovery-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON =
  'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_shell_recovers_but_county_results_remain_authenticated_or_shell_only';
const FAILURE_CODE =
  'official_family_resource_center_still_partial_and_current_myaccess_public_shell_recovers_but_office_mapping_stays_shell_or_authenticated';
const FAMILY_STATUS =
  'blocked_partial_storefront_lane_and_current_myaccess_public_shell_without_anonymous_county_results';
const NEXT_ACTION =
  'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_anonymous_myaccess_office_mapping_results_become_public';
const BATCH_NAME = 'batch309_florida_public_shell_recovery_finality_v1';

const STATUS_REASON =
  'Official Florida DCF county-local routing remains blocked after one more bounded live first-party MyACCESS recovery check. The exact `food-cash-and-medical` leaf still routes families only into the partial Family Resource Center storefront lane, and `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county local-office contract. The MyACCESS public lane is readable again, but it still does not expose anonymous county results: the root, `Public/CPCPS`, `config/appconfig.js`, and `asset-manifest.json` are back to HTTP 200, appconfig now exposes `officeMapping: /dataexchangeproxy` plus `CreateCBOAccountService: /dataexchangeproxy`, and the public `dataexchangeproxy` root still replays the same shell. The only exact county-result endpoints still found in the same host family remain `/accountmanagement/getZipCountyDetails` and `/accountmanagement/communityPartnerSearch`, and bounded GET plus POST probes still return HTTP 401 `Unauthorized`. Florida therefore still has no county-complete public local-office contract.';

const EVIDENCE =
  'Reviewed 2026-06-23 bounded live official checks on `https://www.myflfamilies.com/food-cash-and-medical`, `https://familyresourcecenter.myflfamilies.com/providers.csv`, `https://myaccess.myflfamilies.com/`, `https://myaccess.myflfamilies.com/Public/CPCPS`, `https://myaccess.myflfamilies.com/config/appconfig.js`, `https://myaccess.myflfamilies.com/asset-manifest.json`, `https://myaccess.myflfamilies.com/dataexchangeproxy`, `https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails`, and `https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch`. The exact official `food-cash-and-medical` leaf still points families to the Family Resource Center lane, whose reviewed `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county local-office contract. The MyACCESS public lane has recovered from the stale CloudFront-block snapshot: the root, `Public/CPCPS`, `config/appconfig.js`, and `asset-manifest.json` now all return HTTP 200 again. But the recovered public surfaces still do not materialize a county-result contract. Current `appconfig.js` exposes `officeMapping: \'/dataexchangeproxy\'` and `CreateCBOAccountService: \'/dataexchangeproxy\'`, while `/dataexchangeproxy` itself only replays the same generic shell as the root and `Public/CPCPS`. The only exact county-result endpoints still visible in the host family remain `/accountmanagement/getZipCountyDetails` and `/accountmanagement/communityPartnerSearch`, and bounded GET plus POST probes to those endpoints still return HTTP 401 `{\"message\":\"Unauthorized\"}`. Florida therefore remains blocked because the storefront lane is still partial and the recovered MyACCESS public shell still does not expose anonymous county results.';

const LESSON_HEADING = '### A Recovered Public Shell Still Does Not Reopen A County-Result Lane';
const LESSON_BODY =
  '*   **Lesson:** If a previously blocked public SPA host comes back to HTTP 200 on the root, public entry, config, and asset-manifest paths, rerun the exact contract but do not treat the host as repaired until it exposes anonymous result data. Florida MyACCESS recovered to a readable shell, yet `officeMapping` still only pointed to a shell `/dataexchangeproxy` route and the county-result endpoints still returned `401 Unauthorized`.';

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
    '- The exact official `food-cash-and-medical` leaf still routes county-local discovery only into the partial Family Resource Center storefront lane.',
    '- The MyACCESS public shell has recovered to HTTP 200, but the recovered shell, `officeMapping: /dataexchangeproxy`, and asset paths still do not expose anonymous county results.',
    '- The only exact county-result endpoints still visible in the host family remain authenticated-only and return HTTP 401 on bounded anonymous probes.',
    '- Florida should reopen only when a county-complete first-party local-offices directory or anonymous MyACCESS office-mapping result lane becomes public.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));

  return [
    '# Gemini Source Scout Handoff',
    '',
    'Updated: 2026-06-23',
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: Florida',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Florida critical blocker. The live DCF local-offices leaf and Family Resource Center storefront still stop at a partial 34-county contract. MyACCESS is no longer CloudFront-blocked, but its recovered public shell still does not expose anonymous county results: `officeMapping` now points at `/dataexchangeproxy`, that route only replays the same shell, and the only exact county-result endpoints still found in the host family remain authenticated-only.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A first-party Florida DCF or MyACCESS county-complete local-offices directory or export that maps all 67 counties to public assistance / ESS office routing.',
    '- A recovered anonymous official MyACCESS county-result contract that returns real office or community-partner results without authentication.',
    '- A first-party Family Resource Center or DCF local-office lane that expands beyond the current 34-county storefront contract and publishes the full county set.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Florida DCF food-cash-and-medical page](https://www.myflfamilies.com/food-cash-and-medical)',
    '- [Florida Family Resource Center providers.csv](https://familyresourcecenter.myflfamilies.com/providers.csv)',
    '- [MyACCESS root](https://myaccess.myflfamilies.com/)',
    '- [MyACCESS Public CPCPS](https://myaccess.myflfamilies.com/Public/CPCPS)',
    '- [MyACCESS appconfig](https://myaccess.myflfamilies.com/config/appconfig.js)',
    '- [MyACCESS asset manifest](https://myaccess.myflfamilies.com/asset-manifest.json)',
    '- [MyACCESS dataexchangeproxy root](https://myaccess.myflfamilies.com/dataexchangeproxy)',
    '- [MyACCESS getZipCountyDetails](https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails)',
    '- [MyACCESS communityPartnerSearch](https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official DCF or MyACCESS export or API path that materially extends the public county-local contract beyond the 34 counties in `providers.csv`.',
    '- Any exact first-party DCF county office page or local-office directory leaf that is linked from current public-assistance pages but not yet exposed in the current public tree.',
    '- Any anonymous result lane on the official MyACCESS host that returns real county storefront or office rows rather than replaying the public shell.',
    '',
    '## Next State Order After Florida',
    '',
    '1. Alaska',
    '2. New York',
    '3. Oklahoma',
    '4. Oregon',
    '5. Ohio',
    '6. Minnesota',
    '7. Maine',
    '8. Idaho',
    '9. Arizona',
    '10. Massachusetts',
    '',
  ].join('\n');
}

function replaceFloridaAllStateNote(text) {
  const floridaNotes = [
    '- Florida county-local routing is now explicitly sharpened to a partial Family Resource Center storefront plus a currently CloudFront-blocked MyACCESS public lane; the former county-result shell assumptions no longer match the current live contract.',
    '- Florida county-local routing is now explicitly sharpened to the partial Family Resource Center contract plus the public MyACCESS dataexchangeproxy shell lane, not a hidden anonymous API.',
  ];
  let next = text;
  for (const note of floridaNotes) {
    next = next.replace(`${note}\n`, '');
  }
  const replacement = '- Florida county-local routing is still blocked, but the live contract is now sharper again: Family Resource Center remains a 34-county partial storefront and the recovered MyACCESS public shell still routes officeMapping only into shell or authenticated-only county-result paths.';
  if (!next.includes(replacement)) {
    next = `${next.trimEnd()}\n${replacement}\n`;
  }
  return next;
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 309 Florida Public Shell Recovery Finality v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.blocker_family}`,
    `- lessons_updated: ${batchSummary.lessons_updated ? 'true' : 'false'}`,
    '',
    '## What was confirmed',
    '',
    '- `providers.csv` still preserves only 34 distinct county values across 39 rows.',
    '- The exact `food-cash-and-medical` leaf still routes local-office discovery only into the Family Resource Center storefront lane.',
    '- The MyACCESS root, `Public/CPCPS`, `config/appconfig.js`, and `asset-manifest.json` are back to HTTP 200.',
    '- Current `appconfig.js` exposes `officeMapping: /dataexchangeproxy` and `CreateCBOAccountService: /dataexchangeproxy`.',
    '- The public `dataexchangeproxy` root still replays the same shell as the root and `Public/CPCPS`.',
    '- The only exact county-result endpoints still visible in the host family remain `/accountmanagement/getZipCountyDetails` and `/accountmanagement/communityPartnerSearch`, and bounded GET plus POST probes still return HTTP 401 `Unauthorized`.',
    '',
    '## Repair decision',
    '',
    '- Florida remains blocked on missing county-complete local-office proof.',
    '- The current official MyACCESS public lane is readable again, but it still does not expose anonymous county results.',
  ].join('\n') + '\n';
}

export function generateBatch309FloridaPublicShellRecoveryFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
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
    const retained = (row.samples || []).filter((sample) => !String(sample.source_url || '').includes('myaccess.myflfamilies.com'));
    const samples = [
      ...retained,
      {
        sample_name: 'Florida MyACCESS root recovered public shell',
        source_url: 'https://myaccess.myflfamilies.com/',
        final_url: 'https://myaccess.myflfamilies.com/',
        verification_status: 'blocked',
        source_type: 'official_recovered_public_shell',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The root now returns HTTP 200 again but still only replays the generic MyACCESS shell with no county or office result rows.',
      },
      {
        sample_name: 'Florida MyACCESS Public CPCPS recovered shell',
        source_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
        final_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
        verification_status: 'blocked',
        source_type: 'official_recovered_public_shell',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public CPCPS route is back to HTTP 200, but it still replays the same generic shell with no county-result materialization.',
      },
      {
        sample_name: 'Florida MyACCESS appconfig officeMapping contract',
        source_url: 'https://myaccess.myflfamilies.com/config/appconfig.js',
        final_url: 'https://myaccess.myflfamilies.com/config/appconfig.js',
        verification_status: 'blocked',
        source_type: 'official_public_config_js',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'Current appconfig exposes `officeMapping: /dataexchangeproxy` plus `CreateCBOAccountService: /dataexchangeproxy`, but no anonymous county-result endpoint names.',
      },
      {
        sample_name: 'Florida MyACCESS asset manifest recovered assets',
        source_url: 'https://myaccess.myflfamilies.com/asset-manifest.json',
        final_url: 'https://myaccess.myflfamilies.com/asset-manifest.json',
        verification_status: 'blocked',
        source_type: 'official_public_asset_manifest',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The asset manifest is back to HTTP 200 and still points at the same partner-location bundle family, but that recovery does not itself expose county-result data.',
      },
      {
        sample_name: 'Florida MyACCESS dataexchangeproxy recovered shell',
        source_url: 'https://myaccess.myflfamilies.com/dataexchangeproxy',
        final_url: 'https://myaccess.myflfamilies.com/dataexchangeproxy',
        verification_status: 'blocked',
        source_type: 'official_shell_replay',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public dataexchangeproxy root now returns HTTP 200 again, but it only replays the same generic shell rather than exposing anonymous office-mapping results.',
      },
      {
        sample_name: 'Florida MyACCESS anonymous county-result endpoints still unauthorized',
        source_url: 'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
        final_url: 'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
        verification_status: 'blocked',
        source_type: 'official_authenticated_only_endpoint',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'Bounded GET and POST probes to `getZipCountyDetails` and `communityPartnerSearch` still return HTTP 401 `{\"message\":\"Unauthorized\"}`.',
      },
    ];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      query_basis: 'Reviewed 2026-06-23 the official DCF public-assistance leaf, Family Resource Center CSV, and one more bounded live MyACCESS public-shell recovery check.',
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'florida'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: FAMILY_STATUS,
            },
          }
        : row
    )),
  };

  const updatedAllStateQueue = allStateQueue.map((row) => (
    row.state === 'florida'
      ? { ...row, classification: 'BLOCKED', status: 'BLOCKED', primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit));
  fs.writeFileSync(INPUTS.allStateReport, replaceFloridaAllStateNote(fs.readFileSync(INPUTS.allStateReport, 'utf8')));
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    batch: BATCH_NAME,
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'florida',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    storefront_distinct_counties: 34,
    myaccess_root_status: 200,
    public_cpcps_status: 200,
    public_appconfig_status: 200,
    public_asset_manifest_status: 200,
    public_dataexchangeproxy_status: 200,
    accountmanagement_county_details_status: 401,
    accountmanagement_partner_search_status: 401,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch309FloridaPublicShellRecoveryFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
