import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'washington_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'washington_gap_matrix_v2.jsonl'),
  verified: path.join(generatedDir, 'washington_verified_sources_v1.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch371_washington_official_routing_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch371-washington-official-routing-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'washington-california-grade-audit-report-v2.md'),
  failure: path.join(generatedDir, 'washington_failure_ledger_v2.jsonl'),
  next: path.join(generatedDir, 'washington_next_action_queue_v2.jsonl'),
};

const PRIMARY_GAP_REASON =
  'official_dshs_local_offices_are_public_but_reviewed_pages_do_not_preserve_a_county_to_office_or_service_area_contract';
const COUNTY_FAILURE_CODE =
  'official_local_office_locator_exists_but_no_public_county_to_office_or_service_area_contract';
const COUNTY_FAMILY_STATUS =
  'blocked_official_local_office_locator_without_county_contract';
const COUNTY_NEXT_ACTION =
  'hold_blocked_until_washington_publishes_reviewable_county_to_office_or_service_area_contract';

const EDUCATION_REASON =
  'Reviewed 2026-06-25 the official OSPI `Websites and Contact Info` district directory and the OSPI `Educational Service Districts (ESD)` page. The live OSPI directory says `This page lists websites and addresses for school districts, charter schools, tribal schools, and ESDs`, exposes public `District or Entity` and `ESD` columns, and publicly maps district rows such as Aberdeen -> 113, Adna -> 113, Almira -> 101, Anacortes -> 189, Auburn -> 121, and Bellingham -> 189. The companion official ESD page publishes named ESD offices, addresses, and downloadable `School Districts and ESDs` maps. This replaces Washington\'s old statewide education fallback with a current official district-to-ESD routing surface on the OSPI host.';

const PA_REASON =
  'Reviewed 2026-06-25 the live first-party Disability Rights Washington homepage. The page heading says `Washington\'s Protection and Advocacy System`, and the body says `Disability Rights Washington is a private non-profit organization that protects the rights of people with disabilities statewide.` This now supplies direct first-party protection-and-advocacy designation evidence for Washington.';

