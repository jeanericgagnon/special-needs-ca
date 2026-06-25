import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'tennessee_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'tennessee_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'tennessee_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'tennessee_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'tennessee_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch369_tennessee_official_routing_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch369-tennessee-official-routing-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'tennessee-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence';

const EDUCATION_REASON =
  'Reviewed 2026-06-25 the live Tennessee School Directory, a product of the Tennessee Department of Education, on the official `k-12.education.tn.gov` host. The directory describes itself as the online hub for Tennessee K-12 district, school, and region information, exposes a public search form that lets users search by Regions, Districts, or Schools, embeds a public region-and-district map, and offers a `Download the Directory` action for an Excel file of Tennessee Schools, Districts, and Regions. The same reviewed page and download-table script preserve directory fields including Region, District, District No., County, address, phone, fax, and email, and the commissioner message says Tennessee is home to 149 unique school districts. This replaces Tennessee’s old statewide education fallback with current official district-routing evidence that preserves district and county locality fields.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 first-party Tennessee Department of Human Services office-locator pages. The live `Find Our Offices` page links families to Family Assistance and Rehabilitation Services and states that DHS provides Adult Protective Services and Vocational Rehabilitation Services statewide. The official Family Assistance office locator then preserves a public `Family Assistance District/County Office Hours` workbook link, a `Select a County` jump menu with county anchors such as Anderson, Bedford, and Benton, and county-specific office blocks with direct phone and fax fields such as Anderson County, Bedford County, Davidson County Office, and Shelby County Family Assistance Office. This replaces Tennessee’s old DOI-backed county-office evidence with current first-party county-local routing on the live TDHS host family.';

const VR_REASON =
  'Reviewed 2026-06-25 current first-party Tennessee Department of Human Services vocational-rehabilitation pages. The official `VR Office Locations` page explicitly covers `Vocational Rehabilitation Regional Offices, Community Tennessee Rehabilitation Centers, and Tennessee Technology Access Centers`, provides a live `OneDHS - Vocational Rehabilitation Referral` route, and preserves county-served groupings plus county office anchors such as Bedford County, Benton County, Maury County, Sumner County, and Williamson County. The reviewed `Employment Services for Tennesseans with Disabilities` page states that Tennessee’s VR program helps Tennesseans with disabilities prepare for the competitive job market, find jobs, and advance in their career fields, while the reviewed `Pre-Employment Transition Services` page says DRS works collaboratively with local education agencies, sets aside federal funds for Pre-ETS under WIOA, and preserves the five required Pre-ETS services. This resolves Tennessee’s prior inventory-only vocational-rehabilitation and Pre-ETS gap with current official service and routing leaves.';

