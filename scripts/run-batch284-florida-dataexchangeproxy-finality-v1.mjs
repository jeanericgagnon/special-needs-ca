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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch284_florida_dataexchangeproxy_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch284-florida-dataexchangeproxy-finality-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'official_local_offices_leaf_routes_to_partial_family_resource_center_and_myaccess_public_shell_only_exposes_dataexchangeproxy_shell';
const FAILURE_CODE = 'official_family_resource_center_still_partial_and_myaccess_office_mapping_now_resolves_only_to_public_shell_contract';
const FAMILY_STATUS = 'blocked_partial_storefront_lane_and_public_dataexchangeproxy_shell_without_county_results';
const NEXT_ACTION = 'hold_county_local_until_first_party_local_offices_lane_is_county_complete_or_anonymous_dataexchangeproxy_results_exist';

const STATUS_REASON =
  'Official Florida DCF county-local routing remains blocked after one more bounded first-party MyACCESS static-contract pass. The live public `food-cash-and-medical` leaf still resolves only to the partial Family Resource Center storefront lane, and `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county contract. On the MyACCESS side, the current public `config/appconfig.js` no longer advertises the old county-result method names; instead it wires `officeMapping` and `CreateCBOAccountService` to `/dataexchangeproxy` while leaving `communicationPreferenceService` and `partnerApproverServices` on `/accountmanagement`. The public `Public/CPCPS`, `Help/HCINT`, `config/config.json`, `/swagger`, `/swagger/index.html`, and `/dataexchangeproxy` routes all replay the same generic SPA shell rather than exposing a county-complete anonymous result surface. Florida therefore still has no public county-complete local-office contract.';

const EVIDENCE =
  'Reviewed 2026-06-23 bounded live official checks on `https://www.myflfamilies.com/food-cash-and-medical`, `https://familyresourcecenter.myflfamilies.com/`, `https://familyresourcecenter.myflfamilies.com/providers.csv`, `https://myaccess.myflfamilies.com/Public/CPCPS`, `https://myaccess.myflfamilies.com/Help/HCINT`, `https://myaccess.myflfamilies.com/config/appconfig.js`, `https://myaccess.myflfamilies.com/config/config.json`, `https://myaccess.myflfamilies.com/swagger`, `https://myaccess.myflfamilies.com/swagger/index.html`, and `https://myaccess.myflfamilies.com/dataexchangeproxy`. The exact official `food-cash-and-medical` leaf still includes a `Find Local Offices` link, but that link lands on the Family Resource Center host, whose reviewed `providers.csv` still preserves only 34 distinct county values across 39 rows rather than a 67-county local-office contract. The first-party storefront HTML remains a derivative of that same partial dataset. On the MyACCESS side, the current public `config/appconfig.js` now advertises `officeMapping: \'/dataexchangeproxy\'` and `CreateCBOAccountService: \'/dataexchangeproxy\'`, while `communicationPreferenceService` and `partnerApproverServices` remain on `/accountmanagement`; the older `getZipCountyDetails` and `communityPartnerSearch` names are no longer exposed in the current public config. But the public `Public/CPCPS`, `Help/HCINT`, `config/config.json`, `/swagger`, `/swagger/index.html`, and bare `/dataexchangeproxy` routes all replay the same generic MyACCESS SPA shell rather than exposing an anonymous county-result contract. A bounded static bundle check on `UXModule.flPartnerLocation.85b7166d.js` also found county/zip/partner form wiring but no explicit public endpoint names to reopen the lane. Florida therefore remains blocked because the readable storefront lane is still partial and the current public MyACCESS shell still does not expose a county-complete anonymous office-mapping contract.';

const LESSON_HEADING = '### When Public App Config Rewires To A Shell Endpoint, Treat The Shell As The Real Contract';
const LESSON_BODY =
  '*   **Lesson:** If a public app config rewires a workflow from named endpoints to a generic shell endpoint, verify the new endpoint directly before carrying older endpoint names forward. Florida’s MyACCESS config now points `officeMapping` at `/dataexchangeproxy`, but that route replays the same shell as the public pages, so the blocker is the shell contract itself, not the older `getZipCountyDetails` naming.';

