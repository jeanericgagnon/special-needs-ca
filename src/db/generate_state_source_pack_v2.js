import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  normalizeUrl,
  extractHtmlEvidence,
} from '../../scripts/ca-source-pack-lightweight-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');

const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const sourcePacksDir = path.join(repoRoot, 'data', 'source_packs');

const taxonomyPath = path.join(generatedDir, 'state_source_taxonomy_v1.json');
const gapPath = path.join(generatedDir, 'state_source_pack_gaps_v1.jsonl');
const oldPackPath = path.join(generatedDir, 'all_states_source_pack_v1.jsonl');
const officialRepairPath = path.join(sourcePacksDir, 'official_state_domain_repairs.json');

const verifiedPackPath = path.join(generatedDir, 'verified_state_source_pack_v2.jsonl');
const candidatePackPath = path.join(generatedDir, 'state_source_candidates_v2.jsonl');
const blockedPackPath = path.join(generatedDir, 'state_source_blocked_v2.jsonl');
const unresolvedPackPath = path.join(generatedDir, 'state_source_unresolved_v2.jsonl');
const federalPackPath = path.join(generatedDir, 'global_federal_source_pack_v1.jsonl');
const semanticFailurePath = path.join(generatedDir, 'state_source_semantic_failures_v2.jsonl');
const summaryPath = path.join(generatedDir, 'state_source_summary_v2.csv');
const methodologyPath = path.join(docsDir, 'state-source-pack-methodology-v1.md');

const TARGET_STATES = [
  { name: 'New Mexico', abbr: 'NM', slug: 'new-mexico' },
  { name: 'New Hampshire', abbr: 'NH', slug: 'new-hampshire' },
  { name: 'Illinois', abbr: 'IL', slug: 'illinois' },
  { name: 'Nebraska', abbr: 'NE', slug: 'nebraska' },
  { name: 'Mississippi', abbr: 'MS', slug: 'mississippi' },
];

const STATE_BY_NAME = new Map(TARGET_STATES.map((state) => [state.name, state]));
const STATE_BY_ABBR = new Map(TARGET_STATES.map((state) => [state.abbr, state]));

const USER_AGENT = 'AblefullStateSourcePackV2/1.0 (+https://ablefull.com)';
const REQUEST_TIMEOUT_MS = 20000;
const MAX_RESPONSE_BYTES = 1_500_000;

const STATUS_RANK = {
  verified_target: 5,
  target_candidate: 4,
  legacy_candidate: 3,
  blocked_known: 2,
  needs_review: 1,
};

const FEDERAL_DOMAINS = new Set([
  'ssa.gov',
  'www.ssa.gov',
  'sites.ed.gov',
  'ed.gov',
  'www.ed.gov',
  'medicaid.gov',
  'www.medicaid.gov',
  'dol.gov',
  'www.dol.gov',
  'acl.gov',
  'www.acl.gov',
  'cdc.gov',
  'www.cdc.gov',
]);

const APPROVED_AUTHORITY_BY_ORG_TYPE = {
  official_state: 'official_state',
  official_local_agency: 'official_local',
  official_local: 'official_local',
  official_county: 'official_county',
  nonprofit: 'high_authority_nonprofit',
  provider_directory: 'high_authority_nonprofit',
  hospital: 'high_authority_nonprofit',
  university_clinic: 'high_authority_nonprofit',
  legal_aid: 'legal_aid',
  protection_advocacy: 'protection_advocacy',
  official_federal: 'official_federal',
};

const CATEGORY_TO_ROLES = {
  'C. Developmental disability / DD / IDD services': [
    'main_dd_agency',
    'dd_eligibility',
    'dd_intake_application',
    'dd_local_regional_office_directory',
    'dd_waiver_programs',
    'dd_appeals_complaints',
    'dd_provider_directory',
  ],
  'D. HCBS waivers': [
    'hcbs_waivers',
    'medicaid_eligibility',
    'medicaid_fair_hearing',
    'medicaid_grievances_appeals',
    'personal_care_attendant_care',
    'medicaid_renewals_redeterminations',
  ],
  'B. Medicaid / benefits / HHS': [
    'medicaid_application',
    'medicaid_eligibility',
    'medicaid_local_offices',
    'county_human_services_offices',
    'medicaid_fair_hearing',
    'medicaid_grievances_appeals',
    'medicaid_renewals_redeterminations',
    'personal_care_attendant_care',
  ],
  'E. Early intervention': [
    'ei_part_c_program',
    'ei_referral_intake',
    'ei_eligibility',
    'ei_local_office_directory',
    'ei_family_rights',
    'ei_complaints_mediation_due_process',
  ],
  'F. Special education / IEP': [
    'special_education_parent_rights',
    'iep_process',
    'state_complaints',
    'special_education_mediation',
    'special_education_due_process',
    'section_504_guidance',
  ],
  'G. Regional education structures': [
    'regional_education_directory',
    'school_district_directory',
    'school_districts_local',
  ],
  'H. Parent training / disability rights / legal aid': [
    'parent_training_information_center',
    'parent_centers_pti',
    'protection_advocacy_resources',
    'legal_aid_resources',
  ],
  'L. Transition / adult services': [
    'vocational_rehabilitation',
    'pre_ets',
    'supported_employment',
  ],
  'M. Hospitals / university clinics': [
    'therapy_provider_directories',
  ],
};

