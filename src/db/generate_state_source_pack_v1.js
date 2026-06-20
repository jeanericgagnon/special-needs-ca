import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const sourcePacksDir = path.join(repoRoot, 'data', 'source_packs');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const generatedDate = new Date().toISOString().slice(0, 10);

const taxonomyOutPath = path.join(generatedDir, 'state_source_taxonomy_v1.json');
const sourcePackOutPath = path.join(generatedDir, 'all_states_source_pack_v1.jsonl');
const summaryOutPath = path.join(generatedDir, 'state_source_pack_summary_v1.csv');
const gapsOutPath = path.join(generatedDir, 'state_source_pack_gaps_v1.jsonl');
const methodologyOutPath = path.join(docsDir, 'state-source-pack-methodology-v1.md');

const BATCH_CLASSES = new Set(['html', 'pdf', 'document', 'spreadsheet', 'portal', 'directory_root']);
const PRIORITIES = ['critical', 'high', 'medium', 'low'];
const STATUSES = ['verified_target', 'target_candidate', 'blocked_known', 'needs_review'];
const AUTHORITIES = [
  'official_state',
  'official_county',
  'official_local',
  'official_federal',
  'protection_advocacy',
  'legal_aid',
  'high_authority_nonprofit',
];

const FEDERAL_DOMAINS = new Set([
  'ssa.gov',
  'www.ssa.gov',
  'medicaid.gov',
  'www.medicaid.gov',
  'ed.gov',
  'www.ed.gov',
  'sites.ed.gov',
  'cdc.gov',
  'www.cdc.gov',
  'acl.gov',
  'www.acl.gov',
  'dol.gov',
  'www.dol.gov',
]);

const HIGH_AUTHORITY_DOMAINS = new Set([
  'parentcenterhub.org',
  'familyvoices.org',
  'wrightslaw.com',
  'disabilityrightsca.org',
  'dralegal.org',
  'thegao.org',
  'thearc.org',
  'ablenrc.org',
]);

const DISALLOWED_DOMAINS = new Set([
  'facebook.com',
  'instagram.com',
  'x.com',
  'twitter.com',
  'youtube.com',
  'copaa.org',
]);

