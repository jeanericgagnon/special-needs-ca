import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const OUTPUTS = {
  summary: path.join(generatedDir, 'iowa_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'iowa_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'iowa_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'iowa_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'iowa_next_action_queue_v2.jsonl'),
  batchSummary: path.join(generatedDir, 'batch48_iowa_statewide_family_truth_refresh_summary_v1.json'),
  probes: path.join(generatedDir, 'batch48_iowa_official_probe_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'iowa-california-grade-audit-report-v2.md'),
  batchReport: path.join(docsGeneratedDir, 'batch48-iowa-statewide-family-truth-refresh-report-v1.md'),
};

const LIVE_PROBES = {
  hhsRoot: {
    url: 'https://hhs.iowa.gov/',
    finalUrl: 'https://hhs.iowa.gov/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the real Iowa HHS root and exposed role-aligned links for Medicaid, Disability Services, Early Intervention & Support, and HHS Office Locations.',
  },
  medicaid: {
    url: 'https://hhs.iowa.gov/medicaid',
    finalUrl: 'https://hhs.iowa.gov/medicaid',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title and H1 "Medicaid" with direct links for Apply for Medicaid, Eligibility, Appeal a Decision, and local HHS office routing.',
  },
  medicaidApply: {
    url: 'https://hhs.iowa.gov/medicaid/apply-medicaid',
    finalUrl: 'https://hhs.iowa.gov/medicaid/apply-medicaid',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title and H1 "Apply for Medicaid" with direct eligibility, disability determination, income guideline, and waiver-program links.',
  },
  waiver: {
    url: 'https://hhs.iowa.gov/medicaid/services-care/home-and-community-based-services',
    finalUrl: 'https://hhs.iowa.gov/medicaid/services-care/home-and-community-based-services',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title and H1 "Home and Community-Based Services," replacing the dead legacy HCBS eligibility packet leaf with a live Iowa HHS waiver root.',
  },
  disabilityServices: {
    url: 'https://hhs.iowa.gov/family-community/disability-services',
    finalUrl: 'https://hhs.iowa.gov/family-community/disability-services',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title and H1 "Disability Services" with direct state HHS disability-services routing and links for applying and appeals.',
  },
  earlyIntervention: {
    url: 'https://hhs.iowa.gov/programs/programs-and-services/early-intervention-and-support',
    finalUrl: 'https://hhs.iowa.gov/programs/programs-and-services/early-intervention-and-support',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title and H1 "Early Intervention & Support" with official Iowa HHS early-intervention routing and a first-party link out to Early ACCESS.',
  },
  officeLocations: {
    url: 'https://hhs.iowa.gov/hhs-office-locations',
    finalUrl: 'https://hhs.iowa.gov/hhs-office-locations',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title and H1 "HHS Office Locations" and preserved hundreds of county office entries directly in reviewed HTML, including county names and per-county office links.',
  },
  education: {
    url: 'https://educate.iowa.gov/pk-12/special-education',
    finalUrl: 'https://educate.iowa.gov/pk-12/special-education',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title and H1 "Special Education" on the replatformed Iowa Department of Education domain and linked School District Maps plus Dispute Resolution.',
  },
  disputeResolution: {
    url: 'https://educate.iowa.gov/pk-12/special-education/dispute-resolution',
    finalUrl: 'https://educate.iowa.gov/pk-12/special-education/dispute-resolution',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title and H1 "Dispute Resolution" and described dispute pathways among parents, school staff, and Area Education Agency staff.',
  },
  districtMaps: {
    url: 'https://educate.iowa.gov/pk-12/district-maps',
    finalUrl: 'https://educate.iowa.gov/pk-12/district-maps',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title and H1 "School District Maps" with public district-boundary map links, but it did not itself preserve district-owned special-education routing leaves.',
  },
  aeaPerformance: {
    url: 'https://educate.iowa.gov/pk-12/aea-performance-accountability',
    finalUrl: 'https://educate.iowa.gov/pk-12/aea-performance-accountability',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title and H1 "AEA Performance & Accountability" with AEA documents and performance materials, but not county-grade special-education routing leaves.',
  },
  vocationalRehab: {
    url: 'https://ivrs.iowa.gov/',
    finalUrl: 'https://workforce.iowa.gov/vr',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe to the legacy IVRS root redirected to the live Iowa Workforce Development VR page titled "Vocational Rehabilitation (VR) Services."',
  },
  protectionAndAdvocacy: {
    url: 'https://disabilityrightsiowa.org/',
    finalUrl: 'https://disabilityrightsiowa.org/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the first-party title "Disability Rights Iowa | Legal Protection and Advocacy."',
  },
  pti: {
    url: 'https://www.askresource.org/about',
    finalUrl: 'https://www.askresource.org/about',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the first-party ASK Resource Center About page, but no explicit PTI / Parent Training and Information Center designation text was preserved in the reviewed body.',
  },
  legalAid: {
    url: 'https://www.iowalegalaid.org/',
    finalUrl: 'https://iowalegalaid.org/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title "Iowa Legal Aid | Free Legal Help for Low-Income Iowans."',
  },
};

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function buildGapRows() {
  return [
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'medicaid_state_health_coverage',
      family_label: 'Medicaid / state health coverage',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: true,
      statewide_enough: false,
      status_reason: 'Live Iowa HHS Medicaid and Apply for Medicaid leaves now replace the stale IME packet samples with real statewide application, eligibility, and appeals routing.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'medicaid_waiver_hcbs_disability_services',
      family_label: 'Medicaid waiver / HCBS / disability services',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'The live Iowa HHS Home and Community-Based Services page now replaces the dead legacy HCBS eligibility sample.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'developmental_disability_idd_authority',
      family_label: 'Developmental disability / IDD authority',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: true,
      statewide_enough: false,
      status_reason: 'Live Iowa HHS Disability Services now replaces the dead legacy DD packet root with a role-aligned statewide disability-services authority.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'early_intervention_part_c',
      family_label: 'Early intervention / IDEA Part C',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: true,
      statewide_enough: false,
      status_reason: 'Live Iowa HHS Early Intervention & Support now replaces the dead legacy early-start packet sample.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'special_education_idea_part_b',
      family_label: 'Special education / IDEA Part B',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Live Iowa Department of Education special-education and dispute-resolution leaves now replace the stale generic home-page packet sample.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'district_or_county_education_routing',
      family_label: 'District or county education routing',
      family_status: 'blocked_exact_district_or_county_leafs_unverified',
      critical: true,
      county_grade_required: true,
      statewide_enough: false,
      status_reason: 'Reviewed Iowa education pages expose school-district maps and AEA structural materials, but no district-owned or county-grade special-education routing leaf is preserved on disk.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'vocational_rehabilitation_pre_ets',
      family_label: 'Vocational rehabilitation / Pre-ETS',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'The live Iowa Workforce Development VR page now replaces the stale generic HHS packet sample.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'protection_and_advocacy',
      family_label: 'Protection and advocacy',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Reviewed first-party Disability Rights Iowa evidence now provides the statewide P&A route.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'parent_training_information_center',
      family_label: 'Parent training and information center',
      family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'ASK Resource Center is a real first-party Iowa family-support source, but the reviewed About page does not preserve explicit PTI / Parent Training and Information Center designation text.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'legal_aid',
      family_label: 'Legal aid',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Reviewed first-party Iowa Legal Aid evidence now provides the statewide civil legal-aid route.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'able_program',
      family_label: 'ABLE program',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Statewide evidence is present at the required authority level.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'ssi_ssa_federal_reference',
      family_label: 'SSI / SSA federal references',
      family_status: 'verified_state_grade',
      critical: false,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Statewide evidence is present at the required authority level.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      state_name: 'Iowa',
      family: 'county_local_disability_resources',
      family_label: 'County/local disability resources',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: true,
      statewide_enough: false,
      status_reason: 'The live Iowa HHS Office Locations page preserves hundreds of county office entries directly in reviewed HTML, so one official leaf now truthfully satisfies statewide county-local routing coverage.',
    },
  ];
}

