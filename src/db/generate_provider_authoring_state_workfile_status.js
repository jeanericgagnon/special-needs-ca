import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
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

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

function normalizeDomain(rawDomain, rawUrl) {
  const explicit = String(rawDomain || '').trim().replace(/^www\./, '').toLowerCase();
  if (explicit) return explicit;
  try {
    return new URL(String(rawUrl || '').trim()).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

const args = parseArgs(process.argv.slice(2));
if (!args.state) {
  throw new Error('Missing required --state=<state-id>.');
}

const workfilePath = path.join(dataDir, 'provider-authoring-state-workfiles', `provider-authoring-state-workfile-${args.state}.json`);
if (!fs.existsSync(workfilePath)) {
  throw new Error(`Missing provider authoring state workfile: ${workfilePath}`);
}

const jsonOutPath = path.join(docsDir, `provider-authoring-state-workfile-status-${args.state}-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-authoring-state-workfile-status-${args.state}-${generatedDate}.md`);
const workfile = readJson(workfilePath);
const rows = Array.isArray(workfile?.candidateProviderTargets) ? workfile.candidateProviderTargets : [];
const readyRows = rows.filter((row) =>
  hasText(row.sourceName)
  && hasText(row.sourceUrl)
  && hasText(normalizeDomain(row.domain, row.sourceUrl))
  && hasText(row.reviewedBy)
);
const unresolvedRows = rows.filter((row) => !readyRows.includes(row));

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  stateId: args.state,
  sourceWorkfilePath: path.relative(repoRoot, workfilePath),
  summary: {
    neededConcreteTargets: Number(workfile?.summary?.neededConcreteTargets || 0),
    candidateSlotCount: rows.length,
    readyCandidateCount: readyRows.length,
    unresolvedCandidateCount: unresolvedRows.length,
    completionPercent: rows.length ? Number(((readyRows.length / rows.length) * 100).toFixed(1)) : 0,
  },
  nextWork: unresolvedRows.slice(0, 10).map((row) => ({
    slotNumber: row.slotNumber,
    sourceName: row.sourceName || '',
    sourceUrl: row.sourceUrl || '',
    organizationType: row.organizationType || '',
  })),
};

const mdLines = [
  '# Provider Authoring State Workfile Status',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  `State: ${payload.stateId}`,
  `Source workfile: ${payload.sourceWorkfilePath}`,
  '',
  '## Summary',
  '',
  `- needed concrete targets: ${payload.summary.neededConcreteTargets}`,
  `- candidate slots: ${payload.summary.candidateSlotCount}`,
  `- ready candidates: ${payload.summary.readyCandidateCount}`,
  `- unresolved candidates: ${payload.summary.unresolvedCandidateCount}`,
  `- completion percent: ${payload.summary.completionPercent}`,
  '',
  '## Next Work',
  '',
  ...(payload.nextWork.length
    ? payload.nextWork.map((row) => `- slot ${row.slotNumber}: ${row.sourceName || '(blank)'} | ${row.sourceUrl || '(missing url)'} | ${row.organizationType || '(missing type)'}`)
    : ['- none']),
];

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  unresolvedCandidateCount: payload.summary.unresolvedCandidateCount,
  completionPercent: payload.summary.completionPercent,
}, null, 2));
