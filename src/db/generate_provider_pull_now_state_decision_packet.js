import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const statePacketsDir = path.join(docsDir, 'provider-pull-now-state-decision-packets');
const statePacketsIndexPath = path.join(docsDir, `provider-pull-now-state-packets-${generatedDate}.json`);
const decisionFilePath = path.join(repoRoot, 'data', 'provider-pull-now-decisions.json');

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

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeUrl(rawUrl) {
  if (!hasText(rawUrl)) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function deriveSuggestedDecisionMode(actionClass) {
  if (actionClass === 'bounded_retry_then_replace') return 'bounded_retry_once';
  return 'needs_manual_research';
}

function buildSuggestedReason(row) {
  if (row.actionClass === 'bounded_retry_then_replace') {
    return 'Retry-eligible row; allow one bounded retry only if no reviewed first-party replacement is available.';
  }
  if (row.sameDomainCandidateCount > 0) {
    return 'A same-domain candidate exists, but saved artifacts did not prove a safe, meaningfully different replacement URL.';
  }
  return 'Saved artifacts do not yet prove a safe first-party replacement; keep this in manual research until one is confirmed.';
}

const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(statePacketsIndexPath)) {
  throw new Error(`Missing provider state packets index: ${statePacketsIndexPath}`);
}
if (!fs.existsSync(decisionFilePath)) {
  throw new Error(`Missing provider pull-now decisions: ${decisionFilePath}`);
}

const statePacketsIndex = readJson(statePacketsIndexPath);
const decisionsPayload = readJson(decisionFilePath);
const decisionRows = Array.isArray(decisionsPayload?.rows) ? decisionsPayload.rows : [];
const packets = Array.isArray(statePacketsIndex?.packets) ? statePacketsIndex.packets : [];

const unresolvedStateCounts = new Map();
for (const row of decisionRows) {
  const stateId = String(row?.stateId || '').trim().toLowerCase();
  if (!stateId) continue;
  const resolved = hasText(row?.decisionMode) && hasText(row?.reviewedBy);
  if (resolved) continue;
  unresolvedStateCounts.set(stateId, (unresolvedStateCounts.get(stateId) || 0) + 1);
}

const targetPacketMeta = args.state
  ? packets.find((packet) => String(packet?.stateId || '').trim().toLowerCase() === args.state)
  : packets.find((packet) => (unresolvedStateCounts.get(String(packet?.stateId || '').trim().toLowerCase()) || 0) > 0) || packets[0];

if (!targetPacketMeta) {
  console.log(JSON.stringify({
    generatedAt: new Date().toISOString(),
    generatedDate,
    stateId: '',
    status: 'no_state_packet_available',
  }, null, 2));
  process.exit(0);
}

const packetPath = path.join(repoRoot, targetPacketMeta.jsonPath);
if (!fs.existsSync(packetPath)) {
  throw new Error(`Missing provider state packet: ${packetPath}`);
}

const packet = readJson(packetPath);
const stateId = String(packet?.stateId || targetPacketMeta.stateId || '').trim().toLowerCase();
const decisionRowsByKey = new Map(
  decisionRows
    .filter((row) => String(row?.stateId || '').trim().toLowerCase() === stateId)
    .map((row) => [`${stateId}__${normalizeUrl(row.sourceUrl)}`, row]),
);

const rows = (packet.rows || []).map((row) => {
  const rowKey = `${stateId}__${normalizeUrl(row.sourceUrl)}`;
  const decisionRow = decisionRowsByKey.get(rowKey) || null;
  return {
    stateId,
    actionClass: row.actionClass || '',
    followupReason: row.followupReason || '',
    sourceUrl: row.sourceUrl || '',
    hostname: row.hostname || '',
    repeatCount: row.repeatCount ?? 0,
    sameDomainCandidateCount: row.sameDomainCandidateCount ?? 0,
    sameDomainCandidates: row.sameDomainCandidates || [],
    topConcreteTargets: row.topConcreteTargets || packet.topConcreteTargets || [],
    currentDecision: decisionRow
      ? {
          decisionMode: decisionRow.decisionMode || '',
          reviewedSourceName: decisionRow.reviewedSourceName || '',
          reviewedSourceUrl: decisionRow.reviewedSourceUrl || '',
          retryNotes: decisionRow.retryNotes || '',
          reviewNotes: decisionRow.reviewNotes || '',
          reviewedBy: decisionRow.reviewedBy || '',
        }
      : null,
    suggestedDecisionMode: deriveSuggestedDecisionMode(row.actionClass || ''),
    suggestedReason: buildSuggestedReason(row),
  };
});

const unresolvedRows = rows.filter((row) => !(hasText(row.currentDecision?.decisionMode) && hasText(row.currentDecision?.reviewedBy)));
const jsonOutPath = path.join(statePacketsDir, `provider-pull-now-state-decision-packet-${stateId}-${generatedDate}.json`);
const mdOutPath = path.join(statePacketsDir, `provider-pull-now-state-decision-packet-${stateId}-${generatedDate}.md`);

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  stateId,
  sourceStatePacketPath: targetPacketMeta.jsonPath,
  sourceDecisionFilePath: path.relative(repoRoot, decisionFilePath),
  summary: {
    totalRows: rows.length,
    unresolvedRows: unresolvedRows.length,
    bySuggestedDecisionMode: unresolvedRows.reduce((acc, row) => {
      acc[row.suggestedDecisionMode] = (acc[row.suggestedDecisionMode] || 0) + 1;
      return acc;
    }, {}),
  },
  rows,
};

const mdLines = [
  '# Provider Pull-Now State Decision Packet',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  `State: ${stateId}`,
  `Source state packet: ${targetPacketMeta.jsonPath}`,
  `Decision file: ${path.relative(repoRoot, decisionFilePath)}`,
  '',
  '## Summary',
  '',
  `- total rows: ${payload.summary.totalRows}`,
  `- unresolved rows: ${payload.summary.unresolvedRows}`,
  ...Object.entries(payload.summary.bySuggestedDecisionMode).map(([mode, count]) => `- ${mode}: ${count}`),
  '',
  '## Rows',
  '',
];

for (const row of rows) {
  mdLines.push(`- ${row.sourceUrl}`);
  mdLines.push(`  suggested decision: ${row.suggestedDecisionMode}`);
  mdLines.push(`  reason: ${row.suggestedReason}`);
}

writeJson(jsonOutPath, payload);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  generatedDate,
  stateId,
  json: jsonOutPath,
  markdown: mdOutPath,
  summary: payload.summary,
}, null, 2));
