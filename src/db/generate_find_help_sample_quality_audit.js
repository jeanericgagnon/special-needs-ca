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
const jsonOutPath = path.join(docsDir, `find-help-sample-quality-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `find-help-sample-quality-audit-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

const TABLES = [
  {
    table: 'resource_providers',
    label: 'Resource Providers',
    kind: 'Provider',
    languageField: 'languages',
  },
  {
    table: 'nonprofit_organizations',
    label: 'Nonprofit Organizations',
    kind: 'Nonprofit',
    languageField: 'languages',
  },
  {
    table: 'iep_advocates',
    label: 'IEP Advocates',
    kind: 'Advocate',
    languageField: 'languages_spoken',
  },
];

const VERIFIED_STATUSES = new Set(['official_verified', 'verified', 'human_verified', 'source_listed']);
const SERVICE_TAGS = new Set([
  'food',
  'housing',
  'home_mods',
  'utilities',
  'supplies',
  'transport',
  'therapy',
  'behavioral_health',
  'benefits',
  'grants',
  'respite',
  'in_home_support',
  'caregiving',
  'early_intervention',
  'special_education',
  'iep_advocacy',
  'vocational_rehab',
  'transition',
  'guardianship',
  'trusts',
  'legal_aid',
  'appeals',
]);
const SERVING_TAGS = new Set([
  'down_syndrome',
  'autism',
  'idd_dd',
  'early_childhood',
  'school_age',
  'transition_age',
  'parents_caregivers',
  'medicaid_waiver_families',
  'iep_families',
  'non_english_speakers',
  'rural_families',
  'low_income_families',
]);
const INVALID_SOURCE_HOSTS = [
  /^www\.advocate\./,
  /^www\.therapy\./,
  /^www\.legal\./,
  /^www\.pediatrictherapy\./,
  /^[a-z]{2}-pa\.org$/,
];

function parseDirectoryList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
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

function getCoverage(row, languageField) {
  return {
    hasAvailability: hasDirectoryAvailabilitySignal(row),
    hasNextStep: hasDirectoryNextStepSignal(row),
    hasTags: parseDirectoryList(row.service_tags).length > 0 || parseDirectoryList(row.serving_tags).length > 0,
    hasAccessibility: hasDirectoryAccessibilitySignal(row, languageField),
    hasClaimGroundwork: hasDirectoryClaimGroundworkSignal(row),
  };
}

function getStructuredRichnessScore(row, languageField) {
  return Object.values(getCoverage(row, languageField)).filter(Boolean).length;
}

function getFreshnessStamp(row) {
  return row.last_verified_date || row.last_verified_at || row.checked_at || row.last_scraped_at || '';
}

function isSyntheticDirectoryUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return INVALID_SOURCE_HOSTS.some((pattern) => pattern.test(parsed.hostname));
  } catch {
    return true;
  }
}

function invalidTagValues(raw, allowed) {
  return parseDirectoryList(raw).filter((value) => !allowed.has(value));
}

function isLikelySyntheticAdvocateProfile(row) {
  if (!String(row.id || '').startsWith('gen-')) return false;
  if (!VERIFIED_STATUSES.has(row.verification_status || '')) return false;
  if (row.last_verified_date) return false;
  if (String(row.email || '').trim() || String(row.next_step_email || '').trim()) return false;
  const phone = String(row.next_step_phone || '').trim();
  if (phone.includes('(555)')) return false;
  if (phone) return false;

  if (String(row.website || '').trim() !== 'https://www.cde.ca.gov/sp/se/') return false;

  try {
    const sourceHost = new URL(row.source_url || '').hostname.toLowerCase();
    return sourceHost.endsWith('advocacy.com');
  } catch {
    return false;
  }
}

