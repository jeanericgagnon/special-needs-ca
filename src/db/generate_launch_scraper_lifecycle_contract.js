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

const jsonOutPath = path.join(docsDir, `launch-scraper-lifecycle-contract-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-lifecycle-contract-${generatedDate}.md`);

function readJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated input for prefix "${prefix}"`);
  }
  const filePath = path.join(docsDir, matches.at(-1));
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const contract = readJson('launch-scraper-contract-');
const runbook = readJson('launch-scraper-runbook-');
const queueGovernance = readJson('launch-scraper-queue-governance-');
const artifactContract = readJson('launch-scraper-artifact-contract-');

const runbookByFamily = new Map((runbook.familyRunbooks || []).map((row) => [row.family, row]));
const blockedByFamily = new Map(Object.entries(queueGovernance.familyBlockedLaneSummary || {}));

function lifecycleForFamily(familyContract) {
  const family = familyContract.family;
  const runbookRow = runbookByFamily.get(family);
  const blockedSummary = blockedByFamily.get(family) || {};
  if (!runbookRow) {
    throw new Error(`Missing runbook row for family "${family}"`);
  }

  const startClass = familyContract.currentCounts.readyTargetScrape > 0
    ? 'ready_target_scrape'
    : blockedSummary.nextLane || 'author_first';

  const fetchAllowed = startClass === 'ready_target_scrape';
  const parseAllowed = fetchAllowed;

  return {
    family,
    startQueueClass: startClass,
    recommendedRunMode: runbookRow.recommendedRunMode,
    lifecycleStages: [
      {
        stage: 'queue_entry',
        requiredClass: startClass,
        proceedWhen: fetchAllowed
          ? 'family has exact ready targets in ready_target_scrape'
          : 'family has been refreshed into a runnable exact-target state',
        stopWhen: fetchAllowed
          ? 'ready lane is exhausted or stopRule fires'
          : `family remains in ${startClass} and cannot consume fetch volume yet`,
      },
      {
        stage: 'fetch',
        allowed: fetchAllowed,
        proceedWhen: fetchAllowed
          ? `run writes required fetch artifacts: ${(contract.fetchContract?.outputArtifacts || []).join(', ')}`
          : 'not allowed until queue class becomes ready_target_scrape',
        stopWhen: runbookRow.stopRule,
      },
      {
        stage: 'followups',
        allowed: fetchAllowed,
        proceedWhen: fetchAllowed
          ? 'followup summary classifies results into parse_ready_high_signal, parse_ready_suspect, retryable, blocked, or source_repair'
          : 'not allowed until fetch runs',
        stopWhen: fetchAllowed
          ? 'blocked/source_repair dominates or no parse-ready rows remain'
          : 'not allowed until fetch runs',
      },
      {
        stage: 'parse',
        allowed: parseAllowed,
        proceedWhen: parseAllowed
          ? 'parse_ready_high_signal rows exist for the family'
          : 'skip until family becomes parse-eligible',
        stopWhen: parseAllowed
          ? 'no parse-ready rows for family or parser emits only schema-error/empty output'
          : 'skip',
      },
      {
        stage: 'validate',
        allowed: parseAllowed,
        proceedWhen: parseAllowed
          ? 'parsed records exist for the family and validator can apply family acceptance gates'
          : 'skip until parse is allowed',
        stopWhen: parseAllowed
          ? 'accepted count is zero or rejection pattern implies author_first/repair_first/defer_blocked_source'
          : 'skip',
      },
      {
        stage: 'stage',
        allowed: parseAllowed && family !== 'knowledge_content' && family !== 'education_routing',
        proceedWhen: parseAllowed
          ? 'accepted validated rows exist and the family has a supported staging target'
          : 'skip until validate is allowed',
        stopWhen: parseAllowed
          ? 'no accepted rows remain or family target is unsupported for staging'
          : 'skip',
      },
      {
        stage: 'queue_refresh',
        allowed: true,
        proceedWhen: 'family lane cycle ends and refreshed queue truth is needed',
        stopWhen: 'updated queue class and blockers are written to disk',
      },
    ],
    fallbackTransitions: {
      ifNoReadyTargets: blockedSummary.nextLane || 'author_first',
      ifRepeatedBrokenSources: 'repair_first',
      ifRepeatedBlockedSources: 'defer_blocked_source',
      ifNeedsOperatorDecision: 'manual_review',
      ifQuarantined: 'do_not_scrape_quarantined',
    },
    requiredArtifactsByStage: {
      fetch: contract.fetchContract?.outputArtifacts || [],
      followups: [
        'followups/parse-ready.json',
        'followups/parse-ready-high-signal.json',
        'followups/retryable-failures.json',
        'followups/blocked-failures.json',
        'followups/source-repair.json',
        'followups/followup-summary.json',
      ],
      parse: [
        `parsed/${family}/records.ndjson`,
        `parsed/${family}/summary.json`,
        `parsed/${family}/schema-errors.json`,
      ],
      validate: [
        `validated/${family}/accepted.ndjson`,
        `validated/${family}/rejected.ndjson`,
        `validated/${family}/rejection-reasons.json`,
      ],
      stage: [
        `staged/${family}/promotion-candidates.ndjson`,
        `staged/${family}/unsupported-candidates.ndjson`,
        `staged/${family}/promotion-summary.json`,
      ],
    },
  };
}

const familyLifecycles = (contract.familyContracts || []).map(lifecycleForFamily);

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  purpose: 'Canonical lifecycle and state-machine contract for launch scraper families so queue entry, fetch, followups, parse, validate, and stage transitions are explicit.',
  resumeSafetyGuarantees: artifactContract.resumeSafetyContract?.guarantees || [],
  familyCount: familyLifecycles.length,
  familyLifecycles,
};

const mdLines = [
  '# Launch Scraper Lifecycle Contract',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Resume Safety Guarantees',
  '',
  ...payload.resumeSafetyGuarantees.map((item) => `- ${item}`),
  '',
];

for (const family of familyLifecycles) {
  mdLines.push(`## ${family.family}`, '');
  mdLines.push(`- startQueueClass: ${family.startQueueClass}`);
  mdLines.push(`- recommendedRunMode: ${family.recommendedRunMode}`);
  mdLines.push('- lifecycleStages:');
  for (const stage of family.lifecycleStages) {
    mdLines.push(`  - ${stage.stage}`);
    if (stage.requiredClass) mdLines.push(`    - requiredClass: ${stage.requiredClass}`);
    if (stage.allowed !== undefined) mdLines.push(`    - allowed: ${stage.allowed}`);
    mdLines.push(`    - proceedWhen: ${stage.proceedWhen}`);
    mdLines.push(`    - stopWhen: ${stage.stopWhen}`);
  }
  mdLines.push('- fallbackTransitions:');
  for (const [key, value] of Object.entries(family.fallbackTransitions)) {
    mdLines.push(`  - ${key}: ${value}`);
  }
  mdLines.push('- requiredArtifactsByStage:');
  for (const [key, value] of Object.entries(family.requiredArtifactsByStage)) {
    mdLines.push(`  - ${key}: ${value.join(', ')}`);
  }
  mdLines.push('');
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  familyCount: payload.familyCount,
}, null, 2));
