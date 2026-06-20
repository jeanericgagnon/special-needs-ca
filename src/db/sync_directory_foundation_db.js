import Database from 'better-sqlite3';
import path from 'path';

const repoRoot = path.resolve(process.cwd());
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const db = new Database(dbPath);

const TABLE_COLUMN_DEFS = {
  resource_providers: [
    ['service_tags', 'TEXT'],
    ['serving_tags', 'TEXT'],
    ['availability_status', 'TEXT'],
    ['accepting_new_clients', 'INTEGER'],
    ['waitlist_status', 'TEXT'],
    ['capacity_notes', 'TEXT'],
    ['funding_status', 'TEXT'],
    ['checked_at', 'TEXT'],
    ['source_name', 'TEXT'],
    ['source_last_updated', 'TEXT'],
    ['last_verified_at', 'TEXT'],
    ['next_step_type', 'TEXT'],
    ['next_step_label', 'TEXT'],
    ['next_step_url', 'TEXT'],
    ['next_step_phone', 'TEXT'],
    ['next_step_email', 'TEXT'],
    ['next_step_instructions', 'TEXT'],
    ['requirements', 'TEXT'],
    ['application_url', 'TEXT'],
    ['referral_url', 'TEXT'],
    ['walk_in_available', 'INTEGER'],
    ['appointment_required', 'INTEGER'],
    ['languages', 'TEXT'],
    ['interpreter_available', 'INTEGER'],
    ['asl_available', 'INTEGER'],
    ['wheelchair_accessible', 'INTEGER'],
    ['virtual_services', 'INTEGER'],
    ['in_person_services', 'INTEGER'],
    ['home_visits', 'INTEGER'],
    ['transportation_help', 'INTEGER'],
    ['accessibility_notes', 'TEXT'],
    ['manual_review_required', 'INTEGER DEFAULT 0'],
    ['data_quality_notes', 'TEXT'],
    ['unsupported_claim_flags', 'TEXT'],
    ['claim_status', 'TEXT'],
    ['claimed_by', 'TEXT'],
    ['verified_affiliation', 'INTEGER DEFAULT 0'],
    ['claim_email', 'TEXT'],
  ],
  nonprofit_organizations: [
    ['service_tags', 'TEXT'],
    ['serving_tags', 'TEXT'],
    ['availability_status', 'TEXT'],
    ['accepting_new_clients', 'INTEGER'],
    ['waitlist_status', 'TEXT'],
    ['capacity_notes', 'TEXT'],
    ['funding_status', 'TEXT'],
    ['checked_at', 'TEXT'],
    ['source_name', 'TEXT'],
    ['source_last_updated', 'TEXT'],
    ['last_verified_at', 'TEXT'],
    ['next_step_type', 'TEXT'],
    ['next_step_label', 'TEXT'],
    ['next_step_url', 'TEXT'],
    ['next_step_phone', 'TEXT'],
    ['next_step_email', 'TEXT'],
    ['next_step_instructions', 'TEXT'],
    ['requirements', 'TEXT'],
    ['application_url', 'TEXT'],
    ['referral_url', 'TEXT'],
    ['walk_in_available', 'INTEGER'],
    ['appointment_required', 'INTEGER'],
    ['languages', 'TEXT'],
    ['interpreter_available', 'INTEGER'],
    ['asl_available', 'INTEGER'],
    ['wheelchair_accessible', 'INTEGER'],
    ['virtual_services', 'INTEGER'],
    ['in_person_services', 'INTEGER'],
    ['home_visits', 'INTEGER'],
    ['transportation_help', 'INTEGER'],
    ['accessibility_notes', 'TEXT'],
    ['manual_review_required', 'INTEGER DEFAULT 0'],
    ['data_quality_notes', 'TEXT'],
    ['unsupported_claim_flags', 'TEXT'],
    ['claim_status', 'TEXT'],
    ['claimed_by', 'TEXT'],
    ['verified_affiliation', 'INTEGER DEFAULT 0'],
    ['claim_email', 'TEXT'],
  ],
  iep_advocates: [
    ['service_tags', 'TEXT'],
    ['serving_tags', 'TEXT'],
    ['availability_status', 'TEXT'],
    ['accepting_new_clients', 'INTEGER'],
    ['waitlist_status', 'TEXT'],
    ['capacity_notes', 'TEXT'],
    ['funding_status', 'TEXT'],
    ['checked_at', 'TEXT'],
    ['source_name', 'TEXT'],
    ['source_last_updated', 'TEXT'],
    ['next_step_type', 'TEXT'],
    ['next_step_label', 'TEXT'],
    ['next_step_url', 'TEXT'],
    ['next_step_phone', 'TEXT'],
    ['next_step_email', 'TEXT'],
    ['next_step_instructions', 'TEXT'],
    ['requirements', 'TEXT'],
    ['application_url', 'TEXT'],
    ['referral_url', 'TEXT'],
    ['walk_in_available', 'INTEGER'],
    ['appointment_required', 'INTEGER'],
    ['interpreter_available', 'INTEGER'],
    ['asl_available', 'INTEGER'],
    ['wheelchair_accessible', 'INTEGER'],
    ['virtual_services', 'INTEGER'],
    ['in_person_services', 'INTEGER'],
    ['home_visits', 'INTEGER'],
    ['transportation_help', 'INTEGER'],
    ['accessibility_notes', 'TEXT'],
    ['manual_review_required', 'INTEGER DEFAULT 0'],
    ['data_quality_notes', 'TEXT'],
    ['unsupported_claim_flags', 'TEXT'],
    ['claim_status', 'TEXT'],
    ['claimed_by', 'TEXT'],
    ['verified_affiliation', 'INTEGER DEFAULT 0'],
    ['claim_email', 'TEXT'],
  ],
};

