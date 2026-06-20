import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data', 'nonprofit-link-registry-expansions');
const generatedDate = new Date().toISOString().slice(0, 10);

function parseArgs(argv) {
  const args = {
    inputPath: '',
    limitTargets: 25,
    maxPagesPerTarget: 8,
    targetType: '',
    domain: '',
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'input-path') args.inputPath = value;
    if (flag === 'limit-targets' && Number.isFinite(Number(value))) args.limitTargets = Number(value);
    if (flag === 'max-pages-per-target' && Number.isFinite(Number(value))) args.maxPagesPerTarget = Number(value);
    if (flag === 'target-type') args.targetType = value;
    if (flag === 'domain') args.domain = value.toLowerCase();
  }
  return args;
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
  if (/\b(blog|news|post)\b/.test(value)) return 'news';
  return 'general';
}

function normalizeUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  parsed.hash = '';
  if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) {
    parsed.port = '';
  }
  if (parsed.pathname.endsWith('/') && parsed.pathname !== '/') parsed.pathname = parsed.pathname.slice(0, -1);
  return parsed.toString();
}

function getHost(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function extractInternalLinks(html, pageUrl, domain) {
  const links = new Set();
  const regex = /href\s*=\s*["']([^"'#]+)["']/gi;
  for (const match of html.matchAll(regex)) {
    const href = String(match[1] || '').trim();
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    try {
      const nextUrl = normalizeUrl(new URL(href, pageUrl).toString());
      const host = getHost(nextUrl);
      if (!host) continue;
      if (host !== domain && !host.endsWith(`.${domain}`)) continue;
      links.add(nextUrl);
    } catch {
      continue;
    }
  }
  return [...links];
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Ablefull link registry expander/1.0 (+https://ablefull.com)',
      'accept-language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(12000),
  });
  return {
    ok: response.ok,
    status: response.status,
    finalUrl: normalizeUrl(response.url || url),
    html: await response.text(),
  };
}

const args = parseArgs(process.argv.slice(2));
const registryPath = args.inputPath || path.join(dataDir.replace(/-expansions$/, ''), fs.readdirSync(path.join(repoRoot, 'data', 'nonprofit-link-registry')).sort().at(-1) || '', 'registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8')).entries || [];

let targets = registry;
if (args.targetType) targets = targets.filter((entry) => entry.targetType === args.targetType);
if (args.domain) targets = targets.filter((entry) => entry.familyKey === args.domain || entry.host === args.domain);
targets = targets.slice(0, args.limitTargets);

const runDir = path.join(dataDir, new Date().toISOString().replace(/[:.]/g, '-'));
fs.mkdirSync(runDir, { recursive: true });

const expandedTargets = [];
const discoveredPages = [];

for (const target of targets) {
  const domain = target.host;
  const queue = [target.seedUrl];
  const seen = new Set();
  const pages = [];
  const failures = [];

  while (queue.length > 0 && pages.length < args.maxPagesPerTarget) {
    const nextUrl = queue.shift();
    if (!nextUrl || seen.has(nextUrl)) continue;
    seen.add(nextUrl);

    try {
      const fetched = await fetchHtml(nextUrl);
      if (!fetched.ok) {
        failures.push({ url: nextUrl, status: fetched.status });
        continue;
      }
      const links = extractInternalLinks(fetched.html, fetched.finalUrl, domain);
      for (const link of links) {
        if (!seen.has(link) && !queue.includes(link) && queue.length < args.maxPagesPerTarget * 4) {
          queue.push(link);
        }
      }
      pages.push({
        url: fetched.finalUrl,
        pageTypeGuess: classifyPageType(fetched.finalUrl),
        discoveredLinkCount: links.length,
      });
      discoveredPages.push(...links.map((link) => ({
        parentSeedUrl: target.seedUrl,
        domain: target.host,
        url: link,
        pageTypeGuess: classifyPageType(link),
      })));
    } catch (error) {
      failures.push({ url: nextUrl, error: String(error.message || error) });
    }
  }

  expandedTargets.push({
    seedUrl: target.seedUrl,
    targetType: target.targetType,
    scrapeStrategy: target.scrapeStrategy,
    pagesFetched: pages.length,
    failures: failures.length,
    pageTypeCounts: pages.reduce((acc, page) => {
      acc[page.pageTypeGuess] = (acc[page.pageTypeGuess] || 0) + 1;
      return acc;
    }, {}),
  });

  fs.writeFileSync(path.join(runDir, `${target.id}.json`), `${JSON.stringify({ target, pages, failures }, null, 2)}\n`);
}

const uniqueDiscoveredPages = [...new Map(discoveredPages.map((page) => [page.url, page])).values()];
const pageTypeCounts = uniqueDiscoveredPages.reduce((acc, page) => {
  acc[page.pageTypeGuess] = (acc[page.pageTypeGuess] || 0) + 1;
  return acc;
}, {});

const payload = {
  generatedAt: generatedDate,
  inputPath: registryPath,
  targetCount: targets.length,
  expandedTargets,
  uniqueDiscoveredPageCount: uniqueDiscoveredPages.length,
  pageTypeCounts,
  pages: uniqueDiscoveredPages,
};

const summaryPath = path.join(runDir, 'summary.json');
const pagesPath = path.join(runDir, 'discovered-pages.json');
const mdOutPath = path.join(docsDir, `nonprofit-link-registry-expansion-${generatedDate}.md`);

fs.writeFileSync(summaryPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(pagesPath, `${JSON.stringify(uniqueDiscoveredPages, null, 2)}\n`);

const mdLines = [
  '# Nonprofit Link Registry Expansion',
  '',
  `Generated: ${generatedDate}`,
  '',
  `- targets expanded: ${targets.length}`,
  `- unique discovered pages: ${uniqueDiscoveredPages.length}`,
  '',
  '## Page type counts',
  '',
];

for (const [type, count] of Object.entries(pageTypeCounts).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${type}: ${count}`);
}

mdLines.push('', '## Expanded targets', '');
for (const target of expandedTargets.slice(0, 25)) {
  mdLines.push(`- ${target.seedUrl}: fetched=${target.pagesFetched}, failures=${target.failures}, pageTypes=${Object.entries(target.pageTypeCounts).map(([k, v]) => `${k}:${v}`).join(', ') || 'none'}`);
}

fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  targetCount: targets.length,
  uniqueDiscoveredPageCount: uniqueDiscoveredPages.length,
  pageTypeCounts,
  report: mdOutPath,
  summaryPath,
  pagesPath,
}, null, 2));
