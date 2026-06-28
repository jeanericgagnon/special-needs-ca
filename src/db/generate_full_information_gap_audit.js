import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `full-information-gap-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `full-information-gap-audit-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

function tableExists(tableName) {
  return Boolean(
    db.prepare(`SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?`).get(tableName),
  );
}

function count(tableName) {
  if (!tableExists(tableName)) return 0;
  return db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get().count;
}

function getStateCount(tableName, joinClause = '') {
  if (!tableExists(tableName)) return 0;
  if (!joinClause) return null;
  return db.prepare(`
    SELECT COUNT(DISTINCT s.id) AS count
    FROM ${tableName} t
    ${joinClause}
  `).get().count;
}

function pct(countValue, total) {
  if (!total) return 0;
  return Math.round((countValue / total) * 1000) / 10;
}

function classifyLayer({ substantial, partial, demoOnly, modeledOnly }) {
  if (modeledOnly) return 'modeled_only';
  if (demoOnly) return 'demo_only';
  if (substantial) return 'substantial';
  if (partial) return 'partial';
  return 'thin';
}

function latestGeneratedJsonIfPresent(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  return matches.length ? path.join(docsDir, matches.at(-1)) : null;
}

function readJsonIfPresent(prefix, fallback) {
  const filePath = latestGeneratedJsonIfPresent(prefix);
  return filePath ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : fallback;
}

const TOTAL_STATES = count('states');
const TOTAL_COUNTIES = count('counties');
const completionPlan = readJsonIfPresent('source-acquisition-completion-plan-', { summary: {} });
const missingFamilies = readJsonIfPresent('missing-source-families-', { families: [] });
const blockerRegistry = readJsonIfPresent('track-a-blocker-registry-', { summary: {}, blockers: [] });

const metrics = {
  states: TOTAL_STATES,
  counties: TOTAL_COUNTIES,
  programs: count('programs'),
  eligibilityRules: count('program_eligibility_rules'),
  documentRequirements: count('program_document_requirements'),
  applicationSteps: count('program_application_steps'),
  appeals: count('program_appeal_info'),
  waitlists: count('program_waitlists'),
  formsAndGuides: count('forms_and_guides'),
  countyOffices: count('county_offices'),
  stateResourceAgencies: count('state_resource_agencies'),
  regionalEducationAgencies: count('regional_education_agencies'),
  schoolDistricts: count('school_districts'),
  resourceProviders: count('resource_providers'),
  nonprofits: count('nonprofit_organizations'),
  advocates: count('iep_advocates'),
  conditions: count('conditions'),
  functionalNeeds: count('functional_needs'),
  ageBands: count('age_bands'),
  insuranceTypes: count('insurance_types'),
  knowledgeArticles: count('knowledge_articles'),
  stagingKnowledgeArticles: count('staging_scraped_knowledge_content'),
  familyCases: count('family_cases'),
  childProfiles: count('child_profiles'),
  caseProgramStatuses: count('case_program_statuses'),
  organizations: count('organizations'),
  organizationProgramLinks: count('organization_program_links'),
  serviceLocations: count('service_locations'),
  officeLocations: count('office_locations'),
  virtualServiceAreas: count('virtual_service_areas'),
  userSubmittedResources: count('user_submitted_resources'),
  coverageGaps: count('coverage_gaps'),
  verificationQueueItems: count('verification_queue_items'),
  stagingProviders: count('staging_scraped_resource_providers'),
  stagingForms: count('staging_scraped_forms'),
  reminders: count('reminders'),
  documentChecklistItems: count('document_checklist_items'),
  consultationThreads: count('consultation_threads'),
  consultationMessages: count('consultation_messages'),
  sharedPortalTokens: count('shared_portal_tokens'),
};