const LEGAL_AID_REASON =
  'Reviewed 2026-06-25 the live first-party Help4TN domain. The homepage identifies Help4TN as `A program of Tennessee Alliance for Legal Services`, describes it as `Find free legal help and social services`, and states that it provides Tennesseans with a broad range of legal and social services resources. The same reviewed homepage preserves the Legal Wellness Checkup and Tennessee Free Legal Answers routes, and the reviewed `Free Senior Legal Helpline` leaf states that Help4TN attorneys offer confidential legal advice and information at no cost to Tennesseans age 60 and above through 844-HELP4TN. This supplies current first-party statewide legal-aid evidence for Tennessee.';

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
    '# Tennessee California-Grade Batch 91 Report v1',
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
    ...(failureRows.length ? failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`) : ['- none']),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...(nextRows.length ? nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`) : ['- none']),
    '',
    '## Completion decision',
    '',
    '- Tennessee is now `COMPLETE` and `index_safe=true`.',
    '- `district_or_county_education_routing` now clears because the official Tennessee School Directory publicly supports district search, district download, district map routing, and county-tagged directory fields on a Tennessee Department of Education host.',
    '- `county_local_disability_resources` now clears because TDHS publishes a county-based Family Assistance office locator plus statewide DHS office-routing instructions on the live official host family.',
    '- `vocational_rehabilitation_pre_ets` now clears because the official VR office locator, employment-services page, and Pre-Employment Transition Services page preserve statewide referral, county/regional routing, and explicit student-transition service language.',
    '- `legal_aid` now clears because Help4TN preserves current first-party Tennessee Alliance for Legal Services routing for free legal help, legal wellness, Tennessee Free Legal Answers, and the free senior legal helpline.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 369 Tennessee Official Routing Repair v1',
    '',
    '- classification: COMPLETE',
    '- index_safe: true',
    '- change: cleared Tennessee education routing, county/local disability resources, vocational rehabilitation / Pre-ETS, and legal aid with live official and first-party evidence',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    `- ${COUNTY_REASON}`,
    `- ${VR_REASON}`,
    `- ${LEGAL_AID_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch369TennesseeOfficialRoutingRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    classification: 'COMPLETE',
    index_safe: true,
    completeness_pct: 100,
    strong_critical_families: 12,
    weak_critical_families: 0,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'complete_maintain',
    critical_gap_families: [],
    major_gap_families: [],
    complete_ready: true,
    final_blockers: null,
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: VR_REASON,
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: LEGAL_AID_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = [];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 live first-party Tennessee Department of Education school-directory pages and directory schema fields on the official k-12.education.tn.gov host.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Tennessee School Directory homepage',
            source_url: 'https://k-12.education.tn.gov/sde/',
            final_url: 'https://k-12.education.tn.gov/sde/',
            verification_status: 'official_verified',
            source_type: 'official_school_directory_homepage',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Tennessee School Directory is the online hub for information about the state’s K-12 districts and schools, with detailed data on each district, school, and region.',
          },
          {
            sample_name: 'Tennessee School Directory public district search',
            source_url: 'https://k-12.education.tn.gov/sde/',
            final_url: 'https://k-12.education.tn.gov/sde/',
            verification_status: 'official_verified',
            source_type: 'official_directory_search_form',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public search form lets users search the directory by Regions, Districts, or Schools and filter status directly on the official host.',
          },
          {
            sample_name: 'Tennessee School Directory download schema',
            source_url: 'https://k-12.education.tn.gov/sde/',
            final_url: 'https://k-12.education.tn.gov/sde/',
            verification_status: 'official_verified',
            source_type: 'official_directory_download_schema',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same official page offers `Download an Excel file of Tennessee Schools, Districts, and Regions`, and its reviewed download-table fields include Region, District, District No., County, address, phone, fax, and email.',
          },
          {
            sample_name: 'Tennessee School Directory district count',
            source_url: 'https://k-12.education.tn.gov/sde/',
            final_url: 'https://k-12.education.tn.gov/sde/',
            verification_status: 'official_verified',
            source_type: 'official_directory_overview',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed commissioner message says Tennessee is home to 149 unique school districts, nearly 2,000 schools, and over 67,000 dedicated educators.',
          },
        ],
      };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 live first-party Tennessee VR office locator, employment-services page, transition services page, and Pre-ETS page.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Tennessee VR Office Locations',
            source_url: 'https://www.tn.gov/humanservices/ds/office-locator-trc-ttap.html',
            final_url: 'https://www.tn.gov/humanservices/ds/office-locator-trc-ttap.html',
            verification_status: 'official_verified',
            source_type: 'official_vr_office_locator',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official page covers Vocational Rehabilitation Regional Offices, Community Tennessee Rehabilitation Centers, and Tennessee Technology Access Centers and provides a live OneDHS Vocational Rehabilitation Referral route.',
          },
          {
            sample_name: 'Tennessee VR county-served routing',
            source_url: 'https://www.tn.gov/humanservices/ds/office-locator-trc-ttap.html',
            final_url: 'https://www.tn.gov/humanservices/ds/office-locator-trc-ttap.html',
            verification_status: 'official_verified',
            source_type: 'official_vr_county_routing',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same office locator preserves county-served regional groupings and county office anchors such as Bedford County, Benton County, Maury County, Sumner County, and Williamson County.',
          },
          {
            sample_name: 'Employment Services for Tennesseans with Disabilities',
            source_url: 'https://www.tn.gov/humanservices/ds/vocational-rehabilitation/vr-services-to-eligible-individuals.html',
            final_url: 'https://www.tn.gov/humanservices/ds/vocational-rehabilitation/vr-services-to-eligible-individuals.html',
            verification_status: 'official_verified',
            source_type: 'official_vr_services_page',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Tennessee’s VR program helps Tennesseans with disabilities prepare for the competitive job market, find jobs, and advance in their career fields, and it includes focused Pre-Employment Transition Service support for students ages 14-21.',
          },
          {
            sample_name: 'Tennessee Pre-Employment Transition Services',
            source_url: 'https://www.tn.gov/humanservices/ds/vocational-rehabilitation/transition-services/pre-employment-transition-services.html',
            final_url: 'https://www.tn.gov/humanservices/ds/vocational-rehabilitation/transition-services/pre-employment-transition-services.html',
            verification_status: 'official_verified',
            source_type: 'official_pre_ets_page',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Pre-Employment Transition Services page says DRS works collaboratively with local education agencies and preserves the five required Pre-ETS services under WIOA, including job exploration counseling and postsecondary counseling.',
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 live first-party Help4TN homepage and legal-help leaves for statewide Tennessee legal-aid routing evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Help4TN homepage',
            source_url: 'https://www.help4tn.org/',
            final_url: 'https://www.help4tn.org/',
            verification_status: 'official_verified',
            source_type: 'official_homepage',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The homepage identifies Help4TN as a program of Tennessee Alliance for Legal Services and presents it as `Find free legal help and social services` for Tennesseans.',
          },
          {
            sample_name: 'Help4TN legal-help tools',
            source_url: 'https://www.help4tn.org/',
            final_url: 'https://www.help4tn.org/',
            verification_status: 'official_verified',
            source_type: 'official_legal_help_hub',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same homepage preserves statewide legal-help routes including the Legal Wellness Checkup and Tennessee Free Legal Answers at no cost.',
          },
          {
            sample_name: 'Help4TN Free Senior Legal Helpline',
            source_url: 'https://www.help4tn.org/page/1519/free-senior-legal-helpline',
            final_url: 'https://www.help4tn.org/page/1519/free-senior-legal-helpline',
            verification_status: 'official_verified',
            source_type: 'official_legal_helpline_page',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Help4TN attorneys offer confidential legal advice and information at no cost to Tennesseans age 60 and above through 844-HELP4TN.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 live first-party TDHS office-locator pages for statewide county-office routing and local county examples.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'TDHS Find Our Offices',
            source_url: 'https://www.tn.gov/humanservices/need-help-/tdhs-find-our-offices.html',
            final_url: 'https://www.tn.gov/humanservices/need-help-/tdhs-find-our-offices.html',
            verification_status: 'official_verified',
            source_type: 'official_office_locator_root',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official Find Our Offices page links families to Family Assistance and Rehabilitation Services and states that DHS provides Adult Protective Services and Vocational Rehabilitation Services statewide.',
          },
          {
            sample_name: 'TDHS Family Assistance county selector',
            source_url: 'https://www.tn.gov/humanservices/for-families/supplemental-nutrition-assistance-program-snap/office-locator-family-assistance.html',
            final_url: 'https://www.tn.gov/humanservices/for-families/supplemental-nutrition-assistance-program-snap/office-locator-family-assistance.html',
            verification_status: 'official_verified',
            source_type: 'official_county_office_locator',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Family Assistance locator preserves a `Family Assistance District/County Office Hours` workbook and a `Select a County` menu with county anchors such as Anderson, Bedford, and Benton.',
          },
          {
            sample_name: 'Anderson County Family Assistance office',
            source_url: 'https://www.tn.gov/humanservices/for-families/supplemental-nutrition-assistance-program-snap/office-locator-family-assistance.html',
            final_url: 'https://www.tn.gov/humanservices/for-families/supplemental-nutrition-assistance-program-snap/office-locator-family-assistance.html',
            verification_status: 'official_verified',
            source_type: 'official_county_office_entry',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same official county-office page preserves an Anderson County office block with direct county-specific phone and fax fields.',
          },
          {
            sample_name: 'Davidson and Shelby county Family Assistance offices',
            source_url: 'https://www.tn.gov/humanservices/for-families/supplemental-nutrition-assistance-program-snap/office-locator-family-assistance.html',
            final_url: 'https://www.tn.gov/humanservices/for-families/supplemental-nutrition-assistance-program-snap/office-locator-family-assistance.html',
            verification_status: 'official_verified',
            source_type: 'official_county_office_entries',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Reviewed county entries include Davidson County Office and Shelby County Family Assistance Office with direct phone and fax routing on the same official host.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = [];

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);

  const batchSummary = {
    state: 'tennessee',
    batch: 'batch369_tennessee_official_routing_repair_v1',
    classification: 'COMPLETE',
    index_safe: true,
    cleared_families: [
      'district_or_county_education_routing',
      'vocational_rehabilitation_pre_ets',
      'legal_aid',
      'county_local_disability_resources',
    ],
    remaining_blockers: [],
    evidence: {
      district_or_county_education_routing: EDUCATION_REASON,
      vocational_rehabilitation_pre_ets: VR_REASON,
      legal_aid: LEGAL_AID_REASON,
      county_local_disability_resources: COUNTY_REASON,
    },
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());
  fs.writeFileSync(
    OUTPUTS.stateReport,
    buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows),
  );

  return {
    summary: updatedSummary,
    gapRows: updatedGapRows,
    verifiedRows: updatedVerifiedRows,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch369TennesseeOfficialRoutingRepairV1();
}
