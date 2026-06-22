import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kentucky_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kentucky_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'kentucky_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kentucky_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'kentucky_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'kentucky-california-grade-audit-report-v2.md'),
  acceptedNonprofit: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T01-29-22-722Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  kypaHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T01-29-22-722Z', 'pages', '00007-kentucky-nonprofit-support-kypa-net.html'),
  kyspinHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T01-29-22-722Z', 'pages', '00009-kentucky-nonprofit-support-kyspin-com.html'),
  ddShellHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T00-31-32-493Z', 'pages', '00002-kentucky-dd-routing-kentucky-department-for-behavioral-health-developmental-and-intellectual-disabil.html'),
  waiverShellHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-18T23-18-00-538Z', 'pages', '00033-kentucky-programs-benefits-kentucky-hcbs-waivers.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch44_kentucky_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch44-kentucky-statewide-family-truth-refresh-report-v1.md'),
  probes: path.join(generatedDir, 'batch44_kentucky_official_probe_summary_v1.json'),
};

const LIVE_PROBES = {
  medicaid: {
    url: 'https://www.chfs.ky.gov/agencies/dms/Pages/default.aspx',
    finalUrl: 'https://www.chfs.ky.gov/agencies/dms/Pages/default.aspx',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 targeted live probe returned HTTP 200 for the official Kentucky Department for Medicaid Services leaf with Medicaid program navigation and member information links.',
  },
  specialEducation: {
    url: 'https://education.ky.gov/specialed/Pages/default.aspx',
    finalUrl: 'https://www.education.ky.gov/specialed/Pages/default.aspx',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 targeted live probe returned HTTP 200 for the KDE Exceptional Children and Early Learning leaf with special-education and dispute-resolution navigation.',
  },
  ddAuthority: {
    url: 'https://dbhdid.ky.gov/ddid',
    finalUrl: 'https://dbhdid.ky.gov/ddid',
    status: 200,
    contentType: 'text/html',
    evidence: 'Reviewed 2026-06-21 Playwright render returned only "Loading to Department for Behavioral Health page." with no headings, contact signals, or role-aligned DD routing content.',
  },
  waiver: {
    url: 'https://www.chfs.ky.gov/agencies/dms/dca/Pages/HCBSWaiverPrograms.aspx',
    finalUrl: 'https://www.chfs.ky.gov/agencies/dms/dca/Pages/HCBSWaiverPrograms.aspx',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 targeted live probe returned HTTP 200 for the official Kentucky HCBS Waiver Programs leaf with waiver descriptions and contact/state operating agency routing.',
  },
  earlyIntervention: {
    url: 'https://www.chfs.ky.gov/agencies/dph/dmch/ecdb/Pages/keis.aspx',
    finalUrl: 'https://www.chfs.ky.gov/agencies/dph/dmch/ecdb/Pages/keis.aspx',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    evidence: 'Reviewed 2026-06-21 targeted live probe returned HTTP 200 for the official Kentucky Early Intervention System leaf with Part C / First Steps program language and point-of-entry routing.',
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

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
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
      state: 'kentucky',
      state_code: 'KY',
      family: 'medicaid_state_health_coverage',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 2,
      query_basis: 'Reviewed 2026-06-21 live CHFS / DMS leaves now provide role-pure Kentucky Medicaid authority and member-information evidence.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Kentucky Department for Medicaid Services',
          source_url: 'https://www.chfs.ky.gov/agencies/dms/Pages/default.aspx',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
        {
          sample_name: 'Kentucky Medicaid Member Information',
          source_url: 'https://www.chfs.ky.gov/agencies/dms/member/Pages/default.aspx',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'medicaid_waiver_hcbs_disability_services',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed 2026-06-21 official HCBS Waiver Programs leaf now provides role-pure Kentucky waiver program and contact evidence without relying on the DBHDID JavaScript shell.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Kentucky HCBS Waiver Programs',
          source_url: 'https://www.chfs.ky.gov/agencies/dms/dca/Pages/HCBSWaiverPrograms.aspx',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'developmental_disability_idd_authority',
      family_status: 'blocked_js_shell_dd_authority_target_unverified',
      evidence_strength: 'weak',
      sample_count: 0,
      query_basis: 'The stale dhhs.kentucky.gov DD packet URL was replaced by dbhdid.ky.gov/ddid, but the reviewed Playwright render still produced only a loading shell.',
      blocker_code: 'reviewed_exact_target_only_returns_js_loading_shell',
      blocker_evidence: LIVE_PROBES.ddAuthority.evidence,
      samples: [],
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'early_intervention_part_c',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed 2026-06-21 official Kentucky Early Intervention System leaf provides current Part C / First Steps and point-of-entry routing evidence.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Kentucky Early Intervention System (KEIS)',
          source_url: 'https://www.chfs.ky.gov/agencies/dph/dmch/ecdb/Pages/keis.aspx',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'special_education_idea_part_b',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed 2026-06-21 KDE Exceptional Children and Early Learning leaf now provides live state special-education authority evidence.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'KDE Exceptional Children and Early Learning',
          source_url: 'https://education.ky.gov/specialed/Pages/default.aspx',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_live_probe',
        },
      ],
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'district_or_county_education_routing',
      family_status: 'blocked_exact_leaf_repair_not_started',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'The packet still relies on generic statewide KDE evidence for district rows and no reviewed county- or district-owned exact leaves are on disk.',
      blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
      blocker_evidence: 'Kentucky district routing still collapses to generic statewide KDE fallback rows; no reviewed county- or district-owned special-education leaves have replaced them.',
      samples: [],
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'vocational_rehabilitation_pre_ets',
      family_status: 'missing_reviewed_vr_or_pre_ets_source',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'The only old packet sample was the DBHDID root, which is not a vocational rehabilitation or Pre-ETS source.',
      blocker_code: 'legacy_or_wrong_family_vr_sample',
      blocker_evidence: 'Kentucky\'s old VR / Pre-ETS family used the DBHDID root as evidence. That source is DD-related and does not prove vocational rehabilitation or Pre-ETS routing.',
      samples: [],
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'protection_and_advocacy',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party KYPA artifact on disk explicitly states that Kentucky Protection and Advocacy is the designated protection and advocacy system in Kentucky and exposes Get Help / information and referrals routing.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Kentucky Protection & Advocacy',
          source_url: 'https://kypa.net/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
        },
      ],
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'parent_training_information_center',
      family_status: 'blocked_reviewed_parent_support_source_not_explicit_pti',
      evidence_strength: 'weak',
      sample_count: 1,
      query_basis: 'Reviewed KY-SPIN first-party homepage exists on disk, but the fetched evidence proves statewide parent support rather than explicit PTI designation.',
      blocker_code: 'reviewed_statewide_parent_support_source_not_explicit_pti',
      blocker_evidence: 'KY-SPIN is a real statewide first-party organization, but the reviewed homepage only proves statewide parent-support and resource-linking scope, not explicit PTI / Parent Training and Information Center designation.',
      samples: [
        {
          sample_name: 'KY-SPIN',
          source_url: 'https://www.kyspin.com/',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
        },
      ],
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'legal_aid',
      family_status: 'missing_reviewed_statewide_legal_aid_source',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'No reviewed statewide Kentucky legal-aid source is present in the current packet artifacts.',
      blocker_code: 'missing_required_source_family',
      blocker_evidence: 'Kentucky still lacks a reviewed statewide legal-aid source on disk.',
      samples: [],
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'able_program',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed ABLE federal-crossover source remains intact in the program spine.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Kentucky ABLE Program',
          source_url: 'https://www.ablenrc.org/',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
        },
      ],
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'ssi_ssa_federal_reference',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed SSA crossover source remains intact in the program spine.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'SSI for Children (Kentucky)',
          source_url: 'https://www.ssa.gov/',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
        },
      ],
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'county_local_disability_resources',
      family_status: 'blocked_generic_or_third_party_local_directory_only',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'The packet still relies on stale dhhs.kentucky.gov/locations or third-party DOI mirror rows rather than live county-grade official office leaves.',
      blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
      blocker_evidence: 'Kentucky county-local routing still depends on a stale fake-domain locator path or DOI mirror references, not reviewed county-grade official office pages.',
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
    primary_gap_reason: 'stale_statewide_packet_evidence_failed_live_truth_refresh_and_county_grade_local_leafs_remain_unverified',
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
    '# Kentucky California-Grade Audit Report v2',
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
    '## Kentucky truth refresh decision',
    '',
    '- Kentucky Medicaid state coverage upgrades because reviewed live CHFS / DMS leaves now provide role-pure statewide Medicaid authority and member-information evidence.',
    '- Kentucky waiver coverage upgrades because reviewed live HCBS Waiver Programs evidence now proves statewide waiver entry and program routing without relying on the DBHDID JavaScript shell.',
    '- Protection and advocacy upgrades to verified statewide evidence because the reviewed first-party KYPA page explicitly says Kentucky Protection and Advocacy is the designated protection and advocacy system in Kentucky and exposes a Get Help / Information & Referrals route.',
    '- Parent training information center does not upgrade even though KY-SPIN is real and statewide. The reviewed homepage proves parent-support and resource-linking scope, but it does not explicitly prove PTI designation.',
    '- Kentucky DD authority remains blocked because the reviewed exact DBHDID replacement still returns only a loading shell with no headings, contact signals, or role-aligned DD routing content.',
    '- Kentucky early intervention upgrades because the reviewed live Kentucky Early Intervention System leaf preserves current Part C / First Steps and point-of-entry routing evidence.',
    '- Kentucky special-education authority upgrades because the reviewed live KDE Exceptional Children and Early Learning leaf now provides a current state special-education authority source.',
    '- Kentucky district/county education routing remains blocked because no reviewed county- or district-owned special-education leaves replace the generic statewide KDE fallback rows.',
    '- Kentucky county-local disability resources remain blocked because the packet still depends on stale fake-domain locator evidence or DOI mirror rows instead of reviewed county-grade office leaves.',
    '- Kentucky legal aid remains missing because no reviewed statewide legal-aid source is present in the current packet artifacts.',
    '- Kentucky is therefore still truthfully BLOCKED and not index-safe. The statewide packet now carries repaired official evidence for Medicaid, waivers, Part C, and state special education, but county-grade routing and DD authority blockers still prevent California-grade completion.',
  ].join('\n') + '\n';
}

