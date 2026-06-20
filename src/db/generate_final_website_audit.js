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
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `final-website-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `final-website-audit-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated input for prefix "${prefix}" in ${docsDir}`);
  }
  return path.join(docsDir, matches.at(-1));
}

function tableExists(db, tableName) {
  return Boolean(
    db.prepare(`SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?`).get(tableName),
  );
}

function countIfExists(db, tableName) {
  if (!tableExists(db, tableName)) return null;
  return db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get().count;
}

function countDistinctIfExists(db, tableName, columnName) {
  if (!tableExists(db, tableName)) return null;
  return db.prepare(`
    SELECT COUNT(DISTINCT ${columnName}) AS count
    FROM ${tableName}
    WHERE ${columnName} IS NOT NULL AND TRIM(CAST(${columnName} AS TEXT)) <> ''
  `).get().count;
}

function groupCountIfExists(db, tableName, columnName) {
  if (!tableExists(db, tableName)) return {};
  return Object.fromEntries(
    db.prepare(`
      SELECT COALESCE(${columnName}, 'null') AS key, COUNT(*) AS count
      FROM ${tableName}
      GROUP BY 1
      ORDER BY count DESC, key
    `).all().map((row) => [row.key, row.count]),
  );
}

function truthyCountIfExists(db, tableName, columnName) {
  if (!tableExists(db, tableName)) return null;
  return db.prepare(`
    SELECT SUM(CASE WHEN ${columnName} = 1 THEN 1 ELSE 0 END) AS truthy, COUNT(*) AS total
    FROM ${tableName}
  `).get();
}

function joinList(values) {
  return values.filter(Boolean).join('; ');
}

function normalizeGapLabel(label) {
  return String(label || '').replace(/_/g, ' ');
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map((cell) => String(cell ?? '')).join(' | ')} |`),
  ].join('\n');
}

function statusRank(status) {
  const order = {
    strong: 0,
    strong_but_not_exhaustive: 1,
    partial: 2,
    thin: 3,
    missing_live: 4,
    demo_only: 5,
    modeled_only: 6,
  };
  return order[status] ?? 999;
}

function worstStatus(statuses) {
  return [...statuses].sort((a, b) => statusRank(a) - statusRank(b)).at(-1) || 'partial';
}

const informationInventoryPath = latestGeneratedJson('information-inventory-');
const fullGapPath = latestGeneratedJson('full-information-gap-audit-');
const launchPlanPath = latestGeneratedJson('launch-critical-data-acquisition-plan-');
const exhaustiveGapPath = latestGeneratedJson('exhaustive-gap-master-');
const scrapeUniverseQueuePath = latestGeneratedJson('scrape-target-universe-queue-');
const completionPlanPath = latestGeneratedJson('source-acquisition-completion-plan-');

const informationInventory = readJson(informationInventoryPath);
const fullGap = readJson(fullGapPath);
const launchPlan = readJson(launchPlanPath);
const exhaustiveGap = readJson(exhaustiveGapPath);
const scrapeUniverseQueue = readJson(scrapeUniverseQueuePath);
const completionPlan = readJson(completionPlanPath);
const executiveTruth = exhaustiveGap.executiveTruth || {};

const db = new Database(dbPath, { readonly: true });

const metrics = {
  states: countIfExists(db, 'states'),
  counties: countIfExists(db, 'counties'),
  programs: countIfExists(db, 'programs'),
  programEligibilityRules: countIfExists(db, 'program_eligibility_rules'),
  programDocumentRequirements: countIfExists(db, 'program_document_requirements'),
  programApplicationSteps: countIfExists(db, 'program_application_steps'),
  programAppealInfo: countIfExists(db, 'program_appeal_info'),
  programWaitlists: countIfExists(db, 'program_waitlists'),
  formsAndGuides: countIfExists(db, 'forms_and_guides'),
  countyOffices: countIfExists(db, 'county_offices'),
  stateResourceAgencies: countIfExists(db, 'state_resource_agencies'),
  regionalEducationAgencies: countIfExists(db, 'regional_education_agencies'),
  schoolDistricts: countIfExists(db, 'school_districts'),
  resourceProviders: countIfExists(db, 'resource_providers'),
  nonprofits: countIfExists(db, 'nonprofit_organizations'),
  advocates: countIfExists(db, 'iep_advocates'),
  organizations: countIfExists(db, 'organizations'),
  organizationProgramLinks: countIfExists(db, 'organization_program_links'),
  serviceLocations: countIfExists(db, 'service_locations'),
  officeLocations: countIfExists(db, 'office_locations'),
  virtualServiceAreas: countIfExists(db, 'virtual_service_areas'),
  conditions: countIfExists(db, 'conditions'),
  functionalNeeds: countIfExists(db, 'functional_needs'),
  ageBands: countIfExists(db, 'age_bands'),
  insuranceTypes: countIfExists(db, 'insurance_types'),
  knowledgeArticles: countIfExists(db, 'knowledge_articles'),
  sources: countIfExists(db, 'sources'),
  sourceVerifications: countIfExists(db, 'source_verifications'),
  userSubmittedResources: countIfExists(db, 'user_submitted_resources'),
  coverageGaps: countIfExists(db, 'coverage_gaps'),
  verificationQueueItems: countIfExists(db, 'verification_queue_items'),
  stagingScrapedPrograms: countIfExists(db, 'staging_scraped_programs'),
  stagingScrapedForms: countIfExists(db, 'staging_scraped_forms'),
  stagingScrapedWaitlists: countIfExists(db, 'staging_scraped_waitlists'),
  stagingScrapedCountyOffices: countIfExists(db, 'staging_scraped_county_offices'),
  stagingScrapedStateResourceAgencies: countIfExists(db, 'staging_scraped_state_resource_agencies'),
  stagingScrapedRegionalEducationAgencies: countIfExists(db, 'staging_scraped_regional_education_agencies'),
  stagingScrapedSchoolDistricts: countIfExists(db, 'staging_scraped_school_districts'),
  stagingScrapedNonprofits: countIfExists(db, 'staging_scraped_nonprofit_organizations'),
  stagingScrapedAdvocates: countIfExists(db, 'staging_scraped_iep_advocates'),
  stagingScrapedProviders: countIfExists(db, 'staging_scraped_resource_providers'),
  stagingScrapedHelpResources: countIfExists(db, 'staging_scraped_help_resources'),
  stagingScrapedKnowledgeContent: countIfExists(db, 'staging_scraped_knowledge_content'),
  familyCases: countIfExists(db, 'family_cases'),
  childProfiles: countIfExists(db, 'child_profiles'),
  caseProgramStatuses: countIfExists(db, 'case_program_statuses'),
  documentChecklistItems: countIfExists(db, 'document_checklist_items'),
  reminders: countIfExists(db, 'reminders'),
  consultationThreads: countIfExists(db, 'consultation_threads'),
  consultationMessages: countIfExists(db, 'consultation_messages'),
  sharedPortalTokens: countIfExists(db, 'shared_portal_tokens'),
  safetyIncidents: countIfExists(db, 'safety_incidents'),
  parentDeclarations: countIfExists(db, 'parent_declarations'),
  caregiverProfiles: countIfExists(db, 'caregiver_profiles'),
  transitionTasks: countIfExists(db, 'child_transition_tasks'),
  caregiverSelfcareLogs: countIfExists(db, 'caregiver_selfcare_logs'),
  childCoordinators: countIfExists(db, 'child_coordinators'),
  clinicalDocuments: countIfExists(db, 'child_clinical_documents'),
  iepAccommodations: countIfExists(db, 'child_iep_accommodations'),
  iepGoals: countIfExists(db, 'child_iep_goals'),
  respiteAssessments: countIfExists(db, 'child_respite_assessments'),
};

