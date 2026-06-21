import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const DB_PATH = path.join(repoRoot, 'ca_disability_navigator.db');

const INPUTS = {
  summary: path.join(generatedDir, 'new-mexico_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-mexico_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-mexico_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-mexico_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-mexico_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'new-mexico-california-grade-audit-report-v2.md'),
  nmRejected: path.join(generatedDir, 'nm_rejected_scrapes_v1.jsonl'),
  nmBlocked: path.join(generatedDir, 'nm_blocked_scrapes_v1.jsonl'),
  drnmAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-05-931Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  drnmHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-05-931Z', 'pages', '00005-new-mexico-nonprofit-support-drnm-org.html'),
  parentsHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-05-931Z', 'pages', '00008-new-mexico-nonprofit-support-parentsreachingout-org.html'),
  ddSavedHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-17T16-58-43-900Z', 'pages', '02900-new-mexico-programs-benefits-new-mexico-hcbs-waivers.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch43_new_mexico_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch43-new-mexico-statewide-family-truth-refresh-report-v1.md'),
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

function queryRegionalEducationSample() {
  const db = new Database(DB_PATH, { readonly: true });
  try {
    const row = db.prepare(`
      SELECT
        id,
        name,
        source_url,
        website,
        verification_status,
        source_type
      FROM regional_education_agencies
      WHERE state_id = 'new-mexico'
      ORDER BY CASE WHEN verification_status = 'official_verified' THEN 0 ELSE 1 END, name
      LIMIT 1
    `).get();
    if (!row) {
      throw new Error('Missing New Mexico regional education agency row.');
    }
    return row;
  } finally {
    db.close();
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
  const regionalEducation = queryRegionalEducationSample();
  return [
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'medicaid_state_health_coverage',
      family_status: 'blocked_live_medicaid_replacement_not_yet_reviewed',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'Legacy HSD / MAD samples were rechecked through the New Mexico low-token blocker lane and no longer provide a reviewed current Medicaid launch path.',
      blocker_code: 'legacy_medicaid_samples_dead_or_wrong_family',
      blocker_evidence: 'The legacy HSD / MAD packet target returned http_404 and the old mixed-family packet samples also included ABLE and early-intervention rows, so the current packet has no reviewed role-pure Medicaid state-coverage sample on disk.',
      samples: [],
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'medicaid_waiver_hcbs_disability_services',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed saved HCA DDSD page on disk now provides the statewide DD-waiver application / eligibility and HCBS entry context.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'New Mexico DD Waiver Application/Eligibility Determination',
          source_url: 'https://www.hca.nm.gov/eligibility-determination/',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_saved_html',
        },
      ],
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'developmental_disability_idd_authority',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed saved HCA DDSD page on disk replaced the stale dhhs.new-mexico.gov packet URL.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Developmental Disabilities Supports Division',
          source_url: 'https://www.hca.nm.gov/developmental-disabilities-supports-division/',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'reviewed_saved_html',
        },
      ],
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'early_intervention_part_c',
      family_status: 'missing_reviewed_role_aligned_part_c_source',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'Legacy Part C rows were rechecked through the New Mexico low-token blocker lane.',
      blocker_code: 'legacy_early_intervention_source_dead_and_no_reviewed_replacement',
      blocker_evidence: 'The old dhhs.new-mexico.gov/earlystart packet target is dead and the reviewed HCA DDSD page is DD-waiver routing, not an Early Intervention / Part C source.',
      samples: [],
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'special_education_idea_part_b',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed regional education agency row already on disk points to the PED Special Education Bureau page; district-grade routing remains a separate family.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: regionalEducation.name,
          source_url: regionalEducation.website || regionalEducation.source_url,
          verification_status: regionalEducation.verification_status,
          source_type: regionalEducation.source_type,
          source_table: 'regional_education_agencies',
        },
      ],
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'district_or_county_education_routing',
      family_status: 'blocked_exact_district_or_county_leafs_unverified',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'New Mexico low-token education lane exhausted the reviewed PED roots without fetching district-grade or county-grade leaves.',
      blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
      blocker_evidence: 'The packet only had generic PED-root school-district rows, and the reviewed PED Special Education Bureau page timed out in the bounded live lane before any district-owned or county-grade leaf could be verified.',
      samples: [],
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'vocational_rehabilitation_pre_ets',
      family_status: 'missing_reviewed_vr_or_pre_ets_source',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'Reviewed state packet and low-token lane results show only a DD division page, not a VR or Pre-ETS source.',
      blocker_code: 'legacy_or_inventory_only_evidence',
      blocker_evidence: 'The only old packet sample was the DDSD page, which is not a vocational rehabilitation or Pre-ETS source, and no reviewed New Mexico VR domain has been verified on disk yet.',
      samples: [],
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'protection_and_advocacy',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed DRNM first-party accepted artifact already exists on disk and explicitly proves the statewide P&A role.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights New Mexico',
          source_url: 'https://drnm.org/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
        },
      ],
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'parent_training_information_center',
      family_status: 'blocked_reviewed_parent_support_source_lacks_explicit_pti_designation',
      evidence_strength: 'weak',
      sample_count: 1,
      query_basis: 'Reviewed Parents Reaching Out first-party homepage exists on disk, but the fetched evidence proves statewide parent support / Family-to-Family scope rather than explicit PTI designation.',
      blocker_code: 'reviewed_statewide_parent_support_source_not_explicit_pti',
      blocker_evidence: 'Parents Reaching Out is a real first-party statewide support source, but the reviewed homepage only proves Family-to-Family healthcare information center scope and parent advocacy support, not explicit PTI / Parent Training and Information Center designation.',
      samples: [
        {
          sample_name: 'Parents Reaching Out',
          source_url: 'https://parentsreachingout.org/',
          verification_status: 'official_verified',
          source_type: 'official',
          source_table: 'reviewed_first_party_artifact',
        },
      ],
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'legal_aid',
      family_status: 'missing_reviewed_statewide_legal_aid_source',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'No reviewed first-party or authoritative statewide legal-aid source is present in the current New Mexico packet artifacts.',
      blocker_code: 'missing_required_source_family',
      blocker_evidence: 'The current New Mexico packet still has no reviewed statewide legal-aid source on disk.',
      samples: [],
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'able_program',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed ABLE federal-crossover source remains intact in the program spine.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'New Mexico ABLE Program',
          source_url: 'https://www.ablenrc.org/',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
        },
      ],
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'ssi_ssa_federal_reference',
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed SSA crossover source remains intact in the program spine.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'SSI for Children (New Mexico)',
          source_url: 'https://www.ssa.gov/',
          verification_status: 'verified',
          source_type: 'official',
          source_table: 'programs',
        },
      ],
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'county_local_disability_resources',
      family_status: 'blocked_generic_or_third_party_local_directory_only',
      evidence_strength: 'missing',
      sample_count: 0,
      query_basis: 'Reviewed packet examples for county-local routing remain stale HSD / dhhs paths or third-party DOI mirror references rather than live county-grade official office leaves.',
      blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
      blocker_evidence: 'County-local routing still depends on stale dhhs / HSD paths or DOI-hosted mirror rows, not live county-owned or official local office leaves.',
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
    primary_gap_reason: 'stale_state_packet_sources_rejected_and_county_grade_leaf_proof_still_missing',
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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows, facts) {
  return [
    '# New Mexico California-Grade Audit Report v2',
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
    '## New Mexico truth refresh decision',
    '',
    `- Protection and advocacy upgrades to verified statewide evidence because the reviewed DRNM first-party page explicitly states that DRNM is the federally mandated protection and advocacy system for New Mexico and exposes direct Get Help / intake routing (${facts.drnmUrl}).`,
    `- Parent training information center does not upgrade, even though Parents Reaching Out is a real statewide family-support source, because the reviewed homepage only proves Family-to-Family healthcare information center scope and parent advocacy support, not explicit PTI designation (${facts.parentsUrl}).`,
    `- Developmental disability / IDD authority and Medicaid waiver / HCBS disability services are repaired from the reviewed HCA DDSD evidence chain. The stale dhhs.new-mexico.gov DD sample is replaced by the live HCA DDSD page (${facts.ddUrl}), and the same reviewed source proves DD Waiver Application/Eligibility Determination routing (${facts.ddEligibilityUrl}).`,
    '- Medicaid state health coverage is downgraded because the old HSD / MAD sample chain is no longer trustworthy: the legacy MAD URL now returns http_404 in the bounded New Mexico low-token lane, and the packet mixed ABLE and early-intervention samples into the Medicaid family instead of preserving a role-pure Medicaid source.',
    '- Early intervention / Part C is downgraded because the old dhhs.new-mexico.gov/earlystart packet URL is dead and the reviewed HCA DDSD page is DD-waiver routing, not a Part C / FIT / early-intervention source.',
    `- District or county education routing remains blocked because the packet still relies on generic PED-root district rows, and the bounded official PED Special Education Bureau checks timed out before any district-owned or county-grade education leaf could be verified (${facts.pedUrl}).`,
    '- County-local disability resources remain blocked because the current packet still depends on stale HSD / dhhs office paths or DOI mirror rows rather than live county-owned or official county-grade office leaves.',
    '- Legal aid remains missing because no reviewed statewide legal-aid source exists on disk in the current packet.',
    '- New Mexico is therefore truthfully BLOCKED and not index-safe. The packet is now internally consistent, but it cannot move forward until new exact official Medicaid, EI, county-local, and district/county education evidence is reviewed.',
  ].join('\n') + '\n';
}

