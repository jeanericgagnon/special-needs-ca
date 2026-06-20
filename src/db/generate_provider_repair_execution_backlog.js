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
const jsonOutPath = path.join(docsDir, `provider-repair-execution-backlog-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-repair-execution-backlog-${generatedDate}.md`);

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

function topEntries(counter, limit = 10) {
  return Object.entries(counter)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

const queuePath = latestGeneratedJson('provider-followup-repair-queue-');
const sourcePackPlanPath = latestGeneratedJson('provider-source-pack-plan-');
const queue = readJson(queuePath);
const sourcePackPlan = readJson(sourcePackPlanPath);

const rows = Array.isArray(queue.rows) ? queue.rows : [];
const statePlanById = new Map((sourcePackPlan.states || []).map((state) => [state.stateId, state]));

const actionPriority = {
  replace_domain: 1,
  replace_exact_url: 2,
  author_alternate_first_party_target: 3,
  bounded_retry_then_replace: 4,
  manual_review_or_replace: 5,
  replace_or_repair: 6,
};

const orderedRows = [...rows].sort((a, b) =>
  (actionPriority[a.actionClass] || 99) - (actionPriority[b.actionClass] || 99)
  || b.repeatCount - a.repeatCount
  || a.stateId.localeCompare(b.stateId)
  || a.hostname.localeCompare(b.hostname)
);

const laneSummary = ['pull-now', 'author-targets-first'].map((lane) => {
  const laneRows = orderedRows.filter((row) => row.readinessLane === lane);
  return {
    lane,
    rowCount: laneRows.length,
    distinctStates: new Set(laneRows.map((row) => row.stateId)).size,
    byActionClass: countBy(laneRows, 'actionClass'),
    firstRows: laneRows.slice(0, 10).map((row) => ({
      stateId: row.stateId,
      actionClass: row.actionClass,
      followupReason: row.followupReason,
      sourceUrl: row.sourceUrl,
      repeatCount: row.repeatCount,
    })),
  };
});

const stateSummary = topEntries(countBy(orderedRows, 'stateId'), 15).map(({ value, count }) => {
  const plan = statePlanById.get(value) || {};
  return {
    stateId: value,
    rowCount: count,
    readinessLane: plan.readinessLane || orderedRows.find((row) => row.stateId === value)?.readinessLane || 'unknown',
    providerGaps: plan.providerGapCount ?? null,
  };
});

const hostSummary = topEntries(countBy(orderedRows, 'hostname'), 15).map(({ value, count }) => ({
  hostname: value,
  rowCount: count,
  actionClasses: countBy(orderedRows.filter((row) => row.hostname === value), 'actionClass'),
}));

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    providerFollowupRepairQueuePath: path.relative(repoRoot, queuePath),
    providerSourcePackPlanPath: path.relative(repoRoot, sourcePackPlanPath),
  },
  purpose: 'Compact execution backlog for provider_directory burn-down so the next operator can repair exact provider targets without re-reading the full blocker queue.',
  summary: {
    totalRows: orderedRows.length,
    distinctStates: new Set(orderedRows.map((row) => row.stateId)).size,
    distinctHosts: new Set(orderedRows.map((row) => row.hostname)).size,
    byActionClass: countBy(orderedRows, 'actionClass'),
    byReadinessLane: countBy(orderedRows, 'readinessLane'),
    firstExecutionLane: orderedRows[0]?.readinessLane || null,
  },
  commandCadence: [
    'npm run audit:provider-followup-repair-queue',
    'npm run audit:provider-repair-execution-backlog',
    'npm run audit:provider-source-pack',
    'npm run run:source-acquisition-wave -- --mode=live --lane=ready_target_scrape --gap=providers_care --limit=25',
    'npm run run:source-acquisition-followups -- --run-id=<run-id>',
    'npm run run:source-acquisition-parse -- --run-id=<run-id> --family=providers_care',
    'npm run run:source-acquisition-validate -- --run-id=<run-id> --family=providers_care',
    'npm run run:source-acquisition-stage -- --run-id=<run-id> --family=providers_care --mode=dry-run',
  ],
  laneSummary,
  stateSummary,
  hostSummary,
  firstTwentyRows: orderedRows.slice(0, 20),
};

const mdLines = [
  '# Provider Repair Execution Backlog',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Summary',
  '',
  `- total rows: ${payload.summary.totalRows}`,
  `- distinct states: ${payload.summary.distinctStates}`,
  `- distinct hosts: ${payload.summary.distinctHosts}`,
  `- first execution lane: ${payload.summary.firstExecutionLane || 'none'}`,
  '',
  '## Lane Summary',
  '',
];

for (const lane of laneSummary) {
  mdLines.push(`- ${lane.lane}: rows=${lane.rowCount}; states=${lane.distinctStates}`);
}

mdLines.push('', '## Top States', '');
for (const state of stateSummary.slice(0, 10)) {
  mdLines.push(`- ${state.stateId}: rows=${state.rowCount}; lane=${state.readinessLane}; providerGaps=${state.providerGaps ?? 'unknown'}`);
}

mdLines.push('', '## Top Hosts', '');
for (const host of hostSummary.slice(0, 10)) {
  mdLines.push(`- ${host.hostname}: rows=${host.rowCount}`);
}

mdLines.push('', '## First Execution Rows', '');
for (const row of payload.firstTwentyRows) {
  mdLines.push(`- ${row.stateId} | ${row.readinessLane} | ${row.actionClass} | repeats=${row.repeatCount} | ${row.sourceUrl}`);
}

mdLines.push('', '## Command Cadence', '');
for (const command of payload.commandCadence) {
  mdLines.push(`- ${command}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  totalRows: payload.summary.totalRows,
  firstExecutionLane: payload.summary.firstExecutionLane,
}, null, 2));
