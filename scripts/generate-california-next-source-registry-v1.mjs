import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const generatedDataDir = path.join(repoRoot, 'data', 'generated');
const generatedDocsDir = path.join(repoRoot, 'docs', 'generated');

const FAMILY_DEFINITIONS = [
  {
    family: 'ihss',
    authority: 'official_county_and_state',
    owner: 'California Department of Social Services + county IHSS offices',
    priority: 'p0',
    expectedArtifacts: ['county office pages', 'program guidance', 'contact routing'],
  },
  {
    family: 'selpa',
    authority: 'official_education',
    owner: 'California Department of Education + SELPA sites',
    priority: 'p0',
    expectedArtifacts: ['selpa directory', 'local special education routing', 'procedural safeguards'],
  },
  {
    family: 'ccs_mtu',
    authority: 'official_state_and_county',
    owner: 'DHCS CCS + county CCS/MTU programs',
    priority: 'p0',
    expectedArtifacts: ['county office pages', 'medical therapy unit routing', 'eligibility/contact pages'],
  },
  {
    family: 'dhcs_epsdt',
    authority: 'official_state',
    owner: 'Department of Health Care Services',
    priority: 'p1',
    expectedArtifacts: ['EPSDT benefits pages', 'behavioral health guidance', 'provider/appeal references'],
  },
  {
    family: 'ssi',
    authority: 'official_federal',
    owner: 'Social Security Administration',
    priority: 'p1',
    expectedArtifacts: ['child SSI eligibility', 'application steps', 'appeal guidance'],
  },
  {
    family: 'calable',
    authority: 'official_state_partner',
    owner: 'CalABLE',
    priority: 'p1',
    expectedArtifacts: ['program overview', 'eligibility', 'account opening guidance'],
  },
  {
    family: 'frcnca',
    authority: 'high_authority_nonprofit',
    owner: 'Family Resource Centers Network of California',
    priority: 'p1',
    expectedArtifacts: ['family resource center directory', 'county/service area listings'],
  },
  {
    family: 'pti_cprc',
    authority: 'high_authority_nonprofit',
    owner: 'PTIs / CPRCs',
    priority: 'p1',
    expectedArtifacts: ['parent training contact pages', 'service area proof', 'special education help routing'],
  },
  {
    family: 'help_me_grow',
    authority: 'mission_aligned_first_party',
    owner: 'Help Me Grow California',
    priority: 'p2',
    expectedArtifacts: ['local referral hub pages', 'developmental screening routing'],
  },
  {
    family: 'local_nonprofits',
    authority: 'mission_aligned_first_party',
    owner: 'Arc / Easterseals / local disability nonprofits',
    priority: 'p2',
    expectedArtifacts: ['local service pages', 'county/service area evidence', 'contact and intake routes'],
  },
];

const VALIDATION_CHECKS = [
  'source_url',
  'official_domain',
  'phone_email_format',
  'placeholder_detection',
  'duplicate_detection',
  'stale_dates',
  'county_normalization',
  'confidence',
  'display_eligibility',
];