const stateCoverage = {
  providerStates: db.prepare(`
    SELECT COUNT(DISTINCT s.id) AS count
    FROM resource_providers p
    JOIN counties c ON c.id = p.county_id
    JOIN states s ON s.id = c.state_id
  `).get().count,
  providerCounties: countDistinctIfExists(db, 'resource_providers', 'county_id'),
  nonprofitStates: db.prepare(`
    SELECT COUNT(DISTINCT s.id) AS count
    FROM nonprofit_organizations n
    JOIN counties c ON c.id = n.county_id
    JOIN states s ON s.id = c.state_id
  `).get().count,
  nonprofitCounties: countDistinctIfExists(db, 'nonprofit_organizations', 'county_id'),
  advocateCoveredCounties: db.prepare(`SELECT COUNT(DISTINCT county_id) AS count FROM iep_advocate_counties`).get().count,
};

const verification = {
  providers: groupCountIfExists(db, 'resource_providers', 'verification_status'),
  nonprofits: groupCountIfExists(db, 'nonprofit_organizations', 'verification_status'),
  advocates: groupCountIfExists(db, 'iep_advocates', 'verification_status'),
  offices: groupCountIfExists(db, 'county_offices', 'verification_status'),
  stateAgencies: groupCountIfExists(db, 'state_resource_agencies', 'verification_status'),
  regionalEducation: groupCountIfExists(db, 'regional_education_agencies', 'verification_status'),
  districts: groupCountIfExists(db, 'school_districts', 'verification_status'),
  programs: groupCountIfExists(db, 'programs', 'verification_status'),
  forms: groupCountIfExists(db, 'forms_and_guides', 'verification_status'),
};

const accessibilitySignals = {
  providers: {
    accepts_medi_cal: truthyCountIfExists(db, 'resource_providers', 'accepts_medi_cal'),
    interpreter_available: truthyCountIfExists(db, 'resource_providers', 'interpreter_available'),
    asl_available: truthyCountIfExists(db, 'resource_providers', 'asl_available'),
    wheelchair_accessible: truthyCountIfExists(db, 'resource_providers', 'wheelchair_accessible'),
    virtual_services: truthyCountIfExists(db, 'resource_providers', 'virtual_services'),
    in_person_services: truthyCountIfExists(db, 'resource_providers', 'in_person_services'),
    home_visits: truthyCountIfExists(db, 'resource_providers', 'home_visits'),
    transportation_help: truthyCountIfExists(db, 'resource_providers', 'transportation_help'),
  },
  nonprofits: {
    interpreter_available: truthyCountIfExists(db, 'nonprofit_organizations', 'interpreter_available'),
    asl_available: truthyCountIfExists(db, 'nonprofit_organizations', 'asl_available'),
    wheelchair_accessible: truthyCountIfExists(db, 'nonprofit_organizations', 'wheelchair_accessible'),
    virtual_services: truthyCountIfExists(db, 'nonprofit_organizations', 'virtual_services'),
    in_person_services: truthyCountIfExists(db, 'nonprofit_organizations', 'in_person_services'),
    home_visits: truthyCountIfExists(db, 'nonprofit_organizations', 'home_visits'),
    transportation_help: truthyCountIfExists(db, 'nonprofit_organizations', 'transportation_help'),
  },
  advocates: {
    interpreter_available: truthyCountIfExists(db, 'iep_advocates', 'interpreter_available'),
    asl_available: truthyCountIfExists(db, 'iep_advocates', 'asl_available'),
    wheelchair_accessible: truthyCountIfExists(db, 'iep_advocates', 'wheelchair_accessible'),
    virtual_services: truthyCountIfExists(db, 'iep_advocates', 'virtual_services'),
    in_person_services: truthyCountIfExists(db, 'iep_advocates', 'in_person_services'),
    home_visits: truthyCountIfExists(db, 'iep_advocates', 'home_visits'),
    transportation_help: truthyCountIfExists(db, 'iep_advocates', 'transportation_help'),
  },
};