const SPECIFIC_SUBCATEGORY_ROLE_HINTS = [
  [/application portal/i, ['medicaid_application']],
  [/office locator/i, ['medicaid_local_offices', 'county_human_services_offices']],
  [/state dd agency/i, ['main_dd_agency']],
  [/local agency directory/i, ['dd_local_regional_office_directory', 'dd_regional_offices']],
  [/waitlist/i, ['dd_waiver_programs']],
  [/waiver/i, ['hcbs_waivers', 'dd_waiver_programs']],
  [/early intervention/i, ['ei_part_c_program', 'ei_referral_intake']],
  [/procedural safeguards/i, ['special_education_parent_rights']],
  [/complaint/i, ['state_complaints']],
  [/mediat/i, ['special_education_mediation']],
  [/due process/i, ['special_education_due_process']],
  [/vocational rehabilitation/i, ['vocational_rehabilitation']],
  [/pti|parent training/i, ['parent_training_information_center', 'parent_centers_pti']],
  [/disability rights/i, ['protection_advocacy_resources']],
  [/legal aid/i, ['legal_aid_resources']],
  [/hospitals|children's hospital|university clinics/i, ['therapy_provider_directories']],
];

const ROLE_RULES = {
  main_dd_agency: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    targetKind: 'official_root',
    requiredAny: ['developmental', 'disabilities', 'bureau', 'division', 'mental health', 'services for people'],
    prohibitedAny: ['cdc', 'idea', 'medicaid', 'early intervention'],
    allowedAuthorities: ['official_state', 'official_local'],
    expectedAgencyTypes: ['official_state', 'official_local'],
  }),
  dd_eligibility: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['eligibility', 'eligible', 'developmental disabilities'],
    prohibitedAny: ['early intervention', 'medicaid', 'school'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  dd_intake_application: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['apply', 'application', 'intake', 'request services', 'enroll'],
    prohibitedAny: ['early intervention', 'medicaid', 'school'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  dd_local_regional_office_directory: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    allowDirectoryRoot: true,
    targetKind: 'directory_root',
    requiredAny: ['regional', 'office', 'directory', 'service coordination', 'independent service coordination', 'locations'],
    prohibitedAny: ['provider only', 'employment', 'tax'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  dd_waiver_programs: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['waiver', 'hcbs', 'home and community', 'developmental disabilities'],
    prohibitedAny: ['early intervention', 'school'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  dd_appeals_complaints: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['appeal', 'complaint', 'grievance', 'fair hearing', 'hearing'],
    prohibitedAny: ['school complaint', 'special education'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  medicaid_application: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['apply', 'application', 'benefits', 'medicaid', 'medical assistance'],
    prohibitedAny: ['provider enrollment', 'employment'],
    allowedAuthorities: ['official_state', 'official_county', 'official_local'],
  }),
  medicaid_eligibility: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['eligibility', 'qualify', 'medicaid', 'medical assistance'],
    prohibitedAny: ['early intervention', 'school'],
    allowedAuthorities: ['official_state', 'official_county', 'official_local'],
  }),
  personal_care_attendant_care: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['personal care', 'attendant', 'pcs', 'home care'],
    prohibitedAny: ['employment'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  hcbs_waivers: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['waiver', 'hcbs', 'home and community'],
    prohibitedAny: ['special education'],
    allowedAuthorities: ['official_state', 'official_federal'],
  }),
  medicaid_grievances_appeals: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['grievance', 'appeal', 'medicaid'],
    prohibitedAny: ['special education', 'due process'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  medicaid_fair_hearing: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['fair hearing', 'hearing request'],
    prohibitedAny: ['special education'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  medicaid_renewals_redeterminations: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['renew', 'redetermination', 'recertification'],
    prohibitedAny: ['provider'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  ei_part_c_program: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    targetKind: 'official_root',
    requiredAny: ['early intervention', 'part c', 'birth to three', 'birth to 3', 'first steps'],
    prohibitedAny: ['medicaid', 'developmental disabilities waiver'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  ei_referral_intake: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAll: ['early intervention'],
    requiredAny: ['referral', 'refer', 'intake', 'child find'],
    prohibitedAny: ['medicaid', 'school complaint'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  ei_eligibility: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAll: ['early intervention'],
    requiredAny: ['eligibility', 'eligible', 'part c'],
    prohibitedAny: ['medicaid', 'special education complaint'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  ei_local_office_directory: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    allowDirectoryRoot: true,
    targetKind: 'directory_root',
    requiredAll: ['early intervention'],
    requiredAny: ['office', 'directory', 'contact', 'service coordination', 'program locator'],
    prohibitedAny: ['provider only', 'employment'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  ei_family_rights: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAll: ['early intervention'],
    requiredAny: ['family rights', 'parent rights', 'procedural safeguards'],
    prohibitedAny: ['special education only'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  ei_complaints_mediation_due_process: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAll: ['early intervention'],
    requiredAny: ['complaint', 'mediation', 'due process', 'dispute'],
    prohibitedAny: ['medicaid'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  special_education_parent_rights: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['procedural safeguards', 'parent rights', 'special education'],
    prohibitedAny: ['medicaid'],
    allowedAuthorities: ['official_state', 'official_local', 'high_authority_nonprofit'],
  }),
  iep_process: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['iep', 'individualized education program'],
    prohibitedAny: ['medicaid', 'early intervention only'],
    allowedAuthorities: ['official_state', 'official_local', 'high_authority_nonprofit'],
  }),
  state_complaints: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAll: ['complaint'],
    requiredAny: ['complaint', 'special education'],
    prohibitedAny: ['medicaid'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  special_education_mediation: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAll: ['mediation'],
    requiredAny: ['mediation', 'special education'],
    prohibitedAny: ['medicaid'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  special_education_due_process: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAll: ['due process'],
    requiredAny: ['due process', 'special education', 'hearing'],
    prohibitedAny: ['medicaid'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  regional_education_directory: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    allowDirectoryRoot: true,
    targetKind: 'directory_root',
    requiredAny: ['regional', 'selpa', 'special education', 'cooperative', 'service unit'],
    prohibitedAny: ['medicaid'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  school_district_directory: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    allowDirectoryRoot: true,
    targetKind: 'directory_root',
    requiredAny: ['district', 'directory', 'school'],
    prohibitedAny: ['provider'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
  parent_training_information_center: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    targetKind: 'leaf_workflow_page',
    requiredAny: ['parent training', 'family resource', 'parent center', 'pti'],
    prohibitedAny: ['medicaid'],
    allowedAuthorities: ['high_authority_nonprofit'],
  }),
  protection_advocacy_resources: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    requiredAny: ['disability rights', 'protection', 'advocacy'],
    prohibitedAny: ['medicaid'],
    allowedAuthorities: ['protection_advocacy', 'high_authority_nonprofit'],
  }),
  legal_aid_resources: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    requiredAny: ['legal aid', 'legal services', 'free legal help'],
    prohibitedAny: ['state bar directory'],
    allowedAuthorities: ['legal_aid', 'high_authority_nonprofit'],
  }),
  able_account_program: rule({
    stateSpecific: false,
    exactLeafRequired: true,
    requiredAny: ['able', 'achieving a better life'],
    prohibitedAny: ['medicaid'],
    allowedAuthorities: ['official_state', 'official_federal', 'high_authority_nonprofit'],
  }),
  ssi_child_disability: rule({
    stateSpecific: false,
    exactLeafRequired: true,
    requiredAny: ['ssi', 'child', 'disability'],
    prohibitedAny: ['medicaid'],
    allowedAuthorities: ['official_federal'],
  }),
  vocational_rehabilitation: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['vocational rehabilitation', 'rehabilitation services'],
    prohibitedAny: ['medicaid'],
    allowedAuthorities: ['official_state', 'official_federal'],
  }),
  pre_ets: rule({
    stateSpecific: true,
    exactLeafRequired: true,
    requiredAny: ['pre-employment transition', 'pre-ets'],
    prohibitedAny: ['medicaid'],
    allowedAuthorities: ['official_state', 'official_federal'],
  }),
  therapy_provider_directories: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    allowDirectoryRoot: true,
    targetKind: 'directory_root',
    requiredAny: ['hospital', 'clinic', 'provider', 'therapy', 'children'],
    prohibitedAny: ['business registry', 'attorney'],
    allowedAuthorities: ['official_state', 'official_local', 'high_authority_nonprofit'],
  }),
  respite_provider_directories: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    allowDirectoryRoot: true,
    targetKind: 'directory_root',
    requiredAny: ['respite'],
    prohibitedAny: ['employment', 'tax'],
    allowedAuthorities: ['official_state', 'official_local', 'high_authority_nonprofit'],
  }),
  housing_resources: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    allowDirectoryRoot: true,
    targetKind: 'directory_root',
    requiredAny: ['housing'],
    prohibitedAny: ['employment'],
    allowedAuthorities: ['official_state', 'official_local', 'high_authority_nonprofit'],
  }),
  transportation_paratransit_resources: rule({
    stateSpecific: true,
    exactLeafRequired: false,
    allowDirectoryRoot: true,
    targetKind: 'directory_root',
    requiredAny: ['transportation', 'paratransit', 'mobility'],
    prohibitedAny: ['employment'],
    allowedAuthorities: ['official_state', 'official_local'],
  }),
};