const PRIORITY_ORDER = [
  'utah',
  'kansas',
  'nebraska',
  'nevada',
  'florida',
  'alaska',
  'south-carolina',
  'north-carolina',
  'new-york',
  'oklahoma',
  'oregon',
  'ohio',
  'minnesota',
  'maine',
  'idaho',
  'arizona',
  'massachusetts',
  'new-mexico',
  'south-dakota',
  'rhode-island',
  'virginia',
  'west-virginia',
  'north-dakota',
  'wisconsin',
  'washington',
  'tennessee',
  'vermont',
  'wyoming',
  'new-hampshire',
];

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
    '- The exact official `food-cash-and-medical` leaf still resolves only to the partial Family Resource Center storefront lane.',
    '- The current public MyACCESS config now points `officeMapping` at `/dataexchangeproxy`, but the public CPCPS, HCINT, swagger, config.json, and bare dataexchangeproxy routes all replay the same shell instead of a county-result contract.',
    '- Florida should reopen only when a county-complete first-party local-offices directory or anonymous office-mapping contract becomes public.',
  ].join('\n') + '\n';
}

function buildHandoff(allStateAudit) {
  const blockedSet = new Set(
    allStateAudit.states
      .filter((row) => row.classification === 'BLOCKED')
      .map((row) => row.stateId)
  );
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));
  const nextStates = PRIORITY_ORDER
    .filter((stateId) => stateId !== 'florida' && blockedSet.has(stateId))
    .slice(0, 10)
    .map((stateId) => {
      const row = allStateAudit.states.find((state) => state.stateId === stateId);
      return row ? row.stateName : stateId;
    });

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
    '`county_local_disability_resources` is the only remaining Florida critical blocker. The live DCF local-offices leaf, the Family Resource Center storefront, and the current MyACCESS public shell surfaces are all readable enough to prove what is missing: Florida still has no county-complete public local-office contract, and the present MyACCESS office-mapping lane is only a shell contract.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A first-party Florida DCF or MyACCESS county-complete local-offices directory or export that maps all 67 counties to public assistance / ESS office routing.',
    '- An anonymous official MyACCESS office-mapping or county-result contract that returns real office or community-partner results without authentication.',
    '- A first-party Family Resource Center or DCF local-office lane that expands beyond the current 34-county storefront contract and publishes the full county set.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Florida DCF food-cash-and-medical page](https://www.myflfamilies.com/food-cash-and-medical)',
    '- [Florida Family Resource Center root](https://familyresourcecenter.myflfamilies.com/)',
    '- [Florida Family Resource Center providers.csv](https://familyresourcecenter.myflfamilies.com/providers.csv)',
    '- [MyACCESS Public CPCPS](https://myaccess.myflfamilies.com/Public/CPCPS)',
    '- [MyACCESS Help HCINT](https://myaccess.myflfamilies.com/Help/HCINT)',
    '- [MyACCESS appconfig](https://myaccess.myflfamilies.com/config/appconfig.js)',
    '- [MyACCESS config.json shell](https://myaccess.myflfamilies.com/config/config.json)',
    '- [MyACCESS swagger shell](https://myaccess.myflfamilies.com/swagger)',
    '- [MyACCESS swagger index shell](https://myaccess.myflfamilies.com/swagger/index.html)',
    '- [MyACCESS dataexchangeproxy shell](https://myaccess.myflfamilies.com/dataexchangeproxy)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official DCF or MyACCESS export or API path that materially extends the public county-local contract beyond the 34 counties in `providers.csv`.',
    '- Any exact first-party DCF county office page or local-office directory leaf that is linked from current public-assistance pages but not yet exposed in the current sitemap.',
    '- Any anonymous result lane on the official MyACCESS host that returns real county storefront or office rows without an authenticated or JS-only shell step.',
    '',
    '## Next State Order After Florida',
    '',
    ...nextStates.map((stateName, index) => `${index + 1}. ${stateName}`),
  ].join('\n') + '\n';
}

function buildBatchReport(summary, lessonsUpdated) {
  return [
    '# Batch 284 Florida Dataexchangeproxy Finality Report v1',
    '',
    '- state: Florida',
    `- classification: ${summary.classification}`,
    '- blocker_family: county_local_disability_resources',
    `- lessons_updated: ${lessonsUpdated ? 'true' : 'false'}`,
    '',
    '## What was confirmed',
    '',
    '- `providers.csv` still preserves only 34 distinct county values across 39 rows.',
    '- The exact `food-cash-and-medical` leaf still routes local-office discovery only into the Family Resource Center storefront lane.',
    '- The current public MyACCESS config exposes `officeMapping: /dataexchangeproxy` and `CreateCBOAccountService: /dataexchangeproxy`.',
    '- The public CPCPS, HCINT, config.json, swagger, swagger index, and bare dataexchangeproxy routes all replay the same SPA shell instead of a county-result contract.',
    '',
    '## Repair decision',
    '',
    '- Florida remains blocked on missing county-complete local-office proof.',
    '- No anonymous MyACCESS office-mapping contract was found in this bounded pass.',
  ].join('\n') + '\n';
}

