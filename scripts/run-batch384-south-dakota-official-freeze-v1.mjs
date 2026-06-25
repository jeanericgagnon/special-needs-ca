import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'south-dakota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'south-dakota_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'south-dakota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'south-dakota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'south-dakota_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch384_south_dakota_official_freeze_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch384-south-dakota-official-freeze-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'south-dakota-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'official_doe_special_education_directory_and_first_party_legal_aid_are_verified_but_no_public_dhs_county_or_region_disability_office_contract_exists';

const EDUCATION_REASON =
  'Reviewed 2026-06-25 the live official South Dakota Educational Directory root and district result pages on the DOE host. The public directory root lists Public School Districts including Aberdeen 06-1, Bennett County 03-1, and Sioux Falls 49-5. The official district result pages preserve district website links, mailing and physical addresses, and named `Special Education Director` contacts, including Nicole Olson for Aberdeen, Stacy Allen for Bennett County, and Denise Kennedy for Sioux Falls. This replaces South Dakota’s old generic `doe.sd.gov/` fallback with reviewed official district-routing pages on the DOE host.';

const LEGAL_AID_REASON =
  'Reviewed 2026-06-25 the live first-party Dakota Plains Legal Services homepage. That page says Dakota Plains Legal Services is a non-profit legal services organization that provides free legal assistance to low-income individuals, older Americans, and veterans, and further says DPLS has eight offices and serves communities across South Dakota and North Dakota, including nine tribal nations. The same page preserves direct application and office-contact routing. This repairs South Dakota’s missing statewide legal-aid family with current first-party legal-aid evidence.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 another bounded official South Dakota DHS pass. The old `https://dhhs.south-dakota.gov/locations` host is unresolvable. The successor `https://dhs.sd.gov/en/localoffices` route resolves to a South Dakota DHS app state titled `Page Not Found` saying `We have updated our website and this page does not exist.` The public `https://dhs.sd.gov/en/contact-us` page exposes only statewide phone, email, and mail channels, and the public `https://dhs.sd.gov/en/staff-directory` page exposes division staff tables including DD intake leadership, but neither page publishes county-by-county, city-by-city, or regional service-area contracts for local disability office routing. South Dakota therefore still lacks a reviewable public official county-to-office or region-to-county disability routing contract.';

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
    '# South Dakota California-Grade Packet v4',
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
    '- South Dakota remains `BLOCKED` and `index_safe=false`.',
    '- `district_or_county_education_routing` now clears because the official DOE directory exposes district-specific pages with named special-education directors, addresses, and district website links.',
    '- `legal_aid` now clears because the first-party Dakota Plains Legal Services site explicitly preserves free legal-aid scope plus statewide office routing.',
    '- `county_local_disability_resources` remains the only blocker because the reviewed official DHS successor lanes still do not publish a county-to-office or region-to-county local disability routing contract.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 384 South Dakota Official Freeze v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared South Dakota education routing and legal aid with current official evidence; retained one sharply documented county-local disability blocker',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    `- ${LEGAL_AID_REASON}`,
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch384SouthDakotaOfficialFreezeV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    batch: 'batch384_south_dakota_official_freeze_v1',
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_new_official_dhs_local_office_contract',
    critical_gap_families: ['county_local_disability_resources'],
    major_gap_families: [],
    complete_ready: false,
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
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'official_dhs_successor_lanes_lack_public_county_or_region_disability_office_contract',
        evidence: COUNTY_REASON,
        next_action: 'hold_blocked_until_south_dakota_publishes_public_county_or_region_disability_office_contract',
      },
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
        family_status: 'blocked_no_public_county_or_region_disability_office_contract',
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'south-dakota',
      state_code: 'SD',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'official_dhs_successor_lanes_lack_public_county_or_region_disability_office_contract',
      evidence: COUNTY_REASON,
      next_action: 'hold_blocked_until_south_dakota_publishes_public_county_or_region_disability_office_contract',
    },
  ];

  const updatedNextRows = [
    {
      state: 'south-dakota',
      state_code: 'SD',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'official_dhs_successor_lanes_lack_public_county_or_region_disability_office_contract',
      next_action: 'hold_blocked_until_south_dakota_publishes_public_county_or_region_disability_office_contract',
      evidence: 'Legacy locations host is unresolvable; localoffices resolves to Page Not Found; contact-us and staff-directory expose statewide channels but no county or regional office contract.',
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 live official South Dakota DOE directory root and district result pages for district-routing evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'DOE educational directory root',
            source_url: 'https://doe.sd.gov/ofm/edudir.aspx',
            final_url: 'https://doe.sd.gov/ofm/edudir.aspx',
            verification_status: 'official_verified',
            source_type: 'official_district_directory_page',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official DOE directory root lists Public School Districts including Aberdeen 06-1, Bennett County 03-1, and Sioux Falls 49-5.',
          },
          {
            sample_name: 'Aberdeen district result page',
            source_url: 'https://doe.sd.gov/ofm/results.aspx?districtnumber=06001',
            final_url: 'https://doe.sd.gov/ofm/results.aspx?districtnumber=06001',
            verification_status: 'official_verified',
            source_type: 'official_district_contact_page',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Aberdeen 06-1 result page links the district website and lists Special Education Director Nicole Olson with phone and email.',
          },
          {
            sample_name: 'Bennett County district result page',
            source_url: 'https://doe.sd.gov/ofm/results.aspx?districtnumber=03001',
            final_url: 'https://doe.sd.gov/ofm/results.aspx?districtnumber=03001',
            verification_status: 'official_verified',
            source_type: 'official_district_contact_page',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Bennett County 03-1 result page links the district website and lists Special Education Director Stacy Allen with phone and email.',
          },
          {
            sample_name: 'Sioux Falls district result page',
            source_url: 'https://doe.sd.gov/ofm/results.aspx?districtnumber=49005',
            final_url: 'https://doe.sd.gov/ofm/results.aspx?districtnumber=49005',
            verification_status: 'official_verified',
            source_type: 'official_district_contact_page',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Sioux Falls 49-5 result page links the district website and lists Special Education Director Denise Kennedy with phone and email.',
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
        query_basis: 'Reviewed 2026-06-25 live first-party Dakota Plains Legal Services homepage for statewide legal-aid routing evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Dakota Plains Legal Services homepage',
            source_url: 'https://www.dpls.org/',
            final_url: 'https://www.dpls.org/',
            verification_status: 'official_verified',
            source_type: 'first_party_legal_aid_homepage',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Dakota Plains Legal Services says it is a non-profit legal services organization that provides free legal assistance to low-income individuals, older Americans, and veterans.',
          },
          {
            sample_name: 'DPLS statewide office scope',
            source_url: 'https://www.dpls.org/',
            final_url: 'https://www.dpls.org/',
            verification_status: 'official_verified',
            source_type: 'first_party_legal_aid_scope_page',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same first-party page says DPLS has eight offices and serves communities across South Dakota and North Dakota, including nine tribal nations.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_no_public_county_or_region_disability_office_contract',
        evidence_strength: 'weak',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 official South Dakota DHS successor lanes for county-to-office or region-to-county local disability routing evidence.',
        blocker_code: 'official_dhs_successor_lanes_lack_public_county_or_region_disability_office_contract',
        blocker_evidence: COUNTY_REASON,
        samples: [
          {
            sample_name: 'Legacy locations host failure',
            source_url: 'https://dhhs.south-dakota.gov/locations',
            final_url: 'https://dhhs.south-dakota.gov/locations',
            verification_status: 'official_unavailable',
            source_type: 'legacy_official_host_failure',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The legacy South Dakota DHHS locations host is unresolvable in the current pass.',
          },
          {
            sample_name: 'DHS local offices successor route',
            source_url: 'https://dhs.sd.gov/en/localoffices',
            final_url: 'https://dhs.sd.gov/en/localoffices',
            verification_status: 'official_verified',
            source_type: 'official_successor_route_without_contract',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The successor localoffices route resolves to a DHS app state titled `Page Not Found` that says `We have updated our website and this page does not exist.`',
          },
          {
            sample_name: 'DHS contact us page',
            source_url: 'https://dhs.sd.gov/en/contact-us',
            final_url: 'https://dhs.sd.gov/en/contact-us',
            verification_status: 'official_verified',
            source_type: 'official_statewide_contact_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public Contact Us page exposes only statewide phone, toll-free, email, and mail channels rather than county or regional office assignments.',
          },
          {
            sample_name: 'DHS staff directory',
            source_url: 'https://dhs.sd.gov/en/staff-directory',
            final_url: 'https://dhs.sd.gov/en/staff-directory',
            verification_status: 'official_verified',
            source_type: 'official_staff_directory_without_service_area_contract',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public Staff and Program Directory lists DD intake leadership and division staff roles, but it does not publish county-by-county, city-by-city, or regional service-area contracts for local disability routing.',
          },
        ],
      };
    }
    return row;
  });

  const batchSummary = {
    batch: 'batch384_south_dakota_official_freeze_v1',
    state: 'south-dakota',
    classification_before: 'BLOCKED',
    classification_after: updatedSummary.classification,
    resolved_families: ['district_or_county_education_routing', 'legal_aid'],
    remaining_blockers: ['county_local_disability_resources'],
    evidence_sources: [
      'https://doe.sd.gov/ofm/edudir.aspx',
      'https://doe.sd.gov/ofm/results.aspx?districtnumber=06001',
      'https://doe.sd.gov/ofm/results.aspx?districtnumber=03001',
      'https://doe.sd.gov/ofm/results.aspx?districtnumber=49005',
      'https://www.dpls.org/',
      'https://dhs.sd.gov/en/localoffices',
      'https://dhs.sd.gov/en/contact-us',
      'https://dhs.sd.gov/en/staff-directory',
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
  const result = generateBatch384SouthDakotaOfficialFreezeV1();
  console.log(JSON.stringify(result, null, 2));
}
