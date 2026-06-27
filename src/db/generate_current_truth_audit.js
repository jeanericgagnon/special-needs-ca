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
const verifiedCountiesPath = path.join(repoRoot, 'frontend/src/lib/verifiedCounties.ts');
const publicTruthPath = path.join(repoRoot, 'frontend/src/lib/publicTruth.ts');
const countyCatchAllPath = path.join(repoRoot, 'frontend/src/app/benefits/[state]/[[...slug]]/page.tsx');
const countyLeafPath = path.join(repoRoot, 'frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx');
const countyRootPath = path.join(repoRoot, 'frontend/src/app/counties/[state]/[county]/page.tsx');
const homepagePath = path.join(repoRoot, 'frontend/src/app/page.tsx');
const dashboardPath = path.join(repoRoot, 'frontend/src/app/dashboard/page.tsx');
const sitemapPath = path.join(repoRoot, 'frontend/src/app/sitemaps/counties.xml/route.ts');
const docsDir = path.join(repoRoot, 'docs/generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `current-truth-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `current-truth-audit-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

const stateConfigsContent = fs.readFileSync(stateConfigsPath, 'utf8');
const verifiedCountiesContent = fs.readFileSync(verifiedCountiesPath, 'utf8');
const publicTruthContent = fs.readFileSync(publicTruthPath, 'utf8');
const countyCatchAllContent = fs.readFileSync(countyCatchAllPath, 'utf8');
const countyLeafContent = fs.readFileSync(countyLeafPath, 'utf8');
const countyRootContent = fs.readFileSync(countyRootPath, 'utf8');
const homepageContent = fs.readFileSync(homepagePath, 'utf8');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

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

const advocateTruthCleanupPath = findLatestGeneratedJson('advocate-truth-cleanup-audit-');
const advocateTruthCleanup = advocateTruthCleanupPath
  ? JSON.parse(fs.readFileSync(advocateTruthCleanupPath, 'utf8'))
  : { states: [] };

const GENERATED_AT = generatedDate;
const KEY_STATES = ['california', 'texas', 'new-york', 'pennsylvania', 'florida', 'illinois', 'ohio', 'georgia'];
const WEIGHTED_STATUS = {
  official_verified: 1,
  verified: 1,
  human_verified: 1,
  source_listed: 0.5,
  pending_review: 0.5,
  manual_review_required: 0,
  scraped_unverified: 0.25,
  unverified: 0.25,
};
const FULLY_VERIFIED_STATUSES = new Set(['official_verified', 'verified', 'human_verified']);
const PUBLIC_ELIGIBLE_STATUSES = new Set(['official_verified', 'verified', 'human_verified', 'source_listed']);
const SYNTHETIC_SOURCE_HOST_PATTERNS = [
  /^www\.advocate\./,
  /^www\.therapy\./,
  /^www\.legal\./,
  /^www\.pediatrictherapy\./,
  /^[a-z]{2}-pa\.org$/,
];
const SYNTHETIC_EDUCATION_GOV_HOST_PATTERN = /^www\.[a-z-]+-education\.gov$/i;

function parseHostname(url = '') {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function hasPlaceholderPhone(phone = '') {
  return phone.includes('(555)') || /\b555-/.test(phone);
}

function hasPlaceholderEmail(email = '') {
  return /@example\./i.test(email);
}

function hasPublicContactSignal(record) {
  const phone = record.phone || record.spec_ed_contact_phone || record.intake_phone || '';
  const email = record.email || record.spec_ed_contact_email || '';
  const website = record.website || '';

  return Boolean(
    (phone && !hasPlaceholderPhone(phone)) ||
    (email && !hasPlaceholderEmail(email)) ||
    website
  );
}

function hasValidPublicSourceUrl(record) {
  const sourceUrl = record.source_url || '';
  if (!sourceUrl) return false;

  try {
    const url = new URL(sourceUrl);
    return (
      !SYNTHETIC_SOURCE_HOST_PATTERNS.some((pattern) => pattern.test(url.hostname)) &&
      !SYNTHETIC_EDUCATION_GOV_HOST_PATTERN.test(url.hostname)
    );
  } catch {
    return false;
  }
}

function isPublicRecordEligible(record) {
  if (!record) return false;
  if (record.data_origin === 'programmatic_fallback' || record.data_origin === 'generated_county_fallback') {
    return false;
  }

  return (
    PUBLIC_ELIGIBLE_STATUSES.has(record.verification_status || '') &&
    hasValidPublicSourceUrl(record) &&
    hasPublicContactSignal(record)
  );
}

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

function parseStringValue(block, key, fallback = '') {
  const match = block.match(new RegExp(`${key}:\\s*['"](.*?)['"]`));
  return match ? match[1] : fallback;
}

function parseVerifiedCountyIds() {
  return [...verifiedCountiesContent.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

function deriveSitemapBatchDefault() {
  const match = sitemapContent.match(/SITEMAP_BATCH\s*=\s*parseInt\(process\.env\.SITEMAP_BATCH\s*\|\|\s*'(\d+)'/);
  return match ? Number(match[1]) : null;
}

function parsePublicTruthStringArray(constName) {
  const match = publicTruthContent.match(new RegExp(`${constName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const;`));
  if (!match) return [];
  return match[1]
    .split(',')
    .map((value) => value.trim().replace(/['"]/g, ''))
    .filter(Boolean);
}

function parsePublicTruthStateCountyMap(constName) {
  const match = publicTruthContent.match(new RegExp(`${constName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*as const;`));
  if (!match) return {};

  const block = match[1];
  const entries = [...block.matchAll(/['"]?([a-z-]+)['"]?\s*:\s*\[([^\]]*)\]|['"]?([a-z-]+)['"]?\s*:\s*HIGH_FIDELITY_COUNTY_DIAGNOSIS_IDS/g)];
  const countyMap = {};

  for (const entry of entries) {
    const stateId = entry[1] || entry[3];
    const inlineValues = entry[2];

    if (inlineValues !== undefined) {
      countyMap[stateId] = inlineValues
        .split(',')
        .map((value) => value.trim().replace(/['"]/g, ''))
        .filter(Boolean);
    } else {
      countyMap[stateId] = parsePublicTruthStringArray('HIGH_FIDELITY_COUNTY_DIAGNOSIS_IDS');
    }
  }

  return countyMap;
}

function hasFakePublicLocalAssets() {
  return (
    countyCatchAllContent.includes('Inclusive Play Space') ||
    countyCatchAllContent.includes('Family Resource Center Network') ||
    countyCatchAllContent.includes('Pediatric Therapy Hub') ||
    countyCatchAllContent.includes('(555) 019-2834') ||
    countyCatchAllContent.includes('(555) 019-5823') ||
    countyCatchAllContent.includes('(555) 019-9238') ||
    countyLeafContent.includes('(555) 019-2834') ||
    countyLeafContent.includes('(555) 019-5823') ||
    countyLeafContent.includes('(555) 019-9238')
  );
}

function auditFileSurface(name, content, requiredPatterns, bannedPatterns) {
  const missingRequired = requiredPatterns
    .filter(({ pattern }) => !pattern.test(content))
    .map(({ label }) => label);

  const foundBanned = bannedPatterns
    .filter(({ pattern }) => pattern.test(content))
    .map(({ label }) => label);

  return {
    name,
    passes: missingRequired.length === 0 && foundBanned.length === 0,
    missingRequired,
    foundBanned,
  };
}

function buildRouteIntegrityAudits() {
  const helperAudit = auditFileSurface(
    'publicTruth.ts',
    publicTruthContent,
    [
      { label: 'public record gating requires acceptable verification status', pattern: /isAcceptablePublicVerificationStatus\(record\.verification_status\)/ },
      { label: 'public record gating requires source_url truth check', pattern: /hasPublicSourceUrl\(record\)/ },
      { label: 'public record gating requires public contact signal', pattern: /hasPublicContactSignal\(record\)/ },
      { label: 'verified diagnosis allowlist exists', pattern: /VERIFIED_DIAGNOSIS_SLUGS/ },
      { label: 'synthetic source host patterns are blocked', pattern: /SYNTHETIC_SOURCE_HOST_PATTERNS/ },
    ],
    []
  );

  const publicSurfaceAudits = [
    auditFileSurface(
      'benefits/[state]/[[...slug]]/page.tsx',
      countyCatchAllContent,
      [
        { label: 'shared directory foundation panel is used', pattern: /DirectoryFoundationPanel/ },
        { label: 'local providers are filtered through truth eligibility', pattern: /getLocalProviders\(countyId\)\)\.filter\(isPublic(?:Directory)?RecordEligible\)/ },
        { label: 'local advocates are filtered through truth eligibility', pattern: /getIepAdvocates\(countyId\)\)\.filter\(isPublic(?:Directory)?RecordEligible\)/ },
        { label: 'truth-safe county banner is present', pattern: /shared truth eligibility rules/ },
      ],
      [
        { label: 'legacy vetted wording', pattern: /\bVetted\b/i },
        { label: 'synthetic playground card', pattern: /Inclusive Play Space/ },
        { label: 'synthetic clinic card', pattern: /Pediatric Therapy Hub/ },
        { label: 'synthetic support group card', pattern: /Family Resource Center Network/ },
        { label: 'placeholder phone number', pattern: /\(555\)|\b555-/ },
        { label: 'placeholder email address', pattern: /@example\./i },
        { label: 'hardcoded reviewer persona', pattern: /Sarah Jenkins/ },
        { label: 'fake empty playground box', pattern: /No Inclusive Playgrounds Indexed/ },
        { label: 'fake empty clinic box', pattern: /No Pediatric Clinics Indexed/ },
        { label: 'fake empty support box', pattern: /No Support Chapters Indexed/ },
      ]
    ),
    auditFileSurface(
      'benefits/[state]/[diagnosis]/[county]/page.tsx',
      countyLeafContent,
      [
        { label: 'shared directory foundation panel is used', pattern: /DirectoryFoundationPanel/ },
        { label: 'public advocate copy references truth eligibility', pattern: /shared truth eligibility checks/ },
        { label: 'local advocates are filtered through truth eligibility before schema/rendering', pattern: /getIepAdvocates\(p\.county\)\)\.filter\(isPublic(?:Directory)?RecordEligible\)/ },
      ],
      [
        { label: 'legacy vetted wording', pattern: /\bVetted\b/i },
        { label: 'placeholder phone number', pattern: /\(555\)|\b555-/ },
        { label: 'placeholder email address', pattern: /@example\./i },
        { label: 'hardcoded reviewer persona', pattern: /Sarah Jenkins/ },
      ]
    ),
    auditFileSurface(
      'counties/[state]/[county]/page.tsx',
      countyRootContent,
      [
        { label: 'shared directory foundation panel is used', pattern: /DirectoryFoundationPanel/ },
      ],
      [
        { label: 'legacy vetted wording', pattern: /\bVetted\b/i },
        { label: 'placeholder phone number', pattern: /\(555\)|\b555-/ },
        { label: 'placeholder email address', pattern: /@example\./i },
        { label: 'hardcoded reviewer persona', pattern: /Sarah Jenkins/ },
      ]
    ),
  ];

  const routeIntegrityFailures = [
    ...(!helperAudit.passes ? [{
      scope: helperAudit.name,
      missingRequired: helperAudit.missingRequired,
      foundBanned: helperAudit.foundBanned,
    }] : []),
    ...publicSurfaceAudits
      .filter((audit) => !audit.passes)
      .map((audit) => ({
        scope: audit.name,
        missingRequired: audit.missingRequired,
        foundBanned: audit.foundBanned,
      })),
  ];

  return {
    helperAudit,
    publicSurfaceAudits,
    routeIntegrityFailures,
  };
}

function getExpectedCountyCount(stateId, actualCount) {
  if (stateId === 'california') return 58;
  if (stateId === 'texas') return 254;
  return actualCount;
}

function getCoreWaitlistPrograms(stateId, stateCode) {
  if (stateId === 'california') {
    return [
      'ihss-for-children',
      'regional-centers',
      'early-start',
      'self-determination-program',
      'medi-cal-for-kids-and-teens',
      'california-childrens-services',
      'hearing-aid-coverage',
      'ssi-for-children',
      'calable',
      'iep-special-education',
      'hcba',
    ];
  }
  if (stateId === 'texas') {
    return ['tx-hcs', 'tx-class', 'tx-txhml', 'tx-mdcp', 'tx-eci', 'tx-tea-sped'];
  }
  if (stateId === 'new-york') {
    return ['ny-opwdd-waiver', 'ny-opwdd-self-direction', 'ny-medicaid'];
  }
  if (stateId === 'pennsylvania') {
    return ['pa-consolidated-waiver', 'pa-community-living-waiver', 'pa-medicaid'];
  }
  if (stateId === 'florida') {
    return ['fl-ibudget', 'fl-cdc-plus', 'fl-medicaid-dcf'];
  }
  if (stateId === 'illinois') {
    return ['il-childrens-support-waiver', 'il-adults-dd-waiver', 'il-medicaid'];
  }
  if (stateId === 'ohio') {
    return ['oh-individual-options-waiver', 'oh-level-one-waiver', 'oh-medicaid'];
  }
  if (stateId === 'georgia') {
    return ['ga-comp-waiver', 'ga-now-waiver', 'ga-medicaid'];
  }
  return [`${stateCode}-dd-waiver`, `${stateCode}-dd-self-direction`, `${stateCode}-medicaid`];
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

function collectStatusSummary(records) {
  const summary = {
    total: records.length,
    fallback: 0,
    verified: 0,
    source_listed: 0,
    manual_review_required: 0,
    null_status: 0,
    unverified: 0,
    missingPublicSignal: 0,
    weightedDepth: 0,
  };

  let weightedTotal = 0;

  for (const record of records) {
    const status = record.verification_status || null;
    const isFallback =
      record.data_origin === 'programmatic_fallback' ||
      record.data_origin === 'generated_county_fallback';

    if (isFallback) {
      summary.fallback += 1;
    }

    if (status === null) {
      summary.null_status += 1;
    } else if (status in WEIGHTED_STATUS) {
      if (status === 'official_verified' || status === 'verified' || status === 'human_verified') {
        summary.verified += 1;
      } else if (status === 'source_listed') {
        summary.source_listed += 1;
      } else if (status === 'manual_review_required') {
        summary.manual_review_required += 1;
      } else {
        summary.unverified += 1;
      }
    } else {
      summary.unverified += 1;
    }

    let weight = WEIGHTED_STATUS[status] ?? 0.25;

    if (isFallback) {
      weight = 0;
    }

    const hasContactSignal = hasPublicContactSignal(record);
    const hasValidSourceUrl = hasValidPublicSourceUrl(record);

    if ((!hasValidSourceUrl || !hasContactSignal) && PUBLIC_ELIGIBLE_STATUSES.has(status || '')) {
      summary.missingPublicSignal += 1;
      weight = 0;
    } else if (!hasValidSourceUrl || !hasContactSignal) {
      weight = 0;
    }

    weightedTotal += weight;
  }

  summary.weightedDepth = summary.total > 0 ? Number(((weightedTotal / summary.total) * 100).toFixed(1)) : 0;
  return summary;
}

function countDistinctCounties(rows, key = 'county_id') {
  return new Set(rows.map((row) => row[key]).filter(Boolean)).size;
}

function parseDelimitedIds(value) {
  return String(value || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function countIntersection(left, rightSet) {
  return left.filter((value) => rightSet.has(value)).length;
}

function buildCountyEligibilityMap(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!row.county_id) continue;
    if (!map.has(row.county_id)) map.set(row.county_id, []);
    map.get(row.county_id).push(row);
  }
  return map;
}

function expandRegionalEducationCountyRecords(rows, countyIds) {
  const countyIdSet = new Set(countyIds);
  const expanded = [];

  for (const row of rows) {
    const websiteHost = parseHostname(row.website || '');
    const sourceHost = parseHostname(row.source_url || '');
    if (!websiteHost || !sourceHost) continue;
    if (SYNTHETIC_EDUCATION_GOV_HOST_PATTERN.test(websiteHost) || SYNTHETIC_EDUCATION_GOV_HOST_PATTERN.test(sourceHost)) {
      continue;
    }

    for (const countyId of parseDelimitedIds(row.counties_served)) {
      if (!countyIdSet.has(countyId)) continue;
      expanded.push({ ...row, county_id: countyId });
    }
  }

  return expanded;
}

function countCoveredCounties(...maps) {
  const covered = new Set();

  for (const map of maps) {
    for (const [countyId, rows] of map.entries()) {
      if (rows.some((row) => isPublicRecordEligible(row))) {
        covered.add(countyId);
      }
    }
  }

  return covered.size;
}

function hasEligibleCountyRecord(map, countyId, predicate = () => true) {
  return (map.get(countyId) || []).some((row) => predicate(row) && isPublicRecordEligible(row));
}

function countIndexSafeCountyRoots(stateId, countyIds, verifiedCountyIds, countyMaps) {
  if (stateId === 'california') {
    return countyIds.filter((countyId) => (
      hasEligibleCountyRecord(countyMaps.regionalCenters, countyId) &&
      hasEligibleCountyRecord(countyMaps.selpas, countyId) &&
      hasEligibleCountyRecord(countyMaps.offices, countyId, (row) => row.program_id === 'ihss-for-children') &&
      hasEligibleCountyRecord(countyMaps.offices, countyId, (row) => row.program_id === 'medi-cal-for-kids-and-teens') &&
      hasEligibleCountyRecord(countyMaps.offices, countyId, (row) => row.program_id === 'california-childrens-services') &&
      (
        hasEligibleCountyRecord(countyMaps.schoolDistricts, countyId) ||
        hasEligibleCountyRecord(countyMaps.regionalEducation, countyId)
      )
    )).length;
  }

  return countyIds.filter((countyId) => (
    verifiedCountyIds.includes(countyId) &&
    (
      hasEligibleCountyRecord(countyMaps.regionalCenters, countyId) ||
      hasEligibleCountyRecord(countyMaps.selpas, countyId) ||
      hasEligibleCountyRecord(countyMaps.offices, countyId) ||
      hasEligibleCountyRecord(countyMaps.regionalEducation, countyId) ||
      hasEligibleCountyRecord(countyMaps.schoolDistricts, countyId) ||
      hasEligibleCountyRecord(countyMaps.nonprofits, countyId)
    )
  )).length;
}

function calculateCategoryScore(coveragePct, weightedDepthPct, densityPct = 100) {
  return Number((coveragePct * 0.35 + weightedDepthPct * 0.45 + densityPct * 0.2).toFixed(1));
}

function hasAnyIncompleteTrust(summary) {
  return summary.null_status > 0 || summary.fallback > 0 || summary.missingPublicSignal > 0;
}

function hasAnyPartialTrust(summary) {
  return hasAnyIncompleteTrust(summary) || summary.source_listed > 0 || summary.manual_review_required > 0 || summary.unverified > 0;
}

function pushBlocker(blockers, category, message) {
  blockers.push({ category, message });
}

function buildStateVerdict(state, product) {
  const blockers = [];
  const publicCategories = [
    ['ddRouting', state.records.ddRouting],
    ['localOffices', state.records.localOffices],
    ['education', state.records.education],
    ['nonprofits', state.records.nonprofits],
    ['advocates', state.records.advocates],
  ];

  if (product.routeIntegrityFailures.length > 0) {
    const failedScopes = product.routeIntegrityFailures.map((failure) => failure.scope).join(', ');
    pushBlocker(blockers, 'publicTruth', `Route integrity audit failed for: ${failedScopes}.`);
  }

  if (product.hasFakePublicLocalAssets) {
    pushBlocker(blockers, 'publicTruth', 'County or county-diagnosis pages still include synthetic local assets in public output.');
  }

  if (state.records.ddRouting.null_status > 0) {
    pushBlocker(blockers, 'trustMetadata', `DD routing has ${state.records.ddRouting.null_status} rows with null verification_status.`);
  }

  for (const [label, summary] of publicCategories) {
    if (summary.fallback > 0) {
      pushBlocker(blockers, label, `${summary.fallback} rows still use fallback data origins.`);
    }
    if (summary.missingPublicSignal > 0) {
      pushBlocker(blockers, label, `${summary.missingPublicSignal} rows are missing a public source URL or contact signal.`);
    }
  }

  if (state.waitlists.missing.length > 0) {
    pushBlocker(blockers, 'waitlists', `Missing core waitlist items: ${state.waitlists.missing.join(', ')}.`);
  }

  if (state.coverage.ddRouting < 100) {
    pushBlocker(blockers, 'ddRouting', `DD routing covers ${state.coverage.ddRouting}% of expected counties.`);
  }
  if (state.coverage.localOffices < 100) {
    pushBlocker(blockers, 'localOffices', `Core office coverage is ${state.coverage.localOffices}% of expected counties.`);
  }
  if (state.coverage.education < 100) {
    pushBlocker(blockers, 'education', `Education coverage is ${state.coverage.education}% of expected counties.`);
  }
  if (state.countyDiagnosis.priorityCoveragePct < 100) {
    pushBlocker(
      blockers,
      'countyDiagnosis',
      `High-fidelity county-diagnosis coverage reaches ${state.countyDiagnosis.priorityCoveragePct}% of priority counties (${state.countyDiagnosis.highFidelityPriorityCount}/${state.countyDiagnosis.priorityCountyCount}).`
    );
  }

  if ((state.advocateTruth?.countiesLosingCoverage || 0) > 0) {
    pushBlocker(
      blockers,
      'advocates',
      `${state.advocateTruth.countiesLosingCoverage} counties lose all advocate coverage after truth gating.`
    );
  }

  const publicSafe = (
    product.routeIntegrityFailures.length === 0 &&
    !product.hasFakePublicLocalAssets &&
    state.records.ddRouting.null_status === 0 &&
    publicCategories.every(([, summary]) => !hasAnyIncompleteTrust(summary))
  );
  const indexSafe = publicSafe && state.indexCoveragePct >= 100;

  if (state.records.ddRouting.source_listed > 0) {
    pushBlocker(blockers, 'ddRouting', `${state.records.ddRouting.source_listed} DD routing rows are only source-listed.`);
  }
  if (state.records.ddRouting.manual_review_required > 0) {
    pushBlocker(blockers, 'ddRouting', `${state.records.ddRouting.manual_review_required} DD routing rows still require manual review.`);
  }
  if (state.records.ddRouting.unverified > 0) {
    pushBlocker(blockers, 'ddRouting', `${state.records.ddRouting.unverified} DD routing rows are still unverified.`);
  }
  if (state.records.localOffices.source_listed > 0) {
    pushBlocker(blockers, 'localOffices', `${state.records.localOffices.source_listed} office rows are only source-listed.`);
  }
  if (state.records.localOffices.manual_review_required > 0) {
    pushBlocker(blockers, 'localOffices', `${state.records.localOffices.manual_review_required} office rows still require manual review.`);
  }
  if (state.records.localOffices.unverified > 0) {
    pushBlocker(blockers, 'localOffices', `${state.records.localOffices.unverified} office rows are still unverified.`);
  }
  if (state.records.education.source_listed > 0) {
    pushBlocker(blockers, 'education', `${state.records.education.source_listed} education rows are only source-listed.`);
  }
  if (state.records.education.manual_review_required > 0) {
    pushBlocker(blockers, 'education', `${state.records.education.manual_review_required} education rows still require manual review.`);
  }
  if (state.records.education.unverified > 0) {
    pushBlocker(blockers, 'education', `${state.records.education.unverified} education rows are still unverified.`);
  }
  if (state.records.nonprofits.source_listed > 0) {
    pushBlocker(blockers, 'nonprofits', `${state.records.nonprofits.source_listed} nonprofit rows are only source-listed.`);
  }
  if (state.records.nonprofits.manual_review_required > 0) {
    pushBlocker(blockers, 'nonprofits', `${state.records.nonprofits.manual_review_required} nonprofit rows still require manual review.`);
  }
  if (state.records.nonprofits.unverified > 0) {
    pushBlocker(blockers, 'nonprofits', `${state.records.nonprofits.unverified} nonprofit rows are still unverified.`);
  }
  if (state.records.advocates.manual_review_required > 0) {
    pushBlocker(blockers, 'advocates', `${state.records.advocates.manual_review_required} advocate/provider rows still require manual review.`);
  }
  if (state.records.advocates.source_listed > 0) {
    pushBlocker(blockers, 'advocates', `${state.records.advocates.source_listed} advocate/provider rows are only source-listed.`);
  }
  if (state.records.advocates.unverified > 0) {
    pushBlocker(blockers, 'advocates', `${state.records.advocates.unverified} advocate/provider rows are still unverified.`);
  }

  const goldEligible = (
    publicSafe &&
    state.waitlists.missing.length === 0 &&
    state.indexCoveragePct >= 100 &&
    state.coverage.ddRouting === 100 &&
    state.coverage.localOffices === 100 &&
    state.coverage.education === 100 &&
    state.countyDiagnosis.priorityCoveragePct === 100 &&
    (state.advocateTruth?.countiesLosingCoverage || 0) === 0 &&
    publicCategories.every(([, summary]) => !hasAnyPartialTrust(summary))
  );

  return {
    publicSafe,
    indexSafe,
    goldEligible,
    blockers,
  };
}

function summarizeState(stateRecord, verifiedCountyIds) {
  const stateId = stateRecord.id;
  const stateCode = stateRecord.code.toLowerCase();
  const stateBlock = parseStateBlock(stateId);
  const corePrograms = parseStringArray(stateBlock, 'corePrograms');
  const requiredForms = parseStringArray(stateBlock, 'requiredForms');
  const priorityMetroCounties = parseStringArray(stateBlock, 'priorityMetroCounties');
  const highFidelityCountyDiagnosisMap = parsePublicTruthStateCountyMap('HIGH_FIDELITY_COUNTY_DIAGNOSIS_COUNTIES_BY_STATE');
  const highFidelityCountyDiagnosisIds = new Set(highFidelityCountyDiagnosisMap[stateId] || []);
  const catchmentName = parseStringValue(stateBlock, 'catchmentName', 'Local DD Agency');
  const educationAgencyLabel = parseStringValue(stateBlock, 'educationAgencyLabel', 'Regional Special Education Agencies');

  const countyRows = db.prepare('SELECT id FROM counties WHERE state_id = ? ORDER BY id').all(stateId);
  const countyIds = countyRows.map((row) => row.id);
  const countyCount = countyIds.length;
  const expectedCountyCount = getExpectedCountyCount(stateId, countyCount);

  const ddRoutingRecords = db.prepare(`
    SELECT id, data_origin, verification_status, intake_phone AS phone, website, source_url
    FROM state_resource_agencies
    WHERE state_id = ?
  `).all(stateId);

  const officePrograms = getCoreOfficePrograms(stateId, stateCode);
  const officeRecords = db.prepare(`
    SELECT co.id, co.county_id, co.program_id, co.data_origin, co.verification_status, co.phone, co.email, co.website, co.source_url
    FROM county_offices co
    JOIN counties c ON c.id = co.county_id
    WHERE c.state_id = ?
      AND co.program_id IN (${officePrograms.map(() => '?').join(',')})
  `).all(stateId, ...officePrograms);

  const regionalEducationRecords = db.prepare(`
    SELECT id, data_origin, verification_status, website, source_url, counties_served
    FROM regional_education_agencies
    WHERE state_id = ?
  `).all(stateId);

  const schoolDistrictRecords = db.prepare(`
    SELECT sd.id, sd.county_id, sd.data_origin, sd.verification_status, sd.spec_ed_contact_phone, sd.spec_ed_contact_email, sd.website, sd.source_url
    FROM school_districts sd
    JOIN counties c ON c.id = sd.county_id
    WHERE c.state_id = ?
  `).all(stateId);

  const nonprofitRecords = db.prepare(`
    SELECT no.id, no.county_id, no.data_origin, no.verification_status, no.phone, no.website, no.source_url
    FROM nonprofit_organizations no
    JOIN counties c ON c.id = no.county_id
    WHERE c.state_id = ?
  `).all(stateId);

  const regionalCenterCountyRecords = db.prepare(`
    SELECT rc.id, rcc.county_id, rc.data_origin, rc.verification_status, rc.intake_phone, rc.website, rc.source_url
    FROM regional_centers rc
    JOIN regional_center_counties rcc ON rcc.regional_center_id = rc.id
    WHERE rc.state_id = ?
  `).all(stateId);

  const selpaCountyRecords = db.prepare(`
    SELECT s.id, sc.county_id, s.data_origin, s.verification_status, s.website, s.source_url
    FROM selpas s
    JOIN selpa_counties sc ON sc.selpa_id = s.id
    JOIN counties c ON c.id = sc.county_id
    WHERE c.state_id = ?
  `).all(stateId);

  const advocateRecords = db.prepare(`
    SELECT DISTINCT ia.id, ia.data_origin, ia.verification_status, ia.phone, ia.email, ia.website, ia.source_url
    FROM iep_advocates ia
    JOIN iep_advocate_counties iac ON iac.iep_advocate_id = ia.id
    JOIN counties c ON c.id = iac.county_id
    WHERE c.state_id = ?
  `).all(stateId);

  const waitlistPrograms = getCoreWaitlistPrograms(stateId, stateCode);
  const presentWaitlists = db.prepare(`
    SELECT DISTINCT program_id
    FROM program_waitlists
    WHERE program_id IN (${waitlistPrograms.map(() => '?').join(',')})
  `).all(...waitlistPrograms).map((row) => row.program_id);
  const missingWaitlists = waitlistPrograms.filter((programId) => !presentWaitlists.includes(programId));

  const ddSummary = collectStatusSummary(ddRoutingRecords);
  const officeSummary = collectStatusSummary(officeRecords);
  const educationSummary = collectStatusSummary([...regionalEducationRecords, ...schoolDistrictRecords]);
  const nonprofitSummary = collectStatusSummary(nonprofitRecords);
  const advocateSummary = collectStatusSummary(advocateRecords);
  const regionalEducationCountyRecords = expandRegionalEducationCountyRecords(regionalEducationRecords, countyIds);
  const indexedCountyRoots = countIndexSafeCountyRoots(
    stateId,
    countyIds,
    verifiedCountyIds,
    {
      regionalCenters: buildCountyEligibilityMap(regionalCenterCountyRecords),
      selpas: buildCountyEligibilityMap(selpaCountyRecords),
      offices: buildCountyEligibilityMap(officeRecords),
      regionalEducation: buildCountyEligibilityMap(regionalEducationCountyRecords),
      schoolDistricts: buildCountyEligibilityMap(schoolDistrictRecords),
      nonprofits: buildCountyEligibilityMap(nonprofitRecords),
    }
  );

  const officeCoverage = expectedCountyCount > 0 ? Number(((countDistinctCounties(officeRecords) / expectedCountyCount) * 100).toFixed(1)) : 0;
  const educationCoverageCount = countCoveredCounties(
    buildCountyEligibilityMap(schoolDistrictRecords),
    buildCountyEligibilityMap(regionalEducationCountyRecords)
  );
  const districtCoverage = expectedCountyCount > 0 ? Number(((educationCoverageCount / expectedCountyCount) * 100).toFixed(1)) : 0;
  const nonprofitCoverage = expectedCountyCount > 0 ? Number(((countDistinctCounties(nonprofitRecords) / expectedCountyCount) * 100).toFixed(1)) : 0;
  const advocateCoverage = expectedCountyCount > 0
    ? Number(((db.prepare(`
        SELECT COUNT(DISTINCT iac.county_id) AS count
        FROM iep_advocate_counties iac
        JOIN counties c ON c.id = iac.county_id
        WHERE c.state_id = ?
      `).get(stateId).count / expectedCountyCount) * 100).toFixed(1))
    : 0;
  const ddCoverage = expectedCountyCount > 0
    ? Number(((db.prepare(`
        SELECT COUNT(DISTINCT rcc.county_id) AS count
        FROM regional_center_counties rcc
        JOIN counties c ON c.id = rcc.county_id
        WHERE c.state_id = ?
      `).get(stateId).count / expectedCountyCount) * 100).toFixed(1))
    : 0;

  const waitlistCoverage = waitlistPrograms.length > 0
    ? Number(((presentWaitlists.length / waitlistPrograms.length) * 100).toFixed(1))
    : 0;
  const waitlistScore = calculateCategoryScore(waitlistCoverage, 100, 100);

  const categoryScores = {
    ddRouting: calculateCategoryScore(ddCoverage, ddSummary.weightedDepth),
    localOffices: calculateCategoryScore(officeCoverage, officeSummary.weightedDepth),
    education: calculateCategoryScore(districtCoverage, educationSummary.weightedDepth),
    nonprofits: calculateCategoryScore(nonprofitCoverage, nonprofitSummary.weightedDepth),
    advocates: calculateCategoryScore(advocateCoverage, advocateSummary.weightedDepth, Math.min(100, countyCount > 0 ? (advocateRecords.length / expectedCountyCount) * 100 : 0)),
    waitlists: waitlistScore,
  };

  const compositeReadiness = Number((
    Object.values(categoryScores).reduce((sum, value) => sum + value, 0) / Object.values(categoryScores).length
  ).toFixed(1));
  const highFidelityPriorityCount = countIntersection(priorityMetroCounties, highFidelityCountyDiagnosisIds);
  const priorityCountyCount = priorityMetroCounties.length;
  const countyDiagnosisPriorityCoveragePct = priorityCountyCount > 0
    ? Number(((highFidelityPriorityCount / priorityCountyCount) * 100).toFixed(1))
    : 0;
  const advocateTruthState = advocateTruthCleanup.states.find((row) => row.stateId === stateId);

  return {
    id: stateId,
    name: stateRecord.name,
    code: stateRecord.code,
    countyCount,
    expectedCountyCount,
    indexedCountyRoots,
    indexCoveragePct: expectedCountyCount > 0 ? Number(((indexedCountyRoots / expectedCountyCount) * 100).toFixed(1)) : 0,
    coreProgramsCount: corePrograms.length,
    requiredFormsCount: requiredForms.length,
    priorityMetroCounties: priorityMetroCounties.length,
    priorityMetroCountyIds: priorityMetroCounties,
    catchmentName,
    educationAgencyLabel,
    records: {
      ddRouting: ddSummary,
      localOffices: officeSummary,
      education: educationSummary,
      nonprofits: nonprofitSummary,
      advocates: advocateSummary,
    },
    coverage: {
      ddRouting: ddCoverage,
      localOffices: officeCoverage,
      education: districtCoverage,
      nonprofits: nonprofitCoverage,
      advocates: advocateCoverage,
      waitlists: waitlistCoverage,
    },
    waitlists: {
      expected: waitlistPrograms,
      present: presentWaitlists,
      missing: missingWaitlists,
    },
    countyDiagnosis: {
      priorityCountyCount,
      highFidelityPriorityCount,
      priorityCoveragePct: countyDiagnosisPriorityCoveragePct,
    },
    advocateTruth: {
      countiesLosingCoverage: advocateTruthState?.countiesLosingAllAdvocateCoverage || 0,
      quarantinedAdvocates: advocateTruthState?.quarantinedAdvocates || 0,
      syntheticPatternAdvocates: advocateTruthState?.syntheticPatternAdvocates || 0,
      publicSafeAdvocates: advocateTruthState?.publicSafeAdvocates || 0,
    },
    scores: {
      ...categoryScores,
      compositeReadiness,
    },
  };
}

function buildProductSummary(verifiedCountyIds) {
  const routeIntegrity = buildRouteIntegrityAudits();
  const homepageTitle = homepageContent.match(/title:\s*'([^']+)'/)?.[1] || '';
  const dashboardLoads = [
    'matched programs',
    'county details',
    'local advocates',
    'saved checklist items',
    'saved reminders',
    'IEP data',
    'respite data',
    'waivers',
  ].filter((signal) => {
    if (signal === 'matched programs') return dashboardContent.includes('getMatchedCorePrograms');
    if (signal === 'county details') return dashboardContent.includes('getCountyDetails');
    if (signal === 'local advocates') return dashboardContent.includes('getIepAdvocates');
    if (signal === 'saved checklist items') return dashboardContent.includes('getChecklistItems');
    if (signal === 'saved reminders') return dashboardContent.includes('getReminders');
    if (signal === 'IEP data') return dashboardContent.includes('getChildIepData');
    if (signal === 'respite data') return dashboardContent.includes('getChildRespiteData');
    if (signal === 'waivers') return dashboardContent.includes('getChildWaivers');
    return false;
  });

  return {
    homepageTitle,
    homepageClaims50States: homepageContent.includes('50-State Disability Benefits Guide'),
    dashboardLoads,
    sitemapBatchDefault: deriveSitemapBatchDefault(),
    nonCaliforniaVerifiedCountyRoots: verifiedCountyIds.length,
    hasFakePublicLocalAssets: hasFakePublicLocalAssets(),
    helperAudit: routeIntegrity.helperAudit,
    publicSurfaceAudits: routeIntegrity.publicSurfaceAudits,
    routeIntegrityFailures: routeIntegrity.routeIntegrityFailures,
  };
}

function buildCaliforniaFindings(california) {
  const findings = [];

  if (hasFakePublicLocalAssets()) {
    findings.push('Public county-diagnosis pages still synthesize fake local assets with 555 phone numbers for most counties.');
  }
  if (california.verdict.blockers.some((blocker) => blocker.category === 'publicTruth')) {
    findings.push('California public truth is still blocked by route-level integrity or synthetic-content failures.');
  }
  if (california.records.localOffices.source_listed > 0) {
    findings.push(`California county office layer is structurally complete but still has ${california.records.localOffices.source_listed} source-listed records.`);
  }
  if (california.records.education.source_listed > 0) {
    findings.push(`California education layer still includes ${california.records.education.source_listed} source-listed records.`);
  }
  if (california.records.nonprofits.source_listed > 0) {
    findings.push(`California nonprofit layer still includes ${california.records.nonprofits.source_listed} source-listed records.`);
  }
  if (california.waitlists.missing.length > 0) {
    findings.push(`California is missing ${california.waitlists.missing.length} core waitlist entries: ${california.waitlists.missing.join(', ')}.`);
  }

  return findings;
}

function buildDecision(california, peers) {
  const bestPeer = peers[0];
  const isBestBaseline = california.scores.compositeReadiness >= bestPeer.scores.compositeReadiness;

  return {
    californiaIsBestBaseline: isBestBaseline,
    californiaIsFinishedGoldStandard: california.verdict.goldEligible,
    rationale: [
      `California composite readiness score: ${california.scores.compositeReadiness}%`,
      `Best non-California peer: ${bestPeer.name} at ${bestPeer.scores.compositeReadiness}%`,
      california.verdict.goldEligible
        ? 'California currently clears the truth-first gold rubric.'
        : 'California remains the strongest trust baseline, but not a finished gold standard because one or more truth, trust, or completeness blockers still remain.',
    ],
  };
}

function renderMarkdown(report) {
  const california = report.states.find((state) => state.id === 'california');
  const topStates = report.rankings.byCompositeReadiness.slice(0, 10);
  const keyStates = report.states.filter((state) => KEY_STATES.includes(state.id));

  const lines = [];
  lines.push('# Generated Current Truth Audit');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Product Summary');
  lines.push('');
  lines.push(`- Homepage title: ${report.product.homepageTitle}`);
  lines.push(`- Claims 50-state product: ${report.product.homepageClaims50States ? 'yes' : 'no'}`);
  lines.push(`- Dashboard feature loads: ${report.product.dashboardLoads.join(', ')}`);
  lines.push(`- Default sitemap batch: ${report.product.sitemapBatchDefault}`);
  lines.push(`- Non-CA verified county roots in allowlist: ${report.product.nonCaliforniaVerifiedCountyRoots}`);
  lines.push(`- Fake public local assets detected on county pages: ${report.product.hasFakePublicLocalAssets ? 'yes' : 'no'}`);
  lines.push(`- Route integrity failures: ${report.product.routeIntegrityFailures.length}`);
  if (report.product.routeIntegrityFailures.length > 0) {
    report.product.routeIntegrityFailures.forEach((failure) => {
      const details = [...failure.missingRequired, ...failure.foundBanned].join(', ') || 'unspecified';
      lines.push(`  - ${failure.scope}: ${details}`);
    });
  }
  lines.push('');
  lines.push('## Gold Ledger');
  lines.push('');
  lines.push('| State | Public Safe | Index Safe | Gold Eligible | Blockers |');
  lines.push('| --- | --- | --- | --- | --- |');
  report.states.forEach((state) => {
    const blockerSummary = state.verdict.blockers.slice(0, 3).map((blocker) => blocker.message).join(' / ') || 'none';
    lines.push(`| ${state.name} | ${state.verdict.publicSafe ? 'yes' : 'no'} | ${state.verdict.indexSafe ? 'yes' : 'no'} | ${state.verdict.goldEligible ? 'yes' : 'no'} | ${blockerSummary} |`);
  });
  lines.push('');
  lines.push('## California Decision');
  lines.push('');
  lines.push(`- Best current baseline: ${report.decision.californiaIsBestBaseline ? 'yes' : 'no'}`);
  lines.push(`- Finished gold standard: ${report.decision.californiaIsFinishedGoldStandard ? 'yes' : 'no'}`);
  lines.push(`- Public safe: ${california.verdict.publicSafe ? 'yes' : 'no'}`);
  lines.push(`- Index safe: ${california.verdict.indexSafe ? 'yes' : 'no'}`);
  lines.push(`- Gold eligible: ${california.verdict.goldEligible ? 'yes' : 'no'}`);
  lines.push(`- Composite readiness: ${california.scores.compositeReadiness}%`);
  lines.push(`- Indexed county roots: ${california.indexedCountyRoots}/${california.expectedCountyCount}`);
  lines.push(`- High-fidelity county-diagnosis priority coverage: ${california.countyDiagnosis.highFidelityPriorityCount}/${california.countyDiagnosis.priorityCountyCount} (${california.countyDiagnosis.priorityCoveragePct}%)`);
  lines.push(`- Missing core waitlists: ${california.waitlists.missing.join(', ') || 'none'}`);
  lines.push('');
  lines.push('## Top States By Composite Readiness');
  lines.push('');
  lines.push('| Rank | State | Composite | DD | Offices | Education | Nonprofits | Advocates | Waitlists | Indexed County Root Coverage | County-Diagnosis Priority Coverage |');
  lines.push('| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
  topStates.forEach((state, index) => {
    lines.push(`| ${index + 1} | ${state.name} | ${state.scores.compositeReadiness}% | ${state.scores.ddRouting}% | ${state.scores.localOffices}% | ${state.scores.education}% | ${state.scores.nonprofits}% | ${state.scores.advocates}% | ${state.scores.waitlists}% | ${state.indexCoveragePct}% | ${state.countyDiagnosis.priorityCoveragePct}% |`);
  });
  lines.push('');
  lines.push('## Key State Comparison');
  lines.push('');
  lines.push('| State | Composite | Public Safe | Gold Eligible | Source-Listed Offices | Manual Review Districts | Null DD Verification Status | County-Diagnosis Priority Coverage | Missing Core Waitlists |');
  lines.push('| --- | ---: | --- | --- | ---: | ---: | ---: | ---: | --- |');
  keyStates.forEach((state) => {
    lines.push(`| ${state.name} | ${state.scores.compositeReadiness}% | ${state.verdict.publicSafe ? 'yes' : 'no'} | ${state.verdict.goldEligible ? 'yes' : 'no'} | ${state.records.localOffices.source_listed} | ${state.records.education.manual_review_required} | ${state.records.ddRouting.null_status} | ${state.countyDiagnosis.priorityCoveragePct}% | ${state.waitlists.missing.join(', ') || 'none'} |`);
  });
  lines.push('');
  lines.push('## California Findings');
  lines.push('');
  report.californiaFindings.forEach((finding) => {
    lines.push(`- ${finding}`);
  });
  lines.push('');
  lines.push('## Decision Notes');
  lines.push('');
  report.decision.rationale.forEach((note) => {
    lines.push(`- ${note}`);
  });
  lines.push('');
  return `${lines.join('\n')}\n`;
}

const verifiedCountyIds = parseVerifiedCountyIds();
const product = buildProductSummary(verifiedCountyIds);
const states = db.prepare('SELECT id, name, code FROM states ORDER BY name ASC').all()
  .map((state) => summarizeState(state, verifiedCountyIds))
  .map((state) => ({
    ...state,
    verdict: buildStateVerdict(state, product),
  }));
const california = states.find((state) => state.id === 'california');
const peers = [...states].filter((state) => state.id !== 'california').sort((a, b) => b.scores.compositeReadiness - a.scores.compositeReadiness);

const report = {
  generatedAt: GENERATED_AT,
  product,
  decision: buildDecision(california, peers),
  californiaFindings: buildCaliforniaFindings(california),
  rankings: {
    byCompositeReadiness: [...states].sort((a, b) => b.scores.compositeReadiness - a.scores.compositeReadiness),
  },
  states,
};

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(mdOutPath, renderMarkdown(report), 'utf8');

console.log(`Wrote ${path.relative(repoRoot, jsonOutPath)}`);
console.log(`Wrote ${path.relative(repoRoot, mdOutPath)}`);

db.close();
