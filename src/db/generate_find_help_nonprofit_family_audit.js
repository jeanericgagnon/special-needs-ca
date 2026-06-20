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
const jsonOutPath = path.join(docsDir, `find-help-nonprofit-family-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `find-help-nonprofit-family-audit-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });
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

function hasDirectoryAccessibilitySignal(row) {
  return Boolean(row.languages || row.accessibility_notes) ||
    Boolean(row.interpreter_available || row.asl_available || row.wheelchair_accessible) ||
    Boolean(row.virtual_services || row.in_person_services || row.home_visits || row.transportation_help);
}

function hasDirectoryClaimGroundworkSignal(row) {
  return Boolean(row.claim_status || row.claim_email || row.claimed_by);
}

function getStructuredRichnessScore(row) {
  return [
    hasDirectoryAvailabilitySignal(row),
    hasDirectoryNextStepSignal(row),
    parseDirectoryList(row.service_tags).length > 0 || parseDirectoryList(row.serving_tags).length > 0,
    hasDirectoryAccessibilitySignal(row),
    hasDirectoryClaimGroundworkSignal(row),
  ].filter(Boolean).length;
}

function getFreshnessStamp(row) {
  return row.last_verified_date || row.last_verified_at || row.checked_at || row.last_scraped_at || '';
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

function getStateKey(row) {
  if (typeof row.state_id === 'string' && row.state_id.trim()) {
    return row.state_id.trim().toLowerCase();
  }
  if (typeof row.county_id === 'string' && row.county_id.includes('-')) {
    const countySegments = row.county_id.toLowerCase().split('-').filter(Boolean);
    const tail = countySegments[countySegments.length - 1];
    if (tail && tail.length === 2) return tail;
  }
  return null;
}

function isPublicSample(row) {
  return Boolean(
    row.source_url &&
    String(row.source_url).trim() &&
    row.verification_status &&
    VERIFIED_STATUSES.has(row.verification_status)
  );
}

function sortByCoverageThenFreshness(a, b) {
  const scoreDiff = getStructuredRichnessScore(b) - getStructuredRichnessScore(a);
  if (scoreDiff !== 0) return scoreDiff;
  return getFreshnessStamp(b).localeCompare(getFreshnessStamp(a));
}

function selectDiverseSamples(rows) {
  const sorted = [...rows].sort(sortByCoverageThenFreshness);
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

const publicRows = db.prepare(`
  SELECT nonprofit_organizations.*, counties.state_id
  FROM nonprofit_organizations
  LEFT JOIN counties ON counties.id = nonprofit_organizations.county_id
`).all().filter(isPublicSample);

const topFamilyCounts = new Map();
for (const row of publicRows) {
  const familyKey = getFamilyKey(row);
  topFamilyCounts.set(familyKey, (topFamilyCounts.get(familyKey) || 0) + 1);
}

const naiveSelection = [...publicRows].sort(sortByCoverageThenFreshness).slice(0, 3);
const diverseSelection = selectDiverseSamples(publicRows);

const topFamilies = [...topFamilyCounts.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 15)
  .map(([family, count]) => ({ family, count }));

const payload = {
  generatedAt: generatedDate,
  dbPath,
  publicCandidateCount: publicRows.length,
  topFamilies,
  naiveSelection: naiveSelection.map((row) => ({
    id: row.id,
    name: row.name,
    family: getFamilyKey(row),
    state: getStateKey(row),
    richnessScore: getStructuredRichnessScore(row),
    freshness: getFreshnessStamp(row),
  })),
  diverseSelection: diverseSelection.map((row) => ({
    id: row.id,
    name: row.name,
    family: getFamilyKey(row),
    state: getStateKey(row),
    richnessScore: getStructuredRichnessScore(row),
    freshness: getFreshnessStamp(row),
  })),
};

const mdLines = [
  '# Find Help Nonprofit Family Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This audit focuses on nonprofit sample concentration. It measures how much the trustworthy nonprofit pool clusters by domain/org family and compares the naive top-3 nonprofit sample set against the current diversity-aware selector.',
  '',
  `- public nonprofit candidates: ${payload.publicCandidateCount}`,
  '',
  '## Largest nonprofit families',
  '',
];

for (const family of topFamilies) {
  mdLines.push(`- ${family.family}: ${family.count}`);
}

mdLines.push('', '## Naive top-3 nonprofit samples', '');
for (const row of payload.naiveSelection) {
  mdLines.push(`- ${row.id}: family=${row.family}, state=${row.state || 'unknown'}, score=${row.richnessScore}, freshness=${row.freshness || 'none'}`);
}

mdLines.push('', '## Diversity-aware top-3 nonprofit samples', '');
for (const row of payload.diverseSelection) {
  mdLines.push(`- ${row.id}: family=${row.family}, state=${row.state || 'unknown'}, score=${row.richnessScore}, freshness=${row.freshness || 'none'}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
