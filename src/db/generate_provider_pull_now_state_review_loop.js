import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);

function parseArgs(argv) {
  const args = { state: '' };
  for (const arg of argv) {
    if (arg.startsWith('--state=')) args.state = arg.slice('--state='.length).trim().toLowerCase();
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath) {
  return fs.existsSync(filePath) ? readJson(filePath) : null;
}

const args = parseArgs(process.argv.slice(2));
if (!args.state) throw new Error('Missing required --state=<state-id>.');

const statePacketPath = path.join(docsDir, 'provider-pull-now-state-packets', `provider-pull-now-state-packet-${args.state}-${generatedDate}.json`);
const decisionPacketPath = path.join(docsDir, 'provider-pull-now-state-decision-packets', `provider-pull-now-state-decision-packet-${args.state}-${generatedDate}.json`);
const workfileStatusPath = path.join(docsDir, `provider-pull-now-state-workfile-status-${args.state}-${generatedDate}.json`);
const workfileValidationPath = path.join(docsDir, `provider-pull-now-state-workfile-validation-${args.state}-${generatedDate}.json`);

const statePacket = readJsonIfExists(statePacketPath);
const decisionPacket = readJsonIfExists(decisionPacketPath);
const workfileStatus = readJsonIfExists(workfileStatusPath);
const workfileValidation = readJsonIfExists(workfileValidationPath);
const workfileUnresolvedRows = workfileStatus?.summary?.unresolvedRows ?? 0;
const validationIssueRows = workfileValidation?.summary?.issueRows ?? 0;
const mergeReady = Boolean(workfileValidation?.summary?.mergeReady) && workfileUnresolvedRows === 0 && validationIssueRows === 0;

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  stateId: args.state,
  artifacts: {
    statePacketPath: fs.existsSync(statePacketPath) ? path.relative(repoRoot, statePacketPath) : '',
    decisionPacketPath: fs.existsSync(decisionPacketPath) ? path.relative(repoRoot, decisionPacketPath) : '',
    workfileStatusPath: fs.existsSync(workfileStatusPath) ? path.relative(repoRoot, workfileStatusPath) : '',
    workfileValidationPath: fs.existsSync(workfileValidationPath) ? path.relative(repoRoot, workfileValidationPath) : '',
  },
  summary: {
    statePacketUnresolvedRows: statePacket?.unresolvedRows ?? statePacket?.summary?.unresolvedRows ?? 0,
    workfileUnresolvedRows,
    workfileCompletionPercent: workfileStatus?.summary?.completionPercent ?? 0,
    validationIssueRows,
    mergeReady,
  },
  commands: {
    packet: `npm run run:next-provider-pull-now-state-packet`,
    workfileStatus: `npm run audit:provider-pull-now-state-workfile-status -- --state=${args.state}`,
    workfileSync: `npm run fix:provider-pull-now-state-workfile -- --state=${args.state}`,
    workfileValidation: `npm run audit:provider-pull-now-state-workfile-validation -- --state=${args.state}`,
    workfileMerge: `npm run fix:provider-pull-now-state-workfile-decisions -- --state=${args.state} --apply`,
    apply: 'node scripts/apply-provider-pull-now-decisions.mjs --apply',
  },
};

const jsonOutPath = path.join(docsDir, `provider-pull-now-state-review-loop-${args.state}-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-pull-now-state-review-loop-${args.state}-${generatedDate}.md`);
const mdLines = [
  '# Provider Pull-Now State Review Loop',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  `State: ${payload.stateId}`,
  '',
  '## Summary',
  '',
  `- state packet unresolved rows: ${payload.summary.statePacketUnresolvedRows}`,
  `- workfile unresolved rows: ${payload.summary.workfileUnresolvedRows}`,
  `- workfile completion percent: ${payload.summary.workfileCompletionPercent}`,
  `- validation issue rows: ${payload.summary.validationIssueRows}`,
  `- merge ready: ${payload.summary.mergeReady}`,
  '',
  '## Artifacts',
  '',
  `- state packet: ${payload.artifacts.statePacketPath || 'missing'}`,
  `- decision packet: ${payload.artifacts.decisionPacketPath || 'missing'}`,
  `- workfile status: ${payload.artifacts.workfileStatusPath || 'missing'}`,
  `- workfile validation: ${payload.artifacts.workfileValidationPath || 'missing'}`,
  '',
  '## Commands',
  '',
  ...Object.values(payload.commands).map((command) => `- ${command}`),
];

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  summary: payload.summary,
}, null, 2));
