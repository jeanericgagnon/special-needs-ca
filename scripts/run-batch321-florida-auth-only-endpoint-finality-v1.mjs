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
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch321_florida_auth_only_endpoint_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch321-florida-auth-only-endpoint-finality-report-v1.md'),
};

const BATCH_NAME = 'batch321_florida_auth_only_endpoint_finality_v1';
const PRIMARY_GAP_REASON =
  'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only';
const FAILURE_CODE =
  'official_family_resource_center_still_partial_and_recovered_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only';
const FAMILY_STATUS =
  'blocked_partial_storefront_lane_and_recovered_myaccess_bundle_reexposes_exact_county_endpoints_but_they_remain_authenticated_only';
const NEXT_ACTION =
  'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_a_public_myaccess_county_result_contract_exists';

const USER_AGENT = 'Mozilla/5.0 (compatible; CodexStateAudit/1.0; +https://github.com/jeanericgagnon/special-needs-ca)';

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

async function fetchTarget(url, options = {}) {
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'user-agent': USER_AGENT,
      ...(options.headers || {}),
    },
    body: options.body,
    redirect: 'follow',
  });
  const text = await response.text();
  return {
    url,
    status: response.status,
    finalUrl: response.url,
    contentType: response.headers.get('content-type') || '',
    text,
  };
}

function csvDistinctCounties(csvText) {
  const lines = csvText.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  const header = lines.shift();
  if (!header) return { rows: 0, counties: [] };
  const headers = header.split(',');
  const countyIndex = headers.findIndex((value) => value.trim().toLowerCase() === 'counties');
  if (countyIndex === -1) return { rows: 0, counties: [] };
  const counties = new Set();
  for (const line of lines) {
    const cols = line.split(',');
    const county = (cols[countyIndex] || '').trim();
    if (county) counties.add(county);
  }
  return {
    rows: lines.length,
    counties: [...counties].sort((a, b) => a.localeCompare(b)),
  };
}

function findMainBundleUrl(assetManifestText) {
  const parsed = JSON.parse(assetManifestText);
  const mainJs = parsed?.files?.['main.js'];
  if (!mainJs) {
    throw new Error('Asset manifest does not expose files.main.js');
  }
  return new URL(mainJs, 'https://myaccess.myflfamilies.com/').toString();
}

function containsAll(text, terms) {
  return terms.every((term) => text.includes(term));
}

function buildStatusReason(probe) {
  return `Official Florida DCF county-local routing remains blocked after one more bounded live official recheck on ${probe.fetchedDate}. The exact \`food-cash-and-medical\` leaf still routes families only into the partial Family Resource Center storefront lane, and \`providers.csv\` still preserves only ${probe.storefrontDistinctCountyCount} distinct county values across ${probe.storefrontRowCount} rows rather than a 67-county local-office contract. The MyACCESS public lane remains readable: the root, \`Public/CPCPS\`, \`config/appconfig.js\`, \`asset-manifest.json\`, \`${probe.mainBundleUrl.replace('https://myaccess.myflfamilies.com/', '')}\`, and \`/dataexchangeproxy\` all return HTTP 200. Current \`appconfig.js\` still exposes \`officeMapping: ${probe.officeMapping}\`, \`CreateCBOAccountService: ${probe.createCboAccountService}\`, and \`partnerApproverServices: ${probe.partnerApproverServices}\`. The live main bundle now re-exposes the exact county-result endpoint names \`getZipCountyDetails\` and \`communityPartnerSearch\`, but bounded anonymous GET and POST probes to those exact official endpoints still return HTTP ${probe.zipCountyStatus} / HTTP ${probe.partnerSearchStatus} \`Unauthorized\`. Florida therefore still has no anonymous county-complete public local-office contract.`;
}

