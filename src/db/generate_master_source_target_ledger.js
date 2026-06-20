import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const sourcePacksDir = path.join(repoRoot, 'data', 'source_packs');
const quarantinePath = path.join(repoRoot, 'docs', 'national-rollout', 'source-target-quarantine-list.md');
const nonprofitRegistryDir = path.join(repoRoot, 'data', 'nonprofit-link-registry');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `master-source-target-ledger-${generatedDate}.json`);
const csvOutPath = path.join(docsDir, `master-source-target-ledger-${generatedDate}.csv`);
const mdOutPath = path.join(docsDir, `master-source-target-ledger-${generatedDate}.md`);

const STANDARD_STATE_TARGET_FILES = 50;

function latestJson(dir, fileName) {
  if (!fs.existsSync(dir)) return null;
  const subdirs = fs.readdirSync(dir).sort();
  const latest = subdirs.at(-1);
  if (!latest) return null;
  const filePath = path.join(dir, latest, fileName);
  return fs.existsSync(filePath) ? filePath : null;
}

function latestGeneratedJson(prefix) {
  if (!fs.existsSync(docsDir)) return null;
  const matches = fs.readdirSync(docsDir)
    .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
    .sort();
  return matches.length ? path.join(docsDir, matches.at(-1)) : null;
}

function readJson(filePath, fallback = null) {
  if (!filePath || !fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeUrl(rawUrl) {
  if (!rawUrl || !String(rawUrl).trim()) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) {
      parsed.port = '';
    }
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function getDomain(rawUrl, fallback = '') {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return String(fallback || '').replace(/^www\./, '').toLowerCase();
  }
}

function parseMarkdownTable(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const rows = [];
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    if (line.includes(':---') || line.includes('---')) continue;
    const parts = line.split('|').slice(1, -1).map((part) => part.trim());
    if (parts[0] === 'State' || parts.length < 6) continue;
    rows.push(parts);
  }
  return rows;
}

