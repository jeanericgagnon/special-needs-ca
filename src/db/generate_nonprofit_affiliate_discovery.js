import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data', 'nonprofit-affiliate-discovery');
const generatedDate = new Date().toISOString().slice(0, 10);

function parseArgs(argv) {
  const args = {
    domain: '',
    fixturePath: '',
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'domain') args.domain = value.toLowerCase();
    if (flag === 'fixture-path') args.fixturePath = value;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
if (!args.domain) {
  throw new Error('Usage: node src/db/generate_nonprofit_affiliate_discovery.js --domain=thearc.org');
}

const db = new Database(dbPath, { readonly: true });
const domainSlug = args.domain.replace(/[^a-z0-9]+/g, '-');
const runDir = path.join(dataDir, domainSlug, new Date().toISOString().replace(/[:.]/g, '-'));
const mdOutPath = path.join(docsDir, `nonprofit-affiliate-discovery-${domainSlug}-${generatedDate}.md`);
const jsonOutPath = path.join(docsDir, `nonprofit-affiliate-discovery-${domainSlug}-${generatedDate}.json`);
fs.mkdirSync(runDir, { recursive: true });
fs.mkdirSync(docsDir, { recursive: true });

function getHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function normalizeUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  parsed.hash = '';
  if (parsed.pathname.endsWith('/') && parsed.pathname !== '/') {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }
  return parsed.toString();
}

