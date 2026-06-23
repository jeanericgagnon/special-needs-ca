import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'oregon_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'oregon_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'oregon_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'oregon_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'oregon_next_action_queue_v2.jsonl'),
  priorityQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  report: path.join(docsGeneratedDir, 'oregon-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch267_oregon_county_searchable_school_directory_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch267-oregon-county-searchable-school-directory-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'official_ode_county_searchable_school_directory_clears_education_but_live_office_finder_root_still_has_no_county_extract';
const COUNTY_LOCAL_FAILURE_CODE = 'live_office_finder_root_without_county_extract';
const COUNTY_LOCAL_NEXT_ACTION = 'hold_blocked_until_county_grade_office_contract_is_extracted_from_live_office_finder_or_county_owned_leaves';
const COUNTY_LOCAL_STATUS_REASON = 'the live ODHS office-finder root exists, but static evidence still exposes no county list or office extract and current county rows remain DOI-backed or dead-host placeholders';
const EDUCATION_STATUS_REASON = 'the official Oregon School Directory PDF now clears county-grade education routing. The live ODE School Directory page links a current Combined Directory PDF and explicitly says the index allows users to search by county. Inside the PDF, Oregon education service districts and school districts are described as listed alphabetically by county, and the district example preserves phone, address, website, email, and superintendent fields. Oregon therefore now has an official county-searchable district-routing contract on disk even without district-owned special-education leaves.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 one more bounded official Oregon education surface from the live ODE special-education root. The live School Directory page at https://www.oregon.gov/ode/about-us/Pages/School-Directory.aspx links the current Combined Directory PDF at https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf. The page explicitly says the PDF index allows users to search by county. In the PDF itself, the public-schools section says Oregon education service districts and school districts are listed alphabetically by county, with staff members, addresses, phone numbers, websites, and grade ranges. The example district block for Baker SD 5J preserves institution ID, phone, fax, street address, website, and superintendent. Oregon therefore now has a reviewed official county-grade district-routing contract on disk.';
const LESSON_HEADING = '### An Official School Directory PDF That Explicitly Organizes Districts By County Can Clear County-Grade Education Routing';
const LESSON_BODY = '*   **Lesson:** If a live official school-directory PDF explicitly says districts are listed by county and preserves district contact blocks, that can clear county-grade education routing without district-owned special-education leaves. Oregon’s ODE School Directory page linked a current Combined Directory PDF whose own instructions and public-schools section both confirmed county organization and district contact fields.';

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
    '# Oregon California-Grade Audit Report v2',
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
    '- Oregon no longer lacks county-grade education routing evidence on disk.',
    '- The official ODE School Directory PDF now clears education because it explicitly organizes districts by county and preserves district contact blocks.',
    '- Oregon still cannot reach California-grade or become index-safe because county/local disability resources still have no preserved county-grade office contract from the live ODHS office-finder root.',
    '- Oregon therefore remains BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  const current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const replacement = current
    .replace('- Oregon: `live_state_special_education_root_without_district_contract_and_live_office_finder_root_without_county_extract`', '- Oregon: `official_ode_county_searchable_school_directory_clears_education_but_live_office_finder_root_still_has_no_county_extract`')
    .replace('## Current Focus State: Massachusetts', '## Current Focus State: Oregon')
    .replace(
      '`district_or_county_education_routing` remains the top Massachusetts blocker in the state queue. The hidden DESE district-directory replay still no longer materializes local rows, and the live official School Finder at `get_closest_orgs.aspx` only accepts address, city, or town inputs. It exposes superintendent and address-oriented local search behavior, but no county field, no county selector, and no export lane that can be truthfully bridged to county rows.',
      '`county_local_disability_resources` is now the top Oregon blocker in the state queue. The official ODE School Directory PDF clears education because it explicitly organizes districts by county and preserves district contact blocks, but the live ODHS office-finder root still returns only a generic `Find an Office` page in static HTML with no county list, no office extract, and no county-to-office contract.'
    )
    .replace(
      '- Any official Massachusetts DESE county-to-district contract, county selector, or county-keyed export.\n- Or, a reviewed browser/cached DESE or DDS locality capture that can be truthfully bridged to counties.\n- Or, an official DDS county crosswalk or county-served export.\n- The live School Finder, the non-materializing hidden replay, and the DDS raw-403 location pages are still not enough without county-grade routing fields.',
      '- Any official ODHS county-to-office contract, county list, or office extract from the live office-finder stack.\n- Or, official county-owned disability office leaves that can be truthfully mapped to Oregon counties.\n- The ODE school-directory PDF no longer needs repair, but the live ODHS office-finder root is still not enough without county-grade routing fields.'
    )
    .replace(
      '- [DESE district-directory bridge](https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238)\n- [DESE Profiles Search](https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238)\n- [DESE School Finder](https://profiles.doe.mass.edu/search/get_closest_orgs.aspx)\n- [DESE Search, Export and Mailing Labels help](https://profiles.doe.mass.edu/help/search.aspx?leftNavId=12104)\n- [DDS org page](https://www.mass.gov/orgs/department-of-developmental-services)\n- [DDS locations index](https://www.mass.gov/orgs/department-of-developmental-services/locations)\n- [DDS interactive regional map](https://www.mass.gov/info-details/interactive-dds-regional-map)',
      '- [ODE Special Education root](https://www.oregon.gov/ode/students-and-family/specialeducation/pages/default.aspx)\n- [ODE School Directory page](https://www.oregon.gov/ode/about-us/Pages/School-Directory.aspx)\n- [ODE Combined Directory PDF](https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf)\n- [ODHS Find an Office root](https://www.oregon.gov/odhs/pages/office-finder.aspx)\n- [ODHS home](https://www.oregon.gov/odhs/Pages/default.aspx)\n- [ODE home](https://www.oregon.gov/ode/Pages/default.aspx)'
    )
    .replace(
      '- Any official Massachusetts DESE county-keyed export, selector, or district crosswalk.\n- Any official DDS county crosswalk or county-served locality export.\n- Any reviewed browser/cached locality capture from DESE or DDS that can be truthfully bridged to counties.',
      '- Any official ODHS county list, office extract, or county-to-office contract behind the live office-finder lane.\n- Any official county-owned disability office leaves that can replace DOI-backed planning rows.\n- Any machine-readable ODHS successor artifact to the dead `dhhs.oregon.gov/locations` host.'
    )
    .replace(
      '## Next State Order After Massachusetts\n\n1. Oregon\n2. Oklahoma\n3. Utah\n4. New Hampshire\n5. New Mexico\n6. New York\n7. North Carolina\n8. North Dakota\n9. Rhode Island\n10. South Carolina',
      '## Next State Order After Oregon\n\n1. Oklahoma\n2. Utah\n3. New Hampshire\n4. New Mexico\n5. New York\n6. North Carolina\n7. North Dakota\n8. Rhode Island\n9. South Carolina\n10. South Dakota'
    );
  fs.writeFileSync(INPUTS.handoff, replacement);
}

