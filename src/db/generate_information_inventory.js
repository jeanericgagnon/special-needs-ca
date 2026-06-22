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
const jsonOutPath = path.join(docsDir, `information-inventory-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `information-inventory-${generatedDate}.md`);
const directoryFoundationPath = path.join(repoRoot, 'frontend', 'src', 'lib', 'directoryFoundation.ts');
const publicTruthPath = path.join(repoRoot, 'frontend', 'src', 'lib', 'publicTruth.ts');

const db = new Database(dbPath, { readonly: true });
const directoryFoundationSource = fs.readFileSync(directoryFoundationPath, 'utf8');
const publicTruthSource = fs.readFileSync(publicTruthPath, 'utf8');
const stagingKnowledgeCount = getCount('staging_scraped_knowledge_content');

function extractConstArray(source, constName) {
  const match = source.match(new RegExp(`(?:export\\s+)?const\\s+${constName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const;`));
  if (!match) return [];
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
}

function getColumns(tableName) {
  return db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name);
}

function getCount(tableName) {
  return db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get().count;
}

function getDistinctNonBlank(tableName, columnName, splitComma = false) {
  const rows = db.prepare(`
    SELECT ${columnName} AS value
    FROM ${tableName}
    WHERE ${columnName} IS NOT NULL AND TRIM(CAST(${columnName} AS TEXT)) <> ''
  `).all();

  const values = new Set();
  for (const row of rows) {
    const raw = String(row.value).trim();
    if (!raw) continue;
    const items = splitComma ? raw.split(',').map((item) => item.trim()).filter(Boolean) : [raw];
    for (const item of items) values.add(item);
  }

  return [...values].sort((a, b) => a.localeCompare(b));
}

function getBooleanCoverage(tableName, columnName) {
  return db.prepare(`
    SELECT
      SUM(CASE WHEN ${columnName} = 1 THEN 1 ELSE 0 END) AS truthy,
      COUNT(*) AS total
    FROM ${tableName}
  `).get();
}

function buildLayer({
  id,
  label,
  tables = [],
  subtypes = [],
  controlledValues = {},
  notes = [],
}) {
  return {
    id,
    label,
    tables: tables.map((tableName) => ({
      name: tableName,
      rowCount: getCount(tableName),
      columns: getColumns(tableName),
    })),
    subtypes,
    controlledValues,
    notes,
  };
}

const availabilityStatuses = extractConstArray(directoryFoundationSource, 'AVAILABILITY_STATUSES');
const nextStepTypes = extractConstArray(directoryFoundationSource, 'NEXT_STEP_TYPES');
const fundingStatuses = extractConstArray(directoryFoundationSource, 'FUNDING_STATUSES');
const claimStatuses = extractConstArray(directoryFoundationSource, 'CLAIM_STATUSES');
const serviceTags = extractConstArray(directoryFoundationSource, 'DIRECTORY_SERVICE_TAGS');
const servingTags = extractConstArray(directoryFoundationSource, 'DIRECTORY_SERVING_TAGS');
const indexableStates = extractConstArray(publicTruthSource, 'PUBLIC_RENDERABLE_STATE_IDS');
const verifiedDiagnosisSlugs = extractConstArray(publicTruthSource, 'VERIFIED_DIAGNOSIS_SLUGS');

const publicVerificationStatuses = [...publicTruthSource.matchAll(/'([^']+)'/g)]
  .map((match) => match[1])
  .filter((value, index, arr) => ['official_verified', 'verified', 'human_verified', 'source_listed'].includes(value) && arr.indexOf(value) === index);

const providerBoolCoverage = ['accepts_medi_cal', 'interpreter_available', 'asl_available', 'wheelchair_accessible', 'virtual_services', 'in_person_services', 'home_visits', 'transportation_help']
  .map((columnName) => ({ columnName, ...getBooleanCoverage('resource_providers', columnName) }));

const nonprofitBoolCoverage = ['interpreter_available', 'asl_available', 'wheelchair_accessible', 'virtual_services', 'in_person_services', 'home_visits', 'transportation_help']
  .map((columnName) => ({ columnName, ...getBooleanCoverage('nonprofit_organizations', columnName) }));

const advocateBoolCoverage = ['interpreter_available', 'asl_available', 'wheelchair_accessible', 'virtual_services', 'in_person_services', 'home_visits', 'transportation_help']
  .filter((columnName) => getColumns('iep_advocates').includes(columnName))
  .map((columnName) => ({ columnName, ...getBooleanCoverage('iep_advocates', columnName) }));

const layers = [
  buildLayer({
    id: 'geography_coverage',
    label: 'Geography and Coverage',
    tables: ['states', 'counties', 'regional_center_counties', 'selpa_counties', 'iep_advocate_counties', 'virtual_service_area_counties'],
    subtypes: [
      'states',
      'counties',
      'regional center county coverage',
      'regional education county coverage',
      'advocate county coverage',
      'virtual service area county coverage',
    ],
    notes: [
      'Coverage junctions prevent fake county-local duplication.',
    ],
  }),
  buildLayer({
    id: 'programs_benefits',
    label: 'Programs, Benefits, and Application Knowledge',
    tables: ['programs', 'program_eligibility_rules', 'program_document_requirements', 'program_application_steps', 'program_appeal_info', 'program_waitlists'],
    subtypes: [
      'program definitions',
      'eligibility rules',
      'required and optional documents',
      'application steps',
      'appeal rules',
      'waitlists and interest lists',
    ],
    controlledValues: {
      programCategories: getDistinctNonBlank('programs', 'category'),
      insuranceStatuses: getDistinctNonBlank('program_eligibility_rules', 'insurance_status'),
      schoolStatuses: getDistinctNonBlank('program_eligibility_rules', 'school_status'),
    },
  }),
  buildLayer({
    id: 'public_routing_education',
    label: 'Public Administrative and Education Routing',
    tables: ['county_offices', 'state_resource_agencies', 'regional_education_agencies', 'school_districts'],
    subtypes: [
      'county offices',
      'state DD or IDD routing agencies',
      'regional education agencies',
      'school districts',
    ],
    controlledValues: {
      countyOfficePrograms: getDistinctNonBlank('county_offices', 'program_id'),
      stateAgencyTypes: getDistinctNonBlank('state_resource_agencies', 'agency_type'),
      regionalEducationAgencyTypes: getDistinctNonBlank('regional_education_agencies', 'agency_type'),
    },
  }),
  buildLayer({
    id: 'local_directories',
    label: 'Local Directory Layers',
    tables: ['resource_providers', 'nonprofit_organizations', 'iep_advocates'],
    subtypes: [
      'resource providers',
      'nonprofit organizations',
      'IEP advocates',
    ],
    controlledValues: {
      providerCategories: getDistinctNonBlank('resource_providers', 'categories', true),
      nonprofitFocusConditions: getDistinctNonBlank('nonprofit_organizations', 'focus_condition'),
      advocateSpecialties: getDistinctNonBlank('iep_advocates', 'specialties', true),
    },
  }),
  buildLayer({
    id: 'directory_foundation',
    label: 'Directory Foundation Metadata',
    tables: ['resource_providers', 'nonprofit_organizations', 'iep_advocates'],
    subtypes: [
      'service taxonomy',
      'audience taxonomy',
      'availability and capacity',
      'next-step and intake',
      'languages and accessibility',
      'claim groundwork',
      'trust and freshness',
    ],
    controlledValues: {
      serviceTags,
      servingTags,
      availabilityStatuses,
      nextStepTypes,
      fundingStatuses,
      claimStatuses,
      publicVerificationStatuses,
    },
    notes: [
      `Provider accessibility booleans with true signal: ${providerBoolCoverage.map((item) => `${item.columnName} ${item.truthy}/${item.total}`).join('; ')}`,
      `Nonprofit accessibility booleans with true signal: ${nonprofitBoolCoverage.map((item) => `${item.columnName} ${item.truthy}/${item.total}`).join('; ')}`,
      `Advocate accessibility booleans with true signal: ${advocateBoolCoverage.map((item) => `${item.columnName} ${item.truthy}/${item.total}`).join('; ') || 'none present in schema'}`,
    ],
  }),
  buildLayer({
    id: 'normalization',
    label: 'Normalization Foundation',
    tables: ['organizations', 'organization_program_links', 'service_locations', 'office_locations', 'virtual_service_areas'],
    subtypes: [
      'canonical organizations',
      'organization to program links',
      'service locations',
      'office locations',
      'virtual service areas',
    ],
    controlledValues: {
      organizationTypes: getDistinctNonBlank('organizations', 'organization_type'),
      listingTypes: getDistinctNonBlank('organization_program_links', 'listing_type'),
      officeTypes: getDistinctNonBlank('office_locations', 'office_type'),
      virtualAreaTypes: getDistinctNonBlank('virtual_service_areas', 'area_type'),
    },
    notes: [
      'This is a landing zone for future org -> program -> location normalization, not yet the main public rendering layer.',
    ],
  }),
  buildLayer({
    id: 'disability_knowledge',
    label: 'Disability Knowledge and Reference Layer',
    tables: ['conditions', 'functional_needs', 'age_bands', 'insurance_types'],
    subtypes: [
      'conditions',
      'functional needs',
      'age bands',
      'insurance types',
    ],
    controlledValues: {
      conditionNames: getDistinctNonBlank('conditions', 'name'),
      functionalNeedCategories: getDistinctNonBlank('functional_needs', 'category'),
      insuranceTypeLabels: getDistinctNonBlank('insurance_types', 'label'),
    },
  }),
  buildLayer({
    id: 'family_case',
    label: 'Family and Navigator-Adjacent Workflow Data',
    tables: ['family_cases', 'child_profiles', 'child_profile_conditions', 'child_profile_needs', 'case_program_statuses', 'document_checklist_items', 'reminders', 'child_waivers'],
    subtypes: [
      'family cases',
      'child profiles',
      'child condition mappings',
      'child need mappings',
      'program tracking',
      'document tracking',
      'reminders',
      'waiver vault',
    ],
    controlledValues: {
      caseProgramStatuses: getDistinctNonBlank('case_program_statuses', 'status'),
    },
  }),
  buildLayer({
    id: 'support_planning_collaboration',
    label: 'Family Support, Planning, and Collaboration',
    tables: ['safety_incidents', 'parent_declarations', 'caregiver_profiles', 'child_transition_tasks', 'caregiver_selfcare_logs', 'child_coordinators', 'child_clinical_documents', 'consultation_threads', 'consultation_messages', 'shared_portal_tokens', 'child_iep_accommodations', 'child_iep_goals', 'child_respite_assessments'],
    subtypes: [
      'safety incidents',
      'parent declarations',
      'caregiver profiles',
      'transition tasks',
      'caregiver self-care logs',
      'child coordinators',
      'clinical documents',
      'consultation threads and messages',
      'shared portal tokens',
      'IEP accommodations and goals',
      'respite assessments',
    ],
  }),
  buildLayer({
    id: 'knowledge_content',
    label: 'Knowledge Content',
    tables: ['knowledge_articles'],
    subtypes: [
      'bilingual structured knowledge articles',
    ],
    controlledValues: {
      knowledgeArticleCategories: getDistinctNonBlank('knowledge_articles', 'category'),
      verifiedDiagnosisSlugs,
    },
    notes: [
      `staging_scraped_knowledge_content rows: ${stagingKnowledgeCount}`,
    ],
  }),
  buildLayer({
    id: 'sources_review_ops',
    label: 'Source, Review, and Operations Layers',
    tables: ['sources', 'source_verifications', 'user_submitted_resources', 'coverage_gaps', 'verification_queue_items'],
    subtypes: [
      'source registry',
      'source verifications',
      'user-submitted resources',
      'coverage gaps',
      'verification queue',
    ],
    controlledValues: {
      sourceTypes: getDistinctNonBlank('sources', 'type'),
      userSubmissionStatuses: getDistinctNonBlank('user_submitted_resources', 'status'),
      coverageGapSeverities: getDistinctNonBlank('coverage_gaps', 'severity'),
      verificationLevels: getDistinctNonBlank('verification_queue_items', 'verification_level'),
    },
  }),
  buildLayer({
    id: 'staging_promotion',
    label: 'Staging and Promotion Layers',
    tables: ['staging_source_targets', 'staging_scraped_county_offices', 'staging_scraped_state_resource_agencies', 'staging_scraped_regional_education_agencies', 'staging_scraped_school_districts', 'staging_scraped_nonprofit_organizations', 'staging_scraped_iep_advocates', 'staging_scraped_resource_providers', 'staging_scraped_forms', 'staging_scraped_help_resources', 'staging_scraped_knowledge_content', 'staging_scraped_waitlists', 'staging_scraped_sources', 'staging_promotion_audit'],
    subtypes: [
      'source targets',
      'scraped county offices',
      'scraped state resource agencies',
      'scraped regional education agencies',
      'scraped school districts',
      'scraped nonprofits',
      'scraped advocates',
      'scraped resource providers',
      'scraped forms',
      'scraped help resources',
      'scraped knowledge content',
      'scraped waitlists',
      'scraped sources',
      'promotion audit',
    ],
  }),
  buildLayer({
    id: 'public_truth',
    label: 'Truth and Public Eligibility Contract',
    tables: ['resource_providers', 'nonprofit_organizations', 'iep_advocates', 'county_offices', 'state_resource_agencies', 'regional_education_agencies', 'school_districts', 'programs'],
    subtypes: [
      'source-backed trust metadata',
      'public-safe render eligibility',
      'index-safe gating',
      'verified diagnosis allowlist',
      'indexable state allowlist',
    ],
    controlledValues: {
      indexableStates,
      publicVerificationStatuses,
      verifiedDiagnosisSlugs,
    },
    notes: [
      'Public eligibility requires acceptable verification status, non-synthetic source URL, and contact signal.',
    ],
  }),
];

const informationTypes = layers.map((layer) => ({
  id: layer.id,
  label: layer.label,
  subtypeCount: layer.subtypes.length,
  subtypes: layer.subtypes,
}));

const payload = {
  generatedAt: generatedDate,
  dbPath,
  summary: {
    layerCount: layers.length,
    indexableStateCount: indexableStates.length,
    verifiedDiagnosisCount: verifiedDiagnosisSlugs.length,
    serviceTagCount: serviceTags.length,
    servingTagCount: servingTags.length,
  },
  informationTypes,
  layers,
};

const mdLines = [
  '# Information Inventory',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This artifact inventories the kinds of information the repo currently supports, with subtype values pulled from the checked-in schema, DB, and controlled frontend vocabularies.',
  '',
  '## Summary',
  '',
  `- Major layers: ${payload.summary.layerCount}`,
  `- Indexable states in public truth contract: ${payload.summary.indexableStateCount}`,
  `- Verified diagnosis slugs in public truth contract: ${payload.summary.verifiedDiagnosisCount}`,
  `- Directory service tags: ${payload.summary.serviceTagCount}`,
  `- Directory serving tags: ${payload.summary.servingTagCount}`,
  '',
  '## Information Types At A Glance',
];

for (const informationType of informationTypes) {
  mdLines.push('');
  mdLines.push(`- ${informationType.label}: ${informationType.subtypes.join('; ')}`);
}

for (const layer of layers) {
  mdLines.push('', `## ${layer.label}`, '');
  mdLines.push(`- Layer ID: ${layer.id}`);
  mdLines.push(`- Subtypes: ${layer.subtypes.join('; ')}`);
  for (const table of layer.tables) {
    mdLines.push(`- Table \`${table.name}\`: ${table.rowCount} rows, ${table.columns.length} columns`);
  }

  const controlledEntries = Object.entries(layer.controlledValues || {}).filter(([, values]) => Array.isArray(values) && values.length > 0);
  if (controlledEntries.length > 0) {
    mdLines.push('- Controlled values:');
    for (const [name, values] of controlledEntries) {
      mdLines.push(`  - ${name}: ${values.join(', ')}`);
    }
  }

  if (layer.notes.length > 0) {
    mdLines.push('- Notes:');
    for (const note of layer.notes) {
      mdLines.push(`  - ${note}`);
    }
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
