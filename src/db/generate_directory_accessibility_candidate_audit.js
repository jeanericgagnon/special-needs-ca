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
const jsonOutPath = path.join(docsDir, `directory-accessibility-candidates-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `directory-accessibility-candidates-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

const TABLES = [
  {
    stagingTable: 'staging_scraped_nonprofit_organizations',
    targetTable: 'nonprofit_organizations',
    label: 'Nonprofit Organizations',
    targetIdField: 'suggested_target_id',
  },
  {
    stagingTable: 'staging_scraped_resource_providers',
    targetTable: 'resource_providers',
    label: 'Resource Providers',
    targetIdField: 'suggested_target_id',
  },
];

const CLUE_PATTERNS = [
  { id: 'english', label: 'English', regex: /\benglish\b/i },
  { id: 'spanish', label: 'Spanish', regex: /\bspanish\b|\bespanol\b/i },
  { id: 'asl', label: 'ASL', regex: /\basl\b/i },
  { id: 'interpreter', label: 'Interpreter', regex: /\binterpreter\b/i },
  { id: 'wheelchair', label: 'Wheelchair', regex: /\bwheelchair\b/i },
  { id: 'transportation', label: 'Transportation', regex: /\btransportation\b|\btransport\b/i },
  { id: 'home_visits', label: 'Home Visits', regex: /\bhome visit\b|\bhome visits\b/i },
  { id: 'telehealth', label: 'Telehealth', regex: /\btelehealth\b/i },
];

function getTargetColumns(tableName) {
  return new Set(db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name));
}

function loadCurrentTarget(targetTable, targetId) {
  return db.prepare(`SELECT * FROM ${targetTable} WHERE id = ?`).get(targetId);
}

function detectClues(rawText) {
  const text = String(rawText || '');
  return CLUE_PATTERNS.filter((pattern) => pattern.regex.test(text)).map((pattern) => pattern.id);
}

function listContains(value, needle) {
  return String(value || '')
    .toLowerCase()
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .includes(String(needle || '').toLowerCase());
}

function clueAlreadySatisfied(currentTarget, clueId) {
  if (!currentTarget) return false;
  switch (clueId) {
    case 'english':
      return listContains(currentTarget.languages, 'english') || listContains(currentTarget.languages_spoken, 'english');
    case 'spanish':
      return listContains(currentTarget.languages, 'spanish')
        || listContains(currentTarget.languages, 'espanol')
        || listContains(currentTarget.languages_spoken, 'spanish')
        || listContains(currentTarget.languages_spoken, 'espanol');
    case 'asl':
      return Number(currentTarget.asl_available || 0) === 1;
    case 'interpreter':
      return Number(currentTarget.interpreter_available || 0) === 1;
    case 'wheelchair':
      return Number(currentTarget.wheelchair_accessible || 0) === 1;
    case 'transportation':
      return Number(currentTarget.transportation_help || 0) === 1;
    case 'home_visits':
      return Number(currentTarget.home_visits || 0) === 1;
    case 'telehealth':
      return Number(currentTarget.virtual_services || 0) === 1;
    default:
      return false;
  }
}

function summarizeCandidates({ stagingTable, targetTable, label, targetIdField }) {
  const stagingRows = db.prepare(`
    SELECT ${targetIdField} AS target_id, extracted_name, source_url, raw_text_excerpt
    FROM ${stagingTable}
    WHERE ${targetIdField} IS NOT NULL
      AND TRIM(${targetIdField}) <> ''
  `).all();

  const targetColumns = getTargetColumns(targetTable);
  const candidateMap = new Map();

  for (const row of stagingRows) {
    const clueIds = detectClues(row.raw_text_excerpt);
    if (!clueIds.length) continue;

    const existing = candidateMap.get(row.target_id) || {
      targetId: row.target_id,
      extractedName: row.extracted_name || null,
      sourceUrl: row.source_url || null,
      clueIds: new Set(),
      exampleExcerpt: row.raw_text_excerpt || null,
    };

    for (const clueId of clueIds) {
      existing.clueIds.add(clueId);
    }

    if (!existing.exampleExcerpt && row.raw_text_excerpt) {
      existing.exampleExcerpt = row.raw_text_excerpt;
    }

    candidateMap.set(row.target_id, existing);
  }

  const clueTotals = Object.fromEntries(CLUE_PATTERNS.map((pattern) => [pattern.id, 0]));
  const candidates = [];

  for (const candidate of candidateMap.values()) {
    const currentTarget = loadCurrentTarget(targetTable, candidate.targetId);
    const clueIds = Array.from(candidate.clueIds)
      .filter((clueId) => !clueAlreadySatisfied(currentTarget, clueId))
      .sort();

    if (!clueIds.length) continue;

    for (const clueId of clueIds) {
      clueTotals[clueId] += 1;
    }

    candidates.push({
      targetId: candidate.targetId,
      extractedName: candidate.extractedName,
      sourceUrl: candidate.sourceUrl,
      clueIds,
      currentFields: {
        languages: targetColumns.has('languages') ? (currentTarget?.languages || null) : null,
        languagesSpoken: targetColumns.has('languages_spoken') ? (currentTarget?.languages_spoken || null) : null,
        interpreterAvailable: targetColumns.has('interpreter_available') ? (currentTarget?.interpreter_available ?? null) : null,
        aslAvailable: targetColumns.has('asl_available') ? (currentTarget?.asl_available ?? null) : null,
        wheelchairAccessible: targetColumns.has('wheelchair_accessible') ? (currentTarget?.wheelchair_accessible ?? null) : null,
        virtualServices: targetColumns.has('virtual_services') ? (currentTarget?.virtual_services ?? null) : null,
        homeVisits: targetColumns.has('home_visits') ? (currentTarget?.home_visits ?? null) : null,
        transportationHelp: targetColumns.has('transportation_help') ? (currentTarget?.transportation_help ?? null) : null,
      },
      exampleExcerpt: String(candidate.exampleExcerpt || '').slice(0, 320),
    });
  }

  candidates.sort((a, b) => b.clueIds.length - a.clueIds.length || a.targetId.localeCompare(b.targetId));

  return {
    label,
    stagingTable,
    targetTable,
    totalCandidates: candidates.length,
    clueTotals,
    candidates: candidates.slice(0, 250),
  };
}

const tables = TABLES.map(summarizeCandidates);

const payload = {
  generatedAt: generatedDate,
  dbPath,
  clueDefinitions: CLUE_PATTERNS.map(({ id, label }) => ({ id, label })),
  tables,
};

const mdLines = [
  '# Directory Accessibility Candidate Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This audit shows staging-to-target accessibility and language clues that are explicit enough to review for safe enrichment. It is a candidate queue, not a proof that every clue should be promoted automatically.',
];

for (const table of tables) {
  mdLines.push('', `## ${table.label}`, '');
  mdLines.push(`- candidate targets: ${table.totalCandidates}`);
  mdLines.push(`- clue totals: ${Object.entries(table.clueTotals).map(([id, count]) => `${id}=${count}`).join(', ')}`);

  if (!table.candidates.length) {
    mdLines.push('- no explicit candidate clues found in the checked-in staging rows');
    continue;
  }

  mdLines.push('', 'Sample candidates:', '');
  for (const candidate of table.candidates.slice(0, 20)) {
    mdLines.push(`- ${candidate.targetId}: clues=${candidate.clueIds.join(', ')} | current languages=${candidate.currentFields.languages || candidate.currentFields.languagesSpoken || 'none'} | excerpt=${candidate.exampleExcerpt.replace(/\s+/g, ' ').trim()}`);
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
