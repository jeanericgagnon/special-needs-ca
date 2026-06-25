import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'north-dakota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'north-dakota_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'north-dakota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'north-dakota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'north-dakota_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch383_north_dakota_official_routing_completion_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch383-north-dakota-official-routing-completion-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'north-dakota-california-grade-audit-report-v2.md'),
};

const BATCH_ID = 'batch383_north_dakota_official_routing_completion_v1';
const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence';

const EDUCATION_REASON =
  'Reviewed 2026-06-25 the live official North Dakota DPI district-list page and its linked district PDF. The current page is titled `List of Districts with NCES Categories` and links the public PDF `North Dakota School Districts and NCES Critical Need and Shortage Areas`. That official PDF says `Below is a list of North Dakota districts with the District Type identified` and preserves exact district rows such as Bismarck 1, Fargo 1, Grand Forks 1, Jamestown 1, Valley City 2, West Fargo 6, Williston 1, and many additional local districts. This replaces North Dakota’s old `nd.gov` root fallback with a reviewed official district directory artifact on the current DPI host.';

const LEGAL_AID_REASON =
  'Reviewed 2026-06-25 the live first-party Legal Services of North Dakota site. The homepage says Legal Services of North Dakota is a non-profit organization providing legal assistance in a variety of matters to low income and elderly North Dakotans, and further says it is a grantee of the Legal Services Corporation that provides free legal assistance to low-income or elderly individuals. The first-party Get Help page says there are three methods to apply for legal assistance: visit an office in person, apply online, or apply over the phone. This repairs North Dakota’s missing statewide legal-aid family with current first-party legal-aid evidence.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 the live official North Dakota HHS Developmental Disabilities Regional Offices page. That page preserves named regional offices, addresses, phones, emails, and explicit serving-county contracts, including Bismarck serving Burleigh, Emmons, Grant, Kidder, McLean, Mercer, Morton, Oliver, Sheridan, and Sioux counties; Fargo serving Cass, Ransom, Richland, Sargent, Steele, and Traill counties; Jamestown serving Barnes, Dickey, Foster, Griggs, LaMoure, Logan, McIntosh, Stutsman, and Wells counties; Minot serving Bottineau, Burke, McHenry, Mountrail, Pierce, Renville, and Ward counties; and Williston serving Divide, McKenzie, and Williams counties. This replaces North Dakota’s old DOI-mirror-backed county-local disability rows with current official county-to-office routing on the HHS host.';

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
    '# North Dakota California-Grade Packet v4',
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
    '- North Dakota is now `COMPLETE` and `index_safe=true`.',
    '- `district_or_county_education_routing` now clears because the official DPI district-list page and linked public PDF preserve an exact statewide district directory instead of a generic state root.',
    '- `legal_aid` now clears because the first-party Legal Services of North Dakota site explicitly identifies statewide low-income and elderly legal-assistance scope and provides direct application methods.',
    '- `county_local_disability_resources` now clears because the official HHS Developmental Disabilities Regional Offices page publishes county-to-office service contracts with local addresses and contact information.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 383 North Dakota Official Routing Completion v1',
    '',
    '- classification: COMPLETE',
    '- index_safe: true',
    '- change: cleared North Dakota education routing, legal aid, and county/local disability resources with live official and first-party evidence',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    `- ${LEGAL_AID_REASON}`,
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch383NorthDakotaOfficialRoutingCompletionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    batch: BATCH_ID,
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
    verified_source_families_with_samples: [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'special_education_idea_part_b',
      'district_or_county_education_routing',
      'vocational_rehabilitation_pre_ets',
      'protection_and_advocacy',
      'parent_training_information_center',
      'legal_aid',
      'able_program',
      'ssi_ssa_federal_reference',
      'county_local_disability_resources',
    ],
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: EDUCATION_REASON,
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
  const updatedNextRows = [];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 live official North Dakota DPI district-list page and linked public district PDF for district-routing evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'DPI district-list page',
            source_url: 'https://www.nd.gov/dpi/list-districts-nces-categories',
            final_url: 'https://www.nd.gov/dpi/list-districts-nces-categories',
            verification_status: 'official_verified',
            source_type: 'official_district_directory_page',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live official page is titled `List of Districts with NCES Categories` and links the public PDF `North Dakota School Districts and NCES Critical Need and Shortage Areas`.',
          },
          {
            sample_name: 'DPI district PDF overview',
            source_url: 'https://www.nd.gov/dpi/sites/www/files/documents/SAO/TSLFP/NCES%20List%20for%20Website.pdf',
            final_url: 'https://www.nd.gov/dpi/sites/www/files/documents/SAO/TSLFP/NCES%20List%20for%20Website.pdf',
            verification_status: 'official_verified',
            source_type: 'official_district_directory_pdf',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official PDF says `Below is a list of North Dakota districts with the District Type identified` and labels district rows by State ID and District Name.',
          },
          {
            sample_name: 'DPI district PDF rows',
            source_url: 'https://www.nd.gov/dpi/sites/www/files/documents/SAO/TSLFP/NCES%20List%20for%20Website.pdf',
            final_url: 'https://www.nd.gov/dpi/sites/www/files/documents/SAO/TSLFP/NCES%20List%20for%20Website.pdf',
            verification_status: 'official_verified',
            source_type: 'official_district_directory_rows',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Reviewed district rows include Bismarck 1, Fargo 1, Grand Forks 1, Jamestown 1, Valley City 2, West Fargo 6, and Williston 1.',
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-25 live first-party Legal Services of North Dakota homepage and Get Help page for statewide legal-aid routing evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Legal Services of North Dakota homepage',
            source_url: 'https://lsnd.org/',
            final_url: 'https://lsnd.org/',
            verification_status: 'official_verified',
            source_type: 'first_party_legal_aid_homepage',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The homepage says Legal Services of North Dakota is a non-profit organization providing legal assistance in a variety of matters to low income and elderly North Dakotans and that it provides free legal assistance to low-income or elderly individuals.',
          },
          {
            sample_name: 'LSND Get Help page',
            source_url: 'https://lsnd.org/get-help/',
            final_url: 'https://lsnd.org/get-help/',
            verification_status: 'official_verified',
            source_type: 'first_party_legal_aid_intake_page',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The first-party Get Help page says there are three methods to apply for legal assistance: visit an office in person, apply online, or apply over the phone.',
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
        query_basis: 'Reviewed 2026-06-25 live official North Dakota HHS Developmental Disabilities Regional Offices page for county-to-office local disability routing evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'North Dakota DD regional offices page',
            source_url: 'https://www.hhs.nd.gov/dd/offices',
            final_url: 'https://www.hhs.nd.gov/dd/offices',
            verification_status: 'official_verified',
            source_type: 'official_dd_regional_office_directory',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official page is titled `Developmental Disabilities Regional Offices` and lists named HHS offices with county service areas, addresses, phones, toll-free numbers, and emails.',
          },
          {
            sample_name: 'Bismarck DD regional office',
            source_url: 'https://www.hhs.nd.gov/dd/offices',
            final_url: 'https://www.hhs.nd.gov/dd/offices',
            verification_status: 'official_verified',
            source_type: 'official_dd_regional_office_card',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Bismarck - West Central Behavioral Health Clinic is listed as serving Burleigh, Emmons, Grant, Kidder, McLean, Mercer, Morton, Oliver, Sheridan and Sioux counties.',
          },
          {
            sample_name: 'Fargo and Jamestown DD regional offices',
            source_url: 'https://www.hhs.nd.gov/dd/offices',
            final_url: 'https://www.hhs.nd.gov/dd/offices',
            verification_status: 'official_verified',
            source_type: 'official_dd_regional_office_cards',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same page lists Fargo as serving Cass, Ransom, Richland, Sargent, Steele and Traill counties, and Jamestown as serving Barnes, Dickey, Foster, Griggs, LaMoure, Logan, McIntosh, Stutsman and Wells counties.',
          },
          {
            sample_name: 'Minot and Williston DD regional offices',
            source_url: 'https://www.hhs.nd.gov/dd/offices',
            final_url: 'https://www.hhs.nd.gov/dd/offices',
            verification_status: 'official_verified',
            source_type: 'official_dd_regional_office_cards',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The page also lists Minot as serving Bottineau, Burke, McHenry, Mountrail, Pierce, Renville and Ward counties, and Williston as serving Divide, McKenzie and Williams counties.',
          },
        ],
      };
    }
    return row;
  });

  const batchSummary = {
    batch: BATCH_ID,
    state: 'north-dakota',
    classification_before: 'BLOCKED',
    classification_after: updatedSummary.classification,
    resolved_families: ['district_or_county_education_routing', 'legal_aid', 'county_local_disability_resources'],
    evidence_sources: [
      'https://www.nd.gov/dpi/list-districts-nces-categories',
      'https://www.nd.gov/dpi/sites/www/files/documents/SAO/TSLFP/NCES%20List%20for%20Website.pdf',
      'https://lsnd.org/',
      'https://lsnd.org/get-help/',
      'https://www.hhs.nd.gov/dd/offices',
    ],
  };

  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchReport = buildBatchReport();

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  return {
    summary: updatedSummary,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch383NorthDakotaOfficialRoutingCompletionV1();
  console.log(JSON.stringify(result, null, 2));
}