function updateLessons() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

export function generateBatch267OregonCountySearchableSchoolDirectoryV1() {
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
      district_or_county_education_routing: 'verified_county_grade_official_directory_pdf',
      county_local_disability_resources: 'blocked_live_office_finder_root_without_county_extract',
    },
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_county_grade_official_directory_pdf',
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
          family_status: 'verified_county_grade_official_directory_pdf',
          evidence_strength: 'strong',
          sample_count: 4,
          query_basis: 'Reviewed live ODE School Directory page plus the current official Combined Directory PDF.',
          blocker_code: null,
          blocker_evidence: null,
          samples: [
            {
              sample_name: 'ODE School Directory page',
              source_url: 'https://www.oregon.gov/ode/about-us/Pages/School-Directory.aspx',
              final_url: 'https://www.oregon.gov/ode/about-us/Pages/School-Directory.aspx',
              verification_status: 'verified',
              source_type: 'official_county_searchable_directory_landing_page',
              source_table: 'batch267_oregon_county_searchable_school_directory',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live page says the Oregon School Directory is an online resource for all public schools and districts and explicitly says the PDF index allows users to search by county.'
            },
            {
              sample_name: 'ODE Combined Directory PDF',
              source_url: 'https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf',
              final_url: 'https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf',
              verification_status: 'verified',
              source_type: 'official_county_searchable_directory_pdf',
              source_table: 'batch267_oregon_county_searchable_school_directory',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The public-schools section states Oregon education service districts and school districts are listed alphabetically by county.'
            },
            {
              sample_name: 'Directory district example',
              source_url: 'https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf',
              final_url: 'https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf',
              verification_status: 'verified',
              source_type: 'official_district_contact_block_example',
              source_table: 'batch267_oregon_county_searchable_school_directory',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The example district block for Baker SD 5J preserves institution ID, phone, fax, street address, website, and Superintendent Casey Hallgarth.'
            },
            {
              sample_name: 'Directory index references counties',
              source_url: 'https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf',
              final_url: 'https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf',
              verification_status: 'verified',
              source_type: 'official_directory_index_with_counties',
              source_table: 'batch267_oregon_county_searchable_school_directory',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The PDF index includes schools, districts, cities, and counties.'
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
    (row.state_name || row.state) === 'Oregon'
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
    batch: 'batch267_oregon_county_searchable_school_directory_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'oregon',
    classification: 'BLOCKED',
    index_safe: false,
    education_family_status: 'verified_county_grade_official_directory_pdf',
    remaining_blocker_family: 'county_local_disability_resources',
    directory_pdf: 'https://www.oregon.gov/ode/about-us/Documents/CombinedDirectory_20260430_024706.pdf'
  });

  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 267 Oregon County-Searchable School Directory Report v1',
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
      '- Oregon remains blocked and not index-safe.',
      '- The official ODE School Directory PDF now clears county-grade education routing because it explicitly organizes districts by county and preserves district contact blocks.',
      '- County-local disability resources remain blocked because the live ODHS office-finder root still exposes no county extract or county-to-office contract in static HTML.',
    ].join('\n') + '\n'
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch267OregonCountySearchableSchoolDirectoryV1();
  console.log(JSON.stringify(result, null, 2));
}
