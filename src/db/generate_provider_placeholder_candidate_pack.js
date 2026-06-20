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
const jsonOutPath = path.join(docsDir, `provider-placeholder-candidate-pack-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-placeholder-candidate-pack-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJson(prefix) {
  const entries = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!entries.length) {
    throw new Error(`Missing generated artifact for prefix: ${prefix}`);
  }
  return path.join(docsDir, entries[entries.length - 1]);
}

function normalizeDomain(value) {
  return String(value || '').trim().replace(/^www\./, '').toLowerCase();
}

function normalizeUrl(value) {
  if (!value || !String(value).trim()) return '';
  try {
    const parsed = new URL(String(value).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString();
  } catch {
    return String(value).trim();
  }
}

const masterLedgerPath = latestGeneratedJson('master-source-target-ledger-');
const stateLedgerPath = latestGeneratedJson('provider-placeholder-state-ledger-');
const dbDiscoveredPath = latestGeneratedJson('db-discovered-source-targets-');
const masterLedger = readJson(masterLedgerPath);
const stateLedger = readJson(stateLedgerPath);
const dbDiscovered = readJson(dbDiscoveredPath);

const queuedStates = stateLedger.rows || [];
const ledgerRows = masterLedger.ledger || [];
const discoveredRows = dbDiscovered.actionableNewTargets || [];

function collectCandidatesForState(stateRow) {
  const placeholderDomains = new Set((stateRow.placeholderDomains || []).map((value) => normalizeDomain(value)));
  const placeholderUrls = new Set((stateRow.placeholderUrls || []).map((value) => normalizeUrl(value)));
  const deduped = new Map();

  const sources = [
    ...ledgerRows.map((row) => ({ ...row, sourceArtifact: 'master_source_target_ledger' })),
    ...discoveredRows.map((row) => ({ ...row, sourceArtifact: 'db_discovered_source_targets' })),
  ];

  for (const row of sources) {
    if (row.stateId !== stateRow.stateId) continue;
    if (row.gapFamily !== 'providers_care') continue;
    if (row.targetTable !== 'resource_providers') continue;
    if (row.ledgerStatus !== 'ready_lightweight' && row.ledgerStatus !== 'ready_js_heavy') continue;
    const rowDomain = normalizeDomain(row.domain);
    const sourceUrl = row.sourceUrl || row.source_url;
    const normalizedSourceUrl = normalizeUrl(sourceUrl);
    if (placeholderDomains.has(rowDomain)) continue;
    if (placeholderUrls.has(normalizedSourceUrl)) continue;

    const sourceFamily = String(row.sourceFamily || '');
    if (sourceFamily === 'provider_directory') continue;

    if (!sourceUrl) continue;

    const key = normalizedSourceUrl || String(sourceUrl).trim();
    if (deduped.has(key)) continue;

    deduped.set(key, {
      sourceName: row.sourceName || row.source_name,
      sourceUrl,
      domain: row.domain,
      crawlMethod: row.crawlMethod || row.crawl_method,
      organizationType: row.organizationType || row.organization_type || '',
      priority: row.priority,
      notes: row.notes || '',
      sourceArtifact: row.sourceArtifact,
    });
  }

  return [...deduped.values()]
    .sort((a, b) =>
      Number(b.priority || 0) - Number(a.priority || 0)
      || String(a.sourceUrl || '').localeCompare(String(b.sourceUrl || ''))
    );
}

const stateCandidates = queuedStates.map((stateRow) => {
  const candidates = collectCandidatesForState(stateRow).slice(0, 8);

  return {
    stateId: stateRow.stateId,
    status: stateRow.status,
    queueRows: stateRow.queueRows,
    placeholderDomains: stateRow.placeholderDomains || [],
    placeholderUrls: stateRow.placeholderUrls || [],
    suggestedReplacements: candidates.slice(0, 4),
    backupCandidates: candidates.slice(4),
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  inputs: {
    masterLedgerPath: path.relative(repoRoot, masterLedgerPath),
    stateLedgerPath: path.relative(repoRoot, stateLedgerPath),
    dbDiscoveredPath: path.relative(repoRoot, dbDiscoveredPath),
  },
  summary: {
    totalStates: stateCandidates.length,
    statesWithSuggestedReplacements: stateCandidates.filter((row) => row.suggestedReplacements.length > 0).length,
    nextState: stateLedger.summary?.nextState || '',
  },
  states: stateCandidates,
};

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);

const mdLines = [
  '# Provider Placeholder Candidate Pack',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  `- total states: ${payload.summary.totalStates}`,
  `- states with suggested replacements: ${payload.summary.statesWithSuggestedReplacements}`,
  `- next state: ${payload.summary.nextState || 'none'}`,
  '',
];

for (const state of payload.states) {
  mdLines.push(`## ${state.stateId}`, '');
  mdLines.push(`- status: ${state.status}`);
  mdLines.push(`- queue rows: ${state.queueRows}`);
  mdLines.push(`- placeholder domains: ${state.placeholderDomains.join(', ') || 'none'}`);
  mdLines.push('', 'Suggested replacements:', '');
  if (state.suggestedReplacements.length === 0) {
    mdLines.push('- none');
  } else {
    for (const candidate of state.suggestedReplacements) {
      mdLines.push(`- ${candidate.sourceName} | ${candidate.sourceUrl} | ${candidate.crawlMethod}`);
    }
  }
  mdLines.push('', 'Backup candidates:', '');
  if (state.backupCandidates.length === 0) {
    mdLines.push('- none');
  } else {
    for (const candidate of state.backupCandidates) {
      mdLines.push(`- ${candidate.sourceName} | ${candidate.sourceUrl} | ${candidate.crawlMethod}`);
    }
  }
  mdLines.push('');
}

fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  summary: payload.summary,
  artifacts: {
    json: jsonOutPath,
    md: mdOutPath,
  },
}, null, 2));