function rule(overrides = {}) {
  return {
    stateSpecific: true,
    exactLeafRequired: false,
    allowDirectoryRoot: false,
    requiredAll: [],
    requiredAny: [],
    prohibitedAny: [],
    allowedAuthorities: [],
    expectedAgencyTypes: [],
    targetKind: 'leaf_workflow_page',
    ...overrides,
  };
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

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const content = rows.map((row) => JSON.stringify(row)).join('\n');
  fs.writeFileSync(filePath, content ? `${content}\n` : '');
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
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function sha256Hex(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function nowIso() {
  return new Date().toISOString();
}

function domainFor(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function pathnameFor(url) {
  try {
    return new URL(url).pathname || '/';
  } catch {
    return '/';
  }
}

function titleCaseFromSlug(input) {
  return String(input || '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function loadTaxonomy() {
  const taxonomy = readJson(taxonomyPath, { workflowCategories: [] });
  const roleIndex = new Map();
  for (const category of taxonomy.workflowCategories || []) {
    for (const roleMeta of category.roles || []) {
      roleIndex.set(roleMeta.roleId, {
        ...roleMeta,
        workflowCategory: category.categoryId,
      });
    }
  }
  return { taxonomy, roleIndex };
}

function loadStateTargetFile(state) {
  return readJson(path.join(sourceTargetsDir, `${state.slug}.json`), []);
}

function loadRepairRows() {
  const payload = readJson(officialRepairPath, { rows: [] });
  return payload.rows || [];
}

function buildRoleSetForState(gapRows, state) {
  const roles = new Set();
  for (const row of gapRows) {
    if (row.state === state.name) roles.add(row.missing_role);
  }
  for (const roleId of [
    'main_dd_agency',
    'dd_eligibility',
    'dd_intake_application',
    'dd_local_regional_office_directory',
    'dd_waiver_programs',
    'dd_appeals_complaints',
    'medicaid_application',
    'medicaid_eligibility',
    'personal_care_attendant_care',
    'hcbs_waivers',
    'medicaid_grievances_appeals',
    'medicaid_fair_hearing',
    'medicaid_renewals_redeterminations',
    'ei_part_c_program',
    'ei_referral_intake',
    'ei_eligibility',
    'ei_local_office_directory',
    'ei_family_rights',
    'ei_complaints_mediation_due_process',
    'special_education_parent_rights',
    'iep_process',
    'state_complaints',
    'special_education_mediation',
    'special_education_due_process',
    'regional_education_directory',
    'school_district_directory',
    'able_account_program',
    'ssi_child_disability',
    'vocational_rehabilitation',
    'pre_ets',
    'protection_advocacy_resources',
    'parent_training_information_center',
    'legal_aid_resources',
    'therapy_provider_directories',
    'respite_provider_directories',
    'housing_resources',
    'transportation_paratransit_resources',
  ]) {
    roles.add(roleId);
  }
  return [...roles];
}

function classifyAuthorityFromOrgType(value, fallback = 'high_authority_nonprofit') {
  return APPROVED_AUTHORITY_BY_ORG_TYPE[String(value || '').trim()] || fallback;
}

function roleHintsForTarget(target) {
  const hints = new Set(CATEGORY_TO_ROLES[target.category] || []);
  for (const [pattern, roles] of SPECIFIC_SUBCATEGORY_ROLE_HINTS) {
    if (pattern.test(String(target.specific_subcategory || ''))) {
      for (const roleId of roles) hints.add(roleId);
    }
  }
  return [...hints];
}

function buildBaseCandidate(target, state) {
  const rawUrl = String(target.source_url || '').trim();
  if (!rawUrl) return null;
  let url;
  try {
    url = normalizeUrl(rawUrl);
  } catch {
    return null;
  }

  const authority = classifyAuthorityFromOrgType(target.organization_type, FEDERAL_DOMAINS.has(domainFor(url)) ? 'official_federal' : 'high_authority_nonprofit');
  const roleHints = roleHintsForTarget(target);
  return {
    state: state.name,
    state_abbr: state.abbr,
    entity_id: `${state.abbr.toLowerCase()}-${slugify(target.source_name || target.specific_subcategory || 'candidate')}`,
    source_name: target.source_name || titleCaseFromSlug(target.specific_subcategory),
    source_role_hints: roleHints,
    url,
    authority,
    agency: target.source_name || '',
    batch_class: inferBatchClass(target.crawl_method, url),
    target_kind: inferTargetKind(target, url),
    discovery_method: 'manual_seed',
    provenance_url: url,
    notes: target.notes || '',
    review_reason: '',
    status: 'legacy_candidate',
  };
}

function inferBatchClass(crawlMethod, url) {
  const method = String(crawlMethod || '').toLowerCase();
  if (method.includes('playwright')) return 'portal';
  if (method.includes('pdf')) return 'pdf';
  const lower = String(url).toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'document';
  if (lower.endsWith('.xls') || lower.endsWith('.xlsx') || lower.endsWith('.csv')) return 'spreadsheet';
  return 'html';
}

function inferTargetKind(target, url) {
  const sub = `${target.category || ''} ${target.specific_subcategory || ''} ${target.notes || ''}`.toLowerCase();
  if (sub.includes('directory') || sub.includes('locator')) return 'directory_root';
  if (FEDERAL_DOMAINS.has(domainFor(url))) return 'federal_reference';
  if (pathnameFor(url) === '/') return 'official_root';
  return 'leaf_workflow_page';
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function collectLegacyCandidates(oldPackRows, state, roleId) {
  return oldPackRows
    .filter((row) => row.state === state.name && row.source_role === roleId)
    .map((row) => ({
      state: row.state,
      state_abbr: row.state_abbr,
      entity_id: row.entity_id,
      source_name: row.agency || titleCaseFromSlug(roleId),
      source_role_hints: [roleId],
      url: normalizeUrl(row.url),
      authority: row.authority,
      agency: row.agency || '',
      batch_class: row.batch_class || 'html',
      target_kind: row.target_kind || 'leaf_workflow_page',
      discovery_method: row.discovery_method || 'db_provenance',
      provenance_url: row.provenance_url || row.url,
      notes: row.notes || '',
      review_reason: row.review_reason || '',
      status: 'legacy_candidate',
    }));
}

function collectRepairCandidates(repairRows, state) {
  const out = [];
  for (const row of repairRows) {
    if (String(row.stateId || '').toLowerCase() !== state.slug) continue;
    for (const candidate of row.replacementCandidates || []) {
      const url = String(candidate.url || '').trim();
      if (!url) continue;
      let normalized;
      try {
        normalized = normalizeUrl(url);
      } catch {
        continue;
      }
      out.push({
        state: state.name,
        state_abbr: state.abbr,
        entity_id: `${state.abbr.toLowerCase()}-${slugify(row.sourceName || row.lane || 'repair')}`,
        source_name: candidate.name || row.sourceName || '',
        source_role_hints: laneToRoleHints(row.lane),
        url: normalized,
        authority: classifyAuthorityFromRepairCandidate(candidate, normalized),
        agency: candidate.name || row.sourceName || '',
        batch_class: batchClassFromReplacementCandidate(normalized),
        target_kind: candidate.matchType?.includes('root') ? 'official_root' : 'leaf_workflow_page',
        discovery_method: candidate.origin === 'existing_state_source_targets' ? 'repo_artifact' : 'official_site_navigation',
        provenance_url: row.fakeSourceUrl || normalized,
        notes: row.desiredEvidence || row.quarantineReason || '',
        review_reason: '',
        status: 'legacy_candidate',
      });
    }
  }
  return out;
}

function classifyAuthorityFromRepairCandidate(candidate, url) {
  const host = domainFor(url);
  if (FEDERAL_DOMAINS.has(host)) return 'official_federal';
  if (host.endsWith('.gov') || host.endsWith('.state.il.us') || host.endsWith('.k12.ms.us') || host.endsWith('.nh.gov') || host.endsWith('.ne.gov') || host.endsWith('.ms.gov')) {
    return 'official_state';
  }
  if (host.includes('legal') || host.includes('lawhelp')) return 'legal_aid';
  return 'high_authority_nonprofit';
}

function batchClassFromReplacementCandidate(url) {
  const lower = String(url).toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'document';
  if (lower.endsWith('.xls') || lower.endsWith('.xlsx') || lower.endsWith('.csv')) return 'spreadsheet';
  return 'html';
}

function laneToRoleHints(lane) {
  switch (lane) {
    case 'special_education':
      return ['special_education_parent_rights', 'iep_process', 'state_complaints', 'special_education_mediation', 'special_education_due_process'];
    case 'education_routing':
      return ['regional_education_directory', 'school_district_directory'];
    case 'dd_state_directory':
      return ['main_dd_agency', 'dd_local_regional_office_directory'];
    case 'waiver_program':
      return ['hcbs_waivers', 'dd_waiver_programs'];
    case 'medicaid_county_directory':
      return ['medicaid_local_offices', 'county_human_services_offices'];
    case 'vr_transition':
      return ['vocational_rehabilitation', 'pre_ets'];
    default:
      return [];
  }
}

function dedupeCandidates(candidates) {
  const best = new Map();
  for (const candidate of candidates) {
    const key = `${candidate.state_abbr}|${candidate.url}|${candidate.authority}|${candidate.source_role_hints.sort().join(',')}`;
    const current = best.get(key);
    if (!current || STATUS_RANK[candidate.status] > STATUS_RANK[current.status]) {
      best.set(key, candidate);
    }
  }
  return [...best.values()];
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': USER_AGENT,
        accept: 'text/html,application/pdf,application/xml,text/plain,*/*',
      },
    });
    const arrayBuffer = await response.arrayBuffer();
    const body = Buffer.from(arrayBuffer).slice(0, MAX_RESPONSE_BYTES);
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url || url,
      headers: {
        contentType: response.headers.get('content-type') || '',
        etag: response.headers.get('etag') || '',
        lastModified: response.headers.get('last-modified') || '',
      },
      body,
    };
  } finally {
    clearTimeout(timer);
  }
}

