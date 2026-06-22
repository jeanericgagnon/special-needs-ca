import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import {
  normalizeUrl,
  extractHtmlEvidence,
  fetchWithStatusRetry,
  writeJson,
  writeJsonl,
  wait,
} from './ca-source-pack-lightweight-lib.mjs';

const NM_STATE = 'New Mexico';
const NM_STATE_ABBR = 'NM';
const USER_AGENT = 'Ablefull NM low-token acquisition/1.0 (+https://ablefull.com)';

const DEFAULT_OPTIONS = {
  delayMs: 250,
  retryDelayMs: 800,
  requestTimeoutMs: 15000,
  bodyTimeoutMs: 15000,
  maxResponseBytes: 3_000_000,
  maxJobs: 75,
  maxCandidatesPerRole: 3,
};

const REGISTRY_SEEDS = [
  {
    agency: 'New Mexico Health Care Authority',
    program_family: 'developmental_disability_services',
    official_domains: ['hca.nm.gov', 'nmhealth.org'],
    authority: 'official_state',
    domain_evidence_url: 'https://www.hca.nm.gov/developmental-disabilities-supports-division/',
    evidence_title: 'Developmental Disabilities Supports Division',
    notes: 'Live HCA replacement for legacy nmhealth / dhhs DD routing pages.',
  },
  {
    agency: 'New Mexico Human Services Department / Medicaid',
    program_family: 'medicaid_hsd_hca',
    official_domains: ['hca.nm.gov', 'hsd.state.nm.us', 'yes.state.nm.us'],
    authority: 'official_state',
    domain_evidence_url: 'https://www.hca.nm.gov/lookingforassistance/apply-for-benefits/',
    evidence_title: 'Apply For Benefits',
    notes: 'Live HCA Medicaid/benefits application routing replacing legacy HSD MAD pages.',
  },
  {
    agency: 'Early intervention / Part C',
    program_family: 'early_intervention',
    official_domains: ['nmececd.org'],
    authority: 'official_state',
    domain_evidence_url: 'https://www.nmececd.org/family-infant-toddler-fit-program/',
    evidence_title: 'Family Infant Toddler (FIT) Program',
    notes: 'Live ECECD FIT program root replacing legacy dhhs early-intervention paths.',
  },
  {
    agency: 'New Mexico Public Education Department',
    program_family: 'special_education',
    official_domains: ['webnew.ped.state.nm.us'],
    authority: 'official_state',
    domain_evidence_url: 'https://webnew.ped.state.nm.us/bureaus/special-education/',
    evidence_title: 'New Mexico PED Special Education Bureau',
    notes: 'Backed by existing DB provenance.',
  },
  {
    agency: 'Social Security Administration',
    program_family: 'ssi',
    official_domains: ['ssa.gov'],
    authority: 'official_federal',
    domain_evidence_url: 'https://www.ssa.gov/benefits/disability/apply-child.html',
    evidence_title: 'Apply for Child SSI',
    notes: 'Federal crossover role only.',
  },
  {
    agency: 'ABLE National Resource Center',
    program_family: 'able',
    official_domains: ['ablenrc.org'],
    authority: 'high_authority_nonprofit',
    domain_evidence_url: 'https://www.ablenrc.org/',
    evidence_title: 'ABLE National Resource Center',
    notes: 'Approved ABLE authority for crossover guidance.',
  },
  {
    agency: 'Parent Center Hub',
    program_family: 'pti_parent_center',
    official_domains: ['parentcenterhub.org'],
    authority: 'high_authority_nonprofit',
    domain_evidence_url: 'https://www.parentcenterhub.org/find-your-center/',
    evidence_title: 'Find Your Parent Center',
    notes: 'Approved PTI discovery authority.',
  },
  {
    agency: 'Vocational Rehabilitation',
    program_family: 'vocational_rehabilitation',
    official_domains: [],
    authority: 'official_state',
    domain_evidence_url: '',
    evidence_title: '',
    notes: 'No reviewed New Mexico VR domain found in current repo/DB artifacts; keep unresolved until reviewed.',
  },
  {
    agency: 'Protection and Advocacy',
    program_family: 'protection_advocacy',
    official_domains: ['drnm.org'],
    authority: 'protection_advocacy',
    domain_evidence_url: 'https://drnm.org/',
    evidence_title: 'Disability Rights New Mexico',
    notes: 'Reviewed statewide New Mexico P&A domain.',
  },
  {
    agency: 'Legal Aid',
    program_family: 'legal_aid',
    official_domains: ['lawhelpnewmexico.org'],
    authority: 'legal_aid',
    domain_evidence_url: 'https://www.lawhelpnewmexico.org/',
    evidence_title: 'Law Help New Mexico',
    notes: 'Authoritative statewide legal-help portal; browser-assisted or JS-aware verification may still be required.',
  },
  {
    agency: 'State or county directory roots',
    program_family: 'local_office_directories',
    official_domains: ['hca.nm.gov', 'nmhealth.org', 'hsd.state.nm.us', 'webnew.ped.state.nm.us', 'nmececd.org'],
    authority: 'official_state',
    domain_evidence_url: 'https://www.hca.nm.gov/lookingforassistance/',
    evidence_title: 'New Mexico official directory root hints',
    notes: 'Used only for role-specific official directory discovery.',
  },
];