const CATEGORY_DEFINITIONS = [
  {
    categoryId: 'dd_system',
    categoryLabel: 'Developmental disability agency / regional system',
    criticalForLaunch: true,
    roles: [
      role('main_dd_agency', 'Main DD agency', 'critical', ['official_state', 'official_local'], ['html', 'portal'], 1, 'counts_toward_critical', 'Primary statewide DD or regional-center system root.'),
      role('dd_eligibility', 'DD eligibility', 'critical', ['official_state', 'official_local'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'Eligibility criteria, process, or screening pages.'),
      role('dd_intake_application', 'DD intake/application', 'critical', ['official_state', 'official_local'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'Application, intake, referral, or enrollment start pages.'),
      role('dd_local_regional_office_directory', 'DD local/regional office directory', 'critical', ['official_state', 'official_local'], ['html', 'directory_root', 'spreadsheet'], 1, 'counts_toward_critical', 'Regional center or local DD office directory.'),
      role('dd_service_planning', 'DD service planning', 'high', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'IPP, plan-development, or care-planning pages.'),
      role('dd_waiver_programs', 'DD waiver programs', 'critical', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_critical', 'DD waiver overview or DD-specific waiver workflow pages.'),
      role('dd_self_determination', 'Self-direction/self-determination', 'high', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Self-direction or self-determination program pages.'),
      role('dd_crisis_emergency_services', 'Crisis/emergency services', 'high', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Crisis, emergency response, or urgent DD supports.'),
      role('dd_appeals_complaints', 'Appeals/complaints', 'critical', ['official_state', 'official_local'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'Complaints, hearings, appeals, or grievance routes.'),
      role('dd_provider_directory', 'DD provider directory', 'high', ['official_state', 'official_local'], ['html', 'directory_root', 'spreadsheet', 'portal'], 1, 'counts_toward_supporting', 'Official provider roster or directory.'),
      role('dd_service_standards_policies', 'Service standards/policies', 'high', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Policy manuals, service standards, or guidance.'),
    ],
  },
  {
    categoryId: 'medicaid_and_waivers',
    categoryLabel: 'Medicaid / Medicaid waiver / EPSDT',
    criticalForLaunch: true,
    roles: [
      role('medicaid_application', 'Medicaid application', 'critical', ['official_state', 'official_county', 'official_local'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'Application or apply-now pages.'),
      role('medicaid_eligibility', 'Medicaid eligibility', 'critical', ['official_state', 'official_county', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_critical', 'Eligibility requirements or qualifying rules.'),
      role('childrens_medicaid_chip', 'Children’s Medicaid/CHIP', 'high', ['official_state', 'official_federal'], ['html', 'pdf', 'portal'], 1, 'counts_toward_supporting', 'Child health or CHIP program pages.'),
      role('epsdt_child_health_benefit', 'EPSDT/child health benefit', 'high', ['official_state', 'official_federal'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'EPSDT benefit or child screening benefit pages.'),
      role('personal_care_attendant_care', 'Personal care/attendant care', 'high', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Personal care or attendant care benefit pages.'),
      role('hcbs_waivers', 'HCBS waivers', 'critical', ['official_state', 'official_federal'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'HCBS waiver entry or authority pages.'),
      role('managed_care_plan_directory', 'Managed care plan directory', 'high', ['official_state', 'official_local'], ['html', 'directory_root', 'portal'], 1, 'counts_toward_supporting', 'Official plan lookup or directory pages.'),
      role('medicaid_grievances_appeals', 'Grievances/appeals', 'critical', ['official_state', 'official_local'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'Managed-care or FFS appeal routes.'),
      role('medicaid_fair_hearing', 'Fair hearing', 'critical', ['official_state', 'official_local'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'Fair-hearing or hearing-request pages.'),
      role('medicaid_aid_paid_pending', 'Aid-paid-pending/continuation', 'high', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Benefit-continuation or pending-aid guidance.'),
      role('medicaid_renewals_redeterminations', 'Renewals/redeterminations', 'high', ['official_state', 'official_local'], ['html', 'pdf', 'portal'], 1, 'counts_toward_supporting', 'Renewal, recertification, or redetermination pages.'),
    ],
  },
  {
    categoryId: 'early_intervention',
    categoryLabel: 'Early intervention',
    criticalForLaunch: true,
    roles: [
      role('ei_part_c_program', 'Part C/birth-to-three program', 'critical', ['official_state', 'official_local'], ['html', 'portal'], 1, 'counts_toward_critical', 'State early intervention program root.'),
      role('ei_referral_intake', 'Referral/intake', 'critical', ['official_state', 'official_local'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'Referral or intake pages.'),
      role('ei_eligibility', 'Eligibility', 'critical', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_critical', 'Eligibility criteria and referral thresholds.'),
      role('ei_family_rights', 'Family rights', 'high', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Parent/family rights and safeguards.'),
      role('ei_transition_age_three', 'Transition at age three', 'high', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Age-three transition guidance.'),
      role('ei_local_office_directory', 'Local EI office/directory', 'critical', ['official_state', 'official_local'], ['html', 'directory_root', 'spreadsheet'], 1, 'counts_toward_critical', 'Local EI office, referral point, or FRC directory.'),
      role('ei_complaints_mediation_due_process', 'Complaints/mediation/due process', 'critical', ['official_state', 'official_local'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'Complaint or due-process routes.'),
    ],
  },
  {
    categoryId: 'education_and_disputes',
    categoryLabel: 'Education / IEP / Section 504',
    criticalForLaunch: true,
    roles: [
      role('special_education_parent_rights', 'State special education parent rights', 'critical', ['official_state', 'official_local', 'high_authority_nonprofit'], ['html', 'pdf'], 1, 'counts_toward_critical', 'Parent rights or procedural safeguards.'),
      role('iep_process', 'IEP process', 'critical', ['official_state', 'official_local', 'high_authority_nonprofit'], ['html', 'pdf'], 1, 'counts_toward_critical', 'IEP process or meeting guidance.'),
      role('prior_written_notice', 'Prior written notice', 'high', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'PWN or notice guidance.'),
      role('evaluations_iee', 'Evaluations/IEE', 'high', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Evaluations and independent educational evaluations.'),
      role('special_education_mediation', 'Mediation', 'critical', ['official_state', 'official_local'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'Mediation program or request pages.'),
      role('state_complaints', 'State complaints', 'critical', ['official_state', 'official_local'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'State complaint guidance or filing pages.'),
      role('special_education_due_process', 'Due process', 'critical', ['official_state', 'official_local'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'Due-process hearing or filing routes.'),
      role('school_district_directory', 'School district directory', 'critical', ['official_state', 'official_local'], ['html', 'directory_root', 'spreadsheet'], 1, 'counts_toward_critical', 'State or local district directory.'),
      role('regional_education_directory', 'Regional education agencies/SELPAs/IUs/cooperatives', 'critical', ['official_state', 'official_local'], ['html', 'directory_root', 'spreadsheet'], 1, 'counts_toward_critical', 'Regional routing or SELPA pages.'),
      role('parent_training_information_center', 'Parent training and information centers', 'critical', ['high_authority_nonprofit'], ['html'], 1, 'counts_toward_supporting', 'PTI or parent-center resources.'),
      role('section_504_guidance', 'Section 504 guidance', 'high', ['official_state', 'official_federal', 'high_authority_nonprofit'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Section 504 rights and dispute guidance.'),
    ],
  },
  {
    categoryId: 'state_benefit_supports',
    categoryLabel: 'State benefit programs and disability-specific supports',
    criticalForLaunch: false,
    roles: [
      role('medically_fragile_children_programs', 'Medically fragile children programs', 'high', ['official_state'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Complex-care or medically fragile child programs.'),
      role('childrens_special_health_services', 'Children’s special health services', 'high', ['official_state'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Children’s special-health or CCS-like programs.'),
      role('autism_programs', 'Autism programs', 'high', ['official_state', 'high_authority_nonprofit'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'State autism program or benefit pages.'),
      role('hearing_aid_programs', 'Hearing aid programs', 'medium', ['official_state'], ['html', 'pdf', 'portal'], 1, 'counts_toward_supporting', 'Hearing aid coverage or subsidy programs.'),
      role('respite_programs', 'Respite programs', 'medium', ['official_state', 'official_local', 'high_authority_nonprofit'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Respite program or voucher pages.'),
      role('family_support_programs', 'Family support programs', 'medium', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Family support or subsidy pages.'),
      role('assistive_technology', 'Assistive technology', 'medium', ['official_state', 'high_authority_nonprofit'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'AT lending, training, or acquisition pages.'),
      role('durable_medical_equipment', 'Durable medical equipment', 'medium', ['official_state', 'official_federal'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'DME or equipment guidance.'),
      role('transportation_assistance', 'Transportation assistance', 'medium', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Transportation benefit or subsidy pages.'),
      role('home_modification_programs', 'Home modification programs', 'medium', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Home-modification grants or benefits.'),
    ],
  },
  {
    categoryId: 'federal_state_crossover',
    categoryLabel: 'Federal/state crossover',
    criticalForLaunch: true,
    roles: [
      role('ssi_child_disability', 'SSI child disability', 'critical', ['official_federal'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'Child SSI entry pages.'),
      role('ssi_appeals', 'SSI appeals', 'high', ['official_federal'], ['html', 'pdf', 'portal'], 1, 'counts_toward_supporting', 'SSI appeal routes.'),
      role('age_18_redetermination', 'Age-18 redetermination', 'high', ['official_federal'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Age-18 SSI redetermination pages.'),
      role('able_account_program', 'ABLE account program', 'critical', ['official_state', 'official_federal', 'high_authority_nonprofit'], ['html', 'pdf', 'portal'], 1, 'counts_toward_supporting', 'State or national ABLE entry pages.'),
      role('vocational_rehabilitation', 'Vocational rehabilitation', 'critical', ['official_state', 'official_federal'], ['html', 'pdf', 'portal'], 1, 'counts_toward_critical', 'State VR pages.'),
      role('pre_ets', 'Pre-ETS', 'high', ['official_state', 'official_federal'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Pre-employment transition services.'),
      role('supported_employment', 'Supported employment', 'high', ['official_state', 'official_local'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Supported employment programs.'),
      role('supported_decision_making', 'Supported decision-making', 'high', ['official_state', 'high_authority_nonprofit'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Supported decision-making guidance.'),
      role('guardianship_conservatorship_alternatives', 'Guardianship/conservatorship alternatives', 'high', ['official_state', 'official_local', 'high_authority_nonprofit'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Alternatives to guardianship/conservatorship.'),
      role('special_needs_trusts_future_planning', 'Special needs trusts/future planning', 'high', ['official_state', 'official_federal', 'high_authority_nonprofit'], ['html', 'pdf'], 1, 'counts_toward_supporting', 'Future-planning, trusts, and planning guidance.'),
    ],
  },
  {
    categoryId: 'local_resource_directories',
    categoryLabel: 'Local resource directories',
    criticalForLaunch: true,
    roles: [
      role('county_human_services_offices', 'County human services offices', 'critical', ['official_county', 'official_local', 'official_state'], ['html', 'directory_root', 'spreadsheet'], 1, 'counts_toward_critical', 'County human-services routing.'),
      role('dd_regional_offices', 'DD regional offices', 'critical', ['official_state', 'official_local'], ['html', 'directory_root', 'spreadsheet'], 1, 'counts_toward_critical', 'DD regional office directories.'),
      role('medicaid_local_offices', 'Medicaid local offices', 'critical', ['official_state', 'official_county', 'official_local'], ['html', 'directory_root', 'spreadsheet'], 1, 'counts_toward_critical', 'Medicaid office routing.'),
      role('early_intervention_local_offices', 'Early Intervention local offices', 'critical', ['official_state', 'official_local'], ['html', 'directory_root', 'spreadsheet'], 1, 'counts_toward_critical', 'EI local office directories.'),
      role('school_districts_local', 'School districts', 'critical', ['official_state', 'official_local'], ['html', 'directory_root', 'spreadsheet'], 1, 'counts_toward_critical', 'District directories used for routing.'),
      role('parent_centers_pti', 'Parent centers/PTIs', 'critical', ['high_authority_nonprofit'], ['html'], 1, 'counts_toward_supporting', 'Parent centers and PTI directories.'),
      role('legal_aid_resources', 'Legal aid', 'critical', ['legal_aid'], ['html', 'directory_root'], 1, 'counts_toward_supporting', 'Legal aid routing pages.'),
      role('protection_advocacy_resources', 'Disability rights/protection and advocacy', 'critical', ['protection_advocacy'], ['html'], 1, 'counts_toward_supporting', 'P&A or disability-rights pages.'),
      role('respite_provider_directories', 'Respite providers', 'medium', ['official_state', 'official_local', 'high_authority_nonprofit'], ['html', 'directory_root', 'spreadsheet'], 1, 'counts_toward_supporting', 'Respite provider listings.'),
      role('therapy_provider_directories', 'Therapy/provider directories', 'critical', ['official_state', 'official_local', 'high_authority_nonprofit'], ['html', 'directory_root', 'spreadsheet', 'portal'], 1, 'counts_toward_supporting', 'Therapy, clinic, or provider directories.'),
      role('housing_resources', 'Housing/disability housing resources', 'medium', ['official_state', 'official_local', 'high_authority_nonprofit'], ['html', 'directory_root'], 1, 'counts_toward_supporting', 'Housing resource directories.'),
      role('transportation_paratransit_resources', 'Transportation/paratransit resources', 'medium', ['official_state', 'official_local'], ['html', 'directory_root'], 1, 'counts_toward_supporting', 'Transportation or paratransit resources.'),
    ],
  },
];

const APPEALS_ROLE_IDS = new Set([
  'dd_appeals_complaints',
  'medicaid_grievances_appeals',
  'medicaid_fair_hearing',
  'ei_complaints_mediation_due_process',
  'special_education_mediation',
  'state_complaints',
  'special_education_due_process',
  'ssi_appeals',
]);

const ADULT_TRANSITION_ROLE_IDS = new Set([
  'able_account_program',
  'vocational_rehabilitation',
  'pre_ets',
  'supported_employment',
  'supported_decision_making',
  'guardianship_conservatorship_alternatives',
  'special_needs_trusts_future_planning',
]);

const HOUSING_TRANSPORT_ROLE_IDS = new Set([
  'home_modification_programs',
  'transportation_assistance',
  'housing_resources',
  'transportation_paratransit_resources',
]);

const CRITICAL_ROLE_IDS = new Set(
  CATEGORY_DEFINITIONS.flatMap((category) => category.roles.filter((roleMeta) => roleMeta.priority === 'critical').map((roleMeta) => roleMeta.roleId)),
);

const ROLE_INDEX = new Map();
for (const category of CATEGORY_DEFINITIONS) {
  for (const roleMeta of category.roles) {
    ROLE_INDEX.set(roleMeta.roleId, { ...roleMeta, workflowCategory: category.categoryId, workflowCategoryLabel: category.categoryLabel });
  }
}

function role(roleId, roleLabel, priority, allowedAuthorities, allowedBatchClasses, minTargets, countsTowardCompleteness, notes) {
  return { roleId, roleLabel, priority, allowedAuthorities, allowedBatchClasses, minTargets, countsTowardCompleteness, notes };
}

function readJson(filePath, fallback = null) {
  if (!filePath || !fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeNdjson(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function writeCsv(filePath, rows, headers) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header] ?? '')).join(','));
  }
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`);
}

function csvEscape(value) {
  const serialized = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  if (/[",\n]/.test(serialized)) return `"${serialized.replace(/"/g, '""')}"`;
  return serialized;
}

function latestGeneratedJson(prefix, required = true) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    if (required) throw new Error(`Missing generated artifact for prefix "${prefix}"`);
    return null;
  }
  return path.join(docsDir, matches.at(-1));
}

function normalizeUrl(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return '';
  try {
    const parsed = new URL(value);
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) parsed.port = '';
    return parsed.toString();
  } catch {
    return value.replace(/\/+$/, '');
  }
}

function domainFor(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function countBy(rows, key) {
  return rows.reduce((accumulator, row) => {
    const bucket = row[key] || 'unknown';
    accumulator[bucket] = (accumulator[bucket] || 0) + 1;
    return accumulator;
  }, {});
}

function repoRelative(targetPath) {
  return path.relative(repoRoot, targetPath).replace(/\\/g, '/');
}

function parseNdjson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean).map((line) => JSON.parse(line));
}

function normalizeStateId(value) {
  return String(value || '').trim().toLowerCase().replace(/_/g, '-');
}

function normalizedText(...parts) {
  return parts.flat().filter(Boolean).join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

function inferBatchClassFromCrawlMethod(method, url = '') {
  const text = normalizedText(method, url);
  if (/portal|login|secure|gateway/.test(text)) return 'portal';
  if (/spreadsheet|xlsx|xls|csv/.test(text)) return 'spreadsheet';
  if (/pdf/.test(text) || /\.pdf(\?|$)/.test(text)) return 'pdf';
  if (/docx?|rtf/.test(text)) return 'document';
  if (/directory/.test(text)) return 'directory_root';
  return 'html';
}

function inferExpectedContentType(batchClass, url = '') {
  if (batchClass === 'pdf') return 'application/pdf';
  if (batchClass === 'spreadsheet') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (batchClass === 'document') return 'application/octet-stream';
  if (batchClass === 'portal') return 'text/html';
  if (batchClass === 'directory_root') return 'text/html';
  if (/\.pdf(\?|$)/i.test(url)) return 'application/pdf';
  return 'text/html';
}

function isAllowedHighAuthorityDomain(domain) {
  return HIGH_AUTHORITY_DOMAINS.has(domain) || domain.endsWith('.org');
}

function classifyAuthority(seed) {
  const domain = domainFor(seed.url);
  const text = normalizedText(seed.sourceName, seed.organizationType, seed.notes, seed.family, seed.category, seed.sourceRole);
  if (!domain || DISALLOWED_DOMAINS.has(domain)) return '';
  if (FEDERAL_DOMAINS.has(domain) || /\bu\.?s\.?\b|federal|ssa|cms|medicaid\.gov|cdc|acl/.test(text)) return 'official_federal';
  if (/disability rights|protection and advocacy|\bp&a\b/.test(text)) return 'protection_advocacy';
  if (/legal aid|legal services|lawhelp/.test(text)) return 'legal_aid';
  if (/parent training|parent center|family voices|pti|fec|family-to-family/.test(text)) return 'high_authority_nonprofit';
  if (isAllowedHighAuthorityDomain(domain) && /(parent center|disability rights|arc|family|autism|able)/.test(text)) return 'high_authority_nonprofit';
  if (domain.endsWith('.gov')) {
    if (/county|parish|district|board of education|school district|regional center|selpa|iu|intermediate unit|local/.test(text)) {
      return /county|parish/.test(text) ? 'official_county' : 'official_local';
    }
    return 'official_state';
  }
  return '';
}

function inferPriority(roleId) {
  return ROLE_INDEX.get(roleId)?.priority || 'low';
}

function isDirectoryKind(seed) {
  const text = normalizedText(seed.sourceName, seed.sourceRole, seed.notes, seed.category, seed.specificSubcategory, seed.targetTable, seed.url);
  return /directory|offices|locations|districts|regional|roster|providers|plan finder|school directory|county offices/.test(text);
}

function inferTargetKind(seed, roleId) {
  if (isDirectoryKind(seed)) return 'directory_root';
  if (ROLE_INDEX.get(roleId)?.allowedAuthorities.includes('official_federal')) {
    const authority = classifyAuthority(seed);
    if (authority === 'official_federal') return 'federal_reference';
  }
  const text = normalizedText(seed.sourceName, seed.sourceRole, seed.notes, seed.category, seed.specificSubcategory);
  if (/landing page|overview|home|root/.test(text)) return 'official_root';
  return 'leaf_workflow_page';
}

function stateNameTitle(stateId) {
  return String(stateId || '').split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function buildRoleMatchers() {
  return [
    match('education_and_disputes', 'special_education_due_process', /due process|oah|hearing request|hearing office|secure filing/i),
    match('education_and_disputes', 'state_complaints', /state complaint|complaint procedures?|file a complaint/i),
    match('education_and_disputes', 'special_education_mediation', /mediation/i),
    match('education_and_disputes', 'section_504_guidance', /section 504|504 plan/i),
    match('education_and_disputes', 'evaluations_iee', /\biee\b|independent educational evaluation|special education evaluation/i),
    match('education_and_disputes', 'prior_written_notice', /prior written notice|\bpwn\b/i),
    match('education_and_disputes', 'school_district_directory', /school district directory|school directory|district directory/i),
    match('education_and_disputes', 'regional_education_directory', /selpa|intermediate unit|regional education|cooperative/i),
    match('education_and_disputes', 'parent_training_information_center', /parent training|parent center|pti|family empowerment center|fec/i),
    match('education_and_disputes', 'special_education_parent_rights', /procedural safeguards|parent rights|rights and responsibilities/i),
    match('education_and_disputes', 'iep_process', /\biep\b|individualized education program|special education process/i),

    match('early_intervention', 'ei_complaints_mediation_due_process', /early intervention.*complaint|part c.*due process|mediation.*early intervention/i),
    match('early_intervention', 'ei_transition_age_three', /age three|age 3|transition.*three|transition.*part c/i),
    match('early_intervention', 'ei_family_rights', /family rights|parent rights|procedural safeguards/i),
    match('early_intervention', 'ei_referral_intake', /referral|intake|make a referral|refer a child/i),
    match('early_intervention', 'ei_eligibility', /eligibility/i),
    match('early_intervention', 'ei_local_office_directory', /family resource center|local offices?|service coordinators?|regional offices?/i),
    match('early_intervention', 'ei_part_c_program', /early intervention|early start|part c|birth to three|infant toddler/i),

    match('medicaid_and_waivers', 'medicaid_aid_paid_pending', /aid paid pending|benefits pending|continue benefits/i),
    match('medicaid_and_waivers', 'medicaid_fair_hearing', /fair hearing|hearing request|administrative hearing/i),
    match('medicaid_and_waivers', 'medicaid_grievances_appeals', /grievance|appeal/i),
    match('medicaid_and_waivers', 'medicaid_renewals_redeterminations', /renewal|redetermination|recertification/i),
    match('medicaid_and_waivers', 'managed_care_plan_directory', /plan directory|managed care plan|find a plan|plan finder/i),
    match('medicaid_and_waivers', 'epsdt_child_health_benefit', /epsdt|early periodic screening|child health benefit/i),
    match('medicaid_and_waivers', 'childrens_medicaid_chip', /\bchip\b|children'?s medicaid|kids health/i),
    match('medicaid_and_waivers', 'personal_care_attendant_care', /personal care|attendant care|home care services/i),
    match('medicaid_and_waivers', 'hcbs_waivers', /hcbs|home and community based services|waiver/i),
    match('medicaid_and_waivers', 'medicaid_eligibility', /medicaid eligibility|medi-cal eligibility|qualify for medicaid/i),
    match('medicaid_and_waivers', 'medicaid_application', /apply|application|how to apply|medicaid portal|benefits portal/i),

    match('dd_system', 'dd_provider_directory', /provider directory|regional centers? directory|vendor directory|provider list/i),
    match('dd_system', 'dd_service_standards_policies', /service standards?|policy|manual|directive|guidelines/i),
    match('dd_system', 'dd_appeals_complaints', /appeal|complaint|grievance|fair hearing/i),
    match('dd_system', 'dd_crisis_emergency_services', /crisis|emergency/i),
    match('dd_system', 'dd_self_determination', /self[- ]determination|self[- ]direction/i),
    match('dd_system', 'dd_service_planning', /individual program plan|ipp|service planning|person centered plan/i),
    match('dd_system', 'dd_waiver_programs', /waiver|hcbs/i),
    match('dd_system', 'dd_local_regional_office_directory', /regional center|regional office|local office|office directory/i),
    match('dd_system', 'dd_intake_application', /intake|apply|application|referral/i),
    match('dd_system', 'dd_eligibility', /eligibility/i),
    match('dd_system', 'main_dd_agency', /developmental disabilities|developmental disability|idd|dd services|regional center/i),

    match('federal_state_crossover', 'ssi_appeals', /ssi.*appeal|appeal your ssi|request reconsideration/i),
    match('federal_state_crossover', 'age_18_redetermination', /age 18|redetermination/i),
    match('federal_state_crossover', 'able_account_program', /\bable\b/i),
    match('federal_state_crossover', 'pre_ets', /pre[- ]ets|pre employment transition/i),
    match('federal_state_crossover', 'supported_employment', /supported employment/i),
    match('federal_state_crossover', 'supported_decision_making', /supported decision-making|supported decision making/i),
    match('federal_state_crossover', 'guardianship_conservatorship_alternatives', /guardianship|conservatorship/i),
    match('federal_state_crossover', 'special_needs_trusts_future_planning', /special needs trust|future planning/i),
    match('federal_state_crossover', 'vocational_rehabilitation', /vocational rehabilitation|department of rehabilitation/i),
    match('federal_state_crossover', 'ssi_child_disability', /ssi|supplemental security income/i),

    match('state_benefit_supports', 'hearing_aid_programs', /hearing aid/i),
    match('state_benefit_supports', 'respite_programs', /respite/i),
    match('state_benefit_supports', 'family_support_programs', /family support/i),
    match('state_benefit_supports', 'assistive_technology', /assistive technology/i),
    match('state_benefit_supports', 'durable_medical_equipment', /durable medical equipment|\bdme\b/i),
    match('state_benefit_supports', 'transportation_assistance', /transportation assistance|non-emergency medical transportation/i),
    match('state_benefit_supports', 'home_modification_programs', /home modification/i),
    match('state_benefit_supports', 'autism_programs', /autism/i),
    match('state_benefit_supports', 'medically_fragile_children_programs', /medically fragile/i),
    match('state_benefit_supports', 'childrens_special_health_services', /children'?s special health|california children'?s services|special health/i),

    match('local_resource_directories', 'legal_aid_resources', /legal aid|legal services|lawhelp/i),
    match('local_resource_directories', 'protection_advocacy_resources', /disability rights|protection and advocacy|\bp&a\b/i),
    match('local_resource_directories', 'parent_centers_pti', /parent center|pti|family empowerment center|fec/i),
    match('local_resource_directories', 'therapy_provider_directories', /therapy|provider directory|clinic directory|hospital directory|children'?s hospital/i),
    match('local_resource_directories', 'respite_provider_directories', /respite provider|respite directory/i),
    match('local_resource_directories', 'transportation_paratransit_resources', /paratransit|transportation/i),
    match('local_resource_directories', 'housing_resources', /housing/i),
    match('local_resource_directories', 'school_districts_local', /school district|district directory/i),
    match('local_resource_directories', 'early_intervention_local_offices', /early intervention.*local|family resource center/i),
    match('local_resource_directories', 'medicaid_local_offices', /county office|human services office|medicaid office|social services agency/i),
    match('local_resource_directories', 'dd_regional_offices', /regional center|dd regional office/i),
    match('local_resource_directories', 'county_human_services_offices', /county human services|social services agency|human services/i),
  ];
}

function match(categoryId, roleId, pattern) {
  return { categoryId, roleId, pattern };
}

const ROLE_MATCHERS = buildRoleMatchers();

function inferRole(seed) {
  const combined = normalizedText(
    seed.family,
    seed.sourceName,
    seed.sourceRole,
    seed.category,
    seed.specificSubcategory,
    seed.notes,
    seed.targetTable,
    seed.url,
    seed.currentEvidence,
    seed.whyNeeded,
  );

  const family = String(seed.family || '').trim();
  const targetTable = String(seed.targetTable || '').trim();

  if (targetTable === 'regional_education_agencies') return result('education_and_disputes', 'regional_education_directory', 'target_table');
  if (targetTable === 'school_districts') return result('local_resource_directories', 'school_districts_local', 'target_table');
  if (targetTable === 'county_offices') return result('local_resource_directories', /medicaid|medicaid_hhs|ihss|social services|human services/i.test(combined) ? 'medicaid_local_offices' : 'county_human_services_offices', 'target_table');
  if (targetTable === 'resource_providers') return result('local_resource_directories', 'therapy_provider_directories', 'target_table');
  if (targetTable === 'state_resource_agencies') {
    if (/early intervention|early start|part c/.test(combined)) return result('early_intervention', 'ei_local_office_directory', 'target_table');
    return result('dd_system', /directory|regional/.test(combined) ? 'dd_local_regional_office_directory' : 'main_dd_agency', 'target_table');
  }
  if (family === 'providers_care') return result('local_resource_directories', 'therapy_provider_directories', 'family_default');
  if (family === 'knowledge_content') {
    if (/ssi|able|rehabilitation|pre[- ]ets|decision-making|trust/.test(combined)) return result('federal_state_crossover', bestMatcher(combined, 'federal_state_crossover') || 'ssi_child_disability', 'family_default');
    if (/iep|special education|504|complaint|due process/.test(combined)) return result('education_and_disputes', bestMatcher(combined, 'education_and_disputes') || 'special_education_parent_rights', 'family_default');
    if (/respite|autism|assistive technology|hearing aid/.test(combined)) return result('state_benefit_supports', bestMatcher(combined, 'state_benefit_supports') || 'respite_programs', 'family_default');
    if (/medicaid|chip|epsdt|waiver/.test(combined)) return result('medicaid_and_waivers', bestMatcher(combined, 'medicaid_and_waivers') || 'medicaid_application', 'family_default');
  }

  for (const matcher of ROLE_MATCHERS) {
    if (matcher.pattern.test(combined)) {
      return result(matcher.categoryId, matcher.roleId, 'pattern');
    }
  }

  if (family === 'waivers') return result('medicaid_and_waivers', 'hcbs_waivers', 'family_default');
  if (family === 'dd_routing') return result('dd_system', 'main_dd_agency', 'family_default');
  if (family === 'medicaid_hhs_offices') return result('local_resource_directories', 'medicaid_local_offices', 'family_default');
  if (family === 'education_routing') return result('education_and_disputes', 'regional_education_directory', 'family_default');
  if (family === 'program_waitlists') return result('medicaid_and_waivers', 'hcbs_waivers', 'family_default');
  if (family === 'forms_guides') {
    if (/special education|selpa|district|504/.test(combined)) return result('education_and_disputes', 'special_education_parent_rights', 'family_default');
    if (/medicaid|chip|medi-cal|hhs|dhs|hcbs|waiver/.test(combined)) return result('medicaid_and_waivers', 'medicaid_application', 'family_default');
    return result('medicaid_and_waivers', 'medicaid_application', 'ambiguous_forms_default');
  }
  if (family === 'advocates_legal') {
    if (/parent center|pti/.test(combined)) return result('local_resource_directories', 'parent_centers_pti', 'family_default');
    if (/disability rights|protection and advocacy/.test(combined)) return result('local_resource_directories', 'protection_advocacy_resources', 'family_default');
    return result('local_resource_directories', 'legal_aid_resources', 'family_default');
  }
  if (family === 'transition_programs') return result('federal_state_crossover', 'vocational_rehabilitation', 'family_default');
  if (family === 'early_intervention_programs') return result('early_intervention', 'ei_part_c_program', 'family_default');

  return result('', '', 'unmatched');
}

function bestMatcher(text, categoryId) {
  const row = ROLE_MATCHERS.find((matcher) => matcher.categoryId === categoryId && matcher.pattern.test(text));
  return row?.roleId || '';
}

function result(categoryId, roleId, matchReason) {
  return { workflowCategory: categoryId, roleId, matchReason };
}

function readStates() {
  const db = new Database(dbPath, { readonly: true });
  const rows = db.prepare('SELECT id, name, code FROM states ORDER BY name').all();
  db.close();
  return rows.map((row) => ({ stateId: row.id, state: row.name, stateAbbr: row.code }));
}

function collectFakeDomainsAndUrls(officialRepairs) {
  const fakeDomains = new Set();
  const fakeUrls = new Set();
  for (const row of officialRepairs.rows || []) {
    if (row.fakeDomain) fakeDomains.add(String(row.fakeDomain).replace(/^www\./, '').toLowerCase());
    if (row.fakeSourceUrl) fakeUrls.add(normalizeUrl(row.fakeSourceUrl));
  }
  return { fakeDomains, fakeUrls };
}

function isFakeOrBlockedScaffold(url, fakeDomains, fakeUrls) {
  const normalizedUrl = normalizeUrl(url);
  const domain = domainFor(normalizedUrl);
  return fakeUrls.has(normalizedUrl) || fakeDomains.has(domain);
}

function buildStateIndex(states) {
  return new Map(states.map((row) => [row.stateId, row]));
}

function ingestSourceTargets(statesById, fakeDomains, fakeUrls) {
  const rows = [];
  if (!fs.existsSync(sourceTargetsDir)) return rows;
  const files = fs.readdirSync(sourceTargetsDir).filter((name) => name.endsWith('.json')).sort();
  for (const file of files) {
    const stateId = normalizeStateId(file.replace(/\.json$/, ''));
    if (!statesById.has(stateId)) continue;
    const payload = readJson(path.join(sourceTargetsDir, file), []);
    const seeds = Array.isArray(payload) ? payload : payload.targets || payload.rows || [];
    for (const seed of seeds) {
      const url = normalizeUrl(seed.source_url);
      if (!url || isFakeOrBlockedScaffold(url, fakeDomains, fakeUrls)) continue;
      rows.push({
        sourceArtifact: repoRelative(path.join(sourceTargetsDir, file)),
        discoveryMethod: 'manual_seed',
        stateId,
        stateAbbr: statesById.get(stateId).stateAbbr,
        state: statesById.get(stateId).state,
        family: inferFamilyFromTargetTable(seed.target_table, seed.category, ''),
        targetTable: seed.target_table || '',
        sourceName: seed.source_name || '',
        sourceRole: seed.specific_subcategory || '',
        category: seed.category || '',
        specificSubcategory: seed.specific_subcategory || '',
        url,
        organizationType: seed.organization_type || '',
        crawlMethod: seed.crawl_method || '',
        notes: seed.notes || '',
        currentEvidence: '',
        whyNeeded: seed.notes || '',
        priorityHint: Number(seed.priority || 0),
        seedStatus: 'target_candidate',
      });
    }
  }
  return rows;
}

function inferFamilyFromTargetTable(targetTable, category = '', explicitFamily = '') {
  if (explicitFamily) return explicitFamily;
  const table = String(targetTable || '').toLowerCase();
  const cat = String(category || '').toLowerCase();
  if (table === 'state_resource_agencies') return 'dd_routing';
  if (table === 'county_offices') return 'medicaid_hhs_offices';
  if (table === 'regional_education_agencies' || table === 'school_districts') return 'education_routing';
  if (table === 'resource_providers') return 'providers_care';
  if (table === 'forms' || table === 'forms_and_guides') return 'forms_guides';
  if (table === 'program_waitlists') return 'program_waitlists';
  if (table === 'iep_advocates') return 'advocates_legal';
  if (table === 'knowledge_articles' || table === 'knowledge_content') return 'knowledge_content';
  if (table === 'programs') {
    if (/waiver/.test(cat)) return 'waivers';
    if (/early intervention/.test(cat)) return 'early_intervention_programs';
    if (/transition/.test(cat)) return 'transition_programs';
    return 'programs_benefits';
  }
  return 'general_gap_fill';
}

function normalizeUniverseStatus(candidateClass, ledgerStatus, doNotScrapeReason) {
  if (doNotScrapeReason || candidateClass === 'do_not_scrape') return 'blocked_known';
  if (candidateClass === 'defer_blocked_source' || candidateClass === 'repair_first') return 'blocked_known';
  if (candidateClass === 'manual_review' || candidateClass === 'discovery_only' || candidateClass === 'candidate_review') return 'needs_review';
  if (candidateClass === 'author_first') return 'target_candidate';
  if (candidateClass === 'ready_target_scrape' || candidateClass === 'staging_refresh_candidate' || candidateClass === 'live_refresh_candidate') return 'verified_target';
  if (/ready_|live_refresh|staging_refresh/.test(String(ledgerStatus || ''))) return 'verified_target';
  return 'target_candidate';
}

function ingestArtifactRows(filePath, extractor) {
  const payload = readJson(filePath, null);
  if (!payload) return [];
  const rows = extractor(payload);
  return rows.map((row) => ({ ...row, sourceArtifact: repoRelative(filePath) }));
}

function ingestLaunchInventory(statesById) {
  const filePath = latestGeneratedJson('launch-scrape-link-inventory-', false);
  if (!filePath) return [];
  return ingestArtifactRows(filePath, (payload) => (payload.rows || []).map((row) => ({
    stateId: normalizeStateId(row.stateId),
    state: statesById.get(normalizeStateId(row.stateId))?.state || stateNameTitle(row.stateId),
    stateAbbr: statesById.get(normalizeStateId(row.stateId))?.stateAbbr || '',
    family: row.family || '',
    targetTable: row.targetTable || '',
    sourceName: row.sourceName || '',
    sourceRole: row.family || '',
    url: normalizeUrl(row.url),
    organizationType: '',
    crawlMethod: row.crawlMethod || row.scrapeLane || '',
    notes: '',
    currentEvidence: row.currentEvidence || '',
    whyNeeded: row.whyNeeded || '',
    priorityHint: Number(row.priority || 0),
    seedStatus: normalizeUniverseStatus(row.launchNeedClass, row.ledgerStatus, row.doNotScrapeReason),
  }))).filter((row) => row.stateId && statesById.has(row.stateId) && row.url);
}

function ingestScrapeUniverse(statesById) {
  const filePath = latestGeneratedJson('scrape-target-universe-', false);
  if (!filePath) return [];
  return ingestArtifactRows(filePath, (payload) => (payload.rows || []).map((row) => ({
    stateId: normalizeStateId(row.stateId),
    state: statesById.get(normalizeStateId(row.stateId))?.state || stateNameTitle(row.stateId),
    stateAbbr: statesById.get(normalizeStateId(row.stateId))?.stateAbbr || '',
    family: row.family || '',
    targetTable: row.targetTable || '',
    sourceName: row.sourceName || '',
    sourceRole: row.family || '',
    url: normalizeUrl(row.url),
    organizationType: '',
    crawlMethod: row.crawlMethod || row.scrapeLane || '',
    notes: '',
    currentEvidence: row.currentEvidence || '',
    whyNeeded: row.whyIncluded || '',
    priorityHint: Number(row.priority || 0),
    seedStatus: normalizeUniverseStatus(row.candidateClass, row.scrapeLane, row.doNotScrapeReason),
  }))).filter((row) => row.stateId && statesById.has(row.stateId) && row.url);
}

function ingestCaliforniaSourcePack(statesById) {
  const baseDir = path.join(sourcePacksDir, 'california');
  const officialPath = path.join(baseDir, 'ca_official_source_pack_v2.jsonl');
  const directoryPath = path.join(baseDir, 'ca_directory_targets_v1.jsonl');
  const rows = [];
  for (const filePath of [officialPath, directoryPath]) {
    if (!fs.existsSync(filePath)) continue;
    for (const row of parseNdjson(filePath)) {
      rows.push({
        sourceArtifact: repoRelative(filePath),
        discoveryMethod: 'repo_artifact',
        stateId: 'california',
        state: statesById.get('california')?.state || 'California',
        stateAbbr: 'CA',
        family: inferFamilyFromTargetTable('', '', inferFamilyFromCaliforniaRole(row.source_role, row.entity_id)),
        targetTable: inferTargetTableFromCaliforniaRole(row.source_role, row.entity_id),
        sourceName: row.agency || row.entity_id,
        sourceRole: row.source_role || '',
        category: '',
        specificSubcategory: '',
        url: normalizeUrl(row.url),
        organizationType: row.authority || '',
        crawlMethod: row.batch_class || '',
        notes: '',
        currentEvidence: row.review_scope || '',
        whyNeeded: '',
        priorityHint: 3,
        seedStatus: row.status === 'blocked_known' ? 'blocked_known' : row.status === 'needs_review' ? 'needs_review' : 'verified_target',
      });
    }
  }
  return rows.filter((row) => row.url);
}

function inferFamilyFromCaliforniaRole(sourceRole, entityId) {
  const text = normalizedText(sourceRole, entityId);
  if (/ihss|medi-cal|medicaid|ccs|haccp/.test(text)) return /county|office/.test(text) ? 'medicaid_hhs_offices' : 'programs_benefits';
  if (/regional center|dds|early start|lanterman|ipp|self-determination/.test(text)) return 'dd_routing';
  if (/parent_training|family_empowerment|selpa|school district|special-education|iep|504/.test(text)) return 'education_routing';
  if (/special education|selpa|district|iep|504/.test(text)) return 'education_routing';
  if (/ssi|calable|rehabilitation|pre-ets|decision-making|trust|conservatorship/.test(text)) return 'transition_programs';
  if (/form|pdf/.test(text)) return 'forms_guides';
  return 'general_gap_fill';
}

function inferTargetTableFromCaliforniaRole(sourceRole, entityId) {
  const text = normalizedText(sourceRole, entityId);
  if (/county|office/.test(text)) return 'county_offices';
  if (/regional center|dds|early start/.test(text)) return 'state_resource_agencies';
  if (/selpa|district/.test(text)) return 'regional_education_agencies';
  if (/form|pdf/.test(text)) return 'forms_and_guides';
  return 'programs';
}

function ingestOfficialRepairs(statesById, officialRepairs) {
  const rows = [];
  for (const row of officialRepairs.rows || []) {
    const stateId = normalizeStateId(row.stateId);
    if (!statesById.has(stateId)) continue;
    for (const candidate of (row.replacementCandidates || []).slice(0, 3)) {
      const url = normalizeUrl(candidate.url);
      if (!url) continue;
      rows.push({
        sourceArtifact: repoRelative(path.join(sourcePacksDir, 'official_state_domain_repairs.json')),
        discoveryMethod: /root_hint|same_lane|state_programs_map/.test(String(candidate.matchType || '')) ? 'official_site_navigation' : 'targeted_official_query',
        stateId,
        state: statesById.get(stateId).state,
        stateAbbr: statesById.get(stateId).stateAbbr,
        family: inferFamilyFromTargetTable(row.targetTable, row.lane, ''),
        targetTable: row.targetTable || '',
        sourceName: candidate.name || row.sourceName || '',
        sourceRole: row.lane || '',
        category: row.lane || '',
        specificSubcategory: row.desiredEvidence || '',
        url,
        organizationType: candidate.origin || '',
        crawlMethod: /\.pdf(\?|$)/i.test(url) ? 'pdf_extract' : row.lane || '',
        notes: row.desiredEvidence || '',
        currentEvidence: `${row.quarantineReason || ''}${candidate.confidence ? ` | candidate confidence: ${candidate.confidence}` : ''}`.trim(),
        whyNeeded: row.desiredEvidence || '',
        priorityHint: 3,
        seedStatus: candidate.confidence === 'low' ? 'needs_review' : 'target_candidate',
      });
    }
  }
  return rows;
}

function ingestFormsSourcePack(statesById) {
  const filePath = path.join(sourcePacksDir, 'forms_source_pack.json');
  const payload = readJson(filePath, { rows: [] });
  const rows = [];
  for (const packRow of payload.rows || []) {
    const stateId = normalizeStateId(packRow.stateId);
    if (!statesById.has(stateId)) continue;
    for (const candidate of (packRow.topCandidates || []).slice(0, 3)) {
      const url = normalizeUrl(candidate.sourceUrl);
      if (!url) continue;
      rows.push({
        sourceArtifact: repoRelative(filePath),
        discoveryMethod: candidate.origin?.includes('manual') ? 'manual_seed' : 'repo_artifact',
        stateId,
        state: statesById.get(stateId).state,
        stateAbbr: statesById.get(stateId).stateAbbr,
        family: 'forms_guides',
        targetTable: 'forms_and_guides',
        sourceName: candidate.sourceName || '',
        sourceRole: candidate.candidateType || 'forms_library',
        category: 'forms_guides',
        specificSubcategory: packRow.canonicalTargetClass || '',
        url,
        organizationType: candidate.verificationStatus || '',
        crawlMethod: /\.pdf(\?|$)/i.test(url) ? 'pdf_extract' : 'static_fetch',
        notes: packRow.canonicalTargetClass || '',
        currentEvidence: candidate.whyNeeded || '',
        whyNeeded: candidate.whyNeeded || '',
        priorityHint: candidate.priority || 2,
        seedStatus: packRow.canonicalTargetClass === 'unresolved_no_candidate' ? 'needs_review' : 'target_candidate',
      });
    }
  }
  return rows;
}

function ingestProviderSourcePack(statesById) {
  const filePath = latestGeneratedJson('provider-source-pack-plan-', false);
  if (!filePath) return [];
  const payload = readJson(filePath, { states: [] });
  const rows = [];
  for (const stateRow of payload.states || []) {
    const stateId = normalizeStateId(stateRow.stateId);
    if (!statesById.has(stateId)) continue;
    for (const candidate of [
      ...(stateRow.concreteProviderTargets || []),
      ...(stateRow.directoryProviderTargets || []).slice(0, 3),
    ]) {
      const url = normalizeUrl(candidate.source_url || candidate.sourceUrl);
      if (!url) continue;
      rows.push({
        sourceArtifact: repoRelative(filePath),
        discoveryMethod: stateRow.readinessLane === 'author-targets-first' ? 'manual_seed' : 'repo_artifact',
        stateId,
        state: statesById.get(stateId).state,
        stateAbbr: statesById.get(stateId).stateAbbr,
        family: 'providers_care',
        targetTable: 'resource_providers',
        sourceName: candidate.source_name || candidate.sourceName || '',
        sourceRole: candidate.isDirectoryLike ? 'provider_directory' : 'provider_entrypoint',
        category: 'providers_care',
        specificSubcategory: stateRow.readinessLane || '',
        url,
        organizationType: candidate.organization_type || '',
        crawlMethod: candidate.crawl_method || '',
        notes: stateRow.nextMove || '',
        currentEvidence: '',
        whyNeeded: stateRow.nextMove || '',
        priorityHint: 3,
        seedStatus: candidate.isConcreteFirstParty ? 'target_candidate' : 'needs_review',
      });
    }
  }
  return rows;
}

function ingestKnowledgeStatusQueue(statesById) {
  const filePath = latestGeneratedJson('knowledge-content-status-queue-', false);
  if (!filePath) return [];
  const payload = readJson(filePath, { rows: [] });
  const rows = [];
  for (const row of payload.rows || []) {
    const url = normalizeUrl(row.reviewedReplacementUrl || row.sourceUrl);
    if (!url) continue;
    for (const stateId of statesById.keys()) {
      rows.push({
        sourceArtifact: repoRelative(filePath),
        discoveryMethod: row.reviewedReplacementUrl ? 'targeted_official_query' : 'repo_artifact',
        stateId,
        state: statesById.get(stateId).state,
        stateAbbr: statesById.get(stateId).stateAbbr,
        family: 'knowledge_content',
        targetTable: 'knowledge_articles',
        sourceName: row.reviewedReplacementName || row.sourceName || '',
        sourceRole: 'knowledge_content',
        category: 'knowledge_content',
        specificSubcategory: '',
        url,
        organizationType: row.sourceFamily || '',
        crawlMethod: 'static_fetch',
        notes: row.whyNeeded || '',
        currentEvidence: row.nextAction || row.lastFollowupReason || '',
        whyNeeded: row.whyNeeded || '',
        priorityHint: 2,
        seedStatus: row.finalStatus === 'promoted_live' ? 'verified_target' : row.finalStatus === 'deferred_blocked_source' ? 'blocked_known' : row.reviewedReplacementUrl ? 'target_candidate' : 'needs_review',
      });
    }
  }
  return rows;
}

function ingestDbProvenance(statesById) {
  const rows = [];
  const db = new Database(dbPath, { readonly: true });

  const programRows = db.prepare(`
    SELECT state_id, name, source_url, official_source_url, category, program_type
    FROM programs
    WHERE COALESCE(source_url, official_source_url) <> ''
  `).all();
  for (const row of programRows) {
    const stateId = normalizeStateId(row.state_id);
    if (!statesById.has(stateId)) continue;
    const url = normalizeUrl(row.source_url || row.official_source_url);
    if (!url) continue;
    rows.push(seedFromDb(statesById, stateId, 'programs_benefits', 'programs', row.name, row.category || row.program_type || '', url));
  }

  const officeRows = db.prepare(`
    SELECT county_id, office_name, source_url, website
    FROM county_offices
    WHERE COALESCE(source_url, website) <> ''
  `).all();
  for (const row of officeRows) {
    const stateId = normalizeStateId(String(row.county_id || '').split('-')[0]);
    if (!statesById.has(stateId)) continue;
    const url = normalizeUrl(row.source_url || row.website);
    if (!url) continue;
    rows.push(seedFromDb(statesById, stateId, 'medicaid_hhs_offices', 'county_offices', row.office_name, 'county_office', url));
  }

  const ddRows = db.prepare(`
    SELECT state_id, name, source_url, website, eligibility_info_page, services_page, appeals_info
    FROM state_resource_agencies
  `).all();
  for (const row of ddRows) {
    const stateId = normalizeStateId(row.state_id);
    if (!statesById.has(stateId)) continue;
    for (const pair of [
      ['website', row.website],
      ['eligibility_info_page', row.eligibility_info_page],
      ['services_page', row.services_page],
      ['appeals_info', row.appeals_info],
      ['source_url', row.source_url],
    ]) {
      const url = normalizeUrl(pair[1]);
      if (!url) continue;
      rows.push(seedFromDb(statesById, stateId, 'dd_routing', 'state_resource_agencies', row.name, pair[0], url));
    }
  }

  const reaRows = db.prepare(`
    SELECT state_id, name, source_url, website
    FROM regional_education_agencies
    WHERE COALESCE(source_url, website) <> ''
  `).all();
  for (const row of reaRows) {
    const stateId = normalizeStateId(row.state_id);
    if (!statesById.has(stateId)) continue;
    const url = normalizeUrl(row.source_url || row.website);
    if (!url) continue;
    rows.push(seedFromDb(statesById, stateId, 'education_routing', 'regional_education_agencies', row.name, 'regional_directory', url));
  }

  const districtRows = db.prepare(`
    SELECT county_id, name, source_url, website
    FROM school_districts
    WHERE COALESCE(source_url, website) <> ''
  `).all();
  for (const row of districtRows) {
    const stateId = normalizeStateId(String(row.county_id || '').split('-')[0]);
    if (!statesById.has(stateId)) continue;
    const url = normalizeUrl(row.source_url || row.website);
    if (!url) continue;
    rows.push(seedFromDb(statesById, stateId, 'education_routing', 'school_districts', row.name, 'district_directory', url));
  }

  const providerRows = db.prepare(`
    SELECT county_id, source_name, source_url, application_url, next_step_url
    FROM resource_providers
    WHERE COALESCE(source_url, application_url, next_step_url) <> ''
  `).all();
  for (const row of providerRows) {
    const stateId = normalizeStateId(String(row.county_id || '').split('-')[0]);
    if (!statesById.has(stateId)) continue;
    for (const pair of [['source_url', row.source_url], ['application_url', row.application_url], ['next_step_url', row.next_step_url]]) {
      const url = normalizeUrl(pair[1]);
      if (!url) continue;
      rows.push(seedFromDb(statesById, stateId, 'providers_care', 'resource_providers', row.source_name || 'Provider source', pair[0], url));
    }
  }

  const formsRows = db.prepare(`
    SELECT state_id, agency, title, source_url, pdf_url, category
    FROM forms_and_guides
    WHERE COALESCE(source_url, pdf_url) <> ''
  `).all();
  for (const row of formsRows) {
    const stateId = normalizeStateId(row.state_id);
    if (!statesById.has(stateId)) continue;
    const url = normalizeUrl(row.pdf_url || row.source_url);
    if (!url) continue;
    rows.push(seedFromDb(statesById, stateId, 'forms_guides', 'forms_and_guides', row.title || row.agency || 'Form source', row.category || 'forms', url));
  }

  const waitlistRows = db.prepare(`
    SELECT program_id, name, estimate_source_url
    FROM program_waitlists
    WHERE COALESCE(estimate_source_url, '') <> ''
  `).all();
  for (const row of waitlistRows) {
    const stateId = normalizeStateId(String(row.program_id || '').split('-')[0]);
    if (!statesById.has(stateId)) continue;
    const url = normalizeUrl(row.estimate_source_url);
    if (!url) continue;
    rows.push(seedFromDb(statesById, stateId, 'program_waitlists', 'program_waitlists', row.name || 'Waitlist source', 'waitlist', url));
  }

  db.close();
  return rows;
}

function seedFromDb(statesById, stateId, family, targetTable, sourceName, sourceRole, url) {
  return {
    sourceArtifact: 'ca_disability_navigator.db',
    discoveryMethod: 'db_provenance',
    stateId,
    state: statesById.get(stateId).state,
    stateAbbr: statesById.get(stateId).stateAbbr,
    family,
    targetTable,
    sourceName: sourceName || '',
    sourceRole: sourceRole || '',
    category: family,
    specificSubcategory: '',
    url,
    organizationType: '',
    crawlMethod: inferBatchClassFromCrawlMethod('', url),
    notes: '',
    currentEvidence: '',
    whyNeeded: '',
    priorityHint: 2,
    seedStatus: 'verified_target',
  };
}

function buildTaxonomyPayload() {
  return {
    version: 'v1',
    generatedAt: new Date().toISOString(),
    generatedDate,
    workflowCategories: CATEGORY_DEFINITIONS,
  };
}

function buildGapQuery(stateName, roleMeta) {
  return `"${stateName}" ${roleMeta.roleLabel} site:.gov`;
}

function likelyAgencyForRole(roleMeta) {
  const map = {
    dd_system: 'State developmental disabilities agency or regional-center system',
    medicaid_and_waivers: 'State Medicaid / HHS / health authority',
    early_intervention: 'State Part C / early intervention lead agency',
    education_and_disputes: 'State education department or dispute-resolution office',
    state_benefit_supports: 'State health / disability / child-services agency',
    federal_state_crossover: 'SSA, state VR agency, ABLE program, or high-authority planning source',
    local_resource_directories: 'County human services, school district system, PTI, legal aid, or P&A',
  };
  return map[roleMeta.workflowCategory] || 'Official state or local agency';
}

function mergeStatus(currentStatus, nextStatus) {
  const rank = { blocked_known: 4, verified_target: 3, target_candidate: 2, needs_review: 1 };
  return (rank[nextStatus] || 0) > (rank[currentStatus] || 0) ? nextStatus : currentStatus;
}

function mergeDiscoveryMethod(currentMethod, nextMethod) {
  const rank = { db_provenance: 5, repo_artifact: 4, official_site_navigation: 3, targeted_official_query: 2, manual_seed: 1 };
  return (rank[nextMethod] || 0) > (rank[currentMethod] || 0) ? nextMethod : currentMethod;
}

function buildPackRows(statesById, seeds, fakeDomains, fakeUrls) {
  const rowsByKey = new Map();

  for (const seed of seeds) {
    const url = normalizeUrl(seed.url);
    if (!url) continue;
    if (isFakeOrBlockedScaffold(url, fakeDomains, fakeUrls)) continue;
    const authority = classifyAuthority(seed);
    if (!authority) continue;

    const roleGuess = inferRole(seed);
    if (!roleGuess.roleId || !ROLE_INDEX.has(roleGuess.roleId)) continue;
    const batchClass = inferBatchClassFromCrawlMethod(seed.crawlMethod, url);
    const normalizedDomain = domainFor(url);
    if (!normalizedDomain || DISALLOWED_DOMAINS.has(normalizedDomain)) continue;

    let resolvedRoleId = roleGuess.roleId;
    let targetKind = inferTargetKind(seed, resolvedRoleId);
    if (targetKind === 'directory_root' && ['dd_intake_application', 'medicaid_application', 'medicaid_fair_hearing', 'special_education_due_process', 'iep_process'].includes(resolvedRoleId)) {
      const directoryText = normalizedText(seed.sourceName, seed.sourceRole, seed.notes, seed.category, seed.specificSubcategory, seed.url);
      if (/parent training|family empowerment|pti|parent center/.test(directoryText)) {
        resolvedRoleId = 'parent_centers_pti';
      } else if (/district|school/.test(directoryText)) {
        resolvedRoleId = 'school_districts_local';
      } else if (/selpa|regional education/.test(directoryText)) {
        resolvedRoleId = 'regional_education_directory';
      } else if (/regional center|regional office|dd/.test(directoryText)) {
        resolvedRoleId = 'dd_local_regional_office_directory';
      } else if (/county|human services|medicaid|social services|office/.test(directoryText)) {
        resolvedRoleId = 'medicaid_local_offices';
      } else {
        resolvedRoleId = ROLE_INDEX.get(resolvedRoleId)?.workflowCategory === 'education_and_disputes'
          ? 'regional_education_directory'
          : 'medicaid_local_offices';
      }
      targetKind = 'directory_root';
    }
    const roleMeta = ROLE_INDEX.get(resolvedRoleId);
    const status = seed.seedStatus === 'verified_target' && !roleMeta.allowedAuthorities.includes(authority)
      ? 'needs_review'
      : seed.seedStatus;
    const discoveryConfidence = status === 'verified_target'
      ? 'high'
      : seed.discoveryMethod === 'manual_seed' || seed.seedStatus === 'needs_review'
        ? 'low'
        : 'medium';
    const reviewReason = status === 'needs_review'
      ? unique([
        !roleMeta.allowedAuthorities.includes(authority) ? 'authority_not_allowed_for_role' : '',
        roleGuess.matchReason === 'ambiguous_forms_default' ? 'ambiguous_role_mapping' : '',
        seed.currentEvidence || '',
        seed.notes || '',
      ]).join(' | ')
      : '';
    const sourceRole = resolvedRoleId;
    const key = [seed.stateId, sourceRole, url].join('|');
    const entityId = `${seed.stateAbbr.toLowerCase()}-${slugify(sourceRole)}-${slugify(seed.sourceName || normalizedDomain || url)}`;
    const nextRow = {
      state: seed.state,
      state_abbr: seed.stateAbbr,
      entity_id: entityId,
      source_role: sourceRole,
      url,
      authority,
      agency: seed.sourceName || likelyAgencyForRole(roleMeta),
      batch_class: batchClass,
      priority: inferPriority(sourceRole),
      expected_content_type: inferExpectedContentType(batchClass, url),
      workflow_category: roleMeta.workflowCategory,
      provenance_url: seed.sourceArtifact === 'ca_disability_navigator.db' ? '' : url,
      notes: unique([seed.notes, seed.whyNeeded, seed.currentEvidence, `source=${seed.sourceArtifact}`]).join(' | '),
      status,
      taxonomy_role_id: sourceRole,
      target_kind: targetKind,
      discovery_method: seed.discoveryMethod || 'repo_artifact',
      discovery_confidence: discoveryConfidence,
      state_completeness_role: roleMeta.countsTowardCompleteness,
      review_reason: reviewReason,
      normalized_domain: normalizedDomain,
    };

    if (!rowsByKey.has(key)) {
      rowsByKey.set(key, nextRow);
      continue;
    }

    const current = rowsByKey.get(key);
    current.status = mergeStatus(current.status, nextRow.status);
    current.discovery_method = mergeDiscoveryMethod(current.discovery_method, nextRow.discovery_method);
    current.discovery_confidence = current.status === 'verified_target' ? 'high' : current.discovery_confidence === 'high' || nextRow.discovery_confidence === 'high' ? 'high' : current.discovery_confidence === 'medium' || nextRow.discovery_confidence === 'medium' ? 'medium' : 'low';
    current.notes = unique([current.notes, nextRow.notes]).join(' | ');
    current.review_reason = unique([current.review_reason, nextRow.review_reason]).join(' | ');
  }

  const finalRows = [...rowsByKey.values()].map((row) => {
    const roleMeta = ROLE_INDEX.get(row.source_role);
    if (row.status === 'verified_target' && roleMeta && !roleMeta.allowedAuthorities.includes(row.authority)) {
      row.status = 'needs_review';
      row.discovery_confidence = 'medium';
      row.review_reason = unique([row.review_reason, 'authority_not_allowed_for_role']).join(' | ');
    }
    if (row.target_kind === 'directory_root' && ['dd_intake_application', 'medicaid_application', 'medicaid_fair_hearing', 'special_education_due_process'].includes(row.source_role)) {
      row.status = 'needs_review';
      row.discovery_confidence = 'low';
      row.review_reason = unique([row.review_reason, 'directory_root_cannot_satisfy_leaf_role']).join(' | ');
    }
    return row;
  });

  return finalRows.sort((a, b) => (
    a.state.localeCompare(b.state)
    || PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority)
    || a.workflow_category.localeCompare(b.workflow_category)
    || a.source_role.localeCompare(b.source_role)
    || a.url.localeCompare(b.url)
  ));
}

function computeStateMetrics(states, packRows, officialRepairs) {
  const repairsByState = countBy((officialRepairs.rows || []).map((row) => ({ stateId: normalizeStateId(row.stateId) })), 'stateId');
  const gaps = [];
  const summaries = [];

  for (const state of states) {
    const stateRows = packRows.filter((row) => row.state_abbr === state.stateAbbr);
    const roleRows = new Map();
    for (const row of stateRows) {
      const bucket = roleRows.get(row.taxonomy_role_id) || [];
      bucket.push(row);
      roleRows.set(row.taxonomy_role_id, bucket);
    }

    let gapScore = 0;
    let criticalSatisfied = 0;
    let unresolvedBlocked = 0;
    let reviewOnly = 0;
    const missingCriticalRoles = [];

    for (const [roleId, roleMeta] of ROLE_INDEX.entries()) {
      const rows = roleRows.get(roleId) || [];
      const hasVerified = rows.some((row) => row.status === 'verified_target');
      const hasCandidate = rows.some((row) => row.status === 'target_candidate');
      const hasBlocked = rows.some((row) => row.status === 'blocked_known');
      const hasReview = rows.some((row) => row.status === 'needs_review');

      if (roleMeta.priority === 'critical') {
        if (hasVerified || hasCandidate) {
          criticalSatisfied += 1;
        } else {
          missingCriticalRoles.push(roleId);
          gapScore += hasReview ? 4 : hasBlocked ? 5 : 6;
        }
      }
      if (hasReview && !hasVerified && !hasCandidate) {
        reviewOnly += 1;
      }
      if (hasBlocked && !hasVerified) {
        unresolvedBlocked += 1;
      }

      if ((roleMeta.priority === 'critical' && !hasVerified && !hasCandidate) || (hasReview && !hasVerified)) {
        gaps.push({
          state: state.state,
          missing_category: roleMeta.workflowCategory,
          missing_role: roleId,
          why_it_matters: roleMeta.notes,
          suggested_search_query: buildGapQuery(state.state, roleMeta),
          likely_agency: likelyAgencyForRole(roleMeta),
          priority: roleMeta.priority,
        });
      }
    }

    if (stateRows.length < 25) gapScore += 5;
    gapScore += reviewOnly;

    const summary = {
      state: state.state,
      total_targets: stateRows.length,
      critical_targets: stateRows.filter((row) => row.state_completeness_role === 'counts_toward_critical').length,
      official_state_targets: stateRows.filter((row) => row.authority === 'official_state').length,
      official_local_targets: stateRows.filter((row) => ['official_county', 'official_local'].includes(row.authority)).length,
      federal_targets: stateRows.filter((row) => row.authority === 'official_federal').length,
      directory_roots: stateRows.filter((row) => row.target_kind === 'directory_root').length,
      needs_review: stateRows.filter((row) => row.status === 'needs_review').length,
      blocked_known: stateRows.filter((row) => row.status === 'blocked_known').length,
      dd_targets: stateRows.filter((row) => row.workflow_category === 'dd_system').length,
      medicaid_targets: stateRows.filter((row) => row.workflow_category === 'medicaid_and_waivers').length,
      early_intervention_targets: stateRows.filter((row) => row.workflow_category === 'early_intervention').length,
      education_targets: stateRows.filter((row) => row.workflow_category === 'education_and_disputes').length,
      appeals_targets: stateRows.filter((row) => APPEALS_ROLE_IDS.has(row.taxonomy_role_id)).length,
      local_directory_targets: stateRows.filter((row) => row.workflow_category === 'local_resource_directories').length,
      adult_transition_targets: stateRows.filter((row) => ADULT_TRANSITION_ROLE_IDS.has(row.taxonomy_role_id)).length,
      housing_transport_targets: stateRows.filter((row) => HOUSING_TRANSPORT_ROLE_IDS.has(row.taxonomy_role_id)).length,
      gap_score: gapScore,
      recommended_next_action: pickNextAction({
        stateRows,
        missingCriticalRoles,
        reviewOnly,
        unresolvedBlocked,
        repairCount: repairsByState[state.stateId] || 0,
      }),
    };
    summaries.push(summary);
  }

  return {
    summaries: summaries.sort((a, b) => b.gap_score - a.gap_score || a.state.localeCompare(b.state)),
    gaps: gaps.sort((a, b) => PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority) || a.state.localeCompare(b.state) || a.missing_role.localeCompare(b.missing_role)),
  };
}

function pickNextAction({ stateRows, missingCriticalRoles, reviewOnly, unresolvedBlocked, repairCount }) {
  if (stateRows.length < 25 || reviewOnly >= 6) return 'needs_manual_review';
  if (repairCount > 0 && missingCriticalRoles.length > 0) return 'needs_official_repair_pack';
  if (unresolvedBlocked > 0 && missingCriticalRoles.length > 0) return 'blocked_known_followup';
  if (missingCriticalRoles.length > 0) {
    const onlyFederal = stateRows.every((row) => ['official_federal', 'high_authority_nonprofit'].includes(row.authority));
    return onlyFederal ? 'federal_only_partial' : 'needs_targeted_official_discovery';
  }
  return 'ready_for_low_token_scrape';
}

function buildMethodology(taxonomy, summaries, gaps, packRows, sourceArtifacts) {
  const rowsUnder25 = summaries.filter((row) => row.total_targets < 25);
  const missingDd = gaps.filter((row) => row.missing_role === 'dd_eligibility' || row.missing_role === 'dd_intake_application');
  const missingMedicaidAppeals = gaps.filter((row) => row.missing_role === 'medicaid_fair_hearing' || row.missing_role === 'medicaid_grievances_appeals');
  const missingSpecialEdDisputes = gaps.filter((row) => row.missing_role === 'special_education_due_process' || row.missing_role === 'state_complaints');
  const missingLocalDirectories = gaps.filter((row) => ['county_human_services_offices', 'medicaid_local_offices', 'dd_regional_offices', 'school_districts_local', 'early_intervention_local_offices'].includes(row.missing_role));
  const topRepair = summaries.slice(0, 10);

  const lines = [
    '# State Source Pack Methodology v1',
    '',
    `Generated: ${generatedDate}`,
    '',
    '## Purpose',
    '',
    'Build a deterministic, disk-first official-source pack that improves low-token scraping by improving the URL queue rather than deepening the crawler.',
    '',
    '## Input Layers',
    '',
    ...sourceArtifacts.map((artifact) => `- ${artifact}`),
    '',
    '## Passes',
    '',
    '1. Repo-first extraction from generated ledgers, launch inventory, current scrape universe, California source-pack artifacts, forms/repair/provider/knowledge artifacts, and live DB provenance URLs.',
    '2. Bounded targeted discovery from existing official repair and source-pack hints only. No broad result harvesting and no recursive crawl.',
    '',
    '## Classification Rules',
    '',
    '- Every output URL is assigned one canonical workflow role from the shared taxonomy.',
    '- Fake scaffold domains from the official-domain repair pack are excluded from the pack and instead drive gap scoring.',
    '- `verified_target` is reserved for existing repo/DB-backed URLs already present in active queue/provenance artifacts.',
    '- `target_candidate` is used for bounded authoring/discovery candidates that look plausible but are not proven active queue targets yet.',
    '- `blocked_known` is used for quarantined, blocked, or explicitly deferred URLs.',
    '- `needs_review` is used when role/authority mapping is ambiguous or the source is weak for that role.',
    '',
    '## Output Summary',
    '',
    `- Total taxonomy roles: ${taxonomy.workflowCategories.reduce((sum, category) => sum + category.roles.length, 0)}`,
    `- Total pack rows: ${packRows.length}`,
    `- States with fewer than 25 targets: ${rowsUnder25.length}`,
    `- States missing critical DD URLs: ${unique(missingDd.map((row) => row.state)).length}`,
    `- States missing Medicaid appeals URLs: ${unique(missingMedicaidAppeals.map((row) => row.state)).length}`,
    `- States missing special-education dispute URLs: ${unique(missingSpecialEdDisputes.map((row) => row.state)).length}`,
    `- States missing local office directories: ${unique(missingLocalDirectories.map((row) => row.state)).length}`,
    '',
    '## Top 10 States To Manually Repair First',
    '',
    ...topRepair.map((row) => `- ${row.state}: gap_score=${row.gap_score}, total_targets=${row.total_targets}, next=${row.recommended_next_action}`),
  ];

  fs.mkdirSync(path.dirname(methodologyOutPath), { recursive: true });
  fs.writeFileSync(methodologyOutPath, `${lines.join('\n')}\n`);
}

function main() {
  const states = readStates();
  const statesById = buildStateIndex(states);
  const officialRepairs = readJson(path.join(sourcePacksDir, 'official_state_domain_repairs.json'), { rows: [] });
  const { fakeDomains, fakeUrls } = collectFakeDomainsAndUrls(officialRepairs);

  const seeds = [
    ...ingestSourceTargets(statesById, fakeDomains, fakeUrls),
    ...ingestLaunchInventory(statesById),
    ...ingestScrapeUniverse(statesById),
    ...ingestCaliforniaSourcePack(statesById),
    ...ingestOfficialRepairs(statesById, officialRepairs),
    ...ingestFormsSourcePack(statesById),
    ...ingestProviderSourcePack(statesById),
    ...ingestKnowledgeStatusQueue(statesById),
    ...ingestDbProvenance(statesById),
  ];

  const packRows = buildPackRows(statesById, seeds, fakeDomains, fakeUrls);
  const taxonomy = buildTaxonomyPayload();
  const { summaries, gaps } = computeStateMetrics(states, packRows, officialRepairs);

  writeJson(taxonomyOutPath, taxonomy);
  writeNdjson(sourcePackOutPath, packRows);
  writeCsv(summaryOutPath, summaries, [
    'state',
    'total_targets',
    'critical_targets',
    'official_state_targets',
    'official_local_targets',
    'federal_targets',
    'directory_roots',
    'needs_review',
    'blocked_known',
    'dd_targets',
    'medicaid_targets',
    'early_intervention_targets',
    'education_targets',
    'appeals_targets',
    'local_directory_targets',
    'adult_transition_targets',
    'housing_transport_targets',
    'gap_score',
    'recommended_next_action',
  ]);
  writeNdjson(gapsOutPath, gaps);
  buildMethodology(taxonomy, summaries, gaps, packRows, unique(seeds.map((row) => row.sourceArtifact)).sort());

  console.log(JSON.stringify({
    generatedDate,
    taxonomyPath: repoRelative(taxonomyOutPath),
    sourcePackPath: repoRelative(sourcePackOutPath),
    summaryPath: repoRelative(summaryOutPath),
    gapsPath: repoRelative(gapsOutPath),
    methodologyPath: repoRelative(methodologyOutPath),
    totalStates: states.length,
    totalRows: packRows.length,
    statesUnder25: summaries.filter((row) => row.total_targets < 25).map((row) => row.state),
    topManualRepairStates: summaries.slice(0, 10).map((row) => row.state),
  }, null, 2));
}

main();