const stateCoverage = {
  programs: getStateCount('programs', 'JOIN states s ON s.id = t.state_id'),
  countyOffices: getStateCount('county_offices', 'JOIN counties c ON c.id = t.county_id JOIN states s ON s.id = c.state_id'),
  stateResourceAgencies: getStateCount('state_resource_agencies', 'JOIN states s ON s.id = t.state_id'),
  regionalEducationAgencies: getStateCount('regional_education_agencies', 'JOIN states s ON s.id = t.state_id'),
  schoolDistricts: getStateCount('school_districts', 'JOIN counties c ON c.id = t.county_id JOIN states s ON s.id = c.state_id'),
  resourceProviders: getStateCount('resource_providers', 'JOIN counties c ON c.id = t.county_id JOIN states s ON s.id = c.state_id'),
  nonprofits: getStateCount('nonprofit_organizations', 'JOIN counties c ON c.id = t.county_id JOIN states s ON s.id = c.state_id'),
};

const layers = [
  {
    id: 'program_benefits',
    label: 'Programs, waivers, appeals, forms, and waitlists',
    status: classifyLayer({
      substantial:
        metrics.programs >= 500 &&
        metrics.applicationSteps >= 900 &&
        metrics.documentRequirements >= 400 &&
        metrics.appeals >= 400 &&
        metrics.waitlists >= 100 &&
        stateCoverage.programs === TOTAL_STATES,
    }),
    evidence: [
      `${metrics.programs} programs across ${stateCoverage.programs}/${TOTAL_STATES} states`,
      `${metrics.eligibilityRules} eligibility rules`,
      `${metrics.documentRequirements} document requirements`,
      `${metrics.applicationSteps} application steps`,
      `${metrics.appeals} appeal records`,
      `${metrics.waitlists} waitlist records`,
    ],
    gap: metrics.waitlists < 200
      ? 'Program foundation is strong, but waitlist depth is still smaller than the rest of the program layer.'
      : 'No major structural gap detected in this layer.',
  },
  {
    id: 'public_routing_education',
    label: 'County offices, DD routing, and education routing',
    status: classifyLayer({
      substantial:
        stateCoverage.countyOffices === TOTAL_STATES &&
        stateCoverage.stateResourceAgencies === TOTAL_STATES &&
        stateCoverage.regionalEducationAgencies === TOTAL_STATES &&
        stateCoverage.schoolDistricts === TOTAL_STATES &&
        metrics.countyOffices >= TOTAL_COUNTIES &&
        metrics.schoolDistricts >= 3000,
      partial:
        stateCoverage.countyOffices === TOTAL_STATES &&
        stateCoverage.stateResourceAgencies === TOTAL_STATES &&
        stateCoverage.schoolDistricts === TOTAL_STATES,
    }),
    evidence: [
      `${metrics.countyOffices} county offices across ${stateCoverage.countyOffices}/${TOTAL_STATES} states`,
      `${metrics.stateResourceAgencies} state routing agencies across ${stateCoverage.stateResourceAgencies}/${TOTAL_STATES} states`,
      `${metrics.regionalEducationAgencies} regional education agencies across ${stateCoverage.regionalEducationAgencies}/${TOTAL_STATES} states`,
      `${metrics.schoolDistricts} school districts across ${stateCoverage.schoolDistricts}/${TOTAL_STATES} states`,
    ],
    gap: 'Routing layers are broadly populated, but density and local depth still vary by state and county.',
  },
  {
    id: 'local_nonprofits',
    label: 'Local nonprofit support organizations',
    status: classifyLayer({
      substantial: metrics.nonprofits >= 20000 && stateCoverage.nonprofits === TOTAL_STATES,
    }),
    evidence: [
      `${metrics.nonprofits} nonprofit listings across ${stateCoverage.nonprofits}/${TOTAL_STATES} states`,
    ],
    gap: 'Nonprofit coverage is broad, but foundation metadata like accessibility and live capacity is still sparse.',
  },
  {
    id: 'local_advocates',
    label: 'IEP advocates and advocacy support',
    status: classifyLayer({
      substantial: metrics.advocates >= 3000,
    }),
    evidence: [
      `${metrics.advocates} advocate listings`,
    ],
    gap: 'Advocate count is strong, but truth quality and public eligibility still need to stay under active audit.',
  },
  {
    id: 'local_providers',
    label: 'Clinics, therapists, and local providers',
    status: classifyLayer({
      partial: metrics.resourceProviders > 0 && stateCoverage.resourceProviders >= 4,
    }),
    evidence: [
      `${metrics.resourceProviders} provider listings across ${stateCoverage.resourceProviders || 0}/${TOTAL_STATES} states`,
      `${metrics.stagingProviders} staged provider rows waiting in provider staging`,
    ],
    gap: 'Provider coverage is the clearest national information gap. This layer exists, but it is nowhere near all-state depth.',
  },
  {
    id: 'directory_foundation_metadata',
    label: 'Findhelp-like metadata on directory listings',
    status: classifyLayer({
      partial: metrics.nonprofits > 0 && metrics.advocates > 0 && metrics.resourceProviders > 0,
    }),
    evidence: [
      'Schema support exists for tags, availability, next steps, accessibility, claims, and trust fields on providers, nonprofits, and advocates.',
      `Those fields sit on ${metrics.nonprofits + metrics.advocates + metrics.resourceProviders} directory rows total.`,
    ],
    gap: 'The metadata model exists, but live availability, accessibility, and capacity signals are still sparse on the checked-in DB.',
  },
  {
    id: 'normalization_org_program_location',
    label: 'Organization -> program -> location normalization',
    status: classifyLayer({
      modeledOnly:
        metrics.organizations === 0 &&
        metrics.organizationProgramLinks === 0 &&
        metrics.serviceLocations === 0 &&
        metrics.officeLocations === 0 &&
        metrics.virtualServiceAreas === 0,
    }),
    evidence: [
      `${metrics.organizations} organizations`,
      `${metrics.organizationProgramLinks} organization-program links`,
      `${metrics.serviceLocations} service locations`,
      `${metrics.officeLocations} office locations`,
      `${metrics.virtualServiceAreas} virtual service areas`,
    ],
    gap: 'This migration landing zone is modeled in schema but not yet populated in the checked-in DB.',
  },
  {
    id: 'conditions_needs_reference',
    label: 'Conditions, functional needs, and reference knowledge',
    status: classifyLayer({
      substantial: metrics.conditions >= 75 && metrics.functionalNeeds >= 15,
    }),
    evidence: [
      `${metrics.conditions} conditions`,
      `${metrics.functionalNeeds} functional needs`,
      `${metrics.ageBands} age bands`,
      `${metrics.insuranceTypes} insurance types`,
    ],
    gap: metrics.ageBands === 0 || metrics.insuranceTypes === 0
      ? 'Core condition and need knowledge is populated, but some supporting reference tables are still empty in the checked-in DB.'
      : 'No major structural gap detected in this layer.',
  },
  {
    id: 'knowledge_content',
    label: 'Knowledge articles and guidance content',
    status: classifyLayer({
      partial: metrics.knowledgeArticles >= 10,
    }),
    evidence: [
      `${metrics.knowledgeArticles} knowledge articles`,
      `${metrics.stagingKnowledgeArticles} staged knowledge articles`,
    ],
    gap: metrics.stagingKnowledgeArticles > 0
      ? 'Knowledge content exists and staged growth is underway, but live article volume is still small relative to the breadth of the rest of the information model.'
      : 'Knowledge content exists, but article volume is still small relative to the breadth of the rest of the information model.',
  },
  {
    id: 'family_case_runtime',
    label: 'Family, case, and navigator-adjacent workflow data',
    status: classifyLayer({
      demoOnly:
        metrics.familyCases <= 1 &&
        metrics.childProfiles <= 1 &&
        metrics.caseProgramStatuses === 0,
    }),
    evidence: [
      `${metrics.familyCases} family cases`,
      `${metrics.childProfiles} child profiles`,
      `${metrics.caseProgramStatuses} case program status rows`,
    ],
    gap: 'The schema supports family/case workflows, but the checked-in DB mostly shows demo-level or empty runtime data.',
  },
  {
    id: 'user_feedback_ops',
    label: 'User submissions, coverage gaps, and feedback loops',
    status: classifyLayer({
      modeledOnly: metrics.userSubmittedResources === 0 && metrics.coverageGaps === 0,
    }),
    evidence: [
      `${metrics.userSubmittedResources} user-submitted resources`,
      `${metrics.coverageGaps} coverage gap records`,
    ],
    gap: 'These operational loops are modeled but not populated in the checked-in DB snapshot.',
  },
];

