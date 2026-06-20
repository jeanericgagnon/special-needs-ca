import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const stateDir = path.join(repoRoot, 'data', 'source-acquisition-state');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `authored-missing-source-targets-${generatedDate}.json`);
const csvOutPath = path.join(docsDir, `authored-missing-source-targets-${generatedDate}.csv`);
const mdOutPath = path.join(docsDir, `authored-missing-source-targets-${generatedDate}.md`);
const knowledgeRepairLedgerPath = path.join(stateDir, 'knowledge-content-repair-ledger.json');

const db = new Database(dbPath, { readonly: true });

function getStates() {
  return db.prepare('SELECT id, name, code FROM states ORDER BY name').all();
}

function normalizeUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  parsed.hash = '';
  if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
  return parsed.toString();
}

function getDomain(rawUrl) {
  return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
}

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  return matches.length ? path.join(docsDir, matches.at(-1)) : null;
}

function makeTarget({
  id,
  stateId = 'national',
  stateCode = '',
  stateName = 'National',
  sourceName,
  sourceUrl,
  targetTable,
  gapFamily,
  serviceTags = [],
  sourceFamily,
  crawlMethod = 'static_fetch',
  ledgerStatus = 'ready_lightweight',
  firstPartyMode = 'official_or_authoritative_directory',
  expectedExtractionFields,
  whyNeeded,
  promotionRule = 'Discovery or staging only until extracted rows pass public-safe validation.',
  priority = 5,
  evidenceUrl = sourceUrl,
}) {
  const normalized = normalizeUrl(sourceUrl);
  return {
    id,
    origin: 'authored_missing_source_family',
    stateId,
    stateCode,
    stateName,
    sourceName,
    sourceUrl: normalized,
    domain: getDomain(normalized),
    targetTable,
    gapFamily,
    serviceTags,
    sourceFamily,
    crawlMethod,
    ledgerStatus,
    firstPartyMode,
    expectedExtractionFields,
    whyNeeded,
    promotionRule,
    priority,
    evidenceUrl,
    authoredAt: generatedDate,
  };
}

const states = getStates();
const statesById = new Map(states.map((state) => [String(state.id || '').trim().toLowerCase(), state]));
const knowledgeRepairLedger = readJsonIfExists(knowledgeRepairLedgerPath, { rows: [] });
const knowledgeReplacementById = new Map(
  (knowledgeRepairLedger.rows || [])
    .filter((row) => String(row.status || '').trim() === 'reviewed_replacement_ready')
    .map((row) => [String(row.id || '').trim(), row])
);

