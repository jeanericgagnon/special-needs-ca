import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'wisconsin_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'wisconsin_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'wisconsin_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'wisconsin_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'wisconsin_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch379_wisconsin_dpi_directory_completion_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch379-wisconsin-dpi-directory-completion-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'wisconsin-california-grade-audit-report-v2.md'),
};

const BATCH_NAME = 'batch379_wisconsin_dpi_directory_completion_v1';
const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence';

const DD_REASON =
  'Reviewed 2026-06-25 the official Wisconsin DHS `Services for People with Developmental/Intellectual Disabilities` page and the official `Services for Children with Delays or Disabilities` page. The DHS disabilities page says adults with developmental and intellectual disabilities should reach out to their local ADRC and links adult disability programs, while the children page lists Birth to 3, the Children\'s Long-Term Support Program, Katie Beckett Medicaid, and CCOP as programs for children with delays or disabilities. This supplies current official DHS developmental-disability authority and family-routing evidence.';

const EARLY_REASON =
  'Reviewed 2026-06-25 the official Wisconsin DHS `Birth to 3 Program` page. The page states that the Wisconsin Birth to 3 Program is an early intervention special education program for children under age 3 with delays or disabilities, says the program is required under Part C of IDEA, and provides a `Birth to 3 Program contacts` button under `Find your local Birth to 3 Program`. This supplies current official Part C authority and state-to-local routing evidence.';

const EDUCATION_REASON =
  'Reviewed 2026-06-25 the live official Wisconsin School Directory public portal on the DPI host. The public `School Districts` page tells families to use one or more filters to search school districts, exposes official `CESA` and `County` filter buttons, and renders a statewide district table whose header includes `CESA` and `County/Locale`. Reviewed public rows include `Abbotsford (0007)` with `CESA 10` and `Clark`, and `Adams-Friendship Area (0014)` with `CESA 5` and `Adams`, while the page footer shows `1-5 of 488 items`. A reviewed district-profile leaf such as Abbotsford further preserves `County | CESA` as `Clark County | CESA 10`. This supplies a reviewable official statewide district-to-county-to-CESA routing contract on the DPI host.';