const summary = {
  substantial: layers.filter((layer) => layer.status === 'substantial').length,
  partial: layers.filter((layer) => layer.status === 'partial').length,
  thin: layers.filter((layer) => layer.status === 'thin').length,
  demoOnly: layers.filter((layer) => layer.status === 'demo_only').length,
  modeledOnly: layers.filter((layer) => layer.status === 'modeled_only').length,
};

const trackSummary = {
  informationTrack: {
    complete: false,
    blockers: [
      metrics.resourceProviders < 500 ? 'provider_depth_thin' : null,
      metrics.knowledgeArticles + metrics.stagingKnowledgeArticles < 50 ? 'knowledge_content_thin' : null,
      metrics.waitlists < 200 ? 'waitlist_depth_shallow' : null,
      stateCoverage.regionalEducationAgencies !== TOTAL_STATES ? 'education_routing_not_all_states' : null,
    ].filter(Boolean),
  },
  runtimeTrack: {
    operationalReady: metrics.familyCases > 0
      && metrics.childProfiles > 0
      && metrics.reminders >= 0
      && metrics.documentChecklistItems >= 0
      && metrics.consultationThreads >= 0
      && metrics.sharedPortalTokens >= 0,
    blockers: [
      metrics.userSubmittedResources === 0 ? 'user_submissions_empty' : null,
      metrics.coverageGaps === 0 ? 'coverage_gaps_empty' : null,
      metrics.verificationQueueItems === 0 ? 'verification_queue_empty' : null,
      metrics.caseProgramStatuses === 0 ? 'case_program_tracking_demo_only' : null,
    ].filter(Boolean),
  },
};

