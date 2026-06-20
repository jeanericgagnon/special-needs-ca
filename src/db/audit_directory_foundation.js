import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(process.cwd());
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const db = new Database(dbPath, { readonly: true });
const publicTruthPath = path.join(repoRoot, 'frontend', 'src', 'lib', 'publicTruth.ts');
const countyCatchAllPath = path.join(repoRoot, 'frontend', 'src', 'app', 'benefits', '[state]', '[[...slug]]', 'page.tsx');
const countyDiagnosisPath = path.join(repoRoot, 'frontend', 'src', 'app', 'benefits', '[state]', '[diagnosis]', '[county]', 'page.tsx');
const countyRootPath = path.join(repoRoot, 'frontend', 'src', 'app', 'counties', '[state]', '[slug]', 'page.tsx');
const findHelpClientPath = path.join(repoRoot, 'frontend', 'src', 'app', 'find-help', 'find-help-client.tsx');
const advocatesPagePath = path.join(repoRoot, 'frontend', 'src', 'app', 'advocates', 'page.tsx');
const countySitemapPath = path.join(repoRoot, 'frontend', 'src', 'app', 'sitemaps', 'counties.xml', 'route.ts');

const publicTruthContent = fs.readFileSync(publicTruthPath, 'utf8');
const countyCatchAllContent = fs.readFileSync(countyCatchAllPath, 'utf8');
const countyDiagnosisContent = fs.readFileSync(countyDiagnosisPath, 'utf8');
const countyRootContent = fs.readFileSync(countyRootPath, 'utf8');
const findHelpClientContent = fs.readFileSync(findHelpClientPath, 'utf8');
const advocatesPageContent = fs.readFileSync(advocatesPagePath, 'utf8');
const countySitemapContent = fs.readFileSync(countySitemapPath, 'utf8');

const VALID_AVAILABILITY = new Set([
  'available',
  'limited',
  'near_capacity',
  'waitlist',
  'full',
  'out_of_funding',
  'temporarily_closed',
  'unknown',
]);

const VALID_NEXT_STEP = new Set([
  'call',
  'email',
  'apply_online',
  'referral',
  'schedule',
  'walk_in',
  'download_form',
  'contact_form',
  'see_instructions',
  'unknown',
]);

const VALID_FUNDING = new Set([
  'funded',
  'grant_funded',
  'insurance_only',
  'medicaid_only',
  'private_pay',
  'scholarships_available',
  'out_of_funding',
  'unknown',
]);

const VALID_CLAIM = new Set([
  'unclaimed',
  'pending_review',
  'claimed',
  'verified_affiliation',
  'changes_submitted',
  'changes_approved',
]);

const VALID_SERVICE_TAGS = new Set([
  'food',
  'housing',
  'home_mods',
  'utilities',
  'supplies',
  'transport',
  'therapy',
  'behavioral_health',
  'benefits',
  'grants',
  'respite',
  'in_home_support',
  'caregiving',
  'early_intervention',
  'special_education',
  'iep_advocacy',
  'vocational_rehab',
  'transition',
  'guardianship',
  'trusts',
  'legal_aid',
  'appeals',
]);

const VALID_SERVING_TAGS = new Set([
  'down_syndrome',
  'autism',
  'idd_dd',
  'early_childhood',
  'school_age',
  'transition_age',
  'parents_caregivers',
  'medicaid_waiver_families',
  'iep_families',
  'non_english_speakers',
  'rural_families',
  'low_income_families',
]);

