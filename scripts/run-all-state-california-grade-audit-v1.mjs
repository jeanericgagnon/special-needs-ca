import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const stateReportsDir = path.join(repoRoot, 'docs', 'state-reports');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const OUTPUTS = {
  procedureMd: path.join(docsGeneratedDir, 'all-state-california-grade-procedure-v1.md'),
  schemaJson: path.join(generatedDir, 'all_state_california_grade_schema_v1.json'),
  requiredFamiliesJsonl: path.join(generatedDir, 'all_state_required_source_families_v1.jsonl'),
  launchGatePolicyJson: path.join(generatedDir, 'all_state_launch_gate_policy_v1.json'),
  auditJson: path.join(generatedDir, 'all_state_california_grade_audit_v1.json'),
  gapMatrixJsonl: path.join(generatedDir, 'all_state_gap_matrix_v1.jsonl'),
  failureLedgerJsonl: path.join(generatedDir, 'all_state_failure_ledger_v1.jsonl'),
  nextActionQueueJsonl: path.join(generatedDir, 'all_state_next_action_queue_v1.jsonl'),
  auditReportMd: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v1.md'),
  priorityQueueJsonl: path.join(generatedDir, 'all_state_priority_queue_v1.jsonl'),
  priorityPlanMd: path.join(docsGeneratedDir, 'all-state-priority-plan-v1.md'),
  laneTemplatesMd: path.join(docsGeneratedDir, 'state-repair-lane-templates-v1.md'),
};

const PILOT_STATES = ['texas', 'illinois', 'new-mexico'];

