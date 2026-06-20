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
const sourceAcquisitionRunsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');
const generatedDate = new Date().toISOString().slice(0, 10);
const ledgerPath = path.join(docsDir, `master-source-target-ledger-${generatedDate}.json`);
const jsonOutPath = path.join(docsDir, `db-discovered-source-targets-${generatedDate}.json`);
const csvOutPath = path.join(docsDir, `db-discovered-source-targets-${generatedDate}.csv`);
const mdOutPath = path.join(docsDir, `db-discovered-source-targets-${generatedDate}.md`);

const db = new Database(dbPath, { readonly: true });

function normalizeUrl(rawUrl) {
  if (!rawUrl || !String(rawUrl).trim()) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) parsed.port = '';
    return parsed.toString();
  } catch {
    return String(rawUrl || '').trim();
  }
}

function getDomain(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function duplicateGroup(rawUrl) {
  const url = normalizeUrl(rawUrl);
  return `${getDomain(url)}|${url.replace(/^https?:\/\//, '')}`;
}

function classifyCrawlMethod(url, tableName) {
  const value = String(url || '').toLowerCase();
  if (value.endsWith('.pdf') || tableName === 'forms') return 'pdf_extract';
  if (value.includes('search') || value.includes('locator') || value.includes('map') || value.includes('directory')) return 'playwright';
  return 'static_fetch';
}

function inferGapFamily(tableName, category = '') {
  if (tableName === 'county_offices') return 'medicaid_hhs_offices';
  if (tableName === 'state_resource_agencies') return 'dd_routing';
  if (tableName === 'resource_providers') return 'providers_care';
  if (tableName === 'nonprofit_organizations') return 'nonprofit_support';
  if (tableName === 'iep_advocates') return 'advocates_legal';
  if (tableName === 'forms') return 'forms_guides';
  if (tableName === 'waitlists') return 'waivers';
  if (tableName === 'sources') return 'source_registry';
  if (tableName === 'programs') {
    if (String(category).toLowerCase().includes('waiver')) return 'waivers';
    return 'programs_benefits';
  }
  return 'general_gap_fill';
}

function sourceFamily(url, tableName) {
  const domain = getDomain(url);
  if (domain === 'doi.org') return 'reference_dataset';
  if (domain.includes('yellowpagesforkids.com')) return 'advocate_directory';
  if (domain.endsWith('.gov') || domain.includes('.gov/')) return 'official_government';
  if (tableName === 'resource_providers') return 'provider_first_party_or_directory';
  if (tableName === 'nonprofit_organizations') return 'nonprofit';
  if (tableName === 'iep_advocates') return 'advocate_or_legal';
  return 'general';
}

function looksGeneratedFakeOfficial(row) {
  const domain = getDomain(row.sourceUrl);
  const stateId = String(row.stateId || '').toLowerCase();
  if (!stateId || stateId === 'unknown' || stateId === 'multi-state') return false;
  return domain === `dhhs.${stateId}.gov`;
}

function isSyntheticProviderRoster(row) {
  if (String(row.targetTable || '').toLowerCase() !== 'resource_providers') return false;
  const sourceUrl = normalizeUrl(row.sourceUrl);
  const sourceName = String(row.sourceName || '').toLowerCase();
  if (!sourceUrl) return false;

  let pathname = '';
  try {
    pathname = new URL(sourceUrl).pathname.toLowerCase();
  } catch {
    pathname = sourceUrl.toLowerCase();
  }

  return /\/specialized-roster-\d+\/?$/.test(pathname)
    || sourceName.includes('specialized clinic roster');
}

function classifyLedgerStatus(row) {
  const family = sourceFamily(row.sourceUrl, row.targetTable);
  const domain = getDomain(row.sourceUrl);
  if (looksGeneratedFakeOfficial(row)) return 'do_not_use';
  if (isSyntheticProviderRoster(row)) return 'source_repair';
  if (family === 'reference_dataset') return 'manual_review';
  if (domain.includes('yellowpagesforkids.com') || domain.includes('copaa.org')) return 'discovery_only';
  if (row.crawlMethod === 'playwright') return 'ready_js_heavy';
  if (row.crawlMethod === 'pdf_extract') return 'ready_pdf';
  return 'ready_lightweight';
}

function addRows(rows, query, tableName, options = {}) {
  for (const row of db.prepare(query).all()) {
    const urls = String(row.source_url || '')
      .split(',')
      .map((url) => normalizeUrl(url))
      .filter(Boolean);
    for (const sourceUrl of urls) {
      rows.push({
        origin: 'db_existing_sources',
        stateId: row.state_id || 'unknown',
        sourceName: row.source_name || row.name || row.title || tableName,
        sourceUrl,
        domain: getDomain(sourceUrl),
        targetTable: options.targetTable || tableName,
        category: row.category || '',
        recordCount: row.record_count || 1,
        verificationStatus: row.verification_status || '',
        crawlMethod: classifyCrawlMethod(sourceUrl, options.targetTable || tableName),
        gapFamily: inferGapFamily(options.targetTable || tableName, row.category || ''),
        sourceFamily: sourceFamily(sourceUrl, options.targetTable || tableName),
        whyNeeded: options.whyNeeded || `Existing DB source URL for ${options.targetTable || tableName}; scrape to extract deeper fields and validate freshness.`,
      });
    }
  }
}

function toCsv(rows) {
  const headers = ['stateId', 'targetTable', 'gapFamily', 'sourceName', 'sourceUrl', 'domain', 'crawlMethod', 'sourceFamily', 'recordCount', 'verificationStatus', 'alreadyInMasterLedger', 'whyNeeded'];
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

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function collectRepeatedSourceRepairSuppressions() {
  const counts = new Map();
  if (!fs.existsSync(sourceAcquisitionRunsDir)) return counts;

  for (const runId of fs.readdirSync(sourceAcquisitionRunsDir).sort()) {
    const filePath = path.join(sourceAcquisitionRunsDir, runId, 'followups', 'source-repair.json');
    if (!fs.existsSync(filePath)) continue;

    let rows = [];
    try {
      rows = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      rows = [];
    }

    for (const row of rows) {
      const reason = String(row.followupReason || '').trim();
      const sourceUrl = normalizeUrl(row.sourceUrl || '');
      if (!sourceUrl || reason !== 'stale_or_invalid_404') continue;

      const current = counts.get(sourceUrl) || {
        sourceUrl,
        followupReason: reason,
        repeatCount: 0,
        runIds: [],
      };
      current.repeatCount += 1;
      current.runIds.push(runId);
      counts.set(sourceUrl, current);
    }
  }

  return counts;
}

const masterLedger = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, 'utf8')) : { ledger: [] };
const existingGroups = new Set((masterLedger.ledger || []).map((row) => row.duplicateGroup || duplicateGroup(row.sourceUrl)));
const repeatedSourceRepairCounts = collectRepeatedSourceRepairSuppressions();
const discovered = [];

