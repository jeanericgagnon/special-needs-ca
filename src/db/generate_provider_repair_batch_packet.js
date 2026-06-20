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

function parseArgs(argv) {
  const args = {
    lane: '',
    state: '',
    limit: 5,
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'lane' && value) args.lane = value;
    if (flag === 'state' && value) args.state = value.toLowerCase();
    if (flag === 'limit' && Number.isFinite(Number(value))) args.limit = Math.max(1, Number(value));
  }

  return args;
}

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

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'all';
}

const actionPriority = {
  replace_domain: 1,
  replace_exact_url: 2,
  author_alternate_first_party_target: 3,
  bounded_retry_then_replace: 4,
  manual_review_or_replace: 5,
  replace_or_repair: 6,
};

const args = parseArgs(process.argv.slice(2));
const queuePath = latestGeneratedJson('provider-followup-repair-queue-');
const backlogPath = latestGeneratedJson('provider-repair-execution-backlog-');
const sourcePackPlanPath = latestGeneratedJson('provider-source-pack-plan-');

const queue = readJson(queuePath);
const backlog = readJson(backlogPath);
const sourcePackPlan = readJson(sourcePackPlanPath);

const firstLane = args.lane || backlog?.summary?.firstExecutionLane || 'pull-now';
const statePlanById = new Map((sourcePackPlan.states || []).map((state) => [state.stateId, state]));
const rows = Array.isArray(queue.rows) ? queue.rows : [];
const orderedRows = [...rows].sort((a, b) =>
  String(a.readinessLane || '').localeCompare(String(b.readinessLane || ''))
  || (actionPriority[a.actionClass] || 99) - (actionPriority[b.actionClass] || 99)
  || (b.repeatCount || 0) - (a.repeatCount || 0)
  || String(a.stateId || '').localeCompare(String(b.stateId || ''))
  || String(a.hostname || '').localeCompare(String(b.hostname || ''))
);

const laneRows = orderedRows.filter((row) => row.readinessLane === firstLane);
const nextState = args.state || laneRows[0]?.stateId || '';
const scopedRows = laneRows.filter((row) => !nextState || row.stateId === nextState);
const selectedRows = scopedRows.slice(0, args.limit);

const selectedStateIds = [...new Set(selectedRows.map((row) => row.stateId).filter(Boolean))];
const selectedHostnames = [...new Set(selectedRows.map((row) => row.hostname).filter(Boolean))];
const statePlan = nextState ? statePlanById.get(nextState) || null : null;
const packetKey = `${slugify(firstLane)}-${slugify(nextState || 'all')}`;
const jsonOutPath = path.join(docsDir, `provider-repair-batch-packet-${packetKey}-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-repair-batch-packet-${packetKey}-${generatedDate}.md`);

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  packetKey,
  selection: {
    readinessLane: firstLane,
    stateId: nextState,
    limit: args.limit,
    selectionMode: args.state ? 'explicit_state_filter' : 'first_state_cluster',
  },
  sourceArtifacts: {
    providerFollowupRepairQueuePath: path.relative(repoRoot, queuePath),
    providerRepairExecutionBacklogPath: path.relative(repoRoot, backlogPath),
    providerSourcePackPlanPath: path.relative(repoRoot, sourcePackPlanPath),
    sourceTargetsPath: statePlan?.sourceTargetsPath || '',
  },
  summary: {
    selectedRows: selectedRows.length,
    scopedLaneRows: scopedRows.length,
    selectedStateIds,
    selectedHostnames,
    byActionClass: selectedRows.reduce((acc, row) => {
      const key = row.actionClass || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
    byReason: selectedRows.reduce((acc, row) => {
      const key = row.followupReason || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
  },
  stateContext: statePlan ? {
    stateId: statePlan.stateId,
    readinessLane: statePlan.readinessLane,
    providerTargetCount: statePlan.providerTargetCount,
    concreteProviderTargetCount: statePlan.concreteProviderTargetCount,
    placeholderProviderTargetCount: statePlan.placeholderProviderTargetCount,
    nextMove: statePlan.nextMove || '',
  } : null,
  selectedRows,
  recommendedCommands: [
    `npm run audit:provider-repair-batch-packet -- --lane=${firstLane}${nextState ? ` --state=${nextState}` : ''} --limit=${args.limit}`,
    'npm run audit:provider-followup-repair-queue',
    'npm run audit:provider-repair-execution-backlog',
    'npm run audit:provider-source-pack',
  ],
};

const mdLines = [
  '# Provider Repair Batch Packet',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  `- readiness lane: ${payload.selection.readinessLane}`,
  `- state: ${payload.selection.stateId || 'all'}`,
  `- limit: ${payload.selection.limit}`,
  `- selection mode: ${payload.selection.selectionMode}`,
  `- selected rows: ${payload.summary.selectedRows}`,
  '',
  '## State Context',
  '',
  `- source targets: ${payload.sourceArtifacts.sourceTargetsPath || 'none'}`,
  `- next move: ${payload.stateContext?.nextMove || 'none'}`,
  `- concrete provider targets: ${payload.stateContext?.concreteProviderTargetCount ?? 'unknown'}`,
  '',
  '## Rows',
  '',
];

for (const row of selectedRows) {
  mdLines.push(`- ${row.stateId} | ${row.actionClass} | ${row.followupReason} | repeats=${row.repeatCount || 0} | ${row.sourceUrl}`);
}

mdLines.push('', '## Commands', '');
for (const command of payload.recommendedCommands) {
  mdLines.push(`- ${command}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  readinessLane: payload.selection.readinessLane,
  stateId: payload.selection.stateId,
  selectedRows: payload.summary.selectedRows,
}, null, 2));
