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
const jsonOutPath = path.join(docsDir, `track-a-finish-loop-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `track-a-finish-loop-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated input for prefix "${prefix}" in ${docsDir}`);
  }
  return path.join(docsDir, matches.at(-1));
}

function latestGeneratedJsonIfPresent(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  return matches.length ? path.join(docsDir, matches.at(-1)) : null;
}

const maxInfoPath = latestGeneratedJson('max-info-program-');
const completionPlanPath = latestGeneratedJson('source-acquisition-completion-plan-');
const trackABlockerRegistryPath = latestGeneratedJsonIfPresent('track-a-blocker-registry-');

const maxInfo = readJson(maxInfoPath);
const completionPlan = readJson(completionPlanPath);
const trackABlockerRegistry = trackABlockerRegistryPath ? readJson(trackABlockerRegistryPath) : { blockers: [] };

const trackA = maxInfo.tracks?.informationExhaustiveness || {};
const currentFamily = trackA.currentFamilyFocus || null;
const currentBlocker = trackA.currentBlockerFocus || null;
const familyQueue = (trackA.familyClosureOrder || []).map((family) => ({
  id: family.id,
  label: family.label,
  status: family.status,
  readyCount: family.readyCount,
  authoringCommand: family.authoringCommand,
  cycleCommands: family.cycleCommands,
}));

const payload = {
  generatedAt: generatedDate,
  inputs: {
    maxInfoPath,
    completionPlanPath,
    trackABlockerRegistryPath,
  },
  status: trackA.status || 'unknown',
  focusMode: trackA.focusMode || 'none',
  currentFamilyFocus: currentFamily,
  currentBlockerFocus: currentBlocker,
  queueSummary: {
    combinedReadyRows: completionPlan.summary?.combinedReadyUniqueRows || 0,
    missingFamilyCount: trackA.missingFamilyCount || 0,
    currentFamilyReadyRows: currentFamily ? Number(completionPlan.summary?.combinedByGapFamily?.[currentFamily.readyGapFamily] || 0) : 0,
  },
  canonicalLoop: [
    'regenerate source-family artifacts',
    'author one missing family pack',
    'add exact targets to source packs and source targets',
    'regenerate completion plan',
    'run bounded fetch wave only for that family',
    'run parse, validate, and stage for that family',
    'regenerate max-info, full-gap, and completion-plan artifacts',
    'decide next family from updated blocker list',
  ],
  topLevelCommand: trackA.topLevelCommand || 'npm run run:next-track-a-step',
  commandCadence: trackA.commandCadence || [],
  activeBlockers: (trackABlockerRegistry.blockers || []).map((blocker) => ({
    id: blocker.id,
    status: blocker.status,
    entryCommand: blocker.entryCommand || null,
    auditCommand: blocker.auditCommand || null,
  })),
  familyQueue,
};

const mdLines = [
  '# Track A Finish Loop',
  '',
  `Generated: ${generatedDate}`,
  '',
  `- Track A status: ${payload.status}`,
  `- Current family focus: ${currentFamily?.label || 'none'}`,
  `- Current blocker focus: ${currentBlocker?.blockerId || 'none'}`,
  `- Focus mode: ${payload.focusMode}`,
  `- Combined ready rows: ${payload.queueSummary.combinedReadyRows}`,
  `- Missing families: ${payload.queueSummary.missingFamilyCount}`,
  `- Current family ready rows: ${payload.queueSummary.currentFamilyReadyRows}`,
  `- Active blocker classes: ${(payload.activeBlockers || []).length}`,
  `- Top-level command: ${payload.topLevelCommand}`,
  '',
  '## Canonical Loop',
  '',
  ...payload.canonicalLoop.map((step, index) => `${index + 1}. ${step}`),
  '',
  '## Command Cadence',
  '',
  ...payload.commandCadence.map((command) => `- ${command}`),
  '',
  '## Family Queue',
  '',
];

if (payload.activeBlockers.length) {
  mdLines.push('## Active Blocker Classes');
  mdLines.push('');
  for (const blocker of payload.activeBlockers) {
    mdLines.push(`- ${blocker.id}: status=${blocker.status}`);
  }
  mdLines.push('');
}

for (const family of familyQueue) {
  mdLines.push(`- ${family.label}: status=${family.status}; readyCount=${family.readyCount}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  report: mdOutPath,
  json: jsonOutPath,
  currentFamily: currentFamily?.id || null,
  currentBlocker: currentBlocker?.blockerId || null,
  focusMode: trackA.focusMode || 'none',
  queueSize: familyQueue.length,
}, null, 2));