const ROLE_DEFINITIONS = [
  role('main_dd_agency', 'dd_routing', 'dd_system', 'critical', 'New Mexico Health Care Authority', ['hca.nm.gov', 'nmhealth.org'], ['developmental', 'disabilities'], ['supports', 'division', 'agency', 'services'], ['early intervention', 'school complaint'], ['html'], 'State DD agency entry point.'),
  role('dd_eligibility', 'dd_routing', 'dd_system', 'critical', 'New Mexico Health Care Authority', ['hca.nm.gov', 'nmhealth.org'], ['eligibility'], ['developmental', 'disabilities'], ['school complaint'], ['html', 'pdf'], 'DD eligibility page.'),
  role('dd_intake_application', 'dd_routing', 'dd_system', 'critical', 'New Mexico Health Care Authority', ['hca.nm.gov', 'nmhealth.org'], ['developmental'], ['apply', 'intake', 'application', 'services'], ['school complaint'], ['html', 'pdf', 'portal'], 'DD intake/application path.'),
  role('dd_local_regional_office_directory', 'dd_routing', 'dd_system', 'critical', 'New Mexico Health Care Authority', ['hca.nm.gov', 'nmhealth.org'], ['developmental'], ['directory', 'regional', 'contact', 'locations'], ['employment', 'tax'], ['html'], 'DD local or regional office directory.'),
  role('dd_waiver_programs', 'programs_benefits', 'dd_system', 'critical', 'New Mexico Health Care Authority', ['hca.nm.gov', 'nmhealth.org'], ['waiver'], ['hcbs', 'developmental', 'disabilities'], ['school complaint'], ['html', 'pdf'], 'DD waiver/program entry page.'),
  role('dd_appeals_complaints', 'programs_benefits', 'dd_system', 'critical', 'New Mexico Health Care Authority', ['hca.nm.gov', 'nmhealth.org'], ['developmental'], ['appeal', 'complaint', 'hearing', 'grievance'], ['special education'], ['html', 'pdf'], 'DD appeals or complaints path.'),
  role('medicaid_application', 'programs_benefits', 'medicaid_and_waivers', 'critical', 'New Mexico Human Services Department / Medicaid', ['hca.nm.gov', 'hsd.state.nm.us', 'yes.state.nm.us'], ['benefits'], ['apply', 'application', 'medicaid'], ['employment', 'provider enrollment'], ['html', 'portal', 'pdf'], 'Medicaid application path.'),
  role('medicaid_eligibility', 'programs_benefits', 'medicaid_and_waivers', 'critical', 'New Mexico Human Services Department / Medicaid', ['hca.nm.gov', 'hsd.state.nm.us', 'yes.state.nm.us'], ['medicaid'], ['eligibility', 'benefits', 'qualify'], ['employment'], ['html', 'pdf'], 'Medicaid eligibility page.'),
  role('personal_care_attendant_care', 'programs_benefits', 'medicaid_and_waivers', 'critical', 'New Mexico Human Services Department / Medicaid', ['hca.nm.gov', 'hsd.state.nm.us'], ['care'], ['personal', 'attendant', 'pcs'], ['employment'], ['html', 'pdf'], 'Personal care / attendant care page.'),
  role('hcbs_waivers', 'waivers', 'medicaid_and_waivers', 'critical', 'New Mexico Human Services Department / Medicaid', ['hca.nm.gov', 'nmhealth.org', 'hsd.state.nm.us'], ['waiver'], ['hcbs', 'home and community'], ['special education'], ['html', 'pdf'], 'HCBS waiver entry page.'),
  role('medicaid_grievances_appeals', 'programs_benefits', 'medicaid_and_waivers', 'critical', 'New Mexico Human Services Department / Medicaid', ['hca.nm.gov', 'hsd.state.nm.us'], ['medicaid'], ['appeal', 'grievance'], ['special education'], ['html', 'pdf'], 'Medicaid appeals or grievances page.'),
  role('medicaid_fair_hearing', 'programs_benefits', 'medicaid_and_waivers', 'critical', 'New Mexico Human Services Department / Medicaid', ['hca.nm.gov', 'hsd.state.nm.us', 'yes.state.nm.us'], ['hearing'], ['fair hearing', 'hearing request'], ['special education'], ['html', 'pdf', 'portal'], 'Medicaid fair-hearing path.'),
  role('medicaid_renewals_redeterminations', 'programs_benefits', 'medicaid_and_waivers', 'critical', 'New Mexico Human Services Department / Medicaid', ['hca.nm.gov', 'hsd.state.nm.us', 'yes.state.nm.us'], ['benefits'], ['renew', 'redetermination', 'recertification'], ['provider'], ['html', 'pdf', 'portal'], 'Medicaid renewals/redeterminations.'),
  role('ei_part_c_program', 'programs_benefits', 'early_intervention', 'critical', 'Early intervention / Part C', ['nmececd.org'], ['fit'], ['family infant toddler', 'early intervention', 'birth to age three'], ['medicaid'], ['html', 'pdf'], 'Part C program page.'),
  role('ei_referral_intake', 'programs_benefits', 'early_intervention', 'critical', 'Early intervention / Part C', ['nmececd.org'], ['fit'], ['referral', 'make a referral', 'intake', 'refer'], ['medicaid'], ['html', 'pdf', 'portal'], 'EI referral/intake.'),
  role('ei_eligibility', 'programs_benefits', 'early_intervention', 'critical', 'Early intervention / Part C', ['nmececd.org'], ['fit'], ['eligibility', 'eligible', 'developmental delay'], ['medicaid'], ['html', 'pdf'], 'EI eligibility.'),
  role('ei_local_office_directory', 'education_routing', 'early_intervention', 'critical', 'Early intervention / Part C', ['nmececd.org'], ['regional office'], ['map', 'county', 'contact', 'family infant toddler'], ['employment'], ['html'], 'EI local office directory.'),
  role('ei_family_rights', 'education_routing', 'early_intervention', 'critical', 'Early intervention / Part C', ['nmececd.org'], ['fit'], ['family rights', 'parent rights', 'procedural safeguards'], ['medicaid'], ['html', 'pdf'], 'EI family rights page.'),
  role('ei_complaints_mediation_due_process', 'education_routing', 'early_intervention', 'critical', 'Early intervention / Part C', ['nmececd.org'], ['fit'], ['complaint', 'mediation', 'due process'], ['medicaid'], ['html', 'pdf'], 'EI disputes page.'),
  role('special_education_parent_rights', 'education_routing', 'education_and_disputes', 'critical', 'New Mexico Public Education Department', ['webnew.ped.state.nm.us'], ['special education'], ['parent rights', 'procedural safeguards'], ['medicaid'], ['html', 'pdf'], 'Special-education parent rights.'),
  role('state_complaints', 'education_routing', 'education_and_disputes', 'critical', 'New Mexico Public Education Department', ['webnew.ped.state.nm.us'], ['complaint'], ['special education'], ['medicaid'], ['html', 'pdf', 'portal'], 'State complaint path.'),
  role('special_education_mediation', 'education_routing', 'education_and_disputes', 'critical', 'New Mexico Public Education Department', ['webnew.ped.state.nm.us'], ['mediation'], ['special education'], ['medicaid'], ['html', 'pdf'], 'Special-education mediation path.'),
  role('special_education_due_process', 'education_routing', 'education_and_disputes', 'critical', 'New Mexico Public Education Department', ['webnew.ped.state.nm.us'], ['due process'], ['special education', 'hearing'], ['medicaid'], ['html', 'pdf', 'portal'], 'Special-education due-process path.'),
  role('school_district_directory', 'education_routing', 'education_and_disputes', 'high', 'New Mexico Public Education Department', ['webnew.ped.state.nm.us'], ['district'], ['directory', 'school'], ['provider'], ['html', 'xlsx'], 'District routing directory.'),
  role('parent_training_information_center', 'advocates_legal', 'local_resource_directories', 'high', 'Parent Center Hub', ['parentcenterhub.org'], ['parent'], ['center', 'training', 'family'], ['medicaid'], ['html'], 'New Mexico PTI / parent center.'),
  role('protection_advocacy_resources', 'advocates_legal', 'local_resource_directories', 'high', 'Protection and Advocacy', ['drnm.org'], ['disability'], ['rights', 'advocacy'], ['medicaid'], ['html'], 'Protection and advocacy resource.'),
  role('legal_aid_resources', 'advocates_legal', 'local_resource_directories', 'high', 'Legal Aid', ['lawhelpnewmexico.org'], ['law help'], ['legal', 'aid', 'services', 'help'], ['state bar directory'], ['html'], 'Legal aid resource.'),
  role('vocational_rehabilitation', 'programs_benefits', 'federal_state_crossover', 'high', 'Vocational Rehabilitation', [], ['vocational'], ['rehabilitation'], ['medicaid'], ['html', 'pdf'], 'Vocational rehabilitation path.'),
  role('pre_ets', 'programs_benefits', 'federal_state_crossover', 'high', 'Vocational Rehabilitation', [], ['transition'], ['pre-ets', 'pre employment', 'pre-employment'], ['medicaid'], ['html', 'pdf'], 'Pre-ETS path.'),
  role('able_account_program', 'programs_benefits', 'federal_state_crossover', 'high', 'ABLE National Resource Center', ['ablenrc.org'], ['able'], ['account', 'new mexico'], ['medicaid'], ['html', 'pdf'], 'ABLE account guidance.'),
  role('ssi_child_disability', 'programs_benefits', 'federal_state_crossover', 'high', 'Social Security Administration', ['ssa.gov'], ['ssi'], ['child', 'disability'], ['medicaid'], ['html', 'pdf'], 'Child SSI guidance.'),
];