const SEED_ROWS = [
  {
    family: 'ihss',
    label: 'CDSS County IHSS Offices Directory',
    sourceUrl: 'https://www.cdss.ca.gov/inforesources/county-ihss-offices',
    authority: 'official_county_and_state',
    sourceType: 'official_directory',
    targetKind: 'directory_root',
    role: 'county_office_directory',
    expectedCoverage: 'county IHSS office routing',
    notes: 'Primary statewide directory for county IHSS office contact pages.',
  },
  {
    family: 'ihss',
    label: 'CDSS IHSS Program Overview',
    sourceUrl: 'https://www.cdss.ca.gov/in-home-supportive-services',
    authority: 'official_county_and_state',
    sourceType: 'official_program_page',
    targetKind: 'leaf_guidance_page',
    role: 'program_guidance',
    expectedCoverage: 'IHSS eligibility and program overview',
    notes: 'Use for statewide program framing only, not county contact inference.',
  },
  {
    family: 'selpa',
    label: 'CDE SELPA Directory',
    sourceUrl: 'https://www.cde.ca.gov/sp/se/as/caselpas.asp',
    authority: 'official_education',
    sourceType: 'official_directory',
    targetKind: 'directory_root',
    role: 'selpa_directory',
    expectedCoverage: 'SELPA routing by local plan area',
    notes: 'Primary statewide SELPA directory root.',
  },
  {
    family: 'selpa',
    label: 'CDE Special Education Division',
    sourceUrl: 'https://www.cde.ca.gov/sp/se/',
    authority: 'official_education',
    sourceType: 'official_program_page',
    targetKind: 'official_root',
    role: 'special_education_routing',
    expectedCoverage: 'state special education guidance and safeguards',
    notes: 'State guidance root; local routing still requires SELPA or district evidence.',
  },
  {
    family: 'ccs_mtu',
    label: 'DHCS California Children’s Services',
    sourceUrl: 'https://www.dhcs.ca.gov/services/ccs/Pages/default.aspx',
    authority: 'official_state_and_county',
    sourceType: 'official_program_page',
    targetKind: 'official_root',
    role: 'program_guidance',
    expectedCoverage: 'CCS eligibility and county program guidance',
    notes: 'State CCS root for county and MTU follow-up discovery.',
  },
  {
    family: 'ccs_mtu',
    label: 'DHCS Medical Therapy Program',
    sourceUrl: 'https://www.dhcs.ca.gov/services/ccs/Pages/MedicalTherapyProgram.aspx',
    authority: 'official_state_and_county',
    sourceType: 'official_program_page',
    targetKind: 'leaf_guidance_page',
    role: 'mtu_guidance',
    expectedCoverage: 'medical therapy unit explanation and routing context',
    notes: 'Program explainer, not county office proof by itself.',
  },
  {
    family: 'dhcs_epsdt',
    label: 'DHCS EPSDT Overview',
    sourceUrl: 'https://www.dhcs.ca.gov/services/Pages/EPSDT.aspx',
    authority: 'official_state',
    sourceType: 'official_program_page',
    targetKind: 'leaf_guidance_page',
    role: 'epsdt_guidance',
    expectedCoverage: 'EPSDT overview and state benefit framing',
    notes: 'Use for statewide benefit grounding and downstream exact target discovery.',
  },
  {
    family: 'dhcs_epsdt',
    label: 'DHCS Behavioral Health Information Notice Library',
    sourceUrl: 'https://www.dhcs.ca.gov/formsandpubs/Pages/Behavioral_Health_Information_Notices.aspx',
    authority: 'official_state',
    sourceType: 'official_library_root',
    targetKind: 'library_root',
    role: 'behavioral_health_guidance',
    expectedCoverage: 'behavioral health and EPSDT-related notices',
    notes: 'Use to discover exact notices without broad crawling.',
  },
  {
    family: 'ssi',
    label: 'SSA Child Disability Starter Kit',
    sourceUrl: 'https://www.ssa.gov/disability/disability_starter_kits_child_eng.htm',
    authority: 'official_federal',
    sourceType: 'official_program_page',
    targetKind: 'leaf_guidance_page',
    role: 'child_ssi_application',
    expectedCoverage: 'SSI child application steps and documents',
    notes: 'Federal crossover reference allowed for SSI only.',
  },
  {
    family: 'ssi',
    label: 'SSA Disability Benefits for Children',
    sourceUrl: 'https://www.ssa.gov/benefits/disability/qualify.html#anchor7',
    authority: 'official_federal',
    sourceType: 'official_program_page',
    targetKind: 'leaf_guidance_page',
    role: 'child_ssi_eligibility',
    expectedCoverage: 'SSI child eligibility overview',
    notes: 'Eligibility explainer, not state-local routing.',
  },
  {
    family: 'calable',
    label: 'CalABLE Program Homepage',
    sourceUrl: 'https://calable.ca.gov/',
    authority: 'official_state_partner',
    sourceType: 'official_program_page',
    targetKind: 'official_root',
    role: 'program_overview',
    expectedCoverage: 'CalABLE overview and enrollment routing',
    notes: 'State partner program root for ABLE coverage.',
  },
  {
    family: 'calable',
    label: 'CalABLE Eligibility',
    sourceUrl: 'https://calable.ca.gov/eligibility/',
    authority: 'official_state_partner',
    sourceType: 'official_program_page',
    targetKind: 'leaf_guidance_page',
    role: 'eligibility_guidance',
    expectedCoverage: 'CalABLE eligibility requirements',
    notes: 'Leaf eligibility page for ABLE guidance.',
  },
  {
    family: 'frcnca',
    label: 'Family Resource Centers Network of California Directory',
    sourceUrl: 'https://www.frcnca.org/find-a-center/',
    authority: 'high_authority_nonprofit',
    sourceType: 'first_party_directory',
    targetKind: 'directory_root',
    role: 'family_resource_directory',
    expectedCoverage: 'family resource center service-area routing',
    notes: 'High-authority statewide directory for local FRC discovery.',
  },
  {
    family: 'pti_cprc',
    label: 'TASK Parent Training and Information Center',
    sourceUrl: 'https://taskca.org/',
    authority: 'high_authority_nonprofit',
    sourceType: 'first_party_program_page',
    targetKind: 'official_root',
    role: 'pti_program_root',
    expectedCoverage: 'parent training and special education help routing',
    notes: 'California PTI root; local service area proof still required downstream.',
  },
  {
    family: 'pti_cprc',
    label: 'Matrix Parent Network and Resource Center',
    sourceUrl: 'https://www.matrixparents.org/',
    authority: 'high_authority_nonprofit',
    sourceType: 'first_party_program_page',
    targetKind: 'official_root',
    role: 'cprc_program_root',
    expectedCoverage: 'CPRC support, training, and special education help',
    notes: 'CPRC/parent center first-party root.',
  },
  {
    family: 'help_me_grow',
    label: 'Help Me Grow California',
    sourceUrl: 'https://helpmegrowca.org/',
    authority: 'mission_aligned_first_party',
    sourceType: 'first_party_program_page',
    targetKind: 'official_root',
    role: 'referral_hub_root',
    expectedCoverage: 'developmental screening and referral routing',
    notes: 'Mission-aligned statewide referral hub root.',
  },
  {
    family: 'local_nonprofits',
    label: 'The Arc of California',
    sourceUrl: 'https://thearcca.org/',
    authority: 'mission_aligned_first_party',
    sourceType: 'first_party_program_page',
    targetKind: 'official_root',
    role: 'statewide_nonprofit_root',
    expectedCoverage: 'disability nonprofit and chapter routing',
    notes: 'Use for California chapter discovery; local proof still needs chapter or service-area evidence.',
  },
  {
    family: 'local_nonprofits',
    label: 'Easterseals Southern California',
    sourceUrl: 'https://www.easterseals.com/southerncal/',
    authority: 'mission_aligned_first_party',
    sourceType: 'first_party_program_page',
    targetKind: 'official_root',
    role: 'regional_nonprofit_root',
    expectedCoverage: 'regional nonprofit services and local entry points',
    notes: 'Regional nonprofit example for California local-service sourcing.',
  },
];

