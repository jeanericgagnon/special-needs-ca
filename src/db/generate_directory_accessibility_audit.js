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
const jsonOutPath = path.join(docsDir, `directory-accessibility-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `directory-accessibility-audit-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

const TABLES = [
  {
    table: 'resource_providers',
    label: 'Resource Providers',
    languageField: 'languages',
    stateJoin: 'JOIN counties c ON c.id = resource_providers.county_id',
  },
  {
    table: 'nonprofit_organizations',
    label: 'Nonprofit Organizations',
    languageField: 'languages',
    stateJoin: 'JOIN counties c ON c.id = nonprofit_organizations.county_id',
  },
  {
    table: 'iep_advocates',
    label: 'IEP Advocates',
    languageField: 'languages_spoken',
    stateJoin: null,
  },
];

function count(table, where = '1=1') {
  return db.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE ${where}`).get().count;
}

function pct(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 1000) / 10;
}

function trustedPublicWhere(table) {
  return `${table}.source_url IS NOT NULL AND TRIM(${table}.source_url) <> '' AND ${table}.verification_status IN ('official_verified','verified','human_verified','source_listed')`;
}

function summarizeTable({ table, label, languageField, stateJoin }) {
  const total = count(table);
  const trustedPublic = count(table, trustedPublicWhere(table));
  const languages = count(table, `${languageField} IS NOT NULL AND TRIM(${languageField}) <> ''`);
  const notes = count(table, "accessibility_notes IS NOT NULL AND TRIM(accessibility_notes) <> ''");
  const interpreter = count(table, 'interpreter_available = 1');
  const asl = count(table, 'asl_available = 1');
  const wheelchair = count(table, 'wheelchair_accessible = 1');
  const virtualServices = count(table, 'virtual_services = 1');
  const inPerson = count(table, 'in_person_services = 1');
  const localInPersonEvidence = table === 'nonprofit_organizations'
    ? count(table, "accessibility_evidence_level IN ('service_location_address','county_specific_location')")
    : inPerson;
  const orgLevelPhysicalPresence = table === 'nonprofit_organizations'
    ? count(table, "accessibility_evidence_level IN ('organization_physical_address','statewide_service_area')")
    : 0;
  const legacyUnscopedInPerson = table === 'nonprofit_organizations'
    ? count(table, "in_person_services = 1 AND (accessibility_evidence_level IS NULL OR TRIM(accessibility_evidence_level) = '')")
    : 0;
  const homeVisits = count(table, 'home_visits = 1');
  const transportation = count(table, 'transportation_help = 1');
  const anyAccessibility = count(
    table,
    `(${languageField} IS NOT NULL AND TRIM(${languageField}) <> '') OR (accessibility_notes IS NOT NULL AND TRIM(accessibility_notes) <> '') OR interpreter_available = 1 OR asl_available = 1 OR wheelchair_accessible = 1 OR virtual_services = 1 OR in_person_services = 1 OR home_visits = 1 OR transportation_help = 1`
  );
  const trustedButMissing = count(
    table,
    `${trustedPublicWhere(table)} AND (${languageField} IS NULL OR TRIM(${languageField}) = '') AND (accessibility_notes IS NULL OR TRIM(accessibility_notes) = '') AND COALESCE(interpreter_available, 0) = 0 AND COALESCE(asl_available, 0) = 0 AND COALESCE(wheelchair_accessible, 0) = 0 AND COALESCE(virtual_services, 0) = 0 AND COALESCE(in_person_services, 0) = 0 AND COALESCE(home_visits, 0) = 0 AND COALESCE(transportation_help, 0) = 0`
  );

  const summary = {
    table,
    label,
    total,
    trustedPublic,
    anyAccessibility,
    trustedButMissing,
    fieldCounts: {
      languages,
      accessibilityNotes: notes,
      interpreterAvailable: interpreter,
      aslAvailable: asl,
      wheelchairAccessible: wheelchair,
      virtualServices,
      inPersonServices: inPerson,
      localInPersonEvidence,
      orgLevelPhysicalPresence,
      legacyUnscopedInPerson,
      homeVisits,
      transportationHelp: transportation,
    },
    pct: {
      trustedPublic: pct(trustedPublic, total),
      anyAccessibility: pct(anyAccessibility, total),
      trustedButMissing: pct(trustedButMissing, total),
    },
  };

  if (!stateJoin) {
    return { ...summary, states: [] };
  }

  const states = db.prepare(`
    SELECT
      s.id AS stateId,
      s.name AS stateName,
      COUNT(*) AS total,
      SUM(CASE WHEN ${languageField} IS NOT NULL AND TRIM(${languageField}) <> '' THEN 1 ELSE 0 END) AS languageRows,
      SUM(CASE WHEN (accessibility_notes IS NOT NULL AND TRIM(accessibility_notes) <> '') OR interpreter_available = 1 OR asl_available = 1 OR wheelchair_accessible = 1 OR virtual_services = 1 OR in_person_services = 1 OR home_visits = 1 OR transportation_help = 1 THEN 1 ELSE 0 END) AS accessRows,
      SUM(CASE WHEN ${trustedPublicWhere(table)} THEN 1 ELSE 0 END) AS trustedRows,
      SUM(CASE WHEN ${trustedPublicWhere(table)} AND (${languageField} IS NULL OR TRIM(${languageField}) = '') AND (accessibility_notes IS NULL OR TRIM(accessibility_notes) = '') AND COALESCE(interpreter_available, 0) = 0 AND COALESCE(asl_available, 0) = 0 AND COALESCE(wheelchair_accessible, 0) = 0 AND COALESCE(virtual_services, 0) = 0 AND COALESCE(in_person_services, 0) = 0 AND COALESCE(home_visits, 0) = 0 AND COALESCE(transportation_help, 0) = 0 THEN 1 ELSE 0 END) AS trustedMissingRows
    FROM ${table}
    ${stateJoin}
    JOIN states s ON s.id = c.state_id
    GROUP BY s.id, s.name
    HAVING COUNT(*) > 0
    ORDER BY trustedMissingRows DESC, total DESC, s.name ASC
  `).all().map((row) => ({
    ...row,
    languagePct: pct(row.languageRows, row.total),
    accessPct: pct(row.accessRows, row.total),
    trustedPct: pct(row.trustedRows, row.total),
    trustedMissingPct: pct(row.trustedMissingRows, row.total),
  }));

  return { ...summary, states };
}

const tables = TABLES.map(summarizeTable);

const payload = {
  generatedAt: generatedDate,
  dbPath,
  tables,
};

const mdLines = [
  '# Directory Accessibility Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This audit tracks where public directory rows carry real language, modality, or accessibility support fields, and where trusted public rows still expose no accessibility signal at all.',
  '',
  '| Table | Total | Trusted Public | Any Accessibility Signal | Trusted But Missing All Accessibility | Languages | Wheelchair | Virtual | Home Visits | Transportation |',
  '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
];

for (const row of tables) {
  mdLines.push(
    `| ${row.label} | ${row.total} | ${row.trustedPublic} | ${row.anyAccessibility} | ${row.trustedButMissing} | ${row.fieldCounts.languages} | ${row.fieldCounts.wheelchairAccessible} | ${row.fieldCounts.virtualServices} | ${row.fieldCounts.homeVisits} | ${row.fieldCounts.transportationHelp} |`
  );
}

for (const row of tables) {
  mdLines.push('', `## ${row.label}`, '');
  mdLines.push(`- trusted public rows: ${row.trustedPublic}/${row.total} (${row.pct.trustedPublic}%)`);
  mdLines.push(`- rows with any accessibility signal: ${row.anyAccessibility}/${row.total} (${row.pct.anyAccessibility}%)`);
  mdLines.push(`- trusted public rows still missing all accessibility signals: ${row.trustedButMissing}/${row.total} (${row.pct.trustedButMissing}%)`);
  mdLines.push(`- languages: ${row.fieldCounts.languages}/${row.total}`);
  mdLines.push(`- accessibility notes: ${row.fieldCounts.accessibilityNotes}/${row.total}`);
  mdLines.push(`- interpreter available: ${row.fieldCounts.interpreterAvailable}/${row.total}`);
  mdLines.push(`- ASL available: ${row.fieldCounts.aslAvailable}/${row.total}`);
  mdLines.push(`- wheelchair accessible: ${row.fieldCounts.wheelchairAccessible}/${row.total}`);
  mdLines.push(`- virtual services: ${row.fieldCounts.virtualServices}/${row.total}`);
  mdLines.push(`- in-person services: ${row.fieldCounts.inPersonServices}/${row.total}`);
  if (row.table === 'nonprofit_organizations') {
    mdLines.push(`- local in-person evidence rows: ${row.fieldCounts.localInPersonEvidence}/${row.total}`);
    mdLines.push(`- org-level physical presence rows: ${row.fieldCounts.orgLevelPhysicalPresence}/${row.total}`);
    mdLines.push(`- legacy unscoped in-person rows: ${row.fieldCounts.legacyUnscopedInPerson}/${row.total}`);
  }
  mdLines.push(`- home visits: ${row.fieldCounts.homeVisits}/${row.total}`);
  mdLines.push(`- transportation help: ${row.fieldCounts.transportationHelp}/${row.total}`);

  if (row.states.length > 0) {
    mdLines.push('', 'States with the most trusted rows still missing accessibility signals:', '');
    for (const state of row.states.slice(0, 8)) {
      mdLines.push(`- ${state.stateName}: trusted missing ${state.trustedMissingRows}/${state.total} (${state.trustedMissingPct}%), any access ${state.accessPct}%, languages ${state.languagePct}%`);
    }
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
