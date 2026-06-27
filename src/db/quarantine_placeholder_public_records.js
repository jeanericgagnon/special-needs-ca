import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveNavigatorDbPath } from './resolveNavigatorDbPath.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const GENERATED_DATE = new Date().toISOString().slice(0, 10);
const PLACEHOLDER_EMAIL_PATTERNS = [
  /@example\.(com|org|net)$/i,
  /^test@/i,
  /^fake@/i,
  /^dummy@/i,
  /^placeholder@/i,
];
const PLACEHOLDER_NAME_PATTERNS = [
  /\bexample\b/i,
  /\bplaceholder\b/i,
  /\bgeneric\b/i,
  /\bstatewide support desk\b/i,
];
const INVALID_SOURCE_HOST_PATTERNS = [
  /^example\.(com|org|net)$/i,
  /^www\.example\.(com|org|net)$/i,
  /^state\.gov$/i,
  /^www\.state\.gov$/i,
  /^localhost$/i,
  /^127\.0\.0\.1$/i,
  /^0\.0\.0\.0$/i,
  /^ablefull\.org$/i,
  /^www\.ablefull\.org$/i,
  /^www\.advocate\./i,
  /^www\.therapy\./i,
  /^www\.legal\./i,
  /^www\.pediatrictherapy\./i,
  /^[a-z]{2}-pa\.org$/i,
];

const TABLE_CONFIGS = [
  {
    table: 'county_offices',
    idField: 'id',
    nameFields: ['office_name'],
    phoneFields: ['phone'],
    emailFields: ['email'],
    websiteFields: ['website'],
    sourceUrlFields: ['source_url'],
    requiredColumns: ['display_status'],
  },
  {
    table: 'school_districts',
    idField: 'id',
    nameFields: ['name'],
    phoneFields: ['spec_ed_contact_phone'],
    emailFields: ['spec_ed_contact_email'],
    websiteFields: ['website'],
    sourceUrlFields: ['source_url'],
    requiredColumns: ['display_status'],
  },
  {
    table: 'state_resource_agencies',
    idField: 'id',
    nameFields: ['name'],
    phoneFields: ['intake_phone', 'agency_intake_contact', 'early_intervention_contact'],
    emailFields: [],
    websiteFields: ['website'],
    sourceUrlFields: ['source_url'],
    requiredColumns: ['display_status'],
  },
  {
    table: 'regional_education_agencies',
    idField: 'id',
    nameFields: ['name'],
    phoneFields: [],
    emailFields: [],
    websiteFields: ['website'],
    sourceUrlFields: ['source_url'],
    requiredColumns: ['display_status'],
  },
  {
    table: 'iep_advocates',
    idField: 'id',
    nameFields: ['name'],
    phoneFields: ['phone', 'next_step_phone'],
    emailFields: ['email', 'next_step_email'],
    websiteFields: ['website'],
    sourceUrlFields: ['source_url'],
    actionUrlFields: ['next_step_url', 'application_url', 'referral_url'],
    requiredColumns: ['display_status'],
  },
  {
    table: 'resource_providers',
    idField: 'id',
    nameFields: ['name'],
    phoneFields: ['phone', 'next_step_phone'],
    emailFields: ['email', 'next_step_email'],
    websiteFields: ['website'],
    sourceUrlFields: ['source_url'],
    actionUrlFields: ['next_step_url', 'application_url', 'referral_url'],
    requiredColumns: ['display_status'],
  },
  {
    table: 'nonprofit_organizations',
    idField: 'id',
    nameFields: ['name'],
    phoneFields: ['phone', 'next_step_phone'],
    emailFields: ['email', 'next_step_email'],
    websiteFields: ['website'],
    sourceUrlFields: ['source_url'],
    actionUrlFields: ['next_step_url', 'application_url', 'referral_url'],
    requiredColumns: ['display_status'],
  },
];

function hasText(value) {
  return Boolean(String(value || '').trim());
}

