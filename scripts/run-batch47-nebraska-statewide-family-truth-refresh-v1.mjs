import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'nebraska_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'nebraska_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'nebraska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nebraska_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'nebraska_next_action_queue_v2.jsonl'),
  batchSummary: path.join(generatedDir, 'batch47_nebraska_statewide_family_truth_refresh_summary_v1.json'),
  probes: path.join(generatedDir, 'batch47_nebraska_official_probe_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'nebraska-california-grade-audit-report-v2.md'),
  batchReport: path.join(docsGeneratedDir, 'batch47-nebraska-statewide-family-truth-refresh-report-v1.md'),
};

const NEW_LESSON_HEADING = '### Official Interactive Locators Do Not Count As County-Grade Proof Until Their County Data Is Reviewed';
const NEW_LESSON_BODY = [
  '*   **Problem:** Nebraska exposed a live official county-office chain through a `Public Assistance Offices` page that linked to a GIS Experience Builder locator, but the fetched locator only rendered a generic `Experience` shell and did not preserve county rows or structured office evidence in the reviewed artifact chain.',
  '*   **Lesson:** A live official locator link is not county-grade proof by itself. Upgrade county-local routing only when the reviewed HTML, document, or extracted data preserves concrete county offices, counties served, or structured local routing evidence. Interactive locator shells stay blocked until the county data itself is reviewed.',
].join('\n');

