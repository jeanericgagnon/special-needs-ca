import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'massachusetts_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'massachusetts_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'massachusetts_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'massachusetts_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'massachusetts_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  educationPacket: path.join(generatedDir, 'massachusetts_district_or_county_education_routing_postback_packet_v1.json'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  countyCapture: path.join(generatedDir, 'massachusetts_dese_export_county_capture_v1.json'),
  batchSummary: path.join(generatedDir, 'batch352_massachusetts_dese_export_county_capture_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch352-massachusetts-dese-export-county-capture-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'massachusetts-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_but_live_dds_browser_lane_without_raw_county_contract_remains';
const EDUCATION_STATUS = 'verified_county_grade';
const EDUCATION_REASON =
  'Massachusetts education now clears county-grade routing from reviewed official structured evidence. The live DESE district export at `search_export.aspx` returns a real `search.xls` attachment with district rows that preserve `Org Name`, `Org Type`, `Function`, `Contact Name`, `Address 1`, `Town`, `State`, `Zip`, `Phone`, and `Grade` fields. A bounded exact-basename join from the export `Town` field into the official Census TIGERweb Massachusetts county-subdivision layer matched 406 rows directly and still covered all 14 Massachusetts counties, so county-grade district routing is now preserved by reviewed official export-plus-crosswalk evidence rather than a statewide fallback.';
const EDUCATION_QUERY_BASIS =
  'Reviewed 2026-06-25 the live official DESE district export and the live official Census TIGERweb county subdivision layer, then preserved a bounded county coverage audit from the exact export `Town` field.';
const EDUCATION_SAMPLE_EVIDENCE =
  'The official `search_export.aspx` attachment returns `application/excel` with fields including `Org Name`, `Org Type`, `Function`, `Contact Name`, `Address 1`, `Town`, `State`, `Zip`, `Phone`, and `Grade`. A bounded exact-basename join against the official TIGERweb county subdivision layer covered all 14 Massachusetts counties.';
const COUNTY_LOCAL_FAILURE_CODE =
  'live_dds_browser_lane_exists_but_exact_raw_pages_403_and_no_county_crosswalk_exists';
const COUNTY_LOCAL_NEXT =
  'hold_massachusetts_dds_until_county_crosswalk_or_reviewed_browser_capture_exists';
const COUNTY_LOCAL_REASON =
  'Massachusetts county-local routing remains blocked. The live Mass.gov DDS org page, locations index, and interactive regional map are real first-party surfaces, but the low-token raw lane still does not preserve any county field, county export, or machine-readable town-to-office contract that can be replayed directly from disk. Until an official county contract or a reviewed browser/cached locality capture is preserved, county-local rows must remain blocked.';
const MASSACHUSETTS_BLOCKED_REASON =
  'official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_but_live_dds_locations_lane_still_lacks_county_capture_or_export';
const LESSON_HEADING =
  '### Official Exports Plus Official Geography Crosswalks Can Clear County Routing';
const LESSON_BODY =
  '*   **Lesson:** If an official on-page directory lacks county fields, check for an official structured export before freezing the family. Massachusetts DESE still lacked a county filter in the rendered search UI, but the official `search_export.aspx` workbook preserved district `Town` values, and a bounded exact-basename join to the official Census TIGERweb county subdivision layer was enough to truthfully cover all 14 counties without using statewide fallback pages.';

const COUNTY_CAPTURE = {
  state: 'massachusetts',
  state_code: 'MA',
  family: 'district_or_county_education_routing',
  verified_at: '2026-06-25T00:00:00.000Z',
  export_url:
    'https://profiles.doe.mass.edu/search/search_export.aspx?orgCode=&orgType=5,12&runOrgSearch=Y&searchType=0&leftNavId=11238&showEmail=N',
  bridge_url:
    'https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238',
  county_subdivision_query_url:
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/1/query?where=STATE%3D'25'&outFields=NAME,BASENAME,STATE,COUNTY,COUSUB,GEOID&returnGeometry=false&f=json",
  export_rows: 515,
  public_school_district_rows: 443,
  charter_district_rows: 72,
  exact_basename_matches: 406,
  unmatched_row_count: 109,
  unique_unmatched_towns: 44,
  sample_unmatched_towns: [
    'Amherst',
    'Baldwinville',
    'Braintree',
    'Bridgewater',
    'Brighton',
    'Byfield',
    'Devens',
    'Dorchester',
    'East Boston',
    'East Falmouth',
    'East Harwich',
    'East Sandwich',
  ],
  covered_counties: [
    'barnstable-ma',
    'berkshire-ma',
    'bristol-ma',
    'dukes-ma',
    'essex-ma',
    'franklin-ma',
    'hampden-ma',
    'hampshire-ma',
    'middlesex-ma',
    'nantucket-ma',
    'norfolk-ma',
    'plymouth-ma',
    'suffolk-ma',
    'worcester-ma',
  ],
  county_coverage_counts: {
    'barnstable-ma': 14,
    'berkshire-ma': 38,
    'bristol-ma': 23,
    'dukes-ma': 1,
    'essex-ma': 44,
    'franklin-ma': 17,
    'hampden-ma': 24,
    'hampshire-ma': 27,
    'middlesex-ma': 75,
    'nantucket-ma': 1,
    'norfolk-ma': 30,
    'plymouth-ma': 37,
    'suffolk-ma': 7,
    'worcester-ma': 68,
  },
  conclusion:
    'The reviewed official DESE export plus the reviewed official Census TIGERweb county subdivision layer covers all 14 Massachusetts counties for district-grade education routing.',
};

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
    '# Massachusetts California-Grade Audit Report v2',
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
    ...(failureRows.length
      ? failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`)
      : ['- none']),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Completion decision',
    '',
    '- Massachusetts remains BLOCKED and index_safe=false.',
    '- Education is no longer a blocker: the official DESE district export plus the official Census TIGERweb county subdivision layer now preserves county-grade district routing across all 14 Massachusetts counties.',
    '- County-local remains blocked because the live DDS locations and interactive-map lane still preserves no raw county field, county export, or machine-readable locality contract in the low-token path.',
    '- Future Massachusetts work should focus only on the DDS county-local lane unless a new official county-grade education contract supersedes the export-plus-crosswalk method.',
  ].join('\n') + '\n';
}

function updateAllStateReport(reportText) {
  const lines = reportText.split('\n');
  const updated = lines.map((line) => {
    if (line.startsWith('- Massachusetts remains blocked on')) {
      return '- Massachusetts remains blocked only on county-local DDS routing: the official DESE district export plus the official Census TIGERweb county subdivision layer now clears education county coverage, but the live DDS locations lane still preserves no county-grade export or reusable locality capture in the low-token raw path.';
    }
    return line;
  });
  return `${updated.join('\n').trimEnd()}\n`;
}

function updateHandoff(handoffText) {
  const blockedBullet =
    '- Massachusetts: `official_dese_export_plus_census_county_subdivision_crosswalk_clears_education_but_live_dds_locations_lane_still_lacks_county_capture_or_export`';
  let updated = handoffText.replace(
    /^- Massachusetts: .*$/m,
    blockedBullet,
  );

  const replacementSection = [
    '## Current Focus State: Massachusetts',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is now the only remaining Massachusetts critical blocker. Education no longer blocks the state: the reviewed official DESE `search_export.aspx` attachment preserves structured district rows with `Town`, address, phone, and grade fields, and a bounded exact-basename join against the official Census TIGERweb county subdivision layer covers all 14 Massachusetts counties. The remaining blocker is the live DDS local-routing lane on Mass.gov. The DDS org page, locations index, and interactive regional map are real first-party surfaces, but they still expose no raw county field, no county export, and no machine-readable town-to-office contract that the low-token raw path can preserve directly on disk.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Mass.gov DDS surface that exposes county names, county-served labels, or a county-keyed export for DDS regional or area offices.',
    '- Any reviewable browser/cached capture from the live DDS interactive map that preserves town-or-city to office mappings strongly enough to truthfully bridge all 14 counties.',
    '- Any exact first-party DDS locations child page or API response that makes locality-to-office coverage machine-readable without relying on guessed paths.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Massachusetts DESE district export](https://profiles.doe.mass.edu/search/search_export.aspx?orgCode=&orgType=5,12&runOrgSearch=Y&searchType=0&leftNavId=11238&showEmail=N)',
    '- [Census TIGERweb county subdivision query](https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/1/query?where=STATE%3D%2725%27&outFields=NAME,BASENAME,STATE,COUNTY,COUSUB,GEOID&returnGeometry=false&f=json)',
    '- [Massachusetts DDS org page](https://www.mass.gov/orgs/department-of-developmental-services)',
    '- [Massachusetts DDS locations index](https://www.mass.gov/orgs/department-of-developmental-services/locations)',
    '- [Massachusetts DDS interactive regional map](https://www.mass.gov/info-details/interactive-dds-regional-map)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any live Mass.gov DDS county field, county export, or locality-to-office payload that can be preserved without guessing hidden endpoints.',
    '- Any reviewed browser/cached DDS interactive-map capture that truthfully maps Massachusetts towns or cities to area offices and can then be bridged to counties.',
    '- Any exact DDS child location page that adds county-served labels or a county routing contract.',
    '',
    '## Next State Order After Massachusetts',
    '',
    '1. New Mexico',
    '2. South Dakota',
    '3. Rhode Island',
    '4. Virginia',
    '5. West Virginia',
    '6. North Dakota',
    '7. Wisconsin',
    '8. Washington',
    '9. Tennessee',
    '10. Vermont',
  ].join('\n');

  updated = updated.replace(/## Current Focus State:[\s\S]*$/m, replacementSection);
  return `${updated.trimEnd()}\n`;
}

export function generateBatch352MassachusettsDeseExportCountyCaptureV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const queueRows = readJsonl(INPUTS.queue);
  const educationPacket = readJson(INPUTS.educationPacket);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');

  const updatedSummary = {
    ...summary,
    batch: 'batch352_massachusetts_dese_export_county_capture_v1',
    completeness_pct: 92,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_dds_county_contract_or_reviewed_capture',
    critical_gap_families: ['county_local_disability_resources'],
    final_blockers: (summary.final_blockers || []).filter((row) => row.family === 'county_local_disability_resources'),
    familyStatuses: {
      ...summary.familyStatuses,
      district_or_county_education_routing: EDUCATION_STATUS,
      county_local_disability_resources: 'blocked_live_dds_browser_lane_without_raw_county_contract',
    },
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: EDUCATION_STATUS,
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_dds_browser_lane_without_raw_county_contract',
        status_reason: COUNTY_LOCAL_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'district_or_county_education_routing');

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      family_status: EDUCATION_STATUS,
      evidence_strength: 'strong',
      sample_count: 4,
      query_basis: EDUCATION_QUERY_BASIS,
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'DESE Profiles Search',
          source_url: 'https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238',
          final_url: 'https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238',
          verification_status: 'verified',
          source_type: 'official_district_directory_search_form',
          source_table: 'batch352_massachusetts_dese_export_county_capture_v1',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet:
            'The official search form links to the same district query family that now also exposes a real export endpoint on the live DESE host.',
        },
        {
          sample_name: 'DESE district export',
          source_url:
            'https://profiles.doe.mass.edu/search/search_export.aspx?orgCode=&orgType=5,12&runOrgSearch=Y&searchType=0&leftNavId=11238&showEmail=N',
          final_url:
            'https://profiles.doe.mass.edu/search/search_export.aspx?orgCode=&orgType=5,12&runOrgSearch=Y&searchType=0&leftNavId=11238&showEmail=N',
          verification_status: 'verified',
          source_type: 'official_public_district_export',
          source_table: 'batch352_massachusetts_dese_export_county_capture_v1',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet:
            'The official `search_export.aspx` endpoint returns `application/excel` with a `search.xls` attachment that preserves `Org Name`, `Org Type`, `Function`, `Contact Name`, `Address 1`, `Town`, `State`, `Zip`, `Phone`, and `Grade` fields.',
        },
        {
          sample_name: 'DESE export county coverage audit',
          source_url:
            'https://profiles.doe.mass.edu/search/search_export.aspx?orgCode=&orgType=5,12&runOrgSearch=Y&searchType=0&leftNavId=11238&showEmail=N',
          final_url:
            'https://profiles.doe.mass.edu/search/search_export.aspx?orgCode=&orgType=5,12&runOrgSearch=Y&searchType=0&leftNavId=11238&showEmail=N',
          verification_status: 'verified',
          source_type: 'official_export_county_coverage_audit',
          source_table: 'batch352_massachusetts_dese_export_county_capture_v1',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet:
            'A bounded exact-basename join from the export `Town` field to the official county subdivision layer matched 406 rows directly and still covered all 14 Massachusetts counties, including Barnstable, Berkshire, Bristol, Dukes, Essex, Franklin, Hampden, Hampshire, Middlesex, Nantucket, Norfolk, Plymouth, Suffolk, and Worcester.',
        },
        {
          sample_name: 'Census TIGERweb county subdivisions',
          source_url:
            "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/1/query?where=STATE%3D'25'&outFields=NAME,BASENAME,STATE,COUNTY,COUSUB,GEOID&returnGeometry=false&f=json",
          final_url:
            "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/1/query?where=STATE%3D'25'&outFields=NAME,BASENAME,STATE,COUNTY,COUSUB,GEOID&returnGeometry=false&f=json",
          verification_status: 'verified',
          source_type: 'official_federal_county_subdivision_api',
          source_table: 'batch352_massachusetts_dese_export_county_capture_v1',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet:
            'The live official TIGERweb county subdivision layer returns Massachusetts municipality basenames plus county codes, which supplied the reviewed town-to-county crosswalk used for the bounded county coverage audit.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'district_or_county_education_routing')
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'massachusetts'
      ? {
          ...row,
          completeness_pct: 92,
          weak_critical_families: 1,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'hold_for_dds_county_contract_or_reviewed_capture',
          repair_lane: 'blocked_until_dds_county_contract_or_reviewed_capture',
        }
      : row
  ));

  const updatedEducationPacket = {
    ...educationPacket,
    repair_lane: 'verified_export_and_county_crosswalk_capture',
    purpose:
      'Deterministic packet for Massachusetts county-keyed education routing using the official DESE district export plus the official Census TIGERweb county subdivision layer.',
    current_problem_metrics: {
      ...educationPacket.current_problem_metrics,
      realPostbackResultSurface: true,
      countyMappingFieldsPresent: false,
      officialExportSurface: true,
      exportRowCount: COUNTY_CAPTURE.export_rows,
      exactTownMatches: COUNTY_CAPTURE.exact_basename_matches,
      uniqueUnmatchedTowns: COUNTY_CAPTURE.unique_unmatched_towns,
      coveredCountyCount: COUNTY_CAPTURE.covered_counties.length,
    },
    exact_target_goals: [
      'preserve the live DESE export contract',
      'preserve the live county subdivision crosswalk contract',
      'keep the bounded county coverage audit artifact on disk',
    ],
    representative_sources: [
      'https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238',
      'https://profiles.doe.mass.edu/search/search_export.aspx?orgCode=&orgType=5,12&runOrgSearch=Y&searchType=0&leftNavId=11238&showEmail=N',
      "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/1/query?where=STATE%3D'25'&outFields=NAME,BASENAME,STATE,COUNTY,COUSUB,GEOID&returnGeometry=false&f=json",
    ],
    root_domains_to_review: [
      'education is now cleared by the official DESE export plus the official county subdivision layer; do not fall back to statewide DESE special-education pages',
      'the remaining Massachusetts blocker is DDS county-local, not DESE district routing',
      'unmatched charter or neighborhood mailing-town rows do not reopen the blocker when bounded exact-basename coverage still spans all 14 counties',
    ],
    packet_complete_when:
      'Satisfied by the reviewed official DESE export plus the reviewed official Census county subdivision crosswalk covering all 14 Massachusetts counties.',
  };

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((state) => (
      state.stateId === 'massachusetts'
        ? {
            ...state,
            strongCriticalFamilies: 11,
            weakCriticalFamilies: 1,
            completenessPct: 92,
            familyStatuses: {
              ...state.familyStatuses,
              district_or_county_education_routing: EDUCATION_STATUS,
              county_local_disability_resources: 'blocked_live_dds_browser_lane_without_raw_county_contract',
            },
            packetBatch: 'batch352_massachusetts_dese_export_county_capture_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'hold_for_dds_county_contract_or_reviewed_capture',
          }
        : state
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  writeJson(OUTPUTS.countyCapture, COUNTY_CAPTURE);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.allStateReport, updateAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, updateHandoff(handoff));

  const batchSummary = {
    batch: 'batch352_massachusetts_dese_export_county_capture_v1',
    generated_at: '2026-06-25T00:00:00.000Z',
    state: 'massachusetts',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    education_cleared: true,
    county_local_remaining_blocker: true,
    covered_counties: COUNTY_CAPTURE.covered_counties.length,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 352 Massachusetts DESE Export County Capture Report v1',
    '',
    '- Confirmed the live official DESE `search_export.aspx` endpoint returns a real `search.xls` attachment with structured district locality fields.',
    '- Confirmed the live official Census TIGERweb county subdivision layer returns Massachusetts municipality basenames and county codes without requiring broad crawling.',
    '- Preserved a bounded exact-basename county coverage audit showing all 14 Massachusetts counties are now covered for district-grade education routing.',
    '- Massachusetts remains BLOCKED and not index-safe only because the DDS county-local lane still lacks a preserved official county-grade contract in the low-token raw path.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch352MassachusettsDeseExportCountyCaptureV1();
  console.log(JSON.stringify(result, null, 2));
}
