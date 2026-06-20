import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `launch-scraper-queue-false-positive-risk-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-queue-false-positive-risk-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function requiredJson(prefix) {
  const filePath = path.join(docsDir, `${prefix}-${generatedDate}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required artifact: ${filePath}`);
  }
  return readJson(filePath);
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

function pathDepth(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    return parsed.pathname.split('/').filter(Boolean).length;
  } catch {
    return 0;
  }
}

function escapeCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|');
}

const inventory = requiredJson('launch-scrape-link-inventory');
const taxonomy = requiredJson('launch-scraper-false-positive-taxonomy');
const qaPack = requiredJson('launch-scraper-qa-pack');

const launchRows = inventory.rows || [];
const actionableClasses = new Set(['ready_target_scrape', 'live_refresh_candidate']);
const placeholderDomainPattern = /^dhhs\.[a-z-]+\.gov$/i;
const launchFamilies = inventory.launchFamilies || [];

const taxonomyByClass = new Map((taxonomy.rows || []).map((row) => [row.taxonomyClass, row]));
const knownRiskExampleUrls = new Map();
for (const row of taxonomy.rows || []) {
  for (const example of row.examples || []) {
    if (!example.sourceUrl) continue;
    knownRiskExampleUrls.set(example.sourceUrl, row.taxonomyClass);
  }
}

const qaRejectedUrls = new Set(
  (qaPack.familyQaPacks || [])
    .map((pack) => pack.rejectedCase?.sourceUrl)
    .filter(Boolean),
);

function classifyRisk(row) {
  if (placeholderDomainPattern.test(row.domain || '')) {
    if (row.launchNeedClass === 'live_refresh_candidate') {
      return {
        riskClass: 'live_refresh_placeholder_domain',
        severity: 'high',
        recommendedLane: 'repair_first',
        rationale: 'Live DB refresh candidate points at a placeholder-style official domain and should be repaired before scrape spend.',
      };
    }
    if (row.launchNeedClass === 'ready_target_scrape') {
      return {
        riskClass: 'ready_target_placeholder_domain',
        severity: 'critical',
        recommendedLane: 'do_not_scrape_quarantined',
        rationale: 'A placeholder-style official domain escaped into ready scrape and must be quarantined.',
      };
    }
    return {
      riskClass: 'quarantined_placeholder_domain',
      severity: 'medium',
      recommendedLane: 'repair_first',
      rationale: 'Known placeholder official domain is already quarantined and should stay out of scrape spend.',
    };
  }

  const matchedTaxonomyClass = knownRiskExampleUrls.get(row.url);
  if (matchedTaxonomyClass && actionableClasses.has(row.launchNeedClass)) {
    const taxonomyRow = taxonomyByClass.get(matchedTaxonomyClass);
    return {
      riskClass: `taxonomy_example_match:${matchedTaxonomyClass}`,
      severity: matchedTaxonomyClass === 'blocked_error_shell' ? 'high' : 'medium',
      recommendedLane: taxonomyRow?.nextLane || 'repair_first',
      rationale: `URL exactly matches a known false-positive taxonomy example for ${matchedTaxonomyClass}.`,
    };
  }

  if (
    ['programs_benefits', 'waivers', 'program_waitlists'].includes(row.family)
    && actionableClasses.has(row.launchNeedClass)
    && pathDepth(row.url) <= 1
  ) {
    return {
      riskClass: 'generic_program_shell_risk',
      severity: 'medium',
      recommendedLane: 'author_first',
      rationale: 'Shallow program-like URL is at risk of being a generic agency shell instead of an actionable program page.',
    };
  }

  if (
    ['medicaid_hhs_offices', 'education_routing', 'dd_routing', 'providers_care'].includes(row.family)
    && actionableClasses.has(row.launchNeedClass)
    && /(directory|locator|locations|map|find-a-center|find-a|regional)$/i.test(row.url)
  ) {
    return {
      riskClass: 'contactless_directory_shell_risk',
      severity: 'medium',
      recommendedLane: 'repair_first',
      rationale: 'Directory or locator shell patterns often fail to produce concrete contact/location evidence on first pass.',
    };
  }

  if (row.family === 'knowledge_content' && (row.launchNeedClass === 'defer_blocked_source' || row.launchNeedClass === 'author_first')) {
    return {
      riskClass: 'knowledge_blocked_source_risk',
      severity: 'medium',
      recommendedLane: row.launchNeedClass === 'defer_blocked_source' ? 'defer_blocked_source' : 'author_first',
      rationale: 'Knowledge target is still blocked or replacement-authored and should not reopen fetch until a reviewed exact target is ready.',
    };
  }

  if (qaRejectedUrls.has(row.url) && actionableClasses.has(row.launchNeedClass)) {
    return {
      riskClass: 'known_rejected_url_reentered_actionable_queue',
      severity: 'high',
      recommendedLane: 'repair_first',
      rationale: 'A URL already represented by a saved rejected QA case re-entered an actionable queue.',
    };
  }

  return null;
}

const riskRows = launchRows
  .map((row) => {
    const classification = classifyRisk(row);
    if (!classification) return null;
    return {
      family: row.family,
      stateId: row.stateId || '',
      url: row.url,
      domain: row.domain,
      launchNeedClass: row.launchNeedClass,
      scrapeLane: row.scrapeLane,
      riskClass: classification.riskClass,
      severity: classification.severity,
      recommendedLane: classification.recommendedLane,
      rationale: classification.rationale,
      sourceArtifacts: row.sourceArtifacts || [],
      doNotScrapeReason: row.doNotScrapeReason || '',
    };
  })
  .filter(Boolean)
  .sort((a, b) =>
    a.severity.localeCompare(b.severity)
    || a.riskClass.localeCompare(b.riskClass)
    || a.family.localeCompare(b.family)
    || a.stateId.localeCompare(b.stateId)
    || a.url.localeCompare(b.url),
  );

const queueSafety = {
  actionableRows: launchRows.filter((row) => actionableClasses.has(row.launchNeedClass)).length,
  actionableRiskRows: riskRows.filter((row) => actionableClasses.has(row.launchNeedClass)).length,
  readyTargetScrapeRows: launchRows.filter((row) => row.launchNeedClass === 'ready_target_scrape').length,
  readyTargetScrapeRiskRows: riskRows.filter((row) => row.launchNeedClass === 'ready_target_scrape').length,
  liveRefreshCandidateRows: launchRows.filter((row) => row.launchNeedClass === 'live_refresh_candidate').length,
  liveRefreshRiskRows: riskRows.filter((row) => row.launchNeedClass === 'live_refresh_candidate').length,
  placeholderReadyRows: riskRows.filter((row) => row.riskClass === 'ready_target_placeholder_domain').length,
  placeholderLiveRefreshRows: riskRows.filter((row) => row.riskClass === 'live_refresh_placeholder_domain').length,
  safeToSpendReadyScrapeVolume: riskRows.every((row) => row.riskClass !== 'ready_target_placeholder_domain'),
  safeToSpendLiveRefreshVolume: riskRows.filter((row) => row.launchNeedClass === 'live_refresh_candidate').length === 0,
};

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  purpose: 'Queue-side false-positive risk audit for launch scraper execution so scrape spend goes only to exact targets that do not resemble known placeholder, blocked-shell, or generic-shell patterns.',
  sourceArtifacts: {
    inventory: path.relative(repoRoot, path.join(docsDir, `launch-scrape-link-inventory-${generatedDate}.json`)),
    taxonomy: path.relative(repoRoot, path.join(docsDir, `launch-scraper-false-positive-taxonomy-${generatedDate}.json`)),
    qaPack: path.relative(repoRoot, path.join(docsDir, `launch-scraper-qa-pack-${generatedDate}.json`)),
  },
  launchFamilies,
  queueSafety,
  summary: {
    rowCount: riskRows.length,
    byRiskClass: sortObject(countBy(riskRows, 'riskClass')),
    byFamily: sortObject(countBy(riskRows, 'family')),
    byLaunchNeedClass: sortObject(countBy(riskRows, 'launchNeedClass')),
    bySeverity: sortObject(countBy(riskRows, 'severity')),
    byRecommendedLane: sortObject(countBy(riskRows, 'recommendedLane')),
  },
  riskRows,
};

const mdLines = [
  '# Launch Scraper Queue False-Positive Risk',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Queue Safety',
  '',
  ...Object.entries(queueSafety).map(([key, value]) => `- ${key}: ${value}`),
  '',
  '## Summary',
  '',
  `- rowCount: ${payload.summary.rowCount}`,
  `- byRiskClass: ${Object.entries(payload.summary.byRiskClass).map(([key, value]) => `${key}=${value}`).join(', ')}`,
  `- byFamily: ${Object.entries(payload.summary.byFamily).map(([key, value]) => `${key}=${value}`).join(', ')}`,
  `- byLaunchNeedClass: ${Object.entries(payload.summary.byLaunchNeedClass).map(([key, value]) => `${key}=${value}`).join(', ')}`,
  `- bySeverity: ${Object.entries(payload.summary.bySeverity).map(([key, value]) => `${key}=${value}`).join(', ')}`,
  `- byRecommendedLane: ${Object.entries(payload.summary.byRecommendedLane).map(([key, value]) => `${key}=${value}`).join(', ')}`,
  '',
  '## Highest Risk Queue Rows',
  '',
  '| risk class | severity | family | state | queue class | recommended lane | url |',
  '|---|---|---|---|---|---|---|',
  ...riskRows.slice(0, 100).map((row) => `| ${escapeCell(row.riskClass)} | ${row.severity} | ${row.family} | ${row.stateId || ''} | ${row.launchNeedClass} | ${row.recommendedLane} | ${escapeCell(row.url)} |`),
  '',
  '## Operator Rules',
  '',
  '- Spend scrape volume on `ready_target_scrape` only when `safeToSpendReadyScrapeVolume=true`.',
  '- Do not spend live-refresh volume while `placeholderLiveRefreshRows > 0`; repair or quarantine those URLs first.',
  '- Treat `generic_program_shell_risk` and `contactless_directory_shell_risk` as target-quality problems, not parser failures.',
];

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, JSON.stringify(payload, null, 2));
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(`wrote ${path.relative(repoRoot, jsonOutPath)}`);
console.log(`wrote ${path.relative(repoRoot, mdOutPath)}`);
