import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `exhaustive-gap-master-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `exhaustive-gap-master-${generatedDate}.md`);

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (matches.length === 0) {
    throw new Error(`Missing generated input for prefix "${prefix}" in ${docsDir}`);
  }
  return path.join(docsDir, matches.at(-1));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function totalRows(layer) {
  return (layer.tables || []).reduce((sum, table) => sum + Number(table.rowCount || 0), 0);
}

function inventoryMapById(inventory) {
  return new Map((inventory.layers || []).map((layer) => [layer.id, layer]));
}

function getRowCount(layer, tableName) {
  return (layer.tables || []).find((table) => table.name === tableName)?.rowCount || 0;
}

function getNote(layer, prefix) {
  return (layer.notes || []).find((note) => String(note).startsWith(prefix)) || '';
}

function classifyExhaustiveStatus(status) {
  if (status === 'substantial') return 'broad_but_not_exhaustive';
  if (status === 'partial') return 'partial';
  if (status === 'thin') return 'thin';
  if (status === 'demo_only') return 'demo_only';
  if (status === 'modeled_only') return 'modeled_only';
  return 'unknown';
}

const inventoryPath = latestGeneratedJson('information-inventory-');
const fullGapPath = latestGeneratedJson('full-information-gap-audit-');
const completenessPath = latestGeneratedJson('information-completeness-audit-');
const confidencePath = latestGeneratedJson('information-confidence-audit-');
const truthRegistryPath = latestGeneratedJson('truth-registry-');

const inventory = readJson(inventoryPath);
const fullGap = readJson(fullGapPath);
const completeness = readJson(completenessPath);
const confidence = readJson(confidencePath);
const truthRegistry = readJson(truthRegistryPath);
const inventoryById = inventoryMapById(inventory);

const localDirectories = inventoryById.get('local_directories');
const directoryFoundation = inventoryById.get('directory_foundation');
const disabilityKnowledge = inventoryById.get('disability_knowledge');
const familyCase = inventoryById.get('family_case');
const supportPlanning = inventoryById.get('support_planning_collaboration');
const sourcesReviewOps = inventoryById.get('sources_review_ops');
const knowledgeContent = inventoryById.get('knowledge_content');
const stagingPromotion = inventoryById.get('staging_promotion');
const programsBenefits = inventoryById.get('programs_benefits');
const routingEducation = inventoryById.get('public_routing_education');
const normalization = inventoryById.get('normalization');

const providerCount = getRowCount(localDirectories, 'resource_providers');
const nonprofitCount = getRowCount(localDirectories, 'nonprofit_organizations');
const advocateCount = getRowCount(localDirectories, 'iep_advocates');
const waitlistCount = getRowCount(programsBenefits, 'program_waitlists');
const knowledgeArticleCount = getRowCount(knowledgeContent, 'knowledge_articles');
const stagedKnowledgeCount = getRowCount(stagingPromotion, 'staging_scraped_knowledge_content');
const ageBandCount = getRowCount(disabilityKnowledge, 'age_bands');
const insuranceTypeCount = getRowCount(disabilityKnowledge, 'insurance_types');
const userSubmittedCount = getRowCount(sourcesReviewOps, 'user_submitted_resources');
const coverageGapCount = getRowCount(sourcesReviewOps, 'coverage_gaps');
const verificationQueueCount = getRowCount(sourcesReviewOps, 'verification_queue_items');

const truthSummary = truthRegistry.summary || {};
const blockedStates = (truthRegistry.states || []).filter((state) => !state.strictGoldEligible);

const nationalGapMatrix = [
  {
    id: 'program_depth',
    label: 'Programs, forms, appeals, and waitlists',
    currentState: 'broad',
    evidence: `507 programs, 992 steps, 451 appeals, 165 waitlists across 50 states.`,
    exhaustiveGap: 'Waitlist depth is materially shallower than the rest of the program layer.',
    status: waitlistCount >= 200 ? 'near_exhaustive' : 'broad_but_not_exhaustive',
  },
  {
    id: 'routing_depth',
    label: 'DD routing, county offices, and education routing',
    currentState: 'broad',
    evidence: '3678 county offices, 636 state routing agencies, 313 regional education agencies, 3117 school districts.',
    exhaustiveGap: 'Routing exists nationally, but regional education depth is still not fully even across all states and counties.',
    status: 'broad_but_not_exhaustive',
  },
  {
    id: 'provider_directory',
    label: 'Local providers, clinics, therapists, and care',
    currentState: 'thin',
    evidence: `${providerCount} public provider rows and 23 staged provider rows across all 50 states.`,
    exhaustiveGap: 'This is the biggest information hole if the goal is all local help, especially to compete on care and treatment discovery.',
    status: 'critical_gap',
  },
  {
    id: 'nonprofit_directory_depth',
    label: 'Nonprofit coverage quality and local utility',
    currentState: 'broad',
    evidence: `${nonprofitCount} nonprofit rows across 50 states.`,
    exhaustiveGap: 'Coverage is broad, but accessibility, capacity, and local in-person truth signals are still sparse.',
    status: 'broad_but_not_exhaustive',
  },
  {
    id: 'advocate_directory_depth',
    label: 'Advocates and legal/IEP support',
    currentState: 'moderate',
    evidence: `${advocateCount} advocate rows, with California still blocked in strict gold because 58 counties lose advocate coverage after truth gating.`,
    exhaustiveGap: 'Advocate count is decent, but truth-safe local coverage is not yet strong enough to call exhaustive.',
    status: 'meaningful_but_not_exhaustive',
  },
  {
    id: 'directory_foundation_signals',
    label: 'Findhelp-like metadata: availability, accessibility, intake, capacity',
    currentState: 'modeled',
    evidence: [
      getNote(directoryFoundation, 'Provider accessibility booleans with true signal:'),
      getNote(directoryFoundation, 'Nonprofit accessibility booleans with true signal:'),
      getNote(directoryFoundation, 'Advocate accessibility booleans with true signal:'),
    ].filter(Boolean).join(' '),
    exhaustiveGap: 'The schema exists, but live high-signal metadata is sparse, especially on nonprofits and advocates.',
    status: 'partial',
  },
  {
    id: 'normalization_depth',
    label: 'Canonical org -> program -> location normalization',
    currentState: 'present',
    evidence: `${getRowCount(normalization, 'organizations')} organizations, ${getRowCount(normalization, 'organization_program_links')} org-program links, ${getRowCount(normalization, 'service_locations')} service locations, ${getRowCount(normalization, 'office_locations')} office locations, ${getRowCount(normalization, 'virtual_service_areas')} virtual service areas.`,
    exhaustiveGap: 'Normalization exists, but service-location depth is still too thin to support a fully location-rich help product.',
    status: 'partial',
  },
  {
    id: 'knowledge_taxonomy',
    label: 'Conditions, functional needs, age bands, insurance types',
    currentState: 'mixed',
    evidence: `${getRowCount(disabilityKnowledge, 'conditions')} conditions, ${getRowCount(disabilityKnowledge, 'functional_needs')} functional needs, ${ageBandCount} age bands, ${insuranceTypeCount} insurance types.`,
    exhaustiveGap:
      ageBandCount === 0 || insuranceTypeCount === 0
        ? 'Conditions and needs are strong, but age-band and insurance reference tables are still empty.'
        : 'Conditions, needs, age bands, and insurance reference tables are all present, though broader knowledge depth is still driven by the article layer.',
    status: ageBandCount === 0 || insuranceTypeCount === 0 ? 'partial' : 'broad',
  },
  {
    id: 'knowledge_content_depth',
    label: 'Help content and explanatory knowledge',
    currentState: 'thin',
    evidence: `${knowledgeArticleCount} knowledge articles, ${stagedKnowledgeCount} staged knowledge articles.`,
    exhaustiveGap: stagedKnowledgeCount > 0
      ? 'The content layer is still far too small for the full family journey nationally, but staged knowledge growth is now present and measured.'
      : 'The content layer is far too small for a product that aims to cover the full family journey nationally.',
    status: 'critical_gap',
  },
  {
    id: 'family_runtime',
    label: 'Family workflow, case tracking, reminders, and documents',
    currentState: 'demo_only',
    evidence: `${totalRows(familyCase)} total family-case-layer rows across 8 tables; most tables are empty.`,
    exhaustiveGap: 'The runtime workflow model exists but is not populated as a real product layer.',
    status: 'not_started',
  },
  {
    id: 'support_planning',
    label: 'Support planning, collaboration, and care coordination',
    currentState: 'empty',
    evidence: `${totalRows(supportPlanning)} total rows across planning/collaboration tables.`,
    exhaustiveGap: 'This entire product surface is still schema-only in practice.',
    status: 'not_started',
  },
  {
    id: 'feedback_loops',
    label: 'User submissions, coverage gaps, verification queue',
    currentState: 'minimal',
    evidence: `${userSubmittedCount} user submissions, ${coverageGapCount} coverage gaps, ${verificationQueueCount} verification queue items.`,
    exhaustiveGap: 'Operational feedback loops are not built out enough to sustain exhaustive maintenance.',
    status: 'critical_gap',
  },
];

const fullGapLayers = (fullGap.layers || []).map((layer) => ({
  id: layer.id,
  label: layer.label,
  currentAuditStatus: layer.status,
  exhaustiveStatus: classifyExhaustiveStatus(layer.status),
  evidence: layer.evidence,
  gap: layer.gap,
}));

function formatPublicSafeBlockedTruth(strictGoldStates, publicSafeButBlockedStates) {
  if (!publicSafeButBlockedStates) {
    return `${strictGoldStates}/50 strict-gold states means the stricter truth registry still has unresolved blockers beyond launch readiness.`;
  }

  const noun = publicSafeButBlockedStates === 1 ? 'state' : 'states';
  const verb = publicSafeButBlockedStates === 1 ? 'still sits' : 'still sit';
  return `${strictGoldStates}/50 strict-gold states means ${publicSafeButBlockedStates} ${noun} ${verb} in the public-safe-but-blocked lane on the stricter truth registry.`;
}

const payload = {
  generatedAt: generatedDate,
  inputs: {
    inventoryPath,
    fullGapPath,
    completenessPath,
    confidencePath,
    truthRegistryPath,
  },
  executiveTruth: {
    currentModeledCompletenessStates: completeness.summary?.infoCompleteStates || 0,
    currentHighConfidenceStates: confidence.summary?.highConfidenceStates || 0,
    strictGoldStates: truthSummary.strictGoldStates || 0,
    publicSafeButBlockedStates: truthSummary.publicSafeButBlockedStates || 0,
    blockedStateIds: blockedStates.map((state) => state.id),
    coreConclusion: 'The repo has broad launch-safe state coverage, but 0/50 states currently satisfy the stricter modeled-completeness audit and the product is still far from exhaustive across all information types it implies.',
  },
  summary: {
    nationalGapCount: nationalGapMatrix.length,
    missingSourceFamilyCount: Number(fullGap.completionAudit?.missingSourceFamilyCount || 0),
    actionableBlockerCount: Number(fullGap.completionAudit?.actionableBlockerCount || 0),
    unknownGapCount: Number(fullGap.completionAudit?.unknownGapCount || 0),
    allInScopeFamiliesAccountedFor: Boolean(fullGap.completionAudit?.allInScopeFamiliesAccountedFor),
  },
  currentInventory: {
    majorLayers: inventory.summary?.layerCount || 0,
    informationTypes: inventory.informationTypes || [],
  },
  nationalGapMatrix,
  fullGapLayers,
  immediateTruths: [
    '50/50 modeled completeness does not mean all information categories are deeply built out.',
    formatPublicSafeBlockedTruth(
      truthSummary.strictGoldStates || 0,
      truthSummary.publicSafeButBlockedStates || 0,
    ),
    'Provider coverage and knowledge-content depth are still the largest visible product information gaps.',
    'Directory metadata exists in schema, but most nonprofit and advocate rows still lack rich accessibility and capacity signals.',
    'Several workflow and support layers are still mostly empty despite having schema support.',
  ],
};

const mdLines = [
  '# Exhaustive Gap Master',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This is the canonical pause-and-realign artifact for the repo.',
  'It separates three different ideas that were getting conflated:',
  '',
  '- modeled 50-state completeness on the current audit bar',
  '- public-truth / strict-gold readiness',
  '- truly exhaustive product information depth',
  '',
  '## Executive Truth',
  '',
  `- Modeled info-complete states on the current audit bar: ${payload.executiveTruth.currentModeledCompletenessStates}/50`,
  `- High-confidence states on the current audit bar: ${payload.executiveTruth.currentHighConfidenceStates}/50`,
  `- Strict-gold states on the truth registry: ${payload.executiveTruth.strictGoldStates}/50`,
  `- Public-safe but still blocked states: ${payload.executiveTruth.publicSafeButBlockedStates}/50`,
  `- Bottom line: ${payload.executiveTruth.coreConclusion}`,
  '',
  '## What We Already Have',
  '',
  `- Major information layers modeled in repo: ${inventory.summary?.layerCount || 0}`,
  `- Programs: ${getRowCount(programsBenefits, 'programs')}`,
  `- Program eligibility rules: ${getRowCount(programsBenefits, 'program_eligibility_rules')}`,
  `- Program document requirements: ${getRowCount(programsBenefits, 'program_document_requirements')}`,
  `- Program application steps: ${getRowCount(programsBenefits, 'program_application_steps')}`,
  `- Program appeals: ${getRowCount(programsBenefits, 'program_appeal_info')}`,
  `- Program waitlists: ${waitlistCount}`,
  `- County offices: ${getRowCount(routingEducation, 'county_offices')}`,
  `- State routing agencies: ${getRowCount(routingEducation, 'state_resource_agencies')}`,
  `- Regional education agencies: ${getRowCount(routingEducation, 'regional_education_agencies')}`,
  `- School districts: ${getRowCount(routingEducation, 'school_districts')}`,
  `- Providers: ${providerCount}`,
  `- Nonprofits: ${nonprofitCount}`,
  `- Advocates: ${advocateCount}`,
  `- Organizations: ${getRowCount(normalization, 'organizations')}`,
  `- Organization-program links: ${getRowCount(normalization, 'organization_program_links')}`,
  `- Service locations: ${getRowCount(normalization, 'service_locations')}`,
  `- Office locations: ${getRowCount(normalization, 'office_locations')}`,
  `- Virtual service areas: ${getRowCount(normalization, 'virtual_service_areas')}`,
  `- Conditions: ${getRowCount(disabilityKnowledge, 'conditions')}`,
  `- Functional needs: ${getRowCount(disabilityKnowledge, 'functional_needs')}`,
  `- Age bands: ${ageBandCount}`,
  `- Insurance types: ${insuranceTypeCount}`,
  `- Knowledge articles: ${knowledgeArticleCount}`,
  '',
  '## What The Current 50-State Audits Mean',
  '',
  '- They do show that the repo has national state coverage for the current truth-first public bar.',
  '- They do not show that every product information category is deep, rich, or exhaustive.',
  '- They do not show that local provider/help discovery is complete enough to compete on care, housing, goods, jobs, legal, or education support depth.',
  '',
  '## National Gap Matrix',
  '',
  '| Layer | Current State | Exhaustive Status | Evidence | Main Gap |',
  '| --- | --- | --- | --- | --- |',
];

for (const gap of nationalGapMatrix) {
  mdLines.push(`| ${gap.label} | ${gap.currentState} | ${gap.status} | ${gap.evidence.replace(/\|/g, '\\|')} | ${gap.exhaustiveGap.replace(/\|/g, '\\|')} |`);
}

mdLines.push('', '## Full-Gap Layer Readout', '');
for (const layer of fullGapLayers) {
  mdLines.push(`### ${layer.label}`);
  mdLines.push('');
  mdLines.push(`- Current audit status: ${layer.currentAuditStatus}`);
  mdLines.push(`- Exhaustive interpretation: ${layer.exhaustiveStatus}`);
  for (const evidence of layer.evidence || []) {
    mdLines.push(`- Evidence: ${evidence}`);
  }
  mdLines.push(`- Gap: ${layer.gap}`);
  mdLines.push('');
}

mdLines.push('## Most Important Corrections To Our Mental Model', '');
for (const line of payload.immediateTruths) {
  mdLines.push(`- ${line}`);
}

mdLines.push('', '## Immediate Recommendation', '');
mdLines.push('- Yes, pause broad scraping long enough to treat this artifact as the canonical exhaustive gap list.');
mdLines.push('- Keep using the low-token pipeline, but only against gaps in the critical and partial categories above.');
mdLines.push('- The biggest missing product information areas are providers/care, knowledge content, rich directory metadata, and the still-empty workflow/support layers.');
mdLines.push(`- California remains the only strict-gold exception right now because advocate truth gating still drops coverage in ${blockedStates[0]?.advocateTruth?.countiesLosingCoverage || 0} counties.`);

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  summary: payload.executiveTruth,
  nationalGapCount: nationalGapMatrix.length,
  report: mdOutPath,
  json: jsonOutPath,
}, null, 2));
