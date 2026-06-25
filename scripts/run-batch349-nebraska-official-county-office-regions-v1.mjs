import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'nebraska_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'nebraska_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'nebraska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nebraska_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'nebraska_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'nebraska_county_local_disability_resources_service_area_packet_v1.json'),
  report: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  flSummary: path.join(generatedDir, 'florida_california_grade_summary_v2.json'),
  flFailure: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  flNext: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch349_nebraska_official_county_office_regions_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch349-nebraska-official-county-office-regions-report-v1.md'),
};

const BATCH = 'batch349_nebraska_official_county_office_regions_v1';
const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence';
const COUNTY_LOCAL_STATUS = 'verified_county_grade';
const COUNTY_LOCAL_REASON =
  'Nebraska county-local routing now clears at county grade from a live official DHHS county-office region contract. The exact first-party `Public Assistance Offices` wrapper on `dhhs.ne.gov` is still weaker, but the current official Nebraska DHHS N-FOCUS TANF page publicly links `Employment First (EF) Offices` to a public GIS office app on the same DHHS owner family. That app and its backing official services now expose two complementary county-grade contracts: the `EQUUS_Office` feature layer preserves 22 office rows with office name, address, city, ZIP, phone number, hours, county, and `Nebraska County(ies) Served`, and the official `CFS_EF_OfficeRegions` polygon layer preserves 93 county rows with explicit county name plus the assigned office, address, phone, hours, and `Nebraska County(ies) Served`. Bounded live county queries for Douglas and Cherry both return exact county-specific office assignments, and a bounded count query confirms all 93 Nebraska counties appear in the official county-office region layer.';
const LESSON_HEADING = '### A County Polygon Office-Region Layer Can Clear Local Office Routing Even When The Generic Wrapper Is Weak';
const LESSON_BODY =
  '*   **Lesson:** If the generic state office wrapper is weak but a sibling first-party program stack publicly links an official county polygon office-region service with county names, assigned office, address, phone, hours, and `Counties Served` fields, that service itself can clear county-grade local office routing. Nebraska cleared once the DHHS N-FOCUS TANF `Employment First (EF) Offices` lane exposed the official `CFS_EF_OfficeRegions` layer covering all 93 counties.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  const body = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').trim() : '';
  if (!body) return [];
  return body.split('\n').map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const body = rows.length ? `${rows.map((row) => JSON.stringify(row)).join('\n')}\n` : '';
  fs.writeFileSync(filePath, body);
}

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function titleCaseState(stateId) {
  return stateId.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function buildStateReport(summary, gapRows, verifiedRows) {
  return [
    '# Nebraska California-Grade Truth Refresh v2',
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
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Completion decision',
    '',
    '- Nebraska is now COMPLETE and index-safe.',
    '- The last critical blocker, `county_local_disability_resources`, now clears from a public official DHHS county-office region contract on the current N-FOCUS TANF / Employment First stack.',
    '- The official `Employment First (EF) Offices` page on `dhhs-cfstanf.ne.gov` links directly to a public GIS office app, the official `EQUUS_Office` feature layer preserves 22 office rows with county-served strings, and the official `CFS_EF_OfficeRegions` polygon layer preserves 93 county rows with county-specific office assignments, addresses, phone numbers, hours, and `Nebraska County(ies) Served`.',
    '- Bounded county queries for Douglas and Cherry confirm exact county-to-office mappings on the official host, and a bounded count query confirms all 93 counties appear in the county-office region layer.',
    '',
  ].join('\n');
}

function buildAllStateReport(audit) {
  const completeStates = audit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => titleCaseState(row.stateId))
    .sort((a, b) => a.localeCompare(b));
  const blockedStates = audit.states
    .filter((row) => row.classification === 'BLOCKED')
    .map((row) => titleCaseState(row.stateId))
    .sort((a, b) => a.localeCompare(b));

  return [
    '# All-State California-Grade Audit Report v3',
    '',
    'This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.',
    '',
    '## Packet coverage',
    '',
    `- packet_coverage_count: ${audit.packetCoverageCount}`,
    `- packet_missing_states: ${audit.packetMissingStates.length ? audit.packetMissingStates.join(', ') : 'none'}`,
    '',
    '## Classification counts',
    '',
    `- COMPLETE: ${audit.classifications.COMPLETE || 0}`,
    `- BLOCKED: ${audit.classifications.BLOCKED || 0}`,
    '',
    `- index-safe states: ${audit.indexSafeCount}`,
    `- complete states: ${completeStates.join(', ')}`,
    `- blocked states: ${blockedStates.join(', ')}`,
    '',
    '## Notes',
    '',
    '- Texas remains COMPLETE/index-safe from v10.',
    '- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.',
    '- Kansas is COMPLETE/index-safe from the live official KSDE county-grade district export contract.',
    '- Nebraska is now COMPLETE/index-safe because the official DHHS N-FOCUS TANF `Employment First (EF) Offices` lane exposes a public county-office region contract across all 93 counties, with explicit county-specific office assignments and `Counties Served` fields on the official GIS owner family.',
    '- Florida remains blocked on county-local routing because the Family Resource Center storefront is still partial and the live MyACCESS county-result endpoints remain authenticated-only.',
    '- Ohio remains blocked only on education routing. The live Ohio JFS county-directory family now verifies county-local coverage across all 88 counties from the official `cdjfs-*` sitemap leaves, but the district/ESC exact-leaf inventory is still too thin to clear education county-grade routing.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
    '',
  ].join('\n');
}

