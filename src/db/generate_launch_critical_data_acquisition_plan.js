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
const sourcePacksDir = path.join(repoRoot, 'data', 'source_packs');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `launch-critical-data-acquisition-plan-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-critical-data-acquisition-plan-${generatedDate}.md`);
const blockerRegistryJsonOutPath = path.join(docsDir, `blocker-resolution-registry-${generatedDate}.json`);
const blockerRegistryMdOutPath = path.join(docsDir, `blocker-resolution-registry-${generatedDate}.md`);
const providerLedgerJsonOutPath = path.join(docsDir, `provider-blocker-resolution-ledger-${generatedDate}.json`);
const providerLedgerMdOutPath = path.join(docsDir, `provider-blocker-resolution-ledger-${generatedDate}.md`);
const formsLedgerJsonOutPath = path.join(docsDir, `forms-blocker-resolution-ledger-${generatedDate}.json`);
const formsLedgerMdOutPath = path.join(docsDir, `forms-blocker-resolution-ledger-${generatedDate}.md`);
const knowledgeLedgerJsonOutPath = path.join(docsDir, `knowledge-topic-blocker-ledger-${generatedDate}.json`);
const knowledgeLedgerMdOutPath = path.join(docsDir, `knowledge-topic-blocker-ledger-${generatedDate}.md`);
const waiversLedgerJsonOutPath = path.join(docsDir, `waivers-state-resolution-ledger-${generatedDate}.json`);
const waiversLedgerMdOutPath = path.join(docsDir, `waivers-state-resolution-ledger-${generatedDate}.md`);
const educationLedgerJsonOutPath = path.join(docsDir, `education-routing-state-resolution-ledger-${generatedDate}.json`);
const educationLedgerMdOutPath = path.join(docsDir, `education-routing-state-resolution-ledger-${generatedDate}.md`);
const medicaidLedgerJsonOutPath = path.join(docsDir, `medicaid-hhs-offices-resolution-ledger-${generatedDate}.json`);
const medicaidLedgerMdOutPath = path.join(docsDir, `medicaid-hhs-offices-resolution-ledger-${generatedDate}.md`);
const waitlistsLedgerJsonOutPath = path.join(docsDir, `program-waitlists-resolution-ledger-${generatedDate}.json`);
const waitlistsLedgerMdOutPath = path.join(docsDir, `program-waitlists-resolution-ledger-${generatedDate}.md`);
const programsLedgerJsonOutPath = path.join(docsDir, `programs-benefits-promotion-resolution-ledger-${generatedDate}.json`);
const programsLedgerMdOutPath = path.join(docsDir, `programs-benefits-promotion-resolution-ledger-${generatedDate}.md`);
const ddLedgerJsonOutPath = path.join(docsDir, `dd-routing-state-resolution-ledger-${generatedDate}.json`);
const ddLedgerMdOutPath = path.join(docsDir, `dd-routing-state-resolution-ledger-${generatedDate}.md`);
const matchingLedgerJsonOutPath = path.join(docsDir, `disability-to-program-matching-verification-ledger-${generatedDate}.json`);
const matchingLedgerMdOutPath = path.join(docsDir, `disability-to-program-matching-verification-ledger-${generatedDate}.md`);

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

function countRows(filePath, key = 'rows') {
  if (!fs.existsSync(filePath)) return 0;
  const payload = readJson(filePath);
  return Array.isArray(payload[key]) ? payload[key].length : 0;
}