function validateRow(row) {
  const issues = [];
  const actionUrls = [row.next_step_url, row.application_url, row.referral_url];

  if (row.source_url && isSyntheticDirectoryUrl(row.source_url)) {
    issues.push('synthetic_source_url');
  }
  if (row.website && isSyntheticDirectoryUrl(row.website)) {
    issues.push('synthetic_website');
  }
  if (actionUrls.some((url) => url && isSyntheticDirectoryUrl(url))) {
    issues.push('synthetic_action_url');
  }
  if (invalidTagValues(row.service_tags, SERVICE_TAGS).length > 0) {
    issues.push('invalid_service_tags');
  }
  if (invalidTagValues(row.serving_tags, SERVING_TAGS).length > 0) {
    issues.push('invalid_serving_tags');
  }
  if (
    ['verified', 'official_verified', 'human_verified'].includes(row.verification_status || '') &&
    !row.source_url
  ) {
    issues.push('verified_without_source_url');
  }
  if (String(row.categories || '').toLowerCase().includes('program') && row.focus_condition) {
    issues.push('possible_provider_program_confusion');
  }
  if (typeof row.unsupported_claim_flags === 'string' && row.unsupported_claim_flags.trim()) {
    issues.push('unsupported_claim_flags_present');
  }
  if (isLikelySyntheticAdvocateProfile(row)) {
    issues.push('likely_synthetic_advocate_profile');
  }

  return issues;
}

function isRenderableRow(row) {
  const issues = validateRow(row);
  return !issues.includes('synthetic_source_url') &&
    !issues.includes('synthetic_website') &&
    !issues.includes('synthetic_action_url') &&
    !issues.includes('unsupported_claim_flags_present') &&
    !issues.includes('likely_synthetic_advocate_profile');
}

