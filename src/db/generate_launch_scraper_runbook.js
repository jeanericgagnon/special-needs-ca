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

const jsonOutPath = path.join(docsDir, `launch-scraper-runbook-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-runbook-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated input for prefix "${prefix}"`);
  }
  return path.join(docsDir, matches.at(-1));
}

const contractPath = latestGeneratedJson('launch-scraper-contract-');
const fixturePath = latestGeneratedJson('launch-scraper-fixture-matrix-');
const contract = readJson(contractPath);
const fixtureMatrix = readJson(fixturePath);

const fixtureByFamily = new Map((fixtureMatrix.familyFixtureMatrix || []).map((row) => [row.family, row]));

function getRunMode(family) {
  if (family.executionMode === 'author_or_queue_refresh_first') return 'author_first_only';
  if (family.currentCounts.readyTargetScrape >= 20) return 'fetch_only_first';
  return 'full_lane_when_successful';
}

function getPreflight(family) {
  const steps = [
    'Run npm run audit:launch-scrape-link-inventory',
    'Run npm run audit:launch-scraper-contract',
    'Run npm run audit:launch-scraper-fixture-matrix',
  ];
  if (family.family === 'program_waitlists') {
    steps.push('Do not fetch until waitlist rows are visible as a first-class queue lane.');
  } else {
    steps.push(`Confirm ${family.currentCounts.readyTargetScrape} ready target(s) still exist for ${family.family}.`);
  }
  return steps;
}

function getSuccessGate(family, fixture) {
  if (family.family === 'program_waitlists') {
    return 'Queue must first become launch-visible and exact-target-backed before any fetch starts.';
  }
  return `Fetched pages should contain: ${fixture.positiveFixture.minimumPageSignals.join(', ')}.`;
}

function getStopRule(family) {
  if (family.executionMode === 'author_or_queue_refresh_first') {
    return 'Stop immediately if no exact ready targets are visible; do queue/authoring refresh instead of fetching.';
  }
  return `Stop the family wave when any stop condition appears: ${family.stopConditions.join(', ')}.`;
}

function getNextIfBlocked(family) {
  if (family.currentCounts.readyTargetScrape === 0) {
    return 'Refresh authoring or queue artifact instead of opening a fetch wave.';
  }
  if (family.currentCounts.repairFirst > 0) {
    return 'Move repeated broken URLs into repair-first and do not re-fetch until replaced.';
  }
  if (family.currentCounts.authorFirst > 0) {
    return 'Move insufficient targets into author-first and do not expand discovery inside fetch runs.';
  }
  if (family.currentCounts.deferredBlockedSource > 0) {
    return 'Do not retry deferred blocked sources; replace them first.';
  }
  return 'Pause the family wave and review the compact followup summary only.';
}

function getCadence(family) {
  if (family.executionMode === 'author_or_queue_refresh_first') {
    return [
      'refresh queue truth',
      'author or reclassify exact targets',
      'regenerate launch queue artifacts',
      're-check family readiness',
    ];
  }
  const mode = getRunMode(family);
  if (mode === 'fetch_only_first') {
    return [
      'fetch',
      'followups',
      'review compact summary',
      'only then decide whether parse/validate/stage is worth running',
    ];
  }
  return [
    'fetch',
    'followups',
    'parse',
    'validate',
    'stage',
    'refresh queue truth',
  ];
}