addRows(discovered, `
  SELECT state_id, name, category, verification_status, COALESCE(source_url, official_source_url) AS source_url, COUNT(*) AS record_count
  FROM programs
  WHERE COALESCE(source_url, official_source_url) IS NOT NULL AND TRIM(COALESCE(source_url, official_source_url)) <> ''
  GROUP BY state_id, COALESCE(source_url, official_source_url)
`, 'programs');

addRows(discovered, `
  SELECT c.state_id, co.office_name AS name, co.verification_status, co.source_url, COUNT(*) AS record_count
  FROM county_offices co
  JOIN counties c ON c.id = co.county_id
  WHERE co.source_url IS NOT NULL AND TRIM(co.source_url) <> ''
  GROUP BY c.state_id, co.source_url
`, 'county_offices');

addRows(discovered, `
  SELECT state_id, name, verification_status, COALESCE(source_url, source_urls) AS source_url, COUNT(*) AS record_count
  FROM state_resource_agencies
  WHERE COALESCE(source_url, source_urls) IS NOT NULL AND TRIM(COALESCE(source_url, source_urls)) <> ''
  GROUP BY state_id, COALESCE(source_url, source_urls)
`, 'state_resource_agencies');

addRows(discovered, `
  SELECT c.state_id, rp.name, rp.verification_status, rp.source_url, COUNT(*) AS record_count
  FROM resource_providers rp
  JOIN counties c ON c.id = rp.county_id
  WHERE rp.source_url IS NOT NULL AND TRIM(rp.source_url) <> ''
  GROUP BY c.state_id, rp.source_url
`, 'resource_providers');

