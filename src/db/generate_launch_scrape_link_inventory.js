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
const sourcePacksDir = path.join(repoRoot, 'data', 'source_packs');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `launch-scrape-link-inventory-${generatedDate}.json`);
const csvOutPath = path.join(docsDir, `launch-scrape-link-inventory-${generatedDate}.csv`);
const mdOutPath = path.join(docsDir, `launch-scrape-link-inventory-${generatedDate}.md`);

const LAUNCH_FAMILIES = new Set([
  'programs_benefits',
  'forms_guides',
  'waivers',
  'program_waitlists',
  'medicaid_hhs_offices',
  'dd_routing',
  'education_routing',
  'providers_care',
  'knowledge_content',
]);

const LAUNCH_ADJACENT_FAMILIES = new Set([
  'early_intervention_programs',
  'transition_programs',
  'general_gap_fill',
  'source_registry',
]);

const SCRAPE_READY_STATUSES = new Set(['ready_lightweight', 'ready_js_heavy', 'ready_pdf']);

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
  const string = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  if (/[",\n]/.test(string)) return `"${string.replace(/"/g, '""')}"`;
  return string;
}

function inferGapFamily(row) {
  const targetTable = String(row.targetTable || row.target_table || '').toLowerCase();
  const category = String(row.category || '').toLowerCase();
  const lane = String(row.lane || '').toLowerCase();

  if (row.gapFamily) return row.gapFamily;
  if (lane === 'medicaid_county_directory') return 'medicaid_hhs_offices';
  if (lane === 'dd_state_directory') return 'dd_routing';
  if (lane === 'education_routing' || lane === 'special_education') return 'education_routing';
  if (lane === 'forms_library') return 'forms_guides';
  if (lane === 'waiver_program') return 'waivers';
  if (targetTable === 'county_offices') return 'medicaid_hhs_offices';
  if (targetTable === 'state_resource_agencies') return 'dd_routing';
  if (targetTable === 'regional_education_agencies' || targetTable === 'school_districts') return 'education_routing';
  if (targetTable === 'resource_providers') return 'providers_care';
  if (targetTable === 'forms' || targetTable === 'forms_and_guides') return 'forms_guides';
  if (targetTable === 'program_waitlists') return 'program_waitlists';
  if (targetTable === 'knowledge_content' || targetTable === 'knowledge_articles') return 'knowledge_content';
  if (targetTable === 'programs') {
    if (category.includes('waiver')) return 'waivers';
    if (category.includes('early intervention')) return 'early_intervention_programs';
    if (category.includes('transition')) return 'transition_programs';
    return 'programs_benefits';
  }
  return 'general_gap_fill';
}

function laneFromCrawlMethod(crawlMethod, fallback = 'ready_lightweight') {
  const method = String(crawlMethod || '').toLowerCase();
  if (method.includes('playwright')) return 'ready_js_heavy';
  if (method.includes('pdf')) return 'ready_pdf';
  if (method.includes('manual')) return 'manual_review';
  if (method.includes('static') || method.includes('fetch') || method === 'http' || !method) return fallback;
  return fallback;
}

function classifyLaunchNeed(row, status) {
  const family = inferGapFamily(row);
  if (!LAUNCH_FAMILIES.has(family)) {
    return LAUNCH_ADJACENT_FAMILIES.has(family) ? 'launch_adjacent_deprioritized' : 'non_launch_deprioritized';
  }
  if (String(row.quarantineReason || row.quarantineClassification || '').trim()) return 'do_not_scrape_quarantined';
  if (status === 'repair_first') return 'repair_first';
  if (status === 'author_first_candidate') return 'author_first';
  if (status === 'defer_blocked_source') return 'defer_blocked_source';
  if (status === 'live_refresh_candidate') return 'live_refresh_candidate';
  if (SCRAPE_READY_STATUSES.has(status)) return 'ready_target_scrape';
  if (status === 'manual_review' || status === 'discovery_only') return status;
  return 'candidate_review';
}

const rowsByKey = new Map();

function addCandidate(input) {
  const url = normalizeUrl(input.url || input.sourceUrl || input.evidenceUrl || input.reviewedReplacementUrl);
  if (!url || !/^https?:\/\//i.test(url)) return;
  const family = inferGapFamily(input);
  const status = input.scrapeLane || input.ledgerStatus || laneFromCrawlMethod(input.crawlMethod);
  const launchNeedClass = input.launchNeedClass || classifyLaunchNeed(input, status);
  const key = `${url}|${family}|${input.stateId || ''}|${input.targetTable || ''}`;
  const existing = rowsByKey.get(key);
  const sourceArtifact = input.sourceArtifact || 'unknown';
  const sourceArtifacts = existing ? new Set(existing.sourceArtifacts) : new Set();
  sourceArtifacts.add(sourceArtifact);

  rowsByKey.set(key, {
    id: existing?.id || `${family}-${rowsByKey.size + 1}`,
    url,
    domain: domainFor(url, input.domain),
    family,
    stateId: input.stateId || input.stateName || '',
    targetTable: input.targetTable || '',
    sourceName: input.sourceName || '',
    crawlMethod: input.crawlMethod || '',
    scrapeLane: status,
    launchNeedClass,
    ledgerStatus: input.ledgerStatus || status,
    firstPartyMode: input.firstPartyMode || '',
    priority: Number(input.priority || existing?.priority || 0),
    whyNeeded: input.whyNeeded || existing?.whyNeeded || '',
    currentEvidence: input.currentEvidence || existing?.currentEvidence || '',
    sourceArtifacts: [...sourceArtifacts].sort(),
    doNotScrapeReason: input.doNotScrapeReason || input.quarantineReason || existing?.doNotScrapeReason || '',
  });
}

const artifactPaths = {
  launchPlan: latestGeneratedJson('launch-critical-data-acquisition-plan-'),
  sourceCompletionPlan: latestGeneratedJson('source-acquisition-completion-plan-'),
  scrapeNowOnly: latestGeneratedJson('scrape-now-only-'),
  masterSourceTargetLedger: latestGeneratedJson('master-source-target-ledger-'),
  authoredMissingSourceTargets: latestGeneratedJson('authored-missing-source-targets-'),
  dbDiscoveredSourceTargets: latestGeneratedJson('db-discovered-source-targets-'),
  providerSourcePackPlan: latestGeneratedJson('provider-source-pack-plan-'),
  providerAuthoringBacklog: latestGeneratedJson('provider-authoring-backlog-', false),
  knowledgeStatusQueue: latestGeneratedJson('knowledge-content-status-queue-'),
  formsSourcePack: path.join(sourcePacksDir, 'forms_source_pack.json'),
  officialStateDomainRepairs: path.join(sourcePacksDir, 'official_state_domain_repairs.json'),
};

const sourceCompletionPlan = readJson(artifactPaths.sourceCompletionPlan, { combinedReadyRows: [] });
const scrapeNowOnly = readJson(artifactPaths.scrapeNowOnly, { rows: [] });
const masterLedger = readJson(artifactPaths.masterSourceTargetLedger, { ledger: [] });
const authoredTargets = readJson(artifactPaths.authoredMissingSourceTargets, { targets: [] });
const dbDiscoveredTargets = readJson(artifactPaths.dbDiscoveredSourceTargets, { actionableNewTargets: [], targets: [] });
const providerSourcePack = readJson(artifactPaths.providerSourcePackPlan, { states: [], lanes: {} });
const providerBacklog = readJson(artifactPaths.providerAuthoringBacklog, { rows: [] });
const knowledgeStatusQueue = readJson(artifactPaths.knowledgeStatusQueue, { rows: [] });
const formsSourcePack = readJson(artifactPaths.formsSourcePack, { rows: [] });
const officialRepairs = readJson(artifactPaths.officialStateDomainRepairs, { rows: [] });

for (const row of masterLedger.ledger || []) {
  addCandidate({
    ...row,
    url: row.sourceUrl,
    sourceArtifact: path.relative(repoRoot, artifactPaths.masterSourceTargetLedger),
  });
}

for (const row of sourceCompletionPlan.combinedReadyRows || []) {
  addCandidate({
    ...row,
    url: row.sourceUrl,
    scrapeLane: row.ledgerStatus,
    sourceArtifact: path.relative(repoRoot, artifactPaths.sourceCompletionPlan),
  });
}

for (const row of scrapeNowOnly.rows || []) {
  addCandidate({
    ...row,
    url: row.sourceUrl,
    scrapeLane: row.ledgerStatus,
    sourceArtifact: path.relative(repoRoot, artifactPaths.scrapeNowOnly),
  });
}

for (const row of authoredTargets.targets || []) {
  addCandidate({
    ...row,
    url: row.sourceUrl,
    scrapeLane: row.ledgerStatus || laneFromCrawlMethod(row.crawlMethod),
    sourceArtifact: path.relative(repoRoot, artifactPaths.authoredMissingSourceTargets),
  });
}

for (const row of dbDiscoveredTargets.actionableNewTargets || dbDiscoveredTargets.targets || []) {
  addCandidate({
    ...row,
    url: row.sourceUrl,
    scrapeLane: row.ledgerStatus || laneFromCrawlMethod(row.crawlMethod),
    sourceArtifact: path.relative(repoRoot, artifactPaths.dbDiscoveredSourceTargets),
  });
}

for (const formRow of formsSourcePack.rows || []) {
  for (const candidate of formRow.topCandidates || []) {
    addCandidate({
      ...candidate,
      stateId: candidate.stateId || formRow.stateId,
      targetTable: 'forms_and_guides',
      gapFamily: 'forms_guides',
      url: candidate.sourceUrl,
      scrapeLane: 'author_first_candidate',
      launchNeedClass: 'author_first',
      sourceArtifact: path.relative(repoRoot, artifactPaths.formsSourcePack),
      whyNeeded: candidate.whyNeeded || 'Official forms fallback candidate for launch forms coverage.',
    });
  }
  if (formRow.blockedFormsTarget?.sourceUrl) {
    addCandidate({
      stateId: formRow.stateId,
      targetTable: 'forms_and_guides',
      gapFamily: 'forms_guides',
      sourceName: formRow.blockedFormsTarget.sourceName,
      url: formRow.blockedFormsTarget.sourceUrl,
      scrapeLane: 'do_not_use',
      launchNeedClass: 'do_not_scrape_quarantined',
      quarantineReason: formRow.blockedFormsTarget.quarantineReason,
      sourceArtifact: path.relative(repoRoot, artifactPaths.formsSourcePack),
      doNotScrapeReason: formRow.blockedFormsTarget.quarantineReason,
    });
  }
}

for (const repairRow of officialRepairs.rows || []) {
  const family = inferGapFamily(repairRow);
  if (repairRow.fakeSourceUrl) {
    addCandidate({
      ...repairRow,
      gapFamily: family,
      url: repairRow.fakeSourceUrl,
      sourceName: repairRow.sourceName,
      scrapeLane: 'do_not_use',
      launchNeedClass: 'do_not_scrape_quarantined',
      sourceArtifact: path.relative(repoRoot, artifactPaths.officialStateDomainRepairs),
      doNotScrapeReason: repairRow.quarantineReason || 'Official-domain repair row points at a fake or invalid source URL.',
    });
  }
  for (const candidate of repairRow.replacementCandidates || []) {
    addCandidate({
      stateId: repairRow.stateId,
      targetTable: repairRow.targetTable,
      gapFamily: family,
      sourceName: candidate.name || repairRow.sourceName,
      url: candidate.url,
      crawlMethod: 'static_fetch',
      scrapeLane: candidate.confidence === 'low' ? 'manual_review' : 'repair_first',
      launchNeedClass: candidate.confidence === 'low' ? 'manual_review' : 'repair_first',
      currentEvidence: repairRow.desiredEvidence,
      sourceArtifact: path.relative(repoRoot, artifactPaths.officialStateDomainRepairs),
      whyNeeded: `Repair source for ${repairRow.lane}.`,
    });
  }
}

function addProviderTargets(targets, stateId, artifactPath) {
  for (const target of targets || []) {
    addCandidate({
      ...target,
      stateId: stateId || String(target.state || '').toLowerCase(),
      targetTable: target.target_table || target.targetTable || 'resource_providers',
      gapFamily: 'providers_care',
      sourceName: target.source_name || target.sourceName,
      url: target.source_url || target.sourceUrl,
      crawlMethod: target.crawl_method || target.crawlMethod,
      scrapeLane: 'author_first_candidate',
      launchNeedClass: 'author_first',
      sourceArtifact: path.relative(repoRoot, artifactPath),
      whyNeeded: target.notes || 'Provider launch anchor candidate.',
    });
  }
}

for (const state of providerSourcePack.states || []) {
  addProviderTargets(state.concreteProviderTargets, state.stateId, artifactPaths.providerSourcePackPlan);
}
for (const laneRows of Object.values(providerSourcePack.lanes || {})) {
  if (!Array.isArray(laneRows)) continue;
  for (const state of laneRows) addProviderTargets(state.concreteProviderTargets, state.stateId, artifactPaths.providerSourcePackPlan);
}
for (const row of providerBacklog.rows || []) {
  if (row.sourceTargetsPath && fs.existsSync(path.join(repoRoot, row.sourceTargetsPath))) {
    const targets = readJson(path.join(repoRoot, row.sourceTargetsPath), []);
    addProviderTargets(targets.filter((target) => (target.target_table || target.targetTable) === 'resource_providers'), row.stateId, artifactPaths.providerAuthoringBacklog || artifactPaths.providerSourcePackPlan);
  }
}

for (const row of knowledgeStatusQueue.rows || []) {
  addCandidate({
    ...row,
    targetTable: 'knowledge_content',
    gapFamily: 'knowledge_content',
    url: row.sourceUrl,
    scrapeLane: row.finalStatus === 'deferred_blocked_source' ? 'defer_blocked_source' : 'author_first_candidate',
    launchNeedClass: row.finalStatus === 'deferred_blocked_source' ? 'defer_blocked_source' : 'author_first',
    sourceArtifact: path.relative(repoRoot, artifactPaths.knowledgeStatusQueue),
    currentEvidence: row.nextAction || row.lastFollowupReason,
  });
  if (row.reviewedReplacementUrl) {
    addCandidate({
      ...row,
      targetTable: 'knowledge_content',
      gapFamily: 'knowledge_content',
      sourceName: row.reviewedReplacementName || row.sourceName,
      url: row.reviewedReplacementUrl,
      scrapeLane: 'author_first_candidate',
      launchNeedClass: 'author_first',
      sourceArtifact: path.relative(repoRoot, artifactPaths.knowledgeStatusQueue),
      currentEvidence: 'Reviewed replacement URL for blocked knowledge source.',
    });
  }
}

function addDbSourceUrls() {
  if (!fs.existsSync(dbPath)) return;
  const db = new Database(dbPath, { readonly: true });
  const tableConfigs = [
    { table: 'programs', family: 'programs_benefits', stateColumn: 'state_id', targetTable: 'programs', columns: ['source_url', 'official_source_url'] },
    { table: 'forms_and_guides', family: 'forms_guides', stateColumn: 'state_id', targetTable: 'forms_and_guides', columns: ['source_url', 'pdf_url'] },
    { table: 'program_waitlists', family: 'program_waitlists', stateColumn: '', targetTable: 'program_waitlists', columns: ['estimate_source_url'] },
    { table: 'county_offices', family: 'medicaid_hhs_offices', stateColumn: '', targetTable: 'county_offices', columns: ['source_url', 'website'] },
    { table: 'state_resource_agencies', family: 'dd_routing', stateColumn: 'state_id', targetTable: 'state_resource_agencies', columns: ['source_url', 'website', 'eligibility_info_page', 'services_page'] },
    { table: 'regional_education_agencies', family: 'education_routing', stateColumn: 'state_id', targetTable: 'regional_education_agencies', columns: ['source_url', 'website'] },
    { table: 'school_districts', family: 'education_routing', stateColumn: '', targetTable: 'school_districts', columns: ['source_url', 'website'] },
    { table: 'resource_providers', family: 'providers_care', stateColumn: '', targetTable: 'resource_providers', columns: ['source_url', 'website', 'application_url', 'next_step_url'] },
  ];

  try {
    for (const config of tableConfigs) {
      const tableInfo = db.prepare(`PRAGMA table_info(${config.table})`).all();
      const tableColumns = new Set(tableInfo.map((column) => column.name));
      if (!tableColumns.size) continue;
      const availableColumns = config.columns.filter((column) => tableColumns.has(column));
      if (!availableColumns.length) continue;
      const selectParts = [
        config.stateColumn && tableColumns.has(config.stateColumn) ? `${config.stateColumn} AS stateId` : `'' AS stateId`,
        ...availableColumns.map((column) => `${column} AS ${column}`),
      ];
      const rows = db.prepare(`SELECT ${selectParts.join(', ')} FROM ${config.table}`).all();
      for (const row of rows) {
        for (const column of availableColumns) {
          addCandidate({
            stateId: row.stateId || '',
            targetTable: config.targetTable,
            gapFamily: config.family,
            sourceName: `${config.table}.${column}`,
            url: row[column],
            scrapeLane: 'live_refresh_candidate',
            launchNeedClass: 'live_refresh_candidate',
            sourceArtifact: 'ca_disability_navigator.db',
            whyNeeded: 'Existing live DB source URL that may need refresh or validation before launch.',
          });
        }
      }
    }
  } finally {
    db.close();
  }
}

addDbSourceUrls();

const allRows = [...rowsByKey.values()]
  .filter((row) => LAUNCH_FAMILIES.has(row.family) || LAUNCH_ADJACENT_FAMILIES.has(row.family))
  .sort((a, b) =>
    a.launchNeedClass.localeCompare(b.launchNeedClass)
    || a.family.localeCompare(b.family)
    || String(a.stateId).localeCompare(String(b.stateId))
    || a.domain.localeCompare(b.domain)
    || a.url.localeCompare(b.url),
  )
  .map((row, index) => ({ ...row, id: `launch-url-${String(index + 1).padStart(5, '0')}` }));

const launchCriticalRows = allRows.filter((row) => LAUNCH_FAMILIES.has(row.family));
const summary = {
  totalUniqueUrls: allRows.length,
  launchCriticalUniqueUrls: launchCriticalRows.length,
  readyTargetScrapeUrls: launchCriticalRows.filter((row) => row.launchNeedClass === 'ready_target_scrape').length,
  authorFirstUrls: launchCriticalRows.filter((row) => row.launchNeedClass === 'author_first').length,
  repairFirstUrls: launchCriticalRows.filter((row) => row.launchNeedClass === 'repair_first').length,
  deferredBlockedSourceUrls: launchCriticalRows.filter((row) => row.launchNeedClass === 'defer_blocked_source').length,
  liveRefreshCandidateUrls: launchCriticalRows.filter((row) => row.launchNeedClass === 'live_refresh_candidate').length,
  doNotScrapeQuarantinedUrls: launchCriticalRows.filter((row) => row.launchNeedClass === 'do_not_scrape_quarantined').length,
  byLaunchNeedClass: sortObject(countBy(launchCriticalRows, 'launchNeedClass')),
  byFamily: sortObject(countBy(launchCriticalRows, 'family')),
  byScrapeLane: sortObject(countBy(launchCriticalRows, 'scrapeLane')),
};

const payload = {
  generatedAt: generatedDate,
  purpose: 'Deduped inventory of every known launch-relevant URL from source ledgers, source packs, repair ledgers, knowledge queues, provider packs, and live DB provenance fields.',
  sourceArtifacts: Object.fromEntries(
    Object.entries(artifactPaths)
      .filter(([, value]) => value)
      .map(([key, value]) => [key, path.relative(repoRoot, value)]),
  ),
  launchFamilies: [...LAUNCH_FAMILIES].sort(),
  summary,
  rows: allRows,
};

const csvHeaders = [
  'id',
  'url',
  'domain',
  'family',
  'stateId',
  'targetTable',
  'sourceName',
  'scrapeLane',
  'launchNeedClass',
  'crawlMethod',
  'ledgerStatus',
  'firstPartyMode',
  'priority',
  'sourceArtifacts',
  'whyNeeded',
  'currentEvidence',
  'doNotScrapeReason',
];
const csvLines = [
  csvHeaders.join(','),
  ...allRows.map((row) => csvHeaders.map((header) => csvEscape(row[header])).join(',')),
];

const mdLines = [
  '# Launch Scrape Link Inventory',
  '',
  `Generated: ${generatedDate}`,
  '',
  '## Summary',
  '',
  ...Object.entries(summary).map(([key, value]) => `- ${key}: ${Array.isArray(value) || typeof value !== 'object' ? value : Object.entries(value).map(([k, v]) => `${k}=${v}`).join(', ')}`),
  '',
  '## Source Artifacts',
  '',
  ...Object.entries(payload.sourceArtifacts).map(([key, value]) => `- ${key}: \`${value}\``),
  '',
  '## Family Counts',
  '',
  '| family | urls |',
  '|---|---:|',
  ...Object.entries(summary.byFamily).map(([family, count]) => `| ${family} | ${count} |`),
  '',
  '## Launch Need Classes',
  '',
  '| class | urls |',
  '|---|---:|',
  ...Object.entries(summary.byLaunchNeedClass).map(([klass, count]) => `| ${klass} | ${count} |`),
  '',
  '## Highest Priority Ready URLs',
  '',
  '| family | state | lane | url |',
  '|---|---|---|---|',
  ...launchCriticalRows
    .filter((row) => row.launchNeedClass === 'ready_target_scrape')
    .slice(0, 50)
    .map((row) => `| ${row.family} | ${row.stateId || ''} | ${row.scrapeLane} | ${row.url} |`),
  '',
  '## Notes',
  '',
  '- `ready_target_scrape` links are exact runnable scrape targets already present in control-plane artifacts.',
  '- `author_first` links are source-pack or packet candidates that need authoring/application before they should consume scrape volume.',
  '- `repair_first` links are replacement candidates for known broken source rows.',
  '- `live_refresh_candidate` links are existing public DB provenance URLs that may need refresh/validation, not first-pass scraping.',
  '- `do_not_scrape_quarantined` links are retained only so fake/stale sources stay visible and excluded.',
];

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(csvOutPath, `${csvLines.join('\n')}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  json: jsonOutPath,
  csv: csvOutPath,
  md: mdOutPath,
  summary,
}, null, 2));
