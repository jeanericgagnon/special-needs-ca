import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `directory-freshness-gap-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `directory-freshness-gap-audit-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

const TABLES = [
  {
    table: 'resource_providers',
    label: 'Resource Providers',
    stateJoin: 'JOIN counties c ON c.id = resource_providers.county_id JOIN states s ON s.id = c.state_id',
  },
  {
    table: 'nonprofit_organizations',
    label: 'Nonprofit Organizations',
    stateJoin: 'JOIN counties c ON c.id = nonprofit_organizations.county_id JOIN states s ON s.id = c.state_id',
  },
  {
    table: 'iep_advocates',
    label: 'IEP Advocates',
    stateJoin: 'JOIN iep_advocate_counties iac ON iac.iep_advocate_id = iep_advocates.id JOIN counties c ON c.id = iac.county_id JOIN states s ON s.id = c.state_id',
  },
];

const PUBLIC_VERIFICATION_STATUSES = new Set(['official_verified', 'verified', 'human_verified', 'source_listed']);
const FALLBACK_DATA_ORIGINS = new Set(['programmatic_fallback', 'generated_county_fallback']);
const SYNTHETIC_SOURCE_HOST_PATTERNS = [
  /^www\.advocate\./,
  /^www\.therapy\./,
  /^www\.legal\./,
  /^www\.pediatrictherapy\./,
  /^[a-z]{2}-pa\.org$/,
];

function pct(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 1000) / 10;
}

function hasNonEmpty(value) {
  return Boolean(value && String(value).trim());
}

function isSyntheticUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return SYNTHETIC_SOURCE_HOST_PATTERNS.some((pattern) => pattern.test(url.hostname));
  } catch {
    return true;
  }
}

function hasPublicContactSignal(row) {
  const phone = row.phone || row.intake_phone || row.spec_ed_contact_phone || row.next_step_phone || '';
  const email = row.email || row.spec_ed_contact_email || row.next_step_email || '';
  const website = row.website || row.next_step_url || row.application_url || row.referral_url || '';

  return Boolean(
    (phone && !String(phone).includes('(555)')) ||
    (email && !String(email).endsWith('@example.com')) ||
    String(website).trim()
  );
}

function isLikelySyntheticPublicAdvocate(row) {
  if (!row.id || !String(row.id).startsWith('gen-')) return false;
  if (!PUBLIC_VERIFICATION_STATUSES.has(row.verification_status)) return false;
  if (row.last_verified_date) return false;

  const phone = row.phone || '';
  const email = row.email || '';
  if ((phone && !String(phone).includes('(555)')) || email) return false;
  if (String(row.website || '').trim() !== 'https://www.cde.ca.gov/sp/se/') return false;

  try {
    const url = new URL(row.source_url || '');
    return url.hostname.toLowerCase().endsWith('advocacy.com');
  } catch {
    return false;
  }
}

function isPublicEligible(row) {
  return (
    !FALLBACK_DATA_ORIGINS.has(row.data_origin || '') &&
    !isLikelySyntheticPublicAdvocate(row) &&
    PUBLIC_VERIFICATION_STATUSES.has(row.verification_status || '') &&
    hasNonEmpty(row.source_url) &&
    !isSyntheticUrl(row.source_url) &&
    hasPublicContactSignal(row)
  );
}

function getFreshnessFields(row) {
  return {
    lastVerifiedAt: row.last_verified_at || null,
    lastVerifiedDate: row.last_verified_date || null,
    checkedAt: row.checked_at || null,
    sourceLastUpdated: row.source_last_updated || null,
    lastScrapedAt: row.last_scraped_at || null,
  };
}

function hasAnyFreshnessSignal(row) {
  const fields = getFreshnessFields(row);
  return Object.values(fields).some(hasNonEmpty);
}

function getSuggestedAction(row) {
  if (hasNonEmpty(row.last_verified_date) && !hasNonEmpty(row.last_verified_at)) {
    return 'Backfill last_verified_at from existing last_verified_date';
  }
  if (hasNonEmpty(row.last_scraped_at) && !hasNonEmpty(row.checked_at)) {
    return 'Backfill checked_at from existing last_scraped_at per repo freshness contract';
  }
  return 'Manual freshness review required before continued public trust assumptions';
}

