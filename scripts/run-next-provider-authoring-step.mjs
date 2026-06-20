import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const backlogPath = path.join(docsDir, `provider-authoring-backlog-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!fs.existsSync(backlogPath)) {
  throw new Error(`Missing provider authoring backlog: ${backlogPath}. Run npm run audit:provider-authoring-backlog first.`);
}

const backlog = readJson(backlogPath);
const rows = Array.isArray(backlog.rows) ? backlog.rows : [];
const nextRow = [...rows].sort((a, b) =>
  Number(a.executionPriority || 99) - Number(b.executionPriority || 99)
  || String(a.stateId || '').localeCompare(String(b.stateId || ''))
)[0] || null;

if (!nextRow) {
  console.log(JSON.stringify({
    mode: 'provider_authoring_idle',
    backlogPath,
    selectedState: null,
    commands: [],
  }, null, 2));
  process.exit(0);
}

console.log(JSON.stringify({
  mode: 'provider_authoring_next_step',
  backlogPath,
  selectedState: {
    stateId: nextRow.stateId,
    stateName: nextRow.stateName,
    sourceTargetsExists: nextRow.sourceTargetsExists,
    sourceTargetsPath: nextRow.sourceTargetsPath,
    concreteProviderTargetCount: nextRow.concreteProviderTargetCount,
    neededConcreteTargets: nextRow.neededConcreteTargets,
    nextAction: nextRow.nextAction,
  },
  commands: [
    'npm run audit:provider-authoring-backlog',
    'npm run audit:provider-authoring-state-packets',
    'npm run run:next-provider-authoring-packet',
    'npm run audit:provider-source-pack',
    'npm run audit:provider-buildout-priority',
  ],
}, null, 2));