const fullGapLayerById = new Map((fullGap.layers || []).map((layer) => [layer.id, layer]));
const completionAuditById = new Map((fullGap.completionAudit?.families || []).map((family) => [family.id, family]));
const launchClosureByFamily = new Map((launchPlan.launchClosureTable || []).map((row) => [row.family, row]));
const scrapeByFamily = scrapeUniverseQueue.summary?.combinedByGapFamily || {};
const scrapeByStatus = scrapeUniverseQueue.summary?.combinedByStatus || {};
const scrapeRemainingRows = scrapeUniverseQueue.combinedReadyRows || [];

const routeSurfaces = [
  {
    route: '/',
    surface: 'Homepage / entry surface',
    needs: 'Trust framing, search entry points, strong downstream data for benefits, county help, and knowledge journeys.',
    currentStatus: 'strong',
    mainGap: 'Not data-blocked itself; value depends on downstream public surfaces staying truthful and deep.',
  },
  {
    route: '/find-help',
    surface: 'Directory hub',
    needs: 'Providers, nonprofits, advocates, directory-foundation metadata, truthful local contact paths, and competitive-help categories.',
    currentStatus: 'partial',
    mainGap: 'Providers are thin, competitive-help is not live, and nonprofit/advocate metadata is sparse.',
  },
  {
    route: '/benefits and /benefits/[state]/[[...slug]]',
    surface: 'Benefits and waiver discovery',
    needs: 'Programs, eligibility, documents, steps, appeals, forms, waitlists, waiver typing, DD routing, and knowledge support.',
    currentStatus: 'strong_but_not_exhaustive',
    mainGap: 'Waitlists are shallower than the rest of the program layer and waiver typing is still sparse.',
  },
  {
    route: '/counties, /counties/[state], /counties/[state]/[slug]',
    surface: 'County support pages',
    needs: 'County offices, DD routing, education routing, local nonprofits, truthful providers, and public-truth gating.',
    currentStatus: 'partial',
    mainGap: 'Routing is strong, but county-level local care/provider depth remains thin.',
  },
  {
    route: '/advocates',
    surface: 'Advocates directory',
    needs: 'Truth-safe advocate records, county coverage, contact signals, specialties, and public-eligibility gating.',
    currentStatus: 'thin',
    mainGap: 'Advocate count is broad, but truth-safe local depth is still an active blocker and California remains strict-gold blocked here.',
  },
  {
    route: '/conditions/[slug], /situations/[slug], /programs/[slug]',
    surface: 'Condition and journey pages',
    needs: 'Condition taxonomy, functional-needs mapping, linked programs, routing, and knowledge content.',
    currentStatus: 'partial',
    mainGap: 'Reference taxonomy is strong, but knowledge depth and competitive-help depth are still limited.',
  },
  {
    route: '/forms and /forms/[slug]',
    surface: 'Forms library',
    needs: 'Official forms, official library roots, appeal/download URLs, and state coverage accounting.',
    currentStatus: 'partial',
    mainGap: 'Live form count is strong, but only 7 states are fully cleared and 37 are still fallback-authoring states.',
  },
  {
    route: '/appeals-center and /deadlines/[slug]',
    surface: 'Appeals and deadlines guidance',
    needs: 'Appeal info, deadline logic, waitlists, official forms, and knowledge explainers.',
    currentStatus: 'partial',
    mainGap: 'Appeal rows are strong, but waitlist depth and knowledge explainers still need more depth.',
  },
  {
    route: '/financial-planning, /regional-center-funding, /ihss-behavior-log, /iep-goals',
    surface: 'Specialized planning tools and guidance',
    needs: 'Knowledge content, program/routing context, and runtime persistence where applicable.',
    currentStatus: 'partial',
    mainGap: 'These surfaces exist, but supporting content/runtime depth is still uneven.',
  },
  {
    route: '/dashboard, /login, /register, /share/log/[token]',
    surface: 'Runtime, account, and collaboration surfaces',
    needs: 'Family cases, child profiles, reminders, document tracking, collaboration threads, and sharing tokens.',
    currentStatus: 'demo_only',
    mainGap: 'Schema exists, but most runtime tables are empty or demo-only in the checked-in DB.',
  },
];

