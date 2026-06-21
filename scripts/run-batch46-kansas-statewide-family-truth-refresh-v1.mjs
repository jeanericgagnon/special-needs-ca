import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  acceptedNonprofit: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-43-25-503Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  drcHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-43-25-503Z', 'pages', '00003-kansas-nonprofit-support-drckansas-org.html'),
  ptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-43-25-503Z', 'pages', '00004-kansas-nonprofit-support-familiestogetherinc-org.html'),
  kdadsResultsCsv: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T00-08-20-551Z', 'results.csv'),
  kdadsDdResultsCsv: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T01-45-31-358Z', 'results.csv'),
  waitlistResultsCsv: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T00-16-10-127Z', 'results.csv'),
  formsResultsCsv: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-18T22-36-35-612Z', 'results.csv'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch46_kansas_statewide_family_truth_refresh_summary_v1.json'),
  probes: path.join(generatedDir, 'batch46_kansas_official_probe_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch46-kansas-statewide-family-truth-refresh-report-v1.md'),
};

const NEW_LESSON_HEADING = '### Explicit First-Party Designation Text Can Resolve Statewide Support Families';
const NEW_LESSON_BODY = [
  '*   **Problem:** Some state packets leave PTI, P&A, or similar statewide support families as `missing` or `inventory_only` even when a reviewed first-party artifact already states the exact statewide designation on the homepage or About surface.',
  '*   **Lesson:** When a reviewed first-party page explicitly says it is the federally designated PTI, the statewide protection-and-advocacy organization, or another exact statewide support authority, upgrade the family from that designation text directly. Do not keep the family blocked just because the old packet lacked a clean sample chain.',
].join('\n');

