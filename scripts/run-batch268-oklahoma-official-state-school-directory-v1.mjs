import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'oklahoma_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'oklahoma_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'oklahoma_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'oklahoma_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'oklahoma_next_action_queue_v2.jsonl'),
  priorityQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  report: path.join(docsGeneratedDir, 'oklahoma-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch268_oklahoma_official_state_school_directory_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch268-oklahoma-official-state-school-directory-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'official_osde_state_school_directory_clears_education_but_dead_dhhs_locator_host_and_planning_rows_still_block_county_local';
const COUNTY_LOCAL_FAILURE_CODE = 'dead_dhhs_locator_host_plus_doi_planning_rows';
const COUNTY_LOCAL_NEXT_ACTION = 'hold_blocked_until_new_live_county_grade_directory_or_county_owned_leaves_are_verified';
const COUNTY_LOCAL_STATUS_REASON = 'the current statewide DHHS locations host fails DNS and the remaining county rows still depend on dead-locator or DOI planning evidence';
const EDUCATION_STATUS_REASON = 'the official Oklahoma State School and District Directory now clears county-grade education routing. The live OSDE State School Directory page explicitly says OSDE-accredited education contact information can be downloaded or browsed by district or school site and includes physical addresses, mailing addresses, phone numbers, email addresses, website URLs and more. That page also exposes live official School Directory and District Directory download links on the current Oklahoma.gov education host.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 one more bounded official Oklahoma education surface on the live Oklahoma.gov host. The page at https://oklahoma.gov/education/resources/state-school-directory.html returned HTTP 200 and explicitly states that OSDE-accredited education contact information can be downloaded or browsed by district or school site, including physical addresses, mailing addresses, phone numbers, email addresses, website URLs, and more. The same live page exposes official `School Directory` and `District Directory` download links on the OSDE host. Oklahoma therefore now has an official district-routing directory contract on the current education site, and the older `special-education` URL collapse no longer defines the education family.';
const LESSON_HEADING = '### A Live Official State School Directory Page With District Download Links Can Clear County-Grade Education Routing';
const LESSON_BODY = '*   **Lesson:** If a live official education page explicitly says district contact information can be downloaded or browsed and exposes current district-directory download links, that can clear county-grade education routing even when older special-education leaf guesses collapse to a generic page. Oklahoma’s live `state-school-directory.html` page preserved the contract and fields directly on the current OSDE host.';

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
    '# Oklahoma California-Grade Audit Report v2',
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
    '- Oklahoma no longer lacks county-grade education routing evidence on the current OSDE host.',
    '- The official State School and District Directory page now clears education because it explicitly exposes district contact fields and current district-directory downloads.',
    '- Oklahoma still cannot reach California-grade or become index-safe because county/local disability resources still have no live county-grade directory after the DHHS locator host failed DNS resolution.',
    '- Oklahoma therefore remains BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  const current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const replacement = current
    .replace('- Oklahoma: `generic_state_education_page_collapse_and_dead_dhhs_locator_host`', '- Oklahoma: `official_osde_state_school_directory_clears_education_but_dead_dhhs_locator_host_and_planning_rows_still_block_county_local`')
    .replace('## Current Focus State: Oregon', '## Current Focus State: Oklahoma')
    .replace(
      '`county_local_disability_resources` is now the top Oregon blocker in the state queue. The official ODE School Directory PDF clears education because it explicitly organizes districts by county and preserves district contact blocks, but the live ODHS office-finder root still returns only a generic `Find an Office` page in static HTML with no county list, no office extract, and no county-to-office contract.',
      '`county_local_disability_resources` is now the top Oklahoma blocker in the state queue. The official OSDE State School and District Directory page clears education because it explicitly exposes district contact fields and live directory downloads, but the former statewide DHHS locator host is dead and the remaining county-office rows still depend on dead-locator or DOI planning evidence.'
    )
    .replace(
      '- Any official ODHS county-to-office contract, county list, or office extract from the live office-finder stack.\n- Or, official county-owned disability office leaves that can be truthfully mapped to Oregon counties.\n- The ODE school-directory PDF no longer needs repair, but the live ODHS office-finder root is still not enough without county-grade routing fields.',
      '- Any official Oklahoma county-to-office directory, county list, or county-owned human-services office leaves on a live state or county host.\n- The OSDE education directory no longer needs repair, but county-local still needs a live county-grade office contract.'
    )
    .replace(
      '- [ODE Special Education root](https://www.oregon.gov/ode/students-and-family/specialeducation/pages/default.aspx)\n- [ODE School Directory page](https://www.oregon.gov/ode/about-us/Pages/School-Directory.aspx)\n- [ODE Combined Directory PDF](https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf)\n- [ODHS Find an Office root](https://www.oregon.gov/odhs/pages/office-finder.aspx)\n- [ODHS home](https://www.oregon.gov/odhs/Pages/default.aspx)\n- [ODE home](https://www.oregon.gov/ode/Pages/default.aspx)',
      '- [OSDE home](https://oklahoma.gov/education.html)\n- [OSDE State School Directory page](https://oklahoma.gov/education/resources/state-school-directory.html)\n- [OSDE live school directory download link](https://oklahoma.gov/content/dam/ok/en/osde/documents/resources/state-directory/FY26MidyearOnlineDirectorySiteList.xlsx)\n- [OSDE live district directory download link](https://oklahoma.gov/content/dam/ok/en/osde/documents/resources/state-directory/FY26OnlineDirectoryDistrictList.xlsx)\n- [Oklahoma Human Services home](https://oklahoma.gov/okdhs.html)\n- [Former dead locator host](https://dhhs.oklahoma.gov/locations)'
    )
    .replace(
      '- Any official ODHS county list, office extract, or county-to-office contract behind the live office-finder lane.\n- Any official county-owned disability office leaves that can replace DOI-backed planning rows.\n- Any machine-readable ODHS successor artifact to the dead `dhhs.oregon.gov/locations` host.',
      '- Any live Oklahoma county office directory or county-owned human-services office leaves.\n- Any official Oklahoma successor artifact to the dead `dhhs.oklahoma.gov/locations` host.\n- Any county-grade office extract that can replace the DOI-backed planning rows.'
    )
    .replace(
      '## Next State Order After Oregon\n\n1. Oklahoma\n2. Utah\n3. New Hampshire\n4. New Mexico\n5. New York\n6. North Carolina\n7. North Dakota\n8. Rhode Island\n9. South Carolina\n10. South Dakota',
      '## Next State Order After Oklahoma\n\n1. Utah\n2. New Hampshire\n3. New Mexico\n4. New York\n5. North Carolina\n6. North Dakota\n7. Rhode Island\n8. South Carolina\n9. South Dakota\n10. Tennessee'
    );
  fs.writeFileSync(INPUTS.handoff, replacement);
}

