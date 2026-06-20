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
const jsonOutPath = path.join(docsDir, `directory-availability-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `directory-availability-audit-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

const TABLES = [
  { table: 'resource_providers', label: 'Resource Providers' },
  { table: 'nonprofit_organizations', label: 'Nonprofit Organizations' },
  { table: 'iep_advocates', label: 'IEP Advocates' },
];

function count(table, where = '1=1') {
  return db.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE ${where}`).get().count;
}

function pct(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 1000) / 10;
}

const payload = {
  generatedAt: generatedDate,
  dbPath,
  tables: TABLES.map(({ table, label }) => {
    const total = count(table);
    const trustedChecked = count(
      table,
      "checked_at IS NOT NULL AND TRIM(checked_at) <> '' AND source_url IS NOT NULL AND TRIM(source_url) <> '' AND verification_status IN ('official_verified','verified','human_verified','source_listed')"
    );
    const explicitUnknown = count(table, "availability_status = 'unknown'");
    const concreteAvailability = count(
      table,
      "availability_status IN ('available','limited','near_capacity','waitlist','full','out_of_funding','temporarily_closed')"
    );
    const acceptingNew = count(table, 'accepting_new_clients = 1');
    const waitlist = count(table, "waitlist_status IS NOT NULL AND TRIM(waitlist_status) <> ''");
    const capacityNotes = count(table, "capacity_notes IS NOT NULL AND TRIM(capacity_notes) <> ''");
    const fundingStatus = count(table, "funding_status IS NOT NULL AND TRIM(funding_status) <> ''");
    const missingAvailabilityDespiteChecked = count(
      table,
      "checked_at IS NOT NULL AND TRIM(checked_at) <> '' AND source_url IS NOT NULL AND TRIM(source_url) <> '' AND verification_status IN ('official_verified','verified','human_verified','source_listed') AND (availability_status IS NULL OR TRIM(availability_status) = '') AND (waitlist_status IS NULL OR TRIM(waitlist_status) = '') AND (capacity_notes IS NULL OR TRIM(capacity_notes) = '') AND (funding_status IS NULL OR TRIM(funding_status) = '') AND accepting_new_clients IS NULL"
    );

    return {
      table,
      label,
      total,
      trustedChecked,
      explicitUnknown,
      concreteAvailability,
      acceptingNew,
      waitlist,
      capacityNotes,
      fundingStatus,
      missingAvailabilityDespiteChecked,
      explicitUnknownPct: pct(explicitUnknown, total),
      concreteAvailabilityPct: pct(concreteAvailability, total),
      trustedCheckedPct: pct(trustedChecked, total),
    };
  }),
};

const mdLines = [
  '# Directory Availability Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This audit separates concrete live availability signals from truthful `unknown` coverage so we do not confuse checked rows with published capacity.',
  '',
  '| Table | Total | Trusted + Checked | Explicit Unknown | Concrete Availability | Waitlist | Funding | Missing Despite Checked |',
  '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
];

for (const row of payload.tables) {
  mdLines.push(
    `| ${row.label} | ${row.total} | ${row.trustedChecked} | ${row.explicitUnknown} | ${row.concreteAvailability} | ${row.waitlist} | ${row.fundingStatus} | ${row.missingAvailabilityDespiteChecked} |`
  );
}

for (const row of payload.tables) {
  mdLines.push('', `## ${row.label}`, '');
  mdLines.push(`- trusted + checked rows: ${row.trustedChecked}/${row.total} (${row.trustedCheckedPct}%)`);
  mdLines.push(`- explicit unknown: ${row.explicitUnknown}/${row.total} (${row.explicitUnknownPct}%)`);
  mdLines.push(`- concrete availability statuses: ${row.concreteAvailability}/${row.total} (${row.concreteAvailabilityPct}%)`);
  mdLines.push(`- accepting new clients: ${row.acceptingNew}/${row.total}`);
  mdLines.push(`- waitlist signals: ${row.waitlist}/${row.total}`);
  mdLines.push(`- capacity notes: ${row.capacityNotes}/${row.total}`);
  mdLines.push(`- funding status signals: ${row.fundingStatus}/${row.total}`);
  mdLines.push(`- still missing availability despite checked trusted source: ${row.missingAvailabilityDespiteChecked}/${row.total}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