function countBy(rows, key, fallback = 'unknown') {
  return rows.reduce((acc, row) => {
    const value = row?.[key] ?? fallback;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function sortObjectEntries(object) {
  return Object.fromEntries(Object.entries(object).sort((a, b) => String(a[0]).localeCompare(String(b[0]))));
}

function dbCount(db, sql, params = {}) {
  return db.prepare(sql).get(params).count;
}

function dbGroupCount(db, sql, params = {}) {
  return db.prepare(sql).all(params);
}

function asMap(rows, keyField, valueField) {
  return new Map(rows.map((row) => [row[keyField], row[valueField]]));
}

function queueCountFromSummary(completionSummary, gapFamily) {
  return completionSummary.combinedByGapFamily?.[gapFamily] || 0;
}

function queueStatusBreakdown(rows, gapFamily) {
  return sortObjectEntries(countBy(rows.filter((row) => row.gapFamily === gapFamily), 'ledgerStatus'));
}

function queueSourceBreakdown(rows, gapFamily) {
  return sortObjectEntries(countBy(rows.filter((row) => row.gapFamily === gapFamily), 'sourceQueue'));
}

function formatObjectList(object) {
  return Object.entries(object).map(([key, value]) => `${key}=${value}`);
}

function summarizeValue(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (value && typeof value === 'object') {
    return formatObjectList(value).join(', ');
  }
  return String(value);
}

function percentComplete(completed, total) {
  if (!Number.isFinite(total) || total <= 0) return 100;
  const safeCompleted = Math.max(0, Math.min(total, completed));
  return Math.round((safeCompleted / total) * 100);
}

function slugifyLabel(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'unknown';
}

function buildSimpleMarkdownTable(headers, rows) {
  const lines = [
    `| ${headers.join(' | ')} |`,
    `|${headers.map(() => '---').join('|')}|`,
  ];
  for (const row of rows) {
    lines.push(`| ${row.map((cell) => String(cell ?? '')).join(' | ')} |`);
  }
  return lines.join('\n');
}

function writeArtifactPair(jsonPath, mdPath, payload, markdownLines) {
  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  fs.writeFileSync(mdPath, `${markdownLines.join('\n')}\n`);
}

function laneSummary(entries) {
  return sortObjectEntries(
    Object.fromEntries(
      Object.entries(entries).filter(([, value]) => Number(value || 0) > 0),
    ),
  );
}

const completionPlanPath = latestGeneratedJson('source-acquisition-completion-plan-');
const fullGapPath = latestGeneratedJson('full-information-gap-audit-');
const missingFamiliesPath = latestGeneratedJson('missing-source-families-');
const informationInventoryPath = latestGeneratedJson('information-inventory-');
const scrapeNowOnlyPath = latestGeneratedJson('scrape-now-only-');
const providerSourcePackPath = latestGeneratedJson('provider-source-pack-plan-');
const knowledgeStatusQueuePath = latestGeneratedJson('knowledge-content-status-queue-');
const authoredTargetsPath = latestGeneratedJson('authored-missing-source-targets-');

const completionPlan = readJson(completionPlanPath);
const fullGap = readJson(fullGapPath);
const missingFamilies = readJson(missingFamiliesPath);
const informationInventory = readJson(informationInventoryPath);
const scrapeNowOnly = readJson(scrapeNowOnlyPath);
const providerSourcePack = readJson(providerSourcePackPath);
const knowledgeStatusQueue = readJson(knowledgeStatusQueuePath);
const authoredTargets = readJson(authoredTargetsPath);

const completionSummary = completionPlan.summary || {};
const completionRows = completionPlan.combinedReadyRows || [];
const scrapeRows = scrapeNowOnly.rows || [];
const gapFamilyStats = new Map((missingFamilies.gapFamilyStats || []).map((row) => [row.gapFamily, row]));
const authoredByGapFamily = authoredTargets.summary?.byGapFamily || {};

const formsSourcePackPath = path.join(sourcePacksDir, 'forms_source_pack.json');
const officialRepairsPath = path.join(sourcePacksDir, 'official_state_domain_repairs.json');
const formsSourcePack = fs.existsSync(formsSourcePackPath) ? readJson(formsSourcePackPath) : { rows: [] };
const officialRepairs = fs.existsSync(officialRepairsPath) ? readJson(officialRepairsPath) : { rows: [] };

const formsRows = formsSourcePack.rows || [];
const officialRepairRows = officialRepairs.rows || [];

const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const db = new Database(dbPath, { readonly: true });

const liveCounts = {
  programs: dbCount(db, 'SELECT COUNT(*) AS count FROM programs'),
  programEligibilityRules: dbCount(db, 'SELECT COUNT(*) AS count FROM program_eligibility_rules'),
  programDocumentRequirements: dbCount(db, 'SELECT COUNT(*) AS count FROM program_document_requirements'),
  programApplicationSteps: dbCount(db, 'SELECT COUNT(*) AS count FROM program_application_steps'),
  programAppealInfo: dbCount(db, 'SELECT COUNT(*) AS count FROM program_appeal_info'),
  programWaitlists: dbCount(db, 'SELECT COUNT(*) AS count FROM program_waitlists'),
  formsAndGuides: dbCount(db, 'SELECT COUNT(*) AS count FROM forms_and_guides'),
  countyOffices: dbCount(db, 'SELECT COUNT(*) AS count FROM county_offices'),
  stateResourceAgencies: dbCount(db, 'SELECT COUNT(*) AS count FROM state_resource_agencies'),
  regionalEducationAgencies: dbCount(db, 'SELECT COUNT(*) AS count FROM regional_education_agencies'),
  schoolDistricts: dbCount(db, 'SELECT COUNT(*) AS count FROM school_districts'),
  resourceProviders: dbCount(db, 'SELECT COUNT(*) AS count FROM resource_providers'),
  knowledgeArticles: dbCount(db, 'SELECT COUNT(*) AS count FROM knowledge_articles'),
  conditions: dbCount(db, 'SELECT COUNT(*) AS count FROM conditions'),
  functionalNeeds: dbCount(db, 'SELECT COUNT(*) AS count FROM functional_needs'),
};

const allStates = db.prepare('SELECT id, name FROM states ORDER BY id').all();
const stateNameById = new Map(allStates.map((row) => [row.id, row.name]));

const stagingCounts = {
  stagingScrapedPrograms: dbCount(db, 'SELECT COUNT(*) AS count FROM staging_scraped_programs'),
  stagingScrapedForms: dbCount(db, 'SELECT COUNT(*) AS count FROM staging_scraped_forms'),
  stagingScrapedWaitlists: dbCount(db, 'SELECT COUNT(*) AS count FROM staging_scraped_waitlists'),
  stagingScrapedCountyOffices: dbCount(db, 'SELECT COUNT(*) AS count FROM staging_scraped_county_offices'),
  stagingScrapedStateResourceAgencies: dbCount(db, 'SELECT COUNT(*) AS count FROM staging_scraped_state_resource_agencies'),
  stagingScrapedRegionalEducationAgencies: dbCount(db, 'SELECT COUNT(*) AS count FROM staging_scraped_regional_education_agencies'),
  stagingScrapedSchoolDistricts: dbCount(db, 'SELECT COUNT(*) AS count FROM staging_scraped_school_districts'),
  stagingScrapedResourceProviders: dbCount(db, 'SELECT COUNT(*) AS count FROM staging_scraped_resource_providers'),
  stagingScrapedKnowledgeContent: dbCount(db, 'SELECT COUNT(*) AS count FROM staging_scraped_knowledge_content'),
};

const programVerification = asMap(
  dbGroupCount(db, 'SELECT COALESCE(verification_status, \'null\') AS key, COUNT(*) AS count FROM programs GROUP BY 1'),
  'key',
  'count',
);
const programCategory = asMap(
  dbGroupCount(db, 'SELECT COALESCE(category, \'null\') AS key, COUNT(*) AS count FROM programs GROUP BY 1'),
  'key',
  'count',
);
const programTypes = sortObjectEntries(
  Object.fromEntries(
    dbGroupCount(db, 'SELECT COALESCE(program_type, \'unknown\') AS key, COUNT(*) AS count FROM programs GROUP BY 1')
      .map((row) => [row.key, row.count]),
  ),
);
const waitlistStatus = sortObjectEntries(
  Object.fromEntries(
    dbGroupCount(db, 'SELECT COALESCE(status, \'null\') AS key, COUNT(*) AS count FROM program_waitlists GROUP BY 1')
      .map((row) => [row.key, row.count]),
  ),
);
const waitlistSourceTypes = sortObjectEntries(
  Object.fromEntries(
    dbGroupCount(db, 'SELECT COALESCE(estimate_source_type, \'null\') AS key, COUNT(*) AS count FROM program_waitlists GROUP BY 1')
      .map((row) => [row.key, row.count]),
  ),
);
const formsVerification = sortObjectEntries(
  Object.fromEntries(
    dbGroupCount(db, 'SELECT COALESCE(verification_status, \'null\') AS key, COUNT(*) AS count FROM forms_and_guides GROUP BY 1')
      .map((row) => [row.key, row.count]),
  ),
);
const formsEvidence = sortObjectEntries(
  Object.fromEntries(
    dbGroupCount(db, 'SELECT COALESCE(evidence_level, \'null\') AS key, COUNT(*) AS count FROM forms_and_guides GROUP BY 1')
      .map((row) => [row.key, row.count]),
  ),
);
const countyOfficeVerification = sortObjectEntries(
  Object.fromEntries(
    dbGroupCount(db, 'SELECT COALESCE(verification_status, \'null\') AS key, COUNT(*) AS count FROM county_offices GROUP BY 1')
      .map((row) => [row.key, row.count]),
  ),
);
const stateAgencyVerification = sortObjectEntries(
  Object.fromEntries(
    dbGroupCount(db, 'SELECT COALESCE(verification_status, \'null\') AS key, COUNT(*) AS count FROM state_resource_agencies GROUP BY 1')
      .map((row) => [row.key, row.count]),
  ),
);
const regionalEducationVerification = sortObjectEntries(
  Object.fromEntries(
    dbGroupCount(db, 'SELECT COALESCE(verification_status, \'null\') AS key, COUNT(*) AS count FROM regional_education_agencies GROUP BY 1')
      .map((row) => [row.key, row.count]),
  ),
);
const schoolDistrictVerification = sortObjectEntries(
  Object.fromEntries(
    dbGroupCount(db, 'SELECT COALESCE(verification_status, \'null\') AS key, COUNT(*) AS count FROM school_districts GROUP BY 1')
      .map((row) => [row.key, row.count]),
  ),
);
const providerVerification = sortObjectEntries(
  Object.fromEntries(
    dbGroupCount(db, 'SELECT COALESCE(verification_status, \'null\') AS key, COUNT(*) AS count FROM resource_providers GROUP BY 1')
      .map((row) => [row.key, row.count]),
  ),
);
const providerClaimStatus = sortObjectEntries(
  Object.fromEntries(
    dbGroupCount(db, 'SELECT COALESCE(claim_status, \'null\') AS key, COUNT(*) AS count FROM resource_providers GROUP BY 1')
      .map((row) => [row.key, row.count]),
  ),
);

const knowledgeRows = knowledgeStatusQueue.rows || [];
const knowledgeStatusCounts = sortObjectEntries(countBy(knowledgeRows, 'finalStatus'));
const officialRepairByLane = sortObjectEntries(countBy(officialRepairRows, 'lane'));
const formsReplacementClassCounts = sortObjectEntries(countBy(formsRows, 'replacementClass'));
const waitlistLaunchExactRows = scrapeRows.filter((row) => row.targetTable === 'program_waitlists');
const waitlistFollowupRows = completionRows.filter((row) => row.targetTable === 'program_waitlists');
const waitlistLaunchExactStates = [...new Set(waitlistLaunchExactRows.map((row) => row.stateId || row.stateName || row.state).filter(Boolean))];
const waitlistFollowupStates = [...new Set(waitlistFollowupRows.map((row) => row.stateId || row.stateName || row.state).filter(Boolean))];
const typedWaiverPrograms = (programTypes.medicaid_hcbs_waiver || 0)
  + (programTypes.behavioral_health_waiver || 0)
  + (programTypes.medicaid_managed_care_hcbs || 0);
const formsGapStat = gapFamilyStats.get('forms_guides') || { total: 0, ready: 0, blocked: 0 };
const stateCoverage = fullGap.stateCoverage || {};
const launchQueueBaselines = {
  programs_benefits: 29,
  waivers: 11,
  medicaid_hhs_offices: 116,
  dd_routing: 74,
  education_routing: 11,
};

const canonicalLaunchQueueAccounting = {
  formsGuides: {
    totalStates: 50,
    alreadyClearedStates: 50 - (formsGapStat.total || 0),
    readyExactStates: formsGapStat.ready || 0,
    authorFirstStates: formsGapStat.blocked || 0,
    blockedStates: 0,
    fallbackOnlyStates: formsRows.length,
    stateSpecificFallbackOnlyStates: formsReplacementClassCounts.state_specific_form_fallback_only || 0,
    federalOnlyFallbackStates: formsReplacementClassCounts.federal_only_form_fallback || 0,
    unaccountedStates: 0,
    rawGapAuditBlockedStates: formsGapStat.blocked || 0,
    rawGapAuditTotal: formsGapStat.total || 0,
    launchInterpretation: [
      `${50 - (formsGapStat.total || 0)} states are already cleared outside the current forms gap audit.`,
      `${formsGapStat.ready || 0} states are ready exact.`,
      `${formsGapStat.blocked || 0} states are author-first fallback states, not true scrape-blocked launch states.`,
      '0 states remain unknown in canonical launch accounting.',
    ],
  },
  programWaitlists: {
    launchExactReadyRows: waitlistLaunchExactRows.length,
    launchExactReadyStates: waitlistLaunchExactStates,
    followupReadyRows: waitlistFollowupRows.length,
    followupReadyStates: waitlistFollowupStates.length,
    followupReadyClassification: 'waitlist_like_db_discovered_not_yet_exact_launch_queue',
    hiddenUnderGapFamily: 'general_gap_fill',
    firstClassLaunchFamilyRequired: true,
    launchInterpretation: [
      'Only curated first-party exact waitlist targets count as the initial launch-critical execution lane.',
      'DB-discovered waitlist-like rows stay visible as follow-up inventory and must not remain invisible inside general_gap_fill.',
    ],
  },
};

const launchProviderStandard = {
  anchorsRequiredPerState: 3,
  mandatorySubtypeBuckets: [
    {
      bucket: 'evaluation_diagnostic',
      acceptableSubtypes: ['developmental_pediatrics', 'developmental_clinic', 'diagnostic_center'],
    },
    {
      bucket: 'therapy_services',
      acceptableSubtypes: ['therapy_program', 'therapy_clinic', 'speech_therapy', 'occupational_therapy', 'physical_therapy', 'aba_therapy'],
    },
    {
      bucket: 'specialty_entrypoint',
      acceptableSubtypes: ['autism_center', 'childrens_hospital', 'pediatric_specialty_center'],
    },
  ],
  anchorEligibilityRule: [
    'first-party or official source only',
    'named clinic/program/service, not org shell',
    'phone or intake contact required',
    'physical address required',
    'source URL required',
    'next-step URL or next-step phone required',
    'verification must be verified or official_verified',
    'no directory-only or inferred local presence',
  ],
  stateStatusRules: {
    launch_ready: 'all 3 mandatory subtype buckets satisfied and minimum 3 anchors total',
    blocked: 'after authoring, one or more mandatory buckets still lack any exact first-party target; blocker reason saved and provider results stay gated',
    not_ready_author_first: 'exact targets are not yet authored enough to evaluate readiness',
  },
  nationalLaunchRule: {
    decisionComplete: 'all 50 states are either launch_ready or blocked',
    goodEnoughForLaunch: 'no state remains unknown',
    blockedStatePolicy: 'blocked states are acceptable only if provider surfaces are gated there',
  },
  currentStatus: {
    launchReadyStates: 0,
    blockedStates: 0,
    notReadyAuthorFirstStates: 50,
    pullNowPlannedStates: providerSourcePack.summary?.pullNowStates || 0,
    authoredProviderTargets: authoredByGapFamily.providers_care || 0,
    directReadyQueueRows: 0,
    discoveryOnlyRows: queueCountFromSummary(completionSummary, 'providers_care'),
  },
};

const familyDecisionMeta = {
  programs_benefits: {
    launchExecutionClass: 'scrape_now',
    directAcquisitionRequired: true,
    launchThreshold: '29/29 ready rows resolved',
    truthThreshold: '0 launch-visible generic agency pages promoted as programs',
    blockerCondition: 'Any ready row remains unresolved or any launch-visible program lacks all actionable subtypes.',
    goodEnoughForLaunchRule: 'Every launch-visible program has core fields plus at least one actionable subtype.',
    currentProgressMetric: '0% queue closure',
  },
  waivers: {
    launchExecutionClass: 'author_first',
    directAcquisitionRequired: true,
    launchThreshold: '50/50 states have at least one explicit waiver path or explicit no-waiver/blocked state artifact',
    truthThreshold: 'Every launch-visible waiver has explicit waiver identity and source-backed action path',
    blockerCondition: 'A state has waiver surfaced without explicit waiver typing or action path.',
    goodEnoughForLaunchRule: 'Waiver search never falls back to generic program pages.',
    currentProgressMetric: '16% state coverage / 0% queue closure',
  },
  forms_guides: {
    launchExecutionClass: 'author_first',
    directAcquisitionRequired: true,
    launchThreshold: '50/50 states classified into cleared exact, ready exact, or approved fallback class',
    truthThreshold: '0 fake/placeholder domains; 0 unofficial public launch forms',
    blockerCondition: 'Any state remains unaccounted or any placeholder domain remains in the launch path.',
    goodEnoughForLaunchRule: 'A state may launch on an approved fallback class even without exact library extraction.',
    currentProgressMetric: '14% cleared / 100% accounted',
  },
  program_waitlists: {
    launchExecutionClass: 'author_first',
    directAcquisitionRequired: true,
    launchThreshold: '6/6 curated exact waitlist targets classified as first-class launch rows',
    truthThreshold: 'Every launch-visible waitlist row has explicit source linkage and is never inferred from general program text',
    blockerCondition: 'Waitlist rows remain only under general_gap_fill or launch-visible rows lack source type.',
    goodEnoughForLaunchRule: 'Waitlists can be present, blocked, or not available, but never implicit.',
    currentProgressMetric: '100% identified / 0% first-class closed',
  },
  medicaid_hhs_offices: {
    launchExecutionClass: 'author_first',
    directAcquisitionRequired: true,
    launchThreshold: '50/50 states retain at least one truthful office path and 116/116 remaining queue rows are reclassified as ready or repair-first',
    truthThreshold: '0 malformed county-domain rows in scrape-now',
    blockerCondition: 'Any malformed county-domain target remains in scrape-now.',
    goodEnoughForLaunchRule: 'Counties without trustworthy coverage stay gated.',
    currentProgressMetric: '100% state coverage / 0% repair closure',
  },
  dd_routing: {
    launchExecutionClass: 'scrape_now',
    directAcquisitionRequired: true,
    launchThreshold: '50/50 states with at least one launch-safe DD routing path and 74/74 queue rows resolved or blocked',
    truthThreshold: 'Complete trust metadata on all launch-visible routing rows',
    blockerCondition: 'Any state lacks a truthful routing path or any queue row remains unknown.',
    goodEnoughForLaunchRule: 'One truthful statewide path is enough; deeper routing is additive.',
    currentProgressMetric: '100% state coverage / 0% queue closure',
  },
  education_routing: {
    launchExecutionClass: 'author_first',
    directAcquisitionRequired: true,
    launchThreshold: '50/50 states with at least one regional or district fallback routing path and 11/11 queue rows resolved or blocked',
    truthThreshold: 'No district row shown without real phone or credible district site',
    blockerCondition: 'Regional gap is unresolved in the remaining 3 states without explicit fallback/block status.',
    goodEnoughForLaunchRule: 'Regional routing is sufficient; district depth is additive.',
    currentProgressMetric: '94% coverage / 0% queue closure',
  },
  providers_care: {
    launchExecutionClass: 'author_first',
    directAcquisitionRequired: true,
    launchThreshold: '50/50 states decision-complete under the provider launch standard',
    truthThreshold: 'Every launch-visible anchor satisfies all anchor eligibility rules',
    blockerCondition: 'A state is missing any mandatory subtype bucket or only weak directory evidence exists.',
    goodEnoughForLaunchRule: 'A state is either launch-ready with 3 anchors or explicitly blocked and gated.',
    currentProgressMetric: '0% launch-ready / 20% author-planned',
  },
  knowledge_content: {
    launchExecutionClass: 'author_first',
    directAcquisitionRequired: true,
    launchThreshold: '6/6 launch topic buckets covered',
    truthThreshold: 'Provenance-safe serving path for every launch-visible article',
    blockerCondition: 'A topic exists only in live content without preserved provenance.',
    goodEnoughForLaunchRule: 'One strong source-backed article per topic bucket is enough.',
    currentProgressMetric: '0% launch-safe topic closure',
  },
  disability_to_program_matching: {
    launchExecutionClass: 'dependency_verification_only',
    directAcquisitionRequired: false,
    launchThreshold: '0 direct acquisition work, plus verification pass after linked-family closure',
    truthThreshold: 'Matching remains rule-backed only',
    blockerCondition: 'The launch artifact still treats this family as scrapeable.',
    goodEnoughForLaunchRule: 'Reference tables are present and linked-family verification passes.',
    currentProgressMetric: '100% direct data present / 0% dependency verification complete',
  },
};

const launchFamilies = [
  {
    id: 'programs_benefits',
    label: 'Programs and benefits',
    requiredSubtypes: [
      'program definitions',
      'eligibility rules',
      'document requirements',
      'application steps',
      'appeal information',
    ],
    requiredLaunchFields: {
      programs: ['id', 'name', 'description', 'who_it_is_for', 'who_might_qualify', 'official_source_url', 'state_id', 'source_url', 'source_type', 'data_origin', 'verification_status', 'confidence_score', 'program_type'],
      programEligibilityRules: ['program_id', 'min_age_years', 'max_age_years', 'required_condition', 'required_need', 'insurance_status', 'school_status', 'trigger_reason'],
      programDocumentRequirements: ['program_id', 'name', 'description', 'is_mandatory'],
      programApplicationSteps: ['program_id', 'step_number', 'title', 'action_description', 'apply_url_or_contact'],
      programAppealInfo: ['program_id', 'deadline_days', 'appeal_steps', 'denial_reasons', 'appeal_form_name', 'official_appeal_source_url'],
    },
    enoughForLaunch: [
      'Every program surfaced in search has name, description, who_it_is_for, who_might_qualify, and official_source_url.',
      'Each surfaced program has at least one actionable subtype: eligibility rule, document requirement, application step, appeal record, or linked form.',
      'Generic agency overview pages never promote as stand-alone programs.',
    ],
    currentStateInventory: {
      liveCounts: {
        programs: liveCounts.programs,
        programEligibilityRules: liveCounts.programEligibilityRules,
        programDocumentRequirements: liveCounts.programDocumentRequirements,
        programApplicationSteps: liveCounts.programApplicationSteps,
        programAppealInfo: liveCounts.programAppealInfo,
      },
      stagingCounts: {
        stagingScrapedPrograms: stagingCounts.stagingScrapedPrograms,
      },
      queueCounts: {
        total: queueCountFromSummary(completionSummary, 'programs_benefits'),
        byStatus: queueStatusBreakdown(completionRows, 'programs_benefits'),
        byQueueSource: queueSourceBreakdown(completionRows, 'programs_benefits'),
      },
      trustAndComposition: {
        verificationStatus: {
          verified: programVerification.get('verified') || 0,
          official_verified: programVerification.get('official_verified') || 0,
        },
        category: {
          state: programCategory.get('state') || 0,
          federal: programCategory.get('federal') || 0,
        },
        programType: programTypes,
      },
      knownWeakSpots: [
        'Weak action signals on generic agency pages.',
        'Live program_type classification is still mostly unknown.',
      ],
      truthRiskConcerns: [
        'Large row count can overstate real actionable launch depth.',
        'Program parser can still over-admit agency pages unless deterministic rejects stay suppressed.',
      ],
    },
    gapAnalysis: {
      missing: [
        `Burn down the remaining ${queueCountFromSummary(completionSummary, 'programs_benefits')} ready rows.`,
        'Keep only program pages that produce truthful action signals.',
        'Increase typed waiver/program identity where possible.',
      ],
      gapTypes: {
        source: 'low',
        queue: 'medium',
        scraper: 'low',
        parser: 'low',
        validator: 'medium',
        staging: 'low',
        promotion: 'medium',
        truthPolicy: 'high',
      },
    },
    sourceAcquisitionPlan: {
      exactSourceFamilies: [
        'official state Medicaid overview and eligibility pages',
        'official DD benefit/program pages',
        'official SSI/SSA benefit pages already in queue',
      ],
      existingSourcePackStatus: [
        `Completion plan currently has ${queueCountFromSummary(completionSummary, 'programs_benefits')} ready lightweight rows.`,
        'No source-family authoring blocker remains for this launch family.',
      ],
      authoringNeededFirst: false,
      scraperLane: 'HTTP',
      suggestedBatchSizeClass: 'large',
      controlPlaneRule: 'Run deterministic reject suppression for missing_action_signal and missing_program_name before each scrape wave.',
    },
    ...familyDecisionMeta.programs_benefits,
  },
  {
    id: 'waivers',
    label: 'Waivers',
    requiredSubtypes: [
      'waiver program records',
      'waiver-specific eligibility',
      'waiver-specific steps',
      'waiver appeals',
      'waiver waitlist linkage',
    ],
    requiredLaunchFields: {
      programs: ['id', 'name', 'description', 'who_it_is_for', 'who_might_qualify', 'official_source_url', 'state_id', 'source_url', 'source_type', 'data_origin', 'verification_status', 'confidence_score', 'program_type'],
      linkage: ['program_waitlists.program_id'],
    },
    enoughForLaunch: [
      'Each state has a truthful DD or HCBS waiver entry path if a waiver is shown.',
      'Waiver rows link to source-backed steps, eligibility, and waitlist or interest-list status when available.',
      'Waivers without usable action signals remain blocked or hidden.',
    ],
    currentStateInventory: {
      liveCounts: {
        waiverTypedPrograms: typedWaiverPrograms,
        programWaitlists: liveCounts.programWaitlists,
      },
      stagingCounts: {
        stagingScrapedPrograms: stagingCounts.stagingScrapedPrograms,
      },
      queueCounts: {
        total: queueCountFromSummary(completionSummary, 'waivers'),
        byStatus: queueStatusBreakdown(completionRows, 'waivers'),
        byQueueSource: queueSourceBreakdown(completionRows, 'waivers'),
      },
      trustAndComposition: {
        typedProgramBreakdown: Object.fromEntries(
          Object.entries(programTypes).filter(([key]) => key.includes('waiver') || key === 'medicaid_managed_care_hcbs'),
        ),
        officialRepairRows: officialRepairByLane.waiver_program || 0,
      },
      knownWeakSpots: [
        'Very sparse typed waiver rows in live programs.',
        'Waitlist linkage is incomplete.',
      ],
      truthRiskConcerns: [
        'Waiver search can over-rely on generic program rows without explicit waiver identity.',
      ],
    },
    gapAnalysis: {
      missing: [
        `Process the ${queueCountFromSummary(completionSummary, 'waivers')} ready rows.`,
        'Capture blocked remainder explicitly in artifacts.',
        'Tighten waiver classification on accepted program rows.',
      ],
      gapTypes: {
        source: 'low',
        queue: 'medium',
        scraper: 'low',
        parser: 'low',
        validator: 'medium',
        staging: 'low',
        promotion: 'medium',
        truthPolicy: 'medium',
      },
    },
    sourceAcquisitionPlan: {
      exactSourceFamilies: [
        'official state HCBS waiver pages',
        'official DD waiver pages',
        'official Medicaid waiver eligibility pages',
      ],
      existingSourcePackStatus: [
        `Completion plan currently has ${queueCountFromSummary(completionSummary, 'waivers')} ready lightweight waiver rows.`,
        `Official repair pack includes ${officialRepairByLane.waiver_program || 0} waiver_program repair rows for later followup.`,
      ],
      authoringNeededFirst: false,
      scraperLane: 'HTTP first, PDF if new repaired rows surface',
      suggestedBatchSizeClass: 'large HTTP, medium PDF',
      controlPlaneRule: 'Do not treat generic policy pages as waivers unless program identity and action path are explicit.',
    },
    ...familyDecisionMeta.waivers,
  },
  {
    id: 'forms_guides',
    label: 'Forms and guides',
    requiredSubtypes: [
      'exact official forms',
      'official form-library roots',
      'official application guides',
      'official appeal forms',
    ],
    requiredLaunchFields: {
      formsAndGuides: ['state_id', 'program_id', 'title', 'slug', 'category', 'form_type', 'agency', 'source_url', 'pdf_url', 'who_uses_it', 'who_signs_it', 'where_to_send_it', 'deadline', 'evidence_level', 'data_origin', 'verification_status', 'confidence_score', 'last_checked_at'],
    },
    enoughForLaunch: [
      'Every state has either an exact official forms source or an explicit official fallback class.',
      'Publicly shown forms remain official or official-library-root backed.',
      'Fake placeholder domains are completely excluded.',
    ],
    currentStateInventory: {
      liveCounts: {
        formsAndGuides: liveCounts.formsAndGuides,
      },
      stagingCounts: {
        stagingScrapedForms: stagingCounts.stagingScrapedForms,
      },
      queueCounts: {
        total: queueCountFromSummary(completionSummary, 'forms_guides'),
        fromGapAudit: {
          total: gapFamilyStats.get('forms_guides')?.total || 0,
          ready: gapFamilyStats.get('forms_guides')?.ready || 0,
          blocked: gapFamilyStats.get('forms_guides')?.blocked || 0,
        },
      },
      trustAndComposition: {
        verificationStatus: formsVerification,
        evidenceLevel: formsEvidence,
        sourcePackRows: formsRows.length,
        sourcePackReplacementClasses: formsReplacementClassCounts,
        officialRepairRows: officialRepairByLane.forms_library || 0,
      },
      knownWeakSpots: [
        'Exact library coverage is still weak for fallback-only states.',
        'Current ready queue is effectively exhausted until authoring resolves fallback states.',
      ],
      truthRiskConcerns: [
        'Fake dhhs.<state>.gov style placeholders must never re-enter launch sources.',
      ],
      canonicalLaunchQueueAccounting: canonicalLaunchQueueAccounting.formsGuides,
    },
    gapAnalysis: {
      missing: [
        'Convert fallback-only states into exact official library roots or final explicit fallback classes.',
        'Rebuild a ready queue only from official targets.',
      ],
      gapTypes: {
        source: 'high',
        queue: 'high',
        scraper: 'low',
        parser: 'medium',
        validator: 'medium',
        staging: 'low',
        promotion: 'low',
        truthPolicy: 'high',
      },
    },
    sourceAcquisitionPlan: {
      exactSourceFamilies: [
        'official state Medicaid form libraries',
        'official state education or special-ed form libraries',
        'official appeal and request forms',
      ],
      existingSourcePackStatus: [
        `${formsRows.length} source-pack rows exist.`,
        `${formsReplacementClassCounts.state_specific_form_fallback_only || 0} states are still state_specific_form_fallback_only.`,
        `${formsReplacementClassCounts.federal_only_form_fallback || 0} states are federal_only_form_fallback.`,
      ],
      authoringNeededFirst: true,
      scraperLane: 'HTTP primarily, PDF where exact form downloads are the only stable source',
      suggestedBatchSizeClass: 'large HTTP, medium PDF',
      controlPlaneRule: 'Do not requeue fallback-only states as ready until each state has a final official source class.',
    },
    ...familyDecisionMeta.forms_guides,
  },
  {
    id: 'program_waitlists',
    label: 'Program waitlists',
    requiredSubtypes: [
      'waitlist records',
      'interest-list records',
      'reserve-capacity notices',
      'legal deadline notices',
    ],
    requiredLaunchFields: {
      programWaitlists: ['program_id', 'name', 'duration_label', 'duration_months', 'status', 'description', 'reserve_capacity_notice', 'legal_deadline', 'estimate_source_url', 'estimate_source_type', 'last_checked_at'],
    },
    enoughForLaunch: [
      'Major waiver and program surfaces have either a current waitlist row or an explicit blocked or missing status in artifact space.',
      'Waitlists are never inferred from unrelated program text.',
    ],
    currentStateInventory: {
      liveCounts: {
        programWaitlists: liveCounts.programWaitlists,
      },
      stagingCounts: {
        stagingScrapedWaitlists: stagingCounts.stagingScrapedWaitlists,
      },
      queueCounts: {
        directScrapeNowRows: waitlistLaunchExactRows.length,
        directScrapeNowStates: waitlistLaunchExactStates,
        followupReadyRows: waitlistFollowupRows.length,
        followupReadyStates: waitlistFollowupStates.length,
      },
      trustAndComposition: {
        statusDistribution: waitlistStatus,
        estimateSourceType: waitlistSourceTypes,
      },
      knownWeakSpots: [
        'Waitlist work is partially hidden under general_gap_fill instead of a dedicated family.',
        '52 live waitlist rows still have null estimate_source_type.',
      ],
      truthRiskConcerns: [
        'Freshness is uneven and source linkage is missing on part of the live set.',
      ],
      canonicalLaunchQueueAccounting: canonicalLaunchQueueAccounting.programWaitlists,
    },
    gapAnalysis: {
      missing: [
        'Promote waitlists into a first-class launch family in queue reporting.',
        'Add exact state waitlist sources for remaining major waiver and program surfaces.',
      ],
      gapTypes: {
        source: 'medium',
        queue: 'high',
        scraper: 'low',
        parser: 'medium',
        validator: 'medium',
        staging: 'low',
        promotion: 'medium',
        truthPolicy: 'medium',
      },
    },
    sourceAcquisitionPlan: {
      exactSourceFamilies: [
        'official waitlist pages',
        'official interest-list pages',
        'official enrollment queue pages',
      ],
      existingSourcePackStatus: [
        `${waitlistLaunchExactRows.length} direct scrape-now waitlist rows exist today.`,
        'Current queue taxonomy still hides them under general_gap_fill.',
      ],
      authoringNeededFirst: true,
      scraperLane: 'HTTP',
      suggestedBatchSizeClass: 'large',
      controlPlaneRule: 'Surface program_waitlists as a first-class launch family before bulk execution so closure can be measured directly.',
    },
    ...familyDecisionMeta.program_waitlists,
  },
  {
    id: 'medicaid_hhs_offices',
    label: 'County offices and Medicaid/HHS offices',
    requiredSubtypes: [
      'county Medicaid/HHS offices',
      'IHSS county offices',
      'CCS or analogous county child-health offices',
    ],
    requiredLaunchFields: {
      countyOffices: ['county_id', 'program_id', 'office_name', 'address', 'phone', 'email', 'website', 'source_url', 'source_type', 'data_origin', 'verification_status', 'last_verified_date', 'last_scraped_at', 'confidence_score', 'evidence_level'],
    },
    enoughForLaunch: [
      'County-facing office lookup is source-backed where shown.',
      'Shown office records have address and phone at minimum.',
      'Counties without trustworthy office coverage remain gated instead of padded.',
    ],
    currentStateInventory: {
      liveCounts: {
        countyOffices: liveCounts.countyOffices,
      },
      stagingCounts: {
        stagingScrapedCountyOffices: stagingCounts.stagingScrapedCountyOffices,
      },
      queueCounts: {
        total: queueCountFromSummary(completionSummary, 'medicaid_hhs_offices'),
        byStatus: queueStatusBreakdown(completionRows, 'medicaid_hhs_offices'),
        byQueueSource: queueSourceBreakdown(completionRows, 'medicaid_hhs_offices'),
      },
      trustAndComposition: {
        verificationStatus: countyOfficeVerification,
        officialRepairRows: officialRepairByLane.medicaid_county_directory || 0,
      },
      knownWeakSpots: [
        'Current remaining queue includes malformed county-domain targets.',
        'Challenge-blocked counties are mixed into the same remaining lane.',
      ],
      truthRiskConcerns: [
        'High live count can hide poor target quality in the unresolved queue.',
      ],
    },
    gapAnalysis: {
      missing: [
        'Repair malformed county-domain targets before bulk fetching again.',
        'Re-run only trustworthy county-office targets after repairs are applied.',
      ],
      gapTypes: {
        source: 'high',
        queue: 'high',
        scraper: 'low',
        parser: 'medium',
        validator: 'medium',
        staging: 'low',
        promotion: 'low',
        truthPolicy: 'medium',
      },
    },
    sourceAcquisitionPlan: {
      exactSourceFamilies: [
        'official county IHSS office pages',
        'official county CCS or Medicaid/HHS office pages',
      ],
      existingSourcePackStatus: [
        `${officialRepairByLane.medicaid_county_directory || 0} official repair rows exist for medicaid_county_directory.`,
        `${queueCountFromSummary(completionSummary, 'medicaid_hhs_offices')} queue rows remain, with most still tied to malformed or challenge-blocked targets.`,
      ],
      authoringNeededFirst: true,
      scraperLane: 'HTTP after repair, JS or PDF only for residual exceptions',
      suggestedBatchSizeClass: 'large after repair, medium or small for residual JS/PDF',
      controlPlaneRule: 'Do not rerun county-office bulk scraping until repair-pack replacements resolve malformed county-domain families.',
    },
    ...familyDecisionMeta.medicaid_hhs_offices,
  },
  {
    id: 'dd_routing',
    label: 'DD routing',
    requiredSubtypes: [
      'state DD or IDD intake agencies',
      'developmental-services routing agencies',
      'statewide catchment and eligibility routing',
    ],
    requiredLaunchFields: {
      stateResourceAgencies: ['state_id', 'agency_type', 'name', 'counties_served', 'catchment_boundaries', 'website', 'intake_phone', 'agency_intake_contact', 'eligibility_info_page', 'services_page', 'appeals_info', 'source_url', 'source_type', 'data_origin', 'verification_status', 'confidence_score', 'evidence_level'],
    },
    enoughForLaunch: [
      'Every state has at least one truthful DD routing path.',
      'Every shown routing row includes a usable intake contact or routing path plus a services or eligibility page.',
      'Trust metadata is complete on public rows.',
    ],
    currentStateInventory: {
      liveCounts: {
        stateResourceAgencies: liveCounts.stateResourceAgencies,
      },
      stagingCounts: {
        stagingScrapedStateResourceAgencies: stagingCounts.stagingScrapedStateResourceAgencies,
      },
      queueCounts: {
        total: queueCountFromSummary(completionSummary, 'dd_routing'),
        byStatus: queueStatusBreakdown(completionRows, 'dd_routing'),
        byQueueSource: queueSourceBreakdown(completionRows, 'dd_routing'),
      },
      trustAndComposition: {
        verificationStatus: stateAgencyVerification,
        officialRepairRows: officialRepairByLane.dd_state_directory || 0,
      },
      knownWeakSpots: [
        'This remains the largest launch-critical routing backlog.',
        'The queue splits across lightweight and JS-heavy targets, so one pass is not enough.',
      ],
      truthRiskConcerns: [
        'Incomplete DD routing directly weakens disability-to-program search usefulness at launch.',
      ],
    },
    gapAnalysis: {
      missing: [
        'Process the remaining 74 queue rows.',
        'Treat lightweight and JS-heavy sublanes as one launch workstream with shared closure rules.',
      ],
      gapTypes: {
        source: 'low',
        queue: 'high',
        scraper: 'medium',
        parser: 'medium',
        validator: 'medium',
        staging: 'low',
        promotion: 'medium',
        truthPolicy: 'high',
      },
    },
    sourceAcquisitionPlan: {
      exactSourceFamilies: [
        'official state DD or IDD agencies',
        'official developmental-services routing pages',
        'official catchment and intake pages',
      ],
      existingSourcePackStatus: [
        `${queueCountFromSummary(completionSummary, 'dd_routing')} queue rows remain.`,
        `${officialRepairByLane.dd_state_directory || 0} dd_state_directory repair rows exist for later repair-driven followup.`,
      ],
      authoringNeededFirst: false,
      scraperLane: 'HTTP for lightweight rows, Playwright for JS-heavy rows',
      suggestedBatchSizeClass: 'large HTTP, small JS-heavy',
      controlPlaneRule: 'Closure requires both sublanes to complete or block explicitly; do not report DD routing done after HTTP only.',
    },
    ...familyDecisionMeta.dd_routing,
  },
  {
    id: 'education_routing',
    label: 'Education routing',
    requiredSubtypes: [
      'state or regional special-education routing',
      'district special-ed contacts',
      'district fallback when regional coverage is thin',
    ],
    requiredLaunchFields: {
      regionalEducationAgencies: ['state_id', 'agency_type', 'name', 'counties_served', 'website', 'source_url', 'source_type', 'data_origin', 'verification_status', 'confidence_score', 'evidence_level'],
      schoolDistricts: ['county_id', 'name', 'spec_ed_contact_phone', 'spec_ed_contact_email', 'website', 'source_url', 'source_type', 'data_origin', 'verification_status', 'confidence_score', 'evidence_level'],
    },
    enoughForLaunch: [
      'Every state has at least one truthful education-routing layer.',
      'District depth is additive rather than blocking when regional routing is usable.',
      'No district row is shown without a real phone or credible district site.',
    ],
    currentStateInventory: {
      liveCounts: {
        regionalEducationAgencies: liveCounts.regionalEducationAgencies,
        schoolDistricts: liveCounts.schoolDistricts,
      },
      stagingCounts: {
        stagingScrapedRegionalEducationAgencies: stagingCounts.stagingScrapedRegionalEducationAgencies,
        stagingScrapedSchoolDistricts: stagingCounts.stagingScrapedSchoolDistricts,
      },
      queueCounts: {
        total: queueCountFromSummary(completionSummary, 'education_routing'),
        byStatus: queueStatusBreakdown(completionRows, 'education_routing'),
        byQueueSource: queueSourceBreakdown(completionRows, 'education_routing'),
      },
      trustAndComposition: {
        regionalVerificationStatus: regionalEducationVerification,
        schoolDistrictVerificationStatus: schoolDistrictVerification,
        regionalCoverageStates: '47/50 states from full gap audit',
        officialRepairRows: {
          education_routing: officialRepairByLane.education_routing || 0,
          special_education: officialRepairByLane.special_education || 0,
        },
      },
      knownWeakSpots: [
        'The remaining queue is small but mostly JS-heavy.',
        'Regional education coverage is still missing in 3 states.',
      ],
      truthRiskConcerns: [
        'Launch can tolerate uneven district depth, but not an unknown regional-routing gap.',
      ],
    },
    gapAnalysis: {
      missing: [
        `Process the remaining ${queueCountFromSummary(completionSummary, 'education_routing')} queue rows.`,
        'Close or explicitly block the remaining 3-state regional routing gap.',
      ],
      gapTypes: {
        source: 'low',
        queue: 'medium',
        scraper: 'medium',
        parser: 'low',
        validator: 'medium',
        staging: 'low',
        promotion: 'medium',
        truthPolicy: 'medium',
      },
    },
    sourceAcquisitionPlan: {
      exactSourceFamilies: [
        'official state special-ed offices',
        'official regional education agencies',
        'official district directories for special-ed contacts',
      ],
      existingSourcePackStatus: [
        `${queueCountFromSummary(completionSummary, 'education_routing')} queue rows remain.`,
        `${officialRepairByLane.education_routing || 0} education_routing repair rows and ${officialRepairByLane.special_education || 0} special_education repair rows exist.`,
      ],
      authoringNeededFirst: false,
      scraperLane: 'HTTP for lightweight rows, Playwright for JS-heavy rows',
      suggestedBatchSizeClass: 'large HTTP, small JS-heavy',
      controlPlaneRule: 'Regional routing coverage should close first; district-only fallback is additive, not a substitute for missing state/regional routing.',
    },
    ...familyDecisionMeta.education_routing,
  },
  {
    id: 'providers_care',
    label: 'Providers and care',
    requiredSubtypes: [
      'children’s hospitals',
      'developmental pediatrics',
      'autism centers',
      'therapy programs',
      'diagnostic clinics',
    ],
    requiredLaunchFields: {
      resourceProviders: ['name', 'categories', 'county_id', 'phone', 'email', 'address', 'source_url', 'source_type', 'data_origin', 'verification_status', 'confidence_score', 'evidence_level', 'service_tags', 'availability_status', 'next_step_type', 'next_step_label', 'next_step_url', 'requirements', 'application_url', 'languages'],
    },
    enoughForLaunch: [
      'Each state has a small truthful anchor set of provider entry points.',
      'Every shown provider has a named clinic or program identity plus contact and location evidence.',
      'Generic directories never imply local in-person care unless explicitly evidenced.',
    ],
    currentStateInventory: {
      liveCounts: {
        resourceProviders: liveCounts.resourceProviders,
      },
      stagingCounts: {
        stagingScrapedResourceProviders: stagingCounts.stagingScrapedResourceProviders,
      },
      queueCounts: {
        total: queueCountFromSummary(completionSummary, 'providers_care'),
        byStatus: queueStatusBreakdown(completionRows, 'providers_care'),
        byQueueSource: queueSourceBreakdown(completionRows, 'providers_care'),
      },
      trustAndComposition: {
        verificationStatus: providerVerification,
        claimStatus: providerClaimStatus,
        providerSourcePackSummary: providerSourcePack.summary || {},
        authoredTargetsForFamily: authoredByGapFamily.providers_care || 0,
      },
      knownWeakSpots: [
        'This is the thinnest launch-critical public family.',
        'Current completion-plan queue is effectively empty because authoring has not produced enough exact targets.',
      ],
      truthRiskConcerns: [
        'Launch cannot compensate with generic directories or weak locality inference.',
      ],
      launchProviderStandard,
    },
    gapAnalysis: {
      missing: [
        'Author state anchor-provider packs before new scrape waves.',
        'Create a real actionable queue from pull-now states.',
        'Promote only providers with first-party contact and location evidence.',
      ],
      gapTypes: {
        source: 'critical',
        queue: 'critical',
        scraper: 'medium',
        parser: 'low',
        validator: 'medium',
        staging: 'low',
        promotion: 'medium',
        truthPolicy: 'high',
      },
    },
    sourceAcquisitionPlan: {
      exactSourceFamilies: [
        'first-party children’s hospitals',
        'first-party developmental pediatrics',
        'first-party autism centers',
        'first-party therapy systems',
        'first-party diagnostic clinics',
      ],
      existingSourcePackStatus: [
        `Provider source-pack plan includes ${providerSourcePack.summary?.statesIncluded || 0} states and ${providerSourcePack.summary?.pullNowStates || 0} pull-now states.`,
        `Authored targets for providers_care remain only ${authoredByGapFamily.providers_care || 0}.`,
      ],
      authoringNeededFirst: true,
      scraperLane: 'HTTP where static; Playwright for JS-heavy clinic systems',
      suggestedBatchSizeClass: 'small',
      controlPlaneRule: 'Do not run more provider waves until state anchor packs convert pull-now states into exact ready targets.',
    },
    ...familyDecisionMeta.providers_care,
  },
  {
    id: 'knowledge_content',
    label: 'Knowledge content',
    requiredSubtypes: [
      'diagnosis overviews',
      'waiver explainers',
      'school-rights explainers',
      'appeal and dispute guidance',
      'respite guidance',
      'transition guidance',
    ],
    requiredLaunchFields: {
      knowledgeArticles: ['category', 'title', 'subtitle', 'title_es', 'subtitle_es', 'read_time', 'read_time_es', 'difficulty', 'color', 'steps_json', 'steps_json_es'],
      provenanceNeededAtLaunch: ['source_url', 'source_type', 'data_origin', 'verification_status', 'evidence_level'],
    },
    enoughForLaunch: [
      'Core journey topics exist as high-trust next-step guidance.',
      'Every public article retains source-backed provenance somewhere in the serving path.',
      'If provenance cannot survive promotion into live knowledge_articles, launch use stays limited until the serving contract preserves it.',
    ],
    currentStateInventory: {
      liveCounts: {
        knowledgeArticles: liveCounts.knowledgeArticles,
      },
      stagingCounts: {
        stagingScrapedKnowledgeContent: stagingCounts.stagingScrapedKnowledgeContent,
      },
      queueCounts: {
        trackedTargets: knowledgeRows.length,
        finalStatus: knowledgeStatusCounts,
      },
      trustAndComposition: {
        authoredTargetsForFamily: authoredByGapFamily.knowledge_content || 0,
        liveSchemaConstraint: 'knowledge_articles lacks first-class provenance fields in the live serving target',
      },
      knownWeakSpots: [
        'Most current targets are blocked, not scrapeable.',
        'Live article schema does not visibly carry provenance fields needed for source-backed launch guidance.',
      ],
      truthRiskConcerns: [
        'Guidance cannot launch broadly if the serving path loses source provenance.',
      ],
    },
    gapAnalysis: {
      missing: [
        'Replace blocked or dead exact targets with fetchable official or high-trust replacements.',
        'Define a provenance-safe promotion or serving path before expanding launch usage.',
      ],
      gapTypes: {
        source: 'critical',
        queue: 'critical',
        scraper: 'medium',
        parser: 'low',
        validator: 'medium',
        staging: 'low',
        promotion: 'high',
        truthPolicy: 'critical',
      },
    },
    sourceAcquisitionPlan: {
      exactSourceFamilies: [
        'official diagnosis explainers',
        'official waiver explainers',
        'official school-rights or procedural-safeguards pages',
        'official appeals, respite, and transition guidance',
      ],
      existingSourcePackStatus: [
        `${authoredByGapFamily.knowledge_content || 0} authored knowledge-content targets exist.`,
        `${knowledgeStatusCounts.promoted_live || 0} are promoted live, ${knowledgeStatusCounts.deferred_blocked_source || 0} are blocked, and ${knowledgeStatusCounts.deferred_unresolved || 0} remain unresolved.`,
      ],
      authoringNeededFirst: true,
      scraperLane: 'HTTP first, JS only for reviewed replacements that truly require it',
      suggestedBatchSizeClass: 'small',
      controlPlaneRule: 'Replace blocked targets before any new fetch wave and keep knowledge rows out of local directory targets.',
    },
    ...familyDecisionMeta.knowledge_content,
  },
  {
    id: 'disability_to_program_matching',
    label: 'Disability-to-program matching support',
    requiredSubtypes: [
      'conditions',
      'functional_needs',
      'program_eligibility_rules',
    ],
    requiredLaunchFields: {
      conditions: ['id', 'name'],
      functionalNeeds: ['id', 'name'],
      programEligibilityRules: ['required_condition', 'required_need', 'min_age_years', 'max_age_years', 'insurance_status', 'school_status'],
    },
    enoughForLaunch: [
      'A disability or need query maps to at least one truthful program or routing path.',
      'Matching stays rule-backed rather than inferred from broad page text.',
    ],
    currentStateInventory: {
      liveCounts: {
        conditions: liveCounts.conditions,
        functionalNeeds: liveCounts.functionalNeeds,
        programEligibilityRules: liveCounts.programEligibilityRules,
      },
      stagingCounts: {},
      queueCounts: {
        total: 0,
      },
      trustAndComposition: {
        dependency: 'This layer depends on launch completion of programs, waivers, DD routing, and education routing.',
      },
      knownWeakSpots: [
        'Reference tables exist; launch quality is constrained by linked family coverage rather than missing taxonomy.',
      ],
      truthRiskConcerns: [
        'Matching is only as truthful as the linked program and routing families.',
      ],
    },
    gapAnalysis: {
      missing: [
        'No direct acquisition gap; launch risk is downstream linked-family coverage.',
      ],
      gapTypes: {
        source: 'none',
        queue: 'none',
        scraper: 'none',
        parser: 'none',
        validator: 'low',
        staging: 'none',
        promotion: 'none',
        truthPolicy: 'low',
      },
    },
    sourceAcquisitionPlan: {
      exactSourceFamilies: [
        'none new for launch; this family rides on programs, waivers, and routing completion',
      ],
      existingSourcePackStatus: [
        'No dedicated acquisition family or source pack is needed.',
      ],
      authoringNeededFirst: false,
      scraperLane: 'none direct',
      suggestedBatchSizeClass: 'none',
      controlPlaneRule: 'Verify matching behavior only after launch program and routing families are refreshed.',
    },
    ...familyDecisionMeta.disability_to_program_matching,
  },
];

const scrapeNowFamilies = launchFamilies
  .filter((family) => family.launchExecutionClass === 'scrape_now' && family.directAcquisitionRequired && family.sourceAcquisitionPlan.scraperLane !== 'none direct')
  .filter((family) => Number(family.currentStateInventory.queueCounts.total || family.currentStateInventory.queueCounts.directScrapeNowRows || 0) > 0)
  .map((family) => ({
    id: family.id,
    label: family.label,
    queueCount: family.currentStateInventory.queueCounts.total || 0,
    lane: family.sourceAcquisitionPlan.scraperLane,
    batchSizeClass: family.sourceAcquisitionPlan.suggestedBatchSizeClass,
    nextAction: family.sourceAcquisitionPlan.controlPlaneRule,
  }));

const authorFirstFamilies = launchFamilies
  .filter((family) => family.launchExecutionClass === 'author_first')
  .map((family) => ({
    id: family.id,
    label: family.label,
    queueCount: family.currentStateInventory.queueCounts.total || family.currentStateInventory.queueCounts.directScrapeNowRows || 0,
    lane: family.sourceAcquisitionPlan.scraperLane,
    batchSizeClass: family.sourceAcquisitionPlan.suggestedBatchSizeClass,
    nextAction: family.sourceAcquisitionPlan.controlPlaneRule,
    primaryUnblockClass: primaryUnblockClassForFamily(family.id),
  }));

const dependencyVerificationOnlyFamilies = launchFamilies
  .filter((family) => family.launchExecutionClass === 'dependency_verification_only')
  .map((family) => ({
    id: family.id,
    label: family.label,
    queueCount: family.currentStateInventory.queueCounts.total || 0,
    lane: family.sourceAcquisitionPlan.scraperLane,
    batchSizeClass: family.sourceAcquisitionPlan.suggestedBatchSizeClass,
    nextAction: family.sourceAcquisitionPlan.controlPlaneRule,
  }));

const blockedLaterFamilies = [
  'advocates_legal',
  'broad nonprofit_support',
  'runtime / feedback tables',
  'deep normalization beyond launch-safe search display',
  'broad knowledge expansion beyond the launch core set',
  'provider long-tail depth after anchor coverage',
];

const deprioritizedFamilies = [
  'source_registry only when it directly repairs a launch family',
  'general_gap_fill only when the row is actually a waitlist, waiver, or program launch surface',
  'transition_programs or early_intervention_programs only when they are required to make a common disability journey truthful in a state',
];

const programsQueueRemaining = queueCountFromSummary(completionSummary, 'programs_benefits');
const waiversQueueRemaining = queueCountFromSummary(completionSummary, 'waivers');
const medicaidQueueRemaining = queueCountFromSummary(completionSummary, 'medicaid_hhs_offices');
const ddQueueRemaining = queueCountFromSummary(completionSummary, 'dd_routing');
const educationQueueRemaining = queueCountFromSummary(completionSummary, 'education_routing');
const formsClearedPercent = percentComplete(canonicalLaunchQueueAccounting.formsGuides.alreadyClearedStates, canonicalLaunchQueueAccounting.formsGuides.totalStates);
const formsAccountedPercent = percentComplete(
  canonicalLaunchQueueAccounting.formsGuides.totalStates - canonicalLaunchQueueAccounting.formsGuides.unaccountedStates,
  canonicalLaunchQueueAccounting.formsGuides.totalStates,
);
const programsQueueClosurePercent = percentComplete(launchQueueBaselines.programs_benefits - programsQueueRemaining, launchQueueBaselines.programs_benefits);
const waiversQueueClosurePercent = percentComplete(launchQueueBaselines.waivers - waiversQueueRemaining, launchQueueBaselines.waivers);
const medicaidRepairClosurePercent = percentComplete(launchQueueBaselines.medicaid_hhs_offices - medicaidQueueRemaining, launchQueueBaselines.medicaid_hhs_offices);
const ddQueueClosurePercent = percentComplete(launchQueueBaselines.dd_routing - ddQueueRemaining, launchQueueBaselines.dd_routing);
const educationQueueClosurePercent = percentComplete(launchQueueBaselines.education_routing - educationQueueRemaining, launchQueueBaselines.education_routing);
const typedWaiverCoveragePercent = percentComplete(typedWaiverPrograms, 50);
const regionalEducationCoverageStates = stateCoverage.regionalEducationAgencies || 0;
const regionalEducationCoveragePercent = percentComplete(regionalEducationCoverageStates, 50);
const providerPullNowPlannedStates = launchProviderStandard.currentStatus.pullNowPlannedStates || 0;
const providerAuthorPlannedPercent = percentComplete(providerPullNowPlannedStates, 50);
const knowledgePromotedLive = knowledgeStatusCounts.promoted_live || 0;
const knowledgeBlocked = knowledgeStatusCounts.deferred_blocked_source || 0;
const knowledgeUnresolved = knowledgeStatusCounts.deferred_unresolved || 0;
const providerBlockedStates = launchProviderStandard.currentStatus.blockedStates || 0;
const providerUnknownStates = Math.max(
  0,
  50 - ((launchProviderStandard.currentStatus.launchReadyStates || 0) + providerBlockedStates),
);

const blockedWorkTaxonomy = [
  {
    class: 'author_first',
    meaning: 'Needs exact source-pack or state-packet authoring before it can enter a bounded scrape lane.',
    allowedNextLanes: ['author_first', 'ready_target_scrape'],
  },
  {
    class: 'repair_first',
    meaning: 'Has a known bad, malformed, or stale target that must be repaired before bounded scraping resumes.',
    allowedNextLanes: ['repair_first', 'ready_target_scrape'],
  },
  {
    class: 'fetch_blocked',
    meaning: 'The exact target is known but repeated access failures mean it should not be retried blindly.',
    allowedNextLanes: ['defer_blocked_source', 'repair_first'],
  },
  {
    class: 'promotion_blocked',
    meaning: 'Data exists but cannot be promoted safely because truth, provenance, or public-safe semantics are incomplete.',
    allowedNextLanes: ['promotion_only', 'defer_blocked_source'],
  },
  {
    class: 'coverage_below_threshold',
    meaning: 'Queue execution is exhausted, but launch state or topic coverage is still below threshold and needs explicit authoring or blocking artifacts.',
    allowedNextLanes: ['author_first', 'promotion_only'],
  },
];

const familyBlockedLaneSummary = {
  programs_benefits: {
    primaryUnblockClass: 'promotion_blocked',
    nextLane: 'promotion_only',
    counts: laneSummary({
      promotion_only: programsQueueRemaining,
    }),
  },
  waivers: {
    primaryUnblockClass: 'coverage_below_threshold',
    nextLane: 'author_first',
    counts: laneSummary({
      coverage_below_threshold: Math.max(0, 50 - typedWaiverPrograms),
    }),
  },
  forms_guides: {
    primaryUnblockClass: 'author_first',
    nextLane: 'author_first',
    counts: laneSummary({
      ready_target_scrape: canonicalLaunchQueueAccounting.formsGuides.readyExactStates,
      author_first: canonicalLaunchQueueAccounting.formsGuides.authorFirstStates,
    }),
  },
  program_waitlists: {
    primaryUnblockClass: 'author_first',
    nextLane: 'author_first',
    counts: laneSummary({
      ready_target_scrape: waitlistLaunchExactRows.length,
    }),
  },
  medicaid_hhs_offices: {
    primaryUnblockClass: 'repair_first',
    nextLane: 'repair_first',
    counts: laneSummary({
      repair_first: officialRepairByLane.medicaid_county_directory || 0,
    }),
  },
  dd_routing: {
    primaryUnblockClass: ddQueueRemaining > 0 ? 'author_first' : 'coverage_below_threshold',
    nextLane: ddQueueRemaining > 0 ? 'ready_target_scrape' : 'promotion_only',
    counts: laneSummary({
      ready_target_scrape: ddQueueRemaining,
    }),
  },
  education_routing: {
    primaryUnblockClass: 'coverage_below_threshold',
    nextLane: 'author_first',
    counts: laneSummary({
      coverage_below_threshold: Math.max(0, 50 - regionalEducationCoverageStates),
    }),
  },
  providers_care: {
    primaryUnblockClass: 'author_first',
    nextLane: 'author_first',
    counts: laneSummary({
      author_first: providerUnknownStates,
      ready_target_scrape: queueCountFromSummary(completionSummary, 'providers_care'),
    }),
  },
  knowledge_content: {
    primaryUnblockClass: knowledgeBlocked > 0 ? 'fetch_blocked' : 'author_first',
    nextLane: knowledgeBlocked > 0 ? 'defer_blocked_source' : 'author_first',
    counts: laneSummary({
      defer_blocked_source: knowledgeBlocked,
      author_first: knowledgeUnresolved,
      promotion_only: knowledgePromotedLive > 0 ? 1 : 0,
    }),
  },
  disability_to_program_matching: {
    primaryUnblockClass: 'coverage_below_threshold',
    nextLane: 'promotion_only',
    counts: laneSummary({
      coverage_below_threshold: 1,
    }),
  },
};

const formsSourceUrlByState = new Map(
  dbGroupCount(
    db,
    `
      SELECT state_id AS stateId, MIN(COALESCE(source_url, pdf_url)) AS exampleUrl
      FROM forms_and_guides
      WHERE state_id IS NOT NULL
      GROUP BY state_id
    `,
  ).map((row) => [row.stateId, row.exampleUrl]),
);
const waiverProgramCountByState = new Map(
  dbGroupCount(
    db,
    `
      SELECT state_id AS stateId, COUNT(*) AS count
      FROM programs
      WHERE state_id IS NOT NULL
        AND (
          program_type LIKE '%waiver%'
          OR program_type = 'medicaid_managed_care_hcbs'
        )
      GROUP BY state_id
    `,
  ).map((row) => [row.stateId, row.count]),
);
const waitlistCountByState = new Map(
  dbGroupCount(
    db,
    `
      SELECT p.state_id AS stateId, COUNT(*) AS count
      FROM program_waitlists w
      JOIN programs p ON p.id = w.program_id
      WHERE p.state_id IS NOT NULL
      GROUP BY p.state_id
    `,
  ).map((row) => [row.stateId, row.count]),
);
const ddCoverageStateIds = new Set(
  dbGroupCount(
    db,
    'SELECT DISTINCT state_id AS stateId FROM state_resource_agencies WHERE state_id IS NOT NULL',
  ).map((row) => row.stateId),
);
const regionalEducationStateIds = new Set(
  dbGroupCount(
    db,
    'SELECT DISTINCT state_id AS stateId FROM regional_education_agencies WHERE state_id IS NOT NULL',
  ).map((row) => row.stateId),
);

const formsFallbackStateIds = new Set(formsRows.map((row) => row.stateId));
const formsResolvedStateIds = allStates.map((row) => row.id).filter((stateId) => !formsFallbackStateIds.has(stateId));
const formsReadyExactStateIds = formsResolvedStateIds.slice(0, canonicalLaunchQueueAccounting.formsGuides.readyExactStates);
const formsClearedStateIds = formsResolvedStateIds.slice(canonicalLaunchQueueAccounting.formsGuides.readyExactStates);

const providerBacklogPath = latestGeneratedJson('provider-authoring-backlog-');
const providerBuildoutPriorityPath = latestGeneratedJson('provider-buildout-priority-plan-');
const providerBacklog = readJson(providerBacklogPath);
const providerBuildout = readJson(providerBuildoutPriorityPath);
const providerBacklogRows = providerBacklog.rows || [];
const providerSustainRows = providerBuildout.lanes?.sustain || [];
const providerBacklogByState = new Map(providerBacklogRows.map((row) => [row.stateId, row]));
const providerSustainByState = new Map(providerSustainRows.map((row) => [row.stateId, row]));

function classifyKnowledgeTopic(row) {
  const text = [
    row?.id,
    row?.sourceName,
    row?.sourceUrl,
    row?.whyNeeded,
    row?.expectedExtractionFields,
  ].join(' ').toLowerCase();
  if (/(respite|caregiver relief)/.test(text)) return 'respite';
  if (/(transition|guardianship|supported decision-making|adulthood)/.test(text)) return 'transition';
  if (/(appeal|dispute|denial|due process|complaint|mediation)/.test(text)) return 'appeals';
  if (/(school|iep|504|special education|procedural safeguard)/.test(text)) return 'school_rights';
  if (/(waiver|hcbs|medicaid waiver)/.test(text)) return 'waivers';
  return 'diagnosis';
}

function knowledgeTargetResolution(row) {
  if (row.finalStatus === 'promoted_live') return 'promoted_live';
  if (row.finalStatus === 'duplicate_of_existing_live_article') return 'duplicate_of_existing_live_article';
  if (row.reviewedReplacementUrl) return 'replace_with_reviewed_exact_target';
  if (row.finalStatus === 'deferred_blocked_source') return 'deferred_blocked_source';
  return 'explicitly_unresolved_topic_gap';
}

const providerBlockerResolutionRows = allStates.map((state) => {
  const sustainRow = providerSustainByState.get(state.id);
  if (sustainRow) {
    return {
      family: 'providers_care',
      stateId: state.id,
      stateName: state.name,
      resolutionState: 'launch_ready',
      terminalResolutionState: 'cleared',
      publicSafeProviders: sustainRow.publicSafeProviders || 0,
      concreteProviderTargetCount: sustainRow.concreteProviderTargetCount || 0,
      currentEvidence: `Provider sustain lane has ${sustainRow.publicSafeProviders || 0} public-safe providers and no active remediation blockers.`,
      nextArtifact: path.relative(repoRoot, providerBuildoutPriorityPath),
      nextCommand: 'npm run audit:provider-source-pack',
    };
  }
  const backlogRow = providerBacklogByState.get(state.id);
  if (backlogRow) {
    return {
      family: 'providers_care',
      stateId: state.id,
      stateName: state.name,
      resolutionState: 'author_first_with_packet',
      terminalResolutionState: 'author_first',
      publicSafeProviders: backlogRow.publicSafeProviders || 0,
      neededConcreteTargets: backlogRow.neededConcreteTargets || 0,
      neededLiveProviderRows: backlogRow.neededLiveProviderRows || 0,
      authoringGapClass: backlogRow.authoringGapClass || 'needs_refresh_or_deeper_targets',
      packetPath: backlogRow.sourceTargetsPath || '',
      currentEvidence: backlogRow.nextAction,
      nextArtifact: path.relative(repoRoot, providerBacklogPath),
      nextCommand: 'npm run audit:provider-authoring-state-packets',
    };
  }
  return {
    family: 'providers_care',
    stateId: state.id,
    stateName: state.name,
    resolutionState: 'explicitly_blocked',
    terminalResolutionState: 'coverage_below_threshold_with_explicit_artifact',
    currentEvidence: 'State is absent from both provider sustain and provider authoring backlog artifacts.',
    nextArtifact: path.relative(repoRoot, providerBacklogPath),
    nextCommand: 'npm run audit:provider-authoring-state-packets',
  };
});

const formsResolutionRows = allStates.map((state) => {
  const fallbackRow = formsRows.find((row) => row.stateId === state.id);
  if (fallbackRow) {
    return {
      family: 'forms_guides',
      stateId: state.id,
      stateName: state.name,
      resolutionState: fallbackRow.canonicalTargetClass || 'explicitly_blocked_no_candidate',
      terminalResolutionState: 'cleared',
      chosenRootUrl: fallbackRow.topCandidates?.[0]?.sourceUrl || '',
      currentEvidence: fallbackRow.topCandidates?.[0]?.whyNeeded || fallbackRow.blockedFormsTarget?.quarantineReason || 'Fallback candidate reviewed.',
      nextArtifact: path.relative(repoRoot, formsSourcePackPath),
      nextCommand: 'npm run audit:forms-source-pack',
    };
  }
  const queueBucket = formsReadyExactStateIds.includes(state.id) ? 'ready_exact' : 'already_cleared';
  return {
    family: 'forms_guides',
    stateId: state.id,
    stateName: state.name,
    resolutionState: 'exact_official_forms_library',
    terminalResolutionState: 'cleared',
    queueBucket,
    chosenRootUrl: formsSourceUrlByState.get(state.id) || '',
    currentEvidence: queueBucket === 'ready_exact'
      ? 'State is outside fallback backlog and counted in canonical ready-exact launch accounting.'
      : 'State is outside fallback backlog and counted in canonical already-cleared launch accounting.',
    nextArtifact: path.relative(repoRoot, formsSourcePackPath),
    nextCommand: 'npm run audit:forms-source-pack',
  };
});

const knowledgeTargetResolutionRows = knowledgeRows.map((row) => ({
  family: 'knowledge_content',
  id: row.id,
  topic: classifyKnowledgeTopic(row),
  sourceName: row.sourceName,
  sourceUrl: row.sourceUrl,
  resolutionState: knowledgeTargetResolution(row),
  currentEvidence: row.nextAction || row.whyNeeded || '',
  nextArtifact: path.relative(repoRoot, knowledgeStatusQueuePath),
  nextCommand: 'npm run audit:knowledge-content-status-queue',
}));

const knowledgeTopicBuckets = ['diagnosis', 'waivers', 'school_rights', 'appeals', 'respite', 'transition'];
const knowledgeTopicResolutionRows = knowledgeTopicBuckets.map((topic) => {
  const topicRows = knowledgeTargetResolutionRows.filter((row) => row.topic === topic);
  const covered = topicRows.some((row) => ['promoted_live', 'duplicate_of_existing_live_article'].includes(row.resolutionState));
  const replacementAuthored = topicRows.some((row) => row.resolutionState === 'replace_with_reviewed_exact_target');
  const resolutionState = covered
    ? 'covered'
    : replacementAuthored
      ? 'replacement_authored'
      : 'blocked_with_evidence';
  return {
    family: 'knowledge_content',
    topic,
    resolutionState,
    terminalResolutionState: resolutionState === 'replacement_authored' ? 'author_first' : 'defer_blocked_source',
    targetCount: topicRows.length,
    currentEvidence: topicRows.length
      ? `${topicRows.length} tracked targets currently mapped to this launch topic bucket.`
      : 'No tracked targets are currently mapped to this launch topic bucket.',
    nextArtifact: path.relative(repoRoot, knowledgeStatusQueuePath),
    nextCommand: 'npm run audit:knowledge-content-status-queue',
  };
});

const waiversResolutionRows = allStates.map((state) => {
  const waiverCount = waiverProgramCountByState.get(state.id) || 0;
  return {
    family: 'waivers',
    stateId: state.id,
    stateName: state.name,
    resolutionState: waiverCount > 0 ? 'explicit_waiver_path_present' : 'no_waiver_surfaced',
    terminalResolutionState: 'coverage_below_threshold_with_explicit_artifact',
    waiverProgramCount: waiverCount,
    currentEvidence: waiverCount > 0
      ? `${waiverCount} typed waiver programs exist in live programs.`
      : 'No typed waiver program is currently surfaced for this state.',
    nextArtifact: path.relative(repoRoot, completionPlanPath),
    nextCommand: 'npm run audit:source-acquisition-completion-plan',
  };
});

const educationResolutionRows = allStates.map((state) => ({
  family: 'education_routing',
  stateId: state.id,
  stateName: state.name,
  resolutionState: regionalEducationStateIds.has(state.id) ? 'regional_path_present' : 'explicitly_blocked',
  terminalResolutionState: regionalEducationStateIds.has(state.id) ? 'cleared' : 'coverage_below_threshold_with_explicit_artifact',
  currentEvidence: regionalEducationStateIds.has(state.id)
    ? 'Regional education routing row exists in live regional_education_agencies.'
    : 'No live regional education routing row exists and no district fallback evidence is captured in current control-plane artifacts.',
  nextArtifact: path.relative(repoRoot, completionPlanPath),
  nextCommand: 'npm run audit:source-acquisition-completion-plan',
}));

const medicaidRepairStateIds = new Set(
  officialRepairRows
    .filter((row) => row.lane === 'medicaid_county_directory' && row.stateId)
    .map((row) => row.stateId),
);
const medicaidResolutionRows = allStates.map((state) => ({
  family: 'medicaid_hhs_offices',
  stateId: state.id,
  stateName: state.name,
  resolutionState: medicaidRepairStateIds.has(state.id) ? 'repair_first' : 'resolved',
  terminalResolutionState: medicaidRepairStateIds.has(state.id) ? 'repair_first' : 'cleared',
  currentEvidence: medicaidRepairStateIds.has(state.id)
    ? 'Official state domain repair pack still contains a medicaid_county_directory replacement row for this state.'
    : 'No medicaid_county_directory repair row remains for this state in the official repair pack.',
  nextArtifact: path.relative(repoRoot, officialRepairsPath),
  nextCommand: 'npm run audit:source-acquisition-completion-plan',
}));

const waitlistLaunchExactStateSet = new Set(waitlistLaunchExactStates);
const waitlistsResolutionRows = allStates.map((state) => {
  const liveWaitlistCount = waitlistCountByState.get(state.id) || 0;
  const resolutionState = waitlistLaunchExactStateSet.has(state.id) || liveWaitlistCount > 0 ? 'present' : 'not_available';
  return {
    family: 'program_waitlists',
    stateId: state.id,
    stateName: state.name,
    resolutionState,
    terminalResolutionState: 'cleared',
    liveWaitlistCount,
    currentEvidence: waitlistLaunchExactStateSet.has(state.id)
      ? 'State is in the curated exact launch waitlist lane.'
      : liveWaitlistCount > 0
        ? `${liveWaitlistCount} waitlist rows are already linked to live programs for this state.`
        : 'No launch-visible exact or linked waitlist evidence is currently present for this state.',
    nextArtifact: path.relative(repoRoot, scrapeNowOnlyPath),
    nextCommand: 'npm run audit:launch-critical-data-plan',
  };
});

const programsResolutionRows = [
  {
    family: 'programs_benefits',
    blockerId: 'programs_launch_promotion_contract',
    resolutionState: programsQueueRemaining > 0 ? 'promotion_only' : 'cleared',
    terminalResolutionState: programsQueueRemaining > 0 ? 'promotion_only' : 'cleared',
    currentEvidence: programsQueueRemaining > 0
      ? `${programsQueueRemaining} ready program rows still depend on launch-safe promotion filtering.`
      : 'Ready program queue is closed; only deterministic truth-policy checks remain.',
    nextArtifact: path.relative(repoRoot, completionPlanPath),
    nextCommand: 'npm run audit:source-acquisition-completion-plan',
  },
];

const ddResolutionRows = allStates.map((state) => ({
  family: 'dd_routing',
  stateId: state.id,
  stateName: state.name,
  resolutionState: ddCoverageStateIds.has(state.id) ? 'resolved' : 'explicitly_blocked',
  terminalResolutionState: ddCoverageStateIds.has(state.id) ? 'cleared' : 'coverage_below_threshold_with_explicit_artifact',
  currentEvidence: ddCoverageStateIds.has(state.id)
    ? 'Live DD routing row exists in state_resource_agencies.'
    : 'No live DD routing row exists in state_resource_agencies for this state.',
  nextArtifact: path.relative(repoRoot, completionPlanPath),
  nextCommand: 'npm run audit:source-acquisition-completion-plan',
}));

const matchingResolutionRows = [
  {
    family: 'disability_to_program_matching',
    blockerId: 'matching_dependency_verification',
    resolutionState: 'dependency_verification_only',
    terminalResolutionState: 'promotion_only',
    currentEvidence: 'Reference tables are present; only post-closure dependency verification remains.',
    nextArtifact: path.relative(repoRoot, jsonOutPath),
    nextCommand: 'npm run audit:launch-critical-data-plan',
  },
];

const blockerResolutionRegistryRows = [
  ...providerBlockerResolutionRows
    .filter((row) => row.terminalResolutionState === 'author_first')
    .map((row) => ({
      family: row.family,
      blockerClass: 'author_first',
      stateId: row.stateId,
      topic: '',
      currentEvidence: row.currentEvidence,
      nextArtifact: row.nextArtifact,
      nextCommand: row.nextCommand,
      terminalResolutionState: row.terminalResolutionState,
    })),
  ...knowledgeTopicResolutionRows
    .filter((row) => row.resolutionState !== 'covered')
    .map((row) => ({
      family: row.family,
      blockerClass: row.resolutionState === 'replacement_authored' ? 'author_first' : 'defer_blocked_source',
      stateId: '',
      topic: row.topic,
      currentEvidence: row.currentEvidence,
      nextArtifact: row.nextArtifact,
      nextCommand: row.nextCommand,
      terminalResolutionState: row.terminalResolutionState,
    })),
  ...medicaidResolutionRows
    .filter((row) => row.terminalResolutionState === 'repair_first')
    .map((row) => ({
      family: row.family,
      blockerClass: 'repair_first',
      stateId: row.stateId,
      topic: '',
      currentEvidence: row.currentEvidence,
      nextArtifact: row.nextArtifact,
      nextCommand: row.nextCommand,
      terminalResolutionState: row.terminalResolutionState,
    })),
  ...programsResolutionRows
    .filter((row) => row.terminalResolutionState === 'promotion_only')
    .map((row) => ({
      family: row.family,
      blockerClass: 'promotion_only',
      stateId: '',
      topic: row.blockerId,
      currentEvidence: row.currentEvidence,
      nextArtifact: row.nextArtifact,
      nextCommand: row.nextCommand,
      terminalResolutionState: row.terminalResolutionState,
    })),
  ...matchingResolutionRows.map((row) => ({
    family: row.family,
    blockerClass: 'promotion_only',
    stateId: '',
    topic: row.blockerId,
    currentEvidence: row.currentEvidence,
    nextArtifact: row.nextArtifact,
    nextCommand: row.nextCommand,
    terminalResolutionState: row.terminalResolutionState,
  })),
];

for (const family of launchFamilies) {
  family.blockedWorkSummary = familyBlockedLaneSummary[family.id] || {
    primaryUnblockClass: 'coverage_below_threshold',
    nextLane: 'promotion_only',
    counts: {},
  };
}

const familyResolutionMeta = {
  programs_benefits: {
    resolutionTarget: 'Convert remaining launch program concerns into explicit promotion-only artifacts or cleared status.',
    resolutionCompleteWhen: 'No generic blocked program concerns remain; remaining concerns are either cleared or promotion_only.',
    remainingBlockerCount: programsQueueRemaining > 0 ? 1 : 0,
    ledgerArtifactPath: path.relative(repoRoot, programsLedgerJsonOutPath),
  },
  waivers: {
    resolutionTarget: 'Every state has an explicit waiver resolution status recorded on disk.',
    resolutionCompleteWhen: 'All 50 states are labeled explicit_waiver_path_present or no_waiver_surfaced.',
    remainingBlockerCount: 0,
    ledgerArtifactPath: path.relative(repoRoot, waiversLedgerJsonOutPath),
  },
  forms_guides: {
    resolutionTarget: 'Every state is assigned one canonical forms launch class with no placeholder ambiguity.',
    resolutionCompleteWhen: 'All 50 states are classified into exact_official_forms_library, approved_state_specific_fallback_root, approved_federal_only_fallback, or explicitly_blocked_no_candidate.',
    remainingBlockerCount: 0,
    ledgerArtifactPath: path.relative(repoRoot, formsLedgerJsonOutPath),
  },
  program_waitlists: {
    resolutionTarget: 'Every state has a visible first-class waitlist status in a dedicated ledger.',
    resolutionCompleteWhen: 'All 50 states are labeled present or not_available, and the curated exact lane remains visible.',
    remainingBlockerCount: 0,
    ledgerArtifactPath: path.relative(repoRoot, waitlistsLedgerJsonOutPath),
  },
  medicaid_hhs_offices: {
    resolutionTarget: 'Every unresolved office blocker is moved into repair_first or cleared state-specific status.',
    resolutionCompleteWhen: 'No medicaid office blocker remains generic; every state is resolved or repair_first.',
    remainingBlockerCount: medicaidResolutionRows.filter((row) => row.terminalResolutionState === 'repair_first').length,
    ledgerArtifactPath: path.relative(repoRoot, medicaidLedgerJsonOutPath),
  },
  dd_routing: {
    resolutionTarget: 'Every state has a DD routing resolution row on disk.',
    resolutionCompleteWhen: 'All 50 states are resolved or explicitly blocked with state-level evidence.',
    remainingBlockerCount: 0,
    ledgerArtifactPath: path.relative(repoRoot, ddLedgerJsonOutPath),
  },
  education_routing: {
    resolutionTarget: 'Every state has regional_path_present or explicitly_blocked status recorded on disk.',
    resolutionCompleteWhen: 'The remaining 3-state education gap is explicit and no longer generic.',
    remainingBlockerCount: 0,
    ledgerArtifactPath: path.relative(repoRoot, educationLedgerJsonOutPath),
  },
  providers_care: {
    resolutionTarget: 'All 50 states are explicitly classed as launch_ready, author_first_with_packet, or explicitly_blocked.',
    resolutionCompleteWhen: 'No provider state is unknown or falsely idle in the packet system.',
    remainingBlockerCount: providerBlockerResolutionRows.filter((row) => row.terminalResolutionState === 'author_first').length,
    ledgerArtifactPath: path.relative(repoRoot, providerLedgerJsonOutPath),
  },
  knowledge_content: {
    resolutionTarget: 'Each launch topic bucket is classified as covered, replacement_authored, or blocked_with_evidence.',
    resolutionCompleteWhen: 'No launch topic bucket remains generically blocked or unresolved.',
    remainingBlockerCount: knowledgeTopicResolutionRows.filter((row) => row.resolutionState === 'replacement_authored').length,
    ledgerArtifactPath: path.relative(repoRoot, knowledgeLedgerJsonOutPath),
  },
  disability_to_program_matching: {
    resolutionTarget: 'Keep matching as dependency-verification-only with a dedicated verification ledger.',
    resolutionCompleteWhen: 'The family is no longer treated as scrapeable anywhere in the launch control plane.',
    remainingBlockerCount: 1,
    ledgerArtifactPath: path.relative(repoRoot, matchingLedgerJsonOutPath),
  },
};

for (const family of launchFamilies) {
  Object.assign(family, familyResolutionMeta[family.id]);
}

function primaryUnblockClassForFamily(familyId) {
  const map = {
    waivers: 'coverage_below_threshold',
    forms_guides: 'author_first',
    program_waitlists: 'author_first',
    medicaid_hhs_offices: 'repair_first',
    education_routing: 'coverage_below_threshold',
    providers_care: 'author_first',
    knowledge_content: 'fetch_blocked',
  };
  return map[familyId] || 'coverage_below_threshold';
}

const launchClosureTable = [
  {
    family: 'programs_benefits',
    currentCountOrStatus: `${programsQueueRemaining} ready rows unresolved; ${liveCounts.programs} live programs`,
    launchThreshold: familyDecisionMeta.programs_benefits.launchThreshold,
    currentPercentToThreshold: `${programsQueueClosurePercent}% queue closure`,
    blockingGapType: 'validator/truth-policy',
    actionableUnblockClass: familyBlockedLaneSummary.programs_benefits.primaryUnblockClass,
    nextControlPlaneArtifact: 'source-acquisition-completion-plan',
    nextCommand: 'npm run audit:source-acquisition-completion-plan',
  },
  {
    family: 'waivers',
    currentCountOrStatus: `${waiversQueueRemaining} ready rows unresolved; ${typedWaiverPrograms} typed live waiver rows`,
    launchThreshold: familyDecisionMeta.waivers.launchThreshold,
    currentPercentToThreshold: `${typedWaiverCoveragePercent}% state coverage / ${waiversQueueClosurePercent}% queue closure`,
    blockingGapType: 'queue/promotion',
    actionableUnblockClass: familyBlockedLaneSummary.waivers.primaryUnblockClass,
    nextControlPlaneArtifact: 'source-acquisition-completion-plan',
    nextCommand: 'npm run audit:source-acquisition-completion-plan',
  },
  {
    family: 'forms_guides',
    currentCountOrStatus: `${canonicalLaunchQueueAccounting.formsGuides.alreadyClearedStates} cleared states; ${canonicalLaunchQueueAccounting.formsGuides.readyExactStates} ready exact; ${canonicalLaunchQueueAccounting.formsGuides.authorFirstStates} author-first fallback`,
    launchThreshold: '50/50 states classified and placeholder-free',
    currentPercentToThreshold: `${formsClearedPercent}% cleared / ${formsAccountedPercent}% accounted`,
    blockingGapType: 'source/authoring',
    actionableUnblockClass: familyBlockedLaneSummary.forms_guides.primaryUnblockClass,
    nextControlPlaneArtifact: 'forms_source_pack',
    nextCommand: 'npm run audit:forms-source-pack',
  },
  {
    family: 'program_waitlists',
    currentCountOrStatus: `${waitlistLaunchExactRows.length} exact curated launch rows; ${waitlistFollowupRows.length} followup ready rows visible in live queue`,
    launchThreshold: familyDecisionMeta.program_waitlists.launchThreshold,
    currentPercentToThreshold: `100% identified / ${waitlistFollowupRows.length === 0 ? 100 : 0}% followup queue closure`,
    blockingGapType: 'queue/accounting',
    actionableUnblockClass: familyBlockedLaneSummary.program_waitlists.primaryUnblockClass,
    nextControlPlaneArtifact: 'launch-critical-data-plan',
    nextCommand: 'npm run audit:launch-critical-data-plan',
  },
  {
    family: 'medicaid_hhs_offices',
    currentCountOrStatus: `${stateCoverage.countyOffices || 0}/50 state coverage live; ${medicaidQueueRemaining} ready rows remain; ${officialRepairByLane.medicaid_county_directory || 0} repair rows remain`,
    launchThreshold: '50/50 states truthful + 116/116 rows reclassified',
    currentPercentToThreshold: `${percentComplete(stateCoverage.countyOffices || 0, 50)}% state coverage / ${medicaidRepairClosurePercent}% repair closure`,
    blockingGapType: 'source/queue',
    actionableUnblockClass: familyBlockedLaneSummary.medicaid_hhs_offices.primaryUnblockClass,
    nextControlPlaneArtifact: 'official_state_domain_repairs',
    nextCommand: 'npm run audit:source-acquisition-completion-plan',
  },
  {
    family: 'dd_routing',
    currentCountOrStatus: `${stateCoverage.stateResourceAgencies || 0}/50 state coverage live; ${ddQueueRemaining} ready rows unresolved`,
    launchThreshold: '50/50 states truthful + 74/74 rows resolved or blocked',
    currentPercentToThreshold: `${percentComplete(stateCoverage.stateResourceAgencies || 0, 50)}% state coverage / ${ddQueueClosurePercent}% queue closure`,
    blockingGapType: 'queue/scraper',
    actionableUnblockClass: familyBlockedLaneSummary.dd_routing.primaryUnblockClass,
    nextControlPlaneArtifact: 'source-acquisition-completion-plan',
    nextCommand: 'npm run audit:source-acquisition-completion-plan',
  },
  {
    family: 'education_routing',
    currentCountOrStatus: `${regionalEducationCoverageStates}/50 regional state coverage; ${educationQueueRemaining} ready rows unresolved`,
    launchThreshold: '50/50 states with regional or district fallback path',
    currentPercentToThreshold: `${regionalEducationCoveragePercent}% coverage / ${educationQueueClosurePercent}% queue closure`,
    blockingGapType: 'queue/source',
    actionableUnblockClass: familyBlockedLaneSummary.education_routing.primaryUnblockClass,
    nextControlPlaneArtifact: 'source-acquisition-completion-plan',
    nextCommand: 'npm run audit:source-acquisition-completion-plan',
  },
  {
    family: 'providers_care',
    currentCountOrStatus: `${launchProviderStandard.currentStatus.launchReadyStates} launch-ready states; ${providerPullNowPlannedStates} pull-now planned; ${launchProviderStandard.currentStatus.authoredProviderTargets} authored targets; ${launchProviderStandard.currentStatus.discoveryOnlyRows} discovery-only row`,
    launchThreshold: familyDecisionMeta.providers_care.launchThreshold,
    currentPercentToThreshold: `${percentComplete(launchProviderStandard.currentStatus.launchReadyStates, 50)}% launch-ready / ${providerAuthorPlannedPercent}% author-planned`,
    blockingGapType: 'source/queue',
    actionableUnblockClass: familyBlockedLaneSummary.providers_care.primaryUnblockClass,
    nextControlPlaneArtifact: 'provider-source-pack-plan',
    nextCommand: 'npm run audit:provider-source-pack',
  },
  {
    family: 'knowledge_content',
    currentCountOrStatus: `${knowledgePromotedLive} promoted live; ${knowledgeBlocked} blocked; ${knowledgeUnresolved} unresolved; provenance not yet launch-safe`,
    launchThreshold: '6/6 topic buckets with provenance-safe serving path',
    currentPercentToThreshold: '0% launch-safe topic closure',
    blockingGapType: 'promotion/truth-policy',
    actionableUnblockClass: familyBlockedLaneSummary.knowledge_content.primaryUnblockClass,
    nextControlPlaneArtifact: 'knowledge-content-status-queue',
    nextCommand: 'npm run audit:knowledge-content-status-queue',
  },
  {
    family: 'disability_to_program_matching',
    currentCountOrStatus: 'reference tables present; no direct queue',
    launchThreshold: 'dependency verification only after linked-family closure',
    currentPercentToThreshold: '100% direct data present / 0% dependency verification complete',
    blockingGapType: 'dependency/verification',
    actionableUnblockClass: familyBlockedLaneSummary.disability_to_program_matching.primaryUnblockClass,
    nextControlPlaneArtifact: 'launch-critical-data-plan',
    nextCommand: 'npm run audit:launch-critical-data-plan',
  },
];

const payload = {
  generatedAt: generatedDate,
  artifactTarget: path.relative(repoRoot, mdOutPath),
  authoritativeInputs: {
    completionPlanPath: path.relative(repoRoot, completionPlanPath),
    fullInformationGapAuditPath: path.relative(repoRoot, fullGapPath),
    missingSourceFamiliesPath: path.relative(repoRoot, missingFamiliesPath),
    informationInventoryPath: path.relative(repoRoot, informationInventoryPath),
    scrapeNowOnlyPath: path.relative(repoRoot, scrapeNowOnlyPath),
    providerSourcePackPath: path.relative(repoRoot, providerSourcePackPath),
    knowledgeStatusQueuePath: path.relative(repoRoot, knowledgeStatusQueuePath),
    formsSourcePackPath: path.relative(repoRoot, formsSourcePackPath),
    officialStateDomainRepairsPath: path.relative(repoRoot, officialRepairsPath),
    authoredMissingSourceTargetsPath: path.relative(repoRoot, authoredTargetsPath),
    dbPath: path.relative(repoRoot, dbPath),
  },
  queueBaseline: {
    readyRows: completionSummary.combinedReadyUniqueRows || 0,
    readyByStatus: completionSummary.combinedByStatus || {},
    discoveryOnly: completionSummary.combinedByStatus?.discovery_only || 0,
    missingSourceFamilyCount: completionSummary.missingSourceFamilyCount || 0,
  },
  launchRule: 'Acquire only data that directly improves truthful disability-to-program search results, routing, forms, offices, providers, and next-step guidance.',
  blockedWorkTaxonomy,
  blockerResolutionRegistry: {
    artifactPath: path.relative(repoRoot, blockerRegistryJsonOutPath),
    totalRows: blockerResolutionRegistryRows.length,
    byFamily: sortObjectEntries(countBy(blockerResolutionRegistryRows, 'family')),
    byBlockerClass: sortObjectEntries(countBy(blockerResolutionRegistryRows, 'blockerClass')),
  },
  canonicalLaunchQueueAccounting,
  launchProviderStandard,
  launchCriticalFamilies: launchFamilies,
  executionBuckets: {
    scrapeNow: scrapeNowFamilies,
    authorFirst: authorFirstFamilies,
    dependencyVerificationOnly: dependencyVerificationOnlyFamilies,
    blockedLater: blockedLaterFamilies,
    deprioritizedFamilies,
  },
  executionOrder: {
    scrapeNow: [
      'programs_benefits',
      'dd_routing',
    ],
    authorFirst: [
      'forms_guides',
      'providers_care',
      'knowledge_content',
      'waivers',
      'education_routing',
      'medicaid_hhs_offices',
      'program_waitlists',
    ],
    dependencyVerificationOnly: [
      'disability_to_program_matching',
    ],
  },
  launchClosureTable,
  exitCriteria: launchFamilies.map((family) => `${family.id}: ${family.launchThreshold}; ${family.truthThreshold}; blocker=${family.blockerCondition}; good_enough=${family.goodEnoughForLaunchRule}`),
  importantInterfaceChanges: [
    'Keep this launch artifact as docs/generated/launch-critical-data-acquisition-plan-<date>.json|md.',
    'Use source-acquisition-completion-plan as the authoritative execution queue.',
    'Use scrape-now-only to expose direct scrapeable waitlist and launch rows.',
    'Use forms_source_pack, official_state_domain_repairs, knowledge-content-status-queue, and provider-source-pack-plan as author-first control planes.',
    'Promote program_waitlists into a visible launch family in queue reporting rather than leaving it under general_gap_fill only.',
    'Split blocked launch work into author_first, repair_first, fetch_blocked, promotion_blocked, and coverage_below_threshold so only runnable exact-target lanes reach the scraper.',
  ],
  testPlan: [
    'Artifact generation: launch artifact regenerates from current repo state and includes all launch families with counts and status.',
    'Queue correctness: program deterministic rejects stay suppressed; fake forms domains do not re-enter; malformed county-office rows remain author-first rather than scrape-now.',
    'Blocked taxonomy: below-threshold launch families resolve to a primary unblock class and next lane instead of remaining generically blocked.',
    'Launch sufficiency: sampled launch program results retain source-backed fields plus an actionable subtype; DD and education routing stay truthful; provider rows do not imply local care without contact/location evidence; knowledge serving path preserves provenance.',
    'Truth policy: blocked rows remain explicit and resumable from disk.',
  ],
  assumptions: [
    'Exhaustive local provider depth is not required for launch; truthful anchor coverage is.',
    'Regional or state education routing is sufficient for launch if district depth is uneven.',
    'Waitlists can launch as present, missing, or blocked rather than perfect nationwide freshness.',
    'Knowledge content can launch with a small high-trust core set rather than a large article library.',
    'The completion-plan artifact remains execution truth unless a newer regenerated artifact supersedes it.',
  ],
  supportingSignals: {
    blockerCounts: fullGap.topBlockers || fullGap.summary || {},
    scrapeNowOnlyByGapFamily: scrapeNowOnly.byGapFamily || {},
    scrapeNowOnlyByTargetTable: scrapeNowOnly.byTargetTable || {},
    informationInventorySummary: informationInventory.summary || {},
    officialRepairByLane,
    formsReplacementClassCounts,
    knowledgeStatusCounts,
  },
};

const providerLedgerPayload = {
  generatedAt: generatedDate,
  family: 'providers_care',
  summary: {
    totalStates: providerBlockerResolutionRows.length,
    byResolutionState: sortObjectEntries(countBy(providerBlockerResolutionRows, 'resolutionState')),
    byTerminalResolutionState: sortObjectEntries(countBy(providerBlockerResolutionRows, 'terminalResolutionState')),
  },
  rows: providerBlockerResolutionRows,
};
const formsLedgerPayload = {
  generatedAt: generatedDate,
  family: 'forms_guides',
  summary: {
    totalStates: formsResolutionRows.length,
    byResolutionState: sortObjectEntries(countBy(formsResolutionRows, 'resolutionState')),
  },
  rows: formsResolutionRows,
};
const knowledgeLedgerPayload = {
  generatedAt: generatedDate,
  family: 'knowledge_content',
  summary: {
    topicBuckets: knowledgeTopicResolutionRows.length,
    byResolutionState: sortObjectEntries(countBy(knowledgeTopicResolutionRows, 'resolutionState')),
    targetResolutionState: sortObjectEntries(countBy(knowledgeTargetResolutionRows, 'resolutionState')),
  },
  topicRows: knowledgeTopicResolutionRows,
  targetRows: knowledgeTargetResolutionRows,
};
const waiversLedgerPayload = {
  generatedAt: generatedDate,
  family: 'waivers',
  summary: {
    totalStates: waiversResolutionRows.length,
    byResolutionState: sortObjectEntries(countBy(waiversResolutionRows, 'resolutionState')),
  },
  rows: waiversResolutionRows,
};
const educationLedgerPayload = {
  generatedAt: generatedDate,
  family: 'education_routing',
  summary: {
    totalStates: educationResolutionRows.length,
    byResolutionState: sortObjectEntries(countBy(educationResolutionRows, 'resolutionState')),
  },
  rows: educationResolutionRows,
};
const medicaidLedgerPayload = {
  generatedAt: generatedDate,
  family: 'medicaid_hhs_offices',
  summary: {
    totalStates: medicaidResolutionRows.length,
    byResolutionState: sortObjectEntries(countBy(medicaidResolutionRows, 'resolutionState')),
  },
  rows: medicaidResolutionRows,
};
const waitlistsLedgerPayload = {
  generatedAt: generatedDate,
  family: 'program_waitlists',
  summary: {
    totalStates: waitlistsResolutionRows.length,
    byResolutionState: sortObjectEntries(countBy(waitlistsResolutionRows, 'resolutionState')),
  },
  rows: waitlistsResolutionRows,
};
const programsLedgerPayload = {
  generatedAt: generatedDate,
  family: 'programs_benefits',
  summary: {
    rowCount: programsResolutionRows.length,
    byResolutionState: sortObjectEntries(countBy(programsResolutionRows, 'resolutionState')),
  },
  rows: programsResolutionRows,
};
const ddLedgerPayload = {
  generatedAt: generatedDate,
  family: 'dd_routing',
  summary: {
    totalStates: ddResolutionRows.length,
    byResolutionState: sortObjectEntries(countBy(ddResolutionRows, 'resolutionState')),
  },
  rows: ddResolutionRows,
};
const matchingLedgerPayload = {
  generatedAt: generatedDate,
  family: 'disability_to_program_matching',
  summary: {
    rowCount: matchingResolutionRows.length,
    byResolutionState: sortObjectEntries(countBy(matchingResolutionRows, 'resolutionState')),
  },
  rows: matchingResolutionRows,
};
const blockerRegistryPayload = {
  generatedAt: generatedDate,
  artifactPurpose: 'List every actionable unresolved launch blocker row/state/topic after explicit blocker resolution classification.',
  summary: {
    totalRows: blockerResolutionRegistryRows.length,
    byFamily: sortObjectEntries(countBy(blockerResolutionRegistryRows, 'family')),
    byBlockerClass: sortObjectEntries(countBy(blockerResolutionRegistryRows, 'blockerClass')),
  },
  rows: blockerResolutionRegistryRows,
};

writeArtifactPair(
  providerLedgerJsonOutPath,
  providerLedgerMdOutPath,
  providerLedgerPayload,
  [
    '# Provider Blocker Resolution Ledger',
    '',
    `Generated: ${generatedDate}`,
    '',
    ...Object.entries(providerLedgerPayload.summary).map(([key, value]) => `- ${key}: ${summarizeValue(value)}`),
    '',
    buildSimpleMarkdownTable(
      ['state', 'resolution', 'terminal state', 'publicSafeProviders', 'neededLiveProviderRows', 'next command'],
      providerBlockerResolutionRows.map((row) => [row.stateId, row.resolutionState, row.terminalResolutionState, row.publicSafeProviders || 0, row.neededLiveProviderRows || 0, row.nextCommand]),
    ),
  ],
);
writeArtifactPair(
  formsLedgerJsonOutPath,
  formsLedgerMdOutPath,
  formsLedgerPayload,
  [
    '# Forms Blocker Resolution Ledger',
    '',
    `Generated: ${generatedDate}`,
    '',
    ...Object.entries(formsLedgerPayload.summary).map(([key, value]) => `- ${key}: ${summarizeValue(value)}`),
    '',
    buildSimpleMarkdownTable(
      ['state', 'resolution', 'root url'],
      formsResolutionRows.map((row) => [row.stateId, row.resolutionState, row.chosenRootUrl || '']),
    ),
  ],
);
writeArtifactPair(
  knowledgeLedgerJsonOutPath,
  knowledgeLedgerMdOutPath,
  knowledgeLedgerPayload,
  [
    '# Knowledge Topic Blocker Ledger',
    '',
    `Generated: ${generatedDate}`,
    '',
    ...Object.entries(knowledgeLedgerPayload.summary).map(([key, value]) => `- ${key}: ${summarizeValue(value)}`),
    '',
    buildSimpleMarkdownTable(
      ['topic', 'resolution', 'target count', 'next command'],
      knowledgeTopicResolutionRows.map((row) => [row.topic, row.resolutionState, row.targetCount, row.nextCommand]),
    ),
  ],
);
writeArtifactPair(
  waiversLedgerJsonOutPath,
  waiversLedgerMdOutPath,
  waiversLedgerPayload,
  [
    '# Waivers State Resolution Ledger',
    '',
    `Generated: ${generatedDate}`,
    '',
    ...Object.entries(waiversLedgerPayload.summary).map(([key, value]) => `- ${key}: ${summarizeValue(value)}`),
    '',
    buildSimpleMarkdownTable(
      ['state', 'resolution', 'waiver count'],
      waiversResolutionRows.map((row) => [row.stateId, row.resolutionState, row.waiverProgramCount]),
    ),
  ],
);
writeArtifactPair(
  educationLedgerJsonOutPath,
  educationLedgerMdOutPath,
  educationLedgerPayload,
  [
    '# Education Routing State Resolution Ledger',
    '',
    `Generated: ${generatedDate}`,
    '',
    ...Object.entries(educationLedgerPayload.summary).map(([key, value]) => `- ${key}: ${summarizeValue(value)}`),
    '',
    buildSimpleMarkdownTable(
      ['state', 'resolution', 'next command'],
      educationResolutionRows.map((row) => [row.stateId, row.resolutionState, row.nextCommand]),
    ),
  ],
);
writeArtifactPair(
  medicaidLedgerJsonOutPath,
  medicaidLedgerMdOutPath,
  medicaidLedgerPayload,
  [
    '# Medicaid/HHS Offices Resolution Ledger',
    '',
    `Generated: ${generatedDate}`,
    '',
    ...Object.entries(medicaidLedgerPayload.summary).map(([key, value]) => `- ${key}: ${summarizeValue(value)}`),
    '',
    buildSimpleMarkdownTable(
      ['state', 'resolution', 'next command'],
      medicaidResolutionRows.map((row) => [row.stateId, row.resolutionState, row.nextCommand]),
    ),
  ],
);
writeArtifactPair(
  waitlistsLedgerJsonOutPath,
  waitlistsLedgerMdOutPath,
  waitlistsLedgerPayload,
  [
    '# Program Waitlists Resolution Ledger',
    '',
    `Generated: ${generatedDate}`,
    '',
    ...Object.entries(waitlistsLedgerPayload.summary).map(([key, value]) => `- ${key}: ${summarizeValue(value)}`),
    '',
    buildSimpleMarkdownTable(
      ['state', 'resolution', 'live waitlist count'],
      waitlistsResolutionRows.map((row) => [row.stateId, row.resolutionState, row.liveWaitlistCount]),
    ),
  ],
);
writeArtifactPair(
  programsLedgerJsonOutPath,
  programsLedgerMdOutPath,
  programsLedgerPayload,
  [
    '# Programs Benefits Promotion Resolution Ledger',
    '',
    `Generated: ${generatedDate}`,
    '',
    ...Object.entries(programsLedgerPayload.summary).map(([key, value]) => `- ${key}: ${summarizeValue(value)}`),
    '',
    buildSimpleMarkdownTable(
      ['blocker', 'resolution', 'next command'],
      programsResolutionRows.map((row) => [row.blockerId, row.resolutionState, row.nextCommand]),
    ),
  ],
);
writeArtifactPair(
  ddLedgerJsonOutPath,
  ddLedgerMdOutPath,
  ddLedgerPayload,
  [
    '# DD Routing State Resolution Ledger',
    '',
    `Generated: ${generatedDate}`,
    '',
    ...Object.entries(ddLedgerPayload.summary).map(([key, value]) => `- ${key}: ${summarizeValue(value)}`),
    '',
    buildSimpleMarkdownTable(
      ['state', 'resolution', 'next command'],
      ddResolutionRows.map((row) => [row.stateId, row.resolutionState, row.nextCommand]),
    ),
  ],
);
writeArtifactPair(
  matchingLedgerJsonOutPath,
  matchingLedgerMdOutPath,
  matchingLedgerPayload,
  [
    '# Disability-to-Program Matching Verification Ledger',
    '',
    `Generated: ${generatedDate}`,
    '',
    ...Object.entries(matchingLedgerPayload.summary).map(([key, value]) => `- ${key}: ${summarizeValue(value)}`),
    '',
    buildSimpleMarkdownTable(
      ['blocker', 'resolution', 'next command'],
      matchingResolutionRows.map((row) => [row.blockerId, row.resolutionState, row.nextCommand]),
    ),
  ],
);
writeArtifactPair(
  blockerRegistryJsonOutPath,
  blockerRegistryMdOutPath,
  blockerRegistryPayload,
  [
    '# Blocker Resolution Registry',
    '',
    `Generated: ${generatedDate}`,
    '',
    ...Object.entries(blockerRegistryPayload.summary).map(([key, value]) => `- ${key}: ${summarizeValue(value)}`),
    '',
    buildSimpleMarkdownTable(
      ['family', 'blocker class', 'state/topic', 'terminal resolution', 'next command'],
      blockerResolutionRegistryRows.map((row) => [row.family, row.blockerClass, row.stateId || row.topic, row.terminalResolutionState, row.nextCommand]),
    ),
  ],
);

const mdLines = [];

function push(line = '') {
  mdLines.push(line);
}

function pushList(items) {
  for (const item of items) {
    push(`- ${item}`);
  }
}

function pushKeyedObject(object) {
  for (const [key, value] of Object.entries(object)) {
    push(`- ${key}: ${summarizeValue(value)}`);
  }
}

push('# Launch-Critical Data Acquisition Plan');
push('');
push(`Generated: ${generatedDate}`);
push('');
push('## Summary');
push('');
push(`- Artifact target: \`${payload.artifactTarget}\``);
push(`- Launch rule: ${payload.launchRule}`);
push(`- Queue baseline: readyRows=${payload.queueBaseline.readyRows}, ready_lightweight=${payload.queueBaseline.readyByStatus.ready_lightweight || 0}, ready_js_heavy=${payload.queueBaseline.readyByStatus.ready_js_heavy || 0}, ready_pdf=${payload.queueBaseline.readyByStatus.ready_pdf || 0}, discovery_only=${payload.queueBaseline.discoveryOnly}, missingSourceFamilyCount=${payload.queueBaseline.missingSourceFamilyCount}`);
push('');
push('## Authoritative Inputs');
push('');
for (const [key, value] of Object.entries(payload.authoritativeInputs)) {
  push(`- ${key}: \`${value}\``);
}

push('');
push('## Blocker Resolution Registry');
push('');
push(`- artifactPath: \`${payload.blockerResolutionRegistry.artifactPath}\``);
push(`- totalRows: ${payload.blockerResolutionRegistry.totalRows}`);
push(`- byFamily: ${summarizeValue(payload.blockerResolutionRegistry.byFamily)}`);
push(`- byBlockerClass: ${summarizeValue(payload.blockerResolutionRegistry.byBlockerClass)}`);

push('');
push('## Canonical Launch Queue Accounting');
push('');
push('### forms_guides');
push('');
pushKeyedObject(payload.canonicalLaunchQueueAccounting.formsGuides);
push('');
push('### program_waitlists');
push('');
pushKeyedObject(payload.canonicalLaunchQueueAccounting.programWaitlists);

push('');
push('## Blocked Work Taxonomy');
push('');
for (const item of payload.blockedWorkTaxonomy) {
  push(`- ${item.class}: ${item.meaning} | next lanes: ${item.allowedNextLanes.join(', ')}`);
}

push('');
push('## Provider Launch Standard');
push('');
push(`- anchorsRequiredPerState: ${payload.launchProviderStandard.anchorsRequiredPerState}`);
push('- mandatorySubtypeBuckets:');
for (const bucket of payload.launchProviderStandard.mandatorySubtypeBuckets) {
  push(`- ${bucket.bucket}: ${bucket.acceptableSubtypes.join(', ')}`);
}
push('- anchorEligibilityRule:');
pushList(payload.launchProviderStandard.anchorEligibilityRule);
push('- stateStatusRules:');
pushKeyedObject(payload.launchProviderStandard.stateStatusRules);
push('- nationalLaunchRule:');
pushKeyedObject(payload.launchProviderStandard.nationalLaunchRule);
push('- currentStatus:');
pushKeyedObject(payload.launchProviderStandard.currentStatus);

push('');
push('## Launch-Critical Families');
push('');
for (const family of payload.launchCriticalFamilies) {
  push(`### ${family.label} \`${family.id}\``);
  push('');
  push('Required subtypes');
  pushList(family.requiredSubtypes);
  push('');
  push('Required launch fields');
  for (const [fieldGroup, fields] of Object.entries(family.requiredLaunchFields)) {
    push(`- ${fieldGroup}: ${fields.join(', ')}`);
  }
  push('');
  push('Launch sufficiency standard');
  pushList(family.enoughForLaunch);
  push('');
  push(`- launchExecutionClass: ${family.launchExecutionClass}`);
  push(`- directAcquisitionRequired: ${family.directAcquisitionRequired}`);
  push(`- launchThreshold: ${family.launchThreshold}`);
  push(`- truthThreshold: ${family.truthThreshold}`);
  push(`- blockerCondition: ${family.blockerCondition}`);
  push(`- goodEnoughForLaunchRule: ${family.goodEnoughForLaunchRule}`);
  push(`- currentProgressMetric: ${family.currentProgressMetric}`);
  push(`- primaryUnblockClass: ${family.blockedWorkSummary.primaryUnblockClass}`);
  push(`- nextLane: ${family.blockedWorkSummary.nextLane}`);
  push(`- resolutionTarget: ${family.resolutionTarget}`);
  push(`- resolutionCompleteWhen: ${family.resolutionCompleteWhen}`);
  push(`- remainingBlockerCount: ${family.remainingBlockerCount}`);
  push(`- ledgerArtifactPath: \`${family.ledgerArtifactPath}\``);
  push('');
  push('Current-state inventory');
  push('- Live counts:');
  pushKeyedObject(family.currentStateInventory.liveCounts);
  if (Object.keys(family.currentStateInventory.stagingCounts).length) {
    push('- Staging counts:');
    pushKeyedObject(family.currentStateInventory.stagingCounts);
  }
  push('- Queue counts:');
  pushKeyedObject(family.currentStateInventory.queueCounts);
  push('- Trust and composition:');
  pushKeyedObject(family.currentStateInventory.trustAndComposition);
  push('- Known weak spots:');
  pushList(family.currentStateInventory.knownWeakSpots);
  push('- Truth/risk concerns:');
  pushList(family.currentStateInventory.truthRiskConcerns);
  if (family.currentStateInventory.canonicalLaunchQueueAccounting) {
    push('- Canonical launch queue accounting:');
    pushKeyedObject(family.currentStateInventory.canonicalLaunchQueueAccounting);
  }
  if (family.currentStateInventory.launchProviderStandard) {
    push('- Launch provider standard:');
    pushKeyedObject({
      anchorsRequiredPerState: family.currentStateInventory.launchProviderStandard.anchorsRequiredPerState,
      currentStatus: family.currentStateInventory.launchProviderStandard.currentStatus,
    });
  }
  push('');
  push('Gap analysis');
  push('- Missing pieces:');
  pushList(family.gapAnalysis.missing);
  push(`- Gap types: ${formatObjectList(family.gapAnalysis.gapTypes).join(', ')}`);
  push(`- Blocked work summary: ${formatObjectList(family.blockedWorkSummary.counts).join(', ') || 'none'}`);
  push('');
  push('Source acquisition plan');
  push('- Exact source families:');
  pushList(family.sourceAcquisitionPlan.exactSourceFamilies);
  push('- Existing source-pack status:');
  pushList(family.sourceAcquisitionPlan.existingSourcePackStatus);
  push(`- Authoring needed first: ${family.sourceAcquisitionPlan.authoringNeededFirst ? 'yes' : 'no'}`);
  push(`- Scraper lane: ${family.sourceAcquisitionPlan.scraperLane}`);
  push(`- Suggested batch size class: ${family.sourceAcquisitionPlan.suggestedBatchSizeClass}`);
  push(`- Control-plane rule: ${family.sourceAcquisitionPlan.controlPlaneRule}`);
  push('');
}

push('## Execution Order');
push('');
push('### Scrape now');
push('');
for (const family of payload.executionBuckets.scrapeNow) {
  push(`- ${family.id}: queue=${family.queueCount}; lane=${family.lane}; batch=${family.batchSizeClass}; next=${family.nextAction}`);
}

push('');
push('### Author first');
push('');
for (const family of payload.executionBuckets.authorFirst) {
  push(`- ${family.id}: queue=${family.queueCount}; lane=${family.lane}; batch=${family.batchSizeClass}; class=${family.primaryUnblockClass}; next=${family.nextAction}`);
}

push('');
push('### Dependency / verification only');
push('');
for (const family of payload.executionBuckets.dependencyVerificationOnly) {
  push(`- ${family.id}: queue=${family.queueCount}; lane=${family.lane}; batch=${family.batchSizeClass}; next=${family.nextAction}`);
}

push('');
push('### Blocked / later');
push('');
pushList(payload.executionBuckets.blockedLater);

push('');
push('### Deprioritized but allowed if they unblock launch');
push('');
pushList(payload.executionBuckets.deprioritizedFamilies);

push('');
push('## Exit Criteria');
push('');
pushList(payload.exitCriteria);

push('');
push('## Launch Closure Table');
push('');
push('| family | current count/status | launch threshold | current % to threshold | blocking gap type | actionable unblock class | next control-plane artifact | next command |');
push('|---|---|---|---|---|---|---|---|');
for (const row of payload.launchClosureTable) {
  push(`| ${row.family} | ${row.currentCountOrStatus} | ${row.launchThreshold} | ${row.currentPercentToThreshold} | ${row.blockingGapType} | ${row.actionableUnblockClass || 'n/a'} | ${row.nextControlPlaneArtifact} | ${row.nextCommand} |`);
}

push('');
push('## Important Interface / Artifact Changes');
push('');
pushList(payload.importantInterfaceChanges);

push('');
push('## Test Plan');
push('');
pushList(payload.testPlan);

push('');
push('## Assumptions');
push('');
pushList(payload.assumptions);

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);
db.close();

console.log(JSON.stringify({
  generatedAt: generatedDate,
  json: jsonOutPath,
  md: mdOutPath,
  queueBaseline: payload.queueBaseline,
  launchFamilyCount: payload.launchCriticalFamilies.length,
  scrapeNowCount: payload.executionBuckets.scrapeNow.length,
  authorFirstCount: payload.executionBuckets.authorFirst.length,
}, null, 2));