const familyAudits = [
  {
    id: 'public_truth',
    label: 'Truth and public eligibility contract',
    status: 'strong',
    needs: [
      'Every public page must be source-backed and non-synthetic.',
      'Indexing, sitemap inclusion, and render eligibility must follow the same truth rule.',
      'Verification metadata must remain complete for public-serving layers.',
    ],
    currentHave: [
      `${executiveTruth.strictGoldStates}/50 strict-gold states`,
      `${executiveTruth.publicSafeButBlockedStates}/50 public-safe but blocked states`,
      `${informationInventory.summary.indexableStateCount} indexable states in the public truth contract`,
      `${informationInventory.summary.verifiedDiagnosisCount} verified diagnosis slugs`,
    ],
    staging: [
      `Blocked strict-gold state IDs: ${(executiveTruth.blockedStateIds || []).join(', ')}`,
    ],
    queue: [
      'No direct scrape lane; enforced through truth audits, render gating, and promotion rules.',
    ],
    gap: 'California is still the only strict-gold exception; deeper local data must not bypass truth gating.',
  },
  {
    id: 'geography',
    label: 'Geography and coverage foundation',
    status: 'strong',
    needs: [
      '50-state coverage, full county coverage, and junction-based service-area mapping without fake county cloning.',
    ],
    currentHave: [
      `${metrics.states} states`,
      `${metrics.counties} counties`,
      `${countIfExists(db, 'regional_center_counties')} regional-center county links`,
      `${countIfExists(db, 'selpa_counties')} education county links`,
      `${countIfExists(db, 'iep_advocate_counties')} advocate county links`,
      `${countIfExists(db, 'virtual_service_area_counties')} virtual service-area county links`,
    ],
    staging: [],
    queue: ['No major geography scrape backlog remains in the broad runnable universe.'],
    gap: 'Foundation-grade. Keep using junction tables instead of fake local duplication.',
  },
  {
    id: 'programs_benefits',
    label: 'Programs, benefits, appeals, and forms',
    status: 'strong_but_not_exhaustive',
    needs: [
      'Program definitions, eligibility rules, document requirements, application steps, appeals, forms, and public-safe program pages.',
    ],
    currentHave: [
      `${metrics.programs} programs`,
      `${metrics.programEligibilityRules} eligibility rules`,
      `${metrics.programDocumentRequirements} document requirements`,
      `${metrics.programApplicationSteps} application steps`,
      `${metrics.programAppealInfo} appeal records`,
      `${metrics.formsAndGuides} live forms and guides`,
      `Program verification mix: ${joinList(Object.entries(verification.programs).map(([k, v]) => `${k}=${v}`))}`,
      `Form verification mix: ${joinList(Object.entries(verification.forms).map(([k, v]) => `${k}=${v}`))}`,
    ],
    staging: [
      `${metrics.stagingScrapedPrograms} staged programs`,
      `${metrics.stagingScrapedForms} staged forms`,
      launchClosureByFamily.get('programs_benefits')?.currentCountOrStatus || '',
    ],
    queue: [
      `Launch closure: ${launchClosureByFamily.get('programs_benefits')?.currentPercentToThreshold || 'n/a'}`,
      `Launch forms accounting: ${launchPlan.canonicalLaunchQueueAccounting.formsGuides.alreadyClearedStates} cleared, ${launchPlan.canonicalLaunchQueueAccounting.formsGuides.readyExactStates} ready exact, ${launchPlan.canonicalLaunchQueueAccounting.formsGuides.authorFirstStates} author-first fallback`,
    ],
    gap: 'Programs and forms are structurally strong, but forms exact-state coverage is not finished and generic agency-page overpromotion still has to stay suppressed.',
  },
  {
    id: 'waivers_waitlists',
    label: 'Waivers and waitlists',
    status: 'partial',
    needs: [
      'Explicit waiver identity, source-backed action paths, waitlist or interest-list visibility, and official linkage where applicable.',
    ],
    currentHave: [
      `${metrics.programWaitlists} live waitlist rows`,
      `${metrics.stagingScrapedWaitlists} staged waitlist rows`,
      `${launchClosureByFamily.get('waivers')?.currentCountOrStatus || 'Waiver closure row unavailable'}`,
      `Waitlist launch exact states: ${joinList(launchPlan.canonicalLaunchQueueAccounting.programWaitlists.launchExactReadyStates || [])}`,
    ],
    staging: [
      `Program waitlist source types: ${joinList(Object.entries(groupCountIfExists(db, 'program_waitlists', 'estimate_source_type')).map(([k, v]) => `${k}=${v}`))}`,
    ],
    queue: [
      `Waiver closure: ${launchClosureByFamily.get('waivers')?.currentPercentToThreshold || 'n/a'}`,
      `Waitlist closure: ${launchClosureByFamily.get('program_waitlists')?.currentPercentToThreshold || 'n/a'}`,
    ],
    gap: 'Waitlists are materially shallower than the broader program layer, and waiver typing/state-level waiver resolution is still incomplete.',
  },
  {
    id: 'routing',
    label: 'County offices, DD routing, and education routing',
    status: 'strong_but_not_exhaustive',
    needs: [
      'Truthful county office lookup, statewide DD/IDD intake paths, regional or district education routing, and complete trust metadata.',
    ],
    currentHave: [
      `${metrics.countyOffices} county offices`,
      `${metrics.stateResourceAgencies} state resource agencies`,
      `${metrics.regionalEducationAgencies} regional education agencies`,
      `${metrics.schoolDistricts} school districts`,
      `Office verification mix: ${joinList(Object.entries(verification.offices).map(([k, v]) => `${k}=${v}`))}`,
      `State routing verification mix: ${joinList(Object.entries(verification.stateAgencies).map(([k, v]) => `${k}=${v}`))}`,
    ],
    staging: [
      `${metrics.stagingScrapedCountyOffices} staged county offices`,
      `${metrics.stagingScrapedStateResourceAgencies} staged DD routing rows`,
      `${metrics.stagingScrapedRegionalEducationAgencies} staged regional education rows`,
      `${metrics.stagingScrapedSchoolDistricts} staged school district rows`,
      `${launchClosureByFamily.get('dd_routing')?.currentCountOrStatus || ''}`,
      `${launchClosureByFamily.get('education_routing')?.currentCountOrStatus || ''}`,
    ],
    queue: [
      `${launchClosureByFamily.get('medicaid_hhs_offices')?.currentCountOrStatus || ''}`,
      `${launchClosureByFamily.get('education_routing')?.currentPercentToThreshold || ''}`,
    ],
    gap: 'This is one of the strongest public layers, but regional education is still 47/50 states and final repair-ledger cleanup remains.',
  },
  {
    id: 'providers',
    label: 'Providers and care',
    status: 'thin',
    needs: [
      'Truthful anchor providers per state, named clinics/programs, contact and location evidence, and eventually deeper care discovery.',
    ],
    currentHave: [
      `${metrics.resourceProviders} live providers`,
      `${metrics.stagingScrapedProviders} staged providers`,
      `${stateCoverage.providerStates}/50 provider states represented`,
      `${stateCoverage.providerCounties}/${metrics.counties} counties with provider rows`,
      `Provider verification mix: ${joinList(Object.entries(verification.providers).map(([k, v]) => `${k}=${v}`))}`,
      `Launch provider standard: ${launchClosureByFamily.get('providers_care')?.currentCountOrStatus || ''}`,
    ],
    staging: [
      `${launchPlan.launchProviderStandard.currentStatus.authoredProviderTargets} authored provider targets`,
      `${launchPlan.launchProviderStandard.currentStatus.pullNowPlannedStates} pull-now planned states`,
      `${launchPlan.launchProviderStandard.currentStatus.discoveryOnlyRows} discovery-only provider rows`,
    ],
    queue: [
      `Runnable universe leftovers: ${scrapeByFamily.providers_care || 0}`,
      `Completion disposition: ${completionAuditById.get('providers_care')?.disposition || 'n/a'}`,
    ],
    gap: 'This remains the clearest data hole for the final website. Provider rows exist in all states, but county depth and launch-ready anchor coverage are still far from finished.',
  },
  {
    id: 'nonprofits',
    label: 'Nonprofits and parent-support organizations',
    status: 'strong_but_not_exhaustive',
    needs: [
      'Broad local support coverage, trustworthy contact paths, and richer intake/accessibility metadata.',
    ],
    currentHave: [
      `${metrics.nonprofits} live nonprofits`,
      `${metrics.stagingScrapedNonprofits} staged nonprofits`,
      `${stateCoverage.nonprofitStates}/50 nonprofit states represented`,
      `${stateCoverage.nonprofitCounties}/${metrics.counties} counties with nonprofit rows`,
      `Nonprofit verification mix: ${joinList(Object.entries(verification.nonprofits).map(([k, v]) => `${k}=${v}`))}`,
    ],
    staging: [],
    queue: [
      `Completion disposition: ${completionAuditById.get('nonprofits')?.disposition || 'n/a'} (${completionAuditById.get('nonprofits')?.queueCount || 0} in scope)`,
      `Runnable universe leftovers: ${scrapeByFamily.nonprofit_support || 0}`,
    ],
    gap: 'Coverage breadth is strong, but nonprofit metadata remains sparse and there is no separate live competitive-help table yet.',
  },
  {
    id: 'advocates',
    label: 'Advocates and legal / IEP support',
    status: 'thin',
    needs: [
      'Truth-safe advocate records, specialties, counties served, contact details, and public-safe legal/IEP support presentation.',
    ],
    currentHave: [
      `${metrics.advocates} live advocates`,
      `${metrics.stagingScrapedAdvocates} staged advocates`,
      `${stateCoverage.advocateCoveredCounties}/${metrics.counties} counties with advocate coverage links`,
      `Advocate verification mix: ${joinList(Object.entries(verification.advocates).map(([k, v]) => `${k}=${v}`))}`,
    ],
    staging: [],
    queue: [
      `Completion disposition: ${completionAuditById.get('advocates_legal')?.disposition || 'n/a'}`,
      `Blocker: ${completionAuditById.get('advocates_legal')?.blockerId || 'none'}`,
      `Runnable universe leftovers: ${scrapeByFamily.advocates_legal || 0}`,
    ],
    gap: 'Advocate volume is high, but truth-safe local advocate depth is still explicitly blocked and directly affects final website confidence.',
  },
  {
    id: 'competitive_help',
    label: 'Housing, goods, jobs, care, and other competitive-help families',
    status: 'missing_live',
    needs: [
      'Live website rows for housing, goods/supplies, jobs/vocational, care/independent living, and transport/utilities/food.',
      'Actionable service/contact evidence, not just taxonomy or topic tags.',
    ],
    currentHave: [
      `Live help_resources table: ${tableExists(db, 'help_resources') ? 'present' : 'missing'}`,
      `staging_scraped_help_resources rows: ${metrics.stagingScrapedHelpResources}`,
      `Completion dispositions: housing=${completionAuditById.get('housing')?.disposition || 'n/a'}, goods=${completionAuditById.get('goods_supplies')?.disposition || 'n/a'}, jobs=${completionAuditById.get('jobs_vocational')?.disposition || 'n/a'}, care=${completionAuditById.get('care_independent_living')?.disposition || 'n/a'}, transport=${completionAuditById.get('transport_utilities_food')?.disposition || 'n/a'}`,
    ],
    staging: [],
    queue: [
      `Runnable universe leftovers: housing=${scrapeByFamily.housing || 0}, goods=${scrapeByFamily.goods_supplies || 0}, jobs=${scrapeByFamily.jobs_vocational || 0}, care=${scrapeByFamily.care_independent_living || 0}, transport=${scrapeByFamily.transport_utilities_food || 0}`,
    ],
    gap: 'This is a major final-website gap: the site model wants these families, but the checked-in live DB has no dedicated public help-resource table and no staged rows.',
  },
  {
    id: 'directory_foundation',
    label: 'Directory foundation metadata',
    status: 'partial',
    needs: [
      'Service taxonomy, audience tags, availability, next-step instructions, accessibility, capacity, claim state, and trust freshness across listings.',
    ],
    currentHave: [
      `${informationInventory.summary.serviceTagCount} service tags`,
      `${informationInventory.summary.servingTagCount} serving tags`,
      `Provider accessibility signals: ${joinList(Object.entries(accessibilitySignals.providers).map(([k, v]) => `${k}=${v?.truthy ?? 0}/${v?.total ?? 0}`))}`,
      `Nonprofit accessibility signals: ${joinList(Object.entries(accessibilitySignals.nonprofits).map(([k, v]) => `${k}=${v?.truthy ?? 0}/${v?.total ?? 0}`))}`,
      `Advocate accessibility signals: ${joinList(Object.entries(accessibilitySignals.advocates).map(([k, v]) => `${k}=${v?.truthy ?? 0}/${v?.total ?? 0}`))}`,
    ],
    staging: [],
    queue: [
      `Completion disposition: ${completionAuditById.get('directory_foundation_metadata')?.disposition || 'n/a'}`,
      `Blocker: ${completionAuditById.get('directory_foundation_metadata')?.blockerId || 'none'}`,
    ],
    gap: 'Schema support is excellent, but live nonprofit and advocate accessibility/intake/capacity signals are still near-zero in the checked-in DB.',
  },
  {
    id: 'normalization',
    label: 'Org -> program -> location normalization',
    status: 'thin',
    needs: [
      'Canonical organizations, org-program links, service locations, office locations, and virtual service areas that support location-rich discovery without false local claims.',
    ],
    currentHave: [
      `${metrics.organizations} organizations`,
      `${metrics.organizationProgramLinks} organization-program links`,
      `${metrics.serviceLocations} service locations`,
      `${metrics.officeLocations} office locations`,
      `${metrics.virtualServiceAreas} virtual service areas`,
    ],
    staging: [],
    queue: [
      `Completion disposition: ${completionAuditById.get('normalization_org_program_location')?.disposition || 'n/a'}`,
      `Blocker: ${completionAuditById.get('normalization_org_program_location')?.blockerId || 'none'}`,
    ],
    gap: 'Normalization exists, but service-location depth is still far too thin for a fully location-rich final website.',
  },
  {
    id: 'conditions_matching',
    label: 'Conditions, needs, and matching support',
    status: 'strong',
    needs: [
      'Condition taxonomy, functional-need taxonomy, age/insurance references, and rule-backed links from disabilities or needs to programs/routing.',
    ],
    currentHave: [
      `${metrics.conditions} conditions`,
      `${metrics.functionalNeeds} functional needs`,
      `${metrics.ageBands} age bands`,
      `${metrics.insuranceTypes} insurance types`,
      `${metrics.programEligibilityRules} eligibility rules`,
      `${launchClosureByFamily.get('disability_to_program_matching')?.currentCountOrStatus || ''}`,
    ],
    staging: [],
    queue: [
      `Dependency-verification family: ${launchClosureByFamily.get('disability_to_program_matching')?.currentPercentToThreshold || ''}`,
    ],
    gap: 'The reference layer is strong; the remaining gap is downstream depth in programs, waivers, providers, and knowledge.',
  },
  {
    id: 'knowledge',
    label: 'Knowledge content and guidance',
    status: 'partial',
    needs: [
      'Structured explainers for diagnosis, waivers, school rights, appeals, respite, transition, and related family journeys, with provenance-safe serving.',
    ],
    currentHave: [
      `${metrics.knowledgeArticles} live knowledge articles`,
      `${metrics.stagingScrapedKnowledgeContent} staged knowledge articles`,
      `${launchClosureByFamily.get('knowledge_content')?.currentCountOrStatus || ''}`,
    ],
    staging: [],
    queue: [
      `Completion disposition: ${completionAuditById.get('knowledge_content')?.disposition || 'n/a'}`,
      `Blocker: ${completionAuditById.get('knowledge_content')?.blockerId || 'none'}`,
    ],
    gap: 'Live article volume is still small, and launch planning still flags provenance-safe topic coverage as unresolved.',
  },
  {
    id: 'sources_ops',
    label: 'Sources, review, and operational feedback loops',
    status: 'modeled_only',
    needs: [
      'Healthy source registry, source verifications, user submissions, coverage gaps, and verification queues to sustain the final website.',
    ],
    currentHave: [
      `${metrics.sources} sources`,
      `${metrics.sourceVerifications} source verifications`,
      `${metrics.userSubmittedResources} user-submitted resources`,
      `${metrics.coverageGaps} coverage gaps`,
      `${metrics.verificationQueueItems} verification queue items`,
    ],
    staging: [],
    queue: [],
    gap: 'Operational maintenance loops are mostly modeled, but almost empty in live data.',
  },
  {
    id: 'family_case',
    label: 'Family cases, child profiles, reminders, and document tracking',
    status: 'demo_only',
    needs: [
      'Real runtime support for cases, children, tracking, documents, reminders, and waiver vault flows if the final website includes signed-in family workflows.',
    ],
    currentHave: [
      `${metrics.familyCases} family cases`,
      `${metrics.childProfiles} child profiles`,
      `${metrics.caseProgramStatuses} case program statuses`,
      `${metrics.documentChecklistItems} document checklist items`,
      `${metrics.reminders} reminders`,
    ],
    staging: [],
    queue: [],
    gap: 'This is mostly demo-level runtime data today, not a fully live family workflow layer.',
  },
  {
    id: 'support_planning',
    label: 'Support planning, collaboration, and shared portal flows',
    status: 'modeled_only',
    needs: [
      'Collaboration threads, share tokens, clinical documents, IEP accommodations/goals, and respite/planning tools if the final website includes family coordination.',
    ],
    currentHave: [
      `${metrics.consultationThreads} consultation threads`,
      `${metrics.consultationMessages} consultation messages`,
      `${metrics.sharedPortalTokens} shared portal tokens`,
      `${metrics.safetyIncidents} safety incidents`,
      `${metrics.parentDeclarations} parent declarations`,
      `${metrics.caregiverProfiles} caregiver profiles`,
      `${metrics.transitionTasks} transition tasks`,
      `${metrics.caregiverSelfcareLogs} caregiver self-care logs`,
      `${metrics.childCoordinators} child coordinators`,
      `${metrics.clinicalDocuments} clinical documents`,
      `${metrics.iepAccommodations} IEP accommodations`,
      `${metrics.iepGoals} IEP goals`,
      `${metrics.respiteAssessments} respite assessments`,
    ],
    staging: [],
    queue: [],
    gap: 'These collaboration/planning surfaces are essentially schema-only in the checked-in DB.',
  },
];

