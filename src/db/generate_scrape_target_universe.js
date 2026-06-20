import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `scrape-target-universe-${generatedDate}.json`);
const csvOutPath = path.join(docsDir, `scrape-target-universe-${generatedDate}.csv`);
const mdOutPath = path.join(docsDir, `scrape-target-universe-${generatedDate}.md`);

function readJson(filePath, fallback = null) {
  if (!filePath || !fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJson(prefix, required = true) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    if (required) throw new Error(`Missing generated input for prefix "${prefix}"`);
    return null;
  }
  return path.join(docsDir, matches.at(-1));
}

function normalizeUrl(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return '';
  try {
    const parsed = new URL(value);
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) {
      parsed.port = '';
    }
    return parsed.toString();
  } catch {
    return value.replace(/\/+$/, '');
  }
}

function domainFor(rawUrl, fallback = '') {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return String(fallback || '').replace(/^www\./, '').toLowerCase();
  }
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function sortObject(object) {
  return Object.fromEntries(Object.entries(object).sort((a, b) => String(a[0]).localeCompare(String(b[0]))));
}

function csvEscape(value) {
  const string = String(value ?? '');
  if (/[",\n]/.test(string)) return `"${string.replace(/"/g, '""')}"`;
  return string;
}

function inferGapFamily(row) {
  const explicit = String(row.gapFamily || '').trim();
  if (explicit) return explicit;

  const targetTable = String(row.targetTable || row.target_table || '').toLowerCase();
  const category = String(row.category || '').toLowerCase();
  const lane = String(row.lane || '').toLowerCase();

  if (lane === 'medicaid_county_directory') return 'medicaid_hhs_offices';
  if (lane === 'dd_state_directory') return 'dd_routing';
  if (lane === 'education_routing' || lane === 'special_education') return 'education_routing';
  if (lane === 'forms_library') return 'forms_guides';
  if (lane === 'waiver_program') return 'waivers';

  if (targetTable === 'counties') return 'geography_counties';
  if (targetTable === 'county_offices') return 'medicaid_hhs_offices';
  if (targetTable === 'state_resource_agencies') return 'dd_routing';
  if (targetTable === 'regional_education_agencies' || targetTable === 'school_districts') return 'education_routing';
  if (targetTable === 'resource_providers') return 'providers_care';
  if (targetTable === 'nonprofit_organizations') {
    if (category.includes('parent training')) return 'parent_training_nonprofits';
    if (category.includes('condition')) return 'condition_nonprofits';
    return 'nonprofit_support';
  }
  if (targetTable === 'iep_advocates') return 'advocates_legal';
  if (targetTable === 'forms' || targetTable === 'forms_and_guides') return 'forms_guides';
  if (targetTable === 'program_waitlists') return 'program_waitlists';
  if (targetTable === 'knowledge_content' || targetTable === 'knowledge_articles') return 'knowledge_content';
  if (targetTable === 'help_resources') {
    return String(row.help_type || '').trim() || 'general_gap_fill';
  }
  if (targetTable === 'programs') {
    if (category.includes('waiver')) return 'waivers';
    if (category.includes('early intervention')) return 'early_intervention_programs';
    if (category.includes('transition')) return 'transition_programs';
    return 'programs_benefits';
  }
  if (targetTable === 'sources') return 'source_registry';
  return 'general_gap_fill';
}

function laneFromCrawlMethod(crawlMethod, fallback = 'candidate_review') {
  const method = String(crawlMethod || '').toLowerCase();
  if (method.includes('playwright')) return 'ready_js_heavy';
  if (method.includes('pdf')) return 'ready_pdf';
  if (method.includes('manual')) return 'manual_review';
  if (method.includes('static') || method.includes('fetch') || method === 'http') return 'ready_lightweight';
  return fallback;
}

function candidateClassFor(row) {
  const status = String(row.ledgerStatus || row.scrapeLane || '').trim();
  const queue = String(row.sourceQueue || '').trim();
  const artifact = String(row.sourceArtifact || '').trim();
  if (status === 'do_not_use' || String(row.doNotScrapeReason || row.quarantineReason || '').trim()) return 'do_not_scrape';
  if (status === 'repair_first') return 'repair_first';
  if (status === 'defer_blocked_source') return 'defer_blocked_source';
  if (status === 'author_first_candidate') return 'author_first';
  if (status === 'manual_review') return 'manual_review';
  if (status === 'discovery_only') return 'discovery_only';
  if (status === 'staging_refresh_candidate') return 'staging_refresh_candidate';
  if (status === 'live_refresh_candidate') return 'live_refresh_candidate';
  if (status.startsWith('ready_')) return 'ready_target_scrape';
  if (artifact === 'ca_disability_navigator.db' && queue === 'staging_db') return 'staging_refresh_candidate';
  if (artifact === 'ca_disability_navigator.db') return 'live_refresh_candidate';
  return 'candidate_review';
}

const rowsByKey = new Map();

function addCandidate(input) {
  const url = normalizeUrl(input.url || input.sourceUrl || input.source_url || input.evidenceUrl || input.reviewedReplacementUrl);
  if (!url || !/^https?:\/\//i.test(url)) return;

  const family = inferGapFamily(input);
  const stateId = String(input.stateId || input.state_id || input.state || '').trim().toLowerCase();
  const targetTable = String(input.targetTable || input.target_table || '').trim();
  const scrapeLane = String(input.scrapeLane || input.ledgerStatus || laneFromCrawlMethod(input.crawlMethod || input.crawl_method)).trim();
  const sourceArtifact = String(input.sourceArtifact || 'unknown').trim();
  const key = `${url}|${family}|${stateId}|${targetTable}`;
  const existing = rowsByKey.get(key);
  const sourceArtifacts = existing ? new Set(existing.sourceArtifacts) : new Set();
  sourceArtifacts.add(sourceArtifact);

  const record = {
    id: existing?.id || `scrape-universe-${String(rowsByKey.size + 1).padStart(6, '0')}`,
    url,
    domain: domainFor(url, input.domain),
    family,
    stateId,
    targetTable,
    sourceName: String(input.sourceName || input.source_name || '').trim(),
    crawlMethod: String(input.crawlMethod || input.crawl_method || '').trim(),
    scrapeLane,
    candidateClass: '',
    priority: Number(input.priority || existing?.priority || 0),
    whyIncluded: String(input.whyIncluded || input.whyNeeded || existing?.whyIncluded || '').trim(),
    currentEvidence: String(input.currentEvidence || existing?.currentEvidence || '').trim(),
    sourceArtifacts: [...sourceArtifacts].sort(),
    doNotScrapeReason: String(input.doNotScrapeReason || input.quarantineReason || existing?.doNotScrapeReason || '').trim(),
    sourceQueue: String(input.sourceQueue || existing?.sourceQueue || '').trim(),
  };
  record.candidateClass = candidateClassFor(record);
  rowsByKey.set(key, record);
}

const artifactPaths = {
  completionPlan: latestGeneratedJson('source-acquisition-completion-plan-'),
  launchInventory: latestGeneratedJson('launch-scrape-link-inventory-', false),
  masterLedger: latestGeneratedJson('master-source-target-ledger-'),
  authoredTargets: latestGeneratedJson('authored-missing-source-targets-'),
  dbDiscoveredTargets: latestGeneratedJson('db-discovered-source-targets-'),
};

const completionPlan = readJson(artifactPaths.completionPlan, { combinedReadyRows: [] });
const launchInventory = readJson(artifactPaths.launchInventory, { rows: [] });
const masterLedger = readJson(artifactPaths.masterLedger, { ledger: [] });
const authoredTargets = readJson(artifactPaths.authoredTargets, { targets: [] });
const dbDiscoveredTargets = readJson(artifactPaths.dbDiscoveredTargets, { actionableNewTargets: [], targets: [] });

for (const row of masterLedger.ledger || []) {
  addCandidate({
    ...row,
    url: row.sourceUrl || row.seedUrl,
    sourceArtifact: path.relative(repoRoot, artifactPaths.masterLedger),
  });
}

for (const row of authoredTargets.targets || []) {
  addCandidate({
    ...row,
    url: row.sourceUrl,
    sourceArtifact: path.relative(repoRoot, artifactPaths.authoredTargets),
  });
}

for (const row of dbDiscoveredTargets.actionableNewTargets || dbDiscoveredTargets.targets || []) {
  addCandidate({
    ...row,
    url: row.sourceUrl,
    sourceArtifact: path.relative(repoRoot, artifactPaths.dbDiscoveredTargets),
  });
}

for (const row of completionPlan.combinedReadyRows || []) {
  addCandidate({
    ...row,
    url: row.sourceUrl,
    sourceArtifact: path.relative(repoRoot, artifactPaths.completionPlan),
  });
}

for (const row of launchInventory.rows || []) {
  addCandidate({
    ...row,
    url: row.url,
    sourceArtifact: path.relative(repoRoot, artifactPaths.launchInventory),
  });
}

function addDbUrls() {
  if (!fs.existsSync(dbPath)) return;
  const db = new Database(dbPath, { readonly: true });

  const tableConfigs = [
    { table: 'programs', family: 'programs_benefits', stateColumn: 'state_id', targetTable: 'programs', columns: ['source_url', 'official_source_url'], candidateClass: 'live_refresh_candidate' },
    { table: 'forms_and_guides', family: 'forms_guides', stateColumn: 'state_id', targetTable: 'forms_and_guides', columns: ['source_url', 'pdf_url'], candidateClass: 'live_refresh_candidate' },
    { table: 'program_waitlists', family: 'program_waitlists', stateColumn: '', targetTable: 'program_waitlists', columns: ['estimate_source_url'], candidateClass: 'live_refresh_candidate' },
    { table: 'county_offices', family: 'medicaid_hhs_offices', stateColumn: 'state_id', targetTable: 'county_offices', columns: ['source_url', 'website'], candidateClass: 'live_refresh_candidate' },
    { table: 'state_resource_agencies', family: 'dd_routing', stateColumn: 'state_id', targetTable: 'state_resource_agencies', columns: ['source_url', 'website', 'eligibility_info_page', 'services_page'], candidateClass: 'live_refresh_candidate' },
    { table: 'regional_education_agencies', family: 'education_routing', stateColumn: 'state_id', targetTable: 'regional_education_agencies', columns: ['source_url', 'website'], candidateClass: 'live_refresh_candidate' },
    { table: 'school_districts', family: 'education_routing', stateColumn: 'state_id', targetTable: 'school_districts', columns: ['source_url', 'website'], candidateClass: 'live_refresh_candidate' },
    { table: 'resource_providers', family: 'providers_care', stateColumn: 'state_id', targetTable: 'resource_providers', columns: ['source_url', 'website', 'application_url', 'next_step_url'], candidateClass: 'live_refresh_candidate' },
    { table: 'nonprofit_organizations', family: 'nonprofit_support', stateColumn: 'state_id', targetTable: 'nonprofit_organizations', columns: ['source_url', 'website'], candidateClass: 'live_refresh_candidate' },
    { table: 'iep_advocates', family: 'advocates_legal', stateColumn: 'state_id', targetTable: 'iep_advocates', columns: ['source_url', 'website'], candidateClass: 'live_refresh_candidate' },
    { table: 'knowledge_articles', family: 'knowledge_content', stateColumn: '', targetTable: 'knowledge_articles', columns: ['source_url'], candidateClass: 'live_refresh_candidate' },
    { table: 'help_resources', family: 'general_gap_fill', stateColumn: 'state_id', targetTable: 'help_resources', columns: ['source_url', 'action_url', 'website'], candidateClass: 'live_refresh_candidate' },
    { table: 'staging_scraped_programs', family: 'programs_benefits', stateColumn: 'state_id', targetTable: 'programs', columns: ['source_url', 'official_source_url'], candidateClass: 'staging_refresh_candidate' },
    { table: 'staging_scraped_forms', family: 'forms_guides', stateColumn: 'state_id', targetTable: 'forms_and_guides', columns: ['source_url', 'official_download_url'], candidateClass: 'staging_refresh_candidate' },
    { table: 'staging_scraped_waitlists', family: 'program_waitlists', stateColumn: 'state_id', targetTable: 'program_waitlists', columns: ['source_url', 'estimate_source_url'], candidateClass: 'staging_refresh_candidate' },
    { table: 'staging_scraped_county_offices', family: 'medicaid_hhs_offices', stateColumn: 'state_id', targetTable: 'county_offices', columns: ['source_url', 'extracted_website'], candidateClass: 'staging_refresh_candidate' },
    { table: 'staging_scraped_state_resource_agencies', family: 'dd_routing', stateColumn: 'state_id', targetTable: 'state_resource_agencies', columns: ['source_url', 'extracted_website'], candidateClass: 'staging_refresh_candidate' },
    { table: 'staging_scraped_regional_education_agencies', family: 'education_routing', stateColumn: 'state_id', targetTable: 'regional_education_agencies', columns: ['source_url', 'extracted_website'], candidateClass: 'staging_refresh_candidate' },
    { table: 'staging_scraped_school_districts', family: 'education_routing', stateColumn: 'state_id', targetTable: 'school_districts', columns: ['source_url', 'extracted_website'], candidateClass: 'staging_refresh_candidate' },
    { table: 'staging_scraped_resource_providers', family: 'providers_care', stateColumn: 'state_id', targetTable: 'resource_providers', columns: ['source_url', 'extracted_website', 'application_url', 'next_step_url'], candidateClass: 'staging_refresh_candidate' },
    { table: 'staging_scraped_nonprofit_organizations', family: 'nonprofit_support', stateColumn: 'state_id', targetTable: 'nonprofit_organizations', columns: ['source_url', 'extracted_website'], candidateClass: 'staging_refresh_candidate' },
    { table: 'staging_scraped_help_resources', family: 'general_gap_fill', stateColumn: 'state_id', targetTable: 'help_resources', columns: ['source_url', 'action_url', 'website'], candidateClass: 'staging_refresh_candidate' },
    { table: 'staging_scraped_knowledge_content', family: 'knowledge_content', stateColumn: 'state_id', targetTable: 'knowledge_content', columns: ['source_url'], candidateClass: 'staging_refresh_candidate' },
  ];

  try {
    for (const config of tableConfigs) {
      const tableInfo = db.prepare(`PRAGMA table_info(${config.table})`).all();
      const tableColumns = new Set(tableInfo.map((column) => column.name));
      if (!tableColumns.size) continue;
      const availableColumns = config.columns.filter((column) => tableColumns.has(column));
      if (!availableColumns.length) continue;

      const selectParts = [
        config.stateColumn && tableColumns.has(config.stateColumn) ? `${config.stateColumn} AS state_id` : `'' AS state_id`,
        ...availableColumns.map((column) => `${column} AS ${column}`),
      ];
      const rows = db.prepare(`SELECT ${selectParts.join(', ')} FROM ${config.table}`).all();

      for (const row of rows) {
        for (const column of availableColumns) {
          addCandidate({
            stateId: row.state_id || '',
            targetTable: config.targetTable,
            gapFamily: config.family,
            sourceName: `${config.table}.${column}`,
            url: row[column],
            scrapeLane: config.candidateClass,
            ledgerStatus: config.candidateClass,
            sourceQueue: config.candidateClass === 'staging_refresh_candidate' ? 'staging_db' : 'live_db',
            sourceArtifact: 'ca_disability_navigator.db',
            whyIncluded: config.candidateClass === 'staging_refresh_candidate'
              ? 'URL observed in staging output and kept for future refresh or exact-target promotion.'
              : 'URL observed in live DB and kept for future refresh or source dedupe.',
          });
        }
      }
    }
  } finally {
    db.close();
  }
}

addDbUrls();

const rows = [...rowsByKey.values()]
  .sort((a, b) =>
    a.family.localeCompare(b.family)
    || a.stateId.localeCompare(b.stateId)
    || a.domain.localeCompare(b.domain)
    || a.url.localeCompare(b.url)
  );

const summary = {
  totalUniqueUrls: rows.length,
  readyTargetScrapeUrls: rows.filter((row) => row.candidateClass === 'ready_target_scrape').length,
  authorFirstUrls: rows.filter((row) => row.candidateClass === 'author_first').length,
  repairFirstUrls: rows.filter((row) => row.candidateClass === 'repair_first').length,
  stagingRefreshCandidateUrls: rows.filter((row) => row.candidateClass === 'staging_refresh_candidate').length,
  liveRefreshCandidateUrls: rows.filter((row) => row.candidateClass === 'live_refresh_candidate').length,
  discoveryOnlyUrls: rows.filter((row) => row.candidateClass === 'discovery_only').length,
  manualReviewUrls: rows.filter((row) => row.candidateClass === 'manual_review').length,
  deferredBlockedSourceUrls: rows.filter((row) => row.candidateClass === 'defer_blocked_source').length,
  doNotScrapeUrls: rows.filter((row) => row.candidateClass === 'do_not_scrape').length,
  byFamily: sortObject(countBy(rows, 'family')),
  byCandidateClass: sortObject(countBy(rows, 'candidateClass')),
  byScrapeLane: sortObject(countBy(rows, 'scrapeLane')),
  bySourceArtifact: sortObject(countBy(rows, 'sourceArtifacts')),
};

const topDomains = Object.entries(countBy(rows, 'domain'))
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 100)
  .map(([domain, count]) => ({ domain, count }));

const payload = {
  generatedAt: generatedDate,
  inputs: artifactPaths,
  summary,
  topDomains,
  rows,
};

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);

const csvColumns = [
  'id',
  'url',
  'domain',
  'family',
  'stateId',
  'targetTable',
  'sourceName',
  'scrapeLane',
  'candidateClass',
  'priority',
  'sourceQueue',
  'whyIncluded',
  'currentEvidence',
  'doNotScrapeReason',
  'sourceArtifacts',
];

const csvLines = [csvColumns.join(',')];
for (const row of rows) {
  csvLines.push(csvColumns.map((column) => csvEscape(Array.isArray(row[column]) ? row[column].join('; ') : row[column])).join(','));
}
fs.writeFileSync(csvOutPath, `${csvLines.join('\n')}\n`);

const mdLines = [
  '# Scrape Target Universe',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This artifact is the broad candidate universe for future scraping work. It is intentionally larger than the runnable queue and mixes ready rows with author-first, repair-first, live-refresh, staging-refresh, manual-review, and do-not-scrape rows.',
  '',
  '## Summary',
  '',
  `- total unique urls: ${summary.totalUniqueUrls}`,
  `- ready target scrape: ${summary.readyTargetScrapeUrls}`,
  `- author first: ${summary.authorFirstUrls}`,
  `- repair first: ${summary.repairFirstUrls}`,
  `- staging refresh candidate: ${summary.stagingRefreshCandidateUrls}`,
  `- live refresh candidate: ${summary.liveRefreshCandidateUrls}`,
  `- discovery only: ${summary.discoveryOnlyUrls}`,
  `- manual review: ${summary.manualReviewUrls}`,
  `- deferred blocked source: ${summary.deferredBlockedSourceUrls}`,
  `- do not scrape: ${summary.doNotScrapeUrls}`,
  '',
  '## Families',
  '',
  ...Object.entries(summary.byFamily).map(([family, count]) => `- ${family}: ${count}`),
  '',
  '## Candidate Classes',
  '',
  ...Object.entries(summary.byCandidateClass).map(([candidateClass, count]) => `- ${candidateClass}: ${count}`),
  '',
  '## Top Domains',
  '',
  ...topDomains.slice(0, 40).map((row) => `- ${row.domain}: ${row.count}`),
  '',
];

fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  summary,
  topDomains: topDomains.slice(0, 20),
  json: jsonOutPath,
  csv: csvOutPath,
  md: mdOutPath,
}, null, 2));
