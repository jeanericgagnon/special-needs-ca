import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const stateDir = path.join(repoRoot, 'data', 'source-acquisition-state');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-authoring-backlog-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-authoring-backlog-${generatedDate}.md`);
const MIN_PROVIDER_DEPTH = 3;
const ledgerPath = path.join(stateDir, 'provider-authoring-ledger.json');

const PLACEHOLDER_PROVIDER_DOMAINS = new Set([
  'childrenshospital.org',
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath, fallback) {
  return fs.existsSync(filePath) ? readJson(filePath) : fallback;
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated artifact for prefix: ${prefix}`);
  }
  return path.join(docsDir, matches.at(-1));
}

function normalizeDomain(value) {
  return String(value || '').trim().replace(/^www\./, '').toLowerCase();
}

function looksSyntheticProviderRoster(target) {
  const sourceUrl = String(target.source_url || '').trim();
  const sourceName = String(target.source_name || '').toLowerCase();
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

function classifyProviderTarget(target) {
  const domain = normalizeDomain(target.domain);
  const name = String(target.source_name || '');
  const method = String(target.crawl_method || '');

  const isPlaceholder =
    PLACEHOLDER_PROVIDER_DOMAINS.has(domain) ||
    looksSyntheticProviderRoster(target) ||
    /children'?s hospital clinics/i.test(name);

  const isDirectoryLike =
    String(target.organization_type || '').includes('directory') ||
    /roster|directory/i.test(name);

  const isConcreteFirstParty =
    !isPlaceholder &&
    !isDirectoryLike &&
    ['static_fetch', 'playwright', 'pdf_extract'].includes(method);

  return {
    domain,
    isPlaceholder,
    isDirectoryLike,
    isConcreteFirstParty,
  };
}

function loadStateSourceTargets(stateId) {
  const filePath = path.join(sourceTargetsDir, `${stateId}.json`);
  if (!fs.existsSync(filePath)) {
    return {
      exists: false,
      filePath,
      rows: [],
    };
  }
  const rows = readJson(filePath);
  return {
    exists: true,
    filePath,
    rows: Array.isArray(rows) ? rows : [],
  };
}

const buildoutPath = latestGeneratedJson('provider-buildout-priority-plan-');
const sourcePackPath = latestGeneratedJson('provider-source-pack-plan-');
const buildout = readJson(buildoutPath);
const sourcePack = readJson(sourcePackPath);
const ledger = readJsonIfExists(ledgerPath, { rows: [] });
const ledgerByStateId = new Map(
  (ledger.rows || []).map((row) => [String(row.stateId || '').trim().toLowerCase(), row]),
);
const completedStates = new Set(
  (ledger.rows || [])
    .filter((row) => String(row?.status || '').trim() === 'complete')
    .map((row) => String(row?.stateId || '').trim().toLowerCase())
    .filter(Boolean),
);
const sourcePackByStateId = new Map((sourcePack.states || []).map((state) => [state.stateId, state]));

const candidateStates = [
  ...(buildout.lanes?.remediation || []),
  ...(buildout.lanes?.validation || []),
];

const rows = candidateStates.map((state) => {
  const stateId = String(state.stateId || '').trim().toLowerCase();
  const sourceTargets = loadStateSourceTargets(stateId);
  const providerTargets = sourceTargets.rows
    .filter((target) => target.target_table === 'resource_providers')
    .map((target) => ({ ...target, ...classifyProviderTarget(target) }));
  const supportTargetCounts = {
    nonprofit: sourceTargets.rows.filter((target) => target.target_table === 'nonprofit_organizations').length,
    dd: sourceTargets.rows.filter((target) => target.target_table === 'state_resource_agencies').length,
    office: sourceTargets.rows.filter((target) => target.target_table === 'county_offices').length,
    trust: sourceTargets.rows.filter((target) => target.target_table === 'sources').length,
  };
  const concreteProviderTargetCount = providerTargets.filter((target) => target.isConcreteFirstParty).length;
  const placeholderProviderTargetCount = providerTargets.filter((target) => target.isPlaceholder).length;
  const directoryProviderTargetCount = providerTargets.filter((target) => target.isDirectoryLike && !target.isPlaceholder).length;
  const sourcePackState = sourcePackByStateId.get(stateId) || null;
  const neededConcreteTargets = Math.max(0, MIN_PROVIDER_DEPTH - concreteProviderTargetCount);
  const neededLiveProviderRows = Math.max(0, MIN_PROVIDER_DEPTH - Number(state.publicSafeProviders || 0));
  const authoringGapClass = neededConcreteTargets > 0
    ? 'missing_concrete_targets'
    : neededLiveProviderRows > 0
      ? 'needs_refresh_or_deeper_targets'
      : 'none';

  return {
    executionPriority: 0,
    stateId,
    stateName: state.stateName,
    countyCount: Number(state.countyCount || 0),
    publicSafeProviders: Number(state.publicSafeProviders || 0),
    totalProviderRows: Number(state.totalProviderRows || 0),
    providerTruthScore: Number(state.providerTruthScore || 0),
    publicSafeNonprofits: Number(state.publicSafeNonprofits || 0),
    advocatePublicSafeCount: Number(state.advocatePublicSafeCount || 0),
    sourceTargetsPath: sourceTargets.exists ? path.relative(repoRoot, sourceTargets.filePath) : '',
    sourceTargetsExists: sourceTargets.exists,
    providerTargetCount: providerTargets.length,
    concreteProviderTargetCount,
    placeholderProviderTargetCount,
    directoryProviderTargetCount,
    supportTargetCounts,
    ledgerStatus: ledgerByStateId?.get?.(stateId)?.status || '',
    ledgerNote: ledgerByStateId?.get?.(stateId)?.note || '',
    currentReadinessLane: sourcePackState?.readinessLane || 'author-targets-first',
    neededConcreteTargets,
    neededLiveProviderRows,
    authoringGapClass,
    nextAction: !sourceTargets.exists
      ? `Create ${state.stateName} source_targets file with at least ${MIN_PROVIDER_DEPTH} concrete first-party provider targets and then regenerate provider source-pack artifacts.`
      : neededConcreteTargets > 0
        ? `Add at least ${neededConcreteTargets} more concrete first-party provider targets for ${state.stateName} and then regenerate provider source-pack artifacts.`
        : `Refresh ${state.stateName} provider targets and add deeper first-party sources until at least ${MIN_PROVIDER_DEPTH} public-safe provider rows exist.`,
  };
})
  .filter((row) => row.neededConcreteTargets > 0 || row.neededLiveProviderRows > 0)
  .map((row, index) => ({
    ...row,
    executionPriority: index + 1,
  }));

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    providerBuildoutPriorityPath: path.relative(repoRoot, buildoutPath),
    providerSourcePackPlanPath: path.relative(repoRoot, sourcePackPath),
    sourceTargetsDir: path.relative(repoRoot, sourceTargetsDir),
    providerAuthoringLedgerPath: path.relative(repoRoot, ledgerPath),
  },
  summary: {
    totalRows: rows.length,
    statesMissingSourceTargets: rows.filter((row) => !row.sourceTargetsExists).length,
    statesBelowConcreteThreshold: rows.filter((row) => row.concreteProviderTargetCount < MIN_PROVIDER_DEPTH).length,
    statesBelowLiveProviderThreshold: rows.filter((row) => row.publicSafeProviders < MIN_PROVIDER_DEPTH).length,
    completedStatesPresent: completedStates.size,
    firstState: rows[0]?.stateId || '',
  },
  rows,
};

const mdLines = [
  '# Provider Authoring Backlog',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  'Deterministic state backlog for provider-directory authoring when fetchable provider queues are exhausted but national provider depth is still below threshold.',
  '',
  '## Summary',
  '',
  `- total rows: ${payload.summary.totalRows}`,
  `- states missing source targets: ${payload.summary.statesMissingSourceTargets}`,
  `- states below concrete target threshold: ${payload.summary.statesBelowConcreteThreshold}`,
  `- completed states present in ledger: ${payload.summary.completedStatesPresent}`,
  `- first state: ${payload.summary.firstState || 'none'}`,
  '',
  '## Backlog',
  '',
];

for (const row of rows.slice(0, 25)) {
  mdLines.push(`- P${row.executionPriority} ${row.stateId}: concrete=${row.concreteProviderTargetCount}, providerRows=${row.publicSafeProviders}/${row.totalProviderRows}, sourceTargets=${row.sourceTargetsExists ? 'yes' : 'no'}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  summary: payload.summary,
}, null, 2));