function buildHandoff(updatedAudit, queueRows, flFailure, flNext) {
  const stateNameById = new Map(queueRows.map((row) => [row.state, row.state_name]));
  const completeStates = updatedAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => stateNameById.get(row.stateId) || titleCaseState(row.stateId))
    .sort((a, b) => a.localeCompare(b));
  const blockedStates = updatedAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .map((row) => ({
      name: stateNameById.get(row.stateId) || titleCaseState(row.stateId),
      reason: row.packetPrimaryGapReason || row.primaryGapReason || 'unknown',
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

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
    ...blockedStates.map((row) => `- ${row.name}: \`${row.reason}\``),
    '',
    '## Current Focus State: Florida',
    '',
    '### Blocker Reason',
    '',
    `Florida still has one critical blocker: \`county_local_disability_resources\`. ${flFailure.evidence}`,
    '',
    '### Exact Evidence Needed',
    '',
    '- A first-party county-complete public local-office contract on the current Florida DCF or MyACCESS stack.',
    '- A public MyACCESS county-result contract that works anonymously, not only behind authenticated endpoints.',
    '- A reviewed first-party Florida local-office or partner-office source that truly covers all 67 counties instead of the current partial Family Resource Center storefront.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Florida food, cash, and medical](https://www.myflfamilies.com/food-cash-and-medical)',
    '- [Family Resource Center providers.csv](https://familyresourcecenter.myflfamilies.com/providers.csv)',
    '- [MyACCESS root](https://myaccess.myflfamilies.com/)',
    '- [MyACCESS Public/CPCPS](https://myaccess.myflfamilies.com/Public/CPCPS)',
    '- [MyACCESS appconfig.js](https://myaccess.myflfamilies.com/config/appconfig.js)',
    '- [MyACCESS asset-manifest.json](https://myaccess.myflfamilies.com/asset-manifest.json)',
    '- [MyACCESS main bundle](https://myaccess.myflfamilies.com/static/js/main.d43b0959.js)',
    '- [MyACCESS dataexchangeproxy](https://myaccess.myflfamilies.com/dataexchangeproxy)',
    '- [MyACCESS getZipCountyDetails](https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails)',
    '- [MyACCESS communityPartnerSearch](https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any first-party Florida local-office artifact that is county-complete and publicly reviewable without authentication.',
    '- Any public MyACCESS county-result or office-mapping endpoint that no longer requires authenticated access.',
    '- Any official DCF county office or partner office dataset that covers the remaining 33 counties missing from the Family Resource Center storefront.',
    '',
    '## Next State Order After Florida',
    '',
    '1. Alaska',
    '2. Oklahoma',
    '3. Ohio',
    '4. Minnesota',
    '5. Maine',
    '6. Idaho',
    '7. Arizona',
    '8. Massachusetts',
    '9. New Mexico',
    '10. South Dakota',
    '',
    `Current Florida next action: ${flNext.next_action}.`,
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 349 Nebraska Official County Office Regions v1',
    '',
    '- classification: COMPLETE',
    '- index_safe: true',
    '- county_count: 93',
    '- cleared_family: county_local_disability_resources',
    '',
    '## What changed',
    '',
    '- Promoted Nebraska from BLOCKED to COMPLETE/index-safe.',
    '- Cleared `county_local_disability_resources` from a public official DHHS county-office region contract on the N-FOCUS TANF / Employment First stack.',
    '- Verified that the official `Employment First (EF) Offices` page on `dhhs-cfstanf.ne.gov` links to a public official GIS office app, that the official `EQUUS_Office` feature layer preserves 22 office rows with office name, address, city, ZIP, phone number, hours, county, and `Nebraska County(ies) Served`, and that the official `CFS_EF_OfficeRegions` polygon layer preserves 93 county rows with exact county-specific office assignments.',
    '- Verified exact county samples for Douglas and Cherry and a bounded count query confirming all 93 counties appear in the county-office region layer.',
    '',
  ].join('\n');
}

export function generateBatch349NebraskaOfficialCountyOfficeRegionsV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const queueRows = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const flFailure = readJsonl(INPUTS.flFailure)[0];
  const flNext = readJsonl(INPUTS.flNext)[0];

  const updatedSummary = {
    ...summary,
    classification: 'COMPLETE',
    index_safe: true,
    incorrectly_index_safe: false,
    completeness_pct: 100,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: [],
    final_blockers: [],
    batch: BATCH,
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: COUNTY_LOCAL_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_LOCAL_STATUS, status_reason: COUNTY_LOCAL_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'county_local_disability_resources');
  const updatedNextRows = nextRows.filter((row) => row.family !== 'county_local_disability_resources');

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: COUNTY_LOCAL_STATUS,
      evidence_strength: 'strong',
      query_basis: 'Reviewed 2026-06-24 the official DHHS Public Assistance Offices wrapper, the official DHHS N-FOCUS TANF Employment First Offices page, the public EQUUS office app, the official EQUUS office layer, the official CFS_EF_OfficeRegions county polygon layer, and bounded county/count coverage queries.',
      blocker_code: null,
      blocker_evidence: null,
      sample_count: 6,
      samples: [
        {
          sample_name: 'DHHS Public Assistance Offices wrapper still points to official office lookup',
          source_url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
          final_url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
          verification_status: 'verified',
          source_type: 'official_state_wrapper_page',
          source_table: BATCH,
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'The live official `Public Assistance Offices` page remains public and still links families to `View the Nebraska Public Office Location Lookup` on the official DHHS stack.'
        },
        {
          sample_name: 'Official Employment First (EF) Offices page',
          source_url: 'https://dhhs-cfstanf.ne.gov/CFSTanf/',
          final_url: 'https://dhhs-cfstanf.ne.gov/CFSTanf/',
          verification_status: 'verified',
          source_type: 'official_dhhs_program_page',
          source_table: BATCH,
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'The live official DHHS N-FOCUS TANF page preserves H1 `Employment First (EF) Offices` and explicitly tells families to click the map for an interactive version providing office information and search options.'
        },
        {
          sample_name: 'Official EQUUS Offices app metadata',
          source_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/73d617b3135d4ffdb98bf89cd2f14c35?f=json',
          final_url: 'https://gis.ne.gov/portal/sharing/rest/content/items/73d617b3135d4ffdb98bf89cd2f14c35?f=json',
          verification_status: 'verified',
          source_type: 'official_public_web_mapping_application_metadata',
          source_table: BATCH,
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'The public official `EQUUS Offices` app metadata says the application is embedded in a Nebraska DHHS program webpage and provides statewide program offices with office name, city, county search, and detailed office information.'
        },
        {
          sample_name: 'Official EQUUS office layer',
          source_url: 'https://gis.ne.gov/agencyext/rest/services/EQUUS_Office/FeatureServer/0?f=pjson',
          final_url: 'https://gis.ne.gov/agencyext/rest/services/EQUUS_Office/FeatureServer/0?f=pjson',
          verification_status: 'verified',
          source_type: 'official_office_feature_layer',
          source_table: BATCH,
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'The official `EQUUS_Office` layer exposes office fields `Office`, `Phone_Number`, `Address`, `City`, `State`, `Zip`, `County`, `Hours_of_Operation`, and `Nebraska_County_ies__Served`, and a bounded count query returns 22 public office rows.'
        },
        {
          sample_name: 'Official county-office region layer',
          source_url: 'https://gis.ne.gov/agencyext/rest/services/CFS_EF_OfficeRegions/FeatureServer/0?f=pjson',
          final_url: 'https://gis.ne.gov/agencyext/rest/services/CFS_EF_OfficeRegions/FeatureServer/0?f=pjson',
          verification_status: 'verified',
          source_type: 'official_county_polygon_office_region_layer',
          source_table: BATCH,
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'The official `CFS_EF_OfficeRegions` polygon layer exposes county field `NAME` plus `Office`, `Phone_Number`, `Address`, `City`, `Zip`, `Hours_of_Operation`, and `Nebraska_County_ies__Served`, and a bounded count query returns all 93 county rows.'
        },
        {
          sample_name: 'County-specific Nebraska office assignments',
          source_url: 'https://gis.ne.gov/agencyext/rest/services/CFS_EF_OfficeRegions/FeatureServer/0/query',
          final_url: 'https://gis.ne.gov/agencyext/rest/services/CFS_EF_OfficeRegions/FeatureServer/0/query',
          verification_status: 'verified',
          source_type: 'official_county_specific_office_region_query',
          source_table: BATCH,
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'Bounded official county queries prove exact county-to-office mapping: Douglas returns `EQUUS Office - Omaha`, phone `402.763.6700`, address `4606 N 56th ST`, and `Nebraska County(ies) Served: Douglas`; Cherry returns `EQUUS Office - O’Neill`, phone `402.379.2578`, address `104 S 3rd ST`, and `Nebraska County(ies) Served: Antelope, Boyd, Brown, Cherry, Garfield, Holt, Keya Paha, Knox, Loup, Rock, and Wheeler`.'
        },
      ],
    };
  });

  const updatedPacket = {
    ...packet,
    repair_lane: 'retired_complete_from_official_county_office_regions',
    retired_by_batch: BATCH,
    retired_reason: 'The official DHHS N-FOCUS TANF / Employment First county-office region layer now provides a county-grade local office contract across all 93 counties.',
    county_office_region_contract_verified: true,
    county_office_region_count: 93,
    office_row_count: 22,
    packet_complete_when: 'Nebraska is now complete because the current official DHHS county-office region layer provides a public county-grade local office contract across all 93 counties.',
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'nebraska'
      ? {
          ...row,
          classification: 'COMPLETE',
          index_safe: true,
          completeness_pct: 100,
          missing_critical_families: 0,
          weak_critical_families: 0,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'complete_maintain',
          status: 'COMPLETE',
          repair_lane: 'maintain_truth_only',
        }
      : row
  ));

  const updatedStates = allStateAudit.states.map((row) => (
    row.stateId === 'nebraska'
      ? {
          ...row,
          classification: 'COMPLETE',
          indexSafe: true,
          primaryGapReason: null,
          criticalGapFamilies: null,
          completenessPct: 100,
          packetBatch: BATCH,
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          familyStatuses: {
            ...(row.familyStatuses || {}),
            county_local_disability_resources: COUNTY_LOCAL_STATUS,
          },
        }
      : row
  ));

  const classificationCounts = updatedStates.reduce((acc, row) => {
    acc[row.classification] = (acc[row.classification] || 0) + 1;
    return acc;
  }, {});

  const updatedAllStateAudit = {
    ...allStateAudit,
    generatedAt: '2026-06-24T23:59:30.000Z',
    classifications: classificationCounts,
    indexSafeCount: updatedStates.filter((row) => row.indexSafe).length,
    incorrectlyIndexSafeStates: updatedStates.filter((row) => row.classification !== 'COMPLETE' && row.indexSafe).map((row) => row.stateId),
    lessonsUpdate: appendLessonIfMissing(INPUTS.lessons)
      ? 'Added a Nebraska office-region lesson: a sibling first-party county polygon office-region layer can clear local office routing even when the generic wrapper page is weak.'
      : allStateAudit.lessonsUpdate,
    states: updatedStates,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.allStateQueue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(INPUTS.report, `${buildStateReport(updatedSummary, updatedGapRows, updatedVerifiedRows)}\n`);
  fs.writeFileSync(INPUTS.allStateReport, `${buildAllStateReport(updatedAllStateAudit)}\n`);
  fs.writeFileSync(INPUTS.handoff, `${buildHandoff(updatedAllStateAudit, updatedQueueRows, flFailure, flNext)}\n`);

  const batchSummary = {
    state: 'Nebraska',
    classification: 'COMPLETE',
    index_safe: true,
    county_count: 93,
    cleared_family: 'county_local_disability_resources',
    official_program_page_status: 200,
    equus_office_count: 22,
    county_region_count: 93,
    sample_douglas_office: 'EQUUS Office - Omaha',
    sample_cherry_office: 'EQUUS Office - O’Neill',
    county_local_cleared: true,
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, `${buildBatchReport()}\n`);
  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch349NebraskaOfficialCountyOfficeRegionsV1();
  console.log(JSON.stringify(result, null, 2));
}