function isPublicSample(row) {
  return Boolean(
    row.source_url &&
    String(row.source_url).trim() &&
    row.verification_status &&
    VERIFIED_STATUSES.has(row.verification_status)
  );
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
    (row) => {
      const familyKey = getFamilyKey(row);
      return !familySeen.has(familyKey);
    },
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

function summarizeRow(row, languageField) {
  const coverage = getCoverage(row, languageField);
  return {
    id: row.id,
    name: row.name,
    verificationStatus: row.verification_status || null,
    richnessScore: getStructuredRichnessScore(row, languageField),
    freshnessStamp: getFreshnessStamp(row) || null,
    renderable: isRenderableRow(row),
    issues: validateRow(row),
    coverage,
    availabilityStatus: row.availability_status || null,
    nextStepType: row.next_step_type || null,
    serviceTags: parseDirectoryList(row.service_tags).slice(0, 6),
    servingTags: parseDirectoryList(row.serving_tags).slice(0, 6),
    languageValue: row[languageField] || null,
    sourceUrl: row.source_url || null,
  };
}

function summarizeTable({ table, label, kind, languageField }) {
  const rows = table === 'iep_advocates'
    ? db.prepare(`SELECT * FROM ${table}`).all()
    : db.prepare(`
        SELECT ${table}.*, counties.state_id
        FROM ${table}
        LEFT JOIN counties ON counties.id = ${table}.county_id
      `).all();
  const publicCandidates = rows.filter(isPublicSample);
  const publicSorted = [...publicCandidates].sort(sortByCoverageThenFreshness(languageField));
  const selectedPreRender = selectDiverseSamples(publicCandidates, languageField);
  const renderedSelection = selectedPreRender.filter(isRenderableRow);
  const renderablePool = publicCandidates.filter(isRenderableRow);
  const idealRenderableSelection = selectDiverseSamples(renderablePool, languageField);

  const hiddenSelected = selectedPreRender
    .filter((row) => !isRenderableRow(row))
    .map((row) => summarizeRow(row, languageField));
  const renderedIds = renderedSelection.map((row) => row.id);
  const idealIds = idealRenderableSelection.map((row) => row.id);

  const renderedMatchesIdeal =
    renderedIds.length === idealIds.length &&
    renderedIds.every((id, index) => id === idealIds[index]);

  const richerRenderableRowsOutsideRendered = idealRenderableSelection
    .filter((row) => !renderedIds.includes(row.id))
    .map((row) => summarizeRow(row, languageField));

  return {
    table,
    label,
    kind,
    totalRows: rows.length,
    publicCandidateCount: publicCandidates.length,
    renderablePublicCandidateCount: renderablePool.length,
    selectedPreRenderCount: selectedPreRender.length,
    renderedSelectionCount: renderedSelection.length,
    renderedMatchesIdeal,
    blockers: {
      hiddenSelectedCount: hiddenSelected.length,
      richerRenderableRowsSkippedCount: richerRenderableRowsOutsideRendered.length,
    },
    selectedPreRender: selectedPreRender.map((row) => summarizeRow(row, languageField)),
    renderedSelection: renderedSelection.map((row) => summarizeRow(row, languageField)),
    idealRenderableSelection: idealRenderableSelection.map((row) => summarizeRow(row, languageField)),
    hiddenSelected,
    richerRenderableRowsOutsideRendered,
  };
}

const tables = TABLES.map(summarizeTable);

const payload = {
  generatedAt: generatedDate,
  dbPath,
  summary: {
    totalTables: tables.length,
    tablesMatchingIdeal: tables.filter((table) => table.renderedMatchesIdeal).length,
    tablesWithHiddenSelections: tables.filter((table) => table.blockers.hiddenSelectedCount > 0).length,
    tablesWithSkippedRenderableRows: tables.filter((table) => table.blockers.richerRenderableRowsSkippedCount > 0).length,
  },
  tables,
};

const mdLines = [
  '# Find Help Sample Quality Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This audit mirrors the live `/find-help` sample-card contract: choose up to 3 public-safe rows per table by structured richness first and freshness second, then apply the same render-time truth gating used by the page.',
  '',
  '| Table | Public Candidates | Renderable Public Candidates | Selected Before Render | Rendered | Matches Ideal Renderable Set | Hidden Selected Rows | Skipped Better Renderable Rows |',
  '| --- | ---: | ---: | ---: | ---: | --- | ---: | ---: |',
];

for (const table of tables) {
  mdLines.push(
    `| ${table.label} | ${table.publicCandidateCount} | ${table.renderablePublicCandidateCount} | ${table.selectedPreRenderCount} | ${table.renderedSelectionCount} | ${table.renderedMatchesIdeal ? 'yes' : 'no'} | ${table.blockers.hiddenSelectedCount} | ${table.blockers.richerRenderableRowsSkippedCount} |`
  );
}

for (const table of tables) {
  mdLines.push('', `## ${table.label}`, '');
  mdLines.push(`- public candidates: ${table.publicCandidateCount}`);
  mdLines.push(`- renderable public candidates: ${table.renderablePublicCandidateCount}`);
  mdLines.push(`- selected before render: ${table.selectedPreRenderCount}`);
  mdLines.push(`- rendered cards: ${table.renderedSelectionCount}`);
  mdLines.push(`- rendered selection matches ideal renderable set: ${table.renderedMatchesIdeal ? 'yes' : 'no'}`);

  if (table.selectedPreRender.length) {
    mdLines.push('', 'Selected before render:', '');
    for (const row of table.selectedPreRender) {
      mdLines.push(`- ${row.id}: score=${row.richnessScore}, renderable=${row.renderable ? 'yes' : 'no'}, issues=${row.issues.join(', ') || 'none'}, freshness=${row.freshnessStamp || 'none'}`);
    }
  }

  if (table.hiddenSelected.length) {
    mdLines.push('', 'Selected rows hidden by render-time truth gating:', '');
    for (const row of table.hiddenSelected) {
      mdLines.push(`- ${row.id}: issues=${row.issues.join(', ') || 'none'}`);
    }
  }

  if (table.richerRenderableRowsOutsideRendered.length) {
    mdLines.push('', 'Renderable rows that should appear instead under the same ranking contract:', '');
    for (const row of table.richerRenderableRowsOutsideRendered) {
      mdLines.push(`- ${row.id}: score=${row.richnessScore}, freshness=${row.freshnessStamp || 'none'}`);
    }
  }

  if (table.idealRenderableSelection.length) {
    mdLines.push('', 'Ideal renderable selection under the current contract:', '');
    for (const row of table.idealRenderableSelection) {
      mdLines.push(`- ${row.id}: score=${row.richnessScore}, freshness=${row.freshnessStamp || 'none'}`);
    }
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