function ensureColumns(db, tableName, columns) {
  const tableExists = db.prepare(`
    SELECT 1
    FROM sqlite_master
    WHERE type = 'table' AND name = ?
  `).get(tableName);

  if (!tableExists) {
    return false;
  }

  const existing = new Set(
    db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name)
  );

  for (const column of columns) {
    if (existing.has(column)) continue;
    if (column === 'display_status') {
      db.prepare(`ALTER TABLE ${tableName} ADD COLUMN display_status TEXT DEFAULT 'published'`).run();
    }
  }

  return true;
}

function normalizeUrlHost(url) {
  try {
    return new URL(String(url || '').trim()).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isPlaceholderPhone(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return false;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 10) return true;
  if (digits.startsWith('555') || digits.slice(3, 6) === '555') return true;
  if (/^(\d)\1+$/.test(digits)) return true;
  if (digits.endsWith('1234') || digits.endsWith('0000')) return true;
  return false;
}

function isPlaceholderEmail(value) {
  const trimmed = String(value || '').trim().toLowerCase();
  if (!trimmed) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return true;
  return PLACEHOLDER_EMAIL_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function isPlaceholderName(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return false;
  return PLACEHOLDER_NAME_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function isInvalidSourceUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return 'missing_source_url';

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return 'invalid_source_url';
  }

  const host = parsed.hostname.toLowerCase();
  if (!host) return 'invalid_source_url';
  const pathname = parsed.pathname.toLowerCase();
  if (
    ((host === 'www.google.com' || host === 'google.com') && pathname === '/search') ||
    ((host === 'www.bing.com' || host === 'bing.com') && pathname === '/search')
  ) {
    return 'search_result_source_url';
  }
  if (INVALID_SOURCE_HOST_PATTERNS.some((pattern) => pattern.test(host))) {
    return 'placeholder_source_url';
  }

  return null;
}

function getRowReasons(row, config) {
  const reasons = [];

  for (const field of config.nameFields) {
    if (isPlaceholderName(row[field])) {
      reasons.push(`placeholder_name:${field}`);
    }
  }

  for (const field of config.phoneFields) {
    if (hasText(row[field]) && isPlaceholderPhone(row[field])) {
      reasons.push(`placeholder_phone:${field}`);
    }
  }

  for (const field of config.emailFields) {
    if (hasText(row[field]) && isPlaceholderEmail(row[field])) {
      reasons.push(`placeholder_email:${field}`);
    }
  }

  const sourceIssues = config.sourceUrlFields
    .map((field) => ({ field, issue: isInvalidSourceUrl(row[field]) }))
    .filter((entry) => entry.issue);

  if (sourceIssues.length > 0) {
    for (const entry of sourceIssues) {
      reasons.push(`${entry.issue}:${entry.field}`);
    }
  }

  const websiteIssues = (config.websiteFields || [])
    .filter((field) => hasText(row[field]))
    .map((field) => ({ field, issue: isInvalidSourceUrl(row[field]) }))
    .filter((entry) => entry.issue);

  if (websiteIssues.length > 0) {
    for (const entry of websiteIssues) {
      reasons.push(`placeholder_website:${entry.field}`);
    }
  }

  const actionUrlIssues = (config.actionUrlFields || [])
    .filter((field) => hasText(row[field]))
    .map((field) => ({ field, issue: isInvalidSourceUrl(row[field]) }))
    .filter((entry) => entry.issue);

  if (actionUrlIssues.length > 0) {
    for (const entry of actionUrlIssues) {
      reasons.push(`placeholder_action_url:${entry.field}`);
    }
  }

  return [...new Set(reasons)];
}

function buildSummaryRowsByTable(results) {
  return results.map((entry) => ({
    table: entry.table,
    scanned: entry.scanned,
    downgraded: entry.downgraded,
    unchanged: entry.unchanged,
    reasonCounts: entry.reasonCounts,
  }));
}

function buildMarkdownReport(summary) {
  const lines = [
    '# Public Placeholder Quarantine Audit',
    '',
    `Generated: ${summary.generatedAt}`,
    `Database: ${summary.dbPath}`,
    '',
    `Total scanned: ${summary.totalScanned}`,
    `Total downgraded: ${summary.totalDowngraded}`,
    '',
    '## Table Summary',
    '',
    '| Table | Scanned | Downgraded | Unchanged |',
    '| --- | ---: | ---: | ---: |',
    ...summary.tables.map((row) => `| ${row.table} | ${row.scanned} | ${row.downgraded} | ${row.unchanged} |`),
    '',
    '## Sample Downgrades',
    '',
  ];

  if (summary.sampleDowngrades.length === 0) {
    lines.push('No rows were downgraded.');
  } else {
    for (const row of summary.sampleDowngrades) {
      lines.push(`- ${row.table} / ${row.id}: ${row.reasons.join(', ')}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

export function quarantinePlaceholderPublicRecords({
  dbPath = resolveNavigatorDbPath(repoRoot),
  outputDir = path.join(repoRoot, 'docs/generated'),
  generatedDate = GENERATED_DATE,
} = {}) {
  const db = new Database(dbPath);
  const sampleDowngrades = [];
  const tableResults = [];

  const tx = db.transaction(() => {
    for (const config of TABLE_CONFIGS) {
      const ready = ensureColumns(db, config.table, config.requiredColumns);
      if (!ready) {
        tableResults.push({
          table: config.table,
          scanned: 0,
          downgraded: 0,
          unchanged: 0,
          reasonCounts: {},
        });
        continue;
      }

      const rows = db.prepare(`
        SELECT *
        FROM ${config.table}
        WHERE COALESCE(display_status, 'published') = 'published'
      `).all();

      const updateStmt = db.prepare(`
        UPDATE ${config.table}
        SET display_status = 'needs_review'
        WHERE ${config.idField} = ?
      `);

      const reasonCounts = {};
      let downgraded = 0;
      let unchanged = 0;

      for (const row of rows) {
        const reasons = getRowReasons(row, config);
        if (reasons.length === 0) {
          unchanged += 1;
          continue;
        }

        updateStmt.run(row[config.idField]);
        downgraded += 1;

        for (const reason of reasons) {
          reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
        }

        if (sampleDowngrades.length < 25) {
          sampleDowngrades.push({
            table: config.table,
            id: row[config.idField],
            reasons,
          });
        }
      }

      tableResults.push({
        table: config.table,
        scanned: rows.length,
        downgraded,
        unchanged,
        reasonCounts,
      });
    }
  });

  tx();
  db.close();

  fs.mkdirSync(outputDir, { recursive: true });

  const summary = {
    generatedAt: generatedDate,
    dbPath: path.relative(repoRoot, dbPath),
    totalScanned: tableResults.reduce((sum, row) => sum + row.scanned, 0),
    totalDowngraded: tableResults.reduce((sum, row) => sum + row.downgraded, 0),
    tables: buildSummaryRowsByTable(tableResults),
    sampleDowngrades,
  };

  const jsonOutPath = path.join(outputDir, `public-placeholder-quarantine-audit-${generatedDate}.json`);
  const mdOutPath = path.join(outputDir, `public-placeholder-quarantine-audit-${generatedDate}.md`);

  fs.writeFileSync(jsonOutPath, JSON.stringify(summary, null, 2));
  fs.writeFileSync(mdOutPath, buildMarkdownReport(summary));

  return { summary, jsonOutPath, mdOutPath };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { summary, jsonOutPath, mdOutPath } = quarantinePlaceholderPublicRecords();
  console.log(`Wrote ${path.relative(repoRoot, jsonOutPath)}`);
  console.log(`Wrote ${path.relative(repoRoot, mdOutPath)}`);
  console.log(JSON.stringify(summary, null, 2));
}