const combinedByGapFamily = completionPlan.summary?.combinedByGapFamily || {};
const blockerById = new Map((blockerRegistry.blockers || []).map((blocker) => [blocker.id, blocker]));
const actionableBlockerCount = Number(blockerRegistry.summary?.actionableCount || 0);
const inScopeFamilies = [
  {
    id: 'programs_waivers_appeals_waitlists',
    label: 'Programs, waivers, appeals, and waitlists',
    queueKeys: ['programs_benefits', 'waivers'],
    processed: metrics.programs > 0 || metrics.appeals > 0 || metrics.waitlists > 0,
  },
  {
    id: 'forms_guides',
    label: 'Forms and guides',
    queueKeys: ['forms_guides'],
    processed: metrics.formsAndGuides > 0 || metrics.stagingForms > 0,
  },
  {
    id: 'county_offices_dd_routing',
    label: 'County offices and DD routing',
    queueKeys: ['dd_routing', 'medicaid_hhs_offices'],
    processed: metrics.countyOffices > 0 || metrics.stateResourceAgencies > 0,
  },
  {
    id: 'education_routing',
    label: 'Education routing',
    queueKeys: ['education_routing', 'early_intervention_programs'],
    processed: metrics.regionalEducationAgencies > 0 || metrics.schoolDistricts > 0,
  },
  {
    id: 'nonprofits',
    label: 'Nonprofits',
    queueKeys: ['nonprofit_support', 'condition_nonprofits', 'parent_training_nonprofits'],
    processed: metrics.nonprofits > 0,
  },
  {
    id: 'advocates_legal',
    label: 'Advocates and legal support',
    queueKeys: ['advocates_legal', 'legal_aid'],
    blockerId: 'advocate_directory_depth',
    processed: metrics.advocates > 0,
  },
  {
    id: 'providers_care',
    label: 'Providers and care',
    queueKeys: ['providers_care'],
    blockerId: 'provider_directory',
    processed: metrics.resourceProviders > 0 || metrics.stagingProviders > 0,
  },
  {
    id: 'housing',
    label: 'Housing',
    queueKeys: ['housing'],
    dispositionWhenMissing: 'explicitly_blocked',
    processed: false,
  },
  {
    id: 'goods_supplies',
    label: 'Goods and supplies',
    queueKeys: ['goods_supplies'],
    dispositionWhenMissing: 'explicitly_blocked',
    processed: false,
  },
  {
    id: 'jobs_vocational',
    label: 'Jobs and vocational support',
    queueKeys: ['jobs_vocational'],
    dispositionWhenMissing: 'explicitly_blocked',
    processed: false,
  },
  {
    id: 'care_independent_living',
    label: 'Care and independent living',
    queueKeys: ['care_independent_living'],
    dispositionWhenMissing: 'explicitly_blocked',
    processed: false,
  },
  {
    id: 'transport_utilities_food',
    label: 'Transport, utilities, and food',
    queueKeys: ['transport_utilities_food'],
    processed: false,
  },
  {
    id: 'knowledge_content',
    label: 'Knowledge content',
    queueKeys: ['knowledge_content'],
    blockerId: 'knowledge_content_depth',
    processed: metrics.knowledgeArticles > 0 || metrics.stagingKnowledgeArticles > 0,
  },
  {
    id: 'directory_foundation_metadata',
    label: 'Directory foundation metadata',
    queueKeys: [],
    blockerId: 'directory_foundation_signals',
    processed: metrics.nonprofits > 0 || metrics.advocates > 0 || metrics.resourceProviders > 0,
  },
  {
    id: 'normalization_org_program_location',
    label: 'Org -> program -> location normalization',
    queueKeys: [],
    blockerId: 'normalization_depth',
    processed: metrics.organizations > 0 || metrics.organizationProgramLinks > 0 || metrics.serviceLocations > 0 || metrics.officeLocations > 0 || metrics.virtualServiceAreas > 0,
  },
];