function getColumns(tableName) {
  return new Set(db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name));
}

function hasNonEmpty(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

function normalizeTokens(raw) {
  return String(raw || '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
}

function joinUnique(values) {
  return [...new Set(values.filter(Boolean))].join(',');
}

function deriveSourceName(sourceUrl, sourceType, website) {
  const candidate = hasNonEmpty(sourceUrl) ? sourceUrl : website;
  if (hasNonEmpty(candidate)) {
    try {
      const url = new URL(candidate);
      return url.hostname.replace(/^www\./, '');
    } catch {
      // Fall through to source type
    }
  }

  if (hasNonEmpty(sourceType)) {
    return String(sourceType).replace(/_/g, ' ');
  }

  return null;
}

function mapProviderTags(categories) {
  const tokens = normalizeTokens(categories);
  const serviceTags = [];
  const servingTags = [];

  if (tokens.some((token) => token.includes('therapy') || token.includes('clinic') || token.includes('pediatrics'))) {
    serviceTags.push('therapy');
  }
  if (tokens.some((token) => token.includes('education') || token.includes('card_center'))) {
    serviceTags.push('special_education');
  }
  if (tokens.some((token) => token.includes('autism'))) {
    servingTags.push('autism');
  }

  return {
    service_tags: joinUnique(serviceTags) || null,
    serving_tags: joinUnique(servingTags) || null,
  };
}

function isLikelySyntheticAdvocateRow(row) {
  return Boolean(
    row.id?.startsWith('gen-') &&
    ['verified', 'official_verified', 'human_verified', 'source_listed'].includes(row.verification_status || '') &&
    !hasNonEmpty(row.last_verified_date) &&
    !hasNonEmpty(row.email) &&
    !hasNonEmpty(row.phone) &&
    String(row.website || '').trim() === 'https://www.cde.ca.gov/sp/se/' &&
    String(row.source_url || '').trim().toLowerCase().endsWith('advocacy.com')
  );
}

function mapNonprofitServingTags(focusCondition) {
  const normalized = String(focusCondition || '').trim().toLowerCase();
  if (['autism spectrum disorder', 'autism-spectrum-disorder', 'autism'].includes(normalized)) {
    return 'autism';
  }
  if (['down-syndrome', 'down_syndrome'].includes(normalized)) {
    return 'down_syndrome';
  }
  if ([
    'intellectual and developmental disabilities',
    'developmental_disabilities',
    'intellectual-disability',
    'intellectual_developmental_disability',
  ].includes(normalized)) {
    return 'idd_dd';
  }
  return null;
}

let addedColumns = 0;
let backfilledClaims = 0;
let backfilledAdvocateTags = 0;
let backfilledAdvocateNextSteps = 0;
let backfilledProviderTags = 0;
let backfilledProviderServingTags = 0;
let backfilledProviderNextSteps = 0;
let backfilledNonprofitServingTags = 0;
let backfilledNonprofitNextSteps = 0;
let backfilledCheckedAt = 0;
let backfilledSourceName = 0;
let ensuredNormalizationTables = 0;
let ensuredProviderAccessibilityTables = 0;
let downgradedSyntheticAdvocates = 0;

const NORMALIZATION_TABLES = [
  `CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    organization_type TEXT NOT NULL,
    parent_organization_id TEXT,
    website TEXT,
    intake_phone TEXT,
    intake_email TEXT,
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL,
    notes TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS organization_program_links (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    program_id TEXT,
    listing_type TEXT NOT NULL,
    title TEXT NOT NULL,
    intake_model TEXT,
    service_summary TEXT,
    eligibility_summary TEXT,
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL
  );`,
  `CREATE TABLE IF NOT EXISTS service_locations (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    location_name TEXT NOT NULL,
    location_type TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state_id TEXT,
    postal_code TEXT,
    county_id TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    appointment_url TEXT,
    hours_text TEXT,
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL
  );`,
  `CREATE TABLE IF NOT EXISTS office_locations (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    office_name TEXT NOT NULL,
    office_type TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state_id TEXT,
    postal_code TEXT,
    county_id TEXT,
    intake_phone TEXT,
    intake_email TEXT,
    website TEXT,
    hours_text TEXT,
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL
  );`,
  `CREATE TABLE IF NOT EXISTS virtual_service_areas (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    program_link_id TEXT,
    area_type TEXT NOT NULL,
    area_name TEXT NOT NULL,
    state_id TEXT,
    coverage_notes TEXT,
    intake_model TEXT,
    source_url TEXT,
    source_type TEXT,
    data_origin TEXT,
    verification_status TEXT,
    last_verified_date TEXT,
    last_scraped_at TEXT,
    confidence_score REAL
  );`,
  `CREATE TABLE IF NOT EXISTS virtual_service_area_counties (
    virtual_service_area_id TEXT,
    county_id TEXT,
    PRIMARY KEY (virtual_service_area_id, county_id)
  );`,
];

const PROVIDER_ACCESSIBILITY_REVIEW_TABLES = [
  `CREATE TABLE IF NOT EXISTS provider_accessibility_pull_results (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL,
    county_id TEXT,
    state_id TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_host TEXT NOT NULL,
    clue_page_url TEXT,
    clue_page_type TEXT,
    clue_field TEXT NOT NULL,
    clue_value TEXT,
    clue_text TEXT,
    clue_status TEXT NOT NULL DEFAULT 'queued',
    promotion_target_column TEXT,
    review_notes TEXT,
    reviewed_by TEXT,
    reviewed_at TEXT,
    promoted_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  'CREATE INDEX IF NOT EXISTS idx_provider_accessibility_pull_results_provider ON provider_accessibility_pull_results(provider_id);',
  'CREATE INDEX IF NOT EXISTS idx_provider_accessibility_pull_results_status ON provider_accessibility_pull_results(clue_status);',
  'CREATE INDEX IF NOT EXISTS idx_provider_accessibility_pull_results_state ON provider_accessibility_pull_results(state_id);',
];

const tx = db.transaction(() => {
  for (const statement of NORMALIZATION_TABLES) {
    db.exec(statement);
    ensuredNormalizationTables += 1;
  }

  for (const statement of PROVIDER_ACCESSIBILITY_REVIEW_TABLES) {
    db.exec(statement);
    ensuredProviderAccessibilityTables += 1;
  }

  for (const [tableName, columnDefs] of Object.entries(TABLE_COLUMN_DEFS)) {
    const existingColumns = getColumns(tableName);
    for (const [columnName, sqlType] of columnDefs) {
      if (existingColumns.has(columnName)) continue;
      db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${sqlType};`);
      addedColumns += 1;
    }
  }

  for (const tableName of Object.keys(TABLE_COLUMN_DEFS)) {
    const claimInfo = db.prepare(`
      UPDATE ${tableName}
      SET claim_status = 'unclaimed'
      WHERE claim_status IS NULL OR TRIM(claim_status) = ''
    `).run();
    backfilledClaims += claimInfo.changes;

    db.prepare(`
      UPDATE ${tableName}
      SET verified_affiliation = 0
      WHERE verified_affiliation IS NULL
    `).run();
  }

  const advocates = db.prepare(`
    SELECT id, phone, email, website, source_url, verification_status, last_verified_date, service_tags, next_step_type, next_step_label, next_step_phone, next_step_email, next_step_url
    FROM iep_advocates
  `).all();
  const providers = db.prepare(`
    SELECT id, categories, phone, email, source_url, source_type, checked_at, source_name, last_verified_date, last_scraped_at, service_tags, serving_tags, next_step_type, next_step_label, next_step_phone, next_step_email, next_step_url
    FROM resource_providers
  `).all();
  const nonprofits = db.prepare(`
    SELECT id, focus_condition, phone, website, source_url, source_type, checked_at, source_name, last_verified_date, last_scraped_at, serving_tags, next_step_type, next_step_label, next_step_phone, next_step_url
    FROM nonprofit_organizations
  `).all();
  const advocateFreshnessRows = db.prepare(`
    SELECT id, website, source_url, source_type, checked_at, source_name, last_verified_at, last_verified_date, last_scraped_at
    FROM iep_advocates
  `).all();

  const setAdvocateTags = db.prepare(`
    UPDATE iep_advocates
    SET service_tags = ?
    WHERE id = ?
  `);

  const setAdvocateNextStep = db.prepare(`
    UPDATE iep_advocates
    SET next_step_type = ?,
        next_step_label = ?,
        next_step_phone = ?,
        next_step_email = ?,
        next_step_url = ?
    WHERE id = ?
  `);
  const downgradeSyntheticAdvocate = db.prepare(`
    UPDATE iep_advocates
    SET verification_status = 'manual_review_required',
        manual_review_required = 1,
        unsupported_claim_flags = CASE
          WHEN unsupported_claim_flags IS NULL OR TRIM(unsupported_claim_flags) = '' THEN 'likely_synthetic_advocate_profile'
          WHEN instr(unsupported_claim_flags, 'likely_synthetic_advocate_profile') > 0 THEN unsupported_claim_flags
          ELSE unsupported_claim_flags || ',likely_synthetic_advocate_profile'
        END
    WHERE id = ?
  `);
  const setProviderTags = db.prepare(`
    UPDATE resource_providers
    SET service_tags = COALESCE(?, service_tags),
        serving_tags = COALESCE(?, serving_tags)
    WHERE id = ?
  `);
  const setProviderNextStep = db.prepare(`
    UPDATE resource_providers
    SET next_step_type = ?,
        next_step_label = ?,
        next_step_phone = ?,
        next_step_email = ?,
        next_step_url = ?
    WHERE id = ?
  `);
  const setNonprofitServingTags = db.prepare(`
    UPDATE nonprofit_organizations
    SET serving_tags = ?
    WHERE id = ?
  `);
  const setNonprofitNextStep = db.prepare(`
    UPDATE nonprofit_organizations
    SET next_step_type = ?,
        next_step_label = ?,
        next_step_phone = ?,
        next_step_url = ?
    WHERE id = ?
  `);
  const setFreshness = {
    resource_providers: db.prepare(`
      UPDATE resource_providers
      SET checked_at = COALESCE(?, checked_at),
          source_name = COALESCE(?, source_name)
      WHERE id = ?
    `),
    nonprofit_organizations: db.prepare(`
      UPDATE nonprofit_organizations
      SET checked_at = COALESCE(?, checked_at),
          source_name = COALESCE(?, source_name)
      WHERE id = ?
    `),
    iep_advocates: db.prepare(`
      UPDATE iep_advocates
      SET checked_at = COALESCE(?, checked_at),
          source_name = COALESCE(?, source_name)
      WHERE id = ?
    `),
  };

  for (const advocate of advocates) {
    if (isLikelySyntheticAdvocateRow(advocate)) {
      downgradeSyntheticAdvocate.run(advocate.id);
      downgradedSyntheticAdvocates += 1;
      continue;
    }

    if (!hasNonEmpty(advocate.service_tags)) {
      setAdvocateTags.run('iep_advocacy,special_education', advocate.id);
      backfilledAdvocateTags += 1;
    }

    if (hasNonEmpty(advocate.next_step_type)) continue;

    let nextStepType = null;
    let nextStepLabel = null;
    let nextStepPhone = null;
    let nextStepEmail = null;
    let nextStepUrl = hasNonEmpty(advocate.next_step_url) ? advocate.next_step_url : (hasNonEmpty(advocate.website) ? advocate.website : null);

    if (hasNonEmpty(advocate.email)) {
      nextStepType = 'email';
      nextStepLabel = 'Email advocate';
      nextStepEmail = advocate.email;
    } else if (hasNonEmpty(advocate.phone)) {
      nextStepType = 'call';
      nextStepLabel = 'Call advocate';
      nextStepPhone = advocate.phone;
    } else if (hasNonEmpty(advocate.website)) {
      nextStepType = 'see_instructions';
      nextStepLabel = 'Review official website';
    }

    if (!nextStepType) continue;

    setAdvocateNextStep.run(
      nextStepType,
      nextStepLabel,
      nextStepPhone,
      nextStepEmail,
      nextStepUrl,
      advocate.id
    );
    backfilledAdvocateNextSteps += 1;
  }

  for (const advocate of advocateFreshnessRows) {
    const checkedAt = hasNonEmpty(advocate.checked_at)
      ? null
      : (advocate.last_verified_at || advocate.last_verified_date || advocate.last_scraped_at || null);
    const sourceName = hasNonEmpty(advocate.source_name)
      ? null
      : deriveSourceName(advocate.source_url, advocate.source_type, advocate.website);

    if (checkedAt || sourceName) {
      setFreshness.iep_advocates.run(checkedAt, sourceName, advocate.id);
      if (checkedAt) backfilledCheckedAt += 1;
      if (sourceName) backfilledSourceName += 1;
    }
  }

  for (const provider of providers) {
    const checkedAt = hasNonEmpty(provider.checked_at)
      ? null
      : (provider.last_verified_date || provider.last_scraped_at || null);
    const sourceName = hasNonEmpty(provider.source_name)
      ? null
      : deriveSourceName(provider.source_url, provider.source_type, null);

    if (checkedAt || sourceName) {
      setFreshness.resource_providers.run(checkedAt, sourceName, provider.id);
      if (checkedAt) backfilledCheckedAt += 1;
      if (sourceName) backfilledSourceName += 1;
    }

    if (!hasNonEmpty(provider.service_tags) || !hasNonEmpty(provider.serving_tags)) {
      const mapped = mapProviderTags(provider.categories);
      if ((!hasNonEmpty(provider.service_tags) && hasNonEmpty(mapped.service_tags)) || (!hasNonEmpty(provider.serving_tags) && hasNonEmpty(mapped.serving_tags))) {
        setProviderTags.run(
          !hasNonEmpty(provider.service_tags) ? mapped.service_tags : null,
          !hasNonEmpty(provider.serving_tags) ? mapped.serving_tags : null,
          provider.id
        );
        if (!hasNonEmpty(provider.service_tags) && hasNonEmpty(mapped.service_tags)) backfilledProviderTags += 1;
        if (!hasNonEmpty(provider.serving_tags) && hasNonEmpty(mapped.serving_tags)) backfilledProviderServingTags += 1;
      }
    }

    if (!hasNonEmpty(provider.next_step_type)) {
      let nextStepType = null;
      let nextStepLabel = null;
      let nextStepPhone = null;
      let nextStepEmail = null;
      const nextStepUrl = hasNonEmpty(provider.source_url) ? provider.source_url : (hasNonEmpty(provider.next_step_url) ? provider.next_step_url : null);

      if (hasNonEmpty(provider.email)) {
        nextStepType = 'email';
        nextStepLabel = 'Email provider';
        nextStepEmail = provider.email;
      } else if (hasNonEmpty(provider.phone)) {
        nextStepType = 'call';
        nextStepLabel = 'Call provider';
        nextStepPhone = provider.phone;
      } else if (hasNonEmpty(nextStepUrl)) {
        nextStepType = 'see_instructions';
        nextStepLabel = 'Review official website';
      }

      if (nextStepType) {
        setProviderNextStep.run(nextStepType, nextStepLabel, nextStepPhone, nextStepEmail, nextStepUrl, provider.id);
        backfilledProviderNextSteps += 1;
      }
    }
  }

  for (const nonprofit of nonprofits) {
    const checkedAt = hasNonEmpty(nonprofit.checked_at)
      ? null
      : (nonprofit.last_verified_date || nonprofit.last_scraped_at || null);
    const sourceName = hasNonEmpty(nonprofit.source_name)
      ? null
      : deriveSourceName(nonprofit.source_url, nonprofit.source_type, nonprofit.website);

    if (checkedAt || sourceName) {
      setFreshness.nonprofit_organizations.run(checkedAt, sourceName, nonprofit.id);
      if (checkedAt) backfilledCheckedAt += 1;
      if (sourceName) backfilledSourceName += 1;
    }

    if (!hasNonEmpty(nonprofit.serving_tags)) {
      const servingTag = mapNonprofitServingTags(nonprofit.focus_condition);
      if (hasNonEmpty(servingTag)) {
        setNonprofitServingTags.run(servingTag, nonprofit.id);
        backfilledNonprofitServingTags += 1;
      }
    }

    if (!hasNonEmpty(nonprofit.next_step_type)) {
      let nextStepType = null;
      let nextStepLabel = null;
      let nextStepPhone = null;
      const nextStepUrl = hasNonEmpty(nonprofit.source_url) ? nonprofit.source_url : (hasNonEmpty(nonprofit.website) ? nonprofit.website : null);

      if (hasNonEmpty(nonprofit.phone)) {
        nextStepType = 'call';
        nextStepLabel = 'Call organization';
        nextStepPhone = nonprofit.phone;
      } else if (hasNonEmpty(nextStepUrl)) {
        nextStepType = 'see_instructions';
        nextStepLabel = 'Review official website';
      }

      if (nextStepType) {
        setNonprofitNextStep.run(nextStepType, nextStepLabel, nextStepPhone, nextStepUrl, nonprofit.id);
        backfilledNonprofitNextSteps += 1;
      }
    }
  }
});

tx();
db.close();

console.log(`Synced directory foundation schema in ${dbPath}`);
console.log(JSON.stringify({
  addedColumns,
  backfilledClaims,
  backfilledAdvocateTags,
  backfilledAdvocateNextSteps,
  backfilledProviderTags,
  backfilledProviderServingTags,
  backfilledProviderNextSteps,
  backfilledNonprofitServingTags,
  backfilledNonprofitNextSteps,
  backfilledCheckedAt,
  backfilledSourceName,
  ensuredNormalizationTables,
  ensuredProviderAccessibilityTables,
  downgradedSyntheticAdvocates,
}, null, 2));
