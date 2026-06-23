import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'missouri_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'missouri_gap_matrix_v2.jsonl'),
  priorityQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  acceptedNonprofit: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-43-17-999Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  moadvocacyHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-43-17-999Z', 'pages', '00008-missouri-nonprofit-support-moadvocacy-org.html'),
  sourceRunResultsCsv: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-43-17-999Z', 'results.csv'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch45_missouri_statewide_family_truth_refresh_summary_v1.json'),
  probes: path.join(generatedDir, 'batch45_missouri_official_probe_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch45-missouri-statewide-family-truth-refresh-report-v1.md'),
};

const LIVE_PROBES = {
  medicaidHealthcare: {
    url: 'https://mydss.mo.gov/healthcare',
    finalUrl: 'https://mydss.mo.gov/healthcare',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact Missouri DSS Healthcare leaf with title "Healthcare | mydss.mo.gov" and H1 "Healthcare."',
  },
  medicaidRenewals: {
    url: 'https://mydss.mo.gov/renew',
    finalUrl: 'https://mydss.mo.gov/renew',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact Missouri DSS renewals leaf with title "Medicaid Annual Renewals | mydss.mo.gov" and H1 "Medicaid Annual Renewals."',
  },
  ddEligibility: {
    url: 'https://dmh.mo.gov/dev-disabilities/regional-offices/eligibility',
    finalUrl: 'https://dmh.mo.gov/dev-disabilities/regional-offices/eligibility',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact Missouri DMH eligibility leaf with title "Eligibility Determination | dmh.mo.gov" and H1 "Eligibility Determination."',
  },
  ddWaiverEnrollment: {
    url: 'https://dmh.mo.gov/dev-disabilities/waiver-enrollment',
    finalUrl: 'https://dmh.mo.gov/dev-disabilities/waiver-enrollment',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact Missouri DMH waiver leaf with title "HCBS Waiver Enrollment Information | dmh.mo.gov" and H1 "HCBS Waiver Enrollment Information."',
  },
  ddWaiverPrograms: {
    url: 'https://dmh.mo.gov/dev-disabilities/programs/waiver',
    finalUrl: 'https://dmh.mo.gov/dev-disabilities/programs/waiver',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact Missouri DMH waiver program leaf with title "Home & Community Based Waivers | dmh.mo.gov" and H1 "Home & Community Based Waivers."',
  },
  ddRegionalOffices: {
    url: 'https://dmh.mo.gov/dev-disabilities/regional-offices',
    finalUrl: 'https://dmh.mo.gov/dev-disabilities/regional-offices',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact Missouri DMH regional-office map with H1 "Map of Regional Offices" and fetched body text "For Regional Information Select a County", plus office names in the rendered HTML.',
  },
  specialEducation: {
    url: 'https://dese.mo.gov/special-education',
    finalUrl: 'https://dese.mo.gov/special-education',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact DESE special-education leaf with title "The Office of Special Education | Missouri Department of Elementary and Secondary Education" and H1 "The Office of Special Education."',
  },
  deseSchoolData: {
    url: 'https://dese.mo.gov/school-data',
    finalUrl: 'https://dese.mo.gov/school-data',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-22 live official DESE School Data page. It exposes links to the School Directory, Missouri School Directory Interactive Map, School Directory by County (All Districts), and School Directory (All Districts).',
  },
  desePublicReportShell: {
    url: 'https://apps.dese.mo.gov/WebLogin/Login.aspx?ReturnUrl=%2fMCDS%2fReports%2fSSRS_Print.aspx%3fReportid%3dee8cf509-bf32-455e-b49e-c366a23b37db&Reportid=ee8cf509-bf32-455e-b49e-c366a23b37db',
    finalUrl: 'https://apps.dese.mo.gov/MCDS/Reports/SSRS_Print.aspx?Reportid=ee8cf509-bf32-455e-b49e-c366a23b37db',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-22 exact replay of the DESE WebLogin "View Public Applications" form for the public school-directory report. The bridge reaches a live SSRS shell, but the rendered non-report content says "The attempt to connect to the report server failed" and "The request failed with HTTP status 404: Not Found."',
  },
  vrEmploymentServices: {
    url: 'https://dmh.mo.gov/about/employment-services',
    finalUrl: 'https://dmh.mo.gov/about/employment-services',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-21 live probe returned "Employment Services | dmh.mo.gov", but this is a generic DMH employment-services page and does not prove statewide vocational rehabilitation or Pre-ETS routing.',
  },
  vrMain: {
    url: 'https://dese.mo.gov/adult-learning-rehabilitation-services/vocational-rehabilitation',
    finalUrl: 'https://dese.mo.gov/adult-learning-rehabilitation-services/vocational-rehabilitation',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact Missouri Vocational Rehabilitation leaf with statewide VR contact, office-location, and youth-services routing.',
  },
  vrYouthServices: {
    url: 'https://dese.mo.gov/adult-learning-rehabilitation-services/vocational-rehabilitation/youth-services',
    finalUrl: 'https://dese.mo.gov/adult-learning-rehabilitation-services/vocational-rehabilitation/youth-services',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact Missouri Youth Services leaf with explicit Pre-Employment Transition Services (pre-ETS) language and student-disability routing.',
  },
  legacyDdRoot: {
    url: 'https://dhhs.missouri.gov/dd',
    finalUrl: '',
    status: 0,
    contentType: '',
    evidence: 'Reviewed 2026-06-21 live probe failed DNS resolution for dhhs.missouri.gov/dd, so the old packet DD root is dead.',
  },
  legacyEarlyInterventionRoot: {
    url: 'https://dhhs.missouri.gov/earlystart',
    finalUrl: '',
    status: 0,
    contentType: '',
    evidence: 'Reviewed 2026-06-21 live probe failed DNS resolution for dhhs.missouri.gov/earlystart, so the old packet early-intervention root is dead.',
  },
  ptiLowTokenBlocked: {
    url: 'https://ptimpact.org/',
    finalUrl: 'https://www.missouriparentsact.org/',
    status: 403,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-20 low-token fetch followed ptimpact.org to missouriparentsact.org and received the Cloudflare "Just a moment..." HTTP 403 challenge shell.',
  },
  ptiBrowserHome: {
    url: 'https://www.missouriparentsact.org/',
    finalUrl: 'https://www.missouriparentsact.org/',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-22 browser-assisted exact first-party capture of the MPACT homepage. The live page preserves the visible phone 800.743.7634, email info@missouriparentsact.org, and the mission text "Empowering Families to advocate for themselves so that children with special education needs can reach their full potential in education and life."',
  },
  ptiBrowserAbout: {
    url: 'https://www.missouriparentsact.org/about-us/',
    finalUrl: 'https://www.missouriparentsact.org/about-us/',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-22 browser-assisted exact first-party capture of the MPACT About Us leaf. The live page states "We have been Missouri’s federally-funded Parent Training and Information Center since 1988."',
  },
  legalAidHome: {
    url: 'https://www.lsmo.org/',
    finalUrl: 'https://www.lsmo.org/',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed Missouri Legal Services preserves a live first-party statewide legal-aid route on disk.',
  },
  desePartCGuess: {
    url: 'https://dese.mo.gov/childhood/early-intervention/first-steps',
    finalUrl: 'https://dese.mo.gov/childhood/early-intervention/first-steps',
    status: 200,
    contentType: 'text/html; charset=UTF-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact Missouri First Steps leaf with Part C, referral, SPOE, and Early Intervention contact language.',
  },
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function assertIncludes(text, pattern, label) {
  if (!text.includes(pattern)) {
    throw new Error(`Expected ${label} evidence to include "${pattern}".`);
  }
}

function findRow(rows, predicate, label) {
  const row = rows.find(predicate);
  if (!row) {
    throw new Error(`Missing required row: ${label}`);
  }
  return row;
}

function buildVerifiedSourceRows() {
  return [
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'medicaid_state_health_coverage',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 2,
      query_basis: 'Reviewed live Missouri DSS leaves now provide role-pure statewide Medicaid healthcare and renewals context instead of the old mixed-family packet samples.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Missouri DSS Healthcare',
          source_url: LIVE_PROBES.medicaidHealthcare.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.medicaidHealthcare.evidence,
        },
        {
          sample_name: 'Missouri Medicaid Annual Renewals',
          source_url: LIVE_PROBES.medicaidRenewals.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.medicaidRenewals.evidence,
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'medicaid_waiver_hcbs_disability_services',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 2,
      query_basis: 'Reviewed live Missouri DMH waiver leaves replaced the stale hcbs/eligibility packet URL.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Missouri HCBS Waiver Enrollment Information',
          source_url: LIVE_PROBES.ddWaiverEnrollment.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.ddWaiverEnrollment.evidence,
        },
        {
          sample_name: 'Missouri Home & Community Based Waivers',
          source_url: LIVE_PROBES.ddWaiverPrograms.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.ddWaiverPrograms.evidence,
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'developmental_disability_idd_authority',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 2,
      query_basis: 'Reviewed live Missouri DMH developmental-disabilities leaves replaced the dead dhhs.missouri.gov DD packet root.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Missouri Eligibility Determination',
          source_url: LIVE_PROBES.ddEligibility.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.ddEligibility.evidence,
        },
        {
          sample_name: 'Missouri DD Regional Offices',
          source_url: LIVE_PROBES.ddRegionalOffices.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.ddRegionalOffices.evidence,
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'early_intervention_part_c',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live Missouri First Steps leaf now provides role-aligned Part C / early-intervention, referral, and SPOE routing evidence.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Missouri First Steps',
          source_url: LIVE_PROBES.desePartCGuess.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.desePartCGuess.evidence,
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'special_education_idea_part_b',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live DESE special-education leaf replaced the old generic dese.mo.gov homepage sample.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'The Office of Special Education',
          source_url: LIVE_PROBES.specialEducation.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.specialEducation.evidence,
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'district_or_county_education_routing',
      family_status: 'blocked_official_dese_public_report_shell_returns_report_server_404',
      evidence_strength: 'medium',
      sample_count: 4,
      query_basis: 'Reviewed 2026-06-22 the exact official Missouri DESE education directory contract. The School Data page links real public School Directory surfaces, but the obvious DESE school-directory path 404s, the old /directories path misroutes to sheltered workshops, and the DESE WebLogin "View Public Applications" replay only reaches an SSRS shell whose non-report content fails with report-server HTTP 404. No district-owned or county-grade education-routing leaves are preserved on disk yet.',
      blocker_code: 'official_dese_public_directory_postback_reaches_ssrs_shell_but_report_server_returns_404',
      blocker_evidence: LIVE_PROBES.desePublicReportShell.evidence,
      samples: [
        {
          sample_name: 'DESE School Data',
          source_url: LIVE_PROBES.deseSchoolData.finalUrl,
          verification_status: 'verified',
          source_type: 'official_directory_root',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.deseSchoolData.evidence,
        },
        {
          sample_name: 'DESE Directories Path',
          source_url: 'https://dese.mo.gov/directories',
          final_url: 'https://dese.mo.gov/special-education/sheltered-workshops/directories',
          verification_status: 'blocked',
          source_type: 'misdirected_directory_root',
          source_table: 'reviewed_live_probe',
          evidence_snippet: 'The expected directories path resolves to a sheltered-workshops directories page, not a district-owned school directory contract.',
        },
        {
          sample_name: 'DESE School Directory Path',
          source_url: 'https://dese.mo.gov/directories/school-directory',
          verification_status: 'blocked',
          source_type: 'official_directory_path_404',
          source_table: 'reviewed_live_probe',
          evidence_snippet: 'The obvious DESE school-directory path returned HTTP 404.',
        },
        {
          sample_name: 'DESE Public Applications School Directory Report',
          source_url: LIVE_PROBES.desePublicReportShell.url,
          final_url: LIVE_PROBES.desePublicReportShell.finalUrl,
          verification_status: 'blocked',
          source_type: 'broken_public_ssrs_report_shell',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.desePublicReportShell.evidence,
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'vocational_rehabilitation_pre_ets',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 2,
      query_basis: 'Reviewed live Missouri VR and Youth Services leaves now provide statewide VR routing plus explicit pre-ETS evidence for students with disabilities.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Missouri Vocational Rehabilitation',
          source_url: LIVE_PROBES.vrMain.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.vrMain.evidence,
        },
        {
          sample_name: 'Missouri VR Youth Services',
          source_url: LIVE_PROBES.vrYouthServices.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.vrYouthServices.evidence,
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'protection_and_advocacy',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party Missouri Protection and Advocacy Services artifact on disk explicitly proves the statewide P&A role.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Missouri Protection and Advocacy Services',
          source_url: 'https://www.moadvocacy.org/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
          evidence_snippet: 'The reviewed first-party artifact says Missouri Protection and Advocacy Services is designated by the Governor as the Protection and Advocacy system for Missouri.',
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'parent_training_information_center',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 2,
      query_basis: 'Reviewed 2026-06-22 browser-assisted exact first-party Missouri Parents Act / MPACT captures now preserve both statewide contact routing and explicit PTI designation evidence, so the old low-token 403 challenge is no longer the terminal truth for this family.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'MPACT Home',
          source_url: LIVE_PROBES.ptiBrowserHome.finalUrl,
          verification_status: 'verified',
          source_type: 'first_party_browser_review',
          source_table: 'reviewed_browser_probe',
          evidence_snippet: LIVE_PROBES.ptiBrowserHome.evidence,
        },
        {
          sample_name: 'MPACT About Us',
          source_url: LIVE_PROBES.ptiBrowserAbout.finalUrl,
          verification_status: 'official_verified',
          source_type: 'first_party_browser_review',
          source_table: 'reviewed_browser_probe',
          evidence_snippet: LIVE_PROBES.ptiBrowserAbout.evidence,
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'legal_aid',
      family_status: 'verified_state_grade',
      evidence_strength: 'medium',
      sample_count: 1,
      query_basis: 'Reviewed Missouri Legal Services preserves a live first-party statewide legal-aid route on disk.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Missouri Legal Services',
          source_url: LIVE_PROBES.legalAidHome.finalUrl,
          verification_status: 'verified',
          source_type: 'first_party_statewide_legal_aid_access',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.legalAidHome.evidence,
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'able_program',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed ABLE federal-crossover source remains intact in the program spine.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Missouri ABLE Program',
          source_url: 'https://www.ablenrc.org/',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
          evidence_snippet: 'Statewide ABLE crossover evidence remains reviewed and intact.',
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'ssi_ssa_federal_reference',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed SSA crossover source remains intact in the program spine.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'SSI for Children (Missouri)',
          source_url: 'https://www.ssa.gov/',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
          evidence_snippet: 'SSA crossover evidence remains reviewed and intact.',
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'county_local_disability_resources',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live Missouri DMH regional-office map exposes explicit county-selection and office-routing semantics in fetched HTML, which is enough to repair the stale third-party local-resource packet samples.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Missouri DD Regional Offices',
          source_url: LIVE_PROBES.ddRegionalOffices.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
          evidence_snippet: LIVE_PROBES.ddRegionalOffices.evidence,
        },
      ],
    },
  ];
}

