import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const sourcePacksDir = path.join(repoRoot, 'data', 'source_packs');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const dataDir = path.join(repoRoot, 'data');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const repairPackPath = path.join(sourcePacksDir, 'official_state_domain_repairs.json');
const decisionFilePath = path.join(dataDir, 'official-domain-followup-decisions.json');
const jsonOutPath = path.join(docsDir, `official-domain-followup-queue-${generatedDate}.json`);
const csvOutPath = path.join(docsDir, `official-domain-followup-queue-${generatedDate}.csv`);
const mdOutPath = path.join(docsDir, `official-domain-followup-queue-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

function normalizeUrl(rawUrl) {
  if (!hasText(rawUrl)) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) {
      parsed.port = '';
    }
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function toCsv(rows, headers) {
  const escape = (value) => {
    const stringValue = String(value ?? '');
    if (/[",\n]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
    return stringValue;
  };

  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ].join('\n');
}

function classifyFollowup(row) {
  if (row.replacementMode === 'first_party_root_hint_only') {
    return {
      followupType: 'first_party_root_hint_verification',
      priority: 2,
      recommendedAction: 'Verify whether the first-party root hint safely resolves to the needed official local directory or intake page before any repair is applied.',
    };
  }

  if ((row.exactCandidateCount || 0) > 1) {
    return {
      followupType: 'multiple_medium_candidates_review',
      priority: 1,
      recommendedAction: 'Choose the single best official replacement URL among multiple medium-confidence candidates before applying any repair.',
    };
  }

  return {
    followupType: 'single_medium_candidate_apply_ready',
    priority: 1,
    recommendedAction: 'This row has a single medium-confidence candidate and can be repaired by the automated official-domain repair script.',
  };
}

function summarizeCandidates(row) {
  return (row.replacementCandidates || [])
    .map((candidate) => `${candidate.confidence}:${candidate.url}`)
    .join(' | ');
}

function liveSourceRowExists(row) {
  const stateId = String(row.stateId || '').trim().toLowerCase();
  if (!stateId) return false;

  const filePath = path.join(sourceTargetsDir, `${stateId}.json`);
  if (!fs.existsSync(filePath)) return false;

  const payload = readJson(filePath);
  const items = Array.isArray(payload) ? payload : payload.targets || [];
  const fakeSourceUrl = normalizeUrl(row.fakeSourceUrl);

  return items.some((item) =>
    (item.target_table || '') === row.targetTable &&
    (item.source_name || '') === row.sourceName &&
    normalizeUrl(item.source_url || '') === fakeSourceUrl
  );
}

function buildRowKey(row) {
  return [
    String(row.stateId || '').trim().toLowerCase(),
    String(row.targetTable || '').trim(),
    String(row.sourceName || '').trim(),
    normalizeUrl(row.fakeSourceUrl || ''),
  ].join('|');
}

const repairPack = readJson(repairPackPath);
const decisionFile = fs.existsSync(decisionFilePath) ? readJson(decisionFilePath) : { rows: [] };
const reviewedRowKeys = new Set(
  (decisionFile.rows || [])
    .filter((row) => hasText(row.decisionMode))
    .filter((row) => hasText(row.reviewedBy))
    .map((row) => buildRowKey(row))
);
const rows = (repairPack.rows || [])
  .filter((row) => row.replacementMode === 'first_party_root_hint_only' || (row.exactCandidateCount || 0) > 1)
  .filter((row) => liveSourceRowExists(row))
  .filter((row) => !reviewedRowKeys.has(buildRowKey(row)))
  .map((row) => {
    const followup = classifyFollowup(row);
    return {
      stateId: row.stateId,
      targetTable: row.targetTable,
      lane: row.lane,
      sourceName: row.sourceName,
      fakeSourceUrl: row.fakeSourceUrl,
      replacementMode: row.replacementMode,
      followupType: followup.followupType,
      priority: followup.priority,
      exactCandidateCount: row.exactCandidateCount || 0,
      firstPartyRootHintCount: row.firstPartyRootHintCount || 0,
      recommendedAction: followup.recommendedAction,
      candidateSummary: summarizeCandidates(row),
      desiredEvidence: row.desiredEvidence,
    };
  })
  .sort((a, b) =>
    Number(a.priority) - Number(b.priority) ||
    a.stateId.localeCompare(b.stateId) ||
    a.targetTable.localeCompare(b.targetTable)
  );

const summary = {
  totalRows: rows.length,
  byFollowupType: countBy(rows, 'followupType'),
  byState: countBy(rows, 'stateId'),
  byLane: countBy(rows, 'lane'),
};

const headers = [
  'stateId',
  'targetTable',
  'lane',
  'sourceName',
  'fakeSourceUrl',
  'replacementMode',
  'followupType',
  'priority',
  'exactCandidateCount',
  'firstPartyRootHintCount',
  'recommendedAction',
  'candidateSummary',
  'desiredEvidence',
];

const payload = {
  queueId: 'official_domain_followup_queue',
  generatedAt: generatedDate,
  sourcePack: path.relative(repoRoot, repairPackPath),
  decisionFile: path.relative(repoRoot, decisionFilePath),
  purpose: 'Compact review queue for semi-actionable official-domain repair rows that are not safe to auto-apply yet but are strong enough to justify targeted follow-up.',
  summary,
  rows,
};

const mdLines = [
  '# Official Domain Follow-Up Queue',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This queue captures the small set of official-domain repair rows that are stronger than pure backlog but still need a deterministic follow-up step before any automated repair is applied.',
  '',
  '## Summary',
  '',
  `- total follow-up rows: ${summary.totalRows}`,
  '',
  '## By Follow-Up Type',
  '',
];

for (const [type, count] of Object.entries(summary.byFollowupType).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${type}: ${count}`);
}

mdLines.push('', '## Rows', '');
for (const row of rows) {
  mdLines.push(`- ${row.stateId} | ${row.followupType} | ${row.lane} | ${row.fakeSourceUrl}`);
  mdLines.push(`  candidate summary: ${row.candidateSummary}`);
}

mdLines.push('', '## Files', '');
mdLines.push(`- JSON queue: ${path.relative(repoRoot, jsonOutPath)}`);
mdLines.push(`- CSV queue: ${path.relative(repoRoot, csvOutPath)}`);
mdLines.push(`- Source pack: ${path.relative(repoRoot, repairPackPath)}`);

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(csvOutPath, `${toCsv(rows, headers)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  queue: {
    json: jsonOutPath,
    csv: csvOutPath,
    md: mdOutPath,
  },
  summary,
}, null, 2));
