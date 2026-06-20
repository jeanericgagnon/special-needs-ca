import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const frontendDbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const rootDbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const dbPath = fs.existsSync(frontendDbPath) ? frontendDbPath : rootDbPath;
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `advocate-truth-cleanup-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `advocate-truth-cleanup-audit-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

const PUBLIC_ELIGIBLE_STATUSES = new Set(['official_verified', 'verified', 'human_verified', 'source_listed']);
const SYNTHETIC_SOURCE_HOST_PATTERNS = [
  /^www\.advocate\./,
  /^www\.therapy\./,
  /^www\.legal\./,
  /^www\.pediatrictherapy\./,
  /^[a-z]{2}-pa\.org$/,
];

function hasNonEmpty(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

function hasPublicContactSignal(row) {
  const phone = row.phone || '';
  const email = row.email || '';
  const website = row.website || '';
  return Boolean(
    (phone && !phone.includes('(555)')) ||
    (email && !email.endsWith('@example.com')) ||
    website
  );
}

function hasPublicSourceUrl(row) {
  if (!row.source_url) return false;
  try {
    const url = new URL(row.source_url);
    return !SYNTHETIC_SOURCE_HOST_PATTERNS.some((pattern) => pattern.test(url.hostname));
  } catch {
    return false;
  }
}

function isLikelySyntheticPublicAdvocate(row) {
  if (!row.id?.startsWith('gen-')) return false;
  if (!['verified', 'official_verified', 'human_verified', 'source_listed'].includes(row.verification_status || '')) return false;
  if (row.last_verified_date) return false;
  if ((row.phone && !row.phone.includes('(555)')) || row.email) return false;
  if ((row.website || '').trim() !== 'https://www.cde.ca.gov/sp/se/') return false;

  try {
    const url = new URL(row.source_url || '');
    return url.hostname.toLowerCase().endsWith('advocacy.com');
  } catch {
    return false;
  }
}

function isFlaggedSyntheticAdvocateBacklog(row) {
  const unsupportedFlags = String(row.unsupported_claim_flags || '');
  if (unsupportedFlags.includes('likely_synthetic_advocate_profile')) return true;
  if (row.manual_review_required !== 1) return false;
  if (!row.id?.startsWith('gen-')) return false;

  try {
    const sourceUrl = new URL(row.source_url || '');
    return sourceUrl.hostname.toLowerCase().endsWith('advocacy.com');
  } catch {
    return false;
  }
}

function isPublicSafeAdvocate(row) {
  return (
    PUBLIC_ELIGIBLE_STATUSES.has(row.verification_status || '') &&
    !isLikelySyntheticPublicAdvocate(row) &&
    hasPublicSourceUrl(row) &&
    hasPublicContactSignal(row)
  );
}

const advocateRows = db.prepare(`
  SELECT
    ia.id,
    ia.name,
    ia.phone,
    ia.email,
    ia.website,
    ia.source_url,
    ia.source_type,
    ia.data_origin,
    ia.verification_status,
    ia.last_verified_date,
    ia.manual_review_required,
    ia.unsupported_claim_flags,
    ia.counties_served,
    c.id AS county_id,
    c.name AS county_name,
    s.id AS state_id,
    s.name AS state_name
  FROM iep_advocates ia
  JOIN iep_advocate_counties iac ON iac.iep_advocate_id = ia.id
  JOIN counties c ON c.id = iac.county_id
  JOIN states s ON s.id = c.state_id
  ORDER BY s.name, c.name, ia.name
`).all();

const countyMap = new Map();
const stateMap = new Map();
const quarantinedRows = [];

for (const row of advocateRows) {
  const countyKey = row.county_id;
  if (!countyMap.has(countyKey)) {
    countyMap.set(countyKey, {
      countyId: row.county_id,
      countyName: row.county_name,
      stateId: row.state_id,
      stateName: row.state_name,
      totalAdvocates: 0,
      publicSafeAdvocates: 0,
      quarantinedAdvocates: 0,
      syntheticPatternAdvocates: 0,
      manualReviewAdvocates: 0,
      exampleQuarantinedAdvocates: [],
    });
  }

  if (!stateMap.has(row.state_id)) {
    stateMap.set(row.state_id, {
      stateId: row.state_id,
      stateName: row.state_name,
      countiesWithAnyAdvocates: new Set(),
      countiesWithPublicSafeAdvocates: new Set(),
      countiesLosingAllAdvocateCoverage: new Set(),
      totalAdvocates: 0,
      publicSafeAdvocates: 0,
      quarantinedAdvocates: 0,
      syntheticPatternAdvocates: 0,
    });
  }

  const countyEntry = countyMap.get(countyKey);
  const stateEntry = stateMap.get(row.state_id);
  const syntheticPattern =
    String(row.unsupported_claim_flags || '').includes('likely_synthetic_advocate_profile') ||
    isFlaggedSyntheticAdvocateBacklog(row);
  const publicSafe = isPublicSafeAdvocate(row);
  const quarantined = syntheticPattern || row.manual_review_required === 1 || hasNonEmpty(row.unsupported_claim_flags);

  countyEntry.totalAdvocates += 1;
  stateEntry.totalAdvocates += 1;
  stateEntry.countiesWithAnyAdvocates.add(row.county_id);

  if (publicSafe) {
    countyEntry.publicSafeAdvocates += 1;
    stateEntry.publicSafeAdvocates += 1;
    stateEntry.countiesWithPublicSafeAdvocates.add(row.county_id);
  }

  if (quarantined) {
    countyEntry.quarantinedAdvocates += 1;
    stateEntry.quarantinedAdvocates += 1;
    if (countyEntry.exampleQuarantinedAdvocates.length < 3) {
      countyEntry.exampleQuarantinedAdvocates.push({
        id: row.id,
        name: row.name,
        verificationStatus: row.verification_status,
        unsupportedClaimFlags: row.unsupported_claim_flags || null,
      });
    }
  }

  if (syntheticPattern) {
    countyEntry.syntheticPatternAdvocates += 1;
    stateEntry.syntheticPatternAdvocates += 1;
    quarantinedRows.push({
      id: row.id,
      name: row.name,
      countyId: row.county_id,
      countyName: row.county_name,
      stateId: row.state_id,
      stateName: row.state_name,
      sourceUrl: row.source_url,
      website: row.website,
      verificationStatus: row.verification_status,
      unsupportedClaimFlags: row.unsupported_claim_flags || null,
    });
  }

  if (row.manual_review_required === 1) {
    countyEntry.manualReviewAdvocates += 1;
  }
}

const counties = [...countyMap.values()]
  .map((entry) => ({
    ...entry,
    losesAllAdvocateCoverageAfterTruthGating: entry.totalAdvocates > 0 && entry.publicSafeAdvocates === 0,
  }))
  .sort((a, b) =>
    Number(b.losesAllAdvocateCoverageAfterTruthGating) - Number(a.losesAllAdvocateCoverageAfterTruthGating) ||
    b.quarantinedAdvocates - a.quarantinedAdvocates ||
    a.stateName.localeCompare(b.stateName) ||
    a.countyName.localeCompare(b.countyName)
  );

for (const county of counties) {
  if (!county.losesAllAdvocateCoverageAfterTruthGating) continue;
  stateMap.get(county.stateId).countiesLosingAllAdvocateCoverage.add(county.countyId);
}

const states = [...stateMap.values()]
  .map((entry) => ({
    stateId: entry.stateId,
    stateName: entry.stateName,
    totalAdvocates: entry.totalAdvocates,
    publicSafeAdvocates: entry.publicSafeAdvocates,
    quarantinedAdvocates: entry.quarantinedAdvocates,
    syntheticPatternAdvocates: entry.syntheticPatternAdvocates,
    countiesWithAnyAdvocates: entry.countiesWithAnyAdvocates.size,
    countiesWithPublicSafeAdvocates: entry.countiesWithPublicSafeAdvocates.size,
    countiesLosingAllAdvocateCoverage: entry.countiesLosingAllAdvocateCoverage.size,
  }))
  .sort((a, b) =>
    b.countiesLosingAllAdvocateCoverage - a.countiesLosingAllAdvocateCoverage ||
    b.quarantinedAdvocates - a.quarantinedAdvocates ||
    a.stateName.localeCompare(b.stateName)
  );

const payload = {
  generatedAt: generatedDate,
  dbPath,
  summary: {
    totalAdvocateCountyPairs: advocateRows.length,
    totalSyntheticPatternRows: quarantinedRows.length,
    countiesWithAnyAdvocates: counties.length,
    countiesLosingAllAdvocateCoverageAfterTruthGating: counties.filter((county) => county.losesAllAdvocateCoverageAfterTruthGating).length,
    statesWithAnyAdvocates: states.length,
    statesWithCoverageLoss: states.filter((state) => state.countiesLosingAllAdvocateCoverage > 0).length,
  },
  states,
  counties,
  syntheticPatternSamples: quarantinedRows.slice(0, 50),
};

const mdLines = [
  '# Advocate Truth Cleanup Audit',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  '## Summary',
  '',
  `- Total advocate county pairs audited: ${payload.summary.totalAdvocateCountyPairs}`,
  `- Synthetic-pattern advocate rows quarantined: ${payload.summary.totalSyntheticPatternRows}`,
  `- Counties with any advocate rows: ${payload.summary.countiesWithAnyAdvocates}`,
  `- Counties losing all advocate coverage after truth gating: ${payload.summary.countiesLosingAllAdvocateCoverageAfterTruthGating}`,
  `- States with any advocate rows: ${payload.summary.statesWithAnyAdvocates}`,
  `- States with at least one county losing all advocate coverage: ${payload.summary.statesWithCoverageLoss}`,
  '',
  '## State Summary',
  '',
  '| State | Total Advocates | Public-Safe | Quarantined | Synthetic Pattern | Counties With Any | Counties Still Covered | Counties Losing All Coverage |',
  '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
];

for (const state of states) {
  mdLines.push(`| ${state.stateName} | ${state.totalAdvocates} | ${state.publicSafeAdvocates} | ${state.quarantinedAdvocates} | ${state.syntheticPatternAdvocates} | ${state.countiesWithAnyAdvocates} | ${state.countiesWithPublicSafeAdvocates} | ${state.countiesLosingAllAdvocateCoverage} |`);
}

mdLines.push('', '## Counties Losing All Advocate Coverage After Truth Gating', '');

const losingCounties = counties.filter((county) => county.losesAllAdvocateCoverageAfterTruthGating);
if (losingCounties.length === 0) {
  mdLines.push('- None');
} else {
  for (const county of losingCounties.slice(0, 200)) {
    mdLines.push(`- ${county.stateName} / ${county.countyName}: ${county.totalAdvocates} total rows, ${county.quarantinedAdvocates} quarantined, ${county.syntheticPatternAdvocates} synthetic-pattern`);
  }
}

mdLines.push('', '## Example Quarantined Counties', '');
for (const county of losingCounties.slice(0, 20)) {
  mdLines.push(`### ${county.stateName} / ${county.countyName}`, '');
  for (const example of county.exampleQuarantinedAdvocates) {
    mdLines.push(`- ${example.name} (${example.id}) - status: ${example.verificationStatus}, flags: ${example.unsupportedClaimFlags || 'none'}`);
  }
  mdLines.push('');
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${jsonOutPath}`);
console.log(`Wrote ${mdOutPath}`);
