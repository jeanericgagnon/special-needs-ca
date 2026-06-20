import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const workfilesDir = path.join(repoRoot, 'data', 'provider-authoring-state-workfiles');

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

function normalizeUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function candidateIsReady(row) {
  return hasText(row?.sourceName)
    && hasText(row?.sourceUrl)
    && hasText(normalizeDomain(row?.domain, row?.sourceUrl))
    && hasText(row?.reviewedBy);
}

function stateNeedsApply(stateId, rows) {
  const sourceTargetsPath = path.join(repoRoot, 'data', 'source_targets', `${stateId}.json`);
  if (!fs.existsSync(sourceTargetsPath)) return true;
  const sourceTargets = readJson(sourceTargetsPath);
  const existingUrls = new Set(
    (Array.isArray(sourceTargets) ? sourceTargets : [])
      .map((row) => normalizeUrl(row?.source_url))
      .filter(Boolean),
  );
  return rows.some((row) => candidateIsReady(row) && !existingUrls.has(normalizeUrl(row.sourceUrl)));
}

function runApply(stateId) {
  const scriptPath = path.join(repoRoot, 'scripts', 'apply-provider-authoring-state-workfile.mjs');
  const result = spawnSync(process.execPath, [scriptPath, `--state=${stateId}`, '--apply'], {
    cwd: repoRoot,
    env: { ...process.env, ABLEFULL_REPO_ROOT: repoRoot },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Provider authoring apply failed for ${stateId}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  return JSON.parse(result.stdout.trim());
}

const workfileNames = fs.existsSync(workfilesDir)
  ? fs.readdirSync(workfilesDir).filter((name) => name.startsWith('provider-authoring-state-workfile-') && name.endsWith('.json')).sort()
  : [];

const readyStates = workfileNames.map((name) => {
  const filePath = path.join(workfilesDir, name);
  const payload = readJson(filePath);
  const rows = Array.isArray(payload?.candidateProviderTargets) ? payload.candidateProviderTargets : [];
  const readyCount = rows.filter(candidateIsReady).length;
  const unresolvedCount = rows.length - readyCount;
  return {
    stateId: String(payload?.stateId || '').trim().toLowerCase(),
    filePath,
    totalCandidates: rows.length,
    readyCount,
    unresolvedCount,
    needsApply: stateNeedsApply(String(payload?.stateId || '').trim().toLowerCase(), rows),
  };
}).filter((row) => row.stateId && row.totalCandidates > 0 && row.unresolvedCount === 0 && row.needsApply);

const applied = readyStates.map((row) => ({
  stateId: row.stateId,
  result: runApply(row.stateId),
}));

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  readyStateCount: readyStates.length,
  appliedStateCount: applied.length,
  applied: applied.map((row) => ({
    stateId: row.stateId,
    readyCandidates: row.result.readyCandidates,
    addedRows: row.result.addedRows,
    updatedRows: row.result.updatedRows,
  })),
}, null, 2));
