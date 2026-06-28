import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const summaryJsonPath = path.join(generatedDir, 'published-provenance-audit-v1.json');
const summaryMdPath = path.join(generatedDir, 'published-provenance-audit-v1.md');

const TABLES = [
  { table: 'programs', label: 'Programs', sourceExpr: "COALESCE(source_url, official_source_url)" },
  { table: 'state_resource_agencies', label: 'DD/IDD Agencies', sourceExpr: 'source_url' },
  { table: 'county_offices', label: 'Offices', sourceExpr: 'source_url' },
  { table: 'school_districts', label: 'School Districts', sourceExpr: 'source_url' },
  { table: 'regional_education_agencies', label: 'Regional Education Routing', sourceExpr: 'source_url' },
  { table: 'forms_and_guides', label: 'Forms', sourceExpr: 'source_url' },
  { table: 'nonprofit_organizations', label: 'Nonprofits', sourceExpr: 'source_url' },
  { table: 'resource_providers', label: 'Providers', sourceExpr: 'source_url' },
  { table: 'sources', label: 'Source Documents', sourceExpr: 'url' },
  { table: 'source_verifications', label: 'Verification Events', sourceExpr: 'source_url' },
];

function countWhere(db, table, where) {
  return db.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE ${where}`).get().count;
}

function getColumns(db, table) {
  return new Set(db.prepare(`PRAGMA table_info(${table})`).all().map((row) => row.name));
}

function eligibleWhereClause(columns) {
  if (columns.has('display_status')) {
    return `COALESCE(display_status, 'published') = 'published'`;
  }
  return '1=1';
}

function missingMetric(db, table, columns, eligibleWhere, columnName) {
  if (!columns.has(columnName)) return null;
  if (columnName === 'confidence_score') return countWhere(db, table, `${eligibleWhere} AND ${columnName} IS NULL`);
  return countWhere(db, table, `${eligibleWhere} AND (${columnName} IS NULL OR TRIM(${columnName}) = '')`);
}

function run() {
  const db = new Database(dbPath, { readonly: true });
  const rows = TABLES.map((item) => {
    const columns = getColumns(db, item.table);
    const eligibleWhere = eligibleWhereClause(columns);
    const total = countWhere(db, item.table, eligibleWhere);
    const missingSource = countWhere(db, item.table, `${eligibleWhere} AND (${item.sourceExpr} IS NULL OR TRIM(${item.sourceExpr}) = '')`);
    const missingSourceType = missingMetric(db, item.table, columns, eligibleWhere, 'source_type');
    const missingDataOrigin = missingMetric(db, item.table, columns, eligibleWhere, 'data_origin');
    const missingVerificationStatus = missingMetric(db, item.table, columns, eligibleWhere, 'verification_status');
    const missingLastVerifiedDate = missingMetric(db, item.table, columns, eligibleWhere, 'last_verified_date');
    const missingLastScrapedAt = missingMetric(db, item.table, columns, eligibleWhere, 'last_scraped_at');
    const missingConfidenceScore = missingMetric(db, item.table, columns, eligibleWhere, 'confidence_score');
    const publishBlocked = countWhere(
      db,
      item.table,
      columns.has('verification_status')
        ? `${eligibleWhere} AND (((${item.sourceExpr} IS NULL OR TRIM(${item.sourceExpr}) = '') OR (verification_status IS NULL OR TRIM(verification_status) = '')))`
        : `${eligibleWhere} AND ((${item.sourceExpr} IS NULL OR TRIM(${item.sourceExpr}) = ''))`
    );
    const strongClauses = [eligibleWhere, `${item.sourceExpr} IS NOT NULL`, `TRIM(${item.sourceExpr}) <> ''`];
    for (const columnName of ['source_type', 'data_origin', 'verification_status', 'last_verified_date', 'last_scraped_at']) {
      if (columns.has(columnName)) {
        strongClauses.push(`${columnName} IS NOT NULL`, `TRIM(${columnName}) <> ''`);
      }
    }
    if (columns.has('confidence_score')) strongClauses.push('confidence_score IS NOT NULL');
    const strongReady = countWhere(db, item.table, strongClauses.join(' AND '));

    return {
      table: item.table,
      label: item.label,
      total,
      eligibleWhere,
      strongReady,
      publishBlocked,
      missingSource,
      missingSourceType,
      missingDataOrigin,
      missingVerificationStatus,
      missingLastVerifiedDate,
      missingLastScrapedAt,
      missingConfidenceScore,
    };
  });

  const summary = {
    generatedAt: new Date().toISOString(),
    dbPath: path.relative(repoRoot, dbPath),
    publishRule: 'Do not publish canonical rows that lack source_url and verification_status. Strong provenance additionally requires source_type, data_origin, last_verified_date, last_scraped_at, and confidence_score.',
    tables: rows,
  };

  fs.mkdirSync(generatedDir, { recursive: true });
  fs.writeFileSync(summaryJsonPath, `${JSON.stringify(summary, null, 2)}\n`);
  const md = [
    '# Published Provenance Audit v1',
    '',
    `Generated: ${summary.generatedAt}`,
    '',
    summary.publishRule,
    '',
    '| Table | Total | Strong Ready | Publish Blocked | Missing Source | Missing Verification | Missing Source Type | Missing Data Origin | Missing Verified Date | Missing Scraped At | Missing Confidence |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...rows.map((row) => `| ${row.table} | ${row.total} | ${row.strongReady} | ${row.publishBlocked} | ${row.missingSource} | ${row.missingVerificationStatus} | ${row.missingSourceType} | ${row.missingDataOrigin} | ${row.missingLastVerifiedDate} | ${row.missingLastScrapedAt} | ${row.missingConfidenceScore} |`),
  ].join('\n');
  fs.writeFileSync(summaryMdPath, `${md}\n`);
  db.close();
  console.log(JSON.stringify(summary, null, 2));
}

run();