const criticalGaps = [
  'Providers and care are still the biggest final-website data hole.',
  'Competitive-help families are not live in the checked-in DB at all.',
  'Knowledge content remains too thin for a fully guided national family journey.',
  'Directory foundation metadata is modeled well but sparsely populated, especially on nonprofits and advocates.',
  'Normalization is present but too shallow to power a truly location-rich final website.',
  'Advocates remain truth-sensitive and still block California from strict gold.',
  'Runtime/feedback/product-support tables are mostly empty, so signed-in workflows are not final-product complete.',
];

const scrapeProgress = {
  completionPlanQueueBaseline: launchPlan.queueBaseline,
  scrapeUniverseSummary: scrapeUniverseQueue.summary,
  remainingRows: scrapeRemainingRows.map((row) => ({
    gapFamily: row.gapFamily,
    stateId: row.stateId,
    targetTable: row.targetTable,
    ledgerStatus: row.ledgerStatus,
    sourceUrl: row.sourceUrl,
    crawlMethod: row.crawlMethod,
  })),
  notableRuns: [
    {
      run: '2026-06-20T02-33-42-899Z',
      lane: 'ready_lightweight',
      summary: 'Queue burned down from 486 to 6; 469 accepted and 467 staged.',
    },
    {
      run: '2026-06-20T03-03-57-641Z',
      lane: 'ready_pdf',
      summary: 'Queue burned down from 129 to 0; 41 accepted and 41 staged.',
    },
    {
      run: '2026-06-20T03-05-03-417Z',
      lane: 'ready_js_heavy',
      summary: 'JS-heavy tail burned from 3 to 1; two rows became blocked and one remains.',
    },
  ],
};

