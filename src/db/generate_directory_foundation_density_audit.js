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
const jsonOutPath = path.join(docsDir, `directory-foundation-density-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `directory-foundation-density-audit-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

const TABLE_CONFIG = {
  resource_providers: {
    label: 'Resource Providers',
    stateJoin: 'JOIN counties c ON c.id = resource_providers.county_id',
  },
  nonprofit_organizations: {
    label: 'Nonprofit Organizations',
    stateJoin: 'JOIN counties c ON c.id = nonprofit_organizations.county_id',
  },
  iep_advocates: {
    label: 'IEP Advocates',
    stateJoin: null,
  },
};

const GROUPS = {
  tags: ['service_tags', 'serving_tags'],
  availability: ['availability_status', 'accepting_new_clients', 'waitlist_status', 'capacity_notes', 'funding_status', 'checked_at'],
  nextSteps: ['next_step_type', 'next_step_label', 'next_step_url', 'next_step_phone', 'next_step_email', 'next_step_instructions', 'application_url', 'referral_url'],
  accessibility: ['languages', 'languages_spoken', 'interpreter_available', 'asl_available', 'wheelchair_accessible', 'virtual_services', 'in_person_services', 'home_visits', 'transportation_help', 'accessibility_notes'],
  claimGroundwork: ['claim_status', 'claimed_by', 'verified_affiliation', 'claim_email'],
  trustFreshness: ['source_url', 'verification_status', 'source_name', 'source_last_updated', 'checked_at', 'last_verified_at', 'last_verified_date', 'last_scraped_at'],
};

function getColumns(tableName) {
  return new Set(db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name));
}

function pct(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 1000) / 10;
}

function getCondition(column) {
  if (column === 'verified_affiliation') return `${column} = 1`;
  if (
    column === 'accepting_new_clients' ||
    column === 'interpreter_available' ||
    column === 'asl_available' ||
    column === 'wheelchair_accessible' ||
    column === 'virtual_services' ||
    column === 'in_person_services' ||
    column === 'home_visits' ||
    column === 'transportation_help'
  ) {
    return `${column} = 1`;
  }
  return `${column} IS NOT NULL AND TRIM(CAST(${column} AS TEXT)) <> ''`;
}

function summarizeTable(tableName) {
  const columns = getColumns(tableName);
  const total = db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get().count;
  const groupSummary = {};

  for (const [groupName, fieldCandidates] of Object.entries(GROUPS)) {
    const presentFields = fieldCandidates.filter((field) => columns.has(field));
    const missingFields = fieldCandidates.filter((field) => !columns.has(field));
    if (!presentFields.length) {
      groupSummary[groupName] = {
        presentFields,
        missingFields,
        recordsWithSignal: 0,
        pctWithSignal: 0,
      };
      continue;
    }

    const whereClause = presentFields.map(getCondition).join(' OR ');
    const recordsWithSignal = db.prepare(`SELECT COUNT(*) AS count FROM ${tableName} WHERE ${whereClause}`).get().count;
    groupSummary[groupName] = {
      presentFields,
      missingFields,
      recordsWithSignal,
      pctWithSignal: pct(recordsWithSignal, total),
    };
  }

  return { total, groups: groupSummary };
}

function summarizeStates(tableName, stateJoin) {
  if (!stateJoin) return [];

  const columns = getColumns(tableName);
  const tagFields = ['service_tags', 'serving_tags'].filter((field) => columns.has(field));
  const nextStepFields = ['next_step_type', 'next_step_phone', 'next_step_email', 'next_step_url'].filter((field) => columns.has(field));
  const availabilityFields = ['availability_status', 'accepting_new_clients', 'waitlist_status', 'capacity_notes', 'funding_status', 'checked_at'].filter((field) => columns.has(field));
  const freshnessFields = ['source_url', 'verification_status', 'source_name', 'source_last_updated', 'checked_at', 'last_verified_at', 'last_verified_date', 'last_scraped_at'].filter((field) => columns.has(field));

  const tagClause = tagFields.length ? tagFields.map(getCondition).join(' OR ') : '0';
  const nextStepClause = nextStepFields.length ? nextStepFields.map(getCondition).join(' OR ') : '0';
  const availabilityClause = availabilityFields.length ? availabilityFields.map(getCondition).join(' OR ') : '0';
  const freshnessClause = freshnessFields.length ? freshnessFields.map(getCondition).join(' OR ') : '0';

  return db.prepare(`
    SELECT
      s.id AS stateId,
      s.name AS stateName,
      COUNT(*) AS total,
      SUM(CASE WHEN ${tagClause} THEN 1 ELSE 0 END) AS tagRows,
      SUM(CASE WHEN ${nextStepClause} THEN 1 ELSE 0 END) AS nextStepRows,
      SUM(CASE WHEN ${availabilityClause} THEN 1 ELSE 0 END) AS availabilityRows,
      SUM(CASE WHEN ${freshnessClause} THEN 1 ELSE 0 END) AS freshnessRows
    FROM ${tableName}
    ${stateJoin}
    JOIN states s ON s.id = c.state_id
    GROUP BY s.id, s.name
    ORDER BY total DESC, s.name ASC
  `).all().map((row) => ({
    ...row,
    tagPct: pct(row.tagRows, row.total),
    nextStepPct: pct(row.nextStepRows, row.total),
    availabilityPct: pct(row.availabilityRows, row.total),
    freshnessPct: pct(row.freshnessRows, row.total),
  }));
}

const tables = Object.entries(TABLE_CONFIG).map(([tableName, config]) => ({
  tableName,
  label: config.label,
  ...summarizeTable(tableName),
  states: summarizeStates(tableName, config.stateJoin),
}));

const payload = {
  generatedAt: generatedDate,
  dbPath,
  tables,
};

const mdLines = [
  '# Directory Foundation Density Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  '## Table Summary',
  '',
  '| Table | Total Rows | Tags | Availability | Next Steps | Accessibility | Claim Groundwork | Trust/Freshness |',
  '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
];

for (const table of tables) {
  mdLines.push(
    `| ${table.label} | ${table.total} | ${table.groups.tags.pctWithSignal}% | ${table.groups.availability.pctWithSignal}% | ${table.groups.nextSteps.pctWithSignal}% | ${table.groups.accessibility.pctWithSignal}% | ${table.groups.claimGroundwork.pctWithSignal}% | ${table.groups.trustFreshness.pctWithSignal}% |`
  );
}

for (const table of tables) {
  mdLines.push('', `## ${table.label}`, '', `Total rows: ${table.total}`, '');
  for (const [groupName, summary] of Object.entries(table.groups)) {
    mdLines.push(`- ${groupName}: ${summary.recordsWithSignal}/${table.total} (${summary.pctWithSignal}%)`);
    if (summary.missingFields.length > 0) {
      mdLines.push(`- ${groupName} missing columns in checked-in DB: ${summary.missingFields.join(', ')}`);
    }
    if (groupName === 'availability') {
      mdLines.push('- availability counts source-backed unknown status and checked freshness fields, not only concrete live capacity updates.');
    }
  }

  if (table.states.length > 0) {
    mdLines.push('', 'Top states by row volume:', '');
    for (const state of table.states.slice(0, 8)) {
      mdLines.push(`- ${state.stateName}: ${state.total} rows, tags ${state.tagPct}%, next steps ${state.nextStepPct}%, availability ${state.availabilityPct}%, trust/freshness ${state.freshnessPct}%`);
    }
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
