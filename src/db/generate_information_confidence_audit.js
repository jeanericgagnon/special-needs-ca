import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const stateConfigsPath = path.join(repoRoot, 'frontend/src/lib/stateConfigs.ts');
const docsDir = path.join(repoRoot, 'docs/generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `information-confidence-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `information-confidence-audit-${generatedDate}.md`);
const truthRegistryPath = path.join(docsDir, `truth-registry-${generatedDate}.json`);

const db = new Database(dbPath, { readonly: true });
const stateConfigsContent = fs.readFileSync(stateConfigsPath, 'utf8');

const HIGH_CONFIDENCE_FORM_ORIGINS = new Set([
  'official_form_guide_extract',
  'repo_canonical_form_guide',
  'state_upgrade_staging_form',
  'curated_seed',
]);

const HIGH_CONFIDENCE_EDUCATION_ORIGINS = new Set([
  'curated_seed',
  'official_directory_extract',
  'scraped',
]);
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

const DIRECT_VERIFIED_STATUSES = new Set([
  'official_verified',
  'verified',
  'human_verified',
]);

const ACCEPTABLE_STATUSES = new Set([
  ...DIRECT_VERIFIED_STATUSES,
  'source_listed',
]);

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

function pct(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function scoreFromParts(parts) {
  const valid = parts.filter((part) => Number.isFinite(part));
  if (!valid.length) return 0;
  return Math.round((valid.reduce((sum, value) => sum + value, 0) / valid.length) * 10) / 10;
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

function hasNonEmpty(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function hasPublicSourceUrl(value) {
  if (!hasNonEmpty(value)) return false;
  try {
    const url = new URL(String(value).trim());
    return !SYNTHETIC_SOURCE_HOST_PATTERNS.some((pattern) => pattern.test(url.hostname));
  } catch {
    return false;
  }
}

function hasDirectoryContactSignal(record, options = {}) {
  const websiteField = options.websiteField || 'website';
  return hasNonEmpty(record.phone) || hasNonEmpty(record.email) || hasNonEmpty(record[websiteField]);
}

function isPublicSafeDirectoryRecord(record, options = {}) {
  return (
    PUBLIC_DIRECTORY_STATUSES.has(record.verification_status || '') &&
    hasPublicSourceUrl(record.source_url) &&
    hasDirectoryContactSignal(record, options) &&
    record.manual_review_required !== 1 &&
    !hasNonEmpty(record.unsupported_claim_flags)
  );
}

const truthRegistry = readJsonIfExists(truthRegistryPath);
const advocateTruthPath = findLatestGeneratedJson('advocate-truth-cleanup-audit-');
const advocateTruth = advocateTruthPath ? readJsonIfExists(advocateTruthPath) : null;

const states = db.prepare('SELECT id, name FROM states ORDER BY name').all();
const stateResults = [];
const overallSummary = {
  generatedAt: generatedDate,
  statesAudited: 0,
  highConfidenceStates: 0,
  mediumConfidenceStates: 0,
  fallbackHeavyStates: 0,
  directVerifiedPrograms: 0,
  totalPrograms: 0,
  directVerifiedForms: 0,
  totalRequiredForms: 0,
  directVerifiedEducationCounties: 0,
  totalEducationCounties: 0,
};

for (const state of states) {
  const stateBlock = parseStateBlock(state.id);
  const corePrograms = parseStringArray(stateBlock, 'corePrograms');
  const requiredForms = parseStringArray(stateBlock, 'requiredForms');

  const programs = corePrograms.length
    ? db.prepare(`SELECT id, verification_status FROM programs WHERE id IN (${corePrograms.map(() => '?').join(',')})`).all(...corePrograms)
    : [];
  const directVerifiedProgramRows = programs.filter((row) => DIRECT_VERIFIED_STATUSES.has(row.verification_status || '')).length;
  const acceptableProgramRows = programs.filter((row) => ACCEPTABLE_STATUSES.has(row.verification_status || '')).length;
  const programDirectness = pct(directVerifiedProgramRows, corePrograms.length);

  const forms = requiredForms.length
    ? db.prepare(`SELECT slug, data_origin, verification_status FROM forms_and_guides WHERE state_id = ? AND slug IN (${requiredForms.map(() => '?').join(',')})`).all(state.id, ...requiredForms)
    : [];
  const directVerifiedForms = forms.filter((row) =>
    HIGH_CONFIDENCE_FORM_ORIGINS.has(row.data_origin || '') &&
    DIRECT_VERIFIED_STATUSES.has(row.verification_status || '')
  ).length;
  const acceptableForms = forms.filter((row) =>
    HIGH_CONFIDENCE_FORM_ORIGINS.has(row.data_origin || '') &&
    ACCEPTABLE_STATUSES.has(row.verification_status || '')
  ).length;
  const fallbackForms = requiredForms.length - directVerifiedForms;
  const formDirectness = pct(directVerifiedForms, requiredForms.length);

  const countyCount = db.prepare('SELECT COUNT(*) AS count FROM counties WHERE state_id = ?').get(state.id).count;
  const countyEducationRows = db.prepare(`
    SELECT sd.county_id, sd.data_origin, sd.verification_status
    FROM school_districts sd
    JOIN counties c ON c.id = sd.county_id
    WHERE c.state_id = ?
      AND sd.source_url IS NOT NULL AND TRIM(sd.source_url) <> ''
      AND (
        (sd.spec_ed_contact_phone IS NOT NULL AND TRIM(sd.spec_ed_contact_phone) <> '') OR
        (sd.spec_ed_contact_email IS NOT NULL AND TRIM(sd.spec_ed_contact_email) <> '') OR
        (sd.website IS NOT NULL AND TRIM(sd.website) <> '')
      )
  `).all(state.id);

  const countyBestOrigin = new Map();
  for (const row of countyEducationRows) {
    const existing = countyBestOrigin.get(row.county_id);
    const isDirectVerified =
      HIGH_CONFIDENCE_EDUCATION_ORIGINS.has(row.data_origin || '') &&
      DIRECT_VERIFIED_STATUSES.has(row.verification_status || '');
    const isAcceptable =
      HIGH_CONFIDENCE_EDUCATION_ORIGINS.has(row.data_origin || '') &&
      ACCEPTABLE_STATUSES.has(row.verification_status || '');

    if (
      !existing ||
      (!existing.isDirectVerified && isDirectVerified) ||
      (!existing.isAcceptable && isAcceptable)
    ) {
      countyBestOrigin.set(row.county_id, {
        isDirectVerified,
        isAcceptable,
        data_origin: row.data_origin || 'unknown',
        verification_status: row.verification_status || 'unknown',
      });
    }
  }

  const countiesWithDirectEducation = [...countyBestOrigin.values()].filter((value) => value.isDirectVerified).length;
  const countiesWithAcceptableEducation = [...countyBestOrigin.values()].filter((value) => value.isAcceptable).length;
  const fallbackEducationCounties = countyCount - countiesWithDirectEducation;
  const educationDirectness = pct(countiesWithDirectEducation, countyCount);

  const providerRows = db.prepare(`
    SELECT rp.*
    FROM resource_providers rp
    JOIN counties c ON c.id = rp.county_id
    WHERE c.state_id = ?
  `).all(state.id);
  const publicSafeProviders = providerRows.filter((row) =>
    isPublicSafeDirectoryRecord(row, { websiteField: 'next_step_url' })
  ).length;
  const providerTruthScore = providerRows.length ? pct(publicSafeProviders, providerRows.length) : 0;

  const nonprofitRows = db.prepare(`
    SELECT n.*
    FROM nonprofit_organizations n
    JOIN counties c ON c.id = n.county_id
    WHERE c.state_id = ?
  `).all(state.id);
  const publicSafeNonprofits = nonprofitRows.filter((row) =>
    isPublicSafeDirectoryRecord(row)
  ).length;
  const nonprofitTruthScore = nonprofitRows.length ? pct(publicSafeNonprofits, nonprofitRows.length) : 0;

  const advocateTruthState = advocateTruth?.states?.find?.((entry) => entry.stateId === state.id) || null;
  const advocateLayerPresent = advocateTruthState ? advocateTruthState.totalAdvocates > 0 : false;
  const advocatePublicSafeCount = advocateTruthState?.publicSafeAdvocates || 0;
  const advocateCoverageLossCounties = advocateTruthState?.countiesLosingAllAdvocateCoverage || 0;
  const advocateTruthScore = advocateLayerPresent ? pct(advocatePublicSafeCount, advocateTruthState.totalAdvocates) : 0;
  const localDirectoryTruthScore = scoreFromParts([
    providerTruthScore,
    nonprofitTruthScore,
    advocateTruthScore,
  ]);

  const overallConfidence = scoreFromParts([programDirectness, formDirectness, educationDirectness, localDirectoryTruthScore]);
  const confidenceTier =
    overallConfidence >= 90 ? 'high' :
    overallConfidence >= 70 ? 'medium' :
    'fallback-heavy';

  const blockers = [];
  if (programDirectness < 100) blockers.push('programs-not-direct-verified');
  if (formDirectness < 100) blockers.push('forms-not-direct-verified');
  if (educationDirectness < 100) blockers.push('education-not-direct-verified');
  if (providerRows.length === 0) blockers.push('provider-layer-missing');
  else if (providerTruthScore < 100) blockers.push('providers-not-public-safe');
  if (nonprofitRows.length === 0) blockers.push('nonprofit-layer-missing');
  else if (nonprofitTruthScore < 100) blockers.push('nonprofits-not-public-safe');
  if (!advocateLayerPresent) blockers.push('advocate-layer-missing');
  else if (advocateCoverageLossCounties > 0 || advocateTruthScore < 100) blockers.push('advocate-truth-gap');

  stateResults.push({
    stateId: state.id,
    stateName: state.name,
    directVerifiedPrograms: directVerifiedProgramRows,
    acceptablePrograms: acceptableProgramRows,
    totalPrograms: corePrograms.length,
    programDirectness,
    directVerifiedForms,
    acceptableForms,
    fallbackForms,
    totalRequiredForms: requiredForms.length,
    formDirectness,
    directVerifiedEducationCounties: countiesWithDirectEducation,
    acceptableEducationCounties: countiesWithAcceptableEducation,
    fallbackEducationCounties,
    totalEducationCounties: countyCount,
    educationDirectness,
    totalProviderRows: providerRows.length,
    publicSafeProviders,
    providerTruthScore,
    totalNonprofitRows: nonprofitRows.length,
    publicSafeNonprofits,
    nonprofitTruthScore,
    advocateLayerPresent,
    advocatePublicSafeCount,
    advocateCoverageLossCounties,
    advocateTruthScore,
    localDirectoryTruthScore,
    overallConfidence,
    confidenceTier,
    blockers,
  });

  overallSummary.directVerifiedPrograms += directVerifiedProgramRows;
  overallSummary.totalPrograms += corePrograms.length;
  overallSummary.directVerifiedForms += directVerifiedForms;
  overallSummary.totalRequiredForms += requiredForms.length;
  overallSummary.directVerifiedEducationCounties += countiesWithDirectEducation;
  overallSummary.totalEducationCounties += countyCount;
}

stateResults.sort((a, b) => b.overallConfidence - a.overallConfidence || a.stateName.localeCompare(b.stateName));

overallSummary.statesAudited = stateResults.length;
overallSummary.highConfidenceStates = stateResults.filter((state) => state.confidenceTier === 'high').length;
overallSummary.mediumConfidenceStates = stateResults.filter((state) => state.confidenceTier === 'medium').length;
overallSummary.fallbackHeavyStates = stateResults.filter((state) => state.confidenceTier === 'fallback-heavy').length;
overallSummary.programDirectnessPct = pct(overallSummary.directVerifiedPrograms, overallSummary.totalPrograms);
overallSummary.formDirectnessPct = pct(overallSummary.directVerifiedForms, overallSummary.totalRequiredForms);
overallSummary.educationDirectnessPct = pct(overallSummary.directVerifiedEducationCounties, overallSummary.totalEducationCounties);
overallSummary.statesMissingProviderLayer = stateResults.filter((state) => state.totalProviderRows === 0).length;
overallSummary.statesWithProviderTruthGap = stateResults.filter((state) => state.totalProviderRows > 0 && state.providerTruthScore < 100).length;
overallSummary.statesMissingNonprofitLayer = stateResults.filter((state) => state.totalNonprofitRows === 0).length;
overallSummary.statesWithNonprofitTruthGap = stateResults.filter((state) => state.totalNonprofitRows > 0 && state.nonprofitTruthScore < 100).length;
overallSummary.statesWithAdvocateTruthGap = stateResults.filter((state) => state.advocateCoverageLossCounties > 0 || (state.advocateLayerPresent && state.advocateTruthScore < 100)).length;
overallSummary.scopeLimitations = [
  'This audit only measures direct-verification depth for core programs, required forms, and education county coverage.',
  'It now includes local directory truth signals for providers, nonprofits, and advocates, but it still does not prove sitemap eligibility or strict gold status on its own.',
];

if (truthRegistry?.summary) {
  overallSummary.truthRegistrySnapshot = {
    strictGoldStates: truthRegistry.summary.strictGoldStates,
    publicSafeButBlockedStates: truthRegistry.summary.publicSafeButBlockedStates,
    legacyGoldStates: truthRegistry.summary.legacyGoldStates,
    registryMismatchStates: truthRegistry.summary.registryMismatchStates,
  };
}

if (advocateTruth?.summary) {
  overallSummary.advocateTruthSnapshot = {
    statesWithCoverageLoss: advocateTruth.summary.statesWithCoverageLoss,
    countiesLosingAllAdvocateCoverageAfterTruthGating: advocateTruth.summary.countiesLosingAllAdvocateCoverageAfterTruthGating,
    totalSyntheticPatternRows: advocateTruth.summary.totalSyntheticPatternRows,
  };
}

const payload = { summary: overallSummary, states: stateResults };

const mdLines = [
  '# Generated Information Confidence Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  '## Summary',
  '',
  `- States audited: ${overallSummary.statesAudited}`,
  `- High-confidence states: ${overallSummary.highConfidenceStates}`,
  `- Medium-confidence states: ${overallSummary.mediumConfidenceStates}`,
  `- Fallback-heavy states: ${overallSummary.fallbackHeavyStates}`,
  `- Direct-verified core programs: ${overallSummary.directVerifiedPrograms}/${overallSummary.totalPrograms} (${overallSummary.programDirectnessPct}%)`,
  `- Direct-verified required forms: ${overallSummary.directVerifiedForms}/${overallSummary.totalRequiredForms} (${overallSummary.formDirectnessPct}%)`,
  `- Direct-verified education county coverage: ${overallSummary.directVerifiedEducationCounties}/${overallSummary.totalEducationCounties} (${overallSummary.educationDirectnessPct}%)`,
  `- States missing any provider layer: ${overallSummary.statesMissingProviderLayer}`,
  `- States with provider truth gaps in existing provider rows: ${overallSummary.statesWithProviderTruthGap}`,
  `- States with advocate truth gaps: ${overallSummary.statesWithAdvocateTruthGap}`,
  '',
  '## Scope Notes',
  '',
  '- This audit measures direct-verification strength for core programs, required forms, and education coverage, plus local directory truth signals for providers, nonprofits, and advocates.',
  '- It still does not prove full public-safe rendering, sitemap/index eligibility, or strict gold status by itself.',
];

if (overallSummary.truthRegistrySnapshot) {
  mdLines.push(`- Truth registry snapshot: ${overallSummary.truthRegistrySnapshot.strictGoldStates} strict-gold states, ${overallSummary.truthRegistrySnapshot.publicSafeButBlockedStates} public-safe-but-blocked states, ${overallSummary.truthRegistrySnapshot.registryMismatchStates} registry mismatches.`);
}

if (overallSummary.advocateTruthSnapshot) {
  mdLines.push(`- Advocate truth snapshot: ${overallSummary.advocateTruthSnapshot.statesWithCoverageLoss} state still loses county advocate coverage after truth gating (${overallSummary.advocateTruthSnapshot.countiesLosingAllAdvocateCoverageAfterTruthGating} counties, ${overallSummary.advocateTruthSnapshot.totalSyntheticPatternRows} synthetic-pattern rows quarantined).`);
}

mdLines.push(
  '',
  '## State Ledger',
  '',
  '| State | Program Directness | Form Directness | Education Directness | Local Directory Truth | Overall Confidence | Tier | Main Blockers |',
  '| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |',
);

for (const state of stateResults) {
  mdLines.push(`| ${state.stateName} | ${state.programDirectness}% | ${state.formDirectness}% | ${state.educationDirectness}% | ${state.localDirectoryTruthScore}% | ${state.overallConfidence}% | ${state.confidenceTier} | ${state.blockers.join(', ') || 'none'} |`);
}

mdLines.push('', '## Lowest-Confidence States', '');
for (const state of [...stateResults].sort((a, b) => a.overallConfidence - b.overallConfidence || a.stateName.localeCompare(b.stateName)).slice(0, 10)) {
  mdLines.push(`- ${state.stateName}: ${state.overallConfidence}% overall (${state.confidenceTier}); programs ${state.directVerifiedPrograms}/${state.totalPrograms}, forms ${state.directVerifiedForms}/${state.totalRequiredForms}, education ${state.directVerifiedEducationCounties}/${state.totalEducationCounties}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