const familyStatuses = inScopeFamilies.map((family) => {
  const queueCount = family.queueKeys.reduce((sum, key) => sum + Number(combinedByGapFamily[key] || 0), 0);
  const blocker = family.blockerId ? blockerById.get(family.blockerId) : null;
  let disposition = 'unknown';
  if (queueCount > 0) disposition = 'queued';
  else if (blocker && blocker.actionableFromDisk === false) disposition = 'explicitly_blocked';
  else if (family.processed) disposition = 'processed';
  else if (family.dispositionWhenMissing) disposition = family.dispositionWhenMissing;
  return {
    id: family.id,
    label: family.label,
    disposition,
    queueCount,
    blockerId: family.blockerId || '',
  };
});

const completionAudit = {
  missingSourceFamilyCount: (missingFamilies.families || []).length,
  actionableBlockerCount,
  queuedFamilyCount: familyStatuses.filter((family) => family.disposition === 'queued').length,
  processedFamilyCount: familyStatuses.filter((family) => family.disposition === 'processed').length,
  explicitlyBlockedFamilyCount: familyStatuses.filter((family) => family.disposition === 'explicitly_blocked').length,
  unknownGapCount: familyStatuses.filter((family) => family.disposition === 'unknown').length,
  allInScopeFamiliesAccountedFor: familyStatuses.every((family) => family.disposition !== 'unknown'),
  families: familyStatuses,
};