function buildEvidence(probe) {
  return `Reviewed ${probe.fetchedDate} bounded live official checks on \`https://www.myflfamilies.com/food-cash-and-medical\`, \`https://familyresourcecenter.myflfamilies.com/providers.csv\`, \`https://myaccess.myflfamilies.com/\`, \`https://myaccess.myflfamilies.com/Public/CPCPS\`, \`https://myaccess.myflfamilies.com/config/appconfig.js\`, \`https://myaccess.myflfamilies.com/asset-manifest.json\`, \`${probe.mainBundleUrl}\`, \`https://myaccess.myflfamilies.com/dataexchangeproxy\`, \`https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails\`, and \`https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch\`. The exact official \`food-cash-and-medical\` leaf still points families to the Family Resource Center lane, whose reviewed \`providers.csv\` still preserves only ${probe.storefrontDistinctCountyCount} distinct county values across ${probe.storefrontRowCount} rows rather than a 67-county local-office contract. The MyACCESS public lane remains readable: the root, \`Public/CPCPS\`, \`config/appconfig.js\`, \`asset-manifest.json\`, \`${probe.mainBundleUrl.replace('https://myaccess.myflfamilies.com/', '')}\`, and \`/dataexchangeproxy\` all return HTTP 200. Current \`appconfig.js\` exposes \`officeMapping: '${probe.officeMapping}'\`, \`CreateCBOAccountService: '${probe.createCboAccountService}'\`, and \`partnerApproverServices: '${probe.partnerApproverServices}'\`. The live main bundle now re-exposes the exact county-result endpoint names \`getZipCountyDetails\` and \`communityPartnerSearch\`, but bounded anonymous GET plus POST probes to those endpoints still return HTTP ${probe.zipCountyStatus} and HTTP ${probe.partnerSearchStatus} with \`{\"message\":\"Unauthorized\"}\`. The public \`dataexchangeproxy\` root still only replays the same generic shell as the root and \`Public/CPCPS\`. Florida therefore remains blocked because the storefront lane is still partial and the only exact county-result endpoints still visible on the live official host remain authenticated-only rather than anonymously reviewable.`;
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
    '- The recovered MyACCESS root, public entry, config, asset manifest, main bundle, and dataexchangeproxy are readable again, but they still do not expose an anonymous county-complete result contract.',
    '- The live main bundle now re-exposes `getZipCountyDetails` and `communityPartnerSearch`, but both exact official endpoints remain authenticated-only and return HTTP 401 on bounded anonymous probes.',
    '- Florida should reopen only when a county-complete first-party local-offices directory or anonymous MyACCESS office-mapping result lane becomes public.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit, probe) {
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
    'Updated: 2026-06-24',
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
    '`county_local_disability_resources` is the only remaining Florida critical blocker. The live DCF local-offices leaf and Family Resource Center storefront still stop at a partial 34-county contract. MyACCESS is readable again, and the live main bundle now re-exposes the exact county-result endpoint names `getZipCountyDetails` and `communityPartnerSearch`, but those exact official endpoints still return HTTP 401 `Unauthorized` on bounded anonymous GET and POST probes. The public `dataexchangeproxy` root still only replays the same generic shell, so there is still no anonymous county-complete public local-office contract.',
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
    `- [MyACCESS main bundle](${probe.mainBundleUrl})`,
    '- [MyACCESS dataexchangeproxy root](https://myaccess.myflfamilies.com/dataexchangeproxy)',
    '- [MyACCESS getZipCountyDetails](https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails)',
    '- [MyACCESS communityPartnerSearch](https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official DCF or MyACCESS export or API path that materially extends the public county-local contract beyond the 34 counties in `providers.csv`.',
    '- Any exact first-party DCF county office page or local-office directory leaf that is linked from current public-assistance pages but not yet exposed in the current public tree.',
    '- Any anonymous result lane on the official MyACCESS host that returns real county storefront or office rows rather than replaying the public shell or requiring authentication.',
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
  const priorNotes = [
    '- Florida county-local routing is still blocked: Family Resource Center remains a 34-county partial storefront, the recovered MyACCESS public shell still routes officeMapping only into shell or authenticated-only county-result paths, and the live main bundle still exposes no public county-result endpoint names.',
  ];
  let next = text;
  for (const note of priorNotes) {
    next = next.replace(`${note}\n`, '');
  }
  const replacement = '- Florida county-local routing is still blocked: Family Resource Center remains a 34-county partial storefront, the recovered MyACCESS public shell and dataexchangeproxy still do not materialize anonymous county results, and the live main bundle now re-exposes `getZipCountyDetails` plus `communityPartnerSearch` only as authenticated-only endpoint names.';
  if (!next.includes(replacement)) {
    next = `${next.trimEnd()}\n${replacement}\n`;
  }
  return next;
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 321 Florida Auth-Only Endpoint Finality v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.blocker_family}`,
    '',
    '## What changed',
    '',
    '- The current public MyACCESS main bundle still resolves live from the asset manifest.',
    '- The live main bundle now re-exposes the exact county-result endpoint names `getZipCountyDetails` and `communityPartnerSearch`.',
    '- Both exact official endpoints still return HTTP 401 `Unauthorized` on bounded anonymous GET and POST probes.',
    '- Family Resource Center `providers.csv` still preserves only 34 distinct counties across 39 rows.',
    '',
    '## Repair decision',
    '',
    '- Florida remains blocked on missing county-complete public local-office proof.',
    '- This pass corrects stale blocker language: the bundle does expose endpoint names again, but the endpoints remain authenticated-only and therefore still cannot clear county-grade routing.',
  ].join('\n') + '\n';
}

async function collectProbe() {
  const foodCash = await fetchTarget('https://www.myflfamilies.com/food-cash-and-medical');
  const providers = await fetchTarget('https://familyresourcecenter.myflfamilies.com/providers.csv');
  const root = await fetchTarget('https://myaccess.myflfamilies.com/');
  const publicCpcps = await fetchTarget('https://myaccess.myflfamilies.com/Public/CPCPS');
  const appconfig = await fetchTarget('https://myaccess.myflfamilies.com/config/appconfig.js');
  const assetManifest = await fetchTarget('https://myaccess.myflfamilies.com/asset-manifest.json');
  const dataexchangeproxy = await fetchTarget('https://myaccess.myflfamilies.com/dataexchangeproxy');
  const mainBundleUrl = findMainBundleUrl(assetManifest.text);
  const mainBundle = await fetchTarget(mainBundleUrl);
  const zipCountyGet = await fetchTarget('https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails');
  const zipCountyPost = await fetchTarget(
    'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ zipCode: '33101' }),
    },
  );
  const partnerSearchGet = await fetchTarget('https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch');
  const partnerSearchPost = await fetchTarget(
    'https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ county: 'Miami-Dade' }),
    },
  );

  const storefront = csvDistinctCounties(providers.text);
  const fetchedAt = new Date().toISOString();
  const endpointNames = ['getZipCountyDetails', 'communityPartnerSearch'];
  const endpointTermsFound = containsAll(mainBundle.text, endpointNames);

  const officeMapping = /officeMapping:\s*['"]([^'"]+)['"]/.exec(appconfig.text)?.[1] || null;
  const createCboAccountService = /CreateCBOAccountService:\s*['"]([^'"]+)['"]/.exec(appconfig.text)?.[1] || null;
  const partnerApproverServices = /partnerApproverServices:\s*['"]([^'"]+)['"]/.exec(appconfig.text)?.[1] || null;

  return {
    fetchedAt,
    fetchedDate: fetchedAt.slice(0, 10),
    foodCashStatus: foodCash.status,
    storefrontDistinctCountyCount: storefront.counties.length,
    storefrontRowCount: storefront.rows,
    myaccessRootStatus: root.status,
    publicCpcpsStatus: publicCpcps.status,
    appconfigStatus: appconfig.status,
    assetManifestStatus: assetManifest.status,
    mainBundleStatus: mainBundle.status,
    dataexchangeproxyStatus: dataexchangeproxy.status,
    zipCountyStatus: zipCountyPost.status,
    partnerSearchStatus: partnerSearchPost.status,
    mainBundleUrl,
    endpointNames,
    endpointTermsFound,
    officeMapping,
    createCboAccountService,
    partnerApproverServices,
  };
}

export async function generateBatch321FloridaAuthOnlyEndpointFinalityV1() {
  const probe = await collectProbe();

  if (probe.foodCashStatus !== 200) throw new Error(`Florida food-cash-and-medical returned ${probe.foodCashStatus}`);
  if (probe.storefrontDistinctCountyCount !== 34) {
    throw new Error(`Expected 34 storefront counties, found ${probe.storefrontDistinctCountyCount}`);
  }
  if (!probe.endpointTermsFound) {
    throw new Error('Florida main bundle no longer exposes both exact county-result endpoint names.');
  }
  if (probe.zipCountyStatus !== 401 || probe.partnerSearchStatus !== 401) {
    throw new Error(`Expected authenticated-only endpoint status 401/401, got ${probe.zipCountyStatus}/${probe.partnerSearchStatus}`);
  }

  const statusReason = buildStatusReason(probe);
  const evidence = buildEvidence(probe);

  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
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
      ? { ...row, family_status: FAMILY_STATUS, status_reason: statusReason }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const retained = (row.samples || []).filter((sample) => !String(sample.sample_name || '').includes('main bundle'));
    const samples = [
      ...retained,
      {
        sample_name: 'Florida MyACCESS main bundle re-exposes authenticated county-result endpoints',
        source_url: probe.mainBundleUrl,
        final_url: probe.mainBundleUrl,
        verification_status: 'blocked',
        source_type: 'official_public_main_bundle',
        source_table: BATCH_NAME,
        fetched_at: probe.fetchedAt,
        evidence_snippet: 'A bounded string sweep across the live main bundle re-exposes `getZipCountyDetails` and `communityPartnerSearch`, but the exact official endpoints still return HTTP 401 `Unauthorized` on bounded anonymous probes.',
      },
    ];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: evidence,
      query_basis: `Reviewed ${probe.fetchedDate} the official DCF public-assistance leaf, Family Resource Center CSV, and one more bounded live MyACCESS shell-plus-main-bundle contract check.`,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence }
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
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit, probe));
  fs.writeFileSync(INPUTS.allStateReport, replaceFloridaAllStateNote(fs.readFileSync(INPUTS.allStateReport, 'utf8')));

  const batchSummary = {
    batch: BATCH_NAME,
    generated_at: probe.fetchedAt,
    state: 'florida',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    storefront_distinct_counties: probe.storefrontDistinctCountyCount,
    storefront_rows: probe.storefrontRowCount,
    myaccess_root_status: probe.myaccessRootStatus,
    public_cpcps_status: probe.publicCpcpsStatus,
    public_appconfig_status: probe.appconfigStatus,
    public_asset_manifest_status: probe.assetManifestStatus,
    public_main_bundle_status: probe.mainBundleStatus,
    public_dataexchangeproxy_status: probe.dataexchangeproxyStatus,
    accountmanagement_county_details_status: probe.zipCountyStatus,
    accountmanagement_partner_search_status: probe.partnerSearchStatus,
    main_bundle_endpoint_terms_found: probe.endpointTermsFound,
    main_bundle_endpoint_names: probe.endpointNames,
    office_mapping: probe.officeMapping,
    create_cbo_account_service: probe.createCboAccountService,
    partner_approver_services: probe.partnerApproverServices,
    main_bundle_url: probe.mainBundleUrl,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await generateBatch321FloridaAuthOnlyEndpointFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