function normalizeUrl(value) {
  const url = new URL(value);
  url.hash = '';
  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.toString();
}

function getHost(value) {
  return new URL(value).hostname.toLowerCase();
}

function isAllowedDomain(authority, host) {
  if (authority.startsWith('official_')) {
    return host.endsWith('.ca.gov') || host.endsWith('.gov');
  }

  return [
    'calable.ca.gov',
    'www.frcnca.org',
    'frcnca.org',
    'taskca.org',
    'www.taskca.org',
    'www.matrixparents.org',
    'matrixparents.org',
    'helpmegrowca.org',
    'www.helpmegrowca.org',
    'thearcca.org',
    'www.thearcca.org',
    'www.easterseals.com',
    'easterseals.com',
  ].includes(host);
}

function buildSeedEntry(seed) {
  const sourceUrl = normalizeUrl(seed.sourceUrl);
  const normalizedDomain = getHost(sourceUrl);
  const familyDef = FAMILY_DEFINITIONS.find((item) => item.family === seed.family);
  const validationIssues = [];

  if (!familyDef) validationIssues.push('unknown_family');
  if (!isAllowedDomain(seed.authority, normalizedDomain)) validationIssues.push('disallowed_domain_for_authority');

  return {
    state: 'california',
    family: seed.family,
    priority: familyDef?.priority || 'unknown',
    authority: seed.authority,
    owner: familyDef?.owner || 'unknown',
    label: seed.label,
    sourceUrl,
    normalizedDomain,
    sourceType: seed.sourceType,
    targetKind: seed.targetKind,
    role: seed.role,
    expectedCoverage: seed.expectedCoverage,
    validationStatus: validationIssues.length === 0 ? 'seed_ready' : 'needs_review',
    validationIssues,
    requiredValidationChecks: VALIDATION_CHECKS,
    notes: seed.notes,
  };
}

