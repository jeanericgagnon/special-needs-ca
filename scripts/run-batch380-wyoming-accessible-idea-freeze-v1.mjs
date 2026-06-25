import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'wyoming_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'wyoming_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'wyoming_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'wyoming_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'wyoming_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch380_wyoming_accessible_idea_freeze_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch380-wyoming-accessible-idea-freeze-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'wyoming-california-grade-audit-report-v2.md'),
};

const BATCH_NAME = 'batch380_wyoming_accessible_idea_freeze_v1';
const PRIMARY_GAP_REASON =
  'wde_idea_evidence_is_now_public_but_no_reviewable_county_to_district_special_education_crosswalk_or_disability_specific_county_resource_contract';

const IDEA_REASON =
  'Reviewed 2026-06-25 the live official Wyoming Department of Education special-education hub and IDEA page after rechecking the current host family. The WDE special-education hub is publicly reviewable again, the IDEA page says Wyoming must submit an annual application to the U.S. Department of Education Office of Special Education Programs to receive federal funds for services to children with disabilities ages 3 through 21, and the page links the current `Annual State Application` PDF plus the `Purposed Use of Funds` spreadsheet artifact. This restores current official statewide IDEA Part B authority evidence on the WDE host.';

const DISTRICT_REASON =
  'Reviewed 2026-06-25 a bounded official Wyoming district-routing pass after WDE became publicly reviewable again. The WDE IDEA and parent special-education pages are now accessible, and the official `School District Enrollment & Staffing Data` page is also publicly reviewable, but the reviewed WDE artifacts still do not preserve a statewide county-to-district crosswalk, district directory, or district-owned special-education leaf set. Existing Wyoming district rows still stop at generic district roots such as Albany County School District #1, Big Horn County School District #1, and Campbell County School District #1. Because the instructions forbid treating generic district roots or non-routing staffing publications as local-proof substitutes, district or county education routing remains blocked.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 a bounded official Wyoming Department of Health county-resource pass. The official WDH `Services by County` page under Aging Community Living is publicly reviewable again and explicitly says each county in Wyoming offers different programs for older adults, with county toggles listing senior-center, meal, caregiver, and Wyoming Home Services providers. The official WDH `Public Resources` page is also reviewable, but it routes to statewide community-living program pages and a map of older-adult resources rather than a disability-specific county-to-office assignment table, county service-area contract, or county-owned developmental-disability office directory. Wyoming county-local disability routing therefore remains blocked on the narrower ground that reviewed public WDH county evidence is aging/community-living only.';

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
    '# Wyoming California-Grade Audit Report v2',
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
    '- Wyoming remains `BLOCKED` and `index_safe=false`.',
    '- `special_education_idea_part_b` now clears because the live WDE special-education and IDEA pages again expose reviewable statewide Part B authority language plus the current annual application PDF on the official WDE host.',
    '- `district_or_county_education_routing` remains blocked because reviewed WDE artifacts still do not provide a county-to-district crosswalk, statewide district directory, or district-owned special-education leaf set, while existing preserved district evidence still stops at generic district roots.',
    '- `county_local_disability_resources` remains blocked because WDH now exposes public county-by-county aging and community-living resources, but the reviewed county evidence is still older-adult and caregiver oriented rather than a disability-specific county office contract or county developmental-disability directory.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 380 Wyoming Accessible IDEA Freeze v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared Wyoming IDEA Part B with newly accessible WDE evidence and froze the state on the two remaining local-routing blockers',
    '',
    '## Evidence',
    '',
    `- ${IDEA_REASON}`,
    `- ${DISTRICT_REASON}`,
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch380WyomingAccessibleIdeaFreezeV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: [
      'district_or_county_education_routing',
      'county_local_disability_resources',
    ],
    major_gap_families: [],
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code:
          'official_wde_is_public_but_no_reviewable_county_to_district_or_special_education_crosswalk',
        evidence: DISTRICT_REASON,
        next_action:
          'hold_blocked_until_wde_or_district_hosts_publish_reviewable_county_to_district_or_special_education_leaf_crosswalk',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code:
          'official_wdh_county_surfaces_are_aging_only_without_disability_specific_county_contract',
        evidence: COUNTY_REASON,
        next_action:
          'hold_blocked_until_wdh_publishes_reviewable_public_disability_specific_county_to_office_or_service_area_contract',
      },
    ],
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: IDEA_REASON,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status:
          'blocked_official_wde_public_but_without_reviewable_county_to_district_special_education_crosswalk',
        status_reason: DISTRICT_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status:
          'blocked_official_wdh_county_surfaces_are_aging_only_without_disability_specific_contract',
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'wyoming',
      state_code: 'WY',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code:
        'official_wde_is_public_but_no_reviewable_county_to_district_or_special_education_crosswalk',
      evidence: DISTRICT_REASON,
      next_action:
        'hold_blocked_until_wde_or_district_hosts_publish_reviewable_county_to_district_or_special_education_leaf_crosswalk',
    },
    {
      state: 'wyoming',
      state_code: 'WY',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code:
        'official_wdh_county_surfaces_are_aging_only_without_disability_specific_county_contract',
      evidence: COUNTY_REASON,
      next_action:
        'hold_blocked_until_wdh_publishes_reviewable_public_disability_specific_county_to_office_or_service_area_contract',
    },
  ];

  const updatedNextRows = [
    {
      state: 'wyoming',
      state_code: 'WY',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code:
        'official_wde_is_public_but_no_reviewable_county_to_district_or_special_education_crosswalk',
      next_action:
        'hold_blocked_until_wde_or_district_hosts_publish_reviewable_county_to_district_or_special_education_leaf_crosswalk',
      evidence: DISTRICT_REASON,
    },
    {
      state: 'wyoming',
      state_code: 'WY',
      priority_rank: 2,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code:
        'official_wdh_county_surfaces_are_aging_only_without_disability_specific_county_contract',
      next_action:
        'hold_blocked_until_wdh_publishes_reviewable_public_disability_specific_county_to_office_or_service_area_contract',
      evidence: COUNTY_REASON,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis:
          'Reviewed 2026-06-25 live official Wyoming Department of Education special-education and IDEA pages after confirming the host family is publicly reviewable again.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'WDE special education hub',
            source_url: 'https://edu.wyoming.gov/parents/special-education/',
            final_url: 'https://edu.wyoming.gov/parents/special-education/',
            verification_status: 'official_verified',
            source_type: 'official_state_special_education_hub',
            source_table: 'regional_education_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'The live official WDE special education hub is publicly reviewable again and preserves parent-facing statewide special-education navigation on the WDE host.',
          },
          {
            sample_name: 'WDE IDEA page',
            source_url: 'https://edu.wyoming.gov/parents/special-education/idea/',
            final_url: 'https://edu.wyoming.gov/parents/special-education/idea/',
            verification_status: 'official_verified',
            source_type: 'official_state_idea_page',
            source_table: 'regional_education_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'The official IDEA page says Wyoming must submit an annual application to the U.S. Department of Education Office of Special Education Programs to receive federal funds for services to children with disabilities ages 3 through 21 across the state.',
          },
          {
            sample_name: 'WDE IDEA annual application PDF',
            source_url: 'https://edu.wyoming.gov/wp-content/uploads/2026/03/IDEA-PartB-Application.pdf',
            final_url: 'https://edu.wyoming.gov/wp-content/uploads/2026/03/IDEA-PartB-Application.pdf',
            verification_status: 'official_verified',
            source_type: 'official_state_idea_application_pdf',
            source_table: 'regional_education_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'The reviewed IDEA page links the current Annual State Application PDF on the official WDE host, preserving a current statewide Part B artifact.',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status:
          'blocked_official_wde_public_but_without_reviewable_county_to_district_special_education_crosswalk',
        evidence_strength: 'weak',
        sample_count: 5,
        query_basis:
          'Reviewed 2026-06-25 official WDE routing and data pages plus existing preserved district roots after the WDE host became accessible again.',
        blocker_code:
          'official_wde_is_public_but_no_reviewable_county_to_district_or_special_education_crosswalk',
        blocker_evidence: DISTRICT_REASON,
        samples: [
          {
            sample_name: 'WDE root public again',
            source_url: 'https://edu.wyoming.gov/',
            final_url: 'https://edu.wyoming.gov/',
            verification_status: 'official_verified',
            source_type: 'official_state_agency_root',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'The official WDE root is publicly reviewable again, so Wyoming no longer depends on a host-access blocker for district-routing review.',
          },
          {
            sample_name: 'WDE school district enrollment and staffing data page',
            source_url: 'https://edu.wyoming.gov/data/school-district-enrollment-and-staffing-data/',
            final_url: 'https://edu.wyoming.gov/data/school-district-enrollment-and-staffing-data/',
            verification_status: 'official_verified',
            source_type: 'official_state_district_data_page',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'The official WDE page is publicly reviewable but describes a staffing and enrollment publication rather than a county-to-district crosswalk or special-education routing directory.',
          },
          {
            sample_name: 'Albany County School District #1 generic root',
            source_url: 'http://www.acsd1.org',
            final_url: 'http://www.acsd1.org',
            verification_status: 'official_verified',
            source_type: 'generic_district_root',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'Existing evidence still preserves only a generic district root for Albany County School District #1 rather than a reviewed special-education leaf.',
          },
          {
            sample_name: 'Big Horn County School District #1 generic root',
            source_url: 'http://bighorn1.k12.wy.us',
            final_url: 'http://bighorn1.k12.wy.us',
            verification_status: 'official_verified',
            source_type: 'generic_district_root',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'Existing evidence still preserves only a generic district root for Big Horn County School District #1 rather than a reviewed special-education leaf.',
          },
          {
            sample_name: 'Campbell County School District #1 generic root',
            source_url: 'https://ccsd.k12.wy.us',
            final_url: 'https://ccsd.k12.wy.us',
            verification_status: 'official_verified',
            source_type: 'generic_district_root',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'Existing evidence still preserves only a generic district root for Campbell County School District #1 rather than a reviewed special-education leaf.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status:
          'blocked_official_wdh_county_surfaces_are_aging_only_without_disability_specific_contract',
        evidence_strength: 'weak',
        sample_count: 3,
        query_basis:
          'Reviewed 2026-06-25 official WDH county service and public resource pages after finding current public successors to the prior blocked ADRC path.',
        blocker_code:
          'official_wdh_county_surfaces_are_aging_only_without_disability_specific_county_contract',
        blocker_evidence: COUNTY_REASON,
        samples: [
          {
            sample_name: 'WDH Services by County page',
            source_url: 'https://health.wyo.gov/aging/communityliving/service-area-maps/',
            final_url: 'https://health.wyo.gov/aging/communityliving/service-area-maps/',
            verification_status: 'official_verified',
            source_type: 'official_county_services_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'The official WDH page is titled `Services by County` and says each county offers different programs for older adults, with county toggles listing senior-center and Wyoming Home Services providers.',
          },
          {
            sample_name: 'WDH Public Resources page',
            source_url: 'https://health.wyo.gov/aging/communityliving/public_resources/',
            final_url: 'https://health.wyo.gov/aging/communityliving/public_resources/',
            verification_status: 'official_verified',
            source_type: 'official_state_public_resources_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'The official WDH Public Resources page routes to statewide community-living programs such as Supportive Services, Wyoming Home Services, and the National Family Caregiver Program, not a disability-specific county office contract.',
          },
          {
            sample_name: 'Legacy ADRC path no longer reviewable',
            source_url: 'https://health.wyo.gov/aging/wyoagingdisability-resource-center/',
            final_url: 'https://health.wyo.gov/aging/wyoagingdisability-resource-center/',
            verification_status: 'official_blocked',
            source_type: 'legacy_state_local_resource_path',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'The earlier Aging and Disability Resource Center path no longer supplies a usable public county-to-office contract, so the surviving public county evidence remains aging/community-living only.',
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
    state: 'wyoming',
    state_code: 'WY',
    classification: 'BLOCKED',
    index_safe: false,
    cleared_families: ['special_education_idea_part_b'],
    remaining_blocker_family: 'district_or_county_education_routing',
    remaining_blocker_code:
      'official_wde_is_public_but_no_reviewable_county_to_district_or_special_education_crosswalk',
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());

  return {
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    cleared_families: ['special_education_idea_part_b'],
  };
}

generateBatch380WyomingAccessibleIdeaFreezeV1();