export function generateBatch44KentuckyStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const acceptedRows = readJsonl(INPUTS.acceptedNonprofit);
  const kypaHtml = readText(INPUTS.kypaHtml);
  const kyspinHtml = readText(INPUTS.kyspinHtml);
  const ddShellHtml = readText(INPUTS.ddShellHtml);
  const waiverShellHtml = readText(INPUTS.waiverShellHtml);

  assertIncludes(kypaHtml, 'designated protection and advocacy system in Kentucky', 'KYPA');
  assertIncludes(kypaHtml, 'Get Help', 'KYPA');
  assertIncludes(kyspinHtml, 'KY-SPIN, Inc. (Kentucky Special Parent Involvement Network) is a statewide 501(c) 3 non-profit organization.', 'KY-SPIN');
  assertIncludes(ddShellHtml, 'You need to enable JavaScript to run this app.', 'Kentucky DD shell');
  assertIncludes(waiverShellHtml, 'You need to enable JavaScript to run this app.', 'Kentucky HCBS shell');

  const kypaAccepted = findRow(
    acceptedRows,
    (row) => String(row.finalUrl || '').includes('kypa.net'),
    'reviewed KYPA accepted artifact',
  );
  const kyspinAccepted = findRow(
    acceptedRows,
    (row) => String(row.finalUrl || '').includes('kyspin.com'),
    'reviewed KY-SPIN accepted artifact',
  );
  if (kypaAccepted.validationStatus !== 'accepted') {
    throw new Error('KYPA first-party artifact must remain accepted.');
  }
  if (kyspinAccepted.validationStatus !== 'accepted') {
    throw new Error('KY-SPIN first-party artifact must remain accepted.');
  }

  const updatedVerifiedRows = buildVerifiedSourceRows();
  const statusByFamily = new Map(updatedVerifiedRows.map((row) => [row.family, row]));

  const reasonByFamily = {
    medicaid_state_health_coverage: 'Reviewed live CHFS / DMS leaves now provide role-pure statewide Kentucky Medicaid coverage evidence.',
    medicaid_waiver_hcbs_disability_services: 'Reviewed live HCBS Waiver Programs leaf now provides role-pure statewide Kentucky waiver entry evidence.',
    developmental_disability_idd_authority: 'The stale dhhs.kentucky.gov DD source was replaced by dbhdid.ky.gov/ddid, but the reviewed exact target still renders only a loading shell with no DD routing proof.',
    early_intervention_part_c: 'Reviewed live Kentucky Early Intervention System leaf now provides role-aligned Part C / First Steps evidence.',
    special_education_idea_part_b: 'Reviewed live KDE Exceptional Children and Early Learning leaf now provides current state special-education authority evidence.',
    district_or_county_education_routing: 'Generic statewide KDE fallback rows are still standing in for county- or district-owned routing evidence.',
    vocational_rehabilitation_pre_ets: 'The old packet sample was a DD program root, not a reviewed vocational rehabilitation or Pre-ETS source.',
    protection_and_advocacy: 'Reviewed KYPA first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and help path.',
    parent_training_information_center: 'Reviewed KY-SPIN evidence proves statewide parent support, but not explicit PTI designation.',
    legal_aid: 'No reviewed statewide legal-aid source is present in the current Kentucky packet.',
    able_program: 'Statewide ABLE crossover evidence remains reviewed and intact.',
    ssi_ssa_federal_reference: 'SSA crossover evidence remains reviewed and intact.',
    county_local_disability_resources: 'County-local packet rows still rely on stale fake-domain locator evidence or DOI mirror rows rather than live county-grade official office leaves.',
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
      state: 'kentucky',
      state_code: 'KY',
      family: 'developmental_disability_idd_authority',
      severity: 'critical',
      failure_code: 'reviewed_exact_target_only_returns_js_loading_shell',
      evidence: LIVE_PROBES.ddAuthority.evidence,
      next_action: 'browser_assisted_or_api_backed_dbhdid_dd_capture',
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      evidence: 'Kentucky district routing still depends on generic statewide KDE fallback rows; no reviewed county- or district-owned special-education leaves are on disk.',
      next_action: 'author_county_or_district_exact_targets',
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'vocational_rehabilitation_pre_ets',
      severity: 'major',
      failure_code: 'legacy_or_wrong_family_vr_sample',
      evidence: 'The old packet used the DBHDID root as VR / Pre-ETS evidence, but that source is DD-related and does not prove vocational rehabilitation routing.',
      next_action: 'author_or_review_statewide_vr_pre_ets_source',
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'parent_training_information_center',
      severity: 'major',
      failure_code: 'reviewed_statewide_parent_support_source_not_explicit_pti',
      evidence: 'KY-SPIN is reviewed and statewide, but the fetched homepage proves parent-support and resource-linking scope rather than explicit PTI designation.',
      next_action: 'author_or_review_designated_statewide_pti_source',
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'legal_aid',
      severity: 'major',
      failure_code: 'missing_required_source_family',
      evidence: 'No reviewed statewide Kentucky legal-aid source exists in the current packet artifacts.',
      next_action: 'author_or_review_statewide_legal_aid_source',
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      evidence: 'County-local packet rows still rely on stale fake-domain locator evidence or DOI mirror rows instead of reviewed county-grade official office leaves.',
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
  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const outputSummary = {
    state: 'kentucky',
    classification: updatedSummary.classification,
    completeness_pct: updatedSummary.completeness_pct,
    strong_critical_families: updatedSummary.strong_critical_families,
    weak_critical_families: updatedSummary.weak_critical_families,
    missing_critical_families: updatedSummary.missing_critical_families,
    updated_families: updatedVerifiedRows.map((row) => ({
      family: row.family,
      family_status: row.family_status,
      sample_count: row.sample_count,
    })),
    evidence_checks: {
      kypaAcceptedRecordId: kypaAccepted.recordId,
      kyspinAcceptedRecordId: kyspinAccepted.recordId,
      medicaidProbe: LIVE_PROBES.medicaid,
      earlyInterventionProbe: LIVE_PROBES.earlyIntervention,
      specialEducationProbe: LIVE_PROBES.specialEducation,
      ddAuthorityProbe: LIVE_PROBES.ddAuthority,
      waiverProbe: LIVE_PROBES.waiver,
    },
  };

  writeJson(OUTPUTS.summary, outputSummary);
  writeJson(OUTPUTS.probes, LIVE_PROBES);
  fs.writeFileSync(OUTPUTS.report, updatedReport);
  return outputSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch44KentuckyStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify({ ok: true, ...result }, null, 2));
}