const PUBLIC_ELIGIBLE_STATUSES = new Set(['official_verified', 'verified', 'human_verified', 'source_listed']);
const SYNTHETIC_HOST_PATTERNS = [/^www\.advocate\./, /^www\.therapy\./, /^www\.legal\./, /^www\.pediatrictherapy\./, /^[a-z]{2}-pa\.org$/];
const STALE_DAYS = 425;
const EXPECTED_DIRECTORY_COLUMNS = {
  resource_providers: [
    'service_tags',
    'serving_tags',
    'availability_status',
    'accepting_new_clients',
    'waitlist_status',
    'capacity_notes',
    'funding_status',
    'checked_at',
    'source_name',
    'source_last_updated',
    'next_step_type',
    'next_step_label',
    'next_step_url',
    'next_step_phone',
    'next_step_email',
    'next_step_instructions',
    'requirements',
    'application_url',
    'referral_url',
    'walk_in_available',
    'appointment_required',
    'languages',
    'interpreter_available',
    'asl_available',
    'wheelchair_accessible',
    'virtual_services',
    'in_person_services',
    'home_visits',
    'transportation_help',
    'accessibility_notes',
    'manual_review_required',
    'data_quality_notes',
    'unsupported_claim_flags',
    'claim_status',
    'claimed_by',
    'verified_affiliation',
    'claim_email',
  ],
  nonprofit_organizations: [
    'service_tags',
    'serving_tags',
    'availability_status',
    'accepting_new_clients',
    'waitlist_status',
    'capacity_notes',
    'funding_status',
    'checked_at',
    'source_name',
    'source_last_updated',
    'next_step_type',
    'next_step_label',
    'next_step_url',
    'next_step_phone',
    'next_step_email',
    'next_step_instructions',
    'requirements',
    'application_url',
    'referral_url',
    'walk_in_available',
    'appointment_required',
    'languages',
    'interpreter_available',
    'asl_available',
    'wheelchair_accessible',
    'virtual_services',
    'in_person_services',
    'home_visits',
    'transportation_help',
    'accessibility_notes',
    'manual_review_required',
    'data_quality_notes',
    'unsupported_claim_flags',
    'claim_status',
    'claimed_by',
    'verified_affiliation',
    'claim_email',
  ],
  iep_advocates: [
    'service_tags',
    'serving_tags',
    'availability_status',
    'accepting_new_clients',
    'waitlist_status',
    'capacity_notes',
    'funding_status',
    'checked_at',
    'source_name',
    'source_last_updated',
    'next_step_type',
    'next_step_label',
    'next_step_url',
    'next_step_phone',
    'next_step_email',
    'next_step_instructions',
    'requirements',
    'application_url',
    'referral_url',
    'walk_in_available',
    'appointment_required',
    'interpreter_available',
    'asl_available',
    'wheelchair_accessible',
    'virtual_services',
    'in_person_services',
    'home_visits',
    'transportation_help',
    'accessibility_notes',
    'manual_review_required',
    'data_quality_notes',
    'unsupported_claim_flags',
    'claim_status',
    'claimed_by',
    'verified_affiliation',
    'claim_email',
  ],
};

function parseCsv(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function isSyntheticUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return SYNTHETIC_HOST_PATTERNS.some((pattern) => pattern.test(url.hostname));
  } catch {
    return true;
  }
}

function isLikelySyntheticAdvocateProfile(row) {
  return Boolean(
    row.id &&
    String(row.id).startsWith('gen-') &&
    PUBLIC_ELIGIBLE_STATUSES.has(row.verification_status) &&
    !row.last_verified_date &&
    !String(row.email || '').trim() &&
    !String(row.phone || '').trim() &&
    String(row.website || '').trim() === 'https://www.cde.ca.gov/sp/se/' &&
    String(row.source_url || '').trim().toLowerCase().endsWith('advocacy.com')
  );
}

function isStale(row) {
  const stamp = row.last_verified_at || row.last_verified_date || row.checked_at || row.source_last_updated || row.last_scraped_at;
  if (!stamp) return false;
  const time = new Date(stamp).getTime();
  if (Number.isNaN(time)) return false;
  const ageDays = (Date.now() - time) / (1000 * 60 * 60 * 24);
  return ageDays > STALE_DAYS;
}

function validateTags(tags, validSet) {
  return parseCsv(tags).filter((tag) => !validSet.has(tag));
}

function getTableColumns(tableName) {
  return new Set(db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name));
}

