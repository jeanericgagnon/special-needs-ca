import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const expansionRoot = path.join(repoRoot, 'data', 'nonprofit-link-registry-expansions');
const generatedDate = new Date().toISOString().slice(0, 10);

function parseArgs(argv) {
  const args = {
    inputPath: '',
    domain: '',
    limit: 300,
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'input-path') args.inputPath = value;
    if (flag === 'domain') args.domain = value.toLowerCase();
    if (flag === 'limit' && Number.isFinite(Number(value))) args.limit = Number(value);
  }
  return args;
}

function latestFile(dir, fileName) {
  if (!fs.existsSync(dir)) return null;
  const dirs = fs.readdirSync(dir).sort();
  const last = dirs.at(-1);
  if (!last) return null;
  const full = path.join(dir, last, fileName);
  return fs.existsSync(full) ? full : null;
}

const args = parseArgs(process.argv.slice(2));
const inputPath = args.inputPath || latestFile(expansionRoot, 'summary.json');
if (!inputPath) {
  throw new Error('No expansion summary found. Run the link registry expansion first.');
}

const expansion = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const pagesPath = path.join(path.dirname(inputPath), 'discovered-pages.json');
const pages = fs.existsSync(pagesPath) ? JSON.parse(fs.readFileSync(pagesPath, 'utf8')) : [];

const highSignalTypes = new Set(['contact', 'about', 'services', 'location', 'events', 'affiliate']);
const filtered = pages.filter((page) => {
  if (args.domain && String(page.domain || '').toLowerCase() !== args.domain) return false;
  return highSignalTypes.has(String(page.pageTypeGuess || ''));
});

const unique = [...new Map(filtered.map((page) => [page.url, page])).values()];
const byType = unique.reduce((acc, page) => {
  acc[page.pageTypeGuess] = (acc[page.pageTypeGuess] || 0) + 1;
  return acc;
}, {});
const bySeed = unique.reduce((acc, page) => {
  acc[page.parentSeedUrl] = (acc[page.parentSeedUrl] || 0) + 1;
  return acc;
}, {});

const topSeeds = Object.entries(bySeed)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 25)
  .map(([seedUrl, count]) => ({ seedUrl, count }));

const prioritized = unique
  .map((page) => ({
    ...page,
    priority:
      page.pageTypeGuess === 'contact' ? 6 :
      page.pageTypeGuess === 'location' ? 5 :
      page.pageTypeGuess === 'services' ? 4 :
      page.pageTypeGuess === 'about' ? 3 :
      page.pageTypeGuess === 'events' ? 2 : 1,
  }))
  .sort((a, b) => b.priority - a.priority || a.url.localeCompare(b.url))
  .slice(0, args.limit);

const payload = {
  generatedAt: generatedDate,
  inputPath,
  totalExpandedPages: pages.length,
  highSignalUniquePages: unique.length,
  byType,
  topSeeds,
  prioritizedPages: prioritized,
};

const jsonOutPath = path.join(docsDir, `nonprofit-high-signal-pages-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `nonprofit-high-signal-pages-${generatedDate}.md`);

const mdLines = [
  '# Nonprofit High-Signal Pages',
  '',
  `Generated: ${generatedDate}`,
  '',
  `- total expanded pages seen: ${pages.length}`,
  `- unique high-signal pages: ${unique.length}`,
  '',
  '## Type counts',
  '',
];

for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${type}: ${count}`);
}

mdLines.push('', '## Top seeds by high-signal page count', '');
for (const row of topSeeds) {
  mdLines.push(`- ${row.seedUrl}: ${row.count}`);
}

mdLines.push('', '## Prioritized pages', '');
for (const page of prioritized.slice(0, 40)) {
  mdLines.push(`- ${page.pageTypeGuess}: ${page.url} (parent=${page.parentSeedUrl})`);
}

fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  inputPath,
  highSignalUniquePages: unique.length,
  byType,
  topSeeds,
  report: mdOutPath,
  json: jsonOutPath,
}, null, 2));