function recalcSummary(summary, gapRows, failureRows, verifiedRows) {
  const criticalRows = gapRows.filter((row) => row.critical);
  const strong = criticalRows.filter((row) => String(row.family_status || '').startsWith('verified_')).length;
  const missing = criticalRows.filter((row) => String(row.family_status || '').startsWith('missing')).length;
  const weak = criticalRows.length - strong - missing;
  return {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: Math.floor((strong / criticalRows.length) * 100),
    strong_critical_families: strong,
    weak_critical_families: weak,
    missing_critical_families: missing,
    primary_gap_reason: 'official_dese_public_directory_postback_reaches_ssrs_shell_but_report_server_returns_404',
    recommended_batch: 'batch_2_repair_blocked',
    critical_gap_families: failureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: failureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    verified_source_families_with_samples: verifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: failureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Missouri California-Grade Audit Report v2',
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
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Completion decision',
    '',
    '- Missouri remains `BLOCKED` and `index_safe=false`.',
    '- PTI is now repaired through exact first-party MPACT browser evidence, including the explicit statement "We have been Missouri’s federally-funded Parent Training and Information Center since 1988."',
    '- Legal aid remains repaired through Missouri Legal Services and must not stay in the blocker summaries.',
    '- Education routing remains the only critical blocker because the exact DESE public School Directory bridge still fails one layer deeper than the login page: the replayed SSRS report shell returns "The request failed with HTTP status 404: Not Found."',
    '- The next honest Missouri lane is district-owned local leaf authoring, not more DESE root probing.',
    '',
    '## Missouri truth refresh decision',
    '',
    '- Missouri Medicaid state coverage stays verified only after replacing the old mixed-family packet evidence with exact live DSS Healthcare and Medicaid Annual Renewals leaves.',
    '- Missouri DD authority and waiver families stay verified only after replacing the dead dhhs.missouri.gov packet roots and stale hcbs/eligibility path with exact current DMH eligibility, waiver-enrollment, and waiver-program leaves.',
    '- Missouri early intervention upgrades because the reviewed live First Steps leaf now proves Part C, referral, parent information, and System Point of Entry routing from the DESE Office of Childhood.',
    '- Missouri special-education authority stays verified only after replacing the old generic DESE homepage sample with the exact Office of Special Education leaf.',
    '- Missouri vocational rehabilitation / Pre-ETS upgrades because reviewed DESE Vocational Rehabilitation and Youth Services leaves now provide statewide VR routing, office links, and explicit Pre-Employment Transition Services language for students with disabilities.',
    '- Missouri protection and advocacy upgrades to verified statewide evidence because the reviewed first-party Missouri Protection and Advocacy Services artifact explicitly says it is designated by the Governor as the Protection and Advocacy system for Missouri.',
    '- Missouri county-local disability resources stay verified because the live DMH regional-office page exposes county-selection and office-routing semantics directly in fetched HTML.',
    '- Missouri PTI upgrades because browser-assisted exact first-party MPACT review preserved both statewide help routing and explicit federally funded PTI designation evidence, even though the low-token fetch lane still records a Cloudflare 403 challenge shell.',
    '- Missouri legal aid stays verified because Missouri Legal Services already preserves a live first-party statewide legal-aid route on disk.',
    '- Missouri district-or-county education routing remains blocked, but the blocker is now sharper: DESE School Data exposes real public directory links, the public WebLogin bridge reaches a live SSRS shell, and the shell itself fails with report-server HTTP 404 before any county- or district-grade routing data loads.',
    '- Missouri is therefore still truthfully BLOCKED and not index-safe. After this bounded repair pass, district-or-county education routing is the only remaining final blocker.',
  ].join('\n') + '\n';
}