function decodeHtml(text) {
  return String(text || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function extractLinks(html, pageUrl) {
  const links = [];
  const regex = /href\s*=\s*["']([^"'#]+)["']/gi;
  for (const match of html.matchAll(regex)) {
    const href = String(match[1] || '').trim();
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    try {
      links.push(normalizeUrl(new URL(href, pageUrl).toString()));
    } catch {
      continue;
    }
  }
  return [...new Set(links)];
}

async function fetchText(url) {
  if (args.fixturePath) return fs.readFileSync(args.fixturePath, 'utf8');
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Ablefull affiliate discovery bot/1.0 (+https://ablefull.com)',
      'accept-language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(12000),
  });
  return response.text();
}

function extractTheArcAffiliates(html) {
  const pageUrl = 'https://thearc.org/find-a-chapter/';
  return extractLinks(html, pageUrl)
    .filter((url) => /^https:\/\/thearc\.org\/chapter\//.test(url))
    .map((url) => ({ affiliateUrl: url, discoveryType: 'chapter_path_link' }));
}

function extractParentCenterAffiliates(html, listingUrl) {
  const blockedHosts = new Set([
    'elegantthemes.com',
    'wordpress.org',
    'fonts.gstatic.com',
    'stats.wp.com',
    'twitter.com',
    'x.com',
    'facebook.com',
    'youtube.com',
    'youtube.com',
  ]);
  const links = extractLinks(html, listingUrl);
  return links
    .filter((url) => {
      const host = getHost(url);
      if (!host) return false;
      if (host === 'parentcenterhub.org') return false;
      if (host.endsWith('.parentcenterhub.org')) return false;
      if (blockedHosts.has(host)) return false;
      return true;
    })
    .map((url) => ({ affiliateUrl: url, discoveryType: 'state_listing_outbound_link' }));
}

const domainRows = db.prepare(`
  SELECT source_url, website, name, county_id
  FROM nonprofit_organizations
  WHERE verification_status IN ('official_verified','verified','human_verified','source_listed')
    AND LOWER(COALESCE(source_url, '')) LIKE ?
`).all(`%${args.domain}%`);

const dbAffiliates = new Map();
if (args.domain === 'thearc.org') {
  for (const row of domainRows) {
    if (!row.source_url) continue;
    if (!/^https:\/\/thearc\.org\/chapter\//.test(row.source_url)) continue;
    const entry = dbAffiliates.get(row.source_url) || {
      affiliateUrl: row.source_url,
      discoveryType: 'db_chapter_url',
      rowCount: 0,
      names: new Set(),
      counties: new Set(),
    };
    entry.rowCount += 1;
    if (row.name) entry.names.add(row.name);
    if (row.county_id) entry.counties.add(row.county_id);
    dbAffiliates.set(row.source_url, entry);
  }
} else if (args.domain === 'parentcenterhub.org') {
  for (const row of domainRows) {
    const url = row.source_url;
    const entry = dbAffiliates.get(url) || {
      affiliateUrl: url,
      discoveryType: 'db_state_listing_url',
      rowCount: 0,
      names: new Set(),
      counties: new Set(),
    };
    entry.rowCount += 1;
    if (row.name) entry.names.add(row.name);
    if (row.county_id) entry.counties.add(row.county_id);
    dbAffiliates.set(url, entry);
  }
}

let fetchedSeed = null;
let discoveredLinks = [];

if (args.domain === 'thearc.org') {
  fetchedSeed = 'https://thearc.org/find-a-chapter/';
  const html = await fetchText(fetchedSeed);
  fs.writeFileSync(path.join(runDir, 'seed.html'), html);
  discoveredLinks = extractTheArcAffiliates(html);
} else if (args.domain === 'parentcenterhub.org') {
  const topListing = [...dbAffiliates.values()].sort((a, b) => b.rowCount - a.rowCount)[0];
  if (topListing) {
    fetchedSeed = topListing.affiliateUrl;
    const html = await fetchText(fetchedSeed);
    fs.writeFileSync(path.join(runDir, 'seed.html'), html);
    discoveredLinks = extractParentCenterAffiliates(html, fetchedSeed);
  }
}

const merged = new Map();
for (const entry of dbAffiliates.values()) {
  merged.set(entry.affiliateUrl, {
    affiliateUrl: entry.affiliateUrl,
    discoverySources: [entry.discoveryType],
    rowCount: entry.rowCount,
    nameCount: entry.names.size,
    countyCount: entry.counties.size,
  });
}
for (const entry of discoveredLinks) {
  const current = merged.get(entry.affiliateUrl) || {
    affiliateUrl: entry.affiliateUrl,
    discoverySources: [],
    rowCount: 0,
    nameCount: 0,
    countyCount: 0,
  };
  current.discoverySources = [...new Set([...current.discoverySources, entry.discoveryType])];
  merged.set(entry.affiliateUrl, current);
}

const affiliates = [...merged.values()].sort((a, b) => b.rowCount - a.rowCount || a.affiliateUrl.localeCompare(b.affiliateUrl));

const payload = {
  generatedAt: generatedDate,
  domain: args.domain,
  seedUrl: fetchedSeed,
  dbAffiliateCount: dbAffiliates.size,
  discoveredLinkCount: discoveredLinks.length,
  mergedAffiliateCount: affiliates.length,
  affiliates,
};

const mdLines = [
  '# Nonprofit Affiliate Discovery',
  '',
  `Generated: ${generatedDate}`,
  '',
  `Domain: ${args.domain}`,
  '',
  `- seed URL: ${fetchedSeed || 'none'}`,
  `- db affiliate-like targets: ${dbAffiliates.size}`,
  `- newly discovered outbound or chapter links: ${discoveredLinks.length}`,
  `- merged affiliate scrape targets: ${affiliates.length}`,
  '',
  '## Top affiliate targets',
  '',
];

for (const row of affiliates.slice(0, 25)) {
  mdLines.push(`- ${row.affiliateUrl}: rows=${row.rowCount}, names=${row.nameCount}, counties=${row.countyCount}, sources=${row.discoverySources.join(', ')}`);
}

fs.writeFileSync(path.join(runDir, 'affiliates.json'), `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  domain: args.domain,
  seedUrl: fetchedSeed,
  dbAffiliateCount: dbAffiliates.size,
  discoveredLinkCount: discoveredLinks.length,
  mergedAffiliateCount: affiliates.length,
  report: mdOutPath,
  artifacts: runDir,
  sampleAffiliates: affiliates.slice(0, 10).map((row) => ({
    affiliateUrl: row.affiliateUrl,
    rowCount: row.rowCount,
    discoverySources: row.discoverySources,
  })),
}, null, 2));