function buildAllStateReport(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedStates = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  return [
    '# All-State California-Grade Audit Report v3',
    '',
    'This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.',
    '',
    '## Packet coverage',
    '',
    '- packet_coverage_count: 50',
    '- packet_missing_states: none',
    '',
    '## Classification counts',
    '',
    `- COMPLETE: ${allStateAudit.classifications.COMPLETE}`,
    `- BLOCKED: ${allStateAudit.classifications.BLOCKED}`,
    '',
    `- index-safe states: ${allStateAudit.indexSafeCount}`,
    `- complete states: ${completeStates.join(', ')}`,
    `- blocked states: ${blockedStates.join(', ')}`,
    '',
    '## Notes',
    '',
    '- Texas remains COMPLETE/index-safe from v10.',
    '- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
    '- Florida county-local routing is now explicitly sharpened to the partial Family Resource Center contract plus the public MyACCESS dataexchangeproxy shell lane, not a hidden anonymous API.',
  ].join('\n') + '\n';
}

export function generateBatch284FloridaDataexchangeproxyFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);

  const updatedSummary = {
    ...summary,
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
    const keep = (row.samples || []).filter((sample) => ![
      'Florida MyACCESS appconfig shell contract',
      'Florida MyACCESS config shell',
      'Florida MyACCESS swagger shell',
      'Florida MyACCESS anonymous county-result endpoints',
    ].includes(sample.sample_name));
    const samples = [
      ...keep,
      {
        sample_name: 'Florida MyACCESS appconfig dataexchangeproxy contract',
        source_url: 'https://myaccess.myflfamilies.com/config/appconfig.js',
        final_url: 'https://myaccess.myflfamilies.com/config/appconfig.js',
        verification_status: 'blocked',
        source_type: 'official_public_config_js',
        source_table: 'batch284_florida_dataexchangeproxy_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public appconfig now exposes `officeMapping: /dataexchangeproxy` and `CreateCBOAccountService: /dataexchangeproxy`, while `/accountmanagement` remains only for communicationPreferenceService and partnerApproverServices.',
      },
      {
        sample_name: 'Florida MyACCESS dataexchangeproxy shell',
        source_url: 'https://myaccess.myflfamilies.com/dataexchangeproxy',
        final_url: 'https://myaccess.myflfamilies.com/dataexchangeproxy',
        verification_status: 'blocked',
        source_type: 'official_shell_replay',
        source_table: 'batch284_florida_dataexchangeproxy_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'The public dataexchangeproxy route replays the same generic MyACCESS SPA shell instead of exposing an anonymous office-mapping or county-result contract.',
      },
      {
        sample_name: 'Florida MyACCESS partner-location bundle static check',
        source_url: 'https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js',
        final_url: 'https://myaccess.myflfamilies.com/static/js/UXModule.flPartnerLocation.85b7166d.js',
        verification_status: 'blocked',
        source_type: 'official_public_js_bundle_without_endpoint_contract',
        source_table: 'batch284_florida_dataexchangeproxy_finality',
        fetched_at: '2026-06-23T00:00:00.000Z',
        evidence_snippet: 'A bounded static bundle check found county/zip/partner form wiring but no explicit public endpoint names to reopen the office-mapping lane.',
      },
    ];
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: EVIDENCE,
      query_basis: 'Reviewed 2026-06-23 the official DCF public-assistance leaf, Family Resource Center root and CSV, and the current MyACCESS public shell/config/dataexchangeproxy contract.',
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
            familyStatuses: {
              ...(row.familyStatuses || {}),
              county_local_disability_resources: FAMILY_STATUS,
            },
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
          }
        : row
    )),
  };

  const updatedAllStateQueue = allStateQueue.map((row) => (
    row.state === 'florida'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  writeJsonl(INPUTS.allStateQueue, updatedAllStateQueue);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(updatedAllStateAudit));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAllStateAudit));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch284_florida_dataexchangeproxy_finality_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'florida',
    classification: 'BLOCKED',
    index_safe: false,
    blocker_family: 'county_local_disability_resources',
    failure_code: FAILURE_CODE,
    distinct_storefront_counties: 34,
    public_dataexchangeproxy_replays_shell: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(updatedSummary, lessonsUpdated));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch284FloridaDataexchangeproxyFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
