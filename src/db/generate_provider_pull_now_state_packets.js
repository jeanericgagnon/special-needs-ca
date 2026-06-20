import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ALEFULL_REPO_ROOT || process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const packetsDir = path.join(docsDir, 'provider-pull-now-state-packets');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const indexJsonOutPath = path.join(docsDir, `provider-pull-now-state-packets-${generatedDate}.json`);
const indexMdOutPath = path.join(docsDir, `provider-pull-now-state-packets-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const reviewPacketPath = path.join(docsDir, `provider-pull-now-review-packet-${generatedDate}.json`);
const reviewPacket = readJson(reviewPacketPath);
const statePackets = Array.isArray(reviewPacket.statePackets) ? reviewPacket.statePackets : [];

fs.mkdirSync(packetsDir, { recursive: true });

const packetIndex = statePackets.map((packet) => {
  const baseName = `provider-pull-now-state-packet-${packet.stateId}-${generatedDate}`;
  const jsonPath = path.join(packetsDir, `${baseName}.json`);
  const mdPath = path.join(packetsDir, `${baseName}.md`);
  const payload = {
    generatedAt: new Date().toISOString(),
    generatedDate,
    sourceReviewPacketPath: path.relative(repoRoot, reviewPacketPath),
    stateId: packet.stateId,
    unresolvedRows: packet.unresolvedRows,
    byActionClass: packet.byActionClass,
    byDecisionHint: packet.byDecisionHint,
    topConcreteTargets: packet.topConcreteTargets,
    rows: packet.rows,
  };

  const mdLines = [
    `# Provider Pull-Now State Packet: ${packet.stateId}`,
    '',
    `Generated: ${payload.generatedAt}`,
    '',
    `- unresolved rows: ${packet.unresolvedRows}`,
    `- action classes: ${Object.keys(packet.byActionClass).join(', ') || 'none'}`,
    `- decision hints: ${Object.keys(packet.byDecisionHint).join(', ') || 'none'}`,
    '',
    '## Top Concrete Targets',
    '',
    ...((packet.topConcreteTargets || []).map((target) => `- ${target.sourceName}: ${target.sourceUrl}`)),
    '',
    '## Rows',
    '',
    ...((packet.rows || []).map((row) => `- ${row.actionClass} | hint=${row.decisionHint} | repeats=${row.repeatCount} | ${row.sourceUrl}`)),
  ];

  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  fs.writeFileSync(mdPath, `${mdLines.join('\n')}\n`);

  return {
    stateId: packet.stateId,
    unresolvedRows: packet.unresolvedRows,
    jsonPath: path.relative(repoRoot, jsonPath),
    markdownPath: path.relative(repoRoot, mdPath),
  };
});

const indexPayload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceReviewPacketPath: path.relative(repoRoot, reviewPacketPath),
  summary: {
    statePacketCount: packetIndex.length,
    totalUnresolvedRows: packetIndex.reduce((sum, packet) => sum + Number(packet.unresolvedRows || 0), 0),
    firstState: packetIndex[0]?.stateId || null,
  },
  packets: packetIndex,
};

const indexMdLines = [
  '# Provider Pull-Now State Packets',
  '',
  `Generated: ${indexPayload.generatedAt}`,
  '',
  `- state packet count: ${indexPayload.summary.statePacketCount}`,
  `- total unresolved rows: ${indexPayload.summary.totalUnresolvedRows}`,
  `- first state: ${indexPayload.summary.firstState || 'none'}`,
  '',
  '## Packets',
  '',
  ...packetIndex.map((packet) => `- ${packet.stateId}: rows=${packet.unresolvedRows}; json=${packet.jsonPath}`),
];

fs.writeFileSync(indexJsonOutPath, `${JSON.stringify(indexPayload, null, 2)}\n`);
fs.writeFileSync(indexMdOutPath, `${indexMdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: indexPayload.generatedAt,
  json: indexJsonOutPath,
  markdown: indexMdOutPath,
  statePacketCount: indexPayload.summary.statePacketCount,
}, null, 2));