const LIVE_PROBES = {
  dhhsRoot: {
    url: 'https://dhhs.ne.gov/Pages/default.aspx',
    finalUrl: 'https://dhhs.ne.gov/Pages/default.aspx',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the real Nebraska DHHS SharePoint root and exposed role-aligned links for Public Assistance Offices, Medicaid Eligibility, and Developmental Disabilities.',
  },
  medicaidEligibility: {
    url: 'https://dhhs.ne.gov/Pages/Medicaid-Eligibility.aspx',
    finalUrl: 'https://dhhs.ne.gov/Pages/Medicaid-Eligibility.aspx',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title "Medicaid Eligibility" with body text "There are Many Ways to Apply for Medicaid" and links to iServe, disability coverage guidance, and the Medicaid provider directory.',
  },
  medicaidGeneral: {
    url: 'https://dhhs.ne.gov/Pages/General-Medicaid-Information.aspx',
    finalUrl: 'https://dhhs.ne.gov/Pages/General-Medicaid-Information.aspx',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title "Medicaid General Information and Overview" with statewide benefits, contact, regulations, and state-plan context.',
  },
  ddRoot: {
    url: 'https://dhhs.ne.gov/Pages/Developmental-Disabilities.aspx',
    finalUrl: 'https://dhhs.ne.gov/Pages/Developmental-Disabilities.aspx',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title and H1 "Division of Developmental Disabilities" and preserved DD-specific appeal hooks including "Request for Fair Hearing Form" and the DD appeals email target.',
  },
  ddEligibility: {
    url: 'https://dhhs.ne.gov/Pages/DD-Eligibility.aspx',
    finalUrl: 'https://dhhs.ne.gov/Pages/DD-Eligibility.aspx',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title "Eligibility for Medicaid HCBS Waiver Services," replacing the dead `dhhs.nebraska.gov/dd/waivers` packet sample with a live Nebraska DHHS waiver-eligibility leaf.',
  },
  publicAssistanceOffices: {
    url: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
    finalUrl: 'https://dhhs.ne.gov/Pages/Public-Assistance-Offices.aspx',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title "Public Assistance Offices" and linked the official Nebraska Public Office Location Lookup, but the fetched page did not itself preserve county office rows.',
  },
  officeLookup: {
    url: 'https://gis.ne.gov/portal/apps/experiencebuilder/experience/?id=76a6ec0ec7c449448c95d00f59002457',
    finalUrl: 'https://gis.ne.gov/portal/apps/experiencebuilder/experience/?id=76a6ec0ec7c449448c95d00f59002457',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe to the official Nebraska Public Office Location Lookup only rendered the generic title "Experience" and did not preserve county-grade office data in the reviewed HTML artifact.',
  },
  edn: {
    url: 'https://edn.ne.gov/cms/',
    finalUrl: 'https://edn.ne.gov/cms/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title "Home | Nebraska Early Development Network" and H1 "The Nebraska Early Development Network" with visible Early Intervention, Who is Eligible, Services Coordination, Make a Referral, and Planning Region Teams navigation.',
  },
  ndeSpecialEducation: {
    url: 'https://www.education.ne.gov/sped/',
    finalUrl: 'https://www.education.ne.gov/sped/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title and H1 "Special Education" on the Nebraska Department of Education site, replacing the old generic home-page packet sample.',
  },
  ndeComplaint: {
    url: 'https://www.education.ne.gov/sped/state-complaint/',
    finalUrl: 'https://www.education.ne.gov/sped/state-complaint/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact Nebraska Department of Education "State Complaint" leaf.',
  },
  ndeMediation: {
    url: 'https://www.education.ne.gov/sped/mediation/',
    finalUrl: 'https://www.education.ne.gov/sped/mediation/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact Nebraska Department of Education "Mediation" leaf.',
  },
  ndeDueProcess: {
    url: 'https://www.education.ne.gov/sped/due-process/',
    finalUrl: 'https://www.education.ne.gov/sped/due-process/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact Nebraska Department of Education "Due Process" leaf.',
  },
  vr: {
    url: 'https://vr.nebraska.gov/',
    finalUrl: 'https://vr.nebraska.gov/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned title "Nebraska VR | Welcome" with statewide vocational-rehabilitation content including Vocational Rehabilitation Rules, State Rehabilitation Council, and formal review determinations.',
  },
  protectionAndAdvocacy: {
    url: 'https://www.disabilityrightsnebraska.org/',
    finalUrl: 'https://www.disabilityrightsnebraska.org/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned first-party text stating "Disability Rights Nebraska is the Protection and Advocacy system for people with disabilities in our state."',
  },
  pti: {
    url: 'https://pti-nebraska.org/about/',
    finalUrl: 'https://pti-nebraska.org/about/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned first-party text stating "PTI Nebraska has served as Nebraska’s Parent Training and Information Center since 2001" and "Nebraska has one federally funded Parent Center."',
  },
  legalAid: {
    url: 'https://legalaidofnebraska.org/',
    finalUrl: 'https://legalaidofnebraska.org/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned H1 "Who We Are and What We Do" with first-party text that Legal Aid of Nebraska exists to provide quality civil legal aid to Nebraskans who have nowhere else to turn.',
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

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function ensureLesson() {
  const lessons = readText(INPUTS.lessons);
  if (lessons.includes(NEW_LESSON_HEADING)) {
    return;
  }
  const updated = `${lessons.trim()}\n\n${NEW_LESSON_HEADING}\n${NEW_LESSON_BODY}\n`;
  fs.writeFileSync(INPUTS.lessons, updated);
}

function buildGapRows() {
  return [
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'medicaid_state_health_coverage',
      family_label: 'Medicaid / state health coverage',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: true,
      statewide_enough: false,
      status_reason: 'Live Nebraska DHHS Medicaid eligibility and overview leaves now provide the statewide application, eligibility, and coverage path on the real official domain.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'medicaid_waiver_hcbs_disability_services',
      family_label: 'Medicaid waiver / HCBS / disability services',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Live Nebraska DHHS waiver-eligibility evidence now replaces the dead legacy waiver root.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'developmental_disability_idd_authority',
      family_label: 'Developmental disability / IDD authority',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: true,
      statewide_enough: false,
      status_reason: 'Live Nebraska DHHS Developmental Disabilities and waiver-eligibility leaves now prove the statewide DD authority and appeals path on the reviewed official domain.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'early_intervention_part_c',
      family_label: 'Early intervention / IDEA Part C',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: true,
      statewide_enough: false,
      status_reason: 'The official Nebraska Early Development Network site now provides a live statewide Part C route with referral, eligibility, service-coordination, and planning-region navigation.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'special_education_idea_part_b',
      family_label: 'Special education / IDEA Part B',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Live Nebraska Department of Education special-education, complaint, mediation, and due-process leaves now replace the stale generic home-page packet sample.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'district_or_county_education_routing',
      family_label: 'District or county education routing',
      family_status: 'blocked_exact_district_or_county_leafs_unverified',
      critical: true,
      county_grade_required: true,
      statewide_enough: false,
      status_reason: 'Reviewed NDE leaves prove statewide special-education dispute paths only; no reviewed district-owned or county-grade education-routing leaf is preserved on disk.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'vocational_rehabilitation_pre_ets',
      family_label: 'Vocational rehabilitation / Pre-ETS',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Live Nebraska VR now provides the statewide vocational-rehabilitation route on the correct official subdomain.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'protection_and_advocacy',
      family_label: 'Protection and advocacy',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Reviewed first-party Disability Rights Nebraska evidence explicitly proves the statewide P&A role.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'parent_training_information_center',
      family_label: 'Parent training and information center',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Reviewed first-party PTI Nebraska evidence explicitly states that it has served as Nebraska’s Parent Training and Information Center since 2001 and that Nebraska has one federally funded Parent Center.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'legal_aid',
      family_label: 'Legal aid',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Reviewed first-party Legal Aid of Nebraska evidence now provides a real statewide civil legal-aid route.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'able_program',
      family_label: 'ABLE program',
      family_status: 'verified_state_grade',
      critical: true,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Statewide evidence is present at the required authority level.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'ssi_ssa_federal_reference',
      family_label: 'SSI / SSA federal references',
      family_status: 'verified_state_grade',
      critical: false,
      county_grade_required: false,
      statewide_enough: true,
      status_reason: 'Statewide evidence is present at the required authority level.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      state_name: 'Nebraska',
      family: 'county_local_disability_resources',
      family_label: 'County/local disability resources',
      family_status: 'blocked_official_interactive_locator_not_reviewed_county_grade',
      critical: true,
      county_grade_required: true,
      statewide_enough: false,
      status_reason: 'The reviewed Nebraska Public Assistance Offices chain is live, but the official GIS locator still renders only an interactive shell in the reviewed HTML and does not preserve county office rows.',
    },
  ];
}

function buildFailureRows() {
  return [
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      evidence: 'Reviewed NDE special-education, complaint, mediation, and due-process leaves are live and role-pure, but no district-owned or county-grade education-routing leaf is currently preserved on disk.',
      next_action: 'author_county_or_district_exact_targets',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'official_interactive_locator_not_reviewed_county_grade',
      evidence: `${LIVE_PROBES.publicAssistanceOffices.evidence} ${LIVE_PROBES.officeLookup.evidence}`,
      next_action: 'extract_or_review_county_rows_from_official_locator',
    },
  ];
}