function bodyToUtf8(buffer) {
  return Buffer.isBuffer(buffer) ? buffer.toString('utf8') : Buffer.from(buffer).toString('utf8');
}

function looksLikeChallenge(status, contentType, text, hash) {
  const lower = String(text || '').toLowerCase();
  const smallBlank = (text || '').trim().length < 200;
  if (status === 403 || status === 429 || status === 503) return 'blocked_http_status';
  if (!String(contentType || '').toLowerCase().includes('html')) return '';
  if (lower.includes('incapsula') || lower.includes('cloudflare') || lower.includes('request unsuccessful')) {
    if (smallBlank || !/<h1|<h2|<title/i.test(text)) return 'blocked_challenge';
  }
  if (hash === 'd02032286070b4dd9d8fbd985a7bdca8af8edf52b89ff177db3bfcb2c8a9c43d') return 'blocked_challenge';
  return '';
}

function extractYearSignals(text) {
  const matches = String(text || '').match(/\b20(2[0-9]|1[5-9])\b/g) || [];
  return [...new Set(matches)];
}

function roleAliasTerms(roleId) {
  return String(roleId || '').split('_').map((part) => part.toLowerCase());
}

function genericAgencyName(name) {
  return /\b(source_url|website|programs|forms_and_guides|state_resource_agencies)\b/i.test(String(name || ''));
}

