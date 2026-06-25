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
  batchSummary: path.join(generatedDir, 'batch385_wyoming_official_routing_completion_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch385-wyoming-official-routing-completion-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'wyoming-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence';

const PART_B_REASON =
  'Reviewed 2026-06-25 the current official Wyoming Department of Education special-education pages on `edu.wyoming.gov`. The live Special Education page says special education programs provide students with disabilities the support they need to learn and thrive in school and beyond, and the current IDEA page preserves the state’s IDEA application and federal-funds administration lane on the same official host. This replaces Wyoming’s old legacy special-education evidence with current reviewed official Part B authority on the successor WDE host.';

const EDUCATION_REASON =
  'Reviewed 2026-06-25 official Wyoming district-owned special-education routing surfaces. Albany County School District #1 publicly preserves a district `Special Services` page describing specialized instruction and support for students with disabilities plus named office contacts including Interim Chief Student Advocacy Officer Shelley Hamel and phone 307-721-4460. Campbell County School District #1 publicly preserves a district `Special Programs` page stating the district has nearly 400 staff dedicated to students with IEPs and listing the special-services office at 525 W. Lakeway Road, Suite 106, Gillette, WY 82718, phone 307-686-1912. Big Horn County School District #1’s official sitemap also publishes a district-owned `page/special-services/` leaf on the live district host. This replaces Wyoming’s old generic district-root fallback with reviewed district-owned special-education routing evidence.';

const PTI_REASON =
  'Reviewed 2026-06-25 the current official Wyoming Department of Education Parent Resources page on `edu.wyoming.gov`. That official page includes a heading `Wyoming Parent Advocacy Organizations Parent Information Center/Parent Education Network` and directly routes families to `www.wpic.org` with the organization’s address and phone information. This replaces Wyoming’s old support-only PTI artifact with current reviewed official designation-style routing on the state education host.';

const LEGAL_AID_REASON =
  'Reviewed 2026-06-25 the official Legal Services Corporation grantee directory and Wyoming program profile. The LSC grantee page publicly lists `Legal Aid of Wyoming, Inc.` under Wyoming, and the live LSC program-profile page preserves the authoritative Legal Aid of Wyoming program record on the same official host. This repairs Wyoming’s previously missing legal-aid family with current authoritative statewide legal-aid evidence.';

const COUNTY_REASON =
  'Reviewed 2026-06-25 the current official Wyoming Department of Health HCBS contacts and local-routing pages on `health.wyo.gov`. The HCBS contacts page explicitly says `Click below for HCBS Specialists by County` and links the public `BES-Caseloads-Effective-10.2025.pdf` file on the same official host. The HCBS landing page tells families applying for developmental-disability waivers to `Contact your area Benefits and Eligibility Specialist`, while the current Early Intervention `Find A Center` page also routes families to the child development center nearest them through Region 1 through Region 14 contact listings. Together these reviewed official county and regional routing surfaces replace Wyoming’s stale generic locations fallback with current public local disability routing evidence.';

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
    '## Completion decision',
    '',
    '- Wyoming is now `COMPLETE` and `index_safe=true`.',
    '- `special_education_idea_part_b` now clears because the successor WDE Special Education and IDEA pages preserve current statewide Part B authority on `edu.wyoming.gov`.',
    '- `district_or_county_education_routing` now clears because reviewed district-owned special-services leaves on Albany and Campbell, plus the district-owned Big Horn special-services leaf published in the official sitemap, provide current local routing evidence.',
    '- `parent_training_information_center` now clears because the WDE Parent Resources page explicitly routes families through `Parent Information Center/Parent Education Network` on the state education host.',
    '- `legal_aid` now clears because the official LSC grantee directory and program profile preserve the authoritative Legal Aid of Wyoming statewide record.',
    '- `county_local_disability_resources` now clears because the official HCBS contacts page publishes `HCBS Specialists by County` and links the public county caseload PDF on the current health host.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 385 Wyoming Official Routing Completion v1',
    '',
    '- classification: COMPLETE',
    '- index_safe: true',
    '- change: cleared Wyoming’s remaining Part B, district-routing, PTI, legal-aid, and county-local disability blockers with current official evidence',
    '',
    '## Evidence',
    '',
    `- ${PART_B_REASON}`,
    `- ${EDUCATION_REASON}`,
    `- ${PTI_REASON}`,
    `- ${LEGAL_AID_REASON}`,
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch385WyomingOfficialRoutingCompletionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);

  const updatedSummary = {
    ...summary,
    batch: 'batch385_wyoming_official_routing_completion_v1',
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
    complete_ready: true,
    final_blockers: null,
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: PART_B_REASON,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: PTI_REASON,
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
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 the current official Wyoming Department of Education Special Education and IDEA pages on edu.wyoming.gov.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Wyoming Department of Education Special Education page',
            source_url: 'https://edu.wyoming.gov/parents/special-education/',
            final_url: 'https://edu.wyoming.gov/parents/special-education/',
            verification_status: 'official_verified',
            source_type: 'official_special_education_page',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live Special Education page says special education programs provide students with disabilities the support they need to learn and thrive in school and beyond.',
          },
          {
            sample_name: 'Wyoming IDEA page',
            source_url: 'https://edu.wyoming.gov/parents/special-education/idea/',
            final_url: 'https://edu.wyoming.gov/parents/special-education/idea/',
            verification_status: 'official_verified',
            source_type: 'official_idea_part_b_page',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The current IDEA page preserves Wyoming’s IDEA application and federal-funds administration lane on the same official WDE host.',
          },
          {
            sample_name: 'WDE Special Education parent-resource tiles',
            source_url: 'https://edu.wyoming.gov/parents/special-education/',
            final_url: 'https://edu.wyoming.gov/parents/special-education/',
            verification_status: 'official_verified',
            source_type: 'official_special_education_navigation',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same reviewed page routes families to IDEA, Dispute Resolution, Parent Resources, ASCEND 307, and additional statewide special-education lanes.',
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
        query_basis: 'Reviewed 2026-06-25 official Wyoming district-owned special-services and special-programs routing pages plus district sitemap evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Albany County School District #1 Special Services page',
            source_url: 'https://www.acsd1.org/page/special-services/',
            final_url: 'https://www.acsd1.org/page/special-services/',
            verification_status: 'official_verified',
            source_type: 'district_owned_special_education_page',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The district-owned Special Services page says the department provides specialized instruction and support to students with disabilities and lists Interim Chief Student Advocacy Officer Shelley Hamel with phone 307-721-4460.',
          },
          {
            sample_name: 'Albany County district special-services scope',
            source_url: 'https://www.acsd1.org/page/special-services/',
            final_url: 'https://www.acsd1.org/page/special-services/',
            verification_status: 'official_verified',
            source_type: 'district_owned_special_education_page',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same page says Albany County School District #1 Special Services provides support while adhering to state regulations and guidelines for special education.',
          },
          {
            sample_name: 'Campbell County School District #1 Special Programs page',
            source_url: 'https://sites.google.com/ccsd1schools.net/special-services/home',
            final_url: 'https://sites.google.com/ccsd1schools.net/special-services/home',
            verification_status: 'official_verified',
            source_type: 'district_owned_special_education_page',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The district Special Programs page says Campbell County School District has nearly 400 staff members dedicated to serving students with IEPs and lists the office at 525 W. Lakeway Road, Suite 106, Gillette, WY 82718, phone 307-686-1912.',
          },
          {
            sample_name: 'Big Horn County School District #1 special-services sitemap leaf',
            source_url: 'https://www.bighorn1.com/sitemap.xml',
            final_url: 'https://www.bighorn1.com/sitemap.xml',
            verification_status: 'official_verified',
            source_type: 'district_owned_sitemap',
            source_table: 'school_districts',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official district sitemap publishes a live district-owned `https://www.bighorn1.com/page/special-services/` special-services leaf on the current host.',
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
        query_basis: 'Reviewed 2026-06-25 the current official Wyoming Department of Education Parent Resources page that routes families to Wyoming parent advocacy organizations.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'WDE Parent Resources page',
            source_url: 'https://edu.wyoming.gov/parents/special-education/parent-resources/',
            final_url: 'https://edu.wyoming.gov/parents/special-education/parent-resources/',
            verification_status: 'official_verified',
            source_type: 'official_parent_resources_page',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official WDE Parent Resources page includes a heading reading Wyoming Parent Advocacy Organizations Parent Information Center/Parent Education Network.',
          },
          {
            sample_name: 'WDE parent-center routing details',
            source_url: 'https://edu.wyoming.gov/parents/special-education/parent-resources/',
            final_url: 'https://edu.wyoming.gov/parents/special-education/parent-resources/',
            verification_status: 'official_verified',
            source_type: 'official_parent_resources_page',
            source_table: 'state_resource_agencies',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same official page routes families directly to www.wpic.org and preserves the organization address and phone information.',
          },
          {
            sample_name: 'Parents Information Center of Wyoming homepage',
            source_url: 'https://wpic.org/',
            final_url: 'https://wpic.org/',
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_homepage',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live first-party site preserves the Parents Information Center of Wyoming identity and special-education support scope linked from the official WDE page.',
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
        query_basis: 'Reviewed 2026-06-25 the official Legal Services Corporation grantee directory and Wyoming program profile.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'LSC Wyoming grantee directory entry',
            source_url: 'https://www.lsc.gov/grants/our-grantees',
            final_url: 'https://www.lsc.gov/grants/our-grantees',
            verification_status: 'official_verified',
            source_type: 'official_legal_aid_grantee_directory',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official LSC grantee page lists Legal Aid of Wyoming, Inc. under Wyoming.',
          },
          {
            sample_name: 'LSC Legal Aid of Wyoming program profile',
            source_url: 'https://www.lsc.gov/grants/our-grantees/legal-aid-wyoming-inc-program-profile',
            final_url: 'https://www.lsc.gov/grants/our-grantees/legal-aid-wyoming-inc-program-profile',
            verification_status: 'official_verified',
            source_type: 'official_legal_aid_program_profile',
            source_table: 'nonprofit_organizations',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The live LSC program-profile page preserves the authoritative Legal Aid of Wyoming, Inc. program record on the official LSC host.',
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
        query_basis: 'Reviewed 2026-06-25 the current official Wyoming Department of Health HCBS contacts pages, county PDF link, and regional early-intervention directory.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Wyoming HCBS contacts and important links page',
            source_url: 'https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/',
            final_url: 'https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/',
            verification_status: 'official_verified',
            source_type: 'official_county_local_directory',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The official HCBS contacts page explicitly says `Click below for HCBS Specialists by County`.',
          },
          {
            sample_name: 'Wyoming BES caseload county PDF',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            final_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            verification_status: 'official_verified',
            source_type: 'official_county_local_pdf',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The same official contacts page links the public BES-Caseloads-Effective-10.2025.pdf file on the Wyoming health host as the county-routing attachment.',
          },
          {
            sample_name: 'Wyoming HCBS landing page',
            source_url: 'https://health.wyo.gov/healthcarefin/hcbs/',
            final_url: 'https://health.wyo.gov/healthcarefin/hcbs/',
            verification_status: 'official_verified',
            source_type: 'official_hcbs_entry_page',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The HCBS landing page tells families applying for developmental-disability waivers to contact their area Benefits and Eligibility Specialist.',
          },
          {
            sample_name: 'Wyoming Early Intervention Find A Center page',
            source_url: 'https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/',
            final_url: 'https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/',
            verification_status: 'official_verified',
            source_type: 'official_regional_directory',
            source_table: 'county_offices',
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The current Find A Center page tells families to contact the child development center nearest them and publicly lists Region 1 through Region 14 contacts.',
          },
        ],
      };
    }
    return row;
  });

  const batchSummary = {
    batch: 'batch385_wyoming_official_routing_completion_v1',
    state: 'wyoming',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: [
      'special_education_idea_part_b',
      'district_or_county_education_routing',
      'parent_training_information_center',
      'legal_aid',
      'county_local_disability_resources',
    ],
    evidence_sources: [
      'https://edu.wyoming.gov/parents/special-education/',
      'https://edu.wyoming.gov/parents/special-education/idea/',
      'https://edu.wyoming.gov/parents/special-education/parent-resources/',
      'https://www.acsd1.org/page/special-services/',
      'https://sites.google.com/ccsd1schools.net/special-services/home',
      'https://www.bighorn1.com/sitemap.xml',
      'https://www.lsc.gov/grants/our-grantees',
      'https://www.lsc.gov/grants/our-grantees/legal-aid-wyoming-inc-program-profile',
      'https://health.wyo.gov/healthcarefin/hcbs/',
      'https://health.wyo.gov/healthcarefin/hcbs/contacts-and-important-links/',
      'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
      'https://health.wyo.gov/behavioralhealth/early-intervention-education-program-eiep/find-a-center/',
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
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch385WyomingOfficialRoutingCompletionV1();
}
