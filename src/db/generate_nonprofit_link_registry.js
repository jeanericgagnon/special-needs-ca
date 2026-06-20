import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data', 'nonprofit-link-registry');
const generatedDate = new Date().toISOString().slice(0, 10);
const queuePath = path.join(docsDir, `nonprofit-scrape-queue-${generatedDate}.json`);
const arcAffiliatePath = path.join(docsDir, `nonprofit-affiliate-discovery-thearc-org-${generatedDate}.json`);
const parentCenterAffiliatePath = path.join(docsDir, `nonprofit-affiliate-discovery-parentcenterhub-org-${generatedDate}.json`);
const runDir = path.join(dataDir, new Date().toISOString().replace(/[:.]/g, '-'));
const jsonOutPath = path.join(runDir, 'registry.json');
const mdOutPath = path.join(docsDir, `nonprofit-link-registry-${generatedDate}.md`);
const summaryPath = path.join(runDir, 'summary.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown';
}

function getHost(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function normalizeCanonicalUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  parsed.hash = '';
  if (parsed.pathname.endsWith('/') && parsed.pathname !== '/') {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }
  return parsed.toString();
}

function classifyPageType(url) {
  const value = String(url || '').toLowerCase();
  if (/\b(contact|contact-us)\b/.test(value)) return 'contact';
  if (/\b(about|mission|history|leadership)\b/.test(value)) return 'about';
  if (/\b(location|office|visit|directions)\b/.test(value)) return 'location';
  if (/\b(event|training|workshop|calendar)\b/.test(value)) return 'events';
  if (/\b(service|program|support|resource)\b/.test(value)) return 'services';
  if (/\b(chapter|affiliate|center)\b/.test(value)) return 'affiliate';
  if (/\b(directory|find-a-chapter|map_id)\b/.test(value)) return 'directory';
  return 'general';
}

function basePriority(targetType, trustedMissingRows, rowCount) {
  const coverageWeight = Number(trustedMissingRows || 0) + Number(rowCount || 0);
  if (targetType === 'affiliate_chapter') return 3000 + coverageWeight;
  if (targetType === 'affiliate_site') return 2800 + coverageWeight;
  if (targetType === 'statewide_service_org') return 2400 + coverageWeight;
  if (targetType === 'site_path') return 2200 + coverageWeight;
  if (targetType === 'single_site') return 2000 + coverageWeight;
  if (targetType === 'state_listing_page') return 1500 + coverageWeight;
  if (targetType === 'network_directory') return 1000 + coverageWeight;
  return 500 + coverageWeight;
}

ensureDir(runDir);

const queuePayload = readJson(queuePath);
const queue = queuePayload.queue || queuePayload.topQueue || [];
const arcAffiliates = fs.existsSync(arcAffiliatePath) ? readJson(arcAffiliatePath).affiliates || [] : [];
const parentCenterAffiliates = fs.existsSync(parentCenterAffiliatePath) ? readJson(parentCenterAffiliatePath).affiliates || [] : [];

const registry = new Map();

function addEntry(entry) {
  const normalizedSeedUrl = normalizeCanonicalUrl(entry.seedUrl);
  const key = normalizedSeedUrl;
  const current = registry.get(key);
  if (!current) {
    registry.set(key, {
      ...entry,
      seedUrl: normalizedSeedUrl,
    });
    return;
  }
  current.sources = [...new Set([...current.sources, ...entry.sources])];
  current.rowCount = Math.max(current.rowCount, entry.rowCount);
  current.trustedMissingRows = Math.max(current.trustedMissingRows, entry.trustedMissingRows);
  current.priorityScore = Math.max(current.priorityScore, entry.priorityScore);
  current.stateIds = [...new Set([...current.stateIds, ...entry.stateIds])].sort();
}

for (const target of queue) {
  addEntry({
    id: `registry-${slugify(target.key)}`,
    familyKey: target.domain,
    host: getHost(target.sampleUrl) || target.domain,
    seedUrl: target.sampleUrl,
    targetType: target.targetType === 'affiliate_chapter' ? 'affiliate_chapter' :
      target.targetType === 'network_directory' ? 'network_directory' :
        target.targetType === 'statewide_service_org' ? 'statewide_service_org' :
          target.targetType === 'site_path' ? 'site_path' : 'single_site',
    scrapeStrategy: target.scrapeStrategy,
    sourcePageType: classifyPageType(target.sampleUrl),
    rowCount: target.rowCount,
    trustedMissingRows: target.trustedMissingRows,
    stateIds: target.states || [],
    sources: ['scrape_queue'],
    priorityScore: basePriority(target.targetType, target.trustedMissingRows, target.rowCount),
  });
}

