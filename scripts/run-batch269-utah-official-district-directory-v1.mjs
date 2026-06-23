import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'utah_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'utah_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'utah_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'utah_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'utah_next_action_queue_v2.jsonl'),
  priorityQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  report: path.join(docsGeneratedDir, 'utah-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch269_utah_official_district_directory_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch269-utah-official-district-directory-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'official_usbe_district_lea_directory_clears_education_but_dws_locations_500_and_dhhs_locations_404_leave_no_live_county_local_contract';
const COUNTY_LOCAL_FAILURE_CODE = 'dws_locations_500_and_dhhs_locations_404_leave_no_live_county_local_contract';
const COUNTY_LOCAL_NEXT_ACTION = 'hold_blocked_until_live_county_grade_utah_office_directory_or_county_owned_leaves_are_verified';
const COUNTY_LOCAL_STATUS_REASON = 'the older DWS services locations page now returns HTTP 500, the older DHHS locations route returns HTTP 404, and the live DHHS home only exposes a statewide office address with no county-grade office directory contract';
const EDUCATION_STATUS_REASON = 'the live Utah Schools Directory now clears district-grade education routing. The official page title is `Utah Schools Directory`, its description says the data is provided from the District or Local Education Agency (LEA) in the CACTUS system and directs corrections back to the District/LEA, the page exposes a District or LEA filter control, and it provides an export-to-CSV action on the current schools.utah.gov host.';
const LESSON_HEADING = '### A Live Official District-LEA Directory With CSV Export Can Clear District-Grade Education Routing';
const LESSON_BODY = '*   **Lesson:** A live official school directory can clear the education blocker when it is explicitly district- or LEA-sourced and exposes a real district filter plus export path on the current public host. Utah\'s `schoolsdirectory` page was not just a generic state root: it declared District/LEA ownership in the page metadata and exposed district filtering plus CSV export on the live USBE host.';

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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Utah California-Grade Audit Report v2',
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
    '## Completion decision',
    '',
    '- Utah no longer lacks district-grade education routing evidence because the live Utah Schools Directory is an official district/LEA directory on the current USBE host.',
    '- The page explicitly ties the dataset to District or Local Education Agency (LEA) submissions, exposes a District or LEA filter, and provides an export-to-CSV action.',
    '- Utah still cannot reach California-grade or become index-safe because county/local disability resources still have no live county-grade office directory contract after the older DWS services locations page returned HTTP 500 and the older DHHS locations route returned HTTP 404.',
    '- Utah therefore remains BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  const current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const replacement = current
    .replace('- Utah: `generic_or_statewide_evidence_used_where_local_required`', '- Utah: `official_usbe_district_lea_directory_clears_education_but_dws_locations_500_and_dhhs_locations_404_leave_no_live_county_local_contract`')
    .replace('## Current Focus State: Oklahoma', '## Current Focus State: Utah')
    .replace(
      '`county_local_disability_resources` is now the top Oklahoma blocker in the state queue. The official OSDE State School and District Directory page clears education because it explicitly exposes district contact fields and live directory downloads, but the former statewide DHHS locator host is dead and the remaining county-office rows still depend on dead-locator or DOI planning evidence.',
      '`county_local_disability_resources` is now the top Utah blocker in the state queue. The live Utah Schools Directory clears education because it is explicitly district- and LEA-sourced and exposes a district filter plus CSV export on the official USBE host, but the older DWS services locations page returns HTTP 500, the older DHHS locations route returns HTTP 404, and the live DHHS home still lacks a county-grade office directory contract.'
    )
    .replace(
      '- Any official Oklahoma county-to-office directory, county list, or county-owned human-services office leaves on a live state or county host.\n- The OSDE education directory no longer needs repair, but county-local still needs a live county-grade office contract.',
      '- Any live Utah county office directory, county list, or county-owned human-services office leaves on a live state or county host.\n- The Utah Schools Directory no longer needs repair, but county-local still needs a live county-grade office contract.'
    )
    .replace(
      '- [OSDE home](https://oklahoma.gov/education.html)\n- [OSDE State School Directory page](https://oklahoma.gov/education/resources/state-school-directory.html)\n- [OSDE live school directory download link](https://oklahoma.gov/content/dam/ok/en/osde/documents/resources/state-directory/FY26MidyearOnlineDirectorySiteList.xlsx)\n- [OSDE live district directory download link](https://oklahoma.gov/content/dam/ok/en/osde/documents/resources/state-directory/FY26OnlineDirectoryDistrictList.xlsx)\n- [Oklahoma Human Services home](https://oklahoma.gov/okdhs.html)\n- [Former dead locator host](https://dhhs.oklahoma.gov/locations)',
      '- [Utah Schools Directory](https://schools.utah.gov/schoolsdirectory)\n- [Utah DWS contact root](https://jobs.utah.gov/contact/index.html)\n- [Older DWS services locations page](https://jobs.utah.gov/customereducation/serviceslocations.html)\n- [Utah DHHS home](https://dhhs.utah.gov)\n- [Older DHHS locations route](https://dhhs.utah.gov/locations)'
    )
    .replace(
      '- Any live Oklahoma county office directory or county-owned human-services office leaves.\n- Any official Oklahoma successor artifact to the dead `dhhs.oklahoma.gov/locations` host.\n- Any county-grade office extract that can replace the DOI-backed planning rows.',
      '- Any live Utah county office directory or county-owned human-services office leaves.\n- Any official Utah successor artifact to the broken `serviceslocations.html` and dead `dhhs.utah.gov/locations` routes.\n- Any county-grade office extract that can replace statewide-only or inventory-only local-office rows.'
    )
    .replace(
      '## Next State Order After Oklahoma\n\n1. Utah\n2. New Hampshire\n3. New Mexico\n4. New York\n5. North Carolina\n6. North Dakota\n7. Rhode Island\n8. South Carolina\n9. South Dakota\n10. Tennessee',
      '## Next State Order After Utah\n\n1. New Hampshire\n2. New Mexico\n3. New York\n4. North Carolina\n5. North Dakota\n6. Rhode Island\n7. South Carolina\n8. South Dakota\n9. Tennessee\n10. Vermont'
    );
  fs.writeFileSync(INPUTS.handoff, replacement);
}