addRows(discovered, `
  SELECT c.state_id, n.name, n.verification_status, n.source_url, COUNT(*) AS record_count
  FROM nonprofit_organizations n
  JOIN counties c ON c.id = n.county_id
  WHERE n.source_url IS NOT NULL AND TRIM(n.source_url) <> ''
  GROUP BY c.state_id, n.source_url
`, 'nonprofit_organizations');

addRows(discovered, `
  SELECT 'multi-state' AS state_id, name, verification_status, source_url, COUNT(*) AS record_count
  FROM iep_advocates
  WHERE source_url IS NOT NULL AND TRIM(source_url) <> ''
  GROUP BY source_url
`, 'iep_advocates');

addRows(discovered, `
  SELECT state_id, title AS name, verification_status, COALESCE(pdf_url, source_url) AS source_url, COUNT(*) AS record_count
  FROM forms_and_guides
  WHERE COALESCE(pdf_url, source_url) IS NOT NULL AND TRIM(COALESCE(pdf_url, source_url)) <> ''
  GROUP BY state_id, COALESCE(pdf_url, source_url)
`, 'forms', { targetTable: 'forms' });

addRows(discovered, `
  SELECT p.state_id, w.name, 'source_listed' AS verification_status, w.estimate_source_url AS source_url, COUNT(*) AS record_count
  FROM program_waitlists w
  JOIN programs p ON p.id = w.program_id
  WHERE w.estimate_source_url IS NOT NULL AND TRIM(w.estimate_source_url) <> ''
  GROUP BY p.state_id, w.estimate_source_url
`, 'waitlists', { targetTable: 'program_waitlists' });

addRows(discovered, `
  SELECT p.state_id, s.id AS name, s.verification_status, COALESCE(s.source_url, s.url) AS source_url, COUNT(*) AS record_count
  FROM sources s
  JOIN programs p ON p.id = s.program_id
  WHERE COALESCE(s.source_url, s.url) IS NOT NULL AND TRIM(COALESCE(s.source_url, s.url)) <> ''
  GROUP BY p.state_id, COALESCE(s.source_url, s.url)
`, 'sources');

const unique = [...new Map(discovered.map((row) => [`${row.stateId}|${row.targetTable}|${normalizeUrl(row.sourceUrl)}`, row])).values()]
  .map((row) => ({
    ...row,
    sourceUrl: normalizeUrl(row.sourceUrl),
    duplicateGroup: duplicateGroup(row.sourceUrl),
  }))
  .map((row) => ({
    ...row,
    alreadyInMasterLedger: existingGroups.has(row.duplicateGroup),
    ledgerStatus: classifyLedgerStatus(row),
  }))
  .sort((a, b) => Number(b.recordCount || 0) - Number(a.recordCount || 0) || a.sourceUrl.localeCompare(b.sourceUrl));

const newOnly = unique.filter((row) => !row.alreadyInMasterLedger);
const suppressedRepeatedSourceRepairTargets = newOnly
  .filter((row) => (repeatedSourceRepairCounts.get(row.sourceUrl)?.repeatCount || 0) >= 2)
  .map((row) => ({
    ...row,
    suppressionReason: 'repeated_stale_or_invalid_404',
    followupReason: repeatedSourceRepairCounts.get(row.sourceUrl).followupReason,
    repeatCount: repeatedSourceRepairCounts.get(row.sourceUrl).repeatCount,
    runIds: repeatedSourceRepairCounts.get(row.sourceUrl).runIds,
  }));
