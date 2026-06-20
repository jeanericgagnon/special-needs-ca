import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const packetsDir = path.join(docsDir, 'provider-authoring-state-packets');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const stateDir = path.join(repoRoot, 'data', 'source-acquisition-state');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const indexJsonOutPath = path.join(docsDir, `provider-authoring-state-packets-${generatedDate}.json`);
const indexMdOutPath = path.join(docsDir, `provider-authoring-state-packets-${generatedDate}.md`);
const ledgerPath = path.join(stateDir, 'provider-authoring-ledger.json');

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

const backlogPath = latestGeneratedJson('provider-authoring-backlog-');
const backlog = readJson(backlogPath);
const rows = Array.isArray(backlog.rows) ? backlog.rows : [];
const ledger = fs.existsSync(ledgerPath) ? readJson(ledgerPath) : { rows: [] };
const ledgerByStateId = new Map((ledger.rows || []).map((row) => [String(row.stateId || '').trim().toLowerCase(), row]));

fs.mkdirSync(packetsDir, { recursive: true });

const packetIndex = rows.map((row) => {
  const stateTargetsPath = path.join(sourceTargetsDir, `${row.stateId}.json`);
  const sourceTargets = fs.existsSync(stateTargetsPath) ? readJson(stateTargetsPath) : [];
  const providerTargets = sourceTargets.filter((target) => target.target_table === 'resource_providers');
  const supportTargets = sourceTargets.filter((target) => target.target_table !== 'resource_providers');
  const baseName = `provider-authoring-state-packet-${row.stateId}-${generatedDate}`;
  const jsonPath = path.join(packetsDir, `${baseName}.json`);
  const mdPath = path.join(packetsDir, `${baseName}.md`);
  const payload = {
    generatedAt: new Date().toISOString(),
    generatedDate,
    sourceBacklogPath: path.relative(repoRoot, backlogPath),
    stateId: row.stateId,
    stateName: row.stateName,
    executionPriority: row.executionPriority,
    sourceTargetsPath: row.sourceTargetsPath,
    ledgerStatus: ledgerByStateId.get(row.stateId)?.status || '',
    ledgerNote: ledgerByStateId.get(row.stateId)?.note || '',
    publicSafeProviders: row.publicSafeProviders,
    totalProviderRows: row.totalProviderRows,
    providerTruthScore: row.providerTruthScore,
    concreteProviderTargetCount: row.concreteProviderTargetCount,
    placeholderProviderTargetCount: row.placeholderProviderTargetCount,
    directoryProviderTargetCount: row.directoryProviderTargetCount,
    neededConcreteTargets: row.neededConcreteTargets,
    neededLiveProviderRows: row.neededLiveProviderRows,
    authoringGapClass: row.authoringGapClass || '',
    nextAction: row.nextAction,
    providerTargets: providerTargets.map((target) => ({
      sourceName: target.source_name,
      sourceUrl: target.source_url,
      domain: target.domain,
      crawlMethod: target.crawl_method,
      organizationType: target.organization_type || '',
      notes: target.notes || '',
    })),
    supportTargets: supportTargets.map((target) => ({
      targetTable: target.target_table,
      sourceName: target.source_name,
      sourceUrl: target.source_url,
      domain: target.domain,
    })),
  };

  const mdLines = [
    `# Provider Authoring State Packet: ${row.stateName}`,
    '',
    `Generated: ${payload.generatedAt}`,
    '',
    `- execution priority: ${row.executionPriority}`,
    `- source targets path: ${row.sourceTargetsPath}`,
    `- provider rows: ${row.publicSafeProviders}/${row.totalProviderRows}`,
    `- concrete provider targets: ${row.concreteProviderTargetCount}`,
    `- needed concrete targets: ${row.neededConcreteTargets}`,
    `- needed live provider rows: ${row.neededLiveProviderRows ?? 0}`,
    `- authoring gap class: ${row.authoringGapClass || 'none'}`,
    `- next action: ${row.nextAction}`,
    '',
    '## Existing Provider Targets',
    '',
    ...(payload.providerTargets.length
      ? payload.providerTargets.map((target) => `- ${target.sourceName}: ${target.sourceUrl} (${target.domain})`)
      : ['- none']),
    '',
    '## Supporting Targets',
    '',
    ...(payload.supportTargets.length
      ? payload.supportTargets.map((target) => `- ${target.targetTable} | ${target.sourceName}: ${target.sourceUrl}`)
      : ['- none']),
  ];

  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  fs.writeFileSync(mdPath, `${mdLines.join('\n')}\n`);

  return {
    stateId: row.stateId,
    stateName: row.stateName,
    executionPriority: row.executionPriority,
    neededConcreteTargets: row.neededConcreteTargets,
    neededLiveProviderRows: row.neededLiveProviderRows,
    authoringGapClass: row.authoringGapClass || '',
    jsonPath: path.relative(repoRoot, jsonPath),
    markdownPath: path.relative(repoRoot, mdPath),
  };
});

const indexPayload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceBacklogPath: path.relative(repoRoot, backlogPath),
  summary: {
    statePacketCount: packetIndex.length,
    firstState: packetIndex[0]?.stateId || null,
  },
  packets: packetIndex,
};

const indexMdLines = [
  '# Provider Authoring State Packets',
  '',
  `Generated: ${indexPayload.generatedAt}`,
  '',
  `- state packet count: ${indexPayload.summary.statePacketCount}`,
  `- first state: ${indexPayload.summary.firstState || 'none'}`,
  '',
  '## Packets',
  '',
  ...packetIndex.slice(0, 25).map((packet) => `- P${packet.executionPriority} ${packet.stateId}: need=${packet.neededConcreteTargets}; json=${packet.jsonPath}`),
];

fs.writeFileSync(indexJsonOutPath, `${JSON.stringify(indexPayload, null, 2)}\n`);
fs.writeFileSync(indexMdOutPath, `${indexMdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: indexPayload.generatedAt,
  json: indexJsonOutPath,
  markdown: indexMdOutPath,
  statePacketCount: indexPayload.summary.statePacketCount,
}, null, 2));