function dedupeRows(rows) {
  const deduped = new Map();
  for (const row of rows) {
    const key = row.id;
    if (!deduped.has(key)) {
      deduped.set(key, row);
    }
  }
  return Array.from(deduped.values());
}

function normalizeCountyName(value) {
  if (!value) return null;
  return String(value).replace(/ County County$/i, ' County');
}

function summarizeTable({ table, label, stateJoin }) {
  const joinedRows = db.prepare(`
    SELECT DISTINCT
      ${table}.*,
      c.id AS joinedCountyId,
      c.name AS countyName,
      s.id AS stateId,
      s.name AS stateName
    FROM ${table}
    ${stateJoin}
  `).all();
  const rows = dedupeRows(joinedRows);

  const publicEligibleRows = rows.filter(isPublicEligible);
  const gapRows = publicEligibleRows
    .filter((row) => !hasAnyFreshnessSignal(row))
    .map((row) => ({
      id: row.id,
      name: row.name,
      stateId: row.stateId,
      stateName: row.stateName,
      countyId: row.county_id || row.joinedCountyId || null,
      countyName: normalizeCountyName(row.countyName || null),
      verificationStatus: row.verification_status || null,
      sourceUrl: row.source_url || null,
      sourceName: row.source_name || null,
      sourceType: row.source_type || null,
      phone: row.phone || row.intake_phone || row.spec_ed_contact_phone || null,
      email: row.email || row.spec_ed_contact_email || null,
      website: row.website || null,
      freshnessFields: getFreshnessFields(row),
      suggestedAction: getSuggestedAction(row),
    }));

  const states = gapRows.reduce((acc, row) => {
    const existing = acc.get(row.stateId) || { stateId: row.stateId, stateName: row.stateName, gapRows: 0 };
    existing.gapRows += 1;
    acc.set(row.stateId, existing);
    return acc;
  }, new Map());

  return {
    table,
    label,
    total: rows.length,
    publicEligible: publicEligibleRows.length,
    gapRows: gapRows.length,
    gapPctOfPublicEligible: pct(gapRows.length, publicEligibleRows.length),
    states: Array.from(states.values()).sort((a, b) => b.gapRows - a.gapRows || a.stateName.localeCompare(b.stateName)),
    rows: gapRows,
  };
}

const tables = TABLES.map(summarizeTable);

const payload = {
  generatedAt: generatedDate,
  dbPath,
  tables,
};

const mdLines = [
  '# Directory Freshness Gap Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This audit isolates public-eligible directory rows that still have no machine-usable freshness signal at all. It is narrower than the staleness audit: these rows are not old, they are timestamp-opaque.',
  '',
  '| Table | Total | Public Eligible | Gap Rows | Gap % of Public Eligible |',
  '| --- | ---: | ---: | ---: | ---: |',
];

for (const row of tables) {
  mdLines.push(`| ${row.label} | ${row.total} | ${row.publicEligible} | ${row.gapRows} | ${row.gapPctOfPublicEligible}% |`);
}

for (const table of tables) {
  mdLines.push('', `## ${table.label}`, '');
  mdLines.push(`- public eligible rows: ${table.publicEligible}/${table.total}`);
  mdLines.push(`- rows missing every freshness signal: ${table.gapRows}/${table.publicEligible} (${table.gapPctOfPublicEligible}%)`);

  if (table.states.length > 0) {
    mdLines.push('', 'States with freshness-gap rows:', '');
    for (const state of table.states) {
      mdLines.push(`- ${state.stateName}: ${state.gapRows}`);
    }
  }

  if (table.rows.length > 0) {
    mdLines.push('', 'Rows requiring freshness repair:', '');
    for (const row of table.rows) {
      const location = [row.countyName, row.stateName].filter(Boolean).join(', ');
      mdLines.push(`- ${row.name} (${row.id})${location ? `, ${location}` : ''}: source=${row.sourceUrl}; action=${row.suggestedAction}`);
    }
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
