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
const jsonOutPath = path.join(docsDir, `directory-staleness-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `directory-staleness-audit-${generatedDate}.md`);

const STALE_DAYS = 425;
const PUBLIC_VERIFICATION_STATUSES = new Set(['official_verified', 'verified', 'human_verified', 'source_listed']);
const SYNTHETIC_SOURCE_HOST_PATTERNS = [
  /^www\.advocate\./,
  /^www\.therapy\./,
  /^www\.legal\./,
  /^www\.pediatrictherapy\./,
  /^[a-z]{2}-pa\.org$/,
];
const FALLBACK_DATA_ORIGINS = new Set(['programmatic_fallback', 'generated_county_fallback']);

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

function pct(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 1000) / 10;
}

function parseDate(value) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function pickFreshnessStamp(row) {
  return row.last_verified_at || row.last_verified_date || row.checked_at || row.source_last_updated || row.last_scraped_at || null;
}

function getFreshnessAgeDays(row) {
  const stamp = pickFreshnessStamp(row);
  const time = parseDate(stamp);
  if (!time) return null;
  return (Date.now() - time) / (1000 * 60 * 60 * 24);
}

function isStale(row) {
  const ageDays = getFreshnessAgeDays(row);
  return ageDays !== null && ageDays > STALE_DAYS;
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

  const hasPhone = Boolean(phone && !String(phone).includes('(555)'));
  const hasEmail = Boolean(email && !String(email).endsWith('@example.com'));
  const hasWebsite = Boolean(String(website).trim());

  return hasPhone || hasEmail || hasWebsite;
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
    Boolean(row.source_url && !isSyntheticUrl(row.source_url)) &&
    hasPublicContactSignal(row)
  );
}

function summarizeBucket(ageDays) {
  if (ageDays === null) return 'missing';
  if (ageDays <= 90) return '0-90d';
  if (ageDays <= 180) return '91-180d';
  if (ageDays <= 365) return '181-365d';
  if (ageDays <= STALE_DAYS) return `366-${STALE_DAYS}d`;
  if (ageDays <= 730) return `${STALE_DAYS + 1}-730d`;
  return '731d+';
}

function summarizeRows(rows) {
  const counts = {
    total: rows.length,
    publicEligible: 0,
    stale: 0,
    publicEligibleStale: 0,
    missingFreshnessSignal: 0,
    publicEligibleMissingFreshnessSignal: 0,
    invalidFreshnessSignal: 0,
    manualReviewRequired: 0,
  };
  const freshnessBuckets = {
    '0-90d': 0,
    '91-180d': 0,
    '181-365d': 0,
    [`366-${STALE_DAYS}d`]: 0,
    [`${STALE_DAYS + 1}-730d`]: 0,
    '731d+': 0,
    missing: 0,
  };

  const staleExamples = [];

  for (const row of rows) {
    const publicEligible = isPublicEligible(row);
    const stamp = pickFreshnessStamp(row);
    const stampTime = parseDate(stamp);
    const ageDays = getFreshnessAgeDays(row);
    const stale = isStale(row);

    counts.publicEligible += publicEligible ? 1 : 0;
    counts.stale += stale ? 1 : 0;
    counts.publicEligibleStale += publicEligible && stale ? 1 : 0;
    counts.missingFreshnessSignal += stamp ? 0 : 1;
    counts.publicEligibleMissingFreshnessSignal += publicEligible && !stamp ? 1 : 0;
    counts.invalidFreshnessSignal += stamp && !stampTime ? 1 : 0;
    counts.manualReviewRequired += row.manual_review_required === 1 ? 1 : 0;

    freshnessBuckets[summarizeBucket(ageDays)] += 1;

    if (staleExamples.length < 8 && stale) {
      staleExamples.push({
        id: row.id,
        name: row.name,
        verificationStatus: row.verification_status || null,
        stateId: row.stateId || null,
        stateName: row.stateName || null,
        freshnessStamp: stamp,
        ageDays: Math.round(ageDays),
        publicEligible,
        sourceUrl: row.source_url || null,
      });
    }
  }

  return {
    counts: {
      ...counts,
      publicEligiblePct: pct(counts.publicEligible, counts.total),
      stalePct: pct(counts.stale, counts.total),
      publicEligibleStalePct: pct(counts.publicEligibleStale, counts.publicEligible),
      missingFreshnessSignalPct: pct(counts.missingFreshnessSignal, counts.total),
      publicEligibleMissingFreshnessSignalPct: pct(counts.publicEligibleMissingFreshnessSignal, counts.publicEligible),
    },
    freshnessBuckets,
    staleExamples,
  };
}

function fetchRows(table, stateJoin) {
  return db.prepare(`
    SELECT DISTINCT
      ${table}.*,
      s.id AS stateId,
      s.name AS stateName
    FROM ${table}
    ${stateJoin}
  `).all();
}

function summarizeStates(table, stateJoin) {
  const rows = db.prepare(`
    SELECT DISTINCT
      ${table}.*,
      s.id AS stateId,
      s.name AS stateName
    FROM ${table}
    ${stateJoin}
  `).all();

  const grouped = new Map();
  for (const row of rows) {
    const key = row.stateId;
    if (!grouped.has(key)) {
      grouped.set(key, {
        stateId: row.stateId,
        stateName: row.stateName,
        rows: [],
      });
    }
    grouped.get(key).rows.push(row);
  }

  return Array.from(grouped.values())
    .map(({ stateId, stateName, rows: stateRows }) => {
      const summary = summarizeRows(stateRows);
      return {
        stateId,
        stateName,
        total: summary.counts.total,
        publicEligible: summary.counts.publicEligible,
        stale: summary.counts.stale,
        publicEligibleStale: summary.counts.publicEligibleStale,
        missingFreshnessSignal: summary.counts.missingFreshnessSignal,
        publicEligibleMissingFreshnessSignal: summary.counts.publicEligibleMissingFreshnessSignal,
        stalePct: summary.counts.stalePct,
        publicEligibleStalePct: summary.counts.publicEligibleStalePct,
      };
    })
    .sort((a, b) =>
      b.publicEligibleStale - a.publicEligibleStale ||
      b.stale - a.stale ||
      b.total - a.total ||
      a.stateName.localeCompare(b.stateName)
    );
}

const tables = TABLES.map(({ table, label, stateJoin }) => {
  const rows = fetchRows(table, stateJoin);
  const summary = summarizeRows(rows);
  return {
    table,
    label,
    ...summary,
    states: summarizeStates(table, stateJoin),
  };
});

const payload = {
  generatedAt: generatedDate,
  dbPath,
  staleThresholdDays: STALE_DAYS,
  tables,
};

const mdLines = [
  '# Directory Staleness Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  `This audit uses the same freshness priority already baked into the directory foundation audit: \`last_verified_at\` -> \`last_verified_date\` -> \`checked_at\` -> \`source_last_updated\` -> \`last_scraped_at\`. Rows older than ${STALE_DAYS} days are treated as stale.`,
  '',
  '| Table | Total | Public Eligible | Stale | Public Eligible Stale | Missing Freshness Signal | Manual Review Required |',
  '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
];

