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
const jsonOutPath = path.join(docsDir, `track-a-blocker-coverage-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `track-a-blocker-coverage-audit-${generatedDate}.md`);

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

const completionPlanPath = latestGeneratedJson('source-acquisition-completion-plan-');
const maxInfoPath = latestGeneratedJson('max-info-program-');
const blockerRegistryPath = latestGeneratedJson('track-a-blocker-registry-');
const missingFamiliesPath = latestGeneratedJson('missing-source-families-');

const completionPlan = readJson(completionPlanPath);
const maxInfo = readJson(maxInfoPath);
const blockerRegistry = readJson(blockerRegistryPath);
const missingFamilies = readJson(missingFamiliesPath);

const blockerRegistryById = new Map((blockerRegistry.blockers || []).map((blocker) => [blocker.id, blocker]));
const maxInfoBlockers = maxInfo.tracks?.informationExhaustiveness?.blockers || [];

const blockerRows = maxInfoBlockers.map((blocker) => {
  const registry = blockerRegistryById.get(blocker.id);
  return {
    id: blocker.id,
    status: blocker.status,
    coveredByRegistry: Boolean(registry),
    artifactCount: Array.isArray(registry?.sourceArtifacts) ? registry.sourceArtifacts.length : 0,
    hasNextAction: Boolean(registry?.nextOperatorAction),
    hasEntryCommand: Boolean(registry?.entryCommand),
    hasAuditCommand: Boolean(registry?.auditCommand),
    hasCommands: Array.isArray(registry?.commands) && registry.commands.length > 0,
    hasMetrics: Boolean(registry?.metrics && Object.keys(registry.metrics).length > 0),
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    completionPlanPath: path.relative(repoRoot, completionPlanPath),
    maxInfoPath: path.relative(repoRoot, maxInfoPath),
    blockerRegistryPath: path.relative(repoRoot, blockerRegistryPath),
    missingFamiliesPath: path.relative(repoRoot, missingFamiliesPath),
  },
  summary: {
    missingSourceFamilyCount: Number(completionPlan.summary?.missingSourceFamilyCount || 0),
    stillNeedToAuthorCount: Array.isArray(completionPlan.stillNeedToAuthor) ? completionPlan.stillNeedToAuthor.length : 0,
    blockerCount: blockerRows.length,
    blockerRowsCoveredByRegistry: blockerRows.filter((row) => row.coveredByRegistry).length,
    blockerRowsWithCommands: blockerRows.filter((row) => row.hasEntryCommand && row.hasAuditCommand && row.hasCommands).length,
    unknownBlockerCount: blockerRows.filter((row) => !row.coveredByRegistry).length,
  },
  blockerRows,
};

const mdLines = [
  '# Track A Blocker Coverage Audit',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  'This audit verifies that the remaining Track A blockers are explicit, registry-backed, and resumable from disk.',
  '',
  '## Summary',
  '',
  `- missing source families: ${payload.summary.missingSourceFamilyCount}`,
  `- still need to author: ${payload.summary.stillNeedToAuthorCount}`,
  `- blocker count: ${payload.summary.blockerCount}`,
  `- blocker rows covered by registry: ${payload.summary.blockerRowsCoveredByRegistry}`,
  `- blocker rows with commands: ${payload.summary.blockerRowsWithCommands}`,
  `- unknown blocker count: ${payload.summary.unknownBlockerCount}`,
  '',
  '## Blockers',
  '',
];

for (const row of blockerRows) {
  mdLines.push(`- ${row.id}: covered=${row.coveredByRegistry ? 'yes' : 'no'}, artifacts=${row.artifactCount}, nextAction=${row.hasNextAction ? 'yes' : 'no'}, entryCommand=${row.hasEntryCommand ? 'yes' : 'no'}, auditCommand=${row.hasAuditCommand ? 'yes' : 'no'}, commands=${row.hasCommands ? 'yes' : 'no'}, metrics=${row.hasMetrics ? 'yes' : 'no'}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  summary: payload.summary,
}, null, 2));