function updateLessons() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

export function generateBatch269UtahOfficialDistrictDirectoryV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const priorityRows = readJsonl(INPUTS.priorityQueue);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: ['county_local_disability_resources'],
    final_blockers: (summary.final_blockers || []).filter((blocker) => blocker.family !== 'district_or_county_education_routing').map((blocker) => (
      blocker.family === 'county_local_disability_resources'
        ? {
            ...blocker,
            failure_code: COUNTY_LOCAL_FAILURE_CODE,
            evidence: 'Reviewed 2026-06-23 bounded live Utah county-local checks. The older DWS services locations page returned HTTP 500, the older DHHS locations route returned HTTP 404, and the live DHHS home only exposed one statewide office address instead of a county-grade directory contract. No live county-owned or state-maintained Utah county office directory was verified in this bounded pass.',
            next_action: COUNTY_LOCAL_NEXT_ACTION,
          }
        : blocker
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: 'verified_current_official_district_lea_directory',
      county_local_disability_resources: 'blocked_broken_legacy_location_routes_and_no_live_county_directory_contract',
    },
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_current_official_district_lea_directory',
        status_reason: EDUCATION_STATUS_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        status_reason: COUNTY_LOCAL_STATUS_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => row.family !== 'district_or_county_education_routing')
    .map((row) => (
      row.family === 'county_local_disability_resources'
        ? {
            ...row,
            failure_code: COUNTY_LOCAL_FAILURE_CODE,
            evidence: 'The older DWS services locations page returns HTTP 500, the older DHHS locations route returns HTTP 404, and the live DHHS home still lacks a county-grade office directory contract.',
            next_action: COUNTY_LOCAL_NEXT_ACTION,
          }
        : row
    ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'verified_current_official_district_lea_directory',
          evidence_strength: 'strong',
          sample_count: 3,
          query_basis: 'Reviewed the live official Utah Schools Directory on the current USBE host.',
          blocker_code: null,
          blocker_evidence: null,
          samples: [
            {
              sample_name: 'Utah Schools Directory title and official host',
              source_url: 'https://schools.utah.gov/schoolsdirectory',
              final_url: 'https://schools.utah.gov/schoolsdirectory',
              verification_status: 'verified',
              source_type: 'official_directory_landing_page',
              source_table: 'batch269_utah_official_district_directory',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live page title is `Utah Schools Directory` on schools.utah.gov.'
            },
            {
              sample_name: 'District or LEA source contract',
              source_url: 'https://schools.utah.gov/schoolsdirectory',
              final_url: 'https://schools.utah.gov/schoolsdirectory',
              verification_status: 'verified',
              source_type: 'official_directory_field_contract',
              source_table: 'batch269_utah_official_district_directory',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The page description says the data is provided from the District or Local Education Agency (LEA) in the CACTUS system and directs corrections back to the District/LEA.'
            },
            {
              sample_name: 'District or LEA filter plus CSV export',
              source_url: 'https://schools.utah.gov/schoolsdirectory',
              final_url: 'https://schools.utah.gov/schoolsdirectory',
              verification_status: 'verified',
              source_type: 'official_directory_controls',
              source_table: 'batch269_utah_official_district_directory',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live page exposes a `District or LEA` filter control and an `Export to CSV file` action on the current official host.'
            }
          ]
        }
      : row
  ));

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'district_or_county_education_routing')
    .map((row) => (
      row.family === 'county_local_disability_resources'
        ? {
            ...row,
            failure_code: COUNTY_LOCAL_FAILURE_CODE,
            next_action: COUNTY_LOCAL_NEXT_ACTION,
            evidence: 'The older DWS services locations page returns HTTP 500, the older DHHS locations route returns HTTP 404, and the live DHHS home still lacks a county-grade office directory contract.',
          }
        : row
    ));

  const updatedPriorityRows = priorityRows.map((row) => (
    (row.state_name || row.state) === 'Utah'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 91,
          weak_critical_families: 1,
          primary_gap_reason: PRIMARY_GAP_REASON,
          status: 'BLOCKED',
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.priorityQueue, updatedPriorityRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  updateLessons();

  writeJson(OUTPUTS.batchSummary, {
    batch: 'batch269_utah_official_district_directory_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'utah',
    classification: 'BLOCKED',
    index_safe: false,
    education_family_status: 'verified_current_official_district_lea_directory',
    remaining_blocker_family: 'county_local_disability_resources',
    district_directory_page: 'https://schools.utah.gov/schoolsdirectory',
    blocked_local_routes: [
      'https://jobs.utah.gov/customereducation/serviceslocations.html',
      'https://dhhs.utah.gov/locations',
      'https://dhhs.utah.gov',
    ],
  });

  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 269 Utah Official District Directory Report v1',
      '',
      '- classification_after: BLOCKED',
      '- index_safe_after: false',
      `- primary_gap_reason_after: ${PRIMARY_GAP_REASON}`,
      '',
      '## What changed',
      '',
      '- Cleared `district_or_county_education_routing` using the live official Utah Schools Directory.',
      '- Left `county_local_disability_resources` blocked because the older DWS services locations page returned HTTP 500, the older DHHS locations route returned HTTP 404, and the live DHHS home only exposed a statewide office address with no county-grade office directory contract.',
      '',
      '## Exact evidence',
      '',
      '- `https://schools.utah.gov/schoolsdirectory` returned HTTP 200 on 2026-06-23.',
      '- The page title is `Utah Schools Directory`.',
      '- The page description says the data is provided from the District or Local Education Agency (LEA) in the CACTUS system and directs corrections back to the District/LEA.',
      '- The page exposes a `District or LEA` filter control and an `Export to CSV file` action.',
      '',
      '## Remaining blocker',
      '',
      '- `county_local_disability_resources` remains the sole critical blocker for Utah.',
    ].join('\n') + '\n'
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch269UtahOfficialDistrictDirectoryV1();
  console.log(JSON.stringify(result, null, 2));
}