const payload = {
  generatedAt: generatedDate,
  dbPath,
  metrics,
  stateCoverage,
  summary,
  trackSummary,
  completionAudit,
  layers,
  conclusion: {
    hasAllInformation: false,
    reason: 'The repo has strong national program, routing, nonprofit, advocate, and condition foundations, but provider coverage, normalization, knowledge depth, and workflow/runtime layers are still thin or empty in the checked-in DB.',
    informationTrackComplete: trackSummary.informationTrack.complete,
    runtimeTrackOperationalReady: trackSummary.runtimeTrack.operationalReady,
  },
};

const mdLines = [
  '# Full Information Gap Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This artifact is intentionally stricter than the truth/completeness/confidence audits.',
  'It answers a different question:',
  '',
  'Do we already have all of the information depth implied by the full product model?',
  '',
  '## Executive Result',
  '',
  payload.conclusion.hasAllInformation
    ? '- Yes. The checked-in DB already supports the full information model with dense population.'
    : `- No. ${payload.conclusion.reason}`,
  '',
  '## Layer Summary',
  '',
  `- Substantial layers: ${summary.substantial}`,
  `- Partial layers: ${summary.partial}`,
  `- Thin layers: ${summary.thin}`,
  `- Demo-only layers: ${summary.demoOnly}`,
  `- Modeled-only layers: ${summary.modeledOnly}`,
  '',
  '## Track Summary',
  '',
  `- Information track complete: ${payload.trackSummary.informationTrack.complete ? 'yes' : 'no'}`,
  `- Information blockers: ${payload.trackSummary.informationTrack.blockers.join(', ') || 'none'}`,
  `- Runtime track operational-ready: ${payload.trackSummary.runtimeTrack.operationalReady ? 'yes' : 'no'}`,
  `- Runtime blockers: ${payload.trackSummary.runtimeTrack.blockers.join(', ') || 'none'}`,
  '',
  '## Completion Audit',
  '',
  `- Missing source families: ${payload.completionAudit.missingSourceFamilyCount}`,
  `- Actionable blocker classes: ${payload.completionAudit.actionableBlockerCount}`,
  `- Queued in-scope families: ${payload.completionAudit.queuedFamilyCount}`,
  `- Processed in-scope families: ${payload.completionAudit.processedFamilyCount}`,
  `- Explicitly blocked in-scope families: ${payload.completionAudit.explicitlyBlockedFamilyCount}`,
  `- Unknown in-scope families: ${payload.completionAudit.unknownGapCount}`,
  `- All in-scope families accounted for: ${payload.completionAudit.allInScopeFamiliesAccountedFor ? 'yes' : 'no'}`,
];

for (const family of payload.completionAudit.families) {
  mdLines.push(`- ${family.label}: ${family.disposition} (queue=${family.queueCount}${family.blockerId ? `; blocker=${family.blockerId}` : ''})`);
}

for (const layer of layers) {
  mdLines.push('', `## ${layer.label}`, '');
  mdLines.push(`- Status: ${layer.status}`);
  for (const line of layer.evidence) {
    mdLines.push(`- Evidence: ${line}`);
  }
  mdLines.push(`- Main gap: ${layer.gap}`);
}

mdLines.push(
  '',
  '## Honest Read',
  '',
  '- The repo is strong on programs, public routing, nonprofits, advocates, and condition/need taxonomy.',
  '- The repo is not yet at "all info" depth for local providers, normalized org-program-location data, broad knowledge content, or live family/case runtime data.',
  '- Truth-safe and structurally complete is not the same thing as fully exhaustive.',
  '- Runtime and feedback layers should be judged as operational capability, not broad prepopulation with fake user data.',
  '',
  '## Best Next Moves',
  '',
  '- Expand truthful provider coverage state by state, because provider depth is the biggest visible information gap.',
  '- Populate normalization tables only when they can be filled truthfully from existing directory/program records.',
  '- Increase knowledge article depth around the main diagnosis, school, waiver, respite, and transition journeys.',
  '- Keep family/case and operational tables scoped unless the product is actively using them in runtime.',
);

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
