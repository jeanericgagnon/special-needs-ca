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
  verified: path.join(generatedDir, 'wyoming_verified_sources_v1.jsonl'),
};

const OUTPUTS = {
  failure: path.join(generatedDir, 'wyoming_failure_ledger_v2.jsonl'),
  next: path.join(generatedDir, 'wyoming_next_action_queue_v2.jsonl'),
  batchSummary: path.join(generatedDir, 'batch373_wyoming_official_routing_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch373-wyoming-official-routing-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'wyoming-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'official_wde_special_education_hosts_return_cloudflare_403_and_reviewed_wdh_local_surfaces_still_lack_public_county_disability_contracts';
const SPECIAL_ED_FAILURE_CODE =
  'official_wde_special_education_hosts_return_cloudflare_403_without_reviewable_state_grade_replacement';
const DISTRICT_FAILURE_CODE =
  'official_wde_hosts_return_cloudflare_403_and_local_district_special_education_leaves_remain_unreviewed';
const COUNTY_FAILURE_CODE =
  'official_wdh_local_resource_hosts_return_cloudflare_403_or_only_locator_surfaces_without_public_county_contract';
const SPECIAL_ED_FAMILY_STATUS =
  'blocked_official_wde_special_education_hosts_returning_cloudflare_403';
const DISTRICT_FAMILY_STATUS =
  'blocked_official_wde_hosts_and_unreviewed_local_district_special_education_leaves';
const COUNTY_FAMILY_STATUS =
  'blocked_official_wdh_local_resource_hosts_without_public_county_contract';
const SPECIAL_ED_NEXT_ACTION =
  'hold_blocked_until_wde_publishes_reviewable_public_special_education_artifact_or_waf_accessible_successor_host';
const DISTRICT_NEXT_ACTION =
  'hold_blocked_until_wde_or_district_hosts_publish_reviewable_county_to_district_or_special_education_leaf_crosswalk';
const COUNTY_NEXT_ACTION =
  'hold_blocked_until_wdh_publishes_reviewable_public_county_to_office_or_service_area_contract';

const SPECIAL_ED_REASON =
  'Reviewed 2026-06-25 one more bounded official statewide special-education pass. The current Wyoming Department of Education root plus both reviewed public special-education leaves on the official WDE host, including the parent-student and educator special-education paths, returned Cloudflare `Attention Required!` HTTP 403 pages in this pass. No reviewed public replacement state-grade special-education artifact on an official Wyoming education host was preserved on disk. Wyoming special-education statewide evidence therefore remains blocked rather than being upgraded from legacy assumptions.';

const DISTRICT_REASON =
  'Reviewed 2026-06-25 one more bounded official district-routing pass. Existing Wyoming district rows still only preserve generic district roots such as Albany County School District #1, Big Horn County School District #1, and Campbell County School District #1. The official WDE host that should anchor statewide district or special-education routing returned Cloudflare HTTP 403 pages for the root and reviewed special-education leaves in this pass, and no reviewed public statewide district directory, county-to-district crosswalk, or district-owned special-education leaf set was preserved on disk. Because the instructions forbid treating generic district roots as local-proof substitutes, Wyoming district or county education routing remains blocked.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 one more bounded official county-local disability pass. The prior Wyoming county-local evidence still depends on a statewide locations root rather than reviewed county-grade contracts, and the reviewed official Wyoming health and aging local-resource routes in this pass, including the public Aging and Disability Resource Center path and related WDH host family pages, returned Cloudflare `Attention Required!` HTTP 403 pages. No reviewed public county-to-office assignment table, county-service-area contract, or county-owned disability-office directory was preserved on disk. Wyoming county-local disability routing therefore remains blocked.';

const PTI_REASON =
  'Reviewed 2026-06-25 the live first-party Parents Information Center of Wyoming about page. The page states that `Wyoming has been home to the Parent Training and Information Center (PTI) since 1991` and that `PTIs are funded by the U.S. Department of Education, Office of Special Education Programs`. This now supplies direct first-party PTI designation evidence for Wyoming.';

const LEGAL_AID_REASON =
  'Reviewed 2026-06-25 live first-party Legal Aid of Wyoming plus the Wyoming Judicial Branch legal-services directory. The Legal Aid of Wyoming homepage says `We provide free civil legal help to low-income individuals in Wyoming` and identifies Legal Aid of Wyoming, Inc. as `a federally funded, non-profit law firm`, with listed locations in Cheyenne, Casper, Lander, Gillette, and Afton. The official Wyoming Judicial Branch `Find Legal Services` page then preserves a county-filtered `Legal Services Directory by County` and county listings for Legal Aid of Wyoming offices in Gillette, Lander, Cheyenne, Casper, and Cody. Together these first-party and official judicial artifacts supply current statewide legal-aid evidence for Wyoming.';

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
    '- `parent_training_information_center` now clears because Parents Information Center of Wyoming explicitly preserves PTI designation and U.S. Department of Education funding language on the live first-party about page.',
    '- `legal_aid` now clears because Legal Aid of Wyoming preserves live first-party statewide civil legal-help language and the Wyoming Judicial Branch preserves a county-filtered legal-services directory naming Legal Aid of Wyoming offices.',
    '- `special_education_idea_part_b` remains blocked because reviewed WDE special-education surfaces returned Cloudflare HTTP 403 pages and no public state-grade replacement artifact was preserved on disk.',
    '- `district_or_county_education_routing` remains blocked because existing evidence still stops at generic district roots and the reviewed official WDE routing surfaces returned Cloudflare HTTP 403 pages.',
    '- `county_local_disability_resources` remains blocked because reviewed official WDH local-resource routes returned Cloudflare HTTP 403 pages and no public county-to-office or service-area contract was preserved on disk.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 373 Wyoming Official Routing Repair v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared Wyoming PTI and legal aid; narrowed remaining blockers to WDE special education, local education routing, and county disability routing',
    '',
    '## Evidence',
    '',
    `- ${SPECIAL_ED_REASON}`,
    `- ${DISTRICT_REASON}`,
    `- ${COUNTY_REASON}`,
    `- ${PTI_REASON}`,
    `- ${LEGAL_AID_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch373WyomingOfficialRoutingRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 75,
    strong_critical_families: 9,
    weak_critical_families: 3,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    critical_gap_families: ['district_or_county_education_routing', 'county_local_disability_resources'],
    major_gap_families: ['special_education_idea_part_b'],
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
        family: 'special_education_idea_part_b',
        severity: 'major',
        failure_code: SPECIAL_ED_FAILURE_CODE,
        evidence: SPECIAL_ED_REASON,
        next_action: SPECIAL_ED_NEXT_ACTION,
      },
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: DISTRICT_FAILURE_CODE,
        evidence: DISTRICT_REASON,
        next_action: DISTRICT_NEXT_ACTION,
      },
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
    if (row.family === 'special_education_idea_part_b') {
      return { ...row, family_status: SPECIAL_ED_FAMILY_STATUS, status_reason: SPECIAL_ED_REASON };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: DISTRICT_FAMILY_STATUS, status_reason: DISTRICT_REASON };
    }
    if (row.family === 'parent_training_information_center') {
      return { ...row, family_status: 'verified_state_grade', status_reason: PTI_REASON };
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
      state: 'wyoming',
      state_code: 'WY',
      family: 'special_education_idea_part_b',
      severity: 'major',
      failure_code: SPECIAL_ED_FAILURE_CODE,
      evidence: SPECIAL_ED_REASON,
      next_action: SPECIAL_ED_NEXT_ACTION,
    },
    {
      state: 'wyoming',
      state_code: 'WY',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: DISTRICT_FAILURE_CODE,
      evidence: DISTRICT_REASON,
      next_action: DISTRICT_NEXT_ACTION,
    },
    {
      state: 'wyoming',
      state_code: 'WY',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: COUNTY_FAILURE_CODE,
      evidence: COUNTY_REASON,
      next_action: COUNTY_NEXT_ACTION,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: SPECIAL_ED_FAMILY_STATUS,
        evidence_strength: 'weak',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-25 the current official WDE host plus parent and educator special-education paths.',
        blocker_code: SPECIAL_ED_FAILURE_CODE,
        blocker_evidence: SPECIAL_ED_REASON,
        samples: [
          {
            sample_name: 'WDE special education parent path',
            source_url: 'https://edu.wyoming.gov/for-parents-students/special-programs/special-education/',
            final_url: 'https://edu.wyoming.gov/for-parents-students/special-programs/special-education/',
            verification_status: 'official_blocked',
            source_type: 'official_state_agency_page',
            source_table: 'regional_education_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed official WDE parent-facing special-education page returned a Cloudflare Attention Required HTTP 403 page in this pass.',
          },
          {
            sample_name: 'WDE special education educator path',
            source_url: 'https://edu.wyoming.gov/educators/special-programs/special-education/',
            final_url: 'https://edu.wyoming.gov/educators/special-programs/special-education/',
            verification_status: 'official_blocked',
            source_type: 'official_state_agency_page',
            source_table: 'regional_education_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed official WDE educator-facing special-education page also returned a Cloudflare Attention Required HTTP 403 page in this pass.',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: DISTRICT_FAMILY_STATUS,
        evidence_strength: 'weak',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 existing Wyoming district roots plus current WDE root and special-education host family.',
        blocker_code: DISTRICT_FAILURE_CODE,
        blocker_evidence: DISTRICT_REASON,
        samples: [
          {
            sample_name: 'Albany County School District #1 generic root',
            source_url: 'http://www.acsd1.org',
            final_url: 'http://www.acsd1.org',
            verification_status: 'official_verified',
            source_type: 'generic_district_root',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Existing evidence still preserves only a generic district root for Albany County School District #1 rather than a reviewed special-education leaf.',
          },
          {
            sample_name: 'Big Horn County School District #1 generic root',
            source_url: 'http://bighorn1.k12.wy.us',
            final_url: 'http://bighorn1.k12.wy.us',
            verification_status: 'official_verified',
            source_type: 'generic_district_root',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Existing evidence still preserves only a generic district root for Big Horn County School District #1 rather than a reviewed special-education leaf.',
          },
          {
            sample_name: 'Campbell County School District #1 generic root',
            source_url: 'https://ccsd.k12.wy.us',
            final_url: 'https://ccsd.k12.wy.us',
            verification_status: 'official_verified',
            source_type: 'generic_district_root',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Existing evidence still preserves only a generic district root for Campbell County School District #1 rather than a reviewed special-education leaf.',
          },
          {
            sample_name: 'WDE root blocked during routing pass',
            source_url: 'https://edu.wyoming.gov/',
            final_url: 'https://edu.wyoming.gov/',
            verification_status: 'official_blocked',
            source_type: 'official_state_agency_root',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official WDE root returned a Cloudflare Attention Required HTTP 403 page in this pass, and no reviewed public statewide district directory or county-to-district crosswalk was preserved on disk.',
          },
        ],
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-25 live first-party Parents Information Center of Wyoming about page and homepage.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Parents Information Center of Wyoming PTI designation',
            source_url: 'https://wpic.org/about/',
            final_url: 'https://wpic.org/about/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_about_page',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The about page states that Wyoming has been home to the Parent Training and Information Center (PTI) since 1991.',
          },
          {
            sample_name: 'Parents Information Center of Wyoming federal funding statement',
            source_url: 'https://wpic.org/about/',
            final_url: 'https://wpic.org/about/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_about_page',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same page states that PTIs are funded by the U.S. Department of Education, Office of Special Education Programs.',
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 4,
        query_basis: 'Reviewed 2026-06-25 live first-party Legal Aid of Wyoming homepage plus the official Wyoming Judicial Branch legal-services directory.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Legal Aid of Wyoming homepage mission',
            source_url: 'https://www.lawyoming.org/',
            final_url: 'https://www.lawyoming.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_homepage',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The homepage says Legal Aid of Wyoming provides free civil legal help to low-income individuals in Wyoming.',
          },
          {
            sample_name: 'Legal Aid of Wyoming funding and office locations',
            source_url: 'https://www.lawyoming.org/',
            final_url: 'https://www.lawyoming.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_homepage',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same homepage identifies Legal Aid of Wyoming, Inc. as a federally funded, non-profit law firm and lists locations in Cheyenne, Casper, Lander, Gillette, and Afton.',
          },
          {
            sample_name: 'Wyoming Judicial Branch county legal-services directory',
            source_url: 'https://www.wyocourts.gov/find-legal-services/',
            final_url: 'https://www.wyocourts.gov/find-legal-services/',
            verification_status: 'official_verified',
            source_type: 'official_judicial_directory',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official Wyoming Judicial Branch page preserves a county-filtered Legal Services Directory by County.',
          },
          {
            sample_name: 'Wyoming Judicial Branch Legal Aid office listings',
            source_url: 'https://www.wyocourts.gov/find-legal-services/',
            final_url: 'https://www.wyocourts.gov/find-legal-services/',
            verification_status: 'official_verified',
            source_type: 'official_judicial_directory_listing',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same directory lists Legal Aid of Wyoming offices in Gillette, Lander, Cheyenne, Casper, and Cody under county service listings.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: COUNTY_FAMILY_STATUS,
        evidence_strength: 'weak',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 prior statewide locations evidence plus current official WDH aging and local-resource paths.',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_REASON,
        samples: [
          {
            sample_name: 'Legacy statewide locations root',
            source_url: 'https://dhhs.wyoming.gov/locations',
            final_url: 'https://dhhs.wyoming.gov/locations',
            verification_status: 'legacy_structural_only',
            source_type: 'statewide_locations_root',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Prior Wyoming county-local evidence still depends on a statewide locations root rather than a reviewed county-to-office or service-area contract.',
          },
          {
            sample_name: 'Wyoming Aging and Disability Resource Center path blocked',
            source_url: 'https://health.wyo.gov/aging/wyoagingdisability-resource-center/',
            final_url: 'https://health.wyo.gov/aging/wyoagingdisability-resource-center/',
            verification_status: 'official_blocked',
            source_type: 'official_state_local_resource_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed official Aging and Disability Resource Center path returned a Cloudflare Attention Required HTTP 403 page in this pass.',
          },
          {
            sample_name: 'Related official WDH local-resource host family blocked',
            source_url: 'https://health.wyo.gov/behavioralhealth/dd/',
            final_url: 'https://health.wyo.gov/behavioralhealth/dd/',
            verification_status: 'official_blocked',
            source_type: 'official_state_local_resource_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Reviewed related official WDH local-resource host family pages also returned Cloudflare Attention Required HTTP 403 pages, and no public county disability-office contract was preserved on disk.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = [
    {
      state: 'wyoming',
      state_code: 'WY',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: DISTRICT_FAILURE_CODE,
      next_action: DISTRICT_NEXT_ACTION,
      evidence: DISTRICT_REASON,
    },
    {
      state: 'wyoming',
      state_code: 'WY',
      priority_rank: 2,
      family: 'special_education_idea_part_b',
      severity: 'major',
      failure_code: SPECIAL_ED_FAILURE_CODE,
      next_action: SPECIAL_ED_NEXT_ACTION,
      evidence: SPECIAL_ED_REASON,
    },
    {
      state: 'wyoming',
      state_code: 'WY',
      priority_rank: 3,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: COUNTY_FAILURE_CODE,
      next_action: COUNTY_NEXT_ACTION,
      evidence: COUNTY_REASON,
    },
  ];

  const batchSummary = {
    state: 'wyoming',
    state_code: 'WY',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    repaired_families: [
      'parent_training_information_center',
      'legal_aid',
    ],
    remaining_blocker_family: 'district_or_county_education_routing',
    remaining_blocker_code: DISTRICT_FAILURE_CODE,
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
  const result = generateBatch373WyomingOfficialRoutingRepairV1();
  console.log(JSON.stringify(result, null, 2));
}
