import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-pull-now-runbook-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-pull-now-runbook-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

const executionBacklogPath = latestGeneratedJson('provider-repair-execution-backlog-');
const repairQueuePath = latestGeneratedJson('provider-followup-repair-queue-');
const sourcePackPlanPath = latestGeneratedJson('provider-source-pack-plan-');

const executionBacklog = readJson(executionBacklogPath);
const repairQueue = readJson(repairQueuePath);
const sourcePackPlan = readJson(sourcePackPlanPath);

const statePlanById = new Map((sourcePackPlan.states || []).map((state) => [state.stateId, state]));
const pullNowRows = (repairQueue.rows || [])
  .filter((row) => row.readinessLane === 'pull-now')
  .sort((a, b) =>
    b.repeatCount - a.repeatCount
    || a.actionClass.localeCompare(b.actionClass)
    || a.stateId.localeCompare(b.stateId)
  );

const actionSlices = [
  {
    actionClass: 'replace_domain',
    priority: 1,
    rationale: 'Broken domains are hard blockers; replace them before retrying any provider fetches.',
  },
  {
    actionClass: 'replace_exact_url',
    priority: 2,
    rationale: 'Dead exact URLs can usually be swapped to a current first-party clinic or program page cheaply.',
  },
  {
    actionClass: 'author_alternate_first_party_target',
    priority: 3,
    rationale: '403-blocked provider pages need safer first-party alternates instead of repeated lightweight retries.',
  },
  {
    actionClass: 'bounded_retry_then_replace',
    priority: 4,
    rationale: 'Retryable rows get one bounded retry only after the harder source-repair blockers are cleared.',
  },
  {
    actionClass: 'manual_review_or_replace',
    priority: 5,
    rationale: 'Unknown blockers stay last because they need a compact human decision or direct replacement.',
  },
];

const slices = actionSlices.map((slice) => {
  const rows = pullNowRows.filter((row) => row.actionClass === slice.actionClass);
  return {
    ...slice,
    rowCount: rows.length,
    states: [...new Set(rows.map((row) => row.stateId))],
    rows: rows.slice(0, 12).map((row) => ({
      stateId: row.stateId,
      sourceUrl: row.sourceUrl,
      hostname: row.hostname,
      repeatCount: row.repeatCount,
      followupReason: row.followupReason,
      recommendedAction: row.recommendedAction,
    })),
  };
}).filter((slice) => slice.rowCount > 0);

const stateSlices = [...new Set(pullNowRows.map((row) => row.stateId))].map((stateId) => {
  const rows = pullNowRows.filter((row) => row.stateId === stateId);
  const plan = statePlanById.get(stateId) || {};
  return {
    stateId,
    rowCount: rows.length,
    readinessLane: plan.readinessLane || 'pull-now',
    actionClasses: countBy(rows, 'actionClass'),
    firstRows: rows.slice(0, 5).map((row) => ({
      actionClass: row.actionClass,
      sourceUrl: row.sourceUrl,
      repeatCount: row.repeatCount,
    })),
  };
}).sort((a, b) => b.rowCount - a.rowCount || a.stateId.localeCompare(b.stateId));

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    executionBacklogPath: path.relative(repoRoot, executionBacklogPath),
    repairQueuePath: path.relative(repoRoot, repairQueuePath),
    sourcePackPlanPath: path.relative(repoRoot, sourcePackPlanPath),
  },
  purpose: 'Compact operator runbook for the provider_directory pull-now repair lane so the next cycle can start without re-reading full provider artifacts.',
  summary: {
    pullNowRowCount: pullNowRows.length,
    pullNowStateCount: new Set(pullNowRows.map((row) => row.stateId)).size,
    byActionClass: countBy(pullNowRows, 'actionClass'),
    firstActionClass: slices[0]?.actionClass || null,
  },
  preflight: [
    'Run npm run audit:provider-followup-repair-queue',
    'Run npm run audit:provider-repair-execution-backlog',
    'Run npm run audit:provider-pull-now-runbook',
    'Do not expand beyond pull-now rows in this cycle.',
  ],
  commandCadence: executionBacklog.commandCadence || [],
  slices,
  stateSlices,
};

const mdLines = [
  '# Provider Pull-Now Runbook',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Summary',
  '',
  `- pull-now rows: ${payload.summary.pullNowRowCount}`,
  `- pull-now states: ${payload.summary.pullNowStateCount}`,
  `- first action class: ${payload.summary.firstActionClass || 'none'}`,
  '',
  '## Preflight',
  '',
  ...payload.preflight.map((step) => `- ${step}`),
  '',
  '## Action Slices',
  '',
];

for (const slice of slices) {
  mdLines.push(`- P${slice.priority} ${slice.actionClass}: rows=${slice.rowCount}; states=${slice.states.join(', ')}`);
  mdLines.push(`  ${slice.rationale}`);
}

mdLines.push('', '## State Slices', '');
for (const state of stateSlices) {
  mdLines.push(`- ${state.stateId}: rows=${state.rowCount}; actionClasses=${Object.keys(state.actionClasses).join(', ')}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  pullNowRowCount: payload.summary.pullNowRowCount,
  firstActionClass: payload.summary.firstActionClass,
}, null, 2));