function buildFailureRows() {
  return [
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      evidence: 'Reviewed Iowa special-education, dispute-resolution, district-maps, and AEA pages are statewide or structural only; no district-owned or county-grade special-education routing leaf is preserved on disk.',
      next_action: 'author_county_or_district_exact_targets',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'parent_training_information_center',
      severity: 'major',
      failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
      evidence: LIVE_PROBES.pti.evidence,
      next_action: 'author_or_verify_explicit_statewide_pti_source',
    },
  ];
}

function buildNextActionRows() {
  return [
    {
      state: 'iowa',
      state_code: 'IA',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      next_action: 'author_county_or_district_exact_targets',
      evidence: 'Iowa still lacks reviewed district-owned or county-grade special-education routing leaves; current reviewed education evidence is statewide or structural only.',
    },
    {
      state: 'iowa',
      state_code: 'IA',
      priority_rank: 2,
      family: 'parent_training_information_center',
      severity: 'major',
      failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
      next_action: 'author_or_verify_explicit_statewide_pti_source',
      evidence: 'ASK Resource Center is reviewed and real, but the preserved first-party About page still lacks explicit PTI designation text.',
    },
  ];
}

function buildVerifiedRows() {
  return [
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'medicaid_state_health_coverage',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 2,
      query_basis: 'Reviewed live Iowa HHS Medicaid leaves now replace the dead legacy IME packet samples.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Iowa Medicaid',
          source_url: LIVE_PROBES.medicaid.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Apply for Medicaid',
          source_url: LIVE_PROBES.medicaidApply.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'medicaid_waiver_hcbs_disability_services',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live Iowa HHS HCBS root now replaces the dead legacy waiver packet sample.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Home and Community-Based Services',
          source_url: LIVE_PROBES.waiver.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'developmental_disability_idd_authority',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live Iowa HHS Disability Services page now replaces the dead legacy DD root.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Iowa Disability Services',
          source_url: LIVE_PROBES.disabilityServices.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'early_intervention_part_c',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live Iowa HHS early-intervention route now replaces the dead legacy early-start packet sample.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Iowa Early Intervention & Support',
          source_url: LIVE_PROBES.earlyIntervention.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'special_education_idea_part_b',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 2,
      query_basis: 'Reviewed live Iowa Department of Education special-education leaves now replace the generic home-page packet sample.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Iowa Special Education',
          source_url: LIVE_PROBES.education.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Iowa Dispute Resolution',
          source_url: LIVE_PROBES.disputeResolution.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'district_or_county_education_routing',
      family_status: 'blocked_exact_district_or_county_leafs_unverified',
      evidence_strength: 'weak',
      sample_count: 4,
      query_basis: 'Reviewed statewide Iowa education structure is preserved as blocker evidence, but no district-owned or county-grade special-education routing leaf is reviewed.',
      blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
      blocker_evidence: 'Iowa special-education, dispute-resolution, district-maps, and AEA pages remain statewide or structural only and do not prove district-owned routing leaves.',
      samples: [
        {
          sample_name: 'Iowa Special Education',
          source_url: LIVE_PROBES.education.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Iowa Dispute Resolution',
          source_url: LIVE_PROBES.disputeResolution.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'School District Maps',
          source_url: LIVE_PROBES.districtMaps.finalUrl,
          verification_status: 'verified',
          source_type: 'official_structural',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'AEA Performance & Accountability',
          source_url: LIVE_PROBES.aeaPerformance.finalUrl,
          verification_status: 'verified',
          source_type: 'official_structural',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'vocational_rehabilitation_pre_ets',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live Iowa VR evidence now replaces the stale generic HHS packet sample.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Iowa Vocational Rehabilitation Services',
          source_url: LIVE_PROBES.vocationalRehab.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'protection_and_advocacy',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party Disability Rights Iowa evidence now provides the statewide P&A route.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights Iowa',
          source_url: LIVE_PROBES.protectionAndAdvocacy.finalUrl,
          verification_status: 'verified',
          source_type: 'first_party',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'parent_training_information_center',
      family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
      evidence_strength: 'weak',
      sample_count: 1,
      query_basis: 'ASK Resource Center is a real reviewed first-party Iowa family-support source, but its About page still lacks explicit PTI designation text in the reviewed body.',
      blocker_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
      blocker_evidence: LIVE_PROBES.pti.evidence,
      samples: [
        {
          sample_name: 'ASK Resource Center About',
          source_url: LIVE_PROBES.pti.finalUrl,
          verification_status: 'verified',
          source_type: 'first_party',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'legal_aid',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party Iowa Legal Aid evidence now provides the statewide civil legal-aid route.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Iowa Legal Aid',
          source_url: LIVE_PROBES.legalAid.finalUrl,
          verification_status: 'verified',
          source_type: 'first_party',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'able_program',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Verified ABLE program pages from the program spine.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Iowa ABLE Program',
          source_url: 'https://www.ablenrc.org',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
        },
      ],
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'ssi_ssa_federal_reference',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Verified federal/state crossover program rows.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'SSI for Children (Iowa)',
          source_url: 'https://www.ssa.gov',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
        },
      ],
    },
    {
      state: 'iowa',
      state_code: 'IA',
      family: 'county_local_disability_resources',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'The reviewed Iowa HHS Office Locations page itself preserves county coverage directly in HTML, replacing legacy DOI mirror placeholders.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Iowa HHS Office Locations',
          source_url: LIVE_PROBES.officeLocations.finalUrl,
          verification_status: 'verified',
          source_type: 'official_county_coverage_leaf',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
  ];
}