const seedEntries = SEED_ROWS.map(buildSeedEntry);
const duplicateUrls = seedEntries
  .map((entry) => entry.sourceUrl)
  .filter((url, index, all) => all.indexOf(url) !== index);

const summary = {
  totalFamilies: FAMILY_DEFINITIONS.length,
  totalSeedEntries: seedEntries.length,
  seedReadyCount: seedEntries.filter((entry) => entry.validationStatus === 'seed_ready').length,
  needsReviewCount: seedEntries.filter((entry) => entry.validationStatus !== 'seed_ready').length,
  duplicateUrlCount: duplicateUrls.length,
  byFamily: Object.fromEntries(
    FAMILY_DEFINITIONS.map((family) => [
      family.family,
      seedEntries.filter((entry) => entry.family === family.family).length,
    ])
  ),
};

const registry = {
  version: 'v1',
  generatedAt: new Date().toISOString().slice(0, 10),
  state: 'california',
  purpose: 'Next-source registry for the California source-backed scraping foundation after DDS regional centers.',
  rules: [
    'Public sources only.',
    'Every fact needs source URL and fetched date.',
    'New records default to needs_review until validation passes.',
    'Only published records should render on public local surfaces.',
  ],
  requiredValidationChecks: VALIDATION_CHECKS,
  sourceFamilies: FAMILY_DEFINITIONS,
  seedEntries,
  summary,
};

const lines = [
  '# California Next-Source Registry v1',
  '',
  `Generated: ${registry.generatedAt}`,
  '',
  registry.purpose,
  '',
  '## Rules',
  ...registry.rules.map((rule) => `- ${rule}`),
  '',
  '## Validation Checks',
  ...VALIDATION_CHECKS.map((check) => `- ${check}`),
  '',
  '## Summary',
  `- Families: \`${summary.totalFamilies}\``,
  `- Seed entries: \`${summary.totalSeedEntries}\``,
  `- Seed-ready entries: \`${summary.seedReadyCount}\``,
  `- Needs review: \`${summary.needsReviewCount}\``,
  `- Duplicate URLs: \`${summary.duplicateUrlCount}\``,
  '',
  '## Source Families',
  ...FAMILY_DEFINITIONS.flatMap((family) => [
    `### ${family.family}`,
    `- Priority: \`${family.priority}\``,
    `- Authority: \`${family.authority}\``,
    `- Owner: ${family.owner}`,
    `- Expected artifacts: ${family.expectedArtifacts.join(', ')}`,
    '',
  ]),
  '## Seed Entries',
  ...seedEntries.flatMap((entry) => [
    `### ${entry.label}`,
    `- Family: \`${entry.family}\``,
    `- Authority: \`${entry.authority}\``,
    `- Validation status: \`${entry.validationStatus}\``,
    `- URL: ${entry.sourceUrl}`,
    `- Domain: \`${entry.normalizedDomain}\``,
    `- Role: \`${entry.role}\``,
    `- Target kind: \`${entry.targetKind}\``,
    `- Expected coverage: ${entry.expectedCoverage}`,
    `- Notes: ${entry.notes}`,
    entry.validationIssues.length ? `- Validation issues: ${entry.validationIssues.join(', ')}` : '- Validation issues: none',
    '',
  ]),
];

fs.mkdirSync(generatedDataDir, { recursive: true });
fs.mkdirSync(generatedDocsDir, { recursive: true });
fs.writeFileSync(
  path.join(generatedDataDir, 'california-next-source-registry-v1.json'),
  `${JSON.stringify(registry, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(generatedDocsDir, 'california-next-source-registry-v1.md'),
  `${lines.join('\n')}\n`,
);

console.log(JSON.stringify({
  outputJson: path.join('data', 'generated', 'california-next-source-registry-v1.json'),
  outputMarkdown: path.join('docs', 'generated', 'california-next-source-registry-v1.md'),
  summary,
}, null, 2));