const FAMILY_DEFS = [
  {
    familyId: 'medicaid_state_health_coverage',
    label: 'Medicaid / state health coverage',
    critical: true,
    authorityLevelRequired: 'official_state_or_county',
    acceptedSourceTypes: ['official_website', 'official_directory', 'official_portal'],
    rejectedSourceTypes: ['generic_homepage', 'search_results', 'social_media', 'unparsed_pdf'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level', 'evidence_snippet', 'verification_status'],
    freshnessFieldsRequired: ['fetched_at', 'last_verified_date'],
    countyGradeEvidenceRequired: true,
    statewideEvidenceEnough: false,
    launchIndexingGateImpact: 'critical',
  },
  {
    familyId: 'medicaid_waiver_hcbs_disability_services',
    label: 'Medicaid waiver / HCBS / disability services',
    critical: true,
    authorityLevelRequired: 'official_state',
    acceptedSourceTypes: ['official_website', 'official_program_page', 'official_pdf'],
    rejectedSourceTypes: ['generic_health_portal', 'third_party_summary', 'knowledge_article_only'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level', 'evidence_snippet', 'confidence_reason'],
    freshnessFieldsRequired: ['fetched_at', 'last_verified_date'],
    countyGradeEvidenceRequired: false,
    statewideEvidenceEnough: true,
    launchIndexingGateImpact: 'critical',
  },
  {
    familyId: 'developmental_disability_idd_authority',
    label: 'Developmental disability / IDD authority',
    critical: true,
    authorityLevelRequired: 'official_state_or_regional',
    acceptedSourceTypes: ['official_website', 'official_directory'],
    rejectedSourceTypes: ['generic_homepage', 'dead_page', 'federal_explainer'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level', 'evidence_snippet', 'verification_status'],
    freshnessFieldsRequired: ['fetched_at', 'last_verified_date'],
    countyGradeEvidenceRequired: true,
    statewideEvidenceEnough: false,
    launchIndexingGateImpact: 'critical',
  },
  {
    familyId: 'early_intervention_part_c',
    label: 'Early intervention / IDEA Part C',
    critical: true,
    authorityLevelRequired: 'official_state_or_regional',
    acceptedSourceTypes: ['official_website', 'official_directory', 'official_search'],
    rejectedSourceTypes: ['generic_homepage', 'knowledge_article_only', 'weak_keyword_match'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level', 'evidence_snippet', 'verification_status'],
    freshnessFieldsRequired: ['fetched_at', 'last_verified_date'],
    countyGradeEvidenceRequired: true,
    statewideEvidenceEnough: false,
    launchIndexingGateImpact: 'critical',
  },
  {
    familyId: 'special_education_idea_part_b',
    label: 'Special education / IDEA Part B',
    critical: true,
    authorityLevelRequired: 'official_state',
    acceptedSourceTypes: ['official_website', 'official_dispute_page', 'official_policy_page'],
    rejectedSourceTypes: ['generic_homepage', 'federal_only_page', 'district_directory_only'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level', 'evidence_snippet', 'source_type'],
    freshnessFieldsRequired: ['fetched_at', 'last_verified_date'],
    countyGradeEvidenceRequired: false,
    statewideEvidenceEnough: true,
    launchIndexingGateImpact: 'critical',
  },
  {
    familyId: 'district_or_county_education_routing',
    label: 'District or county education routing',
    critical: true,
    authorityLevelRequired: 'official_district_or_regional',
    acceptedSourceTypes: ['district_owned_page', 'district_owned_google_site', 'district_document_with_text_proof'],
    rejectedSourceTypes: ['generic_askted_portal', 'esc_only_fallback', 'homepage_only', 'unparsed_pdf'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level', 'evidence_snippet', 'evidence_terms_found', 'verification_rule_version'],
    freshnessFieldsRequired: ['fetched_at'],
    countyGradeEvidenceRequired: true,
    statewideEvidenceEnough: false,
    launchIndexingGateImpact: 'critical',
  },
  {
    familyId: 'vocational_rehabilitation_pre_ets',
    label: 'Vocational rehabilitation / Pre-ETS',
    critical: true,
    authorityLevelRequired: 'official_state',
    acceptedSourceTypes: ['official_website', 'official_program_page'],
    rejectedSourceTypes: ['generic_transition_article', 'school_only_page'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level', 'evidence_snippet'],
    freshnessFieldsRequired: ['fetched_at'],
    countyGradeEvidenceRequired: false,
    statewideEvidenceEnough: true,
    launchIndexingGateImpact: 'major',
  },
  {
    familyId: 'protection_and_advocacy',
    label: 'Protection and advocacy',
    critical: true,
    authorityLevelRequired: 'approved_non_government',
    acceptedSourceTypes: ['p_and_a_first_party'],
    rejectedSourceTypes: ['directory_listing', 'generic_legal_help_page'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level', 'evidence_snippet'],
    freshnessFieldsRequired: ['fetched_at'],
    countyGradeEvidenceRequired: false,
    statewideEvidenceEnough: true,
    launchIndexingGateImpact: 'major',
  },
  {
    familyId: 'parent_training_information_center',
    label: 'Parent training and information center',
    critical: true,
    authorityLevelRequired: 'approved_non_government',
    acceptedSourceTypes: ['pti_first_party'],
    rejectedSourceTypes: ['generic_parent_hub', 'federal_explainer'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level', 'evidence_snippet'],
    freshnessFieldsRequired: ['fetched_at'],
    countyGradeEvidenceRequired: false,
    statewideEvidenceEnough: true,
    launchIndexingGateImpact: 'major',
  },
  {
    familyId: 'legal_aid',
    label: 'Legal aid',
    critical: true,
    authorityLevelRequired: 'approved_non_government',
    acceptedSourceTypes: ['legal_aid_first_party'],
    rejectedSourceTypes: ['state_bar_directory', 'generic_referral_page'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level', 'evidence_snippet'],
    freshnessFieldsRequired: ['fetched_at'],
    countyGradeEvidenceRequired: false,
    statewideEvidenceEnough: true,
    launchIndexingGateImpact: 'major',
  },
  {
    familyId: 'able_program',
    label: 'ABLE program',
    critical: true,
    authorityLevelRequired: 'official_state_or_program_first_party',
    acceptedSourceTypes: ['official_website', 'state_program_page'],
    rejectedSourceTypes: ['generic_finance_article', 'federal_only_reference'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level', 'evidence_snippet'],
    freshnessFieldsRequired: ['fetched_at'],
    countyGradeEvidenceRequired: false,
    statewideEvidenceEnough: true,
    launchIndexingGateImpact: 'major',
  },
  {
    familyId: 'ssi_ssa_federal_reference',
    label: 'SSI / SSA federal references',
    critical: false,
    authorityLevelRequired: 'official_federal',
    acceptedSourceTypes: ['official_federal'],
    rejectedSourceTypes: ['third_party_summary', 'generic_benefits_blog'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level'],
    freshnessFieldsRequired: ['fetched_at'],
    countyGradeEvidenceRequired: false,
    statewideEvidenceEnough: true,
    launchIndexingGateImpact: 'supporting',
  },
  {
    familyId: 'county_local_disability_resources',
    label: 'County/local disability resources',
    critical: true,
    authorityLevelRequired: 'official_county_or_verified_local',
    acceptedSourceTypes: ['official_directory', 'district_owned_page', 'verified_local_office', 'verified_regional_office'],
    rejectedSourceTypes: ['generic_directory_root', 'statewide_only_fallback', 'inventory_only_hint'],
    evidenceFieldsRequired: ['source_url', 'final_url', 'fetched_at', 'authority_level', 'evidence_snippet', 'verification_status'],
    freshnessFieldsRequired: ['fetched_at', 'last_verified_date'],
    countyGradeEvidenceRequired: true,
    statewideEvidenceEnough: false,
    launchIndexingGateImpact: 'critical',
  },
];

const FAMILY_ROLE_MAP = {
  medicaid_state_health_coverage: ['medicaid_application', 'medicaid_eligibility', 'medicaid_local_offices', 'county_human_services_offices', 'childrens_medicaid_chip'],
  medicaid_waiver_hcbs_disability_services: ['hcbs_waivers', 'personal_care_attendant_care', 'medicaid_grievances_appeals', 'medicaid_fair_hearing', 'medicaid_renewals_redeterminations'],
  developmental_disability_idd_authority: ['main_dd_agency', 'dd_eligibility', 'dd_intake_application', 'dd_local_regional_office_directory', 'dd_appeals_complaints'],
  early_intervention_part_c: ['ei_part_c_program', 'ei_referral_intake', 'ei_eligibility', 'ei_local_office_directory'],
  special_education_idea_part_b: ['special_education_parent_rights', 'iep_process', 'state_complaints', 'special_education_mediation', 'special_education_due_process', 'section_504_guidance'],
  district_or_county_education_routing: ['regional_education_directory', 'school_districts_local'],
  vocational_rehabilitation_pre_ets: ['vocational_rehabilitation', 'pre_ets'],
  protection_and_advocacy: ['protection_advocacy_resources'],
  parent_training_information_center: ['parent_training_information_center', 'parent_centers_pti'],
  legal_aid: ['legal_aid_resources'],
  able_program: ['able_account_program'],
  ssi_ssa_federal_reference: ['ssi_child_disability'],
  county_local_disability_resources: ['medicaid_local_offices', 'county_human_services_offices', 'dd_local_regional_office_directory', 'regional_education_directory', 'school_districts_local'],
};

const PRIORITY_STATES_FROM_SPEC = ['texas', 'florida', 'pennsylvania', 'california', 'illinois', 'new-york', 'ohio', 'georgia', 'new-mexico'];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
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
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  const lines = rows.map((row) => JSON.stringify(row));
  fs.writeFileSync(filePath, lines.length ? `${lines.join('\n')}\n` : '');
}

function writeCsv(filePath, rows) {
  if (!rows.length) {
    fs.writeFileSync(filePath, '');
    return;
  }
  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    const stringValue = value == null ? '' : String(value);
    return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
  };
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ];
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`);
}

function slugifyStateName(name) {
  return String(name || '').toLowerCase().replace(/\s+/g, '-');
}

function titleCaseFromSlug(slug) {
  return slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function loadStateReports() {
  const result = new Map();
  for (const filename of fs.readdirSync(stateReportsDir)) {
    if (!filename.endsWith('.md')) continue;
    const slug = filename.replace(/\.md$/, '');
    const content = fs.readFileSync(path.join(stateReportsDir, filename), 'utf8');
    const statusLabel = content.match(/V3 Status Label\*\*: `([^`]+)`/i)?.[1] ?? 'UNKNOWN';
    const gateScore = Number.parseFloat(content.match(/Canonical Release Gate Score\*\*: \*\*([\d.]+)%\*\*/i)?.[1] ?? '0');
    const rawDepth = Number.parseFloat(content.match(/Live Raw Database Depth Score\*\*: \*\*([\d.]+)%\*\*/i)?.[1] ?? '0');
    const manualReviewRate = Number.parseFloat(content.match(/Manual Review Rate: \*\*([\d.]+)%\*\*/i)?.[1] ?? '0');
    const indexingPosture = content.match(/Sitemap Indexing Posture\*\*: `([^`]+)`/i)?.[1] ?? 'Unknown';
    const gatingPolicy = content.match(/Search Engine Gating Policy\*\*: `([^`]+)`/i)?.[1] ?? 'Unknown';
    const allowlistedCountyCount = Number.parseInt(content.match(/Verified Allowlisted Counties \((\d+)\)/i)?.[1] ?? '0', 10);
    result.set(slug, {
      stateSlug: slug,
      stateName: titleCaseFromSlug(slug),
      statusLabel,
      gateScore,
      rawDepth,
      manualReviewRate,
      indexingPosture,
      gatingPolicy,
      allowlistedCountyCount,
    });
  }
  return result;
}

function loadLegacySourcePackSignals() {
  const rows = readJsonl(path.join(generatedDir, 'all_states_source_pack_v1.jsonl'));
  const perState = new Map();
  for (const row of rows) {
    const slug = slugifyStateName(row.state);
    if (!slug) continue;
    if (!perState.has(slug)) {
      perState.set(slug, {
        roleCounts: {},
        statusCounts: {},
        weakEvidenceCount: 0,
        semanticRiskCount: 0,
        dbFieldAgencyCount: 0,
        federalMismatchCount: 0,
        genericRootCount: 0,
      });
    }
    const state = perState.get(slug);
    state.roleCounts[row.source_role] = (state.roleCounts[row.source_role] ?? 0) + 1;
    state.statusCounts[row.status] = (state.statusCounts[row.status] ?? 0) + 1;
    if (row.status !== 'verified_target') state.weakEvidenceCount += 1;
    if (/state_resource_agencies\.website|forms_and_guides\.source_url|school_districts\.website/i.test(String(row.agency || ''))) {
      state.dbFieldAgencyCount += 1;
    }
    if (row.review_reason) state.semanticRiskCount += 1;
    if (String(row.authority || '').includes('official_federal') && !['ssi_child_disability'].includes(row.source_role)) {
      state.federalMismatchCount += 1;
    }
    if (row.target_kind === 'official_root' || row.target_kind === 'directory_root') {
      state.genericRootCount += 1;
    }
  }
  return perState;
}

function loadFiveStatePackSignals() {
  const verifiedRows = readJsonl(path.join(generatedDir, 'verified_state_source_pack_v2.jsonl'));
  const candidateRows = readJsonl(path.join(generatedDir, 'state_source_candidates_v2.jsonl'));
  const blockedRows = readJsonl(path.join(generatedDir, 'state_source_blocked_v2.jsonl'));
  const unresolvedRows = readJsonl(path.join(generatedDir, 'state_source_unresolved_v2.jsonl'));
  const summaryCsvPath = path.join(generatedDir, 'state_source_summary_v2.csv');
  const summaryBySlug = new Map();

  if (fs.existsSync(summaryCsvPath)) {
    const [headerLine, ...dataLines] = fs.readFileSync(summaryCsvPath, 'utf8').trim().split('\n');
    const headers = headerLine.split(',');
    for (const line of dataLines) {
      const values = line.split(',');
      const row = Object.fromEntries(headers.map((header, index) => [header, values[index]]));
      summaryBySlug.set(slugifyStateName(row.state), {
        verifiedStateSpecificTargets: Number.parseInt(row.verified_state_specific_targets ?? '0', 10),
        verifiedLocalTargets: Number.parseInt(row.verified_local_targets ?? '0', 10),
        uniqueFederalTargetsUsed: Number.parseInt(row.unique_federal_targets_used ?? '0', 10),
        unresolvedCriticalRoles: Number.parseInt(row.unresolved_critical_roles ?? '0', 10),
        semanticRejectionCount: Number.parseInt(row.semantic_rejection_count ?? '0', 10),
        httpFailureCount: Number.parseInt(row.http_failure_count ?? '0', 10),
        exactLeafPageCount: Number.parseInt(row.exact_leaf_page_count ?? '0', 10),
        genericRootCount: Number.parseInt(row.generic_root_count ?? '0', 10),
        criticalRolesVerifiedPct: Number.parseFloat(row.critical_roles_verified_pct ?? '0'),
      });
    }
  }

  const grouped = new Map();
  for (const [collection, key] of [
    [verifiedRows, 'verifiedRows'],
    [candidateRows, 'candidateRows'],
    [blockedRows, 'blockedRows'],
    [unresolvedRows, 'unresolvedRows'],
  ]) {
    for (const row of collection) {
      const slug = slugifyStateName(row.state);
      if (!grouped.has(slug)) grouped.set(slug, { verifiedRows: [], candidateRows: [], blockedRows: [], unresolvedRows: [] });
      grouped.get(slug)[key].push(row);
    }
  }

  return { grouped, summaryBySlug };
}

function loadTexasTruth() {
  return readJson(path.join(generatedDir, 'tx_verification_summary_v9.json'), null);
}

function buildStateMetrics(db) {
  const query = `
    WITH state_counties AS (
      SELECT state_id, COUNT(*) AS county_count
      FROM counties
      GROUP BY state_id
    ),
    programs_by_state AS (
      SELECT
        state_id,
        COUNT(*) AS program_count,
        SUM(CASE WHEN verification_status IN ('verified','official_verified','human_verified') THEN 1 ELSE 0 END) AS verified_program_count,
        SUM(CASE WHEN lower(name) LIKE '%waiver%' OR lower(description) LIKE '%waiver%' THEN 1 ELSE 0 END) AS waiver_programs,
        SUM(CASE WHEN lower(name) LIKE '%able%' THEN 1 ELSE 0 END) AS able_programs,
        SUM(CASE WHEN lower(name) LIKE '%vocational rehabilitation%' OR lower(description) LIKE '%vocational rehabilitation%' THEN 1 ELSE 0 END) AS vr_programs,
        SUM(CASE WHEN lower(name) LIKE '%special education%' OR lower(name) LIKE '%iep%' THEN 1 ELSE 0 END) AS sped_programs,
        SUM(CASE WHEN lower(name) LIKE '%early intervention%' OR lower(description) LIKE '%early intervention%' THEN 1 ELSE 0 END) AS ei_programs,
        SUM(CASE WHEN lower(name) LIKE '%ssi%' OR lower(description) LIKE '%social security%' THEN 1 ELSE 0 END) AS ssi_programs
      FROM programs
      GROUP BY state_id
    ),
    forms_by_state AS (
      SELECT
        state_id,
        COUNT(*) AS form_count,
        SUM(CASE WHEN verification_status IN ('verified','official_verified','human_verified') THEN 1 ELSE 0 END) AS verified_form_count
      FROM forms_and_guides
      GROUP BY state_id
    ),
    agencies_by_state AS (
      SELECT
        state_id,
        COUNT(*) AS agency_count,
        SUM(CASE WHEN verification_status IN ('verified','official_verified','human_verified') THEN 1 ELSE 0 END) AS verified_agency_count,
        SUM(CASE WHEN agency_type IN ('developmental_services_agency','dd_intake','lidda','cbdd','isc','ddro','regional_center','county_ae') THEN 1 ELSE 0 END) AS dd_agency_count,
        SUM(CASE WHEN agency_type IN ('early_intervention','eci','early_steps','cfc','apd_office') THEN 1 ELSE 0 END) AS ei_agency_count,
        SUM(CASE WHEN agency_type LIKE '%vocational%' OR agency_type LIKE '%rehabilitation%' THEN 1 ELSE 0 END) AS vr_agency_count
      FROM state_resource_agencies
      GROUP BY state_id
    ),
    education_by_state AS (
      SELECT
        state_id,
        COUNT(*) AS regional_count,
        SUM(CASE WHEN verification_status IN ('verified','official_verified','human_verified') THEN 1 ELSE 0 END) AS verified_regional_count
      FROM regional_education_agencies
      GROUP BY state_id
    ),
    districts_by_state AS (
      SELECT
        c.state_id,
        COUNT(*) AS district_count,
        SUM(CASE WHEN sd.verification_status IN ('verified','official_verified','human_verified') THEN 1 ELSE 0 END) AS verified_district_count
      FROM school_districts sd
      JOIN counties c ON c.id = sd.county_id
      GROUP BY c.state_id
    ),
    offices_by_state AS (
      SELECT
        c.state_id,
        COUNT(*) AS office_count,
        SUM(CASE WHEN co.verification_status IN ('verified','official_verified','human_verified') THEN 1 ELSE 0 END) AS verified_office_count
      FROM county_offices co
      JOIN counties c ON c.id = co.county_id
      GROUP BY c.state_id
    ),
    providers_by_state AS (
      SELECT
        c.state_id,
        COUNT(*) AS provider_count,
        SUM(CASE WHEN rp.verification_status IN ('verified','official_verified','human_verified') THEN 1 ELSE 0 END) AS verified_provider_count
      FROM resource_providers rp
      JOIN counties c ON c.id = rp.county_id
      GROUP BY c.state_id
    ),
    nonprofits_by_state AS (
      SELECT
        c.state_id,
        COUNT(*) AS nonprofit_count,
        SUM(CASE WHEN no.verification_status IN ('verified','official_verified','human_verified') THEN 1 ELSE 0 END) AS verified_nonprofit_count
      FROM nonprofit_organizations no
      JOIN counties c ON c.id = no.county_id
      GROUP BY c.state_id
    )
    SELECT
      s.id AS state_id,
      s.code AS state_code,
      s.name AS state_name,
      COALESCE(sc.county_count, 0) AS county_count,
      COALESCE(p.program_count, 0) AS program_count,
      COALESCE(p.verified_program_count, 0) AS verified_program_count,
      COALESCE(p.waiver_programs, 0) AS waiver_programs,
      COALESCE(p.able_programs, 0) AS able_programs,
      COALESCE(p.vr_programs, 0) AS vr_programs,
      COALESCE(p.sped_programs, 0) AS sped_programs,
      COALESCE(p.ei_programs, 0) AS ei_programs,
      COALESCE(p.ssi_programs, 0) AS ssi_programs,
      COALESCE(f.form_count, 0) AS form_count,
      COALESCE(f.verified_form_count, 0) AS verified_form_count,
      COALESCE(a.agency_count, 0) AS agency_count,
      COALESCE(a.verified_agency_count, 0) AS verified_agency_count,
      COALESCE(a.dd_agency_count, 0) AS dd_agency_count,
      COALESCE(a.ei_agency_count, 0) AS ei_agency_count,
      COALESCE(a.vr_agency_count, 0) AS vr_agency_count,
      COALESCE(e.regional_count, 0) AS regional_count,
      COALESCE(e.verified_regional_count, 0) AS verified_regional_count,
      COALESCE(d.district_count, 0) AS district_count,
      COALESCE(d.verified_district_count, 0) AS verified_district_count,
      COALESCE(o.office_count, 0) AS office_count,
      COALESCE(o.verified_office_count, 0) AS verified_office_count,
      COALESCE(pr.provider_count, 0) AS provider_count,
      COALESCE(pr.verified_provider_count, 0) AS verified_provider_count,
      COALESCE(n.nonprofit_count, 0) AS nonprofit_count,
      COALESCE(n.verified_nonprofit_count, 0) AS verified_nonprofit_count
    FROM states s
    LEFT JOIN state_counties sc ON sc.state_id = s.id
    LEFT JOIN programs_by_state p ON p.state_id = s.id
    LEFT JOIN forms_by_state f ON f.state_id = s.id
    LEFT JOIN agencies_by_state a ON a.state_id = s.id
    LEFT JOIN education_by_state e ON e.state_id = s.id
    LEFT JOIN districts_by_state d ON d.state_id = s.id
    LEFT JOIN offices_by_state o ON o.state_id = s.id
    LEFT JOIN providers_by_state pr ON pr.state_id = s.id
    LEFT JOIN nonprofits_by_state n ON n.state_id = s.id
    ORDER BY s.name
  `;
  return db.prepare(query).all();
}

function familyStatusForState(state, familyId, legacySignal, fiveStateSignal, texasTruth) {
  const roleCount = (roles) => roles.reduce((sum, role) => sum + (legacySignal?.roleCounts?.[role] ?? 0), 0);
  const hasV2Verified = (roles) => (fiveStateSignal?.verifiedRows ?? []).some((row) => roles.includes(row.source_role));
  const hasV2Unresolved = (roles) => (fiveStateSignal?.unresolvedRows ?? []).some((row) => roles.includes(row.missing_role || row.source_role));

  const strongCountyAudit = state.state_id === 'texas' && texasTruth?.v9 && texasTruth.v9.partial_counties + texasTruth.v9.blocked_counties < state.county_count;

  switch (familyId) {
    case 'medicaid_state_health_coverage':
      if (state.office_count >= Math.max(1, state.county_count) && state.verified_office_count >= Math.max(1, state.county_count)) return 'verified_state_grade';
      if (state.office_count > 0) return 'legacy_state_grade';
      return 'missing';
    case 'medicaid_waiver_hcbs_disability_services':
      if (state.waiver_programs > 0 && roleCount(FAMILY_ROLE_MAP[familyId]) > 0) return 'verified_state_grade';
      if (state.waiver_programs > 0 || roleCount(FAMILY_ROLE_MAP[familyId]) > 0) return 'inventory_only';
      return 'missing';
    case 'developmental_disability_idd_authority':
      if (state.state_id === 'texas' && texasTruth?.v9) return 'verified_county_grade';
      if (state.dd_agency_count > 0 && state.verified_agency_count > 0) return 'verified_state_grade';
      if (state.dd_agency_count > 0 || roleCount(FAMILY_ROLE_MAP[familyId]) > 0) return hasV2Unresolved(FAMILY_ROLE_MAP[familyId]) ? 'blocked' : 'legacy_state_grade';
      return 'missing';
    case 'early_intervention_part_c':
      if (state.state_id === 'texas' && texasTruth?.v9) return 'verified_county_grade';
      if (state.ei_agency_count > 0 && state.verified_agency_count > 0) return 'verified_state_grade';
      if (state.ei_agency_count > 0 || state.ei_programs > 0 || roleCount(FAMILY_ROLE_MAP[familyId]) > 0) return hasV2Unresolved(FAMILY_ROLE_MAP[familyId]) ? 'blocked' : 'legacy_state_grade';
      return 'missing';
    case 'special_education_idea_part_b':
      if (state.sped_programs > 0 && state.regional_count > 0) return 'verified_state_grade';
      if (state.regional_count > 0 || state.sped_programs > 0 || roleCount(FAMILY_ROLE_MAP[familyId]) > 0) return hasV2Unresolved(FAMILY_ROLE_MAP[familyId]) ? 'blocked' : 'legacy_state_grade';
      return 'missing';
    case 'district_or_county_education_routing':
      if (state.state_id === 'texas' && texasTruth?.v9) return texasTruth.v9.partial_counties === 0 && texasTruth.v9.blocked_counties === 0 ? 'verified_county_grade' : 'blocked';
      if (strongCountyAudit) return 'verified_county_grade';
      if (state.district_count >= state.county_count && state.county_count > 0) return 'legacy_state_grade';
      if (state.district_count > 0 || roleCount(FAMILY_ROLE_MAP[familyId]) > 0 || hasV2Verified(FAMILY_ROLE_MAP[familyId])) return hasV2Unresolved(FAMILY_ROLE_MAP[familyId]) ? 'blocked' : 'inventory_only';
      return 'missing';
    case 'vocational_rehabilitation_pre_ets':
      if (state.vr_programs > 0 && (roleCount(FAMILY_ROLE_MAP[familyId]) > 0 || state.vr_agency_count > 0)) return 'verified_state_grade';
      if (state.vr_programs > 0 || state.vr_agency_count > 0 || roleCount(FAMILY_ROLE_MAP[familyId]) > 0) return 'inventory_only';
      return 'missing';
    case 'protection_and_advocacy':
      if (state.state_id === 'texas' && texasTruth?.v9) return 'verified_state_grade';
      return hasV2Verified(FAMILY_ROLE_MAP[familyId]) ? 'verified_state_grade' : 'missing';
    case 'parent_training_information_center':
      if (state.state_id === 'texas' && texasTruth?.v9) return 'verified_state_grade';
      if (hasV2Verified(FAMILY_ROLE_MAP[familyId])) return 'verified_state_grade';
      if (roleCount(FAMILY_ROLE_MAP[familyId]) > 0) return 'inventory_only';
      return 'missing';
    case 'legal_aid':
      if (state.state_id === 'texas' && texasTruth?.v9) return 'verified_state_grade';
      if (hasV2Verified(FAMILY_ROLE_MAP[familyId])) return 'verified_state_grade';
      if (roleCount(FAMILY_ROLE_MAP[familyId]) > 0) return 'inventory_only';
      return 'missing';
    case 'able_program':
      if (state.able_programs > 0) return 'verified_state_grade';
      if (roleCount(FAMILY_ROLE_MAP[familyId]) > 0) return 'inventory_only';
      return 'missing';
    case 'ssi_ssa_federal_reference':
      if (state.ssi_programs > 0 || roleCount(FAMILY_ROLE_MAP[familyId]) > 0) return 'verified_state_grade';
      return 'missing';
    case 'county_local_disability_resources':
      if (state.state_id === 'texas' && texasTruth?.v9) return texasTruth.v9.partial_counties === 0 && texasTruth.v9.blocked_counties === 0 ? 'verified_county_grade' : 'blocked';
      if (state.office_count >= state.county_count && state.district_count >= state.county_count && state.county_count > 0) return 'legacy_state_grade';
      if (state.office_count > 0 || state.district_count > 0 || state.nonprofit_count > 0) return 'inventory_only';
      return 'missing';
    default:
      return 'missing';
  }
}

function failureRowsForState(state, report, familyStatuses, legacySignal, fiveStateSignal, texasTruth) {
  const rows = [];
  const add = (familyId, severity, code, evidence, nextAction) => {
    rows.push({
      state: state.state_id,
      state_code: state.state_code,
      family: familyId,
      severity,
      failure_code: code,
      evidence,
      next_action: nextAction,
    });
  };

  if (report?.gatingPolicy === 'Eligible' && state.state_id !== 'texas') {
    add('launch_gate', 'critical', 'legacy_index_exposed_without_california_grade_reaudit', `Legacy state report still labels ${state.state_name} eligible/exposed, but California-grade audit has not re-proved county-grade gates.`, 'keep_noindex_and_run_state_repair_lane');
  }
  if (state.state_id === 'texas' && texasTruth?.index_safe === false) {
    add('launch_gate', 'critical', 'texas_not_index_safe_under_v9', `Texas v9 summary still shows ${texasTruth.v9.partial_counties} partial counties and index_safe=false.`, 'continue_texas_residual_manual_target_repair');
  }

  for (const family of FAMILY_DEFS.filter((item) => item.critical)) {
    const status = familyStatuses[family.familyId];
    if (status === 'verified_state_grade' || status === 'verified_county_grade') continue;

    if (status === 'legacy_state_grade' || status === 'inventory_only') {
      const weakEvidenceSummary = [];
      if (legacySignal?.dbFieldAgencyCount) weakEvidenceSummary.push(`${legacySignal.dbFieldAgencyCount} inventory rows use DB-field agency labels`);
      if (legacySignal?.federalMismatchCount) weakEvidenceSummary.push(`${legacySignal.federalMismatchCount} inventory rows show federal/state mismatch`);
      if (legacySignal?.genericRootCount) weakEvidenceSummary.push(`${legacySignal.genericRootCount} generic roots need leaf verification`);
      add(
        family.familyId,
        family.countyGradeEvidenceRequired ? 'critical' : 'major',
        family.countyGradeEvidenceRequired ? 'generic_or_statewide_evidence_used_where_local_required' : 'legacy_or_inventory_only_evidence',
        weakEvidenceSummary.length ? weakEvidenceSummary.join('; ') : `State has only ${status} evidence for ${family.label}.`,
        family.countyGradeEvidenceRequired ? 'author_county_or_district_exact_targets' : 'author_verified_state_manifest',
      );
      continue;
    }

    if (status === 'blocked' && fiveStateSignal) {
      const unresolvedCount = fiveStateSignal.unresolvedRows.length;
      const blockedCount = fiveStateSignal.blockedRows.length;
      add(
        family.familyId,
        'critical',
        'verified_pack_unresolved_or_blocked',
        `${state.state_name} five-state verified source-pack pass still has ${unresolvedCount} unresolved roles and ${blockedCount} blocked rows.`,
        'repair_verified_state_source_pack_then_retry_family',
      );
      continue;
    }

    add(
      family.familyId,
      family.countyGradeEvidenceRequired ? 'critical' : 'major',
      'missing_required_source_family',
      `${family.label} has no strong California-grade evidence for ${state.state_name}.`,
      family.countyGradeEvidenceRequired ? 'start_state_specific_repair_lane' : 'author_or_verify_statewide_source_family',
    );
  }
  return rows;
}

function classifyState(state, report, familyStatuses, failureRows, texasTruth) {
  if (state.state_id === 'texas' && texasTruth?.v9) {
    if (texasTruth.v9.partial_counties === 0 && texasTruth.v9.blocked_counties === 0) return 'COMPLETE';
    return 'PARTIAL';
  }

  const legacyLabel = report?.statusLabel || '';
  if (/KEEP_GATED \(Skeleton\)/i.test(legacyLabel)) return 'UNSTARTED';
  if (/KEEP_GATED \(Pilot\)/i.test(legacyLabel)) return 'BLOCKED';
  if (/READY_FOR_ALLOWLIST/i.test(legacyLabel)) return 'PARTIAL';
  if (/COMPLETE_WITH_LEGACY_EXCEPTION/i.test(legacyLabel)) return 'PARTIAL';

  const criticalFamilies = FAMILY_DEFS.filter((family) => family.critical).map((family) => family.familyId);
  const strongCount = criticalFamilies.filter((familyId) => ['verified_state_grade', 'verified_county_grade'].includes(familyStatuses[familyId])).length;
  const weakCount = criticalFamilies.filter((familyId) => ['legacy_state_grade', 'inventory_only'].includes(familyStatuses[familyId])).length;
  const missingCount = criticalFamilies.length - strongCount - weakCount;
  const countyGradeMissing = criticalFamilies.some((familyId) => FAMILY_DEFS.find((family) => family.familyId === familyId)?.countyGradeEvidenceRequired && familyStatuses[familyId] !== 'verified_county_grade');
  if (strongCount >= 7 && missingCount <= 2) return countyGradeMissing ? 'PARTIAL' : 'COMPLETE';
  if (strongCount >= 4 || weakCount >= 4) return 'BLOCKED';
  if (failureRows.length === 0) return 'UNSTARTED';
  return 'UNSTARTED';
}

function buildProcedureMarkdown() {
  return [
    '# All-State California-Grade Procedure v1',
    '',
    'This procedure generalizes the Texas v6-v9 repair pattern into a repeatable all-state framework. It is intentionally fail-closed: states remain `PARTIAL`, `BLOCKED`, or `UNSTARTED` until direct evidence proves California-grade requirements.',
    '',
    '## Core Rules',
    '',
    '1. Start from a truthful baseline and preserve existing failure ledgers.',
    '2. Separate statewide evidence from county/district-grade evidence.',
    '3. Never treat generic roots, search pages, statewide fallback, or weak keyword matches as county-grade proof.',
    '4. Keep every incomplete state `noindex` until all launch-critical gates pass.',
    '5. Run state-specific repair lanes before expanding broad scraping volume.',
    '6. Spot-audit repaired rows before changing a state classification.',
    '',
    '## State Classification',
    '',
    '- `COMPLETE`: every critical family is proven at the required authority/evidence level and the state is index-safe under the hardened gate.',
    '- `PARTIAL`: the state has a useful verified skeleton, but one or more county/district-grade or statewide critical families still fail the hardened gate.',
    '- `BLOCKED`: the state has data, but critical families are weak, generic, stale, or structurally unresolved.',
    '- `UNSTARTED`: the repo has only legacy skeleton signals or inventory hints and no credible California-grade repair lane has been completed yet.',
    '',
    '## Texas Lessons Carried Forward',
    '',
    '- Require direct district-owned education evidence for county PASS.',
    '- Preserve LIDDA / DD / EI / HHS failure ledgers instead of collapsing into optimistic PASS counts.',
    '- Treat Google Sites and scanned PDFs as conditional evidence only when ownership and text proof are preserved.',
    '- Keep states non-index-safe until the final county baseline shows no unresolved critical gaps.',
    '',
    '## Current Lesson Update',
    '',
    'This framework pass did not add a new reusable lesson beyond the existing Texas v6-v9 rules. The audit report explicitly says so unless a new verified cross-state rule is learned in a future run.',
    '',
  ].join('\n');
}

function buildLaneTemplatesMarkdown() {
  return [
    '# State Repair Lane Templates v1',
    '',
    'These lanes generalize the Texas repair sequence without pretending that one state-specific manifest fits all states.',
    '',
    '## 1. Official Manifest Repair',
    '- Input: state failure ledger, unresolved roles, legacy source inventory.',
    '- Output: repaired official domain manifest and reviewed exact-target queue.',
    '- Stop rule: do not fetch broad inventory rows directly.',
    '',
    '## 2. Medicaid / Waiver Repair',
    '- Verify Medicaid application, eligibility, waiver, appeal, fair-hearing, and local-office sources separately.',
    '- Reject generic health portals unless the exact workflow page is proven.',
    '',
    '## 3. DD / IDD Repair',
    '- Prove main DD authority, intake/application, eligibility, local/regional routing, and complaints separately.',
    '- County PASS cannot inherit statewide DD evidence.',
    '',
    '## 4. Early Intervention Repair',
    '- Prove Part C program, referral/intake, eligibility, local office directory, and family-rights/dispute path.',
    '- Generic developmental-delay explainers do not satisfy EI workflow roles.',
    '',
    '## 5. Special Education State-Level Repair',
    '- Prove safeguards, complaint, mediation, due-process, and IEP parent-rights pages at the state level.',
    '- Federal IDEA references support content but do not replace state-specific dispute pages.',
    '',
    '## 6. District / County Education Repair',
    '- Use direct district-owned pages, reviewed Google Sites, or document evidence with preserved text proof.',
    '- ESC, AskTED, or statewide directory fallback may keep a state operationally useful but cannot create county PASS by themselves.',
    '',
    '## 7. VR / Pre-ETS Repair',
    '- Prove state vocational rehabilitation and Pre-ETS entry pages separately from general transition content.',
    '',
    '## 8. P&A / PTI / Legal / ABLE Repair',
    '- Use first-party organization pages only.',
    '- State bar directories, generic legal-help aggregators, and general parent hubs stay out of the PASS path.',
    '',
    '## 9. Residual Manual Exact-Target Repair',
    '- Use for small-county or district residual failures after sitemap/domain discovery is exhausted.',
    '- Keep exact failure reasons visible (`manual_target_exhausted`, `district_homepage_broken`, etc.).',
    '',
    '## 10. Spot-Audit Pass',
    '- Re-open a sample of repaired rows and confirm the evidence snippet still supports the role.',
    '- Update lessons learned only when the audit changes a reusable rule.',
    '',
  ].join('\n');
}

function buildGatePolicy() {
  return {
    ruleVersion: 'all-state-california-grade-v1',
    passRequires: [
      'official source URL',
      'final URL after redirects',
      'fetched_at timestamp',
      'authority level',
      'evidence snippet',
      'evidence terms found',
      'source type',
      'confidence reason',
      'verification rule version',
    ],
    rejectAlways: [
      'generic national page when state-specific source required',
      'statewide page where county/district evidence required',
      'county/district page with no role-specific evidence',
      'search results',
      'social media as final source',
      'dead page',
      'unparsed pdf',
      'stale redirect without authority chain',
      'weak keyword-only match',
      'generic homepage',
      'old repo hint that conflicts with current official source',
    ],
    indexSafetyRule: 'index_safe may only be true when every critical family is complete and county/district-grade requirements are satisfied.',
  };
}

function buildRequiredFamilyRows() {
  return FAMILY_DEFS.map((family) => ({
    family_id: family.familyId,
    label: family.label,
    critical: family.critical,
    authority_level_required: family.authorityLevelRequired,
    accepted_source_types: family.acceptedSourceTypes,
    rejected_source_types: family.rejectedSourceTypes,
    evidence_fields_required: family.evidenceFieldsRequired,
    freshness_fields_required: family.freshnessFieldsRequired,
    county_grade_evidence_required: family.countyGradeEvidenceRequired,
    statewide_evidence_enough: family.statewideEvidenceEnough,
    launch_indexing_gate_impact: family.launchIndexingGateImpact,
  }));
}

function buildSchema() {
  return {
    schemaVersion: 'all-state-california-grade-schema-v1',
    generatedAt: new Date().toISOString(),
    stateClassificationValues: ['COMPLETE', 'PARTIAL', 'BLOCKED', 'UNSTARTED'],
    familyStatusValues: ['verified_county_grade', 'verified_state_grade', 'legacy_state_grade', 'inventory_only', 'blocked', 'missing'],
    requiredFamilies: buildRequiredFamilyRows(),
  };
}

function buildPilotReportMarkdown(auditState, gapRows, failureRows) {
  return [
    `# ${auditState.stateName} California-Grade Audit Report v1`,
    '',
    `- Classification: \`${auditState.classification}\``,
    `- Index safe: ${auditState.indexSafe ? 'yes' : 'no'}`,
    `- Legacy status label: \`${auditState.legacyStatusLabel}\``,
    `- Strong critical families: ${auditState.strongCriticalFamilies}/${auditState.totalCriticalFamilies}`,
    `- Missing critical families: ${auditState.missingCriticalFamilies}`,
    `- Weak/inventory-only critical families: ${auditState.weakCriticalFamilies}`,
    '',
    '## Family Status',
    '',
    ...gapRows.map((row) => `- ${row.family_label}: \`${row.family_status}\` (${row.status_reason})`),
    '',
    '## Failure Ledger Summary',
    '',
    ...(failureRows.length
      ? failureRows.slice(0, 12).map((row) => `- ${row.family}: \`${row.failure_code}\` -> ${row.next_action}`)
      : ['- No unresolved critical failures.']),
    '',
  ].join('\n');
}

function buildAuditReportMarkdown(auditSummary, states, failureRows, priorityRows) {
  const byClassification = states.reduce((acc, state) => {
    acc[state.classification] = (acc[state.classification] ?? 0) + 1;
    return acc;
  }, {});
  const incorrectlyIndexSafe = states.filter((state) => state.incorrectlyIndexSafe).map((state) => `${state.stateName} (${state.stateCode})`);
  const topBlocked = priorityRows.filter((row) => row.classification !== 'COMPLETE').slice(0, 10);

  return [
    '# All-State California-Grade Audit Report v1',
    '',
    `Generated at: ${auditSummary.generatedAt}`,
    '',
    '## Honest National Classification',
    '',
    `- COMPLETE: ${byClassification.COMPLETE ?? 0}`,
    `- PARTIAL: ${byClassification.PARTIAL ?? 0}`,
    `- BLOCKED: ${byClassification.BLOCKED ?? 0}`,
    `- UNSTARTED: ${byClassification.UNSTARTED ?? 0}`,
    '',
    '## Index-Safety Check',
    '',
    `- States currently proved index-safe under this hardened audit: ${states.filter((state) => state.indexSafe).length}`,
    `- States incorrectly exposed by older legacy reports or allowlists: ${incorrectlyIndexSafe.length ? incorrectlyIndexSafe.join(', ') : 'none'}`,
    '',
    '## Pilot States',
    '',
    ...PILOT_STATES.map((slug) => {
      const state = states.find((item) => item.stateId === slug);
      return `- ${state.stateName}: \`${state.classification}\` with ${state.strongCriticalFamilies}/${state.totalCriticalFamilies} strong critical families.`;
    }),
    '',
    '## Highest-Priority Next States',
    '',
    ...topBlocked.map((row, index) => `${index + 1}. ${row.state_name} (${row.state_code}) - ${row.recommended_batch}: ${row.primary_gap_reason}`),
    '',
    '## Failure Ledger Coverage',
    '',
    `- Unresolved critical failure rows: ${failureRows.length}`,
    `- Every non-complete state has explicit next-lane rows: ${states.filter((state) => state.classification !== 'COMPLETE').every((state) => failureRows.some((row) => row.state === state.stateId)) ? 'yes' : 'no'}`,
    '',
    '## Lessons Learned Update',
    '',
    '- No new reusable lesson was learned in this framework-only pass beyond the existing Texas v6-v9 rules. Existing lesson docs remain authoritative and unchanged.',
    '',
  ].join('\n');
}

function buildPriorityPlanMarkdown(priorityRows) {
  const fastest = priorityRows.filter((row) => row.recommended_batch === 'batch_1_fast_finish').slice(0, 10);
  const highestRisk = [...priorityRows].sort((a, b) => b.risk_score - a.risk_score).slice(0, 10);
  const hardenStates = priorityRows.filter((row) => row.recommended_batch === 'batch_3_procedure_hardening').slice(0, 10);
  const keepGated = priorityRows.filter((row) => row.index_safe === false).slice(0, 15);

  return [
    '# All-State Priority Plan v1',
    '',
    'Population/search value is approximated with county-count because no authoritative population table exists in the repo. The queue therefore weights county surface area, completeness, data risk, and likelihood of fast finish from current artifact evidence.',
    '',
    '## Fastest States To Finish',
    '',
    ...fastest.map((row) => `- ${row.state_name} (${row.state_code}) - completeness ${row.completeness_pct}% | missing critical families ${row.missing_critical_families}`),
    '',
    '## Highest-Risk States',
    '',
    ...highestRisk.map((row) => `- ${row.state_name} (${row.state_code}) - risk ${row.risk_score} | primary gap ${row.primary_gap_reason}`),
    '',
    '## Worst States To Harden The Procedure',
    '',
    ...hardenStates.map((row) => `- ${row.state_name} (${row.state_code}) - ${row.primary_gap_reason}`),
    '',
    '## States That Must Stay Gated',
    '',
    ...keepGated.map((row) => `- ${row.state_name} (${row.state_code}) - ${row.classification}`),
    '',
    '## Recommended Batch Order',
    '',
    '- Batch 1: fast-finish partial states with high search-value proxy and low unresolved-count friction.',
    '- Batch 2: blocked but structurally strong states where county/district proof is the main missing layer.',
    '- Batch 3: procedure-hardening states with weak manifests, unresolved critical roles, or known semantic failures.',
    '- Batch 4: unstarted skeleton states after the stronger patterns are proven.',
    '',
  ].join('\n');
}

export function generateAllStateCaliforniaGradeAudit() {
  ensureDir(generatedDir);
  ensureDir(docsGeneratedDir);

  const db = new Database(dbPath, { readonly: true });
  const stateReports = loadStateReports();
  const legacySourceSignals = loadLegacySourcePackSignals();
  const fiveState = loadFiveStatePackSignals();
  const texasTruth = loadTexasTruth();
  const stateMetrics = buildStateMetrics(db);
  db.close();

  const schema = buildSchema();
  const launchGatePolicy = buildGatePolicy();

  const gapRows = [];
  const failureRows = [];
  const nextActionRows = [];
  const auditStates = [];

  for (const state of stateMetrics) {
    const stateSlug = state.state_id;
    const report = stateReports.get(stateSlug) ?? {
      statusLabel: 'UNKNOWN',
      gateScore: 0,
      rawDepth: 0,
      manualReviewRate: 0,
      indexingPosture: 'Unknown',
      gatingPolicy: 'Unknown',
      allowlistedCountyCount: 0,
    };
    const legacySignal = legacySourceSignals.get(stateSlug) ?? null;
    const fiveStateSignal = fiveState.grouped.get(stateSlug) ?? null;
    const fiveStateSummary = fiveState.summaryBySlug.get(stateSlug) ?? null;

    const familyStatuses = {};
    for (const family of FAMILY_DEFS) {
      familyStatuses[family.familyId] = familyStatusForState(state, family.familyId, legacySignal, fiveStateSignal, texasTruth);
    }

    const stateFailureRows = failureRowsForState(state, report, familyStatuses, legacySignal, fiveStateSignal, texasTruth);
    const classification = classifyState(state, report, familyStatuses, stateFailureRows, texasTruth);
    const criticalFamilyIds = FAMILY_DEFS.filter((family) => family.critical).map((family) => family.familyId);
    const strongCriticalFamilies = criticalFamilyIds.filter((familyId) => ['verified_state_grade', 'verified_county_grade'].includes(familyStatuses[familyId])).length;
    const weakCriticalFamilies = criticalFamilyIds.filter((familyId) => ['legacy_state_grade', 'inventory_only'].includes(familyStatuses[familyId])).length;
    const missingCriticalFamilies = criticalFamilyIds.length - strongCriticalFamilies - weakCriticalFamilies;
    const completenessPct = Math.round((strongCriticalFamilies / criticalFamilyIds.length) * 100);
    const indexSafe = classification === 'COMPLETE';
    const incorrectlyIndexSafe = /Eligible/i.test(report.gatingPolicy) || /Exposed/i.test(report.indexingPosture)
      ? !indexSafe
      : false;

    for (const family of FAMILY_DEFS) {
      const status = familyStatuses[family.familyId];
      const statusReason = status === 'verified_county_grade'
        ? 'direct county/district-grade evidence exists'
        : status === 'verified_state_grade'
          ? 'statewide evidence is present at the required authority level'
          : status === 'legacy_state_grade'
            ? 'statewide or structural evidence exists, but not California-grade proof'
            : status === 'inventory_only'
              ? 'only legacy inventory hints or weak role matches exist'
              : status === 'blocked'
                ? 'existing verified-pack or audit evidence is unresolved or blocked'
                : 'no credible current evidence';

      gapRows.push({
        state: stateSlug,
        state_code: state.state_code,
        state_name: state.state_name,
        family: family.familyId,
        family_label: family.label,
        family_status: status,
        critical: family.critical,
        county_grade_required: family.countyGradeEvidenceRequired,
        statewide_enough: family.statewideEvidenceEnough,
        status_reason: statusReason,
      });
    }

    failureRows.push(...stateFailureRows);

    const primaryGap = stateFailureRows[0]?.failure_code ?? 'no_explicit_gap';
    const nextLane = stateFailureRows[0]?.next_action ?? (classification === 'COMPLETE' ? 'maintain_and_spot_audit' : 'start_state_specific_repair_lane');
    nextActionRows.push({
      state: stateSlug,
      state_code: state.state_code,
      state_name: state.state_name,
      classification,
      next_lane: nextLane,
      primary_gap_reason: primaryGap,
      missing_critical_families: missingCriticalFamilies,
      strong_critical_families: strongCriticalFamilies,
    });

    auditStates.push({
      stateId: stateSlug,
      stateCode: state.state_code,
      stateName: state.state_name,
      classification,
      indexSafe,
      incorrectlyIndexSafe,
      legacyStatusLabel: report.statusLabel,
      legacyGateScore: report.gateScore,
      legacyRawDepthScore: report.rawDepth,
      legacyManualReviewRate: report.manualReviewRate,
      legacyAllowlistedCountyCount: report.allowlistedCountyCount,
      countyCount: state.county_count,
      strongCriticalFamilies,
      weakCriticalFamilies,
      missingCriticalFamilies,
      totalCriticalFamilies: criticalFamilyIds.length,
      completenessPct,
      dbMetrics: state,
      sourcePackV2: fiveStateSummary,
      familyStatuses,
    });
  }

  const priorityRows = auditStates.map((state) => {
    const valueScore = state.countyCount;
    const riskScore = Math.round(
      state.missingCriticalFamilies * 12
      + state.weakCriticalFamilies * 5
      + (state.incorrectlyIndexSafe ? 30 : 0)
      + (state.sourcePackV2?.unresolvedCriticalRoles ?? 0)
      + (state.legacyManualReviewRate ?? 0),
    );
    const fastCompletionScore = Math.max(0, 100 - state.missingCriticalFamilies * 10 - state.weakCriticalFamilies * 5 - (state.sourcePackV2?.unresolvedCriticalRoles ?? 0));
    const priorityScore = Math.round((valueScore * 0.4) + (riskScore * 0.35) + (fastCompletionScore * 0.25));
    const recommendedBatch = state.classification === 'PARTIAL'
      ? 'batch_1_fast_finish'
      : (
        state.classification === 'UNSTARTED'
        || /Skeleton/i.test(state.legacyStatusLabel)
        || (state.sourcePackV2?.unresolvedCriticalRoles ?? 0) >= 30
      )
        ? 'batch_3_procedure_hardening'
        : 'batch_2_repair_blocked';

    return {
      state: state.stateId,
      state_code: state.stateCode,
      state_name: state.stateName,
      classification: state.classification,
      index_safe: state.indexSafe,
      completeness_pct: state.completenessPct,
      search_value_proxy: valueScore,
      risk_score: riskScore,
      fast_completion_score: fastCompletionScore,
      priority_score: priorityScore,
      missing_critical_families: state.missingCriticalFamilies,
      weak_critical_families: state.weakCriticalFamilies,
      primary_gap_reason: nextActionRows.find((row) => row.state === state.stateId)?.primary_gap_reason ?? 'unknown',
      recommended_batch: recommendedBatch,
    };
  }).sort((a, b) => {
    const batchRank = {
      batch_1_fast_finish: 1,
      batch_2_repair_blocked: 2,
      batch_3_procedure_hardening: 3,
    };
    if (batchRank[a.recommended_batch] !== batchRank[b.recommended_batch]) {
      return batchRank[a.recommended_batch] - batchRank[b.recommended_batch];
    }
    if (PRIORITY_STATES_FROM_SPEC.includes(a.state) && !PRIORITY_STATES_FROM_SPEC.includes(b.state)) return -1;
    if (!PRIORITY_STATES_FROM_SPEC.includes(a.state) && PRIORITY_STATES_FROM_SPEC.includes(b.state)) return 1;
    return b.priority_score - a.priority_score;
  });

  const auditSummary = {
    generatedAt: new Date().toISOString(),
    stateCount: auditStates.length,
    classifications: auditStates.reduce((acc, state) => {
      acc[state.classification] = (acc[state.classification] ?? 0) + 1;
      return acc;
    }, {}),
    indexSafeCount: auditStates.filter((state) => state.indexSafe).length,
    incorrectlyIndexSafeStates: auditStates.filter((state) => state.incorrectlyIndexSafe).map((state) => state.stateId),
    pilotStates: PILOT_STATES,
    lessonsUpdate: 'No new reusable lesson was learned in this framework-only pass beyond the existing Texas v6-v9 rules.',
    states: auditStates,
  };

  writeJson(OUTPUTS.schemaJson, schema);
  writeJsonl(OUTPUTS.requiredFamiliesJsonl, buildRequiredFamilyRows());
  writeJson(OUTPUTS.launchGatePolicyJson, launchGatePolicy);
  fs.writeFileSync(OUTPUTS.procedureMd, `${buildProcedureMarkdown()}\n`);
  fs.writeFileSync(OUTPUTS.laneTemplatesMd, `${buildLaneTemplatesMarkdown()}\n`);
  writeJson(OUTPUTS.auditJson, auditSummary);
  writeJsonl(OUTPUTS.gapMatrixJsonl, gapRows);
  writeJsonl(OUTPUTS.failureLedgerJsonl, failureRows);
  writeJsonl(OUTPUTS.nextActionQueueJsonl, nextActionRows);
  writeJsonl(OUTPUTS.priorityQueueJsonl, priorityRows);
  fs.writeFileSync(OUTPUTS.auditReportMd, `${buildAuditReportMarkdown(auditSummary, auditStates, failureRows, priorityRows)}\n`);
  fs.writeFileSync(OUTPUTS.priorityPlanMd, `${buildPriorityPlanMarkdown(priorityRows)}\n`);

  for (const stateSlug of PILOT_STATES) {
    const state = auditStates.find((row) => row.stateId === stateSlug);
    const stateGapRows = gapRows.filter((row) => row.state === stateSlug);
    const stateFailureRows = failureRows.filter((row) => row.state === stateSlug);
    const stateNextRows = nextActionRows.filter((row) => row.state === stateSlug);
    writeJson(path.join(generatedDir, `${stateSlug}_california_grade_summary_v1.json`), state);
    writeJsonl(path.join(generatedDir, `${stateSlug}_gap_matrix_v1.jsonl`), stateGapRows);
    writeJsonl(path.join(generatedDir, `${stateSlug}_failure_ledger_v1.jsonl`), stateFailureRows);
    writeJsonl(path.join(generatedDir, `${stateSlug}_next_action_queue_v1.jsonl`), stateNextRows);
    fs.writeFileSync(path.join(docsGeneratedDir, `${stateSlug}-california-grade-audit-report-v1.md`), `${buildPilotReportMarkdown(state, stateGapRows, stateFailureRows)}\n`);
  }

  return {
    schema,
    launchGatePolicy,
    auditSummary,
    gapRows,
    failureRows,
    nextActionRows,
    priorityRows,
  };
}

if (process.argv[1] === __filename) {
  const result = generateAllStateCaliforniaGradeAudit();
  console.log(JSON.stringify({
    ok: true,
    stateCount: result.auditSummary.stateCount,
    classifications: result.auditSummary.classifications,
    indexSafeCount: result.auditSummary.indexSafeCount,
    incorrectlyIndexSafeStates: result.auditSummary.incorrectlyIndexSafeStates,
  }, null, 2));
}
