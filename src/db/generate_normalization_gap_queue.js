import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `normalization-gap-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `normalization-gap-queue-${generatedDate}.md`);
const csvOutPath = path.join(docsDir, `normalization-gap-queue-${generatedDate}.csv`);

const db = new Database(dbPath, { readonly: true });

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function toCsv(rows, headers) {
  const escape = (value) => {
    const stringValue = String(value ?? '');
    if (/[",\n]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
    return stringValue;
  };

  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ].join('\n');
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated artifact for prefix: ${prefix}`);
  }
  return path.join(docsDir, matches.at(-1));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const blockerRegistryPath = latestGeneratedJson('track-a-blocker-registry-');
const blockerRegistry = readJson(blockerRegistryPath);
const normalizationBlocker = (blockerRegistry.blockers || []).find((blocker) => blocker.id === 'normalization_depth') || null;

const orgTypeRows = db.prepare(`
  SELECT
    o.organization_type AS organizationType,
    COUNT(*) AS organizations,
    SUM(CASE WHEN opl.id IS NOT NULL THEN 1 ELSE 0 END) AS programLinks,
    SUM(CASE WHEN sl.id IS NOT NULL THEN 1 ELSE 0 END) AS serviceLocations,
    SUM(CASE WHEN ol.id IS NOT NULL THEN 1 ELSE 0 END) AS officeLocations,
    SUM(CASE WHEN vsa.id IS NOT NULL THEN 1 ELSE 0 END) AS virtualServiceAreas
  FROM organizations o
  LEFT JOIN organization_program_links opl ON opl.organization_id = o.id
  LEFT JOIN service_locations sl ON sl.organization_id = o.id
  LEFT JOIN office_locations ol ON ol.organization_id = o.id
  LEFT JOIN virtual_service_areas vsa ON vsa.organization_id = o.id
  GROUP BY o.organization_type
  ORDER BY organizations DESC, o.organization_type ASC
`).all();

const providerStateRows = db.prepare(`
  SELECT
    c.state_id AS stateId,
    COUNT(*) AS providerRows,
    SUM(CASE WHEN sl.id IS NOT NULL THEN 1 ELSE 0 END) AS serviceLocationRows
  FROM resource_providers rp
  JOIN counties c ON c.id = rp.county_id
  LEFT JOIN organizations o ON o.source_url = rp.source_url
  LEFT JOIN service_locations sl ON sl.organization_id = o.id
  GROUP BY c.state_id
  HAVING COUNT(*) > 0
  ORDER BY (COUNT(*) - SUM(CASE WHEN sl.id IS NOT NULL THEN 1 ELSE 0 END)) DESC, COUNT(*) DESC, c.state_id ASC
`).all();

const rows = [];

for (const row of providerStateRows) {
  const missing = Number(row.providerRows || 0) - Number(row.serviceLocationRows || 0);
  if (missing <= 0) continue;
  rows.push({
    lane: 'provider_service_location_gap',
    subjectType: 'state_cluster',
    subjectId: row.stateId,
    organizationType: 'provider_org',
    currentRows: Number(row.providerRows || 0),
    normalizedRows: Number(row.serviceLocationRows || 0),
    missingRows: missing,
    nextAction: 'Backfill service locations only from trusted provider rows with explicit physical-site evidence; do not infer locations from broad coverage text.',
    evidenceNote: 'resource_providers rows exceed normalized service_locations in this state.',
    entryCommand: 'npm run fix:normalize-provider-locations',
    auditCommand: 'npm run audit:normalization-gap-queue',
    commands: [
      'npm run fix:normalize-provider-locations',
      'npm run audit:normalization-gap-queue',
    ],
  });
}

for (const row of orgTypeRows) {
  if (row.organizationType === 'provider_org') continue;
  const normalizedRows = Number(row.serviceLocations || 0) + Number(row.officeLocations || 0) + Number(row.virtualServiceAreas || 0);
  const missingRows = Number(row.organizations || 0) - normalizedRows > 0 ? Number(row.organizations || 0) - normalizedRows : 0;
  if (missingRows <= 0) continue;
  rows.push({
    lane: 'org_type_semantics_review',
    subjectType: 'organization_type',
    subjectId: row.organizationType,
    organizationType: row.organizationType,
    currentRows: Number(row.organizations || 0),
    normalizedRows,
    missingRows,
    nextAction: row.organizationType === 'public_agency'
      ? 'Preserve office-location normalization and only add service locations when the source proves a service site rather than an intake office.'
      : 'Preserve virtual-area semantics unless a trusted source proves a true local physical site; do not inflate nonprofits or advocates into location-rich rows without evidence.',
    evidenceNote: 'Non-provider normalization is mostly virtual-area or office-based today and should remain semantics-safe.',
    entryCommand: row.organizationType === 'public_agency'
      ? 'npm run fix:normalize-public-offices'
      : row.organizationType === 'nonprofit'
        ? 'npm run fix:normalize-nonprofit-areas'
        : row.organizationType === 'advocacy_org'
          ? 'npm run fix:normalize-advocate-areas'
          : '',
    auditCommand: 'npm run audit:normalization-gap-queue',
    commands: [
      row.organizationType === 'public_agency'
        ? 'npm run fix:normalize-public-offices'
        : row.organizationType === 'nonprofit'
          ? 'npm run fix:normalize-nonprofit-areas'
          : row.organizationType === 'advocacy_org'
            ? 'npm run fix:normalize-advocate-areas'
            : '',
      'npm run audit:normalization-gap-queue',
    ].filter(Boolean),
  });
}

rows.sort((a, b) =>
  a.lane.localeCompare(b.lane)
  || Number(b.missingRows || 0) - Number(a.missingRows || 0)
  || String(a.subjectId).localeCompare(String(b.subjectId))
);

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  dbPath,
  sourceArtifacts: {
    blockerRegistryPath: path.relative(repoRoot, blockerRegistryPath),
  },
  purpose: 'Deterministic normalization gap queue showing where provider service locations are still thin and where non-provider organization types should remain semantics-safe until better evidence exists.',
  summary: {
    totalRows: rows.length,
    byLane: countBy(rows, 'lane'),
    byOrganizationType: countBy(rows, 'organizationType'),
    blockerStatus: normalizationBlocker?.status || 'unknown',
  },
  rows,
};

const headers = [
  'lane',
  'subjectType',
  'subjectId',
  'organizationType',
  'currentRows',
  'normalizedRows',
  'missingRows',
  'nextAction',
  'evidenceNote',
  'entryCommand',
  'auditCommand',
];

const mdLines = [
  '# Normalization Gap Queue',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Summary',
  '',
  `- total rows: ${payload.summary.totalRows}`,
  `- blocker status: ${payload.summary.blockerStatus}`,
  '',
  '## By Lane',
  '',
  ...Object.entries(payload.summary.byLane).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## Top Rows',
  '',
];

for (const row of rows.slice(0, 25)) {
  mdLines.push(`- ${row.lane} | ${row.subjectId} | missing=${row.missingRows} | current=${row.currentRows} | normalized=${row.normalizedRows}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);
fs.writeFileSync(csvOutPath, `${toCsv(rows, headers)}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  csv: csvOutPath,
  totalRows: payload.summary.totalRows,
  byLane: payload.summary.byLane,
}, null, 2));