function evaluateCandidateForRole(candidate, roleId, roleMeta, state, fetchResult) {
  const ruleConfig = ROLE_RULES[roleId] || rule();
  const host = domainFor(fetchResult.finalUrl || candidate.url);
  const contentType = String(fetchResult.headers.contentType || '').toLowerCase();
  const isHtml = contentType.includes('html');
  const isPdf = contentType.includes('pdf') || candidate.batch_class === 'pdf';
  const bodyText = isHtml ? bodyToUtf8(fetchResult.body) : '';
  const evidence = isHtml ? extractHtmlEvidence(bodyText, fetchResult.finalUrl || candidate.url) : {
    title: '',
    h1: '',
    h2s: [],
    textSample: '',
    canonicalUrl: '',
    outboundOfficialLinks: [],
  };
  const searchText = [
    fetchResult.finalUrl || candidate.url,
    evidence.title,
    evidence.h1,
    ...(evidence.h2s || []),
    evidence.textSample,
  ].join(' ').toLowerCase();
  const visibleEvidenceText = [
    evidence.title,
    evidence.h1,
    ...(evidence.h2s || []),
    evidence.textSample,
  ].join(' ').toLowerCase();

  if (/\b(page not found|page inactive|access denied|not available)\b/.test(visibleEvidenceText)) {
    return fail('error_or_inactive_page', evidence);
  }

  if (genericAgencyName(candidate.agency)) {
    return fail('agency_name_is_db_field', evidence);
  }
  if (!ruleConfig.allowedAuthorities.includes(candidate.authority)) {
    return fail('authority_not_allowed_for_role', evidence);
  }
  if (ruleConfig.stateSpecific && FEDERAL_DOMAINS.has(host)) {
    return fail('federal_source_not_allowed_for_state_specific_role', evidence);
  }
  if (ruleConfig.exactLeafRequired && candidate.target_kind === 'official_root') {
    return fail('generic_root_cannot_satisfy_leaf_role', evidence);
  }
  if (!ruleConfig.allowDirectoryRoot && candidate.target_kind === 'directory_root' && ruleConfig.exactLeafRequired) {
    return fail('directory_root_cannot_satisfy_leaf_role', evidence);
  }
  if (!jurisdictionMatches(state, searchText, candidate, fetchResult.finalUrl || candidate.url)) {
    return fail('jurisdiction_mismatch', evidence);
  }

  const missingRequiredAll = (ruleConfig.requiredAll || []).find((term) => !searchText.includes(term.toLowerCase()));
  if (missingRequiredAll) {
    return fail(`required_all_missing:${missingRequiredAll}`, evidence);
  }
  const missingRequired = ruleConfig.requiredAny.length > 0
    && !ruleConfig.requiredAny.some((term) => searchText.includes(term.toLowerCase()));
  if (missingRequired) {
    return fail('required_terms_missing', evidence);
  }
  const prohibitedHit = ruleConfig.prohibitedAny.find((term) => searchText.includes(term.toLowerCase()));
  if (prohibitedHit) {
    return fail(`prohibited_term:${prohibitedHit}`, evidence);
  }
  if (isPdf && !/pdf/i.test(contentType) && !String(candidate.url).toLowerCase().endsWith('.pdf')) {
    return fail('content_type_role_mismatch', evidence);
  }

  let confidence = 0.35;
  if (candidate.authority.startsWith('official')) confidence += 0.2;
  if (ruleConfig.requiredAny.some((term) => searchText.includes(term.toLowerCase()))) confidence += 0.15;
  if (pathnameFor(fetchResult.finalUrl || candidate.url).split('/').filter(Boolean).length >= 2) confidence += 0.1;
  if (evidence.title) confidence += 0.05;
  if (evidence.h1) confidence += 0.05;
  if (extractYearSignals(searchText).length > 0 || fetchResult.headers.lastModified) confidence += 0.05;
  if (roleAliasTerms(roleId).some((term) => term.length > 3 && searchText.includes(term))) confidence += 0.05;
  confidence = Math.min(0.95, confidence);

  return {
    ok: true,
    role_confidence: Number(confidence.toFixed(2)),
    role_evidence: buildRoleEvidence(roleId, evidence, fetchResult.finalUrl || candidate.url, searchText),
    jurisdiction_evidence: `${state.name} matched via domain/path/title text`,
    authority_evidence: `${candidate.authority}:${host}`,
    verification_reason: 'role_and_jurisdiction_verified',
    title_evidence: evidence.title,
    heading_evidence: [evidence.h1, ...(evidence.h2s || [])].filter(Boolean).join(' | '),
    content_text_sample: evidence.textSample,
    finalUrl: fetchResult.finalUrl || candidate.url,
    http_status: fetchResult.status,
    content_type: fetchResult.headers.contentType || '',
    content_hash: sha256Hex(fetchResult.body),
    review_date_signal: fetchResult.headers.lastModified || extractYearSignals(searchText)[0] || '',
  };
}