const LIVE_PROBES = {
  kancare: {
    url: 'https://www.kancare.ks.gov/',
    finalUrl: 'https://www.kancare.ks.gov/',
    status: 403,
    contentType: 'text/html',
    evidence: 'Reviewed 2026-06-21 live probe to the exact Kansas Medicaid root returned an Akamai-style "Access Denied" 403 challenge page instead of Medicaid content.',
  },
  kdadsRoot: {
    url: 'https://www.kdads.ks.gov/',
    finalUrl: 'https://www.kdads.ks.gov/',
    status: 403,
    contentType: 'text/html',
    evidence: 'Reviewed 2026-06-21 live probe to the exact KDADS root returned an Akamai-style "Access Denied" 403 challenge page instead of DD, waiver, or early-intervention content.',
  },
  kdadsWaiverEligibility: {
    url: 'https://www.kdads.ks.gov/hcbs/eligibility',
    finalUrl: 'https://www.kdads.ks.gov/hcbs/eligibility',
    status: 403,
    contentType: 'text/html',
    evidence: 'Reviewed 2026-06-21 live probe to the exact KDADS waiver eligibility leaf returned an Akamai-style "Access Denied" 403 challenge page.',
  },
  legacyDdRoot: {
    url: 'https://dhhs.kansas.gov/dd',
    finalUrl: '',
    status: 0,
    contentType: '',
    evidence: 'Reviewed 2026-06-21 live probe failed DNS resolution for dhhs.kansas.gov/dd, so the old packet DD root is dead.',
  },
  legacyEarlyStart: {
    url: 'https://dhhs.kansas.gov/earlystart',
    finalUrl: '',
    status: 0,
    contentType: '',
    evidence: 'Reviewed 2026-06-21 live probe failed DNS resolution for dhhs.kansas.gov/earlystart, so the old packet early-intervention root is dead.',
  },
  legacyLocations: {
    url: 'https://dhhs.kansas.gov/locations',
    finalUrl: '',
    status: 0,
    contentType: '',
    evidence: 'Reviewed 2026-06-21 live probe failed DNS resolution for dhhs.kansas.gov/locations, so the old county-local locator root is dead.',
  },
  ksdeSpecialEducation: {
    url: 'https://www.ksde.gov/policy-and-funding/special-education',
    finalUrl: 'https://www.ksde.gov/policy-and-funding/special-education',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the exact KSDE special-education leaf with title "Special Education" and H1 "Special Education."',
  },
  ksdeOldTab: {
    url: 'https://www.ksde.org/Default.aspx?tabid=101',
    finalUrl: 'https://www.ksde.gov/Default.aspx',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe to the old KSDE tab sample landed on the generic KSDE homepage, not a role-pure special-education leaf.',
  },
  dcfRehab: {
    url: 'https://www.dcf.ks.gov/services/RS/Pages/default.aspx',
    finalUrl: 'https://www.dcf.ks.gov/services/RS/Pages/default.aspx',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the official Kansas DCF Rehabilitation Services Program Overview page with action text including "Apply Now, Eligibility Status, and more" and linked RS services, contacts, and policies.',
  },
  kansasLegalServices: {
    url: 'https://www.kansaslegalservices.org/',
    finalUrl: 'https://www.kansaslegalservices.org/',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the Kansas Legal Services homepage stating it is "A non-profit law firm and community education organization helping low and moderate income people in Kansas."',
  },
  drcAbout: {
    url: 'https://www.drckansas.org/about',
    finalUrl: 'https://www.drckansas.org/about',
    status: 200,
    contentType: 'text/html;charset=utf-8',
    evidence: 'Reviewed 2026-06-21 live probe returned the DRC Kansas About page stating that DRC is a private non-profit organization with attorneys and advocates providing free advocacy and legal services for Kansans with disabilities.',
  },
  tinyK: {
    url: 'https://www.ksitsn.org/tiny-k/',
    finalUrl: '',
    status: 0,
    contentType: '',
    evidence: 'Reviewed 2026-06-21 bounded Part C repair probe to the likely Tiny-K root failed DNS resolution, so no reviewed role-aligned Kansas Part C replacement was captured.',
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

function ensureLesson() {
  const lessons = readText(INPUTS.lessons);
  if (lessons.includes(NEW_LESSON_HEADING)) {
    return;
  }
  const updated = `${lessons.trim()}\n\n${NEW_LESSON_HEADING}\n${NEW_LESSON_BODY}\n`;
  fs.writeFileSync(INPUTS.lessons, updated);
}

function buildVerifiedSourceRows() {
  return [
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'medicaid_state_health_coverage',
      family_status: 'blocked_live_medicaid_source_access_denied',
      evidence_strength: 'weak',
      sample_count: 0,
      query_basis: 'The old Kansas Medicaid packet mixed ABLE and KDADS rows into the Medicaid family, and the exact KanCare root now returns only a 403 challenge.',
      blocker_code: 'reviewed_exact_medicaid_root_access_blocked',
      blocker_evidence: LIVE_PROBES.kancare.evidence,
      samples: [],
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'medicaid_waiver_hcbs_disability_services',
      family_status: 'blocked_live_waiver_source_access_denied',
      evidence_strength: 'weak',
      sample_count: 0,
      query_basis: 'The exact Kansas HCBS waiver eligibility leaf now returns only a 403 challenge and no reviewed waiver content is preserved on disk.',
      blocker_code: 'reviewed_exact_waiver_leaf_access_blocked',
      blocker_evidence: LIVE_PROBES.kdadsWaiverEligibility.evidence,
      samples: [],
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'developmental_disability_idd_authority',
      family_status: 'blocked_live_dd_authority_source_access_denied',
      evidence_strength: 'weak',
      sample_count: 0,
      query_basis: 'The old dhhs.kansas.gov DD root is dead and the reviewed KDADS DD replacement remains challenge-blocked.',
      blocker_code: 'legacy_dd_root_dead_and_reviewed_replacement_access_blocked',
      blocker_evidence: `${LIVE_PROBES.legacyDdRoot.evidence} ${LIVE_PROBES.kdadsRoot.evidence}`,
      samples: [],
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'early_intervention_part_c',
      family_status: 'missing_reviewed_role_aligned_part_c_source',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'The old dhhs.kansas.gov early-start root is dead and the bounded Tiny-K probe did not produce a reviewed Part C replacement.',
      blocker_code: 'legacy_early_intervention_source_dead_and_no_reviewed_replacement',
      blocker_evidence: `${LIVE_PROBES.legacyEarlyStart.evidence} ${LIVE_PROBES.tinyK.evidence}`,
      samples: [],
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'special_education_idea_part_b',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live KSDE special-education leaf replaced the old generic KSDE homepage packet sample.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Kansas Special Education',
          source_url: LIVE_PROBES.ksdeSpecialEducation.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'district_or_county_education_routing',
      family_status: 'blocked_exact_district_or_county_leafs_unverified',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'Kansas still lacks reviewed district-owned or county-grade education leaves; only statewide KSDE evidence is currently verified.',
      blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
      blocker_evidence: 'Kansas district routing still collapses to statewide KSDE pages and generic district fallbacks; no reviewed district-owned or county-grade special-education leaf is preserved in the packet.',
      samples: [],
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'vocational_rehabilitation_pre_ets',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live Kansas DCF Rehabilitation Services Program Overview page now provides a role-pure statewide VR root instead of the old KDADS misclassification.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Kansas Rehabilitation Services Program Overview',
          source_url: LIVE_PROBES.dcfRehab.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'protection_and_advocacy',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party DRC Kansas evidence on disk plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights Center of Kansas',
          source_url: 'https://www.drckansas.org/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
        },
      ],
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'parent_training_information_center',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party Families Together evidence on disk explicitly states that it is Kansas’ federally designated Parent Training & Information Center.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Families Together, Inc.',
          source_url: 'https://familiestogetherinc.org/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
        },
      ],
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'legal_aid',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed live Kansas Legal Services root explicitly identifies itself as a non-profit law firm serving Kansans.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Kansas Legal Services',
          source_url: LIVE_PROBES.kansasLegalServices.finalUrl,
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'able_program',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed ABLE federal-crossover source remains intact in the program spine.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Kansas ABLE Program',
          source_url: 'https://www.ablenrc.org/',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
        },
      ],
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'ssi_ssa_federal_reference',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed SSA crossover source remains intact in the program spine.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'SSI for Children (Kansas)',
          source_url: 'https://www.ssa.gov/',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
        },
      ],
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'county_local_disability_resources',
      family_status: 'blocked_live_county_locator_source_dead_or_access_denied',
      evidence_strength: 'weak',
      sample_count: 0,
      query_basis: 'The old county-local locator root is dead and the reviewed KDADS replacement family remains challenge-blocked.',
      blocker_code: 'legacy_county_locator_dead_and_reviewed_replacement_access_blocked',
      blocker_evidence: `${LIVE_PROBES.legacyLocations.evidence} ${LIVE_PROBES.kdadsRoot.evidence}`,
      samples: [],
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
    primary_gap_reason: 'official_medicaid_kdads_stack_blocked_and_county_grade_local_district_proof_unverified',
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
    '# Kansas California-Grade Audit Report v2',
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
    '## Kansas truth refresh decision',
    '',
    '- Kansas special-education authority upgrades only after replacing the old generic KSDE homepage sample with the exact KSDE Special Education leaf.',
    '- Kansas statewide support improves materially: Disability Rights Center of Kansas now upgrades the P&A family, Families Together upgrades the PTI family because the reviewed first-party homepage explicitly says it is Kansas’ federally designated PTI, and Kansas Legal Services upgrades the legal-aid family from live first-party evidence.',
    '- Kansas VR / Pre-ETS upgrades only after replacing the old KDADS misclassification with the live DCF Rehabilitation Services Program Overview page.',
    '- Kansas Medicaid, waiver, and DD authority families do not stay verified because the reviewed exact official roots now return only challenge-blocked 403 pages, while the legacy dhhs.kansas.gov roots are dead.',
    '- Kansas early intervention remains missing because the old early-start root is dead and the bounded Tiny-K repair probe did not yield a reviewed Part C replacement.',
    '- Kansas county-local disability resources remain blocked because the old county locator root is dead and no reviewed live official county-grade replacement was captured.',
    '- Kansas district-or-county education routing remains blocked because no reviewed district-owned or county-grade special-education leaves replace the statewide fallback.',
    '- Kansas is therefore truthfully BLOCKED and not index-safe. The packet is cleaner and more useful, but California-grade completion still requires reviewed official Medicaid/KDADS access, a reviewed Part C source, and county-grade district/local routing proof.',
  ].join('\n') + '\n';
}