const LEGAL_AID_REASON =
  'Reviewed 2026-06-25 the live first-party Washington Law Help homepage plus its page metadata. The page is visibly `Maintained by Northwest Justice Project`, and the reviewed page metadata and JSON-LD describe Washington Law Help as a public library of free legal information in Washington State with a Northwest Justice Project contact path. This supplies current first-party statewide legal-help evidence for Washington.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 one more bounded official county-local pass on DSHS. The official `Office Locator` page publicly supports lookup by `zip code, city, or county` and preserves county-named local office cards such as `Okanogan County Community Services Office`, `Grays Harbor County DDCS Field Office`, `Kitsap County DDCS Field Office`, `Lewis County DDCS Field Office`, and `Whitman County DDA Field Office`, plus multi-county cards such as `Tri County-Colville Community Service Office` and `Tri County DDA Field Office`. Individual DSHS office detail pages confirm official addresses and phone numbers for county-named leaves like Whitman County DDA Field Office in Colfax and Tri County DDA Field Office in Colville. The companion `ESA Find an Office` page also says the Community Services Division serves the public through a network of 52 local Community Services Offices. But the reviewed public DSHS pages still do not preserve a complete county-to-office assignment table or an explicit service-area contract, and the office locator remains a search or locator surface rather than a reviewable county routing crosswalk. Because the instructions forbid inferring local routing from nearest-office or geodistance behavior, Washington\'s county-local disability family remains blocked.';

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
    '# Washington California-Grade Audit Report v2',
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
    '- Washington remains `BLOCKED` and `index_safe=false`.',
    '- `district_or_county_education_routing` now clears because OSPI publishes a live district directory with district-to-ESD assignments plus downloadable official school-district and ESD maps.',
    '- `protection_and_advocacy` now clears because Disability Rights Washington explicitly identifies itself as Washington\'s Protection and Advocacy System on the live first-party homepage.',
    '- `legal_aid` now clears because Washington Law Help preserves a live first-party Northwest Justice Project legal-help route for Washington.',
    '- `county_local_disability_resources` is the only remaining blocker. DSHS publishes real local office leaves, but the reviewed public surfaces still do not preserve a reviewable county-to-office assignment or service-area contract, so the family cannot be cleared without forbidden locator inference.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 371 Washington Official Routing Repair v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared Washington education routing, protection and advocacy, and legal aid; narrowed county/local disability resources to a single DSHS county-contract blocker',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    `- ${PA_REASON}`,
    `- ${LEGAL_AID_REASON}`,
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch371WashingtonOfficialRoutingRepairV1() {
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
    critical_gap_families: ['county_local_disability_resources'],
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
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_REASON,
        next_action: COUNTY_NEXT_ACTION,
      },
    ],
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'verified_state_grade', status_reason: EDUCATION_REASON };
    }
    if (row.family === 'protection_and_advocacy') {
      return { ...row, family_status: 'verified_state_grade', status_reason: PA_REASON };
    }
    if (row.family === 'legal_aid') {
      return { ...row, family_status: 'verified_state_grade', status_reason: LEGAL_AID_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: COUNTY_FAMILY_STATUS, status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'washington',
      state_code: 'WA',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: COUNTY_FAILURE_CODE,
      evidence: COUNTY_REASON,
      next_action: COUNTY_NEXT_ACTION,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 live official OSPI district-directory and ESD pages on ospi.k12.wa.us.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'OSPI Websites and Contact Info directory',
            source_url: 'https://ospi.k12.wa.us/about-ospi/about-school-districts/websites-and-contact-info',
            final_url: 'https://ospi.k12.wa.us/about-ospi/about-school-districts/websites-and-contact-info',
            verification_status: 'official_verified',
            source_type: 'official_district_directory',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official page says it lists websites and addresses for school districts, charter schools, tribal schools, and ESDs.',
          },
          {
            sample_name: 'OSPI district to ESD routing table',
            source_url: 'https://ospi.k12.wa.us/about-ospi/about-school-districts/websites-and-contact-info',
            final_url: 'https://ospi.k12.wa.us/about-ospi/about-school-districts/websites-and-contact-info',
            verification_status: 'official_verified',
            source_type: 'official_district_to_region_table',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live table publicly maps district rows such as Aberdeen to ESD 113, Almira to ESD 101, Anacortes to ESD 189, and Auburn to ESD 121.',
          },
          {
            sample_name: 'OSPI Educational Service Districts page',
            source_url: 'https://ospi.k12.wa.us/about-ospi/about-school-districts/educational-service-districts-esd',
            final_url: 'https://ospi.k12.wa.us/about-ospi/about-school-districts/educational-service-districts-esd',
            verification_status: 'official_verified',
            source_type: 'official_regional_education_directory',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official ESD page lists named ESD offices and addresses including ESD 101 in Spokane, ESD 105 in Yakima, ESD 112 in Vancouver, and ESD 113 in Tumwater.',
          },
          {
            sample_name: 'OSPI downloadable district and ESD maps',
            source_url: 'https://ospi.k12.wa.us/about-ospi/about-school-districts/educational-service-districts-esd',
            final_url: 'https://ospi.k12.wa.us/about-ospi/about-school-districts/educational-service-districts-esd',
            verification_status: 'official_verified',
            source_type: 'official_regional_map_index',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same page publishes downloadable School Districts and ESDs maps plus an Educational Service Districts map on the official OSPI host.',
          },
        ],
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-25 live first-party Disability Rights Washington homepage on disabilityrightswa.org.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Washington designation heading',
            source_url: 'https://disabilityrightswa.org/',
            final_url: 'https://disabilityrightswa.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_designation_statement',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The homepage heading says Washington\'s Protection and Advocacy System.',
          },
          {
            sample_name: 'Disability Rights Washington statewide scope',
            source_url: 'https://disabilityrightswa.org/',
            final_url: 'https://disabilityrightswa.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_scope_statement',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The page says Disability Rights Washington is a private non-profit organization that protects the rights of people with disabilities statewide.',
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
        query_basis: 'Reviewed 2026-06-25 live first-party Washington Law Help homepage plus page metadata on washingtonlawhelp.org.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Washington Law Help homepage',
            source_url: 'https://www.washingtonlawhelp.org/',
            final_url: 'https://www.washingtonlawhelp.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_homepage',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The homepage is visibly maintained by Northwest Justice Project.',
          },
          {
            sample_name: 'Washington Law Help metadata scope',
            source_url: 'https://www.washingtonlawhelp.org/',
            final_url: 'https://www.washingtonlawhelp.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_metadata',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed page metadata describes Washington Law Help as a public library of free legal information in Washington State.',
          },
          {
            sample_name: 'Washington Law Help Northwest Justice Project contact path',
            source_url: 'https://www.washingtonlawhelp.org/',
            final_url: 'https://www.washingtonlawhelp.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_jsonld',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed page JSON-LD preserves Northwest Justice Project as the parent organization and a Washington Law Help legal-service contact path.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: COUNTY_FAMILY_STATUS,
        evidence_strength: 'weak',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 official DSHS office-locator, office-detail, and ESA office-network pages on dshs.wa.gov.',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_REASON,
        samples: [
          {
            sample_name: 'DSHS Office Locator search scope',
            source_url: 'https://www.dshs.wa.gov/office-locations',
            final_url: 'https://www.dshs.wa.gov/office-locations',
            verification_status: 'official_verified',
            source_type: 'official_office_locator',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official Office Locator publicly supports lookup by zip code, city, or county.',
          },
          {
            sample_name: 'DSHS county named office cards',
            source_url: 'https://www.dshs.wa.gov/office-locations',
            final_url: 'https://www.dshs.wa.gov/office-locations',
            verification_status: 'official_verified',
            source_type: 'official_office_locator_cards',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live locator preserves county-named cards such as Okanogan County Community Services Office, Grays Harbor County DDCS Field Office, Kitsap County DDCS Field Office, Lewis County DDCS Field Office, and Whitman County DDA Field Office.',
          },
          {
            sample_name: 'DSHS county and multi county office detail leaves',
            source_url: 'https://www.dshs.wa.gov/location/dshs-dda-colfax-fo',
            final_url: 'https://www.dshs.wa.gov/location/dshs-dda-colfax-fo',
            verification_status: 'official_verified',
            source_type: 'official_office_detail_leaf',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Individual DSHS leaves confirm official addresses and phones for Whitman County DDA Field Office in Colfax and Tri County DDA Field Office in Colville, but do not preserve a complete county assignment contract.',
          },
          {
            sample_name: 'DSHS ESA office network statement',
            source_url: 'https://www.dshs.wa.gov/esa/esa-find-office',
            final_url: 'https://www.dshs.wa.gov/esa/esa-find-office',
            verification_status: 'official_verified',
            source_type: 'official_office_network_overview',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'ESA Find an Office says the Community Services Division serves the public through a network of 52 local Community Services Offices, but it still does not publish a full county to office or service area crosswalk.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = [
    {
      state: 'washington',
      state_code: 'WA',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: COUNTY_FAILURE_CODE,
      next_action: COUNTY_NEXT_ACTION,
      evidence: COUNTY_REASON,
    },
  ];

  const batchSummary = {
    state: 'washington',
    state_code: 'WA',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    repaired_families: [
      'district_or_county_education_routing',
      'protection_and_advocacy',
      'legal_aid',
    ],
    remaining_blocker_family: 'county_local_disability_resources',
    remaining_blocker_code: COUNTY_FAILURE_CODE,
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
  const result = generateBatch371WashingtonOfficialRoutingRepairV1();
  console.log(JSON.stringify(result, null, 2));
}