function fail(reason, evidence) {
  return {
    ok: false,
    review_reason: reason,
    title_evidence: evidence?.title || '',
    heading_evidence: [evidence?.h1, ...((evidence?.h2s) || [])].filter(Boolean).join(' | '),
    content_text_sample: evidence?.textSample || '',
  };
}

function jurisdictionMatches(state, searchText, candidate, finalUrl) {
  const stateName = state.name.toLowerCase();
  const stateAbbr = state.abbr.toLowerCase();
  const host = domainFor(finalUrl);
  if (candidate.authority === 'official_federal') return true;
  const localSignal =
    host.includes(`.${stateAbbr.toLowerCase()}.gov`)
    || host.includes(`${stateAbbr.toLowerCase()}.gov`)
    || pathnameFor(finalUrl).toLowerCase().includes(state.slug)
    || searchText.includes(stateName)
    || searchText.includes(` ${stateAbbr} `)
    || searchText.includes(`(${stateAbbr})`);
  if (candidate.authority === 'high_authority_nonprofit' || candidate.authority === 'legal_aid' || candidate.authority === 'protection_advocacy') {
    return localSignal;
  }
  if (localSignal) return true;
  return false;
}

function buildRoleEvidence(roleId, evidence, finalUrl, searchText) {
  const matchedTerms = (ROLE_RULES[roleId]?.requiredAny || []).filter((term) => searchText.includes(term.toLowerCase()));
  return [
    `url=${finalUrl}`,
    evidence.title ? `title=${evidence.title}` : '',
    evidence.h1 ? `h1=${evidence.h1}` : '',
    matchedTerms.length ? `matched_terms=${matchedTerms.join('|')}` : '',
  ].filter(Boolean).join(' ; ');
}

function buildVerifiedRow(candidate, roleId, roleMeta, evaluation) {
  return {
    state: candidate.state,
    state_abbr: candidate.state_abbr,
    entity_id: candidate.entity_id,
    source_role: roleId,
    taxonomy_role_id: roleId,
    workflow_category: roleMeta.workflowCategory,
    url: candidate.url,
    normalized_domain: domainFor(evaluation.finalUrl || candidate.url),
    authority: candidate.authority,
    agency: candidate.agency,
    batch_class: candidate.batch_class,
    target_kind: candidate.target_kind,
    status: 'verified_target',
    discovery_method: candidate.discovery_method,
    provenance_url: candidate.provenance_url,
    verification_method: candidate.authority === 'official_federal' ? 'http_semantic_federal' : 'http_semantic_state',
    http_status: evaluation.http_status,
    final_url: evaluation.finalUrl,
    content_type: evaluation.content_type,
    content_hash: evaluation.content_hash,
    title_evidence: evaluation.title_evidence,
    heading_evidence: evaluation.heading_evidence,
    role_confidence: evaluation.role_confidence,
    role_evidence: evaluation.role_evidence,
    jurisdiction_evidence: evaluation.jurisdiction_evidence,
    authority_evidence: evaluation.authority_evidence,
    jurisdiction_match: true,
    reviewed_at: nowIso(),
    notes: candidate.notes || '',
    review_date_signal: evaluation.review_date_signal,
    review_reason: '',
  };
}

function buildCandidateRow(candidate, roleId, roleMeta, reason, evaluation) {
  return {
    state: candidate.state,
    state_abbr: candidate.state_abbr,
    entity_id: candidate.entity_id,
    source_role: roleId,
    taxonomy_role_id: roleId,
    workflow_category: roleMeta.workflowCategory,
    url: candidate.url,
    normalized_domain: domainFor(candidate.url),
    authority: candidate.authority,
    agency: candidate.agency,
    batch_class: candidate.batch_class,
    target_kind: candidate.target_kind,
    status: candidate.status === 'blocked_known' ? 'blocked_known' : candidate.status,
    discovery_method: candidate.discovery_method,
    provenance_url: candidate.provenance_url,
    verification_method: '',
    http_status: evaluation?.http_status || '',
    final_url: evaluation?.finalUrl || '',
    content_type: evaluation?.content_type || '',
    content_hash: evaluation?.content_hash || '',
    title_evidence: evaluation?.title_evidence || '',
    heading_evidence: evaluation?.heading_evidence || '',
    role_confidence: evaluation?.role_confidence || 0,
    role_evidence: evaluation?.role_evidence || '',
    jurisdiction_evidence: evaluation?.jurisdiction_evidence || '',
    authority_evidence: evaluation?.authority_evidence || '',
    jurisdiction_match: false,
    reviewed_at: nowIso(),
    notes: candidate.notes || '',
    review_reason: reason || candidate.review_reason || 'needs_review',
  };
}

function buildBlockedRow(candidate, roleId, roleMeta, blockerClass, reason, fetchResult) {
  return {
    state: candidate.state,
    state_abbr: candidate.state_abbr,
    entity_id: candidate.entity_id,
    source_role: roleId,
    taxonomy_role_id: roleId,
    workflow_category: roleMeta.workflowCategory,
    attempted_url: candidate.url,
    final_url: fetchResult?.finalUrl || '',
    normalized_domain: domainFor(fetchResult?.finalUrl || candidate.url),
    authority: candidate.authority,
    agency: candidate.agency,
    blocker_class: blockerClass,
    reason,
    browser_verification_required: blockerClass === 'browser_only_portal' || blockerClass === 'http_blocked_challenge',
    http_status: fetchResult?.status || '',
    content_type: fetchResult?.headers?.contentType || '',
    content_hash: fetchResult?.body ? sha256Hex(fetchResult.body) : '',
    provenance_url: candidate.provenance_url,
    reviewed_at: nowIso(),
    notes: candidate.notes || '',
  };
}