function updateLessons() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

export function generateBatch268OklahomaOfficialStateSchoolDirectoryV1() {
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
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: ['county_local_disability_resources'],
    weak_critical_families: 1,
    final_blockers: (summary.final_blockers || []).filter((blocker) => blocker.family !== 'district_or_county_education_routing'),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: 'verified_current_official_state_school_directory',
      county_local_disability_resources: 'blocked_dead_statewide_locator_and_planning_rows',
    },
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_current_official_state_school_directory',
        status_reason: EDUCATION_STATUS_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, status_reason: COUNTY_LOCAL_STATUS_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'district_or_county_education_routing');

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'verified_current_official_state_school_directory',
          evidence_strength: 'strong',
          sample_count: 4,
          query_basis: 'Reviewed live current OSDE State School and District Directory page plus its official download links.',
          blocker_code: null,
          blocker_evidence: null,
          samples: [
            {
              sample_name: 'OSDE State School and District Directory page',
              source_url: 'https://oklahoma.gov/education/resources/state-school-directory.html',
              final_url: 'https://oklahoma.gov/education/resources/state-school-directory.html',
              verification_status: 'verified',
              source_type: 'official_directory_landing_page',
              source_table: 'batch268_oklahoma_official_state_school_directory',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live page says OSDE-accredited contact information can be downloaded or browsed by district or school site.'
            },
            {
              sample_name: 'OSDE directory field contract',
              source_url: 'https://oklahoma.gov/education/resources/state-school-directory.html',
              final_url: 'https://oklahoma.gov/education/resources/state-school-directory.html',
              verification_status: 'verified',
              source_type: 'official_directory_field_contract',
              source_table: 'batch268_oklahoma_official_state_school_directory',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The page explicitly lists physical addresses, mailing addresses, phone numbers, email addresses, website URLs and more as included fields.'
            },
            {
              sample_name: 'OSDE School Directory download link',
              source_url: 'https://oklahoma.gov/content/dam/ok/en/osde/documents/resources/state-directory/FY26MidyearOnlineDirectorySiteList.xlsx',
              final_url: 'https://oklahoma.gov/content/dam/ok/en/osde/documents/resources/state-directory/FY26MidyearOnlineDirectorySiteList.xlsx',
              verification_status: 'verified',
              source_type: 'official_school_directory_download',
              source_table: 'batch268_oklahoma_official_state_school_directory',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live OSDE directory page exposes a current School Directory download on the Oklahoma.gov education host.'
            },
            {
              sample_name: 'OSDE District Directory download link',
              source_url: 'https://oklahoma.gov/content/dam/ok/en/osde/documents/resources/state-directory/FY26OnlineDirectoryDistrictList.xlsx',
              final_url: 'https://oklahoma.gov/content/dam/ok/en/osde/documents/resources/state-directory/FY26OnlineDirectoryDistrictList.xlsx',
              verification_status: 'verified',
              source_type: 'official_district_directory_download',
              source_table: 'batch268_oklahoma_official_state_school_directory',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live OSDE directory page exposes a current District Directory download on the Oklahoma.gov education host.'
            }
          ]
        }
      : row
  ));

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'district_or_county_education_routing')
    .map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: COUNTY_LOCAL_FAILURE_CODE, next_action: COUNTY_LOCAL_NEXT_ACTION }
        : row
    ));

  const updatedPriorityRows = priorityRows.map((row) => (
    (row.state_name || row.state) === 'Oklahoma'
      ? { ...row, classification: 'BLOCKED', index_safe: false, primary_gap_reason: PRIMARY_GAP_REASON, status: 'BLOCKED', weak_critical_families: 1 }
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
    batch: 'batch268_oklahoma_official_state_school_directory_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'oklahoma',
    classification: 'BLOCKED',
    index_safe: false,
    education_family_status: 'verified_current_official_state_school_directory',
    remaining_blocker_family: 'county_local_disability_resources',
    directory_page: 'https://oklahoma.gov/education/resources/state-school-directory.html'
  });

  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 268 Oklahoma Official State School Directory Report v1',
      '',
      '- classification: BLOCKED',
      '- index_safe: false',
      '- repaired_family: district_or_county_education_routing',
      `- remaining_failure_code: ${COUNTY_LOCAL_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${EDUCATION_EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- Oklahoma remains blocked and not index-safe.',
      '- The official OSDE State School and District Directory page now clears county-grade education routing because it exposes current district contact fields and live directory downloads on the modern Oklahoma.gov host.',
      '- County-local disability resources remain blocked because the former DHHS locator host is dead and no live county-grade directory has replaced it yet.',
    ].join('\n') + '\n'
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch268OklahomaOfficialStateSchoolDirectoryV1();
  console.log(JSON.stringify(result, null, 2));
}