const nationalSeeds = [
  makeTarget({
    id: 'housing-hud-pha-contacts',
    sourceName: 'HUD Public Housing Agency Contact Information',
    sourceUrl: 'https://www.hud.gov/program_offices/public_indian_housing/pha/contacts',
    targetTable: 'nonprofit_organizations',
    gapFamily: 'housing',
    serviceTags: ['housing'],
    sourceFamily: 'official_government_housing',
    expectedExtractionFields: 'agency_name, state, county_or_city, phone, website',
    whyNeeded: 'Find local public housing agencies and rental-assistance routing for families needing housing help.',
  }),
  makeTarget({
    id: 'housing-hud-resource-locator',
    sourceName: 'HUD Resource Locator',
    sourceUrl: 'https://resources.hud.gov/',
    targetTable: 'nonprofit_organizations',
    gapFamily: 'housing',
    serviceTags: ['housing'],
    sourceFamily: 'official_government_housing',
    crawlMethod: 'playwright',
    ledgerStatus: 'ready_js_heavy',
    expectedExtractionFields: 'resource_name, address, phone, website, service_type',
    whyNeeded: 'Discover housing counseling, affordable housing, and local HUD-connected resources.',
  }),
  makeTarget({
    id: 'goods-at3-state-program-directory',
    sourceName: 'AT3 State Assistive Technology Program Directory',
    sourceUrl: 'https://at3center.net/state-at-programs/',
    targetTable: 'nonprofit_organizations',
    gapFamily: 'goods_supplies',
    serviceTags: ['supplies', 'home_mods'],
    sourceFamily: 'authoritative_assistive_technology_directory',
    expectedExtractionFields: 'program_name, state, phone, website, device_loan, reuse, financing',
    whyNeeded: 'Find state AT programs for equipment loans, reuse, home modifications, and disability supplies.',
  }),
  makeTarget({
    id: 'jobs-rsa-state-vr-agencies',
    sourceName: 'RSA State Vocational Rehabilitation Agencies',
    sourceUrl: 'https://rsa.ed.gov/about/states',
    targetTable: 'programs',
    gapFamily: 'jobs_vocational',
    serviceTags: ['vocational_rehab', 'transition'],
    sourceFamily: 'official_government_vr',
    expectedExtractionFields: 'agency_name, state, phone, website, blind_agency_flag',
    whyNeeded: 'Find state VR agencies for jobs, transition, supported employment, and disability employment routing.',
  }),
  makeTarget({
    id: 'legal-lsc-get-legal-help',
    sourceName: 'Legal Services Corporation Get Legal Help',
    sourceUrl: 'https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help',
    targetTable: 'nonprofit_organizations',
    gapFamily: 'legal_aid',
    serviceTags: ['legal_aid', 'appeals'],
    sourceFamily: 'authoritative_legal_aid_directory',
    expectedExtractionFields: 'organization_name, state, counties_served, phone, website',
    whyNeeded: 'Find civil legal-aid organizations for benefits, housing, education, and family legal support.',
  }),
  makeTarget({
    id: 'legal-ndrn-member-agencies',
    sourceName: 'NDRN Protection and Advocacy Member Agencies',
    sourceUrl: 'https://www.ndrn.org/about/ndrn-member-agencies/',
    targetTable: 'iep_advocates',
    gapFamily: 'advocates_legal',
    serviceTags: ['legal_aid', 'iep_advocacy', 'appeals'],
    sourceFamily: 'authoritative_protection_advocacy_directory',
    expectedExtractionFields: 'agency_name, state, phone, website, disability_rights_focus',
    whyNeeded: 'Replace weak advocate directories with official P&A agencies and disability-rights legal sources.',
  }),
  makeTarget({
    id: 'legal-parent-center-hub-directory',
    sourceName: 'Parent Center Hub Find Your Parent Center',
    sourceUrl: 'https://www.parentcenterhub.org/find-your-center',
    targetTable: 'iep_advocates',
    gapFamily: 'advocates_legal',
    serviceTags: ['iep_advocacy', 'special_education', 'appeals'],
    sourceFamily: 'authoritative_parent_center_directory',
    expectedExtractionFields: 'center_name, state, phone, website, service_area',
    whyNeeded: 'Add authoritative parent training and information centers as first-party-aligned advocate/legal sources.',
  }),
  makeTarget({
    id: 'legal-ed-osep-dispute-resolution',
    sourceName: 'OSEP Dispute Resolution and Due Process Resources',
    sourceUrl: 'https://sites.ed.gov/idea/idea-files/osep-memo-and-qa-on-dispute-resolution/',
    targetTable: 'iep_advocates',
    gapFamily: 'advocates_legal',
    serviceTags: ['special_education', 'appeals', 'iep_advocacy'],
    sourceFamily: 'official_special_education_dispute_guidance',
    expectedExtractionFields: 'resource_name, dispute_type, official_links, agency_contact',
    whyNeeded: 'Add official dispute-resolution source family for special education complaints, mediation, and due-process help.',
  }),
  makeTarget({
    id: 'transport-211-national',
    sourceName: '211 National Search',
    sourceUrl: 'https://www.211.org/',
    targetTable: 'nonprofit_organizations',
    gapFamily: 'transport_utilities_food',
    serviceTags: ['transport', 'utilities', 'food', 'housing'],
    sourceFamily: 'social_services_directory',
    crawlMethod: 'playwright',
    ledgerStatus: 'discovery_only',
    firstPartyMode: 'third_party_directory',
    expectedExtractionFields: 'local_211_operator, service_category, referral_url',
    whyNeeded: 'Discover local help for transportation, utilities, food, housing, and emergency support.',
    promotionRule: 'Use only to discover first-party organization pages or local 211 operator pages before promotion.',
  }),
  makeTarget({
    id: 'providers-hrsa-find-health-center',
    sourceName: 'HRSA Find a Health Center',
    sourceUrl: 'https://findahealthcenter.hrsa.gov/',
    targetTable: 'resource_providers',
    gapFamily: 'providers_care',
    serviceTags: ['therapy', 'behavioral_health', 'early_intervention'],
    sourceFamily: 'official_provider_directory',
    crawlMethod: 'playwright',
    ledgerStatus: 'ready_js_heavy',
    expectedExtractionFields: 'clinic_name, address, phone, website, services, sliding_fee',
    whyNeeded: 'Find federally supported clinics that can help fill the care/provider layer.',
  }),
  makeTarget({
    id: 'providers-medicare-care-compare',
    sourceName: 'Medicare Care Compare',
    sourceUrl: 'https://www.medicare.gov/care-compare/',
    targetTable: 'resource_providers',
    gapFamily: 'providers_care',
    serviceTags: ['therapy', 'caregiving', 'in_home_support'],
    sourceFamily: 'official_provider_directory',
    crawlMethod: 'playwright',
    ledgerStatus: 'discovery_only',
    expectedExtractionFields: 'provider_name, address, phone, provider_type',
    whyNeeded: 'Discover certified home health and care providers for care-related gaps.',
    promotionRule: 'Use for discovery and verification only; promote only if provider-level details pass public-safe validation.',
  }),
  makeTarget({
    id: 'care-cil-directory',
    sourceName: 'ILRU Center for Independent Living Directory',
    sourceUrl: 'https://www.ilru.org/projects/cil-net/cil-center-and-association-directory',
    targetTable: 'nonprofit_organizations',
    gapFamily: 'care_independent_living',
    serviceTags: ['in_home_support', 'transport', 'home_mods', 'benefits'],
    sourceFamily: 'authoritative_independent_living_directory',
    expectedExtractionFields: 'cil_name, state, address, phone, website, services',
    whyNeeded: 'Find CILs for independent living, benefits navigation, housing, transportation, and equipment support.',
  }),
  makeTarget({
    id: 'knowledge-cdc-developmental-disabilities',
    sourceName: 'CDC Developmental Disabilities',
    sourceUrl: 'https://www.cdc.gov/child-development/about/developmental-disability-basics.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'behavioral_health'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'condition_overview, warning_signs, next_steps, official_links',
    whyNeeded: 'Build source-backed explanatory content for developmental disability family journeys.',
  }),
  makeTarget({
    id: 'knowledge-cdc-autism-spectrum-disorder',
    sourceName: 'CDC Autism Spectrum Disorder',
    sourceUrl: 'https://www.cdc.gov/autism/about/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['behavioral_health', 'early_intervention'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'condition_overview, signs, screening, next_steps, official_links',
    whyNeeded: 'Build official autism journey content covering signs, screening, and next steps.',
  }),
  makeTarget({
    id: 'knowledge-cdc-developmental-milestones',
    sourceName: 'CDC Developmental Milestones',
    sourceUrl: 'https://www.cdc.gov/act-early/milestones/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'age_band, milestone_summary, warning_signs, next_steps',
    whyNeeded: 'Build age/stage developmental guidance for early identification and referral journeys.',
  }),
  makeTarget({
    id: 'knowledge-cdc-act-early-intervention',
    sourceName: 'CDC Learn the Signs Act Early Early Intervention',
    sourceUrl: 'https://www.cdc.gov/act-early/early-intervention/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'early_intervention_overview, referral_pathways, state_contact_topics, official_links',
    whyNeeded: 'Add an exact CDC early-intervention source to deepen post-screening referral and next-step journey guidance.',
  }),
  makeTarget({
    id: 'knowledge-cdc-act-early-concerned',
    sourceName: 'CDC Concerned About Your Childs Development',
    sourceUrl: 'https://www.cdc.gov/act-early/families/concerned.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'concern_signals, parent_next_steps, referral_actions, official_links',
    whyNeeded: 'Add an exact CDC family next-steps source for the moment when parents are concerned and need practical action guidance.',
  }),
  makeTarget({
    id: 'knowledge-cdc-act-early-families',
    sourceName: 'CDC Learn the Signs Act Early Resources for Families',
    sourceUrl: 'https://www.cdc.gov/act-early/families/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'family_resource_types, milestone_tools, support_navigation, official_links',
    whyNeeded: 'Add a CDC family-resources hub to deepen diagnosis, monitoring, and early-support knowledge coverage.',
  }),
  makeTarget({
    id: 'knowledge-cdc-act-early-about',
    sourceName: 'CDC Learn the Signs Act Early About',
    sourceUrl: 'https://www.cdc.gov/act-early/about/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'program_overview, developmental_monitoring_basics, screening_context, official_links',
    whyNeeded: 'Add CDC program-overview context that strengthens developmental monitoring and screening explainers for families.',
  }),
  makeTarget({
    id: 'knowledge-cdc-act-early-monitoring-screening',
    sourceName: 'CDC Developmental Monitoring and Screening',
    sourceUrl: 'https://www.cdc.gov/act-early/about/developmental-monitoring-and-screening.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'monitoring_vs_screening, timing_guidance, referral_context, official_links',
    whyNeeded: 'Add exact CDC monitoring-versus-screening guidance to deepen early-identification and next-step knowledge coverage.',
  }),
  makeTarget({
    id: 'knowledge-cdc-act-early-ei-contacts',
    sourceName: 'CDC Early Intervention Contact Information by State',
    sourceUrl: 'https://www.cdc.gov/act-early/early-intervention/contact-information-by-state.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'state_contact_overview, referral_route, state_lookup_topics, official_links',
    whyNeeded: 'Add exact CDC early-intervention state-contact guidance to strengthen referral and handoff steps after concern or screening.',
  }),
  makeTarget({
    id: 'knowledge-cdc-act-early-milestone-checklists',
    sourceName: 'CDC Developmental Milestone Checklists',
    sourceUrl: 'https://www.cdc.gov/act-early/resources/milestone-checklists.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'checklist_resources, age_band_tools, parent_use_guidance, official_links',
    whyNeeded: 'Add exact CDC milestone-checklist guidance to deepen monitoring tools and practical family action steps.',
  }),
  makeTarget({
    id: 'knowledge-cdc-act-early-milestone-tracker-app',
    sourceName: 'CDC Milestone Tracker App',
    sourceUrl: 'https://www.cdc.gov/act-early/milestones-app/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'app_features, milestone_tracking_use, family_next_steps, official_links',
    whyNeeded: 'Add exact CDC milestone-tracker app guidance to strengthen practical monitoring and follow-through support for families.',
  }),
  makeTarget({
    id: 'knowledge-cdc-act-early-resources',
    sourceName: 'CDC Learn the Signs Act Early Resources',
    sourceUrl: 'https://www.cdc.gov/act-early/resources/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'resource_types, family_tools, professional_tools, official_links',
    whyNeeded: 'Add the CDC act-early resources hub to deepen practical tool and handout coverage for families and helpers.',
  }),
  makeTarget({
    id: 'knowledge-cdc-act-early-other-programs',
    sourceName: 'CDC Learn the Signs Act Early Other Programs for Children',
    sourceUrl: 'https://www.cdc.gov/act-early/other-programs/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'program_types, referral_options, support_pathways, official_links',
    whyNeeded: 'Add CDC guidance on other child-support programs to strengthen referral and handoff options beyond screening alone.',
  }),
  makeTarget({
    id: 'knowledge-cdc-act-early-milestones-in-action',
    sourceName: 'CDC Milestones in Action',
    sourceUrl: 'https://www.cdc.gov/act-early/milestones-in-action/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'example_milestones, age_examples, family_observation_guidance, official_links',
    whyNeeded: 'Add concrete milestone examples to deepen parent recognition and monitoring guidance across early-childhood journeys.',
  }),
  makeTarget({
    id: 'knowledge-cdc-act-early-hcp',
    sourceName: 'CDC Learn the Signs Act Early Resources for Healthcare Providers',
    sourceUrl: 'https://www.cdc.gov/act-early/hcp/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'provider_resource_types, screening_supports, referral_coordination, official_links',
    whyNeeded: 'Add CDC provider-facing guidance that strengthens how families can understand clinician screening and referral support.',
  }),
  makeTarget({
    id: 'knowledge-cdc-developmental-screening',
    sourceName: 'CDC Developmental Screening',
    sourceUrl: 'https://www.cdc.gov/child-development/screening/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'behavioral_health'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'screening_overview, screening_timing, referral_next_steps, official_links',
    whyNeeded: 'Add official developmental screening guidance for early identification, referrals, and next-step planning.',
  }),
  makeTarget({
    id: 'knowledge-cdc-autism-signs-symptoms',
    sourceName: 'CDC Autism Signs and Symptoms',
    sourceUrl: 'https://www.cdc.gov/autism/signs-symptoms/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['behavioral_health', 'early_intervention'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'autism_signs, early_warning_signs, developmental_differences, official_links',
    whyNeeded: 'Add a more specific official autism early-signs source to deepen the diagnosis and screening journey.',
  }),
  makeTarget({
    id: 'knowledge-cdc-autism-diagnosis',
    sourceName: 'CDC Autism Diagnosis',
    sourceUrl: 'https://www.cdc.gov/autism/diagnosis/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['behavioral_health', 'early_intervention'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'diagnosis_process, evaluation_types, referral_steps, official_links',
    whyNeeded: 'Add official autism diagnosis guidance covering evaluation steps and referral pathways for families.',
  }),
  makeTarget({
    id: 'knowledge-cdc-adhd-about',
    sourceName: 'CDC ADHD Overview',
    sourceUrl: 'https://www.cdc.gov/adhd/about/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['behavioral_health', 'education'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'condition_overview, symptom_topics, support_options, official_links',
    whyNeeded: 'Add official ADHD overview content to deepen diagnosis, school support, and behavioral health guidance.',
  }),
  makeTarget({
    id: 'knowledge-cdc-adhd-diagnosis',
    sourceName: 'CDC ADHD Diagnosis',
    sourceUrl: 'https://www.cdc.gov/adhd/diagnosis/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['behavioral_health', 'education'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'diagnosis_process, evaluation_steps, clinician_roles, official_links',
    whyNeeded: 'Add official ADHD diagnosis guidance covering evaluation steps and clinical pathways for families.',
  }),
  makeTarget({
    id: 'knowledge-cdc-adhd-symptoms',
    sourceName: 'CDC ADHD Symptoms and Diagnosis Criteria',
    sourceUrl: 'https://www.cdc.gov/adhd/signs-symptoms/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['behavioral_health', 'education'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'symptom_lists, age_patterns, school_impacts, official_links',
    whyNeeded: 'Add a more specific official ADHD symptoms source to deepen diagnosis, school impacts, and family recognition guidance.',
  }),
  makeTarget({
    id: 'knowledge-cdc-adhd-treatment',
    sourceName: 'CDC ADHD Treatment',
    sourceUrl: 'https://www.cdc.gov/adhd/treatment/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['behavioral_health', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'treatment_options, behavior_therapy_topics, medication_topics, official_links',
    whyNeeded: 'Add official ADHD treatment guidance covering behavior therapy, medication, and family support options.',
  }),
  makeTarget({
    id: 'knowledge-idea-ed-special-education',
    sourceName: 'IDEA Individuals with Disabilities Education Act',
    sourceUrl: 'https://sites.ed.gov/idea/',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'iep_advocacy', 'appeals'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'rights, process_steps, dispute_resolution, official_links',
    whyNeeded: 'Build source-backed special education, IEP, and procedural safeguards content.',
  }),
  makeTarget({
    id: 'knowledge-ed-osep-hearing-complaint-mediation',
    sourceName: 'OSEP IDEA Dispute Resolution Overview',
    sourceUrl: 'https://sites.ed.gov/idea/idea-files/osep-memo-and-qa-on-dispute-resolution/',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'appeals'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'dispute_type, timeline, process_steps, official_links',
    whyNeeded: 'Build official complaint, mediation, and due-process journey explainers.',
  }),
  makeTarget({
    id: 'knowledge-ssa-child-disability-benefits',
    sourceName: 'SSA Child Disability Benefits',
    sourceUrl: 'https://www.ssa.gov/benefits/disability/qualify.html#anchor7',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'eligibility, application_steps, evidence_needed, official_links',
    whyNeeded: 'Build SSI and child disability benefits guidance from an official source.',
  }),
  makeTarget({
    id: 'knowledge-ssa-apply-child-disability',
    sourceName: 'SSA Apply for Child Disability Benefits',
    sourceUrl: 'https://www.ssa.gov/benefits/disability/apply-child.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'appeals'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'application_steps, required_documents, appointment_process, official_links',
    whyNeeded: 'Build child SSI application journey content with official application steps and required documents.',
  }),
  makeTarget({
    id: 'knowledge-ssa-disability-appeal',
    sourceName: 'SSA Disability Appeal',
    sourceUrl: 'https://www.ssa.gov/benefits/disability/appeal.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'appeals'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'appeal_levels, filing_steps, deadlines_overview, official_links',
    whyNeeded: 'Add official SSA disability appeal guidance to deepen denials, reconsideration, and hearing-path support for families.',
  }),
  makeTarget({
    id: 'knowledge-cms-medicaid-chip',
    sourceName: 'Medicaid and CHIP Information from CMS',
    sourceUrl: 'https://www.medicaid.gov/medicaid/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'insurance'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'program_overview, eligibility_topics, benefits_topics, official_links',
    whyNeeded: 'Build Medicaid and CHIP overview content from a federal official source.',
  }),
  makeTarget({
    id: 'knowledge-cms-chip-program',
    sourceName: 'CHIP Program Information from CMS',
    sourceUrl: 'https://www.medicaid.gov/chip/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'insurance'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'chip_overview, child_coverage_topics, eligibility_topics, official_links',
    whyNeeded: 'Add a dedicated official CHIP source for children who need public insurance guidance outside full Medicaid.',
  }),
  makeTarget({
    id: 'knowledge-medicaid-eligibility',
    sourceName: 'Medicaid Eligibility Information from CMS',
    sourceUrl: 'https://www.medicaid.gov/medicaid/eligibility/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'insurance'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'eligibility_overview, child_eligibility_topics, pathways, official_links',
    whyNeeded: 'Add official Medicaid eligibility guidance to deepen benefits and coverage decision support for families.',
  }),
  makeTarget({
    id: 'knowledge-medicaid-benefits-overview',
    sourceName: 'Medicaid Benefits Overview',
    sourceUrl: 'https://www.medicaid.gov/medicaid/benefits/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'insurance'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'benefits_overview, mandatory_optional_benefits, child_service_topics, official_links',
    whyNeeded: 'Add an official Medicaid benefits overview to strengthen family guidance on covered services and care pathways.',
  }),
  makeTarget({
    id: 'knowledge-medicaid-hcbs',
    sourceName: 'Medicaid Home and Community-Based Services',
    sourceUrl: 'https://www.medicaid.gov/medicaid/home-community-based-services/home-community-based-services-authorities/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'hcbs_authorities, waiver_types, service_examples, official_links',
    whyNeeded: 'Build waiver and HCBS explainer content from official Medicaid guidance.',
  }),
  makeTarget({
    id: 'knowledge-acl-respite',
    sourceName: 'ACL National Family Caregiver Support Program',
    sourceUrl: 'https://acl.gov/programs/support-caregivers/national-family-caregiver-support-program',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['caregiving', 'respite'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'program_overview, respite_topics, eligibility_topics, official_links',
    whyNeeded: 'Build caregiving and respite guidance from an official aging and caregiver support source.',
  }),
  makeTarget({
    id: 'knowledge-acl-lifespan-respite',
    sourceName: 'ACL Lifespan Respite Care Program',
    sourceUrl: 'https://acl.gov/programs/support-caregivers/lifespan-respite-care-program',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['caregiving', 'respite'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'program_overview, respite_models, state_partnership_topics, official_links',
    whyNeeded: 'Add a dedicated official respite source that deepens caregiver relief options and respite-program navigation.',
  }),
  makeTarget({
    id: 'knowledge-acl-supported-decision-making',
    sourceName: 'ACL Supported Decision-Making Program',
    sourceUrl: 'https://acl.gov/programs/consumer-control/supported-decision-making-program',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['transition', 'legal_aid', 'care_independent_living'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'decision_making_overview, alternatives_to_guardianship, transition_topics, official_links',
    whyNeeded: 'Add official supported-decision-making guidance for transition-age youth and families weighing guardianship alternatives.',
  }),
  makeTarget({
    id: 'knowledge-medicaid-epsdt',
    sourceName: 'Medicaid EPSDT Benefit',
    sourceUrl: 'https://www.medicaid.gov/medicaid/benefits/early-and-periodic-screening-diagnostic-and-treatment/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'insurance', 'early_intervention'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'benefit_overview, screening_requirements, diagnostic_treatment_scope, official_links',
    whyNeeded: 'Build official EPSDT guidance for screening, diagnosis, and medically necessary treatment under Medicaid.',
  }),
  makeTarget({
    id: 'knowledge-medicaid-school-based-services',
    sourceName: 'Medicaid and School-Based Services',
    sourceUrl: 'https://www.medicaid.gov/resources-for-states/medicaid-state-technical-assistance/medicaid-and-school-based-services',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'education', 'special_education'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'school_medicaid_overview, eligible_services, billing_or_access_topics, official_links',
    whyNeeded: 'Add official school-based Medicaid guidance connecting education supports, therapies, and coverage pathways.',
  }),
  makeTarget({
    id: 'knowledge-medicaid-chip-seamless-transitions',
    sourceName: 'Medicaid and CHIP Seamless Transitions',
    sourceUrl: 'https://www.medicaid.gov/resources-for-states/eligibility-enrollment-and-renewal-tools-and-resources/medicaid-and-chip-seamless-transitions',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'insurance', 'transition'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'transition_overview, renewal_or_transfer_steps, coverage_continuity_topics, official_links',
    whyNeeded: 'Add official coverage-transition guidance for families moving between Medicaid, CHIP, and related eligibility pathways.',
  }),
  makeTarget({
    id: 'knowledge-medicaid-hcbs-provisions',
    sourceName: 'Medicaid HCBS Provisions',
    sourceUrl: 'https://www.medicaid.gov/medicaid/access-care/home-and-community-based-services-provisions',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'caregiving', 'care_independent_living'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'hcbs_overview, community_support_topics, service_authority_topics, official_links',
    whyNeeded: 'Deepen waiver and community-living guidance with an official HCBS policy and access explainer.',
  }),
  makeTarget({
    id: 'knowledge-medicaid-application-fair-hearings',
    sourceName: 'Medicaid Application and Fair Hearings Resources',
    sourceUrl: 'https://www.medicaid.gov/resources-for-states/eligibility-enrollment-and-renewal-tools-and-resources/application-and-fair-hearings-resources',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'appeals', 'insurance'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'fair_hearing_overview, application_dispute_steps, notice_or_deadline_topics, official_links',
    whyNeeded: 'Add official Medicaid fair-hearing and application-dispute guidance to strengthen denial and appeal journey coverage.',
  }),
  makeTarget({
    id: 'knowledge-parent-center-iep-overview',
    sourceName: 'Parent Center Hub IEP Overview',
    sourceUrl: 'https://www.parentcenterhub.org/iep-overview/',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'iep_advocacy'],
    sourceFamily: 'mission_aligned_knowledge_source',
    expectedExtractionFields: 'iep_overview, meeting_process, parent_rights, next_steps',
    whyNeeded: 'Build practical IEP explainer content from a high-trust parent-support source.',
  }),
  makeTarget({
    id: 'knowledge-parent-center-transition-adult',
    sourceName: 'Parent Center Hub Transition to Adulthood',
    sourceUrl: 'https://www.parentcenterhub.org/transitionadult/',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['transition', 'jobs_vocational', 'special_education'],
    sourceFamily: 'mission_aligned_knowledge_source',
    expectedExtractionFields: 'transition_timeline, school_to_adult_services, planning_steps, official_links',
    whyNeeded: 'Build transition-to-adulthood guidance that bridges school rights, adult services, and vocational planning.',
  }),
  makeTarget({
    id: 'knowledge-parent-center-section-504',
    sourceName: 'Parent Center Hub Section 504',
    sourceUrl: 'https://www.parentcenterhub.org/section504/',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'appeals'],
    sourceFamily: 'mission_aligned_knowledge_source',
    expectedExtractionFields: 'section_504_overview, eligibility, accommodation_examples, dispute_options',
    whyNeeded: 'Build 504-plan guidance for accommodations, eligibility, and school-rights navigation.',
  }),
  makeTarget({
    id: 'knowledge-nichd-autism',
    sourceName: 'NICHD Autism Spectrum Disorder',
    sourceUrl: 'https://www.nichd.nih.gov/health/topics/autism',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['behavioral_health', 'early_intervention'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'condition_overview, symptoms, diagnosis_topics, treatment_topics, official_links',
    whyNeeded: 'Add a second official autism journey source with diagnosis and treatment framing from NIH.',
  }),
  makeTarget({
    id: 'knowledge-cdc-down-syndrome',
    sourceName: 'CDC Down Syndrome',
    sourceUrl: 'https://www.cdc.gov/down-syndrome/about/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'condition_overview, developmental_supports, health_topics, official_links',
    whyNeeded: 'Add an official CDC Down syndrome overview to deepen diagnosis, health, and support guidance.',
  }),
  makeTarget({
    id: 'knowledge-cdc-cerebral-palsy',
    sourceName: 'CDC Cerebral Palsy',
    sourceUrl: 'https://www.cdc.gov/cerebral-palsy/about/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['therapy', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'condition_overview, movement_topics, treatment_supports, official_links',
    whyNeeded: 'Add an official CDC cerebral palsy overview to deepen therapy, treatment, and long-term support content.',
  }),
  makeTarget({
    id: 'knowledge-nichd-down-syndrome',
    sourceName: 'NICHD Down Syndrome',
    sourceUrl: 'https://www.nichd.nih.gov/health/topics/down',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['early_intervention', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'condition_overview, common_health_needs, treatment_topics, official_links',
    whyNeeded: 'Build official Down syndrome journey content tied to health needs, supports, and treatment topics.',
  }),
  makeTarget({
    id: 'knowledge-nichd-cerebral-palsy',
    sourceName: 'NICHD Cerebral Palsy',
    sourceUrl: 'https://www.nichd.nih.gov/health/topics/cerebral-palsy',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['therapy', 'caregiving'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'condition_overview, symptoms, treatment_topics, therapy_topics, official_links',
    whyNeeded: 'Build official cerebral palsy journey content for therapy, treatment, and long-term support planning.',
  }),
  makeTarget({
    id: 'knowledge-idea-procedural-safeguards-notice',
    sourceName: 'IDEA Procedural Safeguards Notice',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/e/300.504',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'appeals', 'iep_advocacy'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'procedural_safeguards, parent_notice_requirements, dispute_options, official_links',
    whyNeeded: 'Add exact official procedural-safeguards content covering notice requirements and family dispute rights under IDEA.',
  }),
  makeTarget({
    id: 'knowledge-idea-initial-evaluations',
    sourceName: 'IDEA Initial Evaluations and Reevaluations',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.301',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'early_intervention', 'iep_advocacy'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'evaluation_timeline, consent_requirements, reevaluation_rules, official_links',
    whyNeeded: 'Add official evaluation and reevaluation process content for diagnosis-to-school-support and eligibility journeys.',
  }),
  makeTarget({
    id: 'knowledge-idea-transition-services-definition',
    sourceName: 'IDEA Transition Services Definition',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.43',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['transition', 'jobs_vocational', 'special_education'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'transition_definition, planning_requirements, adult_outcomes, official_links',
    whyNeeded: 'Add exact official transition-services content for school-to-adult planning, employment, and postsecondary pathways.',
  }),
  makeTarget({
    id: 'knowledge-idea-iep-content',
    sourceName: 'IDEA IEP Content Requirements',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.320',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'iep_advocacy'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'iep_required_elements, measurable_goals, services_requirements, official_links',
    whyNeeded: 'Add exact official IEP-content requirements to strengthen practical IEP and school-rights knowledge coverage.',
  }),
  makeTarget({
    id: 'knowledge-idea-prior-written-notice',
    sourceName: 'IDEA Prior Written Notice',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.503',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'appeals', 'iep_advocacy'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'prior_written_notice_requirements, notice_contents, parent_rights, official_links',
    whyNeeded: 'Add exact official prior-written-notice content to deepen notice, dispute, and school-rights guidance for families.',
  }),
  makeTarget({
    id: 'knowledge-idea-independent-educational-evaluation',
    sourceName: 'IDEA Independent Educational Evaluation',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/e/300.502',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'appeals', 'iep_advocacy'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'iee_rights, public_expense_rules, evaluation_dispute_steps, official_links',
    whyNeeded: 'Add exact official IEE rights content to strengthen evaluation-dispute and parent-advocacy knowledge coverage.',
  }),
  makeTarget({
    id: 'knowledge-idea-due-process-complaint',
    sourceName: 'IDEA Due Process Complaint',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/e/300.508',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'appeals'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'due_process_complaint_requirements, filing_contents, dispute_scope, official_links',
    whyNeeded: 'Add exact official due-process-complaint content to deepen formal dispute and hearing-path guidance for families.',
  }),
  makeTarget({
    id: 'knowledge-idea-resolution-process',
    sourceName: 'IDEA Resolution Process',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/e/300.510',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'appeals'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'resolution_session_requirements, timeline, settlement_topics, official_links',
    whyNeeded: 'Add exact official resolution-process content to deepen mediation, settlement, and due-process workflow guidance.',
  }),
  makeTarget({
    id: 'knowledge-idea-mediation',
    sourceName: 'IDEA Mediation',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/e/300.506',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'appeals', 'iep_advocacy'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'mediation_availability, voluntary_process, impartial_mediator_rules, official_links',
    whyNeeded: 'Add exact official mediation content to deepen school-dispute resolution options before due process.',
  }),
  makeTarget({
    id: 'knowledge-idea-due-process-hearing',
    sourceName: 'IDEA Due Process Hearing',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/e/300.511',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'appeals'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'hearing_rights, hearing_officer_rules, party_participation, official_links',
    whyNeeded: 'Add exact official due-process-hearing content to deepen hearings, participation rights, and dispute navigation.',
  }),
  makeTarget({
    id: 'knowledge-idea-hearing-decision-timelines',
    sourceName: 'IDEA Hearing Decisions and Timelines',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/e/300.515',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'appeals'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'decision_timeline, extensions, expedited_timing_topics, official_links',
    whyNeeded: 'Add exact official hearing-decision timing content to strengthen deadline and expectations guidance for families.',
  }),
  makeTarget({
    id: 'knowledge-idea-civil-action',
    sourceName: 'IDEA Civil Action',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/e/300.516',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'appeals', 'legal_aid'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'civil_action_rights, filing_window, court_review_topics, official_links',
    whyNeeded: 'Add exact official civil-action content to deepen post-hearing appeal and legal-path guidance for families.',
  }),
  makeTarget({
    id: 'knowledge-idea-child-find',
    sourceName: 'IDEA Child Find',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.111',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'early_intervention'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'child_find_duties, identification_scope, referral_expectations, official_links',
    whyNeeded: 'Add exact official Child Find content to deepen school-identification and referral guidance for families.',
  }),
  makeTarget({
    id: 'knowledge-idea-evaluation-procedures',
    sourceName: 'IDEA Evaluation Procedures',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.304',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'early_intervention', 'iep_advocacy'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'evaluation_requirements, assessment_inputs, parent_participation, official_links',
    whyNeeded: 'Add exact official evaluation-procedures content to deepen assessment, eligibility, and school-support journeys.',
  }),
  makeTarget({
    id: 'knowledge-idea-iep-team',
    sourceName: 'IDEA IEP Team',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.321',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'iep_advocacy'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'iep_team_members, participation_rules, parent_role, official_links',
    whyNeeded: 'Add exact official IEP-team content to deepen meeting preparation and parent-participation guidance.',
  }),
  makeTarget({
    id: 'knowledge-idea-iep-review-revision',
    sourceName: 'IDEA Development Review and Revision of IEP',
    sourceUrl: 'https://sites.ed.gov/idea/regs/b/d/300.324',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['special_education', 'iep_advocacy'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'iep_review_requirements, revision_triggers, progress_considerations, official_links',
    whyNeeded: 'Add exact official IEP review-and-revision content to deepen ongoing plan management and update guidance.',
  }),
  makeTarget({
    id: 'knowledge-ssa-child-disability-starter-kit',
    sourceName: 'SSA Child Disability Starter Kit',
    sourceUrl: 'https://www.ssa.gov/disability/disability_starter_kits_child_eng.htm',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'application_prep, evidence_checklist, interview_preparation, official_links',
    whyNeeded: 'Add exact official SSA application-prep content to deepen child-disability application and document-readiness guidance.',
  }),
  makeTarget({
    id: 'knowledge-medicaid-eligibility',
    sourceName: 'Medicaid Eligibility',
    sourceUrl: 'https://www.medicaid.gov/medicaid/eligibility/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'insurance'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'eligibility_overview, child_coverage_topics, enrollment_pathways, official_links',
    whyNeeded: 'Add exact official Medicaid eligibility guidance to deepen coverage-entry and qualification knowledge for families.',
  }),
  makeTarget({
    id: 'knowledge-chip-overview',
    sourceName: 'CHIP Overview',
    sourceUrl: 'https://www.medicaid.gov/chip/index.html',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['benefits', 'insurance'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'chip_overview, child_coverage_scope, application_pathways, official_links',
    whyNeeded: 'Add exact official CHIP overview content to deepen child-health coverage guidance when Medicaid thresholds do not fit.',
  }),
  makeTarget({
    id: 'knowledge-acl-lifespan-respite',
    sourceName: 'ACL Lifespan Respite Care Program',
    sourceUrl: 'https://acl.gov/programs/support-caregivers/lifespan-respite-care-program',
    targetTable: 'knowledge_articles',
    gapFamily: 'knowledge_content',
    serviceTags: ['caregiving', 'care_independent_living'],
    sourceFamily: 'official_knowledge_source',
    expectedExtractionFields: 'respite_program_overview, caregiver_support_topics, access_pathways, official_links',
    whyNeeded: 'Add exact official respite-program guidance to deepen caregiver-relief and family-support journey coverage.',
  }),
];

const providerSourcePackPlanPath = latestGeneratedJson('provider-source-pack-plan-');
const providerSourcePackPlan = providerSourcePackPlanPath ? readJsonIfExists(providerSourcePackPlanPath, { states: [] }) : { states: [] };

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function providerLedgerStatusFromTarget(target) {
  const crawlMethod = String(target?.crawl_method || '').trim().toLowerCase();
  if (crawlMethod === 'playwright') return 'ready_js_heavy';
  if (crawlMethod === 'pdf_extract' || crawlMethod === 'pdf_fetch') return 'ready_pdf';
  return 'ready_lightweight';
}

const providerPullNowTargets = (providerSourcePackPlan.states || [])
  .filter((state) => String(state?.readinessLane || '') === 'pull-now')
  .flatMap((state) => {
    const stateId = String(state?.stateId || '').trim().toLowerCase();
    const stateMeta = statesById.get(stateId) || {};
    const concreteTargets = Array.isArray(state?.concreteProviderTargets) ? state.concreteProviderTargets : [];
    return concreteTargets.map((target) => {
      const sourceUrl = String(target?.source_url || '').trim();
      if (!sourceUrl) return null;
      return makeTarget({
        id: `providers-pull-now-${stateId}-${slugify(target?.source_name || sourceUrl)}`,
        stateId,
        stateCode: String(stateMeta.code || target?.state || '').trim(),
        stateName: String(stateMeta.name || state?.stateName || stateId).trim(),
        sourceName: String(target?.source_name || '').trim() || sourceUrl,
        sourceUrl,
        targetTable: 'resource_providers',
        gapFamily: 'providers_care',
        serviceTags: ['providers_care'],
        sourceFamily: 'state_provider_source_pack_pull_now',
        crawlMethod: String(target?.crawl_method || 'static_fetch').trim(),
        ledgerStatus: providerLedgerStatusFromTarget(target),
        firstPartyMode: 'first_party',
        expectedExtractionFields: String(target?.expected_extraction_fields || 'name, phone, address').trim(),
        whyNeeded: `Pull-now provider anchor for ${String(stateMeta.name || state?.stateName || stateId).trim()} from the provider source-pack plan.`,
        promotionRule: 'Promote only if extracted provider rows pass public-safe validation with named clinic/program identity plus contact and location evidence.',
        priority: Number(target?.priority || 2),
        evidenceUrl: sourceUrl,
      });
    }).filter(Boolean);
  });

const californiaSeeds = [
  makeTarget({
    id: 'ca-benefitscal-offices',
    stateId: 'california',
    stateCode: 'CA',
    stateName: 'California',
    sourceName: 'BenefitsCal',
    sourceUrl: 'https://www.benefitscal.com/',
    targetTable: 'county_offices',
    gapFamily: 'california_source_targets',
    serviceTags: ['benefits'],
    sourceFamily: 'official_state_or_county_benefits',
    crawlMethod: 'playwright',
    ledgerStatus: 'ready_js_heavy',
    expectedExtractionFields: 'county, office_name, phone, website, address',
    whyNeeded: 'Complete California exact source-target coverage for benefits and county office routing.',
  }),
  makeTarget({
    id: 'ca-dds-regional-centers',
    stateId: 'california',
    stateCode: 'CA',
    stateName: 'California',
    sourceName: 'California DDS Regional Centers',
    sourceUrl: 'https://www.dds.ca.gov/rc/listings/',
    targetTable: 'state_resource_agencies',
    gapFamily: 'california_source_targets',
    serviceTags: ['benefits', 'early_intervention'],
    sourceFamily: 'official_state_dd_directory',
    expectedExtractionFields: 'regional_center_name, counties_served, phone, website, intake',
    whyNeeded: 'Complete California exact DD routing source coverage.',
  }),
  makeTarget({
    id: 'ca-selpa-directory',
    stateId: 'california',
    stateCode: 'CA',
    stateName: 'California',
    sourceName: 'California SELPA Directory',
    sourceUrl: 'https://www.cde.ca.gov/sp/se/as/caselpas.asp',
    targetTable: 'regional_education_agencies',
    gapFamily: 'california_source_targets',
    serviceTags: ['special_education'],
    sourceFamily: 'official_state_education_directory',
    expectedExtractionFields: 'selpa_name, county, phone, website, contact',
    whyNeeded: 'Complete California exact special education regional source coverage.',
  }),
  makeTarget({
    id: 'ca-dor-vocational-rehab',
    stateId: 'california',
    stateCode: 'CA',
    stateName: 'California',
    sourceName: 'California Department of Rehabilitation',
    sourceUrl: 'https://www.dor.ca.gov/',
    targetTable: 'programs',
    gapFamily: 'california_source_targets',
    serviceTags: ['vocational_rehab', 'transition'],
    sourceFamily: 'official_state_vr',
    expectedExtractionFields: 'program_name, office_locator, phone, services',
    whyNeeded: 'Complete California transition and jobs/vocational source coverage.',
  }),
  makeTarget({
    id: 'ca-legal-aid-lawhelpca',
    stateId: 'california',
    stateCode: 'CA',
    stateName: 'California',
    sourceName: 'LawHelpCA',
    sourceUrl: 'https://www.lawhelpca.org/',
    targetTable: 'nonprofit_organizations',
    gapFamily: 'california_source_targets',
    serviceTags: ['legal_aid', 'housing', 'appeals'],
    sourceFamily: 'state_legal_aid_directory',
    crawlMethod: 'playwright',
    ledgerStatus: 'discovery_only',
    firstPartyMode: 'third_party_directory',
    expectedExtractionFields: 'organization_name, counties_served, topics, phone, website',
    whyNeeded: 'Discover California legal-aid sources for disability, benefits, housing, and education support.',
    promotionRule: 'Use to discover first-party legal-aid pages before public promotion.',
  }),
];

const hasCaliforniaStatePack = fs.existsSync(path.join(sourceTargetsDir, 'california.json'));

const stateDirectorySeeds = states.flatMap((state) => [
  makeTarget({
    id: `${state.id}-rsa-vr-state-slice`,
    stateId: state.id,
    stateCode: state.code,
    stateName: state.name,
    sourceName: `${state.name} VR agency via RSA`,
    sourceUrl: 'https://rsa.ed.gov/about/states',
    targetTable: 'programs',
    gapFamily: 'jobs_vocational',
    serviceTags: ['vocational_rehab', 'transition'],
    sourceFamily: 'official_government_vr',
    expectedExtractionFields: 'agency_name, phone, website',
    whyNeeded: `Extract ${state.name} VR routing from the RSA state agency directory.`,
  }),
  makeTarget({
    id: `${state.id}-at3-state-slice`,
    stateId: state.id,
    stateCode: state.code,
    stateName: state.name,
    sourceName: `${state.name} AT program via AT3`,
    sourceUrl: 'https://at3center.net/state-at-programs/',
    targetTable: 'nonprofit_organizations',
    gapFamily: 'goods_supplies',
    serviceTags: ['supplies', 'home_mods'],
    sourceFamily: 'authoritative_assistive_technology_directory',
    expectedExtractionFields: 'program_name, phone, website, services',
    whyNeeded: `Extract ${state.name} assistive technology, equipment loan, reuse, and financing support.`,
  }),
  makeTarget({
    id: `${state.id}-hud-pha-state-slice`,
    stateId: state.id,
    stateCode: state.code,
    stateName: state.name,
    sourceName: `${state.name} housing agencies via HUD`,
    sourceUrl: 'https://www.hud.gov/program_offices/public_indian_housing/pha/contacts',
    targetTable: 'nonprofit_organizations',
    gapFamily: 'housing',
    serviceTags: ['housing'],
    sourceFamily: 'official_government_housing',
    expectedExtractionFields: 'agency_name, city, phone, website',
    whyNeeded: `Extract ${state.name} public housing agency contacts.`,
  }),
  makeTarget({
    id: `${state.id}-legal-lsc-state-slice`,
    stateId: state.id,
    stateCode: state.code,
    stateName: state.name,
    sourceName: `${state.name} legal aid via LSC`,
    sourceUrl: 'https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help',
    targetTable: 'nonprofit_organizations',
    gapFamily: 'legal_aid',
    serviceTags: ['legal_aid', 'appeals'],
    sourceFamily: 'authoritative_legal_aid_directory',
    expectedExtractionFields: 'organization_name, service_area, phone, website',
    whyNeeded: `Extract ${state.name} civil legal-aid organizations.`,
  }),
  makeTarget({
    id: `${state.id}-advocates-ndrn-state-slice`,
    stateId: state.id,
    stateCode: state.code,
    stateName: state.name,
    sourceName: `${state.name} protection and advocacy via NDRN`,
    sourceUrl: 'https://www.ndrn.org/about/ndrn-member-agencies/',
    targetTable: 'iep_advocates',
    gapFamily: 'advocates_legal',
    serviceTags: ['legal_aid', 'iep_advocacy', 'appeals'],
    sourceFamily: 'authoritative_protection_advocacy_directory',
    expectedExtractionFields: 'agency_name, phone, website, service_area',
    whyNeeded: `Extract ${state.name} protection and advocacy agency contacts from the NDRN member directory.`,
  }),
  makeTarget({
    id: `${state.id}-advocates-parent-center-state-slice`,
    stateId: state.id,
    stateCode: state.code,
    stateName: state.name,
    sourceName: `${state.name} parent center via Parent Center Hub`,
    sourceUrl: 'https://www.parentcenterhub.org/find-your-center/',
    targetTable: 'iep_advocates',
    gapFamily: 'advocates_legal',
    serviceTags: ['iep_advocacy', 'special_education', 'appeals'],
    sourceFamily: 'authoritative_parent_center_directory',
    expectedExtractionFields: 'center_name, phone, website, service_area',
    whyNeeded: `Extract ${state.name} parent training and information center contacts from Parent Center Hub.`,
  }),
]);

const includedCaliforniaSeeds = hasCaliforniaStatePack ? [] : californiaSeeds;
function dedupeTargets(rows) {
  const seen = new Set();
  const deduped = [];
  for (const row of rows) {
    const key = `${String(row.targetTable || '').trim()}|${String(row.gapFamily || '').trim()}|${normalizeUrl(row.sourceUrl)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(row);
  }
  return deduped;
}

const targets = dedupeTargets([
  ...nationalSeeds,
  ...providerPullNowTargets,
  ...includedCaliforniaSeeds,
  ...stateDirectorySeeds,
]);

for (const target of targets) {
  if (target.gapFamily !== 'knowledge_content') continue;
  const replacement = knowledgeReplacementById.get(String(target.id || '').trim());
  if (!replacement?.reviewedSourceUrl || !replacement?.reviewedSourceName) continue;
  const normalizedReplacementUrl = normalizeUrl(replacement.reviewedSourceUrl);
  target.sourceName = replacement.reviewedSourceName;
  target.sourceUrl = normalizedReplacementUrl;
  target.domain = getDomain(normalizedReplacementUrl);
  target.evidenceUrl = normalizedReplacementUrl;
}

const countsByGap = targets.reduce((acc, target) => {
  acc[target.gapFamily] = (acc[target.gapFamily] || 0) + 1;
  return acc;
}, {});
const countsByStatus = targets.reduce((acc, target) => {
  acc[target.ledgerStatus] = (acc[target.ledgerStatus] || 0) + 1;
  return acc;
}, {});

function toCsv(rows) {
  const headers = ['id', 'stateId', 'stateCode', 'sourceName', 'sourceUrl', 'targetTable', 'gapFamily', 'serviceTags', 'sourceFamily', 'crawlMethod', 'ledgerStatus', 'firstPartyMode', 'expectedExtractionFields', 'whyNeeded', 'promotionRule', 'evidenceUrl'];
  const escape = (value) => {
    const stringValue = Array.isArray(value) ? value.join('|') : String(value ?? '');
    if (/[",\n]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
    return stringValue;
  };
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ].join('\n');
}

const payload = {
  generatedAt: generatedDate,
  summary: {
    totalAuthoredTargets: targets.length,
    nationalSeedTargets: nationalSeeds.length,
    providerPullNowTargets: providerPullNowTargets.length,
    californiaSeedTargets: includedCaliforniaSeeds.length,
    stateDirectorySliceTargets: stateDirectorySeeds.length,
    byGapFamily: countsByGap,
    byStatus: countsByStatus,
  },
  sourceEvidence: [
    {
      source: 'HUD PHA Contact Information',
      url: 'https://www.hud.gov/program_offices/public_indian_housing/pha/contacts',
      note: 'HUD publishes public housing agency contact information.',
    },
    {
      source: 'ACL Assistive Technology',
      url: 'https://acl.gov/programs/assistive-technology/assistive-technology',
      note: 'ACL points to the State Assistive Technology Program Directory and explains AT state program functions.',
    },
    {
      source: 'RSA State Vocational Rehabilitation Agencies',
      url: 'https://rsa.ed.gov/about/states',
      note: 'RSA lists state VR agencies and contact websites for all states and territories.',
    },
    {
      source: 'Legal Services Corporation Get Legal Help',
      url: 'https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help',
      note: 'LSC is the national civil legal-aid source family.',
    },
  ],
  targets,
};

const mdLines = [
  '# Authored Missing Source Targets',
  '',
  `Generated: ${generatedDate}`,
  '',
  'These are newly authored scrape/discovery targets for the missing source families that the existing repo ledger did not cover deeply enough.',
  '',
  '## Summary',
  '',
  `- total authored targets: ${payload.summary.totalAuthoredTargets}`,
  `- national seed targets: ${payload.summary.nationalSeedTargets}`,
  `- provider pull-now targets: ${payload.summary.providerPullNowTargets}`,
  `- California seed targets: ${payload.summary.californiaSeedTargets}`,
  `- per-state directory slice targets: ${payload.summary.stateDirectorySliceTargets}`,
  '',
  '## By Gap Family',
  '',
];

for (const [gapFamily, count] of Object.entries(countsByGap).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${gapFamily}: ${count}`);
}

mdLines.push('', '## By Status', '');
for (const [status, count] of Object.entries(countsByStatus).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${status}: ${count}`);
}

mdLines.push('', '## National Seeds', '');
for (const target of nationalSeeds) {
  mdLines.push(`- ${target.sourceName}: ${target.sourceUrl} (${target.gapFamily}; ${target.ledgerStatus})`);
}

mdLines.push('', '## California Seeds', '');
if (!includedCaliforniaSeeds.length) {
  mdLines.push('- none; California now has a state source-target pack in `data/source_targets/california.json`.');
} else {
  for (const target of includedCaliforniaSeeds) {
    mdLines.push(`- ${target.sourceName}: ${target.sourceUrl} (${target.gapFamily}; ${target.ledgerStatus})`);
  }
}

mdLines.push('', '## Evidence Notes', '');
for (const evidence of payload.sourceEvidence) {
  mdLines.push(`- ${evidence.source}: ${evidence.url}`);
}

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(csvOutPath, `${toCsv(targets)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  summary: payload.summary,
  report: mdOutPath,
  json: jsonOutPath,
  csv: csvOutPath,
}, null, 2));
