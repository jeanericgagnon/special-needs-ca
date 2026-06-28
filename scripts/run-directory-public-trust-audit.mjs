import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  isRenderableDirectoryFoundationRecord,
  validateDirectoryFoundationRecord,
} from '../frontend/src/lib/directoryFoundation.ts';
import {
  isPublicCountyOfficeEligible,
  isPublicDirectoryRecordEligible,
  isPublicRecordEligible,
} from '../frontend/src/lib/publicTruth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `directory-public-trust-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `directory-public-trust-audit-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

const TABLES = [
  {
    table: 'iep_advocates',
    label: 'IEP Advocates',
    type: 'directory',
    query: `
      SELECT ia.*
      FROM iep_advocates ia
    `,
  },
  {
    table: 'resource_providers',
    label: 'Resource Providers',
    type: 'directory',
    query: `
      SELECT rp.*
      FROM resource_providers rp
    `,
  },
  {
    table: 'nonprofit_organizations',
    label: 'Nonprofit Organizations',
    type: 'directory',
    query: `
      SELECT npo.*
      FROM nonprofit_organizations npo
    `,
  },
  {
    table: 'county_offices',
    label: 'County Offices',
    type: 'county_office',
    query: `
      SELECT co.*
      FROM county_offices co
    `,
  },
];

function ensureDocsDir() {
  fs.mkdirSync(docsDir, { recursive: true });
}

function dedupeById(rows) {
  const seen = new Map();
  for (const row of rows) {
    const key = row.id || `${row.name || row.office_name || 'unknown'}-${seen.size}`;
    if (!seen.has(key)) seen.set(key, row);
  }
  return Array.from(seen.values());
}

function countIssues(rows) {
  const counts = new Map();
  for (const row of rows) {
    for (const issue of row.issues) {
      counts.set(issue, (counts.get(issue) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([issue, count]) => ({ issue, count }))
    .sort((a, b) => b.count - a.count || a.issue.localeCompare(b.issue));
}

function makeSample(row) {
  return {
    id: row.id || null,
    name: row.name || row.office_name || null,
    source_url: row.source_url || null,
    verification_status: row.verification_status || null,
    display_status: row.display_status || null,
    phone: row.phone || row.intake_phone || row.spec_ed_contact_phone || null,
    email: row.email || row.spec_ed_contact_email || row.next_step_email || null,
    website: row.website || null,
    issues: row.issues,
  };
}

function summarizeDirectoryTable(config) {
  const rows = dedupeById(db.prepare(config.query).all());
  const eligibleRows = rows.filter((row) => isPublicRecordEligible(row));
  const renderableRows = rows.filter((row) => isRenderableDirectoryFoundationRecord(row));
  const blockedRows = rows
    .map((row) => ({
      ...row,
      issues: validateDirectoryFoundationRecord(row),
      publicEligible: isPublicRecordEligible(row),
      renderable: isRenderableDirectoryFoundationRecord(row),
      directoryEligible: isPublicDirectoryRecordEligible(row),
    }))
    .filter((row) => !row.renderable || !row.directoryEligible || !row.publicEligible);

  return {
    table: config.table,
    label: config.label,
    totalRows: rows.length,
    publicEligibleRows: eligibleRows.length,
    renderableRows: renderableRows.length,
    blockedRows: blockedRows.length,
    topIssues: countIssues(blockedRows),
    samples: blockedRows.slice(0, 12).map(makeSample),
  };
}

function summarizeCountyOfficeTable(config) {
  const rows = dedupeById(db.prepare(config.query).all());
  const publicEligibleRows = rows.filter((row) => isPublicRecordEligible(row));
  const countyOfficeEligibleRows = rows.filter((row) => isPublicCountyOfficeEligible(row));
  const blockedRows = rows
    .map((row) => {
      const issues = [];
      if (!isPublicRecordEligible(row)) issues.push('not_public_record_eligible');
      if (!isPublicCountyOfficeEligible(row)) issues.push('not_public_county_office_eligible');
      return {
        ...row,
        issues,
      };
    })
    .filter((row) => row.issues.length > 0);

  return {
    table: config.table,
    label: config.label,
    totalRows: rows.length,
    publicEligibleRows: publicEligibleRows.length,
    renderableRows: countyOfficeEligibleRows.length,
    blockedRows: blockedRows.length,
    topIssues: countIssues(blockedRows),
    samples: blockedRows.slice(0, 12).map(makeSample),
  };
}

function summarizeTable(config) {
  if (config.type === 'county_office') {
    return summarizeCountyOfficeTable(config);
  }
  return summarizeDirectoryTable(config);
}

function buildMarkdown(payload) {
  const lines = [
    '# Directory Public Trust Audit',
    '',
    `Generated: ${payload.generatedAt}`,
    '',
    `Database: \`${payload.dbPathRelative}\``,
    '',
    'This audit measures public directory rows that would currently be suppressed because of missing provenance, placeholder contacts, placeholder names, or other trust issues.',
    '',
  ];

  for (const summary of payload.tables) {
    lines.push(`## ${summary.label}`);
    lines.push('');
    lines.push(`- Total rows: ${summary.totalRows}`);
    lines.push(`- Public-eligible rows: ${summary.publicEligibleRows}`);
    lines.push(`- Renderable rows: ${summary.renderableRows}`);
    lines.push(`- Blocked rows: ${summary.blockedRows}`);
    lines.push('');
    lines.push('Top issues:');
    if (summary.topIssues.length === 0) {
      lines.push('- none');
    } else {
      for (const issue of summary.topIssues.slice(0, 10)) {
        lines.push(`- ${issue.issue}: ${issue.count}`);
      }
    }
    lines.push('');
    lines.push('Sample blocked rows:');
    if (summary.samples.length === 0) {
      lines.push('- none');
    } else {
      for (const sample of summary.samples.slice(0, 6)) {
        lines.push(`- ${sample.id || 'unknown'} | ${sample.name || 'unnamed'} | issues=${sample.issues.join(', ')}`);
      }
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

ensureDocsDir();

const payload = {
  generatedAt: new Date().toISOString(),
  dbPathRelative: path.relative(repoRoot, dbPath),
  tables: TABLES.map(summarizeTable),
};

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, buildMarkdown(payload));

console.log(`Wrote ${path.relative(repoRoot, jsonOutPath)}`);
console.log(`Wrote ${path.relative(repoRoot, mdOutPath)}`);