export function generateBatch43NewMexicoStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const rejectedRows = readJsonl(INPUTS.nmRejected);
  const blockedRows = readJsonl(INPUTS.nmBlocked);
  const drnmAcceptedRows = readJsonl(INPUTS.drnmAccepted);

  const drnmHtml = readText(INPUTS.drnmHtml);
  const parentsHtml = readText(INPUTS.parentsHtml);
  const ddHtml = readText(INPUTS.ddSavedHtml);

  assertIncludes(drnmHtml, 'federally mandated protection and advocacy system for New Mexico', 'DRNM');
  assertIncludes(drnmHtml, 'Start an Intake', 'DRNM');
  assertIncludes(parentsHtml, 'Family-to-Family Healthcare Information Center', 'Parents Reaching Out');
  assertIncludes(ddHtml, 'DD Waiver Application/Eligibility Determination', 'HCA DDSD');
  assertIncludes(ddHtml, 'Need DDSD Assistance?', 'HCA DDSD');

  const drnmAccepted = findRow(
    drnmAcceptedRows,
    (row) => String(row.finalUrl || '').includes('drnm.org'),
    'reviewed DRNM accepted artifact',
  );
  if (drnmAccepted.validationStatus !== 'accepted') {
    throw new Error('DRNM first-party artifact must remain accepted.');
  }

  const medicaid404 = findRow(
    blockedRows,
    (row) => row.role_id === 'medicaid_application' && row.url === 'https://www.hsd.state.nm.us/mad' && row.http_status === 404,
    'New Mexico HSD/MAD 404 blocker',
  );
  const pedTimeout = findRow(
    blockedRows,
    (row) => row.role_id === 'special_education_parent_rights' && String(row.url || '').includes('webnew.ped.state.nm.us/bureaus/special-education/'),
    'New Mexico PED timeout blocker',
  );
  const ddRedirectReject = findRow(
    rejectedRows,
    (row) => row.role_id === 'main_dd_agency'
      && row.url === 'https://www.nmhealth.org/about/ddsd'
      && row.final_url === 'https://www.hca.nm.gov/developmental-disabilities-supports-division/'
      && row.rejection_reason === 'wrong_domain_after_fetch',
    'New Mexico HCA redirect rejection',
  );

  const updatedVerifiedRows = buildVerifiedSourceRows();

  const statusByFamily = new Map(updatedVerifiedRows.map((row) => [row.family, row]));
  const updatedGapRows = gapRows.map((row) => {
    const verified = statusByFamily.get(row.family);
    if (!verified) return row;
    const reasonByFamily = {
      medicaid_state_health_coverage: 'Legacy HSD / MAD proof is dead or mixed-family, and the packet still lacks a reviewed current New Mexico Medicaid page on disk.',
      medicaid_waiver_hcbs_disability_services: 'Reviewed HCA DDSD evidence on disk now proves statewide DD-waiver application / eligibility and HCBS disability-services routing.',
      developmental_disability_idd_authority: 'Reviewed HCA DDSD evidence on disk replaced the stale dhhs.new-mexico.gov DD authority path.',
      early_intervention_part_c: 'The old dhhs.new-mexico.gov/earlystart path is dead and the current reviewed evidence on disk is DD-waiver routing, not Part C / FIT routing.',
      special_education_idea_part_b: 'The reviewed New Mexico regional education row still points to the PED Special Education Bureau page as the statewide Part B authority, while district-grade routing remains a separate blocked family.',
      district_or_county_education_routing: 'Generic PED-root district rows and a timed-out bounded PED Bureau check do not prove district-owned or county-grade routing.',
      vocational_rehabilitation_pre_ets: 'Only legacy inventory hints remain; no reviewed New Mexico VR or Pre-ETS source is verified on disk.',
      protection_and_advocacy: 'Reviewed DRNM first-party evidence on disk explicitly proves the statewide protection-and-advocacy role and intake route.',
      parent_training_information_center: 'Reviewed Parents Reaching Out evidence proves statewide parent support and Family-to-Family scope, but not explicit PTI designation.',
      legal_aid: 'No reviewed statewide legal-aid source is present in the current New Mexico packet.',
      able_program: 'Statewide ABLE crossover evidence remains reviewed and intact.',
      ssi_ssa_federal_reference: 'SSA crossover evidence remains reviewed and intact.',
      county_local_disability_resources: 'The current packet still depends on stale HSD / dhhs paths or DOI mirrors instead of live county-grade official office leaves.',
    };
    return {
      ...row,
      family_status: verified.family_status,
      status_reason: reasonByFamily[row.family] || row.status_reason,
    };
  });

  const updatedFailureRows = [
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'medicaid_state_health_coverage',
      severity: 'critical',
      failure_code: 'legacy_medicaid_samples_dead_or_wrong_family',
      evidence: `The old HSD / MAD packet target returned http_404 (${medicaid404.url}) and the prior packet mixed unrelated ABLE and early-intervention samples into the Medicaid family.`,
      next_action: 'author_or_review_current_hca_medicaid_leaf',
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'early_intervention_part_c',
      severity: 'critical',
      failure_code: 'legacy_early_intervention_source_dead_and_no_reviewed_replacement',
      evidence: 'The old dhhs.new-mexico.gov/earlystart packet source is dead and the reviewed HCA DDSD page is not a Part C / FIT / early-intervention source.',
      next_action: 'author_or_review_current_official_part_c_fit_source',
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      evidence: `School-district packet rows still collapse to generic PED-root evidence, and the bounded PED Bureau fetch timed out (${pedTimeout.url}) before any district-owned or county-grade leaf could be verified.`,
      next_action: 'author_county_or_district_exact_targets',
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'vocational_rehabilitation_pre_ets',
      severity: 'major',
      failure_code: 'missing_reviewed_vr_or_pre_ets_source',
      evidence: 'The only old packet sample was a DDSD page, which is not a VR or Pre-ETS source, and no reviewed New Mexico VR source is verified on disk.',
      next_action: 'author_or_review_statewide_vr_pre_ets_source',
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'parent_training_information_center',
      severity: 'major',
      failure_code: 'reviewed_statewide_parent_support_source_not_explicit_pti',
      evidence: 'Parents Reaching Out is reviewed and statewide, but the fetched homepage proves Family-to-Family and parent-support scope, not explicit PTI designation.',
      next_action: 'author_or_review_designated_statewide_pti_source',
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'legal_aid',
      severity: 'major',
      failure_code: 'missing_required_source_family',
      evidence: 'No reviewed statewide legal-aid source exists in the current New Mexico packet.',
      next_action: 'author_or_review_statewide_legal_aid_source',
    },
    {
      state: 'new-mexico',
      state_code: 'NM',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      evidence: 'County-local packet rows still rely on stale HSD / dhhs paths or DOI mirror records instead of live county-owned or official county-grade office leaves.',
      next_action: 'author_county_local_exact_targets',
    },
  ];

  const updatedNextRows = updatedFailureRows
    .map((row, index) => ({
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
  const facts = {
    drnmUrl: 'https://drnm.org/',
    parentsUrl: 'https://parentsreachingout.org/',
    ddUrl: ddRedirectReject.final_url,
    ddEligibilityUrl: 'https://www.hca.nm.gov/eligibility-determination/',
    pedUrl: pedTimeout.url,
  };
  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, facts);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const outputSummary = {
    state: 'new-mexico',
    classification: updatedSummary.classification,
    completeness_pct: updatedSummary.completeness_pct,
    strong_critical_families: updatedSummary.strong_critical_families,
    weak_critical_families: updatedSummary.weak_critical_families,
    missing_critical_families: updatedSummary.missing_critical_families,
    updated_families: updatedVerifiedRows
      .filter((row) => ['verified_state_grade', 'blocked_live_medicaid_replacement_not_yet_reviewed', 'missing_reviewed_role_aligned_part_c_source', 'blocked_exact_district_or_county_leafs_unverified', 'blocked_reviewed_parent_support_source_lacks_explicit_pti_designation'].includes(row.family_status))
      .map((row) => ({ family: row.family, family_status: row.family_status, sample_count: row.sample_count })),
    evidence_checks: {
      drnmAcceptedRecordId: drnmAccepted.recordId,
      drnmAcceptedFinalUrl: drnmAccepted.finalUrl,
      medicaid404Url: medicaid404.url,
      pedTimeoutUrl: pedTimeout.url,
      ddRedirectUrl: ddRedirectReject.final_url,
    },
  };

  writeJson(OUTPUTS.summary, outputSummary);
  fs.writeFileSync(OUTPUTS.report, updatedReport);
  return outputSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = generateBatch43NewMexicoStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify({ ok: true, ...result }, null, 2));
}