const payload = {
  generatedAt: generatedDate,
  scope: {
    mode: 'final_website_data_and_product_surface_audit',
    includes: [
      'public website data layers',
      'launch-critical public surfaces',
      'competitive-help families',
      'runtime and collaboration surfaces that the final site implies',
      'current scrape/acquisition position',
    ],
    excludes: [
      'UI polish',
      'visual design review',
      'copy tone review',
    ],
  },
  authoritativeInputs: {
    informationInventoryPath,
    fullGapPath,
    launchPlanPath,
    exhaustiveGapPath,
    scrapeUniverseQueuePath,
    completionPlanPath,
    dbPath,
  },
  executiveSummary: {
    currentModeledCompletenessStates: executiveTruth.currentModeledCompletenessStates,
    currentHighConfidenceStates: executiveTruth.currentHighConfidenceStates,
    strictGoldStates: executiveTruth.strictGoldStates,
    publicSafeButBlockedStates: executiveTruth.publicSafeButBlockedStates,
    blockedStateIds: executiveTruth.blockedStateIds || [],
    publicDataHeadline: fullGap.conclusion?.reason || fullGap.conclusion?.headline || fullGap.conclusion || 'Programs and routing are strong; providers, knowledge, normalization, and runtime layers remain the main gaps.',
    criticalGaps,
  },
  publicRouteSurfaces: routeSurfaces,
  familyAudits,
  currentScrapePosition: scrapeProgress,
  completionAudit: fullGap.completionAudit,
  immediateTruths: exhaustiveGap.immediateTruths || [],
};

