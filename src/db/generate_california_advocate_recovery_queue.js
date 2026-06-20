import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const stateDir = path.join(repoRoot, 'data', 'source-acquisition-state');
const generatedDate = new Date().toISOString().slice(0, 10);
const outJsonPath = path.join(docsDir, `california-advocate-recovery-queue-${generatedDate}.json`);
const outMdPath = path.join(docsDir, `california-advocate-recovery-queue-${generatedDate}.md`);
const ledgerPath = path.join(stateDir, 'california-advocate-recovery-ledger.json');

const db = new Database(dbPath, { readonly: true });

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const PRIORITY_COUNTIES = new Set([
  'los-angeles',
  'orange',
  'san-diego',
  'riverside',
  'sacramento',
  'san-francisco',
  'alameda',
  'fresno',
]);

const rows = db.prepare(`
  SELECT
    ia.id,
    ia.name,
    ia.credentials,
    ia.specialties,
    ia.phone,
    ia.email,
    ia.website,
    ia.source_url,
    ia.verification_status,
    ia.manual_review_required,
    ia.unsupported_claim_flags,
    ia.data_origin,
    c.id AS county_id,
    c.name AS county_name
  FROM iep_advocates ia
  JOIN iep_advocate_counties iac ON iac.iep_advocate_id = ia.id
  JOIN counties c ON c.id = iac.county_id
  WHERE c.state_id = 'california'
    AND ia.verification_status = 'manual_review_required'
  ORDER BY c.name ASC, ia.name ASC, ia.id ASC
`).all();

const ledger = readJsonIfExists(ledgerPath, { rows: [] });
const resolvedCountyIds = new Set((ledger.rows || []).map((row) => String(row.countyId || '').trim()).filter(Boolean));
const countyMap = new Map();
for (const row of rows) {
  if (resolvedCountyIds.has(String(row.county_id || '').trim())) continue;
  if (!countyMap.has(row.county_id)) {
    countyMap.set(row.county_id, {
      countyId: row.county_id,
      countyName: row.county_name,
      priorityTier: PRIORITY_COUNTIES.has(row.county_id) ? 'priority' : 'secondary',
      rows: [],
    });
  }
  countyMap.get(row.county_id).rows.push({
    id: row.id,
    name: row.name,
    credentials: row.credentials || null,
    specialties: row.specialties || null,
    phone: row.phone || null,
    email: row.email || null,
    website: row.website || null,
    sourceUrl: row.source_url || null,
    verificationStatus: row.verification_status,
    manualReviewRequired: row.manual_review_required,
    unsupportedClaimFlags: row.unsupported_claim_flags || null,
    dataOrigin: row.data_origin || null,
    likelySyntheticPattern: String(row.id || '').startsWith('gen-'),
  });
}

const counties = Array.from(countyMap.values())
  .map((county) => ({
    ...county,
    totalRows: county.rows.length,
    syntheticPatternRows: county.rows.filter((row) => row.likelySyntheticPattern).length,
  }))
  .sort((a, b) =>
    Number(a.priorityTier === 'secondary') - Number(b.priorityTier === 'secondary') ||
    a.countyName.localeCompare(b.countyName)
  );

const payload = {
  generatedAt: generatedDate,
  dbPath,
  sourceLedger: fs.existsSync(ledgerPath) ? ledgerPath : null,
  summary: {
    countiesBlocked: counties.length,
    resolvedCountiesExcluded: resolvedCountyIds.size,
    priorityCountiesBlocked: counties.filter((county) => county.priorityTier === 'priority').length,
    secondaryCountiesBlocked: counties.filter((county) => county.priorityTier === 'secondary').length,
    totalRows: rows.length,
    syntheticPatternRows: rows.filter((row) => String(row.id || '').startsWith('gen-')).length,
  },
  counties,
};

const mdLines = [
  '# California Advocate Recovery Queue',
  '',
  `Generated: ${generatedDate}`,
  '',
  `DB audited: ${dbPath}`,
  '',
  'This artifact converts the California advocate truth-collapse blocker into an execution queue. Every row here is currently hidden by truth gating and leaves its county with zero public-safe advocate coverage.',
  '',
  '## Summary',
  '',
  `- Counties blocked: ${payload.summary.countiesBlocked}`,
  `- Priority counties blocked: ${payload.summary.priorityCountiesBlocked}`,
  `- Secondary counties blocked: ${payload.summary.secondaryCountiesBlocked}`,
  `- Manual-review advocate rows in queue: ${payload.summary.totalRows}`,
  `- Synthetic-pattern rows in queue: ${payload.summary.syntheticPatternRows}`,
  '',
  '## County Queue',
  '',
  '| Tier | County | Rows | Synthetic Pattern Rows |',
  '| --- | --- | ---: | ---: |',
];

for (const county of counties) {
  mdLines.push(`| ${county.priorityTier} | ${county.countyName} | ${county.totalRows} | ${county.syntheticPatternRows} |`);
}

for (const county of counties) {
  mdLines.push('', `## ${county.countyName}`, '');
  mdLines.push(`- tier: ${county.priorityTier}`);
  mdLines.push(`- advocate rows blocked: ${county.totalRows}`);
  mdLines.push(`- synthetic-pattern rows: ${county.syntheticPatternRows}`);
  mdLines.push('- recommended action: replace synthetic county-local advocates with source-backed California advocate records or leave the county with no advocate module until real records are verified.');
  mdLines.push('', 'Example blocked rows:', '');
  for (const row of county.rows.slice(0, 5)) {
    mdLines.push(`- ${row.name} (${row.id}) | flags=${row.unsupportedClaimFlags || 'likely_synthetic_advocate_profile'} | source=${row.sourceUrl || row.website || 'none'}`);
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(outJsonPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(outMdPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${outJsonPath}`);
console.log(`Wrote ${outMdPath}`);