function parseArgs(argv) {
  const parsed = {
    states: TARGET_STATES.map((state) => state.slug),
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, value = ''] = arg.slice(2).split(/=(.*)/s, 2);
    if (key === 'states' && value.trim()) {
      parsed.states = value.split(',').map((part) => part.trim().toLowerCase()).filter(Boolean);
    }
  }
  return parsed;
}

function buildSourceCandidatesForState(state, oldPackRows, repairRows) {
  const targetRows = loadStateTargetFile(state);
  const seedCandidates = targetRows.map((row) => buildBaseCandidate(row, state)).filter(Boolean);
  const repairCandidates = collectRepairCandidates(repairRows, state);
  return dedupeCandidates([
    ...seedCandidates,
    ...repairCandidates,
    ...oldPackRows
      .filter((row) => row.state === state.name)
      .map((row) => ({
        state: row.state,
        state_abbr: row.state_abbr,
        entity_id: row.entity_id,
        source_name: row.agency || '',
        source_role_hints: [row.source_role],
        url: normalizeUrl(row.url),
        authority: row.authority,
        agency: row.agency || '',
        batch_class: row.batch_class || 'html',
        target_kind: row.target_kind || 'leaf_workflow_page',
        discovery_method: row.discovery_method || 'db_provenance',
        provenance_url: row.provenance_url || row.url,
        notes: row.notes || '',
        review_reason: row.review_reason || '',
        status: 'legacy_candidate',
      })),
  ]);
}

function globalFederalSeeds(oldPackRows) {
  const keep = new Map();
  for (const row of oldPackRows) {
    const host = domainFor(row.url);
    if (!FEDERAL_DOMAINS.has(host)) continue;
    const key = normalizeUrl(row.url);
    const current = keep.get(key);
    const next = {
      url: key,
      normalized_domain: host,
      source_role: row.source_role,
      taxonomy_role_id: row.source_role,
      authority: 'official_federal',
      agency: row.agency || titleCaseFromSlug(row.source_role),
      batch_class: row.batch_class || inferBatchClass('', row.url),
      target_kind: 'federal_reference',
      discovery_method: 'repo_artifact',
      provenance_url: row.provenance_url || row.url,
      status: 'legacy_candidate',
    };
    if (!current || key.length < current.url.length) keep.set(key, next);
  }
  return [...keep.values()].sort((a, b) => a.url.localeCompare(b.url));
}

function summarizeState(state, verifiedRows, blockedRows, unresolvedRows, federalRows, semanticFailures) {
  const stateVerified = verifiedRows.filter((row) => row.state === state.name);
  const stateBlocked = blockedRows.filter((row) => row.state === state.name);
  const stateUnresolved = unresolvedRows.filter((row) => row.state === state.name);
  const stateSemanticFailures = semanticFailures.filter((row) => row.state === state.name);
  const criticalVerified = stateVerified.filter((row) => row.role_confidence >= 0.5).length;
  const criticalNeeded = stateUnresolved.length + criticalVerified;
  return {
    state: state.name,
    verified_state_specific_targets: stateVerified.filter((row) => row.authority !== 'official_local').length,
    verified_local_targets: stateVerified.filter((row) => row.authority === 'official_local' || row.authority === 'official_county').length,
    unique_federal_targets_used: federalRows.length,
    unresolved_critical_roles: stateUnresolved.length,
    semantic_rejection_count: stateSemanticFailures.length,
    http_failure_count: stateBlocked.filter((row) => row.blocker_class === 'http_failure').length,
    browser_only_count: stateBlocked.filter((row) => row.browser_verification_required).length,
    exact_leaf_page_count: stateVerified.filter((row) => row.target_kind === 'leaf_workflow_page').length,
    generic_root_count: stateVerified.filter((row) => row.target_kind === 'official_root' || row.target_kind === 'directory_root').length,
    duplicate_url_count: stateVerified.length - new Set(stateVerified.map((row) => row.final_url || row.url)).size,
    critical_roles_verified_pct: criticalNeeded ? Math.round((criticalVerified / criticalNeeded) * 100) : 0,
  };
}

function buildMethodologyDoc(summaryRows, oldPackCount, verifiedCount, candidateCount, unresolvedCount) {
  const topLines = summaryRows.map((row) => `- ${row.state}: verified ${row.verified_state_specific_targets + row.verified_local_targets}, unresolved critical roles ${row.unresolved_critical_roles}, critical verification ${row.critical_roles_verified_pct}%`);
  return [
    '# State Source Pack Methodology v2',
    '',
    'This artifact replaces scraper-facing use of `all_states_source_pack_v1.jsonl` with a verified-acquisition workflow.',
    '',
    '## Core semantics',
    '',
    '- `all_states_source_pack_v1.jsonl` is audit-only inventory and must not feed scraper queues.',
    '- `verified_state_source_pack_v2.jsonl` contains only state/local or approved non-government URLs that passed HTTP and semantic verification in this run.',
    '- `global_federal_source_pack_v1.jsonl` dedupes federal crossover URLs once globally.',
    '- Existing provenance rows default to `legacy_candidate` unless re-verified.',
    '- Unresolved critical roles stay explicit in `state_source_unresolved_v2.jsonl`.',
    '',
    '## Verification gate',
    '',
    '- successful HTTP fetch or explicit blocked/browser-only classification',
    '- correct authority for the role',
    '- state jurisdiction match for state-specific roles',
    '- role-specific semantic evidence from title, headings, text, and URL path',
    '- generic roots do not satisfy critical leaf roles',
    '- DB field names cannot be treated as agency names',
    '',
    '## Five-state pass',
    '',
    `- Old audit-only inventory rows: ${oldPackCount}`,
    `- Verified state-specific rows in v2: ${verifiedCount}`,
    `- Candidate rows retained for review: ${candidateCount}`,
    `- Explicit unresolved roles: ${unresolvedCount}`,
    '',
    '## State summary',
    '',
    ...topLines,
    '',
  ].join('\n');
}