function buildCommands(family) {
  const commands = [];
  for (const template of family.commandTemplates || []) {
    commands.push({
      lane: template.lane,
      dryRun: template.dryRun,
      liveRun: template.liveRun,
      followups: 'npm run run:source-acquisition-followups -- --run-id=<run-id>',
      parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=${family.family}`,
      validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=${family.family}`,
      stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=${family.family} --mode=dry-run`,
    });
  }
  return commands;
}

const familyRunbooks = (contract.familyContracts || []).map((family) => {
  const fixture = fixtureByFamily.get(family.family);
  if (!fixture) {
    throw new Error(`Missing fixture matrix for family "${family.family}"`);
  }
  return {
    family: family.family,
    currentReadyTargetScrape: family.currentCounts.readyTargetScrape,
    currentReadyByLane: family.currentCounts.readyByLane,
    executionMode: family.executionMode,
    recommendedRunMode: getRunMode(family),
    preflight: getPreflight(family),
    cadence: getCadence(family),
    successGate: getSuccessGate(family, fixture),
    stopRule: getStopRule(family),
    nextIfBlocked: getNextIfBlocked(family),
    compactAcceptanceSignals: fixture.positiveFixture.minimumPageSignals,
    compactFailureSignals: fixture.negativeFixtures.map((item) => ({
      description: item.description,
      rejectionReasons: item.expectedRejectionReasons,
    })),
    commandSet: buildCommands(family),
    outputArtifacts: contract.fetchContract.outputArtifacts,
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    launchScraperContract: path.relative(repoRoot, contractPath),
    launchScraperFixtureMatrix: path.relative(repoRoot, fixturePath),
  },
  purpose: 'Compact family-by-family operator runbook for launch scraper execution so fetch-only and full-lane work can be run without improvising in chat.',
  globalPreflight: [
    'Run npm run audit:launch-scrape-link-inventory',
    'Run npm run audit:launch-scraper-contract',
    'Run npm run audit:launch-scraper-field-contract',
    'Run npm run audit:launch-scraper-fixture-matrix',
    'Do not expand beyond launch-critical families in this runbook.',
  ],
  familyRunbookCount: familyRunbooks.length,
  familyRunbooks,
};

const mdLines = [
  '# Launch Scraper Runbook',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Global Preflight',
  '',
  ...payload.globalPreflight.map((step) => `- ${step}`),
  '',
];

for (const family of familyRunbooks) {
  mdLines.push(`## ${family.family}`);
  mdLines.push('');
  mdLines.push(`- currentReadyTargetScrape: ${family.currentReadyTargetScrape}`);
  mdLines.push(`- currentReadyByLane: ${JSON.stringify(family.currentReadyByLane)}`);
  mdLines.push(`- executionMode: ${family.executionMode}`);
  mdLines.push(`- recommendedRunMode: ${family.recommendedRunMode}`);
  mdLines.push('- preflight:');
  for (const step of family.preflight) mdLines.push(`  - ${step}`);
  mdLines.push(`- cadence: ${family.cadence.join(' -> ')}`);
  mdLines.push(`- successGate: ${family.successGate}`);
  mdLines.push(`- stopRule: ${family.stopRule}`);
  mdLines.push(`- nextIfBlocked: ${family.nextIfBlocked}`);
  mdLines.push(`- compactAcceptanceSignals: ${family.compactAcceptanceSignals.join(', ')}`);
  mdLines.push('- compactFailureSignals:');
  for (const signal of family.compactFailureSignals) {
    mdLines.push(`  - ${signal.description}`);
    mdLines.push(`    - rejectionReasons: ${signal.rejectionReasons.join(', ')}`);
  }
  if (family.commandSet.length) {
    mdLines.push('- commandSet:');
    for (const command of family.commandSet) {
      mdLines.push(`  - lane: ${command.lane}`);
      mdLines.push(`    - dryRun: \`${command.dryRun}\``);
      mdLines.push(`    - liveRun: \`${command.liveRun}\``);
      mdLines.push(`    - followups: \`${command.followups}\``);
      mdLines.push(`    - parse: \`${command.parse}\``);
      mdLines.push(`    - validate: \`${command.validate}\``);
      mdLines.push(`    - stage: \`${command.stage}\``);
    }
  } else {
    mdLines.push('- commandSet: none until queue/authoring refresh creates exact ready targets');
  }
  mdLines.push(`- outputArtifacts: ${family.outputArtifacts.join(', ')}`);
  mdLines.push('');
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  familyRunbookCount: payload.familyRunbookCount,
}, null, 2));