const DIRECTORY_ROLE_IDS = new Set([
  'dd_local_regional_office_directory',
  'ei_local_office_directory',
  'school_district_directory',
]);

const FEDERAL_ALLOWED_ROLE_IDS = new Set([
  'able_account_program',
  'ssi_child_disability',
]);

const PORTAL_HINTS = [/portal/i, /login/i, /sign in/i];
const CHALLENGE_HINTS = [/access denied/i, /request unsuccessful/i, /incapsula/i, /cloudflare/i];
const GENERIC_HOME_PATTERNS = [/^\/$/, /^\/index(?:\.[a-z]+)?$/i];

function role(id, sourceRole, workflowCategory, requiredPriority, responsibleAgency, allowedDomains, mustHaveTerms, shouldHaveTerms, prohibitedTerms, acceptableBatchClasses, whyItMatters) {
  return {
    state: NM_STATE,
    role_id: id,
    source_role: sourceRole,
    workflow_category: workflowCategory,
    required_priority: requiredPriority,
    responsible_agency: responsibleAgency,
    allowed_domains: allowedDomains,
    must_have_terms: mustHaveTerms,
    should_have_terms: shouldHaveTerms,
    prohibited_terms: prohibitedTerms,
    acceptable_batch_classes: acceptableBatchClasses,
    why_it_matters: whyItMatters,
  };
}

function normalizeDomain(value) {
  return String(value || '').trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '').toLowerCase();
}

function urlDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function urlPath(url) {
  try {
    return new URL(url).pathname || '/';
  } catch {
    return '/';
  }
}