function buildUnresolvedRow(state, roleId, roleMeta, bestCandidate, reason) {
  return {
    state: state.name,
    state_abbr: state.abbr,
    workflow_category: roleMeta.workflowCategory,
    missing_role: roleId,
    critical: roleMeta.priority === 'critical',
    responsible_agency_type: (ROLE_RULES[roleId]?.allowedAuthorities || []).join('|'),
    attempted_domains: bestCandidate ? [domainFor(bestCandidate.url)] : [],
    best_candidate_url: bestCandidate?.url || '',
    unresolved_reason: reason,
    next_action: bestCandidate ? 'review_best_candidate_or_expand_official_navigation' : 'targeted_official_discovery_needed',
  };
}

async function main() {
  const { roleIndex } = loadTaxonomy();
  const args = parseArgs(process.argv.slice(2));
  const selectedStates = TARGET_STATES.filter((state) => args.states.includes(state.slug));
  const gapRows = readJsonl(gapPath).filter((row) => STATE_BY_NAME.has(row.state));
  const oldPackRows = readJsonl(oldPackPath);
  const repairRows = loadRepairRows();

  const verifiedRows = [];
  const candidateRows = [];
  const blockedRows = [];
  const unresolvedRows = [];
  const semanticFailures = [];
  const urlCache = new Map();

  const federalRows = globalFederalSeeds(oldPackRows)
    .filter((row) => ['able_account_program', 'ssi_child_disability', 'vocational_rehabilitation', 'pre_ets'].includes(row.source_role));

  for (const state of selectedStates) {
    const allStateCandidates = buildSourceCandidatesForState(state, oldPackRows, repairRows);
    const roles = buildRoleSetForState(gapRows, state);

    for (const roleId of roles) {
      const roleMeta = roleIndex.get(roleId);
      if (!roleMeta) continue;

      if (roleMeta.allowedAuthorities.includes('official_federal') && !ROLE_RULES[roleId]?.stateSpecific) {
        const fedMatch = federalRows.find((row) => row.source_role === roleId);
        if (!fedMatch) {
          unresolvedRows.push(buildUnresolvedRow(state, roleId, roleMeta, null, 'no_global_federal_source_verified'));
        }
        continue;
      }

      const candidatePool = dedupeCandidates([
        ...allStateCandidates.filter((candidate) => candidate.source_role_hints.includes(roleId)),
        ...collectLegacyCandidates(oldPackRows, state, roleId),
      ]).slice(0, 12);

      let resolved = false;
      let bestReviewCandidate = null;

      for (const candidate of candidatePool) {
        if (FEDERAL_DOMAINS.has(domainFor(candidate.url)) && ROLE_RULES[roleId]?.stateSpecific) {
          const failed = buildCandidateRow(candidate, roleId, roleMeta, 'federal_source_not_allowed_for_state_specific_role');
          semanticFailures.push(failed);
          continue;
        }

        let fetchResult = urlCache.get(candidate.url);
        if (!fetchResult) {
          try {
            fetchResult = await fetchWithTimeout(candidate.url);
          } catch (error) {
            blockedRows.push(buildBlockedRow(candidate, roleId, roleMeta, 'http_failure', error instanceof Error ? error.message : String(error)));
            continue;
          }
          urlCache.set(candidate.url, fetchResult);
        }

        const challengeReason = looksLikeChallenge(fetchResult.status, fetchResult.headers.contentType, bodyToUtf8(fetchResult.body), sha256Hex(fetchResult.body));
        if (challengeReason) {
          blockedRows.push(buildBlockedRow(
            candidate,
            roleId,
            roleMeta,
            fetchResult.status >= 400 ? 'http_failure' : 'http_blocked_challenge',
            challengeReason,
            fetchResult,
          ));
          continue;
        }

        const evaluation = evaluateCandidateForRole(candidate, roleId, roleMeta, state, fetchResult);
        if (evaluation.ok) {
          verifiedRows.push(buildVerifiedRow(candidate, roleId, roleMeta, evaluation));
          resolved = true;
          break;
        }

        const reviewCandidate = buildCandidateRow(candidate, roleId, roleMeta, evaluation.review_reason, evaluation);
        semanticFailures.push(reviewCandidate);
        if (!bestReviewCandidate) bestReviewCandidate = candidate;
      }

      if (!resolved) {
        if (bestReviewCandidate) {
          candidateRows.push(buildCandidateRow(bestReviewCandidate, roleId, roleMeta, 'best_candidate_requires_manual_review'));
        }
        unresolvedRows.push(buildUnresolvedRow(state, roleId, roleMeta, bestReviewCandidate, bestReviewCandidate ? 'best_candidate_failed_semantic_verification' : 'no_candidate_found'));
      }
    }
  }

  const summaryRows = selectedStates.map((state) => summarizeState(state, verifiedRows, blockedRows, unresolvedRows, federalRows, semanticFailures));
  const methodology = buildMethodologyDoc(summaryRows, readJsonl(oldPackPath).length, verifiedRows.length, candidateRows.length, unresolvedRows.length);

  writeJsonl(verifiedPackPath, verifiedRows);
  writeJsonl(candidatePackPath, candidateRows);
  writeJsonl(blockedPackPath, blockedRows);
  writeJsonl(unresolvedPackPath, unresolvedRows);
  writeJsonl(federalPackPath, federalRows);
  writeJsonl(semanticFailurePath, semanticFailures);
  writeCsv(summaryPath, summaryRows, [
    'state',
    'verified_state_specific_targets',
    'verified_local_targets',
    'unique_federal_targets_used',
    'unresolved_critical_roles',
    'semantic_rejection_count',
    'http_failure_count',
    'browser_only_count',
    'exact_leaf_page_count',
    'generic_root_count',
    'duplicate_url_count',
    'critical_roles_verified_pct',
  ]);
  fs.mkdirSync(path.dirname(methodologyPath), { recursive: true });
  fs.writeFileSync(methodologyPath, `${methodology}\n`);

  console.log(JSON.stringify({
    ok: true,
    states: selectedStates.map((state) => state.name),
    verifiedRows: verifiedRows.length,
    candidateRows: candidateRows.length,
    blockedRows: blockedRows.length,
    unresolvedRows: unresolvedRows.length,
    federalRows: federalRows.length,
    semanticFailures: semanticFailures.length,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
