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
  'wde_idea_evidence_is_public_again_but_county_resource_fetches_are_forbidden_and_no_reviewable_county_to_district_special_education_crosswalk_exists';

const IDEA_REASON =
  'Reviewed 2026-06-25 one more bounded live check of the exact official Wyoming Department of Education special-education and IDEA pages. Both `https://edu.wyoming.gov/parents/special-education/` and `https://edu.wyoming.gov/parents/special-education/idea/` now return HTTP 200 again in the replayable lane, preserving current statewide Part B authority evidence on the official WDE host. The lane is still not sufficient for local county or district routing, but it does restore reviewable statewide IDEA authority evidence.';

const DISTRICT_REASON =
  'Reviewed 2026-06-25 a bounded official Wyoming district-routing recheck on the exact WDE host family. The `special-education` hub, `IDEA` page, and `School District Enrollment & Staffing Data` page all return HTTP 200 in the replayable lane, but the reviewed WDE artifacts still do not preserve a statewide county-to-district crosswalk, district directory, or district-owned special-education leaf set. Existing Wyoming district evidence still stops at generic district roots such as Albany County School District #1, Big Horn County School District #1, and Campbell County School District #1. Wyoming district or county education routing therefore remains blocked on the missing local routing contract, not on a dead WDE host.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 one more bounded official Wyoming Department of Health county-resource recheck on `https://health.wyo.gov/aging/communityliving/service-area-maps/` and `https://health.wyo.gov/aging/communityliving/public_resources/` using a browser-like replayable lane. Both exact pages return HTTP 200 again and remain publicly reviewable, but the live headings and content are still aging/community-living resources such as `Services by County`, `Public Resources`, `Supportive Services (Title IIIB)`, `Nutrition Services (Title IIIC1 and Title IIIC2)`, `National Family Caregiver Program (Title IIIE)`, and the senior-service provider map. They still do not provide a disability-specific county-to-office assignment table, county service-area contract, or county-owned developmental-disability office directory. Wyoming county-local disability routing therefore remains blocked on the missing disability-specific county contract, not on a dead host.';

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
    '- `special_education_idea_part_b` clears because the live WDE special-education and IDEA pages are publicly reviewable again and preserve current statewide Part B authority language plus the annual application artifact on the official WDE host.',
    '- `district_or_county_education_routing` remains blocked because reviewed WDE artifacts still do not provide a county-to-district crosswalk, statewide district directory, or district-owned special-education leaf set, while existing preserved district evidence still stops at generic district roots.',
    '- `county_local_disability_resources` remains blocked because the exact WDH county-resource pages are publicly reviewable again but still expose aging/community-living and senior-service resources rather than a disability-specific county office contract or county developmental-disability directory.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 380 Wyoming Accessible IDEA Freeze v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared Wyoming IDEA Part B with currently accessible WDE evidence and kept the state blocked on the two remaining local-routing blockers',
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
        sample_count: 2,
        query_basis:
          'Reviewed 2026-06-25 official WDH county service and public resource pages after confirming the exact county-resource URLs are publicly reviewable again in a browser-like replay lane.',
        blocker_code:
          'official_wdh_county_surfaces_are_aging_only_without_disability_specific_county_contract',
        blocker_evidence: COUNTY_REASON,
        samples: [
          {
            sample_name: 'WDH Services by County page remains aging/community-living only',
            source_url: 'https://health.wyo.gov/aging/communityliving/service-area-maps/',
            final_url: 'https://health.wyo.gov/aging/communityliving/service-area-maps/',
            verification_status: 'official_verified',
            source_type: 'official_county_services_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'The live official WDH `Services by County` page is publicly reviewable again and lists county headings such as Albany County, Campbell County, Converse County, Fremont County, Hot Springs County, Laramie County, and Natrona County, but the page remains under Aging / Community Living and does not expose a disability-specific county office or developmental-disability routing contract.',
          },
          {
            sample_name: 'WDH Public Resources page remains senior-service oriented',
            source_url: 'https://health.wyo.gov/aging/communityliving/public_resources/',
            final_url: 'https://health.wyo.gov/aging/communityliving/public_resources/',
            verification_status: 'official_verified',
            source_type: 'official_state_public_resources_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet:
              'The live official WDH `Public Resources` page is publicly reviewable again, but its headings remain `Supportive Services (Title IIIB)`, `Nutrition Services (Title IIIC1 and Title IIIC2)`, `National Family Caregiver Program (Title IIIE)`, and a senior-service provider map rather than a disability-specific county office contract.',
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
