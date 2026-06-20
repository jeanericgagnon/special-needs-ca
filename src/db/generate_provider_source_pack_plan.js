import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const generatedDir = path.join(repoRoot, 'docs', 'generated');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const generatedDate = new Date().toISOString().slice(0, 10);
const outJsonPath = path.join(generatedDir, `provider-source-pack-plan-${generatedDate}.json`);
const outMdPath = path.join(generatedDir, `provider-source-pack-plan-${generatedDate}.md`);

const PLACEHOLDER_PROVIDER_DOMAINS = new Set([
  'childrenshospital.org',
]);

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

function findLatestGeneratedJson(prefix) {
  const entries = fs.existsSync(generatedDir)
    ? fs.readdirSync(generatedDir)
      .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
      .sort()
    : [];

  if (entries.length === 0) {
    throw new Error(`Missing generated artifact for prefix: ${prefix}`);
  }

  return path.join(generatedDir, entries[entries.length - 1]);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeDomain(value) {
  return String(value || '').trim().replace(/^www\./, '').toLowerCase();
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

function pickTopStates(plan) {
  return (plan.lanes?.missingProviderSorted || [])
    .filter((state) => state.stateId !== 'california')
    .filter((state) => fs.existsSync(path.join(sourceTargetsDir, `${state.stateId}.json`)))
    .slice(0, 10);
}

function supportTargetsForState(targets) {
  return {
    nonprofit: targets.filter((target) => target.target_table === 'nonprofit_organizations'),
    trust: targets.filter((target) => target.target_table === 'sources'),
    dd: targets.filter((target) => target.target_table === 'state_resource_agencies'),
    office: targets.filter((target) => target.target_table === 'county_offices'),
  };
}

const providerPlanPath = findLatestGeneratedJson('provider-buildout-priority-plan-');
const providerPlan = readJson(providerPlanPath);
const sourcePackStates = pickTopStates(providerPlan);

const states = sourcePackStates.map((state) => {
  const sourceTargetsPath = path.join(sourceTargetsDir, `${state.stateId}.json`);
  const sourceTargets = readJson(sourceTargetsPath);
  const providerTargets = sourceTargets
    .filter((target) => target.target_table === 'resource_providers')
    .map((target) => ({
      ...target,
      ...classifyProviderTarget(target),
    }));
  const supportTargets = supportTargetsForState(sourceTargets);

  const concreteProviderTargets = providerTargets.filter((target) => target.isConcreteFirstParty);
  const placeholderProviderTargets = providerTargets.filter((target) => target.isPlaceholder);
  const directoryProviderTargets = providerTargets.filter((target) => target.isDirectoryLike && !target.isPlaceholder);

  let readinessLane = 'author-targets-first';
  if (concreteProviderTargets.length >= 3) readinessLane = 'pull-now';
  else if (concreteProviderTargets.length >= 1) readinessLane = 'limited-pull-now';
  else if (placeholderProviderTargets.length > 0 || directoryProviderTargets.length > 0) readinessLane = 'replace-placeholders-first';

  const nextMove =
    readinessLane === 'pull-now'
      ? 'Start first-party pulls from the concrete clinic and hospital targets already in source_targets.'
      : readinessLane === 'limited-pull-now'
        ? 'Use the small concrete provider set first, then author 2-5 more state-specific hospital or university clinic targets before scaling.'
        : readinessLane === 'replace-placeholders-first'
          ? 'Replace the generic placeholder provider target with named first-party state hospital, university, or autism center targets before any provider crawl.'
          : 'Author provider source targets first; current source inventory is not specific enough to support safe provider promotion.';

  return {
    ...state,
    sourceTargetsPath: path.relative(repoRoot, sourceTargetsPath),
    providerTargetCount: providerTargets.length,
    concreteProviderTargetCount: concreteProviderTargets.length,
    placeholderProviderTargetCount: placeholderProviderTargets.length,
    directoryProviderTargetCount: directoryProviderTargets.length,
    supportTargetCounts: {
      nonprofit: supportTargets.nonprofit.length,
      trust: supportTargets.trust.length,
      dd: supportTargets.dd.length,
      office: supportTargets.office.length,
    },
    readinessLane,
    nextMove,
    concreteProviderTargets,
    placeholderProviderTargets,
    directoryProviderTargets,
    supportTargets,
  };
});

const readinessGroups = {
  pullNow: states.filter((state) => state.readinessLane === 'pull-now'),
  limitedPullNow: states.filter((state) => state.readinessLane === 'limited-pull-now'),
  replacePlaceholdersFirst: states.filter((state) => state.readinessLane === 'replace-placeholders-first'),
  authorTargetsFirst: states.filter((state) => state.readinessLane === 'author-targets-first'),
};

const report = {
  generatedAt: generatedDate,
  sources: {
    providerPlan: path.relative(repoRoot, providerPlanPath),
    sourceTargetsDir: path.relative(repoRoot, sourceTargetsDir),
  },
  californiaNote: {
    stateId: 'california',
    includedInTopMissing: true,
    includedInSourcePack: false,
    reason: 'California remains a remediation state and does not currently have a matching state source_targets JSON file for provider-source-pack generation.',
  },
  summary: {
    statesIncluded: states.length,
    pullNowStates: readinessGroups.pullNow.length,
    limitedPullNowStates: readinessGroups.limitedPullNow.length,
    replacePlaceholdersFirstStates: readinessGroups.replacePlaceholdersFirst.length,
    authorTargetsFirstStates: readinessGroups.authorTargetsFirst.length,
    statesWithSecondaryDiscoveryTargets: states.filter((state) => state.directoryProviderTargetCount > 0).length,
    secondaryDiscoveryTargetCount: states.reduce((sum, state) => sum + state.directoryProviderTargetCount, 0),
  },
  states,
};

function renderTargetList(targets) {
  if (!targets.length) return ['- none'];
  return targets.map((target) =>
    `- ${target.source_name}: ${target.source_url} (${target.crawl_method}, ${target.domain})`
  );
}

const mdLines = [
  '# Provider Source-Pack Plan',
  '',
  `Generated: ${generatedDate}`,
  '',
  '## Why This Exists',
  '',
  '- The provider buildout priority plan tells us which states are missing a public-safe provider layer.',
  '- This source-pack plan answers a narrower execution question: which of those states already have source-backed provider targets that are concrete enough to pull now?',
  '',
  '## Scope',
  '',
  `- Input provider-priority artifact: ${report.sources.providerPlan}`,
  `- Source target inventory directory: ${report.sources.sourceTargetsDir}`,
  '- State selection rule: top missing-provider states by existing local ecosystem, excluding California because it is still a remediation state and currently lacks a matching provider source-target JSON file.',
  '',
  '## Summary',
  '',
  `- States included: ${report.summary.statesIncluded}`,
  `- Pull now: ${report.summary.pullNowStates}`,
  `- Limited pull now: ${report.summary.limitedPullNowStates}`,
  `- Replace placeholders first: ${report.summary.replacePlaceholdersFirstStates}`,
  `- Author targets first: ${report.summary.authorTargetsFirstStates}`,
  `- States with directory-style secondary discovery targets: ${report.summary.statesWithSecondaryDiscoveryTargets}`,
  `- Total directory-style secondary discovery targets: ${report.summary.secondaryDiscoveryTargetCount}`,
  '',
  '## California Note',
  '',
  `- California is still a top missing-provider state, but it is not in this source-pack because ${report.californiaNote.reason}`,
  '',
  '## Execution Meaning',
  '',
  '- `pull-now`: enough concrete first-party provider targets already exist to begin a safe source pull.',
  '- `limited-pull-now`: one or two concrete first-party targets exist, but the state still needs a few more named clinic or hospital targets before scaling.',
  '- `replace-placeholders-first`: the state has provider targets, but they are generic placeholders or weak directory-style entries and should not be crawled as-is.',
  '- `author-targets-first`: the current provider target inventory is too thin or too generic to support trustworthy provider promotion.',
  '',
  '## Lane Summary',
  '',
  `- Pull now: ${readinessGroups.pullNow.map((state) => state.stateName).join(', ') || 'none'}`,
  `- Limited pull now: ${readinessGroups.limitedPullNow.map((state) => state.stateName).join(', ') || 'none'}`,
  `- Replace placeholders first: ${readinessGroups.replacePlaceholdersFirst.map((state) => state.stateName).join(', ') || 'none'}`,
  `- Author targets first: ${readinessGroups.authorTargetsFirst.map((state) => state.stateName).join(', ') || 'none'}`,
];

for (const state of states) {
  mdLines.push(
    '',
    `## ${state.stateName}`,
    '',
    `- counties: ${state.countyCount}`,
    `- public-safe nonprofits: ${state.publicSafeNonprofits}`,
    `- advocate public-safe rows: ${state.advocatePublicSafeCount}`,
    `- provider source targets: ${state.providerTargetCount}`,
    `- concrete first-party provider targets: ${state.concreteProviderTargetCount}`,
    `- placeholder provider targets: ${state.placeholderProviderTargetCount}`,
    `- directory-style provider targets: ${state.directoryProviderTargetCount}`,
    `- support targets: nonprofits ${state.supportTargetCounts.nonprofit}, trust ${state.supportTargetCounts.trust}, DD ${state.supportTargetCounts.dd}, offices ${state.supportTargetCounts.office}`,
    `- readiness lane: ${state.readinessLane}`,
    `- next move: ${state.nextMove}`,
    '',
    'Concrete first-party provider targets:',
    '',
    ...renderTargetList(state.concreteProviderTargets),
    '',
    'Placeholder provider targets to replace:',
    '',
    ...renderTargetList(state.placeholderProviderTargets),
    '',
    'Directory-style provider targets to treat as secondary discovery only:',
    '',
    ...renderTargetList(state.directoryProviderTargets),
  );
}

mdLines.push(
  '',
  '## Top Recommendations',
  '',
  `1. Start provider pulls with the current pull-now states: ${readinessGroups.pullNow.map((state) => state.stateName).join(', ')}.`,
  '2. Use New York as the richest immediate provider expansion state because it now combines multiple concrete first-party hospitals with a large existing nonprofit and advocate ecosystem.',
  `3. Keep the next target-authoring wave focused on the remaining limited-pull-now states: ${readinessGroups.limitedPullNow.map((state) => state.stateName).join(', ') || 'none'}.`,
  '4. Use the existing nonprofit, DD, office, and trust targets in those states as supporting context for provider validation, not as substitutes for provider sources.',
  '',
  '## Safety Rule',
  '',
  '- Do not promote a provider row from a placeholder target that is not clearly state-specific and first-party.',
  '- Do not promote providers directly from directory-style secondary-discovery targets; use them only to discover stronger first-party provider sites or facility pages.',
);

fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(outJsonPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(outMdPath, `${mdLines.join('\n')}\n`);

console.log(`Wrote ${path.relative(repoRoot, outJsonPath)}`);
console.log(`Wrote ${path.relative(repoRoot, outMdPath)}`);