function buildNextActionRows() {
  return [
    {
      state: 'nebraska',
      state_code: 'NE',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      next_action: 'author_county_or_district_exact_targets',
      evidence: 'Nebraska remains below California-grade because only statewide NDE education leaves are reviewed; no district-owned or county-grade education-routing leaf is verified.',
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      priority_rank: 2,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'official_interactive_locator_not_reviewed_county_grade',
      next_action: 'extract_or_review_county_rows_from_official_locator',
      evidence: 'Nebraska Public Assistance Offices now points to a live official GIS locator, but the reviewed locator artifact is only an interactive shell and has not yet yielded county-grade office rows.',
    },
  ];
}

function buildVerifiedSourceRows() {
  return [
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'medicaid_state_health_coverage',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 2,
      query_basis: 'Reviewed live Nebraska DHHS Medicaid leaves now replace the dead legacy domain and mixed-family packet samples.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Nebraska Medicaid Eligibility',
          source_url: LIVE_PROBES.medicaidEligibility.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Nebraska Medicaid General Information and Overview',
          source_url: LIVE_PROBES.medicaidGeneral.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'medicaid_waiver_hcbs_disability_services',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live Nebraska DHHS waiver-eligibility leaf now replaces the dead legacy waiver sample.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Eligibility for Medicaid HCBS Waiver Services',
          source_url: LIVE_PROBES.ddEligibility.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'developmental_disability_idd_authority',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 2,
      query_basis: 'Reviewed live Nebraska DHHS DD pages now provide the statewide DD authority and waiver-eligibility route on the correct official domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Division of Developmental Disabilities',
          source_url: LIVE_PROBES.ddRoot.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Eligibility for Medicaid HCBS Waiver Services',
          source_url: LIVE_PROBES.ddEligibility.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'early_intervention_part_c',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live Nebraska Early Development Network evidence now replaces the dead legacy early-intervention packet sample.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Nebraska Early Development Network',
          source_url: LIVE_PROBES.edn.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'special_education_idea_part_b',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 4,
      query_basis: 'Reviewed live Nebraska Department of Education leaves now provide the role-pure statewide IDEA, complaint, mediation, and due-process chain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Nebraska Special Education',
          source_url: LIVE_PROBES.ndeSpecialEducation.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Nebraska State Complaint',
          source_url: LIVE_PROBES.ndeComplaint.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Nebraska Mediation',
          source_url: LIVE_PROBES.ndeMediation.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Nebraska Due Process',
          source_url: LIVE_PROBES.ndeDueProcess.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'district_or_county_education_routing',
      family_status: 'blocked_exact_district_or_county_leafs_unverified',
      evidence_strength: 'weak',
      sample_count: 4,
      query_basis: 'Reviewed statewide NDE leaves are preserved as blocker evidence, but no district-owned or county-grade local routing leaf is reviewed.',
      blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
      blocker_evidence: 'Nebraska special-education, state-complaint, mediation, and due-process pages are statewide leaves only; no reviewed district-owned or county-grade routing leaf is preserved.',
      samples: [
        {
          sample_name: 'Nebraska Special Education',
          source_url: LIVE_PROBES.ndeSpecialEducation.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Nebraska State Complaint',
          source_url: LIVE_PROBES.ndeComplaint.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Nebraska Mediation',
          source_url: LIVE_PROBES.ndeMediation.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Nebraska Due Process',
          source_url: LIVE_PROBES.ndeDueProcess.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'vocational_rehabilitation_pre_ets',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live Nebraska VR evidence now replaces the dead legacy rehab packet sample.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Nebraska VR',
          source_url: LIVE_PROBES.vr.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'protection_and_advocacy',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party Disability Rights Nebraska evidence explicitly proves the statewide P&A designation.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights Nebraska',
          source_url: LIVE_PROBES.protectionAndAdvocacy.finalUrl,
          verification_status: 'verified',
          source_type: 'first_party',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'parent_training_information_center',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party PTI Nebraska evidence explicitly proves the statewide PTI designation and statewide reach.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'PTI Nebraska About PTI',
          source_url: LIVE_PROBES.pti.finalUrl,
          verification_status: 'verified',
          source_type: 'first_party',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'legal_aid',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party Legal Aid of Nebraska evidence now provides the statewide civil legal-aid route.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Legal Aid of Nebraska',
          source_url: LIVE_PROBES.legalAid.finalUrl,
          verification_status: 'verified',
          source_type: 'first_party',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'able_program',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Verified ABLE program pages from the program spine.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Nebraska ABLE Program',
          source_url: 'https://www.ablenrc.org',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
        },
      ],
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'ssi_ssa_federal_reference',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Verified federal/state crossover program rows.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'SSI for Children (Nebraska)',
          source_url: 'https://www.ssa.gov',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
        },
      ],
    },
    {
      state: 'nebraska',
      state_code: 'NE',
      family: 'county_local_disability_resources',
      family_status: 'blocked_official_interactive_locator_not_reviewed_county_grade',
      evidence_strength: 'weak',
      sample_count: 2,
      query_basis: 'Reviewed official county-local chain now preserves the real Public Assistance Offices root and the live GIS locator blocker instead of DOI mirrors and dead legacy domains.',
      blocker_code: 'official_interactive_locator_not_reviewed_county_grade',
      blocker_evidence: `${LIVE_PROBES.publicAssistanceOffices.evidence} ${LIVE_PROBES.officeLookup.evidence}`,
      samples: [
        {
          sample_name: 'Nebraska Public Assistance Offices',
          source_url: LIVE_PROBES.publicAssistanceOffices.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Nebraska Public Office Location Lookup',
          source_url: LIVE_PROBES.officeLookup.finalUrl,
          verification_status: 'blocked',
          source_type: 'official_interactive_locator',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
  ];
}

function buildSummary() {
  return {
    state: 'nebraska',
    state_code: 'NE',
    state_name: 'Nebraska',
    batch: 'batch_47_nebraska_statewide_family_truth_refresh_v1',
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    county_count: 93,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    missing_critical_families: 0,
    total_critical_families: 12,
    primary_gap_reason: 'district_grade_education_and_interactive_county_locator_still_unverified',
    recommended_batch: 'batch_2_repair_blocked',
    critical_gap_families: [
      'district_or_county_education_routing',
      'county_local_disability_resources',
    ],
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
    texas_v10_rule_basis: [
      'Preserve noindex until all critical families are verified',
      'District-grade routing must use direct local or district-owned evidence, not generic or statewide fallback',
      'Interactive county-office locators do not satisfy county-grade proof until reviewed county rows are preserved on disk',
    ],
  };
}

function buildBatchSummary(summary, gapRows, failureRows, verifiedRows) {
  return {
    generated_at: '2026-06-21T23:59:00.000Z',
    state: 'nebraska',
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
      'parent_training_information_center',
      'legal_aid',
    ],
    blocked_families: failureRows.map((row) => row.family),
    evidence_checks: {
      dhhsRoot: LIVE_PROBES.dhhsRoot,
      medicaidEligibility: LIVE_PROBES.medicaidEligibility,
      ddRoot: LIVE_PROBES.ddRoot,
      ddEligibility: LIVE_PROBES.ddEligibility,
      edn: LIVE_PROBES.edn,
      ndeSpecialEducation: LIVE_PROBES.ndeSpecialEducation,
      vr: LIVE_PROBES.vr,
      protectionAndAdvocacy: LIVE_PROBES.protectionAndAdvocacy,
      pti: LIVE_PROBES.pti,
      legalAid: LIVE_PROBES.legalAid,
      publicAssistanceOffices: LIVE_PROBES.publicAssistanceOffices,
      officeLookup: LIVE_PROBES.officeLookup,
    },
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
  const nextLines = [
    '- [critical] district_or_county_education_routing: author_county_or_district_exact_targets',
    '- [critical] county_local_disability_resources: extract_or_review_county_rows_from_official_locator',
  ];

  return [
    '# Nebraska California-Grade Truth Refresh v2',
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
    ...nextLines,
    '',
    '## Completion decision',
    '',
    '- Nebraska is no longer UNSTARTED. The statewide packet has been truth-refreshed onto live first-party official or authoritative support evidence.',
    '- PTI upgrade: PTI Nebraska has served as Nebraska’s Parent Training and Information Center since 2001, and its reviewed first-party About page also states that Nebraska has one federally funded Parent Center.',
    '- VR upgrade: `vr.nebraska.gov` is live and now replaces the stale legacy DHHS rehab packet sample with a reviewed Nebraska VR statewide route.',
    '- Early intervention upgrade: `edn.ne.gov` is live and now replaces the dead legacy early-intervention packet sample with the reviewed Nebraska Early Development Network route.',
    '- Nebraska remains BLOCKED and not index-safe because two county-grade critical families still fail closed:',
    `  - district_or_county_education_routing: ${failureRows[0].evidence}`,
    `  - county_local_disability_resources: ${failureRows[1].evidence}`,
    '- The old dead `dhhs.nebraska.gov` packet roots have been replaced where live official successors were reviewable, including `dhhs.ne.gov`, `vr.nebraska.gov`, and `edn.ne.gov`.',
    '',
  ].join('\n');
}

export function generateBatch47NebraskaStatewideFamilyTruthRefreshV1() {
  ensureLesson();

  const gapRows = buildGapRows();
  const failureRows = buildFailureRows();
  const verifiedRows = buildVerifiedSourceRows();
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
  const result = generateBatch47NebraskaStatewideFamilyTruthRefreshV1();
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