export function generateBatch46KansasStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const acceptedRows = readJsonl(INPUTS.acceptedNonprofit);
  const drcHtml = readText(INPUTS.drcHtml);
  const ptiHtml = readText(INPUTS.ptiHtml);
  const kdadsResults = readText(INPUTS.kdadsResultsCsv);
  const kdadsDdResults = readText(INPUTS.kdadsDdResultsCsv);
  const waitlistResults = readText(INPUTS.waitlistResultsCsv);
  const formsResults = readText(INPUTS.formsResultsCsv);

  assertIncludes(drcHtml, 'Get Help', 'Kansas P&A');
  assertIncludes(ptiHtml, 'federally designated Parent Training &amp; Information Center (PTI)', 'Kansas PTI');
  assertIncludes(kdadsResults, 'https://www.kancare.ks.gov/,https://www.kancare.ks.gov/,403', 'Kansas KanCare blocked fetch');
  assertIncludes(kdadsResults, 'https://www.kdads.ks.gov/,https://www.kdads.ks.gov/,403', 'Kansas KDADS blocked fetch');
  assertIncludes(kdadsDdResults, 'https://www.kdads.ks.gov/developmental-disabilities,https://www.kdads.ks.gov/developmental-disabilities,403', 'Kansas KDADS DD blocked fetch');
  assertIncludes(waitlistResults, 'https://www.kancare.ks.gov/,https://www.kancare.ks.gov/,403', 'Kansas waitlist KanCare blocked fetch');
  assertIncludes(formsResults, 'https://www.kdads.ks.gov/,https://www.kdads.ks.gov/,403', 'Kansas forms KDADS blocked fetch');

  const drcAccepted = findRow(
    acceptedRows,
    (row) => String(row.finalUrl || '').includes('drckansas.org'),
    'reviewed DRC Kansas accepted artifact',
  );
  const ptiAccepted = findRow(
    acceptedRows,
    (row) => String(row.finalUrl || '').includes('familiestogetherinc.org'),
    'reviewed Families Together accepted artifact',
  );
  if (drcAccepted.validationStatus !== 'accepted') {
    throw new Error('Kansas P&A artifact must remain accepted.');
  }
  if (ptiAccepted.validationStatus !== 'accepted') {
    throw new Error('Kansas PTI artifact must remain accepted.');
  }

  const updatedVerifiedRows = buildVerifiedSourceRows();
  const statusByFamily = new Map(updatedVerifiedRows.map((row) => [row.family, row]));
  const reasonByFamily = {
    medicaid_state_health_coverage: 'The reviewed exact KanCare Medicaid root is challenge-blocked and the old packet also mixed unrelated ABLE and KDADS rows into the Medicaid family.',
    medicaid_waiver_hcbs_disability_services: 'The reviewed exact KDADS waiver eligibility leaf is challenge-blocked and no reviewed waiver content is preserved on disk.',
    developmental_disability_idd_authority: 'The old dhhs.kansas.gov DD root is dead and the reviewed KDADS DD replacement remains challenge-blocked.',
    early_intervention_part_c: 'The old dhhs.kansas.gov early-start root is dead and the bounded Tiny-K repair probe did not yield a reviewed Part C replacement.',
    special_education_idea_part_b: 'Reviewed live KSDE Special Education leaf replaced the old generic KSDE homepage sample.',
    district_or_county_education_routing: 'Kansas still lacks reviewed district-owned or county-grade special-education leaves; only statewide KSDE evidence is currently verified.',
    vocational_rehabilitation_pre_ets: 'Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.',
    protection_and_advocacy: 'Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.',
    parent_training_information_center: 'Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.',
    legal_aid: 'Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.',
    able_program: 'Statewide ABLE crossover evidence remains reviewed and intact.',
    ssi_ssa_federal_reference: 'SSA crossover evidence remains reviewed and intact.',
    county_local_disability_resources: 'The old county-local locator root is dead and no reviewed live official county-grade replacement was captured.',
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
      state: 'kansas',
      state_code: 'KS',
      family: 'medicaid_state_health_coverage',
      severity: 'critical',
      failure_code: 'reviewed_exact_medicaid_root_access_blocked',
      evidence: LIVE_PROBES.kancare.evidence,
      next_action: 'browser_assisted_or_reviewed_alt_official_medicaid_leaf',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'medicaid_waiver_hcbs_disability_services',
      severity: 'critical',
      failure_code: 'reviewed_exact_waiver_leaf_access_blocked',
      evidence: LIVE_PROBES.kdadsWaiverEligibility.evidence,
      next_action: 'browser_assisted_or_reviewed_alt_official_waiver_leaf',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'developmental_disability_idd_authority',
      severity: 'critical',
      failure_code: 'legacy_dd_root_dead_and_reviewed_replacement_access_blocked',
      evidence: `${LIVE_PROBES.legacyDdRoot.evidence} ${LIVE_PROBES.kdadsRoot.evidence}`,
      next_action: 'browser_assisted_or_reviewed_alt_official_dd_leaf',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'early_intervention_part_c',
      severity: 'critical',
      failure_code: 'legacy_early_intervention_source_dead_and_no_reviewed_replacement',
      evidence: `${LIVE_PROBES.legacyEarlyStart.evidence} ${LIVE_PROBES.tinyK.evidence}`,
      next_action: 'author_or_review_current_official_part_c_source',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      evidence: 'Kansas district routing still depends on statewide KSDE pages and generic district fallbacks; no reviewed district-owned or county-grade special-education leaf is on disk.',
      next_action: 'author_county_or_district_exact_targets',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'legacy_county_locator_dead_and_reviewed_replacement_access_blocked',
      evidence: `${LIVE_PROBES.legacyLocations.evidence} ${LIVE_PROBES.kdadsRoot.evidence}`,
      next_action: 'author_county_local_exact_targets',
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

  writeJsonl(path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'), updatedVerifiedRows);
  writeJsonl(path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'), updatedGapRows);
  writeJsonl(path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'), updatedFailureRows);
  writeJsonl(path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'), updatedNextRows);
  writeJson(path.join(generatedDir, 'kansas_california_grade_summary_v2.json'), updatedSummary);
  fs.writeFileSync(path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'), refreshedReport);

  ensureLesson();

  const batchSummary = {
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    strong_critical_families: updatedSummary.strong_critical_families,
    weak_critical_families: updatedSummary.weak_critical_families,
    missing_critical_families: updatedSummary.missing_critical_families,
    evidence_checks: {
      kancare: LIVE_PROBES.kancare,
      kdadsRoot: LIVE_PROBES.kdadsRoot,
      kdadsWaiverEligibility: LIVE_PROBES.kdadsWaiverEligibility,
      ksdeSpecialEducation: LIVE_PROBES.ksdeSpecialEducation,
      ksdeOldTab: LIVE_PROBES.ksdeOldTab,
      dcfRehab: LIVE_PROBES.dcfRehab,
      kansasLegalServices: LIVE_PROBES.kansasLegalServices,
      drcAbout: LIVE_PROBES.drcAbout,
      drcAcceptedFinalUrl: drcAccepted.finalUrl,
      ptiAcceptedFinalUrl: ptiAccepted.finalUrl,
      legacyDdRoot: LIVE_PROBES.legacyDdRoot,
      legacyEarlyStart: LIVE_PROBES.legacyEarlyStart,
      legacyLocations: LIVE_PROBES.legacyLocations,
      tinyK: LIVE_PROBES.tinyK,
    },
  };

  writeJson(OUTPUTS.summary, batchSummary);
  writeJson(OUTPUTS.probes, LIVE_PROBES);
  fs.writeFileSync(OUTPUTS.report, refreshedReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch46KansasStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