function auditSchemaColumns(tableName, expectedColumns) {
  const actual = getTableColumns(tableName);
  const missingColumns = expectedColumns.filter((column) => !actual.has(column));
  return {
    tableName,
    expectedCount: expectedColumns.length,
    missingColumns,
    passes: missingColumns.length === 0,
  };
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

function summarizeTableFindings(tableCounts) {
  return Object.entries(tableCounts)
    .filter(([key, value]) => key !== 'total' && Number(value) > 0)
    .map(([key, value]) => `${key}:${value}`);
}

function auditTable(tableName, classificationField) {
  const rows = db.prepare(`SELECT * FROM ${tableName}`).all();
  const counts = {
    total: rows.length,
    syntheticSourceUrl: 0,
    syntheticWebsite: 0,
    syntheticActionUrl: 0,
    missingSourceUrlOnPublicEligible: 0,
    invalidAvailabilityStatus: 0,
    invalidNextStepType: 0,
    invalidFundingStatus: 0,
    invalidClaimStatus: 0,
    invalidServiceTags: 0,
    invalidServingTags: 0,
    unsupportedClaimFlagsPresent: 0,
    likelySyntheticProfiles: 0,
    staleRecords: 0,
    manualReviewRequired: 0,
    possibleProviderProgramConfusion: 0,
  };

  for (const row of rows) {
    if (isSyntheticUrl(row.source_url)) counts.syntheticSourceUrl += 1;
    if (isSyntheticUrl(row.website)) counts.syntheticWebsite += 1;
    if ([row.next_step_url, row.application_url, row.referral_url].some((value) => isSyntheticUrl(value))) counts.syntheticActionUrl += 1;
    if (PUBLIC_ELIGIBLE_STATUSES.has(row.verification_status) && (!row.source_url || !String(row.source_url).trim())) {
      counts.missingSourceUrlOnPublicEligible += 1;
    }
    if (row.availability_status && !VALID_AVAILABILITY.has(row.availability_status)) counts.invalidAvailabilityStatus += 1;
    if (row.next_step_type && !VALID_NEXT_STEP.has(row.next_step_type)) counts.invalidNextStepType += 1;
    if (row.funding_status && !VALID_FUNDING.has(row.funding_status)) counts.invalidFundingStatus += 1;
    if (row.claim_status && !VALID_CLAIM.has(row.claim_status)) counts.invalidClaimStatus += 1;
    if (validateTags(row.service_tags, VALID_SERVICE_TAGS).length > 0) counts.invalidServiceTags += 1;
    if (validateTags(row.serving_tags, VALID_SERVING_TAGS).length > 0) counts.invalidServingTags += 1;
    if (row.unsupported_claim_flags && String(row.unsupported_claim_flags).trim()) counts.unsupportedClaimFlagsPresent += 1;
    if (tableName === 'iep_advocates' && isLikelySyntheticAdvocateProfile(row)) counts.likelySyntheticProfiles += 1;
    if (isStale(row)) counts.staleRecords += 1;
    if (row.manual_review_required === 1) counts.manualReviewRequired += 1;
    if (classificationField && String(row[classificationField] || '').toLowerCase().includes('program') && row.focus_condition) {
      counts.possibleProviderProgramConfusion += 1;
    }
  }

  return counts;
}

const helperAudit = auditFileSurface(
  'publicTruth.ts',
  publicTruthContent,
  [
    { label: 'public record gating requires acceptable verification status', pattern: /isAcceptablePublicVerificationStatus\(record\.verification_status\)/ },
    { label: 'public record gating requires source_url truth check', pattern: /hasPublicSourceUrl\(record\)/ },
    { label: 'public record gating requires public contact signal', pattern: /hasPublicContactSignal\(record\)/ },
    { label: 'synthetic advocate pattern is blocked in public truth', pattern: /isLikelySyntheticPublicAdvocate\(record\)/ },
    { label: 'verified diagnosis allowlist exists', pattern: /VERIFIED_DIAGNOSIS_SLUGS/ },
    { label: 'synthetic source host patterns are blocked', pattern: /SYNTHETIC_SOURCE_HOST_PATTERNS/ },
  ],
  []
);

const schemaAudits = Object.entries(EXPECTED_DIRECTORY_COLUMNS).map(([tableName, expectedColumns]) =>
  auditSchemaColumns(tableName, expectedColumns)
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
    countyDiagnosisContent,
    [
      { label: 'shared directory foundation panel is used', pattern: /DirectoryFoundationPanel/ },
      { label: 'public advocate copy references truth eligibility', pattern: /shared truth eligibility checks/ },
      { label: 'metadata uses county diagnosis truth eligibility', pattern: /getCountyDiagnosisTruthEligibility\(stateId, p\.diagnosis, p\.county, countyData\)/ },
      { label: 'metadata noindexes non-index-safe county diagnosis pages', pattern: /robots: truth\.indexSafe \? undefined : \{ index: false, follow: true \}/ },
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
    'counties/[state]/[slug]/page.tsx',
    countyRootContent,
    [
      { label: 'shared directory foundation panel is used', pattern: /DirectoryFoundationPanel/ },
      { label: 'metadata uses county truth eligibility', pattern: /getCountyTruthEligibility\(stateData\.id, countyDetails\)/ },
      { label: 'metadata noindexes non-index-safe county pages', pattern: /robots: truth\.indexSafe \? undefined : \{ index: false, follow: true \}/ },
    ],
    [
      { label: 'legacy vetted wording', pattern: /\bVetted\b/i },
      { label: 'placeholder phone number', pattern: /\(555\)|\b555-/ },
      { label: 'placeholder email address', pattern: /@example\./i },
      { label: 'hardcoded reviewer persona', pattern: /Sarah Jenkins/ },
    ]
  ),
  auditFileSurface(
    'find-help/find-help-client.tsx',
    findHelpClientContent,
    [
      { label: 'sample directory records use canonical renderability guard', pattern: /isRenderableDirectoryFoundationRecord\(record\)/ },
    ],
    [
      { label: 'legacy hand-rolled sample-record validator filter', pattern: /validateDirectoryFoundationRecord\(record\)\.every/ },
    ]
  ),
  auditFileSurface(
    'advocates/page.tsx',
    advocatesPageContent,
    [
      { label: 'advocates page filters through public truth eligibility', pattern: /getIepAdvocates\(selectedCounty, 'california'\)\)\.filter\(isPublic(?:Directory)?RecordEligible\)/ },
      { label: 'advocates structured data uses verified-only subset', pattern: /const verifiedAdvocates = advocates\.filter\(adv => adv\.verification_status === 'verified'\)/ },
    ],
    [
      { label: 'legacy vetted wording', pattern: /\bVetted\b/i },
      { label: 'placeholder phone number', pattern: /\(555\)|\b555-/ },
      { label: 'placeholder email address', pattern: /@example\./i },
    ]
  ),
  auditFileSurface(
    'sitemaps/counties.xml/route.ts',
    countySitemapContent,
    [
      { label: 'county roots use county truth eligibility for sitemap gating', pattern: /getCountyTruthEligibility\(c\.state_id \|\| 'california', details\)/ },
      { label: 'county roots skip non-index-safe pages', pattern: /if \(!truth\.indexSafe\) return false;/ },
      { label: 'county diagnosis leaves use county diagnosis truth eligibility', pattern: /getCountyDiagnosisTruthEligibility\(stateId, diag, county\.id, countyDetails\)/ },
      { label: 'county diagnosis leaves skip non-index-safe pages', pattern: /if \(!truth\.indexSafe\) return;/ },
      { label: 'county diagnosis leaves require indexable state gating', pattern: /if \(!isIndexableState\(stateId\)\) return;/ },
    ],
    []
  ),
];