function buildSummary() {
  return {
    state: 'iowa',
    state_code: 'IA',
    state_name: 'Iowa',
    batch: 'batch_48_iowa_statewide_family_truth_refresh_v1',
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    county_count: 99,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    missing_critical_families: 0,
    total_critical_families: 12,
    primary_gap_reason: 'district_grade_education_and_explicit_pti_designation_still_unverified',
    recommended_batch: 'batch_2_repair_blocked',
    critical_gap_families: [
      'district_or_county_education_routing',
    ],
    major_gap_families: [
      'parent_training_information_center',
    ],
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
    texas_v10_rule_basis: [
      'Preserve noindex until all critical families are verified',
      'District-grade routing must use direct local or district-owned evidence, not generic or statewide fallback',
      'Legacy/inventory-only evidence does not satisfy California-grade completeness',
    ],
  };
}

function buildBatchSummary(summary, gapRows, failureRows, verifiedRows) {
  return {
    generated_at: '2026-06-21T23:59:30.000Z',
    state: 'iowa',
    classification: summary.classification,
    index_safe: summary.index_safe,
    completeness_pct: summary.completeness_pct,
    upgraded_families: [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'special_education_idea_part_b',
      'vocational_rehabilitation_pre_ets',
      'protection_and_advocacy',
      'legal_aid',
      'county_local_disability_resources',
    ],
    blocked_families: failureRows.map((row) => row.family),
    evidence_checks: LIVE_PROBES,
    gap_status_by_family: Object.fromEntries(gapRows.map((row) => [row.family, row.family_status])),
    verified_sample_counts: Object.fromEntries(verifiedRows.map((row) => [row.family, row.sample_count])),
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows) {
  const familyLines = gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`);
  const failureLines = failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`);
  const sampleLines = verifiedRows.map((row) => {
    const first = row.samples[0]?.source_url ?? 'none';
    return `- ${row.family}: ${row.family_status}; samples=${row.sample_count}; first=${first}`;
  });

  return [
    '# Iowa California-Grade Truth Refresh v2',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Family status',
    '',
    ...familyLines,
    '',
    '## Failure ledger',
    '',
    ...failureLines,
    '',
    '## Verified source samples',
    '',
    ...sampleLines,
    '',
    '## Next actions',
    '',
    '- [critical] district_or_county_education_routing: author_county_or_district_exact_targets',
    '- [major] parent_training_information_center: author_or_verify_explicit_statewide_pti_source',
    '',
    '## Completion decision',
    '',
    '- Iowa is no longer UNSTARTED. The statewide packet has been truth-refreshed onto live replatformed Iowa HHS and Education leaves plus reviewed first-party statewide support evidence.',
    '- County-local upgrade: the reviewed Iowa HHS Office Locations page itself preserves structured county coverage directly in HTML, including county office entries like Adair County HHS, Adams County HHS, and Polk County HHS, so one official leaf now truthfully satisfies statewide county-local routing coverage.',
    '- VR upgrade: the legacy `ivrs.iowa.gov` root now redirects to the live Iowa Workforce Development page `workforce.iowa.gov/vr`, which explicitly provides Vocational Rehabilitation Services.',
    '- Iowa remains BLOCKED and not index-safe because two families still fail closed:',
    `  - district_or_county_education_routing: ${failureRows[0].evidence}`,
    `  - parent_training_information_center: ${failureRows[1].evidence}`,
    '- ASK Resource Center is preserved as real first-party family-support evidence, but it does not upgrade the statewide PTI family until the reviewed body preserves explicit PTI designation text.',
    '',
  ].join('\n');
}

