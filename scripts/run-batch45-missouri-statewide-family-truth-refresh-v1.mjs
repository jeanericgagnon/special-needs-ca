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
  verified: path.join(generatedDir, 'missouri_verified_sources_v1.jsonl'),
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
  ptiBlocked: {
    url: 'https://ptimpact.org/',
    finalUrl: 'https://www.missouriparentsact.org/',
    status: 403,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-20 low-token fetch followed ptimpact.org to missouriparentsact.org and received HTTP 403, so the exact statewide PTI candidate could not be verified from fetched first-party evidence.',
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
        },
        {
          sample_name: 'Missouri Medicaid Annual Renewals',
          source_url: LIVE_PROBES.medicaidRenewals.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
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
        },
        {
          sample_name: 'Missouri Home & Community Based Waivers',
          source_url: LIVE_PROBES.ddWaiverPrograms.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
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
        },
        {
          sample_name: 'Missouri DD Regional Offices',
          source_url: LIVE_PROBES.ddRegionalOffices.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
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
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'district_or_county_education_routing',
      family_status: 'blocked_exact_district_or_county_leafs_unverified',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'Missouri still lacks reviewed district-owned or county-grade education leaves; only state-level DESE evidence is currently verified.',
      blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
      blocker_evidence: 'Missouri district routing still collapses to statewide DESE pages and directory roots; no reviewed district-owned or county-grade special-education leaf is preserved in the packet.',
      samples: [],
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
        },
        {
          sample_name: 'Missouri VR Youth Services',
          source_url: LIVE_PROBES.vrYouthServices.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
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
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'parent_training_information_center',
      family_status: 'blocked_exact_statewide_pti_source_access_blocked',
      evidence_strength: 'weak',
      sample_count: 1,
      query_basis: 'The packet PTI sample points to ptimpact.org / Missouri Parents Act, but the reviewed low-token fetch hit a 403 on the exact first-party target.',
      blocker_code: 'reviewed_exact_statewide_pti_target_access_blocked',
      blocker_evidence: LIVE_PROBES.ptiBlocked.evidence,
      samples: [
        {
          sample_name: 'Missouri Parents Act (MPACT)',
          source_url: LIVE_PROBES.ptiBlocked.url,
          verification_status: 'blocked',
          source_type: 'official',
          source_table: 'reviewed_low_token_fetch',
        },
      ],
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'legal_aid',
      family_status: 'missing_reviewed_statewide_legal_aid_source',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'No reviewed statewide Missouri legal-aid source is present in the current packet artifacts.',
      blocker_code: 'missing_required_source_family',
      blocker_evidence: 'Missouri still lacks a reviewed statewide legal-aid source on disk.',
      samples: [],
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
    primary_gap_reason: 'district_grade_education_and_statewide_support_gaps_remain_after_live_official_repair',
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
    '## Missouri truth refresh decision',
    '',
    '- Missouri Medicaid state coverage stays verified only after replacing the old mixed-family packet evidence with exact live DSS Healthcare and Medicaid Annual Renewals leaves.',
    '- Missouri DD authority and waiver families stay verified only after replacing the dead dhhs.missouri.gov packet roots and stale hcbs/eligibility path with exact current DMH eligibility, waiver-enrollment, and waiver-program leaves.',
    '- Missouri early intervention upgrades because the reviewed live First Steps leaf now proves Part C, referral, parent information, and System Point of Entry routing from the DESE Office of Childhood.',
    '- Missouri special-education authority stays verified only after replacing the old generic DESE homepage sample with the exact Office of Special Education leaf.',
    '- Missouri vocational rehabilitation / Pre-ETS upgrades because reviewed DESE Vocational Rehabilitation and Youth Services leaves now provide statewide VR routing, office links, and explicit Pre-Employment Transition Services language for students with disabilities.',
    '- Missouri protection and advocacy upgrades to verified statewide evidence because the reviewed first-party Missouri Protection and Advocacy Services artifact explicitly says it is designated by the Governor as the Protection and Advocacy system for Missouri.',
    '- Missouri county-local disability resources upgrade from stale structural evidence because the live DMH regional-office page exposes county-selection and office-routing semantics directly in fetched HTML.',
    '- Missouri district-or-county education routing remains blocked because no reviewed district-owned or county-grade special-education leaves replace the generic statewide DESE routing fallback.',
    '- Missouri PTI remains blocked because the exact Missouri Parents Act / MPACT candidate redirected to missouriparentsact.org and returned HTTP 403 in the reviewed low-token fetch lane.',
    '- Missouri legal aid remains missing because no reviewed statewide legal-aid source is present on disk.',
    '- Missouri is therefore still truthfully BLOCKED and not index-safe. The statewide packet now preserves repaired First Steps and VR / Pre-ETS evidence, but California-grade completion still requires district-grade education routing, PTI access, and legal-aid coverage.',
  ].join('\n') + '\n';
}

export function generateBatch45MissouriStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
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
    district_or_county_education_routing: 'Missouri still lacks reviewed district-owned or county-grade special-education leaves; only statewide DESE routing is currently verified.',
    vocational_rehabilitation_pre_ets: 'Reviewed live Missouri VR and Youth Services leaves now provide statewide VR routing plus explicit Pre-ETS evidence.',
    protection_and_advocacy: 'Reviewed first-party Missouri Protection and Advocacy Services evidence explicitly proves the statewide P&A role and help path.',
    parent_training_information_center: 'The exact Missouri Parents Act / MPACT candidate is known, but the reviewed first-party fetch to missouriparentsact.org is access-blocked.',
    legal_aid: 'No reviewed statewide legal-aid source is present in the current Missouri packet.',
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
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      evidence: 'Missouri district routing still depends on statewide DESE pages and directory roots; no reviewed district-owned or county-grade special-education leaf is on disk.',
      next_action: 'author_county_or_district_exact_targets',
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'parent_training_information_center',
      severity: 'major',
      failure_code: 'reviewed_exact_statewide_pti_target_access_blocked',
      evidence: LIVE_PROBES.ptiBlocked.evidence,
      next_action: 'browser_or_manual_review_on_first_party_pti_domain',
    },
    {
      state: 'missouri',
      state_code: 'MO',
      family: 'legal_aid',
      severity: 'major',
      failure_code: 'missing_required_source_family',
      evidence: 'Missouri still lacks a reviewed statewide legal-aid source on disk.',
      next_action: 'author_or_review_statewide_legal_aid_source',
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

  writeJsonl(path.join(generatedDir, 'missouri_verified_sources_v1.jsonl'), updatedVerifiedRows);
  writeJsonl(path.join(generatedDir, 'missouri_gap_matrix_v2.jsonl'), updatedGapRows);
  writeJsonl(path.join(generatedDir, 'missouri_failure_ledger_v2.jsonl'), updatedFailureRows);
  writeJsonl(path.join(generatedDir, 'missouri_next_action_queue_v2.jsonl'), updatedNextRows);
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
      vrMain: LIVE_PROBES.vrMain,
      vrYouthServices: LIVE_PROBES.vrYouthServices,
      moadvocacyAcceptedFinalUrl: moadvocacyAccepted.finalUrl,
      ptiBlocked: LIVE_PROBES.ptiBlocked,
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