for (const row of tables) {
  mdLines.push(
    `| ${row.label} | ${row.counts.total} | ${row.counts.publicEligible} | ${row.counts.stale} | ${row.counts.publicEligibleStale} | ${row.counts.missingFreshnessSignal} | ${row.counts.manualReviewRequired} |`
  );
}

for (const row of tables) {
  mdLines.push('', `## ${row.label}`, '');
  mdLines.push(`- public eligible rows: ${row.counts.publicEligible}/${row.counts.total} (${row.counts.publicEligiblePct}%)`);
  mdLines.push(`- stale rows: ${row.counts.stale}/${row.counts.total} (${row.counts.stalePct}%)`);
  mdLines.push(`- stale among public eligible rows: ${row.counts.publicEligibleStale}/${row.counts.publicEligible || 0} (${row.counts.publicEligibleStalePct}%)`);
  mdLines.push(`- rows missing all freshness signals: ${row.counts.missingFreshnessSignal}/${row.counts.total} (${row.counts.missingFreshnessSignalPct}%)`);
  mdLines.push(`- public eligible rows missing all freshness signals: ${row.counts.publicEligibleMissingFreshnessSignal}/${row.counts.publicEligible || 0} (${row.counts.publicEligibleMissingFreshnessSignalPct}%)`);
  mdLines.push(`- rows flagged for manual review: ${row.counts.manualReviewRequired}/${row.counts.total}`);
  mdLines.push(`- rows with invalid freshness stamps: ${row.counts.invalidFreshnessSignal}/${row.counts.total}`);
  mdLines.push('', 'Freshness buckets:', '');
  mdLines.push(`- 0-90d: ${row.freshnessBuckets['0-90d']}`);
  mdLines.push(`- 91-180d: ${row.freshnessBuckets['91-180d']}`);
  mdLines.push(`- 181-365d: ${row.freshnessBuckets['181-365d']}`);
  mdLines.push(`- 366-${STALE_DAYS}d: ${row.freshnessBuckets[`366-${STALE_DAYS}d`]}`);
  mdLines.push(`- ${STALE_DAYS + 1}-730d: ${row.freshnessBuckets[`${STALE_DAYS + 1}-730d`]}`);
  mdLines.push(`- 731d+: ${row.freshnessBuckets['731d+']}`);
  mdLines.push(`- missing: ${row.freshnessBuckets.missing}`);

  if (row.states.length > 0) {
    mdLines.push('', 'States with the most public-eligible stale rows:', '');
    for (const state of row.states.slice(0, 8)) {
      mdLines.push(`- ${state.stateName}: public stale ${state.publicEligibleStale}/${state.publicEligible || 0} (${state.publicEligibleStalePct}%), total stale ${state.stale}/${state.total}`);
    }
  }

  if (row.staleExamples.length > 0) {
    mdLines.push('', 'Sample stale rows:', '');
    for (const example of row.staleExamples) {
      mdLines.push(`- ${example.name} (${example.id})${example.stateName ? `, ${example.stateName}` : ''}: ${example.ageDays} days old via ${example.freshnessStamp}; public eligible: ${example.publicEligible ? 'yes' : 'no'}`);
    }
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
