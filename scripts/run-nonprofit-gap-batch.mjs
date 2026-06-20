import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const plannerPath = path.join(docsDir, `nonprofit-gap-planner-${generatedDate}.json`);
const registryPath = path.join(repoRoot, 'data', 'nonprofit-link-registry', newestDir(path.join(repoRoot, 'data', 'nonprofit-link-registry')), 'registry.json');
const summaryPath = path.join(docsDir, `nonprofit-gap-batch-${generatedDate}.json`);
const mdPath = path.join(docsDir, `nonprofit-gap-batch-${generatedDate}.md`);

function newestDir(dir) {
  if (!fs.existsSync(dir)) return '';
  return fs.readdirSync(dir).sort().at(-1) || '';
}

function parseArgs(argv) {
  const args = {
    goal: 'nonprofit_local_in_person',
    domain: '',
    mode: 'dry-run',
    limitTargets: 25,
    maxPagesPerTarget: 8,
    allowNetwork: false,
    allowHighRisk: false,
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'goal' && value) args.goal = value;
    if (flag === 'domain' && value) args.domain = value.toLowerCase();
    if (flag === 'mode' && value) args.mode = value.toLowerCase();
    if (flag === 'limit-targets' && Number.isFinite(Number(value))) args.limitTargets = Number(value);
    if (flag === 'max-pages-per-target' && Number.isFinite(Number(value))) args.maxPagesPerTarget = Number(value);
    if (flag === 'allow-network') args.allowNetwork = true;
    if (flag === 'allow-high-risk') args.allowHighRisk = true;
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function runJson(commandArgs) {
  const raw = execFileSync('npm', commandArgs, {
    cwd: repoRoot,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  return JSON.parse(raw);
}

function getGoalConfig(planner, goalId) {
  return (planner.prioritizedPlan || []).find((gap) => gap.id === goalId);
}

function buildCandidateRows(registryEntries, goalConfig, args) {
  const allowedTypes = new Set(goalConfig.targetTypes || []);
  return registryEntries
    .filter((entry) => allowedTypes.has(entry.targetType))
    .filter((entry) => !args.domain || entry.host === args.domain || entry.familyKey === args.domain)
    .filter((entry) => args.allowHighRisk || entry.riskLevel !== 'high')
    .sort((a, b) =>
      Number(b.trustedMissingRows || 0) - Number(a.trustedMissingRows || 0) ||
      Number(b.rowCount || 0) - Number(a.rowCount || 0) ||
      String(a.seedUrl).localeCompare(String(b.seedUrl))
    )
    .slice(0, args.limitTargets);
}

function getRiskLevel(entry) {
  return entry.riskLevel || 'unknown';
}

function buildExpandArgs(args, candidates) {
  const primaryType = candidates[0]?.targetType || '';
  const domain = args.domain || candidates[0]?.familyKey || candidates[0]?.host || '';
  const expandArgs = [
    'run',
    'run:nonprofit-link-registry-expand',
    '--',
    `--limit-targets=${args.limitTargets}`,
    `--max-pages-per-target=${args.maxPagesPerTarget}`,
  ];

  if (primaryType && candidates.every((row) => row.targetType === primaryType)) {
    expandArgs.push(`--target-type=${primaryType}`);
  }
  if (domain) {
    expandArgs.push(`--domain=${domain}`);
  }

  return expandArgs;
}

const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(plannerPath)) {
  throw new Error(`Missing planner file: ${plannerPath}. Run npm run audit:nonprofit-gap-planner first.`);
}
if (!fs.existsSync(registryPath)) {
  throw new Error(`Missing registry file: ${registryPath}. Run npm run audit:nonprofit-link-registry first.`);
}

const planner = readJson(plannerPath);
const registry = readJson(registryPath);
const goalConfig = getGoalConfig(planner, args.goal);

if (!goalConfig) {
  throw new Error(`Unknown goal "${args.goal}". Expected one of: ${(planner.prioritizedPlan || []).map((gap) => gap.id).join(', ')}`);
}

const candidates = buildCandidateRows(registry.entries || [], goalConfig, args);
const projectedPages = candidates.length * args.maxPagesPerTarget;
const blockedForRisk = (registry.entries || []).filter((entry) =>
  (goalConfig.targetTypes || []).includes(entry.targetType) &&
  (!args.domain || entry.host === args.domain || entry.familyKey === args.domain) &&
  getRiskLevel(entry) === 'high'
).length;

let expansion = null;
let highSignal = null;

if (args.mode === 'live') {
  if (!args.allowNetwork) {
    throw new Error('Live mode requires --allow-network so networked scraping is always explicit.');
  }
  if (candidates.length === 0) {
    throw new Error('No candidate targets matched this goal/filter combination.');
  }

  expansion = runJson(buildExpandArgs(args, candidates));
  highSignal = runJson([
    'run',
    'audit:nonprofit-high-signal-pages',
    '--',
    `--input-path=${expansion.summaryPath}`,
    `--limit=${Math.max(projectedPages, 100)}`,
    ...(args.domain ? [`--domain=${args.domain}`] : []),
  ]);
}

const payload = {
  generatedAt: generatedDate,
  goal: goalConfig.id,
  mode: args.mode,
  filters: {
    domain: args.domain || null,
    limitTargets: args.limitTargets,
    maxPagesPerTarget: args.maxPagesPerTarget,
    allowHighRisk: args.allowHighRisk,
  },
  targetTypes: goalConfig.targetTypes,
  projectedPages,
  blockedForRisk,
  candidateCount: candidates.length,
  candidates: candidates.map((row) => ({
    id: row.id,
    targetType: row.targetType,
    seedUrl: row.seedUrl,
    host: row.host,
    familyKey: row.familyKey,
    trustedMissingRows: row.trustedMissingRows,
    rowCount: row.rowCount,
    riskLevel: getRiskLevel(row),
    scrapeStrategy: row.scrapeStrategy,
  })),
  expansion,
  highSignal,
};

const mdLines = [
  '# Nonprofit Gap Batch',
  '',
  `Generated: ${generatedDate}`,
  '',
  `- goal: ${goalConfig.id}`,
  `- mode: ${args.mode}`,
  `- target types: ${goalConfig.targetTypes.join(', ')}`,
  `- candidate targets: ${candidates.length}`,
  `- projected pages: ${projectedPages}`,
  `- blocked high-risk targets not included: ${blockedForRisk}`,
  '',
  '## Selected targets',
  '',
];

for (const row of payload.candidates.slice(0, 40)) {
  mdLines.push(`- ${row.seedUrl}: type=${row.targetType}, missing=${row.trustedMissingRows}, rows=${row.rowCount}, risk=${row.riskLevel}, strategy=${row.scrapeStrategy}`);
}

if (expansion) {
  mdLines.push('', '## Expansion summary', '');
  mdLines.push(`- expanded targets: ${expansion.targetCount}`);
  mdLines.push(`- unique discovered pages: ${expansion.uniqueDiscoveredPageCount}`);
  for (const [pageType, count] of Object.entries(expansion.pageTypeCounts || {}).sort((a, b) => b[1] - a[1])) {
    mdLines.push(`- ${pageType}: ${count}`);
  }
}

if (highSignal) {
  mdLines.push('', '## High-signal summary', '');
  mdLines.push(`- unique high-signal pages: ${highSignal.highSignalUniquePages}`);
  for (const [pageType, count] of Object.entries(highSignal.byType || {}).sort((a, b) => b[1] - a[1])) {
    mdLines.push(`- ${pageType}: ${count}`);
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(summaryPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  goal: goalConfig.id,
  mode: args.mode,
  candidateCount: candidates.length,
  projectedPages,
  blockedForRisk,
  summaryPath,
  mdPath,
  expansion: expansion
    ? {
        targetCount: expansion.targetCount,
        uniqueDiscoveredPageCount: expansion.uniqueDiscoveredPageCount,
        summaryPath: expansion.summaryPath,
      }
    : null,
  highSignal: highSignal
    ? {
        highSignalUniquePages: highSignal.highSignalUniquePages,
        report: highSignal.report,
      }
    : null,
}, null, 2));