const routeIntegrityFailures = [
  ...schemaAudits.filter((audit) => !audit.passes).map((audit) => ({
    scope: `${audit.tableName} schema`,
    missingRequired: audit.missingColumns,
    foundBanned: [],
  })),
  ...publicSurfaceAudits.filter((audit) => !audit.passes).map((audit) => ({
    scope: audit.name,
    missingRequired: audit.missingRequired,
    foundBanned: audit.foundBanned,
  })),
  ...(!helperAudit.passes ? [{
    scope: helperAudit.name,
    missingRequired: helperAudit.missingRequired,
    foundBanned: helperAudit.foundBanned,
  }] : []),
];

const results = {
  generatedAt: new Date().toISOString(),
  staleThresholdDays: STALE_DAYS,
  tables: {
    resource_providers: auditTable('resource_providers', 'categories'),
    nonprofit_organizations: auditTable('nonprofit_organizations', null),
    iep_advocates: auditTable('iep_advocates', 'credentials'),
  },
  schemaAudits,
  helperAudit,
  publicSurfaceAudits,
  routeIntegrityFailures,
};

console.log('# Directory Foundation Audit');
console.log(JSON.stringify(results, null, 2));

const nonZeroTableFindings = Object.entries(results.tables)
  .map(([table, counts]) => ({ table, findings: summarizeTableFindings(counts) }))
  .filter((entry) => entry.findings.length > 0);

if (routeIntegrityFailures.length > 0) {
  console.error('\nRoute integrity failures detected in the public truth surface:');
  for (const failure of routeIntegrityFailures) {
    console.error(`- ${failure.scope}`);
    if (failure.missingRequired.length > 0) {
      console.error(`  missing: ${failure.missingRequired.join(', ')}`);
    }
    if (failure.foundBanned.length > 0) {
      console.error(`  banned: ${failure.foundBanned.join(', ')}`);
    }
  }
  process.exitCode = 1;
} else {
  console.log('\nRoute integrity audit passed for public county surfaces.');
}

if (nonZeroTableFindings.length > 0) {
  console.log('\nNon-zero table findings:');
  for (const entry of nonZeroTableFindings) {
    console.log(`- ${entry.table}: ${entry.findings.join(', ')}`);
  }
}