for (const target of arcAffiliates) {
  addEntry({
    id: `registry-${slugify(target.affiliateUrl)}`,
    familyKey: 'thearc.org',
    host: getHost(target.affiliateUrl) || 'thearc.org',
    seedUrl: target.affiliateUrl,
    targetType: 'affiliate_chapter',
    scrapeStrategy: 'site_path',
    sourcePageType: classifyPageType(target.affiliateUrl),
    rowCount: target.rowCount || 0,
    trustedMissingRows: target.rowCount || 0,
    stateIds: [],
    sources: target.discoverySources || ['affiliate_discovery'],
    priorityScore: basePriority('affiliate_chapter', target.rowCount || 0, target.rowCount || 0),
  });
}

for (const target of parentCenterAffiliates) {
  const isListing = /parentcenterhub\.org\/index\.php\?map_id=0&usterritorieshtml5map_get_state_info=/i.test(target.affiliateUrl);
  addEntry({
    id: `registry-${slugify(target.affiliateUrl)}`,
    familyKey: 'parentcenterhub.org',
    host: getHost(target.affiliateUrl) || 'parentcenterhub.org',
    seedUrl: target.affiliateUrl,
    targetType: isListing ? 'state_listing_page' : 'affiliate_site',
    scrapeStrategy: isListing ? 'listing_miner' : 'site_path',
    sourcePageType: classifyPageType(target.affiliateUrl),
    rowCount: target.rowCount || 0,
    trustedMissingRows: target.rowCount || 0,
    stateIds: [],
    sources: target.discoverySources || ['affiliate_discovery'],
    priorityScore: basePriority(isListing ? 'state_listing_page' : 'affiliate_site', target.rowCount || 0, target.rowCount || 0),
  });
}

const entries = [...registry.values()]
  .sort((a, b) => b.priorityScore - a.priorityScore || a.seedUrl.localeCompare(b.seedUrl));

const projected10kPages = entries.slice(0, 800).reduce((sum, entry) => {
  if (entry.targetType === 'affiliate_chapter' || entry.targetType === 'affiliate_site') return sum + 20;
  if (entry.targetType === 'statewide_service_org' || entry.targetType === 'single_site' || entry.targetType === 'site_path') return sum + 12;
  if (entry.targetType === 'state_listing_page') return sum + 6;
  return sum + 4;
}, 0);

const payload = {
  generatedAt: generatedDate,
  registryEntryCount: entries.length,
  projected10kPages,
  entries,
};

const mdLines = [
  '# Nonprofit Link Registry',
  '',
  `Generated: ${generatedDate}`,
  '',
  `- registry entries: ${entries.length}`,
  `- projected candidate pages from top 400 targets: ${projected10kPages}`,
  '',
  'This registry is the low-token control plane for nonprofit crawling. It stores real scrape targets before any deep extraction and ranks them for expansion.',
  '',
  '## Highest-priority targets',
  '',
  '| Seed URL | Type | Strategy | Missing Rows | Priority |',
  '| --- | --- | --- | ---: | ---: |',
];

for (const entry of entries.slice(0, 25)) {
  mdLines.push(`| ${entry.seedUrl} | ${entry.targetType} | ${entry.scrapeStrategy} | ${entry.trustedMissingRows} | ${entry.priorityScore} |`);
}

mdLines.push('', '## Type breakdown', '');
const typeCounts = entries.reduce((acc, entry) => {
  acc[entry.targetType] = (acc[entry.targetType] || 0) + 1;
  return acc;
}, {});
for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${type}: ${count}`);
}

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(summaryPath, `${JSON.stringify({
  generatedAt: generatedDate,
  registryEntryCount: entries.length,
  projected10kPages,
  topEntries: entries.slice(0, 20),
}, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  registryEntryCount: entries.length,
  projected10kPages,
  report: mdOutPath,
  registryPath: jsonOutPath,
  summaryPath,
  topEntries: entries.slice(0, 10).map((entry) => ({
    seedUrl: entry.seedUrl,
    targetType: entry.targetType,
    scrapeStrategy: entry.scrapeStrategy,
    trustedMissingRows: entry.trustedMissingRows,
    priorityScore: entry.priorityScore,
  })),
}, null, 2));