export function generateBatch48IowaStatewideFamilyTruthRefreshV1() {
  const gapRows = buildGapRows();
  const failureRows = buildFailureRows();
  const verifiedRows = buildVerifiedRows();
  const summary = buildSummary();
  const nextActionRows = buildNextActionRows();
  const batchSummary = buildBatchSummary(summary, gapRows, failureRows, verifiedRows);
  const report = buildReport(summary, gapRows, failureRows, verifiedRows);

  writeJson(OUTPUTS.summary, summary);
  writeJsonl(OUTPUTS.gap, gapRows);
  writeJsonl(OUTPUTS.failures, failureRows);
  writeJsonl(OUTPUTS.verified, verifiedRows);
  writeJsonl(OUTPUTS.nextActions, nextActionRows);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  writeJson(OUTPUTS.probes, LIVE_PROBES);
  fs.mkdirSync(path.dirname(OUTPUTS.report), { recursive: true });
  fs.writeFileSync(OUTPUTS.report, `${report}\n`);
  fs.writeFileSync(OUTPUTS.batchReport, `${report}\n`);

  return summary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch48IowaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify({
    ok: true,
    state: result.state,
    classification: result.classification,
    index_safe: result.index_safe,
    completeness_pct: result.completeness_pct,
    strong_critical_families: result.strong_critical_families,
    weak_critical_families: result.weak_critical_families,
    missing_critical_families: result.missing_critical_families,
  }, null, 2));
}