function parseQuarantine(filePath) {
  const rows = parseMarkdownTable(filePath);
  const byKey = new Map();
  for (const row of rows) {
    const [state, sourceName, targetTable, classification, reason, flaggedUrl] = row;
    const url = normalizeUrl(flaggedUrl);
    byKey.set(`${state.toLowerCase()}|${targetTable}|${url}`, {
      state: state.toLowerCase(),
      sourceName,
      targetTable,
      classification: classification.replace(/`/g, ''),
      reason,
      url,
    });
  }
  return byKey;
}

function classifySourceFamily(entry) {
  const domain = getDomain(entry.sourceUrl || entry.seedUrl || '', entry.domain);
  const orgType = String(entry.organizationType || entry.organization_type || '').toLowerCase();
  const category = String(entry.category || '').toLowerCase();
  const targetTable = String(entry.targetTable || entry.target_table || '').toLowerCase();
  const sourceName = String(entry.sourceName || entry.source_name || '').toLowerCase();

  if (domain.includes('parentcenterhub.org')) return 'parent_center_directory';
  if (domain.includes('copaa.org')) return 'copaa_directory';
  if (domain.includes('thearc.org')) return 'arc_network';
  if (orgType.includes('official') || targetTable === 'county_offices' || targetTable === 'state_resource_agencies' || targetTable === 'school_districts') return 'official_government';
  if (orgType === 'hospital') return 'hospital_clinic';
  if (orgType.includes('provider')) return 'provider_directory';
  if (orgType.includes('nonprofit')) return 'nonprofit';
  if (category.includes('hospital') || category.includes('provider')) return 'provider_directory';
  if (sourceName.includes('hospital') || sourceName.includes('clinic')) return 'hospital_clinic';
  return 'general';
}

function inferGapFamily(entry) {
  const targetTable = String(entry.targetTable || entry.target_table || '').toLowerCase();
  const category = String(entry.category || '').toLowerCase();
  const subcategory = String(entry.specificSubcategory || entry.specific_subcategory || '').toLowerCase();

  if (targetTable === 'counties') return 'geography_counties';
  if (targetTable === 'county_offices') return 'medicaid_hhs_offices';
  if (targetTable === 'state_resource_agencies') return 'dd_routing';
  if (targetTable === 'regional_education_agencies' || targetTable === 'school_districts') return 'education_routing';
  if (targetTable === 'programs') {
    if (category.includes('transition')) return 'transition_programs';
    if (category.includes('early intervention')) return 'early_intervention_programs';
    if (category.includes('waiver')) return 'waivers';
    return 'programs_benefits';
  }
  if (targetTable === 'forms') return 'forms_guides';
  if (targetTable === 'nonprofit_organizations') {
    if (category.includes('parent training') || subcategory.includes('pti')) return 'parent_training_nonprofits';
    if (category.includes('condition-specific') || subcategory.includes('arc')) return 'condition_nonprofits';
    return 'nonprofit_support';
  }
  if (targetTable === 'iep_advocates') return 'advocates_legal';
  if (targetTable === 'resource_providers') return 'providers_care';
  if (targetTable === 'sources') return 'source_registry';
  return 'general_gap_fill';
}

function inferWhyNeeded(gapFamily) {
  const map = {
    geography_counties: 'Needed to complete county coverage and county-root surfaces.',
    medicaid_hhs_offices: 'Needed for truthful county office routing and local benefits navigation.',
    dd_routing: 'Needed for DD/IDD routing and county-diagnosis navigation.',
    education_routing: 'Needed for special-education and district/regional routing.',
    waivers: 'Needed for waiver program and waitlist depth.',
    early_intervention_programs: 'Needed for birth-to-three and Part C information.',
    transition_programs: 'Needed for adult-transition and vocational service coverage.',
    programs_benefits: 'Needed for state program and benefits completeness.',
    forms_guides: 'Needed for applications, forms, downloads, and family-facing instructions.',
    parent_training_nonprofits: 'Needed to discover real state or local family support organizations.',
    condition_nonprofits: 'Needed to expand trustworthy condition-specific nonprofit support.',
    nonprofit_support: 'Needed to deepen local nonprofit help coverage.',
    advocates_legal: 'Needed to improve IEP, appeals, and legal-support coverage.',
    providers_care: 'Needed to fill the largest visible care/provider information gap.',
    source_registry: 'Needed to strengthen trust and source-verification infrastructure.',
    general_gap_fill: 'Needed to close a current repo information gap.',
  };
  return map[gapFamily] || map.general_gap_fill;
}

function inferFirstPartyMode(entry) {
  const family = classifySourceFamily(entry);
  if (family === 'official_government' || family === 'hospital_clinic' || family === 'nonprofit') return 'first_party';
  if (family === 'parent_center_directory' || family === 'copaa_directory' || family === 'provider_directory') return 'third_party_directory';
  if (family === 'arc_network') return String(entry.targetType || '').includes('affiliate') ? 'network_first_party_path' : 'network_directory';
  return 'unknown';
}

function isSyntheticProviderRoster(entry) {
  if (String(entry.targetTable || entry.target_table || '').toLowerCase() !== 'resource_providers') return false;
  const sourceUrl = normalizeUrl(entry.sourceUrl || entry.seedUrl || '');
  const sourceName = String(entry.sourceName || entry.source_name || '').toLowerCase();
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

function classifyLedgerStatus(entry, quarantineMap) {
  const stateKey = String(entry.stateName || entry.state || '').toLowerCase();
  const tableKey = String(entry.targetTable || entry.target_table || '').toLowerCase();
  const url = normalizeUrl(entry.sourceUrl || entry.seedUrl || '');
  const quarantine = quarantineMap.get(`${stateKey}|${tableKey}|${url}`);
  const crawlMethod = String(entry.crawlMethod || entry.crawl_method || '').toLowerCase();
  const sourceFamily = classifySourceFamily(entry);
  const targetType = String(entry.targetType || '').toLowerCase();

  if (quarantine) {
    if (quarantine.classification === 'manual_review_required') {
      return { status: 'manual_review', shouldScrape: false, safeForLightweightScrape: false, quarantine };
    }
    return { status: 'do_not_use', shouldScrape: false, safeForLightweightScrape: false, quarantine };
  }

  if (sourceFamily === 'parent_center_directory' || sourceFamily === 'copaa_directory') {
    return { status: 'discovery_only', shouldScrape: false, safeForLightweightScrape: false, quarantine: null };
  }

  if (sourceFamily === 'arc_network' && targetType === 'network_directory') {
    return { status: 'discovery_only', shouldScrape: false, safeForLightweightScrape: false, quarantine: null };
  }

  if (isSyntheticProviderRoster(entry)) {
    return { status: 'source_repair', shouldScrape: false, safeForLightweightScrape: false, quarantine: null };
  }

  if (crawlMethod === 'manual_review') {
    return { status: 'manual_review', shouldScrape: false, safeForLightweightScrape: false, quarantine: null };
  }

  if (crawlMethod === 'playwright') {
    return { status: 'ready_js_heavy', shouldScrape: true, safeForLightweightScrape: false, quarantine: null };
  }

  if (crawlMethod === 'pdf_extract') {
    return { status: 'ready_pdf', shouldScrape: true, safeForLightweightScrape: true, quarantine: null };
  }

  if (crawlMethod === 'static_fetch' || !crawlMethod) {
    return { status: 'ready_lightweight', shouldScrape: true, safeForLightweightScrape: true, quarantine: null };
  }

  return { status: 'needs_authoring', shouldScrape: false, safeForLightweightScrape: false, quarantine: null };
}

function parseStateTargets() {
  const files = fs.existsSync(sourceTargetsDir)
    ? fs.readdirSync(sourceTargetsDir).filter((name) => name.endsWith('.json') && !name.includes('texas_resource_truth_map') && !name.includes('unique_texas_eci_contractors')).sort()
    : [];
  const rows = [];
  for (const fileName of files) {
    const stateId = fileName.replace(/\.json$/, '');
    const payload = readJson(path.join(sourceTargetsDir, fileName), []);
    const items = Array.isArray(payload) ? payload : payload.targets || [];
    for (const item of items) {
      rows.push({
        origin: 'state_source_targets',
        stateId,
        stateCode: item.state || '',
        stateName: stateId,
        category: item.category || '',
        specificSubcategory: item.specific_subcategory || '',
        sourceName: item.source_name || '',
        sourceUrl: normalizeUrl(item.source_url || ''),
        domain: getDomain(item.source_url || '', item.domain),
        organizationType: item.organization_type || '',
        targetTable: item.target_table || '',
        expectedExtractionFields: item.expected_extraction_fields || '',
        crawlMethod: item.crawl_method || '',
        robotsStatus: item.robots_status || '',
        termsRisk: item.terms_risk || '',
        priority: Number(item.priority || 0),
        notes: item.notes || '',
        lastCheckedAt: item.last_checked_at || '',
      });
    }
  }
  return { files, rows };
}

function parseRegistryEntries() {
  const registryPath = latestJson(nonprofitRegistryDir, 'registry.json');
  const registry = readJson(registryPath, { entries: [] });
  return (registry.entries || []).map((entry) => ({
    origin: 'nonprofit_link_registry',
    stateId: (entry.stateIds || [])[0] || 'multi-state',
    stateCode: '',
    stateName: (entry.stateIds || [])[0] || 'multi-state',
    category: 'Nonprofit affiliate discovery',
    specificSubcategory: entry.targetType || '',
    sourceName: entry.familyKey || entry.host || '',
    sourceUrl: normalizeUrl(entry.seedUrl || ''),
    domain: getDomain(entry.seedUrl || '', entry.host),
    organizationType: 'nonprofit',
    targetTable: 'nonprofit_organizations',
    expectedExtractionFields: 'name, contact, location, services',
    crawlMethod: entry.scrapeStrategy === 'site_path' ? 'static_fetch' : 'playwright',
    robotsStatus: 'unknown',
    termsRisk: 'low',
    priority: Number(entry.priorityScore || 0),
    notes: `Registry targetType=${entry.targetType}; rowCount=${entry.rowCount}; trustedMissingRows=${entry.trustedMissingRows}`,
    lastCheckedAt: generatedDate,
    targetType: entry.targetType,
    scrapeStrategy: entry.scrapeStrategy,
    familyKey: entry.familyKey,
    stateIds: entry.stateIds || [],
    rowCount: entry.rowCount || 0,
    trustedMissingRows: entry.trustedMissingRows || 0,
  }));
}

function parseAffiliateDiscovery(prefix, familyKey) {
  const filePath = latestGeneratedJson(prefix);
  const payload = readJson(filePath, { affiliates: [] });
  return (payload.affiliates || []).map((entry) => ({
    origin: 'affiliate_discovery',
    stateId: 'multi-state',
    stateCode: '',
    stateName: 'multi-state',
    category: 'Nonprofit affiliate discovery',
    specificSubcategory: familyKey === 'thearc.org' ? 'affiliate_chapter' : 'state_listing_page',
    sourceName: familyKey,
    sourceUrl: normalizeUrl(entry.affiliateUrl || ''),
    domain: getDomain(entry.affiliateUrl || '', familyKey),
    organizationType: 'nonprofit',
    targetTable: 'nonprofit_organizations',
    expectedExtractionFields: 'name, contact, location, services',
    crawlMethod: familyKey === 'thearc.org' ? 'static_fetch' : 'playwright',
    robotsStatus: 'unknown',
    termsRisk: 'low',
    priority: Number(entry.rowCount || 0),
    notes: `Discovery sources=${(entry.discoverySources || []).join(',')}; rowCount=${entry.rowCount || 0}; countyCount=${entry.countyCount || 0}`,
    lastCheckedAt: generatedDate,
    targetType: familyKey === 'thearc.org' ? 'affiliate_chapter' : 'network_directory',
    scrapeStrategy: familyKey === 'thearc.org' ? 'site_path' : 'affiliate_discovery',
    familyKey,
    rowCount: entry.rowCount || 0,
  }));
}

function buildLedgerRows() {
  const quarantineMap = parseQuarantine(quarantinePath);
  const { files, rows: stateRows } = parseStateTargets();
  const registryRows = parseRegistryEntries();
  const affiliateRows = [
    ...parseAffiliateDiscovery('nonprofit-affiliate-discovery-thearc-org-', 'thearc.org'),
    ...parseAffiliateDiscovery('nonprofit-affiliate-discovery-parentcenterhub-org-', 'parentcenterhub.org'),
  ];

  const allRows = [...stateRows, ...registryRows, ...affiliateRows];
  const seen = new Set();
  const ledger = [];

  for (const row of allRows) {
    const sourceUrl = normalizeUrl(row.sourceUrl || '');
    if (!sourceUrl) continue;
    const duplicateGroup = `${getDomain(sourceUrl, row.domain)}|${sourceUrl.replace(/^https?:\/\//, '')}`;
    const dedupeKey = `${row.origin}|${row.stateId}|${String(row.targetTable).toLowerCase()}|${sourceUrl}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const statusInfo = classifyLedgerStatus(row, quarantineMap);
    const gapFamily = inferGapFamily(row);

    ledger.push({
      id: `${row.origin}-${slugify(row.stateId)}-${slugify(row.targetTable)}-${slugify(sourceUrl).slice(0, 80)}`,
      origin: row.origin,
      stateId: row.stateId,
      stateCode: row.stateCode,
      stateName: row.stateName,
      category: row.category,
      specificSubcategory: row.specificSubcategory,
      sourceName: row.sourceName,
      sourceUrl,
      domain: getDomain(sourceUrl, row.domain),
      organizationType: row.organizationType,
      targetTable: row.targetTable,
      expectedExtractionFields: row.expectedExtractionFields,
      crawlMethod: row.crawlMethod,
      robotsStatus: row.robotsStatus,
      termsRisk: row.termsRisk,
      priority: row.priority,
      notes: row.notes,
      lastCheckedAt: row.lastCheckedAt,
      targetType: row.targetType || '',
      scrapeStrategy: row.scrapeStrategy || '',
      sourceFamily: classifySourceFamily(row),
      gapFamily,
      whyNeeded: inferWhyNeeded(gapFamily),
      duplicateGroup,
      firstPartyMode: inferFirstPartyMode(row),
      ledgerStatus: statusInfo.status,
      shouldScrape: statusInfo.shouldScrape,
      safeForLightweightScrape: statusInfo.safeForLightweightScrape,
      quarantineClassification: statusInfo.quarantine?.classification || '',
      quarantineReason: statusInfo.quarantine?.reason || '',
      rowCount: row.rowCount || 0,
      trustedMissingRows: row.trustedMissingRows || 0,
      stateIds: row.stateIds || [],
    });
  }

  return { files, ledger };
}

function toCsv(rows) {
  const headers = [
    'id', 'origin', 'stateId', 'stateCode', 'stateName', 'category', 'specificSubcategory',
    'sourceName', 'sourceUrl', 'domain', 'organizationType', 'targetTable',
    'expectedExtractionFields', 'crawlMethod', 'robotsStatus', 'termsRisk', 'priority',
    'sourceFamily', 'gapFamily', 'whyNeeded', 'duplicateGroup', 'firstPartyMode',
    'ledgerStatus', 'shouldScrape', 'safeForLightweightScrape', 'quarantineClassification',
    'quarantineReason', 'rowCount', 'trustedMissingRows', 'notes',
  ];
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

function topEntries(rows, limit, key) {
  return [...rows]
    .sort((a, b) => (b[key] || 0) - (a[key] || 0) || a.sourceUrl.localeCompare(b.sourceUrl))
    .slice(0, limit);
}

const { files, ledger } = buildLedgerRows();
const stateFileIds = new Set(files.map((name) => name.replace(/\.json$/, '')));
const missingStateFiles = ['california'].filter((stateId) => !stateFileIds.has(stateId));
const competitiveHelpPackPresent = fs.existsSync(path.join(sourcePacksDir, 'competitive_help.json'));
const readyRows = ledger.filter((row) => row.shouldScrape);
const blockedRows = ledger.filter((row) => row.ledgerStatus === 'do_not_use');
const discoveryRows = ledger.filter((row) => row.ledgerStatus === 'discovery_only');
const manualRows = ledger.filter((row) => row.ledgerStatus === 'manual_review');
const sourceRepairRows = ledger.filter((row) => row.ledgerStatus === 'source_repair');
const lightweightRows = readyRows.filter((row) => row.safeForLightweightScrape);
const gapFamilyCounts = countBy(ledger, 'gapFamily');
const statusCounts = countBy(ledger, 'ledgerStatus');
const sourceFamilyCounts = countBy(ledger, 'sourceFamily');
const targetTableCounts = countBy(ledger, 'targetTable');
const duplicateGroupCount = new Set(ledger.map((row) => row.duplicateGroup)).size;

const payload = {
  generatedAt: generatedDate,
  inputs: {
    sourceTargetsDir: path.relative(repoRoot, sourceTargetsDir),
    quarantinePath: path.relative(repoRoot, quarantinePath),
    nonprofitRegistryDir: path.relative(repoRoot, nonprofitRegistryDir),
  },
  summary: {
    stateSourceTargetFiles: files.length,
    expectedStateFiles: STANDARD_STATE_TARGET_FILES,
    missingStateFiles,
    totalLedgerRows: ledger.length,
    uniqueDuplicateGroups: duplicateGroupCount,
    readyRows: readyRows.length,
    lightweightReadyRows: lightweightRows.length,
    discoveryOnlyRows: discoveryRows.length,
    manualReviewRows: manualRows.length,
    sourceRepairRows: sourceRepairRows.length,
    blockedRows: blockedRows.length,
  },
  counts: {
    byStatus: statusCounts,
    byGapFamily: gapFamilyCounts,
    bySourceFamily: sourceFamilyCounts,
    byTargetTable: targetTableCounts,
  },
  biggestReadyNowGaps: {
    providers: topEntries(readyRows.filter((row) => row.gapFamily === 'providers_care'), 25, 'priority'),
    nonprofits: topEntries(readyRows.filter((row) => row.targetTable === 'nonprofit_organizations'), 25, 'trustedMissingRows'),
    officialRouting: topEntries(readyRows.filter((row) => ['county_offices', 'state_resource_agencies', 'regional_education_agencies', 'school_districts'].includes(row.targetTable)), 25, 'priority'),
    forms: topEntries(readyRows.filter((row) => row.targetTable === 'forms'), 25, 'priority'),
  },
  sourceRepairHighlights: {
    providers: topEntries(sourceRepairRows.filter((row) => row.gapFamily === 'providers_care'), 25, 'priority'),
  },
  missingExactUrlCoverage: [
    ...(missingStateFiles.includes('california') ? [{
      family: 'california_source_targets',
      reason: 'California does not currently have a state source-target file, so its exact URL ledger is incomplete outside existing nonprofit discovery artifacts.',
    }] : []),
    ...(competitiveHelpPackPresent ? [] : [{
      family: 'housing_goods_jobs_legal_competitive_layers',
      reason: 'The repo has service-tag schema for housing, goods, utilities, transport, legal aid, and related help types, but the source-target inventory does not yet contain a broad exact-URL crawl ledger for those families.',
    }]),
  ],
  ledger,
};

const mdLines = [
  '# Master Source Target Ledger',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This artifact answers the concrete execution question:',
  '',
  'Which exact URLs should we scrape to fill the repo gaps, and which URLs should we avoid, review manually, or treat only as discovery seeds?',
  '',
  '## Summary',
  '',
  `- state source-target files present: ${payload.summary.stateSourceTargetFiles}/${payload.summary.expectedStateFiles}`,
  `- missing state source-target files: ${payload.summary.missingStateFiles.join(', ') || 'none'}`,
  `- total ledger rows: ${payload.summary.totalLedgerRows}`,
  `- unique duplicate groups: ${payload.summary.uniqueDuplicateGroups}`,
  `- ready rows: ${payload.summary.readyRows}`,
  `- lightweight-ready rows: ${payload.summary.lightweightReadyRows}`,
  `- discovery-only rows: ${payload.summary.discoveryOnlyRows}`,
  `- manual-review rows: ${payload.summary.manualReviewRows}`,
  `- source-repair rows: ${payload.summary.sourceRepairRows}`,
  `- blocked rows: ${payload.summary.blockedRows}`,
  '',
  '## What "Ready" Means',
  '',
  '- `ready_lightweight`: safe to scrape with normal HTTP + HTML parsing.',
  '- `ready_pdf`: safe to scrape as a forms/document source.',
  '- `ready_js_heavy`: scrape-worthy, but likely needs Playwright.',
  '- `discovery_only`: usable to discover real targets, not for direct promotion.',
  '- `manual_review`: known source, but do not automate blindly.',
  '- `source_repair`: exact target exists in the ledger, but the current URL pattern is stale, synthetic, or otherwise needs deterministic replacement before fetch.',
  '- `do_not_use`: quarantined target; do not include in the scraping queue.',
  '',
  '## Counts By Status',
  '',
];

for (const [status, count] of Object.entries(statusCounts).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${status}: ${count}`);
}

mdLines.push('', '## Counts By Gap Family', '');
for (const [gapFamily, count] of Object.entries(gapFamilyCounts).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${gapFamily}: ${count}`);
}

mdLines.push('', '## Missing Exact-URL Coverage', '');
for (const gap of payload.missingExactUrlCoverage) {
  mdLines.push(`- ${gap.family}: ${gap.reason}`);
}

mdLines.push('', '## Highest-Value Ready Provider URLs', '');
for (const row of payload.biggestReadyNowGaps.providers.slice(0, 20)) {
  mdLines.push(`- ${row.stateId}: ${row.sourceUrl} (${row.sourceName}; ${row.crawlMethod}; ${row.ledgerStatus})`);
}

mdLines.push('', '## Provider Source-Repair Targets', '');
for (const row of payload.sourceRepairHighlights.providers.slice(0, 20)) {
  mdLines.push(`- ${row.stateId}: ${row.sourceUrl} (${row.sourceName}; ${row.crawlMethod}; ${row.ledgerStatus})`);
}

mdLines.push('', '## Highest-Value Ready Nonprofit URLs', '');
for (const row of payload.biggestReadyNowGaps.nonprofits.slice(0, 20)) {
  mdLines.push(`- ${row.stateId}: ${row.sourceUrl} (${row.sourceName}; missing=${row.trustedMissingRows || row.priority}; ${row.ledgerStatus})`);
}

mdLines.push('', '## Highest-Value Ready Official Routing URLs', '');
for (const row of payload.biggestReadyNowGaps.officialRouting.slice(0, 20)) {
  mdLines.push(`- ${row.stateId}: ${row.sourceUrl} (${row.targetTable}; ${row.crawlMethod}; ${row.ledgerStatus})`);
}

mdLines.push('', '## Highest-Value Ready Form URLs', '');
for (const row of payload.biggestReadyNowGaps.forms.slice(0, 20)) {
  mdLines.push(`- ${row.stateId}: ${row.sourceUrl} (${row.sourceName}; ${row.ledgerStatus})`);
}

mdLines.push('', '## Files', '');
mdLines.push(`- JSON ledger: ${path.relative(repoRoot, jsonOutPath)}`);
mdLines.push(`- CSV ledger: ${path.relative(repoRoot, csvOutPath)}`);
mdLines.push(`- Markdown report: ${path.relative(repoRoot, mdOutPath)}`);

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(csvOutPath, `${toCsv(ledger)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  summary: payload.summary,
  report: mdOutPath,
  json: jsonOutPath,
  csv: csvOutPath,
}, null, 2));
