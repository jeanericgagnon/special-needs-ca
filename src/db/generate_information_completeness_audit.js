import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveNavigatorDbPath } from './resolveNavigatorDbPath.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = resolveNavigatorDbPath(repoRoot);
const stateConfigsPath = path.join(repoRoot, 'frontend/src/lib/stateConfigs.ts');
const sourceTargetsDir = path.join(repoRoot, 'data/source_targets');
const docsDir = path.join(repoRoot, 'docs/generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `information-completeness-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `information-completeness-audit-${generatedDate}.md`);
const truthRegistryPath = path.join(docsDir, `truth-registry-${generatedDate}.json`);

const db = new Database(dbPath, { readonly: true });
const stateConfigsContent = fs.readFileSync(stateConfigsPath, 'utf8');

function tableExists(tableName) {
  return Boolean(
    db.prepare(`SELECT 1 AS ok FROM sqlite_master WHERE type IN ('table', 'view') AND name = ?`).get(tableName)
  );
}

function countIfExists(tableName) {
  if (!tableExists(tableName)) return 0;
  return db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get().count;
}

const REQUIRED_STATE_CONFIG_KEYS = [
  'legalDisclaimer',
  'stateMedicaidAgency',
  'ddAgency',
  'educationAgency',
  'specialEducationSupport',
  'earlyIntervention',
];

const REQUIRED_PROGRAM_FIELDS = [
  'description',
  'who_it_is_for',
  'who_might_qualify',
  'last_verified_date',
];

const REQUIRED_FORM_FIELDS = [
  'source_url',
  'who_uses_it',
  'who_signs_it',
  'where_to_send_it',
  'attachments',
  'deadline',
  'common_mistakes',
];

const MIN_CONDITIONS = 78;
const MIN_FUNCTIONAL_NEEDS = 15;
const PUBLIC_DIRECTORY_STATUSES = new Set([
  'official_verified',
  'verified',
  'human_verified',
  'source_listed',
]);
const SYNTHETIC_SOURCE_HOST_PATTERNS = [
  /^www\.advocate\./,
  /^www\.therapy\./,
  /^www\.legal\./,
  /^www\.pediatrictherapy\./,
  /^[a-z]{2}-pa\.org$/,
];

function parseStateBlock(stateId) {
  const stateBlockRegex = new RegExp(`['"]${stateId}['"]\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\}\\s*(?:,\\n\\s*['"]|\\n\\})`);
  return stateConfigsContent.match(stateBlockRegex)?.[0] || '';
}

function parseStringArray(block, key) {
  const match = block.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) return [];
  return match[1]
    .split(',')
    .map((value) => value.trim().replace(/['"]/g, ''))
    .filter(Boolean);
}

function hasKeyValue(block, key) {
  return new RegExp(`${key}:\\s*['"\`\\[]`).test(block);
}

function countParentResources(block) {
  const match = block.match(/parentTrainingResources:\s*\[([\s\S]*?)\]/);
  if (!match) return 0;
  return [...match[1].matchAll(/name:\s*['"]/g)].length;
}

function countSourceTargetParentResources(stateId) {
  const filePath = path.join(sourceTargetsDir, `${stateId}.json`);
  if (!fs.existsSync(filePath)) return 0;

  try {
    const targets = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return targets.filter((target) => {
      const category = String(target.category || '').toLowerCase();
      const subcategory = String(target.specific_subcategory || '').toLowerCase();
      const sourceName = String(target.source_name || '').toLowerCase();
      return (
        category.includes('parent training') ||
        subcategory.includes('pti') ||
        subcategory.includes('parent training') ||
        sourceName.includes('parent training') ||
        sourceName.includes('parent center') ||
        sourceName.includes('resource center on disabilities')
      );
    }).length;
  } catch {
    return 0;
  }
}

function pct(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function findLatestGeneratedJson(prefix) {
  const entries = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir)
      .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
      .sort()
    : [];

  if (entries.length === 0) {
    return null;
  }

  return path.join(docsDir, entries[entries.length - 1]);
}

function getCoreOfficePrograms(stateId, stateCode) {
  if (stateId === 'california') {
    return ['medi-cal-for-kids-and-teens', 'california-childrens-services', 'hearing-aid-coverage', 'hcba', 'ihss-for-children'];
  }
  if (stateId === 'texas') {
    return ['tx-mdcp', 'tx-medicaid-chip'];
  }
  if (stateId === 'florida') {
    return ['fl-medicaid-dcf'];
  }
  if (stateId === 'new-york') {
    return ['ny-medicaid'];
  }
  if (stateId === 'pennsylvania') {
    return ['pa-medicaid'];
  }
  if (stateId === 'illinois') {
    return ['il-medicaid'];
  }
  if (stateId === 'ohio') {
    return ['oh-medicaid'];
  }
  if (stateId === 'georgia') {
    return ['ga-medicaid'];
  }
  return [`${stateCode}-medicaid`, `${stateCode}-personal-care`];
}

function getNormalizedStateCode(state) {
  const rawCode = state?.code;
  if (typeof rawCode === 'string' && /^[a-z]{2}$/i.test(rawCode.trim())) {
    return rawCode.trim().toLowerCase();
  }

  const countyRow = db.prepare('SELECT id FROM counties WHERE state_id = ? ORDER BY id LIMIT 1').get(state.id);
  if (countyRow?.id && typeof countyRow.id === 'string') {
    const parts = countyRow.id.split('-');
    const suffix = parts[parts.length - 1];
    if (/^[a-z]{2}$/i.test(suffix)) {
      return suffix.toLowerCase();
    }
  }

  return String(state?.id || '').trim().toLowerCase();
}

function hasContactSignal(record) {
  const phone = record.phone || record.spec_ed_contact_phone || record.intake_phone || '';
  const email = record.email || record.spec_ed_contact_email || '';
  const website = record.website || '';
  return Boolean(phone || email || website);
}

function hasSourceSignal(record) {
  return Boolean(record.source_url || record.official_source_url);
}

function isTruthyField(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function hasPublicSourceUrl(value) {
  if (!isTruthyField(value)) return false;
  try {
    const url = new URL(String(value).trim());
    return !SYNTHETIC_SOURCE_HOST_PATTERNS.some((pattern) => pattern.test(url.hostname));
  } catch {
    return false;
  }
}

function hasDirectoryContactSignal(record, options = {}) {
  const websiteField = options.websiteField || 'website';
  return (
    isTruthyField(record.phone) ||
    isTruthyField(record.email) ||
    isTruthyField(record[websiteField])
  );
}

function isPublicSafeDirectoryRecord(record, options = {}) {
  return (
    PUBLIC_DIRECTORY_STATUSES.has(record.verification_status || '') &&
    hasPublicSourceUrl(record.source_url) &&
    hasDirectoryContactSignal(record, options) &&
    record.manual_review_required !== 1 &&
    !isTruthyField(record.unsupported_claim_flags)
  );
}

function computeProgramCompleteness(program, stepCount, docCount, hasAppeal, hasWaitlist) {
  if (!program) {
    return {
      rowPresent: false,
      fieldsComplete: false,
      hasSteps: false,
      hasDocuments: false,
      hasAppeal: false,
      hasWaitlist: false,
      complete: false,
    };
  }

  const fieldsComplete =
    REQUIRED_PROGRAM_FIELDS.every((field) => isTruthyField(program[field])) &&
    (isTruthyField(program.official_source_url) || isTruthyField(program.source_url)) &&
    isTruthyField(program.verification_status);

  const programId = (program.id || '').toLowerCase();
  const programType = (program.program_type || '').toLowerCase();
  const combined = `${programId} ${programType} ${(program.name || '').toLowerCase()}`;

  const requiresAppeal = !combined.includes('able');
  const requiresWaitlist =
    combined.includes('waiver') ||
    combined.includes('regional-centers') ||
    combined.includes('regional center') ||
    combined.includes('self-direction') ||
    combined.includes('interest list') ||
    combined.includes('planning list');

  const appealSatisfied = hasAppeal || !requiresAppeal;
  const waitlistSatisfied = hasWaitlist || !requiresWaitlist;

  return {
    rowPresent: true,
    fieldsComplete,
    hasSteps: stepCount > 0,
    hasDocuments: docCount > 0,
    hasAppeal: appealSatisfied,
    hasWaitlist: waitlistSatisfied,
    complete: fieldsComplete && stepCount > 0 && docCount > 0 && appealSatisfied && waitlistSatisfied,
  };
}

function computeFormCompleteness(form) {
  if (!form) {
    return { present: false, complete: false, hasTemplate: false };
  }

  const baseFieldsPresent = REQUIRED_FORM_FIELDS.every((field) => isTruthyField(form[field]));
  const hasTemplate = isTruthyField(form.letter_template) || isTruthyField(form.call_script);
  const trustFieldsPresent =
    isTruthyField(form.verification_status) &&
    (isTruthyField(form.last_verified_at) || isTruthyField(form.last_checked_at)) &&
    isTruthyField(form.data_origin);

  return {
    present: true,
    complete: baseFieldsPresent && hasTemplate && trustFieldsPresent,
    hasTemplate,
  };
}

const states = db.prepare('SELECT id, name, code FROM states ORDER BY name').all();
const truthRegistry = readJsonIfExists(truthRegistryPath);
const advocateTruthPath = findLatestGeneratedJson('advocate-truth-cleanup-audit-');
const advocateTruth = advocateTruthPath ? readJsonIfExists(advocateTruthPath) : null;

const taxonomySummary = {
  conditionCount: countIfExists('conditions'),
  functionalNeedCount: countIfExists('functional_needs'),
};

const stateResults = [];
const blockerCounts = new Map();

for (const state of states) {
  const stateBlock = parseStateBlock(state.id);
  const corePrograms = parseStringArray(stateBlock, 'corePrograms');
  const requiredForms = parseStringArray(stateBlock, 'requiredForms');
  const parentTrainingResourceCount = countParentResources(stateBlock);
  const sourceTargetParentTrainingCount = countSourceTargetParentResources(state.id);

  const configChecks = {
    requiredKeysPresent: REQUIRED_STATE_CONFIG_KEYS.filter((key) => hasKeyValue(stateBlock, key)).length,
    totalRequiredKeys: REQUIRED_STATE_CONFIG_KEYS.length,
    coreProgramsPresent: corePrograms.length > 0,
    requiredFormsPresent: requiredForms.length > 0,
    parentTrainingResourcesPresent: parentTrainingResourceCount > 0 || sourceTargetParentTrainingCount > 0,
  };

  const programRows = corePrograms.length
    ? db.prepare(`SELECT * FROM programs WHERE id IN (${corePrograms.map(() => '?').join(',')})`).all(...corePrograms)
    : [];
  const programById = new Map(programRows.map((row) => [row.id, row]));

  const coreProgramDetails = corePrograms.map((programId) => {
    const stepCount = db.prepare('SELECT COUNT(*) AS count FROM program_application_steps WHERE program_id = ?').get(programId).count;
    const docCount = db.prepare('SELECT COUNT(*) AS count FROM program_document_requirements WHERE program_id = ?').get(programId).count;
    const hasAppeal = Boolean(db.prepare('SELECT 1 FROM program_appeal_info WHERE program_id = ?').get(programId));
    const hasWaitlist = Boolean(db.prepare('SELECT 1 FROM program_waitlists WHERE program_id = ?').get(programId));
    return {
      programId,
      ...computeProgramCompleteness(programById.get(programId), stepCount, docCount, hasAppeal, hasWaitlist),
    };
  });

  const formRows = requiredForms.length
    ? db.prepare(`SELECT * FROM forms_and_guides WHERE state_id = ? AND slug IN (${requiredForms.map(() => '?').join(',')})`).all(state.id, ...requiredForms)
    : [];
  const formBySlug = new Map(formRows.map((row) => [row.slug, row]));
  const formDetails = requiredForms.map((slug) => ({
    slug,
    ...computeFormCompleteness(formBySlug.get(slug)),
  }));

  const countyCount = db.prepare('SELECT COUNT(*) AS count FROM counties WHERE state_id = ?').get(state.id).count;
  const ddCoverage = tableExists('regional_center_counties')
    ? db.prepare(`
      SELECT COUNT(DISTINCT rcc.county_id) AS count
      FROM regional_center_counties rcc
      JOIN counties c ON c.id = rcc.county_id
      WHERE c.state_id = ?
    `).get(state.id).count
    : 0;

  const officePrograms = getCoreOfficePrograms(state.id, getNormalizedStateCode(state));
  const officeCoverage = officePrograms.length
    ? db.prepare(`
      SELECT COUNT(DISTINCT co.county_id) AS count
      FROM county_offices co
      JOIN counties c ON c.id = co.county_id
      WHERE c.state_id = ?
        AND co.program_id IN (${officePrograms.map(() => '?').join(',')})
        AND (co.source_url IS NOT NULL AND TRIM(co.source_url) <> '')
        AND ((co.phone IS NOT NULL AND TRIM(co.phone) <> '') OR (co.email IS NOT NULL AND TRIM(co.email) <> '') OR (co.website IS NOT NULL AND TRIM(co.website) <> ''))
    `).get(state.id, ...officePrograms).count
    : 0;

  const educationCoverage = db.prepare(`
    SELECT COUNT(DISTINCT sd.county_id) AS count
    FROM school_districts sd
    JOIN counties c ON c.id = sd.county_id
    WHERE c.state_id = ?
      AND (sd.source_url IS NOT NULL AND TRIM(sd.source_url) <> '')
      AND (
        (sd.spec_ed_contact_phone IS NOT NULL AND TRIM(sd.spec_ed_contact_phone) <> '') OR
        (sd.spec_ed_contact_email IS NOT NULL AND TRIM(sd.spec_ed_contact_email) <> '') OR
        (sd.website IS NOT NULL AND TRIM(sd.website) <> '')
      )
  `).get(state.id).count;

  const nonprofitCount = db.prepare(`
    SELECT COUNT(*) AS count
    FROM nonprofit_organizations n
    JOIN counties c ON c.id = n.county_id
    WHERE c.state_id = ?
      AND (n.source_url IS NOT NULL AND TRIM(n.source_url) <> '')
      AND ((n.phone IS NOT NULL AND TRIM(n.phone) <> '') OR (n.website IS NOT NULL AND TRIM(n.website) <> ''))
  `).get(state.id).count;

  const providerRows = db.prepare(`
    SELECT rp.*
    FROM resource_providers rp
    JOIN counties c ON c.id = rp.county_id
    WHERE c.state_id = ?
  `).all(state.id);

  const publicSafeProviders = providerRows.filter((row) =>
    isPublicSafeDirectoryRecord(row, { websiteField: 'next_step_url' })
  ).length;

  const nonprofitRows = db.prepare(`
    SELECT n.*
    FROM nonprofit_organizations n
    JOIN counties c ON c.id = n.county_id
    WHERE c.state_id = ?
  `).all(state.id);

  const publicSafeNonprofits = nonprofitRows.filter((row) =>
    isPublicSafeDirectoryRecord(row)
  ).length;

  const advocateTruthState = advocateTruth?.states?.find?.((entry) => entry.stateId === state.id) || null;
  const advocateLayerPresent = advocateTruthState ? advocateTruthState.totalAdvocates > 0 : false;
  const advocatePublicSafeCount = advocateTruthState?.publicSafeAdvocates || 0;
  const advocateCoverageLossCounties = advocateTruthState?.countiesLosingAllAdvocateCoverage || 0;

  const completeCorePrograms = coreProgramDetails.filter((detail) => detail.complete).length;
  const completeForms = formDetails.filter((detail) => detail.complete).length;
  const configPass =
    configChecks.requiredKeysPresent === configChecks.totalRequiredKeys &&
    configChecks.coreProgramsPresent &&
    configChecks.requiredFormsPresent &&
    configChecks.parentTrainingResourcesPresent;

  const programGuidePct = pct(completeCorePrograms, corePrograms.length);
  const formsPct = pct(completeForms, requiredForms.length);
  const ddPct = pct(ddCoverage, countyCount);
  const officePct = pct(officeCoverage, countyCount);
  const educationPct = pct(educationCoverage, countyCount);

  const blockers = [];
  if (!configPass) blockers.push('state_config_missing_core_fields');
  if (programGuidePct < 100) blockers.push('core_program_guides_incomplete');
  if (formsPct < 100) blockers.push('required_forms_incomplete');
  if (ddPct < 100) blockers.push('dd_routing_not_full_county');
  if (officePct < 100) blockers.push('county_office_info_not_full_county');
  if (educationPct < 100) blockers.push('education_contact_info_not_full_county');
  if (nonprofitCount === 0) blockers.push('no_local_nonprofit_support_detected');
  if (publicSafeNonprofits === 0) blockers.push('no_public_safe_nonprofit_layer_detected');
  if (publicSafeProviders === 0) blockers.push('no_public_safe_provider_layer_detected');
  if (!advocateLayerPresent) blockers.push('no_advocate_layer_detected');
  if (advocateLayerPresent && advocatePublicSafeCount === 0) blockers.push('no_public_safe_advocate_layer_detected');
  if (advocateCoverageLossCounties > 0) blockers.push('advocate_truth_gap');

  const score = Math.round(((configPass ? 100 : pct(
    configChecks.requiredKeysPresent +
      (configChecks.coreProgramsPresent ? 1 : 0) +
      (configChecks.requiredFormsPresent ? 1 : 0) +
      (configChecks.parentTrainingResourcesPresent ? 1 : 0),
    configChecks.totalRequiredKeys + 3
  )) + programGuidePct + formsPct + ddPct + officePct + educationPct + (publicSafeNonprofits > 0 ? 100 : 0) + (publicSafeProviders > 0 ? 100 : 0) + (advocateLayerPresent && advocateCoverageLossCounties === 0 && advocatePublicSafeCount > 0 ? 100 : 0)) / 9 * 10) / 10;

  for (const blocker of blockers) {
    blockerCounts.set(blocker, (blockerCounts.get(blocker) || 0) + 1);
  }

  stateResults.push({
    stateId: state.id,
    stateName: state.name,
    countyCount,
    configPass,
    configCoverage: configPass
      ? 100
      : pct(
          configChecks.requiredKeysPresent +
            (configChecks.coreProgramsPresent ? 1 : 0) +
            (configChecks.requiredFormsPresent ? 1 : 0) +
            (configChecks.parentTrainingResourcesPresent ? 1 : 0),
          configChecks.totalRequiredKeys + 3
        ),
    coreProgramsConfigured: corePrograms.length,
    coreProgramsComplete: completeCorePrograms,
    programGuideCoverage: programGuidePct,
    requiredFormsConfigured: requiredForms.length,
    requiredFormsComplete: completeForms,
    formsCoverage: formsPct,
    ddRoutingCoverage: ddPct,
    officeCoverage: officePct,
    educationCoverage: educationPct,
    nonprofitCount,
    publicSafeProviders,
    totalProviderRows: providerRows.length,
    publicSafeNonprofits,
    totalNonprofitRows: nonprofitRows.length,
    advocateLayerPresent,
    advocatePublicSafeCount,
    advocateCoverageLossCounties,
    score,
    infoComplete: blockers.length === 0,
    blockers,
    weakPrograms: coreProgramDetails.filter((detail) => !detail.complete).map((detail) => detail.programId),
    weakForms: formDetails.filter((detail) => !detail.complete).map((detail) => detail.slug),
  });
}

stateResults.sort((a, b) => b.score - a.score || a.stateName.localeCompare(b.stateName));

const nationalSummary = {
  generatedAt: generatedDate,
  statesAudited: stateResults.length,
  infoCompleteStates: stateResults.filter((state) => state.infoComplete).length,
  statesMissingProgramGuideCoverage: stateResults.filter((state) => state.programGuideCoverage < 100).length,
  statesMissingFormsCoverage: stateResults.filter((state) => state.formsCoverage < 100).length,
    statesMissingDdCoverage: stateResults.filter((state) => state.ddRoutingCoverage < 100).length,
    statesMissingOfficeCoverage: stateResults.filter((state) => state.officeCoverage < 100).length,
    statesMissingEducationCoverage: stateResults.filter((state) => state.educationCoverage < 100).length,
    statesMissingPublicSafeProviderLayer: stateResults.filter((state) => state.publicSafeProviders === 0).length,
    statesMissingPublicSafeNonprofitLayer: stateResults.filter((state) => state.publicSafeNonprofits === 0).length,
    statesWithAdvocateTruthGap: stateResults.filter((state) => state.advocateCoverageLossCounties > 0).length,
    taxonomy: {
      ...taxonomySummary,
      conditionsComplete: taxonomySummary.conditionCount >= MIN_CONDITIONS,
      functionalNeedsComplete: taxonomySummary.functionalNeedCount >= MIN_FUNCTIONAL_NEEDS,
  },
  topBlockers: [...blockerCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([blocker, count]) => ({ blocker, count })),
  scopeLimitations: [
    'This audit measures modeled completeness for state config, core program guides, required forms, DD routing, county offices, education coverage, and public-safe local directory presence across providers, nonprofits, and advocates.',
    'It still does not prove sitemap eligibility or strict gold status on its own.',
  ],
};

if (truthRegistry?.summary) {
  nationalSummary.truthRegistrySnapshot = {
    strictGoldStates: truthRegistry.summary.strictGoldStates,
    publicSafeButBlockedStates: truthRegistry.summary.publicSafeButBlockedStates,
    legacyGoldStates: truthRegistry.summary.legacyGoldStates,
    registryMismatchStates: truthRegistry.summary.registryMismatchStates,
  };
}

if (advocateTruth?.summary) {
  nationalSummary.advocateTruthSnapshot = {
    statesWithCoverageLoss: advocateTruth.summary.statesWithCoverageLoss,
    countiesLosingAllAdvocateCoverageAfterTruthGating: advocateTruth.summary.countiesLosingAllAdvocateCoverageAfterTruthGating,
    totalSyntheticPatternRows: advocateTruth.summary.totalSyntheticPatternRows,
  };
}

const payload = {
  summary: nationalSummary,
  states: stateResults,
};

const mdLines = [
  '# Generated Information Completeness Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  '## National Summary',
  '',
  `- States audited: ${nationalSummary.statesAudited}`,
  `- States fully info-complete: ${nationalSummary.infoCompleteStates}`,
  `- States missing complete core program guides: ${nationalSummary.statesMissingProgramGuideCoverage}`,
  `- States missing complete required forms coverage: ${nationalSummary.statesMissingFormsCoverage}`,
  `- States missing full DD routing county coverage: ${nationalSummary.statesMissingDdCoverage}`,
  `- States missing full county office coverage: ${nationalSummary.statesMissingOfficeCoverage}`,
  `- States missing full education contact coverage: ${nationalSummary.statesMissingEducationCoverage}`,
  `- States missing any public-safe provider layer: ${nationalSummary.statesMissingPublicSafeProviderLayer}`,
  `- States missing any public-safe nonprofit layer: ${nationalSummary.statesMissingPublicSafeNonprofitLayer}`,
  `- States with advocate truth gap: ${nationalSummary.statesWithAdvocateTruthGap}`,
  `- Condition taxonomy count: ${taxonomySummary.conditionCount}/${MIN_CONDITIONS}`,
  `- Functional needs count: ${taxonomySummary.functionalNeedCount}/${MIN_FUNCTIONAL_NEEDS}`,
  '',
  '## Scope Notes',
  '',
  '- This audit measures modeled completeness for config, core program guides, required forms, DD routing, county offices, education coverage, and public-safe local directory presence across providers, nonprofits, and advocates.',
  '- It still does not prove sitemap/index eligibility or strict gold status on its own.',
];

if (nationalSummary.truthRegistrySnapshot) {
  mdLines.push(`- Truth registry snapshot: ${nationalSummary.truthRegistrySnapshot.strictGoldStates} strict-gold states, ${nationalSummary.truthRegistrySnapshot.publicSafeButBlockedStates} public-safe-but-blocked states, ${nationalSummary.truthRegistrySnapshot.registryMismatchStates} registry mismatches.`);
}

if (nationalSummary.advocateTruthSnapshot) {
  mdLines.push(`- Advocate truth snapshot: ${nationalSummary.advocateTruthSnapshot.statesWithCoverageLoss} state still loses county advocate coverage after truth gating (${nationalSummary.advocateTruthSnapshot.countiesLosingAllAdvocateCoverageAfterTruthGating} counties, ${nationalSummary.advocateTruthSnapshot.totalSyntheticPatternRows} synthetic-pattern rows quarantined).`);
}

mdLines.push(
  '',
  '## Top Blockers',
  '',
);

if (nationalSummary.topBlockers.length === 0) {
  mdLines.push('- none');
} else {
  for (const blocker of nationalSummary.topBlockers) {
    mdLines.push(`- ${blocker.blocker}: ${blocker.count} states`);
  }
}

mdLines.push('', '## State Ledger', '', '| State | Score | Config | Core Programs | Forms | DD Routing | Offices | Education | Providers | Nonprofits | Advocates | Info Complete | Blockers |', '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |');

for (const state of stateResults) {
  mdLines.push(
    `| ${state.stateName} | ${state.score}% | ${state.configCoverage}% | ${state.programGuideCoverage}% | ${state.formsCoverage}% | ${state.ddRoutingCoverage}% | ${state.officeCoverage}% | ${state.educationCoverage}% | ${state.publicSafeProviders > 0 ? 'yes' : 'no'} | ${state.publicSafeNonprofits > 0 ? 'yes' : 'no'} | ${state.advocateLayerPresent && state.advocateCoverageLossCounties === 0 && state.advocatePublicSafeCount > 0 ? 'yes' : 'no'} | ${state.infoComplete ? 'yes' : 'no'} | ${state.blockers.length ? state.blockers.join(', ') : 'none'} |`
  );
}

mdLines.push('', '## Lowest-Coverage States', '');
for (const state of [...stateResults].sort((a, b) => a.score - b.score || a.stateName.localeCompare(b.stateName)).slice(0, 10)) {
  mdLines.push(`### ${state.stateName}`);
  mdLines.push('');
  mdLines.push(`- Score: ${state.score}%`);
  mdLines.push(`- Blockers: ${state.blockers.length ? state.blockers.join(', ') : 'none'}`);
  if (state.weakPrograms.length) {
    mdLines.push(`- Weak core programs: ${state.weakPrograms.join(', ')}`);
  }
  if (state.weakForms.length) {
    mdLines.push(`- Weak required forms: ${state.weakForms.join(', ')}`);
  }
  mdLines.push('');
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
