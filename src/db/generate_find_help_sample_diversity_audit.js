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
const jsonOutPath = path.join(docsDir, `find-help-sample-diversity-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `find-help-sample-diversity-audit-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

const TABLES = [
  { table: 'resource_providers', label: 'Resource Providers', languageField: 'languages' },
  { table: 'nonprofit_organizations', label: 'Nonprofit Organizations', languageField: 'languages' },
  { table: 'iep_advocates', label: 'IEP Advocates', languageField: 'languages_spoken' },
];

const VERIFIED_STATUSES = new Set(['official_verified', 'verified', 'human_verified', 'source_listed']);

function parseDirectoryList(value) {
  if (!value) return [];
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function hasDirectoryAvailabilitySignal(row) {
  return Boolean(
    row.availability_status ||
    row.accepting_new_clients === 1 ||
    row.waitlist_status ||
    row.capacity_notes ||
    row.funding_status ||
    row.checked_at
  );
}

function hasDirectoryNextStepSignal(row) {
  return Boolean(
    row.next_step_type ||
    row.next_step_label ||
    row.next_step_url ||
    row.next_step_phone ||
    row.next_step_email ||
    row.next_step_instructions ||
    row.requirements ||
    row.application_url ||
    row.referral_url ||
    row.walk_in_available === 1 ||
    row.appointment_required === 1
  );
}

function hasDirectoryAccessibilitySignal(row, languageField) {
  return Boolean(row[languageField] || row.languages || row.languages_spoken || row.accessibility_notes) ||
    Boolean(row.interpreter_available || row.asl_available || row.wheelchair_accessible) ||
    Boolean(row.virtual_services || row.in_person_services || row.home_visits || row.transportation_help);
}

function hasDirectoryClaimGroundworkSignal(row) {
  return Boolean(row.claim_status || row.claim_email || row.claimed_by);
}

function getStructuredRichnessScore(row, languageField) {
  return [
    hasDirectoryAvailabilitySignal(row),
    hasDirectoryNextStepSignal(row),
    parseDirectoryList(row.service_tags).length > 0 || parseDirectoryList(row.serving_tags).length > 0,
    hasDirectoryAccessibilitySignal(row, languageField),
    hasDirectoryClaimGroundworkSignal(row),
  ].filter(Boolean).length;
}

function getFreshnessStamp(row) {
  return row.last_verified_date || row.last_verified_at || row.checked_at || row.last_scraped_at || '';
}

function sortByCoverageThenFreshness(languageField) {
  return (a, b) => {
    const scoreDiff = getStructuredRichnessScore(b, languageField) - getStructuredRichnessScore(a, languageField);
    if (scoreDiff !== 0) return scoreDiff;
    const accessibilityDiff =
      Number(hasDirectoryAccessibilitySignal(b, languageField)) -
      Number(hasDirectoryAccessibilitySignal(a, languageField));
    if (accessibilityDiff !== 0) return accessibilityDiff;
    return getFreshnessStamp(b).localeCompare(getFreshnessStamp(a));
  };
}

function getStateKey(row) {
  if (typeof row.state_id === 'string' && row.state_id.trim()) {
    return row.state_id.trim().toLowerCase();
  }
  if (typeof row.county_id === 'string' && row.county_id.includes('-')) {
    const countySegments = row.county_id.toLowerCase().split('-').filter(Boolean);
    const tail = countySegments[countySegments.length - 1];
    if (tail && tail.length === 2) return tail;
  }
  if (typeof row.id === 'string') {
    const segments = row.id.toLowerCase().split('-').filter(Boolean);
    if (segments[0] && segments[0].length === 2) return segments[0];
    if (segments[1] && segments[1].length === 2) return segments[1];
  }
  return null;
}

function getHostKey(url) {
  if (!url || !String(url).trim()) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function getFamilyKey(row) {
  const normalizedName = String(row.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalizedName.startsWith('the arc of ') || normalizedName.startsWith('arc of ') || normalizedName === 'the arc') {
    return 'umbrella:the-arc';
  }
  if (normalizedName.startsWith('parent to parent') || normalizedName.startsWith('p2p')) {
    return 'umbrella:parent-to-parent';
  }
  if (normalizedName.startsWith('disability rights ')) {
    return 'umbrella:disability-rights';
  }
  if (normalizedName.startsWith('autism society')) {
    return 'umbrella:autism-society';
  }

  const hostKey = getHostKey(row.source_url) || getHostKey(row.website);
  if (hostKey) return hostKey;

  const reducedName = normalizedName
    .replace(/\b(the|of|for|and|center|services|support|special|education|disability|developmental|children|child|hospital)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return reducedName.split(' ').slice(0, 3).join(' ') || String(row.id || '');
}

function isPublicSample(row) {
  return Boolean(
    row.source_url &&
    String(row.source_url).trim() &&
    row.verification_status &&
    VERIFIED_STATUSES.has(row.verification_status)
  );
}

function selectDiverseSamples(rows, languageField) {
  const sorted = [...rows].sort(sortByCoverageThenFreshness(languageField));
  const selected = [];
  const selectedIds = new Set();
  const familySeen = new Set();
  const stateSeen = new Set();

  const passes = [
    (row) => {
      const familyKey = getFamilyKey(row);
      const stateKey = getStateKey(row);
      return !familySeen.has(familyKey) && (!stateKey || !stateSeen.has(stateKey));
    },
    (row) => !familySeen.has(getFamilyKey(row)),
    () => true,
  ];

  for (const allowRow of passes) {
    for (const row of sorted) {
      if (selected.length >= 3) break;
      if (selectedIds.has(row.id) || !allowRow(row)) continue;
      selected.push(row);
      selectedIds.add(row.id);
      familySeen.add(getFamilyKey(row));
      const stateKey = getStateKey(row);
      if (stateKey) stateSeen.add(stateKey);
    }
    if (selected.length >= 3) break;
  }

  return selected;
}

function summarizeSelection(rows) {
  const states = rows.map(getStateKey).filter(Boolean);
  const families = rows.map(getFamilyKey).filter(Boolean);
  const hosts = rows.map((row) => getHostKey(row.source_url) || getHostKey(row.website)).filter(Boolean);

  return {
    sampleIds: rows.map((row) => row.id),
    states,
    families,
    hosts,
    distinctStates: new Set(states).size,
    distinctFamilies: new Set(families).size,
    distinctHosts: new Set(hosts).size,
  };
}

function summarizeTable({ table, label, languageField }) {
  const rows = (table === 'iep_advocates'
    ? db.prepare(`SELECT * FROM ${table}`).all()
    : db.prepare(`
        SELECT ${table}.*, counties.state_id
        FROM ${table}
        LEFT JOIN counties ON counties.id = ${table}.county_id
      `).all()
  ).filter(isPublicSample);
  const naiveSelection = [...rows].sort(sortByCoverageThenFreshness(languageField)).slice(0, 3);
  const diverseSelection = selectDiverseSamples(rows, languageField);

  return {
    table,
    label,
    publicCandidateCount: rows.length,
    naive: summarizeSelection(naiveSelection),
    diverse: summarizeSelection(diverseSelection),
    improved: {
      states: summarizeSelection(diverseSelection).distinctStates - summarizeSelection(naiveSelection).distinctStates,
      families: summarizeSelection(diverseSelection).distinctFamilies - summarizeSelection(naiveSelection).distinctFamilies,
      hosts: summarizeSelection(diverseSelection).distinctHosts - summarizeSelection(naiveSelection).distinctHosts,
    },
  };
}

const tables = TABLES.map(summarizeTable);

const payload = {
  generatedAt: generatedDate,
  dbPath,
  tables,
};

const mdLines = [
  '# Find Help Sample Diversity Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This audit compares a naive richness-and-freshness-only top-3 sample set against the current diversity-aware `/find-help` sample selection. The goal is not randomization. The goal is avoiding unnecessarily narrow public examples when equally strong rows from other states or org families already exist.',
  '',
  '| Table | Public Candidates | Naive Distinct States | Diverse Distinct States | Naive Distinct Families | Diverse Distinct Families |',
  '| --- | ---: | ---: | ---: | ---: | ---: |',
];

for (const table of tables) {
  mdLines.push(
    `| ${table.label} | ${table.publicCandidateCount} | ${table.naive.distinctStates} | ${table.diverse.distinctStates} | ${table.naive.distinctFamilies} | ${table.diverse.distinctFamilies} |`
  );
}

for (const table of tables) {
  mdLines.push('', `## ${table.label}`, '');
  mdLines.push(`- naive sample IDs: ${table.naive.sampleIds.join(', ') || 'none'}`);
  mdLines.push(`- diverse sample IDs: ${table.diverse.sampleIds.join(', ') || 'none'}`);
  mdLines.push(`- naive distinct states: ${table.naive.distinctStates}`);
  mdLines.push(`- diverse distinct states: ${table.diverse.distinctStates}`);
  mdLines.push(`- naive distinct families: ${table.naive.distinctFamilies}`);
  mdLines.push(`- diverse distinct families: ${table.diverse.distinctFamilies}`);
  mdLines.push(`- state diversity delta: ${table.improved.states >= 0 ? '+' : ''}${table.improved.states}`);
  mdLines.push(`- family diversity delta: ${table.improved.families >= 0 ? '+' : ''}${table.improved.families}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