const mdLines = [
  '# Final Website Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This is the exhaustive data-and-surface audit for the final website. It answers three questions together:',
  '',
  '- What the final website needs to support.',
  '- What the repo and DB already have today.',
  '- What the remaining gaps are, with current control-plane evidence.',
  '',
  'This is intentionally broader than the launch-only audit. It covers the public website, competitive-help depth, operational support layers, and runtime surfaces that the final website implies.',
  '',
  '## Executive Read',
  '',
  `- Modeled 50-state completeness: ${payload.executiveSummary.currentModeledCompletenessStates}/50`,
  `- High-confidence states on the current audit bar: ${payload.executiveSummary.currentHighConfidenceStates}/50`,
  `- Strict-gold states: ${payload.executiveSummary.strictGoldStates}/50`,
  `- Public-safe but still blocked states: ${payload.executiveSummary.publicSafeButBlockedStates}/50 (${payload.executiveSummary.blockedStateIds.join(', ')})`,
  `- Public data headline: ${payload.executiveSummary.publicDataHeadline}`,
  '',
  '### Most Important Truths',
  '',
  ...payload.immediateTruths.map((truth) => `- ${truth}`),
  '',
  '### Biggest Remaining Final-Website Gaps',
  '',
  ...criticalGaps.map((gap) => `- ${gap}`),
  '',
  '## Public Surface Map',
  '',
  markdownTable(
    ['Route or Surface', 'What It Needs', 'Current Status', 'Main Gap'],
    routeSurfaces.map((surface) => [
      surface.route,
      surface.needs,
      surface.currentStatus,
      surface.mainGap,
    ]),
  ),
  '',
  '## Data Family Audit',
];