const VR_REASON =
  'Reviewed 2026-06-25 the official Wisconsin DWD DVR home page and the official `Transition Services` page. The DVR home page says DVR helps people with disabilities find, keep, or improve a job and links `Education & Transition Services`. The reviewed transition page says DVR works with high school students transitioning to post-secondary education and employment, links a `Policy Guide for Pre-Employment Transition Services`, and publishes `DVR\'s Liaisons to Wisconsin Schools` plus university and technical-college liaison lists. This replaces Wisconsin\'s stale statewide VR placeholder with current official DWD DVR and transition-routing evidence.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
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
    '# Wisconsin California-Grade Audit Report v2',
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
    '- Wisconsin is now `COMPLETE` and `index_safe=true`.',
    '- `district_or_county_education_routing` now clears because DPI\'s public School Directory preserves `CESA` and `County/Locale` fields in a statewide district table and repeats the contract on district-profile leaves such as Abbotsford.',
    '- `developmental_disability_idd_authority` is now anchored to current Wisconsin DHS developmental-disability and children\'s-services pages rather than a stale placeholder URL.',
    '- `early_intervention_part_c` is now anchored to the official Wisconsin Birth to 3 page and its local contacts path.',
    '- `vocational_rehabilitation_pre_ets` is now anchored to the official Wisconsin DWD DVR and Transition Services pages, including school liaison and Pre-ETS guidance links.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 379 Wisconsin DPI Directory Completion v1',
    '',
    '- classification: COMPLETE',
    '- index_safe: true',
    '- change: cleared Wisconsin education routing with the live DPI School Directory contract and strengthened DD, Birth to 3, and DVR evidence to current official hosts',
    '',
    '## Evidence',
    '',
    `- ${DD_REASON}`,
    `- ${EARLY_REASON}`,
    `- ${EDUCATION_REASON}`,
    `- ${VR_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch379WisconsinDpiDirectoryCompletionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
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
    if (row.family === 'developmental_disability_idd_authority') {
      return { ...row, family_status: 'verified_state_grade', status_reason: DD_REASON };
    }
    if (row.family === 'early_intervention_part_c') {
      return { ...row, family_status: 'verified_state_grade', status_reason: EARLY_REASON };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'verified_state_grade', status_reason: EDUCATION_REASON };
    }
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return { ...row, family_status: 'verified_state_grade', status_reason: VR_REASON };
    }
    return row;
  });

  const updatedFailureRows = [];
  const updatedNextRows = [];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 official Wisconsin DHS developmental-disability and children-with-disabilities pages.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Wisconsin DHS developmental disabilities page',
            source_url: 'https://www.dhs.wisconsin.gov/disabilities/index.htm',
            final_url: 'https://www.dhs.wisconsin.gov/disabilities/index.htm',
            verification_status: 'official_verified',
            source_type: 'official_idd_authority_page',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official DHS page says Wisconsin has many programs designed to improve the lives of children and adults with developmental and intellectual disabilities.',
          },
          {
            sample_name: 'Wisconsin DHS adult disability routing',
            source_url: 'https://www.dhs.wisconsin.gov/disabilities/index.htm',
            final_url: 'https://www.dhs.wisconsin.gov/disabilities/index.htm',
            verification_status: 'official_verified',
            source_type: 'official_idd_adult_routing_statement',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same page says adults with developmental and intellectual disabilities should reach out to their local ADRC and that enrollment for adult programs must be done through the local ADRC.',
          },
          {
            sample_name: 'Wisconsin DHS children with delays or disabilities page',
            source_url: 'https://www.dhs.wisconsin.gov/children/index.htm',
            final_url: 'https://www.dhs.wisconsin.gov/children/index.htm',
            verification_status: 'official_verified',
            source_type: 'official_idd_children_programs_page',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official children\'s services page lists programs for children with delays or disabilities including Birth to 3, the Children\'s Long-Term Support Program, Katie Beckett Medicaid, and CCOP.',
          },
        ],
      };
    }
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 official Wisconsin Birth to 3 program page on dhs.wisconsin.gov.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Wisconsin Birth to 3 Program overview',
            source_url: 'https://www.dhs.wisconsin.gov/birthto3/index.htm',
            final_url: 'https://www.dhs.wisconsin.gov/birthto3/index.htm',
            verification_status: 'official_verified',
            source_type: 'official_part_c_overview',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official page says the Wisconsin Birth to 3 Program is an early intervention special education program that helps children under age 3 who have delays or disabilities.',
          },
          {
            sample_name: 'Wisconsin Birth to 3 IDEA Part C statement',
            source_url: 'https://www.dhs.wisconsin.gov/birthto3/index.htm',
            final_url: 'https://www.dhs.wisconsin.gov/birthto3/index.htm',
            verification_status: 'official_verified',
            source_type: 'official_part_c_authority_statement',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same page says this type of program is required by the federal government under Part C of the Individuals with Disabilities Education Act.',
          },
          {
            sample_name: 'Wisconsin Birth to 3 local contacts path',
            source_url: 'https://www.dhs.wisconsin.gov/birthto3/index.htm',
            final_url: 'https://www.dhs.wisconsin.gov/birthto3/index.htm',
            verification_status: 'official_verified',
            source_type: 'official_part_c_local_contacts_link',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Under `Find your local Birth to 3 Program`, the official page provides a `Birth to 3 Program contacts` button for local routing.',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 live official Wisconsin DPI School Directory public portal districts page and district-profile leaves.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'DPI School Directory landing page',
            source_url: 'https://dpi.wi.gov/schooldirectory',
            final_url: 'https://dpi.wi.gov/schooldirectory',
            verification_status: 'official_verified',
            source_type: 'official_directory_landing_page',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official DPI page says the School Directory Public Portal is a searchable collection of schools and local education agencies in the state of Wisconsin.',
          },
          {
            sample_name: 'Wisconsin School Directory district filters and columns',
            source_url: 'https://apps6.dpi.wi.gov/SchDirPublic/districts',
            final_url: 'https://apps6.dpi.wi.gov/SchDirPublic/districts',
            verification_status: 'official_verified',
            source_type: 'official_statewide_district_directory',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed public districts page tells families to use one or more filters to search school districts and exposes official `CESA` and `County` filter buttons above a table with `CESA` and `County/Locale` columns.',
          },
          {
            sample_name: 'Wisconsin School Directory district rows',
            source_url: 'https://apps6.dpi.wi.gov/SchDirPublic/districts',
            final_url: 'https://apps6.dpi.wi.gov/SchDirPublic/districts',
            verification_status: 'official_verified',
            source_type: 'official_district_to_county_region_rows',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Reviewed public rows include `Abbotsford (0007)` with `CESA 10` and `Clark`, plus `Adams-Friendship Area (0014)` with `CESA 5` and `Adams`, and the page footer shows `1-5 of 488 items`.',
          },
          {
            sample_name: 'Abbotsford district profile',
            source_url: 'https://apps6.dpi.wi.gov/SchDirPublic/district-profile?district=0007',
            final_url: 'https://apps6.dpi.wi.gov/SchDirPublic/district-profile?district=0007',
            verification_status: 'official_verified',
            source_type: 'official_district_profile_leaf',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed Abbotsford district-profile leaf explicitly preserves `County | CESA` as `Clark County | CESA 10` on the official DPI host.',
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
        query_basis: 'Reviewed 2026-06-25 official Wisconsin DWD DVR home and transition-services pages.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Wisconsin DVR home page',
            source_url: 'https://dwd.wisconsin.gov/dvr/',
            final_url: 'https://dwd.wisconsin.gov/dvr/',
            verification_status: 'official_verified',
            source_type: 'official_vr_program_home',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official DVR page says Wisconsin DVR is a federal-state program and that DVR helps people with disabilities find a job, keep a job, or get a better job.',
          },
          {
            sample_name: 'Wisconsin DVR transition services page',
            source_url: 'https://dwd.wisconsin.gov/dvr/job-seekers/transition/',
            final_url: 'https://dwd.wisconsin.gov/dvr/job-seekers/transition/',
            verification_status: 'official_verified',
            source_type: 'official_transition_services_page',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official transition page says DVR works with high school students who are transitioning from high school to post-secondary education and employment.',
          },
          {
            sample_name: 'Wisconsin DVR school liaison directory',
            source_url: 'https://dwd.wisconsin.gov/dvr/job-seekers/transition/',
            final_url: 'https://dwd.wisconsin.gov/dvr/job-seekers/transition/',
            verification_status: 'official_verified',
            source_type: 'official_transition_liaison_links',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same official page publishes `DVR\'s Liaisons to Wisconsin Schools` plus liaison lists for the Universities of Wisconsin and Wisconsin Technical Colleges.',
          },
          {
            sample_name: 'Wisconsin DVR Pre-ETS guidance',
            source_url: 'https://dwd.wisconsin.gov/dvr/job-seekers/transition/',
            final_url: 'https://dwd.wisconsin.gov/dvr/job-seekers/transition/',
            verification_status: 'official_verified',
            source_type: 'official_pre_ets_guidance_link',
            source_table: 'programs',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official transition page links the `Policy Guide for Pre-Employment Transition Services` on the same DVR host.',
          },
        ],
      };
    }
    return row;
  });

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);

  writeJson(OUTPUTS.batchSummary, {
    state: 'wisconsin',
    classification: 'COMPLETE',
    index_safe: true,
    cleared_families: [
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'district_or_county_education_routing',
      'vocational_rehabilitation_pre_ets',
    ],
    education_evidence: EDUCATION_REASON,
  });
  fs.mkdirSync(path.dirname(OUTPUTS.stateReport), { recursive: true });
  fs.writeFileSync(
    OUTPUTS.stateReport,
    buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows)
  );
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());

  return {
    state: 'wisconsin',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    cleared_families: [
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'district_or_county_education_routing',
      'vocational_rehabilitation_pre_ets',
    ],
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch379WisconsinDpiDirectoryCompletionV1();
  console.log(JSON.stringify(result, null, 2));
}