const suppressedSourceUrls = new Set(suppressedRepeatedSourceRepairTargets.map((row) => row.sourceUrl));
const actionableNewOnly = newOnly
  .filter((row) => ['ready_lightweight', 'ready_js_heavy', 'ready_pdf'].includes(row.ledgerStatus))
  .filter((row) => !suppressedSourceUrls.has(row.sourceUrl));
const payload = {
  generatedAt: generatedDate,
  summary: {
    totalDbDiscoveredTargets: unique.length,
    notYetInMasterLedger: newOnly.length,
    actionableNotYetInMasterLedger: actionableNewOnly.length,
    suppressedRepeatedSourceRepairTargets: suppressedRepeatedSourceRepairTargets.length,
    alreadyInMasterLedger: unique.length - newOnly.length,
    byGapFamily: countBy(unique, 'gapFamily'),
    newByGapFamily: countBy(newOnly, 'gapFamily'),
    actionableNewByGapFamily: countBy(actionableNewOnly, 'gapFamily'),
    suppressedRepeatedSourceRepairByGapFamily: countBy(suppressedRepeatedSourceRepairTargets, 'gapFamily'),
    newByState: countBy(newOnly, 'stateId'),
    newByStatus: countBy(newOnly, 'ledgerStatus'),
  },
  targets: unique,
  newTargets: newOnly,
  actionableNewTargets: actionableNewOnly,
  suppressedRepeatedSourceRepairTargets,
};

const mdLines = [
  '# DB Discovered Source Targets',
  '',
  `Generated: ${generatedDate}`,
  '',
  'These are exact source URLs already present in verified/staged DB rows. They are useful for deeper scraping, freshness checks, and filling fields that the original import did not extract.',
  '',
  '## Summary',
  '',
  `- total DB-discovered exact targets: ${payload.summary.totalDbDiscoveredTargets}`,
  `- not yet in master ledger: ${payload.summary.notYetInMasterLedger}`,
  `- actionable and not yet in master ledger: ${payload.summary.actionableNotYetInMasterLedger}`,
  `- suppressed repeated stale-404 targets: ${payload.summary.suppressedRepeatedSourceRepairTargets}`,
  `- already in master ledger: ${payload.summary.alreadyInMasterLedger}`,
  '',
  '## New Targets By Status',
  '',
];

for (const [status, count] of Object.entries(payload.summary.newByStatus).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${status}: ${count}`);
}

mdLines.push(
  '',
  '## New Targets By Gap Family',
  '',
);

for (const [gapFamily, count] of Object.entries(payload.summary.newByGapFamily).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${gapFamily}: ${count}`);
}

mdLines.push('', '## Actionable New Targets By Gap Family', '');
for (const [gapFamily, count] of Object.entries(payload.summary.actionableNewByGapFamily).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${gapFamily}: ${count}`);
}

mdLines.push('', '## Suppressed Repeated Stale-404 Targets By Gap Family', '');
for (const [gapFamily, count] of Object.entries(payload.summary.suppressedRepeatedSourceRepairByGapFamily).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${gapFamily}: ${count}`);
}

mdLines.push('', '## New Targets By State', '');
for (const [stateId, count] of Object.entries(payload.summary.newByState).sort((a, b) => b[1] - a[1]).slice(0, 25)) {
  mdLines.push(`- ${stateId}: ${count}`);
}

mdLines.push('', '## Highest-Volume Actionable New Targets', '');
for (const row of actionableNewOnly.slice(0, 50)) {
  mdLines.push(`- ${row.stateId}: ${row.sourceUrl} (${row.targetTable}; records=${row.recordCount}; ${row.ledgerStatus})`);
}

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(csvOutPath, `${toCsv(unique)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  summary: payload.summary,
  report: mdOutPath,
  json: jsonOutPath,
  csv: csvOutPath,
}, null, 2));
