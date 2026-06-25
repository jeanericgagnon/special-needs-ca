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
  verified: path.join(generatedDir, 'wisconsin_verified_sources_v1.jsonl'),
};

const OUTPUTS = {
  failure: path.join(generatedDir, 'wisconsin_failure_ledger_v2.jsonl'),
  next: path.join(generatedDir, 'wisconsin_next_action_queue_v2.jsonl'),
  batchSummary: path.join(generatedDir, 'batch372_wisconsin_official_routing_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch372-wisconsin-official-routing-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'wisconsin-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'official_dpi_directory_and_cesa_network_are_public_but_no_reviewed_statewide_county_to_region_or_special_education_crosswalk_is_preserved_on_disk';
const EDUCATION_FAILURE_CODE =
  'official_school_directory_and_cesa_network_exist_but_no_reviewed_statewide_county_or_special_education_crosswalk_is_preserved';
const EDUCATION_FAMILY_STATUS =
  'blocked_official_directory_and_cesa_network_without_reviewable_county_or_special_education_crosswalk';
const EDUCATION_NEXT_ACTION =
  'hold_blocked_until_wisconsin_publishes_reviewable_county_to_cesa_or_district_special_education_crosswalk';

const EDUCATION_REASON =
  'Reviewed 2026-06-25 one more bounded official education-routing pass. DPI publishes a live official `Cooperative Educational Service Agency (CESA)` page with current CESA contacts, district counts, and links to all 12 CESA agency websites. DPI also publishes a live official `School Directory: Your Source for School Directory Data` page that links families to the `School Directory Public Portal`, and the reviewed public portal client assets preserve county and CESA filter surfaces. Multiple live first-party CESA sites further preserve district-owned navigation such as `Member Districts`, `Districts`, and `CESA 4 School Districts`, showing a real public regional network exists. But this pass still did not preserve a single reviewed statewide county-to-CESA contract, exported district list with county and CESA fields, or district-owned special-education crosswalk on disk. Because the current proof stops at portal and network structure instead of a reviewable statewide routing contract, Wisconsin education routing remains blocked.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 the live official Wisconsin DHS ADRC contact directory. The page says `Call or visit your local ADRC in person`, lets families `Find your local ADRC or Tribal ADRS`, and publicly preserves contact cards with explicit `Service area` fields. Reviewed examples include `ADRC of Adams County` with `Service area Adams County`, `ADRC of Clark County` with `Service area Clark County`, and Tribal ADRS entries for Wisconsin Tribal nations. This replaces Wisconsin\'s old DOI-derived county-office evidence with a current first-party statewide county-local disability routing directory on the DHS host.';

const PTI_REASON =
  'Reviewed 2026-06-25 live first-party WI FACETS pages. The current staff page says Nelsinia Ramos is `Co-Director of the Wisconsin Parent Training and Information Center, which the U.S. Department of Education funds`, and says Courtney Salzer is `Co-Director of the OSEP-funded Wisconsin Parent Training and Information Center (PTI)`. The live statewide projects page states `Parent Training and Information Center (PTIC)` and says WI FACETS has been funded by the U.S. Department of Education since 2001 to support families and others with training, information, and support related to children with disabilities and IDEA. This now supplies direct first-party PTI designation evidence for Wisconsin.';

const LEGAL_AID_REASON =
  'Reviewed 2026-06-25 live first-party Legal Action Wisconsin pages. The homepage preserves an `Apply for FREE legal help` route, statewide service categories including housing, employment, debt and taxes, public benefits, family law, and victim support, and a current news item titled `Legal Action of Wisconsin and Judicare Legal Aid Merge, Creating Wisconsin\'s Largest Statewide Civil Legal...`. The about page also states the website was made possible by generous support of the Legal Services Corporation. Together these live first-party artifacts supply current statewide legal-aid evidence for Wisconsin.';

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
    '## Repair decision',
    '',
    '- Wisconsin remains `BLOCKED` and `index_safe=false`.',
    '- `county_local_disability_resources` now clears because the official DHS ADRC contact directory publicly preserves county or Tribal service-area fields on live first-party contact cards.',
    '- `parent_training_information_center` now clears because WI FACETS now explicitly preserves current Wisconsin PTI designation language on live first-party pages.',
    '- `legal_aid` now clears because Legal Action Wisconsin preserves current first-party free legal-help routing, statewide service categories, and a merger notice describing Wisconsin\'s largest statewide civil legal organization.',
    '- `district_or_county_education_routing` is the only remaining blocker. DPI\'s public CESA and School Directory surfaces prove a live network exists, but this pass still does not preserve a reviewable statewide county-to-region or district special-education routing contract on disk.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 372 Wisconsin Official Routing Repair v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared Wisconsin county-local disability resources, PTI, and legal aid; narrowed education to a single official crosswalk blocker',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    `- ${COUNTY_REASON}`,
    `- ${PTI_REASON}`,
    `- ${LEGAL_AID_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch372WisconsinOfficialRoutingRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: ['district_or_county_education_routing'],
    major_gap_families: [],
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
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: EDUCATION_FAILURE_CODE,
        evidence: EDUCATION_REASON,
        next_action: EDUCATION_NEXT_ACTION,
      },
    ],
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: EDUCATION_FAMILY_STATUS, status_reason: EDUCATION_REASON };
    }
    if (row.family === 'parent_training_information_center') {
      return { ...row, family_status: 'verified_state_grade', status_reason: PTI_REASON };
    }
    if (row.family === 'legal_aid') {
      return { ...row, family_status: 'verified_state_grade', status_reason: LEGAL_AID_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'verified_state_grade', status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'wisconsin',
      state_code: 'WI',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: EDUCATION_FAILURE_CODE,
      evidence: EDUCATION_REASON,
      next_action: EDUCATION_NEXT_ACTION,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: EDUCATION_FAMILY_STATUS,
        evidence_strength: 'weak',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 live official DPI CESA and School Directory surfaces plus multiple current first-party CESA sites.',
        blocker_code: EDUCATION_FAILURE_CODE,
        blocker_evidence: EDUCATION_REASON,
        samples: [
          {
            sample_name: 'DPI Cooperative Educational Service Agency page',
            source_url: 'https://dpi.wi.gov/about-dpi/cesa',
            final_url: 'https://dpi.wi.gov/about-dpi/cesa',
            verification_status: 'official_verified',
            source_type: 'official_regional_directory',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official DPI CESA page lists all 12 CESA agencies with current contacts, addresses, websites, and district counts such as CESA 1 with 45 districts and CESA 2 with 74 districts.',
          },
          {
            sample_name: 'DPI School Directory landing page',
            source_url: 'https://dpi.wi.gov/schooldirectory',
            final_url: 'https://dpi.wi.gov/schooldirectory',
            verification_status: 'official_verified',
            source_type: 'official_directory_landing_page',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'DPI publishes School Directory: Your Source for School Directory Data and links families to the School Directory Public Portal.',
          },
          {
            sample_name: 'School Directory public portal client filters',
            source_url: 'https://apps6.dpi.wi.gov/SchDirPublic/home',
            final_url: 'https://apps6.dpi.wi.gov/SchDirPublic/home',
            verification_status: 'official_verified',
            source_type: 'official_directory_public_portal',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed School Directory public portal client assets preserve county and CESA filter surfaces, but this pass still did not preserve a reviewable public statewide crosswalk export on disk.',
          },
          {
            sample_name: 'Current CESA member-district site network',
            source_url: 'https://www.cesa1.k12.wi.us/',
            final_url: 'https://www.cesa1.k12.wi.us/',
            verification_status: 'official_verified',
            source_type: 'first_party_regional_member_district_navigation',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Multiple current first-party CESA sites preserve district navigation such as Member Districts, Districts, and CESA 4 School Districts, confirming a live regional network exists without yet yielding a single reviewed statewide county or special-education routing contract.',
          },
        ],
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 live first-party WI FACETS projects, staff, and services pages.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'WI FACETS statewide PTIC project page',
            source_url: 'https://wifacets.org/projects/statewide/',
            final_url: 'https://wifacets.org/projects/statewide/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_project_page',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live statewide projects page says Parent Training and Information Center (PTIC) and states that WI FACETS has been funded by the U.S. Department of Education since 2001.',
          },
          {
            sample_name: 'WI FACETS associate director bio',
            source_url: 'https://wifacets.org/about/staff/',
            final_url: 'https://wifacets.org/about/staff/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_staff_bio',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The current staff page says Nelsinia Ramos is Co-Director of the Wisconsin Parent Training and Information Center, which the U.S. Department of Education funds.',
          },
          {
            sample_name: 'WI FACETS executive director bio',
            source_url: 'https://wifacets.org/about/staff/',
            final_url: 'https://wifacets.org/about/staff/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_staff_bio',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same page says Courtney Salzer serves as Co-Director of the OSEP-funded Wisconsin Parent Training and Information Center (PTI).',
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
        query_basis: 'Reviewed 2026-06-25 live first-party Legal Action Wisconsin homepage and about page.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Legal Action Wisconsin free legal help homepage route',
            source_url: 'https://legalaction.org/',
            final_url: 'https://legalaction.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_homepage',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The homepage preserves an Apply for FREE legal help route and statewide service categories including housing, employment, debt and taxes, public benefits, family law, and victim support.',
          },
          {
            sample_name: 'Legal Action Wisconsin merger notice',
            source_url: 'https://legalaction.org/',
            final_url: 'https://legalaction.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_news_teaser',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The homepage preserves a current item titled Legal Action of Wisconsin and Judicare Legal Aid Merge, Creating Wisconsin’s Largest Statewide Civil Legal organization.',
          },
          {
            sample_name: 'Legal Action Wisconsin LSC support statement',
            source_url: 'https://legalaction.org/about/',
            final_url: 'https://legalaction.org/about/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_about_page',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The about page states that the website was made possible by generous support of the Legal Services Corporation.',
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
        query_basis: 'Reviewed 2026-06-25 live official Wisconsin DHS ADRC contact directory on dhs.wisconsin.gov.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Wisconsin DHS ADRC contact directory',
            source_url: 'https://www.dhs.wisconsin.gov/adrc/contacts.htm',
            final_url: 'https://www.dhs.wisconsin.gov/adrc/contacts.htm',
            verification_status: 'official_verified',
            source_type: 'official_county_local_directory',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official page tells families to call or visit your local ADRC in person and preserves contact cards with explicit Service area fields.',
          },
          {
            sample_name: 'ADRC of Adams County service area',
            source_url: 'https://www.dhs.wisconsin.gov/adrc/contacts.htm',
            final_url: 'https://www.dhs.wisconsin.gov/adrc/contacts.htm',
            verification_status: 'official_verified',
            source_type: 'official_county_service_area_card',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The page preserves ADRC of Adams County with Service area Adams County.',
          },
          {
            sample_name: 'ADRC of Clark County service area',
            source_url: 'https://www.dhs.wisconsin.gov/adrc/contacts.htm',
            final_url: 'https://www.dhs.wisconsin.gov/adrc/contacts.htm',
            verification_status: 'official_verified',
            source_type: 'official_county_service_area_card',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same directory preserves ADRC of Clark County with Service area Clark County.',
          },
          {
            sample_name: 'Tribal ADRS service-area option',
            source_url: 'https://www.dhs.wisconsin.gov/adrc/contacts.htm',
            final_url: 'https://www.dhs.wisconsin.gov/adrc/contacts.htm',
            verification_status: 'official_verified',
            source_type: 'official_tribal_service_area_option',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live directory explains that Tribal members may work with a local ADRC or a Tribal ADRS and preserves contact information under each Tribal nation.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = [
    {
      state: 'wisconsin',
      state_code: 'WI',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: EDUCATION_FAILURE_CODE,
      next_action: EDUCATION_NEXT_ACTION,
      evidence: EDUCATION_REASON,
    },
  ];

  const batchSummary = {
    state: 'wisconsin',
    state_code: 'WI',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    repaired_families: [
      'county_local_disability_resources',
      'parent_training_information_center',
      'legal_aid',
    ],
    remaining_blocker_family: 'district_or_county_education_routing',
    remaining_blocker_code: EDUCATION_FAILURE_CODE,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(OUTPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(OUTPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch372WisconsinOfficialRoutingRepairV1();
  console.log(JSON.stringify(result, null, 2));
}