function readJsonlIfExists(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function readJsonIfExists(filePath, fallbackValue = null) {
  if (!fs.existsSync(filePath)) return fallbackValue;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function stableUnique(values) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    const normalized = String(value || '').trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

function loadDbHints(dbPath) {
  if (!fs.existsSync(dbPath)) return [];
  const db = new Database(dbPath, { readonly: true });
  const rows = [];
  const statements = [
    "SELECT 'programs' AS source, source_url AS url, official_source_url AS extra_url, state_id AS state_id FROM programs WHERE state_id = 'new-mexico'",
    "SELECT 'state_resource_agencies' AS source, source_url AS url, website AS extra_url, state_id AS state_id FROM state_resource_agencies WHERE state_id = 'new-mexico'",
    "SELECT 'regional_education_agencies' AS source, source_url AS url, website AS extra_url, state_id AS state_id FROM regional_education_agencies WHERE state_id = 'new-mexico'",
  ];
  for (const sql of statements) {
    for (const row of db.prepare(sql).all()) {
      for (const candidate of [row.url, row.extra_url]) {
        if (!candidate) continue;
        rows.push({
          source: row.source,
          url: candidate,
          domain: urlDomain(candidate),
        });
      }
    }
  }
  db.close();
  return rows;
}

function loadRepoHints(repoRoot) {
  const unresolvedPath = path.join(repoRoot, 'data', 'generated', 'state_source_unresolved_v2.jsonl');
  const candidatePath = path.join(repoRoot, 'data', 'generated', 'state_source_candidates_v2.jsonl');
  const targetPath = path.join(repoRoot, 'data', 'source_targets', 'new-mexico.json');
  return {
    unresolvedRows: readJsonlIfExists(unresolvedPath).filter((row) => row.state === NM_STATE),
    candidateRows: readJsonlIfExists(candidatePath).filter((row) => row.state === NM_STATE),
    sourceTargets: readJsonIfExists(targetPath, []),
  };
}

function mergeRegistryWithHints(repoRoot, dbPath) {
  const { unresolvedRows, candidateRows, sourceTargets } = loadRepoHints(repoRoot);
  const dbHints = loadDbHints(dbPath);
  const allHints = [
    ...unresolvedRows.map((row) => row.best_candidate_url).filter(Boolean),
    ...candidateRows.map((row) => row.url).filter(Boolean),
    ...sourceTargets.map((row) => row.source_url).filter(Boolean),
    ...REGISTRY_SEEDS.map((row) => row.domain_evidence_url).filter(Boolean),
    ...dbHints.map((row) => row.url).filter(Boolean),
  ];
  const hintedDomains = new Set(allHints.map(urlDomain).filter(Boolean));
  return REGISTRY_SEEDS.map((seed) => ({
    state: NM_STATE,
    agency: seed.agency,
    program_family: seed.program_family,
    official_domains: stableUnique(seed.official_domains.map(normalizeDomain)).filter((domain) => !domain || hintedDomains.has(domain) || ['ssa.gov', 'ablenrc.org', 'parentcenterhub.org', 'hca.nm.gov', 'nmececd.org', 'drnm.org', 'lawhelpnewmexico.org', 'yes.state.nm.us'].includes(domain)),
    authority: seed.authority,
    domain_evidence_url: seed.domain_evidence_url,
    evidence_title: seed.evidence_title,
    notes: seed.notes,
  }));
}

function buildMissingRoles(registryRows) {
  const registryByAgency = new Map(registryRows.map((row) => [row.agency, row]));
  return ROLE_DEFINITIONS.map((roleDef) => {
    const matchingRegistry = registryRows.filter((row) => (
      row.program_family === mapRoleToProgramFamily(roleDef.role_id)
      || row.agency === roleDef.responsible_agency
    ));
    const allowedDomains = stableUnique([
      ...roleDef.allowed_domains,
      ...matchingRegistry.flatMap((row) => row.official_domains || []),
      ...(registryByAgency.get(roleDef.responsible_agency)?.official_domains || []),
    ].map(normalizeDomain));
    return {
      ...roleDef,
      allowed_domains: allowedDomains,
    };
  });
}

function mapRoleToProgramFamily(roleId) {
  if (roleId.startsWith('dd_') || roleId === 'main_dd_agency') return 'developmental_disability_services';
  if (roleId.startsWith('medicaid_') || roleId === 'personal_care_attendant_care' || roleId === 'hcbs_waivers') return 'medicaid_hsd_hca';
  if (roleId.startsWith('ei_')) return 'early_intervention';
  if (roleId.includes('education') || roleId.includes('district') || roleId === 'state_complaints') return 'special_education';
  if (roleId.includes('parent') || roleId.includes('pti')) return 'pti_parent_center';
  if (roleId.includes('advocacy')) return 'protection_advocacy';
  if (roleId.includes('legal')) return 'legal_aid';
  if (roleId === 'able_account_program') return 'able';
  if (roleId === 'ssi_child_disability') return 'ssi';
  if (roleId === 'vocational_rehabilitation' || roleId === 'pre_ets') return 'vocational_rehabilitation';
  return 'local_office_directories';
}

function isGenericHomepage(url) {
  const pathname = urlPath(url);
  return GENERIC_HOME_PATTERNS.some((pattern) => pattern.test(pathname));
}

function chooseBatchClass(url, roleRow) {
  const pathname = urlPath(url).toLowerCase();
  if (pathname.endsWith('.pdf')) return 'pdf';
  if (pathname.endsWith('.xlsx') || pathname.endsWith('.xls')) return 'spreadsheet';
  if (pathname.endsWith('.docx') || pathname.endsWith('.doc')) return 'document';
  if (PORTAL_HINTS.some((pattern) => pattern.test(url))) return 'portal';
  if (DIRECTORY_ROLE_IDS.has(roleRow.role_id)) return 'directory_root';
  return 'html';
}

function estimateCandidateRelevance(candidateUrl, evidenceText, roleRow) {
  const haystack = `${candidateUrl} ${evidenceText}`.toLowerCase();
  const mustHits = roleRow.must_have_terms.filter((term) => haystack.includes(String(term).toLowerCase())).length;
  const shouldHits = roleRow.should_have_terms.filter((term) => haystack.includes(String(term).toLowerCase())).length;
  const prohibitedHits = roleRow.prohibited_terms.filter((term) => haystack.includes(String(term).toLowerCase())).length;
  if (prohibitedHits > 0) return 'low';
  if (mustHits >= Math.max(1, Math.ceil(roleRow.must_have_terms.length / 2)) && shouldHits >= 1) return 'high';
  if (mustHits >= 1) return 'medium';
  return 'low';
}

async function fetchTextPage(url, options, fetchImpl = global.fetch) {
  const response = await fetchImpl(url, {
    headers: {
      'user-agent': USER_AGENT,
      'accept-language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(options.requestTimeoutMs),
  });
  const contentType = String(response.headers.get('content-type') || '').toLowerCase();
  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    finalUrl: response.url || url,
    contentType,
    text,
  };
}

function parseSitemapUrls(xmlText, parentUrl, allowedDomain) {
  const matches = [...String(xmlText || '').matchAll(/<loc>([^<]+)<\/loc>/gi)];
  const urls = [];
  for (const match of matches) {
    const candidate = match[1]?.trim();
    if (!candidate) continue;
    try {
      const normalized = normalizeUrl(candidate);
      if (urlDomain(normalized) !== allowedDomain) continue;
      urls.push({
        url: normalized,
        discovery_method: /sitemapindex/i.test(parentUrl) ? 'sitemap_index' : 'sitemap_xml',
        discovery_parent_url: parentUrl,
        link_text_or_sitemap_evidence: 'sitemap <loc>',
      });
    } catch {
      // ignore invalid URLs
    }
  }
  return urls;
}

function parseHtmlLinks(html, parentUrl, allowedDomain) {
  const links = [];
  const pattern = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match = pattern.exec(String(html || ''));
  while (match) {
    try {
      const resolved = normalizeUrl(new URL(match[1], parentUrl).toString());
      if (urlDomain(resolved) !== allowedDomain) {
        match = pattern.exec(String(html || ''));
        continue;
      }
      const text = String(match[2] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      links.push({
        url: resolved,
        discovery_method: 'same_domain_index_links',
        discovery_parent_url: parentUrl,
        link_text_or_sitemap_evidence: text || 'same-domain link',
      });
    } catch {
      // ignore invalid URL
    }
    match = pattern.exec(String(html || ''));
  }
  return links;
}

export async function discoverNmCandidates({ registryRows, roleRows, options = {}, fetchImpl = global.fetch }) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const candidates = [];
  const seedFetchCache = new Map();
  for (const roleRow of roleRows) {
    if (!roleRow.allowed_domains.length) continue;
    const roleCandidates = [];
    for (const domain of roleRow.allowed_domains) {
      const registryRowsForDomain = registryRows.filter((row) => row.official_domains.includes(domain));
      const seedUrls = stableUnique([
        ...registryRowsForDomain.map((row) => row.domain_evidence_url).filter(Boolean),
        `https://${domain}/`,
      ]);
      for (const seedUrl of seedUrls) {
        const hasDirectRoleMatch = registryRowsForDomain.some((row) => (
          row.program_family === mapRoleToProgramFamily(roleRow.role_id)
          || row.agency === roleRow.responsible_agency
        ));
        let seedRelevance = estimateCandidateRelevance(seedUrl, seedUrl, roleRow);
        if (hasDirectRoleMatch && seedRelevance === 'low') seedRelevance = 'medium';
        if (!(isGenericHomepage(seedUrl) && !DIRECTORY_ROLE_IDS.has(roleRow.role_id))) {
          roleCandidates.push({
            state: NM_STATE,
            role_id: roleRow.role_id,
            source_role: roleRow.source_role,
            candidate_url: seedUrl,
            discovery_method: 'official_site_navigation',
            discovery_parent_url: registryRowsForDomain[0]?.domain_evidence_url || seedUrl,
            link_text_or_sitemap_evidence: 'registry seed',
            responsible_agency: roleRow.responsible_agency,
            allowed_domain_matched: domain,
            existed_in_old_repo: true,
            candidate_reason: 'registry or provenance seed',
            estimated_relevance: seedRelevance,
          });
        }

        try {
          if (!seedFetchCache.has(seedUrl)) {
            seedFetchCache.set(seedUrl, fetchTextPage(seedUrl, opts, fetchImpl).catch((error) => ({ error })));
          }
          const fetched = await seedFetchCache.get(seedUrl);
          if (fetched?.error) {
            await wait(opts.delayMs);
            continue;
          }
          if (!fetched.ok || !String(fetched.contentType).includes('html')) {
            await wait(opts.delayMs);
            continue;
          }
          const discovered = [
            ...parseHtmlLinks(fetched.text, fetched.finalUrl, domain),
            ...parseSitemapUrls(fetched.text, fetched.finalUrl, domain),
          ];
          for (const item of discovered) {
            const relevance = estimateCandidateRelevance(item.url, item.link_text_or_sitemap_evidence, roleRow);
            if (relevance === 'low') continue;
            if (!DIRECTORY_ROLE_IDS.has(roleRow.role_id) && isGenericHomepage(item.url)) continue;
            roleCandidates.push({
              state: NM_STATE,
              role_id: roleRow.role_id,
              source_role: roleRow.source_role,
              candidate_url: item.url,
              discovery_method: item.discovery_method,
              discovery_parent_url: item.discovery_parent_url,
              link_text_or_sitemap_evidence: item.link_text_or_sitemap_evidence,
              responsible_agency: roleRow.responsible_agency,
              allowed_domain_matched: domain,
              existed_in_old_repo: false,
              candidate_reason: 'same-domain role-term match',
              estimated_relevance: relevance,
            });
          }
        } catch {
          // Discovery is allowed to fail closed.
        }
        await wait(opts.delayMs);
      }
    }
    const deduped = new Map();
    for (const row of roleCandidates) {
      const key = normalizeUrl(row.candidate_url);
      if (!deduped.has(key)) deduped.set(key, row);
    }
    const retained = [...deduped.values()]
      .sort((a, b) => scoreRelevance(b.estimated_relevance) - scoreRelevance(a.estimated_relevance) || a.candidate_url.localeCompare(b.candidate_url))
      .slice(0, opts.maxCandidatesPerRole);
    candidates.push(...retained);
  }
  return candidates;
}

function scoreRelevance(level) {
  return level === 'high' ? 3 : level === 'medium' ? 2 : 1;
}

export function buildNmScraperQueue(candidateRows, roleRows, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const roleById = new Map(roleRows.map((row) => [row.role_id, row]));
  const queue = [];
  const byRole = new Map();

  for (const candidate of candidateRows) {
    const roleRow = roleById.get(candidate.role_id);
    if (!roleRow) continue;
    if (candidate.estimated_relevance === 'low') continue;
    if (!roleRow.allowed_domains.includes(candidate.allowed_domain_matched)) continue;
    const current = byRole.get(candidate.role_id) || [];
    if (current.length >= opts.maxCandidatesPerRole) continue;
    const row = {
      job_id: `${candidate.role_id}__${current.length + 1}`,
      state: NM_STATE,
      role_id: candidate.role_id,
      source_role: candidate.source_role,
      url: candidate.candidate_url,
      allowed_domains: roleRow.allowed_domains,
      expected_agency: roleRow.responsible_agency,
      expected_content_type: roleRow.acceptable_batch_classes.includes('pdf') ? 'text/html|application/pdf' : 'text/html',
      must_have_terms: roleRow.must_have_terms,
      prohibited_terms: roleRow.prohibited_terms,
      max_bytes: opts.maxResponseBytes,
      timeout_ms: opts.requestTimeoutMs,
      fetch_mode: roleRow.acceptable_batch_classes.includes('portal') && PORTAL_HINTS.some((pattern) => pattern.test(candidate.candidate_url)) ? 'portal_check' : 'http_fetch',
      evidence_to_extract: ['title', 'h1', 'headings', 'text_sample'],
      batch_class: chooseBatchClass(candidate.candidate_url, roleRow),
      discovery_method: candidate.discovery_method,
      estimated_relevance: candidate.estimated_relevance,
      existed_in_old_repo: candidate.existed_in_old_repo,
    };
    current.push(row);
    byRole.set(candidate.role_id, current);
    queue.push(row);
    if (queue.length >= opts.maxJobs) break;
  }

  return queue;
}

function extractRelevantEvidence(fetchEntry) {
  const evidence = extractHtmlEvidence(fetchEntry.bodyText || '', fetchEntry.finalUrl || fetchEntry.url || '');
  return {
    title: evidence.title,
    h1: evidence.h1,
    headings: evidence.h2s,
    text_sample: evidence.textSample,
  };
}

function contentSupportsRole(fetchEntry, roleRow) {
  const evidence = extractRelevantEvidence(fetchEntry);
  const haystack = `${fetchEntry.finalUrl || ''} ${evidence.title} ${evidence.h1} ${(evidence.headings || []).join(' ')} ${evidence.text_sample}`.toLowerCase();
  const mustCount = roleRow.must_have_terms.filter((term) => haystack.includes(String(term).toLowerCase())).length;
  const shouldCount = roleRow.should_have_terms.filter((term) => haystack.includes(String(term).toLowerCase())).length;
  const prohibitedCount = roleRow.prohibited_terms.filter((term) => haystack.includes(String(term).toLowerCase())).length;
  const nmMention = /\bnew mexico\b|\bnm\b/i.test(haystack) || urlDomain(fetchEntry.finalUrl || '')?.endsWith('.nm.us');
  const agencyMatch = haystack.includes(String(roleRow.responsible_agency).toLowerCase().split(' / ')[0].toLowerCase())
    || roleRow.allowed_domains.includes(urlDomain(fetchEntry.finalUrl || ''));
  const roleConfidence = Math.max(0, Math.min(1, (
    (mustCount >= 1 ? 0.45 : 0)
    + (shouldCount >= 1 ? 0.2 : 0)
    + (nmMention ? 0.15 : 0)
    + (agencyMatch ? 0.15 : 0)
    - (prohibitedCount > 0 ? 0.5 : 0)
    - (isGenericHomepage(fetchEntry.finalUrl || '') && !DIRECTORY_ROLE_IDS.has(roleRow.role_id) ? 0.3 : 0)
  )));

  return {
    evidence,
    mustCount,
    shouldCount,
    prohibitedCount,
    nmMention,
    agencyMatch,
    roleConfidence,
    supported: prohibitedCount === 0
      && mustCount >= 1
      && nmMention
      && (DIRECTORY_ROLE_IDS.has(roleRow.role_id) || !isGenericHomepage(fetchEntry.finalUrl || '')),
  };
}

function routeBlockedLane(fetchEntry) {
  const text = `${fetchEntry.errorCode || ''} ${fetchEntry.errorMessage || ''} ${fetchEntry.bodyText || ''}`.toLowerCase();
  if (CHALLENGE_HINTS.some((pattern) => pattern.test(text))) return 'browser_assisted';
  if (fetchEntry.httpStatus === 403 || fetchEntry.httpStatus === 429) return 'browser_assisted';
  if (fetchEntry.httpStatus === 404) return 'repair';
  return 'permanently_blocked';
}

export async function runNmScraperQueue({ queueRows, roleRows, outputDir, options = {}, fetchImpl = global.fetch }) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const roleById = new Map(roleRows.map((row) => [row.role_id, row]));
  const verifiedRows = [];
  const rejectedRows = [];
  const blockedRows = [];

  for (const job of queueRows) {
    const roleRow = roleById.get(job.role_id);
    const fetchEntry = await fetchWithStatusRetry({
      url: job.url,
      batch_class: job.batch_class,
      entity_id: job.role_id,
      source_role: job.source_role,
    }, {
      requestTimeoutMs: opts.requestTimeoutMs,
      bodyTimeoutMs: opts.bodyTimeoutMs,
      rateLimitMs: opts.delayMs,
      retryDelayMs: opts.retryDelayMs,
      maxResponseBytes: opts.maxResponseBytes,
    }, fetchImpl);

    const baseRow = {
      state: job.state,
      role_id: job.role_id,
      source_role: job.source_role,
      url: job.url,
      final_url: fetchEntry.finalUrl || job.url,
      http_status: fetchEntry.httpStatus,
      content_type: fetchEntry.contentType,
      fetched_at: fetchEntry.fetchedAt,
      allowed_domains: job.allowed_domains,
      expected_agency: job.expected_agency,
      discovery_method: job.discovery_method,
      existed_in_old_repo: job.existed_in_old_repo,
      batch_class: job.batch_class,
      error_code: fetchEntry.errorCode || '',
      error_message: fetchEntry.errorMessage || '',
    };

    if (!fetchEntry.ok || fetchEntry.errorCode === 'blocked_http_403' || fetchEntry.errorCode === 'blocked_fetch_challenge') {
      blockedRows.push({
        ...baseRow,
        terminal_state: 'blocked',
        next_lane: routeBlockedLane(fetchEntry),
        blocker_reason: fetchEntry.errorCode || fetchEntry.errorMessage || 'blocked_fetch',
      });
      await wait(opts.delayMs);
      continue;
    }

    const domain = urlDomain(fetchEntry.finalUrl || job.url);
    if (!job.allowed_domains.includes(domain)) {
      rejectedRows.push({
        ...baseRow,
        terminal_state: 'rejected',
        rejection_reason: 'wrong_domain_after_fetch',
      });
      await wait(opts.delayMs);
      continue;
    }

    if (FEDERAL_ALLOWED_ROLE_IDS.has(job.role_id) === false && (domain === 'ssa.gov' || domain === 'medicaid.gov' || domain === 'sites.ed.gov' || domain === 'acl.gov')) {
      rejectedRows.push({
        ...baseRow,
        terminal_state: 'rejected',
        rejection_reason: 'federal_page_not_allowed_for_state_role',
      });
      await wait(opts.delayMs);
      continue;
    }

    const support = contentSupportsRole(fetchEntry, roleRow);
    if (support.supported && support.roleConfidence >= 0.8) {
      verifiedRows.push({
        state: NM_STATE,
        state_abbr: NM_STATE_ABBR,
        role_id: job.role_id,
        source_role: job.source_role,
        workflow_category: roleRow.workflow_category,
        url: job.url,
        final_url: fetchEntry.finalUrl || job.url,
        authority: inferAuthorityForRole(roleRow),
        agency: roleRow.responsible_agency,
        batch_class: job.batch_class,
        status: 'verified_target',
        provenance_url: job.url,
        verification_method: 'low_token_fresh_fetch',
        http_status: fetchEntry.httpStatus,
        content_type: fetchEntry.contentType,
        title_evidence: support.evidence.title,
        heading_evidence: [support.evidence.h1, ...(support.evidence.headings || [])].filter(Boolean),
        text_sample: support.evidence.text_sample,
        role_confidence: Number(support.roleConfidence.toFixed(2)),
        verification_reason: 'fresh_fetch_semantic_verification_passed',
        reviewed_at: new Date().toISOString(),
      });
    } else {
      rejectedRows.push({
        ...baseRow,
        terminal_state: 'rejected',
        role_confidence: Number(support.roleConfidence.toFixed(2)),
        title_evidence: support.evidence.title,
        heading_evidence: [support.evidence.h1, ...(support.evidence.headings || [])].filter(Boolean),
        text_sample: support.evidence.text_sample,
        rejection_reason: support.prohibitedCount > 0
          ? 'prohibited_terms_present'
          : support.mustCount < 1
            ? 'missing_role_terms'
            : isGenericHomepage(fetchEntry.finalUrl || '') && !DIRECTORY_ROLE_IDS.has(job.role_id)
              ? 'generic_homepage_for_leaf_role'
              : 'role_confidence_below_threshold',
      });
    }
    await wait(opts.delayMs);
  }

  const unresolvedRows = buildUnresolvedRoles(roleRows, queueRows, verifiedRows, rejectedRows, blockedRows);
  const summary = buildSummary(roleRows, queueRows, verifiedRows, rejectedRows, blockedRows, unresolvedRows);

  writeJsonl(path.join(outputDir, 'nm_verified_source_pack_v1.jsonl'), verifiedRows);
  writeJsonl(path.join(outputDir, 'nm_rejected_scrapes_v1.jsonl'), rejectedRows);
  writeJsonl(path.join(outputDir, 'nm_blocked_scrapes_v1.jsonl'), blockedRows);
  writeJsonl(path.join(outputDir, 'nm_unresolved_roles_v1.jsonl'), unresolvedRows);
  writeJson(path.join(outputDir, 'nm_low_token_acquisition_summary_v1.json'), summary);

  return { verifiedRows, rejectedRows, blockedRows, unresolvedRows, summary };
}

function inferAuthorityForRole(roleRow) {
  if (roleRow.allowed_domains.includes('ssa.gov')) return 'official_federal';
  if (roleRow.allowed_domains.includes('parentcenterhub.org') || roleRow.allowed_domains.includes('ablenrc.org') || roleRow.allowed_domains.includes('drnm.org') || roleRow.allowed_domains.includes('lawhelpnewmexico.org')) return 'high_authority_nonprofit';
  return 'official_state';
}

function buildUnresolvedRoles(roleRows, queueRows, verifiedRows, rejectedRows, blockedRows) {
  const verifiedRoleIds = new Set(verifiedRows.map((row) => row.role_id));
  const queueByRole = new Map();
  for (const row of queueRows) {
    const current = queueByRole.get(row.role_id) || [];
    current.push(row);
    queueByRole.set(row.role_id, current);
  }
  const rejectedByRole = groupBy(rejectedRows, (row) => row.role_id);
  const blockedByRole = groupBy(blockedRows, (row) => row.role_id);
  return roleRows
    .filter((roleRow) => !verifiedRoleIds.has(roleRow.role_id))
    .map((roleRow) => {
      const queueItems = queueByRole.get(roleRow.role_id) || [];
      const rejected = rejectedByRole.get(roleRow.role_id) || [];
      const blocked = blockedByRole.get(roleRow.role_id) || [];
      return {
        state: NM_STATE,
        role_id: roleRow.role_id,
        source_role: roleRow.source_role,
        workflow_category: roleRow.workflow_category,
        required_priority: roleRow.required_priority,
        responsible_agency: roleRow.responsible_agency,
        terminal_state: blocked.length ? 'blocked' : rejected.length ? 'rejected' : 'unresolved',
        attempted_candidate_count: queueItems.length,
        rejected_count: rejected.length,
        blocked_count: blocked.length,
        allowed_domains: roleRow.allowed_domains,
        unresolved_reason: roleRow.allowed_domains.length === 0
          ? 'no_reviewed_allowed_domains'
          : blocked.length
            ? 'all_candidates_blocked'
            : rejected.length
              ? 'all_candidates_rejected'
              : 'no_high_confidence_candidates',
      };
    });
}

function buildSummary(roleRows, queueRows, verifiedRows, rejectedRows, blockedRows, unresolvedRows) {
  const verifiedRoleIds = new Set(verifiedRows.map((row) => row.role_id));
  const perDomainJobCounts = {};
  for (const row of queueRows) {
    const domain = urlDomain(row.url);
    perDomainJobCounts[domain] = (perDomainJobCounts[domain] || 0) + 1;
  }
  const oldRepoCandidates = queueRows.filter((row) => row.existed_in_old_repo);
  const oldRepoVerified = verifiedRows.filter((row) => queueRows.some((job) => job.role_id === row.role_id && normalizeUrl(job.url) === normalizeUrl(row.url) && job.existed_in_old_repo)).length;
  const oldRepoRejected = rejectedRows.filter((row) => row.existed_in_old_repo).length;
  return {
    state: NM_STATE,
    generated_at: new Date().toISOString(),
    total_missing_roles: roleRows.length,
    verified_roles: verifiedRoleIds.size,
    unresolved_roles: unresolvedRows.length,
    candidates_discovered: queueRows.length,
    candidates_sent_to_scraper: queueRows.length,
    scrape_jobs_used: queueRows.length,
    verified_urls: verifiedRows.length,
    rejected_urls: rejectedRows.length,
    blocked_urls: blockedRows.length,
    average_candidates_per_role: Number((queueRows.length / roleRows.length).toFixed(2)),
    average_scrape_jobs_per_verified_role: Number((queueRows.length / Math.max(verifiedRoleIds.size, 1)).toFixed(2)),
    newly_discovered_urls: queueRows.filter((row) => !row.existed_in_old_repo).length,
    existed_in_old_repo: {
      candidates: oldRepoCandidates.length,
      verified: oldRepoVerified,
      rejected: oldRepoRejected,
    },
    per_domain_job_counts: perDomainJobCounts,
    terminal_states: roleRows.map((row) => ({
      role_id: row.role_id,
      terminal_state: verifiedRoleIds.has(row.role_id)
        ? 'verified'
        : unresolvedRows.find((item) => item.role_id === row.role_id)?.terminal_state || 'unresolved',
    })),
  };
}

function groupBy(rows, iteratee) {
  const map = new Map();
  for (const row of rows) {
    const key = iteratee(row);
    const current = map.get(key) || [];
    current.push(row);
    map.set(key, current);
  }
  return map;
}

function buildMarkdownReport(summary) {
  const lines = [
    '# New Mexico Low-Token Source Acquisition Report v1',
    '',
    `- State: ${summary.state}`,
    `- Generated at: ${summary.generated_at}`,
    `- Total roles: ${summary.total_missing_roles}`,
    `- Verified roles: ${summary.verified_roles}`,
    `- Unresolved roles: ${summary.unresolved_roles}`,
    `- Candidates sent to scraper: ${summary.candidates_sent_to_scraper}`,
    `- Verified URLs: ${summary.verified_urls}`,
    `- Rejected URLs: ${summary.rejected_urls}`,
    `- Blocked URLs: ${summary.blocked_urls}`,
    '',
    '## Terminal States',
    '',
    '| Role | State |',
    '| --- | --- |',
    ...summary.terminal_states.map((row) => `| ${row.role_id} | ${row.terminal_state} |`),
    '',
    '## Domain Job Counts',
    '',
    '| Domain | Jobs |',
    '| --- | ---: |',
    ...Object.entries(summary.per_domain_job_counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([domain, count]) => `| ${domain} | ${count} |`),
  ];
  return `${lines.join('\n')}\n`;
}

export function writeNmArtifacts({
  outputDir,
  docsDir,
  registryRows,
  roleRows,
  candidateRows,
  queueRows,
  verifiedRows = [],
  rejectedRows = [],
  blockedRows = [],
  unresolvedRows = [],
  summary = null,
}) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(docsDir, { recursive: true });
  writeJsonl(path.join(outputDir, 'nm_official_domain_registry_v1.jsonl'), registryRows);
  writeJsonl(path.join(outputDir, 'nm_missing_critical_roles_v1.jsonl'), roleRows);
  writeJsonl(path.join(outputDir, 'nm_low_token_candidate_urls_v1.jsonl'), candidateRows);
  writeJsonl(path.join(outputDir, 'nm_scraper_queue_v1.jsonl'), queueRows);
  if (verifiedRows || rejectedRows || blockedRows || unresolvedRows || summary) {
    writeJsonl(path.join(outputDir, 'nm_verified_source_pack_v1.jsonl'), verifiedRows);
    writeJsonl(path.join(outputDir, 'nm_rejected_scrapes_v1.jsonl'), rejectedRows);
    writeJsonl(path.join(outputDir, 'nm_blocked_scrapes_v1.jsonl'), blockedRows);
    writeJsonl(path.join(outputDir, 'nm_unresolved_roles_v1.jsonl'), unresolvedRows);
    if (summary) {
      writeJson(path.join(outputDir, 'nm_low_token_acquisition_summary_v1.json'), summary);
      fs.writeFileSync(path.join(docsDir, 'nm-low-token-source-acquisition-report-v1.md'), buildMarkdownReport(summary));
    }
  }
}

export function buildNmControlPlane({ repoRoot, dbPath }) {
  const registryRows = mergeRegistryWithHints(repoRoot, dbPath);
  const roleRows = buildMissingRoles(registryRows);
  return { registryRows, roleRows };
}