for (const family of familyAudits) {
  mdLines.push('', `### ${family.label}`, '');
  mdLines.push(`- Status: ${family.status}`);
  mdLines.push(`- Final website needs: ${joinList(family.needs)}`);
  mdLines.push(`- What we have now: ${joinList(family.currentHave)}`);
  if (family.staging.length) mdLines.push(`- Current staging or authored work: ${joinList(family.staging)}`);
  if (family.queue.length) mdLines.push(`- Current queue or control-plane state: ${joinList(family.queue)}`);
  mdLines.push(`- Main gap: ${family.gap}`);
}

mdLines.push(
  '',
  '## Competitive-Help Read',
  '',
  '- The final website clearly wants housing, goods, jobs, care/independent living, transport/utilities/food, and related family-support surfaces.',
  `- The checked-in live DB currently has no \`help_resources\` table: ${tableExists(db, 'help_resources') ? 'present' : 'missing'}.`,
  `- \`staging_scraped_help_resources\` rows: ${metrics.stagingScrapedHelpResources}.`,
  '- This means the competitive-help portion of a Findhelp-like experience is still a real product/data gap, not just a queue gap.',
  '',
  '## Current Scrape and Acquisition Position',
  '',
  `- Completion-plan launch queue baseline: readyRows=${scrapeProgress.completionPlanQueueBaseline.readyRows}, ready_lightweight=${scrapeProgress.completionPlanQueueBaseline.readyByStatus.ready_lightweight || 0}, ready_js_heavy=${scrapeProgress.completionPlanQueueBaseline.readyByStatus.ready_js_heavy || 0}, ready_pdf=${scrapeProgress.completionPlanQueueBaseline.readyByStatus.ready_pdf || 0}, discovery_only=${scrapeProgress.completionPlanQueueBaseline.discoveryOnly}`,
  `- Broad scrape-target universe ready rows: ${scrapeProgress.scrapeUniverseSummary.universeReadyUniqueRows}`,
  `- Broad scrape-target universe remaining runnable rows: ${scrapeProgress.scrapeUniverseSummary.combinedReadyUniqueRows}`,
  `- Excluded/resolved from prior runs: ${scrapeProgress.scrapeUniverseSummary.excludedResolvedRows}`,
  `- Resolved run totals: accepted=${scrapeProgress.scrapeUniverseSummary.resolvedFromRuns.accepted}, rejected=${scrapeProgress.scrapeUniverseSummary.resolvedFromRuns.rejected}, sourceRepair=${scrapeProgress.scrapeUniverseSummary.resolvedFromRuns.sourceRepair}, terminalBlocked=${scrapeProgress.scrapeUniverseSummary.resolvedFromRuns.terminalBlocked}`,
  `- Remaining runnable rows by status: ${joinList(Object.entries(scrapeProgress.scrapeUniverseSummary.combinedByStatus || {}).map(([k, v]) => `${k}=${v}`))}`,
  `- Remaining runnable rows by family: ${joinList(Object.entries(scrapeProgress.scrapeUniverseSummary.combinedByGapFamily || {}).map(([k, v]) => `${k}=${v}`))}`,
  '',
  '### Notable Burn-Down Runs',
  '',
  ...scrapeProgress.notableRuns.map((run) => `- ${run.run} (${run.lane}): ${run.summary}`),
  '',
  '### Remaining Runnable Rows',
  '',
  markdownTable(
    ['Family', 'State', 'Target Table', 'Status', 'Crawl Method', 'URL'],
    scrapeProgress.remainingRows.map((row) => [
      row.gapFamily,
      row.stateId,
      row.targetTable,
      row.ledgerStatus,
      row.crawlMethod,
      row.sourceUrl,
    ]),
  ),
  '',
  '## Completion-Audit Read',
  '',
  `- Missing source families: ${fullGap.completionAudit.missingSourceFamilyCount}`,
  `- Actionable blocker classes: ${fullGap.completionAudit.actionableBlockerCount}`,
  `- Queued in-scope families: ${fullGap.completionAudit.queuedFamilyCount}`,
  `- Processed in-scope families: ${fullGap.completionAudit.processedFamilyCount}`,
  `- Explicitly blocked in-scope families: ${fullGap.completionAudit.explicitlyBlockedFamilyCount}`,
  `- Unknown in-scope families: ${fullGap.completionAudit.unknownGapCount}`,
  `- All in-scope families accounted for: ${fullGap.completionAudit.allInScopeFamiliesAccountedFor ? 'yes' : 'no'}`,
  '',
  markdownTable(
    ['Family', 'Disposition', 'Queue', 'Blocker'],
    (fullGap.completionAudit.families || []).map((family) => [
      family.label,
      family.disposition,
      family.queueCount,
      family.blockerId || '',
    ]),
  ),
  '',
  '## Bottom Line',
  '',
  '- The final website already has a strong national foundation for programs, routing, counties, nonprofits, and truth gating.',
  '- The final website is not yet fully complete because providers, competitive-help families, knowledge depth, directory metadata, normalization depth, and runtime collaboration layers are still incomplete or missing.',
  '- The broad scrape universe has now been burned down from 3564 runnable rows to 7 leftovers, so the next work is targeted cleanup and product-depth completion, not another blind broad scrape wave.',
);

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

db.close();

console.log(JSON.stringify({
  generatedAt: generatedDate,
  report: mdOutPath,
  json: jsonOutPath,
  familyCount: familyAudits.length,
  routeSurfaceCount: routeSurfaces.length,
  remainingRunnableRows: scrapeProgress.scrapeUniverseSummary.combinedReadyUniqueRows,
  strictGoldStates: payload.executiveSummary.strictGoldStates,
}, null, 2));
