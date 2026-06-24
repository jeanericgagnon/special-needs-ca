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
  batchSummary: path.join(generatedDir, 'batch300_florida_cloudfront_block_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch300-florida-cloudfront-block-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_current_myaccess_public_lane_is_cloudfront_blocked';
const FAILURE_CODE = 'official_family_resource_center_still_partial_and_current_myaccess_public_shell_assets_now_return_cloudfront_403';
const FAMILY_STATUS = 'blocked_partial_storefront_lane_and_current_myaccess_public_lane_cloudfront_blocked';
const NEXT_ACTION = 'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_current_myaccess_public_lane_recovers_anonymous_results';
const BATCH_NAME = 'batch300_florida_cloudfront_block_finality_v1';

const STATUS_REASON =
  'Official Florida DCF county-local routing remains blocked after one more bounded live first-party MyACCESS regression check. The live public `food-cash-and-medical` leaf still resolves county-local discovery only into the partial Family Resource Center storefront lane, and `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county contract. But the current MyACCESS public lane is now even weaker than the last saved shell-only packet: direct live checks on `Public/CPCPS`, `config/appconfig.js`, and the current partner-location bundle path all return CloudFront `403 Request blocked` responses instead of even replaying a readable public shell. Florida therefore still has no county-complete public local-office contract, and the current MyACCESS public lane is now edge-blocked as well.';

const EVIDENCE =
  'Reviewed 2026-06-24 bounded live official checks on `https://www.myflfamilies.com/food-cash-and-medical`, `https://familyresourcecenter.myflfamilies.com/providers.csv`, `https://myaccess.myflfamilies.com/Public/CPCPS`, `https://myaccess.myflfamilies.com/config/appconfig.js`, `https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js`, `https://myaccess.myflfamilies.com/asset-manifest.json`, and `https://myaccess.myflfamilies.com/dataexchangeproxy/swagger/index.html`. The exact official `food-cash-and-medical` leaf still points families to the Family Resource Center lane, whose reviewed `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county local-office contract. On the MyACCESS side, the current public lane has regressed from a readable shell to an edge-blocked surface: live `HEAD` checks on `Public/CPCPS`, `config/appconfig.js`, and `static/js/UXModule.flPartnerLocation.85b7166d.js` now all return HTTP 403 with CloudFront `Request blocked` responses, and direct fetches for `asset-manifest.json` and `dataexchangeproxy/swagger/index.html` also return the same CloudFront 403 body. Florida therefore remains blocked because the readable storefront lane is still partial and the current official MyACCESS public lane is now CloudFront-blocked rather than a reviewable anonymous county-result contract.';

const LESSON_HEADING = '### A Public Shell Lane Can Regress Into An Edge-Blocked Lane And Must Be Reclassified';
const LESSON_BODY =
  '*   **Lesson:** If a previously readable public shell lane starts returning CloudFront or edge-blocked 403 responses on its public entry, config, and bundle paths, tighten the blocker to the current live contract instead of carrying forward older shell assumptions. Florida’s MyACCESS lane moved from replaying a generic shell to returning CloudFront `Request blocked` on the exact public shell, config, bundle, and asset-manifest paths.';

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
    '- The exact official `food-cash-and-medical` leaf still routes county-local discovery only into the partial Family Resource Center storefront lane.',
    '- The current official MyACCESS public lane has now regressed to CloudFront 403 `Request blocked` responses on the public shell, config, bundle, and asset-manifest paths.',
    '- Florida should reopen only when a county-complete first-party local-offices directory or a recovered anonymous MyACCESS county-result lane becomes public.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const focusBlock = [
    '## Current Focus State: Florida',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Florida critical blocker. The live DCF local-offices leaf and Family Resource Center storefront still stop at a partial 34-county contract, and the current official MyACCESS public lane has now regressed to CloudFront `403 Request blocked` responses on the public shell, config, bundle, and asset-manifest paths.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A first-party Florida DCF or MyACCESS county-complete local-offices directory or export that maps all 67 counties to public assistance / ESS office routing.',
    '- A recovered anonymous official MyACCESS county-result contract that returns real office or community-partner results without authentication or CloudFront blocking.',
    '- A first-party Family Resource Center or DCF local-office lane that expands beyond the current 34-county storefront contract and publishes the full county set.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Florida DCF food-cash-and-medical page](https://www.myflfamilies.com/food-cash-and-medical)',
    '- [Florida Family Resource Center providers.csv](https://familyresourcecenter.myflfamilies.com/providers.csv)',
    '- [MyACCESS Public CPCPS](https://myaccess.myflfamilies.com/Public/CPCPS)',
    '- [MyACCESS appconfig](https://myaccess.myflfamilies.com/config/appconfig.js)',
    '- [MyACCESS partner-location bundle](https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js)',
    '- [MyACCESS asset manifest](https://myaccess.myflfamilies.com/asset-manifest.json)',
    '- [MyACCESS nested swagger path](https://myaccess.myflfamilies.com/dataexchangeproxy/swagger/index.html)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official DCF or MyACCESS export or API path that materially extends the public county-local contract beyond the 34 counties in `providers.csv`.',
    '- Any exact first-party DCF county office page or local-office directory leaf that is linked from current public-assistance pages but not yet exposed in the current sitemap.',
    '- Any anonymous result lane on the official MyACCESS host that returns real county storefront or office rows once the current CloudFront block is lifted.',
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

function updateAllStateReport() {
  const note = '- Florida county-local routing is now explicitly sharpened to a partial Family Resource Center storefront plus a currently CloudFront-blocked MyACCESS public lane; the former county-result shell assumptions no longer match the current live contract.';
  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  if (!current.includes(note)) {
    current = `${current.trimEnd()}\n${note}\n`;
    fs.writeFileSync(INPUTS.allStateReport, current);
  }
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 300 Florida CloudFront Block Finality v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.blocker_family}`,
    '',
    '## What was confirmed',
    '',
    '- `providers.csv` still preserves only 34 distinct county values across 39 rows.',
    '- `Public/CPCPS` now returns a CloudFront 403 `Request blocked` response.',
    '- `config/appconfig.js` now returns a CloudFront 403 `Request blocked` response.',
    '- `static/js/UXModule.flPartnerLocation.85b7166d.js` now returns a CloudFront 403 `Request blocked` response.',
    '- `asset-manifest.json` and `dataexchangeproxy/swagger/index.html` also return the same CloudFront 403 body.',
    '',
    '## Repair decision',
    '',
    '- Florida remains blocked on missing county-complete local-office proof.',
    '- The current official MyACCESS public lane is edge-blocked rather than even a readable anonymous shell contract.',
  ].join('\n') + '\n';
}

export function generateBatch300FloridaCloudfrontBlockFinalityV1() {
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
    const retained = (row.samples || []).filter((sample) => ![
      'Florida MyACCESS Public CPCPS CloudFront block',
      'Florida MyACCESS appconfig CloudFront block',
      'Florida MyACCESS partner-location bundle CloudFront block',
      'Florida MyACCESS asset manifest CloudFront block',
    ].includes(sample.sample_name));
    const samples = [
      ...retained,
      {
        sample_name: 'Florida MyACCESS Public CPCPS CloudFront block',
        source_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
        final_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
        verification_status: 'blocked',
        source_type: 'official_cloudfront_blocked_public_shell',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-24T00:00:00.000Z',
        evidence_snippet: 'A live HEAD check now returns HTTP 403 with CloudFront `Request blocked` instead of a reviewable public shell.',
      },
      {
        sample_name: 'Florida MyACCESS appconfig CloudFront block',
        source_url: 'https://myaccess.myflfamilies.com/config/appconfig.js',
        final_url: 'https://myaccess.myflfamilies.com/config/appconfig.js',
        verification_status: 'blocked',
        source_type: 'official_cloudfront_blocked_public_config',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-24T00:00:00.000Z',
        evidence_snippet: 'A live HEAD check now returns HTTP 403 with CloudFront `Request blocked` on the current public appconfig path.',
      },
      {
        sample_name: 'Florida MyACCESS partner-location bundle CloudFront block',
        source_url: 'https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js',
        final_url: 'https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js',
        verification_status: 'blocked',
        source_type: 'official_cloudfront_blocked_public_bundle',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-24T00:00:00.000Z',
        evidence_snippet: 'A live HEAD check now returns HTTP 403 with CloudFront `Request blocked` on the current partner-location bundle path.',
      },
      {
        sample_name: 'Florida MyACCESS asset manifest CloudFront block',
        source_url: 'https://myaccess.myflfamilies.com/asset-manifest.json',
        final_url: 'https://myaccess.myflfamilies.com/asset-manifest.json',
        verification_status: 'blocked',
        source_type: 'official_cloudfront_blocked_public_asset_manifest',
        source_table: BATCH_NAME,
        fetched_at: '2026-06-24T00:00:00.000Z',
        evidence_snippet: 'A direct fetch now returns the CloudFront 403 `Request blocked` body instead of a readable asset manifest.',
      },
    ];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      query_basis: 'Reviewed 2026-06-24 the official DCF public-assistance leaf, Family Resource Center CSV, and one more bounded live MyACCESS public-lane regression check.',
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
  updateAllStateReport();
  updateHandoff();
  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);

  const batchSummary = {
    batch: BATCH_NAME,
    generated_at: '2026-06-24T00:00:00.000Z',
    state: 'florida',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    storefront_distinct_counties: 34,
    public_cpcps_status: 403,
    public_appconfig_status: 403,
    public_partner_bundle_status: 403,
    public_asset_manifest_status: 403,
    lessons_updated: lessonsUpdated,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch300FloridaCloudfrontBlockFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