export function generateBatch45MissouriStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const priorityRows = readJsonl(INPUTS.priorityQueue);
  const acceptedRows = readJsonl(INPUTS.acceptedNonprofit);
  const moadvocacyHtml = readText(INPUTS.moadvocacyHtml);
  const resultsCsv = readText(INPUTS.sourceRunResultsCsv);

  assertIncludes(moadvocacyHtml, 'designated by the Governor as the Protection and Advocacy (P&amp;A) System for Missouri', 'Missouri P&A');
  assertIncludes(moadvocacyHtml, 'Request Help', 'Missouri P&A');
  assertIncludes(resultsCsv, 'https://ptimpact.org/,https://www.missouriparentsact.org/,403', 'Missouri PTI blocked fetch');

  const moadvocacyAccepted = findRow(
    acceptedRows,
    (row) => String(row.finalUrl || '').includes('moadvocacy.org'),
    'reviewed Missouri P&A accepted artifact',
  );
  if (moadvocacyAccepted.validationStatus !== 'accepted') {
    throw new Error('Missouri P&A artifact must remain accepted.');
  }

  const updatedVerifiedRows = buildVerifiedSourceRows();
  const statusByFamily = new Map(updatedVerifiedRows.map((row) => [row.family, row]));
  const reasonByFamily = {
    medicaid_state_health_coverage: 'Reviewed live DSS Healthcare and Medicaid Annual Renewals leaves now provide role-pure statewide Medicaid coverage evidence.',
    medicaid_waiver_hcbs_disability_services: 'Reviewed live DMH waiver-enrollment and Home & Community Based Waivers leaves replaced the stale hcbs/eligibility packet path.',
    developmental_disability_idd_authority: 'Reviewed live DMH eligibility and regional-office leaves replaced the dead dhhs.missouri.gov DD packet root.',
    early_intervention_part_c: 'Reviewed live Missouri First Steps leaf now provides role-aligned Part C / early-intervention, referral, and SPOE evidence.',
    special_education_idea_part_b: 'Reviewed live DESE Office of Special Education leaf replaced the old generic dese.mo.gov homepage sample.',
    district_or_county_education_routing: 'Missouri still lacks reviewed district-owned or county-grade education-routing leaves. DESE School Data exposes a real public School Directory bridge, but the exact public-applications replay only reaches an SSRS shell whose rendered non-report content fails with report-server HTTP 404.',
    vocational_rehabilitation_pre_ets: 'Reviewed live Missouri VR and Youth Services leaves now provide statewide VR routing plus explicit Pre-ETS evidence.',
    protection_and_advocacy: 'Reviewed first-party Missouri Protection and Advocacy Services evidence explicitly proves the statewide P&A role and help path.',
    parent_training_information_center: 'Reviewed browser-assisted first-party MPACT captures now preserve both statewide contact routing and explicit federally funded PTI designation evidence.',
    legal_aid: 'Reviewed Missouri Legal Services preserves a live first-party statewide legal-aid route on disk.',
    able_program: 'Statewide ABLE crossover evidence remains reviewed and intact.',
    ssi_ssa_federal_reference: 'SSA crossover evidence remains reviewed and intact.',
    county_local_disability_resources: 'Reviewed DMH regional-office map exposes county-selection and office-routing semantics directly in fetched HTML.',
  };

  const updatedGapRows = gapRows.map((row) => {
    const verified = statusByFamily.get(row.family);
    if (!verified) return row;
    return {
      ...row,
      family_status: verified.family_status,
      status_reason: reasonByFamily[row.family] || row.status_reason,
    };
  });

  const updatedFailureRows = [
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'official_dese_public_directory_postback_reaches_ssrs_shell_but_report_server_returns_404',
      evidence: 'Missouri district routing still lacks reviewed district-owned or county-grade leaves. The official DESE School Data page exposes real public School Directory links, but the exact WebLogin "View Public Applications" replay only reaches an SSRS shell whose rendered non-report content fails with "The request failed with HTTP status 404: Not Found."',
      next_action: 'author_missouri_district_owned_special_education_or_student_services_leaves_from_local_district_sites',
    },
  ];

  const updatedNextRows = updatedFailureRows.map((row, index) => ({
    state: row.state,
    state_code: row.state_code,
    priority_rank: index + 1,
    family: row.family,
    severity: row.severity,
    failure_code: row.failure_code,
    next_action: row.next_action,
    evidence: row.evidence,
  }));

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const refreshedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const updatedPriorityRows = priorityRows.map((row) => {
    if (row.state !== 'missouri') return row;
    return {
      ...row,
      classification: updatedSummary.classification,
      index_safe: updatedSummary.index_safe,
      completeness_pct: updatedSummary.completeness_pct,
      missing_critical_families: updatedSummary.missing_critical_families,
      weak_critical_families: updatedSummary.weak_critical_families,
      primary_gap_reason: updatedSummary.primary_gap_reason,
      repair_lane: 'repair_from_state_packet',
    };
  });

  writeJsonl(path.join(generatedDir, 'missouri_verified_sources_v1.jsonl'), updatedVerifiedRows);
  writeJsonl(path.join(generatedDir, 'missouri_gap_matrix_v2.jsonl'), updatedGapRows);
  writeJsonl(path.join(generatedDir, 'missouri_failure_ledger_v2.jsonl'), updatedFailureRows);
  writeJsonl(path.join(generatedDir, 'missouri_next_action_queue_v2.jsonl'), updatedNextRows);
  writeJsonl(INPUTS.priorityQueue, updatedPriorityRows);
  writeJson(path.join(generatedDir, 'missouri_california_grade_summary_v2.json'), updatedSummary);
  fs.writeFileSync(path.join(docsGeneratedDir, 'missouri-california-grade-audit-report-v2.md'), refreshedReport);

  const batchSummary = {
    state: 'missouri',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    strong_critical_families: updatedSummary.strong_critical_families,
    weak_critical_families: updatedSummary.weak_critical_families,
    missing_critical_families: updatedSummary.missing_critical_families,
    evidence_checks: {
      medicaidHealthcare: LIVE_PROBES.medicaidHealthcare,
      medicaidRenewals: LIVE_PROBES.medicaidRenewals,
      ddEligibility: LIVE_PROBES.ddEligibility,
      ddWaiverEnrollment: LIVE_PROBES.ddWaiverEnrollment,
      ddRegionalOffices: LIVE_PROBES.ddRegionalOffices,
      specialEducation: LIVE_PROBES.specialEducation,
      deseSchoolData: LIVE_PROBES.deseSchoolData,
      desePublicReportShell: LIVE_PROBES.desePublicReportShell,
      vrMain: LIVE_PROBES.vrMain,
      vrYouthServices: LIVE_PROBES.vrYouthServices,
      moadvocacyAcceptedFinalUrl: moadvocacyAccepted.finalUrl,
      ptiLowTokenBlocked: LIVE_PROBES.ptiLowTokenBlocked,
      ptiBrowserHome: LIVE_PROBES.ptiBrowserHome,
      ptiBrowserAbout: LIVE_PROBES.ptiBrowserAbout,
      legalAidHome: LIVE_PROBES.legalAidHome,
      legacyDdRoot: LIVE_PROBES.legacyDdRoot,
      legacyEarlyInterventionRoot: LIVE_PROBES.legacyEarlyInterventionRoot,
      vrEmploymentServices: LIVE_PROBES.vrEmploymentServices,
    },
  };

  writeJson(OUTPUTS.summary, batchSummary);
  writeJson(OUTPUTS.probes, LIVE_PROBES);
  fs.writeFileSync(OUTPUTS.report, refreshedReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch45MissouriStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
